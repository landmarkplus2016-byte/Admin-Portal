// js/expenses.js — Expenses page logic only.

(function () {

  let sortField = 'receivedDate';
  let sortDir = 'desc';

  function populateFilterOptions() {
    const deptSelect = document.getElementById('department-filter');
    Data.getDepartments().forEach((dept) => {
      deptSelect.insertAdjacentHTML('beforeend', `<option value="${escapeHtml(dept)}">${escapeHtml(dept)}</option>`);
    });
  }

  function getFilters() {
    return {
      search: document.getElementById('search-input').value.trim().toLowerCase(),
      department: document.getElementById('department-filter').value,
      approval: document.getElementById('approval-filter').value,
      payment: document.getElementById('payment-filter').value
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
    document.querySelectorAll('#expenses-table th').forEach((th) => {
      th.classList.remove('sort-asc', 'sort-desc');
      if (th.dataset.field === sortField) {
        th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
      }
    });
  }

  function approvalBadgeClass(approval) {
    if (approval === 'Approved') return 'badge-success';
    if (approval === 'Hold') return 'badge-warning';
    if (approval === 'Canceled') return 'badge-danger';
    return 'badge-neutral';
  }

  function paymentBadgeClass(method) {
    return method === 'transfer' ? 'badge-info' : 'badge-neutral';
  }

  function paymentLabel(method) {
    return method === 'transfer' ? t('payment.transfer') : t('payment.cash');
  }

  function renderExpenses() {
    const filters = getFilters();
    let records = Data.getExpenses();

    if (filters.search) {
      records = records.filter((r) =>
        (r.name || '').toLowerCase().includes(filters.search) ||
        (r.siteId || '').toLowerCase().includes(filters.search) ||
        (r.notes || '').toLowerCase().includes(filters.search)
      );
    }

    if (filters.department) {
      records = records.filter((r) => r.department === filters.department);
    }

    if (filters.approval) {
      records = records.filter((r) => r.approval === filters.approval);
    }

    if (filters.payment) {
      records = records.filter((r) => r.paymentMethod === filters.payment);
    }

    records = applySort(records);

    const total = records.reduce((sum, r) => sum + (Number(r.value) || 0), 0);
    document.getElementById('record-count').textContent =
      t('records.summary', { count: records.length, total: formatCurrency(total) });

    const tbody = document.getElementById('expenses-tbody');

    if (records.length === 0) {
      const isFiltered = filters.search || filters.department || filters.approval || filters.payment;
      const message = isFiltered
        ? t('expenses.emptyFiltered')
        : t('expenses.emptyDefault');
      tbody.innerHTML = `<tr><td colspan="11" class="empty-state">${message}</td></tr>`;
    } else {
      tbody.innerHTML = records.map((r) => `
        <tr data-id="${escapeHtml(r.id)}">
          <td dir="auto" class="cell-truncate" title="${escapeHtml(r.name)}">${escapeHtml(r.name)}</td>
          <td dir="auto">${escapeHtml(r.siteId)}</td>
          <td>${formatCurrency(r.value)}</td>
          <td>${formatDate(r.receivedDate)}</td>
          <td>${formatDate(r.signatureDate)}</td>
          <td>${formatDate(r.financeDate)}</td>
          <td><span class="badge ${paymentBadgeClass(r.paymentMethod)}">${paymentLabel(r.paymentMethod)}</span></td>
          <td><span class="badge ${approvalBadgeClass(r.approval)}">${t('status.' + r.approval)}</span></td>
          <td>${escapeHtml(r.manager)}</td>
          <td>${escapeHtml(r.department)}</td>
          <td dir="auto" class="cell-truncate" title="${escapeHtml(r.notes)}">${escapeHtml(r.notes)}</td>
        </tr>
      `).join('');
    }

    updateSortIndicators();
    attachRowListeners();
  }

  function attachHeaderListeners() {
    document.querySelectorAll('#expenses-table th[data-field]').forEach((th) => {
      th.addEventListener('click', () => {
        const field = th.dataset.field;
        if (sortField === field) {
          sortDir = sortDir === 'asc' ? 'desc' : 'asc';
        } else {
          sortField = field;
          sortDir = 'asc';
        }
        renderExpenses();
      });
    });
  }

  function attachRowListeners() {
    document.querySelectorAll('#expenses-tbody tr[data-id]').forEach((tr) => {
      tr.addEventListener('click', () => {
        const id = tr.dataset.id;
        const record = Data.getExpenses().find((r) => r.id === id);
        if (record) openEditModal(record);
      });
    });
  }

  function expenseFormHtml(record) {
    const r = record || {};

    const managerOptions = Data.getExpenseManagers().map((m) =>
      `<option value="${escapeHtml(m)}" ${r.manager === m ? 'selected' : ''}>${escapeHtml(m)}</option>`
    ).join('');

    const departmentOptions = Data.getDepartments().map((dept) =>
      `<option value="${escapeHtml(dept)}" ${r.department === dept ? 'selected' : ''}>${escapeHtml(dept)}</option>`
    ).join('');

    const paymentOptions = Data.PAYMENT_METHODS.map((p) =>
      `<option value="${escapeHtml(p)}" ${r.paymentMethod === p ? 'selected' : ''}>${escapeHtml(paymentLabel(p))}</option>`
    ).join('');

    const approvalOptions = Data.APPROVAL_STATUSES.map((a) =>
      `<option value="${escapeHtml(a)}" ${r.approval === a ? 'selected' : ''}>${escapeHtml(t('status.' + a))}</option>`
    ).join('');

    return `
      <div class="form-group">
        <label>${t('common.field.name')}</label>
        <input type="text" id="f-name" dir="auto" value="${escapeHtml(r.name)}">
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
        <label>${t('common.field.paymentMethod')}</label>
        <select id="f-paymentMethod">
          <option value="">${t('common.select')}</option>
          ${paymentOptions}
        </select>
      </div>
      <div class="form-group">
        <label>${t('common.field.approval')}</label>
        <select id="f-approval">
          <option value="">${t('common.select')}</option>
          ${approvalOptions}
        </select>
      </div>
      <div class="form-group">
        <label>${t('common.field.manager')}</label>
        <select id="f-manager">
          <option value="">${t('common.select')}</option>
          ${managerOptions}
        </select>
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
      id: id || generateId('EXP'),
      name: name,
      siteId: document.getElementById('f-siteId').value.trim(),
      value: Number(valueRaw),
      receivedDate: document.getElementById('f-receivedDate').value,
      signatureDate: document.getElementById('f-signatureDate').value,
      financeDate: document.getElementById('f-financeDate').value || null,
      with: document.getElementById('f-with').value.trim(),
      paymentMethod: document.getElementById('f-paymentMethod').value,
      approval: document.getElementById('f-approval').value,
      manager: document.getElementById('f-manager').value,
      department: document.getElementById('f-department').value,
      notes: document.getElementById('f-notes').value.trim(),
      deleted: false
    };

    Data.saveExpense(record);
    closeModal();
    renderExpenses();
    showToast(id ? t('expenses.toastUpdated') : t('expenses.toastAdded'));
  }

  function handleDelete(id) {
    if (!confirm(t('expenses.confirmDelete'))) return;
    Data.deleteExpense(id);
    closeModal();
    renderExpenses();
    showToast(t('expenses.toastDeleted'));
  }

  function openAddModal() {
    openModal(t('expenses.modalAdd'), expenseFormHtml(), [
      { label: t('common.cancel'), class: 'btn-secondary', onClick: closeModal },
      { label: t('common.save'), class: 'btn-primary', onClick: () => saveFromForm(null) }
    ]);
  }

  function openEditModal(record) {
    openModal(t('expenses.modalEdit'), expenseFormHtml(record), [
      { label: t('common.delete'), class: 'btn-secondary', onClick: () => handleDelete(record.id) },
      { label: t('common.cancel'), class: 'btn-secondary', onClick: closeModal },
      { label: t('common.save'), class: 'btn-primary', onClick: () => saveFromForm(record.id) }
    ]);
  }

  function initExpensesPage() {
    if (!document.getElementById('expenses-table')) return;

    populateFilterOptions();
    attachHeaderListeners();

    document.getElementById('search-input').addEventListener('input', debounce(renderExpenses, 200));
    document.getElementById('department-filter').addEventListener('change', renderExpenses);
    document.getElementById('approval-filter').addEventListener('change', renderExpenses);
    document.getElementById('payment-filter').addEventListener('change', renderExpenses);
    document.getElementById('add-expense-btn').addEventListener('click', openAddModal);

    renderExpenses();
  }

  document.addEventListener('DOMContentLoaded', initExpensesPage);

})();
