/** auth-lab-10 — Chapter 10 · Lab 10 "Defend credential stuffing without locking real users" (04/11/2026). Slug auth-10-7-lab-chong-nhoi. */
import { lamDeck, js, sh, two, box } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s10/_ma.mjs';
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const GR = CODE.grader10.split('\n');
const GR_T4 = clip(GR.slice(GR.findIndex((l) => l.includes('T4 a real user who mistypes')), GR.findIndex((l) => l.includes('T5 a clean login'))).join('\n').trim(), 60);
export const deck = { key: 'auth-lab-10', code: 'AUTH Lab 10', title: 'Defend credential stuffing without locking real users', sub: 'Machine-graded: allow / challenge / block, pass 7/10' };
export const slides = lamDeck({ chuong: 'Chapter 10 — The attacks, in order of frequency', bai: 'Lab 10' }, [
  { cover: true, t: 'Lab 10 — defend credential stuffing<br>without locking real users', sub: 'Chapter 10 · 30–60 min — allow / challenge / block, and never a DoS' },
  { t: 'What you build', to: true, giua: true, body: `<ul>
    <li><b>decide(signal)</b> ⇒ 'allow' | 'challenge' | 'block'</li>
    <li>signal = { accountFails, ipFails, ipAccounts, breached, solvedChallenge }</li>
    <li>Block the flooding/spraying IP (survives a solved challenge)</li>
    <li>Challenge the breached and the suspicious — NEVER block a single account</li>
    <li>Work only in lab10/my/index.js; do NOT import src/defense/stuffing.js</li></ul>` },
  { t: 'Setup', giua: true, body: sh('cp -r lab10/starter lab10/my\nnode scripts/cham-lab-10.mjs lab10/my', { title: 'pure — no database, no network', sm: true }) +
      box('Grade the empty starter', body('lab-bat-dau').split('\n').slice(-1).join('\n'), 'lam') +
      box('The rules', 'work only in lab10/my/index.js; export decide. src/defense/stuffing.js is the answer — do not import it.', 'xanh') +
      box('The whole difficulty is the second half', 'stopping the attack is easy; stopping it WITHOUT locking the real users the attacker sprays through is the lab.', 'do2') },
  { t: 'How it is graded: 6 checks, 10 pts, pass 7', giua: true, body: `<table class="t"><tr><th>Check</th><th>Pts</th></tr>
    <tr><td>T1 a flooding IP is blocked</td><td>2</td></tr>
    <tr><td>T2 a spraying IP (many accounts) is blocked</td><td>2</td></tr>
    <tr><td>T3 a breached password is challenged</td><td>1.5</td></tr>
    <tr><td>T4 a mistyping real user is challenged, NEVER blocked</td><td>2</td></tr>
    <tr><td>T5 a clean login is allowed</td><td>1</td></tr>
    <tr><td>T6 a solved challenge clears soft signals, not the flood</td><td>1.5</td></tr></table>` +
      box('The two heaviest', 'the IP blocks and "never lock the account" — the DoS the lab exists to prevent.', 'lam') },
  { t: 'The one rule that matters most: T4', body: js(GR_T4, { sm: true }) +
      two(box('Never block on accountFails alone', 'the account\'s "attacker" might be its real owner mistyping their own password.', 'xanh'),
          box('The hard block is for the IP', 'a single account is challenged, never locked — locking it IS the attacker\'s denial-of-service.', 'lam')) +
      box('Worth 2 of the 10 points', 'tied with the IP blocks for the heaviest check — it is the exact bug the lab exists to catch.', 'do2') },
  { t: 'A first attempt that "stops the attack"', body: sh(body('lab-yeu').split('\n').slice(-1).join('\n'), { title: 'node scripts/cham-lab-10.mjs lab10/yeu', sm: true }) +
      two(box('3/10 — locks the account after 5 fails', 'the naive lockout: the attacker locks every real user on purpose — the DoS the lab exists to prevent.', 'do2'),
          box('No spread signal, ignores solvedChallenge', 'an IP touching thousands of accounts is not blocked, and a real user cannot clear a soft signal. Passes only T1 and T5.', 'do2')) +
      box('"It stops the attack" is not "it is correct"', 'blocking the obvious case while locking the real owner is the whole trap.', 'lam') },
  { t: 'The reference', body: sh(body('lab-tham-khao').split('\n').slice(-1).join('\n') + '\n' + body('lab-npm-test').split('\n').slice(-3).join('\n'), { title: 'src/defense/stuffing.js + npm test', sm: true }) +
      two(box('10/10, 49 tests green', 'the reference is the real defence, src/defense/stuffing.js, shown line by line in lesson 10.1.', 'xanh'),
          box('Measured: 0 attacker logins, 0 real locked', 'on the 10k-spray run behind the lab — the property the grader checks, proven end to end.', 'lam')) +
      box('Grade your own attempt first', 'the value is in getting the order right yourself — read the reference second.', 'lam') },
  { t: 'Done when', to: true, giua: true, body: `<ul>
    <li>≥ 7/10 twice in a row (aim for 10)</li>
    <li>a flooding and a spraying IP both block</li>
    <li>a breached password is challenged</li>
    <li>a mistyping real user is challenged, NEVER blocked</li>
    <li>a solved challenge clears soft signals but not the hard flood</li>
    <li>Next — 10.6: the chapter check</li></ul>` },
]);
