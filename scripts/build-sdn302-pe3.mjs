/**
 * build-sdn302-pe3.mjs — sinh content/exams/SDN302-PE3.mjs.
 *
 * Nguồn thật: "SDN302 - FA25 - PE - 2025071001" — FOODEX Management
 * System (Fall 2025). Full-stack: REST API JWT cho `nation` (Task 2)
 * + client server-rendered EJS/Handlebars/Pug cho `food` (Task 3).
 * Không có solution — chỉ có 1 file Note.docx tham khảo (đã đọc kỹ,
 * trích các đoạn mã mẫu: hash bcrypt, verify JWT middleware) + 3 file
 * JSON seed (đã đọc để xác nhận `key` trong users.json ĐÃ BĂM SẴN bằng
 * bcrypt, không phải chuỗi thô — quan trọng vì logic đăng nhập phải
 * dùng `bcrypt.compare()`, không so sánh chuỗi trực tiếp).
 *
 * Điểm gốc: Task 1=1.0, Task 2=5.0, Task 3=4.0 (5 mục con không tách
 * điểm riêng) — tách thành 5 câu CODE bám sát cấu trúc: Task1(1.0);
 * Task2(5.0, JWT+CRUD+chốt xoá); Task3 tách 3 câu theo nhóm mục con
 * (đăng nhập+danh sách=1.5, xoá=1.0, thêm/sửa=1.5) để rubric rõ ràng.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE3.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE3.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given Mongoose schema (3 collections — a nation has many foods, each food belongs to one nation):</b>` +
  `<pre><code class="language-javascript">nations({
    nationName: { type: String, required: true, unique: true },
    continent: { type: String, required: true },
}, { timestamps: true });

foods({
    foodName: { type: String, required: true, unique: true },
    foodDescription: { type: String, required: true },
    imageUrl: { type: String, required: true },
    calories: { type: Number, required: true, min: 700, max: 1500 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isVegetarian: { type: Boolean, default: false },
    nation: { type: mongoose.Schema.Types.ObjectId, ref: "nation", required: true },
}, { timestamps: true });

users({
    name: { type: String, required: true },
    key: { type: String, required: true },
}, { timestamps: true });</code></pre></div>`,
  `<div class="pe-system"><b>Schema Mongoose đề cho (3 bảng — 1 nation có nhiều food, mỗi food thuộc 1 nation):</b>` +
  `<pre><code class="language-javascript">nations({
    nationName: { type: String, required: true, unique: true },
    continent: { type: String, required: true },
}, { timestamps: true });

foods({
    foodName: { type: String, required: true, unique: true },
    foodDescription: { type: String, required: true },
    imageUrl: { type: String, required: true },
    calories: { type: Number, required: true, min: 700, max: 1500 },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isVegetarian: { type: Boolean, default: false },
    nation: { type: mongoose.Schema.Types.ObjectId, ref: "nation", required: true },
}, { timestamps: true });

users({
    name: { type: String, required: true },
    key: { type: String, required: true },
}, { timestamps: true });</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Fall 2025) — FOODEX Management System</strong>. Tools: VS Code, MongoDB Compass, Postman, MongoDB V6+. Build a part of the FOODEX system: a nation has many foods, each food belongs to one nation. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. StudentCode used in examples: <code>se171234</code>; JWT secret pattern: <code>&lt;StudentCode&gt;!@</code> (e.g. <code>se171234!@</code>).</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Fall 2025) — Hệ thống quản lý FOODEX</strong>. Công cụ: VS Code, MongoDB Compass, Postman, MongoDB V6+. Xây 1 phần hệ thống FOODEX: 1 nation có nhiều food, mỗi food thuộc 1 nation. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. StudentCode dùng trong ví dụ: <code>se171234</code>; mẫu JWT secret: <code>&lt;StudentCode&gt;!@</code> (VD <code>se171234!@</code>).</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 01 (1.0 mark):</strong> use the Express generator to develop the new REST API server, create the related nations, and migrate them into a MongoDB database named <code>SDN302_FA25_StudentCodeDB</code>.</p>`,
    `<p><strong>Task 01 (1.0 điểm):</strong> dùng Express generator dựng REST API server, tạo các nation liên quan, và nạp vào database MongoDB tên <code>SDN302_FA25_StudentCodeDB</code>.</p>`,
  ),
  starterCode:
`// ===== models/nation.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const NationSchema = new Schema({
    nationName: { type: String, required: true, unique: true },
    continent: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("nation", NationSchema);

// ===== seed/seed-nations.js =====
require("dotenv").config();
const mongoose = require("mongoose");
const Nation = require("../models/nation.model");
const nationsData = require("../data/nations.json");

async function seed() {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
}

seed();`,
  sampleSolution:
`// ===== models/nation.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const NationSchema = new Schema({
    nationName: { type: String, required: true, unique: true },
    continent: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("nation", NationSchema);

// ===== seed/seed-nations.js =====
require("dotenv").config();
const mongoose = require("mongoose");
const Nation = require("../models/nation.model");
const nationsData = require("../data/nations.json");

async function seed() {
    // ---------- Student's code starts from here ----------
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: "SDN302_FA25_StudentCodeDB",
        });
        console.log("Connected to MongoDB");

        await Nation.deleteMany({});
        const inserted = await Nation.insertMany(
            nationsData.map(({ _id, ...rest }) => rest)
        );
        console.log(\`Seeded \${inserted.length} nations\`);
    } catch (error) {
        console.error("Seed failed:", error.message);
    } finally {
        await mongoose.disconnect();
    }
    // -------------------------------------------------------
}

seed();

// ===== .env (values only, keys required by the paper's own rules) =====
// MONGO_URI=mongodb://127.0.0.1:27017
// PORT=5000
// JWT_SECRET=se171234!@`,
  explanation: B(
    `<p>Strips each seed record's original <code>_id</code> (from <code>nations.json</code>'s exported <code>{"$oid": "..."}</code> shape) before inserting, letting MongoDB assign fresh ids for the new <code>SDN302_FA25_StudentCodeDB</code> database rather than colliding with or hardcoding the source export's ids. Connection string and port are read from <code>.env</code>, per the paper's own "store your MongoDB connection string... in the .env file" rule (violating it scores 0 regardless of correctness elsewhere).</p>`,
    `<p>Bỏ <code>_id</code> gốc của mỗi bản ghi seed (từ dạng export <code>{"$oid": "..."}</code> của <code>nations.json</code>) trước khi chèn, để MongoDB tự gán id mới cho database <code>SDN302_FA25_StudentCodeDB</code> mới thay vì trùng hoặc gán cứng id của bản export nguồn. Connection string và port đọc từ <code>.env</code>, đúng luật chính đề "lưu connection string MongoDB... vào file .env" (vi phạm sẽ 0 điểm bất kể đúng sai chỗ khác).</p>`,
  ),
  rubric: [
    { id: 'express_generator_structure', criterion: B('Project follows the standard Express-generator structure (app.js/bin/www, routes, models folders).', 'Dự án theo đúng cấu trúc Express-generator chuẩn (app.js/bin/www, thư mục routes, models).'), weight: 1, maxScore: 0.3 },
    { id: 'nation_schema_matches', criterion: B('Nation model matches the given schema exactly (nationName unique+required, continent required, timestamps).', 'Model Nation khớp đúng schema đề cho (nationName unique+required, continent required, timestamps).'), weight: 1, maxScore: 0.3 },
    { id: 'seed_into_correct_db', criterion: B('Nations from the given JSON are correctly migrated into a database literally named SDN302_FA25_StudentCodeDB (with the real student code substituted).', 'Nation từ JSON đề cho được nạp đúng vào database tên đúng SDN302_FA25_StudentCodeDB (thay đúng student code thật).'), weight: 1, maxScore: 0.4 },
  ],
};

const q2 = {
  kind: 'CODE', points: 5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 02 (5.0 marks):</strong> create a new REST API server for the <code>nation</code> collection, using JSON Web Token (JWT) to authenticate the API. The secret key of JWT must be <code>&lt;StudentCode&gt;!@</code> (e.g. <code>se171234!@</code>) and stored in the <code>.env</code> file. Route paths: <code>POST http://yourdomain/auth/signin</code> to generate the JWT (account credentials from users.json: name <code>foodreviewer</code>, key <code>123456789</code>); <code>http://yourdomain/api/v1/nations</code> and <code>http://yourdomain/api/v1/nations/:id</code> for all CRUD methods related to nations. For the DELETE operation, ensure a nation cannot be deleted if any foods reference it (i.e. documents in the food collection referencing the nation's <code>_id</code>) — return an appropriate error message (e.g. "Cannot delete nation because it has associated foods") if deletion is attempted in such cases.</p>`,
    `<p><strong>Task 02 (5.0 điểm):</strong> xây REST API mới cho bảng <code>nation</code>, dùng JWT xác thực API. Secret key JWT phải là <code>&lt;StudentCode&gt;!@</code> (VD <code>se171234!@</code>) lưu trong <code>.env</code>. Route: <code>POST http://yourdomain/auth/signin</code> sinh JWT (tài khoản từ users.json: name <code>foodreviewer</code>, key <code>123456789</code>); <code>http://yourdomain/api/v1/nations</code> và <code>http://yourdomain/api/v1/nations/:id</code> cho mọi CRUD nation. Với DELETE, đảm bảo không xoá được nation nếu có food nào tham chiếu tới _id của nó — trả lỗi phù hợp (VD "Cannot delete nation because it has associated foods") nếu cố xoá trong trường hợp đó.</p>`,
  ),
  starterCode:
`// ===== models/user.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true },
    key: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("user", UserSchema);

// ===== controllers/auth.controller.js =====
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const User = db.user;

const signin = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { signin };

// ===== middlewares/auth.middleware.js =====
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = authMiddleware;

// ===== controllers/nation.controller.js =====
const db = require("../models/index");
const Nation = db.nation;
const Food = db.food;

const findAll = async (req, res, next) => { /* ... */ };
const findOne = async (req, res, next) => { /* ... */ };
const create = async (req, res, next) => { /* ... */ };
const update = async (req, res, next) => { /* ... */ };
const remove = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { findAll, findOne, create, update, remove };

