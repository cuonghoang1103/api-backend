/** auth-lab-9 — Chapter 9 · Lab 9 "LabFlow's one authorization gate" (04/11/2026). Slug auth-9-7-lab-can. */
import { lamDeck, js, sh, two, box } from './_auth-chung.mjs';
import { OUT, CODE } from '../../content/courses/authentication/s09/_ma.mjs';
const clip = (s, n = 58) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const body = (k) => clip(OUT[k].split('\n').slice(1).join('\n'));
const GR = CODE.grader9.split('\n');
const GR_T3 = clip(GR.slice(GR.findIndex((l) => l.includes('T3 the tenant boundary')), GR.findIndex((l) => l.includes('T4 ABAC'))).join('\n').trim(), 60);
export const deck = { key: 'auth-lab-9', code: 'AUTH Lab 9', title: "LabFlow's one authorization gate", sub: 'Machine-graded: four models in one order, pass 7/10' };
export const slides = lamDeck({ chuong: 'Chapter 9 — Authorization models', bai: 'Lab 9' }, [
  { cover: true, t: "Lab 9 — LabFlow's one<br>authorization gate", sub: 'Chapter 9 · 30–60 min — RBAC, ABAC, ReBAC and the tenant boundary, as one function' },
  { t: 'What you build', to: true, giua: true, body: `<ul>
    <li><b>can(user, action, resource)</b> ⇒ boolean — the one gate</li>
    <li>Order: tenant first → RBAC → ABAC ownership → ReBAC dept head</li>
    <li>Any grant after the tenant check is a yes; nothing matching is deny by default</li>
    <li>A null user or resource ⇒ a safe false, never a crash</li>
    <li>Work only in lab9/my/index.js; do NOT import src/authz/policy.js</li></ul>` },
  { t: 'Setup', giua: true, body: sh('cp -r lab9/starter lab9/my\nnode scripts/cham-lab-9.mjs lab9/my', { title: 'pure — no database, no network', sm: true }) +
      box('Grade the empty starter', body('lab-bat-dau').split('\n').slice(-1).join('\n'), 'lam') +
      box('The rules', 'export can and ROLE_GRANTS; the reference policy.js is the answer — do not import it.', 'xanh') },
  { t: 'How it is graded: 6 checks, 10 pts, pass 7', giua: true, body: `<table class="t"><tr><th>Check</th><th>Pts</th></tr>
    <tr><td>T1 RBAC — a role grants a fixed set</td><td>2</td></tr>
    <tr><td>T2 ADMIN blanket within its tenant</td><td>1.5</td></tr>
    <tr><td>T3 the tenant boundary comes first</td><td>2</td></tr>
    <tr><td>T4 ABAC — cancel your OWN booking</td><td>1.5</td></tr>
    <tr><td>T5 ReBAC — dept head in THEIR dept</td><td>1.5</td></tr>
    <tr><td>T6 deny by default; null-safe</td><td>1.5</td></tr></table>` +
      box('The two heaviest', 'RBAC and the tenant boundary — the order of those two is the whole lesson.', 'lam') },
  { t: 'The check most attempts get wrong: T3', body: js(GR_T3, { sm: true }) +
      two(box('Tenant before role', 'a cross-tenant admin must be denied BEFORE \'*\' is even considered — the order is the point.', 'xanh'),
          box('Even a valid session', 'from another tenant is a deny — the wall sits above every grant, admin included.', 'lam')) +
      box('Worth 2 of the 10 points', 'tied with RBAC for the heaviest check, because a wrong order here is the multi-tenant data leak from 9.4.', 'do2') },
  { t: 'A first attempt that passes the single-tenant demo', body: sh(body('lab-yeu').split('\n').slice(-1).join('\n'), { title: 'node scripts/cham-lab-9.mjs lab9/yeu', sm: true }) +
      two(box('6.5/10 — looks perfect, one tenant', 'checks the role first, the tenant never.', 'do2'),
          box('Broken where it costs most', 'T3: an FPT-HN admin reaches an FPT-HCM booking. T5: no ReBAC — a head cannot cancel in their own dept.', 'do2')) +
      box('The bug is the ORDER', 'not a crash, not a failed happy path — invisible until a second tenant exists.', 'lam') },
  { t: 'The reference', body: sh(body('lab-tham-khao').split('\n').slice(-1).join('\n') + '\n' + body('lab-npm-test').split('\n').slice(-3).join('\n'), { title: 'src/authz/policy.js + npm test', sm: true }) +
      two(box('10/10, 48 tests green', 'the reference is the real gate, shown line by line in lessons 9.2–9.5 — the same code the app ships.', 'xanh'),
          box('Pure and testable', 'one function, one test file — and that test file is the specification of who may do what.', 'lam')) +
      box('Do not peek until you have tried', 'the whole value is in getting the ORDER right yourself; grade your own attempt first, read the reference second.', 'lam') },
  { t: 'Done when', to: true, giua: true, body: `<ul>
    <li>≥ 7/10 twice in a row (aim for 10)</li>
    <li>a cross-tenant admin is denied</li>
    <li>a dept head cancels only in their own department</li>
    <li>an unknown action and a null user are both a safe false</li>
    <li>you can explain why the tenant check comes before the role</li>
    <li>Next — 9.6: the chapter check</li></ul>` },
]);
