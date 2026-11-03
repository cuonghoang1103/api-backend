// src/authz/policy.js — Chapter 9 = Lab 9 reference: ONE place that decides every authorization question for LabFlow.
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

/** ⇒ true if `user` may perform `action` on `resource`. Deny by default; the tenant check comes first. */
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
  if (grants.includes('*')) return `RBAC: ${user.role} is a blanket grant within the tenant`;
  if (grants.includes(action)) return `RBAC: ${user.role} is granted ${action}`;
  if (action === 'booking:cancel' && resource.ownerId === user.id) return 'ABAC: you own this booking';
  if (action === 'booking:cancel' && user.role === 'DEPT_HEAD' && resource.departmentId === user.departmentId) return 'ReBAC: you head this room’s department';
  return `deny by default: ${user.role} has no grant for ${action}`;
}
