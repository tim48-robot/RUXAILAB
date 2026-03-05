<template>
  <v-container class="dashboard-container">
    <!-- Logs App --><div class="mockup-scope">
      <!-- Study Banner -->
      <!-- Study Banner --><div class="dashboard-header">
        <!-- Banner Inner --><div class="header-content">
          <!-- Banner Icon Container --><div class="header-icon-container">
            <!-- Banner Icon --><span class="mdi mdi-chart-box-outline" style="color:#fff;font-size:28px"></span>
          </div>
          <!-- Banner Text --><div class="header-texts">
            <!-- Study Title --><h1 class="dashboard-title">Mobile App Redesign Evaluation</h1>
            <!-- Study Description --><p class="dashboard-subtitle">Usability test for the new checkout flow redesign</p>
            <!-- Status Badges --><div class="header-chips">
              <!-- Moderated Badge --><span class="study-chip"><!-- Icon --><span class="mdi mdi-account-check-outline"></span>Moderated Study</span>
              <!-- Active Badge --><span class="study-chip"><!-- Dot --><span class="mdi mdi-circle-small"></span>Active</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab Navigation -->
      <!-- Tab Navigation --><div class="sub-tabs">
        <button 
          v-for="tab in tabs" 
          :key="tab"
          @click="currentTab = tab"
          :class="['stab', { active: currentTab === tab }]"
        >
          {{ tab }}
        </button>
      </div>

      <!-- TAB: Overview -->
      <!-- Overview Content -->
      <div v-show="currentTab === 'Overview'">
        <div class="g g2" style="margin-bottom:20px">
          <!-- Total Logs Card -->
          <!-- Stat Card --><div class="stat-card">
            <!-- Card Label --><div class="sc-label">Total Logs Today</div>
            <!-- Card Value --><div class="sc-val">12,847</div>
            <!-- Card Subtitle --><div class="sc-sub">+18% vs yesterday</div>
            <!-- Card Icon --><div class="sc-icon"><!-- Icon --><span class="mdi mdi-text-box-outline"></span></div>
          </div>
          <!-- Anomalies Card -->
          <!-- Stat Card --><div class="stat-card">
            <!-- Card Label --><div class="sc-label">Detected Anomalies</div>
            <!-- Card Value --><div class="sc-val">14 <!-- Suffix --><span style="font-size:14px;font-weight:400;opacity:.7">warnings</span></div>
            <!-- Card Subtitle --><div class="sc-sub" style="color:#fca326">Needs review</div>
            <!-- Card Icon --><div class="sc-icon"><!-- Icon --><span class="mdi mdi-alert-circle-outline"></span></div>
          </div>
        </div>

        <div class="g g12" style="margin-bottom:20px">
          <!-- Layer Distribution -->
          <!-- Card --><div class="card">
            <!-- Card Header --><div class="card-hdr" style="margin-bottom:24px">
              <!-- Card Title --><div class="card-t">Layer Distribution</div>
              <!-- More Options --><span class="mdi mdi-dots-horizontal" style="color:#90A4AE"></span>
            </div>
            <!-- Layer List --><div style="display:flex;flex-direction:column;gap:16px">
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px">
                  <span style="color:var(--tech);font-weight:500"><span class="mdi mdi-wrench-outline"></span> Technical</span>
                  <span style="font-weight:600">62%</span>
                </div>
                <div style="height:6px;background:#F5F5F5;border-radius:3px"><div style="width:62%;height:100%;background:var(--tech);border-radius:3px"></div></div>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px">
                  <span style="color:var(--meth);font-weight:500"><span class="mdi mdi-clipboard-outline"></span> Methodological</span>
                  <span style="font-weight:600">28%</span>
                </div>
                <div style="height:6px;background:#F5F5F5;border-radius:3px"><div style="width:28%;height:100%;background:var(--meth);border-radius:3px"></div></div>
              </div>
              <div>
                <div style="display:flex;justify-content:space-between;margin-bottom:6px;font-size:12px">
                  <span style="color:var(--ai);font-weight:500"><span class="mdi mdi-robot-outline"></span> AI Decisions</span>
                  <span style="font-weight:600">10%</span>
                </div>
                <div style="height:6px;background:#F5F5F5;border-radius:3px"><div style="width:10%;height:100%;background:var(--ai);border-radius:3px"></div></div>
              </div>
            </div>
          </div>

          <!-- Active Sessions -->
          <!-- Card --><div class="card">
            <!-- Card Header --><div class="card-hdr" style="margin-bottom:12px">
              <div><!-- Card Title --><div class="card-t">Active Sessions</div><!-- Card Subtitle --><div class="card-s">2 sessions currently running</div></div>
              <!-- View All Button --><button class="btn btn-out" style="font-size:11px;padding:4px 10px">View all</button>
            </div>
            <div style="display:flex;flex-direction:column;gap:8px">
              <div style="border:1px solid #ECEFF1;border-radius:10px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between">
                <div><div style="font-weight:600;font-size:13px;margin-bottom:2px">Session S-008</div><div style="font-size:11px;color:#90A4AE">Participant: P-004 · Running for 14m</div></div>
                <div style="display:flex;gap:8px;align-items:center">
                  <span class="b" style="background:rgba(252,163,38,.15);color:#fca326;border:none"><span class="dot" style="background:#fca326;margin-right:4px"></span> Live</span>
                  <button class="btn btn-primary" style="padding:4px 12px;font-size:11px">Join</button>
                </div>
              </div>
              <div style="border:1px solid #ECEFF1;border-radius:10px;padding:12px 14px;display:flex;align-items:center;justify-content:space-between">
                <div><div style="font-weight:600;font-size:13px;margin-bottom:2px">Session S-009</div><div style="font-size:11px;color:#90A4AE">Participant: P-005 · Running for 2m</div></div>
                <div style="display:flex;gap:8px;align-items:center">
                  <span class="b" style="background:rgba(252,163,38,.15);color:#fca326;border:none"><span class="dot" style="background:#fca326;margin-right:4px"></span> Live</span>
                  <button class="btn btn-primary" style="padding:4px 12px;font-size:11px">Join</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: Log Explorer -->
      <!-- Log Explorer Content -->
      <div v-show="currentTab === 'Log Explorer'">
        <!-- Filter Bar --><div class="fbar">
          <span style="font-size:11px;font-weight:600;color:#90A4AE">Layers:</span>
          <button class="chip chip-tech"><span class="mdi mdi-wrench-outline"></span> Technical</button>
          <button class="chip chip-meth"><span class="mdi mdi-clipboard-outline"></span> Methodological</button>
          <button class="chip chip-ai"><span class="mdi mdi-robot-outline"></span> AI Decisions</button>
          <div class="sep"></div>
          <select class="fsel"><option>Severity: All</option><option>Error</option><option>Warning</option><option>Info</option></select>
          <select class="fsel"><option>Session: S-008</option><option>S-007</option><option>All</option></select>
          <select class="fsel"><option>Last 1 hour</option><option>Last 15 min</option><option>Last 24h</option></select>
          <input class="fsearch" placeholder="Search logs...">
        </div>

        <!-- Card --><div class="card">
          <div class="card-hdr">
            <div>
              <div class="card-t">Log Entries</div>
              <div class="card-s">847 entries · S-008 · last 1 hour</div>
            </div>
            <div style="display:flex;gap:6px">
              <button class="btn btn-out"><span class="mdi mdi-download-outline"></span> Export</button>
              <button class="btn btn-out"><span class="mdi mdi-refresh"></span></button>
            </div>
          </div>
          <!-- Log Table --><table class="dtbl">
            <!-- Table Header --><thead>
              <tr>
                <th style="width:80px">Time</th>
                <th style="width:94px">Layer</th>
                <th style="width:62px">Level</th>
                <th style="width:100px">Source</th>
                <th>Message</th>
                <th style="width:64px">Trace</th>
              </tr>
            </thead>
            <!-- Table Body --><tbody>
              <tr>
                <td class="lt">10:23:01</td>
                <td><span class="b b-tech"><span class="mdi mdi-wrench-outline"></span> TECH</span></td>
                <td><span class="b b-info">INFO</span></td>
                <td class="ls">firestore</td>
                <td>Write success: sessions/S-008/tasks/task_002</td>
                <td><span class="ltr">T-0042</span></td>
              </tr>
              <tr>
                <td class="lt">10:23:05</td>
                <td><span class="b b-meth"><span class="mdi mdi-clipboard-outline"></span> METH</span></td>
                <td><span class="b b-info">INFO</span></td>
                <td class="ls">facilitator</td>
                <td>Task 2 assigned to participant P-004</td>
                <td><span class="ltr">T-0042</span></td>
              </tr>
              <tr style="background:#F8F9FF">
                <td class="lt">10:23:12</td>
                <td><span class="b b-ai"><span class="mdi mdi-robot-outline"></span> AI</span></td>
                <td><span class="b b-info">INFO</span></td>
                <td class="ls">eye-tracker</td>
                <td style="font-weight:500">▾ Fixation at (342, 518) — 1.2s</td>
                <td><span class="ltr">T-0042</span></td>
              </tr>
              <tr>
                <td colspan="6" style="padding:0">
                  <div style="background:#F8F9FC;border:1px solid #E3E8F0;border-radius:8px;padding:12px 14px;margin:2px 4px;font-size:13px">
                    <div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
                      <span class="b b-ai"><span class="mdi mdi-robot-outline"></span> AI Decision Detail</span>
                    </div>
                    <div class="dr"><span class="dl">Model:</span><span>gaze-detection-v2.1</span></div>
                    <div class="dr"><span class="dl">Confidence:</span><span style="color:var(--ok);font-weight:600">0.91 ✓ High</span></div>
                    <div class="dr"><span class="dl">AOI Hit:</span><span>"Submit Button" — 3rd fixation in task</span></div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="lt">10:23:22</td>
                <td><span class="b b-ai"><span class="mdi mdi-robot-outline"></span> AI</span></td>
                <td><span class="b b-warn">WARN</span></td>
                <td class="ls">sentiment</td>
                <td>Expression: <b>frustrated</b> (confidence: 0.82)</td>
                <td><span class="ltr">T-0042</span></td>
              </tr>
              <tr>
                <td class="lt">10:23:30</td>
                <td><span class="b b-meth"><span class="mdi mdi-clipboard-outline"></span> METH</span></td>
                <td><span class="b b-warn">WARN</span></td>
                <td class="ls">facilitator</td>
                <td>⚠ Protocol deviation: extra hint given</td>
                <td><span class="ltr">T-0042</span></td>
              </tr>
              <tr>
                <td class="lt">10:23:35</td>
                <td><span class="b b-tech"><span class="mdi mdi-wrench-outline"></span> TECH</span></td>
                <td><span class="b b-err">ERR</span></td>
                <td class="ls">eye-tracker</td>
                <td>Frame drop: 3 frames lost (network jitter)</td>
                <td><span class="ltr">T-0042</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB: Trace View -->
      <!-- Trace View Content -->
      <div v-show="currentTab === 'Trace View'">
        <div class="card" style="margin-bottom:14px">
          <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap">
            <div>
              <div style="font-size:10px;color:#90A4AE;font-weight:600;text-transform:uppercase;letter-spacing:.5px">Trace ID</div>
              <div style="font-size:18px;font-weight:700;color:#fca326">T-0042</div>
            </div>
            <div class="sep"></div>
            <div><div style="font-size:10px;color:#90A4AE">Session</div><div style="font-weight:600">S-008</div></div>
            <div class="sep"></div>
            <div><div style="font-size:10px;color:#90A4AE">Participant</div><div style="font-weight:600">P-004</div></div>
            <div class="sep"></div>
            <div><div style="font-size:10px;color:#90A4AE">Duration</div><div style="font-weight:600">12m 34s</div></div>
            <div style="flex:1"></div>
            <span class="b b-warn"><span class="mdi mdi-alert-outline"></span> 1 Deviation</span>
            <button class="btn btn-out" style="font-size:11px"><span class="mdi mdi-download-outline"></span> Export</button>
          </div>
        </div>

        <div class="card" style="margin-bottom:14px">
          <div class="card-hdr">
            <div class="card-t">Event Swimlane</div>
            <div style="display:flex;gap:5px">
              <span class="b b-tech"><span class="mdi mdi-wrench-outline"></span> Tech</span>
              <span class="b b-meth"><span class="mdi mdi-clipboard-outline"></span> Method</span>
              <span class="b b-ai"><span class="mdi mdi-robot-outline"></span> AI</span>
            </div>
          </div>
          <div style="display:flex;justify-content:space-between;padding:0 112px 6px;font-size:10px;color:#90A4AE">
            <span>10:20</span><span>10:21</span><span>10:22</span><span>10:23</span><span>10:24</span>
          </div>
          <!-- Swimlane Container --><div class="sw-wrap">
            <!-- Swimlane Row --><div class="sw-row">
              <!-- Lane Label --><div class="sw-lbl" style="color:var(--meth)"><span class="mdi mdi-clipboard-outline"></span> Method</div>
              <!-- Lane Track --><div class="sw-trk">
                <div class="sn sn-m">Task Start</div>
                <div class="sn sn-m">Observer Note</div>
                <div class="sn sn-m">Task Done</div>
                <div class="sn sn-w" style="margin-left:auto">⚠ Deviation</div>
              </div>
            </div>
            <!-- Swimlane Row --><div class="sw-row">
              <!-- Lane Label --><div class="sw-lbl" style="color:var(--tech)"><span class="mdi mdi-wrench-outline"></span> Tech</div>
              <!-- Lane Track --><div class="sw-trk">
                <div class="sn sn-t">API Call</div>
                <div class="sn sn-t">DB Write</div>
                <div class="sn sn-t">API 200</div>
                <div class="sn sn-e">Frame Drop</div>
              </div>
            </div>
            <div class="sw-row" style="border-bottom:none">
              <!-- Lane Label --><div class="sw-lbl" style="color:var(--ai)"><span class="mdi mdi-robot-outline"></span> AI</div>
              <!-- Lane Track --><div class="sw-trk">
                <div class="sn sn-a" style="margin-left:40px">Eye Track</div>
                <div class="sn sn-a">Sentiment</div>
                <div class="sn sn-a" style="margin-left:auto">Transcript</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Card --><div class="card">
          <div class="card-hdr">
            <div class="card-t">Selected: Observer Note (10:21:33)</div>
            <span class="b b-meth"><span class="mdi mdi-clipboard-outline"></span> Methodological</span>
          </div>
          <div class="dr"><span class="dl">Source:</span><span>Dr. Ana Martinez</span></div>
          <div class="dr"><span class="dl">Content:</span><span>"Participant paused, re-read instructions twice before proceeding"</span></div>
          <div class="dr">
            <span class="dl">Correlated:</span>
            <span style="display:flex;gap:4px">
              <span class="b b-ai" style="cursor:pointer"><span class="mdi mdi-robot-outline"></span> Eye fixation 1.2s</span>
              <span class="b b-ai" style="cursor:pointer"><span class="mdi mdi-robot-outline"></span> Frustrated 0.82</span>
            </span>
          </div>
        </div>
      </div>

      <!-- TAB: Lifecycle -->
      <!-- Lifecycle Content -->
      <div v-show="currentTab === 'Lifecycle'">
        <div class="g g12" style="margin-bottom:14px;gap:14px">
          <!-- Phase Progress Card -->
          <!-- Card --><div class="card">
            <div class="card-t" style="margin-bottom:12px">Session Lifecycle</div>
            <!-- Progress Bar --><div class="pbar">
              <div class="pstep"><div class="pdot done"></div><div class="plbl done">Preparation</div></div>
              <div class="pstep"><div class="pdot now"></div><div class="plbl now">Execution</div></div>
              <div class="pstep"><div class="pdot"></div><div class="plbl">Debrief & Export</div></div>
            </div>
            <div style="font-size:12px;color:#90A4AE;text-align:center;margin-top:8px">
              Tracks the live session state. METH (Methodological) layer captures facilitator actions and deviations.
            </div>
          </div>

          <!-- Quick Stats Card -->
          <!-- Card --><div class="card">
            <div class="card-t" style="margin-bottom:12px">Study at a Glance</div>
            <div style="display:flex;flex-direction:column;gap:10px">
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:13px;color:#546E7A">Participants</span>
                <span style="font-weight:700;font-size:15px">8 / 15</span>
              </div>
              <div style="height:6px;background:#E0E0E0;border-radius:3px"><div style="height:100%;width:53%;background:#fca326;border-radius:3px"></div></div>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:13px;color:#546E7A">Total Logs</span>
                <span style="font-weight:700;font-size:15px">2,893</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:13px;color:#546E7A">Started</span>
                <span style="font-size:13px">Mar 1, 2025</span>
              </div>
              <div style="display:flex;justify-content:space-between;align-items:center">
                <span style="font-size:13px;color:#546E7A">Protocol Deviations</span>
                <span style="color:var(--warn);font-weight:600">2</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Phase Detail Cards Row -->
        <div class="g g3" style="margin-bottom:14px">
          <!-- Preparation Phase Card -->
          <!-- Card --><div class="card">
            <div class="card-hdr" style="margin-bottom:8px">
              <div class="card-t" style="font-size:13px">Preparation</div>
              <span class="b b-ok" style="font-size:10px">Done</span>
            </div>
            <div style="font-size:11px;color:#90A4AE;margin-bottom:6px">Checks before start</div>
            <div style="font-size:12px;display:flex;flex-direction:column;gap:4px">
              <div style="color:#90A4AE">📝 14 tech checks logs</div>
              <div style="color:var(--ok)">✅ Sensors calibrated</div>
              <div style="color:var(--ok)">✅ Consent signed</div>
            </div>
          </div>
          <!-- Execution Phase Card (Active) -->
          <div class="card" style="border:2px solid #fca326">
            <div class="card-hdr" style="margin-bottom:8px">
              <div class="card-t" style="font-size:13px">Execution</div>
              <span class="b" style="background:rgba(252,163,38,.12);color:#fca326;font-size:10px">● Active</span>
            </div>
            <div style="font-size:11px;color:#90A4AE;margin-bottom:6px">In progress (14 min)</div>
            <div style="font-size:12px;display:flex;flex-direction:column;gap:4px">
              <div style="color:var(--ok)">✅ A/V recording sync</div>
              <div>🎬 Task 3 of 5 active</div>
              <div style="color:var(--warn)">⚠ 1 hint given by facilitator</div>
            </div>
          </div>
          <!-- Debrief Phase Card -->
          <!-- Card --><div class="card">
            <div class="card-hdr" style="margin-bottom:8px">
              <div class="card-t" style="font-size:13px">Debrief & Export</div>
              <span class="b" style="background:#F5F5F5;color:#90A4AE;font-size:10px">Pending</span>
            </div>
            <div style="font-size:11px;color:#90A4AE;margin-bottom:6px">After session ends</div>
            <div style="font-size:12px;display:flex;flex-direction:column;gap:4px">
              <div style="color:#90A4AE">⏳ Compile traces</div>
              <div style="color:#90A4AE">⏳ Generate AI summary</div>
              <div style="color:#90A4AE">⏳ Participant hand-over</div>
            </div>
          </div>
        </div>

        <!-- Card --><div class="card">
          <!-- Card Header --><div class="card-hdr" style="margin-bottom:12px">
            <div class="card-t">Recent Activity</div>
            <!-- View All Button --><button class="btn btn-out" style="font-size:11px;padding:4px 10px">View all</button>
          </div>
          <!-- Timeline --><div class="tl">
            <!-- Timeline Item --><div class="tl-i">
              <div class="tl-d now"></div>
              <div style="font-size:13px"><div style="font-weight:600">Session S-008 completed</div><div style="color:#90A4AE;font-size:12px">Today 10:24 · P-004 · 14 min · 3/5 tasks completed</div></div>
            </div>
            <!-- Timeline Item --><div class="tl-i">
              <div class="tl-d warn"></div>
              <div style="font-size:13px"><div style="font-weight:600;color:var(--warn)">⚠ Protocol deviation — S-007</div><div style="color:#90A4AE;font-size:12px">Today 09:45 · Facilitator gave extra hint at Task 3</div></div>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB: Export -->
      <!-- Export Content -->
      <div v-show="currentTab === 'Export'">
        <div class="g g12" style="gap:14px;margin-bottom:14px">
          <!-- Export Settings Card -->
          <!-- Card --><div class="card">
            <div class="card-t" style="margin-bottom:14px">Export Settings</div>

            <div style="font-size:11px;font-weight:600;color:#90A4AE;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Format</div>
            <div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:16px">
              <button class="chip" style="background:rgba(0,33,63,.08);border-color:#00213F;color:#00213F;font-weight:600">● JSON</button>
              <button class="chip">CSV</button>
              <button class="chip">PDF Report</button>
              <button class="chip">APA Table</button>
            </div>

            <div style="font-size:11px;font-weight:600;color:#90A4AE;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Log Layers to Include</div>
            <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px">
              <span class="b b-tech" style="padding:5px 12px;cursor:pointer">✓ Technical</span>
              <span class="b b-meth" style="padding:5px 12px;cursor:pointer">✓ Methodological</span>
              <span class="b b-ai" style="padding:5px 12px;cursor:pointer">✓ AI Decisions</span>
            </div>

            <div style="font-size:11px;font-weight:600;color:#90A4AE;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">Date Range</div>
            <div style="display:flex;gap:8px;align-items:center">
              <select class="fsel" style="flex:1"><option>From: Mar 1</option></select>
              <span style="font-size:12px;color:#90A4AE">to</span>
              <select class="fsel" style="flex:1"><option>To: Today</option></select>
            </div>
          </div>

          <!-- Preview Card -->
          <!-- Card --><div class="card">
            <div class="card-hdr" style="margin-bottom:10px">
              <div class="card-t">Export Preview</div>
              <span class="b b-ok" style="font-size:10px"><span class="mdi mdi-shield-check-outline"></span> Anonymized</span>
            </div>
            <div class="card-s" style="margin-bottom:10px">First 3 entries after anonymization</div>
            <!-- Code Preview --><div class="prv" style="max-height:160px">
