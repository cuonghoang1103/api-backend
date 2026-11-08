/** Node.js 7.1 — Một kết nối tốn gì: 8,03 ms vs 0,38 ms, pool có hàng đợi, ngân sách max_connections, một PrismaClient mỗi tiến trình, request đầu chậm. */
import { modul, cs, q, tn, jsBai, goi } from './_node-c6-8.mjs';

/* ── 1. Trắc nghiệm ── */
const E1 = cs({
  ten: '7.1 · 1 — What a connection costs, and who pays for it', kho: 'EASY', phut: 8,
  en: 'Lesson 7.1 starts where most tutorials skip: the connection. Almost every “the database is slow” incident is really a connection problem. Six questions on the lesson’s measurements and on Prisma 7’s setup.',
  vi: 'Bài 7.1 bắt đầu ở chỗ hầu hết hướng dẫn bỏ qua: kết nối. Gần như mọi sự cố "CSDL chậm" thật ra là vấn đề kết nối. Sáu câu hỏi về các phép đo của bài và cách dựng Prisma 7.',
  cau: [
    q('c1', ['50 × <code>SELECT 1</code>: a new connection each time took 8.03 ms/query, one reused connection 0.38 ms/query. Where did the other 7.6 ms go?', '50 × <code>SELECT 1</code>: mỗi lần một kết nối mới mất 8,03 ms/truy vấn, một kết nối dùng lại mất 0,38 ms. 7,6 ms còn lại đi đâu?'],
      ['TCP connect, authentication, PostgreSQL forking a backend process, session setup — then tearing it all down', 'Parsing the SQL text, which is cached on a reused connection', 'JSON serialisation of the result in Node', 'The event loop waiting for the garbage collector'],
      ['PostgreSQL forks one OS process per connection. That single fact is the whole argument for a pool.', 'PostgreSQL tạo một tiến trình hệ điều hành cho mỗi kết nối. Một sự thật đó là toàn bộ lý do cần pool.']),
    q('c2', ['Pool size 1 → 5 saved 1.7 s for 20 × 100 ms queries; 10 → 20 saved 105 ms. What does that tell you?', 'Pool từ 1 → 5 tiết kiệm 1,7 s cho 20 × 100 ms truy vấn; 10 → 20 tiết kiệm 105 ms. Điều đó nói gì?'],
      ['Pool size has sharply diminishing returns, while each connection has a real cost on the database', 'Bigger pools are always better, so use 100', 'The database got faster as the pool grew', 'Pool size does not matter for queries that take 100 ms'],
      ['Start with 5–10 per process. A 4-core API container saturates its CPU long before 10 connections.', 'Bắt đầu với 5–10 mỗi tiến trình. Container API 4 nhân hết CPU từ lâu trước khi dùng hết 10 kết nối.']),
    q('c3', ['3 containers, each accidentally builds 4 PrismaClients, each with a pool of 10. max_connections = 100. What happens?', '3 container, mỗi cái lỡ tạo 4 PrismaClient, mỗi client pool 10. max_connections = 100. Chuyện gì xảy ra?'],
      ['120 connections > 100 ⇒ “sorry, too many clients already” (53300)', 'PostgreSQL queues the extra 20 connections until others close', 'Prisma shares one pool between the 4 clients automatically', 'Only the 4th client of each container fails, the rest work'],
      ['Total = processes × pool per process, plus migrations, workers and that psql session you left open.', 'Tổng = số tiến trình × pool mỗi tiến trình, cộng migration, worker và phiên psql bạn quên đóng.']),
    q('c4', ['Twenty files do <code>import { prisma } from "./db.mjs"</code>. How many clients (pools) exist in that process?', 'Hai mươi tệp cùng <code>import { prisma } from "./db.mjs"</code>. Trong tiến trình đó có bao nhiêu client (pool)?'],
      ['One — an ES module body runs once per process, no matter how many files import it', 'Twenty — one per importing file', 'One per request, because Express creates a new scope', 'Zero until each file calls new PrismaClient()'],
      ['The rule: one client per process. new PrismaClient() inside a handler is a pool per request — the process falls over in minutes.', 'Luật: một client mỗi tiến trình. new PrismaClient() trong handler là một pool mỗi request — tiến trình sập trong vài phút.']),
    q('c5', ['The server log after a deploy: <code>POST /api/v1/notes 201 91.7ms</code>, then <code>201 3.9ms</code>. Why is the first one 24× slower?', 'Log server sau deploy: <code>POST /api/v1/notes 201 91.7ms</code>, rồi <code>201 3.9ms</code>. Vì sao lần đầu chậm 24 lần?'],
      ['Prisma connects lazily: the first query pays the connection handshake', 'The first INSERT creates the table', 'Express compiles the route on the first request', 'The note had a longer title'],
      ['A health check that touches the database warms the pool before real users do.', 'Health check có chạm CSDL làm ấm pool trước khi người dùng thật tới.']),
    q('c6', ['A 2024 blog post imports PrismaClient from <code>@prisma/client</code>, never passes an adapter and never loads dotenv. On Prisma 7 what breaks?', 'Một bài blog 2024 import PrismaClient từ <code>@prisma/client</code>, không truyền adapter và không nạp dotenv. Trên Prisma 7 cái gì hỏng?'],
      ['All three: client output path, a required adapter, and no auto-loaded .env', 'Nothing: Prisma 7 keeps full backwards compatibility with Prisma 5 code', 'Only the import path changes; driver adapters are still entirely optional', 'Only dotenv, because Prisma now reads .env files from node_modules'],
      ['And pin the major version: unpinned installs mixed an 8.0.0 RC CLI with client 7.10.1 on 1 Nov 2026.', 'Và ghim phiên bản chính: cài không ghim đã trộn CLI 8.0.0 RC với client 7.10.1 ngày 1/11/2026.']),
  ],
  goiY: [['Every open connection is one PostgreSQL process with its own memory.', 'Mỗi kết nối mở là một tiến trình PostgreSQL với bộ nhớ riêng.'], ['Multiply before you deploy: containers × clients × pool size.', 'Nhân trước khi deploy: container × client × kích thước pool.']],
  loi: [['“The database is slow, raise the pool size” — the usual way a database is taken down.', '"CSDL chậm, tăng pool lên" — cách quen thuộc để đánh sập CSDL.'], ['Creating new PrismaClient() inside a request handler.', 'Tạo new PrismaClient() trong handler của request.']],
  tns: [tn('connection pool', 'nhóm kết nối', 'Giữ N kết nối mở để dùng lại.'), tn('max_connections', 'max_connections', 'Trần kết nối của PostgreSQL (mặc định 100).'), tn('driver adapter', 'bộ chuyển trình điều khiển', 'Lớp giữ socket — chính là pool.')],
  kn: ['connection pool', 'Prisma 7'],
});