// ===== routes/nation.routes.js =====
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const NationController = require("../controllers/nation.controller");

// ---------- Student's code starts from here ----------

// -------------------------------------------------------

module.exports = router;`,
  sampleSolution:
`// ===== models/user.model.js =====
const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
    name: { type: String, required: true },
    key: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("user", UserSchema);

// ===== controllers/auth.controller.js =====
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const User = db.user;

const signin = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { name, key } = req.body;
        const user = await User.findOne({ name });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // users.json stores 'key' already bcrypt-hashed — compare, never string-equal
        const isMatch = await bcrypt.compare(key, user.key);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user._id, name: user.name },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );
        res.json({ token });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { signin };

// ===== middlewares/auth.middleware.js =====
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    // ---------- Student's code starts from here ----------
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid token" });
    }
    // -------------------------------------------------------
};

module.exports = authMiddleware;

// ===== controllers/nation.controller.js =====
const db = require("../models/index");
const Nation = db.nation;
const Food = db.food;

const findAll = async (req, res, next) => {
    try {
        res.json(await Nation.find());
    } catch (error) { next(error); }
};

const findOne = async (req, res, next) => {
    try {
        const nation = await Nation.findById(req.params.id);
        if (!nation) return res.status(404).json({ message: "Nation not found" });
        res.json(nation);
    } catch (error) { next(error); }
};

