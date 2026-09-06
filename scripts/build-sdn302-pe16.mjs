/**
 * build-sdn302-pe16.mjs — sinh content/exams/SDN302-PE16.mjs.
 *
 * Nguồn thật: "SDN302 - SU26 - PE - Paper 1" (mã đợt
 * SDN302_SU26_PE_20060701) — Helicopter Management System
 * (manufacturers/helicopters/members). Có 3 file JSON seed + 1
 * Note.docx tham khảo (cùng mẫu boilerplate JWT-verify/bcrypt-hash đã
 * gặp ở PE13, không phải solution).
 *
 * ⚠️ 2 điểm đề TỰ MÂU THUẪN với chính seed/schema của nó, ghi rõ trong
 * explanation thay vì âm thầm sửa:
 * 1) Đề văn xuôi ghi thông tin đăng nhập mẫu "name: soldier" nhưng
 *    members.json thật lưu "name": "solider" (lỗi chính tả trong seed
 *    thật) — hệ thống PHẢI so khớp với DỮ LIỆU THẬT trong DB (solider),
 *    không phải chuỗi trong văn bản đề.
 * 2) Task 3.4/3.5 gọi field chọn manufacturer là "manufacturerName",
 *    nhưng schema thật đặt tên field là "manufacturer" (String) — select
 *    phải populate từ field "manufacturer" thật, không phải tìm 1 field
 *    "manufacturerName" không tồn tại.
 *
 * Điểm gốc: Task1=1.0, Task2=5.0, Task3=4.0 — tách 5 câu CODE giống
 * cấu trúc PE13 (residents): Task1(1.0); Task2(5.0, JWT+CRUD+chốt xoá
 * referential); Task3 tách 3 câu (đăng nhập+danh sách=1.5, xoá=1.0,
 * thêm/sửa=1.5).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE16.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE16.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given Mongoose schema (3 collections — a manufacturer owns many helicopters, each helicopter belongs to one manufacturer):</b>` +
  `<pre><code class="language-javascript">manufacturers({
    manufacturer: {type: String, required: true, unique: true},
    isAsia: {type: Boolean, default: false},
}, {timestamps: true});

helicopters({
    heliName: {type: String, required: true, unique: true},
    imgWrapper: {type: String, required: true},
    isAssembly: {type: Boolean, default: false},
    price: {type: Number, required: true},
    adult: {type: Boolean, default: false},
    manufacturer: {type: mongoose.Schema.Types.ObjectId, ref: "manufacturer", required: true},
}, {timestamps: true});

members({
    name: {type: String, required: true},
    pass: {type: String, required: true},
}, {timestamps: true});</code></pre></div>`,
  `<div class="pe-system"><b>Schema Mongoose đề cho (3 bảng — 1 manufacturer sở hữu nhiều helicopter, mỗi helicopter thuộc 1 manufacturer):</b>` +
  `<pre><code class="language-javascript">manufacturers({
    manufacturer: {type: String, required: true, unique: true},
    isAsia: {type: Boolean, default: false},
}, {timestamps: true});

helicopters({
    heliName: {type: String, required: true, unique: true},
    imgWrapper: {type: String, required: true},
    isAssembly: {type: Boolean, default: false},
    price: {type: Number, required: true},
    adult: {type: Boolean, default: false},
    manufacturer: {type: mongoose.Schema.Types.ObjectId, ref: "manufacturer", required: true},
}, {timestamps: true});

members({
    name: {type: String, required: true},
    pass: {type: String, required: true},
}, {timestamps: true});</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Summer 2026) — Helicopter Management System</strong>. A manufacturer owns many helicopters; each helicopter belongs to one manufacturer. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at the configured port.</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Summer 2026) — Hệ thống quản lý trực thăng</strong>. 1 manufacturer sở hữu nhiều helicopter; mỗi helicopter thuộc 1 manufacturer. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại cổng đã cấu hình.</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 01 (1.0 mark):</strong> using the Express Generator, create a REST API server, then create the related manufacturers and migrate them to the MongoDB database.</p>`,
    `<p><strong>Task 01 (1.0 điểm):</strong> dùng Express Generator tạo REST API server, tạo các manufacturer liên quan và nạp vào database MongoDB.</p>`,
  ),
  starterCode:
`// ===== models/manufacturer.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ManufacturerSchema = new Schema({
    manufacturer: { type: String, required: true, unique: true },
    isAsia: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("manufacturer", ManufacturerSchema);

// ===== models/helicopter.model.js =====
const HelicopterSchema = new Schema({
    heliName: { type: String, required: true, unique: true },
    imgWrapper: { type: String, required: true },
    isAssembly: { type: Boolean, default: false },
    price: { type: Number, required: true },
    adult: { type: Boolean, default: false },
    manufacturer: { type: Schema.Types.ObjectId, ref: "manufacturer", required: true },
}, { timestamps: true });

module.exports = mongoose.model("helicopter", HelicopterSchema);

// ===== models/member.model.js =====
const MemberSchema = new Schema({
    name: { type: String, required: true },
    pass: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("member", MemberSchema);`,
  sampleSolution:
`// ===== models/manufacturer.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ManufacturerSchema = new Schema({
    manufacturer: { type: String, required: true, unique: true },
    isAsia: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("manufacturer", ManufacturerSchema);

// ===== models/helicopter.model.js =====
const HelicopterSchema = new Schema({
    heliName: { type: String, required: true, unique: true },
    imgWrapper: { type: String, required: true },
    isAssembly: { type: Boolean, default: false },
    price: { type: Number, required: true },
    adult: { type: Boolean, default: false },
    manufacturer: { type: Schema.Types.ObjectId, ref: "manufacturer", required: true },
}, { timestamps: true });

module.exports = mongoose.model("helicopter", HelicopterSchema);

// ===== models/member.model.js =====
const MemberSchema = new Schema({
    name: { type: String, required: true },
    pass: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("member", MemberSchema);`,
  explanation: B(
    `<p>The Mongoose ref string is literally <code>"manufacturer"</code> (singular), matching the schema's own <code>ref:</code> value shown in the paper verbatim — the model must be registered under that exact name (<code>mongoose.model("manufacturer", ...)</code>), not the plural collection-name convention used elsewhere in this course, or <code>.populate("manufacturer")</code> in later questions would silently fail to resolve.</p>`,
    `<p>Chuỗi ref của Mongoose ghi đúng nguyên văn <code>"manufacturer"</code> (số ít), khớp đúng giá trị <code>ref:</code> đề cho — model phải đăng ký đúng tên đó (<code>mongoose.model("manufacturer", ...)</code>), không theo quy ước số nhiều dùng ở nơi khác trong môn, nếu không <code>.populate("manufacturer")</code> ở các câu sau sẽ âm thầm không phân giải được.</p>`,
  ),
  rubric: [
    { id: 'express_generator_structure', criterion: B('Project follows the standard Express-generator structure.', 'Dự án theo đúng cấu trúc Express-generator chuẩn.'), weight: 1, maxScore: 0.3 },
    { id: 'manufacturer_schema_matches', criterion: B('Manufacturer model matches the given schema exactly (manufacturer unique+required, isAsia default false), registered under the model name "manufacturer".', 'Model Manufacturer khớp đúng schema đề cho (manufacturer unique+required, isAsia mặc định false), đăng ký đúng tên model "manufacturer".'), weight: 1, maxScore: 0.4 },
    { id: 'migrated_data', criterion: B('Manufacturer data is correctly migrated/imported into the MongoDB database.', 'Dữ liệu manufacturer nạp đúng vào database MongoDB.'), weight: 1, maxScore: 0.3 },
  ],
};

const q2 = {
  kind: 'CODE', points: 5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 02 (5.0 marks):</strong> build a new REST API server for the manufacturer collection, using JWT for authenticating the API. The JWT secret key must be your StudentCode (e.g. <code>se181234@</code>) and stored in the .env file. Visit <code>/auth/tokens</code> to generate the JWT — the account credentials are stored in the members.json file. <b>Do not store the JWT in cookies or session storage.</b> Route paths: <code>/api/manufacturers</code> and <code>/api/manufacturers/:id</code> for all CRUD methods related to manufacturers. Implement JWT-protected CRUD operations for the manufacturer collection. For the DELETE operation, ensure a manufacturer cannot be deleted if any helicopters are associated with it (i.e., if there are documents in the Helicopter collection referencing the manufacturer's <code>_id</code>) — return an appropriate error message (e.g., "Cannot delete manufacturer because it has associated Helicopters") if deletion is attempted in such cases.</p>`,
    `<p><strong>Task 02 (5.0 điểm):</strong> xây REST API mới cho bảng manufacturer, dùng JWT xác thực API. Secret key JWT phải là StudentCode (VD <code>se181234@</code>) lưu trong .env. Vào <code>/auth/tokens</code> để sinh JWT — thông tin tài khoản lưu trong members.json. <b>Không lưu JWT trong cookie hay session storage.</b> Route: <code>/api/manufacturers</code> và <code>/api/manufacturers/:id</code> cho mọi CRUD manufacturer. Triển khai CRUD có bảo vệ JWT cho bảng manufacturer. Với DELETE, manufacturer không được xoá khi còn helicopter nào tham chiếu tới (còn document trong bảng Helicopter tham chiếu <code>_id</code> của manufacturer) — trả lỗi phù hợp (VD "Cannot delete manufacturer because it has associated Helicopters") nếu cố xoá trong trường hợp đó.</p>`,
  ),
  starterCode:
`// ===== controllers/auth.controller.js =====
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const Member = db.member;

const generateToken = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { generateToken };

// ===== middlewares/auth.middleware.js =====
const authenticateToken = (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = authenticateToken;

// ===== controllers/manufacturer.controller.js =====
const Manufacturer = db.manufacturer;
const Helicopter = db.helicopter;

const findAll = async (req, res, next) => { /* ... */ };
const findOne = async (req, res, next) => { /* ... */ };
const create = async (req, res, next) => { /* ... */ };
const update = async (req, res, next) => { /* ... */ };
const remove = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { findAll, findOne, create, update, remove };`,
  sampleSolution:
`// ===== controllers/auth.controller.js =====
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const Member = db.member;

