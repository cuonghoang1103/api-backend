// demo9/http-gate.mjs — the real gate (src/authz/gate.js) over HTTP (Chapter 9, 9.4 + 9.5). Every route goes through
// authorize(action, load), which calls can(). A cross-tenant resource returns 404 (not 403) so the boundary does not
// leak which ids exist (6.4). The middleware is the SHIPPED module — this file only supplies a tiny inline world.
import express from 'express';
import { authorize } from '../src/authz/gate.js';

const PORT = 4812;
const USERS = {
  'tok-an':   { id: 'usr_1', role: 'STUDENT',   tenantId: 'fpt-hcm', departmentId: 'se' },
  'tok-binh': { id: 'usr_2', role: 'STUDENT',   tenantId: 'fpt-hcm', departmentId: 'se' },
  'tok-head': { id: 'usr_9', role: 'DEPT_HEAD', tenantId: 'fpt-hcm', departmentId: 'se' },
  'tok-hn':   { id: 'usr_7', role: 'STUDENT',   tenantId: 'fpt-hn',  departmentId: 'se' },
};
const BOOKINGS = { 'bk-1': { id: 'bk-1', kind: 'booking', tenantId: 'fpt-hcm', roomId: 'room-a', ownerId: 'usr_1', departmentId: 'se' } };

const app = express();
// A one-line auth shim: turn the bearer token into req.user (Chapter 3/4 do this for real). The gate reads req.user.
app.use((req, _res, next) => { req.user = USERS[(req.headers.authorization ?? '').replace('Bearer ', '')]; next(); });
// ONE gate, the shipped module. It denies cross-tenant as 404; the handler runs only when can() said yes.
app.post('/bookings/:id/cancel', authorize('booking:cancel', (req) => BOOKINGS[req.params.id]), (req, res) => {
  res.json({ ok: true, action: 'booking:cancel' });
});
const server = app.listen(PORT);

const call = async (tok, id) => { const r = await fetch(`http://localhost:${PORT}/bookings/${id}/cancel`, { method: 'POST', headers: { authorization: `Bearer ${tok}` } }); return `${r.status} ${JSON.stringify(await r.json())}`; };

console.log("POST /bookings/bk-1/cancel  (bk-1 belongs to An, tenant fpt-hcm, dept se):");
console.log(`  An (owner)                 → ${await call('tok-an', 'bk-1')}`);
console.log(`  Binh (same tenant, not owner) → ${await call('tok-binh', 'bk-1')}`);
console.log(`  Dept head (ReBAC)          → ${await call('tok-head', 'bk-1')}`);
console.log(`  HN student (other tenant)  → ${await call('tok-hn', 'bk-1')}`);
console.log(`  Anyone, a non-existent id  → ${await call('tok-an', 'bk-404')}`);
server.close();
console.log('\n⇒ ONE gate: same tenant + no grant = 403 (honest "you cannot"); another tenant = 404, identical to a');
console.log('  missing id — so a cross-tenant probe cannot enumerate which bookings exist (the Chapter 6 rule, at the door).');
