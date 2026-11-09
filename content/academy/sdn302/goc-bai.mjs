/**
 * goc-bai.mjs — các bài "📑 Slide gốc" của SDN302 (09/11/2026): mỗi deck của trường = một bài, đúng thứ tự buổi học của syllabus.
 * Đây là ĐƯỜNG HỌC CHÍNH. Bài cũ (slide tự soạn + bài đọc + video) giữ nguyên slug, đổi tên thành "⭐ Chuyên sâu" và đứng SAU các bài gốc
 * trong cùng chương (xem csNote bên dưới). Slug bài gốc: sdn302-goc-*; module Code Lab cùng slug thì nút 🏋️ tự hiện.
 */
import G00 from './goc/g00.mjs';
import G11 from './goc/g1-1.mjs';
import G12 from './goc/g1-2.mjs';
import G21 from './goc/g2-1.mjs';
import G22 from './goc/g2-2.mjs';
import G31 from './goc/g3-1.mjs';
import G32 from './goc/g3-2.mjs';
import G33 from './goc/g3-3.mjs';
import G41 from './goc/g4-1.mjs';
import G51 from './goc/g5-1.mjs';
import G6 from './goc/g6.mjs';
import G7 from './goc/g7.mjs';
import G8 from './goc/g8.mjs';
import G910 from './goc/g9-10.mjs';
import G11S from './goc/g11.mjs';
import G12S from './goc/g12.mjs';
import G13 from './goc/g13.mjs';
import G1516 from './goc/g15-16.mjs';
import G1719 from './goc/g17-19.mjs';

const KHOA = '/courses/server-side-development-nodejs-express-mongodb/learn?lessonSlug=';
const NODE = '/courses/nodejs/learn?lessonSlug=';

/** Đầu bài: buổi nào của syllabus, CLO nào. */
const dau = (slot, sessions, clo, en, vi) =>
  `<div class="ml-en"><span class="eyebrow">Official slides · ${slot} · syllabus sessions ${sessions} · ${clo}</span><p class="lead">${en}</p></div>\n` +
  `<div class="ml-vi"><span class="eyebrow">Slide gốc · ${slot} · buổi ${sessions} của syllabus · ${clo}</span><p class="lead">${vi}</p></div>\n`;

/** Hộp "📌 Phải nhớ để thi". */
const nho = (en, vi) =>
  `<div class="ml-en"><div class="callout ok"><strong>📌 Must-know for the exam</strong><ul>${en.map((x) => `<li>${x}</li>`).join('')}</ul></div></div>\n` +
  `<div class="ml-vi"><div class="callout ok"><strong>📌 Phải nhớ để thi</strong><ul>${vi.map((x) => `<li>${x}</li>`).join('')}</ul></div></div>\n`;

/** Hộp "Học sâu thêm": [[href, EN, VI], …] */
const them = (items) => {
  const li = (k) => items.map((x) => `<li><a href="${x[0]}">${x[k]}</a></li>`).join('');
  return `<div class="ml-en"><div class="callout"><strong>⭐ Go further</strong><ul>${li(1)}</ul></div></div>\n` +
    `<div class="ml-vi"><div class="callout"><strong>⭐ Học sâu thêm</strong><ul>${li(2)}</ul></div></div>`;
};
const cs = (slug, en, vi) => [KHOA + slug, `⭐ Deep dive (this course): ${en}`, `⭐ Chuyên sâu (môn này): ${vi}`];
const nd = (slug, en, vi) => [NODE + slug, `Node.js course: ${en}`, `Khoá Node.js: ${vi}`];
const gc = (slug, en, vi) => [KHOA + slug, `Official slides: ${en}`, `Slide gốc: ${vi}`];

/**
 * Lời dẫn đặt ĐẦU mỗi bài ⭐ Chuyên sâu cũ: phần cơ bản đã học ở slide gốc; bài này là đào sâu (chạy thật, bẫy, video tự làm).
 * goc = [[slug bài gốc, nhãn EN, nhãn VI], …]
 */
export function csNote(goc, nodeLinks = []) {
  const a = (k) => goc.map((g) => `<a href="${KHOA + g[0]}">${g[k]}</a>`).join(', ');
  const n = (k) => nodeLinks.map((g) => `<a href="${NODE + g[0]}">${g[k]}</a>`).join(', ');
  return `<div class="ml-en"><div class="callout"><strong>⭐ Deep dive — optional.</strong> The exam material of this topic is in the official slides: ${a(1)}. This lesson (self-made slides, video and written lesson) goes further: every program run for real, the traps that cost marks, and production habits.${nodeLinks.length ? ` Even deeper in the Node.js course: ${n(1)}.` : ''}</div></div>\n` +
    `<div class="ml-vi"><div class="callout"><strong>⭐ Chuyên sâu — không bắt buộc.</strong> Phần thi của chủ đề này nằm ở slide gốc: ${a(2)}. Bài này (slide tự soạn, video và bài đọc) đi sâu hơn: mọi chương trình chạy thật, các bẫy làm mất điểm, và thói quen khi làm dự án thật.${nodeLinks.length ? ` Sâu hơn nữa ở khoá Node.js: ${n(2)}.` : ''}</div></div>\n`;
}

const bai = (slug, title, description, content) => ({ title, slug, type: 'VIDEO', description, content });

/* ───────────────────────── Mục 0 ───────────────────────── */
export const MUC0 = [
  bai('sdn302-goc-0-course-intro',
    '📑 Course Introduction — official slides|||📑 Course Introduction — slide gốc',
    'Slide giới thiệu môn của trường (15 slide): mục tiêu, nội dung, công cụ và phiên bản, luật lớp, công thức điểm và điều kiện qua môn.',
    dau('Course Introduction', '1', 'all CLOs',
      'Start here: the school\'s own introduction deck — what SDN302 covers, the tool versions it was written for, and the grading formula with its two ≥ 4 gates.',
      'Bắt đầu ở đây: bộ slide giới thiệu của chính trường — SDN302 dạy gì, phiên bản công cụ môn dùng, và công thức điểm với hai cổng ≥ 4.') +
    G00 +
    nho(['Final result = 15% PT + 20% AS + 15% PR + 25% PE + 25% FE.', 'Pass = attendance &gt; 80%, every on-going part &gt; 0, <strong>PE ≥ 4 and FE ≥ 4</strong>, total ≥ 5.', 'Course versions: Node 20, npm 10, Express 4.19, MongoDB 6, Mongoose 8.'],
      ['Tổng = 15% PT + 20% AS + 15% PR + 25% PE + 25% FE.', 'Qua môn = đi học &gt; 80%, mọi phần thường xuyên &gt; 0, <strong>PE ≥ 4 và FE ≥ 4</strong>, tổng ≥ 5.', 'Phiên bản của môn: Node 20, npm 10, Express 4.19, MongoDB 6, Mongoose 8.']) +
    them([cs('sdn302-gioi-thieu', 'the back-end architecture map', 'bản đồ kiến trúc back-end'), cs('sdn302-chong-mat-diem', 'why students lose marks', 'vì sao mất điểm'), nd('nodejs-0-0-start-here-1', 'what a backend is', 'backend là gì')])),
];

