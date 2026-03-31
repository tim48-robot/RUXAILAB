<template>
  <!-- Logs Module — Universal for ALL test types -->
  <div id="Logs View Content" class="logs-scope" style="min-height: 100vh; background-color: var(--bg); padding-top: 1px;">
    <v-container class="dashboard-container">

      <!-- Study Banner -->
      <div class="dashboard-header">
        <div class="header-content">
          <div class="header-icon-container">
            <span class="mdi mdi-text-search" style="color:#fff;font-size:28px"></span>
          </div>
          <div class="header-texts">
            <h1 class="dashboard-title">{{ studyTitle }}</h1>
            <p class="dashboard-subtitle">Unified Logging & Traceability</p>
            <div class="header-chips">
              <span class="study-chip">
                <span class="mdi mdi-clipboard-check-outline"></span>{{ studyType }}
              </span>
              <span class="study-chip">
                <span class="mdi mdi-text-box-outline"></span>{{ filteredLogs.length }} log entries
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <div class="sub-tabs">
        <button
          v-for="tab in tabs"
          :key="tab"
          @click="currentTab = tab"
          :class="['stab', { active: currentTab === tab }]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- ═══════════ TAB: Overview ═══════════ -->
      <div v-show="currentTab === 'Overview'">
        <!-- Stat Cards (Dark Mode Match) -->
        <div class="g g2" style="margin-bottom:24px">
          <div class="card stat-card stat-dark">
            <div class="sc-label" style="color:#94A3B8">Total Logs Today</div>
            <div class="sc-val" style="color:#fff">{{ fetchedLogs.length }}</div>
            <div class="sc-sub" style="color:#94A3B8">All recorded events</div>
            <div class="sc-icon-action"><span class="mdi mdi-text-box-outline"></span></div>
          </div>
          <div class="card stat-card stat-dark">
            <div class="sc-label" style="color:#94A3B8">Detected Anomalies</div>
            <div class="sc-val" style="color:#fff;display:flex;align-items:baseline;gap:8px">{{ warnCount }} <span style="font-size:14px;font-weight:400;color:#94A3B8">warnings</span></div>
            <div class="sc-sub" :style="warnCount > 0 ? 'color:#F59E0B' : 'color:#10B981'">{{ warnCount > 0 ? 'Needs review' : 'All clear' }}</div>
            <div class="sc-icon-action"><span class="mdi mdi-alert-circle-outline"></span></div>
          </div>
        </div>

        <!-- Layer Distribution -->
        <div class="g g12" style="margin-bottom:20px">
          <div class="card">
            <div class="card-hdr" style="margin-bottom:24px">
              <div class="card-t">Layer Distribution</div>
            </div>
            <div style="display:flex;flex-direction:column;gap:16px">
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px">
                  <span style="color:var(--tech);font-weight:500"><span class="mdi mdi-wrench-outline"></span> Technical</span>
                  <span style="font-weight:600">{{ techPercent }}%</span>
                </div>
                <div class="progress-track"><div :style="`width:${techPercent}%;height:100%;background:var(--tech);border-radius:3px`"></div></div>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px">
                  <span style="color:var(--meth);font-weight:500"><span class="mdi mdi-clipboard-outline"></span> Methodological</span>
                  <span style="font-weight:600">{{ methPercent }}%</span>
                </div>
                <div class="progress-track"><div :style="`width:${methPercent}%;height:100%;background:var(--meth);border-radius:3px`"></div></div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="card">
            <div class="card-hdr" style="margin-bottom:12px">
              <div class="card-t">Recent Activity</div>
              <button class="btn btn-out" style="font-size:11px;padding:4px 10px" @click="fetchLogs">Refresh</button>
            </div>
            <div v-if="fetchedLogs.length === 0" style="color:#90A4AE;font-size:13px;padding:20px;text-align:center">
              No log entries yet. Interact with the study to generate logs.
            </div>
            <div v-else style="display:flex;flex-direction:column;gap:8px">
              <div
                v-for="(log, i) in fetchedLogs.slice(0, 5)"
                :key="i"
                style="border:1px solid #ECEFF1;border-radius:10px;padding:10px 14px;display:flex;align-items:center;gap:10px"
              >
                <span :class="['b', log.layer === 'methodological' ? 'b-meth' : 'b-tech']" style="font-size:10px">
                  {{ log.layer === 'methodological' ? 'METH' : 'TECH' }}
                </span>
                <span style="font-size:13px;flex:1;color:#212121">{{ log.message || log.action }}</span>
                <span style="font-size:11px;color:#90A4AE">{{ formatTime(log) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ═══════════ TAB: Log Explorer ═══════════ -->
      <div v-show="currentTab === 'Log Explorer'">
        <!-- Filter Bar -->
        <div class="fbar fbar-quick" style="margin-bottom:8px">
          <span style="font-size:11px;font-weight:700;color:#94A3B8;margin-right:8px;text-transform:uppercase;letter-spacing:0.5px">Quick Filters:</span>
          <button class="chip chip-q-warn"><span class="mdi mdi-alert-outline"></span> Warnings &amp; Errors</button>
          <button v-if="['unmoderated', 'Unmoderated'].includes(test?.testType)" class="chip chip-q-task"><span class="mdi mdi-text-box-search-outline"></span> Task Anomalies</button>
          <button v-if="['moderated', 'Moderated'].includes(test?.testType)" class="chip chip-q-proto"><span class="mdi mdi-alert-circle-outline"></span> Protocol Deviations</button>
          <button v-if="['heuristic', 'Heuristic'].includes(test?.testType)" class="chip chip-q-crit"><span class="mdi mdi-lightning-bolt-outline"></span> Critical System Logs</button>
        </div>

        <div class="card" style="padding:16px 20px;margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px">
            <span style="font-size:12px;font-weight:600;color:#94A3B8;margin-right:4px">Layers:</span>
            <button class="chip-filter active-tech"><span class="mdi mdi-wrench"></span> Technical</button>
            <button class="chip-filter active-meth"><span class="mdi mdi-clipboard-outline"></span> Methodological</button>
            <button class="chip-filter active-ai"><span class="mdi mdi-robot-outline"></span> AI Decisions</button>
            <div class="sep" style="margin:0 4px"></div>
            <div class="date-input" style="padding:6px 12px;background:#fff">Severity: All</div>
            <div class="date-input" style="padding:6px 12px;background:#fff">Session: S-008</div>
            <div class="date-input" style="padding:6px 12px;background:#fff">Last 1 hour</div>
          </div>
          <div>
            <input type="text" placeholder="Search logs..." class="date-input" style="width:100%;background:#F8FAFC" />
          </div>
        </div>

        <!-- Log Entries Card -->
        <div class="card" style="padding:0;overflow:hidden">
          <div class="card-hdr" style="padding:24px 24px 16px 24px;margin:0">
            <div>
              <div class="card-t">Log Entries</div>
              <div class="card-s">{{ filteredLogs.length }} entries • All Sessions</div>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-out" style="padding:8px 16px;border-radius:8px;color:#334155"><span class="mdi mdi-download-outline"></span> Export</button>
              <button class="btn btn-out" style="padding:8px 12px;border-radius:8px;color:#334155" @click="fetchLogs"><span class="mdi mdi-refresh"></span></button>
            </div>
          </div>
          <!-- Loading -->
          <div v-if="logsLoading" style="padding:40px;text-align:center;color:#90A4AE">
            <v-progress-circular indeterminate color="#FCA326" size="32" />
            <div style="margin-top:8px;font-size:13px">Loading logs...</div>
          </div>
          <!-- Empty -->
          <div v-else-if="filteredLogs.length === 0" style="padding:40px;text-align:center;color:#90A4AE;font-size:13px">
            No log entries found. Interact with the study (e.g. answer questions) and refresh.
          </div>
          <!-- Table -->
          <div v-else style="max-height:400px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:#CBD5E1 transparent">
            <table class="dtbl" style="width:100%">
              <thead style="position:sticky;top:0;z-index:2;background:#fff">
                <tr>
                  <th style="width:110px">Time</th>
                  <th style="width:90px">Layer</th>
                  <th style="width:60px">Level</th>
                  <th style="width:90px">Source</th>
                  <th>Message</th>
                  <th style="width:70px">Trace</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(log, idx) in filteredLogs"
                  :key="idx"
                  :style="log.layer === 'methodological' ? 'background:#F8FFF8' : ''"
                >
                  <td class="lt">{{ formatTime(log) }}</td>
                  <td>
                    <span :class="['b', log.layer === 'methodological' ? 'b-meth' : 'b-tech']">
                      <span :class="['mdi', log.layer === 'methodological' ? 'mdi-clipboard-outline' : 'mdi-wrench-outline']"></span>
                      {{ log.layer === 'methodological' ? 'METH' : 'TECH' }}
                    </span>
                  </td>
                  <td>
                    <span :class="['b', log.level === 'warn' ? 'b-warn' : 'b-info']">
                      {{ log.level === 'warn' ? 'WARN' : 'INFO' }}
                    </span>
                  </td>
                  <td class="ls">{{ log.source || 'system' }}</td>
                  <td>{{ log.message || log.action }}</td>
                  <td>
                    <span v-if="log.traceId" class="ltr">{{ log.traceId }}</span>
                    <span v-else>—</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ═══════════ TAB: Export ═══════════ -->
      <div v-show="currentTab === 'Export'" style="display:flex;flex-direction:column;gap:16px;margin-bottom:32px">
        
        <!-- Export Scope -->
        <div class="card" style="margin-bottom:0">
          <div class="card-t" style="margin-bottom:8px">Export Scope</div>
          <div class="card-s" style="margin-bottom:16px">Selected scope: <span style="font-weight:500;color:#64748B">Full Study</span></div>
          
          <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:16px;margin-bottom:12px;">
            <div class="scope-btn scope-active">
              <span class="mdi mdi-folder-multiple-outline" style="font-size:20px"></span> Full Study
            </div>
            <div class="scope-btn">
              <span class="mdi mdi-monitor-dashboard" style="font-size:20px;color:#94A3B8"></span> Session <span class="mdi mdi-menu-down" style="color:#94A3B8"></span>
            </div>
            <div class="scope-btn">
              <span class="mdi mdi-source-branch" style="font-size:20px;color:#94A3B8"></span> Trace <span class="mdi mdi-menu-down" style="color:#94A3B8"></span>
            </div>
          </div>
          <div class="card-s" style="color:#94A3B8">Exports all available sessions and traces in this study.</div>
        </div>

        <div class="g g-export" style="gap:16px;align-items:stretch">
          <!-- Export Settings -->
          <div class="card" style="display:flex;flex-direction:column;gap:24px;margin-bottom:0">
            <div class="card-t">Export Settings</div>

            <div>
              <div class="section-label">FORMAT</div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button :class="['chip-format', { 'active': exportFormat === 'json' }]" @click="exportFormat = 'json'">{{ exportFormat === 'json' ? '● JSON' : 'JSON' }}</button>
                <button :class="['chip-format', { 'active': exportFormat === 'csv' }]" @click="exportFormat = 'csv'">{{ exportFormat === 'csv' ? '● CSV' : 'CSV' }}</button>
              </div>
            </div>

            <div>
              <div class="section-label">LOG LAYERS TO INCLUDE</div>
              <div style="display:flex;flex-direction:column;gap:10px;align-items:flex-start">
                <span class="layer-pill active-tech">✓ TECHNICAL</span>
                <span class="layer-pill active-meth">✓ METHODOLOGICAL</span>
                <span class="layer-pill active-ai">✓ AI DECISIONS</span>
              </div>
            </div>

            <div>
              <div class="section-label">DATE RANGE</div>
              <div style="display:flex;align-items:center;gap:8px">
                <div class="date-input">From: Mar 1</div>
                <span style="font-size:12px;color:#94A3B8">to</span>
                <div class="date-input">To: Today</div>
              </div>
            </div>
          </div>

          <!-- Preview -->
          <div class="card" style="display:flex;flex-direction:column;margin-bottom:0;height:100%">
            <div class="card-hdr" style="margin-bottom:8px">
              <div class="card-t" style="color:#0F172A">Export Preview</div>
              <span class="b b-ok" style="font-size:10px;padding:4px 10px;border-radius:12px"><span class="mdi mdi-shield-check-outline" style="margin-right:4px"></span> ANONYMIZED</span>
            </div>
            <div class="card-s" style="margin-bottom:16px">First 3 entries after anonymization</div>
            <div class="prv-dark" style="flex:1">
<span class="s">[</span> { <span class="k">"layer"</span>: <span class="s">"technical"</span>, <span class="k">"timestamp"</span>: <span class="s">"10:23:01"</span>, <span class="k">"source"</span>: <span class="s">"firestore"</span>,
  <span class="k">"message"</span>: <span class="s">"Write: sessions/[HASH]/tasks"</span> }, { <span class="k">"layer"</span>: <span class="s">"ai_decision"</span>,
  <span class="k">"model"</span>: <span class="s">"gaze-v2.1"</span>, <span class="k">"confidence"</span>: <span class="num">0.91</span>, <span class="k">"participant"</span>: <span class="s">"P-004"</span> } <span class="s">]</span>
            </div>
            <div style="display:flex;gap:24px;margin-top:16px;font-size:12px;color:#64748B">
              <span>Entries: <b style="color:#1E293B">2,847</b></span>
              <span>Size: <b style="color:#1E293B">2.3 MB</b></span>
              <span>Participants: <b style="color:#1E293B">8</b></span>
            </div>
          </div>
        </div>

        <!-- Privacy & Anonymization -->
        <div class="card" style="margin-bottom:0">
          <div class="card-hdr" style="margin-bottom:24px">
            <div class="card-t" style="font-size:16px">Privacy &amp; Anonymization</div>
            <div style="font-size:12px;color:#94A3B8">Applied before export - required for ethical research</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;column-gap:60px;row-gap:24px">
            <div class="trow-clean">
              <div><div class="sw-title">Replace participant names</div><div class="sw-sub">Names replaced with P-001, P-002...</div></div>
              <div class="tsw-orange on"></div>
            </div>
            <div class="trow-clean">
              <div><div class="sw-title">Hash session IDs</div><div class="sw-sub">Irreversible sha256 hashing</div></div>
              <div class="tsw-orange on"></div>
            </div>
            <div class="trow-clean">
              <div><div class="sw-title">Redact PII from text answers</div><div class="sw-sub">Auto-detect names, emails in open-ended responses</div></div>
              <div class="tsw-orange on"></div>
            </div>
            <div class="trow-clean">
              <div><div class="sw-title">Exclude background questionnaire</div><div class="sw-sub">Remove age, gender, experience data</div></div>
              <div class="tsw-orange"></div>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:32px;gap:12px">
            <button class="btn btn-out" style="padding:10px 16px;font-size:13px;border-radius:8px">
              <span class="mdi mdi-content-save-outline" style="font-size:16px;margin-right:4px"></span> Save Settings
            </button>
            <button class="btn btn-orange" style="padding:10px 24px;font-size:13px;border-radius:8px" @click="exportLogs">
              <span class="mdi mdi-download-outline" style="font-size:16px;margin-right:4px"></span> Export 2,847 Entries (2.3 MB)
            </button>
          </div>
        </div>
      </div>

    </v-container>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import LogController from '@/shared/controllers/LogController'

const store = useStore()
const logController = new LogController()

// State
const currentTab = ref('Log Explorer')
const tabs = ['Overview', 'Log Explorer', 'Export']
const logsLoading = ref(false)
const fetchedLogs = ref([])
const logFilter = ref('all')
const exportFormat = ref('json')

// Computed
const test = computed(() => store.getters.test)
const studyTitle = computed(() => test.value?.testTitle || 'Study Logs')
const studyType = computed(() => test.value?.testType || 'Unknown')

const filteredLogs = computed(() => {
  if (logFilter.value === 'all') return fetchedLogs.value
  return fetchedLogs.value.filter(log => log.layer === logFilter.value)
})

const warnCount = computed(() => fetchedLogs.value.filter(l => l.level === 'warn').length)
const techCount = computed(() => fetchedLogs.value.filter(l => l.layer !== 'methodological').length)
const methCount = computed(() => fetchedLogs.value.filter(l => l.layer === 'methodological').length)
const techPercent = computed(() => {
  const total = fetchedLogs.value.length
  return total > 0 ? Math.round((techCount.value / total) * 100) : 0
})
const methPercent = computed(() => {
  const total = fetchedLogs.value.length
  return total > 0 ? Math.round((methCount.value / total) * 100) : 0
})

// Methods
const formatTime = (log) => {
  if (log.timestamp?.toDate) return log.timestamp.toDate().toLocaleString()
  return log.timestamp || '-'
}

const fetchLogs = async () => {
  const testId = test.value?.id
  if (!testId) return
  logsLoading.value = true
  try {
    const logs = await logController.getAllLogs(testId)
    fetchedLogs.value = (logs || []).sort((a, b) => {
      const ta = a.timestamp?.toDate?.() || new Date(0)
      const tb = b.timestamp?.toDate?.() || new Date(0)
      return tb - ta
    })
  } catch (e) {
    console.error('[LogsView] Failed to fetch logs:', e)
  } finally {
    logsLoading.value = false
  }
}

const exportLogs = () => {
  const data = filteredLogs.value.map(log => ({
    layer: log.layer || 'technical',
    level: log.level || 'info',
    source: log.source || 'system',
    action: log.action,
    message: log.message,
    traceId: log.traceId || null,
    userId: '[HASH]', // anonymized
    timestamp: log.timestamp?.toDate?.()?.toISOString() || null,
  }))

  const blob = exportFormat.value === 'json'
    ? new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    : new Blob([jsonToCsv(data)], { type: 'text/csv' })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `logs-${test.value?.id || 'export'}.${exportFormat.value}`
  a.click()
  URL.revokeObjectURL(url)
}

const jsonToCsv = (data) => {
  if (!data.length) return ''
  const headers = Object.keys(data[0])
  const rows = data.map(row => headers.map(h => JSON.stringify(row[h] ?? '')).join(','))
  return [headers.join(','), ...rows].join('\n')
}

onMounted(() => {
  fetchLogs()
})
</script>

<style>
/* Global overrides to make Vuetify elements render in static flow */
.logs-scope .v-container { max-width: none !important; }
.logs-scope { width: 100%; }
</style>

<style scoped>
.logs-scope {
  --primary:    #00213F;
  --secondary:  #FF425A;
  --active:     #fca326;
  --inactive:   #bababa;
  --bg:         #e8eaf2;
  --white:      #FFFFFF;
  --border:     rgba(0,0,0,0.06);
  --shadow:     0 2px 8px rgba(0,0,0,0.08);
  --shadow-lg:  0 8px 32px rgba(0,0,0,0.15);

  --tech:       #1565C0;
  --tech-bg:    #E3F2FD;
  --meth:       #2E7D32;
  --meth-bg:    #E8F5E9;
  --ai:         #6A1B9A;
  --ai-bg:      #F3E5F5;

  --ok:         #2E7D32;
  --ok-bg:      #E8F5E9;
  --warn:       #E65100;
  --warn-bg:    #FFF3E0;
  --err:        #C62828;
  --err-bg:     #FFEBEE;
  --info:       #1565C0;
  --info-bg:    #E3F2FD;

  --radius:     12px;
  --tr:         0.2s ease;

  font-family: 'Roboto', 'Helvetica Neue', Arial, sans-serif;
  color: #212121;
}
.logs-scope * { box-sizing: border-box; }

.dashboard-container {
  width: 85%;
  margin: 0 auto;
  max-width: 1400px;
  padding: 32px 24px;
}

/* ── Banner ── */
.dashboard-header {
  border-radius: 20px;
  padding: 32px 28px;
  color: white;
  box-shadow: 0 8px 32px rgba(0,0,0,0.15);
  position: relative;
  overflow: hidden;
  min-height: 220px;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, #00213F 0%, #FF425A 100%);
  margin-bottom: 32px;
  transition: all 0.3s ease;
}
.dashboard-header:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(219,69,67,.2);
}
.dashboard-header::before {
  content: '';
  position: absolute; top:0; left:0; right:0; bottom:0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
  opacity: .1;
  pointer-events: none;
}
.header-content { position: relative; z-index: 1; display: flex; align-items: center; gap: 16px; }
.header-icon-container {
  background: rgba(255,255,255,.2);
  border-radius: 16px;
  padding: 12px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0,0,0,.1);
  flex-shrink: 0;
}
.header-icon-container .mdi { font-size: 28px; }
.header-texts { flex: 1; }
.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 8px;
  text-shadow: 0 2px 4px rgba(0,0,0,.1);
  text-transform: uppercase;
}
.dashboard-subtitle {
  font-size: 1.1rem;
  opacity: .9;
  margin-bottom: 14px;
}
.header-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.study-chip {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 10px;
  font-size: 13px; font-weight: 600;
  background: rgba(255,255,255,.2);
  border: 1px solid rgba(255,255,255,.3);
  color: #fff; backdrop-filter: blur(10px);
}

