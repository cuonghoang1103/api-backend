/**
 * ngx-09-4 — Nginx · Chapter 9 · Lesson 9.4 "101 requests, one TCP connection" (deck video + web, 13/11/2026).
 * Bài web: nginx-9-4-tai-dung-ket-noi. Output THẬT (scratchpad/ngx/demo/n9-4.txt; nginx/1.24.0, một worker; backend Node đếm request + kết nối):
 * 100 request KHÔNG keepalive (+1 /dem) ⇒ req=101 conn=101, TIME_WAIT tới :9501 = 101 · 100 request CÓ keepalive (cùng backend) ⇒ req=202 conn=102
 * (101 request, MỘT kết nối mới), TIME_WAIT vẫn 101, ss thấy 1 kết nối ESTABLISHED nginx giữ · thiếu MỘT trong ba dòng (keepalive / 1.1 / Connection "")
 * ⇒ cả ba đều req=101 conn=101 · backend Node mặc định (keepAliveTimeout 5 s): 3 request conn=1, im 6 s ⇒ conn=2.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n9-4:file:/root/mac-dinh.js": "// mac-dinh.js — backend Node để NGUYÊN mặc định (server.keepAliveTimeout = 5000 ms), đếm request + kết nối\nlet req = 0, conn = 0;\nconst s = require('http').createServer((q, r) => { req++; r.end(q.url.endsWith('/dem') ? `req=${req}  conn=${conn}\\n` : 'ok\\n'); });\ns.on('connection', () => conn++);\ns.listen(9505, '127.0.0.1');\n",
 "n9-4:file:/tmp/ng/conf/ka.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log off;\n  upstream khong      { server 127.0.0.1:9501; }                  # KHÔNG keepalive\n  upstream giu        { server 127.0.0.1:9501; keepalive 16; }    # CÙNG backend đó, CÓ keepalive\n  upstream thieu_ka   { server 127.0.0.1:9502; }                  # có 1.1 + Connection \"\", thiếu keepalive\n  upstream thieu_ver  { server 127.0.0.1:9503; keepalive 16; }    # thiếu proxy_http_version 1.1\n  upstream thieu_conn { server 127.0.0.1:9504; keepalive 16; }    # thiếu Connection \"\"\n  upstream node_md    { server 127.0.0.1:9505; keepalive 16; }    # đủ ba dòng, backend Node mặc định\n  server {\n    listen 8080;\n    location /dem-khong/ { proxy_pass http://khong/; }\n    location /dem-giu/   { proxy_http_version 1.1; proxy_set_header Connection \"\"; proxy_pass http://giu/; }\n    location /thieu-ka/  { proxy_http_version 1.1; proxy_set_header Connection \"\"; proxy_pass http://thieu_ka/; }\n    location /thieu-ver/ {                         proxy_set_header Connection \"\"; proxy_pass http://thieu_ver/; }\n    location /thieu-conn/ { proxy_http_version 1.1;                                proxy_pass http://thieu_conn/; }\n    location /node-md/   { proxy_http_version 1.1; proxy_set_header Connection \"\"; proxy_pass http://node_md/; }\n  }\n}\n",
 "n9-4:setup": "",
 "n9-4:file:/root/goi.sh": "# goi.sh <đường dẫn> <n> — gửi n request qua nginx, rồi hỏi backend đã đếm được bao nhiêu request và bao nhiêu kết nối TCP\nfor i in $(seq $2); do curl -s -o /dev/null \"http://127.0.0.1:8080$1\"; done\ncurl -s \"http://127.0.0.1:8080$1dem\"\n",
 "n9-4:dem": "$ bash goi.sh /dem-khong/ 100        # KHÔNG keepalive\nreq=101  conn=101\n$ ss -tan state time-wait '( sport = :9501 or dport = :9501 )' | tail -n +2 | wc -l\n101\n$ bash goi.sh /dem-giu/ 100          # CÓ keepalive — cùng backend đó\nreq=202  conn=102\n$ ss -tan state time-wait '( sport = :9501 or dport = :9501 )' | tail -n +2 | wc -l\n101\n$ ss -tn state established '( dport = :9501 )'\nRecv-Q Send-Q Local Address:Port  Peer Address:PortProcess\n0      0          127.0.0.1:51468    127.0.0.1:9501       ",
 "n9-4:thieu": "$ bash goi.sh /thieu-ka/ 100         # thiếu keepalive 16\nreq=101  conn=101\n$ bash goi.sh /thieu-ver/ 100        # thiếu proxy_http_version 1.1\nreq=101  conn=101\n$ bash goi.sh /thieu-conn/ 100       # thiếu proxy_set_header Connection \"\"\nreq=101  conn=101",
 "n9-4:nodemd": "$ bash goi.sh /node-md/ 3            # đủ ba dòng, backend Node để mặc định\nreq=4  conn=1\n$ sleep 6; bash goi.sh /node-md/ 1   # im 6 giây rồi gọi tiếp\nreq=6  conn=2"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, icards, cmp, box, two, steps, kw, c, tiers, meter } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-09-4', code: 'NGX 9.4', title: '101 requests, one TCP connection', sub: 'Chapter 9 · Lesson 9.4' };
const O = (k) => { const v = DU_LIEU[`n9-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const L = (k, a, b) => O(k).split('\n').slice(a, b).join('\n');

/** Hình: nginx ⇄ backend — trái: mỗi request một kết nối (bắt tay · request · đóng ⇒ TIME_WAIT); phải: một kết nối, nhiều request. Minh hoạ. */
function haiDuong() {
  const W = 1110, H = 350;
  let s = `<svg viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="Arial">`;
  const cot = (x, ten, mau) => `<rect x="${x}" y="34" width="120" height="44" rx="10" fill="#fff" stroke="${mau}" stroke-width="3"/><text x="${x + 60}" y="63" text-anchor="middle" font-size="19" font-weight="700" fill="${mau}">${ten}</text><line x1="${x + 60}" y1="78" x2="${x + 60}" y2="${H - 10}" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="6 5"/>`;
  s += `<text x="20" y="22" font-size="20" font-weight="800" fill="#c0392b">Without keepalive: every request pays</text>`;
  s += cot(20, 'nginx', '#009639') + cot(380, 'backend', '#b85a2b');
  for (let k = 0; k < 3; k++) {
    const y0 = 96 + k * 64;
    s += `<line x1="80" y1="${y0}" x2="440" y2="${y0 + 6}" stroke="#94a3b8" stroke-width="2"/><text x="260" y="${y0 - 4}" text-anchor="middle" font-size="14" fill="#64748b">SYN · SYN-ACK · ACK</text>`;
    s += `<line x1="80" y1="${y0 + 20}" x2="440" y2="${y0 + 26}" stroke="#009639" stroke-width="3"/><text x="260" y="${y0 + 18}" text-anchor="middle" font-size="14" font-weight="700" fill="#009639">GET · 200</text>`;
    s += `<line x1="80" y1="${y0 + 40}" x2="440" y2="${y0 + 46}" stroke="#c0392b" stroke-width="2" stroke-dasharray="5 4"/><text x="476" y="${y0 + 46}" font-size="14" font-weight="700" fill="#c0392b">FIN ⇒ TIME_WAIT</text>`;
  }
  s += `<text x="20" y="${H - 6}" font-size="18" font-weight="800" fill="#c0392b">measured: 101 requests = 101 connections</text>`;
  s += `<text x="620" y="22" font-size="20" font-weight="800" fill="#009639">With keepalive: one pipe, reused</text>`;
  s += cot(620, 'nginx', '#009639') + cot(980, 'backend', '#b85a2b');
  s += `<line x1="680" y1="96" x2="1040" y2="102" stroke="#94a3b8" stroke-width="2"/><text x="860" y="92" text-anchor="middle" font-size="14" fill="#64748b">SYN · SYN-ACK · ACK — once</text>`;
  for (let k = 0; k < 6; k++) { const y0 = 124 + k * 24; s += `<line x1="680" y1="${y0}" x2="1040" y2="${y0 + 5}" stroke="#009639" stroke-width="3"/>`; }
  s += `<text x="860" y="${124 + 6 * 24 + 10}" text-anchor="middle" font-size="15" font-weight="700" fill="#009639">GET · 200 · GET · 200 · …</text>`;
  s += `<rect x="690" y="${124 + 6 * 24 + 22}" width="340" height="30" rx="8" fill="#e8f5ec" stroke="#009639"/><text x="860" y="${124 + 6 * 24 + 43}" text-anchor="middle" font-size="15" font-weight="700" fill="#065f2c">idle ⇒ back in the pool (keepalive N)</text>`;
  s += `<text x="620" y="${H - 6}" font-size="18" font-weight="800" fill="#009639">measured: 101 requests = 1 new connection</text>`;
  return s + '</svg>';
}