/* ───────────────────────── Chương 1 ───────────────────────── */
export const CH1 = [
  bai('sdn302-goc-1-1-back-end',
    'Slot 1.1 — 📑 What is back-end development? (official slides)|||Slot 1.1 — 📑 Back-end development là gì? (slide gốc)',
    'Slide gốc buổi 1 (18 slide): front-end / back-end / full-stack, kỹ năng và công cụ back-end, ngôn ngữ và framework, Git, hosting, CI/CD.',
    dau('Slot 1.1', '1', 'CLO1', 'The big picture before any code: who does what in a web project, and what a back-end developer works with.', 'Bức tranh lớn trước khi viết code: trong dự án web ai làm gì, và lập trình viên back-end làm việc với những gì.') +
    G11 +
    nho(['Front-end = what the user sees (HTML structure, CSS look, JS behaviour); back-end = server logic + database.', 'Node.js is a <em>runtime</em>; Express is a <em>framework</em>.', 'CI = merge and test often, automatically; CD = automatic release (delivery) or deploy to production (deployment).'],
      ['Front-end = thứ người dùng thấy (HTML cấu trúc, CSS vẻ ngoài, JS hành vi); back-end = logic server + CSDL.', 'Node.js là <em>runtime</em>; Express là <em>framework</em>.', 'CI = gộp và kiểm thử thường xuyên, tự động; CD = tự động phát hành (delivery) hoặc triển khai lên production (deployment).']) +
    them([nd('nodejs-0-0-start-here-1', 'what a backend is, and what Node.js does', 'backend là gì, Node.js làm gì')])),
  bai('sdn302-goc-1-2-nodejs',
    'Slot 1.2 — 📑 NodeJS (official slides)|||Slot 1.2 — 📑 NodeJS (slide gốc)',
    'Slide gốc buổi 1–3 (37 slide): Node.js là gì, đặc điểm, kiến trúc, event loop và 5 pha, npm và package.json, ứng dụng đầu tiên, module, callback → Promise → async/await (code của slide chạy lại thật).',
    dau('Slot 1.2', '1–3', 'CLO1', 'Node.js itself: why one thread can serve many users, the event loop, npm, your first module, and the three ways to write asynchronous code.', 'Chính Node.js: vì sao một luồng phục vụ được nhiều người, event loop, npm, module đầu tiên, và ba cách viết code bất đồng bộ.') +
    G12 +
    nho(['Node.js = runtime environment + JavaScript library, on V8; libuv gives the event loop.', 'Single-threaded but highly scalable; event-driven and asynchronous; not for CPU-heavy work.', 'Event loop phases: timers → pending callbacks → poll → check (<code>setImmediate</code>) → close callbacks.', 'Promise states: pending, fulfilled, rejected. <code>await</code> of a rejected Promise throws → <code>try/catch</code>.', 'CommonJS: <code>module.exports</code> / <code>require</code>.'],
      ['Node.js = môi trường chạy + thư viện JavaScript, trên V8; libuv cho event loop.', 'Đơn luồng mà mở rộng tốt; hướng sự kiện và bất đồng bộ; không hợp việc nặng CPU.', 'Các pha event loop: timers → pending callbacks → poll → check (<code>setImmediate</code>) → close callbacks.', 'Trạng thái Promise: pending, fulfilled, rejected. <code>await</code> một Promise bị reject sẽ ném lỗi → <code>try/catch</code>.', 'CommonJS: <code>module.exports</code> / <code>require</code>.']) +
    them([cs('sdn302-1-1-node-event-loop', 'Node.js, the event loop &amp; modules', 'Node.js, event loop &amp; module'), nd('nodejs-2-2-event-loop', 'the event loop, phase by phase', 'event loop từng pha'), nd('nodejs-1-4-bat-dong-bo', 'callbacks, Promises, async/await', 'callback, Promise, async/await'), nd('nodejs-1-5-module', 'CommonJS vs ES Modules', 'CommonJS và ES Modules'), nd('nodejs-4-1-package-json', 'package.json and npm scripts', 'package.json và npm script')])),
  bai('sdn302-goc-2-1-api',
    'Slot 2.1 — 📑 Using API (official slides)|||Slot 2.1 — 📑 Dùng API (slide gốc)',
    'Slide gốc buổi 4 (28 slide): client–server, API là gì, SOAP và REST, API gateway, bốn method, API và SDK, JSON và XML.',
    dau('Slot 2.1', '4', 'CLO1', 'What an API is and the two families you must compare in exams: SOAP vs REST, JSON vs XML.', 'API là gì và hai cặp phải so sánh khi thi: SOAP và REST, JSON và XML.') +
    G21 +
    nho(['API = Application Programming Interface: a contract for two programs to talk.', 'SOAP = protocol, always XML, POST with an envelope; REST = architectural style, any format (mostly JSON), HTTP verbs + URIs, stateless, cacheable.', 'CRUD ↔ HTTP: Create POST, Read GET, Update PUT/PATCH, Delete DELETE.', 'JSON: key–value, compact, <code>JSON.parse</code>; XML: tree, verbose, needs a parser.'],
      ['API = Application Programming Interface: hợp đồng để hai chương trình nói chuyện.', 'SOAP = giao thức, luôn XML, POST có envelope; REST = phong cách kiến trúc, định dạng nào cũng được (thường JSON), động từ HTTP + URI, stateless, cache được.', 'CRUD ↔ HTTP: Create POST, Read GET, Update PUT/PATCH, Delete DELETE.', 'JSON: khoá–giá trị, gọn, <code>JSON.parse</code>; XML: cây, dài dòng, cần bộ phân tích.']) +
    them([nd('nodejs-6-1-tai-nguyen-phuong-thuc', 'resources, methods and what REST means', 'tài nguyên, method và REST thật sự là gì')])),
  bai('sdn302-goc-2-2-node-http',
    'Slot 2.2 — 📑 Node & HTTP (official slides)|||Slot 2.2 — 📑 Node & HTTP (slide gốc)',
    'Slide gốc buổi 5–6 (52 slide): HTTP request/response, method, mã trạng thái, module http, Postman, fs (async/sync, quyền, stream), path, file server — code của slide chạy thật, chỉ ra 3 lỗi trên slide.',
    dau('Slot 2.2', '5–6', 'CLO1', 'HTTP in detail and Node\'s built-in modules <code>http</code>, <code>fs</code> and <code>path</code> — a web server with no framework.', 'HTTP chi tiết và các module có sẵn của Node <code>http</code>, <code>fs</code>, <code>path</code> — web server không cần framework.') +
    G22 +
    nho(['HTTP is stateless; a response = status line + headers + body.', 'Idempotent: GET, PUT, DELETE (not POST). PATCH = partial update, PUT = full replace.', 'Status codes: 200, 201, 301, 304, 400, 401 (not logged in), 403 (not allowed), 404, 500.', '<code>http.createServer((req, res) =&gt; …).listen(port)</code>; always end with <code>res.end()</code>.', 'Use async <code>fs</code> APIs in request handlers; streams for big files.'],
      ['HTTP là stateless; response = dòng trạng thái + header + thân.', 'Idempotent: GET, PUT, DELETE (không phải POST). PATCH = sửa một phần, PUT = thay cả.', 'Mã trạng thái: 200, 201, 301, 304, 400, 401 (chưa đăng nhập), 403 (không được phép), 404, 500.', '<code>http.createServer((req, res) =&gt; …).listen(port)</code>; luôn kết thúc bằng <code>res.end()</code>.', 'Trong handler dùng API <code>fs</code> bất đồng bộ; tệp lớn dùng stream.']) +
    them([cs('sdn302-1-2-http-server', 'APIs, HTTP &amp; a first Node server', 'API, HTTP &amp; server Node đầu tiên'), nd('nodejs-3-5-http-server', 'an HTTP server with no framework', 'HTTP server không framework'), nd('nodejs-3-1-path-fs', 'path and fs', 'path và fs'), nd('nodejs-3-3-stream', 'streams: the 348 MB experiment', 'stream: thí nghiệm 348 MB'), nd('nodejs-6-2-ma-trang-thai', 'status codes and response shape', 'mã trạng thái và hình dạng response')])),
];

