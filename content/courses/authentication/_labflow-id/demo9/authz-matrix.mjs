// demo9/authz-matrix.mjs — one can() answers every question, across RBAC, ABAC, ReBAC and the tenant boundary (Chapter 9).
import { can, explain } from '../src/authz/policy.js';

// A small LabFlow world: two tenants (FPT-HCM, FPT-HN), users, and one booking owned by An in the SE department.
const an      = { id: 'usr_1', role: 'STUDENT',   tenantId: 'fpt-hcm', departmentId: 'se' };
const binh    = { id: 'usr_2', role: 'STUDENT',   tenantId: 'fpt-hcm', departmentId: 'se' };
const head    = { id: 'usr_9', role: 'DEPT_HEAD', tenantId: 'fpt-hcm', departmentId: 'se' };
const admin   = { id: 'usr_0', role: 'ADMIN',     tenantId: 'fpt-hcm', departmentId: null };
const hnStudent = { id: 'usr_7', role: 'STUDENT', tenantId: 'fpt-hn',  departmentId: 'se' };
const booking = { kind: 'booking', tenantId: 'fpt-hcm', roomId: 'room-a', ownerId: 'usr_1', departmentId: 'se' };

const row = (who, label, action) => {
  const ok = can(who, action, booking);
  console.log(`  ${label.padEnd(26)} ${action.padEnd(16)} ${ok ? 'ALLOW' : 'deny '}  — ${explain(who, action, booking)}`);
};

console.log("Can each user cancel An's booking (tenant fpt-hcm, dept se, owner usr_1)?");
row(an,   'An (owner, STUDENT)',   'booking:cancel');
row(binh, 'Binh (STUDENT, same)',  'booking:cancel');
row(head, 'Head (DEPT_HEAD, se)',  'booking:cancel');
row(admin,'Admin (same tenant)',   'booking:cancel');
row(hnStudent, 'HN student (other tenant)', 'booking:cancel');

console.log('\nThe four models, each granting what the one above cannot:');
console.log(`  RBAC   : a STUDENT may booking:create? ${can(an, 'booking:create', booking)}  · room:manage? ${can(an, 'room:manage', booking)}`);
console.log(`  RBAC   : a DEPT_HEAD may room:manage?   ${can(head, 'room:manage', booking)}`);
console.log(`  ABAC   : Binh may cancel An's booking?  ${can(binh, 'booking:cancel', booking)}   (not his)  ·  An may cancel her own? ${can(an, 'booking:cancel', booking)}`);
console.log(`  ReBAC  : the SE head may cancel it?     ${can(head, 'booking:cancel', booking)}   (heads the room's dept)`);
console.log(`  Tenant : an FPT-HN admin may touch it?  ${can({ ...admin, tenantId: 'fpt-hn' }, 'booking:cancel', booking)}   (another tenant — denied before role)`);

console.log('\nDeny by default: Binh (a STUDENT) tries an unknown action booking:nuke ⇒ ' + (can(binh, 'booking:nuke', booking) ? 'ALLOW' : 'deny') + '  (nothing grants it)');
