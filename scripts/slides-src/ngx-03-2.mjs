/**
 * ngx-03-2 — Nginx · Chapter 3 · Lesson 3.2 "What Nginx sends upstream by default, and four surprises" (deck video + web, 12/11/2026). Bài web: nginx-3-2-header-len-upstream.
 * Output THẬT (scratchpad/ngx/demo/n3-2.txt; nginx/1.24.0): mặc định ⇒ HTTP/1.0, host 127.0.0.1:9101, connection: close, header có "_" bị bỏ;
 * khối vá (1.1 + Host + Connection "" + X-Real-IP/XFF/Proto/Host + underscores_in_headers on) ⇒ đủ; XFF giả 1.2.3.4 ⇒ "1.2.3.4, 127.0.0.1";
 * set_real_ip_from 127.0.0.1 ⇒ X-Real-IP bị giả thành 1.2.3.4.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n3-2:file:/root/vong.js": "// upstream \"vọng lại\": in đúng cái nó nhận — dòng request và mọi header — để thấy proxy đã gửi gì\nrequire('http').createServer((req, res) => {\n  const h = Object.entries(req.headers).map(([k, v]) => `${k}: ${v}`).join('\\n');\n  res.setHeader('Content-Type', 'text/plain');\n  res.end(`${req.method} ${req.url} HTTP/${req.httpVersion}\\n${h}\\n`);\n}).listen(9101, '127.0.0.1');\n",
 "n3-2:file:/tmp/ng/conf/hdr.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  server {\n    listen 8080;\n    location / { proxy_pass http://127.0.0.1:9101; }\n  }\n  server {\n    listen 8081;\n    underscores_in_headers on;\n    location / {\n      proxy_http_version 1.1;\n      proxy_set_header Host              $host;\n      proxy_set_header Connection        \"\";\n      proxy_set_header X-Real-IP         $remote_addr;\n      proxy_set_header X-Forwarded-For   $proxy_add_x_forwarded_for;\n      proxy_set_header X-Forwarded-Proto $scheme;\n      proxy_set_header X-Forwarded-Host  $host;\n      proxy_pass http://127.0.0.1:9101;\n    }\n  }\n  server {\n    listen 8082;\n    set_real_ip_from 127.0.0.1;\n    real_ip_header   X-Forwarded-For;\n    location / {\n      proxy_set_header X-Real-IP       $remote_addr;\n      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;\n      proxy_pass http://127.0.0.1:9101;\n    }\n  }\n}\n",
 "n3-2:setup": "",
 "n3-2:mamdinh": "=== QUA PROXY (mac dinh) ===\n$ curl -s -H 'Host: vidu.com' -H 'X-Tu-Client: gia-tri' -H 'X-Co-Gach_duoi: co' http://127.0.0.1:8080/api\nGET /api HTTP/1.0\nhost: 127.0.0.1:9101\nconnection: close\nuser-agent: curl/8.5.0\naccept: */*\nx-tu-client: gia-tri\n=== GOI THANG VAO UPSTREAM ===\n$ curl -s -H 'Host: vidu.com' -H 'X-Tu-Client: gia-tri' -H 'X-Co-Gach_duoi: co' http://127.0.0.1:9101/api\nGET /api HTTP/1.1\nhost: vidu.com\nuser-agent: curl/8.5.0\naccept: */*\nx-tu-client: gia-tri\nx-co-gach_duoi: co",
 "n3-2:vasach": "=== QUA KHOI DA VA (cong 8081) ===\n$ curl -s -H 'Host: vidu.com' -H 'X-Tu-Client: gia-tri' -H 'X-Co-Gach_duoi: co' http://127.0.0.1:8081/api\nGET /api HTTP/1.1\nhost: vidu.com\nx-real-ip: 127.0.0.1\nx-forwarded-for: 127.0.0.1\nx-forwarded-proto: http\nx-forwarded-host: vidu.com\nuser-agent: curl/8.5.0\naccept: */*\nx-tu-client: gia-tri\nx-co-gach_duoi: co",
 "n3-2:xff": "$ curl -s -H 'X-Forwarded-For: 1.2.3.4' http://127.0.0.1:8081/ | grep -E '^x-(real-ip|forwarded-for)'\nx-real-ip: 127.0.0.1\nx-forwarded-for: 1.2.3.4, 127.0.0.1\n=== CO set_real_ip_from 127.0.0.1 (cong 8082) ===\n$ curl -s -H 'X-Forwarded-For: 1.2.3.4' http://127.0.0.1:8082/ | grep -E '^x-(real-ip|forwarded-for)'\nx-real-ip: 1.2.3.4\nx-forwarded-for: 1.2.3.4, 1.2.3.4"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-03-2', code: 'NGX 3.2', title: 'What Nginx sends upstream by default, and four surprises', sub: 'Chapter 3 · Lesson 3.2' };
