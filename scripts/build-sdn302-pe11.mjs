/**
 * build-sdn302-pe11.mjs — sinh content/exams/SDN302-PE11.mjs.
 *
 * Nguồn thật: "SDN302 - SP26 - PE - 1" — hệ thống đặt vé xem phim online
 * (movies/rooms/showtimes/tickets/users). Đề này KHÔNG có paper.pdf —
 * chỉ có `images.rar` (1 ảnh khổng lồ 4960×49126px = 7 trang đề ghép
 * dọc, đã tự cắt thành 7 đoạn 1400×1980 rồi đọc từng đoạn) và
 * `given_materials.rar` (5 file JSON seed).
 *
 * Đã đọc kỹ seed JSON và xác nhận: (1) `password` trong users.json là
 * CHUỖI THÔ "pass123" — KHÔNG băm bcrypt (khác nhiều đề khác môn này) —
 * đề này không có bước đăng nhập, xác thực hoàn toàn qua field
 * `access_key` gửi thẳng trong header; (2) VIP phụ phí 20% xác minh
 * khớp CHÍNH XÁC với ví dụ đề (showtime giá 80.000, 2 ghế VIP →
 * 2×80.000×1,2 = 192.000, đúng "totalAmount": 192000 của đề); (3) movie
 * status chỉ có NOW_SHOWING/STOPPED, ticket status có paid/booked/
 * canceled (chỉ "canceled" giải phóng ghế theo đúng quy tắc đề).
 *
 * Điểm gốc: Q1=1.5, Q2=2.5, Q3=2.5, Q4=3.5 (tổng 10).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE11.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE11.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given data shape (collections: movies, rooms, showtimes, tickets, users — database "spr25db"):</b>` +
  `<pre><code class="language-javascript">// movie
{ title: String, duration: Number, status: String /* "NOW_SHOWING" | "STOPPED" */, genre: [String], description: String }
// room
{ roomName: String, capacity: Number, seats: [{ _id: String /* seat code, e.g. "A1" */, type: String /* "VIP" | "NORMAL" */ }] }
// showtime
{ movieId: ObjectId /* ref movies */, roomId: ObjectId /* ref rooms */, startTime: Date, endTime: Date, price: Number /* base price, NORMAL seat */ }
// ticket
{ showTimeId: ObjectId /* ref showtimes */, seatId: String /* seat code */, userId: ObjectId /* ref users */, price: Number, status: String /* "paid" | "booked" | "canceled" */, bookedAt: Date, paymentMethod: String }
// user
{ name: String, role: String /* "customer" | "admin" | "staff" */, email: String, password: String, phone: String, access_key: String }</code></pre></div>`,
  `<div class="pe-system"><b>Hình dạng dữ liệu đề cho (bảng: movies, rooms, showtimes, tickets, users — database "spr25db"):</b>` +
  `<pre><code class="language-javascript">// movie
{ title: String, duration: Number, status: String /* "NOW_SHOWING" | "STOPPED" */, genre: [String], description: String }
// room
{ roomName: String, capacity: Number, seats: [{ _id: String /* mã ghế, VD "A1" */, type: String /* "VIP" | "NORMAL" */ }] }
// showtime
{ movieId: ObjectId /* ref movies */, roomId: ObjectId /* ref rooms */, startTime: Date, endTime: Date, price: Number /* giá gốc, ghế NORMAL */ }
// ticket
{ showTimeId: ObjectId /* ref showtimes */, seatId: String /* mã ghế */, userId: ObjectId /* ref users */, price: Number, status: String /* "paid" | "booked" | "canceled" */, bookedAt: Date, paymentMethod: String }
// user
{ name: String, role: String /* "customer" | "admin" | "staff" */, email: String, password: String, phone: String, access_key: String }</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Spring 2026) — Online Cinema Ticket Booking</strong>. Build a RESTful API (ExpressJS + MongoDB + Mongoose) managing movies, rooms, showtimes, tickets, and users. All endpoints must validate input data, apply business rules, return appropriate HTTP status codes, and return properly structured JSON responses. Protected routes implement authorization middleware using <code>access_key</code> from request headers (not JWT — this exam does not use tokens). This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Spring 2026) — Đặt vé xem phim online</strong>. Xây RESTful API (ExpressJS + MongoDB + Mongoose) quản lý movies, rooms, showtimes, tickets, users. Mọi endpoint phải validate dữ liệu vào, áp quy tắc nghiệp vụ, trả đúng HTTP status code, trả JSON đúng cấu trúc. Route bảo vệ dùng middleware phân quyền qua <code>access_key</code> từ header request (không phải JWT — đề này không dùng token). Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 1 (1.5 points): Retrieve Active Movies.</strong> Retrieve the list of movies that are currently showing. Endpoint: <code>GET /api/movies?status=NOW_SHOWING</code>.</p>` +
    `<p><strong>Business Rules:</strong> use query param for filtering status; return 400 if invalid or missing status; output fields must be renamed as shown if necessary.</p>` +
    `<pre><code class="language-json">// 200 (OK)
