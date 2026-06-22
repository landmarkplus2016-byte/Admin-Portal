// js/i18n.js — translation dictionary + language switching. Read-only at
// runtime: pages call window.t(key) for dynamic strings, and any element
// with data-i18n / data-i18n-placeholder is translated automatically.

(function () {

  const TRANSLATIONS = {
    en: {
      'app.name': 'HR Admin Portal',

      'nav.dashboard': 'Dashboard',
      'nav.settlements': 'Settlements',
      'nav.expenses': 'Expenses',
      'nav.invoices': 'Invoices & Dues',
      'nav.allowances': 'Allowances',
      'nav.settings': 'Settings',

      'sidebar.subLabel': 'HR PORTAL',
      'sidebar.menuLabel': 'Menu',
      'sidebar.userName': 'Admin',
      'sidebar.userRole': 'Administrator',
      'sidebar.backupHealthyTitle': 'Backup healthy',
      'sidebar.backupOverdueTitle': 'Backup overdue',
      'sidebar.backupNeverSub': 'No backup yet',
      'sidebar.backupTodaySub': 'Last export today',
      'sidebar.backupDaysSub': 'Last export {days}d ago',

      'common.export': 'Export',
      'common.previous': 'Previous',
      'common.next': 'Next',
      'common.searchAnything': 'Search anything…',
      'dashboard.subtitle': 'Overview across all departments',
      'settlements.subtitle': 'Track employee settlement payments',
      'expenses.subtitle': 'Manage field expense records',
      'invoices.subtitle': 'Track contractor invoices and dues',
      'allowances.subtitle': 'Manage allowances, inventory, and bonuses',
      'settings.subtitle': 'Backup, restore, and manage data',

      'common.cancel': 'Cancel',
      'common.save': 'Save',
      'common.delete': 'Delete',
      'common.select': '— Select —',
      'common.refresh': 'Refresh',
      'common.fixErrors': 'Please fix the errors below',
      'common.nameRequired': 'Name is required',
      'common.valueRequired': 'A valid value is required',

      'common.field.name': 'Name',
      'common.field.value': 'Value',
      'common.field.engineer': 'Engineer',
      'common.field.receivedDate': 'Received Date',
      'common.field.signatureDate': 'Signature Date',
      'common.field.financeDate': 'Finance Date',
      'common.field.with': 'With',
      'common.field.department': 'Department',
      'common.field.notes': 'Notes',
      'common.field.approval': 'Approval',
      'common.field.siteId': 'Site ID',
      'common.field.contractor': 'Contractor',
      'common.field.invoiceNo': 'Invoice No.',
      'common.field.coordinator': 'Coordinator',
      'common.field.coordinatorDate': 'Coordinator Date',
      'common.field.coordinatorFinished': 'Coordinator Finished',
      'common.field.vfCode': 'VF Code',
      'common.field.aliaaDate': 'Aliaa Date',
      'common.field.aliaaFinished': 'Aliaa Finished',
      'common.field.ashrafDate': 'Ashraf/Mohannad Date',
      'common.field.ashrafFinished': 'Ashraf/Mohannad Finished',
      'common.field.modification': 'Modification',
      'common.field.manager': 'Manager',
      'common.field.paymentMethod': 'Payment Method',

      'status.Approved': 'Approved',
      'status.Hold': 'Hold',
      'status.Canceled': 'Canceled',
      'status.Rejected': 'Rejected',
      'payment.transfer': 'Transfer',
      'payment.cash': 'Cash',

      'records.summary': 'Showing {count} records — Total: {total}',

      'dashboard.backupNever': "You haven't backed up yet.",
      'dashboard.backupOverdue': "You haven't backed up in {days} days.",
      'dashboard.goToSettings': 'Go to Settings',
      'dashboard.toExport': 'to export a backup.',
      'dashboard.records': '{count} records',
      'dashboard.quickApproved': 'Approved expenses:',
      'dashboard.quickHold': 'Hold:',
      'dashboard.quickCanceled': 'Canceled:',

      'settlements.title': 'Settlements',
      'settlements.searchPlaceholder': 'Search by name or notes...',
      'settlements.allDepartments': 'All Departments',
      'settlements.allEngineers': 'All Engineers',
      'settlements.addButton': 'Add Settlement',
      'settlements.emptyDefault': "No settlements found. Click 'Add Settlement' to get started.",
      'settlements.emptyFiltered': 'No settlements match your search/filters.',
      'settlements.modalAdd': 'Add Settlement',
      'settlements.modalEdit': 'Edit Settlement',
      'settlements.toastAdded': 'Settlement added',
      'settlements.toastUpdated': 'Settlement updated',
      'settlements.toastDeleted': 'Settlement deleted',
      'settlements.confirmDelete': 'Delete this settlement?',

      'expenses.title': 'Expenses',
      'expenses.searchPlaceholder': 'Search by name, site ID, or notes...',
      'expenses.allDepartments': 'All Departments',
      'expenses.allApproval': 'All Approval',
      'expenses.allPayment': 'All Payment',
      'expenses.addButton': 'Add Expense',
      'expenses.emptyDefault': "No expenses found. Click 'Add Expense' to get started.",
      'expenses.emptyFiltered': 'No expenses match your search/filters.',
      'expenses.modalAdd': 'Add Expense',
      'expenses.modalEdit': 'Edit Expense',
      'expenses.toastAdded': 'Expense added',
      'expenses.toastUpdated': 'Expense updated',
      'expenses.toastDeleted': 'Expense deleted',
      'expenses.confirmDelete': 'Delete this expense?',

      'invoices.title': 'Invoices & Dues',
      'invoices.searchPlaceholder': 'Search by contractor, invoice no., site ID, or notes...',
      'invoices.allContractors': 'All Contractors',
      'invoices.allApproval': 'All Approval',
      'invoices.addButton': 'Add Invoice',
      'invoices.colInvoiceNo': 'Inv. No.',
      'invoices.emptyDefault': "No invoices found. Click 'Add Invoice' to get started.",
      'invoices.emptyFiltered': 'No invoices match your search/filters.',
      'invoices.modalAdd': 'Add Invoice',
      'invoices.modalEdit': 'Edit Invoice',
      'invoices.toastAdded': 'Invoice added',
      'invoices.toastUpdated': 'Invoice updated',
      'invoices.toastDeleted': 'Invoice deleted',
      'invoices.confirmDelete': 'Delete this invoice?',
      'invoices.contractorRequired': 'Contractor is required',
      'invoices.receivedDateRequired': 'Received Date is required',
      'invoices.timelineReceived': 'Received',
      'invoices.timelineCoordinator': 'Coordinator',
      'invoices.timelineVfAliaa': 'VF Code / Aliaa',
      'invoices.timelineAshraf': 'Ashraf/Mohannad',
      'invoices.timelineFinance': 'Finance',
      'invoices.timelineDone': 'Done',
      'invoices.timelinePending': 'Pending',

      'allowances.title': 'Allowances',
      'allowances.searchPlaceholder': 'Search by name...',
      'allowances.allDepartments': 'All Departments',
      'allowances.allEngineers': 'All Engineers',
      'allowances.addButton': 'Add Allowance',
      'allowances.emptyDefault': "No allowances found. Click 'Add Allowance' to get started.",
      'allowances.emptyFiltered': 'No allowances match your search/filters.',
      'allowances.modalAdd': 'Add Allowance',
      'allowances.modalEdit': 'Edit Allowance',
      'allowances.toastAdded': 'Allowance added',
      'allowances.toastUpdated': 'Allowance updated',
      'allowances.toastDeleted': 'Allowance deleted',
      'allowances.confirmDelete': 'Delete this allowance?',

      'settings.title': 'Settings',
      'settings.backup.title': 'Backup Data',
      'settings.backup.desc': 'Export all your data as a JSON file. Save it to Google Drive for safekeeping.',
      'settings.backup.lastPrefix': 'Last backup:',
      'settings.backup.never': 'Never',
      'settings.backup.exportButton': 'Export Backup',
      'settings.backup.toastExported': 'Backup downloaded successfully',

      'settings.restore.title': 'Restore from Backup',
      'settings.restore.desc': 'Upload a backup file to restore all data.\nWARNING: This will replace ALL current data.',
      'settings.restore.dropZoneText': 'Drag a backup file here, or click to browse',
      'settings.restore.restoreButton': 'Restore',
      'settings.restore.selectJsonFile': 'Please select a .json backup file',
      'settings.restore.invalidFile': 'Invalid backup file',
      'settings.restore.couldNotRead': 'Could not read file',
      'settings.restore.modalTitle': 'Restore from Backup',
      'settings.restore.modalLine1': 'Restore from {filename}?',
      'settings.restore.modalWarning': 'This will DELETE all current data and replace it with the backup.',
      'settings.restore.modalCannotUndo': 'This cannot be undone.',
      'settings.restore.yesButton': 'Yes, Restore',
      'settings.restore.toastSummary': 'Restored: {settlements} settlements, {expenses} expenses, {invoices} invoices, {allowances} allowances',
      'settings.restore.toastSuccess': 'Data restored successfully',

      'settings.currentData.title': 'Current Data',
      'settings.currentData.colTable': 'Table',
      'settings.currentData.colRecords': 'Records',
      'settings.currentData.totalRow': 'Total',

      'settings.manageLists.title': 'Manage Lists',
      'settings.manageLists.desc': 'Add or remove the items that appear in dropdown menus across the app.',
      'settings.manageLists.addPlaceholder': 'Add new item...',
      'settings.manageLists.addButton': 'Add',
      'settings.manageLists.empty': 'No items yet.',
      'settings.manageLists.confirmRemove': 'Remove "{value}" from this list?',
      'settings.manageLists.toastAdded': 'Item added',
      'settings.manageLists.toastRemoved': 'Item removed',
      'settings.manageLists.toastDuplicate': 'That item already exists in the list',

      'list.departments': 'Departments',
      'list.settlementEngineers': 'Engineers (Settlements/Allowances)',
      'list.expenseManagers': 'Expense Managers',
      'list.contractors': 'Contractors'
    },

    ar: {
      'app.name': 'بوابة شؤون الموظفين',

      'nav.dashboard': 'الرئيسية',
      'nav.settlements': 'التسويات',
      'nav.expenses': 'العهد',
      'nav.invoices': 'الفواتير والمستحقات',
      'nav.allowances': 'البدلات',
      'nav.settings': 'الإعدادات',

      'sidebar.subLabel': 'بوابة الموارد البشرية',
      'sidebar.menuLabel': 'القائمة',
      'sidebar.userName': 'الأدمن',
      'sidebar.userRole': 'مسؤول النظام',
      'sidebar.backupHealthyTitle': 'النسخة الاحتياطية سليمة',
      'sidebar.backupOverdueTitle': 'النسخة الاحتياطية متأخرة',
      'sidebar.backupNeverSub': 'لا توجد نسخة احتياطية بعد',
      'sidebar.backupTodaySub': 'آخر تصدير اليوم',
      'sidebar.backupDaysSub': 'آخر تصدير منذ {days} يوم',

      'common.export': 'تصدير',
      'common.previous': 'السابق',
      'common.next': 'التالي',
      'common.searchAnything': 'بحث عن أي شيء...',
      'dashboard.subtitle': 'نظرة عامة على جميع الأقسام',
      'settlements.subtitle': 'تتبع مدفوعات تسوية الموظفين',
      'expenses.subtitle': 'إدارة سجلات العهد الميدانية',
      'invoices.subtitle': 'تتبع فواتير ومستحقات المتعهدين',
      'allowances.subtitle': 'إدارة البدلات والمخزون والمكافآت',
      'settings.subtitle': 'النسخ الاحتياطي والاستعادة وإدارة البيانات',

      'common.cancel': 'إلغاء',
      'common.save': 'حفظ',
      'common.delete': 'حذف',
      'common.select': '— اختر —',
      'common.refresh': 'تحديث',
      'common.fixErrors': 'يرجى تصحيح الأخطاء أدناه',
      'common.nameRequired': 'الاسم مطلوب',
      'common.valueRequired': 'يجب إدخال قيمة صحيحة',

      'common.field.name': 'الاسم',
      'common.field.value': 'القيمة',
      'common.field.engineer': 'المهندس',
      'common.field.receivedDate': 'تاريخ الاستلام',
      'common.field.signatureDate': 'تاريخ التوقيع',
      'common.field.financeDate': 'تاريخ الصرف',
      'common.field.with': 'مع',
      'common.field.department': 'القسم',
      'common.field.notes': 'ملاحظات',
      'common.field.approval': 'الحالة',
      'common.field.siteId': 'رقم الموقع',
      'common.field.contractor': 'المتعهد',
      'common.field.invoiceNo': 'رقم الفاتورة',
      'common.field.coordinator': 'المنسق',
      'common.field.coordinatorDate': 'تاريخ المنسق',
      'common.field.coordinatorFinished': 'انتهاء المنسق',
      'common.field.vfCode': 'رمز VF',
      'common.field.aliaaDate': 'تاريخ علياء',
      'common.field.aliaaFinished': 'انتهاء علياء',
      'common.field.ashrafDate': 'تاريخ أشرف/مهند',
      'common.field.ashrafFinished': 'انتهاء أشرف/مهند',
      'common.field.modification': 'تعديل',
      'common.field.manager': 'المسؤول',
      'common.field.paymentMethod': 'طريقة الدفع',

      'status.Approved': 'معتمد',
      'status.Hold': 'معلق',
      'status.Canceled': 'ملغى',
      'status.Rejected': 'مرفوض',
      'payment.transfer': 'تحويل',
      'payment.cash': 'نقدي',

      'records.summary': 'عرض {count} سجل — الإجمالي: {total}',

      'dashboard.backupNever': 'لم تقم بأخذ نسخة احتياطية بعد.',
      'dashboard.backupOverdue': 'لم تقم بأخذ نسخة احتياطية منذ {days} يوم.',
      'dashboard.goToSettings': 'اذهب إلى الإعدادات',
      'dashboard.toExport': 'لتصدير نسخة احتياطية.',
      'dashboard.records': '{count} سجل',
      'dashboard.quickApproved': 'عهد معتمدة:',
      'dashboard.quickHold': 'معلقة:',
      'dashboard.quickCanceled': 'ملغاة:',

      'settlements.title': 'التسويات',
      'settlements.searchPlaceholder': 'بحث بالاسم أو الملاحظات...',
      'settlements.allDepartments': 'كل الأقسام',
      'settlements.allEngineers': 'كل المهندسين',
      'settlements.addButton': 'إضافة تسوية',
      'settlements.emptyDefault': "لا توجد تسويات. اضغط 'إضافة تسوية' للبدء.",
      'settlements.emptyFiltered': 'لا توجد تسويات تطابق البحث/الفلاتر.',
      'settlements.modalAdd': 'إضافة تسوية',
      'settlements.modalEdit': 'تعديل تسوية',
      'settlements.toastAdded': 'تمت إضافة التسوية',
      'settlements.toastUpdated': 'تم تحديث التسوية',
      'settlements.toastDeleted': 'تم حذف التسوية',
      'settlements.confirmDelete': 'حذف هذه التسوية؟',

      'expenses.title': 'العهد',
      'expenses.searchPlaceholder': 'بحث بالاسم أو رقم الموقع أو الملاحظات...',
      'expenses.allDepartments': 'كل الأقسام',
      'expenses.allApproval': 'كل الحالات',
      'expenses.allPayment': 'كل طرق الدفع',
      'expenses.addButton': 'إضافة عهدة',
      'expenses.emptyDefault': "لا توجد عهد. اضغط 'إضافة عهدة' للبدء.",
      'expenses.emptyFiltered': 'لا توجد عهد تطابق البحث/الفلاتر.',
      'expenses.modalAdd': 'إضافة عهدة',
      'expenses.modalEdit': 'تعديل عهدة',
      'expenses.toastAdded': 'تمت إضافة العهدة',
      'expenses.toastUpdated': 'تم تحديث العهدة',
      'expenses.toastDeleted': 'تم حذف العهدة',
      'expenses.confirmDelete': 'حذف هذه العهدة؟',

      'invoices.title': 'الفواتير والمستحقات',
      'invoices.searchPlaceholder': 'بحث بالمتعهد أو رقم الفاتورة أو رقم الموقع أو الملاحظات...',
      'invoices.allContractors': 'كل المتعهدين',
      'invoices.allApproval': 'كل الحالات',
      'invoices.addButton': 'إضافة فاتورة',
      'invoices.colInvoiceNo': 'رقم الفاتورة',
      'invoices.emptyDefault': "لا توجد فواتير. اضغط 'إضافة فاتورة' للبدء.",
      'invoices.emptyFiltered': 'لا توجد فواتير تطابق البحث/الفلاتر.',
      'invoices.modalAdd': 'إضافة فاتورة',
      'invoices.modalEdit': 'تعديل فاتورة',
      'invoices.toastAdded': 'تمت إضافة الفاتورة',
      'invoices.toastUpdated': 'تم تحديث الفاتورة',
      'invoices.toastDeleted': 'تم حذف الفاتورة',
      'invoices.confirmDelete': 'حذف هذه الفاتورة؟',
      'invoices.contractorRequired': 'المتعهد مطلوب',
      'invoices.receivedDateRequired': 'تاريخ الاستلام مطلوب',
      'invoices.timelineReceived': 'الاستلام',
      'invoices.timelineCoordinator': 'المنسق',
      'invoices.timelineVfAliaa': 'رمز VF / علياء',
      'invoices.timelineAshraf': 'أشرف/مهند',
      'invoices.timelineFinance': 'الصرف',
      'invoices.timelineDone': 'تم',
      'invoices.timelinePending': 'قيد الانتظار',

      'allowances.title': 'البدلات',
      'allowances.searchPlaceholder': 'بحث بالاسم...',
      'allowances.allDepartments': 'كل الأقسام',
      'allowances.allEngineers': 'كل المهندسين',
      'allowances.addButton': 'إضافة بدل',
      'allowances.emptyDefault': "لا توجد بدلات. اضغط 'إضافة بدل' للبدء.",
      'allowances.emptyFiltered': 'لا توجد بدلات تطابق البحث/الفلاتر.',
      'allowances.modalAdd': 'إضافة بدل',
      'allowances.modalEdit': 'تعديل بدل',
      'allowances.toastAdded': 'تمت إضافة البدل',
      'allowances.toastUpdated': 'تم تحديث البدل',
      'allowances.toastDeleted': 'تم حذف البدل',
      'allowances.confirmDelete': 'حذف هذا البدل؟',

      'settings.title': 'الإعدادات',
      'settings.backup.title': 'نسخ احتياطي للبيانات',
      'settings.backup.desc': 'صدّر كل بياناتك كملف JSON. احفظه على Google Drive للأمان.',
      'settings.backup.lastPrefix': 'آخر نسخة احتياطية:',
      'settings.backup.never': 'لم تتم أبداً',
      'settings.backup.exportButton': 'تصدير نسخة احتياطية',
      'settings.backup.toastExported': 'تم تنزيل النسخة الاحتياطية بنجاح',

      'settings.restore.title': 'استعادة من نسخة احتياطية',
      'settings.restore.desc': 'قم برفع ملف نسخة احتياطية لاستعادة كل البيانات.\nتحذير: سيؤدي هذا إلى استبدال كل البيانات الحالية.',
      'settings.restore.dropZoneText': 'اسحب ملف النسخة الاحتياطية هنا، أو اضغط للاختيار',
      'settings.restore.restoreButton': 'استعادة',
      'settings.restore.selectJsonFile': 'يرجى اختيار ملف نسخة احتياطية بصيغة .json',
      'settings.restore.invalidFile': 'ملف النسخة الاحتياطية غير صالح',
      'settings.restore.couldNotRead': 'تعذر قراءة الملف',
      'settings.restore.modalTitle': 'استعادة من نسخة احتياطية',
      'settings.restore.modalLine1': 'استعادة من {filename}؟',
      'settings.restore.modalWarning': 'سيؤدي هذا إلى حذف كل البيانات الحالية واستبدالها بالنسخة الاحتياطية.',
      'settings.restore.modalCannotUndo': 'لا يمكن التراجع عن هذا الإجراء.',
      'settings.restore.yesButton': 'نعم، استعادة',
      'settings.restore.toastSummary': 'تمت الاستعادة: {settlements} تسوية، {expenses} عهدة، {invoices} فاتورة، {allowances} بدل',
      'settings.restore.toastSuccess': 'تمت استعادة البيانات بنجاح',

      'settings.currentData.title': 'البيانات الحالية',
      'settings.currentData.colTable': 'الجدول',
      'settings.currentData.colRecords': 'السجلات',
      'settings.currentData.totalRow': 'الإجمالي',

      'settings.manageLists.title': 'إدارة القوائم',
      'settings.manageLists.desc': 'أضف أو احذف العناصر التي تظهر في القوائم المنسدلة عبر التطبيق.',
      'settings.manageLists.addPlaceholder': 'إضافة عنصر جديد...',
      'settings.manageLists.addButton': 'إضافة',
      'settings.manageLists.empty': 'لا توجد عناصر بعد.',
      'settings.manageLists.confirmRemove': 'حذف "{value}" من هذه القائمة؟',
      'settings.manageLists.toastAdded': 'تمت إضافة العنصر',
      'settings.manageLists.toastRemoved': 'تم حذف العنصر',
      'settings.manageLists.toastDuplicate': 'هذا العنصر موجود بالفعل في القائمة',

      'list.departments': 'الأقسام',
      'list.settlementEngineers': 'المهندسون (التسويات/البدلات)',
      'list.expenseManagers': 'مسؤولو العهد',
      'list.contractors': 'المتعهدون'
    }
  };

  function currentLang() {
    return (window.Data && Data.getLanguage()) || 'en';
  }

  function t(key, vars) {
    const lang = currentLang();
    const table = TRANSLATIONS[lang] || TRANSLATIONS.en;
    let str = table[key];
    if (str === undefined) str = (TRANSLATIONS.en[key] !== undefined) ? TRANSLATIONS.en[key] : key;
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace('{' + k + '}', vars[k]);
      });
    }
    return str;
  }

  function applyStaticTranslations() {
    const lang = currentLang();
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      el.placeholder = t(el.dataset.i18nPlaceholder);
    });

    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (toggleBtn) {
      toggleBtn.textContent = lang === 'ar' ? 'English' : 'العربية';
    }
  }

  function initLangToggle() {
    const toggleBtn = document.getElementById('lang-toggle-btn');
    if (!toggleBtn) return;
    toggleBtn.addEventListener('click', () => {
      const next = currentLang() === 'ar' ? 'en' : 'ar';
      Data.setLanguage(next);
      window.location.reload();
    });
  }

  window.t = t;
  window.applyStaticTranslations = applyStaticTranslations;

  document.addEventListener('DOMContentLoaded', () => {
    applyStaticTranslations();
    initLangToggle();
  });

})();
