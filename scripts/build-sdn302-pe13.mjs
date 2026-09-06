/**
 * build-sdn302-pe13.mjs — sinh content/exams/SDN302-PE13.mjs.
 *
 * Nguồn thật: "SDN302 - SU 2025 - PE" (mã đợt SU25_PE_20250801) —
 * Residents Management System (apartment/resident/account). Có 3 file
 * JSON seed + 1 Note.docx tham khảo (mẫu code hash/verify JWT, không
 * phải solution đầy đủ) — đã đọc kỹ xác nhận account dùng field us/pw
 * (pw đã băm bcrypt sẵn trong seed).
 *
 * ⚠️ yOB (năm sinh) có hướng quy đổi NGƯỢC với các đề trước: form
 * thêm/sửa NHẬP/HIỂN THỊ tuổi (1-85), "tự động quy đổi sang năm sinh
 * KHI LƯU" — quy đổi 1 CHIỀU rõ ràng (tuổi→yOB lúc ghi), và khi MỞ
 * form sửa phải quy đổi NGƯỢC (yOB→tuổi) để hiện đúng giá trị đang sửa,
 * không phải chỉ 1 chiều như câu chữ đề dễ khiến hiểu lầm.
 *
 * Điểm gốc: Task 1=1.0, Task 2=5.0, Task 3=4.0 — tách 5 câu CODE:
 * Task1(1.0); Task2(5.0, JWT+CRUD+chốt xoá referential); Task3 tách 3
 * câu (đăng nhập+danh sách=1.5, xoá=1.0, thêm/sửa=1.5).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE13.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE13.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given Mongoose schema (3 collections — an apartment complex has many residents, each resident belongs to one apartment):</b>` +
  `<pre><code class="language-javascript">apartment({
    apartmentName: {type: String, required: true, unique: true},
    totalOfFloors: { type: Number, required: true },
}, { timestamps: true });

resident({
    residentName: { type: String, required: true, unique: true },
    residentDescription: { type: String, required: true },
    floor: {type: Number, required: true, min: 1, max: 40},
    yOB: {type: Number, required: true, min: 1940, max: 2025},
    isOwned: {type: Boolean, default: false},
    apartment: {type: mongoose.Schema.Types.ObjectId, ref: "apartment", required: true},
}, { timestamps: true });

account({
    us: { type: String, required: true },
    pw: { type: String, required: true },
}, { timestamps: true });</code></pre></div>`,
  `<div class="pe-system"><b>Schema Mongoose đề cho (3 bảng — 1 chung cư có nhiều resident, mỗi resident thuộc 1 apartment):</b>` +
  `<pre><code class="language-javascript">apartment({
    apartmentName: {type: String, required: true, unique: true},
    totalOfFloors: { type: Number, required: true },
}, { timestamps: true });

resident({
    residentName: { type: String, required: true, unique: true },
    residentDescription: { type: String, required: true },
    floor: {type: Number, required: true, min: 1, max: 40},
    yOB: {type: Number, required: true, min: 1940, max: 2025},
    isOwned: {type: Boolean, default: false},
    apartment: {type: mongoose.Schema.Types.ObjectId, ref: "apartment", required: true},
}, { timestamps: true });

account({
    us: { type: String, required: true },
    pw: { type: String, required: true },
}, { timestamps: true });</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Summer 2025) — Residents Management System</strong>. An apartment complex has many residents; each resident belongs to one apartment. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Summer 2025) — Hệ thống quản lý cư dân</strong>. 1 chung cư có nhiều resident; mỗi resident thuộc 1 apartment. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 01 (1.0 mark):</strong> use the Express generator to develop the REST API server, create the related apartments, and migrate them to a database named <code>SDN302_PE_SU25_StudentCodeDB</code>.</p>`,
    `<p><strong>Task 01 (1.0 điểm):</strong> dùng Express generator dựng REST API server, tạo các apartment liên quan, và nạp vào database tên <code>SDN302_PE_SU25_StudentCodeDB</code>.</p>`,
  ),
  starterCode:
`// ===== models/apartment.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ApartmentSchema = new Schema({
    apartmentName: { type: String, required: true, unique: true },
    totalOfFloors: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("apartment", ApartmentSchema);

// ===== models/resident.model.js =====
const ResidentSchema = new Schema({
    residentName: { type: String, required: true, unique: true },
    residentDescription: { type: String, required: true },
    floor: { type: Number, required: true, min: 1, max: 40 },
    yOB: { type: Number, required: true, min: 1940, max: 2025 },
    isOwned: { type: Boolean, default: false },
    apartment: { type: Schema.Types.ObjectId, ref: "apartment", required: true },
}, { timestamps: true });

module.exports = mongoose.model("resident", ResidentSchema);

// ===== models/account.model.js =====
const AccountSchema = new Schema({
    us: { type: String, required: true },
    pw: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("account", AccountSchema);`,
  sampleSolution:
`// ===== models/apartment.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ApartmentSchema = new Schema({
    apartmentName: { type: String, required: true, unique: true },
    totalOfFloors: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model("apartment", ApartmentSchema);

// ===== models/resident.model.js =====
const ResidentSchema = new Schema({
    residentName: { type: String, required: true, unique: true },
    residentDescription: { type: String, required: true },
    floor: { type: Number, required: true, min: 1, max: 40 },
    yOB: { type: Number, required: true, min: 1940, max: 2025 },
    isOwned: { type: Boolean, default: false },
    apartment: { type: Schema.Types.ObjectId, ref: "apartment", required: true },
}, { timestamps: true });

module.exports = mongoose.model("resident", ResidentSchema);

// ===== models/account.model.js =====
const AccountSchema = new Schema({
    us: { type: String, required: true },
    pw: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("account", AccountSchema);`,
  explanation: B(
    `<p>Field names follow the paper's schema exactly, including the short <code>us</code>/<code>pw</code> account fields (not "username"/"password") and <code>yOB</code> (not "yearOfBirth") — these are given verbatim, not typos to normalize.</p>`,
    `<p>Tên field theo đúng schema đề cho, kể cả field ngắn <code>us</code>/<code>pw</code> của account (không phải "username"/"password") và <code>yOB</code> (không phải "yearOfBirth") — được đề ghi nguyên văn, không phải lỗi gõ cần chuẩn hoá.</p>`,
  ),
  rubric: [
    { id: 'express_generator_structure', criterion: B('Project follows the standard Express-generator structure.', 'Dự án theo đúng cấu trúc Express-generator chuẩn.'), weight: 1, maxScore: 0.3 },
    { id: 'apartment_schema_matches', criterion: B('Apartment model matches the given schema exactly (apartmentName unique+required, totalOfFloors required).', 'Model Apartment khớp đúng schema đề cho (apartmentName unique+required, totalOfFloors required).'), weight: 1, maxScore: 0.3 },
    { id: 'migrated_to_correct_db', criterion: B('Data is correctly migrated into a database literally named SDN302_PE_SU25_StudentCodeDB.', 'Dữ liệu nạp đúng vào database tên đúng SDN302_PE_SU25_StudentCodeDB.'), weight: 1, maxScore: 0.4 },
  ],
};

const q2 = {
  kind: 'CODE', points: 5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 02 (5.0 marks):</strong> create a REST API server for the apartment collection, using JWT for authenticating API requests. The JWT secret key must be your <code>StudentCode!!</code> (e.g. <code>se171234!!</code>) and stored in the .env file. Route paths: <code>/auth/login</code> for generating the JWT; <code>/api/apartments</code> and <code>/api/apartments/:id</code> for all CRUD methods related to apartments. For DELETE, an apartment must not be deleted while any residents are associated with it — return an appropriate error message (e.g., "Cannot delete apartment because it has associated residents") if deletion is attempted in such cases.</p>`,
    `<p><strong>Task 02 (5.0 điểm):</strong> xây REST API cho bảng apartment, dùng JWT xác thực request. Secret key JWT phải là <code>StudentCode!!</code> (VD <code>se171234!!</code>) lưu trong .env. Route: <code>/auth/login</code> sinh JWT; <code>/api/apartments</code> và <code>/api/apartments/:id</code> cho mọi CRUD apartment. Với DELETE, apartment không được xoá khi còn resident liên kết — trả lỗi phù hợp (VD "Cannot delete apartment because it has associated residents") nếu cố xoá trong trường hợp đó.</p>`,
  ),
  starterCode:
`// ===== controllers/auth.controller.js =====
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const Account = db.account;

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { login };

// ===== middlewares/auth.middleware.js =====
const authenticateToken = (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = authenticateToken;

// ===== controllers/apartment.controller.js =====
const Apartment = db.apartment;
const Resident = db.resident;

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
const Account = db.account;

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { us, pw } = req.body;

        const account = await Account.findOne({ us });
        if (!account) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(pw, account.pw);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ accountID: account._id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });
        res.json({ token });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { login };

// ===== middlewares/auth.middleware.js =====
const jwt2 = require("jsonwebtoken");
const db2 = require("../models/index");
const Account2 = db2.account;

const authenticateToken = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "No token provided" });

        const decoded = jwt2.verify(token, process.env.JWT_SECRET);
        const account = await Account2.findById(decoded.accountID);
        if (!account) return res.status(401).json({ message: "Account not found" });

        req.user = account;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
    // -------------------------------------------------------
};

module.exports = authenticateToken;

// ===== controllers/apartment.controller.js =====
const db3 = require("../models/index");
const Apartment = db3.apartment;
const Resident = db3.resident;

const findAll = async (req, res, next) => {
    try {
        res.json(await Apartment.find());
    } catch (error) { next(error); }
};

const findOne = async (req, res, next) => {
    try {
        const apartment = await Apartment.findById(req.params.id);
        if (!apartment) return res.status(404).json({ message: "Apartment not found" });
        res.json(apartment);
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const { apartmentName, totalOfFloors } = req.body;
        if (!apartmentName || typeof apartmentName !== "string" || !apartmentName.trim()) {
            return res.status(400).json({ message: "apartmentName is required and must be a non-empty string" });
        }
        const existing = await Apartment.findOne({ apartmentName: apartmentName.trim() });
        if (existing) {
            return res.status(400).json({ message: "apartmentName must be unique" });
        }
        const apartment = await Apartment.create({ apartmentName: apartmentName.trim(), totalOfFloors });
        res.status(201).json(apartment);
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const { apartmentName, totalOfFloors } = req.body;
        const apartment = await Apartment.findById(req.params.id);
        if (!apartment) return res.status(404).json({ message: "Apartment not found" });

        if (apartmentName !== undefined) {
            if (typeof apartmentName !== "string" || !apartmentName.trim()) {
                return res.status(400).json({ message: "apartmentName must be a non-empty string" });
            }
            const duplicate = await Apartment.findOne({ apartmentName: apartmentName.trim(), _id: { \$ne: req.params.id } });
            if (duplicate) return res.status(400).json({ message: "apartmentName must be unique" });
            apartment.apartmentName = apartmentName.trim();
        }
        if (totalOfFloors !== undefined) apartment.totalOfFloors = totalOfFloors;

        await apartment.save();
        res.json(apartment);
    } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { id } = req.params;

        const hasResidents = await Resident.exists({ apartment: id });
        if (hasResidents) {
            return res.status(400).json({
                message: "Cannot delete apartment because it has associated residents",
            });
        }

        const deleted = await Apartment.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Apartment not found" });

        res.json({ message: "Apartment deleted successfully" });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { findAll, findOne, create, update, remove };`,
  explanation: B(
    `<p><code>login</code> reads the paper's own field names (<code>us</code>/<code>pw</code>), compares <code>pw</code> against the bcrypt-hashed value with <code>bcrypt.compare()</code>, and signs a JWT with payload <code>{ accountID: account._id }</code> — matching exactly the reference verify-middleware snippet given in this exam's own Note.docx, which reads <code>decoded.accountID</code> (not <code>decoded.id</code> as other exams in this course use). The DELETE guard mirrors the same referential-integrity pattern used elsewhere in this course (nation/food, brand/pen), adapted to apartment/resident.</p>`,
    `<p><code>login</code> đọc đúng tên field đề cho (<code>us</code>/<code>pw</code>), so <code>pw</code> với giá trị đã băm bcrypt bằng <code>bcrypt.compare()</code>, ký JWT với payload <code>{ accountID: account._id }</code> — khớp đúng đoạn middleware verify tham khảo trong chính Note.docx của đề này, đọc <code>decoded.accountID</code> (không phải <code>decoded.id</code> như các đề khác môn này dùng). Chốt DELETE theo đúng mẫu toàn vẹn tham chiếu dùng ở nơi khác trong môn (nation/food, brand/pen), chuyển sang apartment/resident.</p>`,
  ),
  rubric: [
    { id: 'login_generates_jwt', criterion: B('POST /auth/login validates credentials against the bcrypt-hashed pw field and returns a valid JWT signed with the StudentCode!! secret.', 'POST /auth/login kiểm đúng thông tin so pw đã băm bcrypt, trả JWT hợp lệ ký bằng secret StudentCode!!.'), weight: 1, maxScore: 1 },
    { id: 'jwt_middleware_protects_routes', criterion: B('All apartment CRUD routes require a valid JWT via an auth middleware.', 'Mọi route CRUD apartment yêu cầu JWT hợp lệ qua middleware xác thực.'), weight: 1, maxScore: 1 },
    { id: 'crud_implemented', criterion: B('All CRUD operations are correctly implemented for the apartment collection.', 'Đủ mọi thao tác CRUD triển khai đúng cho bảng apartment.'), weight: 1, maxScore: 1.5 },
    { id: 'delete_referential_guard', criterion: B('DELETE checks for any resident referencing the apartment before deleting, returning the appropriate message when residents exist.', 'DELETE kiểm đúng có resident nào tham chiếu apartment trước khi xoá, trả thông điệp phù hợp khi còn resident.'), weight: 1, maxScore: 1.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.1-3.2 (1.5 marks):</strong> client application for resident management (EJS/Handlebars/Pug + Express). <b>Authentication:</b> at the login view (<code>auth/signin</code>), users enter the correct account name (us) and password (pw) (encrypted with bcrypt, stored in the 'accounts' collection). All CRUD actions require authentication. Show error messages for failed logins. Store account data from account.json into the 'accounts' collection. Redirect to the residents view after a successful login. <b>Resident list:</b> display all residents (using a <b>card view</b>, not a table view) including the apartment name, at route <code>/view/residents</code>.</p>`,
    `<p><strong>Task 03.1-3.2 (1.5 điểm):</strong> app client quản lý cư dân (EJS/Handlebars/Pug + Express). <b>Xác thực:</b> tại view đăng nhập (<code>auth/signin</code>), nhập đúng account name (us) và password (pw) (băm bcrypt, lưu bảng 'accounts'). Mọi CRUD cần xác thực. Hiện lỗi khi đăng nhập sai. Lưu dữ liệu account.json vào bảng 'accounts'. Đăng nhập thành công chuyển hướng danh sách cư dân. <b>Danh sách cư dân:</b> hiện tất cả cư dân dạng <b>card view</b> (không phải bảng), gồm tên apartment, tại route <code>/view/residents</code>.</p>`,
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
const Account = db.account;
const Resident = db.resident;

const showLogin = (req, res) => res.render("signin", { error: null });

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const listResidents = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { showLogin, login, listResidents };`,
  sampleSolution:
`// ===== middlewares/pageAuth.middleware.js =====
const ensureLoggedIn = (req, res, next) => {
    // ---------- Student's code starts from here ----------
    if (!req.session.accountId) {
        return res.redirect("/auth/signin");
    }
    next();
    // -------------------------------------------------------
};
module.exports = ensureLoggedIn;

// ===== controllers/page.controller.js =====
const bcrypt = require("bcrypt");
const db = require("../models/index");
const Account = db.account;
const Resident = db.resident;

const showLogin = (req, res) => res.render("signin", { error: null });

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { us, pw } = req.body;
        const account = await Account.findOne({ us });
        const isMatch = account ? await bcrypt.compare(pw, account.pw) : false;

        if (!account || !isMatch) {
            return res.render("signin", { error: "Invalid account name or password." });
        }

        req.session.accountId = account._id;
        res.redirect("/view/residents");
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

const listResidents = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const residents = await Resident.find().populate("apartment", "apartmentName").lean();
        res.render("residents", { residents });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { showLogin, login, listResidents };

// ===== views/residents.ejs (card view excerpt) =====
// <% residents.forEach(function(resident) { %>
//   <div class="resident-card">
//     <h3><%= resident.residentName %></h3>
//     <p>Floor: <%= resident.floor %></p>
//     <p>Owned: <%= resident.isOwned ? 'Yes' : 'No' %></p>
//     <p>Apartment: <%= resident.apartment ? resident.apartment.apartmentName : '' %></p>
//   </div>
// <% }); %>`,
  explanation: B(
    `<p>Login reads <code>us</code>/<code>pw</code> — the exact field names from the schema — and always uses <code>bcrypt.compare()</code> against the hashed <code>pw</code>, the same field/hash Task 2's <code>/auth/login</code> checks. The card view populates only <code>apartmentName</code>, matching "display all residents ... including the apartment name."</p>`,
    `<p>Đăng nhập đọc <code>us</code>/<code>pw</code> — đúng tên field schema — và luôn dùng <code>bcrypt.compare()</code> so <code>pw</code> đã băm, cùng field/hash mà <code>/auth/login</code> Task 2 kiểm. Card view populate chỉ <code>apartmentName</code>, khớp "hiện mọi cư dân... gồm tên apartment."</p>`,
  ),
  rubric: [
    { id: 'login_validates_hashed_password', criterion: B('Login form checks the entered password against the bcrypt-hashed "pw" field (not a plaintext comparison), using the correct field names (us/pw), showing an error on failure and redirecting to the residents view on success.', 'Form đăng nhập kiểm đúng password nhập so field "pw" đã băm bcrypt (không so chuỗi thô), dùng đúng tên field (us/pw), hiện lỗi khi sai, chuyển hướng danh sách cư dân khi đúng.'), weight: 1, maxScore: 0.5 },
    { id: 'crud_requires_auth', criterion: B('All resident CRUD page routes are protected by an authentication check.', 'Mọi route trang CRUD resident được bảo vệ bởi kiểm xác thực.'), weight: 1, maxScore: 0.4 },
    { id: 'residents_card_view_correct', criterion: B('Residents list renders as a card view (not a table), including the populated apartment name.', 'Danh sách resident render dạng card (không phải bảng), có tên apartment đã populate.'), weight: 1, maxScore: 0.6 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.3 (1.0 mark):</strong> after a successful login, allow deleting a selected resident by confirming the action and notifying the result.</p>`,
    `<p><strong>Task 03.3 (1.0 điểm):</strong> đăng nhập thành công thì cho phép xoá resident đã chọn kèm xác nhận hành động và thông báo kết quả.</p>`,
  ),
  starterCode:
`// ===== controllers/page.controller.js (excerpt) =====
const deleteResident = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};
module.exports.deleteResident = deleteResident;

// ===== views/residents.ejs (delete button excerpt) =====
// <form method="POST" action="/view/residents/<%= resident._id %>?_method=DELETE"
//       onsubmit="/* ---------- Student's code starts from here ---------- */">
//   <button type="submit">Delete</button>
// </form>`,
  sampleSolution:
