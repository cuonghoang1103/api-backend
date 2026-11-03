// src/ops/audit.js — Chapter 11 = Lab 11 reference: turn a raw event into an audit-log entry that is SAFE to write.
// An audit log is the record you reach for after an incident, so two rules fight each other: write ENOUGH to
// reconstruct what happened (who, what, when, where, outcome), and write NOTHING that is itself a secret — a logged
// token or password is a second breach waiting in your log store. safeAudit() keeps the safe fields, strips every
// sensitive one (by name AND by value), and tags a severity the runbook (src/ops/triage.js) acts on.

// Field names whose VALUES must never reach the log, however they are spelled.
const SENSITIVE = new Set(['password', 'newpassword', 'oldpassword', 'token', 'accesstoken', 'refreshtoken',
  'cookie', 'authorization', 'secret', 'otp', 'totp', 'recoverycode', 'sessionid', 'apikey']);
// The fields that are safe — and necessary — to keep.
const KEEP = ['ts', 'actor', 'action', 'outcome', 'ip', 'requestId', 'userAgent'];
// How loud each event is. Anything unlisted is 'info' (deny-by-default toward quiet, but never dropped).
const SEVERITY = {
  refresh_reuse_detected: 'alert',   // a stolen refresh token was replayed (Chapter 5) — page someone
  mfa_disabled: 'alert',             // a second factor was turned off — often the first step of a takeover
  password_reset: 'warn',
  email_changed: 'warn',
  admin_action: 'warn',
  login_failed: 'info',
  login_ok: 'info',
  logout: 'info',
};

const isSensitiveKey = (k) => SENSITIVE.has(String(k).toLowerCase().replace(/[_-]/g, ''));

/** ⇒ a log-safe audit entry: safe fields kept, sensitive fields dropped, a severity tag added. */
export function safeAudit(event) {
  const e = event || {};
  const out = {};
  for (const k of KEEP) if (e[k] !== undefined) out[k] = e[k];
  // Any EXTRA field the caller passed: keep it only if its name is not sensitive; otherwise drop it entirely.
  for (const [k, v] of Object.entries(e)) {
    if (KEEP.includes(k) || isSensitiveKey(k)) continue;        // sensitive ⇒ never copied (not even redacted-in-place)
    if (v && typeof v === 'object') continue;                   // no nested objects — they can hide a secret
    out[k] = v;
  }
  out.severity = SEVERITY[e.action] ?? 'info';
  return out;
}
