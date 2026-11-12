/**
 * ngx-04-2 — Nginx · Chapter 4 · Lesson 4.2 "ETag is built from mtime, and that is why deploys break caching" (deck video + web, 12/11/2026). Bài web: nginx-4-2-etag-va-bo-dem.
 * Output THẬT (scratchpad/ngx/demo/n4-2.txt; nginx/1.24.0): ETag "6a8b27b3-6992" = hex(mtime)-hex(size) khớp từng ký tự; touch ⇒ md5 y hệt, ETag đổi,
 * ETag cũ ⇒ 200 tải lại 27026 byte; If-None-Match / If-Modified-Since đúng ⇒ 304 0 byte; ETag SAI + ngày ĐÚNG ⇒ 200 (ETag thắng); etag off ⇒ 0 dòng ETag;
 * expires: mặc định/off ⇒ không Cache-Control; -1 ⇒ no-cache; 0 ⇒ max-age=0; 30d; max ⇒ 2037; 1y + add_header ⇒ HAI dòng Cache-Control.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n4-2:file:/tmp/ng/conf/etag.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  include /etc/nginx/mime.types;\n  access_log off;\n  server { listen 8080; root /tmp/ng/www; }\n  server { listen 8081; root /tmp/ng/www; etag off; }\n  server {\n    listen 8082; root /tmp/ng/www;\n    location /mac-dinh/ { alias /tmp/ng/www/; }\n    location /off/      { alias /tmp/ng/www/; expires off; }\n    location /am1/      { alias /tmp/ng/www/; expires -1; }\n    location /khong/    { alias /tmp/ng/www/; expires 0; }\n    location /30d/      { alias /tmp/ng/www/; expires 30d; }\n    location /max/      { alias /tmp/ng/www/; expires max; }\n    location /ca-hai/   { alias /tmp/ng/www/; expires 1y; add_header Cache-Control \"public, max-age=31536000, immutable\" always; }\n  }\n}\n",
 "n4-2:setup": "",
 "n4-2:mo": "$ curl -sI http://127.0.0.1:8080/trang.html | grep -E '^(ETag|Last-Modified)'\nLast-Modified: Sun, 23 Aug 2026 17:02:43 GMT\nETag: \"6a8b27b3-6992\"\n$ printf 'hex(mtime)-hex(size) = %x-%x\\n' $(stat -c '%Y %s' /tmp/ng/www/trang.html)\nhex(mtime)-hex(size) = 6a8b27b3-6992",
 "n4-2:touch": "$ md5sum /tmp/ng/www/trang.html; curl -sI http://127.0.0.1:8080/trang.html | grep ETag\nd0d64a23c28d66fdec7065b70db03d85  /tmp/ng/www/trang.html\nETag: \"6a8b27b3-6992\"\n$ touch /tmp/ng/www/trang.html\n$ md5sum /tmp/ng/www/trang.html; curl -sI http://127.0.0.1:8080/trang.html | grep ETag\nd0d64a23c28d66fdec7065b70db03d85  /tmp/ng/www/trang.html\nETag: \"6af5c561-6992\"\n=== client cu gui lai ETag CU ===\n$ curl -s -o /dev/null -w 'ma=%{http_code}  tai=%{size_download} byte\\n' -H 'If-None-Match: \"6a8b27b3-6992\"' http://127.0.0.1:8080/trang.html\nma=200  tai=27026 byte",
 "n4-2:dieukien": "$ curl -s -o /dev/null -w 'khong dieu kien          -> %{http_code}, %{size_download} byte\\n' http://127.0.0.1:8080/trang.html\nkhong dieu kien          -> 200, 27026 byte\n$ curl -s -o /dev/null -w 'If-None-Match dung       -> %{http_code}, %{size_download} byte\\n' -H 'If-None-Match: \"6a8b27b3-6992\"' http://127.0.0.1:8080/trang.html\nIf-None-Match dung       -> 304, 0 byte\n$ curl -s -o /dev/null -w 'If-Modified-Since dung   -> %{http_code}, %{size_download} byte\\n' -H 'If-Modified-Since: Sun, 23 Aug 2026 17:02:43 GMT' http://127.0.0.1:8080/trang.html\nIf-Modified-Since dung   -> 304, 0 byte\n$ curl -s -o /dev/null -w 'ETag SAI + ngay DUNG     -> %{http_code}, %{size_download} byte\\n' -H 'If-None-Match: \"khac\"' -H 'If-Modified-Since: Sun, 23 Aug 2026 17:02:43 GMT' http://127.0.0.1:8080/trang.html\nETag SAI + ngay DUNG     -> 200, 27026 byte\n$ curl -sI http://127.0.0.1:8081/trang.html | grep -cE '^ETag'\n0",
 "n4-2:expires": "$ for p in mac-dinh off am1 khong 30d max ca-hai; do echo \"--- expires $p\"; curl -sI http://127.0.0.1:8082/$p/trang.html | grep -E '^(Expires|Cache-Control)' ; done\n--- expires mac-dinh\n--- expires off\n--- expires am1\nExpires: Thu, 12 Nov 2026 13:55:45 GMT\nCache-Control: no-cache\n--- expires khong\nExpires: Thu, 12 Nov 2026 13:55:46 GMT\nCache-Control: max-age=0\n--- expires 30d\nExpires: Sat, 12 Dec 2026 13:55:46 GMT\nCache-Control: max-age=2592000\n--- expires max\nExpires: Thu, 31 Dec 2037 23:55:55 GMT\nCache-Control: max-age=315360000\n--- expires ca-hai\nExpires: Fri, 12 Nov 2027 13:55:47 GMT\nCache-Control: max-age=31536000\nCache-Control: public, max-age=31536000, immutable"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-04-2', code: 'NGX 4.2', title: 'ETag is built from mtime, and that is why deploys break caching', sub: 'Chapter 4 · Lesson 4.2' };
const O = (k) => { const v = DU_LIEU[`n4-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/\/tmp\/ng\//g, '/srv/');

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.2', t: 'ETag is built from mtime,<br>and that is why deploys break caching', sub: 'After a deploy, returning visitors re-download files whose bytes never changed. Here is exactly why',
    en: 'Lesson 4.2. Browser caching rests on two validators Nginx makes for you. What they are made of explains a symptom almost every site has: after a deploy, visitors re-download files that did not change.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What an ETag is made of — checked character by character</li>
    <li>Why touch alone forces a full re-download</li>
    <li>304: both conditional forms, and which one wins</li>
    <li>Every form of expires, measured</li>
    <li>The two Cache-Control headers nobody notices</li></ul>`,
    en: 'Five takeaways: what an ETag is made of; why touching a file forces a re-download; the two conditional request forms; every form of expires; and the duplicate Cache-Control header.' },
  { t: 'An ETag is mtime and size — nothing else', body: tn(bo(O('mo')), { fs: 17 }) +
    two(box('No content is read', 'It is the modification time and the size in hex, joined by a hyphen. Cheap to compute — and blind to the bytes.', 'lam'),
      box('So it answers a different question', 'Not "is this the same content?" but "is this the same file metadata?"', 'do2')),
    en: 'The ETag, side by side with hex of the modification time, a hyphen, and hex of the size: identical, character for character. Nothing about the contents is read. It answers whether the metadata is the same, not whether the content is.' },
  { t: 'touch: same bytes, new ETag, full download', body: tn(bo(O('touch')), { fs: 15 }) +
    icards([
      ['check', 'md5 identical', 'not one byte changed'],
      ['warn', 'ETag changed', 'only the mtime moved'],
      ['bolt', '200, 27026 bytes', 'the old ETag no longer matches — the whole file again'],
    ], 3),
    en: 'touch the file. The md5 is identical, not a byte changed. The ETag changed anyway. A client that sends the old ETag gets 200 and downloads all 27 thousand bytes again.' },
  { t: 'Every deploy is a touch', body: cmp(['How files arrive', 'mtime after', 'Effect on returning visitors'], [
      ['<code>git clone</code> / <code>git checkout</code>', 'NOW', 'every asset re-downloaded'],
      ['<code>rsync</code> without <code>-t</code> / <code>-a</code>', 'NOW', 'every asset re-downloaded'],
      ['Dockerfile <code>COPY</code>, <code>tar -x</code>', 'KEPT (measured)', 'harmless — unless the source was a fresh clone'],
      ['two servers deployed seconds apart', 'DIFFERENT on each', 'a client bouncing between them never gets a 304'],
    ], { hl: [4] }) + box('The real fix is not the ETag', 'Put a content hash in the FILE NAME (<code>app.4f9a2c.js</code>) and cache it for a year with <code>immutable</code> — then no request is sent at all.', 'xanh'),
    en: 'Every deploy is a touch. A git clone or an rsync without dash t stamps the current time. Docker COPY and tar keep the mtime they find — measured — but in CI what they find is a fresh clone. Behind a load balancer, two servers deployed seconds apart give different ETags for the same bytes. The real fix is a content hash in the file name, cached for a year.' },
  { t: 'Conditional requests, measured', body: tn(O('dieukien').replace(/^\$ curl -sI http:\/\/127\.0\.0\.1:8081.*$/m, '$ curl -sI …:8081/trang.html | grep -c ETag      # etag off'), { fs: 14, wrap: 120 }) +
    box('When both are sent, the ETag decides', 'A wrong ETag with a correct date gave 200: If-None-Match wins. And a 304 still costs a round trip — it saves bytes, not time.', 'lam'),
    en: 'Conditional requests. If-None-Match with the right ETag: 304, zero bytes. If-Modified-Since with the right date: 304. A wrong ETag together with the right date: 200 — the ETag decides. And a 304 still costs a round trip: it saves bytes, not time.' },
  { t: 'expires, every form', body: two(tn(O('expires').replace(/^\$ for p in .*$/m, '$ for p in mac-dinh off am1 khong 30d max ca-hai; do curl -sI …/$p/trang.html; done'), { fs: 13, wrap: 64 }),
      cmp(['You write', 'You get'], [
        ['nothing / <code>expires off</code>', 'NO Cache-Control — the browser guesses'],
        ['<code>expires -1</code>', '<code>no-cache</code>'],
        ['<code>expires 0</code>', '<code>max-age=0</code>'],
        ['<code>expires 30d</code>', '<code>max-age=2592000</code>'],
        ['<code>expires max</code>', 'year 2037, ten years'],
        ['<code>expires 1y</code> + <code>add_header</code>', '<b>TWO</b> Cache-Control lines'],
      ], { hl: [6] }), 'r64'),
    en: 'Every form of expires. With nothing set, there is no Cache-Control at all, and the browser guesses. Minus one gives no-cache, zero gives max-age zero, thirty days and max as expected. And expires one year plus an add header Cache-Control sends two Cache-Control lines.' },
  { t: 'Trap: expires + add_header = two headers', body: ngc(`location /tinh/ {
  expires 1y;                                                     # module 1: Cache-Control: max-age=31536000
  add_header Cache-Control "public, max-age=31536000, immutable";  # module 2: a SECOND Cache-Control
}`, { sm: true, hl: [2] }) + tn(O('expires').split('--- expires ca-hai')[1].trim(), { fs: 16 }) +
    two(box('They never merge', 'Two modules, neither knows about the other. Which line a client honours is not something to depend on.', 'do2'),
      box('Pick one', 'Keep only the add_header line: <code>immutable</code> is the part that matters, and <code>expires</code> cannot say it.', 'xanh')),
    en: 'The trap: expires and add header Cache-Control come from two different modules and never merge, so two Cache-Control lines go out. Keep only the add header line, because immutable is what matters and expires cannot express it.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('ETag', 'hex(mtime)-hex(size) — metadata, not content'),
      kw('Last-Modified', 'the mtime, one-second resolution'),
      kw('If-None-Match', 'sends the ETag back; wins over the date'),
      kw('304 Not Modified', 'empty body — bytes saved, round trip not'),
      kw('expires', 'sets Expires + Cache-Control: max-age'),
      kw('immutable', 'never revalidate — safe only with hashed names'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: ETag, Last-Modified, If-None-Match, 304 Not Modified, expires, and immutable.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Compute ${c('hex(mtime)-hex(size)')} and compare with the ETag`,
      `${c('touch')} the file; send the old ETag back`,
      `Send a wrong ETag with a correct date`,
      `Try every ${c('expires')} form; count Cache-Control lines`,
      `Check one asset's ETag before and after your next deploy`,
    ]), box('Keep these', `<ul><li>ETag = mtime + size</li><li>Deploys reset mtime</li><li>Hash in the file name</li><li>expires OR add_header, never both</li></ul>`, 'lam'), ''),
    en: 'Your turn: rebuild the ETag by hand, touch the file and resend the old ETag, mix a wrong ETag with a right date, try every expires form, and check one asset across your next deploy. Keep: the ETag is metadata, deploys reset it, hash the file name, and never combine expires with add header.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Static files', bai: '4.2' }, S);
