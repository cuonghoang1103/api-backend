/**
 * node-11-4 — Node.js · Chapter 11 · Lesson 11.4 "More than one process: adapters, sticky sessions, backpressure" (slide EN, đợt 9 — 01/11/2026).
 * MỘT deck, HAI tập: node-11-4 (slide 1–12) · node-11-4-2 (slide 13–25).
 *   A: khi nào có tiến trình thứ hai · phép đo 1 con bug không sinh lỗi (thật: B emit 0,34 ms, 0 socket, client không nhận) · room là Map trong RAM mỗi tiến trình ·
 *      phép đo 2 adapter (thật: B thấy socket ở A, nhận sau 2,23 ms) · adapter chạy thế nào · pub/sub phải hai kết nối (thật: ioredis + node-redis 4 đều từ chối) · bảng
 *   B: phép đo 3 sticky (thật: polling qua LB luân phiên ⇒ xhr post error; websocket OK; polling + sticky OK) · vì sao · hai cấu hình hợp lệ · adapter ≠ sticky ·
 *      phép đo 4 client chậm (thật: bufferedAmount 186,7 MB, RSS +186,5 MB, readyState 1, 0 lỗi; ngưỡng 1 MB bỏ 100/100) · event loop dùng chung (thật: chặn 5 s ⇒ 300/300 rớt,
 *      nối lại dồn: 135 / 172 lần trong 100 ms bận nhất) · website · sáu thứ gãy · bài tập · tự kiểm · tóm tắt chương
 * Nguồn: nodejs-11-4-scale-adapter-backpressure. Output THẬT: that/c11/{adapter,sticky,slow-client,herd} (Node 22.23.3, socket.io 4.8.4, @socket.io/redis-adapter 8.3.0,
 *   ioredis 5.11.1, redis 4.7.1, Redis 7.4.9 trong Docker `node11-redis` 127.0.0.1:4790, ws 8.22.1).
 * Khác web: adapter 2,23 ms (web 5,02) · client chậm +186,5 MB (web +192,4) · web ghi website nhân đôi "client ioredis" — thật là client `redis` (node-redis 4) ⇒ sửa web.
 */
import { lamDeck, two, box, cards, flow, bang, J, JW, TT, thanh, dong } from './_c9-chung.mjs';
import { ma } from './_node-chung.mjs';

export const deck = { key: 'node-11-4', code: 'NODE 11.4', title: 'More than one process: adapters, sticky sessions, backpressure', sub: 'Node.js — from zero to production' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const R = (ten, re) => dong(`c11/${ten}`, re);
const num = (s, re) => Number((s.match(re) ?? [0, 'NaN'])[1].replace(/,/g, ''));
const AD = { ms: num(R('adapter', /RECEIVED it/), /it ([\d.]+) ms/), emitNo: num(R('adapter', /:4762\)/), /"emitMs":([\d.]+)/) };
const SL = { buf: num(R('slow-client', /bufferedAmount/), /= ([\d.]+) MB/), add: num(R('slow-client', /^\s+RSS/), /\(\+([\d.]+) MB\)/), from: num(R('slow-client', /^\s+RSS/), /RSS ([\d.]+) MB/), to: num(R('slow-client', /^\s+RSS/), /-> ([\d.]+) MB/) };
const HD = { jit: num(R('herd', /0\.5 \(default\)/), /busiest 100 ms: (\d+)/), nojit: num(R('herd', /randomizationFactor 0 /), /busiest 100 ms: (\d+)/), spread: num(R('herd', /0\.5 \(default\)/), /and \+(\d+) ms/) };

