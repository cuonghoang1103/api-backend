/**
 * PostgreSQL — Progress Test 1 (Mục 0 → Chương 5).
 *
 * Đề tự soạn, bám sát `content/courses/postgresql/s00-intro.mjs` … `s05-join.mjs`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ MỌI kết quả truy vấn, MỌI thông báo lỗi trong đề này đều được ĐO THẬT trên
 * một container PostgreSQL nháp dựng riêng cho việc soạn đề (KHÔNG đụng vào
 * `cuonghoangdev_db` lẫn DB local cổng 5433 của dự án):
 *
 *     PostgreSQL 16.14 (Debian 16.14-1.pgdg13+1) on aarch64-unknown-linux-gnu
 *     docker run -d --name pgpt-nhap -p 55439:5432 postgres:16    (đã docker rm -f)
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BA CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026, PostgreSQL 16.14)
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. Bài 2.2 nói `('hi'::char(5)) || '|'` cho thấy phần đệm khoảng trắng. KHÔNG.
 *    Đo thật: nó trả về `hi|` — vì `||` không có biến thể bpchar nên bpchar bị
 *    ép sang text, và phép ép ĐÓ cắt sạch khoảng trắng cuối. Thứ THẬT SỰ nhìn
 *    thấy phần đệm là `octet_length()` (=5) và `pg_column_size()` (=9), còn
 *    `length()` trả 2 và `('hi'::char(5)) = 'hi'` trả `t`. Vì POSTGRESQL-FE đã
 *    có một câu về chỗ này rồi nên PT1 không hỏi lại — nhưng sai lệch thì phải
 *    ghi.
 *
 * 2. Bài 1.4 in kế hoạch `Seq Scan on notes` cho một truy vấn trên bảng lớn.
 *    Trên PostgreSQL 16 với bảng 500.000 dòng / 65 MB, cùng hình dạng truy vấn
 *    cho ra `Gather` → `Parallel Seq Scan`, `Workers Planned: 2`, và
 *    `Rows Removed by Filter` là số của MỘT tiến trình con (166.666) chứ không
 *    phải tổng (499.999). Đọc plan trên PG16 phải nhân theo `loops`/worker.
 *
 * 3. Bài 0.3 và cả khoá chạy trên PostgreSQL 15.4; container nháp này là 16.14.
 *    Mọi con số trong đề là số của 16.14. Riêng THỜI GIAN thì đề KHÔNG hỏi:
 *    máy soạn đề đang chạy nhiều việc song song nên `Execution Time` không tái
 *    hiện được, và một bảng nhỏ luôn `Seq Scan` bất kể có chỉ mục (đo: bảng 200
 *    dòng, có `CREATE INDEX tiny_x ON tiny(x)`, `WHERE x = 42` vẫn ra
 *    `Seq Scan … Rows Removed by Filter: 199`). Đề hỏi CƠ CHẾ, không hỏi số đo.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh trong đề bài):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/POSTGRESQL-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/postgresql-exam-kit.mjs';

export default {
  course: { slug: 'postgresql' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Sections 0–5 (setup, the relational model, types, constraints, querying, joins)',
        'Kiểm tra tiến độ 1 — Mục 0–5 (cài đặt, mô hình quan hệ, kiểu dữ liệu, ràng buộc, truy vấn, JOIN)',
      ),
      description: B(
        'The first third of the PostgreSQL course: the client-server model, why the relational model and ACID exist, choosing a data type, the constraints that make bad data impossible, INSERT/SELECT/UPDATE/DELETE, and every shape of JOIN. 30 multiple-choice questions plus 2 programming questions you write here in the exam room.',
        'Một phần ba đầu của khoá PostgreSQL: mô hình client-server, vì sao có mô hình quan hệ và ACID, chọn kiểu dữ liệu, các ràng buộc khiến dữ liệu sai không thể tồn tại, INSERT/SELECT/UPDATE/DELETE, và mọi hình dạng JOIN. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–5'),
      questions: [
        // ── Mục 0 — Mô hình client-server & psql ─────────────────────────
        mcq({
          prompt: B(
            'You type a SELECT into psql, press Enter, and nothing happens — no rows, no error. The prompt has changed:' + code(
              'nhap=# SELECT count(*) FROM note\n' +
              'nhap-#',
            ) + 'What is going on, and what do you type next?',
            'Bạn gõ một câu SELECT vào psql, nhấn Enter, và không có gì xảy ra — không dòng nào, không lỗi nào. Dấu nhắc đã đổi:' + code(
              'nhap=# SELECT count(*) FROM note\n' +
              'nhap-#',
            ) + 'Chuyện gì đang diễn ra, và bạn gõ gì tiếp theo?',
          ),
          options: [
            B('The server is busy running the count and psql is showing a progress prompt; wait, or press Ctrl+C to cancel and retry with a smaller table', 'Máy chủ đang bận chạy phép đếm và psql hiện dấu nhắc tiến trình; hãy chờ, hoặc nhấn Ctrl+C để huỷ rồi thử lại với bảng nhỏ hơn'),
            B('The connection dropped and psql fell back to an offline prompt; type <code>\\c</code> to reconnect before the statement can run', 'Kết nối đã rớt và psql lùi về dấu nhắc ngoại tuyến; gõ <code>\\c</code> để nối lại rồi câu lệnh mới chạy được'),
            B('psql is still reading the statement — <code>=#</code> means "ready for a new statement", <code>-#</code> means "mid-statement". Type <code>;</code> and Enter; a statement only runs when it is terminated', 'psql vẫn đang đọc dở câu lệnh — <code>=#</code> nghĩa là "sẵn sàng nhận câu mới", <code>-#</code> nghĩa là "đang giữa chừng một câu". Gõ <code>;</code> rồi Enter; một câu lệnh chỉ chạy khi đã được kết thúc'),
            B('The statement is syntactically invalid, and psql suppresses the error until you end the line; press Enter twice to see the message', 'Câu lệnh sai cú pháp, và psql nén lỗi lại cho tới khi bạn kết thúc dòng; nhấn Enter hai lần để thấy thông báo'),
          ],
          correct: 2,
          explanation: EX(
            'This is the single most common first-hour confusion with psql, and the whole answer is in one character of the prompt. <code>nhap=#</code> is the ready prompt; <code>nhap-#</code> means the client is still buffering an unterminated statement and will keep buffering for as long as you keep typing. Nothing has been sent to the server yet — SQL travels over the connection as text, and psql only sends it once you close it with a semicolon. Other prompt endings tell you other things: <code>(#</code> means an unclosed parenthesis, <code>\'#</code> an unclosed string literal. Meta-commands like <code>\\dt</code> and <code>\\conninfo</code> are the exception — they are the client\'s own shortcuts, not SQL, so they run on Enter with no semicolon at all.',
            'Đây là chỗ bối rối phổ biến nhất trong giờ đầu dùng psql, và toàn bộ câu trả lời nằm ở một ký tự trên dấu nhắc. <code>nhap=#</code> là dấu nhắc sẵn sàng; <code>nhap-#</code> nghĩa là client vẫn đang gom một câu lệnh chưa kết thúc, và sẽ gom tiếp chừng nào bạn còn gõ. Chưa có gì được gửi lên máy chủ cả — SQL đi qua kết nối dưới dạng văn bản, và psql chỉ gửi khi bạn đóng câu bằng dấu chấm phẩy. Các đuôi dấu nhắc khác nói những chuyện khác: <code>(#</code> là còn dấu ngoặc chưa đóng, <code>\'#</code> là còn chuỗi chưa đóng. Các meta-command như <code>\\dt</code> và <code>\\conninfo</code> là ngoại lệ — chúng là lệnh tắt của chính client chứ không phải SQL, nên nhấn Enter là chạy, không cần chấm phẩy.',
          ),
        }),

        mcq({
          prompt: B(
            'Three rows are inserted by ONE statement into a table whose <code>created_at</code> defaults to <code>now()</code>. Measured on PostgreSQL 16.14, what do the three timestamps look like?' + code(
              'INSERT INTO notes (title, body) VALUES\n' +
              "  ('Learn PostgreSQL', 'Day one'),\n" +
              "  ('Buy coffee', NULL),\n" +
              "  ('Read the manual', 'The EXPLAIN chapter');",
            ),
            'Ba dòng được chèn bằng MỘT câu lệnh vào bảng có <code>created_at</code> mặc định là <code>now()</code>. Đo trên PostgreSQL 16.14, ba mốc thời gian trông thế nào?' + code(
              'INSERT INTO notes (title, body) VALUES\n' +
              "  ('Learn PostgreSQL', 'Day one'),\n" +
              "  ('Buy coffee', NULL),\n" +
              "  ('Read the manual', 'The EXPLAIN chapter');",
            ),
          ),
          options: [
            B('Three values a few microseconds apart, because the default expression is evaluated once per row as the row is written to disk', 'Ba giá trị cách nhau vài micro giây, vì biểu thức mặc định được tính một lần cho mỗi dòng lúc dòng đó được ghi xuống đĩa'),
            B('All three identical, because <code>now()</code> returns the moment the enclosing TRANSACTION started — use <code>clock_timestamp()</code> when you genuinely want the wall clock at that instant', 'Cả ba giống hệt nhau, vì <code>now()</code> trả về thời điểm GIAO DỊCH bao quanh bắt đầu — muốn đúng đồng hồ tường tại từng thời điểm thì dùng <code>clock_timestamp()</code>'),
            B('All three identical, but only because the statement is fast; on a slow disk the three rows would drift apart by milliseconds', 'Cả ba giống nhau, nhưng chỉ vì câu lệnh chạy nhanh; trên đĩa chậm thì ba dòng sẽ lệch nhau vài mili giây'),
            B('The first row gets a timestamp and the other two get NULL, because a DEFAULT expression only fires for the first row of a multi-row VALUES list', 'Dòng đầu nhận mốc thời gian còn hai dòng sau nhận NULL, vì biểu thức DEFAULT chỉ kích hoạt cho dòng đầu tiên của một danh sách VALUES nhiều dòng'),
          ],
          correct: 1,
          explanation: EX(
            '<code>now()</code> is an alias for <code>transaction_timestamp()</code>. It is frozen for the entire transaction — and since a bare statement is still a transaction (autocommit), all three rows share one value to the microsecond. That is a feature, not an accident: every row written by one logical unit of work carries the same "when", so a report grouping by <code>created_at</code> cannot split one batch across two buckets. The family, from most frozen to least: <code>now()</code> / <code>transaction_timestamp()</code> (start of transaction) → <code>statement_timestamp()</code> (start of the current statement) → <code>clock_timestamp()</code> (read the OS clock right now, different on every call). Reach for the last one when you are timing something inside a long transaction; reach for the first one everywhere else.',
            '<code>now()</code> là bí danh của <code>transaction_timestamp()</code>. Nó bị đóng băng suốt cả giao dịch — và vì một câu lệnh trần vẫn là một giao dịch (autocommit), cả ba dòng dùng chung một giá trị tới từng micro giây. Đó là tính năng chứ không phải tình cờ: mọi dòng do một đơn vị công việc logic ghi ra đều mang cùng một cái "lúc nào", nên một báo cáo gom nhóm theo <code>created_at</code> không thể xé một lô ra hai ngăn. Cả họ, từ đóng băng nhất tới ít nhất: <code>now()</code> / <code>transaction_timestamp()</code> (lúc giao dịch bắt đầu) → <code>statement_timestamp()</code> (lúc câu lệnh hiện tại bắt đầu) → <code>clock_timestamp()</code> (đọc đồng hồ hệ điều hành ngay lúc này, mỗi lần gọi một khác). Dùng cái cuối khi bạn đang đo thời gian bên trong một giao dịch dài; còn lại thì dùng cái đầu.',
          ),
        }),

        mcq({
          prompt: B(
            'The course starts its practice server like this. Which port does <code>psql</code> on your laptop connect to, and what does the pair of numbers mean?' + code(
              'docker run -d --name pg16 \\\n' +
              '  -e POSTGRES_PASSWORD=123456 \\\n' +
              '  -p 5433:5432 \\\n' +
              '  postgres:16',
            ),
            'Khoá học khởi động máy chủ thực hành như sau. <code>psql</code> trên máy bạn nối vào cổng nào, và cặp số kia nghĩa là gì?' + code(
              'docker run -d --name pg16 \\\n' +
              '  -e POSTGRES_PASSWORD=123456 \\\n' +
              '  -p 5433:5432 \\\n' +
              '  postgres:16',
            ),
          ),
          options: [
            B('Port <b>5433</b>: the form is <code>-p host:container</code>, so 5433 on your machine is forwarded to 5432 inside the container — which is why the course connects with <code>psql -h localhost -p 5433 -U postgres</code>', 'Cổng <b>5433</b>: dạng viết là <code>-p host:container</code>, nên 5433 trên máy bạn được chuyển tiếp vào 5432 bên trong container — và vì thế khoá học nối bằng <code>psql -h localhost -p 5433 -U postgres</code>'),
            B('Port <b>5432</b>: the first number is always the container port and the second the host port, so the mapping reads container 5433 to host 5432', 'Cổng <b>5432</b>: số đầu luôn là cổng của container còn số sau là cổng của host, nên ánh xạ đọc là container 5433 sang host 5432'),
            B('Either one works, because Docker publishes both ends of the pair on the host and PostgreSQL listens on both', 'Cổng nào cũng được, vì Docker mở cả hai đầu của cặp số trên host và PostgreSQL lắng nghe trên cả hai'),
            B('Neither: with <code>-p</code> the server is reachable only from other containers, and you must run <code>docker exec … psql</code> to talk to it at all', 'Không cổng nào cả: với <code>-p</code> thì máy chủ chỉ tới được từ các container khác, và bạn buộc phải chạy <code>docker exec … psql</code> mới nói chuyện được với nó'),
          ],
          correct: 0,
          explanation: EX(
            'The order is <code>-p &lt;host&gt;:&lt;container&gt;</code>, always. PostgreSQL inside the container listens on its usual 5432; the flag publishes that on 5433 of your machine, which is exactly what you do when port 5432 is already taken by a native install. Two consequences worth carrying: <code>-h localhost -p 5433</code> is a TCP connection (psql will ask for the password), while <code>docker exec -it pg16 psql -U postgres</code> goes in through the container and authenticates over a Unix socket, so it usually does not ask. And the data lives in the container\'s writable layer unless you add <code>-v pgdata:/var/lib/postgresql/data</code> — without that flag, <code>docker rm</code> takes your practice database with it.',
            'Thứ tự luôn là <code>-p &lt;host&gt;:&lt;container&gt;</code>. PostgreSQL bên trong container vẫn lắng nghe cổng 5432 quen thuộc của nó; cờ này công bố cổng đó ra 5433 của máy bạn — đúng thứ bạn cần khi 5432 đã bị một bản cài đặt gốc chiếm mất. Hai hệ quả đáng nhớ: <code>-h localhost -p 5433</code> là kết nối TCP (psql sẽ hỏi mật khẩu), còn <code>docker exec -it pg16 psql -U postgres</code> thì chui vào trong container và xác thực qua socket Unix nên thường không hỏi. Và dữ liệu nằm trong lớp ghi được của container trừ khi bạn thêm <code>-v pgdata:/var/lib/postgresql/data</code> — thiếu cờ đó thì <code>docker rm</code> mang luôn cơ sở dữ liệu thực hành đi.',
          ),
        }),

        // ── Chương 1 — Vì sao PostgreSQL tồn tại ─────────────────────────
        mcq({
          prompt: B(
            'Run on PostgreSQL 16.14 against a table whose <code>user_id</code> is <code>REFERENCES u_r(id)</code>, where <code>u_r</code> holds only ids 1 and 2:' + code(
              "INSERT INTO n_r VALUES (4, 999, 'orphan');\n" +
              'ERROR:  insert or update on table "n_r" violates foreign key constraint "n_r_user_id_fkey"\n' +
              'DETAIL:  Key (user_id)=(999) is not present in table "u_r".',
            ) + 'Which statement about this rejection is correct?',
            'Chạy trên PostgreSQL 16.14 với một bảng có <code>user_id</code> khai <code>REFERENCES u_r(id)</code>, trong khi <code>u_r</code> chỉ chứa id 1 và 2:' + code(
              "INSERT INTO n_r VALUES (4, 999, 'orphan');\n" +
              'ERROR:  insert or update on table "n_r" violates foreign key constraint "n_r_user_id_fkey"\n' +
              'DETAIL:  Key (user_id)=(999) is not present in table "u_r".',
            ) + 'Phát biểu nào về lần từ chối này là đúng?',
          ),
          options: [
            B('The check only runs because the column was declared <code>NOT NULL</code>; make it nullable and PostgreSQL stops verifying the reference on INSERT', 'Phép kiểm chỉ chạy vì cột được khai <code>NOT NULL</code>; cho phép NULL thì PostgreSQL thôi xác minh tham chiếu lúc INSERT'),
            B('It is enforced by the application layer that generated the schema, so a direct <code>psql</code> session or a migration script can still write the orphan row', 'Nó do tầng ứng dụng sinh ra lược đồ thực thi, nên một phiên <code>psql</code> trực tiếp hay một script migration vẫn ghi được dòng mồ côi'),
            B('The constraint is checked once at <code>CREATE TABLE</code> time against the rows already present, and afterwards it is only documentation', 'Ràng buộc được kiểm một lần lúc <code>CREATE TABLE</code> trên các dòng đã có, sau đó nó chỉ còn là tài liệu'),
            B('The rule lives with the DATA, so every writer — the API, a migration, a colleague in psql, a service written next year — is held to it; the row simply cannot come into existence', 'Luật sống cùng DỮ LIỆU, nên mọi người ghi — API, một migration, một đồng nghiệp trong psql, một dịch vụ viết vào năm sau — đều bị ràng; dòng đó đơn giản là không thể tồn tại'),
          ],
          correct: 3,
          explanation: EX(
            'This is the deep argument for putting rules in the database rather than only in code: a constraint holds against writers you have not met yet. The foreign key is verified on every INSERT and on every UPDATE of the referencing column, forever, by the server — there is no path around it, including a superuser typing SQL by hand. Two details in the message are worth learning to read: the constraint name <code>n_r_user_id_fkey</code> follows the pattern <code>&lt;table&gt;_&lt;column&gt;_fkey</code> and is what you would name in <code>ALTER TABLE … DROP CONSTRAINT</code>, and the SQLSTATE for this class of failure is <b>23503</b> (foreign key violation) — distinct from <b>23505</b> (unique violation) and <b>23514</b> (check violation), which is how application code tells them apart without parsing English.',
            'Đây là lý lẽ sâu nhất cho việc đặt luật trong cơ sở dữ liệu thay vì chỉ trong mã: một ràng buộc có hiệu lực với cả những người ghi mà bạn chưa gặp. Khoá ngoại được xác minh ở mọi INSERT và mọi UPDATE lên cột tham chiếu, mãi mãi, do chính máy chủ làm — không có đường vòng nào, kể cả superuser gõ SQL bằng tay. Hai chi tiết trong thông báo đáng tập đọc: tên ràng buộc <code>n_r_user_id_fkey</code> theo khuôn <code>&lt;bảng&gt;_&lt;cột&gt;_fkey</code> và là thứ bạn gọi tên trong <code>ALTER TABLE … DROP CONSTRAINT</code>, còn SQLSTATE của loại lỗi này là <b>23503</b> (vi phạm khoá ngoại) — khác <b>23505</b> (trùng khoá duy nhất) và <b>23514</b> (vi phạm CHECK), và đó là cách mã ứng dụng phân biệt chúng mà không phải đọc tiếng Anh.',
          ),
        }),

        mcq({
          prompt: B(
            'A single <code>UPDATE</code> is typed with no <code>BEGIN</code> in front of it. It would touch 40,000 rows, and row 39,999 violates a <code>CHECK</code>. What is the state of the table afterwards?' + code(
              'UPDATE accounts SET balance = balance - 10;   -- 40,000 rows, one of them would go negative',
            ),
            'Một câu <code>UPDATE</code> đơn lẻ được gõ mà không có <code>BEGIN</code> phía trước. Nó sẽ chạm 40.000 dòng, và dòng thứ 39.999 vi phạm một <code>CHECK</code>. Sau đó bảng ở trạng thái nào?',
          ),
          options: [
            B('39,998 rows are updated and the statement stops at the bad row; you must find and re-run the remainder yourself', '39.998 dòng được cập nhật và câu lệnh dừng ở dòng hỏng; bạn phải tự tìm và chạy lại phần còn lại'),
            B('Nothing changed at all — without <code>BEGIN</code> the server still wraps the statement in its own transaction (autocommit), so a single statement is never half-applied', 'Không có gì thay đổi cả — không có <code>BEGIN</code> thì máy chủ vẫn tự bọc câu lệnh trong một giao dịch của riêng nó (autocommit), nên một câu lệnh đơn lẻ không bao giờ bị áp dụng nửa vời'),
            B('All 40,000 rows are updated and the violating row is left in an invalid state, to be repaired by the next <code>VACUUM</code>', 'Cả 40.000 dòng được cập nhật và dòng vi phạm bị bỏ lại ở trạng thái không hợp lệ, chờ lần <code>VACUUM</code> kế tiếp sửa'),
            B('The outcome depends on the isolation level: <code>READ COMMITTED</code> keeps the partial work, <code>SERIALIZABLE</code> discards it', 'Kết quả tuỳ mức cô lập: <code>READ COMMITTED</code> giữ lại phần đã làm, còn <code>SERIALIZABLE</code> thì bỏ đi'),
          ],
          correct: 1,
          explanation: EX(
            'Atomicity is not something <code>BEGIN</code> buys you — it is the default. Every statement runs inside a transaction; if you did not open one, the server opens and closes one around it. So the failure on row 39,999 rolls the whole statement back and the table is untouched. What <code>BEGIN</code> actually buys is making SEVERAL statements atomic together, which is the money-transfer case from lesson 1.2: debit and credit must land or not land as one unit. The practical habit that follows is the seatbelt from lesson 4.4 — before a hand-typed <code>UPDATE</code> or <code>DELETE</code> you are unsure about, type <code>BEGIN;</code> first, read the reported row count, and only then choose <code>COMMIT</code> or <code>ROLLBACK</code>.',
            'Tính nguyên tử không phải thứ <code>BEGIN</code> mua cho bạn — nó là mặc định. Mọi câu lệnh đều chạy bên trong một giao dịch; bạn không mở thì máy chủ tự mở và tự đóng một cái quanh nó. Nên lỗi ở dòng 39.999 kéo cả câu lệnh quay ngược lại và bảng nguyên vẹn. Thứ <code>BEGIN</code> thật sự mua là làm NHIỀU câu lệnh nguyên tử cùng nhau, đúng ca chuyển tiền ở bài 1.2: trừ và cộng phải cùng vào hoặc cùng không. Thói quen thực tế đi kèm là cái dây an toàn ở bài 4.4 — trước một câu <code>UPDATE</code> hay <code>DELETE</code> gõ tay mà bạn chưa chắc, hãy gõ <code>BEGIN;</code> trước, đọc số dòng nó báo, rồi mới chọn <code>COMMIT</code> hay <code>ROLLBACK</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Two psql sessions, measured on PostgreSQL 16.14. Session A holds an open transaction; session B reads the same row while A is still uncommitted:' + code(
              'A│ BEGIN;\n' +
              "A│ UPDATE accounts SET balance = balance - 10 WHERE id = 'A';   -- UPDATE 1\n" +
              "B│ SELECT balance FROM accounts WHERE id = 'A';\n" +
              'B│  50.00        ← returned immediately\n' +
              'A│ COMMIT;\n' +
              "B│ SELECT balance FROM accounts WHERE id = 'A';\n" +
              'B│  40.00',
            ) + 'Which mechanism explains B\'s first answer?',
            'Hai phiên psql, đo trên PostgreSQL 16.14. Phiên A đang giữ một giao dịch mở; phiên B đọc đúng dòng đó trong lúc A chưa commit:' + code(
              'A│ BEGIN;\n' +
              "A│ UPDATE accounts SET balance = balance - 10 WHERE id = 'A';   -- UPDATE 1\n" +
              "B│ SELECT balance FROM accounts WHERE id = 'A';\n" +
              'B│  50.00        ← trả về ngay lập tức\n' +
              'A│ COMMIT;\n' +
              "B│ SELECT balance FROM accounts WHERE id = 'A';\n" +
              'B│  40.00',
            ) + 'Cơ chế nào giải thích câu trả lời đầu tiên của B?',
          ),
          options: [
            B('B was served from a query cache that PostgreSQL invalidates on COMMIT, which is why the second read is current', 'B được phục vụ từ một bộ nhớ đệm truy vấn mà PostgreSQL vô hiệu hoá lúc COMMIT, và vì thế lần đọc thứ hai mới đúng'),
            B('B took a shared read lock which A\'s exclusive lock had not yet blocked, because A had not written to disk yet', 'B lấy một khoá đọc chia sẻ mà khoá độc quyền của A chưa kịp chặn, vì A chưa ghi xuống đĩa'),
            B('MVCC: the UPDATE wrote a NEW row version and stamped the old one as expired, so B\'s snapshot still sees the old version — readers never block writers and never see uncommitted work', 'MVCC: câu UPDATE ghi ra một PHIÊN BẢN dòng MỚI và đóng dấu "chết" lên phiên bản cũ, nên ảnh chụp của B vẫn thấy bản cũ — người đọc không bao giờ chặn người ghi và không bao giờ thấy việc chưa commit'),
            B('B is at READ UNCOMMITTED by default, and PostgreSQL rounds an uncommitted value down to the last durable one it can prove', 'B mặc định ở mức READ UNCOMMITTED, và PostgreSQL làm tròn một giá trị chưa commit về giá trị bền vững cuối cùng mà nó chứng minh được'),
          ],
          correct: 2,
          explanation: EX(
            'PostgreSQL never overwrites a row in place. An <code>UPDATE</code> is really an INSERT of a new version plus a "died at" stamp on the old one — you can see it directly: <code>SELECT ctid, xmin, xmax, * FROM t</code> shows the <code>ctid</code> jump from <code>(0,1)</code> to <code>(0,2)</code> after an update, measured on 16.14. Because the old version is still physically there, B has something correct to read without waiting for anybody, which is the headline property: <b>readers never block writers and writers never block readers</b>. Two things it does NOT give you, both later in the course: writers still block writers on the same row (11.4), and the old versions accumulate as dead tuples until <code>VACUUM</code> reclaims them (11.2, 14.3).',
            'PostgreSQL không bao giờ ghi đè một dòng tại chỗ. Một câu <code>UPDATE</code> thực chất là INSERT một phiên bản mới cộng với một con dấu "chết lúc" lên bản cũ — nhìn thấy được ngay: <code>SELECT ctid, xmin, xmax, * FROM t</code> cho thấy <code>ctid</code> nhảy từ <code>(0,1)</code> sang <code>(0,2)</code> sau một lần update, đo trên 16.14. Vì bản cũ vẫn còn nằm đó về mặt vật lý, B có sẵn thứ đúng để đọc mà không phải chờ ai, và đó là tính chất nổi bật: <b>người đọc không bao giờ chặn người ghi, người ghi không bao giờ chặn người đọc</b>. Hai thứ nó KHÔNG cho, cả hai đều ở phần sau của khoá: người ghi vẫn chặn người ghi trên cùng một dòng (11.4), và các phiên bản cũ chất đống thành dead tuple cho tới khi <code>VACUUM</code> thu hồi (11.2, 14.3).',
          ),
        }),

        mcq({
          prompt: B(
            'Your <code>COMMIT</code> returned successfully and the power cut off two milliseconds later. On restart the row is there. Which setting made that true, and what did it cost?' + code(
              'wal_level = replica\n' +
              'fsync = on\n' +
              'synchronous_commit = on',
            ),
            'Lệnh <code>COMMIT</code> của bạn trả về thành công và hai mili giây sau thì mất điện. Khởi động lại, dòng dữ liệu vẫn còn. Thiết lập nào làm được điều đó, và cái giá là gì?' + code(
              'wal_level = replica\n' +
              'fsync = on\n' +
              'synchronous_commit = on',
            ),
          ),
          options: [
            B('The change was written to the write-ahead log and flushed to disk BEFORE the data pages were touched, so recovery replays it; the cost is that a commit pays for a physical disk flush', 'Thay đổi được ghi vào nhật ký ghi-trước và ép xuống đĩa TRƯỚC khi các trang dữ liệu bị đụng tới, nên lúc phục hồi nó được phát lại; cái giá là mỗi lần commit phải trả cho một lần ép ghi vật lý xuống đĩa'),
            B('The data pages themselves were written first and the log afterwards, which is why the log can be discarded as soon as the commit returns', 'Chính các trang dữ liệu được ghi trước còn nhật ký ghi sau, và vì thế nhật ký có thể vứt đi ngay khi commit trả về'),
            B('The row was held in shared buffers, and PostgreSQL keeps shared buffers in battery-backed memory that survives a power cut', 'Dòng dữ liệu nằm trong shared buffers, và PostgreSQL giữ shared buffers trong bộ nhớ có pin dự phòng nên sống sót qua lần mất điện'),
            B('Durability comes from streaming replication: the commit is only reported once a replica has confirmed it, which is what <code>wal_level = replica</code> switches on', 'Tính bền vững đến từ nhân bản trực tuyến: commit chỉ được báo thành công khi một bản sao đã xác nhận, và đó là thứ <code>wal_level = replica</code> bật lên'),
          ],
          correct: 0,
          explanation: EX(
            'Write-ahead means exactly what it says: the record describing the change is appended to the WAL and flushed, and only then may the data page be modified — the page itself can be written back lazily, minutes later. If the machine dies in between, recovery replays the WAL and no committed transaction is lost. <code>fsync = on</code> is what forces the operating system to physically write rather than just accept the bytes into its own cache; turning it off is faster and is how people lose committed data. Note what <code>wal_level = replica</code> is NOT: it does not make commits wait for a replica — that would be <code>synchronous_standby_names</code>, and by default replication is asynchronous. <code>wal_level</code> only decides how much detail the log carries.',
            'Ghi-trước nghĩa đúng như tên: bản ghi mô tả thay đổi được nối vào WAL và ép xuống đĩa, rồi mới được phép sửa trang dữ liệu — bản thân trang đó có thể ghi lại thong thả, vài phút sau. Nếu máy chết ở khoảng giữa, lúc phục hồi WAL được phát lại và không giao dịch đã commit nào bị mất. <code>fsync = on</code> là thứ buộc hệ điều hành ghi thật xuống đĩa chứ không chỉ nhận byte vào bộ đệm của nó; tắt đi thì nhanh hơn, và đó là cách người ta mất dữ liệu đã commit. Để ý thứ <code>wal_level = replica</code> KHÔNG làm: nó không bắt commit chờ bản sao — thứ đó là <code>synchronous_standby_names</code>, và mặc định nhân bản là bất đồng bộ. <code>wal_level</code> chỉ quyết định nhật ký mang bao nhiêu chi tiết.',
          ),
        }),

        mcq({
          prompt: B(
            'Cuong changes his display name. In a normalized schema the notes table stores <code>user_id</code> and the users table stores <code>name</code>. How many rows must change, and why does that matter?',
            'Cuong đổi tên hiển thị. Trong một lược đồ đã chuẩn hoá, bảng note lưu <code>user_id</code> còn bảng user lưu <code>name</code>. Bao nhiêu dòng phải đổi, và vì sao điều đó quan trọng?',
          ),
          options: [
            B('Every note row, plus the user row — the JOIN copies the name into each note when the note is written, so all copies must be kept in step', 'Mọi dòng note, cộng dòng user — phép JOIN chép tên vào từng note lúc note được ghi, nên mọi bản sao phải được giữ đồng bộ'),
            B('None: PostgreSQL stores the name once in the shared buffer pool and every note row points at that buffer, so nothing on disk changes', 'Không dòng nào: PostgreSQL lưu tên một lần trong shared buffer và mọi dòng note trỏ vào bộ đệm đó, nên trên đĩa không có gì đổi'),
            B('One row per DISTINCT note tag, because the tag column is what a normalized schema deduplicates', 'Một dòng cho mỗi tag khác nhau của note, vì cột tag mới là thứ mà một lược đồ chuẩn hoá khử trùng lặp'),
            B('Exactly ONE — the user row. The link is stored as a KEY, not as a copy of the name, so every past note "sees" the new name at query time via the JOIN', 'Đúng MỘT — dòng user. Mối liên hệ được lưu dưới dạng KHOÁ chứ không phải bản sao của cái tên, nên mọi note cũ đều "thấy" tên mới ngay lúc truy vấn nhờ phép JOIN'),
          ],
          correct: 3,
          explanation: EX(
            'This is the whole payoff of the relational model in one edit. The note row holds a number — the user\'s id — and the name is fetched fresh by the join every time the note is rendered. One fact, one home. The counter-example in lesson 3.4 is worth remembering because it is what happens when you skip this: an <code>orders_bad</code> table that repeats <code>customer_city</code> on every order, and an <code>UPDATE … WHERE order_id = 1</code> that forgets order 2 — measured output showed the same person living in two cities, with nothing in the database able to say which was correct. That is an update anomaly, and it is the direct consequence of storing one fact in many places. Denormalising is a legitimate performance technique, but it is a decision taken after measuring, with a written plan for keeping the copies in step.',
            'Đây là toàn bộ phần thưởng của mô hình quan hệ, gói trong một lần sửa. Dòng note giữ một con số — id của người dùng — còn cái tên được phép join lấy tươi mỗi lần note được vẽ ra. Một sự thật, một chỗ ở. Ví dụ phản chứng ở bài 3.4 đáng nhớ vì nó chính là thứ xảy ra khi bỏ qua điều này: bảng <code>orders_bad</code> lặp <code>customer_city</code> trên mọi đơn hàng, và một câu <code>UPDATE … WHERE order_id = 1</code> quên mất đơn số 2 — kết quả đo được cho thấy cùng một người sống ở hai thành phố, mà không có gì trong cơ sở dữ liệu nói được cái nào đúng. Đó là bất thường khi cập nhật, và là hệ quả trực tiếp của việc lưu một sự thật ở nhiều nơi. Phi chuẩn hoá là một kỹ thuật hiệu năng chính đáng, nhưng nó là quyết định đưa ra SAU khi đo, kèm một kế hoạch viết ra giấy để giữ các bản sao đồng bộ.',
          ),
        }),

        // ── Chương 2 — Kiểu dữ liệu ─────────────────────────────────────
        mcq({
          prompt: B(
            'Both of these were run on PostgreSQL 16.14. What is the design decision they demonstrate?' + code(
              'SELECT 32767::smallint + 1::smallint;\n' +
              'ERROR:  smallint out of range\n' +
              '\n' +
              'SELECT 2147483647::int + 1;\n' +
              'ERROR:  integer out of range',
            ),
            'Cả hai câu sau đều chạy trên PostgreSQL 16.14. Chúng minh hoạ quyết định thiết kế nào?' + code(
              'SELECT 32767::smallint + 1::smallint;\n' +
              'ERROR:  smallint out of range\n' +
              '\n' +
              'SELECT 2147483647::int + 1;\n' +
              'ERROR:  integer out of range',
            ),
          ),
          options: [
            B('That arithmetic on integer types is done in <code>numeric</code> internally, so the error is really about the cast back, not about the addition', 'Rằng phép tính trên kiểu số nguyên được làm bằng <code>numeric</code> ở bên trong, nên lỗi thật ra nói về phép ép kiểu ngược lại chứ không phải phép cộng'),
            B('Overflow is an ERROR, never a silent wrap-around to a wrong number — which is exactly why a hot table\'s id should be <code>bigint</code> from day one rather than discovered at 2.1 billion rows', 'Tràn số là một LỖI, không bao giờ âm thầm quay vòng thành một con số sai — và đó chính là lý do id của một bảng nóng nên là <code>bigint</code> ngay từ ngày đầu chứ không phải phát hiện ra lúc 2,1 tỷ dòng'),
            B('That <code>smallint</code> and <code>integer</code> are deprecated in favour of <code>bigint</code>, and PostgreSQL 16 refuses arithmetic on them', 'Rằng <code>smallint</code> và <code>integer</code> đã lỗi thời, nhường chỗ cho <code>bigint</code>, và PostgreSQL 16 từ chối làm phép tính trên chúng'),
            B('That the literal <code>1</code> is <code>bigint</code>, so the addition is a type mismatch rather than a range problem at all', 'Rằng hằng <code>1</code> là <code>bigint</code>, nên phép cộng là lỗi lệch kiểu chứ hoàn toàn không phải chuyện vượt tầm'),
          ],
          correct: 1,
          explanation: EX(
            'C and many languages wrap silently: <code>INT_MAX + 1</code> becomes a large negative number and your data is quietly corrupt. PostgreSQL refuses, and the refusal is the feature — a loud failure you can fix beats a wrong number you will never notice. The practical consequence is a sizing decision you make once: <code>smallint</code> (2 bytes, ±32k) for small counters, <code>integer</code> (4 bytes, ±2.1 billion) as the everyday default, <code>bigint</code> (8 bytes) for primary keys and anything that can grow. Changing a live table\'s key from <code>int</code> to <code>bigint</code> rewrites the whole table under an exclusive lock, so the cheap moment to decide is before the first row.',
            'C và nhiều ngôn ngữ quay vòng âm thầm: <code>INT_MAX + 1</code> thành một số âm rất lớn và dữ liệu của bạn hỏng trong im lặng. PostgreSQL từ chối, và lời từ chối đó chính là tính năng — một lần hỏng ồn ào mà bạn sửa được thì hơn một con số sai mà bạn không bao giờ để ý. Hệ quả thực tế là một quyết định chọn cỡ, làm một lần: <code>smallint</code> (2 byte, ±32k) cho các bộ đếm nhỏ, <code>integer</code> (4 byte, ±2,1 tỷ) làm mặc định hằng ngày, <code>bigint</code> (8 byte) cho khoá chính và mọi thứ có thể phình. Đổi khoá của một bảng đang chạy từ <code>int</code> sang <code>bigint</code> là viết lại cả bảng dưới một khoá độc quyền, nên thời điểm rẻ nhất để quyết là trước dòng đầu tiên.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on a table whose id is <code>serial</code> (a sequence). Why is there no row 2?' + code(
              "INSERT INTO t_seq(x) VALUES ('a');\n" +
              "BEGIN; INSERT INTO t_seq(x) VALUES ('b'); ROLLBACK;\n" +
              "INSERT INTO t_seq(x) VALUES ('c');\n" +
              '\n' +
              ' id | x\n' +
              '----+---\n' +
              '  1 | a\n' +
              '  3 | c',
            ),
            'Đo trên PostgreSQL 16.14 với một bảng có id kiểu <code>serial</code> (một sequence). Vì sao không có dòng số 2?' + code(
              "INSERT INTO t_seq(x) VALUES ('a');\n" +
              "BEGIN; INSERT INTO t_seq(x) VALUES ('b'); ROLLBACK;\n" +
              "INSERT INTO t_seq(x) VALUES ('c');\n" +
              '\n' +
              ' id | x\n' +
              '----+---\n' +
              '  1 | a\n' +
              '  3 | c',
            ),
          ),
          options: [
            B('The ROLLBACK is irrelevant — sequences skip every even number so that two writers can never collide on the same value', 'Lệnh ROLLBACK không liên quan — sequence bỏ qua mọi số chẵn để hai người ghi không bao giờ đụng nhau ở cùng một giá trị'),
            B('A bug in <code>serial</code> that <code>GENERATED ALWAYS AS IDENTITY</code> fixes: identity columns renumber on rollback so their ids stay contiguous', 'Một lỗi của <code>serial</code> mà <code>GENERATED ALWAYS AS IDENTITY</code> khắc phục: cột identity đánh số lại khi rollback nên id của nó luôn liền mạch'),
            B('A sequence is deliberately NON-transactional: <code>nextval</code> is not rolled back, so a failed or rolled-back insert burns its number forever. Gaps are normal and an id is an identifier, not a count', 'Sequence CỐ Ý nằm ngoài giao dịch: <code>nextval</code> không bị rollback, nên một lần chèn hỏng hoặc bị rollback đốt mất số của nó vĩnh viễn. Có lỗ hổng là bình thường, và id là một định danh chứ không phải một phép đếm'),
            B('The ROLLBACK deleted row 2 after it was committed, so the row existed briefly and was removed by autovacuum together with its id', 'Lệnh ROLLBACK đã xoá dòng 2 sau khi nó được commit, nên dòng đó tồn tại một lúc rồi bị autovacuum dọn đi cùng với id của nó'),
          ],
          correct: 2,
          explanation: EX(
            'If <code>nextval</code> were transactional, every concurrent inserter would have to wait for every other one to commit before it could know its number — sequences would become a global lock and inserts would serialise. So PostgreSQL takes the other trade: the counter moves forward outside your transaction and never moves back. Gaps therefore appear from rollbacks, from failed inserts, from <code>ON CONFLICT DO NOTHING</code>, and from the cache each backend holds. The rule to carry: never present a generated id as "how many rows exist", never assume the next one is the last plus one, and use <code>count(*)</code> when you want a count. This is true of <code>serial</code> and of <code>GENERATED … AS IDENTITY</code> alike — they are the same sequence machinery, and identity is preferred only because the database owns the column properly (it survives dump/restore cleanly and can refuse a hand-supplied value).',
            'Nếu <code>nextval</code> nằm trong giao dịch thì mọi người chèn đồng thời sẽ phải chờ nhau commit mới biết số của mình — sequence sẽ thành một khoá toàn cục và các lệnh chèn phải xếp hàng. Nên PostgreSQL chọn đánh đổi ngược lại: bộ đếm tiến lên ngoài giao dịch của bạn và không bao giờ lùi. Vì thế lỗ hổng xuất hiện từ rollback, từ lần chèn hỏng, từ <code>ON CONFLICT DO NOTHING</code>, và từ phần cache mà mỗi tiến trình giữ sẵn. Luật cần nhớ: đừng bao giờ trình bày một id sinh tự động như "có bao nhiêu dòng", đừng giả định số kế tiếp là số cuối cộng một, và muốn đếm thì dùng <code>count(*)</code>. Điều này đúng cho cả <code>serial</code> lẫn <code>GENERATED … AS IDENTITY</code> — chúng dùng chung bộ máy sequence, và identity chỉ được ưa hơn vì cơ sở dữ liệu sở hữu cột đó đàng hoàng (nó sống sót qua dump/restore sạch sẽ và từ chối được giá trị gán tay).',
          ),
        }),

        mcq({
          prompt: B(
            'Two ways of hitting a length limit, both measured on PostgreSQL 16.14. Why do they differ?' + code(
              "CREATE TABLE t_vc (code varchar(3));\n" +
              "INSERT INTO t_vc VALUES ('abcdef');\n" +
              'ERROR:  value too long for type character varying(3)\n' +
              '\n' +
              "SELECT 'abcdef'::varchar(3);\n" +
              ' varchar\n' +
              '---------\n' +
              ' abc',
            ),
            'Hai cách chạm trần độ dài, cả hai đều đo trên PostgreSQL 16.14. Vì sao chúng khác nhau?' + code(
              "CREATE TABLE t_vc (code varchar(3));\n" +
              "INSERT INTO t_vc VALUES ('abcdef');\n" +
              'ERROR:  value too long for type character varying(3)\n' +
              '\n' +
              "SELECT 'abcdef'::varchar(3);\n" +
              ' varchar\n' +
              '---------\n' +
              ' abc',
            ),
          ),
          options: [
            B('Storing into a column is a constraint check and REJECTS an over-long value, while an explicit cast is a conversion and TRUNCATES silently — so the column protects you and a stray cast quietly loses characters', 'Ghi vào một cột là một phép kiểm ràng buộc nên TỪ CHỐI giá trị quá dài, còn một phép ép kiểu tường minh là một phép chuyển đổi nên CẮT NGẮN trong im lặng — cột thì bảo vệ bạn, còn một phép ép kiểu lạc chỗ thì âm thầm làm mất ký tự'),
            B('The cast succeeded only because the table did not exist yet; inside a transaction that also inserts, the same cast would raise the same error', 'Phép ép kiểu thành công chỉ vì bảng chưa tồn tại; trong một giao dịch có kèm lệnh chèn thì cùng phép ép ấy sẽ báo đúng lỗi đó'),
            B('<code>varchar(n)</code> counts bytes when storing and characters when casting, and <code>abcdef</code> happens to sit either side of the boundary', '<code>varchar(n)</code> đếm byte lúc lưu và đếm ký tự lúc ép kiểu, và <code>abcdef</code> tình cờ nằm hai bên ranh giới'),
            B('The INSERT failed because <code>code</code> is a reserved word; rename the column and the insert truncates just like the cast', 'Lệnh INSERT hỏng vì <code>code</code> là từ khoá dành riêng; đổi tên cột thì lệnh chèn cũng cắt ngắn y như phép ép kiểu'),
          ],
          correct: 0,
          explanation: EX(
            'The asymmetry is worth internalising because it decides where you are safe. A length limit on a column is a rule the data must satisfy, so bad input is refused loudly and nothing is lost. An explicit cast is you telling PostgreSQL "make this fit", and it obeys — quietly. The usual place this bites is a query that casts a user-supplied value on the way in, or an ORM mapping that emits <code>::varchar(n)</code>. And the wider advice from lesson 2.2 still stands: in PostgreSQL <code>varchar(n)</code> is neither faster nor smaller than <code>text</code> — they share the same storage — so pick a limit only when the business genuinely has one (a two-letter country code), and use <code>text</code> otherwise. <code>varchar(255)</code> chosen by habit is an old MySQL storage detail that means nothing here.',
            'Sự bất đối xứng này đáng nhớ vì nó quyết định bạn an toàn ở đâu. Giới hạn độ dài trên một cột là một luật mà dữ liệu phải thoả, nên đầu vào sai bị từ chối ồn ào và không mất gì. Còn phép ép kiểu tường minh là chính bạn bảo PostgreSQL "nhét vừa cái này đi", và nó vâng lời — trong im lặng. Chỗ thường dính là một truy vấn ép kiểu giá trị người dùng nhập ngay lúc đi vào, hoặc một ánh xạ ORM sinh ra <code>::varchar(n)</code>. Và lời khuyên rộng hơn ở bài 2.2 vẫn đúng: trong PostgreSQL <code>varchar(n)</code> không nhanh hơn cũng không nhỏ hơn <code>text</code> — chúng dùng chung cách lưu trữ — nên chỉ đặt giới hạn khi nghiệp vụ thật sự có một cái (mã quốc gia hai chữ cái), còn lại thì dùng <code>text</code>. <code>varchar(255)</code> chọn theo thói quen là một chi tiết lưu trữ cũ của MySQL, ở đây nó chẳng có nghĩa gì.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. Explain the third column.' + code(
              "SELECT '90 minutes'::interval                      AS span,\n" +
              "       age('2026-08-10'::date, '2000-01-01'::date) AS elapsed,\n" +
              "       date '2026-01-31' + interval '1 month'      AS cong_mot_thang;\n" +
              '\n' +
              '   span   |        elapsed         |   cong_mot_thang\n' +
              '----------+------------------------+---------------------\n' +
              ' 01:30:00 | 26 years 7 mons 9 days | 2026-02-28 00:00:00',
            ),
            'Đo trên PostgreSQL 16.14. Hãy giải thích cột thứ ba.' + code(
              "SELECT '90 minutes'::interval                      AS span,\n" +
              "       age('2026-08-10'::date, '2000-01-01'::date) AS elapsed,\n" +
              "       date '2026-01-31' + interval '1 month'      AS cong_mot_thang;\n" +
              '\n' +
              '   span   |        elapsed         |   cong_mot_thang\n' +
              '----------+------------------------+---------------------\n' +
              ' 01:30:00 | 26 years 7 mons 9 days | 2026-02-28 00:00:00',
            ),
          ),
          options: [
            B('PostgreSQL treated <code>1 month</code> as exactly 28 days because 2026 is not a leap year, so every month addition in 2026 advances by 28 days', 'PostgreSQL coi <code>1 month</code> đúng bằng 28 ngày vì 2026 không phải năm nhuận, nên mọi phép cộng tháng trong 2026 đều tiến đúng 28 ngày'),
            B('It is an error that PostgreSQL reports as a value: month arithmetic is undefined on the 31st and the result should not be relied on', 'Đó là một lỗi mà PostgreSQL báo dưới dạng một giá trị: phép tính theo tháng không xác định vào ngày 31 và không nên tin kết quả'),
            B('The result came back as a <code>timestamp</code> rather than a <code>date</code>, and the widening conversion to timestamp is what silently dropped the three extra days on the way out', 'Kết quả trả về là một <code>timestamp</code> chứ không phải <code>date</code>, và chính phép nới rộng sang timestamp đã âm thầm làm rụng mất ba ngày thừa lúc đi ra'),
            B('<code>interval</code> is stored as months + days + seconds separately; adding it to a date advanced the MONTH field first and then clamped the day to the last valid day of the target month', '<code>interval</code> được lưu tách riêng thành tháng + ngày + giây; cộng nó vào một date thì trường THÁNG được đẩy lên trước rồi ngày bị kẹp về ngày hợp lệ cuối cùng của tháng đích'),
          ],
          correct: 3,
          explanation: EX(
            'An <code>interval</code> is not a single number of seconds — it carries three independent fields, which is why <code>1 month</code> can mean 28, 29, 30 or 31 days depending on where you land. Adding to <code>2026-01-31</code> pushes the month to February and then clamps 31 to 28, the last valid day. The consequence that surprises people is that this arithmetic is not reversible: <code>date \'2026-01-31\' + interval \'1 month\' - interval \'1 month\'</code> gives 2026-01-28, not the 31st. When you need "the same day next month" to be exact, or a monthly billing date that never drifts, store the intended day-of-month yourself rather than repeatedly adding an interval. (Note also that the result printed as a timestamp — <code>date + interval</code> yields <code>timestamp</code>; add <code>::date</code> if you want a plain calendar day back.)',
            'Một <code>interval</code> không phải một con số giây — nó mang ba trường độc lập, và vì thế <code>1 month</code> có thể là 28, 29, 30 hay 31 ngày tuỳ chỗ bạn đáp xuống. Cộng vào <code>2026-01-31</code> thì tháng bị đẩy sang tháng Hai rồi ngày 31 bị kẹp về 28, ngày hợp lệ cuối cùng. Hệ quả làm nhiều người bất ngờ là phép tính này không đảo ngược được: <code>date \'2026-01-31\' + interval \'1 month\' - interval \'1 month\'</code> ra 2026-01-28 chứ không phải ngày 31. Khi cần "đúng ngày đó của tháng sau" hoặc một ngày chốt hoá đơn hằng tháng không được trôi, hãy tự lưu ngày-trong-tháng mong muốn thay vì cộng interval nhiều lần. (Cũng để ý kết quả in ra dưới dạng timestamp — <code>date + interval</code> cho ra <code>timestamp</code>; muốn lấy lại một ngày lịch thuần thì thêm <code>::date</code>.)',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 with <code>CREATE TYPE mood AS ENUM (\'low\', \'medium\', \'high\')</code>:' + code(
              "INSERT INTO tasks VALUES (1,'high'), (2,'low'), (3,'medium');\n" +
              'SELECT id, p FROM tasks ORDER BY p;\n' +
              ' id |   p\n' +
              '----+--------\n' +
              '  2 | low\n' +
              '  3 | medium\n' +
              '  1 | high\n' +
              '\n' +
              "INSERT INTO tasks VALUES (4, 'urgent');\n" +
              'ERROR:  invalid input value for enum mood: "urgent"',
            ) + 'What do these two results tell you about an enum, and what is the cost?',
            'Đo trên PostgreSQL 16.14 với <code>CREATE TYPE mood AS ENUM (\'low\', \'medium\', \'high\')</code>:' + code(
              "INSERT INTO tasks VALUES (1,'high'), (2,'low'), (3,'medium');\n" +
              'SELECT id, p FROM tasks ORDER BY p;\n' +
              ' id |   p\n' +
              '----+--------\n' +
              '  2 | low\n' +
              '  3 | medium\n' +
              '  1 | high\n' +
              '\n' +
              "INSERT INTO tasks VALUES (4, 'urgent');\n" +
              'ERROR:  invalid input value for enum mood: "urgent"',
            ) + 'Hai kết quả này nói gì về enum, và cái giá là gì?',
          ),
          options: [
            B('It sorted alphabetically and happened to match, and the rejection is a NOT NULL check; enums accept any string that is not empty', 'Nó sắp theo bảng chữ cái và tình cờ trùng khớp, còn lần từ chối là một phép kiểm NOT NULL; enum nhận mọi chuỗi không rỗng'),
            B('It sorted by insertion order of the rows, and the rejection happened because <code>urgent</code> is longer than the longest declared label', 'Nó sắp theo thứ tự chèn của các dòng, còn lần từ chối xảy ra vì <code>urgent</code> dài hơn nhãn dài nhất đã khai'),
            B('It sorts in DECLARATION order (low → medium → high, not alphabetically) and refuses any value outside the set — the cost is rigidity: adding a value needs <code>ALTER TYPE … ADD VALUE</code> and removing one is genuinely hard', 'Nó sắp theo thứ tự KHAI BÁO (low → medium → high, không phải theo bảng chữ cái) và từ chối mọi giá trị ngoài tập — cái giá là sự cứng nhắc: thêm một giá trị phải <code>ALTER TYPE … ADD VALUE</code>, còn bỏ đi một giá trị thì thật sự khó'),
            B('Enum values are stored as their ordinal integers, so the ORDER BY is numeric and you can compare an enum with an integer directly', 'Giá trị enum được lưu dưới dạng số thứ tự, nên ORDER BY là so sánh số và bạn có thể so trực tiếp một enum với một số nguyên'),
          ],
          correct: 2,
          explanation: EX(
            'Declaration-order sorting is the whole reason to reach for an enum over a text column: severities, statuses and sizes have a natural order that alphabetical sorting destroys (<i>high, low, medium</i> is nobody\'s idea of ordered). The rejection is the other half — the set is closed. Both are bought with rigidity, and this repository has the scar: renaming the enum value <code>ContentType.CODE</code> to <code>CODE_REVIEW</code> passed every pre-push check and still broke the seed on production, because a seed file carried a hand-written copy of the union. If your set of values changes often, a <code>text</code> column with a <code>CHECK</code>, or a small lookup table with a foreign key, bends where an enum breaks. (And no, the ordinals are not exposed as integers — comparing an enum to an int is a type error.)',
            'Sắp theo thứ tự khai báo chính là lý do để chọn enum thay vì một cột text: mức độ nghiêm trọng, trạng thái, kích cỡ đều có một thứ tự tự nhiên mà sắp theo bảng chữ cái sẽ phá nát (<i>high, low, medium</i> chẳng ai coi là có thứ tự). Lần từ chối là nửa còn lại — tập giá trị là đóng. Cả hai được mua bằng sự cứng nhắc, và chính kho mã này còn sẹo: đổi tên giá trị enum <code>ContentType.CODE</code> thành <code>CODE_REVIEW</code> đã qua sạch mọi phép kiểm trước khi push mà vẫn vỡ seed trên production, vì một file seed tự chép tay lại cái union. Nếu tập giá trị của bạn đổi luôn, thì một cột <code>text</code> kèm <code>CHECK</code>, hoặc một bảng tra cứu nhỏ kèm khoá ngoại, sẽ uốn được ở chỗ enum gãy. (Và không, số thứ tự không lộ ra thành số nguyên — so enum với int là lỗi kiểu.)',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. Two of these columns came back empty. Which line explains BOTH empty cells?' + code(
              'SELECT (array[10,20,30])[2]          AS phan_tu_2,\n' +
              '       array_length(array[10,20,30],1) AS do_dai,\n' +
              '       (array[10,20,30])[0]          AS idx0,\n' +
              "       array_length(array[]::int[],1) AS mang_rong;\n" +
              '\n' +
              ' phan_tu_2 | do_dai | idx0 | mang_rong\n' +
              '-----------+--------+------+-----------\n' +
              '        20 |      3 |      |',
            ),
            'Đo trên PostgreSQL 16.14. Hai cột trong số này trả về rỗng. Câu nào giải thích được CẢ HAI ô rỗng?' + code(
              'SELECT (array[10,20,30])[2]          AS phan_tu_2,\n' +
              '       array_length(array[10,20,30],1) AS do_dai,\n' +
              '       (array[10,20,30])[0]          AS idx0,\n' +
              "       array_length(array[]::int[],1) AS mang_rong;\n" +
              '\n' +
              ' phan_tu_2 | do_dai | idx0 | mang_rong\n' +
              '-----------+--------+------+-----------\n' +
              '        20 |      3 |      |',
            ),
          ),
          options: [
            B('Both are zero and psql renders a numeric zero as an empty cell, which is why <code>do_dai</code> shows 3 but the other two show nothing', 'Cả hai đều bằng 0 và psql vẽ số 0 thành ô trống, vì thế <code>do_dai</code> hiện 3 còn hai cột kia không hiện gì'),
            B('Both are NULL: SQL arrays are 1-INDEXED so subscript 0 is out of bounds (out-of-bounds returns NULL, it does not raise), and <code>array_length</code> of an empty array is NULL rather than 0', 'Cả hai đều là NULL: mảng trong SQL đánh số từ 1 nên chỉ số 0 nằm ngoài biên (ngoài biên trả NULL chứ không báo lỗi), và <code>array_length</code> của một mảng rỗng là NULL chứ không phải 0'),
            B('Both raised an error that psql swallowed because the other two columns of the same row succeeded', 'Cả hai đều báo lỗi nhưng psql nuốt mất vì hai cột còn lại của cùng dòng đó đã thành công'),
            B('<code>array[]::int[]</code> is not a valid empty array, so the whole row is degraded and every column after the first NULL is blanked', '<code>array[]::int[]</code> không phải một mảng rỗng hợp lệ, nên cả dòng bị suy biến và mọi cột sau ô NULL đầu tiên đều bị bỏ trống'),
          ],
          correct: 1,
          explanation: EX(
            'Two independent surprises, both of which produce NULL rather than an error, and NULL is exactly what makes them dangerous — the query keeps working and the answer is quietly wrong. Arrays start at 1, so a loop written from 0 by habit silently reads nothing. And an empty array has no dimension at all, so <code>array_length(a, 1)</code> is NULL: <code>WHERE array_length(tags,1) &gt; 0</code> therefore drops rows with an empty array AND rows with a NULL array, both for the same three-valued-logic reason from lesson 4.2. Use <code>cardinality(a)</code> instead, which returns 0 for an empty array. And the broader advice from 2.4 holds: an array is right for a short list you always read whole, but "all notes tagged sql" across millions of rows wants a real tags table and a join.',
            'Hai bất ngờ độc lập, cả hai đều cho ra NULL chứ không báo lỗi — và chính NULL mới là chỗ nguy hiểm: truy vấn vẫn chạy còn câu trả lời thì sai trong im lặng. Mảng bắt đầu từ 1, nên một vòng lặp viết từ 0 theo thói quen sẽ âm thầm đọc rỗng. Và một mảng rỗng thì không có chiều nào cả, nên <code>array_length(a, 1)</code> là NULL: vì thế <code>WHERE array_length(tags,1) &gt; 0</code> loại bỏ cả dòng có mảng rỗng LẪN dòng có mảng NULL, cùng một lý do logic ba trạng thái ở bài 4.2. Hãy dùng <code>cardinality(a)</code>, hàm này trả 0 cho mảng rỗng. Và lời khuyên rộng hơn ở 2.4 vẫn đúng: mảng hợp với một danh sách ngắn mà bạn luôn đọc trọn, còn "mọi note gắn thẻ sql" trên hàng triệu dòng thì cần một bảng tag thật và một phép join.',
          ),
        }),

        // ── Chương 3 — Bảng, ràng buộc & thiết kế lược đồ ────────────────
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on <code>CREATE TABLE tu (x int UNIQUE)</code>:' + code(
              'INSERT INTO tu VALUES (NULL), (NULL), (1);\n' +
              'INSERT 0 3\n' +
              '\n' +
              'INSERT INTO tu VALUES (1);\n' +
              'ERROR:  duplicate key value violates unique constraint "tu_x_key"\n' +
              'DETAIL:  Key (x)=(1) already exists.',
            ) + 'Why were two NULLs accepted but a second <code>1</code> rejected?',
            'Đo trên PostgreSQL 16.14 với <code>CREATE TABLE tu (x int UNIQUE)</code>:' + code(
              'INSERT INTO tu VALUES (NULL), (NULL), (1);\n' +
              'INSERT 0 3\n' +
              '\n' +
              'INSERT INTO tu VALUES (1);\n' +
              'ERROR:  duplicate key value violates unique constraint "tu_x_key"\n' +
              'DETAIL:  Key (x)=(1) already exists.',
            ) + 'Vì sao hai giá trị NULL được nhận mà giá trị <code>1</code> thứ hai lại bị từ chối?',
          ),
          options: [
            B('UNIQUE compares with <code>=</code>, and <code>NULL = NULL</code> is UNKNOWN — never true — so two unknowns are not "the same value" and both fit. If you need at most one, add NOT NULL, or in PG15+ declare <code>UNIQUE NULLS NOT DISTINCT</code>', 'UNIQUE so bằng <code>=</code>, mà <code>NULL = NULL</code> là UNKNOWN — không bao giờ đúng — nên hai cái chưa biết không phải "cùng một giá trị" và cả hai đều lọt. Muốn nhiều nhất một cái thì thêm NOT NULL, hoặc từ PG15 khai <code>UNIQUE NULLS NOT DISTINCT</code>'),
            B('The index behind a UNIQUE constraint simply does not store NULL rows, so a NULL can never be found and never collides — and it also cannot be looked up by that index', 'Chỉ mục đằng sau ràng buộc UNIQUE đơn giản là không lưu các dòng NULL, nên một NULL không bao giờ tìm thấy được và không bao giờ đụng — và cũng không tra được bằng chỉ mục đó'),
            B('The three values went in as one statement, and a UNIQUE constraint is only checked between statements, so the duplicate NULLs were never compared to each other', 'Ba giá trị đi vào trong cùng một câu lệnh, mà ràng buộc UNIQUE chỉ được kiểm giữa các câu lệnh, nên hai NULL trùng nhau chưa từng được đem so với nhau'),
            B('NULL is stored as a distinct sentinel value per row (a hidden row id), so every NULL is literally a different value in the index', 'NULL được lưu thành một giá trị đánh dấu riêng cho từng dòng (một id dòng ẩn), nên mỗi NULL thực sự là một giá trị khác nhau trong chỉ mục'),
          ],
          correct: 0,
          explanation: EX(
            'This is the NULL rule from lesson 4.2 showing up in a constraint. UNIQUE asks "is this equal to an existing value?", and any comparison with NULL answers UNKNOWN, which is not TRUE, so the row is allowed. The practical consequence is a real bug class: a <code>UNIQUE</code> on a nullable <code>email</code> column does not stop you from having ten thousand rows with no email, which is usually fine — and a <code>UNIQUE (user_id, deleted_at)</code> intended as "one active row per user" does not work at all, because every soft-deleted row has <code>deleted_at IS NULL</code>… no, precisely the opposite: the ACTIVE rows have NULL, so any number of them fit. The idiomatic fix is a partial unique index: <code>CREATE UNIQUE INDEX … ON t (user_id) WHERE deleted_at IS NULL</code>. Note the other half of the output: the constraint auto-named itself <code>tu_x_key</code>, the pattern <code>&lt;table&gt;_&lt;column&gt;_key</code>.',
            'Đây là luật NULL ở bài 4.2 hiện ra trong một ràng buộc. UNIQUE hỏi "cái này có bằng một giá trị đã có không?", mà mọi phép so sánh với NULL đều trả lời UNKNOWN — không phải TRUE — nên dòng đó được cho qua. Hệ quả thực tế là cả một lớp lỗi thật: một <code>UNIQUE</code> trên cột <code>email</code> cho phép NULL không ngăn bạn có mười nghìn dòng không email, chuyện đó thường vô hại — còn một <code>UNIQUE (user_id, deleted_at)</code> định làm "mỗi người một dòng đang hoạt động" thì hỏng hoàn toàn, vì chính các dòng ĐANG HOẠT ĐỘNG mới có <code>deleted_at</code> là NULL, nên bao nhiêu dòng cũng lọt. Cách sửa đúng bài là một chỉ mục duy nhất từng phần: <code>CREATE UNIQUE INDEX … ON t (user_id) WHERE deleted_at IS NULL</code>. Để ý thêm nửa còn lại của output: ràng buộc tự đặt tên <code>tu_x_key</code>, theo khuôn <code>&lt;bảng&gt;_&lt;cột&gt;_key</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on <code>CREATE TABLE tchk (x int CHECK (x &gt; 0))</code>:' + code(
              'INSERT INTO tchk VALUES (NULL);\n' +
              'INSERT 0 1                       ← accepted\n' +
              '\n' +
              'INSERT INTO tchk VALUES (0);\n' +
              'ERROR:  new row for relation "tchk" violates check constraint "tchk_x_check"',
            ) + 'Why did the NULL get in?',
            'Đo trên PostgreSQL 16.14 với <code>CREATE TABLE tchk (x int CHECK (x &gt; 0))</code>:' + code(
              'INSERT INTO tchk VALUES (NULL);\n' +
              'INSERT 0 1                       ← được nhận\n' +
              '\n' +
              'INSERT INTO tchk VALUES (0);\n' +
              'ERROR:  new row for relation "tchk" violates check constraint "tchk_x_check"',
            ) + 'Vì sao giá trị NULL lọt được vào?',
          ),
          options: [
            B('CHECK constraints are only evaluated on columns that were explicitly listed in the INSERT, and this INSERT used positional VALUES', 'Ràng buộc CHECK chỉ được tính trên những cột được liệt kê tường minh trong lệnh INSERT, mà lệnh này dùng VALUES theo vị trí'),
            B('PostgreSQL treats a NULL integer as 0 for comparison purposes, and <code>0 &gt; 0</code> is borderline, so the row is allowed with a warning', 'PostgreSQL coi một số nguyên NULL là 0 khi so sánh, và <code>0 &gt; 0</code> nằm ở ranh giới nên dòng được cho qua kèm một cảnh báo'),
            B('The constraint fires only when the column already holds a value, i.e. on UPDATE; a fresh INSERT is exempt', 'Ràng buộc chỉ kích hoạt khi cột đã có sẵn một giá trị, tức là lúc UPDATE; một lệnh INSERT mới thì được miễn'),
            B('A CHECK rejects a row only when the condition evaluates to FALSE. <code>NULL &gt; 0</code> is UNKNOWN, not FALSE — so the row passes. A CHECK is not a substitute for NOT NULL', 'Một CHECK chỉ từ chối dòng khi điều kiện tính ra FALSE. <code>NULL &gt; 0</code> là UNKNOWN chứ không phải FALSE — nên dòng lọt qua. CHECK không thay được NOT NULL'),
          ],
          correct: 3,
          explanation: EX(
            'This is the single most useful asymmetry in the whole NULL story, and it runs the opposite way to <code>WHERE</code>. <code>WHERE</code> keeps only rows where the condition is TRUE, so UNKNOWN behaves like FALSE and the row disappears. <code>CHECK</code> rejects only when the condition is FALSE, so UNKNOWN behaves like TRUE and the row is kept. Same three-valued logic, opposite default — which is exactly why a table with <code>CHECK (price &gt;= 0)</code> can quietly accumulate rows with no price at all. Write <code>price numeric(12,2) NOT NULL CHECK (price &gt;= 0)</code>, and if the column genuinely may be missing but must be valid when present, say so explicitly: <code>CHECK (price IS NULL OR price &gt;= 0)</code>. NOT NULL is also the cheapest constraint you will ever add and the hardest to add later, once NULLs are already in the table.',
            'Đây là chỗ bất đối xứng hữu ích nhất trong cả câu chuyện NULL, và nó chạy ngược chiều với <code>WHERE</code>. <code>WHERE</code> chỉ giữ dòng nào điều kiện ra TRUE, nên UNKNOWN hành xử như FALSE và dòng biến mất. <code>CHECK</code> chỉ từ chối khi điều kiện ra FALSE, nên UNKNOWN hành xử như TRUE và dòng được giữ. Cùng một logic ba trạng thái, mặc định ngược nhau — và chính vì thế một bảng có <code>CHECK (price &gt;= 0)</code> vẫn có thể âm thầm tích tụ những dòng không có giá nào cả. Hãy viết <code>price numeric(12,2) NOT NULL CHECK (price &gt;= 0)</code>, và nếu cột thật sự có thể thiếu nhưng khi có thì phải hợp lệ, hãy nói thẳng ra: <code>CHECK (price IS NULL OR price &gt;= 0)</code>. NOT NULL cũng là ràng buộc rẻ nhất bạn từng thêm và khó thêm nhất về sau, một khi NULL đã nằm sẵn trong bảng.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. The <code>CREATE TABLE</code> succeeded; the <code>DELETE</code> did not:' + code(
              'CREATE TABLE n_s (\n' +
              '  id  int PRIMARY KEY,\n' +
              '  uid int NOT NULL REFERENCES u_s(id) ON DELETE SET NULL\n' +
              ');\n' +
              'CREATE TABLE\n' +
              '\n' +
              'DELETE FROM u_s WHERE id = 1;\n' +
              'ERROR:  null value in column "uid" of relation "n_s" violates not-null constraint\n' +
              'DETAIL:  Failing row contains (1, null).\n' +
              'CONTEXT:  SQL statement "UPDATE ONLY "public"."n_s" SET "uid" = NULL WHERE ..."',
            ) + 'What does the CONTEXT line reveal?',
            'Đo trên PostgreSQL 16.14. Lệnh <code>CREATE TABLE</code> thành công; lệnh <code>DELETE</code> thì không:' + code(
              'CREATE TABLE n_s (\n' +
              '  id  int PRIMARY KEY,\n' +
              '  uid int NOT NULL REFERENCES u_s(id) ON DELETE SET NULL\n' +
              ');\n' +
              'CREATE TABLE\n' +
              '\n' +
              'DELETE FROM u_s WHERE id = 1;\n' +
              'ERROR:  null value in column "uid" of relation "n_s" violates not-null constraint\n' +
              'DETAIL:  Failing row contains (1, null).\n' +
              'CONTEXT:  SQL statement "UPDATE ONLY "public"."n_s" SET "uid" = NULL WHERE ..."',
            ) + 'Dòng CONTEXT tiết lộ điều gì?',
          ),
          options: [
            B('That <code>ON DELETE SET NULL</code> is never supported on a column that also carries a foreign key declaration, so the <code>CREATE TABLE</code> should have been rejected at definition time and accepting it is the actual bug here', 'Rằng <code>ON DELETE SET NULL</code> không bao giờ được hỗ trợ trên một cột đồng thời mang khai báo khoá ngoại, nên lệnh <code>CREATE TABLE</code> lẽ ra phải bị từ chối ngay lúc định nghĩa, và việc nó được chấp nhận mới là lỗi thật sự ở đây'),
            B('That the <code>DELETE</code> itself committed and a separate background job then failed while cleaning up the child rows, which is why the parent is already gone but the error mentions the child table', 'Rằng bản thân lệnh <code>DELETE</code> đã commit và một tác vụ nền riêng biệt sau đó mới hỏng trong lúc dọn các dòng con, và vì thế dòng cha thì đã biến mất còn thông báo lỗi lại nhắc tới bảng con'),
            B('<code>ON DELETE SET NULL</code> is implemented as a real UPDATE of the child rows, which must satisfy every constraint on the child — so <code>SET NULL</code> and <code>NOT NULL</code> are contradictory, and the contradiction only surfaces the day someone deletes a parent', '<code>ON DELETE SET NULL</code> được cài đặt bằng một lệnh UPDATE thật lên các dòng con, mà lệnh đó phải thoả mọi ràng buộc của bảng con — nên <code>SET NULL</code> và <code>NOT NULL</code> mâu thuẫn nhau, và mâu thuẫn ấy chỉ lộ ra vào ngày có người xoá một dòng cha'),
            B('That PostgreSQL silently rewrote the <code>DELETE</code> into an <code>UPDATE</code> because the parent row was still referenced by a child, which is exactly the mechanism behind the default <code>RESTRICT</code> behaviour', 'Rằng PostgreSQL đã âm thầm viết lại lệnh <code>DELETE</code> thành <code>UPDATE</code> vì dòng cha vẫn còn được một dòng con tham chiếu — và đó chính là cơ chế đằng sau hành vi <code>RESTRICT</code> mặc định'),
          ],
          correct: 2,
          explanation: EX(
            'The referential action is not magic bookkeeping: <code>SET NULL</code> literally issues <code>UPDATE child SET fk = NULL</code>, <code>CASCADE</code> literally issues <code>DELETE FROM child</code>, and both go through the child table\'s constraints and triggers like any other write. So a <code>NOT NULL</code> column with <code>ON DELETE SET NULL</code> is a table that accepts data happily and then refuses every parent deletion, forever — a time bomb that <code>CREATE TABLE</code> is happy to arm. Choose deliberately: <code>SET NULL</code> needs a nullable column and means "the child outlives the link" (a post whose category was deleted); <code>CASCADE</code> means "the child cannot exist alone" (an order line without its order) and is dangerous everywhere else, because one delete can chain across nine tables; the default <code>NO ACTION</code>/<code>RESTRICT</code> refuses loudly and is the right choice when unsure.',
            'Hành vi tham chiếu không phải một phép ghi sổ ma thuật: <code>SET NULL</code> phát ra đúng nghĩa đen một lệnh <code>UPDATE child SET fk = NULL</code>, <code>CASCADE</code> phát ra đúng nghĩa đen một lệnh <code>DELETE FROM child</code>, và cả hai đều đi qua ràng buộc lẫn trigger của bảng con y như mọi lệnh ghi khác. Nên một cột <code>NOT NULL</code> kèm <code>ON DELETE SET NULL</code> là một cái bảng vui vẻ nhận dữ liệu rồi từ chối mọi lần xoá cha, mãi mãi — một quả bom hẹn giờ mà <code>CREATE TABLE</code> sẵn lòng lên cò. Hãy chọn có chủ đích: <code>SET NULL</code> cần cột cho phép NULL và mang nghĩa "con sống lâu hơn mối liên hệ" (một bài viết mà chuyên mục đã bị xoá); <code>CASCADE</code> nghĩa là "con không thể tồn tại một mình" (một dòng hàng không có đơn hàng) và nguy hiểm ở mọi chỗ khác, vì một lần xoá có thể kéo dây qua chín bảng; còn mặc định <code>NO ACTION</code>/<code>RESTRICT</code> từ chối ồn ào và là lựa chọn đúng khi chưa chắc.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14, on a table with <code>final numeric(12,2) GENERATED ALWAYS AS (round(price * (100 - disc) / 100, 2)) STORED</code>:' + code(
              "INSERT INTO product(sku, price, final) VALUES ('A6', 10, 5);\n" +
              'ERROR:  cannot insert a non-DEFAULT value into column "final"\n' +
              '\n' +
              "UPDATE product SET price = 200 WHERE sku = 'A1';   -- disc = 10\n" +
              ' sku | price  | disc | final\n' +
              '-----+--------+------+--------\n' +
              ' A1  | 200.00 |   10 | 180.00',
            ) + 'Which pair of statements is right about a generated column?',
            'Đo trên PostgreSQL 16.14, trên một bảng có <code>final numeric(12,2) GENERATED ALWAYS AS (round(price * (100 - disc) / 100, 2)) STORED</code>:' + code(
              "INSERT INTO product(sku, price, final) VALUES ('A6', 10, 5);\n" +
              'ERROR:  cannot insert a non-DEFAULT value into column "final"\n' +
              '\n' +
              "UPDATE product SET price = 200 WHERE sku = 'A1';   -- disc = 10\n" +
              ' sku | price  | disc | final\n' +
              '-----+--------+------+--------\n' +
              ' A1  | 200.00 |   10 | 180.00',
            ) + 'Cặp phát biểu nào đúng về một cột sinh?',
          ),
          options: [
            B('You cannot write it, and it is recomputed whenever an input changes — it is a DEFAULT that never goes stale, which is what a plain column set by hand cannot promise', 'Bạn không ghi vào nó được, và nó được tính lại mỗi khi một đầu vào thay đổi — nó là một DEFAULT không bao giờ cũ, thứ mà một cột thường gán bằng tay không hứa nổi'),
            B('You cannot write it, and it is recomputed only by <code>VACUUM</code>, so a row read between the UPDATE and the next vacuum still shows the old value', 'Bạn không ghi vào nó được, và nó chỉ được tính lại bởi <code>VACUUM</code>, nên một dòng đọc ra giữa lúc UPDATE và lần vacuum kế tiếp vẫn hiện giá trị cũ'),
            B('You can write it if you list it first in the column list, and it is recomputed only on INSERT, never on UPDATE', 'Bạn ghi được vào nó nếu liệt kê nó đầu tiên trong danh sách cột, và nó chỉ được tính lại lúc INSERT chứ không bao giờ lúc UPDATE'),
            B('It is not stored at all despite the STORED keyword — the expression is evaluated at read time, which is why it can never disagree with its inputs', 'Nó hoàn toàn không được lưu bất chấp từ khoá STORED — biểu thức được tính lúc đọc, và vì thế nó không bao giờ lệch với đầu vào của mình'),
          ],
          correct: 0,
          explanation: EX(
            'Both halves are the point. The rejection is a feature: if <code>final</code> were an ordinary column you set by hand, someone would eventually update <code>price</code> and forget to recompute it, and now your data lies with no error anywhere. Making the write impossible removes the failure mode. And <code>STORED</code> means the value really is written to the heap — it costs disk and it is recomputed on every INSERT and on every UPDATE that touches an input, which is why a heavy expression here taxes every write. Two limits worth knowing: the expression must be IMMUTABLE (no <code>now()</code>, no subqueries, no reference to other rows — the same rule that will bite you again in Chapter 12), and PostgreSQL 16 supports only <code>STORED</code>; there is no virtual/computed-on-read generated column yet.',
            'Cả hai nửa đều là trọng tâm. Lời từ chối là một tính năng: nếu <code>final</code> là một cột thường mà bạn gán tay, thì sớm muộn cũng có người sửa <code>price</code> rồi quên tính lại, và dữ liệu bắt đầu nói dối mà không lỗi ở đâu cả. Làm cho việc ghi trở thành bất khả thi là xoá luôn kiểu hỏng ấy. Còn <code>STORED</code> nghĩa là giá trị được ghi thật xuống heap — nó tốn đĩa và được tính lại ở mọi lần INSERT lẫn mọi lần UPDATE chạm vào một đầu vào, nên một biểu thức nặng đặt ở đây là thuế đánh lên mọi lần ghi. Hai giới hạn đáng nhớ: biểu thức phải IMMUTABLE (không <code>now()</code>, không subquery, không tham chiếu dòng khác — đúng cái luật sẽ cắn bạn lần nữa ở Chương 12), và PostgreSQL 16 mới chỉ hỗ trợ <code>STORED</code>; chưa có cột sinh kiểu ảo tính lúc đọc.',
          ),
        }),

        mcq({
          prompt: B(
            'A join table links notes to tags. Which of these four inserts is the ONE that gets rejected, and why?' + code(
              'CREATE TABLE note_tag (\n' +
              '  note_id  bigint,\n' +
              '  tag_slug text,\n' +
              '  PRIMARY KEY (note_id, tag_slug)\n' +
              ');\n' +
              "INSERT INTO note_tag VALUES (1,'sql');   -- A\n" +
              "INSERT INTO note_tag VALUES (1,'db');    -- B\n" +
              "INSERT INTO note_tag VALUES (2,'sql');   -- C\n" +
              "INSERT INTO note_tag VALUES (1,'sql');   -- D",
            ),
            'Một bảng nối liên kết note với tag. Câu chèn nào trong bốn câu là câu DUY NHẤT bị từ chối, và vì sao?' + code(
              'CREATE TABLE note_tag (\n' +
              '  note_id  bigint,\n' +
              '  tag_slug text,\n' +
              '  PRIMARY KEY (note_id, tag_slug)\n' +
              ');\n' +
              "INSERT INTO note_tag VALUES (1,'sql');   -- A\n" +
              "INSERT INTO note_tag VALUES (1,'db');    -- B\n" +
              "INSERT INTO note_tag VALUES (2,'sql');   -- C\n" +
              "INSERT INTO note_tag VALUES (1,'sql');   -- D",
            ),
          ),
          options: [
            B('None of them — a composite primary key only rejects a duplicate when both columns are ALSO declared <code>NOT NULL UNIQUE</code> individually, and here neither of them is', 'Không câu nào — khoá chính tổ hợp chỉ từ chối trùng lặp khi cả hai cột CÒN được khai <code>NOT NULL UNIQUE</code> riêng lẻ nữa, mà ở đây không cột nào được khai như thế'),
            B('<b>B</b> — <code>note_id</code> is the first column of the key, so it must be unique on its own; note 1 cannot carry a second tag', '<b>B</b> — <code>note_id</code> là cột đầu của khoá nên bản thân nó phải duy nhất; note 1 không mang được tag thứ hai'),
            B('<b>C</b> — <code>tag_slug</code> is part of the key, so the slug <code>sql</code> is consumed by the first row and cannot be reused on another note', '<b>C</b> — <code>tag_slug</code> nằm trong khoá nên slug <code>sql</code> đã bị dòng đầu tiên chiếm mất và không dùng lại được cho note khác'),
            B('<b>D</b> — a composite primary key requires the COMBINATION to be unique, not each column, so note 1 may have many tags and tag <code>sql</code> may be on many notes, but the exact pair (1, sql) can appear only once', '<b>D</b> — khoá chính tổ hợp đòi TỔ HỢP phải duy nhất chứ không phải từng cột, nên note 1 có thể có nhiều tag và tag <code>sql</code> có thể nằm trên nhiều note, nhưng đúng cặp (1, sql) chỉ được xuất hiện một lần'),
          ],
          correct: 3,
          explanation: EX(
            'This is the shape that models a many-to-many relationship with zero duplicate rows, and the reason it works is that the identity of the row is the PAIR. The measured error names it precisely: <code>duplicate key value violates unique constraint "note_tag_pkey"</code>, <code>DETAIL: Key (note_id, tag_slug)=(1, sql) already exists.</code> Two things ride along for free: <code>PRIMARY KEY</code> implies <code>NOT NULL</code> on BOTH columns, and it builds one composite B-tree index on <code>(note_id, tag_slug)</code> in that order — which serves "all tags of note 1" but not "all notes with tag sql", so a join table almost always wants a second index on <code>(tag_slug)</code> or the reverse pair. The rule of thumb from lesson 3.1: surrogate <code>bigint identity</code> for entity tables, composite key for pure join tables.',
            'Đây là hình dạng mô hình hoá quan hệ nhiều-nhiều mà không sinh ra dòng trùng, và lý do nó chạy được là vì danh tính của dòng chính là CẶP giá trị. Lỗi đo được gọi tên rất chính xác: <code>duplicate key value violates unique constraint "note_tag_pkey"</code>, <code>DETAIL: Key (note_id, tag_slug)=(1, sql) already exists.</code> Hai thứ đi kèm miễn phí: <code>PRIMARY KEY</code> kéo theo <code>NOT NULL</code> trên CẢ HAI cột, và nó dựng một chỉ mục B-tree tổ hợp trên <code>(note_id, tag_slug)</code> đúng thứ tự đó — phục vụ được "mọi tag của note 1" nhưng không phục vụ "mọi note có tag sql", nên một bảng nối gần như luôn cần thêm chỉ mục thứ hai trên <code>(tag_slug)</code> hoặc trên cặp đảo ngược. Nguyên tắc ở bài 3.1: khoá thay thế <code>bigint identity</code> cho bảng thực thể, khoá tổ hợp cho bảng nối thuần tuý.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 against a <code>contact</code> table that already holds two rows. Two of the three succeeded:' + code(
              'ALTER TABLE contact ADD COLUMN email  text;                        -- A: ALTER TABLE\n' +
              "ALTER TABLE contact ADD COLUMN status text NOT NULL DEFAULT 'a';   -- B: ALTER TABLE\n" +
              'ALTER TABLE contact ADD COLUMN phone  text NOT NULL;               -- C: ERROR\n' +
              '\n' +
              'ERROR:  column "phone" of relation "contact" contains null values',
            ) + 'Why did C fail while B did not, and what is the migration recipe?',
            'Đo trên PostgreSQL 16.14 trên bảng <code>contact</code> đã có sẵn hai dòng. Hai trong ba câu thành công:' + code(
              'ALTER TABLE contact ADD COLUMN email  text;                        -- A: ALTER TABLE\n' +
              "ALTER TABLE contact ADD COLUMN status text NOT NULL DEFAULT 'a';   -- B: ALTER TABLE\n" +
              'ALTER TABLE contact ADD COLUMN phone  text NOT NULL;               -- C: ERROR\n' +
              '\n' +
              'ERROR:  column "phone" of relation "contact" contains null values',
            ) + 'Vì sao C hỏng mà B thì không, và công thức migration là gì?',
          ),
          options: [
            B('C failed because <code>phone</code> was added last and PostgreSQL only allows two ALTERs per table per transaction; split it into its own migration', 'C hỏng vì <code>phone</code> được thêm cuối cùng và PostgreSQL chỉ cho phép hai lệnh ALTER trên một bảng trong một giao dịch; hãy tách nó thành một migration riêng'),
            B('C failed because <code>text</code> has no implicit default; declare it <code>varchar</code> and the empty string fills the existing rows automatically', 'C hỏng vì <code>text</code> không có giá trị mặc định ngầm; hãy khai nó là <code>varchar</code> và chuỗi rỗng sẽ tự điền cho các dòng đã có'),
            B('C failed because the two existing rows would have a NULL phone, which the new rule forbids and there is no DEFAULT to fill them. The recipe: add it nullable → backfill → <code>ALTER … SET NOT NULL</code>', 'C hỏng vì hai dòng đã có sẽ có phone NULL, điều mà luật mới cấm và lại không có DEFAULT nào để điền vào. Công thức: thêm cột cho phép NULL → điền dữ liệu → <code>ALTER … SET NOT NULL</code>'),
            B('Both B and C rewrote the whole table; C only reported it because a rewrite that changes a constraint must report the rows it could not convert', 'Cả B lẫn C đều viết lại cả bảng; C chỉ báo lỗi vì một lần viết lại có đổi ràng buộc thì phải báo cáo những dòng nó không chuyển đổi được'),
          ],
          correct: 2,
          explanation: EX(
            'A new <code>NOT NULL</code> column has to have a value in every row that already exists, and without a <code>DEFAULT</code> there is nothing to put there. B worked because the default supplied one. In a real migration on a live table you do it in three steps precisely so no step needs a long lock: add nullable (instant, metadata only), backfill in batches, then <code>SET NOT NULL</code>. Worth pairing with the lock note from lesson 3.4, because the same statements have wildly different costs at scale: adding a nullable column or a column with a CONSTANT default is metadata-only and instant regardless of table size; changing a column\'s TYPE rewrites the whole table under <code>ACCESS EXCLUSIVE</code>; adding <code>NOT NULL</code> or a <code>CHECK</code> scans without rewriting — and you can soften that one with <code>ADD CONSTRAINT … NOT VALID</code> followed by a separate <code>VALIDATE CONSTRAINT</code>, which takes a weaker lock.',
            'Một cột <code>NOT NULL</code> mới buộc phải có giá trị ở mọi dòng đã tồn tại, mà không có <code>DEFAULT</code> thì chẳng có gì để đặt vào đó. B chạy được vì default đã cung cấp sẵn một giá trị. Trong một migration thật trên bảng đang chạy, người ta làm ba bước đúng là để không bước nào cần giữ khoá lâu: thêm cột cho phép NULL (tức thì, chỉ đụng metadata), điền dữ liệu theo từng lô, rồi <code>SET NOT NULL</code>. Nên ghép với ghi chú về khoá ở bài 3.4, vì cùng những câu lệnh ấy có chi phí khác hẳn nhau khi bảng lớn: thêm cột cho phép NULL hoặc cột có DEFAULT là HẰNG thì chỉ đụng metadata và tức thì bất kể bảng to cỡ nào; đổi KIỂU của một cột thì viết lại cả bảng dưới khoá <code>ACCESS EXCLUSIVE</code>; thêm <code>NOT NULL</code> hay <code>CHECK</code> thì quét chứ không viết lại — và bạn có thể làm nhẹ cái cuối bằng <code>ADD CONSTRAINT … NOT VALID</code> rồi <code>VALIDATE CONSTRAINT</code> riêng, bước sau lấy khoá nhẹ hơn.',
          ),
        }),

        // ── Chương 4 — Chèn & truy vấn ──────────────────────────────────
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on <code>tag_stat(tag text PRIMARY KEY, hits int)</code> which already holds <code>(\'sql\', 2)</code>:' + code(
              "INSERT INTO tag_stat VALUES ('sql', 50)\n" +
              '  ON CONFLICT (tag) DO UPDATE SET hits = EXCLUDED.hits\n' +
              '  RETURNING tag, hits;\n' +
              ' tag | hits\n' +
              '-----+------\n' +
              ' sql |   50',
            ) + 'What is <code>EXCLUDED</code>, and how would the result differ with <code>SET hits = tag_stat.hits + 1</code>?',
            'Đo trên PostgreSQL 16.14 trên bảng <code>tag_stat(tag text PRIMARY KEY, hits int)</code> đang chứa sẵn <code>(\'sql\', 2)</code>:' + code(
              "INSERT INTO tag_stat VALUES ('sql', 50)\n" +
              '  ON CONFLICT (tag) DO UPDATE SET hits = EXCLUDED.hits\n' +
              '  RETURNING tag, hits;\n' +
              ' tag | hits\n' +
              '-----+------\n' +
              ' sql |   50',
            ) + '<code>EXCLUDED</code> là gì, và kết quả sẽ khác thế nào nếu viết <code>SET hits = tag_stat.hits + 1</code>?',
          ),
          options: [
            B('<code>EXCLUDED</code> is the set of rows the constraint excluded from the insert on previous runs, so it accumulates; the alternative form would have given 52', '<code>EXCLUDED</code> là tập các dòng mà ràng buộc đã loại khỏi lệnh chèn ở những lần chạy trước, nên nó tích luỹ; dạng còn lại sẽ cho ra 52'),
            B('<code>EXCLUDED</code> is a reserved alias for the row PROPOSED by this insert (the 50), while the table name refers to the row ALREADY stored (the 2) — so the alternative form would have given 3', '<code>EXCLUDED</code> là bí danh dành riêng cho dòng mà lệnh chèn này ĐỀ XUẤT (số 50), còn tên bảng trỏ tới dòng ĐANG CÓ SẴN (số 2) — nên dạng còn lại sẽ cho ra 3'),
            B('They are two spellings of the same thing; both refer to the stored row, and both would have given 3', 'Hai cách viết cho cùng một thứ; cả hai đều trỏ tới dòng đang lưu, và cả hai đều cho ra 3'),
            B('<code>EXCLUDED</code> refers to the stored row and <code>tag_stat.hits</code> to the proposed one, so the two forms are simply swapped and the alternative would have given 51', '<code>EXCLUDED</code> trỏ tới dòng đang lưu còn <code>tag_stat.hits</code> trỏ tới dòng đề xuất, nên hai dạng chỉ là đổi chỗ cho nhau và dạng còn lại sẽ cho ra 51'),
          ],
          correct: 1,
          explanation: EX(
            'Inside <code>DO UPDATE</code> you have both rows in scope and the names are how you choose: the TABLE name is the row on disk, <code>EXCLUDED</code> is the row your INSERT tried to write. That is what makes the two idioms readable — <code>SET hits = EXCLUDED.hits</code> means "overwrite with what I just sent" (the classic idempotent upsert of a seeder), and <code>SET hits = tag_stat.hits + 1</code> means "increment what is already there" (the hit counter, measured going 1 → 2 → 3 across three runs). The whole point of doing it in one statement is that it is atomic: a check-then-insert in application code has a race window where two requests both find nothing and both insert. Two refinements from lesson 4.1: always name the conflict target (<code>ON CONFLICT (tag)</code>) so a conflict on some OTHER constraint still raises instead of being swallowed, and add <code>RETURNING</code> when you need to know what actually happened.',
            'Bên trong <code>DO UPDATE</code> bạn có cả hai dòng trong tầm nhìn, và cái tên chính là cách bạn chọn: tên BẢNG là dòng đang nằm trên đĩa, còn <code>EXCLUDED</code> là dòng mà lệnh INSERT của bạn định ghi. Đó là thứ làm hai thành ngữ này đọc lên rõ nghĩa — <code>SET hits = EXCLUDED.hits</code> nghĩa là "ghi đè bằng thứ tôi vừa gửi" (kiểu upsert bất biến kinh điển của một seeder), còn <code>SET hits = tag_stat.hits + 1</code> nghĩa là "tăng thêm vào thứ đang có" (bộ đếm lượt, đo được đi 1 → 2 → 3 qua ba lần chạy). Toàn bộ lý do gói nó trong một câu lệnh là tính nguyên tử: kiểu kiểm-rồi-chèn trong mã ứng dụng có một khe hở tranh chấp, nơi hai yêu cầu cùng thấy chưa có gì và cùng chèn. Hai điểm tinh chỉnh ở bài 4.1: luôn nêu tên mục tiêu xung đột (<code>ON CONFLICT (tag)</code>) để một xung đột trên ràng buộc KHÁC vẫn báo lỗi chứ không bị nuốt, và thêm <code>RETURNING</code> khi cần biết thật sự chuyện gì đã xảy ra.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. The row <code>(\'sql\', 3)</code> already existed:' + code(
              "INSERT INTO tag_stat (tag, hits) VALUES ('sql', 999)\n" +
              '  ON CONFLICT (tag) DO NOTHING\n' +
              '  RETURNING tag, hits;\n' +
              ' tag | hits\n' +
              '-----+------\n' +
              '(0 rows)\n' +
              '\n' +
              'INSERT 0 0',
            ) + 'Your API needs to answer "was a new row created?". What do these two lines give you?',
            'Đo trên PostgreSQL 16.14. Dòng <code>(\'sql\', 3)</code> đã tồn tại sẵn:' + code(
              "INSERT INTO tag_stat (tag, hits) VALUES ('sql', 999)\n" +
              '  ON CONFLICT (tag) DO NOTHING\n' +
              '  RETURNING tag, hits;\n' +
              ' tag | hits\n' +
              '-----+------\n' +
              '(0 rows)\n' +
              '\n' +
              'INSERT 0 0',
            ) + 'API của bạn cần trả lời "có dòng mới nào được tạo không?". Hai dòng kết quả này cho bạn gì?',
          ),
          options: [
            B('Nothing useful — <code>DO NOTHING</code> always reports zero rows, even when it did insert, so you must run a follow-up SELECT to find out', 'Không gì hữu ích — <code>DO NOTHING</code> luôn báo không dòng nào, kể cả khi nó có chèn, nên bạn phải chạy thêm một câu SELECT nữa mới biết'),
            B('An empty <code>RETURNING</code> result (and the <code>0</code> row count in <code>INSERT 0 0</code>) IS the signal that the conflict path was taken; had the row been new you would have got one row back', 'Kết quả <code>RETURNING</code> rỗng (và số <code>0</code> trong <code>INSERT 0 0</code>) CHÍNH LÀ tín hiệu rằng nhánh xung đột đã được đi; nếu dòng đó là mới thì bạn đã nhận về một dòng'),
            B('The first <code>0</code> in <code>INSERT 0 0</code> is the row count, so it says one row was skipped and one would have been written', 'Số <code>0</code> đầu tiên trong <code>INSERT 0 0</code> là số dòng, nên nó nói rằng một dòng bị bỏ qua và một dòng lẽ ra được ghi'),
            B('It means the statement failed silently and should be retried; a successful <code>DO NOTHING</code> reports <code>INSERT 0 1</code> whether or not it wrote', 'Nó nghĩa là câu lệnh hỏng trong im lặng và cần chạy lại; một lệnh <code>DO NOTHING</code> thành công sẽ báo <code>INSERT 0 1</code> dù có ghi hay không'),
          ],
          correct: 1,
          explanation: EX(
            '<code>RETURNING</code> yields one row per row actually written, so an empty result is a precise, single-round-trip answer to "did the conflict path fire?". The command tag says the same thing: in <code>INSERT 0 1</code> the first number is a legacy OID field (always 0 since PostgreSQL 12) and the SECOND is the row count — so <code>INSERT 0 0</code> means nothing was written. This matters because <code>ON CONFLICT DO NOTHING</code> is otherwise indistinguishable from success, and lesson 4.1 warns about the wider version of the same problem: an unqualified <code>DO NOTHING</code> also swallows conflicts you did not anticipate — a unique index someone added later, a constraint on a different column, a genuine bug writing duplicate keys. Name the target and read the return value.',
            '<code>RETURNING</code> trả ra một dòng cho mỗi dòng thật sự được ghi, nên kết quả rỗng là một câu trả lời chính xác, chỉ một vòng đi-về, cho câu hỏi "nhánh xung đột có nổ không?". Nhãn lệnh cũng nói đúng điều đó: trong <code>INSERT 0 1</code> thì số đầu là trường OID cũ (luôn bằng 0 kể từ PostgreSQL 12) còn số THỨ HAI mới là số dòng — nên <code>INSERT 0 0</code> nghĩa là không có gì được ghi. Điều này quan trọng vì ngoài ra <code>ON CONFLICT DO NOTHING</code> không phân biệt được với thành công, và bài 4.1 cảnh báo phiên bản rộng hơn của cùng vấn đề: một câu <code>DO NOTHING</code> không nêu mục tiêu còn nuốt luôn những xung đột bạn không lường trước — một chỉ mục duy nhất ai đó thêm sau, một ràng buộc trên cột khác, hay một lỗi thật đang ghi trùng khoá. Hãy nêu tên mục tiêu và đọc giá trị trả về.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on a table containing exactly one row whose title is <code>Intro to SQL</code>:' + code(
              "SELECT title FROM note WHERE title LIKE  '%sql%';   -- (0 rows)\n" +
              "SELECT title FROM note WHERE title ILIKE '%sql%';   -- Intro to SQL",
            ) + 'What is the difference, and what should a user-facing search box use?',
            'Đo trên PostgreSQL 16.14 trên một bảng chứa đúng một dòng có tiêu đề <code>Intro to SQL</code>:' + code(
              "SELECT title FROM note WHERE title LIKE  '%sql%';   -- (0 dòng)\n" +
              "SELECT title FROM note WHERE title ILIKE '%sql%';   -- Intro to SQL",
            ) + 'Khác nhau ở đâu, và một ô tìm kiếm cho người dùng nên dùng cái nào?',
          ),
          options: [
            B('<code>LIKE</code> is case-SENSITIVE so it never matched the uppercase "SQL"; <code>ILIKE</code> is the case-insensitive form and is what a search box wants — at the cost that a leading <code>%</code> cannot use a plain B-tree index', '<code>LIKE</code> PHÂN BIỆT hoa thường nên không bao giờ khớp chữ "SQL" viết hoa; <code>ILIKE</code> là dạng không phân biệt hoa thường và là thứ một ô tìm kiếm cần — đổi lại, một dấu <code>%</code> ở đầu thì chỉ mục B-tree thường không dùng được'),
            B('<code>LIKE</code> matches whole words only while <code>ILIKE</code> matches substrings, which is why the pattern needed no wildcards in the second form', '<code>LIKE</code> chỉ khớp trọn từ còn <code>ILIKE</code> khớp chuỗi con, và vì thế dạng thứ hai không cần ký tự đại diện nào'),
            B('They behave identically; the first query returned nothing because <code>%</code> may not appear at the start of a pattern in PostgreSQL 16', 'Chúng hành xử y hệt nhau; truy vấn đầu không trả gì vì trong PostgreSQL 16 dấu <code>%</code> không được đứng đầu một mẫu'),
            B('<code>ILIKE</code> applies the database collation and <code>LIKE</code> does not, so switching the collation to a case-insensitive one would make both return the row', '<code>ILIKE</code> áp dụng collation của cơ sở dữ liệu còn <code>LIKE</code> thì không, nên đổi collation sang loại không phân biệt hoa thường sẽ khiến cả hai trả về dòng đó'),
          ],
          correct: 0,
          explanation: EX(
            'The pattern language is the same for both — <code>%</code> is any run of characters, <code>_</code> is exactly one — and the only difference is case folding. The trap is that <code>LIKE</code> looks like it "should" match, so a search feature ships and quietly finds nothing for half its users. Two things to carry forward. First, the rewrite <code>WHERE lower(title) LIKE lower($1)</code> is equivalent but wraps the column in a function, which disables a plain index on <code>title</code> — the expression index <code>CREATE INDEX ON note (lower(title))</code> is the fix, and that is Chapter 9. Second, no B-tree can seek a pattern that starts with <code>%</code>, because a B-tree is sorted by prefix; the tool for <code>ILIKE \'%…%\'</code> is a trigram GIN index from Chapter 13, which is why that chapter exists.',
            'Ngôn ngữ mẫu của cả hai là như nhau — <code>%</code> là một chuỗi ký tự bất kỳ, <code>_</code> là đúng một ký tự — và khác biệt duy nhất là việc gập hoa thường. Cái bẫy là <code>LIKE</code> trông như "đáng lẽ phải khớp", nên một tính năng tìm kiếm được phát hành rồi âm thầm không tìm ra gì cho một nửa số người dùng. Hai điều mang theo. Thứ nhất, cách viết lại <code>WHERE lower(title) LIKE lower($1)</code> là tương đương nhưng bọc cột trong một hàm, và điều đó vô hiệu hoá chỉ mục thường trên <code>title</code> — cách sửa là chỉ mục biểu thức <code>CREATE INDEX ON note (lower(title))</code>, và đó là Chương 9. Thứ hai, không B-tree nào tìm kiếm được một mẫu bắt đầu bằng <code>%</code>, vì B-tree sắp theo tiền tố; công cụ cho <code>ILIKE \'%…%\'</code> là chỉ mục GIN trigram ở Chương 13, và đó là lý do chương ấy tồn tại.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. The first form works; the second is an error:' + code(
              'SELECT DISTINCT ON (author) author, title, d\n' +
              '  FROM note4 ORDER BY author, d DESC;      -- newest note per author\n' +
              '\n' +
              'SELECT DISTINCT ON (author) author, title, d\n' +
              '  FROM note4 ORDER BY d DESC;\n' +
              'ERROR:  SELECT DISTINCT ON expressions must match initial ORDER BY expressions',
            ) + 'Why does <code>DISTINCT ON</code> impose that rule?',
            'Đo trên PostgreSQL 16.14. Dạng thứ nhất chạy được; dạng thứ hai là lỗi:' + code(
              'SELECT DISTINCT ON (author) author, title, d\n' +
              '  FROM note4 ORDER BY author, d DESC;      -- note mới nhất của mỗi tác giả\n' +
              '\n' +
              'SELECT DISTINCT ON (author) author, title, d\n' +
              '  FROM note4 ORDER BY d DESC;\n' +
              'ERROR:  SELECT DISTINCT ON expressions must match initial ORDER BY expressions',
            ) + 'Vì sao <code>DISTINCT ON</code> lại áp luật đó?',
          ),
          options: [
            B('Because <code>DISTINCT ON</code> is only allowed on an indexed column, and <code>author</code> must lead the index for the plan to be legal', 'Vì <code>DISTINCT ON</code> chỉ được dùng trên cột đã có chỉ mục, và <code>author</code> phải đứng đầu chỉ mục thì kế hoạch mới hợp lệ'),
            B('Because it is a syntax restriction with no semantic content; PostgreSQL simply requires you to repeat the expression, and the second form would have worked identically had it been allowed', 'Vì đó chỉ là hạn chế cú pháp không mang ý nghĩa gì; PostgreSQL đơn giản bắt bạn lặp lại biểu thức, và dạng thứ hai lẽ ra sẽ chạy y hệt nếu được cho phép'),
            B('Because <code>DISTINCT ON</code> silently adds <code>GROUP BY author</code>, and a GROUP BY query may only be sorted by its grouping columns', 'Vì <code>DISTINCT ON</code> âm thầm thêm <code>GROUP BY author</code>, và một truy vấn có GROUP BY chỉ được sắp theo các cột gom nhóm của nó'),
            B('Because it keeps the FIRST row of each group in the sort order, so the sort must group the rows first — the leading ORDER BY keys are what define "each group", and the rest of the ORDER BY decides WHICH row survives', 'Vì nó giữ dòng ĐẦU TIÊN của mỗi nhóm theo thứ tự sắp xếp, nên phép sắp phải gom các dòng lại trước đã — các khoá ORDER BY đứng đầu là thứ định nghĩa "mỗi nhóm", còn phần ORDER BY còn lại quyết định dòng NÀO sống sót'),
          ],
          correct: 3,
          explanation: EX(
            'Read it as a two-part instruction. <code>ORDER BY author, d DESC</code> lines all of an author\'s rows up together and puts the newest first within each author; <code>DISTINCT ON (author)</code> then keeps the first of each run. That is why the rule exists — without <code>author</code> leading the sort, "the first row of each author" is not even well defined. The pattern is worth memorising because "the latest row per group" is everywhere: last message per conversation, latest price per product, newest note per author. Two cautions. Ties are resolved arbitrarily unless you add a unique tiebreaker (<code>ORDER BY author, d DESC, id DESC</code>), which is the same non-determinism that bites <code>ROW_NUMBER()</code> in Chapter 8. And <code>DISTINCT ON</code> is PostgreSQL-specific; the portable spelling is a window function with <code>row_number() = 1</code>.',
            'Hãy đọc nó như một chỉ dẫn hai phần. <code>ORDER BY author, d DESC</code> xếp mọi dòng của cùng một tác giả nằm liền nhau và đưa dòng mới nhất lên trước trong từng tác giả; rồi <code>DISTINCT ON (author)</code> giữ lại dòng đầu của mỗi dải. Đó là lý do cái luật kia tồn tại — không có <code>author</code> đứng đầu phép sắp thì "dòng đầu tiên của mỗi tác giả" thậm chí còn không được định nghĩa. Khuôn mẫu này đáng thuộc vì "dòng mới nhất của mỗi nhóm" xuất hiện ở khắp nơi: tin nhắn cuối của mỗi cuộc trò chuyện, giá mới nhất của mỗi sản phẩm, note mới nhất của mỗi tác giả. Hai điều cần lưu ý. Trường hợp bằng điểm được phân xử tuỳ tiện trừ khi bạn thêm một khoá phân định duy nhất (<code>ORDER BY author, d DESC, id DESC</code>) — đúng cái tính bất định sẽ cắn <code>ROW_NUMBER()</code> ở Chương 8. Và <code>DISTINCT ON</code> là riêng của PostgreSQL; cách viết di động được là dùng hàm cửa sổ với <code>row_number() = 1</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A feed endpoint pages with <code>ORDER BY created_at DESC LIMIT 20 OFFSET $1</code>. Users report that scrolling sometimes repeats an item and sometimes skips one, and that deep pages get slow. What are the TWO separate causes?',
            'Một endpoint feed phân trang bằng <code>ORDER BY created_at DESC LIMIT 20 OFFSET $1</code>. Người dùng báo rằng cuộn xuống thì có lúc lặp lại một mục, có lúc bỏ sót một mục, và trang càng sâu càng chậm. HAI nguyên nhân riêng biệt là gì?',
          ),
          options: [
            B('Both are the same cause — <code>OFFSET</code> is evaluated against a snapshot taken at connection time, so any page after the first is computed from stale data', 'Cả hai là cùng một nguyên nhân — <code>OFFSET</code> được tính trên một ảnh chụp lấy lúc mở kết nối, nên mọi trang sau trang đầu đều được tính từ dữ liệu cũ'),
            B('Duplicates come from <code>LIMIT</code> without <code>DISTINCT</code>, and slowness comes from <code>DESC</code>, which forces PostgreSQL to sort backwards in memory', 'Trùng lặp đến từ <code>LIMIT</code> mà không có <code>DISTINCT</code>, còn chậm đến từ <code>DESC</code>, buộc PostgreSQL phải sắp ngược trong bộ nhớ'),
            B('Ties: <code>created_at</code> is not unique, so rows sharing a timestamp have undefined relative order between the two queries. And <code>OFFSET n</code> makes the server produce and discard n rows, so cost grows with the page number', 'Bằng nhau: <code>created_at</code> không duy nhất, nên các dòng trùng mốc thời gian có thứ tự tương đối không xác định giữa hai lần truy vấn. Và <code>OFFSET n</code> buộc máy chủ sinh ra rồi vứt đi n dòng, nên chi phí tăng theo số trang'),
            B('The rows genuinely change between requests, so nothing is wrong with the query; the only fix is to freeze the feed with a REPEATABLE READ transaction held open across all pages', 'Các dòng thật sự thay đổi giữa các lần yêu cầu, nên truy vấn không có gì sai; cách sửa duy nhất là đóng băng feed bằng một giao dịch REPEATABLE READ giữ mở suốt mọi trang'),
          ],
          correct: 2,
          explanation: EX(
            'Two independent bugs that arrive together and get blamed on each other. The correctness one is ties: with several rows sharing a <code>created_at</code>, their relative order is genuinely undefined and PostgreSQL may answer differently on the next run, so page 2 can re-show a row from page 1 while another is never shown. It reproduces only when the data has duplicate timestamps, which test fixtures rarely do. The fix is one clause: always end the sort with a unique column, <code>ORDER BY created_at DESC, id DESC</code>. The performance one is structural — <code>OFFSET 999980</code> makes the server walk and throw away a million rows to return twenty. Adding the unique tiebreaker also unlocks the real fix: keyset pagination, <code>WHERE (created_at, id) &lt; ($1, $2) ORDER BY created_at DESC, id DESC LIMIT 20</code>, which jumps straight to the page through the index and costs the same at page 1 and page 100,000.',
            'Hai lỗi độc lập cùng xuất hiện rồi bị đổ tại cho nhau. Lỗi về tính đúng là chuyện bằng nhau: khi nhiều dòng cùng một <code>created_at</code>, thứ tự tương đối của chúng thật sự không xác định và PostgreSQL có thể trả lời khác ở lần chạy sau, nên trang 2 có thể hiện lại một dòng của trang 1 trong khi một dòng khác không bao giờ được hiện. Nó chỉ tái hiện khi dữ liệu có mốc thời gian trùng, thứ mà dữ liệu kiểm thử hiếm khi có. Cách sửa gọn trong một mệnh đề: luôn kết thúc phép sắp bằng một cột duy nhất, <code>ORDER BY created_at DESC, id DESC</code>. Lỗi về hiệu năng thì thuộc về cấu trúc — <code>OFFSET 999980</code> buộc máy chủ đi qua rồi vứt bỏ một triệu dòng để trả về hai mươi. Thêm khoá phân định duy nhất cũng mở khoá luôn cách sửa thật: phân trang theo khoá, <code>WHERE (created_at, id) &lt; ($1, $2) ORDER BY created_at DESC, id DESC LIMIT 20</code> — nhảy thẳng tới trang cần lấy nhờ chỉ mục và tốn như nhau ở trang 1 lẫn trang 100.000.',
          ),
        }),

        // ── Chương 5 — JOIN ─────────────────────────────────────────────
        mcq({
          prompt: B(
            'Four users (one, Ngoc, has no notes) and five notes (one, "Orphan draft", has <code>user_id IS NULL</code>). Measured on PostgreSQL 16.14, the same join condition <code>ON n.user_id = u.id</code> in four flavours:' + code(
              ' inner_ | left_ | right_ | full_\n' +
              '--------+-------+--------+-------\n' +
              '      4 |     5 |      5 |     6',
            ) + 'Why is FULL exactly 6?',
            'Bốn người dùng (một người, Ngoc, không có note nào) và năm note (một note, "Orphan draft", có <code>user_id IS NULL</code>). Đo trên PostgreSQL 16.14, cùng một điều kiện nối <code>ON n.user_id = u.id</code> ở bốn biến thể:' + code(
              ' inner_ | left_ | right_ | full_\n' +
              '--------+-------+--------+-------\n' +
              '      4 |     5 |      5 |     6',
            ) + 'Vì sao FULL đúng bằng 6?',
          ),
          options: [
            B('Because FULL multiplies the two unmatched sets: one unmatched user times one unmatched note, added to the 4 matched pairs, gives 4 + 1 × 2', 'Vì FULL nhân hai tập không khớp với nhau: một người dùng không khớp nhân một note không khớp, cộng vào 4 cặp đã khớp, ra 4 + 1 × 2'),
            B('4 matched pairs + 1 NULL-padded row for Ngoc (no note) + 1 NULL-padded row for the orphan note. FULL is the only shape that can produce NULL on EITHER side, and <code>NULL = u.id</code> is UNKNOWN so the orphan never matches anyone', '4 cặp đã khớp + 1 dòng độn NULL cho Ngoc (không có note) + 1 dòng độn NULL cho note mồ côi. FULL là hình dạng duy nhất có thể sinh NULL ở CẢ HAI phía, và <code>NULL = u.id</code> là UNKNOWN nên note mồ côi không khớp với ai cả'),
            B('Because FULL is defined as LEFT plus RIGHT, so its row count is always the sum of the two: 5 + 5 minus the 4 duplicates would give 6 only by coincidence here', 'Vì FULL được định nghĩa là LEFT cộng RIGHT, nên số dòng của nó luôn là tổng hai bên: 5 + 5 trừ đi 4 dòng trùng mới ra 6, và ở đây chỉ là trùng hợp'),
            B('Because the orphan note matches Ngoc: both sides are NULL-ish, and FULL JOIN treats a NULL key as matching any row with no partner', 'Vì note mồ côi khớp với Ngoc: cả hai phía đều mang tính NULL, và FULL JOIN coi một khoá NULL là khớp với bất kỳ dòng nào chưa có bạn'),
          ],
          correct: 1,
          explanation: EX(
            'Count it the way the server does. First the matches: 4 notes have a real <code>user_id</code> that exists, so 4 pairs. Then FULL keeps every unmatched row from BOTH sides, NULL-padding the missing half: Ngoc appears with a NULL title, and the orphan draft appears with a NULL author. 4 + 1 + 1 = 6. The distractor about the two NULLs matching each other is the trap worth naming out loud — <code>NULL = NULL</code> is UNKNOWN, never TRUE, so a NULL foreign key matches nothing at all; that is exactly why the orphan is unmatched in the first place. In practice LEFT does almost all the work (keep your main table on the left and optionally attach related data), RIGHT is rare because flipping the tables reads better, and FULL earns its keep mostly in reconciliation — "show me everything on either side and mark what has no partner".',
            'Hãy đếm theo đúng cách máy chủ đếm. Trước hết là các cặp khớp: 4 note có <code>user_id</code> thật và tồn tại, nên có 4 cặp. Rồi FULL giữ mọi dòng không khớp từ CẢ HAI phía, độn NULL vào nửa còn thiếu: Ngoc hiện ra với title NULL, và note mồ côi hiện ra với tác giả NULL. 4 + 1 + 1 = 6. Phương án nhiễu nói hai giá trị NULL khớp nhau chính là cái bẫy đáng gọi tên thành tiếng — <code>NULL = NULL</code> là UNKNOWN, không bao giờ TRUE, nên một khoá ngoại NULL không khớp với gì hết; và đó chính là lý do note mồ côi bị bỏ lại ngay từ đầu. Trong thực tế LEFT làm gần hết mọi việc (giữ bảng chính bên trái rồi gắn thêm dữ liệu liên quan nếu có), RIGHT hiếm dùng vì đảo hai bảng đọc dễ hơn, còn FULL đáng đồng tiền chủ yếu ở việc đối soát — "cho tôi xem hết cả hai phía và đánh dấu bên nào chưa có bạn".',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14, this returned exactly one row — <code>Ngoc</code>:' + code(
              'SELECT u.name\n' +
              'FROM app_user u LEFT JOIN note n ON n.user_id = u.id\n' +
              'WHERE n.id IS NULL;',
            ) + 'Which sentence describes what the <code>WHERE</code> is doing?',
            'Đo trên PostgreSQL 16.14, câu này trả về đúng một dòng — <code>Ngoc</code>:' + code(
              'SELECT u.name\n' +
              'FROM app_user u LEFT JOIN note n ON n.user_id = u.id\n' +
              'WHERE n.id IS NULL;',
            ) + 'Câu nào mô tả đúng việc mà <code>WHERE</code> đang làm?',
          ),
          options: [
            B('It keeps exactly the rows the LEFT JOIN had to NULL-pad — <code>n.id</code> is the primary key of the optional side, so it can only be NULL when there was no partner. That is the anti-join: "left rows with no match"', 'Nó giữ đúng những dòng mà LEFT JOIN buộc phải độn NULL — <code>n.id</code> là khoá chính của phía tuỳ chọn nên nó chỉ có thể NULL khi không có bạn nào. Đó chính là anti-join: "các dòng bên trái không có cặp khớp"'),
            B('It filters out notes whose <code>id</code> column was never populated, which is a data-quality check rather than a join pattern', 'Nó lọc bỏ những note có cột <code>id</code> chưa từng được điền, nên đây là một phép kiểm chất lượng dữ liệu chứ không phải một khuôn mẫu join'),
            B('It converts the LEFT JOIN into an INNER JOIN and then negates it, which is why exactly the complement of the inner result comes back', 'Nó biến LEFT JOIN thành INNER JOIN rồi phủ định kết quả, và vì thế trả về đúng phần bù của kết quả inner'),
            B('Nothing — <code>WHERE n.id IS NULL</code> is always false after a join, and the single row came from the orphan note whose <code>user_id</code> is NULL', 'Không làm gì — <code>WHERE n.id IS NULL</code> luôn sai sau một phép join, và dòng duy nhất kia đến từ note mồ côi có <code>user_id</code> là NULL'),
          ],
          correct: 0,
          explanation: EX(
            'The anti-join is not a fifth join keyword; it is LEFT JOIN plus one <code>IS NULL</code> test, and the test is the whole trick. The LEFT keeps every user, matched or not, filling the note columns with NULL where there was no partner — so testing a column that can never legitimately be NULL on a real matched row (a primary key, or the join key itself) isolates exactly the padded rows. Two practical notes. Choose the column carefully: <code>WHERE n.tag IS NULL</code> would also catch real notes that simply have no tag, which is a different and wrong answer. And this pattern is the safe cousin of <code>NOT IN</code> from Chapter 7 — measured on the same data, <code>WHERE u.id NOT IN (SELECT user_id FROM note)</code> returned <b>0 rows</b>, because one <code>user_id</code> is NULL and one NULL poisons the whole comparison. <code>NOT EXISTS</code> and the anti-join both answer correctly.',
            'Anti-join không phải một từ khoá join thứ năm; nó là LEFT JOIN cộng một phép kiểm <code>IS NULL</code>, và phép kiểm đó chính là toàn bộ mẹo. LEFT giữ mọi người dùng, khớp hay không khớp, điền NULL vào các cột của note ở chỗ không có bạn — nên kiểm một cột mà một dòng khớp thật không bao giờ được phép NULL (một khoá chính, hoặc chính khoá nối) sẽ cô lập đúng những dòng bị độn. Hai ghi chú thực tế. Chọn cột cho cẩn thận: <code>WHERE n.tag IS NULL</code> sẽ bắt luôn cả những note có thật mà đơn giản là không có tag — một câu trả lời khác, và sai. Và khuôn mẫu này là người anh em an toàn của <code>NOT IN</code> ở Chương 7 — đo trên đúng bộ dữ liệu ấy, <code>WHERE u.id NOT IN (SELECT user_id FROM note)</code> trả về <b>0 dòng</b>, vì có một <code>user_id</code> là NULL và một NULL đầu độc cả phép so sánh. <code>NOT EXISTS</code> và anti-join thì đều trả lời đúng.',
          ),
        }),

        mcq({
          prompt: B(
            'An <code>employee</code> table where each row has a <code>manager_id</code> pointing at another row of the same table. Alice is the top boss (<code>manager_id IS NULL</code>). Which query lists all four people next to their manager, and why?' + code(
              'SELECT e.name AS employee, m.name AS manager\n' +
              'FROM employee e ??? JOIN employee m ON m.id = e.manager_id\n' +
              'ORDER BY e.id;',
            ),
            'Một bảng <code>employee</code> mà mỗi dòng có <code>manager_id</code> trỏ tới một dòng khác của chính bảng đó. Alice là sếp cao nhất (<code>manager_id IS NULL</code>). Truy vấn nào liệt kê đủ cả bốn người kèm quản lý của họ, và vì sao?' + code(
              'SELECT e.name AS employee, m.name AS manager\n' +
              'FROM employee e ??? JOIN employee m ON m.id = e.manager_id\n' +
              'ORDER BY e.id;',
            ),
          ),
          options: [
            B('<code>INNER</code> — a self-join always keeps every row because both sides are the same physical table, so no row can fail to find itself', '<code>INNER</code> — một phép tự nối luôn giữ mọi dòng vì cả hai phía là cùng một bảng vật lý, nên không dòng nào có thể không tìm thấy chính mình'),
            B('<code>CROSS</code> — you need every pairing and then filter, because <code>ON</code> is not allowed when a table is joined to itself', '<code>CROSS</code> — bạn cần mọi cặp rồi lọc, vì <code>ON</code> không được phép khi một bảng tự nối với chính nó'),
            B('<code>LEFT</code> — Alice\'s <code>manager_id</code> is NULL, and <code>m.id = NULL</code> is UNKNOWN, so INNER would silently drop the one person at the top; LEFT keeps her with an empty manager', '<code>LEFT</code> — <code>manager_id</code> của Alice là NULL, mà <code>m.id = NULL</code> là UNKNOWN, nên INNER sẽ âm thầm đánh rơi đúng người đứng đầu; LEFT giữ cô ấy lại với ô quản lý trống'),
            B('<code>FULL</code> — only FULL can reference the same table twice, because the two aliases must each preserve their own unmatched rows', '<code>FULL</code> — chỉ FULL mới tham chiếu được cùng một bảng hai lần, vì hai bí danh mỗi cái phải giữ lại các dòng không khớp của riêng nó'),
          ],
          correct: 2,
          explanation: EX(
            'A self-join is nothing special mechanically — the only new idea is that the same table needs two aliases so the server can tell which copy you mean, <code>employee e</code> and <code>employee m</code>. What IS special is the shape of hierarchy data: exactly one row at the top has a NULL parent, and that row is precisely the one an INNER JOIN throws away, so the bug ships as "the CEO is missing from the org chart" and looks like a data problem. Measured on 16.14, the LEFT version returned Alice with an empty manager cell, then Bob/Alice, Carol/Alice, Dave/Bob. The same pattern models any "points at another row of the same kind": a comment\'s <code>parent_id</code>, a category\'s parent, a user\'s referrer. It reaches exactly ONE level up, though — "the whole chain to the top" needs the recursive CTE of Chapter 7.',
            'Tự nối chẳng có gì đặc biệt về mặt cơ chế — ý tưởng mới duy nhất là cùng một bảng cần hai bí danh để máy chủ biết bạn đang nói tới bản sao nào, <code>employee e</code> và <code>employee m</code>. Thứ ĐẶC BIỆT là hình dạng của dữ liệu phân cấp: đúng một dòng ở đỉnh có cha là NULL, và đó chính là dòng mà INNER JOIN vứt đi, nên lỗi được phát hành dưới dạng "sơ đồ tổ chức thiếu mất sếp tổng" và trông như một vấn đề dữ liệu. Đo trên 16.14, phiên bản LEFT trả về Alice với ô quản lý trống, rồi Bob/Alice, Carol/Alice, Dave/Bob. Cùng khuôn mẫu ấy mô hình hoá mọi thứ "trỏ tới một dòng khác cùng loại": <code>parent_id</code> của một bình luận, chuyên mục cha của một chuyên mục, người giới thiệu của một người dùng. Nhưng nó chỉ với lên đúng MỘT cấp — "cả chuỗi lên tới đỉnh" thì cần CTE đệ quy ở Chương 7.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. <code>note</code> and <code>note_stat</code> both have a column literally called <code>id</code>:' + code(
              'SELECT * FROM note n JOIN note_stat s USING (id) ORDER BY id;\n' +
              ' id | user_id |    title     | tag  | views | reads\n' +
              '----+---------+--------------+------+-------+-------\n' +
              '  1 |       1 | Intro to SQL | sql  |   120 |   500',
            ) + 'What did <code>USING (id)</code> do that <code>ON n.id = s.id</code> would not have?',
            'Đo trên PostgreSQL 16.14. <code>note</code> và <code>note_stat</code> đều có một cột tên đúng là <code>id</code>:' + code(
              'SELECT * FROM note n JOIN note_stat s USING (id) ORDER BY id;\n' +
              ' id | user_id |    title     | tag  | views | reads\n' +
              '----+---------+--------------+------+-------+-------\n' +
              '  1 |       1 | Intro to SQL | sql  |   120 |   500',
            ) + '<code>USING (id)</code> đã làm gì mà <code>ON n.id = s.id</code> không làm?',
          ),
          options: [
            B('It made the join an INNER JOIN; <code>ON</code> would have produced an OUTER join by default when the column names are identical', 'Nó biến phép nối thành INNER JOIN; còn <code>ON</code> sẽ mặc định cho ra một phép nối OUTER khi tên cột giống nhau'),
            B('It compared the columns with <code>IS NOT DISTINCT FROM</code> instead of <code>=</code>, so two NULL ids would have matched each other', 'Nó so hai cột bằng <code>IS NOT DISTINCT FROM</code> thay vì <code>=</code>, nên hai id NULL sẽ khớp với nhau'),
            B('It allowed the join to use an index on <code>note_stat(id)</code>; <code>ON</code> with two qualified names forces a hash join', 'Nó cho phép phép nối dùng chỉ mục trên <code>note_stat(id)</code>; còn <code>ON</code> với hai tên đầy đủ thì ép dùng hash join'),
            B('It MERGED the join column, so <code>SELECT *</code> returns <code>id</code> once instead of twice — and the column becomes unqualified, so you write <code>id</code> rather than <code>n.id</code>', 'Nó GỘP cột nối lại, nên <code>SELECT *</code> trả về <code>id</code> một lần thay vì hai — và cột đó trở thành không mang tiền tố, nên bạn viết <code>id</code> chứ không phải <code>n.id</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Semantically both forms are the same equality test; the difference is in the output shape. <code>ON n.id = s.id</code> leaves two separate <code>id</code> columns in the result, so <code>SELECT *</code> shows the value twice and a bare <code>ORDER BY id</code> would be ambiguous. <code>USING (id)</code> merges them into one unqualified column — which is exactly why the measured <code>ORDER BY id</code> above is legal. Two practical limits keep <code>USING</code> from being the default: it only works when both sides spell the column identically, which with <code>user_id → id</code> style foreign keys is rarely the case; and on an OUTER join the merged column is <code>COALESCE(left, right)</code>, which quietly hides which side a row came from — the very thing the <code>IS NULL</code> anti-join test depends on. Reach for <code>ON</code> by default and <code>USING</code> when the names genuinely line up.',
            'Về ngữ nghĩa, hai dạng là cùng một phép so bằng; khác biệt nằm ở hình dạng kết quả. <code>ON n.id = s.id</code> để lại hai cột <code>id</code> riêng biệt trong kết quả, nên <code>SELECT *</code> hiện giá trị hai lần và một câu <code>ORDER BY id</code> trần sẽ nhập nhằng. <code>USING (id)</code> gộp chúng thành một cột không mang tiền tố — và đó chính là lý do câu <code>ORDER BY id</code> đo được ở trên là hợp lệ. Hai giới hạn thực tế khiến <code>USING</code> không thành mặc định: nó chỉ chạy khi hai phía viết tên cột giống hệt nhau, mà với kiểu khoá ngoại <code>user_id → id</code> thì hiếm khi vậy; và trên một phép nối OUTER, cột được gộp là <code>COALESCE(trái, phải)</code>, âm thầm giấu đi việc dòng đó đến từ phía nào — đúng cái mà phép kiểm <code>IS NULL</code> của anti-join dựa vào. Hãy dùng <code>ON</code> làm mặc định, và <code>USING</code> khi tên gọi thật sự trùng khớp.',
          ),
        }),

        mcq({
          prompt: B(
            'A report that used to return dozens of rows now returns thousands and takes minutes. The query was edited last week:' + code(
              'SELECT o.id, o.total, c.name\n' +
              'FROM ord o, customer c\n' +
              'WHERE o.status = \'paid\';        -- the "AND c.id = o.customer_id" line was lost in a merge',
            ) + 'What is the row count now, and what is the fastest way to confirm the diagnosis?',
            'Một báo cáo trước kia trả về vài chục dòng thì nay trả về hàng nghìn và chạy mất mấy phút. Truy vấn vừa bị sửa tuần trước:' + code(
              'SELECT o.id, o.total, c.name\n' +
              'FROM ord o, customer c\n' +
              'WHERE o.status = \'paid\';        -- dòng "AND c.id = o.customer_id" bị mất trong một lần merge',
            ) + 'Bây giờ số dòng là bao nhiêu, và cách nhanh nhất để xác nhận chẩn đoán là gì?',
          ),
          options: [
            B('It is unchanged: comma-separated tables in FROM are an implicit INNER JOIN on the primary keys, so the missing line was redundant', 'Không đổi: các bảng ngăn cách bằng dấu phẩy trong FROM là một INNER JOIN ngầm trên khoá chính, nên dòng bị mất kia vốn đã thừa'),
            B('Every paid order paired with EVERY customer — a Cartesian product, <code>paid_orders × customers</code>. Confirm it by counting: run the bare join with <code>SELECT count(*)</code> and compare against <code>SELECT count(*) FROM ord WHERE status=\'paid\'</code>', 'Mỗi đơn hàng đã thanh toán ghép với MỌI khách hàng — một tích Descartes, <code>số_đơn_đã_thanh_toán × số_khách</code>. Xác nhận bằng cách đếm: chạy phép nối trần với <code>SELECT count(*)</code> rồi so với <code>SELECT count(*) FROM ord WHERE status=\'paid\'</code>'),
            B('PostgreSQL raises <code>missing FROM-clause entry</code> whenever two tables in FROM share no condition, so the query cannot be what is running in production', 'PostgreSQL báo <code>missing FROM-clause entry</code> mỗi khi hai bảng trong FROM không có điều kiện nào nối chúng, nên truy vấn này không thể là thứ đang chạy trên production'),
            B('The <code>WHERE</code> on <code>o.status</code> restricts both tables, so the result is at most the number of paid orders and the slowdown must have another cause entirely', 'Mệnh đề <code>WHERE</code> trên <code>o.status</code> ràng buộc cả hai bảng, nên kết quả nhiều nhất bằng số đơn đã thanh toán và chỗ chậm phải do nguyên nhân hoàn toàn khác'),
          ],
          correct: 1,
          explanation: EX(
            'Comma-separated tables in <code>FROM</code> are a CROSS JOIN, and nothing about the syntax complains — the query is perfectly valid SQL, it just means something enormous. Two 1,000-row tables become a million rows; on production-sized data it does not error, it hangs. The <code>WHERE</code> on <code>o.status</code> filters orders but says nothing about which customer belongs with which order, so every surviving order is still paired with all of them. The diagnosis is a row count, not a code review: if the join returns far more rows than the driving table has, the join condition is wrong. Lesson 5.4 gives the same advice for the subtler cousin — when a SUM looks inflated, delete the aggregate, run the bare join with <code>SELECT *</code>, and look at the duplicates with your own eyes. And write <code>JOIN … ON</code> explicitly, or <code>CROSS JOIN</code> when you genuinely mean it, so the next reader can tell intention from accident.',
            'Các bảng ngăn cách bằng dấu phẩy trong <code>FROM</code> chính là CROSS JOIN, và cú pháp chẳng phàn nàn gì cả — truy vấn hoàn toàn hợp lệ, nó chỉ mang một ý nghĩa khổng lồ. Hai bảng 1.000 dòng thành một triệu dòng; trên dữ liệu cỡ production nó không báo lỗi, nó treo. Mệnh đề <code>WHERE</code> trên <code>o.status</code> lọc đơn hàng nhưng không nói gì về việc khách nào đi với đơn nào, nên mỗi đơn còn sống vẫn ghép với tất cả. Chẩn đoán là một phép đếm dòng chứ không phải một buổi review mã: nếu phép nối trả về nhiều dòng hơn hẳn bảng dẫn dắt, thì điều kiện nối sai. Bài 5.4 khuyên đúng như vậy cho người anh em tinh vi hơn — khi một phép SUM trông có vẻ phồng lên, hãy xoá hàm tổng hợp đi, chạy phép nối trần với <code>SELECT *</code>, và tự mắt nhìn các dòng trùng. Và hãy viết <code>JOIN … ON</code> tường minh, hoặc <code>CROSS JOIN</code> khi thật sự có ý đó, để người đọc sau phân biệt được chủ đích với tai nạn.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Do the join by hand (chapter 5).</b> A JOIN is not magic: it is "for every pair of rows, test a condition, and decide what to do with the ones that did not pair". Implement that in plain JavaScript over the data given — no database, no libraries.</p>' +
            '<p>The match condition is <code>note.user_id === user.id</code>. Follow SQL exactly on one point: a <code>NULL</code> foreign key matches <b>nothing</b>, because <code>NULL = anything</code> is UNKNOWN, not TRUE.</p>' +
            '<ul>' +
            '<li><code>joinRows(kind)</code> — <code>kind</code> is one of <code>INNER</code>, <code>LEFT</code>, <code>RIGHT</code>, <code>FULL</code>, <code>CROSS</code>. Return an array of <code>[authorName, noteTitle]</code> pairs, using <code>null</code> for the padded half. <code>CROSS</code> ignores the condition and pairs everything.</li>' +
            '<li><code>locTrongWhere(tag)</code> — a LEFT JOIN whose tag filter sits in <code>WHERE</code>: build the LEFT JOIN first, THEN drop every row whose note is missing or whose tag differs.</li>' +
            '<li><code>locTrongOn(tag)</code> — the same filter moved into <code>ON</code>: a note only counts as a match when its tag matches, and every user still survives.</li>' +
            '</ul>' +
            '<p><b>Row order</b> (so the output is reproducible): walk users by <code>id</code> ascending, and within each user walk notes by <code>id</code> ascending. Rows kept only by <code>RIGHT</code>/<code>FULL</code> (notes with no author) come last, by note <code>id</code>. Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 31 — Tự nối bảng bằng tay (chương 5).</b> JOIN không phải phép màu: nó là "với mỗi cặp dòng, kiểm một điều kiện, rồi quyết định làm gì với những dòng không ghép được". Hãy cài đặt điều đó bằng JavaScript thuần trên dữ liệu cho sẵn — không cơ sở dữ liệu, không thư viện.</p>' +
            '<p>Điều kiện khớp là <code>note.user_id === user.id</code>. Bám sát SQL đúng một chỗ: một khoá ngoại <code>NULL</code> khớp với <b>không gì cả</b>, vì <code>NULL = bất kỳ thứ gì</code> là UNKNOWN chứ không phải TRUE.</p>' +
            '<ul>' +
            '<li><code>joinRows(kind)</code> — <code>kind</code> là một trong <code>INNER</code>, <code>LEFT</code>, <code>RIGHT</code>, <code>FULL</code>, <code>CROSS</code>. Trả về mảng các cặp <code>[tênTácGiả, tiêuĐềNote]</code>, dùng <code>null</code> cho nửa bị độn. <code>CROSS</code> bỏ qua điều kiện và ghép tất cả với tất cả.</li>' +
            '<li><code>locTrongWhere(tag)</code> — một LEFT JOIN có bộ lọc tag nằm trong <code>WHERE</code>: dựng LEFT JOIN trước, RỒI mới bỏ mọi dòng không có note hoặc có tag khác.</li>' +
            '<li><code>locTrongOn(tag)</code> — cũng bộ lọc đó nhưng chuyển vào <code>ON</code>: một note chỉ được tính là khớp khi tag của nó đúng, và mọi người dùng vẫn sống sót.</li>' +
            '</ul>' +
            '<p><b>Thứ tự dòng</b> (để kết quả tái hiện được): duyệt user theo <code>id</code> tăng dần, trong mỗi user duyệt note theo <code>id</code> tăng dần. Những dòng chỉ được <code>RIGHT</code>/<code>FULL</code> giữ lại (note không có tác giả) nằm cuối, sắp theo <code>id</code> của note. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Ngoc không có note nào. "Orphan draft" có user_id là NULL.\n' +
            'const USERS = [\n' +
            "  { id: 1, name: 'Cuong' }, { id: 2, name: 'Lan' },\n" +
            "  { id: 3, name: 'Minh' },  { id: 4, name: 'Ngoc' },\n" +
            '];\n' +
            'const NOTES = [\n' +
            "  { id: 1, user_id: 1,    title: 'Intro to SQL', tag: 'sql'  },\n" +
            "  { id: 2, user_id: 1,    title: 'Indexes',      tag: 'sql'  },\n" +
            "  { id: 3, user_id: 2,    title: 'Timezones',    tag: 'date' },\n" +
            "  { id: 4, user_id: 3,    title: 'Backup',       tag: 'ops'  },\n" +
            "  { id: 5, user_id: null, title: 'Orphan draft', tag: null   },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function joinRows(kind) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function locTrongWhere(tag) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function locTrongOn(tag) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const ve = (rows) => rows.map(([a, b]) => (a ?? '~') + '/' + (b ?? '~')).join(' ');\n" +
            "for (const k of ['INNER', 'LEFT', 'RIGHT', 'FULL', 'CROSS']) {\n" +
            '  const r = joinRows(k);\n' +
            "  console.log(k.padEnd(5) + ' n=' + r.length + (k === 'CROSS' ? '' : ' | ' + ve(r)));\n" +
            '}\n' +
            "const w = locTrongWhere('sql'), o = locTrongOn('sql');\n" +
            "console.log('WHERE n=' + w.length + ' | ' + ve(w));\n" +
            "console.log('ON    n=' + o.length + ' | ' + ve(o));\n",
          expectedOutput:
            'INNER n=4 | Cuong/Intro to SQL Cuong/Indexes Lan/Timezones Minh/Backup\n' +
            'LEFT  n=5 | Cuong/Intro to SQL Cuong/Indexes Lan/Timezones Minh/Backup Ngoc/~\n' +
            'RIGHT n=5 | Cuong/Intro to SQL Cuong/Indexes Lan/Timezones Minh/Backup ~/Orphan draft\n' +
            'FULL  n=6 | Cuong/Intro to SQL Cuong/Indexes Lan/Timezones Minh/Backup Ngoc/~ ~/Orphan draft\n' +
            'CROSS n=20\n' +
            'WHERE n=2 | Cuong/Intro to SQL Cuong/Indexes\n' +
            'ON    n=5 | Cuong/Intro to SQL Cuong/Indexes Lan/~ Minh/~ Ngoc/~',
          sampleSolution:
            '// NULL không khớp với gì cả — đây là chỗ SQL khác JavaScript nhất.\n' +
            'const khop = (u, n) => n.user_id !== null && n.user_id === u.id;\n\n' +
            'function ghep(kind, dieuKienOn = null) {\n' +
            '  const rows = [];              // [tenTacGia, tieuDe, noteGoc|null]\n' +
            '  const daKhop = new Set();\n' +
            '  const us = [...USERS].sort((a, b) => a.id - b.id);\n' +
            '  const ns = [...NOTES].sort((a, b) => a.id - b.id);\n' +
            '  for (const u of us) {\n' +
            '    let co = false;\n' +
            '    for (const n of ns) {\n' +
            "      const ok = kind === 'CROSS' ? true : (khop(u, n) && (!dieuKienOn || dieuKienOn(n)));\n" +
            '      if (!ok) continue;\n' +
            '      rows.push([u.name, n.title, n]);\n' +
            '      daKhop.add(n.id);\n' +
            '      co = true;\n' +
            '    }\n' +
            "    if (!co && (kind === 'LEFT' || kind === 'FULL')) rows.push([u.name, null, null]);\n" +
            '  }\n' +
            "  if (kind === 'RIGHT' || kind === 'FULL') {\n" +
            '    for (const n of ns) if (!daKhop.has(n.id)) rows.push([null, n.title, n]);\n' +
            '  }\n' +
            '  return rows;\n' +
            '}\n\n' +
            'const bo = (rows) => rows.map(([a, b]) => [a, b]);\n\n' +
            'function joinRows(kind) { return bo(ghep(kind)); }\n\n' +
            '// WHERE chạy SAU phép nối: nó vứt luôn các dòng độn NULL ⇒ LEFT hoá INNER.\n' +
            'function locTrongWhere(tag) {\n' +
            "  return bo(ghep('LEFT').filter((r) => r[2] !== null && r[2].tag === tag));\n" +
            '}\n\n' +
            '// ON là một phần của ĐỊNH NGHĨA KHỚP: mọi user vẫn sống sót.\n' +
            'function locTrongOn(tag) {\n' +
            "  return bo(ghep('LEFT', (n) => n.tag === tag));\n" +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Three-valued logic, and the missing WHERE (chapters 3 and 4).</b> SQL conditions are not booleans: every one evaluates to <b>TRUE</b>, <b>FALSE</b> or <b>UNKNOWN</b>, and <code>WHERE</code> keeps only TRUE. Implement that engine over the rows given.</p>' +
            '<ul>' +
            '<li><code>danhGia(pred, row)</code> — return the string <code>TRUE</code>, <code>FALSE</code> or <code>UNKNOWN</code>. Comparisons (<code>=</code>, <code>&lt;&gt;</code>, <code>&gt;</code>) are UNKNOWN when either side is <code>null</code>. <code>IS NULL</code> is never UNKNOWN. <code>IS DISTINCT FROM</code> is never UNKNOWN either: two nulls are NOT distinct, one null is.</li>' +
            '<li><code>giuLai(pred)</code> — the ids <code>WHERE</code> would keep, i.e. the rows where <code>danhGia</code> is TRUE.</li>' +
            '<li><code>chay(stmt)</code> — <code>stmt</code> is <code>{ verb, where }</code>. An <code>UPDATE</code> or <code>DELETE</code> with no <code>where</code> must be REFUSED: return the exact string <code>THIEU_WHERE</code>. Otherwise return <code>verb + \' \' + &lt;number of rows affected&gt;</code>; a missing <code>where</code> on a <code>SELECT</code> means all rows.</li>' +
            '</ul>' +
            '<p>The truth tables you must reproduce: <code>NOT UNKNOWN</code> is UNKNOWN. <code>FALSE AND UNKNOWN</code> is FALSE, but <code>TRUE AND UNKNOWN</code> is UNKNOWN. <code>TRUE OR UNKNOWN</code> is TRUE, but <code>FALSE OR UNKNOWN</code> is UNKNOWN. For <code>IN</code>: TRUE if the value equals a listed value; otherwise UNKNOWN if the value is null or the list contains a null; otherwise FALSE. <code>NOT IN</code> is that result negated — which is why <code>NOT IN</code> against a list holding a null can never be TRUE.</p>' +
            '<p>Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 32 — Logic ba trạng thái, và chốt thiếu WHERE (chương 3 và 4).</b> Điều kiện trong SQL không phải boolean: mỗi điều kiện tính ra <b>TRUE</b>, <b>FALSE</b> hoặc <b>UNKNOWN</b>, và <code>WHERE</code> chỉ giữ TRUE. Hãy cài đặt bộ máy đó trên dữ liệu cho sẵn.</p>' +
            '<ul>' +
            '<li><code>danhGia(pred, row)</code> — trả về chuỗi <code>TRUE</code>, <code>FALSE</code> hoặc <code>UNKNOWN</code>. Các phép so sánh (<code>=</code>, <code>&lt;&gt;</code>, <code>&gt;</code>) là UNKNOWN khi một trong hai vế là <code>null</code>. <code>IS NULL</code> không bao giờ UNKNOWN. <code>IS DISTINCT FROM</code> cũng không bao giờ UNKNOWN: hai null thì KHÔNG khác nhau, một null thì khác.</li>' +
            '<li><code>giuLai(pred)</code> — các id mà <code>WHERE</code> sẽ giữ, tức những dòng có <code>danhGia</code> ra TRUE.</li>' +
            '<li><code>chay(stmt)</code> — <code>stmt</code> là <code>{ verb, where }</code>. Một lệnh <code>UPDATE</code> hay <code>DELETE</code> không có <code>where</code> phải bị TỪ CHỐI: trả về đúng chuỗi <code>THIEU_WHERE</code>. Còn lại thì trả về <code>verb + \' \' + &lt;số dòng bị ảnh hưởng&gt;</code>; thiếu <code>where</code> trong một lệnh <code>SELECT</code> nghĩa là toàn bộ dòng.</li>' +
            '</ul>' +
            '<p>Các bảng chân trị phải tái hiện đúng: <code>NOT UNKNOWN</code> là UNKNOWN. <code>FALSE AND UNKNOWN</code> là FALSE, nhưng <code>TRUE AND UNKNOWN</code> là UNKNOWN. <code>TRUE OR UNKNOWN</code> là TRUE, nhưng <code>FALSE OR UNKNOWN</code> là UNKNOWN. Với <code>IN</code>: TRUE nếu giá trị bằng một phần tử trong danh sách; nếu không thì UNKNOWN khi giá trị là null hoặc danh sách có chứa null; nếu không nữa thì FALSE. <code>NOT IN</code> là kết quả đó phủ định — và đó là lý do <code>NOT IN</code> trên một danh sách có null thì không bao giờ TRUE được.</p>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const ROWS = [\n' +
            "  { id: 1, tag: 'sql', views: 120  },\n" +
            "  { id: 2, tag: 'sql', views: null },\n" +
            "  { id: 3, tag: 'ops', views: 12   },\n" +
            '  { id: 4, tag: null,  views: 45   },\n' +
            '  { id: 5, tag: null,  views: null },\n' +
            '];\n' +
            "const T = 'TRUE', F = 'FALSE', U = 'UNKNOWN';\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function danhGia(p, row) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function giuLai(p) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function chay(stmt) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CASES = [\n' +
            "  ['A', ['=', 'tag', 'sql']],\n" +
            "  ['B', ['<>', 'tag', 'sql']],\n" +
            "  ['C', ['NOT', ['=', 'tag', 'sql']]],\n" +
            "  ['D', ['IS NULL', 'tag']],\n" +
            "  ['E', ['IS DISTINCT FROM', 'tag', 'sql']],\n" +
            "  ['F', ['IN', 'tag', ['sql', 'ops']]],\n" +
            "  ['G', ['NOT IN', 'tag', ['sql']]],\n" +
            "  ['H', ['NOT IN', 'tag', ['sql', null]]],\n" +
            "  ['I', ['AND', ['=', 'tag', 'sql'], ['>', 'views', 100]]],\n" +
            "  ['J', ['OR', ['=', 'tag', 'sql'], ['>', 'views', 40]]],\n" +
            "  ['K', ['AND', ['>', 'views', 1000], ['=', 'tag', 'sql']]],\n" +
            "  ['L', ['OR', ['<>', 'tag', 'sql'], ['IS NULL', 'tag']]],\n" +
            '];\n' +
            "for (const [ten, p] of CASES) console.log(ten + ' -> ' + JSON.stringify(giuLai(p)));\n" +
            "console.log('dong 2: AND=' + danhGia(['AND', ['=', 'tag', 'sql'], ['>', 'views', 100]], ROWS[1])\n" +
            "  + ' OR=' + danhGia(['OR', ['=', 'tag', 'sql'], ['>', 'views', 100]], ROWS[1]));\n" +
            "console.log('dong 4: =' + danhGia(['=', 'tag', 'sql'], ROWS[3])\n" +
            "  + ' NOT=' + danhGia(['NOT', ['=', 'tag', 'sql']], ROWS[3]));\n" +
            "console.log(chay({ verb: 'DELETE' }));\n" +
            "console.log(chay({ verb: 'UPDATE' }));\n" +
            "console.log(chay({ verb: 'SELECT' }));\n" +
            "console.log(chay({ verb: 'DELETE', where: ['IS NULL', 'tag'] }));\n" +
            "console.log(chay({ verb: 'UPDATE', where: ['NOT IN', 'tag', ['sql', null]] }));\n",
          expectedOutput:
            'A -> [1,2]\n' +
            'B -> [3]\n' +
            'C -> [3]\n' +
            'D -> [4,5]\n' +
            'E -> [3,4,5]\n' +
            'F -> [1,2,3]\n' +
            'G -> [3]\n' +
            'H -> []\n' +
            'I -> [1]\n' +
            'J -> [1,2,4]\n' +
            'K -> []\n' +
            'L -> [3,4,5]\n' +
            'dong 2: AND=UNKNOWN OR=TRUE\n' +
            'dong 4: =UNKNOWN NOT=UNKNOWN\n' +
            'THIEU_WHERE\n' +
            'THIEU_WHERE\n' +
            'SELECT 5\n' +
            'DELETE 2\n' +
            'UPDATE 0',
          sampleSolution:
            'function danhGia(p, row) {\n' +
            '  const [op] = p;\n' +
            '  const val = (c) => row[c];\n' +
            "  if (op === '=' || op === '<>' || op === '>') {\n" +
            '    const a = val(p[1]), b = p[2];\n' +
            '    if (a === null || b === null) return U;        // so sánh với NULL ⇒ UNKNOWN\n' +
            "    if (op === '=') return a === b ? T : F;\n" +
            "    if (op === '<>') return a !== b ? T : F;\n" +
            '    return a > b ? T : F;\n' +
            '  }\n' +
            "  if (op === 'IS NULL') return val(p[1]) === null ? T : F;\n" +
            "  if (op === 'IS DISTINCT FROM') {\n" +
            '    const a = val(p[1]), b = p[2];\n' +
            '    if (a === null && b === null) return F;        // hai NULL thì KHÔNG khác nhau\n' +
            '    if (a === null || b === null) return T;\n' +
            '    return a !== b ? T : F;\n' +
            '  }\n' +
            "  if (op === 'IN' || op === 'NOT IN') {\n" +
            '    const a = val(p[1]);\n' +
            '    let r;\n' +
            '    if (a === null) r = U;\n' +
            '    else if (p[2].some((x) => x !== null && x === a)) r = T;\n' +
            '    else r = p[2].some((x) => x === null) ? U : F;  // một NULL trong danh sách ⇒ UNKNOWN\n' +
            "    return op === 'IN' ? r : (r === U ? U : (r === T ? F : T));\n" +
            '  }\n' +
            "  if (op === 'NOT') { const r = danhGia(p[1], row); return r === U ? U : (r === T ? F : T); }\n" +
            "  if (op === 'AND') {\n" +
            '    const a = danhGia(p[1], row), b = danhGia(p[2], row);\n' +
            '    if (a === F || b === F) return F;              // FALSE nuốt UNKNOWN\n' +
            '    if (a === U || b === U) return U;\n' +
            '    return T;\n' +
            '  }\n' +
            "  if (op === 'OR') {\n" +
            '    const a = danhGia(p[1], row), b = danhGia(p[2], row);\n' +
            '    if (a === T || b === T) return T;              // TRUE nuốt UNKNOWN\n' +
            '    if (a === U || b === U) return U;\n' +
            '    return F;\n' +
            '  }\n' +
            "  throw new Error('toán tử lạ: ' + op);\n" +
            '}\n\n' +
            '// WHERE chỉ giữ TRUE — UNKNOWN bị loại y như FALSE, nhưng vì lý do khác.\n' +
            'function giuLai(p) {\n' +
            '  return ROWS.filter((r) => danhGia(p, r) === T).map((r) => r.id);\n' +
            '}\n\n' +
            'function chay(stmt) {\n' +
            "  if ((stmt.verb === 'UPDATE' || stmt.verb === 'DELETE') && !stmt.where) return 'THIEU_WHERE';\n" +
            '  const ids = stmt.where ? giuLai(stmt.where) : ROWS.map((r) => r.id);\n' +
            "  return stmt.verb + ' ' + ids.length;\n" +
            '}\n',
        }),
      ],
    },
  ],
};
