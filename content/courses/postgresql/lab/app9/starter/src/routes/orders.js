// Orders: detail, a customer's history, checkout, payment.
import { Router } from 'express';
import { LoiApi, soNguyen } from '../loi.js';
import { tongTien } from '../tien.js';
import { datHang } from '../checkout.js';
import { thuTien } from '../gateway.js';   // used by C6

const PTTT = ['cod', 'card', 'momo', 'bank'];   // the same list as CHECK payment_method_check — the database stays the guard

export function routerOrders(prisma) {
  const r = Router();

  // GET /orders/1841 — one order with its lines, products and payment.
  // `select` with nested relations: Prisma sends ONE query per relation level (not one per row) ⇒ no N+1 (C3).
  r.get('/orders/:id', async (req, res) => {
    const id = soNguyen(req.params.id, 'id');
    const o = await prisma.orders.findUnique({
      where: { id },
      select: {
        id: true, status: true, created_at: true, note: true,   // TODO C4 · "note" becomes "delivery_note" — without downtime
        customer: { select: { id: true, full_name: true } },
        order_item: { select: { qty: true, unit_price: true, product: { select: { id: true, sku: true, name: true } } }, orderBy: { product_id: 'asc' } },
        payment: { select: { amount: true, method: true, paid_at: true } },
      },
    });
    if (!o) throw new LoiApi(404, 'NOT_FOUND', `no order ${id}`);
    res.json({ ...o, total: tongTien(o.order_item) });
  });

  // GET /customers/42/orders?limit=10&before=1256 — the "My orders" screen, newest first.
  // TODO C7a · write it with Prisma: orderBy created_at DESC then id DESC, keyset via Prisma's cursor (+ skip: 1),
  //            each order with its number of lines and its total (Decimal!). Then LOG_SQL=1: what did Prisma send?
  r.get('/customers/:id/orders', async (req, res) => {
    throw new LoiApi(501, 'TODO', 'C7a — not written yet');
  });

  // POST /orders  { "customer_id": 42, "items": [{ "product_id": 4, "qty": 2 }] }
  r.post('/orders', async (req, res) => {
    const kq = await datHang(prisma, req.body ?? {});   // TODO C5 · src/checkout.js
    res.status(201).json(kq);
  });

  // POST /orders/2001/pay  { "method": "card" }
  // TODO C6 · 1 read the order + its total (no transaction) · 2 call thuTien() OUTSIDE any transaction ·
  //           3 ONE short transaction: status pending → paid (only if still pending) + the payment row. 409 if not pending.
  r.post('/orders/:id/pay', async (req, res) => {
    throw new LoiApi(501, 'TODO', 'C6 — not written yet');
  });

  return r;
}

// ✗ The version that holds a connection while it waits for the gateway — ONLY for the C6 load test (DEMO_HOLD=1). Do not use.
export function routerPayGiuKetNoi(prisma) {
  const r = Router();
  r.post('/orders/:id/pay', async (req, res) => {
    const id = soNguyen(req.params.id, 'id');
    const method = String(req.body?.method ?? 'card');
    const tt = await prisma.$transaction(async (tx) => {
      const [o] = await tx.$queryRaw`SELECT status FROM orders WHERE id = ${id} FOR UPDATE`;
      if (!o || o.status !== 'pending') throw new LoiApi(409, 'NOT_PENDING', `order ${id} is not pending`);
      const dong = await tx.order_item.findMany({ where: { order_id: id }, select: { qty: true, unit_price: true } });
      const amount = tongTien(dong);
      await thuTien({ order_id: id, amount, method });            // ← 300 ms with a connection AND a row lock held
      await tx.orders.update({ where: { id }, data: { status: 'paid' } });
      return tx.payment.create({ data: { order_id: id, amount, method }, select: { id: true, amount: true } });
    }, { timeout: 15000 });
    res.status(201).json(tt);
  });
  return r;
}
