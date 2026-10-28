// shop-api.js — API cửa hàng (cổng 3000). Trang sản phẩm "dựng" mất công nên được CACHE trong bộ nhớ.
const http = require('node:http');
const cache = new Map();                       // url -> trang đã dựng

function render(id) {                          // giả một trang sản phẩm ~64 KB (ảnh base64, mô tả, đánh giá…)
  const page = Buffer.alloc(64 * 1024, 'x');
  page.write(JSON.stringify({ id, name: 'Product ' + id, price: (id % 97) * 1000 }));
  return page;
}

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/healthz') return res.end('ok\n');
  if (u.pathname === '/product') {
    let page = cache.get(req.url);             // khoá cache = CẢ url, gồm cả ?t=… mà frontend gắn để chống cache trình duyệt
    if (!page) { page = render(Number(u.searchParams.get('id')) || 0); cache.set(req.url, page); }
    res.setHeader('Content-Type', 'application/json');
    return res.end(page.subarray(0, 64));
  }
  if (u.pathname === '/stats') return res.end(JSON.stringify({ cached: cache.size, rssMiB: Math.round(process.memoryUsage().rss / 2 ** 20) }) + '\n');
  res.statusCode = 404; res.end('not found\n');
}).listen(3000, () => console.log('shop-api listening on 3000'));
