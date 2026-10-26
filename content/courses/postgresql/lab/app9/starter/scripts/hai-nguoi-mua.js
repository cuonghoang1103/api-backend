// hai-nguoi-mua.js — two buyers at the same moment, on the TEST database (run `npm run db:test` first).
// 1 · read-modify-write ⇒ oversold · 2 · the atomic UPDATE ⇒ exactly one order · 3 · carts in opposite order ⇒ deadlock, and the fix.
// Run: npm run race
import { PrismaClient } from '@prisma/client';
import { datHang, datHangDocSuaGhi } from '../src/checkout.js';

process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;
const prisma = new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL });   // no error log: the results are printed below
const sp = async (sku) => prisma.product.findUniqueOrThrow({ where: { sku }, select: { id: true, stock: true } });
const ngan = (e) => {   // a short line for each error: Prisma code (or the SQLSTATE hidden in the message) + text
  const m = /code: "(\w+)", message: "([^"]+)"/.exec(e.message);
  return m ? `${e.constructor.name} (no code) · ${m[1]} ${m[2]}` : `${e.code ?? e.constructor.name} ${e.message.split('\n').filter(Boolean).at(-1)}`;
};
const ketQua = (rs) => rs.map((r) => (r.status === 'fulfilled' ? `✓ order ${r.value.id}` : `✗ ${ngan(r.reason)}`));

const gel = await sp('T003');
const gio = [{ product_id: Number(gel.id), qty: 1 }];

console.log('── 1 · read-modify-write, stock = 1, two buyers');
await prisma.product.update({ where: { id: gel.id }, data: { stock: 1 } });
const don0 = await prisma.orders.count({ where: { order_item: { some: { product_id: gel.id } } } });
console.log(ketQua(await Promise.allSettled([datHangDocSuaGhi(prisma, { customer_id: 6, items: gio }), datHangDocSuaGhi(prisma, { customer_id: 7, items: gio })])));
console.log(`   stock now ${(await sp('T003')).stock} · orders for it: ${(await prisma.orders.count({ where: { order_item: { some: { product_id: gel.id } } } })) - don0} ⇒ two units sold, one taken from stock`);

console.log('── 2 · atomic UPDATE … WHERE stock >= qty, stock = 1, two buyers');
await prisma.product.update({ where: { id: gel.id }, data: { stock: 1 } });
console.log(ketQua(await Promise.allSettled([datHang(prisma, { customer_id: 6, items: gio }), datHang(prisma, { customer_id: 7, items: gio })])));
console.log(`   stock now ${(await sp('T003')).stock}`);

const [a, b] = [await sp('T001'), await sp('T002')];
const gioA = [{ product_id: Number(a.id), qty: 1 }, { product_id: Number(b.id), qty: 1 }];
const gioB = [{ product_id: Number(b.id), qty: 1 }, { product_id: Number(a.id), qty: 1 }];

console.log('── 3a · carts in opposite order, NOT sorted, no retry');
console.log(ketQua(await Promise.allSettled([
  datHang(prisma, { customer_id: 8, items: gioA }, { treMs: 200, sapXep: false, thuLai: 1 }),
  datHang(prisma, { customer_id: 9, items: gioB }, { treMs: 200, sapXep: false, thuLai: 1 }),
])));

console.log('── 3b · the same carts, NOT sorted, with retry');
console.log(ketQua(await Promise.allSettled([
  datHang(prisma, { customer_id: 8, items: gioA }, { treMs: 200, sapXep: false }),
  datHang(prisma, { customer_id: 9, items: gioB }, { treMs: 200, sapXep: false }),
])));

console.log('── 3c · the same carts, sorted by product_id (the default)');
const t0 = performance.now();
console.log(ketQua(await Promise.allSettled([
  datHang(prisma, { customer_id: 8, items: gioA }, { treMs: 200 }),
  datHang(prisma, { customer_id: 9, items: gioB }, { treMs: 200 }),
])), `${(performance.now() - t0).toFixed(0)} ms — the second simply waited`);
await prisma.$disconnect();