[
  { "id": "65fa00000000000000000001", "title": "Avengers", "duration": 180, "genre": ["action","sci-fi"] }
]
// 400 (Bad Request)
{ "error": "Invalid status: SHOWING_ABC" }</code></pre>`,
    `<p><strong>Câu 1 (1.5 điểm): Lấy phim đang chiếu.</strong> Lấy danh sách phim đang chiếu. Endpoint: <code>GET /api/movies?status=NOW_SHOWING</code>.</p>` +
    `<p><strong>Quy tắc nghiệp vụ:</strong> dùng query param lọc status; trả 400 nếu status sai/thiếu; đổi tên field output như mẫu nếu cần.</p>` +
    `<pre><code class="language-json">// 200 (OK)
[
  { "id": "65fa00000000000000000001", "title": "Avengers", "duration": 180, "genre": ["action","sci-fi"] }
]
// 400 (Bad Request)
{ "error": "Invalid status: SHOWING_ABC" }</code></pre>`,
  ),
  starterCode:
`const db = require("../models/index");
const Movie = db.movie;

const VALID_STATUSES = ["NOW_SHOWING", "STOPPED"];

const getMoviesByStatus = async (req, res, next) => {
    const { status } = req.query;
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getMoviesByStatus };`,
  sampleSolution:
`const db = require("../models/index");
const Movie = db.movie;

const VALID_STATUSES = ["NOW_SHOWING", "STOPPED"];