/* ── Tabs (pill-container style) ── */
.sub-tabs {
  display: flex; gap: 2px;
  background: #fff;
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 24px;
  box-shadow: var(--shadow);
}
.stab {
  padding: 8px 18px; border-radius: 7px;
  font-size: 13px; font-weight: 500;
  color: #546E7A;
  border: none; background: none;
  font-family: inherit; cursor: pointer;
  transition: all var(--tr);
}
.stab:hover { color: #00213F; background: rgba(0,0,0,.04); }
.stab.active {
  background: var(--primary);
  color: #fff;
  box-shadow: 0 2px 8px rgba(0,0,0,.15);
}

/* ── Cards ── */
.card {
  background: #fff; border-radius: 16px; padding: 24px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.03); margin-bottom: 14px;
  border: 1px solid rgba(0,0,0,.02);
  transition: box-shadow var(--tr);
}
.card-hdr { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.card-t { font-size: 15px; font-weight: 700; color: #00213F; }
.card-s { font-size: 12px; color: #90A4AE; }
.section-label { font-size: 11px; font-weight: 600; color: #90A4AE; text-transform: uppercase; letter-spacing: .5px; margin-bottom: 8px; }

/* ── Stat Cards ── */
.stat-card { position: relative; overflow: hidden; border:none; }
.stat-dark { background: #00213F; color: #fff; border-radius:16px; box-shadow:0 8px 32px rgba(0,33,63,.15); }
.sc-label { font-size: 13px; font-weight: 500; margin-bottom: 8px; }
.sc-val { font-size: 36px; font-weight: 700; margin-bottom: 8px; font-family:-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
.sc-sub { font-size: 13px; }
.sc-icon-action { position: absolute; bottom: 20px; right: 20px; width:36px; height:36px; background:rgba(255,255,255,.1); border-radius:8px; display:flex; align-items:center; justify-content:center; color:#fff; font-size:20px; cursor:pointer; transition:all 0.2s; }
.sc-icon-action:hover { background:rgba(255,255,255,.2); }

/* ── Grid ── */
.g { display: grid; gap: 14px; }
.g2 { grid-template-columns: 1fr 1fr; }
.g12 { grid-template-columns: 1fr 1fr; }
.g3 { grid-template-columns: 1fr 1fr 1fr; }
.g-export { grid-template-columns: 280px 1fr; }

/* ── Export Controls ── */
.scope-btn { display:flex; align-items:center; justify-content:center; gap:8px; padding:16px; border-radius:8px; border:1px solid #E2E8F0; background:#fff; font-size:14px; font-weight:600; color:#334155; cursor:pointer; transition:all 0.2s; }
.scope-btn:hover { background:#F8FAFC; }
.scope-btn.scope-active { background:#F1F5F9; border-color:#0F172A; color:#0F172A; }

.chip-format { padding:8px 16px; border-radius:24px; border:1px solid #E2E8F0; background:#fff; font-size:12px; font-weight:600; color:#64748B; cursor:pointer; }
.chip-format.active { background:#F1F5F9; border-color:#0F172A; color:#0F172A; }

.layer-pill { display:inline-block; padding:6px 14px; border-radius:20px; font-size:11px; font-weight:700; border:1px solid transparent; letter-spacing:0.5px; }
.layer-pill.active-tech { background:#E0F2FE; color:#0369A1; border-color:rgba(3,105,161,.2); }
.layer-pill.active-meth { background:#DCFCE7; color:#15803D; border-color:rgba(21,128,61,.2); }
.layer-pill.active-ai { background:#F3E8FF; color:#7E22CE; border-color:rgba(126,34,206,.2); }

.date-input { padding:8px 12px; border-radius:6px; border:1px solid #E2E8F0; background:#F8FAFC; font-size:13px; color:#334155; }

.prv-dark { font-family:'Fira Code', 'Courier New', monospace; font-size:12px; line-height:1.6; background:#1E293B; color:#E2E8F0; border-radius:12px; padding:24px; overflow-x:auto; white-space:pre-wrap; }
.prv-dark .k { color:#4ADE80; font-weight:500; }
.prv-dark .s { color:#38BDF8; }
.prv-dark .num { color:#F472B6; }

.tsw-orange { width:40px; height:24px; border-radius:12px; background:#CBD5E1; position:relative; cursor:pointer; transition:background var(--tr); flex-shrink:0; }
.tsw-orange::after { content:''; position:absolute; top:3px; left:3px; width:18px; height:18px; border-radius:50%; background:#fff; transition:transform var(--tr); box-shadow:0 1px 3px rgba(0,0,0,.15); }
.tsw-orange.on { background:#F59E0B; }
.tsw-orange.on::after { transform:translateX(16px); }

.trow-clean { display:flex; justify-content:space-between; align-items:center; }
.sw-title { font-size:14px; font-weight:600; color:#1E293B; margin-bottom:2px; }
.sw-sub { font-size:12px; color:#94A3B8; }

/* ── Filter Bar ── */
.fbar { display: flex; align-items: center; padding: 10px 14px; background: transparent; border:none; margin-bottom: 14px; flex-wrap: wrap; }
.fbar-quick { background: #F1F5F9; border-radius: 12px; padding: 12px 20px; }
.chip { font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 20px; cursor: pointer; display: flex; align-items: center; gap: 6px; border:1px solid transparent; background:#fff; }
.chip-q-warn { background:#FEF2F2; color:#DC2626; border-color:rgba(220,38,38,.2); }
.chip-q-task { background:#FDF2F8; color:#DB2777; border-color:rgba(219,39,119,.2); }
.chip-q-proto { background:#FFFBEB; color:#D97706; border-color:rgba(217,119,6,.2); }
.chip-q-crit { background:#FFF1F2; color:#E11D48; border-color:rgba(225,29,72,.2); }

.chip-filter { font-size: 12px; font-weight: 600; padding: 6px 14px; border-radius: 20px; cursor: pointer; display: flex; align-items: center; gap: 6px; border:1px solid transparent; background:#fff; }
.chip-filter.active-tech { background:#F0F9FF; color:#0284C7; border-color:#0284C7; }
.chip-filter.active-meth { background:#F0FDF4; color:#16A34A; border-color:#16A34A; }
.chip-filter.active-ai { background:#FAF5FF; color:#9333EA; border-color:#9333EA; }
.sep { width: 1px; height: 20px; background: #E2E8F0; }

/* ── Buttons ── */
.btn { font-size: 13px; font-weight: 500; padding: 6px 14px; border-radius: 8px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all var(--tr); font-family: inherit; }
.btn-out { background: #fff; border: 1px solid #E0E0E0; color: #546E7A; }
.btn-out:hover { background: #F5F5F5; }
.btn-orange { background: #fca326; color: #fff; font-weight: 600; }
.btn-orange:hover { background: #e89520; }

/* ── Log Table ── */
.dtbl { width: 100%; border-collapse: collapse; font-size: 13px; }
.dtbl thead th { text-align: left; font-size: 11px; font-weight: 600; color: #90A4AE; text-transform: uppercase; letter-spacing: .5px; padding: 10px 12px; border-bottom: 2px solid #F5F5F5; }
.dtbl tbody td { padding: 10px 12px; border-bottom: 1px solid #F5F5F5; vertical-align: middle; }
.dtbl tbody tr:hover { background: #FAFAFA; }
.lt { font-family: monospace; font-size: 11px; color: #90A4AE; }
.ls { font-size: 12px; color: #607D8B; }

/* ── Badges ── */
.b { font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px; text-transform: uppercase; }
.b-tech { color: var(--tech); background: var(--tech-bg); }
.b-meth { color: var(--meth); background: var(--meth-bg); }
.b-ai { color: var(--ai); background: var(--ai-bg); }
.b-info { color: var(--info); background: var(--info-bg); }
.b-warn { color: var(--warn); background: var(--warn-bg); }
.b-err { color: var(--err); background: var(--err-bg); }
.b-ok { color: #16A34A; background: #DCFCE7; border: 1px solid #BBF7D0; }
.ltr { font-size: 10px; font-weight: 600; color: #fca326; background: rgba(252,163,38,.08); padding: 2px 6px; border-radius: 3px; }

/* ── Progress ── */
.progress-track { height: 6px; background: #F5F5F5; border-radius: 3px; }

/* ── Toggle Switches ── */
.trow { padding: 10px 8px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.tsw { width: 36px; height: 20px; border-radius: 10px; background: #E0E0E0; position: relative; cursor: pointer; transition: background var(--tr); flex-shrink: 0; }
.tsw::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; border-radius: 50%; background: #fff; transition: transform var(--tr); box-shadow: 0 1px 3px rgba(0,0,0,.2); }
.tsw.on { background: var(--ok); }
.tsw.on::after { transform: translateX(16px); }

/* ── Code Preview ── */
.prv { font-family: 'Fira Code', 'Courier New', monospace; font-size: 12px; line-height: 1.6; background: #F8F9FA; border: 1px solid #E3E8F0; border-radius: 8px; padding: 14px; overflow-x: auto; white-space: pre; }
.prv .k { color: #1565C0; }
.prv .s { color: #2E7D32; }
.prv .n { color: #E65100; }

@media (max-width: 960px) {
  .g2, .g12, .g3 { grid-template-columns: 1fr; }
  .dashboard-container { width: 95%; }
  .dashboard-title { font-size: 1.8rem; }
}
</style>