<span class="k">[</span>
  {
    <span class="k">"layer"</span>: <span class="s">"technical"</span>,
    <span class="k">"timestamp"</span>: <span class="s">"10:23:01"</span>,
    <span class="k">"source"</span>: <span class="s">"firestore"</span>,
    <span class="k">"message"</span>: <span class="s">"Write: sessions/[HASH]/tasks"</span>
  },
  {
    <span class="k">"layer"</span>: <span class="s">"ai_decision"</span>,
    <span class="k">"model"</span>: <span class="s">"gaze-v2.1"</span>,
    <span class="k">"confidence"</span>: <span class="n">0.91</span>,
    <span class="k">"participant"</span>: <span class="s">"P-004"</span>
  }
<span class="k">]</span>
            </div>
            <div style="display:flex;gap:14px;margin-top:12px;font-size:12px;flex-wrap:wrap">
              <span style="color:#90A4AE">Entries: <b style="color:#212121">2,847</b></span>
              <span style="color:#90A4AE">Size: <b style="color:#212121">2.3 MB</b></span>
              <span style="color:#90A4AE">Participants: <b style="color:#212121">8</b></span>
            </div>
          </div>
        </div>

        <!-- Anonymization Card -->
        <!-- Card --><div class="card">
          <div class="card-hdr" style="margin-bottom:4px">
            <div class="card-t">Privacy & Anonymization</div>
            <div style="font-size:11px;color:#90A4AE">Applied before export — required for ethical research</div>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:0">
            <div class="trow" style="padding:10px 8px">
              <div>
                <div style="font-size:13px;font-weight:500">Replace participant names</div>
                <div style="font-size:11px;color:#90A4AE">Names replaced with P-001, P-002…</div>
              </div>
              <div class="tsw on"></div>
            </div>
            <div class="trow" style="padding:10px 8px">
              <div>
                <div style="font-size:13px;font-weight:500">Hash session IDs</div>
                <div style="font-size:11px;color:#90A4AE">Irreversible sha256 hashing</div>
              </div>
              <div class="tsw on"></div>
            </div>
            <div class="trow" style="padding:10px 8px">
              <div>
                <div style="font-size:13px;font-weight:500">Redact PII from text answers</div>
                <div style="font-size:11px;color:#90A4AE">Auto-detect names, emails in open-ended responses</div>
              </div>
              <div class="tsw on"></div>
            </div>
            <div class="trow" style="padding:10px 8px">
              <div>
                <div style="font-size:13px;font-weight:500">Exclude background questionnaire</div>
                <div style="font-size:11px;color:#90A4AE">Remove age, gender, experience data</div>
              </div>
              <div class="tsw"></div>
            </div>
          </div>
          <div style="display:flex;justify-content:flex-end;margin-top:14px;gap:8px">
            <button class="btn btn-out"><span class="mdi mdi-content-save-outline"></span> Save Settings</button>
            <button class="btn btn-orange" style="padding:8px 24px"><span class="mdi mdi-download-outline"></span> Export 2,847 Entries (2.3 MB)</button>
          </div>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

