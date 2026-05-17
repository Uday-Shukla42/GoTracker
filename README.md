# GoTracker — Goal Setting & Tracking Portal
### GoTracker Hackathon 1.0

---

## 📁 Project Structure

```
gotracker/
│
├── index.html          ← Main entry point (open this to run the app)
│
├── css/
│   └── style.css       ← All visual styling (colours, layout, animations)
│
├── js/
│   ├── data.js         ← Database, users, goals, scoring logic
│   ├── app.js          ← Navigation, modal, toast notification system
│   ├── views.js        ← HTML for every page/screen (dashboards, tables)
│   └── main.js         ← Login logic + all button/click event handlers
│
└── README.md           ← This file
```

---

## 🚀 How to Run

### Option 1 — VS Code Live Server (Recommended)
1. Install [VS Code](https://code.visualstudio.com/)
2. Install the **Live Server** extension (search in Extensions panel)
3. Open the `gotracker/` folder in VS Code
4. Right-click `index.html` → **Open with Live Server**
5. Browser opens at `http://localhost:5500` ✅

### Option 2 — Python (if you have Python installed)
```bash
cd gotracker
python -m http.server 8000
# Then open http://localhost:8000 in your browser
```

### ⚠️ Why not double-click?
Browsers block loading of local CSS/JS files from other folders when
you open HTML directly. Use Live Server or Python to avoid this.

---

## 🔑 Login Credentials

| Role       | Username | Password |
|------------|----------|----------|
| Employee   | emp1     | pass123  |
| Employee 2 | emp2     | pass123  |
| Manager    | mgr1     | pass123  |
| Admin / HR | admin    | pass123  |

Click a role button on the login screen — it auto-fills the credentials.

---

## 📄 File-by-File Explanation

---

### `index.html`
The **shell** of the application. It contains:
- The login screen HTML structure
- The sidebar + main content layout
- The modal (popup dialog) structure
- `<script>` tags at the bottom that load all JS files in order

It does NOT contain any logic — just HTML structure.
All content inside the main area is injected by `views.js`.

---

### `css/style.css`
All the visual design lives here. Organised into sections:

| Section          | What it does |
|------------------|--------------|
| `:root` variables | Colours, fonts, spacing — change these to retheme the whole app |
| Login styles     | Background orbs, card, role buttons |
| Buttons          | `.btn-primary`, `.btn-secondary`, `.btn-danger` etc. |
| Sidebar          | Fixed left nav, user chip, nav items |
| Cards            | `.card`, `.stat-card`, `.goal-card` |
| Tables           | `.table-wrap`, `thead`, `tbody` |
| Badges           | `.badge-green`, `.badge-red` etc. |
| Modal            | Popup dialog overlay |
| Toast            | Bottom-right notification popups |
| Animations       | `fadeUp`, `modalPop`, `drift` orb animations |
| Responsive       | Mobile breakpoints |

**Theme colours** (edit in `:root` to change the whole theme):
- `--accent` = Forest green `#3d7a52` (primary buttons, active nav)
- `--sky`    = Sky blue `#3a7fbf` (info badges)
- `--bg`     = Soft sage white `#f2f5f0` (page background)

---

### `js/data.js`
The **data layer** — think of this as a mini database running in memory.

Contains:
- `DB.users[]` — all 7 users (employees, managers, admin)
- `DB.goals[]` — all goals with achievements and check-in comments
- `DB.cycles[]` — the active financial year cycle
- `DB.thrustAreas[]` — the 8 thrust area categories
- `DB.uomTypes[]` — Unit of Measurement types

Key functions:

| Function | What it does |
|----------|--------------|
| `login(username, password)` | Checks credentials, returns user or null |
| `getGoalsByEmployee(empId, cycleId)` | Gets all goals for one employee |
| `getTeamGoals(managerId, cycleId)` | Gets all goals for a manager's team |
| `addGoal(goal)` | Adds a new goal to the DB |
| `updateGoal(id, updates)` | Updates an existing goal |
| `deleteGoal(id)` | Removes a goal |
| `submitGoals(empId, cycleId)` | Changes draft goals → submitted |
| `approveGoal(goalId, managerId)` | Approves a goal, locks it |
| `rejectGoal(goalId, managerId)` | Returns goal to draft |
| `saveAchievement(goalId, q, value, status)` | Logs quarterly achievement |
| `saveCheckInComment(goalId, q, comment)` | Manager adds check-in note |
| `unlockGoal(goalId)` | Admin reverts approved → draft |
| `pushSharedGoal(...)` | Admin/Manager pushes KPI to employees |
| `computeScore(goal, value)` | Calculates % score based on UoM type |
| `validateWeightage(goals)` | Checks 100% total, min 10% rules |
| `exportCSV()` | Downloads achievement report as CSV |
| `addAudit(...)` | Logs every action to audit trail |

---

### `js/app.js`
The **navigation and UI utilities** layer.

Contains:
- `showToast(message, type)` — shows a notification popup (success/error/info)
- `openModal(title, body, footer)` — opens the popup dialog
- `closeModal()` — closes the popup
- `NAV_CONFIG` — defines which nav links appear per role (employee/manager/admin)
- `buildSidebar()` — builds the left sidebar for the logged-in user
- `navigate(viewId)` — switches between views/pages
- `renderView(viewId)` — calls the correct render function from `views.js`

---

### `js/views.js`
The **page renderer** — every screen the user sees is built here.

Each function returns an HTML string that gets injected into `#content-area`.

| Function | Role | What it shows |
|----------|------|---------------|
| `renderEmployeeDashboard()` | Employee | Stats, goal status overview, check-in summary |
| `renderMyGoals()` | Employee | List of own goals with add/edit/delete/submit |
| `renderAchievements()` | Employee | Quarter-by-quarter achievement input table |
| `renderManagerDashboard()` | Manager | Team overview, pending approvals count |
| `renderApprovals()` | Manager | Goal sheets pending review with inline editing |
| `renderTeamGoals()` | Manager | All team members' goals in one view |
| `renderManagerCheckins()` | Manager | Tabbed Q1-Q4 check-in interface |
| `renderAdminDashboard()` | Admin | Org-wide stats, recent audit events |
| `renderAllGoals()` | Admin | Every goal across all employees |
| `renderCompletion()` | Admin | Who has completed check-ins (employee & manager) |
| `renderAuditTrail()` | Admin | Full log of all changes |
| `renderCycleConfig()` | Admin | Goal setting schedule/windows |
| `renderGoalUnlock()` | Admin | Unlock approved goals for editing |
| `renderSharedGoalsAdmin()` | Admin/Manager | Push shared KPIs to employees |

Helper functions (used inside views):
- `statusBadge(status)` — returns coloured HTML badge
- `scoreDisplay(score)` — returns score as coloured badge
- `weightageBar(goals)` — coloured bar showing weightage split
- `cycleBanner()` — the green banner showing active cycle

---

### `js/main.js`
The **event handler** — wires up all the buttons and interactions.

| Section | What it handles |
|---------|-----------------|
| Login   | Role button clicks, form submit, credential check |
| Logout  | Clears state, returns to login screen |
| `attachListeners(viewId)` | Called after each view renders — attaches the right listeners |
| `attachMyGoalsListeners()` | Add goal, edit goal, delete goal, submit all |
| `openAddGoalModal()` | Opens the goal creation form in a modal |
| `saveGoalForm()` | Validates and saves new/edited goal |
| `attachAchievementListeners()` | Save button for each quarter's achievement |
| `attachApprovalListeners()` | Approve/reject buttons for manager |
| `attachCheckinListeners()` | Save comment button for manager check-ins |
| `attachUnlockListeners()` | Admin goal unlock button |
| `attachSharedGoalListeners()` | Push shared goal button |

---

## 🎯 User Journeys

### Employee Journey
1. Login as `emp1`
2. Dashboard → see goal summary
3. My Goals → Add a new goal → fill form → save
4. My Goals → Submit All Goals (validates 100% weightage)
5. Achievements → enter Q1/Q2/Q3/Q4 actuals → Save

### Manager Journey
1. Login as `mgr1`
2. Approvals → review submitted goals → edit target/weightage inline → Approve All
3. Check-ins → select quarter → view planned vs actual → add comment → Save

### Admin Journey
1. Login as `admin`
2. Dashboard → overview stats + recent audit
3. All Goals → see every goal across org → Export CSV
4. Completion → check who has submitted check-ins
5. Audit Trail → full change history
6. Goal Unlock → revert an approved goal to draft
7. Shared Goals → push a KPI to selected employees

---

## ✅ Business Rules Implemented

| Rule | Where enforced |
|------|----------------|
| Max 8 goals per employee | `data.js → addGoal()` + `main.js → saveGoalForm()` |
| Min 10% weightage per goal | `main.js → saveGoalForm()` |
| Total weightage must = 100% | `data.js → validateWeightage()` + `main.js → handleSubmitAll()` |
| Goals locked after approval | `views.js` checks `g.status === 'approved'` before showing edit buttons |
| Shared goals: weightage editable, title/target read-only | `views.js → renderSharedGoalsAdmin()` |
| Score formula per UoM type | `data.js → computeScore()` |
| All changes audit-logged | `data.js → addAudit()` called in every mutation |
