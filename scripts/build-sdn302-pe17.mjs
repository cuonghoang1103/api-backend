/**
 * build-sdn302-pe17.mjs — sinh content/exams/SDN302-PE17.mjs.
 *
 * Nguồn thật: "SDN302 - SU26 - PE - Trial1 - Paper 2" — Online Cinema
 * Ticket Booking (movies/rooms/showtimes/tickets/users). Không có
 * solution — chỉ có 5 file JSON seed (đã đọc kỹ xác nhận đúng tên
 * field thật: room.capacity + room.seats[{_id,type}] với _id LÀ CHÍNH
 * mã ghế dạng chuỗi "A1" chứ không phải ObjectId; ticket dùng
 * "showTimeId" viết hoa chữ T giữa, không phải "showtimeId"; showtime
 * đã có sẵn field endTime lưu — nhưng Câu 3 vẫn phải TỰ TÍNH lại
 * endTime khi tạo mới, không đọc endTime có sẵn của record khác).
 *
 * ⚠️ Câu 3: điều kiện overlap đề cho VIẾT LẶP LỖI — "existing.startTime
 * < newEndTime AND existing.startTime < newEndTime" (cùng 1 vế nhắc
 * lại 2 lần, rõ ràng là lỗi đánh máy trong đề). Dùng điều kiện overlap
 * CHUẨN CỦA NGÀNH thay vào: existing.startTime < newEndTime AND
 * existing.endTime > newStartTime — nếu làm đúng NGUYÊN VĂN câu chữ đề
 * (rút gọn còn đúng 1 vế do lặp) sẽ báo overlap SAI cho rất nhiều
 * showtime không hề chồng giờ thật.
 *
 * ⚠️ Xác thực dùng header "access_key" thô (không phải JWT/Bearer),
 * cùng mẫu đã dùng ở PE11 (đặt vé xem phim khác trong môn) — user tra
 * theo access_key trong seed thật (VD đề "123456abcdef" chỉ minh hoạ,
 * seed thật dùng "cust_key_a"/"admin_key_1"/...).
 *
 * Điểm gốc: Q1=1.5, Q2=2.5, Q3=3.5, Q4=2.5 (tổng 10).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE17.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE17.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given data shape (collections: movies, rooms, showtimes, tickets, users — database "SDN_Trial"):</b>` +
  `<pre><code class="language-javascript">// movie
{ title: String, duration: Number /* minutes */, status: String /* "NOW_SHOWING"|... */, genre: [String], description: String }

// room
{ roomName: String, capacity: Number, seats: [{ _id: String /* seat number, e.g. "A1" */, type: String /* "VIP"|"NORMAL" */ }] }

// showtime
{ movieId: ObjectId /* ref movie */, roomId: ObjectId /* ref room */,
  startTime: Date, endTime: Date, price: Number }

// ticket
{ showTimeId: ObjectId /* ref showtime — note capital T */, seatId: String /* matches room.seats[]._id */,
  userId: ObjectId /* ref user */, price: Number, status: String /* "paid"|"booked"|... */,
  bookedAt: Date, paymentMethod: String }

// user
{ name: String, role: String /* "customer"|"admin"|"staff" */, email: String,
  password: String, phone: String, access_key: String }</code></pre></div>`,
  `<div class="pe-system"><b>Hình dạng dữ liệu đề cho (bảng: movies, rooms, showtimes, tickets, users — database "SDN_Trial"):</b>` +
  `<pre><code class="language-javascript">// movie
{ title: String, duration: Number /* phút */, status: String /* "NOW_SHOWING"|... */, genre: [String], description: String }

// room
{ roomName: String, capacity: Number, seats: [{ _id: String /* mã ghế, VD "A1" */, type: String /* "VIP"|"NORMAL" */ }] }

// showtime
{ movieId: ObjectId /* ref movie */, roomId: ObjectId /* ref room */,
  startTime: Date, endTime: Date, price: Number }

