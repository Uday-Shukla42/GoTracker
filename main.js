// GoTracker — Main (Bootstrap, Login, Event Handlers)
// ============================================================

// ---- LOGIN ----
document.querySelectorAll('.role-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    // Autofill hint
    const role = btn.dataset.role;
    const hints = { employee: 'emp1', manager: 'mgr1', admin: 'admin' };
    document.getElementById('login-username').value = hints[role] || '';
    document.getElementById('login-password').value = 'pass123';
  });
});

document.getElementById('login-btn').addEventListener('click', doLogin);
document.getElementById('login-password').addEventListener('keydown', e => { if (e.key === 'Enter') doLogin(); });

function doLogin() {
  const username = document.getElementById('login-username').value.trim();
  const password = document.getElementById('login-password').value;
  const errEl = document.getElementById('login-error');

  const user = login(username, password);
  if (!user) {
    errEl.textContent = 'Invalid username or password. Try: emp1, mgr1, or admin with pass123';
    errEl.classList.remove('hidden');
    return;
  }

  errEl.classList.add('hidden');
  document.getElementById('login-screen').classList.remove('active');
  document.getElementById('main-screen').classList.add('active');
  buildSidebar();
  navigate('dashboard');
}

document.getElementById('logout-btn').addEventListener('click', () => {
  logout();
  document.getElementById('main-screen').classList.remove('active');
  document.getElementById('login-screen').classList.add('active');
  document.getElementById('login-username').value = '';
  document.getElementById('login-password').value = '';
});

// ---- MODAL CLOSE ----
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('modal-overlay').addEventListener('click', e => {
  if (e.target === document.getElementById('modal-overlay')) closeModal();
});

// ============================================================
// Attach Listeners per View
// ============================================================

function attachListeners(viewId, role) {
  if (viewId === 'my-goals') attachMyGoalsListeners();
  if (viewId === 'achievements') attachAchievementListeners();
  if (viewId === 'approvals') attachApprovalListeners();
  if (viewId === 'checkins') attachCheckinListeners();
  if (viewId === 'unlock') attachUnlockListeners();
  if (viewId === 'shared-goals') attachSharedGoalListeners();
}

// ---- MY GOALS ----
function attachMyGoalsListeners() {
  document.getElementById('add-goal-btn')?.addEventListener('click', openAddGoalModal);
  document.getElementById('add-goal-btn2')?.addEventListener('click', openAddGoalModal);
  document.getElementById('submit-all-btn')?.addEventListener('click', handleSubmitAll);

  document.querySelectorAll('.edit-goal-btn').forEach(btn => {
    btn.addEventListener('click', () => openEditGoalModal(btn.dataset.id));
  });
  document.querySelectorAll('.delete-goal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Delete this goal?')) {
        deleteGoal(btn.dataset.id);
        navigate('my-goals');
        showToast('Goal deleted.', 'info');
      }
    });
  });
}

function handleSubmitAll() {
  const user = State.currentUser;
  const goals = getGoalsByEmployee(user.id, CYCLE.id);
  const draftGoals = goals.filter(g => g.status === 'draft');

  if (draftGoals.length === 0) return showToast('No draft goals to submit.', 'warn');

  const allGoalsForValidation = goals.filter(g => ['draft','submitted'].includes(g.status));
  const errors = validateWeightage(allGoalsForValidation);
  if (errors.length > 0) {
    openModal('Validation Errors', `
      <div class="alert alert-error">${errors.map(e => `<div>❌ ${e}</div>`).join('')}</div>
      <p>Please fix these errors before submitting.</p>
    `, `<button class="btn-secondary" onclick="closeModal()">OK</button>`);
    return;
  }

  submitGoals(user.id, CYCLE.id);
  showToast('Goals submitted for approval!', 'success');
  navigate('my-goals');
}

