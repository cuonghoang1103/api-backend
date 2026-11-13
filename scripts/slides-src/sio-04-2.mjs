/**
 * sio-04-2 — Socket.IO · Chapter 4 · Lesson 4.2 "Audience: computing who cares" (deck video + web, 13/11/2026).
 * Bài web: io-4-2-audience. Output THẬT (scratchpad/sio/demo/n4-2.txt · Postgres 16 container sio-pg · Redis 7 sio-redis · pg 8.23 · ioredis 5.11):
 * gieo: 10.000 user, 100.000 friendships (20 bạn/người), 50.000 DM thread (10 peer/người) ⇒ audience 30.
 * mot: getAudience 4 truy vấn/2 vòng — p50 1,16 ms · p99 2,00 ms (DB rảnh, cùng máy).
 * bao: bão N=2.000 / 10.000 cùng lúc, pool 21 (= Prisma 10×2+1): 622 / 3.093 ms, p50 467 / 2.332 ms, ≤ 19.979 truy vấn xếp hàng; Redis ấm: 18,8 / 83,4 ms.
 * cache: miss 15,96 ms · hit 0,70 ms · TTL 300 · quên invalidate ⇒ audience cũ; DEL cả hai ⇒ đúng.
 * chan: mẫu kho (audience chốt lúc connect) ⇒ Bình đã chặn vẫn nhận offline của An; lọc lại lúc ngắt ⇒ không gì.
 * kho: messaging.socket.ts:393/402 (2 truy vấn) + presencePrivacy.ts:179 (2 truy vấn) · socket.data.presenceAudience (419/567) · grep "presence:audience" = 0 (KHÔNG có cache Redis).
 */
