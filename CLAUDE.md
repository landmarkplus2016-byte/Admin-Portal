# CLAUDE.md — HR Admin Portal
> This file is Claude Code's persistent memory for this project.
> Read this at the start of every session before writing any code.

---

## What We Are Building

An internal HR Admin Portal for a single company admin to manage:
- Employee settlement payments
- Field expense records
- Contractor invoices & dues
- Allowances, inventory, and bonuses

**Who uses it:** One admin person, on their desktop PC only.
**How it runs:** Open `index.html` directly in Chrome — no server, no hosting, no internet required.
**Data lives in:** The browser's localStorage/IndexedDB — no external database.

---

## Non-Negotiable Rules

1. **No npm, no React, no TypeScript, no build tools — ever.** Plain HTML + CSS + JS only.
2. **One file, one job** — never mix concerns between files.
3. **No inline styles** — all styling via CSS classes in `styles.css`.
4. **All data goes through `js/data.js`** — no page writes to storage directly.
5. **All dates stored as ISO strings** (`YYYY-MM-DD`) — display formatting is separate.
6. **Never hard-delete any record** — use a `deleted: true` flag and filter it out.
7. **Backup before any destructive action** — warn the user if they haven't backed up recently.
8. **Every table must have: search, filter, sort, and a record count** — no exceptions.
9. **Arabic text in data is valid** — use `dir="auto"` on all table cells and input fields.
10. **No library dependencies** — no jQuery, no Lodash, no external JS. Pure vanilla only.

---

## File Map — One Job Per File

```
Admin-Portal/
├── index.html                  ← Dashboard page
├── styles.css                  ← ALL styles — variables, layout, components, utilities
├── app.js                      ← Shared: sidebar nav, active state, utility functions
│
├── pages/
│   ├── settlements.html        ← Settlements tracking page
│   ├── expenses.html           ← Expenses page
│   ├── invoices.html           ← Invoices & Dues page
│   ├── allowances.html         ← Allowances / Bonus / Inventory page
│   └── settings.html           ← Backup, restore, data management
│
├── js/
│   ├── data.js                 ← ALL localStorage read/write — nothing else touches storage
│   ├── settlements.js          ← Settlements page logic only
│   ├── expenses.js             ← Expenses page logic only
│   ├── invoices.js             ← Invoices page logic only
│   ├── allowances.js           ← Allowances page logic only
│   └── settings.js             ← Backup/restore logic only
│
└── CLAUDE.md                   ← This file
```

---

## Design System

### Colors (CSS variables in styles.css)
```css
--color-sidebar:      #1a2340    /* dark navy — sidebar background */
--color-sidebar-text: #8892a4    /* muted — inactive nav items */
--color-sidebar-active:#ffffff   /* white — active nav item text */
--color-accent:       #3b82f6    /* blue — buttons, links, highlights */
--color-accent-hover: #2563eb    /* darker blue — button hover */
--color-bg:           #f0f2f5    /* light grey — page background */
--color-surface:      #ffffff    /* white — cards, tables */
--color-border:       #e2e8f0    /* light — borders, dividers */
--color-text:         #1e293b    /* near-black — primary text */
--color-text-muted:   #64748b    /* grey — secondary text, labels */
--color-success:      #16a34a    /* green — Approved badge */
--color-warning:      #d97706    /* amber — Hold/Pending badge */
--color-danger:       #dc2626    /* red — Canceled/Rejected badge */
--color-info:         #0891b2    /* teal — neutral info badge */
```

### Typography
- **Font:** `'Inter', system-ui, sans-serif` — loaded via Google Fonts CDN
- **Page title:** 20px, 600 weight
- **Section heading:** 16px, 600 weight
- **Body / table:** 14px, 400 weight
- **Label / badge:** 12px, 500 weight

### Layout
- Fixed sidebar: **240px wide**, full height, dark navy
- Main content: fills remaining width, scrollable, 24px padding
- Top bar: 56px height, white, shows page title + action buttons

### Components
- **Cards:** white bg, 8px radius, `0 1px 3px rgba(0,0,0,0.08)` shadow
- **Tables:** full width, 44px row height, striped (`#f8fafc` on even rows), sticky header
- **Badges:** 4px radius, 4px 10px padding, colored per status (see colors above)
- **Buttons (primary):** accent blue, white text, 6px radius, 10px 18px padding
- **Buttons (secondary):** white bg, border, grey text
- **Search input:** full width of filter bar, 36px height, border, 6px radius
- **Filter selects:** inline with search, same height

