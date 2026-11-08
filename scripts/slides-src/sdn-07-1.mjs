/**
 * sdn-07-1 — SDN302 · Chương 7 · Bài 7.1 "Exam formats, starter snippet & CLO question bank" (slide EN, đợt 12b — 08/11/2026). MỘT deck, MỘT tập sdn-7-1.
 * BÀI HỌC ôn thi, KHÔNG chữa đề (luật 31/10). Cấu trúc điểm + cổng · 17 đề PE + 7 đề FE trên Phòng thi của web, ĐẾM bằng chương trình (không chép
 *   đề, không giải đề) · hai họ đề PE · luật 0 điểm (.env, cổng 9999) · lịch 85 phút · snippet của bài chạy thật · bẫy body form ⇒ 500 · bộ khung "sẵn
 *   sàng thi" (env, connect rồi listen, error handler ánh xạ lỗi Mongoose) chạy thật 9 request · bẫy PUT không runValidators (lưu -5, null 200) ·
 *   bẫy gõ sai tên biến env (crash) · test sau mỗi route (middleware log) · ngân hàng câu theo CLO.
 * Nguồn: SDN302 › sdn302-7-1-exam-question-bank (+ 0.2 cấu trúc điểm). Output THẬT: that/s7/{pe-format,starter,ready,put-trap,env-trap,logger}
 *   (Node 22.23.3, Express 5.3.0, Mongoose 9.11.4, dotenv 18.0.9, MongoDB 7.0.37 container sdn-mongo).
 */
import { lamDeck, two, box, cards, flow, bang, ma, ra, steps } from './_sdn-chung.mjs';
import { J, T, JW, gay, tep } from './_c7-chung.mjs';

export const deck = { key: 'sdn-07-1', code: 'SDN302 7.1', title: 'Exam formats, starter snippet & CLO question bank', sub: 'SDN302 — Node.js, Express & MongoDB' };
const NODE = '#15803d', LAM = '#336791', DO = '#b0281a', CAM = '#e08a1e', TIM = '#7c3aed';
/** cặp (lệnh, kết quả) thứ i (0-based) của một output curl — lệnh thay bằng nhãn ngắn, kết quả giữ nguyên, gói dòng ở n ký tự. */
const cap = (ten) => ra(ten).split('\n');
const D = (ten, pairs, n = 96) => { const L = cap(ten); return gay(pairs.map(([i, nhan]) => `$ ${nhan}\n${L[2 * i + 1]}`).join('\n'), n); };
const TD = (ten, pairs, title, o = {}) => { const t = D(ten, pairs, o.n); return T(t, title, { sm: o.sm, hl: t.split('\n').map((l, i) => (l.startsWith('$ ') ? 0 : i + 1)).filter(Boolean) }); };

