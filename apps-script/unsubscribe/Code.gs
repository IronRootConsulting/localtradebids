/**
 * LocalTradeBids: one-click unsubscribe endpoint (Google Apps Script web app).
 *
 * Owner/runner: Bede (deployed in Andrew's Google account; see DEPLOY.md).
 * Contract: /workspace/vincent/ltb-unsub-contract.md (Vincent).
 *
 * NO SECRETS IN THIS FILE. The HMAC key(s) live only in Script Properties:
 *   UNSUB_HMAC_K1   base64 of 32 random bytes (key id "k1"; add K2 to rotate)
 *   LEDGER_TAB      optional; default "unsubscribes"
 * The script is BOUND to Bede's ledger spreadsheet (scope spreadsheets.currentonly),
 * so it can touch only that one file.
 *
 * Requests
 *   POST .../exec?t=<token>   body "List-Unsubscribe=One-Click"  (RFC 8058, mailbox provider)
 *   POST .../exec             body "t=<token>&src=landing"        (localtradebids.com/unsubscribe/)
 *   GET  .../exec?t=<token>   NEVER unsubscribes (link scanners prefetch); shows a link to
 *                             the confirm page on localtradebids.com.
 *   GET  .../exec?health=1    {"ok":true,"service":"ltb-unsub","version":...}
 *
 * Apps Script web apps always answer HTTP 200 (and POSTs answer through a 302 to
 * script.googleusercontent.com); the outcome is in the JSON body.
 */

var UNSUB_VERSION = "1.0.0";
var SITE_UNSUB_PAGE = "https://localtradebids.com/unsubscribe/";
var ALLOWED_LISTS = ["sample"]; // extend only by contract change (e.g. "marketing", "reminder")
var MIN_VALID_SECONDS = 30 * 24 * 3600; // legal floor: honored >= 30 days after issue, whatever e says
var MAX_FUTURE_SKEW_SECONDS = 24 * 3600;
var MAX_TOKEN_LENGTH = 1024;
var LEDGER_HEADERS = [
  "received_at_utc", "received_at_et", "list", "email_hash", "method",
  "token_iat", "token_exp", "key_id", "token_sha256", "endpoint_version",
];

// ---------- pure helpers (no Apps Script services except Utilities) ----------

function b64urlToBytes_(s) {
  var pad = s.length % 4 === 0 ? "" : new Array(5 - (s.length % 4)).join("=");
  return Utilities.base64DecodeWebSafe(s + pad);
}

function bytesToB64url_(bytes) {
  return Utilities.base64EncodeWebSafe(bytes).replace(/=+$/, "");
}

function constantTimeEqual_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Verify a token. Returns {ok:true, claims} or {ok:false, status}.
 * keys: {"k1": <byte[] key>, ...}; nowSec: unix seconds.
 */
function verifyToken_(token, keys, nowSec) {
  if (typeof token !== "string" || token.length === 0 || token.length > MAX_TOKEN_LENGTH) {
    return { ok: false, status: "invalid_token" };
  }
  var parts = token.split(".");
  if (parts.length !== 3 || parts[0] !== "v1" || !/^[A-Za-z0-9_-]+$/.test(parts[1]) || !/^[A-Za-z0-9_-]+$/.test(parts[2])) {
    return { ok: false, status: "invalid_token" };
  }
  var claims;
  try {
    claims = JSON.parse(Utilities.newBlob(b64urlToBytes_(parts[1])).getDataAsString("UTF-8"));
  } catch (err) {
    return { ok: false, status: "invalid_token" };
  }
  if (!claims || typeof claims !== "object") return { ok: false, status: "invalid_token" };
  var key = typeof claims.k === "string" ? keys[claims.k] : null;
  if (!key) return { ok: false, status: "invalid_token" };
  var expected = bytesToB64url_(
    Utilities.computeHmacSha256Signature(Utilities.newBlob("v1." + parts[1]).getBytes(), key)
  );
  if (!constantTimeEqual_(expected, parts[2])) return { ok: false, status: "invalid_token" };
  if (ALLOWED_LISTS.indexOf(claims.l) < 0) return { ok: false, status: "invalid_token" };
  if (typeof claims.h !== "string" || !/^[0-9a-f]{64}$/.test(claims.h)) return { ok: false, status: "invalid_token" };
  if (typeof claims.i !== "number" || typeof claims.e !== "number" || claims.i % 1 !== 0 || claims.e % 1 !== 0) {
    return { ok: false, status: "invalid_token" };
  }
  if (claims.i > nowSec + MAX_FUTURE_SKEW_SECONDS) return { ok: false, status: "invalid_token" };
  var validUntil = Math.max(claims.e, claims.i + MIN_VALID_SECONDS);
  if (nowSec > validUntil) return { ok: false, status: "expired" };
  return { ok: true, claims: claims };
}