### Status Badge Colors
| Status | Color Variable |
|---|---|
| Approved | `--color-success` (green) |
| Hold | `--color-warning` (amber) |
| Canceled | `--color-danger` (red) |
| Rejected | `--color-danger` (red) |
| Pending | `--color-warning` (amber) |
| Transfer | `--color-info` (teal) |
| Cash | `--color-text-muted` (grey) |

---

## Data Structure Reference

### Settlements
```javascript
{
  id: 'STL-001',                  // generated: 'STL-' + timestamp
  name: 'Mohamed Abd El-Azeem',   // employee name
  value: 750,                     // number
  engineer: 'amr',                // engineer/with field
  receivedDate: '2026-01-01',     // ISO date string
  signatureDate: '2026-01-01',    // ISO date string
  financeDate: '2026-01-01',      // ISO date string or null
  with: 'amer',                   // handler
  department: 'plus',             // department key
  notes: '',                      // free text
  deleted: false,                 // soft delete flag
  createdAt: '2026-06-17T...',    // ISO timestamp
  updatedAt: '2026-06-17T...'     // ISO timestamp
}
```

### Expenses
```javascript
{
  id: 'EXP-001',
  name: 'Ahmed Mohamed Ali',
  siteId: 'رسوم بيئه J9493',      // site ID — may contain Arabic
  value: 8005,
  receivedDate: '2026-01-01',
  signatureDate: '2026-01-01',
  financeDate: '2026-01-01',
  with: 'Amer',
  paymentMethod: 'transfer',      // 'cash' or 'transfer'
  approval: 'Approved',           // 'Approved', 'Hold', 'Canceled'
  manager: 'A. Ali',
  department: 'AQ',
  notes: '',
  deleted: false,
  createdAt: '...',
  updatedAt: '...'
}
```

### Invoices
```javascript
{
  id: 'INV-001',
  contractor: 'Star Tech',        // contractor company name
  receivedDate: '2026-01-01',
  invoiceNo: '235',
  siteId: 'K7704',
  value: 16031,
  coordinator: 'Ibrahim Khalil',
  coordinatorDate: '2026-01-01',
  coordinatorFinished: '2026-01-01',
  vfCode: '456',
  aliaaDate: '2026-01-01',
  aliaaFinished: '2026-01-01',
  ashrafDate: '2026-01-01',
  ashrafFinished: '2026-01-01',
  modification: '',
  financeDate: '2026-01-01',
  approval: 'Approved',           // 'Approved' or 'Rejected'
  with: 'Hussein',
  notes: '',
  deleted: false,
  createdAt: '...',
  updatedAt: '...'
}
```

### Allowances
```javascript
{
  id: 'ALW-001',
  name: 'Khaled Amr Rizk',
  value: 455,
  engineer: 'mohannad',
  receivedDate: '2026-01-01',
  signatureDate: '2026-01-01',
  department: 'plus',             // 'plus', 'mark', 'AQ', 'telecom', etc.
  financeDate: '2026-01-01',
  deleted: false,
  createdAt: '...',
  updatedAt: '...'
}
```

---

## Key Reference Data

### Departments
`AQ`, `Con`, `Plus`, `Telecom`, `Mark`, `Transportation Mark`, `Transportation Plus`,
`Fabrications`, `Acc`, `IT`, `Safety T`, `Safety C`

### Engineers / With
Settlements: `Shady`, `Amr`, `Fleet`, `Mohannad`, `Mostafa`, `Birary`, `Amr Sabry`, `Ayman`, `Amer`, `Hussein`
Expenses managers: `A. Fawzy`, `A. Talaat`, `A. Ali`, `Mohsen`, `Amr Refaat`, `S. Kamel`,
`Asem`, `Ibrahim`, `Emad`, `Khodary`, `Khaled`, `Tariq`, `Kassem`, `Sameh`, `Shrief`,
`Dalia`, `Taha`, `M. Amin`, `A. Tawfik`, `Ibrahim Habib`, `Rana`, `Osama C`, `Osama T`, `Saad`
Contractors: `Join`, `Star Tech`, `Almotaheda`, `Basic`, `Otak`, `GSEC`

