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

// TODO C5c · retry the WHOLE transaction (up to `lan` times, with a little random pause) when PostgreSQL reports a collision:
//            40001 serialization_failure or 40P01 deadlock_detected. Find out (scripts/hai-nguoi-mua.js, case 3a) what
//            Prisma 5.22 REALLY throws for each — class, .code, .meta — before you write the test. Anything else: rethrow.
export const laVaCham = (e) => false;

export async function voiThuLai(fn, { lan = 3 } = {}) {
  return fn();
}

// opts are for scripts/hai-nguoi-mua.js only: treMs = pause between lines, sapXep/thuLai = switch the protections off.
export async function datHang(prisma, { customer_id, items, note = null }, { treMs = 0, sapXep = true, thuLai = 3 } = {}) {
  const gio = gomGio(items, { sapXep });
  const kh = Number(customer_id);
  if (!Number.isSafeInteger(kh) || kh < 1) throw new LoiApi(400, 'BAD_INPUT', 'customer_id must be a whole number');

  // TODO C5a · ONE interactive transaction (prisma.$transaction(async (tx) => …), wrapped in voiThuLai):
  //   1 create the order (status pending)
  //   2 for every line, in gio order: take the stock with ONE atomic statement — no read-then-write.
  //       0 rows changed ⇒ throw LoiApi 409 OUT_OF_STOCK (or 400 if the product does not exist)
  //       if (treMs) await ngu(treMs) after each line (the race script uses it)
  //   3 the lines, with the price AT THE MOMENT of buying (read it from the rows you just locked)
  //   4 return { id, status: 'pending', created_at, items: <number of lines>, total: tongTien(lines) }
  throw new LoiApi(501, 'TODO', 'C5 — checkout not written yet');
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
