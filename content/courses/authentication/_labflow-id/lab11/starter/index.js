// lab11/starter/index.js — Lab 11 starter. Write the audit-log entry (what to write, what NEVER to) + the runbook.
//
// safeAudit(event) ⇒ a log-safe entry. KEEP ts, actor, action, outcome, ip, requestId, userAgent. DROP every sensitive
// field entirely (never even redacted-in-place): password, token, cookie, authorization, secret, otp, recoveryCode,
// sessionId, apiKey (any case / underscores / dashes). Drop nested objects (they can hide a secret). Add a severity:
// refresh_reuse_detected / mfa_disabled ⇒ 'alert'; password_reset / email_changed / admin_action ⇒ 'warn';
// everything else ⇒ 'info'.
//
// triage(signal) ⇒ 'page' | 'investigate' | 'auto' | 'ignore'. refresh_reuse_spike / error_5xx_spike ⇒ 'page';
// failed_login_burst / admin_action ⇒ 'auto'; new_country_logins / breached_pw_rate ⇒ 'investigate'; no name ⇒ 'ignore';
// unknown name ⇒ 'investigate' (never silently ignore an unknown signal).
export function safeAudit(event) {
  // Write your solution here
  return event;
}
export function triage(signal) {
  // Write your solution here
  return 'ignore';
}
