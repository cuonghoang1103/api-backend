/**
 * build-sdn302-pe12.mjs — sinh content/exams/SDN302-PE12.mjs.
 *
 * Nguồn thật: "SDN302 - SP26 - PE -2" (mã đề PE_SDN302_SPRING_2026) —
 * Pen Management System (brands/pens/members). Không có solution/seed
 * đính kèm ngoài paper.pdf — schema đầy đủ đã có sẵn trong chính đề.
 *
 * ⚠️ Khác PE9 (Device Management, saleOff NHẬP dạng % 0-100 rồi quy đổi
 * sang phân số khi lưu): đề NÀY nói rõ "`off` phải NHẬP dạng số thập
 * phân 0-1, CHỈ hiện thị dạng phần trăm" — tức form add/edit nhận
 * TRỰC TIẾP 0-1 (không quy đổi input), chỉ màn hình danh sách (Task
 * 3.2) hiện lại dạng %. Đã đọc kỹ tránh áp nhầm mẫu PE9 vào đây.
 *
 * Điểm gốc: Task 1=1.0, Task 2=5.0, Task 3=4.0 (5 mục con không tách
 * điểm riêng) — tách 5 câu CODE: Task1(1.0); Task2(5.0, JWT+CRUD+chốt
 * xoá referential); Task3 tách 3 câu (đăng nhập+danh sách=1.5, xoá=1.0,
 * thêm/sửa=1.5).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE12.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE12.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given Mongoose schema (3 collections — a brand can have many pens, each pen belongs to one brand):</b>` +
  `<pre><code class="language-javascript">brands({
    brandName: {type: String, required: true, unique: true},
    ballpoint: {type: Boolean, default: false},
}, { timestamps: true });

pens({
    penName: {type: String, required: true, unique: true},
    penDescription: {type: String, required: true},
    image: {type: String, required: true},
    pouch: {type: Boolean, default: false},
    off: {type: Number, required: true},   // decimal 0-1, e.g. 0.75 = 75% off
    gender: {type: Boolean, default: false},
    brand: {type: mongoose.Schema.Types.ObjectId, ref: "brand", required: true},
}, { timestamps: true });

members({
    name: {type: String, required: true},
    code: {type: String, required: true},
}, { timestamps: true });</code></pre></div>`,
  `<div class="pe-system"><b>Schema Mongoose đề cho (3 bảng — 1 brand có nhiều pen, mỗi pen thuộc 1 brand):</b>` +
  `<pre><code class="language-javascript">brands({
    brandName: {type: String, required: true, unique: true},
    ballpoint: {type: Boolean, default: false},
}, { timestamps: true });

pens({
    penName: {type: String, required: true, unique: true},
    penDescription: {type: String, required: true},
    image: {type: String, required: true},
    pouch: {type: Boolean, default: false},
    off: {type: Number, required: true},   // số thập phân 0-1, VD 0.75 = giảm 75%
    gender: {type: Boolean, default: false},
    brand: {type: mongoose.Schema.Types.ObjectId, ref: "brand", required: true},
}, { timestamps: true });

members({
    name: {type: String, required: true},
    code: {type: String, required: true},
}, { timestamps: true });</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Spring 2026) — Pen Management System</strong>. A brand can have many pens; each pen belongs to one brand. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Spring 2026) — Hệ thống quản lý bút</strong>. 1 brand có nhiều pen; mỗi pen thuộc 1 brand. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 01 (1.0 mark):</strong> use the Express generator tool to develop the REST API server, create the related brands, and migrate them to a database named <code>SDN302_SP26_StudentCodeDB</code>.</p>`,
    `<p><strong>Task 01 (1.0 điểm):</strong> dùng Express generator dựng REST API server, tạo các brand liên quan, và nạp vào database tên <code>SDN302_SP26_StudentCodeDB</code>.</p>`,
  ),
  starterCode:
`// ===== models/brand.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const BrandSchema = new Schema({
    brandName: { type: String, required: true, unique: true },
    ballpoint: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("brand", BrandSchema);

// ===== models/pen.model.js =====
const PenSchema = new Schema({
    penName: { type: String, required: true, unique: true },
    penDescription: { type: String, required: true },
    image: { type: String, required: true },
    pouch: { type: Boolean, default: false },
    off: { type: Number, required: true, min: 0, max: 1 },
    gender: { type: Boolean, default: false },
    brand: { type: Schema.Types.ObjectId, ref: "brand", required: true },
}, { timestamps: true });

module.exports = mongoose.model("pen", PenSchema);

// ===== models/member.model.js =====
const MemberSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("member", MemberSchema);`,
  sampleSolution:
`// ===== models/brand.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const BrandSchema = new Schema({
    brandName: { type: String, required: true, unique: true },
    ballpoint: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("brand", BrandSchema);

// ===== models/pen.model.js =====
const PenSchema = new Schema({
    penName: { type: String, required: true, unique: true },
    penDescription: { type: String, required: true },
    image: { type: String, required: true },
    pouch: { type: Boolean, default: false },
    off: { type: Number, required: true, min: 0, max: 1 },
    gender: { type: Boolean, default: false },
    brand: { type: Schema.Types.ObjectId, ref: "brand", required: true },
}, { timestamps: true });

module.exports = mongoose.model("pen", PenSchema);

// ===== models/member.model.js =====
const MemberSchema = new Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("member", MemberSchema);`,
  explanation: B(
    `<p><code>off</code> is additionally constrained to <code>min: 0, max: 1</code> at the model level — the paper's own schema table doesn't show this bound explicitly, but Task 3.4 states "<code>off</code> must be entered as a decimal number between 0 and 1," so enforcing it at the schema level (not just in the client form) keeps the API itself consistent, not only the EJS client.</p>`,
    `<p><code>off</code> thêm ràng buộc <code>min: 0, max: 1</code> ở mức model — bảng schema đề gốc không ghi tường minh biên này, nhưng Task 3.4 nói rõ "<code>off</code> phải nhập số thập phân 0-1," nên áp ở mức schema (không chỉ ở form client) giữ chính API cũng nhất quán, không chỉ client EJS.</p>`,
  ),
  rubric: [
    { id: 'express_generator_structure', criterion: B('Project follows the standard Express-generator structure.', 'Dự án theo đúng cấu trúc Express-generator chuẩn.'), weight: 1, maxScore: 0.3 },
    { id: 'brand_schema_matches', criterion: B('Brand model matches the given schema exactly (brandName unique+required, ballpoint boolean).', 'Model Brand khớp đúng schema đề cho (brandName unique+required, ballpoint boolean).'), weight: 1, maxScore: 0.3 },
    { id: 'migrated_to_correct_db', criterion: B('Data is correctly migrated into a database literally named SDN302_SP26_StudentCodeDB (with the real student code substituted).', 'Dữ liệu nạp đúng vào database tên đúng SDN302_SP26_StudentCodeDB (thay đúng student code thật).'), weight: 1, maxScore: 0.4 },
  ],
};

const q2 = {
  kind: 'CODE', points: 5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 02 (5.0 marks):</strong> create a new REST API server for the brand collection, using JSON Web Token (JWT) to authenticate the API. The secret key of JWT must be <code>&lt;StudentCode&gt;!</code> (e.g. <code>se181234!</code>) and stored in the .env file. Do not store the JWT in cookies or session storage. Route paths: <code>POST http://yourdomain/auth/tokens</code> to generate the JWT (account credentials from members.json: name <code>admin</code>, code <code>123456789</code>); <code>http://yourdomain/rest/brands</code> and <code>http://yourdomain/rest/brands/:id</code> for all JWT-protected CRUD methods related to brands. For the DELETE operation, ensure a brand cannot be deleted if any pens are associated with it (i.e., if there are documents in the pen collection referencing the brand's <code>_id</code>) — return an appropriate error message (e.g., "Cannot delete brand because it has associated pens") if deletion is attempted in such cases.</p>`,
    `<p><strong>Task 02 (5.0 điểm):</strong> xây REST API mới cho bảng brand, dùng JWT xác thực API. Secret key JWT phải là <code>&lt;StudentCode&gt;!</code> (VD <code>se181234!</code>) lưu trong .env. Không lưu JWT vào cookie hay session storage. Route: <code>POST http://yourdomain/auth/tokens</code> sinh JWT (tài khoản từ members.json: name <code>admin</code>, code <code>123456789</code>); <code>http://yourdomain/rest/brands</code> và <code>http://yourdomain/rest/brands/:id</code> cho mọi CRUD brand được JWT bảo vệ. Với DELETE, đảm bảo không xoá được brand nếu có pen nào tham chiếu tới _id của nó — trả lỗi phù hợp (VD "Cannot delete brand because it has associated pens") nếu cố xoá trong trường hợp đó.</p>`,
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

// ===== controllers/brand.controller.js =====
const Brand = db.brand;
const Pen = db.pen;

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
        const { name, code } = req.body;

        const member = await Member.findOne({ name });
        if (!member) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isMatch = await bcrypt.compare(code, member.code);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign({ id: member._id, name: member.name }, process.env.JWT_SECRET, {
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

const authenticateToken = (req, res, next) => {
    // ---------- Student's code starts from here ----------
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    jwt2.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        req.user = decoded;
        next();
    });
    // -------------------------------------------------------
};

module.exports = authenticateToken;

// ===== controllers/brand.controller.js =====
const db2 = require("../models/index");
const Brand = db2.brand;
const Pen = db2.pen;

const findAll = async (req, res, next) => {
    try {
        res.json(await Brand.find());
    } catch (error) { next(error); }
};

const findOne = async (req, res, next) => {
    try {
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).json({ message: "Brand not found" });
        res.json(brand);
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const { brandName, ballpoint } = req.body;
        if (!brandName || typeof brandName !== "string" || !brandName.trim()) {
            return res.status(400).json({ message: "brandName is required and must be a non-empty string" });
        }
        const existing = await Brand.findOne({ brandName: brandName.trim() });
        if (existing) {
            return res.status(400).json({ message: "brandName must be unique" });
        }
        const brand = await Brand.create({ brandName: brandName.trim(), ballpoint });
        res.status(201).json(brand);
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const { brandName, ballpoint } = req.body;
        const brand = await Brand.findById(req.params.id);
        if (!brand) return res.status(404).json({ message: "Brand not found" });

        if (brandName !== undefined) {
            if (typeof brandName !== "string" || !brandName.trim()) {
                return res.status(400).json({ message: "brandName must be a non-empty string" });
            }
            const duplicate = await Brand.findOne({ brandName: brandName.trim(), _id: { \$ne: req.params.id } });
            if (duplicate) return res.status(400).json({ message: "brandName must be unique" });
            brand.brandName = brandName.trim();
        }
        if (ballpoint !== undefined) brand.ballpoint = ballpoint;

        await brand.save();
        res.json(brand);
    } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { id } = req.params;

        const hasPens = await Pen.exists({ brand: id });
        if (hasPens) {
            return res.status(400).json({
                message: "Cannot delete brand because it has associated pens",
            });
        }

        const deleted = await Brand.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Brand not found" });

        res.json({ message: "Brand deleted successfully" });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { findAll, findOne, create, update, remove };`,
  explanation: B(
    `<p>The JWT-generation endpoint reads credentials from the <code>members</code> collection (populated from <code>members.json</code>), comparing the submitted <code>code</code> against the stored value with <code>bcrypt.compare()</code> — since Task 3.1 explicitly requires the code to be "encrypted using bcrypt and stored in the members collection," the same hashed value is checked here for API token issuance, not a separate plaintext copy. The DELETE guard uses <code>Pen.exists({ brand: id })</code> before allowing removal, and the paper's own suggested message is used verbatim. The note "do not store the JWT in cookies or session storage" is naturally satisfied since this is a stateless REST API — the client is expected to hold the token itself (e.g. in an Authorization header on each request), not this server.</p>`,
    `<p>Endpoint sinh JWT đọc thông tin từ bảng <code>members</code> (nạp từ <code>members.json</code>), so <code>code</code> gửi lên với giá trị đã lưu bằng <code>bcrypt.compare()</code> — vì Task 3.1 yêu cầu rõ code phải "băm bcrypt, lưu trong bảng members," cùng giá trị đã băm đó được kiểm ở đây để cấp token API, không phải bản sao thô riêng. Chốt DELETE dùng <code>Pen.exists({ brand: id })</code> trước khi cho xoá, và thông điệp đề gợi ý được dùng nguyên văn. Lưu ý "không lưu JWT vào cookie hay session storage" tự nhiên được thoả vì đây là REST API không trạng thái — client tự giữ token (VD header Authorization mỗi request), không phải server này.</p>`,
  ),
  rubric: [
    { id: 'token_generation_correct', criterion: B('POST /auth/tokens validates credentials against the bcrypt-hashed code and returns a valid JWT signed with the StudentCode! secret.', 'POST /auth/tokens kiểm đúng thông tin so code đã băm bcrypt, trả JWT hợp lệ ký bằng secret StudentCode!.'), weight: 1, maxScore: 1 },
    { id: 'jwt_middleware_protects_routes', criterion: B('All brand CRUD routes require a valid JWT via an auth middleware.', 'Mọi route CRUD brand yêu cầu JWT hợp lệ qua middleware xác thực.'), weight: 1, maxScore: 1 },
    { id: 'crud_implemented', criterion: B('All CRUD operations (list, get one, create, update, delete) are correctly implemented for the brand collection.', 'Đủ mọi thao tác CRUD (liệt kê, lấy 1, tạo, sửa, xoá) triển khai đúng cho bảng brand.'), weight: 1, maxScore: 1.5 },
    { id: 'delete_referential_guard', criterion: B('DELETE checks for any pen referencing the brand before deleting, returning the appropriate message when pens exist, allowing deletion only when none do.', 'DELETE kiểm đúng có pen nào tham chiếu brand trước khi xoá, trả thông điệp phù hợp khi còn pen, chỉ cho xoá khi không còn.'), weight: 1, maxScore: 1.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.1-3.2 (1.5 marks):</strong> client application for pen management (EJS/Handlebars/Pug + Express). <b>Authentication:</b> at the login view (<code>/auth/access</code>), members enter account name and code correctly (code encrypted with bcrypt, stored in the 'members' collection). All CRUD actions require authentication. Show error messages on failed logins. Redirect to the pen list after a successful login. Import account data from members.json into the 'members' collection. <b>Pen list:</b> display all pens in a <b>card view</b> (not table view), including: penName, off (displayed as a percentage, e.g. {"off": 0.75} → 75%), image, gender (displayed as a male/female icon), and brand name. Route: <code>/admin/pens</code>.</p>`,
    `<p><strong>Task 03.1-3.2 (1.5 điểm):</strong> app client quản lý bút (EJS/Handlebars/Pug + Express). <b>Xác thực:</b> tại view đăng nhập (<code>/auth/access</code>), thành viên nhập đúng name và code (code băm bcrypt, lưu bảng 'members'). Mọi CRUD cần xác thực. Hiện lỗi khi đăng nhập sai. Đăng nhập thành công chuyển hướng danh sách bút. Nạp dữ liệu từ members.json vào bảng 'members'. <b>Danh sách bút:</b> hiện tất cả bút dạng <b>card view</b> (không phải bảng), gồm: penName, off (hiện dạng % — VD {"off": 0.75} → 75%), image, gender (hiện icon nam/nữ), tên brand. Route: <code>/admin/pens</code>.</p>`,
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
const Pen = db.pen;

const showLogin = (req, res) => res.render("login", { error: null });

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const listPens = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { showLogin, login, listPens };`,
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
const Pen = db.pen;

const showLogin = (req, res) => res.render("login", { error: null });

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { name, code } = req.body;
        const member = await Member.findOne({ name });
        const isMatch = member ? await bcrypt.compare(code, member.code) : false;

        if (!member || !isMatch) {
            return res.render("login", { error: "Invalid name or code." });
        }

        req.session.memberId = member._id;
        res.redirect("/admin/pens");
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

const listPens = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const pens = await Pen.find().populate("brand", "brandName").lean();
        res.render("pens", { pens });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { showLogin, login, listPens };

// ===== views/pens.ejs (card view excerpt) =====
// <% pens.forEach(function(pen) { %>
//   <div class="pen-card">
//     <img src="<%= pen.image %>" alt="<%= pen.penName %>" />
//     <h3><%= pen.penName %></h3>
//     <p>Off: <%= (pen.off * 100).toFixed(0) %>%</p>
//     <i class="<%= pen.gender ? 'icon-male' : 'icon-female' %>"></i>
//     <p>Brand: <%= pen.brand ? pen.brand.brandName : '' %></p>
//   </div>
// <% }); %>`,
  explanation: B(
    `<p>Login always uses <code>bcrypt.compare()</code> against the hashed <code>code</code> field — the same field/hash checked by Task 2's <code>/auth/tokens</code>, since both flows authenticate against the same <code>members</code> collection. The card view converts the stored decimal <code>off</code> (0-1) to a percentage purely for DISPLAY (<code>×100</code>) — unlike this exam's add/edit form (Question 5), which accepts <code>off</code> directly as a 0-1 decimal with no conversion needed on input, since the paper states the ADD FORM itself takes the 0-1 value, only the list view needs the percent conversion.</p>`,
    `<p>Đăng nhập luôn dùng <code>bcrypt.compare()</code> so field <code>code</code> đã băm — cùng field/hash mà <code>/auth/tokens</code> Task 2 kiểm, vì cả 2 luồng xác thực đều so cùng bảng <code>members</code>. Card view quy đổi <code>off</code> thập phân lưu (0-1) sang phần trăm CHỈ để HIỂN THỊ (<code>×100</code>) — khác form thêm/sửa của đề này (Câu 5), nhận trực tiếp <code>off</code> dạng thập phân 0-1 không cần quy đổi lúc nhập, vì đề nói rõ chính form thêm đã nhận giá trị 0-1, chỉ view danh sách cần quy đổi %.</p>`,
  ),
  rubric: [
    { id: 'login_validates_hashed_code', criterion: B('Login form checks the entered code against the bcrypt-hashed "code" field (not a plaintext comparison), showing an error on failure and redirecting to the pen list on success.', 'Form đăng nhập kiểm đúng code nhập so field "code" đã băm bcrypt (không so chuỗi thô), hiện lỗi khi sai, chuyển hướng danh sách bút khi đúng.'), weight: 1, maxScore: 0.5 },
    { id: 'crud_requires_auth', criterion: B('All pen CRUD page routes are protected by an authentication check.', 'Mọi route trang CRUD pen được bảo vệ bởi kiểm xác thực.'), weight: 1, maxScore: 0.4 },
    { id: 'pens_card_view_correct', criterion: B('Pens list renders as a card view (not a table), showing penName, off correctly converted to a percentage for display, image, a gender icon, and the populated brand name.', 'Danh sách pen render dạng card (không phải bảng), hiện penName, off quy đổi đúng thành % để hiển thị, image, icon giới tính, và tên brand đã populate.'), weight: 1, maxScore: 0.6 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.3 (1.0 mark):</strong> after a successful login, allow deletion of a selected pen with a confirmation and a notification of the result.</p>`,
    `<p><strong>Task 03.3 (1.0 điểm):</strong> đăng nhập thành công thì cho phép xoá pen đã chọn kèm xác nhận hành động và thông báo kết quả.</p>`,
  ),
  starterCode:
`// ===== controllers/page.controller.js (excerpt) =====
const deletePen = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};
module.exports.deletePen = deletePen;

// ===== views/pens.ejs (delete button excerpt) =====
// <form method="POST" action="/admin/pens/<%= pen._id %>?_method=DELETE"
//       onsubmit="/* ---------- Student's code starts from here ---------- */">
//   <button type="submit">Delete</button>
// </form>`,
  sampleSolution:
`// ===== controllers/page.controller.js (excerpt) =====
const deletePen = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const deleted = await Pen.findByIdAndDelete(req.params.id);
        req.flash = deleted
            ? { type: "success", message: \`"\${deleted.penName}" deleted successfully.\` }
            : { type: "error", message: "Pen not found." };
        res.redirect("/admin/pens");
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};
module.exports.deletePen = deletePen;

// ===== views/pens.ejs (delete button excerpt) =====
// <form method="POST" action="/admin/pens/<%= pen._id %>?_method=DELETE"
//       onsubmit="return confirm('Delete \\'' + '<%= pen.penName %>' + '\\'? This cannot be undone.');">
//   <button type="submit">Delete</button>
// </form>

// ===== routes/page.routes.js (relevant excerpt) =====
// const methodOverride = require("method-override");
// router.use(methodOverride("_method"));
// router.delete("/admin/pens/:id", ensureLoggedIn, PageController.deletePen);`,
  explanation: B(
    `<p><code>method-override</code> lets the HTML form's POST be routed as a DELETE. The browser's <code>confirm()</code> dialog satisfies the confirmation requirement, and the flash message after redirect reports success or failure.</p>`,
    `<p><code>method-override</code> cho form HTML POST được route thành DELETE. Hộp thoại <code>confirm()</code> trình duyệt thoả yêu cầu xác nhận, flash message sau redirect báo kết quả thành công hay thất bại.</p>`,
  ),
  rubric: [
    { id: 'confirmation_before_delete', criterion: B('The user is asked to confirm before the pen is actually deleted.', 'Người dùng được hỏi xác nhận trước khi pen thực sự bị xoá.'), weight: 1, maxScore: 0.5 },
    { id: 'deletion_and_result_notification', criterion: B('The selected pen is correctly deleted, and the result is communicated to the user.', 'Pen đã chọn bị xoá đúng, kết quả được báo cho người dùng.'), weight: 1, maxScore: 0.5 },
  ],
};

