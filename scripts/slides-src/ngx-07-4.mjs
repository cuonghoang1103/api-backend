/**
 * ngx-07-4 — Nginx · Chapter 7 · Lesson 7.4 "Request size, and the rejection that arrives before the upload" (deck video + web, 13/11/2026).
 * Bài web: nginx-7-4-kich-thuoc-request. Output THẬT (scratchpad/ngx/demo/n7-4.txt; nginx/1.24.0; client_max_body_size 20m; upstream Node đếm byte):
 * 25MB có Content-Length ⇒ 413, gửi 0 byte, 0,0004 s · 19MB ⇒ 200, 19.000.000 byte, 0,047 s · 25MB chunked ⇒ 413, gửi 22.805.136 byte, 0,025 s;
 * error.log "too large body: 25000000 bytes" / "too large chunked body: 20967680+65524 bytes". 413 mặc định = trang HTML "413 Request Entity Too Large";
 * error_page 413 = @qua_lon ⇒ JSON. Thân 20 KB ⇒ "a client request body is buffered to a temporary file". Cookie 9 KB ⇒ 400; URI 9 KB ⇒ 414.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n7-4:file:/root/nhan.js": "// upstream (cổng 9401): đọc hết thân, trả về số byte đã nhận\nrequire('http').createServer((req, res) => { let n = 0; req.on('data', (c) => n += c.length); req.on('end', () => res.end(`nhan ${n} byte\\n`)); }).listen(9401, '127.0.0.1');\n",
 "n7-4:file:/tmp/ng/conf/than.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  client_body_temp_path /tmp/ng/body;\n  server {\n    listen 8080;\n    client_max_body_size 20m;\n    location / { proxy_pass http://127.0.0.1:9401; }\n  }\n}\n",
 "n7-4:setup": "",
 "n7-4:tailen": "$ curl -s -o /dev/null -w '25MB, co Content-Length -> %{http_code}, da GUI LEN %{size_upload} byte, mat %{time_total}s\\n' --data-binary @25mb.bin http://127.0.0.1:8080/\n25MB, co Content-Length -> 413, da GUI LEN 0 byte, mat 0.000419s\n$ curl -s -o /dev/null -w '19MB, co Content-Length -> %{http_code}, da GUI LEN %{size_upload} byte, mat %{time_total}s\\n' --data-binary @19mb.bin http://127.0.0.1:8080/\n19MB, co Content-Length -> 200, da GUI LEN 19000000 byte, mat 0.047076s\n$ curl -s -o /dev/null -w '25MB, chunked           -> %{http_code}, da GUI LEN %{size_upload} byte, mat %{time_total}s\\n' -H 'Transfer-Encoding: chunked' --data-binary @25mb.bin http://127.0.0.1:8080/\n25MB, chunked           -> 413, da GUI LEN 22805136 byte, mat 0.024936s\n$ grep -o 'client intended to send too large[^,]*' /tmp/ng/logs/error.log | sort | uniq -c\n      1 client intended to send too large body: 25000000 bytes\n      1 client intended to send too large chunked body: 20967680+65524 bytes",
 "n7-4:file:/tmp/ng/conf/them.conf": "pid       /tmp/ng/logs/them.pid;\nerror_log /tmp/ng/logs/them.log warn;\nevents {}\nhttp {\n  access_log off;\n  client_body_temp_path /tmp/ng/body2;\n  server {\n    listen 8081;\n    client_max_body_size 20m;\n    location / { proxy_pass http://127.0.0.1:9401; }                         # 413 mặc định: trang HTML\n  }\n  server {\n    listen 8082;\n    client_max_body_size 20m;\n    error_page 413 = @qua_lon;                                               # 413 thành JSON frontend đọc được\n    location / { proxy_pass http://127.0.0.1:9401; }\n    location @qua_lon { default_type application/json; return 413 '{\"loi\":\"tep_qua_lon\",\"toi_da_mb\":20}\\n'; }\n  }\n}\n",
 "n7-4:them": "$ curl -s --data-binary @25mb.bin http://127.0.0.1:8081/ | head -3\n<html>\n<head><title>413 Request Entity Too Large</title></head>\n<body>\n$ curl -s --data-binary @25mb.bin http://127.0.0.1:8082/\n{\"loi\":\"tep_qua_lon\",\"toi_da_mb\":20}\n$ head -c 20000 /dev/zero > 20kb.bin; curl -s -o /dev/null --data-binary @20kb.bin http://127.0.0.1:8081/; grep -o 'a client request body is buffered to a temporary file[^,]*' /tmp/ng/logs/them.log | head -1\na client request body is buffered to a temporary file /tmp/ng/body2/0000000001\n$ printf 'cookie 9KB  -> '; curl -s -o /dev/null -w '%{http_code}\\n' -H \"Cookie: a=$(head -c 9000 /dev/zero | tr '\\0' x)\" http://127.0.0.1:8081/\ncookie 9KB  -> 400\n$ printf 'URI 9KB     -> '; curl -s -o /dev/null -w '%{http_code}\\n' \"http://127.0.0.1:8081/$(head -c 9000 /dev/zero | tr '\\0' a)\"\nURI 9KB     -> 414"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-07-4', code: 'NGX 7.4', title: 'Request size, and the rejection that arrives before the upload', sub: 'Chapter 7 · Lesson 7.4' };
const O = (k) => { const v = DU_LIEU[`n7-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const KQ = (k) => O(k).split('\n').filter((l) => !l.startsWith('$ ')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 7 · Lesson 7.4', t: 'Request size, and the rejection<br>that arrives before the upload', sub: 'The limit always protects the backend — the bandwidth only when the client says how big',
    en: 'Lesson 7.4. A size limit sounds like the simplest of the four. It has one property worth knowing exactly: whether it protects your bandwidth or only your disk depends on something the client chooses.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Three uploads against a 20MB limit, measured</li>
    <li>Content-Length vs chunked: 0 bytes vs 22.8 MB sent</li>
    <li>1MB by default: a per-location decision</li>
    <li>The 413 your application never sees</li>
    <li>The buffers behind it, and sizing for a real site</li></ul>`,
    en: 'Five takeaways: three uploads against a twenty megabyte limit; Content-Length versus chunked; the one megabyte default; the four thirteen your application never sees; and the buffers behind it, plus sizing.' },
  { t: 'Three uploads against a 20MB limit', body: tn(KQ('tailen').replace(/\n\s+1 /g, '\n  1 '), { fs: 16, wrap: 110 }) + cmp(['Upload', 'Status', 'Bytes sent', 'Time'], [
      ['25MB with Content-Length', '413', '0', '0.0004 s'],
      ['19MB with Content-Length', '200', '19,000,000', '0.047 s'],
      ['25MB chunked (no length)', '413', '22,805,136', '0.025 s'],
    ], { hl: [2] }),
    en: 'Three uploads, limit twenty megabytes. Twenty five with Content-Length: four thirteen, zero bytes sent. Nineteen: two hundred, all nineteen million bytes. Twenty five chunked, no length declared: four thirteen — but twenty two point eight million bytes had already crossed the network. The error log tells the two apart.' },
  { t: 'Why: a declared length vs. no length at all', body: two(
      seq(['client', 'nginx', 'app'], [[0, 1, 'headers: Content-Length 25000000'], [1, 1, '25 MB > 20m'], [1, 0, '413 — before ONE body byte', '#c0392b'], [0, 1, '(body never sent)', '#94a3b8', true]], { w: 540, rh: 54, fs: 16 }),
      seq(['client', 'nginx', 'app'], [[0, 1, 'headers: chunked (no length)'], [0, 1, 'chunk … chunk … chunk'], [1, 1, 'running total > 20m'], [1, 0, '413 — after 22.8 MB', '#c0392b']], { w: 540, rh: 54, fs: 16 })) +
    meter([['with Content-Length — bytes uploaded', 0, '#009639'], ['chunked — bytes uploaded', 22.8, '#c0392b']], { don: 'MB', rh: 46, fs: 19, nhan: 470 }) +
    box('Always protects the backend — the bandwidth only usually', 'Nothing oversized ever reached the app in either case. But an attacker who wants to burn your transfer bill simply leaves out Content-Length. If that matters, the defence sits IN FRONT of nginx — a CDN or a firewall rule.', 'lam'),
    en: 'Why. With a declared length, nginx reads the headers, compares the length with the limit, and answers four thirteen before a single body byte. With chunked encoding there is nothing to compare, so nginx reads until the running total passes the limit. Either way nothing oversized reaches the app — but only the first case saves bandwidth.' },
  { t: '1MB by default: decide per location', body: ngc(`http {
  client_max_body_size 1m;              # tight default for the whole site

  server {
    location /api/ { }                  # JSON: 1MB is plenty

    location /tai-len/ {
      client_max_body_size 50m;         # loosened ONLY here
      client_body_buffer_size 128k;     # bigger bodies spill to disk
      proxy_request_buffering on;       # read it ALL before calling the app
      proxy_pass http://api;
    }
  }
}`, { hl: [2, 8] }) + box('The first photo someone uploads', 'Say nothing and you get 1m — a 413 on the first phone photo (3–12 MB). It is also exactly right for a JSON API, so loosen it in ONE location, never at http level: a 50m login form accepts 50 MB before any authentication.', 'do2'),
    en: 'The default is one megabyte: the right value for a JSON API and the wrong one for uploads — the first phone photo gets four thirteen. So it is a per location decision: tight for the whole site, loosened only on the upload route. Put fifty megabytes at the http level and even the login form accepts fifty megabytes before any authentication.' },
  { t: 'The 413 your application never sees', body: ngc(`error_page 413 = @qua_lon;          # the 413 becomes JSON the frontend can read
location @qua_lon {
  default_type application/json;
  return 413 '{"loi":"tep_qua_lon","toi_da_mb":20}';
}`, { hl: [1] }) + tn(KQ('them').split('\n').slice(0, 4).join('\n'), { fs: 16, wrap: 110, title: 'default 413 (port 8081) · then error_page 413 (port 8082)' }) + icards([
      ['eye', 'invisible to the app', 'nginx answers — the app log and your error tracker never hear about it'],
      ['page', 'default body is HTML', 'a JSON client cannot parse it and reports a parse error instead of "file too large"'],
      ['pulse', 'log $status at nginx', 'so a cluster of 413s shows up wherever you collect errors'],
    ], 3),
    en: 'The trap: a four thirteen from nginx never reaches your application, so it is in no application log. The default body is an HTML page that a JSON client cannot parse. Measured: the default answer was the HTML page, request entity too large; with error page four thirteen pointing at a named location, the client got JSON it can show as file too large. And log the status at nginx.' },
  { t: 'The buffers behind it', body: tn(KQ('them').split('\n').slice(4).join('\n'), { fs: 16, wrap: 110 }) + icards([
      ['db', 'client_body_buffer_size', 'smaller bodies stay in memory, larger ones go to a temp file — default 8–16 KB, so most uploads touch disk'],
      ['layers', 'proxy_request_buffering on', 'reads the WHOLE body before calling upstream — a slow uploader never holds an app worker (mirror of 3.3)'],
      ['page', 'large_client_header_buffers', 'a separate limit for headers and URL: 4 × 8 KB by default — 400 or 414'],
      ['merge', 'the limit lives in TWO places', 'nginx and your framework (Express, Multer…) — the SMALLER one wins'],
    ], 2),
    en: 'The buffers behind it. A twenty kilobyte body was already written to a temporary file: the default body buffer is only a couple of memory pages. Proxy request buffering, on by default, reads the whole body first, so a slow uploader never holds an app worker. Headers have their own limit: a nine kilobyte cookie got four hundred, a nine kilobyte URL got four fourteen. And the framework has its own limit; the smaller wins.' },
  { t: 'Sizing it for a real site', body: icards([
      ['page', 'Start from what you really accept', 'a phone photo is 3–12 MB; pick the largest file you support, plus margin — enforce the real rule in the app'],
      ['lock', 'The big ceiling in ONE location', '50m at http level lets every endpoint, the login form included, take 50 MB before any auth'],
      ['count', 'Pair it with limit_conn there', 'a big ceiling and no connection limit = one client, twenty 50 MB uploads at once (Lesson 7.3)'],
      ['server', 'Check the disk under the temp path', 'client_body_temp_path is often on the same disk as everything else — a full disk takes down more than uploads'],
    ], 2) + meter([['100 concurrent uploads × 16 KB buffer (default)', 1.6, '#009639'], ['100 concurrent uploads × 1 MB buffer', 100, '#c0392b']], { don: 'MB of RAM', rh: 46, fs: 19, nhan: 520 }) +
    box('Rule of thumb', 'Tight default at http level · one loose upload location · limit_conn beside it · the real rule in the app · a temp path on a disk that can fill without taking the site down.', 'lam'),
    en: 'Sizing. Start from the largest file you really accept, plus margin, and enforce the real rule in the app where you can explain errors nicely. Put the big ceiling in one location. Pair it with limit conn there, or one client opens twenty fifty megabyte uploads at once. Check the disk under the temp path. And remember the multiplication: a hundred concurrent uploads with a one megabyte buffer is a hundred megabytes of memory.' },
  { t: 'The measurement worth repeating on your server', body: two(steps([
      `Send an over-limit body WITH Content-Length`,
      `Send the same body chunked`,
      `Compare ${c('%{size_upload}')}`,
      `The first MUST be 0`,
      `Both pushed the whole body? Something in front of nginx is buffering it`,
    ]), box('A CDN or a load balancer in between', 'If the declared-length upload still sends every byte, a proxy in front of nginx buffered the request before nginx ever saw it — and your size limit is not saving the bandwidth you think.', 'do2'), 'r64'),
    en: 'The measurement worth repeating on your own server: send an over limit body with Content-Length and the same body chunked, then compare size upload. The first must be zero. If both pushed the whole body, a CDN or load balancer in front of nginx is buffering the request, and your limit is not saving the bandwidth you think.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('client_max_body_size', 'body ceiling, 1m by default'),
      kw('413', 'never reaches the app'),
      kw('Content-Length vs chunked', '0 bytes vs read until over'),
      kw('client_body_buffer_size', 'memory or temp file'),
      kw('proxy_request_buffering', 'read it all, then call upstream'),
      kw('large_client_header_buffers', 'headers and URL: 400 / 414'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: client max body size, four thirteen, Content-Length versus chunked, client body buffer size, proxy request buffering, and large client header buffers.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `${c('client_max_body_size 20m')} before a byte-counting upstream`,
      `25MB with Content-Length, 19MB, 25MB chunked — read size_upload`,
      `Turn the 413 into JSON with ${c('error_page 413 = @qua_lon')}`,
      `Send a 20 KB body and find the temp-file line in error.log`,
      `A 9 KB cookie and a 9 KB URL: which code each?`,
    ]), box('Keep these', `<ul><li>Declared length ⇒ 0 bytes uploaded</li><li>Chunked burns bandwidth first</li><li>1m default, loosen per location</li><li>Your app never sees the 413</li></ul>`, 'lam'), ''),
    en: 'Your turn: a twenty megabyte limit before an upstream that counts bytes; the three uploads; turn four thirteen into JSON; a twenty kilobyte body and the temp file line; a large cookie and a large URL. Keep: declared length means zero bytes uploaded; chunked burns bandwidth first; loosen the one megabyte default per location; your app never sees the four thirteen.' },
];
export const slides = lamDeck({ chuong: 'Chapter 7 — Limits: rate, connections, size', bai: '7.4' }, S);