/* ───────────────────────── Chương 2 ───────────────────────── */
export const CH2 = [
  bai('sdn302-goc-3-1-expressjs',
    'Slot 3.1 — 📑 ExpressJS (official slides)|||Slot 3.1 — 📑 ExpressJS (slide gốc)',
    'Slide gốc buổi 7–8 (51 slide): Express, cấu trúc, cài đặt, semver, app.METHOD(PATH, HANDLER), bảng 7 route RESTful, middleware (4 khả năng, 5 loại), body parser, Router, Express Generator — chạy thật với Express 4.19.2.',
    dau('Slot 3.1', '7–8', 'CLO2, CLO3', 'Express — routing, middleware, a REST-style <code>/articles</code> API, <code>express.Router()</code> and Express Generator. The base of every Practical Exam.', 'Express — routing, middleware, một API <code>/articles</code> kiểu REST, <code>express.Router()</code> và Express Generator. Nền của mọi đề Practical Exam.') +
    G31 +
    nho(['Route syntax: <code>app.METHOD(PATH, HANDLER)</code>; params are strings in <code>req.params</code>.', 'Middleware <code>(req, res, next)</code> can: run code, change req/res, end the cycle, call <code>next()</code>.', '5 middleware types: application-level, router-level, built-in, error-handling (4 params), third-party.', 'No <code>express.json()</code> ⇒ <code>req.body</code> is undefined; Postman must send <code>Content-Type: application/json</code>.', 'Express Generator: <code>npx express-generator --view=ejs myapp</code> → <code>bin/www</code>, <code>routes/</code>, <code>views/</code>, <code>public/</code>, <code>app.js</code>.', 'Set the status <em>before</em> <code>res.write</code> — afterwards it is too late.'],
      ['Cú pháp route: <code>app.METHOD(PATH, HANDLER)</code>; params là chuỗi trong <code>req.params</code>.', 'Middleware <code>(req, res, next)</code> có thể: chạy code, sửa req/res, kết thúc chu trình, gọi <code>next()</code>.', '5 loại middleware: application-level, router-level, built-in, error-handling (4 tham số), third-party.', 'Thiếu <code>express.json()</code> ⇒ <code>req.body</code> là undefined; Postman phải gửi <code>Content-Type: application/json</code>.', 'Express Generator: <code>npx express-generator --view=ejs myapp</code> → <code>bin/www</code>, <code>routes/</code>, <code>views/</code>, <code>public/</code>, <code>app.js</code>.', 'Đặt mã trạng thái <em>trước</em> <code>res.write</code> — sau đó là quá muộn.']) +
    them([cs('sdn302-2-1-express-routing', 'Express routing &amp; your first app', 'Express routing &amp; app đầu tiên'), cs('sdn302-2-2-middleware', 'middleware, the heart of Express', 'middleware, trái tim của Express'), nd('nodejs-5-1-tu-http-toi-express', 'from raw http to Express', 'từ http thuần tới Express'), nd('nodejs-5-2-dinh-tuyen', 'params, query and Router', 'params, query và Router'), nd('nodejs-5-3-middleware', 'the middleware chain', 'chuỗi middleware'), nd('nodejs-5-4-xu-ly-loi', 'centralised error handling', 'xử lý lỗi tập trung')])),
];