export const slides = lamDeck({ chuong: 'Chapter 7 — Exam prep & question bank', bai: '7.1' }, [
  { cover: true, t: 'Exam formats,<br>starter snippet<br>& CLO question bank', sub: 'What the exams look like, a skeleton you can type in ten minutes, and the traps that cost marks under a clock. A lesson, not a solved paper.' },

  { t: 'What you will get from this lesson', to: true, giua: true, body: `<ul>
<li>The grading and the two ≥ 4 gates</li>
<li>What 17 real Practical Exam papers and 7 Final Exam papers look like — counted by a program</li>
<li>A time plan for the 85 minutes</li>
<li>The lesson's starter snippet, run — and an exam-ready version, run with 9 requests</li>
<li>Three traps that cost marks under pressure, each run for real</li>
<li>The CLO question bank, with runnable answers</li>
</ul>` + box('Not a solved paper', 'Exam solutions are not part of this course. This lesson teaches the format and the habits; the papers stay in the exam room on the site for you to practise.', 'lam') },

  { t: 'Five components, two gates', to: true, giua: true, body: bang(['component', 'weight', 'form', 'gate'], [
    ['Assignment (×4)', '20%', 'code, in tutorials and at home', 'on time'],
    ['Practical Exam', '25%', '85 minutes, on-going (during the term)', '≥ 4'],
    ['Progress Test (×3)', '15%', '20–40 minutes · PT1 CLO1-5,8 · PT2 CLO6 · PT3 CLO7', '—'],
    ['Project', '15%', 'a full server-side app + presentation', '—'],
    ['Final Exam', '25%', '60 minutes', '≥ 4'],
  ], { co: 20 }) + box('To pass', 'Practical Exam ≥ 4 AND Final Exam ≥ 4 AND weighted average ≥ 5. A great project does not save a Practical Exam below 4.', 'do2') },

  { t: '17 Practical Exam papers, counted', to: true, giua: true, body: T(ra('s7/pe-format', 2, 22), 'node pe-format.mjs · reads the exam room files on this site · real', { hl: [20, 21] }) },

  { t: 'Two families of papers', to: true, giua: true, body: two(
    box('API questions (12 of 17)', '3–6 questions, each one endpoint, about 1.5–3.5 marks each. Typical: a list with a query filter, a list that populates a relation, a report that groups and totals, and a POST that creates linked documents with validation.', 'lam'),
    box('Generator + JWT API + views (5 of 17)', 'Task 1 (1 mark): Express Generator + import seed data. Task 2 (5 marks): a JWT-protected REST API with the secret in .env. Task 3 (4 marks): EJS/Handlebars pages with bcrypt login, list, delete, add/edit with validation.', 'cam')) +
    bang(['you must be fast at', 'chapter'], [['express + mongoose + .env skeleton', '2, 3, this lesson'], ['schemas with ref, required, unique', '3.2'], ['populate, query filters, status codes', '3.2, 4.1'], ['bcrypt + JWT middleware', '5.1, 5.2'], ['grouping and totals (aggregation)', '8.1'], ['EJS views + forms', '4.2']], { co: 19 }) },

  { t: 'The rules that give zero', to: true, giua: true, body: bang(['rule printed on the paper', 'how often (17 papers)', 'so you'], [
    ['the MongoDB connection string must come from a .env file', '16 / 17', 'MONGODB_URI in .env, read with dotenv — from minute 1'],
    ['the API must answer at the given port (http://localhost:9999)', '15 / 17', 'PORT=9999 in .env, test with that exact URL'],
    ['the JWT secret must be your student code, in .env', 'the Generator family', 'JWT_SECRET=&lt;your code&gt; in .env, never in code'],
  ], { co: 21 }) + box('Zero, not "minus a little"', 'A perfect solution with a hard-coded connection string scores 0. Set up .env before writing any route.', 'do2') +
    T('MONGODB_URI=mongodb://127.0.0.1:27017/SDN302_StudentCodeDB\nPORT=9999\nJWT_SECRET=se181234!', '.env  (example values)') },

  { t: 'The Final Exam', to: true, giua: true, body: T(ra('s7/pe-format', 23, 23), 'the same program · real') +
    two(box('Fifty questions in sixty minutes', 'About a minute per question: theory (event loop, middleware order, status codes, bcrypt vs hashing, CORS, sessions vs JWT) and reading short Express/Mongoose code.', 'lam'),
      box('How to prepare', 'The question bank on slide 18, the Self-check of every lesson, and the chapter quizzes. Read code until you can say what it prints and which status it sends.', 'xanh')) +
    box('Write code that runs', 'In application questions, pseudo-code loses marks. Examiners want correct Mongoose and Express syntax.', 'cam') },

  { t: 'A plan for 85 minutes', to: true, giua: true, body: flow([
    { t: '0–10 min', s: '.env + skeleton, from memory', mau: LAM }, { t: '10–60 min', s: 'one route, then test it', mau: NODE }, { t: '60–85 min', s: 'test all, fix, extras', mau: CAM },
  ]) + steps([
    'Minute 0–10: <b>.env</b>, connect, schema(s) from the paper, router, error handler. Start the server and see "listening on 9999".',
    'Minute 10–60: the questions in order of marks per minute. After EACH route, call it in Postman before writing the next.',
    'Minute 60–85: run every request again, fix, then add what is left (populate, auth, extra validation).',
  ]) + box('Why one route at a time', 'A student who tests at minute 80 finds ten bugs and has time for two. Testing as you go keeps you always in a working state.', 'xanh') },

  { t: 'The lesson\'s starter snippet', to: true, giua: true, body: J(ma('s7/starter', 1, 17), { hl: [3, 4, 13, 17] }) +
    box('Type this from memory in ten minutes', 'Then the exam becomes "extend a running app" instead of "start from a blank file in a panic". The port here is 4630 only because of the recording.', 'lam') },

  { t: 'Run it', to: true, giua: true, body: TD('s7/starter', [[0, 'curl :4630/api/items'], [1, 'curl -X POST :4630/api/items -H "Content-Type: application/json" -d \'{}\''], [2, 'curl -X POST … -d \'{"name":"Pen"}\''], [3, 'curl :4630/api/items']], 'real', { sm: false }) +
    two(box('It works', 'An empty list, 400 for a missing name, 201 with the new document, then the list.', 'xanh'),
      box('What it does not have yet', 'No GET by id, no PUT, no DELETE, no .env, a 500 for every error. The next slides fix that.', 'cam')) +
    box('In the Generator family', 'The same routes go into the generated app.js (or a routes/ file); bin/www already listens on process.env.PORT.', 'lam') },

  { t: 'Trap 1: the body is not JSON', to: true, giua: true, body: TD('s7/starter', [[4, 'curl -X POST :4630/api/items -d \'name=Pen\'   (a form body, like Postman\'s x-www-form-urlencoded)']], 'real', { sm: false }) +
    two(box('req.body is undefined', 'express.json() only reads Content-Type: application/json. In Express 5, any other body leaves req.body undefined, and req.body.name throws.', 'do2'),
      box('In Postman', 'Body → raw → JSON. Or, if the paper uses HTML forms (views family), add app.use(express.urlencoded({ extended: true })).', 'xanh')) +
    J("app.use(express.json());                          // JSON bodies (Postman raw JSON, fetch)\napp.use(express.urlencoded({ extended: true }));  // HTML <form> posts (EJS pages)", { sm: false }) },

  { t: 'An exam-ready starter', to: true, giua: true, body: JW(ma('s7/ready', 8, 11) + '\n' + ma('s7/ready', 13, 29), 120, [2, 3, 13, 14]) },

  { t: 'One error handler, and connect before listen', to: true, giua: true, body: JW(ma('s7/ready', 31, 42), 110, [2, 3, 4, 5, 9, 10, 11]) +
    two(box('Express 5 helps', 'A rejected async handler goes to the error handler by itself — no try/catch in every route. (Express 4 needs try/catch or a wrapper.)', 'lam'),
      box('Connect, THEN listen', 'If the database is down, the server does not pretend to work; it prints the reason and exits.', 'xanh')) },

  { t: 'Nine requests, nine clean answers', to: true, giua: true, body: TD('s7/ready', [
    [0, 'POST {"name":"Pen","price":2}'], [1, 'POST the same name again'], [2, 'POST {"price":-1}'], [3, 'GET /api/items/abc'], [4, 'GET /api/items/<id that does not exist>'],
    [5, 'PUT {"price":-5}'], [6, 'PUT {"price":5}'], [7, 'POST {"name":   (broken JSON)'], [8, 'DELETE /api/items/$ID'],
  ], 'node app.js · PORT and MONGODB_URI from the environment · real', { n: 104 }) },

  { t: 'Trap 2: the PUT typed in a hurry', to: true, giua: true, body: J(ma('s7/put-trap', 7, 9), { sm: false, hl: [2] }) +
    TD('s7/put-trap', [[1, 'PUT /api/items/$ID   {"price":-5}'], [2, 'what is now in MongoDB'], [3, 'PUT /api/items/<id that does not exist>']], 'real', { sm: false }) +
    bang(['missing option', 'what happened'], [['runValidators: true', 'min: 0 was ignored — price -5 was SAVED'], ['new: true', 'the answer shows the OLD document (price 2)'], ['if (!item) 404', 'a missing id answers 200 with null']], { co: 21 }) },

  { t: 'Trap 3: one letter between two files', to: true, giua: true, body: T(tep('s7/env-trap.env.txt'), '.env', { sm: false }) +
    J(ma('s7/env-trap', 2, 5), { sm: false, hl: [3, 4] }) +
    T(gay([1, 2, 7, 11, 20].map((n) => ra('s7/env-trap', n, n).replace('/private/tmp/sdn6-demo/', '')).join('\n'), 100), 'node app.js · real (stack trace shortened)', { hl: [2, 3, 4, 5] }) +
    box('Read the first line of the error', 'MONGODB_URI = undefined: the .env says MONGO_URL. Same name in .env and code, and print it once at start-up when in doubt.', 'cam') },

  { t: 'Test after every route', to: true, giua: true, body: JW(ma('s7/logger', 4, 8), 96, [3], { sm: false }) +
    T(ra('s7/logger', 2, 5, 'server'), 'the server log while testing in Postman / curl · real', { hl: [3, 4] }) +
    two(box('A two-line logger saves minutes', 'Every request you send shows method, URL, status and time. A 404 you did not expect means the route path or method is wrong.', 'xanh'),
      box('Also a question-bank answer', 'CLO1-2: "write a middleware that logs the method and URL of every request" — this is it, run for real.', 'lam')) },

  { t: 'The question bank, by CLO', to: true, giua: true, body: bang(['CLO', 'practise answering'], [
    ['CLO1-2 · Node, Express', 'the event loop and why one thread scales · a logging middleware · what express.json() does and what breaks without it'],
    ['CLO3-5 · Mongoose, REST', 'a schema with a required field and a ref to User · GET with populate · status codes · PUT with validation and 404'],
    ['CLO6 · auth', 'register with bcrypt · requireAuth that verifies a JWT · why the secret lives in the environment'],
    ['CLO7-8 · BaaS, templates', 'what BaaS is and when to use it · render a product list with EJS'],
  ], { co: 21 }) + box('Where the answers are in this course', 'Event loop: Node.js 2.2 · express.json: slide 11 · populate: 3.2 · PUT: slides 12–15 · bcrypt / JWT: 5.1, 5.2 · BaaS: 6.1 · EJS: 4.2.', 'lam') },

  { t: 'Which status code?', to: true, giua: true, body: bang(['situation', 'status', 'seen in this lesson'], [
    ['created', '201', 'POST Pen'], ['read, updated, deleted OK', '200', 'PUT price 5 · DELETE'], ['bad input (validation, bad id, broken JSON)', '400', 'price -1 · /abc · broken JSON'],
    ['not logged in / bad token', '401', 'requireAuth (lesson 5.2)'], ['logged in, not allowed', '403', 'role checks (Node.js 8.3)'], ['not found', '404', 'an id that does not exist'], ['duplicate unique field', '409', 'the same name again'], ['your bug', '500', 'req.body undefined'],
  ], { co: 21 }) },

  { t: 'Exercise', to: true, giua: true, body: box('Exercise', 'From memory, write PUT /api/items/:id that validates the new values and answers 404 when the id does not exist. Then name the request that proves each part works.', '') +
    `<div data-k="dapan">${JW(ma('s7/ready', 20, 24), 110, [2, 3])}${box('Answer', 'runValidators makes min/required apply on update; new: true returns the updated document; the null check gives 404. Prove it: PUT {"price":-5} → 400, PUT {"price":5} → 200 with price 5, PUT on a missing id → 404, PUT on /abc → 400.', 'xanh')}</div>` },

  { t: 'Self-check', to: true, giua: true, body: `<ol>
<li>What two conditions, besides the average, must you meet to pass?</li>
<li>Which mistake on a Practical Exam gives zero even with perfect routes?</li>
<li>Why did POST with a form body return 500?</li>
<li>What did the hurried PUT save, and what did it answer?</li>
<li>Why connect to MongoDB before app.listen?</li>
</ol>
<div data-k="dapan">${box('Answers', '1. Practical Exam ≥ 4 and Final Exam ≥ 4. &nbsp;2. A connection string not read from .env (or the API not on the given port). &nbsp;3. express.json() ignores it, req.body is undefined, req.body.name throws. &nbsp;4. It saved price -5 and answered with the old document; a missing id gave 200 null. &nbsp;5. So a server without a database fails loudly instead of accepting requests it cannot serve.', 'xanh')}</div>` },

  { t: 'Summary', to: true, giua: true, body: `<ul>
<li>Pass = Practical ≥ 4 AND Final ≥ 4 AND average ≥ 5</li>
<li>Two PE families: API questions, or Generator + JWT API + views; .env and the port are zero-mark rules</li>
<li>Type the skeleton in ten minutes; build one route, test it, repeat</li>
<li>Error handler: ValidationError / CastError / broken JSON → 400, 11000 → 409, null → 404</li>
<li>findByIdAndUpdate needs { new: true, runValidators: true }</li>
</ul>` + box('Practise', 'Exam room on the site: the SDN302 papers (time yourself, 85 minutes). Code Lab › REST APIs and MongoDB tracks for speed.', 'lam') },
]);
