// src/authz/gate.js — the ONE place authorization is enforced over HTTP (Chapter 9, 9.5). Every write route wraps its
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
}
