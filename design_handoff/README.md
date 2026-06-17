# Handoff: HR Admin Portal — Premium Fintech Redesign
**Date:** June 2026  
**Fidelity:** High-fidelity  
**Target stack:** Vanilla HTML + CSS + JS (your existing app, no framework change needed)

---

## Overview
A full visual redesign of the HR Admin Portal — replacing the generic navy/blue admin template with a refined, premium fintech aesthetic. The design uses the **IBM Plex** type superfamily (Latin, Arabic, Mono), a cool-neutral palette with **5 swappable accent themes**, a polished **dark sidebar**, and supports **bilingual EN/AR with RTL layout**.

Two screens are fully spec'd: **Dashboard** and **Expenses**. The design system (tokens, components, layout shell) applies unchanged to the remaining screens (Settlements, Invoices & Dues, Allowances, Settings).

---

## About the Design Files
`Admin Portal.dc.html` is an **interactive HTML design reference** — it shows the intended look and behavior at full fidelity. It is **not production code**. Your task is to **recreate these designs inside your existing vanilla HTML/CSS/JS app** using the tokens, snippets, and specs in this package.

The key files to update in your repo:
- `styles.css` → replace with `styles.css` in this folder
- `index.html` + all `pages/*.html` → update the layout shell (sidebar + topbar markup) using `snippets.html`
- `app.js` → add theme-switcher and lang-toggle JS (see below)

---

## Design Tokens

### Colors — Neutrals (always the same regardless of accent)
| Token | Value | Usage |
|---|---|---|
| `--bg` | `#F5F6F8` | Page background |
| `--surface` | `#FFFFFF` | Cards, topbar, modals |
| `--border` | `#EAECF0` | All dividers & borders |
| `--border-inner` | `#F0F1F4` | Table row dividers |
| `--text` | `#1A1F2B` | Primary text |
| `--text-sub` | `#3C4250` | Secondary text |
| `--text-muted` | `#79808E` | Labels, subtitles |
| `--text-faint` | `#9AA0AC` | Placeholders, helpers |
| `--sidebar-bg` | `#0F141C` | Sidebar background |
| `--sidebar-text` | `#8A93A3` | Nav item text |
| `--sidebar-card` | `#161D29` | Sidebar inner cards |
| `--sidebar-border`| `#232C3B` | Sidebar card borders |

### Colors — Accents (5 themes, swap via `data-theme` on `<body>`)
| Theme key | `--accent` | `--accent-soft` |
|---|---|---|
| `indigo` (default) | `#4F46E5` | `#EEEEFE` |
| `sky` | `#2563EB` | `#E8F0FE` |
| `emerald` | `#0E9F6E` | `#E4F6EF` |
| `violet` | `#7C3AED` | `#F2EBFE` |
| `amber` | `#C2620B` | `#FBEFE0` |

### Colors — Status badges
| | Background | Text |
|---|---|---|
| Approved | `#E4F6EF` | `#0B7D57` |
| Hold / Pending | `#FCF3DF` | `#9A6800` |
| Canceled / Danger | `#FCE9E5` | `#C23A24` |
| Transfer (payment) | `#EEF1F5` | `#5C6678` |
| Cash (payment) | `#F4F1FA` | `#7C3AED` |

### Typography
| Use | Font | Size | Weight |
|---|---|---|---|
| UI (English) | IBM Plex Sans | 13–15px | 400–600 |
| UI (Arabic) | IBM Plex Sans Arabic | 13–15px | 400–600 |
| Numeric figures | IBM Plex Mono | varies | 400–600 |
| Page title | IBM Plex Sans | 18px | 600 |
| Section title | IBM Plex Sans | 15px | 600 |
| Table header | IBM Plex Sans | 11px | 600, uppercase, 0.05em tracking |
| KPI value | IBM Plex Mono | 23px | 600, -0.02em tracking |
| Nav item | IBM Plex Sans | 13.5px | 500 (active: 600) |
| Badge | IBM Plex Sans | 11–11.5px | 600 |

Google Fonts import (add to `<head>` on every page):
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### Spacing & Shape
| Token | Value |
|---|---|
| `--radius-card` | `14px` |
| `--radius-btn` | `10px` |
| `--radius-badge` | `20px` (pill) or `7px` (square) |
| `--radius-avatar` | `9px` |
| `--shadow-card` | `0 1px 2px rgba(16,20,28,0.04)` |
| `--shadow-btn` | `0 1px 2px rgba(16,20,28,0.12)` |

