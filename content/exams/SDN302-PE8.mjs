export default {
  "course": {
    "courseCode": "SDN302"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "CODE",
      "code": "PE8",
      "title": "SDN302 – Practical Exam (Summer 2025, Block 1), Event Booking API|||SDN302 – Thi thực hành (Summer 2025, Block 1), API đặt vé sự kiện",
      "description": "SDN302 PE (CODE): events listing, bookings by user, full booking detail with populate, ticket-availability-checked booking creation with stock decrement, and JWT login/profile, AI-graded.|||PE SDN302 (viết mã): danh sách sự kiện, đặt vé theo user, chi tiết đặt vé đầy đủ có populate, tạo đặt vé kiểm còn vé kèm trừ tồn kho, và đăng nhập/profile JWT, chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": null,
      "attachmentName": null,
      "instructions": "<div class=\"ml-en\"><p><strong>SDN302 – Practical Exam (Summer 2025, Block 1) — Event Booking API</strong>. Build a RESTful API (ExpressJS + MongoDB + Mongoose) for events, users, and bookings. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given data shape (collections: bookings, events, users — database \"SDN302_SU25_B1\"):</b><pre><code class=\"language-javascript\">// event\n{ name: String, description: String, date: Date, location: String, availableTickets: Number }\n// user\n{ name: String, email: String, password: String }\n// booking\n{ user: ObjectId /* ref users */, event: ObjectId /* ref events */, quantity: Number }</code></pre></div>|||<div class=\"pe-system\"><b>Hình dạng dữ liệu đề cho (bảng: bookings, events, users — database \"SDN302_SU25_B1\"):</b><pre><code class=\"language-javascript\">// event\n{ name: String, description: String, date: Date, location: String, availableTickets: Number }\n// user\n{ name: String, email: String, password: String }\n// booking\n{ user: ObjectId /* ref users */, event: ObjectId /* ref events */, quantity: Number }</code></pre></div></div><div class=\"ml-vi\"><p><strong>SDN302 – Thi thực hành (Summer 2025, Block 1) — API đặt vé sự kiện</strong>. Xây RESTful API (ExpressJS + MongoDB + Mongoose) cho events, users, bookings. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given data shape (collections: bookings, events, users — database \"SDN302_SU25_B1\"):</b><pre><code class=\"language-javascript\">// event\n{ name: String, description: String, date: Date, location: String, availableTickets: Number }\n// user\n{ name: String, email: String, password: String }\n// booking\n{ user: ObjectId /* ref users */, event: ObjectId /* ref events */, quantity: Number }</code></pre></div>|||<div class=\"pe-system\"><b>Hình dạng dữ liệu đề cho (bảng: bookings, events, users — database \"SDN302_SU25_B1\"):</b><pre><code class=\"language-javascript\">// event\n{ name: String, description: String, date: Date, location: String, availableTickets: Number }\n// user\n{ name: String, email: String, password: String }\n// booking\n{ user: ObjectId /* ref users */, event: ObjectId /* ref events */, quantity: Number }</code></pre></div></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "CODE",
          "points": 2,
          "language": "javascript",
          "prompt": "<p><strong>Question 1 (2 points) - Retrieve All Events with Details.</strong> Build an API that returns a list of all available events with full details. Endpoint: <code>GET /api/events</code>.</p><pre><code class=\"language-json\">[\n  { \"_id\": \"...\", \"name\": \"...\", \"description\": \"...\", \"date\": \"...\", \"location\": \"...\", \"availableTickets\": \"...\" }\n]</code></pre>|||<p><strong>Câu 1 (2 điểm) - Lấy tất cả sự kiện đầy đủ.</strong> Xây API trả về danh sách mọi sự kiện có sẵn với đầy đủ thông tin. Endpoint: <code>GET /api/events</code>.</p><pre><code class=\"language-json\">[\n  { \"_id\": \"...\", \"name\": \"...\", \"description\": \"...\", \"date\": \"...\", \"location\": \"...\", \"availableTickets\": \"...\" }\n]</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst Event = db.event;\n\nconst getAllEvents = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getAllEvents };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Event = db.event;\n\nconst getAllEvents = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const events = await Event.find();\n        res.json(events);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getAllEvents };",
          "explanation": "<p>No populate is needed here — every requested field (<code>name, description, date, location, availableTickets</code>) is a direct, non-reference field on the Event document itself, so a plain <code>find()</code> already returns the full details the paper asks for.</p>|||<p>Không cần populate ở đây — mọi field đề yêu cầu (<code>name, description, date, location, availableTickets</code>) đều là field trực tiếp, không tham chiếu, ngay trên document Event, nên <code>find()</code> thuần đã trả đủ chi tiết đề cần.</p>",
          "rubric": [
            {
              "id": "returns_all_events",
              "criterion": "Returns all events stored in the database.|||Trả về tất cả sự kiện trong database.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "full_details_present",
              "criterion": "Each event includes all 6 required fields (_id, name, description, date, location, availableTickets).|||Mỗi sự kiện có đủ 6 field yêu cầu (_id, name, description, date, location, availableTickets).",
              "weight": 1,
              "maxScore": 1.4
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 2 (1.5 points) - Retrieve Bookings by User ID.</strong> Build an API that fetches all bookings associated with a specific user. Endpoint: <code>GET /api/bookings/user/:userId</code>. Response: an array of booking records.</p><pre><code class=\"language-json\">[\n  { \"_id\": \"...\", \"event\": { \"name\": \"...\", \"date\": \"...\" }, \"quantity\": \"...\" }\n]</code></pre>|||<p><strong>Câu 2 (1.5 điểm) - Lấy đặt vé theo User ID.</strong> Xây API lấy mọi đặt vé của 1 user cụ thể. Endpoint: <code>GET /api/bookings/user/:userId</code>. Response: mảng bản ghi đặt vé.</p><pre><code class=\"language-json\">[\n  { \"_id\": \"...\", \"event\": { \"name\": \"...\", \"date\": \"...\" }, \"quantity\": \"...\" }\n]</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst Booking = db.booking;\n\nconst getBookingsByUser = async (req, res, next) => {\n    const { userId } = req.params;\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getBookingsByUser };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Booking = db.booking;\n\nconst getBookingsByUser = async (req, res, next) => {\n    const { userId } = req.params;\n    // ---------- Student's code starts from here ----------\n    try {\n        const bookings = await Booking.find({ user: userId })\n            .populate(\"event\", \"name date\")\n            .lean();\n\n        const formatted = bookings.map((b) => ({\n            _id: b._id,\n            event: { name: b.event?.name, date: b.event?.date },\n            quantity: b.quantity,\n        }));\n\n        res.json(formatted);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getBookingsByUser };",
          "explanation": "<p>The booking's own field is literally <code>user</code> (not <code>userId</code>, per the seed schema), so the query filter is <code>{ user: userId }</code>. <code>event</code> is populated to just <code>name</code>/<code>date</code>, matching this brief view — unlike Question 3's full-detail view, which needs more event fields.</p>|||<p>Field của booking đúng tên là <code>user</code> (không phải <code>userId</code>, theo schema seed), nên lọc query là <code>{ user: userId }</code>. <code>event</code> populate chỉ <code>name</code>/<code>date</code>, khớp view rút gọn này — khác view chi tiết đầy đủ ở Câu 3 cần thêm field event.</p>",
          "rubric": [
            {
              "id": "finds_bookings_by_user",
              "criterion": "Correctly finds all bookings belonging to the given userId, using the booking's actual \"user\" field.|||Tìm đúng mọi đặt vé thuộc userId đã cho, dùng đúng field \"user\" thật của booking.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "event_populated_brief",
              "criterion": "event is populated into brief info (name, date) rather than a raw ObjectId.|||event populate đúng rút gọn (name, date) thay vì ObjectId thô.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "response_shape_correct",
              "criterion": "Each booking has exactly _id, event ({name, date}), and quantity, matching the paper's example.|||Mỗi booking có đúng _id, event ({name, date}), và quantity, khớp ví dụ đề.",
              "weight": 1,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 3,
          "language": "javascript",
          "prompt": "<p><strong>Question 3 (3 points) - Retrieve Booking Details with User and Event Information.</strong> Return full details of a specific booking, including user and event information. Endpoint: <code>GET /api/bookings/:bookingId</code>.</p><pre><code class=\"language-json\">{\n  \"_id\": \"...\",\n  \"user\": { \"_id\": \"...\", \"name\": \"...\", \"email\": \"...\" },\n  \"event\": { \"_id\": \"...\", \"name\": \"...\", \"date\": \"...\", \"location\": \"...\" }\n}</code></pre><p>If bookingId does not exist, return the message: \"Booking not found\".</p>|||<p><strong>Câu 3 (3 điểm) - Chi tiết đặt vé đầy đủ user và sự kiện.</strong> Trả về đầy đủ chi tiết 1 đặt vé, gồm user và sự kiện. Endpoint: <code>GET /api/bookings/:bookingId</code>.</p><pre><code class=\"language-json\">{\n  \"_id\": \"...\",\n  \"user\": { \"_id\": \"...\", \"name\": \"...\", \"email\": \"...\" },\n  \"event\": { \"_id\": \"...\", \"name\": \"...\", \"date\": \"...\", \"location\": \"...\" }\n}</code></pre><p>Nếu bookingId không tồn tại, trả thông điệp: \"Booking not found\".</p>",
          "starterCode": "const db = require(\"../models/index\");\nconst Booking = db.booking;\n\nconst getBookingDetails = async (req, res, next) => {\n    const { bookingId } = req.params;\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getBookingDetails };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Booking = db.booking;\n\nconst getBookingDetails = async (req, res, next) => {\n    const { bookingId } = req.params;\n    // ---------- Student's code starts from here ----------\n    try {\n        const booking = await Booking.findById(bookingId)\n            .populate(\"user\", \"name email\")\n            .populate(\"event\", \"name date location\")\n            .lean();\n\n        if (!booking) {\n            return res.status(404).json({ message: \"Booking not found\" });\n        }\n\n        res.json({\n            _id: booking._id,\n            user: {\n                _id: booking.user._id,\n                name: booking.user.name,\n                email: booking.user.email,\n            },\n            event: {\n                _id: booking.event._id,\n                name: booking.event.name,\n                date: booking.event.date,\n                location: booking.event.location,\n            },\n        });\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getBookingDetails };",
          "explanation": "<p>Both <code>user</code> and <code>event</code> populate in one query. This full-detail view deliberately excludes <code>quantity</code> — the paper's own example response for THIS specific endpoint shows only <code>_id</code>, <code>user</code>, and <code>event</code>, unlike some sibling exams whose detail views do keep a per-item quantity; the exact 404 message text (\"Booking not found\") is used verbatim, since the paper states it explicitly.</p>|||<p>Cả <code>user</code> và <code>event</code> populate trong 1 truy vấn. View chi tiết đầy đủ này cố tình KHÔNG có <code>quantity</code> — ví dụ response của đúng endpoint này chỉ hiện <code>_id</code>, <code>user</code>, <code>event</code>, khác vài đề anh em có view chi tiết vẫn giữ quantity theo từng mục; thông điệp 404 (\"Booking not found\") dùng đúng nguyên văn, vì đề nêu rõ.</p>",
          "rubric": [
            {
              "id": "user_populated",
              "criterion": "user is correctly populated into an object with at least _id, name, and email.|||user populate đúng thành object có ít nhất _id, name, email.",
              "weight": 1,
              "maxScore": 0.9
            },
            {
              "id": "event_populated",
              "criterion": "event is correctly populated into an object with at least _id, name, date, and location.|||event populate đúng thành object có ít nhất _id, name, date, location.",
              "weight": 1,
              "maxScore": 0.9
            },
            {
              "id": "not_found_exact_message",
              "criterion": "Returns the exact message \"Booking not found\" when the bookingId doesn't exist.|||Trả đúng nguyên văn thông điệp \"Booking not found\" khi bookingId không tồn tại.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "response_shape_correct",
              "criterion": "Full response shape matches the paper's example exactly.|||Hình dạng response đầy đủ khớp đúng ví dụ đề.",
              "weight": 1,
              "maxScore": 0.6
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 4 (2.5 points) - Create a New Booking.</strong> Develop an API that lets a user book tickets for an event. Endpoint: <code>POST /api/bookings</code>. Input: <code>{ \"userId\": \"...\", \"eventId\": \"...\", \"quantity\": ... }</code>. Output: the newly created booking document.</p><p><strong>Validate:</strong> if <code>eventId</code> does not exist, return the message \"Event not found\". If the number of tickets to book (<code>quantity</code>) is greater than <code>availableTickets</code>, return the message \"Not enough tickets available\".</p><p><strong>Additional requirement:</strong> automatically update the <code>availableTickets</code> field of the event (decrease it based on the quantity booked).</p>|||<p><strong>Câu 4 (2.5 điểm) - Tạo đặt vé mới.</strong> Xây API cho user đặt vé sự kiện. Endpoint: <code>POST /api/bookings</code>. Input: <code>{ \"userId\": \"...\", \"eventId\": \"...\", \"quantity\": ... }</code>. Output: booking document vừa tạo.</p><p><strong>Kiểm:</strong> nếu <code>eventId</code> không tồn tại, trả thông điệp \"Event not found\". Nếu số vé muốn đặt (<code>quantity</code>) lớn hơn <code>availableTickets</code>, trả thông điệp \"Not enough tickets available\".</p><p><strong>Yêu cầu thêm:</strong> tự động cập nhật <code>availableTickets</code> của sự kiện (giảm theo số vé đã đặt).</p>",
          "starterCode": "const db = require(\"../models/index\");\nconst Event = db.event;\nconst Booking = db.booking;\n\nconst createBooking = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { createBooking };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Event = db.event;\nconst Booking = db.booking;\n\nconst createBooking = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { userId, eventId, quantity } = req.body;\n\n        const event = await Event.findById(eventId);\n        if (!event) {\n            return res.status(404).json({ message: \"Event not found\" });\n        }\n\n        if (quantity > event.availableTickets) {\n            return res.status(400).json({ message: \"Not enough tickets available\" });\n        }\n\n        event.availableTickets -= quantity;\n        await event.save();\n\n        const booking = await Booking.create({\n            user: userId,\n            event: eventId,\n            quantity,\n        });\n\n        res.status(201).json(booking);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { createBooking };",
          "explanation": "<p>The event existence check and the ticket-availability check both happen BEFORE decrementing <code>availableTickets</code> or creating the booking — a rejected request (event not found, or not enough tickets) never has any side effect on the event's stock. The paper gives no example response body for this endpoint (unlike Questions 1-3), so the newly created booking is returned exactly as saved, without extra reshaping.</p>|||<p>Kiểm sự kiện tồn tại và kiểm còn đủ vé đều xảy ra TRƯỚC khi trừ <code>availableTickets</code> hay tạo booking — request bị từ chối (không tìm thấy sự kiện, hoặc không đủ vé) không bao giờ gây tác dụng phụ lên tồn vé. Đề không cho ví dụ response cụ thể cho endpoint này (khác Câu 1-3), nên booking vừa tạo trả về nguyên như đã lưu, không định dạng lại thêm.</p>",
          "rubric": [
            {
              "id": "event_existence_check",
              "criterion": "Validates the event exists, returning the exact message \"Event not found\" if not, before any other processing.|||Kiểm sự kiện tồn tại, trả đúng nguyên văn \"Event not found\" nếu không, trước mọi xử lý khác.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "ticket_availability_check",
              "criterion": "Validates the requested quantity does not exceed availableTickets, returning the exact message \"Not enough tickets available\" if it does.|||Kiểm quantity yêu cầu không vượt availableTickets, trả đúng nguyên văn \"Not enough tickets available\" nếu vượt.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "no_side_effect_on_rejection",
              "criterion": "A rejected booking (event not found, insufficient tickets) has no side effect on the event's availableTickets or creates no booking record.|||Đặt vé bị từ chối (không thấy sự kiện, không đủ vé) không gây tác dụng phụ lên availableTickets và không tạo booking.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "available_tickets_decremented",
              "criterion": "On success, availableTickets is correctly decreased by exactly the booked quantity.|||Khi thành công, availableTickets giảm đúng đúng bằng quantity đã đặt.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "booking_created_correctly",
              "criterion": "The new booking is correctly saved with user, event, and quantity, and returned in the response.|||Booking mới lưu đúng user, event, quantity, và trả về trong response.",
              "weight": 1,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "javascript",
          "prompt": "<p><strong>Question 5 (1 point) - User Authentication with JWT.</strong> Implement login functionality using JWT and protect private routes.</p><p><b>Login API:</b> <code>POST /api/users/login</code>. Input: <code>{ \"email\": \"...\", \"password\": \"...\" }</code>. Data for testing: <code>{\"email\": \"john@example.com\", \"password\": \"password123\"}</code>. Output: <code>{ \"token\": \"...\" }</code>. If invalid email or password, return message \"Invalid credentials\". Use JWT_SECRET from .env, expiring in 1h.</p><p><b>Protected API:</b> <code>GET /api/users/profile</code>, header <code>Authorization: Bearer &lt;token&gt;</code>. Returns the user's profile if the token is valid.</p>|||<p><strong>Câu 5 (1 điểm) - Xác thực JWT.</strong> Triển khai đăng nhập bằng JWT và bảo vệ route riêng tư.</p><p><b>API đăng nhập:</b> <code>POST /api/users/login</code>. Input: <code>{ \"email\": \"...\", \"password\": \"...\" }</code>. Dữ liệu test: <code>{\"email\": \"john@example.com\", \"password\": \"password123\"}</code>. Output: <code>{ \"token\": \"...\" }</code>. Nếu email/mật khẩu sai, trả \"Invalid credentials\". Dùng JWT_SECRET từ .env, hết hạn sau 1h.</p><p><b>API bảo vệ:</b> <code>GET /api/users/profile</code>, header <code>Authorization: Bearer &lt;token&gt;</code>. Trả profile user nếu token hợp lệ.</p>",
          "starterCode": "const bcrypt = require(\"bcryptjs\");\nconst jwt = require(\"jsonwebtoken\");\nconst db = require(\"../models/index\");\nconst User = db.user;\n\nconst login = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nconst authenticateToken = (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nconst getProfile = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { login, authenticateToken, getProfile };",
          "sampleSolution": "const bcrypt = require(\"bcryptjs\");\nconst jwt = require(\"jsonwebtoken\");\nconst db = require(\"../models/index\");\nconst User = db.user;\n\nconst login = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { email, password } = req.body;\n\n        const user = await User.findOne({ email });\n        if (!user) {\n            return res.status(401).json({ message: \"Invalid credentials\" });\n        }\n\n        // users.json stores 'password' already bcrypt-hashed — compare, never string-equal\n        const isMatch = await bcrypt.compare(password, user.password);\n        if (!isMatch) {\n            return res.status(401).json({ message: \"Invalid credentials\" });\n        }\n\n        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: \"1h\" });\n        res.json({ token });\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nconst authenticateToken = (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    const authHeader = req.headers[\"authorization\"];\n    const token = authHeader && authHeader.split(\" \")[1];\n\n    if (!token) {\n        return res.status(401).json({ message: \"No token provided\" });\n    }\n\n    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {\n        if (err) {\n            return res.status(403).json({ message: \"Invalid or expired token\" });\n        }\n        req.user = decoded;\n        next();\n    });\n    // -------------------------------------------------------\n};\n\nconst getProfile = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const user = await User.findById(req.user.id).select(\"-password\").lean();\n        if (!user) {\n            return res.status(404).json({ message: \"User not found\" });\n        }\n        res.json(user);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { login, authenticateToken, getProfile };",
          "explanation": "<p>Same discipline as the sibling exams in this course: the seed data's <code>password</code> field is already bcrypt-hashed, so <code>bcrypt.compare()</code> is required, never a plaintext comparison. The exact error message \"Invalid credentials\" is returned identically whether the email doesn't exist or the password is wrong.</p>|||<p>Cùng kỷ luật như các đề anh em trong môn: field <code>password</code> trong dữ liệu seed đã băm bcrypt sẵn, nên cần <code>bcrypt.compare()</code>, không bao giờ so chuỗi thô. Thông điệp lỗi đúng \"Invalid credentials\" trả về giống hệt dù email không tồn tại hay mật khẩu sai.</p>",
          "rubric": [
            {
              "id": "login_bcrypt_compare_and_jwt",
              "criterion": "Login validates credentials using bcrypt.compare and returns a valid JWT signed with the secret from .env, expiring in 1h.|||Đăng nhập kiểm đúng bằng bcrypt.compare, trả JWT hợp lệ ký bằng secret từ .env, hết hạn 1h.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "invalid_credentials_message",
              "criterion": "Returns the exact message \"Invalid credentials\" for either a nonexistent email or a wrong password.|||Trả đúng nguyên văn \"Invalid credentials\" cho cả email không tồn tại lẫn mật khẩu sai.",
              "weight": 1,
              "maxScore": 0.2
            },
            {
              "id": "middleware_protects_profile",
              "criterion": "The profile endpoint is protected by JWT middleware that correctly rejects missing/invalid tokens.|||Endpoint profile được bảo vệ bởi middleware JWT từ chối đúng token thiếu/sai.",
              "weight": 1,
              "maxScore": 0.3
            }
          ]
        }
      ]
    }
  ]
};
