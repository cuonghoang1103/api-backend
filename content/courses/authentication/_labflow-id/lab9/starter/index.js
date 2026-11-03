// lab9/starter/index.js — Lab 9 starter. Write LabFlow's ONE authorization gate.
// can(user, action, resource) ⇒ boolean. Deny by default. Combine four models in THIS order:
//   1. tenant boundary FIRST: resource.tenantId !== user.tenantId ⇒ false (never crosses — 9.4)
//   2. RBAC: ROLE_GRANTS[user.role] includes the action, or '*' (ADMIN) ⇒ true (9.2)
//   3. ABAC: action 'booking:cancel' and resource.ownerId === user.id ⇒ true (9.3)
//   4. ReBAC: 'booking:cancel' and user.role 'DEPT_HEAD' and resource.departmentId === user.departmentId ⇒ true (9.3)
// A null user or resource ⇒ false (never crash).
export const ROLE_GRANTS = {
  STUDENT:   ['room:read', 'booking:read', 'booking:create'],
  TEACHER:   ['room:read', 'booking:read', 'booking:create'],
  DEPT_HEAD: ['room:read', 'booking:read', 'booking:create', 'room:manage'],
  ADMIN:     ['*'],
};
export function can(user, action, resource) {
  // Write your solution here
  return true;
}