/* ── 2. Ngân sách kết nối ── */
function connectionBudget(cfg) {
  const { containers, clientsPerContainer, poolSize, extras = 0, maxConnections = 100, reserved = 3 } = cfg;
  // total = processes × clients per process × pool per client — plus migrations, workers, a forgotten psql
  const total = containers * clientsPerContainer * poolSize + extras;
  // a normal role cannot use the superuser-reserved slots: 100 - 3 = 97 in the lesson
  const available = maxConnections - reserved;
  // the biggest pool each client could have and still fit
  const maxPoolPerClient = Math.floor((available - extras) / (containers * clientsPerContainer));
  return { total, available, ok: total <= available, maxPoolPerClient };
}
const E2 = jsBai({
  ten: '7.1 · 2 — Write connectionBudget(cfg): do the arithmetic nobody does until 2 a.m.', kho: 'EASY', phut: 10,
  en: `<p>“Total connections = (number of processes) × (pool size per process) — plus your migrations job, plus the psql session you left open, plus any background worker.” And PostgreSQL keeps a few slots for superusers: the lesson measured 97 for a normal role out of <code>max_connections = 100</code>. Write <code>connectionBudget(cfg)</code>:</p>
<ul><li><code>cfg = { containers, clientsPerContainer, poolSize, extras = 0, maxConnections = 100, reserved = 3 }</code>.</li>
<li>Return <code>{ total, available, ok, maxPoolPerClient }</code>: <code>total = containers × clientsPerContainer × poolSize + extras</code>; <code>available = maxConnections − reserved</code>; <code>ok = total ≤ available</code>; <code>maxPoolPerClient</code> = the largest integer pool size that would still fit = <code>⌊(available − extras) / (containers × clientsPerContainer)⌋</code>.</li></ul>
<p>The lesson’s incident: 3 containers × 4 clients × pool 10 = 120 > 97 ⇒ <code>53300 sorry, too many clients already</code>.</p>`,
  vi: `<p>"Tổng kết nối = (số tiến trình) × (kích thước pool mỗi tiến trình) — cộng job migration, cộng phiên psql bạn để mở, cộng mọi worker nền." Và PostgreSQL giữ vài chỗ cho superuser: bài đo được 97 cho vai trò thường trên <code>max_connections = 100</code>. Viết <code>connectionBudget(cfg)</code>:</p>
<ul><li><code>cfg = { containers, clientsPerContainer, poolSize, extras = 0, maxConnections = 100, reserved = 3 }</code>.</li>
<li>Trả <code>{ total, available, ok, maxPoolPerClient }</code>: <code>total = containers × clientsPerContainer × poolSize + extras</code>; <code>available = maxConnections − reserved</code>; <code>ok = total ≤ available</code>; <code>maxPoolPerClient</code> = kích thước pool nguyên lớn nhất vẫn vừa = <code>⌊(available − extras) / (containers × clientsPerContainer)⌋</code>.</li></ul>
<p>Sự cố của bài: 3 container × 4 client × pool 10 = 120 > 97 ⇒ <code>53300 sorry, too many clients already</code>.</p>`,
  yc: [['Use the defaults when a field is missing.', 'Dùng giá trị mặc định khi thiếu trường.'], ['<code>ok</code> is true when total equals available exactly.', '<code>ok</code> là true khi total bằng đúng available.']],
  goiY: [['Destructure with defaults: <code>const { extras = 0, maxConnections = 100, reserved = 3 } = cfg</code>.', 'Destructure kèm mặc định: <code>const { extras = 0, maxConnections = 100, reserved = 3 } = cfg</code>.'], ['<code>Math.floor</code> for the largest pool that still fits.', '<code>Math.floor</code> cho pool lớn nhất còn vừa.']],
  loi: [['Comparing with 100 instead of 97: the last 3 slots refuse a normal role.', 'So với 100 thay vì 97: 3 chỗ cuối từ chối vai trò thường.'], ['Forgetting the extras — the migration job runs during the deploy, exactly when every container restarts.', 'Quên phần cộng thêm — job migration chạy đúng lúc deploy, khi mọi container khởi động lại.']],
  gt: ['A full database refuses every new connection, including your health check, so the whole service looks dead. The budget has to be computed before the deploy, for the worst moment — every container plus the migration job — not for the average.', 'CSDL đầy từ chối mọi kết nối mới, kể cả health check, nên cả dịch vụ trông như chết. Ngân sách phải tính trước deploy, cho lúc tệ nhất — mọi container cộng job migration — không phải lúc trung bình.'],
  kn: ['connection pool', 'capacity planning'],
  tns: [tn('superuser reserved connections', 'kết nối dành cho superuser', 'superuser_reserved_connections (mặc định 3).'), tn('53300', 'mã 53300', 'too many clients already.')],
  dau: `function connectionBudget(cfg) {
  // Write your solution here
  const total = cfg.containers * cfg.poolSize;
  return { total, available: 100, ok: total <= 100, maxPoolPerClient: 10 };
}
`,
  giai: connectionBudget,
  cases: [
    { goi: goi('connectionBudget', { containers: 3, clientsPerContainer: 4, poolSize: 10 }), moTa: ['The lesson’s incident: 120 > 97', 'Sự cố của bài: 120 > 97'] },
    { goi: goi('connectionBudget', { containers: 3, clientsPerContainer: 1, poolSize: 10, extras: 2 }) },
    { goi: goi('connectionBudget', { containers: 4, clientsPerContainer: 1, poolSize: 24, extras: 1 }), an: true },
    { goi: goi('connectionBudget', { containers: 2, clientsPerContainer: 2, poolSize: 50, maxConnections: 200, reserved: 0 }), an: true },
    { goi: goi('connectionBudget', { containers: 1, clientsPerContainer: 1, poolSize: 97 }), an: true },
  ],
});