/* ───────────────────────── Chương 3 ───────────────────────── */
export const CH3 = [
  bai('sdn302-goc-3-2-nosql-mongodb',
    'Slot 3.2 — 📑 NoSQL database with MongoDB (official slides)|||Slot 3.2 — 📑 CSDL NoSQL với MongoDB (slide gốc)',
    'Slide gốc buổi 9–10 (53 slide): serialization, NoSQL và 4 loại, SQL và NoSQL, database/collection/document, mongosh và Compass, BSON và ObjectId, CRUD trong shell, nhúng và tham chiếu.',
    dau('Slot 3.2', '9–10', 'CLO4', 'MongoDB from the shell: what a document database is, CRUD with <code>insertOne/find/updateOne/replaceOne/deleteMany</code>, and modelling relationships.', 'MongoDB từ shell: CSDL tài liệu là gì, CRUD với <code>insertOne/find/updateOne/replaceOne/deleteMany</code>, và mô hình hoá quan hệ.') +
    G32 +
    nho(['4 NoSQL types: key-value, document, column, graph. MongoDB = document.', 'SQL vs NoSQL: strict vs dynamic schema, ACID vs mostly BASE, vertical vs horizontal scaling.', 'database → collection → document (≈ database → table → row).', 'ObjectId: 12 bytes, starts with a timestamp; <code>_id</code> is the primary key.', '<code>updateOne</code> + <code>$set</code> changes fields; <code>replaceOne</code> replaces the whole document.', 'Embed small data read together; reference large or growing data.'],
      ['4 loại NoSQL: key-value, document, column, graph. MongoDB = document.', 'SQL và NoSQL: lược đồ cứng và động, ACID và phần lớn BASE, mở rộng dọc và ngang.', 'database → collection → document (≈ database → bảng → dòng).', 'ObjectId: 12 byte, bắt đầu bằng timestamp; <code>_id</code> là khoá chính.', '<code>updateOne</code> + <code>$set</code> đổi trường; <code>replaceOne</code> thay cả tài liệu.', 'Dữ liệu nhỏ đọc cùng nhau thì nhúng; lớn hoặc cứ tăng thì tham chiếu.']) +
    them([cs('sdn302-3-1-mongodb-crud', 'NoSQL, MongoDB &amp; CRUD run for real', 'NoSQL, MongoDB &amp; CRUD chạy thật'), nd('nodejs-7-1-ket-noi-va-pool', 'why a database, and what a connection costs', 'vì sao cần CSDL, một kết nối tốn gì')])),
  bai('sdn302-goc-3-3-node-mongodb',
    'Slot 3.3 — 📑 NodeJS with MongoDB (official slides)|||Slot 3.3 — 📑 NodeJS với MongoDB (slide gốc)',
    'Slide gốc buổi 10 + 14 (46 slide): driver mongodb, chuỗi kết nối, CRUD từ Node, toán tử, so khớp regex, sort, limit/skip, $lookup — mọi truy vấn chạy thật trên MongoDB 7.',
    dau('Slot 3.3', '10, 14', 'CLO4', 'MongoDB from Node code with the official driver — including the <strong>regex match</strong> of session 14 and the <code>$lookup</code> join.', 'MongoDB từ code Node bằng driver chính thức — gồm cả <strong>so khớp regex</strong> của buổi 14 và phép join <code>$lookup</code>.') +
    G33 +
    nho(['<code>new MongoClient(url)</code> → <code>await client.connect()</code> → <code>client.db(name).collection(c)</code> → <code>finally client.close()</code>.', 'Every driver call returns a Promise: forget <code>await</code> and you print <code>undefined</code>.', '<code>find(q)</code> returns a cursor → <code>.toArray()</code>; <code>findOne</code> returns one document or <code>null</code>.', 'Regex: <code>/^P/</code> starts with, <code>/er$/</code> ends with, <code>/Ro/</code> contains, <code>i</code> = ignore case.', 'MongoDB applies <strong>skip before limit</strong>; pagination = <code>skip((page-1)*size).limit(size)</code>.', '<code>$lookup</code>: from, localField, foreignField, as — a left outer join.'],
      ['<code>new MongoClient(url)</code> → <code>await client.connect()</code> → <code>client.db(name).collection(c)</code> → <code>finally client.close()</code>.', 'Mọi lời gọi driver trả Promise: quên <code>await</code> là in ra <code>undefined</code>.', '<code>find(q)</code> trả cursor → <code>.toArray()</code>; <code>findOne</code> trả một tài liệu hoặc <code>null</code>.', 'Regex: <code>/^P/</code> bắt đầu bằng, <code>/er$/</code> kết thúc bằng, <code>/Ro/</code> có chứa, <code>i</code> = không phân biệt hoa thường.', 'MongoDB áp <strong>skip trước limit</strong>; phân trang = <code>skip((page-1)*size).limit(size)</code>.', '<code>$lookup</code>: from, localField, foreignField, as — left outer join.']) +
    them([cs('sdn302-3-1-mongodb-crud', 'MongoDB CRUD, traps run for real', 'CRUD MongoDB, bẫy chạy thật'), nd('nodejs-6-4-phan-trang', 'pagination, filtering and sorting', 'phân trang, lọc và sắp xếp')])),
  bai('sdn302-goc-4-1-mongoose',
    'Slot 4.1 — 📑 Mongoose (official slides)|||Slot 4.1 — 📑 Mongoose (slide gốc)',
    'Slide gốc buổi 11 + 17 (36 slide): ODM, cài đặt (mongoose, nodemon, dotenv), MVC, schema và model, CRUD, validation, exists/where, ref + populate, middleware pre/post — chạy thật trên Mongoose 8 và 9.',
    dau('Slot 4.1', '11, 17', 'CLO4, CLO5', 'Mongoose — schema, model, validation and the MVC folder layout. The library of almost every SDN302 Practical Exam.', 'Mongoose — schema, model, validation và cách chia thư mục MVC. Thư viện của gần như mọi đề Practical Exam SDN302.') +
    G41 +
    nho(['ODM = Object Data Modeling: Mongoose adds a schema to schema-less MongoDB.', '<code>mongoose.model(\'Blog\', schema)</code> → collection <code>blogs</code> (lowercase, plural).', '<code>new Model().save()</code> or <code>Model.create()</code>; validators run on create/save, <strong>not</strong> on <code>updateOne</code> unless <code>runValidators: true</code>.', 'MVC: Model (schema), View (template), Controller (logic between them).', '<code>ref: \'User\'</code> = the <em>model</em> name; <code>populate(\'author\')</code> replaces the id with the document.', 'Course version is Mongoose 8; on Mongoose 9 <code>pre(\'save\', function (next) …)</code> fails — use an <code>async function</code> without <code>next</code>.'],
      ['ODM = Object Data Modeling: Mongoose thêm schema cho MongoDB vốn không có schema.', '<code>mongoose.model(\'Blog\', schema)</code> → collection <code>blogs</code> (viết thường, số nhiều).', '<code>new Model().save()</code> hoặc <code>Model.create()</code>; validator chạy khi create/save, <strong>không</strong> chạy với <code>updateOne</code> trừ khi có <code>runValidators: true</code>.', 'MVC: Model (schema), View (template), Controller (logic ở giữa).', '<code>ref: \'User\'</code> = tên <em>model</em>; <code>populate(\'author\')</code> thay id bằng tài liệu.', 'Môn dùng Mongoose 8; trên Mongoose 9 <code>pre(\'save\', function (next) …)</code> hỏng — dùng <code>async function</code> không có <code>next</code>.']) +
    them([cs('sdn302-3-2-mongoose', 'Mongoose: schemas, models &amp; population, traps run for real', 'Mongoose: schema, model &amp; population, bẫy chạy thật'), nd('nodejs-6-3-validate-schema', 'validation with a schema', 'kiểm hợp lệ bằng schema'), nd('nodejs-18-1-tang-va-trach-nhiem', 'layers and responsibilities', 'các tầng và trách nhiệm')])),
  bai('sdn302-goc-5-1-population',
    'Slot 5.1 — 📑 Mongoose population (official slides)|||Slot 5.1 — 📑 Mongoose population (slide gốc)',
    'Slide gốc buổi 12–13 (18 slide): population là gì, ref, populate trong truy vấn, select, nhiều path, lồng nhau, chi phí — chạy thật, kể cả lỗi exec(callback) trên Mongoose mới.',
    dau('Slot 5.1', '12–13', 'CLO5', 'Population — showing the user inside each post or comment. Syllabus sessions 12–13 ("cross-reference users within a comment").', 'Population — hiện thông tin người dùng ngay trong mỗi bài viết hay bình luận. Buổi 12–13 của syllabus ("tham chiếu người dùng trong bình luận").') +
    G51 +
    nho(['Reference = <code>{ type: Schema.Types.ObjectId, ref: \'User\' }</code>.', '<code>await Post.find().populate(\'author\')</code> — never <code>exec(callback)</code> (removed in Mongoose 7).', '<code>populate({ path: \'author\', select: \'name email -_id\' })</code> limits fields.', 'Several paths: chain <code>.populate()</code>; nested: <code>populate({ path, populate: { path } })</code>; comments: <code>populate(\'comments.user\')</code>.', 'Each populated path = one extra query (<code>_id: { $in: [...] }</code>); a deleted reference becomes <code>null</code>.'],
      ['Tham chiếu = <code>{ type: Schema.Types.ObjectId, ref: \'User\' }</code>.', '<code>await Post.find().populate(\'author\')</code> — không bao giờ <code>exec(callback)</code> (bị bỏ từ Mongoose 7).', '<code>populate({ path: \'author\', select: \'name email -_id\' })</code> giới hạn trường.', 'Nhiều path: nối <code>.populate()</code>; lồng nhau: <code>populate({ path, populate: { path } })</code>; bình luận: <code>populate(\'comments.user\')</code>.', 'Mỗi path populate = thêm một truy vấn (<code>_id: { $in: [...] }</code>); tham chiếu đã bị xoá thành <code>null</code>.']) +
    them([cs('sdn302-3-2-mongoose', 'population for real, with N+1', 'population chạy thật, cả lỗi N+1'), nd('nodejs-7-4-quan-he-va-n-plus-1', 'relations and the N+1 problem measured', 'quan hệ và lỗi N+1 đo thật')])),
];

