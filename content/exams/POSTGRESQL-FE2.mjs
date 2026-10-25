/**
 * PostgreSQL — Final Exam 2 (FE2): 50 câu trắc nghiệm MỚI phủ toàn khoá (Mục 0 → Chương 17).
 *
 * Đề thứ hai, KHÁC HẲN đề FE: không câu nào chép hay đảo lời từ POSTGRESQL-FE.mjs
 * (đã đối chiếu từng câu của FE trước khi soạn). Phân bổ: Mục 0 (gồm bài 0.5 SQL
 * Server/MySQL → PostgreSQL) 3 câu · Chương 1–4 mỗi chương 2 câu · Chương 5–16 mỗi
 * chương 3 câu · Chương 17 (SQL Server · MySQL · PostgreSQL · MongoDB) 3 câu = 50.
 *
 * ⚠️ MỌI câu "truy vấn này trả về gì / lỗi nào / kế hoạch nào" đều đã CHẠY THẬT trên
 * **PostgreSQL 17.11** (Docker `postgres:17`, aarch64, psql 17 trong container,
 * `SET TimeZone = 'Asia/Ho_Chi_Minh'`), trên CT Shop chuẩn (lab3-start.sql) cộng
 * vài bảng nháp riêng (schema `fe2`, bảng `fe2.big` 200.000 dòng tất định). Các câu
 * hai/ba phiên (SKIP LOCKED, idle in transaction, hàng đợi khoá sau ALTER TABLE)
 * chạy bằng các tiến trình psql song song thật. Toàn bộ SQL + output lưu ở
 * ~/Documents/video-bai-giang/src/khung/pg/that/thi-fe2.sql + thi-fe2.out.txt.
 * Ba câu Chương 17 dùng số đo thật của bài 17.2/17.3 (SQL Server 2022, MySQL 8,
 * MongoDB 7 — pg-17-2*.out.txt, pg-17-3.out.txt cùng thư mục).
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/POSTGRESQL-FE2.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/postgresql-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam 2</b> — 50 new multiple-choice questions over the whole course, from the first <code>psql</code> session and the move from SQL Server / MySQL (lesson 0.5), through joins, windows, indexes, the planner, transactions and JSONB, to running PostgreSQL in production and comparing it with SQL Server, MySQL and MongoDB (Chapter 17).</p>' +
  '<p>Most snippets use the <b>CT Shop</b> database from the labs (schema <code>shop</code>: 300 customers, 2,000 orders, 5,000 order lines, 1,663 payments). Every "what does this return / which error / which plan" answer was produced by running it on PostgreSQL 17.11 — including the ones that look like trick questions. Trust the statement, not the intuition.</p>' +
  '<p>Two habits pay off: count the rows that reach each step, and remember that <code>NULL</code> is <em>unknown</em>, not empty. You can flag a question and return to it; the timer auto-submits; every question shows a bilingual explanation afterwards, with the chapter to review.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá 2</b> — 50 câu trắc nghiệm mới phủ toàn khoá, từ phiên <code>psql</code> đầu tiên và việc chuyển từ SQL Server / MySQL sang (bài 0.5), qua JOIN, hàm cửa sổ, chỉ mục, bộ lập kế hoạch, giao dịch và JSONB, tới vận hành PostgreSQL trên production và so sánh với SQL Server, MySQL, MongoDB (Chương 17).</p>' +
  '<p>Phần lớn đoạn mã dùng cơ sở dữ liệu <b>CT Shop</b> của các lab (schema <code>shop</code>: 300 khách, 2.000 đơn, 5.000 dòng đơn, 1.663 lần thanh toán). Mọi đáp án kiểu "trả về gì / lỗi nào / kế hoạch nào" đều lấy từ việc chạy thật trên PostgreSQL 17.11 — kể cả những câu trông như câu đố mẹo. Hãy tin câu lệnh, đừng tin cảm giác.</p>' +
  '<p>Hai thói quen có ích: đếm số dòng đi tới mỗi bước, và nhớ rằng <code>NULL</code> là <em>không biết</em> chứ không phải <em>rỗng</em>. Bạn có thể đánh dấu câu để quay lại; hết giờ hệ thống tự nộp; nộp xong mỗi câu có lời giải thích song ngữ kèm chương cần ôn.</p>' +
  '</div>';

const Q = [
  // ── Mục 0 — Giới thiệu, psql, mô hình tư duy, 0.5 từ SQL Server / MySQL ──
  mcq({
    prompt: B(
      'You connect to <code>ctshop</code> and <code>\\dt shop.*</code> lists eight tables including <code>product</code>. Yet this happens. What is going on?' + code(
        'SHOW search_path;\n' +
        '--  "$user", public\n' +
        'SELECT count(*) FROM product;\n' +
        '-- ERROR:  relation "product" does not exist',
      ),
      'Bạn kết nối vào <code>ctshop</code> và <code>\\dt shop.*</code> liệt kê tám bảng, có <code>product</code>. Vậy mà vẫn ra thế này. Chuyện gì đang xảy ra?' + code(
        'SHOW search_path;\n' +
        '--  "$user", public\n' +
        'SELECT count(*) FROM product;\n' +
        '-- ERROR:  relation "product" does not exist',
      ),
    ),
    options: [
      B('Table names are case-sensitive in PostgreSQL, so it has to be written <code>"Product"</code>', 'Tên bảng trong PostgreSQL phân biệt hoa thường, nên phải viết <code>"Product"</code>'),
      B('The table lives in schema <code>shop</code>, which is not on the search path — write <code>shop.product</code> or <code>SET search_path = shop</code>', 'Bảng nằm trong schema <code>shop</code>, mà schema này không có trong search path — viết <code>shop.product</code> hoặc <code>SET search_path = shop</code>'),
      B('You lack <code>SELECT</code> privilege, and PostgreSQL hides that by reporting the table as missing', 'Bạn thiếu quyền <code>SELECT</code>, và PostgreSQL che chuyện đó bằng cách báo bảng không tồn tại'),
      B('<code>\\dt</code> reads a cached catalog; the table was dropped and the cache has not caught up', '<code>\\dt</code> đọc catalog từ bộ đệm; bảng đã bị xoá mà bộ đệm chưa cập nhật'),
    ],
    correct: 1,
    explanation: EX(
      'A database holds <b>schemas</b>, and an unqualified name is looked up only in the schemas listed in <code>search_path</code> — by default <code>"$user", public</code> (lesson 0.4; lesson 0.5 calls this the PostgreSQL equivalent of SQL Server\'s <code>dbo</code>). CT Shop puts everything in <code>shop</code>, so measured on 17.11: <code>SELECT count(*) FROM product</code> fails, <code>shop.product</code> returns 48, and after <code>SET search_path = shop</code> the bare name works — which is why every lab and exam file begins with that line. Option 1 is the identifier-folding rule misapplied: unquoted names are folded to lower case, and the table is called <code>product</code>, so case is not the issue here. Option 3 is wrong because a missing privilege is reported honestly as <code>permission denied for table product</code>. Option 4 invents a cache; <code>\\dt</code> queries the live catalog. Review: 0.4 and 0.5.',
      'Một cơ sở dữ liệu chứa nhiều <b>schema</b>, và một tên không kèm schema chỉ được tìm trong các schema liệt kê ở <code>search_path</code> — mặc định là <code>"$user", public</code> (bài 0.4; bài 0.5 gọi đây là thứ tương đương <code>dbo</code> của SQL Server). CT Shop đặt mọi thứ trong <code>shop</code>, nên đo trên 17.11: <code>SELECT count(*) FROM product</code> báo lỗi, <code>shop.product</code> ra 48, còn sau <code>SET search_path = shop</code> thì tên trần chạy được — vì vậy mọi file lab và đề thi đều mở đầu bằng dòng đó. Phương án 1 là áp nhầm luật gập chữ: tên không có ngoặc kép bị gập về chữ thường, và bảng tên là <code>product</code>, nên hoa thường không phải vấn đề ở đây. Phương án 3 sai vì thiếu quyền được báo đúng tên của nó: <code>permission denied for table product</code>. Phương án 4 bịa ra một bộ đệm; <code>\\dt</code> truy vấn thẳng catalog đang sống. Ôn: 0.4 và 0.5.',
    ),
  }),

  mcq({
    prompt: B(
      'Porting a SQL Server report, you write the line below. Customer 6 has a phone; customer 7 does not (<code>phone</code> is NULL). Run on PostgreSQL 17, which output is correct?' + code(
        "SELECT id, 'Tel: ' || phone AS pipes, concat('Tel: ', phone) AS concat_fn\n" +
        'FROM customer WHERE id IN (6, 7) ORDER BY id;',
      ),
      'Chuyển một báo cáo từ SQL Server sang, bạn viết dòng dưới đây. Khách 6 có số điện thoại; khách 7 thì không (<code>phone</code> là NULL). Chạy trên PostgreSQL 17, output nào đúng?' + code(
        "SELECT id, 'Tel: ' || phone AS pipes, concat('Tel: ', phone) AS concat_fn\n" +
        'FROM customer WHERE id IN (6, 7) ORDER BY id;',
      ),
    ),
    options: [
      B('Row 7: <code>pipes</code> = <code>Tel: </code>, <code>concat_fn</code> = <code>Tel: </code> — PostgreSQL treats a NULL string as empty', 'Dòng 7: <code>pipes</code> = <code>Tel: </code>, <code>concat_fn</code> = <code>Tel: </code> — PostgreSQL coi chuỗi NULL là chuỗi rỗng'),
      B('Row 7: both columns NULL — every string function propagates NULL', 'Dòng 7: cả hai cột NULL — mọi hàm chuỗi đều lan truyền NULL'),
      B('The statement fails: <code>||</code> is a logical OR in PostgreSQL, as in C', 'Câu lệnh lỗi: <code>||</code> là phép OR logic trong PostgreSQL, như trong C'),
      B('Row 7: <code>pipes</code> is NULL (an empty cell), <code>concat_fn</code> is <code>Tel: </code> — <code>concat()</code> skips NULL arguments', 'Dòng 7: <code>pipes</code> là NULL (ô trống), <code>concat_fn</code> là <code>Tel: </code> — <code>concat()</code> bỏ qua đối số NULL'),
    ],
    correct: 3,
    explanation: EX(
      'Measured: row 6 prints <code>Tel: 0980047514</code> in both columns; row 7 prints an empty cell for <code>pipes</code> and <code>Tel: </code> for <code>concat_fn</code>. <code>||</code> is the SQL-standard concatenation operator and, like almost every operator, returns NULL when an operand is NULL. <code>concat()</code> is the deliberate exception: it ignores NULL arguments. This is one of the translation traps of lesson 0.5 — SQL Server\'s <code>+</code> behaves like <code>||</code> by default, so <code>\'Tel: \' + phone</code> silently blanked these rows there too; the fix in either system is <code>coalesce(phone, \'n/a\')</code> or <code>concat()</code>. Option 1 is Oracle\'s behaviour (empty string = NULL), not PostgreSQL\'s — PostgreSQL keeps <code>\'\'</code> and NULL distinct. Option 2 forgets that <code>concat</code> is designed to skip NULLs. Option 3: <code>||</code> is OR in MySQL\'s default mode, never in PostgreSQL.',
      'Đo thật: dòng 6 in <code>Tel: 0980047514</code> ở cả hai cột; dòng 7 in ô trống ở <code>pipes</code> và <code>Tel: </code> ở <code>concat_fn</code>. <code>||</code> là toán tử nối chuỗi chuẩn SQL và, như gần như mọi toán tử, trả về NULL khi một vế là NULL. <code>concat()</code> là ngoại lệ có chủ ý: nó bỏ qua đối số NULL. Đây là một trong các bẫy chuyển đổi của bài 0.5 — <code>+</code> của SQL Server mặc định cũng cư xử như <code>||</code>, nên <code>\'Tel: \' + phone</code> ở đó cũng lặng lẽ làm trống các dòng này; cách sửa ở cả hai hệ là <code>coalesce(phone, \'n/a\')</code> hoặc <code>concat()</code>. Phương án 1 là hành vi của Oracle (chuỗi rỗng = NULL), không phải PostgreSQL — PostgreSQL giữ <code>\'\'</code> và NULL là hai thứ khác nhau. Phương án 2 quên rằng <code>concat</code> được thiết kế để bỏ qua NULL. Phương án 3: <code>||</code> là OR ở chế độ mặc định của MySQL, không bao giờ ở PostgreSQL.',
    ),
  }),

  mcq({
    prompt: B(
      'A table migrated from SQL Server was created with quotes. Run on PostgreSQL 17, the first and third queries fail and the second works. What is the rule?' + code(
        'CREATE TABLE fe2."OrderNote" (id int, body text);\n' +
        'SELECT * FROM fe2.OrderNote;     -- ERROR:  relation "fe2.ordernote" does not exist\n' +
        'SELECT * FROM fe2."OrderNote";   -- (0 rows)\n' +
        'SELECT * FROM fe2."ordernote";   -- ERROR:  relation "fe2.ordernote" does not exist',
      ),
      'Một bảng chuyển từ SQL Server sang được tạo kèm ngoặc kép. Chạy trên PostgreSQL 17, truy vấn thứ nhất và thứ ba lỗi, truy vấn thứ hai chạy. Quy tắc là gì?' + code(
        'CREATE TABLE fe2."OrderNote" (id int, body text);\n' +
        'SELECT * FROM fe2.OrderNote;     -- ERROR:  relation "fe2.ordernote" does not exist\n' +
        'SELECT * FROM fe2."OrderNote";   -- (0 rows)\n' +
        'SELECT * FROM fe2."ordernote";   -- ERROR:  relation "fe2.ordernote" does not exist',
      ),
    ),
    options: [
      B('Unquoted names fold to lower case; quoted names keep their case — so <code>"OrderNote"</code> must always be quoted', 'Tên không ngoặc kép bị gập về chữ thường; tên có ngoặc kép giữ nguyên — nên <code>"OrderNote"</code> phải luôn viết kèm ngoặc kép'),
      B('PostgreSQL folds unquoted names to UPPER case, like Oracle, so the unquoted query looked for <code>ORDERNOTE</code>', 'PostgreSQL gập tên không ngoặc kép thành chữ HOA, như Oracle, nên truy vấn không ngoặc kép đã đi tìm <code>ORDERNOTE</code>'),
      B('Double quotes delimit string literals in PostgreSQL, so the CREATE TABLE made a table literally named with quote marks', 'Ngoặc kép dùng để bao chuỗi trong PostgreSQL, nên CREATE TABLE đã tạo một bảng có tên chứa luôn dấu ngoặc kép'),
      B('Identifiers are always case-sensitive; the first query failed only because the schema prefix was written in lower case', 'Định danh luôn phân biệt hoa thường; truy vấn thứ nhất lỗi chỉ vì tiền tố schema viết bằng chữ thường'),
    ],
    correct: 0,
    explanation: EX(
      'Notice what the error says: PostgreSQL went looking for <code>fe2.ordernote</code> — it had already folded the unquoted <code>OrderNote</code> to lower case before searching. A quoted identifier is taken byte for byte, so <code>"OrderNote"</code> exists and <code>"ordernote"</code> does not. Migration tools and ORMs that quote every name (Prisma models such as <code>"User"</code> are the common case) leave you with tables that must be quoted in every hand-written query; lesson 0.5 recommends lower-case snake_case so the question never arises. Option 2 is Oracle\'s rule; PostgreSQL deliberately folds to lower case. Option 3 confuses identifier quotes with string quotes: strings use single quotes <code>\'…\'</code>. Option 4 contradicts the third line, where the exact lower-case name fails.',
      'Để ý câu báo lỗi: PostgreSQL đi tìm <code>fe2.ordernote</code> — nó đã gập <code>OrderNote</code> không ngoặc kép về chữ thường TRƯỚC khi tìm. Định danh có ngoặc kép được lấy y nguyên từng byte, nên <code>"OrderNote"</code> tồn tại còn <code>"ordernote"</code> thì không. Công cụ chuyển đổi và ORM đặt ngoặc kép cho mọi tên (model Prisma như <code>"User"</code> là ca hay gặp) để lại cho bạn những bảng phải viết kèm ngoặc kép trong mọi truy vấn viết tay; bài 0.5 khuyên dùng snake_case chữ thường để câu hỏi này không bao giờ xuất hiện. Phương án 2 là luật của Oracle; PostgreSQL cố ý gập về chữ thường. Phương án 3 nhầm ngoặc kép của định danh với ngoặc của chuỗi: chuỗi dùng nháy đơn <code>\'…\'</code>. Phương án 4 bị dòng thứ ba bác bỏ: đúng tên chữ thường mà vẫn lỗi.',
    ),
  }),

  // ── Chương 1 — Vì sao PostgreSQL tồn tại ────────────────────────────────
  mcq({
    prompt: B(
      'A column name is mistyped. Both statements fail with the same message on PostgreSQL 17. Which of the four stages of lesson 1.4 rejected them, and how many rows were read?' + code(
        'SELECT ful_name FROM customer WHERE id = 1;\n' +
        'EXPLAIN SELECT ful_name FROM customer WHERE id = 1;\n' +
        '-- ERROR:  column "ful_name" does not exist\n' +
        '-- HINT:  Perhaps you meant to reference the column "customer.full_name".',
      ),
      'Gõ sai tên một cột. Cả hai câu đều lỗi với cùng một thông báo trên PostgreSQL 17. Chặng nào trong bốn chặng của bài 1.4 đã từ chối chúng, và đã đọc bao nhiêu dòng?' + code(
        'SELECT ful_name FROM customer WHERE id = 1;\n' +
        'EXPLAIN SELECT ful_name FROM customer WHERE id = 1;\n' +
        '-- ERROR:  column "ful_name" does not exist\n' +
        '-- HINT:  Perhaps you meant to reference the column "customer.full_name".',
      ),
    ),
    options: [
      B('Execution: the executor fetched row 1, found no such column in it and stopped — one row read', 'Thực thi: bộ thực thi lấy dòng 1, không thấy cột đó trong dòng rồi dừng — đọc một dòng'),
      B('Planning: the planner could not cost a plan for an unknown column — the table statistics were read, no rows', 'Lập kế hoạch: bộ lập kế hoạch không tính được chi phí cho một cột lạ — đã đọc thống kê của bảng, không đọc dòng nào'),
      B('Parsing and analysis, before any plan exists — which is why even <code>EXPLAIN</code> fails; zero rows read', 'Phân tích cú pháp và ngữ nghĩa, trước khi có kế hoạch nào — vì thế ngay cả <code>EXPLAIN</code> cũng lỗi; không đọc dòng nào'),
      B('Returning: the rows were computed but the client could not map the column name, so psql printed the error', 'Trả kết quả: các dòng đã tính xong nhưng client không khớp được tên cột, nên psql in ra lỗi'),
    ],
    correct: 2,
    explanation: EX(
      'Lesson 1.4\'s pipeline is parse → plan → execute → return. The parser turns text into a tree and the analysis step resolves every name against the catalog; an unknown column is rejected right there, with a helpful <code>HINT</code> computed from the real column names. The proof is the second statement: <code>EXPLAIN</code> runs only the first two stages and never executes, yet it fails identically — so the failure happened before any plan existed (option 2 is therefore wrong too), and certainly before the executor touched a page (option 1). Option 4 misplaces the error in the client; the message and hint come from the server. Practical consequence: a typo costs nothing on a billion-row table — the expensive surprises are the statements that parse fine.',
      'Dòng chảy của bài 1.4 là phân tích → lập kế hoạch → thực thi → trả kết quả. Bộ phân tích biến văn bản thành cây, và bước phân tích ngữ nghĩa đối chiếu mọi tên với catalog; một cột lạ bị từ chối ngay tại đó, kèm một <code>HINT</code> hữu ích tính từ tên cột thật. Bằng chứng là câu thứ hai: <code>EXPLAIN</code> chỉ chạy hai chặng đầu và không bao giờ thực thi, vậy mà nó lỗi y hệt — tức lỗi xảy ra trước khi có kế hoạch nào (nên phương án 2 cũng sai), và chắc chắn trước khi bộ thực thi chạm vào trang dữ liệu nào (phương án 1). Phương án 4 đặt nhầm lỗi ở phía client; thông báo và gợi ý đến từ máy chủ. Hệ quả thực tế: gõ sai tên chẳng tốn gì kể cả trên bảng tỷ dòng — những bất ngờ đắt giá là các câu lệnh phân tích qua được.',
    ),
  }),

  mcq({
    prompt: B(
      '<code>COMMIT</code> returns, and one second later the power fails. The defaults are on: <code>fsync = on</code>, <code>synchronous_commit = on</code>. After restart, is the committed row there, and why?',
      '<code>COMMIT</code> trả về, và một giây sau thì mất điện. Các giá trị mặc định đang bật: <code>fsync = on</code>, <code>synchronous_commit = on</code>. Khởi động lại, dòng đã commit còn không, và vì sao?',
    ),
    options: [
      B('Only if a checkpoint ran in that second — until then the change lived only in shared memory', 'Chỉ khi có một checkpoint chạy trong giây đó — trước đó thay đổi chỉ nằm trong bộ nhớ dùng chung'),
      B('Yes: the commit was flushed to the WAL on disk before success was reported; recovery replays it', 'Có: commit đã được đẩy xuống WAL trên đĩa trước khi báo thành công; lúc khôi phục nó được phát lại'),
      B('Yes, because PostgreSQL writes every changed table page to disk before <code>COMMIT</code> returns', 'Có, vì PostgreSQL ghi mọi trang bảng bị thay đổi xuống đĩa trước khi <code>COMMIT</code> trả về'),
      B('No: durability needs a replica; a single server can lose its last second of commits', 'Không: tính bền vững cần một bản sao; một máy chủ đơn có thể mất giây commit cuối cùng'),
    ],
    correct: 1,
    explanation: EX(
      'This is the D of ACID as lesson 1.2 proves it: PostgreSQL writes the change to an append-only log first and, with <code>fsync = on</code> and <code>synchronous_commit = on</code>, forces that log to physical storage before saying "committed". The data pages themselves may stay dirty in memory for minutes — writing them is the checkpointer\'s job — and that is fine, because after a crash the server replays the WAL from the last checkpoint and reconstructs them. Option 3 describes a design that would be far slower (random writes to many pages per commit) and is exactly what WAL exists to avoid. Option 1 confuses checkpoints, which bound recovery time, with durability. Option 4 confuses durability with availability: a replica protects against losing the machine (Chapter 15), not against a power cut on a healthy disk.',
      'Đây chính là chữ D của ACID như bài 1.2 chứng minh: PostgreSQL ghi thay đổi vào một nhật ký chỉ-ghi-thêm trước, và với <code>fsync = on</code> cùng <code>synchronous_commit = on</code>, nó ép nhật ký đó xuống bộ lưu trữ vật lý rồi mới nói "đã commit". Bản thân các trang dữ liệu có thể nằm "bẩn" trong bộ nhớ hàng phút — ghi chúng là việc của checkpointer — và thế là ổn, vì sau sự cố máy chủ phát lại WAL từ checkpoint gần nhất và dựng lại chúng. Phương án 3 mô tả một thiết kế chậm hơn nhiều (ghi ngẫu nhiên vào nhiều trang cho mỗi commit) và chính là thứ WAL sinh ra để tránh. Phương án 1 nhầm checkpoint — thứ giới hạn thời gian khôi phục — với tính bền vững. Phương án 4 nhầm bền vững với sẵn sàng: bản sao bảo vệ bạn khỏi việc mất cả máy (Chương 15), không phải khỏi một lần cúp điện khi đĩa vẫn lành.',
    ),
  }),

  // ── Chương 2 — Kiểu dữ liệu ─────────────────────────────────────────────
  mcq({
    prompt: B(
      'Run on PostgreSQL 17. Which row is the real output?' + code(
        'SELECT 7 / 2 AS a, 7 / 2.0 AS b, round(2.5) AS d,\n' +
        '       round(2.5::float8) AS e, round(3.5::float8) AS f;',
      ),
      'Chạy trên PostgreSQL 17. Dòng nào là output thật?' + code(
        'SELECT 7 / 2 AS a, 7 / 2.0 AS b, round(2.5) AS d,\n' +
        '       round(2.5::float8) AS e, round(3.5::float8) AS f;',
      ),
    ),
    options: [
      B('<code>a = 3.5 · b = 3.5 · d = 3 · e = 3 · f = 4</code>', '<code>a = 3.5 · b = 3.5 · d = 3 · e = 3 · f = 4</code>'),
      B('<code>a = 3 · b = 3.5000000000000000 · d = 2 · e = 2 · f = 4</code>', '<code>a = 3 · b = 3.5000000000000000 · d = 2 · e = 2 · f = 4</code>'),
      B('<code>a = 3 · b = 3.5000000000000000 · d = 3 · e = 3 · f = 4</code>', '<code>a = 3 · b = 3.5000000000000000 · d = 3 · e = 3 · f = 4</code>'),
      B('<code>a = 3 · b = 3.5000000000000000 · d = 3 · e = 2 · f = 4</code>', '<code>a = 3 · b = 3.5000000000000000 · d = 3 · e = 2 · f = 4</code>'),
    ],
    correct: 3,
    explanation: EX(
      'Measured: <code>3 | 3.5000000000000000 | 3 | 2 | 4</code>. Three separate rules. <b>Integer ÷ integer is integer division</b>: <code>7 / 2</code> truncates to 3 — the classic average-of-ratings bug; make one side <code>numeric</code>. <code>2.0</code> is a <code>numeric</code> literal, so <code>7 / 2.0</code> is exact decimal arithmetic, printed with the scale PostgreSQL chose. And <b>rounding depends on the type</b>: <code>round()</code> on <code>numeric</code> rounds half away from zero (2.5 → 3), while on <code>float8</code> it uses the platform\'s round-half-to-even, so 2.5 → 2 and 3.5 → 4. Money in <code>float8</code> is wrong twice — binary fractions (lesson 2.1) and banker\'s rounding you did not ask for. Options 1–3 each get one of the three rules wrong.',
      'Đo thật: <code>3 | 3.5000000000000000 | 3 | 2 | 4</code>. Ba quy tắc riêng biệt. <b>Số nguyên ÷ số nguyên là chia nguyên</b>: <code>7 / 2</code> cắt còn 3 — lỗi kinh điển khi tính điểm trung bình; hãy để một vế là <code>numeric</code>. <code>2.0</code> là hằng <code>numeric</code>, nên <code>7 / 2.0</code> là phép tính thập phân chính xác, in với số chữ số mà PostgreSQL chọn. Và <b>cách làm tròn tuỳ kiểu</b>: <code>round()</code> trên <code>numeric</code> làm tròn nửa ra xa số 0 (2.5 → 3), còn trên <code>float8</code> nó dùng kiểu làm tròn nửa về số chẵn của nền tảng, nên 2.5 → 2 và 3.5 → 4. Tiền để trong <code>float8</code> là sai hai lần — phân số nhị phân (bài 2.1) và kiểu làm tròn ngân hàng mà bạn không hề yêu cầu. Phương án 1–3 mỗi cái sai một trong ba quy tắc.',
    ),
  }),

  mcq({
    prompt: B(
      'A subscription renews monthly. The code adds one month to the <b>last renewal date</b> each time. Run on PostgreSQL 17:' + code(
        "SELECT date '2026-01-31' + interval '1 month'                      AS a,\n" +
        "       date '2026-01-31' + interval '1 month' + interval '1 month' AS b,\n" +
        "       date '2026-01-31' + interval '2 months'                     AS c;\n" +
        '--           a          |          b          |          c\n' +
        '-- 2026-02-28 00:00:00 | 2026-03-28 00:00:00 | 2026-03-31 00:00:00',
      ),
      'Một gói thuê bao gia hạn hằng tháng. Mã cộng một tháng vào <b>ngày gia hạn gần nhất</b> mỗi lần. Chạy trên PostgreSQL 17:' + code(
        "SELECT date '2026-01-31' + interval '1 month'                      AS a,\n" +
        "       date '2026-01-31' + interval '1 month' + interval '1 month' AS b,\n" +
        "       date '2026-01-31' + interval '2 months'                     AS c;\n" +
        '--           a          |          b          |          c\n' +
        '-- 2026-02-28 00:00:00 | 2026-03-28 00:00:00 | 2026-03-31 00:00:00',
      ),
    ),
    options: [
      B('It is a bug in <code>interval</code>: adding one month to 31 January should raise an error because 31 February does not exist', 'Đó là lỗi của <code>interval</code>: cộng một tháng vào 31/1 lẽ ra phải báo lỗi vì không có ngày 31/2'),
      B('Adding a month clamps to the last day of a short month, and chaining keeps the clamp — compute each date from the start', 'Cộng tháng kẹp về ngày cuối của tháng ngắn, và cộng nối tiếp giữ luôn cú kẹp — hãy tính mỗi ngày từ mốc gốc'),
      B('<code>interval \'1 month\'</code> is stored as 30 days, so <code>b</code> is 60 days after the start and <code>c</code> is a different code path', '<code>interval \'1 month\'</code> được lưu là 30 ngày, nên <code>b</code> là 60 ngày sau mốc còn <code>c</code> đi theo một nhánh mã khác'),
      B('The result changes with the session time zone; in UTC all three columns would read the 31st', 'Kết quả đổi theo múi giờ của phiên; ở UTC cả ba cột sẽ ra ngày 31'),
    ],
    correct: 1,
    explanation: EX(
      'PostgreSQL keeps months, days and microseconds as separate fields of an <code>interval</code> (lesson 2.3), and adding months to a date moves the month number, then clamps the day to the end of the month if it overflows: 31 January + 1 month = 28 February. The clamp is not remembered — the next "+1 month" starts from the 28th and gives 28 March, while adding 2 months to the original date gives 31 March. Billing code that chains from the previous result therefore drifts forever; computing each date from the anchor does not. Option 1: PostgreSQL defines the clamp instead of failing. Option 3 is wrong: 60 days after 31 January is 1 April, yet <code>c</code> reads 31 March — months are not 30 days. Option 4: <code>date + interval</code> gives a <code>timestamp</code> without time zone, so the session time zone plays no part.',
      'PostgreSQL giữ tháng, ngày và micro-giây thành các trường riêng của một <code>interval</code> (bài 2.3), và cộng tháng vào một ngày sẽ dời số tháng, rồi kẹp ngày về cuối tháng nếu tràn: 31/1 + 1 tháng = 28/2. Cú kẹp không được ghi nhớ — lần "+1 tháng" tiếp theo bắt đầu từ ngày 28 và ra 28/3, trong khi cộng 2 tháng vào ngày gốc ra 31/3. Mã tính tiền cộng nối tiếp từ kết quả trước vì vậy trôi mãi; tính mỗi ngày từ mốc gốc thì không. Phương án 1: PostgreSQL định nghĩa sẵn cú kẹp thay vì báo lỗi. Phương án 3 sai: 60 ngày sau 31/1 là 1/4, vậy mà <code>c</code> ra 31/3 — tháng không phải 30 ngày. Phương án 4: <code>date + interval</code> ra <code>timestamp</code> không múi giờ, nên múi giờ của phiên không dính vào.',
    ),
  }),

  // ── Chương 3 — Bảng, ràng buộc & thiết kế lược đồ ──────────────────────
  mcq({
    prompt: B(
      'In CT Shop, <code>order_item.order_id</code> references <code>orders</code> <b>ON DELETE CASCADE</b>; <code>payment.order_id</code> references <code>orders</code> with no ON DELETE clause. Order 11 is paid: 4 lines, 1 payment. What does this do?' + code(
        'BEGIN;\n' +
        'DELETE FROM orders WHERE id = 11;\n' +
        'ROLLBACK;',
      ),
      'Trong CT Shop, <code>order_item.order_id</code> tham chiếu <code>orders</code> với <b>ON DELETE CASCADE</b>; <code>payment.order_id</code> tham chiếu <code>orders</code> không có mệnh đề ON DELETE. Đơn 11 đã thanh toán: 4 dòng hàng, 1 lần thanh toán. Câu lệnh này làm gì?' + code(
        'BEGIN;\n' +
        'DELETE FROM orders WHERE id = 11;\n' +
        'ROLLBACK;',
      ),
    ),
    options: [
      B('Deletes the order and its 4 lines; the payment row stays behind with a dangling <code>order_id</code>', 'Xoá đơn và 4 dòng hàng; dòng thanh toán ở lại với một <code>order_id</code> treo'),
      B('Deletes the 4 lines (the cascade runs first), then fails on the payment and keeps the order', 'Xoá 4 dòng hàng (cascade chạy trước), rồi lỗi ở dòng thanh toán và giữ lại đơn'),
      B('Deletes the order, its lines and its payment — one cascade is enough to clear every child', 'Xoá đơn, các dòng hàng và cả thanh toán — một cascade là đủ dọn mọi bảng con'),
      B('Fails with <code>violates foreign key constraint "payment_order_id_fkey"</code>, and the whole statement is undone — the 4 lines are still there', 'Lỗi <code>violates foreign key constraint "payment_order_id_fkey"</code>, và cả câu lệnh bị huỷ — 4 dòng hàng vẫn còn nguyên'),
    ],
    correct: 3,
    explanation: EX(
      'Measured: <code>ERROR: update or delete on table "orders" violates foreign key constraint "payment_order_id_fkey" on table "payment"</code>, <code>DETAIL: Key (id)=(11) is still referenced from table "payment".</code> Each foreign key carries its own rule, decided by the child: <code>order_item</code> said CASCADE, <code>payment</code> said nothing, which means NO ACTION — refuse. And a statement is atomic: the cascade to <code>order_item</code> and the refusal belong to the same <code>DELETE</code>, so when it fails, everything it did is undone — option 2\'s half-finished state never exists. Option 1 is impossible, the whole point of a foreign key is that a dangling reference cannot be created. Option 3 imagines cascades as a property of the parent. This is a design decision CT Shop makes on purpose: a paid order is a financial record and should be cancelled, not deleted (lesson 3.2).',
      'Đo thật: <code>ERROR: update or delete on table "orders" violates foreign key constraint "payment_order_id_fkey" on table "payment"</code>, <code>DETAIL: Key (id)=(11) is still referenced from table "payment".</code> Mỗi khoá ngoại mang luật riêng của nó, do bảng con quyết định: <code>order_item</code> nói CASCADE, <code>payment</code> không nói gì, tức NO ACTION — từ chối. Và một câu lệnh là nguyên tử: phần cascade sang <code>order_item</code> và lời từ chối thuộc cùng một câu <code>DELETE</code>, nên khi nó hỏng, mọi thứ nó đã làm bị huỷ — trạng thái dở dang của phương án 2 không bao giờ tồn tại. Phương án 1 là không thể, toàn bộ ý nghĩa của khoá ngoại là không thể tạo ra một tham chiếu treo. Phương án 3 tưởng cascade là thuộc tính của bảng cha. Đây là một quyết định thiết kế CT Shop cố ý chọn: đơn đã thanh toán là chứng từ tài chính, phải huỷ chứ không xoá (bài 3.2).',
    ),
  }),

  mcq({
    prompt: B(
      'Row 2 already violates the rule (discount 80 on a price of 50). Run on PostgreSQL 17 in this order — which statements succeed?' + code(
        '-- item: (1, 100, 10), (2, 50, 80), (3, 70, NULL)\n' +
        'ALTER TABLE item ADD CONSTRAINT item_discount_check CHECK (discount <= price);            -- ①\n' +
        'ALTER TABLE item ADD CONSTRAINT item_discount_check CHECK (discount <= price) NOT VALID;  -- ②\n' +
        'INSERT INTO item VALUES (4, 30, 40);                                                     -- ③\n' +
        'INSERT INTO item VALUES (5, 30, NULL);                                                   -- ④\n' +
        'ALTER TABLE item VALIDATE CONSTRAINT item_discount_check;                                -- ⑤',
      ),
      'Dòng 2 vốn đã vi phạm quy tắc (giảm 80 trên giá 50). Chạy trên PostgreSQL 17 theo đúng thứ tự — những câu nào thành công?' + code(
        '-- item: (1, 100, 10), (2, 50, 80), (3, 70, NULL)\n' +
        'ALTER TABLE item ADD CONSTRAINT item_discount_check CHECK (discount <= price);            -- ①\n' +
        'ALTER TABLE item ADD CONSTRAINT item_discount_check CHECK (discount <= price) NOT VALID;  -- ②\n' +
        'INSERT INTO item VALUES (4, 30, 40);                                                     -- ③\n' +
        'INSERT INTO item VALUES (5, 30, NULL);                                                   -- ④\n' +
        'ALTER TABLE item VALIDATE CONSTRAINT item_discount_check;                                -- ⑤',
      ),
    ),
    options: [
      B('Only ② and ④: ① and ⑤ fail on row 2, ③ fails the new check, and the NULL discount in ④ passes', 'Chỉ ② và ④: ① và ⑤ lỗi vì dòng 2, ③ trượt ràng buộc mới, còn discount NULL ở ④ qua được'),
      B('②, ③ and ④: <code>NOT VALID</code> switches the check off until it is validated', '②, ③ và ④: <code>NOT VALID</code> tắt ràng buộc cho tới khi được xác nhận'),
      B('② and ⑤: <code>NOT VALID</code> deletes row 2, so validation succeeds; ③ and ④ both fail', '② và ⑤: <code>NOT VALID</code> xoá dòng 2 nên bước xác nhận thành công; ③ và ④ đều lỗi'),
      B('Only ②: ④ fails too, because <code>NULL &lt;= 30</code> is not true', 'Chỉ ②: ④ cũng lỗi, vì <code>NULL &lt;= 30</code> không đúng'),
    ],
    correct: 0,
    explanation: EX(
      'Measured: ① <code>ERROR: check constraint "item_discount_check" of relation "item" is violated by some row</code>; ② <code>ALTER TABLE</code>; ③ <code>ERROR: new row … violates check constraint</code>; ④ <code>INSERT 0 1</code>; ⑤ the same "violated by some row" error. <code>NOT VALID</code> (lesson 3.4) adds the constraint <b>for new and updated rows only</b>, skipping the scan of existing data — the standard way to add a rule to a big live table without a long lock, then <code>VALIDATE</code> later once the old rows are fixed. It neither disables the check (option 2) nor touches old rows (option 3). And a CHECK passes when its expression is NULL — only <code>false</code> rejects — so ④ is accepted; option 4 applies <code>WHERE</code> logic to a constraint. If a missing discount must be forbidden, that is <code>NOT NULL</code>\'s job.',
      'Đo thật: ① <code>ERROR: check constraint "item_discount_check" of relation "item" is violated by some row</code>; ② <code>ALTER TABLE</code>; ③ <code>ERROR: new row … violates check constraint</code>; ④ <code>INSERT 0 1</code>; ⑤ lại lỗi "violated by some row". <code>NOT VALID</code> (bài 3.4) thêm ràng buộc <b>chỉ cho dòng mới và dòng bị sửa</b>, bỏ qua bước quét dữ liệu cũ — cách chuẩn để thêm quy tắc vào một bảng lớn đang chạy mà không khoá lâu, rồi <code>VALIDATE</code> sau khi đã sửa các dòng cũ. Nó không tắt ràng buộc (phương án 2) cũng không đụng tới dòng cũ (phương án 3). Và CHECK cho qua khi biểu thức ra NULL — chỉ <code>false</code> mới bị từ chối — nên ④ được nhận; phương án 4 áp logic của <code>WHERE</code> vào ràng buộc. Nếu cần cấm discount bị thiếu thì đó là việc của <code>NOT NULL</code>.',
    ),
  }),

  // ── Chương 4 — Chèn & truy vấn ──────────────────────────────────────────
  mcq({
    prompt: B(
      'You want each customer\'s latest order. The first statement works; the second fails. Why?' + code(
        'SELECT DISTINCT ON (customer_id) customer_id, id, created_at\n' +
        'FROM orders WHERE customer_id IN (7, 8)\n' +
        'ORDER BY customer_id, created_at DESC;          -- 2 rows: 7 → 981, 8 → 1040\n' +
        '\n' +
        'SELECT DISTINCT ON (customer_id) customer_id, id, created_at\n' +
        'FROM orders WHERE customer_id IN (7, 8)\n' +
        'ORDER BY created_at DESC;\n' +
        '-- ERROR:  SELECT DISTINCT ON expressions must match initial ORDER BY expressions',
      ),
      'Bạn cần đơn mới nhất của mỗi khách. Câu thứ nhất chạy; câu thứ hai lỗi. Vì sao?' + code(
        'SELECT DISTINCT ON (customer_id) customer_id, id, created_at\n' +
        'FROM orders WHERE customer_id IN (7, 8)\n' +
        'ORDER BY customer_id, created_at DESC;          -- 2 rows: 7 → 981, 8 → 1040\n' +
        '\n' +
        'SELECT DISTINCT ON (customer_id) customer_id, id, created_at\n' +
        'FROM orders WHERE customer_id IN (7, 8)\n' +
        'ORDER BY created_at DESC;\n' +
        '-- ERROR:  SELECT DISTINCT ON expressions must match initial ORDER BY expressions',
      ),
    ),
    options: [
      B('<code>DISTINCT ON</code> cannot be combined with <code>DESC</code>; the first query only worked because <code>customer_id</code> is ascending', '<code>DISTINCT ON</code> không đi được với <code>DESC</code>; câu đầu chạy chỉ vì <code>customer_id</code> tăng dần'),
      B('The second query would be valid in a newer PostgreSQL; 17 still requires the legacy syntax', 'Câu thứ hai sẽ hợp lệ ở bản PostgreSQL mới hơn; bản 17 vẫn đòi cú pháp cũ'),
      B('It keeps the first row of each group, so rows must arrive grouped by the <code>DISTINCT ON</code> key first; the rest of <code>ORDER BY</code> then decides which row is "first"', 'Nó giữ dòng ĐẦU TIÊN của mỗi nhóm, nên các dòng phải tới theo nhóm của khoá <code>DISTINCT ON</code> trước; phần còn lại của <code>ORDER BY</code> mới quyết định dòng nào là "đầu tiên"'),
      B('<code>DISTINCT ON</code> requires an index on <code>(customer_id, created_at)</code>; without one PostgreSQL refuses the second ordering', '<code>DISTINCT ON</code> cần chỉ mục trên <code>(customer_id, created_at)</code>; không có thì PostgreSQL từ chối thứ tự thứ hai'),
    ],
    correct: 2,
    explanation: EX(
      '<code>DISTINCT ON (expr)</code> is PostgreSQL\'s "first row per group" (lesson 4.3). It works on a sorted stream: it keeps a row whenever the key changes. That only means something if equal keys are adjacent, so the key must lead the <code>ORDER BY</code>; whatever follows (<code>created_at DESC</code>) decides which row of each group comes first — here the latest order, 981 for customer 7 and 1040 for customer 8. In the second query the rows would be sorted by time with customers interleaved, so "first per customer" has no defined meaning, and PostgreSQL refuses rather than guessing. Option 1 is wrong — <code>DESC</code> is fine after the key (and on the key). Option 2 invents a future version. Option 4 confuses semantics with performance: an index can speed it up but is never required. For a portable top-1-per-group, use <code>row_number()</code> (Chapter 8).',
      '<code>DISTINCT ON (biểu thức)</code> là cách "lấy dòng đầu mỗi nhóm" riêng của PostgreSQL (bài 4.3). Nó làm việc trên một dòng chảy đã sắp xếp: giữ một dòng mỗi khi khoá đổi. Điều đó chỉ có nghĩa nếu các khoá bằng nhau nằm cạnh nhau, nên khoá phải đứng đầu <code>ORDER BY</code>; phần đi sau (<code>created_at DESC</code>) quyết định dòng nào của mỗi nhóm đứng đầu — ở đây là đơn mới nhất, 981 với khách 7 và 1040 với khách 8. Ở câu thứ hai, các dòng sẽ sắp theo thời gian với các khách xen kẽ nhau, nên "dòng đầu của mỗi khách" không có nghĩa xác định, và PostgreSQL từ chối thay vì đoán. Phương án 1 sai — <code>DESC</code> sau khoá (và cả trên khoá) đều được. Phương án 2 bịa ra một phiên bản tương lai. Phương án 4 nhầm ngữ nghĩa với hiệu năng: chỉ mục có thể làm nhanh hơn nhưng không bao giờ bắt buộc. Muốn lấy top-1 mỗi nhóm theo cách dùng được ở mọi hệ, dùng <code>row_number()</code> (Chương 8).',
    ),
  }),

  mcq({
    prompt: B(
      'A September report on <code>orders.created_at</code> (a <code>timestamptz</code>), session in Vietnam time. Measured on CT Shop: A returns <b>91</b>, B returns <b>95</b>. Why?' + code(
        "SELECT count(*) FROM orders WHERE created_at BETWEEN '2026-09-01' AND '2026-09-30';            -- A: 91\n" +
        "SELECT count(*) FROM orders WHERE created_at >= '2026-09-01' AND created_at < '2026-10-01';   -- B: 95",
      ),
      'Báo cáo tháng 9 trên <code>orders.created_at</code> (kiểu <code>timestamptz</code>), phiên đặt giờ Việt Nam. Đo trên CT Shop: A ra <b>91</b>, B ra <b>95</b>. Vì sao?' + code(
        "SELECT count(*) FROM orders WHERE created_at BETWEEN '2026-09-01' AND '2026-09-30';            -- A: 91\n" +
        "SELECT count(*) FROM orders WHERE created_at >= '2026-09-01' AND created_at < '2026-10-01';   -- B: 95",
      ),
    ),
    options: [
      B('<code>BETWEEN</code> excludes both ends, so orders exactly at midnight on 1 September are lost', '<code>BETWEEN</code> loại cả hai đầu mút, nên các đơn đúng nửa đêm 1/9 bị mất'),
      B('<code>\'2026-09-30\'</code> is midnight at the start of 30 September, so A misses the 4 orders placed later that day', '<code>\'2026-09-30\'</code> là nửa đêm đầu ngày 30/9, nên A bỏ sót 4 đơn đặt sau đó trong ngày'),
      B('B double-counts orders placed at exactly midnight on 1 October', 'B đếm trùng các đơn đặt đúng nửa đêm 1/10'),
      B('<code>BETWEEN</code> compares in UTC while <code>&gt;=</code> compares in the session time zone', '<code>BETWEEN</code> so sánh theo UTC còn <code>&gt;=</code> so sánh theo múi giờ của phiên'),
    ],
    correct: 1,
    explanation: EX(
      'A date literal compared with a timestamp becomes <code>2026-09-30 00:00:00+07</code>, so <code>BETWEEN \'2026-09-01\' AND \'2026-09-30\'</code> stops at the very first instant of the last day. Measured: 4 orders were placed on 30 September after midnight, exactly the gap between 91 and 95. The habit from lesson 4.2 (and every lab since) is the <b>half-open range</b> <code>&gt;= start AND &lt; next start</code>: no end-of-day arithmetic, no <code>23:59:59.999</code>, no gaps or overlaps between consecutive months, and it works the same for dates, timestamps and partitions (15.4). Option 1 is backwards — <code>BETWEEN</code> is inclusive at both ends. Option 3: <code>&lt; \'2026-10-01\'</code> excludes that instant. Option 4: both forms convert the literal in the session time zone.',
      'Một hằng ngày đem so với timestamp sẽ thành <code>2026-09-30 00:00:00+07</code>, nên <code>BETWEEN \'2026-09-01\' AND \'2026-09-30\'</code> dừng ở đúng khoảnh khắc ĐẦU TIÊN của ngày cuối. Đo thật: có 4 đơn đặt trong ngày 30/9 sau nửa đêm, đúng bằng chênh lệch 91 và 95. Thói quen từ bài 4.2 (và mọi lab về sau) là <b>khoảng nửa mở</b> <code>&gt;= mốc đầu AND &lt; mốc kế tiếp</code>: không phải tính cuối ngày, không <code>23:59:59.999</code>, không hở hay chồng giữa hai tháng liền nhau, và dùng y hệt cho ngày, timestamp và phân mảnh (15.4). Phương án 1 ngược — <code>BETWEEN</code> bao gồm cả hai đầu. Phương án 3: <code>&lt; \'2026-10-01\'</code> đã loại khoảnh khắc đó. Phương án 4: cả hai dạng đều đổi hằng theo múi giờ của phiên.',
    ),
  }),

  // ── Chương 5 — JOIN ─────────────────────────────────────────────────────
  mcq({
    prompt: B(
      'CT Shop\'s <code>category</code> table has 12 rows: 4 roots and 8 sub-categories (<code>parent_id</code> is NULL for the roots). How many rows does each self-join return?' + code(
        'SELECT count(*) FROM category c JOIN      category p ON p.id = c.parent_id;   -- A\n' +
        'SELECT count(*) FROM category c LEFT JOIN category p ON p.id = c.parent_id;   -- B',
      ),
      'Bảng <code>category</code> của CT Shop có 12 dòng: 4 gốc và 8 danh mục con (<code>parent_id</code> của gốc là NULL). Mỗi phép self-join trả về bao nhiêu dòng?' + code(
        'SELECT count(*) FROM category c JOIN      category p ON p.id = c.parent_id;   -- A\n' +
        'SELECT count(*) FROM category c LEFT JOIN category p ON p.id = c.parent_id;   -- B',
      ),
    ),
    options: [
      B('A = 12, B = 12 — every category is joined to something, a root to itself', 'A = 12, B = 12 — danh mục nào cũng được nối với một dòng nào đó, gốc thì nối với chính nó'),
      B('A = 8, B = 12 — the four roots have no parent; only the LEFT JOIN keeps them, with NULL in the parent columns', 'A = 8, B = 12 — bốn gốc không có cha; chỉ LEFT JOIN giữ lại chúng, với NULL ở các cột của cha'),
      B('A = 4, B = 12 — the inner join returns the parents, the outer join returns everything', 'A = 4, B = 12 — phép join trong trả về các cha, phép join ngoài trả về tất cả'),
      B('A = 8, B = 16 — the LEFT JOIN adds a NULL row for every parent as well', 'A = 8, B = 16 — LEFT JOIN thêm một dòng NULL cho mỗi cha nữa'),
    ],
    correct: 1,
    explanation: EX(
      'Measured: 8 and 12. A self-join is an ordinary join between two copies of the same table under different aliases (lesson 5.3): <code>c</code> is the child, <code>p</code> its parent. For a root, <code>c.parent_id</code> is NULL, <code>p.id = NULL</code> is never true, so the inner join drops the four roots — 8 rows. The LEFT JOIN keeps every row of the left side; the four roots come back with <code>p.name</code> NULL (for example <code>Bút &amp; mực | (empty)</code> next to <code>Bút bi | Bút &amp; mực</code>). Option 3 counts the wrong side: the join has one row per <i>child</i>. Option 4 misreads LEFT JOIN — it pads unmatched <i>left</i> rows, it never adds rows for the right side. A "category with its parent name" screen therefore needs the LEFT JOIN, or the roots silently disappear.',
      'Đo thật: 8 và 12. Self-join là một phép join bình thường giữa hai bản của cùng một bảng với hai bí danh khác nhau (bài 5.3): <code>c</code> là con, <code>p</code> là cha của nó. Với một gốc, <code>c.parent_id</code> là NULL, <code>p.id = NULL</code> không bao giờ đúng, nên phép join trong loại bốn gốc — còn 8 dòng. LEFT JOIN giữ mọi dòng của vế trái; bốn gốc quay lại với <code>p.name</code> NULL (ví dụ <code>Bút &amp; mực | (trống)</code> bên cạnh <code>Bút bi | Bút &amp; mực</code>). Phương án 3 đếm nhầm vế: phép join có một dòng cho mỗi <i>con</i>. Phương án 4 hiểu sai LEFT JOIN — nó đệm các dòng <i>vế trái</i> không khớp, không bao giờ thêm dòng cho vế phải. Một màn hình "danh mục kèm tên cha" vì thế cần LEFT JOIN, không thì các gốc lặng lẽ biến mất.',
    ),
  }),

  mcq({
    prompt: B(
      'An old-style comma join on CT Shop (753 orders are <code>paid</code>, 300 customers). What does it return, and what went wrong?' + code(
        "SELECT count(*) FROM orders o, customer c WHERE o.status = 'paid';",
      ),
      'Một phép join kiểu dấu phẩy đời cũ trên CT Shop (753 đơn <code>paid</code>, 300 khách). Nó trả về gì, và sai ở đâu?' + code(
        "SELECT count(*) FROM orders o, customer c WHERE o.status = 'paid';",
      ),
    ),
    options: [
      B('753 — the comma is shorthand for an inner join on the foreign key', '753 — dấu phẩy là cách viết tắt của inner join theo khoá ngoại'),
      B('An error — PostgreSQL refuses a join without an <code>ON</code> clause', 'Lỗi — PostgreSQL từ chối phép join không có mệnh đề <code>ON</code>'),
      B('300 — one row per customer, because the customer table is listed last', '300 — mỗi khách một dòng, vì bảng customer được liệt kê sau cùng'),
      B('225,900 — without a join condition the comma is a CROSS JOIN (753 × 300)', '225.900 — không có điều kiện nối thì dấu phẩy là CROSS JOIN (753 × 300)'),
    ],
    correct: 3,
    explanation: EX(
      'Measured: <code>225900</code>; with <code>JOIN customer c ON c.id = o.customer_id</code> it is <code>753</code>. The comma in <code>FROM</code> is the Cartesian product, and the only thing that turns it into a join is a condition in <code>WHERE</code> — forget it and nothing complains (lesson 5.4\'s first join trap). PostgreSQL never infers a join from a foreign key (option 1), and it accepts the comma syntax happily (option 2). Option 3 has no basis at all. The explicit <code>JOIN … ON</code> form exists precisely so the join condition lives next to the table it belongs to and cannot be lost while editing the filters; on real tables the mistake is not a wrong number but a query that never finishes.',
      'Đo thật: <code>225900</code>; với <code>JOIN customer c ON c.id = o.customer_id</code> thì ra <code>753</code>. Dấu phẩy trong <code>FROM</code> là tích Descartes, và thứ duy nhất biến nó thành một phép join là điều kiện trong <code>WHERE</code> — quên nó thì chẳng có gì báo (cạm bẫy join đầu tiên của bài 5.4). PostgreSQL không bao giờ tự suy ra phép join từ khoá ngoại (phương án 1), và nó chấp nhận cú pháp dấu phẩy vui vẻ (phương án 2). Phương án 3 hoàn toàn không có cơ sở. Dạng <code>JOIN … ON</code> tường minh tồn tại chính là để điều kiện nối nằm cạnh bảng của nó và không thể bị mất khi sửa phần lọc; trên bảng thật, lỗi này không cho ra con số sai mà cho ra một truy vấn không bao giờ chạy xong.',
    ),
  }),

  mcq({
    prompt: B(
      'A colleague shortens a join with <code>USING (id)</code>. Both counts are 1,663 — the number of payments — so the review passes. Measured on CT Shop:' + code(
        'SELECT count(*) FROM orders JOIN payment USING (id);                -- 1663\n' +
        'SELECT count(*) FROM orders o JOIN payment p ON p.order_id = o.id;  -- 1663\n' +
        '\n' +
        'SELECT count(*) FILTER (WHERE p.order_id <> o.id) AS wrong_pairs\n' +
        'FROM orders o JOIN payment p ON p.id = o.id;                        -- 1662',
      ),
      'Một đồng nghiệp rút gọn phép join bằng <code>USING (id)</code>. Cả hai số đếm đều là 1.663 — đúng bằng số lần thanh toán — nên bản review được duyệt. Đo trên CT Shop:' + code(
        'SELECT count(*) FROM orders JOIN payment USING (id);                -- 1663\n' +
        'SELECT count(*) FROM orders o JOIN payment p ON p.order_id = o.id;  -- 1663\n' +
        '\n' +
        'SELECT count(*) FILTER (WHERE p.order_id <> o.id) AS wrong_pairs\n' +
        'FROM orders o JOIN payment p ON p.id = o.id;                        -- 1662',
      ),
    ),
    options: [
      B('Nothing is wrong: equal counts prove the two joins are equivalent', 'Không có gì sai: số đếm bằng nhau chứng minh hai phép join tương đương'),
      B('It joins <code>orders.id = payment.id</code>, not <code>order_id</code>: 1,662 pairs are wrong and the count matched by chance', 'Nó nối <code>orders.id = payment.id</code>, không phải <code>order_id</code>: 1.662 cặp sai, số đếm khớp chỉ là tình cờ'),
      B('<code>USING</code> only works when the column is a foreign key, so PostgreSQL silently fell back to the <code>order_id</code> relationship', '<code>USING</code> chỉ chạy khi cột là khoá ngoại, nên PostgreSQL lặng lẽ quay về quan hệ <code>order_id</code>'),
      B('<code>USING (id)</code> is a cross join limited to the smaller table, which is why it returned exactly 1,663 rows', '<code>USING (id)</code> là một phép cross join giới hạn theo bảng nhỏ hơn, nên mới ra đúng 1.663 dòng'),
    ],
    correct: 1,
    explanation: EX(
      '<code>USING (col)</code> (lesson 5.1) means "equal on the column that has this name in both tables" — nothing more. Both tables have a column called <code>id</code>, but they mean different things: an order number and a payment number. Payment ids run 1…1,663 and order ids 1…2,000, so every payment finds <i>an</i> order with the same number and the count looks perfect; the measured <code>wrong_pairs = 1662</code> shows only one pair is accidentally right. PostgreSQL does not consult foreign keys for <code>USING</code> (option 3) and it is an ordinary equi-join, not a cross join (option 4). The lesson behind option 1: a matching row count is not evidence of correctness — check the pairs, or name the columns. <code>USING</code> is safe when the shared column genuinely means the same thing, such as <code>USING (order_id)</code> between <code>order_item</code> and <code>payment</code>.',
      '<code>USING (cột)</code> (bài 5.1) nghĩa là "bằng nhau trên cột mang tên này ở cả hai bảng" — không hơn. Cả hai bảng đều có cột tên <code>id</code>, nhưng nghĩa khác nhau: số đơn và số thanh toán. Id thanh toán chạy từ 1…1.663 còn id đơn 1…2.000, nên khoản thanh toán nào cũng tìm được <i>một</i> đơn cùng số và số đếm trông hoàn hảo; <code>wrong_pairs = 1662</code> đo được cho thấy chỉ một cặp tình cờ đúng. PostgreSQL không xem khoá ngoại khi xử lý <code>USING</code> (phương án 3) và đây là phép nối bằng thông thường chứ không phải cross join (phương án 4). Bài học đằng sau phương án 1: số dòng khớp không phải bằng chứng đúng — hãy kiểm các cặp, hoặc gọi đích danh cột. <code>USING</code> an toàn khi cột chung thật sự cùng nghĩa, như <code>USING (order_id)</code> giữa <code>order_item</code> và <code>payment</code>.',
    ),
  }),

  // ── Chương 6 — Tổng hợp & gom nhóm ──────────────────────────────────────
  mcq({
    prompt: B(
      'Run on PostgreSQL 17: the first statement fails, the second runs. What is the difference?' + code(
        'SELECT c.city, c.full_name, count(o.id)\n' +
        'FROM customer c LEFT JOIN orders o ON o.customer_id = c.id\n' +
        'GROUP BY c.city;\n' +
        '-- ERROR:  column "c.full_name" must appear in the GROUP BY clause or be used in an aggregate function\n' +
        '\n' +
        'SELECT c.id, c.full_name, count(o.id) AS orders\n' +
        'FROM customer c LEFT JOIN orders o ON o.customer_id = c.id\n' +
        'GROUP BY c.id;                      -- runs: one row per customer',
      ),
      'Chạy trên PostgreSQL 17: câu đầu lỗi, câu sau chạy được. Khác nhau ở đâu?' + code(
        'SELECT c.city, c.full_name, count(o.id)\n' +
        'FROM customer c LEFT JOIN orders o ON o.customer_id = c.id\n' +
        'GROUP BY c.city;\n' +
        '-- ERROR:  column "c.full_name" must appear in the GROUP BY clause or be used in an aggregate function\n' +
        '\n' +
        'SELECT c.id, c.full_name, count(o.id) AS orders\n' +
        'FROM customer c LEFT JOIN orders o ON o.customer_id = c.id\n' +
        'GROUP BY c.id;                      -- runs: one row per customer',
      ),
    ),
    options: [
      B('Grouping by the primary key determines <code>full_name</code> for each group; grouping by city does not', 'Gom theo khoá chính thì <code>full_name</code> đã xác định cho mỗi nhóm; gom theo thành phố thì không'),
      B('PostgreSQL only enforces the rule when the grouped column is text; <code>c.id</code> is a number', 'PostgreSQL chỉ áp quy tắc khi cột gom nhóm là chữ; <code>c.id</code> là số'),
      B('The second query works only because no two customers share a name in this data; add a duplicate and it fails', 'Câu thứ hai chạy được chỉ vì trong dữ liệu này không có hai khách trùng tên; thêm một người trùng là nó lỗi'),
      B('The first query fails because of the LEFT JOIN; with an inner join PostgreSQL would pick any name for each city, like MySQL', 'Câu đầu lỗi vì LEFT JOIN; với inner join PostgreSQL sẽ chọn đại một tên cho mỗi thành phố, như MySQL'),
    ],
    correct: 0,
    explanation: EX(
      'After <code>GROUP BY</code>, each output row stands for a whole group, so every column in <code>SELECT</code> must have one value per group (lesson 6.2). For <code>city</code>, <code>full_name</code> has 54–65 values per group — the error is the database refusing to pick one at random. PostgreSQL recognises <b>functional dependency</b> on a primary key: once you group by <code>customer.id</code>, every other column of <code>customer</code> is determined, so <code>c.full_name</code> is allowed without listing it. That is a property of the constraint, checked at parse time, not of the data (option 3 is wrong), and it has nothing to do with column types (option 2). Option 4 describes MySQL with <code>ONLY_FULL_GROUP_BY</code> switched off — PostgreSQL never picks an arbitrary value, whatever the join type.',
      'Sau <code>GROUP BY</code>, mỗi dòng output đại diện cho cả một nhóm, nên mọi cột trong <code>SELECT</code> phải có một giá trị cho mỗi nhóm (bài 6.2). Với <code>city</code>, <code>full_name</code> có 54–65 giá trị mỗi nhóm — lỗi kia là cơ sở dữ liệu từ chối chọn bừa một cái. PostgreSQL nhận ra <b>phụ thuộc hàm</b> vào khoá chính: một khi bạn gom theo <code>customer.id</code>, mọi cột khác của <code>customer</code> đã được xác định, nên <code>c.full_name</code> được phép mà không cần liệt kê. Đó là thuộc tính của RÀNG BUỘC, kiểm lúc phân tích câu lệnh, không phải của dữ liệu (phương án 3 sai), và chẳng liên quan gì tới kiểu cột (phương án 2). Phương án 4 mô tả MySQL khi tắt <code>ONLY_FULL_GROUP_BY</code> — PostgreSQL không bao giờ chọn đại một giá trị, dù join kiểu gì.',
    ),
  }),

  mcq({
    prompt: B(
      'Run on PostgreSQL 17: the first statement fails. Which rewrite is the correct fix?' + code(
        'SELECT city, count(*) AS n FROM customer GROUP BY city HAVING n > 60;\n' +
        '-- ERROR:  column "n" does not exist',
      ),
      'Chạy trên PostgreSQL 17: câu dưới đây lỗi. Cách viết lại nào là cách sửa đúng?' + code(
        'SELECT city, count(*) AS n FROM customer GROUP BY city HAVING n > 60;\n' +
        '-- ERROR:  column "n" does not exist',
      ),
    ),
    options: [
      B('Move the condition to <code>WHERE n &gt; 60</code> — aliases are visible there', 'Chuyển điều kiện sang <code>WHERE n &gt; 60</code> — bí danh nhìn thấy được ở đó'),
      B('Quote the alias: <code>HAVING "n" &gt; 60</code>', 'Đặt bí danh trong ngoặc kép: <code>HAVING "n" &gt; 60</code>'),
      B('<code>HAVING count(*) &gt; 60</code> — the alias does not exist yet when <code>HAVING</code> runs', '<code>HAVING count(*) &gt; 60</code> — lúc <code>HAVING</code> chạy, bí danh chưa tồn tại'),
      B('Wrap <code>count(*)</code> in <code>FILTER (WHERE count(*) &gt; 60)</code> so the filter happens inside the aggregate', 'Bọc <code>count(*)</code> trong <code>FILTER (WHERE count(*) &gt; 60)</code> để việc lọc diễn ra bên trong hàm tổng hợp'),
    ],
    correct: 2,
    explanation: EX(
      'Logical order (lesson 6.3): <code>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY</code>. The alias <code>n</code> is born in <code>SELECT</code>, so <code>HAVING</code> — which runs earlier — cannot see it, while <code>ORDER BY</code> can. Measured: <code>HAVING count(*) &gt; 60 ORDER BY n DESC</code> returns Cần Thơ 65, Hải Phòng 64, Đà Nẵng 61. Option 1 is worse: <code>WHERE</code> runs before grouping, so neither the alias nor any aggregate is allowed there. Option 2 quotes an identifier that still does not exist at that stage. Option 4 is invalid — <code>FILTER</code> restricts which <i>rows</i> feed one aggregate, and aggregates cannot be nested. (MySQL accepts aliases in <code>HAVING</code> as an extension; it is one of the habits to unlearn when moving to PostgreSQL.)',
      'Thứ tự logic (bài 6.3): <code>FROM → WHERE → GROUP BY → HAVING → SELECT → ORDER BY</code>. Bí danh <code>n</code> ra đời ở <code>SELECT</code>, nên <code>HAVING</code> — chạy trước đó — không thấy nó, còn <code>ORDER BY</code> thì thấy. Đo thật: <code>HAVING count(*) &gt; 60 ORDER BY n DESC</code> ra Cần Thơ 65, Hải Phòng 64, Đà Nẵng 61. Phương án 1 còn tệ hơn: <code>WHERE</code> chạy trước khi gom nhóm, nên ở đó cả bí danh lẫn mọi hàm tổng hợp đều bị cấm. Phương án 2 đặt ngoặc kép cho một định danh mà ở chặng đó vẫn chưa tồn tại. Phương án 4 không hợp lệ — <code>FILTER</code> giới hạn những <i>dòng</i> đi vào một hàm tổng hợp, và hàm tổng hợp không lồng được vào nhau. (MySQL chấp nhận bí danh trong <code>HAVING</code> như một phần mở rộng; đó là một thói quen phải bỏ khi chuyển sang PostgreSQL.)',
    ),
  }),

  mcq({
    prompt: B(
      'No payment has been made after 2030, so the filter matches zero rows. Run on PostgreSQL 17, which output is right?' + code(
        'SELECT count(*) AS n, count(amount) AS n_amount, sum(amount) AS total,\n' +
        '       max(amount) AS biggest, coalesce(sum(amount), 0) AS total0\n' +
        "FROM payment WHERE paid_at >= '2030-01-01';",
      ),
      'Chưa có lần thanh toán nào sau năm 2030, nên điều kiện lọc khớp không dòng nào. Chạy trên PostgreSQL 17, output nào đúng?' + code(
        'SELECT count(*) AS n, count(amount) AS n_amount, sum(amount) AS total,\n' +
        '       max(amount) AS biggest, coalesce(sum(amount), 0) AS total0\n' +
        "FROM payment WHERE paid_at >= '2030-01-01';",
      ),
    ),
    options: [
      B('No row at all — an aggregate over an empty set returns an empty result', 'Không có dòng nào — hàm tổng hợp trên tập rỗng trả về kết quả rỗng'),
      B('One row: <code>0 | 0 | 0 | 0 | 0</code> — every aggregate starts from zero', 'Một dòng: <code>0 | 0 | 0 | 0 | 0</code> — hàm tổng hợp nào cũng bắt đầu từ số 0'),
      B('One row: <code>0 | NULL | NULL | NULL | 0</code> — <code>count(amount)</code> is NULL because no amount was seen', 'Một dòng: <code>0 | NULL | NULL | NULL | 0</code> — <code>count(amount)</code> là NULL vì chưa thấy khoản tiền nào'),
      B('One row: <code>0 | 0 | NULL | NULL | 0</code> — only <code>count</code> gives 0 on no rows', 'Một dòng: <code>0 | 0 | NULL | NULL | 0</code> — chỉ <code>count</code> ra 0 khi không có dòng nào'),
    ],
    correct: 3,
    explanation: EX(
      'Measured: <code>0 | 0 | (empty) | (empty) | 0</code>. Without <code>GROUP BY</code> an aggregate query always returns exactly one row, even over zero input rows — that is what makes "total revenue this month" safe to display (so option 1 is wrong; with a <code>GROUP BY</code> it would be zero rows). In that row, <code>count</code> is the only aggregate defined as 0 on empty input — both <code>count(*)</code> and <code>count(col)</code>, so option 3 is wrong. <code>sum</code>, <code>avg</code>, <code>max</code> and <code>min</code> of nothing are NULL, which is why dashboards show an empty cell, or why <code>revenue + 0</code> stays NULL in application code. Wrap them in <code>coalesce(…, 0)</code> deliberately (lesson 6.1) — option 2 assumes the database does it for you.',
      'Đo thật: <code>0 | 0 | (trống) | (trống) | 0</code>. Không có <code>GROUP BY</code> thì một truy vấn tổng hợp luôn trả về đúng một dòng, kể cả trên không dòng đầu vào nào — đó là điều khiến việc hiển thị "tổng doanh thu tháng này" an toàn (nên phương án 1 sai; có <code>GROUP BY</code> thì mới ra không dòng). Trong dòng đó, <code>count</code> là hàm tổng hợp duy nhất được định nghĩa bằng 0 trên đầu vào rỗng — cả <code>count(*)</code> lẫn <code>count(cột)</code>, nên phương án 3 sai. <code>sum</code>, <code>avg</code>, <code>max</code>, <code>min</code> của "không gì cả" là NULL, nên bảng điều khiển hiện ô trống, hay <code>revenue + 0</code> trong mã ứng dụng vẫn là NULL. Hãy chủ động bọc chúng trong <code>coalesce(…, 0)</code> (bài 6.1) — phương án 2 tưởng cơ sở dữ liệu làm giùm bạn.',
    ),
  }),

  // ── Chương 7 — Truy vấn con & CTE ───────────────────────────────────────
  mcq({
    prompt: B(
      'A scalar subquery in the select list. Customer 7 has 5 orders; customer 295 has none. Run on PostgreSQL 17:' + code(
        'SELECT c.id, (SELECT o.id FROM orders o WHERE o.customer_id = c.id) AS order_id\n' +
        'FROM customer c WHERE c.id = 7;      -- query A\n' +
        '-- … the same with c.id = 295         -- query B',
      ),
      'Một truy vấn con vô hướng trong danh sách SELECT. Khách 7 có 5 đơn; khách 295 không có đơn nào. Chạy trên PostgreSQL 17:' + code(
        'SELECT c.id, (SELECT o.id FROM orders o WHERE o.customer_id = c.id) AS order_id\n' +
        'FROM customer c WHERE c.id = 7;      -- truy vấn A\n' +
        '-- … y hệt với c.id = 295             -- truy vấn B',
      ),
    ),
    options: [
      B('A returns 5 rows, one per order, and B returns no row at all', 'A trả về 5 dòng, mỗi đơn một dòng, còn B không trả dòng nào'),
      B('A returns the lowest order id (an implicit <code>min</code>); B returns 0', 'A trả về id đơn nhỏ nhất (một <code>min</code> ngầm); B trả về 0'),
      B('A fails: <code>more than one row returned by a subquery…</code>; B returns <code>order_id</code> NULL', 'A lỗi: <code>more than one row returned by a subquery…</code>; B trả về <code>order_id</code> NULL'),
      B('Both fail: a correlated subquery is not allowed in the select list', 'Cả hai đều lỗi: truy vấn con tương quan không được đặt trong danh sách SELECT'),
    ],
    correct: 2,
    explanation: EX(
      'A subquery used where a single value is expected must yield at most one row (lesson 7.1). Zero rows is fine — it becomes NULL, which is exactly what B shows (<code>295 | (empty)</code>). More than one row is a run-time error, raised only when a customer actually has several orders — which is what makes this bug dangerous: it passes on test data where every customer has one order and breaks in production. Option 1 describes a join, not a scalar subquery. Option 2 invents an implicit <code>min</code> and a 0 default. Option 4 is wrong: correlated scalar subqueries in <code>SELECT</code> are legal and common. Fixes depend on intent: <code>(SELECT max(o.id) …)</code>, <code>ORDER BY … LIMIT 1</code> inside, or a join with <code>GROUP BY</code>.',
      'Một truy vấn con đặt ở chỗ cần một giá trị duy nhất thì phải cho ra nhiều nhất một dòng (bài 7.1). Không dòng nào thì được — nó thành NULL, đúng như B cho thấy (<code>295 | (trống)</code>). Nhiều hơn một dòng là lỗi lúc chạy, chỉ nổ khi có khách thật sự có nhiều đơn — đó là điều khiến lỗi này nguy hiểm: nó qua được dữ liệu thử nơi mỗi khách có một đơn rồi vỡ trên production. Phương án 1 mô tả một phép join, không phải truy vấn con vô hướng. Phương án 2 bịa ra một hàm <code>min</code> ngầm và mặc định 0. Phương án 4 sai: truy vấn con vô hướng tương quan trong <code>SELECT</code> là hợp lệ và hay dùng. Cách sửa tuỳ ý định: <code>(SELECT max(o.id) …)</code>, <code>ORDER BY … LIMIT 1</code> bên trong, hoặc một phép join kèm <code>GROUP BY</code>.',
    ),
  }),

  mcq({
    prompt: B(
      'Marketing wants the number of customers who ever bought product 34. Measured on CT Shop:' + code(
        'SELECT count(*) AS join_rows, count(DISTINCT c.id) AS distinct_customers\n' +
        'FROM customer c\n' +
        'JOIN orders o      ON o.customer_id = c.id\n' +
        'JOIN order_item oi ON oi.order_id = o.id\n' +
        'WHERE oi.product_id = 34;                    -- 99 | 83\n' +
        '\n' +
        'SELECT count(*) FROM customer c\n' +
        'WHERE EXISTS (SELECT 1 FROM orders o JOIN order_item oi ON oi.order_id = o.id\n' +
        '              WHERE o.customer_id = c.id AND oi.product_id = 34);   -- 83',
      ),
      'Bộ phận marketing cần số khách đã từng mua sản phẩm 34. Đo trên CT Shop:' + code(
        'SELECT count(*) AS join_rows, count(DISTINCT c.id) AS distinct_customers\n' +
        'FROM customer c\n' +
        'JOIN orders o      ON o.customer_id = c.id\n' +
        'JOIN order_item oi ON oi.order_id = o.id\n' +
        'WHERE oi.product_id = 34;                    -- 99 | 83\n' +
        '\n' +
        'SELECT count(*) FROM customer c\n' +
        'WHERE EXISTS (SELECT 1 FROM orders o JOIN order_item oi ON oi.order_id = o.id\n' +
        '              WHERE o.customer_id = c.id AND oi.product_id = 34);   -- 83',
      ),
    ),
    options: [
      B('99 is right: the join counts every purchase, and a customer who bought twice is worth counting twice', '99 mới đúng: phép join đếm mọi lần mua, và khách mua hai lần thì đáng được đếm hai lần'),
      B('83 — the join repeats a customer once per matching line; <code>EXISTS</code> keeps each customer once', '83 — phép join lặp lại một khách theo mỗi dòng khớp; <code>EXISTS</code> giữ mỗi khách đúng một lần'),
      B('The two differ because <code>EXISTS</code> ignores customers whose orders were cancelled', 'Hai số khác nhau vì <code>EXISTS</code> bỏ qua các khách có đơn bị huỷ'),
      B('83 is right, but only by luck: <code>EXISTS</code> stops at the first matching order, so it undercounts customers whose first order did not contain product 34', '83 đúng nhưng chỉ là may: <code>EXISTS</code> dừng ở đơn khớp đầu tiên, nên đếm thiếu những khách mà đơn đầu tiên không chứa sản phẩm 34'),
    ],
    correct: 1,
    explanation: EX(
      'The question is about <i>customers</i>, so the answer must have customer grain. The join produces one row per matching <b>order line</b>: 99 lines belong to 83 different customers — 14 bought product 34 in two orders and one in three. <code>count(DISTINCT c.id)</code> repairs the count after the fact; <code>EXISTS</code> (lesson 7.2) never creates the duplicates — it is a semi-join: each customer row is kept or not, once. Option 1 answers a different question (how many purchases). Option 3 is wrong — neither query filters on status. Option 4 misunderstands the short-circuit: <code>EXISTS</code> stops at the first row that satisfies the <i>whole</i> condition, including the product, so it is exact. When the subquery is the filter and you do not need its columns, <code>EXISTS</code> is the shape to reach for.',
      'Câu hỏi là về <i>khách hàng</i>, nên đáp án phải ở grain khách hàng. Phép join sinh ra một dòng cho mỗi <b>dòng đơn</b> khớp: 99 dòng thuộc về 83 khách khác nhau — 14 người mua sản phẩm 34 trong hai đơn và một người trong ba đơn. <code>count(DISTINCT c.id)</code> sửa số đếm sau khi đã lỡ; <code>EXISTS</code> (bài 7.2) không bao giờ sinh dòng trùng — nó là semi-join: mỗi dòng khách được giữ hoặc không, đúng một lần. Phương án 1 trả lời một câu hỏi khác (bao nhiêu lần mua). Phương án 3 sai — cả hai truy vấn đều không lọc theo trạng thái. Phương án 4 hiểu sai việc dừng sớm: <code>EXISTS</code> dừng ở dòng đầu tiên thoả <i>toàn bộ</i> điều kiện, kể cả điều kiện sản phẩm, nên nó chính xác. Khi truy vấn con chỉ để lọc và bạn không cần cột của nó, <code>EXISTS</code> là hình dạng nên dùng.',
    ),
  }),

  mcq({
    prompt: B(
      'A recursive CTE over a table whose <code>name</code> column is <code>varchar(40)</code>. Run on PostgreSQL 17:' + code(
        'WITH RECURSIVE t AS (\n' +
        '  SELECT id, name AS path FROM fe2.cat WHERE parent_id IS NULL\n' +
        '  UNION ALL\n' +
        "  SELECT c.id, t.path || ' > ' || c.name FROM fe2.cat c JOIN t ON c.parent_id = t.id\n" +
        ')\n' +
        'SELECT * FROM t;\n' +
        '-- ERROR:  recursive query "t" column 2 has type character varying(40) in non-recursive term\n' +
        '--         but type character varying overall\n' +
        '-- HINT:  Cast the output of the non-recursive term to the correct type.',
      ),
      'Một CTE đệ quy trên bảng có cột <code>name</code> kiểu <code>varchar(40)</code>. Chạy trên PostgreSQL 17:' + code(
        'WITH RECURSIVE t AS (\n' +
        '  SELECT id, name AS path FROM fe2.cat WHERE parent_id IS NULL\n' +
        '  UNION ALL\n' +
        "  SELECT c.id, t.path || ' > ' || c.name FROM fe2.cat c JOIN t ON c.parent_id = t.id\n" +
        ')\n' +
        'SELECT * FROM t;\n' +
        '-- ERROR:  recursive query "t" column 2 has type character varying(40) in non-recursive term\n' +
        '--         but type character varying overall\n' +
        '-- HINT:  Cast the output of the non-recursive term to the correct type.',
      ),
    ),
    options: [
      B('Change <code>UNION ALL</code> to <code>UNION</code>, which reconciles the column types of both terms', 'Đổi <code>UNION ALL</code> thành <code>UNION</code>, thứ sẽ tự hoà giải kiểu cột của hai vế'),
      B('The paths would exceed 40 characters, so PostgreSQL refuses in advance; shorten the separator', 'Các path sẽ dài quá 40 ký tự nên PostgreSQL từ chối trước; hãy rút ngắn dải phân cách'),
      B('Recursive CTEs cannot concatenate strings; build the path in the outer query instead', 'CTE đệ quy không nối chuỗi được; hãy dựng path ở truy vấn ngoài'),
      B('The anchor fixes the type as <code>varchar(40)</code> but the appended path is <code>varchar</code>; cast the anchor to <code>text</code>', 'Vế khởi đầu chốt kiểu là <code>varchar(40)</code> nhưng path sau khi nối là <code>varchar</code>; ép vế khởi đầu về <code>text</code>'),
    ],
    correct: 3,
    explanation: EX(
      'A recursive CTE is a working table whose column types are decided <b>once</b>, by the non-recursive (anchor) term, and every pass of the recursive term must produce exactly those types (lesson 7.4). <code>name</code> is <code>varchar(40)</code>; <code>t.path || \' > \' || c.name</code> is plain <code>varchar</code> (the length modifier is lost by concatenation), so the types disagree and PostgreSQL stops before running anything — the HINT even says what to do. Measured with <code>name::text</code>: three rows, <code>All</code>, <code>All &gt; Pens</code>, <code>All &gt; Pens &gt; Gel pens</code>. It is a type check, not a length check (option 2): no row was produced. <code>UNION</code> deduplicates but applies the same type rule (option 1). Option 3 is false — building paths by concatenation is the textbook use. On CT Shop the column is already <code>text</code>, which is why the same query there "just works" and the trap only bites on another schema.',
      'CTE đệ quy là một bảng làm việc mà kiểu cột được quyết định <b>một lần</b>, bởi vế không đệ quy (vế khởi đầu), và mỗi lượt của vế đệ quy phải sinh ra đúng các kiểu đó (bài 7.4). <code>name</code> là <code>varchar(40)</code>; <code>t.path || \' > \' || c.name</code> là <code>varchar</code> trơn (phép nối làm mất giới hạn độ dài), nên hai kiểu lệch nhau và PostgreSQL dừng trước khi chạy bất cứ thứ gì — HINT còn nói luôn cách sửa. Đo với <code>name::text</code>: ba dòng, <code>All</code>, <code>All &gt; Pens</code>, <code>All &gt; Pens &gt; Gel pens</code>. Đây là phép kiểm KIỂU, không phải kiểm độ dài (phương án 2): chưa có dòng nào được sinh ra. <code>UNION</code> có khử trùng nhưng áp đúng luật kiểu đó (phương án 1). Phương án 3 sai — dựng path bằng phép nối là cách dùng kinh điển. Trên CT Shop cột này vốn là <code>text</code>, nên ở đó cùng truy vấn "cứ thế chạy" và cái bẫy chỉ cắn khi sang một lược đồ khác.',
    ),
  }),

  // ── Chương 8 — Hàm cửa sổ ───────────────────────────────────────────────
  mcq({
    prompt: B(
      'The gap in days between each of customer 7\'s orders and the previous one. Measured on CT Shop — which reading of the output is right?' + code(
        'SELECT id, created_at::date AS d,\n' +
        '       created_at::date - lag(created_at::date) OVER (ORDER BY created_at) AS gap_days,\n' +
        '       lag(id, 1, 0) OVER (ORDER BY created_at) AS prev_id\n' +
        'FROM orders WHERE customer_id = 7 ORDER BY created_at;\n' +
        '--   id  |     d      | gap_days | prev_id\n' +
        '--   619 | 2025-06-24 |          |       0\n' +
        '--   371 | 2025-06-27 |        3 |     619\n' +
        '--   703 | 2026-01-06 |      193 |     371\n' +
        '--  1780 | 2026-01-16 |       10 |     703\n' +
        '--   981 | 2026-02-15 |       30 |    1780',
      ),
      'Số ngày giữa mỗi đơn của khách 7 với đơn trước đó. Đo trên CT Shop — cách đọc output nào đúng?' + code(
        'SELECT id, created_at::date AS d,\n' +
        '       created_at::date - lag(created_at::date) OVER (ORDER BY created_at) AS gap_days,\n' +
        '       lag(id, 1, 0) OVER (ORDER BY created_at) AS prev_id\n' +
        'FROM orders WHERE customer_id = 7 ORDER BY created_at;\n' +
        '--   id  |     d      | gap_days | prev_id\n' +
        '--   619 | 2025-06-24 |          |       0\n' +
        '--   371 | 2025-06-27 |        3 |     619\n' +
        '--   703 | 2026-01-06 |      193 |     371\n' +
        '--  1780 | 2026-01-16 |       10 |     703\n' +
        '--   981 | 2026-02-15 |       30 |    1780',
      ),
    ),
    options: [
      B('The output is wrong: order 371 has a lower id than 619, so <code>lag</code> should have treated 371 as the first order', 'Output sai: đơn 371 có id nhỏ hơn 619, nên <code>lag</code> lẽ ra phải coi 371 là đơn đầu tiên'),
      B('<code>lag()</code> follows the window order (time); the first row has no predecessor, so NULL — or the given default 0', '<code>lag()</code> đi theo thứ tự của cửa sổ (thời gian); dòng đầu không có dòng trước nên ra NULL — hoặc giá trị mặc định 0'),
      B('The empty <code>gap_days</code> is a bug — subtracting from NULL should give 0', '<code>gap_days</code> trống là lỗi — trừ với NULL lẽ ra phải ra 0'),
      B('<code>lag</code> needs <code>PARTITION BY customer_id</code> or it returns NULL on every row', '<code>lag</code> cần <code>PARTITION BY customer_id</code>, không thì nó trả NULL ở mọi dòng'),
    ],
    correct: 1,
    explanation: EX(
      '<code>lag(x)</code> returns <code>x</code> from the previous row <b>in the window\'s order</b> (lesson 8.3), and the window here orders by <code>created_at</code>: order 619 was placed on 24 June 2025, three days before order 371, so it is first. Ids are assigned at insert time and say nothing about business time (option 1). The first row has no predecessor: <code>lag</code> returns NULL, and <code>date - NULL</code> is NULL — arithmetic propagates NULL (option 3 wants it to be 0). The three-argument form <code>lag(id, 1, 0)</code> supplies a default for exactly that case. <code>PARTITION BY</code> is not required (option 4): the <code>WHERE</code> already restricts to one customer. Across all customers you would add <code>PARTITION BY customer_id</code> so one customer\'s first order is not compared with another\'s last.',
      '<code>lag(x)</code> trả về <code>x</code> của dòng trước <b>theo thứ tự của cửa sổ</b> (bài 8.3), mà cửa sổ ở đây sắp theo <code>created_at</code>: đơn 619 đặt ngày 24/6/2025, sớm hơn đơn 371 ba ngày, nên nó đứng đầu. Id được cấp lúc chèn và chẳng nói gì về thời gian nghiệp vụ (phương án 1). Dòng đầu không có dòng trước: <code>lag</code> trả về NULL, và <code>ngày - NULL</code> là NULL — phép tính lan truyền NULL (phương án 3 muốn nó là 0). Dạng ba đối số <code>lag(id, 1, 0)</code> cung cấp giá trị mặc định cho đúng trường hợp đó. <code>PARTITION BY</code> không bắt buộc (phương án 4): <code>WHERE</code> đã giới hạn về một khách. Khi chạy trên mọi khách, bạn sẽ thêm <code>PARTITION BY customer_id</code> để đơn đầu của khách này không bị so với đơn cuối của khách khác.',
    ),
  }),

  mcq({
    prompt: B(
      '<code>ntile(4)</code> over 10 products, ordered by id. Run on PostgreSQL 17, how many products land in each bucket?' + code(
        'SELECT g, count(*) AS rows_in_bucket FROM (\n' +
        '  SELECT ntile(4) OVER (ORDER BY id) AS g\n' +
        '  FROM product WHERE category_id IN (5, 6) AND id <= 10      -- 10 rows\n' +
        ') x GROUP BY g ORDER BY g;',
      ),
      '<code>ntile(4)</code> trên 10 sản phẩm, sắp theo id. Chạy trên PostgreSQL 17, mỗi nhóm có bao nhiêu sản phẩm?' + code(
        'SELECT g, count(*) AS rows_in_bucket FROM (\n' +
        '  SELECT ntile(4) OVER (ORDER BY id) AS g\n' +
        '  FROM product WHERE category_id IN (5, 6) AND id <= 10      -- 10 dòng\n' +
        ') x GROUP BY g ORDER BY g;',
      ),
    ),
    options: [
      B('3 · 3 · 2 · 2 — the buckets differ by at most one row, and the larger buckets come first', '3 · 3 · 2 · 2 — các nhóm chênh nhau nhiều nhất một dòng, và các nhóm lớn hơn đứng trước'),
      B('2 · 2 · 3 · 3 — the remainder goes to the last buckets', '2 · 2 · 3 · 3 — phần dư dồn về các nhóm cuối'),
      B('3 · 3 · 3 · 1 — buckets are filled to ceil(10/4) = 3 in turn', '3 · 3 · 3 · 1 — các nhóm lần lượt được lấp đầy tới ceil(10/4) = 3'),
      B('2 · 2 · 2 · 2 — the 2 leftover rows get bucket NULL and form a fifth group', '2 · 2 · 2 · 2 — 2 dòng dư nhận nhóm NULL và thành nhóm thứ năm'),
    ],
    correct: 0,
    explanation: EX(
      'Measured: buckets 1 to 4 hold 3, 3, 2, 2. <code>ntile(n)</code> (lesson 8.4) splits the ordered partition into <code>n</code> groups as equal as possible; 10 = 4 × 2 + 2, so the 2 extra rows go one each to the <b>first</b> two buckets. That rules out option 2 (remainder at the end), option 3 (fill-to-capacity, which would make the last bucket tiny) and option 4 (every row always gets a bucket). The practical point: <code>ntile(4)</code> gives quartiles by <i>row count</i>, not by value — two products with the same price can fall into different quartiles, so for "price bands" use explicit boundaries or <code>percent_rank()</code>.',
      'Đo thật: nhóm 1 tới 4 có 3, 3, 2, 2 dòng. <code>ntile(n)</code> (bài 8.4) chia phân vùng đã sắp xếp thành <code>n</code> nhóm đều nhất có thể; 10 = 4 × 2 + 2, nên 2 dòng dư được chia mỗi dòng cho một trong hai nhóm <b>đầu</b>. Điều đó loại phương án 2 (dư ở cuối), phương án 3 (lấp đầy theo sức chứa, khiến nhóm cuối bé xíu) và phương án 4 (dòng nào cũng luôn được xếp nhóm). Điểm thực tế: <code>ntile(4)</code> cho tứ phân vị theo <i>số dòng</i>, không theo giá trị — hai sản phẩm cùng giá có thể rơi vào hai tứ phân vị khác nhau, nên với "khoảng giá" hãy dùng ranh giới tường minh hoặc <code>percent_rank()</code>.',
    ),
  }),

  mcq({
    prompt: B(
      'An API returns one page of a customer\'s orders plus the total count, in a single query. Customer 7 has 5 orders. What is <code>total</code> on the two returned rows?' + code(
        'SELECT id, status, count(*) OVER () AS total\n' +
        'FROM orders WHERE customer_id = 7\n' +
        'ORDER BY id LIMIT 2;',
      ),
      'Một API trả về một trang đơn của khách kèm tổng số đơn, trong một truy vấn. Khách 7 có 5 đơn. Cột <code>total</code> trên hai dòng trả về là bao nhiêu?' + code(
        'SELECT id, status, count(*) OVER () AS total\n' +
        'FROM orders WHERE customer_id = 7\n' +
        'ORDER BY id LIMIT 2;',
      ),
    ),
    options: [
      B('2 on both rows — the window only sees the rows that survive <code>LIMIT</code>', '2 trên cả hai dòng — cửa sổ chỉ nhìn thấy những dòng còn lại sau <code>LIMIT</code>'),
      B('1 and 2 — <code>count(*) OVER ()</code> is a running count', '1 và 2 — <code>count(*) OVER ()</code> là phép đếm luỹ tiến'),
      B('5 on both rows — the window is computed before <code>LIMIT</code> runs', '5 trên cả hai dòng — cửa sổ được tính trước khi <code>LIMIT</code> chạy'),
      B('2000 — <code>OVER ()</code> ignores <code>WHERE</code> and counts the whole table', '2000 — <code>OVER ()</code> bỏ qua <code>WHERE</code> và đếm cả bảng'),
    ],
    correct: 2,
    explanation: EX(
      'Measured: <code>371 | shipped | 5</code> and <code>619 | shipped | 5</code>. A window function is an aggregate that does not collapse rows (lesson 8.1), and it is evaluated after <code>FROM</code>/<code>WHERE</code>/<code>GROUP BY</code> but <b>before</b> the final <code>ORDER BY</code> and <code>LIMIT</code>. <code>OVER ()</code> — no partition, no order — means "all rows of the result so far": the 5 orders of customer 7, not the 2 that <code>LIMIT</code> keeps (option 1), and not the whole table (option 4), because <code>WHERE</code> already ran. A running count (option 2) needs an <code>ORDER BY</code> inside <code>OVER</code>. This is the classic way to return "page + total" without a second <code>count(*)</code> round trip — with the caveat that the database still has to produce every matching row to count them.',
      'Đo thật: <code>371 | shipped | 5</code> và <code>619 | shipped | 5</code>. Hàm cửa sổ là một hàm tổng hợp không gộp dòng (bài 8.1), và nó được tính sau <code>FROM</code>/<code>WHERE</code>/<code>GROUP BY</code> nhưng <b>trước</b> <code>ORDER BY</code> và <code>LIMIT</code> cuối cùng. <code>OVER ()</code> — không phân vùng, không thứ tự — nghĩa là "mọi dòng của kết quả tới lúc này": 5 đơn của khách 7, không phải 2 dòng <code>LIMIT</code> giữ lại (phương án 1), cũng không phải cả bảng (phương án 4), vì <code>WHERE</code> đã chạy rồi. Phép đếm luỹ tiến (phương án 2) cần có <code>ORDER BY</code> bên trong <code>OVER</code>. Đây là cách kinh điển để trả "một trang + tổng số" mà không cần thêm một vòng <code>count(*)</code> riêng — kèm lưu ý là cơ sở dữ liệu vẫn phải sinh ra mọi dòng khớp thì mới đếm được.',
    ),
  }),

  // ── Chương 9 — Chỉ mục ──────────────────────────────────────────────────
  mcq({
    prompt: B(
      'A 200,000-row table in a database whose collation is <code>en_US.utf8</code>. With a plain B-tree on <code>email</code>, the equality search uses it and the prefix search does not. After adding a second index, the prefix search does. Measured on PostgreSQL 17:' + code(
        "CREATE INDEX big_email ON fe2.big (email);\n" +
        "... WHERE email = 'kh001234@ctshop.vn'   -- Index Scan using big_email\n" +
        "... WHERE email LIKE 'kh00123%'          -- Seq Scan, Filter: (email ~~ 'kh00123%')\n" +
        '\n' +
        'CREATE INDEX big_email_pattern ON fe2.big (email text_pattern_ops);\n' +
        "... WHERE email LIKE 'kh00123%'          -- Index Scan using big_email_pattern\n" +
        "                                          --   Index Cond: ((email ~>=~ 'kh00123') AND (email ~<~ 'kh00124'))\n" +
        "... WHERE email LIKE '%00123%'           -- Seq Scan",
      ),
      'Một bảng 200.000 dòng trong cơ sở dữ liệu có collation <code>en_US.utf8</code>. Với một B-tree thường trên <code>email</code>, phép tìm bằng dùng được nó còn phép tìm tiền tố thì không. Thêm một chỉ mục thứ hai, phép tìm tiền tố dùng được. Đo trên PostgreSQL 17:' + code(
        "CREATE INDEX big_email ON fe2.big (email);\n" +
        "... WHERE email = 'kh001234@ctshop.vn'   -- Index Scan using big_email\n" +
        "... WHERE email LIKE 'kh00123%'          -- Seq Scan, Filter: (email ~~ 'kh00123%')\n" +
        '\n' +
        'CREATE INDEX big_email_pattern ON fe2.big (email text_pattern_ops);\n' +
        "... WHERE email LIKE 'kh00123%'          -- Index Scan using big_email_pattern\n" +
        "                                          --   Index Cond: ((email ~>=~ 'kh00123') AND (email ~<~ 'kh00124'))\n" +
        "... WHERE email LIKE '%00123%'           -- Seq Scan",
      ),
    ),
    options: [
      B('<code>LIKE</code> can never use a B-tree; the second index works because <code>text_pattern_ops</code> turns it into a GIN index', '<code>LIKE</code> không bao giờ dùng được B-tree; chỉ mục thứ hai chạy được vì <code>text_pattern_ops</code> biến nó thành GIN'),
      B('The first index was not yet analysed; running <code>ANALYZE</code> would have made the prefix search use it', 'Chỉ mục đầu chưa được analyze; chạy <code>ANALYZE</code> thì phép tìm tiền tố đã dùng nó'),
      B('The planner chose a Seq Scan because 200,000 rows is too small for an index on a prefix', 'Bộ lập kế hoạch chọn Seq Scan vì 200.000 dòng là quá nhỏ cho chỉ mục trên tiền tố'),
      B('Under <code>en_US.utf8</code> a prefix is not a contiguous range of the B-tree; <code>text_pattern_ops</code> makes it one', 'Với <code>en_US.utf8</code> một tiền tố không phải khoảng liền trong B-tree; <code>text_pattern_ops</code> biến nó thành khoảng liền'),
    ],
    correct: 3,
    explanation: EX(
      'A B-tree can serve <code>LIKE \'abc%\'</code> only if every string starting with <code>abc</code> sits in one contiguous slice of the index. Under <code>en_US.utf8</code> the sort order follows linguistic rules (case, accents and punctuation are weighed in passes), so that is not guaranteed and PostgreSQL will not use the default index for it. <code>text_pattern_ops</code> (lesson 9.3) builds the index in plain byte order, where the prefix <i>is</i> a range — look at the rewritten <code>Index Cond</code>: <code>&gt;= \'kh00123\' AND &lt; \'kh00124\'</code>. A database created with the <code>C</code> collation would not need it. A leading wildcard has no range in any B-tree; that is trigram territory (13.4). Option 1 is wrong twice — a B-tree can serve <code>LIKE</code>, and the opclass does not change the index type. Option 2: the statistics were fresh. Option 3: equality on the same table did use the index.',
      'B-tree chỉ phục vụ được <code>LIKE \'abc%\'</code> nếu mọi chuỗi bắt đầu bằng <code>abc</code> nằm trong một lát liền của chỉ mục. Với <code>en_US.utf8</code> thứ tự sắp xếp theo luật ngôn ngữ (hoa thường, dấu, ký tự đặc biệt được cân theo nhiều lượt), nên điều đó không được bảo đảm và PostgreSQL không dùng chỉ mục mặc định cho nó. <code>text_pattern_ops</code> (bài 9.3) dựng chỉ mục theo thứ tự byte thuần, nơi tiền tố CHÍNH LÀ một khoảng — nhìn <code>Index Cond</code> đã được viết lại: <code>&gt;= \'kh00123\' AND &lt; \'kh00124\'</code>. Cơ sở dữ liệu tạo với collation <code>C</code> thì không cần nó. Ký tự đại diện ở đầu không có khoảng nào trong bất kỳ B-tree nào; đó là địa hạt của trigram (13.4). Phương án 1 sai hai lần — B-tree phục vụ được <code>LIKE</code>, và opclass không đổi loại chỉ mục. Phương án 2: thống kê đã mới. Phương án 3: phép so bằng trên cùng bảng đã dùng chỉ mục.',
    ),
  }),

  mcq({
    prompt: B(
      'An index-only scan, measured three times on PostgreSQL 17 (one week of rows, 10,080 of them):' + code(
        'CREATE INDEX big_created_amount ON fe2.big (created, amount);\n' +
        'VACUUM fe2.big;\n' +
        "-- ① Index Only Scan using big_created_amount … (actual rows=10080)   Heap Fetches: 0\n" +
        "UPDATE fe2.big SET amount = amount + 1 WHERE created >= '2025-03-01' AND created < '2025-03-08';\n" +
        "-- ② Index Only Scan using big_created_amount … (actual rows=10080)   Heap Fetches: 20160\n" +
        'VACUUM fe2.big;\n' +
        "-- ③ Index Only Scan using big_created_amount … (actual rows=10080)   Heap Fetches: 0",
      ),
      'Một lần quét chỉ-chỉ-mục, đo ba lần trên PostgreSQL 17 (một tuần dữ liệu, 10.080 dòng):' + code(
        'CREATE INDEX big_created_amount ON fe2.big (created, amount);\n' +
        'VACUUM fe2.big;\n' +
        "-- ① Index Only Scan using big_created_amount … (actual rows=10080)   Heap Fetches: 0\n" +
        "UPDATE fe2.big SET amount = amount + 1 WHERE created >= '2025-03-01' AND created < '2025-03-08';\n" +
        "-- ② Index Only Scan using big_created_amount … (actual rows=10080)   Heap Fetches: 20160\n" +
        'VACUUM fe2.big;\n' +
        "-- ③ Index Only Scan using big_created_amount … (actual rows=10080)   Heap Fetches: 0",
      ),
    ),
    options: [
      B('The index was corrupted by the UPDATE, and VACUUM rebuilt it', 'UPDATE làm hỏng chỉ mục, và VACUUM đã dựng lại nó'),
      B('The UPDATE cleared the pages’ all-visible bits, so each entry needed a visibility check in the table until VACUUM', 'UPDATE xoá bit all-visible của các trang, nên mỗi mục phải kiểm tính nhìn thấy trong bảng cho tới khi VACUUM'),
      B('Heap Fetches counts cache misses; the second run read from disk because the UPDATE evicted the index', 'Heap Fetches đếm số lần trượt bộ đệm; lần chạy thứ hai đọc từ đĩa vì UPDATE đẩy chỉ mục ra khỏi bộ đệm'),
      B('After an UPDATE an index-only scan returns each row twice until VACUUM, which is why 10,080 became 20,160', 'Sau UPDATE, quét chỉ-chỉ-mục trả mỗi dòng hai lần cho tới khi VACUUM, nên 10.080 thành 20.160'),
    ],
    correct: 1,
    explanation: EX(
      'An index entry carries no visibility information, so an "index-only" scan can skip the table only for pages the <b>visibility map</b> marks all-visible (lessons 9.2 and 10.4). The UPDATE wrote new row versions — MVCC never overwrites in place — which cleared the bit on every page it touched; the index now holds an entry for the old version and one for the new (2 × 10,080 = 20,160), and each must be checked against the table. The rows returned are still 10,080 (<code>actual rows</code> did not change, so option 4 is wrong). VACUUM removed the dead versions and set the bits again: back to 0. Nothing was corrupted (option 1), and Heap Fetches has nothing to do with the buffer cache (option 3) — that is what <code>BUFFERS</code> shows. Practical consequence: on a heavily updated table, a covering index only pays off if autovacuum keeps up (14.3).',
      'Một mục chỉ mục không mang thông tin nhìn thấy, nên quét "chỉ chỉ mục" chỉ bỏ qua được bảng ở những trang mà <b>visibility map</b> đánh dấu all-visible (bài 9.2 và 10.4). UPDATE ghi các phiên bản dòng mới — MVCC không bao giờ ghi đè tại chỗ — nên xoá bit đó ở mọi trang nó chạm vào; chỉ mục giờ giữ một mục cho bản cũ và một mục cho bản mới (2 × 10.080 = 20.160), và mỗi mục phải được đối chiếu với bảng. Số dòng trả về vẫn là 10.080 (<code>actual rows</code> không đổi, nên phương án 4 sai). VACUUM dọn các phiên bản chết và bật lại bit: về 0. Không có gì bị hỏng (phương án 1), và Heap Fetches chẳng liên quan tới bộ đệm (phương án 3) — đó là việc của <code>BUFFERS</code>. Hệ quả thực tế: trên bảng bị cập nhật nhiều, chỉ mục covering chỉ đáng giá nếu autovacuum theo kịp (14.3).',
    ),
  }),

  mcq({
    prompt: B(
      'An append-only events table: rows arrive in time order and are only ever queried by time range. Measured on a 20 MB table of 200,000 rows:' + code(
        'CREATE INDEX big_created_btree ON fe2.big (created);\n' +
        'CREATE INDEX big_created_brin  ON fe2.big USING brin (created);\n' +
        '--       relname      |  size\n' +
        '--  big               | 20 MB\n' +
        '--  big_created_brin  | 24 kB\n' +
        '--  big_created_btree | 4408 kB',
      ),
      'Một bảng sự kiện chỉ ghi thêm: dòng tới theo thứ tự thời gian và chỉ được truy vấn theo khoảng thời gian. Đo trên bảng 20 MB, 200.000 dòng:' + code(
        'CREATE INDEX big_created_btree ON fe2.big (created);\n' +
        'CREATE INDEX big_created_brin  ON fe2.big USING brin (created);\n' +
        '--       relname      |  size\n' +
        '--  big               | 20 MB\n' +
        '--  big_created_brin  | 24 kB\n' +
        '--  big_created_btree | 4408 kB',
      ),
    ),
    options: [
      B('BRIN is smaller only because it is still empty; it fills up to B-tree size as queries run', 'BRIN nhỏ chỉ vì nó còn trống; nó sẽ phình tới cỡ B-tree khi các truy vấn chạy'),
      B('BRIN stores the exact location of every row in compressed form, so it is always the better choice', 'BRIN lưu vị trí chính xác của mọi dòng dưới dạng nén, nên luôn là lựa chọn tốt hơn'),
      B('BRIN keeps one min/max summary per block range — tiny, and effective because rows arrive in <code>created</code> order', 'BRIN giữ một tóm tắt min/max cho mỗi dải khối — rất nhỏ, và hiệu quả vì dòng tới theo thứ tự <code>created</code>'),
      B('BRIN is a hash index under another name; it cannot serve range queries', 'BRIN là chỉ mục hash dưới một cái tên khác; nó không phục vụ được truy vấn khoảng'),
    ],
    correct: 2,
    explanation: EX(
      'A B-tree holds one entry per row (4,408 kB here). BRIN — Block Range INdex (lesson 9.4) — holds one tiny summary per range of 128 table pages: the minimum and maximum <code>created</code> in that range. For a time-range query it skips every range whose min/max cannot overlap, then reads the remaining pages and rechecks — lossy, but on data inserted in time order the ranges barely overlap, so it prunes almost everything at 1/180 of the size. That correlation is the whole condition: on a column whose values are scattered across the table every range spans everything and BRIN prunes nothing. Option 1 is wrong — the index was built over all 200,000 rows. Option 2 describes a B-tree. Option 4 confuses it with hash, which indeed cannot do ranges; BRIN is made for them. Typical fits: logs, events, sensor readings, <code>created_at</code> of append-only tables.',
      'Một B-tree giữ một mục cho mỗi dòng (ở đây 4.408 kB). BRIN — Block Range INdex (bài 9.4) — giữ một bản tóm tắt nhỏ xíu cho mỗi dải 128 trang của bảng: <code>created</code> nhỏ nhất và lớn nhất trong dải đó. Với truy vấn theo khoảng thời gian, nó bỏ qua mọi dải mà min/max không thể giao, rồi đọc các trang còn lại và kiểm lại — có mất mát, nhưng trên dữ liệu chèn theo thứ tự thời gian các dải gần như không chồng nhau, nên nó loại được gần hết với kích thước bằng 1/180. Sự tương quan đó là toàn bộ điều kiện: trên một cột có giá trị rải khắp bảng, dải nào cũng trải hết mọi giá trị và BRIN chẳng loại được gì. Phương án 1 sai — chỉ mục đã được dựng trên cả 200.000 dòng. Phương án 2 mô tả B-tree. Phương án 4 nhầm với hash, thứ đúng là không làm được khoảng; BRIN sinh ra cho khoảng. Chỗ hợp điển hình: log, sự kiện, số đo cảm biến, <code>created_at</code> của bảng chỉ ghi thêm.',
    ),
  }),

  // ── Chương 10 — EXPLAIN & bộ lập kế hoạch ───────────────────────────────
  mcq({
    prompt: B(
      'In <code>fe2.big</code>, <code>district</code> determines <code>city</code> (every "Đà Nẵng - Q2" row is in Đà Nẵng). 4,000 rows match. Measured on PostgreSQL 17:' + code(
        "EXPLAIN SELECT * FROM fe2.big WHERE city = 'Đà Nẵng' AND district = 'Đà Nẵng - Q2';\n" +
        '--   ->  Parallel Seq Scan on big  (cost=… rows=463 …)        -- Gather estimates rows=787\n' +
        '\n' +
        'CREATE STATISTICS fe2.big_city_district (dependencies) ON city, district FROM fe2.big;\n' +
        'ANALYZE fe2.big;\n' +
        "EXPLAIN SELECT * FROM fe2.big WHERE city = 'Đà Nẵng' AND district = 'Đà Nẵng - Q2';\n" +
        '--  Seq Scan on big  (cost=0.00..5532.00 rows=4013 width=65)',
      ),
      'Trong <code>fe2.big</code>, <code>district</code> quyết định <code>city</code> (mọi dòng "Đà Nẵng - Q2" đều ở Đà Nẵng). Có 4.000 dòng khớp. Đo trên PostgreSQL 17:' + code(
        "EXPLAIN SELECT * FROM fe2.big WHERE city = 'Đà Nẵng' AND district = 'Đà Nẵng - Q2';\n" +
        '--   ->  Parallel Seq Scan on big  (cost=… rows=463 …)        -- Gather estimates rows=787\n' +
        '\n' +
        'CREATE STATISTICS fe2.big_city_district (dependencies) ON city, district FROM fe2.big;\n' +
        'ANALYZE fe2.big;\n' +
        "EXPLAIN SELECT * FROM fe2.big WHERE city = 'Đà Nẵng' AND district = 'Đà Nẵng - Q2';\n" +
        '--  Seq Scan on big  (cost=0.00..5532.00 rows=4013 width=65)',
      ),
    ),
    options: [
      B('The planner assumed the columns independent (about 1/250 of the rows); extended statistics teach it the dependency', 'Bộ lập kế hoạch giả định hai cột độc lập (khoảng 1/250 số dòng); thống kê mở rộng dạy nó mối phụ thuộc'),
      B('The first estimate was wrong because the table had never been analysed; any <code>ANALYZE</code> would have fixed it', 'Ước lượng đầu sai vì bảng chưa từng được analyze; <code>ANALYZE</code> nào cũng sửa được'),
      B('<code>CREATE STATISTICS</code> builds an index on <code>(city, district)</code>, which is why the plan changed', '<code>CREATE STATISTICS</code> dựng một chỉ mục trên <code>(city, district)</code>, nên kế hoạch mới đổi'),
      B('Estimates should be exact after <code>ANALYZE</code>; 4,013 instead of 4,000 shows the statistics object is broken', 'Ước lượng phải chính xác sau <code>ANALYZE</code>; 4.013 thay vì 4.000 cho thấy đối tượng thống kê bị hỏng'),
    ],
    correct: 0,
    explanation: EX(
      'Per-column statistics know that one row in 5 is Đà Nẵng and about one in 50 is "Đà Nẵng - Q2", and the planner\'s default is to assume independence and multiply them: roughly 200,000 / 250 = 800. Here the second condition implies the first, so the true answer is 4,000 — an under-estimate of ~5×, the kind that leads to a Nested Loop where a Hash Join was needed (lesson 10.3). <code>CREATE STATISTICS … (dependencies)</code> records the functional dependency, and after <code>ANALYZE</code> the estimate becomes 4,013. The table had been analysed (option 2 is wrong — more single-column statistics cannot reveal a cross-column relationship). No index was created (option 3); the plan is still a Seq Scan, only its estimate and its parallelism changed. And estimates come from a <b>sample</b> of 30,000 rows, so they are close, never exact, and move slightly between <code>ANALYZE</code> runs (option 4).',
      'Thống kê từng cột biết rằng cứ 5 dòng có 1 dòng Đà Nẵng và khoảng 50 dòng có 1 dòng "Đà Nẵng - Q2", và mặc định bộ lập kế hoạch giả định hai cột độc lập rồi nhân chúng: khoảng 200.000 / 250 = 800. Ở đây điều kiện thứ hai đã kéo theo điều kiện thứ nhất, nên đáp án thật là 4.000 — ước lượng thiếu ~5 lần, loại sai lệch dẫn tới Nested Loop ở chỗ đáng ra phải là Hash Join (bài 10.3). <code>CREATE STATISTICS … (dependencies)</code> ghi lại mối phụ thuộc hàm, và sau <code>ANALYZE</code> ước lượng thành 4.013. Bảng đã được analyze (phương án 2 sai — thêm thống kê từng cột không thể lộ ra quan hệ giữa các cột). Không có chỉ mục nào được tạo (phương án 3); kế hoạch vẫn là Seq Scan, chỉ ước lượng và việc chạy song song thay đổi. Và ước lượng đến từ một <b>mẫu</b> 30.000 dòng, nên nó gần đúng chứ không bao giờ chính xác, và xê dịch chút ít giữa các lần <code>ANALYZE</code> (phương án 4).',
    ),
  }),

  mcq({
    prompt: B(
      'One plan node, measured with <code>EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)</code> on the 200,000-row table. What is it telling you?' + code(
        'SELECT id, amount FROM fe2.big WHERE amount = 4242;\n' +
        '--  Seq Scan on big (actual rows=1 loops=1)\n' +
        '--    Filter: (amount = 4242)\n' +
        '--    Rows Removed by Filter: 199999',
      ),
      'Một nút kế hoạch, đo bằng <code>EXPLAIN (ANALYZE, COSTS OFF, TIMING OFF)</code> trên bảng 200.000 dòng. Nó đang nói gì với bạn?' + code(
        'SELECT id, amount FROM fe2.big WHERE amount = 4242;\n' +
        '--  Seq Scan on big (actual rows=1 loops=1)\n' +
        '--    Filter: (amount = 4242)\n' +
        '--    Rows Removed by Filter: 199999',
      ),
    ),
    options: [
      B('199,999 rows were deleted by the query, because <code>ANALYZE</code> executes the statement', '199.999 dòng đã bị truy vấn xoá, vì <code>ANALYZE</code> thực thi câu lệnh'),
      B('The table is bloated: 199,999 dead rows had to be skipped', 'Bảng bị phình: phải bỏ qua 199.999 dòng chết'),
      B('The planner\'s estimate was 199,999 rows off and statistics must be refreshed', 'Ước lượng của bộ lập kế hoạch lệch 199.999 dòng và phải làm mới thống kê'),
      B('One row kept, 199,999 read and thrown away: a selective filter with no index to use', 'Giữ một dòng, đọc rồi vứt 199.999 dòng: một bộ lọc chọn lọc cao mà không có chỉ mục để dùng'),
    ],
    correct: 3,
    explanation: EX(
      '<code>Rows Removed by Filter</code> counts rows the node read and threw away because they failed its <code>Filter</code> (lesson 10.1). Kept 1, removed 199,999: the work done is 200,000× the useful output — the signature of a missing index on a selective predicate, and the first thing to look for in a slow plan (lesson 10.4\'s workflow). It is about the filter, not visibility: dead tuples are skipped silently and never counted here (option 2). <code>EXPLAIN ANALYZE</code> on a <code>SELECT</code> deletes nothing (option 1) — it executes the statement, which matters only for writes, where you wrap it in <code>BEGIN … ROLLBACK</code>. Option 3 reads the line as an estimation error, but with <code>COSTS OFF</code> no estimate is even shown; the line is a measured count. The contrast to remember: a low-selectivity filter (removing half the table) is a legitimate Seq Scan.',
      '<code>Rows Removed by Filter</code> đếm những dòng nút đó đã đọc rồi vứt đi vì trượt <code>Filter</code> của nó (bài 10.1). Giữ 1, loại 199.999: công sức bỏ ra gấp 200.000 lần phần kết quả có ích — dấu hiệu của một chỉ mục còn thiếu trên một điều kiện chọn lọc cao, và là thứ đầu tiên cần tìm trong một kế hoạch chậm (quy trình của bài 10.4). Nó nói về bộ lọc, không phải về tính nhìn thấy: dòng chết bị bỏ qua lặng lẽ và không bao giờ được đếm ở đây (phương án 2). <code>EXPLAIN ANALYZE</code> trên một câu <code>SELECT</code> chẳng xoá gì (phương án 1) — nó thực thi câu lệnh, điều chỉ đáng lo với câu ghi, khi đó bạn bọc nó trong <code>BEGIN … ROLLBACK</code>. Phương án 3 đọc dòng đó như một sai số ước lượng, nhưng với <code>COSTS OFF</code> ước lượng còn chẳng được in ra; dòng đó là số đếm đo được. Điều cần nhớ để đối chiếu: một bộ lọc chọn lọc thấp (loại nửa bảng) thì Seq Scan là hợp lý.',
    ),
  }),

  mcq({
    prompt: B(
      'The same sort of 200,000 rows, measured with two <code>work_mem</code> settings inside one transaction:' + code(
        'BEGIN;\n' +
        "SET LOCAL work_mem = '1MB';\n" +
        '--  Sort (actual rows=200000 loops=1)   Sort Method: external merge  Disk: 8248kB\n' +
        "SET LOCAL work_mem = '64MB';\n" +
        '--  Sort (actual rows=200000 loops=1)   Sort Method: quicksort  Memory: 15520kB\n' +
        'COMMIT;\n' +
        'SHOW work_mem;   -- 4MB',
      ),
      'Cùng một phép sắp xếp 200.000 dòng, đo với hai mức <code>work_mem</code> trong một giao dịch:' + code(
        'BEGIN;\n' +
        "SET LOCAL work_mem = '1MB';\n" +
        '--  Sort (actual rows=200000 loops=1)   Sort Method: external merge  Disk: 8248kB\n' +
        "SET LOCAL work_mem = '64MB';\n" +
        '--  Sort (actual rows=200000 loops=1)   Sort Method: quicksort  Memory: 15520kB\n' +
        'COMMIT;\n' +
        'SHOW work_mem;   -- 4MB',
      ),
    ),
    options: [
      B('Raise <code>work_mem</code> to 64MB server-wide; memory is cheap and every query benefits', 'Nâng <code>work_mem</code> lên 64MB cho toàn máy chủ; bộ nhớ rẻ và truy vấn nào cũng hưởng lợi'),
      B('It spilled to disk; <code>work_mem</code> is per sort node and per connection, so raise it only for this query', 'Nó tràn ra đĩa; <code>work_mem</code> tính cho mỗi nút sort và mỗi kết nối, nên chỉ nâng cho đúng truy vấn này'),
      B('An external merge means the table was too large to read and PostgreSQL sampled it', 'External merge nghĩa là bảng quá lớn không đọc nổi và PostgreSQL đã lấy mẫu'),
      B('The first run used disk only because the data was not cached yet; the second run would be quicksort at 1MB too', 'Lần chạy đầu dùng đĩa chỉ vì dữ liệu chưa nằm trong bộ đệm; lần thứ hai ở 1MB cũng sẽ là quicksort'),
    ],
    correct: 1,
    explanation: EX(
      '<code>Sort Method: external merge Disk: 8248kB</code> (lesson 10.4) says the sort needed more memory than <code>work_mem</code> allowed, so it sorted chunks into temporary files and merged them; with 64MB the same 200,000 rows sorted in 15,520 kB of memory. The dangerous fix is option 1: <code>work_mem</code> is not a server total but an allowance for <b>each</b> sort or hash operation, in <b>each</b> connection — a query can use several multiples, and 100 connections × a few nodes × 64MB can exhaust a small VPS. Hence <code>SET LOCAL</code> inside the transaction of the one heavy report (and <code>SHOW work_mem</code> afterwards proves it reverted to 4MB). The rows were all read (option 3: <code>actual rows=200000</code>), and caching does not change the memory a sort needs (option 4).',
      '<code>Sort Method: external merge Disk: 8248kB</code> (bài 10.4) cho biết phép sắp xếp cần nhiều bộ nhớ hơn mức <code>work_mem</code> cho phép, nên nó sắp từng khúc ra file tạm rồi trộn lại; với 64MB, cùng 200.000 dòng được sắp trong 15.520 kB bộ nhớ. Cách sửa nguy hiểm là phương án 1: <code>work_mem</code> không phải tổng của máy chủ mà là hạn mức cho <b>mỗi</b> thao tác sort hay hash, trong <b>mỗi</b> kết nối — một truy vấn có thể dùng gấp vài lần, và 100 kết nối × vài nút × 64MB đủ làm cạn một VPS nhỏ. Vì vậy mới dùng <code>SET LOCAL</code> trong giao dịch của đúng bản báo cáo nặng (và <code>SHOW work_mem</code> sau đó chứng minh nó đã về 4MB). Mọi dòng đều đã được đọc (phương án 3: <code>actual rows=200000</code>), và bộ đệm không làm thay đổi lượng bộ nhớ một phép sắp xếp cần (phương án 4).',
    ),
  }),

  // ── Chương 11 — Giao dịch & đồng thời ──────────────────────────────────
  mcq({
    prompt: B(
      '<code>ledger.amount</code> has <code>CHECK (amount &gt; 0)</code>. Run on PostgreSQL 17 — what does the final <code>SELECT</code> show?' + code(
        'BEGIN;\n' +
        'INSERT INTO fe2.ledger VALUES (1, 100);\n' +
        'SAVEPOINT s1;\n' +
        'INSERT INTO fe2.ledger VALUES (2, -5);     -- ERROR: violates check constraint "ledger_amount_check"\n' +
        'ROLLBACK TO SAVEPOINT s1;\n' +
        'INSERT INTO fe2.ledger VALUES (3, 30);\n' +
        'COMMIT;\n' +
        'SELECT id, amount FROM fe2.ledger ORDER BY id;',
      ),
      '<code>ledger.amount</code> có <code>CHECK (amount &gt; 0)</code>. Chạy trên PostgreSQL 17 — câu <code>SELECT</code> cuối cho thấy gì?' + code(
        'BEGIN;\n' +
        'INSERT INTO fe2.ledger VALUES (1, 100);\n' +
        'SAVEPOINT s1;\n' +
        'INSERT INTO fe2.ledger VALUES (2, -5);     -- ERROR: violates check constraint "ledger_amount_check"\n' +
        'ROLLBACK TO SAVEPOINT s1;\n' +
        'INSERT INTO fe2.ledger VALUES (3, 30);\n' +
        'COMMIT;\n' +
        'SELECT id, amount FROM fe2.ledger ORDER BY id;',
      ),
    ),
    options: [
      B('Rows 1 and 3 — the savepoint undid only the failed insert, and the transaction went on', 'Dòng 1 và 3 — savepoint chỉ huỷ lần chèn hỏng, và giao dịch chạy tiếp'),
      B('No rows — any error inside a transaction forces the whole transaction to roll back at <code>COMMIT</code>', 'Không dòng nào — bất kỳ lỗi nào trong giao dịch cũng buộc cả giao dịch rollback lúc <code>COMMIT</code>'),
      B('Only row 1 — after the error, row 3 was ignored with "current transaction is aborted"', 'Chỉ dòng 1 — sau lỗi, dòng 3 bị bỏ qua với "current transaction is aborted"'),
      B('Only row 3 — <code>ROLLBACK TO SAVEPOINT</code> also undid row 1', 'Chỉ dòng 3 — <code>ROLLBACK TO SAVEPOINT</code> cũng huỷ luôn dòng 1'),
    ],
    correct: 0,
    explanation: EX(
      'Measured: <code>1 | 100</code> and <code>3 | 30</code>. After an error a PostgreSQL transaction is <i>aborted</i> — every further statement is refused — until it is rolled back (lesson 11.1). A savepoint narrows what "rolled back" means: <code>ROLLBACK TO SAVEPOINT s1</code> undoes only the work after <code>s1</code> (the failed insert) and returns the transaction to a healthy state, so row 3 goes in and <code>COMMIT</code> commits rows 1 and 3. Options 2 and 3 describe what happens <i>without</i> the savepoint: row 3 would be refused and <code>COMMIT</code> would answer <code>ROLLBACK</code>, losing row 1 too. Option 4 rolls back too far — row 1 was written before the savepoint. This is how psql\'s <code>ON_ERROR_ROLLBACK</code> and ORM "nested transactions" work underneath.',
      'Đo thật: <code>1 | 100</code> và <code>3 | 30</code>. Sau một lỗi, giao dịch PostgreSQL ở trạng thái <i>aborted</i> — mọi câu lệnh tiếp theo đều bị từ chối — cho tới khi được rollback (bài 11.1). Savepoint thu hẹp nghĩa của "rollback": <code>ROLLBACK TO SAVEPOINT s1</code> chỉ huỷ phần việc sau <code>s1</code> (lần chèn hỏng) và đưa giao dịch về trạng thái lành, nên dòng 3 được chèn và <code>COMMIT</code> ghi dòng 1 và 3. Phương án 2 và 3 mô tả chuyện xảy ra khi KHÔNG có savepoint: dòng 3 bị từ chối và <code>COMMIT</code> trả lời <code>ROLLBACK</code>, mất luôn dòng 1. Phương án 4 rollback quá xa — dòng 1 được ghi trước savepoint. Đây chính là cơ chế bên dưới <code>ON_ERROR_ROLLBACK</code> của psql và "giao dịch lồng" của các ORM.',
    ),
  }),

  mcq({
    prompt: B(
      'A job queue, two real sessions at the same time. Session A took job 1 and is still holding it. Session B then runs two statements:' + code(
        '-- session A\n' +
        'BEGIN;\n' +
        "SELECT id FROM fe2.job WHERE state = 'queued' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;   -- 1\n" +
        '-- … still working, transaction open …\n' +
        '\n' +
        '-- session B\n' +
        "SELECT id FROM fe2.job WHERE state = 'queued' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;   -- ①\n" +
        "SET LOCAL lock_timeout = '2s';\n" +
        "SELECT id FROM fe2.job WHERE state = 'queued' ORDER BY id LIMIT 1 FOR UPDATE;               -- ②",
      ),
      'Một hàng đợi việc, hai phiên thật chạy cùng lúc. Phiên A đã lấy job 1 và vẫn đang giữ. Phiên B khi đó chạy hai câu:' + code(
        '-- phiên A\n' +
        'BEGIN;\n' +
        "SELECT id FROM fe2.job WHERE state = 'queued' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;   -- 1\n" +
        '-- … vẫn đang làm, giao dịch còn mở …\n' +
        '\n' +
        '-- phiên B\n' +
        "SELECT id FROM fe2.job WHERE state = 'queued' ORDER BY id LIMIT 1 FOR UPDATE SKIP LOCKED;   -- ①\n" +
        "SET LOCAL lock_timeout = '2s';\n" +
        "SELECT id FROM fe2.job WHERE state = 'queued' ORDER BY id LIMIT 1 FOR UPDATE;               -- ②",
      ),
    ),
    options: [
      B('① returns 1 as well — row locks only block writers, not other <code>SELECT … FOR UPDATE</code>', '① cũng trả về 1 — khoá dòng chỉ chặn người ghi, không chặn <code>SELECT … FOR UPDATE</code> khác'),
      B('① waits until A commits; ② then returns job 2 immediately', '① chờ tới khi A commit; ② sau đó trả về job 2 ngay'),
      B('① returns job 2 at once; ② waits on job 1 and, after 2 s, fails with <code>canceling statement due to lock timeout</code>', '① trả về job 2 ngay lập tức; ② chờ job 1 và sau 2 s thì lỗi <code>canceling statement due to lock timeout</code>'),
      B('Both return nothing: <code>SKIP LOCKED</code> hides the whole table while any row in it is locked', 'Cả hai không trả gì: <code>SKIP LOCKED</code> che cả bảng khi có bất kỳ dòng nào bị khoá'),
    ],
    correct: 2,
    explanation: EX(
      'Measured with two psql processes: ① returned <code>2</code> instantly; ② waited and after 2,000 ms raised <code>ERROR: canceling statement due to lock timeout</code>, <code>CONTEXT: while locking tuple (0,1) in relation "job"</code>. <code>FOR UPDATE</code> takes a row lock that conflicts with every other <code>FOR UPDATE</code> on that row (so option 1 is wrong). Plain <code>FOR UPDATE</code> therefore queues behind A on job 1 — the first row in <code>id</code> order — and without the timeout would wait until A commits. <code>SKIP LOCKED</code> (lesson 11.4) passes over rows another transaction has locked and takes the next one, which is exactly what N workers draining one queue need: no two take the same job and none waits. It skips <i>rows</i>, not tables (option 4), and B — not A — is the one that would wait (option 2 swaps them).',
      'Đo bằng hai tiến trình psql: ① trả về <code>2</code> ngay; ② chờ và sau 2.000 ms báo <code>ERROR: canceling statement due to lock timeout</code>, <code>CONTEXT: while locking tuple (0,1) in relation "job"</code>. <code>FOR UPDATE</code> lấy một khoá dòng xung đột với mọi <code>FOR UPDATE</code> khác trên dòng đó (nên phương án 1 sai). <code>FOR UPDATE</code> thường vì thế xếp hàng sau A ở job 1 — dòng đầu theo thứ tự <code>id</code> — và nếu không có timeout sẽ chờ tới khi A commit. <code>SKIP LOCKED</code> (bài 11.4) bỏ qua các dòng mà giao dịch khác đang khoá và lấy dòng kế tiếp, đúng thứ N worker cùng rút một hàng đợi cần: không hai worker nào lấy trùng việc và không ai phải chờ. Nó bỏ qua <i>dòng</i>, không phải bảng (phương án 4), và người phải chờ là B chứ không phải A (phương án 2 đảo ngược hai câu).',
    ),
  }),

  mcq({
    prompt: B(
      '<code>ctid</code> is a row version\'s physical address (page, slot). Run on PostgreSQL 17:' + code(
        'SELECT ctid, id, balance FROM fe2.acc ORDER BY id;   -- (0,1) | 1 | 100   (0,2) | 2 | 50\n' +
        'UPDATE fe2.acc SET balance = balance + 1 WHERE id = 1;\n' +
        'SELECT ctid, id, balance FROM fe2.acc ORDER BY id;   -- (0,3) | 1 | 101   (0,2) | 2 | 50\n' +
        'UPDATE fe2.acc SET balance = balance + 1 WHERE id = 1;\n' +
        'SELECT ctid, id, balance FROM fe2.acc ORDER BY id;   -- (0,4) | 1 | 102   (0,2) | 2 | 50',
      ),
      '<code>ctid</code> là địa chỉ vật lý (trang, ô) của một phiên bản dòng. Chạy trên PostgreSQL 17:' + code(
        'SELECT ctid, id, balance FROM fe2.acc ORDER BY id;   -- (0,1) | 1 | 100   (0,2) | 2 | 50\n' +
        'UPDATE fe2.acc SET balance = balance + 1 WHERE id = 1;\n' +
        'SELECT ctid, id, balance FROM fe2.acc ORDER BY id;   -- (0,3) | 1 | 101   (0,2) | 2 | 50\n' +
        'UPDATE fe2.acc SET balance = balance + 1 WHERE id = 1;\n' +
        'SELECT ctid, id, balance FROM fe2.acc ORDER BY id;   -- (0,4) | 1 | 102   (0,2) | 2 | 50',
      ),
    ),
    options: [
      B('Each UPDATE writes a new row version and leaves the old one dead until VACUUM — MVCC', 'Mỗi UPDATE ghi một phiên bản dòng mới và để bản cũ chết cho tới khi VACUUM — MVCC'),
      B('PostgreSQL moved the row because its new value no longer fitted in the old slot', 'PostgreSQL dời dòng vì giá trị mới không còn vừa ô cũ'),
      B('<code>ctid</code> is a sequence that increments on every statement; it says nothing about storage', '<code>ctid</code> là một dãy số tăng sau mỗi câu lệnh; nó chẳng nói gì về lưu trữ'),
      B('The UPDATE deleted the row and re-inserted it, so it now has a new primary key internally', 'UPDATE đã xoá dòng rồi chèn lại, nên bên trong nó giờ có khoá chính mới'),
    ],
    correct: 0,
    explanation: EX(
      'Lesson 11.2: PostgreSQL never overwrites a row in place. An UPDATE writes a complete new tuple (here into the next free slot of page 0, so <code>(0,3)</code> and then <code>(0,4)</code>) and stamps the old one with the updating transaction\'s id in <code>xmax</code>. Until that transaction commits, other sessions keep reading the old version — which is why a reader never waits for a writer — and afterwards the old version is dead but still occupies its slot until VACUUM removes it (Chapter 14\'s bloat). An <code>int</code> is the same size before and after (option 2). <code>ctid</code> is genuinely physical, which is also why it must never be used as a stable row identifier (option 3). The primary key is a column value and does not change (option 4); what changed is which physical version is current.',
      'Bài 11.2: PostgreSQL không bao giờ ghi đè một dòng tại chỗ. UPDATE ghi một bộ hoàn toàn mới (ở đây vào ô trống kế tiếp của trang 0, nên <code>(0,3)</code> rồi <code>(0,4)</code>) và đóng dấu bản cũ bằng id của giao dịch cập nhật trong <code>xmax</code>. Cho tới khi giao dịch đó commit, các phiên khác vẫn đọc bản cũ — vì thế người đọc không bao giờ phải chờ người ghi — và sau đó bản cũ thành dòng chết nhưng vẫn chiếm ô của nó cho tới khi VACUUM dọn đi (chuyện bloat ở Chương 14). Một số <code>int</code> trước và sau có cùng kích thước (phương án 2). <code>ctid</code> đúng là địa chỉ vật lý, và cũng vì thế không bao giờ được dùng làm định danh dòng ổn định (phương án 3). Khoá chính là giá trị của một cột và không đổi (phương án 4); thứ thay đổi là phiên bản vật lý nào đang là bản hiện hành.',
    ),
  }),

  // ── Chương 12 — Hàm, trigger, view ──────────────────────────────────────
  mcq({
    prompt: B(
      'A view <code>cheap_item</code> is defined as <code>SELECT id, price, discount FROM fe2.item WHERE price &lt; 60 WITH CHECK OPTION</code>. Run on PostgreSQL 17:' + code(
        'INSERT INTO fe2.cheap_item VALUES (6, 20, NULL);      -- ①\n' +
        'INSERT INTO fe2.cheap_item VALUES (7, 90, NULL);      -- ②\n' +
        'UPDATE fe2.cheap_item SET price = 99 WHERE id = 6;    -- ③',
      ),
      'View <code>cheap_item</code> được định nghĩa là <code>SELECT id, price, discount FROM fe2.item WHERE price &lt; 60 WITH CHECK OPTION</code>. Chạy trên PostgreSQL 17:' + code(
        'INSERT INTO fe2.cheap_item VALUES (6, 20, NULL);      -- ①\n' +
        'INSERT INTO fe2.cheap_item VALUES (7, 90, NULL);      -- ②\n' +
        'UPDATE fe2.cheap_item SET price = 99 WHERE id = 6;    -- ③',
      ),
    ),
    options: [
      B('All three fail: a view is read-only unless it has an <code>INSTEAD OF</code> trigger', 'Cả ba đều lỗi: view là chỉ-đọc trừ khi có trigger <code>INSTEAD OF</code>'),
      B('All three succeed; row 7 and the updated row 6 simply become invisible through the view', 'Cả ba đều thành công; dòng 7 và dòng 6 sau khi sửa chỉ đơn giản là không nhìn thấy qua view'),
      B('① and ③ succeed, ② fails — <code>CHECK OPTION</code> only applies to <code>INSERT</code>', '① và ③ thành công, ② lỗi — <code>CHECK OPTION</code> chỉ áp cho <code>INSERT</code>'),
      B('Only ① succeeds; ② and ③ fail with <code>new row violates check option</code>', 'Chỉ ① thành công; ② và ③ lỗi <code>new row violates check option</code>'),
    ],
    correct: 3,
    explanation: EX(
      'Measured: ① <code>INSERT 0 1</code>; ② and ③ <code>ERROR: new row violates check option for view "cheap_item"</code>, with <code>DETAIL: Failing row contains (7, 90.00, null)</code> and <code>(6, 99.00, null)</code>. A view over a single table with no aggregates is <b>automatically updatable</b> (lesson 12.3), so option 1 is wrong. Without <code>CHECK OPTION</code>, option 2 would be the truth — you could write rows through the view that the view itself can never show, a quiet way for a restricted screen to create data outside its scope. <code>WITH CHECK OPTION</code> closes that hole for every write that produces a row — inserts <i>and</i> updates (option 3). It is the view-level counterpart of a <code>CHECK</code> constraint, scoped to what that view is allowed to see.',
      'Đo thật: ① <code>INSERT 0 1</code>; ② và ③ <code>ERROR: new row violates check option for view "cheap_item"</code>, kèm <code>DETAIL: Failing row contains (7, 90.00, null)</code> và <code>(6, 99.00, null)</code>. Một view trên đúng một bảng, không có hàm tổng hợp, là <b>tự động cập nhật được</b> (bài 12.3), nên phương án 1 sai. Không có <code>CHECK OPTION</code> thì phương án 2 mới là sự thật — bạn có thể ghi qua view những dòng mà chính view đó không bao giờ hiện ra, một cách lặng lẽ để một màn hình bị giới hạn tạo dữ liệu nằm ngoài phạm vi của nó. <code>WITH CHECK OPTION</code> bịt lỗ đó cho mọi thao tác ghi sinh ra một dòng — chèn <i>và</i> sửa (phương án 3). Nó là bản ở mức view của ràng buộc <code>CHECK</code>, giới hạn theo đúng những gì view được phép nhìn thấy.',
    ),
  }),

  mcq({
    prompt: B(
      'A reporting view joins orders to customers. Run on PostgreSQL 17:' + code(
        'CREATE VIEW fe2.order_view AS\n' +
        '  SELECT o.id, o.status, c.full_name\n' +
        '  FROM shop.orders o JOIN shop.customer c ON c.id = o.customer_id;\n' +
        "UPDATE fe2.order_view SET status = 'shipped' WHERE id = 1;\n" +
        '-- ERROR:  cannot update view "order_view"\n' +
        '-- DETAIL:  Views that do not select from a single table or view are not automatically updatable.',
      ),
      'Một view báo cáo join đơn với khách. Chạy trên PostgreSQL 17:' + code(
        'CREATE VIEW fe2.order_view AS\n' +
        '  SELECT o.id, o.status, c.full_name\n' +
        '  FROM shop.orders o JOIN shop.customer c ON c.id = o.customer_id;\n' +
        "UPDATE fe2.order_view SET status = 'shipped' WHERE id = 1;\n" +
        '-- ERROR:  cannot update view "order_view"\n' +
        '-- DETAIL:  Views that do not select from a single table or view are not automatically updatable.',
      ),
    ),
    options: [
      B('With two base tables a write is ambiguous; an <code>INSTEAD OF UPDATE</code> trigger must say what to do', 'Với hai bảng gốc, thao tác ghi là mơ hồ; một trigger <code>INSTEAD OF UPDATE</code> phải nói rõ cần làm gì'),
      B('The view needs <code>WITH CHECK OPTION</code> to accept updates', 'View cần <code>WITH CHECK OPTION</code> thì mới nhận cập nhật'),
      B('The update would work if the view were made <code>MATERIALIZED</code>', 'Cập nhật sẽ chạy nếu biến view thành <code>MATERIALIZED</code>'),
      B('It fails only because <code>status</code> comes from the left table; updating <code>full_name</code> would work', 'Nó lỗi chỉ vì <code>status</code> đến từ bảng bên trái; sửa <code>full_name</code> thì chạy'),
    ],
    correct: 0,
    explanation: EX(
      'Automatic updatability (lesson 12.3) has strict conditions: exactly one table or view in <code>FROM</code>, no <code>GROUP BY</code>, no <code>DISTINCT</code>, no aggregates or window functions, no set operations. The measured <code>DETAIL</code> names the rule that failed. The <code>HINT</code> PostgreSQL adds — "provide an INSTEAD OF UPDATE trigger or an unconditional ON UPDATE DO INSTEAD rule" — is the escape hatch: a trigger function that receives <code>OLD</code>/<code>NEW</code> for the view row and issues the real <code>UPDATE shop.orders …</code>. <code>CHECK OPTION</code> restricts writes that are already possible (option 2). A materialized view is a stored result and can only be refreshed, never written (option 3). Which column you target does not matter (option 4) — the whole view is refused. Often the honest answer is to update <code>orders</code> directly and keep the view for reading.',
      'Điều kiện để tự động cập nhật được (bài 12.3) rất chặt: đúng một bảng hoặc view trong <code>FROM</code>, không <code>GROUP BY</code>, không <code>DISTINCT</code>, không hàm tổng hợp hay hàm cửa sổ, không phép toán tập hợp. <code>DETAIL</code> đo được gọi tên đúng điều kiện bị vi phạm. <code>HINT</code> mà PostgreSQL thêm vào — "provide an INSTEAD OF UPDATE trigger or an unconditional ON UPDATE DO INSTEAD rule" — là lối thoát: một hàm trigger nhận <code>OLD</code>/<code>NEW</code> của dòng view và tự chạy câu <code>UPDATE shop.orders …</code> thật. <code>CHECK OPTION</code> giới hạn những thao tác ghi vốn đã làm được (phương án 2). Materialized view là một kết quả được lưu lại, chỉ refresh được chứ không ghi được (phương án 3). Nhắm vào cột nào cũng không quan trọng (phương án 4) — cả view bị từ chối. Thường thì câu trả lời thật thà nhất là cập nhật thẳng <code>orders</code> và giữ view để đọc.',
    ),
  }),

  mcq({
    prompt: B(
      'A batch job wants to commit in chunks. Run on PostgreSQL 17 (<code>ledger</code> has no rows with <code>id &gt;= 10</code> before this):' + code(
        'CREATE FUNCTION fe2.f_commit() RETURNS void LANGUAGE plpgsql AS $$\n' +
        'BEGIN INSERT INTO fe2.ledger VALUES (10, 1); COMMIT; END; $$;\n' +
        'SELECT fe2.f_commit();\n' +
        '\n' +
        'CREATE PROCEDURE fe2.p_commit() LANGUAGE plpgsql AS $$\n' +
        'BEGIN INSERT INTO fe2.ledger VALUES (11, 1); COMMIT;\n' +
        '      INSERT INTO fe2.ledger VALUES (12, 1); ROLLBACK; END; $$;\n' +
        'CALL fe2.p_commit();\n' +
        '\n' +
        'SELECT id FROM fe2.ledger WHERE id >= 10 ORDER BY id;',
      ),
      'Một tác vụ hàng loạt muốn commit theo từng khúc. Chạy trên PostgreSQL 17 (trước đó <code>ledger</code> không có dòng nào <code>id &gt;= 10</code>):' + code(
        'CREATE FUNCTION fe2.f_commit() RETURNS void LANGUAGE plpgsql AS $$\n' +
        'BEGIN INSERT INTO fe2.ledger VALUES (10, 1); COMMIT; END; $$;\n' +
        'SELECT fe2.f_commit();\n' +
        '\n' +
        'CREATE PROCEDURE fe2.p_commit() LANGUAGE plpgsql AS $$\n' +
        'BEGIN INSERT INTO fe2.ledger VALUES (11, 1); COMMIT;\n' +
        '      INSERT INTO fe2.ledger VALUES (12, 1); ROLLBACK; END; $$;\n' +
        'CALL fe2.p_commit();\n' +
        '\n' +
        'SELECT id FROM fe2.ledger WHERE id >= 10 ORDER BY id;',
      ),
    ),
    options: [
      B('10, 11 — both routines commit their first insert and discard the rest', '10, 11 — cả hai thủ tục đều commit lần chèn đầu và bỏ phần còn lại'),
      B('10, 11, 12 — <code>ROLLBACK</code> inside PL/pgSQL is ignored', '10, 11, 12 — <code>ROLLBACK</code> bên trong PL/pgSQL bị bỏ qua'),
      B('11 only — the function fails (<code>invalid transaction termination</code>); the procedure may commit', 'Chỉ 11 — hàm bị lỗi (<code>invalid transaction termination</code>); procedure thì được commit'),
      B('Nothing — neither a function nor a procedure may control transactions', 'Không có gì — cả hàm lẫn procedure đều không được điều khiển giao dịch'),
    ],
    correct: 2,
    explanation: EX(
      'Measured: <code>ERROR: invalid transaction termination</code> with <code>CONTEXT: PL/pgSQL function fe2.f_commit() line 2 at COMMIT</code>, then <code>CALL</code>, then a single row <code>11</code>. A function always runs inside its caller\'s transaction — a <code>SELECT</code> that calls it is one statement, and a statement cannot end the transaction it belongs to (lesson 12.1). That is the main reason <code>PROCEDURE</code> exists: invoked with <code>CALL</code> at top level, it may <code>COMMIT</code> and <code>ROLLBACK</code> between steps, so a long batch can commit every N rows and release locks as it goes. Here the first chunk (11) committed and the second (12) was explicitly rolled back. Option 1 grants functions a power they do not have; option 2 is wrong, the <code>ROLLBACK</code> took effect; option 4 forgets procedures. One caveat: a procedure called inside an explicit <code>BEGIN</code> block loses that ability.',
      'Đo thật: <code>ERROR: invalid transaction termination</code> kèm <code>CONTEXT: PL/pgSQL function fe2.f_commit() line 2 at COMMIT</code>, rồi <code>CALL</code>, rồi đúng một dòng <code>11</code>. Một hàm luôn chạy bên trong giao dịch của người gọi — câu <code>SELECT</code> gọi nó là một câu lệnh, và một câu lệnh không thể kết thúc giao dịch chứa chính nó (bài 12.1). Đó là lý do chính để <code>PROCEDURE</code> tồn tại: gọi bằng <code>CALL</code> ở cấp ngoài cùng, nó được <code>COMMIT</code> và <code>ROLLBACK</code> giữa các bước, nên một tác vụ dài có thể commit mỗi N dòng và nhả khoá dần. Ở đây khúc đầu (11) đã commit còn khúc hai (12) bị rollback có chủ ý. Phương án 1 trao cho hàm một quyền nó không có; phương án 2 sai, <code>ROLLBACK</code> đã có hiệu lực; phương án 4 quên mất procedure. Một lưu ý: procedure được gọi bên trong một khối <code>BEGIN</code> tường minh sẽ mất khả năng đó.',
    ),
  }),

  // ── Chương 13 — JSONB & full-text search ───────────────────────────────
  mcq({
    prompt: B(
      'Four ways to find Casio products in <code>product.attrs</code>. Run on PostgreSQL 17 — which statement fails, and what do the other three return?' + code(
        "SELECT count(*) FROM product WHERE attrs ->  'brand' = 'Casio';     -- A\n" +
        "SELECT count(*) FROM product WHERE attrs ->> 'brand' = 'Casio';     -- B\n" +
        "SELECT count(*) FROM product WHERE attrs ->  'brand' = '\"Casio\"';   -- C\n" +
        'SELECT count(*) FROM product WHERE attrs @> \'{"brand": "Casio"}\';  -- D',
      ),
      'Bốn cách tìm sản phẩm Casio trong <code>product.attrs</code>. Chạy trên PostgreSQL 17 — câu nào lỗi, và ba câu còn lại trả về gì?' + code(
        "SELECT count(*) FROM product WHERE attrs ->  'brand' = 'Casio';     -- A\n" +
        "SELECT count(*) FROM product WHERE attrs ->> 'brand' = 'Casio';     -- B\n" +
        "SELECT count(*) FROM product WHERE attrs ->  'brand' = '\"Casio\"';   -- C\n" +
        'SELECT count(*) FROM product WHERE attrs @> \'{"brand": "Casio"}\';  -- D',
      ),
    ),
    options: [
      B('A fails: <code>-&gt;</code> yields <code>jsonb</code> and <code>Casio</code> is not valid JSON; B, C, D return 4', 'A lỗi: <code>-&gt;</code> cho ra <code>jsonb</code> mà <code>Casio</code> không phải JSON hợp lệ; B, C, D ra 4'),
      B('A returns 0 because it compares jsonb with text; B, C, D return 4', 'A trả về 0 vì nó so jsonb với text; B, C, D ra 4'),
      B('C fails — double quotes inside a string literal are not allowed; A, B, D return 4', 'C lỗi — không được có ngoặc kép bên trong hằng chuỗi; A, B, D ra 4'),
      B('None fails; all four return 4 because PostgreSQL casts automatically', 'Không câu nào lỗi; cả bốn ra 4 vì PostgreSQL tự ép kiểu'),
    ],
    correct: 0,
    explanation: EX(
      'Measured: A raises <code>ERROR: invalid input syntax for type json</code>, <code>DETAIL: Token "Casio" is invalid.</code>; B, C and D each return 4. The two arrows differ in type (lesson 13.1): <code>-&gt;</code> returns <code>jsonb</code>, <code>-&gt;&gt;</code> returns <code>text</code>. In A the untyped literal on the right is therefore read as <code>jsonb</code> — and <code>Casio</code> without quotes is not a JSON value, while <code>"Casio"</code> (C) is a JSON string. So it is an error, not a silent 0 (option 2). C is perfectly legal: double quotes inside single-quoted SQL text are ordinary characters (option 3). D is the form to prefer when the column has a GIN index, because containment <code>@&gt;</code> is what <code>jsonb_ops</code>/<code>jsonb_path_ops</code> can answer (13.2). Rule of thumb: <code>-&gt;&gt;</code> to compare with text, <code>-&gt;</code> to keep navigating, <code>@&gt;</code> to filter.',
      'Đo thật: A báo <code>ERROR: invalid input syntax for type json</code>, <code>DETAIL: Token "Casio" is invalid.</code>; B, C và D mỗi câu ra 4. Hai mũi tên khác nhau về kiểu (bài 13.1): <code>-&gt;</code> trả về <code>jsonb</code>, <code>-&gt;&gt;</code> trả về <code>text</code>. Ở A, hằng chưa có kiểu bên phải vì thế được đọc thành <code>jsonb</code> — mà <code>Casio</code> không ngoặc kép thì không phải giá trị JSON, còn <code>"Casio"</code> (C) là một chuỗi JSON. Nên đây là lỗi chứ không phải số 0 lặng lẽ (phương án 2). C hoàn toàn hợp lệ: ngoặc kép bên trong chuỗi SQL nháy đơn chỉ là ký tự bình thường (phương án 3). D là dạng nên dùng khi cột có chỉ mục GIN, vì phép chứa <code>@&gt;</code> là thứ <code>jsonb_ops</code>/<code>jsonb_path_ops</code> trả lời được (13.2). Quy tắc nhớ: <code>-&gt;&gt;</code> để so với chữ, <code>-&gt;</code> để đi sâu tiếp, <code>@&gt;</code> để lọc.',
    ),
  }),

  mcq({
    prompt: B(
      'A search box passes the user\'s words straight to <code>to_tsquery</code>. Run on PostgreSQL 17:' + code(
        "SELECT to_tsquery('simple', 'clean code');\n" +
        '-- ERROR:  syntax error in tsquery: "clean code"\n' +
        "SELECT plainto_tsquery('simple', 'clean code')      AS plain,\n" +
        "       websearch_to_tsquery('simple', 'clean code') AS web;\n" +
        "--       plain       |       web\n" +
        "--  'clean' & 'code' | 'clean' & 'code'",
      ),
      'Một ô tìm kiếm đưa thẳng chữ người dùng gõ vào <code>to_tsquery</code>. Chạy trên PostgreSQL 17:' + code(
        "SELECT to_tsquery('simple', 'clean code');\n" +
        '-- ERROR:  syntax error in tsquery: "clean code"\n' +
        "SELECT plainto_tsquery('simple', 'clean code')      AS plain,\n" +
        "       websearch_to_tsquery('simple', 'clean code') AS web;\n" +
        "--       plain       |       web\n" +
        "--  'clean' & 'code' | 'clean' & 'code'",
      ),
    ),
    options: [
      B('<code>to_tsquery</code> rejects English words under the <code>simple</code> configuration; switch to <code>\'english\'</code>', '<code>to_tsquery</code> từ chối từ tiếng Anh với cấu hình <code>simple</code>; hãy chuyển sang <code>\'english\'</code>'),
      B('The error comes from the missing GIN index; with an index all three functions behave the same', 'Lỗi đến từ việc thiếu chỉ mục GIN; có chỉ mục thì cả ba hàm cư xử như nhau'),
      B('<code>plainto_tsquery</code> searches for the exact phrase "clean code", <code>websearch_to_tsquery</code> for either word', '<code>plainto_tsquery</code> tìm đúng cụm "clean code", còn <code>websearch_to_tsquery</code> tìm một trong hai từ'),
      B('<code>to_tsquery</code> needs operators between terms; user text belongs in <code>plainto_</code> / <code>websearch_to_tsquery</code>', '<code>to_tsquery</code> cần toán tử giữa các từ; chữ người dùng gõ phải vào <code>plainto_</code> / <code>websearch_to_tsquery</code>'),
    ],
    correct: 3,
    explanation: EX(
      '<code>to_tsquery</code> parses a small query language (lesson 13.3): <code>clean &amp; code</code>, <code>clean | code</code>, <code>!draft</code>, <code>clean &lt;-&gt; code</code>. Two words with nothing between them are not a valid expression — so passing raw user input to it turns every search with a space into a 500 error. <code>plainto_tsquery</code> normalises plain text and ANDs the terms; <code>websearch_to_tsquery</code> does the same and also understands the syntax people type into search engines — <code>"quoted phrase"</code>, <code>or</code>, <code>-excluded</code> — without ever raising a syntax error. Measured, both give <code>\'clean\' &amp; \'code\'</code> here, and <code>to_tsvector(\'simple\', name) @@ plainto_tsquery(\'simple\', \'clean code\')</code> finds 1 product (the Clean Code book). The configuration (option 1) controls stemming, not syntax; indexes never change results (option 2); and neither function builds a phrase or an OR from plain words (option 3).',
      '<code>to_tsquery</code> phân tích một ngôn ngữ truy vấn nhỏ (bài 13.3): <code>clean &amp; code</code>, <code>clean | code</code>, <code>!draft</code>, <code>clean &lt;-&gt; code</code>. Hai từ không có gì ở giữa thì không phải biểu thức hợp lệ — nên đưa thẳng chữ người dùng gõ vào nó là biến mọi lần tìm có dấu cách thành lỗi 500. <code>plainto_tsquery</code> chuẩn hoá văn bản thường rồi AND các từ; <code>websearch_to_tsquery</code> làm y vậy và còn hiểu cú pháp mọi người hay gõ vào máy tìm kiếm — <code>"cụm trong ngoặc kép"</code>, <code>or</code>, <code>-loại trừ</code> — mà không bao giờ báo lỗi cú pháp. Đo thật, cả hai ra <code>\'clean\' &amp; \'code\'</code>, và <code>to_tsvector(\'simple\', name) @@ plainto_tsquery(\'simple\', \'clean code\')</code> tìm được 1 sản phẩm (cuốn Clean Code). Cấu hình (phương án 1) quyết định việc đưa từ về gốc, không quyết định cú pháp; chỉ mục không bao giờ làm đổi kết quả (phương án 2); và không hàm nào dựng cụm từ hay phép OR từ chữ thường (phương án 3).',
    ),
  }),

  mcq({
    prompt: B(
      'With <code>pg_trgm</code> (default <code>similarity_threshold</code> = 0.3). Run on PostgreSQL 17 — which output is correct?' + code(
        "SELECT round(similarity('Moleskine', 'Moleskin')::numeric, 3)  AS s1,\n" +
        "       round(similarity('Moleskine', 'Molsekine')::numeric, 3) AS s2,\n" +
        "       'Moleskine' % 'Molsekine'                                AS match2,\n" +
        "       round(similarity('Moleskine', 'Mol')::numeric, 3)        AS s3;",
      ),
      'Với <code>pg_trgm</code> (<code>similarity_threshold</code> mặc định = 0.3). Chạy trên PostgreSQL 17 — output nào đúng?' + code(
        "SELECT round(similarity('Moleskine', 'Moleskin')::numeric, 3)  AS s1,\n" +
        "       round(similarity('Moleskine', 'Molsekine')::numeric, 3) AS s2,\n" +
        "       'Moleskine' % 'Molsekine'                                AS match2,\n" +
        "       round(similarity('Moleskine', 'Mol')::numeric, 3)        AS s3;",
      ),
    ),
    options: [
      B('<code>1.000 | 1.000 | t | 0.333</code> — both typos contain all the letters, so they are identical as trigrams', '<code>1.000 | 1.000 | t | 0.333</code> — cả hai lỗi gõ đều chứa đủ các chữ cái, nên giống hệt nhau về trigram'),
      B('<code>0.889 | 0.778 | t | 0.333</code> — similarity is the share of matching letters', '<code>0.889 | 0.778 | t | 0.333</code> — độ tương đồng là tỷ lệ chữ cái trùng'),
      B('<code>0.727 | 0.429 | t | 0.273</code> — shared 3-letter runs count, and a swap breaks several', '<code>0.727 | 0.429 | t | 0.273</code> — tính theo các cụm 3 chữ chung, và một lần đảo chữ phá vỡ vài cụm'),
      B('<code>0.727 | 0.429 | f | 0.273</code> — <code>%</code> requires similarity above 0.5', '<code>0.727 | 0.429 | f | 0.273</code> — <code>%</code> đòi độ tương đồng trên 0.5'),
    ],
    correct: 2,
    explanation: EX(
      'Measured: <code>0.727 | 0.429 | t | 0.273</code>. A trigram is a run of three characters of the word padded with spaces (lesson 13.4); similarity is shared trigrams divided by the trigrams of both strings combined — not a share of letters (option 2) and not order-blind (option 1): swapping "es" → "se" destroys every trigram that spans the swap. <code>a % b</code> is true when similarity is at least <code>pg_trgm.similarity_threshold</code>, 0.3 by default (measured with <code>SHOW</code>), so 0.429 matches (option 4 has the wrong threshold). That is why <code>WHERE name % \'Moleskin classic\'</code> found <code>Sổ tay Moleskine Classic A5</code> despite the typo. A three-letter prefix scores only 0.273 against the whole word — for "starts with" use <code>ILIKE \'Mol%\'</code>, which a trigram GIN index also accelerates.',
      'Đo thật: <code>0.727 | 0.429 | t | 0.273</code>. Một trigram là chuỗi ba ký tự liên tiếp của từ đã đệm dấu cách (bài 13.4); độ tương đồng là số trigram chung chia cho số trigram gộp của cả hai chuỗi — không phải tỷ lệ chữ cái trùng (phương án 2) và không bỏ qua thứ tự (phương án 1): đảo "es" → "se" phá huỷ mọi trigram vắt qua chỗ đảo. <code>a % b</code> đúng khi độ tương đồng tối thiểu bằng <code>pg_trgm.similarity_threshold</code>, mặc định 0.3 (đo bằng <code>SHOW</code>), nên 0.429 là khớp (phương án 4 sai ngưỡng). Vì thế <code>WHERE name % \'Moleskin classic\'</code> tìm ra <code>Sổ tay Moleskine Classic A5</code> dù gõ sai. Một tiền tố ba chữ chỉ được 0.273 so với cả từ — muốn "bắt đầu bằng" thì dùng <code>ILIKE \'Mol%\'</code>, thứ mà chỉ mục GIN trigram cũng tăng tốc được.',
    ),
  }),

  // ── Chương 14 — Kết nối, pool & vận hành ───────────────────────────────
  mcq({
    prompt: B(
      'Session A opened a transaction, ran one <code>SELECT</code> and then the application stopped talking (a debugger breakpoint). Meanwhile session B updates all 1,000 rows of <code>fe2.hot</code> and vacuums. Measured on PostgreSQL 17:' + code(
        "-- pg_stat_activity: state = 'idle in transaction', backend_xmin IS NOT NULL = t\n" +
        'VACUUM (VERBOSE) fe2.hot;\n' +
        '-- tuples: 0 removed, 2000 remain, 1000 are dead but not yet removable\n' +
        '-- … A commits, then:\n' +
        'VACUUM (VERBOSE) fe2.hot;\n' +
        '-- tuples: 1000 removed, 1000 remain, 0 are dead but not yet removable',
      ),
      'Phiên A mở một giao dịch, chạy một câu <code>SELECT</code> rồi ứng dụng ngừng nói chuyện (dừng ở breakpoint của debugger). Trong lúc đó phiên B cập nhật cả 1.000 dòng của <code>fe2.hot</code> rồi vacuum. Đo trên PostgreSQL 17:' + code(
        "-- pg_stat_activity: state = 'idle in transaction', backend_xmin IS NOT NULL = t\n" +
        'VACUUM (VERBOSE) fe2.hot;\n' +
        '-- tuples: 0 removed, 2000 remain, 1000 are dead but not yet removable\n' +
        '-- … A commits, then:\n' +
        'VACUUM (VERBOSE) fe2.hot;\n' +
        '-- tuples: 1000 removed, 1000 remain, 0 are dead but not yet removable',
      ),
    ),
    options: [
      B('A\'s open snapshot may still need the old versions, so VACUUM cannot remove them until A ends', 'Snapshot đang mở của A có thể vẫn cần các phiên bản cũ, nên VACUUM không gỡ được chúng cho tới khi A kết thúc'),
      B('VACUUM was blocked by a lock held by A and would have waited if not run in VERBOSE mode', 'VACUUM bị chặn bởi một khoá A đang giữ và lẽ ra đã phải chờ nếu không chạy ở chế độ VERBOSE'),
      B('The first VACUUM ran too soon after the UPDATE; dead tuples always need one autovacuum cycle to age', 'VACUUM đầu chạy quá sớm sau UPDATE; dòng chết luôn cần một chu kỳ autovacuum để "già" đi'),
      B('An idle session costs nothing; the 1,000 dead tuples were kept because the table is small', 'Một phiên rảnh không tốn gì; 1.000 dòng chết được giữ lại vì bảng nhỏ'),
    ],
    correct: 0,
    explanation: EX(
      'MVCC can only remove a dead row version once <b>no</b> running transaction could still see it. A\'s <code>REPEATABLE READ</code> snapshot was taken before B\'s update, so the 1,000 old versions are still visible to A — VACUUM reports them as "dead but not yet removable". The moment A commits, the same VACUUM removes all 1,000 (lesson 14.3, the "three things block vacuum" list). Nothing was locked (option 2): plain VACUUM never waits on row locks, and VERBOSE only prints more. There is no ageing period (option 3) — the second run happened seconds later. Option 4 is the dangerous belief: an <code>idle in transaction</code> session also pins locks it took, and if it is left for days it can drive a busy database toward bloat and, at the extreme, wraparound protection. In <code>pg_stat_activity</code> look for that state with an old <code>xact_start</code>.',
      'MVCC chỉ gỡ được một phiên bản dòng chết khi <b>không còn</b> giao dịch đang chạy nào có thể nhìn thấy nó. Snapshot <code>REPEATABLE READ</code> của A được chụp trước khi B cập nhật, nên 1.000 phiên bản cũ vẫn còn nhìn thấy được với A — VACUUM báo chúng là "dead but not yet removable". Ngay khi A commit, cùng câu VACUUM đó gỡ cả 1.000 dòng (bài 14.3, danh sách "ba thứ chặn vacuum"). Không có gì bị khoá (phương án 2): VACUUM thường không bao giờ chờ khoá dòng, và VERBOSE chỉ in nhiều hơn. Không có thời gian "ủ" nào (phương án 3) — lần chạy thứ hai chỉ sau vài giây. Phương án 4 là niềm tin nguy hiểm: một phiên <code>idle in transaction</code> còn ghim cả các khoá nó đã lấy, và nếu bị bỏ quên nhiều ngày nó có thể đẩy một cơ sở dữ liệu bận rộn tới bloat và, ở mức cực đoan, tới cơ chế chống wraparound. Trong <code>pg_stat_activity</code> hãy tìm trạng thái đó kèm <code>xact_start</code> đã cũ.',
    ),
  }),

  mcq({
    prompt: B(
      'A forgotten <code>idle in transaction</code> session has been pinning the vacuum horizon for weeks on a busy database. Monitoring shows <code>age(datfrozenxid)</code> climbing past 2 billion, and then every write fails with <code>database is not accepting commands to avoid wraparound data loss</code>. What is happening, and what is the recovery on PostgreSQL 17?',
      'Một phiên <code>idle in transaction</code> bị bỏ quên đã ghìm mốc vacuum hàng tuần trên một cơ sở dữ liệu bận rộn. Bảng theo dõi cho thấy <code>age(datfrozenxid)</code> leo quá 2 tỷ, rồi mọi lệnh ghi đều hỏng với <code>database is not accepting commands to avoid wraparound data loss</code>. Chuyện gì đang xảy ra, và cách khôi phục trên PostgreSQL 17 là gì?',
    ),
    options: [
      B('The disk is full; delete old WAL files from <code>pg_wal</code> by hand and restart', 'Đĩa đầy; xoá tay các file WAL cũ trong <code>pg_wal</code> rồi khởi động lại'),
      B('The 32-bit transaction counter is near wrapping and rows could not be frozen; end the blocker, then VACUUM normally', 'Bộ đếm giao dịch 32 bit sắp quay vòng mà các dòng chưa được đóng băng; kết thúc thứ đang chặn, rồi VACUUM bình thường'),
      B('The table has hit the 2-billion-row limit of a <code>bigint</code> primary key; change it to <code>numeric</code>', 'Bảng đã chạm giới hạn 2 tỷ dòng của khoá chính <code>bigint</code>; đổi nó sang <code>numeric</code>'),
      B('Restart the server: wraparound protection resets on start-up, and writes resume immediately', 'Khởi động lại máy chủ: cơ chế chống wraparound được đặt lại khi khởi động, và lệnh ghi chạy lại ngay'),
    ],
    correct: 1,
    explanation: EX(
      'Lesson 14.3\'s trap, reproduced for real in its slides. Row visibility compares 32-bit transaction ids, so the counter wraps around; to keep old rows visible after it does, VACUUM has a second job — <b>freezing</b> rows old enough that every transaction can see them. Anything that blocks vacuum (an <code>idle in transaction</code> session, an abandoned replication slot, a forgotten prepared transaction) also blocks freezing, and <code>age(datfrozenxid)</code> keeps rising. PostgreSQL warns first, then refuses new transactions rather than risk old rows suddenly looking like the future — a full write outage, while reads continue. Recovery on 17: find and end the holder (<code>pg_stat_activity</code>, <code>pg_replication_slots</code>, <code>pg_prepared_xacts</code>), then <code>VACUUM</code> the database normally; since PostgreSQL 16 the documentation no longer recommends single-user mode. A restart changes nothing (option 4) — the ages are stored in the catalog. It is not about disk space (option 1, and deleting files in <code>pg_wal</code> by hand corrupts the cluster) or row counts (option 3: <code>bigint</code> goes far beyond 2 billion). Prevention: alert on <code>age(datfrozenxid)</code> long before 2 billion (16.3\'s checklist).',
      'Cái bẫy của bài 14.3, được dựng lại thật trong slide của bài. Tính nhìn thấy của dòng so sánh id giao dịch 32 bit, nên bộ đếm quay vòng; để các dòng cũ vẫn nhìn thấy được sau khi nó quay, VACUUM có việc thứ hai — <b>đóng băng</b> các dòng đủ cũ để mọi giao dịch đều thấy. Thứ gì chặn vacuum (một phiên <code>idle in transaction</code>, một replication slot bị bỏ rơi, một prepared transaction bị quên) cũng chặn luôn việc đóng băng, và <code>age(datfrozenxid)</code> cứ tăng. PostgreSQL cảnh báo trước, rồi từ chối giao dịch mới thay vì để các dòng cũ bỗng trông như thuộc về tương lai — sập toàn bộ việc ghi, trong khi đọc vẫn chạy. Khôi phục trên bản 17: tìm và kết thúc thứ đang ghìm (<code>pg_stat_activity</code>, <code>pg_replication_slots</code>, <code>pg_prepared_xacts</code>), rồi <code>VACUUM</code> cơ sở dữ liệu bình thường; từ PostgreSQL 16 tài liệu không còn khuyên dùng chế độ single-user. Khởi động lại chẳng đổi gì (phương án 4) — các "tuổi" được lưu trong catalog. Đây không phải chuyện dung lượng đĩa (phương án 1, mà xoá tay file trong <code>pg_wal</code> còn làm hỏng cả cụm) hay số dòng (phương án 3: <code>bigint</code> vượt xa 2 tỷ). Phòng ngừa: báo động trên <code>age(datfrozenxid)</code> từ rất lâu trước mốc 2 tỷ (checklist của bài 16.3).',
    ),
  }),

  mcq({
    prompt: B(
      '<code>max_connections = 100</code>, 3 reserved for superusers. The API runs 4 containers, each with a Prisma pool of 20. Everything is fine — until every rolling deploy, when the log fills with <code>sorry, too many clients already</code> for a minute. Why?',
      '<code>max_connections = 100</code>, 3 kết nối dành cho superuser. API chạy 4 container, mỗi container một pool Prisma 20 kết nối. Mọi thứ ổn — cho tới mỗi lần deploy cuốn chiếu, log ngập <code>sorry, too many clients already</code> trong một phút. Vì sao?',
    ),
    options: [
      B('Prisma opens one connection per HTTP request during start-up, ignoring the pool size', 'Prisma mở một kết nối cho mỗi request HTTP trong lúc khởi động, bỏ qua kích thước pool'),
      B('Deploys restart PostgreSQL, and connections fail until it is back', 'Deploy khởi động lại PostgreSQL, và kết nối hỏng cho tới khi nó lên lại'),
      B('The 3 reserved connections are used by the deploy script, leaving 97 for nobody', '3 kết nối dự trữ bị script deploy chiếm, để lại 97 cho không ai cả'),
      B('Rolling deploys overlap old and new containers: 8 × 20 = 160 connections at the peak, over the 97 available', 'Deploy cuốn chiếu để container cũ và mới chồng nhau: đỉnh 8 × 20 = 160 kết nối, vượt 97 chỗ còn trống'),
    ],
    correct: 3,
    explanation: EX(
      'Lesson 14.2: "then multiply, and compare to the limit". Each connection is a process with its own memory (14.1), so <code>max_connections</code> is a hard wall, and the number to compare with it is <b>instances × pool size at the worst moment</b>. A rolling deploy deliberately overlaps old and new instances so the site stays up — which doubles the pools for that window. The same arithmetic appears as capstone Case 3 in Chapter 16. Fixes, in order of preference: size each pool so the overlap still fits (8 × 12 = 96), or put PgBouncer in transaction mode between the apps and the database so hundreds of client connections share a few dozen server ones. Raising <code>max_connections</code> to 500 trades the clean refusal for memory pressure. Option 1 is false — the pool caps connections. Options 2 and 3 do not match the symptom: the database stays up, and superuser slots are not taken by the app.',
      'Bài 14.2: "rồi nhân lên, và so với giới hạn". Mỗi kết nối là một tiến trình có bộ nhớ riêng (14.1), nên <code>max_connections</code> là một bức tường cứng, và con số phải đem so với nó là <b>số instance × kích thước pool ở thời điểm tệ nhất</b>. Deploy cuốn chiếu cố ý để instance cũ và mới chồng lên nhau cho trang không chết — tức nhân đôi số pool trong khoảng đó. Cùng phép tính này xuất hiện ở Ca 3 của capstone Chương 16. Cách sửa, theo thứ tự nên chọn: đặt pool mỗi instance sao cho lúc chồng vẫn lọt (8 × 12 = 96), hoặc đặt PgBouncer chế độ transaction giữa app và cơ sở dữ liệu để hàng trăm kết nối client dùng chung vài chục kết nối máy chủ. Nâng <code>max_connections</code> lên 500 là đổi lời từ chối gọn gàng lấy áp lực bộ nhớ. Phương án 1 sai — pool chặn số kết nối. Phương án 2 và 3 không khớp triệu chứng: cơ sở dữ liệu vẫn sống, và ô superuser không bị app chiếm.',
    ),
  }),

  // ── Chương 15 — Sao lưu, nhân bản & mở rộng ────────────────────────────
  mcq({
    prompt: B(
      'Two backups of the same table, made with <code>pg_dump</code> 17.11. Restoring them, both commands below fail. Measured:' + code(
        'pg_dump -d thi2 -t fe2.ledger -f ledger.sql          # plain format\n' +
        'pg_dump -d thi2 -t fe2.ledger -Fc -f ledger.dump     # custom format (file starts with "PGDMP")\n' +
        '\n' +
        'pg_restore -d thi2 --list ledger.sql\n' +
        '# pg_restore: error: input file appears to be a text format dump. Please use psql.\n' +
        'psql -d thi2 -f ledger.dump\n' +
        '# The input is a PostgreSQL custom-format dump.\n' +
        '# Use the pg_restore command-line client to restore this dump to a database.',
      ),
      'Hai bản sao lưu của cùng một bảng, tạo bằng <code>pg_dump</code> 17.11. Khi khôi phục, cả hai lệnh dưới đều hỏng. Đo thật:' + code(
        'pg_dump -d thi2 -t fe2.ledger -f ledger.sql          # dạng plain\n' +
        'pg_dump -d thi2 -t fe2.ledger -Fc -f ledger.dump     # dạng custom (file bắt đầu bằng "PGDMP")\n' +
        '\n' +
        'pg_restore -d thi2 --list ledger.sql\n' +
        '# pg_restore: error: input file appears to be a text format dump. Please use psql.\n' +
        'psql -d thi2 -f ledger.dump\n' +
        '# The input is a PostgreSQL custom-format dump.\n' +
        '# Use the pg_restore command-line client to restore this dump to a database.',
      ),
    ),
    options: [
      B('Both files are corrupt; a dump made by version 17 cannot be read back by version 17', 'Cả hai file đều hỏng; bản dump do bản 17 tạo ra không đọc lại được bằng bản 17'),
      B('A plain dump is a SQL script for <code>psql</code>; a custom dump is an archive for <code>pg_restore</code>', 'Bản plain là kịch bản SQL cho <code>psql</code>; bản custom là kho lưu trữ cho <code>pg_restore</code>'),
      B('<code>pg_restore</code> needs the <code>-C</code> flag to read plain files', '<code>pg_restore</code> cần cờ <code>-C</code> mới đọc được file plain'),
      B('Custom-format dumps are only for whole databases; a single table must use plain format', 'Bản dump dạng custom chỉ dành cho cả cơ sở dữ liệu; một bảng đơn phải dùng dạng plain'),
    ],
    correct: 1,
    explanation: EX(
      'Lesson 15.1: <code>pg_dump</code> writes either a <b>plain SQL script</b> — <code>CREATE TABLE</code>, <code>COPY … FROM stdin</code>, the data, <code>ALTER TABLE … ADD CONSTRAINT</code> — that any <code>psql</code> can replay, or an <b>archive</b> (<code>-Fc</code> custom, <code>-Fd</code> directory) that only <code>pg_restore</code> understands. Each tool recognises the other\'s format and says so, as measured. The archive is usually the better choice for real backups: <code>pg_restore --list</code> showed its table of contents (TABLE, TABLE DATA, CONSTRAINT <code>ledger_pkey</code>), so you can restore one table out of a whole-database dump, reorder steps, or restore with <code>-j 4</code>. Nothing is corrupt (option 1). <code>-C</code> means "create the database" (option 3). Custom format works for any selection, including one table — the one measured here (option 4). Whichever format you pick, a backup counts only once you have restored it.',
      'Bài 15.1: <code>pg_dump</code> ghi ra hoặc một <b>kịch bản SQL thuần</b> — <code>CREATE TABLE</code>, <code>COPY … FROM stdin</code>, dữ liệu, <code>ALTER TABLE … ADD CONSTRAINT</code> — mà <code>psql</code> nào cũng phát lại được, hoặc một <b>kho lưu trữ</b> (<code>-Fc</code> custom, <code>-Fd</code> thư mục) mà chỉ <code>pg_restore</code> hiểu. Mỗi công cụ nhận ra định dạng của bên kia và nói thẳng, như đo được. Kho lưu trữ thường là lựa chọn tốt hơn cho sao lưu thật: <code>pg_restore --list</code> in ra mục lục của nó (TABLE, TABLE DATA, CONSTRAINT <code>ledger_pkey</code>), nên bạn có thể khôi phục một bảng từ bản dump cả cơ sở dữ liệu, sắp lại các bước, hay khôi phục với <code>-j 4</code>. Không có gì hỏng (phương án 1). <code>-C</code> nghĩa là "tạo cơ sở dữ liệu" (phương án 3). Dạng custom dùng được cho mọi lựa chọn, kể cả một bảng — đúng trường hợp đo ở đây (phương án 4). Chọn định dạng nào thì cũng vậy: bản sao lưu chỉ được tính khi bạn đã khôi phục thử nó.',
    ),
  }),

  mcq({
    prompt: B(
      'An events table is range-partitioned by month (September and October exist). Run on PostgreSQL 17 in order:' + code(
        "INSERT INTO ev VALUES (3, '2026-11-02 09:00+07', 'view');\n" +
        '-- ERROR:  no partition of relation "ev" found for row\n' +
        'CREATE TABLE ev_default PARTITION OF ev DEFAULT;\n' +
        "INSERT INTO ev VALUES (3, '2026-11-02 09:00+07', 'view');      -- INSERT 0 1 (lands in ev_default)\n" +
        '-- a week later, the monthly job:\n' +
        "CREATE TABLE ev_2026_11 PARTITION OF ev FOR VALUES FROM ('2026-11-01 00:00+07') TO ('2026-12-01 00:00+07');",
      ),
      'Một bảng sự kiện được phân mảnh theo khoảng tháng (đã có tháng 9 và tháng 10). Chạy trên PostgreSQL 17 theo thứ tự:' + code(
        "INSERT INTO ev VALUES (3, '2026-11-02 09:00+07', 'view');\n" +
        '-- ERROR:  no partition of relation "ev" found for row\n' +
        'CREATE TABLE ev_default PARTITION OF ev DEFAULT;\n' +
        "INSERT INTO ev VALUES (3, '2026-11-02 09:00+07', 'view');      -- INSERT 0 1 (vào ev_default)\n" +
        '-- một tuần sau, tác vụ hằng tháng:\n' +
        "CREATE TABLE ev_2026_11 PARTITION OF ev FOR VALUES FROM ('2026-11-01 00:00+07') TO ('2026-12-01 00:00+07');",
      ),
    ),
    options: [
      B('It fails: the default partition already holds a November row, which must be moved out first', 'Nó lỗi: mảnh default đã chứa một dòng tháng 11, phải chuyển dòng đó ra trước'),
      B('It succeeds and PostgreSQL moves the November row from the default into the new partition automatically', 'Nó thành công và PostgreSQL tự chuyển dòng tháng 11 từ mảnh default sang mảnh mới'),
      B('It succeeds, and the November row stays in the default partition, so it is counted twice by queries on November', 'Nó thành công, và dòng tháng 11 vẫn ở lại mảnh default, nên bị đếm hai lần trong các truy vấn về tháng 11'),
      B('A table with a default partition cannot get new partitions at all; it has to be recreated', 'Bảng đã có mảnh default thì không thể thêm mảnh mới nữa; phải tạo lại bảng'),
    ],
    correct: 0,
    explanation: EX(
      'Measured exactly as shown. A row with no matching partition is refused (lesson 15.4) — loud, which is good. A <code>DEFAULT</code> partition makes such rows land somewhere instead, which is convenient until you create the partition they really belong to: the default partition\'s implicit constraint becomes "everything except November", and a November row is already inside, so PostgreSQL refuses rather than leave a row in the wrong place (option 3 cannot happen) — and it does not move rows for you (option 2). New partitions can still be added once the conflicting rows are gone (option 4): detach or empty the default, create November, re-insert. Two habits follow: create next month\'s partition well ahead (a job or <code>pg_partman</code>), and alert when the default partition is not empty. Note also the pruning rule from the same lesson: a filter on the raw key prunes to one partition, a function wrapped around the key (<code>date_trunc(…, at)</code>) scans them all.',
      'Đo đúng như in ở trên. Một dòng không có mảnh nào khớp sẽ bị từ chối (bài 15.4) — ồn ào, và thế là tốt. Mảnh <code>DEFAULT</code> khiến những dòng như vậy rơi vào đâu đó, tiện cho tới lúc bạn tạo mảnh mà chúng thật sự thuộc về: ràng buộc ngầm của mảnh default trở thành "mọi thứ trừ tháng 11", mà một dòng tháng 11 đã nằm sẵn bên trong, nên PostgreSQL từ chối thay vì để một dòng nằm sai chỗ (phương án 3 không thể xảy ra) — và nó không tự chuyển dòng giùm bạn (phương án 2). Vẫn thêm mảnh mới được một khi các dòng xung đột đã đi (phương án 4): tách hoặc dọn mảnh default, tạo tháng 11, chèn lại. Hai thói quen rút ra: tạo mảnh của tháng sau từ sớm (một tác vụ định kỳ hoặc <code>pg_partman</code>), và báo động khi mảnh default không rỗng. Nhớ thêm luật cắt tỉa trong cùng bài: lọc trên khoá trần thì chỉ quét một mảnh, bọc khoá trong một hàm (<code>date_trunc(…, at)</code>) thì quét hết mọi mảnh.',
    ),
  }),

  mcq({
    prompt: B(
      'Production has one streaming replica, <code>sync_state = async</code> (the default). The primary\'s disk dies at 10:00:00.200; the last commit it acknowledged to a user was at 10:00:00.150. You promote the replica. What is the honest statement?',
      'Production có một bản sao streaming, <code>sync_state = async</code> (mặc định). Đĩa của máy chính chết lúc 10:00:00.200; lần commit cuối nó báo thành công cho người dùng là lúc 10:00:00.150. Bạn nâng bản sao lên làm máy chính. Câu nào là câu nói thật?',
    ),
    options: [
      B('Nothing can be lost: a replica receives each transaction before the primary commits it', 'Không gì có thể mất: bản sao nhận từng giao dịch trước khi máy chính commit nó'),
      B('Everything since the last <code>pg_dump</code> is lost, because a replica is only refreshed by dumps', 'Mọi thứ kể từ lần <code>pg_dump</code> gần nhất đều mất, vì bản sao chỉ được làm mới bằng dump'),
      B('The replica refuses promotion until the old primary\'s WAL is recovered', 'Bản sao từ chối được nâng cấp cho tới khi khôi phục được WAL của máy chính cũ'),
      B('Commits acknowledged on the primary but not yet shipped to the async replica may be lost', 'Các commit đã báo thành công trên máy chính nhưng chưa kịp gửi sang bản sao async có thể bị mất'),
    ],
    correct: 3,
    explanation: EX(
      'With asynchronous streaming replication (lesson 15.3) the primary flushes WAL to its <b>own</b> disk, acknowledges the commit, and ships the WAL to the replica a moment later. Usually that lag is milliseconds — lesson 15.3 measured <code>replay_lag</code> under a second even while 68 MB was in flight — but if the primary dies inside that window, the acknowledged-but-unshipped commits exist nowhere else. That is option 4, and it is why <code>pg_wal_lsn_diff(sent_lsn, replay_lsn)</code> belongs on the dashboard. Option 1 describes synchronous replication (<code>synchronous_standby_names</code> + <code>synchronous_commit = on</code>), which makes each commit wait for the standby. Option 2 confuses replication with logical backups. Option 3 is wrong: promotion works without the dead primary — that is the point of having a replica; the cost is the possible small loss.',
      'Với nhân bản streaming bất đồng bộ (bài 15.3), máy chính đẩy WAL xuống đĩa <b>của chính nó</b>, báo commit thành công, rồi một lát sau mới chuyển WAL sang bản sao. Thường độ trễ đó chỉ vài mili-giây — bài 15.3 đo <code>replay_lag</code> dưới một giây kể cả khi 68 MB đang trên đường — nhưng nếu máy chính chết đúng trong cửa sổ đó, các commit đã báo thành công mà chưa kịp gửi đi không còn tồn tại ở đâu khác. Đó là phương án 4, và là lý do <code>pg_wal_lsn_diff(sent_lsn, replay_lsn)</code> phải có trên bảng theo dõi. Phương án 1 mô tả nhân bản đồng bộ (<code>synchronous_standby_names</code> + <code>synchronous_commit = on</code>), thứ bắt mỗi commit chờ bản sao. Phương án 2 nhầm nhân bản với sao lưu logic. Phương án 3 sai: nâng cấp chạy được mà không cần máy chính đã chết — đó chính là lý do có bản sao; cái giá là khả năng mất một ít.',
    ),
  }),

  // ── Chương 16 — PostgreSQL trên production & capstone ──────────────────
  mcq({
    prompt: B(
      'Three real sessions. A has an open transaction that read <code>fe2.job</code>. B runs a migration. C is an ordinary request. Measured on PostgreSQL 17:' + code(
        '-- A: BEGIN; SELECT count(*) FROM fe2.job;      … idle in transaction\n' +
        '-- B: ALTER TABLE fe2.job ADD COLUMN note text;  … waits (wait_event_type = Lock)\n' +
        "-- C: SET lock_timeout = '2s'; SELECT count(*) FROM fe2.job;\n" +
        '--    ERROR:  canceling statement due to lock timeout          (after 2001 ms)\n' +
        '-- B finally: ALTER TABLE  Time: 7444 ms\n' +
        '\n' +
        "-- rerun B with SET lock_timeout = '1s':\n" +
        '--    ERROR:  canceling statement due to lock timeout          (after 1000 ms)',
      ),
      'Ba phiên thật. A có một giao dịch đang mở đã đọc <code>fe2.job</code>. B chạy một migration. C là một request bình thường. Đo trên PostgreSQL 17:' + code(
        '-- A: BEGIN; SELECT count(*) FROM fe2.job;      … idle in transaction\n' +
        '-- B: ALTER TABLE fe2.job ADD COLUMN note text;  … chờ (wait_event_type = Lock)\n' +
        "-- C: SET lock_timeout = '2s'; SELECT count(*) FROM fe2.job;\n" +
        '--    ERROR:  canceling statement due to lock timeout          (sau 2001 ms)\n' +
        '-- Cuối cùng B: ALTER TABLE  Time: 7444 ms\n' +
        '\n' +
        "-- chạy lại B với SET lock_timeout = '1s':\n" +
        '--    ERROR:  canceling statement due to lock timeout          (sau 1000 ms)',
      ),
    ),
    options: [
      B('B waits for A\'s lock, and C queues behind B — set a short <code>lock_timeout</code> on the migration', 'B chờ khoá của A, còn C xếp hàng sau B — đặt <code>lock_timeout</code> ngắn cho migration'),
      B('C was blocked by A directly: readers block readers when a transaction is open', 'C bị chính A chặn: người đọc chặn người đọc khi có giao dịch đang mở'),
      B('<code>ADD COLUMN</code> rewrote the whole table, which is why it took 7.4 s and why C had to wait', '<code>ADD COLUMN</code> viết lại cả bảng, nên mới tốn 7,4 s và C mới phải chờ'),
      B('<code>lock_timeout</code> on B is useless; the fix is to raise <code>max_connections</code> so C gets a free connection', '<code>lock_timeout</code> cho B là vô ích; cách sửa là nâng <code>max_connections</code> để C có kết nối trống'),
    ],
    correct: 0,
    explanation: EX(
      'Lesson 16.1 / 16.3 ("migrations that cannot take the site down"). A\'s <code>SELECT</code> holds an ACCESS SHARE lock on the table until A ends. <code>ALTER TABLE</code> wants ACCESS EXCLUSIVE, which conflicts with it, so B waits — measured <code>wait_event_type = Lock</code>, blocked by one pid. Lock requests are granted in order, so C\'s ACCESS SHARE, which would be compatible with A, must wait behind B: one idle transaction plus one migration equals a stalled table. B finished after 7.4 s only because A happened to commit at 9 s; the work itself is milliseconds (adding a nullable column without a default is a catalog change, not a rewrite — option 3). Readers never block readers (option 2); the queue does. <code>max_connections</code> is irrelevant (option 4). The defence measured on the last line: <code>SET lock_timeout = \'1s\'</code> before DDL, so B gives up after a second, the site keeps serving, and the deploy retries.',
      'Bài 16.1 / 16.3 ("migration không thể làm chết trang"). Câu <code>SELECT</code> của A giữ khoá ACCESS SHARE trên bảng tới khi A kết thúc. <code>ALTER TABLE</code> cần ACCESS EXCLUSIVE, xung đột với khoá đó, nên B chờ — đo được <code>wait_event_type = Lock</code>, bị một pid chặn. Các yêu cầu khoá được cấp theo thứ tự, nên ACCESS SHARE của C — vốn tương thích với A — phải chờ sau B: một giao dịch rảnh cộng một migration là cả bảng đứng hình. B xong sau 7,4 s chỉ vì A tình cờ commit ở giây thứ 9; bản thân công việc chỉ vài mili-giây (thêm cột cho phép NULL, không default là thay đổi catalog, không viết lại bảng — phương án 3). Người đọc không bao giờ chặn người đọc (phương án 2); chính hàng đợi chặn. <code>max_connections</code> không liên quan (phương án 4). Cách phòng thủ đo ở dòng cuối: <code>SET lock_timeout = \'1s\'</code> trước DDL, để B bỏ cuộc sau một giây, trang vẫn phục vụ, và quá trình deploy thử lại.',
    ),
  }),

  mcq({
    prompt: B(
      'Since read replicas were added, users sometimes save a profile, are redirected, and see the old value — refreshing a moment later shows the new one. No errors anywhere. What is the most likely cause, and the fix?',
      'Từ khi thêm bản sao chỉ-đọc, thỉnh thoảng người dùng lưu hồ sơ, được chuyển trang, và thấy giá trị cũ — tải lại một lát sau thì thấy giá trị mới. Không có lỗi ở đâu cả. Nguyên nhân khả dĩ nhất và cách sửa?',
    ),
    options: [
      B('The browser cached the old page; add <code>Cache-Control: no-store</code>', 'Trình duyệt đã lưu trang cũ; thêm <code>Cache-Control: no-store</code>'),
      B('The write ran at <code>READ COMMITTED</code>; switching the app to <code>SERIALIZABLE</code> makes it visible at once', 'Lệnh ghi chạy ở <code>READ COMMITTED</code>; chuyển app sang <code>SERIALIZABLE</code> thì nó hiện ra ngay'),
      B('The read after the redirect hit an async replica that had not replayed the write; read your writes from the primary', 'Lần đọc sau khi chuyển trang rơi vào bản sao async chưa phát lại lệnh ghi; đọc thứ mình vừa ghi từ máy chính'),
      B('A trigger on the profile table delays the commit by a few seconds', 'Một trigger trên bảng hồ sơ làm commit trễ vài giây'),
    ],
    correct: 2,
    explanation: EX(
      'This is capstone Case 4 of lesson 16.4, word for word: intermittent, no errors, appeared exactly when replicas were introduced. The first query, on the primary, is <code>SELECT state, sync_state, pg_wal_lsn_diff(sent_lsn, replay_lsn) FROM pg_stat_replication</code>: an <code>async</code> replica a few hundred kilobytes behind explains everything. The data is not lost — the replica catches up, which is why a refresh fixes it — but a read routed to it immediately after the write sees the past (15.3). Isolation levels (option 2) govern concurrent transactions on <b>one</b> server; no level on the primary can make a different machine catch up faster. A browser cache (option 1) would not change on refresh like this, and the problem started with the replicas, not with a deploy of headers. A trigger runs inside the transaction (option 4): it would slow the save, not make a committed value invisible afterwards.',
      'Đây chính là Ca 4 của capstone bài 16.4, từng chữ: chập chờn, không có lỗi, xuất hiện đúng lúc thêm bản sao. Truy vấn đầu tiên, trên máy chính, là <code>SELECT state, sync_state, pg_wal_lsn_diff(sent_lsn, replay_lsn) FROM pg_stat_replication</code>: một bản sao <code>async</code> chậm vài trăm kilobyte giải thích được tất cả. Dữ liệu không mất — bản sao sẽ đuổi kịp, nên tải lại là hết — nhưng một lần đọc bị chuyển sang nó ngay sau khi ghi sẽ thấy quá khứ (15.3). Mức cô lập (phương án 2) điều khiển các giao dịch đồng thời trên <b>một</b> máy chủ; không mức nào trên máy chính làm một máy khác đuổi kịp nhanh hơn. Bộ đệm trình duyệt (phương án 1) không đổi khi tải lại kiểu này, và sự cố bắt đầu cùng bản sao, chứ không phải cùng một lần deploy header. Trigger chạy bên trong giao dịch (phương án 4): nó làm việc lưu chậm đi, không làm một giá trị đã commit bị khuất sau đó.',
    ),
  }),

  mcq({
    prompt: B(
      'You inherit a production database and nobody knows which queries are slow. Lesson 16.2 calls one query "the highest-value query in this lesson". Its output shows a table with <code>n_live_tup = 4,800,000</code>, <code>seq_scan = 91,000</code>, <code>idx_scan = 12</code>. What does it tell you?',
      'Bạn tiếp quản một cơ sở dữ liệu production và không ai biết truy vấn nào chậm. Bài 16.2 gọi một truy vấn là "truy vấn đáng giá nhất của bài này". Output của nó cho thấy một bảng có <code>n_live_tup = 4.800.000</code>, <code>seq_scan = 91.000</code>, <code>idx_scan = 12</code>. Nó nói với bạn điều gì?',
    ),
    options: [
      B('The table is healthy: sequential scans are always faster than index scans on big tables', 'Bảng khoẻ mạnh: quét tuần tự luôn nhanh hơn quét chỉ mục trên bảng lớn'),
      B('A big table scanned end to end 91,000 times and almost never via an index: a missing index', 'Một bảng lớn bị quét trọn 91.000 lần và gần như không qua chỉ mục: thiếu chỉ mục'),
      B('The table needs <code>VACUUM FULL</code>; a high <code>seq_scan</code> means it is bloated', 'Bảng cần <code>VACUUM FULL</code>; <code>seq_scan</code> cao nghĩa là nó bị phình'),
      B('The statistics are stale; <code>ANALYZE</code> will move the counts from <code>seq_scan</code> to <code>idx_scan</code>', 'Thống kê đã cũ; <code>ANALYZE</code> sẽ chuyển các số đếm từ <code>seq_scan</code> sang <code>idx_scan</code>'),
    ],
    correct: 1,
    explanation: EX(
      'Lesson 16.2\'s query is <code>SELECT relname, seq_scan, idx_scan, n_live_tup FROM pg_stat_user_tables ORDER BY seq_scan DESC</code>. A big <code>n_live_tup</code>, a high <code>seq_scan</code> and a tiny <code>idx_scan</code> together say: something filters this table often, and no index matches that filter — Chapter 9\'s problem, located from the database\'s own counters. The counters record what the executor did; they say nothing about bloat (option 3 — that is <code>n_dead_tup</code> and size), and <code>ANALYZE</code> refreshes planner estimates without rewriting history (option 4). Option 1 inverts lesson 9.3: a Seq Scan is right for a filter that keeps a large share of the rows, not for 91,000 scans of a 4.8-million-row table. Two cautions: the counters are cumulative since the last statistics reset, and they are per server — a replica keeps its own.',
      'Truy vấn của bài 16.2 là <code>SELECT relname, seq_scan, idx_scan, n_live_tup FROM pg_stat_user_tables ORDER BY seq_scan DESC</code>. <code>n_live_tup</code> lớn, <code>seq_scan</code> cao và <code>idx_scan</code> bé xíu cùng nói một điều: có thứ gì đó lọc bảng này thường xuyên, và không chỉ mục nào khớp với điều kiện lọc đó — vấn đề của Chương 9, định vị bằng chính các bộ đếm của cơ sở dữ liệu. Các bộ đếm ghi lại việc bộ thực thi đã làm; chúng không nói gì về bloat (phương án 3 — đó là <code>n_dead_tup</code> và kích thước), và <code>ANALYZE</code> làm mới ước lượng của bộ lập kế hoạch chứ không viết lại lịch sử (phương án 4). Phương án 1 đảo ngược bài 9.3: Seq Scan đúng cho một điều kiện giữ lại phần lớn các dòng, không đúng cho 91.000 lần quét một bảng 4,8 triệu dòng. Hai lưu ý: các bộ đếm cộng dồn kể từ lần reset thống kê gần nhất, và chúng theo từng máy chủ — bản sao giữ bộ đếm riêng của nó.',
    ),
  }),

  // ── Chương 17 — SQL Server · MySQL · PostgreSQL · MongoDB ───────────────
  mcq({
    prompt: B(
      'The same script ran on MySQL 8 and on PostgreSQL 17 (lesson 17.2, measured). After the <code>ROLLBACK</code>, <code>audit_log</code> has <b>1</b> row on MySQL and <b>0</b> on PostgreSQL. Why?' + code(
        'CREATE TABLE audit_log (msg text);\n' +
        'BEGIN;                         -- START TRANSACTION in MySQL\n' +
        "INSERT INTO audit_log VALUES ('price change');\n" +
        'CREATE TABLE t_ddl (id int);\n' +
        'INSERT INTO t_ddl VALUES (1);\n' +
        'ROLLBACK;\n' +
        'SELECT count(*) FROM audit_log;   -- MySQL: 1 · PostgreSQL: 0',
      ),
      'Cùng một kịch bản chạy trên MySQL 8 và PostgreSQL 17 (bài 17.2, đo thật). Sau <code>ROLLBACK</code>, <code>audit_log</code> có <b>1</b> dòng trên MySQL và <b>0</b> dòng trên PostgreSQL. Vì sao?' + code(
        'CREATE TABLE audit_log (msg text);\n' +
        'BEGIN;                         -- START TRANSACTION trong MySQL\n' +
        "INSERT INTO audit_log VALUES ('price change');\n" +
        'CREATE TABLE t_ddl (id int);\n' +
        'INSERT INTO t_ddl VALUES (1);\n' +
        'ROLLBACK;\n' +
        'SELECT count(*) FROM audit_log;   -- MySQL: 1 · PostgreSQL: 0',
      ),
    ),
    options: [
      B('MySQL ignores <code>ROLLBACK</code> for tables created in the same session', 'MySQL bỏ qua <code>ROLLBACK</code> với các bảng tạo trong cùng phiên'),
      B('The MySQL table used a non-transactional engine; with InnoDB both would show 0', 'Bảng MySQL dùng engine không hỗ trợ giao dịch; với InnoDB cả hai sẽ ra 0'),
      B('PostgreSQL lost the row because <code>CREATE TABLE</code> inside a transaction is an error there', 'PostgreSQL làm mất dòng vì <code>CREATE TABLE</code> trong giao dịch là lỗi ở đó'),
      B('MySQL commits implicitly at DDL, so <code>CREATE TABLE</code> committed the insert; PostgreSQL DDL is transactional', 'MySQL tự commit ngầm khi gặp DDL, nên <code>CREATE TABLE</code> đã commit lần chèn; DDL của PostgreSQL nằm trong giao dịch'),
    ],
    correct: 3,
    explanation: EX(
      'Measured in lesson 17.2: on MySQL <code>audit_rows = 1</code> and <code>t_ddl_rows = 1</code>; on PostgreSQL <code>audit_rows = 0</code> and <code>relation "t_ddl" does not exist</code>. MySQL (InnoDB included — so option 2 is wrong) commits the current transaction implicitly before and after most DDL statements; what looked like one atomic unit was in fact three. PostgreSQL treats <code>CREATE</code>, <code>ALTER</code> and <code>DROP</code> like any other statement inside a transaction — which is what lets a migration that fails half-way leave no half-built schema behind, and what this course\'s PE2 relies on when every file ends in <code>ROLLBACK</code>. Option 1 inverts the result. Option 3 is false: <code>CREATE TABLE</code> inside <code>BEGIN</code> is perfectly legal in PostgreSQL. (SQL Server is also transactional for most DDL.)',
      'Đo ở bài 17.2: trên MySQL <code>audit_rows = 1</code> và <code>t_ddl_rows = 1</code>; trên PostgreSQL <code>audit_rows = 0</code> và <code>relation "t_ddl" does not exist</code>. MySQL (kể cả InnoDB — nên phương án 2 sai) tự commit giao dịch hiện tại trước và sau hầu hết các câu DDL; thứ trông như một khối nguyên tử thật ra là ba khối. PostgreSQL đối xử với <code>CREATE</code>, <code>ALTER</code>, <code>DROP</code> như mọi câu lệnh khác bên trong giao dịch — đó là điều giúp một migration hỏng giữa chừng không để lại lược đồ dựng dở, và là điều đề PE2 của khoá này dựa vào khi mọi file kết thúc bằng <code>ROLLBACK</code>. Phương án 1 đảo ngược kết quả. Phương án 3 sai: <code>CREATE TABLE</code> bên trong <code>BEGIN</code> hoàn toàn hợp lệ ở PostgreSQL. (SQL Server cũng đặt hầu hết DDL trong giao dịch.)',
    ),
  }),

  mcq({
    prompt: B(
      'Session A updates product 1\'s price inside an open transaction and waits 8 seconds before rolling back. Meanwhile session B reads that price. Measured in lesson 17.2 on the default settings of each server:' + code(
        'SQL Server 2022 (is_read_committed_snapshot_on = 0):\n' +
        '  SET LOCK_TIMEOUT 3000; SELECT price FROM product WHERE id = 1;\n' +
        '  Msg 1222 … Lock request time out period exceeded.\n' +
        'SQL Server after ALTER DATABASE … SET READ_COMMITTED_SNAPSHOT ON:   5000.00 (instantly)\n' +
        'MySQL 8 (REPEATABLE-READ):                                         5000.00 (instantly)\n' +
        'PostgreSQL 17 (read committed):                                    5000.00 (0.847 ms)',
      ),
      'Phiên A sửa giá sản phẩm 1 trong một giao dịch đang mở rồi chờ 8 giây mới rollback. Trong lúc đó phiên B đọc giá đó. Đo ở bài 17.2 với cấu hình mặc định của từng máy chủ:' + code(
        'SQL Server 2022 (is_read_committed_snapshot_on = 0):\n' +
        '  SET LOCK_TIMEOUT 3000; SELECT price FROM product WHERE id = 1;\n' +
        '  Msg 1222 … Lock request time out period exceeded.\n' +
        'SQL Server sau ALTER DATABASE … SET READ_COMMITTED_SNAPSHOT ON:     5000.00 (ngay lập tức)\n' +
        'MySQL 8 (REPEATABLE-READ):                                         5000.00 (ngay lập tức)\n' +
        'PostgreSQL 17 (read committed):                                    5000.00 (0,847 ms)',
      ),
    ),
    options: [
      B('SQL Server\'s default READ COMMITTED reads with shared locks and waits; PostgreSQL and InnoDB read the old version (MVCC)', 'READ COMMITTED mặc định của SQL Server đọc bằng khoá chia sẻ nên phải chờ; PostgreSQL và InnoDB đọc bản cũ (MVCC)'),
      B('PostgreSQL returned 5000.00 because it read the uncommitted value early, before A changed it', 'PostgreSQL ra 5000.00 vì nó đọc giá trị chưa commit từ sớm, trước khi A kịp sửa'),
      B('SQL Server was right and the other three are unsafe: they returned a value that was about to change', 'SQL Server đúng còn ba hệ kia không an toàn: chúng trả về một giá trị sắp bị đổi'),
      B('The difference is the isolation level: MySQL and PostgreSQL defaulted to READ UNCOMMITTED', 'Khác biệt là ở mức cô lập: MySQL và PostgreSQL mặc định READ UNCOMMITTED'),
    ],
    correct: 0,
    explanation: EX(
      'All four answers are "read committed" — they differ in <b>how</b>. Classic SQL Server takes a shared lock to read a row, and that lock conflicts with A\'s exclusive lock, so B waits until A finishes or, here, until <code>LOCK_TIMEOUT</code> fires (Msg 1222). PostgreSQL never makes readers wait for writers: A\'s update created a new row version (11.2), B\'s snapshot still sees the old committed one, 5000.00, in under a millisecond. MySQL InnoDB is also MVCC (and defaults to REPEATABLE READ). The value returned is the committed truth at that instant — A had not committed and then rolled back, so 5000.00 was right (options 2 and 3 are wrong, nothing uncommitted was read). Neither defaulted to READ UNCOMMITTED (option 4); PostgreSQL does not even implement it — it behaves as READ COMMITTED. Porting tip from lesson 17.2: SQL Server code full of <code>WITH (NOLOCK)</code> exists to dodge exactly this blocking, and has no reason to exist in PostgreSQL.',
      'Cả bốn đều là "read committed" — khác nhau ở <b>cách làm</b>. SQL Server kiểu cổ điển lấy khoá chia sẻ để đọc một dòng, và khoá đó xung đột với khoá độc quyền của A, nên B chờ tới khi A xong hoặc, ở đây, tới khi <code>LOCK_TIMEOUT</code> nổ (Msg 1222). PostgreSQL không bao giờ bắt người đọc chờ người ghi: lệnh sửa của A tạo ra một phiên bản dòng mới (11.2), snapshot của B vẫn thấy bản đã commit cũ, 5000.00, trong chưa tới một mili-giây. MySQL InnoDB cũng là MVCC (và mặc định REPEATABLE READ). Giá trị trả về là sự thật đã commit ở thời điểm đó — A chưa commit rồi còn rollback, nên 5000.00 là đúng (phương án 2 và 3 sai, không có gì chưa commit bị đọc). Không hệ nào mặc định READ UNCOMMITTED (phương án 4); PostgreSQL thậm chí không cài mức đó — nó cư xử như READ COMMITTED. Mẹo chuyển đổi từ bài 17.2: mã SQL Server đầy <code>WITH (NOLOCK)</code> tồn tại để né đúng kiểu chặn này, và chẳng có lý do gì để tồn tại trên PostgreSQL.',
    ),
  }),

  mcq({
    prompt: B(
      'Lesson 17.3 loaded CT Shop\'s 2,000 orders into MongoDB 7 as documents with the items <b>embedded</b> (product sku, name, category copied into every order), and the same documents into a PostgreSQL <code>jsonb</code> column. Measured: a sales report gives identical numbers in both; renaming one product touched <b>119</b> documents; the document table is 1,216 kB versus 432 kB for <code>orders</code> + <code>order_item</code>. What is the fair conclusion?',
      'Bài 17.3 nạp 2.000 đơn của CT Shop vào MongoDB 7 dưới dạng document với các mặt hàng <b>nhúng sẵn</b> (sku, tên, danh mục của sản phẩm chép vào từng đơn), và nạp cùng các document đó vào một cột <code>jsonb</code> của PostgreSQL. Đo thật: báo cáo doanh thu ra số y hệt ở cả hai; đổi tên một sản phẩm phải sửa <b>119</b> document; bảng document nặng 1.216 kB so với 432 kB của <code>orders</code> + <code>order_item</code>. Kết luận công bằng là gì?',
    ),
    options: [
      B('MongoDB is faster for everything, because one document read replaces a join', 'MongoDB nhanh hơn ở mọi việc, vì đọc một document thay được một phép join'),
      B('Embedding is wrong and documents should never be used for orders', 'Nhúng là sai và không bao giờ nên dùng document cho đơn hàng'),
      B('Embedding speeds up reading an order but duplicates data: 119 writes for one rename and ~3× the size', 'Nhúng giúp đọc một đơn nhanh nhưng nhân bản dữ liệu: 119 lần ghi cho một lần đổi tên và nặng ~3 lần'),
      B('The 119 updates prove MongoDB lacks indexes; with an index on <code>items.sku</code> the rename would touch 1 document', '119 lần sửa chứng minh MongoDB thiếu chỉ mục; có chỉ mục trên <code>items.sku</code> thì đổi tên chỉ chạm 1 document'),
    ],
    correct: 2,
    explanation: EX(
      'Lesson 17.3 measured both sides of the trade. Embedding stores each order as the application reads it — one fetch, no join — and both systems answered the sales report identically (Máy tính cầm tay 225,855,000 for 216 orders). The price is the copies: a product name now lives in every order that contains it, so renaming CT0503 was <code>modifiedCount: 119</code> where the relational model updates one row of <code>product</code>, and the document form is about 2.8× the size (1,216 kB vs 432 kB). The index (option 4) made <i>finding</i> those 119 documents fast — <code>IXSCAN</code>, 119 keys examined instead of a 2,000-document <code>COLLSCAN</code> — but cannot reduce how many copies must be rewritten. Option 1 over-generalises one access pattern; option 2 throws away a legitimate design (an order\'s lines rarely change after purchase, which is when embedding fits best). The course\'s middle road (17.3–17.4): tables for the core, a GIN-indexed <code>jsonb</code> column for the part whose shape genuinely varies — like CT Shop\'s <code>product.attrs</code>.',
      'Bài 17.3 đo cả hai mặt của sự đánh đổi. Nhúng lưu mỗi đơn đúng như ứng dụng đọc nó — một lần lấy, không join — và cả hai hệ trả lời báo cáo doanh thu y hệt nhau (Máy tính cầm tay 225.855.000 cho 216 đơn). Cái giá là các bản sao: tên một sản phẩm giờ nằm trong mọi đơn có nó, nên đổi tên CT0503 là <code>modifiedCount: 119</code> trong khi mô hình quan hệ chỉ sửa một dòng của <code>product</code>, và dạng document nặng khoảng 2,8 lần (1.216 kB so với 432 kB). Chỉ mục (phương án 4) giúp <i>tìm</i> 119 document đó nhanh — <code>IXSCAN</code>, xét 119 khoá thay vì <code>COLLSCAN</code> 2.000 document — nhưng không giảm được số bản sao phải ghi lại. Phương án 1 khái quát quá đà từ một kiểu truy cập; phương án 2 vứt bỏ một thiết kế hợp lệ (các dòng của một đơn hiếm khi đổi sau khi mua, đó là lúc nhúng hợp nhất). Con đường giữa của khoá (17.3–17.4): bảng cho phần lõi, một cột <code>jsonb</code> có chỉ mục GIN cho phần có hình dạng thật sự thay đổi — như <code>product.attrs</code> của CT Shop.',
    ),
  }),
];

export default {
  course: { slug: 'postgresql' },
  exams: [
    {
      kind: 'FE',
      code: 'FE2',
      source: 'SAMPLE',
      sortOrder: 5,
      title: B(
        'Final Exam 2 — the whole PostgreSQL course (50 new questions)',
        'Thi cuối khoá 2 — toàn bộ khoá PostgreSQL (50 câu mới)',
      ),
      description: B(
        'Fifty new multiple-choice questions over the whole course, most of them run on the CT Shop database: search_path and the move from SQL Server / MySQL, the query pipeline and durability, numeric and interval traps, foreign keys and NOT VALID, DISTINCT ON and half-open ranges, join traps, grouping rules, subqueries and recursive types, LAG / NTILE / windows before LIMIT, pattern and BRIN indexes, extended statistics and spilling sorts, savepoints, SKIP LOCKED and MVCC, views and procedures, JSONB, full-text and trigram search, vacuum horizons and pool arithmetic, dumps, partitions and replication, production lock queues, and SQL Server · MySQL · MongoDB compared.',
        'Năm mươi câu trắc nghiệm mới phủ toàn khoá, phần lớn chạy trên CT Shop: search_path và việc chuyển từ SQL Server / MySQL, dòng chảy truy vấn và tính bền vững, bẫy số học và interval, khoá ngoại và NOT VALID, DISTINCT ON và khoảng nửa mở, bẫy join, luật gom nhóm, truy vấn con và kiểu của CTE đệ quy, LAG / NTILE / cửa sổ trước LIMIT, chỉ mục pattern và BRIN, thống kê mở rộng và sort tràn đĩa, savepoint, SKIP LOCKED và MVCC, view và procedure, JSONB, tìm toàn văn và trigram, mốc vacuum và phép tính pool, dump, phân mảnh và nhân bản, hàng đợi khoá trên production, và so sánh SQL Server · MySQL · MongoDB.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: Q,
    },
  ],
};
