/**
 * ngx-04-5 — Nginx · Chapter 4 · Lesson 4.5 "A production static block, assembled and measured" (deck video + web, 12/11/2026). Bài web: nginx-4-5-khoi-tinh-production.
 * Output THẬT (scratchpad/ngx/demo/n4-5.txt; nginx/1.24.0): /tinh/ băm ⇒ 200 gzip, W/ ETag, Cache-Control 1 năm immutable, nosniff; /index.html ⇒ no-cache;
 * đường SPA ⇒ CÙNG ETag index.html + no-cache (try_files chuyển nội bộ rồi khớp lại = /index.html); /tai-len/ ⇒ octet-stream + attachment + nosniff,
 * kể cả la.html chứa <script>; /tinh/khong-co.js ⇒ 404 MANG Cache-Control 1 năm immutable (vì "always"); bỏ "always" ⇒ 404 hết Cache-Control, 200 còn.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n4-5:file:/tmp/ng/conf/site.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  include       /etc/nginx/mime.types;\n  default_type  application/octet-stream;\n  access_log    off;\n  sendfile on; tcp_nopush on; tcp_nodelay on;\n  open_file_cache max=10000 inactive=60s;\n  open_file_cache_valid 30s;\n  open_file_cache_min_uses 2;\n  open_file_cache_errors on;\n  gzip on; gzip_vary on; gzip_comp_level 5; gzip_min_length 256;\n  gzip_types text/css application/javascript application/json image/svg+xml;\n  gzip_static on;\n\n  server {\n    listen 8080;\n    root /tmp/ng/site;\n    location /tinh/ {\n      add_header Cache-Control \"public, max-age=31536000, immutable\" always;   # \"always\" — xem 404 bên dưới\n      add_header X-Content-Type-Options \"nosniff\" always;\n      try_files $uri =404;\n    }\n    location /tai-len/ {\n      types { }\n      default_type application/octet-stream;\n      add_header Content-Disposition \"attachment\" always;\n      add_header X-Content-Type-Options \"nosniff\" always;\n      add_header Cache-Control \"public, max-age=604800\";\n      try_files $uri =404;\n    }\n    location = /index.html {\n      add_header Cache-Control \"no-cache\";\n      add_header X-Content-Type-Options \"nosniff\" always;\n    }\n    location / { try_files $uri $uri/ /index.html; }\n  }\n}\n",
 "n4-5:file:/root/xem.sh": "# xem.sh <đường dẫn> — mã + vài header quan trọng\ncurl -s -o /dev/null -D - -H 'Accept-Encoding: gzip' \"http://127.0.0.1:${CONG:-8080}$1\" | tr -d '\\r' | grep -E '^(HTTP|Content-Type|Content-Encoding|Cache-Control|Content-Disposition|X-Content-Type-Options|ETag)' | sed \"s#^#  #\"\n",
 "n4-5:setup": "",
 "n4-5:tuyen": "$ for u in /tinh/app.4f9a2c.js /index.html /trang/bat-ky /tai-len/anh.jpg /tai-len/la.html /tinh/khong-co.js; do echo \"== $u\"; bash xem.sh $u; done\n== /tinh/app.4f9a2c.js\n  HTTP/1.1 200 OK\n  Content-Type: application/javascript\n  ETag: W/\"6af5c6b4-1bc6b\"\n  Cache-Control: public, max-age=31536000, immutable\n  X-Content-Type-Options: nosniff\n  Content-Encoding: gzip\n== /index.html\n  HTTP/1.1 200 OK\n  Content-Type: text/html\n  ETag: \"6af5c6b4-4d\"\n  Cache-Control: no-cache\n  X-Content-Type-Options: nosniff\n== /trang/bat-ky\n  HTTP/1.1 200 OK\n  Content-Type: text/html\n  ETag: \"6af5c6b4-4d\"\n  Cache-Control: no-cache\n  X-Content-Type-Options: nosniff\n== /tai-len/anh.jpg\n  HTTP/1.1 200 OK\n  Content-Type: application/octet-stream\n  ETag: \"6af5c6b4-1388\"\n  Content-Disposition: attachment\n  X-Content-Type-Options: nosniff\n  Cache-Control: public, max-age=604800\n== /tai-len/la.html\n  HTTP/1.1 200 OK\n  Content-Type: application/octet-stream\n  ETag: \"6af5c6b4-28\"\n  Content-Disposition: attachment\n  X-Content-Type-Options: nosniff\n  Cache-Control: public, max-age=604800\n== /tinh/khong-co.js\n  HTTP/1.1 404 Not Found\n  Content-Type: text/html\n  Cache-Control: public, max-age=31536000, immutable\n  X-Content-Type-Options: nosniff",
 "n4-5:bo-always": "$ grep -n 'immutable' /tmp/ng/conf/site.conf\n21:      add_header Cache-Control \"public, max-age=31536000, immutable\";\n$ for u in /tinh/khong-co.js /tinh/app.4f9a2c.js; do echo \"== $u\"; bash xem.sh $u; done\n== /tinh/khong-co.js\n  HTTP/1.1 404 Not Found\n  Content-Type: text/html\n  X-Content-Type-Options: nosniff\n== /tinh/app.4f9a2c.js\n  HTTP/1.1 200 OK\n  Content-Type: application/javascript\n  ETag: W/\"6af5c6b4-1bc6b\"\n  Cache-Control: public, max-age=31536000, immutable\n  X-Content-Type-Options: nosniff\n  Content-Encoding: gzip"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-04-5', code: 'NGX 4.5', title: 'A production static block, assembled and measured', sub: 'Chapter 4 · Lesson 4.5' };
const O = (k) => { const v = DU_LIEU[`n4-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const CONF = () => O('file:/tmp/ng/conf/site.conf').split('\n');
const KHOI = (tu, den) => CONF().slice(tu, den).map((l) => l.replace(/^ {4}/, '').replace(/\/tmp\/ng\//g, '/srv/')).join('\n');
const TUYEN = (u) => { const s = O('tuyen'); const a = s.indexOf(`== ${u}\n`); const b = s.indexOf('\n== ', a + 3); return s.slice(a, b < 0 ? undefined : b); };

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.5', t: 'A production static block,<br>assembled and measured', sub: 'Everything in this chapter in one server block — then every route requested, and one bug found by measuring',
    en: 'Lesson 4.5. Everything this chapter measured, assembled into one production server block. Then every route is requested for real — and one bug turns up that only measuring finds.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The http block: types, sendfile, cache, gzip</li>
    <li>Four locations, four caching policies</li>
    <li>Uploads that can never render as a page</li>
    <li>An SPA path that inherits the HTML policy</li>
    <li>The 404 cached for a year — and the word that caused it</li></ul>`,
    en: 'Five takeaways: the shared http settings; four locations with four caching policies; uploads that never render; an SPA path that inherits the HTML policy; and a 404 cached for a year.' },
  { t: 'The http block: everything from 4.1 to 4.4', body: ngc(CONF().slice(4, 15).map((l) => l.replace(/^ {2}/, '')).join('\n'), { sm: true, hl: [2, 4, 5, 9, 11] }) +
    icards([['type', '4.1', 'octet-stream for unknown types'], ['bolt', '4.4', 'sendfile + a file cache'], ['box', '4.3', 'gzip, and .gz files when present']], 3),
    en: 'The shared http block: default type octet-stream from Lesson 4.1, sendfile and the open file cache from 4.4, gzip with gzip static from 4.3.' },
  { t: 'Four locations, four policies', body: ngc(KHOI(19, 32).split('\n').map((l) => l.replace(/\s+#.*$/, '')).join('\n'), { sm: true, hl: [2, 7, 9] }) +
    two(ngc(KHOI(32, 37), { sm: true, hl: [2, 5] }), cmp(['Location', 'Cache-Control'], [
      ['<code>/tinh/</code>', '1 year, immutable'],
      ['<code>/tai-len/</code>', '7 days + attachment'],
      ['<code>= /index.html</code>', 'no-cache'],
      ['<code>/</code> (SPA)', '→ index.html'],
    ]), 'r64'),
    en: 'Four locations, four caching policies. Hashed assets: one year, immutable. User uploads: seven days, plus attachment and nosniff. The index page: no-cache, always revalidated. Every other path: the single-page-app fallback to index dot html.' },
  { t: 'Every route, measured', body: two(tn(TUYEN('/tinh/app.4f9a2c.js') + '\n' + TUYEN('/index.html'), { fs: 13, wrap: 60 }), tn(TUYEN('/trang/bat-ky'), { fs: 13, wrap: 60 })) +
    box('The SPA path got the SAME ETag and no-cache', '<code>/trang/bat-ky</code> has no file: try_files redirected internally to <code>/index.html</code>, which matched <code>location = /index.html</code> again — so its headers came too.', 'lam'),
    en: 'Every route. The hashed script: compressed, a weak ETag, a year immutable, nosniff. The index page: no-cache. And a path with no file behind it: the same ETag as index dot html, and no-cache — try files redirected internally, matched the exact index block again, and took its headers.' },
  { t: 'Uploads: a <script> that never runs', body: tn(TUYEN('/tai-len/anh.jpg') + '\n' + TUYEN('/tai-len/la.html'), { fs: 15 }) +
    icards([
      ['trash', 'types { }', 'the extension table is EMPTIED here: .html is not text/html any more'],
      ['shield', 'attachment', 'the browser downloads instead of rendering'],
      ['eye', 'nosniff', 'and it may not guess a type of its own'],
    ], 3),
    en: 'Uploads. An image and an HTML file containing a script both came back as application octet-stream, with Content-Disposition attachment and nosniff. The empty types block means dot html is no longer text html here: the browser downloads it and the script never runs.' },
  { t: 'Trap: a 404 cached for a year', body: tn(TUYEN('/tinh/khong-co.js'), { fs: 16 }) +
    ngc(`add_header Cache-Control "public, max-age=31536000, immutable" always;   # "always" = on EVERY status, 404 included`, { sm: true }) +
    tn(O('bo-always').replace(/^\$ for u in .*$/m, '$ for u in /tinh/khong-co.js /tinh/app.4f9a2c.js; do bash xem.sh $u; done'), { fs: 13, wrap: 110 }),
    en: 'The trap. A missing hashed file returned 404 — carrying Cache-Control one year, immutable. A CDN or browser may keep that 404 for a year. The cause is the word always, which adds the header on every status. Without always, the 404 has no Cache-Control and the 200 keeps it.' },
  { t: 'always: which headers need it, which must not have it', body: cmp(['Header', '"always"?', 'Why'], [
      ['<code>X-Content-Type-Options</code>, security headers', '<b>yes</b>', 'error pages are pages too'],
      ['<code>Content-Disposition</code> on uploads', '<b>yes</b>', 'an error page must not render either'],
      ['<code>Cache-Control</code> with a long max-age', '<b>NO</b>', 'a 404 must not be cached for a year'],
    ], { hl: [3] }) + box('Rule', 'Security headers: always. Caching headers: only on success — which is what add_header does WITHOUT the word.', 'xanh'),
    en: 'So: security headers and Content-Disposition get always, because error pages are pages too. A long Cache-Control must not, because a 404 must not live for a year. Without the word, add header only applies to successful responses.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Hashed file name', 'app.4f9a2c.js — new content, new URL'),
      kw('immutable', 'never revalidate'),
      kw('types { }', 'empty the extension table in one location'),
      kw('Content-Disposition: attachment', 'download, never render'),
      kw('always', 'add the header on every status, errors included'),
      kw('SPA fallback', 'try_files $uri $uri/ /index.html'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: hashed file name, immutable, an empty types block, Content-Disposition attachment, the always flag, and the SPA fallback.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Assemble the block; request each of the six routes`,
      `Upload an .html with a script; open it in a browser`,
      `Request a hashed file that does not exist; read Cache-Control`,
      `Remove ${c('always')} from Cache-Control; request it again`,
    ]), box('Keep these', `<ul><li>One policy per location</li><li>Uploads: types { } + attachment</li><li>SPA paths inherit index.html</li><li>No "always" on long caching</li></ul>`, 'lam'), ''),
    en: 'Your turn: assemble the block and request every route, upload an HTML file with a script, request a missing hashed file, then remove always and request it again. Keep: one policy per location, uploads never render, SPA paths inherit the index policy, and no always on long caching.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Static files', bai: '4.5' }, S);