// ticket
{ showTimeId: ObjectId /* ref showtime — chú ý T viết hoa */, seatId: String /* khớp room.seats[]._id */,
  userId: ObjectId /* ref user */, price: Number, status: String /* "paid"|"booked"|... */,
  bookedAt: Date, paymentMethod: String }

// user
{ name: String, role: String /* "customer"|"admin"|"staff" */, email: String,
  password: String, phone: String, access_key: String }</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Trial 1, Paper 2) — Online Cinema Ticket Booking platform</strong>. Build a RESTful API only. Protected routes must implement authorization middleware based on the <code>access_key</code> request header (not JWT). This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Trial 1, Đề 2) — Nền tảng đặt vé xem phim online</strong>. Chỉ xây RESTful API. Route được bảo vệ phải triển khai middleware phân quyền dựa trên header <code>access_key</code> (không phải JWT). Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 1 (1.5 points): Retrieve All Rooms (Sorted)</strong></p>` +
    `<p><b>Endpoint:</b> <code>GET /api/rooms</code></p>` +
    `<p><b>Business Rules:</b> sort rooms by <code>roomName</code> in descending order. Return: <code>id</code>, <code>name</code>, <code>totalSeats</code>, <code>vipCount</code> (number of VIP seats).</p>` +
    `<pre><code class="language-json">// 200 (OK)
[
  { "id": "65fb00000000000000000005", "name": "Room E", "totalSeats": 6, "vipCount": 3 },
  "......"
]</code></pre>`,
    `<p><strong>Câu 1 (1.5 điểm): Lấy mọi phòng chiếu (đã sắp xếp)</strong></p>` +
    `<p><b>Endpoint:</b> <code>GET /api/rooms</code></p>` +
    `<p><b>Quy tắc nghiệp vụ:</b> sắp xếp phòng theo <code>roomName</code> giảm dần. Trả: <code>id</code>, <code>name</code>, <code>totalSeats</code>, <code>vipCount</code> (số ghế VIP).</p>` +
    `<pre><code class="language-json">// 200 (OK)
[
  { "id": "65fb00000000000000000005", "name": "Room E", "totalSeats": 6, "vipCount": 3 },
  "......"
]</code></pre>`,
  ),
  starterCode:
`// ===== controllers/room.controller.js =====
const db = require("../models/index");
const Room = db.room;

const getAllRooms = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getAllRooms };`,
  sampleSolution:
`// ===== controllers/room.controller.js =====
const db = require("../models/index");
const Room = db.room;

const getAllRooms = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const rooms = await Room.find().sort({ roomName: -1 });

        const result = rooms.map((room) => ({
            id: room._id,
            name: room.roomName,
            totalSeats: room.capacity,
            vipCount: room.seats.filter((s) => s.type === "VIP").length,
        }));

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    // -------------------------------------------------------
};

