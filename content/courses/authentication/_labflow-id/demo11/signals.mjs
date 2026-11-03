// demo11/signals.mjs — six signals, and the runbook for each (Chapter 11, 11.5).
import { triage } from '../src/ops/triage.js';

const signals = [
  ['refresh_reuse_spike', 'stolen refresh tokens being replayed (Chapter 5) — an active session-theft campaign'],
  ['error_5xx_spike',     'the service itself is failing — logins are down'],
  ['new_country_logins',  'logins from a new country — travel, or the start of a takeover'],
  ['breached_pw_rate',    'users submitting known-breached passwords — a stuffing tell (Chapter 10)'],
  ['failed_login_burst',  'a burst of failed logins — the stuffing defence already throttled it'],
  ['admin_action',        'an administrator changed something — expected, recorded, reviewed'],
];
const ACT = { page: 'PAGE on-call', investigate: 'investigate now (no page)', auto: 'already handled — record', ignore: 'ignore' };

console.log('Six signals LabFlow watches, and the runbook action for each:\n');
for (const [name, why] of signals) console.log(`  ${name.padEnd(20)} → ${ACT[triage({ name })].padEnd(26)} (${why})`);

console.log('\n⇒ The runbook turns a signal into a DECISION written down in advance: page only for what needs a human now');
console.log('  (active theft, service down); investigate the ambiguous; let the automated defences record the rest.');
console.log('  Paging on everything (the "yeu" runbook) trains the on-call to ignore the page — the 10.4 problem, inside the team.');