/* ───────────────────────── Chương 4 ───────────────────────── */
export const CH4 = [
  bai('sdn302-goc-6-restful-api',
    'Slot 6 — 📑 RESTful API with Express, MongoDB and Mongoose (official slides)|||Slot 6 — 📑 RESTful API với Express, MongoDB và Mongoose (slide gốc)',
    'Slide gốc buổi 15–17 (22 slide): nguyên tắc REST, dùng method đúng, model có validator, controller, route, thử bằng Postman — theo MVC.',
    dau('Slot 6', '15–17', 'CLO5', 'A full REST API in MVC: model → controller → routes, tested with Postman. The shape of most Practical Exam papers.', 'Một REST API đầy đủ theo MVC: model → controller → route, thử bằng Postman. Hình dạng của phần lớn đề Practical Exam.') +
    G6 +
    nho(['6 REST constraints: client–server, stateless, cacheable, uniform interface, layered system, code on demand (optional).', 'Status codes of the controller: GET 200, POST <strong>201</strong>, validation error 400, not found 404, DELETE 204, server error 500.', '<code>findByIdAndUpdate(id, body, { new: true, runValidators: true })</code>.', 'Routes only map URL + verb → controller function; no database code in routes.', 'A malformed id throws <code>CastError</code> — answer 400, not 500.'],
      ['6 ràng buộc REST: client–server, stateless, cache được, giao diện thống nhất, hệ nhiều lớp, code theo yêu cầu (tuỳ chọn).', 'Mã của controller: GET 200, POST <strong>201</strong>, lỗi validation 400, không thấy 404, DELETE 204, lỗi server 500.', '<code>findByIdAndUpdate(id, body, { new: true, runValidators: true })</code>.', 'Route chỉ ánh xạ URL + động từ → hàm controller; không có code CSDL trong route.', 'Id sai dạng ném <code>CastError</code> — trả 400, không phải 500.']) +
    them([cs('sdn302-4-1-rest-mvc', 'a full REST API with a service layer, run for real', 'REST API đầy đủ có tầng service, chạy thật'), nd('nodejs-6-1-tai-nguyen-phuong-thuc', 'resources and methods', 'tài nguyên và method'), nd('nodejs-6-2-ma-trang-thai', 'status codes and response shape', 'mã trạng thái và hình dạng response'), nd('nodejs-5-5-notes-api', 'assembling the Notes API', 'lắp ráp Notes API')])),
  bai('sdn302-goc-7-ejs',
    'Slot 7 — 📑 EJS — Embedded JavaScript (official slides)|||Slot 7 — 📑 EJS — Embedded JavaScript (slide gốc)',
    'Slide gốc buổi 19–21 (21 slide): EJS là gì, cấu hình với Express, res.render, tuỳ chọn, bảng thẻ <% %>, EJS và JSX — render thật.',
    dau('Slot 7', '19–21', 'CLO8', 'Server-side templates with EJS: the "View" of MVC when the server renders HTML.', 'Template phía server với EJS: chữ "View" của MVC khi server tự render HTML.') +
    G7 +
    nho(['Setup: <code>app.set(\'view engine\', \'ejs\')</code>, views in <code>./views</code>, <code>res.render(\'name\', data)</code>.', '<code>&lt;% %&gt;</code> logic, <code>&lt;%= %&gt;</code> escaped output, <code>&lt;%- %&gt;</code> raw output, <code>&lt;%# %&gt;</code> comment.', 'Use <code>&lt;%-</code> only for trusted HTML (includes) — never for user data (XSS).', 'A variable used in the template but not passed ⇒ "x is not defined".', 'EJS renders on the server; JSX (React) on the client after a build step.'],
      ['Cấu hình: <code>app.set(\'view engine\', \'ejs\')</code>, view trong <code>./views</code>, <code>res.render(\'name\', data)</code>.', '<code>&lt;% %&gt;</code> logic, <code>&lt;%= %&gt;</code> in có thoát, <code>&lt;%- %&gt;</code> in thô, <code>&lt;%# %&gt;</code> chú thích.', 'Chỉ dùng <code>&lt;%-</code> cho HTML tin cậy (include) — không bao giờ cho dữ liệu người dùng (XSS).', 'Biến dùng trong template mà không truyền ⇒ "x is not defined".', 'EJS render ở server; JSX (React) render ở client sau bước build.']) +
    them([cs('sdn302-4-2-templating', 'EJS &amp; Handlebars with forms and the XSS test, run for real', 'EJS &amp; Handlebars có form và phép thử XSS, chạy thật'), nd('nodejs-9-2-xss-va-sanitize', 'XSS: from a stranger\'s note to your session', 'XSS: từ ghi chú của người lạ tới phiên của bạn')])),
  bai('sdn302-goc-8-handlebars',
    'Slot 8 — 📑 Handlebars (official slides)|||Slot 8 — 📑 Handlebars (slide gốc)',
    'Slide gốc buổi 22 (16 slide): Handlebars, express-handlebars, layout, helper, if/each, partial, hook helperMissing/blockHelperMissing — chạy thật.',
    dau('Slot 8', '22', 'CLO8', 'The second template engine: logic-less Handlebars with layouts, helpers and partials.', 'Template engine thứ hai: Handlebars "không logic" với layout, helper và partial.') +
    G8 +
    nho(['<code>{{x}}</code> escaped, <code>{{{x}}}</code> raw HTML.', 'express-handlebars wraps every view in a layout that needs <code>{{{body}}}</code>; the default layout is <code>views/layouts/main.handlebars</code>.', 'Helpers: <code>{{name arg}}</code>; blocks: <code>{{#if}}…{{else}}…{{/if}}</code>, <code>{{#each items}}{{this}}{{/each}}</code>.', 'Partials: <code>{{&gt; item}}</code> from <code>partialsDir</code>.', 'Pass <code>.lean()</code> Mongoose results to Handlebars.'],
      ['<code>{{x}}</code> có thoát, <code>{{{x}}}</code> HTML thô.', 'express-handlebars bọc mỗi view trong một layout cần <code>{{{body}}}</code>; layout mặc định là <code>views/layouts/main.handlebars</code>.', 'Helper: <code>{{name arg}}</code>; khối: <code>{{#if}}…{{else}}…{{/if}}</code>, <code>{{#each items}}{{this}}{{/each}}</code>.', 'Partial: <code>{{&gt; item}}</code> lấy từ <code>partialsDir</code>.', 'Truyền kết quả Mongoose đã <code>.lean()</code> cho Handlebars.']) +
    them([cs('sdn302-4-2-templating', 'the Mongoose trap in Handlebars, run for real', 'cái bẫy Mongoose trong Handlebars, chạy thật')])),
];

