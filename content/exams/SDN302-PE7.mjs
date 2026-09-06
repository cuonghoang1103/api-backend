export default {
  "course": {
    "courseCode": "SDN302"
  },
  "exams": [
    {
      "kind": "PE",
      "peType": "CODE",
      "code": "PE7",
      "title": "SDN302 – Practical Exam (Spring 2025, Paper 2), Library Books/BorrowRecords API|||SDN302 – Thi thực hành (Spring 2025, Paper 2), API thư viện Books/BorrowRecords",
      "description": "SDN302 PE (CODE): books with category populate, two different borrow-record views (brief and full-detail), record creation returning the raw saved document, and JWT login/profile, AI-graded.|||PE SDN302 (viết mã): sách kèm populate category, 2 view bản ghi mượn khác nhau (rút gọn và chi tiết đầy đủ), tạo bản ghi trả nguyên document đã lưu, và đăng nhập/profile JWT, chấm AI.",
      "durationMinutes": 90,
      "totalPoints": 10,
      "passMark": 5,
      "source": "FUOverflow",
      "attachmentUrl": null,
      "attachmentName": null,
      "instructions": "<div class=\"ml-en\"><p><strong>SDN302 – Practical Exam (Spring 2025, Paper 2) — Library API</strong>. Build a RESTful API (ExpressJS + MongoDB + Mongoose) for books, categories, users, and borrow records. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given schema (collections: books, borrowrecords, categories, users — database \"SDN302_SP25_B1\"):</b><pre><code class=\"language-javascript\">// book\n{ title: String, author: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }\n// borrowrecord\n{ userId: ObjectId /* ref users */, books: [{ bookId: ObjectId, quantity: Number }], borrowDate: Date }\n// category\n{ name: String, description: String }\n// user\n{ name: String, email: String, password: String }</code></pre></div>|||<div class=\"pe-system\"><b>Schema đề cho (bảng: books, borrowrecords, categories, users — database \"SDN302_SP25_B1\"):</b><pre><code class=\"language-javascript\">// book\n{ title: String, author: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }\n// borrowrecord\n{ userId: ObjectId /* ref users */, books: [{ bookId: ObjectId, quantity: Number }], borrowDate: Date }\n// category\n{ name: String, description: String }\n// user\n{ name: String, email: String, password: String }</code></pre></div></div><div class=\"ml-vi\"><p><strong>SDN302 – Thi thực hành (Spring 2025, Paper 2) — API thư viện</strong>. Xây RESTful API (ExpressJS + MongoDB + Mongoose) cho books, categories, users, borrow records. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p><div class=\"pe-system\"><b>Given schema (collections: books, borrowrecords, categories, users — database \"SDN302_SP25_B1\"):</b><pre><code class=\"language-javascript\">// book\n{ title: String, author: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }\n// borrowrecord\n{ userId: ObjectId /* ref users */, books: [{ bookId: ObjectId, quantity: Number }], borrowDate: Date }\n// category\n{ name: String, description: String }\n// user\n{ name: String, email: String, password: String }</code></pre></div>|||<div class=\"pe-system\"><b>Schema đề cho (bảng: books, borrowrecords, categories, users — database \"SDN302_SP25_B1\"):</b><pre><code class=\"language-javascript\">// book\n{ title: String, author: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }\n// borrowrecord\n{ userId: ObjectId /* ref users */, books: [{ bookId: ObjectId, quantity: Number }], borrowDate: Date }\n// category\n{ name: String, description: String }\n// user\n{ name: String, email: String, password: String }</code></pre></div></div>",
      "isPublished": true,
      "questions": [
        {
          "kind": "CODE",
          "points": 2,
          "language": "javascript",
          "prompt": "<p><strong>Question 1 (2 points) - Retrieve All Books.</strong> Return a list of all books, including <code>_id, title, author, price, stock</code>, and <code>category</code> (Category info: _id, name, description). Endpoint: <code>GET /api/books</code>.</p><pre><code class=\"language-json\">[\n  {\n    \"_id\": \"67c01b1994c8ed0232b5a78e\",\n    \"title\": \"Artificial Intelligence: A Guide for Thinking Humans\",\n    \"author\": \"Melanie Mitchell\",\n    \"price\": 25.99,\n    \"stock\": 10,\n    \"category\": { \"_id\": \"...\", \"name\": \"Artificial Intelligence\", \"description\": \"...\" }\n  }\n]</code></pre>|||<p><strong>Câu 1 (2 điểm) - Lấy tất cả sách.</strong> Trả về danh sách sách, gồm <code>_id, title, author, price, stock</code>, và <code>category</code> (thông tin danh mục: _id, name, description). Endpoint: <code>GET /api/books</code>.</p><pre><code class=\"language-json\">[\n  {\n    \"_id\": \"67c01b1994c8ed0232b5a78e\",\n    \"title\": \"Artificial Intelligence: A Guide for Thinking Humans\",\n    \"author\": \"Melanie Mitchell\",\n    \"price\": 25.99,\n    \"stock\": 10,\n    \"category\": { \"_id\": \"...\", \"name\": \"Artificial Intelligence\", \"description\": \"...\" }\n  }\n]</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst Book = db.book;\n\nconst getAllBooks = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getAllBooks };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst Book = db.book;\n\nconst getAllBooks = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const books = await Book.find()\n            .populate(\"category\", \"name description\")\n            .lean();\n\n        res.json(books);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getAllBooks };",
          "explanation": "<p><code>author</code> is a plain string field on the Book schema itself (not a separate Author collection, unlike some other library exams in this course) — so it needs no populate, just passes through <code>find()</code> as-is. Only <code>category</code> is a reference needing <code>.populate()</code>.</p>|||<p><code>author</code> là field chuỗi thường ngay trên schema Book (không phải bảng Author riêng, khác 1 số đề thư viện khác của môn này) — nên không cần populate, chỉ đi qua <code>find()</code> nguyên vẹn. Chỉ <code>category</code> là tham chiếu cần <code>.populate()</code>.</p>",
          "rubric": [
            {
              "id": "returns_all_books",
              "criterion": "Returns all books from the database.|||Trả về tất cả sách trong database.",
              "weight": 1,
              "maxScore": 0.6
            },
            {
              "id": "category_populated",
              "criterion": "category is correctly populated into an object with _id, name, and description.|||category populate đúng thành object có _id, name, description.",
              "weight": 1,
              "maxScore": 0.9
            },
            {
              "id": "field_shape_correct",
              "criterion": "Each book has exactly _id, title, author, price, stock, category, matching the paper's example (author left as a plain string, not populated).|||Mỗi sách có đúng _id, title, author, price, stock, category, khớp ví dụ đề (author giữ nguyên chuỗi thường, không populate).",
              "weight": 1,
              "maxScore": 0.5
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 2 (1.5 points) - Retrieve Borrow Records by User ID.</strong> Return all borrow records of a specific user based on userId. Endpoint: <code>GET /api/borrowRecords/user/:userId</code>. Output: each record's <code>_id, borrowDate</code>, and <code>books</code> (list of borrowed books: _id, title, author).</p>|||<p><strong>Câu 2 (1.5 điểm) - Lấy bản ghi mượn theo User ID.</strong> Trả về mọi bản ghi mượn của 1 user theo userId. Endpoint: <code>GET /api/borrowRecords/user/:userId</code>. Output: mỗi bản ghi có <code>_id, borrowDate</code>, và <code>books</code> (danh sách sách đã mượn: _id, title, author).</p>",
          "starterCode": "const db = require(\"../models/index\");\nconst BorrowRecord = db.borrowrecord;\n\nconst getRecordsByUser = async (req, res, next) => {\n    const { userId } = req.params;\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getRecordsByUser };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst BorrowRecord = db.borrowrecord;\n\nconst getRecordsByUser = async (req, res, next) => {\n    const { userId } = req.params;\n    // ---------- Student's code starts from here ----------\n    try {\n        const records = await BorrowRecord.find({ userId })\n            .populate(\"books.bookId\", \"title author\")\n            .lean();\n\n        const formatted = records.map((record) => ({\n            _id: record._id,\n            borrowDate: record.borrowDate,\n            books: record.books.map((b) => ({\n                _id: b.bookId._id,\n                title: b.bookId.title,\n                author: b.bookId.author,\n            })),\n        }));\n\n        res.json(formatted);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getRecordsByUser };",
          "explanation": "<p>This brief view deliberately drops <code>quantity</code> — the paper's own required output list for this endpoint is only <code>_id, title, author</code> per book, unlike Question 3's full-detail view which does include quantity.</p>|||<p>View rút gọn này cố tình bỏ <code>quantity</code> — danh sách output yêu cầu của chính endpoint này chỉ có <code>_id, title, author</code> mỗi sách, khác view chi tiết đầy đủ ở Câu 3 có cả quantity.</p>",
          "rubric": [
            {
              "id": "finds_records_by_user",
              "criterion": "Correctly finds all borrow records belonging to the given userId.|||Tìm đúng mọi bản ghi mượn thuộc userId đã cho.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "books_populated_brief",
              "criterion": "Each book is populated into brief info (_id, title, author), not a raw ObjectId, without extra fields like quantity.|||Mỗi sách populate đúng rút gọn (_id, title, author), không phải ObjectId thô, không có field thừa như quantity.",
              "weight": 1,
              "maxScore": 0.7
            },
            {
              "id": "record_level_fields_correct",
              "criterion": "Each record has exactly _id, borrowDate, and books, matching the paper's requirement.|||Mỗi bản ghi có đúng _id, borrowDate, và books, khớp yêu cầu đề.",
              "weight": 1,
              "maxScore": 0.3
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 3,
          "language": "javascript",
          "prompt": "<p><strong>Question 3 (3 points) - Retrieve Borrow Record Details with User and Book Information.</strong> Return detailed information of a borrow record by recordId, including full user and book information. Endpoint: <code>GET /api/borrowRecords/:recordId</code>. Output: <code>_id, borrowDate</code>; <code>user</code> (_id, name, email); <code>books</code> (_id, title, author, quantity).</p><pre><code class=\"language-json\">// with recordId = \"67c052dc8fe986d0086caa1f\"\n{\n  \"_id\": \"67c052dc8fe986d0086caa1f\",\n  \"borrowDate\": \"2025-02-27T11:56:12.920Z\",\n  \"user\": { \"_id\": \"67c011d38cc079c8f7c274ca\", \"name\": \"John Doe\", \"email\": \"john@example.com\" },\n  \"books\": [\n    { \"_id\": \"67c01b1994c8ed0232b5a78e\", \"title\": \"Artificial Intelligence: A Guide for Thinking Humans\", \"author\": \"Melanie Mitchell\", \"quantity\": 1 },\n    { \"_id\": \"67c01d9e8fe986d0086caa11\", \"title\": \"Clean Code: A Handbook of Agile Software Craftsmanship\", \"author\": \"Robert C. Martin\", \"quantity\": 2 }\n  ]\n}</code></pre>|||<p><strong>Câu 3 (3 điểm) - Chi tiết bản ghi mượn đầy đủ user và sách.</strong> Trả về chi tiết bản ghi mượn theo recordId, gồm đầy đủ user và sách. Endpoint: <code>GET /api/borrowRecords/:recordId</code>. Output: <code>_id, borrowDate</code>; <code>user</code> (_id, name, email); <code>books</code> (_id, title, author, quantity).</p><pre><code class=\"language-json\">// với recordId = \"67c052dc8fe986d0086caa1f\"\n{\n  \"_id\": \"67c052dc8fe986d0086caa1f\",\n  \"borrowDate\": \"2025-02-27T11:56:12.920Z\",\n  \"user\": { \"_id\": \"67c011d38cc079c8f7c274ca\", \"name\": \"John Doe\", \"email\": \"john@example.com\" },\n  \"books\": [\n    { \"_id\": \"67c01b1994c8ed0232b5a78e\", \"title\": \"Artificial Intelligence: A Guide for Thinking Humans\", \"author\": \"Melanie Mitchell\", \"quantity\": 1 },\n    { \"_id\": \"67c01d9e8fe986d0086caa11\", \"title\": \"Clean Code: A Handbook of Agile Software Craftsmanship\", \"author\": \"Robert C. Martin\", \"quantity\": 2 }\n  ]\n}</code></pre>",
          "starterCode": "const db = require(\"../models/index\");\nconst BorrowRecord = db.borrowrecord;\n\nconst getRecordDetails = async (req, res, next) => {\n    const { recordId } = req.params;\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getRecordDetails };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst BorrowRecord = db.borrowrecord;\n\nconst getRecordDetails = async (req, res, next) => {\n    const { recordId } = req.params;\n    // ---------- Student's code starts from here ----------\n    try {\n        const record = await BorrowRecord.findById(recordId)\n            .populate(\"userId\", \"name email\")\n            .populate(\"books.bookId\", \"title author\")\n            .lean();\n\n        if (!record) {\n            return res.status(404).json({ error: \"Borrow record not found\" });\n        }\n\n        res.json({\n            _id: record._id,\n            borrowDate: record.borrowDate,\n            user: {\n                _id: record.userId._id,\n                name: record.userId.name,\n                email: record.userId.email,\n            },\n            books: record.books.map((b) => ({\n                _id: b.bookId._id,\n                title: b.bookId.title,\n                author: b.bookId.author,\n                quantity: b.quantity,\n            })),\n        });\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { getRecordDetails };",
          "explanation": "<p>Both <code>userId</code> and <code>books.bookId</code> populate in one query. <code>quantity</code> is read from the record's own subdocument (<code>b.quantity</code>), not from the populated book (which has no quantity field of its own — quantity is per-borrow, not a book property).</p>|||<p>Cả <code>userId</code> và <code>books.bookId</code> populate trong 1 truy vấn. <code>quantity</code> đọc từ subdocument của bản ghi (<code>b.quantity</code>), không phải từ sách đã populate (sách không có field quantity riêng — quantity thuộc về lần mượn, không phải thuộc tính của sách).</p>",
          "rubric": [
            {
              "id": "user_populated",
              "criterion": "userId is correctly populated into an object with at least _id, name, and email.|||userId populate đúng thành object có ít nhất _id, name, email.",
              "weight": 1,
              "maxScore": 0.8
            },
            {
              "id": "books_populated_with_quantity",
              "criterion": "Each book is populated with _id, title, author, AND correctly keeps the record-specific quantity.|||Mỗi sách populate đủ _id, title, author, VÀ giữ đúng quantity riêng của bản ghi.",
              "weight": 1,
              "maxScore": 1
            },
            {
              "id": "not_found_handling",
              "criterion": "Returns an appropriate 404 error when the recordId doesn't match any borrow record.|||Trả đúng lỗi 404 khi recordId không khớp bản ghi nào.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "response_shape_correct",
              "criterion": "Full response shape matches the paper's example exactly.|||Hình dạng response đầy đủ khớp đúng ví dụ đề.",
              "weight": 1,
              "maxScore": 0.7
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 2.5,
          "language": "javascript",
          "prompt": "<p><strong>Question 4 (2.5 points) - Create a New Borrow Record.</strong> Let a user borrow books. Endpoint: <code>POST /api/borrowRecords/create</code>. Input: JSON with <code>userId</code>, <code>books</code> (array of bookId and quantity). Output: the newly created borrow record.</p><pre><code class=\"language-json\">// Request body\n{\n  \"userId\": \"67c011d38cc079c8f7c274ca\",\n  \"books\": [\n    { \"bookId\": \"67c01db38fe986d0086caa15\", \"quantity\": 2 },\n    { \"bookId\": \"67c01dba8fe986d0086caa17\", \"quantity\": 2 }\n  ]\n}\n\n// Response (201 Created) — the raw saved document, as-is\n{\n  \"userId\": \"67c011d38cc079c8f7c274ca\",\n  \"books\": [\n    { \"bookId\": \"67c01db38fe986d0086caa15\", \"quantity\": 2, \"_id\": \"67c0558fe986d0086caa32\" },\n    { \"bookId\": \"67c01dba8fe986d0086caa17\", \"quantity\": 2, \"_id\": \"67c0558dfe986d0086caa33\" }\n  ],\n  \"_id\": \"67c0558fe986d0086caa31\",\n  \"borrowDate\": \"2025-02-27T12:07:41.499Z\",\n  \"__v\": 0\n}</code></pre><p><i>Note: unlike some other exams in this course, this paper does not ask for the books array to be enriched with title/author in the response, nor does it ask for stock to be decremented — the response is the record exactly as saved.</i></p>|||<p><strong>Câu 4 (2.5 điểm) - Tạo bản ghi mượn mới.</strong> Cho user mượn sách. Endpoint: <code>POST /api/borrowRecords/create</code>. Input: JSON gồm <code>userId</code>, <code>books</code> (mảng bookId và quantity). Output: bản ghi mượn vừa tạo.</p><pre><code class=\"language-json\">// Request body\n{\n  \"userId\": \"67c011d38cc079c8f7c274ca\",\n  \"books\": [\n    { \"bookId\": \"67c01db38fe986d0086caa15\", \"quantity\": 2 },\n    { \"bookId\": \"67c01dba8fe986d0086caa17\", \"quantity\": 2 }\n  ]\n}\n\n// Response (201 Created) — nguyên document đã lưu\n{\n  \"userId\": \"67c011d38cc079c8f7c274ca\",\n  \"books\": [\n    { \"bookId\": \"67c01db38fe986d0086caa15\", \"quantity\": 2, \"_id\": \"67c0558fe986d0086caa32\" },\n    { \"bookId\": \"67c01dba8fe986d0086caa17\", \"quantity\": 2, \"_id\": \"67c0558dfe986d0086caa33\" }\n  ],\n  \"_id\": \"67c0558fe986d0086caa31\",\n  \"borrowDate\": \"2025-02-27T12:07:41.499Z\",\n  \"__v\": 0\n}</code></pre><p><i>Lưu ý: khác 1 số đề khác trong môn này, đề này không yêu cầu enrich books với title/author trong response, cũng không yêu cầu trừ tồn kho — response chính là bản ghi lưu nguyên.</i></p>",
          "starterCode": "const db = require(\"../models/index\");\nconst User = db.user;\nconst Book = db.book;\nconst BorrowRecord = db.borrowrecord;\n\nconst createBorrowRecord = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { createBorrowRecord };",
          "sampleSolution": "const db = require(\"../models/index\");\nconst User = db.user;\nconst Book = db.book;\nconst BorrowRecord = db.borrowrecord;\n\nconst createBorrowRecord = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { userId, books } = req.body;\n\n        const user = await User.findById(userId);\n        if (!user) {\n            return res.status(404).json({ error: \"User not found\" });\n        }\n\n        if (!Array.isArray(books) || books.length === 0) {\n            return res.status(400).json({ error: \"Books are required\" });\n        }\n\n        for (const { bookId } of books) {\n            const book = await Book.findById(bookId);\n            if (!book) {\n                return res.status(404).json({ error: `Book with ID ${bookId} not found` });\n            }\n        }\n\n        const record = await BorrowRecord.create({\n            userId,\n            books,\n            borrowDate: new Date(),\n        });\n\n        res.status(201).json(record);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { createBorrowRecord };",
          "explanation": "<p>Deliberately does NOT populate or reshape the response, and does NOT decrement <code>book.stock</code> — this paper's own example response is literally the raw saved document (a plain Mongoose <code>.create()</code> result serialized as-is, evidenced by the trailing <code>__v: 0</code> and the field order matching Mongoose's own default), unlike some sibling exams in this course where the created order/record IS explicitly enriched or paired with stock changes. Validation is still performed (user exists, each book exists, books array non-empty) even though the paper's example only shows the success path, since a real API needs basic input validation regardless.</p>|||<p>Cố tình KHÔNG populate hay định dạng lại response, và KHÔNG trừ <code>book.stock</code> — response mẫu của đúng đề này thực chất là document lưu thô (kết quả <code>.create()</code> Mongoose thường, thể hiện qua <code>__v: 0</code> ở cuối và thứ tự field khớp mặc định Mongoose), khác vài đề anh em trong môn này nơi đơn/bản ghi vừa tạo ĐƯỢC enrich hoặc đi kèm đổi tồn kho tường minh. Vẫn thực hiện validate (user tồn tại, mỗi sách tồn tại, mảng books không rỗng) dù ví dụ đề chỉ hiện luồng thành công, vì API thật vẫn cần validate input cơ bản.</p>",
          "rubric": [
            {
              "id": "validates_user_and_books",
              "criterion": "Validates that the userId and every bookId in the request actually exist before creating the record.|||Kiểm userId và mọi bookId trong request thực sự tồn tại trước khi tạo bản ghi.",
              "weight": 1,
              "maxScore": 0.8
            },
            {
              "id": "record_saved_correctly",
              "criterion": "The new borrow record is correctly saved with userId, the books array ({bookId, quantity} per item), and borrowDate.|||Bản ghi mượn mới lưu đúng userId, mảng books ({bookId, quantity} mỗi item), và borrowDate.",
              "weight": 1,
              "maxScore": 0.9
            },
            {
              "id": "no_unrequested_extras",
              "criterion": "Does not add enrichment (populate) or stock-decrement logic the paper does not ask for — the response is the record as saved.|||Không thêm enrich (populate) hay logic trừ tồn kho mà đề không yêu cầu — response là bản ghi như đã lưu.",
              "weight": 1,
              "maxScore": 0.4
            },
            {
              "id": "response_status_correct",
              "criterion": "Returns 201 Created with the newly created borrow record.|||Trả 201 Created với bản ghi mượn vừa tạo.",
              "weight": 1,
              "maxScore": 0.4
            }
          ]
        },
        {
          "kind": "CODE",
          "points": 1,
          "language": "javascript",
          "prompt": "<p><strong>Question 5 (1 point) - Authentication with JWT.</strong> Support user login and protect certain endpoints using JWT authentication.</p><p><b>1. Login API:</b> <code>POST /api/users/login</code>. Input: JSON with email and password. Output: returns a JWT token if credentials are valid (payload={id: user._id}; JWT_SECRET read from .env; expiresIn: '1h').</p><pre><code class=\"language-json\">// Request: { \"email\": \"john@example.com\", \"password\": \"abcd123\" }\n// Response 200: { \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...\" }</code></pre><p><b>2. Protected API: Retrieve User Profile.</b> <code>GET /api/users/profile</code>, header <code>Authorization: Bearer &lt;token&gt;</code>. Returns user details if the token is valid.</p><pre><code class=\"language-json\">// Response 200\n{ \"_id\": \"67c011d38cc079c8f7c274ca\", \"name\": \"John Doe\", \"email\": \"john@example.com\", \"address\": \"123 Main Street, New York, NY\", \"phone\": \"123-456-7890\" }</code></pre>|||<p><strong>Câu 5 (1 điểm) - Xác thực JWT.</strong> Hỗ trợ đăng nhập và bảo vệ 1 số endpoint bằng JWT.</p><p><b>1. API đăng nhập:</b> <code>POST /api/users/login</code>. Input: JSON email và password. Output: trả JWT nếu đúng thông tin (payload={id: user._id}; JWT_SECRET đọc từ .env; expiresIn: '1h').</p><pre><code class=\"language-json\">// Request: { \"email\": \"john@example.com\", \"password\": \"abcd123\" }\n// Response 200: { \"token\": \"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...\" }</code></pre><p><b>2. API bảo vệ: Lấy hồ sơ user.</b> <code>GET /api/users/profile</code>, header <code>Authorization: Bearer &lt;token&gt;</code>. Trả chi tiết user nếu token hợp lệ.</p><pre><code class=\"language-json\">// Response 200\n{ \"_id\": \"67c011d38cc079c8f7c274ca\", \"name\": \"John Doe\", \"email\": \"john@example.com\", \"address\": \"123 Main Street, New York, NY\", \"phone\": \"123-456-7890\" }</code></pre>",
          "starterCode": "const bcrypt = require(\"bcryptjs\");\nconst jwt = require(\"jsonwebtoken\");\nconst db = require(\"../models/index\");\nconst User = db.user;\n\nconst login = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nconst authenticateToken = (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nconst getProfile = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n\n    // -------------------------------------------------------\n};\n\nmodule.exports = { login, authenticateToken, getProfile };",
          "sampleSolution": "const bcrypt = require(\"bcryptjs\");\nconst jwt = require(\"jsonwebtoken\");\nconst db = require(\"../models/index\");\nconst User = db.user;\n\nconst login = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const { email, password } = req.body;\n\n        const user = await User.findOne({ email });\n        if (!user) {\n            return res.status(401).json({ error: \"Invalid credentials\" });\n        }\n\n        // users.json stores 'password' already bcrypt-hashed — compare, never string-equal\n        const isMatch = await bcrypt.compare(password, user.password);\n        if (!isMatch) {\n            return res.status(401).json({ error: \"Invalid credentials\" });\n        }\n\n        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: \"1h\" });\n        res.json({ token });\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nconst authenticateToken = (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    const authHeader = req.headers[\"authorization\"];\n    const token = authHeader && authHeader.split(\" \")[1];\n\n    if (!token) {\n        return res.status(401).json({ error: \"No token provided\" });\n    }\n\n    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {\n        if (err) {\n            return res.status(403).json({ error: \"Invalid or expired token\" });\n        }\n        req.user = decoded;\n        next();\n    });\n    // -------------------------------------------------------\n};\n\nconst getProfile = async (req, res, next) => {\n    // ---------- Student's code starts from here ----------\n    try {\n        const user = await User.findById(req.user.id).select(\"-password\").lean();\n        if (!user) {\n            return res.status(404).json({ error: \"User not found\" });\n        }\n        res.json(user);\n    } catch (error) {\n        next(error);\n    }\n    // -------------------------------------------------------\n};\n\nmodule.exports = { login, authenticateToken, getProfile };",
          "explanation": "<p>Same pattern as the sibling exam's Question 5: the seed data's <code>password</code> field is already bcrypt-hashed, so <code>bcrypt.compare()</code> is required; <code>.select(\"-password\")</code> keeps the hash out of the profile response.</p>|||<p>Cùng mẫu với Câu 5 của đề anh em: field <code>password</code> trong dữ liệu seed đã băm bcrypt sẵn, nên cần <code>bcrypt.compare()</code>; <code>.select(\"-password\")</code> giữ hash không lộ ra response profile.</p>",
          "rubric": [
            {
              "id": "login_bcrypt_compare_and_jwt",
              "criterion": "Login validates credentials using bcrypt.compare and returns a valid JWT signed with the secret from .env, with payload {id: user._id}.|||Đăng nhập kiểm đúng bằng bcrypt.compare, trả JWT hợp lệ ký bằng secret từ .env, payload {id: user._id}.",
              "weight": 1,
              "maxScore": 0.5
            },
            {
              "id": "middleware_protects_profile",
              "criterion": "The profile endpoint is protected by JWT middleware that correctly rejects missing/invalid tokens.|||Endpoint profile được bảo vệ bởi middleware JWT từ chối đúng token thiếu/sai.",
              "weight": 1,
              "maxScore": 0.3
            },
            {
              "id": "profile_excludes_password",
              "criterion": "The profile response includes the user's details but never exposes the password/hash field.|||Response profile có đủ chi tiết user nhưng không bao giờ lộ field password/hash.",
              "weight": 1,
              "maxScore": 0.2
            }
          ]
        }
      ]
    }
  ]
};
