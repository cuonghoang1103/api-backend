// Products for the app's catalogue screen: newest first, optional search, KEYSET pagination.
import { Router } from 'express';
import { LoiApi, soNguyen } from '../loi.js';

const COT = { id: true, sku: true, name: true, price: true, stock: true, category: { select: { name: true } } };

export function routerProducts(prisma) {
  const r = Router();

  // GET /products?q=bút&page=2 — v1, ALREADY IN PRODUCTION: newest first, 12 per page, OFFSET pagination.
  // TODO C3b · replace ?page with KEYSET pagination: ?before=<id>&limit=12, answer { items, next } (next = the last id, or null).
  //            Prove with a product added between two page loads that OFFSET shows one product twice and keyset does not.
  r.get('/products', async (req, res) => {
    const page = soNguyen(req.query.page, 'page') ?? 1;
    const q = String(req.query.q ?? '').trim();
    const items = await prisma.product.findMany({
      where: { is_active: true, ...(q && { name: { contains: q, mode: 'insensitive' } }) },
      orderBy: { id: 'desc' },
      skip: (page - 1) * 12,
      take: 12,
      select: COT,
    });
    res.json({ page, items });
  });

  r.get('/products/:id', async (req, res) => {
    const id = soNguyen(req.params.id, 'id');
    const p = await prisma.product.findUnique({ where: { id }, select: { ...COT, attrs: true, is_active: true } });
    if (!p) throw new LoiApi(404, 'NOT_FOUND', `no product ${id}`);
    res.json(p);
  });

  return r;
}
