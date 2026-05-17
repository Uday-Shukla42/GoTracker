// GoTracker — Views (HTML rendering for all views)
// ============================================================

const QUARTERS = ['Q1', 'Q2', 'Q3', 'Q4'];
const CYCLE = DB.cycles[0];

// ---- Helpers ----
function statusBadge(status) {
  const map = {
    draft: 'badge-gray', submitted: 'badge-yellow',
    approved: 'badge-green', rejected: 'badge-red',
    locked: 'badge-blue',
    'Not Started': 'badge-gray', 'On Track': 'badge-blue', 'Completed': 'badge-green'
  };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function scoreDisplay(score) {
  if (score === null || score === undefined) return '<span class="badge badge-gray">—</span>';
  const cls = score >= 100 ? 'badge-green' : score >= 70 ? 'badge-yellow' : 'badge-red';
  return `<span class="badge ${cls}">${score}%</span>`;
}

function weightageBar(goals) {
  const total = goals.reduce((s, g) => s + (parseFloat(g.weightage) || 0), 0);
  const colors = ['#5b8af0','#2ecc71','#f1c40f','#e74c3c','#9b59b6','#e67e22','#1abc9c','#e91e63'];
  const segs = goals.map((g, i) => {
    const pct = Math.min((parseFloat(g.weightage) || 0), 100);
    return `<div class="weightage-seg" style="width:${pct}%;background:${colors[i % colors.length]};" title="${g.title}: ${g.weightage}%"></div>`;
  }).join('');
  const totalClass = Math.round(total) === 100 ? 'weightage-ok' : (total > 100 ? 'weightage-error' : 'weightage-warn');
  return `
    <div class="weightage-bar">${segs || '<div style="width:100%;background:var(--bg3)"></div>'}</div>
    <div class="weightage-info">
      <span>${goals.length} goal${goals.length !== 1 ? 's' : ''}</span>
      <span class="weightage-total ${totalClass}">Total: ${total}%</span>
    </div>`;
}

function progressBar(pct, color) {
  const cls = pct >= 100 ? 'green' : pct >= 60 ? '' : 'red';
  return `
    <div class="progress-bar"><div class="progress-fill ${cls}" style="width:${Math.min(pct, 100)}%"></div></div>
    <div class="progress-label"><span></span><span>${pct}%</span></div>`;
}

function cycleBanner() {
  return `<div class="cycle-banner">
    <div>
      <div class="cycle-banner-title">📅 ${CYCLE.name} — Active Cycle</div>
      <div class="cycle-banner-sub">Goal Setting phase open from ${CYCLE.openDate} · Q3 Check-in window active</div>
    </div>
    <span class="badge badge-green">Active</span>
  </div>`;
}

// ============================================================
// EMPLOYEE VIEWS
// ============================================================

function renderEmployeeDashboard() {
  const user = State.currentUser;
  const goals = getGoalsByEmployee(user.id, CYCLE.id);
  const approved = goals.filter(g => g.status === 'approved').length;
  const submitted = goals.filter(g => g.status === 'submitted').length;
  const draft = goals.filter(g => g.status === 'draft').length;
  const totalWeight = goals.filter(g => g.status === 'approved').reduce((s, g) => s + parseFloat(g.weightage || 0), 0);

  // Completion % across Q1–Q3
  const filled = goals.filter(g => g.status === 'approved').reduce((s, g) => {
    return s + QUARTERS.slice(0, 3).filter(q => g.achievements[q]?.value !== null && g.achievements[q]?.value !== undefined).length;
  }, 0);
  const possible = approved * 3;
  const completionPct = possible > 0 ? Math.round((filled / possible) * 100) : 0;

  const recentGoals = goals.filter(g => g.status === 'approved').slice(0, 3);

  return `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1>Welcome back, ${user.name.split(' ')[0]} 👋</h1>
          <p>Here's your goal progress overview for ${CYCLE.name}</p>
        </div>
        <button class="btn-primary" onclick="navigate('my-goals')">My Goals →</button>
      </div>
      ${cycleBanner()}
      <div class="grid-4" style="margin-bottom:2rem">
        <div class="stat-card">
          <div class="stat-label">Total Goals</div>
          <div class="stat-value" style="color:var(--accent)">${goals.length}</div>
          <div class="stat-change">${approved} approved, ${submitted} pending</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Approved Goals</div>
          <div class="stat-value" style="color:var(--green)">${approved}</div>
          <div class="stat-change">Locked & tracking</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Weightage Assigned</div>
          <div class="stat-value" style="color:${totalWeight===100?'var(--green)':'var(--yellow)'}">${totalWeight}%</div>
          <div class="stat-change">${totalWeight === 100 ? '✓ Balanced' : 'Must total 100%'}</div>
        </div>
        <div class="stat-card">
          <div class="stat-label">Check-in Progress</div>
          <div class="stat-value" style="color:var(--accent)">${completionPct}%</div>
          <div class="stat-change">Q1–Q3 updates</div>
        </div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><div class="card-title">Goal Status Overview</div></div>
          ${weightageBar(goals.filter(g => g.status === 'approved'))}
          <div style="display:flex;flex-direction:column;gap:0.7rem;margin-top:1rem">
            ${goals.filter(g => g.status === 'approved').map((g, i) => {
              const q2score = g.achievements.Q2?.score;
              return `<div style="display:flex;align-items:center;gap:0.8rem">
                <div style="width:10px;height:10px;border-radius:50%;background:${['#5b8af0','#2ecc71','#f1c40f','#e74c3c','#9b59b6','#e67e22','#1abc9c','#e91e63'][i % 8]};flex-shrink:0"></div>
                <span style="font-size:0.84rem;flex:1">${g.title}</span>
                <span style="font-size:0.78rem;color:var(--text-muted)">${g.weightage}%</span>
                ${scoreDisplay(q2score)}
              </div>`;
            }).join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-header"><div class="card-title">Quarter Check-in Summary</div></div>
          <table style="width:100%">
            <thead><tr>
              <th style="text-align:left;font-size:0.75rem;color:var(--text-muted);padding:0.5rem 0">Goal</th>
              ${QUARTERS.map(q => `<th style="text-align:center;font-size:0.75rem;color:var(--text-muted);padding:0.5rem 0.3rem">${q}</th>`).join('')}
            </tr></thead>
            <tbody>
              ${goals.filter(g => g.status === 'approved').map(g => `
                <tr>
                  <td style="font-size:0.82rem;padding:0.5rem 0;max-width:160px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${g.title}">${g.title}</td>
                  ${QUARTERS.map(q => {
                    const a = g.achievements[q];
                    const filled = a?.value !== null && a?.value !== undefined && a?.value !== '';
                    return `<td style="text-align:center;padding:0.4rem">
                      <div style="width:24px;height:24px;border-radius:50%;margin:auto;
                        background:${filled ? 'var(--green-bg)' : 'var(--bg3)'};
                        border:1px solid ${filled ? 'var(--green)' : 'var(--border)'};
                        display:flex;align-items:center;justify-content:center;font-size:0.7rem">
                        ${filled ? '✓' : ''}
                      </div>
                    </td>`;
                  }).join('')}
                </tr>`).join('')}
            </tbody>
          </table>
          ${draft > 0 ? `<div class="alert alert-warn" style="margin-top:1rem">⚠️ You have ${draft} draft goal(s). <button onclick="navigate('my-goals')" style="background:none;border:none;color:var(--accent);cursor:pointer;font-size:inherit;text-decoration:underline">Submit them →</button></div>` : ''}
        </div>
      </div>
    </div>`;
}

function renderMyGoals() {
  const user = State.currentUser;
  const goals = getGoalsByEmployee(user.id, CYCLE.id);
  const allApproved = goals.every(g => g.status === 'approved');
  const hasDraft = goals.some(g => g.status === 'draft');
  const hasSubmitted = goals.some(g => g.status === 'submitted');

  return `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1>My Goals</h1>
          <p>${CYCLE.name} · ${goals.length}/8 goals set</p>
        </div>
        <div class="page-actions">
          ${hasDraft ? `<button class="btn-primary" id="submit-all-btn">Submit All Goals ↗</button>` : ''}
          ${!allApproved ? `<button class="btn-secondary" id="add-goal-btn">+ Add Goal</button>` : ''}
        </div>
      </div>

      ${hasSubmitted ? `<div class="alert alert-info">⏳ Your goals are under review by your manager. No edits allowed until a decision is made.</div>` : ''}
      ${allApproved ? `<div class="alert alert-success">🔒 All goals approved and locked. Update your quarterly achievements below.</div>` : ''}

      <div style="margin-bottom:1.5rem">
        <div class="section-title" style="font-size:0.8rem;color:var(--text-muted);font-family:var(--font-body);font-weight:400">WEIGHTAGE DISTRIBUTION</div>
        ${weightageBar(goals.filter(g => ['approved','submitted'].includes(g.status)))}
      </div>

      <div id="goals-list">
        ${goals.length === 0 ? `
          <div class="empty-state">
            <div class="empty-icon">🎯</div>
            <h3>No goals yet</h3>
            <p>Create your first goal to get started</p>
            <button class="btn-primary" style="margin-top:1rem" id="add-goal-btn2">+ Add First Goal</button>
          </div>` : goals.map((g, i) => renderGoalCard(g, i)).join('')}
      </div>
    </div>`;
}

function renderGoalCard(g, i) {
  const locked = g.status === 'approved' || g.status === 'submitted';
  const shared = g.shared ? `<span class="pill">📌 Shared Goal</span>` : '';
  const q2 = g.achievements.Q2;

  return `<div class="goal-card" data-goal-id="${g.id}">
    <div class="goal-card-header">
      <div>
        <div class="goal-card-title">${g.title}</div>
        <div class="goal-card-desc">${g.description}</div>
        <div class="goal-card-meta">
          <span>📂 ${g.thrustArea}</span>
          <span>📐 ${g.uom}</span>
          <span>🎯 Target: ${g.target}</span>
          <span>⚖️ ${g.weightage}%</span>
          ${statusBadge(g.status)}
          ${shared}
        </div>
      </div>
    </div>
    ${!locked ? `
      <div class="goal-card-actions">
        <button class="btn-secondary btn-sm edit-goal-btn" data-id="${g.id}">✏️ Edit</button>
        <button class="btn-danger btn-sm delete-goal-btn" data-id="${g.id}">🗑 Delete</button>
      </div>` : ''}
  </div>`;
}

function renderAchievements() {
  const user = State.currentUser;
  const goals = getGoalsByEmployee(user.id, CYCLE.id).filter(g => g.status === 'approved');

  return `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1>Quarterly Achievements</h1>
          <p>Log your actual achievements per quarter · ${CYCLE.name}</p>
        </div>
      </div>

      ${goals.length === 0 ? `<div class="empty-state"><div class="empty-icon">📈</div><h3>No approved goals</h3><p>Goals need to be approved before tracking achievements.</p></div>` : ''}

      ${goals.map(g => `
        <div class="card" style="margin-bottom:1.2rem" data-goal-id="${g.id}">
          <div class="card-header">
            <div>
              <div class="card-title">${g.title}</div>
              <div class="card-subtitle">${g.thrustArea} · ${g.uom} · Target: ${g.target} · Weight: ${g.weightage}%</div>
            </div>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr>
                <th>Quarter</th>
                <th>Planned Target</th>
                <th>Actual Achievement</th>
                <th>Status</th>
                <th>Score</th>
                <th>Action</th>
              </tr></thead>
              <tbody>
                ${QUARTERS.map(q => {
                  const a = g.achievements[q];
                  const comment = g.checkInComments[q];
                  return `<tr>
                    <td><strong>${q}</strong></td>
                    <td>${g.target}</td>
                    <td>
                      <input class="checkin-input achieve-val" data-goal="${g.id}" data-q="${q}"
                        type="${g.uom === 'Timeline' ? 'date' : 'number'}"
                        value="${a?.value ?? ''}" placeholder="Enter actual"
                        style="width:130px" />
                    </td>
                    <td>
                      <select class="checkin-input achieve-status" data-goal="${g.id}" data-q="${q}" style="width:130px">
                        ${['Not Started','On Track','Completed'].map(s =>
                          `<option ${a?.status === s ? 'selected' : ''}>${s}</option>`
                        ).join('')}
                      </select>
                    </td>
                    <td>${scoreDisplay(a?.score)}</td>
                    <td><button class="btn-primary btn-sm save-achieve-btn" data-goal="${g.id}" data-q="${q}">Save</button></td>
                  </tr>
                  ${comment ? `<tr><td colspan="6" style="padding:0.4rem 1.1rem;background:var(--bg2)">
                    <span style="font-size:0.78rem;color:var(--text-muted)">💬 Manager: </span>
                    <span style="font-size:0.82rem">${comment}</span>
                  </td></tr>` : ''}`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      `).join('')}
    </div>`;
}

// ============================================================
// MANAGER VIEWS
// ============================================================

function renderManagerDashboard() {
  const user = State.currentUser;
  const teamData = getTeamGoals(user.id, CYCLE.id);
  const allGoals = teamData.flatMap(t => t.goals);
  const pending = allGoals.filter(g => g.status === 'submitted').length;
  const approved = allGoals.filter(g => g.status === 'approved').length;
  const totalEmp = teamData.length;

  return `
    <div class="fade-in">
      <div class="page-header">
        <div>
          <h1>Manager Dashboard</h1>
          <p>Team overview · ${user.name} · ${CYCLE.name}</p>
        </div>
        <button class="btn-primary" onclick="navigate('approvals')">Review Pending →</button>
      </div>
      ${cycleBanner()}
      <div class="grid-4" style="margin-bottom:2rem">
        <div class="stat-card"><div class="stat-label">Team Members</div><div class="stat-value" style="color:var(--accent)">${totalEmp}</div></div>
        <div class="stat-card"><div class="stat-label">Pending Approval</div><div class="stat-value" style="color:var(--yellow)">${pending}</div><div class="stat-change">Awaiting review</div></div>
        <div class="stat-card"><div class="stat-label">Goals Approved</div><div class="stat-value" style="color:var(--green)">${approved}</div></div>
        <div class="stat-card"><div class="stat-label">Total Goals</div><div class="stat-value" style="color:var(--text)">${allGoals.length}</div></div>
      </div>

      <div class="section-title">Team Members</div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Employee</th><th>Department</th><th>Goals</th><th>Status</th><th>Q1</th><th>Q2</th><th>Action</th>
          </tr></thead>
          <tbody>
            ${teamData.map(({ employee: emp, goals }) => {
              const hasPending = goals.some(g => g.status === 'submitted');
              const q1done = goals.filter(g => g.achievements.Q1?.value !== null && g.achievements.Q1?.value !== undefined && g.achievements.Q1?.value !== '').length;
              const q2done = goals.filter(g => g.achievements.Q2?.value !== null && g.achievements.Q2?.value !== undefined && g.achievements.Q2?.value !== '').length;
              const approved = goals.filter(g => g.status === 'approved').length;
              return `<tr>
                <td><strong>${emp.name}</strong></td>
                <td>${emp.dept}</td>
                <td>${goals.length} goals</td>
                <td>${hasPending ? statusBadge('submitted') : statusBadge('approved')}</td>
                <td>${q1done}/${approved} ✓</td>
                <td>${q2done}/${approved} ✓</td>
                <td>
                  <button class="btn-secondary btn-sm" onclick="navigate('checkins')">Check-in</button>
                  ${hasPending ? `<button class="btn-primary btn-sm" style="margin-left:0.4rem" onclick="navigate('approvals')">Approve</button>` : ''}
                </td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderApprovals() {
  const user = State.currentUser;
  const teamData = getTeamGoals(user.id, CYCLE.id);
  const pendingEmployees = teamData.filter(t => t.goals.some(g => g.status === 'submitted'));

  return `
    <div class="fade-in">
      <div class="page-header">
        <div><h1>Goal Approvals</h1><p>Review and approve team goal sheets</p></div>
      </div>

      ${pendingEmployees.length === 0 ? `<div class="empty-state"><div class="empty-icon">✅</div><h3>No pending approvals</h3><p>All team goal sheets have been reviewed.</p></div>` : ''}

      ${pendingEmployees.map(({ employee: emp, goals }) => {
        const submitted = goals.filter(g => g.status === 'submitted');
        return `
          <div class="card" style="margin-bottom:1.5rem">
            <div class="card-header">
              <div>
                <div class="card-title">👤 ${emp.name}</div>
                <div class="card-subtitle">${emp.dept} · ${submitted.length} submitted goal(s)</div>
              </div>
              <div style="display:flex;gap:0.6rem">
                <button class="btn-success btn-sm approve-all-btn" data-emp="${emp.id}">✓ Approve All</button>
                <button class="btn-danger btn-sm reject-all-btn" data-emp="${emp.id}">↩ Return All</button>
              </div>
            </div>
            ${weightageBar(submitted)}
            <div class="table-wrap" style="margin-top:1rem">
              <table>
                <thead><tr>
                  <th>#</th><th>Goal</th><th>Thrust Area</th><th>UoM</th>
                  <th>Target</th><th>Weightage</th><th>Actions</th>
                </tr></thead>
                <tbody>
                  ${submitted.map((g, i) => `
                    <tr>
                      <td>${i+1}</td>
                      <td>
                        <strong>${g.title}</strong>
                        <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.2rem">${g.description}</div>
                      </td>
                      <td>${g.thrustArea}</td>
                      <td>${g.uom}</td>
                      <td>
                        <input class="checkin-input" style="width:90px" type="${g.uom === 'Timeline' ? 'date' : 'number'}"
                          value="${g.target}" data-field="target" data-gid="${g.id}" />
                      </td>
                      <td>
                        <input class="checkin-input" style="width:70px" type="number" min="10" max="100"
                          value="${g.weightage}" data-field="weightage" data-gid="${g.id}" />%
                      </td>
                      <td>
                        <button class="btn-success btn-sm approve-single-btn" data-id="${g.id}" data-emp="${emp.id}">✓</button>
                        <button class="btn-danger btn-sm reject-single-btn" data-id="${g.id}" data-emp="${emp.id}" style="margin-left:0.3rem">↩</button>
                      </td>
                    </tr>`).join('')}
                </tbody>
              </table>
            </div>
          </div>`;
      }).join('')}
    </div>`;
}

function renderTeamGoals() {
  const user = State.currentUser;
  const teamData = getTeamGoals(user.id, CYCLE.id);

  return `
    <div class="fade-in">
      <div class="page-header">
        <div><h1>Team Goals</h1><p>Overview of all goals across your team</p></div>
      </div>
      ${teamData.map(({ employee: emp, goals }) => `
        <div class="card" style="margin-bottom:1.5rem">
          <div class="card-header">
            <div>
              <div class="card-title">👤 ${emp.name}</div>
              <div class="card-subtitle">${emp.dept} · ${goals.length} goals</div>
            </div>
            ${weightageBar(goals.filter(g=>g.status==='approved'))}
          </div>
          ${goals.length === 0 ? `<p style="color:var(--text-muted);font-size:0.85rem">No goals created yet.</p>` : `
          <div class="table-wrap" style="margin-top:0.5rem">
            <table>
              <thead><tr><th>Goal</th><th>Thrust Area</th><th>UoM</th><th>Target</th><th>Wt.</th><th>Status</th></tr></thead>
              <tbody>
                ${goals.map(g => `<tr>
                  <td><strong>${g.title}</strong></td>
                  <td>${g.thrustArea}</td><td>${g.uom}</td>
                  <td>${g.target}</td><td>${g.weightage}%</td>
                  <td>${statusBadge(g.status)}</td>
                </tr>`).join('')}
              </tbody>
            </table>
          </div>`}
        </div>`).join('')}
    </div>`;
}

function renderManagerCheckins() {
  const user = State.currentUser;
  const teamData = getTeamGoals(user.id, CYCLE.id);

  return `
    <div class="fade-in">
      <div class="page-header">
        <div><h1>Quarterly Check-ins</h1><p>Review achievement vs plan and log comments</p></div>
      </div>

      <div class="tabs">
        ${QUARTERS.map((q, i) => `<button class="tab-btn ${i===1?'active':''}" data-q="${q}" onclick="switchCheckinTab('${q}',this)">${q}</button>`).join('')}
      </div>

      <div id="checkin-content">
        ${renderCheckinTable(teamData, 'Q2')}
      </div>
    </div>`;
}

function renderCheckinTable(teamData, quarter) {
  return teamData.map(({ employee: emp, goals }) => {
    const approvedGoals = goals.filter(g => g.status === 'approved');
    if (!approvedGoals.length) return '';
    return `
      <div class="card" style="margin-bottom:1.5rem">
        <div class="card-header">
          <div class="card-title">👤 ${emp.name} — ${quarter} Check-in</div>
        </div>
        <div class="table-wrap">
          <table>
            <thead><tr>
              <th>Goal</th><th>UoM</th><th>Target</th>
              <th>${quarter} Actual</th><th>Status</th><th>Score</th>
            </tr></thead>
            <tbody>
              ${approvedGoals.map(g => {
                const a = g.achievements[quarter];
                return `<tr>
                  <td><strong>${g.title}</strong></td>
                  <td>${g.uom}</td>
                  <td>${g.target}</td>
                  <td>${a?.value ?? '<span style="color:var(--text-muted)">—</span>'}</td>
                  <td>${statusBadge(a?.status || 'Not Started')}</td>
                  <td>${scoreDisplay(a?.score)}</td>
                </tr>`;
              }).join('')}
            </tbody>
          </table>
        </div>
        <div style="margin-top:1rem">
          <div class="form-group">
            <label>${quarter} Check-in Comment for ${emp.name}</label>
            <textarea class="mgr-comment-input" data-emp="${emp.id}" data-q="${quarter}" rows="2"
              placeholder="Add structured feedback for this quarter...">${approvedGoals[0]?.checkInComments?.[quarter] || ''}</textarea>
          </div>
          <button class="btn-primary btn-sm save-comment-btn" data-emp="${emp.id}" data-q="${quarter}">Save Comment</button>
        </div>
      </div>`;
  }).join('');
}

// ============================================================
// ADMIN VIEWS
// ============================================================

function renderAdminDashboard() {
  const allGoals = getAllGoals(CYCLE.id);
  const employees = DB.users.filter(u => u.role === 'employee');
  const approved = allGoals.filter(g => g.status === 'approved').length;
  const submitted = allGoals.filter(g => g.status === 'submitted').length;
  const draft = allGoals.filter(g => g.status === 'draft').length;

  const completedCheckins = employees.filter(emp => {
    const goals = getGoalsByEmployee(emp.id, CYCLE.id).filter(g => g.status === 'approved');
    return goals.length > 0 && goals.every(g => g.achievements.Q2?.value !== null && g.achievements.Q2?.value !== undefined);
  }).length;

  return `
    <div class="fade-in">
      <div class="page-header">
        <div><h1>Admin Dashboard</h1><p>Organisation-wide overview · ${CYCLE.name}</p></div>
        <button class="btn-primary" onclick="exportCSV()">📥 Export Report</button>
      </div>
      ${cycleBanner()}
      <div class="grid-4" style="margin-bottom:2rem">
        <div class="stat-card"><div class="stat-label">Total Employees</div><div class="stat-value" style="color:var(--accent)">${employees.length}</div></div>
        <div class="stat-card"><div class="stat-label">Goals Approved</div><div class="stat-value" style="color:var(--green)">${approved}</div></div>
        <div class="stat-card"><div class="stat-label">Pending Review</div><div class="stat-value" style="color:var(--yellow)">${submitted}</div></div>
        <div class="stat-card"><div class="stat-label">Q2 Check-ins Done</div><div class="stat-value" style="color:var(--accent)">${completedCheckins}/${employees.length}</div></div>
      </div>

      <div class="grid-2">
        <div class="card">
          <div class="card-header"><div class="card-title">Goal Status Breakdown</div></div>
          <div style="display:flex;flex-direction:column;gap:0.8rem">
            ${[
              { label: 'Approved', count: approved, color: 'var(--green)' },
              { label: 'Submitted', count: submitted, color: 'var(--yellow)' },
              { label: 'Draft', count: draft, color: 'var(--text-muted)' },
            ].map(({ label, count, color }) => `
              <div>
                <div style="display:flex;justify-content:space-between;font-size:0.85rem;margin-bottom:0.3rem">
                  <span>${label}</span><span style="color:${color};font-weight:700">${count}</span>
                </div>
                <div class="progress-bar"><div class="progress-fill" style="width:${allGoals.length ? Math.round(count/allGoals.length*100) : 0}%;background:${color}"></div></div>
              </div>`).join('')}
          </div>
        </div>
        <div class="card">
          <div class="card-header"><div class="card-title">Recent Audit Events</div></div>
          ${DB.auditLog.slice(0, 5).map(a => `
            <div class="audit-item">
              <div class="audit-dot"></div>
              <div class="audit-content">
                <div class="audit-action">${a.action}</div>
                <div class="audit-meta">${a.timestamp} · ${getUser(a.userId)?.name || a.userId}</div>
              </div>
            </div>`).join('')}
          <button class="btn-secondary btn-sm" style="margin-top:1rem;width:100%" onclick="navigate('audit')">View Full Log →</button>
        </div>
      </div>
    </div>`;
}

function renderAllGoals() {
  const allGoals = getAllGoals(CYCLE.id);
  return `
    <div class="fade-in">
      <div class="page-header">
        <div><h1>All Goals</h1><p>${allGoals.length} total goals across all employees</p></div>
        <button class="btn-primary" onclick="exportCSV()">📥 Export CSV</button>
      </div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Employee</th><th>Goal</th><th>Thrust Area</th><th>UoM</th>
            <th>Target</th><th>Weight</th><th>Status</th>
            <th>Q1 Score</th><th>Q2 Score</th>
          </tr></thead>
          <tbody>
            ${allGoals.map(g => {
              const emp = getUser(g.employeeId);
              return `<tr>
                <td>${emp?.name || g.employeeId}</td>
                <td><strong>${g.title}</strong></td>
                <td>${g.thrustArea}</td><td>${g.uom}</td>
                <td>${g.target}</td><td>${g.weightage}%</td>
                <td>${statusBadge(g.status)}</td>
                <td>${scoreDisplay(g.achievements.Q1?.score)}</td>
                <td>${scoreDisplay(g.achievements.Q2?.score)}</td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderCompletion() {
  const employees = DB.users.filter(u => u.role === 'employee');
  const managers = DB.users.filter(u => u.role === 'manager');

  return `
    <div class="fade-in">
      <div class="page-header">
        <div><h1>Completion Dashboard</h1><p>Real-time check-in completion rates</p></div>
      </div>

      <div class="section-title">Employee Check-in Completion</div>
      <div class="table-wrap" style="margin-bottom:2rem">
        <table>
          <thead><tr>
            <th>Employee</th><th>Dept</th><th>Goal Sheet</th>
            ${QUARTERS.map(q => `<th>${q}</th>`).join('')}
          </tr></thead>
          <tbody>
            ${employees.map(emp => {
              const goals = getGoalsByEmployee(emp.id, CYCLE.id).filter(g => g.status === 'approved');
              const sheetDone = goals.length > 0;
              return `<tr>
                <td><strong>${emp.name}</strong></td>
                <td>${emp.dept}</td>
                <td>${sheetDone ? '<span class="badge badge-green">✓ Done</span>' : '<span class="badge badge-gray">Pending</span>'}</td>
                ${QUARTERS.map(q => {
                  const filled = goals.length > 0 && goals.some(g => g.achievements[q]?.value !== null && g.achievements[q]?.value !== undefined && g.achievements[q]?.value !== '');
                  return `<td>${filled ? '<span class="badge badge-green">✓</span>' : '<span class="badge badge-gray">—</span>'}</td>`;
                }).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>

      <div class="section-title">Manager Check-in Completion</div>
      <div class="table-wrap">
        <table>
          <thead><tr><th>Manager</th><th>Dept</th>${QUARTERS.map(q=>`<th>${q} Comments</th>`).join('')}</tr></thead>
          <tbody>
            ${managers.map(mgr => {
              const teamData = getTeamGoals(mgr.id, CYCLE.id);
              return `<tr>
                <td><strong>${mgr.name}</strong></td>
                <td>${mgr.dept}</td>
                ${QUARTERS.map(q => {
                  const commented = teamData.some(({ goals }) =>
                    goals.some(g => g.checkInComments?.[q])
                  );
                  return `<td>${commented ? '<span class="badge badge-green">✓</span>' : '<span class="badge badge-gray">—</span>'}</td>`;
                }).join('')}
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderAuditTrail() {
  return `
    <div class="fade-in">
      <div class="page-header">
        <div><h1>Audit Trail</h1><p>Complete log of all goal changes after lock date</p></div>
      </div>
      <div class="card">
        ${DB.auditLog.map(a => `
          <div class="audit-item">
            <div class="audit-dot"></div>
            <div class="audit-content">
              <div class="audit-action"><strong>${a.action}</strong> — ${a.detail}</div>
              <div class="audit-meta">
                ${a.timestamp} · By: ${getUser(a.userId)?.name || a.userId}
                ${a.goalId ? `· Goal ID: ${a.goalId}` : ''}
              </div>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
}

function renderCycleConfig() {
  return `
    <div class="fade-in">
      <div class="page-header">
        <div><h1>Cycle Configuration</h1><p>Manage goal setting and check-in schedules</p></div>
        <button class="btn-primary" id="add-cycle-btn">+ New Cycle</button>
      </div>

      ${DB.cycles.map(c => `
        <div class="card" style="margin-bottom:1.2rem">
          <div class="card-header">
            <div>
              <div class="card-title">${c.name}</div>
              <div class="card-subtitle">Year: ${c.year} · Opened: ${c.openDate}</div>
            </div>
            <span class="badge ${c.status === 'active' ? 'badge-green' : 'badge-gray'}">${c.status}</span>
          </div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Phase</th><th>Window Opens</th><th>Action</th></tr></thead>
              <tbody>
                <tr><td>Phase 1 — Goal Setting</td><td>1st May</td><td>Goal Creation, Submission & Approval</td></tr>
                <tr><td>Q1 Check-in</td><td>July</td><td>Progress Update — Planned vs. Actual</td></tr>
                <tr><td>Q2 Check-in</td><td>October</td><td>Progress Update — Planned vs. Actual</td></tr>
                <tr><td>Q3 Check-in</td><td>January</td><td>Progress Update — Planned vs. Actual</td></tr>
                <tr><td>Q4 / Annual</td><td>March / April</td><td>Final Achievement Capture</td></tr>
              </tbody>
            </table>
          </div>
        </div>`).join('')}
    </div>`;
}

function renderGoalUnlock() {
  const lockedGoals = getAllGoals(CYCLE.id).filter(g => g.status === 'approved');

  return `
    <div class="fade-in">
      <div class="page-header">
        <div><h1>Goal Unlock</h1><p>Admin exception handling — unlock approved goals for editing</p></div>
      </div>
      <div class="alert alert-warn">⚠️ Unlocking a goal will revert it to draft status and require re-approval. All changes are audit-logged.</div>
      <div class="table-wrap">
        <table>
          <thead><tr>
            <th>Employee</th><th>Goal</th><th>Thrust Area</th><th>Weightage</th><th>Action</th>
          </tr></thead>
          <tbody>
            ${lockedGoals.map(g => {
              const emp = getUser(g.employeeId);
              return `<tr>
                <td>${emp?.name}</td>
                <td><strong>${g.title}</strong></td>
                <td>${g.thrustArea}</td>
                <td>${g.weightage}%</td>
                <td><button class="btn-danger btn-sm unlock-goal-btn" data-id="${g.id}">🔓 Unlock</button></td>
              </tr>`;
            }).join('')}
          </tbody>
        </table>
      </div>
    </div>`;
}

function renderSharedGoalsAdmin() {
  const user = State.currentUser;
  const employees = user.role === 'admin'
    ? DB.users.filter(u => u.role === 'employee')
    : DB.users.filter(u => u.managerId === user.id);

  return `
    <div class="fade-in">
      <div class="page-header">
        <div><h1>Shared Goals</h1><p>Push departmental KPIs to multiple employees</p></div>
      </div>

      <div class="card" style="margin-bottom:2rem">
        <div class="card-header"><div class="card-title">Push New Shared Goal</div></div>
        <div class="form-row">
          <div class="form-group">
            <label>Goal Title *</label>
            <input type="text" id="sg-title" placeholder="e.g., Department Safety Target" />
          </div>
          <div class="form-group">
            <label>Thrust Area *</label>
            <select id="sg-thrust">
              ${DB.thrustAreas.map(t => `<option>${t}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="form-group">
          <label>Description</label>
          <textarea id="sg-desc" rows="2" placeholder="Describe the shared goal..."></textarea>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Unit of Measurement</label>
            <select id="sg-uom">
              ${DB.uomTypes.map(u => `<option>${u}</option>`).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Target</label>
            <input type="text" id="sg-target" placeholder="e.g., 0, 100, 2025-12-31" />
          </div>
        </div>
        <div class="form-group">
          <label>Select Employees to Push To</label>
          <div style="display:flex;flex-direction:column;gap:0.4rem;background:var(--bg2);border:1px solid var(--border);border-radius:var(--radius-sm);padding:0.8rem">
            ${employees.map(emp => `
              <label style="display:flex;align-items:center;gap:0.6rem;font-size:0.88rem;cursor:pointer">
                <input type="checkbox" class="sg-emp-check" value="${emp.id}" style="accent-color:var(--accent)" />
                ${emp.name} <span style="color:var(--text-muted);font-size:0.78rem">(${emp.dept})</span>
              </label>`).join('')}
          </div>
        </div>
        <button class="btn-primary" id="push-shared-btn">📌 Push Shared Goal</button>
      </div>

      <div class="section-title">Existing Shared Goals</div>
      ${getAllGoals(CYCLE.id).filter(g => g.shared).length === 0
        ? `<div class="empty-state"><div class="empty-icon">📌</div><h3>No shared goals pushed yet</h3></div>`
        : `<div class="table-wrap"><table>
            <thead><tr><th>Goal</th><th>Pushed To</th><th>Thrust Area</th><th>Target</th></tr></thead>
            <tbody>
              ${getAllGoals(CYCLE.id).filter(g => g.shared).map(g => `
                <tr>
                  <td><strong>${g.title}</strong></td>
                  <td>${getUser(g.employeeId)?.name}</td>
                  <td>${g.thrustArea}</td>
                  <td>${g.target}</td>
                </tr>`).join('')}
            </tbody>
          </table></div>`}
    </div>`;
}

// ============================================================
// Tab switcher for check-ins
// ============================================================
function switchCheckinTab(quarter, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const user = State.currentUser;
  const teamData = getTeamGoals(user.id, CYCLE.id);
  document.getElementById('checkin-content').innerHTML = renderCheckinTable(teamData, quarter);
  attachListeners('checkins', 'manager');
}

// ============================================================