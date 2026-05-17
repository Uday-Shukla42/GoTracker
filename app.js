// GoTracker — App Core (Navigation, Modal, Toast)
// ============================================================

// ---- TOAST ----
function showToast(message, type = 'info') {
  const icons = { success: '✅', error: '❌', info: 'ℹ️', warn: '⚠️' };
  const container = document.getElementById('toast-container');
  const el = document.createElement('div');
  el.className = `toast ${type}`;
  el.innerHTML = `<span>${icons[type] || 'ℹ️'}</span><span>${message}</span>`;
  container.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateX(100%)'; el.style.transition = 'all 0.3s'; setTimeout(() => el.remove(), 350); }, 3500);
}

// ---- MODAL ----
function openModal(title, bodyHTML, footerHTML = '') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML = bodyHTML;
  document.getElementById('modal-footer').innerHTML = footerHTML;
  document.getElementById('modal-overlay').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('modal-overlay').classList.add('hidden');
}

// ---- NAVIGATION ----
const NAV_CONFIG = {
  employee: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'my-goals', label: 'My Goals', icon: '🎯' },
    { id: 'achievements', label: 'Achievements', icon: '📈' },
  ],
  manager: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'team-goals', label: 'Team Goals', icon: '👥' },
    { id: 'approvals', label: 'Approvals', icon: '✅' },
    { id: 'checkins', label: 'Check-ins', icon: '💬' },
    { id: 'shared-goals', label: 'Shared Goals', icon: '📌' },
  ],
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'all-goals', label: 'All Goals', icon: '📋' },
    { id: 'completion', label: 'Completion', icon: '📊' },
    { id: 'audit', label: 'Audit Trail', icon: '🔍' },
    { id: 'cycles', label: 'Cycle Config', icon: '⚙️' },
    { id: 'unlock', label: 'Goal Unlock', icon: '🔓' },
    { id: 'shared-goals', label: 'Shared Goals', icon: '📌' },
  ]
};

function buildSidebar() {
  const user = State.currentUser;
  document.getElementById('sidebar-avatar').textContent = user.name.charAt(0);
  document.getElementById('sidebar-name').textContent = user.name;
  document.getElementById('sidebar-role').textContent = user.role.charAt(0).toUpperCase() + user.role.slice(1);

  const nav = document.getElementById('sidebar-nav');
  const items = NAV_CONFIG[user.role] || [];
  nav.innerHTML = items.map(item => `
    <button class="nav-item" data-view="${item.id}">
      <span class="nav-icon">${item.icon}</span>
      <span>${item.label}</span>
    </button>
  `).join('');

  nav.querySelectorAll('.nav-item').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.view));
  });
}

function navigate(viewId) {
  State.currentView = viewId;
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewId);
  });
  renderView(viewId);
}

function renderView(viewId) {
  const area = document.getElementById('content-area');
  area.innerHTML = '';
  const role = State.currentUser.role;

  const views = {
    employee: {
      dashboard: renderEmployeeDashboard,
      'my-goals': renderMyGoals,
      achievements: renderAchievements,
    },
    manager: {
      dashboard: renderManagerDashboard,
      'team-goals': renderTeamGoals,
      approvals: renderApprovals,
      checkins: renderManagerCheckins,
      'shared-goals': renderSharedGoalsAdmin,
    },
    admin: {
      dashboard: renderAdminDashboard,
      'all-goals': renderAllGoals,
      completion: renderCompletion,
      audit: renderAuditTrail,
      cycles: renderCycleConfig,
      unlock: renderGoalUnlock,
      'shared-goals': renderSharedGoalsAdmin,
    }
  };

  const fn = views[role]?.[viewId];
  if (fn) {
    area.innerHTML = fn();
    attachViewListeners(viewId, role);
  } else {
    area.innerHTML = `<div class="empty-state"><div class="empty-icon">🚧</div><h3>Coming Soon</h3></div>`;
  }
}

function attachViewListeners(viewId, role) {
  // Delegate to views.js
  if (typeof attachListeners === 'function') attachListeners(viewId, role);
}

// ============================================================