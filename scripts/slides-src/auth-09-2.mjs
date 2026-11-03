/** auth-09-2 — Chapter 9 · 9.2 "RBAC" (04/11/2026). Slug auth-9-2-rbac. Output = s09/_ma.mjs. */
import { lamDeck, js, sh, two, box, cards } from './_auth-chung.mjs';
import { CODE, OUT } from '../../content/courses/authentication/s09/_ma.mjs';
const clip = (s, n = 60) => s.split('\n').map((l) => (l.length > n ? l.slice(0, n) + '…' : l)).join('\n');
const P = CODE.policy.split('\n');
const GRANTS = clip(P.slice(P.findIndex((l) => l.includes('export const ROLE_GRANTS')), P.findIndex((l) => l.includes('ADMIN:')) + 1).join('\n') + '\n};', 62);
const RBAC_LINES = clip(OUT['91-authz-matrix'].split('\n').filter((l) => l.includes('RBAC')).join('\n'), 62);
const BAD = `if (req.user.role === 'ADMIN') { }   // bookings.js
if (user.role == 'admin') { }        // rooms.js — lowercase!
if (['ADMIN','DEPT_HEAD'].includes(u.role)) { } // wrong set`;
export const deck = { key: 'auth-09-2', code: 'AUTH 9.2', title: 'RBAC, and the boolean that becomes forty booleans', sub: 'Roles grant actions — in one table, or it rots' };
export const slides = lamDeck({ chuong: 'Chapter 9 — Authorization models', bai: '9.2' }, [
  { cover: true, t: 'RBAC, and the boolean that<br>becomes forty booleans', sub: 'Chapter 9 · Lesson 9.2 — roles grant actions, in one table' },
  { t: 'What you will take away', to: true, giua: true, body: `<ul>
    <li>RBAC: a user has a role, a role grants a fixed set of actions</li>
    <li>Keep the role-to-action map in ONE table — the single source of truth</li>
    <li>Name actions as verbs on resources (booking:create), not pages</li>
    <li>Scattered role-string checks rot: duplication, case drift, wrong sets</li>
    <li>ADMIN is a blanket — but only inside its tenant</li></ul>` },
  { t: 'The grant table — one source of truth', body: js(GRANTS) +
      box('Read this, do not grep', '"what may a TEACHER do?" is a lookup, not a search across the codebase. A new role is a row; a new action is an entry.', 'xanh') },
  { t: 'Actions are verbs on resources', giua: true, body: two(
      box('Not "the bookings page"', 'that ties authorization to the UI, and the API has no pages — a page is a client concept, not a permission.', 'do2'),
      box('Name the action', 'booking:create, room:manage — a verb on a noun. The thing DONE to a resource, independent of any screen.', 'xanh')) +
      box('One grant protects every client', 'the same booking:create rule guards the website, the mobile app and a raw script equally — because none of them is a "page".', 'lam') +
      box('It also reads as a sentence', '"a TEACHER may booking:create" — the grant table becomes a list of plain capabilities anyone on the team can review.', 'lam') },
  { t: 'The boolean that rots', body: js(BAD, { sm: true }) +
      box('By month six', 'forty copies; three say "admin" lowercase and never match; one route checks the wrong set. Nobody can list what an ADMIN may do.', 'do2') +
      box('The table replaces all of it', 'one lookup, and the gate is the only caller.', 'lam') },
  { t: 'ADMIN is a blanket — within a tenant', giua: true, body: box('ADMIN carries \'*\'', 'within its tenant it may do anything.', 'xanh') +
      box('But \'*\' is checked AFTER the tenant', 'so an admin of FPT HCM is not an admin of FPT HN (9.4).', 'lam') +
      box('"Super-admin everywhere"', 'is a separate, rarer role you grant on purpose — never the quiet default of ADMIN.', 'do2') },
  { t: 'RBAC in the matrix', body: sh(RBAC_LINES, { title: 'node demo9/authz-matrix.mjs — role-only rows', sm: true }) +
      box('A pure role lookup', 'a STUDENT may create a booking but not manage a room; a DEPT_HEAD may manage rooms. The answer depends only on the role.', 'lam') +
      box('No resource attributes yet', 'nothing here asks WHO owns the booking or WHICH department the room is in. Those questions — the ones a role cannot answer — are lesson 9.3.', 'xanh') },
  { t: 'Summary', to: true, giua: true, body: `<ul>
    <li>RBAC: a role grants a fixed set of actions; "may they?" is a lookup</li>
    <li>One table, actions as verbs on resources, the one gate as sole caller</li>
    <li>Scattered role === '…' checks rot — duplication, case, wrong sets, no audit</li>
    <li>ADMIN's '*' is a blanket, only inside its tenant</li>
    <li>Next — 9.3: what a role alone cannot express</li></ul>` },
]);
