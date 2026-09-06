/**
 * build-sdn302-pe9.mjs — sinh content/exams/SDN302-PE9.mjs.
 *
 * Nguồn thật: "SDN302 - SP 2025 - PE" (mã đề PE_SDN302_SP25_20250302) —
 * Device Management System (model/device/user, JWT + client EJS).
 *
 * ⚠️ CÓ solution.rar là bài nộp THẬT của 1 sinh viên (mã SE171566) —
 * đã đọc kỹ và phát hiện NHIỀU LỖI THẬT, không dùng làm cơ sở mù:
 *   1. `models/model.js` dùng SAI TÊN FIELD (`categoryName`/
 *      `categoryDescription`) thay vì đúng `modelName`/`modelDescription`
 *      theo schema CHÍNH đề cho.
 *   2. File `views/devices/add.ejs` chứa NHẦM nội dung của `edit.ejs`
 *      (tiêu đề "Edit Device", form POST tới `/devices/edit/:id`, dùng
 *      biến `device` không tồn tại) — route GET /devices/add lại KHÔNG
 *      truyền biến `device` khi render → trang Add sẽ crash lỗi EJS
 *      "device is not defined" trên thực tế.
 *   3. **saleOff lệch đơn vị giữa các file, và sai ở route thật**: schema
 *      DB lưu saleOff dạng PHÂN SỐ (0-1, đúng `max:1` trong bảng schema
 *      đề cho), nhưng yêu cầu client (Task 3.4) nói rõ "saleOff phải là
 *      số 0-100 (đơn vị %)". Bản `edit.ejs` THẬT (route thực sự render)
 *      và validate trong `routes/device.js` đều kiểm sai theo thang 0-1
 *      thay vì 0-100 — vi phạm trực tiếp yêu cầu rõ của đề. (Ngẫu nhiên,
 *      nội dung lạc vào add.ejs — vốn là bản edit.ejs khác — lại làm
 *      ĐÚNG phép quy đổi ×100/÷100, nhưng nằm nhầm file/route.)
 *   4. `cost` cũng tương tự: schema DB cho phép tới 999999, nhưng yêu
 *      cầu client nói rõ "0 và 1999.99" — quy tắc nghiệp vụ CHẶT hơn
 *      schema, phải áp riêng ở tầng client/route, không chỉ dựa vào
 *      `max` của schema.
 * Đã tự thiết kế lại đúng cả 4 điểm trên, không copy mù.
 *
 * Điểm gốc: Task 1=1.0, Task 2=5.0, Task 3=4.0 (5 mục con không tách
 * điểm riêng) — tách thành 5 câu CODE: Task1(1.0); Task2(5.0, JWT+CRUD+
 * validate+chốt xoá referential); Task3 tách 3 câu (đăng nhập+danh
 * sách=1.5, xoá=1.0, thêm/sửa=1.5).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE9.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE9.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given Mongoose schema (3 collections — a model can have many devices, each device belongs to one model):</b>` +
  `<pre><code class="language-javascript">model({
    modelName: {String, required: true, unique: true},
    modelDescription: {String, required: false},
}, { timestamps: true });

device({
    deviceName: { type: String, required: true, unique: true },
    deviceDescription: { type: String, required: true },
    cost: {type: number, required: true, min: 0, max: 999999},
    saleOff: {type: number, required: true, max: 1},   // fraction, e.g. 0.25 = 25% off
    isFamous: {type: Boolean, default: false},
    model: {type: mongoose.Schema.Types.ObjectId, ref: "Model", required: true},
}, { timestamps: true });

user({
    us: { type: String, required: true },
    pa: { type: String, required: true },
}, { timestamps: true });</code></pre></div>`,
  `<div class="pe-system"><b>Schema Mongoose đề cho (3 bảng — 1 model có nhiều device, mỗi device thuộc 1 model):</b>` +
  `<pre><code class="language-javascript">model({
    modelName: {String, required: true, unique: true},
    modelDescription: {String, required: false},
}, { timestamps: true });

device({
    deviceName: { type: String, required: true, unique: true },
    deviceDescription: { type: String, required: true },
    cost: {type: number, required: true, min: 0, max: 999999},
    saleOff: {type: number, required: true, max: 1},   // phân số, VD 0.25 = giảm 25%
    isFamous: {type: Boolean, default: false},
    model: {type: mongoose.Schema.Types.ObjectId, ref: "Model", required: true},
}, { timestamps: true });

user({
    us: { type: String, required: true },
    pa: { type: String, required: true },
}, { timestamps: true });</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Spring 2025) — Device Management System</strong>. A model can have many devices; each device belongs to one model. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Spring 2025) — Hệ thống quản lý thiết bị</strong>. 1 model có nhiều device; mỗi device thuộc 1 model. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 01 (1.0 mark):</strong> use the Express generator to develop the REST API server, create the related models, and migrate to a database named <code>SDN302_PE_SP25_StudentCode</code>.</p>`,
    `<p><strong>Task 01 (1.0 điểm):</strong> dùng Express generator dựng REST API server, tạo các model liên quan, và nạp vào database tên <code>SDN302_PE_SP25_StudentCode</code>.</p>`,
  ),
  starterCode:
`// ===== models/model.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ModelSchema = new Schema({
    modelName: { type: String, required: true, unique: true },
    modelDescription: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model("Model", ModelSchema);

// ===== models/device.model.js =====
const DeviceSchema = new Schema({
    deviceName: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9\\s\\/]+$/,
    },
    deviceDescription: { type: String, required: true },
    cost: { type: Number, required: true, min: 0, max: 999999 },
    saleOff: { type: Number, required: true, min: 0, max: 1 },
    isFamous: { type: Boolean, default: false },
    model: { type: Schema.Types.ObjectId, ref: "Model", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Device", DeviceSchema);

// ===== models/user.model.js =====
const UserSchema = new Schema({
    us: { type: String, required: true },
    pa: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);`,
  sampleSolution:
`// ===== models/model.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const ModelSchema = new Schema({
    modelName: { type: String, required: true, unique: true },
    modelDescription: { type: String, required: false },
}, { timestamps: true });

module.exports = mongoose.model("Model", ModelSchema);

// ===== models/device.model.js =====
const DeviceSchema = new Schema({
    deviceName: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9\\s\\/]+$/,
    },
    deviceDescription: { type: String, required: true },
    cost: { type: Number, required: true, min: 0, max: 999999 },
    saleOff: { type: Number, required: true, min: 0, max: 1 },
    isFamous: { type: Boolean, default: false },
    model: { type: Schema.Types.ObjectId, ref: "Model", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Device", DeviceSchema);

// ===== models/user.model.js =====
const UserSchema = new Schema({
    us: { type: String, required: true },
    pa: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);`,
  explanation: B(
    `<p><b>Fixed a real error found in a student solution package for this exact exam</b>: it defined the model collection with the wrong field names (<code>categoryName</code>/<code>categoryDescription</code>) instead of the paper's own <code>modelName</code>/<code>modelDescription</code> — a schema that would silently accept data under the wrong keys entirely. The field names here match the paper's schema table exactly, including the unusual <code>user</code> field names <code>us</code>/<code>pa</code>, which are given verbatim in the paper (not a typo to "fix").</p>`,
    `<p><b>Đã sửa 1 lỗi thật tìm thấy trong gói bài làm sinh viên cho đúng đề này</b>: nó định nghĩa bảng model với SAI tên field (<code>categoryName</code>/<code>categoryDescription</code>) thay vì đúng <code>modelName</code>/<code>modelDescription</code> của đề — 1 schema sẽ âm thầm nhận dữ liệu dưới sai tên hoàn toàn. Tên field ở đây khớp đúng bảng schema đề cho, kể cả tên field lạ <code>us</code>/<code>pa</code> của user, vốn được đề ghi nguyên văn (không phải lỗi gõ cần "sửa").</p>`,
  ),
  rubric: [
    { id: 'express_generator_structure', criterion: B('Project follows the standard Express-generator structure.', 'Dự án theo đúng cấu trúc Express-generator chuẩn.'), weight: 1, maxScore: 0.3 },
    { id: 'model_field_names_correct', criterion: B('The model collection uses the exact field names from the paper\'s schema (modelName, modelDescription) — not different names.', 'Bảng model dùng đúng tên field từ schema đề (modelName, modelDescription) — không đổi tên khác.'), weight: 1, maxScore: 0.4 },
    { id: 'migrated_to_correct_db', criterion: B('Data is correctly migrated into a database literally named SDN302_PE_SP25_StudentCode (with the real student code substituted).', 'Dữ liệu nạp đúng vào database tên đúng SDN302_PE_SP25_StudentCode (thay đúng student code thật).'), weight: 1, maxScore: 0.3 },
  ],
};

const q2 = {
  kind: 'CODE', points: 5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 02 (5.0 marks):</strong> create a REST API server for the model collection, using JWT to authenticate API requests. The JWT secret key must be <code>&lt;StudentCode&gt;@</code> (e.g. <code>se171234@</code>) and stored in the .env file. Implement CRUD operations for the model collection. Validate the input data to ensure it meets the data integrity rules (e.g., format, type, range, unique) when creating, deleting, or updating data through the API.</p>`,
    `<p><strong>Task 02 (5.0 điểm):</strong> xây REST API cho bảng model, dùng JWT xác thực request. Secret key JWT phải là <code>&lt;StudentCode&gt;@</code> (VD <code>se171234@</code>) lưu trong .env. Triển khai CRUD cho bảng model. Kiểm dữ liệu vào đủ quy tắc toàn vẹn (định dạng, kiểu, phạm vi, duy nhất) khi tạo, xoá, hoặc sửa qua API.</p>`,
  ),
  starterCode:
`// ===== middlewares/auth.middleware.js =====
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = authenticateToken;

// ===== controllers/model.controller.js =====
const db = require("../models/index");
const Model = db.model;
const Device = db.device;

const findAll = async (req, res, next) => { /* ... */ };
const findOne = async (req, res, next) => { /* ... */ };
const create = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};
const update = async (req, res, next) => { /* ... */ };
const remove = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { findAll, findOne, create, update, remove };`,
  sampleSolution:
`// ===== middlewares/auth.middleware.js =====
const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    // ---------- Student's code starts from here ----------
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = decoded;
        next();
    });
    // -------------------------------------------------------
};

