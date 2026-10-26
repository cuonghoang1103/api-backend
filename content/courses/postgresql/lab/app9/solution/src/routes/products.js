// Products for the app's catalogue screen: newest first, optional search, KEYSET pagination.
import { Router } from 'express';
import { LoiApi, soNguyen } from '../loi.js';

const COT = { id: true, sku: true, name: true, price: true, stock: true, category: { select: { name: true } } };

export function routerProducts(prisma) {
  const r = Router();

  // GET /products?q=bút&limit=12&before=40
  //   keyset: "the 12 newest products with id < 40" — the client sends back the last id it saw (`next`).
  //   NOT offset (?page=2 ⇒ skip 12): a product added between two page loads shifts every offset page by one.
  r.get('/products', async (req, res) => {
    const limit = soNguyen(req.query.limit, 'limit', { max: 50 }) ?? 12;
    const before = soNguyen(req.query.before, 'before');
    const q = String(req.query.q ?? '').trim();
    const rows = await prisma.product.findMany({
      where: {
        is_active: true,
        ...(q && { name: { contains: q, mode: 'insensitive' } }),   // ⇒ ILIKE '%q%' (Lab 7 has the accent-free, typo-tolerant search)
        ...(before && { id: { lt: before } }),
      },
      orderBy: { id: 'desc' },
      take: limit + 1,                                            // one extra row = "is there a next page?"
      select: COT,
    });
    const items = rows.slice(0, limit);
    res.json({ items, next: rows.length > limit ? items.at(-1).id : null });
  });

  r.get('/products/:id', async (req, res) => {
    const id = soNguyen(req.params.id, 'id');
    const p = await prisma.product.findUnique({ where: { id }, select: { ...COT, attrs: true, is_active: true } });
    if (!p) throw new LoiApi(404, 'NOT_FOUND', `no product ${id}`);
    res.json(p);
  });

  return r;
}