const q5 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.4-3.5 (1.5 marks):</strong> add a new pen via a modal form (and allow updating with the same requirements). All fields are required. <code>penName</code> includes only letters (a-z, A-Z) and space, and must be unique. <code>pouch</code> must be a toggle/switch control. <code>off</code> must be entered as a decimal number between 0 and 1, displayed as a corresponding percentage (e.g. {"off": 0.75} → 75%). <code>gender</code> must be a toggle/switch control. <code>brand</code> must be a select control displaying brandName values from the brands collection.</p>`,
    `<p><strong>Task 03.4-3.5 (1.5 điểm):</strong> thêm pen mới bằng modal form (và cho sửa với cùng yêu cầu). Mọi trường bắt buộc. <code>penName</code> chỉ gồm chữ cái (a-z, A-Z) và khoảng trắng, phải duy nhất. <code>pouch</code> phải là toggle/switch. <code>off</code> nhập số thập phân 0-1, hiện dạng % tương ứng (VD {"off": 0.75} → 75%). <code>gender</code> phải là toggle/switch. <code>brand</code> phải là select hiện brandName từ bảng brands.</p>`,
  ),
  starterCode:
`// ===== controllers/page.controller.js (excerpt) =====
const PENNAME_RE = /^[a-zA-Z\\s]+$/;

