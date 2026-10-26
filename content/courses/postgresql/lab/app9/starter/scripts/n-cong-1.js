// n-cong-1.js — the N+1 trap, measured: "My orders" for customer 42 (20 newest) written three ways.
// Read-only, so it runs on ctlab9 itself.  Run: npm run n1
import { taoPrisma, dem } from '../src/db.js';
import { tongTien } from '../src/tien.js';

const prisma = taoPrisma();
await prisma.$queryRaw`SELECT 1`;   // open the pool first, so the timings below are the queries only

async function do_(ten, fn) {
  const sql0 = dem.sql, t0 = performance.now();
  const kq = await fn();
  console.log(`${ten.padEnd(44)} ${String(dem.sql - sql0).padStart(3)} SQL  ${(performance.now() - t0).toFixed(0).padStart(4)} ms  → ${kq.length} orders, first total ${kq[0].total}`);
}

// ✗ 1 · the loop: one query for the list, then one per order for its lines, then one per line for the product name
await do_('✗ loop: findMany + findMany/order + findUnique/line', async () => {
  const don = await prisma.orders.findMany({ where: { customer_id: 42 }, orderBy: { created_at: 'desc' }, take: 20 });
  for (const o of don) {
    o.lines = await prisma.order_item.findMany({ where: { order_id: o.id } });
    for (const l of o.lines) l.product = await prisma.product.findUnique({ where: { id: l.product_id }, select: { name: true } });
    o.total = tongTien(o.lines);
  }
  return don;
});

// ✓ 2 · nested select: Prisma fetches each relation level with ONE query (WHERE order_id IN (…20 ids…))
await do_('✓ nested select (orders → order_item → product)', async () => {
  const don = await prisma.orders.findMany({
    where: { customer_id: 42 }, orderBy: { created_at: 'desc' }, take: 20,
    select: { id: true, status: true, order_item: { select: { qty: true, unit_price: true, product: { select: { name: true } } } } },
  });
  return don.map((o) => ({ ...o, total: tongTien(o.order_item) }));
});

// ✓ 3 · one SQL statement: PostgreSQL builds the JSON itself (json_agg) — one round trip
await do_('✓ one $queryRaw with json_agg', async () => prisma.$queryRaw`
  SELECT o.id, o.status, sum(oi.qty * oi.unit_price)::text AS total,
         json_agg(json_build_object('name', p.name, 'qty', oi.qty) ORDER BY p.id) AS lines
  FROM (SELECT id, status, created_at FROM orders WHERE customer_id = 42 ORDER BY created_at DESC LIMIT 20) o
  JOIN order_item oi ON oi.order_id = o.id JOIN product p ON p.id = oi.product_id
  GROUP BY o.id, o.status, o.created_at ORDER BY o.created_at DESC`);

await prisma.$disconnect();
