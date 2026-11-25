/**
 * 3.7 — Kiểm tra Chương 3 (soạn 24/11/2026, agent mgo). 10 câu, mỗi câu dựa trên một output chạy thật của Bài 3.1–3.5.
 * Phân bố đáp án: A ×2 (3, 7) · B ×3 (1, 5, 9) · C ×3 (4, 6, 8) · D ×2 (2, 10).
 */
export default {
  title: '3.7 — Chapter 3 quiz|||3.7 — Kiểm tra Chương 3',
  slug: 'mgo-3-7-quiz',
  type: 'QUIZ',
  isFreePreview: false,
  description: 'Mười tình huống từ Chương 3: tham chiếu giá hiện tại làm sai đơn cũ, chép email vào mọi đơn, một–nhiều với index, mảng hai chiều ghi dở, bộ lọc của lô di chuyển schema, truy vấn pattern attribute, điểm trung bình computed, bucket theo giờ, quá nhiều collection làm sập mongod, mảng bình luận chạm 16 MiB.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Quiz</span>
<h2>Chapter 3 check: embedding, relationships, patterns, anti-patterns</h2>
<p class="lead">Ten situations, each based on output you ran in Lessons 3.1–3.5. Read every explanation — they are the sentences a design review expects from you.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can write a workload table and justify each embed/reference decision with a query or a bound.</li>
<li>I can tell few / many / squillions apart and pick a shape and an index for each.</li>
<li>I can name the pattern behind every copied or computed field, with its refresh or reconciliation rule.</li>
<li>I can describe how each of the five anti-patterns fails in production.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Kiểm tra</span>
<h2>Kiểm Chương 3: nhúng, quan hệ, pattern, anti-pattern</h2>
<p class="lead">Mười tình huống, mỗi câu dựa trên một output bạn đã chạy ở Bài 3.1–3.5. Đọc kỹ mọi lời giải thích — đó là những câu mà một buổi review thiết kế chờ nghe từ bạn.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi viết được bảng tải công việc và giải thích mỗi quyết định nhúng/tham chiếu bằng một truy vấn hoặc một giới hạn.</li>
<li>Tôi phân biệt được vài / nhiều / vô số và chọn được hình dạng cùng index cho từng loại.</li>
<li>Tôi gọi được tên pattern đứng sau mỗi trường chép hay tính sẵn, kèm luật làm mới hoặc đối soát.</li>
<li>Tôi mô tả được mỗi anti-pattern trong năm cái hỏng thế nào trên production.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 720,
    questions: [
      {
        question: 'Order lines keep only productId; the order page looks up the current price in products. The price of SP002 goes up 20%. What happens to the 91 existing orders that contain SP002?|||Dòng đơn chỉ giữ productId; trang đơn tra giá hiện tại trong products. Giá SP002 tăng 20%. Chuyện gì xảy ra với 91 đơn có sẵn chứa SP002?',
        options: [
          'Nothing — MongoDB keeps the old price in the oplog|||Không sao — MongoDB giữ giá cũ trong oplog',
          'All 91 now show a total different from what the customer paid|||Cả 91 đơn giờ hiện tổng tiền khác với số khách đã trả',
          'Only orders placed after the change are affected|||Chỉ các đơn đặt sau khi đổi giá bị ảnh hưởng',
          'The update is rejected because orders reference the product|||Lệnh cập nhật bị từ chối vì có đơn tham chiếu sản phẩm',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The run showed soDon 91, lech 91. Price at purchase is a historical fact: it must be an embedded snapshot, never a reference to the current value. MongoDB has no foreign keys to block anything, and the oplog is for replication, not history.|||VI: Lần chạy cho soDon 91, lech 91. Giá lúc mua là một sự thật lịch sử: nó phải là ảnh chụp nhúng, không bao giờ là tham chiếu tới giá trị hiện tại. MongoDB không có khoá ngoại để chặn gì cả, còn oplog dùng cho nhân bản, không phải lịch sử.',
      },
      {
        question: 'To avoid a lookup, a developer copies the customer\'s e-mail into every order. KH0042 changes e-mail. What is the accurate description?|||Để khỏi phải tra, một lập trình viên chép email khách vào mọi đơn. KH0042 đổi email. Mô tả nào chính xác?',
        options: [
          'MongoDB updates the copies automatically|||MongoDB tự cập nhật các bản chép',
          'One updateMany is atomic across all 13 orders, so there is no risk|||Một lệnh updateMany là nguyên tử trên cả 13 đơn, nên không có rủi ro',
          'It is the recommended extended reference pattern|||Đó là pattern extended reference được khuyên dùng',
          'One logical change becomes 13 writes that can be left half-done; e-mail changes and is used by the mail job, so reference it instead|||Một thay đổi logic thành 13 lần ghi có thể bị bỏ dở; email hay đổi và do tác vụ gửi thư dùng, nên hãy tham chiếu',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: updateMany matched 13 orders (20 for KH0066). updateMany is atomic per document, not across documents, and the customer update is a separate write. Extended references are for fields read on the hot page and rarely changed (display name) — with a written refresh rule.|||VI: updateMany khớp 13 đơn (20 với KH0066). updateMany nguyên tử theo từng tài liệu, không phải trên cả nhóm, và lệnh cập nhật khách là một lần ghi riêng. Extended reference dành cho trường được đọc ở trang nóng và hiếm đổi (tên hiển thị) — kèm luật làm mới viết rõ.',
      },
      {
        question: 'SP002 has 1,591 reviews; the product page shows the 3 newest. Which design read exactly 3 documents?|||SP002 có 1.591 đánh giá; trang sản phẩm hiện 3 cái mới nhất. Thiết kế nào chỉ đọc đúng 3 tài liệu?',
        options: [
          'reviews collection with productId and an index { productId: 1, createdAt: -1 }|||collection reviews có productId và index { productId: 1, createdAt: -1 }',
          'reviewIds array in the product, then $in on reviews|||mảng reviewIds trong sản phẩm, rồi $in trên reviews',
          'All reviews embedded in the product|||Nhúng mọi đánh giá vào sản phẩm',
          'reviews collection with an index on createdAt only|||collection reviews chỉ có index trên createdAt',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: totalDocsExamined was 3 — the compound index already stores "this product, newest first". The reviewIds version scanned 2,766 keys and fetched 1,591 reviews; embedding all of them would make the product 103 KB. An index on createdAt alone would have to filter out other products.|||VI: totalDocsExamined là 3 — index ghép đã cất sẵn "sản phẩm này, mới nhất trước". Bản reviewIds quét 2.766 khoá và lấy 1.591 đánh giá; nhúng tất cả sẽ làm sản phẩm nặng 103 KB. Index chỉ trên createdAt sẽ phải lọc bỏ các sản phẩm khác.',
      },
      {
        question: 'A batch migration rewrites v1 customers with replaceOne({ _id, schemaVersion: { $ne: 2 } }, converted). Why is schemaVersion in the filter?|||Một lô di chuyển viết lại khách v1 bằng replaceOne({ _id, schemaVersion: { $ne: 2 } }, bảnĐãĐổi). Vì sao có schemaVersion trong bộ lọc?',
        options: [
          'It makes the batch faster by using an index|||Nó làm lô chạy nhanh hơn nhờ dùng index',
          'replaceOne requires at least two fields in the filter|||replaceOne bắt buộc bộ lọc có ít nhất hai trường',
          'If the application saved the customer as v2 after the batch read it, the filter no longer matches and newer data is not overwritten|||Nếu ứng dụng đã lưu khách thành v2 sau khi lô đọc nó, bộ lọc không còn khớp và dữ liệu mới hơn không bị ghi đè',
          'It converts v2 documents back to v1|||Nó đổi tài liệu v2 ngược về v1',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Same idea as the conditional updates of Lesson 2.5. In the run, KH0001 had been migrated lazily first; the batches fixed 199 and skipped it. Without the condition, a slow batch could overwrite a fresh edit with an older conversion.|||VI: Cùng ý tưởng với cập nhật có điều kiện ở Bài 2.5. Trong lần chạy, KH0001 đã được di chuyển lười trước; các lô sửa 199 và bỏ qua nó. Không có điều kiện, một lô chậm có thể ghi đè một lần sửa mới bằng bản chuyển đổi cũ hơn.',
      },
      {
        question: 'Students and classes keep arrays on both sides. The process adds L2 to SV1 and dies before adding SV1 to L2. What is true?|||Sinh viên và lớp giữ mảng ở cả hai bên. Tiến trình thêm L2 vào SV1 rồi chết trước khi thêm SV1 vào L2. Điều gì đúng?',
        options: [
          'MongoDB rolls back the first update automatically|||MongoDB tự rollback lệnh cập nhật đầu tiên',
          'SV1 lists L2 but L2 does not list SV1; you need a detection job, a transaction, or a link collection|||SV1 có L2 nhưng L2 không có SV1; bạn cần một tác vụ dò, một transaction, hoặc một collection nối',
          'The second update runs when the process restarts|||Lệnh cập nhật thứ hai sẽ chạy khi tiến trình khởi động lại',
          '$addToSet prevents the inconsistency|||$addToSet ngăn được sự lệch này',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: The detection aggregation returned [{ lop: "L2", sv: "SV1" }]. Two arrays are two copies of one fact. A one-sided array with a multikey index, a transaction (Chapter 6), or a dangKy link collection with a unique index removes the problem. $addToSet only prevents duplicates inside one array.|||VI: Aggregation dò lỗi trả về [{ lop: "L2", sv: "SV1" }]. Hai mảng là hai bản chép của một sự thật. Mảng một bên kèm index multikey, một transaction (Chương 6), hoặc collection nối dangKy có index duy nhất sẽ loại bỏ vấn đề. $addToSet chỉ chống trùng bên trong một mảng.',
      },
      {
        question: 'Attributes are stored as attrs: [{ k, v }] with an index on { "attrs.k": 1, "attrs.v": 1 }. Which query finds laptops with at least 16 GB of RAM correctly?|||Thuộc tính lưu dạng attrs: [{ k, v }] với index trên { "attrs.k": 1, "attrs.v": 1 }. Truy vấn nào tìm đúng laptop có RAM từ 16 GB?',
        options: [
          '{ "attrs.k": "ramGB", "attrs.v": { $gte: 16 } }|||{ "attrs.k": "ramGB", "attrs.v": { $gte: 16 } }',
          '{ attrs: { k: "ramGB", v: { $gte: 16 } } }|||{ attrs: { k: "ramGB", v: { $gte: 16 } } }',
          '{ attrs: { $elemMatch: { k: "ramGB", v: { $gte: 16 } } } }|||{ attrs: { $elemMatch: { k: "ramGB", v: { $gte: 16 } } } }',
          '{ ramGB: { $gte: 16 } }|||{ ramGB: { $gte: 16 } }',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Without $elemMatch, k and v may come from two different pairs (ssdGB 512 satisfies "v ≥ 16") — the two-element trap of Lesson 2.3. Option B is an exact embedded-document match with an operator inside, which matches nothing. The run returned 6 laptops with keys examined = 6, IXSCAN.|||VI: Không có $elemMatch, k và v có thể đến từ hai cặp khác nhau (ssdGB 512 thoả "v ≥ 16") — bẫy hai phần tử của Bài 2.3. Phương án B là so khớp nguyên tài liệu nhúng có toán tử bên trong, chẳng khớp gì. Lần chạy trả về 6 laptop với số khoá đã xét = 6, IXSCAN.',
      },
      {
        question: 'The product page shows the average rating. What is the robust way to keep it?|||Trang sản phẩm hiện điểm trung bình. Cách giữ nó vững chắc nhất là gì?',
        options: [
          'Store rating.tong and rating.n, $inc both when a review is added, divide when reading, reconcile nightly|||Lưu rating.tong và rating.n, $inc cả hai khi thêm đánh giá, chia lúc đọc, đối soát mỗi đêm',
          'Store the average and update it in Node: (avg × n + stars) / (n + 1)|||Lưu trung bình và cập nhật trong Node: (avg × n + stars) / (n + 1)',
          'Run an aggregation over all reviews on every page view|||Chạy aggregation trên mọi đánh giá ở mỗi lượt xem trang',
          'Embed all reviews and compute the average in the browser|||Nhúng mọi đánh giá và tính trung bình trên trình duyệt',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: $inc on sum and count is atomic and never drifts through rounding. Read-modify-write in Node loses updates under concurrency. Recomputing on read was several times slower in the run. The reconciliation caught the CSV import that bypassed the $inc (goc 1597 vs giuSan 1596).|||VI: $inc trên tổng và số lượng là nguyên tử và không trôi vì làm tròn. Đọc–sửa–ghi trong Node mất cập nhật khi có ghi đồng thời. Tính lại lúc đọc chậm hơn vài lần trong lần chạy. Phép đối soát đã bắt được lần nhập CSV lách $inc (goc 1597 so với giuSan 1596).',
      },
      {
        question: '100,800 sensor readings are stored as one document per sensor per hour with pre-computed n and tong. How many documents does the daily average for one sensor read?|||100.800 số đo cảm biến được lưu thành mỗi cảm biến mỗi giờ một tài liệu, có sẵn n và tong. Trung bình ngày của một cảm biến đọc bao nhiêu tài liệu?',
        options: [
          '1,440|||1.440',
          '1|||1',
          '24|||24',
          '60|||60',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: One document per hour ⇒ 24 per day; the per-reading collection read 1,440. Both gave 25.006. The bucket size follows the most common query; a time series collection (Chapter 10) does the bucketing and compression for you.|||VI: Mỗi giờ một tài liệu ⇒ 24 tài liệu mỗi ngày; collection mỗi số đo một tài liệu đọc 1.440. Cả hai cho 25.006. Cỡ bucket đi theo truy vấn hay gặp nhất; time series collection (Chương 10) tự gom và nén cho bạn.',
      },
      {
        question: 'A multi-tenant design creates one collection per customer on a mongod limited to 1,024 open files. What did the lab show after a few hundred collections?|||Một thiết kế nhiều khách thuê tạo mỗi khách một collection trên một mongod giới hạn 1.024 tệp mở. Lab cho thấy gì sau vài trăm collection?',
        options: [
          'createCollection returns a clear "too many collections" error and the server keeps running|||createCollection trả lỗi rõ ràng "quá nhiều collection" và máy chủ vẫn chạy',
          'mongod crashed: WiredTiger errno 24 (Too many open files), fatal assertion, container exit code 139|||mongod sập: WiredTiger errno 24 (Too many open files), fatal assertion, container thoát mã 139',
          'Nothing — collections are free in WiredTiger|||Không sao — collection không tốn gì trong WiredTiger',
          'MongoDB merges small collections automatically|||MongoDB tự gộp các collection nhỏ',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Each collection and each index is a WiredTiger file. When the file limit was hit, the storage error was fatal and every connected application lost the database. With nofile 64000, 3,000 collections cost 6,011 files and 12,020 data handles. Use one collection with tenantId leading the indexes, and set ulimit ≥ 64000.|||VI: Mỗi collection và mỗi index là một tệp WiredTiger. Khi chạm giới hạn tệp, lỗi lưu trữ là lỗi chết người và mọi ứng dụng đang nối đều mất cơ sở dữ liệu. Với nofile 64000, 3.000 collection tốn 6.011 tệp và 12.020 data handle. Hãy dùng một collection có tenantId đứng đầu các index, và đặt ulimit ≥ 64000.',
      },
      {
        question: 'A post document collects 4 KB comments with $push. What did the measurement show?|||Một tài liệu bài viết gom bình luận 4 KB bằng $push. Phép đo cho thấy gì?',
        options: [
          'Constant time per push until the disk is full|||Mỗi lượt push tốn thời gian như nhau cho tới khi đầy đĩa',
          'MongoDB splits the document automatically at 16 MB|||MongoDB tự tách tài liệu ở mốc 16 MB',
          'Old comments are dropped automatically to stay under the limit|||Bình luận cũ tự bị bỏ để giữ dưới giới hạn',
          'Pushes got slower as the document grew, and comment 4,166 failed with error 10334 (larger than 16777216)|||Lượt push chậm dần khi tài liệu lớn lên, và bình luận thứ 4.166 lỗi 10334 (lớn hơn 16777216)',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: WiredTiger writes a new version of the whole document on each update, so a 15 MB document costs ~15 MB per push. Nothing is split or dropped automatically — unless you ask for it with $slice (subset pattern). Comments belong in their own collection.|||VI: WiredTiger ghi một phiên bản mới của cả tài liệu ở mỗi lần cập nhật, nên tài liệu 15 MB tốn khoảng 15 MB mỗi lượt push. Không có gì tự tách hay tự bỏ — trừ khi bạn yêu cầu bằng $slice (pattern subset). Bình luận thuộc về collection riêng.',
      },
    ],
  },
};
