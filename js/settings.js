// js/settings.js — Settings page logic only.

(function () {

  let selectedFile = null;

  // ---- backup ----

  function formatBackupTimestamp(iso) {
    if (!iso) return 'Never';
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
      'Last backup: ' + formatBackupTimestamp(Data.getLastBackupDate());
  }

  function handleExport() {
    Data.exportBackup();
    renderLastBackup();
    showToast('Backup downloaded successfully', 'success');
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
      showToast('Please select a .json backup file', 'danger');
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
        showToast('Invalid backup file', 'danger');
        return;
      }
      confirmRestore(text, selectedFile.name);
    };
    reader.onerror = () => {
      showToast('Could not read file', 'danger');
    };
    reader.readAsText(selectedFile);
  }

  function confirmRestore(jsonText, filename) {
    openModal('Restore from Backup', `
      <p>Restore from <strong>${escapeHtml(filename)}</strong>?</p>
      <p>This will DELETE all current data and replace it with the backup.</p>
      <p>This cannot be undone.</p>
    `, [
      { label: 'Cancel', class: 'btn-secondary', onClick: closeModal },
      { label: 'Yes, Restore', class: 'btn-primary', onClick: () => doRestore(jsonText) }
    ]);
  }

  function doRestore(jsonText) {
    let counts;
    try {
      counts = Data.importBackup(jsonText);
    } catch (e) {
      showToast('Invalid backup file', 'danger');
      return;
    }

    closeModal();
    resetFileSelection();
    renderLastBackup();
    renderDataOverview();

    showToast(
      `Restored: ${counts.settlements} settlements, ${counts.expenses} expenses, ${counts.invoices} invoices, ${counts.allowances} allowances`,
      'success'
    );
    showToast('Data restored successfully', 'success');
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
      { label: 'Settlements', count: Data.getSettlements().length },
      { label: 'Expenses', count: Data.getExpenses().length },
      { label: 'Invoices', count: Data.getInvoices().length },
      { label: 'Allowances', count: Data.getAllowances().length }
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
        <td>Total</td>
        <td>${total}</td>
      </tr>
    `;
  }

  // ---- init ----

  function initSettingsPage() {
    if (!document.getElementById('export-backup-btn')) return;

    renderLastBackup();
    renderDataOverview();
    setupDropZone();

    document.getElementById('export-backup-btn').addEventListener('click', handleExport);
    document.getElementById('restore-btn').addEventListener('click', handleRestoreClick);
    document.getElementById('refresh-counts-btn').addEventListener('click', renderDataOverview);
  }

  document.addEventListener('DOMContentLoaded', initSettingsPage);

})();