function sha256Hex_(s) {
  var bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, s, Utilities.Charset.UTF_8);
  var out = "";
  for (var i = 0; i < bytes.length; i++) {
    var b = (bytes[i] + 256) % 256;
    out += (b < 16 ? "0" : "") + b.toString(16);
  }
  return out;
}

/** Which kind of POST this is. RFC 8058 body is exactly List-Unsubscribe=One-Click. */
function postMethod_(params) {
  if (params["List-Unsubscribe"] === "One-Click") return "one_click_post";
  if (params.src === "landing") return "landing_post";
  return "post_other";
}

// ---------- Apps Script services ----------

function loadKeys_() {
  var props = PropertiesService.getScriptProperties().getProperties();
  var keys = {};
  Object.keys(props).forEach(function (name) {
    var m = /^UNSUB_HMAC_(K\d+)$/.exec(name);
    if (m && props[name]) keys[m[1].toLowerCase()] = Utilities.base64Decode(props[name]);
  });
  return keys;
}

function ledgerSheet_() {
  var props = PropertiesService.getScriptProperties();
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var tabName = props.getProperty("LEDGER_TAB") || "unsubscribes";
  var sh = ss.getSheetByName(tabName);
  if (!sh) {
    sh = ss.insertSheet(tabName);
    sh.appendRow(LEDGER_HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

/** Idempotent: one row per (list, email_hash). Returns "unsubscribed" or "already_unsubscribed". */
function recordUnsubscribe_(sheet, claims, method, token, now) {
  var lastRow = sheet.getLastRow();
  if (lastRow >= 2) {
    var rows = sheet.getRange(2, 3, lastRow - 1, 2).getValues(); // list, email_hash
    for (var r = 0; r < rows.length; r++) {
      if (rows[r][0] === claims.l && rows[r][1] === claims.h) return "already_unsubscribed";
    }
  }
  sheet.appendRow([
    now.toISOString(),
    Utilities.formatDate(now, "America/New_York", "yyyy-MM-dd HH:mm:ss z"),
    claims.l, claims.h, method, claims.i, claims.e, claims.k, sha256Hex_(token), UNSUB_VERSION,
  ]);
  return "unsubscribed";
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function handlePost_(e, deps) {
  var params = (e && e.parameter) || {};
  var token = params.t;
  var now = deps.now();
  var v = verifyToken_(token, deps.keys(), Math.floor(now.getTime() / 1000));
  if (!v.ok) return { ok: false, status: v.status };
  var lock = deps.lock();
  if (!lock.tryLock(20000)) return { ok: false, status: "server_busy" };
  try {
    var status = recordUnsubscribe_(deps.sheet(), v.claims, postMethod_(params), token, now);
    return { ok: true, status: status, list: v.claims.l };
  } finally {
    lock.releaseLock();
  }
}

function liveDeps_() {
  return {
    now: function () { return new Date(); },
    keys: loadKeys_,
    sheet: ledgerSheet_,
    lock: function () { return LockService.getScriptLock(); },
  };
}

function doPost(e) {
  try {
    return json_(handlePost_(e, liveDeps_()));
  } catch (err) {
    console.error("ltb-unsub doPost error: " + (err && err.message));
    return json_({ ok: false, status: "server_error" });
  }
}

function landingLinkHtml_(token) {
  var safe = /^[A-Za-z0-9._-]{1,1024}$/.test(token || "") ? token : "";
  var href = SITE_UNSUB_PAGE + (safe ? "?t=" + safe : "");
  return (
    '<!doctype html><meta name="robots" content="noindex"><meta name="referrer" content="no-referrer">' +
    '<p style="font:16px system-ui,sans-serif">To unsubscribe, continue to ' +
    '<a target="_top" rel="noreferrer" href="' + href + '">localtradebids.com</a> and confirm.</p>'
  );
}

function doGet(e) {
  var params = (e && e.parameter) || {};
  if (params.health) return json_({ ok: true, service: "ltb-unsub", version: UNSUB_VERSION });
  // Never unsubscribes on GET.
  return HtmlService.createHtmlOutput(landingLinkHtml_(params.t)).setTitle("Unsubscribe | LocalTradeBids");
}
