/**
 * 8.6 — Kiểm tra Chương 8 (soạn 24/11/2026, agent mgo). 10 câu, mỗi câu dựa trên một output chạy thật của Bài 8.1–8.5.
 * Phân bố đáp án: A ×2 (4, 9) · B ×3 (1, 6, 10) · C ×3 (2, 5, 8) · D ×2 (3, 7).
 */
export default {
  title: '8.6 — Chapter 8 quiz|||8.6 — Kiểm tra Chương 8',
  slug: 'mgo-8-6-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười tình huống từ Chương 8: MongoClient mỗi request, pool to hơn mà không nhanh hơn, trần 409 kết nối, ObjectId dạng chuỗi trả null, updateOne lọt validator, strictQuery biến lỗi gõ thành khớp tất cả, transaction quên session, syncIndexes xoá index của DBA, @Transactional thiếu MongoTransactionManager, saveAll 20.000 lệnh so với một lệnh ghi lô.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Quiz</span>
<h2>Chapter 8 check: MongoDB from applications</h2>
<p class="lead">Ten situations, each based on output you ran in Lessons 8.1–8.5. Each is a bug that passes code review and the happy-path test, then shows up in production. Read every explanation, including for questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can say how many connections my application can open in total, and what the server allows.</li>
<li>I know which Mongoose operations validate and run middleware, and which do not.</li>
<li>Every transaction I write carries its session, and I know which stack retries transient errors for me.</li>
<li>I store money as Decimal128 and send it as a string, and I can prove it with $type.</li>
<li>I update many documents with one bulk command, not a loop of saves.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Kiểm tra</span>
<h2>Kiểm Chương 8: MongoDB từ ứng dụng</h2>
<p class="lead">Mười tình huống, mỗi câu dựa trên một output bạn đã chạy ở Bài 8.1–8.5. Câu nào cũng là một lỗi qua được review mã và bài test đường đẹp, rồi mới lộ ra ở production. Hãy đọc mọi lời giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi nói được ứng dụng của mình mở tối đa bao nhiêu kết nối, và máy chủ cho phép bao nhiêu.</li>
<li>Tôi biết thao tác Mongoose nào kiểm hợp lệ và chạy middleware, thao tác nào không.</li>
<li>Mọi transaction tôi viết đều mang session, và tôi biết nền tảng nào tự thử lại lỗi tạm thời giúp mình.</li>
<li>Tôi lưu tiền bằng Decimal128 và gửi đi dạng chuỗi, và chứng minh được bằng $type.</li>
<li>Tôi cập nhật nhiều tài liệu bằng một lệnh ghi lô, không bằng vòng save.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: 'An Express route does `const c = new MongoClient(URI)`, runs one findOne, then `await c.close()`. In the lab, 300 requests this way versus one shared client: what was measured?|||Một route Express làm `const c = new MongoClient(URI)`, chạy một findOne, rồi `await c.close()`. Trên lab, 300 request theo cách này so với một client dùng chung: đo được gì?',
        options: [
          'Same speed — the driver caches connections globally between clients|||Nhanh như nhau — driver giữ kết nối dùng chung toàn cục giữa các client',
          'About 600 new server connections and roughly 10× the latency; the shared client opened 2|||Khoảng 600 kết nối mới ở máy chủ và chậm cỡ 10 lần; client dùng chung mở 2',
          'Exactly 300 new connections, one per request, and no measurable slowdown on localhost|||Đúng 300 kết nối mới, mỗi request một, và trên localhost không chậm đáng kể',
          'The server refused the connections after 100 requests because of maxPoolSize|||Máy chủ từ chối kết nối sau 100 request vì maxPoolSize',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Each MongoClient opens a monitoring connection plus an application connection, so 300 short-lived clients created about 600 connections and were ~10× slower even on localhost without TLS or authentication. Create one client per process and import it everywhere.|||VI: Mỗi MongoClient mở một kết nối theo dõi cộng một kết nối ứng dụng, nên 300 client sống ngắn tạo khoảng 600 kết nối và chậm ~10 lần ngay trên localhost không TLS, không xác thực. Tạo một client mỗi tiến trình và import khắp nơi.',
      },
      {
        question: '50 concurrent queries of ~200 ms each. maxPoolSize 10 finished in about 1 s; maxPoolSize 50 also took about 1 s. What explains it?|||50 truy vấn đồng thời, mỗi truy vấn ~200 ms. maxPoolSize 10 xong trong khoảng 1 giây; maxPoolSize 50 cũng mất khoảng 1 giây. Điều gì giải thích chuyện này?',
        options: [
          'maxPoolSize above 10 is ignored by the Node driver|||Node driver bỏ qua maxPoolSize lớn hơn 10',
          'The driver opens at most 2 connections at a time (maxConnecting), so the pool never grew|||Driver chỉ mở tối đa 2 kết nối cùng lúc (maxConnecting), nên pool không bao giờ lớn lên',
          'The server admits only about a dozen operations into the storage engine at once (read tickets); the rest queued on the server|||Máy chủ chỉ cho khoảng một chục thao tác vào storage engine cùng lúc (vé đọc); số còn lại xếp hàng ở máy chủ',
          'waitQueueTimeoutMS cancelled 40 of the queries|||waitQueueTimeoutMS đã hủy 40 truy vấn',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: The pool did open 50 connections, but serverStatus().queues.execution.read showed ~10–14 read tickets and dozens of queries queued for one. Since 7.0 MongoDB adjusts tickets dynamically; a bigger pool moves the queue from the driver to the server. Fix slow queries before raising the pool.|||VI: Pool đúng là đã mở 50 kết nối, nhưng serverStatus().queues.execution.read cho thấy ~10–14 vé đọc và hàng chục truy vấn xếp hàng chờ vé. Từ 7.0 MongoDB tự điều chỉnh số vé; pool to hơn chỉ dời hàng đợi từ driver sang máy chủ. Sửa truy vấn chậm trước khi tăng pool.',
      },
      {
        question: 'Five API containers, each with the default pool, hit the lab server during a spike. Some users get MongoNetworkError "connection … closed" while the server is healthy. Why?|||Năm container API, mỗi cái dùng pool mặc định, dồn vào máy chủ lab trong một đợt tăng tải. Một số người dùng nhận MongoNetworkError "connection … closed" trong khi máy chủ vẫn khoẻ. Vì sao?',
        options: [
          'The default maxPoolSize is 5, too small for a spike|||maxPoolSize mặc định là 5, quá nhỏ cho đợt tăng tải',
          'Retryable writes were disabled|||Retryable writes đã bị tắt',
          'The server ran out of WiredTiger cache|||Máy chủ hết cache WiredTiger',
          '5 × 100 connections exceed the server limit of 409 — (1024 open files ÷ 2) × 0.8 — so new connections were refused|||5 × 100 kết nối vượt trần 409 của máy chủ — (1024 tệp mở ÷ 2) × 0,8 — nên kết nối mới bị từ chối',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: maxIncomingConnections defaults on Linux to (RLIMIT_NOFILE / 2) × 0.8; the container had 1,024 open files, so 409. The log showed "Connection refused because there are too many open connections". Budget instances × maxPoolSize (+ monitoring) below the limit.|||VI: maxIncomingConnections trên Linux mặc định là (RLIMIT_NOFILE / 2) × 0,8; container có 1.024 tệp mở, nên 409. Log ghi "Connection refused because there are too many open connections". Hãy tính số bản × maxPoolSize (+ theo dõi) dưới trần.',
      },
      {
        question: '`GET /binh-luan/:id` does `collection.findOne({ _id: req.params.id })` with the raw driver; the document exists. What happens?|||`GET /binh-luan/:id` làm `collection.findOne({ _id: req.params.id })` bằng driver thô; tài liệu có tồn tại. Chuyện gì xảy ra?',
        options: [
          'It returns null: a string never equals an ObjectId; convert with new ObjectId after validating|||Trả null: chuỗi không bao giờ bằng ObjectId; kiểm hợp lệ rồi đổi bằng new ObjectId',
          'The driver converts the string to an ObjectId automatically|||Driver tự đổi chuỗi thành ObjectId',
          'It throws BSONError for every request|||Ném BSONError với mọi request',
          'It returns the document but with _id as a string|||Trả tài liệu nhưng _id dạng chuỗi',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: The raw driver does not cast (Mongoose does). The lab printed null for the string and the document for new ObjectId(string). new ObjectId("khong-hop-le") throws, so validate with ObjectId.isValid and answer 400.|||VI: Driver thô không ép kiểu (Mongoose thì có). Lab in null với chuỗi và in tài liệu với new ObjectId(chuỗi). new ObjectId("khong-hop-le") ném lỗi, nên kiểm bằng ObjectId.isValid và trả 400.',
      },
      {
        question: 'A schema has `gia: { min: 0 }` and `loai: { enum: [...] }`. `SP.updateOne({ ma }, { gia: -5, loai: "mu" })` runs with default settings. Result?|||Schema có `gia: { min: 0 }` và `loai: { enum: [...] }`. `SP.updateOne({ ma }, { gia: -5, loai: "mu" })` chạy với thiết lập mặc định. Kết quả?',
        options: [
          'ValidationError: gia, loai|||ValidationError: gia, loai',
          'The update is cast but rejected by the pre(\'save\') hook|||Lệnh được ép kiểu nhưng bị hook pre(\'save\') từ chối',
          'Stored as is: update validators are off by default and save middleware does not run|||Được lưu nguyên: validator cập nhật mặc định tắt và middleware save không chạy',
          'Only gia is rejected; enum is not checked on updates|||Chỉ gia bị từ chối; enum không được kiểm khi cập nhật',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Measured on Mongoose 9.13: the database then held gia −5 and loai "mu", and the save-hook counter did not move. With runValidators: true the update failed with ValidationError. Enforce invariants on the server with $jsonSchema too.|||VI: Đo trên Mongoose 9.13: database khi đó chứa gia −5 và loai "mu", còn bộ đếm hook save không nhúc nhích. Có runValidators: true thì lệnh hỏng với ValidationError. Hãy bắt buộc bất biến cả ở máy chủ bằng $jsonSchema.',
      },
      {
        question: 'A developer types `{ loia: "ao" }` (typo of loai) in a Mongoose filter. Which setting turns this into "match every document"?|||Một lập trình viên gõ `{ loia: "ao" }` (nhầm loai) trong bộ lọc Mongoose. Thiết lập nào biến nó thành "khớp mọi tài liệu"?',
        options: [
          'strictQuery: false (the default since Mongoose 7)|||strictQuery: false (mặc định từ Mongoose 7)',
          'strictQuery: true — the unknown path is removed, the filter becomes {}|||strictQuery: true — đường dẫn lạ bị gỡ, bộ lọc thành {}',
          'strictQuery: "throw"|||strictQuery: "throw"',
          'strict: false|||strict: false',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: With strictQuery true the lab counted 2 (everything) instead of 0 — in deleteMany that deletes the collection. The default false sends the filter as written (matches nothing); "throw" raised StrictModeError and both products survived.|||VI: Với strictQuery true lab đếm ra 2 (tất cả) thay vì 0 — trong deleteMany là xoá sạch collection. Mặc định false gửi bộ lọc nguyên văn (không khớp gì); "throw" ném StrictModeError và cả hai sản phẩm còn nguyên.',
      },
      {
        question: 'Inside `mongoose.connection.transaction(async (session) => …)`, `Don.create([...])` is called without `{ session }`, then the stock update fails and the callback throws. What is in the database?|||Trong `mongoose.connection.transaction(async (session) => …)`, `Don.create([...])` được gọi không có `{ session }`, rồi lệnh trừ kho hỏng và callback ném lỗi. Database chứa gì?',
        options: [
          'Nothing changed — Mongoose attaches the session automatically by default|||Không gì thay đổi — Mongoose mặc định tự gắn session',
          'The whole transaction failed with "session required"|||Cả transaction hỏng với "session required"',
          'The stock was decremented but the order was rolled back|||Kho đã bị trừ nhưng đơn bị hoàn tác',
          'The order exists (it ran outside the transaction); the stock update was rolled back|||Đơn vẫn tồn tại (nó chạy ngoài transaction); lệnh trừ kho bị hoàn tác',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: The lab left order D2 in the database although the user was told "cancelled". Pass { session } to every call, or set mongoose.set("transactionAsyncLocalStorage", true) (Mongoose ≥ 8.4) — the third run was correct even with the session forgotten.|||VI: Lab để lại đơn D2 trong database dù người dùng được báo "đã hủy". Truyền { session } cho mọi lệnh, hoặc đặt mongoose.set("transactionAsyncLocalStorage", true) (Mongoose ≥ 8.4) — lượt thứ ba đúng dù vẫn quên session.',
      },
      {
        question: 'A startup script calls `Model.syncIndexes()` for every model. A DBA had added the index `dba_city_sdt` by hand. After the next deploy…|||Script khởi động gọi `Model.syncIndexes()` cho mọi model. Một DBA đã thêm tay index `dba_city_sdt`. Sau lần triển khai kế tiếp…',
        options: [
          'the index is kept because it was not created by Mongoose|||index được giữ vì không do Mongoose tạo',
          'the index is hidden but kept|||index bị ẩn nhưng vẫn giữ',
          'the index is dropped: syncIndexes removes every index not in the schema (except _id)|||index bị xoá: syncIndexes gỡ mọi index không có trong schema (trừ _id)',
          'the deploy fails with an index conflict|||lần triển khai hỏng vì xung đột index',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: diffIndexes() reported toDrop ["dba_city_sdt"] and syncIndexes() dropped it. Keep the schema as the single source of truth, turn autoIndex off in production, and manage indexes in a migration step; run diffIndexes in CI.|||VI: diffIndexes() báo toDrop ["dba_city_sdt"] và syncIndexes() đã xoá nó. Giữ schema làm nguồn sự thật duy nhất, tắt autoIndex ở production, quản lý index bằng bước di trú; chạy diffIndexes trong CI.',
      },
      {
        question: 'A Spring Boot 4 service has `@Transactional` on a method that inserts an order then throws when stock is short. No transaction-manager bean is declared. What happens?|||Một dịch vụ Spring Boot 4 có `@Transactional` trên phương thức chèn đơn rồi ném lỗi khi thiếu hàng. Không khai báo bean trình quản lý transaction nào. Chuyện gì xảy ra?',
        options: [
          'The order stays in MongoDB: without a MongoTransactionManager no transaction starts and each call auto-commits|||Đơn vẫn nằm trong MongoDB: thiếu MongoTransactionManager thì không transaction nào bắt đầu và mỗi lệnh tự commit',
          'Spring Boot auto-configures a MongoTransactionManager, so the order is rolled back|||Spring Boot tự cấu hình MongoTransactionManager, nên đơn bị hoàn tác',
          'The application fails to start|||Ứng dụng không khởi động được',
          'The insert waits until the method returns, so nothing is written|||Lệnh chèn chờ tới khi phương thức trả về, nên không gì được ghi',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Without the bean the lab left D1, D2, D3; with it, D1 and D3. No warning at startup. Keep a failure test that asserts the first write is absent after the second step fails. Also remember Spring does not retry TransientTransactionError (lab 8.5: 36 requests answered 500 without a retry loop).|||VI: Thiếu bean, lab còn D1, D2, D3; có bean, còn D1 và D3. Không cảnh báo lúc khởi động. Giữ một bài test thất bại khẳng định lần ghi đầu không còn sau khi bước hai hỏng. Nhớ thêm Spring không tự thử lại TransientTransactionError (lab 8.5: 36 request trả 500 khi không có vòng thử lại).',
      },
      {
        question: 'Changing the price of 20,000 existing products: `repo.saveAll(list)` took around two minutes, `bulkOps` with 20,000 updateOne about one second. What is the main cause?|||Đổi giá 20.000 sản phẩm đã có: `repo.saveAll(list)` mất cỡ hai phút, `bulkOps` với 20.000 updateOne khoảng một giây. Nguyên nhân chính là gì?',
        options: [
          'saveAll converts BigDecimal to strings, which is slow|||saveAll đổi BigDecimal thành chuỗi, việc này chậm',
          'saveAll sends one command per document, and each command waits for the write-concern acknowledgement (journal) — several ms each|||saveAll gửi một lệnh mỗi tài liệu, và lệnh nào cũng chờ xác nhận write concern (journal) — vài ms mỗi lệnh',
          'bulkOps skips writing to disk|||bulkOps bỏ qua việc ghi xuống đĩa',
          'saveAll runs inside a transaction that retries each document|||saveAll chạy trong transaction thử lại từng tài liệu',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The command listener counted 20,000 update commands versus 1. mongosh measured ~5–8 ms per command with w:majority (and the same with w:1, j:true) versus ~0.4 ms with w:1: the wait is per command, so batching pays it once. Do not lower the write concern to "fix" it.|||VI: Bộ đếm lệnh ghi được 20.000 lệnh update so với 1. mongosh đo ~5–8 ms mỗi lệnh với w:majority (và tương đương với w:1, j:true) so với ~0,4 ms với w:1: khoản chờ tính theo lệnh, gom lô thì chỉ trả một lần. Đừng hạ write concern để "chữa".',
      },
    ],
  },
};