/*DU_LIEU*/
const DU_LIEU = {
 "n4-2:file:gieo.mjs": "// Dữ liệu giả có HÌNH như kho: 10.000 user · mỗi người 20 bạn (vòng tròn ±10) · 10 người cùng chat DM (±11…±15) ⇒ audience 30.\nimport pg from 'pg';\nconst db = new pg.Client({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres' });\nawait db.connect();\nawait db.query(`\n  DROP TABLE IF EXISTS users, friendships, message_threads, user_blocks;\n  CREATE TABLE users (id int PRIMARY KEY, enabled bool NOT NULL DEFAULT true, show_active_status bool NOT NULL DEFAULT true);\n  CREATE TABLE friendships (requester_id int, addressee_id int, status text NOT NULL DEFAULT 'ACCEPTED');\n  CREATE TABLE message_threads (id serial PRIMARY KEY, user_a_id int, user_b_id int);\n  CREATE TABLE user_blocks (blocker_id int, blocked_id int);\n  INSERT INTO users (id) SELECT g FROM generate_series(0, 9999) g;\n  INSERT INTO friendships SELECT u, (u + k) % 10000 FROM generate_series(0, 9999) u, generate_series(1, 10) k;\n  INSERT INTO message_threads (user_a_id, user_b_id) SELECT u, (u + k) % 10000 FROM generate_series(0, 9999) u, generate_series(11, 15) k;\n  CREATE INDEX ON friendships (requester_id); CREATE INDEX ON friendships (addressee_id);\n  CREATE INDEX ON message_threads (user_a_id); CREATE INDEX ON message_threads (user_b_id);\n  CREATE INDEX ON user_blocks (blocker_id); CREATE INDEX ON user_blocks (blocked_id);\n  ANALYZE;`);\nconst { rows } = await db.query(`SELECT (SELECT count(*) FROM users) u, (SELECT count(*) FROM friendships) f, (SELECT count(*) FROM message_threads) t`);\nconsole.log(`users ${rows[0].u} · friendships ${rows[0].f} · message_threads ${rows[0].t}`);\nawait db.end();\n",
 "n4-2:file:audience.mjs": "// audience(X) = (bạn bè ∪ người cùng chat) − bị chặn − tắt trạng thái − tài khoản khoá. Bốn truy vấn, hai vòng song song — y như kho.\nimport pg from 'pg';\nexport const pool = new pg.Pool({ connectionString: 'postgres://postgres:lab@127.0.0.1:19660/postgres', max: 21 }); // = mặc định Prisma trên máy 10 lõi: 10×2+1\nexport async function getAudience(u) {\n  const [f, t] = await Promise.all([\n    pool.query(`SELECT requester_id a, addressee_id b FROM friendships WHERE status = 'ACCEPTED' AND (requester_id = $1 OR addressee_id = $1)`, [u]),\n    pool.query(`SELECT user_a_id a, user_b_id b FROM message_threads WHERE user_a_id = $1 OR user_b_id = $1`, [u]),\n  ]);\n  const ung = [...new Set([...f.rows, ...t.rows].map((r) => (r.a === u ? r.b : r.a)))];\n  const [chan, ok] = await Promise.all([\n    pool.query(`SELECT blocker_id, blocked_id FROM user_blocks WHERE (blocker_id = $1 AND blocked_id = ANY($2)) OR (blocked_id = $1 AND blocker_id = ANY($2))`, [u, ung]),\n    pool.query(`SELECT id FROM users WHERE id = ANY($1) AND enabled AND show_active_status`, [ung]),\n  ]);\n  const bi = new Set(chan.rows.map((r) => (r.blocker_id === u ? r.blocked_id : r.blocker_id)));\n  const sang = new Set(ok.rows.map((r) => r.id));\n  return ung.filter((v) => sang.has(v) && !bi.has(v));\n}\n",
 "n4-2:dung": "$ /usr/local/bin/docker run -d --name sio-pg -e POSTGRES_PASSWORD=lab -p 127.0.0.1:19660:5432 postgres:16-alpine >/dev/null && /usr/local/bin/docker run -d --name sio-redis -p 127.0.0.1:19661:6379 redis:7-alpine >/dev/null && echo \"sio-pg :19660 · sio-redis :19661\"\nsio-pg :19660 · sio-redis :19661\n$ node gieo.mjs\nusers 10000 · friendships 100000 · message_threads 50000",
 "n4-2:file:mot.mjs": "// Một lượt getAudience tốn bao lâu khi DB rảnh? 1.000 lượt tuần tự, user ngẫu nhiên.\nimport { getAudience, pool } from './audience.mjs';\nconst t = [];\nlet co = 0;\nfor (let i = 0; i < 1000; i++) { const u = (i * 7919) % 10000; const a = performance.now(); co += (await getAudience(u)).length; t.push(performance.now() - a); }\nt.sort((x, y) => x - y);\nconst ms = (x) => x.toFixed(2).replace('.', ',');\nconsole.log(`1.000 lượt tuần tự · audience TB ${co / 1000} người · p50 ${ms(t[499])} ms · p99 ${ms(t[989])} ms · 4 truy vấn/lượt`);\nawait pool.end();\n",
 "n4-2:mot": "$ node mot.mjs\n1.000 lượt tuần tự · audience TB 30 người · p50 1,16 ms · p99 2,00 ms · 4 truy vấn/lượt",
 "n4-2:file:bao42.mjs": "// Bão deploy: N người nối lại CÙNG LÚC, mỗi người cần audience. Không cache (4 truy vấn, pool 21) vs cache Redis đã ấm (1 GET).\nimport Redis from 'ioredis';\nimport { getAudience, pool } from './audience.mjs';\nconst r = new Redis(19661, '127.0.0.1');\nconst ms = (x) => (x >= 100 ? Math.round(x).toLocaleString('vi-VN') : x.toFixed(1).replace('.', ','));\nconst do1 = async (ten, N, f) => {\n  const t = []; const a0 = performance.now(); let xepHang = 0;\n  const do0 = setInterval(() => { xepHang = Math.max(xepHang, pool.waitingCount); }, 5);\n  await Promise.all(Array.from({ length: N }, async (_, u) => { const a = performance.now(); await f(u); t.push(performance.now() - a); }));\n  clearInterval(do0); const tong = performance.now() - a0; t.sort((x, y) => x - y);\n  console.log(`${ten.padEnd(17)} N=${String(N).padStart(5)} · xong sau ${ms(tong).padStart(5)} ms · p50 ${ms(t[Math.floor(N / 2)]).padStart(5)} ms · chậm nhất ${ms(t.at(-1)).padStart(5)} ms · truy vấn xếp hàng chờ pool ≤ ${xepHang.toLocaleString('vi-VN')}`);\n};\nfor (const N of [2000, 10000]) await do1('DB, không cache', N, (u) => getAudience(u));\nfor (let u = 0; u < 10000; u++) await r.set(`presence:audience:${u}`, JSON.stringify(await getAudience(u)), 'EX', 300);\nfor (const N of [2000, 10000]) await do1('Redis ấm (GET)', N, async (u) => JSON.parse(await r.get(`presence:audience:${u}`)));\nawait pool.end(); r.disconnect();\n",
 "n4-2:bao": "$ node bao42.mjs\nDB, không cache   N= 2000 · xong sau   622 ms · p50   467 ms · chậm nhất   613 ms · truy vấn xếp hàng chờ pool ≤ 3.979\nDB, không cache   N=10000 · xong sau 3.093 ms · p50 2.332 ms · chậm nhất 3.071 ms · truy vấn xếp hàng chờ pool ≤ 19.979\nRedis ấm (GET)    N= 2000 · xong sau  18,8 ms · p50   9,4 ms · chậm nhất  15,6 ms · truy vấn xếp hàng chờ pool ≤ 0\nRedis ấm (GET)    N=10000 · xong sau  83,4 ms · p50  39,8 ms · chậm nhất  67,3 ms · truy vấn xếp hàng chờ pool ≤ 0",
 "n4-2:file:cache.mjs": "// Cache-aside + TTL + invalidate. Rồi: thêm một người bạn MÀ QUÊN invalidate ⇒ audience cũ tới khi TTL hết.\nimport Redis from 'ioredis';\nimport { getAudience, pool } from './audience.mjs';\nconst r = new Redis(19661, '127.0.0.1');\nconst AUD_TTL = 300;\nasync function getAudienceCached(u) {\n  const key = `presence:audience:${u}`;\n  const cached = await r.get(key);\n  if (cached) return JSON.parse(cached);\n  const fresh = await getAudience(u);\n  await r.set(key, JSON.stringify(fresh), 'EX', AUD_TTL);\n  return fresh;\n}\nconst ms = (x) => x.toFixed(2).replace('.', ',');\nawait r.del('presence:audience:42', 'presence:audience:5000');\nlet a = performance.now(); let aud = await getAudienceCached(42); console.log(`lần 1 (miss → DB):  ${ms(performance.now() - a)} ms · ${aud.length} người`);\na = performance.now(); aud = await getAudienceCached(42); console.log(`lần 2 (hit → Redis): ${ms(performance.now() - a)} ms · TTL còn ${await r.ttl('presence:audience:42')} s`);\nawait pool.query(`INSERT INTO friendships VALUES (42, 5000, 'ACCEPTED')`);\nconsole.log('— 42 kết bạn với 5000, QUÊN invalidate —');\nconsole.log(`audience(42) có 5000? ${(await getAudienceCached(42)).includes(5000)}  ← cũ, tới khi TTL hết`);\nawait r.del('presence:audience:42', 'presence:audience:5000');\nconsole.log('— invalidate CẢ HAI: DEL presence:audience:42 presence:audience:5000 —');\nconsole.log(`audience(42) có 5000? ${(await getAudienceCached(42)).includes(5000)} · audience(5000) có 42? ${(await getAudienceCached(5000)).includes(42)}`);\nawait pool.query(`DELETE FROM friendships WHERE requester_id = 42 AND addressee_id = 5000`);\nawait r.del('presence:audience:42', 'presence:audience:5000');\nawait pool.end(); r.disconnect();\n",
 "n4-2:cache": "$ node cache.mjs\nlần 1 (miss → DB):  15,96 ms · 30 người\nlần 2 (hit → Redis): 0,70 ms · TTL còn 300 s\n— 42 kết bạn với 5000, QUÊN invalidate —\naudience(42) có 5000? false  ← cũ, tới khi TTL hết\n— invalidate CẢ HAI: DEL presence:audience:42 presence:audience:5000 —\naudience(42) có 5000? true · audience(5000) có 42? true",
 "n4-2:file:chan.mjs": "// Mẫu của kho: audience tính MỘT lần lúc connect, cất ở socket.data, dùng lại lúc disconnect.\n// Bình (43) đang online thì chặn An (42). An đóng tab ⇒ Bình có còn nhận presence của An?\nimport { Server } from 'socket.io';\nimport { io as ketNoi } from 'socket.io-client';\nimport { getAudience, pool } from './audience.mjs';\nconst io = new Server(19662);\nio.on('connection', async (s) => {\n  const u = s.handshake.auth.user; s.join(`user:${u}`);\n  s.data.aud = await getAudience(u);                       // chốt lúc connect\n  s.on('disconnect', async () => {\n    const aud = process.env.LOC_LAI ? await getAudience(u) : s.data.aud;   // LOC_LAI=1 ⇒ lọc lại lúc ngắt\n    for (const v of aud) io.to(`user:${v}`).emit('presence:update', { userId: u, online: false });\n  });\n  s.emit('san-sang');\n});\nconst binh = ketNoi('http://localhost:19662', { auth: { user: 43 }, transports: ['websocket'] });\nconst nhan = []; binh.on('presence:update', (p) => nhan.push(p));\nawait new Promise((r) => binh.on('san-sang', r));\nconst an = ketNoi('http://localhost:19662', { auth: { user: 42 }, transports: ['websocket'], forceNew: true });\nawait new Promise((r) => an.on('san-sang', r));\nawait pool.query('INSERT INTO user_blocks VALUES (43, 42)');\nconsole.log(`Bình (43) chặn An (42) lúc ${new Date().toISOString().slice(11, 19)} · ${process.env.LOC_LAI ? 'lọc LẠI lúc ngắt' : 'dùng audience chốt lúc connect'}`);\nan.disconnect(); await new Promise((r) => setTimeout(r, 400));\nconsole.log(`Bình nhận sau khi chặn: ${nhan.length ? JSON.stringify(nhan) : 'không gì cả ✓'}`);\nawait pool.query('DELETE FROM user_blocks'); await pool.end(); process.exit(0);\n",
 "n4-2:chan": "$ node chan.mjs\nBình (43) chặn An (42) lúc 08:10:31 · dùng audience chốt lúc connect\nBình nhận sau khi chặn: [{\"userId\":42,\"online\":false}]\n$ LOC_LAI=1 node chan.mjs\nBình (43) chặn An (42) lúc 08:10:32 · lọc LẠI lúc ngắt\nBình nhận sau khi chặn: không gì cả ✓",
 "n4-2:kho": "$ grep -n \"messageThread.findMany\\|friendship.findMany\\|presenceAudience = await\\|presenceAudience as\" src/socket/messaging.socket.ts\n393:          prisma.messageThread.findMany({\n402:          prisma.friendship.findMany({\n419:        socket.data.presenceAudience = await phatTrangThaiKhiNoi({\n567:        const audience = socket.data.presenceAudience as number[] | undefined;\n$ grep -n \"export async function presenceAudience\" -A9 src/services/presencePrivacy.ts\n179:export async function presenceAudience(userId: number, candidateIds: number[]): Promise<number[]> {\n180-  const ids = [...new Set(candidateIds.filter((id) => id !== userId))];\n181-  if (!ids.length) return [];\n182-  const [blocked, rows] = await Promise.all([\n183-    blockedBetween(userId, ids),\n184-    prisma.user.findMany({ where: { id: { in: ids }, enabled: true, showActiveStatus: true }, select: { id: true } }),\n185-  ]);\n186-  const ok = new Set(rows.map((r) => r.id));\n187-  return ids.filter((id) => ok.has(id) && !blocked.has(id));\n188-}\n$ grep -rn \"presence:audience\" src/ | wc -l\n       0"
};
/*HET_DU_LIEU*/
import { lamDeck, tn, cmp, box, two, steps, kw, c, tsx, seq, bars, path } from './_sio-chung.mjs';

