/** SDN302 · PE luyện — "Vet Clinic API": đề kiểu Practical Exam (REST API Express + Mongoose, .env + cổng 9999, populate, JWT, mã trạng thái, aggregation), soạn MỚI cho luyện tập — không chép/giải đề thi thật nào trong content/exams. Chấm logic handler trên Mongoose giả trong bộ nhớ. */
import { doiDau, KHOA, bai, cs, q, qn, tn, maNguon } from './_sdn.mjs';

const J = String.raw;
const ENV = { MONGO_URI: 'mongodb://127.0.0.1:27017/SDN_VetClinic', PORT: '9999', JWT_SECRET: 'vet-clinic-secret' };
const DOTENV = 'MONGO_URI=mongodb://127.0.0.1:27017/SDN_VetClinic\nPORT=9999\nJWT_SECRET=vet-clinic-secret\n';

const P0 = cs({
  ten: 'Before the PE: the rules that cost the whole paper', kho: 'EASY', phut: 5, dangBai: 'pe',
  en: 'Typical "0 points if…" rules of SDN302 Practical Exams, and the first ten minutes.',
  vi: 'Các luật "0 điểm nếu…" thường gặp ở Practical Exam SDN302, và mười phút đầu tiên.',
  cau: [
    qn('r1', ['Which of these usually make a PE paper score 0, whatever the rest? (choose all)', 'Cái nào thường làm bài PE bị 0 điểm, bất kể phần còn lại? (chọn hết)'],
      ['The connection string is not read from <code>.env</code>', 'The API is not served on the required port (e.g. 9999)', 'The app crashes on start', 'One endpoint answers 400 instead of 422', 'The code has no comments'],
      [0, 1, 2], ['A grader cannot test an app that does not start or that they cannot reach; a wrong status costs one criterion, not the paper.', 'Giám khảo không chấm được app không khởi động hoặc không gọi tới được; sai một mã trạng thái chỉ mất một tiêu chí, không mất cả bài.']),
    q('r2', ['Minute 0–10 of the PE. What first?', 'Phút 0–10 của PE. Làm gì trước?'],
      ['Type the memorised skeleton (dotenv, connect, models, listen) and test it', 'Read every question, write all the routes, then test them at the end', 'Install extra validation packages before writing any route', 'Design the React page that will call the API later on'],
      ['A running skeleton turns the paper into "extend a working app" (lesson 7.1).', 'Bộ khung chạy được biến đề thành "mở rộng một app đang chạy" (bài 7.1).']),
  ],
  goiY: [['What stops the grader from testing at all?', 'Cái gì khiến giám khảo không chấm được gì?'], ['Skeleton first.', 'Bộ khung trước.']],
  loi: [['Hard-coding the URI.', 'Viết cứng URI.'], ['Testing only at the end.', 'Chỉ kiểm ở cuối.']],
  tns: [tn('criterion', 'tiêu chí chấm')],
  kn: ['exam strategy'],
});

const MODELS_TEXT = J`// ── models (write them exactly as described in the statement) ──`;

