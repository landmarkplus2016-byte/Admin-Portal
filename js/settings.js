// js/settings.js — Settings page logic only.

(function () {

  let selectedFile = null;

  // ---- backup ----

  function formatBackupTimestamp(iso) {
    if (!iso) return t('settings.backup.never');
    const d = new Date(iso);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const mins = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${mins}`;
  }

  function renderLastBackup() {
    document.getElementById('last-backup-display').textContent =
      t('settings.backup.lastPrefix') + ' ' + formatBackupTimestamp(Data.getLastBackupDate());
  }

  function handleExport() {
    Data.exportBackup();
    renderLastBackup();
    showToast(t('settings.backup.toastExported'), 'success');
  }

  // ---- restore ----

  function resetFileSelection() {
    selectedFile = null;
    document.getElementById('file-input').value = '';
    document.getElementById('file-selected-row').classList.add('hidden');
    document.getElementById('file-selected-name').textContent = '';
  }

  function selectFile(file) {
    if (!file || !file.name.toLowerCase().endsWith('.json')) {
      showToast(t('settings.restore.selectJsonFile'), 'danger');
      return;
    }
    selectedFile = file;
    document.getElementById('file-selected-name').textContent = file.name;
    document.getElementById('file-selected-row').classList.remove('hidden');
  }

  function handleRestoreClick() {
    if (!selectedFile) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result;
      try {
        JSON.parse(text);
      } catch (e) {
        showToast(t('settings.restore.invalidFile'), 'danger');
        return;
      }
      confirmRestore(text, selectedFile.name);
    };
    reader.onerror = () => {
      showToast(t('settings.restore.couldNotRead'), 'danger');
    };
    reader.readAsText(selectedFile);
  }

  function confirmRestore(jsonText, filename) {
    openModal(t('settings.restore.modalTitle'), `
      <p>${t('settings.restore.modalLine1', { filename: '<strong>' + escapeHtml(filename) + '</strong>' })}</p>
      <p>${t('settings.restore.modalWarning')}</p>
      <p>${t('settings.restore.modalCannotUndo')}</p>
    `, [
      { label: t('common.cancel'), class: 'btn-secondary', onClick: closeModal },
      { label: t('settings.restore.yesButton'), class: 'btn-primary', onClick: () => doRestore(jsonText) }
    ]);
  }

  function doRestore(jsonText) {
    let counts;
    try {
      counts = Data.importBackup(jsonText);
    } catch (e) {
      showToast(t('settings.restore.invalidFile'), 'danger');
      return;
    }

    closeModal();
    resetFileSelection();
    renderLastBackup();
    renderDataOverview();

    showToast(
      t('settings.restore.toastSummary', {
        settlements: counts.settlements,
        expenses: counts.expenses,
        invoices: counts.invoices,
        allowances: counts.allowances
      }),
      'success'
    );
    showToast(t('settings.restore.toastSuccess'), 'success');
  }

  function setupDropZone() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', () => {
      if (fileInput.files[0]) selectFile(fileInput.files[0]);
    });

    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
      e.preventDefault();
      dropZone.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) selectFile(file);
    });
  }

  // ---- data overview ----

  function renderDataOverview() {
    const rows = [
      { label: t('nav.settlements'), count: Data.getSettlements().length },
      { label: t('nav.expenses'), count: Data.getExpenses().length },
      { label: t('nav.invoices'), count: Data.getInvoices().length },
      { label: t('nav.allowances'), count: Data.getAllowances().length }
    ];
    const total = rows.reduce((sum, r) => sum + r.count, 0);

    const tbody = document.getElementById('data-overview-tbody');
    tbody.innerHTML = rows.map((r) => `
      <tr>
        <td>${escapeHtml(r.label)}</td>
        <td>${r.count}</td>
      </tr>
    `).join('') + `
      <tr class="total-row">
        <td>${t('settings.currentData.totalRow')}</td>
        <td>${total}</td>
      </tr>
    `;
  }

  // ---- manage lists ----

  function renderListManagers() {
    const container = document.getElementById('list-manager-container');
    const lists = Data.getLists();

    container.innerHTML = Object.keys(Data.LIST_DEFS).map((key) => {
      const items = lists[key] || [];
      const itemsHtml = items.length
        ? items.map((item) => `
            <div class="list-manager-item">
              <span dir="auto">${escapeHtml(item)}</span>
              <button type="button" class="list-item-remove" data-list="${escapeHtml(key)}" data-value="${escapeHtml(item)}" aria-label="${t('common.delete')}">×</button>
            </div>
          `).join('')
        : `<div class="list-manager-empty">${t('settings.manageLists.empty')}</div>`;

      return `
        <div class="list-manager-group">
          <div class="list-manager-title">${t(Data.LIST_DEFS[key])}</div>
          <div class="list-manager-items">${itemsHtml}</div>
          <div class="list-manager-add-row">
            <input type="text" class="list-add-input" dir="auto" data-list="${escapeHtml(key)}" placeholder="${t('settings.manageLists.addPlaceholder')}">
            <button type="button" class="btn-secondary list-add-btn" data-list="${escapeHtml(key)}">${t('settings.manageLists.addButton')}</button>
          </div>
        </div>
      `;
    }).join('');

    container.querySelectorAll('.list-item-remove').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.list;
        const value = btn.dataset.value;
        if (!confirm(t('settings.manageLists.confirmRemove', { value: value }))) return;
        Data.removeListItem(key, value);
        renderListManagers();
        showToast(t('settings.manageLists.toastRemoved'));
      });
    });

    function handleAdd(key) {
      const input = container.querySelector(`.list-add-input[data-list="${key}"]`);
      const value = input.value.trim();
      if (!value) return;
      const added = Data.addListItem(key, value);
      if (!added) {
        showToast(t('settings.manageLists.toastDuplicate'), 'danger');
        return;
      }
      renderListManagers();
      showToast(t('settings.manageLists.toastAdded'));
    }

    container.querySelectorAll('.list-add-btn').forEach((btn) => {
      btn.addEventListener('click', () => handleAdd(btn.dataset.list));
    });

    container.querySelectorAll('.list-add-input').forEach((input) => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleAdd(input.dataset.list);
        }
      });
    });
  }

  // ---- init ----

  function initSettingsPage() {
    if (!document.getElementById('export-backup-btn')) return;

    renderLastBackup();
    renderDataOverview();
    renderListManagers();
    setupDropZone();

    document.getElementById('export-backup-btn').addEventListener('click', handleExport);
    document.getElementById('restore-btn').addEventListener('click', handleRestoreClick);
    document.getElementById('refresh-counts-btn').addEventListener('click', renderDataOverview);
  }

  document.addEventListener('DOMContentLoaded', initSettingsPage);

})();
