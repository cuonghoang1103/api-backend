/**
 * PostgreSQL — Final Exam (FE): 50 câu trắc nghiệm phủ cả 17 mục (s00–s16).
 *
 * Đề tự soạn, bám sát `content/courses/postgresql/s00…s16`. Có cả câu lý thuyết
 * lẫn câu đọc SQL; MỌI câu hỏi "truy vấn này trả về gì", "lỗi nào hiện ra" hay
 * "kế hoạch nào được chọn" đều đã CHẠY THẬT trên **PostgreSQL 16.14** (Docker
 * `postgres:16`, aarch64) — bảng kết quả, thông báo lỗi và các nút kế hoạch
 * trong đáp án là nguyên văn máy in ra, không phải trí nhớ.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/POSTGRESQL-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/postgresql-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all 17 sections, from "a server you talk to in SQL" to "ask the database before you guess". Many questions show SQL and ask what it returns, which error appears, or which plan the planner picks; every one of those answers came from running it on a real PostgreSQL 16, so read the statement rather than the intuition.</p>' +
  '<p>Two habits pay off here. First, count the rows: most wrong answers in SQL are not arithmetic mistakes, they are the wrong number of rows arriving at the aggregate. Second, remember that <code>NULL</code> means <em>unknown</em>, not <em>empty</em> — several questions turn on a row that vanished because a comparison with NULL was never true.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả 17 mục, từ "một máy chủ bạn nói chuyện bằng SQL" tới "hỏi cơ sở dữ liệu trước khi đoán". Nhiều câu cho sẵn SQL rồi hỏi nó trả về gì, lỗi nào hiện ra, hay bộ lập kế hoạch chọn plan nào; mọi đáp án loại đó đều lấy từ việc chạy thật trên một PostgreSQL 16 thứ thiệt, nên hãy đọc câu lệnh thay vì đoán theo cảm tính.</p>' +
  '<p>Hai thói quen giúp ích ở đây. Một là đếm số dòng: phần lớn câu trả lời sai trong SQL không phải sai phép tính, mà là sai số dòng đi tới hàm tổng hợp. Hai là luôn nhớ <code>NULL</code> nghĩa là <em>không biết</em>, chứ không phải <em>rỗng</em> — nhiều câu ăn thua ở một dòng biến mất vì phép so sánh với NULL không bao giờ đúng.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'postgresql' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Final Exam — the whole PostgreSQL course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá PostgreSQL (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all seventeen sections: the client/server model, why PostgreSQL exists and ACID, data types, tables and constraints, inserting and querying, joins, aggregation, subqueries and CTEs, window functions, indexes, EXPLAIN and the planner, transactions and MVCC, functions, triggers and views, JSONB and full-text search, connections and vacuum, backup, replication and partitioning, and production practice.',
        'Năm mươi câu trắc nghiệm phủ cả mười bảy mục: mô hình khách–chủ, vì sao PostgreSQL tồn tại và ACID, kiểu dữ liệu, bảng và ràng buộc, chèn và truy vấn, JOIN, tổng hợp, truy vấn con và CTE, hàm cửa sổ, chỉ mục, EXPLAIN và bộ lập kế hoạch, giao dịch và MVCC, hàm, trigger và view, JSONB và full-text search, kết nối và vacuum, sao lưu, nhân bản và phân mảnh, và thực hành production.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      shuffleQuestions: true,
      shuffleOptions: false,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        // ── Mục 0 — Giới thiệu & mô hình tư duy ─────────────────────────
        mcq({
          prompt: B(
            'You practised all week in a container started like this, then ran ' + c('docker rm pg15') + ' to clean up. What happened to your database?' + code(
              'docker run -d --name pg15 \\\n' +
              '  -e POSTGRES_PASSWORD=123456 \\\n' +
              '  -p 5433:5432 \\\n' +
              '  postgres:15',
            ),
            'Bạn thực hành cả tuần trong một container khởi động như dưới đây, rồi chạy ' + c('docker rm pg15') + ' để dọn dẹp. Cơ sở dữ liệu của bạn ra sao?' + code(
              'docker run -d --name pg15 \\\n' +
              '  -e POSTGRES_PASSWORD=123456 \\\n' +
              '  -p 5433:5432 \\\n' +
              '  postgres:15',
            ),
          ),
          options: [
            B('It is safe — the official image always writes to a Docker volume, so the data outlives the container', 'Nó an toàn — ảnh chính thức luôn ghi vào một volume của Docker, nên dữ liệu sống lâu hơn container'),
            B('It is safe — data lives on the host at the port you published, so <code>-p 5433:5432</code> is what persisted it', 'Nó an toàn — dữ liệu nằm trên máy chủ ở cổng bạn công bố, nên chính <code>-p 5433:5432</code> đã giữ lại nó'),
            B('It is gone: with no named volume the data sat in the container\'s writable layer, so removing the container removed the database — silently', 'Mất rồi: không có volume đặt tên thì dữ liệu nằm trong lớp ghi được của container, nên xoá container là xoá luôn cơ sở dữ liệu — im lặng, không cảnh báo'),
            B('It is gone, but <code>docker start pg15</code> recreates it from the image\'s baked-in copy', 'Mất rồi, nhưng <code>docker start pg15</code> dựng lại nó từ bản nằm sẵn trong ảnh'),
          ],
          correct: 2,
          explanation: EX(
            'A container without <code>-v pgdata:/var/lib/postgresql/data</code> keeps everything in its own writable layer, which is deleted together with the container. Nothing warns you — lesson 0.3 calls this the single most common way people lose a day of work in this course. Option 1 is the belief that causes it: the image declares a <code>VOLUME</code>, which creates an <em>anonymous</em> volume you will never find again, not a named one you can reattach. Option 2 confuses the network port with storage; <code>-p</code> only forwards traffic. Option 3 is wrong because the image ships the PostgreSQL <em>binaries</em>, never your rows. Always start with a named volume.',
            'Một container không có <code>-v pgdata:/var/lib/postgresql/data</code> giữ mọi thứ trong lớp ghi được của chính nó, và lớp đó bị xoá cùng container. Không có gì cảnh báo cả — bài 0.3 gọi đây là cách phổ biến nhất khiến người học mất trắng một ngày làm việc. Phương án 1 chính là niềm tin gây ra chuyện đó: ảnh có khai <code>VOLUME</code>, nhưng nó tạo một volume <em>vô danh</em> mà bạn sẽ không bao giờ tìm lại được, chứ không phải một volume có tên để gắn lại. Phương án 2 nhầm cổng mạng với nơi lưu trữ; <code>-p</code> chỉ chuyển tiếp lưu lượng. Phương án 3 sai vì ảnh chỉ mang <em>chương trình</em> PostgreSQL, không bao giờ mang các dòng dữ liệu của bạn. Hãy luôn khởi động kèm một volume có tên.',
          ),
        }),

        mcq({
          prompt: B(
            'SQL is a <b>declarative</b> language. What does that imply about making this query faster?' + code(
              'SELECT title FROM notes WHERE pinned = true ORDER BY created_at DESC;',
            ),
            'SQL là ngôn ngữ <b>khai báo</b>. Điều đó hàm ý gì về việc làm truy vấn dưới đây nhanh lên?' + code(
              'SELECT title FROM notes WHERE pinned = true ORDER BY created_at DESC;',
            ),
          ),
          options: [
            B('Nothing — declarative only describes the syntax; speed still comes from rewriting the statement into a more efficient form', 'Không hàm ý gì — khai báo chỉ nói về cú pháp; tốc độ vẫn đến từ việc viết lại câu lệnh thành dạng hiệu quả hơn'),
            B('It means PostgreSQL always picks the optimal plan, so a slow query is always a hardware problem', 'Nó nghĩa là PostgreSQL luôn chọn được plan tối ưu, nên truy vấn chậm luôn là vấn đề phần cứng'),
            B('It means you must add an explicit hint telling the planner which index to use, the way other databases do', 'Nó nghĩa là bạn phải thêm một chỉ dẫn tường minh bảo bộ lập kế hoạch dùng chỉ mục nào, như các cơ sở dữ liệu khác'),
            B('You said <em>what</em> you want, never <em>how</em> — so the usual fix is giving the planner a better <b>option</b> (an index) or better <b>information</b> (fresh statistics), not rewriting the query', 'Bạn đã nói <em>cái gì</em> mình muốn, chứ không nói <em>làm thế nào</em> — nên cách sửa thường là cho bộ lập kế hoạch một <b>lựa chọn</b> tốt hơn (một chỉ mục) hoặc <b>thông tin</b> tốt hơn (thống kê mới), chứ không phải viết lại truy vấn'),
          ],
          correct: 3,
          explanation: EX(
            'Nowhere in that statement did you tell PostgreSQL to loop over rows, to use an index, or even to sort — the planner may skip the sort entirely if an index already delivers rows in <code>created_at</code> order. That is the whole point of lesson 0.4: the same unchanged text gets faster once the planner has a cheaper option or a truer estimate. Chapter 9 supplies the options and chapter 10.3 supplies the information (<code>ANALYZE</code>, <code>CREATE STATISTICS</code>). Option 2 is contradicted by the entire planner chapter — the planner is cost-based and a wrong row estimate produces a wrong strategy. Option 3 describes optimiser hints, which PostgreSQL deliberately does not have; <code>enable_hashjoin = off</code> and friends exist for <em>diagnosis</em>, never for production code.',
            'Không chỗ nào trong câu lệnh đó bạn bảo PostgreSQL phải lặp qua từng dòng, phải dùng chỉ mục, hay thậm chí phải sắp xếp — bộ lập kế hoạch có thể bỏ hẳn bước sắp xếp nếu một chỉ mục đã trả dòng ra theo đúng thứ tự <code>created_at</code>. Đó chính là điều bài 0.4 muốn nói: vẫn nguyên văn ấy, không sửa một chữ, mà nhanh lên khi bộ lập kế hoạch có lựa chọn rẻ hơn hoặc ước lượng đúng hơn. Chương 9 cung cấp lựa chọn, còn bài 10.3 cung cấp thông tin (<code>ANALYZE</code>, <code>CREATE STATISTICS</code>). Phương án 2 bị cả chương lập kế hoạch bác bỏ — bộ lập kế hoạch hoạt động theo chi phí, và một ước lượng số dòng sai sẽ đẻ ra một chiến lược sai. Phương án 3 mô tả cơ chế "hint" mà PostgreSQL cố ý không có; <code>enable_hashjoin = off</code> và các anh em của nó tồn tại để <em>chẩn đoán</em>, không bao giờ để dùng trong mã production.',
          ),
        }),

        // ── Chương 1 — Vì sao PostgreSQL tồn tại ────────────────────────
        mcq({
          prompt: B(
            'In "relational database", what does the word <b>relational</b> actually refer to?',
            'Trong cụm "cơ sở dữ liệu quan hệ", chữ <b>quan hệ</b> thật ra chỉ điều gì?',
          ),
          options: [
            B('The foreign keys — a database is "relational" precisely because tables hold references to one another', 'Các khoá ngoại — một cơ sở dữ liệu là "quan hệ" chính vì các bảng chứa tham chiếu tới nhau'),
            B('Codd\'s 1970 mathematical <b>relations</b> — sets of tuples. A table <em>is</em> a relation; the foreign keys are a separate idea layered on top', 'Các <b>quan hệ</b> theo nghĩa toán học trong bài báo 1970 của Codd — tập hợp các bộ. Một bảng <em>chính là</em> một quan hệ; khoá ngoại là một ý tưởng khác đặt chồng lên trên'),
            B('The one-to-many and many-to-many relationships you draw in an ER diagram before creating the tables', 'Các mối quan hệ một-nhiều và nhiều-nhiều bạn vẽ trong sơ đồ ER trước khi tạo bảng'),
            B('The JOIN operator — without joins the model would just be a collection of independent tables', 'Toán tử JOIN — không có JOIN thì mô hình chỉ còn là một mớ bảng độc lập'),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 1.1 insists on this because the loose reading is so tempting. The term comes from Edgar F. Codd\'s 1970 paper at IBM, where a <em>relation</em> is a mathematical set of tuples — which is exactly what a table is, one row per tuple. Options 1, 3 and 4 all describe genuinely important things (referential integrity, ER modelling, joins) that the model makes possible, but a single table with no foreign key at all is still a relation, and that is the proof the loose reading is wrong. The distinction matters in practice: because a table is a set, the storage principle that follows is "store each fact once and link by key" (normalization, 3.4), and relationships are <b>values</b> the database can check rather than pointers it cannot.',
            'Bài 1.1 nhấn mạnh điểm này vì cách hiểu nôm na quá dễ lọt tai. Thuật ngữ đến từ bài báo năm 1970 của Edgar F. Codd tại IBM, trong đó một <em>quan hệ</em> là một tập hợp toán học gồm các bộ — mà một bảng chính là như vậy, mỗi dòng một bộ. Các phương án 1, 3 và 4 đều mô tả những thứ thật sự quan trọng (toàn vẹn tham chiếu, mô hình hoá ER, phép JOIN) mà mô hình này cho phép, nhưng một bảng đơn độc không có khoá ngoại nào vẫn là một quan hệ — và đó là bằng chứng cách hiểu nôm na sai. Phân biệt này có ý nghĩa thực tế: vì một bảng là một tập hợp, nguyên tắc lưu trữ suy ra từ đó là "cất mỗi sự thật đúng một lần rồi nối bằng khoá" (chuẩn hoá, bài 3.4), và các mối liên hệ là <b>giá trị</b> mà cơ sở dữ liệu kiểm được, chứ không phải con trỏ mà nó không kiểm nổi.',
          ),
        }),

        mcq({
          prompt: B(
            'Account A holds 100.00 and the table has ' + c('CHECK (balance >= 0)') + '. This ran exactly as shown. What does the output tell you?' + code(
              'BEGIN;\n' +
              "UPDATE accounts SET balance = balance - 150 WHERE id = 'A';\n" +
              "UPDATE accounts SET balance = balance + 150 WHERE id = 'B';\n" +
              'COMMIT;\n' +
              '\n' +
              '-- BEGIN\n' +
              '-- ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"\n' +
              '-- DETAIL:  Failing row contains (A, Cuong, -50.00).\n' +
              '-- ERROR:  current transaction is aborted, commands ignored until end of transaction block\n' +
              '-- ROLLBACK',
            ),
            'Tài khoản A có 100.00 và bảng có ' + c('CHECK (balance >= 0)') + '. Đoạn dưới chạy đúng như hiển thị. Kết quả cho bạn biết điều gì?' + code(
              'BEGIN;\n' +
              "UPDATE accounts SET balance = balance - 150 WHERE id = 'A';\n" +
              "UPDATE accounts SET balance = balance + 150 WHERE id = 'B';\n" +
              'COMMIT;\n' +
              '\n' +
              '-- BEGIN\n' +
              '-- ERROR:  new row for relation "accounts" violates check constraint "accounts_balance_check"\n' +
              '-- DETAIL:  Failing row contains (A, Cuong, -50.00).\n' +
              '-- ERROR:  current transaction is aborted, commands ignored until end of transaction block\n' +
              '-- ROLLBACK',
            ),
          ),
          options: [
            B('The second <code>UPDATE</code> never ran, and the <code>COMMIT</code> was turned into a <code>ROLLBACK</code> — B was not credited, A is still 100.00', 'Lệnh <code>UPDATE</code> thứ hai chưa hề chạy, và <code>COMMIT</code> đã biến thành <code>ROLLBACK</code> — B không được cộng, A vẫn là 100.00'),
            B('B was credited 150.00 and A was left at 100.00, so the two accounts no longer balance', 'B đã được cộng 150.00 còn A vẫn 100.00, nên hai tài khoản không còn khớp nhau'),
            B('A was set to -50.00 and the <code>CHECK</code> only logged a warning, which is what the second ERROR line is', 'A bị đặt về -50.00 còn <code>CHECK</code> chỉ ghi một cảnh báo, và dòng ERROR thứ hai chính là cảnh báo đó'),
            B('PostgreSQL retried the first <code>UPDATE</code> automatically and both statements eventually succeeded', 'PostgreSQL đã tự thử lại lệnh <code>UPDATE</code> đầu tiên và rốt cuộc cả hai lệnh đều thành công'),
          ],
          correct: 0,
          explanation: EX(
            'This is atomicity, proven rather than described. The <code>CHECK</code> rejected the first statement, which put the transaction into the <b>aborted</b> state — from there it accepts nothing but <code>ROLLBACK</code>, so the second ERROR line is not a warning, it is the transaction refusing the second <code>UPDATE</code>. The detail worth memorising is the last line: <code>COMMIT</code> printed <code>ROLLBACK</code>, because an aborted transaction <em>cannot</em> be committed and committing one is silently a rollback. Lesson 11.1 spells out the practical consequence — if your application logs "commit succeeded" here, that log is lying to you. Option 2 is the half-transferred state that atomicity exists to make impossible; option 4 invents a retry PostgreSQL never performs.',
            'Đây là tính nguyên tử, được chứng minh chứ không phải mô tả. <code>CHECK</code> đã từ chối lệnh đầu tiên, đưa giao dịch vào trạng thái <b>đã huỷ</b> — từ đó nó không nhận gì ngoài <code>ROLLBACK</code>, nên dòng ERROR thứ hai không phải cảnh báo, mà là giao dịch từ chối lệnh <code>UPDATE</code> thứ hai. Chi tiết đáng thuộc nằm ở dòng cuối: <code>COMMIT</code> in ra <code>ROLLBACK</code>, vì một giao dịch đã huỷ thì <em>không thể</em> commit, và commit nó thực chất là rollback trong im lặng. Bài 11.1 nói thẳng hệ quả thực tế — nếu mã của bạn ghi log "commit thành công" ở đây thì cái log đó đang nói dối bạn. Phương án 2 chính là trạng thái chuyển tiền nửa vời mà tính nguyên tử sinh ra để làm cho nó không thể xảy ra; phương án 4 bịa ra một cơ chế tự thử lại mà PostgreSQL không hề có.',
          ),
        }),

        mcq({
          prompt: B(
            'You want to know how PostgreSQL would execute a cleanup <code>DELETE</code> on production, without deleting anything yet. Which is safe?',
            'Bạn muốn biết PostgreSQL sẽ thực thi một lệnh <code>DELETE</code> dọn dẹp trên production ra sao, mà chưa xoá gì cả. Cách nào an toàn?',
          ),
          options: [
            B('<code>EXPLAIN ANALYZE DELETE …</code> — <code>ANALYZE</code> means "analyse the statement", so it plans without executing', '<code>EXPLAIN ANALYZE DELETE …</code> — chữ <code>ANALYZE</code> nghĩa là "phân tích câu lệnh", nên nó chỉ lập kế hoạch chứ không thực thi'),
            B('<code>EXPLAIN (ANALYZE, BUFFERS) DELETE …</code> — adding <code>BUFFERS</code> switches it to a dry run that only counts pages', '<code>EXPLAIN (ANALYZE, BUFFERS) DELETE …</code> — thêm <code>BUFFERS</code> sẽ chuyển nó sang chế độ chạy thử, chỉ đếm số trang'),
            B('Neither is needed — <code>EXPLAIN</code> refuses to accept <code>DELETE</code> at all, so any form of it is safe by construction', 'Chẳng cần cách nào — <code>EXPLAIN</code> vốn không nhận <code>DELETE</code>, nên mọi dạng của nó đều an toàn tự thân'),
            B('Plain <code>EXPLAIN DELETE …</code> (no <code>ANALYZE</code>), or <code>BEGIN; EXPLAIN ANALYZE DELETE …; ROLLBACK;</code> if you need real timings', '<code>EXPLAIN DELETE …</code> trần (không có <code>ANALYZE</code>), hoặc <code>BEGIN; EXPLAIN ANALYZE DELETE …; ROLLBACK;</code> nếu bạn cần số đo thật'),
          ],
          correct: 3,
          explanation: EX(
            'Verified by running it: <code>EXPLAIN ANALYZE</code> genuinely <b>executes</b> the statement — that is where the <code>actual time</code> and <code>rows</code> numbers come from — so on a write it really writes. Lesson 1.4 states it and 10.1 repeats it: the plan you print for a <code>DELETE</code> is the receipt, not the estimate. Options 1 and 2 both read <code>ANALYZE</code> as a mode switch; it is the opposite, the flag that turns planning into running, and <code>BUFFERS</code> only adds page counts to a run that is already happening. Option 3 is false — <code>EXPLAIN</code> accepts <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> and <code>SELECT</code> alike, which is exactly why the trap exists. Plain <code>EXPLAIN</code> never executes; wrapping in <code>BEGIN … ROLLBACK</code> is the habit to build, because the dangerous case is the one you will forget.',
            'Đã chạy thật để kiểm: <code>EXPLAIN ANALYZE</code> thật sự <b>thực thi</b> câu lệnh — đó chính là chỗ các con số <code>actual time</code> và <code>rows</code> sinh ra — nên với một lệnh ghi thì nó ghi thật. Bài 1.4 nói điều này và bài 10.1 nhắc lại: cái plan bạn in ra cho một <code>DELETE</code> là tờ biên nhận, không phải bản dự toán. Phương án 1 và 2 đều hiểu <code>ANALYZE</code> như một công tắc đổi chế độ; thực tế ngược lại, nó là cờ biến việc lập kế hoạch thành việc chạy thật, còn <code>BUFFERS</code> chỉ thêm số trang vào một lần chạy vốn đã diễn ra. Phương án 3 sai — <code>EXPLAIN</code> nhận cả <code>INSERT</code>, <code>UPDATE</code>, <code>DELETE</code> lẫn <code>SELECT</code>, và chính vì thế cái bẫy này mới tồn tại. <code>EXPLAIN</code> trần không bao giờ thực thi; bọc trong <code>BEGIN … ROLLBACK</code> là thói quen cần rèn, vì ca nguy hiểm đúng là ca bạn sẽ quên.',
          ),
        }),

        // ── Chương 2 — Kiểu dữ liệu ─────────────────────────────────────
        mcq({
          prompt: B(
            'This was run on PostgreSQL 16. Which row of results is correct?' + code(
              'SELECT 0.1::float8 + 0.2::float8       AS float_sum,\n' +
              '       0.1::numeric + 0.2::numeric     AS numeric_sum,\n' +
              '       (0.1::float8 + 0.2::float8) = 0.3::float8 AS float_eq;',
            ),
            'Đoạn này đã chạy trên PostgreSQL 16. Dòng kết quả nào đúng?' + code(
              'SELECT 0.1::float8 + 0.2::float8       AS float_sum,\n' +
              '       0.1::numeric + 0.2::numeric     AS numeric_sum,\n' +
              '       (0.1::float8 + 0.2::float8) = 0.3::float8 AS float_eq;',
            ),
          ),
          options: [
            B('<code>0.3</code> · <code>0.3</code> · <code>t</code> — PostgreSQL rounds float output for display, and the comparison follows the display', '<code>0.3</code> · <code>0.3</code> · <code>t</code> — PostgreSQL làm tròn float khi hiển thị, và phép so sánh đi theo cái hiển thị đó'),
            B('<code>0.30000000000000004</code> · <code>0.3</code> · <code>t</code> — the sum prints imprecisely but still compares equal to 0.3', '<code>0.30000000000000004</code> · <code>0.3</code> · <code>t</code> — tổng in ra không chính xác nhưng vẫn so sánh bằng 0.3'),
            B('<code>0.30000000000000004</code> · <code>0.3</code> · <code>f</code> — binary floating point cannot represent 0.1 or 0.2 exactly, so the sum is genuinely not 0.3', '<code>0.30000000000000004</code> · <code>0.3</code> · <code>f</code> — số thực dấu phẩy động nhị phân không biểu diễn chính xác được 0.1 hay 0.2, nên tổng thật sự không bằng 0.3'),
            B('An error — PostgreSQL refuses to compare a <code>float8</code> expression for exact equality', 'Một lỗi — PostgreSQL từ chối so sánh bằng chính xác trên một biểu thức <code>float8</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Verified on PostgreSQL 16.14: <code>0.30000000000000004 | 0.3 | f</code>. Neither 0.1 nor 0.2 has an exact binary representation, so the sum lands one ulp above 0.3 and the equality is false. <code>numeric</code> stores decimal digits, so it adds to exactly 0.3. This is why lesson 2.1 states the rule with no exceptions: money and any exact decimal go in <code>numeric</code>, never <code>float</code> / <code>real</code> / <code>double precision</code>. The reason it is so dangerous is that it passes every test written with round numbers, and by the time an audit finds it the precision was lost <em>at write time</em>, so it cannot be repaired from the stored data. Option 4 is wrong because PostgreSQL happily performs the comparison — it just answers <code>f</code>, silently.',
            'Đã kiểm trên PostgreSQL 16.14: <code>0.30000000000000004 | 0.3 | f</code>. Cả 0.1 lẫn 0.2 đều không có biểu diễn nhị phân chính xác, nên tổng rơi cao hơn 0.3 đúng một đơn vị cuối và phép bằng cho ra sai. <code>numeric</code> lưu chữ số thập phân nên cộng ra đúng 0.3. Vì thế bài 2.1 phát biểu quy tắc không ngoại lệ: tiền bạc và mọi số thập phân chính xác dùng <code>numeric</code>, không bao giờ dùng <code>float</code> / <code>real</code> / <code>double precision</code>. Điều khiến nó nguy hiểm là nó vượt qua mọi bài kiểm thử viết bằng số chẵn, và tới lúc kiểm toán phát hiện ra thì độ chính xác đã mất <em>ngay lúc ghi</em>, nên không cách nào sửa lại từ dữ liệu đã lưu. Phương án 4 sai vì PostgreSQL vẫn thực hiện phép so sánh — nó chỉ trả về <code>f</code>, lặng lẽ.',
          ),
        }),

        mcq({
          prompt: B(
            'A ' + c('char(5)') + ' column is said to be blank-padded. Run on PostgreSQL 16, which of these expressions actually <b>reveals</b> the padding?' + code(
              "length('hi'::char(5))          -- A\n" +
              "('hi'::char(5)) || '|'         -- B\n" +
              "octet_length('hi'::char(5))    -- C\n" +
              "'hi'::char(5) = 'hi'::char(5)  -- D",
            ),
            'Cột ' + c('char(5)') + ' được cho là đệm bằng khoảng trắng. Chạy trên PostgreSQL 16, biểu thức nào thật sự <b>làm lộ ra</b> phần đệm đó?' + code(
              "length('hi'::char(5))          -- A\n" +
              "('hi'::char(5)) || '|'         -- B\n" +
              "octet_length('hi'::char(5))    -- C\n" +
              "'hi'::char(5) = 'hi'::char(5)  -- D",
            ),
          ),
          options: [
            B('B — concatenating shows <code>hi   |</code>, three spaces before the bar', 'B — phép nối cho ra <code>hi   |</code>, ba khoảng trắng trước dấu gạch'),
            B('C only — <code>octet_length</code> returns <b>5</b>, while A returns 2, B returns <code>hi|</code> and D returns true', 'Chỉ C — <code>octet_length</code> trả về <b>5</b>, trong khi A trả về 2, B trả về <code>hi|</code> còn D trả về đúng'),
            B('A — <code>length</code> returns 5, which is the whole point of a fixed-width type', 'A — <code>length</code> trả về 5, và đó chính là ý nghĩa của một kiểu độ rộng cố định'),
            B('None of them — <code>char(n)</code> in PostgreSQL is just an alias for <code>varchar(n)</code> and never pads', 'Không cái nào — <code>char(n)</code> trong PostgreSQL chỉ là tên khác của <code>varchar(n)</code> và không bao giờ đệm'),
          ],
          correct: 1,
          explanation: EX(
            'Measured on PostgreSQL 16.14: <code>octet_length</code> = <b>5</b>, <code>length</code> = <b>2</b>, the concatenation = <code>hi|</code>, and D = true. The padding is genuinely stored — that is what <code>octet_length</code> and <code>pg_column_size</code> (9 bytes for <code>char(5)</code> versus 6 for <code>text</code>) both report — but almost every operation hides it again: <code>length()</code> ignores trailing blanks for this type, <code>||</code> casts to <code>text</code> and strips them, and comparison between two <code>char</code> values ignores them too. <b>Note that this differs from lesson 2.2, which shows <code>hi   |</code> for case B; the concatenation strips the padding on PostgreSQL 16.</b> That inconsistency is the real lesson: <code>char(n)</code> costs more space, pads invisibly, and behaves differently depending on which function touches it. Use <code>text</code>, or <code>varchar(n)</code> when you want the length rule enforced — and never <code>char(n)</code>, not even for a fixed-width code.',
            'Đo thật trên PostgreSQL 16.14: <code>octet_length</code> = <b>5</b>, <code>length</code> = <b>2</b>, phép nối ra <code>hi|</code>, và D trả về đúng. Phần đệm thật sự được lưu — đó là điều cả <code>octet_length</code> lẫn <code>pg_column_size</code> (9 byte cho <code>char(5)</code> so với 6 cho <code>text</code>) đều báo — nhưng gần như mọi thao tác lại giấu nó đi: <code>length()</code> bỏ qua khoảng trắng cuối với kiểu này, <code>||</code> ép về <code>text</code> rồi cắt bỏ chúng, và phép so sánh giữa hai giá trị <code>char</code> cũng bỏ qua chúng. <b>Lưu ý điều này khác với bài 2.2, nơi ca B được ghi là <code>hi   |</code>; trên PostgreSQL 16 phép nối cắt mất phần đệm.</b> Chính sự thiếu nhất quán đó mới là bài học: <code>char(n)</code> tốn chỗ hơn, đệm một cách vô hình, và cư xử khác nhau tuỳ hàm nào chạm vào nó. Hãy dùng <code>text</code>, hoặc <code>varchar(n)</code> khi bạn muốn ràng buộc độ dài — và đừng bao giờ dùng <code>char(n)</code>, kể cả cho một mã có độ rộng cố định.',
          ),
        }),

        mcq({
          prompt: B(
            'The session timezone is UTC. What does this print?' + code(
              "SET timezone = 'UTC';\n" +
              "SELECT '2026-08-10 09:00:00+07'::timestamptz;",
            ),
            'Múi giờ của phiên là UTC. Câu lệnh sau in ra gì?' + code(
              "SET timezone = 'UTC';\n" +
              "SELECT '2026-08-10 09:00:00+07'::timestamptz;",
            ),
          ),
          options: [
            B('<code>2026-08-10 02:00:00+00</code> — the literal named an instant, and the session renders that instant in UTC', '<code>2026-08-10 02:00:00+00</code> — chuỗi đã chỉ ra một thời điểm, và phiên hiển thị thời điểm đó theo UTC'),
            B('<code>2026-08-10 09:00:00+00</code> — the offset in the literal is stored as metadata and the wall-clock reading is kept as typed', '<code>2026-08-10 09:00:00+00</code> — độ lệch trong chuỗi được lưu như siêu dữ liệu còn giờ đồng hồ giữ nguyên như gõ vào'),
            B('<code>2026-08-10 16:00:00+07</code> — the offset is added to the value on the way in', '<code>2026-08-10 16:00:00+07</code> — độ lệch được cộng vào giá trị lúc nhập'),
            B('An error — a <code>timestamptz</code> literal may not carry an explicit offset when the session timezone is set', 'Một lỗi — chuỗi <code>timestamptz</code> không được mang độ lệch tường minh khi phiên đã đặt múi giờ'),
          ],
          correct: 0,
          explanation: EX(
            'Verified on PostgreSQL 16.14: <code>2026-08-10 02:00:00+00</code>. A <code>timestamptz</code> stores an <b>absolute instant</b> internally in UTC; the offset in the literal is used to work out which instant you meant (09:00 at +07 is 02:00 UTC), and then the value is rendered in the <em>session\'s</em> timezone on the way out. Run the same statement with <code>SET timezone = \'Asia/Ho_Chi_Minh\'</code> and it prints <code>2026-08-10 09:00:00+07</code> — the same instant, a different rendering. Option 2 describes plain <code>timestamp</code>, which keeps a wall-clock reading with no anchor to a real moment; lesson 2.3\'s trap is exactly that choosing it works perfectly until a daylight-saving change or a second region arrives, and by then the information needed to interpret the old rows was never stored. Default to <code>timestamptz</code> for every real event.',
            'Đã kiểm trên PostgreSQL 16.14: <code>2026-08-10 02:00:00+00</code>. Kiểu <code>timestamptz</code> lưu một <b>thời điểm tuyệt đối</b>, bên trong là UTC; độ lệch trong chuỗi dùng để suy ra bạn muốn nói thời điểm nào (09:00 ở +07 chính là 02:00 UTC), rồi giá trị được hiển thị theo múi giờ của <em>phiên</em> lúc trả ra. Chạy đúng câu đó với <code>SET timezone = \'Asia/Ho_Chi_Minh\'</code> thì nó in <code>2026-08-10 09:00:00+07</code> — cùng một thời điểm, khác cách hiển thị. Phương án 2 mô tả kiểu <code>timestamp</code> trần, thứ chỉ giữ một số đọc trên mặt đồng hồ mà không neo vào thời điểm thật nào; cái bẫy của bài 2.3 đúng là chọn nó thì chạy hoàn hảo cho tới khi đổi giờ mùa hè hoặc có thêm một khu vực thứ hai, và lúc ấy thông tin cần để hiểu các dòng cũ vốn chưa từng được lưu. Hãy mặc định dùng <code>timestamptz</code> cho mọi sự kiện có thật.',
          ),
        }),

        // ── Chương 3 — Bảng, ràng buộc & thiết kế lược đồ ────────────────
        mcq({
          prompt: B(
            'The child table was created with no <code>ON DELETE</code> clause. What happens on the last line?' + code(
              'CREATE TABLE n_r (\n' +
              '  id      int PRIMARY KEY,\n' +
              '  user_id int NOT NULL REFERENCES u_r(id),\n' +
              '  title   text\n' +
              ');\n' +
              "-- u_r has user 1; n_r has two rows with user_id = 1\n" +
              'DELETE FROM u_r WHERE id = 1;',
            ),
            'Bảng con được tạo mà không có mệnh đề <code>ON DELETE</code>. Dòng cuối cùng cho ra điều gì?' + code(
              'CREATE TABLE n_r (\n' +
              '  id      int PRIMARY KEY,\n' +
              '  user_id int NOT NULL REFERENCES u_r(id),\n' +
              '  title   text\n' +
              ');\n' +
              "-- u_r có user 1; n_r có hai dòng với user_id = 1\n" +
              'DELETE FROM u_r WHERE id = 1;',
            ),
          ),
          options: [
            B('The two child rows are deleted too — <code>CASCADE</code> is the default, which is why it is so rarely written out', 'Hai dòng con cũng bị xoá — <code>CASCADE</code> là mặc định, và vì thế người ta ít khi viết ra'),
            B('The parent is deleted and the children keep a <code>user_id</code> of 1 pointing at nothing', 'Dòng cha bị xoá còn các dòng con giữ <code>user_id</code> bằng 1 trỏ vào hư không'),
            B('The children have their <code>user_id</code> set to NULL — <code>SET NULL</code> is the default for a nullable-looking reference', 'Các dòng con bị đặt <code>user_id</code> thành NULL — <code>SET NULL</code> là mặc định cho một tham chiếu trông có vẻ cho phép NULL'),
            B('The delete is <b>refused</b> with a foreign key violation — the default is <code>NO ACTION</code> / <code>RESTRICT</code>', 'Lệnh xoá bị <b>từ chối</b> kèm lỗi vi phạm khoá ngoại — mặc định là <code>NO ACTION</code> / <code>RESTRICT</code>'),
          ],
          correct: 3,
          explanation: EX(
            'The exact message is <code>ERROR: update or delete on table "u_r" violates foreign key constraint "n_r_user_id_fkey" on table "n_r"</code>, with <code>DETAIL: Key (id)=(1) is still referenced from table "n_r".</code> Refusing is the default precisely because it fails loudly instead of quietly destroying data: option 1 is the belief that turns one click in an admin panel into forty thousand deleted rows across nine tables, which is why lesson 3.2 says to prefer a soft delete for anything a human might click. Option 2 would break referential integrity, the one thing a foreign key exists to prevent. Option 3 is a real behaviour but you have to ask for it — and the column must be nullable, which <code>user_id int NOT NULL</code> is not. One extra detail worth carrying: PostgreSQL indexes the parent side automatically but <b>not</b> the child\'s foreign-key column, so this check scans the child table unless you index it yourself.',
            'Thông báo nguyên văn là <code>ERROR: update or delete on table "u_r" violates foreign key constraint "n_r_user_id_fkey" on table "n_r"</code>, kèm <code>DETAIL: Key (id)=(1) is still referenced from table "n_r".</code> Từ chối là mặc định chính vì nó hỏng một cách ồn ào thay vì phá dữ liệu trong im lặng: phương án 1 là niềm tin biến một cú bấm trong trang quản trị thành bốn mươi nghìn dòng bị xoá trên chín bảng, và vì thế bài 3.2 khuyên nên dùng xoá mềm cho bất cứ thứ gì một con người có thể bấm vào. Phương án 2 sẽ phá vỡ toàn vẹn tham chiếu, đúng thứ mà khoá ngoại sinh ra để ngăn. Phương án 3 là một hành vi có thật nhưng phải khai báo mới có — và cột phải cho phép NULL, trong khi <code>user_id int NOT NULL</code> thì không. Một chi tiết nữa đáng mang theo: PostgreSQL tự đánh chỉ mục phía cha nhưng <b>không</b> đánh cho cột khoá ngoại phía con, nên phép kiểm này quét cả bảng con trừ khi bạn tự tạo chỉ mục.',
          ),
        }),

        mcq({
          prompt: B(
            'Both statements were rejected on PostgreSQL 16. What do the two columns have in common?' + code(
              'CREATE TABLE t_id (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, x text);\n' +
              "INSERT INTO t_id (id, x) VALUES (99, 'c');\n" +
              '-- ERROR:  cannot insert a non-DEFAULT value into column "id"\n' +
              '-- HINT:   Use OVERRIDING SYSTEM VALUE to override.\n' +
              '\n' +
              '-- product.final_price is GENERATED ALWAYS AS (...) STORED\n' +
              "INSERT INTO product (sku, name, price, final_price) VALUES ('A6','x',10,5);\n" +
              '-- ERROR:  cannot insert a non-DEFAULT value into column "final_price"',
            ),
            'Cả hai lệnh đều bị từ chối trên PostgreSQL 16. Hai cột đó có điểm gì chung?' + code(
              'CREATE TABLE t_id (id int GENERATED ALWAYS AS IDENTITY PRIMARY KEY, x text);\n' +
              "INSERT INTO t_id (id, x) VALUES (99, 'c');\n" +
              '-- ERROR:  cannot insert a non-DEFAULT value into column "id"\n' +
              '-- HINT:   Use OVERRIDING SYSTEM VALUE to override.\n' +
              '\n' +
              '-- product.final_price là GENERATED ALWAYS AS (...) STORED\n' +
              "INSERT INTO product (sku, name, price, final_price) VALUES ('A6','x',10,5);\n" +
              '-- ERROR:  cannot insert a non-DEFAULT value into column "final_price"',
            ),
          ),
          options: [
            B('Both are <code>NOT NULL</code>, and PostgreSQL rejects an explicit value for a <code>NOT NULL</code> column that also has a default', 'Cả hai đều <code>NOT NULL</code>, và PostgreSQL từ chối giá trị tường minh cho một cột <code>NOT NULL</code> mà lại có giá trị mặc định'),
            B('Both are part of the primary key, and primary key columns are always written by the server', 'Cả hai đều thuộc khoá chính, và cột khoá chính thì luôn do máy chủ ghi'),
            B('The database <b>owns</b> the value: <code>GENERATED ALWAYS</code> means the value is produced by the server, so a client cannot write it and it can never drift out of step', 'Cơ sở dữ liệu <b>sở hữu</b> giá trị đó: <code>GENERATED ALWAYS</code> nghĩa là giá trị do máy chủ sinh ra, nên client không ghi được và nó không bao giờ lệch pha'),
            B('Both use a sequence internally, and a sequence value can only be advanced by <code>nextval()</code>', 'Cả hai đều dùng sequence bên trong, và giá trị sequence chỉ có thể tiến lên bằng <code>nextval()</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Both errors were reproduced on PostgreSQL 16.14. The shared idea is ownership, not nullability or keys. An identity column owns the row\'s id so two clients cannot collide; a stored generated column owns a derived value so nobody can update <code>price</code> and forget to recompute <code>final_price</code> — lesson 3.3 puts it bluntly: if it were an ordinary column, sooner or later your data would lie. Option 1 is wrong on its own terms — a column with a plain <code>DEFAULT</code> accepts an explicit value happily. Option 2 fails on <code>final_price</code>, which is not in any key. Option 4 is only half true of identity and not true at all of a generated column, which computes an expression and has no sequence. The escape hatches are deliberate and named in the messages: <code>OVERRIDING SYSTEM VALUE</code> for identity, or <code>GENERATED BY DEFAULT AS IDENTITY</code> when you genuinely import existing ids.',
            'Cả hai lỗi đều đã tái hiện trên PostgreSQL 16.14. Điểm chung là quyền sở hữu, chứ không phải tính cho-phép-NULL hay chuyện khoá. Cột identity sở hữu id của dòng để hai client không giẫm lên nhau; cột sinh lưu trữ sở hữu một giá trị dẫn xuất để không ai sửa <code>price</code> rồi quên tính lại <code>final_price</code> — bài 3.3 nói thẳng: nếu nó là cột thường thì sớm muộn dữ liệu của bạn sẽ nói dối. Phương án 1 sai ngay trong chính lập luận của nó — một cột có <code>DEFAULT</code> thường vẫn nhận giá trị tường minh thoải mái. Phương án 2 gãy ở <code>final_price</code>, vốn không thuộc khoá nào. Phương án 4 chỉ đúng một nửa với identity và hoàn toàn sai với cột sinh, thứ tính một biểu thức và chẳng có sequence nào. Các lối thoát là cố ý và được nêu ngay trong thông báo: <code>OVERRIDING SYSTEM VALUE</code> cho identity, hoặc <code>GENERATED BY DEFAULT AS IDENTITY</code> khi bạn thật sự cần nhập id có sẵn.',
          ),
        }),

        mcq({
          prompt: B(
            'Three <code>ALTER TABLE</code> statements are queued against a table that already holds ten million rows. Which one is the outage?' + code(
              'ALTER TABLE contact ADD COLUMN email text;                             -- A\n' +
              "ALTER TABLE contact ADD COLUMN status text NOT NULL DEFAULT 'active';  -- B\n" +
              'ALTER TABLE contact ALTER COLUMN amount TYPE numeric(12,2);            -- C',
            ),
            'Ba câu <code>ALTER TABLE</code> xếp hàng trên một bảng đã có mười triệu dòng. Câu nào là sự cố?' + code(
              'ALTER TABLE contact ADD COLUMN email text;                             -- A\n' +
              "ALTER TABLE contact ADD COLUMN status text NOT NULL DEFAULT 'active';  -- B\n" +
              'ALTER TABLE contact ALTER COLUMN amount TYPE numeric(12,2);            -- C',
            ),
          ),
          options: [
            B('A — adding any column at all must touch every row to make space for it', 'A — thêm bất kỳ cột nào cũng phải chạm vào mọi dòng để chừa chỗ cho nó'),
            B('C — changing a column\'s type <b>rewrites the whole table</b> under an exclusive lock; A and B are metadata-only on modern PostgreSQL', 'C — đổi kiểu của một cột sẽ <b>viết lại toàn bộ bảng</b> dưới một khoá độc quyền; A và B chỉ đụng siêu dữ liệu trên PostgreSQL hiện đại'),
            B('B — a <code>NOT NULL</code> column with a default must be backfilled row by row, so it is always the slow one', 'B — một cột <code>NOT NULL</code> có giá trị mặc định phải được điền lại từng dòng, nên nó luôn là câu chậm'),
            B('None of them — <code>ALTER TABLE</code> takes only a <code>SHARE</code> lock, so readers and writers continue throughout', 'Không câu nào — <code>ALTER TABLE</code> chỉ lấy khoá <code>SHARE</code>, nên người đọc và người ghi vẫn chạy suốt'),
          ],
          correct: 1,
          explanation: EX(
            'Lesson 3.4 sorts <code>ALTER TABLE</code> into tiers. Adding a <b>nullable</b> column (A) and, since PostgreSQL 11, adding a column with a <b>constant</b> default (B) are metadata-only — milliseconds regardless of table size, because the default is recorded once and applied on read. Changing a column\'s type (C) rewrites every row, holding an <code>ACCESS EXCLUSIVE</code> lock for minutes on ten million rows: that is an outage, not a migration. Option 3 states the pre-11 behaviour of B, which is exactly the kind of advice that is now out of date — though a <b>volatile</b> default still rewrites. Option 4 is the most dangerous belief of the four, because the lock is only half the story: an <code>ALTER</code> waiting for a lock <b>blocks every query that arrives after it</b>, so 200 ms of work behind one long-running <code>SELECT</code> can still stall the site for minutes. Set a short <code>lock_timeout</code> before DDL, and test against production-sized data — an empty dev database proves the syntax and nothing else.',
            'Bài 3.4 chia <code>ALTER TABLE</code> thành các bậc. Thêm một cột <b>cho phép NULL</b> (A) và, từ PostgreSQL 11, thêm một cột có giá trị mặc định là <b>hằng</b> (B) chỉ đụng tới siêu dữ liệu — vài mili giây bất kể bảng to cỡ nào, vì giá trị mặc định được ghi một lần và áp lúc đọc. Đổi kiểu của một cột (C) viết lại từng dòng, giữ khoá <code>ACCESS EXCLUSIVE</code> hàng phút trên mười triệu dòng: đó là một sự cố, không phải một migration. Phương án 3 mô tả hành vi của B ở thời trước bản 11, đúng kiểu lời khuyên nay đã lỗi thời — dù một giá trị mặc định <b>volatile</b> thì vẫn viết lại thật. Phương án 4 là niềm tin nguy hiểm nhất trong bốn cái, vì chuyện khoá mới chỉ là một nửa: một lệnh <code>ALTER</code> đang chờ khoá sẽ <b>chặn mọi truy vấn tới sau nó</b>, nên 200 ms công việc nằm sau một <code>SELECT</code> chạy lâu vẫn đủ làm cả trang web đứng hàng phút. Hãy đặt <code>lock_timeout</code> ngắn trước khi chạy DDL, và thử trên dữ liệu cỡ production — một cơ sở dữ liệu dev rỗng chỉ chứng minh được cú pháp, không hơn.',
          ),
        }),

        // ── Chương 4 — Chèn & truy vấn ──────────────────────────────────
        mcq({
          prompt: B(
            'A table holds three rows with <code>x</code> = 1, 2 and NULL. Run on PostgreSQL 16, how many rows does each <code>WHERE</code> keep?' + code(
              'SELECT count(*) FROM t WHERE x <> 1;                 -- A\n' +
              'SELECT count(*) FROM t WHERE x IS DISTINCT FROM 1;   -- B',
            ),
            'Một bảng có ba dòng với <code>x</code> bằng 1, 2 và NULL. Chạy trên PostgreSQL 16, mỗi mệnh đề <code>WHERE</code> giữ lại bao nhiêu dòng?' + code(
              'SELECT count(*) FROM t WHERE x <> 1;                 -- A\n' +
              'SELECT count(*) FROM t WHERE x IS DISTINCT FROM 1;   -- B',
            ),
          ),
          options: [
            B('A returns <b>1</b> and B returns <b>2</b> — <code>NULL &lt;&gt; 1</code> is <em>unknown</em>, and <code>WHERE</code> keeps only rows where the test is TRUE', 'A trả về <b>1</b> còn B trả về <b>2</b> — <code>NULL &lt;&gt; 1</code> là <em>không biết</em>, và <code>WHERE</code> chỉ giữ những dòng mà phép kiểm cho ĐÚNG'),
            B('Both return 2 — <code>&lt;&gt;</code> and <code>IS DISTINCT FROM</code> are synonyms, the second is just more explicit', 'Cả hai trả về 2 — <code>&lt;&gt;</code> và <code>IS DISTINCT FROM</code> là hai cách viết của cùng một thứ, cái sau chỉ tường minh hơn'),
            B('Both return 1 — NULL is skipped by every comparison operator, including <code>IS DISTINCT FROM</code>', 'Cả hai trả về 1 — NULL bị mọi toán tử so sánh bỏ qua, kể cả <code>IS DISTINCT FROM</code>'),
            B('A returns 2 and B returns 1 — <code>IS DISTINCT FROM</code> is the stricter form and additionally requires a non-NULL value', 'A trả về 2 còn B trả về 1 — <code>IS DISTINCT FROM</code> là dạng chặt hơn và còn đòi giá trị phải khác NULL'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: A gives <b>1</b>, B gives <b>2</b>. Every SQL condition evaluates to TRUE, FALSE or <b>UNKNOWN</b>, and <code>WHERE</code> keeps only TRUE — so the NULL row is dropped exactly like a FALSE row, but for a different reason. <code>IS DISTINCT FROM</code> is one of the few operators that treats NULL as a value rather than as an unknown, so it keeps it. The reason lesson 4.2 calls this the chapter\'s headline trap is what it does to a report: <b>the rows that vanish are precisely the ones with missing data</b>, which is usually the group you most needed to see. This site hit it for real — an inbox query filtered on a column that was NULL on one side, and admin support chats appeared to have "disappeared" when they had never been lost at all. The two fixes are <code>WHERE x IS DISTINCT FROM 1</code> or the explicit <code>WHERE x &lt;&gt; 1 OR x IS NULL</code>.',
            'Đã kiểm: A cho <b>1</b>, B cho <b>2</b>. Mọi điều kiện SQL đều cho ra ĐÚNG, SAI hoặc <b>KHÔNG BIẾT</b>, và <code>WHERE</code> chỉ giữ ĐÚNG — nên dòng NULL bị loại y hệt một dòng SAI, nhưng vì một lý do khác. <code>IS DISTINCT FROM</code> là một trong số ít toán tử coi NULL như một giá trị chứ không phải một ẩn số, nên nó giữ dòng đó lại. Lý do bài 4.2 gọi đây là cái bẫy đầu bảng của chương nằm ở hậu quả trên một bản báo cáo: <b>những dòng biến mất chính là những dòng thiếu dữ liệu</b>, mà đó thường lại là nhóm bạn cần nhìn nhất. Chính trang web này đã dính thật — một truy vấn hộp thư lọc trên một cột NULL ở một phía, và các cuộc trò chuyện hỗ trợ của quản trị viên trông như "biến mất" trong khi chưa từng mất đi đâu. Hai cách sửa là <code>WHERE x IS DISTINCT FROM 1</code> hoặc viết rõ <code>WHERE x &lt;&gt; 1 OR x IS NULL</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A seeding job uses this to mean "insert if new". What is the risk that grows over time?' + code(
              'INSERT INTO tag_stat (tag, hits) VALUES ($1, $2)\n' +
              'ON CONFLICT DO NOTHING;',
            ),
            'Một job nạp dữ liệu dùng câu này với ý "chưa có thì chèn". Rủi ro nào lớn dần theo thời gian?' + code(
              'INSERT INTO tag_stat (tag, hits) VALUES ($1, $2)\n' +
              'ON CONFLICT DO NOTHING;',
            ),
          ),
          options: [
            B('It is racy — two concurrent callers can both pass the conflict check and insert the same key twice', 'Nó có tranh chấp — hai lời gọi song song đều có thể vượt qua phép kiểm xung đột và chèn cùng một khoá hai lần'),
            B('It silently rewrites the existing row with the new values, so an old row can be replaced without anyone noticing', 'Nó âm thầm ghi đè dòng đã có bằng giá trị mới, nên một dòng cũ có thể bị thay mà không ai hay biết'),
            B('With no target named it swallows <b>every</b> conflict — a unique index added later, or a real duplicate-key bug — and reports success having written nothing', 'Không nêu tên đích thì nó nuốt <b>mọi</b> xung đột — một unique index thêm về sau, hay một lỗi thật sinh khoá trùng — rồi báo thành công dù chẳng ghi gì'),
            B('It cannot be used inside a transaction, so a partially seeded batch cannot be rolled back', 'Nó không dùng được bên trong một giao dịch, nên một lô nạp dở dang không thể rollback'),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 4.1 is precise about this. <code>ON CONFLICT DO NOTHING</code> with no conflict target catches a violation of <em>any</em> unique constraint on the table, including ones that did not exist when the code was written — so the day someone adds <code>UNIQUE (slug)</code>, rows start being dropped and the insert still reports success. The caller cannot tell the difference between "already there" and "rejected for a reason I did not anticipate". Two fixes, both cheap: <b>name the target</b>, <code>ON CONFLICT (tag) DO NOTHING</code>, so a conflict on any other constraint still raises; and add <code>RETURNING id</code>, because an empty result set is how you detect that the conflict path was taken. Option 1 has it backwards — avoiding the race is the whole reason to use <code>ON CONFLICT</code> instead of check-then-insert, since it is atomic within one statement. Option 2 describes <code>DO UPDATE</code>. Option 4 is simply false.',
            'Bài 4.1 nói rất rõ chỗ này. <code>ON CONFLICT DO NOTHING</code> mà không nêu đích xung đột sẽ bắt vi phạm của <em>bất kỳ</em> ràng buộc duy nhất nào trên bảng, kể cả những ràng buộc chưa tồn tại lúc viết mã — nên hôm nào có người thêm <code>UNIQUE (slug)</code>, các dòng bắt đầu bị bỏ rơi mà lệnh chèn vẫn báo thành công. Người gọi không phân biệt nổi giữa "đã có sẵn" và "bị từ chối vì một lý do tôi không lường". Hai cách sửa, đều rẻ: <b>nêu tên đích</b>, <code>ON CONFLICT (tag) DO NOTHING</code>, để xung đột ở ràng buộc khác vẫn báo lỗi; và thêm <code>RETURNING id</code>, vì một tập kết quả rỗng chính là cách bạn nhận ra nhánh xung đột đã được dùng. Phương án 1 nói ngược — tránh tranh chấp mới là lý do người ta dùng <code>ON CONFLICT</code> thay vì kiểm-rồi-chèn, bởi nó nguyên tử trong một câu lệnh. Phương án 2 mô tả <code>DO UPDATE</code>. Phương án 4 đơn giản là sai.',
          ),
        }),

        mcq({
          prompt: B(
            'A column contains <code>\'a\'</code>, <code>NULL</code> and <code>\'b\'</code>. Where does the NULL land in each sort, with no <code>NULLS</code> clause written?' + code(
              'SELECT x FROM t ORDER BY x;        -- A\n' +
              'SELECT x FROM t ORDER BY x DESC;   -- B',
            ),
            'Một cột chứa <code>\'a\'</code>, <code>NULL</code> và <code>\'b\'</code>. NULL rơi vào đâu trong mỗi phép sắp xếp, khi không viết mệnh đề <code>NULLS</code> nào?' + code(
              'SELECT x FROM t ORDER BY x;        -- A\n' +
              'SELECT x FROM t ORDER BY x DESC;   -- B',
            ),
          ),
          options: [
            B('First in both — NULL is treated as the smallest possible value', 'Đầu tiên ở cả hai — NULL được coi là giá trị nhỏ nhất có thể'),
            B('Last in both — NULL rows are always appended after the real values regardless of direction', 'Cuối cùng ở cả hai — dòng NULL luôn được nối vào sau các giá trị thật, bất kể chiều sắp xếp'),
            B('It is unspecified — NULL ordering depends on the plan, which is why you must always write <code>NULLS LAST</code>', 'Không xác định — thứ tự của NULL phụ thuộc vào plan, và vì thế bạn luôn phải viết <code>NULLS LAST</code>'),
            B('<b>Last</b> in A and <b>first</b> in B — NULL sorts as if it were the largest value, so reversing the direction moves it', '<b>Cuối</b> ở A và <b>đầu</b> ở B — NULL được xếp như thể nó là giá trị lớn nhất, nên đảo chiều là nó đổi chỗ'),
          ],
          correct: 3,
          explanation: EX(
            'Verified on PostgreSQL 16.14: ascending gives <code>a, b, (null)</code> and descending gives <code>(null), b, a</code>. The default is <code>NULLS LAST</code> for <code>ASC</code> and <code>NULLS FIRST</code> for <code>DESC</code>, because NULL sorts as if it were larger than every real value — so the position is not fixed, it follows the direction. That is what makes option 2 such an easy mistake: it is right for the ascending case people usually test, and wrong for the descending sort a "newest first" feed actually uses, which quietly puts every un-dated row at the top of page one. Option 3 confuses this with the genuinely unspecified case, which is row order when there is <em>no</em> <code>ORDER BY</code> at all. Write <code>NULLS LAST</code> explicitly whenever it matters, and remember the related rule from 4.3: always end a paginated sort with a unique column, <code>ORDER BY created_at DESC, id DESC</code>, or page 2 can repeat a row page 1 already showed.',
            'Đã kiểm trên PostgreSQL 16.14: tăng dần cho <code>a, b, (null)</code>, còn giảm dần cho <code>(null), b, a</code>. Mặc định là <code>NULLS LAST</code> với <code>ASC</code> và <code>NULLS FIRST</code> với <code>DESC</code>, vì NULL được xếp như thể nó lớn hơn mọi giá trị thật — nên vị trí của nó không cố định mà đi theo chiều sắp xếp. Chính điều đó khiến phương án 2 là một lỗi rất dễ mắc: nó đúng với ca tăng dần mà người ta hay thử, và sai với phép sắp giảm dần mà một bảng tin "mới nhất trước" thật sự dùng, đẩy mọi dòng chưa có ngày lên đầu trang một một cách lặng lẽ. Phương án 3 nhầm chuyện này với ca thật sự không xác định, tức là thứ tự dòng khi <em>không có</em> <code>ORDER BY</code> nào cả. Hãy viết <code>NULLS LAST</code> tường minh mỗi khi nó quan trọng, và nhớ quy tắc anh em ở bài 4.3: luôn kết thúc phép sắp xếp phân trang bằng một cột duy nhất, <code>ORDER BY created_at DESC, id DESC</code>, kẻo trang 2 lặp lại một dòng mà trang 1 đã hiện.',
          ),
        }),

        // ── Chương 5 — JOIN ─────────────────────────────────────────────
        mcq({
          prompt: B(
            'Both were run on the same data on PostgreSQL 16. A returned <b>4</b> rows, B returned <b>6</b>. Why?' + code(
              'SELECT u.name, n.title FROM app_user u\n' +
              "LEFT JOIN note n ON n.user_id = u.id WHERE n.tag = 'sql';    -- A → 4\n" +
              '\n' +
              'SELECT u.name, n.title FROM app_user u\n' +
              "LEFT JOIN note n ON n.user_id = u.id AND n.tag = 'sql';      -- B → 6",
            ),
            'Cả hai chạy trên cùng dữ liệu, trên PostgreSQL 16. A trả về <b>4</b> dòng, B trả về <b>6</b>. Vì sao?' + code(
              'SELECT u.name, n.title FROM app_user u\n' +
              "LEFT JOIN note n ON n.user_id = u.id WHERE n.tag = 'sql';    -- A → 4\n" +
              '\n' +
              'SELECT u.name, n.title FROM app_user u\n' +
              "LEFT JOIN note n ON n.user_id = u.id AND n.tag = 'sql';      -- B → 6",
            ),
          ),
          options: [
            B('B is wrong — putting a filter in <code>ON</code> disables the join condition, so B is really a CROSS JOIN limited by the tag', 'B mới sai — đặt điều kiện lọc vào <code>ON</code> làm vô hiệu điều kiện join, nên B thực chất là một CROSS JOIN bị giới hạn bởi tag'),
            B('In A the padding rows have <code>n.tag = NULL</code>, and <code>NULL = \'sql\'</code> is never true, so <code>WHERE</code> discards them — A is silently an INNER JOIN', 'Ở A các dòng đệm có <code>n.tag = NULL</code>, mà <code>NULL = \'sql\'</code> không bao giờ đúng, nên <code>WHERE</code> vứt chúng đi — A âm thầm biến thành INNER JOIN'),
            B('A ran first and PostgreSQL cached the smaller result, so B saw rows A had already consumed', 'A chạy trước và PostgreSQL đã cache tập kết quả nhỏ hơn, nên B nhìn thấy cả những dòng A đã dùng'),
            B('The two are equivalent; the difference is that B also emits one extra row per user as the LEFT JOIN sentinel', 'Hai câu là tương đương; khác biệt chỉ là B còn phát thêm một dòng mỗi user làm dòng đánh dấu của LEFT JOIN'),
          ],
          correct: 1,
          explanation: EX(
            'Measured: 4 rows versus 6. A <code>LEFT JOIN</code> keeps every left row, NULL-padding the right columns when nothing matched. Those padding rows carry <code>n.tag = NULL</code>, and the <code>WHERE</code> clause runs <em>after</em> the join, so <code>NULL = \'sql\'</code> evaluates to unknown and the row is discarded — the preserved rows are thrown away again and the LEFT JOIN silently degrades into an INNER JOIN. Nothing errors, which is what makes it lesson 5.4\'s headline trap. The mechanical rule is worth memorising: on an OUTER JOIN, a condition that <b>defines the match</b> goes in <code>ON</code>; a condition that <b>filters the final result</b> goes in <code>WHERE</code>. Equivalently: filter the preserved side in <code>WHERE</code>, filter the optional side in <code>ON</code>. Option 1 inverts the rule; option 3 invents a cache that does not exist; option 4 invents a sentinel row.',
            'Đo thật: 4 dòng so với 6. <code>LEFT JOIN</code> giữ lại mọi dòng bên trái, đệm NULL vào các cột bên phải khi không có gì khớp. Những dòng đệm ấy mang <code>n.tag = NULL</code>, mà mệnh đề <code>WHERE</code> chạy <em>sau</em> phép join, nên <code>NULL = \'sql\'</code> cho ra không-biết và dòng bị vứt đi — những dòng vừa được giữ lại bị ném đi lần nữa và LEFT JOIN âm thầm thoái hoá thành INNER JOIN. Không có lỗi nào, và chính vì thế nó là cái bẫy đầu bảng của bài 5.4. Quy tắc máy móc đáng thuộc lòng: trong một OUTER JOIN, điều kiện <b>định nghĩa phép khớp</b> đặt ở <code>ON</code>; điều kiện <b>lọc kết quả cuối</b> đặt ở <code>WHERE</code>. Nói cách khác: lọc phía được giữ thì để <code>WHERE</code>, lọc phía tuỳ chọn thì để <code>ON</code>. Phương án 1 đảo ngược quy tắc; phương án 3 bịa ra một cơ chế cache không tồn tại; phương án 4 bịa ra một dòng đánh dấu.',
          ),
        }),

        mcq({
          prompt: B(
            'An orders report joins <code>orders</code> to <code>order_item</code> and computes both totals in one query. Which statement is true?' + code(
              'SELECT count(*)         AS n_orders,\n' +
              '       sum(o.total)     AS revenue,\n' +
              '       sum(i.line_total) AS items_value\n' +
              'FROM orders o JOIN order_item i ON i.order_id = o.id;',
            ),
            'Một báo cáo đơn hàng join <code>orders</code> với <code>order_item</code> và tính cả hai con số trong một truy vấn. Phát biểu nào đúng?' + code(
              'SELECT count(*)         AS n_orders,\n' +
              '       sum(o.total)     AS revenue,\n' +
              '       sum(i.line_total) AS items_value\n' +
              'FROM orders o JOIN order_item i ON i.order_id = o.id;',
            ),
          ),
          options: [
            B('Both sums are wrong, because joining always multiplies both sides of the relationship equally', 'Cả hai tổng đều sai, vì phép join luôn nhân đôi cả hai phía của mối quan hệ như nhau'),
            B('Both sums are correct; only <code>count(*)</code> is affected, and wrapping it in <code>count(DISTINCT o.id)</code> fixes the whole query', 'Cả hai tổng đều đúng; chỉ <code>count(*)</code> bị ảnh hưởng, và bọc nó thành <code>count(DISTINCT o.id)</code> là sửa xong cả truy vấn'),
            B('Neither sum can be trusted until an <code>ORDER BY</code> makes the row order deterministic', 'Không tổng nào đáng tin cho tới khi có <code>ORDER BY</code> làm thứ tự dòng trở nên xác định'),
            B('<code>sum(i.line_total)</code> is correct and <code>sum(o.total)</code> is inflated — the join multiplied the "one" side, so each order total is added once per item', '<code>sum(i.line_total)</code> đúng còn <code>sum(o.total)</code> bị thổi phồng — phép join đã nhân bản phía "một", nên mỗi tổng đơn hàng bị cộng một lần cho mỗi mặt hàng'),
          ],
          correct: 3,
          explanation: EX(
            'This is fan-out, and the sharp part is that the two aggregates are not equally wrong. Joining across a one-to-many relationship multiplies the "one" side: an order with four items appears four times, so <code>sum(o.total)</code> is too large by exactly the item count, while <code>sum(i.line_total)</code> is at the item grain already and is correct. Lessons 5.4 and 6.4 both stress that the join is not the mistake — the aggregate was applied at the wrong grain. Option 2 contains the more dangerous half-truth: <code>count(DISTINCT o.id)</code> does give the right order count, and precisely because it looks fixed it leaves the inflated <code>SUM</code> sitting beside it unnoticed. Treat a <code>DISTINCT</code> you needed as a signal the grain is wrong, not as the repair. The honest fix is to <b>aggregate the many side first</b> in a CTE and join to that single row per order (7.3). Fastest diagnosis: delete the aggregates, run the bare join, and count the rows.',
            'Đây là fan-out, và chỗ sắc bén là hai hàm tổng hợp không sai như nhau. Join qua một quan hệ một-nhiều sẽ nhân bản phía "một": một đơn có bốn mặt hàng sẽ xuất hiện bốn lần, nên <code>sum(o.total)</code> lớn hơn thực tế đúng bằng số mặt hàng, trong khi <code>sum(i.line_total)</code> vốn đã ở grain mặt hàng nên đúng. Cả bài 5.4 lẫn 6.4 đều nhấn: phép join không phải cái sai — hàm tổng hợp bị áp ở sai grain. Phương án 2 chứa nửa-sự-thật nguy hiểm hơn: <code>count(DISTINCT o.id)</code> đúng là cho ra số đơn chính xác, và chính vì trông như đã sửa xong nên nó để cái <code>SUM</code> bị thổi phồng nằm ngay bên cạnh mà không ai để ý. Hãy coi một chữ <code>DISTINCT</code> mà bạn buộc phải dùng là tín hiệu grain đang sai, chứ không phải là cách chữa. Cách sửa thật là <b>tổng hợp phía "nhiều" trước</b> trong một CTE rồi join tới đúng một dòng mỗi đơn (bài 7.3). Cách chẩn đoán nhanh nhất: bỏ hết hàm tổng hợp, chạy phép join trần, rồi đếm số dòng.',
          ),
        }),

        mcq({
          prompt: B(
            'A query joins six small, well-indexed tables and a colleague wants to denormalize into one wide table "because six joins must be slow". What does the course measure?',
            'Một truy vấn join sáu bảng nhỏ đã đánh chỉ mục tốt, và một đồng nghiệp muốn gộp thành một bảng rộng "vì sáu phép join thì chắc chắn chậm". Khoá học đo được gì?',
          ),
          options: [
            B('The opposite is usually true — six indexed joins routinely beat one wide scan, because each join reads only the rows the previous step needs. What genuinely costs is <b>one</b> join with no usable index on its key', 'Thường thì ngược lại — sáu phép join có chỉ mục thường thắng một lần quét bảng rộng, vì mỗi phép join chỉ đọc đúng những dòng bước trước cần. Thứ thật sự tốn kém là <b>một</b> phép join không có chỉ mục dùng được trên khoá của nó'),
            B('Joins cost roughly linearly, so six joins are about six times slower than one — denormalizing is the right call above four tables', 'Chi phí join tăng gần như tuyến tính, nên sáu phép join chậm gấp khoảng sáu lần một phép — trên bốn bảng thì gộp bảng là lựa chọn đúng'),
            B('Join count is irrelevant because PostgreSQL rewrites every multi-table query into a single scan of a temporary wide table', 'Số phép join không quan trọng vì PostgreSQL viết lại mọi truy vấn nhiều bảng thành một lần quét trên một bảng rộng tạm'),
            B('Six joins are fine but only up to the planner\'s limit, after which it gives up optimising and executes them in written order', 'Sáu phép join thì ổn nhưng chỉ tới giới hạn của bộ lập kế hoạch, quá đó nó bỏ tối ưu và thực thi theo đúng thứ tự viết ra'),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 5.3 states it as a rule: <b>count missing indexes, not joins</b>. A join to an indexed key is a handful of page reads; a wide denormalized table replaces that with reading rows you did not need, and it also reintroduces the update anomaly from 3.4 — one fact stored in many places drifts the first time someone renames it. The number the course quotes is from chapter 9: an index turned a single join from 28.6 ms into 0.129 ms, and that one join can dominate a query containing ten good ones. Option 4 gestures at something real but gets it wrong — <code>join_collapse_limit</code> and <code>geqo_threshold</code> change the <em>search strategy</em> for very large join counts, not the correctness of the plan, and they sit far above six. The practical takeaway: before denormalizing, run <code>EXPLAIN</code> and look for the join whose inner side is a sequential scan.',
            'Bài 5.3 phát biểu thành quy tắc: <b>hãy đếm chỉ mục còn thiếu, đừng đếm phép join</b>. Một phép join vào khoá đã có chỉ mục chỉ tốn vài lần đọc trang; một bảng rộng đã gộp thì thay việc đó bằng việc đọc cả những dòng bạn không cần, đồng thời làm sống lại bất thường cập nhật ở bài 3.4 — một sự thật cất ở nhiều nơi sẽ lệch ngay lần đầu có người đổi tên. Con số khoá học dẫn ra là từ chương 9: một chỉ mục biến một phép join từ 28,6 ms thành 0,129 ms, và đúng một phép join như thế đủ sức áp đảo cả truy vấn có mười phép join tốt. Phương án 4 chạm vào một thứ có thật nhưng nói sai — <code>join_collapse_limit</code> và <code>geqo_threshold</code> đổi <em>chiến lược tìm kiếm</em> khi số bảng join rất lớn, chứ không đổi tính đúng đắn của plan, và ngưỡng của chúng nằm cao hơn sáu rất nhiều. Rút ra thực tế: trước khi gộp bảng, hãy chạy <code>EXPLAIN</code> và tìm phép join nào có phía trong là một lần quét tuần tự.',
          ),
        }),

        // ── Chương 6 — Tổng hợp & gom nhóm ──────────────────────────────
        mcq({
          prompt: B(
            'A table has <b>7</b> rows; the <code>views</code> column is NULL on one of them and the six real values sum to 357. Run on PostgreSQL 16, what does this return?' + code(
              'SELECT count(*)     AS c_star,\n' +
              '       count(views) AS c_views,\n' +
              '       sum(views)   AS total,\n' +
              '       round(avg(views), 1) AS mean\n' +
              'FROM note;',
            ),
            'Một bảng có <b>7</b> dòng; cột <code>views</code> là NULL ở một dòng và sáu giá trị thật cộng lại bằng 357. Chạy trên PostgreSQL 16, câu này trả về gì?' + code(
              'SELECT count(*)     AS c_star,\n' +
              '       count(views) AS c_views,\n' +
              '       sum(views)   AS total,\n' +
              '       round(avg(views), 1) AS mean\n' +
              'FROM note;',
            ),
          ),
          options: [
            B('<code>7 | 7 | 357 | 51.0</code> — <code>count(views)</code> counts rows just like <code>count(*)</code>, and NULL is averaged in as zero', '<code>7 | 7 | 357 | 51.0</code> — <code>count(views)</code> đếm dòng y như <code>count(*)</code>, và NULL được coi là 0 khi tính trung bình'),
            B('<code>7 | 6 | 357 | 51.0</code> — the count skips the NULL but the average still divides by the row count', '<code>7 | 6 | 357 | 51.0</code> — phép đếm bỏ qua NULL nhưng trung bình vẫn chia cho số dòng'),
            B('<code>7 | 6 | 357 | 59.5</code> — <code>count(*)</code> counts rows; every other aggregate skips NULLs, so the mean is 357 ÷ <b>6</b>', '<code>7 | 6 | 357 | 59.5</code> — <code>count(*)</code> đếm dòng; mọi hàm tổng hợp khác bỏ qua NULL, nên trung bình là 357 ÷ <b>6</b>'),
            B('<code>6 | 6 | 357 | 59.5</code> — a row with a NULL in an aggregated column is excluded from the whole result', '<code>6 | 6 | 357 | 59.5</code> — một dòng có NULL ở cột được tổng hợp sẽ bị loại khỏi toàn bộ kết quả'),
          ],
          correct: 2,
          explanation: EX(
            'Verified on PostgreSQL 16.14: <code>7 | 6 | 357 | 59.5</code>. The whole rule fits in one line worth memorising — <b><code>count(*)</code> counts rows; every other aggregate skips NULLs</b>. So the denominator of the average is 6, not 7. This is correct SQL and, read carelessly, wrong business analysis: a product with 100 orders and 30 missing ratings reports <code>AVG(rating)</code> over 70 rows, and on a column that is 40% NULL, <code>COUNT(col)</code> returns 60% of the row count. If missing genuinely means zero, write <code>avg(coalesce(views, 0))</code>; otherwise keep the average honest and display <code>count(views)</code> beside it so the reader can see the denominator. One asymmetry to carry with it: on <b>zero</b> rows <code>COUNT</code> returns 0 while every other aggregate returns NULL, which is why <code>COALESCE(SUM(x), 0)</code> is such a common wrapper.',
            'Đã kiểm trên PostgreSQL 16.14: <code>7 | 6 | 357 | 59.5</code>. Cả quy tắc gói gọn trong một câu đáng thuộc — <b><code>count(*)</code> đếm DÒNG; mọi hàm tổng hợp khác BỎ QUA NULL</b>. Nên mẫu số của phép trung bình là 6, không phải 7. Đây là SQL đúng nhưng nếu đọc ẩu thì là phân tích kinh doanh sai: một sản phẩm có 100 đơn và 30 đơn thiếu đánh giá sẽ báo <code>AVG(rating)</code> trên 70 dòng, và trên một cột NULL tới 40% thì <code>COUNT(col)</code> trả về 60% số dòng. Nếu "thiếu" thật sự nghĩa là 0 thì viết <code>avg(coalesce(views, 0))</code>; còn không thì giữ trung bình cho trung thực và hiện <code>count(views)</code> ngay bên cạnh để người đọc thấy mẫu số. Một điểm bất đối xứng nên mang theo: trên <b>không</b> dòng nào, <code>COUNT</code> trả về 0 còn mọi hàm tổng hợp khác trả về NULL — và đó là lý do <code>COALESCE(SUM(x), 0)</code> hay được dùng bọc ngoài đến thế.',
          ),
        }),

        mcq({
          prompt: B(
            'This produced <code>ERROR: aggregate functions are not allowed in WHERE</code> on PostgreSQL 16. What is the real reason?' + code(
              'SELECT tag FROM note WHERE count(*) > 1 GROUP BY tag;',
            ),
            'Câu này cho ra <code>ERROR: aggregate functions are not allowed in WHERE</code> trên PostgreSQL 16. Lý do thật là gì?' + code(
              'SELECT tag FROM note WHERE count(*) > 1 GROUP BY tag;',
            ),
          ),
          options: [
            B('A permission issue — <code>count()</code> is a set-returning function and needs an explicit cast before it can be used as a scalar', 'Vấn đề quyền — <code>count()</code> là hàm trả về tập hợp và cần một phép ép kiểu tường minh trước khi dùng như giá trị vô hướng'),
            B('It is <b>order</b>, not permission: <code>WHERE</code> runs before <code>GROUP BY</code>, so at that point no groups and therefore no counts exist yet — that is what <code>HAVING</code> is for', 'Đó là chuyện <b>thứ tự</b>, không phải quyền: <code>WHERE</code> chạy trước <code>GROUP BY</code>, nên lúc ấy chưa có nhóm nào và do đó chưa có phép đếm nào — và đó chính là việc của <code>HAVING</code>'),
            B('The <code>GROUP BY</code> is written after the <code>WHERE</code>; moving it before the <code>WHERE</code> in the text makes the query legal', '<code>GROUP BY</code> đang viết sau <code>WHERE</code>; chuyển nó lên trước <code>WHERE</code> trong văn bản là câu truy vấn hợp lệ'),
            B('<code>count(*)</code> may only appear in the select list, never in any filtering clause — including <code>HAVING</code>', '<code>count(*)</code> chỉ được xuất hiện trong danh sách select, không bao giờ trong mệnh đề lọc nào — kể cả <code>HAVING</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Reproduced verbatim. The message sends people the wrong way because it sounds like a rule about permission, when it is a consequence of the execution order lesson 6.3 insists on: <code>FROM</code> / <code>JOIN</code> → <code>WHERE</code> → <code>GROUP BY</code> → <code>HAVING</code> → <code>SELECT</code> → <code>ORDER BY</code> / <code>LIMIT</code>. <code>WHERE</code> filters individual rows before any grouping has happened, so there is nothing to count yet; <code>HAVING</code> filters whole groups after grouping, so it can see aggregates. Option 3 misses the point that <em>written</em> order and <em>executed</em> order are different things. Option 4 is wrong about <code>HAVING</code>, which is exactly where an aggregate filter belongs. The practical pairing is worth keeping: using both is not redundant, it is the efficient form — <code>WHERE created_at &gt;= \'2026-01-01\' … HAVING count(*) &gt; 5</code> removes rows before grouping, which is cheaper than grouping them and discarding the groups afterwards.',
            'Đã tái hiện nguyên văn. Thông báo này đẩy người ta đi sai hướng vì nghe như một quy tắc về quyền, trong khi nó là hệ quả của thứ tự thực thi mà bài 6.3 nhấn mạnh: <code>FROM</code> / <code>JOIN</code> → <code>WHERE</code> → <code>GROUP BY</code> → <code>HAVING</code> → <code>SELECT</code> → <code>ORDER BY</code> / <code>LIMIT</code>. <code>WHERE</code> lọc từng dòng riêng lẻ trước khi có bất kỳ phép gom nhóm nào, nên chưa có gì để đếm; <code>HAVING</code> lọc cả nhóm sau khi đã gom, nên nó nhìn thấy hàm tổng hợp. Phương án 3 bỏ qua chuyện thứ tự <em>viết ra</em> và thứ tự <em>thực thi</em> là hai thứ khác nhau. Phương án 4 nói sai về <code>HAVING</code>, vốn đúng là chỗ dành cho một phép lọc trên hàm tổng hợp. Cặp đôi thực dụng đáng nhớ: dùng cả hai không thừa mà là dạng hiệu quả — <code>WHERE created_at &gt;= \'2026-01-01\' … HAVING count(*) &gt; 5</code> loại bớt dòng trước khi gom nhóm, rẻ hơn là gom rồi mới vứt cả nhóm đi.',
          ),
        }),

        mcq({
          prompt: B(
            'Ngoc is a user with no notes at all. This query reports <code>notes = 1</code> for her. What is wrong?' + code(
              'SELECT u.name, count(*) AS notes\n' +
              'FROM app_user u LEFT JOIN note n ON n.user_id = u.id\n' +
              'GROUP BY u.name;',
            ),
            'Ngoc là một người dùng không có ghi chú nào. Truy vấn này báo <code>notes = 1</code> cho cô ấy. Sai ở đâu?' + code(
              'SELECT u.name, count(*) AS notes\n' +
              'FROM app_user u LEFT JOIN note n ON n.user_id = u.id\n' +
              'GROUP BY u.name;',
            ),
          ),
          options: [
            B('The <code>GROUP BY</code> should use <code>u.id</code>; grouping by a non-unique name merges users and inflates the count', 'Phải <code>GROUP BY u.id</code>; gom nhóm theo tên không duy nhất sẽ trộn các user lại và thổi phồng phép đếm'),
            B('The join should be an INNER JOIN — a LEFT JOIN is only correct when you do not aggregate afterwards', 'Phép join phải là INNER JOIN — LEFT JOIN chỉ đúng khi bạn không tổng hợp sau đó'),
            B('Nothing is wrong; a user with no notes genuinely has one empty note created by the outer join', 'Không sai gì cả; một user không có ghi chú thì thật sự có một ghi chú rỗng do outer join tạo ra'),
            B('<code>count(*)</code> counts the NULL-padded placeholder row as 1 — after a LEFT JOIN you must count a real child column, <code>count(n.id)</code>', '<code>count(*)</code> đếm cả dòng đệm NULL thành 1 — sau một LEFT JOIN bạn phải đếm một cột con thật, tức <code>count(n.id)</code>'),
          ],
          correct: 3,
          explanation: EX(
            'The LEFT JOIN produces one row for Ngoc with every <code>note</code> column NULL. <code>count(*)</code> counts <em>rows</em>, and that placeholder is a row, so she scores 1; <code>count(n.id)</code> counts non-NULL values and correctly scores 0. This is the same NULL rule as question 18, but with a twist that makes it harder to spot: <b>the NULL was created by the join, not by the data</b>, so it is invisible in the source table. Getting it wrong turns "users with no notes" into "users with one note" — a segment that then silently disappears from every follow-up query that filters on <code>notes = 0</code>. Option 2 is the fix that destroys the requirement: switching to INNER JOIN drops Ngoc entirely, which is the other half of lesson 6.4\'s warning about a number that is both inflated and missing rows. Option 1 describes a real hazard in general, but it is not what produced this 1.',
            'Phép LEFT JOIN sinh ra một dòng cho Ngoc với mọi cột của <code>note</code> đều NULL. <code>count(*)</code> đếm <em>dòng</em>, mà dòng đệm đó vẫn là một dòng, nên cô ấy được 1; <code>count(n.id)</code> đếm giá trị khác NULL và cho ra 0 một cách chính xác. Vẫn là quy tắc NULL của câu 18, nhưng có một khúc quanh khiến nó khó thấy hơn: <b>cái NULL này do phép join tạo ra, không phải do dữ liệu</b>, nên nó vô hình trong bảng gốc. Làm sai chỗ này biến "những user không có ghi chú" thành "những user có một ghi chú" — và nhóm đó sau đó lặng lẽ biến mất khỏi mọi truy vấn lọc theo <code>notes = 0</code>. Phương án 2 là cách sửa phá luôn yêu cầu: đổi sang INNER JOIN thì Ngoc mất hẳn, đúng nửa còn lại trong lời cảnh báo của bài 6.4 về một con số vừa bị thổi phồng vừa thiếu dòng. Phương án 1 mô tả một mối nguy có thật nói chung, nhưng nó không phải thứ đẻ ra con số 1 ở đây.',
          ),
        }),

        // ── Chương 7 — Truy vấn con & CTE ───────────────────────────────
        mcq({
          prompt: B(
            'Ngoc plainly has no notes, and <code>note.user_id</code> is NULL on one row. Run on PostgreSQL 16, A returned <b>0</b> rows and B returned <b>1</b>. Why?' + code(
              'SELECT u.name FROM app_user u\n' +
              'WHERE u.id NOT IN (SELECT user_id FROM note);                        -- A → 0\n' +
              '\n' +
              'SELECT u.name FROM app_user u\n' +
              'WHERE NOT EXISTS (SELECT 1 FROM note n WHERE n.user_id = u.id);      -- B → 1',
            ),
            'Ngoc rõ ràng không có ghi chú nào, và <code>note.user_id</code> là NULL ở một dòng. Chạy trên PostgreSQL 16, A trả về <b>0</b> dòng còn B trả về <b>1</b>. Vì sao?' + code(
              'SELECT u.name FROM app_user u\n' +
              'WHERE u.id NOT IN (SELECT user_id FROM note);                        -- A → 0\n' +
              '\n' +
              'SELECT u.name FROM app_user u\n' +
              'WHERE NOT EXISTS (SELECT 1 FROM note n WHERE n.user_id = u.id);      -- B → 1',
            ),
          ),
          options: [
            B('The subquery list contains a NULL, so <code>4 NOT IN (1,2,3,NULL)</code> asks "is 4 different from all of these" and <code>4 &lt;&gt; NULL</code> is unknown — the condition is never true for anyone', 'Danh sách của truy vấn con có một NULL, nên <code>4 NOT IN (1,2,3,NULL)</code> hỏi "4 có khác tất cả những cái này không" mà <code>4 &lt;&gt; NULL</code> là không biết — điều kiện không bao giờ đúng với bất kỳ ai'),
            B('<code>NOT IN</code> requires the subquery to be correlated; without a reference to the outer row it returns the empty set', '<code>NOT IN</code> đòi truy vấn con phải tương quan; không có tham chiếu tới dòng ngoài thì nó trả về tập rỗng'),
            B('<code>NOT EXISTS</code> found an extra row that <code>NOT IN</code> is right to exclude — B is the query with the bug', '<code>NOT EXISTS</code> đã tìm thấy một dòng thừa mà <code>NOT IN</code> loại bỏ là đúng — B mới là truy vấn có lỗi'),
            B('<code>NOT IN</code> deduplicates its list, and after deduplication Ngoc\'s id collides with the NULL entry', '<code>NOT IN</code> loại trùng trong danh sách của nó, và sau khi loại trùng thì id của Ngoc va vào mục NULL'),
          ],
          correct: 0,
          explanation: EX(
            'Verified: 0 rows versus 1. <code>x NOT IN (a, b, c)</code> expands to <code>x &lt;&gt; a AND x &lt;&gt; b AND x &lt;&gt; c</code>. One NULL in that list makes one conjunct UNKNOWN, and <code>TRUE AND UNKNOWN</code> is UNKNOWN — never TRUE — so the whole predicate can never be satisfied and the result set is empty for <em>every</em> row, not just the affected one. Lesson 7.2 calls this one of the few SQL bugs that turns a working report into an empty one overnight, because it only appears the day the first NULL lands in that column. <b><code>NOT EXISTS</code> is the safe default</b>: it asks whether a matching row came back, which is a plain yes/no with no three-valued logic involved, and it is usually as fast or faster. If you must keep <code>NOT IN</code>, add <code>WHERE user_id IS NOT NULL</code> <em>inside</em> the subquery. Note the mirror-image rule from the same lesson: use <code>EXISTS</code> for yes/no and a count only when you want the number — <code>(SELECT count(*) …) &gt; 0</code> on a user with 40,000 notes reads all 40,000 rows to answer what the first one already settled.',
            'Đã kiểm: 0 dòng so với 1. <code>x NOT IN (a, b, c)</code> khai triển thành <code>x &lt;&gt; a AND x &lt;&gt; b AND x &lt;&gt; c</code>. Một NULL trong danh sách làm một vế thành KHÔNG BIẾT, mà <code>ĐÚNG AND KHÔNG BIẾT</code> là KHÔNG BIẾT — chứ không bao giờ ĐÚNG — nên cả vị từ không thể thoả với <em>mọi</em> dòng, chứ không riêng dòng bị ảnh hưởng. Bài 7.2 gọi đây là một trong số ít lỗi SQL biến một báo cáo đang chạy tốt thành rỗng chỉ sau một đêm, vì nó chỉ hiện ra vào ngày cái NULL đầu tiên rơi vào cột đó. <b><code>NOT EXISTS</code> mới là mặc định an toàn</b>: nó hỏi có dòng nào khớp trả về hay không, một câu có/không thuần tuý không dính logic ba giá trị, và thường nhanh bằng hoặc nhanh hơn. Nếu buộc phải giữ <code>NOT IN</code> thì thêm <code>WHERE user_id IS NOT NULL</code> <em>bên trong</em> truy vấn con. Nhớ luôn quy tắc soi gương cùng bài: dùng <code>EXISTS</code> cho câu hỏi có/không và chỉ dùng đếm khi bạn cần con số — <code>(SELECT count(*) …) &gt; 0</code> trên một người có 40.000 ghi chú sẽ đọc đủ 40.000 dòng để trả lời điều mà dòng đầu tiên đã giải quyết xong.',
          ),
        }),

        mcq({
          prompt: B(
            'A colleague says "wrap it in a CTE, that will make it faster". On PostgreSQL 16, what is true?',
            'Một đồng nghiệp bảo "bọc vào CTE đi, sẽ nhanh hơn". Trên PostgreSQL 16, điều gì đúng?',
          ),
          options: [
            B('True — a CTE is computed once and reused, so it always beats repeating a subquery', 'Đúng — một CTE được tính một lần rồi dùng lại, nên nó luôn thắng việc lặp lại một truy vấn con'),
            B('True since PostgreSQL 12 — CTEs became an optimisation fence in that release, which lets the planner skip work', 'Đúng kể từ PostgreSQL 12 — CTE trở thành hàng rào tối ưu từ bản đó, cho phép bộ lập kế hoạch bỏ bớt việc'),
            B('A CTE is a <b>naming device, not an optimisation</b>: since PostgreSQL 12 it is inlined when it can be, giving the same plan as the equivalent subquery — and forcing <code>MATERIALIZED</code> can make it genuinely slower', 'CTE là <b>công cụ đặt tên, không phải công cụ tối ưu</b>: từ PostgreSQL 12 nó được nội tuyến khi có thể, cho ra đúng plan như truy vấn con tương đương — và ép <code>MATERIALIZED</code> có thể làm nó chậm đi thật'),
            B('False in the other direction — a CTE is always materialized, so it is always slower and should be avoided in production code', 'Sai theo chiều ngược lại — CTE luôn bị materialize nên luôn chậm hơn và cần tránh trong mã production'),
          ],
          correct: 2,
          explanation: EX(
            'The version detail is what makes this worth asking. <b>Before PostgreSQL 12 every CTE was materialized</b> — an optimisation fence the planner could not push a filter through — so advice written before 2019 says the opposite of what is true today. From 12 onward the planner inlines a CTE when it safely can, and <code>MATERIALIZED</code> / <code>NOT MATERIALIZED</code> let you override. Forcing materialization is the case that can genuinely cost you: if the CTE selects a million rows and the outer query keeps ten, you pay for 999,990 discarded rows. So options 1, 2 and 4 are each a different snapshot of outdated or inverted advice. The two <em>real</em> reasons to reach for a CTE are both in lesson 7.3: <b>readability</b>, naming each step, and <b>correctness</b> — pre-aggregating the one-to-many side before joining, which is the definitive fix for the fan-out of question 16. A CTE can also be referenced several times in the main query, where a derived table in <code>FROM</code> would have to be repeated and the copies would drift.',
            'Chi tiết về phiên bản mới là thứ khiến câu này đáng hỏi. <b>Trước PostgreSQL 12, mọi CTE đều bị materialize</b> — một hàng rào tối ưu mà bộ lập kế hoạch không đẩy điều kiện lọc qua được — nên lời khuyên viết trước 2019 nói ngược hẳn với sự thật hôm nay. Từ bản 12 trở đi, bộ lập kế hoạch nội tuyến CTE khi làm vậy an toàn, và <code>MATERIALIZED</code> / <code>NOT MATERIALIZED</code> cho bạn tự quyết. Ép materialize mới là ca thật sự tốn kém: nếu CTE lấy một triệu dòng mà truy vấn ngoài chỉ giữ mười, bạn trả tiền cho 999.990 dòng bị vứt đi. Vậy nên phương án 1, 2 và 4 mỗi cái là một lát cắt của lời khuyên đã lỗi thời hoặc bị đảo ngược. Hai lý do <em>thật</em> để dùng CTE đều nằm ở bài 7.3: <b>dễ đọc</b>, đặt tên cho từng bước, và <b>đúng đắn</b> — tổng hợp phía một-nhiều trước khi join, tức cách sửa dứt điểm cho fan-out ở câu 16. CTE còn có thể được tham chiếu nhiều lần trong truy vấn chính, trong khi một bảng dẫn xuất trong <code>FROM</code> thì phải chép lại và các bản chép sẽ lệch nhau.',
          ),
        }),

        mcq({
          prompt: B(
            'This ran for ever on a category table where a bad import made node 7 its own descendant. Which change is the <b>whole</b> fix?' + code(
              'WITH RECURSIVE tree AS (\n' +
              '  SELECT id, name FROM category WHERE id = 7\n' +
              '  UNION ALL\n' +
              '  SELECT c.id, c.name FROM category c JOIN tree t ON c.parent_id = t.id\n' +
              ')\n' +
              'SELECT count(*) FROM tree;',
            ),
            'Câu này chạy mãi không dứt trên một bảng danh mục mà một lần nhập dữ liệu hỏng đã khiến nút 7 thành hậu duệ của chính nó. Thay đổi nào là cách sửa <b>trọn vẹn</b>?' + code(
              'WITH RECURSIVE tree AS (\n' +
              '  SELECT id, name FROM category WHERE id = 7\n' +
              '  UNION ALL\n' +
              '  SELECT c.id, c.name FROM category c JOIN tree t ON c.parent_id = t.id\n' +
              ')\n' +
              'SELECT count(*) FROM tree;',
            ),
          ),
          options: [
            B('Replace <code>UNION ALL</code> with plain <code>UNION</code> — deduplicating on every pass removes the repeated rows and the recursion terminates', 'Đổi <code>UNION ALL</code> thành <code>UNION</code> trần — loại trùng ở mỗi lượt sẽ bỏ các dòng lặp và phép đệ quy dừng lại'),
            B('Carry the visited ids in an array and add <code>NOT (c.id = ANY(t.seen))</code>, <b>plus</b> a depth column with <code>WHERE depth &lt; 100</code> — the course says use both', 'Mang theo mảng các id đã thăm rồi thêm <code>NOT (c.id = ANY(t.seen))</code>, <b>cộng thêm</b> một cột độ sâu với <code>WHERE depth &lt; 100</code> — khoá học bảo dùng cả hai'),
            B('Add <code>LIMIT 1000</code> to the outer <code>SELECT</code>; the recursion stops as soon as the limit is satisfied', 'Thêm <code>LIMIT 1000</code> vào <code>SELECT</code> ngoài; phép đệ quy dừng ngay khi đủ số dòng của giới hạn'),
            B('Nothing is needed — a recursive CTE has a built-in recursion limit and errors out safely after the default number of passes', 'Không cần gì cả — CTE đệ quy có sẵn giới hạn đệ quy và sẽ báo lỗi an toàn sau số lượt mặc định'),
          ],
          correct: 1,
          explanation: EX(
            'Measured: with a cycle in the data and no guard, the query was still running when a 4-second <code>statement_timeout</code> cancelled it; the same query with an array guard and a depth cap returned immediately. Option 4 is the belief that lets this reach production — there is <b>no</b> built-in limit. A recursive CTE ends only when the recursive term produces zero rows, which a cycle guarantees never happens, so it consumes memory until the connection dies: it works perfectly on your seed data and takes the site down the day someone saves a bad row in the admin panel. Option 1 is a real change with real costs but it is not the fix: plain <code>UNION</code> deduplicates <em>within</em> each pass against the accumulated set, and the standard tree walk wants <code>UNION ALL</code> anyway. Option 3 misreads how the outer <code>LIMIT</code> interacts with the CTE. Lesson 7.4 asks for both guards on purpose — the depth cap costs nothing and turns an outage into a truncated result you can notice. One more detail people get wrong: each recursive pass sees <b>only the rows the previous pass produced</b>, not the whole accumulated set.',
            'Đo thật: với một chu trình trong dữ liệu và không có lớp chặn nào, truy vấn vẫn đang chạy khi <code>statement_timeout</code> 4 giây huỷ nó; cũng truy vấn đó kèm lớp chặn bằng mảng và trần độ sâu thì trả về ngay. Phương án 4 chính là niềm tin để chuyện này lọt lên production — <b>không</b> có giới hạn dựng sẵn nào cả. Một CTE đệ quy chỉ dừng khi vế đệ quy sinh ra không dòng nào, mà một chu trình bảo đảm điều đó không bao giờ xảy ra, nên nó ngốn bộ nhớ tới khi kết nối chết: nó chạy hoàn hảo trên dữ liệu mẫu của bạn và làm sập trang web vào ngày có người lưu một dòng hỏng trong trang quản trị. Phương án 1 là một thay đổi có thật với cái giá có thật nhưng không phải cách sửa: <code>UNION</code> trần loại trùng <em>trong</em> mỗi lượt so với tập đã tích luỹ, và phép duyệt cây tiêu chuẩn vốn muốn <code>UNION ALL</code>. Phương án 3 hiểu sai cách <code>LIMIT</code> ở ngoài tương tác với CTE. Bài 7.4 yêu cầu cả hai lớp chặn là có chủ ý — trần độ sâu chẳng tốn gì mà biến một sự cố thành một kết quả bị cắt ngắn mà bạn nhận ra được. Một chi tiết nữa người ta hay nhầm: mỗi lượt đệ quy chỉ nhìn thấy <b>các dòng lượt trước vừa sinh ra</b>, không phải toàn bộ tập đã tích luỹ.',
          ),
        }),

        // ── Chương 8 — Hàm cửa sổ ───────────────────────────────────────
        mcq({
          prompt: B(
            'Four sales in one region: 200, 150, 150, 100, ranked by <code>amount DESC</code>. Run on PostgreSQL 16, what are the values on the <b>last</b> row (amount 100)?' + code(
              'row_number() OVER (PARTITION BY region ORDER BY amount DESC) AS rn,\n' +
              'rank()       OVER (PARTITION BY region ORDER BY amount DESC) AS rnk,\n' +
              'dense_rank() OVER (PARTITION BY region ORDER BY amount DESC) AS drnk',
            ),
            'Bốn giao dịch trong một vùng: 200, 150, 150, 100, xếp theo <code>amount DESC</code>. Chạy trên PostgreSQL 16, giá trị ở dòng <b>cuối</b> (amount 100) là gì?' + code(
              'row_number() OVER (PARTITION BY region ORDER BY amount DESC) AS rn,\n' +
              'rank()       OVER (PARTITION BY region ORDER BY amount DESC) AS rnk,\n' +
              'dense_rank() OVER (PARTITION BY region ORDER BY amount DESC) AS drnk',
            ),
          ),
          options: [
            B('<code>rn = 4</code>, <code>rnk = 3</code>, <code>drnk = 3</code>', '<code>rn = 4</code>, <code>rnk = 3</code>, <code>drnk = 3</code>'),
            B('<code>rn = 3</code>, <code>rnk = 3</code>, <code>drnk = 4</code>', '<code>rn = 3</code>, <code>rnk = 3</code>, <code>drnk = 4</code>'),
            B('<code>rn = 4</code>, <code>rnk = 4</code>, <code>drnk = 4</code>', '<code>rn = 4</code>, <code>rnk = 4</code>, <code>drnk = 4</code>'),
            B('<code>rn = 4</code>, <code>rnk = 4</code>, <code>drnk = 3</code>', '<code>rn = 4</code>, <code>rnk = 4</code>, <code>drnk = 3</code>'),
          ],
          correct: 3,
          explanation: EX(
            'Measured on PostgreSQL 16.14, the four rows come out as <code>rn</code> 1, 2, 3, 4 · <code>rnk</code> 1, 2, 2, 4 · <code>drnk</code> 1, 2, 2, 3. The two tied 150s are what separates the three functions. <code>row_number()</code> always produces distinct numbers 1..N and breaks the tie arbitrarily. <code>rank()</code> gives ties the same rank and then <b>skips</b> — like Olympic medals, two silvers and no bronze — so the next row is 4. <code>dense_rank()</code> gives ties the same rank and does <b>not</b> skip, so the next row is 3: it answers "how many distinct ranks down am I". Pick by intent: <code>row_number</code> when you need a unique ordering (top-N per group), <code>rank</code> for standings where the gap is meaningful, <code>dense_rank</code> for standings shown to a user, where a gap looks like a bug. And note the hazard that comes with <code>row_number()</code>: an <code>ORDER BY</code> that is not deterministic — <code>created_at DESC</code> alone when timestamps can tie — is free to answer differently on the next run, after a <code>VACUUM</code>, or on a replica. Always add a unique tiebreaker.',
            'Đo thật trên PostgreSQL 16.14, bốn dòng cho ra <code>rn</code> 1, 2, 3, 4 · <code>rnk</code> 1, 2, 2, 4 · <code>drnk</code> 1, 2, 2, 3. Hai giá trị 150 bằng nhau chính là chỗ phân biệt ba hàm. <code>row_number()</code> luôn cho các số phân biệt 1..N và phá thế hoà một cách tuỳ ý. <code>rank()</code> cho các dòng hoà cùng một hạng rồi <b>nhảy cóc</b> — như huy chương Olympic, hai bạc và không có đồng — nên dòng kế tiếp là 4. <code>dense_rank()</code> cho các dòng hoà cùng một hạng và <b>không</b> nhảy cóc, nên dòng kế tiếp là 3: nó trả lời "tôi đứng dưới bao nhiêu hạng khác nhau". Chọn theo ý định: <code>row_number</code> khi cần một thứ tự duy nhất (top-N mỗi nhóm), <code>rank</code> cho bảng xếp hạng mà khoảng cách có ý nghĩa, <code>dense_rank</code> cho bảng xếp hạng hiện ra trước mắt người dùng, nơi một chỗ nhảy cóc trông như lỗi. Và nhớ mối nguy đi kèm <code>row_number()</code>: một <code>ORDER BY</code> không xác định — chỉ mỗi <code>created_at DESC</code> trong khi thời điểm có thể trùng — được phép trả lời khác đi ở lần chạy sau, sau một lần <code>VACUUM</code>, hoặc trên một bản sao. Luôn thêm một cột phá hoà duy nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'You want the top two sellers per region. Why does this fail, and what is the standard shape?' + code(
              'SELECT region, seller, amount\n' +
              'FROM sale\n' +
              'WHERE row_number() OVER (PARTITION BY region ORDER BY amount DESC) <= 2;',
            ),
            'Bạn muốn lấy hai người bán hàng đầu mỗi vùng. Vì sao câu này hỏng, và khuôn chuẩn là gì?' + code(
              'SELECT region, seller, amount\n' +
              'FROM sale\n' +
              'WHERE row_number() OVER (PARTITION BY region ORDER BY amount DESC) <= 2;',
            ),
          ),
          options: [
            B('Window functions run <b>after</b> <code>WHERE</code>, so the value does not exist yet at filter time — compute it in a CTE or subquery, then filter in the outer query', 'Hàm cửa sổ chạy <b>sau</b> <code>WHERE</code>, nên lúc lọc thì giá trị đó chưa tồn tại — hãy tính nó trong một CTE hoặc truy vấn con, rồi lọc ở truy vấn ngoài'),
            B('The window is missing a frame clause; adding <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> makes it usable in <code>WHERE</code>', 'Cửa sổ thiếu mệnh đề khung; thêm <code>ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> là dùng được trong <code>WHERE</code>'),
            B('<code>row_number()</code> cannot be compared with <code>&lt;=</code>; use <code>HAVING row_number() = 1 OR row_number() = 2</code> instead', 'Không thể so sánh <code>row_number()</code> bằng <code>&lt;=</code>; hãy dùng <code>HAVING row_number() = 1 OR row_number() = 2</code> thay thế'),
            B('It works, but returns the top two of the whole table because <code>PARTITION BY</code> is ignored inside a <code>WHERE</code> clause', 'Nó chạy được, nhưng trả về hai dòng đầu của cả bảng vì <code>PARTITION BY</code> bị bỏ qua bên trong mệnh đề <code>WHERE</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 8.2 calls this the single most common "why won\'t my window filter work?" gotcha, and the cause is the execution order again: <code>FROM</code> → <code>WHERE</code> → <code>GROUP BY</code> → <code>HAVING</code> → window functions → <code>SELECT</code> → <code>ORDER BY</code>. A window function is computed near the end, so at <code>WHERE</code> time it has no value to compare. <code>HAVING</code> does not help either — it also runs before windows — which rules out option 3. The standard shape is two levels: <code>WITH ranked AS (SELECT …, row_number() OVER (PARTITION BY region ORDER BY amount DESC, id) AS rn FROM sale) SELECT … FROM ranked WHERE rn &lt;= 2</code>. Note the extra <code>id</code> in the ordering — that is the deterministic tiebreaker from the previous question, and without it two rows tied on amount can swap places between runs so your "top two" flickers. Option 2 confuses frames, which change <em>what the function computes</em>, with when it is computed.',
            'Bài 8.2 gọi đây là cái bẫy "sao lọc hàm cửa sổ không được" phổ biến nhất, và nguyên nhân lại là thứ tự thực thi: <code>FROM</code> → <code>WHERE</code> → <code>GROUP BY</code> → <code>HAVING</code> → hàm cửa sổ → <code>SELECT</code> → <code>ORDER BY</code>. Hàm cửa sổ được tính gần cuối, nên tới lúc <code>WHERE</code> chạy thì chưa có giá trị nào để so. <code>HAVING</code> cũng không cứu được — nó cũng chạy trước hàm cửa sổ — nên loại luôn phương án 3. Khuôn chuẩn có hai tầng: <code>WITH ranked AS (SELECT …, row_number() OVER (PARTITION BY region ORDER BY amount DESC, id) AS rn FROM sale) SELECT … FROM ranked WHERE rn &lt;= 2</code>. Để ý cột <code>id</code> thêm vào phần sắp xếp — đó chính là cột phá hoà xác định ở câu trước, thiếu nó thì hai dòng bằng nhau về số tiền có thể đổi chỗ giữa các lần chạy và "top hai" của bạn cứ chớp tắt. Phương án 2 nhầm giữa khung cửa sổ, thứ thay đổi <em>hàm tính cái gì</em>, với thời điểm hàm được tính.',
          ),
        }),

        mcq({
          prompt: B(
            'Four rows with amounts 100, 150, 150, 200. Run on PostgreSQL 16, the two columns differ on the <b>second</b> row. Which pair is right?' + code(
              'SELECT amount,\n' +
              '  sum(amount) OVER (ORDER BY amount) AS a,\n' +
              '  sum(amount) OVER (ORDER BY amount\n' +
              '                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS b\n' +
              'FROM sale ORDER BY amount;',
            ),
            'Bốn dòng với số tiền 100, 150, 150, 200. Chạy trên PostgreSQL 16, hai cột khác nhau ở dòng <b>thứ hai</b>. Cặp nào đúng?' + code(
              'SELECT amount,\n' +
              '  sum(amount) OVER (ORDER BY amount) AS a,\n' +
              '  sum(amount) OVER (ORDER BY amount\n' +
              '                    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS b\n' +
              'FROM sale ORDER BY amount;',
            ),
          ),
          options: [
            B('<code>a = 250</code>, <code>b = 250</code> — the default frame is already <code>ROWS</code>, so the two clauses are the same thing written twice', '<code>a = 250</code>, <code>b = 250</code> — khung mặc định vốn đã là <code>ROWS</code>, nên hai mệnh đề là cùng một thứ viết hai lần'),
            B('<code>a = 600</code>, <code>b = 250</code> — with no explicit frame the window is the whole partition, so column A is the grand total on every row', '<code>a = 600</code>, <code>b = 250</code> — không có khung tường minh thì cửa sổ là cả phân vùng, nên cột A là tổng lớn trên mọi dòng'),
            B('<code>a = 400</code>, <code>b = 250</code> — the default frame is <code>RANGE</code>, which includes <b>every row sharing the current value</b>, so both tied 150s already see 100+150+150', '<code>a = 400</code>, <code>b = 250</code> — khung mặc định là <code>RANGE</code>, thứ bao gồm <b>mọi dòng có cùng giá trị hiện tại</b>, nên cả hai dòng 150 đều đã thấy 100+150+150'),
            B('<code>a = 250</code>, <code>b = 400</code> — <code>ROWS</code> is the wider of the two frame modes because it ignores ties', '<code>a = 250</code>, <code>b = 400</code> — <code>ROWS</code> là khung rộng hơn trong hai chế độ vì nó bỏ qua chuyện hoà'),
          ],
          correct: 2,
          explanation: EX(
            'Measured: column A reads 100, <b>400</b>, 400, 600 and column B reads 100, <b>250</b>, 400, 600. Two frame rules are doing the work. First, an <code>ORDER BY</code> inside <code>OVER</code> silently introduces a default frame of <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> — you did not write it, and it is why a <code>sum()</code> starts running at all. Second, <b><code>RANGE</code> groups peers while <code>ROWS</code> counts rows</b>: with <code>RANGE</code>, the current row\'s frame includes every row sharing its ordering value, so both 150s see 100+150+150 = 400 and report the same running total; <code>ROWS</code> counts physical rows and gives 250 then 400. On a column with duplicates the two genuinely differ, which is exactly why the default surprises people. Option 2 describes the <em>other</em> default — no <code>ORDER BY</code> inside <code>OVER</code> at all — which does make the frame the whole partition and puts the grand total on every row. And remember that a moving average needs an explicit frame such as <code>ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code>; nothing about the default gives you one.',
            'Đo thật: cột A ra 100, <b>400</b>, 400, 600 còn cột B ra 100, <b>250</b>, 400, 600. Hai quy tắc về khung đang làm việc ở đây. Thứ nhất, một <code>ORDER BY</code> bên trong <code>OVER</code> lặng lẽ dựng lên khung mặc định <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> — bạn không viết nó, và chính nó khiến <code>sum()</code> trở thành tổng luỹ tiến. Thứ hai, <b><code>RANGE</code> gom các dòng ngang hàng còn <code>ROWS</code> đếm dòng</b>: với <code>RANGE</code>, khung của dòng hiện tại gồm mọi dòng có cùng giá trị sắp xếp, nên cả hai dòng 150 đều thấy 100+150+150 = 400 và báo cùng một tổng luỹ tiến; <code>ROWS</code> đếm dòng vật lý nên cho 250 rồi 400. Trên một cột có giá trị trùng, hai chế độ khác nhau thật, và đó đúng là lý do khung mặc định làm người ta bất ngờ. Phương án 2 mô tả khung mặc định <em>kia</em> — hoàn toàn không có <code>ORDER BY</code> trong <code>OVER</code> — thứ đúng là biến khung thành cả phân vùng và đặt tổng lớn lên mọi dòng. Và nhớ rằng một trung bình trượt cần khung tường minh kiểu <code>ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code>; khung mặc định không cho bạn thứ đó.',
          ),
        }),

        // ── Chương 9 — Chỉ mục ──────────────────────────────────────────
        mcq({
          prompt: B(
            'One index exists: ' + c('CREATE INDEX big_ab ON big (a, b)') + '. Run on PostgreSQL 16 with 500,000 rows and fresh statistics, which query got a <b>Seq Scan</b>?' + code(
              'SELECT count(*) FROM big WHERE a = 7;              -- A\n' +
              'SELECT count(*) FROM big WHERE b = 7;              -- B\n' +
              'SELECT count(*) FROM big WHERE a = 7 AND b = 7;    -- C',
            ),
            'Chỉ có một chỉ mục: ' + c('CREATE INDEX big_ab ON big (a, b)') + '. Chạy trên PostgreSQL 16 với 500.000 dòng và thống kê mới, truy vấn nào nhận một <b>Seq Scan</b>?' + code(
              'SELECT count(*) FROM big WHERE a = 7;              -- A\n' +
              'SELECT count(*) FROM big WHERE b = 7;              -- B\n' +
              'SELECT count(*) FROM big WHERE a = 7 AND b = 7;    -- C',
            ),
          ),
          options: [
            B('A — a composite index can only be used when every one of its columns is constrained', 'A — chỉ mục tổ hợp chỉ dùng được khi mọi cột của nó đều bị ràng buộc'),
            B('B — an index on <code>(a, b)</code> serves any <b>left prefix</b>, so <code>a</code> alone and <code>a AND b</code> both use it, but <code>b</code> alone cannot', 'B — chỉ mục trên <code>(a, b)</code> phục vụ mọi <b>tiền tố trái</b>, nên riêng <code>a</code> và <code>a AND b</code> đều dùng được, còn riêng <code>b</code> thì không'),
            B('C — combining two conditions forces a bitmap scan, which the planner rejects in favour of a sequential read', 'C — kết hợp hai điều kiện buộc phải dùng bitmap scan, thứ mà bộ lập kế hoạch bỏ qua để đọc tuần tự'),
            B('None of them — PostgreSQL can seek into any column of a composite index independently', 'Không câu nào — PostgreSQL có thể tìm vào bất kỳ cột nào của chỉ mục tổ hợp một cách độc lập'),
          ],
          correct: 1,
          explanation: EX(
            'Verified plans: A used <code>Bitmap Index Scan on big_ab</code> with <code>Index Cond: (a = 7)</code>, C used the same index with <code>Index Cond: ((a = 7) AND (b = 7))</code>, and B fell back to <code>Parallel Seq Scan on big</code> with <code>Filter: (b = 7)</code>. A B-tree on <code>(a, b)</code> is physically sorted by <code>a</code> first — the phone-book layout — so it is useless for "everyone whose second column is 7", exactly as a phone book is useless for finding everyone whose first name is An. The rule that follows: an index on <code>(a, b, c)</code> serves <code>WHERE a=</code>, <code>WHERE a= AND b=</code>, and all three together, but never <code>b</code> alone. Two corollaries worth carrying. Put <b>equality columns first and the range or sort column last</b>, because once a range is scanned the columns after it can no longer narrow the search. And do not expect three single-column indexes to add up to one composite: PostgreSQL <em>can</em> combine them with a bitmap scan, but that is far slower than one index that already has the rows in the right order, and it often decides not to bother.',
            'Kế hoạch đã kiểm: A dùng <code>Bitmap Index Scan on big_ab</code> với <code>Index Cond: (a = 7)</code>, C dùng chính chỉ mục ấy với <code>Index Cond: ((a = 7) AND (b = 7))</code>, còn B rơi về <code>Parallel Seq Scan on big</code> với <code>Filter: (b = 7)</code>. Một B-tree trên <code>(a, b)</code> được sắp vật lý theo <code>a</code> trước — đúng kiểu cuốn danh bạ — nên nó vô dụng với câu hỏi "ai có cột thứ hai bằng 7", y như cuốn danh bạ vô dụng khi tìm mọi người tên An. Quy tắc suy ra: chỉ mục trên <code>(a, b, c)</code> phục vụ <code>WHERE a=</code>, <code>WHERE a= AND b=</code>, và cả ba cùng lúc, nhưng không bao giờ phục vụ riêng <code>b</code>. Hai hệ quả đáng mang theo. Hãy đặt <b>các cột so bằng lên trước, cột khoảng hoặc cột sắp xếp xuống cuối</b>, vì một khi đã quét một khoảng thì các cột đứng sau không thu hẹp được nữa. Và đừng mong ba chỉ mục một cột cộng lại thành một chỉ mục tổ hợp: PostgreSQL <em>có thể</em> ghép chúng bằng bitmap scan, nhưng cách đó chậm hơn nhiều so với một chỉ mục vốn đã có sẵn các dòng theo đúng thứ tự, và nó thường quyết định không thèm ghép.',
          ),
        }),

        mcq({
          prompt: B(
            'There is an index on <code>email</code>. On PostgreSQL 16 the first query got a Seq Scan and the second an Index Scan. Why?' + code(
              "SELECT * FROM big WHERE lower(email) = 'user5@example.com';   -- Seq Scan\n" +
              "SELECT * FROM big WHERE email = 'user5@example.com';          -- Index Scan",
            ),
            'Có một chỉ mục trên <code>email</code>. Trên PostgreSQL 16, truy vấn đầu nhận Seq Scan còn truy vấn sau nhận Index Scan. Vì sao?' + code(
              "SELECT * FROM big WHERE lower(email) = 'user5@example.com';   -- Seq Scan\n" +
              "SELECT * FROM big WHERE email = 'user5@example.com';          -- Index Scan",
            ),
          ),
          options: [
            B('The first is not selective enough — <code>lower()</code> makes more rows match, so the planner correctly prefers a scan', 'Câu đầu không đủ chọn lọc — <code>lower()</code> làm nhiều dòng khớp hơn, nên bộ lập kế hoạch chọn quét là đúng'),
            B('Statistics are stale for the expression; running <code>ANALYZE big</code> lets the planner use the existing index', 'Thống kê cho biểu thức đó đã cũ; chạy <code>ANALYZE big</code> là bộ lập kế hoạch dùng được chỉ mục sẵn có'),
            B('The index needs rebuilding — a function in the predicate invalidates the index until <code>REINDEX</code> runs', 'Chỉ mục cần dựng lại — một hàm trong vị từ làm chỉ mục mất hiệu lực cho tới khi chạy <code>REINDEX</code>'),
            B('The index stores <code>email</code>, not <code>lower(email)</code> — a function wrapping the column makes it unusable; the fix is an expression index on exactly that expression', 'Chỉ mục lưu <code>email</code>, chứ không lưu <code>lower(email)</code> — một hàm bọc quanh cột làm nó không dùng được; cách sửa là một chỉ mục biểu thức trên đúng biểu thức đó'),
          ],
          correct: 3,
          explanation: EX(
            'Verified: <code>Parallel Seq Scan … Filter: (lower(email) = …)</code> versus <code>Index Scan using big_email … Index Cond: (email = …)</code>. A B-tree is a sorted structure over the <em>stored</em> values; the sorted order of <code>email</code> tells you nothing about the sorted order of <code>lower(email)</code>, so there is nothing to seek into. The same trap bites <code>WHERE date(created_at) = …</code>, <code>WHERE email ILIKE …</code>, and a leading-wildcard <code>LIKE \'%foo\'</code> — no B-tree can seek a suffix. Two fixes: <code>CREATE INDEX ON big (lower(email))</code>, which must match the expression exactly, or normalise the value at write time so the column is already lower-cased and the predicate can stay bare. Options 1 and 2 both name real reasons an index gets skipped — low selectivity and stale statistics are two of the four in lesson 9.3, along with a type mismatch — but neither is what happened here, and <code>ANALYZE</code> cannot help because no index over that expression exists to be chosen. Option 3 invents an invalidation mechanism PostgreSQL does not have. The general habit: creating an index always succeeds; <b>using</b> it is a separate planner decision, so check with <code>EXPLAIN</code> that the index name appears.',
            'Đã kiểm: <code>Parallel Seq Scan … Filter: (lower(email) = …)</code> so với <code>Index Scan using big_email … Index Cond: (email = …)</code>. B-tree là một cấu trúc sắp xếp trên các giá trị <em>đã lưu</em>; thứ tự sắp của <code>email</code> chẳng nói gì về thứ tự sắp của <code>lower(email)</code>, nên không có gì để tìm vào cả. Cùng cái bẫy ấy cắn cả <code>WHERE date(created_at) = …</code>, <code>WHERE email ILIKE …</code>, và <code>LIKE \'%foo\'</code> có ký tự đại diện ở đầu — không B-tree nào tìm được theo phần đuôi. Hai cách sửa: <code>CREATE INDEX ON big (lower(email))</code>, phải khớp biểu thức chính xác, hoặc chuẩn hoá giá trị ngay lúc ghi để cột vốn đã viết thường và vị từ được để trần. Phương án 1 và 2 đều nêu những lý do có thật khiến chỉ mục bị bỏ qua — độ chọn lọc thấp và thống kê cũ là hai trong bốn lý do ở bài 9.3, cùng với lệch kiểu — nhưng không phải chuyện xảy ra ở đây, và <code>ANALYZE</code> không cứu được vì chẳng có chỉ mục nào trên biểu thức đó để mà chọn. Phương án 3 bịa ra một cơ chế vô hiệu hoá mà PostgreSQL không có. Thói quen chung: tạo chỉ mục thì bao giờ cũng thành công; <b>dùng</b> được nó lại là một quyết định khác của bộ lập kế hoạch, nên hãy dùng <code>EXPLAIN</code> kiểm xem tên chỉ mục có hiện ra không.',
          ),
        }),

        mcq({
          prompt: B(
            'A partial index is 128 kB where the full index is 11 MB, and it works beautifully in psql — but the application never uses it. What is the most likely cause?' + code(
              "CREATE INDEX big_banned ON big (created) WHERE status = 'banned';\n" +
              '\n' +
              "-- in psql:      WHERE status = 'banned' AND created > $when   → index used\n" +
              '-- from the app: WHERE status = $1       AND created > $2      → Seq Scan',
            ),
            'Một partial index chỉ nặng 128 kB trong khi chỉ mục đầy đủ nặng 11 MB, và nó chạy rất đẹp trong psql — nhưng ứng dụng không bao giờ dùng tới. Nguyên nhân nhiều khả năng nhất là gì?' + code(
              "CREATE INDEX big_banned ON big (created) WHERE status = 'banned';\n" +
              '\n' +
              "-- trong psql:  WHERE status = 'banned' AND created > $when   → dùng chỉ mục\n" +
              '-- từ app:      WHERE status = $1       AND created > $2      → Seq Scan',
            ),
          ),
          options: [
            B('The planner must be able to <b>prove</b> the query asks for a subset of the index\'s <code>WHERE</code>; with a parameter the value is unknown at plan time, so nothing can be proven', 'Bộ lập kế hoạch phải <b>chứng minh được</b> truy vấn đang hỏi một tập con của <code>WHERE</code> trong chỉ mục; với tham số thì giá trị chưa biết lúc lập kế hoạch, nên không chứng minh được gì'),
            B('Partial indexes are only consulted by superusers; the application role lacks the privilege', 'Partial index chỉ được siêu người dùng dùng tới; vai trò của ứng dụng không có quyền'),
            B('The index is too small to be worth reading, so the planner always prefers the table below a few megabytes', 'Chỉ mục quá nhỏ nên không đáng đọc, và bộ lập kế hoạch luôn ưu tiên đọc bảng khi dưới vài megabyte'),
            B('Prepared statements cannot use any index; the driver must send the query as literal text', 'Câu lệnh đã chuẩn bị không dùng được chỉ mục nào; driver phải gửi truy vấn dưới dạng văn bản với giá trị thật'),
          ],
          correct: 0,
          explanation: EX(
            'Measured sizes: 128 kB versus 11 MB for the same column — that is why partial indexes are the standard tool for a hot subset (unprocessed jobs, unread notifications, active sessions, soft-delete flags). But a partial index is usable only when the planner can prove, from the query text, that every row the query wants is inside the index\'s predicate. <code>status = \'banned\'</code> proves it; <code>status = $1</code> does not, because at plan time the parameter has no value. Lesson 9.3 calls this out precisely because of the shape of the symptom: it works in psql, where you type literals, and does nothing from the application, where every query is parameterised. Options 2 and 4 invent restrictions that do not exist. Option 3 inverts the real selectivity rule, which is about the <em>fraction of the table returned</em>, not the size of the index — an index is a tool for finding a few rows among many, and the planner is right to skip one that leads to 40% of the table in random order.',
            'Kích thước đo được: 128 kB so với 11 MB cho cùng một cột — vì thế partial index là công cụ tiêu chuẩn cho một tập con nóng (job chưa xử lý, thông báo chưa đọc, phiên đang hoạt động, cờ xoá mềm). Nhưng một partial index chỉ dùng được khi bộ lập kế hoạch chứng minh được, từ chính văn bản truy vấn, rằng mọi dòng truy vấn cần đều nằm trong vị từ của chỉ mục. <code>status = \'banned\'</code> chứng minh được; <code>status = $1</code> thì không, vì lúc lập kế hoạch tham số chưa có giá trị. Bài 9.3 nêu đích danh chuyện này chính vì hình dạng của triệu chứng: nó chạy trong psql, nơi bạn gõ giá trị thật, và im lìm khi gọi từ ứng dụng, nơi mọi truy vấn đều tham số hoá. Phương án 2 và 4 bịa ra những hạn chế không tồn tại. Phương án 3 đảo ngược quy tắc chọn lọc thật, vốn nói về <em>tỷ lệ bảng được trả về</em> chứ không phải kích thước chỉ mục — chỉ mục là công cụ tìm vài dòng giữa rất nhiều dòng, và bộ lập kế hoạch bỏ qua một chỉ mục dẫn tới 40% số dòng theo thứ tự ngẫu nhiên là hoàn toàn đúng.',
          ),
        }),

        // ── Chương 10 — EXPLAIN & bộ lập kế hoạch ───────────────────────
        mcq({
          prompt: B(
            'A node inside a Nested Loop reports this. How much time did that node actually consume?' + code(
              '->  Index Scan using customer_pkey on customer c\n' +
              '      (cost=0.29..8.30 rows=1 width=23)\n' +
              '      (actual time=0.030..0.040 rows=1 loops=5000)',
            ),
            'Một nút bên trong Nested Loop báo như dưới. Nút đó thật sự tiêu tốn bao nhiêu thời gian?' + code(
              '->  Index Scan using customer_pkey on customer c\n' +
              '      (cost=0.29..8.30 rows=1 width=23)\n' +
              '      (actual time=0.030..0.040 rows=1 loops=5000)',
            ),
          ),
          options: [
            B('0.040 ms — <code>actual time</code> is already the total for the node; <code>loops</code> only reports how often the planner considered it', '0,040 ms — <code>actual time</code> vốn đã là tổng của nút; <code>loops</code> chỉ cho biết bộ lập kế hoạch đã cân nhắc nó bao nhiêu lần'),
            B('0.010 ms — the difference between the two numbers, times nothing, because the loops share one index probe', '0,010 ms — hiệu của hai con số, không nhân với gì cả, vì các vòng lặp dùng chung một lần dò chỉ mục'),
            B('About <b>200 ms</b> — times and rows in a plan are <b>per loop</b>, so 0.040 × 5000 is the real total, and <code>rows=1</code> means 5000 rows in all', 'Khoảng <b>200 ms</b> — thời gian và số dòng trong plan là <b>cho mỗi vòng</b>, nên 0,040 × 5000 mới là tổng thật, và <code>rows=1</code> nghĩa là tổng cộng 5000 dòng'),
            B('It cannot be determined without <code>BUFFERS</code>, which is the only option that reports per-node totals', 'Không xác định được nếu thiếu <code>BUFFERS</code>, tuỳ chọn duy nhất báo tổng theo từng nút'),
          ],
          correct: 2,
          explanation: EX(
            'This is the single most misread line in a plan. Both <code>actual time</code> and <code>rows</code> are averages <b>per loop</b>, so a node that looks like 0.04 ms is really 200 ms once you multiply by <code>loops=5000</code>, and a node reporting <code>rows=1</code> emitted five thousand rows in total. Miss that and you will optimise the wrong node all afternoon. Two companions worth reading in the same breath: <code>cost=startup..total</code> is in <b>arbitrary units</b> — useful for comparing two plans, meaningless as an absolute and never milliseconds — and the single most useful comparison in any plan is <b>estimated <code>rows</code> versus actual <code>rows</code></b>, because a wild divergence there is the root cause of most bad plans. Option 4 misdescribes <code>BUFFERS</code>, which reports pages touched (<code>shared hit</code> from cache, <code>shared read</code> from disk), not per-node time totals.',
            'Đây là dòng bị đọc sai nhiều nhất trong một plan. Cả <code>actual time</code> lẫn <code>rows</code> đều là trung bình <b>cho mỗi vòng lặp</b>, nên một nút trông như 0,04 ms thật ra là 200 ms sau khi nhân với <code>loops=5000</code>, và một nút báo <code>rows=1</code> đã phát ra tổng cộng năm nghìn dòng. Bỏ sót điều đó là bạn ngồi tối ưu nhầm nút cả buổi chiều. Hai người bạn nên đọc cùng lúc: <code>cost=startup..total</code> tính bằng <b>đơn vị quy ước</b> — hữu ích để so hai plan, vô nghĩa nếu đọc như số tuyệt đối và không bao giờ là mili giây — và phép so sánh hữu ích nhất trong mọi plan là <b><code>rows</code> ước lượng so với <code>rows</code> thực tế</b>, vì chênh lệch lớn ở đó là gốc rễ của phần lớn plan tồi. Phương án 4 mô tả sai <code>BUFFERS</code>, thứ báo số trang đã chạm (<code>shared hit</code> từ bộ nhớ đệm, <code>shared read</code> từ đĩa), chứ không phải tổng thời gian theo nút.',
          ),
        }),

        mcq({
          prompt: B(
            'A plan contains a <code>Nested Loop</code> and a colleague wants to rewrite the query to avoid it. What should you check first?',
            'Một plan có <code>Nested Loop</code> và đồng nghiệp muốn viết lại truy vấn để tránh nó. Bạn nên kiểm tra điều gì trước?',
          ),
          options: [
            B('Whether the join can be turned into a Hash Join, since Hash Join is the fastest strategy and the planner picks Nested Loop only when statistics are missing', 'Xem có biến được nó thành Hash Join không, vì Hash Join là chiến lược nhanh nhất và bộ lập kế hoạch chỉ chọn Nested Loop khi thiếu thống kê'),
            B('The <code>loops=</code> count and whether the inner side uses an index — a nested loop over a small outer side with an indexed inner lookup is often the <b>fastest possible plan</b>', 'Số <code>loops=</code> và xem phía trong có dùng chỉ mục không — một nested loop trên phía ngoài nhỏ với phép tra chỉ mục ở phía trong thường là <b>plan nhanh nhất có thể</b>'),
            B('Whether <code>work_mem</code> is large enough, because a Nested Loop is what PostgreSQL falls back to when a hash table will not fit', 'Xem <code>work_mem</code> đã đủ lớn chưa, vì Nested Loop là thứ PostgreSQL lùi về khi bảng băm không vừa bộ nhớ'),
            B('Nothing — set <code>enable_nestloop = off</code> in the application connection so the planner never chooses it again', 'Chẳng cần gì — đặt <code>enable_nestloop = off</code> trong kết nối của ứng dụng để bộ lập kế hoạch không bao giờ chọn nó nữa'),
          ],
          correct: 1,
          explanation: EX(
            'The name sounds like the O(n²) loop everyone is taught to fear, and lesson 10.2 says people rewrite perfectly good queries to escape it. In the measured example a Nested Loop over five outer rows with <code>Index Scan using customer_pkey</code> as the inner side finished in <b>0.087 ms</b>. What actually signals trouble is an inner node doing a <b>sequential scan</b>, or a huge <code>loops=</code> count — and that is caused by a <b>missing index</b>, not by the join strategy. The site\'s own anecdote is exactly this: an unindexed foreign key turned the inner lookup into a full table scan run thousands of times; indexing the FK let the planner switch to a Hash Join and seconds became milliseconds. Judge the plan by <code>loops=</code> and by whether the inner side uses an index, never by the name of the node. The three strategies each have their case: few rows with an indexed inner side → Nested Loop; a large unsorted join → Hash Join, which needs no index as long as one side fits in <code>work_mem</code>; both sides already sorted on the key → Merge Join. Option 4 is the diagnostic knob used as a production setting, which lesson 10.4 forbids — <code>enable_*</code> flags exist to reveal alternatives while you investigate, never to force a plan.',
            'Cái tên nghe như vòng lặp O(n²) mà ai cũng được dạy phải sợ, và bài 10.2 nói người ta viết lại những truy vấn vốn rất tốt chỉ để né nó. Trong ví dụ đo thật, một Nested Loop trên năm dòng ở phía ngoài với <code>Index Scan using customer_pkey</code> ở phía trong hoàn tất trong <b>0,087 ms</b>. Thứ thật sự báo động là một nút bên trong đang <b>quét tuần tự</b>, hoặc một con số <code>loops=</code> khổng lồ — và nguyên nhân là <b>thiếu chỉ mục</b>, chứ không phải chiến lược join. Chính trang web này từng gặp đúng vậy: một khoá ngoại không có chỉ mục biến phép tra ở phía trong thành một lần quét cả bảng lặp lại hàng nghìn lượt; đánh chỉ mục cho khoá ngoại là bộ lập kế hoạch chuyển sang Hash Join và vài giây thành vài mili giây. Hãy đánh giá plan qua <code>loops=</code> và qua chuyện phía trong có dùng chỉ mục hay không, đừng bao giờ đánh giá qua tên của nút. Ba chiến lược mỗi cái có chỗ đứng: ít dòng và phía trong có chỉ mục → Nested Loop; join lớn chưa sắp xếp → Hash Join, thứ không cần chỉ mục miễn là một phía vừa <code>work_mem</code>; cả hai phía đã sắp theo khoá → Merge Join. Phương án 4 là cái núm chẩn đoán bị dùng làm cấu hình production, điều bài 10.4 cấm — các cờ <code>enable_*</code> sinh ra để lộ các phương án khác trong lúc bạn điều tra, không bao giờ để ép một plan.',
          ),
        }),

        mcq({
          prompt: B(
            'You time a query twice. The first run takes 800 ms, the second 8 ms. <code>EXPLAIN (ANALYZE, BUFFERS)</code> shows <code>shared hit=3817</code> on the second run and <code>shared read</code> on the first. What should you report?',
            'Bạn bấm giờ một truy vấn hai lần. Lần đầu 800 ms, lần sau 8 ms. <code>EXPLAIN (ANALYZE, BUFFERS)</code> cho thấy <code>shared hit=3817</code> ở lần sau và <code>shared read</code> ở lần đầu. Bạn nên báo cáo thế nào?',
          ),
          options: [
            B('8 ms — the first run included one-off planning work, and <code>Planning Time</code> is exactly what the difference measures', '8 ms — lần đầu gồm cả công lập kế hoạch chỉ làm một lần, và <code>Planning Time</code> đúng là thứ mà chênh lệch đó đo được'),
            B('8 ms — a warm cache is the normal production state, so the cold number is an artefact of testing', '8 ms — bộ nhớ đệm ấm mới là trạng thái bình thường trên production, nên con số lạnh chỉ là sản phẩm phụ của việc thử nghiệm'),
            B('Neither number alone is meaningful; only <code>cost</code> should be reported, since it is independent of caching', 'Không con số nào tự nó có ý nghĩa; chỉ nên báo <code>cost</code>, vì nó không phụ thuộc bộ nhớ đệm'),
            B('Both, and size expectations by the <b>cold</b> one — <code>shared read</code> means disk, <code>shared hit</code> means cache, and a query that is 8 ms warm and 800 ms cold is an 800 ms query for whoever arrives first each morning', 'Cả hai, và lấy con số <b>lạnh</b> làm chuẩn kỳ vọng — <code>shared read</code> là đọc đĩa, <code>shared hit</code> là bộ nhớ đệm, và một truy vấn 8 ms khi ấm nhưng 800 ms khi lạnh chính là một truy vấn 800 ms với người đầu tiên tới mỗi sáng'),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 10.4 opens with the point that time in a plan is misleading because it depends on what is cached, and <code>BUFFERS</code> is how you tell the two apart: <code>shared hit</code> is a page found in the buffer cache, <code>shared read</code> is a cache miss that went to disk. The measured example in that lesson shows the same query moving from 3,817 buffers and 27.5 ms to 7 buffers and 0.3 ms once the right index existed — a real improvement, visible in the page counts rather than only in the clock. Option 1 misattributes the gap: <code>Planning Time</code> is reported separately and is typically a fraction of a millisecond. Option 2 is the comfortable assumption that hides a real user-facing latency; the first request of the morning, or any request after the working set stops fitting in RAM, pays the cold price. Option 3 throws away the most useful measurement — <code>cost</code> is in arbitrary units and is for comparing plans, not for reporting performance. The related alarm from 14.4: a healthy OLTP database sits above a 99% cache hit ratio, and a sustained drop means the working set no longer fits in memory.',
            'Bài 10.4 mở đầu bằng đúng ý này: thời gian trong một plan gây hiểu lầm vì nó phụ thuộc vào thứ gì đang nằm trong bộ nhớ đệm, và <code>BUFFERS</code> là cách phân biệt hai thứ: <code>shared hit</code> là trang tìm thấy trong bộ đệm, <code>shared read</code> là một lần trượt bộ đệm phải xuống đĩa. Ví dụ đo trong bài đó cho thấy cùng một truy vấn đi từ 3.817 buffer và 27,5 ms xuống 7 buffer và 0,3 ms khi đã có đúng chỉ mục — một cải thiện thật, nhìn thấy qua số trang chứ không chỉ qua đồng hồ. Phương án 1 quy sai nguyên nhân của khoảng chênh: <code>Planning Time</code> được báo riêng và thường chỉ là một phần của mili giây. Phương án 2 là giả định dễ chịu che mất một độ trễ có thật với người dùng; yêu cầu đầu tiên buổi sáng, hay bất kỳ yêu cầu nào sau khi tập dữ liệu làm việc không còn vừa RAM, đều phải trả cái giá lạnh. Phương án 3 vứt bỏ phép đo hữu ích nhất — <code>cost</code> tính bằng đơn vị quy ước và dùng để so plan, không để báo cáo hiệu năng. Cảnh báo liên quan ở bài 14.4: một cơ sở dữ liệu OLTP khoẻ mạnh có tỷ lệ trúng bộ đệm trên 99%, và một cú tụt kéo dài nghĩa là tập dữ liệu làm việc không còn vừa bộ nhớ.',
          ),
        }),

        // ── Chương 11 — Giao dịch & đồng thời ───────────────────────────
        mcq({
          prompt: B(
            'Inside a transaction a statement violated a <code>CHECK</code>. Your driver then issues <code>COMMIT</code> and PostgreSQL replies <code>ROLLBACK</code>. What must your application do about it?' + code(
              'BEGIN;\n' +
              'UPDATE accounts SET balance = balance - 500 WHERE id = \'A\';   -- CHECK violation\n' +
              "SELECT balance FROM accounts WHERE id = 'A';\n" +
              '-- ERROR:  current transaction is aborted, commands ignored until end of transaction block\n' +
              'COMMIT;\n' +
              '-- ROLLBACK',
            ),
            'Bên trong một giao dịch, một câu lệnh vi phạm <code>CHECK</code>. Driver của bạn sau đó gửi <code>COMMIT</code> và PostgreSQL đáp lại <code>ROLLBACK</code>. Ứng dụng của bạn phải làm gì với chuyện đó?' + code(
              'BEGIN;\n' +
              'UPDATE accounts SET balance = balance - 500 WHERE id = \'A\';   -- vi phạm CHECK\n' +
              "SELECT balance FROM accounts WHERE id = 'A';\n" +
              '-- ERROR:  current transaction is aborted, commands ignored until end of transaction block\n' +
              'COMMIT;\n' +
              '-- ROLLBACK',
            ),
          ),
          options: [
            B('Never log "commit succeeded" on the strength of the <code>COMMIT</code> returning without an exception — an aborted transaction cannot be committed, so committing one is silently a rollback, and the <code>SELECT</code> never ran either', 'Đừng bao giờ ghi log "commit thành công" chỉ vì <code>COMMIT</code> trả về không ném lỗi — một giao dịch đã huỷ thì không thể commit, nên commit nó thực chất là rollback trong im lặng, và câu <code>SELECT</code> cũng chưa hề chạy'),
            B('Retry the <code>COMMIT</code> — the first attempt was rejected because the transaction was still finishing the failed statement', 'Thử lại <code>COMMIT</code> — lần đầu bị từ chối vì giao dịch còn đang xử lý nốt câu lệnh hỏng'),
            B('Nothing — the <code>SELECT</code> did run and returned the pre-<code>UPDATE</code> value, so the transaction committed the reads and discarded the writes', 'Không phải làm gì — câu <code>SELECT</code> có chạy và trả về giá trị trước <code>UPDATE</code>, nên giao dịch đã commit phần đọc và bỏ phần ghi'),
            B('Raise the isolation level to <code>REPEATABLE READ</code>, which lets a transaction continue after a constraint violation', 'Nâng mức cô lập lên <code>REPEATABLE READ</code>, mức cho phép giao dịch chạy tiếp sau khi vi phạm ràng buộc'),
          ],
          correct: 0,
          explanation: EX(
            'Three readings sit in that output and all three matter. The <code>CHECK</code> did its job. The <code>SELECT</code> <b>never ran</b> — once a transaction is in the aborted state it accepts nothing but <code>ROLLBACK</code> or <code>ROLLBACK TO SAVEPOINT</code>, so the second ERROR is the transaction refusing it. And <code>COMMIT</code> printed <code>ROLLBACK</code>, which lesson 11.1 flags as the practical trap: many drivers treat a non-throwing <code>COMMIT</code> as success, so the log says the work was saved when nothing was. Option 4 is wrong on its own terms — isolation levels govern which snapshot you see, not whether a failed statement poisons the transaction. If you need to survive an expected failure mid-transaction, the tool is <code>SAVEPOINT</code> plus <code>ROLLBACK TO SAVEPOINT</code>, and it is not free: each savepoint consumes a subtransaction id, so a loop creating thousands of them in one transaction is a well-known way to make a busy server crawl. It is not a per-row <code>try/catch</code>.',
            'Có ba điều đọc được từ đoạn kết quả đó và cả ba đều quan trọng. <code>CHECK</code> đã làm đúng việc của nó. Câu <code>SELECT</code> <b>chưa hề chạy</b> — một khi giao dịch rơi vào trạng thái đã huỷ thì nó không nhận gì ngoài <code>ROLLBACK</code> hoặc <code>ROLLBACK TO SAVEPOINT</code>, nên dòng ERROR thứ hai là giao dịch từ chối nó. Và <code>COMMIT</code> in ra <code>ROLLBACK</code>, điều bài 11.1 nêu như cái bẫy thực tế: nhiều driver coi một lệnh <code>COMMIT</code> không ném lỗi là thành công, nên log ghi rằng công việc đã được lưu trong khi chẳng có gì được lưu. Phương án 4 sai ngay trong lập luận của nó — mức cô lập chi phối việc bạn nhìn thấy ảnh chụp nào, chứ không chi phối chuyện một câu lệnh hỏng có làm hỏng cả giao dịch hay không. Nếu bạn cần sống sót qua một thất bại đã lường trước giữa giao dịch thì công cụ là <code>SAVEPOINT</code> cùng <code>ROLLBACK TO SAVEPOINT</code>, và nó không miễn phí: mỗi savepoint tiêu một mã giao dịch con, nên một vòng lặp tạo hàng nghìn cái trong một giao dịch là cách nổi tiếng làm một máy chủ bận bò lê. Nó không phải <code>try/catch</code> cho từng dòng.',
          ),
        }),

        mcq({
          prompt: B(
            'Account A holds 100.00. Two requests run concurrently, each reading the balance and writing back a computed value. The final balance is <b>80.00</b>, both reported success, no error was logged. What is this and what fixes it?' + code(
              "const row = await db.query('SELECT balance FROM accounts WHERE id=$1', [id]);\n" +
              'const moi = row.balance - amount;\n' +
              "await db.query('UPDATE accounts SET balance=$1 WHERE id=$2', [moi, id]);",
            ),
            'Tài khoản A có 100.00. Hai yêu cầu chạy song song, mỗi cái đọc số dư rồi ghi lại một giá trị đã tính. Số dư cuối là <b>80.00</b>, cả hai đều báo thành công, không lỗi nào được ghi. Đây là gì và sửa thế nào?' + code(
              "const row = await db.query('SELECT balance FROM accounts WHERE id=$1', [id]);\n" +
              'const moi = row.balance - amount;\n' +
              "await db.query('UPDATE accounts SET balance=$1 WHERE id=$2', [moi, id]);",
            ),
          ),
          options: [
            B('A deadlock that PostgreSQL resolved by cancelling one transaction; the fix is to lock rows in a consistent order', 'Một deadlock mà PostgreSQL đã giải quyết bằng cách huỷ một giao dịch; cách sửa là khoá các dòng theo một thứ tự nhất quán'),
            B('A dirty read at <code>READ COMMITTED</code>; the fix is to raise the isolation level to <code>REPEATABLE READ</code>', 'Một lần đọc bẩn ở mức <code>READ COMMITTED</code>; cách sửa là nâng mức cô lập lên <code>REPEATABLE READ</code>'),
            B('A <b>lost update</b> — both requests read 100, and the second write overwrote the first. Fix it with one atomic statement: <code>UPDATE accounts SET balance = balance - $1 WHERE id = $2</code>', 'Một <b>lost update</b> — cả hai yêu cầu đều đọc 100, và lệnh ghi thứ hai đè lên kết quả của lệnh đầu. Sửa bằng một câu lệnh nguyên tử: <code>UPDATE accounts SET balance = balance - $1 WHERE id = $2</code>'),
            B('MVCC bloat — the old row version was still visible, so the second transaction read a stale value; a <code>VACUUM</code> prevents it', 'Phình do MVCC — phiên bản cũ của dòng vẫn còn nhìn thấy được, nên giao dịch thứ hai đọc phải giá trị cũ; một lần <code>VACUUM</code> sẽ ngăn được'),
          ],
          correct: 2,
          explanation: EX(
            'Lesson 11.4 measures exactly this: 100 − 10 − 20 finishes at <b>80.00</b> instead of 70.00, with both transactions reporting success. It is called the single most common serious concurrency bug in application code precisely because everything about it looks fine in testing with one user, and it is silent by construction — no error, no warning, no deadlock, no constraint violation. The cause is not the isolation level; it is that the read and the write are separated by a round trip through your application, so no isolation level can see the two as one operation. Raising to <code>REPEATABLE READ</code> only converts the silent loss into a <code>40001</code> error you must then handle. The fix that costs nothing is to let the database do the arithmetic in one statement: <code>SET balance = balance - $1</code> measures correctly at 70.00 with no locking code, no retry loop and no isolation change, and it covers counters, balances, stock levels and view counts. Where the new value genuinely cannot be arithmetic on the old one, use <code>SELECT … FOR UPDATE</code> first — noting that at <code>READ COMMITTED</code> the granted lock re-reads the row, so it returns the <em>new</em> value rather than the one you would have seen at statement start.',
            'Bài 11.4 đo đúng chuyện này: 100 − 10 − 20 kết thúc ở <b>80.00</b> thay vì 70.00, với cả hai giao dịch đều báo thành công. Nó được gọi là lỗi đồng thời nghiêm trọng phổ biến nhất trong mã ứng dụng chính vì mọi thứ trông hoàn toàn ổn khi thử với một người dùng, và nó im lặng theo đúng cấu tạo — không lỗi, không cảnh báo, không deadlock, không vi phạm ràng buộc. Nguyên nhân không phải mức cô lập; nguyên nhân là phép đọc và phép ghi bị ngăn cách bởi một vòng đi-về qua ứng dụng của bạn, nên không mức cô lập nào nhìn hai thứ đó thành một thao tác. Nâng lên <code>REPEATABLE READ</code> chỉ biến mất mát im lặng thành một lỗi <code>40001</code> mà bạn vẫn phải xử lý. Cách sửa không tốn gì là để cơ sở dữ liệu tự làm phép tính trong một câu lệnh: <code>SET balance = balance - $1</code> đo ra đúng 70.00, không cần mã khoá, không cần vòng thử lại, không cần đổi mức cô lập, và nó bao trọn các bộ đếm, số dư, tồn kho và lượt xem. Chỗ nào giá trị mới thật sự không thể tính từ giá trị cũ thì dùng <code>SELECT … FOR UPDATE</code> trước — lưu ý ở mức <code>READ COMMITTED</code>, khi khoá được cấp thì nó đọc lại dòng, nên trả về giá trị <em>mới</em> chứ không phải giá trị bạn lẽ ra thấy lúc câu lệnh bắt đầu.',
          ),
        }),

        mcq({
          prompt: B(
            'Two transactions each read "how many people are on call" and each takes a different person off call. Both commit at <code>REPEATABLE READ</code> and nobody is left on call. Which statement is correct?',
            'Hai giao dịch mỗi cái đọc "có bao nhiêu người đang trực" rồi mỗi cái cho một người khác nhau nghỉ trực. Cả hai commit ở mức <code>REPEATABLE READ</code> và không còn ai trực. Phát biểu nào đúng?',
          ),
          options: [
            B('<code>REPEATABLE READ</code> should have stopped it; the anomaly only appears because the two transactions were started in the same session', '<code>REPEATABLE READ</code> lẽ ra phải chặn được; bất thường này chỉ xuất hiện vì hai giao dịch cùng khởi động trong một phiên'),
            B('This is <b>write skew</b>. <code>REPEATABLE READ</code> cannot see it because the two transactions never touched the same row; <code>SERIALIZABLE</code> detects it and aborts one with <code>40001</code>, so any code using it <b>must</b> have a retry loop', 'Đây là <b>write skew</b>. <code>REPEATABLE READ</code> không thấy được vì hai giao dịch chưa bao giờ chạm cùng một dòng; <code>SERIALIZABLE</code> phát hiện ra và huỷ một cái với mã <code>40001</code>, nên mọi mã dùng mức đó <b>bắt buộc</b> phải có vòng thử lại'),
            B('This is a dirty read; setting <code>READ UNCOMMITTED</code> explicitly would have made the two transactions see each other and back off', 'Đây là đọc bẩn; đặt tường minh <code>READ UNCOMMITTED</code> sẽ khiến hai giao dịch nhìn thấy nhau và nhường nhau'),
            B('A <code>CHECK</code> constraint would have caught it, since the invariant "at least one person on call" is a per-row rule', 'Một ràng buộc <code>CHECK</code> sẽ bắt được, vì bất biến "ít nhất một người trực" là quy tắc trên từng dòng'),
          ],
          correct: 1,
          explanation: EX(
            'Neither transaction did anything wrong individually — the damage lives in the combination, and because they wrote different rows there is no lock contention and no overwrite for <code>REPEATABLE READ</code> to notice. <code>SERIALIZABLE</code> catches it by tracking that one transaction <em>read</em> data another then <em>wrote</em>, concluding no serial order could produce that outcome, and cancelling one with <code>ERROR: could not serialize access due to read/write dependencies among transactions</code>. It is genuine serializable isolation by <b>detection</b>, not by locking — and the <code>HINT: The transaction might succeed if retried.</code> is a requirement, not advice. Without a retry loop on SQLSTATE <code>40001</code> you have not made the system correct, you have made it fail under load. Option 3 is doubly wrong: this is not a dirty read, and PostgreSQL accepts <code>READ UNCOMMITTED</code> in the parser while silently treating it as <code>READ COMMITTED</code> — it never performs dirty reads, so writing it in code copied from another database does nothing at all. Option 4 misplaces the invariant: a <code>CHECK</code> constrains one row, while this rule spans the table. Do not reach for <code>SERIALIZABLE</code> globally — most application code is correct at <code>READ COMMITTED</code> because a single <code>UPDATE … SET balance = balance - 10</code> reads and writes in one statement and has nothing to skew.',
            'Không giao dịch nào làm sai điều gì nếu xét riêng — thiệt hại nằm ở sự kết hợp, và vì chúng ghi hai dòng khác nhau nên không có tranh chấp khoá và không có phép ghi đè nào để <code>REPEATABLE READ</code> nhận ra. <code>SERIALIZABLE</code> bắt được nhờ theo dõi rằng một giao dịch đã <em>đọc</em> dữ liệu mà giao dịch kia sau đó <em>ghi</em>, kết luận không thứ tự tuần tự nào cho ra kết cục ấy, rồi huỷ một cái với <code>ERROR: could not serialize access due to read/write dependencies among transactions</code>. Đó là cô lập tuần tự thật sự bằng cách <b>phát hiện</b>, không phải bằng khoá — và dòng <code>HINT: The transaction might succeed if retried.</code> là một yêu cầu, không phải lời khuyên. Không có vòng thử lại trên mã SQLSTATE <code>40001</code> thì bạn chưa làm hệ thống đúng, bạn chỉ làm nó hỏng dưới tải. Phương án 3 sai gấp đôi: đây không phải đọc bẩn, và PostgreSQL nhận <code>READ UNCOMMITTED</code> ở khâu phân tích cú pháp rồi âm thầm coi nó là <code>READ COMMITTED</code> — nó không bao giờ đọc bẩn, nên viết dòng đó trong mã chép từ cơ sở dữ liệu khác chẳng có tác dụng gì. Phương án 4 đặt sai chỗ cái bất biến: <code>CHECK</code> ràng buộc một dòng, còn quy tắc này trải trên cả bảng. Đừng dùng <code>SERIALIZABLE</code> cho toàn hệ thống — phần lớn mã ứng dụng đã đúng ở <code>READ COMMITTED</code> vì một câu <code>UPDATE … SET balance = balance - 10</code> đọc và ghi trong cùng một lệnh, chẳng có gì để lệch.',
          ),
        }),

        // ── Chương 12 — Hàm, trigger & view ─────────────────────────────
        mcq({
          prompt: B(
            'Two identical functions differ only in their volatility marker. Called in a <code>WHERE</code> clause over 5 rows, one raised 5 notices and the other 1. And this <code>CREATE TABLE</code> was rejected. What ties the two observations together?' + code(
              'CREATE TABLE bad_gen (\n' +
              '  body text,\n' +
              '  tsv tsvector GENERATED ALWAYS AS (to_tsvector(body)) STORED\n' +
              ');\n' +
              '-- ERROR:  generation expression is not immutable',
            ),
            'Hai hàm giống hệt nhau, chỉ khác nhãn volatility. Gọi trong một mệnh đề <code>WHERE</code> trên 5 dòng, một hàm phát 5 thông báo còn hàm kia phát 1. Và câu <code>CREATE TABLE</code> dưới đây bị từ chối. Điều gì nối hai quan sát ấy lại?' + code(
              'CREATE TABLE bad_gen (\n' +
              '  body text,\n' +
              '  tsv tsvector GENERATED ALWAYS AS (to_tsvector(body)) STORED\n' +
              ');\n' +
              '-- ERROR:  generation expression is not immutable',
            ),
          ),
          options: [
            B('Both are about permissions: only a superuser may create <code>IMMUTABLE</code> functions or generated columns, because both let a role influence how other people\'s queries are planned', 'Cả hai đều là chuyện quyền: chỉ siêu người dùng mới được tạo hàm <code>IMMUTABLE</code> hay cột sinh, vì cả hai đều cho một vai trò tác động tới cách truy vấn của người khác được lập kế hoạch'),
            B('Both are about the return type — <code>tsvector</code> and the notice-raising function are both set-returning, and PostgreSQL can neither fold a set into a constant nor store one in a column', 'Cả hai đều là chuyện kiểu trả về — <code>tsvector</code> và hàm phát thông báo đều là hàm trả về tập hợp, mà PostgreSQL thì không gấp một tập hợp thành hằng số được, cũng không cất nó vào một cột được'),
            B('Both are about caching: PostgreSQL caches function results per statement, a generated column is just a cached expression, and a cache entry is discarded whenever the underlying row is updated', 'Cả hai đều là chuyện bộ nhớ đệm: PostgreSQL cache kết quả hàm theo từng câu lệnh, cột sinh chỉ là một biểu thức được cache, và mục cache bị bỏ đi mỗi khi dòng bên dưới được cập nhật'),
            B('Volatility is a <b>promise to the planner</b>. <code>IMMUTABLE</code> lets it evaluate once and fold the result into a constant, and it is the only level an index expression or a generated column may use — which is why the one-argument <code>to_tsvector</code>, whose result depends on a server setting, is refused', 'Volatility là một <b>lời hứa với bộ lập kế hoạch</b>. <code>IMMUTABLE</code> cho phép nó tính một lần rồi gấp kết quả thành hằng số, và đó là mức duy nhất mà một biểu thức chỉ mục hay một cột sinh được dùng — vì thế <code>to_tsvector</code> một tham số, thứ có kết quả phụ thuộc một tuỳ chọn của máy chủ, bị từ chối'),
          ],
          correct: 3,
          explanation: EX(
            'Both facts were verified on PostgreSQL 16.14, including that error text. The 5-versus-1 measurement is the promise being cashed in: <code>IMMUTABLE</code> means the same arguments always give the same result forever, so the planner evaluates it once and folds it into a constant, while <code>VOLATILE</code> — the <b>default</b> for a function you forgot to mark — promises nothing and must be called per row. The rejected table is the same promise being demanded: a stored generated column is computed once at write time, so its expression must be immutable, and the one-argument <code>to_tsvector(body)</code> reads <code>default_text_search_config</code>, a <em>server setting</em>, so the same input can stem differently on your laptop and on the VPS. Pass the configuration explicitly — <code>to_tsvector(\'english\', body)</code> — and it is accepted. The three levels: <code>IMMUTABLE</code> (no database access at all), <code>STABLE</code> (same result within one statement, may read tables), <code>VOLATILE</code> (anything). The danger is that <b>PostgreSQL does not verify the promise</b>: mark a table-reading function <code>IMMUTABLE</code> and it gets folded against data from some earlier moment, giving stale answers with no error — and an expression index built on it silently disagrees with the table forever. When unsure, use <code>STABLE</code>.',
            'Cả hai sự kiện đều đã kiểm trên PostgreSQL 16.14, kể cả thông báo lỗi đó. Phép đo 5-so-với-1 chính là lời hứa được đem ra dùng: <code>IMMUTABLE</code> nghĩa là cùng đối số thì mãi mãi cùng kết quả, nên bộ lập kế hoạch tính một lần rồi gấp thành hằng số, trong khi <code>VOLATILE</code> — <b>mặc định</b> cho một hàm bạn quên đánh nhãn — chẳng hứa gì nên phải gọi cho từng dòng. Cái bảng bị từ chối là chính lời hứa ấy bị đòi hỏi: một cột sinh lưu trữ được tính một lần lúc ghi, nên biểu thức của nó buộc phải immutable, mà <code>to_tsvector(body)</code> một tham số lại đọc <code>default_text_search_config</code>, một <em>tuỳ chọn của máy chủ</em>, nên cùng một đầu vào có thể rút gốc từ khác nhau trên máy bạn và trên VPS. Truyền cấu hình tường minh — <code>to_tsvector(\'english\', body)</code> — là nó được chấp nhận. Ba mức: <code>IMMUTABLE</code> (không truy cập cơ sở dữ liệu chút nào), <code>STABLE</code> (cùng kết quả trong một câu lệnh, được đọc bảng), <code>VOLATILE</code> (làm gì cũng được). Điều nguy hiểm là <b>PostgreSQL không kiểm chứng lời hứa</b>: đánh nhãn <code>IMMUTABLE</code> cho một hàm có đọc bảng thì nó bị gấp lại theo dữ liệu ở một thời điểm nào đó trước kia, cho ra câu trả lời cũ mà không báo lỗi — và một chỉ mục biểu thức dựng trên nó sẽ lệch với bảng vĩnh viễn. Không chắc thì dùng <code>STABLE</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'An <code>INSERT</code> reported <code>INSERT 0 0</code> and the table stayed empty, with no error at all. A <code>BEFORE INSERT … FOR EACH ROW</code> trigger is attached. What happened?' + code(
              'CREATE FUNCTION nuot() RETURNS trigger LANGUAGE plpgsql AS $$\n' +
              'BEGIN RETURN NULL; END; $$;\n' +
              '\n' +
              'CREATE TRIGGER bay_before BEFORE INSERT ON bay\n' +
              '  FOR EACH ROW EXECUTE FUNCTION nuot();\n' +
              '\n' +
              "INSERT INTO bay VALUES (1, 'a');   -- INSERT 0 0",
            ),
            'Một lệnh <code>INSERT</code> báo <code>INSERT 0 0</code> và bảng vẫn rỗng, không lỗi nào cả. Có một trigger <code>BEFORE INSERT … FOR EACH ROW</code> gắn vào bảng. Chuyện gì đã xảy ra?' + code(
              'CREATE FUNCTION nuot() RETURNS trigger LANGUAGE plpgsql AS $$\n' +
              'BEGIN RETURN NULL; END; $$;\n' +
              '\n' +
              'CREATE TRIGGER bay_before BEFORE INSERT ON bay\n' +
              '  FOR EACH ROW EXECUTE FUNCTION nuot();\n' +
              '\n' +
              "INSERT INTO bay VALUES (1, 'a');   -- INSERT 0 0",
            ),
          ),
          options: [
            B('Returning <code>NULL</code> from a <code>BEFORE … FOR EACH ROW</code> trigger <b>silently skips that row</b> — the second number in <code>INSERT 0 0</code> is the row count, and the row simply never existed', 'Trả về <code>NULL</code> từ một trigger <code>BEFORE … FOR EACH ROW</code> sẽ <b>âm thầm bỏ qua dòng đó</b> — con số thứ hai trong <code>INSERT 0 0</code> là số dòng, và dòng ấy đơn giản là chưa từng tồn tại'),
            B('The trigger function has no <code>RETURN NEW</code>, so PostgreSQL raised an internal error that the client swallowed', 'Hàm trigger không có <code>RETURN NEW</code>, nên PostgreSQL ném một lỗi nội bộ mà client nuốt mất'),
            B('The row was inserted and then removed by the trigger firing a second time on itself', 'Dòng đã được chèn rồi bị chính trigger xoá đi khi nó tự kích hoạt lần thứ hai'),
            B('<code>INSERT 0 0</code> is the normal tag for a single-row insert; the first number is the row count and it is always 0 for one row', '<code>INSERT 0 0</code> là nhãn bình thường của một lệnh chèn một dòng; con số đầu là số dòng và với một dòng thì nó luôn bằng 0'),
          ],
          correct: 0,
          explanation: EX(
            'Verified on PostgreSQL 16.14: the statement reported <code>INSERT 0 0</code> and <code>count(*)</code> came back 0, with no error. This is a real feature — it is how you build a filtering trigger that drops rows you do not want — but it is also what happens when a PL/pgSQL branch falls off the end without returning <code>NEW</code>, which is why lesson 12.2 states the rule: <b>every code path in a <code>BEFORE</code> trigger must end in <code>RETURN NEW</code></b> unless you deliberately mean to drop the row. Option 4 has the tag backwards: in <code>INSERT oid count</code> the first number is a legacy OID field, always 0 on a modern server, and the <b>second</b> is the row count. The related decision worth carrying is <code>BEFORE</code> versus <code>AFTER</code>: only a <code>BEFORE … FOR EACH ROW</code> trigger can modify the row by assigning to <code>NEW</code>, which is why stamping <code>updated_at</code> has to live there, and constraints are then applied to the row <em>as the trigger left it</em>. An <code>AFTER</code> trigger runs once the row is written and cannot change it — use it for audit rows and other side effects, remembering that it runs inside the same transaction, so if the audit insert fails the original statement fails with it.',
            'Đã kiểm trên PostgreSQL 16.14: câu lệnh báo <code>INSERT 0 0</code> và <code>count(*)</code> trả về 0, không có lỗi nào. Đây là một tính năng thật — chính là cách người ta dựng một trigger lọc để bỏ những dòng không muốn — nhưng nó cũng là thứ xảy ra khi một nhánh PL/pgSQL chạy hết mà không trả về <code>NEW</code>, và vì thế bài 12.2 phát biểu thành quy tắc: <b>mọi nhánh mã trong một trigger <code>BEFORE</code> đều phải kết thúc bằng <code>RETURN NEW</code></b>, trừ khi bạn cố ý muốn bỏ dòng đó. Phương án 4 hiểu ngược cái nhãn: trong <code>INSERT oid count</code>, con số đầu là trường OID cũ, luôn bằng 0 trên máy chủ hiện đại, còn con số <b>thứ hai</b> mới là số dòng. Quyết định liên quan đáng mang theo là <code>BEFORE</code> so với <code>AFTER</code>: chỉ trigger <code>BEFORE … FOR EACH ROW</code> mới sửa được dòng bằng cách gán vào <code>NEW</code>, và vì thế việc đóng dấu <code>updated_at</code> buộc phải nằm ở đó, rồi các ràng buộc được áp lên dòng <em>đúng như trigger để lại</em>. Trigger <code>AFTER</code> chạy sau khi dòng đã ghi và không sửa được nó — hãy dùng cho bản ghi kiểm toán và các tác dụng phụ khác, nhớ rằng nó chạy trong cùng giao dịch, nên nếu lệnh chèn kiểm toán hỏng thì câu lệnh gốc hỏng theo.',
          ),
        }),

        mcq({
          prompt: B(
            'A dashboard reads a materialized view. On PostgreSQL 16, <code>REFRESH MATERIALIZED VIEW CONCURRENTLY note_summary_mv;</code> failed. What is the error saying, and what is the cost of the plain form?' + code(
              'ERROR:  cannot refresh materialized view "public.note_summary_mv" concurrently\n' +
              'HINT:   Create a unique index with no WHERE clause on one or more\n' +
              '        columns of the materialized view.',
            ),
            'Một bảng điều khiển đọc từ một materialized view. Trên PostgreSQL 16, lệnh <code>REFRESH MATERIALIZED VIEW CONCURRENTLY note_summary_mv;</code> thất bại. Lỗi này nói gì, và cái giá của dạng thường là gì?' + code(
              'ERROR:  cannot refresh materialized view "public.note_summary_mv" concurrently\n' +
              'HINT:   Create a unique index with no WHERE clause on one or more\n' +
              '        columns of the materialized view.',
            ),
          ),
          options: [
            B('The view is stale and must be refreshed non-concurrently once before <code>CONCURRENTLY</code> becomes available, since the first refresh is what records the row identifiers', 'View đang cũ và phải được refresh không-đồng-thời một lần trước khi <code>CONCURRENTLY</code> dùng được, vì lần refresh đầu tiên mới là lúc ghi lại định danh của từng dòng'),
            B('<code>CONCURRENTLY</code> requires the view to be defined without <code>GROUP BY</code>, exactly like an automatically updatable view, and the hint names an index only as the recommended workaround', '<code>CONCURRENTLY</code> đòi view phải được định nghĩa không có <code>GROUP BY</code>, y hệt như một view tự động cập nhật được, và dòng gợi ý chỉ nêu chỉ mục như một cách lách được khuyến nghị'),
            B('<code>CONCURRENTLY</code> needs a unique index to <b>match old rows against new ones</b> so it can apply a difference instead of swapping the whole relation; without it, a plain <code>REFRESH</code> takes an <code>ACCESS EXCLUSIVE</code> lock and readers block for the entire rebuild', '<code>CONCURRENTLY</code> cần một unique index để <b>đối chiếu dòng cũ với dòng mới</b> nhằm áp phần chênh lệch thay vì tráo cả quan hệ; không có nó, một lệnh <code>REFRESH</code> thường lấy khoá <code>ACCESS EXCLUSIVE</code> và người đọc bị chặn suốt quá trình dựng lại'),
            B('It is a permission error — <code>CONCURRENTLY</code> may only be run by the view\'s owner, and the unique index is how ownership is recorded', 'Đó là lỗi quyền — chỉ chủ sở hữu view mới chạy được <code>CONCURRENTLY</code>, và unique index là nơi ghi nhận quyền sở hữu'),
          ],
          correct: 2,
          explanation: EX(
            'The error and hint were reproduced verbatim on PostgreSQL 16.14. A concurrent refresh computes the new contents and then applies the <em>difference</em>, which requires a stable way to identify each row — that is the unique index, and it must have no <code>WHERE</code> clause. It is slower overall and does more I/O, but readers keep working throughout. Without it you get the plain form, which rebuilds the relation under an <code>ACCESS EXCLUSIVE</code> lock, so lesson 12.4 puts it sharply: <b>the refresh you schedule at peak hour to "keep it fresh" is an outage on a timer</b>. The larger trade is the point of the whole lesson — a view stores a query and is always exactly as fresh as its tables at whatever the query costs, every time; a materialized view stores rows and is fast and stale until you refresh it. And a materialized view has no expiry, no background job and no warning, so one created and never scheduled will serve the numbers from the afternoon it was created, for months, and every one of those queries will be fast and wrong. Create the refresh in the same change, and make the refresh time visible on the dashboard so a stale number looks stale instead of looking like a business trend.',
            'Lỗi và dòng gợi ý đã được tái hiện nguyên văn trên PostgreSQL 16.14. Một lần refresh đồng thời tính ra nội dung mới rồi áp <em>phần chênh lệch</em>, việc đó đòi một cách ổn định để nhận diện từng dòng — đó chính là unique index, và nó không được có mệnh đề <code>WHERE</code>. Cách này tổng thể chậm hơn và tốn I/O hơn, nhưng người đọc vẫn làm việc suốt quá trình. Không có nó thì bạn dùng dạng thường, thứ dựng lại quan hệ dưới khoá <code>ACCESS EXCLUSIVE</code>, nên bài 12.4 nói rất sắc: <b>lần refresh bạn hẹn giờ vào giờ cao điểm để "giữ cho tươi" chính là một sự cố đặt lịch sẵn</b>. Đánh đổi lớn hơn mới là điểm của cả bài — một view lưu một truy vấn và luôn tươi đúng bằng các bảng của nó, với cái giá là chi phí truy vấn, mỗi lần đọc; một materialized view lưu các dòng và nhanh nhưng cũ cho tới khi bạn refresh. Và một materialized view không có hạn dùng, không có job nền, không có cảnh báo, nên cái nào tạo ra rồi quên lên lịch sẽ phục vụ những con số của buổi chiều nó ra đời, suốt nhiều tháng, và mọi truy vấn đó đều nhanh và sai. Hãy tạo lệnh refresh ngay trong cùng lần thay đổi, và hiện thời điểm refresh lên bảng điều khiển để một con số cũ trông ra cũ thay vì trông như một xu hướng kinh doanh.',
          ),
        }),

        // ── Chương 13 — JSONB & full-text search ────────────────────────
        mcq({
          prompt: B(
            'A product has <code>props</code> = ' + c('{"price": 89}') + '. Run on PostgreSQL 16, these two return <b>f</b> and <b>t</b>. What is the lesson?' + code(
              "SELECT (props ->> 'price') < '500'            AS a;   -- f\n" +
              "SELECT ((props ->> 'price')::numeric) < 500   AS b;   -- t",
            ),
            'Một sản phẩm có <code>props</code> = ' + c('{"price": 89}') + '. Chạy trên PostgreSQL 16, hai câu này trả về <b>f</b> và <b>t</b>. Bài học là gì?' + code(
              "SELECT (props ->> 'price') < '500'            AS a;   -- f\n" +
              "SELECT ((props ->> 'price')::numeric) < 500   AS b;   -- t",
            ),
          ),
          options: [
            B('<code>-&gt;&gt;</code> returns NULL for numeric values, and NULL comparisons are never true — you must use <code>-&gt;</code> for numbers', '<code>-&gt;&gt;</code> trả về NULL với giá trị số, mà so sánh với NULL không bao giờ đúng — phải dùng <code>-&gt;</code> cho số'),
            B('Everything out of <code>-&gt;&gt;</code> is <b>text, including numbers</b>, so A compares strings and <code>\'89\'</code> sorts after <code>\'500\'</code> — the answer is silently wrong until you cast', 'Mọi thứ ra từ <code>-&gt;&gt;</code> đều là <b>văn bản, kể cả số</b>, nên A so sánh chuỗi và <code>\'89\'</code> đứng sau <code>\'500\'</code> — câu trả lời sai một cách im lặng cho tới khi bạn ép kiểu'),
            B('A is false because the key is missing; jsonb normalises <code>price</code> to <code>Price</code> when it stores the document', 'A sai vì thiếu khoá; jsonb chuẩn hoá <code>price</code> thành <code>Price</code> khi lưu tài liệu'),
            B('The two are equivalent and the difference is a display artefact of psql\'s boolean rendering', 'Hai câu là tương đương và khác biệt chỉ là hiện tượng hiển thị của cách psql vẽ kiểu boolean'),
          ],
          correct: 1,
          explanation: EX(
            'Verified: <code>f</code> then <code>t</code>. <code>-&gt;&gt;</code> extracts a field <b>as text</b>, so the comparison is lexicographic — <code>\'89\'</code> starts with <code>8</code> and sorts after <code>\'500\'</code>, and the query returns the wrong products with no error anywhere. The companion distinction from the same lesson: <code>-&gt;</code> returns <b>jsonb</b>, so <code>props -&gt; \'brand\'</code> gives <code>"Acme"</code> <em>with quotes</em> and <code>props -&gt; \'brand\' = \'Acme\'</code> fails, while <code>-&gt;&gt;</code> gives the bare text. A missing key yields NULL rather than an error, which is convenient and dangerous in equal measure — a typo in a key name produces empty results rather than a complaint. Two habits follow. Cast at the boundary: <code>(props -&gt;&gt; \'price\')::numeric</code>. And when you find yourself doing that in production, promote the key to a real column — a generated column works without a rewrite: <code>price numeric GENERATED ALWAYS AS ((props-&gt;&gt;\'price\')::numeric) STORED</code>. The planner has no per-key statistics inside a blob, so anything you filter on regularly deserves a column; JSONB is for the long tail.',
            'Đã kiểm: <code>f</code> rồi <code>t</code>. <code>-&gt;&gt;</code> lấy một trường ra <b>dưới dạng văn bản</b>, nên phép so sánh là so theo từ điển — <code>\'89\'</code> bắt đầu bằng <code>8</code> nên đứng sau <code>\'500\'</code>, và truy vấn trả về sai sản phẩm mà chẳng có lỗi ở đâu cả. Phân biệt anh em cùng bài: <code>-&gt;</code> trả về <b>jsonb</b>, nên <code>props -&gt; \'brand\'</code> cho ra <code>"Acme"</code> <em>kèm dấu nháy</em> và <code>props -&gt; \'brand\' = \'Acme\'</code> thất bại, trong khi <code>-&gt;&gt;</code> cho ra văn bản trần. Một khoá không tồn tại thì trả về NULL chứ không báo lỗi, vừa tiện vừa nguy hiểm ngang nhau — gõ sai tên khoá thì ra kết quả rỗng chứ không ai kêu ca. Hai thói quen suy ra từ đây. Ép kiểu ngay tại biên: <code>(props -&gt;&gt; \'price\')::numeric</code>. Và khi thấy mình phải làm thế trên production thì hãy nâng khoá đó thành cột thật — một cột sinh làm được mà không cần viết lại: <code>price numeric GENERATED ALWAYS AS ((props-&gt;&gt;\'price\')::numeric) STORED</code>. Bộ lập kế hoạch không có thống kê theo từng khoá bên trong một khối jsonb, nên thứ gì bạn lọc thường xuyên đều xứng đáng có một cột; JSONB dành cho phần đuôi dài.',
          ),
        }),

        mcq({
          prompt: B(
            'A table has ' + c('CREATE INDEX ev_props_gin ON ev USING GIN (props)') + '. Which of these queries can that index <b>not</b> accelerate at all?',
            'Một bảng có ' + c('CREATE INDEX ev_props_gin ON ev USING GIN (props)') + '. Truy vấn nào trong số này chỉ mục đó <b>không</b> tăng tốc được chút nào?',
          ),
          options: [
            B(c("WHERE props @> '{\"brand\":\"Acme\"}'") + ' — containment on a top-level key', c("WHERE props @> '{\"brand\":\"Acme\"}'") + ' — phép chứa trên một khoá ở cấp cao nhất'),
            B(c("WHERE props @> '{\"tags\":[\"light\"]}'") + ' — containment that has to look inside an array', c("WHERE props @> '{\"tags\":[\"light\"]}'") + ' — phép chứa phải nhìn vào bên trong một mảng'),
            B(c("WHERE jsonb_exists(props, 'specs')") + ' — an existence check on a key', c("WHERE jsonb_exists(props, 'specs')") + ' — một phép kiểm sự tồn tại của khoá'),
            B(c("WHERE (props ->> 'price')::numeric < 500") + ' — a range comparison on a value extracted out of the document', c("WHERE (props ->> 'price')::numeric < 500") + ' — một phép so sánh khoảng trên một giá trị rút ra khỏi tài liệu'),
          ],
          correct: 3,
          explanation: EX(
            'A GIN index on a <code>jsonb</code> column indexes <b>containment and existence, not comparison</b>. The first three are exactly what it is for — <code>@&gt;</code> matches at any depth and looks inside arrays, and <code>?</code> / <code>jsonb_exists</code> tests for a key. The fourth applies a function and a cast to the column, which is the same trap as <code>lower(email)</code> in chapter 9: the index stores the document, not the extracted numeric, so the query gets a sequential scan and the index costs you write time for nothing. Two fixes: an expression index on exactly that expression, <code>CREATE INDEX ON ev (((props-&gt;&gt;\'price\')::numeric))</code>, or better, promote the key to a column. Two more details from the measurements. GIN plans always look the same — <code>Bitmap Index Scan</code> → <code>Bitmap Heap Scan</code> with a <code>Recheck Cond</code>, because the index alone cannot prove containment — and their value depends on selectivity exactly as a B-tree does: the measured speedup was 45× on a query matching a fraction of the table and only 42% on one matching a quarter of it. Finally, <code>jsonb_path_ops</code> builds a smaller, faster index but supports <b>only</b> <code>@&gt;</code>, so choose the default operator class if you also need existence checks. And note the driver trap: in most client libraries <code>?</code> is the bind-parameter placeholder, so write <code>jsonb_exists(props, \'specs\')</code> or escape it as <code>??</code>.',
            'Một chỉ mục GIN trên cột <code>jsonb</code> đánh chỉ mục cho <b>phép chứa và phép tồn tại, không phải phép so sánh</b>. Ba phương án đầu đúng là việc của nó — <code>@&gt;</code> khớp ở mọi độ sâu và nhìn được vào trong mảng, còn <code>?</code> / <code>jsonb_exists</code> kiểm tra một khoá. Phương án thứ tư áp một hàm và một phép ép kiểu lên cột, y hệt cái bẫy <code>lower(email)</code> ở chương 9: chỉ mục lưu tài liệu chứ không lưu con số đã rút ra, nên truy vấn nhận một lần quét tuần tự còn chỉ mục thì bắt bạn trả phí ghi mà chẳng đổi lại gì. Hai cách sửa: một chỉ mục biểu thức trên đúng biểu thức đó, <code>CREATE INDEX ON ev (((props-&gt;&gt;\'price\')::numeric))</code>, hoặc tốt hơn là nâng khoá lên thành cột. Thêm hai chi tiết từ các phép đo. Plan của GIN lúc nào cũng cùng một dáng — <code>Bitmap Index Scan</code> → <code>Bitmap Heap Scan</code> kèm <code>Recheck Cond</code>, vì riêng chỉ mục không chứng minh được phép chứa — và giá trị của nó phụ thuộc độ chọn lọc y như B-tree: mức tăng tốc đo được là 45 lần với truy vấn khớp một phần nhỏ của bảng, và chỉ 42% với truy vấn khớp một phần tư. Cuối cùng, <code>jsonb_path_ops</code> dựng chỉ mục nhỏ hơn và nhanh hơn nhưng <b>chỉ</b> hỗ trợ <code>@&gt;</code>, nên hãy chọn lớp toán tử mặc định nếu bạn còn cần kiểm sự tồn tại. Và nhớ cái bẫy của driver: trong phần lớn thư viện client, <code>?</code> là ký tự giữ chỗ tham số, nên hãy viết <code>jsonb_exists(props, \'specs\')</code> hoặc thoát nó thành <code>??</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Run on PostgreSQL 16. Why do the two calls disagree, and which one belongs in production code?' + code(
              "SELECT to_tsvector('english', 'jumping jumped jumps');\n" +
              "--  'jump':1,2,3\n" +
              '\n' +
              "SELECT to_tsvector('simple',  'jumping jumped jumps');\n" +
              "--  'jumped':2 'jumping':1 'jumps':3",
            ),
            'Chạy trên PostgreSQL 16. Vì sao hai lời gọi cho kết quả khác nhau, và cái nào nên nằm trong mã production?' + code(
              "SELECT to_tsvector('english', 'jumping jumped jumps');\n" +
              "--  'jump':1,2,3\n" +
              '\n' +
              "SELECT to_tsvector('simple',  'jumping jumped jumps');\n" +
              "--  'jumped':2 'jumping':1 'jumps':3",
            ),
          ),
          options: [
            B('The configuration decides stemming and stop words. <code>english</code> reduced three words to one lexeme at three positions; <code>simple</code> only lowercases and splits. Always pass it <b>explicitly</b> — the one-argument form reads a server setting, so the same text can stem differently on a laptop and on the VPS', 'Cấu hình quyết định việc rút gốc từ và loại từ dừng. <code>english</code> đã rút ba từ về một lexeme ở ba vị trí; <code>simple</code> chỉ viết thường và tách từ. Luôn truyền nó <b>tường minh</b> — dạng một tham số đọc một tuỳ chọn của máy chủ, nên cùng một đoạn chữ có thể rút gốc khác nhau trên máy cá nhân và trên VPS'),
            B('<code>simple</code> is a faster variant of <code>english</code> that caches its output rather than re-running the parser; either configuration is fine as long as both sides of the <code>@@</code> operator use the same one', '<code>simple</code> là biến thể nhanh hơn của <code>english</code>, có cache đầu ra thay vì chạy lại bộ phân tích; dùng cấu hình nào cũng được miễn hai vế của toán tử <code>@@</code> dùng cùng một cái'),
            B('The difference is the input, not the configuration — <code>english</code> deduplicates repeated words while <code>simple</code> keeps them', 'Khác biệt nằm ở đầu vào chứ không phải cấu hình — <code>english</code> loại các từ lặp còn <code>simple</code> giữ lại'),
            B('<code>simple</code> is the correct choice everywhere because it never loses information, and stemming is only a display convenience', '<code>simple</code> là lựa chọn đúng ở mọi nơi vì nó không mất thông tin, còn rút gốc từ chỉ là tiện lợi khi hiển thị'),
          ],
          correct: 0,
          explanation: EX(
            'Both outputs were reproduced on PostgreSQL 16.14. Full-text search does not search <em>text</em>, it searches <b>lexemes</b>: the pipeline parses tokens, drops stop words, stems, and keeps positions — and <code>\'jump\':1,2,3</code> is three words collapsed to one lexeme at three positions, which is why searching <code>fox</code> finds <em>foxes</em>. The query side runs the same pipeline, so both sides must use the same configuration or nothing matches. The reason to pass it explicitly is not style: the one-argument <code>to_tsvector(body)</code> uses <code>default_text_search_config</code>, a server setting, and a <code>GENERATED</code> column built on that form is <b>rejected outright</b> because it is not immutable (see question 36). Option 3 gets the mechanism wrong — the deduplication is stemming, not deduplication. Option 4 inverts the trade: without stemming, a search for "jumping" misses "jumped". For Vietnamese the honest position is that the built-in configurations do not stem it, and <code>\'simple\'</code> merely lowercases and splits on whitespace — reasonable, since Vietnamese words are already separated and mostly uninflected, but it means no stemming and no stop-word removal, so <code>unaccent</code> plus <code>\'simple\'</code> is the usual working combination, and trigram search (13.4) often does better on short strings like names.',
            'Cả hai kết quả đều đã tái hiện trên PostgreSQL 16.14. Full-text search không tìm trên <em>chữ</em> mà tìm trên <b>lexeme</b>: đường ống tách token, bỏ từ dừng, rút gốc từ, và giữ lại vị trí — và <code>\'jump\':1,2,3</code> là ba từ gộp về một lexeme ở ba vị trí, đó là lý do tìm <code>fox</code> lại ra <em>foxes</em>. Phía truy vấn chạy đúng đường ống ấy, nên hai vế phải dùng cùng một cấu hình, không thì chẳng khớp gì cả. Lý do phải truyền tường minh không phải chuyện phong cách: dạng một tham số <code>to_tsvector(body)</code> dùng <code>default_text_search_config</code>, một tuỳ chọn của máy chủ, và một cột <code>GENERATED</code> dựng trên dạng đó bị <b>từ chối thẳng</b> vì không immutable (xem câu 36). Phương án 3 hiểu sai cơ chế — thứ diễn ra là rút gốc từ, không phải loại trùng. Phương án 4 đảo ngược đánh đổi: không rút gốc từ thì tìm "jumping" sẽ trượt "jumped". Với tiếng Việt, quan điểm trung thực là các cấu hình dựng sẵn không rút gốc từ cho nó, và <code>\'simple\'</code> chỉ viết thường rồi tách theo khoảng trắng — cũng hợp lý, vì từ tiếng Việt vốn đã tách rời và hầu như không biến hình, nhưng như thế nghĩa là không rút gốc từ và không loại từ dừng, nên <code>unaccent</code> cộng <code>\'simple\'</code> là tổ hợp hay dùng, còn tìm bằng trigram (bài 13.4) thường tốt hơn trên các chuỗi ngắn như tên người.',
          ),
        }),

        // ── Chương 14 — Kết nối, pool & vận hành ────────────────────────
        mcq({
          prompt: B(
            'Production hits <code>sorry, too many clients already</code> on a 6 GB VPS with <code>max_connections = 100</code>. A colleague proposes raising it to 500. What does that actually trade?',
            'Production báo <code>sorry, too many clients already</code> trên một VPS 6 GB với <code>max_connections = 100</code>. Một đồng nghiệp đề nghị nâng lên 500. Thực chất đó là đánh đổi gì?',
          ),
          options: [
            B('Nothing meaningful — a connection slot is a lightweight handle that costs memory only while a query is actually running, so an idle pool is free and the limit is really just a safety valve', 'Chẳng đánh đổi gì đáng kể — một suất kết nối chỉ là một tay cầm nhẹ, chỉ tốn bộ nhớ khi thật sự có truy vấn đang chạy, nên một pool rỗi thì miễn phí và giới hạn kia thật ra chỉ là cái van an toàn'),
            B('It trades a small, uniform latency increase for far more headroom under load, which is why managed cloud providers routinely default their instances to several thousand connections', 'Đánh đổi một chút độ trễ tăng đều để lấy nhiều dư địa hơn hẳn khi có tải, và vì thế các nhà cung cấp đám mây có quản lý vẫn mặc định vài nghìn kết nối cho máy chủ của họ'),
            B('It trades a <b>clean refusal</b> for the <b>OOM killer</b>: PostgreSQL forks a real OS process per connection, each active backend can allocate <code>work_mem</code> several times over, and past a few hundred backends throughput <em>falls</em> as you add connections', 'Đánh đổi một <b>lời từ chối sạch sẽ</b> lấy <b>OOM killer</b>: PostgreSQL sinh một tiến trình hệ điều hành thật cho mỗi kết nối, mỗi backend đang chạy có thể cấp phát <code>work_mem</code> nhiều lần, và quá vài trăm backend thì thông lượng <em>giảm</em> khi thêm kết nối'),
            B('It trades disk for memory — more connections means more WAL, so the fix is to increase the WAL size at the same time', 'Đánh đổi đĩa lấy bộ nhớ — nhiều kết nối hơn nghĩa là nhiều WAL hơn, nên cách sửa là tăng kích thước WAL cùng lúc'),
          ],
          correct: 2,
          explanation: EX(
            'PostgreSQL forks an operating-system process for each client connection — not a thread, not a lightweight handle — which is a deliberate design with real benefits (a crashing backend cannot corrupt the others) and a real cost. Every slot consumes memory whether used or not, an active backend can allocate <code>work_mem</code> once per sort or hash node, and beyond roughly a few hundred backends the server spends a growing share of its time on cross-process bookkeeping. On a 6 GB VPS, 500 turns a clean "too many clients" error — which refuses new work while protecting what is running — into the OS killing the postmaster, which is a total outage. The real fix is arithmetic: <b>(processes × pool size) must fit under <code>max_connections</code>, with headroom</b>. This site\'s own case is 12 clients × pool 10 = 120 against a limit of 100, over-subscribed at rest and surviving only because all twelve are rarely busy at once — which is precisely why the failure arrives during a traffic spike rather than during testing. Size pools to the server, roughly <code>(cores × 2) + effective spindles</code>, which is why 10 is such a common default on a 4-core box; count every process that connects, including cron jobs, the migration runner, a metrics exporter and your own psql; and reach for PgBouncer only when the process count is genuinely large.',
            'PostgreSQL sinh một tiến trình hệ điều hành cho mỗi kết nối của client — không phải luồng, không phải một tay cầm nhẹ nhàng — đó là thiết kế có chủ đích với lợi ích thật (một backend sập không làm hỏng những cái khác) và cái giá thật. Mỗi suất kết nối ngốn bộ nhớ dù có dùng hay không, một backend đang chạy có thể cấp phát <code>work_mem</code> một lần cho mỗi nút sắp xếp hay băm, và vượt quá cỡ vài trăm backend thì máy chủ dành phần thời gian ngày một lớn cho việc sổ sách giữa các tiến trình. Trên một VPS 6 GB, con số 500 biến một lỗi "too many clients" sạch sẽ — thứ từ chối việc mới trong khi bảo vệ những việc đang chạy — thành cảnh hệ điều hành giết postmaster, tức là sập hoàn toàn. Cách sửa thật là phép tính: <b>(số tiến trình × kích thước pool) phải nhỏ hơn <code>max_connections</code>, có dư địa</b>. Chính trang này có 12 client × pool 10 = 120 so với giới hạn 100, tức là đã vượt ngay cả lúc rỗi, sống được chỉ vì cả mười hai hiếm khi bận cùng lúc — và đó chính là lý do sự cố đến vào lúc lưu lượng dồn chứ không đến lúc thử nghiệm. Hãy chỉnh pool theo máy chủ, cỡ <code>(số nhân × 2) + số đĩa hiệu dụng</code>, và vì thế 10 là mặc định rất hay gặp trên máy 4 nhân; đếm đủ mọi tiến trình có kết nối, kể cả job định kỳ, bộ chạy migration, một bộ xuất số liệu và cả psql của chính bạn; và chỉ dùng tới PgBouncer khi số tiến trình thật sự lớn.',
          ),
        }),

        mcq({
          prompt: B(
            'You put PgBouncer in <b>transaction</b> mode in front of PostgreSQL. Which set of things stops working reliably, and why?',
            'Bạn đặt PgBouncer ở chế độ <b>transaction</b> phía trước PostgreSQL. Nhóm thứ nào ngừng hoạt động một cách đáng tin, và vì sao?',
          ),
          options: [
            B('Joins across schemas, because a pooled server connection cannot keep a stable <code>search_path</code> resolution cache and so re-resolves every table name against whichever schema it happens to be pointing at', 'Các phép join xuyên schema, vì một kết nối máy chủ trong pool không giữ được bộ nhớ đệm phân giải <code>search_path</code> ổn định nên phải phân giải lại mọi tên bảng theo cái schema mà nó đang tình cờ trỏ tới'),
            B('Prepared statements, <code>SET</code> / session variables, session-scoped advisory locks and temp tables, and <code>LISTEN</code>/<code>NOTIFY</code> — anything held in <b>session state</b>, because consecutive transactions from one client land on different backends', 'Câu lệnh đã chuẩn bị, <code>SET</code> / biến phiên, khoá tư vấn phạm vi phiên và bảng tạm, cùng <code>LISTEN</code>/<code>NOTIFY</code> — mọi thứ nằm trong <b>trạng thái phiên</b>, vì các giao dịch liên tiếp của một client rơi vào những backend khác nhau'),
            B('Transactions longer than one statement, because transaction mode assigns a server connection per statement and returns it the moment that statement finishes rather than at <code>COMMIT</code>', 'Các giao dịch dài hơn một câu lệnh, vì chế độ transaction cấp một kết nối máy chủ cho mỗi câu lệnh và trả nó về ngay khi câu lệnh đó xong chứ không phải lúc <code>COMMIT</code>'),
            B('Nothing — transaction mode is the safe default that behaves exactly as if PgBouncer were not there, and it is <code>session</code> mode, which multiplexes far more aggressively, that breaks session state', 'Không gì cả — chế độ transaction là mặc định an toàn, cư xử y như thể không có PgBouncer, và chính chế độ <code>session</code>, thứ dồn kênh mạnh tay hơn nhiều, mới làm hỏng trạng thái phiên'),
          ],
          correct: 1,
          explanation: EX(
            'Transaction mode is what produces the big multiplexing ratios — hundreds of clients over a couple of dozen server connections — because a server connection is returned to the pool immediately after <code>COMMIT</code>. That is also exactly what breaks: the next transaction from the same client may be served by a different backend, so anything that lives in session state stops being reliable. Prepared statements are the one people meet first, as Prisma\'s <code>prepared statement "s0" already exists</code>; the fix is <code>pgbouncer=true</code> in the connection URL, which disables the prepared-statement cache. For <code>SET</code>, use <code>SET LOCAL</code> inside an explicit transaction. For advisory locks, use the transaction-scoped <code>pg_advisory_xact_lock</code>. <code>LISTEN</code>/<code>NOTIFY</code> does not work at all in this mode and needs a direct connection bypassing the pooler — and so do migrations, which is why Prisma supports <code>DATABASE_URL</code> through PgBouncer for the app and <code>DIRECT_URL</code> straight to PostgreSQL for <code>prisma migrate</code>. Option 3 describes <code>statement</code> mode, which really does make multi-statement transactions impossible. Option 4 has it backwards: <code>session</code> mode is the safe one precisely because it barely multiplexes, which is also why it buys so little. The trap worth remembering: adding PgBouncer <b>without shrinking the app pools</b> only moves the failure — 12 × 10 client connections now terminate at PgBouncer, requests queue there, and you get client-side timeouts with no error in the PostgreSQL log at all.',
            'Chế độ transaction là thứ tạo ra các tỷ lệ dồn kênh lớn — hàng trăm client trên vài chục kết nối máy chủ — vì kết nối máy chủ được trả về pool ngay sau <code>COMMIT</code>. Và đó cũng đúng là thứ bị hỏng: giao dịch kế tiếp của cùng một client có thể do một backend khác phục vụ, nên mọi thứ sống trong trạng thái phiên đều hết đáng tin. Câu lệnh đã chuẩn bị là thứ người ta gặp đầu tiên, dưới dạng lỗi <code>prepared statement "s0" already exists</code> của Prisma; cách sửa là <code>pgbouncer=true</code> trong URL kết nối, thứ tắt bộ nhớ đệm câu lệnh chuẩn bị. Với <code>SET</code>, hãy dùng <code>SET LOCAL</code> bên trong một giao dịch tường minh. Với khoá tư vấn, hãy dùng <code>pg_advisory_xact_lock</code> phạm vi giao dịch. <code>LISTEN</code>/<code>NOTIFY</code> thì không chạy được chút nào ở chế độ này và cần một kết nối trực tiếp vòng qua pooler — migration cũng vậy, và vì thế Prisma hỗ trợ <code>DATABASE_URL</code> đi qua PgBouncer cho ứng dụng còn <code>DIRECT_URL</code> đi thẳng tới PostgreSQL cho <code>prisma migrate</code>. Phương án 3 mô tả chế độ <code>statement</code>, thứ đúng là làm cho giao dịch nhiều câu lệnh trở nên bất khả. Phương án 4 nói ngược: chế độ <code>session</code> mới là cái an toàn, chính vì nó gần như không dồn kênh, và cũng vì thế nó chẳng đem lại bao nhiêu. Cái bẫy đáng nhớ: thêm PgBouncer mà <b>không thu nhỏ pool của ứng dụng</b> thì chỉ dời chỗ hỏng — 12 × 10 kết nối client giờ kết thúc ở PgBouncer, các yêu cầu xếp hàng ở đó, và bạn nhận về những lần hết giờ phía client mà trong log của PostgreSQL không có lỗi nào cả.',
          ),
        }),

        mcq({
          prompt: B(
            'A one-million-row table is updated constantly. With default settings, how many dead tuples accumulate before autovacuum even considers it, and does a plain <code>VACUUM</code> then shrink the file?' + code(
              'autovacuum_vacuum_threshold    = 50\n' +
              'autovacuum_vacuum_scale_factor = 0.2\n' +
              'autovacuum_naptime             = 60',
            ),
            'Một bảng một triệu dòng bị cập nhật liên tục. Với thiết lập mặc định, bao nhiêu dòng chết tích lại trước khi autovacuum mới bắt đầu xem xét nó, và một lệnh <code>VACUUM</code> thường sau đó có làm co file lại không?' + code(
              'autovacuum_vacuum_threshold    = 50\n' +
              'autovacuum_vacuum_scale_factor = 0.2\n' +
              'autovacuum_naptime             = 60',
            ),
          ),
          options: [
            B('50 dead tuples — the scale factor applies only to <code>ANALYZE</code> — and yes, <code>VACUUM</code> then returns the freed space to the operating system', '50 dòng chết — hệ số tỷ lệ chỉ áp cho <code>ANALYZE</code> — và có, sau đó <code>VACUUM</code> trả phần chỗ vừa giải phóng về cho hệ điều hành'),
            B('200,000 exactly, since the threshold is added only once the scale factor has already been exceeded — and no, only <code>ANALYZE</code> reclaims space, which is why the two are always run together', 'Đúng 200.000, vì phần ngưỡng chỉ được cộng thêm khi đã vượt hệ số tỷ lệ — và không, chỉ <code>ANALYZE</code> mới thu hồi được chỗ, và vì thế hai lệnh luôn được chạy cùng nhau'),
            B('1,000,000 — autovacuum waits for a full table\'s worth of churn before it will touch a table this large — and yes, the file shrinks back to its original size once it runs', '1.000.000 — autovacuum chờ tới khi lượng thay đổi bằng cả bảng rồi mới đụng vào một bảng lớn thế này — và có, file co lại về kích thước ban đầu khi nó chạy'),
            B('<b>200,050</b> — the threshold is <code>50 + 0.2 × rows</code>, so the table may bloat by 20% first — and <b>no</b>: plain <code>VACUUM</code> marks the space reusable <em>by that table</em>, it does not return it to the OS', '<b>200.050</b> — ngưỡng là <code>50 + 0,2 × số dòng</code>, nên bảng có thể phình 20% trước đã — và <b>không</b>: <code>VACUUM</code> thường chỉ đánh dấu chỗ đó dùng lại được <em>bởi chính bảng ấy</em>, chứ không trả về cho hệ điều hành'),
          ],
          correct: 3,
          explanation: EX(
            'The formula is <code>threshold + scale_factor × row_count</code>, so 50 + 0.2 × 1,000,000 = <b>200,050</b>. Lesson 14.3 calls this the single most common autovacuum misconfiguration — and it is a <em>default</em>, not a mistake anyone made: on a large, frequently-updated table it means 20% bloat before cleanup begins, and each pass then has more work to do and interferes more. The right move is per-table, not global: <code>ALTER TABLE … SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000)</code> on the two or three tables that actually churn, which is roughly "vacuum after 1% churn". The second half is measured in chapter 11: a 100,000-row table grew from 4,608 kB to 13 MB across two update rounds, and after <code>VACUUM</code> the dead tuples were gone but the file was <b>still 13 MB</b>. Only <code>VACUUM FULL</code> rewrites the table to return space, and it takes an <code>ACCESS EXCLUSIVE</code> lock that blocks even <code>SELECT</code> and needs room for a second copy — never routine; <code>pg_repack</code> achieves the same without the long lock. Note also that autovacuum wakes only every <code>autovacuum_naptime</code> (60 s), so it is not instant and is not meant to be, and that <code>ANALYZE</code> is a different job entirely — refreshing planner statistics, which is why bad plans right after a bulk load are usually a missing <code>ANALYZE</code> rather than a missing index.',
            'Công thức là <code>ngưỡng + hệ số × số dòng</code>, nên 50 + 0,2 × 1.000.000 = <b>200.050</b>. Bài 14.3 gọi đây là cấu hình autovacuum sai phổ biến nhất — mà nó là <em>mặc định</em>, không phải lỗi của ai: trên một bảng lớn bị cập nhật liên tục, nó nghĩa là phình 20% trước khi việc dọn dẹp bắt đầu, và mỗi lượt dọn sau đó có nhiều việc hơn và cản trở nhiều hơn. Cách làm đúng là theo từng bảng, không phải toàn cục: <code>ALTER TABLE … SET (autovacuum_vacuum_scale_factor = 0.01, autovacuum_vacuum_threshold = 1000)</code> trên hai ba bảng thật sự có nhiều thay đổi, tức là "vacuum sau khoảng 1% thay đổi". Nửa sau đã được đo ở chương 11: một bảng 100.000 dòng phình từ 4.608 kB lên 13 MB sau hai vòng cập nhật, và sau <code>VACUUM</code> thì các dòng chết biến mất nhưng file <b>vẫn 13 MB</b>. Chỉ <code>VACUUM FULL</code> mới viết lại bảng để trả chỗ, và nó lấy khoá <code>ACCESS EXCLUSIVE</code> chặn cả <code>SELECT</code> đồng thời cần chỗ cho một bản sao thứ hai — không bao giờ là việc thường quy; <code>pg_repack</code> làm được điều tương tự mà không giữ khoá lâu. Cũng lưu ý autovacuum chỉ thức dậy mỗi <code>autovacuum_naptime</code> (60 giây), nên nó không tức thì và cũng không nhằm tức thì, và <code>ANALYZE</code> là một việc hoàn toàn khác — làm mới thống kê cho bộ lập kế hoạch, đó là lý do những plan tồi ngay sau một lần nạp dữ liệu lớn thường là thiếu <code>ANALYZE</code> chứ không phải thiếu chỉ mục.',
          ),
        }),

        // ── Chương 15 — Sao lưu, nhân bản & mở rộng ─────────────────────
        mcq({
          prompt: B(
            'A nightly <code>pg_dump</code> has run for two years and the cron job has never reported a failure. What is the honest assessment?',
            'Một lệnh <code>pg_dump</code> hằng đêm đã chạy hai năm và job định kỳ chưa từng báo lỗi lần nào. Đánh giá trung thực là gì?',
          ),
          options: [
            B('You have a file, not a backup, until a restore has been rehearsed end to end with row counts compared — and <code>pg_dump &gt; file.sql</code> in a shell script happily writes a truncated file while reporting nothing', 'Bạn đang có một cái file, không phải một bản sao lưu, cho tới khi có một lần khôi phục diễn tập trọn vẹn và đối chiếu số dòng — và <code>pg_dump &gt; file.sql</code> trong một script shell sẵn sàng ghi ra một file cụt mà chẳng báo cho ai'),
            B('It is sound — <code>pg_dump</code> validates its own output and exits non-zero on any inconsistency, so silence really is success', 'Ổn rồi — <code>pg_dump</code> tự kiểm tra đầu ra của nó và thoát với mã khác 0 nếu có bất nhất, nên im lặng đúng là thành công'),
            B('It is sound, and it also gives point-in-time recovery, since each dump records the WAL position it was taken at', 'Ổn rồi, và nó còn cho bạn khôi phục theo thời điểm, vì mỗi bản dump có ghi lại vị trí WAL lúc lấy'),
            B('It is unsound only because dumps should run hourly; the same job at a higher frequency closes the gap entirely', 'Chỉ chưa ổn ở chỗ nên dump theo giờ; vẫn job đó chạy dày hơn là bịt được hoàn toàn khoảng trống'),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 15.1 puts it as a rule: <b>a backup you have never restored is not a backup, it is a file</b>. The silent failure modes are all mundane — the cron job has been writing zero-byte files since a password changed, the dump excludes a schema someone added, it writes to the same disk as the database so both are lost together, or the restore fails because an extension is missing on the target. Redirecting with <code>&gt;</code> is the classic one, because the shell creates the file regardless of the exit status. So: check the exit status, keep backups on different storage, and <b>schedule a restore, not just a dump</b> — restore into a scratch database on a timer and alarm when row counts diverge. Option 4 is a real concern with the wrong fix: a nightly dump plus a failure at 01:59 loses 23 hours 59 minutes, but a dump is a full read of the database, so running it more often costs load and still leaves a window. The answer to that is WAL archiving and point-in-time recovery (15.2), which turns a 24-hour worst case into minutes. Option 3 confuses the two families entirely — a logical dump is a snapshot of one moment; PITR needs a physical base backup plus every WAL segment since. One more caveat: <code>pg_dump</code> holds an open transaction for its whole run, which pins a snapshot and blocks <code>VACUUM</code> across the database, so a multi-hour dump on a busy server is a real cause of bloat — take it from a replica.',
            'Bài 15.1 phát biểu thành quy tắc: <b>một bản sao lưu bạn chưa bao giờ khôi phục thì không phải bản sao lưu, nó là một cái file</b>. Các kiểu hỏng im lặng đều rất tầm thường — job định kỳ đã ghi ra file rỗng 0 byte từ hồi đổi mật khẩu, bản dump bỏ sót một schema ai đó mới thêm, nó ghi vào cùng cái đĩa chứa cơ sở dữ liệu nên mất là mất cả hai, hoặc lệnh khôi phục hỏng vì máy đích thiếu một extension. Chuyển hướng bằng <code>&gt;</code> là ca kinh điển, vì shell tạo file bất kể mã thoát ra sao. Vậy nên: kiểm mã thoát, giữ bản sao lưu trên thiết bị lưu trữ khác, và <b>hãy lên lịch cho việc KHÔI PHỤC, không chỉ việc dump</b> — khôi phục vào một cơ sở dữ liệu nháp theo lịch rồi báo động khi số dòng lệch nhau. Phương án 4 nêu một mối lo có thật nhưng sửa sai cách: dump hằng đêm mà sự cố xảy ra lúc 01:59 thì mất 23 giờ 59 phút, nhưng một bản dump là một lần đọc toàn bộ cơ sở dữ liệu, nên chạy dày hơn thì tốn tải mà vẫn còn khoảng trống. Câu trả lời cho chuyện đó là lưu trữ WAL và khôi phục theo thời điểm (bài 15.2), thứ biến trường hợp xấu nhất từ 24 giờ xuống còn vài phút. Phương án 3 nhầm lẫn hoàn toàn hai họ sao lưu — một bản dump logic là ảnh chụp của một thời điểm; PITR cần một bản sao lưu vật lý nền cộng với mọi đoạn WAL kể từ đó. Thêm một lưu ý: <code>pg_dump</code> giữ một giao dịch mở suốt thời gian chạy, thứ ghim một ảnh chụp và chặn <code>VACUUM</code> trên cả cơ sở dữ liệu, nên một bản dump kéo dài nhiều giờ trên máy chủ bận là nguyên nhân phình thật sự — hãy lấy nó từ một bản sao.',
          ),
        }),

        mcq({
          prompt: B(
            'Monitoring shows a replication slot with <code>active = f</code> and a steadily growing size. The replica it belonged to was decommissioned months ago. Why is this an incident that has not started yet?' + code(
              'SELECT slot_name, active,\n' +
              '       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn))\n' +
              'FROM pg_replication_slots;',
            ),
            'Giám sát cho thấy một replication slot có <code>active = f</code> và kích thước tăng đều. Bản sao mà nó phục vụ đã bị gỡ bỏ nhiều tháng trước. Vì sao đây là một sự cố chưa bắt đầu?' + code(
              'SELECT slot_name, active,\n' +
              '       pg_size_pretty(pg_wal_lsn_diff(pg_current_wal_lsn(), restart_lsn))\n' +
              'FROM pg_replication_slots;',
            ),
          ),
          options: [
            B('An inactive slot slowly corrupts the WAL stream it was tracking, because segments are recycled underneath it, so the next crash recovery will fail to replay cleanly and the database will not start', 'Một slot không hoạt động sẽ dần làm hỏng dòng WAL mà nó đang theo dõi, vì các đoạn bị tái sử dụng ngay dưới chân nó, nên lần khôi phục sau sự cố tới sẽ không replay sạch được và cơ sở dữ liệu sẽ không khởi động nổi'),
            B('It silently promotes the primary into standby mode once the retained lag exceeds <code>wal_keep_size</code>, which is PostgreSQL protecting the slot\'s consumer at the expense of the primary\'s writes', 'Nó âm thầm chuyển máy chính sang chế độ standby khi phần tụt lại được giữ vượt <code>wal_keep_size</code>, tức là PostgreSQL bảo vệ bên tiêu thụ của slot bằng cách hy sinh khả năng ghi của máy chính'),
            B('A slot guarantees the primary keeps <b>every WAL segment its consumer has not confirmed</b>, unconditionally. WAL accumulates for ever, the disk fills, and a database that cannot write WAL cannot commit anything — and the slot blocks <code>VACUUM</code> at the same time, so wraparound becomes a second countdown', 'Một slot bảo đảm máy chính giữ lại <b>mọi đoạn WAL mà bên tiêu thụ chưa xác nhận</b>, một cách vô điều kiện. WAL cứ chất lên mãi, đĩa đầy, và một cơ sở dữ liệu không ghi được WAL thì không commit được gì — đồng thời slot chặn <code>VACUUM</code>, nên wraparound thành một đồng hồ đếm ngược thứ hai'),
            B('It costs nothing while inactive; PostgreSQL drops a slot automatically after it has been unused for <code>autovacuum_naptime</code>', 'Nó chẳng tốn gì khi không hoạt động; PostgreSQL tự xoá một slot sau khi nó không được dùng trong khoảng <code>autovacuum_naptime</code>'),
          ],
          correct: 2,
          explanation: EX(
            'The guarantee is the whole problem: it is unconditional, so a slot whose consumer is switched off or decommissioned holds WAL for ever. Normally PostgreSQL recycles WAL once it is no longer needed for crash recovery; a slot suspends that. The endgame is a total outage caused by a component nobody was using — the disk fills, and writing WAL is a precondition for committing anything at all. Worse, it runs two countdowns in parallel, because the retained WAL also blocks <code>VACUUM</code>, and blocked vacuuming leads to transaction ID wraparound: PostgreSQL warns, then <b>refuses all new transactions</b> with <em>database is not accepting commands to avoid wraparound data loss</em>, which needs single-user-mode recovery. Two defences, both cheap: set <code>max_slot_wal_keep_size</code> so PostgreSQL sacrifices a lagging slot rather than itself, and put that query on a dashboard — a slot with <code>active = f</code> and a growing size is the signal. Option 4 is the assumption that lets it sit there for months; slots are persistent by design, which is exactly what makes them useful and dangerous. Remember the three things that block vacuum generally: a long-running or <code>idle in transaction</code> session pinning an old snapshot, an abandoned replication slot, and a prepared transaction nobody committed.',
            'Chính lời bảo đảm ấy là toàn bộ vấn đề: nó vô điều kiện, nên một slot có bên tiêu thụ đã tắt hoặc đã gỡ bỏ sẽ giữ WAL mãi mãi. Bình thường PostgreSQL tái sử dụng WAL khi không còn cần cho khôi phục sau sự cố; một slot treo việc đó lại. Kết cục là sập hoàn toàn vì một thành phần chẳng ai dùng — đĩa đầy, mà ghi được WAL là điều kiện tiên quyết để commit bất cứ thứ gì. Tệ hơn, nó chạy hai đồng hồ đếm ngược song song, vì phần WAL bị giữ lại cũng chặn <code>VACUUM</code>, và vacuum bị chặn dẫn tới wraparound mã giao dịch: PostgreSQL cảnh báo, rồi <b>từ chối mọi giao dịch mới</b> với thông báo <em>database is not accepting commands to avoid wraparound data loss</em>, phải khôi phục ở chế độ một người dùng. Hai lớp phòng thủ, đều rẻ: đặt <code>max_slot_wal_keep_size</code> để PostgreSQL hy sinh một slot đang tụt lại thay vì hy sinh chính nó, và đưa truy vấn kia lên bảng theo dõi — một slot có <code>active = f</code> và kích thước đang lớn dần chính là tín hiệu. Phương án 4 là giả định khiến nó nằm đó hàng tháng trời; slot bền vững theo thiết kế, và đó đúng là thứ khiến nó vừa hữu ích vừa nguy hiểm. Nhớ ba thứ chặn vacuum nói chung: một phiên chạy lâu hoặc <code>idle in transaction</code> đang ghim một ảnh chụp cũ, một replication slot bị bỏ rơi, và một prepared transaction chưa ai commit.',
          ),
        }),

        mcq({
          prompt: B(
            'An events table has a 30-day retention policy. Measured on the same data: the <code>DELETE</code> took 67.751 ms and left 100,019 dead tuples with the file unchanged at 15 MB; the <code>DROP</code> took 3.500 ms and left nothing. What is the correct reading?' + code(
              "DELETE FROM event_flat WHERE luc < '2026-07-01';   -- 67.751 ms\n" +
              'DROP TABLE event_p_2026_06;                        --  3.500 ms',
            ),
            'Một bảng sự kiện có chính sách giữ dữ liệu 30 ngày. Đo trên cùng dữ liệu: lệnh <code>DELETE</code> mất 67,751 ms và để lại 100.019 dòng chết với file vẫn nguyên 15 MB; lệnh <code>DROP</code> mất 3,500 ms và không để lại gì. Đọc thế nào cho đúng?' + code(
              "DELETE FROM event_flat WHERE luc < '2026-07-01';   -- 67,751 ms\n" +
              'DROP TABLE event_p_2026_06;                        --  3,500 ms',
            ),
          ),
          options: [
            B('Partitioning makes every query on this table faster, so the 19× is a lower bound on the benefit', 'Phân mảnh làm mọi truy vấn trên bảng này nhanh hơn, nên con số 19 lần là cận dưới của lợi ích'),
            B('The case for partitioning here is <b>operational, not query speed</b>: 19× faster, and more importantly no dead tuples, no vacuum work and space returned to the OS immediately. Pruning only helps queries that filter on the <b>partition key</b>', 'Lý do phân mảnh ở đây là <b>vận hành, không phải tốc độ truy vấn</b>: nhanh hơn 19 lần, và quan trọng hơn là không còn dòng chết, không còn việc cho vacuum, và chỗ trống trả về cho hệ điều hành ngay lập tức. Việc cắt tỉa phân vùng chỉ giúp những truy vấn lọc theo <b>khoá phân vùng</b>'),
            B('The <code>DELETE</code> was slow only because the table lacked an index on <code>luc</code>; with one, the two would be equivalent', 'Lệnh <code>DELETE</code> chậm chỉ vì bảng thiếu chỉ mục trên <code>luc</code>; có chỉ mục thì hai cách là tương đương'),
            B('Any table that is getting big should be partitioned, since the retrofit is cheap and the planner handles the rest', 'Bảng nào đang phình to thì nên phân mảnh, vì việc chuyển đổi rẻ và bộ lập kế hoạch lo phần còn lại'),
          ],
          correct: 1,
          explanation: EX(
            'The timing is the smaller half. The <code>DELETE</code> left 100,019 dead tuples that autovacuum must work through, and the file did not shrink — the space stays allocated. The dropped partition is simply gone: space back to the OS, no vacuum, no bloat, no lock held on anything else. So the rule is: <b>if your data has a retention policy — logs, events, metrics, sessions — partition by time and make deletion a <code>DROP</code></b>. Option 1 overstates the query side. Partition pruning is real and dramatic when it applies — the measured plan for a query filtering on the partition key had <em>no <code>Append</code> node at all</em> and never mentioned the other two partitions — but a query filtering on a non-key column must scan every partition and will be <b>slower</b> than the same query on an unpartitioned table. Choosing the partition key is choosing which queries get faster. Option 4 is the trap named in 15.4: below a few tens of millions of rows an ordinary table with a good index is usually faster and always simpler, planning time grows with partition count, and the retrofit is not free because you must create the partitioned parent and move the data — so partition on day one if you can see the retention policy coming. "It is getting big" is not a trigger. Two practical notes: a <code>PRIMARY KEY</code> must include the partition key, and a row with no matching partition raises <em>no partition of relation … found for row</em>, so create partitions ahead of time or attach a <code>DEFAULT</code> one.',
            'Con số thời gian mới là nửa nhỏ hơn. Lệnh <code>DELETE</code> để lại 100.019 dòng chết mà autovacuum phải cày qua, và file không co lại — chỗ đó vẫn bị chiếm. Phân vùng bị xoá thì đơn giản là biến mất: chỗ trả về cho hệ điều hành, không vacuum, không phình, không giữ khoá lên thứ gì khác. Nên quy tắc là: <b>nếu dữ liệu của bạn có chính sách giữ theo thời gian — log, sự kiện, số liệu, phiên — hãy phân mảnh theo thời gian và biến việc xoá thành một lệnh <code>DROP</code></b>. Phương án 1 nói quá về phía truy vấn. Cắt tỉa phân vùng là có thật và rất mạnh khi nó áp dụng được — plan đo được của một truy vấn lọc theo khoá phân vùng <em>không có nút <code>Append</code> nào cả</em> và không hề nhắc tới hai phân vùng kia — nhưng một truy vấn lọc theo cột không phải khoá thì phải quét mọi phân vùng và sẽ <b>chậm hơn</b> cùng truy vấn ấy trên bảng chưa phân mảnh. Chọn khoá phân vùng chính là chọn xem truy vấn nào được nhanh lên. Phương án 4 là cái bẫy nêu trong bài 15.4: dưới vài chục triệu dòng thì một bảng thường có chỉ mục tốt thường nhanh hơn và luôn đơn giản hơn, thời gian lập kế hoạch tăng theo số phân vùng, và việc chuyển đổi không miễn phí vì bạn phải tạo bảng cha đã phân mảnh rồi chuyển dữ liệu sang — nên hãy phân mảnh ngay từ ngày đầu nếu bạn đã thấy trước chính sách giữ dữ liệu. "Nó đang to lên" không phải một lý do. Hai lưu ý thực tế: một <code>PRIMARY KEY</code> buộc phải chứa khoá phân vùng, và một dòng không khớp phân vùng nào sẽ báo <em>no partition of relation … found for row</em>, nên hãy tạo phân vùng trước hạn hoặc gắn một phân vùng <code>DEFAULT</code>.',
          ),
        }),

        // ── Chương 16 — PostgreSQL trên production & capstone ───────────
        mcq({
          prompt: B(
            'Which command belongs on production, and what makes the other two wrong there?' + code(
              'prisma migrate dev\n' +
              'prisma migrate deploy\n' +
              'prisma db push',
            ),
            'Lệnh nào thuộc về production, và điều gì khiến hai lệnh kia sai ở đó?' + code(
              'prisma migrate dev\n' +
              'prisma migrate deploy\n' +
              'prisma db push',
            ),
          ),
          options: [
            B('<code>migrate dev</code> — it is the only one that generates the SQL from the schema, and production needs that generated file to exist before anything can be applied to the live database', '<code>migrate dev</code> — nó là lệnh duy nhất sinh ra SQL từ lược đồ, và production cần file được sinh ra đó tồn tại trước khi áp được bất cứ thứ gì lên cơ sở dữ liệu đang chạy'),
            B('<code>db push</code> — it applies the schema in one step with no intermediate migration files to go stale or conflict, which is why it is the recommended path once a project has more than one developer', '<code>db push</code> — nó áp lược đồ trong một bước, không có file migration trung gian nào để bị cũ đi hay xung đột, và vì thế nó là đường được khuyến nghị khi dự án có nhiều hơn một lập trình viên'),
            B('Any of them; the three differ only in how much they print and whether they prompt, and all three end with exactly the same schema in the database, so the choice is a matter of taste', 'Cái nào cũng được; ba lệnh chỉ khác nhau ở lượng thông tin in ra và ở chuyện có hỏi lại hay không, và cả ba đều kết thúc với đúng cùng một lược đồ trong cơ sở dữ liệu, nên chọn cái nào là chuyện sở thích'),
            B('<code>migrate deploy</code> — it applies pending migrations in order and nothing else. <code>migrate dev</code> builds a <b>shadow database</b> by replaying every migration from scratch and may offer to reset yours; <code>db push</code> writes no migration file and destroys the history <code>deploy</code> depends on', '<code>migrate deploy</code> — nó áp các migration đang chờ theo thứ tự và không làm gì khác. <code>migrate dev</code> dựng một <b>shadow database</b> bằng cách replay lại mọi migration từ đầu và có thể đề nghị reset cơ sở dữ liệu của bạn; còn <code>db push</code> không ghi file migration nào và phá luôn lịch sử mà <code>deploy</code> dựa vào'),
          ],
          correct: 3,
          explanation: EX(
            'Lesson 16.1 maps the three precisely. <code>migrate deploy</code> is the production command: no shadow database, no generation, no reset, no prompts. <code>migrate dev</code> is development-only because to compare safely it builds a shadow database and replays every migration from zero — which is also why this repo\'s migration <code>20260706130000_add_music_and_profile</code> fails there with <code>P3006</code>: it adds a <code>UNIQUE</code> constraint named <code>post_music_post_id_key</code> and then a plain index with the <em>same name</em>, a collision on a fresh database. Production is unaffected because that migration is already recorded as applied, and the fix is emphatically <b>not</b> to edit it — rewriting an applied migration breaks its recorded checksum. Hand-write new SQL under <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> and apply with <code>migrate deploy</code>, which needs no shadow database; verify with <code>prisma migrate diff</code>, where empty output means schema and database agree. And when a migration does fail on deploy, Prisma marks it failed and refuses to continue, which is correct — do <b>not</b> run <code>migrate resolve --applied</code> to make the error go away, because if it only partly ran, schema and history now disagree in a way nothing will detect until a later migration fails for reasons that make no sense.',
            'Bài 16.1 phân định ba lệnh rất rõ. <code>migrate deploy</code> là lệnh dành cho production: không shadow database, không sinh mã, không reset, không hỏi han. <code>migrate dev</code> chỉ dành cho môi trường phát triển vì để so sánh an toàn nó dựng một shadow database và replay mọi migration từ số không — cũng chính vì thế mà migration <code>20260706130000_add_music_and_profile</code> của kho này hỏng ở đó với mã <code>P3006</code>: nó thêm một ràng buộc <code>UNIQUE</code> tên <code>post_music_post_id_key</code> rồi thêm tiếp một index thường <em>trùng tên</em>, một cú va tên trên cơ sở dữ liệu mới tinh. Production không bị ảnh hưởng vì migration ấy đã được ghi nhận là đã áp, và cách sửa dứt khoát <b>không phải</b> là sửa nó — viết lại một migration đã áp là làm hỏng checksum đã ghi. Hãy viết tay SQL mới vào <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> rồi áp bằng <code>migrate deploy</code>, thứ không cần shadow database; kiểm lại bằng <code>prisma migrate diff</code>, đầu ra rỗng nghĩa là lược đồ và cơ sở dữ liệu khớp nhau. Và khi một migration thật sự hỏng lúc deploy, Prisma đánh dấu nó thất bại rồi từ chối chạy tiếp, và như thế là đúng — <b>đừng</b> chạy <code>migrate resolve --applied</code> để cho lỗi biến mất, vì nếu nó mới chạy được một nửa thì lược đồ và lịch sử đã lệch nhau theo kiểu chẳng gì phát hiện ra cho tới khi một migration sau này hỏng vì những lý do vô nghĩa.',
          ),
        }),

        mcq({
          prompt: B(
            'Response times tripled over about an hour. No deploy, no traffic spike, no change in error rate — and one particular table\'s queries are noticeably worse. What is the <b>first</b> query to run?' + code(
              '-- candidate A\n' +
              'EXPLAIN ANALYZE SELECT … FROM the_slow_table WHERE …;\n' +
              '\n' +
              '-- candidate B\n' +
              'SELECT pid, now() - xact_start AS age, state, left(query, 60)\n' +
              'FROM pg_stat_activity WHERE xact_start IS NOT NULL ORDER BY age DESC;',
            ),
            'Thời gian phản hồi tăng gấp ba trong khoảng một tiếng. Không deploy, không có đợt tăng lưu lượng, tỷ lệ lỗi không đổi — và các truy vấn trên đúng một bảng thì tệ hẳn đi. Truy vấn <b>đầu tiên</b> nên chạy là gì?' + code(
              '-- ứng viên A\n' +
              'EXPLAIN ANALYZE SELECT … FROM bang_cham WHERE …;\n' +
              '\n' +
              '-- ứng viên B\n' +
              'SELECT pid, now() - xact_start AS age, state, left(query, 60)\n' +
              'FROM pg_stat_activity WHERE xact_start IS NOT NULL ORDER BY age DESC;',
            ),
          ),
          options: [
            B('B — a session <code>idle in transaction</code> for hours pins a snapshot so <code>VACUUM</code> cannot remove any newer row version <b>anywhere in the database</b>; the hot table accumulates dead tuples and degrades gradually with no code change. The cause is global, the symptom is local', 'B — một phiên <code>idle in transaction</code> hàng giờ ghim một ảnh chụp khiến <code>VACUUM</code> không dọn được phiên bản dòng nào mới hơn, <b>trên toàn bộ cơ sở dữ liệu</b>; bảng nóng tích dần dòng chết và tệ đi từ từ mà chẳng ai sửa dòng mã nào. Nguyên nhân toàn cục, triệu chứng cục bộ'),
            B('A — the symptom named one table, so the plan for that table\'s query is where the answer is; a gradual slowdown with no deploy almost always means the planner switched strategy on that query', 'A — triệu chứng đã chỉ đích danh một bảng, nên câu trả lời nằm ở plan của truy vấn trên bảng đó; chậm dần mà không deploy gì thì gần như luôn nghĩa là bộ lập kế hoạch đã đổi chiến lược cho truy vấn ấy'),
            B('Neither — restart PostgreSQL first to clear whatever accumulated, since a restart is cheap and reversible, then investigate properly if the slowdown comes back', 'Không cái nào — cứ khởi động lại PostgreSQL cho sạch cái gì đã tích tụ, vì khởi động lại thì rẻ và có thể đảo ngược, rồi điều tra tử tế nếu tình trạng chậm quay lại'),
            B('Neither — check <code>pg_stat_statements</code> ordered by <code>calls</code>, since the most frequent query is by definition the one that got slower', 'Không cái nào — hãy xem <code>pg_stat_statements</code> sắp theo <code>calls</code>, vì truy vấn được gọi nhiều nhất theo định nghĩa là cái đã chậm đi'),
          ],
          correct: 0,
          explanation: EX(
            'Lesson 16.4 gives the investigation order: capture state before changing anything, ask "right now" (<code>pg_stat_activity</code>) before "over time" (<code>pg_stat_statements</code>), open <code>EXPLAIN</code> only once you know <em>which</em> query, and restart last, never first. Most incidents end at the first query. Here the shape of the symptom — gradual, no deploy, no traffic change — points at bloat, and the misleading part is that <b>the slow table is often not the one the stuck transaction touched</b>. Option 2 is where people spend an hour optimising a query that was never the problem. Option 4 gets the sort column wrong: order <code>pg_stat_statements</code> by <b><code>total_exec_time</code></b>, the only column capturing real impact — in the measured workload a <code>LIKE</code> query called twice consumed 51.1 ms while an indexed query called five times consumed 12.7 ms, so sorting by <code>calls</code> optimises the wrong one. Option 3 is the trap that closes the whole course: restarting often does restore service, <em>which is precisely the problem</em> — it kills the stuck transaction, drops the leaked connections, and takes the contents of <code>pg_stat_activity</code> with it, so the symptom disappears, the cause survives, and it returns next week with no evidence. Spend sixty seconds capturing state first. The fix here: <code>pg_cancel_backend(pid)</code>, then <code>VACUUM</code> the affected table, then set <code>idle_in_transaction_session_timeout</code> and find the code path that opens a transaction and forgets it.',
            'Bài 16.4 đưa ra thứ tự điều tra: ghi lại hiện trạng trước khi đụng vào bất cứ thứ gì, hỏi "ngay lúc này" (<code>pg_stat_activity</code>) trước khi hỏi "suốt thời gian qua" (<code>pg_stat_statements</code>), chỉ mở <code>EXPLAIN</code> khi đã biết truy vấn <em>nào</em>, và khởi động lại là việc cuối cùng, không bao giờ là việc đầu tiên. Phần lớn sự cố kết thúc ngay ở truy vấn đầu tiên. Ở đây hình dạng của triệu chứng — tệ dần, không deploy, lưu lượng không đổi — chỉ về phía phình dữ liệu, và chỗ đánh lừa là <b>bảng bị chậm thường không phải bảng mà giao dịch bị kẹt đã chạm vào</b>. Phương án 2 chính là chỗ người ta ngồi cả tiếng tối ưu một truy vấn vốn chưa từng là vấn đề. Phương án 4 chọn sai cột sắp xếp: hãy sắp <code>pg_stat_statements</code> theo <b><code>total_exec_time</code></b>, cột duy nhất phản ánh tác động thật — trong khối công việc đo được, một truy vấn <code>LIKE</code> gọi hai lần ngốn 51,1 ms còn một truy vấn có chỉ mục gọi năm lần chỉ ngốn 12,7 ms, nên sắp theo <code>calls</code> là đi tối ưu nhầm cái. Phương án 3 là cái bẫy khép lại cả khoá học: khởi động lại thường đúng là khôi phục được dịch vụ, <em>và đó chính là vấn đề</em> — nó giết giao dịch bị kẹt, dẹp các kết nối rò rỉ, và mang theo luôn toàn bộ nội dung của <code>pg_stat_activity</code>, nên triệu chứng biến mất, nguyên nhân sống sót, rồi tuần sau nó quay lại mà không còn bằng chứng nào. Hãy bỏ sáu mươi giây ghi lại hiện trạng trước đã. Cách sửa ở đây: <code>pg_cancel_backend(pid)</code>, rồi <code>VACUUM</code> bảng bị ảnh hưởng, rồi đặt <code>idle_in_transaction_session_timeout</code> và tìm ra đường mã nào mở một giao dịch rồi quên nó.',
          ),
        }),

        mcq({
          prompt: B(
            'You read the schema carefully. Two tables are separate, two endpoints are separate, and no code path writes both — so you conclude that a slug cannot exist in both URL spaces. Production returns 200 for both. What was the mistake?',
            'Bạn đọc lược đồ rất kỹ. Hai bảng tách biệt, hai endpoint tách biệt, và không đường mã nào ghi vào cả hai — nên bạn kết luận một slug không thể tồn tại ở cả hai không gian URL. Production trả 200 cho cả hai. Sai ở đâu?',
          ),
          options: [
            B('The reasoning was fine but the reading was not — a careful enough re-read of the schema would have found the write path that creates both', 'Lập luận thì ổn nhưng đọc chưa tới — đọc lại lược đồ đủ kỹ là sẽ tìm ra đường ghi tạo cả hai'),
            B('The schema file on disk was stale relative to the deployed one; regenerating the Prisma client and re-reading the model definitions would have revealed the table the two endpoints actually share', 'File lược đồ trên đĩa đã cũ so với bản đang chạy; sinh lại Prisma client rồi đọc lại các định nghĩa model là sẽ lộ ra cái bảng mà hai endpoint thật sự dùng chung'),
            B('<b>Code tells you what is possible; only the data tells you what is true.</b> The rows were created by every version of the code that ever ran, plus migrations, imports and manual fixes — here a blog merge copied rows into a new table without removing the old ones. When the question is about state, query the state', '<b>Mã nói cho bạn biết điều gì có thể; chỉ dữ liệu mới nói cho bạn biết điều gì là thật.</b> Các dòng đó được tạo ra bởi mọi phiên bản mã từng chạy, cộng thêm migration, nhập liệu và những lần sửa tay — ở đây một lần gộp blog đã chép các dòng sang bảng mới mà không xoá bảng cũ. Câu hỏi về trạng thái thì phải hỏi trạng thái'),
            B('Nothing was wrong with the analysis — since the code cannot produce that state, the two 200 responses must be served by a caching layer holding an old copy rather than by real rows in either table', 'Phân tích không sai gì cả — vì mã không thể tạo ra trạng thái đó, hai mã 200 kia chắc chắn do một tầng cache còn giữ bản cũ trả về, chứ không phải do các dòng dữ liệu thật trong bảng nào'),
          ],
          correct: 2,
          explanation: EX(
            'This is a real incident from this codebase, recorded on 25/08/2026. The reasoning from the code was <em>entirely correct</em>: two tables, two endpoints, no cross path, nothing writing both. And the conclusion was still wrong, because <code>posts</code> and <code>tech_trend_articles</code> genuinely held colliding slugs — the blog merge of 05/08 copied content into the new table without deleting the old one. "The code cannot produce state X" does not imply "state X does not exist", because data has its own history made of migrations and manual operations. One <code>curl</code> would have settled it in seconds, and it was available the whole time. Lesson 16.2 generalises the same point about reading a schema: a column marked <code>NOT NULL</code> today may sit above rows that predate enforcement. The habit the whole course is trying to build is in 16.4\'s closing line — ask the database (<code>pg_stat_activity</code>, <code>pg_stat_statements</code>, <code>EXPLAIN ANALYZE</code>, or just a <code>SELECT</code>) before you guess. The highest-value version of that habit for a schema you did not write: <code>SELECT relname, seq_scan, idx_scan, n_live_tup FROM pg_stat_user_tables ORDER BY seq_scan DESC;</code> — a table with a large row count, high <code>seq_scan</code> and low <code>idx_scan</code> is a missing index, found without reading a single line of application code.',
            'Đây là một sự cố có thật của chính kho mã này, ghi lại ngày 25/08/2026. Lập luận đọc từ mã <em>hoàn toàn đúng</em>: hai bảng, hai endpoint, không có đường rẽ chéo, không chỗ nào ghi cả hai. Vậy mà kết luận vẫn sai, vì <code>posts</code> và <code>tech_trend_articles</code> thật sự có slug trùng nhau — cuộc gộp blog ngày 05/08 đã chép nội dung sang bảng mới mà không xoá bảng cũ. "Mã không thể tạo ra trạng thái X" không suy ra được "trạng thái X không tồn tại", vì dữ liệu có lịch sử riêng của nó, làm nên từ các migration và những thao tác tay. Một lệnh <code>curl</code> là đủ giải quyết trong vài giây, và nó nằm sẵn trong tay suốt thời gian đó. Bài 16.2 khái quát đúng ý ấy cho việc đọc lược đồ: một cột hôm nay ghi <code>NOT NULL</code> vẫn có thể nằm trên những dòng có từ trước khi ràng buộc được áp. Thói quen mà cả khoá học muốn xây nằm ở câu kết của bài 16.4 — hãy hỏi cơ sở dữ liệu (<code>pg_stat_activity</code>, <code>pg_stat_statements</code>, <code>EXPLAIN ANALYZE</code>, hay chỉ một câu <code>SELECT</code>) trước khi đoán. Phiên bản giá trị nhất của thói quen đó khi đọc một lược đồ không phải do bạn viết: <code>SELECT relname, seq_scan, idx_scan, n_live_tup FROM pg_stat_user_tables ORDER BY seq_scan DESC;</code> — một bảng có nhiều dòng, <code>seq_scan</code> cao và <code>idx_scan</code> thấp chính là một chỉ mục còn thiếu, tìm ra mà không cần đọc một dòng mã ứng dụng nào.',
          ),
        }),
      ],
    },
  ],
};
