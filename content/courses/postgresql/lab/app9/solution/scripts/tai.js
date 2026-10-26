// tai.js — a small load test on the TEST database: N pending orders, then N payments, C at a time.
//   npm run load -- --limit 5 --timeout 2 --hold     the WRONG payment (gateway call inside the transaction)
//   npm run load -- --limit 5 --timeout 2            the right one (gateway outside, short transaction)
// The API runs inside this process on a free port; autocannon (pinned 8.0.0) sends the requests.
import { parseArgs } from 'node:util';
import autocannon from 'autocannon';
import { PrismaClient } from '@prisma/client';

const { values: a } = parseArgs({ options: {
  limit: { type: 'string', default: '5' }, timeout: { type: 'string', default: '10' }, hold: { type: 'boolean', default: false },
  c: { type: 'string', default: '50' }, n: { type: 'string', default: '400' },
} });
const u = new URL(process.env.TEST_DATABASE_URL);
u.searchParams.set('connection_limit', a.limit);
u.searchParams.set('pool_timeout', a.timeout);
u.searchParams.set('application_name', 'ctshop-load');
process.env.DATABASE_URL = u.href;
if (a.hold) process.env.DEMO_HOLD = '1';

const { taoPrisma } = await import('../src/db.js');
const { taoApp } = await import('../src/app.js');
const prisma = taoPrisma(u.href);
const server = taoApp(prisma, { url: u.href }).listen(0);
const port = server.address().port;

// N pending orders of one cheap product (written by the app role, like any order)
const p = await prisma.product.findUniqueOrThrow({ where: { sku: 'T006' } });
const ids = (await prisma.$queryRaw`
  WITH o AS (INSERT INTO orders (customer_id) SELECT 1 + g % 20 FROM generate_series(1, ${Number(a.n)}) g RETURNING id)
  INSERT INTO order_item (order_id, product_id, qty, unit_price) SELECT id, ${p.id}, 1, ${p.price} FROM o RETURNING order_id`).map((r) => r.order_id);

// watch the pool from the database side, once in the middle of the run (a separate 1-connection client)
const mat = new PrismaClient({ datasourceUrl: process.env.TEST_DATABASE_URL.replace('connection_limit=5', 'connection_limit=1') });
setTimeout(async () => {
  const rows = await mat.$queryRaw`SELECT state, count(*)::int AS n FROM pg_stat_activity
                                   WHERE application_name = 'ctshop-load' GROUP BY state ORDER BY state`;
  console.log('pg_stat_activity (ctshop-load) mid-run:', rows.map((r) => `${r.state}=${r.n}`).join(' · '));
}, 1500);

let i = 0;
const kq = await autocannon({
  url: `http://localhost:${port}`, connections: Number(a.c), amount: ids.length, timeout: 30,
  requests: [{ method: 'POST', headers: { 'content-type': 'application/json' }, body: '{"method":"card"}',
               setupRequest: (req) => ({ ...req, path: `/orders/${ids[i++]}/pay` }) }],
});
const ma = Object.entries(kq.statusCodeStats).map(([k, v]) => `${k}×${v.count}`).join(' ');
console.log(`${a.hold ? 'HOLD (gateway inside the transaction)' : 'SHORT (gateway outside)'} · connection_limit=${a.limit} pool_timeout=${a.timeout}s · ${a.c} clients · ${ids.length} payments`);
console.log(`  status codes: ${ma}`);
console.log(`  latency p50 ${kq.latency.p50} ms · p99 ${kq.latency.p99} ms · max ${kq.latency.max} ms · ${kq.requests.average} req/s · ${kq.duration.toFixed(1)} s`);
console.log(`  paid in the database: ${await prisma.payment.count({ where: { order_id: { in: ids } } })} / ${ids.length}`);
server.close(); await mat.$disconnect(); await prisma.$disconnect();
