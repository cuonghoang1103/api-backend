/**
 * sio-05-4 — Socket.IO · Chapter 5 · Lesson 5.4 "Scale checklist: five things before you add a worker" (deck video + web, 13/11/2026).
 * Bài web: io-5-4-checklist. Output THẬT (scratchpad/sio/demo/n5-4.txt · socket.io 4.8.3 · Node 22.23.3):
 * tat: chép shutdown của src/index.ts (server.close(cb), hẹn 30 s, không io.close) + docker stop (SIGTERM, 10 s, SIGKILL): server.close KHÔNG BAO GIỜ xong khi còn WebSocket,
 *   vẫn phục vụ tới 11,1 s rồi bị SIGKILL ⇒ 20 client "transport close". io.close() trước ⇒ xong 4 ms, exit 0, client cũng "transport close" và tự nối lại.
 * lech: 3 worker, 300 client sticky; tắt worker 2 ⇒ 150/0/150; worker 2 lên lại ⇒ vẫn 150/0/150 (max/min ∞).
 * kho: nginx upstream backend một server · io.close() = 0 chỗ · stop_grace_period chỉ ở nginx (dòng 410) · prom-client 0 · index.ts:822 server.close, :846 30_000.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n5-4:file:tat.mjs": "// Graceful shutdown, đo THẬT. Tiến trình con = server Socket.IO, 20 client WebSocket nối vào. Lúc 1 s gửi SIGTERM như `docker stop`;\n// docker mặc định chờ 10 s rồi SIGKILL (compose của kho không đặt stop_grace_period cho backend).\n// kieu 'kho' = chép src/index.ts: server.close(cb) + hẹn 30 s exit(1), KHÔNG io.close(). kieu 'dung' = io.close() trước.\nimport { fork } from 'node:child_process';\nimport http from 'node:http';\nimport { Server } from 'socket.io';\nconst [, , vai, kieu] = process.argv;\nif (vai === 'con') {\n  const t0 = Date.now(); const s = () => ((Date.now() - t0) / 1000).toFixed(2).replace('.', ',') + ' s';\n  const server = http.createServer(); const io = new Server(server);\n  io.on('connection', (x) => x.on('ping-app', (cb) => cb('pong')));\n  server.listen(19751, () => process.send('san-sang'));\n  process.on('SIGTERM', () => {\n    console.log(`  [server] SIGTERM · ${io.engine.clientsCount} client đang nối`);\n    const t = Date.now();\n    if (kieu === 'dung') io.close(() => { console.log(`  [server] io.close xong sau ${Date.now() - t} ms ⇒ exit(0)`); process.exit(0); });\n    else server.close(() => { console.log(`  [server] HTTP server closed sau ${Date.now() - t} ms ⇒ exit(0)`); process.exit(0); });\n    setTimeout(() => { console.log('  [server] Could not close connections in time ⇒ exit(1)'); process.exit(1); }, 30_000);\n  });\n} else {\n  const { io: ketNoi } = await import('socket.io-client');\n  const t0 = Date.now(); const s = (ms = Date.now() - t0) => (ms / 1000).toFixed(2).replace('.', ',') + ' s';\n  const con = fork(new URL(import.meta.url).pathname, ['con', kieu], { stdio: ['inherit', 'inherit', 'inherit', 'ipc'] });\n  await new Promise((ok) => con.once('message', ok));\n  const ds = Array.from({ length: 20 }, () => ketNoi('http://localhost:19751', { transports: ['websocket'], forceNew: true, reconnectionDelayMax: 1000 }));\n  await Promise.all(ds.map((c) => new Promise((ok) => c.once('connect', ok))));\n  const ly = new Map(); let lucDau = null;\n  ds.forEach((c) => c.on('disconnect', (r) => { lucDau ??= Date.now() - t0; ly.set(r, (ly.get(r) ?? 0) + 1); }));\n  let ketThuc = null; con.on('exit', (code, sig) => { ketThuc = `${s()} tiến trình server kết thúc · code ${code} · signal ${sig}`; });\n  console.log(`— ${kieu === 'dung' ? 'io.close() trước' : 'chép src/index.ts: server.close(cb), không io.close()'} —`);\n  setTimeout(() => { console.log(`${s()} ⚡ docker stop ⇒ SIGTERM`); con.kill('SIGTERM'); }, 1000);\n  setTimeout(async () => { const r = await ds[0].timeout(500).emitWithAck('ping-app').catch((e) => 'lỗi: ' + e.message); console.log(`${s()} client 0 hỏi ping-app trong lúc chờ ⇒ ${r}`); }, 3000);\n  setTimeout(() => { if (con.exitCode === null) { console.log(`${s()} ⚡ hết 10 s ân hạn ⇒ docker gửi SIGKILL`); con.kill('SIGKILL'); } }, 11000);\n  await new Promise((ok) => setTimeout(ok, 12500));\n  console.log(ketThuc);\n  console.log(`  client: ngắt lần đầu lúc ${lucDau === null ? '—' : s(lucDau)} · lý do ${JSON.stringify(Object.fromEntries(ly))} · sau đó ${ds.filter((c) => c.active).length}/20 đang tự nối lại`);\n  ds.forEach((c) => c.close()); process.exit(0);\n}\n",
 "n5-4:tat": "$ node tat.mjs cha kho\n— chép src/index.ts: server.close(cb), không io.close() —\n1,10 s ⚡ docker stop ⇒ SIGTERM\n  [server] SIGTERM · 20 client đang nối\n3,10 s client 0 hỏi ping-app trong lúc chờ ⇒ pong\n11,10 s ⚡ hết 10 s ân hạn ⇒ docker gửi SIGKILL\n11,11 s tiến trình server kết thúc · code null · signal SIGKILL\n  client: ngắt lần đầu lúc 11,11 s · lý do {\"transport close\":20} · sau đó 20/20 đang tự nối lại\n$ node tat.mjs cha dung\n— io.close() trước —\n1,11 s ⚡ docker stop ⇒ SIGTERM\n  [server] SIGTERM · 20 client đang nối\n  [server] io.close xong sau 4 ms ⇒ exit(0)\n3,61 s client 0 hỏi ping-app trong lúc chờ ⇒ lỗi: operation has timed out\n1,11 s tiến trình server kết thúc · code 0 · signal null\n  client: ngắt lần đầu lúc 1,11 s · lý do {\"transport close\":20} · sau đó 20/20 đang tự nối lại",
 "n5-4:file:lech.mjs": "// Per-worker metric bắt được gì: 3 worker, 300 client gán sticky theo băm id (như ip_hash) — worker chết thì sang worker kế.\n// Rolling restart worker 2: client của nó nối lại sang worker 1/3; worker 2 lên lại nhưng sticky giữ họ ở chỗ mới.\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nconst ws = new Map(); const mo = (k) => { const io = new Server(19751 + k); ws.set(k, io); };\n[1, 2, 3].forEach(mo);\nconst song = () => [1, 2, 3].filter((k) => ws.has(k));\nconst chon = (id, ghim) => { if (ghim.w && ws.has(ghim.w)) return ghim.w;          // sticky: còn sống thì giữ chỗ cũ\n  const muon = (id % 3) + 1; ghim.w = ws.has(muon) ? muon : song()[id % song().length]; return ghim.w; };\nconst cl = [];\nconst noi = (id, ghim) => { const c = ketNoi(`http://localhost:${19751 + chon(id, ghim)}`, { transports: ['websocket'], forceNew: true, reconnection: false });\n  c.on('disconnect', () => setTimeout(() => cl[id] = noi(id, ghim), 200 + (id % 10) * 30)); return c; };\nconst ghimDs = Array.from({ length: 300 }, () => ({}));\nfor (let id = 0; id < 300; id++) cl[id] = noi(id, ghimDs[id]);\nconst in_ = (nhan) => { const n = [1, 2, 3].map((k) => ws.get(k)?.engine.clientsCount ?? 0); const ds = n.filter((x) => x > 0);\n  console.log(`${nhan.padEnd(34)} socket_io_connected w1=${String(n[0]).padStart(3)} w2=${String(n[1]).padStart(3)} w3=${String(n[2]).padStart(3)} · max/min = ${Math.min(...n) ? (Math.max(...n) / Math.min(...n)).toFixed(1).replace('.', ',') : '∞'}`); };\nawait cho(1500); in_('đầu ngày');\nws.get(2).close(); ws.delete(2); await cho(2000); in_('worker 2 đang deploy (tắt)');\nmo(2); await cho(2000); in_('worker 2 lên lại');\nawait cho(3000); in_('5 s sau');\nprocess.exit(0);\n",
 "n5-4:lech": "$ node lech.mjs\nđầu ngày                           socket_io_connected w1=100 w2=100 w3=100 · max/min = 1,0\nworker 2 đang deploy (tắt)         socket_io_connected w1=150 w2=  0 w3=150 · max/min = ∞\nworker 2 lên lại                   socket_io_connected w1=150 w2=  0 w3=150 · max/min = ∞\n5 s sau                            socket_io_connected w1=150 w2=  0 w3=150 · max/min = ∞",
 "n5-4:kho": "$ grep -n \"upstream backend\" -A3 nginx/nginx.conf\n128: upstream backend {\n129- server cuonghoangdev_backend:3001;\n130- keepalive 32;\n131- }\n$ grep -n \"io.close\\|stop_grace_period\\|clientsCount\\|prom-client\" -r src docker-compose.yml package.json | grep -v test\n410: stop_grace_period: 30s\n0\n$ grep -n \"server.close(async\\|30_000\\|process.on('SIGTERM'\" src/index.ts\n822: server.close(async () => {\n846: }, 30_000);\n849: process.on('SIGTERM', () => shutdown('SIGTERM'));"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, cmp, box, two, steps, kw, c, tsx, bars, seq } from './_sio-chung.mjs';

export const deck = { key: 'sio-05-4', code: 'SIO 5.4', title: 'Scale checklist: five things before you add a worker', sub: 'Chapter 5 · Lesson 5.4' };
const O = (k) => { const v = DU_LIEU[`n5-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const TAT = O('tat'), LECH = O('lech').split('\n').filter((l) => !l.startsWith('$ ')), KHO = O('kho');
const [KHO_T, DUNG_T] = TAT.split('$ node tat.mjs cha dung').map((x) => x.split('\n').filter((l) => l && !l.startsWith('$ ')).join('\n'));
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const msDung = m(/io\.close xong sau (\d+) ms/, DUNG_T)[1];
const L = LECH.map((l) => { const x = /^(.*?)\s+socket_io_connected w1=\s*(\d+) w2=\s*(\d+) w3=\s*(\d+)/.exec(l); return x && { t: x[1], n: [+x[2], +x[3], +x[4]] }; }).filter(Boolean);

/** Năm mục, mỗi mục một ô: số · tên · hỏng gì nếu thiếu. */
const nam = () => {
  const it = [['1', 'Sticky sessions', 'polling handshakes land on the wrong worker ⇒ 400', '2.3'], ['2', 'Adapter attached — and logged', 'broadcasts reach 1/N, silently', '5.1–5.3'],
    ['3', 'State by userId, not sid / process', 'presence and counters lie per worker', '1.5 · 4.3'], ['4', 'Per-worker metrics', 'an empty or overloaded worker nobody sees', 'this lesson'],
    ['5', 'Graceful shutdown', 'every deploy waits for SIGKILL', 'this lesson']];
  return `<div style="display:grid;grid-template-columns:repeat(5,1fr);gap:10px">${it.map(([n, t, h, b]) => `<div style="border:2.5px solid #0e7490;border-radius:14px;padding:10px 12px;background:#0e749010">
    <div style="font:900 30px Arial;color:#0e7490">${n}</div><div style="font:800 19px Arial;color:#0b1f2a;margin:4px 0 6px">${t}</div>
    <div style="font:16px Arial;color:#c0392b">✗ ${h}</div><div style="font:15px Arial;color:#475569;margin-top:6px">lesson ${b}</div></div>`).join('')}</div>`;
};