const getMoviesByStatus = async (req, res, next) => {
    const { status } = req.query;
    // ---------- Student's code starts from here ----------
    try {
        if (!status || !VALID_STATUSES.includes(status)) {
            return res.status(400).json({ error: \`Invalid status: \${status}\` });
        }

        const movies = await Movie.find({ status });

        res.json(movies.map((m) => ({
            id: m._id,
            title: m.title,
            duration: m.duration,
            genre: m.genre,
        })));
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getMoviesByStatus };`,
  explanation: B(
    `<p>Verified the valid status set against the seed data (<code>movies.json</code> only ever uses <code>NOW_SHOWING</code> and <code>STOPPED</code>) rather than guessing a larger enum. The output renames <code>_id</code> to <code>id</code> and drops <code>status</code>/<code>description</code> — exactly the fields shown in the paper's example, per the explicit "output fields must be renamed as shown if necessary" rule.</p>`,
    `<p>Đã kiểm chứng tập status hợp lệ từ chính dữ liệu seed (<code>movies.json</code> chỉ dùng <code>NOW_SHOWING</code> và <code>STOPPED</code>) thay vì đoán 1 enum lớn hơn. Output đổi <code>_id</code> thành <code>id</code> và bỏ <code>status</code>/<code>description</code> — đúng field ví dụ đề, theo đúng quy tắc "đổi tên field output như mẫu nếu cần".</p>`,
  ),
  rubric: [
    { id: 'status_validation', criterion: B('Validates the status query param against the known valid values, returning the exact 400 error format for an invalid/missing value.', 'Kiểm status query param đúng tập giá trị hợp lệ, trả đúng định dạng lỗi 400 khi sai/thiếu.'), weight: 1, maxScore: 0.6 },
    { id: 'filters_by_status', criterion: B('Correctly filters movies by the given status.', 'Lọc đúng phim theo status đã cho.'), weight: 1, maxScore: 0.5 },
    { id: 'output_fields_renamed', criterion: B('Output fields are renamed/reshaped to match the example exactly (id instead of _id, only title/duration/genre besides id).', 'Output đổi tên/định dạng đúng khớp ví dụ (id thay _id, chỉ title/duration/genre ngoài id).'), weight: 1, maxScore: 0.4 },
  ],
};

const q2 = {
  kind: 'CODE', points: 2.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 2 (2.5 points): Retrieve Showtimes for a Movie.</strong> Retrieve all showtimes associated with a specific movie resource, including room details. Endpoint: <code>GET /api/movies/:movieId/showtimes</code>.</p>` +
    `<p><strong>Business Rules:</strong> validate ObjectId, return 400 if invalid; return 404 if movie not found; include room name in response.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid movieId: 65fa000000000000000000" }
// 404 (Not Found)
{ "error": "Movie with id = 65fa00000000000000000009 not found" }
// 200 (OK): test with movieId="65fa00000000000000000001"
[
  { "id": "65fc00000000000000000001", "roomName": "Room A", "startTime": "2026-03-10T18:30:00.000Z", "endTime": "2026-03-10T21:30:00.000Z", "price": 90000 }
]</code></pre>`,
    `<p><strong>Câu 2 (2.5 điểm): Lấy suất chiếu của phim.</strong> Lấy mọi suất chiếu của 1 phim cụ thể, kèm chi tiết phòng. Endpoint: <code>GET /api/movies/:movieId/showtimes</code>.</p>` +
    `<p><strong>Quy tắc nghiệp vụ:</strong> kiểm ObjectId, trả 400 nếu sai; trả 404 nếu không thấy phim; kèm tên phòng trong response.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid movieId: 65fa000000000000000000" }
// 404 (Not Found)
{ "error": "Movie with id = 65fa00000000000000000009 not found" }
// 200 (OK): test với movieId="65fa00000000000000000001"
[
  { "id": "65fc00000000000000000001", "roomName": "Room A", "startTime": "2026-03-10T18:30:00.000Z", "endTime": "2026-03-10T21:30:00.000Z", "price": 90000 }
]</code></pre>`,
  ),
  starterCode:
`const mongoose = require("mongoose");
const db = require("../models/index");
const Movie = db.movie;
const Showtime = db.showtime;

const getShowtimesByMovie = async (req, res, next) => {
    const { movieId } = req.params;
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getShowtimesByMovie };`,
  sampleSolution:
`const mongoose = require("mongoose");
const db = require("../models/index");
const Movie = db.movie;
const Showtime = db.showtime;

const getShowtimesByMovie = async (req, res, next) => {
    const { movieId } = req.params;
    // ---------- Student's code starts from here ----------
    try {
        if (!mongoose.Types.ObjectId.isValid(movieId)) {
            return res.status(400).json({ error: \`Invalid movieId: \${movieId}\` });
        }

        const movie = await Movie.findById(movieId);
        if (!movie) {
            return res.status(404).json({ error: \`Movie with id = \${movieId} not found\` });
        }

        const showtimes = await Showtime.find({ movieId }).populate("roomId", "roomName");

        res.json(showtimes.map((s) => ({
            id: s._id,
            roomName: s.roomId?.roomName,
            startTime: s.startTime,
            endTime: s.endTime,
            price: s.price,
        })));
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getShowtimesByMovie };`,
  explanation: B(
    `<p>The 400/404 distinction is checked in order: format validity first (a malformed ObjectId never reaches the database), then existence (a well-formed but non-existent id gets a clean 404 instead of a raw CastError). <code>roomId</code> is populated to just <code>roomName</code>, matching "include room name in response" — not the whole room document (with its seats array, which this endpoint doesn't need).</p>`,
    `<p>Phân biệt 400/404 kiểm đúng thứ tự: định dạng hợp lệ trước (ObjectId sai định dạng không bao giờ chạm database), rồi tồn tại (id đúng định dạng nhưng không có thật nhận 404 sạch thay vì CastError thô). <code>roomId</code> populate chỉ <code>roomName</code>, khớp "kèm tên phòng trong response" — không phải cả document room (với mảng seats, endpoint này không cần).</p>`,
  ),
  rubric: [
    { id: 'objectid_format_validation', criterion: B('Validates movieId is a well-formed ObjectId before querying, returning the exact 400 error for a malformed id.', 'Kiểm movieId đúng định dạng ObjectId trước khi truy vấn, trả đúng lỗi 400 khi sai định dạng.'), weight: 1, maxScore: 0.5 },
    { id: 'movie_not_found', criterion: B('Returns the exact 404 error when a well-formed movieId matches no movie.', 'Trả đúng lỗi 404 khi movieId đúng định dạng nhưng không khớp phim nào.'), weight: 1, maxScore: 0.5 },
    { id: 'room_name_included', criterion: B('room name is correctly resolved via populate and included in each showtime.', 'Tên phòng phân giải đúng qua populate và có trong mỗi suất chiếu.'), weight: 1, maxScore: 0.8 },
    { id: 'response_shape_correct', criterion: B('Response matches the paper\'s shape exactly (id, roomName, startTime, endTime, price).', 'Response khớp đúng hình dạng đề (id, roomName, startTime, endTime, price).'), weight: 1, maxScore: 0.7 },
  ],
};

const q3 = {
  kind: 'CODE', points: 2.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 3 (2.5 points): Retrieve Seat Availability by Showtime.</strong> Retrieve seat availability as a sub-resource of a showtime. Endpoint: <code>GET /api/showtimes/:showtimeId/seats</code>.</p>` +
    `<p><strong>Business Rules:</strong> validate ObjectId; return 404 if showtime not found; determine seat status: BOOKED → if ticket exists (status ≠ canceled), AVAILABLE → otherwise.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid showtimeId: 65fc000000000000000000" }
// 404 (Not Found)
{ "error": "Showtime with Id: 65fc00000000000000000009 not found" }
// 200 (OK): test with showtimeId="65fc00000000000000000003"
[
  { "code": "A1", "type": "VIP", "status": "BOOKED" },
  { "code": "A2", "type": "VIP", "status": "AVAILABLE" },
  { "code": "B1", "type": "NORMAL", "status": "AVAILABLE" }
]</code></pre>`,
    `<p><strong>Câu 3 (2.5 điểm): Lấy tình trạng ghế theo suất chiếu.</strong> Lấy tình trạng ghế như 1 sub-resource của suất chiếu. Endpoint: <code>GET /api/showtimes/:showtimeId/seats</code>.</p>` +
    `<p><strong>Quy tắc nghiệp vụ:</strong> kiểm ObjectId; trả 404 nếu không thấy suất chiếu; xác định trạng thái ghế: BOOKED → nếu có ticket (status ≠ canceled), AVAILABLE → ngược lại.</p>` +
    `<pre><code class="language-json">// 400 (Bad Request)
{ "error": "Invalid showtimeId: 65fc000000000000000000" }
// 404 (Not Found)
{ "error": "Showtime with Id: 65fc00000000000000000009 not found" }
// 200 (OK): test với showtimeId="65fc00000000000000000003"
[
  { "code": "A1", "type": "VIP", "status": "BOOKED" },
  { "code": "A2", "type": "VIP", "status": "AVAILABLE" },
  { "code": "B1", "type": "NORMAL", "status": "AVAILABLE" }
]</code></pre>`,
  ),
  starterCode:
`const mongoose = require("mongoose");
const db = require("../models/index");
const Showtime = db.showtime;
const Ticket = db.ticket;

const getSeatsByShowtime = async (req, res, next) => {
    const { showtimeId } = req.params;
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getSeatsByShowtime };`,
  sampleSolution:
`const mongoose = require("mongoose");
const db = require("../models/index");
const Showtime = db.showtime;
const Ticket = db.ticket;

const getSeatsByShowtime = async (req, res, next) => {
    const { showtimeId } = req.params;
    // ---------- Student's code starts from here ----------
    try {
        if (!mongoose.Types.ObjectId.isValid(showtimeId)) {
            return res.status(400).json({ error: \`Invalid showtimeId: \${showtimeId}\` });
        }

        const showtime = await Showtime.findById(showtimeId).populate("roomId");
        if (!showtime) {
            return res.status(404).json({ error: \`Showtime with Id: \${showtimeId} not found\` });
        }

        const activeTickets = await Ticket.find({
            showTimeId: showtimeId,
            status: { \$ne: "canceled" },
        });
        const bookedSeatCodes = new Set(activeTickets.map((t) => t.seatId));

        const seats = showtime.roomId.seats.map((seat) => ({
            code: seat._id,
            type: seat.type,
            status: bookedSeatCodes.has(seat._id) ? "BOOKED" : "AVAILABLE",
        }));

        res.json(seats);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getSeatsByShowtime };`,
  explanation: B(
    `<p>A seat is BOOKED if ANY ticket for that <code>(showTimeId, seatId)</code> pair has a status OTHER than <code>canceled</code> — both <code>paid</code> and <code>booked</code> count as occupying the seat, only <code>canceled</code> frees it, matching the seed data's 3 real ticket statuses. The seat list itself always comes from the room's own <code>seats</code> array (every seat the room has), not from the tickets — a seat with no ticket at all is simply <code>AVAILABLE</code>.</p>`,
    `<p>1 ghế là BOOKED nếu CÓ ticket nào cho đúng cặp <code>(showTimeId, seatId)</code> đó với status KHÁC <code>canceled</code> — cả <code>paid</code> lẫn <code>booked</code> đều tính là đang chiếm ghế, chỉ <code>canceled</code> mới giải phóng, khớp đúng 3 status ticket thật trong seed. Danh sách ghế luôn lấy từ mảng <code>seats</code> của chính phòng (mọi ghế phòng có), không phải từ ticket — ghế chưa từng có ticket nào đơn giản là <code>AVAILABLE</code>.</p>`,
  ),
  rubric: [
    { id: 'objectid_and_notfound', criterion: B('Validates showtimeId format (400) and existence (404) with the exact error messages.', 'Kiểm đúng định dạng showtimeId (400) và tồn tại (404) với đúng thông điệp lỗi.'), weight: 1, maxScore: 0.6 },
    { id: 'all_room_seats_listed', criterion: B('Lists every seat belonging to the showtime\'s room (from the room\'s own seats array), not just seats that have tickets.', 'Liệt kê đủ mọi ghế thuộc phòng của suất chiếu (từ mảng seats của chính phòng), không chỉ ghế có ticket.'), weight: 1, maxScore: 0.7 },
    { id: 'booking_status_logic_correct', criterion: B('Correctly determines BOOKED vs AVAILABLE based on whether an active (non-canceled) ticket exists for that seat.', 'Xác định đúng BOOKED hay AVAILABLE dựa trên có ticket còn hiệu lực (không canceled) cho ghế đó hay không.'), weight: 1, maxScore: 0.8 },
    { id: 'response_shape_correct', criterion: B('Each seat object has exactly code, type, status.', 'Mỗi object ghế có đúng code, type, status.'), weight: 1, maxScore: 0.4 },
  ],
};

const q4 = {
  kind: 'CODE', points: 3.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 4 (3.5 points): Create Tickets (Customer Only).</strong> Create new ticket resources for booking seats. Endpoint: <code>POST /api/tickets</code>.</p>` +
    `<p><strong>Authorization</strong> (protected endpoint, 0 points if no authorization): read <code>access_key</code> from request headers (e.g. <code>access_key: 123456abcdef</code>); validate access_key; find user by access_key, reject if not found → 403; role must be "customer", otherwise → 403.</p>` +
    `<pre><code class="language-json">// Request body
{ "showtimeId": "65fc00000000000000000001", "seats": ["A1", "A2"] }</code></pre>` +
    `<p><strong>Business Rules:</strong> validate showtimeId; seats must belong to the room; reject if seat already booked; VIP seats cost 20% more than base price; create one ticket per seat; calculate totalAmount on the server side.</p>` +
    `<pre><code class="language-json">// 403 (Forbidden): No access_key
{ "error": "No access key" }
// 403 (Forbidden): Invalid access_key
{ "error": "Invalid or unauthorized access key" }
// 403 (Forbidden): Invalid customer role
{ "error": "Customer access required" }
// 400 (Bad Request): Fields required
{ "error": "showtimeId and seats required" }
// 409 (Conflict): Seat already booked
{ "error": "Seat A1 already booked" }
// 201 (Created): Tickets created — example showtimeId="65fc00000000000000000006" and seats=["A1", "A2"] (both VIP, base price 80000)
{ "message": "Tickets created", "count": 2, "totalAmount": 192000 }</code></pre>`,
    `<p><strong>Câu 4 (3.5 điểm): Tạo vé (chỉ Customer).</strong> Tạo vé mới cho việc đặt ghế. Endpoint: <code>POST /api/tickets</code>.</p>` +
    `<p><strong>Phân quyền</strong> (endpoint bảo vệ, 0 điểm nếu không có phân quyền): đọc <code>access_key</code> từ header (VD <code>access_key: 123456abcdef</code>); kiểm access_key; tìm user theo access_key, từ chối nếu không thấy → 403; role phải là "customer", ngược lại → 403.</p>` +
    `<pre><code class="language-json">// Request body
{ "showtimeId": "65fc00000000000000000001", "seats": ["A1", "A2"] }</code></pre>` +
    `<p><strong>Quy tắc nghiệp vụ:</strong> kiểm showtimeId; ghế phải thuộc phòng; từ chối nếu ghế đã đặt; ghế VIP giá cao hơn 20% giá gốc; tạo 1 vé mỗi ghế; tính totalAmount phía server.</p>` +
    `<pre><code class="language-json">// 403 (Forbidden): Không có access_key
{ "error": "No access key" }
// 403 (Forbidden): access_key sai
{ "error": "Invalid or unauthorized access key" }
// 403 (Forbidden): Sai vai trò customer
{ "error": "Customer access required" }
// 400 (Bad Request): Thiếu field
{ "error": "showtimeId and seats required" }
// 409 (Conflict): Ghế đã đặt
{ "error": "Seat A1 already booked" }
// 201 (Created): Tạo vé xong — ví dụ showtimeId="65fc00000000000000000006" và seats=["A1", "A2"] (đều VIP, giá gốc 80000)
{ "message": "Tickets created", "count": 2, "totalAmount": 192000 }</code></pre>`,
  ),
  starterCode:
`// ===== middlewares/accessKey.middleware.js =====
const db = require("../models/index");
const User = db.user;

const requireCustomer = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = requireCustomer;

// ===== controllers/ticket.controller.js =====
const db = require("../models/index");
const Showtime = db.showtime;
const Ticket = db.ticket;

const createTickets = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { createTickets };`,
  sampleSolution:
`// ===== middlewares/accessKey.middleware.js =====
const db = require("../models/index");
const User = db.user;

const requireCustomer = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const accessKey = req.headers["access_key"];
        if (!accessKey) {
            return res.status(403).json({ error: "No access key" });
        }

        const user = await User.findOne({ access_key: accessKey });
        if (!user) {
            return res.status(403).json({ error: "Invalid or unauthorized access key" });
        }

        if (user.role !== "customer") {
            return res.status(403).json({ error: "Customer access required" });
        }

        req.user = user;
        next();
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = requireCustomer;

// ===== controllers/ticket.controller.js =====
const db = require("../models/index");
const Showtime = db.showtime;
const Ticket = db.ticket;

const createTickets = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { showtimeId, seats } = req.body;

        if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
            return res.status(400).json({ error: "showtimeId and seats required" });
        }

        const showtime = await Showtime.findById(showtimeId).populate("roomId");
        if (!showtime) {
            return res.status(404).json({ error: \`Showtime with Id: \${showtimeId} not found\` });
        }

        const roomSeatsByCode = new Map(showtime.roomId.seats.map((s) => [s._id, s]));

        for (const code of seats) {
            if (!roomSeatsByCode.has(code)) {
                return res.status(400).json({ error: \`Seat \${code} does not belong to this room\` });
            }
        }

        const activeTickets = await Ticket.find({
            showTimeId: showtimeId,
            seatId: { \$in: seats },
            status: { \$ne: "canceled" },
        });
        if (activeTickets.length > 0) {
            return res.status(409).json({ error: \`Seat \${activeTickets[0].seatId} already booked\` });
        }

        let totalAmount = 0;
        const ticketsToCreate = seats.map((code) => {
            const seat = roomSeatsByCode.get(code);
            const price = seat.type === "VIP" ? showtime.price * 1.2 : showtime.price;
            totalAmount += price;
            return {
                showTimeId: showtimeId,
                seatId: code,
                userId: req.user._id,
                price,
                status: "booked",
                bookedAt: new Date(),
            };
        });

        await Ticket.insertMany(ticketsToCreate);

        res.status(201).json({
            message: "Tickets created",
            count: ticketsToCreate.length,
            totalAmount,
        });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { createTickets };`,
  explanation: B(
    `<p>Every check (seats belong to the room, no seat already actively booked) happens BEFORE any ticket is written, so a rejected request (400/409) never leaves a partial set of tickets created. Verified the VIP surcharge formula against the paper's own numeric example: showtime <code>...006</code> has a base price of 80,000 (room E), both requested seats A1/A2 are VIP in that room, so <code>2 × 80,000 × 1.2 = 192,000</code> — matching the paper's <code>totalAmount</code> exactly. The seat-already-booked check queries for ANY active ticket among the requested seat codes at once (<code>seatId: {\$in: seats}</code>) rather than one query per seat.</p>`,
    `<p>Mọi kiểm (ghế thuộc phòng, không ghế nào đang đặt còn hiệu lực) đều xảy ra TRƯỚC KHI ghi bất kỳ vé nào, nên request bị từ chối (400/409) không bao giờ để lại tập vé tạo dở dang. Đã kiểm chứng công thức phụ phí VIP so đúng ví dụ số của đề: suất chiếu <code>...006</code> có giá gốc 80.000 (phòng E), cả 2 ghế yêu cầu A1/A2 đều VIP ở phòng đó, nên <code>2 × 80.000 × 1,2 = 192.000</code> — khớp đúng <code>totalAmount</code> của đề. Kiểm ghế đã đặt truy vấn 1 lần cho MỌI mã ghế yêu cầu (<code>seatId: {\$in: seats}</code>) thay vì 1 truy vấn riêng mỗi ghế.</p>`,
  ),
  rubric: [
    { id: 'access_key_auth_chain', criterion: B('Correctly implements the full authorization chain: no access_key → 403, invalid access_key → 403, valid key but non-customer role → 403 — with the exact error messages.', 'Triển khai đúng đủ chuỗi phân quyền: không access_key → 403, access_key sai → 403, key đúng nhưng không phải role customer → 403 — đúng nguyên văn thông điệp lỗi.'), weight: 1, maxScore: 1 },
    { id: 'fields_required_validation', criterion: B('Validates showtimeId and seats are present, returning the exact 400 error if not.', 'Kiểm showtimeId và seats có mặt, trả đúng lỗi 400 nếu thiếu.'), weight: 1, maxScore: 0.4 },
    { id: 'seat_belongs_and_availability', criterion: B('Validates every requested seat belongs to the showtime\'s room, and rejects with the exact 409 error if any requested seat already has an active (non-canceled) ticket.', 'Kiểm mọi ghế yêu cầu thuộc phòng của suất chiếu, và từ chối đúng lỗi 409 nếu ghế nào đã có ticket còn hiệu lực (không canceled).'), weight: 1, maxScore: 0.8 },
    { id: 'vip_pricing_correct', criterion: B('Correctly applies a 20% surcharge to VIP seats and the base showtime price to NORMAL seats.', 'Áp đúng phụ phí 20% cho ghế VIP và giá gốc suất chiếu cho ghế NORMAL.'), weight: 1, maxScore: 0.7 },
    { id: 'tickets_created_and_total_correct', criterion: B('Creates exactly one ticket per requested seat and correctly computes totalAmount server-side, matching the response shape.', 'Tạo đúng 1 vé mỗi ghế yêu cầu và tính đúng totalAmount phía server, khớp hình dạng response.'), weight: 1, maxScore: 0.6 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE11',
    title: 'SDN302 – Practical Exam (Spring 2026), Online Cinema Ticket Booking|||SDN302 – Thi thực hành (Spring 2026), Đặt vé xem phim online',
    description: 'SDN302 PE (CODE): active movies, showtimes with room populate, seat availability derived from ticket status, and access_key-authorized ticket creation with VIP pricing, AI-graded.|||PE SDN302 (viết mã): phim đang chiếu, suất chiếu kèm populate phòng, tình trạng ghế suy ra từ status ticket, và tạo vé xác thực access_key kèm giá VIP, chấm AI.',
    durationMinutes: 90,
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
