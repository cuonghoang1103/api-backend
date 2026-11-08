/** SDN302 · Project — checklist ứng dụng server-side: 6 mốc (mô hình dữ liệu, REST MVC, populate, xác thực, validation & lỗi, deploy + demo), thứ tự demo khi thuyết trình, và một kịch bản demo tự chạy. */
import { doiDau, KHOA, bai, cs, q, qn, ord, tn } from './_sdn.mjs';

const J = String.raw;

const E1 = cs({
  ten: 'The project gate: what the graders look for', kho: 'EASY', phut: 6,
  en: 'The six items of the checklist and the CLOs behind them.',
  vi: 'Sáu mục của checklist và các CLO phía sau.',
  cau: [
    q('p1', ['A project does full CRUD on ONE collection, with no login and no populate. What happens to its grade?', 'Một project làm CRUD đầy đủ trên MỘT collection, không đăng nhập, không populate. Điểm của nó ra sao?'],
      ['Capped: it cannot show CLO5 (population) or CLO6 (authentication)', 'Full marks, because the CRUD on that collection is complete', 'Zero, because a project needs at least three source files', 'It only loses the presentation marks, nothing else'],
      ['"A project that only does CRUD on one collection with no auth and no population will cap your grade."', '"Project chỉ làm CRUD trên một collection, không xác thực, không populate sẽ bị chặn trần điểm."']),
    qn('p2', ['Which belong to checklist item 5 "Validation & errors"? (choose all)', 'Cái nào thuộc mục 5 "Validation & errors"? (chọn hết)'],
      ['400 on bad input', 'A central error handler', 'No crashes on malformed requests', 'A Postman collection', 'bcrypt register'],
      [0, 1, 2], ['The Postman collection is item 6 (deploy + demo); bcrypt is item 4 (authentication).', 'Postman collection là mục 6 (deploy + demo); bcrypt là mục 4 (xác thực).']),
    q('p3', ['Item 1 asks for "3–5 Mongoose schemas · at least one reference relationship · validation rules". Why the reference?', 'Mục 1 đòi "3–5 schema Mongoose · ít nhất một quan hệ tham chiếu · luật kiểm tra". Vì sao cần tham chiếu?'],
      ['Without a reference there is nothing to <code>.populate()</code> in item 3', 'MongoDB refuses collections without references', 'Express needs references to build routes', 'References make the database faster in every case'],
      ['Items build on each other: the data model enables populate, populate demonstrates CLO5.', 'Các mục dựa vào nhau: mô hình dữ liệu cho phép populate, populate thể hiện CLO5.']),
  ],
  goiY: [['Which CLOs are the heaviest?', 'CLO nào nặng ký nhất?'], ['Group by item number.', 'Gom theo số mục.']],
  loi: [['Thinking CRUD alone is enough.', 'Tưởng chỉ CRUD là đủ.'], ['Mixing demo items with validation items.', 'Lẫn mục demo với mục validation.']],
  tns: [tn('milestone', 'mốc'), tn('grade cap', 'trần điểm')],
  kn: ['project'],
});

const E2 = cs({
  ten: 'The presentation: demo order', kho: 'EASY', phut: 4, loai: 'order',
  en: 'The presentation tip of the lesson: the happy path first, then one error case.',
  vi: 'Mẹo thuyết trình của bài: đường thuận trước, rồi một ca lỗi.',
  cau: [ord('o1', ['Order the demo of your project in Postman.', 'Sắp thứ tự demo project trong Postman.'],
    ['Register a user', 'Log in and copy the token', 'Create a resource with the token', 'List the resources — show the populated author', 'Send invalid input — show the 400'],
    ['Each step needs the previous one (no token before login, nothing to list before create). Ending with a deliberate error shows that you handle failure, not only success.', 'Mỗi bước cần bước trước (chưa đăng nhập thì chưa có token, chưa tạo thì chưa có gì để liệt kê). Kết thúc bằng một lỗi có chủ ý cho thấy bạn xử lý thất bại, không chỉ thành công.'])],
  goiY: [['Follow the data.', 'Đi theo dữ liệu.'], ['Error case last.', 'Ca lỗi sau cùng.']],
  loi: [['Starting with the error case.', 'Mở đầu bằng ca lỗi.'], ['Listing before creating.', 'Liệt kê trước khi tạo.']],
  tns: [tn('happy path', 'đường thuận')],
  kn: ['presentation'],
});

