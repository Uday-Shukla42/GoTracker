// GoTracker — Data Layer
// ============================================================

const DB = {
  users: [
    { id: 'emp1', name: 'Priya Sharma', role: 'employee', managerId: 'mgr1', dept: 'Technology', password: 'pass123' },
    { id: 'emp2', name: 'Rahul Verma', role: 'employee', managerId: 'mgr1', dept: 'Technology', password: 'pass123' },
    { id: 'emp3', name: 'Anita Singh', role: 'employee', managerId: 'mgr2', dept: 'Operations', password: 'pass123' },
    { id: 'emp4', name: 'Deepak Kumar', role: 'employee', managerId: 'mgr2', dept: 'Operations', password: 'pass123' },
    { id: 'mgr1', name: 'Vikram Mehta', role: 'manager', managerId: null, dept: 'Technology', password: 'pass123' },
    { id: 'mgr2', name: 'Sunita Rao', role: 'manager', managerId: null, dept: 'Operations', password: 'pass123' },
    { id: 'admin', name: 'Admin User', role: 'admin', managerId: null, dept: 'HR', password: 'pass123' },
  ],

  thrustAreas: [
    'Revenue Growth', 'Cost Optimisation', 'Customer Satisfaction',
    'Digital Transformation', 'People Development', 'Operational Excellence',
    'Safety & Compliance', 'Innovation'
  ],

  uomTypes: ['Numeric (Min)', 'Numeric (Max)', '%  (Min)', '% (Max)', 'Timeline', 'Zero-based'],

  cycles: [
    { id: 'cy2025', name: 'FY 2025-26', year: '2025-26', status: 'active', openDate: '2025-05-01' }
  ],

  goals: [
    // emp1's goals (approved)
    {
      id: 'g1', employeeId: 'emp1', cycleId: 'cy2025',
      thrustArea: 'Revenue Growth', title: 'Increase Q4 Sales Revenue',
      description: 'Achieve 15% growth in Q4 sales compared to Q4 last year through new client acquisition.',
      uom: 'Numeric (Min)', target: 150, weightage: 30,
      status: 'approved', shared: false, sharedFrom: null,
      achievements: { Q1: { value: 35, status: 'On Track', score: null },
                      Q2: { value: 78, status: 'On Track', score: null },
                      Q3: { value: 112, status: 'On Track', score: null },
                      Q4: { value: null, status: 'Not Started', score: null } },
      checkInComments: {}
    },
    {
      id: 'g2', employeeId: 'emp1', cycleId: 'cy2025',
      thrustArea: 'Customer Satisfaction', title: 'Improve NPS Score',
      description: 'Raise the Net Promoter Score from 42 to 60 by improving customer touchpoints.',
      uom: '% (Min)', target: 60, weightage: 25,
      status: 'approved', shared: false, sharedFrom: null,
      achievements: { Q1: { value: 47, status: 'On Track', score: null },
                      Q2: { value: 54, status: 'On Track', score: null },
                      Q3: { value: null, status: 'Not Started', score: null },
                      Q4: { value: null, status: 'Not Started', score: null } },
      checkInComments: {}
    },
    {
      id: 'g3', employeeId: 'emp1', cycleId: 'cy2025',
      thrustArea: 'Operational Excellence', title: 'Reduce Support TAT',
      description: 'Reduce average ticket resolution time from 48hrs to 24hrs.',
      uom: 'Numeric (Max)', target: 24, weightage: 20,
      status: 'approved', shared: false, sharedFrom: null,
      achievements: { Q1: { value: 40, status: 'On Track', score: null },
                      Q2: { value: 30, status: 'On Track', score: null },
                      Q3: { value: null, status: 'Not Started', score: null },
                      Q4: { value: null, status: 'Not Started', score: null } },
      checkInComments: {}
    },
    {
      id: 'g4', employeeId: 'emp1', cycleId: 'cy2025',
      thrustArea: 'Safety & Compliance', title: 'Zero Safety Incidents',
      description: 'Maintain zero safety incidents for the entire fiscal year.',
      uom: 'Zero-based', target: 0, weightage: 15,
      status: 'approved', shared: false, sharedFrom: null,
      achievements: { Q1: { value: 0, status: 'Completed', score: null },
                      Q2: { value: 0, status: 'Completed', score: null },
                      Q3: { value: null, status: 'Not Started', score: null },
                      Q4: { value: null, status: 'Not Started', score: null } },
      checkInComments: { Q1: 'Great job maintaining safety standards. Keep it up!', Q2: 'Excellent — continue the streak.' }
    },
    {
      id: 'g5', employeeId: 'emp1', cycleId: 'cy2025',
      thrustArea: 'People Development', title: 'Complete Training Hours',
      description: 'Complete at least 40 hours of professional development training.',
      uom: 'Numeric (Min)', target: 40, weightage: 10,
      status: 'approved', shared: false, sharedFrom: null,
      achievements: { Q1: { value: 12, status: 'On Track', score: null },
                      Q2: { value: 28, status: 'On Track', score: null },
                      Q3: { value: null, status: 'Not Started', score: null },
                      Q4: { value: null, status: 'Not Started', score: null } },
      checkInComments: {}
    },
    // emp2's goals (pending approval)
    {
      id: 'g6', employeeId: 'emp2', cycleId: 'cy2025',
      thrustArea: 'Digital Transformation', title: 'Launch New Product Module',
      description: 'Design and deploy the new customer portal module by Q3.',
      uom: 'Timeline', target: '2025-10-31', weightage: 40,
      status: 'submitted', shared: false, sharedFrom: null,
      achievements: { Q1: { value: null, status: 'Not Started', score: null },
                      Q2: { value: null, status: 'Not Started', score: null },
                      Q3: { value: null, status: 'Not Started', score: null },
                      Q4: { value: null, status: 'Not Started', score: null } },
      checkInComments: {}
    },
    {
      id: 'g7', employeeId: 'emp2', cycleId: 'cy2025',
      thrustArea: 'Cost Optimisation', title: 'Reduce Cloud Infrastructure Cost',
      description: 'Reduce monthly AWS spend by 20% through rightsizing and reserved instances.',
      uom: '% (Min)', target: 20, weightage: 35,
      status: 'submitted', shared: false, sharedFrom: null,
      achievements: { Q1: { value: null, status: 'Not Started', score: null },
                      Q2: { value: null, status: 'Not Started', score: null },
                      Q3: { value: null, status: 'Not Started', score: null },
                      Q4: { value: null, status: 'Not Started', score: null } },
      checkInComments: {}
    },
    {
      id: 'g8', employeeId: 'emp2', cycleId: 'cy2025',
      thrustArea: 'People Development', title: 'Mentor Junior Developers',
      description: 'Conduct bi-weekly mentoring sessions for 2 junior team members.',
      uom: 'Numeric (Min)', target: 24, weightage: 25,
      status: 'submitted', shared: false, sharedFrom: null,
      achievements: { Q1: { value: null, status: 'Not Started', score: null },
                      Q2: { value: null, status: 'Not Started', score: null },
                      Q3: { value: null, status: 'Not Started', score: null },
                      Q4: { value: null, status: 'Not Started', score: null } },
      checkInComments: {}
    },
    // emp3 goals (draft)
    {
      id: 'g9', employeeId: 'emp3', cycleId: 'cy2025',
      thrustArea: 'Operational Excellence', title: 'Process Improvement Initiative',
      description: 'Document and streamline 5 key operational processes.',
      uom: 'Numeric (Min)', target: 5, weightage: 50,
      status: 'draft', shared: false, sharedFrom: null,
      achievements: { Q1: { value: null, status: 'Not Started', score: null },
                      Q2: { value: null, status: 'Not Started', score: null },
                      Q3: { value: null, status: 'Not Started', score: null },
                      Q4: { value: null, status: 'Not Started', score: null } },
      checkInComments: {}
    },
    {
      id: 'g10', employeeId: 'emp3', cycleId: 'cy2025',
      thrustArea: 'Customer Satisfaction', title: 'Improve First Call Resolution',
      description: 'Increase FCR rate from 70% to 85%.',
      uom: '% (Min)', target: 85, weightage: 50,
      status: 'draft', shared: false, sharedFrom: null,
      achievements: { Q1: { value: null, status: 'Not Started', score: null },
                      Q2: { value: null, status: 'Not Started', score: null },
                      Q3: { value: null, status: 'Not Started', score: null },
                      Q4: { value: null, status: 'Not Started', score: null } },
      checkInComments: {}
    }
  ],

  auditLog: [
    { id: 'a1', timestamp: '2025-05-03 09:14', userId: 'emp1', action: 'Goal submitted for approval', goalId: 'g1', detail: 'Goal "Increase Q4 Sales Revenue" submitted' },
    { id: 'a2', timestamp: '2025-05-05 11:32', userId: 'mgr1', action: 'Goal approved', goalId: 'g1', detail: 'Manager approved goal sheet for Priya Sharma' },
    { id: 'a3', timestamp: '2025-07-10 14:20', userId: 'emp1', action: 'Q1 Achievement logged', goalId: 'g1', detail: 'Q1 actual: 35 (target: 150)' },
    { id: 'a4', timestamp: '2025-07-12 10:05', userId: 'mgr1', action: 'Check-in comment added', goalId: 'g4', detail: 'Q1 check-in comment added for Priya Sharma' },
  ],

  nextId: 100,
};

