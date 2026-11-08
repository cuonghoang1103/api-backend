/**
 * sdn-06-2 — SDN302 · Chương 6 · Mốc "Project — the server-side app checklist" (slide EN, đợt 12b — 08/11/2026). MỘT deck, MỘT tập sdn-6-2.
 *   Sáu cổng ↔ CLO · dự án mẫu Book Club API (User / Book / Review, MVC 12 tệp) · từng cổng có mã + output THẬT · checklist thành CHƯƠNG TRÌNH
 *   (check.js) chạy trên dự án "chạy được" 0/6 và dự án đủ 6/6 · kịch bản demo bảo vệ (đường vui → các ca lỗi) chạy thật · câu giám khảo hỏi.
 * Nguồn: SDN302 › sdn302-project-checklist. Output THẬT: that/s6p/{check,demo} (Node 22.23.3, Express 5.3.0, Mongoose 9.11.4, bcrypt 6.0.0,
 *   jsonwebtoken 9.0.3, MongoDB 7.0.37 container sdn-mongo).
 */
import { lamDeck, two, box, cards, flow, bang, ma, ra, steps } from './_sdn-chung.mjs';
import { J, T, JW, tep, gay } from './_c7-chung.mjs';

export const deck = { key: 'sdn-06-2', code: 'SDN302 6.2', title: 'Project — the server-side app checklist', sub: 'SDN302 — Node.js, Express & MongoDB' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
const CK = (a, b) => ra('s6p/check', a, b);
/** demo.out: cặp (lệnh, kết quả) thứ i (0-based) — lệnh curl thật được thay bằng nhãn ngắn, kết quả giữ nguyên. */
const DM = ra('s6p/demo').split('\n');
const D = (pairs, n = 98) => gay(pairs.map(([i, nhan]) => `$ ${nhan}\n${DM[2 * i + 1]}`).join('\n'), n);
/** khung terminal cho D(): tô mọi dòng KẾT QUẢ (sau khi gói dòng). */
const TD = (pairs, title, o = {}) => { const t = D(pairs); return T(t, title, { ...o, hl: t.split('\n').map((l, i) => (l.startsWith('$ ') ? 0 : i + 1)).filter(Boolean) }); };

export const slides = lamDeck({ chuong: 'Chapter 6 — Integrating React & deployment', bai: 'Project' }, [
  { cover: true, t: 'Project — the server-side<br>app checklist', sub: 'Six gates to pass before you submit and defend — each one checked by a program, on a real project.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The six gates an examiner looks for, and the learning outcome (CLO) behind each</li>
<li>A complete sample project — Book Club API — that passes all six</li>
<li>The checklist turned into a program: a project that "works" scores 0/6, the full one 6/6</li>
<li>A defence demo script: the happy path first, then the failures, every response real</li>
<li>The questions examiners ask, and the traps that cap your grade</li>
</ul>` + box('Use it as a gate', 'Run through this list before you submit and before you present. Every "no" is marks you can still win back.', 'lam') },

  { t: 'Six gates, six outcomes', to: true, giua: true, body: bang(['gate', 'the examiner wants to see', 'CLO'], [
    ['1 · Data model', '3–5 Mongoose schemas · at least one reference · validation rules', 'CLO4'],
    ['2 · REST API in MVC', 'routes → controllers → services → models · full CRUD · correct status codes', 'CLO5'],
    ['3 · Population', 'at least one .populate() that shows a relation', 'CLO5'],
    ['4 · Authentication', 'register / login with bcrypt · JWT or session · a protected route', 'CLO6'],
    ['5 · Validation & errors', '400 on bad input · one central error handler · never crash', 'CLO5'],
    ['6 · Deploy + demo', 'runs publicly · a Postman collection · a small React page or docs', 'CLO7'],
  ], { co: 21 }) + box('Why these six', 'Gates 3 and 4 prove CLO5 and CLO6, the two heaviest technical outcomes. A project without them cannot show them, whatever else it does.', 'cam') },

  { t: 'The sample project: Book Club API', to: true, giua: true, body: two(T(`book-club-api/
├── app.js                 express + routes + error handler
├── package.json           "start": "node app.js"
├── models/      User.js · Book.js · Review.js
├── services/    authService.js · bookService.js
├── controllers/ authController.js · bookController.js
├── routes/      authRoutes.js · bookRoutes.js
└── middleware/  auth.js (requireAuth) · error.js`, 'the 12 files'),
    bang(['method', 'route', 'auth'], [['POST', '/api/auth/register', '—'], ['POST', '/api/auth/login', '—'], ['GET', '/api/books', '—'], ['GET', '/api/books/:id', '—'], ['POST', '/api/books', '✓'], ['GET', '/api/books/:id/reviews', '—'], ['POST', '/api/books/:id/reviews', '✓']], { co: 20 })) +
    box('Three collections, two relations', 'A Book is created by a User; a Review belongs to a Book and to a User. Small enough to build in a week, big enough to pass every gate.', 'lam') },

  { t: 'Gate 1 — the data model', to: true, giua: true, body: J(ma('s6p/full/models/Review'), { sm: false, hl: [3, 4, 5, 8] }) +
    two(box('References', 'ref: \'Book\' and ref: \'User\' store an ObjectId — the relation that gate 3 will populate.', 'lam'),
      box('Rules in the schema', 'required, min / max, maxlength, and a unique compound index: one review per user per book — enforced by MongoDB itself.', 'xanh')) },

  { t: 'Gate 2 — REST in MVC', to: true, giua: true, body: flow([
    { t: 'routes', s: 'URL + method → handler', mau: LAM }, { t: 'controllers', s: 'read req, send res', mau: CAM }, { t: 'services', s: 'the rules', mau: NODE }, { t: 'models', s: 'Mongoose', mau: TIM },
  ]) + J(ma('s6p/full/routes/bookRoutes', 2, 8), { hl: [5, 7] }) + J(ma('s6p/full/controllers/bookController', 2, 6), { hl: [3] }) },

  { t: 'Gate 3 — population, for real', to: true, giua: true, body: J(ma('s6p/full/services/bookService', 12, 15), { sm: false, hl: [3] }) +
    TD([[4, 'curl :4620/api/books/$BOOK/reviews'], [5, 'curl :4620/api/books   (title + createdBy only)']], 'the running project · real') +
    box('populate(\'user\', \'name\')', 'The stored ObjectId is replaced by the user document — and only its name. Never populate the password; select only what the client needs.', 'xanh') },

  { t: 'Gate 4 — authentication', to: true, giua: true, body: JW(ma('s6p/full/services/authService', 6, 15), 100, [3, 9, 10]) +
    TD([[0, 'curl -X POST :4620/api/auth/register -d {name, email, password}'], [1, 'curl -X POST :4620/api/auth/login …   (first 36 characters)'], [7, 'curl -X POST :4620/api/books   (no token)']], 'real') },

  { t: 'Gate 5 — validation and one error handler', to: true, giua: true, body: JW(ma('s6p/full/middleware/error', 3, 10), 108, [2, 3, 4, 5]) +
    TD([[6, 'curl -X POST :4620/api/books -d {"title":"","year":1200}'], [8, 'curl -X POST :4620/api/books/$BOOK/reviews   (a second review)'], [9, 'curl :4620/api/books/665f00000000000000000000']], 'real') },

  { t: 'Gate 6 — deploy-ready, and a demo', to: true, giua: true, body: bang(['you hand in', 'why'], [
    ['"start": "node app.js", PORT and MONGODB_URI from process.env', 'the host and the examiner can run it (lesson 6.1)'],
    ['a public URL that answers', 'the examiner tries it, not your laptop'],
    ['a Postman collection, one request per route, saved with examples', 'every route demonstrable in one click'],
    ['README: install, the env variables, how to seed', 'someone else can start it in five minutes'],
    ['a small React page, or API docs', 'shows a client really uses the API'],
  ], { co: 21 }) + box('A demo is evidence', 'The examiner believes what runs in front of them. Prepare the data, the requests and the order before the defence (slide 13).', 'cam') },

  { t: 'The checklist as a program', to: true, giua: true, body: J(tep('s6p/check.cjs', 26, 30) + '\n' + [31, 33, 34, 35].map((n) => tep('s6p/check.cjs', n, n).replace(/, `[\s\S]*$/, ', …],')).join('\n') + '\n  ];   // (evidence strings cut)', { hl: [1, 2, 3, 4, 9, 10] }) +
    two(box('Read the code', 'Count mongoose.model, ref, required, .populate, bcrypt.hash, jwt.verify; check the four MVC folders and the start script.', 'lam'),
      box('Call the running server', 'POST without a token must be 401; POST {} must be 400; a bad id must be 400, not 500; and the server must still answer afterwards.', 'xanh')) },

  { t: 'A project that "works": 0/6', to: true, giua: true, body: J(ma('s6p/weak/app', 8, 13), { hl: [3, 4] }) +
    T(CK(2, 9), 'node check.js weak /api/items · real', { hl: [6, 9] }) +
    box('It runs, it demos — and it scores almost nothing', 'One collection, no relation, no auth. A bad id returns 500. POST {} is saved as an empty document: 200.', 'do2') },

  { t: 'The sample project: 6/6', to: true, giua: true, body: T(CK(11, 18), 'node check.js full /api/books · real', { sm: false, hl: [9] }) +
    two(box('Same machine, same database', 'The only difference is the code: 12 files instead of 1, and every gate visible in it.', 'xanh'),
      box('Run it on your own project', 'Point the checker at your folder and your resource path. A ✗ tells you which gate is missing and why.', 'lam')) },

  { t: 'The defence demo: happy path first', to: true, giua: true, body: TD([
    [0, 'POST /api/auth/register'], [1, 'POST /api/auth/login → token'], [2, 'POST /api/books   (with the token)'], [3, 'POST /api/books/$BOOK/reviews'], [4, 'GET  /api/books/$BOOK/reviews   (populated)'],
  ], 'the running project, in demo order · real') +
    box('register → login → create → list with populate', 'Four requests prove CLO6 and CLO5 in under a minute. Prepare them in Postman, in this order, before you walk in.', 'xanh') },

  { t: 'Then show a failure — on purpose', to: true, giua: true, body: TD([
    [6, 'POST /api/books   {"title":"","year":1200}'], [7, 'POST /api/books   (no token)'], [8, 'POST the same review again'], [9, 'GET  /api/books/<an id that does not exist>'], [10, 'POST /api/auth/login   (wrong password)'],
  ], 'real') +
    box('Examiners want to see you handle failure', '400, 401, 409, 404, 401 — five clean JSON answers, and the server is still running. That is gate 5, live.', 'cam') },

  { t: 'Questions examiners ask', to: true, giua: true, body: bang(['question', 'a short, honest answer'], [
    ['Why bcrypt and not SHA-256?', 'bcrypt is slow on purpose and salted; SHA-256 is built to be fast'],
    ['Where does the JWT secret live?', 'in the environment (.env locally, the host dashboard in production), never in Git'],
    ['Why .populate() and not two queries in the controller?', 'one call, the relation stays in the model, and select() limits the fields'],
    ['What happens with an invalid id?', 'CastError → our error handler → 400, never a crash'],
    ['Why services and not everything in the route?', 'the rules can be tested and reused without HTTP'],
    ['What would you add next?', 'pagination, rate limiting, tests — and say why'],
  ], { co: 20 }) + box('Know your own code', 'Be ready to open any file and explain one line. "The AI wrote it" loses more marks than a missing feature.', 'do2') },

  { t: 'Traps that cap the grade', to: true, giua: true, body: cards([
    ['One collection, CRUD only', 'No relation ⇒ no population ⇒ CLO5 cannot be shown.'],
    ['No auth, or auth on nothing', 'A login route that protects no route proves nothing about CLO6.'],
    ['500 on bad input', 'Every unhandled error in the demo is a visible failure of gate 5.'],
    ['Works only on your laptop', 'A hard-coded URI or port fails the moment someone else runs it.'],
    ['Untested until the defence', 'Run the checker and the demo script the day before, not on stage.'],
    ['Password hash in the response', 'select: false on the field; never populate it.'],
  ], 3) + box('The cheapest fix of all', 'Run node check.js on your own folder a week before the deadline. Each ✗ names the gate and the evidence that is missing.', 'xanh') },

  { t: 'Exercise', to: true, giua: true, body: J("// your project, today\napp.post('/api/orders', async (req, res) => res.json(await Order.create(req.body)));\napp.get('/api/orders/:id', async (req, res) => res.json(await Order.findById(req.params.id)));", { sm: false, hl: [2, 3] }) +
    box('Exercise', 'Run the six gates on these two routes in your head. Which gates fail, and what is the smallest change for each?', '') +
    `<div data-k="dapan">${box('Answer', 'Gate 2: move the logic into a service + controller + router. Gate 4: requireAuth on POST. Gate 5: required fields in the Order schema + an error handler, so {} gives 400 and a bad id gives 400; findById null ⇒ 404. Gate 3: Order needs a ref (user, products) and the GET should populate it. And POST should answer 201, not 200.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>Which two gates prove CLO5 and CLO6?</li>
<li>The weak project answered POST {} with 200. Why is that a failure?</li>
<li>What does populate('user', 'name') return instead of the ObjectId?</li>
<li>In the demo, what comes first: the happy path or a failure?</li>
<li>A second review on the same book: which status, and which line produced it?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Gate 3 (population) and gate 4 (authentication). &nbsp;2. An empty document was saved — there are no validation rules. &nbsp;3. The user document with only _id and name. &nbsp;4. The happy path, then one failure on purpose. &nbsp;5. 409 — the unique index on { book, user } raised code 11000, and the error handler mapped it.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Six gates: data model, REST in MVC, population, auth, validation & errors, deploy + demo</li>
<li>Gates 3 and 4 carry CLO5 and CLO6 — a CRUD-only project cannot show them</li>
<li>Check the gates with a program, not by memory: 0/6 vs 6/6 on the same machine</li>
<li>Defend with a script: register → login → create → populated list, then 400 / 401 / 409 / 404</li>
<li>Know every line of your own code</li>
</ul>` + box('Going deeper', 'SDN302 4.1 (MVC, error shape), 3.2 (populate), 5.1–5.2 (bcrypt, JWT); Node.js course 14.3 (supertest: the same checks as real tests).', 'lam') },
]);
