/**
 * ngx-06-4 — Nginx · Chapter 6 · Lesson 6.4 "HTTP/2: what it changes, and what a local measurement cannot show you" (deck video + web, 12/11/2026).
 * Bài web: nginx-6-4-http2. Output THẬT (scratchpad/ngx/demo/n6-4.txt; nginx/1.24.0 ⇒ `listen 8444 ssl http2;`): 8444 ⇒ HTTP/2, ALPN h2; 8443 ⇒ HTTP/1.1;
 * 50 tệp một lệnh curl: tuần tự h2 18 ms · h1.1 21 ms; --parallel h2 20 ms · h1.1 63 ms (mở nhiều kết nối ⇒ nhiều lần bắt tay);
 * HPACK (nghttp -nv, cookie 1474 byte): HEADERS gửi đi 1240 → 20 → 20 → 20 byte; HTTP/1.1 cùng cookie 1567 byte MỖI request.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n6-4:file:/tmp/ng/conf/h2.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  ssl_certificate     /root/pki/fullchain.crt;\n  ssl_certificate_key /root/pki/la.key;\n  root /tmp/ng/site;\n  server { listen 8443 ssl;       server_name vidu.com; }   # KHÔNG bật http2\n  server { listen 8444 ssl http2; server_name vidu.com; }   # nginx 1.24: http2 là THAM SỐ của listen\n}\n",
 "n6-4:setup": "",
 "n6-4:xacnhan": "$ for p in 8444 8443; do printf 'cong %s -> ' $p; curl -s -o /dev/null --cacert pki/root.crt -w 'HTTP/%{http_version}\\n' https://vidu.com:$p/t01.css; done\ncong 8444 -> HTTP/2\ncong 8443 -> HTTP/1.1\n$ for p in 8444 8443; do printf 'cong %s -> ' $p; openssl s_client -connect 127.0.0.1:$p -servername vidu.com -alpn h2,http/1.1 </dev/null 2>&1 | grep -E '^ALPN|No ALPN'; done\ncong 8444 -> ALPN protocol: h2\ncong 8443 -> ALPN protocol: http/1.1",
 "n6-4:doloi": "$ U=$(for i in $(seq -w 1 50); do printf -- '-o /dev/null https://vidu.com:8444/t%s.css ' $i; done); for m in '' --parallel; do for v in --http2 --http1.1; do printf '%-9s %-10s 50 tep: ' $v \"${m:-tuan-tu}\"; s=$(date +%s%N); curl -s $m $v --cacert pki/root.crt $U; echo \"$(( ($(date +%s%N)-s)/1000000 )) ms\"; done; done\n--http2   tuan-tu    50 tep: 18 ms\n--http1.1 tuan-tu    50 tep: 21 ms\n--http2   --parallel 50 tep: 20 ms\n--http1.1 --parallel 50 tep: 63 ms",
 "n6-4:hpack": "$ C=\"phien=$(head -c 1100 /dev/urandom | base64 -w0)\"; echo \"cookie dai ${#C} byte\"; nghttp -nv -H \"cookie: $C\" https://vidu.com:8444/t01.css https://vidu.com:8444/t02.css https://vidu.com:8444/t03.css https://vidu.com:8444/t04.css 2>&1 | grep -oE 'send HEADERS frame <length=[0-9]+' | sed 's/send HEADERS frame <length=/HEADERS gui di: /; s/$/ byte/'\ncookie dai 1474 byte\nHEADERS gui di: 1240 byte\nHEADERS gui di: 20 byte\nHEADERS gui di: 20 byte\nHEADERS gui di: 20 byte\n$ C=\"phien=$(head -c 1100 /dev/urandom | base64 -w0)\"; for i in 1 2 3 4; do curl -s -o /dev/null --http1.1 --cacert pki/root.crt -H \"cookie: $C\" -w 'HTTP/1.1 request %{size_request} byte\\n' https://vidu.com:8443/t0$i.css; done\nHTTP/1.1 request 1567 byte\nHTTP/1.1 request 1567 byte\nHTTP/1.1 request 1567 byte\nHTTP/1.1 request 1567 byte"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, meter, seq } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-06-4', code: 'NGX 6.4', title: 'HTTP/2: what it changes, and what a local measurement cannot show', sub: 'Chapter 6 · Lesson 6.4' };
const O = (k) => { const v = DU_LIEU[`n6-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const gon = (s) => s.replace(/^\$ U=\$\(for i .*$/m, "$ for m in '' --parallel; do for v in --http2 --http1.1; do curl $m $v … 50 URL; done; done")
  .replace(/^\$ C="phien=.*nghttp .*$/m, '$ nghttp -nv -H "cookie: <1474 byte>" …/t01.css …/t02.css …/t03.css …/t04.css | grep "send HEADERS"')
  .replace(/^\$ C="phien=.*--http1\.1 .*$/m, '$ for i in 1 2 3 4; do curl --http1.1 -H "cookie: <1474 byte>" -w "%{size_request}" …; done')
  .replace(/^\$ for p in 8444 8443; do printf 'cong %s -> ' \$p; curl .*$/m, "$ for p in 8444 8443; do curl -w 'HTTP/%{http_version}' https://vidu.com:$p/t01.css; done")
  .replace(/^\$ for p in 8444 8443; do printf 'cong %s -> ' \$p; openssl .*$/m, '$ for p in 8444 8443; do openssl s_client -alpn h2,http/1.1 -connect …:$p | grep ALPN; done');

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.4', t: 'HTTP/2: what it changes,<br>and what a local measurement cannot show', sub: 'One connection, compressed headers, no head-of-line blocking in HTTP — measured where it shows, and honest where it does not',
    en: 'Lesson 6.4. HTTP/2 changes three things: one connection instead of many, compressed headers, and no head-of-line blocking at the HTTP level. Two of them show up on one machine; one needs a real network.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Turning it on — the syntax your version needs</li>
    <li>Confirming it: http_version and ALPN</li>
    <li>50 files: sequential vs parallel, h2 vs 1.1</li>
    <li>HPACK: a 1.5 KB cookie sent once, then 20 bytes</li>
    <li>What changes in how you build a site — and where to measure</li></ul>`,
    en: 'Five takeaways: turning it on with the right syntax; confirming it; fifty files sequential and parallel; HPACK shrinking a cookie to twenty bytes; and what changes for your site, plus where to measure.' },
  { t: 'Turn it on, then confirm it', body: two(ngc(`# nginx <= 1.25.0 (Ubuntu 24.04 ships 1.24.0)
server { listen 8444 ssl http2; … }

# nginx >= 1.25.1
server { listen 443 ssl; http2 on; … }`, { sm: true, hl: [2] }), tn(gon(O('xacnhan')), { fs: 14, wrap: 70 }), 'r46') +
    two(seq(['client', 'nginx'], [[0, 1, 'ClientHello · ALPN: h2, http/1.1'], [1, 0, ':8444 → h2', '#008a34'], [1, 0, ':8443 → http/1.1', '#c0392b']], { w: 540, rh: 42 }),
      box('ALPN decides', 'HTTP/2 over TLS is agreed INSIDE the handshake (ALPN). A client that offers h2 to a server without it simply falls back to http/1.1 — nothing breaks, nothing warns.', 'lam')),
    en: 'On nginx 1.24 HTTP/2 is a parameter of listen; from 1.25.1 it is its own directive. Then confirm it: curl reports HTTP two on port 8444 and one point one on 8443, and openssl shows the ALPN protocol, h2. ALPN is negotiated inside the TLS handshake.' },
  { t: '50 files: where HTTP/2 shows on one machine', body: tn(gon(O('doloi')), { fs: 14, wrap: 110 }) +
    meter([['sequential · HTTP/2', 18, '#008a34'], ['sequential · HTTP/1.1', 21, '#2563eb'], ['parallel · HTTP/2 (1 connection)', 20, '#008a34'], ['parallel · HTTP/1.1 (many connections)', 63, '#c0392b']], { don: 'ms', rh: 44, fs: 19, nhan: 400 }) + box('Loopback: latency ≈ 0', 'Sequential fetches cannot show multiplexing here — there are no round trips to overlap. Parallel fetches DO show the handshakes HTTP/1.1 pays for every extra connection.', 'lam'),
    en: 'Fifty small files. One after another, HTTP two and one point one are the same, eighteen and twenty one milliseconds: on loopback there is no latency to hide. Fetched in parallel, HTTP one point one opens many connections and pays a handshake for each: sixty three milliseconds against twenty.' },
  { t: 'HPACK: the cookie is sent once', body: tn(gon(O('hpack')), { fs: 14, wrap: 110 }) +
    meter([['HTTP/2 request 1', 1240, '#e0590b'], ['HTTP/2 requests 2–4', 20, '#008a34'], ['HTTP/1.1, every request', 1567, '#c0392b']], { don: 'bytes of headers', rh: 50, fs: 20, nhan: 340 }),
    en: 'HPACK. The same one and a half kilobyte cookie on four requests. HTTP two sent one thousand two hundred forty bytes of headers the first time, then twenty bytes each: references to a shared table. HTTP one point one sent one thousand five hundred sixty seven bytes every single time.' },
  { t: 'What HTTP/2 really changes', body: icards([
      ['link', 'One connection, not six', 'browsers open up to six per origin on 1.1 — five handshakes saved per page load (Lesson 6.3)'],
      ['layers', 'No HTTP head-of-line blocking', 'frames interleave: one slow API call no longer delays thirty images queued behind it'],
      ['cut', 'Bundling and sprites backfire', 'forty small files cost little more than one — and cache far better'],
      ['warn', 'Domain sharding now hurts', 'img1/img2 subdomains add DNS lookups and handshakes for nothing'],
      ['trash', 'Server push is gone', 'removed by Chrome in 2022 — use preload or 103 Early Hints'],
      ['shield', 'http2_max_concurrent_streams', 'default 128 — a cap on how much one client can ask at once'],
    ], 3),
    en: 'What really changes. One connection instead of six. No head-of-line blocking at the HTTP level. Bundling and sprites become counter-productive, and splitting assets across domains now hurts. Server push is gone. And max concurrent streams caps one client at a hundred twenty eight.' },
  { t: 'Measure it where your users are', body: two(steps([
      'Open the site over a REAL connection, not the server itself',
      'Browser DevTools → Network → add the "Protocol" column',
      'Throttle to "Slow 4G"; load with h2 on, then off',
      'Compare the waterfall, not one total',
    ]), box('Why not on the server', 'On loopback, latency is ~0: there is nothing for multiplexing to hide, and the sequential test above shows 18 vs 21 ms. HTTP/3 (QUIC) goes one step further — no head-of-line blocking even when a packet is lost — in nginx ≥ 1.25.', 'lam'), ''),
    en: 'So measure where your users are: over a real connection, in the browser\'s network panel with the protocol column, throttled, with HTTP two on and off, comparing the waterfall. On the server itself latency is near zero and there is nothing to hide.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('ALPN', 'protocol choice inside the TLS handshake'),
      kw('Multiplexing', 'many requests interleaved on one connection'),
      kw('HPACK', 'header compression with a shared table'),
      kw('Head-of-line blocking', 'one slow response holding up the rest'),
      kw('listen … http2', 'the syntax up to nginx 1.25.0'),
      kw('HTTP/3 / QUIC', 'the same idea over UDP'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: ALPN, multiplexing, HPACK, head-of-line blocking, the listen http2 syntax, and HTTP three over QUIC.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Two ports: one with ${c('http2')}, one without`,
      `Confirm with ${c('%{http_version}')} and ${c('-alpn h2')}`,
      `50 files, sequential and ${c('--parallel')}`,
      `${c('nghttp -nv')} with a big cookie: read the HEADERS sizes`,
    ]), box('Keep these', `<ul><li>Syntax depends on version</li><li>One connection, fewer handshakes</li><li>HPACK: repeat = a few bytes</li><li>Measure on a real network</li></ul>`, 'lam'), ''),
    en: 'Your turn: two ports, confirm the protocol, fetch fifty files both ways, and read the HEADERS sizes with nghttp. Keep: the syntax depends on your version; one connection means fewer handshakes; HPACK turns a repeated header into a few bytes; measure on a real network.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — TLS and HTTP/2', bai: '6.4' }, S);