module.exports = { getAllRooms };`,
  explanation: B(
    `<p><code>totalSeats</code> is read from the room's own <code>capacity</code> field — the schema's dedicated field for this — rather than <code>seats.length</code>; in this exam's seed data the two always agree, but <code>capacity</code> is the field the schema actually designates for it. <code>vipCount</code> must be computed by filtering the embedded <code>seats</code> array (there is no separate stored VIP-count field).</p>`,
    `<p><code>totalSeats</code> đọc từ field <code>capacity</code> của phòng — field schema dành riêng cho việc này — chứ không phải <code>seats.length</code>; trong dữ liệu seed đề này 2 giá trị luôn khớp nhau, nhưng <code>capacity</code> mới là field schema thật sự chỉ định cho việc đó. <code>vipCount</code> phải tính bằng cách lọc mảng <code>seats</code> nhúng (không có field đếm VIP lưu sẵn riêng).</p>`,
  ),
  rubric: [
    { id: 'sorted_descending', criterion: B('Rooms are sorted by roomName in descending order.', 'Phòng được sắp xếp theo roomName giảm dần.'), weight: 1, maxScore: 0.4 },
    { id: 'output_fields_renamed', criterion: B('Response items use "id"/"name" (not "_id"/"roomName") plus totalSeats and vipCount.', 'Item response dùng "id"/"name" (không phải "_id"/"roomName") cùng totalSeats và vipCount.'), weight: 1, maxScore: 0.5 },
    { id: 'vip_count_correct', criterion: B('vipCount correctly counts only seats whose type is VIP.', 'vipCount đếm đúng chỉ ghế type VIP.'), weight: 1, maxScore: 0.6 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 2 (2.5 points): Retrieve Movie Details with Showtimes</strong></p>` +
    `<p><b>Objective:</b> fetch detailed information about a specific movie, including all of its showtimes.</p>` +
    `<p><b>Endpoint:</b> <code>GET /api/movies/:movieId</code></p>` +
    `<p><b>Business Rules:</b> validate movieId format using ObjectId validation (400 if invalid); 404 if movie does not exist; retrieve all showtimes associated with the movie; populate room information to extract room name.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid movieId: 65fa0000000000000000000" }
// 404 (Not Found)
{ "error": "Movie with id: 65fa00000000000000000009 not found" }
// 200 (OK): test with movieId = "65fa00000000000000000001"
{
  "title": "Avengers",
  "duration": 180,
  "description": "Superheroes assemble to save the world.",
  "showtimes": [
    { "roomName": "Room A", "startTime": "2026-03-10T18:30:00.000Z", "price": 90000 },
    { "roomName": "Room B", "startTime": "2026-03-11T18:00:00.000Z", "price": 85000 },
    "......"
  ]
}</code></pre>`,
    `<p><strong>Câu 2 (2.5 điểm): Chi tiết phim kèm showtime</strong></p>` +
    `<p><b>Mục tiêu:</b> lấy thông tin chi tiết 1 phim, kèm mọi showtime của phim đó.</p>` +
    `<p><b>Endpoint:</b> <code>GET /api/movies/:movieId</code></p>` +
    `<p><b>Quy tắc nghiệp vụ:</b> kiểm định dạng movieId bằng ObjectId (400 nếu sai); 404 nếu phim không tồn tại; lấy mọi showtime gắn với phim; populate thông tin phòng để lấy tên phòng.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid movieId: 65fa0000000000000000000" }
// 404 (Not Found)
{ "error": "Movie with id: 65fa00000000000000000009 not found" }
// 200 (OK): test với movieId = "65fa00000000000000000001"
{
  "title": "Avengers",
  "duration": 180,
  "description": "Superheroes assemble to save the world.",
  "showtimes": [
    { "roomName": "Room A", "startTime": "2026-03-10T18:30:00.000Z", "price": 90000 },
    { "roomName": "Room B", "startTime": "2026-03-11T18:00:00.000Z", "price": 85000 },
    "......"
  ]
}</code></pre>`,
  ),
  starterCode:
`// ===== controllers/movie.controller.js =====
const mongoose = require("mongoose");
const db = require("../models/index");
const Movie = db.movie;
const Showtime = db.showtime;

const getMovieDetails = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getMovieDetails };`,
  sampleSolution:
`// ===== controllers/movie.controller.js =====
const mongoose = require("mongoose");
const db = require("../models/index");
const Movie = db.movie;
const Showtime = db.showtime;

const getMovieDetails = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { movieId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ error: \`Invalid movieId: \${movieId}\` });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ error: \`Movie with id: \${movieId} not found\` });
        }

        const showtimes = await Showtime.find({ movieId }).populate("roomId", "roomName");

        res.status(200).json({
            title: movie.title,
            duration: movie.duration,
            description: movie.description,
            showtimes: showtimes.map((st) => ({
                roomName: st.roomId ? st.roomId.roomName : null,
                startTime: st.startTime,
                price: st.price,
            })),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    // -------------------------------------------------------
};

module.exports = { getMovieDetails };`,
  explanation: B(
    `<p>The response deliberately omits <code>genre</code> and <code>status</code> even though the movie schema has them — the paper's own example response only lists <code>title</code>/<code>duration</code>/<code>description</code>/<code>showtimes</code>, so those two fields must not be echoed back. Each showtime entry also drops its own <code>_id</code>/<code>endTime</code>, keeping only <code>roomName</code> (populated)/<code>startTime</code>/<code>price</code> — projecting a response shape narrower than the underlying documents, not a 1:1 dump of them.</p>`,
    `<p>Response cố ý bỏ <code>genre</code> và <code>status</code> dù schema movie có 2 field đó — response mẫu của đề chỉ liệt <code>title</code>/<code>duration</code>/<code>description</code>/<code>showtimes</code>, nên 2 field đó không được trả lại. Mỗi showtime cũng bỏ <code>_id</code>/<code>endTime</code> riêng, chỉ giữ <code>roomName</code> (đã populate)/<code>startTime</code>/<code>price</code> — chiếu response hẹp hơn document gốc, không phải dump nguyên 1:1.</p>`,
  ),
  rubric: [
    { id: 'validation_400_404', criterion: B('Returns 400 for an invalid movieId and 404 when the movie does not exist.', 'Trả 400 khi movieId sai và 404 khi phim không tồn tại.'), weight: 1, maxScore: 0.5 },
    { id: 'showtimes_retrieved_for_movie', criterion: B('Correctly retrieves all showtimes associated with the movie.', 'Lấy đúng mọi showtime gắn với phim.'), weight: 1, maxScore: 0.7 },
    { id: 'room_name_populated', criterion: B('Each showtime entry includes the populated room name (not a raw roomId).', 'Mỗi showtime có tên phòng đã populate (không phải roomId thô).'), weight: 1, maxScore: 0.7 },
    { id: 'response_shape_matches_example', criterion: B('The response includes exactly title/duration/description/showtimes at the top level, matching the paper\'s example shape (no extra fields like genre/status).', 'Response đúng gồm title/duration/description/showtimes ở cấp cao nhất, khớp hình dạng ví dụ đề (không thừa field như genre/status).'), weight: 1, maxScore: 0.6 },
  ],
};

const q3 = {
  kind: 'CODE', points: 3.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 3 (3.5 points): Create Showtime (Admin Only)</strong></p>` +
    `<p><b>Endpoint:</b> <code>POST /api/showtimes</code></p>` +
    `<p><b>Authorization:</b> 0 points if no authorization. Header: <code>access_key</code> (e.g. <code>access_key: 123456abcdef</code>). Rules: <code>access_key</code> must exist; role must be "admin".</p>` +
    `<p><b>Request body:</b> <code>{ movieId, roomId, startTime, price }</code>.</p>` +
    `<p><b>Business Rules:</b> movie must exist and <code>status = NOW_SHOWING</code>; room must exist; calculate <code>endTime = startTime + movie.duration</code> (minutes); reject if the showtime overlaps an existing showtime in the same room.</p>` +
    `<pre><code class="language-json">// 403 (Forbidden): No access_key
{ "error": "No access key" }
// 403 (Forbidden): Invalid access_key
{ "error": "Invalid or unauthorized access key" }
// 403 (Forbidden): Invalid admin role
{ "error": "Admin access required" }
// 400 (Bad Request): Fields required
{ "error": "movieId, roomId, startTime, price required" }
// 409 (Conflict): Showtime overlap
{ "error": "Showtime overlaps with existing" }
// 201 (Created)
{ "_id": "699b2384403fbfae0baf24a4", "movieId": "65fa00000000000000000001", "roomId": "65fb00000000000000000001", "startTime": "2026-03-10T19:00:00.000Z", "endTime": "2026-03-10T22:00:00.000Z", "price": 95000 }</code></pre>`,
    `<p><strong>Câu 3 (3.5 điểm): Tạo showtime (chỉ Admin)</strong></p>` +
    `<p><b>Endpoint:</b> <code>POST /api/showtimes</code></p>` +
    `<p><b>Xác thực:</b> 0 điểm nếu không phân quyền. Header: <code>access_key</code> (VD <code>access_key: 123456abcdef</code>). Quy tắc: <code>access_key</code> phải tồn tại; role phải "admin".</p>` +
    `<p><b>Body request:</b> <code>{ movieId, roomId, startTime, price }</code>.</p>` +
    `<p><b>Quy tắc nghiệp vụ:</b> phim phải tồn tại và <code>status = NOW_SHOWING</code>; phòng phải tồn tại; tính <code>endTime = startTime + movie.duration</code> (phút); từ chối nếu showtime chồng giờ với showtime khác CÙNG phòng.</p>` +
    `<pre><code class="language-json">// 403 (Forbidden): Không có access_key
{ "error": "No access key" }
// 403 (Forbidden): access_key sai
{ "error": "Invalid or unauthorized access key" }
// 403 (Forbidden): Role không phải admin
{ "error": "Admin access required" }
// 400 (Bad Request): Thiếu field
{ "error": "movieId, roomId, startTime, price required" }
// 409 (Conflict): Showtime chồng giờ
{ "error": "Showtime overlaps with existing" }
// 201 (Created)
{ "_id": "699b2384403fbfae0baf24a4", "movieId": "65fa00000000000000000001", "roomId": "65fb00000000000000000001", "startTime": "2026-03-10T19:00:00.000Z", "endTime": "2026-03-10T22:00:00.000Z", "price": 95000 }</code></pre>`,
  ),
  starterCode:
`// ===== middlewares/adminAuth.middleware.js =====
const db = require("../models/index");
const User = db.user;

const requireAdmin = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = requireAdmin;

// ===== controllers/showtime.controller.js =====
const db2s = require("../models/index");
const Movie = db2s.movie;
const Room = db2s.room;
const Showtime = db2s.showtime;

const createShowtime = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { createShowtime };`,
  sampleSolution:
`// ===== middlewares/adminAuth.middleware.js =====
const db = require("../models/index");
const User = db.user;

const requireAdmin = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const accessKey = req.header("access_key");
        if (!accessKey) {
            return res.status(403).json({ error: "No access key" });
        }

        const user = await User.findOne({ access_key: accessKey });
        if (!user) {
            return res.status(403).json({ error: "Invalid or unauthorized access key" });
        }

        if (user.role !== "admin") {
            return res.status(403).json({ error: "Admin access required" });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    // -------------------------------------------------------
};

module.exports = requireAdmin;

// ===== controllers/showtime.controller.js =====
const db2 = require("../models/index");
const Movie = db2.movie;
const Room = db2.room;
const Showtime = db2.showtime;

const createShowtime = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { movieId, roomId, startTime, price } = req.body;

        if (!movieId || !roomId || !startTime || price == null) {
            return res.status(400).json({ error: "movieId, roomId, startTime, price required" });
        }

        const movie = await Movie.findById(movieId);
        if (!movie || movie.status !== "NOW_SHOWING") {
            return res.status(400).json({ error: "Movie must exist and be NOW_SHOWING" });
        }

        const room = await Room.findById(roomId);
        if (!room) {
            return res.status(400).json({ error: "Room not found" });
        }

        const newStartTime = new Date(startTime);
        const newEndTime = new Date(newStartTime.getTime() + movie.duration * 60000);

        const existingShowtimes = await Showtime.find({ roomId });
        const hasOverlap = existingShowtimes.some(
            (existing) => existing.startTime < newEndTime && existing.endTime > newStartTime,
        );
        if (hasOverlap) {
            return res.status(409).json({ error: "Showtime overlaps with existing" });
        }

        const created = await Showtime.create({
            movieId,
            roomId,
            startTime: newStartTime,
            endTime: newEndTime,
            price,
        });

        res.status(201).json(created);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    // -------------------------------------------------------
};

module.exports = { createShowtime };`,
  explanation: B(
    `<p><b>The overlap condition uses the standard interval-intersection formula</b> — <code>existing.startTime < newEndTime AND existing.endTime > newStartTime</code> — NOT the literal text printed in the paper ("existing.startTime &lt; newEndTime AND existing.startTime &lt; newEndTime"), which repeats the same clause twice and is a plain typo: implemented as written it collapses to a single one-sided check that would falsely flag showtimes that already ended long before the new one even starts. <code>endTime</code> is always freshly computed from <code>movie.duration</code> (in minutes, confirmed against the seed: a 180-minute movie starting 18:30 has a stored <code>endTime</code> of 21:30) rather than copied from any existing record, since each new showtime can be a different movie/room combination with its own duration.</p>`,
    `<p><b>Điều kiện overlap dùng đúng công thức chuẩn giao 2 khoảng thời gian</b> — <code>existing.startTime < newEndTime AND existing.endTime > newStartTime</code> — KHÔNG phải nguyên văn câu chữ đề in ("existing.startTime &lt; newEndTime AND existing.startTime &lt; newEndTime"), lặp lại đúng 1 vế 2 lần, rõ ràng lỗi đánh máy: làm đúng nguyên văn sẽ rút gọn còn 1 vế 1 chiều, báo overlap SAI cho những showtime đã kết thúc từ lâu trước khi showtime mới bắt đầu. <code>endTime</code> luôn TỰ TÍNH MỚI từ <code>movie.duration</code> (đơn vị phút, xác nhận đúng qua seed: phim 180 phút bắt đầu 18:30 có <code>endTime</code> lưu sẵn là 21:30) chứ không sao chép từ bản ghi có sẵn nào, vì mỗi showtime mới có thể khác phim/khác phòng, khác thời lượng riêng.</p>`,
  ),
  rubric: [
    { id: 'access_key_auth_layers', criterion: B('Returns the correct 403 for each auth failure case in order: missing access_key, invalid access_key, non-admin role.', 'Trả đúng 403 cho từng trường hợp lỗi xác thực theo đúng thứ tự: thiếu access_key, access_key sai, role không phải admin.'), weight: 1, maxScore: 0.7 },
    { id: 'required_fields_validation', criterion: B('Returns 400 when movieId, roomId, startTime, or price is missing.', 'Trả 400 khi thiếu movieId, roomId, startTime, hoặc price.'), weight: 1, maxScore: 0.4 },
    { id: 'movie_and_room_business_rules', criterion: B('Verifies the movie exists with status NOW_SHOWING, and the room exists.', 'Kiểm đúng phim tồn tại với status NOW_SHOWING, và phòng tồn tại.'), weight: 1, maxScore: 0.6 },
    { id: 'endtime_computed_correctly', criterion: B('endTime is correctly computed as startTime plus the movie\'s duration in minutes.', 'endTime tính đúng bằng startTime cộng duration của phim theo phút.'), weight: 1, maxScore: 0.6 },
    { id: 'overlap_detection_correct', criterion: B('Correctly detects and rejects (409) a genuinely overlapping showtime in the same room, using a correct interval-overlap check rather than the paper\'s literally-printed (redundant) condition.', 'Phát hiện đúng và từ chối (409) showtime chồng giờ thật cùng phòng, dùng điều kiện giao khoảng đúng thay vì điều kiện lặp câu chữ đề in.'), weight: 1, maxScore: 0.7 },
    { id: 'created_response_shape', criterion: B('The created showtime response includes _id, movieId, roomId, startTime, endTime, and price.', 'Response showtime tạo ra gồm _id, movieId, roomId, startTime, endTime, và price.'), weight: 1, maxScore: 0.5 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 4 (2.5 points): Revenue Report (Admin Only)</strong></p>` +
    `<p><b>Endpoint:</b> <code>GET /api/reports/revenue</code></p>` +
    `<p><b>Authorization:</b> requires a valid <code>access_key</code>; find user by access_key; reject (403) if not found; role must be "admin", otherwise (403).</p>` +
    `<p><b>Business Rules:</b> only aggregate tickets with <code>status = "paid"</code>; group results by movie; calculate <code>ticketCount</code> and total <code>revenue</code>.</p>` +
    `<pre><code class="language-json">// 403 (Forbidden): No access_key
{ "error": "No access key" }
// 403 (Forbidden): Invalid access_key
{ "error": "Invalid or unauthorized access key" }
// 403 (Forbidden): Invalid admin role
{ "error": "Admin access required" }
// 200 (OK)
[
  { "movieTitle": "Avengers", "ticketCount": 3, "revenue": 270000 },
  { "movieTitle": "Avatar", "ticketCount": 1, "revenue": 100000 },
  "......"
]</code></pre>`,
    `<p><strong>Câu 4 (2.5 điểm): Báo cáo doanh thu (chỉ Admin)</strong></p>` +
    `<p><b>Endpoint:</b> <code>GET /api/reports/revenue</code></p>` +
    `<p><b>Xác thực:</b> cần access_key hợp lệ; tra user theo access_key; từ chối (403) nếu không tìm thấy; role phải "admin", nếu không (403).</p>` +
    `<p><b>Quy tắc nghiệp vụ:</b> chỉ tổng hợp ticket status <code>"paid"</code>; nhóm kết quả theo phim; tính <code>ticketCount</code> và tổng <code>revenue</code>.</p>` +
    `<pre><code class="language-json">// 403 (Forbidden): Không có access_key
{ "error": "No access key" }
// 403 (Forbidden): access_key sai
{ "error": "Invalid or unauthorized access key" }
// 403 (Forbidden): Role không phải admin
{ "error": "Admin access required" }
// 200 (OK)
[
  { "movieTitle": "Avengers", "ticketCount": 3, "revenue": 270000 },
  { "movieTitle": "Avatar", "ticketCount": 1, "revenue": 100000 },
  "......"
]</code></pre>`,
  ),
  starterCode:
`// ===== middlewares/adminAuth.middleware.js (reused) =====
const db = require("../models/index");
const User = db.user;

const requireAdmin = async (req, res, next) => {
    try {
        const accessKey = req.header("access_key");
        if (!accessKey) return res.status(403).json({ error: "No access key" });

        const user = await User.findOne({ access_key: accessKey });
        if (!user) return res.status(403).json({ error: "Invalid or unauthorized access key" });
        if (user.role !== "admin") return res.status(403).json({ error: "Admin access required" });

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = requireAdmin;

// ===== controllers/report.controller.js =====
const db3s = require("../models/index");
const Ticket = db3s.ticket;

const getRevenueReport = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getRevenueReport };`,
  sampleSolution:
`// ===== middlewares/adminAuth.middleware.js (reused) =====
const db = require("../models/index");
const User = db.user;

const requireAdmin = async (req, res, next) => {
    try {
        const accessKey = req.header("access_key");
        if (!accessKey) return res.status(403).json({ error: "No access key" });

        const user = await User.findOne({ access_key: accessKey });
        if (!user) return res.status(403).json({ error: "Invalid or unauthorized access key" });
        if (user.role !== "admin") return res.status(403).json({ error: "Admin access required" });

        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = requireAdmin;

// ===== controllers/report.controller.js =====
const db2 = require("../models/index");
const Ticket = db2.ticket;

const getRevenueReport = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const result = await Ticket.aggregate([
            { \$match: { status: "paid" } },
            {
                \$lookup: {
                    from: "showtimes",
                    localField: "showTimeId",
                    foreignField: "_id",
                    as: "showtime",
                },
            },
            { \$unwind: "\$showtime" },
            {
                \$lookup: {
                    from: "movies",
                    localField: "showtime.movieId",
                    foreignField: "_id",
                    as: "movie",
                },
            },
            { \$unwind: "\$movie" },
            {
                \$group: {
                    _id: "\$movie._id",
                    movieTitle: { \$first: "\$movie.title" },
                    ticketCount: { \$sum: 1 },
                    revenue: { \$sum: "\$price" },
                },
            },
            { \$project: { _id: 0, movieTitle: 1, ticketCount: 1, revenue: 1 } },
        ]);

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    // -------------------------------------------------------
};

module.exports = { getRevenueReport };`,
  explanation: B(
    `<p>Starting the aggregation FROM <code>tickets</code> (not from <code>movies</code>) means a movie with zero paid tickets is naturally absent from the result — no explicit filter is needed to exclude it, matching the paper's example which only lists movies with actual paid revenue. Revenue sums each ticket's OWN <code>price</code> field (the price actually paid at booking time), not the current <code>showtime.price</code>, since a showtime's price could in principle change after tickets were already sold at the old price. The join is two hops (ticket→showtime→movie via <code>showTimeId</code> then <code>movieId</code>), requiring two chained <code>\$lookup</code>+<code>\$unwind</code> pairs before grouping.</p>`,
    `<p>Bắt đầu tổng hợp TỪ <code>tickets</code> (không phải từ <code>movies</code>) khiến phim không có ticket paid nào tự động vắng mặt khỏi kết quả — không cần lọc riêng để loại, khớp đúng ví dụ đề chỉ liệt phim có doanh thu paid thật. Doanh thu cộng field <code>price</code> RIÊNG của từng ticket (giá thật đã trả lúc đặt), không phải <code>showtime.price</code> hiện tại, vì giá showtime về nguyên tắc có thể đổi sau khi vé đã bán theo giá cũ. Join đi 2 bước (ticket→showtime→movie qua <code>showTimeId</code> rồi <code>movieId</code>), cần 2 cặp <code>\$lookup</code>+<code>\$unwind</code> nối tiếp trước khi group.</p>`,
  ),
  rubric: [
    { id: 'access_key_auth_layers', criterion: B('Returns the correct 403 for each auth failure case: missing access_key, invalid access_key, non-admin role.', 'Trả đúng 403 cho từng trường hợp lỗi xác thực: thiếu access_key, access_key sai, role không phải admin.'), weight: 1, maxScore: 0.6 },
    { id: 'only_paid_tickets', criterion: B('Only tickets with status "paid" are included in the aggregation.', 'Chỉ ticket status "paid" được đưa vào tổng hợp.'), weight: 1, maxScore: 0.6 },
    { id: 'grouped_by_movie_correctly', criterion: B('Results are correctly grouped by movie, joining through showtime to reach the movie.', 'Kết quả nhóm đúng theo phim, join qua showtime để tới phim.'), weight: 1, maxScore: 0.7 },
    { id: 'ticketcount_and_revenue_correct', criterion: B('ticketCount and revenue are correctly computed per movie group.', 'ticketCount và revenue tính đúng theo từng nhóm phim.'), weight: 1, maxScore: 0.6 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE17',
    title: 'SDN302 – Practical Exam (Trial 1, Paper 2), Online Cinema Ticket Booking|||SDN302 – Thi thực hành (Trial 1, Đề 2), Đặt vé xem phim online',
    description: 'SDN302 PE (CODE): pure backend REST API for an online cinema ticket-booking platform (movies/rooms/showtimes/tickets/users), access_key header authorization (not JWT), admin-only showtime creation with overlap detection and a revenue report, AI-graded.|||PE SDN302 (viết mã): REST API thuần backend cho nền tảng đặt vé xem phim online (movies/rooms/showtimes/tickets/users), phân quyền header access_key (không phải JWT), tạo showtime + báo cáo doanh thu chỉ dành admin kèm phát hiện chồng giờ, chấm AI.',
    durationMinutes: 85,
    totalPoints: 10,
    passMark: 5,
    source: 'FUOverflow',
    attachmentUrl: null,
    attachmentName: null,
    instructions,
    isPublished: true,
    questions: [q1, q2, q3, q4],
  }],
};

fs.writeFileSync(OUT, `export default ${JSON.stringify(spec, null, 2)};\n`, 'utf8');
console.log(`✓ ${OUT} — PE/CODE ${spec.exams[0].questions.length} câu, ${spec.exams[0].totalPoints} điểm`);