`// ===== controllers/page.controller.js (excerpt) =====
const deleteResident = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const deleted = await Resident.findByIdAndDelete(req.params.id);
        req.flash = deleted
            ? { type: "success", message: \`"\${deleted.residentName}" deleted successfully.\` }
            : { type: "error", message: "Resident not found." };
        res.redirect("/view/residents");
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};
module.exports.deleteResident = deleteResident;

// ===== views/residents.ejs (delete button excerpt) =====
// <form method="POST" action="/view/residents/<%= resident._id %>?_method=DELETE"
//       onsubmit="return confirm('Delete \\'' + '<%= resident.residentName %>' + '\\'? This cannot be undone.');">
//   <button type="submit">Delete</button>
// </form>

// ===== routes/page.routes.js (relevant excerpt) =====
// const methodOverride = require("method-override");
// router.use(methodOverride("_method"));
// router.delete("/view/residents/:id", ensureLoggedIn, PageController.deleteResident);`,
  explanation: B(
    `<p><code>method-override</code> routes the form's POST as a DELETE. The browser's <code>confirm()</code> dialog satisfies the confirmation requirement; the flash message after redirect reports success or failure.</p>`,
    `<p><code>method-override</code> route POST của form thành DELETE. Hộp thoại <code>confirm()</code> trình duyệt thoả yêu cầu xác nhận; flash message sau redirect báo kết quả thành công hay thất bại.</p>`,
  ),
  rubric: [
    { id: 'confirmation_before_delete', criterion: B('The user is asked to confirm before the resident is actually deleted.', 'Người dùng được hỏi xác nhận trước khi resident thực sự bị xoá.'), weight: 1, maxScore: 0.5 },
    { id: 'deletion_and_result_notification', criterion: B('The selected resident is correctly deleted, and the result is communicated to the user.', 'Resident đã chọn bị xoá đúng, kết quả được báo cho người dùng.'), weight: 1, maxScore: 0.5 },
  ],
};

