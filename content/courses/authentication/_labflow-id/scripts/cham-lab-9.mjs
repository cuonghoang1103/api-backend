// scripts/cham-lab-9.mjs — grader of Lab 9 (LabFlow's can() gate). 6 checks, 10 points, pass = 7.
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
async function check(name, points, fn) { let why = ''; try { why = (await fn()) || ''; } catch (e) { why = e?.name === 'Expected' ? e.message : `threw ${e?.name}: ${String(e?.message).split('\n')[0]}`; } results.push({ name, points, ok: !why, why }); }

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
console.log(`Lab 9 — ${path.relative(process.cwd(), path.resolve(process.argv[2] ?? 'lab9/my', 'index.js'))}`);
for (const r of results) console.log(`${r.ok ? '✓' : '✗'} ${r.name.padEnd(60)} ${r.ok ? r.points : 0}/${r.points}${r.ok ? '' : `\n    ↳ ${r.why}`}`);
console.log(`TOTAL ${total}/10 — ${total >= 7 ? 'PASS' : 'NOT YET (pass = 7)'}`);
process.exit(total >= 7 ? 0 : 1);
