// checkout.js — place an order: the order, its lines and the stock in ONE transaction, safe for buyers in parallel.
import { Prisma } from '@prisma/client';
import { LoiApi } from './loi.js';
import { tongTien } from './tien.js';

const ngu = (ms) => new Promise((r) => setTimeout(r, ms));

// The cart: one line per product, quantities added up, ALWAYS sorted by product_id —
// two carts then lock their products in the same order and can never wait for each other in a circle (deadlock, 11.3).
export function gomGio(items, { sapXep = true } = {}) {
  if (!Array.isArray(items) || items.length === 0 || items.length > 50) throw new LoiApi(400, 'BAD_CART', 'items must be a list of 1–50 lines');
  const gio = new Map();
  for (const it of items) {
    const pid = Number(it?.product_id), qty = Number(it?.qty);
    if (!Number.isSafeInteger(pid) || pid < 1 || !Number.isSafeInteger(qty) || qty < 1 || qty > 100) {
      throw new LoiApi(400, 'BAD_CART', 'every line needs a product_id and a qty between 1 and 100');
    }
    gio.set(pid, (gio.get(pid) ?? 0) + qty);
  }
  const dong = [...gio].map(([product_id, qty]) => ({ product_id, qty }));
  return sapXep ? dong.sort((a, b) => a.product_id - b.product_id) : dong;
}

// Retry the WHOLE transaction when PostgreSQL says "two transactions collided, run me again" — measured on Prisma 5.22:
//   · Serializable conflict (40001)            ⇒ PrismaClientKnownRequestError   code P2034
//   · deadlock (40P01) in a READ COMMITTED tx  ⇒ PrismaClientUnknownRequestError, NO code — only the text 'code: "40P01"'
//   · a raw query ($queryRaw / $executeRaw)    ⇒ P2010 with meta.code = the SQLSTATE
// A retry that only looks for P2034 never retries a deadlock (C5, trap).
export const laVaCham = (e) =>
  (e instanceof Prisma.PrismaClientKnownRequestError &&
    (e.code === 'P2034' || (e.code === 'P2010' && ['40001', '40P01'].includes(e.meta?.code)))) ||
  (e instanceof Prisma.PrismaClientUnknownRequestError && /code: "(40001|40P01)"/.test(e.message));

export async function voiThuLai(fn, { lan = 3 } = {}) {
  for (let i = 1; ; i++) {
    try {
      return await fn();
    } catch (e) {
      if (!laVaCham(e) || i >= lan) throw e;
      console.warn(`checkout: collision (${e.code ?? '40P01'}) — retry ${i}/${lan - 1}`);
      await ngu(15 * i + Math.floor(Math.random() * 15));   // a little jitter so the two do not collide again
    }
  }
}

// opts are for scripts/hai-nguoi-mua.js only: treMs = pause between lines, sapXep/thuLai = switch the protections off.
export async function datHang(prisma, { customer_id, items, delivery_note = null }, { treMs = 0, sapXep = true, thuLai = 3 } = {}) {
  const gio = gomGio(items, { sapXep });
  const kh = Number(customer_id);
  if (!Number.isSafeInteger(kh) || kh < 1) throw new LoiApi(400, 'BAD_INPUT', 'customer_id must be a whole number');
  const ghiChu = typeof delivery_note === 'string' && delivery_note.trim() ? delivery_note.trim().slice(0, 300) : null;

  return voiThuLai(() => prisma.$transaction(async (tx) => {
    const don = await tx.orders.create({ data: { customer_id: kh, delivery_note: ghiChu }, select: { id: true, created_at: true } });

    for (const d of gio) {
      // ONE atomic statement per line: "take qty if there are at least qty left" — no read-modify-write (16.4, case 2).
      // ⇒ UPDATE product SET stock = stock - $1 WHERE id = $2 AND is_active AND stock >= $3   (the row stays locked until COMMIT)
      const { count } = await tx.product.updateMany({
        where: { id: d.product_id, is_active: true, stock: { gte: d.qty } },
        data: { stock: { decrement: d.qty } },
      });
      if (count === 0) {
        const p = await tx.product.findUnique({ where: { id: d.product_id }, select: { name: true, stock: true, is_active: true } });
        if (!p) throw new LoiApi(400, 'BAD_CART', `product ${d.product_id} does not exist`);
        throw new LoiApi(409, 'OUT_OF_STOCK', `${p.name}: ${p.is_active ? `${p.stock} left, ${d.qty} wanted` : 'not for sale'}`, { product_id: d.product_id });
      }
      if (treMs) await ngu(treMs);   // demo only (scripts/hai-nguoi-mua.js): widen the window between two lines
    }

    // Price AT THE MOMENT of buying, read from the rows we have just locked (nobody can change them before COMMIT).
    const gia = await tx.product.findMany({ where: { id: { in: gio.map((d) => d.product_id) } }, select: { id: true, price: true } });
    const giaCua = new Map(gia.map((p) => [Number(p.id), p.price]));
    const dong = gio.map((d) => ({ order_id: don.id, product_id: d.product_id, qty: d.qty, unit_price: giaCua.get(d.product_id) }));
    await tx.order_item.createMany({ data: dong });

    return { id: don.id, status: 'pending', created_at: don.created_at, items: dong.length, total: tongTien(dong) };
  }, { maxWait: 5000, timeout: 10000 }), { lan: thuLai });
}

// ✗ The read-modify-write version — kept ONLY for scripts/hai-nguoi-mua.js to show the oversell. Do not use.
export async function datHangDocSuaGhi(prisma, { customer_id, items }) {
  const gio = gomGio(items);
  return prisma.$transaction(async (tx) => {
    const don = await tx.orders.create({ data: { customer_id: Number(customer_id) }, select: { id: true } });
    for (const d of gio) {
      const p = await tx.product.findUnique({ where: { id: d.product_id }, select: { stock: true, price: true } });   // read …
      if (p.stock < d.qty) throw new LoiApi(409, 'OUT_OF_STOCK', `${p.stock} left`);
      await new Promise((r) => setTimeout(r, 50));                                                                   // (the app does something)
      await tx.product.update({ where: { id: d.product_id }, data: { stock: p.stock - d.qty } });                  // … write back
      await tx.order_item.create({ data: { order_id: don.id, product_id: d.product_id, qty: d.qty, unit_price: p.price } });
    }
    return { id: don.id };
  });
}
