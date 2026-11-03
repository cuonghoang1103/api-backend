// src/ops/triage.js — Chapter 11 (11.5): the runbook as a function. A monitoring SIGNAL fires; triage() says what to
// DO about it, so the on-call response is written down and testable, not improvised at 3am. Six signals the platform
// watches, mapped to one of four actions: page (wake someone), investigate (look now, no page), auto (the system
// already responded, just record), ignore (expected noise).
const RUNBOOK = {
  refresh_reuse_spike: 'page',       // many stolen-token replays — an active session-theft campaign
  failed_login_burst:  'auto',       // the stuffing defence (Chapter 10) already throttles; record, do not page
  new_country_logins:  'investigate',// could be travel or takeover — look, do not wake anyone yet
  error_5xx_spike:     'page',       // the service itself is failing — logins are down
  breached_pw_rate:    'investigate',// users trying known-breached passwords — a stuffing tell
  admin_action:        'auto',       // expected; recorded in the audit log, reviewed, not paged
};
/** ⇒ 'page' | 'investigate' | 'auto' | 'ignore'. Unknown signal ⇒ 'investigate' (never silently ignore). */
export function triage(signal) {
  const name = signal && signal.name;
  if (!name) return 'ignore';
  return RUNBOOK[name] ?? 'investigate';
}
