/** auth-lab-11 — Chapter 11 · Lab 11 "The audit log and the runbook" (04/11/2026). Slug auth-11-7-lab-audit-runbook. */
import { lamDeck, js, sh, two, box } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s11/_ma.mjs';
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const GR = CODE.grader11.split('\n');
const GR_T2 = clip(GR.slice(GR.findIndex((l) => l.includes('T2 safeAudit never writes a token')), GR.findIndex((l) => l.includes('T3 safeAudit'))).join('\n').trim(), 60);
export const deck = { key: 'auth-lab-11', code: 'AUTH Lab 11', title: 'The audit log and the runbook', sub: 'Machine-graded: keep enough, leak nothing, page rarely' };
export const slides = lamDeck({ chuong: 'Chapter 11 — Running it', bai: 'Lab 11' }, [
  { cover: true, t: 'Lab 11 — the audit log<br>and the runbook', sub: 'Chapter 11 · 30–60 min — two pure functions that run the service' },
  { t: 'What you build', to: true, giua: true, body: `<ul>
    <li><b>safeAudit(event)</b> — the log entry: keep enough, leak nothing, tag a severity</li>
    <li><b>triage(signal)</b> — the runbook: page / investigate / auto / ignore</li>
    <li>Keep ts, actor, action, outcome, ip, requestId, userAgent</li>
    <li>Drop every secret (by name and value) and every nested object</li>
    <li>Work only in lab11/my/index.js; do NOT import src/ops</li></ul>` },
  { t: 'Setup', giua: true, body: sh('cp -r lab11/starter lab11/my\nnode scripts/cham-lab-11.mjs lab11/my', { title: 'pure — no database, no network', sm: true }) +
      box('Grade the empty starter', body('lab-bat-dau').split('\n').slice(-1).join('\n'), 'lam') +
      box('The rules', 'export safeAudit and triage; the src/ops files are the answers — do not import them.', 'xanh') },
  { t: 'How it is graded: 6 checks, 10 pts, pass 7', giua: true, body: `<table class="t"><tr><th>Check</th><th>Pts</th></tr>
    <tr><td>T1 keep the safe, necessary fields</td><td>2</td></tr>
    <tr><td>T2 never write a token value</td><td>2</td></tr>
    <tr><td>T3 never write a password (any spelling)</td><td>1.5</td></tr>
    <tr><td>T4 drop nested objects</td><td>1</td></tr>
    <tr><td>T5 tag severity by event type</td><td>1.5</td></tr>
    <tr><td>T6 triage routes every signal, incl. the unknown</td><td>2</td></tr></table>` +
      box('The two heaviest', 'keep the fields, and never write a token — the two that make the audit log both useful and safe.', 'lam') },
  { t: 'The critical check: T2', body: js(GR_T2, { sm: true }) +
      two(box('A token value must never survive', 'drop it by name AND check no secret substring remains anywhere in the entry.', 'xanh'),
          box('Including the nested one', 'a secret can hide inside an object under an innocent key — refuse nested objects.', 'lam')) },
  { t: 'A first attempt that "logs everything"', body: sh(body('lab-yeu').split('\n').slice(-1).join('\n'), { title: 'node scripts/cham-lab-11.mjs lab11/yeu', sm: true }) +
      two(box('2/10 — a double failure', 'it logs the whole event, so a token and a plaintext password sit in the log store forever, and it pages on every single signal.', 'do2'),
          box('"Thorough" is not "safe"', 'paging on everything trains the on-call to tune out the pager — the 10.4 fatigue attack, aimed at your own team.', 'do2')) +
      box('It passes only T1', 'it keeps the safe fields too, which is why it scores 2 and not 0 — the right fields are there, buried among the secrets.', 'lam') },
  { t: 'The reference', body: sh(body('lab-tham-khao').split('\n').slice(-1).join('\n') + '\n' + body('lab-npm-test').split('\n').slice(-3).join('\n'), { title: 'src/ops/audit.js + triage.js + npm test', sm: true }) +
      two(box('10/10, 54 tests green', 'an allow-list that strips by name and value, a severity map, a runbook that pages rarely.', 'xanh'),
          box('Both halves of running it', 'the audit log (what to write) and the runbook (what to do) — shown in 11.4 and 11.5.', 'lam')) },
  { t: 'Done when', to: true, giua: true, body: `<ul>
    <li>≥ 7/10 twice in a row (aim for 10)</li>
    <li>no token, password or nested secret survives safeAudit</li>
    <li>severity is right per event type</li>
    <li>triage pages only for page-worthy signals; the unknown ⇒ investigate</li>
    <li>Next — 11.6: the chapter check</li></ul>` },
]);