// ============================================================
// State
// ============================================================

const State = {
  currentUser: null,
  currentView: null,
};

// ============================================================
// Auth
// ============================================================

function login(username, password) {
  const user = DB.users.find(u => u.id === username && u.password === password);
  if (!user) return null;
  State.currentUser = user;
  return user;
}

function logout() {
  State.currentUser = null;
}

// ============================================================
// Data Helpers
// ============================================================

function getGoalsByEmployee(empId, cycleId) {
  return DB.goals.filter(g => g.employeeId === empId && g.cycleId === cycleId);
}

function getTeamGoals(managerId, cycleId) {
  const teamMembers = DB.users.filter(u => u.managerId === managerId);
  return teamMembers.map(emp => ({
    employee: emp,
    goals: DB.goals.filter(g => g.employeeId === emp.id && g.cycleId === cycleId)
  }));
}

function getAllGoals(cycleId) {
  return DB.goals.filter(g => g.cycleId === cycleId);
}

function getUser(id) {
  return DB.users.find(u => u.id === id);
}

function addGoal(goal) {
  goal.id = 'g' + (DB.nextId++);
  DB.goals.push(goal);
  addAudit(State.currentUser.id, 'Goal created (draft)', goal.id, `Goal "${goal.title}" created`);
  return goal;
}