const generateToken = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { name, pass } = req.body;

        const member = await Member.findOne({ name });
        if (!member) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(pass, member.pass);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ accountID: member._id }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        });
        res.json({ token });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { generateToken };

// ===== middlewares/auth.middleware.js =====
const jwt2 = require("jsonwebtoken");
const db2 = require("../models/index");
const Member2 = db2.member;

const authenticateToken = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt2.verify(token, process.env.SECRET_KEY);
        const member = await Member2.findById(decoded.accountID);
        if (!member) return res.status(401).json({ message: "Account not found" });

        req.user = member;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
    // -------------------------------------------------------
};

module.exports = authenticateToken;

// ===== controllers/manufacturer.controller.js =====
const db3 = require("../models/index");
const Manufacturer = db3.manufacturer;
const Helicopter = db3.helicopter;

const findAll = async (req, res, next) => {
    try {
        res.json(await Manufacturer.find());
    } catch (error) { next(error); }
};

const findOne = async (req, res, next) => {
    try {
        const manufacturer = await Manufacturer.findById(req.params.id);
        if (!manufacturer) return res.status(404).json({ message: "Manufacturer not found" });
        res.json(manufacturer);
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const { manufacturer, isAsia } = req.body;
        if (!manufacturer || typeof manufacturer !== "string" || !manufacturer.trim()) {
            return res.status(400).json({ message: "manufacturer is required and must be a non-empty string" });
        }
        const existing = await Manufacturer.findOne({ manufacturer: manufacturer.trim() });
        if (existing) {
            return res.status(400).json({ message: "manufacturer must be unique" });
        }
        const created = await Manufacturer.create({ manufacturer: manufacturer.trim(), isAsia });
        res.status(201).json(created);
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const { manufacturer, isAsia } = req.body;
        const doc = await Manufacturer.findById(req.params.id);
        if (!doc) return res.status(404).json({ message: "Manufacturer not found" });

        if (manufacturer !== undefined) {
            if (typeof manufacturer !== "string" || !manufacturer.trim()) {
                return res.status(400).json({ message: "manufacturer must be a non-empty string" });
            }
            const duplicate = await Manufacturer.findOne({ manufacturer: manufacturer.trim(), _id: { \$ne: req.params.id } });
            if (duplicate) return res.status(400).json({ message: "manufacturer must be unique" });
            doc.manufacturer = manufacturer.trim();
        }
        if (isAsia !== undefined) doc.isAsia = isAsia;

        await doc.save();
        res.json(doc);
    } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { id } = req.params;

        const hasHelicopters = await Helicopter.exists({ manufacturer: id });
        if (hasHelicopters) {
            return res.status(400).json({
                message: "Cannot delete manufacturer because it has associated Helicopters",
            });
        }

        const deleted = await Manufacturer.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Manufacturer not found" });

        res.json({ message: "Manufacturer deleted successfully" });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { findAll, findOne, create, update, remove };`,
  explanation: B(
    `<p><b>The paper's own sample login line ("name: soldier") does not match the actual seed data</b>: <code>members.json</code> really stores <code>"name": "solider"</code> (a typo baked into the seed file itself). <code>generateToken</code> must query whatever is ACTUALLY in the <code>members</code> collection after import — it never hardcodes "soldier" — so it works correctly regardless of which spelling the grader's real test request uses, since it's driven entirely by <code>Member.findOne({name})</code> against the imported data. The verify-middleware payload key <code>accountID</code> matches this exam's own Note.docx reference snippet exactly (not <code>id</code>, which other SDN302 papers use).</p>`,
    `<p><b>Dòng đăng nhập mẫu của chính đề ("name: soldier") KHÔNG khớp dữ liệu seed thật</b>: <code>members.json</code> thật lưu <code>"name": "solider"</code> (lỗi chính tả nằm ngay trong file seed). <code>generateToken</code> phải truy vấn ĐÚNG những gì THẬT SỰ có trong bảng <code>members</code> sau khi nạp — không hardcode "soldier" — nên chạy đúng bất kể cách viết nào request test thật của giám khảo dùng, vì hoàn toàn dựa vào <code>Member.findOne({name})</code> so với dữ liệu đã nạp. Key payload middleware verify <code>accountID</code> khớp đúng đoạn tham khảo trong chính Note.docx đề này (không phải <code>id</code> như các đề SDN302 khác dùng).</p>`,
  ),
  rubric: [
    { id: 'token_generation_correct', criterion: B('POST /auth/tokens validates credentials against the members collection (bcrypt-compared) and returns a valid JWT signed with the StudentCode secret.', 'POST /auth/tokens kiểm đúng thông tin so bảng members (so bcrypt) và trả JWT hợp lệ ký bằng secret StudentCode.'), weight: 1, maxScore: 1 },
    { id: 'jwt_middleware_protects_routes', criterion: B('All manufacturer CRUD routes require a valid JWT via an auth middleware.', 'Mọi route CRUD manufacturer yêu cầu JWT hợp lệ qua middleware xác thực.'), weight: 1, maxScore: 1 },
    { id: 'crud_implemented', criterion: B('All CRUD operations are correctly implemented for the manufacturer collection.', 'Đủ mọi thao tác CRUD triển khai đúng cho bảng manufacturer.'), weight: 1, maxScore: 1.5 },
    { id: 'delete_referential_guard', criterion: B('DELETE checks for any helicopter referencing the manufacturer before deleting, returning the appropriate message when helicopters exist.', 'DELETE kiểm đúng có helicopter nào tham chiếu manufacturer trước khi xoá, trả thông điệp phù hợp khi còn helicopter.'), weight: 1, maxScore: 1.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.1-3.2 (1.5 marks):</strong> client application for helicopter management (EJS/Handlebars/Pug + Express). <b>Authentication:</b> at the login view (<code>auth/access</code>), users enter their account name and pass; the pass must be encrypted using bcrypt and stored in the members collection (import account data from members.json). All CRUD actions require authentication. Show an error message for failed login attempts. Redirect to the Helicopter list after a successful login. <b>Helicopter list:</b> display all helicopters in a <b>card view</b> (not a table view), at route <code>/management/helicopters</code>, including: heliName, price (displayed as the price in USD, calculated as price/26000 and rounded to one decimal — e.g. <code>{"price": 1709887}</code> → 65.8 USD), imgWrapper, adult (displayed as a male (true)/child (false) icon), and manufacturer name.</p>`,
    `<p><strong>Task 03.1-3.2 (1.5 điểm):</strong> app client quản lý trực thăng (EJS/Handlebars/Pug + Express). <b>Xác thực:</b> tại view đăng nhập (<code>auth/access</code>), nhập đúng account name và pass; pass phải mã hoá bcrypt lưu trong bảng members (nạp dữ liệu tài khoản từ members.json). Mọi CRUD cần xác thực. Hiện lỗi khi đăng nhập sai. Đăng nhập thành công chuyển hướng danh sách Helicopter. <b>Danh sách helicopter:</b> hiện tất cả helicopter dạng <b>card view</b> (không phải bảng), tại route <code>/management/helicopters</code>, gồm: heliName, price (hiện giá USD, tính = price/26000 làm tròn 1 chữ số thập phân — VD <code>{"price": 1709887}</code> → 65.8 USD), imgWrapper, adult (hiện icon nam giới (true)/trẻ em (false)), và tên manufacturer.</p>`,
  ),
  starterCode:
`// ===== middlewares/pageAuth.middleware.js =====
const ensureLoggedIn = (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};
module.exports = ensureLoggedIn;

// ===== controllers/page.controller.js =====
const bcrypt = require("bcrypt");
const db = require("../models/index");
const Member = db.member;
const Helicopter = db.helicopter;

const showLogin = (req, res) => res.render("access", { error: null });

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const listHelicopters = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { showLogin, login, listHelicopters };`,
  sampleSolution:
`// ===== middlewares/pageAuth.middleware.js =====
const ensureLoggedIn = (req, res, next) => {
    // ---------- Student's code starts from here ----------
    if (!req.session.memberId) {
        return res.redirect("/auth/access");
    }
    next();
    // -------------------------------------------------------
};
module.exports = ensureLoggedIn;

// ===== controllers/page.controller.js =====
const bcrypt = require("bcrypt");
const db = require("../models/index");
const Member = db.member;
const Helicopter = db.helicopter;

const showLogin = (req, res) => res.render("access", { error: null });

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { name, pass } = req.body;
        const member = await Member.findOne({ name });
        const isMatch = member ? await bcrypt.compare(pass, member.pass) : false;

        if (!member || !isMatch) {
            return res.render("access", { error: "Invalid account name or password." });
        }

        req.session.memberId = member._id;
        res.redirect("/management/helicopters");
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

const listHelicopters = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const helicopters = await Helicopter.find().populate("manufacturer", "manufacturer").lean();

        const viewModel = helicopters.map((h) => ({
            ...h,
            priceUsd: Math.round((h.price / 26000) * 10) / 10,
        }));

        res.render("helicopters", { helicopters: viewModel });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { showLogin, login, listHelicopters };

// ===== views/helicopters.ejs (card view excerpt) =====
// <% helicopters.forEach(function(h) { %>
//   <div class="helicopter-card">
//     <img src="<%= h.imgWrapper %>" alt="<%= h.heliName %>" />
//     <h3><%= h.heliName %></h3>
//     <p><%= h.priceUsd.toFixed(1) %> USD</p>
//     <p><i class="<%= h.adult ? 'icon-male' : 'icon-child' %>"></i></p>
//     <p>Manufacturer: <%= h.manufacturer ? h.manufacturer.manufacturer : '' %></p>
//   </div>
// <% }); %>`,
  explanation: B(
    `<p>The manufacturer sub-document's own display field is named <code>manufacturer</code> (a String), the SAME name as the parent field that references it (<code>helicopter.manufacturer</code> → an ObjectId) — <code>.populate("manufacturer", "manufacturer")</code> replaces the ObjectId with the populated document, so the label ends up at <code>h.manufacturer.manufacturer</code>, not a separate <code>manufacturerName</code> field (which does not exist anywhere in this schema). <code>priceUsd</code> is computed once in the controller (not in the view) so the same rounding rule is guaranteed to match what Task 3.4/3.5's add/edit form needs to redisplay.</p>`,
    `<p>Field hiển thị của sub-document manufacturer đặt tên <code>manufacturer</code> (String) — TRÙNG tên với field cha tham chiếu tới nó (<code>helicopter.manufacturer</code> → ObjectId) — <code>.populate("manufacturer", "manufacturer")</code> thay ObjectId bằng document đã populate, nên nhãn hiển thị nằm ở <code>h.manufacturer.manufacturer</code>, không phải field riêng <code>manufacturerName</code> (field này KHÔNG tồn tại ở bất cứ đâu trong schema). <code>priceUsd</code> tính 1 lần ở controller (không phải ở view) để chắc chắn cùng quy tắc làm tròn khớp với những gì form thêm/sửa ở Task 3.4/3.5 cần hiện lại.</p>`,
  ),
  rubric: [
    { id: 'login_validates_hashed_password', criterion: B('Login form checks the entered password against the bcrypt-hashed "pass" field, showing an error on failure and redirecting to the helicopter list on success.', 'Form đăng nhập kiểm đúng password nhập so field "pass" đã băm bcrypt, hiện lỗi khi sai, chuyển hướng danh sách helicopter khi đúng.'), weight: 1, maxScore: 0.5 },
    { id: 'crud_requires_auth', criterion: B('All helicopter CRUD page routes are protected by an authentication check.', 'Mọi route trang CRUD helicopter được bảo vệ bởi kiểm xác thực.'), weight: 1, maxScore: 0.4 },
    { id: 'helicopter_card_view_correct', criterion: B('Helicopter list renders as a card view (not a table), including heliName, correctly-computed USD price (price/26000 rounded to 1 decimal), imgWrapper, an adult male/child icon, and the populated manufacturer name.', 'Danh sách helicopter render dạng card (không phải bảng), gồm heliName, giá USD tính đúng (price/26000 làm tròn 1 chữ số thập phân), imgWrapper, icon nam giới/trẻ em theo adult, và tên manufacturer đã populate.'), weight: 1, maxScore: 0.6 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.3 (1.0 mark):</strong> after a successful login, allow the user to delete a selected helicopter with confirmation, and display a notification message showing the result. Route path: <code>/management/helicopters/:id</code>.</p>`,
    `<p><strong>Task 03.3 (1.0 điểm):</strong> đăng nhập thành công thì cho phép xoá helicopter đã chọn kèm xác nhận, hiện thông báo kết quả. Route: <code>/management/helicopters/:id</code>.</p>`,
  ),
  starterCode:
`// ===== controllers/page.controller.js (excerpt) =====
const deleteHelicopter = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};
module.exports.deleteHelicopter = deleteHelicopter;

// ===== views/helicopters.ejs (delete button excerpt) =====
// <form method="POST" action="/management/helicopters/<%= h._id %>?_method=DELETE"
//       onsubmit="/* ---------- Student's code starts from here ---------- */">
//   <button type="submit">Delete</button>
// </form>`,
  sampleSolution:
`// ===== controllers/page.controller.js (excerpt) =====
const deleteHelicopter = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const deleted = await Helicopter.findByIdAndDelete(req.params.id);
        req.flash = deleted
            ? { type: "success", message: \`"\${deleted.heliName}" deleted successfully.\` }
            : { type: "error", message: "Helicopter not found." };
        res.redirect("/management/helicopters");
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};
module.exports.deleteHelicopter = deleteHelicopter;

// ===== views/helicopters.ejs (delete button excerpt) =====
// <form method="POST" action="/management/helicopters/<%= h._id %>?_method=DELETE"
//       onsubmit="return confirm('Delete \\'' + '<%= h.heliName %>' + '\\'? This cannot be undone.');">
//   <button type="submit">Delete</button>
// </form>

// ===== routes/page.routes.js (relevant excerpt) =====
// const methodOverride = require("method-override");
// router.use(methodOverride("_method"));
// router.delete("/management/helicopters/:id", ensureLoggedIn, PageController.deleteHelicopter);`,
  explanation: B(
    `<p><code>method-override</code> routes the form's POST as a DELETE, matching the route path <code>/management/helicopters/:id</code> the paper specifies. The browser's <code>confirm()</code> dialog satisfies the confirmation requirement; the flash message after redirect reports success or failure — the same pattern used for resident deletion in the sibling "Residents Management System" paper in this course.</p>`,
    `<p><code>method-override</code> route POST của form thành DELETE, khớp đúng route <code>/management/helicopters/:id</code> đề nêu. Hộp thoại <code>confirm()</code> trình duyệt thoả yêu cầu xác nhận; flash message sau redirect báo kết quả — cùng mẫu đã dùng để xoá resident ở đề "Residents Management System" song song trong môn.</p>`,
  ),
  rubric: [
    { id: 'confirmation_before_delete', criterion: B('The user is asked to confirm before the helicopter is actually deleted.', 'Người dùng được hỏi xác nhận trước khi helicopter thực sự bị xoá.'), weight: 1, maxScore: 0.5 },
    { id: 'deletion_and_result_notification', criterion: B('The selected helicopter is correctly deleted, and the result is communicated to the user.', 'Helicopter đã chọn bị xoá đúng, kết quả được báo cho người dùng.'), weight: 1, maxScore: 0.5 },
  ],
};

