/**
 * node-11-1 — Node.js · Chapter 11 · Lesson 11.1 "From asking repeatedly to being told: WebSocket" (slide EN, đợt 9 — 01/11/2026).
 * MỘT deck, HAI tập: node-11-1 (slide 1–12) · node-11-1-2 (slide 13–25).
 *   A: mọi request là ý của client · ba cách biết tin (polling / SSE / WebSocket) · ví dụ đời thường · bắt tay từng byte (thật) · accept = sha1(key+GUID) ·
 *      ba hệ quả · khung tin từng byte (thật: 21 byte có mặt nạ, 17 byte server) · vì sao client phải che mặt nạ · phép đo 1 polling 839 B/lần (thật)
 *   B: phép đo 2 socket 2.089 B (thật) · phép đo 3 nhân 10.000 người (thật: 12 triệu request, 10,07 GB vs 14,4 MB ping) · polling không luôn sai ·
 *      server nhỏ nhất · một cổng · bẫy proxy (nginx thật: 200/400 thay vì 101) · timeout rỗi (thật 3,01 s, 1006) · send(object) (thật: ws ném TypeError,
 *      WebSocket chuẩn gửi "[object Object]") · không tự nối lại + cookie chỉ ở bắt tay · website này · bài tập · tự kiểm · tóm tắt
 * Nguồn: nodejs-11-1-websocket-co-ban. Output THẬT: that/c11/{handshake,poll-vs-ws,traps} (Node 22.23.3, ws 8.22.1, socket.io 4.8.4, express 5.3.0,
 *   nginx 1.27.5 trong Docker `node11-nginx`). Khác web: RTT trung vị 0,149 ms/200 lần (web 0,885 ms một lần) · 839 B/lần poll (web 799) · 10,07 GB (web 8,93) ·
 *   proxy thiếu header ⇒ ws thô nhận 200 của Express, Socket.IO 400 (web chỉ ghi 400) · ws.send(object) NÉM lỗi (web ghi "gửi [object Object]", đúng cho WebSocket trình duyệt).
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, TT, thanh, dong } from './_c9-chung.mjs';
import { ma } from './_node-chung.mjs';

export const deck = { key: 'node-11-1', code: 'NODE 11.1', title: 'From asking repeatedly to being told: WebSocket', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c11/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const P = {
  cookie: num(R('poll-vs-ws', /cookie alone/), /cookie alone: (\d+)/), body: num(R('poll-vs-ws', /cookie alone/), /body: (\d+)/),
  pollTot: num(R('poll-vs-ws', /^\s+client -> server: 11/), /total ([\d,]+)/), perPoll: num(R('poll-vs-ws', /per poll/), /per poll: ([\d,]+)/),
  wsTot: num(R('poll-vs-ws', /^\s+client -> server: 540/), /total ([\d,]+)/), wsMsg: num(R('poll-vs-ws', /payload per message/), /message: (\d+)/),
  ping: num(R('poll-vs-ws', /^C\)/), /-> (\d+) B per ping/), gb: R('poll-vs-ws', /polling every 3 s/).match(/([\d.]+) GB/)[1], idleMB: R('poll-vs-ws', /Socket.IO idle/).match(/= ([\d.]+) MB/)[1],
};
const rtt = R('handshake', /^round trip/).match(/median ([\d.]+) ms/)[1];
const fmt = (n) => n.toLocaleString('en-US');

// polling vs push on one time axis
const timeline = `<svg data-k="dong" viewBox="0 0 1100 250" width="1100" height="250" font-family="Arial">
<text x="10" y="40" font-size="21" font-weight="700" fill="${DO}">polling</text>
<line x1="150" y1="60" x2="1080" y2="60" stroke="#999" stroke-width="2"/>
${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<line x1="${170 + i * 125}" y1="40" x2="${170 + i * 125}" y2="80" stroke="${DO}" stroke-width="4"/><text x="${170 + i * 125}" y="104" text-anchor="middle" font-size="19" fill="${i === 5 ? NODE : '#888'}">${i === 5 ? 'news!' : 'no'}</text>`).join('')}
<rect x="${170 + 4 * 125 + 60}" y="22" width="16" height="16" rx="8" fill="${NODE}"/><text x="${170 + 4 * 125 + 68}" y="16" text-anchor="middle" font-size="15" fill="${NODE}">event</text>
<text x="10" y="170" font-size="21" font-weight="700" fill="${NODE}">push</text>
<line x1="150" y1="190" x2="1080" y2="190" stroke="#999" stroke-width="2"/>
<rect x="150" y="178" width="20" height="24" fill="${LAM}"/><text x="160" y="232" text-anchor="middle" font-size="19" fill="${LAM}">handshake</text>
<line x1="${170 + 4 * 125 + 68}" y1="160" x2="${170 + 4 * 125 + 68}" y2="214" stroke="${NODE}" stroke-width="6"/><text x="${170 + 4 * 125 + 68}" y="236" text-anchor="middle" font-size="19" fill="${NODE}">told at once</text>
<text x="1080" y="140" text-anchor="end" font-size="19" fill="#555">every red tick = a full HTTP request, almost always answered "no"</text>
</svg>`;

// one server, two kinds of request
const onePort = `<svg data-k="cong" viewBox="0 0 1100 260" width="1100" height="260" font-family="Arial">
<defs><marker id="m1" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#555"/></marker></defs>
<rect x="10" y="30" width="250" height="70" rx="12" fill="${LAM}14" stroke="${LAM}" stroke-width="2.5"/><text x="135" y="72" text-anchor="middle" font-size="20" font-weight="700" fill="${LAM}">GET /api/notes</text>
<rect x="10" y="160" width="250" height="70" rx="12" fill="${TIM}14" stroke="${TIM}" stroke-width="2.5"/><text x="135" y="193" text-anchor="middle" font-size="19" font-weight="700" fill="${TIM}">GET /socket</text><text x="135" y="217" text-anchor="middle" font-size="16" fill="#555">Upgrade: websocket</text>
<rect x="400" y="80" width="280" height="100" rx="14" fill="${NODE}14" stroke="${NODE}" stroke-width="3"/><text x="540" y="122" text-anchor="middle" font-size="21" font-weight="700" fill="${NODE}">http.createServer(app)</text><text x="540" y="152" text-anchor="middle" font-size="17" fill="#555">ONE port · ONE TLS cert</text>
<line x1="262" y1="65" x2="396" y2="110" stroke="#555" stroke-width="3" marker-end="url(#m1)"/><line x1="262" y1="195" x2="396" y2="150" stroke="#555" stroke-width="3" marker-end="url(#m1)"/>
<rect x="830" y="30" width="260" height="70" rx="12" fill="${CAM}14" stroke="${CAM}" stroke-width="2.5"/><text x="960" y="62" text-anchor="middle" font-size="20" font-weight="700" fill="#9a4d08">Express routes</text><text x="960" y="88" text-anchor="middle" font-size="16" fill="#555">'request' event</text>
<rect x="830" y="160" width="260" height="70" rx="12" fill="${TIM}14" stroke="${TIM}" stroke-width="2.5"/><text x="960" y="192" text-anchor="middle" font-size="20" font-weight="700" fill="${TIM}">WebSocketServer</text><text x="960" y="218" text-anchor="middle" font-size="16" fill="#555">'upgrade' event → 101</text>
<line x1="682" y1="110" x2="826" y2="65" stroke="#555" stroke-width="3" marker-end="url(#m1)"/><line x1="682" y1="150" x2="826" y2="195" stroke="#555" stroke-width="3" marker-end="url(#m1)"/>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 11 — Realtime with WebSocket and Socket.IO', bai: '11.1' }, [
  { cover: true, t: 'From asking repeatedly<br>to being told:<br>WebSocket', sub: 'Polling asks. A socket is told. This lesson measures what the difference costs, byte by byte.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>Three ways to learn about something you did not ask for — and how to pick the weakest one that works</li>
<li>The WebSocket handshake, printed byte for byte, and the frames that follow it</li>
<li>Polling vs a socket, counted at the TCP socket — then multiplied by 10,000 users</li>
<li>The smallest useful server, sharing one port with Express</li>
<li>Four day-one traps, each reproduced: nginx, idle timeouts, send(object), no reconnect</li>
</ul>` + box('Why it matters to you', 'Chat, notifications, "someone is typing", a live dashboard: every product has one. After this lesson you can say what realtime costs in bytes and requests, and ship a socket that survives a real reverse proxy.', 'lam') },

  { t: 'Every request so far was the client\'s idea', to: true, giua: true, body: flow([
    { t: 'browser asks', s: 'GET /api/notes', mau: LAM }, { t: 'server answers', s: '200 + JSON', mau: NODE }, { t: 'connection idle', s: 'or closed', mau: '#64748b' }], { h: 130 }) +
    bang(['the server knows first…', 'HTTP can…'], [
      ['a new message arrived for you', 'only wait until you ask'],
      ['a friend came online', 'only wait until you ask'],
      ['the background job finished', 'only wait until you ask'],
    ], { co: 23 }) + box('The trick we used for twenty years', 'Ask again and again: "anything new?" — polling. This lesson measures what that trick costs, and what replaces it.', 'cam') },

  { t: 'Three ways to learn what you did not ask for', to: true, giua: true, body: cards([
    ['Polling', '"Anything new?" every N seconds. Works everywhere, needs nothing new — and pays a full HTTP request for an answer that is almost always "no".'],
    ['SSE — Server-Sent Events', 'One long HTTP response the server keeps writing into. One way only (server → client), plain HTTP, reconnects by itself. Notifications, progress bars.'],
    ['WebSocket', 'One TCP connection, both directions, tiny frames. The answer when the client also talks back: chat, typing indicators, games, collaborative editing.'],
  ], 3) + timeline },

  { t: 'An everyday picture', to: true, giua: true, body: bang(['', 'like…', 'cost when nothing happens'], [
    ['Polling every 3 s', 'calling the post office every 3 seconds: "any letter for me?"', 'a full call each time'],
    ['SSE', 'a radio: the station talks, you only listen', 'almost nothing'],
    ['WebSocket', 'a phone call left open: both sides can speak at any moment', 'a tiny "still there?" now and then'],
  ], { co: 23 }) + two(box('Same events, three contracts', 'API Design 10.4 measured all three on one flow: polling every 2 s saw events 1.1 s late on average; SSE and WebSocket in 1–5 ms. This lesson measures the BYTES.', 'lam'),
    box('Rule', 'Pick the WEAKEST one that solves the problem. A "new posts" banner does not need a two-way socket; a chat does.', 'xanh')) },

  { t: 'The handshake, printed byte for byte', to: true, giua: true, body: TT('c11/handshake', 2, 9, 'node handshake.mjs · a raw node:http server prints the upgrade request · \\r\\n made visible · real', { hl: [4, 5, 6], n: 100, sm: false }) +
    two(box('It starts as an ordinary GET', 'Cookies, TLS, your reverse proxy — everything you know about HTTP applies to this first request.', 'lam'),
      box('Sec-WebSocket-Key', '16 random bytes in base64, new for every connection. The server must prove it read it.', 'cam')) },

  { t: 'The answer: 101 Switching Protocols', to: true, giua: true, body: TT('c11/handshake', 10, 16, 'the server computes the accept value itself, then replies · real', { hl: [1, 3, 6], n: 100, sm: false }) +
    J(`const GUID = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';             // fixed by RFC 6455
const accept = crypto.createHash('sha1').update(key + GUID).digest('base64');`, { sm: false }) +
    box('After this line the socket stops speaking HTTP', 'Everything that follows is frames. A proxy that does not understand Upgrade will break here — slide 18 reproduces it.', 'do2') },

  { t: 'Three consequences of that shape', to: true, giua: true, body: cards([
    ['HTTP on the way in', 'The browser sends its cookies on the handshake. So a socket can reuse the SAME login as your REST API — lesson 11.3.'],
    ['101, then not HTTP', 'Every hop in between (nginx, a CDN, a corporate proxy) must understand Upgrade. Localhost has no hop, so it always works there.'],
    ['Accept proves the peer', 'sha1(key + a fixed GUID): only a real WebSocket server answers that. A cache replaying an old response cannot.'],
  ], 3) + flow([{ t: 'GET + Upgrade', s: 'cookies · TLS · proxy rules', mau: LAM }, { t: '101 Switching', s: 'last HTTP line', mau: CAM }, { t: 'frames', s: 'both directions, any time', mau: NODE }], { h: 130 }) +
    box('Each one is a support ticket later', '"Login works but the socket says 401" (cookie) · "works locally, 400 in production" (proxy) · "connects, then silence" (a cache or a proxy that never upgraded).', 'cam') },

  { t: 'After 101: a frame is a few bytes', to: true, giua: true, body: TT('c11/handshake', 17, 25, 'the same raw server decodes one frame by hand, then answers with one · real', { hl: [2, 3, 7], n: 100, sm: false }) +
    bang(['', 'header', 'payload', 'total'], [
      ['client → server (masked)', '2 + 4 mask bytes', '15', '21 bytes'],
      ['server → client', '2 bytes', '15', '17 bytes'],
    ], { co: 22 }) + box(`Round trip on an open socket: ${rtt} ms`, 'Median of 200 round trips on this machine. No headers, no cookies, no URL — just a frame.', 'xanh') },

  { t: 'Why the browser masks every frame', to: true, giua: true, body: two(box('The rule', 'Every frame from a client is XOR-ed with 4 random bytes chosen per frame. The server unmasks it (line "payload after XOR"). Frames from the server are never masked.', 'lam'),
    box('The reason', 'Old transparent proxies cache what looks like HTTP. If a malicious page could choose the exact bytes on the wire, it could forge a cached "response". Random masks make the bytes unpredictable.', 'cam')) +
    J(`// what the raw server did with the client's frame
const len = buf[1] & 0x7f, mask = buf.subarray(2, 6), data = buf.subarray(6, 6 + len);
const plain = Buffer.from(data.map((b, i) => b ^ mask[i % 4]));   // {"type":"ping"}`, { sm: false }) +
    box('You never write this', 'The ws library and every browser do it for you. Seeing it once means "a frame" is no longer magic: 2–14 bytes of header, then your data.', 'xanh') },

  { t: 'Measurement 1 — what polling actually costs', to: true, giua: true, body: TT('c11/poll-vs-ws', 2, 5, 'node poll-vs-ws.mjs · 20 polls, keep-alive, browser-like headers, bytes counted at the TCP socket · real', { hl: [4], n: 104, sm: false }) +
    thanh([['cookie', P.cookie, CAM, `${P.cookie} B`], ['body', P.body, NODE, `${P.body} B`], ['one poll', P.perPoll, DO, `${P.perPoll} B`]], { ghi: 'bytes per poll that answers "nothing new" · real' }) +
    box(`${P.perPoll} bytes to be told nothing happened`, `The answer is ${P.body} bytes; the rest is headers. The login cookie alone is ${P.cookie} bytes and rides along on EVERY poll. And this is the generous case: keep-alive, no new TCP or TLS handshake.`, 'do2') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'polling', 'WebSocket'], [
    ['who starts', 'the client, every N seconds', 'either side, any time'],
    ['per "event"', `a full request: ~${P.perPoll} bytes here`, 'a frame: 2–6 bytes + payload'],
    ['when nothing happens', 'still a full request each time', 'silence (plus a tiny heartbeat)'],
    ['what it reuses', 'everything HTTP', 'the handshake is HTTP; the rest is not'],
  ], { co: 23 }) + two(box('Remember', 'The handshake is HTTP, so cookies and proxies still matter. After 101 the per-message cost drops to almost nothing.', 'xanh'),
    box('Next', `The same information pushed over a socket — then both multiplied by ten thousand users.`, 'lam')) },

  // ───────────── phần B ─────────────
  { t: 'Measurement 2 — the same information over a socket', to: true, giua: true, body: TT('c11/poll-vs-ws', 6, 8, 'node poll-vs-ws.mjs · one handshake, then 20 REAL messages pushed down · real', { hl: [2], n: 104, sm: false }) +
    thanh([['20 polls', P.pollTot, DO, `${fmt(P.pollTot)} B · 0 delivered`], ['WebSocket', P.wsTot, NODE, `${fmt(P.wsTot)} B · 20 delivered`]], { ghi: 'total bytes, both directions · real' }) +
    box('Compare like for like', `Polling spent ${fmt(P.pollTot)} bytes to deliver ZERO messages. The socket spent ${fmt(P.wsTot)} bytes — handshake included — to deliver twenty: a ${P.wsMsg}-byte JSON message costs ${P.wsMsg + 2} bytes on the wire.`, 'xanh') },

  { t: 'Measurement 3 — multiply by your users', to: true, giua: true, body: TT('c11/poll-vs-ws', 9, 12, 'node poll-vs-ws.mjs · per-request numbers above, scaled to 10,000 open tabs for one hour · real', { hl: [3, 4], n: 104, sm: false }) +
    two(box('Twelve million requests to say nothing', `${P.gb} GB an hour. And each request also runs your auth middleware, looks up the session, writes an access-log line and takes an event-loop turn.`, 'do2'),
      box('An idle socket', `Socket.IO sends a heartbeat (ping + pong = ${P.ping} bytes, measured) every 25 s by default: ${P.idleMB} MB an hour for the same 10,000 users.`, 'xanh')) +
    box('It gets worse the way people "fix" it', 'Shorten the interval to feel faster and the cost grows in proportion: every 1 s is three times the numbers above.', 'cam') },

  { t: 'Polling is not always wrong', to: true, giua: true, body: bang(['situation', 'right tool', 'why'], [
    ['changes once an hour, a minute late is fine', 'poll every 60 s', '60 requests/hour/user, no new infrastructure'],
    ['a job status after 202 Accepted', 'poll with Retry-After', 'API Design 10.1 — the server tells you when'],
    ['notifications, progress, a dashboard', 'SSE', 'one way, plain HTTP, built-in resume'],
    ['chat, typing, games, co-editing', 'WebSocket', 'both directions, many small messages'],
  ], { co: 22 }) + two(box('The trap', 'A 2-second poll imitating realtime: socket-level cost with polling-level delay (API Design 10.4 measured 1.1 s average lateness for exactly that).', 'do2'),
    box('Ask two questions', 'Does the CLIENT also send, many times a minute? How late may the screen be? Answer those, then pick from the table — not from what is fashionable.', 'xanh')) },

  { t: 'The smallest useful server', to: true, giua: true, body: J(`import http from 'node:http';
import { WebSocketServer } from 'ws';
const server = http.createServer(app);          // the SAME HTTP server as Express
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws, req) => {             // req = the handshake: cookies are here
  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());    // data is a Buffer, NOT an object
    ws.send(JSON.stringify({ echo: msg }));     // you choose the format yourself
  });
  ws.on('close', () => { /* forget this client */ });
});
server.listen(3001);`, { sm: false, hl: [3, 4, 8, 9] }) +
    box('Note what it shares', 'One port, one TLS certificate, one reverse-proxy rule. Only requests carrying Upgrade become sockets; everything else is still Express.', 'lam') },

  { t: 'One server, two kinds of request', to: true, giua: true, body: onePort +
    two(box('\'request\' event', 'An ordinary GET goes to Express — even GET /ws without the Upgrade header (the next slide shows why that matters).', 'cam'),
      box('\'upgrade\' event', 'Only a request with Upgrade: websocket reaches the WebSocketServer, which answers 101 and keeps the TCP connection.', 'lam')) },

  { t: 'Trap 1 — the reverse proxy', to: true, giua: true, body: TT('c11/traps', 2, 9, 'node traps.mjs · nginx 1.27 in Docker in front of the same Node server · real', { hl: [2, 4, 6, 8], n: 104, sm: false }) +
    two(JW(`location /ws/ {
  proxy_pass http://backend;
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
}`, 60, [3, 4, 5], { sm: false }), box('Works on localhost, dies in production', 'Without the three lines nginx drops the Upgrade header: raw ws got Express\'s own 200, Socket.IO answered 400 Bad request. Never 101.', 'do2')) },

  { t: 'Trap 2 — the idle proxy timeout', to: true, giua: true, body: TT('c11/traps', 10, 12, 'node traps.mjs · proxy_read_timeout 3s (nginx default: 60s) · real', { hl: [2, 3], n: 104, sm: false }) +
    two(box('A quiet socket is a dead socket', 'Nobody spoke for 3 s, so nginx closed it: close code 1006 = "gone without a goodbye". With the default 60 s, every chat left open over lunch dies the same way.', 'do2'),
      box('Heartbeat', 'A tiny ping frame every second kept the other socket OPEN. Socket.IO does this for you (pingInterval); with raw ws you write it — lesson 11.3 measures it.', 'xanh')) +
    J(`const hb = setInterval(() => ws.ping(), 25_000);    // shorter than every idle timeout on the path
