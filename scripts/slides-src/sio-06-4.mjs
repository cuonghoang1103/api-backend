/**
 * sio-06-4 — Socket.IO · Chapter 6 · Lesson 6.4 "Ordering: what socket.io promises and what it does NOT" (deck video + web, 13/11/2026).
 * Bài web: io-6-4-ordering. Output THẬT (scratchpad/sio/demo/n6-4.txt · socket.io 4.8.3 · Node 22.23.3 · Postgres 16 · Redis 7 · @socket.io/redis-adapter 8.3.0):
 * thutu: MỘT socket, 10.000 tin server → client: websocket 0 lần đảo, polling 0 lần đảo · client → server 100 tin, handler async ghi Postgres (trễ ngẫu nhiên 0–20 ms)
 *   ⇒ thứ tự id trong bảng đảo 46 lần; xếp hàng mỗi socket (chuỗi Promise) ⇒ 0, nhưng 1.402 ms so với 133 ms.
 * cum: 2 worker + Redis adapter, An ở worker 1, Bình ở worker 2; 200 lượt mỗi worker phát một tin cùng lúc ⇒ An và Bình thấy thứ tự KHÁC nhau ở 200/200 cặp
 *   (mỗi người thấy tin của worker mình trước); seq lấy từ sequence Postgres + client xếp lại ⇒ 0/200, đệm 84 và 117 lần, đệm lớn nhất 2.
 * kho: messagingStore.ts:1291 tin realtime nối CUỐI theo thứ tự tới · :276-279 bắt kịp thì sắp theo createdAt rồi id.
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n6-4:file:thutu.mjs": "// Thứ tự TRONG một socket, đo THẬT. Phần 1: server phát 10.000 tin đánh số qua MỘT socket — websocket rồi polling — client đếm số lần đảo.\n// Phần 2: client gửi 100 tin chat theo thứ tự trên MỘT socket; handler async ghi Postgres (:19660) với độ trễ ngẫu nhiên 0–20 ms\n//   (như DB thật lúc bận) — so thứ tự id trong bảng với thứ tự gửi. Rồi xếp hàng mỗi socket (chuỗi Promise) và đo lại.\nimport pg from 'pg';\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nconst io = new Server(19792);\nconst dao = (a) => a.filter((x, i) => i && x < a[i - 1]).length;          // số lần một tin tới SAU tin có số lớn hơn nó\n\nconsole.log('— phần 1: server → client, MỘT socket, 10.000 tin —');\nio.on('connection', (sk) => sk.on('xin', (n) => { for (let i = 1; i <= n; i++) sk.emit('tin', i); }));\nfor (const tr of ['websocket', 'polling']) {\n  const c = ketNoi('http://localhost:19792', { transports: [tr], forceNew: true });\n  await new Promise((r) => c.once('connect', r));\n  const nhan = []; const t = Date.now();\n  await new Promise((r) => { c.on('tin', (i) => { nhan.push(i); if (nhan.length === 10_000) r(); }); c.emit('xin', 10_000); });\n  console.log(`  ${tr.padEnd(9)} nhận ${nhan.length.toLocaleString('vi-VN')} tin trong ${Date.now() - t} ms · đảo thứ tự: ${dao(nhan)}`);\n  c.close();\n}\n\nconsole.log('— phần 2: client → server, MỘT socket, 100 tin, handler async ghi Postgres —');\nconst db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres', max: 10 });\nawait db.query('DROP TABLE IF EXISTS chat; CREATE TABLE chat (id serial PRIMARY KEY, kieu text, so_gui int)');\nawait Promise.all(Array.from({ length: 10 }, () => db.query('SELECT 1')));\nconst ghi = (kieu, n) => db.query(`SELECT pg_sleep(random() * 0.02); INSERT INTO chat (kieu, so_gui) VALUES ('${kieu}', ${n})`);\nio.on('connection', (sk) => {\n  sk.on('chat:tho', async (n, ack) => { await ghi('tho', n); ack(); });                     // handler async bình thường\n  let hang = Promise.resolve();                                                             // xếp hàng mỗi socket\n  sk.on('chat:hang', (n, ack) => { hang = hang.then(() => ghi('hang', n)).then(() => ack()); });\n});\nconst c = ketNoi('http://localhost:19792', { transports: ['websocket'], forceNew: true });\nawait new Promise((r) => c.once('connect', r));\nfor (const kieu of ['tho', 'hang']) {\n  const t = Date.now();\n  await Promise.all(Array.from({ length: 100 }, (_, i) => c.emitWithAck(`chat:${kieu}`, i + 1)));   // gửi 1…100 theo thứ tự, không chờ nhau\n  const { rows } = await db.query('SELECT so_gui FROM chat WHERE kieu = $1 ORDER BY id', [kieu]);\n  const thuTu = rows.map((r) => r.so_gui);\n  console.log(`  ${kieu === 'tho' ? 'handler async thường ' : 'xếp hàng mỗi socket'} · ${Date.now() - t} ms · thứ tự id trong bảng: ${thuTu.slice(0, 12).join(',')}… · đảo ${dao(thuTu)}`);\n}\nprocess.exit(0);\n",
 "n6-4:thutu": "$ node thutu.mjs\n— phần 1: server → client, MỘT socket, 10.000 tin —\n  websocket nhận 10.000 tin trong 171 ms · đảo thứ tự: 0\n  polling   nhận 10.000 tin trong 30 ms · đảo thứ tự: 0\n— phần 2: client → server, MỘT socket, 100 tin, handler async ghi Postgres —\n  handler async thường  · 133 ms · thứ tự id trong bảng: 9,3,6,10,1,11,12,2,15,13,18,8… · đảo 46\n  xếp hàng mỗi socket · 1402 ms · thứ tự id trong bảng: 1,2,3,4,5,6,7,8,9,10,11,12… · đảo 0",
 "n6-4:file:cum.mjs": "// Thứ tự GIỮA hai worker, đo THẬT: 2 server socket.io + Redis adapter (Redis :19661). An nối worker 1, Bình nối worker 2, cả hai ở room thread:1.\n// 200 lượt: worker 1 phát tin A, worker 2 phát tin B cùng lúc (như hai người gửi cùng lúc, mỗi người tới một worker).\n// kieu 'tho' = phát thẳng · 'seq' = mỗi tin lấy số thứ tự từ Postgres (:19660, sequence = id tự tăng) rồi mới phát; client xếp lại theo seq.\nimport pg from 'pg';\nimport { createClient } from 'redis';\nimport { createAdapter } from '@socket.io/redis-adapter';\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nconst kieu = process.argv[2] ?? 'tho';\nconst cho = (ms) => new Promise((r) => setTimeout(r, ms));\nconst db = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres', max: 4 });\nawait db.query('DROP SEQUENCE IF EXISTS seq_thread; CREATE SEQUENCE seq_thread');\nconst mo = async (cong) => { const pub = createClient({ url: 'redis://127.0.0.1:19661' }), sub = pub.duplicate(); await Promise.all([pub.connect(), sub.connect()]);\n  const io = new Server(cong, { adapter: createAdapter(pub, sub) }); io.on('connection', (s) => s.join('thread:1')); return io; };\nconst [w1, w2] = await Promise.all([mo(19793), mo(19794)]);\nconst noi = (cong) => new Promise((r) => { const c = ketNoi(`http://localhost:${cong}`, { transports: ['websocket'], forceNew: true }); c.once('connect', () => r(c)); });\nconst [an, binh] = await Promise.all([noi(19793), noi(19794)]);\nawait cho(300);\n\n// client: hiện thẳng theo thứ tự tới, hoặc xếp lại theo seq (thuật toán bài web: lastSeen + bộ đệm khoảng trống)\nconst lamClient = (c) => { const hien = []; let lastSeen = 0, demDem = 0, demMax = 0; const dem = new Map();\n  c.on('tin', (m) => {\n    if (kieu === 'tho') return hien.push(m.ten);\n    if (m.seq === lastSeen + 1) { hien.push(m.ten); lastSeen++; while (dem.has(lastSeen + 1)) { lastSeen++; hien.push(dem.get(lastSeen)); dem.delete(lastSeen); } }\n    else if (m.seq > lastSeen + 1) { dem.set(m.seq, m.ten); demDem++; demMax = Math.max(demMax, dem.size); }\n  });\n  return { hien, thongKe: () => `phải đệm ${demDem} lần, đệm lớn nhất ${demMax}` }; };\nconst A = lamClient(an), B = lamClient(binh);\nconst phat = async (w, ten) => { const m = { ten }; if (kieu === 'seq') m.seq = Number((await db.query(\"SELECT nextval('seq_thread') AS s\")).rows[0].s); w.to('thread:1').emit('tin', m); };\nfor (let k = 1; k <= 200; k++) { await Promise.all([phat(w1, `A${k}`), phat(w2, `B${k}`)]); await cho(5); }\nawait cho(500);\nlet lech = 0; for (let k = 1; k <= 200; k++) { const a = A.hien.indexOf(`A${k}`) < A.hien.indexOf(`B${k}`), b = B.hien.indexOf(`A${k}`) < B.hien.indexOf(`B${k}`); if (a !== b) lech++; }\nconsole.log(`— ${kieu === 'tho' ? 'phát thẳng, hiện theo thứ tự tới' : 'seq từ Postgres, client xếp lại theo seq'} —`);\nconsole.log(`  An  (worker 1) thấy: ${A.hien.slice(0, 8).join(' ')} … (${A.hien.length} tin)${kieu === 'seq' ? ' · ' + A.thongKe() : ''}`);\nconsole.log(`  Bình (worker 2) thấy: ${B.hien.slice(0, 8).join(' ')} … (${B.hien.length} tin)${kieu === 'seq' ? ' · ' + B.thongKe() : ''}`);\nconsole.log(`  200 cặp A/B: An và Bình thấy THỨ TỰ KHÁC NHAU ở ${lech} cặp`);\nprocess.exit(0);\n",
 "n6-4:cum": "$ node cum.mjs tho\n— phát thẳng, hiện theo thứ tự tới —\n  An  (worker 1) thấy: A1 B1 A2 B2 A3 B3 A4 B4 … (400 tin)\n  Bình (worker 2) thấy: B1 A1 B2 A2 B3 A3 B4 A4 … (400 tin)\n  200 cặp A/B: An và Bình thấy THỨ TỰ KHÁC NHAU ở 200 cặp\n$ node cum.mjs seq\n— seq từ Postgres, client xếp lại theo seq —\n  An  (worker 1) thấy: A1 B1 A2 B2 A3 B3 B4 A4 … (400 tin) · phải đệm 84 lần, đệm lớn nhất 1\n  Bình (worker 2) thấy: A1 B1 A2 B2 A3 B3 B4 A4 … (400 tin) · phải đệm 117 lần, đệm lớn nhất 2\n  200 cặp A/B: An và Bình thấy THỨ TỰ KHÁC NHAU ở 0 cặp",
 "n6-4:kho": "$ grep -n \"nextMsgs = \\[...cur, message\\]\\|merged.sort((a, b)\" frontend/src/store/messagingStore.ts\n276: merged.sort((a, b) => {\n1291: nextMsgs = [...cur, message];\n$ grep -n \"if (Number.isFinite(ta) && Number.isFinite(tb) && ta !== tb) return ta - tb\" frontend/src/store/messagingStore.ts\n279: if (Number.isFinite(ta) && Number.isFinite(tb) && ta !== tb) return ta - tb;"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, cmp, box, two, steps, kw, c, tsx, seq } from './_sio-chung.mjs';

export const deck = { key: 'sio-06-4', code: 'SIO 6.4', title: 'Ordering: what socket.io promises — and what it does not', sub: 'Chapter 6 · Lesson 6.4' };
const O = (k) => { const v = DU_LIEU[`n6-4:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const tach = (s) => { const r = {}; let k = null; for (const l of s.split('\n')) { if (l.startsWith('$ ')) { k = l.slice(2); r[k] = []; } else if (k) r[k].push(l); } return r; };
const m = (re, s) => { const x = re.exec(s); if (!x) throw new Error('khớp hỏng: ' + re); return x; };
const TT = O('thutu').split('\n').filter((l) => !l.startsWith('$ ')), CUM = tach(O('cum')), KHO = O('kho');
const TT1 = TT.slice(0, 3).join('\n'), TT2 = TT.slice(3).join('\n');
const daoWs = +m(/websocket .* đảo thứ tự: (\d+)/, TT1)[1], daoPoll = +m(/polling .* đảo thứ tự: (\d+)/, TT1)[1];
const [, msTho, daoTho] = m(/handler async thường\s+· (\d+) ms .* đảo (\d+)/, TT2), [, msHang, daoHang] = m(/xếp hàng mỗi socket · (\d+) ms .* đảo (\d+)/, TT2);
const THO = CUM['node cum.mjs tho'].join('\n'), SEQ = CUM['node cum.mjs seq'].join('\n');
const lechTho = +m(/KHÁC NHAU ở (\d+) cặp/, THO)[1], lechSeq = +m(/KHÁC NHAU ở (\d+) cặp/, SEQ)[1];
const [, demAn, maxAn] = m(/An .* phải đệm (\d+) lần, đệm lớn nhất (\d+)/, SEQ), [, demBinh, maxBinh] = m(/Bình .* phải đệm (\d+) lần, đệm lớn nhất (\d+)/, SEQ);
const vn = (n) => Number(n).toLocaleString('en-US');

export const S = [
  { cover: true, nhan: 'Chapter 6 · Lesson 6.4', t: 'Ordering: what socket.io<br>promises — and what it does not', sub: 'One socket keeps order. Two sockets, two workers, a reconnect — or your own async handler — do not',
    en: 'Lesson six point four: ordering. One socket keeps order; two sockets, two workers, a reconnect, or your own async handler do not.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>One socket, 10,000 messages: <b>${daoWs}</b> out of order over WebSocket, <b>${daoPoll}</b> over polling</li>
    <li>But your <b>async handler</b> reorders them: ${daoTho} inversions in the database ids out of 100</li>
    <li>Two workers: An and Bình saw a <b>different order</b> in ${lechTho} of 200 pairs</li>
    <li>A sequence number from the database + client reordering ⇒ ${lechSeq} of 200</li>
    <li>This repo appends live messages in arrival order and re-sorts on catch-up</li></ul>`,
    en: 'Five takeaways: one socket keeps order over both transports; your own async handler can reorder; two workers make two users disagree on the order; a database sequence number and client reordering fix it; and what this repo does.' },
  { t: 'The promise, row by row — measured', body: cmp(['Situation', 'Order kept?', 'Measured here', 'Why'], [
      ['inside one socket', '✓ yes', `10,000 msgs: ${daoWs} inversions (WebSocket), ${daoPoll} (polling)`, 'one TCP stream, one packet queue'],
      ['two sockets of one user (tabs)', '✗ no', 'each tab is its own stream', 'no order between streams'],
      ['two workers (Redis adapter)', '✗ no', `${lechTho}/200 pairs seen differently`, 'local delivery beats the Redis hop'],
      ['after disconnect + reconnect', '✗ gap', 'lesson 6.1: 10 lost, the rest in order', 'no replay unless connectionStateRecovery'],
      ['inside your async handler', '✗ no', `${daoTho} inversions in DB ids`, 'awaits finish in any order'],
    ], { hl: [2, 4] }) + box('Trap: “WebSocket is TCP, so the order is right”', 'TCP orders bytes between two endpoints on one connection. Three tabs are three connections; four workers are four publishers; an async handler is many functions running at once. None of that is one TCP stream.', 'bad'),
    en: 'The promise row by row, as measured. Inside one socket: kept, ten thousand messages with zero inversions over both transports. Two tabs, two workers, a reconnect gap, and your own async handler: not kept.' },
  { t: 'One socket keeps order — your handler may not', body: tn(TT.join('\n'), { fs: 14, wrap: 130 }) + two(tsx(`// arrives 1, 2, 3 … finishes in any order
socket.on('chat:tho', async (n, ack) => {
  await db.insert(n);      // 0–20 ms each
  ack();
});
// one queue per socket
let hang = Promise.resolve();
socket.on('chat:hang', (n, ack) => {
  hang = hang.then(() => db.insert(n))
             .then(() => ack());
});`, { fs: 13 }), box('The cost of keeping it', `Queueing per socket kept the order (<b>${daoHang}</b> inversions) but took <b>${vn(msHang)} ms</b> instead of ${msTho} ms. Queue only what really needs order (one chat thread), not the whole socket.`, 'info')),
    en: 'One socket keeps order on the wire. But an async handler awaits a database write; the writes finish in any order, and the ids in the table were inverted forty six times. A queue per socket keeps the order, at about ten times the time.' },
  { t: 'Two workers: two users, two different orders', body: two(tn(THO, { fs: 13, wrap: 62 }),
    box('Nobody is wrong, nobody agrees', `Each worker delivers its own message to its local sockets at once, the other one after a Redis hop. Different order in <b>${lechTho} of 200</b> pairs. Per-publisher order is kept; a global order does not exist.`, 'bad')) +
    seq(['worker 1 · An', 'Redis', 'worker 2 · Bình'], [
      [0, 0, 'A1 → An: at once', '#1f8a3b'], [0, 1, 'PUBLISH A1'], [2, 1, 'PUBLISH B1'], [1, 0, 'B1 → An: later', '#c0392b', true], [1, 2, 'A1 → Bình: later', '#c0392b', true]], { w: 1110, rh: 38, fs: 16 }) +
    '<div class="cap">B1 reaches Bình at once on worker 2 — so An sees A1 B1, Bình sees B1 A1</div>',
    en: 'Two workers with the Redis adapter. Each worker delivers its own message locally at once and the other one after a Redis round trip. An sees A before B, Bình sees B before A, in all two hundred pairs. Per publisher order is kept; a global order does not exist.' },
  { t: 'Fix: one source of numbers, reorder on the client', body: two(tsx(`// server: ONE source of numbers
const seq = await nextval('seq_thread');
io.to(room).emit('tin', { seq, ...msg });
// client: show in seq order, buffer gaps
socket.on('tin', (m) => {
  if (m.seq === last + 1) {
    show(m); last++;
    while (buf.has(last + 1))
      show(buf.get(++last));
  } else if (m.seq > last + 1) {
    buf.set(m.seq, m);         // gap
    if (m.seq - last > 10) refetch();
  }                            // else: dup
});`, { fs: 12 }), box('Measured', `Same order on both clients (${lechSeq}/200 pairs differ). Buffered ${demAn} and ${demBinh} times, never more than ${Math.max(+maxAn, +maxBinh)} held. The same seq catches duplicates and gaps.`, 'ok')) + tn(SEQ, { fs: 13, wrap: 130 }),
    en: 'The fix: take a sequence number from one place, here a Postgres sequence, and reorder on the client with a small buffer. Both clients now show the same order; the buffer never held more than two messages. The same number also catches duplicates and gaps.' },
  { t: 'Which number? And what to do per feature', body: cmp(['Source', 'Good', 'Bad'], [
      ['timestamp (Date.now)', 'free', 'clock skew between server, workers and clients — not an order'],
      ['DB id / sequence', 'monotonic, shared by every worker', 'a round trip to the DB before the emit'],
      ['counter in the process', 'fastest', 'resets on restart, different per worker'],
      ['Redis INCR', 'shared, atomic, fast', 'one more system to keep up'],
    ], { hl: [1] }) + cmp(['Feature', 'Ordering rule'], [
      ['chat messages', 'DB id + reorder on the client; refetch on a gap'],
      ['notifications', 'order does not matter — show as they arrive'],
      ['payment / order status', 'a state machine: PENDING → PAID only, never back'],
      ['live score, cursor', 'last write wins by a version number'],
    ]),
    en: 'Which number? A timestamp is not an order because of clock skew. A database id or sequence is monotonic and shared by every worker, at the cost of a round trip. A per process counter resets and differs per worker. Then pick a rule per feature: reorder chat, ignore order for notifications, use a state machine for payments, last write wins for scores.' },
  { t: 'This repo: arrival order live, sorted order on catch-up', body: tn(KHO, { fs: 16, wrap: 120 }) + two(
      box('Live: appended as it arrives', `${c('applyIncomingMessage')} appends each ${c('thread:new-message')} to the end (line 1291) — no sequence check. With one backend process the arrival order is the server's emit order, so this holds today.`, 'info'),
      box('Catch-up: sorted', `${c('batKip()')} → ${c('mergeMessages')} sorts by ${c('createdAt')}, then id (lines 276–279). A pair shown out of order heals on the next reconnect or reload. With a second worker (chapter 5), live order would differ between users exactly as measured.`, 'ok')),
    en: 'This repo: live messages are appended in arrival order, with no sequence check; with one backend process that matches the server emit order. On catch up the client sorts by created at, then id, so an out of order pair heals on the next reconnect. A second worker would break the live order as measured.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Ordering', 'messages arrive in the order they were sent'), kw('Inside one socket', 'kept: one TCP stream, one queue'),
      kw('Across sockets / workers', 'no global order exists'), kw('Sequence number', 'one source (DB id, sequence) for every message'),
      kw('Reorder buffer', 'hold early messages until the gap fills'), kw('Gap detection', 'a missing seq ⇒ refetch from the database'),
      kw('Per-socket queue', 'order inside your handler — costs throughput'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: ordering; inside one socket; across sockets and workers; the sequence number; the reorder buffer; gap detection; and the per socket queue.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Emit 10,000 numbered messages on one socket: count inversions',
      'Write them to a DB from an async handler: count inversions again',
      'Two workers, two clients, both broadcasting: do the clients agree?',
      'Stamp a DB sequence, reorder on the client, detect a gap',
    ]), box('Keep these', `<ul><li>One socket keeps order on the wire</li><li>Your async handler can reorder</li><li>Two workers ⇒ no global order</li><li>One source of numbers + client reorder</li><li>Gap ⇒ refetch; seq ≤ last ⇒ duplicate</li></ul>`, 'info'), ''),
    en: 'Your turn: count inversions on one socket; write through an async handler and count again; two workers and two clients, do they agree; then stamp a database sequence, reorder on the client, and detect a gap.' },
];
export const slides = lamDeck({ chuong: 'Chapter 6 — Acks and delivery guarantees', bai: '6.4' }, S);