const q5 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.4-3.5 (1.5 marks):</strong> add a new resident via a modal form at <code>/view/residents</code> (and allow updating at <code>/view/residents/:id</code> with the same requirements). All fields are required. <code>residentName</code> includes only letters (a-z, A-Z) and space, and must be unique. <code>floor</code> must be a number between 1 and 40. <code>yOB</code> is entered and displayed as an age (1 to 85) and automatically converted to the year of birth when saved. <code>isOwned</code> must be a toggle/switch control. <code>apartment</code> must be a select control, options displaying apartmentName values from the apartment collection.</p>`,
    `<p><strong>Task 03.4-3.5 (1.5 điểm):</strong> thêm resident mới bằng modal form tại <code>/view/residents</code> (và cho sửa tại <code>/view/residents/:id</code> cùng yêu cầu). Mọi trường bắt buộc. <code>residentName</code> chỉ gồm chữ cái (a-z, A-Z) và khoảng trắng, phải duy nhất. <code>floor</code> là số 1-40. <code>yOB</code> nhập/hiện dạng tuổi (1-85), tự động quy đổi thành năm sinh khi lưu. <code>isOwned</code> phải là toggle/switch. <code>apartment</code> phải là select hiện apartmentName từ bảng apartment.</p>`,
  ),
  starterCode:
`// ===== controllers/page.controller.js (excerpt) =====
const RESIDENTNAME_RE = /^[a-zA-Z\\s]+$/;