const create = async (req, res, next) => {
    try {
        const nation = await Nation.create(req.body);
        res.status(201).json(nation);
    } catch (error) { next(error); }
};

const update = async (req, res, next) => {
    try {
        const nation = await Nation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!nation) return res.status(404).json({ message: "Nation not found" });
        res.json(nation);
    } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { id } = req.params;

        const hasFoods = await Food.exists({ nation: id });
        if (hasFoods) {
            return res.status(400).json({
                message: "Cannot delete nation because it has associated foods",
            });
        }

        const deleted = await Nation.findByIdAndDelete(id);
        if (!deleted) return res.status(404).json({ message: "Nation not found" });

        res.json({ message: "Nation deleted successfully" });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { findAll, findOne, create, update, remove };

// ===== routes/nation.routes.js =====
const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth.middleware");
const NationController = require("../controllers/nation.controller");

// ---------- Student's code starts from here ----------
router.get("/", authMiddleware, NationController.findAll);
router.get("/:id", authMiddleware, NationController.findOne);
router.post("/", authMiddleware, NationController.create);
router.put("/:id", authMiddleware, NationController.update);
router.delete("/:id", authMiddleware, NationController.remove);
// -------------------------------------------------------

module.exports = router;

// ===== app.js (relevant excerpt) =====
// app.use("/auth", authRoutes);           // POST /auth/signin — no authMiddleware
// app.use("/api/v1/nations", nationRoutes); // every route inside requires the JWT`,
  explanation: B(
    `<p><b>Caught a real detail from the given seed data</b>: <code>users.json</code>'s <code>key</code> field is already a bcrypt hash (<code>$2b$10$...</code>), not a plaintext string — so <code>signin</code> must use <code>bcrypt.compare(key, user.key)</code>, never a direct <code>===</code> comparison (which would always fail against the hash). <code>authMiddleware</code> reads the <code>Authorization: Bearer &lt;token&gt;</code> header (the same pattern shown in the paper's own reference note) and is applied to every nation route except <code>/auth/signin</code> itself (a JWT can't gate the very endpoint that issues it). The DELETE guard uses <code>Food.exists({ nation: id })</code> — a lightweight existence check rather than fetching whole food documents — before allowing <code>findByIdAndDelete</code>, exactly matching the paper's required error message.</p>`,
    `<p><b>Bắt đúng 1 chi tiết thật từ dữ liệu seed đề cho</b>: field <code>key</code> trong <code>users.json</code> ĐÃ băm bcrypt sẵn (<code>$2b$10$...</code>), không phải chuỗi thô — nên <code>signin</code> phải dùng <code>bcrypt.compare(key, user.key)</code>, không bao giờ so <code>===</code> trực tiếp (sẽ luôn sai so với hash). <code>authMiddleware</code> đọc header <code>Authorization: Bearer &lt;token&gt;</code> (đúng mẫu ghi trong ghi chú tham khảo của đề) và áp cho mọi route nation trừ chính <code>/auth/signin</code> (JWT không thể chặn đúng endpoint sinh ra nó). Chốt DELETE dùng <code>Food.exists({ nation: id })</code> — kiểm tồn tại nhẹ thay vì tải cả document food — trước khi cho <code>findByIdAndDelete</code>, khớp đúng thông điệp lỗi đề yêu cầu.</p>`,
  ),
  rubric: [
    { id: 'signin_generates_jwt', criterion: B('POST /auth/signin correctly validates credentials against the bcrypt-hashed key (using bcrypt.compare, not a plaintext comparison) and returns a valid JWT signed with the secret from .env.', 'POST /auth/signin kiểm đúng thông tin đăng nhập so key đã băm bcrypt (dùng bcrypt.compare, không so chuỗi thô) và trả JWT hợp lệ ký bằng secret từ .env.'), weight: 1, maxScore: 1 },
    { id: 'jwt_middleware_protects_routes', criterion: B('All CRUD routes for nations require a valid JWT (via an auth middleware verifying the Bearer token), while /auth/signin itself is not gated.', 'Mọi route CRUD nation yêu cầu JWT hợp lệ (qua middleware xác thực Bearer token), riêng /auth/signin không bị chặn.'), weight: 1, maxScore: 1 },
    { id: 'crud_implemented', criterion: B('All CRUD operations (list, get one, create, update, delete) are correctly implemented for the nation collection at the specified routes.', 'Đủ mọi thao tác CRUD (liệt kê, lấy 1, tạo, sửa, xoá) triển khai đúng cho bảng nation tại đúng route.'), weight: 1, maxScore: 1.5 },
    { id: 'delete_guard_correct', criterion: B('DELETE correctly checks for any food referencing the nation before deleting, and returns the appropriate error message ("Cannot delete nation because it has associated foods") when foods exist, allowing deletion only when none do.', 'DELETE kiểm đúng có food nào tham chiếu nation trước khi xoá, trả đúng thông điệp lỗi ("Cannot delete nation because it has associated foods") khi còn food, chỉ cho xoá khi không còn.'), weight: 1, maxScore: 1.5 },
  ],
};

