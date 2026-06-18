// ---------- Theme switcher ----------

const PALETTES = {
  indigo: { accent: '#4F46E5', soft: '#EEEEFE' },
  sky: { accent: '#2563EB', soft: '#E8F0FE' },
  emerald: { accent: '#0E9F6E', soft: '#E4F6EF' },
  violet: { accent: '#7C3AED', soft: '#F2EBFE' },
  amber: { accent: '#C2620B', soft: '#FBEFE0' }
};

function setTheme(key) {
  const p = PALETTES[key] || PALETTES.indigo;
  document.documentElement.style.setProperty('--accent', p.accent);
  document.documentElement.style.setProperty('--accent-soft', p.soft);
  localStorage.setItem('hrap_theme', key);
  document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.themeBtn === key);
  });
}

// ---------- Language / RTL toggle ----------
// Wired to Data.setLanguage so it drives the existing js/i18n.js translation
// system (data-i18n attributes) instead of only flipping direction/font.

function setLang(lang) {
  const changed = Data.getLanguage() !== lang;

  document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  document.documentElement.setAttribute('lang', lang);
  document.body.style.fontFamily = lang === 'ar'
    ? "'IBM Plex Sans Arabic', 'IBM Plex Sans', sans-serif"
    : "'IBM Plex Sans', system-ui, sans-serif";

  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.langBtn === lang);
  });

  if (changed) {
    Data.setLanguage(lang);
    window.location.reload();
  } else if (window.applyStaticTranslations) {
    window.applyStaticTranslations();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  setTheme(localStorage.getItem('hrap_theme') || 'indigo');
  setLang(Data.getLanguage());
  document.querySelectorAll('[data-theme-btn]').forEach((btn) => {
    btn.addEventListener('click', () => setTheme(btn.dataset.themeBtn));
  });
  document.querySelectorAll('[data-lang-btn]').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.langBtn));
  });
});

// ---------- Sidebar live status (nav badges + backup card) ----------

function renderSidebarStatus() {
  const expenseBadge = document.getElementById('nav-badge-expenses');
  if (expenseBadge) expenseBadge.textContent = Data.getExpenses().length;

  const invoiceBadge = document.getElementById('nav-badge-invoices');
  if (invoiceBadge) invoiceBadge.textContent = Data.getInvoices().length;

  const titleEl = document.getElementById('sidebar-backup-title');
  const subEl = document.getElementById('sidebar-backup-sub');
  const dotEl = document.getElementById('sidebar-backup-dot');
  if (!titleEl || !subEl || !dotEl) return;

  const lastBackup = Data.getLastBackupDate();
  let days = null;
  if (lastBackup) {
    days = Math.floor((Date.now() - new Date(lastBackup).getTime()) / (1000 * 60 * 60 * 24));
  }
  const overdue = !lastBackup || days > 7;

  titleEl.textContent = overdue ? t('sidebar.backupOverdueTitle') : t('sidebar.backupHealthyTitle');
  subEl.textContent = !lastBackup
    ? t('sidebar.backupNeverSub')
    : (days <= 0 ? t('sidebar.backupTodaySub') : t('sidebar.backupDaysSub', { days: days }));
  dotEl.style.background = overdue ? '#D9920A' : '#2BB673';
  dotEl.style.boxShadow = overdue ? '0 0 0 3px rgba(217,146,10,0.18)' : '0 0 0 3px rgba(43,182,115,0.18)';
}

document.addEventListener('DOMContentLoaded', renderSidebarStatus);

// ---------- Active nav highlighting ----------

document.addEventListener('DOMContentLoaded', () => {
  const path = window.location.pathname;
  const currentFile = path.substring(path.lastIndexOf('/') + 1) || 'index.html';

  document.querySelectorAll('.nav-item').forEach((link) => {
    const href = link.getAttribute('href') || '';
    const hrefFile = href.substring(href.lastIndexOf('/') + 1);
    if (hrefFile === currentFile) {
      link.classList.add('active');
    }
  });
});

// ---------- Utility functions ----------

