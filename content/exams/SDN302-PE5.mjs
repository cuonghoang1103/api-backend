export default {
  "course": {
    "courseCode": "SDN302"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "CODE",
      "code": "PE5",
      "title": "SDN302 – Practical Exam (Spring 2025, Block 5), Library Management API|||SDN302 – Thi thực hành (Spring 2025, Block 5), API quản lý thư viện",
      "description": "SDN302 PE (CODE): books-by-genre with nested populate, partial book update with FK validation, bcrypt+JWT register/login, and JWT-protected borrow/return flows with stock accounting, AI-graded.|||PE SDN302 (viết mã): sách theo genre có populate lồng, sửa sách từng phần kèm kiểm FK, đăng ký/đăng nhập bcrypt+JWT, và luồng mượn/trả sách bảo vệ JWT kèm tính tồn kho, chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": null,
      "attachmentName": null,
      "instructions": "<div class=\"ml-en\"><p><strong>SDN302 – Practical Exam (Spring 2025, Block 5) — Library Management</strong>. Build a RESTful API (ExpressJS + MongoDB + Mongoose) managing authors, books, genres, users, and borrow records. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given data shape (collections: authors, books, borrows, genres, users — database \"SDN302_SP25_B5\"):</b><pre><code class=\"language-javascript\">// author\n{ name: String, bio: String, birthDate: Date }\n// genre\n{ name: String }\n// book\n{ title: String, author: ObjectId /* ref author */, genres: [ObjectId] /* ref genre */, publishedYear: Number, availableCopies: Number }\n// user\n{ name: String, email: String, passwordHash: String, role: String }\n// borrow\n{ user: ObjectId /* ref user */, book: ObjectId /* ref book */, borrowDate: Date, dueDate: Date, returned: Boolean, returnDate: Date }</code></pre></div>|||<div class=\"pe-system\"><b>Hình dạng dữ liệu đề cho (bảng: authors, books, borrows, genres, users — database \"SDN302_SP25_B5\"):</b><pre><code class=\"language-javascript\">// author\n{ name: String, bio: String, birthDate: Date }\n// genre\n{ name: String }\n// book\n{ title: String, author: ObjectId /* ref author */, genres: [ObjectId] /* ref genre */, publishedYear: Number, availableCopies: Number }\n// user\n{ name: String, email: String, passwordHash: String, role: String }\n// borrow\n{ user: ObjectId /* ref user */, book: ObjectId /* ref book */, borrowDate: Date, dueDate: Date, returned: Boolean, returnDate: Date }</code></pre></div></div><div class=\"ml-vi\"><p><strong>SDN302 – Thi thực hành (Spring 2025, Block 5) — Quản lý thư viện</strong>. Xây RESTful API (ExpressJS + MongoDB + Mongoose) quản lý authors, books, genres, users, borrow. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given data shape (collections: authors, books, borrows, genres, users — database \"SDN302_SP25_B5\"):</b><pre><code class=\"language-javascript\">// author\n{ name: String, bio: String, birthDate: Date }\n// genre\n{ name: String }\n// book\n{ title: String, author: ObjectId /* ref author */, genres: [ObjectId] /* ref genre */, publishedYear: Number, availableCopies: Number }\n// user\n{ name: String, email: String, passwordHash: String, role: String }\n// borrow\n{ user: ObjectId /* ref user */, book: ObjectId /* ref book */, borrowDate: Date, dueDate: Date, returned: Boolean, returnDate: Date }</code></pre></div>|||<div class=\"pe-system\"><b>Hình dạng dữ liệu đề cho (bảng: authors, books, borrows, genres, users — database \"SDN302_SP25_B5\"):</b><pre><code class=\"language-javascript\">// author\n{ name: String, bio: String, birthDate: Date }\n// genre\n{ name: String }\n// book\n{ title: String, author: ObjectId /* ref author */, genres: [ObjectId] /* ref genre */, publishedYear: Number, availableCopies: Number }\n// user\n{ name: String, email: String, passwordHash: String, role: String }\n// borrow\n{ user: ObjectId /* ref user */, book: ObjectId /* ref book */, borrowDate: Date, dueDate: Date, returned: Boolean, returnDate: Date }</code></pre></div></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "CODE",
          "points": 1.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 1 (1.5 points) - Retrieve All Books by Genre Name.</strong> Return a list of books belonging to a specific genre, identified by name (query parameter). Endpoint: <code>GET /api/books/by-genre?name=&lt;genreName&gt;</code>. Use Mongoose <code>.populate()</code> to fetch full author and genre documents. Sort books by title in ascending order.</p><pre><code class=\"language-json\">// GET /api/books/by-genre?name=Software%20Engineering\n[\n  {\n    \"_id\": \"66211aaa12bcab1234567890\",\n    \"title\": \"Clean Code\",\n    \"publishedYear\": 2008,\n    \"availableCopies\": 3,\n    \"author\": { \"_id\": \"66211aaa12bcab1234567788\", \"name\": \"Robert C. Martin\", \"bio\": \"Known as Uncle Bob...\" },\n    \"genres\": [\n      { \"_id\": \"66211aaa12bcab1234567711\", \"name\": \"Software Engineering\" },\n      { \"_id\": \"66211aaa12bcab1234567722\", \"name\": \"Best Practices\" }\n    ]\n  }\n]</code></pre>|||<p><strong>Câu 1 (1.5 điểm) - Lấy sách theo tên Genre.</strong> Trả về danh sách sách thuộc 1 genre cụ thể, nhận diện qua tên (query parameter). Endpoint: <code>GET /api/books/by-genre?name=&lt;genreName&gt;</code>. Dùng Mongoose <code>.populate()</code> lấy đầy đủ author và genre. Sắp theo title tăng dần.</p><pre><code class=\"language-json\">// GET /api/books/by-genre?name=Software%20Engineering\n[\n  {\n    \"_id\": \"66211aaa12bcab1234567890\",\n    \"title\": \"Clean Code\",\n    \"publishedYear\": 2008,\n    \"availableCopies\": 3,\n    \"author\": { \"_id\": \"66211aaa12bcab1234567788\", \"name\": \"Robert C. Martin\", \"bio\": \"Known as Uncle Bob...\" },\n    \"genres\": [\n      { \"_id\": \"66211aaa12bcab1234567711\", \"name\": \"Software Engineering\" },\n      { \"_id\": \"66211aaa12bcab1234567722\", \"name\": \"Best Practices\" }\n    ]\n  }\n]</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst Book = db.book;\nconst Genre = db.genre;\n\nconst getBooksByGenre = async (req, res) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getBooksByGenre };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Book = db.book;\nconst Genre = db.genre;\n\nconst getBooksByGenre = async (req, res) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const genreName = req.query.name;\n\n        if (!genreName) {\n            return res.status(400).send({ message: \"Genre name is required\" });\n        }\n\n        const genre = await Genre.findOne({ name: genreName });\n        if (!genre) {\n            return res.status(404).send({ message: \"Genre not found\" });\n        }\n\n        const books = await Book.find({ genres: genre._id })\n            .populate(\"author\")\n            .populate(\"genres\")\n            .sort({ title: 1 })\n            .exec();\n\n        const formattedBooks = books.map((book) => ({\n            _id: book._id,\n            title: book.title,\n            publishedYear: book.publishedYear,\n            availableCopies: book.availableCopies,\n            author: {\n                _id: book.author._id,\n                name: book.author.name,\n                bio: book.author.bio,\n            },\n            genres: book.genres.map((g) => ({ _id: g._id, name: g.name })),\n        }));\n\n        res.status(200).json(formattedBooks);\n    } catch (error) {\n        res.status(500).send({ error: error.message });\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getBooksByGenre };",
          "explanation": "<p><code>Book.find({ genres: genre._id })</code> matches any book whose <code>genres</code> array contains that genre's ObjectId — Mongoose handles the array-contains semantics automatically for array-of-ObjectId fields. The formatted response deliberately reshapes the populated author down to just <code>_id</code>/<code>name</code>/<code>bio</code> — the Author model also has a <code>birthDate</code> field, but the paper's own example response never shows it, so it's intentionally left out rather than exposing the full populated document.</p>|||<p><code>Book.find({ genres: genre._id })</code> khớp bất kỳ sách nào có mảng <code>genres</code> chứa ObjectId genre đó — Mongoose tự xử lý ngữ nghĩa \"mảng chứa\" cho field mảng ObjectId. Response định dạng lại cố tình rút author đã populate chỉ còn <code>_id</code>/<code>name</code>/<code>bio</code> — model Author còn có field <code>birthDate</code>, nhưng ví dụ response của đề không bao giờ hiện nó, nên cố tình bỏ ra thay vì lộ cả document populate đầy đủ.</p>",
          "rubric": [
            {
              "id": "finds_genre_and_books",
              "criterion": "Correctly looks up the genre by name and finds all books referencing that genre's id.|||Tra đúng genre theo tên và tìm đúng mọi sách tham chiếu id genre đó.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "populate_author_and_genres",
              "criterion": "Both author and genres are populated into full/partial documents (not raw ObjectIds).|||Cả author và genres đều populate thành document đầy/rút gọn (không phải ObjectId thô).",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "sorted_by_title",
              "criterion": "Books are sorted by title in ascending order.|||Sách sắp theo title tăng dần.",
              "weight": 1,
              "maxScore": 0.3
            },
            {
              "id": "genre_not_found_handling",
              "criterion": "Returns an appropriate error when the genre name doesn't match any genre.|||Trả lỗi phù hợp khi tên genre không khớp genre nào.",
              "weight": 1,
              "maxScore": 0.2
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2,
          "language": "javascript",
          "prompt": "<p><strong>Question 2 (2 points) - Update a Book by ID.</strong> Update an existing book by its ID. The request may include updated title, author, genres, publishedYear, or availableCopies. Endpoint: <code>PUT /api/books/:id</code>. Validate that the book exists, and that any provided author/genre IDs exist in their collections. Update only the relevant fields, and return the updated book document.</p><pre><code class=\"language-json\">// Request\n{ \"title\": \"Refactoring (2nd Edition)\", \"author\": \"66211aaa12bcab1234567788\", \"genres\": [\"66211aaa12bcab1234567711\",\"66211aaa12bcab1234567722\"], \"publishedYear\": 2019, \"availableCopies\": 6 }\n// Response\n{ \"_id\": \"6621bbaabbccdd1234567890\", \"title\": \"Refactoring (2nd Edition)\", \"author\": \"66211aaa12bcab1234567788\", \"genres\": [\"66211aaa12bcab1234567711\",\"66211aaa12bcab1234567722\"], \"publishedYear\": 2019, \"availableCopies\": 6 }</code></pre>|||<p><strong>Câu 2 (2 điểm) - Sửa sách theo ID.</strong> Sửa sách theo ID. Request có thể gồm title, author, genres, publishedYear, hoặc availableCopies mới. Endpoint: <code>PUT /api/books/:id</code>. Kiểm sách tồn tại, và author/genre ID gửi lên (nếu có) tồn tại trong bảng của nó. Chỉ sửa field liên quan, trả về sách đã sửa.</p><pre><code class=\"language-json\">// Request\n{ \"title\": \"Refactoring (2nd Edition)\", \"author\": \"66211aaa12bcab1234567788\", \"genres\": [\"66211aaa12bcab1234567711\",\"66211aaa12bcab1234567722\"], \"publishedYear\": 2019, \"availableCopies\": 6 }\n// Response\n{ \"_id\": \"6621bbaabbccdd1234567890\", \"title\": \"Refactoring (2nd Edition)\", \"author\": \"66211aaa12bcab1234567788\", \"genres\": [\"66211aaa12bcab1234567711\",\"66211aaa12bcab1234567722\"], \"publishedYear\": 2019, \"availableCopies\": 6 }</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst Book = db.book;\nconst Author = db.author;\nconst Genre = db.genre;\n\nconst updateBook = async (req, res) => {\n    const { id } = req.params;\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { updateBook };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Book = db.book;\nconst Author = db.author;\nconst Genre = db.genre;\n\nconst updateBook = async (req, res) => {\n    const { id } = req.params;\n    // ---------- Student's code starts from here ----------\n    try {\n        const { title, author, genres, publishedYear, availableCopies } = req.body;\n\n        const existingBook = await Book.findById(id);\n        if (!existingBook) {\n            return res.status(404).json({ message: \"Book not found\" });\n        }\n\n        if (author) {\n            const existingAuthor = await Author.findById(author);\n            if (!existingAuthor) {\n                return res.status(404).json({ message: \"Author not found\" });\n            }\n        }\n\n        if (genres && genres.length > 0) {\n            for (const genreId of genres) {\n                const existingGenre = await Genre.findById(genreId);\n                if (!existingGenre) {\n                    return res.status(404).json({ message: `Genre with ID ${genreId} not found` });\n                }\n            }\n        }\n\n        const updateData = {};\n        if (title) updateData.title = title;\n        if (author) updateData.author = author;\n        if (genres) updateData.genres = genres;\n        if (publishedYear) updateData.publishedYear = publishedYear;\n        if (availableCopies !== undefined) updateData.availableCopies = availableCopies;\n\n        const updatedBook = await Book.findByIdAndUpdate(id, updateData, { new: true });\n\n        res.status(200).json({\n            _id: updatedBook._id,\n            title: updatedBook.title,\n            author: updatedBook.author,\n            genres: updatedBook.genres,\n            publishedYear: updatedBook.publishedYear,\n            availableCopies: updatedBook.availableCopies,\n        });\n    } catch (error) {\n        res.status(500).json({ message: error.message });\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { updateBook };",
          "explanation": "<p>Every field is validated/applied conditionally (<code>if (title) ...</code>, etc.) so an omitted field is never overwritten with <code>undefined</code> — a partial update, not a full replace. <code>availableCopies</code> uses an explicit <code>!== undefined</code> check (not a truthy check) since <code>0</code> is a valid copies count that a plain truthy check would incorrectly skip. The response returns <code>author</code>/<code>genres</code> as raw ids (no populate), matching the paper's own example response, which shows plain id strings rather than populated objects — unlike Question 1's response.</p>|||<p>Mỗi field kiểm/áp có điều kiện (<code>if (title) ...</code> v.v.) để field không gửi lên không bao giờ bị ghi đè thành <code>undefined</code> — sửa từng phần, không thay toàn bộ. <code>availableCopies</code> dùng kiểm <code>!== undefined</code> tường minh (không phải kiểm truthy) vì <code>0</code> là số lượng hợp lệ mà kiểm truthy thường sẽ bỏ sót nhầm. Response trả <code>author</code>/<code>genres</code> dạng id thô (không populate), khớp đúng ví dụ response của đề, hiện chuỗi id thường thay vì object đã populate — khác Câu 1.</p>",
          "rubric": [
            {
              "id": "book_existence_check",
              "criterion": "Validates the book with the given ID exists before updating, returning 404 if not.|||Kiểm sách theo ID tồn tại trước khi sửa, trả 404 nếu không.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "author_genre_existence_check",
              "criterion": "Validates any provided author and genre IDs actually exist in their collections before applying the update.|||Kiểm author và genre ID gửi lên thực sự tồn tại trong bảng của nó trước khi áp sửa.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "partial_update_only",
              "criterion": "Only updates fields actually present in the request body, leaving omitted fields unchanged (a 0 for availableCopies is correctly treated as a real value, not \"missing\").|||Chỉ sửa field thực sự có trong request, giữ nguyên field không gửi (0 cho availableCopies được coi đúng là giá trị thật, không phải \"thiếu\").",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "returns_updated_book",
              "criterion": "Returns the updated book document matching the paper's response shape.|||Trả về sách đã sửa khớp đúng hình dạng response của đề.",
              "weight": 1,
              "maxScore": 0.4
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2,
          "language": "javascript",
          "prompt": "<p><strong>Question 3 (2 points) - Register &amp; Login a New User.</strong> Provide user registration and login. Passwords must be hashed before storage, and JWT authentication is required.</p><p><b>Register:</b> <code>POST /api/users/register</code>. Validate email is unique. Hash password using bcrypt.</p><pre><code class=\"language-json\">// Request: { \"name\": \"Alice\", \"email\": \"alice@example.com\", \"password\": \"strongpass123\" }\n// Response: { \"_id\": \"6621ccddee00112233445566\", \"name\": \"Alice\", \"email\": \"alice@example.com\" }</code></pre><p><b>Login:</b> <code>POST /api/users/login</code>. Validate credentials. If successful, return a signed JWT token with <code>{ id: user._id }</code> as payload.</p><pre><code class=\"language-json\">// Request: { \"email\": \"alice@example.com\", \"password\": \"strongpass123\" }\n// Response: { \"token\": \"eyJhbGciOiJJIUzI1NiIsInR5cCI6...\" }</code></pre>|||<p><strong>Câu 3 (2 điểm) - Đăng ký &amp; Đăng nhập.</strong> Cung cấp đăng ký và đăng nhập. Mật khẩu phải băm trước khi lưu, bắt buộc xác thực JWT.</p><p><b>Đăng ký:</b> <code>POST /api/users/register</code>. Kiểm email duy nhất. Băm mật khẩu bằng bcrypt.</p><pre><code class=\"language-json\">// Request: { \"name\": \"Alice\", \"email\": \"alice@example.com\", \"password\": \"strongpass123\" }\n// Response: { \"_id\": \"6621ccddee00112233445566\", \"name\": \"Alice\", \"email\": \"alice@example.com\" }</code></pre><p><b>Đăng nhập:</b> <code>POST /api/users/login</code>. Kiểm thông tin đăng nhập. Thành công trả JWT với payload <code>{ id: user._id }</code>.</p><pre><code class=\"language-json\">// Request: { \"email\": \"alice@example.com\", \"password\": \"strongpass123\" }\n// Response: { \"token\": \"eyJhbGciOiJJIUzI1NiIsInR5cCI6...\" }</code></pre>",
          "starterCode": "const bcrypt = require(\"bcryptjs\");\nconst jwt = require(\"jsonwebtoken\");\nconst db = require(\"../models/index\");\nconst User = db.user;\n\nconst register = async (req, res) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nconst login = async (req, res) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { register, login };",
          "sampleSolution": "const bcrypt = require(\"bcryptjs\");\nconst jwt = require(\"jsonwebtoken\");\nconst db = require(\"../models/index\");\nconst User = db.user;\n\nconst register = async (req, res) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { name, email, password } = req.body;\n\n        if (!name || !email || !password) {\n            return res.status(400).json({ message: \"name, email, and password are required\" });\n        }\n\n        const existingUser = await User.findOne({ email });\n        if (existingUser) {\n            return res.status(400).json({ message: \"Email already in use\" });\n        }\n\n        const salt = await bcrypt.genSalt(10);\n        const passwordHash = await bcrypt.hash(password, salt);\n\n        const newUser = new User({ name, email, passwordHash, role: \"user\" });\n        const savedUser = await newUser.save();\n\n        res.status(201).json({\n            _id: savedUser._id,\n            name: savedUser.name,\n            email: savedUser.email,\n        });\n    } catch (error) {\n        res.status(500).json({ message: error.message });\n    }\n    // -------------------------------------------------------\n};\n\nconst login = async (req, res) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { email, password } = req.body;\n\n        const user = await User.findOne({ email });\n        if (!user) {\n            return res.status(401).json({ message: \"Invalid credentials\" });\n        }\n\n        const isMatch = await bcrypt.compare(password, user.passwordHash);\n        if (!isMatch) {\n            return res.status(401).json({ message: \"Invalid credentials\" });\n        }\n\n        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: \"1h\" });\n\n        res.status(200).json({ token });\n    } catch (error) {\n        res.status(500).json({ message: error.message });\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { register, login };",
          "explanation": "<p>The stored field is named <code>passwordHash</code> (matching the given <code>users.json</code> seed data's own field name), never the raw <code>password</code>. Login always returns the SAME \"Invalid credentials\" message whether the email doesn't exist or the password is wrong — never distinguishing the two — a standard security practice so an attacker can't use the error message to enumerate which emails are registered. The JWT payload is exactly <code>{ id: user._id }</code>, matching the paper's own explicit requirement (not <code>{ userId: ... }</code> or any other shape, which would break Question 4/5's middleware reading <code>req.user.id</code>).</p>|||<p>Field lưu tên <code>passwordHash</code> (khớp đúng tên field trong dữ liệu seed <code>users.json</code> đề cho), không bao giờ là <code>password</code> thô. Đăng nhập luôn trả ĐÚNG CÙNG thông điệp \"Invalid credentials\" dù email không tồn tại hay mật khẩu sai — không bao giờ phân biệt 2 trường hợp — thực hành bảo mật chuẩn để kẻ tấn công không dùng thông điệp lỗi dò email nào đã đăng ký. Payload JWT đúng <code>{ id: user._id }</code>, khớp đúng yêu cầu rõ của đề (không phải <code>{ userId: ... }</code> hay hình dạng khác, sẽ làm hỏng middleware Câu 4/5 đọc <code>req.user.id</code>).</p>",
          "rubric": [
            {
              "id": "register_unique_email_hashed",
              "criterion": "Register validates the email is unique and hashes the password with bcrypt before storing (never storing the raw password).|||Đăng ký kiểm email duy nhất và băm mật khẩu bằng bcrypt trước khi lưu (không bao giờ lưu mật khẩu thô).",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "login_validates_and_returns_jwt",
              "criterion": "Login validates credentials against the hashed password (bcrypt.compare) and returns a signed JWT with exactly { id: user._id } as payload on success.|||Đăng nhập kiểm đúng thông tin so mật khẩu đã băm (bcrypt.compare), trả JWT ký với đúng payload { id: user._id } khi thành công.",
              "weight": 1,
              "maxScore": 0.9
            },
            {
              "id": "response_shapes_correct",
              "criterion": "Register response excludes the password hash (only _id/name/email); login response is { token }.|||Response đăng ký không lộ password hash (chỉ _id/name/email); response đăng nhập là { token }.",
              "weight": 1,
              "maxScore": 0.4
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 4 (2.5 points) - Borrow a Book (Requires JWT).</strong> Build an authenticated API that allows a logged-in user to borrow a book. Endpoint: <code>POST /api/borrow/borrow</code>, header <code>Authorization: Bearer &lt;JWT_TOKEN&gt;</code>. Validate book availability (must have availableCopies &gt; 0); reduce availableCopies by 1; save a new borrow record (user, book, borrowDate, dueDate, returned: false).</p><pre><code class=\"language-json\">// Request: { \"bookId\": \"66211aaa12bcab1234567890\", \"dueDate\": \"2025-05-10\" }\n// Response:\n{\n  \"_id\": \"6621eeff66778899900aabbcc\",\n  \"user\": \"6621ccddee00112233445566\",\n  \"book\": \"66211aaa12bcab1234567890\",\n  \"borrowDate\": \"2025-04-23T00:00:00.000Z\",\n  \"dueDate\": \"2025-05-10T00:00:00.000Z\",\n  \"returned\": false\n}</code></pre>|||<p><strong>Câu 4 (2.5 điểm) - Mượn sách (cần JWT).</strong> Xây API xác thực cho phép người dùng đã đăng nhập mượn sách. Endpoint: <code>POST /api/borrow/borrow</code>, header <code>Authorization: Bearer &lt;JWT_TOKEN&gt;</code>. Kiểm sách còn (availableCopies &gt; 0); giảm availableCopies 1; lưu bản ghi mượn mới (user, book, borrowDate, dueDate, returned: false).</p><pre><code class=\"language-json\">// Request: { \"bookId\": \"66211aaa12bcab1234567890\", \"dueDate\": \"2025-05-10\" }\n// Response:\n{\n  \"_id\": \"6621eeff66778899900aabbcc\",\n  \"user\": \"6621ccddee00112233445566\",\n  \"book\": \"66211aaa12bcab1234567890\",\n  \"borrowDate\": \"2025-04-23T00:00:00.000Z\",\n  \"dueDate\": \"2025-05-10T00:00:00.000Z\",\n  \"returned\": false\n}</code></pre>",
          "starterCode": "const jwt = require(\"jsonwebtoken\");\nconst db = require(\"../models/index\");\nconst Book = db.book;\nconst Borrow = db.borrow;\n\nconst authenticateToken = (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nconst borrowBook = async (req, res) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { authenticateToken, borrowBook };",
          "sampleSolution": "const jwt = require(\"jsonwebtoken\");\nconst db = require(\"../models/index\");\nconst Book = db.book;\nconst Borrow = db.borrow;\n\nconst authenticateToken = (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    const authHeader = req.headers[\"authorization\"];\n    const token = authHeader && authHeader.split(\" \")[1];\n\n    if (!token) {\n        return res.status(401).json({ message: \"No token provided\" });\n    }\n\n    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {\n        if (err) {\n            return res.status(403).json({ message: \"Invalid or expired token\" });\n        }\n        req.user = decoded;\n        next();\n    });\n    // -------------------------------------------------------\n};\n\nconst borrowBook = async (req, res) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { bookId, dueDate } = req.body;\n        const userId = req.user.id;\n\n        if (!bookId || !dueDate) {\n            return res.status(400).json({ message: \"Book ID and due date are required\" });\n        }\n\n        const book = await Book.findById(bookId);\n        if (!book) {\n            return res.status(404).json({ message: \"Book not found\" });\n        }\n\n        if (book.availableCopies <= 0) {\n            return res.status(400).json({ message: \"No available copies of this book\" });\n        }\n\n        book.availableCopies -= 1;\n        await book.save();\n\n        const newBorrow = new Borrow({\n            user: userId,\n            book: bookId,\n            borrowDate: new Date(),\n            dueDate: new Date(dueDate),\n            returned: false,\n        });\n        const savedBorrow = await newBorrow.save();\n\n        res.status(201).json({\n            _id: savedBorrow._id,\n            user: savedBorrow.user,\n            book: savedBorrow.book,\n            borrowDate: savedBorrow.borrowDate,\n            dueDate: savedBorrow.dueDate,\n            returned: savedBorrow.returned,\n        });\n    } catch (error) {\n        res.status(500).json({ message: error.message });\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { authenticateToken, borrowBook };",
          "explanation": "<p><code>authenticateToken</code> reads the <code>Authorization: Bearer &lt;token&gt;</code> header exactly as required, splitting on the space and verifying with the same <code>JWT_SECRET</code> used to sign it in Question 3 — <code>req.user</code> is set to the decoded payload (<code>{id: ...}</code>), so <code>req.user.id</code> gives the logged-in user's id. Stock check (<code>availableCopies &lt;= 0</code>) happens BEFORE decrementing and saving, so a book with 0 copies is correctly rejected rather than going negative.</p>|||<p><code>authenticateToken</code> đọc đúng header <code>Authorization: Bearer &lt;token&gt;</code>, tách theo khoảng trắng và verify bằng đúng <code>JWT_SECRET</code> đã dùng ký ở Câu 3 — <code>req.user</code> gán payload đã giải mã (<code>{id: ...}</code>), nên <code>req.user.id</code> cho đúng id người dùng đã đăng nhập. Kiểm tồn kho (<code>availableCopies &lt;= 0</code>) xảy ra TRƯỚC khi trừ và lưu, để sách hết bản còn 0 bị từ chối đúng thay vì âm.</p>",
          "rubric": [
            {
              "id": "jwt_middleware_correct",
              "criterion": "Correctly validates the Bearer JWT token, rejecting requests with no token or an invalid/expired one, and making the decoded user id available to the route handler.|||Kiểm đúng JWT Bearer token, từ chối request không token hoặc token sai/hết hạn, cho route handler dùng được id người dùng đã giải mã.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "availability_check",
              "criterion": "Validates the book exists and has availableCopies > 0 before allowing the borrow.|||Kiểm sách tồn tại và availableCopies > 0 trước khi cho mượn.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "copies_decremented",
              "criterion": "Correctly decreases the book's availableCopies by exactly 1 upon a successful borrow.|||Giảm đúng availableCopies của sách đúng 1 khi mượn thành công.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "borrow_record_correct",
              "criterion": "Saves a new borrow record with the correct user, book, borrowDate, dueDate, and returned: false, matching the response shape.|||Lưu đúng bản ghi mượn mới với user, book, borrowDate, dueDate, returned: false, khớp hình dạng response.",
              "weight": 1,
              "maxScore": 0.6
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2,
          "language": "javascript",
          "prompt": "<p><strong>Question 5 (2 points) - Return a Book (Requires JWT).</strong> Allow users to return a book. The borrow record must be marked as returned and the book's availableCopies increased by 1. Endpoint: <code>POST /api/borrow/return/:id</code>, header <code>Authorization: Bearer &lt;JWT_TOKEN&gt;</code>. Verify the borrow record exists and belongs to the logged-in user. Update the borrow record with returned: true and returnDate: new Date(). Increase book.availableCopies by 1.</p><pre><code class=\"language-json\">// Response\n{ \"message\": \"Book returned successfully.\", \"returnDate\": \"2025-04-23T13:00:00.000Z\" }</code></pre>|||<p><strong>Câu 5 (2 điểm) - Trả sách (cần JWT).</strong> Cho phép người dùng trả sách. Bản ghi mượn phải đánh dấu đã trả và availableCopies sách tăng 1. Endpoint: <code>POST /api/borrow/return/:id</code>, header <code>Authorization: Bearer &lt;JWT_TOKEN&gt;</code>. Kiểm bản ghi mượn tồn tại và thuộc đúng người dùng đã đăng nhập. Sửa bản ghi mượn returned: true và returnDate: new Date(). Tăng book.availableCopies 1.</p><pre><code class=\"language-json\">// Response\n{ \"message\": \"Book returned successfully.\", \"returnDate\": \"2025-04-23T13:00:00.000Z\" }</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst Book = db.book;\nconst Borrow = db.borrow;\n\nconst returnBook = async (req, res) => {\n    const borrowId = req.params.id;\n    const userId = req.user.id;\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { returnBook };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Book = db.book;\nconst Borrow = db.borrow;\n\nconst returnBook = async (req, res) => {\n    const borrowId = req.params.id;\n    const userId = req.user.id;\n    // ---------- Student's code starts from here ----------\n    try {\n        const borrow = await Borrow.findById(borrowId);\n        if (!borrow) {\n            return res.status(404).json({ message: \"Borrow record not found\" });\n        }\n\n        if (borrow.user.toString() !== userId) {\n            return res.status(403).json({ message: \"Unauthorized - this borrow record does not belong to you\" });\n        }\n\n        if (borrow.returned) {\n            return res.status(400).json({ message: \"This book has already been returned\" });\n        }\n\n        const book = await Book.findById(borrow.book);\n        if (!book) {\n            return res.status(404).json({ message: \"Book not found\" });\n        }\n\n        book.availableCopies += 1;\n        await book.save();\n\n        const returnDate = new Date();\n        borrow.returned = true;\n        borrow.returnDate = returnDate;\n        await borrow.save();\n\n        res.status(200).json({ message: \"Book returned successfully.\", returnDate });\n    } catch (error) {\n        res.status(500).json({ message: error.message });\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { returnBook };",
          "explanation": "<p>Ownership is checked with <code>borrow.user.toString() !== userId</code> — <code>borrow.user</code> is a raw ObjectId (no populate here) and <code>userId</code> is the string id decoded from the JWT payload, so the conversion is necessary for the comparison to work correctly (comparing an ObjectId to a string directly with <code>!==</code> would always be true even for a match). A double-return is explicitly rejected (<code>if (borrow.returned)</code>) before touching stock, so returning the same book twice can never inflate <code>availableCopies</code> twice.</p>|||<p>Kiểm sở hữu bằng <code>borrow.user.toString() !== userId</code> — <code>borrow.user</code> là ObjectId thô (không populate ở đây) còn <code>userId</code> là id chuỗi giải mã từ payload JWT, nên cần chuyển đổi để so sánh đúng (so ObjectId với chuỗi trực tiếp bằng <code>!==</code> sẽ luôn đúng khác dù thực ra khớp). Trả 2 lần bị từ chối tường minh (<code>if (borrow.returned)</code>) trước khi đụng tồn kho, để trả cùng 1 sách 2 lần không bao giờ tăng <code>availableCopies</code> 2 lần.</p>",
          "rubric": [
            {
              "id": "borrow_existence_and_ownership",
              "criterion": "Verifies the borrow record exists and belongs to the logged-in user (correctly comparing the ObjectId to the JWT's string user id).|||Kiểm bản ghi mượn tồn tại và thuộc đúng người dùng đã đăng nhập (so đúng ObjectId với id chuỗi từ JWT).",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "already_returned_guard",
              "criterion": "Rejects an attempt to return a book that has already been returned, before touching stock.|||Từ chối cố gắng trả sách đã trả rồi, trước khi đụng tồn kho.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "stock_increased_correctly",
              "criterion": "Correctly increases the book's availableCopies by exactly 1.|||Tăng đúng availableCopies của sách đúng 1.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "borrow_record_updated",
              "criterion": "Correctly updates the borrow record with returned: true and a returnDate, and returns the correct response shape.|||Sửa đúng bản ghi mượn returned: true và returnDate, trả đúng hình dạng response.",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        }
      ]
    }
  ]
};