/* ── 3. Client lười: kết nối ở truy vấn đầu, một lần duy nhất ── */
function createLazyClient(connect) {
  let conn = null;          // the open connection, once we have it
  let connecting = null;    // the in-flight connect() — shared by everyone who arrives while it runs
  let connects = 0;
  function ensure() {
    if (conn) return Promise.resolve(conn);
    if (!connecting) {
      connects++;
      connecting = connect().then((c) => { conn = c; return c; }, (err) => { connecting = null; throw err; });  // a failed connect may be retried
    }
    return connecting;
  }
  return {
    $connect: () => ensure().then(() => undefined),          // warm the pool at boot instead of on a user's request
    query: async (sql) => (await ensure()).query(sql),
    connectCount: () => connects,
  };
}
const FAKE_PG = `const mkPg = (connectMs = 8, queryMs = 1) => { let opened = 0;
  const connect = () => new Promise((ok) => setTimeout(() => { opened++; const id = opened; ok({ id, query: (sql) => new Promise((r) => setTimeout(() => r({ conn: id, sql }), queryMs)) }); }, connectMs));
  connect.opened = () => opened; return connect; };
const t = () => Date.now() - 1767225600000;`;
const E3 = jsBai({
  ten: '7.1 · 3 — Write createLazyClient(connect): connect on the first query, exactly once', kho: 'MEDIUM', phut: 15,
  en: `<p>Prisma connects lazily — the first query opens the connection, which is why the first request after a deploy took 91.7 ms and the next one 3.9 ms. Build that behaviour. <code>connect()</code> is a fake that resolves after 8 virtual ms with a connection <code>{ id, query(sql) }</code> (a query takes 1 ms). Write <code>createLazyClient(connect)</code> returning:</p>
<ul><li><code>query(sql)</code> — opens the connection on first use, then reuses it forever; resolves to what <code>conn.query(sql)</code> resolves.</li>
<li><code>$connect()</code> — opens it now (warm-up at boot); resolves to <code>undefined</code>; a later query does not connect again.</li>
<li><code>connectCount()</code> — how many times <code>connect()</code> was called.</li></ul>
<p>The trap: five requests arrive at the same instant right after boot. All five must share <b>one</b> connect — not open five. If <code>connect()</code> rejects, the next query may try again.</p>`,
  vi: `<p>Prisma kết nối lười — truy vấn đầu mở kết nối, nên request đầu sau deploy mất 91,7 ms và request sau 3,9 ms. Hãy dựng hành vi đó. <code>connect()</code> là hàm GIẢ resolve sau 8 ms ảo với một kết nối <code>{ id, query(sql) }</code> (truy vấn mất 1 ms). Viết <code>createLazyClient(connect)</code> trả về:</p>
<ul><li><code>query(sql)</code> — mở kết nối ở lần dùng đầu, rồi dùng lại mãi; resolve đúng thứ <code>conn.query(sql)</code> resolve.</li>
<li><code>$connect()</code> — mở ngay (làm ấm lúc khởi động); resolve <code>undefined</code>; truy vấn sau không kết nối lại.</li>
<li><code>connectCount()</code> — số lần đã gọi <code>connect()</code>.</li></ul>
<p>Cái bẫy: năm request tới cùng lúc ngay sau khởi động. Cả năm phải dùng chung <b>một</b> lần connect — không được mở năm cái. Nếu <code>connect()</code> reject, truy vấn sau được thử lại.</p>`,
  yc: [['At most one connect in flight at any time.', 'Tại mọi thời điểm có tối đa một lần connect đang chạy.'], ['Never connect at construction — only on the first query or $connect().', 'Không kết nối lúc tạo — chỉ ở truy vấn đầu hoặc $connect().']],
  goiY: [['Keep two variables: <code>conn</code> (ready) and <code>connecting</code> (the Promise of the connect in progress).', 'Giữ hai biến: <code>conn</code> (đã sẵn sàng) và <code>connecting</code> (Promise của lần connect đang chạy).'], ['Whoever arrives while <code>connecting</code> is set simply awaits that same Promise.', 'Ai tới khi <code>connecting</code> đã có thì chỉ việc await đúng Promise đó.']],
  loi: [['<code>if (!conn) conn = await connect()</code>: five simultaneous first queries all see <code>conn === null</code> and open five connections.', '<code>if (!conn) conn = await connect()</code>: năm truy vấn đầu đồng thời đều thấy <code>conn === null</code> và mở năm kết nối.'], ['Calling <code>connect()</code> inside every <code>query</code> — the 8 ms per query of measurement A, a pool per request.', 'Gọi <code>connect()</code> trong mọi <code>query</code> — đúng 8 ms mỗi truy vấn của phép đo A, mỗi request một pool.']],
  gt: ['Caching the Promise rather than the result is the standard way to deduplicate concurrent async work: the first caller starts it, everyone else awaits the same object. The result is the lesson’s log line — the first query pays 8 ms of handshake, the next ones pay 1 ms — and $connect() moves that cost from a user to the boot sequence.', 'Cache Promise thay vì kết quả là cách chuẩn để khử trùng việc bất đồng bộ chạy đồng thời: người gọi đầu khởi động, mọi người khác await cùng một object. Kết quả là đúng dòng log của bài — truy vấn đầu trả 8 ms bắt tay, các truy vấn sau trả 1 ms — và $connect() dời chi phí đó từ người dùng sang lúc khởi động.'],
  kn: ['lazy connection', 'promises'],
  tns: [tn('lazy', 'lười', 'Chỉ làm khi thật sự cần.'), tn('warm-up', 'làm ấm', 'Mở kết nối trước khi có request thật.')],
  dau: `function createLazyClient(connect) {
  let conn = null;
  let connects = 0;
  return {
    // Write your solution here
    $connect: async () => {},
    query: async (sql) => { if (!conn) { connects++; conn = await connect(); } return conn.query(sql); },
    connectCount: () => connects,
  };
}
`,
  giai: createLazyClient,
  chung: FAKE_PG,
  cases: [
    { goi: `await (async () => { const c = createLazyClient(mkPg()); const a = await c.query('SELECT 1'); const t1 = t(); const b = await c.query('SELECT 1'); return [a, b, t1, t() - t1, c.connectCount()]; })()`, moTa: ['First query 9 ms (handshake), second 1 ms', 'Truy vấn đầu 9 ms (bắt tay), lần hai 1 ms'] },
    { goi: `await (async () => { const pg = mkPg(); const c = createLazyClient(pg); const rs = await Promise.all([1, 2, 3, 4, 5].map((i) => c.query('q' + i))); return [rs.map((r) => r.conn), pg.opened(), c.connectCount()]; })()`, moTa: ['Five simultaneous first queries ⇒ one connect', 'Năm truy vấn đầu đồng thời ⇒ một lần connect'] },
    { goi: `await (async () => { const pg = mkPg(); const c = createLazyClient(pg); const before = pg.opened(); const w = await c.$connect(); const t1 = t(); await c.query('x'); return [before, w, t() - t1, pg.opened()]; })()`, an: true, moTa: ['$connect warms: the first query then costs 1 ms', '$connect làm ấm: truy vấn đầu sau đó chỉ 1 ms'] },
    { goi: `await (async () => { let n = 0; const connect = () => new Promise((ok, no) => setTimeout(() => (++n === 1 ? no(new Error('ECONNREFUSED')) : ok({ query: (s) => Promise.resolve('ok ' + s) })), 5)); const c = createLazyClient(connect); let first; try { await c.query('a'); } catch (e) { first = e.message; } return [first, await c.query('b'), c.connectCount()]; })()`, an: true },
    { goi: `await (async () => { const pg = mkPg(); const c = createLazyClient(pg); await Promise.all([c.$connect(), c.query('a'), c.$connect()]); return [pg.opened(), c.connectCount()]; })()`, an: true },
  ],
  saiMau: [
    `function createLazyClient(connect) { let conn = null, n = 0; const ensure = async () => { if (!conn) { n++; conn = await connect(); } return conn; };
  return { $connect: async () => { await ensure(); }, query: async (sql) => (await ensure()).query(sql), connectCount: () => n }; }`,
  ],
});

