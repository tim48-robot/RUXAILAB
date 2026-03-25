import Controller from '@/app/plugins/firebase/FirebaseFirestoreRepository'
import { serverTimestamp } from 'firebase/firestore'

const COLLECTION_BASE = 'tests'

/**
 * LogController — handles writing and reading audit logs.
 *
 * All log documents live at: tests/{testId}/logs/{logId}
 *
 * Extends FirebaseFirestoreRepository (same base class used by
 * StudyController, AnswerController, UserController, etc.)
 */
export default class LogController extends Controller {
  /**
   * Writes a log entry under tests/{testId}/logs.
   *
   * @param {string} testId - The study document ID
   * @param {Object} logEntry - The log payload
   * @returns {Promise<DocumentReference>}
   */
  async createLog(testId, logEntry) {
    const col = `${COLLECTION_BASE}/${testId}/logs`
    return super.create(col, {
      ...logEntry,
      timestamp: serverTimestamp(), // always use server time — no client clock skew
    })
  }

  /**
   * Reads all logs for a study.
   */
  async getAllLogs(testId) {
    const col = `${COLLECTION_BASE}/${testId}/logs`
    return super.readAll(col)
  }

  /**
   * Query logs with a single filter (e.g., by userId or action).
   *
   * @param {string} testId
   * @param {{ field: string, condition: string, value: any }} filter
   */
  async queryLogs(testId, filter) {
    const col = `${COLLECTION_BASE}/${testId}/logs`
    return super.query(col, filter)
  }

  /**
   * Query logs with multiple filters (e.g., by userId AND action).
   *
   * @param {string} testId
   * @param {Array<{ field: string, condition: string, value: any }>} conditions
   */
  async queryLogsFiltered(testId, conditions) {
    const col = `${COLLECTION_BASE}/${testId}/logs`
    return super.queryWithMultipleConditions(col, conditions)
  }
}
