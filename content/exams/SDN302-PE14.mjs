export default {
  "course": {
    "courseCode": "SDN302"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "CODE",
      "code": "PE14",
      "title": "SDN302 – Practical Exam (Summer 2025, Block 5), Cinema Ticket Booking API|||SDN302 – Thi thực hành (Summer 2025, Block 5), API đặt vé xem phim",
      "description": "SDN302 PE (CODE): pure backend REST API for a cinema ticket-booking system (movies/theaters/showtimes/tickets/users), no authentication required by this paper, AI-graded.|||PE SDN302 (viết mã): REST API thuần backend cho hệ thống đặt vé xem phim (movies/theaters/showtimes/tickets/users), đề này không yêu cầu xác thực, chấm AI.",
      "durationMinutes": 75,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": null,
      "attachmentName": null,
      "instructions": "<div class=\"ml-en\"><p><strong>SDN302 – Practical Exam (Summer 2025, Block 5) — Cinema Ticket Booking API</strong>. Build a RESTful API only (no client). This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given data shape (collections: movies, theaters, showtimes, tickets, users):</b><pre><code class=\"language-javascript\">// movie\n{ title: String, genre: [String], duration: Number,\n  details: { director: String, releaseDate: Date, rating: { score: Number, source: String } } }\n\n// theater\n{ name: String, location: { address, city, coordinates: {lat, lng} },\n  showtimes: [ObjectId] /* ref showtime */ }\n\n// showtime\n{ movieId: ObjectId /* ref movie */, theaterId: ObjectId /* ref theater */,\n  startTime: Date, room: String,\n  seats: [{ seatNumber: String, status: String /* \"available\"|\"booked\" */,\n            position: { row: String, column: Number } }] }\n\n// ticket\n{ userId: ObjectId /* ref user */, showtimeId: ObjectId /* ref showtime */,\n  seats: [{ seatNumber: String, price: Number,\n            details: { type: String /* \"adult\"|\"child\" */, discount: Number } }],\n  totalPrice: Number, bookingTime: Date }\n\n// user\n{ email: String, password: String /* bcrypt hash */, username: String,\n  profile: { fullName, contact: { phone, address: { street, city } } } }</code></pre><p>No authentication is required by this paper — every endpoint below is public.</p></div>|||<div class=\"pe-system\"><b>Hình dạng dữ liệu đề cho (bảng: movies, theaters, showtimes, tickets, users):</b><pre><code class=\"language-javascript\">// movie\n{ title: String, genre: [String], duration: Number,\n  details: { director: String, releaseDate: Date, rating: { score: Number, source: String } } }\n\n// theater\n{ name: String, location: { address, city, coordinates: {lat, lng} },\n  showtimes: [ObjectId] /* ref showtime */ }\n\n// showtime\n{ movieId: ObjectId /* ref movie */, theaterId: ObjectId /* ref theater */,\n  startTime: Date, room: String,\n  seats: [{ seatNumber: String, status: String /* \"available\"|\"booked\" */,\n            position: { row: String, column: Number } }] }\n\n// ticket\n{ userId: ObjectId /* ref user */, showtimeId: ObjectId /* ref showtime */,\n  seats: [{ seatNumber: String, price: Number,\n            details: { type: String /* \"adult\"|\"child\" */, discount: Number } }],\n  totalPrice: Number, bookingTime: Date }\n\n// user\n{ email: String, password: String /* bcrypt hash */, username: String,\n  profile: { fullName, contact: { phone, address: { street, city } } } }</code></pre><p>Đề này KHÔNG yêu cầu xác thực — mọi endpoint dưới đây đều public.</p></div></div><div class=\"ml-vi\"><p><strong>SDN302 – Thi thực hành (Summer 2025, Block 5) — API đặt vé xem phim</strong>. Chỉ xây RESTful API (không có client). Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given data shape (collections: movies, theaters, showtimes, tickets, users):</b><pre><code class=\"language-javascript\">// movie\n{ title: String, genre: [String], duration: Number,\n  details: { director: String, releaseDate: Date, rating: { score: Number, source: String } } }\n\n// theater\n{ name: String, location: { address, city, coordinates: {lat, lng} },\n  showtimes: [ObjectId] /* ref showtime */ }\n\n// showtime\n{ movieId: ObjectId /* ref movie */, theaterId: ObjectId /* ref theater */,\n  startTime: Date, room: String,\n  seats: [{ seatNumber: String, status: String /* \"available\"|\"booked\" */,\n            position: { row: String, column: Number } }] }\n\n// ticket\n{ userId: ObjectId /* ref user */, showtimeId: ObjectId /* ref showtime */,\n  seats: [{ seatNumber: String, price: Number,\n            details: { type: String /* \"adult\"|\"child\" */, discount: Number } }],\n  totalPrice: Number, bookingTime: Date }\n\n// user\n{ email: String, password: String /* bcrypt hash */, username: String,\n  profile: { fullName, contact: { phone, address: { street, city } } } }</code></pre><p>No authentication is required by this paper — every endpoint below is public.</p></div>|||<div class=\"pe-system\"><b>Hình dạng dữ liệu đề cho (bảng: movies, theaters, showtimes, tickets, users):</b><pre><code class=\"language-javascript\">// movie\n{ title: String, genre: [String], duration: Number,\n  details: { director: String, releaseDate: Date, rating: { score: Number, source: String } } }\n\n// theater\n{ name: String, location: { address, city, coordinates: {lat, lng} },\n  showtimes: [ObjectId] /* ref showtime */ }\n\n// showtime\n{ movieId: ObjectId /* ref movie */, theaterId: ObjectId /* ref theater */,\n  startTime: Date, room: String,\n  seats: [{ seatNumber: String, status: String /* \"available\"|\"booked\" */,\n            position: { row: String, column: Number } }] }\n\n// ticket\n{ userId: ObjectId /* ref user */, showtimeId: ObjectId /* ref showtime */,\n  seats: [{ seatNumber: String, price: Number,\n            details: { type: String /* \"adult\"|\"child\" */, discount: Number } }],\n  totalPrice: Number, bookingTime: Date }\n\n// user\n{ email: String, password: String /* bcrypt hash */, username: String,\n  profile: { fullName, contact: { phone, address: { street, city } } } }</code></pre><p>Đề này KHÔNG yêu cầu xác thực — mọi endpoint dưới đây đều public.</p></div></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "CODE",
          "points": 2,
          "language": "javascript",
          "prompt": "<p><strong>Question 1 (2 points): Implement GET /api/showtimes/:movieId</strong></p><p><b>Objective:</b> return all showtimes for a given movie across every theater, including theater details and only the <b>\"available\"</b> seats, with <code>startTime</code> displayed in <b>DD/MM/YYYY HH:mm</b> format.</p><p><b>Response body</b> (200): array of <code>{ _id, theaterName, startTime, room, seats: [{seatNumber, status}] }</code> — <code>seats</code> contains ONLY seats whose status is \"available\".</p><p><b>Errors:</b> 404 if no showtime found for the movieId; 500 on server error.</p>|||<p><strong>Câu 1 (2 điểm): Implement GET /api/showtimes/:movieId</strong></p><p><b>Mục tiêu:</b> trả mọi showtime của 1 movie qua mọi theater, kèm chi tiết theater và CHỈ ghế \"available\", <code>startTime</code> hiện dạng <b>DD/MM/YYYY HH:mm</b>.</p><p><b>Body trả về</b> (200): mảng <code>{ _id, theaterName, startTime, room, seats: [{seatNumber, status}] }</code> — <code>seats</code> CHỈ chứa ghế status \"available\".</p><p><b>Lỗi:</b> 404 nếu không có showtime nào cho movieId; 500 lỗi server.</p>",
          "starterCode": "// ===== controllers/showtime.controller.js =====\nconst db = require(\"../models/index\");\nconst Showtime = db.showtime;\n\nconst formatDateTime = (date) => {\n    const d = new Date(date);\n    const pad = (n) => String(n).padStart(2, \"0\");\n    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;\n};\n\nconst getShowtimesByMovie = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getShowtimesByMovie };",
          "sampleSolution": "// ===== controllers/showtime.controller.js =====\nconst db = require(\"../models/index\");\nconst Showtime = db.showtime;\n\nconst formatDateTime = (date) => {\n    const d = new Date(date);\n    const pad = (n) => String(n).padStart(2, \"0\");\n    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;\n};\n\nconst getShowtimesByMovie = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { movieId } = req.params;\n\n        const showtimes = await Showtime.find({ movieId }).populate(\"theaterId\", \"name\");\n        if (!showtimes.length) {\n            return res.status(404).json({ message: \"Not movieId found for the showtimes.\" });\n        }\n\n        const result = showtimes.map((st) => ({\n            _id: st._id,\n            theaterName: st.theaterId ? st.theaterId.name : null,\n            startTime: formatDateTime(st.startTime),\n            room: st.room,\n            seats: st.seats\n                .filter((s) => s.status === \"available\")\n                .map((s) => ({ seatNumber: s.seatNumber, status: s.status })),\n        }));\n\n        res.status(200).json(result);\n    } catch (error) {\n        res.status(500).json({ message: error.message });\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getShowtimesByMovie };",
          "explanation": "<p>Query is by <code>movieId</code> directly (not populated) since only the theater side needs a name lookup; <code>.populate(\"theaterId\", \"name\")</code> keeps the projection to just the field the response needs. Seats are filtered to <code>status === \"available\"</code> AFTER fetching — filtering in the query itself (<code>{\"seats.status\":\"available\"}</code>) would only filter which SHOWTIMES match, not shrink the returned array, since Mongoose array-element query filters don't trim embedded arrays without <code>$elemMatch</code> + aggregation.</p>|||<p>Query lọc theo <code>movieId</code> trực tiếp (không populate) vì chỉ phía theater cần tra tên; <code>.populate(\"theaterId\", \"name\")</code> giữ đúng field response cần. Ghế lọc <code>status === \"available\"</code> SAU KHI lấy về — lọc ngay trong query (<code>{\"seats.status\":\"available\"}</code>) chỉ lọc SHOWTIME nào khớp, không thu nhỏ mảng trả về, vì filter Mongoose trên phần tử mảng không tự cắt mảng nhúng nếu không dùng <code>$elemMatch</code> + aggregation.</p>",
          "rubric": [
            {
              "id": "query_by_movieid_all_theaters",
              "criterion": "Correctly queries all showtimes for the given movieId across every theater.|||Truy vấn đúng mọi showtime của movieId cho mọi theater.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "theater_details_included",
              "criterion": "Theater details (at least the theater name) are correctly joined/populated into the response.|||Chi tiết theater (ít nhất tên) được join/populate đúng vào response.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "only_available_seats",
              "criterion": "Only seats with status \"available\" are included in the response seats array.|||Chỉ ghế status \"available\" nằm trong mảng seats của response.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "starttime_format_and_404",
              "criterion": "startTime is formatted as DD/MM/YYYY HH:mm, and a 404 is returned when no showtime exists for the movieId.|||startTime định dạng DD/MM/YYYY HH:mm, và trả 404 khi không có showtime nào cho movieId.",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 2 (2.5 points): Implement GET /api/tickets/:userId</strong> (the actual tested route is plural <code>/api/tickets/:userId</code> — the paper's own section heading says \"ticket\" singular, but the given \"Requests for API Testing\" sample uses <code>/api/tickets/...</code>; implement the plural route actually exercised by the test request).</p><p><b>Objective:</b> fetch all tickets belonging to a particular user, together with showtime and movie details, and compute the total amount the user has spent.</p><p><b>Response body</b> (200): <code>{ userId, ticketInfo: [{ showtimeId, movieId, movieTitle, totalPrice }], totalAmount }</code> where <code>totalAmount</code> is the sum of every ticket's <code>totalPrice</code>.</p><p><b>Errors:</b> 404 if no tickets found for the user; 500 on server error.</p>|||<p><strong>Câu 2 (2.5 điểm): Implement GET /api/tickets/:userId</strong> (route thật được test là số nhiều <code>/api/tickets/:userId</code> — tiêu đề mục của đề ghi \"ticket\" số ít, nhưng file \"Requests for API Testing\" mẫu lại dùng <code>/api/tickets/...</code>; triển khai đúng route số nhiều thật sự được test).</p><p><b>Mục tiêu:</b> lấy mọi ticket của 1 user, kèm chi tiết showtime và movie, tính tổng số tiền user đã chi.</p><p><b>Body trả về</b> (200): <code>{ userId, ticketInfo: [{ showtimeId, movieId, movieTitle, totalPrice }], totalAmount }</code> — <code>totalAmount</code> là tổng <code>totalPrice</code> của mọi ticket.</p><p><b>Lỗi:</b> 404 nếu user không có ticket nào; 500 lỗi server.</p>",
          "starterCode": "// ===== controllers/ticket.controller.js =====\nconst db = require(\"../models/index\");\nconst Ticket = db.ticket;\n\nconst getTicketsByUser = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getTicketsByUser };",
          "sampleSolution": "// ===== controllers/ticket.controller.js =====\nconst db = require(\"../models/index\");\nconst Ticket = db.ticket;\n\nconst getTicketsByUser = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { userId } = req.params;\n\n        const tickets = await Ticket.find({ userId }).populate({\n            path: \"showtimeId\",\n            populate: { path: \"movieId\", select: \"title\" },\n        });\n\n        if (!tickets.length) {\n            return res.status(404).json({ message: \"No tickets found for the user.\" });\n        }\n\n        const ticketInfo = tickets.map((t) => ({\n            showtimeId: t.showtimeId ? t.showtimeId._id : null,\n            movieId: t.showtimeId && t.showtimeId.movieId ? t.showtimeId.movieId._id : null,\n            movieTitle: t.showtimeId && t.showtimeId.movieId ? t.showtimeId.movieId.title : null,\n            totalPrice: t.totalPrice,\n        }));\n\n        const totalAmount = tickets.reduce((sum, t) => sum + t.totalPrice, 0);\n\n        res.status(200).json({ userId, ticketInfo, totalAmount });\n    } catch (error) {\n        res.status(500).json({ message: error.message });\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getTicketsByUser };",
          "explanation": "<p>A nested <code>populate</code> (<code>showtimeId</code> → <code>movieId</code>) is required because <code>movieTitle</code> is two hops away from <code>ticket</code>: ticket→showtime→movie. <code>totalAmount</code> reuses each ticket's own pre-computed <code>totalPrice</code> field (set at creation time in Question 4) rather than recomputing from seats, since the ticket document already stores the authoritative total.</p>|||<p>Cần <code>populate</code> lồng (<code>showtimeId</code> → <code>movieId</code>) vì <code>movieTitle</code> cách <code>ticket</code> 2 bước: ticket→showtime→movie. <code>totalAmount</code> dùng lại field <code>totalPrice</code> đã tính sẵn của từng ticket (đặt lúc tạo ở Câu 4) thay vì tính lại từ seats, vì ticket đã lưu sẵn tổng chính xác.</p>",
          "rubric": [
            {
              "id": "query_by_userid",
              "criterion": "Correctly queries all tickets for the given userId.|||Truy vấn đúng mọi ticket của userId.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "nested_populate_movie_title",
              "criterion": "Correctly joins/populates through showtime to movie to obtain movieTitle for each ticket.|||Join/populate đúng qua showtime tới movie để lấy movieTitle từng ticket.",
              "weight": 1,
              "maxScore": 1
            },
            {
              "id": "total_amount_correct",
              "criterion": "totalAmount correctly sums totalPrice across all of the user's tickets.|||totalAmount cộng đúng totalPrice của mọi ticket user đó.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "not_found_handling",
              "criterion": "Returns 404 when the user has no tickets.|||Trả 404 khi user không có ticket nào.",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 3,
          "language": "javascript",
          "prompt": "<p><strong>Question 3 (3 points): Implement GET /api/theaters</strong></p><p><b>Objective:</b> retrieve all theaters with their showtimes and associated movie details, formatting <code>startTime</code> as <b>DD/MM/YYYY HH:mm</b>.</p><p><b>Response body</b> (200): array of <code>{ _id, name, position: \"address, city\", showtimes: [{ showtimeId, moviesTitle, duration, startTime, room, seats: [{seatNumber, status}] }] }</code> — <code>seats</code> here includes ALL seats (no availability filter, unlike Question 1).</p><p><b>Errors:</b> 500 on server error.</p>|||<p><strong>Câu 3 (3 điểm): Implement GET /api/theaters</strong></p><p><b>Mục tiêu:</b> lấy mọi theater kèm showtimes và chi tiết movie liên quan, định dạng <code>startTime</code> dạng <b>DD/MM/YYYY HH:mm</b>.</p><p><b>Body trả về</b> (200): mảng <code>{ _id, name, position: \"address, city\", showtimes: [{ showtimeId, moviesTitle, duration, startTime, room, seats: [{seatNumber, status}] }] }</code> — <code>seats</code> ở đây gồm TẤT CẢ ghế (không lọc available, khác Câu 1).</p><p><b>Lỗi:</b> 500 lỗi server.</p>",
          "starterCode": "// ===== controllers/theater.controller.js =====\nconst db = require(\"../models/index\");\nconst Theater = db.theater;\n\nconst formatDateTime = (date) => {\n    const d = new Date(date);\n    const pad = (n) => String(n).padStart(2, \"0\");\n    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;\n};\n\nconst getAllTheaters = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getAllTheaters };",
          "sampleSolution": "// ===== controllers/theater.controller.js =====\nconst db = require(\"../models/index\");\nconst Theater = db.theater;\n\nconst formatDateTime = (date) => {\n    const d = new Date(date);\n    const pad = (n) => String(n).padStart(2, \"0\");\n    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;\n};\n\nconst getAllTheaters = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const theaters = await Theater.find().populate({\n            path: \"showtimes\",\n            populate: { path: \"movieId\", select: \"title duration\" },\n        });\n\n        const result = theaters.map((theater) => ({\n            _id: theater._id,\n            name: theater.name,\n            position: `${theater.location.address}, ${theater.location.city}`,\n            showtimes: theater.showtimes.map((st) => ({\n                showtimeId: st._id,\n                moviesTitle: st.movieId ? st.movieId.title : null,\n                duration: st.movieId ? st.movieId.duration : null,\n                startTime: formatDateTime(st.startTime),\n                room: st.room,\n                seats: st.seats.map((s) => ({ seatNumber: s.seatNumber, status: s.status })),\n            })),\n        }));\n\n        res.status(200).json(result);\n    } catch (error) {\n        res.status(500).json({ message: error.message });\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getAllTheaters };",
          "explanation": "<p><code>duration</code> in the response comes from <code>movie.duration</code>, not from the showtime document (showtime has no duration field of its own) — this requires the nested populate <code>showtimes → movieId</code>. <code>position</code> is a computed string joining <code>location.address</code> and <code>location.city</code>, not a stored field. Seats are returned in full here (contrast with Question 1's availability filter) because the response schema for this endpoint has no such restriction.</p>|||<p><code>duration</code> trong response lấy từ <code>movie.duration</code>, không phải từ showtime (showtime không có field duration riêng) — cần populate lồng <code>showtimes → movieId</code>. <code>position</code> là chuỗi TÍNH ra ghép <code>location.address</code> và <code>location.city</code>, không phải field lưu sẵn. Ghế trả đầy đủ ở đây (khác Câu 1 có lọc available) vì response schema của endpoint này không giới hạn.</p>",
          "rubric": [
            {
              "id": "all_theaters_with_showtimes",
              "criterion": "Correctly retrieves all theaters together with their showtimes.|||Lấy đúng mọi theater kèm showtimes của nó.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "movie_details_joined",
              "criterion": "movieTitle and duration are correctly joined from the movie collection via the showtime.|||moviesTitle và duration join đúng từ bảng movie qua showtime.",
              "weight": 1,
              "maxScore": 0.8
            },
            {
              "id": "position_and_starttime_format",
              "criterion": "position is correctly composed as \"address, city\" and startTime is formatted as DD/MM/YYYY HH:mm.|||position ghép đúng \"address, city\" và startTime định dạng DD/MM/YYYY HH:mm.",
              "weight": 1,
              "maxScore": 0.8
            },
            {
              "id": "all_seats_included",
              "criterion": "All seats (not filtered by availability) are included for each showtime.|||Mọi ghế (không lọc theo trạng thái) được đưa vào mỗi showtime.",
              "weight": 1,
              "maxScore": 0.7
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 4 (2.5 points): Implement POST /api/tickets</strong></p><p><b>Objective:</b> create a ticket for a user, validate seat availability, update the showtime seat statuses, and calculate the total price, with robust input validation.</p><p><b>Request body:</b> <code>{ userId, showtimeId, seats: [{ seatNumber, type: \"adult\"|\"child\", price, discount? }] }</code> — <code>price</code> is supplied by the client per seat (there is no server-side price table in this paper).</p><p><b>Tasks:</b></p><ul><li>Validate <code>seats</code> as a non-empty array, where each seat has: <code>seatNumber</code> non-empty string; <code>type</code> either \"adult\" or \"child\"; <code>price</code> positive number; <code>discount</code> optional non-negative number (default 0 if not provided).</li><li>Verify the user exists in the users collection (404 if not).</li><li>Verify the showtime exists in the showtimes collection (404 if not).</li><li>Check that all requested seatNumbers are available in the showtime's seats array (status: \"available\") — 409 if any is already booked or does not exist.</li><li>Calculate <code>totalPrice</code> as the sum of (price − discount) for each seat.</li><li>Create a new ticket with userId, showtimeId, formatted seats (each reshaped to <code>{seatNumber, price, details:{type, discount}}</code> to match the ticket schema), and totalPrice.</li><li>Update the showtime's seats array to set the status of the requested seats to \"booked\".</li><li>Return the created ticket in the response (201).</li></ul><p><b>Errors:</b> 400 invalid input; 404 user or showtime not found; 409 one or more seats already booked or invalid; 500 server error.</p>|||<p><strong>Câu 4 (2.5 điểm): Implement POST /api/tickets</strong></p><p><b>Mục tiêu:</b> tạo ticket cho 1 user, kiểm ghế còn trống, cập nhật trạng thái ghế của showtime, tính tổng tiền, kèm kiểm dữ liệu vào chắc chắn.</p><p><b>Body request:</b> <code>{ userId, showtimeId, seats: [{ seatNumber, type: \"adult\"|\"child\", price, discount? }] }</code> — <code>price</code> do CLIENT GỬI theo từng ghế (đề này không có bảng giá phía server).</p><p><b>Việc cần làm:</b></p><ul><li>Kiểm <code>seats</code> là mảng không rỗng, mỗi ghế có: <code>seatNumber</code> chuỗi không rỗng; <code>type</code> \"adult\" hoặc \"child\"; <code>price</code> số dương; <code>discount</code> tuỳ chọn số không âm (mặc định 0 nếu không có).</li><li>Kiểm user tồn tại trong bảng users (404 nếu không).</li><li>Kiểm showtime tồn tại trong bảng showtimes (404 nếu không).</li><li>Kiểm mọi seatNumber yêu cầu đang \"available\" trong mảng seats của showtime — 409 nếu ghế nào đã đặt hoặc không tồn tại.</li><li>Tính <code>totalPrice</code> là tổng (price − discount) từng ghế.</li><li>Tạo ticket mới gồm userId, showtimeId, seats đã nắn dạng (mỗi ghế thành <code>{seatNumber, price, details:{type, discount}}</code> khớp schema ticket), và totalPrice.</li><li>Cập nhật mảng seats của showtime, đặt status các ghế yêu cầu thành \"booked\".</li><li>Trả về ticket vừa tạo (201).</li></ul><p><b>Lỗi:</b> 400 dữ liệu sai; 404 không tìm thấy user/showtime; 409 ghế nào đó đã đặt hoặc không hợp lệ; 500 lỗi server.</p>",
          "starterCode": "// ===== controllers/ticket.controller.js (POST) =====\nconst db = require(\"../models/index\");\nconst Ticket = db.ticket;\nconst Showtime = db.showtime;\nconst User = db.user;\n\nconst validateSeatsInput = (seats) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nconst createTicket = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { createTicket };",
          "sampleSolution": "// ===== controllers/ticket.controller.js (POST) =====\nconst db = require(\"../models/index\");\nconst Ticket = db.ticket;\nconst Showtime = db.showtime;\nconst User = db.user;\n\nconst validateSeatsInput = (seats) => {\n    // ---------- Student's code starts from here ----------\n    if (!Array.isArray(seats) || seats.length === 0) {\n        return \"seats must be a non-empty array\";\n    }\n    for (const seat of seats) {\n        if (!seat.seatNumber || typeof seat.seatNumber !== \"string\") {\n            return \"each seat must have a non-empty seatNumber string\";\n        }\n        if (seat.type !== \"adult\" && seat.type !== \"child\") {\n            return 'each seat type must be either \"adult\" or \"child\"';\n        }\n        if (typeof seat.price !== \"number\" || seat.price <= 0) {\n            return \"each seat price must be a positive number\";\n        }\n        if (seat.discount !== undefined && (typeof seat.discount !== \"number\" || seat.discount < 0)) {\n            return \"discount must be a non-negative number when provided\";\n        }\n    }\n    return null;\n    // -------------------------------------------------------\n};\n\nconst createTicket = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { userId, showtimeId, seats } = req.body;\n\n        const validationError = validateSeatsInput(seats);\n        if (validationError) {\n            return res.status(400).json({ message: validationError });\n        }\n\n        const user = await User.findById(userId);\n        if (!user) {\n            return res.status(404).json({ message: \"User not found.\" });\n        }\n\n        const showtime = await Showtime.findById(showtimeId);\n        if (!showtime) {\n            return res.status(404).json({ message: \"Showtime not found.\" });\n        }\n\n        const requestedSeatNumbers = seats.map((s) => s.seatNumber);\n        for (const seatNumber of requestedSeatNumbers) {\n            const showtimeSeat = showtime.seats.find((s) => s.seatNumber === seatNumber);\n            if (!showtimeSeat || showtimeSeat.status !== \"available\") {\n                return res.status(409).json({\n                    message: `Seat ${seatNumber} is already booked or invalid.`,\n                });\n            }\n        }\n\n        const formattedSeats = seats.map((s) => ({\n            seatNumber: s.seatNumber,\n            price: s.price,\n            details: { type: s.type, discount: s.discount || 0 },\n        }));\n        const totalPrice = formattedSeats.reduce(\n            (sum, s) => sum + (s.price - s.details.discount),\n            0,\n        );\n\n        const ticket = await Ticket.create({\n            userId,\n            showtimeId,\n            seats: formattedSeats,\n            totalPrice,\n            bookingTime: new Date(),\n        });\n\n        showtime.seats.forEach((s) => {\n            if (requestedSeatNumbers.includes(s.seatNumber)) {\n                s.status = \"booked\";\n            }\n        });\n        await showtime.save();\n\n        res.status(201).json({ message: \"Ticket created successfully\", ticket });\n    } catch (error) {\n        res.status(500).json({ message: error.message });\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { createTicket };",
          "explanation": "<p>The availability check and the reshape both hinge on a subtlety: input seats are flat (<code>{seatNumber, type, price, discount}</code>) but the ticket schema stores <code>{seatNumber, price, details:{type, discount}}</code> — the reshape happens once, right before <code>Ticket.create</code>, and <code>totalPrice</code> is computed from the ALREADY-reshaped seats (reading <code>s.details.discount</code>) so the default-0 discount logic only has to live in one place. The seat-availability loop checks BOTH \"seat doesn't exist on this showtime\" and \"seat exists but isn't available\" as the same 409 outcome, matching the paper's own wording (\"already booked <i>or invalid</i>\").</p>|||<p>Kiểm ghế còn trống và việc nắn dạng đều xoay quanh 1 điểm tinh tế: seats đầu vào PHẲNG (<code>{seatNumber, type, price, discount}</code>) nhưng schema ticket lưu <code>{seatNumber, price, details:{type, discount}}</code> — nắn dạng chỉ làm 1 lần, ngay trước <code>Ticket.create</code>, và <code>totalPrice</code> tính từ seats ĐÃ nắn dạng (đọc <code>s.details.discount</code>) nên logic mặc định discount=0 chỉ nằm ở đúng 1 chỗ. Vòng kiểm ghế còn trống coi CẢ \"ghế không tồn tại ở showtime này\" lẫn \"ghế tồn tại nhưng không available\" là cùng 1 kết quả 409, khớp đúng câu chữ đề (\"already booked <i>or invalid</i>\").</p>",
          "rubric": [
            {
              "id": "seats_input_validation",
              "criterion": "Correctly validates the seats array: non-empty, seatNumber string, type adult/child, positive price, non-negative optional discount defaulting to 0.|||Kiểm đúng mảng seats: không rỗng, seatNumber chuỗi, type adult/child, price dương, discount không âm tuỳ chọn mặc định 0.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "user_and_showtime_existence",
              "criterion": "Returns 404 when the user or the showtime does not exist.|||Trả 404 khi user hoặc showtime không tồn tại.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "seat_availability_conflict_check",
              "criterion": "Returns 409 when any requested seatNumber is missing from the showtime or is not available.|||Trả 409 khi seatNumber yêu cầu nào đó không có ở showtime hoặc không available.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "total_price_calculation",
              "criterion": "totalPrice correctly sums (price - discount) across all seats.|||totalPrice cộng đúng (price - discount) của mọi ghế.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "ticket_created_with_reshaped_seats",
              "criterion": "The created ticket stores seats reshaped to the schema's nested details.type/details.discount structure, not the flat request shape.|||Ticket tạo ra lưu seats đã nắn dạng theo cấu trúc lồng details.type/details.discount của schema, không phải dạng phẳng của request.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "showtime_seats_marked_booked",
              "criterion": "The showtime document is updated so the requested seats' status becomes \"booked\".|||Document showtime được cập nhật để status các ghế yêu cầu thành \"booked\".",
              "weight": 1,
              "maxScore": 0.4
            }
          ]
        }
      ]
    }
  ]
};
