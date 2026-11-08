/**
 * node-07-1 — Node.js · Chapter 7 · Lesson 7.1 "Why a database, and what one connection really costs" (slide EN, kiểu FU, đợt 6 — 01/11/2026). MỘT deck, HAI tập:
 *   7.1a (node-7-1)   = slide 1–12: lỗi cần sửa (khởi động lại ⇒ mất ghi chú, thật cả hai bản) · CSDL quan hệ mua được gì · hình dáng cả tầng ·
 *                       mỗi kết nối một tiến trình (ps thật) · phép đo 1 (kết nối mới 8,36 ms vs dùng lại 0,41 ms) · pool = tuyến xe buýt · bài tập · tự kiểm · tóm tắt
 *   7.1b (node-7-1-2) = slide 13–27: phép đo 2 (cỡ pool 1/5/10/20, backend thật) · lợi ích giảm dần · phép đo 3 (97 vs 100, slot dành cho superuser) ·
 *                       12 PrismaClient × 10 = 120 > 100 (lỗi 53300 thật) · chọn cỡ pool · client mỗi request (đếm kết nối thật) · mỗi tiến trình một client ·
 *                       request đầu chậm (78,9 vs 44,2 ms, và 8,7 ms của bản Map) · cài đặt ngày 01/11/2026 (npm i prisma ⇒ 8.0.0-rc.29 hỏng; ghim @7) ·
 *                       prisma init thật (prisma7.config.ts, skills) · ba thay đổi Prisma 7 (lỗi thật) · bí mật · bài tập · tự kiểm · tóm tắt
 * Nguồn: content/courses/nodejs/s07-prisma.mjs › nodejs-7-1-ket-noi-va-pool. Output THẬT: that/c7/{restart,backend-procs,conn-cost,pool-size,max-conn,many-clients,
 * per-request,install-latest,install-pinned,no-adapter,no-dotenv} + that/c7notes/{index,index-warm} + that/c5notes/index (log bản Map).
 * Số khác web (máy khác, không phải lỗi): 418 ms / 20 ms / 20,4× (web 402 / 19 / 21,2×) · pool 2112/431/217/122 ms (web 2160/437/237/132) ·
 * request đầu 78,9 ms (web 91,7). Khác web CÓ THẬT (đã sửa bài web): `npm i prisma` không ghim ⇒ 8.0.0-rc.29; init tạo prisma7.config.ts.
 */
import { lamDeck, two, three, box, kw, bang, cards, flow, cot, tep, R, gon, P, Q, J, T, so } from './_c7-chung.mjs';
import { ra, ma } from './_node-chung.mjs';

export const deck = { key: 'node-07-1', code: 'NODE 7.1', title: 'Why a database, and what one connection costs', sub: 'Node.js — from zero to production' };
const CAM = '#e08a1e', NODE = '#15803d', LAM = '#336791', DO = '#b0281a', TIM = '#7c3aed';
const ms = (ten, re) => Number(ra(ten).split('\n').find((l) => re.test(l)).match(/->\s+(\d+)ms/)[1]);