---

## Layout Shell

### Overall structure
```
body (height: 100vh, display: flex, overflow: hidden, bg: --sidebar-bg)
  ├── <aside class="sidebar">   width: 248px, flex-none
  └── <div class="main">        flex: 1, display: flex, flex-direction: column
        ├── <header class="topbar">   height: 72px, bg: --surface
        └── <div class="content">     flex:1, overflow-y: auto, padding: 28px, bg: --bg
```

RTL: add `dir="rtl"` to `<html>` and `font-family: 'IBM Plex Sans Arabic', ...` on `<body>` when Arabic mode is active.

### Sidebar — 248px wide, `#0F141C`
- **Logo area**: 72px tall, flex row, gap 12px, padding 0 22px
  - Monogram square: 34×34px, border-radius 9px, background `var(--accent)`, white 700 15px
  - Company name: 15px/600 white; sub-label: 11px/500 `#5C6678`, letter-spacing 0.02em
- **Section label** ("MENU"): 10.5px, 600, uppercase, 0.09em tracking, color `#475063`, padding 4px 14px 6px
- **Nav items**: see snippets, height 42px, border-radius 9px, gap 11px, padding 0 12px
  - Active: `background: var(--accent)`, color white, font-weight 600
  - Hover: `background: rgba(255,255,255,0.05)`, color `#cdd3de`
  - Inactive: transparent bg, color `#8A93A3`, font-weight 500
  - Inline badge (Expenses "12", Invoices "5"): 11px/600, bg `#1C2533`, color `#7A8499`, pill padding 1px 7px
- **Backup card** (bottom): bg `#161D29`, border `1px solid #232C3B`, border-radius 12px, padding 14px
  - Green dot: 7×7px, border-radius 50%, bg `#2BB673`, box-shadow `0 0 0 3px rgba(43,182,115,0.18)`
  - Title: 12.5px/600 `#cdd3de`; Sub: 11.5px `#5C6678`
- **User row**: 32×32 avatar (bg `#2C3A52`, border-radius 50%), name 12.5px/600 `#cdd3de`, role 11px `#5C6678`

### Topbar — height 72px, bg `#FFFFFF`, border-bottom `1px solid #EAECF0`
- Left: page title 18px/600 `#1A1F2B`, sub-label 12.5px `#79808E`, flex-direction column, gap 2px
- Right (display flex, gap 14px, margin-inline-start auto):
  - **Search pill**: height 38px, width 230px, bg `#F3F4F6`, border `1px solid #EAECF0`, border-radius 10px, padding 0 12px, 13px `#9AA0AC`
  - **Palette switcher**: flex row, gap 5px, bg `#F3F4F6`, border `1px solid #EAECF0`, border-radius 10px, padding 4px. Each dot: 22×22px, border-radius 7px, bg = accent color. Active dot: `border: 2px solid #fff`, `box-shadow: 0 0 0 2px <accent>`
  - **Lang toggle**: bg `#F3F4F6`, border `1px solid #EAECF0`, border-radius 10px, padding 3px. Each pill: border-radius 7px, padding 5px 11px, 12.5px/600. Active: bg white, color `#1A1F2B`, `box-shadow: 0 1px 2px rgba(16,20,28,0.1)`. Inactive: transparent, color `#9AA0AC`
  - **Bell button**: 38×38px, border `1px solid #EAECF0`, bg white, border-radius 10px. Notification dot: 7×7px, bg `var(--accent)`, border `2px solid white`, position absolute top-right

---

## Screen: Dashboard

### KPI Cards row — `display: grid, grid-template-columns: repeat(4, 1fr), gap: 16px`
Each card: bg white, border `1px solid #EAECF0`, border-radius 14px, padding `18px 18px 14px`, box-shadow card, flex column, gap 12px.
- **Top row**: icon square (38×38, border-radius 10px, bg `--accent-soft`, color `--accent`, icon 19px) + delta badge (12px/600, color green `#0E9F6E` for up or red `#E0533D` for down, "▲ 6.2%" format)
- **Label**: 12.5px/500 `#79808E`
- **Value**: 23px/600 `#1A1F2B`, `font-family: IBM Plex Mono`, letter-spacing -0.02em
- **Sparkline**: height 34px, full width, area chart in accent color (up) or `#E0533D` (down)

