// js/expenses.js — Expenses page logic only.

(function () {

  let sortField = 'receivedDate';
  let sortDir = 'desc';

  function populateFilterOptions() {
    const deptSelect = document.getElementById('department-filter');
    Data.DEPARTMENTS.forEach((dept) => {
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
    return method === 'transfer' ? 'Transfer' : 'Cash';
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
      `Showing ${records.length} records — Total: ${formatCurrency(total)}`;

    const tbody = document.getElementById('expenses-tbody');

    if (records.length === 0) {
      tbody.innerHTML = `<tr><td colspan="10" class="empty-state">No expenses found.</td></tr>`;
    } else {
      tbody.innerHTML = records.map((r) => `
        <tr data-id="${escapeHtml(r.id)}">
          <td dir="auto">${escapeHtml(r.name)}</td>
          <td dir="auto">${escapeHtml(r.siteId)}</td>
          <td>${formatCurrency(r.value)}</td>
          <td>${formatDate(r.receivedDate)}</td>
          <td>${formatDate(r.financeDate)}</td>
          <td><span class="badge ${paymentBadgeClass(r.paymentMethod)}">${paymentLabel(r.paymentMethod)}</span></td>
          <td><span class="badge ${approvalBadgeClass(r.approval)}">${escapeHtml(r.approval)}</span></td>
          <td>${escapeHtml(r.manager)}</td>
          <td>${escapeHtml(r.department)}</td>
          <td dir="auto">${escapeHtml(r.notes)}</td>
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

    const managerOptions = Data.EXPENSE_MANAGERS.map((m) =>
      `<option value="${escapeHtml(m)}" ${r.manager === m ? 'selected' : ''}>${escapeHtml(m)}</option>`
    ).join('');

    const departmentOptions = Data.DEPARTMENTS.map((dept) =>
      `<option value="${escapeHtml(dept)}" ${r.department === dept ? 'selected' : ''}>${escapeHtml(dept)}</option>`
    ).join('');

    const paymentOptions = Data.PAYMENT_METHODS.map((p) =>
      `<option value="${escapeHtml(p)}" ${r.paymentMethod === p ? 'selected' : ''}>${escapeHtml(paymentLabel(p))}</option>`
    ).join('');

    const approvalOptions = Data.APPROVAL_STATUSES.map((a) =>
      `<option value="${escapeHtml(a)}" ${r.approval === a ? 'selected' : ''}>${escapeHtml(a)}</option>`
    ).join('');

    return `
      <div class="form-group">
        <label>Name</label>
        <input type="text" id="f-name" dir="auto" value="${escapeHtml(r.name)}">
      </div>
      <div class="form-group">
        <label>Site ID</label>
        <input type="text" id="f-siteId" dir="auto" value="${escapeHtml(r.siteId)}">
      </div>
      <div class="form-group">
        <label>Value</label>
        <input type="number" id="f-value" value="${r.value !== undefined && r.value !== null ? r.value : ''}">
      </div>
      <div class="form-group">
        <label>Received Date</label>
        <input type="date" id="f-receivedDate" value="${formatDateInput(r.receivedDate)}">
      </div>
      <div class="form-group">
        <label>Signature Date</label>
        <input type="date" id="f-signatureDate" value="${formatDateInput(r.signatureDate)}">
      </div>
      <div class="form-group">
        <label>Finance Date</label>
        <input type="date" id="f-financeDate" value="${formatDateInput(r.financeDate)}">
      </div>
      <div class="form-group">
        <label>With</label>
        <input type="text" id="f-with" dir="auto" value="${escapeHtml(r.with)}">
      </div>
      <div class="form-group">
        <label>Payment Method</label>
        <select id="f-paymentMethod">
          <option value="">— Select —</option>
          ${paymentOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Approval</label>
        <select id="f-approval">
          <option value="">— Select —</option>
          ${approvalOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Manager</label>
        <select id="f-manager">
          <option value="">— Select —</option>
          ${managerOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Department</label>
        <select id="f-department">
          <option value="">— Select —</option>
          ${departmentOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Notes</label>
        <textarea id="f-notes" dir="auto" rows="3">${escapeHtml(r.notes)}</textarea>
      </div>
    `;
  }

  function saveFromForm(id) {
    const name = document.getElementById('f-name').value.trim();
    const valueRaw = document.getElementById('f-value').value;

    if (!name || valueRaw === '' || isNaN(Number(valueRaw))) {
      showToast('Name and Value are required', 'danger');
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
    showToast(id ? 'Expense updated' : 'Expense added');
  }

  function handleDelete(id) {
    if (!confirm('Delete this expense?')) return;
    Data.deleteExpense(id);
    closeModal();
    renderExpenses();
    showToast('Expense deleted');
  }

  function openAddModal() {
    openModal('Add Expense', expenseFormHtml(), [
      { label: 'Cancel', class: 'btn-secondary', onClick: closeModal },
      { label: 'Save', class: 'btn-primary', onClick: () => saveFromForm(null) }
    ]);
  }

  function openEditModal(record) {
    openModal('Edit Expense', expenseFormHtml(record), [
      { label: 'Delete', class: 'btn-secondary', onClick: () => handleDelete(record.id) },
      { label: 'Cancel', class: 'btn-secondary', onClick: closeModal },
      { label: 'Save', class: 'btn-primary', onClick: () => saveFromForm(record.id) }
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
