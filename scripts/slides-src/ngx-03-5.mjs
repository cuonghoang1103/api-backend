/**
 * ngx-03-5 — Nginx · Chapter 3 · Lesson 3.5 "WebSocket: the upgrade Nginx removes on purpose" (deck video + web, 12/11/2026). Bài web: nginx-3-5-websocket.
 * Output THẬT (scratchpad/ngx/demo/n3-5.txt; nginx/1.24.0, máy chủ WS tối giản ws.js, wsc.py bắt tay thô): trực tiếp ⇒ 101 + 3 khung; proxy thường ⇒ 200;
 * chỉ 1.1 ⇒ 200; đủ (1.1 + Upgrade + Connection qua map) ⇒ 101 + 3 khung; access log ghi 200/200/101; Connection "upgrade" cứng vs map với request thường.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n3-5:file:/root/ws.js": "// máy chủ WebSocket tối giản (không thư viện): bắt tay 101 rồi gửi 3 khung chữ, mỗi khung cách 500 ms (cổng 9102).\n// Request HTTP thường (không Upgrade) ⇒ trả 200 \"trang HTTP thuong\". Cổng 9101: vọng lại header nhận được.\nconst http = require('http'); const crypto = require('crypto');\nconst s = http.createServer((req, res) => res.end('trang HTTP thuong\\n'));\ns.on('upgrade', (req, sock) => {\n  const acc = crypto.createHash('sha1').update(req.headers['sec-websocket-key'] + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11').digest('base64');\n  sock.write(`HTTP/1.1 101 Switching Protocols\\r\\nUpgrade: websocket\\r\\nConnection: Upgrade\\r\\nSec-WebSocket-Accept: ${acc}\\r\\n\\r\\n`);\n  let i = 0; const t = setInterval(() => { i++; const m = Buffer.from(`khung ${i}`); sock.write(Buffer.concat([Buffer.from([0x81, m.length]), m])); if (i === 3) { clearInterval(t); sock.end(); } }, 500);\n});\ns.listen(9102, '127.0.0.1');\nhttp.createServer((req, res) => res.end(`connection: '${req.headers.connection || ''}'  upgrade: ${req.headers.upgrade || '(khong co)'}\\n`)).listen(9101, '127.0.0.1');\n",
 "n3-5:file:/root/wsc.py": "# wsc.py <cổng> <đường dẫn> — bắt tay WebSocket thô, in dòng trạng thái + Upgrade/Connection, rồi thời điểm từng khung tới\nimport socket, sys, time\ns = socket.create_connection(('127.0.0.1', int(sys.argv[1])))\nt0 = time.time()\ns.sendall(f'GET {sys.argv[2]} HTTP/1.1\\r\\nHost: x\\r\\nUpgrade: websocket\\r\\nConnection: Upgrade\\r\\nSec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==\\r\\nSec-WebSocket-Version: 13\\r\\n\\r\\n'.encode())\nbuf = b''\nwhile b'\\r\\n\\r\\n' not in buf:\n    d = s.recv(4096)\n    if not d: break\n    buf += d\ndau, _, du = buf.partition(b'\\r\\n\\r\\n')\ndong = dau.decode().split('\\r\\n')\nprint('   -> ' + dong[0] + ''.join('\\n      ' + l for l in dong[1:] if l.split(':')[0].lower() in ('upgrade', 'connection')))\nif ' 101 ' not in dong[0]: sys.exit()\nmoc = []\nwhile True:\n    d = s.recv(4096)\n    if not d: break\n    moc.append(time.time() - t0)\nprint('      khung toi sau ' + ' / '.join(f'{x:.2f}s' for x in moc))\n",
 "n3-5:file:/tmp/ng/conf/ws.conf": "pid       /tmp/ng/logs/nginx.pid;\nerror_log /tmp/ng/logs/error.log;\nevents {}\nhttp {\n  access_log /tmp/ng/logs/access.log;\n  map $http_upgrade $connection_upgrade {\n    default upgrade;\n    ''      close;\n  }\n  server {\n    listen 8080;\n    location /ws-thuong/ { proxy_pass http://127.0.0.1:9102/; }\n    location /ws-11/     { proxy_http_version 1.1; proxy_pass http://127.0.0.1:9102/; }\n    location /ws/ {\n      proxy_http_version 1.1;\n      proxy_set_header Upgrade    $http_upgrade;\n      proxy_set_header Connection $connection_upgrade;\n      proxy_read_timeout 1h;\n      proxy_pass http://127.0.0.1:9102/;\n    }\n    location /cung/ { proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection \"upgrade\"; proxy_pass http://127.0.0.1:9101/; }\n    location /map/  { proxy_http_version 1.1; proxy_set_header Upgrade $http_upgrade; proxy_set_header Connection $connection_upgrade; proxy_pass http://127.0.0.1:9101/; }\n  }\n}\n",
 "n3-5:setup": "",
 "n3-5:battay": "=== GOI THANG vao may chu WebSocket (chuan doi chieu) ===\n$ python3 wsc.py 9102 /\n   -> HTTP/1.1 101 Switching Protocols\n      Upgrade: websocket\n      Connection: Upgrade\n      khung toi sau 0.51s / 1.02s / 1.52s\n=== A) Khoi proxy BINH THUONG ===\n$ python3 wsc.py 8080 /ws-thuong/\n   -> HTTP/1.1 200 OK\n      Connection: keep-alive\n=== B) Chi them proxy_http_version 1.1 ===\n$ python3 wsc.py 8080 /ws-11/\n   -> HTTP/1.1 200 OK\n      Connection: keep-alive\n=== C) DAY DU (Upgrade + Connection qua map) ===\n$ python3 wsc.py 8080 /ws/\n   -> HTTP/1.1 101 Switching Protocols\n      Connection: upgrade\n      Upgrade: websocket\n      khung toi sau 0.50s / 1.01s / 1.51s\n$ tail -n 3 /tmp/ng/logs/access.log\n127.0.0.1 - - [12/Nov/2026:12:51:14 +0000] \"GET /ws-thuong/ HTTP/1.1\" 200 29 \"-\" \"-\"\n127.0.0.1 - - [12/Nov/2026:12:51:14 +0000] \"GET /ws-11/ HTTP/1.1\" 200 18 \"-\" \"-\"\n127.0.0.1 - - [12/Nov/2026:12:51:16 +0000] \"GET /ws/ HTTP/1.1\" 101 27 \"-\" \"-\"",
 "n3-5:mapvscung": "$ curl -s http://127.0.0.1:8080/cung/\nconnection: 'upgrade'  upgrade: (khong co)\n$ curl -s http://127.0.0.1:8080/map/\nconnection: 'close'  upgrade: (khong co)"
};
/*HET_DU_LIEU*/
import { lamDeck, ngc, tn, seq, icards, cmp, box, two, steps, kw, c } from './_ngx-chung.mjs';

