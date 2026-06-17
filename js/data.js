// js/data.js — the ONLY file that touches localStorage.
// All pages must call window.Data.* — never localStorage directly.

(function () {

  const KEYS = {
    settlements: 'hrap_settlements',
    expenses:    'hrap_expenses',
    invoices:    'hrap_invoices',
    allowances:  'hrap_allowances',
    meta:        'hrap_meta',
    lists:       'hrap_lists',
    lang:        'hrap_lang'
  };

  // Editable lists — managed from the Settings page. Seeded once with these
  // defaults, then everything after that lives in localStorage.
  const LIST_DEFS = {
    departments: 'list.departments',
    settlementEngineers: 'list.settlementEngineers',
    expenseManagers: 'list.expenseManagers',
    contractors: 'list.contractors'
  };

  const DEFAULT_LISTS = {
    departments: [
      'AQ', 'Con', 'Plus', 'Telecom', 'Mark', 'Transportation Mark',
      'Transportation Plus', 'Fabrications', 'Acc', 'IT', 'Safety T', 'Safety C'
    ],
    settlementEngineers: [
      'Shady', 'Amr', 'Fleet', 'Mohannad', 'Mostafa',
      'Birary', 'Amr Sabry', 'Ayman', 'Amer', 'Hussein'
    ],
    expenseManagers: [
      'A. Fawzy', 'A. Talaat', 'A. Ali', 'Mohsen', 'Amr Refaat',
      'S. Kamel', 'Asem', 'Ibrahim', 'Emad', 'Khodary', 'Khaled', 'Tariq', 'Kassem',
      'Sameh', 'Shrief', 'Dalia', 'Taha', 'M. Amin', 'A. Tawfik', 'Ibrahim Habib',
      'Rana', 'Osama C', 'Osama T', 'Saad'
    ],
    contractors: ['Join', 'Star Tech', 'Almotaheda', 'Basic', 'Otak', 'GSEC']
  };

  const APPROVAL_STATUSES = ['Approved', 'Hold', 'Canceled'];
  const INVOICE_APPROVAL_STATUSES = ['Approved', 'Rejected'];
  const PAYMENT_METHODS = ['transfer', 'cash'];

  // ---- editable lists ----

  function getLists() {
    const raw = localStorage.getItem(KEYS.lists);
    let lists;
    if (!raw) {
      lists = {};
    } else {
      try {
        lists = JSON.parse(raw) || {};
      } catch (e) {
        lists = {};
      }
    }
    let changed = !raw;
    Object.keys(DEFAULT_LISTS).forEach(function (key) {
      if (!Array.isArray(lists[key])) {
        lists[key] = DEFAULT_LISTS[key].slice();
        changed = true;
      }
    });
    if (changed) {
      localStorage.setItem(KEYS.lists, JSON.stringify(lists));
    }
    return lists;
  }

  function getList(key) {
    return getLists()[key] || [];
  }

  function addListItem(key, value) {
    const trimmed = (value || '').trim();
    if (!trimmed) return false;
    const lists = getLists();
    const items = lists[key] || [];
    const exists = items.some(function (item) {
      return item.toLowerCase() === trimmed.toLowerCase();
    });
    if (exists) return false;
    items.push(trimmed);
    lists[key] = items;
    localStorage.setItem(KEYS.lists, JSON.stringify(lists));
    return true;
  }

  function removeListItem(key, value) {
    const lists = getLists();
    lists[key] = (lists[key] || []).filter(function (item) { return item !== value; });
    localStorage.setItem(KEYS.lists, JSON.stringify(lists));
  }

  // ---- language ----

  function getLanguage() {
    return localStorage.getItem(KEYS.lang) || 'en';
  }

  function setLanguage(lang) {
    localStorage.setItem(KEYS.lang, lang);
  }

  // ---- low-level storage helpers ----

  function readArray(key) {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function writeArray(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  // ---- generic table operations (used by all 4 tables) ----

  function getAll(key) {
    return readArray(key);
  }

  function getActive(key) {
    return readArray(key).filter(function (r) { return r.deleted !== true; });
  }

  function saveRecord(key, record) {
    const all = readArray(key);
    const idx = all.findIndex(function (r) { return r.id === record.id; });
    record.updatedAt = nowIso();
    if (idx >= 0) {
      all[idx] = Object.assign({}, all[idx], record);
    } else {
      if (!record.createdAt) record.createdAt = nowIso();
      if (record.deleted === undefined) record.deleted = false;
      all.push(record);
    }
    writeArray(key, all);
    saveMeta({ updatedAt: nowIso() });
    return record;
  }

  function deleteRecord(key, id) {
    const all = readArray(key);
    const idx = all.findIndex(function (r) { return r.id === id; });
    if (idx >= 0) {
      all[idx].deleted = true;
      all[idx].updatedAt = nowIso();
      writeArray(key, all);
      saveMeta({ updatedAt: nowIso() });
    }
  }

  // ---- meta ----

  function getMeta() {
    const raw = localStorage.getItem(KEYS.meta);
    if (!raw) return {};
    try {
      return JSON.parse(raw) || {};
    } catch (e) {
      return {};
    }
  }

  function saveMeta(updates) {
    const current = getMeta();
    const merged = Object.assign({}, current, updates);
    localStorage.setItem(KEYS.meta, JSON.stringify(merged));
    return merged;
  }

  function getLastBackupDate() {
    return getMeta().lastBackup || null;
  }

  // ---- ids ----

  function generateId(prefix) {
    return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 5);
  }

  // ---- backup / restore ----

  function exportBackup() {
    const payload = {
      app: 'HR Admin Portal',
      version: '1.0',
      exported_at: nowIso(),
      data: {
        settlements: getAll(KEYS.settlements),
        expenses: getAll(KEYS.expenses),
        invoices: getAll(KEYS.invoices),
        allowances: getAll(KEYS.allowances)
      }
    };

    const json = JSON.stringify(payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const filename = 'hrap_backup_' + y + '-' + m + '-' + day + '.json';

    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    saveMeta({ lastBackup: nowIso() });
  }

  function importBackup(jsonString) {
    let parsed;
    try {
      parsed = JSON.parse(jsonString);
    } catch (e) {
      throw new Error('Invalid backup file');
    }

    const data = parsed && parsed.data;
    if (!data || !Array.isArray(data.settlements) || !Array.isArray(data.expenses) ||
        !Array.isArray(data.invoices) || !Array.isArray(data.allowances)) {
      throw new Error('Invalid backup file');
    }

    localStorage.removeItem(KEYS.settlements);
    localStorage.removeItem(KEYS.expenses);
    localStorage.removeItem(KEYS.invoices);
    localStorage.removeItem(KEYS.allowances);

    writeArray(KEYS.settlements, data.settlements);
    writeArray(KEYS.expenses, data.expenses);
    writeArray(KEYS.invoices, data.invoices);
    writeArray(KEYS.allowances, data.allowances);

    saveMeta({ lastBackup: nowIso() });

    return {
      settlements: data.settlements.length,
      expenses: data.expenses.length,
      invoices: data.invoices.length,
      allowances: data.allowances.length
    };
  }

  // ---- public API ----

  window.Data = {
    KEYS: KEYS,
    LIST_DEFS: LIST_DEFS,
    APPROVAL_STATUSES: APPROVAL_STATUSES,
    INVOICE_APPROVAL_STATUSES: INVOICE_APPROVAL_STATUSES,
    PAYMENT_METHODS: PAYMENT_METHODS,

    // editable lists
    getLists: getLists,
    getList: getList,
    addListItem: addListItem,
    removeListItem: removeListItem,
    getDepartments: function () { return getList('departments'); },
    getSettlementEngineers: function () { return getList('settlementEngineers'); },
    getExpenseManagers: function () { return getList('expenseManagers'); },
    getContractors: function () { return getList('contractors'); },

    // language
    getLanguage: getLanguage,
    setLanguage: setLanguage,

    // settlements
    getSettlements: function () { return getActive(KEYS.settlements); },
    getAllSettlements: function () { return getAll(KEYS.settlements); },
    saveSettlement: function (record) { return saveRecord(KEYS.settlements, record); },
    deleteSettlement: function (id) { return deleteRecord(KEYS.settlements, id); },

    // expenses
    getExpenses: function () { return getActive(KEYS.expenses); },
    getAllExpenses: function () { return getAll(KEYS.expenses); },
    saveExpense: function (record) { return saveRecord(KEYS.expenses, record); },
    deleteExpense: function (id) { return deleteRecord(KEYS.expenses, id); },

    // invoices
    getInvoices: function () { return getActive(KEYS.invoices); },
    getAllInvoices: function () { return getAll(KEYS.invoices); },
    saveInvoice: function (record) { return saveRecord(KEYS.invoices, record); },
    deleteInvoice: function (id) { return deleteRecord(KEYS.invoices, id); },

    // allowances
    getAllowances: function () { return getActive(KEYS.allowances); },
    getAllAllowances: function () { return getAll(KEYS.allowances); },
    saveAllowance: function (record) { return saveRecord(KEYS.allowances, record); },
    deleteAllowance: function (id) { return deleteRecord(KEYS.allowances, id); },

    // meta
    getMeta: getMeta,
    saveMeta: saveMeta,
    getLastBackupDate: getLastBackupDate,

    // backup / restore
    exportBackup: exportBackup,
    importBackup: importBackup,

    // utils
    generateId: generateId
  };

})();
