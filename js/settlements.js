// js/settlements.js — Settlements page logic only.

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
    document.querySelectorAll('#settlements-table th').forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.field === sortField) {
        th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      }
    });
  }

  function renderSettlements() {
    const filters = getFilters();
    let records = Data.getSettlements();

    if (filters.search) {
      records = records.filter((r) =>
        (r.name || '').toLowerCase().includes(filters.search) ||
        (r.notes || '').toLowerCase().includes(filters.search)
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

    const tbody = document.getElementById('settlements-tbody');

    if (records.length === 0) {
      const isFiltered = filters.search || filters.department || filters.engineer;
      const message = isFiltered
        ? t('settlements.emptyFiltered')
        : t('settlements.emptyDefault');
      tbody.innerHTML = `<tr><td colspan="8" class="empty-state">${message}</td></tr>`;
    } else {
      tbody.innerHTML = records.map((r) => {
        const engineerDisplay = [r.engineer, r.with].filter(Boolean).map(escapeHtml).join(' / ');
        return `
          <tr data-id="${escapeHtml(r.id)}">
            <td dir="auto" class="cell-truncate" title="${escapeHtml(r.name)}">${escapeHtml(r.name)}</td>
            <td>${formatCurrency(r.value)}</td>
            <td>${engineerDisplay || '—'}</td>
            <td>${formatDate(r.receivedDate)}</td>
            <td>${formatDate(r.signatureDate)}</td>
            <td>${formatDate(r.financeDate)}</td>
            <td>${escapeHtml(r.department)}</td>
            <td dir="auto" class="cell-truncate" title="${escapeHtml(r.notes)}">${escapeHtml(r.notes)}</td>
          </tr>
        `;
      }).join('');
    }

    updateSortIndicators();
    attachRowListeners();
  }

  function attachHeaderListeners() {
    document.querySelectorAll('#settlements-table th[data-field]').forEach((th) => {
      th.addEventListener('click', () => {
        const field = th.dataset.field;
        if (sortField === field) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortField = field;
          sortDir = 'asc';
        }
        renderSettlements();
      });
    });
  }

  function attachRowListeners() {
    document.querySelectorAll('#settlements-tbody tr[data-id]').forEach((tr) => {
      tr.addEventListener('click', () => {
        const id = tr.dataset.id;
        const record = Data.getSettlements().find((r) => r.id === id);
        if (record) openEditModal(record);
      });
    });
  }

  function settlementFormHtml(record) {
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
        <label>${t('common.field.financeDate')}</label>
        <input type="date" id="f-financeDate" value="${formatDateInput(r.financeDate)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.with')}</label>
        <input type="text" id="f-with" dir="auto" value="${escapeHtml(r.with)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.department')}</label>
        <select id="f-department">
          <option value="">${t('common.select')}</option>
          ${departmentOptions}
        </select>
      </div>
      <div class="form-group">
        <label>${t('common.field.notes')}</label>
        <textarea id="f-notes" dir="auto" rows="3">${escapeHtml(r.notes)}</textarea>
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
      id: id || generateId('STL'),
      name: name,
      value: Number(valueRaw),
      engineer: document.getElementById('f-engineer').value,
      receivedDate: document.getElementById('f-receivedDate').value,
      signatureDate: document.getElementById('f-signatureDate').value,
      financeDate: document.getElementById('f-financeDate').value || null,
      with: document.getElementById('f-with').value.trim(),
      department: document.getElementById('f-department').value,
      notes: document.getElementById('f-notes').value.trim(),
      deleted: false
    };

    Data.saveSettlement(record);
    closeModal();
    renderSettlements();
    showToast(id ? t('settlements.toastUpdated') : t('settlements.toastAdded'));
  }

  function handleDelete(id) {
    if (!confirm(t('settlements.confirmDelete'))) return;
    Data.deleteSettlement(id);
    closeModal();
    renderSettlements();
    showToast(t('settlements.toastDeleted'));
  }

  function openAddModal() {
    openModal(t('settlements.modalAdd'), settlementFormHtml(), [
      { label: t('common.cancel'), class: 'btn-secondary', onClick: closeModal },
      { label: t('common.save'), class: 'btn-primary', onClick: () => saveFromForm(null) }
    ]);
  }

  function openEditModal(record) {
    openModal(t('settlements.modalEdit'), settlementFormHtml(record), [
      { label: t('common.delete'), class: 'btn-secondary', onClick: () => handleDelete(record.id) },
      { label: t('common.cancel'), class: 'btn-secondary', onClick: closeModal },
      { label: t('common.save'), class: 'btn-primary', onClick: () => saveFromForm(record.id) }
    ]);
  }

  function initSettlementsPage() {
    if (!document.getElementById('settlements-table')) return;

    populateFilterOptions();
    attachHeaderListeners();

    document.getElementById('search-input').addEventListener('input', debounce(renderSettlements, 200));
    document.getElementById('department-filter').addEventListener('change', renderSettlements);
    document.getElementById('engineer-filter').addEventListener('change', renderSettlements);
    document.getElementById('add-settlement-btn').addEventListener('click', openAddModal);

    renderSettlements();
  }

  document.addEventListener('DOMContentLoaded', initSettlementsPage);

})();
