/** SDN302 · Lab Chương 2 — Tasks API bằng Express: Router theo tài nguyên, thứ tự route, query, middleware (logger, chặn bằng API key chỉ cho thao tác ghi), validation, 404 JSON, error handler 4 tham số, bọc async (Express 4). Đề "bản in". */
import { doiDau, KHOA, bai, cs, q, qn, ord, tn } from './_sdn.mjs';

const J = String.raw;
const REPO = J`// ───── GIVEN: an asynchronous repository (pretend it is a database) ─────
const tasksRepo = {
  rows: [
    { id: 1, title: 'Set up Express', status: 'done', priority: 2 },
    { id: 2, title: 'Write the router', status: 'doing', priority: 1 },
    { id: 3, title: 'Add middleware', status: 'todo', priority: 3 },
  ],
  failNext: false,                                   // the grader flips this to simulate a database error
  async _wait() { await new Promise((r) => setTimeout(r, 5)); if (this.failNext) { this.failNext = false; throw new Error('Database timeout'); } },
  async all() { await this._wait(); return this.rows.map((t) => ({ ...t })); },
  async get(id) { await this._wait(); const t = this.rows.find((x) => x.id === id); return t ? { ...t } : null; },
  async add(data) { await this._wait(); const t = { id: this.rows.reduce((m, x) => Math.max(m, x.id), 0) + 1, ...data }; this.rows.push(t); return { ...t }; },
  async update(id, changes) { await this._wait(); const t = this.rows.find((x) => x.id === id); if (!t) return null; Object.assign(t, changes); return { ...t }; },
};
// ───── end of the given part ─────`;

const L1 = cs({
  ten: 'Lab 2 · warm-up — plan the middleware chain', kho: 'EASY', phut: 6, dangBai: 'lab', loai: 'order',
  en: 'Plan app.js before writing it: the order decides what works.',
  vi: 'Lên kế hoạch app.js trước khi viết: thứ tự quyết định cái gì chạy được.',
  cau: [ord('o1', ['Order the lines of the lab\'s app.js.', 'Sắp các dòng app.js của lab.'],
    ['<code>app.use(logger)</code> — logs every request when it finishes', '<code>app.use(express.json())</code>', '<code>app.use(\'/api/tasks\', tasksRouter)</code> — GET routes open, writes guarded by <code>requireApiKey</code> inside the router', '<code>app.use(notFound)</code> — JSON 404', '<code>app.use(errorHandler)</code> — four parameters'],
    ['Logger first so it sees every request (even 404s and errors); parser before the router; the guard is scoped to the write routes inside the router; 404 after all routes; the error handler last.', 'Logger trước để thấy mọi request (kể cả 404 và lỗi); bộ đọc trước router; lệnh chặn giới hạn cho các route ghi bên trong router; 404 sau mọi route; error handler cuối cùng.'])],
  goiY: [['Who must see everything? Who must come last?', 'Ai phải thấy mọi thứ? Ai phải đứng cuối?'], ['A guard can live on a route, not only on the app.', 'Lệnh chặn có thể nằm trên một route, không chỉ trên app.']],
  loi: [['Guarding GET routes too.', 'Chặn cả route GET.'], ['Logger after the router.', 'Logger sau router.']],
  tns: [tn('scoped guard', 'lệnh chặn theo phạm vi')],
  kn: ['middleware order'],
});