const validatePenInput = async (body, excludeId) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const createPen = async (req, res, next) => { /* uses validatePenInput, then Pen.create */ };
const updatePen = async (req, res, next) => { /* same, then Pen.findByIdAndUpdate */ };

module.exports.createPen = createPen;
module.exports.updatePen = updatePen;`,
  sampleSolution:
`// ===== controllers/page.controller.js (excerpt) =====
const PENNAME_RE = /^[a-zA-Z\\s]+$/;

const validatePenInput = async (body, excludeId) => {
    // ---------- Student's code starts from here ----------
    const errors = [];
    const { penName, penDescription, image, off, brand } = body;

    if (!penName || !penDescription || !image || off == null || !brand) {
        errors.push("All fields are required.");
    }
    if (penName && !PENNAME_RE.test(penName)) {
        errors.push("penName can only contain letters and spaces.");
    }
    if (penName) {
        const query = { penName };
        if (excludeId) query._id = { \$ne: excludeId };
        const duplicate = await Pen.findOne(query);
        if (duplicate) errors.push("penName must be unique.");
    }

    const numOff = Number(off);
    if (Number.isNaN(numOff) || numOff < 0 || numOff > 1) {
        errors.push("off must be a decimal number between 0 and 1.");
    }

    return errors;
    // -------------------------------------------------------
};

