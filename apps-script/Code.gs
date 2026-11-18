/**
 * Business Valuation lead receiver — Google Apps Script.
 *
 * Paste this into Extensions → Apps Script on the advisor's Google Sheet,
 * then Deploy → New deployment → Web app (Execute as: Me, Access: Anyone).
 * Put the resulting /exec URL in config.js as leadWebhookUrl.
 *
 * Each visitor gets one row. Step 1 creates it (stage "started", so you keep
 * people who drop off), and finishing the valuation updates the same row
 * (stage "completed") with the results.
 */

// Email address(es) to notify; leave blank for no emails. Comma-separate several.
var NOTIFY_EMAIL = '';
// Also email when someone only finishes step 1 (contact info) but hasn't completed yet?
var NOTIFY_ON_START = false;

var SHEET_NAME = 'Leads';
var COLUMNS = [
  'leadId', 'stage', 'submittedAt', 'firstName', 'lastName', 'email', 'phone', 'age',
  'businessName', 'industry', 'taxStructure', 'ownershipPct', 'employees', 'founded',
  'revenue', 'adjustedEbitda', 'valuationMethod', 'multiple', 'valueLow', 'valueMid', 'valueHigh',
  'totalDebt', 'cash', 'ownerProceeds', 'riskScoreAvg',
  'score_custConc', 'score_custCount', 'score_revQuality', 'score_ownerDep',
  'score_keyEmpDep', 'score_buySell', 'score_finRecords', 'score_vendorDep',
  'exitType', 'exitTiming', 'priorities', 'goalAfterTax', 'goalPreTax', 'goalGap',
  'consent', 'consentText', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
  'gclid', 'fbclid', 'pageUrl', 'referrer', 'firm'
];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var data = JSON.parse(e.postData.contents);
    var sheet = getSheet_();
    var ids = sheet.getRange(2, 1, Math.max(sheet.getLastRow() - 1, 1), 1).getValues().map(function (r) { return r[0]; });
    var idx = ids.indexOf(data.leadId);
    var rowNum = idx === -1 ? sheet.getLastRow() + 1 : idx + 2;
    var existing = idx === -1 ? [] : sheet.getRange(rowNum, 1, 1, COLUMNS.length).getValues()[0];

    // Merge: new values win, but never blank out a value we already have.
    var row = COLUMNS.map(function (col, i) {
      var v = data[col];
      return (v === undefined || v === null || v === '') ? (existing[i] === undefined ? '' : existing[i]) : v;
    });
    sheet.getRange(rowNum, 1, 1, COLUMNS.length).setValues([row]);

    if (NOTIFY_EMAIL && (data.stage === 'completed' || (NOTIFY_ON_START && idx === -1))) notify_(data);
    return ContentService.createTextOutput(JSON.stringify({ ok: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS);
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
  }
  return sheet;
}

function money_(n) { return n === '' || n == null ? '—' : '$' + Math.round(Number(n)).toLocaleString('en-US'); }

function notify_(d) {
  var done = d.stage === 'completed';
  var subject = (done ? 'New valuation lead: ' : 'Valuation started: ') + (d.businessName || (d.firstName + ' ' + d.lastName));
  var body = [
    'Name: ' + d.firstName + ' ' + (d.lastName || ''),
    'Email: ' + d.email,
    'Phone: ' + d.phone,
    'Business: ' + (d.businessName || '—') + ' (' + (d.industry || '—') + ')',
    done ? 'Estimated value: ' + money_(d.valueLow) + ' – ' + money_(d.valueHigh) : '',
    done ? "Owner's proceeds: " + money_(d.ownerProceeds) : '',
    done ? 'Exit timing: ' + (d.exitTiming || '—') + ' | Exit type: ' + (d.exitType || '—') : '',
    done && d.goalGap !== '' ? 'Goal gap/surplus: ' + money_(d.goalGap) : '',
    'Source: ' + (d.utm_source || 'direct') + (d.utm_campaign ? ' / ' + d.utm_campaign : ''),
    '',
    'Full details are in the Leads sheet: ' + SpreadsheetApp.getActiveSpreadsheet().getUrl()
  ].filter(function (l) { return l !== ''; }).join('\n');
  MailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

// Run this once from the editor to check the sheet and email work.
function testLead() {
  doPost({ postData: { contents: JSON.stringify({
    leadId: 'TEST-' + Date.now(), stage: 'completed', firstName: 'Test', lastName: 'Lead',
    email: 'test@example.com', phone: '555-0100', businessName: 'Test Co', industry: 'HVAC',
    valueLow: 1000000, valueMid: 1200000, valueHigh: 1400000, ownerProceeds: 1100000
  }) } });
}