ws.on('close', () => clearInterval(hb));`, { sm: false }) },

  { t: 'Trap 3 — send() an object', to: true, giua: true, body: TT('c11/traps', 13, 15, 'node traps.mjs · the same object sent two ways · real', { hl: [2, 4], n: 100, sm: false }) +
    two(box('The ws library is strict', 'ws.send({ text: \'hi\' }) throws a TypeError at once. Annoying, but you find it on day one.', 'xanh'),
      box('The browser API is not', 'new WebSocket(…).send(obj) — the standard API, built into browsers and Node 22 — silently sends the string "[object Object]". The server receives garbage, no error anywhere.', 'do2')) +
    box('Fix', 'Always ws.send(JSON.stringify(obj)) and JSON.parse on the other side. (Socket.IO\'s emit serialises for you — lesson 11.2.)', 'lam') },

  { t: 'Traps 4 and 5 — reconnect and cookies', to: true, giua: true, body: cards([
    ['No built-in reconnect', 'A laptop that sleeps comes back with a dead socket. Raw ws does nothing about it: you write the retry with backoff yourself. Socket.IO ships it — and lesson 11.3 measures what it does NOT restore.'],
    ['Cookies ride only on the handshake', 'Look at the frame bytes on slide 9: no headers at all. Who the user is must be decided ONCE, at connect time, and stored on the socket — lesson 11.3.'],
  ], 2) + bang(['', 'on the handshake', 'on every frame'], [['cookies / Authorization', 'yes', 'no'], ['URL, query string', 'yes', 'no'], ['your JSON', '—', 'yes']], { co: 22 }) },

  { t: 'How cuongthai.com does it', to: true, giua: true, body: JW(`// src/index.ts