/** Tầng: code ⇒ Prisma Client ⇒ adapter (pool) ⇒ PostgreSQL (mỗi kết nối một tiến trình). */
function tang() {
  const w = 1110, h = 300, cols = [
    ['Your route / service', 'prisma.note.findMany({ where })', LAM],
    ['Prisma Client', 'object ⇒ SQL, rows ⇒ JS values', NODE],
    ['Driver adapter (pg)', 'holds the TCP sockets = the POOL', CAM],
    ['PostgreSQL', 'one OS process per connection', TIM],
  ];
  const bw = 250, gap = (w - bw * 4) / 3;
  let s = `<svg data-k="tang" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial"><defs><marker id="m71" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#b85a2b"/></marker></defs>`;
  cols.forEach(([t, sub, m], i) => {
    const x = i * (bw + gap);
    s += `<rect x="${x}" y="40" width="${bw}" height="150" rx="14" fill="${m}14" stroke="${m}" stroke-width="3"/>`;
    s += `<text x="${x + bw / 2}" y="100" text-anchor="middle" font-size="22" font-weight="800" fill="${m}">${t}</text>`;
    s += `<text x="${x + bw / 2}" y="140" text-anchor="middle" font-size="16" fill="#444">${sub}</text>`;
    if (i < 3) s += `<line x1="${x + bw + 4}" y1="115" x2="${x + bw + gap - 6}" y2="115" stroke="#b85a2b" stroke-width="3" marker-end="url(#m71)"/>`;
  });
  // ổ cắm pool + tiến trình
  for (let k = 0; k < 5; k++) {
    const y = 215 + k * 15;
    s += `<line x1="${2 * (bw + gap) + 40}" y1="${y}" x2="${3 * (bw + gap) + 40}" y2="${y}" stroke="${CAM}" stroke-width="2" stroke-dasharray="6 4"/>`;
    s += `<rect x="${3 * (bw + gap) + 44}" y="${y - 6}" width="150" height="12" rx="4" fill="${TIM}33" stroke="${TIM}"/>`;
  }
  s += `<text x="${3 * (bw + gap) + 200}" y="262" font-size="15" fill="${TIM}">5 backends</text>`;
  s += `<text x="${2 * (bw + gap)}" y="296" font-size="15" fill="#777">5 open connections in the pool ⇒ 5 processes on the server (see next slide)</text>`;
  return s + '</svg>';
}

/** Thanh ngang thời gian 20 truy vấn theo cỡ pool (số THẬT). */
function thanhPool() {
  const rows = [1, 5, 10, 20].map((m) => [`pool max = ${m}`, ms('c7/pool-size', new RegExp(`^pool max = ${m}\\b`))]);
  const w = 1110, h = 250, x0 = 200, wMax = 760, max = rows[0][1];
  let s = `<svg data-k="thanh" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" font-family="Arial">`;
  rows.forEach(([n, v], i) => {
    const y = 10 + i * 54, bw = Math.max(8, (v / max) * wMax);
    s += `<text x="${x0 - 14}" y="${y + 30}" text-anchor="end" font-size="21" font-weight="700" fill="#333" font-family="monospace">${n}</text>`;
    s += `<rect x="${x0}" y="${y + 8}" width="${bw}" height="32" rx="6" fill="${i === 2 ? NODE : LAM}"/>`;
    s += `<text x="${x0 + bw + 12}" y="${y + 32}" font-size="22" font-weight="800" fill="#333">${so(v)} ms</text>`;
  });
  return s + `<text x="${x0}" y="${h - 6}" font-size="16" fill="#777">20 queries × 100 ms, fired at once · PostgreSQL 17 · real</text></svg>`;
}

