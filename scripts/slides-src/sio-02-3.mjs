/**
 * sio-02-3 — Socket.IO · Chapter 2 · Lesson 2.3 "Sticky sessions: why one client goes to one worker" (deck video + web, 13/11/2026).
 * Bài web: io-2-3-sticky. Output THẬT (scratchpad/sio/demo/n2-3.txt · socket.io 4.8.3 · Node 22.23.3 · nginx 1.27-alpine trong container sio-nginx-sticky):
 * cum: 2 worker sau nginx — transport mặc định: round-robin "xhr poll error" ✗, ip_hash ✓, hash $cookie_io "xhr post error" ✗; ép websocket: cả ba ✓;
 * curl: bắt tay 10 lần (cách kiểm của bài web) = 200 ×10 kể cả KHÔNG sticky; có sid: round-robin 400 200 400 200…, ip_hash 200 ×10;
 * cookie: mặc định server KHÔNG đặt cookie io (web nói client tự đặt — SAI), { cookie: true } ⇒ Set-Cookie io=<sid>; hash $cookie_io: bắt tay chưa có cookie ⇒ 3/5 phiên 400.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n2-3:file:sticky/nginx.conf": "events {}\nhttp {\n  map $http_upgrade $connection_upgrade { default upgrade; '' close; }\n  upstream rr     { server host.docker.internal:19540; server host.docker.internal:19541; }            # round-robin (mặc định)\n  upstream iphash { ip_hash; server host.docker.internal:19540; server host.docker.internal:19541; }\n  upstream cookie { hash $cookie_io; server host.docker.internal:19540; server host.docker.internal:19541; }\n  server { listen 8001; location /socket.io/ { proxy_pass http://rr;     proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection $connection_upgrade; } }\n  server { listen 8002; location /socket.io/ { proxy_pass http://iphash; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection $connection_upgrade; } }\n  server { listen 8003; location /socket.io/ { proxy_pass http://cookie; proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection $connection_upgrade; } }\n}\n",
 "n2-3:file:hai-worker.mjs": "// Hai \"worker\" = hai tiến trình socket.io độc lập (bộ nhớ riêng), mỗi cái ghi ai đã phục vụ request nào\nimport { Server } from 'socket.io';\nconst cong = +process.argv[2], ten = process.argv[3], cookie = process.argv[4] === 'cookie';\nconst io = new Server(cong, cookie ? { cookie: true } : {});\nio.engine.on('connection_error', (e) => console.log(`[${ten}] 400 ${e.message} (sid lạ)`));\nio.on('connection', (s) => console.log(`[${ten}] connection ${s.id.slice(0, 6)}`));\n",
 "n2-3:file:thu.mjs": "// Một client, transport mặc định (polling → websocket), lần lượt qua 3 cổng của nginx\nimport { io as ketNoi } from 'socket.io-client';\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nfor (const [cong, ten] of [[19542, 'round-robin'], [19543, 'ip_hash'], [19544, 'hash $cookie_io']]) {\n  const c = ketNoi(`http://localhost:${cong}`, { reconnection: false, ...(process.argv[2] ? { transports: [process.argv[2]] } : {}) });\n  const kq = await new Promise((r) => { c.on('connect', () => setTimeout(() => r(`connect ✓ (transport ${c.io.engine.transport.name})`), 400)); c.on('connect_error', (e) => r(`connect_error \"${e.message}\" ✗`)); setTimeout(() => r('treo'), 4000); });\n  console.log(`${ten.padEnd(16)} ⇒ ${kq}`);\n  c.close(); await cho(200);\n}\nprocess.exit(0);\n",
 "n2-3:cum": "# transport mặc định (polling trước), server KHÔNG bật cookie\n$ node thu.mjs\nround-robin      ⇒ connect_error \"xhr poll error\" ✗\nip_hash          ⇒ connect ✓ (transport websocket)\nhash $cookie_io  ⇒ connect_error \"xhr post error\" ✗\n# ép transports: ['websocket'] — một request duy nhất, không cần sticky\n$ node thu.mjs websocket\nround-robin      ⇒ connect ✓ (transport websocket)\nip_hash          ⇒ connect ✓ (transport websocket)\nhash $cookie_io  ⇒ connect ✓ (transport websocket)\n[A] connection 2C6Xr8\n[A] connection PkSkJi\n[A] connection crdea1\n[B] 400 Session ID unknown (sid lạ)\n[B] 400 Session ID unknown (sid lạ)\n[B] 400 Session ID unknown (sid lạ)\n[B] 400 Session ID unknown (sid lạ)\n[B] connection ZnkIFN\n[B] connection XjIv16",
 "n2-3:curl": "# Cách kiểm của bài web: chỉ gọi BẮT TAY 10 lần (không có sid) — luôn 200 kể cả khi KHÔNG sticky\n$ for i in $(seq 10); do curl -s -o /dev/null -w '%{http_code} ' 'localhost:19542/socket.io/?EIO=4&transport=polling'; done; echo\n200 200 200 200 200 200 200 200 200 200 \n# Cách kiểm đúng: lấy sid MỘT lần, rồi gửi 10 POST (gói noop \"6\") CÓ sid\n$ SID=$(curl -s 'localhost:19542/socket.io/?EIO=4&transport=polling' | grep -o '\"sid\":\"[^\"]*\"' | cut -d'\"' -f4); echo \"sid=$SID\"\nsid=cd2SIKRb1EG68D-pAAAF\n400 200 400 200 400 200 400 200 400 200 \n$ SID=$(curl -s 'localhost:19543/socket.io/?EIO=4&transport=polling' | grep -o '\"sid\":\"[^\"]*\"' | cut -d'\"' -f4); echo \"ip_hash sid=$SID\"; for i in $(seq 10); do curl -s -X POST -d 6 -o /dev/null -w '%{http_code} ' \"localhost:19543/socket.io/?EIO=4&transport=polling&sid=$SID\"; done; echo\nip_hash sid=ueOEb1DLUGW7junLAAAG\n200 200 200 200 200 200 200 200 200 200 ",
 "n2-3:cookie": "# socket.io-client có TỰ đặt cookie io không? — xem header trả lời của server, mặc định vs { cookie: true }\n$ curl -s -D - -o /dev/null 'localhost:19540/socket.io/?EIO=4&transport=polling' | grep -iE '^(HTTP|set-cookie)' || true\nHTTP/1.1 200 OK\n$ curl -s -D - -o /dev/null 'localhost:19540/socket.io/?EIO=4&transport=polling' | grep -iE '^(HTTP|set-cookie)'\nHTTP/1.1 200 OK\nSet-Cookie: io=6ueGu0qaDHAX7OOcAAAA; Path=/; HttpOnly; SameSite=Lax\n# hash $cookie_io: request ĐẦU (bắt tay) chưa có cookie ⇒ băm chuỗi rỗng; request sau có io=<sid> ⇒ băm ra worker khác?\n$ for i in 1 2 3 4 5; do curl -s -c j$i -b j$i -o /dev/null 'localhost:19544/socket.io/?EIO=4&transport=polling'; SID=$(grep -o 'io.*' j$i | awk '{print $2}'); printf \"sid=%s → \" ${SID:0:6}; for k in 1 2 3; do curl -s -b j$i -X POST -d 6 -o /dev/null -w '%{http_code} ' \"localhost:19544/socket.io/?EIO=4&transport=polling&sid=$SID\"; done; echo; done; rm -f j?\nsid=jgGkJi → 200 200 200 \nsid=tIGnWJ → 400 400 400 \nsid=wq_Cfs → 400 400 400 \nsid=B46jg2 → 400 400 400 \nsid=PY9Eml → 200 200 200 \n[A] 400 Session ID unknown (sid lạ)\n[A] 400 Session ID unknown (sid lạ)\n[A] 400 Session ID unknown (sid lạ)\n[A] 400 Session ID unknown (sid lạ)\n[A] 400 Session ID unknown (sid lạ)\n[A] 400 Session ID unknown (sid lạ)\n[B] 400 Session ID unknown (sid lạ)\n[B] 400 Session ID unknown (sid lạ)\n[B] 400 Session ID unknown (sid lạ)"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, cmp, box, two, steps, kw, c, seq, tsx } from './_sio-chung.mjs';

export const deck = { key: 'sio-02-3', code: 'SIO 2.3', title: 'Sticky sessions: why one client goes to one worker', sub: 'Chapter 2 · Lesson 2.3' };
const O = (k) => { const v = DU_LIEU[`n2-3:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const CUM = O('cum').split('\n');
const iLog = CUM.findIndex((l) => l.startsWith('['));
const CURL = O('curl').split('\n');
const COOKIE = O('cookie').split('\n');
const iCk = COOKIE.findIndex((l) => l.startsWith('['));
const ngan = (l) => l.replace(/for i in \$\(seq 10\); do curl .*$/, 'for i in $(seq 10); do curl … handshake …; done').replace(/^\$ SID=\$\(curl -s 'localhost:(\d+).*$/, '$ SID=…handshake on :$1…; 10 × POST "6" with that sid');

export const S = [
  { cover: true, nhan: 'Chapter 2 · Lesson 2.3', t: 'Sticky sessions:<br>why one client goes to one worker', sub: 'A real nginx, two workers, and three ways to route — measured',
    en: 'Lesson two point three: sticky sessions, and why one client must go to one worker. A real nginx, two workers, and three ways to route, measured.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>Why polling breaks behind a round-robin balancer: the sid lives in ONE worker's memory</li>
    <li>Measured with a real nginx: round-robin ✗ · ip_hash ✓ · hash $cookie_io ✗</li>
    <li>A curl check that actually detects it — and one that cannot</li>
    <li>The io cookie is NOT set by default</li>
    <li>Redis adapter ≠ sticky: two problems, two fixes</li></ul>`,
    en: 'Five takeaways: why polling breaks behind round-robin; a real nginx measurement of three routing methods; a curl check that actually detects it; the io cookie is not set by default; and why the Redis adapter is not sticky.' },
  { t: 'The problem: one session, several HTTP requests', body: seq(['client', 'nginx (round-robin)', 'worker A', 'worker B'], [
      [0, 1, 'GET handshake', '#475569'], [1, 2, '→ A: creates sid X in A\'s memory', '#1f8a3b'], [2, 0, 'OPEN {sid: X}', '#1f8a3b', true],
      [0, 1, 'POST ?sid=X  "40"', '#475569'], [1, 3, '→ B: who is X?', '#c0392b'], [3, 0, '400 Session ID unknown', '#c0392b', true]], { rh: 44, fs: 18 }) +
    two(box('Why', 'Polling is a conversation of many HTTP requests. The engine.io session (sid, buffers, timers) exists only in the memory of the worker that created it.', 'lam'),
      box('So', 'Every request carrying sid X must reach that worker. That routing rule is a <b>sticky session</b>.', 'la2')),
    en: 'The problem: one session is several HTTP requests. The handshake lands on worker A, which creates sid X in its own memory. The next request, carrying sid X, lands on worker B, which has never heard of it: four hundred, session ID unknown. Every request for that sid must reach the same worker.' },
  { t: 'Measured: a real nginx in front of two workers', body: two(tn(CUM.slice(0, iLog).filter((l) => l.trim()).join('\n'), { fs: 16, wrap: 64 }),
    tn(CUM.slice(iLog).join('\n'), { fs: 16, wrap: 50, title: 'worker logs' }), 'r64') + two(
      box('Default transports', 'round-robin: <code>xhr poll error</code>. <code>hash $cookie_io</code>: <code>xhr post error</code>. Only <code>ip_hash</code> connected. Worker B logged “400 Session ID unknown” for sids it never created.', 'do2'),
      box("transports: ['websocket']", 'All three connected: one HTTP upgrade, one worker, no session to share. It works — and gives up the polling fallback (lesson 0.2).', 'lam')),
    en: 'Measured with a real nginx in a container, in front of two worker processes. With default transports, round robin failed with xhr poll error, hash on the io cookie failed with xhr post error, and only ip hash connected; worker B logged session ID unknown. Forcing websocket, all three connected, because it is a single upgrade request, at the price of the polling fallback.' },
  { t: 'Measured: a curl check that detects it — and one that cannot', body: tn(CURL.map(ngan).join('\n'), { fs: 17, wrap: 110 }) + two(
      box('Handshake only: always 200', 'The check on the web page sends ten handshakes. Each one creates a fresh session on whichever worker it lands — so it is 200 every time, sticky or not.', 'do2'),
      box('Same sid, many requests', 'Take ONE sid, then send requests with it. Round-robin alternates <b>400 200 400 200</b>; ip_hash gives ten 200s.', 'la2')),
    en: 'Measured: a curl check that detects it, and one that cannot. Sending ten handshakes is always two hundred, sticky or not, because every handshake creates a new session wherever it lands. The right check takes one sid and sends ten requests with it: round robin alternates four hundred and two hundred, ip hash gives ten two hundreds.' },
  { t: 'Trap: hash $cookie_io', body: tn(COOKIE.slice(0, iCk).map((l) => l.replace(/^\$ for i in 1 2 3 4 5; .*$/, '$ for 5 sessions: handshake via :19544 (cookie jar), then 3 × POST "6" with the sid').replace(/^\$ curl -s -D - .*$/, '$ curl -s -D - …handshake on worker A… | grep HTTP|set-cookie')).join('\n'), { fs: 15, wrap: 120 }) + two(
      box('Nobody sets “io” by default', `The web lesson says socket.io-client sets the ${c('io')} cookie. It does not: the SERVER sets it, and only with ${c('new Server({ cookie: true })')}.`, 'do2'),
      box('And the handshake has no cookie yet', 'The first request carries no <code>io</code> cookie, so nginx hashes an empty key — which it treats as round-robin. Then the follow-ups hash the real sid. 3 of 5 sessions: 400.', 'do2')),
    en: 'The trap: hash on the io cookie. By default nobody sets that cookie; the server sets it only when you pass cookie true. And even then the handshake carries no cookie yet, so nginx gets an empty key and falls back to round robin, while follow-up requests hash the real sid. Three of five sessions failed with four hundred.' },
  { t: 'Fixes that work', body: cmp(['Fix', 'Measured / how', 'Catch'], [
      [c('ip_hash'), '✓ ten 200s, client connected', 'all users behind one NAT land on one worker'],
      [c("transports: ['websocket']"), '✓ connects through plain round-robin', 'no polling fallback for strict proxies'],
      ['sticky cookie set by the balancer', 'HAProxy <code>cookie … insert</code>, nginx Plus <code>sticky cookie</code>', 'the balancer must set it on the FIRST response'],
      [c('@socket.io/sticky'), 'Node cluster: master routes by sid', 'one machine only'],
      [c('hash $cookie_io'), '✗ 3/5 sessions 400', 'handshake has no cookie'],
    ], { hl: [1, 5] }), to: true,
    en: 'Fixes that work. ip hash connected every time, at the cost of piling users behind one NAT onto one worker. Forcing websocket connects through plain round robin but loses the fallback. A sticky cookie set by the balancer itself on the first response works. For Node cluster on one machine, the sticky package routes by sid. And hash on the io cookie does not work.' },
  { t: 'Redis adapter is NOT sticky', body: two('<div>' + box('Sticky session', 'Routes every HTTP request of one engine.io session to the worker that holds it. Fixes: <b>400 Session ID unknown</b>.', 'lam') +
      box('Redis adapter (Chapter 5)', 'Forwards <code>io.to(room).emit()</code> to the other workers. Fixes: <b>a broadcast only reaches sockets on this worker</b>.', 'la2') + '</div>',
    steps([
      'Two problems: session routing vs cross-worker broadcast',
      'Two fixes, both needed in a cluster with polling',
      'This repo: one container today, adapter already wired (Chapter 5) — sticky still needed the day it scales',
    ]), 'r46'),
    en: 'The Redis adapter is not sticky. Sticky routing sends every request of one session to the worker that holds it; it fixes session ID unknown. The Redis adapter forwards broadcasts to the other workers; it fixes broadcasts that only reach local sockets. Two problems, two fixes, and a cluster with polling needs both.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Sticky session', 'every request of one client goes to the same worker'), kw('Session ID unknown', 'HTTP 400 from a worker that never created the sid'),
      kw('ip_hash', 'nginx: pick the worker by client IP'), kw('hash $cookie_io', 'empty on the handshake ⇒ round-robin ⇒ fails'),
      kw('cookie: true', 'server option that makes engine.io set io=<sid>'), kw('Redis adapter', 'shares broadcasts, not sessions'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: sticky session; session ID unknown; ip hash; hash on the io cookie and why it fails; the cookie true server option; and the Redis adapter, which shares broadcasts, not sessions.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Run two socket.io processes behind nginx round-robin; connect with default transports',
      'Check with ONE sid and ten requests — not ten handshakes',
      'Switch to ip_hash; then try hash $cookie_io with cookie: true and count the 400s',
      'Explain in one line why the Redis adapter does not fix it',
    ]), box('Keep these', `<ul><li>Polling = many requests, one worker's memory</li><li>Round-robin ⇒ 400 Session ID unknown</li><li>ip_hash works; hash $cookie_io does not</li><li>Sticky ≠ Redis adapter</li></ul>`, 'lam'), ''),
    en: 'Your turn: two processes behind a round robin nginx; check with one sid and ten requests; switch to ip hash, then try hash on the io cookie and count the failures; and explain why the Redis adapter does not fix it. Keep: polling needs one worker; ip hash works; sticky is not the Redis adapter.' },
];
export const slides = lamDeck({ chuong: 'Chapter 2 — Transports and the upgrade', bai: '2.3' }, S);