export const deck = { key: 'sio-04-2', code: 'SIO 4.2', title: 'Audience: computing who cares', sub: 'Chapter 4 · Lesson 4.2' };
const O = (k) => { const v = DU_LIEU[`n4-2:${k}`]; if (v === undefined) throw new Error('thiếu ' + k); return v; };
const bo$ = (s) => s.split('\n').filter((l) => !l.startsWith('$ '));
const MOT = bo$(O('mot')), BAO = bo$(O('bao')), CACHE = bo$(O('cache')), KHO = O('kho');
const CHAN = O('chan').split('\n');
const so = (s) => +String(s).replace(/\./g, '').replace(',', '.');
const B = BAO.map((l) => { const m = /^(\S.*?)\s+N=\s*(\d+) · xong sau\s+([\d.,]+) ms · p50\s+([\d.,]+) ms · chậm nhất\s+([\d.,]+) ms · truy vấn xếp hàng chờ pool ≤ ([\d.]+)/.exec(l); if (!m) throw new Error('bao: ' + l);
  return { ten: m[1].trim(), N: +m[2], tong: so(m[3]), p50: so(m[4]), max: so(m[5]), hang: so(m[6]) }; });
const b = (ten, N) => B.find((r) => r.ten.startsWith(ten) && r.N === N);
const P = /p50 ([\d,]+) ms · p99 ([\d,]+) ms/.exec(MOT[0]);
const vn = (x) => x.toLocaleString('en-US');