function openAddGoalModal(editGoal) {
  const user = State.currentUser;
  const existing = getGoalsByEmployee(user.id, CYCLE.id);
  if (!editGoal && existing.length >= 8) {
    showToast('Maximum 8 goals allowed.', 'error');
    return;
  }

  const isEdit = !!editGoal;
  const g = editGoal || {};

  openModal(isEdit ? 'Edit Goal' : 'Add New Goal', `
    <div class="form-row">
      <div class="form-group">
        <label>Thrust Area *</label>
        <select id="gf-thrust">
          ${DB.thrustAreas.map(t => `<option ${g.thrustArea===t?'selected':''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label>Unit of Measurement *</label>
        <select id="gf-uom">
          ${DB.uomTypes.map(u => `<option ${g.uom===u?'selected':''}>${u}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-group">
      <label>Goal Title *</label>
      <input type="text" id="gf-title" value="${g.title || ''}" placeholder="e.g., Increase quarterly revenue by 15%" />
    </div>
    <div class="form-group">
      <label>Description</label>
      <textarea id="gf-desc" rows="3" placeholder="Describe the goal, scope, and expected outcome...">${g.description || ''}</textarea>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label>Target *</label>
        <input type="text" id="gf-target" value="${g.target || ''}" placeholder="e.g., 100, 85%, 2025-12-31" />
      </div>
      <div class="form-group">
        <label>Weightage (%) * <small style="color:var(--text-muted)">Min 10%, total must = 100%</small></label>
        <input type="number" id="gf-weightage" min="10" max="100" value="${g.weightage || 10}" />
      </div>
    </div>
    <div id="gf-error" class="error-msg hidden"></div>
  `, `
    <button class="btn-secondary" onclick="closeModal()">Cancel</button>
    <button class="btn-primary" onclick="saveGoalForm('${isEdit ? g.id : ''}')">
      ${isEdit ? 'Update Goal' : 'Add Goal'}
    </button>
  `);
}

function openEditGoalModal(goalId) {
  const goal = DB.goals.find(g => g.id === goalId);
  if (!goal) return;
  openAddGoalModal(goal);
}

function saveGoalForm(editId) {
  const user = State.currentUser;
  const title = document.getElementById('gf-title').value.trim();
  const desc = document.getElementById('gf-desc').value.trim();
  const thrust = document.getElementById('gf-thrust').value;
  const uom = document.getElementById('gf-uom').value;
  const target = document.getElementById('gf-target').value.trim();
  const weightage = parseFloat(document.getElementById('gf-weightage').value);
  const errEl = document.getElementById('gf-error');

  if (!title || !target) {
    errEl.textContent = 'Please fill in all required fields.';
    errEl.classList.remove('hidden');
    return;
  }
  if (weightage < 10) {
    errEl.textContent = 'Minimum weightage is 10%.';
    errEl.classList.remove('hidden');
    return;
  }

  const existing = getGoalsByEmployee(user.id, CYCLE.id);
  if (!editId && existing.length >= 8) {
    errEl.textContent = 'Maximum 8 goals allowed.';
    errEl.classList.remove('hidden');
    return;
  }

  if (editId) {
    updateGoal(editId, { title, description: desc, thrustArea: thrust, uom, target, weightage });
    addAudit(user.id, 'Goal edited', editId, `Goal "${title}" updated`);
    showToast('Goal updated!', 'success');
  } else {
    addGoal({
      employeeId: user.id, cycleId: CYCLE.id,
      title, description: desc, thrustArea: thrust, uom, target, weightage,
      status: 'draft', shared: false, sharedFrom: null,
      achievements: {
        Q1: { value: null, status: 'Not Started', score: null },
        Q2: { value: null, status: 'Not Started', score: null },
        Q3: { value: null, status: 'Not Started', score: null },
        Q4: { value: null, status: 'Not Started', score: null }
      },
      checkInComments: {}
    });
    showToast('Goal added!', 'success');
  }

  closeModal();
  navigate('my-goals');
}

// ---- ACHIEVEMENTS ----
function attachAchievementListeners() {
  document.querySelectorAll('.save-achieve-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const goalId = btn.dataset.goal;
      const quarter = btn.dataset.q;
      const valInput = document.querySelector(`.achieve-val[data-goal="${goalId}"][data-q="${quarter}"]`);
      const statusInput = document.querySelector(`.achieve-status[data-goal="${goalId}"][data-q="${quarter}"]`);
      const value = valInput?.value;
      const status = statusInput?.value;

      if (value === undefined || value === '') {
        showToast('Please enter an achievement value.', 'warn');
        return;
      }

      saveAchievement(goalId, quarter, value, status);
      showToast(`${quarter} achievement saved!`, 'success');

      // Update score display inline
      const goal = DB.goals.find(g => g.id === goalId);
      const score = goal?.achievements[quarter]?.score;
      const row = btn.closest('tr');
      const scoreCell = row?.cells[5];
      if (scoreCell) scoreCell.innerHTML = scoreDisplay(score);
    });
  });
}