export const S = [
  { cover: true, nhan: 'Chapter 5 · Lesson 5.4', t: 'Scale checklist:<br>five things before worker 2', sub: 'Sticky, adapter, state, metrics, shutdown — each one measured, and this repo audited against all five',
    en: 'Lesson five point four: the scale checklist, five things before you add a second worker. Each is measured, and this repo is audited against all five.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>The five items in order, and the silent bug each one prevents</li>
    <li>The checklist on the web page says ${c('hash $cookie_io')} — lesson 2.3 measured that it breaks</li>
    <li>This repo's shutdown never finishes while WebSockets are open: deploys end in ${c('SIGKILL')}</li>
    <li>${c('io.close()')} first: exit in ${msDung} ms — and clients reconnect (which is what you want)</li>
    <li>A rolling restart plus sticky sessions leaves a worker empty — only per-worker metrics show it</li></ul>`,
    en: 'Five takeaways: the five items and the bug each prevents; the web checklist names a sticky method that lesson two point three measured as broken; this repo\'s shutdown never finishes while WebSockets are open; io dot close first exits in milliseconds; and a rolling restart can leave a worker empty.' },
  { t: 'The checklist: five items, in order', body: nam() + two(
      box('Why the order', 'Without sticky sessions the handshake itself fails, so nothing else can be tested. Without the adapter, state and metrics are per-worker by accident. Shutdown comes last because it only matters once deploys are frequent.', 'info'),
      box('Correction to item 1', `The web page says “nginx ${c('hash $cookie_io')}”. Measured in lesson 2.3: the first handshake has no cookie, nginx hashes an empty key ⇒ 3 of 5 sessions got 400. Use ${c('ip_hash')}, or WebSocket-only clients.`, 'bad')),
    en: 'The checklist, five items in order: sticky sessions, the adapter attached and logged, state by user id, per worker metrics, graceful shutdown. One correction: the web page says hash cookie io; lesson two point three measured that it breaks. Use ip hash, or WebSocket only clients.' },
  { t: 'Item 5 measured: this repo under docker stop', body: tn(KHO_T, { fs: 15, wrap: 120 }) + seq(['docker', 'backend (repo code)', '20 clients'], [
      [0, 1, 'SIGTERM'], [1, 1, 'server.close(cb): stop accepting, WAIT for connections'], [1, 2, 'still serving: ping-app ⇒ pong (3.1 s)', '#1f8a3b'],
      [0, 1, '10 s later: SIGKILL', '#c0392b'], [1, 2, 'transport close × 20', '#c0392b']], { w: 1110, rh: 30, fs: 15 }),
    en: 'Item five measured: this repo\'s shutdown under docker stop. On SIGTERM it calls server dot close and waits for connections to end. WebSockets never end on their own, so the callback never fires. It keeps serving for ten seconds, then docker sends SIGKILL and all twenty clients see transport close.' },
  { t: 'Why server.close() never finishes', body: two(
      box('server.close waits', 'It stops accepting new connections and calls back when every open connection has ended. An upgraded WebSocket is a connection that never ends on its own — so the callback never fires.', 'bad'),
      box('Two timers, the wrong one wins', `The repo force-exits after ${c('30_000')} ms (index.ts:846). docker-compose sets ${c('stop_grace_period')} only for nginx (line 410); the backend gets docker's default <b>10 s</b> — SIGKILL arrives first, every deploy.`, 'bad')) +
    tn(KHO, { fs: 14, wrap: 120 }),
    en: 'Why server close never finishes: it waits for every open connection, and a WebSocket never ends on its own. The repo force exits after thirty seconds, but the backend has docker\'s default ten second grace period, so SIGKILL always wins.' },
  { t: 'The fix: io.close() first', body: tsx(`process.on('SIGTERM', () => {
  io.close(() => {                 // closes every socket AND the HTTP server
    prisma.$disconnect().finally(() => process.exit(0));
  });
  setTimeout(() => process.exit(1), 8_000).unref();   // < docker's 10 s
});`, { fs: 16 }) + tn(DUNG_T.split('\n').filter((l) => !l.startsWith('—')).join('\n'), { fs: 14, wrap: 120 }) + two(
      box('Measured', `${c('io.close()')}: <b>${msDung} ms</b>, exit 0. All 20 clients saw ${c('transport close')} and reconnected at once.`, 'ok'),
      box('Correction', `The web page says clients see “io server disconnect” after ${c('io.close()')}. Measured: <b>transport close</b> — good, since “io server disconnect” stops auto-reconnect (5.2).`, 'info')),
    en: 'The fix: io dot close first. It closes every socket and the HTTP server; measured, it finished in four milliseconds and the process exited with code zero. Clients saw transport close and reconnected at once, which is exactly what you want in a rolling deploy.' },
  { t: 'Item 4 measured: a rolling restart empties a worker', body: tn(LECH.join('\n'), { fs: 17, wrap: 110 }) + bars(
      L.slice(-1).flatMap((r) => [['after · w1', r.n[0], '#0e7490'], ['after · w2', r.n[1], r.n[1] ? '#0e7490' : '#c0392b'], ['after · w3', r.n[2], '#0e7490']]),
      { don: 'sockets', nhan: 200, rh: 42, fs: 18 }) + box('Nothing is broken — that is the problem', 'Sticky sessions keep the 100 clients that moved off worker 2 where they landed. Worker 2 comes back healthy, with 0 sockets, while 1 and 3 carry 150. No error, no failed health check — only a per-worker gauge shows max/min = ∞.', 'info'),
    en: 'Item four measured: a rolling restart empties a worker. Three workers, a hundred sticky clients each. Worker two restarts; its clients move to one and three, and stay there. Worker two comes back healthy with zero sockets. Nothing errors; only a per worker gauge shows it.' },
  { t: 'Per-worker metrics: what to export', body: cmp(['Metric', 'Kind', 'Source', 'Alert when'], [
      [c('socket_io_connected{worker}'), 'gauge', c('io.engine.clientsCount'), 'max/min > 2 for 10 min'],
      [c('socket_io_events_in_total'), 'counter', c('socket.onAny')],
      [c('socket_io_events_out_total'), 'counter', 'wrap emit / adapter.broadcast', 'rate spike vs connected'],
      [c('socket_io_adapter_up'), 'gauge', c('pub.isReady') + ' · adapter name', '0 for 30 s (lesson 5.3)'],
      [c('process_cpu / event_loop_lag'), 'gauge', 'perf_hooks', 'one worker hotter than the rest'],
    ].map((r) => r.length === 3 ? [...r, 'rate per worker'] : r), { hl: [0] }) + box('This repo', `${c('prom-client')} in package.json: 0. No per-worker gauge exists yet — fine with one container, required before the second.`, 'info'),
    en: 'Per worker metrics to export: connected sockets per worker as a gauge, events in and out as counters, an adapter up gauge from lesson five point three, and event loop lag. Alert when max over min passes two. This repo has none yet.' },
  { t: 'This repo against the checklist', body: cmp(['#', 'Item', 'This repo (13/11/2026)', 'Before worker 2'], [
      ['1', 'Sticky sessions', 'one upstream server (nginx.conf:128) — not needed yet', 'ip_hash or WebSocket-only'],
      ['2', 'Adapter attached + logged', 'attached best-effort; late attach loses rooms, no WARN (5.1, 5.3)', 'await attach before listen; log adapter name'],
      ['3', 'State by userId', 'presence counts with an in-process Set; call check reads local rooms (4.3, 5.2)', 'Redis set + TTL or fetchSockets'],
      ['4', 'Per-worker metrics', 'none (prom-client 0)', 'connected gauge + adapter_up'],
      ['5', 'Graceful shutdown', 'server.close never finishes; SIGKILL at 10 s; no io.close()', 'io.close() + timer < grace period'],
    ], { hl: [1, 4] }) + box('Verdict', 'Correct for one container today. Adding a second backend container without items 2, 3 and 5 would ship silent bugs that pass every test on a laptop.', 'bad'),
    en: 'This repo against the checklist. Sticky: one upstream, not needed yet. Adapter: attached best effort, but late attach loses rooms. State: presence counted in process. Metrics: none. Shutdown: never finishes, SIGKILL at ten seconds. Correct for one container; not ready for two.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Sticky session', 'one client ⇒ one worker for the whole polling session'), kw('Adapter attached', 'verified by a startup log, not assumed'),
      kw('State by userId', 'survives reconnects and lives where every worker can see it'), kw('Per-worker metric', 'a gauge labelled by worker: spot imbalance'),
      kw('Graceful shutdown', 'io.close(), then exit — before the grace period ends'), kw('Grace period', 'docker stop waits 10 s by default, then SIGKILL'),
      kw('Rolling restart', 'one worker at a time — sticky clients do not move back'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: sticky session; adapter attached; state by user id; per worker metric; graceful shutdown; the grace period; and rolling restart.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Copy this repo\'s SIGTERM handler, open 20 WebSockets, docker stop: when does it exit?',
      'Add io.close() first; measure exit time and the client\'s disconnect reason',
      'Three sticky workers, restart one: print connected per worker',
      'Score your own service against the five items',
    ]), box('Keep these', `<ul><li>Sticky ⇒ adapter ⇒ state ⇒ metrics ⇒ shutdown</li><li>hash $cookie_io breaks; ip_hash works</li><li>server.close waits forever on WebSockets</li><li>io.close() first, timer under 10 s</li><li>Imbalance is silent: export per-worker gauges</li></ul>`, 'info'), ''),
    en: 'Your turn: copy the repo\'s shutdown handler and time a docker stop; add io dot close and measure again; restart one of three sticky workers and print the counts; then score your own service against the five items.' },
];
export const slides = lamDeck({ chuong: 'Chapter 5 — Redis adapter and clustering', bai: '5.4' }, S);
