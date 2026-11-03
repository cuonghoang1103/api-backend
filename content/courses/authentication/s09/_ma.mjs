/**
 * _ma.mjs (Chương 9) — SINH TỰ ĐỘNG bằng scripts/tst/sinh-ma.mjs từ dự án chạy thật. Đừng sửa tay.
 */
export const CODE = {
  policy: `// src/authz/policy.js — Chapter 9 = Lab 9 reference: ONE place that decides every authorization question for LabFlow.
// can(user, action, resource) combines four models, checked in an order that cannot leak across a tenant:
//   1. the TENANT boundary (multi-tenancy, 9.4) — a resource in another tenant is as if it does not exist;
//   2. RBAC (9.2) — a role grants a fixed set of actions; ADMIN is a blanket within its tenant;
//   3. ABAC (9.3) — an attribute of the actor+resource (you own this booking) grants an action a role does not;
//   4. ReBAC (9.3) — a relationship (you are the head of this room's department) grants it.
// Deny by default: if nothing grants the action, the answer is no.

export const ROLE_GRANTS = {
  STUDENT:   ['room:read', 'booking:read', 'booking:create'],
  TEACHER:   ['room:read', 'booking:read', 'booking:create'],
  DEPT_HEAD: ['room:read', 'booking:read', 'booking:create', 'room:manage'],
  ADMIN:     ['*'],                                  // every action — but still only within its own tenant
};

/** ⇒ true if \`user\` may perform \`action\` on \`resource\`. Deny by default; the tenant check comes first. */
export function can(user, action, resource) {
  if (!user || !resource) return false;
  if (resource.tenantId !== user.tenantId) return false;             // 1. tenant boundary — never crosses (9.4)
  const grants = ROLE_GRANTS[user.role] ?? [];
  if (grants.includes('*') || grants.includes(action)) return true;  // 2. RBAC (ADMIN is '*')
  if (action === 'booking:cancel' && resource.ownerId === user.id) return true;              // 3. ABAC: your own booking (9.3)
  if (action === 'booking:cancel' && user.role === 'DEPT_HEAD' && resource.departmentId === user.departmentId) return true; // 4. ReBAC: head of the room's dept (9.3)
  return false;                                                      // deny by default
}

/** Why a decision went the way it did — for an audit log and for teaching, never shown to the end user. */
export function explain(user, action, resource) {
  if (!user || !resource) return 'no user or resource';
  if (resource.tenantId !== user.tenantId) return 'cross-tenant: denied before any role is considered';
  const grants = ROLE_GRANTS[user.role] ?? [];
  if (grants.includes('*')) return \`RBAC: \${user.role} is a blanket grant within the tenant\`;
  if (grants.includes(action)) return \`RBAC: \${user.role} is granted \${action}\`;
  if (action === 'booking:cancel' && resource.ownerId === user.id) return 'ABAC: you own this booking';
  if (action === 'booking:cancel' && user.role === 'DEPT_HEAD' && resource.departmentId === user.departmentId) return 'ReBAC: you head this room’s department';
  return \`deny by default: \${user.role} has no grant for \${action}\`;
}`,
  gate: `// src/authz/gate.js — the ONE place authorization is enforced over HTTP (Chapter 9, 9.5). Every write route wraps its
// handler in authorize(action, loadResource): it loads the resource, runs can(), and only then calls the handler. Two
// rules it never breaks: (1) the resource is loaded and its tenant checked HERE, so a handler can never forget; (2) a
// cross-tenant or missing resource is a 404, never a 403 — the boundary must not reveal which ids exist (6.4, 9.4).
import { can } from './policy.js';

/**
 * authorize(action, loadResource) ⇒ Express middleware.
 *   loadResource(req) ⇒ the resource (with a tenantId) or null/undefined.
 * On allow it sets req.resource and calls next(); otherwise it ends the request:
 *   401 no user · 404 missing OR other tenant (indistinguishable) · 403 same tenant but no grant.
 */
export function authorize(action, loadResource) {
  return async (req, res, next) => {
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'NO_SESSION' });
    const resource = await loadResource(req);
    // Tenant boundary FIRST, and it looks exactly like "not found" — a probe cannot tell another tenant from a bad id.
    if (!resource || resource.tenantId !== user.tenantId) return res.status(404).json({ error: 'NOT_FOUND' });
    if (!can(user, action, resource)) return res.status(403).json({ error: 'FORBIDDEN' });   // honest "you cannot"
    req.resource = resource;
    next();
  };
}`,
  grader9: `// scripts/cham-lab-9.mjs — grader of Lab 9 (LabFlow's can() gate). 6 checks, 10 points, pass = 7.
import path from 'node:path';
import { pathToFileURL } from 'node:url';
const m = await import(pathToFileURL(path.resolve(process.argv[2] ?? 'lab9/my', 'index.js')).href);
const can = m.can;
const bk = { kind: 'booking', tenantId: 'fpt-hcm', roomId: 'room-a', ownerId: 'usr_1', departmentId: 'se' };
const an   = { id: 'usr_1', role: 'STUDENT',   tenantId: 'fpt-hcm', departmentId: 'se' };
const binh = { id: 'usr_2', role: 'STUDENT',   tenantId: 'fpt-hcm', departmentId: 'se' };
const head = { id: 'usr_9', role: 'DEPT_HEAD', tenantId: 'fpt-hcm', departmentId: 'se' };
const headOther = { id: 'usr_8', role: 'DEPT_HEAD', tenantId: 'fpt-hcm', departmentId: 'ba' };
const admin = { id: 'usr_0', role: 'ADMIN', tenantId: 'fpt-hcm', departmentId: null };
const adminHN = { ...admin, tenantId: 'fpt-hn' };

const results = [];
const expect = (c, why) => { if (!c) throw Object.assign(new Error(why), { name: 'Expected' }); };
async function check(name, points, fn) { let why = ''; try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : \`threw \${e?.name}: \${String(e?.message).split('\\n')[0]}\`; } results.push({ name, points, ok: !why, why }); }

await check('T1 RBAC: a role grants a fixed set of actions', 2, async () => {
  expect(can(an, 'booking:create', bk) === true, 'a STUDENT must be granted booking:create');
  expect(can(an, 'room:manage', bk) === false, 'a STUDENT must NOT have room:manage');
  expect(can(head, 'room:manage', bk) === true, 'a DEPT_HEAD must have room:manage');
});
await check('T2 ADMIN is a blanket — but only within its tenant', 1.5, async () => {
  expect(can(admin, 'booking:cancel', bk) === true, 'an ADMIN in the tenant may do anything');
  expect(can(admin, 'room:manage', bk) === true, 'including room:manage');
});
await check('T3 the tenant boundary comes FIRST (even for ADMIN)', 2, async () => {
  expect(can(adminHN, 'booking:cancel', bk) === false, 'an ADMIN in ANOTHER tenant must be denied before any role is considered');
  expect(can({ ...an, tenantId: 'fpt-hn' }, 'booking:read', bk) === false, 'a cross-tenant read must be denied');
});
await check('T4 ABAC: you may cancel your OWN booking', 1.5, async () => {
  expect(can(an, 'booking:cancel', bk) === true, 'the owner (usr_1) may cancel it');
  expect(can(binh, 'booking:cancel', bk) === false, 'a non-owner STUDENT may not');
});
await check('T5 ReBAC: a department head may cancel bookings in THEIR department', 1.5, async () => {
  expect(can(head, 'booking:cancel', bk) === true, 'the SE head may cancel an SE-room booking');
  expect(can(headOther, 'booking:cancel', bk) === false, 'a head of another department (ba) may not');
});
await check('T6 deny by default; null inputs never crash', 1.5, async () => {
  expect(can(binh, 'booking:nuke', bk) === false, 'an unknown action must be denied');
  expect(can(null, 'booking:read', bk) === false, 'a null user must be false, not a crash');
  expect(can(an, 'booking:read', null) === false, 'a null resource must be false, not a crash');
});

const total = results.reduce((s, r) => s + (r.ok ? r.points : 0), 0);
console.log(\`Lab 9 — \${path.relative(process.cwd(), path.resolve(process.argv[2] ?? 'lab9/my', 'index.js'))}\`);
for (const r of results) console.log(\`\${r.ok ? '✓' : '✗'} \${r.name.padEnd(60)} \${r.ok ? r.points : 0}/\${r.points}\${r.ok ? '' : \`\\n    ↳ \${r.why}\`}\`);
console.log(\`TOTAL \${total}/10 — \${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}\`);
process.exit(total >= 7 ? 0 : 1);`,
  yeu9: `// lab9/yeu/index.js — a first attempt that "works" on a single-tenant demo: RBAC plus owning your booking. But it FORGETS
// the tenant boundary entirely, so an admin (or anyone with a grant) reaches resources in OTHER tenants — the multi-tenant
// data leak (9.4). It also has no ReBAC, so a department head cannot cancel a booking in their own department.
export const ROLE_GRANTS = {
  STUDENT:   ['room:read', 'booking:read', 'booking:create'],
  TEACHER:   ['room:read', 'booking:read', 'booking:create'],
  DEPT_HEAD: ['room:read', 'booking:read', 'booking:create', 'room:manage'],
  ADMIN:     ['*'],
};
export function can(user, action, resource) {
  if (!user || !resource) return false;
  const grants = ROLE_GRANTS[user.role] ?? [];
  if (grants.includes('*') || grants.includes(action)) return true;     // RBAC — but no tenant check first!
  if (action === 'booking:cancel' && resource.ownerId === user.id) return true;  // ABAC
  return false;                                                         // no ReBAC
}`,
};
export const OUT = {
  '91-authz-matrix': `$ node demo9/authz-matrix.mjs
Can each user cancel An's booking (tenant fpt-hcm, dept se, owner usr_1)?
  An (owner, STUDENT)        booking:cancel   ALLOW  — ABAC: you own this booking
  Binh (STUDENT, same)       booking:cancel   deny   — deny by default: STUDENT has no grant for booking:cancel
  Head (DEPT_HEAD, se)       booking:cancel   ALLOW  — ReBAC: you head this room’s department
  Admin (same tenant)        booking:cancel   ALLOW  — RBAC: ADMIN is a blanket grant within the tenant
  HN student (other tenant)  booking:cancel   deny   — cross-tenant: denied before any role is considered

The four models, each granting what the one above cannot:
  RBAC   : a STUDENT may booking:create? true  · room:manage? false
  RBAC   : a DEPT_HEAD may room:manage?   true
  ABAC   : Binh may cancel An's booking?  false   (not his)  ·  An may cancel her own? true
  ReBAC  : the SE head may cancel it?     true   (heads the room's dept)
  Tenant : an FPT-HN admin may touch it?  false   (another tenant — denied before role)

Deny by default: Binh (a STUDENT) tries an unknown action booking:nuke ⇒ deny  (nothing grants it)`,
  '92-http-gate': `$ node demo9/http-gate.mjs
POST /bookings/bk-1/cancel  (bk-1 belongs to An, tenant fpt-hcm, dept se):
  An (owner)                 → 200 {"ok":true,"action":"booking:cancel"}
  Binh (same tenant, not owner) → 403 {"error":"FORBIDDEN"}
  Dept head (ReBAC)          → 200 {"ok":true,"action":"booking:cancel"}
  HN student (other tenant)  → 404 {"error":"NOT_FOUND"}
  Anyone, a non-existent id  → 404 {"error":"NOT_FOUND"}

⇒ ONE gate: same tenant + no grant = 403 (honest "you cannot"); another tenant = 404, identical to a
  missing id — so a cross-tenant probe cannot enumerate which bookings exist (the Chapter 6 rule, at the door).`,
  'lab-bat-dau': `$ node scripts/cham-lab-9.mjs lab9/starter
Lab 9 — lab9/starter/index.js
✗ T1 RBAC: a role grants a fixed set of actions                0/2
    ↳ a STUDENT must NOT have room:manage
✓ T2 ADMIN is a blanket — but only within its tenant           1.5/1.5
✗ T3 the tenant boundary comes FIRST (even for ADMIN)          0/2
    ↳ an ADMIN in ANOTHER tenant must be denied before any role is considered
✗ T4 ABAC: you may cancel your OWN booking                     0/1.5
    ↳ a non-owner STUDENT may not
✗ T5 ReBAC: a department head may cancel bookings in THEIR department 0/1.5
    ↳ a head of another department (ba) may not
✗ T6 deny by default; null inputs never crash                  0/1.5
    ↳ an unknown action must be denied
TOTAL 1.5/10 — NOT YET (pass = 7)`,
  'lab-npm-test': `$ npm test
…
ℹ tests 48
ℹ pass 48
ℹ fail 0`,
  'lab-tham-khao': `$ node scripts/cham-lab-9.mjs lab9/tham-khao
Lab 9 — lab9/tham-khao/index.js
✓ T1 RBAC: a role grants a fixed set of actions                2/2
✓ T2 ADMIN is a blanket — but only within its tenant           1.5/1.5
✓ T3 the tenant boundary comes FIRST (even for ADMIN)          2/2
✓ T4 ABAC: you may cancel your OWN booking                     1.5/1.5
✓ T5 ReBAC: a department head may cancel bookings in THEIR department 1.5/1.5
✓ T6 deny by default; null inputs never crash                  1.5/1.5
TOTAL 10/10 — PASS`,
  'lab-yeu': `$ node scripts/cham-lab-9.mjs lab9/yeu
Lab 9 — lab9/yeu/index.js
✓ T1 RBAC: a role grants a fixed set of actions                2/2
✓ T2 ADMIN is a blanket — but only within its tenant           1.5/1.5
✗ T3 the tenant boundary comes FIRST (even for ADMIN)          0/2
    ↳ an ADMIN in ANOTHER tenant must be denied before any role is considered
✓ T4 ABAC: you may cancel your OWN booking                     1.5/1.5
✗ T5 ReBAC: a department head may cancel bookings in THEIR department 0/1.5
    ↳ the SE head may cancel an SE-room booking
✓ T6 deny by default; null inputs never crash                  1.5/1.5
TOTAL 6.5/10 — NOT YET (pass = 7)`,
};