const O = (k) => { const v = DU_LIEU[`n3-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo = (s) => s.replace(/ -H 'Host: vidu.com' -H 'X-Tu-Client: gia-tri' -H 'X-Co-Gach_duoi: co'/g, ' -H … ').replace(/http:\/\/127\.0\.0\.1:/g, ':');
const khoi = () => O('file:/tmp/ng/conf/hdr.conf').split('\n').slice(11, 22).map((l) => l.replace(/^    /, '')).join('\n');

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.2', t: 'What Nginx sends upstream by default,<br>and four surprises', sub: 'A proxy does not forward your request — it builds a NEW one. Which headers are copied, changed or dropped is decided by defaults older than most of what you will set',
    en: 'Lesson 3.2. A proxy does not forward your request; it builds a new one. Which headers are copied, changed or dropped is decided by old defaults — here is the same request seen from both sides.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The same request, direct and through a default proxy — side by side</li>
    <li>Four surprises: HTTP/1.0, Host, Connection: close, underscores</li>
    <li>The block that fixes all four</li>
    <li>X-Forwarded-For is a LIST, and the client writes the first entry</li>
    <li>set_real_ip_from: the line that lets anyone choose their IP</li></ul>`,
    en: 'Five takeaways: the request seen both ways; four surprises; the fixing block; X-Forwarded-For as a list; and how real_ip can be spoofed.' },
  { t: 'Same request: through a default proxy vs direct', body: two(tn(bo(O('mamdinh')).split('=== GOI THANG')[0].replace(/^=== QUA PROXY \(mac dinh\) ===\n/, ''), { fs: 14, wrap: 52, title: 'through nginx (default)' }),
      tn('$' + bo(O('mamdinh')).split('=== GOI THANG VAO UPSTREAM ===\n$')[1], { fs: 14, wrap: 52, title: 'straight to the upstream' })) +
    box('Four differences, one request', 'HTTP/1.0 · host became 127.0.0.1:9101 · connection: close added · x-co-gach_duoi vanished.', 'do2'),
    en: 'The same curl, through a default proxy and straight to the upstream. Through Nginx the upstream saw HTTP/1.0, host 127.0.0.1:9101, connection close, and the header with an underscore was gone.' },
  { t: 'Four surprises', body: icards([
      ['clock', '1 · It speaks HTTP/1.0', 'Default proxy_http_version 1.0: no keep-alive, no chunked request bodies, no Upgrade — WebSocket cannot work (Lesson 3.5).'],
      ['type', '2 · Host is REPLACED', 'The app sees 127.0.0.1:9101, not vidu.com: absolute URLs, cookie domains, multi-tenant routing go wrong.'],
      ['cut', '3 · Connection: close every time', 'A brand-new TCP connection to your own backend for EVERY request — real cost, ephemeral-port exhaustion.'],
      ['warn', '4 · Underscore headers dropped silently', 'underscores_in_headers is off by default and nothing logs the removal — the hardest of the four to diagnose.'],
    ], 2),
    en: 'Four surprises. Nginx speaks HTTP/1.0 upstream. Host is replaced by the upstream address. Every request carries Connection: close, a new TCP connection each time. And headers with underscores are dropped silently.' },
  { t: 'The block that fixes all four', body: two(ngc(khoi().replace(/(proxy_set_header \S+) +/g, '$1 '), { sm: true, hl: [1, 2, 3, 4] }), tn(bo(O('vasach')).replace(/^=== .*\n/, ''), { fs: 14, wrap: 40 }), 'r64') +
    icards([
      ['server', 'Host $host', 'the name the client typed — not $proxy_host, the upstream address'],
      ['link', 'Connection ""', 'removes "close", so 1.1 connections can be reused (Lesson 9.4)'],
    ], 2) +
    box('Put it in a file and include it everywhere', 'proxy_set_header is an ARRAY directive: one line in a location throws away every inherited one (Lesson 0.3).', 'lam'),
    en: 'One block fixes all four: proxy_http_version 1.1, Host set to $host, Connection emptied so connections can be reused, the forwarded headers, and underscores_in_headers on. Measured again: everything arrives. Keep it in one included file — proxy_set_header replaces as a whole.' },
  { t: 'X-Forwarded-For is a LIST — the client writes the first entry', body: tn(bo(O('xff')).split('=== CO')[0], { fs: 16 }) +
    cmp(['Header', 'Value', 'Who wrote it'], [['<code>x-forwarded-for</code>', '<b>1.2.3.4</b>, 127.0.0.1', 'the CALLER typed 1.2.3.4; Nginx appended the real address'], ['<code>x-real-ip</code>', '127.0.0.1', '$remote_addr — the TCP peer, cannot be faked over TCP']]) +
    box('At the edge: trust $remote_addr and nothing else', 'Pass it as X-Real-IP and make the app trust only that.', 'xanh'),
    en: 'X-Forwarded-For is a list. $proxy_add_x_forwarded_for appends, so a client that sends 1.2.3.4 gets "1.2.3.4, 127.0.0.1" — the first entry is whatever the caller typed. X-Real-IP from $remote_addr is the TCP peer and cannot be faked.' },
  { t: 'set_real_ip_from — and how it gets spoofed', body: ngc(O('file:/tmp/ng/conf/hdr.conf').split('\n').slice(25, 27).map((l) => l.trim()).join('\n'), { sm: true }) +
    tn(bo(O('xff')).split('\n').slice(3).join('\n'), { fs: 16 }) +
    box('Trusting the wrong hop lets anyone choose their IP', 'With 127.0.0.1 trusted and the header taken from X-Forwarded-For, $remote_addr BECAME 1.2.3.4 — the forged value. Only list the addresses of proxies YOU run in front of Nginx.', 'do2'),
    en: 'The real_ip module rewrites $remote_addr from a header when the request comes from a trusted address. Trusting 127.0.0.1 here let a forged X-Forwarded-For become the client IP: X-Real-IP became 1.2.3.4. Trust only proxies you operate.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('proxy_http_version 1.1', 'keep-alive, chunked, Upgrade possible'),
      kw('proxy_set_header Host $host', 'pass the original host'),
      kw('Connection ""', 'allow connection reuse upstream'),
      kw('X-Real-IP', '$remote_addr — the TCP peer'),
      kw('X-Forwarded-For', 'a list; the first entry is client-written'),
      kw('underscores_in_headers', 'off by default ⇒ X_Y headers dropped'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: proxy_http_version 1.1, proxy_set_header Host, an empty Connection, X-Real-IP, X-Forwarded-For, and underscores_in_headers.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Echo server behind a default proxy; compare with a direct call`,
      `Add the fixing block; compare again`,
      `Send ${c('X-Forwarded-For: 1.2.3.4')}; read both IP headers`,
      `Trust ${c('127.0.0.1')} with real_ip; watch the spoof work`,
    ]), box('Keep these', `<ul><li>A proxy builds a NEW request</li><li>1.1 + Host + Connection "" + forwarded headers</li><li>XFF's first entry is untrusted</li><li>Trust only your own proxies</li></ul>`, 'lam'), ''),
    en: 'Your turn: compare direct and proxied requests, add the fixing block, send a forged X-Forwarded-For, and reproduce the real_ip spoof.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Reverse proxy', bai: '3.2' }, S);