const validateResidentInput = async (body, excludeId) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const createResident = async (req, res, next) => { /* uses validateResidentInput, converts age->yOB, then Resident.create */ };
const updateResident = async (req, res, next) => { /* same, then Resident.findByIdAndUpdate */ };
const showEditForm = async (req, res, next) => { /* must reverse-convert yOB->age for pre-fill */ };

module.exports.createResident = createResident;
module.exports.updateResident = updateResident;
module.exports.showEditForm = showEditForm;`,
  sampleSolution:
`// ===== controllers/page.controller.js (excerpt) =====
const RESIDENTNAME_RE = /^[a-zA-Z\\s]+$/;

const validateResidentInput = async (body, excludeId) => {
    // ---------- Student's code starts from here ----------
    const errors = [];
    const { residentName, residentDescription, floor, age, isOwned, apartment } = body;

    if (!residentName || !residentDescription || floor == null || age == null || !apartment) {
        errors.push("All fields are required.");
    }
    if (residentName && !RESIDENTNAME_RE.test(residentName)) {
        errors.push("residentName can only contain letters and spaces.");
    }
    if (residentName) {
        const query = { residentName };
        if (excludeId) query._id = { \$ne: excludeId };
        const duplicate = await Resident.findOne(query);
        if (duplicate) errors.push("residentName must be unique.");
    }

    const numFloor = Number(floor);
    if (Number.isNaN(numFloor) || numFloor < 1 || numFloor > 40) {
        errors.push("floor must be a number between 1 and 40.");
    }

    const numAge = Number(age);
    if (Number.isNaN(numAge) || numAge < 1 || numAge > 85) {
        errors.push("age must be a number between 1 and 85.");
    }

    return errors;
    // -------------------------------------------------------
};