const E3 = bai({
  ten: 'checkProject(spec): which checklist items are still open?', kho: 'MEDIUM', phut: 15, lib: [],
  en: J`<p>Describe a project as</p>
<pre>{ schemas: [{ name, refs: [...], rules: n }], layers: ['routes', 'controllers', 'services', 'models'],
  crud: true, statusCodes: true, populate: 1, auth: { hashing: 'bcrypt', token: 'jwt' | 'session' | null, protectedRoute: true },
  errors: { badInput400: true, centralHandler: true }, deploy: { url: 'https://…', postman: true, page: true } }</pre>
<p>Write <code>checkProject(p)</code> → the list of open items (strings), in checklist order:</p>
<ol><li><code>"data model"</code> — 3–5 schemas, at least one schema with a ref, at least one schema with <code>rules &gt; 0</code>;</li>
<li><code>"REST API in MVC"</code> — <code>layers</code> contains all four of routes, controllers, services, models, AND <code>crud</code> and <code>statusCodes</code> are true;</li>
<li><code>"population"</code> — <code>populate ≥ 1</code>;</li>
<li><code>"authentication"</code> — hashing is <code>'bcrypt'</code>, token is <code>'jwt'</code> or <code>'session'</code>, and a protected route exists;</li>
<li><code>"validation & errors"</code> — both error flags true;</li>
<li><code>"deploy + demo"</code> — a URL starting with <code>https://</code>, a Postman collection, and a page.</li></ol>`,
  vi: J`<p>Mô tả một project là</p>
<pre>{ schemas: [{ name, refs: [...], rules: n }], layers: ['routes', 'controllers', 'services', 'models'],
  crud: true, statusCodes: true, populate: 1, auth: { hashing: 'bcrypt', token: 'jwt' | 'session' | null, protectedRoute: true },
  errors: { badInput400: true, centralHandler: true }, deploy: { url: 'https://…', postman: true, page: true } }</pre>
<p>Viết <code>checkProject(p)</code> → danh sách mục còn mở (chuỗi), theo thứ tự checklist:</p>
<ol><li><code>"data model"</code> — 3–5 schema, ít nhất một schema có ref, ít nhất một schema có <code>rules &gt; 0</code>;</li>
<li><code>"REST API in MVC"</code> — <code>layers</code> có đủ bốn routes, controllers, services, models, VÀ <code>crud</code> và <code>statusCodes</code> đều true;</li>
<li><code>"population"</code> — <code>populate ≥ 1</code>;</li>
<li><code>"authentication"</code> — hashing là <code>'bcrypt'</code>, token là <code>'jwt'</code> hoặc <code>'session'</code>, và có route được bảo vệ;</li>
<li><code>"validation & errors"</code> — cả hai cờ lỗi đều true;</li>
<li><code>"deploy + demo"</code> — URL bắt đầu bằng <code>https://</code>, có Postman collection, và có trang.</li></ol>`,
  yc: [['Every nested object may be missing — guard with <code>|| {}</code> / <code>|| []</code>.', 'Mọi đối tượng lồng đều có thể thiếu — phòng bằng <code>|| {}</code> / <code>|| []</code>.'], ['Return <code>[]</code> for a project ready to present.', 'Trả <code>[]</code> cho project sẵn sàng thuyết trình.']],
  viDu: [['a complete project', '[]', 'Ready.', 'Sẵn sàng.'], ['the same with token: null and no deploy URL', '["authentication","deploy + demo"]', 'Two open items.', 'Hai mục còn mở.']],
  goiY: [['Write the six checks as an array of <code>[name, ok]</code> pairs, then filter.', 'Viết sáu phép kiểm thành mảng các cặp <code>[name, ok]</code>, rồi lọc.'], ['<code>[\'routes\', \'controllers\', \'services\', \'models\'].every((l) => layers.includes(l))</code>', '<code>[\'routes\', \'controllers\', \'services\', \'models\'].every((l) => layers.includes(l))</code>']],
  loi: [['Accepting <code>http://</code> for the deployed URL — the JWT would travel in clear text.', 'Chấp nhận <code>http://</code> cho URL đã deploy — JWT sẽ đi dạng chữ rõ.'], ['Crashing on a project without <code>auth</code> instead of reporting it open.', 'Sập với project không có <code>auth</code> thay vì báo mục đó còn mở.']],
  gt: ['The checklist is six independent predicates over a project description; evaluating them all (not stopping at the first) gives a to-do list, and the order mirrors the order in which the items depend on each other.', 'Checklist là sáu mệnh đề độc lập trên mô tả project; đánh giá hết (không dừng ở cái đầu) cho ra danh sách việc cần làm, và thứ tự phản ánh thứ tự các mục phụ thuộc nhau.'],
  kn: ['predicates'],
  tns: [tn('checklist', 'danh sách kiểm')],
  dau: J`function checkProject(p) {
  const open = [];
  if (p.schemas.length < 3) open.push('data model');
  if (!p.populate) open.push('population');
  return open;
}
`,
  giai: J`function checkProject(p) {
  const schemas = p.schemas || [];
  const layers = p.layers || [];
  const auth = p.auth || {};
  const errors = p.errors || {};
  const deploy = p.deploy || {};
  const items = [
    ['data model', schemas.length >= 3 && schemas.length <= 5
      && schemas.some((s) => (s.refs || []).length > 0) && schemas.some((s) => (s.rules || 0) > 0)],
    ['REST API in MVC', ['routes', 'controllers', 'services', 'models'].every((l) => layers.includes(l))
      && p.crud === true && p.statusCodes === true],
    ['population', (p.populate || 0) >= 1],
    ['authentication', auth.hashing === 'bcrypt' && (auth.token === 'jwt' || auth.token === 'session') && auth.protectedRoute === true],
    ['validation & errors', errors.badInput400 === true && errors.centralHandler === true],
    ['deploy + demo', typeof deploy.url === 'string' && deploy.url.startsWith('https://') && deploy.postman === true && deploy.page === true],
  ];
  return items.filter(([, ok]) => !ok).map(([name]) => name);   // in checklist order
}
`,
  chuanBi: `const full = { schemas: [{ name: 'User', refs: [], rules: 2 }, { name: 'Post', refs: ['User'], rules: 1 }, { name: 'Comment', refs: ['User', 'Post'], rules: 1 }], layers: ['routes', 'controllers', 'services', 'models'], crud: true, statusCodes: true, populate: 2, auth: { hashing: 'bcrypt', token: 'jwt', protectedRoute: true }, errors: { badInput400: true, centralHandler: true }, deploy: { url: 'https://blog-api.onrender.com', postman: true, page: true } };`,
  cases: [
    { goi: `checkProject(full)`, moTa: ['A complete project → []', 'Project đủ → []'] },
    { goi: `checkProject({ ...full, auth: { ...full.auth, token: null }, deploy: { postman: true, page: true } })`, moTa: ['No token, no URL → two open items', 'Không token, không URL → hai mục mở'] },
    { goi: `checkProject({ ...full, layers: ['routes', 'models'], populate: 0, deploy: { ...full.deploy, url: 'http://blog.example' } })`, an: true },
    { goi: `checkProject({})`, an: true },
    { goi: `checkProject({ ...full, schemas: full.schemas.map((s) => ({ ...s, rules: 0 })), errors: { badInput400: true } })`, an: true },
  ],
});