function formatDate(iso) {
  if (!iso) return '';
  const [year, month, day] = iso.split('-');
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

function formatCurrency(value) {
  const num = Number(value) || 0;
  return `${num.toLocaleString('en-EG')} EGP`;
}

function generateId(prefix) {
  const random = Math.random().toString(36).slice(2, 8);
  return `${prefix}-${Date.now()}-${random}`;
}

function formatDateInput(iso) {
  if (!iso) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(iso)) return iso.slice(0, 10);
  const [day, month, year] = iso.split('/');
  if (!day || !month || !year) return '';
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

function escapeHtml(value) {
  if (value === null || value === undefined) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function debounce(fn, delay) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

function todayIso() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${month}-${day}`;
}

function setFieldError(input, message) {
  if (!input) return;
  const group = input.closest('.form-group');
  if (!group) return;
  group.classList.add('has-error');
  let err = group.querySelector('.form-error');
  if (!err) {
    err = document.createElement('div');
    err.className = 'form-error';
    group.appendChild(err);
  }
  err.textContent = message;
}

function clearFieldErrors(scope) {
  const root = scope || document;
  root.querySelectorAll('.form-group.has-error').forEach((g) => g.classList.remove('has-error'));
  root.querySelectorAll('.form-error').forEach((e) => e.remove());
}

window.formatDate = formatDate;
window.formatCurrency = formatCurrency;
window.generateId = generateId;
window.formatDateInput = formatDateInput;
window.debounce = debounce;
window.escapeHtml = escapeHtml;
window.todayIso = todayIso;
window.setFieldError = setFieldError;
window.clearFieldErrors = clearFieldErrors;

// ---------- Modal ----------

function handleModalKeydown(e) {
  if (e.key === 'Escape') closeModal();
}

function openModal(title, bodyHTML, buttons = []) {
  closeModal();

  const container = document.getElementById('modal-container');

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';

  const modal = document.createElement('div');
  modal.className = 'modal';

  const header = document.createElement('div');
  header.className = 'modal-header';

  const titleEl = document.createElement('div');
  titleEl.className = 'modal-title';
  titleEl.textContent = title;

  const closeBtn = document.createElement('button');
  closeBtn.className = 'modal-close';
  closeBtn.type = 'button';
  closeBtn.setAttribute('aria-label', 'Close');
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', closeModal);

  header.appendChild(titleEl);
  header.appendChild(closeBtn);

  const body = document.createElement('div');
  body.className = 'modal-body';
  body.innerHTML = bodyHTML;

  modal.appendChild(header);
  modal.appendChild(body);

  if (buttons.length) {
    const footer = document.createElement('div');
    footer.className = 'modal-footer';
    buttons.forEach(({ label, class: btnClass, onClick }) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = btnClass || 'btn-secondary';
      btn.textContent = label;
      btn.addEventListener('click', onClick);
      footer.appendChild(btn);
    });
    modal.appendChild(footer);
  }

  overlay.appendChild(modal);
  container.appendChild(overlay);

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener('keydown', handleModalKeydown);
}

function closeModal() {
  const container = document.getElementById('modal-container');
  container.innerHTML = '';
  document.removeEventListener('keydown', handleModalKeydown);
}

window.openModal = openModal;
window.closeModal = closeModal;

// ---------- Toast ----------

function showToast(message, type = 'success') {
  const container = document.getElementById('toast-container');

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;

  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

window.showToast = showToast;

// ---------- Dashboard ----------

const DASHBOARD_ICONS = {
  settlements: '<svg class="summary-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6h13"></path><path d="M8 12h13"></path><path d="M8 18h13"></path><path d="M3 6h.01"></path><path d="M3 12h.01"></path><path d="M3 18h.01"></path></svg>',
  expenses: '<svg class="summary-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2h9l3 3v17l-3-2-3 2-3-2-3 2V2Z"></path><path d="M9 8h6"></path><path d="M9 12h6"></path><path d="M9 16h4"></path></svg>',
  invoices: '<svg class="summary-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"></path><path d="M14 2v6h6"></path><path d="M9 13h6"></path><path d="M9 17h6"></path></svg>',
  allowances: '<svg class="summary-card-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1"></rect><path d="M12 8v13"></path><path d="M3 12h18"></path><path d="M7.5 8a2.5 2.5 0 0 1 0-5C10 3 12 8 12 8s2-5 4.5-5a2.5 2.5 0 0 1 0 5"></path></svg>'
};

function renderBackupBanner() {
  const container = document.getElementById('backup-banner');
  if (!container) return;

  const lastBackup = Data.getLastBackupDate();
  let days = null;

  if (lastBackup) {
    const diffMs = Date.now() - new Date(lastBackup).getTime();
    days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  }

  const overdue = !lastBackup || days > 7;

  if (!overdue) {
    container.innerHTML = '';
    return;
  }

  const message = lastBackup
    ? t('dashboard.backupOverdue', { days: days })
    : t('dashboard.backupNever');

  container.innerHTML = `
    <div class="backup-warning">
      <span>⚠</span>
      <span>${message} <a href="pages/settings.html">${t('dashboard.goToSettings')}</a> ${t('dashboard.toExport')}</span>
    </div>
  `;
}

function renderSummaryCards() {
  const grid = document.getElementById('summary-grid');
  if (!grid) return;

  const cards = [
    { label: t('nav.settlements'), href: 'pages/settlements.html', records: Data.getSettlements(), icon: DASHBOARD_ICONS.settlements },
    { label: t('nav.expenses'), href: 'pages/expenses.html', records: Data.getExpenses(), icon: DASHBOARD_ICONS.expenses },
    { label: t('nav.invoices'), href: 'pages/invoices.html', records: Data.getInvoices(), icon: DASHBOARD_ICONS.invoices },
    { label: t('nav.allowances'), href: 'pages/allowances.html', records: Data.getAllowances(), icon: DASHBOARD_ICONS.allowances }
  ];

  grid.innerHTML = cards.map((card) => {
    const count = card.records.length;
    const total = card.records.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
    return `
      <a class="summary-card" href="${card.href}">
        ${card.icon}
        <div class="summary-card-label">${card.label}</div>
        <div class="summary-card-value">${formatCurrency(total)}</div>
        <div class="summary-card-count">${t('dashboard.records', { count: count })}</div>
      </a>
    `;
  }).join('');
}

function renderQuickStats() {
  const container = document.getElementById('quick-stats');
  if (!container) return;

  const counts = { Approved: 0, Hold: 0, Canceled: 0 };
  Data.getExpenses().forEach((expense) => {
    if (counts[expense.approval] !== undefined) counts[expense.approval] += 1;
  });

  container.innerHTML = `
    <div class="quick-stat">${t('dashboard.quickApproved')} <span class="badge badge-success">${counts.Approved}</span></div>
    <div class="quick-stat">${t('dashboard.quickHold')} <span class="badge badge-warning">${counts.Hold}</span></div>
    <div class="quick-stat">${t('dashboard.quickCanceled')} <span class="badge badge-danger">${counts.Canceled}</span></div>
  `;
}

function initDashboard() {
  if (!document.getElementById('summary-grid')) return;
  renderBackupBanner();
  renderSummaryCards();
  renderQuickStats();
}

document.addEventListener('DOMContentLoaded', initDashboard);
