# BUILD.md — HR Admin Portal
> Your step-by-step manual for building the app from zero to finished.
> Work through this top to bottom. Check off every item as you go.
> Never skip a test. Never move to the next stage if a test fails.

---

## Before You Write a Single Line of Code

### Setup checklist
- [ ] Create project folder: `Admin-Portal`
- [ ] Place `CLAUDE.md` in the root of that folder
- [ ] Create empty folder structure as defined in the File Map in `CLAUDE.md`
- [ ] Open the folder in VS Code
- [ ] Connect to your GitHub repo: `landmarkplus2016-byte/Admin-Portal`

### First message to Claude Code — copy and paste this exactly:
```
Read CLAUDE.md first and confirm you understand the project before writing any code.
Then create the full folder and file structure as defined in the File Map section —
empty files only, no code yet.
Do not write any logic until I confirm the structure looks correct.
```

### After structure is created — verify before moving on:
- [ ] All folders exist: `pages/`, `js/`
- [ ] All files listed in the File Map exist and are empty
- [ ] `CLAUDE.md` is in the root
- [ ] No code has been written yet

---

## Stage 1 — Foundation: Shell, Layout, Sidebar

**Goal:** All pages exist, sidebar navigates between them, design system applied, looks professional.

---

### Step 1.1 — Global Styles (`styles.css`)

**Prompt:**
```
Read CLAUDE.md. We are on Stage 1, Step 1.
Build styles.css only — no HTML or JS yet.

styles.css must define:
- All CSS variables from the Design System section of CLAUDE.md (colors, radius, shadows)
- CSS reset: box-sizing border-box, margin 0, padding 0 on all elements
- Body: Inter font via Google Fonts CDN @import, bg color var(--color-bg)
- Layout: .layout class = flex row, full viewport height
- Sidebar: .sidebar = 240px fixed width, full height, var(--color-sidebar) bg,
  flex column, padding 20px 0
- Sidebar logo area: .sidebar-logo = 56px height, padding 0 20px, white text, 18px 600 weight
- Nav items: .nav-item = flex row, align center, 44px height, padding 0 20px,
  var(--color-sidebar-text) color, no underline, 14px, gap 12px, cursor pointer
- Nav item hover: slightly lighter bg (#232d47)
- Nav item active: .nav-item.active = white text, accent left border 3px solid var(--color-accent),
  bg rgba(255,255,255,0.08)
- Nav icons: .nav-icon = 18px × 18px
- Main area: .main = flex-1, flex column, overflow hidden
- Top bar: .topbar = 56px height, white bg, border-bottom, flex row align center,
  padding 0 24px, justify space-between
- Page title: .page-title = 18px 600 weight var(--color-text)
- Content area: .content = flex-1, overflow-y auto, padding 24px, bg var(--color-bg)
- Cards: .card = white bg, 8px radius, shadow, padding 24px
- Summary cards grid: .summary-grid = grid, 4 columns, 16px gap
- Summary card: .summary-card = .card with accent top border 3px, flex column, gap 8px
- Summary card value: 28px 700 weight var(--color-text)
- Summary card label: 13px var(--color-text-muted)
- Summary card count: 13px var(--color-text-muted)
- Tables: .table-wrapper = card, padding 0, overflow hidden
- Table: width 100%, border-collapse collapse
- Thead: sticky top 0, bg var(--color-bg), border-bottom 2px solid var(--color-border)
- Th: 12px 600 uppercase letter-spacing 0.05em var(--color-text-muted),
  padding 12px 16px, text-align left, cursor pointer, user-select none
- Th hover: var(--color-text) color
- Th sort arrow: .sort-asc::after content '↑', .sort-desc::after content '↓',
  margin-left 4px, var(--color-accent) color
- Td: 14px var(--color-text), padding 12px 16px, border-bottom 1px solid var(--color-border)
- Tr even: bg #f8fafc
- Tr hover: bg #eff6ff cursor pointer
- Filter bar: .filter-bar = flex row, gap 12px, margin-bottom 16px, align center, flex-wrap wrap
- Search input: .search-input = flex-1 min-width 200px, 36px height, border, 6px radius,
  padding 0 12px, 14px, outline none — focus: border var(--color-accent)
- Filter select: .filter-select = 36px height, border, 6px radius, padding 0 10px, 14px,
  bg white, outline none — focus: border var(--color-accent)
- Record count: .record-count = 13px var(--color-text-muted), margin-left auto
- Badges: .badge = inline-flex, 4px radius, 4px 10px padding, 12px 500 weight
  .badge-success bg #dcfce7 color #15803d
  .badge-warning bg #fef9c3 color #a16207
  .badge-danger bg #fee2e2 color #b91c1c
  .badge-info bg #cffafe color #0e7490
  .badge-neutral bg #f1f5f9 color #475569
- Buttons: .btn-primary and .btn-secondary as per Design System
- Empty state: .empty-state = text-center, padding 48px, var(--color-text-muted)
- Modal overlay: .modal-overlay = fixed inset 0, bg rgba(0,0,0,0.5), z-index 1000,
  display flex, align center, justify center
- Modal: .modal = white bg, 8px radius, 560px max-width, 90vw width, max-height 90vh,
  overflow-y auto, padding 24px, flex column, gap 16px
- Modal header: flex row, justify space-between, align center
- Modal title: 18px 600 weight
- Form group: .form-group = flex column, gap 6px
- Form label: 13px 500 weight var(--color-text-muted)
- Form input/select/textarea: width 100%, border, 6px radius, padding 8px 12px, 14px,
  outline none — focus border var(--color-accent)
- Backup warning banner: .backup-warning = amber bg #fef9c3, border #fde047,
  padding 12px 20px, border-radius 8px, 14px, flex row align center gap 8px
- Danger zone: .danger-zone = border 1px solid var(--color-danger), 8px radius, padding 20px

No HTML, no JS. CSS only.
```

