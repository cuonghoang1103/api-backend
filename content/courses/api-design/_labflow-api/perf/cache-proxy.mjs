// perf/cache-proxy.mjs — bài 9.1: một CACHE DÙNG CHUNG tối giản (như CDN / nginx proxy_cache) đứng trước LabFlow
//   node perf/cache-proxy.mjs 8081 4000
// Làm theo RFC 9111 vừa đủ để học: chỉ GET 200; không giữ khi có private / no-store; request có Authorization thì
// chỉ giữ khi response ghi public (§3.5); khoá cache = URL (+ giá trị các header nêu trong Vary). Báo X-Cache: HIT | MISS.
import http from 'node:http';
const [port = 8081, upstream = 4000] = process.argv.slice(2).map(Number);
const store = new Map();
const directives = (cc = '') => Object.fromEntries(cc.split(',').map((d) => d.trim().toLowerCase().split('=')).filter(([k]) => k));
http.createServer((req, res) => {
  const now = Date.now();
  for (const [k, e] of store) {                      // tìm bản còn tươi khớp URL + các header trong Vary
    if (!k.startsWith(`${req.url} `)) continue;
    if (e.vary.some((h) => (req.headers[h] ?? '') !== (e.reqHeaders[h] ?? ''))) continue;
    const age = Math.floor((now - e.at) / 1000);
    if (age >= e.maxAge) { store.delete(k); continue; }
    res.writeHead(200, { ...e.headers, age: String(age), 'x-cache': 'HIT' });
    return res.end(e.body);
  }
  const up = http.request({ port: upstream, path: req.url, method: req.method, headers: req.headers }, (r) => {
    const chunks = [];
    r.on('data', (c) => chunks.push(c));
    r.on('end', () => {
      const body = Buffer.concat(chunks);
      const cc = directives(r.headers['cache-control']);
      const maxAge = Number(cc['s-maxage'] ?? cc['max-age'] ?? 0);
      const storable = req.method === 'GET' && r.statusCode === 200 && maxAge > 0 && !('private' in cc) && !('no-store' in cc)
        && !('no-cache' in cc) && (!req.headers.authorization || 'public' in cc || 's-maxage' in cc);
      const vary = (r.headers.vary ?? '').toLowerCase().split(',').map((s) => s.trim()).filter(Boolean);
      if (storable) store.set(`${req.url} ${now}`, { at: now, maxAge, headers: r.headers, body, vary, reqHeaders: req.headers });
      res.writeHead(r.statusCode, { ...r.headers, 'x-cache': 'MISS' });
      res.end(body);
    });
  });
  req.pipe(up);
}).listen(port, () => console.log(`cache dùng chung :${port} → :${upstream}`));