// ---- APPROVALS ----
function attachApprovalListeners() {
  document.querySelectorAll('.approve-all-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const empId = btn.dataset.emp;
      const goals = getGoalsByEmployee(empId, CYCLE.id).filter(g => g.status === 'submitted');

      // Save any inline edits
      document.querySelectorAll(`input[data-field]`).forEach(input => {
        const gid = input.dataset.gid;
        const field = input.dataset.field;
        if (field === 'target') updateGoal(gid, { target: input.value });
        if (field === 'weightage') updateGoal(gid, { weightage: parseFloat(input.value) });
      });

      goals.forEach(g => approveGoal(g.id, State.currentUser.id));
      showToast(`All goals approved for ${getUser(empId)?.name}`, 'success');
      navigate('approvals');
    });
  });

  document.querySelectorAll('.reject-all-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const empId = btn.dataset.emp;
      const goals = getGoalsByEmployee(empId, CYCLE.id).filter(g => g.status === 'submitted');
      goals.forEach(g => rejectGoal(g.id, State.currentUser.id));
      showToast(`Goals returned for rework — ${getUser(empId)?.name}`, 'info');
      navigate('approvals');
    });
  });

  document.querySelectorAll('.approve-single-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      approveGoal(btn.dataset.id, State.currentUser.id);
      showToast('Goal approved!', 'success');
      navigate('approvals');
    });
  });

  document.querySelectorAll('.reject-single-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      rejectGoal(btn.dataset.id, State.currentUser.id);
      showToast('Goal returned for rework.', 'info');
      navigate('approvals');
    });
  });
}

// ---- MANAGER CHECK-INS ----
function attachCheckinListeners() {
  document.querySelectorAll('.save-comment-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const empId = btn.dataset.emp;
      const quarter = btn.dataset.q;
      const commentInput = document.querySelector(`.mgr-comment-input[data-emp="${empId}"][data-q="${quarter}"]`);
      const comment = commentInput?.value?.trim();
      if (!comment) { showToast('Please enter a comment.', 'warn'); return; }

      // Apply comment to all approved goals for that employee
      const goals = getGoalsByEmployee(empId, CYCLE.id).filter(g => g.status === 'approved');
      goals.forEach(g => saveCheckInComment(g.id, quarter, comment));

      showToast(`${quarter} check-in comment saved for ${getUser(empId)?.name}!`, 'success');
    });
  });
}

// ---- UNLOCK ----
function attachUnlockListeners() {
  document.querySelectorAll('.unlock-goal-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (confirm('Unlock this goal? It will revert to draft and require re-approval.')) {
        unlockGoal(btn.dataset.id);
        showToast('Goal unlocked. Employee can now edit and resubmit.', 'info');
        navigate('unlock');
      }
    });
  });
}

// ---- SHARED GOALS ----
function attachSharedGoalListeners() {
  document.getElementById('push-shared-btn')?.addEventListener('click', () => {
    const title = document.getElementById('sg-title').value.trim();
    const thrust = document.getElementById('sg-thrust').value;
    const desc = document.getElementById('sg-desc').value.trim();
    const uom = document.getElementById('sg-uom').value;
    const target = document.getElementById('sg-target').value.trim();
    const checked = [...document.querySelectorAll('.sg-emp-check:checked')].map(c => c.value);

    if (!title || !target || checked.length === 0) {
      showToast('Please fill all fields and select at least one employee.', 'warn');
      return;
    }

    pushSharedGoal(title, desc, thrust, uom, target, checked, CYCLE.id);
    showToast(`Shared goal pushed to ${checked.length} employee(s)!`, 'success');
    navigate('shared-goals');
  });
}

// ---- GLOBAL FUNCTIONS used inline in HTML ----
window.navigate = navigate;
window.switchCheckinTab = switchCheckinTab;
window.saveGoalForm = saveGoalForm;
window.closeModal = closeModal;
window.exportCSV = exportCSV;