KPI values:
| Label | Value | Delta | Direction |
|---|---|---|---|
| Total Settlements | 4,820,000 EGP | +6.2% | ▲ |
| Total Expenses | 2,145,600 EGP | +12.4% | ▲ |
| Invoices & Dues | 3,310,000 EGP | -3.1% | ▼ |
| Allowances | 786,400 EGP | +4.8% | ▲ |

### Trend chart card — left column (ratio ~1.62fr)
bg white, border, border-radius 14px, padding 20px, box-shadow card.
- Header: title "Expense trend" 15px/600 + subtitle "Monthly spend, last 12 months" 12.5px muted. Legend right: colored 9×9 squares + labels.
- SVG area chart, width 100%, height 210px, viewBox `0 0 720 210`
  - Two series: current year (accent, strokeWidth 2.5) + last year (dashed `#CBD0DA`)
  - Area fill: accent at 20% → 0% opacity gradient
  - 4 horizontal grid lines: `#F0F1F4`
  - Endpoint dot: circle r=4, white fill, accent stroke
- Month labels below: 12 labels, `IBM Plex Mono`, 10.5px, `#9AA0AC`
  - Values (in thousands EGP): `[128,142,150,138,165,172,160,185,178,198,210,224]`
  - Prev year: `[110,120,128,132,140,150,148,160,168,175,182,190]`

### Approval donut card — right column (ratio ~1fr)
bg white, border, border-radius 14px, padding 20px, box-shadow card.
- SVG donut: viewBox `0 0 120 120`, circle r=52, strokeWidth 15, rotate(-90deg)
  - Approved: `#0E9F6E`
  - Hold: `#D9920A`
  - Canceled: `#E0533D`
  - Background track: `#F0F1F4`
  - Center text: count (24px/600 IBM Plex Mono) + "records" (9px/500 muted)
- Legend (3 rows): 9×9 colored square + label + count (bold mono) + percentage (faint right-aligned)

### Dept spend bars card — left column (ratio ~1fr)
bg white, border, border-radius 14px, padding 20px, box-shadow card.
- 6 departments, each: name + value on one line (13px/500 text, 12.5px/600 mono right), then bar: height 8px, bg `#F0F1F4`, border-radius 6px; fill: `var(--accent)`, border-radius 6px, width = percentage of max.
- Data: Telecom 612k, Con 540k, Plus 498k, AQ 430k, Mark 360k, Fabrications 295k

### Recent expenses card — right column (ratio ~1.4fr)
bg white, border, border-radius 14px, padding 20px, box-shadow card.
- Header: "Recent expenses" 15px/600 + "View all" link 12.5px/600 accent color, cursor pointer → navigates to Expenses
- 5 rows, each: avatar (34×34, border-radius 9px, bg `--accent-soft`, color accent, 12px/600 mono initials) + title (13px/500) + meta "Dept · Manager" (11.5px muted) + value (13px/600 mono) + approval badge (pill)
- Border-top `1px solid #F0F1F4` on each row, padding 10px 0

---

## Screen: Expenses

### Summary stat strip — `display: grid, grid-template-columns: repeat(4, 1fr), gap: 16px`
Each card: bg white, border, border-radius 14px, padding `16px 18px`, box-shadow card.
- Label: 12.5px/500 muted; Value: 21px/600 IBM Plex Mono, letter-spacing -0.02em
- Stats: Total value (sum EGP, `#1A1F2B`), Records count (`#1A1F2B`), Approved count (`#0B7D57`), On hold count (`#9A6800`)

### Filter bar — `display: flex, gap: 10px, flex-wrap: wrap, margin-bottom: 16px`
- **Search**: flex:1, min-width 240px, height 40px, bg white, border, border-radius 10px, padding 0 12px, search icon + placeholder 13px muted
- **Dept / Approval / Payment dropdowns**: height 40px, bg white, border, border-radius 10px, padding 0 14px, 13px/500 `#3C4250`, chevron icon right
- **Export button**: height 40px, bg white, border, border-radius 10px, export icon + "Export" 13px/600, hover bg `#F3F4F6`
- **Add Expense button**: height 40px, bg `var(--accent)`, no border, border-radius 10px, plus icon + "Add expense" 13px/600 white, box-shadow btn

### Data table
Container: bg white, border, border-radius 14px, overflow hidden, box-shadow card.
- `<table>` width 100%, border-collapse collapse, min-width 920px (scroll on container)
- `<thead>` bg `#FAFBFC`, border-bottom `1px solid #EAECF0`
- `<th>` 11px/600 uppercase 0.05em tracking `#9AA0AC`, text-align start, padding `12px 18px`
- `<tr>` border-bottom `1px solid #F0F1F4`; hover: bg `#FAFBFC`
- Row height: ~62px (padding `14px 18px` per cell)

