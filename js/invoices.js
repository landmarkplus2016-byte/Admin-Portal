// js/invoices.js — Invoices & Dues page logic only.

(function () {

  let sortField = 'receivedDate';
  let sortDir = 'desc';
  let selectedIds = new Set();

  function populateFilterOptions() {
    const contractorSelect = document.getElementById('contractor-filter');
    Data.getContractors().forEach((c) => {
      contractorSelect.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(c)}">${escapeHtml(c)}</option>`);
    });
  }

  function getFilters() {
    return {
      search: document.getElementById('search-input').value.trim().toLowerCase(),
      contractor: document.getElementById('contractor-filter').value,
      approval: document.getElementById('approval-filter').value
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
    document.querySelectorAll('#invoices-table th').forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.field === sortField) {
        th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      }
    });
  }

  function approvalBadgeClass(approval) {
    if (approval === 'Approved') return 'badge-success';
    if (approval === 'Rejected') return 'badge-danger';
    return 'badge-neutral';
  }

  function renderInvoices() {
    const filters = getFilters();
    let records = Data.getInvoices();

    const liveIds = new Set(records.map((r) => r.id));
    selectedIds.forEach((id) => { if (!liveIds.has(id)) selectedIds.delete(id); });

    if (filters.search) {
      records = records.filter((r) =>
        (r.contractor || '').toLowerCase().includes(filters.search) ||
        (r.invoiceNo || '').toString().toLowerCase().includes(filters.search) ||
        (r.siteId || '').toLowerCase().includes(filters.search) ||
        (r.notes || '').toLowerCase().includes(filters.search)
      );
    }

    if (filters.contractor) {
      records = records.filter((r) => r.contractor === filters.contractor);
    }

    if (filters.approval) {
      records = records.filter((r) => r.approval === filters.approval);
    }

    records = applySort(records);

    const total = records.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
    document.getElementById('record-count').textContent =
      t('records.summary', { count: records.length, total: formatCurrency(total) });

    const tbody = document.getElementById('invoices-tbody');

    if (records.length === 0) {
      const isFiltered = filters.search || filters.contractor || filters.approval;
      const message = isFiltered
        ? t('invoices.emptyFiltered')
        : t('invoices.emptyDefault');
      tbody.innerHTML = `<tr><td colspan="17" class="empty-state">${message}</td></tr>`;
    } else {
      tbody.innerHTML = records.map((r) => `
        <tr data-id="${escapeHtml(r.id)}">
          <td class="td-checkbox"><input type="checkbox" class="row-checkbox" data-id="${escapeHtml(r.id)}" ${selectedIds.has(r.id) ? 'checked' : ''}></td>
          <td dir="auto" class="cell-truncate" title="${escapeHtml(r.contractor)}">${escapeHtml(r.contractor)}</td>
          <td>${escapeHtml(r.invoiceNo)}</td>
          <td dir="auto">${escapeHtml(r.siteId)}</td>
          <td>${formatCurrency(r.value)}</td>
          <td>${formatDate(r.receivedDate)}</td>
          <td dir="auto">${escapeHtml(r.coordinator)}</td>
          <td>${formatDate(r.coordinatorDate)}</td>
          <td>${formatDate(r.coordinatorFinished)}</td>
          <td>${escapeHtml(r.vfCode)}</td>
          <td>${formatDate(r.aliaaDate)}</td>
          <td>${formatDate(r.aliaaFinished)}</td>
          <td>${formatDate(r.ashrafDate)}</td>
          <td>${formatDate(r.ashrafFinished)}</td>
          <td>${formatDate(r.financeDate)}</td>
          <td><span class="badge ${approvalBadgeClass(r.approval)}">${t('status.' + r.approval)}</span></td>
          <td dir="auto" class="cell-truncate" title="${escapeHtml(r.notes)}">${escapeHtml(r.notes)}</td>
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
    document.querySelectorAll('#invoices-tbody .row-checkbox').forEach((cb) => {
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
    const checkboxes = document.querySelectorAll('#invoices-tbody .row-checkbox');
    const total = checkboxes.length;
    const checked = document.querySelectorAll('#invoices-tbody .row-checkbox:checked').length;
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
    const approvalOptions = Data.INVOICE_APPROVAL_STATUSES.map((a) =>
      `<option value="${escapeHtml(a)}">${escapeHtml(t('status.' + a))}</option>`
    ).join('');

    return `
      <p>${t('common.bulkEditHint')}</p>
      <div class="form-group">
        <label>${t('common.field.receivedDate')}</label>
        <input type="date" id="bulk-receivedDate">
      </div>
      <div class="form-group">
        <label>${t('common.field.coordinator')}</label>
        <input type="text" id="bulk-coordinator" dir="auto">
      </div>
      <div class="form-group">
        <label>${t('common.field.coordinatorDate')}</label>
        <input type="date" id="bulk-coordinatorDate">
      </div>
      <div class="form-group">
        <label>${t('common.field.coordinatorFinished')}</label>
        <input type="date" id="bulk-coordinatorFinished">
      </div>
      <div class="form-group">
        <label>${t('common.field.vfCode')}</label>
        <input type="text" id="bulk-vfCode">
      </div>
      <div class="form-group">
        <label>${t('common.field.aliaaDate')}</label>
        <input type="date" id="bulk-aliaaDate">
      </div>
      <div class="form-group">
        <label>${t('common.field.aliaaFinished')}</label>
        <input type="date" id="bulk-aliaaFinished">
      </div>
      <div class="form-group">
        <label>${t('common.field.ashrafDate')}</label>
        <input type="date" id="bulk-ashrafDate">
      </div>
      <div class="form-group">
        <label>${t('common.field.ashrafFinished')}</label>
        <input type="date" id="bulk-ashrafFinished">
      </div>
      <div class="form-group">
        <label>${t('common.field.financeDate')}</label>
        <input type="date" id="bulk-financeDate">
      </div>
      <div class="form-group">
        <label>${t('common.field.approval')}</label>
        <select id="bulk-approval">
          <option value="">${t('common.noChange')}</option>
          ${approvalOptions}
        </select>
      </div>
      <div class="form-group">
        <label>${t('common.field.with')}</label>
        <input type="text" id="bulk-with" dir="auto">
      </div>
    `;
  }

  function saveBulkEdit() {
    const patch = {};
    const fieldIds = [
      'receivedDate', 'coordinatorDate', 'coordinatorFinished',
      'aliaaDate', 'aliaaFinished', 'ashrafDate', 'ashrafFinished', 'financeDate'
    ];
    fieldIds.forEach((field) => {
      const val = document.getElementById('bulk-' + field).value;
      if (val) patch[field] = val;
    });

    const coordinator = document.getElementById('bulk-coordinator').value.trim();
    const vfCode = document.getElementById('bulk-vfCode').value.trim();
    const withVal = document.getElementById('bulk-with').value.trim();
    const approval = document.getElementById('bulk-approval').value;

    if (coordinator) patch.coordinator = coordinator;
    if (vfCode) patch.vfCode = vfCode;
    if (withVal) patch.with = withVal;
    if (approval) patch.approval = approval;

    if (Object.keys(patch).length === 0) {
      showToast(t('common.noFieldsChanged'), 'danger');
      return;
    }

    const count = selectedIds.size;
    selectedIds.forEach((id) => {
      Data.saveInvoice(Object.assign({ id: id }, patch));
    });
    selectedIds.clear();
    closeModal();
    renderInvoices();
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
    document.querySelectorAll('#invoices-table th[data-field]').forEach((th) => {
      th.addEventListener('click', () => {
        const field = th.dataset.field;
        if (sortField === field) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortField = field;
          sortDir = 'asc';
        }
        renderInvoices();
      });
    });
  }

  function attachRowListeners() {
    document.querySelectorAll('#invoices-tbody tr[data-id]').forEach((tr) => {
      tr.addEventListener('click', (e) => {
        if (e.target.closest('.td-checkbox')) return;
        const id = tr.dataset.id;
        const record = Data.getInvoices().find((r) => r.id === id);
        if (record) openEditModal(record);
      });
    });
  }

  function timelineHtml(r) {
    const steps = [
      { label: t('invoices.timelineReceived'), date: r.receivedDate },
      { label: t('invoices.timelineCoordinator'), date: r.coordinatorFinished || r.coordinatorDate },
      { label: t('invoices.timelineVfAliaa'), date: r.aliaaFinished || r.aliaaDate },
      { label: t('invoices.timelineAshraf'), date: r.ashrafFinished || r.ashrafDate },
      { label: t('invoices.timelineFinance'), date: r.financeDate },
      { label: t('invoices.timelineDone'), date: r.approval ? (r.financeDate || r.updatedAt) : null }
    ];

    const stepsHtml = steps.map((step) => {
      const done = !!step.date;
      return `
        <div class="timeline-step ${done ? 'done' : 'pending'}">
          <div class="timeline-line"></div>
          <div class="timeline-dot"></div>
          <div class="timeline-label">${escapeHtml(step.label)}</div>
          <div class="timeline-date">${done ? formatDate(step.date.slice ? step.date.slice(0, 10) : step.date) : t('invoices.timelinePending')}</div>
        </div>
      `;
    }).join('');

    return `<div class="timeline">${stepsHtml}</div>`;
  }

  function invoiceFormHtml(record) {
    const r = record || {};

    const contractorOptions = Data.getContractors().map((c) =>
      `<option value="${escapeHtml(c)}" ${r.contractor === c ? 'selected' : ''}>${escapeHtml(c)}</option>`
    ).join('');

    const approvalOptions = Data.INVOICE_APPROVAL_STATUSES.map((a) =>
      `<option value="${escapeHtml(a)}" ${r.approval === a ? 'selected' : ''}>${escapeHtml(t('status.' + a))}</option>`
    ).join('');

    return `
      ${record ? timelineHtml(r) : ''}
      <div class="form-group">
        <label>${t('common.field.contractor')}</label>
        <select id="f-contractor">
          <option value="">${t('common.select')}</option>
          ${contractorOptions}
        </select>
      </div>
      <div class="form-group">
        <label>${t('common.field.receivedDate')}</label>
        <input type="date" id="f-receivedDate" value="${record ? formatDateInput(r.receivedDate) : todayIso()}">
      </div>
      <div class="form-group">
        <label>${t('common.field.invoiceNo')}</label>
        <input type="text" id="f-invoiceNo" value="${escapeHtml(r.invoiceNo)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.siteId')}</label>
        <input type="text" id="f-siteId" dir="auto" value="${escapeHtml(r.siteId)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.value')}</label>
        <input type="number" id="f-value" value="${r.value !== undefined && r.value !== null ? r.value : ''}">
      </div>
      <div class="form-group">
        <label>${t('common.field.coordinator')}</label>
        <input type="text" id="f-coordinator" dir="auto" value="${escapeHtml(r.coordinator)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.coordinatorDate')}</label>
        <input type="date" id="f-coordinatorDate" value="${formatDateInput(r.coordinatorDate)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.coordinatorFinished')}</label>
        <input type="date" id="f-coordinatorFinished" value="${formatDateInput(r.coordinatorFinished)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.vfCode')}</label>
        <input type="text" id="f-vfCode" value="${escapeHtml(r.vfCode)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.aliaaDate')}</label>
        <input type="date" id="f-aliaaDate" value="${formatDateInput(r.aliaaDate)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.aliaaFinished')}</label>
        <input type="date" id="f-aliaaFinished" value="${formatDateInput(r.aliaaFinished)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.ashrafDate')}</label>
        <input type="date" id="f-ashrafDate" value="${formatDateInput(r.ashrafDate)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.ashrafFinished')}</label>
        <input type="date" id="f-ashrafFinished" value="${formatDateInput(r.ashrafFinished)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.modification')}</label>
        <textarea id="f-modification" rows="2">${escapeHtml(r.modification)}</textarea>
      </div>
      <div class="form-group">
        <label>${t('common.field.financeDate')}</label>
        <input type="date" id="f-financeDate" value="${formatDateInput(r.financeDate)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.approval')}</label>
        <select id="f-approval">
          <option value="">${t('common.select')}</option>
          ${approvalOptions}
        </select>
      </div>
      <div class="form-group">
        <label>${t('common.field.with')}</label>
        <input type="text" id="f-with" dir="auto" value="${escapeHtml(r.with)}">
      </div>
      <div class="form-group">
        <label>${t('common.field.notes')}</label>
        <textarea id="f-notes" dir="auto" rows="3">${escapeHtml(r.notes)}</textarea>
      </div>
    `;
  }

  function saveFromForm(id) {
    clearFieldErrors(document.querySelector('.modal-body'));

    const contractorInput = document.getElementById('f-contractor');
    const receivedDateInput = document.getElementById('f-receivedDate');
    const valueInput = document.getElementById('f-value');
    const contractor = contractorInput.value;
    const receivedDate = receivedDateInput.value;
    const valueRaw = valueInput.value;

    let valid = true;
    if (!contractor) {
      setFieldError(contractorInput, t('invoices.contractorRequired'));
      valid = false;
    }
    if (!receivedDate) {
      setFieldError(receivedDateInput, t('invoices.receivedDateRequired'));
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
      id: id || generateId('INV'),
      contractor: contractor,
      receivedDate: receivedDate,
      invoiceNo: document.getElementById('f-invoiceNo').value.trim(),
      siteId: document.getElementById('f-siteId').value.trim(),
      value: Number(valueRaw),
      coordinator: document.getElementById('f-coordinator').value.trim(),
      coordinatorDate: document.getElementById('f-coordinatorDate').value || null,
      coordinatorFinished: document.getElementById('f-coordinatorFinished').value || null,
      vfCode: document.getElementById('f-vfCode').value.trim(),
      aliaaDate: document.getElementById('f-aliaaDate').value || null,
      aliaaFinished: document.getElementById('f-aliaaFinished').value || null,
      ashrafDate: document.getElementById('f-ashrafDate').value || null,
      ashrafFinished: document.getElementById('f-ashrafFinished').value || null,
      modification: document.getElementById('f-modification').value.trim(),
      financeDate: document.getElementById('f-financeDate').value || null,
      approval: document.getElementById('f-approval').value,
      with: document.getElementById('f-with').value.trim(),
      notes: document.getElementById('f-notes').value.trim(),
      deleted: false
    };

    Data.saveInvoice(record);
    closeModal();
    renderInvoices();
    showToast(id ? t('invoices.toastUpdated') : t('invoices.toastAdded'));
  }

  function handleDelete(id) {
    if (!confirm(t('invoices.confirmDelete'))) return;
    Data.deleteInvoice(id);
    closeModal();
    renderInvoices();
    showToast(t('invoices.toastDeleted'));
  }

  function openAddModal() {
    openModal(t('invoices.modalAdd'), invoiceFormHtml(), [
      { label: t('common.cancel'), class: 'btn-secondary', onClick: closeModal },
      { label: t('common.save'), class: 'btn-primary', onClick: () => saveFromForm(null) }
    ]);
  }

  function openEditModal(record) {
    openModal(t('invoices.modalEdit'), invoiceFormHtml(record), [
      { label: t('common.delete'), class: 'btn-secondary', onClick: () => handleDelete(record.id) },
      { label: t('common.cancel'), class: 'btn-secondary', onClick: closeModal },
      { label: t('common.save'), class: 'btn-primary', onClick: () => saveFromForm(record.id) }
    ]);
  }

  function initInvoicesPage() {
    if (!document.getElementById('invoices-table')) return;

    populateFilterOptions();
    attachHeaderListeners();

    document.getElementById('search-input').addEventListener('input', debounce(renderInvoices, 200));
    document.getElementById('contractor-filter').addEventListener('change', renderInvoices);
    document.getElementById('approval-filter').addEventListener('change', renderInvoices);
    document.getElementById('add-invoice-btn').addEventListener('click', openAddModal);

    document.getElementById('select-all-checkbox').addEventListener('change', (e) => {
      const checked = e.target.checked;
      document.querySelectorAll('#invoices-tbody .row-checkbox').forEach((cb) => {
        cb.checked = checked;
        if (checked) selectedIds.add(cb.dataset.id);
        else selectedIds.delete(cb.dataset.id);
      });
      updateBulkBar();
    });
    document.getElementById('bulk-clear-btn').addEventListener('click', () => {
      selectedIds.clear();
      renderInvoices();
    });
    document.getElementById('bulk-edit-btn').addEventListener('click', openBulkEditModal);

    renderInvoices();
  }

  document.addEventListener('DOMContentLoaded', initInvoicesPage);

})();
