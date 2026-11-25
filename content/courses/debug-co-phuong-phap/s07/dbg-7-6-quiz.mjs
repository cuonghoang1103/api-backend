/**
 * 7.6 — Kiểm tra Chương 7 (soạn 24/11/2026). 10 câu; đáp án dựa trên output chạy thật của bài 7.1–7.5
 * (PostgreSQL 16.16, Prisma 6.19.3, Hibernate 7.4.5). Phân bố đáp án: A2 B3 C3 D2.
 */
export default {
  title: '7.6 — Chapter 7 quiz|||7.6 — Kiểm tra Chương 7',
  slug: 'dbg-7-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: '10 câu tình huống: nhận ra N+1 trong log và trong pg_stat_statements, @ManyToOne mặc định EAGER, LazyInitializationException với open-in-view, "<> 20" bỏ mất dòng NULL, NOT IN gặp NULL, JOIN hai bảng con nhân tiền, "::date" làm index vô dụng, ước lượng rows=1 thật 300.000, phiên idle in transaction chặn API, ALTER TABLE làm mọi SELECT treo.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Check</span>
<h2>Check what stuck</h2>
<p class="lead">Ten situations, all taken from runs in this chapter. Read the explanation after submitting.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can turn on the real SQL in Prisma and Hibernate, and recognise N+1 in a log and in <code>pg_stat_statements</code>.</li>
<li>When a number is wrong I compare with an independent count and check NULL, fan-out, LEFT JOIN conditions, collation and time zones.</li>
<li>I can point at the node of an <code>EXPLAIN ANALYZE</code> that takes the time and name the cause.</li>
<li>I can find who holds a lock, remove it safely, and set the timeouts that prevent it.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mười tình huống, đều lấy từ các lần chạy trong chương này. Đọc phần giải thích sau khi nộp.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi bật được SQL thật trong Prisma và Hibernate, và nhận ra N+1 trong log lẫn trong <code>pg_stat_statements</code>.</li>
<li>Khi số sai, tôi so với một phép đếm độc lập và soát NULL, fan-out, điều kiện LEFT JOIN, collation và múi giờ.</li>
<li>Tôi chỉ được nút nào của <code>EXPLAIN ANALYZE</code> tốn thời gian và gọi tên nguyên nhân.</li>
<li>Tôi tìm được ai đang giữ khoá, gỡ nó an toàn, và đặt các timeout ngăn nó tái diễn.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'After loading a list page 5 times, pg_stat_statements shows one statement with calls = 5 and another with calls = 500 (same WHERE shape, only $1 differs). The page shows 100 rows. What is the most likely cause?|||Sau 5 lần tải một trang danh sách, pg_stat_statements có một câu calls = 5 và một câu calls = 500 (cùng dạng WHERE, chỉ khác $1). Trang hiện 100 dòng. Nguyên nhân khả dĩ nhất?',
        options: [
          'The database is missing memory (shared_buffers too small)|||Cơ sở dữ liệu thiếu bộ nhớ (shared_buffers quá nhỏ)',
          'N+1: one query for the list, then one query per row|||N+1: một truy vấn lấy danh sách, rồi mỗi dòng thêm một truy vấn',
          'The browser sent the request 100 times|||Trình duyệt gửi request 100 lần',
          'pg_stat_statements counts each row returned as a call|||pg_stat_statements đếm mỗi dòng trả về là một lần gọi',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: A ratio equal to the page size between two neighbouring statements is the database-side fingerprint of N+1 (lesson 7.1: 500 vs 5 after five loads of /nguoi-dung). The rows column counts rows; calls counts executions.|||VI: Tỉ lệ giữa hai câu đứng cạnh nhau đúng bằng cỡ trang là dấu vân tay N+1 nhìn từ phía cơ sở dữ liệu (bài 7.1: 500 so với 5 sau năm lần tải /nguoi-dung). Cột rows đếm dòng; calls đếm số lần chạy.',
      },
      {
        question: 'A Spring Data endpoint only returns repo.findByNguoiDat(nd).size(), yet the Hibernate log shows 1 select on dat_cho plus 4 selects on phong. The entity has a plain @ManyToOne Phong phong. Why?|||Một endpoint Spring Data chỉ trả repo.findByNguoiDat(nd).size(), vậy mà log Hibernate có 1 câu select dat_cho cộng 4 câu select phong. Entity khai báo trơn @ManyToOne Phong phong. Vì sao?',
        options: [
          'size() forces Hibernate to initialise every relation|||size() buộc Hibernate khởi tạo mọi quan hệ',
          'Open Session in View is disabled|||Open Session in View đang tắt',
          '@ManyToOne is EAGER by default in JPA, so each distinct room is loaded right after the query|||@ManyToOne mặc định là EAGER trong JPA, nên mỗi phòng khác nhau được nạp ngay sau truy vấn',
          'The second-level cache is misconfigured|||Cache cấp hai cấu hình sai',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: JPA defaults @ManyToOne and @OneToOne to EAGER. With a JPQL/derived query Hibernate then issues one select per distinct related entity, even if your code never touches it (lesson 7.1, /dem: 5 JDBC statements to count 40 rows). Always write fetch = LAZY and choose a fetch plan per query.|||VI: JPA mặc định @ManyToOne và @OneToOne là EAGER. Với truy vấn JPQL/dẫn xuất, Hibernate bắn thêm một câu cho mỗi entity liên quan khác nhau, kể cả khi mã không hề đụng tới (bài 7.1, /dem: 5 câu JDBC để đếm 40 dòng). Luôn ghi fetch = LAZY và chọn kế hoạch nạp cho từng truy vấn.',
      },
      {
        question: 'You change it to @ManyToOne(fetch = LAZY) with spring.jpa.open-in-view=false. The endpoint that maps d.getPhong().getTen() into a DTO in the controller now returns 500. What does the log say, and what is a correct fix?|||Bạn đổi sang @ManyToOne(fetch = LAZY) với spring.jpa.open-in-view=false. Endpoint ánh xạ d.getPhong().getTen() sang DTO trong controller giờ trả 500. Log nói gì, và cách sửa đúng là gì?',
        options: [
          'LazyInitializationException … no session; load the room in the query (@EntityGraph or JOIN FETCH)|||LazyInitializationException … no session; nạp phòng ngay trong truy vấn (@EntityGraph hoặc JOIN FETCH)',
          'NullPointerException; add a null check on getPhong()|||NullPointerException; thêm kiểm null cho getPhong()',
          'LazyInitializationException; turn open-in-view back on|||LazyInitializationException; bật lại open-in-view',
          'Deadlock detected; add @Transactional(readOnly = true)|||Deadlock detected; thêm @Transactional(readOnly = true)',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: The proxy is touched after the persistence context closed (lesson 7.1 run: "Could not initialize proxy [vn.labflow.c7.Phong#2] - no session"). Turning OSIV back on removes the error but brings the N+1 back silently during serialisation; the fix is a fetch plan in the query.|||VI: Proxy bị đụng sau khi persistence context đã đóng (lần chạy bài 7.1: "Could not initialize proxy [vn.labflow.c7.Phong#2] - no session"). Bật lại OSIV làm mất lỗi nhưng đưa N+1 quay lại lặng lẽ lúc chuyển JSON; cách sửa là kế hoạch nạp ngay trong truy vấn.',
      },
      {
        question: 'Of 3,000 bookings, 300 have giamGia = 0, 300 have 20, and 2,400 have NULL. How many rows does WHERE "giamGia" <> 20 return, and how many does Prisma\'s { giamGia: { not: 20 } } count?|||Trong 3.000 lượt đặt, 300 lượt giamGia = 0, 300 lượt = 20, và 2.400 lượt NULL. WHERE "giamGia" <> 20 trả bao nhiêu dòng, và { giamGia: { not: 20 } } của Prisma đếm được bao nhiêu?',
        options: [
          '2,700 and 2,700|||2.700 và 2.700',
          '2,700 and 300|||2.700 và 300',
          '300 and 2,700|||300 và 2.700',
          '300 and 300|||300 và 300',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: NULL <> 20 is NULL, and WHERE keeps only TRUE, so the 2,400 NULL rows vanish. Prisma translates not: 20 to "giamGia" <> $1 — same trap (lesson 7.2: 300 and 300). Use IS DISTINCT FROM, or add OR giamGia IS NULL.|||VI: NULL <> 20 là NULL, mà WHERE chỉ giữ TRUE, nên 2.400 dòng NULL biến mất. Prisma dịch not: 20 thành "giamGia" <> $1 — cùng cái bẫy (bài 7.2: 300 và 300). Dùng IS DISTINCT FROM, hoặc thêm OR giamGia IS NULL.',
      },
      {
        question: 'Since yesterday "students not in a blocked class" returns 0 rows. The query is WHERE lop NOT IN (SELECT lop FROM lop_bi_khoa). Someone added a row to lop_bi_khoa yesterday. What is the most likely explanation?|||Từ hôm qua, "sinh viên không thuộc lớp bị khoá" trả 0 dòng. Truy vấn là WHERE lop NOT IN (SELECT lop FROM lop_bi_khoa). Hôm qua có người thêm một dòng vào lop_bi_khoa. Giải thích khả dĩ nhất?',
        options: [
          'The new row blocked every class name|||Dòng mới khoá mọi tên lớp',
          'The new row has lop = NULL, and NOT IN with a NULL in the list is never TRUE|||Dòng mới có lop = NULL, và NOT IN gặp NULL trong danh sách thì không bao giờ TRUE',
          'NOT IN needs an index on lop_bi_khoa|||NOT IN cần index trên lop_bi_khoa',
          'The subquery returns too many rows|||Truy vấn con trả về quá nhiều dòng',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: x NOT IN (a, NULL) means x <> a AND x <> NULL; the second part is NULL, so the whole condition is never TRUE (lesson 7.2: 0 rows vs 248 with NOT EXISTS). Rewrite with NOT EXISTS and make the column NOT NULL.|||VI: x NOT IN (a, NULL) nghĩa là x <> a AND x <> NULL; vế sau là NULL nên cả điều kiện không bao giờ TRUE (bài 7.2: 0 dòng so với 248 dòng khi dùng NOT EXISTS). Viết lại bằng NOT EXISTS và đặt cột NOT NULL.',
      },
      {
        question: 'A revenue report JOINs bookings with payments (2 per booking) and with equipment rentals (2 for some bookings), then sums both. Room money is too high and equipment money exactly double. What is the right fix?|||Báo cáo doanh thu JOIN lượt đặt với thanh toán (2 dòng mỗi lượt) và với thuê thiết bị (2 dòng ở một số lượt), rồi cộng cả hai. Tiền phòng quá cao, tiền thiết bị gấp đúng đôi. Cách sửa đúng là gì?',
        options: [
          'Use SUM(DISTINCT …) on both amounts|||Dùng SUM(DISTINCT …) cho cả hai khoản',
          'Change LEFT JOIN to INNER JOIN|||Đổi LEFT JOIN thành INNER JOIN',
          'Aggregate each child table to one row per booking before joining|||Gộp từng bảng con về một dòng mỗi lượt đặt trước khi JOIN',
          'Add GROUP BY booking id at the end|||Thêm GROUP BY theo id lượt đặt ở cuối',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: Joining two one-to-many children multiplies rows: 2 payments × 2 rentals = 4 rows for booking 6 (lesson 7.2; lab 7.5: 333 vs 264 million). SUM(DISTINCT) would merge two different payments of equal amount; grouping at the end still sums the multiplied rows.|||VI: JOIN hai bảng con một-nhiều làm nhân dòng: 2 lần thanh toán × 2 món thuê = 4 dòng cho lượt 6 (bài 7.2; lab 7.5: 333 so với 264 triệu). SUM(DISTINCT) sẽ gộp hai khoản thanh toán khác nhau mà cùng số tiền; GROUP BY ở cuối vẫn cộng các dòng đã bị nhân.',
      },
      {
        question: 'There is an index on "batDau". WHERE "batDau"::date = \'2026-03-02\' takes 34.6 ms with a Parallel Seq Scan on 2 million rows. Which rewrite lets PostgreSQL use the index?|||Có index trên "batDau". WHERE "batDau"::date = \'2026-03-02\' mất 34,6 ms với Parallel Seq Scan trên 2 triệu dòng. Cách viết lại nào cho PostgreSQL dùng được index?',
        options: [
          'WHERE date_trunc(\'day\', "batDau") = \'2026-03-02\'|||WHERE date_trunc(\'day\', "batDau") = \'2026-03-02\'',
          'WHERE "batDau"::text LIKE \'2026-03-02%\'|||WHERE "batDau"::text LIKE \'2026-03-02%\'',
          'SET enable_seqscan = off before the query|||SET enable_seqscan = off trước truy vấn',
          'WHERE "batDau" >= \'2026-03-02\' AND "batDau" < \'2026-03-03\'|||WHERE "batDau" >= \'2026-03-02\' AND "batDau" < \'2026-03-03\'',
        ],
        correctIndex: 3, points: 1,
        explanation: 'EN: A function or cast on the indexed column hides it from the index; a half-open range on the naked column gives an Index Only Scan in 0.22 ms (lesson 7.3). Turning off seqscan is a diagnostic trick, not a fix.|||VI: Hàm hoặc ép kiểu trên cột có index che nó khỏi index; khoảng nửa mở trên cột gốc cho Index Only Scan trong 0,22 ms (bài 7.3). Tắt seqscan là mẹo chẩn đoán, không phải bản sửa.',
      },
      {
        question: 'EXPLAIN ANALYZE shows: Parallel Seq Scan on hang_duyet (rows=1) (actual … rows=150000 loops=2), feeding Nested Loops whose inner Index Scan has loops=300000. The table just received 300,000 new rows. What do you do first?|||EXPLAIN ANALYZE cho thấy: Parallel Seq Scan on hang_duyet (rows=1) (actual … rows=150000 loops=2), nuôi các Nested Loop có Index Scan bên trong loops=300000. Bảng vừa nhận 300.000 dòng mới. Bạn làm gì trước tiên?',
        options: [
          'Run ANALYZE on the table and compare the plan again|||Chạy ANALYZE cho bảng rồi so lại plan',
          'Add more indexes on hang_duyet|||Thêm index trên hang_duyet',
          'Increase work_mem to 1 GB|||Tăng work_mem lên 1 GB',
          'Rewrite the query with a CTE|||Viết lại truy vấn bằng CTE',
        ],
        correctIndex: 0, points: 1,
        explanation: 'EN: Estimate 1 vs actual 300,000 means the statistics describe an old table; the planner picked Nested Loops for "one row". After ANALYZE the plan became Hash Joins: 592 → 178 ms with no code change (lesson 7.3).|||VI: Ước lượng 1 so với thực tế 300.000 nghĩa là thống kê đang mô tả một bảng cũ; planner chọn Nested Loop cho "một dòng". Sau ANALYZE plan chuyển sang Hash Join: 592 → 178 ms mà không sửa mã (bài 7.3).',
      },
      {
        question: 'The API hangs on an UPDATE. pg_stat_activity shows the API session active with wait_event_type = Lock and pg_blocking_pids = {647}; pid 647 is "dbeaver", state idle in transaction, open for 6 minutes. What is the right sequence?|||API treo ở một câu UPDATE. pg_stat_activity cho thấy phiên API đang active với wait_event_type = Lock và pg_blocking_pids = {647}; pid 647 là "dbeaver", trạng thái idle in transaction, đã mở 6 phút. Trình tự đúng là gì?',
        options: [
          'Restart PostgreSQL to release all locks|||Khởi động lại PostgreSQL để nhả mọi khoá',
          'Increase the API timeout to 60 s|||Tăng timeout của API lên 60 s',
          'Ask the owner to commit/rollback; if impossible pg_terminate_backend(647) (their change is rolled back); then set idle_in_transaction_session_timeout and lock_timeout|||Nhắn chủ phiên commit/rollback; không được thì pg_terminate_backend(647) (thay đổi của họ bị rollback); sau đó đặt idle_in_transaction_session_timeout và lock_timeout',
          'pg_cancel_backend on the API session|||pg_cancel_backend phiên của API',
        ],
        correctIndex: 2, points: 1,
        explanation: 'EN: The blocker is the forgotten transaction, not the API. Terminating it rolls its work back (lesson 7.4: soGio stayed 1) and its client sees "terminating connection due to administrator command". Prevention is the timeouts plus application_name.|||VI: Kẻ chặn là transaction bị bỏ quên, không phải API. Kết thúc nó là rollback việc của nó (bài 7.4: soGio vẫn là 1) và client của họ thấy "terminating connection due to administrator command". Phòng ngừa bằng các timeout cùng application_name.',
      },
      {
        question: 'During a deploy, a migration ALTER TABLE "DatLich" ADD COLUMN waits, and from that moment even SELECT count(*) FROM "DatLich" hangs. Another session that only ran a SELECT inside BEGIN is idle in transaction. What happened?|||Trong lúc deploy, migration ALTER TABLE "DatLich" ADD COLUMN phải chờ, và từ lúc đó đến cả SELECT count(*) FROM "DatLich" cũng treo. Một phiên khác chỉ chạy SELECT trong BEGIN đang idle in transaction. Chuyện gì đã xảy ra?',
        options: [
          'SELECT takes a row lock that blocks ALTER TABLE and other SELECTs|||SELECT lấy khoá dòng chặn ALTER TABLE và các SELECT khác',
          'ALTER TABLE needs AccessExclusiveLock and waits behind the open transaction; new queries queue behind the ALTER|||ALTER TABLE cần AccessExclusiveLock nên chờ sau transaction đang mở; truy vấn mới xếp hàng sau ALTER',
          'The table is too large to alter online|||Bảng quá lớn để sửa trực tuyến',
          'A deadlock between the migration and the SELECT|||Deadlock giữa migration và câu SELECT',
        ],
        correctIndex: 1, points: 1,
        explanation: 'EN: The idle transaction holds only AccessShareLock. The ALTER waits for AccessExclusiveLock, and later AccessShareLock requests queue behind it — pg_blocking_pids of the api session pointed at the migration (lesson 7.4). Run migrations with SET lock_timeout and retry.|||VI: Transaction đang rảnh chỉ giữ AccessShareLock. ALTER chờ AccessExclusiveLock, và các yêu cầu AccessShareLock tới sau xếp hàng phía sau nó — pg_blocking_pids của phiên api chỉ vào migration (bài 7.4). Chạy migration với SET lock_timeout và thử lại.',
      },
    ],
  },
};