const PE = bai({
  ten: 'PE practice — Vet Clinic API (85 minutes, 10 marks)', kho: 'HARD', phut: 85, diem: 50, dangBai: 'pe', lib: ['mongoose', 'mongo-agg', 'express', 'auth'],
  en: J`<p>A Practical-Exam-style paper written for practice. Read the whole statement first, type your skeleton, then do the questions in order and test each one as you go.</p>`,
  vi: J`<p>Một đề kiểu Practical Exam soạn để luyện. Đọc hết tờ đề trước, gõ bộ khung, rồi làm các câu theo thứ tự và kiểm từng câu khi làm.</p>`,
  yc: [['Follow the statement.', 'Làm theo tờ đề.'], ['<code>module.exports = app;</code>', '<code>module.exports = app;</code>']],
  viDu: [['POST /auth/login {"email":"dr.lan@vet.vn","password":"lan-pass-1"}', '200 {"token":"eyJ…"}', 'Then Authorization: Bearer <token> on protected routes.', 'Rồi Authorization: Bearer <token> cho route được bảo vệ.']],
  goiY: [['Use one error handler for CastError / ValidationError so each route stays short.', 'Dùng một error handler cho CastError / ValidationError để mỗi route ngắn gọn.'], ['Q4: validate in this order — fields, ids, date, existence, conflict.', 'Câu 4: kiểm theo thứ tự — field, id, ngày, tồn tại, xung đột.']],
  loi: [['Hard-coding the connection string or the port: the paper scores 0.', 'Viết cứng chuỗi kết nối hoặc cổng: bài bị 0 điểm.'], ['Populating the whole owner/vet (password hashes and emails leak).', 'Populate nguyên owner/vet (lộ mã băm và email).'], ['Q5: checking only the role, not that the visit belongs to THIS vet.', 'Câu 5: chỉ kiểm role, không kiểm lịch khám có thuộc về CHÍNH bác sĩ này không.']],
  gt: ['The paper exercises the whole course in 85 minutes: environment configuration (Ch6), schemas with references and validation (Ch3), REST status codes in MVC style (Ch4), populate with field lists (CLO5), bcrypt + JWT + an ownership check (CLO6) and one aggregation report (Ch8). The reference solution keeps each route short by sending Mongoose errors to one handler.', 'Đề luyện cả môn trong 85 phút: cấu hình môi trường (Ch6), schema có tham chiếu và validation (Ch3), mã trạng thái REST theo kiểu MVC (Ch4), populate kèm danh sách field (CLO5), bcrypt + JWT + kiểm quyền sở hữu (CLO6) và một báo cáo aggregation (Ch8). Lời giải mẫu giữ mỗi route ngắn bằng cách đưa lỗi Mongoose về một handler.'],
  kn: ['practical exam', 'REST', 'Mongoose', 'JWT', 'aggregation'],
  tns: [tn('Practical Exam', 'bài thi thực hành'), tn('rubric', 'thang chấm')],
  env: ENV, them: { '.env': DOTENV },
  timeoutMs: 120000,
  banIn: {
    tieuDe: { en: 'SDN302 — Practical Exam (practice paper): Vet Clinic API', vi: 'SDN302 — Practical Exam (đề luyện): Vet Clinic API' },
    phu: { en: '85 minutes · 10 marks · RESTful API only · served at http://localhost:9999 · written for practice, not a past paper', vi: '85 phút · 10 điểm · chỉ RESTful API · phục vụ ở http://localhost:9999 · soạn để luyện, không phải đề cũ' },
    moTa: { en: '<p>A veterinary clinic keeps owners, their pets, the vets and the visits. Build a REST API with Express and Mongoose. <b>0 points</b> if the connection string is not read from <code>.env</code> (<code>MONGO_URI</code>) or the API does not listen on <code>process.env.PORT</code> (9999). Error answers are JSON <code>{ "message": "…" }</code>. Protected routes use <code>Authorization: Bearer &lt;JWT&gt;</code>; tokens are signed with <code>process.env.JWT_SECRET</code>.</p><p>In this practice room the grader loads <code>.env</code> for you, seeds the database from the sample data and calls <code>app.inject(…)</code> instead of a real port — export the app with <code>module.exports = app</code>.</p>', vi: '<p>Một phòng khám thú y lưu chủ nuôi, thú cưng của họ, bác sĩ và các lượt khám. Dựng REST API bằng Express và Mongoose. <b>0 điểm</b> nếu chuỗi kết nối không đọc từ <code>.env</code> (<code>MONGO_URI</code>) hoặc API không nghe ở <code>process.env.PORT</code> (9999). Câu trả lời lỗi là JSON <code>{ "message": "…" }</code>. Route được bảo vệ dùng <code>Authorization: Bearer &lt;JWT&gt;</code>; token ký bằng <code>process.env.JWT_SECRET</code>.</p><p>Trong phòng luyện này máy chấm nạp <code>.env</code> giúp bạn, tạo dữ liệu từ dữ liệu mẫu và gọi <code>app.inject(…)</code> thay cho cổng thật — export app bằng <code>module.exports = app</code>.</p>' },
    chucNangChinh: [{ en: 'Vet login (bcrypt + JWT)', vi: 'Bác sĩ đăng nhập (bcrypt + JWT)' }, { en: 'Pets with their owners (populate, filters)', vi: 'Thú cưng kèm chủ (populate, bộ lọc)' }, { en: 'Booking and completing visits (validation, conflicts, ownership)', vi: 'Đặt và hoàn tất lượt khám (validation, xung đột, quyền sở hữu)' }, { en: 'A revenue report (aggregation)', vi: 'Báo cáo doanh thu (aggregation)' }],
    yeuCauChung: [
      { en: 'Model names exactly <code>Owner</code>, <code>Pet</code>, <code>Vet</code>, <code>Visit</code>; collections <code>owners</code>, <code>pets</code>, <code>vets</code>, <code>visits</code>.', vi: 'Tên model đúng <code>Owner</code>, <code>Pet</code>, <code>Vet</code>, <code>Visit</code>; collection <code>owners</code>, <code>pets</code>, <code>vets</code>, <code>visits</code>.' },
      { en: 'A malformed ObjectId anywhere ⇒ 400 <code>{ "message": "Invalid id" }</code>.', vi: 'ObjectId dị dạng ở bất kỳ đâu ⇒ 400 <code>{ "message": "Invalid id" }</code>.' },
      { en: 'Never return a password hash or an e-mail through populate.', vi: 'Không bao giờ trả mã băm mật khẩu hay e-mail qua populate.' },
    ],
    cayThuMuc: 'project/\n├── .env            ← MONGO_URI, PORT=9999, JWT_SECRET (given)\n└── answer.js       ← server: dotenv, connect, models, routes, error handler, listen',
    moHinh: [
      { ten: 'Owner', truong: [['name', 'String', 'required'], ['phone', 'String', ''], ['email', 'String', '']] },
      { ten: 'Pet', truong: [['name', 'String', 'required'], ['species', 'String', "'dog' | 'cat' | 'rabbit' | 'bird'"], ['birthYear', 'Number', ''], ['owner', 'ObjectId → Owner', 'required']] },
      { ten: 'Vet', truong: [['name', 'String', 'required'], ['email', 'String', 'required, unique, lowercase'], ['password', 'String', { en: 'bcrypt hash, select: false', vi: 'mã băm bcrypt, select: false' }], ['role', 'String', "'vet' | 'receptionist'"]] },
      { ten: 'Visit', truong: [['pet', 'ObjectId → Pet', 'required'], ['vet', 'ObjectId → Vet', 'required'], ['date', 'Date', 'required'], ['reason', 'String', 'required'], ['status', 'String', "'booked' | 'done' | 'cancelled', default 'booked'"], ['fee', 'Number', 'min 0, default 0']] },
    ],
    duLieuMau: 'owners: Minh Tran (0901…), Hoa Le (0912…)\npets:   Milo (dog, Minh) · Luna (cat, Minh) · Bun (rabbit, Hoa)\nvets:   Dr Lan  — dr.lan@vet.vn  / lan-pass-1  (role vet)\n        Dr Quan — dr.quan@vet.vn / quan-pass-1 (role vet)\n        Thu     — thu@vet.vn     / thu-pass-1  (role receptionist)\nvisits: Milo + Dr Lan, 2026-01-05 09:00Z, done, fee 300000\n        Luna + Dr Lan, 2026-01-06 10:00Z, booked\n        Bun  + Dr Quan, 2026-01-07 14:00Z, done, fee 150000\n(the grader\'s clock reads 2026-01-01T00:00:00Z)',
    chucNang: [
      { ten: { en: 'Q1. Server, .env and models', vi: 'Câu 1. Server, .env và model' }, diem: 1, yeuCau: [{ en: '<code>require(\'dotenv\').config()</code>, <code>mongoose.connect(process.env.MONGO_URI)</code>, <code>app.listen(process.env.PORT)</code>; the four models with the references above.', vi: '<code>require(\'dotenv\').config()</code>, <code>mongoose.connect(process.env.MONGO_URI)</code>, <code>app.listen(process.env.PORT)</code>; bốn model với các tham chiếu ở trên.' }] },
      { ten: { en: 'Q2. POST /auth/login', vi: 'Câu 2. POST /auth/login' }, diem: 1.5, yeuCau: [
        { en: 'Body <code>{ email, password }</code>; missing ⇒ 400 <code>{ "message": "Email and password are required" }</code>.', vi: 'Body <code>{ email, password }</code>; thiếu ⇒ 400 <code>{ "message": "Email and password are required" }</code>.' },
        { en: 'Unknown email or wrong password ⇒ the same 401 <code>{ "message": "Invalid email or password" }</code>; success ⇒ 200 <code>{ "token": … }</code>, payload <code>{ id, role }</code>, expires in 1 hour.', vi: 'Email lạ hoặc sai mật khẩu ⇒ cùng một 401 <code>{ "message": "Invalid email or password" }</code>; thành công ⇒ 200 <code>{ "token": … }</code>, payload <code>{ id, role }</code>, hết hạn sau 1 giờ.' }] },
      { ten: { en: 'Q3. GET /pets', vi: 'Câu 3. GET /pets' }, diem: 1.5, yeuCau: [
        { en: 'Public. 200 + pets sorted by name, <code>owner</code> populated as <code>{ _id, name, phone }</code>.', vi: 'Công khai. 200 + thú cưng sắp theo tên, <code>owner</code> populate thành <code>{ _id, name, phone }</code>.' },
        { en: '<code>?species=cat</code> filters (not one of the four ⇒ 400 <code>{ "message": "Invalid species" }</code>); <code>?owner=&lt;id&gt;</code> filters by owner.', vi: '<code>?species=cat</code> lọc (không thuộc bốn loại ⇒ 400 <code>{ "message": "Invalid species" }</code>); <code>?owner=&lt;id&gt;</code> lọc theo chủ.' }] },
      { ten: { en: 'Q4. POST /visits (protected)', vi: 'Câu 4. POST /visits (được bảo vệ)' }, diem: 2.5, yeuCau: [
        { en: 'No/invalid token ⇒ 401 <code>{ "message": "Unauthorized" }</code> (any role may book).', vi: 'Không có/sai token ⇒ 401 <code>{ "message": "Unauthorized" }</code> (role nào cũng được đặt).' },
        { en: 'Body <code>{ pet, vet, date, reason }</code>: a missing field ⇒ 400 <code>{ "message": "pet, vet, date and reason are required" }</code>; malformed id ⇒ 400 <code>Invalid id</code>; <code>date</code> not a valid date or not in the future ⇒ 400 <code>{ "message": "date must be a future date" }</code>.', vi: 'Body <code>{ pet, vet, date, reason }</code>: thiếu field ⇒ 400 <code>{ "message": "pet, vet, date and reason are required" }</code>; id dị dạng ⇒ 400 <code>Invalid id</code>; <code>date</code> không hợp lệ hoặc không ở tương lai ⇒ 400 <code>{ "message": "date must be a future date" }</code>.' },
        { en: 'Pet / vet not found ⇒ 404 <code>{ "message": "Pet not found" }</code> / <code>{ "message": "Vet not found" }</code>; the vet already has a <b>booked</b> visit at exactly the same date ⇒ 409 <code>{ "message": "Vet is not available at this time" }</code>.', vi: 'Không có thú / bác sĩ ⇒ 404 <code>{ "message": "Pet not found" }</code> / <code>{ "message": "Vet not found" }</code>; bác sĩ đã có lượt <b>booked</b> đúng cùng thời điểm ⇒ 409 <code>{ "message": "Vet is not available at this time" }</code>.' },
        { en: '201 + the visit with <code>pet</code> populated as <code>{ _id, name, species }</code> and <code>vet</code> as <code>{ _id, name }</code>.', vi: '201 + lượt khám với <code>pet</code> populate thành <code>{ _id, name, species }</code> và <code>vet</code> thành <code>{ _id, name }</code>.' }] },
      { ten: { en: 'Q5. PATCH /visits/:id/complete (protected)', vi: 'Câu 5. PATCH /visits/:id/complete (được bảo vệ)' }, diem: 2, yeuCau: [
        { en: 'Only a user with role <code>vet</code> who IS the visit\'s vet ⇒ else 403 <code>{ "message": "Forbidden" }</code>; malformed id ⇒ 400; missing visit ⇒ 404 <code>{ "message": "Visit not found" }</code>.', vi: 'Chỉ người có role <code>vet</code> VÀ chính là bác sĩ của lượt khám ⇒ không thì 403 <code>{ "message": "Forbidden" }</code>; id dị dạng ⇒ 400; không có lượt khám ⇒ 404 <code>{ "message": "Visit not found" }</code>.' },
        { en: 'Body <code>{ fee }</code>: a number ≥ 0 ⇒ else 400 <code>{ "message": "fee must be a number >= 0" }</code>; a visit not in status <code>booked</code> ⇒ 409 <code>{ "message": "Only booked visits can be completed" }</code>; success ⇒ 200 + the visit with <code>status: "done"</code> and the fee.', vi: 'Body <code>{ fee }</code>: là số ≥ 0 ⇒ không thì 400 <code>{ "message": "fee must be a number >= 0" }</code>; lượt khám không ở trạng thái <code>booked</code> ⇒ 409 <code>{ "message": "Only booked visits can be completed" }</code>; thành công ⇒ 200 + lượt khám với <code>status: "done"</code> và phí.' }] },
      { ten: { en: 'Q6. GET /reports/revenue-by-vet', vi: 'Câu 6. GET /reports/revenue-by-vet' }, diem: 1.5, yeuCau: [{ en: 'Public. With <code>Visit.aggregate</code>: only <code>done</code> visits, grouped by vet ⇒ 200 <code>[{ "vet": "Dr Lan", "visits": 1, "revenue": 300000 }, …]</code> sorted by revenue descending (vets without done visits are not listed).', vi: 'Công khai. Bằng <code>Visit.aggregate</code>: chỉ lượt <code>done</code>, gom theo bác sĩ ⇒ 200 <code>[{ "vet": "Dr Lan", "visits": 1, "revenue": 300000 }, …]</code> sắp theo doanh thu giảm dần (bác sĩ không có lượt done thì không liệt kê).' }] },
    ],
    truDiem: [
      { en: 'Connection string or port written in the code: the paper scores 0.', vi: 'Chuỗi kết nối hoặc cổng viết trong mã: bài bị 0 điểm.' },
      { en: 'A password hash visible in any response: −1.', vi: 'Mã băm mật khẩu lộ ở bất kỳ câu trả lời nào: −1.' },
      { en: 'An endpoint that crashes the server (unhandled exception): that question scores 0.', vi: 'Endpoint làm sập server (ngoại lệ không bắt): câu đó 0 điểm.' },
    ],
    nopBai: { en: 'Submit <code>answer.js</code> (and keep <code>.env</code> as given). Delete <code>node_modules</code> in a real exam.', vi: 'Nộp <code>answer.js</code> (giữ <code>.env</code> như cho sẵn). Ở kỳ thi thật hãy xoá <code>node_modules</code>.' },
  },
  dau: J`const express = require('express');
const mongoose = require('mongoose');

${MODELS_TEXT}

const app = express();
mongoose.connect('mongodb://localhost:27017/test');

app.get('/pets', async (req, res) => {
  res.json([]);
});

app.listen(9999);
module.exports = app;
`,
  giai: J`require('dotenv').config();                        // .env ⇒ process.env FIRST
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Schema } = mongoose;

// ───── Q1: models ─────
const Owner = mongoose.model('Owner', new Schema({ name: { type: String, required: true }, phone: String, email: String }));
const SPECIES = ['dog', 'cat', 'rabbit', 'bird'];
const Pet = mongoose.model('Pet', new Schema({
  name: { type: String, required: true },
  species: { type: String, enum: SPECIES },
  birthYear: Number,
  owner: { type: Schema.Types.ObjectId, ref: 'Owner', required: true },
}));
const Vet = mongoose.model('Vet', new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, select: false },
  role: { type: String, enum: ['vet', 'receptionist'] },
}));
const Visit = mongoose.model('Visit', new Schema({
  pet: { type: Schema.Types.ObjectId, ref: 'Pet', required: true },
  vet: { type: Schema.Types.ObjectId, ref: 'Vet', required: true },
  date: { type: Date, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['booked', 'done', 'cancelled'], default: 'booked' },
  fee: { type: Number, min: 0, default: 0 },
}, { timestamps: true }));

const app = express();
app.use(express.json());
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const msg = (res, status, message) => res.status(status).json({ message });

function requireAuth(req, res, next) {
  const [scheme, token] = (req.get('authorization') || '').split(' ');
  try {
    if (scheme !== 'Bearer' || !token) throw new Error('missing');
    req.user = jwt.verify(token, process.env.JWT_SECRET);           // { id, role }
    next();
  } catch { msg(res, 401, 'Unauthorized'); }
}

// ───── Q2: login ─────
app.post('/auth/login', wrap(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return msg(res, 400, 'Email and password are required');
  const vet = await Vet.findOne({ email: String(email).toLowerCase() }).select('+password');
  if (!vet || !(await bcrypt.compare(String(password), vet.password))) return msg(res, 401, 'Invalid email or password');
  res.json({ token: jwt.sign({ id: vet.id, role: vet.role }, process.env.JWT_SECRET, { expiresIn: '1h' }) });
}));

// ───── Q3: pets ─────
app.get('/pets', wrap(async (req, res) => {
  const filter = {};
  if (req.query.species !== undefined) {
    if (!SPECIES.includes(req.query.species)) return msg(res, 400, 'Invalid species');
    filter.species = req.query.species;
  }
  if (req.query.owner !== undefined) filter.owner = req.query.owner;   // malformed ⇒ CastError ⇒ 400
  res.json(await Pet.find(filter).sort({ name: 1 }).populate('owner', 'name phone'));
}));

// ───── Q4: book a visit ─────
app.post('/visits', requireAuth, wrap(async (req, res) => {
  const { pet, vet, date, reason } = req.body;
  if (!pet || !vet || !date || !reason) return msg(res, 400, 'pet, vet, date and reason are required');
  if (!mongoose.isValidObjectId(pet) || !mongoose.isValidObjectId(vet)) return msg(res, 400, 'Invalid id');
  const when = new Date(date);
  if (Number.isNaN(when.getTime()) || when.getTime() <= Date.now()) return msg(res, 400, 'date must be a future date');
  const [p, v] = await Promise.all([Pet.exists({ _id: pet }), Vet.exists({ _id: vet })]);
  if (!p) return msg(res, 404, 'Pet not found');
  if (!v) return msg(res, 404, 'Vet not found');
  if (await Visit.exists({ vet, date: when, status: 'booked' })) return msg(res, 409, 'Vet is not available at this time');
  const visit = await Visit.create({ pet, vet, date: when, reason });
  await visit.populate([{ path: 'pet', select: 'name species' }, { path: 'vet', select: 'name' }]);
  res.status(201).json(visit);
}));

// ───── Q5: complete a visit ─────
app.patch('/visits/:id/complete', requireAuth, wrap(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return msg(res, 400, 'Invalid id');
  const visit = await Visit.findById(req.params.id);
  if (!visit) return msg(res, 404, 'Visit not found');
  if (req.user.role !== 'vet' || String(visit.vet) !== String(req.user.id)) return msg(res, 403, 'Forbidden');   // THIS vet only
  const { fee } = req.body;
  if (typeof fee !== 'number' || Number.isNaN(fee) || fee < 0) return msg(res, 400, 'fee must be a number >= 0');
  if (visit.status !== 'booked') return msg(res, 409, 'Only booked visits can be completed');
  visit.status = 'done';
  visit.fee = fee;
  await visit.save();
  res.json(visit);
}));

// ───── Q6: report ─────
app.get('/reports/revenue-by-vet', wrap(async (req, res) => {
  res.json(await Visit.aggregate([
    { $match: { status: 'done' } },
    { $group: { _id: '$vet', visits: { $sum: 1 }, revenue: { $sum: '$fee' } } },
    { $sort: { revenue: -1 } },
    { $lookup: { from: 'vets', localField: '_id', foreignField: '_id', as: 'v' } },
    { $unwind: '$v' },
    { $project: { _id: 0, vet: '$v.name', visits: 1, revenue: 1 } },
  ]));
}));

// ───── errors ─────
app.use((req, res) => msg(res, 404, 'Not found'));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.name === 'CastError') return msg(res, 400, 'Invalid id');
  if (err.name === 'ValidationError') return msg(res, 400, err.message);
  console.error(err);
  msg(res, 500, 'Internal Server Error');
});

mongoose.connect(process.env.MONGO_URI).catch((e) => console.error(e.message));
app.listen(process.env.PORT, () => console.log('Vet Clinic API on ' + process.env.PORT));
module.exports = app;
`,
  chuanBi: `const app = module.exports; const B = require('bcrypt'); const jwt = require('jsonwebtoken');
const M = (n) => mongoose.model(n); const minh = await M('Owner').create({ name: 'Minh Tran', phone: '0901000001', email: 'minh@mail.vn' }); const hoa = await M('Owner').create({ name: 'Hoa Le', phone: '0912000002', email: 'hoa@mail.vn' });
const milo = await M('Pet').create({ name: 'Milo', species: 'dog', birthYear: 2021, owner: minh._id }); const luna = await M('Pet').create({ name: 'Luna', species: 'cat', birthYear: 2022, owner: minh._id }); const bun = await M('Pet').create({ name: 'Bun', species: 'rabbit', birthYear: 2023, owner: hoa._id });
const lan = await M('Vet').create({ name: 'Dr Lan', email: 'dr.lan@vet.vn', password: await B.hash('lan-pass-1', 10), role: 'vet' }); const quan = await M('Vet').create({ name: 'Dr Quan', email: 'dr.quan@vet.vn', password: await B.hash('quan-pass-1', 10), role: 'vet' }); const thu = await M('Vet').create({ name: 'Thu', email: 'thu@vet.vn', password: await B.hash('thu-pass-1', 10), role: 'receptionist' });
await M('Visit').create({ pet: milo._id, vet: lan._id, date: new Date('2026-01-05T09:00:00Z'), reason: 'vaccine', status: 'done', fee: 300000 }); const lunaVisit = await M('Visit').create({ pet: luna._id, vet: lan._id, date: new Date('2026-01-06T10:00:00Z'), reason: 'check-up' }); await M('Visit').create({ pet: bun._id, vet: quan._id, date: new Date('2026-01-07T14:00:00Z'), reason: 'teeth', status: 'done', fee: 150000 });
const tok = (v) => jwt.sign({ id: String(v._id), role: v.role }, 'vet-clinic-secret', { expiresIn: '1h' });
const go = async (method, url, body, token) => { const r = await app.inject({ method, url, body, headers: token ? { Authorization: 'Bearer ' + token } : {} }); return { status: r.status, body: r.body }; };
const shortVisit = (b) => (b && b._id ? { pet: b.pet, vet: b.vet, date: b.date, reason: b.reason, status: b.status, fee: b.fee } : b);`,
  cases: [
    { goi: `(await __sleep(50), [__mongo.connectedTo, (__listening || []).map(String), M('Pet').schema.path('owner').options.ref, M('Visit').schema.path('pet').options.ref, M('Visit').schema.path('vet').options.ref])`, nhom: 'f1', moTa: ['Connected with MONGO_URI, listening on PORT, references correct', 'Kết nối bằng MONGO_URI, nghe ở PORT, tham chiếu đúng'] },
    { goi: `await (async () => { const r = await go('POST', '/auth/login', { email: 'DR.LAN@vet.vn', password: 'lan-pass-1' }); const p = jwt.verify(r.body.token, 'vet-clinic-secret'); return [r.status, p.id === String(lan._id), p.role, p.exp - p.iat]; })()`, nhom: 'f2', moTa: ['Login → JWT { id, role } for 1 hour', 'Đăng nhập → JWT { id, role } trong 1 giờ'] },
    { goi: `[await go('POST', '/auth/login', { email: 'dr.lan@vet.vn', password: 'nope' }), await go('POST', '/auth/login', { email: 'ghost@vet.vn', password: 'lan-pass-1' }), await go('POST', '/auth/login', { email: 'dr.lan@vet.vn' })]`, nhom: 'f2', moTa: ['Same 401 for both failures; 400 when a field is missing', 'Cùng 401 cho hai thất bại; 400 khi thiếu field'] },
    { goi: `[(await go('GET', '/pets')).body.map((p) => p.name + ' / ' + p.owner.name + ' / ' + Object.keys(p.owner).sort().join(',')), (await go('GET', '/pets?species=cat')).body.map((p) => p.name), (await go('GET', '/pets?owner=' + hoa._id)).body.map((p) => p.name)]`, nhom: 'f3', moTa: ['Pets sorted by name with { _id, name, phone } owners; species and owner filters', 'Thú cưng sắp theo tên kèm chủ { _id, name, phone }; lọc theo loài và chủ'] },
    { goi: `[await go('GET', '/pets?species=dragon'), await go('GET', '/pets?owner=abc'), JSON.stringify((await go('GET', '/pets')).body).includes('@mail.vn')]`, nhom: 'f3', an: true },
    { goi: `[await go('POST', '/visits', { pet: String(bun._id), vet: String(quan._id), date: '2026-02-01T08:00:00Z', reason: 'nails' }), await go('POST', '/visits', {}, tok(thu)), await go('POST', '/visits', { pet: 'x', vet: String(quan._id), date: '2026-02-01T08:00:00Z', reason: 'nails' }, tok(thu)), await go('POST', '/visits', { pet: String(bun._id), vet: String(quan._id), date: '2025-12-31T08:00:00Z', reason: 'nails' }, tok(thu))]`, nhom: 'f4', moTa: ['401 without token; 400 missing / bad id / past date', '401 không token; 400 thiếu / id sai / ngày quá khứ'] },
    { goi: `await (async () => { const r = await go('POST', '/visits', { pet: String(bun._id), vet: String(quan._id), date: '2026-02-01T08:00:00Z', reason: 'nails' }, tok(thu)); return [r.status, shortVisit(r.body).pet, shortVisit(r.body).vet, shortVisit(r.body).status]; })()`, nhom: 'f4', moTa: ['201 with pet { _id, name, species } and vet { _id, name }', '201 với pet { _id, name, species } và vet { _id, name }'] },
    { goi: `[await go('POST', '/visits', { pet: String(new mongoose.Types.ObjectId()), vet: String(quan._id), date: '2026-02-01T08:00:00Z', reason: 'x' }, tok(thu)), await go('POST', '/visits', { pet: String(bun._id), vet: String(new mongoose.Types.ObjectId()), date: '2026-02-01T08:00:00Z', reason: 'x' }, tok(thu)), await go('POST', '/visits', { pet: String(milo._id), vet: String(lan._id), date: '2026-01-06T10:00:00Z', reason: 'second booking' }, tok(quan))]`, nhom: 'f4', moTa: ['404 pet / 404 vet / 409 the vet is busy at that time', '404 thú / 404 bác sĩ / 409 bác sĩ bận giờ đó'] },
    { goi: `[await go('POST', '/visits', { pet: String(milo._id), vet: String(lan._id), date: 'tomorrow', reason: 'x' }, tok(thu)), (await go('POST', '/visits', { pet: String(milo._id), vet: String(lan._id), date: '2026-01-05T09:00:00Z', reason: 'after a done visit at the same time' }, tok(thu))).status, JSON.stringify((await go('POST', '/visits', { pet: String(luna._id), vet: String(quan._id), date: '2026-03-01T08:00:00Z', reason: 'x' }, tok(thu))).body).includes('$2b$')]`, nhom: 'f4', an: true },
    { goi: `[await go('PATCH', '/visits/' + lunaVisit._id + '/complete', { fee: 200000 }, tok(quan)), await go('PATCH', '/visits/' + lunaVisit._id + '/complete', { fee: 200000 }, tok(thu)), await go('PATCH', '/visits/' + lunaVisit._id + '/complete', { fee: 200000 })]`, nhom: 'f5', moTa: ['Another vet → 403, a receptionist → 403, no token → 401', 'Bác sĩ khác → 403, lễ tân → 403, không token → 401'] },
    { goi: `[await go('PATCH', '/visits/' + lunaVisit._id + '/complete', { fee: -1 }, tok(lan)), shortVisit((await go('PATCH', '/visits/' + lunaVisit._id + '/complete', { fee: 200000 }, tok(lan))).body), await go('PATCH', '/visits/' + lunaVisit._id + '/complete', { fee: 1 }, tok(lan))]`, nhom: 'f5', moTa: ['Bad fee → 400; the visit’s own vet → done; again → 409', 'Phí sai → 400; đúng bác sĩ → done; lần nữa → 409'] },
    { goi: `[await go('PATCH', '/visits/abc/complete', { fee: 1 }, tok(lan)), await go('PATCH', '/visits/' + new mongoose.Types.ObjectId() + '/complete', { fee: 1 }, tok(lan)), await go('PATCH', '/visits/' + lunaVisit._id + '/complete', { fee: '200000' }, tok(lan))]`, nhom: 'f5', an: true },
    { goi: `[await go('GET', '/reports/revenue-by-vet'), (await go('PATCH', '/visits/' + lunaVisit._id + '/complete', { fee: 500000 }, tok(lan)), await go('GET', '/reports/revenue-by-vet'))]`, nhom: 'f6', moTa: ['Revenue by vet from done visits, sorted', 'Doanh thu theo bác sĩ từ các lượt done, có sắp'] },
    { goi: `(await M('Visit').updateMany({}, { status: 'cancelled' }), await go('GET', '/reports/revenue-by-vet'))`, nhom: 'f6', an: true },
  ],
  kiemThem: [
    maNguon(['Q1: no connection string in the code', 'Câu 1: không có chuỗi kết nối trong mã'], 'mongodb(\\+srv)?://', { phuDinh: true, nhom: 'f1' }),
    maNguon(['Q1: dotenv is loaded', 'Câu 1: có nạp dotenv'], "require\\(['\"]dotenv['\"]\\)\\.config\\(\\)", { nhom: 'f1' }),
    maNguon(['Q1: no hard-coded port', 'Câu 1: không viết cứng cổng'], 'listen\\(\\s*\\d', { phuDinh: true, nhom: 'f1' }),
  ],
});

export default doiDau({
  slug: 'sdn302-7-pe-luyen-vet-clinic',
  ten: 'PE practice — Vet Clinic API (Practical Exam style)',
  khoa: KHOA,
  baiHoc: 'sdn302-7-1-exam-question-bank',
  de: [P0, PE],
});