function updateGoal(id, updates) {
  const idx = DB.goals.findIndex(g => g.id === id);
  if (idx === -1) return false;
  DB.goals[idx] = { ...DB.goals[idx], ...updates };
  return true;
}

function deleteGoal(id) {
  const idx = DB.goals.findIndex(g => g.id === id);
  if (idx === -1) return false;
  DB.goals.splice(idx, 1);
  return true;
}

function submitGoals(empId, cycleId) {
  const goals = getGoalsByEmployee(empId, cycleId).filter(g => g.status === 'draft');
  goals.forEach(g => {
    g.status = 'submitted';
    addAudit(empId, 'Goal submitted', g.id, `Goal "${g.title}" submitted for approval`);
  });
}

function approveGoal(goalId, managerId) {
  const goal = DB.goals.find(g => g.id === goalId);
  if (!goal) return;
  goal.status = 'approved';
  addAudit(managerId, 'Goal approved', goalId, `Goal "${goal.title}" approved`);
}

function rejectGoal(goalId, managerId) {
  const goal = DB.goals.find(g => g.id === goalId);
  if (!goal) return;
  goal.status = 'draft';
  addAudit(managerId, 'Goal returned for rework', goalId, `Goal "${goal.title}" returned for rework`);
}

function saveAchievement(goalId, quarter, value, status) {
  const goal = DB.goals.find(g => g.id === goalId);
  if (!goal) return;
  if (!goal.achievements[quarter]) goal.achievements[quarter] = {};
  goal.achievements[quarter].value = value;
  goal.achievements[quarter].status = status;
  goal.achievements[quarter].score = computeScore(goal, value);
  addAudit(State.currentUser.id, `${quarter} achievement logged`, goalId,
    `Achievement value: ${value}, status: ${status}`);
}

function saveCheckInComment(goalId, quarter, comment) {
  const goal = DB.goals.find(g => g.id === goalId);
  if (!goal) return;
  goal.checkInComments[quarter] = comment;
  addAudit(State.currentUser.id, 'Check-in comment added', goalId,
    `Q ${quarter} comment: "${comment.substring(0, 60)}..."`);
}

function unlockGoal(goalId) {
  const goal = DB.goals.find(g => g.id === goalId);
  if (!goal) return;
  goal.status = 'draft';
  addAudit(State.currentUser.id, 'Goal unlocked by admin', goalId, `Goal "${goal.title}" unlocked`);
}