const createResident = async (req, res, next) => {
    try {
        const errors = await validateResidentInput(req.body, null);
        if (errors.length) {
            const apartments = await Apartment.find();
            return res.render("residents", { residents: await Resident.find().populate("apartment"), apartments, errors });
        }

        const currentYear = new Date().getFullYear();
        await Resident.create({
            residentName: req.body.residentName,
            residentDescription: req.body.residentDescription,
            floor: Number(req.body.floor),
            yOB: currentYear - Number(req.body.age), // age (form) -> yOB (schema)
            isOwned: req.body.isOwned === "on" || req.body.isOwned === true,
            apartment: req.body.apartment,
        });
        res.redirect("/view/residents");
    } catch (error) {
        next(error);
    }
};

const updateResident = async (req, res, next) => {
    try {
        const errors = await validateResidentInput(req.body, req.params.id);
        if (errors.length) {
            const apartments = await Apartment.find();
            return res.render("residents", { residents: await Resident.find().populate("apartment"), apartments, errors });
        }

        const currentYear = new Date().getFullYear();
        await Resident.findByIdAndUpdate(req.params.id, {
            residentName: req.body.residentName,
            residentDescription: req.body.residentDescription,
            floor: Number(req.body.floor),
            yOB: currentYear - Number(req.body.age),
            isOwned: req.body.isOwned === "on" || req.body.isOwned === true,
            apartment: req.body.apartment,
        }, { runValidators: true });
        res.redirect("/view/residents");
    } catch (error) {
        next(error);
    }
};

