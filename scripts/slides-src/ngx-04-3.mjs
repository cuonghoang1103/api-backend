/**
 * ngx-04-3 — Nginx · Chapter 4 · Lesson 4.3 "Compression: pay once at build time, not on every request" (deck video + web, 12/11/2026). Bài web: nginx-4-3-nen.
 * Output THẬT (scratchpad/ngx/demo/n4-3.txt; nginx/1.24.0; tệp: một .mjs thật của kho, 113.771 byte, đổi tên .js): không nén 113.771 · gzip mức 5
 * 31.557 · mức 9 30.794 · gzip -9 dựng sẵn 30.626. wrk 1 kết nối 5 s: không nén ~14k req/s · gzip 5 ~450 req/s (2,2 ms) · gzip 9 ~300 req/s (3,3 ms)
 * · gzip_static ~17–18k req/s. ETag: tại chỗ ⇒ W/ + không Content-Length; static ⇒ ETag mạnh tính từ tệp .gz. .mjs: mime.types 1.24 KHÔNG có ⇒
 * text/plain, không nén. Nén ảnh JPEG đã nén ⇒ 300.000 → 300.113 byte (to hơn).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n4-3:file:/tmp/ng/conf/nen.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  include /etc/nginx/mime.types;\n  access_log off;\n  server { listen 8080; root /tmp/ng/www; }                                                        # không nén\n  server { listen 8081; root /tmp/ng/www; gzip on; gzip_types application/javascript; gzip_comp_level 5; } # nén tại chỗ, mức 5\n  server { listen 8082; root /tmp/ng/www; gzip on; gzip_types application/javascript; gzip_comp_level 9; } # nén tại chỗ, mức 9\n  server { listen 8083; root /tmp/ng/www-gz; gzip_static on; }                                     # đọc tệp .gz dựng sẵn\n}\n",
 "n4-3:setup": "",
 "n4-3:dungsan": "$ gzip -9 -k /tmp/ng/www-gz/bai.js && ls -l /tmp/ng/www-gz/ | awk 'NR>1{print $5, $9}'\n113771 bai.js\n30626 bai.js.gz",
 "n4-3:co": "$ for p in 8080 8081 8082 8083; do printf '%s -> ' $p; curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w '%{size_download} byte\\n' http://127.0.0.1:$p/bai.js; done\n8080 -> 113771 byte\n8081 -> 31557 byte\n8082 -> 30794 byte\n8083 -> 30626 byte",
 "n4-3:thoigian": "$ for p in 8080 8081 8082 8083; do printf '%s -> ' $p; wrk -t1 -c1 -d5s -H 'Accept-Encoding: gzip' http://127.0.0.1:$p/bai.js | awk '/Latency/{l=$2} /Requests\\/sec/{r=$2} END{print \"do tre TB \" l \", \" r \" request/giay\"}'; done\n8080 -> do tre TB 232.90us, 11169.74 request/giay\n8081 -> do tre TB 2.97ms, 359.21 request/giay\n8082 -> do tre TB 3.71ms, 275.76 request/giay\n8083 -> do tre TB 177.37us, 15501.83 request/giay",
 "n4-3:etag": "$ for p in 8080 8081 8083; do printf '%s -> ' $p; curl -s -o /dev/null -D - -H 'Accept-Encoding: gzip' http://127.0.0.1:$p/bai.js | grep -E '^(Content-Length|ETag|Content-Encoding)' | tr -d '\\r' | tr '\\n' ' '; echo; done\n8080 -> Content-Length: 113771 ETag: \"6a8b2710-1bc6b\" \n8081 -> ETag: W/\"6a8b2710-1bc6b\" Content-Encoding: gzip \n8083 -> Content-Length: 30626 ETag: \"6a8b2710-77a2\" Content-Encoding: gzip ",
 "n4-3:mjs": "$ for f in bai.js bai.mjs; do printf '%-8s -> ' $f; curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w '%{content_type}  %{size_download} byte\\n' http://127.0.0.1:8081/$f; done\nbai.js   -> application/javascript  31557 byte\nbai.mjs  -> text/plain  113771 byte\n$ grep -c 'mjs' /etc/nginx/mime.types\n0",
 "n4-3:file:/tmp/ng/conf/danen.conf": "pid       /tmp/ng/logs/danen.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  include /etc/nginx/mime.types;\n  access_log off;\n  server { listen 8084; root /tmp/ng/www; gzip on; gzip_types image/jpeg; }   # SAI cố ý: nén ảnh đã nén\n}\n",
 "n4-3:danen": "$ curl -s -o /dev/null -w 'khong xin gzip: %{size_download} byte\\n' http://127.0.0.1:8084/anh.jpg\nkhong xin gzip: 300000 byte\n$ curl -s -o /dev/null -w 'xin gzip      : %{size_download} byte\\n' -H 'Accept-Encoding: gzip' http://127.0.0.1:8084/anh.jpg\nxin gzip      : 300113 byte",
 "n4-3:file:/tmp/ng/conf/ty.conf": "pid       /tmp/ng/logs/ty.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  include /etc/nginx/mime.types;\n  types { application/javascript mjs; }     # khối types thứ HAI cùng tầng: THÊM vào bảng\n  access_log off;\n  server { listen 8085; root /tmp/ng/www; gzip on; gzip_types application/javascript; }\n}\n",
 "n4-3:themmjs": "$ for f in bai.js bai.mjs anh.jpg; do printf '%-8s -> ' $f; curl -s -o /dev/null -H 'Accept-Encoding: gzip' -w '%{content_type}  %{size_download} byte\\n' http://127.0.0.1:8085/$f; done\nbai.js   -> application/javascript  37976 byte\nbai.mjs  -> application/javascript  37976 byte\nanh.jpg  -> image/jpeg  5000 byte"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-04-3', code: 'NGX 4.3', title: 'Compression: pay once at build time, not on every request', sub: 'Chapter 4 · Lesson 4.3' };
const O = (k) => { const v = DU_LIEU[`n4-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/\/tmp\/ng\//g, '/srv/');

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.3', t: 'Compression:<br>pay once at build time, not on every request', sub: 'gzip on shrinks a file to a quarter — and costs thirty times the throughput. gzip_static gives the same bytes for free',
    en: 'Lesson 4.3. gzip on shrinks a JavaScript file to about a quarter. Measured on one connection, it also cuts throughput thirty-fold. Pre-compressed files give the same bytes for free.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Four ways to serve the same 114 KB file — sizes</li>
    <li>What on-the-fly gzip costs, in requests per second</li>
    <li>gzip_static, and its strong ETag</li>
    <li>The .mjs file that is never compressed</li>
    <li>What not to compress at all</li></ul>`,
    en: 'Five takeaways: four ways to serve one file; the cost of compressing on the fly; gzip static and its ETag; the dot mjs trap; and what never to compress.' },
  { t: 'One real file, four servers', body: ngc(O('file:/tmp/ng/conf/nen.conf').split('\n').filter((l) => /server \{/.test(l)).map((l) => l.trim().replace(/root \/tmp\/ng\/www(-gz)?; /, '').replace(/ +#/, '   #')).join('\n'), { sm: true }) +
    tn(bo(O('dungsan') + '\n' + O('co')), { fs: 15 }),
    en: 'One real file from this repository, 114 kilobytes. Four servers: no compression, gzip on the fly at level five, at level nine, and gzip static reading a file compressed in advance with gzip dash nine. Sizes: 114 thousand bytes, then about 31 thousand for all three.' },
  { t: 'The bytes are almost the same', body: meter([
      ['no compression', 113771, '#64748b'], ['gzip on, level 5', 31557], ['gzip on, level 9', 30794], ['gzip_static (gzip -9 at build)', 30626, '#2563eb'],
    ], { don: 'bytes', rh: 62, fs: 21, nhan: 380 }) +
    box('Level 5 → 9 buys 2.4%', 'The first quarter of the work gives three quarters of the saving. Pre-compressing with -9 costs CPU ONCE, at build time.', 'lam'),
    en: 'The sizes side by side: compressing takes the file to about a quarter, and going from level five to level nine buys only two point four percent more. Pre-compressing at build time pays the highest level once.' },
  { t: 'The time is not', body: tn(O('thoigian').replace(/^\$ for p in .*$/m, '$ for p in 8080 8081 8082 8083; do wrk -t1 -c1 -d5s -H "Accept-Encoding: gzip" …:$p/bai.js; done'), { fs: 16 }) +
    meter([['no compression', 14354, '#64748b'], ['gzip on, level 5', 449, '#c0392b'], ['gzip on, level 9', 308, '#c0392b'], ['gzip_static', 18597, '#2563eb']], { don: 'requests/s', rh: 52, fs: 20, nhan: 300 }),
    en: 'The time is not. One connection, five seconds each. No compression: about fourteen thousand requests a second. gzip on the fly: about four hundred and fifty at level five, three hundred at level nine. gzip static: about eighteen thousand — fastest of all, because fewer bytes are sent.' },
  { t: 'And the validators change', body: tn(O('etag').replace(/^\$ for p in .*$/m, '$ for p in 8080 8081 8083; do curl -sD - -H "Accept-Encoding: gzip" …:$p/bai.js | grep …; done'), { fs: 14, wrap: 110 }) +
    icards([
      ['type', 'On the fly: W/ and no length', 'a WEAK ETag (same value), chunked — the size is unknown until the end'],
      ['check', 'gzip_static: a strong ETag', 'computed from the .gz file itself, with a real Content-Length'],
      ['warn', 'Keep the .gz in step', 'rebuild it with the file — Nginx serves whatever .gz sits next to it'],
    ], 3),
    en: 'The validators change too. On the fly, the ETag becomes weak, W slash, and there is no Content-Length. With gzip static it is a strong ETag computed from the gz file itself. Keep the gz in step with the original: Nginx serves whatever sits next to it.' },
  { t: 'Trap: the .mjs that is never compressed', body: tn(O('mjs'), { fs: 16 }) + ngc(O('file:/tmp/ng/conf/ty.conf').split('\n').slice(5, 7).map((l) => l.trim()).join('\n'), { sm: true, hl: [2] }) +
    tn(O('themmjs').replace(/^\$ for f in .*$/m, '$ for f in bai.js bai.mjs anh.jpg; do curl …:8085/$f; done'), { fs: 15 }) +
    box('Two failures from one missing line', 'Served as text/plain, gzip_types never matches — and a browser REFUSES to run a module script with that type.', 'do2'),
    en: 'The trap: nginx 1.24 has no entry for dot mjs. The same file named dot js is application javascript and compressed; named dot mjs it is text plain, uncompressed — and a browser refuses to run a module with that type. One extra types block after the include ADDS the entry — measured, the rest of the table survives.' },
  { t: 'Do not compress what is already compressed', body: tn(O('danen'), { fs: 16 }) + cmp(['Type', 'Compress?', 'Why'], [
      ['HTML, CSS, JS, JSON, SVG, XML', '<b>yes</b>', 'text shrinks to a quarter'],
      ['JPEG, PNG, WebP, MP4, WOFF2, zip', '<b>never</b>', 'already compressed: 300,000 → 300,113 bytes, CPU burnt'],
      ['anything under ~256 bytes', 'no', 'the gzip framing outweighs the saving'],
    ], { hl: [2] }),
    en: 'Never compress what is already compressed. A JPEG through gzip went from three hundred thousand bytes to three hundred thousand one hundred and thirteen: bigger, and CPU burnt. Compress text; skip media, fonts, archives, and anything tiny.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('gzip on', 'compress every response, every time'),
      kw('gzip_comp_level', '1–9; 5 → 9 buys about 2%'),
      kw('gzip_static', 'serve the .gz file built in advance'),
      kw('Weak ETag (W/)', 'what on-the-fly compression leaves'),
      kw('gzip_types', 'which Content-Types to compress; text/html always'),
      kw('gzip_vary', 'adds Vary: Accept-Encoding for caches'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: gzip on, gzip comp level, gzip static, the weak ETag, gzip types, and gzip vary.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Pick your biggest JS file; serve it four ways`,
      `Measure size with ${c('curl -w %{size_download}')}`,
      `Measure throughput with ${c('wrk -c1')}`,
      `Serve the same file as ${c('.mjs')}; read its Content-Type`,
      `Add ${c('gzip -9 -k')} to your build step`,
    ]), box('Keep these', `<ul><li>Same bytes, very different cost</li><li>Pre-compress at build time</li><li>Check .mjs has a type</li><li>Never gzip media</li></ul>`, 'lam'), ''),
    en: 'Your turn: serve your largest script four ways, measure size and throughput, rename it to dot mjs and read the type, and add gzip dash nine to your build. Keep: same bytes, very different cost; pre-compress at build; check mjs; never gzip media.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Static files', bai: '4.3' }, S);
