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

function debounce(fn, delay) {
  let timeoutId;
  return function debounced(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

window.formatDate = formatDate;
window.formatCurrency = formatCurrency;
window.generateId = generateId;
window.formatDateInput = formatDateInput;
window.debounce = debounce;

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
  closeBtn.className = 'btn-secondary';
  closeBtn.type = 'button';
  closeBtn.textContent = 'Close';
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
