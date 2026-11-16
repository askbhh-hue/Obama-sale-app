/**
 * Google Apps Script — ربط نموذج الطلبات بجدول Google Sheets
 *
 * خطوات التفعيل السريعة:
 * 1. افتح Google Sheets وأنشئ جدول بيانات جديد.
 * 2. من القائمة: الإضافات (Extensions) > Apps Script.
 * 3. امسح الكود الموجود والصق هذا الملف بالكامل ثم احفظ (Ctrl+S).
 * 4. اضغط Deploy > New deployment > Select type: Web app.
 * 5. اختر Execute as: Me و Who has access: Anyone.
 * 6. انسخ رابط الـ Web app وضعه في متغير GOOGLE_SCRIPT_URL داخل src/config/siteConfig.ts.
 */

var SHEET_NAME = 'Leads';

var HEADERS = [
  'timestamp',
  'name',
  'phone',
  'email',
  'governorate',
  'address',
  'crop',
  'product',
  'quantity',
  'notes',
  'utm_source',
  'utm_campaign',
  'utm_content',
  'page_url'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    }

    var rawBody = e && e.postData && e.postData.contents ? e.postData.contents : '{}';
    var data = {};
    try {
      data = JSON.parse(rawBody);
    } catch (parseErr) {
      data = (e && e.parameter) ? e.parameter : {};
    }

    var row = [
      data.timestamp || new Date().toISOString(),
      data.name || '',
      data.phone || '',
      data.email || '',
      data.governorate || '',
      data.address || '',
      data.crop || '',
      data.product || '',
      data.quantity || '',
      data.notes || '',
      data.utm_source || '',
      data.utm_campaign || '',
      data.utm_content || '',
      data.pageUrl || ''
    ];

    sheet.appendRow(row);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService
    .createTextOutput(JSON.stringify({ status: 'ready', sheet: SHEET_NAME }))
    .setMimeType(ContentService.MimeType.JSON);
}
