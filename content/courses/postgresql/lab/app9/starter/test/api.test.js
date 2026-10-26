// api.test.js — integration tests: the real Express app + the real PostgreSQL (the TEST database, never ctlab9).
// Run: npm test   (= npm run db:test, then node --test). Built-in runner of Node 22 — nothing to install.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { taoPrisma, dem } from '../src/db.js';
import { taoApp } from '../src/app.js';

const url = process.env.TEST_DATABASE_URL;
const prisma = taoPrisma(url, { logLoi: false });   // the tests provoke errors on purpose: keep the output readable
let server, goc;
const api = async (method, path, body) => {
  const r = await fetch(goc + path, { method, headers: { 'content-type': 'application/json' }, body: body && JSON.stringify(body) });
  return { status: r.status, sql: Number(r.headers.get('x-sql-count')), body: await r.json() };
};
const sp = (sku) => prisma.product.findUniqueOrThrow({ where: { sku } });

before(async () => {
  server = taoApp(prisma, { url }).listen(0);
  goc = `http://localhost:${server.address().port}`;
});
after(async () => { server.close(); await prisma.$disconnect(); });

test('GET /health — up, as ctshop_app, with the role timeout', async () => {
  const r = await api('GET', '/health');
  assert.equal(r.status, 200);
  assert.equal(r.body.db_user, 'ctshop_app');
  assert.equal(r.body.statement_timeout, '5s');
});

test('GET /products — keyset pages: newest first, no overlap, ids are strings', async () => {
  const p1 = await api('GET', '/products?limit=2');
  const p2 = await api('GET', `/products?limit=2&before=${p1.body.next}`);
  const ids = [...p1.body.items, ...p2.body.items].map((p) => p.id);
  assert.equal(typeof ids[0], 'string');                       // BigInt ⇒ "6", never a crash
  assert.equal(new Set(ids).size, 4);
  assert.deepEqual(ids, [...ids].sort((a, b) => Number(b) - Number(a)));
  assert.ok(!ids.includes(String((await sp('T005')).id)));    // inactive products are hidden
});

test('POST /orders — order + lines + stock in one go, price taken at the moment of buying', async () => {
  const [a, b] = [await sp('T001'), await sp('T002')];
  const r = await api('POST', '/orders', { customer_id: 1, items: [{ product_id: Number(b.id), qty: 1 }, { product_id: Number(a.id), qty: 2 }, { product_id: Number(a.id), qty: 1 }] });
  assert.equal(r.status, 201);
  assert.equal(r.body.items, 2);                               // the same product twice ⇒ one line
  assert.equal(r.body.total, '21000');                         // 3 × 5000 + 1 × 6000, a Decimal sent as a string
  assert.equal((await sp('T001')).stock, a.stock - 3);
  const d = await api('GET', `/orders/${r.body.id}`);
  assert.deepEqual(d.body.order_item.map((i) => [i.qty, i.unit_price]), [[3, '5000'], [1, '6000']]);
  assert.ok(d.sql <= 5, `order detail sent ${d.sql} SQL statements`);   // nested select: one query per level, not per row
});

test('POST /orders — out of stock ⇒ 409 and NOTHING is written', async () => {
  const truoc = await prisma.orders.count();
  const [ok, het] = [await sp('T001'), await sp('T004')];
  const r = await api('POST', '/orders', { customer_id: 2, items: [{ product_id: Number(ok.id), qty: 1 }, { product_id: Number(het.id), qty: 1 }] });
  assert.equal(r.status, 409);
  assert.equal(r.body.error, 'OUT_OF_STOCK');
  assert.equal(await prisma.orders.count(), truoc);            // the order row was rolled back …
  assert.equal((await sp('T001')).stock, ok.stock);            // … and so was the first line's stock
});

test('two buyers, one last unit ⇒ exactly one order', async () => {
  const p = await sp('T003');
  const ban = () => api('POST', '/orders', { customer_id: 3, items: [{ product_id: Number(p.id), qty: 1 }] });
  const kq = (await Promise.all([ban(), ban()])).map((r) => r.status).sort();
  assert.deepEqual(kq, [201, 409]);
  assert.equal((await sp('T003')).stock, 0);
});

test('POST /orders/:id/pay — pays once, refuses the second time', async () => {
  const p = await sp('T002');
  const don = await api('POST', '/orders', { customer_id: 4, items: [{ product_id: Number(p.id), qty: 2 }] });
  const [r1, r2] = [await api('POST', `/orders/${don.body.id}/pay`, { method: 'momo' }), await api('POST', `/orders/${don.body.id}/pay`, { method: 'momo' })];
  assert.equal(r1.status, 201);
  assert.equal(r1.body.amount, '12000');
  assert.equal(r2.status, 409);
  assert.equal((await prisma.orders.findUnique({ where: { id: BigInt(don.body.id) } })).status, 'paid');
});

test('GET /reports/revenue — months in Vietnamese time, running total, growth', async () => {
  // two payments at the edges of a Vietnamese month: 31/12 23:30 (+07) belongs to December, not January
  const p = await sp('T006');
  for (const [paid_at, amount] of [['2025-12-31T23:30:00+07:00', 100000], ['2026-01-01T00:10:00+07:00', 150000], ['2026-01-20T10:00:00+07:00', 50000]]) {
    const o = await prisma.orders.create({ data: { customer_id: 5, status: 'paid', order_item: { create: { product_id: p.id, qty: 1, unit_price: amount } } } });
    await prisma.payment.create({ data: { order_id: o.id, amount, method: 'bank', paid_at: new Date(paid_at) } });
  }
  const r = await api('GET', '/reports/revenue?from=2025-12&to=2026-01');
  assert.deepEqual(r.body.months, [
    { thang: '2025-12', so_don: 1, doanh_thu: '100000.00', luy_ke: '100000.00', tang_pct: null },
    { thang: '2026-01', so_don: 2, doanh_thu: '200000.00', luy_ke: '300000.00', tang_pct: '100.0' },
  ]);
});

test('the app role cannot change the schema', async () => {
  await assert.rejects(prisma.$executeRawUnsafe('DROP TABLE review'), /must be owner of table review/);
  await assert.rejects(prisma.$executeRawUnsafe('CREATE TABLE shop.x (id int)'), /permission denied for schema shop/);
  await assert.rejects(prisma.$executeRawUnsafe('DELETE FROM shop._prisma_migrations'), /permission denied for table _prisma_migrations/);
  assert.ok(dem.sql > 0);
});