**Tests for Step 1.1:**
- [ ] `styles.css` file exists and has content
- [ ] No CSS syntax errors (open in browser, check console)
- [ ] All CSS variables defined in `:root`

---

### Step 1.2 — App Shell + Sidebar (`index.html`, `app.js`)

**Prompt:**
```
Read CLAUDE.md. Stage 1, Step 2.
Build index.html (Dashboard page shell) and app.js (shared utilities).

index.html must:
- Load Inter from Google Fonts CDN in <head>
- Link styles.css
- Have the full sidebar HTML with all 6 nav items:
  Dashboard (house icon), Settlements (list icon), Expenses (receipt icon),
  Invoices (file icon), Allowances (gift icon), Settings (gear icon)
- Each nav item is an <a> tag linking to the correct page
- Have .main area with .topbar (title: "Dashboard") and empty .content div
- Load app.js at bottom of body
- Load js/data.js at bottom of body (before app.js)

app.js must:
- On DOMContentLoaded: read current page filename from window.location.pathname
  and add class 'active' to the matching sidebar nav item
- Define and export these utility functions (on window object):
  formatDate(iso) → 'DD/MM/YYYY' string
  formatCurrency(value) → '1,234 EGP' string
  generateId(prefix) → unique ID string
  formatDateInput(iso) → 'YYYY-MM-DD' for date input value
  debounce(fn, delay) → debounced function
- openModal(title, bodyHTML, buttons) → renders modal into #modal-container,
  closes on backdrop click and Escape key
  buttons is array of { label, class, onClick } objects
- closeModal() → removes modal
- showToast(message, type) → shows a 3-second toast notification
  (type: 'success', 'error', 'warning')
- Add #modal-container div and #toast-container div to body

index.html content area must stay empty for now — just the shell.
```

