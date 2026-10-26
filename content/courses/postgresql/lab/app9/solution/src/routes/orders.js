// Orders: detail, a customer's history, checkout, payment.
import { Router } from 'express';
import { LoiApi, soNguyen } from '../loi.js';
import { tongTien } from '../tien.js';
import { datHang } from '../checkout.js';
import { thuTien } from '../gateway.js';

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
        id: true, status: true, created_at: true, delivery_note: true,
        customer: { select: { id: true, full_name: true } },
        order_item: { select: { qty: true, unit_price: true, product: { select: { id: true, sku: true, name: true } } }, orderBy: { product_id: 'asc' } },
        payment: { select: { amount: true, method: true, paid_at: true } },
      },
    });
    if (!o) throw new LoiApi(404, 'NOT_FOUND', `no order ${id}`);
    res.json({ ...o, total: tongTien(o.order_item) });
  });

  // GET /customers/42/orders?limit=10&before=1256 — the "My orders" screen, newest first, keyset by (created_at, id).
  r.get('/customers/:id/orders', async (req, res) => {
    const id = soNguyen(req.params.id, 'id');
    const limit = soNguyen(req.query.limit, 'limit', { max: 50 }) ?? 10;
    const before = soNguyen(req.query.before, 'before');
    const rows = await prisma.orders.findMany({
      where: { customer_id: id },
      orderBy: [{ created_at: 'desc' }, { id: 'desc' }],
      ...(before && { cursor: { id: before }, skip: 1 }),   // Prisma's cursor = "start right after this order"
      take: limit + 1,
      select: {
        id: true, status: true, created_at: true,
        order_item: { select: { qty: true, unit_price: true } },
        payment: { select: { method: true } },
      },
    });
    const items = rows.slice(0, limit).map(({ order_item, ...o }) => ({ ...o, lines: order_item.length, total: tongTien(order_item) }));
    res.json({ items, next: rows.length > limit ? items.at(-1).id : null });
  });

  // POST /orders  { "customer_id": 42, "items": [{ "product_id": 4, "qty": 2 }], "delivery_note": "…" }
  r.post('/orders', async (req, res) => {
    const kq = await datHang(prisma, req.body ?? {});
    res.status(201).json(kq);
  });

  // POST /orders/2001/pay  { "method": "card" }
  r.post('/orders/:id/pay', async (req, res) => {
    const id = soNguyen(req.params.id, 'id');
    const method = String(req.body?.method ?? '');
    if (!PTTT.includes(method)) throw new LoiApi(400, 'BAD_INPUT', `method must be one of ${PTTT.join(', ')}`);

    // 1 · read the order and its total: a short query, no transaction
    const o = await prisma.orders.findUnique({ where: { id }, select: { status: true, order_item: { select: { qty: true, unit_price: true } } } });
    if (!o) throw new LoiApi(404, 'NOT_FOUND', `no order ${id}`);
    if (o.status !== 'pending') throw new LoiApi(409, 'NOT_PENDING', `order ${id} is ${o.status}`);
    const amount = tongTien(o.order_item);

    // 2 · the payment gateway, OUTSIDE any transaction: its 300 ms of waiting hold no database connection (C6)
    const gd = await thuTien({ order_id: id, amount, method });

    // 3 · record it in one SHORT transaction. "WHERE status = 'pending'" + UNIQUE(order_id) stop a double payment.
    const tt = await prisma.$transaction(async (tx) => {
      const { count } = await tx.orders.updateMany({ where: { id, status: 'pending' }, data: { status: 'paid' } });
      if (count === 0) throw new LoiApi(409, 'NOT_PENDING', `order ${id} was paid in the meantime`);
      return tx.payment.create({ data: { order_id: id, amount, method }, select: { id: true, order_id: true, amount: true, method: true, paid_at: true } });
    });
    res.status(201).json({ ...tt, gateway_ref: gd.ref });
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
