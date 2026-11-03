/**
 * auth-lab-6 — Authentication · Chapter 6 · Lab 6 "LabFlow ID's account-lifecycle layer" (04/11/2026).
 * Slug bài: auth-6-7-lab-vong-doi. Output = s06/_ma.mjs (LabFlow ID v0.6 + PostgreSQL 17.11, Node 22.23.3, env -i).
 */
import { lamDeck, js, sh, two, box, cards, c } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s06/_ma.mjs';

export const deck = { key: 'auth-lab-6', code: 'AUTH Lab 6', title: "LabFlow ID's account-lifecycle layer", sub: 'Machine-graded: one-time tokens and an enumeration-safe reset' };
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const GR_T5 = `await check('T5 reset mails a real account and NOTHING
  to a non-existent one', 2, async () => {
  const sent = []
  const users = usersWith([{ id, email: 'an@x',
                             status: 'active' }])
  await life.requestPasswordReset(users, 'an@x',
                  { send: m => sent.push(m), sync: true })
  await life.requestPasswordReset(users, 'nobody@x',
                  { send: m => sent.push(m), sync: true })
  expect(sent.length === 1)   // only the real account
  expect(sent[0].to === 'an@x')
})`;

export const slides = lamDeck({ chuong: 'Chapter 6 — The account lifecycle', bai: 'Lab 6' }, [
  { cover: true, t: "Lab 6 — LabFlow ID’s<br>account-lifecycle layer", sub: 'Chapter 6 · 60–90 min — issue a one-time token, consume it once, reset without enumeration' },
  { t: 'What you build', to: true, giua: true, body: `<ul>
    <li><b>lifecycle(config)</b> ⇒ issueToken, consumeToken, requestPasswordReset</li>
    <li>A grader passes an in-memory store and a fake clock — no database</li>
    <li>issueToken: random token, store only its digest, purpose + expiry</li>
    <li>consumeToken: single-use, purpose-bound, time-limited</li>
    <li>requestPasswordReset: mail a real account, <b>nothing</b> to a stranger</li></ul>` },
  { t: 'Setup', giua: true, body: sh('cp -r lab6/starter lab6/my\nnode scripts/cham-lab-6.mjs lab6/my', { title: 'in-memory store + fake clock — no database', sm: true }) +
      box('Grade the empty starter', body('lab-bat-dau').split('\n').slice(-2).join('\n'), 'lam') +
      box('Keep the shape', 'Work only in lab6/my/index.js; keep ' + c('export function lifecycle(config)') + ' returning issueToken, consumeToken, requestPasswordReset. Do not import src/lifecycle/layer.js — that is the answer.', 'xanh') },
  { t: 'How it is graded: 6 checks, 10 pts, pass 7', giua: true, body: `<table class="t"><tr><th>Check</th><th>Pts</th></tr>
    <tr><td>T1 issue + consume round trip</td><td>1.5</td></tr>
    <tr><td>T2 single-use: second consume is USED</td><td>2</td></tr>
    <tr><td>T3 purpose-bound: reset token ≠ verify</td><td>1.5</td></tr>
    <tr><td>T4 expiry: 15 min reset, 30 min verify</td><td>1.5</td></tr>
    <tr><td>T5 reset mails a real account, nothing to a stranger</td><td>2</td></tr>
    <tr><td>T6 deleted account not mailed; bad token no crash</td><td>1.5</td></tr></table>` },
  { t: 'The heart of the chapter: T5', body: js(GR_T5, { sm: true }) +
      box('Silence is the defence', 'A "no account" email to a stranger enumerates your users (6.4). The non-existent branch must do nothing.', 'xanh') },
  { t: 'A first attempt that "works"', body: sh(body('lab-yeu'), { title: 'node scripts/cham-lab-6.mjs lab6/yeu', sm: true }) +
      box('3/10 — each miss is an attack', 'No usedAt (T2 replay), no purpose check (T3), and it emails "no account found" to a stranger (T5/T6).', 'do2') },
  { t: 'The reference', body: sh(body('lab-tham-khao').split('\n').slice(-1).join('\n') + '\n' + body('lab-npm-test').split('\n').slice(-3).join('\n'), { title: 'src/lifecycle/layer.js + npm test', sm: true }) +
      box('10/10, and 39 tests green', 'The reference is the real layer, shown line by line in lessons 6.2, 6.3 and 6.4 — the same code that runs every account action in LabFlow ID.', 'xanh') +
      box('Why a grader, not a demo', 'Each failing check names a concrete attack — a replayed token, a reset link that works twice, a "no account" email that enumerates your users. Passing means you closed them, not that the happy path ran.', 'lam') },
  { t: 'Hints (light → strong)', to: true, giua: true, body: `<ol>
    <li>Each check names its lesson; rerun that demo (scanner.sh, reset.sh, enum-timing.mjs)</li>
    <li>consumeToken: fetch by digest; reject missing or wrong purpose; then usedAt, then expiresAt; only then markUsed</li>
    <li>requestPasswordReset: in the no-account branch, do nothing at all — no email, no row</li>
    <li>Fire the insert + send off the response path unless sync — so a real account is not slower (6.4)</li></ol>` },
  { t: 'Done when', to: true, giua: true, body: `<ul>
    <li>Your layer scores ≥ 7/10 twice in a row (aim for 10)</li>
    <li>A token works once; a verify token cannot reset; a stranger’s reset sends no mail</li>
    <li>npm test still passes (39 green)</li>
    <li>You can name the attack behind every failed check</li>
    <li>Next — 6.6: the Chapter 6 check</li></ul>` },
]);