// Pre-fills the edit modal: must reverse the same conversion (yOB -> age)
// so the form shows the resident's current AGE, not their raw stored yOB.
const showEditForm = async (req, res, next) => {
    try {
        const resident = await Resident.findById(req.params.id).lean();
        if (!resident) return res.redirect("/view/residents");

        const currentYear = new Date().getFullYear();
        const residentForForm = { ...resident, age: currentYear - resident.yOB };

        const apartments = await Apartment.find();
        res.render("residents", { editing: residentForForm, apartments, errors: [] });
    } catch (error) {
        next(error);
    }
};

module.exports.createResident = createResident;
module.exports.updateResident = updateResident;
module.exports.showEditForm = showEditForm;

// ===== views/residents.ejs (add/edit modal form excerpt) =====
// <form method="POST" action="/view/residents">
//   <input name="residentName" pattern="[a-zA-Z\\s]+" required />
//   <textarea name="residentDescription" required></textarea>
//   <input name="floor" type="number" min="1" max="40" required />
//   <input name="age" type="number" min="1" max="85" required
//          value="<%= typeof editing !== 'undefined' ? editing.age : '' %>" />
//   <input name="isOwned" type="checkbox" role="switch" />
//   <select name="apartment" required>
//     <% apartments.forEach(function(a) { %>
//       <option value="<%= a._id %>"><%= a.apartmentName %></option>
//     <% }); %>
//   </select>
//   <button type="submit">Save</button>
// </form>`,
  explanation: B(
    `<p><b>The conversion runs in BOTH directions, not just the one the paper's wording emphasizes</b>: the form field is named <code>age</code> (distinct from the schema's <code>yOB</code>) and only converts to <code>yOB = currentYear - age</code> at the moment of saving — that half is explicit in the paper ("automatically converted to the year of birth when saved"). But editing an EXISTING resident requires the REVERSE conversion first (<code>age = currentYear - resident.yOB</code>) just to pre-fill the form with the correct age value; skipping this half — e.g. showing the raw <code>yOB</code> number in an input labeled/validated as "age 1-85" — would silently break for any real resident (a yOB like 1990 is nowhere near a valid 1-85 age) even though the paper's own wording only spells out the save-time direction.</p>`,
    `<p><b>Quy đổi chạy CẢ 2 CHIỀU, không chỉ chiều câu chữ đề nhấn mạnh</b>: field form đặt tên <code>age</code> (khác <code>yOB</code> của schema) và chỉ quy đổi thành <code>yOB = currentYear - age</code> đúng lúc lưu — nửa đó đề nói rõ ("tự động quy đổi thành năm sinh khi lưu"). Nhưng sửa 1 resident CÓ SẴN cần quy đổi NGƯỢC trước (<code>age = currentYear - resident.yOB</code>) chỉ để hiện đúng giá trị tuổi vào form. Bỏ qua nửa này — VD hiện thẳng số <code>yOB</code> thô vào input gắn nhãn/kiểm "tuổi 1-85" — sẽ âm thầm hỏng với bất kỳ resident thật nào (yOB như 1990 không hề gần khoảng tuổi hợp lệ 1-85) dù câu chữ đề chỉ nói rõ chiều lúc lưu.</p>`,
  ),
  rubric: [
    { id: 'all_fields_required', criterion: B('All fields are validated as required in both add and edit flows.', 'Mọi trường được kiểm bắt buộc ở cả luồng thêm và sửa.'), weight: 1, maxScore: 0.2 },
    { id: 'residentname_pattern_and_unique', criterion: B('residentName is validated to contain only letters and spaces, and checked for uniqueness (excluding the resident being edited, for updates).', 'residentName kiểm đúng chỉ chữ cái và khoảng trắng, và kiểm duy nhất (loại trừ chính resident đang sửa, cho update).'), weight: 1, maxScore: 0.3 },
    { id: 'floor_range', criterion: B('floor is validated as a number between 1 and 40.', 'floor kiểm đúng là số trong khoảng 1-40.'), weight: 1, maxScore: 0.2 },
    { id: 'age_to_yob_conversion_on_save', criterion: B('The form collects age (1-85) and correctly converts it to yOB only at the point of saving to the database.', 'Form thu thập tuổi (1-85) và quy đổi đúng thành yOB CHỈ tại điểm lưu database.'), weight: 1, maxScore: 0.4 },
    { id: 'yob_to_age_conversion_on_edit_load', criterion: B('When loading the edit form for an existing resident, the stored yOB is correctly reverse-converted back to age for pre-filling the form field.', 'Khi tải form sửa cho resident có sẵn, yOB đã lưu được quy đổi ngược đúng thành tuổi để điền sẵn vào field form.'), weight: 1, maxScore: 0.3 },
    { id: 'isowned_toggle_and_apartment_select', criterion: B('isOwned uses a toggle/switch control, and apartment is a select populated with real apartmentName options.', 'isOwned dùng control toggle/switch, apartment là select lấy option apartmentName thật.'), weight: 1, maxScore: 0.1 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE13',
    title: 'SDN302 – Practical Exam (Summer 2025), Residents Management System|||SDN302 – Thi thực hành (Summer 2025), Hệ thống quản lý cư dân',
    description: 'SDN302 PE (CODE): JWT-authenticated REST API for apartments (with a referential delete guard) plus a server-rendered EJS client for resident CRUD with bidirectional age/year-of-birth conversion, AI-graded.|||PE SDN302 (viết mã): REST API xác thực JWT cho apartment (kèm chốt xoá tham chiếu) cộng client render server EJS cho CRUD resident với quy đổi 2 chiều tuổi/năm sinh, chấm AI.',
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