**Tests for Step 1.2:**
- [ ] Open `index.html` in Chrome — no console errors
- [ ] Sidebar visible with all 6 nav items
- [ ] Dashboard nav item has `active` class and styling
- [ ] Clicking any nav item navigates to that page (404 is fine — pages don't exist yet)
- [ ] No broken asset references in Network tab

---

### Step 1.3 — All Page Shells (`pages/*.html`)

**Prompt:**
```
Read CLAUDE.md. Stage 1, Step 3.
Create all 5 page shells — same sidebar structure as index.html, different titles.

Create pages/settlements.html:
- Same sidebar as index.html (copy exactly)
- Topbar title: "Settlements"
- Content area: just an <h2> placeholder "Settlements data will go here"
- Load: styles.css (../styles.css), ../app.js, ../js/data.js, ../js/settlements.js

Create pages/expenses.html:
- Topbar title: "Expenses"
- Content placeholder
- Load: styles.css, ../app.js, ../js/data.js, ../js/expenses.js

Create pages/invoices.html:
- Topbar title: "Invoices & Dues"
- Content placeholder
- Load: styles.css, ../app.js, ../js/data.js, ../js/invoices.js

Create pages/allowances.html:
- Topbar title: "Allowances"
- Content placeholder
- Load: styles.css, ../app.js, ../js/data.js, ../js/allowances.js

Create pages/settings.html:
- Topbar title: "Settings"
- Content placeholder
- Load: styles.css, ../app.js, ../js/data.js, ../js/settings.js

All page JS files (settlements.js, expenses.js, etc.) should be empty for now.
data.js should be empty for now.
```

**Tests for Step 1.3:**
- [ ] All 5 pages open in browser with no console errors
- [ ] Sidebar visible on every page
- [ ] Correct nav item is highlighted as active on each page
- [ ] Page titles are correct in topbar
- [ ] Clicking any sidebar link navigates correctly between all pages

### ✅ Stage 1 Complete — Full check before moving on:
- [ ] All 6 pages (index + 5) open without errors
- [ ] Sidebar navigation works between all pages
- [ ] Correct active state on every page
- [ ] Design looks clean — navy sidebar, white content, correct typography
- [ ] No console errors on any page

---

## Stage 2 — Data Layer (`js/data.js`)

**Goal:** All data storage and retrieval in one place. Every other JS file uses these functions.

---

### Step 2.1 — Build `js/data.js`

**Prompt:**
```
Read CLAUDE.md. Stage 2, Step 1.
Build js/data.js — the ONLY file that touches localStorage.

Storage keys (define as constants at top):
  KEYS.settlements = 'hrap_settlements'
  KEYS.expenses    = 'hrap_expenses'
  KEYS.invoices    = 'hrap_invoices'
  KEYS.allowances  = 'hrap_allowances'
  KEYS.meta        = 'hrap_meta'

Reference data (define as constants — used by all pages for dropdowns):
  DEPARTMENTS = ['AQ', 'Con', 'Plus', 'Telecom', 'Mark', 'Transportation Mark',
    'Transportation Plus', 'Fabrications', 'Acc', 'IT', 'Safety T', 'Safety C']

  SETTLEMENT_ENGINEERS = ['Shady', 'Amr', 'Fleet', 'Mohannad', 'Mostafa',
    'Birary', 'Amr Sabry', 'Ayman', 'Amer', 'Hussein']

  EXPENSE_MANAGERS = ['A. Fawzy', 'A. Talaat', 'A. Ali', 'Mohsen', 'Amr Refaat',
    'S. Kamel', 'Asem', 'Ibrahim', 'Emad', 'Khodary', 'Khaled', 'Tariq', 'Kassem',
    'Sameh', 'Shrief', 'Dalia', 'Taha', 'M. Amin', 'A. Tawfik', 'Ibrahim Habib',
    'Rana', 'Osama C', 'Osama T', 'Saad']

  CONTRACTORS = ['Join', 'Star Tech', 'Almotaheda', 'Basic', 'Otak', 'GSEC']

  APPROVAL_STATUSES = ['Approved', 'Hold', 'Canceled']
  PAYMENT_METHODS = ['transfer', 'cash']

For each of the 4 tables, implement these functions (settlements shown, repeat for others):

  getSettlements()
    → parse localStorage[KEYS.settlements] or []
    → return only records where deleted !== true

  getAllSettlements()
    → parse localStorage[KEYS.settlements] or []
    → return ALL records including deleted (for backup)

  saveSettlement(record)
    → get all settlements
    → if record.id exists in array: replace it
    → else: push new record
    → save back to localStorage
    → update meta.updatedAt

  deleteSettlement(id)
    → get all settlements
    → find by id → set deleted: true, updatedAt: now
    → save back

Meta functions:
  getMeta() → parse KEYS.meta or return {}
  saveMeta(updates) → merge updates into existing meta, save

Backup functions:
  exportBackup()
    → collect getAllSettlements(), getAllExpenses(), getAllInvoices(), getAllAllowances()
    → build object: { app, version: '1.0', exported_at, data: { settlements, expenses, invoices, allowances } }
    → JSON.stringify with 2-space indent
    → trigger download as 'hrap_backup_YYYY-MM-DD.json'
    → call saveMeta({ lastBackup: new Date().toISOString() })

  importBackup(jsonString)
    → JSON.parse
    → validate: must have .data, .data.settlements, .data.expenses, .data.invoices, .data.allowances
    → if invalid: throw Error('Invalid backup file')
    → clear all 4 storage keys
    → write each table's array to its storage key
    → saveMeta({ lastBackup: new Date().toISOString() })
    → return counts: { settlements: n, expenses: n, invoices: n, allowances: n }

  getLastBackupDate()
    → getMeta().lastBackup or null

All functions attached to window.Data object so all page JS files can call them.
```

**Tests for Step 2.1:**
- [ ] Open browser console on any page
- [ ] `Data.getSettlements()` returns empty array `[]`
- [ ] `Data.saveSettlement({ id: 'STL-test-1', name: 'Test', value: 100, deleted: false })` — no error
- [ ] `Data.getSettlements()` returns array with 1 item
- [ ] `Data.deleteSettlement('STL-test-1')` — no error
- [ ] `Data.getSettlements()` returns empty array (deleted filtered out)
- [ ] `Data.getAllSettlements()` returns 1 item (including deleted)
- [ ] `Data.exportBackup()` — JSON file downloads
- [ ] Open that JSON — has correct structure with all 4 table keys
- [ ] `Data.importBackup(jsonString)` — no error, returns counts object
- [ ] `Data.getMeta().lastBackup` — has a timestamp after export and import

### ✅ Stage 2 Complete — Full check before moving on:
- [ ] All CRUD functions work for all 4 tables (test each in console)
- [ ] Soft delete works — deleted records filtered from get, included in getAll
- [ ] Export downloads valid JSON
- [ ] Import restores data and returns counts
- [ ] Meta/lastBackup updates after export and import

---

## Stage 3 — Dashboard (`index.html`)

**Goal:** Dashboard shows live summary cards, backup warning, and quick navigation.

---

### Step 3.1 — Dashboard Page

**Prompt:**
```
Read CLAUDE.md. Stage 3, Step 1.
Build the dashboard content in index.html and add dashboard logic to app.js.

Content area of index.html must render:
1. Backup warning banner (if last backup > 7 days ago or never):
   amber banner with warning icon:
   "⚠ You haven't backed up in X days. Go to Settings to export a backup."
   Link "Go to Settings" → pages/settings.html
   Hide banner if backup is recent.

2. Summary cards grid (.summary-grid) — 4 cards:
   Each card shows: icon, label, record count ("112 records"), total value ("EGP 7,975,220")
   Card 1: Settlements — count + sum of value from Data.getSettlements()
   Card 2: Expenses — count + sum from Data.getExpenses()
   Card 3: Invoices — count + sum from Data.getInvoices()
   Card 4: Allowances — count + sum from Data.getAllowances()
   Each card links to its respective page on click

3. Quick stats row below cards:
   "Approved expenses: X" | "Hold: X" | "Canceled: X"
   Pulled live from Data.getExpenses() grouping by approval status

All numbers rendered by calling Data functions directly.
No hardcoded values.
Add dashboard init function called on DOMContentLoaded.
```

**Tests for Step 3.1:**
- [ ] Dashboard loads with 4 summary cards
- [ ] All cards show "0 records" and "EGP 0" on a fresh install (no data yet)
- [ ] Backup warning banner appears (no backups yet)
- [ ] Clicking a summary card navigates to the correct page
- [ ] Add a test settlement in console → refresh dashboard → count updates to 1
- [ ] After export backup → refresh → backup warning banner disappears

### ✅ Stage 3 Complete — Full check before moving on:
- [ ] Dashboard renders without errors
- [ ] Summary cards show live data from storage
- [ ] Backup warning logic works correctly
- [ ] Navigation from cards works

---

## Stage 4 — Settlements Page

**Goal:** Full settlements table with add, edit, delete, search, filter, and sort.

---

### Step 4.1 — Settlements Page (`pages/settlements.html`, `js/settlements.js`)

**Prompt:**
```
Read CLAUDE.md. Stage 4, Step 1.
Build the complete settlements page.

settlements.html content area must contain:
- Filter bar: search input, department filter select, engineer filter select,
  "Add Settlement" button (primary, right side)
- Record count + total: "Showing X records — Total: EGP X,XXX,XXX" (right of filter bar)
- Table wrapper with table inside
- Table columns: Name | Value | Engineer | Received Date | Signature Date |
  Finance Date | Department | Notes
  (With/handler column combined with Engineer for display)

js/settlements.js must:
- On load: call renderSettlements() with no filters
- renderSettlements(filters):
  → get Data.getSettlements()
  → apply search filter: match name, notes (case insensitive)
  → apply department filter if selected
  → apply engineer filter if selected
  → apply current sort
  → update record count and total value display
  → build table HTML and set innerHTML of table body
  → show .empty-state if no results

- Sorting: clicking a column header toggles asc/desc for that column.
  Show sort arrow in header. Default sort: receivedDate desc.

- Search and filter: on any input change → call renderSettlements() immediately
  (use debounce 200ms for search input)

- Add Settlement button → openModal with form:
  Fields: Name (text), Value (number), Engineer (select from SETTLEMENT_ENGINEERS),
  Received Date (date), Signature Date (date), Finance Date (date, optional),
  With (text), Department (select from DEPARTMENTS), Notes (textarea)
  Buttons: [Cancel] [Save]
  On save: validate name and value not empty →
  build record with generateId('STL'), createdAt, updatedAt, deleted: false →
  call Data.saveSettlement(record) → closeModal() → renderSettlements() → showToast success

- Click a table row → openModal with same form pre-filled for editing
  Buttons: [Delete] [Cancel] [Save]
  On save: update record with updatedAt = now → Data.saveSettlement() → re-render
  On delete: confirm dialog "Delete this settlement?" →
  Data.deleteSettlement(id) → closeModal() → renderSettlements() → showToast

- Format all dates with formatDate() and values with formatCurrency() in table display
- Arabic text in Name and Notes: add dir="auto" to those td elements
```

**Tests for Step 4.1:**
- [ ] Settlements page loads with empty table and "0 records" count
- [ ] Click "Add Settlement" → modal opens with all fields
- [ ] Fill form and save → record appears in table → count updates to 1
- [ ] Search by name → table filters in real-time
- [ ] Department filter → table shows only matching department
- [ ] Click a table row → edit modal opens with correct data pre-filled
- [ ] Edit a value → save → table shows updated value
- [ ] Delete a record → confirm → record disappears → count decrements
- [ ] Deleted record still in Data.getAllSettlements() (soft delete check)
- [ ] Sort by Value column → records sort correctly asc then desc
- [ ] Add 5 records → total EGP value shown is correct sum
- [ ] Empty state shows when search matches nothing

### ✅ Stage 4 Complete — Full check before moving on:
- [ ] Add, edit, delete all work
- [ ] Search, filter, sort all work
- [ ] Record count and total are always accurate
- [ ] Dates display as DD/MM/YYYY
- [ ] Values display with commas and EGP
- [ ] Soft delete confirmed working
- [ ] Modal opens and closes correctly

---

## Stage 5 — Expenses Page

**Goal:** Full expenses table — same pattern as Settlements but with approval status badges.

---

### Step 5.1 — Expenses Page (`pages/expenses.html`, `js/expenses.js`)

**Prompt:**
```
Read CLAUDE.md. Stage 5, Step 1.
Build the complete expenses page. Follow exactly the same pattern as settlements.js.

Table columns: Name | Site ID | Value | Received Date | Finance Date |
Payment | Approval | Manager | Department | Notes

Additional filters beyond settlements:
- Approval status filter: All / Approved / Hold / Canceled
- Payment method filter: All / Transfer / Cash

Approval column must render a colored badge using the badge classes from styles.css:
- 'Approved' → .badge.badge-success
- 'Hold' → .badge.badge-warning
- 'Canceled' → .badge.badge-danger

Add/Edit modal fields: Name, Site ID, Value, Received Date, Signature Date,
Finance Date, With, Payment Method (select: transfer/cash),
Approval (select: Approved/Hold/Canceled), Manager (select from EXPENSE_MANAGERS),
Department (select from DEPARTMENTS), Notes

Site ID and Name cells: dir="auto" for Arabic text support
```

**Tests for Step 5.1:**
- [ ] All same tests as Stage 4 pass for Expenses
- [ ] Approval badges show correct colors
- [ ] Approval filter works (show only Approved, or only Hold, etc.)
- [ ] Payment method filter works
- [ ] Site ID displays correctly including Arabic text

### ✅ Stage 5 Complete — same checklist as Stage 4 applied to Expenses.

---

## Stage 6 — Invoices Page

**Goal:** Contractor invoice workflow tracker with multi-stage status visibility.

---

### Step 6.1 — Invoices Page (`pages/invoices.html`, `js/invoices.js`)

**Prompt:**
```
Read CLAUDE.md. Stage 6, Step 1.
Build the complete invoices page.

Table columns: Contractor | Inv. No. | Site ID | Value | Coordinator |
VF Code | Finance Date | Approval | Notes

Filters: Contractor (select from CONTRACTORS), Approval (All/Approved/Rejected), search

Approval badge: Approved → badge-success, Rejected → badge-danger

Add/Edit modal fields: Contractor (select from CONTRACTORS), Received Date,
Invoice No., Site ID, Value, Coordinator (text), Coordinator Date, Coordinator Finished (date),
VF Code (text), Aliaa Date, Aliaa Finished (date), Ashraf/Mohannad Date,
Ashraf/Mohannad Finished (date), Modification (textarea), Finance Date,
Approval (select: Approved/Rejected), With (text), Notes (textarea)

All date fields optional except Received Date.
Show workflow progress in the edit modal as a visual timeline:
Received → Coordinator → VF Code/Aliaa → Ashraf/Mohannad → Finance → Done
Each stage shows its date if filled, greyed out if not yet done.
```

**Tests for Step 6.1:**
- [ ] All standard table tests pass
- [ ] Workflow timeline visible in edit modal
- [ ] Contractor filter works
- [ ] Approval badges correct colors

### ✅ Stage 6 Complete.

---

## Stage 7 — Allowances Page

**Goal:** Allowances/bonus records per department with department tabs.

---

### Step 7.1 — Allowances Page (`pages/allowances.html`, `js/allowances.js`)

**Prompt:**
```
Read CLAUDE.md. Stage 7, Step 1.
Build the complete allowances page.

Table columns: Name | Value | Engineer | Received Date | Signature Date |
Department | Finance Date

Filters: Department filter, Engineer filter (select from SETTLEMENT_ENGINEERS), search

Add/Edit modal fields: Name, Value, Engineer (select from SETTLEMENT_ENGINEERS),
Received Date, Signature Date, Department (select from DEPARTMENTS), Finance Date

Same pattern as all other pages.
```

**Tests for Step 7.1:**
- [ ] All standard table tests pass for Allowances

### ✅ Stage 7 Complete.

---

## Stage 8 — Settings Page

**Goal:** Backup export, import/restore, and data overview all working.

---

### Step 8.1 — Settings Page (`pages/settings.html`, `js/settings.js`)

**Prompt:**
```
Read CLAUDE.md. Stage 8, Step 1.
Build the complete settings page.

Layout: 3 sections as cards, stacked vertically.

Section 1 — Backup:
  Title: "Backup Data"
  Description: "Export all your data as a JSON file. Save it to Google Drive for safekeeping."
  "Last backup: DD/MM/YYYY HH:MM" (or "Never" if no backup yet)
  [Export Backup] button (primary)
  On click: Data.exportBackup() → showToast('Backup downloaded successfully', 'success')
  Update last backup display without page reload

Section 2 — Restore:
  Title: "Restore from Backup"
  Description: "Upload a backup file to restore all data.
                WARNING: This will replace ALL current data."
  File upload area (styled drop zone, accepts .json only):
    Shows "Drag a backup file here, or click to browse"
    On file select: show filename + "Restore" button
  On Restore click: read file as text → JSON.parse →
    openModal with confirmation:
    "Restore from [filename]?
     This will DELETE all current data and replace it with the backup.
     This cannot be undone."
    Buttons: [Cancel] [Yes, Restore]
    On confirm: Data.importBackup(jsonText) → show result:
    "Restored: X settlements, X expenses, X invoices, X allowances"
    showToast('Data restored successfully', 'success')
    Refresh record counts display below

Section 3 — Data Overview:
  Title: "Current Data"
  Shows a simple table:
  | Table | Records |
  | Settlements | X |
  | Expenses | X |
  | Invoices | X |
  | Allowances | X |
  | Total | X |
  Refresh button to update counts
  Counts come from Data.getSettlements().length etc.
```

**Tests for Step 8.1:**
- [ ] Export button downloads a valid JSON file
- [ ] Last backup date updates after export
- [ ] File drop zone accepts .json files
- [ ] Selecting a non-JSON file: shows error "Please select a .json backup file"
- [ ] Restore confirmation modal appears with correct filename
- [ ] After restore: data overview counts update correctly
- [ ] After restore: go to Settlements page — correct records visible
- [ ] Backup warning banner on Dashboard disappears after export

### ✅ Stage 8 Complete — Full check before moving on:
- [ ] Export downloads valid JSON with all 4 tables
- [ ] Import restores correctly and updates all counts
- [ ] Confirmation modal works and cannot be skipped
- [ ] Data overview counts are accurate
- [ ] Last backup date shown correctly

---

## Stage 9 — Polish & Final

**Goal:** Everything looks and works perfectly. No rough edges.

---

### Step 9.1 — Polish Pass

**Prompt:**
```
Read CLAUDE.md. Stage 9, Step 1.
Full polish pass across all pages.

1. Dashboard: verify all summary card totals are correct after adding test data to all 4 tables

2. All tables:
   - Empty state message is friendly and specific per page
     (e.g. "No settlements found. Click 'Add Settlement' to get started.")
   - Filter + search combinations work together correctly
   - Sort arrows visible and correct on active sort column
   - Long text in Name/Notes columns truncates with ellipsis, full text in tooltip (title attr)
   - Date columns sort correctly (by actual date value, not display string)
   - Value columns sort numerically not alphabetically

3. Modals:
   - All required field validation shows inline error messages
   - Date inputs default to today's date when adding a new record
   - Tab order through form fields is logical
   - Close button (×) in modal header works

4. Sidebar:
   - Current page always highlighted correctly
   - Sidebar looks correct on all 6 pages

5. Responsive minimum:
   - At 1280px width: everything readable, no overlap
   - Horizontal scroll on table if viewport too narrow (table wrapper overflow-x: auto)

6. Verify: no console errors on any page in any state
```

**Tests for Step 9.1:**
- [ ] Add records to all 4 tables → Dashboard totals correct
- [ ] Empty state messages show on each page when no data
- [ ] Sort works correctly for text, number, and date columns
- [ ] Long text truncates in table cells
- [ ] All modals close with × button and Escape key
- [ ] Required field validation prevents saving incomplete records
- [ ] No console errors on any page

---

## Go Live

### Hand over to the admin:
1. [ ] Zip the entire `Admin-Portal` folder
2. [ ] Copy to admin's PC (USB drive or share)
3. [ ] Unzip to a permanent location (e.g. `C:\Admin Portal\`)
4. [ ] Open `index.html` in Chrome — verify it works
5. [ ] Admin adds a few test records → verifies they persist after closing and reopening Chrome
6. [ ] Admin exports first backup → saves to Google Drive folder
7. [ ] Show admin: Settings → Export Backup → save to Google Drive
8. [ ] Show admin: Settings → Restore → how to recover from backup
9. [ ] You are live ✅

### Weekly habit for the admin:
- [ ] Every Friday: Settings → Export Backup → save to Google Drive
- [ ] Keep last 4 weeks of backups
- [ ] Name them clearly: `hrap_backup_2026-06-17.json`

### If something breaks:
- Data missing → Settings → Restore → upload latest backup JSON
- App not loading → check that Chrome is being used (not Edge or Firefox)
- Records not saving → check that Chrome storage is not full (unlikely but possible)

---

## Future Additions (when ready)

When adding any new feature, start a new Claude Code session with this message:
```
Read CLAUDE.md. I want to add [feature name].
Confirm you understand the existing architecture before writing any code.
This is pure HTML + CSS + JS — no npm, no frameworks, no server.
Tell me which files will change and which new files are needed.
Do not write any code until I approve the plan.
```

Possible future features:
- Print any table — browser print() with print-optimized CSS
- Import data from Excel — parse uploaded .xlsx with SheetJS CDN
- Export any table to Excel — SheetJS CDN client-side
- Dark mode — CSS variable swap + toggle in sidebar
- Record history/audit log — track who changed what and when

---

*Keep this file open while building. Check off every item as you go.*
*If a test fails, fix it before moving to the next step.*
*Never skip the end-of-stage full checks — they catch cross-file issues early.*
*If Claude Code goes off-plan, paste the relevant CLAUDE.md section and say: follow this exactly.*