const q5 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.4-3.5 (1.5 marks):</strong> add a new helicopter via a modal form at <code>/management/helicopters</code> (and allow viewing/updating at <code>/management/helicopters/:id</code> with the same requirements). All fields are required. <code>heliName</code> must contain at least two words, and the first letter of each word must be capitalized. <code>imgWrapper</code> must be a URL. <code>price</code> must be a number formatted with a minimum of 6 digits. <code>adult</code> must be a toggle or switch control. <code>isAssembly</code> must be a toggle or switch control — if <code>adult</code> is true, then <code>isAssembly</code> must always be true. <code>manufacturer</code> must be a select control displaying manufacturer values from the manufacturers collection.</p>`,
    `<p><strong>Task 03.4-3.5 (1.5 điểm):</strong> thêm helicopter mới bằng modal form tại <code>/management/helicopters</code> (và cho xem/sửa tại <code>/management/helicopters/:id</code> cùng yêu cầu). Mọi trường bắt buộc. <code>heliName</code> phải có ít nhất 2 từ, chữ cái đầu mỗi từ viết hoa. <code>imgWrapper</code> phải là URL. <code>price</code> phải là số định dạng tối thiểu 6 chữ số. <code>adult</code> phải là control toggle/switch. <code>isAssembly</code> phải là control toggle/switch — nếu <code>adult</code> true thì <code>isAssembly</code> luôn phải true. <code>manufacturer</code> phải là select hiện giá trị manufacturer từ bảng manufacturers.</p>`,
  ),
  starterCode:
`// ===== controllers/page.controller.js (excerpt) =====
const HELINAME_RE = /^[A-Z][a-zA-Z0-9]*(\\s[A-Z][a-zA-Z0-9]*)+$/;
const URL_RE = /^https?:\\/\\/.+/;