---

## Data Layer — js/data.js

All storage goes through this file. No other file reads or writes to localStorage directly.

```javascript
// Storage keys
const KEYS = {
  settlements: 'hrap_settlements',
  expenses:    'hrap_expenses',
  invoices:    'hrap_invoices',
  allowances:  'hrap_allowances',
  meta:        'hrap_meta'         // last backup date, app version
};

// Every table follows this pattern:
function getSettlements()         // returns array (excluding deleted)
function saveSettlement(record)   // add or update by id
function deleteSettlement(id)     // sets deleted: true — never removes
function getAllSettlements()       // returns ALL including deleted (for backup)

// Same pattern for expenses, invoices, allowances

// Backup/Restore
function exportBackup()           // downloads JSON file with all data + timestamp
function importBackup(file)       // reads JSON, validates, wipes current, restores
```

---

## Backup System

### Export
Triggered from Settings page. Downloads a file named `hrap_backup_YYYY-MM-DD.json`:
```json
{
  "app": "HR Admin Portal",
  "version": "1.0",
  "exported_at": "2026-06-17T14:30:00.000Z",
  "data": {
    "settlements": [...],
    "expenses": [...],
    "invoices": [...],
    "allowances": [...]
  }
}
```

### Import / Restore
1. User uploads a `.json` backup file
2. Validate: has `data` key, has all 4 table keys, has `version`
3. Show confirmation modal: "This will replace ALL current data. Are you sure?"
4. On confirm: clear all 4 storage keys → write new data → show success count
5. If validation fails: show clear error, change nothing

### Backup Reminder
- Store last backup date in `hrap_meta`
- If more than 7 days since last backup: show amber warning banner on dashboard

---

## Each Page — Required Features

### Every data page (Settlements, Expenses, Invoices, Allowances) MUST have:
- **Record count badge** — "112 records" shown above the table
- **Total value** — sum of all visible (filtered) records shown next to count
- **Search box** — filters by name, site ID, or any text field in real-time
- **Filter dropdowns** — by department, status, payment method (where relevant)
- **Sortable columns** — click any column header to sort asc/desc, arrow indicator shown
- **Add record button** — opens a modal form
- **Edit on row click** — click any row to open edit modal
- **Delete button in edit modal** — soft delete with confirmation
- **Empty state** — friendly message when no records match filters

### Dashboard MUST have:
- 4 summary cards: Total Settlements, Total Expenses, Total Invoices, Total Allowances
- Each card shows: record count + total value in EGP
- Backup warning banner if last backup > 7 days ago
- Quick links to each section

### Settings page MUST have:
- Export backup button
- Import/restore backup (file upload)
- Last backup date displayed
- Record counts per table (so admin can verify restore worked)

---

## Coding Rules

### Dates
- Always store as `YYYY-MM-DD` ISO string
- Display as `DD/MM/YYYY` using this helper:
```javascript
function formatDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}
```

### Currency
```javascript
function formatCurrency(value) {
  if (!value && value !== 0) return '—';
  return Number(value).toLocaleString('en-EG') + ' EGP';
}
```

### IDs
```javascript
function generateId(prefix) {
  return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
}
```

### Modals
- One shared modal structure in `app.js`: `openModal(title, bodyHTML, onConfirm)`
- Forms inside modals — no `<form>` tags, use `<div>` with button `onclick` handlers
- Close on backdrop click and on Escape key

### Tables
- Render with `innerHTML` — build HTML string, set once
- Re-render on every filter/sort change
- Never manipulate individual DOM rows

### Sidebar
- Same HTML copied into every page
- `app.js` reads current page filename and sets `active` class automatically

---

## What NOT to Do

- Never use `npm install` or any package manager
- Never use React, Vue, Angular, or any framework
- Never use `<form>` tags — use `<div>` containers with button handlers
- Never call localStorage from page JS files — always go through `js/data.js`
- Never hard-delete a record — always `deleted: true`
- Never hardcode a list of departments or names in multiple files — define once in `data.js`
- Never use inline `style=""` attributes — use CSS classes
- Never create a new CSS file — everything goes in `styles.css`
- Never add a feature not in this file without confirming with the project owner