// two processes, two Maps
const mapSvg = `<svg data-k="map" viewBox="0 0 1100 250" width="1100" height="250" font-family="Arial">
<rect x="10" y="10" width="500" height="230" rx="16" fill="${NODE}10" stroke="${NODE}" stroke-width="3"/><text x="260" y="46" text-anchor="middle" font-size="23" font-weight="700" fill="${NODE}">process A</text>
<rect x="40" y="70" width="440" height="140" rx="12" fill="#fff" stroke="${TIM}" stroke-width="2.5" stroke-dasharray="8 6"/><text x="260" y="108" text-anchor="middle" font-size="20" font-family="monospace" fill="${TIM}">rooms: Map {</text><text x="260" y="142" text-anchor="middle" font-size="20" font-family="monospace" fill="${TIM}">'thread:42' → { 📱 socket }</text><text x="260" y="176" text-anchor="middle" font-size="20" font-family="monospace" fill="${TIM}">}</text>
<rect x="590" y="10" width="500" height="230" rx="16" fill="${NODE}10" stroke="${NODE}" stroke-width="3"/><text x="840" y="46" text-anchor="middle" font-size="23" font-weight="700" fill="${NODE}">process B</text>
<rect x="620" y="70" width="440" height="140" rx="12" fill="#fff" stroke="${TIM}" stroke-width="2.5" stroke-dasharray="8 6"/><text x="840" y="108" text-anchor="middle" font-size="20" font-family="monospace" fill="${TIM}">rooms: Map {</text><text x="840" y="142" text-anchor="middle" font-size="20" font-family="monospace" fill="${DO}">(no 'thread:42' at all)</text><text x="840" y="176" text-anchor="middle" font-size="20" font-family="monospace" fill="${TIM}">}</text>
</svg>`;