/** Venn: bạn bè ∪ người cùng chat, trừ ba bộ lọc ⇒ audience. */
const venn = () => {
  const w = 1110, h = 300;
  let s = `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  s += `<circle cx="160" cy="140" r="120" fill="#2563eb22" stroke="#2563eb" stroke-width="3"/><circle cx="300" cy="140" r="100" fill="#7c3aed22" stroke="#7c3aed" stroke-width="3"/>`;
  s += `<text x="100" y="132" text-anchor="middle" font-size="22" font-weight="800" fill="#2563eb">friends</text><text x="100" y="158" text-anchor="middle" font-size="17" fill="#2563eb">ACCEPTED · 20</text>`;
  s += `<text x="335" y="132" text-anchor="middle" font-size="21" font-weight="800" fill="#7c3aed">chat peers</text><text x="335" y="158" text-anchor="middle" font-size="17" fill="#7c3aed">threads · 10</text>`;
  s += `<text x="230" y="290" text-anchor="middle" font-size="20" font-weight="800" fill="#0b1f2a">∪ union (deduplicated)</text>`;
  const loc = [['− blocked (either way)', '#c0392b'], ['− status hidden (both ways)', '#c28a00'], ['− disabled account', '#64748b']];
  s += `<line x1="402" y1="140" x2="460" y2="140" stroke="#b85a2b" stroke-width="3"/>`;
  loc.forEach(([t, m], i) => { s += `<rect x="460" y="${36 + i * 74}" width="380" height="56" rx="12" fill="${m}14" stroke="${m}" stroke-width="2.5"/><text x="480" y="${71 + i * 74}" font-size="20" font-weight="800" fill="${m}">${t}</text>`; });
  s += `<defs><marker id="va" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#1f8a3b"/></marker></defs>`;
  s += `<line x1="845" y1="140" x2="905" y2="140" stroke="#1f8a3b" stroke-width="4" marker-end="url(#va)"/>`;
  s += `<rect x="910" y="85" width="190" height="110" rx="16" fill="#1f8a3b22" stroke="#1f8a3b" stroke-width="4"/><text x="1005" y="132" text-anchor="middle" font-size="27" font-weight="800" fill="#1f8a3b">audience</text><text x="1005" y="166" text-anchor="middle" font-size="20" fill="#1f8a3b">≈ 30 people</text>`;
  return s + '</svg>';
};

