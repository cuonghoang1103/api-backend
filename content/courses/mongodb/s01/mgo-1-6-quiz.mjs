/**
 * 1.6 — Kiểm tra Chương 1 (soạn 24/11/2026, agent mgo). 10 câu, mỗi câu dựa trên một output chạy thật của Bài 1.1–1.4.
 * Phân bố đáp án: A ×2 (3, 7) · B ×3 (1, 5, 9) · C ×3 (2, 6, 10) · D ×2 (4, 8).
 */
export default {
  title: '1.6 — Chapter 1 quiz|||1.6 — Kiểm tra Chương 1',
  slug: 'mgo-1-6-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười tình huống từ Chương 1: gõ sai tên collection, ObjectId để lộ thời gian, mảng chạm 16 MB, int với double, báo cáo theo ngày Việt Nam, validator và đơn mồ côi, đưa validator vào hệ thống đang chạy, bẫy additionalProperties, kill -9 và journal, bộ đệm trong container 2 GB.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Quiz</span>
<h2>Chapter 1 check: documents, types, validation, the engine</h2>
<p class="lead">Ten situations, each based on output you ran in Lessons 1.1–1.4. Read every explanation — most are ready-made interview answers.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can state the three <code>_id</code> rules and the 16 MiB limit, and say how a real document reaches it.</li>
<li>I know why CT Shop stores money as Decimal128 and why "orders on 14/10" gave 6 or 9.</li>
<li>I can introduce a validator to a live collection in four steps.</li>
<li>I can draw the path of a write: cache → journal → checkpoint → data files.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Kiểm tra</span>
<h2>Kiểm Chương 1: tài liệu, kiểu, kiểm hợp lệ, bộ máy lưu trữ</h2>
<p class="lead">Mười tình huống, mỗi câu dựa trên một output bạn đã chạy ở Bài 1.1–1.4. Đọc kỹ mọi lời giải thích — phần lớn là câu trả lời phỏng vấn dùng được ngay.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được ba luật của <code>_id</code> và giới hạn 16 MiB, và kể được một tài liệu thật chạm tới giới hạn đó như thế nào.</li>
<li>Tôi biết vì sao CT Shop lưu tiền bằng Decimal128 và vì sao "số đơn ngày 14/10" ra 6 hoặc 9.</li>
<li>Tôi đưa được validator vào một collection đang chạy theo bốn bước.</li>
<li>Tôi vẽ được đường đi của một lệnh ghi: bộ đệm → journal → checkpoint → tệp dữ liệu.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: 'The create-order handler calls db.collection("oders").insertOne(order) by mistake. What happens?|||Hàm tạo đơn lỡ gọi db.collection("oders").insertOne(order). Chuyện gì xảy ra?',
        options: [
          'MongoDB returns "collection does not exist"|||MongoDB báo "collection không tồn tại"',
          'The insert succeeds and silently creates a new collection named oders|||Lệnh chèn thành công và lặng lẽ tạo collection mới tên oders',
          'MongoDB auto-corrects to the closest name, orders|||MongoDB tự sửa thành tên gần nhất là orders',
          'The insert succeeds only if a validator exists on orders|||Lệnh chèn chỉ thành công nếu orders có validator',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Collections are created by the first write — you saw getCollectionNames() go from [] to [ "notes" ]. Defend with one constant per collection name, explicit createCollection with validators, and a startup check of collection names.|||VI: Collection được tạo bởi lần ghi đầu — bạn đã thấy getCollectionNames() đi từ [] thành [ "notes" ]. Phòng bằng một hằng số cho mỗi tên collection, tạo collection tường minh kèm validator, và kiểm danh sách tên collection lúc khởi động.',
      },
      {
        question: 'Your API exposes invoices at /invoices/<ObjectId>. Which statement is true?|||API của bạn để hoá đơn ở đường /invoices/<ObjectId>. Câu nào đúng?',
        options: [
          'ObjectIds are random, so the URL is as safe as a secret token|||ObjectId là ngẫu nhiên nên đường dẫn an toàn như một token bí mật',
          'ObjectIds contain the customer id, so they leak personal data|||ObjectId chứa mã khách hàng nên để lộ dữ liệu cá nhân',
          'Anyone can read the creation time from the first 4 bytes, and ids made close together share most bytes — never use them as secrets|||Ai cũng đọc được thời điểm tạo từ 4 byte đầu, và các id sinh gần nhau giống nhau phần lớn — không bao giờ dùng làm bí mật',
          'ObjectIds are encrypted by the server and cannot be decoded|||ObjectId được máy chủ mã hoá nên không giải mã được',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: 4-byte timestamp + 5-byte per-process random value + 3-byte counter. getTimestamp() decoded 69240c40 to 2025-11-24T07:41:52Z. Authorise every request; use random tokens for reset links.|||VI: 4 byte thời gian + 5 byte ngẫu nhiên theo tiến trình + 3 byte bộ đếm. getTimestamp() đã giải 69240c40 thành 07:41:52 UTC ngày 24/11/2025. Hãy kiểm quyền mọi request; dùng token ngẫu nhiên cho liên kết đặt lại mật khẩu.',
      },
      {
        question: 'A chat-room document embeds every message. After months, one popular room fails with "Resulting document after update is larger than 16777216". The right fix is…|||Một tài liệu phòng chat nhúng mọi tin nhắn. Sau vài tháng, một phòng đông người báo lỗi "Resulting document after update is larger than 16777216". Cách sửa đúng là…',
        options: [
          'Move messages to their own collection (one document per message or per bucket) referencing the room|||Tách tin nhắn ra collection riêng (mỗi tin hoặc mỗi nhóm tin một tài liệu) tham chiếu tới phòng',
          'Raise maxBsonObjectSize in the server configuration|||Tăng maxBsonObjectSize trong cấu hình máy chủ',
          'Compress the messages with zstd|||Nén tin nhắn bằng zstd',
          'Split the room into two documents with the same _id|||Tách phòng thành hai tài liệu cùng _id',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: 16 MiB is a hard limit (our $push failed on the 16th 1 MB entry). An unbounded array is a design error: bounded data embeds, unbounded data gets its own collection. Compression is on disk only; _id must be unique.|||VI: 16 MiB là giới hạn cứng (lệnh $push của ta thất bại ở mục 1 MB thứ 16). Mảng không giới hạn là lỗi thiết kế: dữ liệu có giới hạn thì nhúng, không giới hạn thì tách collection. Nén chỉ áp dụng trên đĩa; _id phải không trùng.',
      },
      {
        question: 'A Node.js admin form saves price: 150000 for one product and price: 149999.5 for another. What does MongoDB store?|||Một biểu mẫu quản trị Node.js lưu price: 150000 cho sản phẩm này và price: 149999.5 cho sản phẩm kia. MongoDB lưu gì?',
        options: [
          'Both as Decimal128, because MongoDB detects money|||Cả hai là Decimal128, vì MongoDB nhận ra đó là tiền',
          'Both as double, because JavaScript has only one number type|||Cả hai là double, vì JavaScript chỉ có một kiểu số',
          'Both as strings|||Cả hai là chuỗi',
          'The first as int, the second as double — one field, two types|||Cái đầu là int, cái sau là double — một trường, hai kiểu',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The JS driver stores whole numbers that fit 32 bits as int and everything else as double ($type showed int / double / double). Use Decimal128 for money and enforce bsonType: "decimal" in a validator.|||VI: Driver JS lưu số nguyên vừa 32 bit thành int, còn lại thành double ($type đã cho int / double / double). Dùng Decimal128 cho tiền và ép bsonType: "decimal" trong validator.',
      },
      {
        question: 'Accounting asks: "How many orders on 14 October?" Counting with UTC midnight boundaries gives 6; with +07:00 boundaries it gives 9. Which do you report?|||Kế toán hỏi: "Ngày 14/10 có bao nhiêu đơn?" Đếm với ranh giới nửa đêm UTC ra 6; với ranh giới +07:00 ra 9. Bạn báo số nào?',
        options: [
          '6 — the database stores UTC, so UTC is the truth|||6 — cơ sở dữ liệu lưu UTC nên UTC là sự thật',
          '9 — a Vietnamese business day runs from 00:00 to 24:00 Vietnam time; store UTC, convert at the query boundaries|||9 — ngày kinh doanh ở Việt Nam tính từ 00:00 tới 24:00 giờ Việt Nam; lưu UTC, đổi ở ranh giới truy vấn',
          'The average, 7.5|||Trung bình, 7,5',
          'Neither — MongoDB dates cannot be compared across time zones|||Không số nào — ngày giờ MongoDB không so được giữa các múi giờ',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: A BSON Date is an instant with no zone. Both counts are correct answers to different questions; the business question uses Vietnam days. In aggregation use timezone: "Asia/Ho_Chi_Minh".|||VI: Date BSON là một thời điểm không có múi giờ. Cả hai con số đều đúng cho hai câu hỏi khác nhau; câu hỏi nghiệp vụ dùng ngày Việt Nam. Trong aggregation dùng timezone: "Asia/Ho_Chi_Minh".',
      },
      {
        question: 'With the order validator enabled (customerId pattern ^KH[0-9]{4}$), why was order 9001 for customer KH9999 still in the collection and never flagged?|||Khi validator đơn hàng đã bật (customerId theo pattern ^KH[0-9]{4}$), vì sao đơn 9001 của khách KH9999 vẫn nằm trong collection và không bị đánh dấu?',
        options: [
          'Validators only run on updates, not inserts|||Validator chỉ chạy khi sửa, không chạy khi chèn',
          'The pattern is wrong; it should be ^KH\\d+$|||Pattern sai; phải là ^KH\\d+$',
          'A validator checks the shape of one document; KH9999 matches the pattern, and it cannot look into customers to check existence|||Validator kiểm hình dạng của một tài liệu; KH9999 khớp pattern, và nó không nhìn sang customers để kiểm sự tồn tại được',
          'moderate level skips all existing documents forever|||Mức moderate bỏ qua vĩnh viễn mọi tài liệu cũ',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: There are no foreign keys in MongoDB. Referential integrity is enforced by application code, transactions, or periodic orphan checks ($lookup + $match on empty arrays, Chapter 5).|||VI: MongoDB không có khoá ngoại. Toàn vẹn tham chiếu do mã ứng dụng, transaction, hoặc lượt dò bản ghi mồ côi định kỳ lo ($lookup + $match mảng rỗng, Chương 5).',
      },
      {
        question: 'You must add a strict validator to a 3-year-old production orders collection. The safest order of steps is…|||Bạn phải gắn validator chặt cho collection orders đã chạy ba năm. Thứ tự an toàn nhất là…',
        options: [
          'Measure violators with $nor → validationAction warn → fix writers and data → validationAction error (moderate level)|||Đo tài liệu phạm luật bằng $nor → validationAction warn → sửa nơi ghi và dữ liệu → validationAction error (mức moderate)',
          'validationAction error immediately, then fix whatever breaks|||Bật validationAction error ngay, rồi sửa chỗ nào vỡ',
          'Export all data, drop the collection, re-import with bypassDocumentValidation|||Xuất toàn bộ dữ liệu, xoá collection, nhập lại với bypassDocumentValidation',
          'Validate only in Mongoose; database validators are unsafe in production|||Chỉ kiểm trong Mongoose; validator ở cơ sở dữ liệu không an toàn khi chạy thật',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: warn mode logs "Document would fail validation" with the failing rule while writes still succeed — you find buggy writers without an outage. moderate keeps legacy invalid documents editable.|||VI: Chế độ warn ghi log "Document would fail validation" kèm luật bị phạm trong khi lệnh ghi vẫn thành công — bạn tìm ra nơi ghi lỗi mà không làm sập hệ thống. moderate giữ cho tài liệu cũ đang sai vẫn sửa được.',
      },
      {
        question: 'A schema with additionalProperties: false and properties: { name } rejects { name: "Áo thun" }. Why?|||Một schema có additionalProperties: false và properties: { name } từ chối { name: "Áo thun" }. Vì sao?',
        options: [
          'Vietnamese characters are not allowed by default|||Mặc định không cho phép ký tự tiếng Việt',
          'name must be listed in required as well|||name phải được liệt kê cả trong required',
          'additionalProperties only works with validationLevel moderate|||additionalProperties chỉ chạy với validationLevel moderate',
          'The driver added _id, which is not listed in properties|||Driver đã thêm _id, mà _id không có trong properties',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: errInfo listed additionalProperties: [ "_id" ]. Every strict schema must list _id. Use strict schemas for core collections where typos cost money.|||VI: errInfo liệt kê additionalProperties: [ "_id" ]. Schema chặt nào cũng phải liệt kê _id. Dùng schema chặt cho collection lõi nơi gõ sai là mất tiền.',
      },
      {
        question: 'Two orders are written with writeConcern { w: 1, j: true }, then the container receives SIGKILL and restarts. What do you see?|||Hai đơn được ghi với writeConcern { w: 1, j: true }, rồi container nhận SIGKILL và khởi động lại. Bạn thấy gì?',
        options: [
          'Both orders lost, because no checkpoint happened yet|||Mất cả hai đơn vì chưa có checkpoint nào',
          'An unclean startup ("Startup from clean shutdown?": false) and both orders present, recovered from the journal|||Khởi động không sạch ("Startup from clean shutdown?": false) và cả hai đơn vẫn còn, khôi phục từ journal',
          'The server refuses to start until you run a repair|||Máy chủ không chịu khởi động cho tới khi bạn chạy repair',
          'Only the first order, because the second was still in the cache|||Chỉ còn đơn đầu, vì đơn sau còn nằm trong bộ đệm',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: j: true acknowledges only after the journal entry is on disk. On restart WiredTiger loads the last checkpoint and replays the journal. Without j (standalone, w: 1) up to ~100 ms of acknowledged writes can be lost.|||VI: j: true chỉ xác nhận khi mục journal đã nằm trên đĩa. Khi khởi động lại, WiredTiger nạp checkpoint gần nhất rồi chạy lại journal. Không có j (máy đơn, w: 1) có thể mất tới khoảng 100 ms lệnh ghi đã xác nhận.',
      },
      {
        question: 'mongod 8.0 runs in a container started with --memory 2g and no cache option. How big is the WiredTiger cache?|||mongod 8.0 chạy trong container khởi động với --memory 2g và không có tuỳ chọn bộ đệm. Bộ đệm WiredTiger lớn bao nhiêu?',
        options: [
          '50% of the host RAM, because containers cannot hide memory|||50% RAM của máy thật, vì container không che được bộ nhớ',
          '2 GB — it uses the whole limit|||2 GB — dùng hết giới hạn',
          '512 MB — 50% of (2,048 − 1,024) MB, computed from the container limit|||512 MB — 50% của (2.048 − 1.024) MB, tính theo giới hạn container',
          '256 MB — the fixed default in containers|||256 MB — mặc định cố định trong container',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured: memLimitMB 2048 ⇒ 512 MB cache. Without a limit the lab saw 31,915 MB and reserved 15,445 MB. Limit memory when several services share a machine.|||VI: Đo thật: memLimitMB 2048 ⇒ bộ đệm 512 MB. Không giới hạn thì lab thấy 31.915 MB và giữ chỗ 15.445 MB. Hãy giới hạn bộ nhớ khi nhiều dịch vụ dùng chung máy.',
      },
    ],
  },
};