export const slides = lamDeck({ chuong: 'Chapter 11 — Realtime with WebSocket and Socket.IO', bai: '11.4' }, [
  { cover: true, t: 'More than one process:<br>adapters, sticky sessions,<br>backpressure', sub: 'The day you add a second process, realtime breaks in the quietest way possible. This lesson reproduces it, fixes it, and measures what else breaks.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The bug that produces no error: two processes, one room, a message that goes nowhere</li>
<li>The Redis adapter: what it fixes, what it costs, and the one-connection trap</li>
<li>Sticky sessions — and why "websocket only" is a real choice</li>
<li>One slow client, +${SL.add} MB: backpressure you never see coming</li>
<li>The event loop as a shared resource: block it, and everyone reconnects at once</li>
</ul>` + box('Why it matters to you', 'A second container is the most normal thing in production — a scale-up, or a rolling deploy. After this lesson you know the three things to set up BEFORE it ships.', 'lam') },

  { t: 'When does a second process appear?', to: true, giua: true, body: cards([
    ['You scale up', 'Two containers behind a load balancer, or Node\'s cluster module with one worker per CPU.'],
    ['A rolling deploy', 'For a minute, the old and the new version run side by side — each with its own sockets.'],
    ['A separate worker', 'A job process (chapter 13) that wants to emit "your report is ready" — but holds no sockets at all.'],
  ], 3) + flow([{ t: 'browser', s: 'socket lives on A', mau: LAM }, { t: 'load balancer', s: 'picks A or B', mau: CAM }, { t: 'process A', s: 'has the socket', mau: NODE }, { t: 'process B', s: 'gets the POST /messages', mau: NODE }], { h: 130 }) +
    box('The common case', 'The socket lives on one process; the HTTP request that triggers the event lands on the other.', 'cam') },

  { t: 'Measurement 1 — the bug that produces no error', to: true, giua: true, body: TT('c11/adapter', 2, 7, 'node adapter.mjs · two identical Socket.IO processes, no adapter · real', { hl: [2, 3, 4, 5], n: 104, sm: false }) +
    two(box('Look at process B', `emit() returned in ${AD.emitNo} ms and reported nothing wrong. It fanned out to its OWN room — which is empty — correctly and instantly.`, 'do2'),
      box('In production this reads as', '"Messages arrive sometimes." Half the requests land on the right process. People blame the network for weeks.', 'cam')) +
    box('Why no test catches it', 'Every test runs ONE process. Locally there is no load balancer. The bug exists only in the topology of production.', 'lam') },

  { t: 'Why: a room is a Map in ONE process\'s memory', to: true, giua: true, body: mapSvg +
    two(box('Rooms are not shared', 'socket.join() writes into a Map inside the process that holds the socket. Process B has its own Map and has never heard of thread:42.', 'lam'),
      box('Same for any in-memory state', 'An online-users Set, a typing timer, a rate-limit counter: with two processes, each has its own copy — and each copy is wrong.', 'do2')) },

  { t: 'Measurement 2 — the Redis adapter', to: true, giua: true, body: JW(ma('c11/adapter', 24, 27), 100, [3, 4], { sm: false }) +
    TT('c11/adapter', 8, 13, 'node adapter.mjs · the same test, adapter on both processes · real', { hl: [4, 6], n: 104, sm: false }) +
    box('Three lines changed nothing else', 'Same handlers, same io.to(room).emit. B still has no local socket in the room (localSocketsInRoom: 0) — but the message now reaches the client on A.', 'xanh') },

  { t: 'What the adapter does', to: true, giua: true, body: flow([
    { t: 'B: io.to(room).emit', s: 'local room: empty', mau: NODE }, { t: 'Redis PUBLISH', s: 'one channel per namespace', mau: DO }, { t: 'A: SUBSCRIBE', s: 'receives the packet', mau: NODE }, { t: 'A\'s local room', s: '📱 the client', mau: LAM }], { h: 140 }) +
    cards([
      ['Room membership becomes cluster-wide', 'fetchSockets() on B now counts the socket living on A: socketsInRoomClusterWide = 1.'],
      ['The cost', `One Redis round trip per broadcast (here ${AD.ms} ms end to end) and two extra Redis connections per process.`],
      ['Not an optimisation', 'It is what keeps "send to this room" TRUE once there are two processes.'],
    ], 3) + box('Redis is now on the realtime path', 'If Redis goes down, cross-process broadcasts stop. Socket.IO course 5.3 measures that failure mode; plan for it like any other dependency.', 'cam') },

  { t: 'Why pub and sub need two connections', to: true, giua: true, body: TT('c11/adapter', 14, 15, 'node adapter.mjs · ONE connection, SUBSCRIBE, then GET · real', { hl: [1, 2], n: 100, sm: false }) +
    J(`const pub = new Redis(REDIS_URL);
const sub = pub.duplicate();            // MUST be its own connection
io.adapter(createAdapter(pub, sub));`, { sm: false, hl: [2] }) +
    two(box('A subscribed connection is in a different mode', 'After SUBSCRIBE, Redis accepts only (P|S)SUBSCRIBE, UNSUBSCRIBE, PING, QUIT and RESET on that connection — both client libraries refused GET.', 'lam'),
      box('Sharing one connection', 'Everything else your app does through that client fails or hangs. duplicate() gives the subscriber its own socket to Redis.', 'do2')) },

  { t: 'Not just Socket.IO: the same fan-out by hand', to: true, giua: true, body: two(box('API Design 10.4, measured', 'Two LabFlow instances, SSE clients: with events in process memory a dashboard on :4002 saw 0 of 10 bookings made on :4000. With a Redis Stream every instance reads: 10 of 10.', 'lam'),
    box('Same problem, two tools', 'Socket.IO\'s adapter uses Redis Pub/Sub (fire-and-forget). A Redis Stream also keeps the events, so it doubles as the replay log for Last-Event-ID. Chapter 12 measures both.', 'cam')) +
    bang(['', 'Pub/Sub (the adapter)', 'Stream'], [['a process that is down misses…', 'everything it was not subscribed for', 'nothing — it reads from its last id'], ['memory in Redis', 'none, messages are not stored', 'grows until you trim it'], ['used here for', 'broadcast to live sockets', 'events + replay (API Design 10.4)']], { co: 21 }) },

  { t: 'Where cuongthai.com stands', to: true, giua: true, body: JW(`async function attachRedisAdapter(server) {
  try {
    const base = await getRedis();                    // the shared node-redis client (package "redis")
    const pubClient = base.duplicate();
    const subClient = base.duplicate();
    await Promise.all([pubClient.connect(), subClient.connect()]);
    server.adapter(createAdapter(pubClient, subClient));
  } catch (err) {
    logger.warn('Socket.IO Redis adapter NOT attached — in-memory only (single instance)');
  }
}`, 100, [4, 5, 9], { sm: false }) + box('The right trade for one container', 'Redis down ⇒ realtime keeps working in memory. The moment a second instance exists, the adapter is what stops measurement 1 from happening.', 'xanh') },

  { t: 'Part 1 in one table', to: true, giua: true, body: bang(['', 'one process', 'two processes, no adapter', 'two processes + Redis adapter'], [
    ['io.to(room).emit from the other process', 'n/a', 'reaches nobody, no error', `delivered (${AD.ms} ms here)`],
    ['fetchSockets() / room counts', 'right', 'per process — wrong', 'cluster-wide'],
    ['extra Redis connections', '0', '0', '2 per process'],
  ], { co: 21 }) + two(box('Remember', 'Rooms live in one process\'s memory. The adapter is what keeps the model true across processes.', 'xanh'),
    box('Next', 'The adapter fans out broadcasts. It does NOT move a session between processes — that is sticky sessions.', 'lam')) },

  // ───────────── phần B ─────────────
  { t: 'Measurement 3 — sticky sessions', to: true, giua: true, body: TT('c11/sticky', 2, 4, 'node sticky.mjs · two Socket.IO processes behind a load balancer that sends each NEW TCP connection to the other one · real', { hl: [1, 2, 3], n: 104, sm: false }) +
    cards([
      ['polling, round-robin', 'Failed at connect: the session was created on A, the next request landed on B.'],
      ['websocket, round-robin', 'One TCP connection, accepted by A, stays on A. Affinity for free.'],
      ['polling, sticky', 'Every request of the client goes to the same process: works.'],
    ], 3) + box('How the load balancer was built', 'A few lines of node:net: each new TCP connection goes to the other backend (round-robin), or always to A (sticky). The counts on the right are the connections it routed.', 'lam') },

  { t: 'Why long-polling needs affinity', to: true, giua: true, body: bang(['request', 'carries', 'lands on (round-robin)', 'result'], [
    ['GET …transport=polling (handshake)', '—', 'A', 'A creates session sid=Xy…'],
    ['POST …sid=Xy… (the connect packet)', 'sid', 'B', 'B answers 400 ⇒ the client reports "xhr post error"'],
  ], { co: 21 }) + TT('c11/sticky', 5, 5, 'node sticky.mjs · a request carrying a session id that A created, sent straight to B · real', { hl: [1], n: 104, sm: false }) + two(box('Long-polling = MANY requests, one session', 'The session lives in the memory of the process that created it. Any request that lands elsewhere is a stranger.', 'lam'),
    box('A WebSocket = ONE connection', 'Once upgraded, the TCP connection stays on the process that accepted it. Nothing to route.', 'xanh')) },

  { t: 'Two valid configurations', to: true, giua: true, body: cards([
    ['Enable sticky sessions', 'The load balancer routes by cookie or by IP hash, so every request of a session reaches the same process. Keeps the long-poll fallback for users behind upgrade-stripping proxies.'],
    ['Or transports: [\'websocket\']', 'No sticky needed — there is only ever one connection. Price: a user whose proxy blocks the upgrade gets nothing at all.'],
  ], 2) + J(`# nginx: same client IP ⇒ same backend
upstream realtime { ip_hash; server app1:3000; server app2:3000; }`, { sm: false }) +
    box('The adapter and sticky solve different halves', 'Adapter: a broadcast reaches sockets on every process. Sticky: one client\'s requests reach one process. Two processes with polling on need BOTH.', 'cam') },

  { t: 'Measurement 4 — one slow client', to: true, giua: true, body: TT('c11/slow-client', 2, 5, 'node slow-client.mjs · the client stops reading (a phone on a dying network); the server keeps sending · real', { hl: [2, 3, 4], n: 104, sm: false }) +
    thanh([['RSS before', SL.from, NODE, `${SL.from} MB`], ['RSS after', SL.to, DO, `${SL.to} MB (+${SL.add})`]], { ghi: 'server process RSS · ONE slow client · real' }) +
    box('Everything says "fine"', 'readyState 1 = OPEN. send() returned normally, zero errors. The bytes TCP could not deliver are queued in YOUR process.', 'do2') },

  { t: 'Look before you write', to: true, giua: true, body: J(`const LIMIT = 1 * 1024 * 1024;                 // 1 MB queue per socket
function sendTo(ws, payload) {
  if (ws.bufferedAmount > LIMIT) {
    // this client cannot keep up: drop it — or ws.terminate() and let it refetch over REST
    return false;
  }
  ws.send(payload);
  return true;
}`, { sm: false, hl: [3, 5] }) +
    TT('c11/slow-client', 6, 6, 'the same slow client, guarded · real', { hl: [1], n: 104, sm: false }) +
    box('Dropping is correct — because of lesson 11.3', 'The socket is a signal, REST is the truth. A client that missed frames refetches and is whole again. (Socket.IO: socket.conn.transport.writable / volatile emits.)', 'xanh') },

  { t: 'The other shared resource: the event loop', to: true, giua: true, body: TT('c11/herd', 2, 3, 'node herd.mjs · 300 Socket.IO clients, pingInterval 1 s + pingTimeout 2 s, the server blocks its loop for 5 s · real', { hl: [1, 2], n: 104, sm: false }) +
    cards([
      ['Block longer than the heartbeat', 'No pings go out ⇒ every client decides the server is dead: 300 of 300 dropped.'],
      ['Then everyone comes back', `In the busiest 100 ms, ${HD.jit} reconnects (default jitter) or ${HD.nojit} (no jitter). A thundering herd made by one slow loop.`],
      ['Jitter spreads the tail, not the head', `Retries waiting in the TCP backlog all land the moment the loop is free; jitter only spreads the rest over ~${(HD.spread / 1000).toFixed(0)} s.`],
    ], 3) },

  { t: 'Why chapter 10 queues image work', to: true, giua: true, body: flow([
    { t: 'one upload', s: 'sharp re-encodes: pure CPU', mau: CAM }, { t: 'the event loop', s: 'shared by every socket', mau: DO }, { t: 'every open socket', s: 'heartbeats late', mau: LAM }], { h: 130 }) +
    two(box('On an HTTP server', 'A blocked loop = slow requests (chapter 2).', 'lam'), box('On a realtime server', 'A blocked loop = missed heartbeats = mass disconnects = a reconnect storm.', 'do2')) +
    box('The rule', 'CPU spent on one request is latency added to every socket. Move heavy work to worker threads or a queue (chapter 13), and keep handlers short.', 'xanh') +
    box('How you notice', 'Watch event-loop delay (chapter 15) next to the count of disconnects with reason "ping timeout". When both spike together, a handler is blocking.', 'cam') },

  { t: 'How cuongthai.com runs it', to: true, giua: true, body: cards([
    ['Adapter attached, with a fallback', 'Two duplicates of the shared node-redis client; if Redis is unreachable it logs a warning and stays in memory.'],
    ['transports: [\'websocket\', \'polling\']', 'Fallback kept on purpose — which is exactly the setting that REQUIRES sticky sessions before a second container ships.'],
    ['pingInterval 25000 · pingTimeout 60000', 'Forgiving to phones on bad networks; a ghost can show "online" for up to 85 s (measured in 11.3).'],
  ], 3) + J(`io = new IOServer(httpServer, {
  transports: ['websocket', 'polling'],   // ⇒ sticky sessions required before a 2nd container
  pingInterval: 25000, pingTimeout: 60000,
});
void attachRedisAdapter(io);              // best effort: falls back to in-memory`, { sm: false, hl: [2, 5] }) +
    box('Worth writing on the wall', 'Before a second backend container: sticky sessions on the load balancer, the Redis adapter verified (watch for the warning), presence state moved to Redis.', 'cam') },

  { t: 'Six things that break at the second process', to: true, giua: true, body: cards([
    ['No adapter', 'Measurement 1: silent, half the messages go nowhere.'],
    ['One Redis connection for pub and sub', 'A subscribed connection refuses every other command.'],
    ['Polling on, no sticky', 'Handshakes fail behind a round-robin load balancer.'],
    ['In-memory state', 'An online-users Set per process: "who is online" is now wrong. Move it to Redis.'],
    ['Restart every container at once', 'Every client reconnects in the same second. Stagger deploys; keep reconnect jitter on.'],
    ['Unbounded bufferedAmount', 'One bad network becomes an out-of-memory kill.'],
  ], 3) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'Your chat app runs in ONE container. Next week ops scales it to two, behind a round-robin load balancer, with a rolling deploy. Socket.IO keeps its defaults (polling + websocket), and online users live in a Set in memory. List what breaks, in the order users will notice, and the fix for each.', '') +
    `<div data-k="dapan">${box('Answer', '1. Connections fail at the handshake (polling, no affinity) ⇒ sticky sessions on the LB, or transports: [\'websocket\']. 2. Messages "sometimes" missing (no adapter) ⇒ @socket.io/redis-adapter with separate pub and sub connections. 3. Wrong online lists (Set per process) ⇒ presence in Redis, with a TTL. 4. A reconnect storm at each deploy ⇒ stagger the rollout, keep jitter. 5. Still: a bufferedAmount limit per socket and a REST catch-up path.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Process B emits to a room whose socket lives on A, with no adapter. What happens, and what is logged?</li>
<li>Why must the adapter's pub and sub be two Redis connections?</li>
<li>Why does long-polling fail behind a round-robin load balancer, while websocket works?</li>
<li>A client stops reading. What does send() return, and where do the bytes go?</li>
<li>Why can one CPU-heavy request disconnect every client?</li>
</ol>
<div data-k="dapan">${box('Answers', `1. Nothing is delivered; nothing is logged — B's room is empty. &nbsp;2. A subscribed connection only accepts subscribe commands. &nbsp;3. Polling is many requests on one session; a WebSocket is one connection that stays. &nbsp;4. It returns normally; the bytes queue in the server (bufferedAmount): +${SL.add} MB here. &nbsp;5. A blocked loop sends no heartbeats ⇒ ping timeout everywhere ⇒ a reconnect storm.`, 'xanh')}</div>` },

  { t: 'Chapter 11 in five lines', to: true, giua: true, body: `<ul>
<li>11.1 · Polling asks, a socket is told: the handshake is HTTP, then frames of a few bytes</li>
<li>11.2 · Socket.IO ≈ 2× memory per connection; a broadcast is a loop — design rooms small</li>
<li>11.3 · Authenticate once, authorize every handler; the socket is a signal, REST is the truth</li>
<li>11.4 · A second process needs an adapter, sticky sessions (or websocket-only), and a bufferedAmount limit</li>
</ul>` + box('Next: chapter 12 — Redis', 'The adapter used Redis as a megaphone. Chapter 12 measures Redis itself: round trips, pipelines, cache-aside, atomicity, Pub/Sub vs Streams.', 'lam') },
]);