/* ── 4. Pool có hàng đợi ── */
function createPool({ max, connect }) {
  const idle = [];          // open connections nobody is using
  const waiting = [];       // resolvers of callers waiting for a connection, FIFO
  let opened = 0;
  async function acquire() {
    if (idle.length) return idle.pop();
    if (opened < max) { opened++; return connect(); }       // open lazily, never more than max
    return new Promise((resolve) => waiting.push(resolve));  // pool full: queue
  }
  function release(conn) {
    const next = waiting.shift();
    if (next) next(conn);                                    // hand the connection straight to the next in line
    else idle.push(conn);
  }
  return {
    async query(sql) {
      const conn = await acquire();
      try { return await conn.query(sql); }
      finally { release(conn); }                             // always give it back, even if the query failed
    },
    stats: () => ({ opened, idle: idle.length, waiting: waiting.length }),
  };
}
const SLEEP = `const mkPgSleep = (connectMs = 8, queryMs = 100) => { let opened = 0, live = 0, peak = 0;
  const connect = () => new Promise((ok) => setTimeout(() => { opened++; const id = opened;
    ok({ id, query: (sql) => { live++; peak = Math.max(peak, live); return new Promise((r, no) => setTimeout(() => { live--; sql === 'FAIL' ? no(new Error('query failed')) : r(id); }, queryMs)); } }); }, connectMs));
  connect.opened = () => opened; connect.peak = () => peak; return connect; };
const t = () => Date.now() - 1767225600000;
const burst = async (max, n) => { const pg = mkPgSleep(); const pool = createPool({ max, connect: pg }); const t0 = t(); await Promise.all(Array.from({ length: n }, () => pool.query('SELECT 1 FROM pg_sleep(0.1)'))); return { max, ms: t() - t0, backends: pg.opened(), peak: pg.peak(), stats: pool.stats() }; };`;
const E4 = jsBai({
  ten: '7.1 · 4 — Write createPool({ max, connect }): reuse, queue, and measure the diminishing returns', kho: 'MEDIUM', phut: 20,
  en: `<p>Measurement 2 of the lesson: twenty 100 ms queries fired at once with <code>Promise.all</code>, against pools of size 1, 5, 10, 20. Build the pool and reproduce the shape. <code>connect()</code> is a fake (8 ms) returning <code>{ id, query(sql) }</code> where a query takes 100 virtual ms. Write <code>createPool({ max, connect })</code> returning:</p>
<ul><li><code>query(sql)</code>: take an idle connection if there is one; otherwise open a new one if fewer than <code>max</code> are open; otherwise <b>wait in a FIFO queue</b>. Run the query, then give the connection back — handing it directly to the first waiter, or putting it back as idle. Resolve/reject like the query.</li>
<li><code>stats()</code>: <code>{ opened, idle, waiting }</code>.</li></ul>
<p>Expected with the fake: max 1 ⇒ 20 × 100 ms ≈ 2008 ms with 1 backend; max 5 ⇒ 408 ms; max 20 ⇒ 108 ms with 20 backends. Never more backends than <code>max</code>.</p>`,
  vi: `<p>Phép đo 2 của bài: hai mươi truy vấn 100 ms bắn cùng lúc bằng <code>Promise.all</code>, với pool cỡ 1, 5, 10, 20. Hãy dựng pool và tái hiện hình dạng đó. <code>connect()</code> là hàm GIẢ (8 ms) trả <code>{ id, query(sql) }</code>, mỗi truy vấn mất 100 ms ảo. Viết <code>createPool({ max, connect })</code> trả về:</p>
<ul><li><code>query(sql)</code>: lấy một kết nối rảnh nếu có; không thì mở kết nối mới nếu đang mở ít hơn <code>max</code>; không nữa thì <b>chờ trong hàng đợi FIFO</b>. Chạy truy vấn, rồi trả kết nối — trao thẳng cho người chờ đầu tiên, hoặc đặt lại vào danh sách rảnh. Resolve/reject theo truy vấn.</li>
<li><code>stats()</code>: <code>{ opened, idle, waiting }</code>.</li></ul>
<p>Mong đợi với hàm giả: max 1 ⇒ 20 × 100 ms ≈ 2008 ms với 1 backend; max 5 ⇒ 408 ms; max 20 ⇒ 108 ms với 20 backend. Không bao giờ quá <code>max</code> backend.</p>`,
  yc: [['Open connections lazily and never more than <code>max</code>.', 'Mở kết nối lười và không bao giờ quá <code>max</code>.'], ['Waiters are served in arrival order.', 'Người chờ được phục vụ theo thứ tự tới.'], ['Release in <code>finally</code> so a failing query still returns its connection.', 'Trả kết nối trong <code>finally</code> để truy vấn hỏng vẫn trả lại kết nối.']],
  goiY: [['Three pieces of state: <code>idle</code> (array), <code>waiting</code> (array of resolve functions), <code>opened</code> (count).', 'Ba mẩu trạng thái: <code>idle</code> (mảng), <code>waiting</code> (mảng hàm resolve), <code>opened</code> (số đếm).'], ['A waiter is just <code>new Promise((resolve) => waiting.push(resolve))</code>; release calls <code>waiting.shift()(conn)</code>.', 'Người chờ chỉ là <code>new Promise((resolve) => waiting.push(resolve))</code>; release gọi <code>waiting.shift()(conn)</code>.']],
  loi: [['Opening a new connection for every query when the pool is “busy” — that is no pool, and 20 requests become 20 backends regardless of max.', 'Mở kết nối mới cho mọi truy vấn khi pool "bận" — vậy là không có pool, và 20 request thành 20 backend bất kể max.'], ['Releasing only on success: one failed query and that slot is gone forever (exercise 5 measures the result).', 'Chỉ trả khi thành công: một truy vấn hỏng là mất chỗ đó mãi (bài 5 đo hậu quả).']],
  gt: ['With max slots, n equal queries run in ⌈n / max⌉ waves, so the time is connect + ⌈n / max⌉ × 100 ms: 2008, 408, 208, 108 ms for 1, 5, 10, 20. Going 1 → 5 saves 1.6 s; going 10 → 20 saves 100 ms. That curve, set against a database process per connection, is why the lesson starts at 5–10 per process.', 'Với max chỗ, n truy vấn như nhau chạy thành ⌈n / max⌉ đợt, nên thời gian là connect + ⌈n / max⌉ × 100 ms: 2008, 408, 208, 108 ms cho 1, 5, 10, 20. Từ 1 → 5 tiết kiệm 1,6 s; từ 10 → 20 tiết kiệm 100 ms. Đường cong đó, đặt cạnh một tiến trình CSDL cho mỗi kết nối, là lý do bài bắt đầu ở 5–10 mỗi tiến trình.'],
  kn: ['connection pool', 'queues'],
  tns: [tn('FIFO', 'vào trước ra trước', 'Hàng đợi công bằng.'), tn('backend', 'tiến trình backend', 'Một tiến trình PostgreSQL phục vụ một kết nối.')],
  dau: `function createPool({ max, connect }) {
  let opened = 0;
  return {
    // Write your solution here
    async query(sql) { opened++; const conn = await connect(); return conn.query(sql); },
    stats: () => ({ opened, idle: 0, waiting: 0 }),
  };
}
`,
  giai: createPool,
  chung: SLEEP,
  cases: [
    { goi: `await burst(5, 20)`, moTa: ['Pool 5, 20 queries × 100 ms', 'Pool 5, 20 truy vấn × 100 ms'] },
    { goi: `[await burst(1, 20), await burst(20, 20)]`, moTa: ['Pool 1 vs pool 20', 'Pool 1 so với pool 20'] },
    { goi: `await (async () => { const pg = mkPgSleep(); const pool = createPool({ max: 2, connect: pg }); const order = []; await Promise.all([1, 2, 3, 4, 5].map((i) => pool.query('q').then(() => order.push(i)))); return [order, pool.stats()]; })()`, an: true, moTa: ['FIFO order, all connections idle at the end', 'Thứ tự FIFO, cuối cùng mọi kết nối đều rảnh'] },
    { goi: `[await burst(10, 20), await burst(3, 7)]`, an: true },
    { goi: `await (async () => { const pg = mkPgSleep(); const pool = createPool({ max: 1, connect: pg }); let e; try { await pool.query('FAIL'); } catch (x) { e = x.message; } const r = await pool.query('ok'); return [e, r, pool.stats()]; })()`, an: true, moTa: ['A failed query still releases', 'Truy vấn hỏng vẫn trả kết nối'] },
  ],
  saiMau: [
    createPool.toString().replace("try { return await conn.query(sql); }\n      finally { release(conn); }", 'const r = await conn.query(sql); release(conn); return r;'),
    createPool.toString().replace('if (next) next(conn);', 'if (next) { idle.push(conn); }'),
  ],
});