const createPen = async (req, res, next) => {
    try {
        const errors = await validatePenInput(req.body, null);
        if (errors.length) {
            const brands = await Brand.find();
            return res.render("pens", { pens: await Pen.find().populate("brand"), brands, errors });
        }

        await Pen.create({
            penName: req.body.penName,
            penDescription: req.body.penDescription,
            image: req.body.image,
            pouch: req.body.pouch === "on" || req.body.pouch === true,
            off: Number(req.body.off),
            gender: req.body.gender === "on" || req.body.gender === true,
            brand: req.body.brand,
        });
        res.redirect("/admin/pens");
    } catch (error) {
        next(error);
    }
};

const updatePen = async (req, res, next) => {
    try {
        const errors = await validatePenInput(req.body, req.params.id);
        if (errors.length) {
            const brands = await Brand.find();
            return res.render("pens", { pens: await Pen.find().populate("brand"), brands, errors });
        }

        await Pen.findByIdAndUpdate(req.params.id, {
            penName: req.body.penName,
            penDescription: req.body.penDescription,
            image: req.body.image,
            pouch: req.body.pouch === "on" || req.body.pouch === true,
            off: Number(req.body.off),
            gender: req.body.gender === "on" || req.body.gender === true,
            brand: req.body.brand,
        }, { runValidators: true });
        res.redirect("/admin/pens");
    } catch (error) {
        next(error);
    }
};

