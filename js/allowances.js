// js/allowances.js — Allowances page logic only.

(function () {

  let sortField = 'receivedDate';
  let sortDir = 'desc';
  let selectedIds = new Set();

  function populateFilterOptions() {
    const deptSelect = document.getElementById('department-filter');
    Data.getDepartments().forEach((dept) => {
      deptSelect.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(dept)}">${escapeHtml(dept)}</option>`);
    });

    const engSelect = document.getElementById('engineer-filter');
    Data.getSettlementEngineers().forEach((eng) => {
      engSelect.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(eng)}">${escapeHtml(eng)}</option>`);
    });
  }

  function getFilters() {
    return {
      search: document.getElementById('search-input').value.trim().toLowerCase(),
      department: document.getElementById('department-filter').value,
      engineer: document.getElementById('engineer-filter').value
    };
  }

  function applySort(records) {
    return [...records].sort((a, b) => {
      let av = a[sortField];
      let bv = b[sortField];

      if (sortField === 'value') {
        av = Number(av) || 0;
        bv = Number(bv) || 0;
      } else {
        av = (av || '').toString().toLowerCase();
        bv = (bv || '').toString().toLowerCase();
      }

      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }

  function updateSortIndicators() {
    document.querySelectorAll('#allowances-table th').forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.field === sortField) {
        th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      }
    });
  }

  function renderAllowances() {
    const filters = getFilters();
    let records = Data.getAllowances();

    const liveIds = new Set(records.map((r) => r.id));
    selectedIds.forEach((id) => { if (!liveIds.has(id)) selectedIds.delete(id); });

    if (filters.search) {
      records = records.filter((r) =>
        (r.name || '').toLowerCase().includes(filters.search)
      );
    }

    if (filters.department) {
      records = records.filter((r) => r.department === filters.department);
    }

    if (filters.engineer) {
      records = records.filter((r) => r.engineer === filters.engineer);
    }

    records = applySort(records);

    const total = records.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
    document.getElementById('record-count').textContent =
      t('records.summary', { count: records.length, total: formatCurrency(total) });

    const tbody = document.getElementById('allowances-tbody');

    if (records.length === 0) {
      const isFiltered = filters.search || filters.department || filters.engineer;
      const message = isFiltered
        ? t('allowances.emptyFiltered')
        : t('allowances.emptyDefault');
      tbody.innerHTML = `<tr><td colspan="8" class="empty-state">${message}</td></tr>`;
    } else {
      tbody.innerHTML = records.map((r) => `
        <tr data-id="${escapeHtml(r.id)}">
          <td class="td-checkbox"><input type="checkbox" class="row-checkbox" data-id="${escapeHtml(r.id)}" ${selectedIds.has(r.id) ? 'checked' : ''}></td>
          <td dir="auto" class="cell-truncate" title="${escapeHtml(r.name)}">${escapeHtml(r.name)}</td>
          <td>${formatCurrency(r.value)}</td>
          <td>${escapeHtml(r.engineer)}</td>
          <td>${formatDate(r.receivedDate)}</td>
          <td>${formatDate(r.signatureDate)}</td>
          <td>${escapeHtml(r.department)}</td>
          <td>${formatDate(r.financeDate)}</td>
        </tr>
      `).join('');
    }

    updateSortIndicators();
    attachRowListeners();
    attachCheckboxListeners();
    updateSelectAllState();
    updateBulkBar();
  }

  // ---- bulk selection ----

  function attachCheckboxListeners() {
    document.querySelectorAll('#allowances-tbody .row-checkbox').forEach((cb) => {
      cb.addEventListener('change', () => {
        if (cb.checked) selectedIds.add(cb.dataset.id);
        else selectedIds.delete(cb.dataset.id);
        updateSelectAllState();
        updateBulkBar();
      });
    });
  }

  function updateSelectAllState() {
    const selectAll = document.getElementById('select-all-checkbox');
    if (!selectAll) return;
    const checkboxes = document.querySelectorAll('#allowances-tbody .row-checkbox');
    const total = checkboxes.length;
    const checked = document.querySelectorAll('#allowances-tbody .row-checkbox:checked').length;
    selectAll.checked = total > 0 && checked === total;
    selectAll.indeterminate = checked > 0 && checked < total;
  }

  function updateBulkBar() {
    const bar = document.getElementById('bulk-bar');
    const countEl = document.getElementById('bulk-bar-count');
    if (!bar || !countEl) return;
    bar.classList.toggle('hidden', selectedIds.size === 0);
    countEl.textContent = t('common.selected', { count: selectedIds.size });
  }

  function bulkEditFormHtml() {
    const engineerOptions = Data.getSettlementEngineers().map((eng) =>
      `<option value="${escapeHtml(eng)}">${escapeHtml(eng)}</option>`
    ).join('');

    const departmentOptions = Data.getDepartments().map((dept) =>
      `<option value="${escapeHtml(dept)}">${escapeHtml(dept)}</option>`
    ).join('');

    return `
      <p>${t('common.bulkEditHint')}</p>
      <div class="form-group">
        <label>${t('common.field.engineer')}</label>
        <select id="bulk-engineer">
          <option value="">${t('common.noChange')}</option>
          ${engineerOptions}
        </select>
      </div>
      <div class="form-group">
        <label>${t('common.field.receivedDate')}</label>
        <input type="date" id="bulk-receivedDate">
      </div>
      <div class="form-group">
        <label>${t('common.field.signatureDate')}</label>
        <input type="date" id="bulk-signatureDate">
      </div>
      <div class="form-group">
        <label>${t('common.field.financeDate')}</label>
        <input type="date" id="bulk-financeDate">
      </div>
      <div class="form-group">
        <label>${t('common.field.department')}</label>
        <select id="bulk-department">
          <option value="">${t('common.noChange')}</option>
          ${departmentOptions}
        </select>
      </div>
    `;
  }

  function saveBulkEdit() {
    const patch = {};
    const engineer = document.getElementById('bulk-engineer').value;
    const receivedDate = document.getElementById('bulk-receivedDate').value;
    const signatureDate = document.getElementById('bulk-signatureDate').value;
    const financeDate = document.getElementById('bulk-financeDate').value;
    const department = document.getElementById('bulk-department').value;

    if (engineer) patch.engineer = engineer;
    if (receivedDate) patch.receivedDate = receivedDate;
    if (signatureDate) patch.signatureDate = signatureDate;
    if (financeDate) patch.financeDate = financeDate;
    if (department) patch.department = department;

    if (Object.keys(patch).length === 0) {
      showToast(t('common.noFieldsChanged'), 'danger');
      return;
    }

    const count = selectedIds.size;
    selectedIds.forEach((id) => {
      Data.saveAllowance(Object.assign({ id: id }, patch));
    });
    selectedIds.clear();
    closeModal();
    renderAllowances();
    showToast(t('common.bulkUpdated', { count: count }));
  }

  function openBulkEditModal() {
    if (selectedIds.size === 0) return;
    openModal(t('common.bulkEditTitle', { count: selectedIds.size }), bulkEditFormHtml(), [
      { label: t('common.cancel'), class: 'btn-secondary', onClick: closeModal },
      { label: t('common.save'), class: 'btn-primary', onClick: saveBulkEdit }
    ]);
  }

  function attachHeaderListeners() {
    document.querySelectorAll('#allowances-table th[data-field]').forEach((th) => {
      th.addEventListener('click', () => {
        const field = th.dataset.field;
        if (sortField === field) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortField = field;
          sortDir = 'asc';
        }
        renderAllowances();
      });
    });
  }

  function attachRowListeners() {
    document.querySelectorAll('#allowances-tbody tr[data-id]').forEach((tr) => {
      tr.addEventListener('click', (e) => {
        if (e.target.closest('.td-checkbox')) return;
        const id = tr.dataset.id;
        const record = Data.getAllowances().find((r) => r.id === id);
        if (record) openEditModal(record);
      });
    });
  }

  function allowanceFormHtml(record) {
    const r = record || {};

    const engineerOptions = Data.getSettlementEngineers().map((eng) =>
      `<option value="${escapeHtml(eng)}" ${r.engineer === eng ? 'selected' : ''}>${escapeHtml(eng)}</option>`
    ).join('');

    const departmentOptions = Data.getDepartments().map((dept) =>
      `<option value="${escapeHtml(dept)}" ${r.department === dept ? 'selected' : ''}>${escapeHtml(dept)}</option>`
    ).join('');

    return `
      <div class="form-group">
        <label>${t('common.field.name')}</label>
        <input type="text" id="f-name" dir="auto" value="${escapeHtml(r.name)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.value')}</label>
        <input type="number" id="f-value" value="${r.value !== undefined && r.value !== null ? r.value : ''}">
      </div>
      <div class="form-group">
        <label>${t('common.field.engineer')}</label>
        <select id="f-engineer">
          <option value="">${t('common.select')}</option>
          ${engineerOptions}
        </select>
      </div>
      <div class="form-group">
        <label>${t('common.field.receivedDate')}</label>
        <input type="date" id="f-receivedDate" value="${record ? formatDateInput(r.receivedDate) : todayIso()}">
      </div>
      <div class="form-group">
        <label>${t('common.field.signatureDate')}</label>
        <input type="date" id="f-signatureDate" value="${formatDateInput(r.signatureDate)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.department')}</label>
        <select id="f-department">
          <option value="">${t('common.select')}</option>
          ${departmentOptions}
        </select>
      </div>
      <div class="form-group">
        <label>${t('common.field.financeDate')}</label>
        <input type="date" id="f-financeDate" value="${formatDateInput(r.financeDate)}">
      </div>
    `;
  }

  function saveFromForm(id) {
    clearFieldErrors(document.querySelector('.modal-body'));

    const nameInput = document.getElementById('f-name');
    const valueInput = document.getElementById('f-value');
    const name = nameInput.value.trim();
    const valueRaw = valueInput.value;

    let valid = true;
    if (!name) {
      setFieldError(nameInput, t('common.nameRequired'));
      valid = false;
    }
    if (valueRaw === '' || isNaN(Number(valueRaw))) {
      setFieldError(valueInput, t('common.valueRequired'));
      valid = false;
    }
    if (!valid) {
      showToast(t('common.fixErrors'), 'danger');
      return;
    }

    const record = {
      id: id || generateId('ALW'),
      name: name,
      value: Number(valueRaw),
      engineer: document.getElementById('f-engineer').value,
      receivedDate: document.getElementById('f-receivedDate').value,
      signatureDate: document.getElementById('f-signatureDate').value,
      department: document.getElementById('f-department').value,
      financeDate: document.getElementById('f-financeDate').value || null,
      deleted: false
    };

    Data.saveAllowance(record);
    closeModal();
    renderAllowances();
    showToast(id ? t('allowances.toastUpdated') : t('allowances.toastAdded'));
  }

  function handleDelete(id) {
    if (!confirm(t('allowances.confirmDelete'))) return;
    Data.deleteAllowance(id);
    closeModal();
    renderAllowances();
    showToast(t('allowances.toastDeleted'));
  }

  function openAddModal() {
    openModal(t('allowances.modalAdd'), allowanceFormHtml(), [
      { label: t('common.cancel'), class: 'btn-secondary', onClick: closeModal },
      { label: t('common.save'), class: 'btn-primary', onClick: () => saveFromForm(null) }
    ]);
  }

  function openEditModal(record) {
    openModal(t('allowances.modalEdit'), allowanceFormHtml(record), [
      { label: t('common.delete'), class: 'btn-secondary', onClick: () => handleDelete(record.id) },
      { label: t('common.cancel'), class: 'btn-secondary', onClick: closeModal },
      { label: t('common.save'), class: 'btn-primary', onClick: () => saveFromForm(record.id) }
    ]);
  }

  function initAllowancesPage() {
    if (!document.getElementById('allowances-table')) return;

    populateFilterOptions();
    attachHeaderListeners();

    document.getElementById('search-input').addEventListener('input', debounce(renderAllowances, 200));
    document.getElementById('department-filter').addEventListener('change', renderAllowances);
    document.getElementById('engineer-filter').addEventListener('change', renderAllowances);
    document.getElementById('add-allowance-btn').addEventListener('click', openAddModal);

    document.getElementById('select-all-checkbox').addEventListener('change', (e) => {
      const checked = e.target.checked;
      document.querySelectorAll('#allowances-tbody .row-checkbox').forEach((cb) => {
        cb.checked = checked;
        if (checked) selectedIds.add(cb.dataset.id);
        else selectedIds.delete(cb.dataset.id);
      });
      updateBulkBar();
    });
    document.getElementById('bulk-clear-btn').addEventListener('click', () => {
      selectedIds.clear();
      renderAllowances();
    });
    document.getElementById('bulk-edit-btn').addEventListener('click', openBulkEditModal);

    renderAllowances();
  }

  document.addEventListener('DOMContentLoaded', initAllowancesPage);

})();