Column specs:
| Column | Width | Font | Notes |
|---|---|---|---|
| Expense | auto | 13.5px/500 + 11.5px muted | Avatar (34×34, 9px radius) + 2-line title+manager |
| Site ID | ~110px | 13px, IBM Plex Mono, muted | |
| Value | ~140px | 13.5px/600, IBM Plex Mono | white-space nowrap |
| Received | ~120px | 13px, IBM Plex Mono, muted | dd/mm/yyyy |
| Payment | ~110px | 11.5px/600 badge | Square badge (7px radius): Transfer=slate, Cash=violet-tint |
| Approval | ~130px | 11.5px/600 pill badge | Dot + text, status colors |
| Department | ~140px | 13px `#3C4250` | |
| Notes | ~200px | 13px muted | truncate overflow |

### Table footer — border-top `1px solid #EAECF0`, padding `14px 18px`
- Left: "Showing 1–12 of 12 records" 12.5px muted
- Right: Prev button + page numbers (active: bg accent, white) + Next button; height 32px, border-radius 8px

---

## Interactions & Behavior

### Theme switcher
```js
// In app.js — add after DOMContentLoaded
const PALETTES = {
  indigo:  { accent: '#4F46E5', soft: '#EEEEFE' },
  sky:     { accent: '#2563EB', soft: '#E8F0FE' },
  emerald: { accent: '#0E9F6E', soft: '#E4F6EF' },
  violet:  { accent: '#7C3AED', soft: '#F2EBFE' },
  amber:   { accent: '#C2620B', soft: '#FBEFE0' }
};

function setTheme(key) {
  const p = PALETTES[key] || PALETTES.indigo;
  document.documentElement.style.setProperty('--accent', p.accent);
  document.documentElement.style.setProperty('--accent-soft', p.soft);
  localStorage.setItem('hrap_theme', key);
}

// restore on load
document.addEventListener('DOMContentLoaded', () => {
  setTheme(localStorage.getItem('hrap_theme') || 'indigo');
});
```

### Language / RTL toggle
```js
function setLang(lang) {
  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
  document.body.style.fontFamily = lang === 'ar'
    ? "'IBM Plex Sans Arabic', 'IBM Plex Sans', sans-serif"
    : "'IBM Plex Sans', system-ui, sans-serif";
  localStorage.setItem('hrap_lang', lang);
  // update toggle button active states
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.langBtn === lang);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  setLang(localStorage.getItem('hrap_lang') || 'en');
  document.querySelectorAll('[data-lang-btn]').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.langBtn));
  });
  document.querySelectorAll('[data-theme-btn]').forEach(btn => {
    btn.addEventListener('click', () => setTheme(btn.dataset.themeBtn));
  });
});
```

### Active nav
No change needed — your existing `app.js` active-nav logic works as-is.

---

## Step-by-step implementation plan

### Step 1 — Replace `styles.css`
Drop in the `styles.css` from this package. It defines all CSS custom properties, layout, sidebar, topbar, card, table, badge, button, modal, and form rules — fully replacing the old file.

### Step 2 — Update `<head>` on every page
1. Replace the Inter Google Font `<link>` with the IBM Plex triple import above.
2. Change `<title>` if desired.

### Step 3 — Update layout HTML shell
In `index.html` and every `pages/*.html`, replace the `<aside class="sidebar">` and `<div class="topbar">` blocks with the new markup from `snippets.html`. The `<div class="content">` inner content does NOT need to change — only the shell changes.

### Step 4 — Add theme + lang JS to `app.js`
Paste the two JS blocks above (setTheme, setLang) into `app.js`.

### Step 5 — Update dashboard cards
In `app.js`, update `renderSummaryCards()` and `renderQuickStats()` to use the new card markup from `snippets.html` (KPI card template).

### Step 6 — Test each page
Check sidebar active state, topbar layout, table rows, modal, toasts — all should pick up new styles automatically since class names are preserved.

---

## Files in this Package
| File | Purpose |
|---|---|
| `README.md` | This document — full implementation guide |
| `styles.css` | Drop-in replacement for your `styles.css` |
| `snippets.html` | Copy-paste HTML for sidebar, topbar, KPI cards, table rows, badges, buttons |
| `Admin Portal.dc.html` | Interactive design reference — open in browser to see the full design |