module.exports = authenticateToken;

// ===== controllers/model.controller.js =====
const db = require("../models/index");
const Model = db.model;
const Device = db.device;

const findAll = async (req, res, next) => {
    try {
        res.json(await Model.find());
    } catch (error) { next(error); }
};

const findOne = async (req, res, next) => {
    try {
        const model = await Model.findById(req.params.id);
        if (!model) return res.status(404).json({ message: "Model not found" });
        res.json(model);
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { modelName, modelDescription } = req.body;

        if (!modelName || typeof modelName !== "string" || !modelName.trim()) {
            return res.status(400).json({ message: "modelName is required and must be a non-empty string" });
        }
        if (modelName.trim().length < 2 || modelName.trim().length > 50) {
            return res.status(400).json({ message: "modelName must be between 2 and 50 characters" });
        }

        const existing = await Model.findOne({ modelName: modelName.trim() });
        if (existing) {
            return res.status(400).json({ message: "modelName must be unique" });
        }

        const model = await Model.create({ modelName: modelName.trim(), modelDescription });
        res.status(201).json(model);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

const update = async (req, res, next) => {
    try {
        const { modelName, modelDescription } = req.body;

        const model = await Model.findById(req.params.id);
        if (!model) return res.status(404).json({ message: "Model not found" });

        if (modelName !== undefined) {
            if (typeof modelName !== "string" || !modelName.trim() || modelName.trim().length < 2 || modelName.trim().length > 50) {
                return res.status(400).json({ message: "modelName must be a non-empty string between 2 and 50 characters" });
            }
            const duplicate = await Model.findOne({ modelName: modelName.trim(), _id: { \$ne: req.params.id } });
            if (duplicate) {
                return res.status(400).json({ message: "modelName must be unique" });
            }
            model.modelName = modelName.trim();
        }
        if (modelDescription !== undefined) model.modelDescription = modelDescription;

        await model.save();
        res.json(model);
    } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { id } = req.params;

        const hasDevices = await Device.exists({ model: id });
        if (hasDevices) {
            return res.status(400).json({
                message: "Cannot delete model because it has associated devices",
            });
        }

        const deleted = await Model.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Model not found" });

        res.json({ message: "Model deleted successfully" });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { findAll, findOne, create, update, remove };`,
  explanation: B(
    `<p>"Data integrity rules ... when deleting" is interpreted as referential integrity — a model with existing devices cannot be deleted, mirroring the same delete-guard pattern this course's papers use elsewhere for parent-child relationships (a nation with foods, a category with products). <code>create</code>/<code>update</code> both enforce format (non-empty string), range (2-50 characters), and uniqueness explicitly, on top of whatever Mongoose's own schema-level <code>required</code>/<code>unique</code> would catch — so a bad request gets a clear, specific 400 message rather than a raw Mongoose validation error.</p>`,
    `<p>"Quy tắc toàn vẹn dữ liệu ... khi xoá" được hiểu là toàn vẹn tham chiếu — model còn device tồn tại thì không xoá được, cùng mẫu chốt xoá môn này dùng ở nơi khác cho quan hệ cha-con (nation với food, category với product). <code>create</code>/<code>update</code> đều kiểm tường minh định dạng (chuỗi không rỗng), phạm vi (2-50 ký tự), và duy nhất, cộng thêm những gì <code>required</code>/<code>unique</code> ở tầng schema Mongoose sẽ tự bắt — nên request sai nhận thông điệp 400 rõ ràng, cụ thể thay vì lỗi validation Mongoose thô.</p>`,
  ),
  rubric: [
    { id: 'jwt_middleware_protects_routes', criterion: B('All model CRUD routes require a valid JWT (via an auth middleware verifying the Bearer token signed with the StudentCode@ secret).', 'Mọi route CRUD model yêu cầu JWT hợp lệ (qua middleware xác thực Bearer token ký bằng secret StudentCode@).'), weight: 1, maxScore: 1 },
    { id: 'crud_implemented', criterion: B('All CRUD operations (list, get one, create, update, delete) are correctly implemented for the model collection.', 'Đủ mọi thao tác CRUD (liệt kê, lấy 1, tạo, sửa, xoá) triển khai đúng cho bảng model.'), weight: 1, maxScore: 1.5 },
    { id: 'create_update_validation', criterion: B('Create and update validate format (non-empty string), a reasonable length range, and uniqueness of modelName before writing.', 'Tạo và sửa kiểm đúng định dạng (chuỗi không rỗng), phạm vi độ dài hợp lý, và duy nhất modelName trước khi ghi.'), weight: 1, maxScore: 1.5 },
    { id: 'delete_referential_guard', criterion: B('DELETE checks for any device referencing the model before deleting, and returns an appropriate error when devices exist, allowing deletion only when none do.', 'DELETE kiểm đúng có device nào tham chiếu model trước khi xoá, trả lỗi phù hợp khi còn device, chỉ cho xoá khi không còn.'), weight: 1, maxScore: 1 },
  ],
};

const q3 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.1-3.2 (1.5 marks):</strong> client application for device management (EJS/Handlebars/Pug + Express). <b>Authentication:</b> at the login view, members must enter their username and password correctly (encrypted with bcrypt, stored in the 'users' collection). All CRUD actions require authentication. Display error messages for failed logins. Load user data from 'user.json' into the 'users' collection. After a successful login, redirect to the dashboard view. <b>Device list:</b> show the list of all devices (using a <b>card view</b>, not table view) including the model name, at route <code>/devices</code>.</p>`,
    `<p><strong>Task 03.1-3.2 (1.5 điểm):</strong> app client quản lý thiết bị (EJS/Handlebars/Pug + Express). <b>Xác thực:</b> tại view đăng nhập, thành viên nhập đúng username và password (băm bcrypt, lưu bảng 'users'). Mọi thao tác CRUD cần xác thực. Hiện lỗi khi đăng nhập sai. Nạp dữ liệu user từ 'user.json' vào bảng 'users'. Đăng nhập thành công chuyển hướng dashboard. <b>Danh sách thiết bị:</b> hiện danh sách thiết bị dạng <b>card view</b> (không phải bảng) gồm tên model, tại route <code>/devices</code>.</p>`,
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
const User = db.user;
const Device = db.device;

const showLogin = (req, res) => res.render("login", { error: null });

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const listDevices = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { showLogin, login, listDevices };`,
  sampleSolution:
`// ===== middlewares/pageAuth.middleware.js =====
const ensureLoggedIn = (req, res, next) => {
    // ---------- Student's code starts from here ----------
    if (!req.session.userId) {
        return res.redirect("/login");
    }
    next();
    // -------------------------------------------------------
};
module.exports = ensureLoggedIn;

// ===== controllers/page.controller.js =====
const bcrypt = require("bcrypt");
const db = require("../models/index");
const User = db.user;
const Device = db.device;

const showLogin = (req, res) => res.render("login", { error: null });

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { us, pa } = req.body;
        const user = await User.findOne({ us });
        const isMatch = user ? await bcrypt.compare(pa, user.pa) : false;

        if (!user || !isMatch) {
            return res.render("login", { error: "Invalid username or password." });
        }

        req.session.userId = user._id;
        res.redirect("/dashboard");
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

const listDevices = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const devices = await Device.find().populate("model", "modelName").lean();
        res.render("devices", { devices });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { showLogin, login, listDevices };

// ===== views/devices.ejs (card view excerpt) =====
// <% devices.forEach(function(device) { %>
//   <div class="device-card">
//     <h3><%= device.deviceName %></h3>
//     <p><%= device.deviceDescription %></p>
//     <p>Cost: $<%= device.cost.toFixed(2) %></p>
//     <p>Sale off: <%= (device.saleOff * 100).toFixed(0) %>%</p>
//     <p>Famous: <%= device.isFamous ? 'Yes' : 'No' %></p>
//     <p>Model: <%= device.model ? device.model.modelName : '' %></p>
//   </div>
// <% }); %>`,
  explanation: B(
    `<p>Login reads <code>us</code>/<code>pa</code> — the exact field names given in the schema, not <code>username</code>/<code>password</code> — and always uses <code>bcrypt.compare()</code> against the hashed <code>pa</code>, never a plaintext check. The card view converts the stored fraction <code>saleOff</code> (0-1) to a percent for DISPLAY (<code>×100</code>) — the same conversion needed on the way IN when adding/editing a device in Question 5, just in reverse.</p>`,
    `<p>Đăng nhập đọc <code>us</code>/<code>pa</code> — đúng tên field schema cho, không phải <code>username</code>/<code>password</code> — và luôn dùng <code>bcrypt.compare()</code> so <code>pa</code> đã băm, không bao giờ kiểm chuỗi thô. Card view quy đổi <code>saleOff</code> lưu dạng phân số (0-1) sang phần trăm để HIỂN THỊ (<code>×100</code>) — cùng phép quy đổi cần khi NHẬP lúc thêm/sửa thiết bị ở Câu 5, chỉ ngược chiều.</p>`,
  ),
  rubric: [
    { id: 'login_validates_hashed_password', criterion: B('Login form checks the entered password against the bcrypt-hashed "pa" field (not a plaintext comparison), using the correct field names (us/pa), showing an error on failure and redirecting to dashboard on success.', 'Form đăng nhập kiểm đúng mật khẩu nhập so field "pa" đã băm bcrypt (không so chuỗi thô), dùng đúng tên field (us/pa), hiện lỗi khi sai, chuyển hướng dashboard khi đúng.'), weight: 1, maxScore: 0.6 },
    { id: 'crud_requires_auth', criterion: B('All device CRUD page routes are protected by an authentication check.', 'Mọi route trang CRUD device được bảo vệ bởi kiểm xác thực.'), weight: 1, maxScore: 0.4 },
    { id: 'devices_card_view_correct', criterion: B('Devices list renders as a card view (not a table), including the populated model name.', 'Danh sách device render dạng card (không phải bảng), có tên model đã populate.'), weight: 1, maxScore: 0.5 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.3 (1.0 mark):</strong> if the login is successful, allow the user to delete the selected item with a confirmation and a notification of the result.</p>`,
    `<p><strong>Task 03.3 (1.0 điểm):</strong> đăng nhập thành công thì cho phép xoá item đã chọn kèm xác nhận hành động và thông báo kết quả.</p>`,
  ),
  starterCode:
`// ===== controllers/page.controller.js (excerpt) =====
const deleteDevice = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};
module.exports.deleteDevice = deleteDevice;

// ===== views/devices.ejs (delete button excerpt) =====
// <form method="POST" action="/devices/<%= device._id %>?_method=DELETE"
//       onsubmit="/* ---------- Student's code starts from here ---------- */">
//   <button type="submit">Delete</button>
// </form>`,
  sampleSolution:
`// ===== controllers/page.controller.js (excerpt) =====
const deleteDevice = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const deleted = await Device.findByIdAndDelete(req.params.id);
        req.flash = deleted
            ? { type: "success", message: \`"\${deleted.deviceName}" deleted successfully.\` }
            : { type: "error", message: "Device not found." };
        res.redirect("/devices");
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};
module.exports.deleteDevice = deleteDevice;

// ===== views/devices.ejs (delete button excerpt) =====
// <form method="POST" action="/devices/<%= device._id %>?_method=DELETE"
//       onsubmit="return confirm('Delete \\'' + '<%= device.deviceName %>' + '\\'? This cannot be undone.');">
//   <button type="submit">Delete</button>
// </form>

// ===== routes/page.routes.js (relevant excerpt) =====
// const methodOverride = require("method-override");
// router.use(methodOverride("_method"));
// router.delete("/devices/:id", ensureLoggedIn, PageController.deleteDevice);`,
  explanation: B(
    `<p><code>method-override</code> lets the HTML form's POST be routed as a DELETE, following the same RESTful-route pattern used elsewhere in this course. The browser's <code>confirm()</code> dialog satisfies the confirmation requirement, and the flash message after redirect reports success or failure.</p>`,
    `<p><code>method-override</code> cho form HTML POST được route thành DELETE, theo đúng mẫu route kiểu RESTful dùng ở nơi khác trong môn này. Hộp thoại <code>confirm()</code> trình duyệt thoả yêu cầu xác nhận, flash message sau redirect báo kết quả thành công hay thất bại.</p>`,
  ),
  rubric: [
    { id: 'confirmation_before_delete', criterion: B('The user is asked to confirm before the device is actually deleted.', 'Người dùng được hỏi xác nhận trước khi device thực sự bị xoá.'), weight: 1, maxScore: 0.5 },
    { id: 'deletion_and_result_notification', criterion: B('The selected device is correctly deleted, and the result is communicated to the user.', 'Device đã chọn bị xoá đúng, kết quả được báo cho người dùng.'), weight: 1, maxScore: 0.5 },
  ],
};

const q5 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.4-3.5 (1.5 marks):</strong> add a new device via a modal form (and allow updating with the same requirements). All fields are required. <code>deviceName</code> includes a-z, A-Z, /, space, and must be unique. <code>cost</code> must be a number between <b>0 and 1999.99</b> (default currency USD). <code>isFamous</code> must be a toggle/switch control. <code>saleOff</code> must be a number between <b>0 and 100</b> (showing the percent unit). <code>model</code> must be a select control, options showing <code>modelName</code> from the model collection.</p>`,
    `<p><strong>Task 03.4-3.5 (1.5 điểm):</strong> thêm device mới bằng modal form (và cho sửa với cùng yêu cầu). Mọi trường bắt buộc. <code>deviceName</code> gồm a-z, A-Z, /, khoảng trắng, phải duy nhất. <code>cost</code> là số <b>0-1999.99</b> (mặc định USD). <code>isFamous</code> phải là toggle/switch. <code>saleOff</code> là số <b>0-100</b> (đơn vị %). <code>model</code> phải là select, option hiện <code>modelName</code> từ bảng model.</p>`,
  ),
  starterCode:
`// ===== controllers/page.controller.js (excerpt) =====
const DEVICENAME_RE = /^[a-zA-Z0-9\\s\\/]+$/;

const validateDeviceInput = async (body, excludeId) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const createDevice = async (req, res, next) => { /* uses validateDeviceInput, converts saleOff %->fraction, then Device.create */ };
const updateDevice = async (req, res, next) => { /* same, then Device.findByIdAndUpdate */ };

module.exports.createDevice = createDevice;
module.exports.updateDevice = updateDevice;`,
  sampleSolution:
`// ===== controllers/page.controller.js (excerpt) =====
const DEVICENAME_RE = /^[a-zA-Z0-9\\s\\/]+$/;

const validateDeviceInput = async (body, excludeId) => {
    // ---------- Student's code starts from here ----------
    const errors = [];
    const { deviceName, deviceDescription, cost, saleOffPercent, model } = body;

    if (!deviceName || !deviceDescription || cost == null || saleOffPercent == null || !model) {
        errors.push("All fields are required.");
    }
    if (deviceName && !DEVICENAME_RE.test(deviceName)) {
        errors.push("deviceName can only contain letters, numbers, spaces, and /.");
    }
    if (deviceName) {
        const query = { deviceName };
        if (excludeId) query._id = { \$ne: excludeId };
        const duplicate = await Device.findOne(query);
        if (duplicate) errors.push("deviceName must be unique.");
    }

    const numCost = Number(cost);
    if (Number.isNaN(numCost) || numCost < 0 || numCost > 1999.99) {
        errors.push("cost must be a number between 0 and 1999.99 USD.");
    }

    // saleOffPercent is the 0-100 value the FORM sends; the schema stores a 0-1 fraction
    const numSaleOffPercent = Number(saleOffPercent);
    if (Number.isNaN(numSaleOffPercent) || numSaleOffPercent < 0 || numSaleOffPercent > 100) {
        errors.push("saleOff must be a number between 0 and 100 (percent).");
    }

    return errors;
    // -------------------------------------------------------
};

const createDevice = async (req, res, next) => {
    try {
        const errors = await validateDeviceInput(req.body, null);
        if (errors.length) {
            const models = await Model.find();
            return res.render("devices", { devices: await Device.find().populate("model"), models, errors });
        }

        await Device.create({
            deviceName: req.body.deviceName,
            deviceDescription: req.body.deviceDescription,
            cost: Number(req.body.cost),
            saleOff: Number(req.body.saleOffPercent) / 100, // percent (UI) -> fraction (schema)
            isFamous: req.body.isFamous === "on" || req.body.isFamous === true,
            model: req.body.model,
        });
        res.redirect("/devices");
    } catch (error) {
        next(error);
    }
};

const updateDevice = async (req, res, next) => {
    try {
        const errors = await validateDeviceInput(req.body, req.params.id);
        if (errors.length) {
            const models = await Model.find();
            return res.render("devices", { devices: await Device.find().populate("model"), models, errors });
        }

        await Device.findByIdAndUpdate(req.params.id, {
            deviceName: req.body.deviceName,
            deviceDescription: req.body.deviceDescription,
            cost: Number(req.body.cost),
            saleOff: Number(req.body.saleOffPercent) / 100,
            isFamous: req.body.isFamous === "on" || req.body.isFamous === true,
            model: req.body.model,
        }, { runValidators: true });
        res.redirect("/devices");
    } catch (error) {
        next(error);
    }
};

module.exports.createDevice = createDevice;
module.exports.updateDevice = updateDevice;

// ===== views/devices.ejs (add/edit modal form excerpt) =====
// <form method="POST" action="/devices">
//   <input name="deviceName" pattern="[a-zA-Z0-9\\s\\/]+" required />
//   <textarea name="deviceDescription" required></textarea>
//   <input name="cost" type="number" min="0" max="1999.99" step="0.01" required /> USD
//   <input name="isFamous" type="checkbox" role="switch" />
//   <input name="saleOffPercent" type="number" min="0" max="100" step="1" required /> %
//   <select name="model" required>
//     <% models.forEach(function(m) { %>
//       <option value="<%= m._id %>"><%= m.modelName %></option>
//     <% }); %>
//   </select>
//   <button type="submit">Save</button>
// </form>`,
  explanation: B(
    `<p><b>Caught the exact unit mismatch that a student solution package for this exact exam got wrong</b>: the schema stores <code>saleOff</code> as a 0-1 fraction (per the paper's own DB schema table), but the CLIENT requirement explicitly asks for a 0-100 percent input/display — that student's actual form and route validated the raw form value directly against 0-1, so typing "50" (meaning 50%) would have been rejected as out of range. Here, the form field is deliberately named <code>saleOffPercent</code> (distinct from the schema's <code>saleOff</code>) to make the conversion boundary explicit: the form collects/validates a 0-100 percent, and only <code>÷100</code> right before writing to the database converts it to the fraction the schema expects — the same conversion Question 3's card view already does in reverse (<code>×100</code>) for display. <code>cost</code> is validated against the paper's client-specific 0-1999.99 business rule, which is stricter than (and separate from) the schema's own wider 0-999999 bound.</p>`,
    `<p><b>Đã bắt đúng lỗi lệch đơn vị mà 1 gói bài làm sinh viên cho đúng đề này đã sai</b>: schema lưu <code>saleOff</code> dạng phân số 0-1 (theo đúng bảng schema DB đề cho), nhưng yêu cầu CLIENT nói rõ nhập/hiện dạng phần trăm 0-100 — form và route thật của sinh viên đó kiểm giá trị form thô trực tiếp so 0-1, nên gõ "50" (nghĩa là 50%) sẽ bị từ chối vì ngoài phạm vi. Ở đây, field form cố tình đặt tên <code>saleOffPercent</code> (khác <code>saleOff</code> của schema) để làm rõ ranh giới quy đổi: form thu thập/kiểm phần trăm 0-100, và chỉ <code>÷100</code> ngay trước khi ghi database mới quy đổi thành phân số schema cần — cùng phép quy đổi Câu 3's card view đã làm ngược lại (<code>×100</code>) để hiển thị. <code>cost</code> kiểm theo đúng quy tắc nghiệp vụ riêng của client 0-1999.99, chặt hơn (và tách biệt với) phạm vi rộng hơn 0-999999 của chính schema.</p>`,
  ),
  rubric: [
    { id: 'all_fields_required', criterion: B('All fields are validated as required in both add and edit flows.', 'Mọi trường được kiểm bắt buộc ở cả luồng thêm và sửa.'), weight: 1, maxScore: 0.2 },
    { id: 'devicename_pattern_and_unique', criterion: B('deviceName is validated to contain only a-z, A-Z, digits, spaces, and /, and checked for uniqueness (excluding the device being edited, for updates).', 'deviceName kiểm đúng chỉ a-z, A-Z, số, khoảng trắng, và /, và kiểm duy nhất (loại trừ chính device đang sửa, cho update).'), weight: 1, maxScore: 0.3 },
    { id: 'cost_business_range', criterion: B('cost is validated against the client-specific 0-1999.99 range, not the schema\'s wider 0-999999 bound.', 'cost kiểm đúng theo phạm vi riêng của client 0-1999.99, không phải phạm vi rộng hơn 0-999999 của schema.'), weight: 1, maxScore: 0.4 },
    { id: 'saleoff_percent_conversion', criterion: B('saleOff is collected and validated as a 0-100 percent value in the form, and correctly converted to a 0-1 fraction only at the point of saving to the database — not validated against 0-1 directly on the raw form input.', 'saleOff thu thập và kiểm dạng phần trăm 0-100 ở form, quy đổi đúng thành phân số 0-1 CHỈ tại điểm lưu database — không kiểm trực tiếp 0-1 trên giá trị form thô.'), weight: 1, maxScore: 0.4 },
    { id: 'isfamous_toggle', criterion: B('isFamous uses a toggle/switch control.', 'isFamous dùng control toggle/switch.'), weight: 1, maxScore: 0.1 },
    { id: 'model_select_from_data', criterion: B('model is a select control populated with real modelName options from the model collection.', 'model là select lấy option modelName thật từ bảng model.'), weight: 1, maxScore: 0.1 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE9',
    title: 'SDN302 – Practical Exam (Spring 2025), Device Management System|||SDN302 – Thi thực hành (Spring 2025), Hệ thống quản lý thiết bị',
    description: 'SDN302 PE (CODE): JWT-authenticated REST API for models (with a referential delete guard) plus a server-rendered EJS client for device CRUD with cost/percent unit-conversion validation, AI-graded.|||PE SDN302 (viết mã): REST API xác thực JWT cho model (kèm chốt xoá tham chiếu) cộng client render server EJS cho CRUD device với validation quy đổi đơn vị cost/percent, chấm AI.',
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