// the given app of exercise 4 (same text in starter and solution)
const APP = J`// ───── GIVEN: the project API (do not change) ─────
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = mongoose.model('User', new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true }, password: { type: String, select: false } }));
const Post = mongoose.model('Post', new mongoose.Schema({ title: { type: String, required: true }, author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }, { timestamps: true }));
const SECRET = 'demo-secret';

function buildApp({ populate = true, validate = true } = {}) {
  const app = express();
  app.use(express.json());
  app.post('/api/auth/register', async (req, res) => {
    const { name, email, password } = req.body;
    const u = await User.create({ name, email, password: await bcrypt.hash(password, 10) });
    res.status(201).json({ id: u.id, name: u.name });
  });
  app.post('/api/auth/login', async (req, res) => {
    const u = await User.findOne({ email: req.body.email }).select('+password');
    if (!u || !(await bcrypt.compare(req.body.password, u.password))) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ token: jwt.sign({ id: u.id }, SECRET, { expiresIn: '1h' }) });
  });
  const auth = (req, res, next) => {
    const [s, t] = (req.get('authorization') || '').split(' ');
    try { if (s !== 'Bearer') throw new Error(); req.user = jwt.verify(t, SECRET); next(); } catch { res.status(401).json({ error: 'Unauthorized' }); }
  };
  app.post('/api/posts', auth, async (req, res) => {
    if (validate && !req.body.title) return res.status(400).json({ error: 'title is required' });
    res.status(201).json(await Post.create({ title: req.body.title || 'untitled', author: req.user.id }));
  });
  app.get('/api/posts', async (req, res) => {
    const q = Post.find().sort({ createdAt: -1 });
    res.json(await (populate ? q.populate('author', 'name') : q));
  });
  return app;
}
// ───── end of the given part ─────`;