/* ── 5. Pool có hạn chờ (P2024) ── */
function createTimedPool({ max, connect, acquireTimeoutMs }) {
  const idle = [];
  const waiting = [];       // { resolve, timer }
  let opened = 0, inUse = 0;
  function acquire() {
    if (idle.length) { inUse++; return Promise.resolve(idle.pop()); }
    if (opened < max) { opened++; inUse++; return connect(); }
    return new Promise((resolve, reject) => {
      const w = { resolve: (c) => { clearTimeout(w.timer); inUse++; resolve(c); } };
      // waited too long: give up AND leave the queue, or a dead waiter will swallow a connection later
      w.timer = setTimeout(() => {
        waiting.splice(waiting.indexOf(w), 1);
        const err = new Error('Timed out fetching a new connection from the connection pool');
        err.code = 'P2024';
        reject(err);
      }, acquireTimeoutMs);
      waiting.push(w);
    });
  }
  function release(conn) {
    inUse--;
    const next = waiting.shift();
    if (next) next.resolve(conn);
    else idle.push(conn);
  }
  return {
    async query(sql) {
      const conn = await acquire();
      try { return await conn.query(sql); }
      finally { release(conn); }
    },
    stats: () => ({ opened, inUse, idle: idle.length, waiting: waiting.length }),
  };
}
const E5 = jsBai({
  ten: '7.1 · 5 — Write createTimedPool(): give up after acquireTimeoutMs (P2024), never leak a slot', kho: 'HARD', phut: 25,
  en: `<p>When every slot is held — say ten transactions waiting on a slow external API (lesson 7.3) — queued requests must not wait forever. Prisma fails them with <code>P2024: Timed out fetching a new connection from the connection pool</code>. Extend exercise 4: <code>createTimedPool({ max, connect, acquireTimeoutMs })</code> returns <code>{ query(sql), stats() }</code>:</p>
<ul><li>Same reuse / lazy open / FIFO queue as before.</li>
<li>A caller that has waited <code>acquireTimeoutMs</code> virtual ms without getting a connection ⇒ its promise rejects with an <code>Error</code> whose <code>code</code> is <code>"P2024"</code> and message <code>"Timed out fetching a new connection from the connection pool"</code>. It must also <b>leave the queue</b>, so a connection released later goes to a live waiter (or back to idle), never to a caller that already gave up.</li>
<li>A caller that gets a connection in time must not be rejected later (clear its timer).</li>
<li><code>stats()</code> = <code>{ opened, inUse, idle, waiting }</code>; after all work is done <code>inUse</code> is 0 — a failing query still returns its connection.</li></ul>`,
  vi: `<p>Khi mọi chỗ đều bị giữ — ví dụ mười transaction chờ một API ngoài chậm (bài 7.3) — các request đang xếp hàng không được chờ mãi. Prisma đánh hỏng chúng với <code>P2024: Timed out fetching a new connection from the connection pool</code>. Mở rộng bài 4: <code>createTimedPool({ max, connect, acquireTimeoutMs })</code> trả <code>{ query(sql), stats() }</code>:</p>
<ul><li>Dùng lại / mở lười / hàng đợi FIFO như trước.</li>
<li>Người gọi đã chờ <code>acquireTimeoutMs</code> ms ảo mà chưa có kết nối ⇒ promise của nó reject với một <code>Error</code> có <code>code</code> là <code>"P2024"</code> và message <code>"Timed out fetching a new connection from the connection pool"</code>. Nó cũng phải <b>rời hàng đợi</b>, để kết nối được trả sau đó tới một người chờ còn sống (hoặc về danh sách rảnh), không bao giờ tới người đã bỏ cuộc.</li>
<li>Người gọi nhận được kết nối kịp thời thì không được bị reject sau đó (xoá hẹn giờ của nó).</li>
<li><code>stats()</code> = <code>{ opened, inUse, idle, waiting }</code>; khi mọi việc xong <code>inUse</code> là 0 — truy vấn hỏng vẫn trả kết nối.</li></ul>`,
  yc: [['Timeout ⇒ reject with <code>code: "P2024"</code> and remove the waiter.', 'Hết giờ ⇒ reject với <code>code: "P2024"</code> và gỡ người chờ.'], ['Clear the timer of a waiter that was served.', 'Xoá hẹn giờ của người chờ đã được phục vụ.'], ['Release in <code>finally</code>.', 'Trả kết nối trong <code>finally</code>.']],
  goiY: [['Store waiters as objects <code>{ resolve, timer }</code> so the timer can find and remove its own entry: <code>waiting.splice(waiting.indexOf(w), 1)</code>.', 'Lưu người chờ dạng object <code>{ resolve, timer }</code> để hẹn giờ tìm và gỡ đúng mục của nó: <code>waiting.splice(waiting.indexOf(w), 1)</code>.'], ['Wrap the resolver: <code>w.resolve = (c) => { clearTimeout(w.timer); inUse++; resolve(c); }</code>.', 'Bọc hàm resolve: <code>w.resolve = (c) => { clearTimeout(w.timer); inUse++; resolve(c); }</code>.']],
  loi: [['Rejecting on timeout but leaving the waiter queued: the next release hands a connection to a promise nobody awaits — the slot is lost and inUse never returns to 0.', 'Reject khi hết giờ nhưng vẫn để người chờ trong hàng: lần trả sau trao kết nối cho promise không ai chờ — mất chỗ và inUse không bao giờ về 0.'], ['Raising the timeout instead of fixing the long transaction — lesson 7.3: “usually the wrong fix”.', 'Tăng thời gian chờ thay vì sửa transaction dài — bài 7.3: "thường là cách sửa sai".']],
  gt: ['A bounded wait turns “every request in the process queues forever behind ten slow transactions” into a fast, visible error — the incident that “looks like the database is down while the database is idle”. The two bookkeeping rules (leave the queue on timeout, release in finally) are what keep the pool’s count of free slots true; every pool library has had a bug in exactly one of them.', 'Chờ có hạn biến "mọi request trong tiến trình xếp hàng mãi sau mười transaction chậm" thành một lỗi nhanh, nhìn thấy được — đúng sự cố "trông như CSDL chết trong khi CSDL rảnh". Hai luật sổ sách (rời hàng khi hết giờ, trả trong finally) giữ cho số chỗ trống của pool luôn đúng; thư viện pool nào cũng từng có lỗi ở đúng một trong hai.'],
  kn: ['connection pool', 'timeouts'],
  tns: [tn('acquire timeout', 'hạn chờ lấy kết nối'), tn('P2024', 'P2024', 'Prisma: hết giờ chờ kết nối từ pool.'), tn('leak', 'rò rỉ', 'Chỗ trong pool bị mất vĩnh viễn.')],
  dau: `function createTimedPool({ max, connect, acquireTimeoutMs }) {
  // Write your solution here (start from your createPool of exercise 4)
  const idle = [], waiting = [];
  let opened = 0, inUse = 0;
  async function query(sql) {
    let conn;
    if (idle.length) conn = idle.pop();
    else if (opened < max) { opened++; conn = await connect(); }
    else conn = await new Promise((resolve) => waiting.push(resolve));
    inUse++;
    const r = await conn.query(sql);
    inUse--;
    const next = waiting.shift();
    if (next) next(conn); else idle.push(conn);
    return r;
  }
  return { query, stats: () => ({ opened, inUse, idle: idle.length, waiting: waiting.length }) };
}
`,
  giai: createTimedPool,
  chung: SLEEP.replace('const burst', 'const _b') + `
const caught = async (p) => { try { return await p; } catch (e) { return { code: e.code, message: e.message }; } };`,
  cases: [
    { goi: `await (async () => { const pool = createTimedPool({ max: 1, connect: mkPgSleep(8, 300), acquireTimeoutMs: 100 }); const r = await Promise.all([caught(pool.query('long')), caught(pool.query('waits too long'))]); return [r, pool.stats()]; })()`, moTa: ['Second caller times out after 100 ms ⇒ P2024', 'Người gọi thứ hai hết giờ sau 100 ms ⇒ P2024'] },
    { goi: `await (async () => { const pool = createTimedPool({ max: 1, connect: mkPgSleep(8, 50), acquireTimeoutMs: 100 }); const r = await Promise.all([pool.query('a'), pool.query('b')]); return [r, t(), pool.stats()]; })()`, moTa: ['Served in time ⇒ no rejection', 'Được phục vụ kịp ⇒ không bị reject'] },
    { goi: `await (async () => { const pool = createTimedPool({ max: 1, connect: mkPgSleep(8, 300), acquireTimeoutMs: 100 }); const r = await Promise.all([caught(pool.query('long')), caught(pool.query('gives up'))]); const after = await caught(pool.query('later')); return [r, after, pool.stats()]; })()`, an: true, moTa: ['A dead waiter must not swallow the released connection', 'Người chờ đã bỏ cuộc không được nuốt kết nối được trả'] },
    { goi: `await (async () => { const pool = createTimedPool({ max: 1, connect: mkPgSleep(8, 100), acquireTimeoutMs: 1000 }); const r = await Promise.all([caught(pool.query('FAIL')), caught(pool.query('ok'))]); return [r, pool.stats()]; })()`, an: true },
    { goi: `await (async () => { const pool = createTimedPool({ max: 1, connect: mkPgSleep(8, 60), acquireTimeoutMs: 100 }); const p1 = caught(pool.query('a')); const p2 = caught(pool.query('b')); await new Promise((r) => setTimeout(r, 50)); const p3 = caught(pool.query('c')); return [await p1, await p2, await p3, t(), pool.stats()]; })()`, an: true, moTa: ['A served waiter’s old timer must not touch the queue', 'Hẹn giờ cũ của người chờ đã được phục vụ không được đụng vào hàng đợi'] },
    { goi: `await (async () => { const pool = createTimedPool({ max: 2, connect: mkPgSleep(8, 100), acquireTimeoutMs: 150 }); const r = await Promise.all([1, 2, 3, 4, 5, 6].map((i) => caught(pool.query('q' + i)))); return [r, pool.stats()]; })()`, an: true },
  ],
  saiMau: [
    createTimedPool.toString().replace('        waiting.splice(waiting.indexOf(w), 1);\n', ''),
    createTimedPool.toString().replace('const w = { resolve: (c) => { clearTimeout(w.timer); inUse++; resolve(c); } };', 'const w = { resolve: (c) => { inUse++; resolve(c); } };'),
  ],
});

export default modul('nodejs-7-1-ket-noi-va-pool', '7.1 Why a database, and what one connection really costs', [E1, E2, E3, E4, E5]);