/* ───────────────────────── Chương 5 ───────────────────────── */
export const CH5 = [
  bai('sdn302-goc-9-10-auth',
    'Slot 9–10 — 📑 Authentication & Security (official slides)|||Slot 9–10 — 📑 Xác thực & bảo mật (slide gốc)',
    'Slide gốc buổi 25–30 (64 slide): xác thực, mã hoá CSDL, Basic auth, cookie (HttpOnly/Secure/SameSite, có chữ ký), session (express-session, kho, hết hạn), Passport (local, local-mongoose, serialize), token và JWT — kiểm thật các lỗi của slide.',
    dau('Slot 9–10', '25–30', 'CLO6', 'Who is calling? Basic authentication, cookies, sessions, Passport and JWT — the largest deck of the course.', 'Ai đang gọi? Basic authentication, cookie, session, Passport và JWT — bộ slide dài nhất của môn.') +
    G910 +
    nho(['Authentication = who you are (401); authorization = what you may do (403).', 'Encryption is reversible; hashing is one-way — passwords are hashed (bcrypt).', 'Basic auth = <code>Base64(user:pass)</code> — encoding, not encryption.', 'Cookie flags: HttpOnly (no JS), Secure (HTTPS only), SameSite (CSRF).', 'Session = cookie with the id + data on the server; default MemoryStore is for development only.', 'Passport: strategy → <code>done(null, user | false)</code>, serializeUser/deserializeUser, <code>passport.authenticate(\'local\')</code>.', 'JWT = header.payload.signature (Base64URL, signed not encrypted); send <code>Authorization: Bearer &lt;token&gt;</code> and split off "Bearer ".'],
      ['Xác thực = bạn là ai (401); phân quyền = bạn được làm gì (403).', 'Mã hoá đảo ngược được; băm là một chiều — mật khẩu phải băm (bcrypt).', 'Basic auth = <code>Base64(user:pass)</code> — mã hoá ký tự, không phải bảo mật.', 'Cờ cookie: HttpOnly (JS không đọc), Secure (chỉ HTTPS), SameSite (chống CSRF).', 'Session = cookie chứa mã + dữ liệu ở server; MemoryStore mặc định chỉ để phát triển.', 'Passport: strategy → <code>done(null, user | false)</code>, serializeUser/deserializeUser, <code>passport.authenticate(\'local\')</code>.', 'JWT = header.payload.signature (Base64URL, được ký chứ không mã hoá); gửi <code>Authorization: Bearer &lt;token&gt;</code> và tách bỏ "Bearer ".']) +
    them([cs('sdn302-5-1-passwords-sessions', 'passwords, bcrypt, sessions &amp; Passport, run for real', 'mật khẩu, bcrypt, session &amp; Passport, chạy thật'), cs('sdn302-5-2-jwt-cors', 'JWT on Mongoose, run for real', 'JWT trên Mongoose, chạy thật'), nd('nodejs-8-1-mat-khau-va-bam', 'storing passwords', 'lưu mật khẩu'), nd('nodejs-8-2-jwt-access-refresh', 'JWT, refresh tokens and rotation', 'JWT, refresh token và xoay vòng'), nd('nodejs-8-4-cookie-csrf-thu-hoi', 'cookies, CSRF and revocation', 'cookie, CSRF và thu hồi')])),
  bai('sdn302-goc-11-https',
    'Slot 11 — 📑 HTTPS & secure communication (official slides)|||Slot 11 — 📑 HTTPS & giao tiếp an toàn (slide gốc)',
    'Slide gốc buổi 31–32 + 39–40 (24 slide): HTTPS/TLS, đối xứng và bất đối xứng, bắt tay, chứng chỉ tự ký bằng openssl, https.createServer, chuyển HTTP → HTTPS, SSO, OAuth 1 và 2 — chạy thật.',
    dau('Slot 11', '31–32, 39–40', 'CLO6', 'Encrypting the connection: how TLS works, a self-signed certificate, an HTTPS server in Node, the HTTP → HTTPS redirect; then SSO and OAuth.', 'Mã hoá đường truyền: TLS chạy thế nào, chứng chỉ tự ký, HTTPS server trong Node, chuyển HTTP → HTTPS; rồi SSO và OAuth.') +
    G11S +
    nho(['HTTPS = HTTP over TLS (SSL is the old name).', 'Asymmetric (public/private key) to agree on a session key; symmetric (shared key) to transfer data.', '<code>openssl req -x509 -newkey rsa:2048 -nodes -keyout server.key -out server.crt</code>.', '<code>https.createServer({ key, cert }, app).listen(443)</code>; HTTP server answers 301 to <code>https://…</code>.', 'Self-signed = development only; production needs a CA (e.g. Let\'s Encrypt).', 'OAuth 2 = access token via an identity provider, requires HTTPS; OAuth 1 = signed requests.'],
      ['HTTPS = HTTP chạy trên TLS (SSL là tên cũ).', 'Bất đối xứng (khoá công khai/bí mật) để thống nhất khoá phiên; đối xứng (khoá chung) để truyền dữ liệu.', '<code>openssl req -x509 -newkey rsa:2048 -nodes -keyout server.key -out server.crt</code>.', '<code>https.createServer({ key, cert }, app).listen(443)</code>; server HTTP trả 301 sang <code>https://…</code>.', 'Tự ký = chỉ để phát triển; production cần CA (ví dụ Let\'s Encrypt).', 'OAuth 2 = access token qua nhà cung cấp danh tính, bắt buộc HTTPS; OAuth 1 = request có chữ ký.']) +
    them([cs('sdn302-5-2-jwt-cors', 'what the network sees with and without HTTPS', 'mạng nhìn thấy gì khi có và không có HTTPS'), nd('nodejs-9-1-header-csp-cors', 'security headers, CSP and CORS', 'header bảo mật, CSP và CORS')])),
  bai('sdn302-goc-12-upload-download',
    'Slot 12 — 📑 Upload & download files (official slides)|||Slot 12 — 📑 Upload & download file (slide gốc)',
    'Slide gốc buổi 33–36 (21 slide): Multer diskStorage, upload.single / array, React FormData, liệt kê tệp, tải về — chạy thật, kèm route download mà slide thiếu và bẫy trùng tên tệp.',
    dau('Slot 12', '33–36', 'CLO6', 'Receiving files with Multer, one or many, and sending them back as downloads — with a React client.', 'Nhận tệp bằng Multer, một hoặc nhiều, và gửi lại dưới dạng tải xuống — có client React.') +
    G12S +
    nho(['File upload = POST with <code>multipart/form-data</code>; <code>express.json()</code> cannot read it, Multer can.', '<code>upload.single(\'file\')</code> → <code>req.file</code>; <code>upload.array(\'files\', 5)</code> → <code>req.files</code>.', 'The form field name must equal the Multer field name, else "Unexpected field".', 'Add <code>limits</code>, a <code>fileFilter</code> and unique file names.', 'Download: <code>res.download(path)</code> sends <code>Content-Disposition: attachment</code>; use <code>path.basename</code> on user input.'],
      ['Upload tệp = POST với <code>multipart/form-data</code>; <code>express.json()</code> không đọc được, Multer thì được.', '<code>upload.single(\'file\')</code> → <code>req.file</code>; <code>upload.array(\'files\', 5)</code> → <code>req.files</code>.', 'Tên trường của form phải trùng tên trường của Multer, không thì "Unexpected field".', 'Thêm <code>limits</code>, <code>fileFilter</code> và tên tệp duy nhất.', 'Tải về: <code>res.download(path)</code> gửi <code>Content-Disposition: attachment</code>; dùng <code>path.basename</code> với dữ liệu người dùng.']) +
    them([cs('sdn302-5-2-jwt-cors', 'upload limits and path traversal, run for real', 'giới hạn upload và path traversal, chạy thật'), nd('nodejs-10-1-nhan-file-multipart', 'receiving a file: multipart', 'nhận tệp: multipart'), nd('nodejs-10-3-kiem-file-that', 'never trust the file', 'đừng tin tệp người dùng gửi')])),
  bai('sdn302-goc-13-cors',
    'Slot 13 — 📑 CORS (official slides)|||Slot 13 — 📑 CORS (slide gốc)',
    'Slide gốc buổi 37–38 (13 slide): origin, chính sách cùng nguồn, 4 header Access-Control, preflight, gói cors — chạy thật với origin được phép và không được phép.',
    dau('Slot 13', '37–38', 'CLO6', 'Why the browser blocks a React app from reading your API, and how the <code>cors</code> package allows the right origins.', 'Vì sao trình duyệt chặn app React đọc API của bạn, và gói <code>cors</code> cho phép đúng origin ra sao.') +
    G13 +
    nho(['Origin = scheme + host + port; CORS is enforced by the <strong>browser</strong>, not the server.', 'Headers: Access-Control-Allow-Origin / -Methods / -Headers / -Max-Age.', 'Preflight = automatic <code>OPTIONS</code> before PUT/DELETE or custom headers.', '<code>app.use(cors())</code> = every origin; <code>cors({ origin: \'http://localhost:3000\' })</code> = one origin.', 'Postman ignores CORS — test CORS from a browser page.'],
      ['Origin = giao thức + tên máy + cổng; CORS do <strong>trình duyệt</strong> thực thi, không phải server.', 'Header: Access-Control-Allow-Origin / -Methods / -Headers / -Max-Age.', 'Preflight = <code>OPTIONS</code> tự gửi trước PUT/DELETE hoặc khi có header riêng.', '<code>app.use(cors())</code> = mọi origin; <code>cors({ origin: \'http://localhost:3000\' })</code> = một origin.', 'Postman bỏ qua CORS — thử CORS từ một trang trên trình duyệt.']) +
    them([cs('sdn302-5-2-jwt-cors', 'CORS measured: the cors package and the preflight', 'CORS đo thật: gói cors và preflight'), cs('sdn302-6-1-react-deploy', 'React ↔ API in a real browser, reading a CORS error', 'React ↔ API trên trình duyệt thật, đọc lỗi CORS'), nd('nodejs-9-1-header-csp-cors', 'the perimeter: headers, CSP and CORS', 'vành đai: header, CSP và CORS')])),
];