const E4 = bai({
  ten: 'Automate the demo: runDemo(app) plays your Postman collection', kho: 'HARD', phut: 25, lib: ['mongoose', 'express', 'auth'], timeoutMs: 120000,
  en: J`<p>Before presenting, run the whole demo in one go. The project API is given (<code>buildApp()</code>). Write <code>async function runDemo(app)</code> that plays the five steps of the presentation against <code>app</code> with <code>app.inject(…)</code> and returns one line per step:</p>
<pre>[ { step: 'register', status, ok },     // POST /api/auth/register { name: 'Demo', email: 'demo@x.com', password: 'secret123' } — ok if 201
  { step: 'login',    status, ok },     // POST /api/auth/login — ok if 200 AND a token came back
  { step: 'create',   status, ok },     // POST /api/posts { title: 'Hello SDN302' } with the token — ok if 201
  { step: 'list',     status, ok },     // GET /api/posts — ok if 200 AND the first post has author.name === 'Demo' (populated)
  { step: 'error case', status, ok } ]  // POST /api/posts {} with the token — ok if 400</pre>
<p>A step that cannot run because an earlier one failed (no token) still appears, with <code>status: null, ok: false</code>.</p>`,
  vi: J`<p>Trước khi thuyết trình, chạy cả buổi demo một lèo. API của project cho sẵn (<code>buildApp()</code>). Viết <code>async function runDemo(app)</code> chơi năm bước của buổi thuyết trình trên <code>app</code> bằng <code>app.inject(…)</code> và trả mỗi bước một dòng:</p>
<pre>[ { step: 'register', status, ok },     // POST /api/auth/register { name: 'Demo', email: 'demo@x.com', password: 'secret123' } — ok nếu 201
  { step: 'login',    status, ok },     // POST /api/auth/login — ok nếu 200 VÀ có token trả về
  { step: 'create',   status, ok },     // POST /api/posts { title: 'Hello SDN302' } kèm token — ok nếu 201
  { step: 'list',     status, ok },     // GET /api/posts — ok nếu 200 VÀ bài đầu có author.name === 'Demo' (đã populate)
  { step: 'error case', status, ok } ]  // POST /api/posts {} kèm token — ok nếu 400</pre>
<p>Bước không chạy được vì bước trước hỏng (không có token) vẫn có mặt, với <code>status: null, ok: false</code>.</p>`,
  yc: [['Send the token as <code>Authorization: Bearer &lt;token&gt;</code>.', 'Gửi token dạng <code>Authorization: Bearer &lt;token&gt;</code>.'], ['Do not change the given part; write only <code>runDemo</code> below it.', 'Không sửa phần cho sẵn; chỉ viết <code>runDemo</code> bên dưới.']],
  viDu: [['await runDemo(buildApp())', '[{"step":"register","status":201,"ok":true},…,{"step":"error case","status":400,"ok":true}]', 'Everything green: ready to present.', 'Mọi thứ xanh: sẵn sàng thuyết trình.'], ['await runDemo(buildApp({ populate: false }))', '…{"step":"list","status":200,"ok":false}…', 'The list answers 200 but the author is only an id — the demo catches it.', 'Danh sách trả 200 nhưng author chỉ là id — kịch bản demo bắt được.']],
  goiY: [['<code>const r = await app.inject({ method: \'POST\', url: \'/api/auth/login\', body: { email, password } }); const token = r.body && r.body.token;</code>', '<code>const r = await app.inject({ method: \'POST\', url: \'/api/auth/login\', body: { email, password } }); const token = r.body && r.body.token;</code>'], ['A helper <code>const line = (step, r, ok) => ({ step, status: r ? r.status : null, ok: !!ok });</code> keeps the shape identical.', 'Một hàm <code>const line = (step, r, ok) => ({ step, status: r ? r.status : null, ok: !!ok });</code> giữ hình dạng giống hệt.']],
  loi: [['Checking only the status of "list": a 200 without populate is exactly the CLO5 failure graders punish.', 'Chỉ kiểm mã của bước "list": 200 mà không populate chính là lỗi CLO5 mà giám khảo trừ điểm.'], ['Throwing when login fails, so the report never comes back.', 'Ném lỗi khi đăng nhập hỏng, khiến báo cáo không bao giờ về.']],
  gt: ['A demo script is a tiny end-to-end test: it uses the API exactly like Postman would, carries the token from one step to the next, and checks the things a judge looks at — status codes AND the populated author. Running it before every presentation (and after every deploy) is the "test as you build" habit of lesson 7.1.', 'Kịch bản demo là một bài kiểm thử đầu-cuối nhỏ: nó dùng API y như Postman, mang token từ bước này sang bước sau, và kiểm đúng những thứ giám khảo nhìn — mã trạng thái VÀ tác giả đã populate. Chạy nó trước mỗi buổi thuyết trình (và sau mỗi lần deploy) là thói quen "kiểm khi xây" của bài 7.1.'],
  kn: ['end-to-end test', 'demo'],
  tns: [tn('end-to-end', 'đầu-cuối'), tn('smoke test', 'kiểm thử khói', 'kiểm nhanh những đường chính')],
  dau: J`${APP}

async function runDemo(app) {
  const r = await app.inject({ method: 'POST', url: '/api/auth/register', body: { name: 'Demo', email: 'demo@x.com', password: 'secret123' } });
  return [{ step: 'register', status: r.status, ok: true }];
}
`,
  giai: J`${APP}

async function runDemo(app) {
  const line = (step, r, ok) => ({ step, status: r ? r.status : null, ok: !!ok });
  const out = [];
  const email = 'demo@x.com';
  const password = 'secret123';

  const reg = await app.inject({ method: 'POST', url: '/api/auth/register', body: { name: 'Demo', email, password } });
  out.push(line('register', reg, reg.status === 201));

  const login = await app.inject({ method: 'POST', url: '/api/auth/login', body: { email, password } });
  const token = login.status === 200 && login.body && login.body.token;
  out.push(line('login', login, !!token));

  const auth = token ? { Authorization: 'Bearer ' + token } : null;
  // without a token the next steps cannot run: report them, do not throw
  const create = auth ? await app.inject({ method: 'POST', url: '/api/posts', headers: auth, body: { title: 'Hello SDN302' } }) : null;
  out.push(line('create', create, create && create.status === 201));

  const list = await app.inject({ url: '/api/posts' });
  const first = Array.isArray(list.body) ? list.body[0] : null;
  out.push(line('list', list, list.status === 200 && first && first.author && first.author.name === 'Demo'));   // populated?

  const bad = auth ? await app.inject({ method: 'POST', url: '/api/posts', headers: auth, body: {} }) : null;
  out.push(line('error case', bad, bad && bad.status === 400));
  return out;
}
`,
  cases: [
    { goi: `await runDemo(buildApp())`, moTa: ['The real project: all five steps ok', 'Project thật: cả năm bước ok'] },
    { goi: `(await runDemo(buildApp({ populate: false })))[3]`, moTa: ['Without populate, the list step is NOT ok', 'Không populate thì bước list KHÔNG ok'] },
    { goi: `(await runDemo(buildApp({ validate: false })))[4]`, an: true },
    { goi: `(await User.create({ name: 'Taken', email: 'demo@x.com', password: await require('bcrypt').hash('other-pass', 10) }), await runDemo(buildApp()))`, an: true, moTa: ['Login fails ⇒ later steps reported with status null', 'Đăng nhập hỏng ⇒ các bước sau báo status null'] },
  ],
});

export default doiDau({
  slug: 'sdn302-project-checklist',
  ten: 'Project — the server-side app checklist',
  khoa: KHOA,
  baiHoc: 'sdn302-project-checklist',
  de: [E1, E2, E3, E4],
});
