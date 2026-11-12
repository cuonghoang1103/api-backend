/**
 * ngx-05-1 — Nginx · Chapter 5 · Lesson 5.1 "Turning the cache on, and what the key is made of" (deck video + web, 12/11/2026). Bài web: nginx-5-1-bat-bo-dem.
 * Output THẬT (scratchpad/ngx/demo/n5-1.txt; nginx/1.24.0; upstream ĐẾM lượt gọi): 3 lần ⇒ MISS, HIT, HIT — vẫn "lan goi thu 1"; ?a=1 / ?a=2 ⇒ hai mục;
 * Host vidu.com rồi khach-khac.com cùng /chung ⇒ MISS rồi HIT (khoá mặc định $scheme$proxy_host$request_uri — KHÔNG có Host của client);
 * trên đĩa: tên tệp = md5(khoá), levels=1:2 ⇒ thư mục ký tự cuối / hai ký tự kế; 11 s sau (valid 10s) ⇒ EXPIRED, upstream gọi lại.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n5-1:file:/root/dem.js": "// upstream ĐẾM số lần bị gọi và in ra trong thân phản hồi (cổng 9201)\nlet n = 0;\nrequire('http').createServer((req, res) => {\n  n++; res.setHeader('Content-Type', 'text/plain');\n  res.end(`lan goi upstream thu ${n} · host=${req.headers.host} · url=${req.url}\\n`);\n}).listen(9201, '127.0.0.1');\n",
 "n5-1:file:/tmp/ng/conf/cache.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  proxy_cache_path /tmp/ng/cache levels=1:2 keys_zone=kho:10m max_size=1g inactive=60m;\n  server {\n    listen 8080;\n    add_header X-Cache-Status $upstream_cache_status always;\n    location / {\n      proxy_cache       kho;\n      proxy_cache_valid 200 10s;\n      proxy_pass http://127.0.0.1:9201;\n    }\n  }\n}\n",
 "n5-1:setup": "",
 "n5-1:bala": "$ for i in 1 2 3; do curl -s -D /tmp/h http://127.0.0.1:8080/trang | tr -d '\\n'; printf '   %s\\n' \"$(grep -i x-cache /tmp/h | tr -d '\\r')\"; done\nlan goi upstream thu 1 · host=127.0.0.1:9201 · url=/trang   X-Cache-Status: MISS\nlan goi upstream thu 1 · host=127.0.0.1:9201 · url=/trang   X-Cache-Status: HIT\nlan goi upstream thu 1 · host=127.0.0.1:9201 · url=/trang   X-Cache-Status: HIT",
 "n5-1:khoa": "$ for u in '/trang?a=1' '/trang?a=2' '/trang?a=1'; do printf '%-12s -> ' \"$u\"; curl -s -D /tmp/h \"http://127.0.0.1:8080$u\" | tr -d '\\n'; printf '   %s\\n' \"$(grep -i x-cache /tmp/h | tr -d '\\r')\"; done\n/trang?a=1   -> lan goi upstream thu 2 · host=127.0.0.1:9201 · url=/trang?a=1   X-Cache-Status: MISS\n/trang?a=2   -> lan goi upstream thu 3 · host=127.0.0.1:9201 · url=/trang?a=2   X-Cache-Status: MISS\n/trang?a=1   -> lan goi upstream thu 2 · host=127.0.0.1:9201 · url=/trang?a=1   X-Cache-Status: HIT\n=== Host KHAC, cung duong dan: khoa mac dinh la $scheme$proxy_host$request_uri ===\n$ for h in vidu.com khach-khac.com; do printf '%-16s -> ' $h; curl -s -D /tmp/h -H \"Host: $h\" http://127.0.0.1:8080/chung | tr -d '\\n'; printf '   %s\\n' \"$(grep -i x-cache /tmp/h | tr -d '\\r')\"; done\nvidu.com         -> lan goi upstream thu 4 · host=127.0.0.1:9201 · url=/chung   X-Cache-Status: MISS\nkhach-khac.com   -> lan goi upstream thu 4 · host=127.0.0.1:9201 · url=/chung   X-Cache-Status: HIT",
 "n5-1:odia": "$ find /tmp/ng/cache -type f | head -n 3\n/tmp/ng/cache/1/13/695f923dade6527e6e6324f838452131\n/tmp/ng/cache/2/6e/7997dd87aa3fc5d7b72672f2ea89c6e2\n/tmp/ng/cache/9/e3/4e6e77325d76d3173f7032bc83690e39\n$ f=$(find /tmp/ng/cache -type f | head -n 1); grep -a '^KEY:' \"$f\"\nKEY: http://127.0.0.1:9201/trang?a=2\n$ printf 'KEY: http://127.0.0.1:9201/trang' | sed 's/^KEY: //' | tr -d '\\n' | md5sum\n7997dd87aa3fc5d7b72672f2ea89c6e2  -",
 "n5-1:hethan": "$ sleep 11; curl -s -D /tmp/h http://127.0.0.1:8080/trang | tr -d '\\n'; printf '   %s\\n' \"$(grep -i x-cache /tmp/h | tr -d '\\r')\"\nlan goi upstream thu 5 · host=127.0.0.1:9201 · url=/trang   X-Cache-Status: EXPIRED"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, seq , flow } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-05-1', code: 'NGX 5.1', title: 'Turning the cache on, and what the key is made of', sub: 'Chapter 5 · Lesson 5.1' };
const O = (k) => { const v = DU_LIEU[`n5-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/\/tmp\/ng\//g, '/var/').replace(/^\$ for i in 1 2 3; do curl .*$/m, '$ for i in 1 2 3; do curl …:8080/trang; done');

export const S = [
  { cover: true, nhan: 'Chapter 5 · Lesson 5.1', t: 'Turning the cache on,<br>and what the key is made of', sub: 'Three directives put a cache in front of your app. The key decides who shares an answer — and by default it does not include the Host',
    en: 'Lesson 5.1, opening Chapter 5: a cache in front of the application. Three directives turn it on. The key decides which requests share an answer — and by default the client\'s Host is not part of it.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three directives: store, use, how long</li>
    <li>Seeing it work: X-Cache-Status and a counting upstream</li>
    <li>The key — the query is in it, the Host is NOT</li>
    <li>One file per answer: the key, hashed, on disk</li>
    <li>inactive is not a lifetime</li></ul>`,
    en: 'Five takeaways: the three directives; how to see the cache work; what the key contains; where entries live on disk; and why inactive is not a lifetime.' },
  { t: 'Three directives', body: ngc(O('file:/tmp/ng/conf/cache.conf').split('\n').slice(5, 15).map((l) => l.replace(/^ {2}/, '').replace(/\/tmp\/ng\//g, '/var/')).join('\n'), { sm: true, hl: [1, 6, 7] }) +
    icards([
      ['db', 'proxy_cache_path', 'the STORE: a folder + a shared-memory zone (http level only)'],
      ['box', 'proxy_cache kho', 'USE that store in this location'],
      ['clock', 'proxy_cache_valid 200 10s', 'HOW LONG a 200 counts as fresh'],
    ], 3),
    en: 'Three directives. proxy cache path declares the store: a folder on disk and a shared memory zone, at the http level only. proxy cache uses that store in a location. proxy cache valid says how long a 200 stays fresh.' },
  { t: 'Seeing it work', body: tn(bo(O('bala')), { fs: 15 }) +
    seq(['client', 'nginx (cache)', 'upstream'], [[0, 1, '1st GET /trang'], [1, 2, 'MISS → ask', '#c0392b'], [2, 1, '"lan goi thu 1" — stored', '#2f9d58', true], [0, 1, '2nd, 3rd GET /trang'], [1, 0, 'HIT — from disk, upstream not called', '#2f9d58', true]], { rh: 40, fs: 16 }),
    en: 'Seeing it work. The upstream counts how often it is called. Three requests: MISS, then HIT, HIT — and the body still says call number one. The upstream was asked once; the next two answers came from the cache.' },
  { t: 'The key: the query is in it, the Host is NOT', body: tn(bo(O('khoa')).replace(/^\$ for u in .*$/m, '$ for u in /trang?a=1 /trang?a=2 /trang?a=1; do curl …; done').replace(/^\$ for h in .*$/m, '$ for h in vidu.com khach-khac.com; do curl -H "Host: $h" …/chung; done'), { fs: 14, wrap: 120 }) +
    two(box('Query string = a different entry', '<code>?a=1</code> and <code>?a=2</code> were two MISSes. Tracking parameters (<code>?utm_…</code>) split your cache the same way.', 'lam'),
      box('Two sites, ONE entry', 'The default key is <code>$scheme$proxy_host$request_uri</code> — the UPSTREAM address, not the Host the client typed. <code>khach-khac.com</code> got <code>vidu.com</code>\'s answer.', 'do2')),
    en: 'The key. A different query string made a different entry. But two different Hosts, same path, shared one entry: the default key uses proxy host — the upstream address — not the Host the client sent. If one upstream serves several sites, add the Host to the key.' },
  { t: 'One file per answer — the key, hashed', body: tn(bo(O('odia')), { fs: 15 }) +
    cmp(['Part', 'Measured', 'Meaning'], [
      ['file name', '<code>7997dd87…ea89c6e2</code>', 'md5 of the key, character for character'],
      ['<code>levels=1:2</code>', '<code>2/6e/</code>', 'last char, then the two before it — no folder with a million files'],
      ['inside the file', '<code>KEY: http://127.0.0.1:9201/…</code>', 'the key in clear text, then headers and body'],
    ]),
    en: 'On disk: one file per cached answer. The file name is the md5 of the key — we computed it and it matched. levels one colon two makes the folders from the last characters of that hash. Inside the file, the key in clear text, then headers and body.' },
  { t: 'Fresh, then EXPIRED — and inactive is something else', body: tn(bo(O('hethan')), { fs: 16 }) +
    cmp(['Setting', 'What it controls'], [
      ['<code>proxy_cache_valid 200 10s</code>', 'how long an entry is FRESH (then EXPIRED → ask upstream again)'],
      ['<code>inactive=60m</code>', 'delete an entry nobody has asked for in 60 minutes — fresh or not'],
      ['<code>max_size=1g</code>', 'the disk cap; the cache manager evicts the least recently used'],
    ], { hl: [2] }) + flow([
      { t: 'MISS', s: 't = 0 · stored' }, { t: 'HIT', s: 'fresh for 10 s' },
      { t: 'EXPIRED', s: 't = 11 s · asked again', mau: '#e0590b' }, { t: 'deleted', s: '60 min with no request', mau: '#64748b' }], { h: 150 }),
    en: 'After eleven seconds, past the ten-second validity: EXPIRED, and the upstream was called again — call number five. inactive is different: it deletes entries nobody asked for, fresh or not. max size caps the disk.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('proxy_cache_path', 'the store: folder + keys_zone'),
      kw('keys_zone', 'shared memory for keys (~8,000 per MB)'),
      kw('proxy_cache_valid', 'freshness per status code'),
      kw('Cache key', '$scheme$proxy_host$request_uri by default'),
      kw('$upstream_cache_status', 'MISS · HIT · EXPIRED · STALE …'),
      kw('inactive', 'delete if unused — not a lifetime'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: proxy cache path, keys zone, proxy cache valid, the cache key, upstream cache status, and inactive.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Write a counting upstream; put ${c('proxy_cache')} in front`,
      `Add ${c('X-Cache-Status')}; request three times`,
      `Change only the query; then only the Host`,
      `Find the file; check its name with ${c('md5sum')}`,
      `Wait past ${c('proxy_cache_valid')}; read the status`,
    ]), box('Keep these', `<ul><li>Store · use · how long</li><li>Always expose X-Cache-Status</li><li>The default key ignores Host</li><li>inactive ≠ lifetime</li></ul>`, 'lam'), ''),
    en: 'Your turn: build a counting upstream behind the cache, expose the status, vary the query and then the Host, find the file on disk, and wait past the validity. Keep: store, use, how long; always expose the status; the default key ignores the Host; inactive is not a lifetime.' },
];
export const slides = lamDeck({ chuong: 'Chapter 5 — A cache in front of the app', bai: '5.1' }, S);
