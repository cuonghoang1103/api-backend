/**
 * ngx-04-1 — Nginx · Chapter 4 · Lesson 4.1 "From URI to bytes, and where the content type comes from" (deck video + web, 12/11/2026). Bài web: nginx-4-1-tu-uri-toi-byte.
 * Output THẬT (scratchpad/ngx/demo/n4-1.txt; nginx/1.24.0): header mặc định; KHÔNG khai default_type ⇒ đuôi lạ/không đuôi = text/plain (khai
 * application/octet-stream ⇒ tải về); .svg vẫn image/svg+xml dù có default_type + nosniff (SVG có <script>); thư mục không index ⇒ 403 (không có ⇒ 404);
 * Range 0-99 ⇒ 206; hai dải ⇒ multipart/byteranges; Range + gzip ⇒ 200 nén nguyên tệp (Range bị bỏ qua).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n4-1:file:/tmp/ng/conf/tinh.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  include      /etc/nginx/mime.types;\n  access_log   off;\n  server {\n    listen 8080;                       # KHÔNG khai default_type ⇒ mặc định của nginx\n    root /tmp/ng/www;\n    location /liet-ke/      { autoindex on; }\n    location /liet-ke-json/ { alias /tmp/ng/www/liet-ke/; autoindex on; autoindex_format json; }\n  }\n  server {\n    listen 8081;\n    root /tmp/ng/www;\n    default_type application/octet-stream;\n    add_header X-Content-Type-Options \"nosniff\" always;\n  }\n}\n",
 "n4-1:setup": "",
 "n4-1:macdinh": "$ curl -sI http://127.0.0.1:8080/trang.html | grep -vE '^(Date|Connection)'\nHTTP/1.1 200 OK\nServer: nginx/1.24.0 (Ubuntu)\nContent-Type: text/html\nContent-Length: 27026\nLast-Modified: Thu, 12 Nov 2026 13:54:46 GMT\nETag: \"6af5c526-6992\"\nAccept-Ranges: bytes",
 "n4-1:kieu": "$ for f in trang.html nho.txt lon.bin khong-duoi la.xyz123 tep/anh.svg; do printf '%-13s 8080 -> %-26s 8081 -> %s\\n' $f \"$(curl -s -o /dev/null -w '%{content_type}' http://127.0.0.1:8080/$f)\" \"$(curl -s -o /dev/null -w '%{content_type}' http://127.0.0.1:8081/$f)\"; done\ntrang.html    8080 -> text/html                  8081 -> text/html\nnho.txt       8080 -> text/plain                 8081 -> text/plain\nlon.bin       8080 -> application/octet-stream   8081 -> application/octet-stream\nkhong-duoi    8080 -> text/plain                 8081 -> application/octet-stream\nla.xyz123     8080 -> text/plain                 8081 -> application/octet-stream\ntep/anh.svg   8080 -> image/svg+xml              8081 -> image/svg+xml\n$ grep -n 'default_type' /etc/nginx/nginx.conf\n27:\tdefault_type application/octet-stream;",
 "n4-1:thumuc": "=== autoindex on ===\n$ curl -s http://127.0.0.1:8080/liet-ke/\n<html>\n<head><title>Index of /liet-ke/</title></head>\n<body>\n<h1>Index of /liet-ke/</h1><hr><pre><a href=\"../\">../</a>\n<a href=\"a.txt\">a.txt</a>                                              12-Nov-2026 13:54                   2\n<a href=\"b.txt\">b.txt</a>                                              12-Nov-2026 13:54                   2\n</pre><hr></body>\n</html>\n=== autoindex_format json ===\n$ curl -s http://127.0.0.1:8080/liet-ke-json/\n[\n{ \"name\":\"a.txt\", \"type\":\"file\", \"mtime\":\"Thu, 12 Nov 2026 13:54:46 GMT\", \"size\":2 },\n{ \"name\":\"b.txt\", \"type\":\"file\", \"mtime\":\"Thu, 12 Nov 2026 13:54:46 GMT\", \"size\":2 }\n]\n=== KHONG autoindex, thu muc KHONG co index.html ===\n$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/rong/\n403\n$ curl -s -o /dev/null -w '%{http_code}\\n' http://127.0.0.1:8080/khong-co-thu-muc-nay/\n404",
 "n4-1:dai": "$ curl -sI -H 'Range: bytes=0-99' http://127.0.0.1:8080/lon.bin | grep -E '^(HTTP|Content-Length|Content-Range)'\nHTTP/1.1 206 Partial Content\nContent-Length: 100\nContent-Range: bytes 0-99/2000000\n$ curl -sI -H 'Range: bytes=0-9,100-109' http://127.0.0.1:8080/lon.bin | grep -E '^(HTTP|Content-Type|Content-Length)'\nHTTP/1.1 206 Partial Content\nContent-Type: multipart/byteranges; boundary=00000000000000000001\nContent-Length: 256",
 "n4-1:file:/tmp/ng/conf/gz.conf": "pid       /tmp/ng/logs/gz.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  include /etc/nginx/mime.types;\n  access_log off;\n  server {\n    listen 8082; root /tmp/ng/www;\n    gzip on; gzip_min_length 1;      # text/html luôn nằm trong gzip_types\n  }\n}\n",
 "n4-1:daigzip": "$ curl -s -o /dev/null -D - -H 'Range: bytes=0-99' http://127.0.0.1:8082/trang.html | grep -E '^(HTTP|Content-Range|Content-Encoding)'\nHTTP/1.1 206 Partial Content\nContent-Range: bytes 0-99/27026\n$ curl -s -o /dev/null -D - -H 'Range: bytes=0-99' -H 'Accept-Encoding: gzip' http://127.0.0.1:8082/trang.html | grep -E '^(HTTP|Content-Range|Content-Encoding)'\nHTTP/1.1 200 OK\nContent-Encoding: gzip"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, flow } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-04-1', code: 'NGX 4.1', title: 'From URI to bytes, and where the content type comes from', sub: 'Chapter 4 · Lesson 4.1' };
const O = (k) => { const v = DU_LIEU[`n4-1:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/\/tmp\/ng\//g, '/srv/');

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.1', t: 'From URI to bytes,<br>and where the content type comes from', sub: 'Serving a file is what Nginx does best — and where the most happens without being written down',
    en: 'Lesson 4.1. Serving a file is the thing Nginx does best, and it is also where the most happens without being written down. Everything between a filesystem path and the response, measured.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The four headers you did not ask for</li>
    <li>Content-Type comes from the extension ALONE</li>
    <li>The default_type trap — and what it does NOT fix</li>
    <li>A directory: listing, JSON, or 403</li>
    <li>Range requests, and why gzip switches them off</li></ul>`,
    en: 'Five takeaways: the headers you get for free; content type from the extension alone; the default_type trap and its limit; three ways a directory answers; and range requests.' },
  { t: 'What comes back by default', body: tn(bo(O('macdinh')), { fs: 17 }) + icards([
      ['type', 'Content-Type', 'looked up from the file extension in mime.types'],
      ['clock', 'Last-Modified + ETag', 'built from the file metadata — the contents are never read (4.2)'],
      ['cut', 'Accept-Ranges: bytes', 'Nginx can send a slice of the file — video seeking, resumed downloads'],
    ], 3),
    en: 'One curl dash I on an HTML file. Four headers you never asked for: Content-Type from a lookup table, Last-Modified and ETag from the file metadata, and Accept-Ranges, Nginx advertising that it can send part of the file.' },
  { t: 'From URI to bytes, in four steps', to: true, body: flow([
      { t: '1 · path', s: 'root / alias (Ch. 2)' }, { t: '2 · extension', s: 'mime.types lookup' },
      { t: '3 · validators', s: 'mtime + size' }, { t: '4 · bytes', s: 'whole, or a range' }], { h: 170 }) +
    two(box('A directory?', '<code>index</code> runs and does an internal redirect — Lesson 2.5, for real.', 'lam'),
      box('No sniffing', 'Nginx never opens the file to guess its type. The extension alone decides.', 'xanh')) +
    cmp(['Step', 'Decided by', 'Lesson'], [
      ['path', '<code>root</code> / <code>alias</code>, <code>index</code>', '2.4, 2.5'],
      ['type', '<code>types</code> (mime.types) → <code>default_type</code>', 'this one'],
      ['validators', '<code>etag</code>, <code>if_modified_since</code>', '4.2'],
      ['bytes', '<code>sendfile</code>, <code>max_ranges</code>, <code>gzip</code>', '4.3, 4.4'],
    ]),
    en: 'Four steps: the path is resolved by root or alias; the extension is looked up in mime.types; validators come from the file metadata; then the bytes are sent, whole or as a range. Nginx never opens the file to guess its type.' },
  { t: 'Content-Type is the extension, nothing else', body: tn(O('kieu'), { fs: 15, wrap: 110 }) +
    two(box('Port 8080 — no default_type', 'No extension, or one missing from the table ⇒ <b>text/plain</b>: the browser shows it as a page of text.', 'do2'),
      box('Port 8081 — default_type octet-stream', 'The same files ⇒ <b>application/octet-stream</b>: the browser downloads them. Ubuntu\'s nginx.conf sets this — a bare config does not.', 'xanh')),
    en: 'Six files, two servers. Without default_type, a file with no extension or an unknown one is announced as text plain. With default_type application octet-stream, the same files download. Ubuntu\'s nginx.conf sets that line; a config written from scratch does not.' },
  { t: 'Trap: the fix does not cover SVG', body: cmp(['File', 'Content-Type (both servers)', 'What a browser does'], [
      ['<code>la.xyz123</code>, <code>khong-duoi</code>', 'text/plain → octet-stream once fixed', 'renders as text → downloads'],
      ['<code>tep/anh.svg</code> containing <code>&lt;script&gt;</code>', '<b>image/svg+xml</b> — a KNOWN type', 'opened directly, the script RUNS on your origin'],
    ], { hl: [1] }) + ngc(`# a route that serves what USERS uploaded (full block in Lesson 4.5)
location /tai-len/ {
  types { }                                   # forget the extension table here
  default_type application/octet-stream;
  add_header Content-Disposition "attachment" always;
  add_header X-Content-Type-Options "nosniff" always;
}`, { sm: true, hl: [2, 4] }),
    en: 'The trap: default_type only covers unknown extensions. An uploaded SVG is a known type, image svg plus xml, on both servers — and opened directly, its script runs on your origin. For user uploads, empty the types table and force a download with Content-Disposition attachment.' },
  { t: 'A directory, three ways', body: two(tn(O('thumuc').split('=== autoindex_format')[0].replace(/<\/?(html|head|body|title|hr|pre)>/g, '').replace(/\n\s*\n/g, '\n').trim(), { fs: 13, wrap: 64 }),
      tn('=== autoindex_format' + O('thumuc').split('=== autoindex_format')[1].split('=== KHONG')[0], { fs: 13, wrap: 64 })) +
    tn('=== KHONG' + O('thumuc').split('=== KHONG')[1], { fs: 15 }) +
    box('403 is not 404', 'A directory with no index answers 403 — which tells a stranger that the directory EXISTS. A missing path answers 404.', 'do2'),
    en: 'A directory three ways. autoindex on lists every file. autoindex format json turns the listing into an API. Without autoindex and without an index file, the answer is 403, not 404 — which tells a stranger the directory exists.' },
  { t: 'Range requests — and when they switch off', body: tn(O('dai') + '\n' + bo(O('daigzip')), { fs: 14 }) +
    icards([
      ['cut', '206 Partial Content', 'one range ⇒ Content-Range; two ⇒ multipart/byteranges'],
      ['warn', 'gzip ⇒ Range ignored', 'compressed on the fly, the reply was 200 and the WHOLE file'],
      ['shield', 'max_ranges 1', 'keeps seeking, refuses requests packed with tiny ranges'],
    ], 3),
    en: 'Range requests. Bytes zero to ninety-nine gave 206 with a Content-Range. Two ranges gave a multipart reply. But on a server compressing on the fly, the same Range with Accept-Encoding gzip came back 200 with the whole file, compressed: ranges and gzip do not mix.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('mime.types', 'extension → Content-Type table; no sniffing'),
      kw('default_type', 'type for unknown or missing extensions; text/plain if unset'),
      kw('nosniff', 'X-Content-Type-Options: the browser must trust the declared type'),
      kw('Content-Disposition: attachment', 'download, never render'),
      kw('autoindex', 'directory listing — HTML or JSON'),
      kw('206 Partial Content', 'the reply to a Range request'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: mime types, default type, nosniff, Content-Disposition attachment, autoindex, and 206 Partial Content.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `${c('curl -I')} one file of each type you serve`,
      `Remove ${c('default_type')}; fetch a file with no extension`,
      `Upload an SVG with a script; open it directly`,
      `Request a directory with no index — 403 or 404?`,
      `Send ${c('Range')} with and without ${c('Accept-Encoding: gzip')}`,
    ]), box('Keep these', `<ul><li>The extension decides the type</li><li>Set default_type octet-stream</li><li>Uploads: attachment + nosniff</li><li>gzip turns ranges off</li></ul>`, 'lam'), ''),
    en: 'Your turn: read the headers of each file type, remove default type, open an uploaded SVG, request an empty directory, and compare Range with and without gzip. Keep: the extension decides; default type octet-stream; uploads download with nosniff; gzip turns ranges off.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Static files', bai: '4.1' }, S);
