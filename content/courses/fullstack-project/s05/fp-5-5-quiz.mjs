/**
 * 5.5 — Kiểm tra Chương 5 (soạn 24/11/2026, agent fsp). BÀI THÊM (không có trong khung), slug mới fp-5-5-quiz.
 * 10 câu; đáp án dựa trên output chạy thật của bài 5.1–5.4 (PostgreSQL 18.7, Prisma 7.10.1, Express 5.3.0, Zod 4.6.7).
 * Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '5.5 — Chapter 5 quiz|||5.5 — Kiểm tra Chương 5',
  slug: 'fp-5-5-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: đếm truy vấn N+1, vì sao _count của Prisma 7 chậm với 1 triệu bình luận, NFD và giới hạn độ dài, 409 với bài nháp của mình, OFFSET trôi trang, cursor mili giây vs micro giây, điều kiện OR không dùng chỉ mục, cursor có sẵn của Prisma khi bài bị xoá, lỗi 413 thành 500, và requestId làm vỡ phép kiểm chống dò email.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations taken from what actually happened while adding comments, pagination and one error shape to ChiaSe. Read every explanation, including for the questions you got right.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can show the number of SQL queries one request runs, and read the SQL itself.</li>
<li>I can explain why fewer queries is not automatically faster, with my own EXPLAIN output.</li>
<li>I can walk my feed page by page and prove nothing repeats or disappears — including ties.</li>
<li>I can name every place in my API that writes an error response (the answer should be one).</li>
<li>My Checkpoint 5 passes 23/23 on a clean clone.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống lấy từ chính những gì đã xảy ra khi thêm bình luận, phân trang và một hình dạng lỗi cho ChiaSe. Đọc mọi phần giải thích, kể cả câu bạn làm đúng.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi chỉ ra được một request chạy bao nhiêu câu SQL, và đọc được chính câu SQL đó.</li>
<li>Tôi giải thích được vì sao ít truy vấn chưa chắc đã nhanh, bằng output EXPLAIN của chính mình.</li>
<li>Tôi đi được feed từng trang và chứng minh không bài nào lặp hay biến mất — kể cả bài trùng giờ.</li>
<li>Tôi kể được mọi chỗ trong API viết phản hồi lỗi (câu trả lời nên là: một chỗ).</li>
<li>Checkpoint 5 của tôi đạt 23/23 trên bản clone sạch.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'The feed returns 20 posts. The first version added commentCount with prisma.comment.count({ where: { postId } }) for each post inside Promise.all. How many SQL statements did one GET /posts run?|||Feed trả 20 bài. Bản đầu thêm commentCount bằng prisma.comment.count({ where: { postId } }) cho từng bài trong Promise.all. Một lần GET /posts chạy bao nhiêu câu SQL?',
        options: [
          '2 — Promise.all merges them into one query|||2 — Promise.all gộp chúng thành một truy vấn',
          '22 — one for the posts, one for the authors, one COUNT per post|||22 — một lấy bài, một lấy tác giả, mỗi bài một câu COUNT',
          '20 — one per post|||20 — mỗi bài một câu',
          '1 — Prisma batches everything automatically|||1 — Prisma tự gom mọi thứ',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Measured with the query counter: "· 22 sql". Promise.all runs the queries concurrently, it does not merge them — it is still N+1, and the 20 counts compete for a pool of 10 connections.|||VI: Đo bằng bộ đếm truy vấn: "· 22 sql". Promise.all chạy các truy vấn đồng thời, không gộp chúng — vẫn là N+1, và 20 câu COUNT tranh nhau pool 10 kết nối.',
      },
      {
        question: 'Switching to Prisma\'s _count reduced the feed to 2 queries, yet with 1,000,087 comments the page took 65.2 ms (the N+1 version: 14.4 ms). Why?|||Chuyển sang _count của Prisma, feed còn 2 truy vấn, vậy mà với 1.000.087 bình luận trang mất 65,2 ms (bản N+1: 14,4 ms). Vì sao?',
        options: [
          'The comments table had no index|||Bảng comments không có chỉ mục',
          'Two queries cannot run in parallel|||Hai truy vấn không chạy song song được',
          'Its subquery counts comments GROUP BY post_id over the whole table, then joins the 20 posts — EXPLAIN shows a Parallel Seq Scan of all rows|||Truy vấn con của nó đếm GROUP BY post_id trên CẢ BẢNG rồi mới JOIN 20 bài — EXPLAIN cho thấy Parallel Seq Scan qua mọi dòng',
          'Prisma sends the 1M rows to Node and counts them in JavaScript|||Prisma kéo 1 triệu dòng về Node rồi đếm bằng JavaScript',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The generated SQL was LEFT JOIN (SELECT post_id, COUNT(*) FROM comments WHERE 1=1 GROUP BY post_id). Its cost grows with the whole table. Counting only the page\'s ids (groupBy … WHERE post_id IN (…)) took 6.8 ms. Fewer queries is not the goal; less work is.|||VI: SQL sinh ra là LEFT JOIN (SELECT post_id, COUNT(*) FROM comments WHERE 1=1 GROUP BY post_id). Chi phí tăng theo cả bảng. Chỉ đếm các id của trang (groupBy … WHERE post_id IN (…)) mất 6,8 ms. Mục tiêu không phải ít truy vấn, mà là ít việc.',
      },
      {
        question: 'A user types exactly 1000 letters "ệ" on a Mac and z.string().max(1000) refuses the comment. What is going on?|||Một người gõ đúng 1000 chữ "ệ" trên máy Mac và z.string().max(1000) từ chối bình luận. Chuyện gì xảy ra?',
        options: [
          'The text arrived in NFD: each "ệ" is 3 code points, 3000 in total — normalize to NFC before checking the length|||Chữ tới ở dạng NFD: mỗi "ệ" là 3 code point, tổng 3000 — chuẩn hoá NFC trước khi kiểm độ dài',
          'Zod counts bytes, and "ệ" is 3 bytes in UTF-8|||Zod đếm byte, mà "ệ" là 3 byte trong UTF-8',
          'PostgreSQL VARCHAR(1000) counts bytes|||VARCHAR(1000) của PostgreSQL đếm byte',
          'macOS adds an invisible character at the end|||macOS thêm một ký tự vô hình ở cuối',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Measured: NFC "ệ" = 1 code point, NFD = 3; 1000 NFD letters = 3000 code points and Zod says "Too big". With .transform(s => s.normalize("NFC")) before .max(1000), both forms are accepted and stored identically (1000 characters, 3000 bytes).|||VI: Đã đo: "ệ" NFC = 1 code point, NFD = 3; 1000 chữ NFD = 3000 code point và Zod báo "Too big". Thêm .transform(s => s.normalize("NFC")) trước .max(1000), cả hai dạng đều được nhận và lưu giống hệt (1000 ký tự, 3000 byte).',
      },
      {
        question: 'An tries to comment on An\'s own draft. Bình tries to comment on the same draft. What does ChiaSe answer?|||An bình luận vào bài nháp của chính An. Bình bình luận vào cùng bài nháp đó. ChiaSe trả gì?',
        options: [
          'Both 403|||Cả hai 403',
          'Both 404|||Cả hai 404',
          'An 201, Bình 404|||An 201, Bình 404',
          'An 409 BAI_CHUA_DANG, Bình 404|||An 409 BAI_CHUA_DANG, Bình 404',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: For Bình the draft does not exist (404 — never confirm someone else\'s private resource). An can see it, but commenting conflicts with its state, so 409. Comments are only allowed on published posts.|||VI: Với Bình, bài nháp "không tồn tại" (404 — không bao giờ xác nhận tài nguyên riêng của người khác). An thấy được bài, nhưng bình luận xung đột với trạng thái của nó, nên 409. Chỉ bài đã đăng mới bình luận được.',
      },
      {
        question: 'With LIMIT 3 OFFSET 0 you read page 1. Someone publishes a post. You read LIMIT 3 OFFSET 3. What do you see?|||Với LIMIT 3 OFFSET 0 bạn đọc trang 1. Có người đăng một bài. Bạn đọc LIMIT 3 OFFSET 3. Bạn thấy gì?',
        options: [
          'The new post at the top of page 2|||Bài mới ở đầu trang 2',
          'The last post of page 1 again — every row shifted down by one|||Lại bài cuối của trang 1 — mọi dòng bị đẩy xuống một nấc',
          'An error: the offset is no longer valid|||Lỗi: offset không còn hợp lệ',
          'Exactly the next three posts, OFFSET is stable|||Đúng ba bài tiếp theo, OFFSET ổn định',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Real output: page 1 ended with "Nhập lô 22", page 2 began with "Nhập lô 22". OFFSET counts from the top at query time. A cursor says "after this post", so inserts above it do not move it.|||VI: Output thật: trang 1 kết thúc bằng "Nhập lô 22", trang 2 bắt đầu bằng "Nhập lô 22". OFFSET đếm từ trên xuống tại thời điểm truy vấn. Cursor nói "sau bài này", nên bài chèn phía trên không làm nó xê dịch.',
      },
      {
        question: '25 posts were inserted by one INSERT, so they share created_at = 13:51:29.110369. Walking the feed with our first cursor (built from a JavaScript Date) lost 15 of them. Why?|||25 bài được chèn bằng một câu INSERT nên cùng created_at = 13:51:29.110369. Đi feed bằng cursor đầu tiên của ta (dựng từ Date của JavaScript) mất 15 bài. Vì sao?',
        options: [
          'Base64url cannot encode microseconds|||Base64url không mã hoá được micro giây',
          'The posts were drafts|||Các bài đó là nháp',
          'Date only keeps milliseconds (.110): the remaining rows at .110369 are neither < nor = the cursor time, so they fall into the gap; fix with timestamptz(3)|||Date chỉ giữ mili giây (.110): các dòng còn lại ở .110369 không nhỏ hơn, cũng không bằng mốc của cursor, nên rơi vào khe; sửa bằng timestamptz(3)',
          'id is a UUIDv7, so it cannot break ties|||id là UUIDv7 nên không phân xử được khi trùng',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Column precision must match what the client can represent. After altering the columns to timestamptz(3) (1.3 s for 1M rows, full table rewrite), walking with limits 7, 10 and 50 lost nothing.|||VI: Độ chính xác của cột phải khớp thứ client biểu diễn được. Sau khi đổi cột sang timestamptz(3) (1,3 giây cho 1 triệu dòng, viết lại cả bảng), đi feed với limit 7, 10 và 50 không mất bài nào.',
      },
      {
        question: 'EXPLAIN of the cursor query shows Index Cond: (status = published), Filter: (created_at < t OR (created_at = t AND id < x)), Rows Removed by Filter: 150000. What is the fix that Prisma can express?|||EXPLAIN của truy vấn cursor cho thấy Index Cond: (status = published), Filter: (created_at < t OR (created_at = t AND id < x)), Rows Removed by Filter: 150000. Cách sửa nào Prisma diễn tả được?',
        options: [
          'Add a redundant created_at <= t next to the OR, so the bound becomes an Index Cond|||Thêm điều kiện "thừa" created_at <= t cạnh cái OR, để biên trở thành Index Cond',
          'Replace the OR with OFFSET|||Thay OR bằng OFFSET',
          'Add a separate index on id|||Thêm một chỉ mục riêng cho id',
          'Increase limit so fewer pages are needed|||Tăng limit để cần ít trang hơn',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Measured: 2,909 buffers (same as OFFSET 150000) ⇒ 5 buffers, 0.086 ms; the API\'s deep page went from 25.2 ms to 6.3 ms. A real row comparison (created_at, id) < (t, x) also uses the index, but Prisma cannot generate it.|||VI: Đã đo: 2.909 buffer (bằng OFFSET 150000) ⇒ 5 buffer, 0,086 ms; trang sâu qua API từ 25,2 ms còn 6,3 ms. So sánh bộ thật (created_at, id) < (t, x) cũng dùng chỉ mục, nhưng Prisma không sinh được.',
      },
      {
        question: 'With Prisma\'s built-in pagination (cursor: { id }, skip: 1), the post used as the cursor is deleted before the user loads page 2. What happens?|||Với phân trang có sẵn của Prisma (cursor: { id }, skip: 1), bài làm cursor bị xoá trước khi người dùng tải trang 2. Chuyện gì xảy ra?',
        options: [
          'Prisma throws P2025|||Prisma ném P2025',
          'Page 2 starts again from the newest post|||Trang 2 bắt đầu lại từ bài mới nhất',
          'Page 2 is correct, Prisma remembers the position|||Trang 2 vẫn đúng, Prisma nhớ vị trí',
          'Page 2 is empty: Prisma looks the position up with sub-queries on that id, they return NULL, and the feed silently ends|||Trang 2 rỗng: Prisma tra lại vị trí bằng truy vấn con theo id đó, chúng trả NULL, feed lặng lẽ kết thúc',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: Real output: "trang 2 (cursor đã bị xoá): 0 bài []". ChiaSe\'s cursor carries (createdAt, id) itself, so deleting that post changes nothing. (Prisma\'s version, on the other hand, never had the millisecond bug.)|||VI: Output thật: "trang 2 (cursor đã bị xoá): 0 bài []". Cursor của ChiaSe tự mang (createdAt, id), nên xoá bài đó chẳng ảnh hưởng gì. (Ngược lại, bản của Prisma chưa bao giờ dính lỗi mili giây.)',
      },
      {
        question: 'Before lesson 5.3, sending a 200 KB JSON body returned 500 LOI_MAY_CHU with a PayloadTooLargeError stack in the log. Why 500?|||Trước bài 5.3, gửi body JSON 200 KB trả 500 LOI_MAY_CHU kèm stack PayloadTooLargeError trong log. Vì sao là 500?',
        options: [
          'Express has no limit, the server ran out of memory|||Express không có giới hạn, máy chủ hết bộ nhớ',
          'PostgreSQL refused the long text|||PostgreSQL từ chối đoạn chữ dài',
          'body-parser threw an error carrying status 413 and type entity.too.large, but errorHandler only knew HttpError and entity.parse.failed, so it fell to the 500 branch|||body-parser ném lỗi mang status 413 và type entity.too.large, nhưng errorHandler chỉ biết HttpError và entity.parse.failed, nên rơi xuống nhánh 500',
          'Zod limits bodies to 100 KB|||Zod giới hạn body 100 KB',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The audit found five client mistakes reported as 500 (413, two 415s, broken gzip, broken URL). Library errors with a 4xx status are now mapped to the error contract and logged as one warning line.|||VI: Lần soát tìm ra năm lỗi do client bị báo thành 500 (413, hai lỗi 415, gzip hỏng, URL hỏng). Lỗi thư viện mang status 4xx giờ được ánh xạ sang hợp đồng lỗi và ghi một dòng cảnh báo.',
      },
      {
        question: 'After adding requestId to every error, Checkpoint 3\'s check "wrong password and unknown email return identical bodies" failed. What is the right fix?|||Sau khi thêm requestId vào mọi lỗi, phép kiểm "sai mật khẩu và email không tồn tại trả thân giống hệt" của Checkpoint 3 trượt. Cách sửa đúng là gì?',
        options: [
          'Delete the check, it is outdated|||Xoá phép kiểm, nó lỗi thời rồi',
          'Compare everything except requestId — the property is "the answers reveal nothing about the account", and a random id reveals nothing|||So mọi thứ trừ requestId — tính chất cần giữ là "câu trả lời không lộ gì về tài khoản", mà một mã ngẫu nhiên thì không lộ gì',
          'Remove requestId from 401 responses only|||Chỉ bỏ requestId khỏi các phản hồi 401',
          'Return different codes so the frontend can tell the cases apart|||Trả code khác nhau để frontend phân biệt hai ca',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: Keep the security property, fix the comparison. Different answers for "exists" vs "does not exist" is exactly what let someone collect 5.4 million Twitter profiles (disclosed 05/08/2022).|||VI: Giữ tính chất bảo mật, sửa phép so. Trả lời khác nhau giữa "có" và "không có" chính là thứ cho phép ai đó gom 5,4 triệu hồ sơ Twitter (công bố 05/08/2022).',
      },
    ],
  },
};
