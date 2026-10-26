// app.js — the Express app, built around ONE PrismaClient (so tests can pass their own).
import express from 'express';
import { dem } from './db.js';
import { xuLyLoi } from './loi.js';
import { routerHealth } from './routes/health.js';
import { routerProducts } from './routes/products.js';
import { routerOrders, routerPayGiuKetNoi } from './routes/orders.js';
import { routerReports } from './routes/reports.js';

export function taoApp(prisma, { url = process.env.DATABASE_URL } = {}) {
  const app = express();
  app.use(express.json({ limit: '50kb' }));

  // BigInt (every id here is bigint) cannot go through JSON.stringify ⇒ send it as a string.
  // Prisma.Decimal (price, amount) already turns itself into a string ("15000") — never into a float.
  app.set('json replacer', (_k, v) => (typeof v === 'bigint' ? v.toString() : v));

  // Dev only: how many SQL statements did this request send? (counter is shared — meaningful one request at a time)
  app.use((req, res, next) => {
    const truoc = dem.sql;
    const json = res.json.bind(res);
    res.json = (body) => { res.set('X-SQL-Count', String(dem.sql - truoc)); return json(body); };
    next();
  });

  app.use(routerHealth(prisma, url));
  app.use(routerProducts(prisma));
  if (process.env.DEMO_HOLD === '1') app.use(routerPayGiuKetNoi(prisma));   // C6 load test only: the WRONG payment
  app.use(routerOrders(prisma));
  app.use(routerReports(prisma));
  app.use((req, res) => res.status(404).json({ error: 'NOT_FOUND', message: `no route ${req.method} ${req.path}` }));
  app.use(xuLyLoi);
  return app;
}