module.exports.createPen = createPen;
module.exports.updatePen = updatePen;

// ===== views/pens.ejs (add/edit modal form excerpt) =====
// <form method="POST" action="/admin/pens">
//   <input name="penName" pattern="[a-zA-Z\\s]+" required />
//   <textarea name="penDescription" required></textarea>
//   <input name="image" type="url" required />
//   <input name="pouch" type="checkbox" role="switch" />
//   <input name="off" type="number" min="0" max="1" step="0.01" required />
//   <input name="gender" type="checkbox" role="switch" />
//   <select name="brand" required>
//     <% brands.forEach(function(b) { %>
//       <option value="<%= b._id %>"><%= b.brandName %></option>
//     <% }); %>
//   </select>
//   <button type="submit">Save</button>
// </form>`,
  explanation: B(
    `<p><b>Deliberately different from this course's Device Management exam</b> (SDN302 PE9), where the "percent" business field had to be entered as 0-100 in the form and converted to a 0-1 fraction only at save time: here, the paper states the ADD/EDIT form itself accepts <code>off</code> directly as a 0-1 decimal (<code>input type="number" min="0" max="1"</code>), with NO conversion needed on the way in — the ×100 percent conversion only happens on the way OUT, in Question 3's list view. Getting this backwards (validating the form input against 0-100 here) would be the same class of unit-mismatch bug documented in that other exam.</p>`,
    `<p><b>Cố tình khác đề Quản lý Thiết bị của môn này</b> (SDN302 PE9), nơi field "phần trăm" phải nhập 0-100 ở form rồi quy đổi sang phân số 0-1 chỉ lúc lưu: ở đây, đề nói rõ chính form thêm/sửa nhận trực tiếp <code>off</code> dạng thập phân 0-1 (<code>input type="number" min="0" max="1"</code>), KHÔNG cần quy đổi lúc nhập — phép quy đổi ×100 phần trăm chỉ xảy ra lúc XUẤT, ở view danh sách Câu 3. Làm ngược (kiểm input form so 0-100 ở đây) sẽ là cùng loại lỗi lệch đơn vị đã ghi trong đề kia.</p>`,
  ),
  rubric: [
    { id: 'all_fields_required', criterion: B('All fields are validated as required in both add and edit flows.', 'Mọi trường được kiểm bắt buộc ở cả luồng thêm và sửa.'), weight: 1, maxScore: 0.2 },
    { id: 'penname_pattern_and_unique', criterion: B('penName is validated to contain only letters and spaces, and checked for uniqueness (excluding the pen being edited, for updates).', 'penName kiểm đúng chỉ chữ cái và khoảng trắng, và kiểm duy nhất (loại trừ chính pen đang sửa, cho update).'), weight: 1, maxScore: 0.4 },
    { id: 'off_range_no_percent_conversion', criterion: B('off is validated directly as a 0-1 decimal in the form, with NO conversion to/from a 0-100 percent on input — the percent conversion is display-only, in the list view.', 'off kiểm trực tiếp là thập phân 0-1 ngay ở form, KHÔNG quy đổi qua lại 0-100 % lúc nhập — quy đổi % chỉ để hiển thị, ở view danh sách.'), weight: 1, maxScore: 0.5 },
    { id: 'pouch_gender_toggles', criterion: B('Both pouch and gender use toggle/switch controls.', 'Cả pouch và gender đều dùng control toggle/switch.'), weight: 1, maxScore: 0.2 },
    { id: 'brand_select_from_data', criterion: B('brand is a select control populated with real brandName options from the brands collection.', 'brand là select lấy option brandName thật từ bảng brands.'), weight: 1, maxScore: 0.2 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE12',
    title: 'SDN302 – Practical Exam (Spring 2026), Pen Management System|||SDN302 – Thi thực hành (Spring 2026), Hệ thống quản lý bút',
    description: 'SDN302 PE (CODE): JWT-authenticated REST API for brands (with a referential delete guard) plus a server-rendered EJS client for pen CRUD with decimal/percent display conversion, AI-graded.|||PE SDN302 (viết mã): REST API xác thực JWT cho brand (kèm chốt xoá tham chiếu) cộng client render server EJS cho CRUD pen với quy đổi hiển thị thập phân/phần trăm, chấm AI.',
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
