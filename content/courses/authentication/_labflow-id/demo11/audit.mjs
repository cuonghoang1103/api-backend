// demo11/audit.mjs — the audit log: write enough, leak nothing (Chapter 11, 11.4).
import { safeAudit } from '../src/ops/audit.js';

// A raw event as the request handler sees it — full of things you must NOT write to a log.
const raw = { ts: 1700000000, actor: 'usr_1', action: 'password_reset', outcome: 'ok', ip: '203.0.113.5',
  requestId: 'req-42', token: 'reset-tok-9f3c-SECRET', newPassword: 'hunter2-PLAINTEXT', cookie: '__Host-lfid_ses=SECRET',
  extra: { apiKey: 'sk-NESTED-SECRET' } };

console.log('The naive "log the whole event for completeness":');
console.log('  ' + JSON.stringify(raw).slice(0, 118) + '…');
console.log('  ↳ a reset token, a plaintext password and a session cookie now live in your log store forever.\n');

console.log('safeAudit(event) — keep what reconstructs the incident, drop every secret:');
console.log('  ' + JSON.stringify(safeAudit(raw)));
const leaks = ['SECRET', 'PLAINTEXT'].filter((s) => JSON.stringify(safeAudit(raw)).includes(s));
console.log(`  ↳ secret substrings remaining in the entry: ${leaks.length === 0 ? 'none' : leaks.join(', ')}\n`);

console.log('⇒ Write who/what/when/where/outcome and a severity; NEVER a token, password, cookie, OTP or recovery code,');
console.log('  not even nested. The audit log is read after a breach — it must not be able to CAUSE the next one.');