/* ───────────────────────── Chương 6 ───────────────────────── */
export const CH6 = [
  bai('sdn302-goc-15-16-baas',
    'Slot 15–16 — 📑 Backend as a Service (BaaS) (official slides)|||Slot 15–16 — 📑 Backend as a Service (BaaS) (slide gốc)',
    'Slide gốc buổi 43–48 (32 slide): BaaS, PaaS/IaaS/SaaS, triển khai Node lên Heroku (CLI, Git, GitHub), Firebase (project, CLI, hosting), so sánh Firebase và Heroku.',
    dau('Slot 15–16', '43–48', 'CLO7', 'Renting the back-end: BaaS and the cloud models, deploying a Node app to Heroku, and Firebase.', 'Thuê back-end: BaaS và các mô hình đám mây, triển khai app Node lên Heroku, và Firebase.') +
    G1516 +
    nho(['BaaS = ready-made back-end (database, auth, storage, push) through APIs/SDKs — e.g. Firebase.', 'Less to most of your own work: SaaS → BaaS → PaaS → IaaS.', 'PaaS = you bring code (Heroku, Render); IaaS = you rent machines (EC2, VPS).', 'Deploy checklist: listen on <code>process.env.PORT</code>, a <code>start</code> script, secrets as config vars, never commit <code>.env</code>.', 'Heroku: no free tier since 2022; Firebase Hosting serves static files, APIs run as Cloud Functions.'],
      ['BaaS = back-end làm sẵn (CSDL, xác thực, lưu trữ, thông báo đẩy) qua API/SDK — ví dụ Firebase.', 'Từ ít tới nhiều việc tự làm: SaaS → BaaS → PaaS → IaaS.', 'PaaS = bạn mang code (Heroku, Render); IaaS = bạn thuê máy (EC2, VPS).', 'Checklist triển khai: nghe ở <code>process.env.PORT</code>, có script <code>start</code>, bí mật đặt bằng config var, không commit <code>.env</code>.', 'Heroku: không còn gói miễn phí từ 2022; Firebase Hosting phục vụ tệp tĩnh, API chạy dạng Cloud Function.']) +
    them([cs('sdn302-6-1-react-deploy', 'connect React, deploy &amp; BaaS — three real deploy failures', 'nối React, triển khai &amp; BaaS — ba lỗi triển khai thật'), nd('nodejs-17-4-bi-mat-cau-hinh', 'secrets and configuration', 'bí mật và cấu hình'), nd('nodejs-17-1-anh-docker', 'the Docker image', 'ảnh Docker')])),
];