function pushSharedGoal(title, description, thrustArea, uom, target, employeeIds, cycleId) {
  employeeIds.forEach(empId => {
    const goal = {
      id: 'g' + (DB.nextId++),
      employeeId: empId,
      cycleId,
      thrustArea, title, description, uom, target,
      weightage: 10,
      status: 'approved',
      shared: true,
      sharedFrom: State.currentUser.id,
      achievements: {
        Q1: { value: null, status: 'Not Started', score: null },
        Q2: { value: null, status: 'Not Started', score: null },
        Q3: { value: null, status: 'Not Started', score: null },
        Q4: { value: null, status: 'Not Started', score: null }
      },
      checkInComments: {}
    };
    DB.goals.push(goal);
    addAudit(State.currentUser.id, 'Shared goal pushed', goal.id,
      `Shared goal "${title}" pushed to employee ${empId}`);
  });
}

function addAudit(userId, action, goalId, detail) {
  const now = new Date();
  const ts = now.toISOString().slice(0, 16).replace('T', ' ');
  DB.auditLog.unshift({
    id: 'a' + (DB.nextId++),
    timestamp: ts,
    userId, action, goalId, detail
  });
}

// ============================================================
// Scoring
// ============================================================

function computeScore(goal, value) {
  if (value === null || value === undefined || value === '') return null;
  const uom = goal.uom;
  const target = parseFloat(goal.target);
  const actual = parseFloat(value);

  if (uom === 'Zero-based') {
    return actual === 0 ? 100 : 0;
  }
  if (uom === 'Numeric (Min)' || uom === '% (Min)') {
    if (target === 0) return 100;
    return Math.min(Math.round((actual / target) * 100), 150);
  }
  if (uom === 'Numeric (Max)' || uom === '% (Max)') {
    if (actual === 0) return 150;
    return Math.min(Math.round((target / actual) * 100), 150);
  }
  if (uom === 'Timeline') {
    // value = completion date, target = deadline date
    const deadline = new Date(goal.target);
    const completed = new Date(value);
    const diff = deadline - completed;
    if (diff >= 0) return 100;
    return 0;
  }
  return null;
}

function getScoreColor(score) {
  if (score === null) return 'gray';
  if (score >= 100) return 'green';
  if (score >= 70) return 'yellow';
  return 'red';
}

// ============================================================
// Validation
// ============================================================

function validateGoalSheet(empId, cycleId, excludeId) {
  const goals = getGoalsByEmployee(empId, cycleId).filter(g => g.id !== excludeId);
  const errors = [];
  const total = goals.reduce((s, g) => s + (parseFloat(g.weightage) || 0), 0);
  if (goals.length >= 8) errors.push('Maximum 8 goals allowed per employee.');
  return errors;
}

function validateWeightage(goals) {
  const total = goals.reduce((s, g) => s + (parseFloat(g.weightage) || 0), 0);
  const errors = [];
  if (Math.round(total) !== 100) errors.push(`Total weightage must be 100%. Currently: ${total}%`);
  goals.forEach(g => {
    if (parseFloat(g.weightage) < 10) errors.push(`Goal "${g.title}" has weightage below 10%.`);
  });
  return errors;
}

// ============================================================
// Reporting / Export
// ============================================================

function exportCSV() {
  const cycle = DB.cycles[0];
  const rows = [
    ['Employee', 'Department', 'Goal', 'Thrust Area', 'UoM', 'Target', 'Weightage',
     'Q1 Actual', 'Q1 Score', 'Q2 Actual', 'Q2 Score', 'Q3 Actual', 'Q3 Score', 'Q4 Actual', 'Q4 Score']
  ];

  DB.users.filter(u => u.role === 'employee').forEach(emp => {
    const goals = getGoalsByEmployee(emp.id, cycle.id);
    goals.forEach(g => {
      rows.push([
        emp.name, emp.dept, g.title, g.thrustArea, g.uom, g.target, g.weightage + '%',
        g.achievements.Q1?.value ?? '', g.achievements.Q1?.score ?? '',
        g.achievements.Q2?.value ?? '', g.achievements.Q2?.score ?? '',
        g.achievements.Q3?.value ?? '', g.achievements.Q3?.score ?? '',
        g.achievements.Q4?.value ?? '', g.achievements.Q4?.score ?? '',
      ]);
    });
  });

  const csv = rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `GoTracker_Achievement_Report_${cycle.name.replace(/ /g,'_')}.csv`;
  a.click();
}

// ============================================================