const q3 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.1-3.2 (1.5 marks):</strong> client application for food management using a template engine (EJS, Handlebars, or Pug). <b>Authentication:</b> at the login view (<code>http://yourdomain/auth/login</code>), users enter account name and key, checked against the bcrypt-hashed 'users' collection. Authentication is required for all CRUD actions; error messages must display on login failure. After a successful login, users are redirected to the foods view. <b>Foods list:</b> after login, display a list of all foods using a <b>card view</b> (not a table): foodName, rating, calories, isVegetarian, and the nation name — at route <code>http://yourdomain/page/foods</code>.</p>`,
    `<p><strong>Task 03.1-3.2 (1.5 điểm):</strong> app client quản lý food dùng template engine (EJS, Handlebars, hoặc Pug). <b>Xác thực:</b> tại view đăng nhập (<code>http://yourdomain/auth/login</code>), nhập tên tài khoản và key, kiểm so bảng 'users' đã băm bcrypt. Bắt buộc xác thực cho mọi thao tác CRUD; hiện thông báo lỗi khi đăng nhập sai. Đăng nhập thành công chuyển hướng tới foods view. <b>Danh sách food:</b> sau đăng nhập, hiện danh sách food dạng <b>card view</b> (không phải bảng): foodName, rating, calories, isVegetarian, và tên nation — tại route <code>http://yourdomain/page/foods</code>.</p>`,
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
const Food = db.food;

const showLogin = (req, res) => res.render("login", { error: null });

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const listFoods = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { showLogin, login, listFoods };`,
  sampleSolution:
`// ===== middlewares/pageAuth.middleware.js =====
const ensureLoggedIn = (req, res, next) => {
    // ---------- Student's code starts from here ----------
    if (!req.session.userId) {
        return res.redirect("/auth/login");
    }
    next();
    // -------------------------------------------------------
};
module.exports = ensureLoggedIn;

// ===== controllers/page.controller.js =====
const bcrypt = require("bcrypt");
const db = require("../models/index");
const User = db.user;
const Food = db.food;

const showLogin = (req, res) => res.render("login", { error: null });

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { name, key } = req.body;
        const user = await User.findOne({ name });
        const isMatch = user ? await bcrypt.compare(key, user.key) : false;

        if (!user || !isMatch) {
            return res.render("login", { error: "Invalid account name or key." });
        }

        req.session.userId = user._id;
        res.redirect("/page/foods");
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

const listFoods = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const foods = await Food.find().populate("nation", "nationName").lean();
        res.render("foods", { foods });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { showLogin, login, listFoods };

// ===== views/foods.ejs (card view excerpt) =====
// <% foods.forEach(function(food) { %>
//   <div class="food-card">
//     <h3><%= food.foodName %></h3>
//     <p>Rating: <%= '★'.repeat(food.rating) + '☆'.repeat(5 - food.rating) %></p>
//     <p>Calories: <%= food.calories %></p>
//     <p>Vegetarian: <%= food.isVegetarian ? 'Yes' : 'No' %></p>
//     <p>Nation: <%= food.nation ? food.nation.nationName : '' %></p>
//   </div>
// <% }); %>`,
  explanation: B(
    `<p>Uses <code>express-session</code> (rather than storing the JWT from Task 2 in the browser) since this is a traditional server-rendered page flow with redirects, not an API client — <code>req.session.userId</code> is set on successful login and checked by <code>ensureLoggedIn</code> on every protected page route. The same bcrypt-hash check from Task 2's <code>/auth/signin</code> is reused here (both must validate against the same hashed <code>key</code> field). Foods are populated with just <code>nationName</code> (not the whole nation document) since that's the only nation field the card view needs.</p>`,
    `<p>Dùng <code>express-session</code> (không phải lưu JWT từ Task 2 vào trình duyệt) vì đây là luồng trang render phía server truyền thống có redirect, không phải client API — <code>req.session.userId</code> gán khi đăng nhập thành công, kiểm bởi <code>ensureLoggedIn</code> ở mọi route trang được bảo vệ. Cùng cách kiểm bcrypt-hash từ <code>/auth/signin</code> Task 2 dùng lại ở đây (cả 2 phải kiểm đúng cùng field <code>key</code> đã băm). Food populate chỉ <code>nationName</code> (không cả document nation) vì đó là field duy nhất card view cần.</p>`,
  ),
  rubric: [
    { id: 'login_validates_hashed_key', criterion: B('Login form checks the entered key against the bcrypt-hashed key field (not a plaintext comparison), showing an error message on failure and redirecting to the foods view on success.', 'Form đăng nhập kiểm đúng key nhập so field key đã băm bcrypt (không so chuỗi thô), hiện lỗi khi sai, chuyển hướng foods view khi đúng.'), weight: 1, maxScore: 0.6 },
    { id: 'crud_requires_auth', criterion: B('All food CRUD page routes are protected by an authentication check (redirecting to login when not authenticated).', 'Mọi route trang CRUD food được bảo vệ bởi kiểm xác thực (chuyển hướng đăng nhập khi chưa xác thực).'), weight: 1, maxScore: 0.4 },
    { id: 'foods_card_view_correct', criterion: B('Foods list renders as a card view (not a table), showing foodName, rating (as stars), calories, isVegetarian, and the populated nation name.', 'Danh sách food render dạng card (không phải bảng), hiện foodName, rating (dạng sao), calories, isVegetarian, và tên nation đã populate.'), weight: 1, maxScore: 0.5 },
  ],
};