export const S = [
  { cover: true, nhan: 'Chapter 4 · Lesson 4.2', t: 'Audience:<br>computing who cares', sub: 'Postgres + Redis, 10,000 users, a deploy storm — and a block that does not stick',
    en: 'Lesson four point two: audience, computing who cares. Real Postgres and Redis, ten thousand users, a deploy storm, and a block that does not stick.' },
  { t: 'What you will take away from this lesson', to: true, giua: true, body: `<ul>
    <li>audience = (friends ∪ thread peers) − blocked − hidden − disabled</li>
    <li>One computation: 4 queries, p50 ${P[1].replace(',', '.')} ms on an idle database</li>
    <li>In a storm the bottleneck is the <b>pool</b>, not CPU: ${vn(b('DB', 10000).hang)} queries queued</li>
    <li>Cache-aside in Redis: ${vn(b('DB', 10000).tong)} ms → ${b('Redis', 10000).tong} ms for 10,000 users</li>
    <li>What this repo really does — and a block that does not stick</li></ul>`,
    en: 'Five takeaways: the audience formula; one computation costs four queries and about a millisecond on an idle database; in a storm the bottleneck is the pool, not CPU; a Redis cache turns three seconds into eighty milliseconds; and what this repo really does, including a block that does not stick.' },
  { t: 'Definition: who needs to see my dot?', body: venn() + two(
      box('Where the repo renders presence', 'Only four places: <b>ActiveNowRow</b> (friends), <b>ThreadList</b>, <b>MiniChatDock</b>, <b>ChatInfoPanel</b> / messages (chat peers). Nobody else ever draws your dot — so nobody else needs the event.', 'info'),
      box('The filters are not optional', `Since 22/10/2026 (39eb43755) the repo also removes people you blocked or who blocked you, accounts that turned the status off (both ways), and disabled accounts. A presence event is <b>private data</b>.`, 'bad')),
    en: 'Definition: who needs to see my dot? The friends, united with the people I chat with, minus anyone blocked in either direction, anyone who hides their status, and disabled accounts. The repo renders presence in four places only, so nobody else needs the event.' },
  { t: 'Computing it: four queries, two rounds', body: tsx(`const [f, t] = await Promise.all([           // round 1
  q(\`SELECT requester_id a, addressee_id b FROM friendships
     WHERE status='ACCEPTED' AND (requester_id=$1 OR addressee_id=$1)\`, [u]),
  q(\`SELECT user_a_id a, user_b_id b FROM message_threads
     WHERE user_a_id=$1 OR user_b_id=$1\`, [u]),
]);
const cand = unique(f ∪ t minus u);
const [blocked, ok] = await Promise.all([      // round 2
  q('… user_blocks WHERE … ANY($2)', [u, cand]),
  q('SELECT id FROM users WHERE id = ANY($1) AND enabled AND show_active_status', [cand]),
]);
return cand.filter((v) => ok.has(v) && !blocked.has(v));`, { fs: 15 }) + tn(MOT.join('\n'), { fs: 16, wrap: 110 }) + box('Measured — and the web said “~10–20 ms”', `10,000 users, 20 friends + 10 chat peers each, indexed: <b>p50 ${P[1]} ms, p99 ${P[2]} ms</b> (local container). 10–20 ms is a remote database or a cold pool (first call: 16 ms) — round-trips dominate, not the SQL.`, 'info'),
    en: 'Computing it: four queries in two parallel rounds, exactly like the repo. Friends and thread peers first; then the block list and the status filter. On the course machine one call takes about one millisecond at the median and two at the ninety ninth percentile.' },
  { t: 'The deploy storm: the pool is the bottleneck', body: tn(BAO.join('\n'), { fs: 14, wrap: 128 }) + bars([
      ['DB · N = 2,000', b('DB', 2000).tong, '#c0392b'], ['DB · N = 10,000', b('DB', 10000).tong, '#c0392b'],
      ['Redis warm · N = 2,000', b('Redis', 2000).tong, '#1f8a3b'], ['Redis warm · N = 10,000', b('Redis', 10000).tong, '#1f8a3b']], { don: 'ms', nhan: 290, rh: 34, fs: 17, log: true }) + two(
      box('Why 3 seconds', `10,000 users × 4 queries, but only <b>21 connections</b> (Prisma's default on 10 cores: 10×2+1). Up to <b>${vn(b('DB', 10000).hang)} queries wait</b> in the pool queue; the median user waits ${vn(b('DB', 10000).p50)} ms.`, 'bad'),
      box('Not “200 s of CPU”', `The web multiplied 10,000 × 20 ms. Database time is not Node CPU, and calls overlap up to the pool size. A warm Redis: ${b('Redis', 10000).tong} ms for all 10,000 (one connection, pipelined).`, 'ok')),
    en: 'The deploy storm: the pool is the bottleneck. Ten thousand users need forty thousand queries, but there are only twenty one connections, so up to almost twenty thousand queries wait in line and the median user waits over two seconds. With a warm Redis, all ten thousand are served in about eighty milliseconds.' },
  { t: 'Cache-aside in Redis, with a TTL', body: two(tsx(`const AUD_TTL = 300;                       // 5 minutes

async function getAudienceCached(u) {
  const key = \`presence:audience:\${u}\`;
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);      // hit
  const fresh = await getAudience(u);         // miss → DB
  await redis.set(key, JSON.stringify(fresh), 'EX', AUD_TTL);
  return fresh;
}`, { fs: 16 }), '<div>' + tn(CACHE.slice(0, 2).join('\n'), { fs: 15, wrap: 52 }) + box('Read it', `First call: a miss, ${/miss → DB\):\s+([\d,]+) ms/.exec(CACHE[0])[1]} ms (cold pool + 4 queries). Second: a hit, <b>${/hit → Redis\): ([\d,]+) ms/.exec(CACHE[1])[1]} ms</b>, TTL counting down from 300 s.`, 'info') + '</div>', 'r64') + path([
      { t: 'connect', s: 'user 42' }, { t: 'GET', s: 'presence:audience:42', on: true }, { t: 'hit ⇒ done', s: '< 1 ms', mau: '#1f8a3b' }, { t: 'miss ⇒ 4 queries', s: '+ SET … EX 300', mau: '#c0392b' }],
      { nhan: ['', 'key exists?', 'no key'], h: 150, fs: 19 }),
    en: 'Cache-aside in Redis with a TTL: read the key; on a hit, return it; on a miss, compute from the database and store it for five minutes. Measured: the first call missed and took sixteen milliseconds; the second hit Redis in under one millisecond.' },
  { t: 'Invalidation: when the truth changes', body: cmp(['Event', 'Delete which keys', 'Measured / why'], [
      ['friend added / removed', 'both users', 'forgot it: audience(42) still had no 5000 until TTL'],
      ['thread created / participant added', 'every participant', 'a new chat peer must start seeing your dot'],
      ['block (either direction)', 'both users — and sockets already connected', 'a pinned audience ignores the cache (slide 9)'],
      ['status switched off', 'the user’s own key + recheck at emit time', 'the repo re-reads showActiveStatus on disconnect'],
      ['TTL 300 s', '— (backstop)', 'bounds staleness when an invalidation is missed'],
    ], { hl: [2] }) + tn(CACHE.slice(2).join('\n'), { fs: 15, wrap: 120 }),
    en: 'Invalidation: when the truth changes. Friend added or removed: delete both keys. Thread created: every participant. Block: both, and also any socket already holding an audience. The TTL is only a backstop. Measured: forgetting the delete left the new friend out until the TTL; deleting both fixed it.' },
  { t: 'What this repo actually does', body: tn(KHO.split('\n').filter((l) => !/^18[0-1]-|^18[5-8][-:]/.test(l)).join('\n'), { fs: 14, wrap: 128 }) + two(
      box('No Redis cache', `${c('grep "presence:audience"')} finds <b>0</b> lines. The repo computes the audience <b>on every connect</b> (2 queries in messaging.socket.ts + 2 in presencePrivacy.ts) and pins it on ${c('socket.data.presenceAudience')}.`, 'bad'),
      box('Staleness = the life of the socket', 'The pinned array is reused on disconnect — hours later for an open tab. That is fine for new friends (they get it on reconnect), but not for a block made in between.', 'info')),
    en: 'What this repo actually does. There is no Redis cache: grep finds zero lines. The audience is computed on every connect, two queries in the socket file and two in the privacy service, then pinned on socket data and reused on disconnect, possibly hours later.' },
  { t: 'Measured: the block that does not stick', body: seq(['Bình (43)', 'server', 'An (42)', 'Postgres'], [
      [2, 1, 'connect · user 42'], [1, 3, 'getAudience(42) → [… 43 …]'], [1, 1, 'socket.data.aud = pinned'],
      [0, 3, 'INSERT user_blocks (43 blocks 42)', '#7c3aed'], [2, 1, 'disconnect (closes tab)'],
      [1, 0, 'offline of 42 ✗ still sent', '#c0392b'], [1, 3, 'fix: re-filter at disconnect → no 43', '#1f8a3b', true],
    ], { rh: 35, fs: 17 }) + tn(CHAN.join('\n'), { fs: 13, wrap: 128 }),
    en: 'Measured: the block that does not stick. An connects and the audience, including Bình, is pinned. Bình then blocks An. When An closes the tab, the server still tells Bình that An went offline. Re-filtering the audience at disconnect sends nothing. This lab rebuilds the repo’s pattern; the fix is one extra query.' },
  { t: 'The other shape: a precomputed table', body: tsx(`CREATE TABLE presence_audience (
  user_id       INT NOT NULL,
  audience_user INT NOT NULL,
  PRIMARY KEY (user_id, audience_user)
);  -- written on every friend / thread / block change, read at connect`, { fs: 18 }) + cmp(['Strategy', 'Read at connect', 'Write cost', 'Staleness'], [
      ['compute per connect (this repo)', '4 queries · ~1 ms idle, seconds in a storm', 'none', 'life of the socket'],
      ['Redis cache-aside', '1 GET · <1 ms', 'DEL on change', '≤ TTL (300 s) if a DEL is missed'],
      ['precomputed table', '1 indexed query', 'N rows per change', 'none, if every writer updates it'],
    ], { hl: [1] }) + box('Pick by the ratio', 'Reads (connects) vastly outnumber changes (new friends, blocks) ⇒ a cache is the cheap win. A table is worth it when presence also needs SQL joins (search, “who of my friends is online”).', 'ok'),
    en: 'The other shape: a precomputed table, written whenever friends, threads or blocks change, read with one indexed query. Compare three strategies: compute per connect, Redis cache-aside, or a table. Connects vastly outnumber changes, so a cache is the cheap win.' },
  { t: 'Key terms of this lesson', body: `<div style="display:flex;flex-wrap:wrap;gap:12px">${[
      kw('Audience', '(friends ∪ thread peers) − blocked − hidden − disabled'), kw('Cache-aside', 'read cache; on miss compute + store'),
      kw('TTL', 'expiry that bounds staleness when an invalidation is missed'), kw('Invalidation', 'DEL the keys whose truth changed'),
      kw('Connection pool', 'a fixed number of DB connections; the rest queue'), kw('Pinned audience', 'computed at connect, reused at disconnect'),
      kw('Staleness', 'how old the audience can be'),
    ].join('')}</div>`, to: true,
    en: 'Key terms: audience; cache aside; TTL; invalidation; the connection pool, where extra queries queue; the pinned audience; and staleness.' },
  { t: 'Your turn — and what to keep', body: two(steps([
      'Seed 10,000 users; time one getAudience (p50, p99)',
      'Fire 10,000 at once: find the pool queue, then warm Redis and compare',
      'Add a friend without DEL: watch the stale audience; then DEL both',
      'Block mid-session: prove the pinned audience leaks, fix it',
    ]), box('Keep these', `<ul><li>Audience is a set formula — with privacy filters</li><li>Storm cost = queries ÷ pool size</li><li>Cache-aside + DEL on change + TTL backstop</li><li>Anything pinned on a socket must be re-checked before it speaks</li></ul>`, 'info'), ''),
    en: 'Your turn: seed ten thousand users and time one audience; fire ten thousand at once and compare with a warm Redis; add a friend without deleting the key and watch it go stale; and block mid-session, prove the leak, then fix it.' },
];
export const slides = lamDeck({ chuong: 'Chapter 4 — Presence and the O(N²) trap', bai: '4.2' }, S);
