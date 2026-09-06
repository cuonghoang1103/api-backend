/**
 * build-sdn302-pe7.mjs — sinh content/exams/SDN302-PE7.mjs.
 *
 * Nguồn thật: "SDN302 - PE - SP 2025 - Đề số 2" — thư viện sách
 * (books/borrowrecords/categories/users). Cùng file .rar tên với đề
 * "Đề số 1" (PE6) nhưng khác thư mục con PaperNo_2 bên trong — đã giải
 * nén và xác nhận ĐÚNG khớp schema của CHÍNH đề này (books/
 * borrowrecords/categories/users), không lẫn với đề kia.
 *
 * ⚠️ Khác PE6: Câu 4 (tạo borrow record) trả về DOCUMENT THÔ vừa lưu
 * (books chỉ {bookId, quantity, _id}, KHÔNG enrich title/author như
 * PE6 làm cho products) — đã đọc đúng ví dụ response của CHÍNH đề này
 * (thứ tự field userId→books→_id→borrowDate→__v khớp serialize thô
 * của Mongoose, không phải response định dạng tay), nên không thêm
 * populate/enrich không được yêu cầu. Cũng không thêm logic trừ stock
 * khi mượn (đề này không yêu cầu, khác 1 số đề SDN302 khác) — tránh
 * đưa yêu cầu tự bịa vào.
 *
 * Điểm gốc: Q1=2, Q2=1.5, Q3=3, Q4=2.5, Q5=1 (tổng 10).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/SDN302-PE7.mjs --apply
 */
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve(import.meta.dirname, '../content/exams/SDN302-PE7.mjs');

const B = (en, vi) => `${en}|||${vi}`;
const ML = (en, vi) => `<div class="ml-en">${en}</div><div class="ml-vi">${vi}</div>`;

const schemaContext = B(
  `<div class="pe-system"><b>Given schema (collections: books, borrowrecords, categories, users — database "SDN302_SP25_B1"):</b>` +
  `<pre><code class="language-javascript">// book
{ title: String, author: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }
// borrowrecord
{ userId: ObjectId /* ref users */, books: [{ bookId: ObjectId, quantity: Number }], borrowDate: Date }
// category
{ name: String, description: String }
// user
{ name: String, email: String, password: String }</code></pre></div>`,
  `<div class="pe-system"><b>Schema đề cho (bảng: books, borrowrecords, categories, users — database "SDN302_SP25_B1"):</b>` +
  `<pre><code class="language-javascript">// book
{ title: String, author: String, price: Number, stock: Number, category: ObjectId /* ref categories */ }
// borrowrecord
{ userId: ObjectId /* ref users */, books: [{ bookId: ObjectId, quantity: Number }], borrowDate: Date }
// category
{ name: String, description: String }
// user
{ name: String, email: String, password: String }</code></pre></div>`,
);

const instructions = ML(
  `<p><strong>SDN302 – Practical Exam (Spring 2025, Paper 2) — Library API</strong>. Build a RESTful API (ExpressJS + MongoDB + Mongoose) for books, categories, users, and borrow records. This exam room has no live Node.js/MongoDB runtime, so answers are written as code and graded by an AI grader against the rubric shown per question. A score of 0 is given for not using a connection string from <code>.env</code>, or not serving the API at <code>http://localhost:9999</code>.</p>` + schemaContext,
  `<p><strong>SDN302 – Thi thực hành (Spring 2025, Paper 2) — API thư viện</strong>. Xây RESTful API (ExpressJS + MongoDB + Mongoose) cho books, categories, users, borrow records. Phòng thi này không có môi trường Node.js/MongoDB sống, nên câu trả lời viết dạng mã và được AI chấm theo tiêu chí ở từng câu. Điểm 0 nếu không dùng connection string từ <code>.env</code>, hoặc không phục vụ API tại <code>http://localhost:9999</code>.</p>` + schemaContext,
);