const q4 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.3 (1.0 mark):</strong> after successful login, allow deletion of a selected food by confirming the action and notifying the result. Route: <code>http://yourdomain/page/foods/:id</code>.</p>`,
    `<p><strong>Task 03.3 (1.0 điểm):</strong> sau đăng nhập, cho phép xoá 1 food đã chọn kèm xác nhận hành động và thông báo kết quả. Route: <code>http://yourdomain/page/foods/:id</code>.</p>`,
  ),
  starterCode:
`// ===== controllers/page.controller.js (excerpt) =====
const deleteFood = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};
module.exports.deleteFood = deleteFood;

// ===== views/foods.ejs (delete button excerpt) =====
// <form method="POST" action="/page/foods/<%= food._id %>?_method=DELETE"
//       onsubmit="/* ---------- Student's code starts from here ---------- */">
//   <button type="submit">Delete</button>
// </form>`,
  sampleSolution:
`// ===== controllers/page.controller.js (excerpt) =====
const deleteFood = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const deleted = await Food.findByIdAndDelete(req.params.id);
        if (!deleted) {
            req.flash = { type: "error", message: "Food not found." };
        } else {
            req.flash = { type: "success", message: \`"\${deleted.foodName}" deleted successfully.\` };
        }
        res.redirect("/page/foods");
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};
module.exports.deleteFood = deleteFood;

// ===== views/foods.ejs (delete button excerpt) =====
// <form method="POST" action="/page/foods/<%= food._id %>?_method=DELETE"
//       onsubmit="return confirm('Delete \\'' + '<%= food.foodName %>' + '\\'? This cannot be undone.');">
//   <button type="submit">Delete</button>
// </form>

// ===== routes/page.routes.js (relevant excerpt) =====
// const methodOverride = require("method-override");
// router.use(methodOverride("_method"));
// router.delete("/foods/:id", ensureLoggedIn, PageController.deleteFood);`,
  explanation: B(
    `<p>HTML forms cannot natively send a DELETE request, so <code>method-override</code> (reading a <code>?_method=DELETE</code> query param) is used to route the form's POST through as a DELETE — a standard EJS/server-rendered-app pattern for RESTful-style routes. The browser's native <code>confirm()</code> dialog satisfies "confirming the action" before the form actually submits; the result (success or "not found") is communicated back after the redirect (e.g. via flash message), satisfying "notifying the result."</p>`,
    `<p>Form HTML không gửi được DELETE trực tiếp, nên dùng <code>method-override</code> (đọc query param <code>?_method=DELETE</code>) để route POST của form thành DELETE — mẫu chuẩn cho app render server kiểu EJS muốn route theo phong cách RESTful. Hộp thoại <code>confirm()</code> gốc trình duyệt thoả "xác nhận hành động" trước khi form thực sự gửi; kết quả (thành công hay "không tìm thấy") báo lại sau redirect (VD qua flash message), thoả "thông báo kết quả".</p>`,
  ),
  rubric: [
    { id: 'confirmation_before_delete', criterion: B('The user is asked to confirm before a food is actually deleted (e.g. a confirm dialog or a confirmation view/modal).', 'Người dùng được hỏi xác nhận trước khi food thực sự bị xoá (VD hộp thoại confirm hoặc view/modal xác nhận).'), weight: 1, maxScore: 0.5 },
    { id: 'deletion_and_result_notification', criterion: B('The selected food is correctly deleted from the database, and the result (success/failure) is communicated to the user.', 'Food đã chọn bị xoá đúng khỏi database, và kết quả (thành công/thất bại) được báo cho người dùng.'), weight: 1, maxScore: 0.5 },
  ],
};

