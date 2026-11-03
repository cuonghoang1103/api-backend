// lab11/yeu/index.js — an audit function that "logs everything for completeness" — which is exactly how a token and a
// password end up sitting in the log store forever. And a runbook that pages on everything, so the on-call ignores it.
export function safeAudit(event) {
  return { ...event, severity: 'info' };     // ❌ copies token/password straight into the log; severity always info
}
export function triage(signal) {
  return 'page';                             // ❌ pages on every signal — alert fatigue, the 10.4 problem for on-call
}