const q1 = {
  kind: 'CODE', points: 2, language: 'javascript',
  prompt: B(
    `<p><strong>Question 1 (2 points) - Retrieve All Books.</strong> Return a list of all books, including <code>_id, title, author, price, stock</code>, and <code>category</code> (Category info: _id, name, description). Endpoint: <code>GET /api/books</code>.</p>` +
    `<pre><code class="language-json">[
  {
    "_id": "67c01b1994c8ed0232b5a78e",
    "title": "Artificial Intelligence: A Guide for Thinking Humans",
    "author": "Melanie Mitchell",
    "price": 25.99,
    "stock": 10,
    "category": { "_id": "...", "name": "Artificial Intelligence", "description": "..." }
  }
]</code></pre>`,
    `<p><strong>Câu 1 (2 điểm) - Lấy tất cả sách.</strong> Trả về danh sách sách, gồm <code>_id, title, author, price, stock</code>, và <code>category</code> (thông tin danh mục: _id, name, description). Endpoint: <code>GET /api/books</code>.</p>` +
    `<pre><code class="language-json">[
  {
    "_id": "67c01b1994c8ed0232b5a78e",
    "title": "Artificial Intelligence: A Guide for Thinking Humans",
    "author": "Melanie Mitchell",
    "price": 25.99,
    "stock": 10,
    "category": { "_id": "...", "name": "Artificial Intelligence", "description": "..." }
  }
]</code></pre>`,
  ),
  starterCode:
`const db = require("../models/index");
const Book = db.book;

const getAllBooks = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getAllBooks };`,
  sampleSolution:
`const db = require("../models/index");
const Book = db.book;

const getAllBooks = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const books = await Book.find()
            .populate("category", "name description")
            .lean();

        res.json(books);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getAllBooks };`,
  explanation: B(
    `<p><code>author</code> is a plain string field on the Book schema itself (not a separate Author collection, unlike some other library exams in this course) — so it needs no populate, just passes through <code>find()</code> as-is. Only <code>category</code> is a reference needing <code>.populate()</code>.</p>`,
    `<p><code>author</code> là field chuỗi thường ngay trên schema Book (không phải bảng Author riêng, khác 1 số đề thư viện khác của môn này) — nên không cần populate, chỉ đi qua <code>find()</code> nguyên vẹn. Chỉ <code>category</code> là tham chiếu cần <code>.populate()</code>.</p>`,
  ),
  rubric: [
    { id: 'returns_all_books', criterion: B('Returns all books from the database.', 'Trả về tất cả sách trong database.'), weight: 1, maxScore: 0.6 },
    { id: 'category_populated', criterion: B('category is correctly populated into an object with _id, name, and description.', 'category populate đúng thành object có _id, name, description.'), weight: 1, maxScore: 0.9 },
    { id: 'field_shape_correct', criterion: B('Each book has exactly _id, title, author, price, stock, category, matching the paper\'s example (author left as a plain string, not populated).', 'Mỗi sách có đúng _id, title, author, price, stock, category, khớp ví dụ đề (author giữ nguyên chuỗi thường, không populate).'), weight: 1, maxScore: 0.5 },
  ],
};

const q2 = {
  kind: 'CODE', points: 1.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 2 (1.5 points) - Retrieve Borrow Records by User ID.</strong> Return all borrow records of a specific user based on userId. Endpoint: <code>GET /api/borrowRecords/user/:userId</code>. Output: each record's <code>_id, borrowDate</code>, and <code>books</code> (list of borrowed books: _id, title, author).</p>`,
    `<p><strong>Câu 2 (1.5 điểm) - Lấy bản ghi mượn theo User ID.</strong> Trả về mọi bản ghi mượn của 1 user theo userId. Endpoint: <code>GET /api/borrowRecords/user/:userId</code>. Output: mỗi bản ghi có <code>_id, borrowDate</code>, và <code>books</code> (danh sách sách đã mượn: _id, title, author).</p>`,
  ),
  starterCode:
`const db = require("../models/index");
const BorrowRecord = db.borrowrecord;

const getRecordsByUser = async (req, res, next) => {
    const { userId } = req.params;
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getRecordsByUser };`,
  sampleSolution:
`const db = require("../models/index");
const BorrowRecord = db.borrowrecord;

const getRecordsByUser = async (req, res, next) => {
    const { userId } = req.params;
    // ---------- Student's code starts from here ----------
    try {
        const records = await BorrowRecord.find({ userId })
            .populate("books.bookId", "title author")
            .lean();

        const formatted = records.map((record) => ({
            _id: record._id,
            borrowDate: record.borrowDate,
            books: record.books.map((b) => ({
                _id: b.bookId._id,
                title: b.bookId.title,
                author: b.bookId.author,
            })),
        }));

        res.json(formatted);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getRecordsByUser };`,
  explanation: B(
    `<p>This brief view deliberately drops <code>quantity</code> — the paper's own required output list for this endpoint is only <code>_id, title, author</code> per book, unlike Question 3's full-detail view which does include quantity.</p>`,
    `<p>View rút gọn này cố tình bỏ <code>quantity</code> — danh sách output yêu cầu của chính endpoint này chỉ có <code>_id, title, author</code> mỗi sách, khác view chi tiết đầy đủ ở Câu 3 có cả quantity.</p>`,
  ),
  rubric: [
    { id: 'finds_records_by_user', criterion: B('Correctly finds all borrow records belonging to the given userId.', 'Tìm đúng mọi bản ghi mượn thuộc userId đã cho.'), weight: 1, maxScore: 0.5 },
    { id: 'books_populated_brief', criterion: B('Each book is populated into brief info (_id, title, author), not a raw ObjectId, without extra fields like quantity.', 'Mỗi sách populate đúng rút gọn (_id, title, author), không phải ObjectId thô, không có field thừa như quantity.'), weight: 1, maxScore: 0.7 },
    { id: 'record_level_fields_correct', criterion: B('Each record has exactly _id, borrowDate, and books, matching the paper\'s requirement.', 'Mỗi bản ghi có đúng _id, borrowDate, và books, khớp yêu cầu đề.'), weight: 1, maxScore: 0.3 },
  ],
};

