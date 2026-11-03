// chay: tay — a small REST API for Chapter 6, with no libraries (Node 22). Run: node server.mjs  → http://localhost:3456
import http from 'node:http';
import crypto from 'node:crypto';

let products = [
  { id: 1, name: 'Notebook', price: 25000, category: 'office' },
  { id: 2, name: 'Desk lamp', price: 320000, category: 'home' },
  { id: 3, name: 'Pen', price: 5000, category: 'office' },
  { id: 4, name: 'Mug', price: 60000, category: 'home' },
  { id: 5, name: 'Stapler', price: 45000, category: 'office' },
];
let nextId = 6;
const hits = new Map();                                   // for the rate-limit demo

function send(res, status, data, headers = {}) {
  const body = data === undefined ? '' : JSON.stringify(data);
  res.writeHead(status, { ...(body && { 'Content-Type': 'application/json; charset=utf-8' }), ...headers });
  res.end(body);
}
function readJson(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => {
      try { resolve({ ok: true, data: JSON.parse(raw) }); } catch { resolve({ ok: false }); }
    });
  });
}
function validate(p, partial = false) {
  const errors = [];
  if (!partial || 'name' in p) if (typeof p.name !== 'string' || p.name.trim() === '') errors.push('name is required');
  if (!partial || 'price' in p) if (!Number.isInteger(p.price) || p.price < 0) errors.push('price must be a whole number ≥ 0');
  return errors;
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost');
  const parts = url.pathname.split('/').filter(Boolean);    // ['api', 'products', '3']
  console.log(req.method, req.url);

  if (url.pathname === '/old-products') return send(res, 301, undefined, { Location: '/api/products' });
  if (url.pathname === '/api/crash') return send(res, 500, { error: 'Something went wrong on our side' });
  if (url.pathname === '/api/admin/stats') {
    const auth = req.headers.authorization;
    if (!auth) return send(res, 401, { error: 'Log in first' }, { 'WWW-Authenticate': 'Bearer' });
    if (auth !== 'Bearer admin-token') return send(res, 403, { error: 'Admins only' });
    return send(res, 200, { products: products.length });
  }
  if (url.pathname === '/api/limited') {
    const n = (hits.get('demo') ?? 0) + 1;
    hits.set('demo', n);
    if (n > 3) return send(res, 429, { error: 'Too many requests' }, { 'Retry-After': '60' });
    return send(res, 200, { ok: true, request: n });
  }

  if (parts[0] !== 'api' || parts[1] !== 'products' || parts.length > 3) return send(res, 404, { error: 'Not found' });
  const id = parts[2] ? Number(parts[2]) : null;

  // /api/products  (the collection)
  if (id === null) {
    if (req.method === 'GET' || req.method === 'HEAD') {
      let list = products;
      const category = url.searchParams.get('category');
      if (category) list = list.filter((p) => p.category === category);
      const q = url.searchParams.get('q');
      if (q) list = list.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
      const sort = url.searchParams.get('sort');                       // price or -price
      if (sort === 'price') list = list.toSorted((a, b) => a.price - b.price);
      if (sort === '-price') list = list.toSorted((a, b) => b.price - a.price);
      const limit = Math.min(Number(url.searchParams.get('limit') ?? 10), 50);
      const page = Math.max(Number(url.searchParams.get('page') ?? 1), 1);
      const items = list.slice((page - 1) * limit, page * limit);
      if ((req.headers.accept ?? '').includes('text/csv')) {
        res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8' });
        return res.end('id,name,price\n' + items.map((p) => `${p.id},${p.name},${p.price}`).join('\n') + '\n');
      }
      return send(res, 200, { items, page, limit, total: list.length });
    }
    if (req.method === 'POST') {
      if (!(req.headers['content-type'] ?? '').startsWith('application/json')) return send(res, 415, { error: 'Send JSON' });
      const body = await readJson(req);
      if (!body.ok) return send(res, 400, { error: 'Body is not valid JSON' });
      const errors = validate(body.data);
      if (errors.length) return send(res, 422, { errors });
      const product = { id: nextId++, name: body.data.name, price: body.data.price, category: body.data.category ?? 'other' };
      products.push(product);
      return send(res, 201, product, { Location: `/api/products/${product.id}` });
    }
    return send(res, 405, { error: 'Method not allowed' }, { Allow: 'GET, HEAD, POST' });
  }

  // /api/products/:id  (one item)
  const index = products.findIndex((p) => p.id === id);
  if (index === -1) return send(res, 404, { error: `Product ${parts[2]} not found` });
  const product = products[index];
  if (req.method === 'GET' || req.method === 'HEAD') {
    const etag = '"' + crypto.createHash('sha1').update(JSON.stringify(product)).digest('hex').slice(0, 12) + '"';
    if (req.headers['if-none-match'] === etag) { res.writeHead(304, { ETag: etag }); return res.end(); }
    return send(res, 200, product, { ETag: etag, 'Cache-Control': 'no-cache' });
  }
  if (req.method === 'PUT' || req.method === 'PATCH') {
    const body = await readJson(req);
    if (!body.ok) return send(res, 400, { error: 'Body is not valid JSON' });
    const errors = validate(body.data, req.method === 'PATCH');
    if (errors.length) return send(res, 422, { errors });
    products[index] = req.method === 'PUT'
      ? { id, name: body.data.name, price: body.data.price, category: body.data.category ?? 'other' }   // replace all
      : { ...product, ...body.data, id };                                                              // change some
    return send(res, 200, products[index]);
  }
  if (req.method === 'DELETE') {
    products = products.filter((p) => p.id !== id);
    res.writeHead(204);
    return res.end();
  }
  return send(res, 405, { error: 'Method not allowed' }, { Allow: 'GET, HEAD, PUT, PATCH, DELETE' });
});
server.listen(3456, () => console.log('API on http://localhost:3456'));