const q5 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Task 03.4-3.5 (1.5 marks):</strong> after successful login, add a new food that meets the requirements using a modal form (route <code>http://yourdomain/page/foods</code>), and allow updating the food list with the same requirements (route <code>http://yourdomain/page/foods/:id</code>). Requirements: all fields required; <code>foodName</code> must contain only letters (a-z, A-Z) and spaces, and must be unique; <code>calories</code> must be a number between 700 and 1500; <code>rating</code> entered as a number, displayed as a corresponding number of stars (e.g. {'rating': 3} =&gt; ★★★); <code>isVegetarian</code> must be a toggle/switch control; <code>nation</code> must be a select control with options showing <code>nationName</code> values from the nation collection.</p>`,
    `<p><strong>Task 03.4-3.5 (1.5 điểm):</strong> sau đăng nhập, thêm food mới đủ yêu cầu bằng modal form (route <code>http://yourdomain/page/foods</code>), và cho phép sửa food với cùng yêu cầu (route <code>http://yourdomain/page/foods/:id</code>). Yêu cầu: mọi trường bắt buộc; <code>foodName</code> chỉ gồm chữ cái (a-z, A-Z) và khoảng trắng, phải duy nhất; <code>calories</code> là số 700-1500; <code>rating</code> nhập dạng số, hiện thành số sao tương ứng (VD {'rating': 3} =&gt; ★★★); <code>isVegetarian</code> phải là toggle/switch; <code>nation</code> phải là select với option hiện <code>nationName</code> từ bảng nation.</p>`,
  ),
  starterCode:
