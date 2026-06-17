// js/allowances.js — Allowances page logic only.

(function () {

  let sortField = 'receivedDate';
  let sortDir = 'desc';

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
      tbody.innerHTML = `<tr><td colspan="7" class="empty-state">${message}</td></tr>`;
    } else {
      tbody.innerHTML = records.map((r) => `
        <tr data-id="${escapeHtml(r.id)}">
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
      tr.addEventListener('click', () => {
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

    renderAllowances();
  }

  document.addEventListener('DOMContentLoaded', initAllowancesPage);

})();