const server = http.createServer(app);
initSocketServer(server);                          // src/socket/messaging.socket.ts
// inside initSocketServer
io = new IOServer(httpServer, {
  transports: ['websocket', 'polling'],            // long-poll fallback kept ON PURPOSE
  pingInterval: 25000, pingTimeout: 60000,
});`, 92, [2, 3, 6], { sm: false }) +
    two(box('Socket.IO, on the same HTTP server', 'One port with the REST API. WebSocket-only "would break users behind corporate proxies that strip the upgrade header" — the comment in the code.', 'lam'),
      box('feed:has-new carries only a count', 'The socket says "3 new posts"; the client then calls REST for the posts. The socket payload stays tiny however big the feed is.', 'xanh')) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', `Your team wants a "new message" badge. Plan A: every open tab polls every 5 s. Plan B: one socket per tab. 2,000 users keep the site open for an hour. Using the numbers measured in this lesson (${P.perPoll} bytes per empty poll, a ${P.ping}-byte heartbeat every 25 s), estimate requests and bytes for each plan — and say which one you would ship, and why.`, '') +
    `<div data-k="dapan">${box('Answer', `A: 2,000 × 3,600 / 5 = 1,440,000 requests × ${P.perPoll} B ≈ ${(1440000 * P.perPoll / 1e9).toFixed(2)} GB, each request through auth + session lookup. B: 0 requests; 2,000 × 144 heartbeats × ${P.ping} B ≈ ${(2000 * 144 * P.ping / 1e6).toFixed(1)} MB, plus one handshake per tab. A badge only goes server → client, so SSE would also do; a socket wins if the same page also sends (typing, read receipts).`, 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Which status code ends the handshake, and why does a proxy care?</li>
<li>Why are frames from the browser masked and frames from the server not?</li>
<li>Most of a ${P.perPoll}-byte empty poll is not the answer. What is it?</li>
<li>nginx without the Upgrade lines: what does a raw ws client see?</li>
<li>Which one throws: ws.send(obj) in Node, or new WebSocket().send(obj) in a browser?</li>
</ol>
<div data-k="dapan">${box('Answers', `1. 101 Switching Protocols — after it the bytes are not HTTP, so every hop must understand Upgrade. &nbsp;2. So a page cannot choose the bytes on the wire and poison an old proxy cache. &nbsp;3. Headers — the cookie alone is ${P.cookie} bytes. &nbsp;4. A normal HTTP answer (here 200 from Express) instead of 101. &nbsp;5. The ws library throws; the browser API silently sends "[object Object]".`, 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Polling asks; a socket is told. Pick the weakest of polling / SSE / WebSocket that solves the problem</li>
<li>The handshake: an HTTP GET with Upgrade, answered by 101</li>
<li>After 101: frames of 2–14 header bytes. Measured: ${fmt(P.pollTot)} B for 20 empty polls vs ${fmt(P.wsTot)} B for 20 real messages</li>
<li>10,000 tabs polling every 3 s: 12 million requests and ${P.gb} GB an hour; idle sockets: ${P.idleMB} MB of heartbeats</li>
<li>Day one: proxy Upgrade lines, a heartbeat, JSON.stringify, your own reconnect</li>
</ul>` + box('Next: lesson 11.2', 'ws or Socket.IO — what convenience costs in memory per connection, what a broadcast really does to your event loop, and rooms: the addressing model of realtime.', 'lam') },
]);