export const slides = lamDeck({ chuong: 'Chapter 7 — PostgreSQL & Prisma', bai: '7.1' }, [
  /* ───── 7.1a (node-7-1): slide 1–12 ───── */
  { cover: true, t: 'Why a database,<br>and what one connection costs', sub: 'Most "the database is slow" incidents are really connection incidents.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: two(
    box('Part 1 (this video)', '<ul><li>The bug this chapter fixes, run for real</li><li>What a relational database buys you</li><li>The shape of the whole layer</li><li>Measure 1: what one new connection costs</li></ul>', 'xanh'),
    box('Part 2 (next video)', '<ul><li>Measure 2 and 3: pool size, max_connections</li><li>One client per process, and why</li><li>The slow first request</li><li>Installing Prisma as it really runs today</li></ul>', 'lam')) +
    box('Installed for this chapter', 'Node.js 22 · prisma 7.10.1 · @prisma/client 7.10.1 · @prisma/adapter-pg 7.10.1 · pg 8.23.1 · PostgreSQL 17.11 in Docker. Every output in this deck is copied from a real run.', 'lam') },

  { t: 'First, look at the bug we are fixing', to: true, giua: true, body: T(R('c7/restart', 2, 7, 122), 'node restart.mjs · chapter 5 server: create, restart, read · real', { hl: [6] }) +
    T(R('c7/restart', 8, 13, 122), 'the same steps on the chapter 7 server (PostgreSQL) · real', { hl: [6, 7] }) },

  { t: 'What a relational database really buys you', to: true, giua: true, body: cards([
    ['💾 Durable', 'A committed write survives a crash: it is on disk (the WAL, write-ahead log) before you get an answer.'],
    ['🤝 One shared truth', 'Two Node processes (chapter 17: several containers) see the same data. Two Maps never do.'],
    ['🚧 Constraints', '"email is unique", "a note belongs to a real user": enforced by the database, so a bug in your code cannot break the data.'],
    ['⚛️ Transactions', 'Several writes happen all together or not at all (lesson 7.3).'],
    ['🔎 A query engine', 'Filter, sort and join millions of rows with indexes (lesson 7.5), not a JavaScript for loop.'],
    ['🚦 Concurrency control', 'Two people editing the same note at the same moment get a defined result (lesson 7.6).'],
  ], 3) + box('Durability is only the headline', 'This list is what separates a database from "a JSON file you write yourself". Each item comes back later in this course.', 'lam') },

  { t: 'The shape of the whole layer', to: true, giua: true, body: tang() + box('Read the last box twice', 'PostgreSQL starts one <b>operating-system process</b> for every open connection. That one design detail explains this whole lesson: why connections are expensive, why we reuse them, and why "just raise the pool" can take the database down.', 'cam') +
    box('Driver adapter (bộ chuyển đổi driver)', 'the small package that really talks to PostgreSQL over TCP. In Prisma 7 it is required: @prisma/adapter-pg, built on the pg library.', 'lam') },

  { t: 'One connection = one process: see it with ps', to: true, giua: true, body: two(
    T(R('c7/backend-procs', 2, 12, 70), 'node backend-procs.mjs · pool of 5, all busy · real'),
    cot(box('Read it', 'The first five lines are PostgreSQL\'s own helpers. Then <b>five</b> lines <code class="i">postgres: postgres notes … idle</code>: one process for each connection our pool opened.', 'lam'),
      box('Everyday picture', 'A restaurant that hires a new waiter for every guest. Hiring takes time; a hundred waiters fill the kitchen.', 'cam'))) +
    box('If you took PostgreSQL lesson 14.1', 'You counted these processes with ps from the database side and measured their memory. Here we see the same thing from Node.', 'xanh') },

  { t: 'Measure 1: what does one new connection cost?', to: true, giua: true, body: J(ma('c7/conn-cost', 9, 27), { hl: [4, 5, 7, 12, 15] }) },

  { t: 'Measure 1: the result', to: true, giua: true, body: T(R('c7/conn-cost', 1, 4), 'node conn-cost.mjs · median of 5 rounds · real', { hl: [2, 3, 4], sm: false }) + two(
    box('The query is not 8 ms', 'It is about <b>0.41 ms</b> of real work, wrapped in roughly <b>8 ms</b> of handshake: TCP connect, password check, PostgreSQL starts a process, sets up a session, then tears it all down.', 'cam'),
    box('On a real network it gets worse', 'Measured here with the database in Docker on the same laptop. A production database sits on another machine, and the handshake is several round trips, not one.', 'lam')) +
    box('Handshake (bắt tay)', 'the setup work before the first query can run: connect, authenticate, start a process, prepare a session.', '') },

  { t: 'The fix: a connection pool', to: true, giua: true, body: box('Everyday picture', 'A bus line, not a taxi per passenger: passengers (requests) wait at the stop, a few buses (connections) loop between the stop and PostgreSQL.', 'cam') + flow([
    { t: '120 requests', s: 'arrive at once', mau: LAM }, { t: 'Pool: 10 seats', s: '10 run, 110 queue', mau: CAM }, { t: 'A seat frees up', s: 'the next one runs', mau: NODE }, { t: '10 backends', s: 'opened once, reused', mau: TIM },
  ], { h: 150, fs: 21 }) + three(
    box('Connection pool (hồ kết nối)', 'keeps N connections open and lends one to each query, then takes it back.', 'lam'),
    box('Your query pays', '<b>0.41 ms</b>, not 8.36 ms: the handshake was paid once, when the pool opened.', 'xanh'),
    box('Prisma does this for you', 'The adapter keeps a pg pool inside. Default size: <b>10</b>.', '')) },

  { t: 'Exercise: price a busy minute', to: true, giua: true, body: box('Your task', 'An endpoint runs 3 queries per request and gets 1,000 requests in a minute. Using the measured numbers, how long do those queries take in total (a) with a new connection per query, (b) with a pool? How much time is pure handshake?', '') + box('Hint', 'Measured: a new connection per query costs 8.36 ms, a reused one 0.41 ms. Multiply, then subtract.', 'lam') +
    `<div data-k="dapan">${box('Answer', '3,000 queries. (a) 3,000 × 8.36 ms ≈ <b>25.1 s</b>. (b) 3,000 × 0.41 ms ≈ <b>1.2 s</b>. Handshake ≈ 25.1 − 1.2 ≈ <b>23.9 s</b> of every minute spent just saying hello.', 'xanh')}</div>` },

  { t: 'Self-check (part 1)', to: true, giua: true, body: `<ol>
<li>After a restart, why does the chapter 5 server return an empty list?</li>
<li>Why is opening a PostgreSQL connection expensive? Name what happens.</li>
<li>In conn-cost, why is B about 20 times faster than A?</li>
</ol>
${box('Try first', 'Pause the video and answer out loud before you look.', 'lam')}
<div data-k="dapan">${box('Answers', '1. Notes lived in a Map in RAM: the process ended, RAM was freed. &nbsp;2. TCP, authentication, a new OS process, a session — then all torn down. &nbsp;3. B pays the handshake once and reuses one connection.', 'xanh')}</div>` },

  { t: 'Summary (part 1)', to: true, giua: true, body: `<ul>
<li>A Map in RAM loses everything at every restart; PostgreSQL keeps it — measured, not promised</li>
<li>A database also gives one shared truth, constraints, transactions, a query engine, concurrency control</li>
<li>Layers: your code → Prisma Client → driver adapter (the pool) → PostgreSQL</li>
<li><b>One connection = one OS process</b> on the server (seen with ps)</li>
<li>New connection per query: 8.36 ms · reused connection: 0.41 ms · about 20 times</li>
</ul>` + box('Next', 'Part 2: how big the pool should be, the 101st connection, and installing Prisma the way it really works today.', 'lam') },

  /* ───── 7.1b (node-7-1-2): slide 13–27 ───── */
  { t: 'Measure 2: look at the pool from outside', to: true, giua: true, body: J(ma('c7/pool-size', 11, 18), { hl: [2, 7] }) + T(R('c7/pool-size', 2, 5), 'node pool-size.mjs · real', { sm: false }) +
    box('How we count', 'A second connection reads pg_stat_activity every 20 ms and keeps the highest number of pool-demo backends it sees.', 'lam') },

  { t: 'Bigger pool, diminishing returns', to: true, giua: true, body: thanhPool() + two(
    box('No magic', '1 seat: 20 queries wait in line, 20 × 100 ms ≈ 2 s. 20 seats: they all run together, ≈ 0.1 s.', 'lam'),
    box('But look at the shape', 'From 1 to 5 seats saves about <b>1.7 s</b>. From 10 to 20 saves only <b>95 ms</b>. And every extra seat is a real process on the server.', 'cam')) },

  { t: 'Measure 3: the database says no', to: true, giua: true, body: J(ma('c7/max-conn', 12, 17)) + T(R('c7/max-conn', 2, 4, 108), 'node max-conn.mjs · real') +
    two(box('max_connections = 100', 'The default. Three of them are kept for superusers, so a normal app role gets <b>97</b>.', 'lam'),
      box('Why that reserve matters', 'When the database is full, an admin can still get in to fix it. So do not run your app as the postgres superuser.', 'cam')) },

  { t: 'What really happens in production', to: true, giua: true, body: J(ma('c7/many-clients', 6, 11)) + T(R('c7/many-clients', 2, 8), 'node many-clients.mjs · 12 clients × pool 10 · real', { hl: [6] }) +
    box('The arithmetic nobody does until 2 a.m.', 'connections = processes × pool per process <b>+</b> the migration job <b>+</b> the psql session you forgot <b>+</b> every background worker (chapter 13). It must stay under max_connections, with room to spare.', 'do2') },

  { t: 'Choosing a pool size', to: true, giua: true, body: three(
    box('Start small', '5–10 per process, then <b>count the processes</b>. A 4-core API container doing normal CRUD runs out of CPU long before it runs out of 10 connections.', 'xanh'),
    box('A full database refuses everyone', 'Including your health check. The whole service looks dead while PostgreSQL is busy saying no.', 'do2'),
    box('Need hundreds of clients?', 'Put a connection pooler in front of PostgreSQL (<b>PgBouncer</b>), not a bigger pool inside Node.', 'lam')) +
    box('If you took PostgreSQL lesson 14.2', 'You sized pools from the database side and ran PgBouncer with 150 clients on 10 connections. Here we meet the same limits from the Node side.', 'cam') +
    box('Rule of thumb', 'Count first, then choose: (processes × pool) + jobs + sessions must leave spare room under the limit.', 'lam') },

  { t: 'The bug: a new client inside the handler', to: true, giua: true, body: J(ma('c7/per-request', 7, 10), { hl: [2] }) + T(R('c7/per-request', 2, 5), 'node per-request.mjs · counting real connections · real') +
    box('One pool per request', 'Every new PrismaClient opens its own pool. Nothing closes it. About one connection per request, until request 100 is refused.', 'do2') },

  { t: 'One client per process: the only right shape', to: true, giua: true, body: J(tep('c7notes/db.mjs'), { sm: false }) + two(box('Created once, imported everywhere', 'Twenty files can <code class="i">import { prisma } from \'./db.mjs\'</code>: still one client, one pool.', 'xanh'),
      box('Why it works', 'An ES module body runs <b>once per process</b>, no matter how many files import it (lesson 1.5).', 'lam')) +
    box('Never inside a handler', 'The previous slide: a client per request is a pool per request.', 'do2') },

  { t: 'The first request is always the slow one', to: true, giua: true, body: two(
    T(ra('c7notes/index', 1, 6, 'server'), 'chapter 7 server log · no warm-up · real'),
    T(ra('c7notes/index-warm', 1, 6, 'server'), 'with await prisma.$connect() at start · real')) +
    J(tep('c7notes/index-warm.mjs', 4, 6), { sm: false }) +
    two(box('Read it honestly', 'Warm-up saves about 35 ms (78.9 → 44.2 ms): the pool is open. The rest is Node and Prisma warming up the first query — even the chapter 5 Map server logged 8.7 ms first.', 'cam'),
      box('Lazy by default', 'Prisma opens the pool at the first query, not at import. In production that first query is a real user, one second after a deploy.', 'lam')) },

  { t: 'Installing Prisma, 1 November 2026: the trap', to: true, giua: true, body: T(R('c7/install-latest', 1, 10), 'npm i prisma @prisma/client @prisma/adapter-pg · then init · real', { hl: [5, 6, 7, 10] }) +
    two(box('What happened', 'The <b>latest</b> tag of the prisma CLI pointed to a release candidate, <b>8.0.0-rc.29</b>, while @prisma/client stayed on 7.10.1. Mixed versions, and the init flag no longer exists.', 'do2'),
      box('The rule', 'All Prisma packages on the <b>same version</b>. Pin the major: <code class="i">npm i prisma@7 @prisma/client@7 @prisma/adapter-pg@7</code>', 'xanh')) },

  { t: 'prisma init, pinned to 7', to: true, giua: true, body: two(
    T(R('c7/install-pinned', 1, 20), 'npm ls · npx prisma init · real'),
    cot(T(R('c7/install-pinned', 67, 78), 'cat prisma7.config.ts (comment lines cut)'),
      box('Two surprises in 7.10', 'The config file is called <b>prisma7.config.ts</b>. And init installs "skills" folders for AI coding tools: you may delete them.', 'cam'))) },

  { t: 'Three Prisma 7 changes old tutorials get wrong', to: true, giua: true, body: three(
    box('1 · Generator', '<code class="i">prisma-client</code> writes TypeScript into <b>generated/prisma</b>, not node_modules. You import it from your own folder (Node 22 runs .ts directly).', 'lam'),
    box('2 · Adapter required', 'No adapter ⇒ error at construction, below.', 'do2'),
    box('3 · .env not auto-loaded', '<code class="i">import \'dotenv/config\'</code>, or the URL is silently undefined.', 'cam')) +
    T(R('c7/no-adapter', 2, 4), 'new PrismaClient() · real') + T(R('c7/no-dotenv', 1, 3), 'forgot dotenv · real (pg then tries your OS user on localhost:5432)') },

  { t: 'Keep the real URL out of git', to: true, giua: true, body: T(R('c7/install-pinned', 79, 85) + '\n' + R('c7/install-pinned', 93, 93), 'written by prisma init · real (comment lines of .env cut)', { sm: false }) + three(
    box('.env', 'Holds DATABASE_URL with the real password. Never committed.', 'do2'),
    box('.env.example', 'Same keys, fake values, committed: teammates know which variables exist.', 'xanh'),
    box('Chapter 9', 'Secrets management, properly.', 'lam')) },

  { t: 'Exercise: will it fit?', to: true, giua: true, body: box('Your task', 'max_connections = 100, your app connects as a normal role. You run 4 API containers, each with 2 PrismaClient (one module forgot to import db.mjs), pool 10 each. Plus a migration job (1) and two psql sessions. Does it fit? What is the one-line fix?', '') + box('Hint', 'Use the formula from this lesson. Remember the 3 slots a normal role cannot use.', 'lam') +
    `<div data-k="dapan">${box('Answer', '4 × 2 × 10 = 80, + 1 + 2 = <b>83</b> of the <b>97</b> a normal role may use: it fits today, with little room. One more container (+20) ⇒ 103: refused. Fix: one client per process (import db.mjs) ⇒ 4 × 10 + 3 = <b>43</b>.', 'xanh')}</div>` },

  { t: 'Self-check (part 2)', to: true, giua: true, body: `<ol>
<li>From pool 10 to pool 20 saved how much in Measure 2, and why not always use 20?</li>
<li>Why does a normal role get 97 connections, not 100?</li>
<li>What happens if you create a PrismaClient inside a request handler?</li>
<li>Why pin <code class="i">prisma@7</code> when you install?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. About 95 ms; each seat is a real server process, and every process multiplies it. &nbsp;2. Three slots are reserved for superusers. &nbsp;3. A new pool per request: connections pile up until the server refuses. &nbsp;4. latest pointed to an 8.0 release candidate: mixed versions break.', 'xanh')}</div>` },

  { t: 'Summary (part 2)', to: true, giua: true, body: `<ul>
<li>Pool size has diminishing returns: 2,112 → 431 → 217 → 122 ms; start with 5–10 per process</li>
<li>Total = processes × pool + jobs + sessions + workers, under max_connections (97 for a normal role)</li>
<li>One PrismaClient per process, in <code class="i">src/db.mjs</code>; a client per request exhausts the server</li>
<li>Warm the pool with <code class="i">$connect()</code>; the first query of each kind still pays a little</li>
<li>Prisma 7: same version for every package, generated client in your folder, adapter required, load .env yourself</li>
</ul>` + box('Next: lesson 7.2', 'The schema, and migrations that survive production — including one that dies halfway.', 'lam') },
]);