const q3 = {
  kind: 'CODE', points: 3, language: 'javascript',
  prompt: B(
    `<p><strong>Question 3 (3 points) - Retrieve Borrow Record Details with User and Book Information.</strong> Return detailed information of a borrow record by recordId, including full user and book information. Endpoint: <code>GET /api/borrowRecords/:recordId</code>. Output: <code>_id, borrowDate</code>; <code>user</code> (_id, name, email); <code>books</code> (_id, title, author, quantity).</p>` +
    `<pre><code class="language-json">// with recordId = "67c052dc8fe986d0086caa1f"
{
  "_id": "67c052dc8fe986d0086caa1f",
  "borrowDate": "2025-02-27T11:56:12.920Z",
  "user": { "_id": "67c011d38cc079c8f7c274ca", "name": "John Doe", "email": "john@example.com" },
  "books": [
    { "_id": "67c01b1994c8ed0232b5a78e", "title": "Artificial Intelligence: A Guide for Thinking Humans", "author": "Melanie Mitchell", "quantity": 1 },
    { "_id": "67c01d9e8fe986d0086caa11", "title": "Clean Code: A Handbook of Agile Software Craftsmanship", "author": "Robert C. Martin", "quantity": 2 }
  ]
}</code></pre>`,
    `<p><strong>Câu 3 (3 điểm) - Chi tiết bản ghi mượn đầy đủ user và sách.</strong> Trả về chi tiết bản ghi mượn theo recordId, gồm đầy đủ user và sách. Endpoint: <code>GET /api/borrowRecords/:recordId</code>. Output: <code>_id, borrowDate</code>; <code>user</code> (_id, name, email); <code>books</code> (_id, title, author, quantity).</p>` +
    `<pre><code class="language-json">// với recordId = "67c052dc8fe986d0086caa1f"
{
  "_id": "67c052dc8fe986d0086caa1f",
  "borrowDate": "2025-02-27T11:56:12.920Z",
  "user": { "_id": "67c011d38cc079c8f7c274ca", "name": "John Doe", "email": "john@example.com" },
  "books": [
    { "_id": "67c01b1994c8ed0232b5a78e", "title": "Artificial Intelligence: A Guide for Thinking Humans", "author": "Melanie Mitchell", "quantity": 1 },
    { "_id": "67c01d9e8fe986d0086caa11", "title": "Clean Code: A Handbook of Agile Software Craftsmanship", "author": "Robert C. Martin", "quantity": 2 }
  ]
}</code></pre>`,
  ),
  starterCode:
`const db = require("../models/index");
const BorrowRecord = db.borrowrecord;

const getRecordDetails = async (req, res, next) => {
    const { recordId } = req.params;
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { getRecordDetails };`,
  sampleSolution:
`const db = require("../models/index");
const BorrowRecord = db.borrowrecord;

const getRecordDetails = async (req, res, next) => {
    const { recordId } = req.params;
    // ---------- Student's code starts from here ----------
    try {
        const record = await BorrowRecord.findById(recordId)
            .populate("userId", "name email")
            .populate("books.bookId", "title author")
            .lean();

        if (!record) {
            return res.status(404).json({ error: "Borrow record not found" });
        }

        res.json({
            _id: record._id,
            borrowDate: record.borrowDate,
            user: {
                _id: record.userId._id,
                name: record.userId.name,
                email: record.userId.email,
            },
            books: record.books.map((b) => ({
                _id: b.bookId._id,
                title: b.bookId.title,
                author: b.bookId.author,
                quantity: b.quantity,
            })),
        });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { getRecordDetails };`,
  explanation: B(
    `<p>Both <code>userId</code> and <code>books.bookId</code> populate in one query. <code>quantity</code> is read from the record's own subdocument (<code>b.quantity</code>), not from the populated book (which has no quantity field of its own — quantity is per-borrow, not a book property).</p>`,
    `<p>Cả <code>userId</code> và <code>books.bookId</code> populate trong 1 truy vấn. <code>quantity</code> đọc từ subdocument của bản ghi (<code>b.quantity</code>), không phải từ sách đã populate (sách không có field quantity riêng — quantity thuộc về lần mượn, không phải thuộc tính của sách).</p>`,
  ),
  rubric: [
    { id: 'user_populated', criterion: B('userId is correctly populated into an object with at least _id, name, and email.', 'userId populate đúng thành object có ít nhất _id, name, email.'), weight: 1, maxScore: 0.8 },
    { id: 'books_populated_with_quantity', criterion: B('Each book is populated with _id, title, author, AND correctly keeps the record-specific quantity.', 'Mỗi sách populate đủ _id, title, author, VÀ giữ đúng quantity riêng của bản ghi.'), weight: 1, maxScore: 1 },
    { id: 'not_found_handling', criterion: B('Returns an appropriate 404 error when the recordId doesn\'t match any borrow record.', 'Trả đúng lỗi 404 khi recordId không khớp bản ghi nào.'), weight: 1, maxScore: 0.5 },
    { id: 'response_shape_correct', criterion: B('Full response shape matches the paper\'s example exactly.', 'Hình dạng response đầy đủ khớp đúng ví dụ đề.'), weight: 1, maxScore: 0.7 },
  ],
};