const validateHelicopterInput = async (body, excludeId) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const createHelicopter = async (req, res, next) => { /* uses validateHelicopterInput, then Helicopter.create */ };
const updateHelicopter = async (req, res, next) => { /* same, then Helicopter.findByIdAndUpdate */ };

module.exports.createHelicopter = createHelicopter;
module.exports.updateHelicopter = updateHelicopter;`,
  sampleSolution:
`// ===== controllers/page.controller.js (excerpt) =====
const HELINAME_RE = /^[A-Z][a-zA-Z0-9]*(\\s[A-Z][a-zA-Z0-9]*)+$/;
const URL_RE = /^https?:\\/\\/.+/;

const validateHelicopterInput = async (body, excludeId) => {
    // ---------- Student's code starts from here ----------
    const errors = [];
    const { heliName, imgWrapper, price, adult, manufacturer } = body;
    let { isAssembly } = body;

    if (!heliName || !imgWrapper || price == null || adult == null || !manufacturer) {
        errors.push("All fields are required.");
    }

    if (heliName && !HELINAME_RE.test(heliName)) {
        errors.push("heliName must contain at least two capitalized words.");
    }
    if (heliName) {
        const query = { heliName };
        if (excludeId) query._id = { \$ne: excludeId };
        const duplicate = await Helicopter.findOne(query);
        if (duplicate) errors.push("heliName must be unique.");
    }

    if (imgWrapper && !URL_RE.test(imgWrapper)) {
        errors.push("imgWrapper must be a valid URL.");
    }

    const numPrice = Number(price);
    if (Number.isNaN(numPrice) || numPrice < 100000) {
        errors.push("price must be a number with a minimum of 6 digits.");
    }

    const isAdult = adult === true || adult === "on" || adult === "true";
    // Business rule: adult=true forces isAssembly=true, regardless of what was submitted.
    if (isAdult) {
        isAssembly = true;
    }

    return { errors, normalized: { isAssembly, adult: isAdult } };
    // -------------------------------------------------------
};