export const S = [
  { cover: true, nhan: 'Chapter 9 · Lesson 9.4', t: '101 requests,<br>one TCP connection', sub: 'The waste between nginx and your backends — and the three lines that remove it',
    en: 'Lesson 9.4. Lesson six point three measured what a connection costs on the client side. The same waste happens between Nginx and your backends, on every request, by default — and the fix is three lines that must all be present together.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Without keepalive: one new TCP connection per upstream request</li>
    <li>Three directives — and each one alone does nothing</li>
    <li>TIME_WAIT: the cost nobody sees until ports run out</li>
    <li><code>keepalive 32</code> = idle connections per worker, not a limit</li>
    <li>The backend must keep connections alive longer than nginx</li></ul>`,
    en: 'Five takeaways: without keepalive, one new connection per request; three directives, and each alone does nothing; TIME WAIT, the cost nobody sees; keepalive thirty two means idle connections per worker; and the backend must keep connections longer than Nginx.' },
  { t: 'An upstream that counts its own connections', body: ngc(`upstream khong { server 127.0.0.1:9501; }                 # NO keepalive
upstream giu   { server 127.0.0.1:9501; keepalive 16; }   # the SAME backend, with keepalive
location /dem-khong/ { proxy_pass http://khong/; }
location /dem-giu/   { proxy_http_version 1.1; proxy_set_header Connection ""; proxy_pass http://giu/; }`, { sm: true, hl: [2, 4] }) + tn(L('dem', 0, 6), { fs: 19, wrap: 110 }) +
    meter([['no keepalive: new connections', 101, '#c0392b'], ['keepalive: new connections', 1, '#009639']], { don: 'for 101 req', rh: 42, fs: 19, nhan: 360 }),
    en: 'A backend that counts both requests and TCP connections. A hundred requests through the location without keepalive, plus the counting request itself: one hundred and one requests, one hundred and one connections. A hundred more through keepalive, to the same backend: two hundred and two requests, one hundred and two connections — one hundred and one requests over exactly one new connection.' },
  { t: 'What each request costs without it', body: haiDuong() + box('', 'A handshake, a request, a response, a close — for every call to your own backend on your own network. The connection is opened by nginx, used once, and thrown away.', 'lam'),
    en: 'What each request costs without it. A TCP handshake, the request, the response, and a close — for every single call to your own backend on your own network. With keepalive, the handshake happens once, and the idle connection goes back into a pool for the next request.' },
  { t: 'Three lines — and each one alone does nothing', body: ngc(`upstream api {
  server 10.0.1.11:3000;
  keepalive 32;                      # 1) keep IDLE connections, per worker
}
location /api/ {
  proxy_http_version 1.1;            # 2) the default is 1.0 — which closes
  proxy_set_header Connection "";    # 3) the default sends "Connection: close"
  proxy_pass http://api/;
}`, { sm: true, hl: [3, 6, 7] }) + tn(O('thieu'), { fs: 18, wrap: 110 }),
    en: 'Three lines, and all three are required: keepalive in the upstream, proxy http version one point one, and an empty Connection header in the location. Measured: leave out any one of them — keepalive, the version, or the header — and a hundred requests still open a hundred and one connections. This is the most common way keepalive is configured and does nothing.' },
  { t: 'Why each line is needed', body: icards([
      ['stack', 'keepalive N', 'without it nginx closes the upstream connection after every response — there is no pool to return it to'],
      ['type', 'proxy_http_version 1.1', 'nginx talks HTTP/1.0 upstream by default, and 1.0 means one request per connection'],
      ['cut', 'Connection ""', 'by default nginx sends Connection: close (3.2) — the backend hangs up after answering; "" removes the header'],
      ['check', 'All three ⇒ 1 connection', 'the ratio is the test: conn ≈ req means it is NOT working, whatever the config says'],
    ], 2),
    en: 'Why each line. Without keepalive there is no pool, so Nginx closes after every response. Without version one point one, Nginx speaks HTTP one point oh upstream, one request per connection. Without the empty Connection header, Nginx sends Connection close, as in lesson three point two, and the backend hangs up. Only all three together gave one connection.' },
  { t: 'TIME_WAIT: the cost you do not see', body: tn([L('dem', 2, 4), L('dem', 6, 11)].join('\n'), { fs: 18, wrap: 110 }) + icards([
      ['warn', '101 sockets in TIME_WAIT', 'every closed connection waits ~60 s — on both machines, at thousands per second'],
      ['plug', 'Ephemeral port exhaustion', 'fails as "connect() failed", not as "you ran out of ports"'],
      ['check', 'With keepalive: no new ones', 'the count stayed at 101 — and one ESTABLISHED connection nginx keeps'],
    ], 3),
    en: 'TIME WAIT, the cost you do not see. After the hundred requests without keepalive, one hundred and one sockets sat in TIME WAIT; the hundred with keepalive added none. Each closed connection waits about a minute. At a few thousand requests per second that is tens of thousands of sockets, and eventually ephemeral port exhaustion — which shows up as a connection error, not as a message about ports.' },
  { t: 'keepalive 32 is not "32 connections"', body: tiers([
      ['stack', 'IDLE, not a cap', 'nginx opens what it needs, keeps 32 when they go idle', '#008a34'],
      ['cpu', 'Per worker process', '32 × worker_processes 8 = up to 256 idle to one upstream', '#2563eb'],
      ['gauge', 'Too low / too high', 'busy periods keep reopening · idle sockets nobody uses', '#b85a2b'],
      ['count', 'Start: concurrency ÷ workers', 'then compare conn with req at the backend', '#7c3aed'],
    ], { th: 70, gap: 24 }) + box('Also: keepalive_requests 1000 · keepalive_timeout 60s', 'Recycle a connection after N requests and close it when idle too long (both upstream defaults) — cheap insurance against unbounded reuse.', 'lam'),
    en: 'The trap: keepalive thirty two is not thirty two connections. It is idle connections kept per worker — not a limit on concurrency. Per worker, so with eight workers it is up to two hundred and fifty six. Start from steady concurrency divided by workers, then check the backend\'s connection count against its request count.' },
  { t: 'The backend must keep it alive longer', body: tn(O('nodemd'), { fs: 19, wrap: 110 }) + two(ngc(`// Node: the default is 5 s — shorter than nginx's 60 s
const server = http.createServer(app);
server.keepAliveTimeout = 65_000;   // LONGER than nginx
server.headersTimeout   = 66_000;`, { sm: true, hl: [3] }), box('Who closes first matters', 'Node closed the idle connection after 5 s ⇒ conn=2 after a 6 s pause. If the backend closes at the moment nginx reuses the connection, the request fails: a sporadic 502 after quiet periods, "upstream prematurely closed connection".', 'do2'), '') +
    meter([['nginx: upstream keepalive_timeout', 60, '#009639'], ['Node: keepAliveTimeout (default)', 5, '#c0392b']], { don: 's', rh: 40, fs: 19, nhan: 380 }),
    en: 'The backend must want it too. A Node backend with defaults: three requests over one connection — then six seconds of silence, and the next request needed a second connection, because Node closes idle connections after five seconds, sooner than Nginx\'s sixty. If the close races with a reuse, you get an occasional five oh two. Set the backend\'s timeout higher than Nginx\'s.' },
  { t: 'Checking whether yours is working', body: tiers([
      ['count', 'Count conn vs req', 'at the backend: near 1 : 1 ⇒ keepalive NOT in effect', '#008a34'],
      ['eye', 'Watch TIME_WAIT', 'ss -tan state time-wait | wc -l — tens of thousands = bad', '#2563eb'],
      ['warn', '502s after idle periods', '"upstream prematurely closed connection" ⇒ timeouts', '#c0392b'],
      ['plug', 'Upstreams you did not write', 'each needs the three lines · FastCGI: fastcgi_keep_conn on', '#7c3aed'],
    ], { th: 74, gap: 26 }),
    en: 'Checking yours. Count connections against requests at the backend — near one to one means it is not working. Watch TIME WAIT on the Nginx host. Look for five oh twos after quiet periods with upstream prematurely closed connection. And check upstreams you did not write: each needs its own three lines.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('keepalive N', 'idle connections per worker'),
      kw('proxy_http_version 1.1', 'default 1.0 closes'),
      kw('Connection ""', 'drop "Connection: close"'),
      kw('keepalive_requests', 'recycle after N'),
      kw('TIME_WAIT', '~60 s per closed socket'),
      kw('fastcgi_keep_conn', 'the FastCGI equivalent'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: keepalive N, proxy http version one point one, the empty Connection header, keepalive requests, TIME WAIT, and fastcgi keep conn.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'A backend that counts requests and connections',
      '100 requests without keepalive, then with — compare',
      'Remove ONE of the three lines at a time — count again',
      `Node with defaults: pause 6 s — watch ${c('conn')} grow`,
    ]), box('Keep these', `<ul><li>all three lines, or nothing</li><li>conn ≈ req ⇒ not working</li><li>keepalive N = idle per worker</li><li>backend timeout &gt; nginx's</li></ul>`, 'lam'), ''),
    en: 'Your turn: a backend that counts requests and connections; a hundred requests without and with keepalive; remove one line at a time; and Node with defaults after a six second pause. Keep: all three lines or nothing; connections near requests means it is not working; keepalive N is idle per worker; the backend timeout must exceed Nginx\'s.' },
];
export const slides = lamDeck({ chuong: 'Chapter 9 — Load balancing across several backends', bai: '9.4' }, S);
