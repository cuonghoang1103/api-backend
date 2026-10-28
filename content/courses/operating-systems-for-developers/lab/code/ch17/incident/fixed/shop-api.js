// shop-api.js — ĐÃ SỬA (lời giải mẫu 17.3, sự cố 1: rò bộ nhớ ⇒ OOM exit 137).
// Hai lỗi chồng nhau: (1) khoá cache gồm cả ?t=… ngẫu nhiên ⇒ mỗi request một khoá mới, không bao giờ trúng;
// (2) cache không có giới hạn ⇒ lớn tới khi chạm memory.max của container (192 MiB) và nhân giết tiến trình.
const http = require('node:http');
const MAX = 500;                               // tối đa 500 trang × 64 KB ≈ 32 MB — chọn THEO giới hạn của container
const cache = new Map();                       // Map giữ thứ tự chèn ⇒ dùng làm LRU đơn giản

function render(id) {
  const page = Buffer.alloc(64 * 1024, 'x');
  page.write(JSON.stringify({ id, name: 'Product ' + id, price: (id % 97) * 1000 }));
  return page;
}

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://x');
  if (u.pathname === '/healthz') return res.end('ok\n');
  if (u.pathname === '/product') {
    const id = Number(u.searchParams.get('id')) || 0;
    const key = 'p:' + id;                     // khoá = thứ quyết định NỘI DUNG trang, không phải cả url
    let page = cache.get(key);
    if (page) { cache.delete(key); cache.set(key, page); }          // trúng ⇒ đưa lên "mới dùng"
    else {
      page = render(id); cache.set(key, page);
      if (cache.size > MAX) cache.delete(cache.keys().next().value); // vượt trần ⇒ bỏ trang lâu không dùng nhất
    }
    res.setHeader('Content-Type', 'application/json');
    return res.end(page.subarray(0, 64));
  }
  if (u.pathname === '/stats') return res.end(JSON.stringify({ cached: cache.size, rssMiB: Math.round(process.memoryUsage().rss / 2 ** 20) }) + '\n');
  res.statusCode = 404; res.end('not found\n');
}).listen(3000, () => console.log('shop-api listening on 3000'));