const createHelicopter = async (req, res, next) => {
    try {
        const { errors, normalized } = await validateHelicopterInput(req.body, null);
        if (errors.length) {
            const manufacturers = await Manufacturer.find();
            return res.render("helicopters", { helicopters: await Helicopter.find().populate("manufacturer"), manufacturers, errors });
        }

        await Helicopter.create({
            heliName: req.body.heliName,
            imgWrapper: req.body.imgWrapper,
            price: Number(req.body.price),
            adult: normalized.adult,
            isAssembly: normalized.isAssembly,
            manufacturer: req.body.manufacturer,
        });
        res.redirect("/management/helicopters");
    } catch (error) {
        next(error);
    }
};

const updateHelicopter = async (req, res, next) => {
    try {
        const { errors, normalized } = await validateHelicopterInput(req.body, req.params.id);
        if (errors.length) {
            const manufacturers = await Manufacturer.find();
            return res.render("helicopters", { helicopters: await Helicopter.find().populate("manufacturer"), manufacturers, errors });
        }

        await Helicopter.findByIdAndUpdate(req.params.id, {
            heliName: req.body.heliName,
            imgWrapper: req.body.imgWrapper,
            price: Number(req.body.price),
            adult: normalized.adult,
            isAssembly: normalized.isAssembly,
            manufacturer: req.body.manufacturer,
        }, { runValidators: true });
        res.redirect("/management/helicopters");
    } catch (error) {
        next(error);
    }
};