const currentTab = ref('Log Explorer')
const tabs = ['Overview', 'Log Explorer', 'Trace View', 'Lifecycle', 'Export']
</script>

<style scoped>
.mockup-scope {
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

.mockup-scope * { box-sizing:border-box; }

.dashboard-container {
  width: 85%;
  margin: 0 auto;
  max-width: 1400px;
  padding: 32px 24px;
}

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
}

.dashboard-subtitle {
  font-size: 1.1rem;
  opacity: .9;
  margin-bottom: 14px;
}

.header-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.study-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  background: rgba(255,255,255,.2);
  border: 1px solid rgba(255,255,255,.3);
  color: #fff;
  backdrop-filter: blur(10px);
}

.sub-tabs {
  display: flex;
  gap: 2px;
  background: #fff;
  border: 1px solid rgba(0,0,0,.08);
  border-radius: 10px;
  padding: 4px;
  margin-bottom: 24px;
  box-shadow: var(--shadow);
}
.stab {
  padding: 8px 18px;
  border-radius: 7px;
  font-size: 13px; font-weight: 500;
  color: #546E7A;
  border: none; background: none;
  font-family: inherit; cursor: pointer;
  transition: var(--tr);
  white-space: nowrap;
}
.stab:hover { background: #F5F5F5; color: #212121; }
.stab.active { background: #00213F; color: #fff; }

.card {
  background: #fff;
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0,0,0,.08);
  border: 1px solid rgba(0,0,0,.06);
}
.card-hdr { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 14px; }
.card-t { font-size: 14px; font-weight: 600; color: #2c3e50; }
.card-s { font-size: 12px; color: #90A4AE; margin-top: 2px; }

.g  { display: grid; gap: 16px; }
.g2 { grid-template-columns: 1fr 1fr; }
.g3 { grid-template-columns: 1fr 1fr 1fr; }
.g12 { grid-template-columns: 1fr 2fr; }

.stat-card {
  background: #00213F;
  border-radius: 16px;
  padding: 18px 20px;
  color: #fff;
  position: relative;
  overflow: hidden;
  min-height: 96px;
}
.sc-label { font-size: 13px; font-weight: 400; opacity: .75; margin-bottom: 6px; }
.sc-val   { font-size: 28px; font-weight: 700; line-height: 1; }
.sc-sub   { font-size: 11px; opacity: .55; margin-top: 4px; }
.sc-icon  {
  position: absolute; bottom: 14px; right: 14px;
  width: 36px; height: 36px;
  border-radius: 8px;
  background: rgba(255,255,255,.1);
  display: flex; align-items: center; justify-content: center;
}
.sc-icon .mdi { font-size: 20px; }

.sw-wrap { overflow-x: auto; }
.sw-row  { display: grid; grid-template-columns: 100px 1fr; border-bottom: 1px solid #E0E0E0; min-height: 68px; }
.sw-lbl  { padding: 12px 8px; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 5px; border-right: 1px solid #E0E0E0; background: #FAFAFA; }
.sw-trk  { padding: 12px 14px; display: flex; align-items: center; gap: 18px; position: relative; }
.sw-trk::before { content: ''; position: absolute; left: 14px; right: 14px; top: 50%; height: 2px; background: #E0E0E0; }
.sn      { position: relative; z-index: 1; padding: 4px 10px; border-radius: 16px; font-size: 10px; font-weight: 600; white-space: nowrap; cursor: pointer; box-shadow: var(--shadow); color: #fff; transition: var(--tr); }
.sn:hover { transform: scale(1.06); }
.sn-t { background: var(--tech); }
.sn-m { background: var(--meth); }
.sn-a { background: var(--ai); }
.sn-w { background: var(--warn); }
.sn-e { background: var(--err); }

.pbar { display: flex; align-items: flex-start; margin: 20px 0 24px; position: relative; }
.pbar::before { content: ''; position: absolute; top: 10px; left: 10%; right: 10%; height: 3px; background: #E0E0E0; z-index: 0; }
.pstep { flex: 1; text-align: center; position: relative; z-index: 1; }
.pdot  { width: 22px; height: 22px; border-radius: 50%; border: 3px solid #E0E0E0; background: #fff; margin: 0 auto 6px; transition: var(--tr); }
.pdot.done { border-color: var(--ok);   background: var(--ok); }
.pdot.now  { border-color: #fca326; background: #fca326; box-shadow: 0 0 0 4px rgba(252,163,38,.2); }
.plbl { font-size: 11px; font-weight: 500; color: #90A4AE; }
.plbl.done { color: var(--ok); }
.plbl.now  { color: #fca326; font-weight: 600; }

.tl       { position: relative; padding-left: 22px; }
.tl::before { content: ''; position: absolute; left: 7px; top: 0; bottom: 0; width: 2px; background: #E0E0E0; }
.tl-i     { position: relative; padding-bottom: 20px; }
.tl-d     { position: absolute; left: -22px; top: 2px; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #E0E0E0; background: #fff; }
.tl-d.now  { border-color: #fca326; background: #fca326; }
.tl-d.done { border-color: var(--ok);  background: var(--ok); }
.tl-d.warn { border-color: var(--warn); background: var(--warn); }


.b {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 3px 10px; border-radius: 20px;
  font-size: 11px; font-weight: 600;
  text-transform: uppercase; letter-spacing: .4px;
  white-space: nowrap;
}
.b-tech { background: var(--tech-bg); color: var(--tech); border: 1px solid rgba(21, 101, 192, 0.25); }
.b-meth { background: var(--meth-bg); color: var(--meth); border: 1px solid rgba(46, 125, 50, 0.25); }
.b-ai   { background: var(--ai-bg);  color: var(--ai); border: 1px solid rgba(106, 27, 154, 0.25); }
.b-err  { background: var(--err-bg); color: var(--err); border: 1px solid rgba(198, 40, 40, 0.25); }
.b-warn { background: var(--warn-bg); color: var(--warn); border: 1px solid rgba(230, 81, 0, 0.25); }
.b-info { background: var(--info-bg); color: var(--info); border: 1px solid rgba(21, 101, 192, 0.25); }
.b-ok   { background: var(--ok-bg);  color: var(--ok); border: 1px solid rgba(46, 125, 50, 0.25); }

.chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 12px; border-radius: 20px;
  font-size: 12px; font-weight: 500;
  border: 1px solid rgba(0,0,0,.15);
  cursor: pointer; background: #fff;
  color: #546E7A; font-family: inherit;
  transition: var(--tr);
}
.chip:hover { border-color: #999; }
.chip-tech { background: var(--tech-bg); border-color: var(--tech); color: var(--tech); }
.chip-meth { background: var(--meth-bg); border-color: var(--meth); color: var(--meth); }
.chip-ai   { background: var(--ai-bg);  border-color: var(--ai);  color: var(--ai); }

.lrow {
  display: grid;
  grid-template-columns: 74px 44px 80px 1fr 60px;
  gap: 12px; padding: 8px 10px;
  font-size: 13px; align-items: center;
  border-bottom: 1px solid #F5F5F5;
  cursor: pointer; transition: var(--tr);
}
.lrow .b {
  justify-self: start;
  justify-content: center;
  min-width: 44px;
}
.lrow:hover { background: #FAFAFA; }
.lrow:last-child { border-bottom: none; }
.lt  { color: #90A4AE; font-family: monospace; font-size: 11px; }
.ls  { color: #546E7A; font-size: 12px; }
.ltr { color: #fca326; font-size: 12px; font-weight: 600; }

.dtbl { width: 100%; border-collapse: collapse; }
.dtbl th {
  text-align: left; padding: 9px 12px;
  font-size: 11px; font-weight: 600; text-transform: uppercase;
  letter-spacing: .5px; color: #90A4AE;
  border-bottom: 2px solid #ECEFF1; background: #FAFAFA;
}
.dtbl td { padding: 10px 12px; font-size: 13px; border-bottom: 1px solid #F5F5F5; }
.dtbl tr:hover td { background: #FAFAFA; }

.fbar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px;
  background: #fff; border: 1px solid rgba(0,0,0,.08);
  border-radius: 12px; margin-bottom: 14px;
  box-shadow: var(--shadow); flex-wrap: wrap;
}
.fsel {
  background: #F5F7FA; border: 1px solid rgba(0,0,0,.1);
  border-radius: 6px; padding: 6px 10px;
  color: #212121; font-size: 12px; font-family: inherit;
  cursor: pointer; outline: none;
}
.fsel:focus { border-color: #00213F; }
.fsearch {
  flex: 1; min-width: 160px;
  background: #F5F7FA; border: 1px solid rgba(0,0,0,.1);
  border-radius: 6px; padding: 6px 12px;
  color: #212121; font-size: 12px; font-family: inherit; outline: none;
}
.fsearch:focus { border-color: #00213F; background: #fff; }

.btn {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 7px 16px; border-radius: 8px;
  font-size: 13px; font-weight: 500; font-family: inherit;
  cursor: pointer; border: none; transition: var(--tr);
  text-transform: none; letter-spacing: normal;
}
.btn-primary { background: #00213F; color: #fff; }
.btn-primary:hover { background: #00162a; }
.btn-orange { background: #fca326; color: #fff; }
.btn-out { background: transparent; border: 1px solid rgba(0,0,0,.15); color: #546E7A; }
.btn-out:hover { border-color: #999; color: #212121; }

.dr  { display: flex; gap: 8px; margin: 4px 0; font-size: 13px; }
.dl  { color: #90A4AE; min-width: 90px; font-size: 12px; font-weight: 500; }
.sep { width: 1px; height: 24px; background: #E0E0E0; }
.dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; }
.dot-g { background: var(--ok); }
.dot-y { background: var(--warn); }
.dot-r { background: var(--err); }

.prv {
  background: #1E2A3A; border-radius: 8px; padding: 14px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 11px; color: #8b949e; overflow: auto;
  max-height: 200px; line-height: 1.7;
  white-space: pre-wrap;
}
.k { color: #7ee787; } .s { color: #a5d6ff; } .n { color: #79c0ff; }

.trow { display: flex; align-items: center; justify-content: space-between; padding: 9px 0; border-bottom: 1px solid #F5F5F5; }
.trow:last-child { border-bottom: none; }
.tsw { width: 40px; height: 22px; background: #CFD8DC; border-radius: 11px; position: relative; cursor: pointer; flex-shrink: 0; transition: var(--tr); }
.tsw.on { background: #fca326; }
.tsw::after { content: ''; position: absolute; top: 3px; left: 3px; width: 16px; height: 16px; border-radius: 50%; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,.2); transition: var(--tr); }
.tsw.on::after { left: 21px; }

</style>