/* ───────────────────────── Chương 8 ───────────────────────── */
export const CH8 = [
  bai('sdn302-goc-17-19-nestjs-hono',
    'Slot 17–19 — 📑 Frameworks: NestJS & Hono (official slides)|||Slot 17–19 — 📑 Framework: NestJS & Hono (slide gốc)',
    'Slide gốc buổi 49–56 (32 slide): NestJS (module, controller, provider, decorator, DI, NestFactory, HMR, CLI, CRUD mèo), Hono (Context, JSON, param/query, middleware, adapter), so sánh — chạy thật cả hai.',
    dau('Slot 17–19', '49–56', 'CLO2', 'Two more frameworks: structured NestJS for large apps and tiny Hono for the edge — both run for real.', 'Hai framework nữa: NestJS có cấu trúc cho app lớn và Hono nhỏ gọn cho edge — cả hai đều chạy thật.') +
    G1719 +
    nho(['Nest building blocks: module (<code>@Module</code>), controller (<code>@Controller</code>, <code>@Get</code>…), provider (<code>@Injectable</code>) injected through the constructor.', '<code>NestFactory.create(AppModule)</code> + <code>app.listen(3000)</code>; CLI <code>nest g module|controller|service cats</code>.', 'Route params are strings: use <code>@Param(\'id\', ParseIntPipe)</code>.', 'Hono: handler gets Context <code>c</code> and returns <code>c.json()</code> / <code>c.text()</code>; <code>c.req.param()</code>, <code>c.req.query()</code>.', 'Hono = light, edge/serverless; Nest = full, enterprise, TypeScript.'],
      ['Khối dựng của Nest: module (<code>@Module</code>), controller (<code>@Controller</code>, <code>@Get</code>…), provider (<code>@Injectable</code>) được tiêm qua constructor.', '<code>NestFactory.create(AppModule)</code> + <code>app.listen(3000)</code>; CLI <code>nest g module|controller|service cats</code>.', 'Param của route là chuỗi: dùng <code>@Param(\'id\', ParseIntPipe)</code>.', 'Hono: handler nhận Context <code>c</code> và trả <code>c.json()</code> / <code>c.text()</code>; <code>c.req.param()</code>, <code>c.req.query()</code>.', 'Hono = nhẹ, edge/serverless; Nest = đầy đủ, doanh nghiệp, TypeScript.']) +
    them([cs('sdn302-8-1-nestjs-hono', 'Express vs NestJS vs Hono measured', 'Express, NestJS, Hono đo thật'), nd('nodejs-18-2-to-chuc-ma-nguon', 'organising the source code', 'tổ chức mã nguồn')])),
];

/** Lời dẫn cho từng bài ⭐ cũ (slug bài cũ → csNote). */
export const CS_NOTE = {
  'sdn302-1-1-node-event-loop': csNote([['sdn302-goc-1-2-nodejs', 'Slot 1.2 NodeJS', 'Slot 1.2 NodeJS']], [['nodejs-2-2-event-loop', 'the event loop', 'event loop'], ['nodejs-1-4-bat-dong-bo', 'async', 'bất đồng bộ']]),
  'sdn302-1-2-http-server': csNote([['sdn302-goc-2-1-api', 'Slot 2.1 API', 'Slot 2.1 API'], ['sdn302-goc-2-2-node-http', 'Slot 2.2 Node &amp; HTTP', 'Slot 2.2 Node &amp; HTTP']], [['nodejs-3-5-http-server', 'HTTP server', 'HTTP server']]),
  'sdn302-2-1-express-routing': csNote([['sdn302-goc-3-1-expressjs', 'Slot 3.1 ExpressJS', 'Slot 3.1 ExpressJS']], [['nodejs-5-1-tu-http-toi-express', 'from http to Express', 'từ http tới Express'], ['nodejs-5-2-dinh-tuyen', 'routing', 'routing']]),
  'sdn302-2-2-middleware': csNote([['sdn302-goc-3-1-expressjs', 'Slot 3.1 ExpressJS (slides 16–18)', 'Slot 3.1 ExpressJS (slide 16–18)']], [['nodejs-5-3-middleware', 'middleware', 'middleware'], ['nodejs-5-4-xu-ly-loi', 'error handling', 'xử lý lỗi']]),
  'sdn302-3-1-mongodb-crud': csNote([['sdn302-goc-3-2-nosql-mongodb', 'Slot 3.2 NoSQL &amp; MongoDB', 'Slot 3.2 NoSQL &amp; MongoDB'], ['sdn302-goc-3-3-node-mongodb', 'Slot 3.3 NodeJS with MongoDB', 'Slot 3.3 NodeJS với MongoDB']]),
  'sdn302-3-2-mongoose': csNote([['sdn302-goc-4-1-mongoose', 'Slot 4.1 Mongoose', 'Slot 4.1 Mongoose'], ['sdn302-goc-5-1-population', 'Slot 5.1 Population', 'Slot 5.1 Population']], [['nodejs-7-4-quan-he-va-n-plus-1', 'relations and N+1', 'quan hệ và N+1']]),
  'sdn302-4-1-rest-mvc': csNote([['sdn302-goc-6-restful-api', 'Slot 6 RESTful API', 'Slot 6 RESTful API']], [['nodejs-6-2-ma-trang-thai', 'status codes', 'mã trạng thái'], ['nodejs-18-1-tang-va-trach-nhiem', 'layers', 'các tầng']]),
  'sdn302-4-2-templating': csNote([['sdn302-goc-7-ejs', 'Slot 7 EJS', 'Slot 7 EJS'], ['sdn302-goc-8-handlebars', 'Slot 8 Handlebars', 'Slot 8 Handlebars']], [['nodejs-9-2-xss-va-sanitize', 'XSS', 'XSS']]),
  'sdn302-5-1-passwords-sessions': csNote([['sdn302-goc-9-10-auth', 'Slot 9–10 Authentication &amp; Security', 'Slot 9–10 Xác thực &amp; bảo mật']], [['nodejs-8-1-mat-khau-va-bam', 'passwords', 'mật khẩu']]),
  'sdn302-5-2-jwt-cors': csNote([['sdn302-goc-9-10-auth', 'Slot 9–10 (JWT)', 'Slot 9–10 (JWT)'], ['sdn302-goc-11-https', 'Slot 11 HTTPS', 'Slot 11 HTTPS'], ['sdn302-goc-12-upload-download', 'Slot 12 Upload/Download', 'Slot 12 Upload/Download'], ['sdn302-goc-13-cors', 'Slot 13 CORS', 'Slot 13 CORS']], [['nodejs-8-2-jwt-access-refresh', 'JWT', 'JWT'], ['nodejs-10-1-nhan-file-multipart', 'uploads', 'upload'], ['nodejs-9-1-header-csp-cors', 'CORS', 'CORS']]),
  'sdn302-6-1-react-deploy': csNote([['sdn302-goc-13-cors', 'Slot 13 CORS', 'Slot 13 CORS'], ['sdn302-goc-15-16-baas', 'Slot 15–16 BaaS', 'Slot 15–16 BaaS']], [['nodejs-17-4-bi-mat-cau-hinh', 'configuration', 'cấu hình']]),
  'sdn302-8-1-nestjs-hono': csNote([['sdn302-goc-17-19-nestjs-hono', 'Slot 17–19 NestJS &amp; Hono', 'Slot 17–19 NestJS &amp; Hono']]),
};