const q4 = {
  kind: 'CODE', points: 2.5, language: 'javascript',
  prompt: B(
    `<p><strong>Question 4 (2.5 points) - Create a New Borrow Record.</strong> Let a user borrow books. Endpoint: <code>POST /api/borrowRecords/create</code>. Input: JSON with <code>userId</code>, <code>books</code> (array of bookId and quantity). Output: the newly created borrow record.</p>` +
    `<pre><code class="language-json">// Request body
{
  "userId": "67c011d38cc079c8f7c274ca",
  "books": [
    { "bookId": "67c01db38fe986d0086caa15", "quantity": 2 },
    { "bookId": "67c01dba8fe986d0086caa17", "quantity": 2 }
  ]
}

// Response (201 Created) — the raw saved document, as-is
{
  "userId": "67c011d38cc079c8f7c274ca",
  "books": [
    { "bookId": "67c01db38fe986d0086caa15", "quantity": 2, "_id": "67c0558fe986d0086caa32" },
    { "bookId": "67c01dba8fe986d0086caa17", "quantity": 2, "_id": "67c0558dfe986d0086caa33" }
  ],
  "_id": "67c0558fe986d0086caa31",
  "borrowDate": "2025-02-27T12:07:41.499Z",
  "__v": 0
}</code></pre>` +
    `<p><i>Note: unlike some other exams in this course, this paper does not ask for the books array to be enriched with title/author in the response, nor does it ask for stock to be decremented — the response is the record exactly as saved.</i></p>`,
    `<p><strong>Câu 4 (2.5 điểm) - Tạo bản ghi mượn mới.</strong> Cho user mượn sách. Endpoint: <code>POST /api/borrowRecords/create</code>. Input: JSON gồm <code>userId</code>, <code>books</code> (mảng bookId và quantity). Output: bản ghi mượn vừa tạo.</p>` +
    `<pre><code class="language-json">// Request body
{
  "userId": "67c011d38cc079c8f7c274ca",
  "books": [
    { "bookId": "67c01db38fe986d0086caa15", "quantity": 2 },
    { "bookId": "67c01dba8fe986d0086caa17", "quantity": 2 }
  ]
}

// Response (201 Created) — nguyên document đã lưu
{
  "userId": "67c011d38cc079c8f7c274ca",
  "books": [
    { "bookId": "67c01db38fe986d0086caa15", "quantity": 2, "_id": "67c0558fe986d0086caa32" },
    { "bookId": "67c01dba8fe986d0086caa17", "quantity": 2, "_id": "67c0558dfe986d0086caa33" }
  ],
  "_id": "67c0558fe986d0086caa31",
  "borrowDate": "2025-02-27T12:07:41.499Z",
  "__v": 0
}</code></pre>` +
    `<p><i>Lưu ý: khác 1 số đề khác trong môn này, đề này không yêu cầu enrich books với title/author trong response, cũng không yêu cầu trừ tồn kho — response chính là bản ghi lưu nguyên.</i></p>`,
  ),
  starterCode:
`const db = require("../models/index");
const User = db.user;
const Book = db.book;
const BorrowRecord = db.borrowrecord;

const createBorrowRecord = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { createBorrowRecord };`,
  sampleSolution:
`const db = require("../models/index");
const User = db.user;
const Book = db.book;
const BorrowRecord = db.borrowrecord;

const createBorrowRecord = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { userId, books } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (!Array.isArray(books) || books.length === 0) {
            return res.status(400).json({ error: "Books are required" });
        }

        for (const { bookId } of books) {
            const book = await Book.findById(bookId);
            if (!book) {
                return res.status(404).json({ error: \`Book with ID \${bookId} not found\` });
            }
        }

        const record = await BorrowRecord.create({
            userId,
            books,
            borrowDate: new Date(),
        });

        res.status(201).json(record);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { createBorrowRecord };`,
  explanation: B(
    `<p>Deliberately does NOT populate or reshape the response, and does NOT decrement <code>book.stock</code> — this paper's own example response is literally the raw saved document (a plain Mongoose <code>.create()</code> result serialized as-is, evidenced by the trailing <code>__v: 0</code> and the field order matching Mongoose's own default), unlike some sibling exams in this course where the created order/record IS explicitly enriched or paired with stock changes. Validation is still performed (user exists, each book exists, books array non-empty) even though the paper's example only shows the success path, since a real API needs basic input validation regardless.</p>`,
    `<p>Cố tình KHÔNG populate hay định dạng lại response, và KHÔNG trừ <code>book.stock</code> — response mẫu của đúng đề này thực chất là document lưu thô (kết quả <code>.create()</code> Mongoose thường, thể hiện qua <code>__v: 0</code> ở cuối và thứ tự field khớp mặc định Mongoose), khác vài đề anh em trong môn này nơi đơn/bản ghi vừa tạo ĐƯỢC enrich hoặc đi kèm đổi tồn kho tường minh. Vẫn thực hiện validate (user tồn tại, mỗi sách tồn tại, mảng books không rỗng) dù ví dụ đề chỉ hiện luồng thành công, vì API thật vẫn cần validate input cơ bản.</p>`,
  ),
  rubric: [
    { id: 'validates_user_and_books', criterion: B('Validates that the userId and every bookId in the request actually exist before creating the record.', 'Kiểm userId và mọi bookId trong request thực sự tồn tại trước khi tạo bản ghi.'), weight: 1, maxScore: 0.8 },
    { id: 'record_saved_correctly', criterion: B('The new borrow record is correctly saved with userId, the books array ({bookId, quantity} per item), and borrowDate.', 'Bản ghi mượn mới lưu đúng userId, mảng books ({bookId, quantity} mỗi item), và borrowDate.'), weight: 1, maxScore: 0.9 },
    { id: 'no_unrequested_extras', criterion: B('Does not add enrichment (populate) or stock-decrement logic the paper does not ask for — the response is the record as saved.', 'Không thêm enrich (populate) hay logic trừ tồn kho mà đề không yêu cầu — response là bản ghi như đã lưu.'), weight: 1, maxScore: 0.4 },
    { id: 'response_status_correct', criterion: B('Returns 201 Created with the newly created borrow record.', 'Trả 201 Created với bản ghi mượn vừa tạo.'), weight: 1, maxScore: 0.4 },
  ],
};

