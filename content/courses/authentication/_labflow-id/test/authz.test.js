import { test } from 'node:test';
import assert from 'node:assert/strict';
import { can } from '../src/authz/policy.js';
const bk = { tenantId: 'fpt-hcm', ownerId: 'usr_1', departmentId: 'se' };
const an = { id: 'usr_1', role: 'STUDENT', tenantId: 'fpt-hcm', departmentId: 'se' };
const head = { id: 'usr_9', role: 'DEPT_HEAD', tenantId: 'fpt-hcm', departmentId: 'se' };
const admin = { id: 'usr_0', role: 'ADMIN', tenantId: 'fpt-hcm' };
test('can() combines RBAC, ABAC, ReBAC behind the tenant boundary', () => {
  assert.equal(can(an, 'booking:create', bk), true);
  assert.equal(can(an, 'room:manage', bk), false);
  assert.equal(can(an, 'booking:cancel', bk), true);           // ABAC owner
  assert.equal(can({ id: 'usr_2', role: 'STUDENT', tenantId: 'fpt-hcm', departmentId: 'se' }, 'booking:cancel', bk), false);
  assert.equal(can(head, 'booking:cancel', bk), true);         // ReBAC dept head
  assert.equal(can(admin, 'booking:cancel', bk), true);        // RBAC blanket
  assert.equal(can({ ...admin, tenantId: 'fpt-hn' }, 'booking:cancel', bk), false); // tenant first
  assert.equal(can(null, 'x', bk), false);
});

import { authorize } from '../src/authz/gate.js';
function runGate(mw, req) {
  return new Promise((resolve) => {
    const res = { statusCode: 200, status(c) { this.statusCode = c; return this; }, json(b) { resolve({ status: this.statusCode, body: b }); } };
    mw(req, res, () => resolve({ status: 200, next: true, resource: req.resource }));
  });
}
const load = (req) => req.params.id === 'bk-1' ? { id: 'bk-1', tenantId: 'fpt-hcm', ownerId: 'usr_1', departmentId: 'se' } : null;
test('authorize() enforces can() and maps cross-tenant to 404, not 403', async () => {
  const mw = authorize('booking:cancel', load);
  assert.equal((await runGate(mw, { user: an, params: { id: 'bk-1' } })).next, true);               // owner → allowed
  assert.equal((await runGate(mw, { user: { id: 'usr_2', role: 'STUDENT', tenantId: 'fpt-hcm', departmentId: 'se' }, params: { id: 'bk-1' } })).status, 403); // same tenant, no grant
  assert.equal((await runGate(mw, { user: { ...an, tenantId: 'fpt-hn' }, params: { id: 'bk-1' } })).status, 404); // other tenant ⇒ 404
  assert.equal((await runGate(mw, { user: an, params: { id: 'bk-404' } })).status, 404);             // missing ⇒ same 404
  assert.equal((await runGate(mw, { user: null, params: { id: 'bk-1' } })).status, 401);             // no session
});
