import { STUDY_TYPES } from '@/shared/constants/methodDefinitions'

/**
 * Detects what changed between two answer snapshots.
 * Returns an array of enriched change objects with multi-layer fields.
 *
 * Each change includes:
 *  - layer: 'technical' | 'methodological'
 *  - level: 'info' | 'warn'
 *  - source: 'firestore' | 'evaluator' | 'system'
 *  - message: human-readable description
 *  - traceId: e.g. 'H0-Q1' for heuristic index 0, question 1
 *
 * @param {Object|null} previous - The answer state BEFORE this save
 * @param {Object} current - The answer state AFTER this save
 * @param {string} studyType - One of STUDY_TYPES (HEURISTIC, USER, etc.)
 * @returns {Array<Object>} changes
 */
export function detectChanges(previous, current, studyType) {
  if (!previous) {
    return [{
      type: 'INITIAL_SAVE',
      layer: 'technical',
      level: 'info',
      source: 'firestore',
      message: 'First answer document created',
    }]
  }

  switch (studyType) {
    case STUDY_TYPES.HEURISTIC:
      return detectHeuristicChanges(previous, current)
    case STUDY_TYPES.USER:
      return detectUserTestChanges(previous, current)
    default:
      return [{
        type: 'UNKNOWN_CHANGE',
        layer: 'technical',
        level: 'info',
        source: 'system',
        message: `Change detected in ${studyType} study`,
        studyType,
      }]
  }
}

// ─── Heuristic ────────────────────────────────────────────────────────────────

function detectHeuristicChanges(prev, curr) {
  const changes = []

  // ── TECH layer: Submission ──
  if (!prev.submitted && curr.submitted) {
    changes.push({
      type: 'TEST_SUBMITTED',
      layer: 'technical',
      level: 'info',
      source: 'firestore',
      message: 'Heuristic evaluation submitted',
    })
    return changes
  }

  const prevGroups = prev.heuristicQuestions || []
  const currGroups = curr.heuristicQuestions || []

  // Track revision counts for METH layer
  let totalRevisions = 0

  currGroups.forEach((heuristic, hIdx) => {
    const prevHeuristic = prevGroups[hIdx]
    if (!prevHeuristic) return

    const hTitle = heuristic.heuristicTitle || `Heuristic ${hIdx + 1}`
    const prevQs = prevHeuristic.heuristicQuestions || []
    const currQs = heuristic.heuristicQuestions || []

    currQs.forEach((question, qIdx) => {
      const prevQ = prevQs[qIdx]
      if (!prevQ) return

      const traceId = `H${hIdx}-Q${qIdx}`

      // ── TECH layer: Answer value changed ──
      // Compare by .text only to avoid false positives from metadata differences.
      // Both empty strings are treated as identical — no empty→empty noise.
      const fromText = (prevQ.heuristicAnswer?.text || '').trim()
      const toText = (question.heuristicAnswer?.text || '').trim()

      if (fromText !== toText) {
        const displayFrom = fromText || '(empty)'
        const displayTo = toText || '(empty)'

        changes.push({
          type: 'ANSWER_CHANGED',
          layer: 'technical',
          level: 'info',
          source: 'firestore',
          traceId,
          message: `Answer changed: ${displayFrom} → ${displayTo} in "${hTitle}" Q${qIdx + 1}`,
          details: {
            heuristicIndex: hIdx,
            questionIndex: qIdx,
            heuristicTitle: hTitle,
            from: prevQ.heuristicAnswer ?? null,
            to: question.heuristicAnswer ?? null,
          },
        })
        totalRevisions++
      }

      // ── TECH layer: Comment changed ──
      // Use trimmed comparison to avoid logging whitespace-only differences.
      const prevComment = (prevQ.heuristicComment || '').trim()
      const currComment = (question.heuristicComment || '').trim()

      if (prevComment !== currComment) {
        const wasEmpty = prevComment === ''
        const verb = wasEmpty ? 'Added' : (currComment === '' ? 'Removed' : 'Updated')

        changes.push({
          type: 'COMMENT_CHANGED',
          layer: 'technical',
          level: 'info',
          source: 'firestore',
          traceId,
          message: `${verb} comment in "${hTitle}" Q${qIdx + 1}`,
          details: {
            heuristicIndex: hIdx,
            questionIndex: qIdx,
            heuristicTitle: hTitle,
          },
        })
      }

      // ── TECH layer: Image upload/remove ──
      if ((prevQ.answerImageUrl || '') !== (question.answerImageUrl || '')) {
        const isUpload = !!question.answerImageUrl
        changes.push({
          type: isUpload ? 'IMAGE_UPLOADED' : 'IMAGE_REMOVED',
          layer: 'technical',
          level: 'info',
          source: 'firestore',
          traceId,
          message: `Image ${isUpload ? 'uploaded' : 'removed'} in "${hTitle}" Q${qIdx + 1}`,
          details: {
            heuristicIndex: hIdx,
            questionIndex: qIdx,
            heuristicTitle: hTitle,
          },
        })
      }
    })

    // ── METH layer: Time tracking per heuristic ──
    const prevTime = prevHeuristic.timeSpent || '00:00'
    const currTime = heuristic.timeSpent || '00:00'
    if (prevTime !== currTime && currTime !== '00:00') {
      changes.push({
        type: 'TIME_TRACKING',
        layer: 'methodological',
        level: 'info',
        source: 'evaluator',
        traceId: `H${hIdx}`,
        message: `Time spent on "${hTitle}": ${prevTime} → ${currTime}`,
        details: {
          heuristicIndex: hIdx,
          heuristicTitle: hTitle,
          from: prevTime,
          to: currTime,
        },
      })
    }
  })

  // ── METH layer: High revision count warning ──
  if (totalRevisions >= 3) {
    changes.push({
      type: 'REVISION_PATTERN',
      layer: 'methodological',
      level: 'warn',
      source: 'system',
      message: `High revision activity: ${totalRevisions} answers changed in a single save — possible evaluator uncertainty`,
      details: { revisionCount: totalRevisions },
    })
  }

  return changes
}

// ─── User Test ────────────────────────────────────────────────────────────────

function detectUserTestChanges(prev, curr) {
  const changes = []

  // ── TECH: Submission ──
  if (!prev.submitted && curr.submitted) {
    changes.push({
      type: 'TEST_SUBMITTED',
      layer: 'technical',
      level: 'info',
      source: 'firestore',
      message: 'User test submitted',
    })
    return changes
  }

  // ── METH: Pre-test form ──
  if (!prev.preTestCompleted && curr.preTestCompleted) {
    changes.push({
      type: 'PRETEST_COMPLETED',
      layer: 'methodological',
      level: 'info',
      source: 'evaluator',
      message: 'Pre-test questionnaire completed',
    })
  }

  // ── METH: Consent ──
  if (!prev.consentCompleted && curr.consentCompleted) {
    changes.push({
      type: 'CONSENT_COMPLETED',
      layer: 'methodological',
      level: 'info',
      source: 'evaluator',
      message: 'Consent form acknowledged',
    })
  }

  // ── TECH: Task completions ──
  const prevTasks = prev.tasks || {}
  const currTasks = curr.tasks || {}

  Object.keys(currTasks).forEach((taskId) => {
    const prevTask = prevTasks[taskId] || {}
    const currTask = currTasks[taskId]

    if (!prevTask.completed && currTask.completed) {
      changes.push({
        type: 'TASK_COMPLETED',
        layer: 'technical',
        level: 'info',
        source: 'firestore',
        traceId: taskId,
        message: `Task "${taskId}" completed`,
        details: { taskId },
      })
    }
  })

  return changes
}