const q5 = {
  kind: 'CODE', points: 1, language: 'javascript',
  prompt: B(
    `<p><strong>Question 5 (1 point) - Authentication with JWT.</strong> Support user login and protect certain endpoints using JWT authentication.</p>` +
    `<p><b>1. Login API:</b> <code>POST /api/users/login</code>. Input: JSON with email and password. Output: returns a JWT token if credentials are valid (payload={id: user._id}; JWT_SECRET read from .env; expiresIn: '1h').</p>` +
    `<pre><code class="language-json">// Request: { "email": "john@example.com", "password": "abcd123" }
// Response 200: { "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." }</code></pre>` +
    `<p><b>2. Protected API: Retrieve User Profile.</b> <code>GET /api/users/profile</code>, header <code>Authorization: Bearer &lt;token&gt;</code>. Returns user details if the token is valid.</p>` +
    `<pre><code class="language-json">// Response 200
{ "_id": "67c011d38cc079c8f7c274ca", "name": "John Doe", "email": "john@example.com", "address": "123 Main Street, New York, NY", "phone": "123-456-7890" }</code></pre>`,
    `<p><strong>Câu 5 (1 điểm) - Xác thực JWT.</strong> Hỗ trợ đăng nhập và bảo vệ 1 số endpoint bằng JWT.</p>` +
    `<p><b>1. API đăng nhập:</b> <code>POST /api/users/login</code>. Input: JSON email và password. Output: trả JWT nếu đúng thông tin (payload={id: user._id}; JWT_SECRET đọc từ .env; expiresIn: '1h').</p>` +
    `<pre><code class="language-json">// Request: { "email": "john@example.com", "password": "abcd123" }
// Response 200: { "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..." }</code></pre>` +
    `<p><b>2. API bảo vệ: Lấy hồ sơ user.</b> <code>GET /api/users/profile</code>, header <code>Authorization: Bearer &lt;token&gt;</code>. Trả chi tiết user nếu token hợp lệ.</p>` +
    `<pre><code class="language-json">// Response 200
{ "_id": "67c011d38cc079c8f7c274ca", "name": "John Doe", "email": "john@example.com", "address": "123 Main Street, New York, NY", "phone": "123-456-7890" }</code></pre>`,
  ),
  starterCode:
`const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const User = db.user;

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const authenticateToken = (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

const getProfile = async (req, res, next) => {
    // ---------- Student's code starts from here ----------

    // -------------------------------------------------------
};

module.exports = { login, authenticateToken, getProfile };`,
  sampleSolution:
`const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../models/index");
const User = db.user;

const login = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        // users.json stores 'password' already bcrypt-hashed — compare, never string-equal
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid credentials" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

const authenticateToken = (req, res, next) => {
    // ---------- Student's code starts from here ----------
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ error: "Invalid or expired token" });
        }
        req.user = decoded;
        next();
    });
    // -------------------------------------------------------
};

const getProfile = async (req, res, next) => {
    // ---------- Student's code starts from here ----------
    try {
        const user = await User.findById(req.user.id).select("-password").lean();
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        res.json(user);
    } catch (error) {
        next(error);
    }
    // -------------------------------------------------------
};

module.exports = { login, authenticateToken, getProfile };`,
  explanation: B(
    `<p>Same pattern as the sibling exam's Question 5: the seed data's <code>password</code> field is already bcrypt-hashed, so <code>bcrypt.compare()</code> is required; <code>.select("-password")</code> keeps the hash out of the profile response.</p>`,
    `<p>Cùng mẫu với Câu 5 của đề anh em: field <code>password</code> trong dữ liệu seed đã băm bcrypt sẵn, nên cần <code>bcrypt.compare()</code>; <code>.select("-password")</code> giữ hash không lộ ra response profile.</p>`,
  ),
  rubric: [
    { id: 'login_bcrypt_compare_and_jwt', criterion: B('Login validates credentials using bcrypt.compare and returns a valid JWT signed with the secret from .env, with payload {id: user._id}.', 'Đăng nhập kiểm đúng bằng bcrypt.compare, trả JWT hợp lệ ký bằng secret từ .env, payload {id: user._id}.'), weight: 1, maxScore: 0.5 },
    { id: 'middleware_protects_profile', criterion: B('The profile endpoint is protected by JWT middleware that correctly rejects missing/invalid tokens.', 'Endpoint profile được bảo vệ bởi middleware JWT từ chối đúng token thiếu/sai.'), weight: 1, maxScore: 0.3 },
    { id: 'profile_excludes_password', criterion: B('The profile response includes the user\'s details but never exposes the password/hash field.', 'Response profile có đủ chi tiết user nhưng không bao giờ lộ field password/hash.'), weight: 1, maxScore: 0.2 },
  ],
};

const spec = {
  course: { courseCode: 'SDN302' },
  exams: [{
    kind: 'PE',
    peType: 'CODE',
    code: 'PE7',
    title: 'SDN302 – Practical Exam (Spring 2025, Paper 2), Library Books/BorrowRecords API|||SDN302 – Thi thực hành (Spring 2025, Paper 2), API thư viện Books/BorrowRecords',
    description: 'SDN302 PE (CODE): books with category populate, two different borrow-record views (brief and full-detail), record creation returning the raw saved document, and JWT login/profile, AI-graded.|||PE SDN302 (viết mã): sách kèm populate category, 2 view bản ghi mượn khác nhau (rút gọn và chi tiết đầy đủ), tạo bản ghi trả nguyên document đã lưu, và đăng nhập/profile JWT, chấm AI.',
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