const L2 = bai({
  ten: 'Lab 2 — Tasks API with Express routing and middleware', kho: 'HARD', phut: 80, dangBai: 'lab', lib: ['express'],
  en: J`<p>Build the Tasks API of Chapter 2 on top of the given asynchronous repository. The full brief is in the statement.</p>`,
  vi: J`<p>Dựng Tasks API của Chương 2 trên kho bất đồng bộ cho sẵn. Đề đầy đủ nằm trong tờ đề.</p>`,
  yc: [['Follow the brief.', 'Làm theo tờ đề.'], ['Export <code>module.exports = { app, tasksRepo };</code>', 'Export <code>module.exports = { app, tasksRepo };</code>']],
  viDu: [['GET /api/tasks?status=todo,doing&sort=priority', '200 [{"id":2,…,"priority":1},{"id":3,…,"priority":3}]', 'Filter by several statuses, sorted.', 'Lọc nhiều trạng thái, có sắp.']],
  goiY: [['Write <code>wrap</code> first (lesson 2.2) and use it on every route: the repository is async and can fail.', 'Viết <code>wrap</code> trước (bài 2.2) và dùng cho mọi route: kho là async và có thể hỏng.'], ['Status moves only forward: <code>const ORDER = [\'todo\', \'doing\', \'done\']</code>; allowed when <code>ORDER.indexOf(next) === ORDER.indexOf(current) + 1</code>.', 'Trạng thái chỉ tiến: <code>const ORDER = [\'todo\', \'doing\', \'done\']</code>; được phép khi <code>ORDER.indexOf(next) === ORDER.indexOf(current) + 1</code>.']],
  loi: [['Declaring <code>/:id</code> before a fixed path, or putting <code>express.json()</code> after the router.', 'Khai <code>/:id</code> trước một đường cố định, hoặc đặt <code>express.json()</code> sau router.'], ['Guarding the whole router: the GET routes must stay open.', 'Chặn cả router: các route GET phải mở.'], ['Async routes without <code>wrap</code>: a database error hangs the request (Express 4).', 'Route async không có <code>wrap</code>: lỗi CSDL làm treo request (Express 4).']],
  gt: ['Every idea of Chapter 2 in one app: a resource router, query parsing, a scoped guard, validation that returns precise 400/409 answers, a logger that sees the final status, and the 404 + error handler pair that turns every failure — including async ones forwarded by <code>wrap</code> — into one JSON shape.', 'Mọi ý của Chương 2 trong một app: router theo tài nguyên, đọc query, lệnh chặn theo phạm vi, validation trả 400/409 chính xác, logger thấy mã cuối cùng, và cặp 404 + error handler biến mọi thất bại — kể cả lỗi async được <code>wrap</code> chuyển tới — thành một dạng JSON.'],
  kn: ['Express', 'middleware', 'validation'],
  tns: [tn('state machine', 'máy trạng thái', 'todo → doing → done')],
  env: { API_KEY: 'lab2-key' },
  banIn: {
    tieuDe: { en: 'Lab 2 — Tasks API (Express)', vi: 'Lab 2 — Tasks API (Express)' },
    phu: { en: 'Express 4 · Router · middleware · 80 minutes · 10 marks', vi: 'Express 4 · Router · middleware · 80 phút · 10 điểm' },
    moTa: { en: '<p>A small task tracker for a team. The data lives in the given asynchronous <code>tasksRepo</code> (it waits like a database and can fail). Write the Express app in <code>answer.js</code> below the given part and export <code>{ app, tasksRepo }</code>. The grader calls <code>app.inject(…)</code>. All answers are JSON.</p>', vi: '<p>Một công cụ theo dõi việc nhỏ cho nhóm. Dữ liệu nằm trong <code>tasksRepo</code> bất đồng bộ cho sẵn (nó chờ như một CSDL và có thể hỏng). Viết app Express trong <code>answer.js</code> bên dưới phần cho sẵn và export <code>{ app, tasksRepo }</code>. Máy chấm gọi <code>app.inject(…)</code>. Mọi câu trả lời là JSON.</p>' },
    yeuCauChung: [
      { en: 'One <code>express.Router()</code> mounted at <code>/api/tasks</code>.', vi: 'Một <code>express.Router()</code> gắn ở <code>/api/tasks</code>.' },
      { en: 'Write routes (POST, PATCH) require header <code>x-api-key</code> equal to <code>process.env.API_KEY</code> → else 401 <code>{ "error": "API key required" }</code> (missing) / <code>{ "error": "Invalid API key" }</code> (wrong). GET routes are open.', vi: 'Route ghi (POST, PATCH) cần header <code>x-api-key</code> bằng <code>process.env.API_KEY</code> → không thì 401 <code>{ "error": "API key required" }</code> (thiếu) / <code>{ "error": "Invalid API key" }</code> (sai). Route GET thì mở.' },
      { en: 'Every async route is wrapped so repository errors reach the error handler.', vi: 'Mọi route async được bọc để lỗi của kho tới được error handler.' },
    ],
    cayThuMuc: 'answer.js   ← the given repository + your app\nlib/        ← provided (Express stand-in)',
    moHinh: { ten: 'Task', truong: [['id', 'Number', { en: 'given by the repository', vi: 'kho cấp' }], ['title', 'String', { en: '3–80 characters after trim', vi: '3–80 ký tự sau trim' }], ['status', 'String', { en: "'todo' | 'doing' | 'done' (new tasks start as 'todo')", vi: "'todo' | 'doing' | 'done' (việc mới bắt đầu là 'todo')" }], ['priority', 'Number', { en: 'integer 1–3, default 2', vi: 'số nguyên 1–3, mặc định 2' }]] },
    duLieuMau: 'id 1 · Set up Express · done · priority 2\nid 2 · Write the router · doing · priority 1\nid 3 · Add middleware · todo · priority 3',
    chucNang: [
      { ten: { en: 'List with filters', vi: 'Danh sách có lọc' }, diem: 2, yeuCau: [
        { en: '<code>GET /api/tasks</code> → 200 all tasks (repository order).', vi: '<code>GET /api/tasks</code> → 200 mọi việc (thứ tự của kho).' },
        { en: '<code>?status=todo,doing</code> — one or several statuses, comma-separated; an unknown status → 400 <code>{ "error": "Invalid status" }</code>.', vi: '<code>?status=todo,doing</code> — một hay nhiều trạng thái, cách nhau dấu phẩy; trạng thái lạ → 400 <code>{ "error": "Invalid status" }</code>.' },
        { en: '<code>?sort=priority</code> (ascending) or <code>?sort=-priority</code>; another value → 400 <code>{ "error": "Invalid sort" }</code>.', vi: '<code>?sort=priority</code> (tăng dần) hoặc <code>?sort=-priority</code>; giá trị khác → 400 <code>{ "error": "Invalid sort" }</code>.' }] },
      { ten: { en: 'Read one', vi: 'Đọc một việc' }, diem: 1.5, yeuCau: [
        { en: '<code>GET /api/tasks/:id</code> → 200 · id not a positive integer → 400 <code>{ "error": "Invalid id" }</code> · unknown → 404 <code>{ "error": "Task not found" }</code>.', vi: '<code>GET /api/tasks/:id</code> → 200 · id không phải số nguyên dương → 400 <code>{ "error": "Invalid id" }</code> · không có → 404 <code>{ "error": "Task not found" }</code>.' }] },
      { ten: { en: 'Create (guarded, validated)', vi: 'Tạo (có chặn, có kiểm)' }, diem: 2.5, yeuCau: [
        { en: '<code>POST /api/tasks</code> with the API key; title 3–80 characters → else 400 <code>{ "error": "title must be 3-80 characters" }</code>; priority (optional) integer 1–3 → else 400 <code>{ "error": "priority must be 1, 2 or 3" }</code>.', vi: '<code>POST /api/tasks</code> kèm API key; title 3–80 ký tự → không thì 400 <code>{ "error": "title must be 3-80 characters" }</code>; priority (tuỳ chọn) số nguyên 1–3 → không thì 400 <code>{ "error": "priority must be 1, 2 or 3" }</code>.' },
        { en: '201 + the task (<code>status: \'todo\'</code>, priority default 2). Fields other than title/priority are ignored.', vi: '201 + việc (<code>status: \'todo\'</code>, priority mặc định 2). Field khác title/priority bị bỏ qua.' }] },
      { ten: { en: 'Move a task forward', vi: 'Chuyển trạng thái tiến lên' }, diem: 2, yeuCau: [
        { en: '<code>PATCH /api/tasks/:id</code> with the API key and <code>{ "status": "…" }</code>: only the NEXT status is allowed (todo → doing → done) → else 409 <code>{ "error": "Cannot move from X to Y" }</code>; an unknown status → 400 <code>{ "error": "Invalid status" }</code>.', vi: '<code>PATCH /api/tasks/:id</code> kèm API key và <code>{ "status": "…" }</code>: chỉ trạng thái KẾ TIẾP được phép (todo → doing → done) → không thì 409 <code>{ "error": "Cannot move from X to Y" }</code>; trạng thái lạ → 400 <code>{ "error": "Invalid status" }</code>.' },
        { en: '200 + the updated task; 400 / 404 for the id as in feature 2.', vi: '200 + việc đã sửa; 400 / 404 cho id như chức năng 2.' }] },
      { ten: { en: 'Logger, 404 and errors', vi: 'Logger, 404 và lỗi' }, diem: 2, yeuCau: [
        { en: 'A logger prints one line per request when it finishes: <code>METHOD originalUrl STATUS</code> (e.g. <code>GET /api/tasks/9 404</code>).', vi: 'Logger in mỗi request một dòng khi xong: <code>METHOD originalUrl STATUS</code> (vd <code>GET /api/tasks/9 404</code>).' },
        { en: 'Unknown routes → 404 <code>{ "error": "Not found" }</code>; invalid JSON body → 400 <code>{ "error": "Invalid JSON" }</code>; repository failure → 500 <code>{ "error": "Internal Server Error" }</code> (never hangs).', vi: 'Route lạ → 404 <code>{ "error": "Not found" }</code>; thân JSON hỏng → 400 <code>{ "error": "Invalid JSON" }</code>; kho hỏng → 500 <code>{ "error": "Internal Server Error" }</code> (không bao giờ treo).' }] },
    ],
    truDiem: [{ en: 'A request that hangs (no answer) loses the feature it belongs to.', vi: 'Request bị treo (không trả lời) mất điểm chức năng chứa nó.' }, { en: 'Hard-coding the API key: −1.', vi: 'Viết cứng API key: −1.' }],
    nopBai: { en: 'Submit <code>answer.js</code> (keep the given part unchanged).', vi: 'Nộp <code>answer.js</code> (giữ nguyên phần cho sẵn).' },
  },
  dau: J`const express = require('express');
${REPO}

const app = express();
const router = express.Router();
router.get('/', async (req, res) => res.json(await tasksRepo.all()));
router.get('/:id', async (req, res) => res.json(await tasksRepo.get(req.params.id)));
router.post('/', async (req, res) => res.json(await tasksRepo.add(req.body)));
app.use('/api/tasks', router);
app.use(express.json());

module.exports = { app, tasksRepo };
`,
  giai: J`const express = require('express');
${REPO}

const STATUSES = ['todo', 'doing', 'done'];
const wrap = (fn) => (req, res, next) => Promise.resolve().then(() => fn(req, res, next)).catch(next);
const parseId = (s) => (/^[1-9]\d*$/.test(s) ? Number(s) : null);

// ── middleware ──
function logger(req, res, next) {
  res.on('finish', () => console.log(´@{req.method} @{req.originalUrl} @{res.statusCode}´));
  next();
}
function requireApiKey(req, res, next) {
  const key = req.get('x-api-key');
  if (!key) return res.status(401).json({ error: 'API key required' });
  if (key !== process.env.API_KEY) return res.status(401).json({ error: 'Invalid API key' });
  next();
}

// ── the tasks router ──
const router = express.Router();

router.get('/', wrap(async (req, res) => {
  let list = await tasksRepo.all();
  if (req.query.status !== undefined) {
    const wanted = String(req.query.status).split(',').map((s) => s.trim());
    if (!wanted.every((s) => STATUSES.includes(s))) return res.status(400).json({ error: 'Invalid status' });
    list = list.filter((t) => wanted.includes(t.status));
  }
  if (req.query.sort !== undefined) {
    if (req.query.sort !== 'priority' && req.query.sort !== '-priority') return res.status(400).json({ error: 'Invalid sort' });
    const dir = req.query.sort === '-priority' ? -1 : 1;
    list = [...list].sort((a, b) => dir * (a.priority - b.priority));
  }
  res.json(list);
}));

router.get('/:id', wrap(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'Invalid id' });
  const task = await tasksRepo.get(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  res.json(task);
}));

router.post('/', requireApiKey, wrap(async (req, res) => {
  const title = typeof req.body.title === 'string' ? req.body.title.trim() : '';
  if (title.length < 3 || title.length > 80) return res.status(400).json({ error: 'title must be 3-80 characters' });
  const priority = req.body.priority === undefined ? 2 : req.body.priority;
  if (![1, 2, 3].includes(priority)) return res.status(400).json({ error: 'priority must be 1, 2 or 3' });
  res.status(201).json(await tasksRepo.add({ title, status: 'todo', priority }));
}));

router.patch('/:id', requireApiKey, wrap(async (req, res) => {
  const id = parseId(req.params.id);
  if (id === null) return res.status(400).json({ error: 'Invalid id' });
  const next = req.body.status;
  if (!STATUSES.includes(next)) return res.status(400).json({ error: 'Invalid status' });
  const task = await tasksRepo.get(id);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  if (STATUSES.indexOf(next) !== STATUSES.indexOf(task.status) + 1) {
    return res.status(409).json({ error: ´Cannot move from @{task.status} to @{next}´ });
  }
  res.json(await tasksRepo.update(id, { status: next }));
}));

// ── app ──
const app = express();
app.use(logger);                                   // first: sees every request, even 404s and errors
app.use(express.json());
app.use('/api/tasks', router);
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON' });
  console.error(err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

module.exports = { app, tasksRepo };
`,
  chuanBi: `const { app, tasksRepo } = module.exports; const K = { 'x-api-key': 'lab2-key' };
const go = async (method, url, body, headers = {}) => { const r = await app.inject({ method, url, body, headers, timeoutMs: 3000 }); return { status: r.status, body: Array.isArray(r.body) ? r.body.map((t) => t.id + ':' + t.status + ':' + t.priority) : r.body }; };`,
  cases: [
    { goi: `[await go('GET', '/api/tasks'), await go('GET', '/api/tasks?status=todo,doing&sort=priority'), await go('GET', '/api/tasks?sort=-priority')]`, nhom: 'f1', moTa: ['List, filter by statuses, sort both ways', 'Danh sách, lọc theo trạng thái, sắp hai chiều'] },
    { goi: `[await go('GET', '/api/tasks?status=blocked'), await go('GET', '/api/tasks?sort=title')]`, nhom: 'f1', an: true },
    { goi: `[await go('GET', '/api/tasks/2'), await go('GET', '/api/tasks/9'), await go('GET', '/api/tasks/two')]`, nhom: 'f2', moTa: ['Read one: 200 / 404 / 400', 'Đọc một: 200 / 404 / 400'] },
    { goi: `[await go('POST', '/api/tasks', { title: 'x' }), await go('POST', '/api/tasks', { title: 'Deploy' }, { 'x-api-key': 'nope' })]`, nhom: 'f3', moTa: ['POST without / with a wrong key → 401', 'POST thiếu / sai key → 401'] },
    { goi: `[await go('POST', '/api/tasks', { title: '  Write tests ', status: 'done', id: 1 }, K), await go('POST', '/api/tasks', { title: 'Hi' }, K), await go('POST', '/api/tasks', { title: 'Deploy app', priority: 5 }, K)]`, nhom: 'f3', moTa: ['201 status todo priority 2; 400 title; 400 priority', '201 status todo priority 2; 400 title; 400 priority'] },
    { goi: `[await go('PATCH', '/api/tasks/3', { status: 'doing' }, K), await go('PATCH', '/api/tasks/3', { status: 'todo' }, K), await go('PATCH', '/api/tasks/1', { status: 'done' }, K)]`, nhom: 'f4', moTa: ['todo → doing OK; backwards / same → 409', 'todo → doing được; lùi / giữ nguyên → 409'] },
    { goi: `[await go('PATCH', '/api/tasks/2', { status: 'archived' }, K), await go('PATCH', '/api/tasks/9', { status: 'done' }, K), await go('PATCH', '/api/tasks/2', { status: 'done' }), await go('PATCH', '/api/tasks/2', { status: 'done' }, K)]`, nhom: 'f4', an: true },
    { goi: `(await go('GET', '/api/tasks/9'), await go('GET', '/api/nope'), __log)`, nhom: 'f5', moTa: ['The logger prints METHOD URL STATUS; JSON 404', 'Logger in METHOD URL STATUS; 404 JSON'] },
    { goi: `[await go('POST', '/api/tasks', '{"title": oops', { ...K, 'content-type': 'application/json' }), (tasksRepo.failNext = true, await go('GET', '/api/tasks')), (tasksRepo.failNext = true, await go('GET', '/api/tasks/1'))]`, nhom: 'f5', moTa: ['Invalid JSON → 400; database errors → 500, never a hang', 'JSON hỏng → 400; lỗi CSDL → 500, không bao giờ treo'] },
  ],
  kiemThem: [{ kiem: 'ma-nguon', moTa: { en: 'The API key is read from process.env', vi: 'API key đọc từ process.env' }, khop: 'process\\.env\\.API_KEY', tep: 'answer.js', nhom: 'f3' }],
});

export default doiDau({
  slug: 'sdn302-2-lab-express-tasks-api',
  ten: 'Lab 2 — Tasks API with Express',
  khoa: KHOA,
  baiHoc: 'sdn302-2-2-middleware',
  de: [L1, L2],
});