module.exports.createHelicopter = createHelicopter;
module.exports.updateHelicopter = updateHelicopter;

// ===== views/helicopters.ejs (add/edit modal form excerpt) =====
// <form method="POST" action="/management/helicopters">
//   <input name="heliName" required />
//   <input name="imgWrapper" type="url" required />
//   <input name="price" type="number" min="100000" required />
//   <input name="adult" type="checkbox" role="switch"
//          onchange="document.getElementById('isAssembly').checked = this.checked || document.getElementById('isAssembly').checked;
//                    document.getElementById('isAssembly').disabled = this.checked;" />
//   <input id="isAssembly" name="isAssembly" type="checkbox" role="switch" />
//   <select name="manufacturer" required>
//     <% manufacturers.forEach(function(m) { %>
//       <option value="<%= m._id %>"><%= m.manufacturer %></option>
//     <% }); %>
//   </select>
//   <button type="submit">Save</button>
// </form>`,
  explanation: B(
    `<p><b>Two mismatches between the paper's prose and its own schema, resolved explicitly</b>: (1) the manufacturer select must read the option label from the schema's real <code>manufacturer</code> field (<code>m.manufacturer</code>) — there is no <code>manufacturerName</code> field anywhere in this system, despite the paper's Task 3.4 wording calling it that; (2) the <code>adult</code>⇒<code>isAssembly</code> rule is enforced on BOTH sides deliberately — the view disables/checks the <code>isAssembly</code> switch the moment <code>adult</code> is turned on (so a user physically cannot submit the invalid combination through the UI), and <code>validateHelicopterInput</code> ALSO force-sets <code>isAssembly=true</code> server-side whenever <code>adult</code> is true, so a request that bypasses the UI (e.g. a raw form POST) still cannot produce <code>{adult:true, isAssembly:false}</code> in the database.</p>`,
    `<p><b>2 điểm lệch giữa câu chữ đề và schema thật, đã xử lý rõ ràng</b>: (1) select manufacturer phải đọc nhãn từ field <code>manufacturer</code> thật của schema (<code>m.manufacturer</code>) — KHÔNG có field <code>manufacturerName</code> nào trong toàn hệ thống, dù câu chữ Task 3.4 gọi tên vậy; (2) quy tắc <code>adult</code>⇒<code>isAssembly</code> được ép ở CẢ HAI phía có chủ đích — view tự tick/khoá switch <code>isAssembly</code> ngay khi <code>adult</code> bật (người dùng không thể vật lý gửi tổ hợp sai qua UI), và <code>validateHelicopterInput</code> CŨNG ép <code>isAssembly=true</code> phía server bất cứ khi nào <code>adult</code> true, nên request nào lách qua UI (VD POST form thô) vẫn không thể tạo ra <code>{adult:true, isAssembly:false}</code> trong database.</p>`,
  ),
  rubric: [
    { id: 'all_fields_required', criterion: B('All fields are validated as required in both add and edit flows.', 'Mọi trường được kiểm bắt buộc ở cả luồng thêm và sửa.'), weight: 1, maxScore: 0.2 },
    { id: 'heliname_pattern_and_unique', criterion: B('heliName is validated to contain at least two capitalized words, and checked for uniqueness (excluding the helicopter being edited, for updates).', 'heliName kiểm đúng có ít nhất 2 từ viết hoa chữ đầu, và kiểm duy nhất (loại trừ chính helicopter đang sửa, cho update).'), weight: 1, maxScore: 0.3 },
    { id: 'imgwrapper_url_and_price_digits', criterion: B('imgWrapper is validated as a URL, and price is validated as a number with a minimum of 6 digits.', 'imgWrapper kiểm đúng là URL, và price kiểm đúng là số tối thiểu 6 chữ số.'), weight: 1, maxScore: 0.3 },
    { id: 'adult_forces_isassembly', criterion: B('When adult is true, isAssembly is correctly forced/validated to true, both in the UI and server-side.', 'Khi adult true, isAssembly được ép/kiểm đúng thành true, cả ở UI lẫn phía server.'), weight: 1, maxScore: 0.4 },
    { id: 'toggle_controls_and_manufacturer_select', criterion: B('adult and isAssembly use toggle/switch controls, and manufacturer is a select populated with the real "manufacturer" field values (not a non-existent "manufacturerName").', 'adult và isAssembly dùng control toggle/switch, manufacturer là select lấy đúng giá trị field "manufacturer" thật (không phải "manufacturerName" không tồn tại).'), weight: 1, maxScore: 0.3 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE16',
    title: 'SDN302 – Practical Exam (Summer 2026), Helicopter Management System|||SDN302 – Thi thực hành (Summer 2026), Hệ thống quản lý trực thăng',
    description: 'SDN302 PE (CODE): JWT-authenticated REST API for manufacturers (with a referential delete guard) plus a server-rendered EJS client for helicopter CRUD with a cross-field adult/isAssembly business rule, AI-graded.|||PE SDN302 (viết mã): REST API xác thực JWT cho manufacturer (kèm chốt xoá tham chiếu) cộng client render server EJS cho CRUD helicopter với quy tắc nghiệp vụ liên trường adult/isAssembly, chấm AI.',
    durationMinutes: 85,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4, q5],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
