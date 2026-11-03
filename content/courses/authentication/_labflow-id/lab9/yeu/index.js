// lab9/yeu/index.js — a first attempt that "works" on a single-tenant demo: RBAC plus owning your booking. But it FORGETS
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
}
