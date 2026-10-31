/**
 * Testing · Chương 4 · Quiz Chương 4 (10 câu tình huống). BÀI MỚI 01/11/2026, slug tst-4-6-quiz.
 * Đáp án rải: A ×3 (câu 1, 5, 9) · B ×2 (3, 7) · C ×2 (2, 8) · D ×3 (4, 6, 10).
 */
export default {
  title: 'Chapter 4 check — 10 scenario questions|||Kiểm tra Chương 4 — 10 câu tình huống',
  slug: 'tst-4-6-quiz',
  type: 'QUIZ',
  isFreePreview: true,
  description: 'Mười câu tình huống về Chương 4: lỗi tranh chấp trên PostgreSQL, ràng buộc loại trừ, OVERLAP bị bọc thành STORAGE_DOWN, SQLite thay PostgreSQL, up --wait, tmpfs, provide/inject, dữ liệu rò giữa test, giới hạn của cô lập bằng rollback, đột biến tốt và đột biến phá cú pháp.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Check</span>
<h2>Chapter 4 check</h2>
<p class="lead">Ten scenarios about integration tests with a real PostgreSQL. Every answer is explained, including why the most tempting wrong option is wrong.</p>
<h3>Self-check before you start</h3>
<ul>
<li>I can explain which bugs only a real database shows, and how an exclusion constraint prevents double bookings.</li>
<li>I can start a throwaway PostgreSQL with Compose or Testcontainers and apply the schema every run.</li>
<li>I can keep tests isolated with TRUNCATE or a rolled-back transaction, and I know the limits of each.</li>
</ul>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Kiểm tra</span>
<h2>Kiểm tra Chương 4</h2>
<p class="lead">Mười tình huống về test tích hợp với PostgreSQL thật. Câu nào cũng có giải thích, kể cả vì sao đáp án sai hấp dẫn nhất lại sai.</p>
<h3>Tự kiểm trước khi làm</h3>
<ul>
<li>Tôi giải thích được bug nào chỉ cơ sở dữ liệu thật mới lộ, và ràng buộc loại trừ ngăn đặt trùng ra sao.</li>
<li>Tôi bật được một PostgreSQL dùng một lần bằng Compose hoặc Testcontainers và áp schema ở mỗi lần chạy.</li>
<li>Tôi giữ được test cô lập bằng TRUNCATE hoặc transaction rollback, và biết giới hạn của từng cách.</li>
</ul>
</div>
`,
  quiz: {
    timeLimitSeconds: 900,
    questions: [
      {
        question: 'Without any constraint, two concurrent bookLab calls for BE-201 at 08:00 on real PostgreSQL both succeed. Why?|||Không có ràng buộc nào, hai lời gọi bookLab đồng thời cho BE-201 lúc 08:00 trên PostgreSQL thật đều thành công. Vì sao?',
        options: [
          'Both overlap checks ran before either insert: check-then-insert is not atomic.|||Cả hai lần kiểm trùng chạy trước khi bên nào kịp ghi: kiểm-rồi-ghi không nguyên tử.',
          'The pool had too few connections.|||Pool có quá ít kết nối.',
          'PostgreSQL does not support concurrent writes.|||PostgreSQL không hỗ trợ ghi đồng thời.',
          'Vitest runs the two calls in different test files.|||Vitest chạy hai lời gọi trong hai file test khác nhau.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Each request asks “is it free?” on its own connection; both see an empty slot; both insert. This is the Chapter 2 race, now reproduced on PostgreSQL. More connections make it more likely, not less, and PostgreSQL handles concurrent writes fine — it simply was never told the rule.|||VI: Mỗi yêu cầu hỏi “còn trống không?” trên kết nối riêng; cả hai thấy trống; cả hai ghi. Đây là lỗi tranh chấp của Chương 2, nay tái hiện trên PostgreSQL. Nhiều kết nối hơn chỉ làm nó dễ xảy ra hơn, và PostgreSQL ghi đồng thời bình thường — chỉ là chưa ai nói cho nó biết luật.',
      },
      {
        question: 'Which schema element makes PostgreSQL itself refuse two overlapping bookings of the same lab?|||Thành phần schema nào khiến chính PostgreSQL từ chối hai lượt đặt chồng giờ của cùng một phòng?',
        options: [
          'UNIQUE (lab, date, start_time)|||UNIQUE (lab, date, start_time)',
          'CHECK (start_time < end_time)|||CHECK (start_time < end_time)',
          "EXCLUDE USING gist (lab WITH =, tsrange(date + start_time, date + end_time, '[)') WITH &&)|||EXCLUDE USING gist (lab WITH =, tsrange(date + start_time, date + end_time, '[)') WITH &&)",
          'An index on lab.|||Một chỉ mục trên cột lab.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: An exclusion constraint compares every pair of rows with the given operators: same lab (=) and overlapping range (&&). UNIQUE only catches identical start times — 08:00–10:00 and 09:00–11:00 would both pass. CHECK looks at one row at a time.|||VI: Ràng buộc loại trừ so mọi cặp dòng bằng các phép so đã cho: cùng phòng (=) và khoảng giờ chồng nhau (&&). UNIQUE chỉ bắt giờ bắt đầu trùng hệt — 08:00–10:00 và 09:00–11:00 vẫn lọt cả hai. CHECK chỉ nhìn từng dòng một.',
      },
      {
        question: 'After adding the constraint, the race test fails: the losing booking is STORAGE_DOWN, not OVERLAP. The adapter maps 23P01 correctly. What is wrong?|||Sau khi thêm ràng buộc, test tranh chấp hỏng: lượt thua nhận STORAGE_DOWN, không phải OVERLAP. Adapter đã đổi 23P01 đúng. Sai ở đâu?',
        options: [
          'The constraint was not created.|||Ràng buộc chưa được tạo.',
          "bookLab's catch around insert wraps every error — including the adapter's BookingError('OVERLAP') — into STORAGE_DOWN.|||Khối catch quanh insert trong bookLab bọc mọi lỗi — kể cả BookingError('OVERLAP') của adapter — thành STORAGE_DOWN.",
          '23P01 is a connection error.|||23P01 là lỗi kết nối.',
          'The pool was closed too early.|||Pool bị đóng quá sớm.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Lesson 2.3 turned every insert failure into STORAGE_DOWN. Chapter 4 adds one line before it: if (err instanceof BookingError) throw err;. That exact line is Lab 4 mutant #8. If the constraint were missing (A), both bookings would succeed instead.|||VI: Bài 2.3 biến mọi lỗi lúc ghi thành STORAGE_DOWN. Chương 4 thêm một dòng trước đó: if (err instanceof BookingError) throw err;. Chính dòng đó là đột biến số 8 của Lab 4. Nếu thiếu ràng buộc (A), cả hai lượt đã cùng thành công.',
      },
      {
        question: 'A team runs integration tests on in-memory SQLite “because it is faster”; production runs PostgreSQL. What is the main risk?|||Một nhóm chạy test tích hợp trên SQLite trong bộ nhớ “vì nhanh hơn”; production chạy PostgreSQL. Rủi ro chính là gì?',
        options: [
          'None: SQL is a standard.|||Không có: SQL là chuẩn chung.',
          'SQLite is slower than PostgreSQL.|||SQLite chậm hơn PostgreSQL.',
          'SQLite cannot run in CI.|||SQLite không chạy được trên CI.',
          'Engine differences — such as SQLite storing text in an INTEGER column — let tests pass where PostgreSQL would fail.|||Khác biệt giữa các engine — như SQLite lưu chữ vào cột INTEGER — làm test đạt ở chỗ PostgreSQL sẽ hỏng.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured in lesson 4.1: SQLite stored "thirty" in an INTEGER column; PostgreSQL refused it with 22P02. Exclusion constraints, tsrange and many types do not exist in SQLite at all. “Standard SQL” covers far less than real applications use.|||VI: Đo ở bài 4.1: SQLite lưu "thirty" vào cột INTEGER; PostgreSQL từ chối với 22P02. Ràng buộc loại trừ, tsrange và nhiều kiểu dữ liệu hoàn toàn không có trong SQLite. “SQL chuẩn” bao được ít hơn nhiều so với thứ ứng dụng thật dùng.',
      },
      {
        question: 'Why use docker compose up -d --wait with a pg_isready healthcheck instead of up -d && sleep 5?|||Vì sao dùng docker compose up -d --wait với healthcheck pg_isready thay vì up -d && sleep 5?',
        options: [
          'It returns exactly when PostgreSQL accepts connections — never too early on a busy machine, never wasting seconds.|||Nó trả về đúng lúc PostgreSQL nhận kết nối — không quá sớm trên máy đang bận, không phí giây nào.',
          'sleep does not exist on Windows.|||Windows không có lệnh sleep.',
          '--wait also creates the schema.|||--wait còn tạo luôn schema.',
          'The healthcheck makes PostgreSQL start faster.|||Healthcheck làm PostgreSQL khởi động nhanh hơn.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: A fixed sleep is either too long (wasted time, measured startup was 2.1 s) or too short on a slow CI runner (flaky “connection refused”). The schema is applied by the global setup, not by Compose.|||VI: Ngủ cố định thì hoặc quá dài (phí thời gian; khởi động đo được là 2,1 giây) hoặc quá ngắn trên máy CI chậm (lỗi chập chờn “connection refused”). Schema do global setup áp, không phải Compose.',
      },
      {
        question: 'What does putting the PostgreSQL data directory on tmpfs give a test database?|||Đặt thư mục dữ liệu của PostgreSQL lên tmpfs mang lại gì cho cơ sở dữ liệu test?',
        options: [
          'The data survives container restarts.|||Dữ liệu sống sót qua các lần khởi động lại container.',
          'Encryption at rest.|||Mã hoá dữ liệu khi lưu.',
          'It is required by PostgreSQL 17.|||PostgreSQL 17 bắt buộc như vậy.',
          'Data lives in memory: faster writes (≈ 20 % in our measurement) and nothing left behind when the container stops.|||Dữ liệu nằm trong bộ nhớ: ghi nhanh hơn (≈ 20 % theo phép đo của ta) và không để lại gì khi container dừng.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: 2000 single-row inserts took about 0.67 s on tmpfs and 0.85 s on a Docker volume on our machine. The gap depends on the disk — measure yours. Survival across restarts (A) is the opposite of what tmpfs does, and exactly what test data does not need.|||VI: 2000 lần chèn một dòng mất khoảng 0,67 giây trên tmpfs và 0,85 giây trên volume Docker ở máy chúng tôi. Mức chênh tuỳ ổ đĩa — hãy tự đo. Sống sót qua khởi động lại (A) là điều ngược hẳn với tmpfs, và đúng là thứ dữ liệu test không cần.',
      },
      {
        question: 'The global setup starts a container with Testcontainers. How should test files get its URL?|||Global setup bật container bằng Testcontainers. Các file test nên lấy URL của nó thế nào?',
        options: [
          'Each test file reads a hard-coded port 5432.|||Mỗi file test đọc cổng 5432 viết cứng.',
          "provide('databaseUrl', url) in the setup, inject('databaseUrl') in the tests.|||provide('databaseUrl', url) trong setup, inject('databaseUrl') trong test.",
          'Import the container object from the setup file.|||Import object container từ file setup.',
          'Start a second container in every test file.|||Bật thêm một container trong mỗi file test.',
        ],
        correctIndex: 1,
        points: 1,
        explanation: 'EN: Test files run in separate workers, so objects from the setup are not shared; provide/inject is Vitest’s channel for serialisable values. The port is random on purpose, so 5432 (A) would be wrong — and could even hit a real database.|||VI: Các file test chạy trong worker riêng, nên object trong setup không dùng chung được; provide/inject là kênh của Vitest cho các giá trị tuần tự hoá được. Cổng cố ý ngẫu nhiên, nên 5432 (A) là sai — và có khi còn chạm vào một cơ sở dữ liệu thật.',
      },
      {
        question: 'Test B passes alone but fails with OVERLAP when it runs after test A in the same file; both book BE-201 at 08:00. Best fix?|||Test B chạy riêng thì đạt nhưng hỏng với OVERLAP khi chạy sau test A trong cùng file; cả hai đặt BE-201 lúc 08:00. Cách sửa tốt nhất?',
        options: [
          'Rename B so it runs first.|||Đổi tên B để nó chạy trước.',
          'Delete test A.|||Xoá test A.',
          'TRUNCATE bookings RESTART IDENTITY in beforeEach (or a rolled-back transaction per test).|||TRUNCATE bookings RESTART IDENTITY trong beforeEach (hoặc mỗi test một transaction rollback).',
          'Mark B with it.fails.|||Đánh dấu B bằng it.fails.',
        ],
        correctIndex: 2,
        points: 1,
        explanation: 'EN: Both tests are correct; the leftover row is the problem. Isolation makes every test start from an empty table. Reordering (A) hides the dependency until someone adds a test; it.fails (D) would document a non-existent bug.|||VI: Cả hai test đều đúng; dòng dữ liệu còn sót mới là vấn đề. Cô lập làm mọi test bắt đầu từ bảng rỗng. Đổi thứ tự (A) chỉ giấu sự phụ thuộc tới khi có người thêm test; it.fails (D) là ghi nhận một bug không hề tồn tại.',
      },
      {
        question: 'Which test cannot use “BEGIN in beforeEach, ROLLBACK in afterEach on one client” as its isolation?|||Test nào không dùng được cách cô lập “BEGIN trong beforeEach, ROLLBACK trong afterEach trên một client”?',
        options: [
          'The race test: two concurrent bookings on two connections.|||Test tranh chấp: hai lượt đặt đồng thời trên hai kết nối.',
          'Insert one booking and read it back.|||Chèn một lượt đặt rồi đọc lại.',
          'Insert 0 seats and expect 23514.|||Chèn 0 chỗ và mong 23514.',
          'The boundaries of findOverlap.|||Các biên của findOverlap.',
        ],
        correctIndex: 0,
        points: 1,
        explanation: 'EN: Rollback isolation routes everything through one connection inside one transaction. A race needs two independent connections, and rows written by another connection are not inside that transaction. Use TRUNCATE for such tests — as the Lab 4 reference does.|||VI: Cô lập bằng rollback dồn mọi thứ qua một kết nối trong một transaction. Tranh chấp cần hai kết nối độc lập, và dòng do kết nối khác ghi thì không nằm trong transaction đó. Với các test như vậy hãy dùng TRUNCATE — như lời giải Lab 4.',
      },
      {
        question: "For Lab 4, why is “delete 'lab = $1 AND' from the query” a poor mutant, compared with replacing it by '$1::text IS NOT NULL AND'?|||Ở Lab 4, vì sao “xoá 'lab = $1 AND' khỏi câu truy vấn” là một đột biến kém, so với thay nó bằng '$1::text IS NOT NULL AND'?",
        options: [
          'Because mutants should never touch SQL.|||Vì đột biến không bao giờ được đụng tới SQL.',
          'Because it reveals a real bug.|||Vì nó lộ ra một bug thật.',
          'Because PostgreSQL becomes slow.|||Vì PostgreSQL trở nên chậm.',
          'With $1 no longer used, the query fails as a whole, so any test kills it — for a syntax reason, not because the test checks the lab filter.|||Khi $1 không còn được dùng, cả câu truy vấn hỏng, nên test nào cũng diệt nó — vì lý do cú pháp, không phải vì test có kiểm điều kiện phòng.',
        ],
        correctIndex: 3,
        points: 1,
        explanation: 'EN: Measured: with the deletion, even the weak three-test suite “killed” the mutant. The replacement keeps the query valid and only removes the behaviour (any lab blocks the slot) — and then the weak suite let it survive. A mutant should change behaviour, not break syntax.|||VI: Đo được: với bản xoá, ngay cả bộ test yếu ba test cũng “diệt” được đột biến. Bản thay thế giữ câu truy vấn hợp lệ và chỉ bỏ hành vi (phòng nào cũng chặn khung giờ) — và lúc đó bộ yếu để nó sống sót. Đột biến nên đổi hành vi, không phá cú pháp.',
      },
    ],
  },
};