export const deck = { key: 'ngx-03-5', code: 'NGX 3.5', title: 'WebSocket: the upgrade Nginx removes on purpose', sub: 'Chapter 3 · Lesson 3.5' };
const O = (k) => { const v = DU_LIEU[`n3-5:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const C5 = () => O('file:/tmp/ng/conf/ws.conf').split('\n');

export const S = [
  { cover: true, nhan: 'Chapter 3 · Lesson 3.5', t: 'WebSocket:<br>the upgrade Nginx removes on purpose', sub: 'A working WebSocket server behind a working Nginx — and the connection dies with no error anywhere. Not a bug: correct proxy behaviour',
    en: 'Lesson 3.5. Put a working WebSocket server behind a working Nginx and the connection dies with no error anywhere. The reason is the correct behaviour from lesson 3.2.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>What the WebSocket handshake is — 101 Switching Protocols</li>
    <li>Three proxy blocks, one handshake — measured</li>
    <li>Why Nginx strips Upgrade and Connection</li>
    <li>The three lines that fix it, and why map beats a hard-coded string</li>
    <li>Life after the handshake: timeouts</li></ul>`,
    en: 'Five takeaways: the handshake; three blocks measured; why the headers are stripped; the fix with map; and timeouts after the upgrade.' },
  { t: 'The handshake: HTTP asks to become something else', body: seq(['browser', 'server'], [
      [0, 1, 'GET /ws  Upgrade: websocket  Connection: Upgrade'], [1, 0, '101 Switching Protocols', '#2f9d58'], [1, 0, 'frame "khung 1"', '#7c3aed'], [1, 0, 'frame "khung 2" …', '#7c3aed']], { rh: 56, fs: 18 }) +
    tn(O('battay').split('=== A)')[0].replace(/^=== .*\n/, ''), { fs: 15 }),
    en: 'The handshake: an ordinary GET with Upgrade: websocket and Connection: Upgrade; the server answers 101 Switching Protocols and the connection becomes a two-way stream of frames. Direct to our test server: 101, then three frames half a second apart.' },
  { t: 'Three proxy blocks, one handshake', body: ngc(C5().filter((l) => /ws-thuong|ws-11/.test(l)).map((l) => l.trim()).join('\n'), { sm: true }) +
    tn(O('battay').split('=== A)')[1].replace(/^/, '=== A)'), { fs: 14 }),
    en: 'Through a plain proxy block: 200, not 101 — no error, nothing in the log. With only proxy_http_version 1.1: still 200. With the full block: 101 and the three frames.' },
  { t: 'Why Nginx strips the upgrade', body: icards([
      ['cut', 'Hop-by-hop headers', 'Upgrade and Connection describe ONE connection — a correct proxy must not forward them (Lesson 3.2).'],
      ['clock', 'HTTP/1.0 cannot upgrade', 'The default proxy_http_version 1.0 has no Upgrade at all.'],
      ['warn', 'So the app sees a plain GET', 'It answers its normal page: 200. Nginx logs a normal request.'],
    ], 3) + tn(O('battay').split('\n').filter((l) => /access\.log|HTTP\/1\.1"/.test(l)).join('\n'), { fs: 14 }) +
    box('The failure is a 200', 'Nothing you usually check reports a problem — only the browser\'s console shows the socket closing.', 'do2'),
    en: 'Why: Upgrade and Connection are hop-by-hop headers that describe one connection, so a proxy must not forward them, and HTTP/1.0 cannot upgrade anyway. The app sees a plain GET and answers 200; the access log shows 200, 200, then 101.' },
  { t: 'The fix: three lines and a map', body: ngc(C5().slice(5, 9).concat(C5().filter((l, i) => i >= 13 && i <= 19)).map((l) => l.replace(/^  /, '')).join('\n'), { sm: true, hl: [6, 7, 8] }) +
    box('Explicitly re-add what the proxy removed', '<code>proxy_http_version 1.1</code>, pass <code>Upgrade</code> from <code>$http_upgrade</code>, and set <code>Connection</code> from a map. And a long <code>proxy_read_timeout</code> — an idle socket is normal.', 'xanh'),
    en: 'The fix: proxy_http_version 1.1, pass the Upgrade header from $http_upgrade, and set Connection from a map. Plus a long read timeout, because an idle WebSocket is normal and the 60-second default would cut it.' },
  { t: 'Why a map, not a hard-coded "upgrade"', body: tn(O('mapvscung'), { fs: 17 }) + cmp(['Connection set to', 'Plain request (no Upgrade)', 'Effect'], [
      ['"upgrade" (hard-coded)', 'connection: \'upgrade\', no Upgrade header', 'every normal request asks to upgrade — confusing, breaks reuse'],
      ['$connection_upgrade (map)', 'connection: \'close\'', 'normal requests stay normal; only real upgrades say upgrade'],
    ]),
    en: 'Why the map: a plain request without Upgrade reached the upstream with Connection: upgrade when the string was hard-coded, and with Connection: close through the map. The map keeps normal requests normal.' },
  { t: 'After the handshake', body: icards([
      ['clock', 'proxy_read_timeout applies', 'Silence longer than it closes the socket: raise it per WebSocket route, or send pings from the app.'],
      ['server', 'Each socket holds a worker connection', 'worker_connections counts BOTH sides: 1 client + 1 upstream per socket.'],
      ['loop', 'Reload keeps old workers alive', 'Long-lived sockets keep old workers around after a reload — worker_shutdown_timeout bounds it.'],
    ], 3) + ngc(`worker_shutdown_timeout 30s;      # main context: old workers may wait at most 30 s after a reload

location /ws/ {
  proxy_read_timeout 1h;           # silence allowed on ONE socket — this route only
  proxy_send_timeout 1h;
  # …the three lines + map from the previous slides
}`, { sm: true, hl: [1, 4] }) +
    box('Or keep the timeout and ping', 'An app that sends a small frame every 30 s never trips a 60 s read timeout — and notices dead clients sooner.', 'xanh'),
    en: 'After the handshake: the read timeout still applies to silence, so raise it or ping from the app; each socket uses two worker connections; and long-lived sockets keep old workers alive after a reload until worker_shutdown_timeout.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('WebSocket', 'a two-way stream that starts as an HTTP request'),
      kw('101 Switching Protocols', 'the server agrees to upgrade'),
      kw('Hop-by-hop header', 'describes one connection; proxies drop it'),
      kw('$http_upgrade', 'the client\'s Upgrade header'),
      kw('map … $connection_upgrade', '"upgrade" only when Upgrade is present'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: WebSocket, 101 Switching Protocols, hop-by-hop header, $http_upgrade, and the connection_upgrade map.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      `Run the WS server; handshake directly`,
      `Proxy it plainly; see the 200`,
      `Add the three lines + map; see 101 and frames`,
      `Send a plain request through both Connection styles`,
      `Stay silent longer than ${c('proxy_read_timeout')}; watch the socket close`,
    ]), box('Keep these', `<ul><li>The failure is a 200</li><li>1.1 + Upgrade + Connection</li><li>Use the map</li><li>Long read timeout per WS route</li></ul>`, 'lam'), ''),
    en: 'Your turn: handshake directly and through each block, then compare the two Connection styles. Keep: the failure looks like a 200.' },
];
export const slides = lamDeck({ chuong: 'Chapter 3 — Reverse proxy', bai: '3.5' }, S);