`// ===== controllers/page.controller.js (excerpt) =====
const FOODNAME_RE = /^[a-zA-Z\\s]+$/;

const validateFoodInput = (body) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const createFood = async (req, res, next) => { /* uses validateFoodInput, then Food.create */ };
const updateFood = async (req, res, next) => { /* uses validateFoodInput, then Food.findByIdAndUpdate */ };

module.exports.createFood = createFood;
module.exports.updateFood = updateFood;`,
  sampleSolution:
`// ===== controllers/page.controller.js (excerpt) =====
const FOODNAME_RE = /^[a-zA-Z\\s]+$/;

const validateFoodInput = async (body, excludeId) => {
    // ---------- Student's code starts from here ----------
    const errors = [];
    const { foodName, foodDescription, imageUrl, calories, rating, isVegetarian, nation } = body;

    if (!foodName || !foodDescription || !imageUrl || calories == null || rating == null || !nation) {
        errors.push("All fields are required.");
    }
    if (foodName && !FOODNAME_RE.test(foodName)) {
        errors.push("foodName must contain only letters and spaces.");
    }
    if (foodName) {
        const query = { foodName };
        if (excludeId) query._id = { \$ne: excludeId };
        const duplicate = await Food.findOne(query);
        if (duplicate) errors.push("foodName must be unique.");
    }
    const cal = Number(calories);
    if (Number.isNaN(cal) || cal < 700 || cal > 1500) {
        errors.push("calories must be a number between 700 and 1500.");
    }
    const rate = Number(rating);
    if (Number.isNaN(rate) || rate < 1 || rate > 5) {
        errors.push("rating must be a number between 1 and 5.");
    }

    return errors;
    // -------------------------------------------------------
};

const createFood = async (req, res, next) => {
    try {
        const errors = await validateFoodInput(req.body, null);
        if (errors.length) {
            const nations = await Nation.find();
            return res.render("foods", { foods: await Food.find().populate("nation"), nations, errors });
        }

        await Food.create({
            foodName: req.body.foodName,
            foodDescription: req.body.foodDescription,
            imageUrl: req.body.imageUrl,
            calories: Number(req.body.calories),
            rating: Number(req.body.rating),
            isVegetarian: req.body.isVegetarian === "on" || req.body.isVegetarian === true,
            nation: req.body.nation,
        });
        res.redirect("/page/foods");
    } catch (error) {
        next(error);
    }
};

const updateFood = async (req, res, next) => {
    try {
        const errors = await validateFoodInput(req.body, req.params.id);
        if (errors.length) {
            const nations = await Nation.find();
            return res.render("foods", { foods: await Food.find().populate("nation"), nations, errors });
        }

        await Food.findByIdAndUpdate(req.params.id, {
            foodName: req.body.foodName,
            foodDescription: req.body.foodDescription,
            imageUrl: req.body.imageUrl,
            calories: Number(req.body.calories),
            rating: Number(req.body.rating),
            isVegetarian: req.body.isVegetarian === "on" || req.body.isVegetarian === true,
            nation: req.body.nation,
        }, { runValidators: true });
        res.redirect("/page/foods");
    } catch (error) {
        next(error);
    }
};

module.exports.createFood = createFood;
module.exports.updateFood = updateFood;

// ===== views/foods.ejs (add/edit modal form excerpt) =====
// <form method="POST" action="/page/foods">
//   <input name="foodName" pattern="[a-zA-Z\\s]+" required />
//   <textarea name="foodDescription" required></textarea>
//   <input name="imageUrl" type="url" required />
//   <input name="calories" type="number" min="700" max="1500" required />
//   <input name="rating" type="number" min="1" max="5" required />
//   <input name="isVegetarian" type="checkbox" role="switch" />
//   <select name="nation" required>
//     <% nations.forEach(function(n) { %>
//       <option value="<%= n._id %>"><%= n.nationName %></option>
//     <% }); %>
//   </select>
//   <button type="submit">Save</button>
// </form>`,
  explanation: B(
    `<p><code>validateFoodInput</code> is shared between create and update (with an <code>excludeId</code> parameter for the uniqueness check, so editing a food doesn't collide with itself). Star display (<code>'★'.repeat(rating) + '☆'.repeat(5-rating)</code>, as in Task 03.2's card view) is a presentation-only transform — the stored <code>rating</code> field stays a plain number 1-5, matching the schema and the "entered as a numerical rating, then displayed as..." wording (input is numeric, display is stars, not the reverse). The nation <code>&lt;select&gt;</code> options are rendered from the live nation collection (not hardcoded), matching "options displaying nationName values from the nation collection."</p>`,
    `<p><code>validateFoodInput</code> dùng chung cho create và update (có tham số <code>excludeId</code> cho kiểm duy nhất, để sửa 1 food không tự đụng chính nó). Hiện sao (<code>'★'.repeat(rating) + '☆'.repeat(5-rating)</code>, như card view Task 03.2) chỉ là biến đổi hiển thị — field <code>rating</code> lưu vẫn là số thường 1-5, khớp schema và đúng câu "nhập dạng rating số, rồi hiện thành..." (input là số, hiện thị là sao, không ngược lại). Option <code>&lt;select&gt;</code> nation render từ bảng nation sống (không cứng), khớp "option hiện giá trị nationName từ bảng nation".</p>`,
  ),
  rubric: [
    { id: 'all_fields_required', criterion: B('All fields are validated as required in both add and edit flows.', 'Mọi trường được kiểm bắt buộc ở cả luồng thêm và sửa.'), weight: 1, maxScore: 0.2 },
    { id: 'foodname_pattern_and_unique', criterion: B('foodName is validated to contain only letters and spaces, and checked for uniqueness (excluding the food being edited, for the update case).', 'foodName kiểm đúng chỉ chữ cái và khoảng trắng, và kiểm duy nhất (loại trừ chính food đang sửa, cho trường hợp update).'), weight: 1, maxScore: 0.4 },
    { id: 'calories_range', criterion: B('calories is validated as a number strictly between 700 and 1500.', 'calories kiểm đúng là số trong khoảng 700-1500.'), weight: 1, maxScore: 0.3 },
    { id: 'rating_stars_display', criterion: B('rating is entered/stored as a plain number (1-5) but displayed as the corresponding number of stars.', 'rating nhập/lưu dạng số thường (1-5) nhưng hiện thị đúng số sao tương ứng.'), weight: 1, maxScore: 0.3 },
    { id: 'isvegetarian_toggle', criterion: B('isVegetarian uses a toggle/switch control, not a plain text input.', 'isVegetarian dùng control toggle/switch, không phải input chữ thường.'), weight: 1, maxScore: 0.2 },
    { id: 'nation_select_from_data', criterion: B('nation is a select control populated with real nationName options from the nation collection (not hardcoded).', 'nation là select lấy option nationName thật từ bảng nation (không cứng).'), weight: 1, maxScore: 0.1 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE3',
    title: 'SDN302 – Practical Exam (Fall 2025), FOODEX Management System|||SDN302 – Thi thực hành (Fall 2025), Hệ thống quản lý FOODEX',
    description: 'SDN302 PE (CODE): JWT-authenticated REST API for nations (with a delete guard against referencing foods) plus a server-rendered EJS/Handlebars client for food CRUD with full form validation, AI-graded.|||PE SDN302 (viết mã): REST API xác thực JWT cho nation (kèm chốt xoá chặn khi còn food tham chiếu) cộng client render server EJS/Handlebars cho CRUD food với validation đầy đủ, chấm AI.',
    durationMinutes: 90,
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
