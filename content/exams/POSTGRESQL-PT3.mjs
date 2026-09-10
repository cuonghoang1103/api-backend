/**
 * PostgreSQL — Progress Test 3 (Chương 12 → Chương 16).
 *
 * Đề tự soạn, bám sát `content/courses/postgresql/s12-ham-trigger-view.mjs` …
 * `s16-production-capstone.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay
 * trong phòng thi.
 *
 * ⚠️ MỌI kết quả truy vấn, MỌI kế hoạch EXPLAIN, MỌI thông báo lỗi và MỌI kích
 * thước file trong đề này đều được ĐO LẠI TỪ ĐẦU trên một container PostgreSQL
 * nháp dựng riêng cho việc soạn đề (KHÔNG đụng vào `cuonghoangdev_db` lẫn DB
 * local cổng 5433 của dự án):
 *
 *     PostgreSQL 16.14 (Debian 16.14-1.pgdg13+1) on aarch64-unknown-linux-gnu
 *     docker run -d --name pg_pt3_scratch -p 55432:5432 postgres:16   (đã docker rm -f)
 *
 * Có một bản nháp dở dang của phiên trước; phần câu hỏi giữ lại được thì mọi
 * con số trong đó đều đã bị VỨT ĐI và đo lại — và việc đo lại bắt trúng một câu
 * có số liệu tự mâu thuẫn (xem mục 4 bên dưới).
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ NĂM CHỖ MÁY KHÁC GIÁO TRÌNH / KHÁC BẢN NHÁP (đo 10/09/2026, PostgreSQL 16.14)
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. Bài 13.1 nói jsonb lưu "keys sorted" / "khoá được sắp", và ví dụ của bài
 *    (`{"a": 3, "b": 1}`) hợp với cả cách hiểu "sắp theo bảng chữ cái". Đo
 *    thật thì KHÔNG phải bảng chữ cái: jsonb sắp khoá theo ĐỘ DÀI trước, rồi
 *    mới theo thứ tự byte.
 *        '{"bb":1,"a":2,"ccc":3,"z":4,"aa":5}'::jsonb
 *          →  {"a": 2, "z": 4, "aa": 5, "bb": 1, "ccc": 3}
 *        '{"B":1,"a":2}'::jsonb  →  {"B": 1, "a": 2}      (chữ hoa trước)
 *    Câu 8 và câu lập trình 31 hỏi đúng chỗ này.
 *
 * 2. Bài 13.1 nói so `props->'brand' = 'Acme'` thì "fails". Máy không trả về
 *    false — nó NÉM LỖI:
 *        ERROR:  invalid input syntax for type json
 *        DETAIL:  Token "Acme" is invalid.
 *    Bản nháp còn viết nhầm thành "trả về không dòng nào, không lỗi nào". Câu 9
 *    dùng đúng thông báo lỗi đo được.
 *
 * 3. Bài 12.1 xếp `STABLE` vào nhóm "không gấp thành hằng được" và ngụ ý nó tốn
 *    nhiều lời gọi hơn `IMMUTABLE`. Đo thật với đúng thí nghiệm của bài (một
 *    hàm `RAISE NOTICE` đặt trong `WHERE` trên 5 dòng): `VOLATILE` in 5 lần,
 *    còn `IMMUTABLE` **và** `STABLE` đều in ĐÚNG 1 lần. Khác biệt thật giữa hai
 *    mức nằm ở chỗ chỉ `IMMUTABLE` mới dùng được trong chỉ mục biểu thức — máy
 *    trả `ERROR: functions in index expression must be marked IMMUTABLE` khi
 *    thử với hàm `STABLE`. (Đề FE đã hỏi chuyện này nên PT3 không hỏi lại.)
 *
 * 4. Bản nháp, câu trigger kiểm toán: "ba câu lệnh — hai lần tăng thật và một
 *    lần không đổi gì — bảng kiểm toán nhận thêm BA dòng chứ không phải bốn."
 *    Số liệu ấy tự mâu thuẫn và không tái hiện được. Đo thật: 3 câu lệnh
 *    (2 lần tăng + 1 lần `SET title = title`) → bảng kiểm toán nhận **2** dòng.
 *    Câu 4 dùng số đo thật.
 *
 * 5. Bài 16.2 đếm lược đồ "hôm nay": 8.164 dòng · 277 model · 117 migration ·
 *    446 `@@index` · 86 `@@unique` · 441 `@relation`. Đếm lại trên kho mã hôm
 *    nay (10/09/2026): **8.540 dòng · 286 model · 131 migration · 463 @@index ·
 *    89 @@unique · 460 @relation**, `User` vẫn 47 `@relation`. Không phải giáo
 *    trình sai — chính bài học nói lược đồ là thứ LỚN LÊN — nhưng con số in
 *    trong bài đã cũ, nên câu 27 hỏi cái CHIỀU chứ không bắt nhớ con số.
 *
 * ⚠️ Đề KHÔNG hỏi bất kỳ SỐ ĐO THỜI GIAN nào: máy soạn đề chạy nhiều việc song
 * song nên `Execution Time` không tái hiện được. Mọi câu về hiệu năng hỏi CƠ
 * CHẾ (node nào trong plan, chỉ mục nào được dùng, và vì sao). Cũng vì kế hoạch
 * phụ thuộc thống kê và kích thước bảng, mọi câu hỏi "có dùng chỉ mục không"
 * đều đo trên bảng 200.000 dòng đã `ANALYZE`, không đo trên dữ liệu tí hon.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh trong đề bài):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/POSTGRESQL-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/postgresql-exam-kit.mjs';

export default {
  course: { slug: 'postgresql' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 12–16 (functions, triggers, views, JSONB, search, operations, backup, production)',
        'Kiểm tra tiến độ 3 — Chương 12–16 (hàm, trigger, view, JSONB, tìm kiếm, vận hành, sao lưu, production)',
      ),
      description: B(
        'The last third of the PostgreSQL course: logic that lives next to the data, JSONB and the three kinds of text search, what a connection costs and what VACUUM is for, backups you have actually restored, replication and partitioning, and reading a real production schema. 30 multiple-choice questions plus 2 programming questions you write here in the exam room.',
        'Một phần ba cuối của khoá PostgreSQL: logic sống ngay cạnh dữ liệu, JSONB và ba kiểu tìm kiếm văn bản, một kết nối tốn gì và VACUUM để làm gì, những bản sao lưu bạn đã thật sự khôi phục thử, nhân bản và phân mảnh, và đọc một lược đồ production có thật. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '12–16'),
      questions: [
        // ── Chương 12 — Hàm, trigger & view ─────────────────────────────
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 over a 200,000-row <code>notes</code> table with an index on <code>user_id</code>. The two functions have identical bodies and identical volatility; only the language differs:' + code(
              'CREATE FUNCTION notes_of(uid int)  RETURNS SETOF notes LANGUAGE sql     STABLE\n' +
              '  AS $$ SELECT * FROM notes WHERE user_id = uid $$;\n' +
              'CREATE FUNCTION notes_of2(uid int) RETURNS SETOF notes LANGUAGE plpgsql STABLE\n' +
              '  AS $$ BEGIN RETURN QUERY SELECT * FROM notes WHERE user_id = uid; END; $$;\n' +
              '\n' +
              'EXPLAIN (COSTS OFF) SELECT * FROM notes_of(7)  WHERE views > 10;\n' +
              ' Bitmap Heap Scan on notes\n' +
              '   Recheck Cond: (user_id = 7)\n' +
              '   Filter: (views > 10)\n' +
              '   ->  Bitmap Index Scan on notes_user_id_idx\n' +
              '\n' +
              'EXPLAIN (COSTS OFF) SELECT * FROM notes_of2(7) WHERE views > 10;\n' +
              ' Function Scan on notes_of2\n' +
              '   Filter: (views > 10)',
            ) + 'What are those two plans telling you?',
            'Đo trên PostgreSQL 16.14 trên bảng <code>notes</code> 200.000 dòng có chỉ mục trên <code>user_id</code>. Hai hàm có thân giống hệt nhau và cùng mức volatility; chỉ khác ngôn ngữ:' + code(
              'CREATE FUNCTION notes_of(uid int)  RETURNS SETOF notes LANGUAGE sql     STABLE\n' +
              '  AS $$ SELECT * FROM notes WHERE user_id = uid $$;\n' +
              'CREATE FUNCTION notes_of2(uid int) RETURNS SETOF notes LANGUAGE plpgsql STABLE\n' +
              '  AS $$ BEGIN RETURN QUERY SELECT * FROM notes WHERE user_id = uid; END; $$;\n' +
              '\n' +
              'EXPLAIN (COSTS OFF) SELECT * FROM notes_of(7)  WHERE views > 10;\n' +
              ' Bitmap Heap Scan on notes\n' +
              '   Recheck Cond: (user_id = 7)\n' +
              '   Filter: (views > 10)\n' +
              '   ->  Bitmap Index Scan on notes_user_id_idx\n' +
              '\n' +
              'EXPLAIN (COSTS OFF) SELECT * FROM notes_of2(7) WHERE views > 10;\n' +
              ' Function Scan on notes_of2\n' +
              '   Filter: (views > 10)',
            ) + 'Hai kế hoạch ấy đang nói với bạn điều gì?',
          ),
          options: [
            B('PL/pgSQL compiles its body to a plan cached with the function, so <code>Function Scan</code> is the CHEAPER of the two nodes here; the SQL version has to re-parse its text on every call and that is why the planner had to expand it', 'PL/pgSQL biên dịch thân hàm thành một kế hoạch được lưu kèm hàm, nên <code>Function Scan</code> ở đây là node RẺ HƠN trong hai node; bản SQL phải phân tích lại văn bản của nó ở mỗi lần gọi và đó là lý do bộ lập kế hoạch buộc phải bung nó ra'),
            B('The <code>LANGUAGE sql</code> function was INLINED — its body was expanded into the calling query and optimised as part of it, so the index and the outer <code>views > 10</code> filter meet in one plan. The PL/pgSQL body is a black box: PostgreSQL calls it, gets all its rows back, and only then filters', 'Hàm <code>LANGUAGE sql</code> đã được NỘI TUYẾN — thân của nó được bung thẳng vào truy vấn gọi nó và được tối ưu như một phần của truy vấn đó, nên chỉ mục và bộ lọc <code>views > 10</code> bên ngoài gặp nhau trong cùng một kế hoạch. Thân PL/pgSQL là một hộp đen: PostgreSQL gọi nó, nhận về đủ mọi dòng, rồi mới lọc'),
            B('The difference is the <code>STABLE</code> marker being interpreted differently by the two languages — mark the PL/pgSQL function <code>IMMUTABLE</code> and it produces the same Bitmap Heap Scan', 'Khác biệt nằm ở chỗ nhãn <code>STABLE</code> được hai ngôn ngữ hiểu khác nhau — hãy đánh dấu hàm PL/pgSQL là <code>IMMUTABLE</code> thì nó cũng cho ra đúng cái Bitmap Heap Scan ấy'),
            B('Nothing about the function: <code>Function Scan</code> appears because <code>notes_of2</code> returns <code>SETOF</code>, and any set-returning function is planned that way regardless of its language or body', 'Chẳng liên quan gì tới hàm: <code>Function Scan</code> xuất hiện vì <code>notes_of2</code> trả về <code>SETOF</code>, và mọi hàm trả về tập hợp đều được lập kế hoạch như vậy bất kể ngôn ngữ hay thân hàm'),
          ],
          correct: 1,
          explanation: EX(
            'Inlining is the reason to reach for <code>LANGUAGE sql</code> whenever the body fits in one statement. The call is replaced by the body inside the larger query, so the planner sees one query and can push filters down, choose join orders, and use indexes on the inner tables — exactly what the first plan shows, with the index condition and the caller\'s own filter sitting in the same node. Across a PL/pgSQL boundary none of that is possible: the second plan calls the function, materialises every row it returns, and applies <code>views > 10</code> afterwards, which on a user with 40,000 notes means 40,000 rows built and thrown away. The conditions for inlining are narrow and worth knowing: a single <code>SELECT</code>, not <code>VOLATILE</code>, no <code>SECURITY DEFINER</code>, no <code>SET</code> clauses. Reach for PL/pgSQL when you genuinely need variables, <code>IF</code>, loops or exception handling — and remember its <code>BEGIN … END</code> is a BLOCK delimiter with nothing to do with transactions.',
            'Nội tuyến là lý do để chọn <code>LANGUAGE sql</code> mỗi khi thân hàm gói gọn trong một câu lệnh. Lời gọi được thay bằng chính thân nó bên trong truy vấn lớn, nên bộ lập kế hoạch nhìn thấy một truy vấn duy nhất và có thể đẩy bộ lọc xuống, chọn thứ tự nối, dùng chỉ mục trên các bảng bên trong — đúng thứ kế hoạch đầu tiên cho thấy, với điều kiện chỉ mục và bộ lọc của chính bên gọi nằm chung một node. Qua ranh giới PL/pgSQL thì không làm được gì trong số đó: kế hoạch thứ hai gọi hàm, dựng ra đủ mọi dòng nó trả về, rồi mới áp <code>views > 10</code> — với một người dùng có 40.000 note thì đó là 40.000 dòng được dựng lên rồi vứt đi. Các điều kiện để được nội tuyến khá hẹp và đáng nhớ: một câu <code>SELECT</code>, không phải <code>VOLATILE</code>, không <code>SECURITY DEFINER</code>, không có mệnh đề <code>SET</code>. Hãy dùng PL/pgSQL khi bạn thật sự cần biến, <code>IF</code>, vòng lặp hay bắt ngoại lệ — và nhớ rằng <code>BEGIN … END</code> của nó là dấu phân định KHỐI, chẳng liên quan gì tới giao dịch.',
          ),
        }),

        mcq({
          prompt: B(
            'A nightly job must process 100,000 rows and commit every 1,000 so a failure does not lose the whole run. Someone writes it as a PL/pgSQL FUNCTION with <code>COMMIT</code> inside the loop. Measured on PostgreSQL 16.14:' + code(
              'CREATE FUNCTION loopy() RETURNS void LANGUAGE plpgsql\n' +
              '  AS $$ BEGIN INSERT INTO v5 VALUES (99); COMMIT; END; $$;   -- CREATE FUNCTION (accepted)\n' +
              'SELECT loopy();\n' +
              'ERROR:  invalid transaction termination\n' +
              'CONTEXT:  PL/pgSQL function loopy() line 1 at COMMIT\n' +
              '\n' +
              'CREATE PROCEDURE loopy2() LANGUAGE plpgsql\n' +
              '  AS $$ BEGIN INSERT INTO v5 VALUES (98); COMMIT; END; $$;\n' +
              'CALL loopy2();                                              -- CALL (works)',
            ) + 'What is the rule, and when does the mistake show up?',
            'Một tác vụ chạy đêm phải xử lý 100.000 dòng và commit mỗi 1.000 dòng để một lần hỏng không làm mất cả lượt chạy. Có người viết nó thành một FUNCTION PL/pgSQL với <code>COMMIT</code> bên trong vòng lặp. Đo trên PostgreSQL 16.14:' + code(
              'CREATE FUNCTION loopy() RETURNS void LANGUAGE plpgsql\n' +
              '  AS $$ BEGIN INSERT INTO v5 VALUES (99); COMMIT; END; $$;   -- CREATE FUNCTION (được chấp nhận)\n' +
              'SELECT loopy();\n' +
              'ERROR:  invalid transaction termination\n' +
              'CONTEXT:  PL/pgSQL function loopy() line 1 at COMMIT\n' +
              '\n' +
              'CREATE PROCEDURE loopy2() LANGUAGE plpgsql\n' +
              '  AS $$ BEGIN INSERT INTO v5 VALUES (98); COMMIT; END; $$;\n' +
              'CALL loopy2();                                              -- CALL (chạy được)',
            ) + 'Luật là gì, và sai lầm này lộ ra lúc nào?',
          ),
          options: [
            B('A FUNCTION is evaluated as part of a statement that is ALREADY inside a transaction, so it has nothing of its own to commit — and note the failure is at RUN time, not at CREATE time, so the job ships and breaks on the first big batch. A PROCEDURE invoked with <code>CALL</code> is the construct that may commit, which is the main reason procedures exist', 'Một FUNCTION được tính như một phần của câu lệnh vốn ĐÃ nằm trong một giao dịch, nên nó chẳng có gì của riêng mình để commit — và để ý lỗi xảy ra lúc CHẠY chứ không phải lúc CREATE, nên tác vụ được phát hành rồi mới hỏng ở lô lớn đầu tiên. Một PROCEDURE gọi bằng <code>CALL</code> mới là cấu trúc được phép commit, và đó là lý do chính khiến procedure tồn tại'),
            B('The function failed only because it declared <code>RETURNS void</code>; declare <code>RETURNS int</code> and return a value after the <code>COMMIT</code> and the same body runs, because PostgreSQL only forbids transaction control in a function with no result', 'Hàm hỏng chỉ vì nó khai <code>RETURNS void</code>; hãy khai <code>RETURNS int</code> và trả về một giá trị sau <code>COMMIT</code> thì đúng thân hàm ấy chạy được, vì PostgreSQL chỉ cấm điều khiển giao dịch trong hàm không có kết quả'),
            B('<code>BEGIN … END</code> in PL/pgSQL opens a transaction, so the <code>COMMIT</code> closed it and the error came from the block having nothing left to end; move the <code>COMMIT</code> before the <code>END</code> of an inner block and the function works', '<code>BEGIN … END</code> trong PL/pgSQL mở một giao dịch, nên <code>COMMIT</code> đã đóng nó lại và lỗi đến từ việc cái khối chẳng còn gì để kết thúc; hãy chuyển <code>COMMIT</code> vào trước <code>END</code> của một khối con thì hàm chạy được'),
            B('Both forms are equivalent and the difference is the client: <code>SELECT</code> wraps its argument in an implicit transaction while <code>CALL</code> does not, so running <code>BEGIN; SELECT loopy(); COMMIT;</code> would have succeeded', 'Hai dạng tương đương nhau và khác biệt nằm ở phía client: <code>SELECT</code> bọc tham số của nó trong một giao dịch ngầm còn <code>CALL</code> thì không, nên chạy <code>BEGIN; SELECT loopy(); COMMIT;</code> thì đã thành công'),
          ],
          correct: 0,
          explanation: EX(
            'A function is an expression — it is evaluated as part of a statement, and that statement is already inside a transaction, so there is nothing for it to commit. PostgreSQL accepts the definition and raises at run time, which is precisely why this ships and fails at 2am on the first big batch rather than during review. A <code>PROCEDURE</code> called with <code>CALL</code> is the construct that may contain <code>COMMIT</code> and <code>ROLLBACK</code>, provided it is not itself called from inside an explicit transaction block — <code>CALL</code> it directly, not inside <code>BEGIN; … COMMIT;</code>, which is why the last option is backwards. The other half of the confusion is worth naming: PL/pgSQL\'s <code>BEGIN … END</code> looks exactly like SQL\'s transaction <code>BEGIN</code> and is a completely different keyword — it opens a block that can carry <code>DECLARE</code>s and an <code>EXCEPTION</code> handler. And when you do use an exception handler, note it is implemented with a savepoint per invocation, so wrapping every row of a 100,000-row loop in one is a known way to make a busy server crawl.',
            'Một hàm là một biểu thức — nó được tính như một phần của câu lệnh, mà câu lệnh đó vốn đã nằm trong một giao dịch, nên chẳng có gì cho nó commit cả. PostgreSQL chấp nhận định nghĩa và chỉ báo lỗi lúc chạy, và chính vì thế thứ này được phát hành rồi hỏng lúc 2 giờ sáng ở lô lớn đầu tiên chứ không phải lúc review. <code>PROCEDURE</code> gọi bằng <code>CALL</code> mới là cấu trúc được phép chứa <code>COMMIT</code> và <code>ROLLBACK</code>, với điều kiện bản thân nó không bị gọi từ bên trong một khối giao dịch tường minh — hãy <code>CALL</code> thẳng, đừng đặt trong <code>BEGIN; … COMMIT;</code>, và đó là lý do phương án cuối nói ngược. Nửa còn lại của sự nhầm lẫn cũng đáng gọi tên: <code>BEGIN … END</code> của PL/pgSQL trông y hệt <code>BEGIN</code> giao dịch của SQL mà lại là một từ khoá hoàn toàn khác — nó mở một khối có thể mang các <code>DECLARE</code> và một trình xử lý <code>EXCEPTION</code>. Và khi bạn dùng trình xử lý ngoại lệ, nhớ rằng nó được cài đặt bằng một savepoint cho mỗi lần vào, nên bọc từng dòng của một vòng lặp 100.000 dòng bằng nó là cách đã biết để làm máy chủ bận bò lê.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. One table, two triggers running the SAME logging function, differing only in <code>FOR EACH</code>:' + code(
              'CREATE TRIGGER a_row  AFTER INSERT ON tg_t FOR EACH ROW       EXECUTE FUNCTION ghi();\n' +
              'CREATE TRIGGER b_stmt AFTER INSERT ON tg_t FOR EACH STATEMENT EXECUTE FUNCTION ghi();\n' +
              '\n' +
              "INSERT INTO tg_t SELECT i, 'x' FROM generate_series(1,3) i;      -- INSERT 0 3\n" +
              ' nguon - tg_level  - count\n' +
              ' row   - ROW       -     3\n' +
              ' stmt  - STATEMENT -     1\n' +
              '\n' +
              "-- a statement-level trigger that does RAISE NOTICE 'id=%', NEW.id:\n" +
              'NOTICE:  id=<NULL>\n' +
              '\n' +
              "-- and a statement that inserts NOTHING:\n" +
              "INSERT INTO tg_t SELECT i,'z' FROM generate_series(1,0) i;       -- INSERT 0 0\n" +
              ' stmt  -     1        ← the statement trigger fired anyway',
            ) + 'Which reading of these three results is correct?',
            'Đo trên PostgreSQL 16.14. Một bảng, hai trigger chạy CÙNG một hàm ghi log, chỉ khác nhau ở <code>FOR EACH</code>:' + code(
              'CREATE TRIGGER a_row  AFTER INSERT ON tg_t FOR EACH ROW       EXECUTE FUNCTION ghi();\n' +
              'CREATE TRIGGER b_stmt AFTER INSERT ON tg_t FOR EACH STATEMENT EXECUTE FUNCTION ghi();\n' +
              '\n' +
              "INSERT INTO tg_t SELECT i, 'x' FROM generate_series(1,3) i;      -- INSERT 0 3\n" +
              ' nguon - tg_level  - count\n' +
              ' row   - ROW       -     3\n' +
              ' stmt  - STATEMENT -     1\n' +
              '\n' +
              "-- một trigger mức câu lệnh chạy RAISE NOTICE 'id=%', NEW.id:\n" +
              'NOTICE:  id=<NULL>\n' +
              '\n' +
              "-- và một câu lệnh KHÔNG chèn dòng nào:\n" +
              "INSERT INTO tg_t SELECT i,'z' FROM generate_series(1,0) i;       -- INSERT 0 0\n" +
              ' stmt  -     1        ← trigger mức câu lệnh vẫn nổ',
            ) + 'Cách đọc nào về ba kết quả này là đúng?',
          ),
          options: [
            B('A statement-level trigger fires once per ROW as well, and the count of 1 only appears because the three rows arrived in one <code>INSERT … SELECT</code>; write three separate INSERTs and both counts become 3', 'Trigger mức câu lệnh cũng nổ một lần cho mỗi DÒNG, và con số 1 chỉ xuất hiện vì ba dòng đến trong cùng một <code>INSERT … SELECT</code>; viết ba lệnh INSERT riêng thì cả hai con số đều thành 3'),
            B('A statement-level trigger is skipped when the statement affects no rows — the final <code>1</code> is the earlier statement\'s log row still sitting in the table, not a new fire', 'Trigger mức câu lệnh bị bỏ qua khi câu lệnh không tác động dòng nào — con số <code>1</code> cuối cùng là dòng log của câu lệnh trước còn nằm lại trong bảng chứ không phải một lần nổ mới'),
            B('Referencing <code>NEW</code> from a statement-level trigger is an error that PostgreSQL happened to downgrade to a notice here; the correct form is <code>OLD</code>, which a statement trigger does receive', 'Tham chiếu <code>NEW</code> từ một trigger mức câu lệnh là một lỗi mà PostgreSQL tình cờ hạ xuống thành notice ở đây; dạng đúng là <code>OLD</code>, thứ mà trigger mức câu lệnh có nhận được'),
            B('The row trigger fired 3 times and the statement trigger once, because a statement-level trigger runs once per STATEMENT — it has no row to work on, so <code>NEW</code> is not populated, and it fires even when the statement affected ZERO rows', 'Trigger mức dòng nổ 3 lần còn trigger mức câu lệnh nổ 1 lần, vì trigger mức câu lệnh chạy một lần cho mỗi CÂU LỆNH — nó không có dòng nào để làm việc, nên <code>NEW</code> không được gán giá trị, và nó nổ cả khi câu lệnh không tác động tới dòng nào'),
          ],
          correct: 3,
          explanation: EX(
            'Two levels, two different jobs. <code>FOR EACH ROW</code> runs once per affected row and is handed that row in <code>NEW</code> / <code>OLD</code> — it is the level for per-row work: stamping <code>updated_at</code>, validating, writing an audit row. <code>FOR EACH STATEMENT</code> runs exactly once per statement no matter how many rows moved, and since there is no particular row, <code>NEW</code> is simply not populated: the measured notice printed <code>&lt;NULL&gt;</code> rather than raising, which is worse than an error because a bug written that way is silent. Use the statement level for work that is per-statement by nature — refreshing a summary, sending one notification for a bulk load — and remember the third measurement: it fires even when the statement matched nothing, so a statement trigger that assumes "something changed" will do its work over an empty set. If you need the changed rows at statement level, the modern tool is a transition table (<code>REFERENCING NEW TABLE AS moi</code>), which gives the whole set in one relation and is far cheaper than a row trigger firing 100,000 times. The cost argument is the practical one: a row trigger on a bulk load runs once per row, and that is exactly where an innocuous-looking trigger turns an import into an outage.',
            'Hai mức, hai công việc khác nhau. <code>FOR EACH ROW</code> chạy một lần cho mỗi dòng bị tác động và được đưa cho dòng ấy trong <code>NEW</code> / <code>OLD</code> — đó là mức dành cho việc theo từng dòng: đóng dấu <code>updated_at</code>, kiểm tính hợp lệ, ghi một dòng kiểm toán. <code>FOR EACH STATEMENT</code> chạy đúng một lần cho mỗi câu lệnh bất kể bao nhiêu dòng đã dịch chuyển, và vì không có dòng nào cụ thể nên <code>NEW</code> đơn giản là không được gán: notice đo được in ra <code>&lt;NULL&gt;</code> chứ không báo lỗi — điều đó còn tệ hơn một lỗi, vì một chỗ sai viết theo kiểu ấy sẽ im lặng. Hãy dùng mức câu lệnh cho những việc vốn dĩ thuộc về cả câu lệnh — làm mới một bảng tóm tắt, gửi một thông báo duy nhất cho một lượt nạp hàng loạt — và nhớ phép đo thứ ba: nó nổ cả khi câu lệnh không khớp gì, nên một trigger mức câu lệnh mặc định rằng "có thứ gì đó đã thay đổi" sẽ làm việc của nó trên một tập rỗng. Nếu bạn cần đúng những dòng đã thay đổi ở mức câu lệnh thì công cụ hiện đại là bảng chuyển tiếp (<code>REFERENCING NEW TABLE AS moi</code>), nó đưa cả tập dòng trong một quan hệ và rẻ hơn hẳn một trigger mức dòng nổ 100.000 lần. Lập luận về chi phí mới là cái thực tế: một trigger mức dòng trên một lượt nạp hàng loạt chạy một lần cho mỗi dòng, và đó đúng là chỗ một trigger trông vô hại biến một lượt nhập dữ liệu thành một sự cố.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. An <code>AFTER UPDATE … FOR EACH ROW</code> audit trigger logs only when <code>views</code> changed. THREE statements ran — two real bumps and one no-op — and the audit table gained TWO rows:' + code(
              "IF TG_OP = 'UPDATE' AND NEW.views IS DISTINCT FROM OLD.views THEN   -- what was used\n" +
              "IF TG_OP = 'UPDATE' AND NEW.views <> OLD.views THEN                  -- the tempting alternative\n" +
              '\n' +
              'UPDATE notes SET views = views + 1 WHERE id = 1;    -- UPDATE 1\n' +
              'UPDATE notes SET views = views + 1 WHERE id = 2;    -- UPDATE 1\n' +
              'UPDATE notes SET title = title      WHERE id = 3;   -- UPDATE 1   ← changes nothing\n' +
              'SELECT count(*) FROM audit_log;   -- 2',
            ) + 'Which explanation of the 2 is right, and which comparison has a hole in it?',
            'Đo trên PostgreSQL 16.14. Một trigger kiểm toán <code>AFTER UPDATE … FOR EACH ROW</code> chỉ ghi log khi <code>views</code> đổi. BA câu lệnh đã chạy — hai lần tăng thật và một lần không đổi gì — và bảng kiểm toán nhận thêm HAI dòng:' + code(
              "IF TG_OP = 'UPDATE' AND NEW.views IS DISTINCT FROM OLD.views THEN   -- đang dùng\n" +
              "IF TG_OP = 'UPDATE' AND NEW.views <> OLD.views THEN                  -- lựa chọn hấp dẫn khác\n" +
              '\n' +
              'UPDATE notes SET views = views + 1 WHERE id = 1;    -- UPDATE 1\n' +
              'UPDATE notes SET views = views + 1 WHERE id = 2;    -- UPDATE 1\n' +
              'UPDATE notes SET title = title      WHERE id = 3;   -- UPDATE 1   ← không đổi gì cả\n' +
              'SELECT count(*) FROM audit_log;   -- 2',
            ) + 'Cách giải thích nào cho con số 2 là đúng, và phép so sánh nào có lỗ hổng?',
          ),
          options: [
            B('PostgreSQL compares the row for you and never fires a row trigger for an update that changes nothing, so the third statement never reached the function — and the two comparisons are interchangeable for a numeric column, since a column declared <code>NOT NULL</code> can never make either of them return UNKNOWN', 'PostgreSQL tự so cả dòng giúp bạn và không bao giờ kích hoạt trigger mức dòng cho một lần update không đổi gì, nên câu lệnh thứ ba chưa hề tới được hàm — và hai phép so sánh thì thay thế được cho nhau với một cột kiểu số, vì một cột khai <code>NOT NULL</code> thì không bao giờ làm cái nào trong hai trả về UNKNOWN'),
            B('<code>&lt;&gt;</code> is the correct one and <code>IS DISTINCT FROM</code> is the one with the hole, because it treats two NULLs as equal and would therefore miss a change from NULL to NULL, and a column going from 42 to NULL is the case <code>&lt;&gt;</code> handles correctly', '<code>&lt;&gt;</code> mới đúng còn <code>IS DISTINCT FROM</code> mới là cái có lỗ hổng, vì nó coi hai NULL là bằng nhau nên sẽ bỏ sót một thay đổi từ NULL sang NULL, còn một cột đi từ 42 sang NULL mới là ca mà <code>&lt;&gt;</code> xử lý đúng'),
            B('The third statement DID fire the trigger — <code>SET title = title</code> is a real update that writes a new row version — and the condition is what stopped it logging. <code>IS DISTINCT FROM</code> is the right comparison: with <code>&lt;&gt;</code> any comparison involving NULL yields UNKNOWN, which <code>IF</code> treats as false, so a change from a value to NULL or back would be silently missed', 'Câu lệnh thứ ba VẪN kích hoạt trigger — <code>SET title = title</code> là một lần update thật, nó ghi ra một phiên bản dòng mới — và chính điều kiện mới là thứ chặn nó ghi log. <code>IS DISTINCT FROM</code> là phép so sánh đúng: với <code>&lt;&gt;</code>, mọi phép so sánh có NULL đều cho ra UNKNOWN, thứ mà <code>IF</code> coi như sai, nên một thay đổi từ một giá trị sang NULL hoặc ngược lại sẽ bị bỏ sót trong im lặng'),
            B('The count is 2 because an <code>AFTER</code> trigger is queued until COMMIT and only two of the three had flushed when the count was taken; commit and the third audit row appears — which is also why an audit trigger should always be <code>AFTER</code> rather than <code>BEFORE</code>', 'Con số 2 là vì trigger <code>AFTER</code> bị xếp hàng tới lúc COMMIT và mới hai trong ba cái kịp đẩy ra khi phép đếm được lấy; commit rồi thì dòng kiểm toán thứ ba xuất hiện — và cũng vì thế một trigger kiểm toán luôn nên là <code>AFTER</code> chứ không phải <code>BEFORE</code>'),
          ],
          correct: 2,
          explanation: EX(
            'Two facts, and both surprise people. First, PostgreSQL does NOT compare rows for you: <code>UPDATE notes SET title = title</code> is a real update, it writes a new row version (and leaves a dead one for VACUUM), and it fires every row-level trigger on the table. The audit stayed at two entries because the trigger asked whether the column it cares about changed and got FALSE — the filtering was done by your condition, not by the server. Second, the comparison must be the NULL-aware one. <code>NEW.views &lt;&gt; OLD.views</code> is UNKNOWN whenever either side is NULL, and <code>IF</code> treats UNKNOWN as false, so a column going from 42 to NULL — arguably the most interesting change there is — would never be logged. <code>IS DISTINCT FROM</code> is the operator that treats NULL as a value: two NULLs are NOT distinct, one NULL is. The same reasoning applies to the whole-row form <code>NEW IS DISTINCT FROM OLD</code>, the usual guard for "did anything at all change", and to the <code>WHEN (…)</code> clause you can attach to <code>CREATE TRIGGER</code> to skip the function call entirely — cheaper still, because the condition is evaluated by the executor without entering PL/pgSQL.',
            'Hai sự thật, và cả hai đều làm người ta bất ngờ. Thứ nhất, PostgreSQL KHÔNG so sánh các dòng giúp bạn: <code>UPDATE notes SET title = title</code> là một lần update thật, nó ghi ra một phiên bản dòng mới (và để lại một phiên bản chết cho VACUUM), và nó kích hoạt mọi trigger mức dòng trên bảng đó. Bảng kiểm toán dừng ở hai mục vì trigger đã hỏi xem cột nó quan tâm có đổi không và nhận về FALSE — việc lọc là do điều kiện của bạn làm, không phải do máy chủ. Thứ hai, phép so sánh phải là phép có nhận biết NULL. <code>NEW.views &lt;&gt; OLD.views</code> là UNKNOWN mỗi khi một vế là NULL, và <code>IF</code> coi UNKNOWN như sai, nên một cột đi từ 42 sang NULL — có lẽ là thay đổi thú vị nhất — sẽ không bao giờ được ghi log. <code>IS DISTINCT FROM</code> là toán tử coi NULL như một giá trị: hai NULL thì KHÔNG khác nhau, một NULL thì khác. Cũng lý lẽ ấy áp cho dạng cả-dòng <code>NEW IS DISTINCT FROM OLD</code>, cái chốt thường dùng cho câu hỏi "có gì đổi không", và cho mệnh đề <code>WHEN (…)</code> bạn gắn được vào <code>CREATE TRIGGER</code> để khỏi gọi hàm luôn — còn rẻ hơn nữa, vì điều kiện được bộ thực thi tính mà không phải bước vào PL/pgSQL.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. A trigger keeps a <code>last_touched</code> column in step by issuing an UPDATE on its own table:' + code(
              'CREATE FUNCTION de_quy() RETURNS trigger LANGUAGE plpgsql AS $$\n' +
              '  BEGIN UPDATE rec_t SET last_touched = now() WHERE id = NEW.id; RETURN NULL; END; $$;\n' +
              'CREATE TRIGGER tr_rec AFTER UPDATE ON rec_t FOR EACH ROW EXECUTE FUNCTION de_quy();\n' +
              '\n' +
              'UPDATE rec_t SET v = 2 WHERE id = 1;\n' +
              'ERROR:  stack depth limit exceeded',
            ) + 'What is happening, and what is the structural fix?',
            'Đo trên PostgreSQL 16.14. Một trigger giữ cột <code>last_touched</code> luôn đúng bằng cách phát ra một lệnh UPDATE lên chính bảng của nó:' + code(
              'CREATE FUNCTION de_quy() RETURNS trigger LANGUAGE plpgsql AS $$\n' +
              '  BEGIN UPDATE rec_t SET last_touched = now() WHERE id = NEW.id; RETURN NULL; END; $$;\n' +
              'CREATE TRIGGER tr_rec AFTER UPDATE ON rec_t FOR EACH ROW EXECUTE FUNCTION de_quy();\n' +
              '\n' +
              'UPDATE rec_t SET v = 2 WHERE id = 1;\n' +
              'ERROR:  stack depth limit exceeded',
            ) + 'Chuyện gì đang xảy ra, và cách sửa thuộc về cấu trúc là gì?',
          ),
          options: [
            B('Writing to the table from inside its OWN trigger re-fires that trigger, which writes again, until the stack limit stops it mid-statement and the whole original statement rolls back. Use a <code>BEFORE</code> trigger and ASSIGN to <code>NEW</code> instead — assignment issues no statement, so it re-fires nothing', 'Ghi vào chính bảng đó từ bên trong trigger CỦA NÓ sẽ kích hoạt lại chính trigger ấy, rồi lại ghi tiếp, cho tới khi giới hạn ngăn xếp chặn nó giữa chừng và cả câu lệnh gốc bị quay lui. Hãy dùng trigger <code>BEFORE</code> và GÁN vào <code>NEW</code> — phép gán không phát ra câu lệnh nào nên không kích hoạt lại gì cả'),
            B('<code>now()</code> is VOLATILE, so PostgreSQL re-evaluates it at every recursion level; wrap it in a function marked <code>IMMUTABLE</code> and the recursion terminates on the second pass', '<code>now()</code> là VOLATILE nên PostgreSQL tính lại nó ở mỗi mức đệ quy; hãy bọc nó trong một hàm khai <code>IMMUTABLE</code> thì đệ quy dừng ở lượt thứ hai'),
            B('<code>RETURN NULL</code> from an AFTER trigger cancelled the row, so the outer statement retried it forever; return <code>NEW</code> instead and the single UPDATE completes', '<code>RETURN NULL</code> từ một trigger AFTER đã huỷ dòng đó, nên câu lệnh bên ngoài thử lại mãi; hãy trả về <code>NEW</code> thì lệnh UPDATE duy nhất ấy hoàn tất'),
            B('The error is a resource limit, not a logic bug: raise <code>max_stack_depth</code> to match the number of rows in the table and the trigger works as written', 'Lỗi này là một giới hạn tài nguyên chứ không phải lỗi logic: hãy nâng <code>max_stack_depth</code> lên cho khớp với số dòng trong bảng thì trigger chạy đúng như đã viết'),
          ],
          correct: 0,
          explanation: EX(
            'A trigger that writes to its own table is a loop with no exit unless you build one. The <code>UPDATE</code> issued from inside the trigger is an ordinary update as far as PostgreSQL is concerned, so it fires the trigger again, which updates again, until the stack depth limit stops it mid-statement — and because everything is in one transaction, the whole original statement rolls back, so the symptom is "my update fails" rather than "my trigger loops". Two ways out. The structural one is the answer above: a <code>BEFORE</code> trigger receives the row in <code>NEW</code> before it is written, so <code>NEW.last_touched := now(); RETURN NEW;</code> changes the row that is about to be stored without issuing any statement at all. That is exactly why the canonical <code>updated_at</code> trigger is <code>BEFORE UPDATE</code>. The other, when you genuinely must write to the same table, is a guard that cannot stay true — <code>IF NEW.views IS DISTINCT FROM OLD.views THEN …</code> — so the second pass does nothing. The broader warning from lesson 12.2: logic in a trigger is invisible from application code, so keep triggers for invariants that must hold no matter who writes, and keep business rules where a developer can find them.',
            'Một trigger ghi vào chính bảng của nó là một vòng lặp không có lối ra, trừ khi bạn tự dựng một lối. Lệnh <code>UPDATE</code> phát ra từ bên trong trigger, dưới mắt PostgreSQL, là một lệnh update bình thường, nên nó kích hoạt trigger lần nữa, rồi lại update, cho tới khi giới hạn độ sâu ngăn xếp chặn nó lại giữa chừng — và vì mọi thứ nằm trong một giao dịch, cả câu lệnh gốc bị quay lui, nên triệu chứng là "lệnh update của tôi hỏng" chứ không phải "trigger của tôi lặp vô tận". Có hai lối ra. Lối thuộc về cấu trúc là đáp án ở trên: một trigger <code>BEFORE</code> nhận dòng trong <code>NEW</code> trước khi nó được ghi, nên <code>NEW.last_touched := now(); RETURN NEW;</code> đổi chính cái dòng sắp được lưu mà không phát ra câu lệnh nào cả. Đó đúng là lý do trigger <code>updated_at</code> kinh điển luôn là <code>BEFORE UPDATE</code>. Lối còn lại, khi bạn thật sự phải ghi vào chính bảng đó, là một cái chốt không thể đúng mãi — <code>IF NEW.views IS DISTINCT FROM OLD.views THEN …</code> — để lượt thứ hai không làm gì nữa. Cảnh báo rộng hơn ở bài 12.2: logic nằm trong trigger thì vô hình với mã ứng dụng, nên hãy dành trigger cho những bất biến phải đúng bất kể ai ghi, và giữ quy tắc nghiệp vụ ở chỗ lập trình viên tìm ra được.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. Three writes through two views:' + code(
              'CREATE VIEW note_u1 AS SELECT id, user_id, title, views FROM notes2 WHERE user_id = 1;\n' +
              'UPDATE note_u1 SET views   = 5 WHERE id = 20;   -- UPDATE 1\n' +
              'UPDATE note_u1 SET user_id = 2 WHERE id = 20;   -- UPDATE 1 … and the row left the view\n' +
              '\n' +
              'CREATE VIEW note_summary AS SELECT user_id, count(*) AS so_note FROM notes GROUP BY user_id;\n' +
              'UPDATE note_summary SET so_note = 0 WHERE user_id = 1;\n' +
              'ERROR:  cannot update view "note_summary"\n' +
              'DETAIL:  Views containing GROUP BY are not automatically updatable.\n' +
              '\n' +
              '-- the same simple view, declared WITH CHECK OPTION:\n' +
              'UPDATE note_u1c SET user_id = 9 WHERE id = 21;\n' +
              'ERROR:  new row violates check option for view "note_u1c"',
            ) + 'Which reading is right?',
            'Đo trên PostgreSQL 16.14. Ba lệnh ghi qua hai view:' + code(
              'CREATE VIEW note_u1 AS SELECT id, user_id, title, views FROM notes2 WHERE user_id = 1;\n' +
              'UPDATE note_u1 SET views   = 5 WHERE id = 20;   -- UPDATE 1\n' +
              'UPDATE note_u1 SET user_id = 2 WHERE id = 20;   -- UPDATE 1 … và dòng đó rời khỏi view\n' +
              '\n' +
              'CREATE VIEW note_summary AS SELECT user_id, count(*) AS so_note FROM notes GROUP BY user_id;\n' +
              'UPDATE note_summary SET so_note = 0 WHERE user_id = 1;\n' +
              'ERROR:  cannot update view "note_summary"\n' +
              'DETAIL:  Views containing GROUP BY are not automatically updatable.\n' +
              '\n' +
              '-- vẫn view đơn giản đó, nhưng khai WITH CHECK OPTION:\n' +
              'UPDATE note_u1c SET user_id = 9 WHERE id = 21;\n' +
              'ERROR:  new row violates check option for view "note_u1c"',
            ) + 'Cách đọc nào đúng?',
          ),
          options: [
            B('A view stores its rows, so writing to one writes to a copy; <code>note_u1</code> worked because its copy was small enough to be kept in sync automatically, which is exactly what the word "materialized" refers to; the copy behind the aggregate view was simply too large for PostgreSQL to maintain that way', 'Một view lưu các dòng của nó, nên ghi vào view là ghi vào một bản sao; <code>note_u1</code> chạy được vì bản sao đó đủ nhỏ để được đồng bộ tự động, và đó chính là ý nghĩa của chữ "materialized"; bản sao của view tổng hợp thì đơn giản là quá lớn để PostgreSQL bảo trì theo cách ấy'),
            B('The difference is the <code>WHERE</code> clause: a view with a filter is updatable and a view without one is not, which is why the aggregate view would work if you added <code>WHERE user_id = 1</code> to it. That is also why <code>WITH CHECK OPTION</code> exists only for filtered views: there has to be a filter for it to check the new row against', 'Khác biệt nằm ở mệnh đề <code>WHERE</code>: một view có bộ lọc thì ghi được còn view không có thì không, và vì thế view tổng hợp sẽ chạy được nếu bạn thêm <code>WHERE user_id = 1</code> vào. Đó cũng là lý do <code>WITH CHECK OPTION</code> chỉ có cho những view có bộ lọc: phải có một bộ lọc thì nó mới đem dòng mới ra mà kiểm được'),
            B('<code>note_summary</code> failed because it is a materialized view, and a materialized view is read-only until you <code>REFRESH</code> it with the <code>CONCURRENTLY</code> option. The first two statements succeeded because <code>note_u1</code> is a plain view, and PostgreSQL keeps a plain view writable by re-running its query on every write', '<code>note_summary</code> hỏng vì nó là materialized view, và materialized view chỉ đọc được cho tới khi bạn <code>REFRESH</code> nó với tuỳ chọn <code>CONCURRENTLY</code>. Hai câu lệnh đầu chạy được vì <code>note_u1</code> là một view thường, và PostgreSQL giữ cho view thường ghi được bằng cách chạy lại truy vấn của nó ở mỗi lần ghi'),
            B('A view stores a QUERY, not rows. PostgreSQL rewrites a write onto the base table when the view reads ONE table with no aggregation, <code>DISTINCT</code>, <code>GROUP BY</code> or set operation — otherwise there is no single base row to write to, and an <code>INSTEAD OF</code> trigger is where you define what the write should mean. And note the second UPDATE succeeded and pushed the row OUT of the view; <code>WITH CHECK OPTION</code> is exactly what forbids that', 'Một view lưu một TRUY VẤN chứ không lưu dòng. PostgreSQL viết lại lệnh ghi lên bảng gốc khi view đọc MỘT bảng, không có tổng hợp, không <code>DISTINCT</code>, không <code>GROUP BY</code>, không phép toán tập hợp — còn lại thì không có dòng gốc đơn nào để ghi vào, và một trigger <code>INSTEAD OF</code> là chỗ bạn định nghĩa lệnh ghi đó nghĩa là gì. Và để ý lệnh UPDATE thứ hai đã thành công và đẩy dòng đó RA KHỎI view; <code>WITH CHECK OPTION</code> đúng là thứ cấm chuyện ấy'),
          ],
          correct: 3,
          explanation: EX(
            'A view is a stored query definition — PostgreSQL substitutes it into your statement and plans the whole thing together, so reading one costs whatever the query costs and it is always exactly as fresh as the tables underneath. Writes work by rewriting: if the view is a simple projection and filter over a single table, the server knows which base row each view row came from and rewrites the <code>UPDATE</code> onto it. Add an aggregate and that correspondence disappears — which base row would <code>so_note = 0</code> change? The error names the escape hatch precisely, and an <code>INSTEAD OF</code> trigger is you supplying the correspondence by hand: you write the <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code> that a write against the view should actually perform. The sharp edge is the second update: it succeeded and moved the row out of the view\'s own <code>WHERE</code>, so it vanished from the view you wrote it through — no error, no warning, and to the application it looks like the row was deleted. <code>WITH CHECK OPTION</code> turns that into the measured refusal instead, and if you expose a per-tenant view for writing it is not optional: without it, a tenant can move a row into another tenant\'s view.',
            'Một view là một định nghĩa truy vấn được lưu lại — PostgreSQL thay nó vào câu lệnh của bạn rồi lập kế hoạch cho cả cụm, nên đọc một view tốn đúng bằng chi phí của truy vấn đó, và nó luôn tươi mới đúng bằng các bảng bên dưới. Việc ghi hoạt động bằng cách viết lại: nếu view chỉ là một phép chiếu và lọc trên một bảng duy nhất, máy chủ biết mỗi dòng của view đến từ dòng gốc nào và viết lại lệnh <code>UPDATE</code> lên dòng đó. Thêm một hàm tổng hợp vào là mối tương ứng ấy biến mất — <code>so_note = 0</code> thì phải đổi dòng gốc nào? Thông báo lỗi gọi tên lối thoát rất chính xác, và một trigger <code>INSTEAD OF</code> chính là việc bạn tự tay cung cấp mối tương ứng đó: bạn viết ra lệnh <code>INSERT</code>/<code>UPDATE</code>/<code>DELETE</code> mà một lệnh ghi vào view thật sự nên thực hiện. Cạnh sắc nằm ở lệnh update thứ hai: nó thành công và đẩy dòng ra khỏi chính mệnh đề <code>WHERE</code> của view, nên nó biến mất khỏi cái view mà bạn vừa ghi qua — không lỗi, không cảnh báo, và với ứng dụng thì trông như dòng đó bị xoá. <code>WITH CHECK OPTION</code> biến chuyện đó thành lời từ chối đo được ở trên, và nếu bạn mở một view theo từng khách hàng cho phép ghi thì nó không phải tuỳ chọn: thiếu nó, một khách hàng đẩy được một dòng sang view của khách hàng khác.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. A view and a materialized view were created from the SAME query, then one row was inserted:' + code(
              'CREATE VIEW             note_summary    AS SELECT user_id, sum(views) AS tong FROM notes GROUP BY user_id;\n' +
              'CREATE MATERIALIZED VIEW note_summary_mv AS SELECT user_id, sum(views) AS tong FROM notes GROUP BY user_id;\n' +
              '\n' +
              "INSERT INTO notes(user_id, title, views) VALUES (7, 'them', 1000);\n" +
              '\n' +
              " loai    - tong\n" +
              ' view    - 2200\n' +
              ' matview - 1200',
            ) + 'What did that INSERT reveal, and what should you build alongside a materialized view?',
            'Đo trên PostgreSQL 16.14. Một view và một materialized view được tạo từ CÙNG một truy vấn, rồi một dòng được chèn vào:' + code(
              'CREATE VIEW             note_summary    AS SELECT user_id, sum(views) AS tong FROM notes GROUP BY user_id;\n' +
              'CREATE MATERIALIZED VIEW note_summary_mv AS SELECT user_id, sum(views) AS tong FROM notes GROUP BY user_id;\n' +
              '\n' +
              "INSERT INTO notes(user_id, title, views) VALUES (7, 'them', 1000);\n" +
              '\n' +
              " loai    - tong\n" +
              ' view    - 2200\n' +
              ' matview - 1200',
            ) + 'Lệnh INSERT ấy đã phơi ra điều gì, và bạn cần dựng thêm cái gì bên cạnh một materialized view?',
          ),
          options: [
            B('The 1000 gap is a caching artefact that disappears on the next read, so nothing needs building — a materialized view re-runs its query whenever the underlying tables change, which is how it manages to be both fast and current at the same time', 'Chênh lệch 1000 là hiện tượng do bộ đệm và sẽ biến mất ở lần đọc kế tiếp, nên chẳng cần dựng thêm gì — một materialized view tự chạy lại truy vấn của nó mỗi khi các bảng bên dưới thay đổi, và đó là cách nó vừa nhanh vừa luôn mới cùng lúc'),
            B('A materialized view STORES the query\'s rows on disk, so it is fast and STALE until something refreshes it — there is no expiry and no background job and no warning, so a matview whose refresh was never scheduled serves the same numbers for months while every query against it is fast and wrong. Schedule the refresh in the same change that creates the view, and show the refresh time next to the number', 'Một materialized view LƯU các dòng của truy vấn xuống đĩa, nên nó nhanh và nó CŨ cho tới khi có thứ gì đó làm mới nó — không có hạn dùng, không có tác vụ nền, không có cảnh báo, nên một matview mà lần refresh chưa bao giờ được lên lịch sẽ phục vụ đúng những con số ấy hàng tháng trời trong khi mọi truy vấn vào nó đều nhanh và sai. Hãy lên lịch refresh ngay trong cùng lần thay đổi tạo ra view, và hiện thời điểm refresh ngay cạnh con số'),
            B('Both objects store rows; the plain view is simply refreshed automatically on every read, which is why it costs more per query and why only the matview can be indexed; the 1000 gap therefore measures the cost of that automatic refresh rather than any staleness', 'Cả hai đối tượng đều lưu dòng; chỉ là view thường được tự làm mới ở mỗi lần đọc, và vì thế nó tốn hơn cho mỗi truy vấn, cũng vì thế chỉ matview mới lập chỉ mục được; chênh lệch 1000 vì thế đo cái giá của lần tự làm mới ấy chứ không phải sự cũ kỹ nào cả'),
            B('The matview is behind because <code>sum()</code> is not incrementally maintainable; use <code>count()</code> instead and PostgreSQL keeps the stored rows in step automatically — incremental maintenance is available for any aggregate whose result can be updated from the previous value', 'Matview bị tụt lại vì <code>sum()</code> không bảo trì tăng dần được; hãy dùng <code>count()</code> thay vào đó thì PostgreSQL tự giữ các dòng đã lưu luôn khớp — việc bảo trì tăng dần có sẵn cho mọi hàm tổng hợp mà kết quả cập nhật được từ giá trị trước đó'),
          ],
          correct: 1,
          explanation: EX(
            'The whole trade is in those two numbers: the plain view recomputed and answered 2200, the materialized view handed back the rows it stored when it was created and answered 1200. That is not a bug, it is the feature — you buy speed with staleness, and for a heavy aggregate over millions of rows that is often the right trade. The danger is that nothing tells you. There is no expiry, no invalidation, no background maintenance and no warning in the log; every one of those queries is fast, and every one of them is wrong by exactly as much as has happened since the last refresh. So treat the refresh as part of the object: create it in the same migration (a cron entry, a scheduled job, <code>pg_cron</code>), and surface the refresh timestamp wherever the number is read, so a stale figure looks stale instead of looking like a business trend. A materialized view can also carry indexes of its own, which is the other half of why it is fast — and note that a plain view cannot, because there are no stored rows to index.',
            'Toàn bộ cuộc đánh đổi nằm trong hai con số ấy: view thường tính lại và trả lời 2200, còn materialized view đưa lại đúng những dòng nó đã lưu lúc được tạo và trả lời 1200. Đó không phải lỗi, đó là tính năng — bạn mua tốc độ bằng sự cũ kỹ, và với một phép tổng hợp nặng trên hàng triệu dòng thì đó thường là đánh đổi đúng. Chỗ nguy hiểm là chẳng có gì báo cho bạn. Không hạn dùng, không cơ chế vô hiệu hoá, không bảo trì nền, không một dòng cảnh báo nào trong log; mọi truy vấn kiểu đó đều nhanh, và mọi truy vấn đó đều sai đúng bằng lượng thay đổi kể từ lần refresh cuối. Nên hãy coi việc refresh là một phần của chính đối tượng: tạo nó trong cùng một migration (một mục cron, một job hẹn giờ, <code>pg_cron</code>), và cho hiện mốc thời gian refresh ở đúng chỗ người ta đọc con số, để một giá trị cũ trông ra vẻ cũ chứ đừng trông như một xu hướng kinh doanh. Một materialized view cũng mang được chỉ mục của riêng nó, và đó là nửa còn lại của lý do nó nhanh — còn view thường thì không, vì nó chẳng có dòng nào đã lưu để mà lập chỉ mục.',
          ),
        }),

        // ── Chương 13 — JSONB & tìm kiếm văn bản ────────────────────────
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. The same literals cast two ways, and a second experiment on key order:' + code(
              'SELECT \'{"b":1,"a":2,"a":3}\'::json  AS j,\n' +
              '       \'{"b":1,"a":2,"a":3}\'::jsonb AS jb;\n' +
              '           j            -        jb\n' +
              ' {"b":1,"a":2,"a":3}    - {"a": 3, "b": 1}\n' +
              '\n' +
              'SELECT \'{"bb":1,"a":2,"ccc":3,"z":4,"aa":5}\'::jsonb;\n' +
              ' {"a": 2, "z": 4, "aa": 5, "bb": 1, "ccc": 3}\n' +
              '\n' +
              'SELECT \'{"B":1,"a":2}\'::jsonb;\n' +
              ' {"B": 1, "a": 2}',
            ) + 'What do the two types actually do, and what exactly is the key order?',
            'Đo trên PostgreSQL 16.14. Cùng những hằng ấy ép kiểu hai cách, kèm một thí nghiệm thứ hai về thứ tự khoá:' + code(
              'SELECT \'{"b":1,"a":2,"a":3}\'::json  AS j,\n' +
              '       \'{"b":1,"a":2,"a":3}\'::jsonb AS jb;\n' +
              '           j            -        jb\n' +
              ' {"b":1,"a":2,"a":3}    - {"a": 3, "b": 1}\n' +
              '\n' +
              'SELECT \'{"bb":1,"a":2,"ccc":3,"z":4,"aa":5}\'::jsonb;\n' +
              ' {"a": 2, "z": 4, "aa": 5, "bb": 1, "ccc": 3}\n' +
              '\n' +
              'SELECT \'{"B":1,"a":2}\'::jsonb;\n' +
              ' {"B": 1, "a": 2}',
            ) + 'Hai kiểu dữ liệu này thật ra làm gì, và thứ tự khoá chính xác là gì?',
          ),
          options: [
            B('<code>json</code> keeps the exact TEXT you gave it — duplicate keys, whitespace and key order and all — and re-parses on every access. <code>jsonb</code> stores a decomposed binary form: whitespace dropped, duplicates resolved last-one-wins, and keys ordered by LENGTH first and only then by byte value, which is why <code>z</code> precedes <code>aa</code> and <code>B</code> precedes <code>a</code>. That normalisation is what makes jsonb fast to query and, crucially, INDEXABLE', '<code>json</code> giữ đúng đoạn VĂN BẢN bạn đưa cho nó — khoá trùng, khoảng trắng, thứ tự khoá, giữ hết — và phân tích lại ở mỗi lần truy cập. <code>jsonb</code> lưu một dạng nhị phân đã phân rã: bỏ khoảng trắng, khoá trùng thì cái sau thắng, và khoá được sắp theo ĐỘ DÀI trước rồi mới theo giá trị byte, và vì thế <code>z</code> đứng trước <code>aa</code> còn <code>B</code> đứng trước <code>a</code>. Chính việc chuẩn hoá đó làm jsonb truy vấn nhanh và, quan trọng nhất, LẬP CHỈ MỤC ĐƯỢC'),
            B('<code>jsonb</code> silently dropped data by discarding <code>"a":2</code>, so <code>json</code> is the safe default and <code>jsonb</code> should only be used for read-only columns; the reordering in the second and third outputs is the same loss happening to key order', '<code>jsonb</code> đã âm thầm làm mất dữ liệu khi vứt <code>"a":2</code>, nên <code>json</code> mới là mặc định an toàn và <code>jsonb</code> chỉ nên dùng cho các cột chỉ đọc; việc đổi thứ tự ở kết quả thứ hai và thứ ba là cũng sự mất mát ấy xảy ra với thứ tự khoá'),
            B('Both store the same normalised binary form and the difference is only in how psql prints them; the key order is plain alphabetical in both, and <code>z</code> came before <code>aa</code> because digits and single letters sort ahead of words, which is also why <code>B</code> appears before <code>a</code> in the third output', 'Cả hai đều lưu cùng một dạng nhị phân đã chuẩn hoá và khác biệt chỉ ở cách psql in ra; thứ tự khoá là bảng chữ cái thuần tuý ở cả hai, và <code>z</code> đứng trước <code>aa</code> vì chữ số và chữ cái đơn được sắp trước các từ, và cũng vì thế <code>B</code> xuất hiện trước <code>a</code> ở kết quả thứ ba'),
            B('<code>jsonb</code> reorders keys for display only; on disk it preserves insertion order, which is why <code>-&gt;</code> can return fields in the order they were written and why the second output differs from the third — on disk both documents keep the exact order they were written in, and only the printer rearranges them', '<code>jsonb</code> chỉ sắp lại khoá để hiển thị; trên đĩa nó vẫn giữ thứ tự chèn, và vì thế <code>-&gt;</code> trả về các trường theo đúng thứ tự chúng được ghi, cũng vì thế kết quả thứ hai khác kết quả thứ ba — trên đĩa cả hai tài liệu đều giữ đúng thứ tự chúng được ghi, chỉ có phần in ra là sắp xếp lại'),
          ],
          correct: 0,
          explanation: EX(
            'The output IS the difference. <code>json</code> is a text type with a validity check: it kept both <code>"a"</code> keys, kept your spacing, kept your key order, and will re-parse the whole document every time you reach into it. <code>jsonb</code> parsed it once at write time into a structure, which is why the keys came back reordered, the whitespace normalised and the duplicate resolved. Everything useful follows from that structure: operators like <code>@&gt;</code> can be answered without re-parsing, and a GIN index can be built over the keys and values. The key order deserves the precision, because "sorted" is the usual shorthand and it is not what the measurement shows: jsonb orders by key length first, then by byte value — hence <code>a, z, aa, bb, ccc</code>, and hence uppercase <code>B</code> before lowercase <code>a</code>. Never rely on that order meaning anything; rely only on it being STABLE, which is what makes two equal documents compare and hash identically. Use <code>json</code> only when you must reproduce a document byte for byte — a webhook payload whose signature you may have to re-verify — which is rare. And note duplicate-key resolution is silent, so a document assembled by string concatenation can lose a field with no error at all.',
            'Chính cái output đã là khác biệt. <code>json</code> là một kiểu văn bản có kèm phép kiểm tính hợp lệ: nó giữ cả hai khoá <code>"a"</code>, giữ khoảng trắng của bạn, giữ thứ tự khoá của bạn, và sẽ phân tích lại cả tài liệu mỗi lần bạn thò tay vào. <code>jsonb</code> phân tích nó một lần lúc ghi thành một cấu trúc, và vì thế các khoá quay ra đã đổi thứ tự, khoảng trắng đã chuẩn hoá, khoá trùng đã được xử lý. Mọi thứ hữu ích đều bắt nguồn từ cấu trúc ấy: các toán tử như <code>@&gt;</code> trả lời được mà không cần phân tích lại, và một chỉ mục GIN dựng được trên các khoá và giá trị. Thứ tự khoá đáng được nói cho chính xác, vì "được sắp" là cách nói tắt quen thuộc mà lại không đúng với phép đo: jsonb sắp theo ĐỘ DÀI khoá trước, rồi mới theo giá trị byte — nên mới ra <code>a, z, aa, bb, ccc</code>, và nên chữ hoa <code>B</code> mới đứng trước chữ thường <code>a</code>. Đừng bao giờ dựa vào việc thứ tự ấy mang ý nghĩa gì; chỉ dựa vào việc nó ỔN ĐỊNH, và đó là thứ làm cho hai tài liệu bằng nhau thì so sánh và băm ra giống hệt nhau. Chỉ dùng <code>json</code> khi bạn buộc phải tái tạo tài liệu chính xác từng byte — một payload webhook mà bạn có thể phải xác minh lại chữ ký — và chuyện đó hiếm. Và để ý việc xử lý khoá trùng diễn ra trong im lặng, nên một tài liệu ghép bằng nối chuỗi có thể mất một trường mà không báo lỗi nào cả.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14, on a <code>product</code> row holding <code>{"brand":"Acme"}</code>:' + code(
              "SELECT props ->  'brand'  AS arrow,      --  \"Acme\"\n" +
              "       props ->> 'brand'  AS darrow;     --  Acme\n" +
              '\n' +
              "SELECT name FROM product WHERE props -> 'brand' = 'Acme';\n" +
              'ERROR:  invalid input syntax for type json\n' +
              'DETAIL:  Token "Acme" is invalid.\n' +
              '\n' +
              "SELECT ('{\"price\":null}'::jsonb ->  'price')::text,   --  null   (a JSON null)\n" +
              "       ('{\"price\":null}'::jsonb ->> 'price'),         --  (NULL) (an SQL NULL)\n" +
              "       ('{\"price\":null}'::jsonb ->> 'zzz');           --  (NULL) (an SQL NULL)",
            ) + 'What is going on, and what does the last line warn you about?',
            'Đo trên PostgreSQL 16.14, trên một dòng <code>product</code> chứa <code>{"brand":"Acme"}</code>:' + code(
              "SELECT props ->  'brand'  AS arrow,      --  \"Acme\"\n" +
              "       props ->> 'brand'  AS darrow;     --  Acme\n" +
              '\n' +
              "SELECT name FROM product WHERE props -> 'brand' = 'Acme';\n" +
              'ERROR:  invalid input syntax for type json\n' +
              'DETAIL:  Token "Acme" is invalid.\n' +
              '\n' +
              "SELECT ('{\"price\":null}'::jsonb ->  'price')::text,   --  null   (một null của JSON)\n" +
              "       ('{\"price\":null}'::jsonb ->> 'price'),         --  (NULL) (một NULL của SQL)\n" +
              "       ('{\"price\":null}'::jsonb ->> 'zzz');           --  (NULL) (một NULL của SQL)",
            ) + 'Chuyện gì đang xảy ra, và dòng cuối cảnh báo bạn điều gì?',
          ),
          options: [
            B('<code>-&gt;</code> only works on arrays and returns NULL for an object key; the error came from PostgreSQL trying to index an object by position. Use <code>-&gt;&gt;</code> for objects and <code>-&gt;</code> for array elements; the last line is then the same rule again, since <code>zzz</code> is not a valid array subscript', '<code>-&gt;</code> chỉ chạy với mảng và trả NULL cho một khoá của đối tượng; lỗi đến từ việc PostgreSQL cố lấy phần tử của một đối tượng theo vị trí. Hãy dùng <code>-&gt;&gt;</code> cho đối tượng và <code>-&gt;</code> cho phần tử mảng; dòng cuối cũng vẫn luật ấy, vì <code>zzz</code> không phải một chỉ số mảng hợp lệ'),
            B('The comparison silently returns no rows because a jsonb value can never equal a text literal; PostgreSQL raised here only because the row happened to be missing, and on a populated table the same query is simply always false, so the last line is just showing you the two ordinary ways a jsonb lookup ends up empty', 'Phép so sánh âm thầm trả về không dòng nào vì một giá trị jsonb không bao giờ bằng một hằng văn bản được; PostgreSQL báo lỗi ở đây chỉ vì tình cờ thiếu dòng, còn trên một bảng có dữ liệu thì đúng truy vấn ấy chỉ đơn giản là luôn sai, nên dòng cuối chỉ đang cho bạn thấy hai cách thông thường mà một lượt tra jsonb kết thúc rỗng'),
            B('<code>-&gt;</code> returns JSONB — the JSON string <code>"Acme"</code>, quotes included — so comparing it to <code>\'Acme\'</code> makes PostgreSQL cast that literal to jsonb, and a bare word is not valid JSON, hence the error. Write <code>props -&gt;&gt; \'brand\' = \'Acme\'</code>. And the last line is the quiet trap: a MISSING key and a key whose value is JSON <code>null</code> both come back as SQL NULL through <code>-&gt;&gt;</code>, so a typo in a key name is indistinguishable from an absent value', '<code>-&gt;</code> trả về JSONB — chuỗi JSON <code>"Acme"</code>, kèm cả dấu nháy — nên đem nó so với <code>\'Acme\'</code> làm PostgreSQL ép hằng ấy sang jsonb, mà một từ trần thì không phải JSON hợp lệ, nên mới có lỗi. Hãy viết <code>props -&gt;&gt; \'brand\' = \'Acme\'</code>. Còn dòng cuối là cái bẫy lặng lẽ: một khoá KHÔNG TỒN TẠI và một khoá có giá trị là <code>null</code> của JSON đều quay ra thành NULL của SQL qua <code>-&gt;&gt;</code>, nên gõ sai tên khoá không phân biệt được với một giá trị vắng mặt'),
            B('<code>props</code> must be cast to <code>json</code> before <code>-&gt;</code> is available; <code>jsonb</code> only supports the path form <code>#&gt;&gt;</code>, and the last line shows the path form returning NULL correctly in both cases, which is the reason to prefer <code>#&gt;&gt;</code> for anything deeper than one level', '<code>props</code> phải được ép sang <code>json</code> thì <code>-&gt;</code> mới dùng được; <code>jsonb</code> chỉ hỗ trợ dạng đường dẫn <code>#&gt;&gt;</code>, và dòng cuối cho thấy dạng đường dẫn trả về NULL đúng ở cả hai trường hợp, và đó là lý do nên chuộng <code>#&gt;&gt;</code> cho mọi thứ sâu hơn một tầng'),
          ],
          correct: 2,
          explanation: EX(
            'One character, two types. <code>-&gt;</code> stays inside JSON and hands you a jsonb value, so a string comes back with its quotes; <code>-&gt;&gt;</code> extracts to <code>text</code> and hands you the bare characters. Comparing the first form against a text literal forces PostgreSQL to read that literal as JSON, and <code>Acme</code> as a bare word is not valid JSON — note that the course text describes this as the comparison "failing", while the machine is louder than that and raises. Either fix is fine: <code>props -&gt;&gt; \'brand\' = \'Acme\'</code>, or <code>props -&gt; \'brand\' = \'"Acme"\'::jsonb</code>. The last line is the quieter problem and the reason to distrust JSON columns for anything you filter on: <code>-&gt;&gt;</code> collapses two very different situations into one SQL NULL — the key is absent, or the key is present with a JSON <code>null</code> value. So <code>props-&gt;&gt;\'prise\'</code> (a typo) and <code>props-&gt;&gt;\'Price\'</code> (wrong case) produce empty results rather than complaints, and a report quietly under-counts for six months. When you need to tell the cases apart, ask with the existence operator (<code>jsonb_exists(props, \'price\')</code>, which is TRUE even when the value is JSON null) or with <code>jsonb_typeof</code>. And remember everything out of <code>-&gt;&gt;</code> is text, including numbers — cast before comparing: <code>(props-&gt;&gt;\'price\')::numeric &lt; 500</code>.',
            'Một ký tự, hai kiểu dữ liệu. <code>-&gt;</code> ở lại bên trong JSON và đưa cho bạn một giá trị jsonb, nên một chuỗi quay ra kèm nguyên dấu nháy; còn <code>-&gt;&gt;</code> rút ra thành <code>text</code> và đưa bạn các ký tự trần. So dạng thứ nhất với một hằng văn bản buộc PostgreSQL đọc cái hằng ấy như JSON, mà <code>Acme</code> trần thì không phải JSON hợp lệ — để ý giáo trình mô tả chuyện này là phép so sánh "hỏng", còn máy thì ồn ào hơn thế và ném lỗi hẳn. Sửa cách nào cũng được: <code>props -&gt;&gt; \'brand\' = \'Acme\'</code>, hoặc <code>props -&gt; \'brand\' = \'"Acme"\'::jsonb</code>. Dòng cuối mới là vấn đề lặng lẽ hơn, và là lý do đừng tin cột JSON cho những thứ bạn hay lọc: <code>-&gt;&gt;</code> gộp hai tình huống rất khác nhau vào chung một NULL của SQL — khoá không có, hoặc khoá có mà giá trị là <code>null</code> của JSON. Nên <code>props-&gt;&gt;\'prise\'</code> (gõ nhầm) và <code>props-&gt;&gt;\'Price\'</code> (sai hoa thường) cho ra kết quả rỗng chứ không phải một lời phàn nàn, và một báo cáo đếm thiếu suốt sáu tháng. Khi cần phân biệt hai ca đó, hãy hỏi bằng toán tử tồn tại (<code>jsonb_exists(props, \'price\')</code>, vốn TRUE cả khi giá trị là null của JSON) hoặc bằng <code>jsonb_typeof</code>. Và nhớ mọi thứ đi ra từ <code>-&gt;&gt;</code> đều là text, kể cả số — hãy ép kiểu trước khi so: <code>(props-&gt;&gt;\'price\')::numeric &lt; 500</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. Eight containment tests:' + code(
              'SELECT \'{"a":1,"b":2}\'::jsonb  @> \'{"a":1}\'            AS a,   -- t\n' +
              '       \'{"a":1}\'::jsonb        @> \'{"a":1,"b":2}\'      AS b,   -- f\n' +
              '       \'{"tags":["x","y"]}\'::jsonb @> \'{"tags":["x"]}\' AS c,   -- t\n' +
              '       \'["x","y"]\'::jsonb      @> \'"x"\'                AS d,   -- t\n' +
              '       \'["x","y"]\'::jsonb      @> \'["y","x"]\'          AS e,   -- t\n' +
              '       \'{"a":1}\'::jsonb        @> \'{}\'                 AS f,   -- t\n' +
              '       \'{"a":1}\'::jsonb        @> \'{"a":"1"}\'          AS g,   -- f\n' +
              '       \'["x"]\'::jsonb          @> \'[["x"]]\'            AS h;   -- f',
            ) + 'Which statement describes the rule <code>@&gt;</code> follows?',
            'Đo trên PostgreSQL 16.14. Tám phép kiểm chứa:' + code(
              'SELECT \'{"a":1,"b":2}\'::jsonb  @> \'{"a":1}\'            AS a,   -- t\n' +
              '       \'{"a":1}\'::jsonb        @> \'{"a":1,"b":2}\'      AS b,   -- f\n' +
              '       \'{"tags":["x","y"]}\'::jsonb @> \'{"tags":["x"]}\' AS c,   -- t\n' +
              '       \'["x","y"]\'::jsonb      @> \'"x"\'                AS d,   -- t\n' +
              '       \'["x","y"]\'::jsonb      @> \'["y","x"]\'          AS e,   -- t\n' +
              '       \'{"a":1}\'::jsonb        @> \'{}\'                 AS f,   -- t\n' +
              '       \'{"a":1}\'::jsonb        @> \'{"a":"1"}\'          AS g,   -- f\n' +
              '       \'["x"]\'::jsonb          @> \'[["x"]]\'            AS h;   -- f',
            ) + 'Phát biểu nào mô tả đúng luật mà <code>@&gt;</code> tuân theo?',
          ),
          options: [
            B('It tests equality after normalisation, which is why <code>b</code> is false — the right side has an extra key so the two documents differ — and why <code>e</code> is true, since jsonb sorts array elements as well as object keys', 'Nó kiểm tính bằng nhau sau khi chuẩn hoá, và vì thế <code>b</code> sai — vế phải có thêm một khoá nên hai tài liệu khác nhau — cũng vì thế <code>e</code> đúng, vì jsonb sắp cả phần tử mảng chứ không riêng khoá của đối tượng'),
            B('It asks "does the LEFT document contain everything the RIGHT one specifies?" — keys you did not mention are ignored, the test recurses into nested objects and arrays, array element ORDER does not matter, a bare scalar counts as contained in an array, the empty object is contained in everything, and the comparison is TYPE-STRICT so the number 1 does not contain the string "1"', 'Nó hỏi "tài liệu bên TRÁI có chứa mọi thứ mà bên PHẢI nêu ra không?" — những khoá bạn không nhắc tới bị phớt lờ, phép kiểm đi đệ quy vào đối tượng và mảng lồng nhau, THỨ TỰ phần tử mảng không quan trọng, một giá trị vô hướng trần được tính là được chứa trong một mảng, đối tượng rỗng thì nằm trong mọi thứ, và phép so sánh CHẶT VỀ KIỂU nên số 1 không chứa chuỗi "1"'),
            B('It compares only the top-level keys, so <code>c</code> is true because both sides have a <code>tags</code> key regardless of what the arrays hold, and <code>h</code> is false because <code>[["x"]]</code> has no keys at all', 'Nó chỉ so các khoá ở tầng ngoài cùng, nên <code>c</code> đúng vì cả hai vế đều có khoá <code>tags</code> bất kể mảng bên trong chứa gì, và <code>h</code> sai vì <code>[["x"]]</code> hoàn toàn không có khoá nào'),
            B('It is a string-prefix test on the normalised text of the two documents, which explains <code>f</code> (every document starts with the empty object) and <code>g</code> (the quotes make the prefixes differ)', 'Nó là một phép kiểm tiền tố chuỗi trên văn bản đã chuẩn hoá của hai tài liệu, và điều đó giải thích <code>f</code> (mọi tài liệu đều bắt đầu bằng đối tượng rỗng) lẫn <code>g</code> (dấu nháy làm hai tiền tố khác nhau)'),
          ],
          correct: 1,
          explanation: EX(
            'Containment is a subset test, and reading it as "does the left one contain the right one" gets every case above right. <code>a</code> is true because the extra <code>"b"</code> on the left is irrelevant — you only stated <code>"a":1</code>. <code>b</code> is false because the left document does not have <code>"b"</code>, so it cannot contain a specification demanding it. <code>c</code> recurses into the array: <code>{"tags":["x"]}</code> asks for a <code>tags</code> array containing <code>"x"</code>, and one that also holds <code>"y"</code> qualifies. <code>d</code> is the documented special case: a top-level array contains a bare scalar. <code>e</code> shows array order is not part of the test, and <code>f</code> that the empty object demands nothing. The two false results are the ones worth internalising: <code>g</code> is false because containment compares JSON TYPES as well as values, so a number written as a string is a different thing — the commonest source of "my filter matches nothing" after data arrives from a form; and <code>h</code> is false because nesting is NOT flattened, a one-element array is not contained in an array of arrays. This operator is the workhorse of JSONB querying precisely because it is the one a GIN index can answer — measured on 200,000 rows, <code>props @&gt; \'{"hiem":1}\'</code> gave a <code>Bitmap Index Scan</code> with a <code>Recheck Cond</code>. The recheck is always there, because GIN records which rows contain each key/value but not enough to prove containment on its own.',
            'Phép chứa là một phép kiểm tập con, và đọc nó thành "bên trái có chứa bên phải không" là ra đúng mọi trường hợp ở trên. <code>a</code> đúng vì khoá <code>"b"</code> thừa ở bên trái không liên quan — bạn chỉ nêu <code>"a":1</code>. <code>b</code> sai vì tài liệu bên trái không có <code>"b"</code>, nên nó không thể chứa một đặc tả đòi hỏi khoá đó. <code>c</code> đi đệ quy vào mảng: <code>{"tags":["x"]}</code> đòi một mảng <code>tags</code> có chứa <code>"x"</code>, và một mảng có thêm cả <code>"y"</code> vẫn thoả. <code>d</code> là ca đặc biệt có ghi trong tài liệu: một mảng ở tầng ngoài cùng chứa được một giá trị vô hướng trần. <code>e</code> cho thấy thứ tự phần tử mảng không thuộc phép kiểm, còn <code>f</code> cho thấy đối tượng rỗng chẳng đòi hỏi gì. Hai kết quả sai mới là thứ đáng khắc vào đầu: <code>g</code> sai vì phép chứa so cả KIỂU JSON chứ không riêng giá trị, nên một con số viết dưới dạng chuỗi là một thứ khác — nguồn phổ biến nhất của chuyện "bộ lọc của tôi chẳng khớp gì" sau khi dữ liệu đi vào từ một biểu mẫu; và <code>h</code> sai vì việc lồng nhau KHÔNG bị làm phẳng, một mảng một phần tử không nằm trong một mảng của các mảng. Toán tử này là con ngựa thồ của việc truy vấn JSONB đúng vì nó là cái mà chỉ mục GIN trả lời được — đo trên 200.000 dòng, <code>props @&gt; \'{"hiem":1}\'</code> cho ra <code>Bitmap Index Scan</code> kèm một dòng <code>Recheck Cond</code>. Dòng recheck luôn có mặt, vì GIN ghi lại dòng nào chứa từng cặp khoá/giá trị chứ không đủ để tự nó chứng minh phép chứa.',
          ),
        }),

        mcq({
          prompt: B(
            'This works perfectly in psql and returns nothing (or a driver error) from the Node.js application. Measured on PostgreSQL 16.14, the same test in psql answers <code>t</code> for an object key, <code>t</code> for an array element, and <code>t</code> even when the key\'s value is JSON <code>null</code>:' + code(
              "SELECT name FROM product WHERE props ? 'specs';",
            ) + 'Why does it misbehave only through the application, and what is the robust form?',
            'Câu này chạy hoàn hảo trong psql và trả về rỗng (hoặc một lỗi driver) khi gọi từ ứng dụng Node.js. Đo trên PostgreSQL 16.14, cũng phép kiểm ấy trong psql trả <code>t</code> cho một khoá của đối tượng, <code>t</code> cho một phần tử mảng, và <code>t</code> cả khi giá trị của khoá là <code>null</code> của JSON:' + code(
              "SELECT name FROM product WHERE props ? 'specs';",
            ) + 'Vì sao nó chỉ giở chứng khi đi qua ứng dụng, và dạng viết chắc chắn là gì?',
          ),
          options: [
            B('The existence operator requires a GIN index to be present; psql creates one implicitly for interactive queries while the application connection does not', 'Toán tử tồn tại đòi phải có sẵn một chỉ mục GIN; psql tự tạo ngầm một cái cho các truy vấn tương tác còn kết nối của ứng dụng thì không'),
            B('<code>?</code> is the bind-parameter placeholder in most client libraries, so the driver rewrites or mangles it before PostgreSQL ever sees it. Use the function form <code>jsonb_exists(props, \'specs\')</code> — it contains no special character at all — or the driver\'s own escape', '<code>?</code> là ký tự giữ chỗ cho tham số trong phần lớn thư viện client, nên driver viết lại hoặc làm hỏng nó trước khi PostgreSQL kịp nhìn thấy. Hãy dùng dạng hàm <code>jsonb_exists(props, \'specs\')</code> — nó không chứa ký tự đặc biệt nào cả — hoặc ký tự thoát riêng của driver'),
            B('<code>?</code> tests for a JSON <code>null</code> value rather than key existence, and the application data stores missing keys as explicit nulls while the psql test data omits them', '<code>?</code> kiểm giá trị JSON <code>null</code> chứ không phải sự tồn tại của khoá, và dữ liệu của ứng dụng lưu khoá thiếu thành null tường minh còn dữ liệu thử trong psql thì bỏ hẳn khoá đi'),
            B('The application connects through a pooler in transaction mode, and operators that are not in the default search_path are unavailable on a pooled connection', 'Ứng dụng nối qua một pooler ở chế độ transaction, và các toán tử không nằm trong search_path mặc định thì không dùng được trên một kết nối đã gộp'),
          ],
          correct: 1,
          explanation: EX(
            'This is a client-library problem wearing a database costume, and it is worth knowing because the symptom points nowhere useful: the query is correct SQL, it works when you paste it into psql, and it misbehaves only through the application. Many drivers treat <code>?</code> as their placeholder character and substitute it before sending, so PostgreSQL receives something that is no longer your query. The robust fix is the function form — <code>jsonb_exists(props, \'specs\')</code>, and its siblings <code>jsonb_exists_any</code> and <code>jsonb_exists_all</code> for <code>?|</code> and <code>?&amp;</code> — because it contains no special character. While you are here, note precisely what the operator means, all three measured: on an OBJECT it tests key existence; on an ARRAY it tests whether a string element is present; and it is TRUE for a key whose value is JSON <code>null</code>, which is exactly the case <code>-&gt;&gt;</code> cannot distinguish from a missing key. It does NOT look inside nested structures: <code>\'{"tags":["x"]}\'::jsonb ? \'x\'</code> measured <code>f</code>, because <code>x</code> is not a top-level key. The related index note matters too: the existence operators are supported by the DEFAULT GIN opclass but not by <code>jsonb_path_ops</code>.',
            'Đây là một vấn đề của thư viện client khoác áo cơ sở dữ liệu, và đáng biết vì triệu chứng của nó chỉ vào chỗ vô ích: truy vấn là SQL đúng, dán vào psql thì chạy, và chỉ giở chứng khi đi qua ứng dụng. Nhiều driver coi <code>?</code> là ký tự giữ chỗ của chúng và thay thế nó trước khi gửi đi, nên PostgreSQL nhận về một thứ không còn là truy vấn của bạn nữa. Cách sửa chắc chắn là dạng hàm — <code>jsonb_exists(props, \'specs\')</code>, cùng các anh em <code>jsonb_exists_any</code> và <code>jsonb_exists_all</code> cho <code>?|</code> và <code>?&amp;</code> — vì nó không chứa ký tự đặc biệt nào. Nhân tiện, hãy nhớ chính xác toán tử ấy nghĩa là gì, cả ba đều đo được: trên một ĐỐI TƯỢNG nó kiểm sự tồn tại của khoá; trên một MẢNG nó kiểm xem có phần tử chuỗi đó không; và nó TRUE với một khoá có giá trị là <code>null</code> của JSON — đúng cái ca mà <code>-&gt;&gt;</code> không phân biệt nổi với khoá không tồn tại. Nó KHÔNG nhìn vào các cấu trúc lồng bên trong: <code>\'{"tags":["x"]}\'::jsonb ? \'x\'</code> đo ra <code>f</code>, vì <code>x</code> không phải một khoá ở tầng ngoài cùng. Ghi chú liên quan về chỉ mục cũng quan trọng: các toán tử tồn tại được lớp toán tử GIN MẶC ĐỊNH hỗ trợ nhưng không được <code>jsonb_path_ops</code> hỗ trợ.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on a 200,000-row table with both GIN flavours over the same <code>props</code> column, statistics fresh. A rare key <code>hiem</code> is present on 10 rows:' + code(
              ' indexrelname  - size\n' +
              ' ev_gin        - 3048 kB      -- USING GIN (props)\n' +
              ' ev_gin_path   - 2408 kB      -- USING GIN (props jsonb_path_ops)\n' +
              '\n' +
              '-- both indexes present:\n' +
              "--   props ? 'hiem'               →  Bitmap Index Scan on ev_gin\n" +
              '\n' +
              '-- after DROP INDEX ev_gin, only jsonb_path_ops left:\n' +
              "--   props @> '{\"hiem\":1}'        →  Bitmap Index Scan on ev_gin_path\n" +
              "--   props ? 'hiem'               →  Seq Scan on ev\n" +
              '\n' +
              "-- with either index present:\n" +
              "--   (props->>'price')::numeric < 500   →  Parallel Seq Scan on ev",
            ) + 'What is the trade-off between the two opclasses?',
            'Đo trên PostgreSQL 16.14 trên bảng 200.000 dòng với cả hai biến thể GIN trên cùng cột <code>props</code>, thống kê đã mới. Một khoá hiếm <code>hiem</code> có mặt ở 10 dòng:' + code(
              ' indexrelname  - size\n' +
              ' ev_gin        - 3048 kB      -- USING GIN (props)\n' +
              ' ev_gin_path   - 2408 kB      -- USING GIN (props jsonb_path_ops)\n' +
              '\n' +
              '-- khi có cả hai chỉ mục:\n' +
              "--   props ? 'hiem'               →  Bitmap Index Scan on ev_gin\n" +
              '\n' +
              '-- sau DROP INDEX ev_gin, chỉ còn jsonb_path_ops:\n' +
              "--   props @> '{\"hiem\":1}'        →  Bitmap Index Scan on ev_gin_path\n" +
              "--   props ? 'hiem'               →  Seq Scan on ev\n" +
              '\n' +
              "-- với chỉ mục nào cũng vậy:\n" +
              "--   (props->>'price')::numeric < 500   →  Parallel Seq Scan on ev",
            ) + 'Đánh đổi giữa hai lớp toán tử này là gì?',
          ),
          options: [
            B('<code>jsonb_path_ops</code> is smaller because it drops values and indexes only keys, so it answers key-existence questions and cannot answer containment — which is why dropping the default index left the existence query with an index it could not use', '<code>jsonb_path_ops</code> nhỏ hơn vì nó bỏ giá trị đi và chỉ lập chỉ mục các khoá, nên nó trả lời được câu hỏi khoá-có-tồn-tại-không và không trả lời được phép chứa — và vì thế xoá chỉ mục mặc định đi là truy vấn tồn tại còn lại một chỉ mục nó không dùng nổi'),
            B('They index the same things; <code>jsonb_path_ops</code> is simply better compressed, so it is strictly superior and the default exists only for backward compatibility; the Seq Scan after the DROP was simply the planner needing a fresh <code>ANALYZE</code>', 'Chúng lập chỉ mục cùng những thứ như nhau; <code>jsonb_path_ops</code> chỉ là nén tốt hơn, nên nó vượt trội tuyệt đối và lớp mặc định tồn tại chỉ vì tương thích ngược; lần Seq Scan sau khi DROP chỉ là do bộ lập kế hoạch cần một lần <code>ANALYZE</code> mới'),
            B('The default opclass covers range predicates on extracted values such as <code>(props-&gt;&gt;\'price\')::numeric &lt; 500</code>, while <code>jsonb_path_ops</code> does not — that is the only functional difference between them, and the existence operators work equally well with either one', 'Lớp mặc định bao được các vị từ khoảng trên giá trị đã rút ra như <code>(props-&gt;&gt;\'price\')::numeric &lt; 500</code>, còn <code>jsonb_path_ops</code> thì không — đó là khác biệt chức năng duy nhất giữa hai lớp, còn các toán tử tồn tại thì chạy tốt như nhau với cả hai'),
            B('<code>jsonb_path_ops</code> indexes hashed PATHS rather than every key and every value separately: smaller and typically faster for <code>@&gt;</code>, but it supports ONLY containment — the existence operators <code>?</code>, <code>?|</code>, <code>?&amp;</code> cannot use it, which is why dropping the default index sent that query straight to a Seq Scan. And the last line shows what NEITHER opclass helps with: an expression over an extracted value', '<code>jsonb_path_ops</code> lập chỉ mục các ĐƯỜNG DẪN đã băm thay vì từng khoá và từng giá trị riêng lẻ: nhỏ hơn và thường nhanh hơn cho <code>@&gt;</code>, nhưng nó CHỈ hỗ trợ phép chứa — các toán tử tồn tại <code>?</code>, <code>?|</code>, <code>?&amp;</code> không dùng được nó, và vì thế xoá chỉ mục mặc định đi là truy vấn ấy rơi thẳng về Seq Scan. Còn dòng cuối cho thấy thứ mà KHÔNG lớp nào giúp được: một biểu thức trên giá trị đã rút ra'),
          ],
          correct: 3,
          explanation: EX(
            'The default opclass makes an index entry for every key and every value separately, which is what lets it answer "does this document have a key named X" as well as containment. <code>jsonb_path_ops</code> hashes the whole path-plus-value into one entry, so there is nothing in the index that represents a key on its own — smaller (measured 2408 kB against 3048 kB here, though the ratio is data-dependent and not worth memorising), fewer entries to merge for a containment query, and structurally unable to serve <code>?</code>. The experiment is the proof: with both indexes present the existence query chose the default one, and the moment that index was dropped the very same query fell back to a sequential scan even though <code>jsonb_path_ops</code> was still sitting right there. Choose the default if you need existence checks; choose <code>jsonb_path_ops</code> if containment is all you do. The last measured line is worth refuting explicitly because it is the most common wrong expectation: NEITHER opclass helps <code>(props-&gt;&gt;\'price\')::numeric &lt; 500</code>. That is an expression over an extracted value, not a containment or existence test, so PostgreSQL scans and the GIN index costs write time for nothing. Range queries on a JSON field need an expression index on exactly that expression, or better, the field promoted to a real column with a real type.',
            'Lớp toán tử mặc định tạo một mục chỉ mục cho từng khoá và từng giá trị riêng biệt, và đó là thứ cho phép nó trả lời câu hỏi "tài liệu này có khoá tên X không" bên cạnh phép chứa. <code>jsonb_path_ops</code> băm cả đường-dẫn-kèm-giá-trị thành một mục duy nhất, nên trong chỉ mục không có gì đại diện cho riêng một cái khoá — nhỏ hơn (đo ở đây là 2408 kB so với 3048 kB, dù tỉ lệ phụ thuộc dữ liệu nên không đáng học thuộc), ít mục phải trộn hơn cho một truy vấn chứa, và về mặt cấu trúc là không phục vụ nổi <code>?</code>. Thí nghiệm chính là bằng chứng: khi có cả hai chỉ mục thì truy vấn tồn tại chọn cái mặc định, và ngay lúc chỉ mục đó bị xoá thì đúng truy vấn ấy rơi về quét tuần tự dù <code>jsonb_path_ops</code> vẫn nằm sờ sờ ở đó. Hãy chọn lớp mặc định nếu bạn cần kiểm tồn tại; chọn <code>jsonb_path_ops</code> nếu bạn chỉ dùng phép chứa. Dòng đo cuối cùng đáng bác bỏ hẳn ra vì nó là kỳ vọng sai phổ biến nhất: KHÔNG lớp nào giúp được <code>(props-&gt;&gt;\'price\')::numeric &lt; 500</code>. Đó là một biểu thức trên giá trị đã rút ra, không phải phép chứa cũng không phải phép kiểm tồn tại, nên PostgreSQL quét bảng và chỉ mục GIN ngốn thời gian ghi mà chẳng đổi lại gì. Truy vấn khoảng trên một trường JSON cần một chỉ mục biểu thức trên đúng biểu thức ấy, hoặc tốt hơn, nâng cái trường đó lên thành một cột thật có kiểu thật.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. The first <code>CREATE TABLE</code> was rejected; the second was accepted:' + code(
              'CREATE TABLE art_bad (\n' +
              '  id int, body text,\n' +
              '  tsv tsvector GENERATED ALWAYS AS (to_tsvector(body)) STORED\n' +
              ');\n' +
              'ERROR:  generation expression is not immutable\n' +
              '\n' +
              "  tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', body)) STORED   -- accepted\n" +
              '\n' +
              'SHOW default_text_search_config;   -- pg_catalog.english',
            ) + 'Why does naming the configuration change everything?',
            'Đo trên PostgreSQL 16.14. Lệnh <code>CREATE TABLE</code> đầu bị từ chối; lệnh thứ hai được chấp nhận:' + code(
              'CREATE TABLE art_bad (\n' +
              '  id int, body text,\n' +
              '  tsv tsvector GENERATED ALWAYS AS (to_tsvector(body)) STORED\n' +
              ');\n' +
              'ERROR:  generation expression is not immutable\n' +
              '\n' +
              "  tsv tsvector GENERATED ALWAYS AS (to_tsvector('english', body)) STORED   -- được chấp nhận\n" +
              '\n' +
              'SHOW default_text_search_config;   -- pg_catalog.english',
            ) + 'Vì sao nêu tên cấu hình lại thay đổi mọi thứ?',
          ),
          options: [
            B('Because <code>STORED</code> generated columns cannot hold <code>tsvector</code> at all; the second form was accepted only because naming a configuration switches the column to the VIRTUAL kind', 'Vì cột sinh <code>STORED</code> hoàn toàn không chứa được <code>tsvector</code>; dạng thứ hai được chấp nhận chỉ vì việc nêu tên cấu hình đã chuyển cột đó sang loại ẢO'),
            B('Because <code>to_tsvector</code> with one argument returns <code>text</code> rather than <code>tsvector</code>, and the message about immutability is a misleading wording for a type mismatch', 'Vì <code>to_tsvector</code> với một tham số trả về <code>text</code> chứ không phải <code>tsvector</code>, và thông báo về tính bất biến chỉ là cách diễn đạt gây hiểu nhầm cho một ca lệch kiểu'),
            B('Because a generated column may only reference a single column, and the one-argument form implicitly references the session locale as a second input', 'Vì một cột sinh chỉ được tham chiếu đúng một cột, và dạng một tham số ngầm tham chiếu thêm locale của phiên như một đầu vào thứ hai'),
            B('Because the one-argument form reads <code>default_text_search_config</code>, a SERVER SETTING that can differ between machines and can be changed at any time — so it is only STABLE, not IMMUTABLE, and a stored generated column may not depend on it', 'Vì dạng một tham số đọc <code>default_text_search_config</code>, một THIẾT LẬP MÁY CHỦ vốn có thể khác nhau giữa các máy và đổi được bất cứ lúc nào — nên nó chỉ là STABLE chứ không phải IMMUTABLE, và một cột sinh có lưu trữ không được phép phụ thuộc vào nó'),
          ],
          correct: 3,
          explanation: EX(
            'A stored generated column is written to disk once and never recomputed unless an input changes, so its expression has to give the same answer forever — that is what IMMUTABLE promises. <code>to_tsvector(body)</code> cannot promise it: it silently uses <code>default_text_search_config</code>, so the same row would produce different lexemes on a server configured differently, or after somebody changes the setting, and the stored value would then disagree with the table with no error anywhere. PostgreSQL refuses at definition time, which is the friendly outcome — the alternative would be a search index that quietly stops matching some of its own rows. Note the setting on this container is <code>pg_catalog.english</code>, so the one-argument form would have produced exactly the same lexemes today; the refusal is about the GUARANTEE, not about today\'s result, and that distinction is the whole lesson. The practical rule from 13.3: always pass the configuration explicitly, in the column definition AND in the query, so both sides of <code>@@</code> are processed the same way. And the Vietnamese caveat is worth carrying: there is no built-in configuration that stems Vietnamese, and <code>\'simple\'</code> merely lowercases and splits on whitespace — defensible, because Vietnamese words are already separated and mostly uninflected, but it means no stemming and no stop-word removal.',
            'Một cột sinh có lưu trữ được ghi xuống đĩa một lần và không bao giờ tính lại trừ khi một đầu vào thay đổi, nên biểu thức của nó buộc phải cho ra cùng một câu trả lời mãi mãi — đó chính là thứ IMMUTABLE hứa. <code>to_tsvector(body)</code> không hứa nổi: nó âm thầm dùng <code>default_text_search_config</code>, nên cùng một dòng sẽ cho ra các lexeme khác nhau trên một máy chủ cấu hình khác, hoặc sau khi ai đó đổi thiết lập, và giá trị đã lưu khi ấy sẽ lệch với bảng mà không lỗi ở đâu cả. PostgreSQL từ chối ngay lúc định nghĩa, và đó là kết cục dễ chịu — lựa chọn còn lại sẽ là một chỉ mục tìm kiếm âm thầm thôi khớp với chính một phần dữ liệu của nó. Để ý thiết lập trên container này là <code>pg_catalog.english</code>, nên dạng một tham số hôm nay sẽ cho ra đúng những lexeme y hệt; lời từ chối là chuyện BẢO ĐẢM chứ không phải chuyện kết quả của hôm nay, và chính sự phân biệt đó mới là bài học. Luật thực tế ở bài 13.3: luôn truyền cấu hình một cách tường minh, trong định nghĩa cột LẪN trong truy vấn, để cả hai vế của <code>@@</code> được xử lý như nhau. Và lưu ý về tiếng Việt cũng đáng mang theo: không có cấu hình cài sẵn nào rút gốc từ tiếng Việt, còn <code>\'simple\'</code> thì chỉ hạ chữ thường và cắt theo khoảng trắng — bảo vệ được, vì từ tiếng Việt vốn đã tách rời và phần lớn không biến hình, nhưng nghĩa là không có rút gốc và không loại từ dừng.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on a 200,000-row <code>article</code> table with <code>CREATE INDEX article_title_trgm ON article USING GIN (title gin_trgm_ops)</code>, statistics fresh:' + code(
              "SELECT count(*) FROM article WHERE title ILIKE '%12345%';\n" +
              '  →  Bitmap Index Scan on article_title_trgm\n' +
              '\n' +
              "SELECT count(*) FROM article WHERE title % 'zzqqxx nonsense';\n" +
              '  →  Bitmap Index Scan on article_title_trgm\n' +
              '\n' +
              "SELECT count(*) FROM article WHERE similarity(title, 'postgres indexs') > 0.3;\n" +
              '  →  Parallel Seq Scan on article\n' +
              '\n' +
              'SELECT show_limit();   -- 0.3',
            ) + 'Why does the third query miss the index, given that it asks almost the same thing as the second?',
            'Đo trên PostgreSQL 16.14 trên bảng <code>article</code> 200.000 dòng có <code>CREATE INDEX article_title_trgm ON article USING GIN (title gin_trgm_ops)</code>, thống kê đã mới:' + code(
              "SELECT count(*) FROM article WHERE title ILIKE '%12345%';\n" +
              '  →  Bitmap Index Scan on article_title_trgm\n' +
              '\n' +
              "SELECT count(*) FROM article WHERE title % 'zzqqxx nonsense';\n" +
              '  →  Bitmap Index Scan on article_title_trgm\n' +
              '\n' +
              "SELECT count(*) FROM article WHERE similarity(title, 'postgres indexs') > 0.3;\n" +
              '  →  Parallel Seq Scan on article\n' +
              '\n' +
              'SELECT show_limit();   -- 0.3',
            ) + 'Vì sao truy vấn thứ ba trượt chỉ mục, trong khi nó hỏi gần như đúng cái mà truy vấn thứ hai hỏi?',
          ),
          options: [
            B('Because <code>similarity()</code> is VOLATILE and therefore cannot appear in an indexable predicate; mark it STABLE with <code>ALTER FUNCTION</code> and the third query uses the index too; the operator form escaped the problem only because an operator carries its own volatility declaration', 'Vì <code>similarity()</code> là VOLATILE nên không xuất hiện được trong một vị từ lập chỉ mục được; hãy đánh dấu nó STABLE bằng <code>ALTER FUNCTION</code> thì truy vấn thứ ba cũng dùng được chỉ mục; dạng toán tử thoát được vấn đề chỉ vì một toán tử mang theo khai báo volatility của riêng nó'),
            B('Because the third query has no wildcard, and a trigram index is only consulted for patterns containing <code>%</code> — the second query worked because <code>%</code> appears in it as an operator, and the first worked because its pattern is literally a wildcard search', 'Vì truy vấn thứ ba không có ký tự đại diện nào, và chỉ mục trigram chỉ được tra khi mẫu có chứa <code>%</code> — truy vấn thứ hai chạy được vì <code>%</code> xuất hiện trong đó với vai trò một toán tử, còn truy vấn thứ nhất chạy được vì mẫu của nó đúng nghĩa là một phép tìm có ký tự đại diện'),
            B('Because an index serves OPERATORS, not function calls: the trigram opclass supports <code>ILIKE</code>, <code>LIKE</code>, the similarity operator <code>%</code> and the distance operator <code>&lt;-&gt;</code>, but <code>similarity(a,b) &gt; 0.3</code> is a comparison around a function call and the planner cannot map it onto any of them — even though <code>%</code> means exactly "similarity above <code>pg_trgm.similarity_threshold</code>", measured here as 0.3', 'Vì chỉ mục phục vụ các TOÁN TỬ chứ không phục vụ lời gọi hàm: lớp toán tử trigram hỗ trợ <code>ILIKE</code>, <code>LIKE</code>, toán tử tương đồng <code>%</code> và toán tử khoảng cách <code>&lt;-&gt;</code>, còn <code>similarity(a,b) &gt; 0.3</code> là một phép so sánh bọc quanh một lời gọi hàm và bộ lập kế hoạch không ánh xạ được nó về bất kỳ toán tử nào trong số đó — dù <code>%</code> có nghĩa đúng là "tương đồng trên <code>pg_trgm.similarity_threshold</code>", đo ở đây là 0,3'),
            B('Because <code>0.3</code> is below <code>pg_trgm.similarity_threshold</code>, so the planner proved the predicate matches every row and chose a scan; raise the threshold above 0.3 with <code>set_limit()</code> and the same predicate becomes selective enough for the index to win', 'Vì <code>0,3</code> thấp hơn <code>pg_trgm.similarity_threshold</code>, nên bộ lập kế hoạch chứng minh được vị từ khớp mọi dòng và chọn quét bảng; nâng ngưỡng lên trên 0,3 bằng <code>set_limit()</code> thì đúng vị từ ấy trở nên đủ chọn lọc để chỉ mục thắng'),
          ],
          correct: 2,
          explanation: EX(
            'An index is built for a set of operators — that is literally what an operator class is — and the planner matches your <code>WHERE</code> against those operators. <code>title % \'…\'</code> is the similarity operator and maps directly; <code>similarity(title, \'…\') &gt; 0.3</code> is a function call inside a comparison, and nothing in the opclass corresponds to it, so the plan falls back to a scan. The two forms are semantically the same query at the default threshold, which is exactly why the mistake is easy to make and invisible until you read the plan — the lesson generalises far past trigrams: rewrite predicates into the OPERATOR form the index understands, and confirm with <code>EXPLAIN</code> rather than assuming. As for what trigrams are for: they cut a string into overlapping three-character slices, so comparison degrades gracefully as spelling drifts — measured, <code>similarity(\'PostgreSQL\', \'PostgresSQL\')</code> is 0.769 while <code>similarity(\'PostgreSQL\', \'MySQL\')</code> is 0.133. That makes them right for names, emails, SKUs and autocomplete, and right for the one query shape everyone is told is unindexable, <code>ILIKE \'%…%\'</code>. Keep them off long prose: the index is built from every three-character window, so it grows with the text — measured here on short titles it was 9704 kB, against 13 MB for the tsvector index over the much longer body, and on bodies the trigram index would have been far larger than either.',
            'Một chỉ mục được dựng cho một tập toán tử — lớp toán tử đúng nghĩa đen là như thế — và bộ lập kế hoạch đối chiếu mệnh đề <code>WHERE</code> của bạn với các toán tử ấy. <code>title % \'…\'</code> là toán tử tương đồng và ánh xạ thẳng được; còn <code>similarity(title, \'…\') &gt; 0.3</code> là một lời gọi hàm nằm trong một phép so sánh, mà chẳng có gì trong lớp toán tử tương ứng với nó, nên kế hoạch rơi về quét bảng. Ở ngưỡng mặc định thì hai dạng này là cùng một truy vấn về ngữ nghĩa, và chính vì thế lỗi này rất dễ mắc và vô hình cho tới khi bạn đọc plan — bài học tổng quát hơn hẳn chuyện trigram: hãy viết lại vị từ về đúng dạng TOÁN TỬ mà chỉ mục hiểu, và xác nhận bằng <code>EXPLAIN</code> chứ đừng đoán. Còn về việc trigram dùng để làm gì: nó cắt một chuỗi thành các lát ba ký tự chồng lên nhau, nên phép so sánh suy giảm mượt mà khi chính tả trôi đi — đo thật, <code>similarity(\'PostgreSQL\', \'PostgresSQL\')</code> là 0,769 còn <code>similarity(\'PostgreSQL\', \'MySQL\')</code> là 0,133. Điều đó khiến nó hợp với tên người, email, mã SKU và gợi ý gõ tay, và hợp với đúng cái hình dạng truy vấn mà ai cũng bảo là không lập chỉ mục được, <code>ILIKE \'%…%\'</code>. Đừng dùng nó cho văn bản dài: chỉ mục được dựng từ mọi cửa sổ ba ký tự nên nó lớn theo độ dài văn bản — đo ở đây trên các tiêu đề ngắn là 9704 kB, so với 13 MB của chỉ mục tsvector trên phần thân dài hơn nhiều, và nếu dựng trigram trên phần thân ấy thì nó đã lớn hơn cả hai.',
          ),
        }),

        // ── Chương 14 — Kết nối, pool & vận hành ────────────────────────
        mcq({
          prompt: B(
            'Measured on the practice container:' + code(
              'SHOW max_connections;                  -- 100\n' +
              'SHOW superuser_reserved_connections;   -- 3',
            ) + 'An application role stops being able to connect at 97 while a superuser can still get in. What is the mechanism, and why does PostgreSQL cap connections at all?',
            'Đo trên container thực hành:' + code(
              'SHOW max_connections;                  -- 100\n' +
              'SHOW superuser_reserved_connections;   -- 3',
            ) + 'Vai trò của ứng dụng hết nối được ở con số 97 trong khi superuser vẫn vào được. Cơ chế là gì, và vì sao PostgreSQL lại giới hạn số kết nối?',
          ),
          options: [
            B('Each connection is an OS THREAD inside one server process, and 100 is the thread-pool size; the 3 are worker threads reserved for autovacuum rather than for administrators', 'Mỗi kết nối là một LUỒNG của hệ điều hành bên trong một tiến trình máy chủ duy nhất, và 100 là kích thước của pool luồng; 3 cái kia là các luồng công nhân dành riêng cho autovacuum chứ không phải cho quản trị viên'),
            B('PostgreSQL forks an OS PROCESS per connection — a real process with its own memory, which is why connections are expensive and capped. The last 3 slots are held back so an administrator can still get in when the application has filled the rest, which is exactly when you most need to look', 'PostgreSQL fork một TIẾN TRÌNH của hệ điều hành cho mỗi kết nối — một tiến trình thật với bộ nhớ riêng, và vì thế kết nối vừa đắt vừa bị giới hạn. Ba chỗ cuối được giữ lại để quản trị viên vẫn vào được khi ứng dụng đã lấp hết phần còn lại — đúng lúc bạn cần nhìn vào nhất'),
            B('The cap is a licensing artefact inherited from the original Berkeley code and has no runtime cost; the 3 reserved slots are simply rounding and can be set to 0 with no consequence', 'Giới hạn này là di sản cấp phép từ mã Berkeley nguyên thuỷ và không tốn gì lúc chạy; 3 chỗ dành riêng chỉ là chuyện làm tròn và đặt về 0 cũng chẳng sao'),
            B('Connections are cheap; the cap exists only to bound the size of <code>pg_stat_activity</code>, and the reserved 3 are slots for replication walsenders', 'Kết nối rất rẻ; giới hạn tồn tại chỉ để chặn kích thước của <code>pg_stat_activity</code>, và 3 chỗ dành riêng là các khe cho walsender của nhân bản'),
          ],
          correct: 1,
          explanation: EX(
            'One connection is one operating-system process with its own memory — a deliberate design choice with real benefits (a crashing backend cannot corrupt the others) that makes connections expensive enough to be a first-class production concern. That is why <code>sorry, too many clients already</code> does not degrade gracefully: every new request fails instantly, INCLUDING the psql session you would use to investigate. <code>superuser_reserved_connections</code> is the answer to that, and it explains the two numbers measured above: an ordinary role is refused once <code>max_connections - reserved</code> are in use, while a superuser may take the last three. The arithmetic that actually causes the wall is multiplication, not one greedy client: count every process that connects — web containers, background workers, cron jobs, the migration runner, a metrics exporter, your own psql — and multiply by each one\'s pool size. This site\'s own case is 12 clients × pool 10 = 120 against a limit of 100, which survives only because all 12 are rarely busy at once, which is precisely why the failure arrives during a traffic spike rather than during testing. And note where it bites first: the deploy\'s migration runner connects last, so "deploys started failing to connect" is often the earliest visible symptom of a limit the application itself has not hit yet.',
            'Một kết nối là một tiến trình của hệ điều hành với bộ nhớ riêng — một lựa chọn thiết kế có chủ đích, có lợi ích thật (một backend chết không làm hỏng các backend khác) nhưng khiến kết nối đắt tới mức trở thành mối bận tâm hạng nhất khi vận hành. Vì thế <code>sorry, too many clients already</code> không suy giảm dần dần: mọi yêu cầu mới hỏng ngay lập tức, KỂ CẢ phiên psql mà bạn định dùng để điều tra. <code>superuser_reserved_connections</code> chính là câu trả lời cho chuyện đó, và nó giải thích hai con số đo được ở trên: một vai trò thường bị từ chối khi đã có <code>max_connections - reserved</code> kết nối đang dùng, còn superuser thì vẫn lấy được ba chỗ cuối. Phép tính thật sự đẩy bạn tới bức tường là phép nhân chứ không phải một client tham lam: hãy đếm mọi tiến trình có kết nối — container web, worker chạy nền, các job cron, trình chạy migration, một exporter đo lường, và cả phiên psql của chính bạn — rồi nhân với cỡ pool của từng cái. Trường hợp của chính trang này là 12 client × pool 10 = 120 so với giới hạn 100, sống được chỉ vì hiếm khi cả 12 cùng bận, và đó đúng là lý do sự cố tới vào lúc lưu lượng tăng đột biến chứ không phải lúc chạy thử. Và để ý chỗ nó cắn đầu tiên: trình chạy migration của lần deploy kết nối sau cùng, nên "deploy bắt đầu không nối được" thường là triệu chứng sớm nhất nhìn thấy được của một giới hạn mà bản thân ứng dụng còn chưa chạm tới.',
          ),
        }),

        mcq({
          prompt: B(
            'Response times are bad under load. A colleague proposes raising the application pool from 10 to 100 per process "so fewer requests have to wait". What does the course argue, and what is the sizing rule?',
            'Thời gian phản hồi tệ khi tải cao. Một đồng nghiệp đề nghị nâng pool của ứng dụng từ 10 lên 100 cho mỗi tiến trình "để ít yêu cầu phải chờ hơn". Khoá học lập luận thế nào, và quy tắc chọn cỡ là gì?',
          ),
          options: [
            B('Agree: pool size should always exceed peak concurrent requests, because a request waiting for a slot is pure latency while a request running is progress, and the database will schedule the extra work efficiently because that is what a scheduler is for', 'Đồng ý: cỡ pool luôn phải lớn hơn số yêu cầu đồng thời lúc cao điểm, vì một yêu cầu đang chờ khe là độ trễ thuần còn một yêu cầu đang chạy là tiến độ, và cơ sở dữ liệu sẽ xếp lịch phần việc thêm ấy một cách hiệu quả, vì bộ xếp lịch sinh ra để làm việc đó'),
            B('Agree, but only after raising <code>max_connections</code> to match, since the two settings must always be equal for the pool to function correctly — a pool larger than the limit fails at startup, and a pool smaller than it wastes slots that nothing else can use', 'Đồng ý, nhưng chỉ sau khi nâng <code>max_connections</code> lên cho khớp, vì hai thiết lập này luôn phải bằng nhau thì pool mới hoạt động đúng — pool lớn hơn giới hạn thì hỏng ngay lúc khởi động, còn pool nhỏ hơn thì phí những khe mà chẳng ai khác dùng được'),
            B('Disagree: a connection waiting for a CPU or a disk is not doing work, it is adding contention. Start from about <code>(cores × 2) + effective spindles</code> — around 9–10 on a 4-core SSD box — and remember QUEUEING IS A FEATURE: 3 ms waiting then 1 ms running beats 100 requests each taking 200 ms while they fight each other', 'Không đồng ý: một kết nối đang chờ CPU hoặc đĩa thì không làm việc, nó đang tạo thêm tranh chấp. Hãy bắt đầu từ khoảng <code>(số nhân × 2) + số đĩa hiệu dụng</code> — chừng 9–10 trên một máy 4 nhân dùng SSD — và nhớ rằng XẾP HÀNG LÀ MỘT TÍNH NĂNG: chờ 3 ms rồi chạy 1 ms còn hơn 100 yêu cầu cùng khởi động và mỗi cái mất 200 ms vì giành nhau'),
            B('Disagree, because pool size has no effect on throughput at all — it only limits how many connections are open, and the database schedules work identically regardless, so latency under load is decided entirely by the query plans and never by concurrency', 'Không đồng ý, vì cỡ pool hoàn toàn không ảnh hưởng tới thông lượng — nó chỉ giới hạn số kết nối đang mở, còn cơ sở dữ liệu vẫn xếp lịch công việc y như nhau, nên độ trễ khi tải cao hoàn toàn do các kế hoạch truy vấn quyết định chứ không bao giờ do mức đồng thời'),
          ],
          correct: 2,
          explanation: EX(
            'The instinct that a bigger pool serves more users is right up to the point where the server runs out of CPUs and disks, and wrong past it. Beyond that point every extra concurrent connection adds context switching, lock contention and cache pressure without adding capacity, so total throughput falls and latency rises for everyone. The formula is not precise and does not need to be — what matters is the direction it points: a pool of 100 against a 4-core server does not give you 100× the throughput, it gives you 100 processes competing for 4 cores. The pool\'s real job is to protect the database from the application. Then do the multiplication from the previous question: total connections = processes × pool per process, and it must fit under <code>max_connections</code> with headroom for psql, migrations and the reserve. Two honest ways out when it does not fit: shrink the pools until the product fits (12 × 6 = 72 leaves room), or put PgBouncer in front so many client connections share far fewer real ones — and note that adding PgBouncer WITHOUT shrinking the pools just moves the queue into PgBouncer, where the wait shows up as a client timeout and the PostgreSQL log has no error in it at all.',
            'Cái trực giác rằng pool lớn hơn thì phục vụ được nhiều người hơn là đúng cho tới điểm máy chủ hết CPU và hết đĩa, và sai từ điểm đó trở đi. Qua điểm ấy, mỗi kết nối đồng thời thêm vào chỉ cộng thêm chuyển ngữ cảnh, tranh chấp khoá và áp lực cache mà không thêm năng lực, nên tổng thông lượng giảm còn độ trễ thì tăng cho tất cả mọi người. Công thức không chính xác và cũng không cần chính xác — cái quan trọng là hướng nó chỉ: một pool 100 trên một máy chủ 4 nhân không cho bạn thông lượng gấp 100 lần, nó cho bạn 100 tiến trình giành nhau 4 nhân. Việc thật của pool là bảo vệ cơ sở dữ liệu khỏi ứng dụng. Rồi hãy làm phép nhân ở câu trước: tổng kết nối = số tiến trình × pool của mỗi tiến trình, và nó phải lọt dưới <code>max_connections</code> kèm chỗ dư cho psql, cho migration và cho phần dành riêng. Hai lối ra trung thực khi nó không lọt: thu nhỏ các pool cho tới khi tích số vừa (12 × 6 = 72 là còn chỗ), hoặc đặt PgBouncer phía trước để nhiều kết nối client dùng chung ít kết nối thật hơn hẳn — và để ý rằng thêm PgBouncer mà KHÔNG thu nhỏ pool thì chỉ là dời cái hàng đợi vào trong PgBouncer, nơi lần chờ ấy hiện ra thành một cú hết giờ ở client còn trong log của PostgreSQL thì không có lỗi nào cả.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14: <code>autovacuum_freeze_max_age = 200000000</code>. Monitoring shows <code>age(datfrozenxid)</code> climbing steadily on the main database and it has passed 190 million. What is coming, and what are the usual causes?',
            'Đo trên PostgreSQL 16.14: <code>autovacuum_freeze_max_age = 200000000</code>. Hệ thống quan trắc cho thấy <code>age(datfrozenxid)</code> tăng đều trên cơ sở dữ liệu chính và đã vượt 190 triệu. Chuyện gì sắp tới, và nguyên nhân thường gặp là gì?',
          ),
          options: [
            B('The statistics collector is simply behind: the number counts rows not yet analyzed on this database, and it resets itself the next time autovacuum gets round to running <code>ANALYZE</code>. A high value therefore says the statistics are stale, which costs you plan quality and nothing else, so the action is to run <code>ANALYZE</code> by hand and move on', 'Bộ thu thập thống kê chỉ đang bị chậm: con số đó đếm những dòng chưa được analyze trên cơ sở dữ liệu này, và nó tự đặt lại vào lần autovacuum kịp chạy <code>ANALYZE</code>. Một giá trị cao vì thế chỉ nói rằng thống kê đã cũ, cái giá là chất lượng kế hoạch chứ không gì khác, nên việc cần làm là chạy <code>ANALYZE</code> bằng tay rồi đi tiếp'),
            B('Nothing at all: 200 million is simply the point at which autovacuum starts a freeze pass, so a number near it means the system is working exactly as designed and no value of this counter ever needs action. The freeze pass runs in the background, takes as long as it takes, and cannot be blocked by anything a client does', 'Hoàn toàn không có gì: 200 triệu chỉ là mốc autovacuum bắt đầu một lượt đóng băng, nên một con số gần đó nghĩa là hệ thống đang chạy đúng như thiết kế, và không giá trị nào của bộ đếm này cần tới hành động. Lượt đóng băng chạy ở nền, mất bao lâu thì mất, và không thể bị bất cứ thứ gì phía client chặn lại'),
            B('The disk is filling up with WAL: <code>age(datfrozenxid)</code> is measured in WAL segments retained, so the remedy is to shorten <code>wal_keep_size</code> and the counter falls back down on its own once the oldest segments are recycled; until then the number keeps climbing at exactly the rate WAL is produced', 'Đĩa đang đầy vì WAL: <code>age(datfrozenxid)</code> đo bằng số segment WAL đang giữ lại, nên cách chữa là rút ngắn <code>wal_keep_size</code> rồi bộ đếm sẽ tự tụt xuống khi các segment cũ nhất được tái sử dụng; từ giờ tới lúc đó con số cứ leo đúng theo tốc độ WAL được sinh ra'),
            B('Row visibility uses a 32-bit transaction counter that WRAPS. VACUUM has a second job — freezing old rows so they stay visible after the wrap — and if it stays blocked long enough PostgreSQL warns, then refuses all new transactions with "database is not accepting commands to avoid wraparound data loss". Three usual blockers: a long-running or idle-in-transaction session pinning an old snapshot, an abandoned replication slot, and a prepared transaction nobody committed', 'Việc nhìn thấy dòng dựa trên một bộ đếm giao dịch 32 bit và bộ đếm đó QUAY VÒNG. VACUUM có một việc thứ hai — đóng băng các dòng cũ để chúng vẫn nhìn thấy được sau khi quay vòng — và nếu nó bị chặn đủ lâu thì PostgreSQL cảnh báo, rồi từ chối mọi giao dịch mới với "database is not accepting commands to avoid wraparound data loss". Ba thủ phạm thường gặp: một phiên chạy dài hoặc idle-in-transaction đang ghim một ảnh chụp cũ, một replication slot bị bỏ rơi, và một prepared transaction không ai commit'),
          ],
          correct: 3,
          explanation: EX(
            'This is the failure mode that is boring for years and then stops all writes, which is exactly why it belongs on a dashboard rather than in your memory. The transaction id is 32 bits, so it wraps; a row whose creating transaction is about two billion transactions in the past would appear to be in the FUTURE and become invisible. VACUUM prevents that by freezing old rows, marking them visible to everyone forever — which is why vacuuming is not optional maintenance you can defer. When something blocks cleanup long enough, PostgreSQL starts warning in the log, then refuses new transactions entirely and requires single-user-mode recovery: a full write outage. Every one of the three blockers appeared earlier in this course, and all three are visible from a query: <code>pg_stat_activity</code> for old transactions and <code>idle in transaction</code>, <code>pg_replication_slots</code> for a slot with <code>active = f</code>, <code>pg_prepared_xacts</code> for the forgotten two-phase transaction. Monitor it with one line — <code>SELECT datname, age(datfrozenxid) FROM pg_database ORDER BY 2 DESC;</code> — and treat a rising number as urgent, not interesting. On this freshly built container the same query answered 103, which is what a healthy system looks like: the number should hover, not climb.',
            'Đây là kiểu hỏng nhàm chán suốt nhiều năm rồi bỗng chặn đứng mọi lệnh ghi, và đó đúng là lý do nó phải nằm trên bảng quan trắc chứ không phải trong trí nhớ của bạn. Mã giao dịch là 32 bit nên nó quay vòng; một dòng có giao dịch tạo ra nó nằm cách hiện tại khoảng hai tỷ giao dịch sẽ trông như đang ở TƯƠNG LAI và trở nên vô hình. VACUUM ngăn chuyện đó bằng cách đóng băng các dòng cũ, đánh dấu chúng là ai cũng nhìn thấy được mãi mãi — và vì thế vacuum không phải việc bảo trì tuỳ chọn mà bạn hoãn được. Khi có thứ gì chặn việc dọn dẹp đủ lâu, PostgreSQL bắt đầu cảnh báo trong log, rồi từ chối hẳn giao dịch mới và đòi phải khôi phục ở chế độ một người dùng: một sự cố mất hoàn toàn khả năng ghi. Cả ba thủ phạm đều đã xuất hiện trước đó trong khoá học này, và cả ba đều nhìn thấy được từ một truy vấn: <code>pg_stat_activity</code> cho các giao dịch cũ và trạng thái <code>idle in transaction</code>, <code>pg_replication_slots</code> cho một slot có <code>active = f</code>, <code>pg_prepared_xacts</code> cho giao dịch hai pha bị bỏ quên. Hãy canh nó bằng một dòng — <code>SELECT datname, age(datfrozenxid) FROM pg_database ORDER BY 2 DESC;</code> — và coi một con số đang tăng là chuyện khẩn cấp, không phải chuyện thú vị. Trên container vừa dựng, đúng truy vấn ấy trả về 103, và đó là dáng vẻ của một hệ thống khoẻ: con số nên lửng lơ tại chỗ chứ không leo lên.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured live on PostgreSQL 16.14 while one session held an uncommitted <code>UPDATE</code> and a second session tried to update the same row:' + code(
              ' pid - state  - wait_event_type - wait_event    - query\n' +
              ' 278 - active - Timeout         - PgSleep       - BEGIN; UPDATE notes2 SET views=99 …\n' +
              ' 286 - active - Lock            - transactionid - UPDATE notes2 SET views=1 WHERE id=21;\n' +
              '\n' +
              "SELECT pg_blocking_pids(pid), pid FROM pg_stat_activity WHERE wait_event_type='Lock';\n" +
              ' chan_boi - pid\n' +
              ' {278}    - 286',
            ) + 'You have found the waiter. Which reading and which next step are right?',
            'Đo trực tiếp trên PostgreSQL 16.14 khi một phiên đang giữ một lệnh <code>UPDATE</code> chưa commit còn phiên thứ hai cố cập nhật đúng dòng đó:' + code(
              ' pid - state  - wait_event_type - wait_event    - query\n' +
              ' 278 - active - Timeout         - PgSleep       - BEGIN; UPDATE notes2 SET views=99 …\n' +
              ' 286 - active - Lock            - transactionid - UPDATE notes2 SET views=1 WHERE id=21;\n' +
              '\n' +
              "SELECT pg_blocking_pids(pid), pid FROM pg_stat_activity WHERE wait_event_type='Lock';\n" +
              ' chan_boi - pid\n' +
              ' {278}    - 286',
            ) + 'Bạn đã tìm ra kẻ đang chờ. Cách đọc nào và bước kế tiếp nào là đúng?',
          ),
          options: [
            B('286 is the culprit: it is the one reported as waiting, and <code>wait_event = transactionid</code> means its own transaction id is invalid, so terminate 286 and retry it. 278 is only sleeping, and a sleeping session cannot hold anything that matters to another one', '286 mới là thủ phạm: nó là cái được báo là đang chờ, và <code>wait_event = transactionid</code> nghĩa là mã giao dịch của chính nó không hợp lệ, nên hãy chấm dứt 286 rồi thử lại. 278 chỉ đang ngủ, mà một phiên đang ngủ thì không giữ được thứ gì đáng kể với phiên khác'),
            B('Both are healthy: <code>state = active</code> on both means both are executing, and a <code>Lock</code> wait resolves itself, so the correct action is to wait and re-read the view; a row that never clears would show up as <code>idle in transaction</code> instead, and neither session is in that state', 'Cả hai đều bình thường: <code>state = active</code> ở cả hai nghĩa là cả hai đang thực thi, và một lần chờ <code>Lock</code> tự nó sẽ hết, nên hành động đúng là đợi rồi đọc lại khung nhìn; một dòng không bao giờ hết sẽ hiện ra thành <code>idle in transaction</code>, mà không phiên nào đang ở trạng thái đó'),
            B('Read <code>state</code>, then <code>wait_event_type</code>, then follow <code>pg_blocking_pids</code> UPSTREAM: 286 waits on <code>Lock</code> / <code>transactionid</code>, meaning it wants a row that transaction 278 has written but not committed, so 278 is the one to deal with. Try <code>pg_cancel_backend(278)</code> first — it cancels the running statement and is the safe form — and keep <code>pg_terminate_backend</code> for when that does not work', 'Đọc <code>state</code>, rồi <code>wait_event_type</code>, rồi đi NGƯỢC theo <code>pg_blocking_pids</code>: 286 chờ ở <code>Lock</code> / <code>transactionid</code>, nghĩa là nó muốn một dòng mà giao dịch 278 đã ghi nhưng chưa commit, nên 278 mới là cái phải xử lý. Hãy thử <code>pg_cancel_backend(278)</code> trước — nó huỷ câu lệnh đang chạy và là dạng an toàn — còn <code>pg_terminate_backend</code> thì để dành cho khi cái kia không ăn thua'),
            B('<code>wait_event_type = Lock</code> always means a table-level lock taken by DDL, so look for an <code>ALTER TABLE</code>; <code>pg_blocking_pids</code> reports the pids that 286 is blocking, not the ones blocking it, so the chain has to be followed in the other direction by matching query text by hand', '<code>wait_event_type = Lock</code> luôn nghĩa là một khoá mức bảng do DDL lấy, nên hãy đi tìm một lệnh <code>ALTER TABLE</code>; còn <code>pg_blocking_pids</code> báo những pid mà 286 đang chặn chứ không phải những pid đang chặn nó, nên phải lần chuỗi theo chiều ngược lại bằng cách tự tay đối chiếu nội dung truy vấn'),
          ],
          correct: 2,
          explanation: EX(
            'The reading order is the skill. <code>state</code> first: <code>active</code> means running a statement right now, <code>idle</code> means connected and harmless, <code>idle in transaction</code> means a transaction is open with nothing running — the dangerous one, because it pins a snapshot and holds its locks while the application has moved on. Then <code>wait_event_type</code>: <code>Lock</code> is contention with another session, <code>IO</code> is disk, <code>LWLock</code> is internal, and no wait event at all means it is genuinely working. Then follow the chain: <code>pg_blocking_pids(pid)</code> answers "who is in front of me", and the answer here is 278 — so the waiter is the symptom and the holder is the problem. Note what <code>wait_event = transactionid</code> means precisely: 286 is waiting for a TRANSACTION to end, because the row it wants was written by 278 and its fate is not decided until 278 commits or rolls back. Escalate gently. <code>pg_cancel_backend</code> sends a cancel: the current statement aborts, the transaction rolls back, and the connection survives, so the application sees an ordinary query error. <code>pg_terminate_backend</code> kills the backend and drops the connection, which some pools handle badly. And prevent the recurrence with <code>idle_in_transaction_session_timeout</code>, so the server closes forgotten transactions without anyone being paged.',
            'Thứ tự đọc mới là kỹ năng. <code>state</code> trước: <code>active</code> là đang chạy một câu lệnh ngay lúc này, <code>idle</code> là đã kết nối và vô hại, <code>idle in transaction</code> là một giao dịch đang mở mà không có gì chạy — cái nguy hiểm, vì nó ghim một ảnh chụp và giữ khoá của nó trong khi ứng dụng thì đã đi làm việc khác. Rồi tới <code>wait_event_type</code>: <code>Lock</code> là tranh chấp với một phiên khác, <code>IO</code> là đĩa, <code>LWLock</code> là chuyện nội bộ, còn không có wait event nào thì nghĩa là nó đang làm việc thật. Rồi đi theo chuỗi: <code>pg_blocking_pids(pid)</code> trả lời câu "ai đang đứng trước tôi", và câu trả lời ở đây là 278 — nên kẻ đang chờ là triệu chứng còn kẻ đang giữ mới là vấn đề. Để ý <code>wait_event = transactionid</code> nghĩa chính xác là gì: 286 đang chờ một GIAO DỊCH kết thúc, vì cái dòng nó muốn đã bị 278 ghi và số phận của dòng ấy chưa được định đoạt cho tới khi 278 commit hoặc quay lui. Hãy leo thang từ nhẹ tới nặng. <code>pg_cancel_backend</code> gửi một lệnh huỷ: câu lệnh hiện tại bị bỏ dở, giao dịch quay lui, và kết nối vẫn sống, nên ứng dụng chỉ thấy một lỗi truy vấn bình thường. <code>pg_terminate_backend</code> giết luôn backend và ngắt kết nối, thứ mà một số pool xử lý rất tệ. Và hãy ngăn chuyện tái diễn bằng <code>idle_in_transaction_session_timeout</code>, để máy chủ tự đóng những giao dịch bị bỏ quên mà không ai phải bị gọi dậy.',
          ),
        }),

        mcq({
          prompt: B(
            'The site is slow and nobody knows which query is responsible. Someone suggests installing <code>pg_stat_statements</code> right now. What is wrong with that plan, and how should the view be read once it IS available?',
            'Trang web chậm và không ai biết truy vấn nào là thủ phạm. Có người đề nghị cài <code>pg_stat_statements</code> ngay bây giờ. Kế hoạch đó sai ở đâu, và khi nó ĐÃ có sẵn thì khung nhìn ấy nên được đọc thế nào?',
          ),
          options: [
            B('It needs <code>shared_preload_libraries</code>, which needs a RESTART — so the moment you most want the data is the moment you cannot get it without making the outage worse, and even after the restart the view starts EMPTY, having recorded nothing about what just happened. Once available, order by <code>total_exec_time</code>: a 2 ms query called 100,000 times matters more than a 3-second nightly report', 'Nó cần <code>shared_preload_libraries</code>, mà cái đó cần KHỞI ĐỘNG LẠI — nên đúng lúc bạn cần dữ liệu nhất lại là lúc bạn không lấy được nó nếu không làm sự cố tệ thêm, và ngay cả sau khi khởi động lại thì khung nhìn cũng bắt đầu từ RỖNG, không ghi được gì về chuyện vừa xảy ra. Khi đã có, hãy sắp theo <code>total_exec_time</code>: một truy vấn 2 ms gọi 100.000 lần thì quan trọng hơn một báo cáo 3 giây chạy mỗi đêm'),
            B('Nothing is wrong with it: <code>CREATE EXTENSION pg_stat_statements</code> takes effect immediately and back-fills its counters from the server log, so this is the correct first move during an incident. The extension reads the server log, so its counters cover everything logged since the server started, including the query that just melted the site', 'Chẳng có gì sai cả: <code>CREATE EXTENSION pg_stat_statements</code> có hiệu lực ngay và điền bù các bộ đếm của nó từ log máy chủ, nên đây là nước đi đầu tiên đúng đắn trong một sự cố. Phần mở rộng ấy đọc log máy chủ, nên các bộ đếm của nó bao trùm mọi thứ đã ghi log kể từ lúc máy chủ khởi động, kể cả truy vấn vừa làm chảy cả trang web'),
            B('The problem is that it records every literal value separately, so the view fills with millions of near-identical rows and becomes useless within minutes on any busy server. The usual mitigation is to lower <code>pg_stat_statements.max</code>, which keeps only the most recent shapes and makes the totals meaningful again', 'Vấn đề là nó ghi lại từng giá trị hằng một cách riêng biệt, nên khung nhìn đầy hàng triệu dòng gần giống nhau và trở nên vô dụng trong vài phút trên bất kỳ máy chủ bận nào. Cách chữa thường dùng là hạ <code>pg_stat_statements.max</code> xuống, nó chỉ giữ lại những hình dạng gần nhất và làm các con số tổng có ý nghĩa trở lại'),
            B('It should be ordered by <code>calls</code> rather than by <code>total_exec_time</code>, because the query that runs most often is by definition the one holding the most connections open, and a query that is rare but slow costs the server nothing between its runs', 'Nên sắp theo <code>calls</code> chứ không phải theo <code>total_exec_time</code>, vì truy vấn chạy nhiều lần nhất, theo định nghĩa, là cái đang giữ nhiều kết nối mở nhất, còn một truy vấn hiếm mà chậm thì giữa các lần chạy chẳng tốn của máy chủ thứ gì'),
          ],
          correct: 0,
          explanation: EX(
            'Observability you switch on during the fire only tells you about the NEXT fire. <code>pg_stat_statements</code> has to be loaded into the server at startup, so enabling it costs a restart — trivial on day one, unacceptable mid-incident — and the counters begin at zero afterwards, so the query that just melted the site is not in there. The same logic applies to <code>log_min_duration_statement</code> (log every statement slower than, say, 500 ms) and <code>log_lock_waits</code>: both are cheap, both are set-and-forget, and both answer questions that are unanswerable afterwards. Reading it: always order by <code>total_exec_time</code>, because it is the only column that captures real impact — <code>calls</code> finds the busiest query and <code>mean_exec_time</code> finds the slowest single one, and neither is the same question as "where is the server\'s time actually going". The measured example in lesson 14.4 makes the point in two rows: a <code>LIKE</code> query called twice consumed 51.1 ms while an indexed query called five times consumed 12.7 ms. And note the third option is backwards: literals ARE normalised to <code>$1</code>, so the same query shape with different values is grouped into one row, and that grouping is precisely what makes the totals meaningful.',
            'Khả năng quan sát mà bạn bật lên giữa đám cháy chỉ kể cho bạn nghe về đám cháy TIẾP THEO. <code>pg_stat_statements</code> phải được nạp vào máy chủ lúc khởi động, nên bật nó lên là tốn một lần khởi động lại — chuyện vặt vào ngày đầu tiên, không chấp nhận được giữa sự cố — và các bộ đếm bắt đầu từ số không sau đó, nên cái truy vấn vừa làm chảy cả trang web thì không có trong đó. Cũng lý lẽ ấy áp cho <code>log_min_duration_statement</code> (ghi log mọi câu lệnh chậm hơn, chẳng hạn, 500 ms) và <code>log_lock_waits</code>: cả hai đều rẻ, cả hai đều đặt một lần rồi quên, và cả hai đều trả lời những câu hỏi mà sau đó không còn trả lời được nữa. Cách đọc: luôn sắp theo <code>total_exec_time</code>, vì đó là cột duy nhất nắm bắt được tác động thật — <code>calls</code> tìm ra truy vấn bận rộn nhất còn <code>mean_exec_time</code> tìm ra cái chậm nhất mỗi lượt, và không cái nào là cùng một câu hỏi với "thời gian của máy chủ thật ra đang chảy đi đâu". Ví dụ đo được ở bài 14.4 nói rõ điều đó chỉ trong hai dòng: một truy vấn <code>LIKE</code> gọi hai lần ngốn 51,1 ms trong khi một truy vấn có chỉ mục gọi năm lần ngốn 12,7 ms. Và để ý phương án thứ ba nói ngược: các hằng ĐƯỢC chuẩn hoá thành <code>$1</code>, nên cùng một hình dạng truy vấn với các giá trị khác nhau được gom vào một dòng, và chính việc gom đó làm cho các con số tổng có ý nghĩa.',
          ),
        }),

        // ── Chương 15 — Sao lưu, nhân bản & mở rộng ─────────────────────
        mcq({
          prompt: B(
            'Measured on the practice container. The same 1,000-row database dumped three ways, then two restore attempts:' + code(
              '-rw-r--r--  63681  plain.sql      pg_dump -d ch15 -f plain.sql\n' +
              '-rw-r--r--  10496  custom.dump    pg_dump -d ch15 -Fc -f custom.dump\n' +
              'drwx------   4096  dir/           pg_dump -d ch15 -Fd -j 2 -f dir\n' +
              '\n' +
              'pg_restore -l custom.dump    →  TOC Entries: 11 … Format: CUSTOM … Compression: gzip\n' +
              'pg_restore -d ch15r --data-only -t note custom.dump   →  1000 rows restored\n' +
              '\n' +
              'pg_restore -l plain.sql\n' +
              'pg_restore: error: input file appears to be a text format dump. Please use psql.',
            ) + 'Which format should be your default, and why?',
            'Đo trên container thực hành. Cùng một cơ sở dữ liệu 1.000 dòng dump theo ba cách, rồi hai lần thử khôi phục:' + code(
              '-rw-r--r--  63681  plain.sql      pg_dump -d ch15 -f plain.sql\n' +
              '-rw-r--r--  10496  custom.dump    pg_dump -d ch15 -Fc -f custom.dump\n' +
              'drwx------   4096  dir/           pg_dump -d ch15 -Fd -j 2 -f dir\n' +
              '\n' +
              'pg_restore -l custom.dump    →  TOC Entries: 11 … Format: CUSTOM … Compression: gzip\n' +
              'pg_restore -d ch15r --data-only -t note custom.dump   →  khôi phục 1000 dòng\n' +
              '\n' +
              'pg_restore -l plain.sql\n' +
              'pg_restore: error: input file appears to be a text format dump. Please use psql.',
            ) + 'Định dạng nào nên là mặc định của bạn, và vì sao?',
          ),
          options: [
            B('<code>plain</code>, because it is the only format that survives a major-version upgrade; the compressed formats embed binary structures tied to the server that produced them. That is also why the table of contents cannot be trusted across an upgrade, and why a plain script is the format every migration guide recommends: it is just SQL, so any version of any tool can replay it', '<code>plain</code>, vì nó là định dạng duy nhất sống sót qua một lần nâng cấp phiên bản lớn; các định dạng nén nhúng những cấu trúc nhị phân gắn với chính máy chủ sinh ra chúng. Cũng vì thế cái mục lục không tin được khi nâng cấp, và vì thế một script thuần là định dạng mà mọi hướng dẫn migration khuyên dùng: nó chỉ là SQL, nên phiên bản nào của công cụ nào cũng phát lại được'),
            B('<code>directory</code> always, because it is the only format <code>pg_restore</code> can read, as the error on <code>plain.sql</code> demonstrates. The custom format is a transitional form kept for compatibility with older servers, and it is the one that cannot restore a single table because its contents are one compressed stream', '<code>directory</code>, luôn luôn, vì nó là định dạng duy nhất mà <code>pg_restore</code> đọc được, đúng như lỗi trên <code>plain.sql</code> cho thấy. Định dạng custom là một dạng chuyển tiếp giữ lại để tương thích với các máy chủ cũ, và nó mới là cái không khôi phục nổi một bảng đơn lẻ vì nội dung của nó là một dòng nén liền mạch'),
            B('<code>custom</code> (<code>-Fc</code>): it is compressed AND it carries a table of contents, so <code>pg_restore</code> can list what is inside, restore a SINGLE table, restore data without indexes, or reorder the steps. <code>plain</code> is a text script of <code>CREATE</code> and <code>COPY</code> statements replayed with <code>psql</code> — all or nothing. <code>directory</code> is the one that supports <code>-j</code> parallel dump and restore, so it is what you want for a large database', '<code>custom</code> (<code>-Fc</code>): nó vừa được nén VỪA mang theo một mục lục, nên <code>pg_restore</code> liệt kê được bên trong có gì, khôi phục được MỘT bảng, khôi phục dữ liệu mà không kèm chỉ mục, hoặc đổi thứ tự các bước. <code>plain</code> là một script văn bản gồm các câu <code>CREATE</code> và <code>COPY</code> phát lại bằng <code>psql</code> — được ăn cả ngã về không. <code>directory</code> là định dạng hỗ trợ dump và restore song song bằng <code>-j</code>, nên nó là thứ bạn cần cho một cơ sở dữ liệu lớn'),
            B('It makes no difference: all three contain identical bytes after decompression, so the choice is purely about disk space and the measured ratio is the only consideration. <code>pg_restore</code> and <code>psql</code> are interchangeable readers for all three, and the error above appeared only because the file extension did not match the format', 'Không khác gì cả: cả ba đều chứa những byte y hệt nhau sau khi giải nén, nên lựa chọn thuần tuý là chuyện dung lượng đĩa và tỉ lệ đo được là điều duy nhất cần cân nhắc. <code>pg_restore</code> và <code>psql</code> là hai trình đọc thay thế được cho nhau với cả ba định dạng, còn lỗi ở trên chỉ xuất hiện vì đuôi file không khớp với định dạng'),
          ],
          correct: 2,
          explanation: EX(
            'Size is the least interesting of the differences, and it is also the least transferable: lesson 15.1 measured about 3× on its dataset, this container measured about 6× on a thousand rows of repetitive Vietnamese text, and your data will give a third number — so reason about the CAPABILITY, not the ratio. The capability is the table of contents. <code>pg_restore -l custom.dump</code> lists every object in the archive, and from there you can restore exactly one table (measured above), restore <code>--data-only</code>, or reorder the steps — none of which is possible with a plain SQL file, where your only tool is a text editor. That is also what the second error is telling you: <code>plain</code> is not an archive at all, it is a script, and it goes back in through <code>psql</code>. Two things logical backups are genuinely good at, from the same lesson: moving between major versions (a dump from 15 restores into 16, which physical backups cannot do) and copying production into a laptop or a scratch database. And the limit that matters: a nightly dump means accepting in advance that a failure at 01:59 loses nearly a day — which is what the next lesson exists to fix.',
            'Kích thước là khác biệt ít thú vị nhất, và cũng là thứ ít mang đi nơi khác được nhất: bài 15.1 đo được khoảng 3 lần trên bộ dữ liệu của nó, container này đo được khoảng 6 lần trên một nghìn dòng chữ Việt lặp lại, còn dữ liệu của bạn sẽ cho một con số thứ ba — nên hãy lập luận theo KHẢ NĂNG chứ không theo tỉ lệ. Khả năng ấy chính là cái mục lục. <code>pg_restore -l custom.dump</code> liệt kê mọi đối tượng trong kho lưu, và từ đó bạn khôi phục được đúng một bảng (đo ở trên), khôi phục <code>--data-only</code>, hoặc đổi thứ tự các bước — chẳng việc nào làm được với một file SQL thuần, nơi công cụ duy nhất của bạn là trình soạn thảo văn bản. Đó cũng là điều lỗi thứ hai đang nói: <code>plain</code> hoàn toàn không phải một kho lưu, nó là một script, và nó đi ngược vào qua <code>psql</code>. Hai việc mà sao lưu logic thật sự giỏi, cũng từ bài đó: chuyển giữa các phiên bản lớn (một bản dump từ 15 khôi phục được vào 16, thứ mà sao lưu vật lý không làm được) và chép production về máy tính xách tay hay một cơ sở dữ liệu nháp. Và giới hạn quan trọng: một bản dump mỗi đêm nghĩa là bạn chấp nhận trước rằng một lần hỏng lúc 01:59 sẽ mất gần trọn một ngày — đúng thứ mà bài kế tiếp sinh ra để chữa.',
          ),
        }),

        mcq({
          prompt: B(
            'A multi-hour <code>pg_dump</code> of a large database runs nightly against the primary. Bloat on an unrelated hot table has been climbing ever since. What is the connection?',
            'Một lệnh <code>pg_dump</code> chạy nhiều giờ trên một cơ sở dữ liệu lớn được thực hiện mỗi đêm trên máy chủ chính. Kể từ đó, mức phình của một bảng nóng chẳng liên quan gì cứ tăng dần. Mối liên hệ là gì?',
          ),
          options: [
            B('<code>pg_dump</code> takes an exclusive lock on every table it reads, so writes queue behind it and the resulting backlog is written as a burst of dead tuples when the dump finishes', '<code>pg_dump</code> lấy khoá độc quyền trên mọi bảng nó đọc, nên các lệnh ghi xếp hàng phía sau và phần tồn đọng ấy được ghi ra thành một loạt dead tuple khi bản dump kết thúc'),
            B('There is no connection: <code>pg_dump</code> is a pure reader and cannot affect other tables; the bloat must come from a change in write volume that happens to coincide', 'Không có liên hệ nào: <code>pg_dump</code> chỉ đọc và không thể ảnh hưởng tới các bảng khác; mức phình chắc chắn đến từ một thay đổi về lượng ghi tình cờ trùng thời điểm'),
            B('<code>pg_dump</code> takes a consistent snapshot using MVCC, so it does NOT block writers — but it holds one transaction open for its whole run, and an open transaction pins a snapshot, which stops VACUUM removing any newer row version ACROSS THE DATABASE. Take the dump from a replica instead', '<code>pg_dump</code> lấy một ảnh chụp nhất quán bằng MVCC, nên nó KHÔNG chặn người ghi — nhưng nó giữ một giao dịch mở suốt cả lượt chạy, và một giao dịch đang mở thì ghim một ảnh chụp, khiến VACUUM không dọn được bất kỳ phiên bản dòng nào mới hơn TRÊN TOÀN BỘ cơ sở dữ liệu. Hãy lấy bản dump từ một bản sao'),
            B('The dump writes its output through the WAL, so a long dump fills <code>pg_wal</code> and autovacuum is throttled until the segments are archived', 'Bản dump ghi kết quả của nó qua WAL, nên một lượt dump dài làm đầy <code>pg_wal</code> và autovacuum bị hãm lại cho tới khi các segment được lưu trữ'),
          ],
          correct: 2,
          explanation: EX(
            'This is the same mechanism as a forgotten <code>idle in transaction</code> session, arriving from a direction nobody suspects because the offender is a scheduled backup rather than a stray psql window. <code>pg_dump</code> is well behaved in the way people worry about — it uses the MVCC machinery from Chapter 11 to read a consistent snapshot without blocking a single writer. The cost is the snapshot itself: VACUUM may only reclaim a dead row version once no snapshot could still need it, and the dump has been holding one since it started. Every row version created during those hours is therefore unreclaimable everywhere, and the table that suffers is whichever one churns most, which has nothing to do with the tables being dumped. Two remedies, and the second is the real one: keep the dump short (custom format, <code>-j</code> with the directory format), and take it from a replica so the primary never holds the snapshot. The same reasoning is why lesson 15.1 insists a backup you have never restored is a file rather than a backup — rehearse the restore into a scratch database on a timer and compare row counts, because every failure mode there is silent.',
            'Đây vẫn là cơ chế của một phiên <code>idle in transaction</code> bị bỏ quên, chỉ là tới từ một hướng không ai ngờ, vì thủ phạm là một bản sao lưu có lịch chứ không phải một cửa sổ psql lạc lối. <code>pg_dump</code> cư xử tử tế đúng ở chỗ người ta lo lắng — nó dùng bộ máy MVCC ở Chương 11 để đọc một ảnh chụp nhất quán mà không chặn một người ghi nào. Cái giá nằm ở chính cái ảnh chụp: VACUUM chỉ được thu hồi một phiên bản dòng đã chết khi không còn ảnh chụp nào có thể cần tới nó, mà bản dump thì đang giữ một cái từ lúc nó bắt đầu. Vì thế mọi phiên bản dòng sinh ra trong những giờ đó đều không thu hồi được ở khắp nơi, và cái bảng chịu trận là cái nào biến động nhiều nhất — chẳng liên quan gì tới những bảng đang được dump. Có hai cách chữa, và cách thứ hai mới là cách thật: giữ cho bản dump ngắn (định dạng custom, dùng <code>-j</code> với định dạng directory), và lấy nó từ một bản sao để máy chủ chính không bao giờ phải giữ cái ảnh chụp. Cũng lý lẽ ấy là lý do bài 15.1 khăng khăng rằng một bản sao lưu bạn chưa từng khôi phục thử thì là một cái file chứ không phải một bản sao lưu — hãy diễn tập việc khôi phục vào một cơ sở dữ liệu nháp theo lịch rồi so số dòng, vì mọi kiểu hỏng ở đó đều diễn ra trong im lặng.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on the practice container:' + code(
              'SHOW wal_level;                -- replica\n' +
              'SHOW wal_segment_size;         -- 16MB\n' +
              'SELECT pg_current_wal_lsn();   -- 0/CA90D70',
            ) + 'What is that LSN, and what does the ordering "log first, data later" actually buy?',
            'Đo trên container thực hành:' + code(
              'SHOW wal_level;                -- replica\n' +
              'SHOW wal_segment_size;         -- 16MB\n' +
              'SELECT pg_current_wal_lsn();   -- 0/CA90D70',
            ) + 'LSN đó là gì, và thứ tự "ghi log trước, ghi dữ liệu sau" thật sự mua được điều gì?',
          ),
          options: [
            B('The LSN is a checksum of the current data files; writing the log first lets PostgreSQL verify on restart that no page was corrupted, which is what durability means', 'LSN là mã kiểm tra của các file dữ liệu hiện tại; ghi log trước cho phép PostgreSQL xác minh lúc khởi động lại rằng không trang nào bị hỏng, và đó là ý nghĩa của tính bền vững'),
            B('The LSN is the id of the current 16 MB segment file; the log-first rule exists so that <code>archive_command</code> has something to copy, and it has no role in crash recovery at all', 'LSN là mã của file segment 16 MB hiện tại; luật ghi-log-trước tồn tại để <code>archive_command</code> có cái mà chép đi, và nó hoàn toàn không có vai trò gì trong việc khôi phục sau sập máy'),
            B('The LSN counts committed transactions since the cluster was created; logging first is an optimisation that batches writes, and turning it off with <code>wal_level = minimal</code> is the standard way to speed up bulk loads in production', 'LSN đếm số giao dịch đã commit kể từ lúc cụm được tạo; ghi log trước là một tối ưu để gộp các lệnh ghi lại, và tắt nó bằng <code>wal_level = minimal</code> là cách tiêu chuẩn để tăng tốc nạp dữ liệu hàng loạt trên production'),
            B('The LSN is a byte position in the WAL stream. Because the change is logged and flushed BEFORE the data page is modified, a crash can be recovered by replaying the log — and the same stream is what a replica consumes and what point-in-time recovery replays, so one mechanism gives durability, replication and PITR', 'LSN là một vị trí byte trong dòng WAL. Vì thay đổi được ghi log và ép xuống đĩa TRƯỚC khi trang dữ liệu bị sửa, một lần sập máy có thể khôi phục bằng cách phát lại nhật ký — và cũng chính dòng đó là thứ một bản sao tiêu thụ và là thứ mà khôi phục về một thời điểm phát lại, nên một cơ chế cho ra cả tính bền vững, nhân bản lẫn PITR'),
          ],
          correct: 3,
          explanation: EX(
            'Write-ahead means literally that: the record describing a change is appended to the WAL and flushed to disk, and only then may the data page itself be modified — the page can be written back lazily, minutes later. If the machine dies in between, recovery replays the log and no committed transaction is lost, which is the D in ACID. The LSN is a byte offset into that continuous stream: every change has one, every replica reports how far it has replayed as one, and every recovery target is expressed as one, so it is the clock the whole system runs on. WAL lives in <code>pg_wal/</code> as fixed 16 MB files with 24-hex-character names, and <code>wal_level</code> decides how much detail they carry — <code>minimal</code> is enough to survive a crash but supports neither replication nor PITR; <code>replica</code> is the default (measured above) and what you want; <code>logical</code> adds enough for change-data-capture at the cost of a little more volume. Two operational notes: keeping WAL past its own lifetime requires <code>archive_mode</code> and an <code>archive_command</code> that returns non-zero on failure (PostgreSQL then keeps the segment and retries, which is correct and is also how a broken archive command fills your disk), and hand-rolling all of this is possible while running it for years is a different matter — pgBackRest or WAL-G handle retention, compression and, crucially, verification.',
            'Ghi-trước nghĩa đúng như thế: bản ghi mô tả một thay đổi được nối vào WAL và ép xuống đĩa, rồi mới được phép sửa chính trang dữ liệu — trang đó có thể ghi lại thong thả, vài phút sau. Nếu máy chết ở khoảng giữa, quá trình khôi phục phát lại nhật ký và không giao dịch đã commit nào bị mất, và đó là chữ D trong ACID. LSN là một độ dời byte trong dòng liên tục ấy: mọi thay đổi đều có một cái, mọi bản sao đều báo cáo nó đã phát lại tới đâu bằng một cái, và mọi mốc khôi phục đều được diễn đạt bằng một cái — nên nó là cái đồng hồ mà cả hệ thống chạy theo. WAL nằm trong <code>pg_wal/</code> dưới dạng các file 16 MB cố định với tên 24 ký tự hex, và <code>wal_level</code> quyết định chúng mang bao nhiêu chi tiết — <code>minimal</code> đủ để sống sót sau sập máy nhưng không hỗ trợ nhân bản lẫn PITR; <code>replica</code> là mặc định (đo được ở trên) và là thứ bạn cần; <code>logical</code> thêm đủ chi tiết cho việc bắt thay đổi dữ liệu, đổi lại lượng WAL nhiều hơn chút ít. Hai ghi chú vận hành: giữ WAL lâu hơn vòng đời của chính nó thì cần <code>archive_mode</code> cùng một <code>archive_command</code> trả về khác 0 khi hỏng (khi đó PostgreSQL giữ lại segment và thử lại — đúng đắn, và cũng là cách một archive command hỏng làm đầy đĩa của bạn), và tự tay dựng hết mọi thứ này thì làm được, nhưng vận hành nó suốt nhiều năm lại là chuyện khác — pgBackRest hay WAL-G lo phần lưu giữ, nén, và quan trọng nhất là kiểm chứng.',
          ),
        }),

        mcq({
          prompt: B(
            'At 14:32 someone runs <code>DELETE FROM users</code> with no <code>WHERE</code> on production. The last <code>pg_dump</code> finished at 02:00. What does point-in-time recovery need, and what does it give you that the dump cannot?',
            'Lúc 14:32 có người chạy <code>DELETE FROM users</code> không kèm <code>WHERE</code> trên production. Bản <code>pg_dump</code> gần nhất xong lúc 02:00. Khôi phục về một thời điểm cần những gì, và nó cho bạn thứ gì mà bản dump không cho được?',
          ),
          options: [
            B('A base backup (a physical copy of the data directory, taken with <code>pg_basebackup</code>) PLUS every WAL segment archived since it, PLUS a recovery target such as <code>recovery_target_time = \'…14:31:59\'</code> and a <code>recovery.signal</code> file. It turns a worst case of "everything since 02:00" into "the last 60 seconds"', 'Một bản sao lưu nền (bản chép vật lý của thư mục dữ liệu, lấy bằng <code>pg_basebackup</code>) CỘNG mọi segment WAL đã lưu trữ kể từ đó, CỘNG một mốc khôi phục như <code>recovery_target_time = \'…14:31:59\'</code> và một file <code>recovery.signal</code>. Nó biến trường hợp xấu nhất từ "mọi thứ kể từ 02:00" thành "60 giây cuối cùng"'),
            B('Only the WAL segments: PostgreSQL can replay the log from the beginning of time, so a base backup is an optimisation that shortens recovery rather than a requirement', 'Chỉ cần các segment WAL: PostgreSQL phát lại được nhật ký từ thuở khai thiên lập địa, nên bản sao lưu nền chỉ là một tối ưu rút ngắn thời gian khôi phục chứ không phải điều kiện bắt buộc'),
            B('A read replica, which can be promoted and rewound to any earlier instant with <code>pg_ctl promote --at</code>; PITR is the name of that promotion procedure', 'Một bản sao chỉ đọc, có thể được thăng cấp và tua ngược về bất kỳ thời điểm nào trước đó bằng <code>pg_ctl promote --at</code>; PITR là tên của chính thủ tục thăng cấp đó'),
            B('Nothing extra — <code>pg_restore</code> accepts a <code>--target-time</code> flag that replays the dump only up to the instant you name, which is why the custom format carries timestamps', 'Không cần thêm gì cả — <code>pg_restore</code> nhận một cờ <code>--target-time</code> để phát lại bản dump chỉ tới đúng thời điểm bạn nêu, và đó là lý do định dạng custom mang theo các mốc thời gian'),
          ],
          correct: 0,
          explanation: EX(
            'Point-in-time recovery is two ingredients plus an instruction. The base backup is the starting state — a physical copy of the data directory, which is why it cannot cross major versions the way a logical dump can. The archived WAL then moves that copy forward change by change, and the recovery target tells PostgreSQL where to stop: a timestamp, an LSN, a transaction id, or a named restore point. That is the answer to the disaster a nightly dump cannot address, because "restore last night\'s dump" means accepting in advance that a failure at 01:59 loses nearly a day, and dumping more often does not fix it — a dump is a full read of the database, so more often costs load and still leaves a window. Note what you must know to use it: WHEN. Check the logs before choosing a target, and if you are unsure, aim slightly early and inspect, because replaying past the mistake puts you back where you started. And the retention trap from lesson 15.2 is worth carrying: a replication slot guarantees the primary keeps every WAL segment its consumer has not confirmed, unconditionally — so an abandoned slot with <code>active = f</code> fills the disk until the server cannot write WAL at all, which is a total outage caused by a component nobody was using.',
            'Khôi phục về một thời điểm gồm hai nguyên liệu cộng một chỉ dẫn. Bản sao lưu nền là trạng thái xuất phát — một bản chép vật lý của thư mục dữ liệu, và vì thế nó không vượt được qua các phiên bản lớn theo cách một bản dump logic làm được. Rồi WAL đã lưu trữ đẩy bản chép ấy tiến lên từng thay đổi một, còn mốc khôi phục bảo PostgreSQL dừng ở đâu: một mốc thời gian, một LSN, một mã giao dịch, hay một điểm khôi phục có tên. Đó là câu trả lời cho thảm hoạ mà một bản dump mỗi đêm không giải quyết nổi, vì "khôi phục bản dump đêm qua" nghĩa là chấp nhận trước rằng một lần hỏng lúc 01:59 làm mất gần trọn một ngày, và dump dày hơn cũng không chữa được — một bản dump là một lượt đọc toàn bộ cơ sở dữ liệu, nên dày hơn thì tốn tải mà vẫn còn một khe hở. Để ý thứ bạn buộc phải biết mới dùng được nó: LÚC NÀO. Hãy xem log trước khi chọn mốc, và nếu chưa chắc thì nhắm sớm hơn một chút rồi kiểm tra, vì phát lại quá cái lỗi kia là bạn quay về đúng chỗ xuất phát. Và cái bẫy về lưu giữ ở bài 15.2 cũng đáng mang theo: một replication slot bảo đảm máy chủ chính giữ lại mọi segment WAL mà bên tiêu thụ chưa xác nhận, một cách vô điều kiện — nên một slot bị bỏ rơi với <code>active = f</code> sẽ làm đầy đĩa cho tới khi máy chủ không ghi nổi WAL nữa, một sự cố toàn diện gây ra bởi một thành phần chẳng ai dùng.',
          ),
        }),

        mcq({
          prompt: B(
            'A streaming replica is running. Two facts about it (the error text below was reproduced on PostgreSQL 16.14 with <code>SET TRANSACTION READ ONLY</code>):' + code(
              'SELECT pg_is_in_recovery();   -- t   (on the replica, permanently)\n' +
              '\n' +
              "INSERT INTO note (title) VALUES ('thử ghi');\n" +
              'ERROR:  cannot execute INSERT in a read-only transaction',
            ) + 'The team proposes dropping nightly backups now that a replica exists. What do you say?',
            'Một bản sao trực tuyến đang chạy. Hai sự thật về nó (đoạn lỗi bên dưới được tái hiện trên PostgreSQL 16.14 bằng <code>SET TRANSACTION READ ONLY</code>):' + code(
              'SELECT pg_is_in_recovery();   -- t   (trên bản sao, vĩnh viễn)\n' +
              '\n' +
              "INSERT INTO note (title) VALUES ('thử ghi');\n" +
              'ERROR:  cannot execute INSERT in a read-only transaction',
            ) + 'Nhóm đề nghị bỏ sao lưu hằng đêm vì đã có bản sao rồi. Bạn nói gì?',
          ),
          options: [
            B('Agree: a replica is a continuously updated copy on separate hardware, which is strictly better than a nightly snapshot — that is what "streaming" means', 'Đồng ý: một bản sao là một bản chép được cập nhật liên tục trên phần cứng riêng, vốn tốt hơn hẳn một ảnh chụp mỗi đêm — đó chính là ý nghĩa của chữ "trực tuyến"'),
            B('Agree, provided the replica is synchronous, because with <code>synchronous_commit</code> no transaction can be lost and there is therefore nothing left for a backup to protect', 'Đồng ý, miễn là bản sao chạy đồng bộ, vì với <code>synchronous_commit</code> thì không giao dịch nào mất được và do đó chẳng còn gì cho một bản sao lưu bảo vệ nữa'),
            B('Disagree: a replica REPRODUCES the primary faithfully, including <code>DROP TABLE</code> and a <code>DELETE</code> with no <code>WHERE</code> — within a second. It answers hardware failure and read capacity; PITR answers human error. They are different problems and you need both', 'Không đồng ý: một bản sao TÁI TẠO máy chủ chính một cách trung thành, kể cả <code>DROP TABLE</code> lẫn một lệnh <code>DELETE</code> không có <code>WHERE</code> — trong vòng một giây. Nó trả lời cho hỏng phần cứng và cho năng lực đọc; còn PITR trả lời cho lỗi con người. Đó là hai bài toán khác nhau và bạn cần cả hai'),
            B('Disagree, because a replica cannot be read at all: <code>pg_is_in_recovery() = t</code> means it is still catching up and will only serve queries once recovery completes', 'Không đồng ý, vì một bản sao hoàn toàn không đọc được: <code>pg_is_in_recovery() = t</code> nghĩa là nó vẫn đang đuổi theo và chỉ phục vụ truy vấn khi quá trình khôi phục kết thúc'),
          ],
          correct: 2,
          explanation: EX(
            'Replication and backup answer different questions and it is worth saying out loud which is which. A replica gives you read capacity (reports, dashboards, <code>pg_dump</code> itself) and a machine to fail over to — <code>pg_ctl promote</code> turns it into a primary in seconds. What it cannot give you is protection from mistakes, because faithfully reproducing the primary is its entire job: the accidental <code>DELETE</code> is replayed on the replica before you have finished typing the next command. PITR is the answer to human error; replication is the answer to hardware failure. Two details in the output are worth reading properly. <code>pg_is_in_recovery() = t</code> is the definitive test for "is this a replica", and it is permanent — replaying WAL is not a startup phase for a standby, it is the job, so the last option has it exactly backwards. And the read-only refusal is structural rather than a policy: a physical replica is byte-identical to its primary, so it cannot accept independent writes at all. One more trap worth knowing: async replication means the replica lags, usually by milliseconds, so a user who submits a form and is redirected to a read served by the replica may not see their own change — route reads that follow a write in the same user action to the primary.',
            'Nhân bản và sao lưu trả lời hai câu hỏi khác nhau, và nói thẳng ra cái nào là cái nào thì rất đáng. Một bản sao cho bạn năng lực đọc (báo cáo, bảng điều khiển, và chính <code>pg_dump</code>) cùng một cỗ máy để chuyển sang khi sự cố — <code>pg_ctl promote</code> biến nó thành máy chính trong vài giây. Thứ nó không cho được là sự bảo vệ trước sai lầm, vì tái tạo trung thành máy chính chính là toàn bộ công việc của nó: lệnh <code>DELETE</code> lỡ tay được phát lại trên bản sao trước khi bạn kịp gõ xong câu lệnh tiếp theo. PITR là câu trả lời cho lỗi con người; nhân bản là câu trả lời cho hỏng phần cứng. Hai chi tiết trong kết quả cũng đáng đọc cho đúng. <code>pg_is_in_recovery() = t</code> là phép thử dứt khoát cho câu hỏi "đây có phải bản sao không", và nó là vĩnh viễn — phát lại WAL không phải một pha khởi động của một standby, nó là công việc của standby, nên phương án cuối nói ngược hoàn toàn. Và lời từ chối chỉ-đọc là chuyện cấu trúc chứ không phải một chính sách: một bản sao vật lý giống máy chính tới từng byte, nên nó hoàn toàn không nhận được lệnh ghi độc lập nào. Còn một cái bẫy nữa đáng biết: nhân bản bất đồng bộ nghĩa là bản sao bị trễ, thường vài mili giây, nên một người dùng vừa gửi biểu mẫu rồi bị chuyển hướng tới một lượt đọc do bản sao phục vụ có thể không thấy thay đổi của chính mình — hãy định tuyến những lượt đọc đi ngay sau một lượt ghi trong cùng một thao tác của người dùng về máy chính.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on a table partitioned <code>BY RANGE (luc)</code> into three monthly partitions, statistics fresh:' + code(
              "EXPLAIN (COSTS OFF) SELECT count(*) FROM ev_p WHERE luc >= '2026-08-01' AND luc < '2026-09-01';\n" +
              ' Aggregate\n' +
              '   ->  Seq Scan on ev_p_08 ev_p         ← no Append node; the other two are not mentioned\n' +
              '\n' +
              "EXPLAIN (COSTS OFF) SELECT count(*) FROM ev_p WHERE payload = 'p42';\n" +
              '   ->  Append\n' +
              '         ->  Seq Scan on ev_p_06 …  ev_p_07 …  ev_p_08 …\n' +
              '\n' +
              'CREATE TABLE bad_p (id bigint PRIMARY KEY, luc date NOT NULL) PARTITION BY RANGE (luc);\n' +
              'ERROR:  unique constraint on partitioned table must include all partitioning columns\n' +
              '\n' +
              "INSERT INTO ev_p(luc, payload) VALUES ('2027-01-01','x');\n" +
              'ERROR:  no partition of relation "ev_p" found for row',
            ) + 'Which reading of these four results is correct?',
            'Đo trên PostgreSQL 16.14 trên một bảng phân mảnh <code>BY RANGE (luc)</code> thành ba mảnh theo tháng, thống kê đã mới:' + code(
              "EXPLAIN (COSTS OFF) SELECT count(*) FROM ev_p WHERE luc >= '2026-08-01' AND luc < '2026-09-01';\n" +
              ' Aggregate\n' +
              '   ->  Seq Scan on ev_p_08 ev_p         ← không có node Append; hai mảnh kia không được nhắc tới\n' +
              '\n' +
              "EXPLAIN (COSTS OFF) SELECT count(*) FROM ev_p WHERE payload = 'p42';\n" +
              '   ->  Append\n' +
              '         ->  Seq Scan on ev_p_06 …  ev_p_07 …  ev_p_08 …\n' +
              '\n' +
              'CREATE TABLE bad_p (id bigint PRIMARY KEY, luc date NOT NULL) PARTITION BY RANGE (luc);\n' +
              'ERROR:  unique constraint on partitioned table must include all partitioning columns\n' +
              '\n' +
              "INSERT INTO ev_p(luc, payload) VALUES ('2027-01-01','x');\n" +
              'ERROR:  no partition of relation "ev_p" found for row',
            ) + 'Cách đọc nào về bốn kết quả này là đúng?',
          ),
          options: [
            B('Partitioning speeds up every query on the table because each partition is smaller; the second plan is slower only because <code>payload</code> has no index, and adding one would prune the partitions too', 'Phân mảnh tăng tốc mọi truy vấn trên bảng vì mỗi mảnh nhỏ hơn; kế hoạch thứ hai chậm chỉ vì <code>payload</code> chưa có chỉ mục, và thêm một cái vào thì các mảnh cũng sẽ được cắt tỉa'),
            B('Pruning only works when the query filters on the PARTITION KEY — a filter on any other column must scan every partition and is therefore SLOWER than the same query on an unpartitioned table. A primary key must include the partition key, and a row with no matching partition is rejected, so create partitions ahead of time or attach a DEFAULT one', 'Cắt tỉa mảnh chỉ hoạt động khi truy vấn lọc theo KHOÁ PHÂN MẢNH — lọc theo bất kỳ cột nào khác thì phải quét mọi mảnh và vì thế CHẬM HƠN cùng truy vấn ấy trên một bảng không phân mảnh. Khoá chính buộc phải chứa khoá phân mảnh, và một dòng không có mảnh nào khớp thì bị từ chối, nên hãy tạo mảnh trước hạn hoặc gắn thêm một mảnh DEFAULT'),
            B('The missing <code>Append</code> node in the first plan means the query failed to reach the partitions and counted only the parent table, which is why the number looked plausible but was wrong', 'Việc thiếu node <code>Append</code> trong kế hoạch đầu nghĩa là truy vấn không với tới được các mảnh và chỉ đếm bảng cha, và vì thế con số trông có vẻ hợp lý nhưng lại sai'),
            B('The primary-key error is a bug fixed in later versions; a partitioned table may have any primary key as long as each partition also declares one, which is the usual pattern', 'Lỗi về khoá chính là một bug đã được sửa ở các phiên bản sau; một bảng phân mảnh được phép có khoá chính bất kỳ miễn là mỗi mảnh cũng khai một cái, và đó là khuôn mẫu thông thường'),
          ],
          correct: 1,
          explanation: EX(
            'Read the first plan carefully: there is no <code>Append</code> node and the other two partitions are not mentioned at all, because the planner PROVED from the <code>WHERE</code> clause that they cannot contain matching rows and excluded them before execution. Two thirds of the data was never touched. The second plan is the same feature failing to apply: filtering on <code>payload</code> tells the planner nothing about <code>luc</code>, so every partition is scanned — and that is genuinely slower than one unpartitioned table, because it is now several relations instead of one. Choosing the partition key is choosing which queries get faster, and choosing which get worse. The two errors are the practical friction: a unique constraint (and therefore a primary key) must include the partition key so uniqueness can be enforced locally within each partition, and a row whose key falls outside every range is refused rather than silently stored — so you either schedule partition creation a few months ahead or attach a DEFAULT partition as a safety net. And note the boundaries are half-open, <code>FROM</code> inclusive and <code>TO</code> exclusive: measured, a row at exactly <code>2026-07-01</code> lands in the July partition, not June, which is what makes consecutive monthly ranges tile without overlapping.',
            'Hãy đọc kỹ kế hoạch đầu: không có node <code>Append</code> nào và hai mảnh kia hoàn toàn không được nhắc tới, vì bộ lập kế hoạch đã CHỨNG MINH được từ mệnh đề <code>WHERE</code> rằng chúng không thể chứa dòng khớp nào và loại chúng ra trước khi thực thi. Hai phần ba dữ liệu chưa từng bị đụng tới. Kế hoạch thứ hai là cũng tính năng ấy nhưng không áp dụng được: lọc theo <code>payload</code> chẳng nói gì cho bộ lập kế hoạch biết về <code>luc</code>, nên mọi mảnh đều bị quét — và như thế thì thật sự chậm hơn một bảng không phân mảnh, vì giờ là vài quan hệ thay vì một. Chọn khoá phân mảnh chính là chọn xem những truy vấn nào sẽ nhanh lên, và những truy vấn nào sẽ tệ đi. Hai thông báo lỗi kia là phần ma sát thực tế: một ràng buộc duy nhất (và do đó cả khoá chính) buộc phải chứa khoá phân mảnh để tính duy nhất được thực thi cục bộ trong từng mảnh, và một dòng có khoá rơi ngoài mọi khoảng thì bị từ chối chứ không được lưu âm thầm — nên bạn hoặc lên lịch tạo mảnh trước vài tháng, hoặc gắn thêm một mảnh DEFAULT làm lưới đỡ. Và để ý các biên là nửa mở, <code>FROM</code> tính vào còn <code>TO</code> thì không: đo thật, một dòng đúng ở mốc <code>2026-07-01</code> rơi vào mảnh tháng Bảy chứ không phải tháng Sáu, và đó là thứ làm cho các khoảng tháng liên tiếp lát kín mà không chồng lên nhau.',
          ),
        }),

        // ── Chương 16 — PostgreSQL trên production & capstone ───────────
        mcq({
          prompt: B(
            'In this repository, <code>prisma migrate dev</code> fails with <b>P3006</b> and always has. The cause is two lines of an already-deployed migration — reproduced verbatim on PostgreSQL 16.14:' + code(
              'ALTER TABLE post_music ADD CONSTRAINT post_music_post_id_key UNIQUE (post_id);\n' +
              "SELECT indexname FROM pg_indexes WHERE tablename='post_music';\n" +
              ' post_music_post_id_key\n' +
              '\n' +
              'CREATE INDEX post_music_post_id_key ON post_music(post_id);\n' +
              'ERROR:  relation "post_music_post_id_key" already exists',
            ) + 'Why does this break <code>migrate dev</code> while production is unaffected, and what is the correct response?',
            'Trong kho mã này, <code>prisma migrate dev</code> hỏng với mã <b>P3006</b> và vẫn luôn như vậy. Nguyên nhân là hai dòng trong một migration đã được triển khai — tái hiện nguyên văn trên PostgreSQL 16.14:' + code(
              'ALTER TABLE post_music ADD CONSTRAINT post_music_post_id_key UNIQUE (post_id);\n' +
              "SELECT indexname FROM pg_indexes WHERE tablename='post_music';\n" +
              ' post_music_post_id_key\n' +
              '\n' +
              'CREATE INDEX post_music_post_id_key ON post_music(post_id);\n' +
              'ERROR:  relation "post_music_post_id_key" already exists',
            ) + 'Vì sao chuyện này làm hỏng <code>migrate dev</code> mà production thì không sao, và phản ứng đúng là gì?',
          ),
          options: [
            B('A UNIQUE constraint creates an index behind it USING THE CONSTRAINT\'S NAME — the measured <code>pg_indexes</code> row proves it — so the next line tries to create a second relation with the same name. <code>migrate dev</code> builds a SHADOW DATABASE that replays every migration from zero, so it hits the collision; <code>migrate deploy</code> never re-runs an applied migration, so production never does. Do not edit the file — hand-write new migration SQL and apply it with <code>migrate deploy</code>', 'Một ràng buộc UNIQUE tạo ra một chỉ mục đằng sau nó MANG ĐÚNG TÊN CỦA RÀNG BUỘC — dòng <code>pg_indexes</code> đo được chứng minh điều đó — nên dòng kế tiếp cố tạo một quan hệ thứ hai trùng tên. <code>migrate dev</code> dựng một SHADOW DATABASE phát lại mọi migration từ con số không nên nó đâm vào chỗ trùng tên; còn <code>migrate deploy</code> không bao giờ chạy lại một migration đã áp dụng nên production không bao giờ gặp. Đừng sửa file đó — hãy tự viết SQL migration mới rồi áp dụng bằng <code>migrate deploy</code>'),
            B('The two statements are simply redundant and Prisma warns about duplicated work; deleting the second line from the migration file is safe because indexes are recreated on every deploy anyway. Prisma re-reads every migration file at deploy time and compares it against the schema, so removing a redundant line brings the two back into agreement and P3006 disappears for everyone', 'Hai câu lệnh đơn giản là thừa và Prisma cảnh báo về việc làm trùng; xoá dòng thứ hai khỏi file migration là an toàn vì dù sao các chỉ mục cũng được tạo lại ở mỗi lần deploy. Prisma đọc lại mọi file migration lúc deploy rồi so với lược đồ, nên bỏ đi một dòng thừa là hai bên khớp lại và P3006 biến mất với tất cả mọi người'),
            B('P3006 means the migration is missing from the <code>_prisma_migrations</code> table; run <code>prisma migrate resolve --applied</code> to record it and both commands work again. The command only writes a row into the history table, so it changes no schema and carries no risk — which is why it is the documented first response to any P-series migration error', 'P3006 nghĩa là migration đó thiếu trong bảng <code>_prisma_migrations</code>; chạy <code>prisma migrate resolve --applied</code> để ghi nhận nó thì cả hai lệnh lại chạy được. Lệnh đó chỉ ghi một dòng vào bảng lịch sử, nên nó không đổi lược đồ và không mang rủi ro nào — vì thế nó là phản ứng đầu tiên được ghi trong tài liệu cho mọi lỗi migration họ P'),
            B('The shadow database is created from a dump of production, so it inherited a corrupt index; recreating it with <code>--skip-seed</code> resolves the collision. The shadow database is a copy of the live one precisely so that <code>migrate dev</code> can diff against real data, which is also why it must never be pointed at production', 'Shadow database được tạo từ một bản dump của production nên nó thừa hưởng một chỉ mục hỏng; tạo lại nó với <code>--skip-seed</code> là hết trùng. Shadow database là bản chép của cơ sở dữ liệu đang chạy đúng để <code>migrate dev</code> so được với dữ liệu thật, và cũng vì thế không bao giờ được trỏ nó vào production'),
          ],
          correct: 0,
          explanation: EX(
            'Two facts meet here, and the first one is easy to verify: a UNIQUE constraint is IMPLEMENTED as a unique index, and that index takes the constraint\'s name — the measured <code>pg_indexes</code> row is the proof, and the next <code>CREATE INDEX</code> then collides in the shared relation namespace. The second fact is the shadow database. To work out what changed, <code>migrate dev</code> replays every migration from the beginning into a scratch database — so a migration that was accepted once but is not REPLAYABLE breaks it forever after, even though the real database is perfectly fine. On the real database the migration is recorded as applied, and <code>migrate deploy</code> applies pending migrations in order and nothing else, with no shadow database, no generation and no prompts, so it never runs it again. The fix that is NOT available is editing the file: it is already applied on production, and rewriting an applied migration makes the recorded checksum disagree with history — exactly the drift you do not want when you next need to reason about what the database contains. The working practice here is to hand-write new migration SQL under <code>prisma/migrations/&lt;timestamp&gt;_&lt;name&gt;/migration.sql</code> and apply it with <code>migrate deploy</code>, then verify with <code>prisma migrate diff</code> — empty output means schema and database agree. And note the third option is the dangerous one: <code>migrate resolve --applied</code> tells Prisma a migration succeeded, so if it only partly ran, schema and history now disagree in a way nothing detects until a later migration fails for reasons that make no sense.',
            'Hai sự thật gặp nhau ở đây, và cái thứ nhất thì dễ kiểm: một ràng buộc UNIQUE được CÀI ĐẶT bằng một chỉ mục duy nhất, và chỉ mục ấy mang đúng tên của ràng buộc — dòng <code>pg_indexes</code> đo được chính là bằng chứng, rồi lệnh <code>CREATE INDEX</code> kế tiếp đâm vào chỗ trùng tên trong không gian tên dùng chung của các quan hệ. Sự thật thứ hai là shadow database. Để tìm ra cái gì đã thay đổi, <code>migrate dev</code> phát lại mọi migration từ đầu vào một cơ sở dữ liệu nháp — nên một migration từng được chấp nhận một lần nhưng KHÔNG PHÁT LẠI ĐƯỢC sẽ làm hỏng nó mãi mãi về sau, dù cơ sở dữ liệu thật hoàn toàn bình thường. Trên cơ sở dữ liệu thật, migration đã được ghi nhận là đã áp dụng, còn <code>migrate deploy</code> thì chỉ áp dụng các migration còn chờ theo thứ tự chứ không làm gì khác — không shadow database, không sinh mã, không hỏi han — nên nó không bao giờ chạy lại nó. Cách sửa KHÔNG có sẵn là sửa file đó: nó đã được áp dụng trên production, và viết lại một migration đã áp dụng sẽ làm mã kiểm tra được ghi nhận lệch với lịch sử — đúng cái trạng thái trôi dạt mà bạn không muốn có vào lần tiếp theo cần suy luận xem cơ sở dữ liệu đang chứa gì. Cách làm việc ở đây là tự viết SQL migration mới dưới <code>prisma/migrations/&lt;timestamp&gt;_&lt;tên&gt;/migration.sql</code> rồi áp dụng bằng <code>migrate deploy</code>, sau đó kiểm bằng <code>prisma migrate diff</code> — kết quả rỗng nghĩa là lược đồ và cơ sở dữ liệu khớp nhau. Và để ý phương án thứ ba mới là cái nguy hiểm: <code>migrate resolve --applied</code> nói với Prisma rằng migration đã thành công, nên nếu nó mới chạy được một phần thì lược đồ và lịch sử giờ bất đồng theo một kiểu mà không gì phát hiện ra, cho tới khi một migration sau đó hỏng vì những lý do chẳng ai hiểu nổi.',
          ),
        }),

        mcq({
          prompt: B(
            'Lesson 16.2 counts the schema behind this very site. Counted again today from <code>prisma/schema.prisma</code>:' + code(
              '                 lesson 16.2      today\n' +
              ' lines               8,164        8,540\n' +
              ' models                277          286\n' +
              ' migrations            117          131\n' +
              ' @@index               446          463\n' +
              ' @relation             441          460\n' +
              ' User @relation         47           47',
            ) + 'What is the useful thing to take from a table like this?',
            'Bài 16.2 đếm lược đồ đứng sau chính trang này. Đếm lại hôm nay từ <code>prisma/schema.prisma</code>:' + code(
              '                 bài 16.2       hôm nay\n' +
              ' dòng                8.164        8.540\n' +
              ' model                 277          286\n' +
              ' migration             117          131\n' +
              ' @@index               446          463\n' +
              ' @relation             441          460\n' +
              ' User @relation         47           47',
            ) + 'Điều hữu ích rút ra từ một bảng như thế này là gì?',
          ),
          options: [
            B('That the lesson is out of date and its numbers should be corrected; a schema description is only useful when its counts are exact, which is why they belong in generated documentation rather than in prose, where a number is stale the day after it is typed and misleads every reader afterwards', 'Rằng bài học đã cũ và các con số của nó cần được sửa lại; một bản mô tả lược đồ chỉ hữu ích khi các con số chính xác, và vì thế chúng thuộc về tài liệu sinh tự động chứ không phải văn xuôi, nơi một con số cũ đi ngay hôm sau khi gõ ra và đánh lừa mọi người đọc về sau'),
            B('That the schema grew by 9 models and 14 migrations in the interval — a schema is not designed once, it grows for as long as the product does. That is precisely why migrations (ordered, recorded, replayable) are the mechanism rather than <code>db push</code>, and why one model with 47 relations is worth noticing: it is the table every query eventually joins to', 'Rằng lược đồ đã lớn thêm 9 model và 14 migration trong khoảng thời gian đó — một lược đồ không phải thứ được thiết kế một lần, nó lớn lên chừng nào sản phẩm còn lớn. Đó đúng là lý do migration (có thứ tự, được ghi nhận, phát lại được) mới là cơ chế chứ không phải <code>db push</code>, và là lý do một model có 47 quan hệ đáng để ý: nó là cái bảng mà rốt cuộc mọi truy vấn đều nối tới'),
            B('That 463 indexes on 286 models is roughly 1.6 per model, which is the industry-standard ratio; a schema below it is under-indexed and one above it is over-indexed; measuring the ratio each quarter is how teams decide when to spend a sprint on indexes', 'Rằng 463 chỉ mục trên 286 model là khoảng 1,6 cái mỗi model, đúng tỉ lệ tiêu chuẩn của ngành; lược đồ thấp hơn thì thiếu chỉ mục còn cao hơn thì thừa chỉ mục; đo tỉ lệ ấy mỗi quý là cách các nhóm quyết định khi nào nên dành một sprint cho chỉ mục'),
            B('That <code>User</code> stopped changing while everything else grew, which means the 47 relations are dead code left by earlier features and should be pruned before the next migration, because a model that stops changing while its neighbours grow has stopped carrying its share of the domain', 'Rằng <code>User</code> đã ngừng thay đổi trong khi mọi thứ khác lớn lên, nghĩa là 47 quan hệ ấy là mã chết do các tính năng cũ để lại và nên được dọn đi trước migration kế tiếp, vì một model ngừng thay đổi trong khi hàng xóm của nó lớn lên là một model đã thôi gánh phần của mình trong miền nghiệp vụ'),
          ],
          correct: 1,
          explanation: EX(
            'The interesting column is the difference, not either column on its own. Nine new models and fourteen new migrations arrived between the lesson being written and today, and nothing about that is unusual — which is the point the lesson is making. A schema is not a thing you design once and then have; it is a thing that grows for as long as the product does, and the mechanism has to survive that. That is the whole argument for migrations: each change is a file, ordered, recorded in <code>_prisma_migrations</code>, and replayable, so the database\'s history is readable a year later by someone who was not there. <code>prisma db push</code> gives you the same end state with no history at all, which is fine for a throwaway branch and is exactly what you cannot reconstruct from afterwards. The other number worth carrying is <code>User</code> with 47 relations: in every real schema there is a gravitational centre, the table almost everything joins to, and knowing which one it is tells you where an index matters, where a careless <code>ON DELETE CASCADE</code> reaches, and which table you should never lock during business hours. And note what did NOT change: <code>User</code> is at 47 in both columns, so the growth happened at the edges rather than at the centre, which is what a healthy schema looks like as it grows.',
            'Cột thú vị là cột chênh lệch, chứ không phải một trong hai cột đứng riêng. Chín model mới và mười bốn migration mới đã xuất hiện giữa lúc bài học được viết và hôm nay, và chẳng có gì bất thường ở đó cả — đúng là điều bài học muốn nói. Một lược đồ không phải thứ bạn thiết kế một lần rồi có; nó là thứ lớn lên chừng nào sản phẩm còn lớn, và cơ chế quản nó phải sống sót qua chuyện đó. Đó là toàn bộ lý lẽ cho migration: mỗi thay đổi là một file, có thứ tự, được ghi vào <code>_prisma_migrations</code>, và phát lại được, nên lịch sử của cơ sở dữ liệu vẫn đọc được sau một năm bởi một người không có mặt lúc ấy. <code>prisma db push</code> cho bạn đúng trạng thái cuối cùng ấy mà không có tí lịch sử nào — chấp nhận được với một nhánh dùng xong vứt, và đúng là thứ sau này bạn không dựng lại được. Con số còn lại đáng mang theo là <code>User</code> với 47 quan hệ: trong mọi lược đồ thật đều có một tâm hấp dẫn, cái bảng mà gần như mọi thứ đều nối tới, và biết nó là bảng nào thì bạn biết chỉ mục quan trọng ở đâu, một <code>ON DELETE CASCADE</code> vô ý vươn tới đâu, và cái bảng nào bạn không bao giờ nên khoá vào giờ làm việc. Và để ý thứ KHÔNG đổi: <code>User</code> vẫn 47 ở cả hai cột, nên phần lớn lên nằm ở rìa chứ không ở tâm — đó là dáng vẻ của một lược đồ khoẻ mạnh khi nó lớn lên.',
          ),
        }),

        mcq({
          prompt: B(
            'Production is slow right now. You have a psql session open. Someone in the channel suggests restarting PostgreSQL "to clear whatever is stuck". What is the right sequence, and what is wrong with restarting?',
            'Production đang chậm ngay lúc này. Bạn đang mở sẵn một phiên psql. Có người trong kênh chat đề nghị khởi động lại PostgreSQL "cho nó thông cái gì đang kẹt". Trình tự đúng là gì, và khởi động lại thì sai ở đâu?',
          ),
          options: [
            B('Restart first: it is fast and reversible, and if the symptom returns you will at least know it is not a transient problem — then investigate with a clean baseline. The statistics views survive a restart, so nothing is lost by clearing the live state first, and service comes back for users while you read them', 'Khởi động lại trước: nó nhanh và đảo ngược được, và nếu triệu chứng quay lại thì ít nhất bạn biết đó không phải chuyện thoáng qua — rồi hãy điều tra với một mốc so sánh sạch sẽ. Các khung nhìn thống kê sống sót qua một lần khởi động lại, nên dọn trạng thái đang chạy trước thì chẳng mất gì, mà dịch vụ thì trở lại với người dùng trong lúc bạn đọc chúng'),
            B('Capture state BEFORE changing anything — <code>pg_stat_activity</code>, the top of <code>pg_stat_statements</code>, connection counts — then ask "right now" (a stuck transaction, a lock wait, a connection flood), then "over time" (<code>pg_stat_statements</code> by <code>total_exec_time</code>), and only then open <code>EXPLAIN</code> on the query you have identified. Restarting often restores service, which is exactly the problem: it destroys the evidence while leaving the cause alive', 'Chụp lại trạng thái TRƯỚC khi đổi bất cứ thứ gì — <code>pg_stat_activity</code>, phần đầu của <code>pg_stat_statements</code>, số kết nối — rồi hỏi "ngay lúc này" (một giao dịch đang kẹt, một lần chờ khoá, một trận lụt kết nối), rồi mới hỏi "theo thời gian" (<code>pg_stat_statements</code> sắp theo <code>total_exec_time</code>), và chỉ sau đó mới mở <code>EXPLAIN</code> lên đúng truy vấn bạn đã xác định. Khởi động lại thường khôi phục được dịch vụ, và đó đúng là vấn đề: nó phá huỷ bằng chứng trong khi để nguyên nguyên nhân'),
            B('Start with <code>EXPLAIN ANALYZE</code> on the slowest endpoint, because the query plan is the only thing that can explain a slowdown; the statistics views describe the past and cannot say why anything is slow. Locks, snapshots and connection counts are all visible in the plan as wait nodes, so one <code>EXPLAIN ANALYZE</code> subsumes everything the live views would have told you', 'Hãy bắt đầu bằng <code>EXPLAIN ANALYZE</code> trên endpoint chậm nhất, vì kế hoạch truy vấn là thứ duy nhất giải thích được một lần chậm đi; các khung nhìn thống kê mô tả quá khứ và không nói được vì sao thứ gì chậm. Khoá, ảnh chụp và số kết nối đều hiện ra trong kế hoạch dưới dạng các node chờ, nên một lệnh <code>EXPLAIN ANALYZE</code> bao trọn mọi thứ mà các khung nhìn trực tiếp có thể nói'),
            B('Neither: production diagnosis belongs in the application\'s APM, and querying the database\'s own statistics views during an incident adds load and risks making the outage worse. <code>pg_stat_activity</code> in particular takes a lock on every backend it reports, so reading it while the server is struggling is what turns a slowdown into a stall', 'Không cái nào: việc chẩn đoán production thuộc về hệ APM của ứng dụng, còn truy vấn các khung nhìn thống kê của chính cơ sở dữ liệu giữa sự cố thì thêm tải và có nguy cơ làm sự cố tệ hơn. Riêng <code>pg_stat_activity</code> lấy một khoá trên mọi backend mà nó báo cáo, nên đọc nó lúc máy chủ đang vật lộn chính là thứ biến một lần chậm thành một lần đứng hẳn'),
          ],
          correct: 1,
          explanation: EX(
            'The order matters because each step narrows the next one. <code>pg_stat_activity</code> answers "what is happening this second" — a transaction open for hours, a row of <code>Lock</code> waits, a connection count near the limit — and most incidents end there, which is why it comes first and why <code>EXPLAIN</code> comes last. <code>pg_stat_statements</code> ordered by <code>total_exec_time</code> answers a different question, "what has been expensive", and finds the slow burns the live view cannot show. <code>EXPLAIN ANALYZE</code> is the last step, not the first: starting there is how people spend an hour optimising a query that was never the problem. The restart deserves its own warning because it is so tempting and so often "works". It kills the stuck transaction, drops the leaked connections, and empties <code>pg_stat_activity</code> — so service returns, the cause survives untouched, and it comes back next week with no evidence left about the first occurrence. Sixty seconds of capture is the entire price of not repeating the investigation from zero. Two more habits from the same lesson: reach for the query BEFORE the guess, and remember that the table with the symptom is often not the table with the cause — a session idle in transaction slows a completely unrelated hot table, which is why "which query is slow" can be the wrong first question.',
            'Thứ tự quan trọng vì mỗi bước thu hẹp bước sau. <code>pg_stat_activity</code> trả lời câu "đang xảy ra chuyện gì ngay giây này" — một giao dịch mở suốt mấy tiếng, một loạt lần chờ <code>Lock</code>, số kết nối sát giới hạn — và phần lớn sự cố kết thúc ngay ở đó, nên nó đi trước và <code>EXPLAIN</code> đi sau cùng. <code>pg_stat_statements</code> sắp theo <code>total_exec_time</code> trả lời một câu khác, "cái gì đã tốn kém", và tìm ra những đám cháy âm ỉ mà khung nhìn trực tiếp không cho thấy. <code>EXPLAIN ANALYZE</code> là bước cuối chứ không phải bước đầu: bắt đầu từ đó là cách người ta mất một tiếng tối ưu một truy vấn vốn chưa bao giờ là vấn đề. Việc khởi động lại xứng đáng có riêng một lời cảnh báo vì nó vừa hấp dẫn vừa thường xuyên "ăn". Nó giết chết giao dịch đang kẹt, thả các kết nối bị rò, và dọn sạch <code>pg_stat_activity</code> — nên dịch vụ trở lại, nguyên nhân còn nguyên vẹn, và tuần sau nó quay lại mà không còn bằng chứng nào về lần đầu tiên. Sáu mươi giây chụp lại trạng thái là toàn bộ cái giá của việc không phải điều tra lại từ số không. Thêm hai thói quen từ cùng bài học: hãy với tay lấy truy vấn TRƯỚC khi đưa ra phỏng đoán, và nhớ rằng cái bảng mang triệu chứng thường không phải cái bảng mang nguyên nhân — một phiên idle in transaction làm chậm một bảng nóng chẳng liên quan gì, và vì thế "truy vấn nào chậm" có thể là câu hỏi đầu tiên sai.',
          ),
        }),

        mcq({
          prompt: B(
            'Prisma names things differently, but nothing in it is a different database. Which mapping is stated correctly?',
            'Prisma gọi tên mọi thứ theo cách khác, nhưng không có gì trong nó là một cơ sở dữ liệu khác. Ánh xạ nào được phát biểu đúng?',
          ),
          options: [
            B('<code>include</code> is compiled into a JOIN or a second query, so a loop that fetches related rows per item is the ORM shape of the N+1 problem; <code>@@index([a, b])</code> is a composite index where column order matters exactly as in Chapter 9 — and Prisma will not tell you the order is wrong, <code>EXPLAIN</code> will; and <code>$transaction</code> is <code>BEGIN … COMMIT</code>, with the same isolation levels and the same need for a retry loop if you raise them', '<code>include</code> được dịch thành một phép JOIN hoặc một truy vấn thứ hai, nên một vòng lặp lấy các dòng liên quan cho từng phần tử chính là hình dạng ORM của bài toán N+1; <code>@@index([a, b])</code> là một chỉ mục tổ hợp mà thứ tự cột quan trọng y hệt Chương 9 — và Prisma sẽ không nói cho bạn biết thứ tự sai, <code>EXPLAIN</code> mới nói; còn <code>$transaction</code> là <code>BEGIN … COMMIT</code>, cùng những mức cô lập ấy và cùng nhu cầu có vòng lặp thử lại nếu bạn nâng mức lên'),
            B('<code>@@index([a, b])</code> creates two separate single-column indexes, so the declaration order is purely cosmetic; and <code>include</code> always compiles to a single JOIN, which is why an ORM cannot produce an N+1 pattern; the N+1 shape only appears when you write the second query yourself with raw SQL', '<code>@@index([a, b])</code> tạo ra hai chỉ mục một cột riêng biệt, nên thứ tự khai báo thuần tuý là chuyện hình thức; còn <code>include</code> luôn được dịch thành một phép JOIN duy nhất, và vì thế một ORM không thể sinh ra khuôn mẫu N+1; hình dạng N+1 chỉ xuất hiện khi bạn tự tay viết truy vấn thứ hai bằng SQL thô'),
            B('<code>@id</code> and <code>@unique</code> are validation rules enforced by the client library, so they cost nothing in the database and add no index — which is why lookups by them need an explicit <code>@@index</code>, which is the single most common omission in a schema that was fast in development and slow in production', '<code>@id</code> và <code>@unique</code> là các luật kiểm tra do thư viện client thực thi, nên chúng chẳng tốn gì trong cơ sở dữ liệu và không thêm chỉ mục nào — vì thế tra cứu theo chúng cần một <code>@@index</code> tường minh, và đó là chỗ bị bỏ sót phổ biến nhất trong một lược đồ chạy nhanh lúc phát triển và chậm trên production'),
            B('<code>$transaction</code> runs its statements with each one auto-committed and rolls the batch back in application memory if any fails, which is why it works identically across databases and needs no retry loop at any isolation level, which is the portability the ORM is buying you in exchange for the loss of database-specific features', '<code>$transaction</code> chạy các câu lệnh của nó với từng cái tự commit rồi quay lui cả lô trong bộ nhớ ứng dụng nếu có cái nào hỏng, và vì thế nó chạy y hệt nhau trên mọi cơ sở dữ liệu và không cần vòng lặp thử lại ở bất kỳ mức cô lập nào, và đó là tính khả chuyển mà ORM mua cho bạn để đổi lấy việc mất đi các tính năng riêng của từng cơ sở dữ liệu'),
          ],
          correct: 0,
          explanation: EX(
            'Every Prisma concept is a thin naming layer over something from the previous fifteen chapters, and holding the mapping explicitly is what lets you debug in SQL the moment something goes wrong. <code>model</code> is <code>CREATE TABLE</code>; <code>@id</code> and <code>@unique</code> are PRIMARY KEY and UNIQUE, and each brings a B-tree index with it, which is why lookups by them are already fast and why the third option is wrong twice over. <code>@relation</code> is a foreign key plus the join Prisma writes for you, and <code>onDelete: Cascade</code> is <code>ON DELETE CASCADE</code> — a database-side behaviour with database-side reach, not a client convenience. <code>include</code> becomes either a JOIN or a second query, which is exactly why N+1 survives the move to an ORM: fetch a list, then loop and fetch each item\'s children, and you have written the pattern by hand. <code>@@index([a, b])</code> is a composite index and the leftmost-prefix rule from Chapter 9 applies unchanged, so a filter on <code>b</code> alone cannot seek — and nothing in the schema file will warn you, which is the general lesson: the ORM describes intent, <code>EXPLAIN</code> describes what happens. Finally <code>$transaction</code> is a real transaction with real isolation levels, so raising the level buys the guarantees of Chapter 11 and also inherits its obligation to retry on serialization failure.',
            'Mọi khái niệm của Prisma đều là một lớp đặt tên mỏng phủ lên một thứ có từ mười lăm chương trước, và giữ được ánh xạ ấy trong đầu là thứ cho phép bạn gỡ lỗi bằng SQL ngay khi có chuyện. <code>model</code> là <code>CREATE TABLE</code>; <code>@id</code> và <code>@unique</code> là PRIMARY KEY và UNIQUE, và mỗi cái mang theo một chỉ mục B-tree, và vì thế tra cứu theo chúng vốn đã nhanh, cũng vì thế phương án thứ ba sai tới hai lần. <code>@relation</code> là một khoá ngoại cộng phép nối mà Prisma viết hộ bạn, còn <code>onDelete: Cascade</code> là <code>ON DELETE CASCADE</code> — một hành vi phía cơ sở dữ liệu với tầm với phía cơ sở dữ liệu, không phải một tiện nghi của client. <code>include</code> trở thành hoặc một phép JOIN hoặc một truy vấn thứ hai, và đó đúng là lý do N+1 sống sót qua việc chuyển sang ORM: lấy một danh sách, rồi lặp và lấy các con của từng phần tử, thế là bạn đã tự tay viết ra cái khuôn mẫu ấy. <code>@@index([a, b])</code> là một chỉ mục tổ hợp và luật tiền tố trái ở Chương 9 áp nguyên vẹn, nên lọc riêng theo <code>b</code> thì không tìm kiếm được — và chẳng có gì trong file lược đồ cảnh báo bạn, đó mới là bài học tổng quát: ORM mô tả ý định, còn <code>EXPLAIN</code> mô tả chuyện thật sự xảy ra. Cuối cùng, <code>$transaction</code> là một giao dịch thật với các mức cô lập thật, nên nâng mức lên là mua được những bảo đảm của Chương 11 và cũng thừa hưởng luôn nghĩa vụ thử lại khi gặp lỗi tuần tự hoá.',
          ),
        }),

        mcq({
          prompt: B(
            'A user reports that a change they saved is missing, then it appears a moment later. Intermittent, no errors anywhere, and only since read replicas were introduced. The first query, run on the primary:' + code(
              'SELECT state, sync_state, pg_wal_lsn_diff(sent_lsn, replay_lsn) AS byte_tre\n' +
              '  FROM pg_stat_replication;',
            ) + 'What is this, and what is the fix?',
            'Một người dùng báo rằng thay đổi họ vừa lưu bị mất, rồi một lát sau nó lại hiện ra. Chập chờn, không lỗi ở đâu cả, và chỉ xảy ra từ khi có bản sao chỉ đọc. Truy vấn đầu tiên, chạy trên máy chính:' + code(
              'SELECT state, sync_state, pg_wal_lsn_diff(sent_lsn, replay_lsn) AS byte_tre\n' +
              '  FROM pg_stat_replication;',
            ) + 'Đây là chuyện gì, và cách sửa là gì?',
          ),
          options: [
            B('A lost update: two requests read the same row and the second overwrote the first, which is why the value reappears when the losing write is finally applied. Fix it with <code>SELECT … FOR UPDATE</code> before the write, and note that replicas make it more likely because the losing read came from one of them', 'Một lần lost update: hai yêu cầu cùng đọc một dòng và cái thứ hai ghi đè lên cái thứ nhất, và vì thế giá trị lại hiện ra khi lần ghi thua cuộc rốt cuộc được áp dụng. Hãy sửa bằng <code>SELECT … FOR UPDATE</code> trước khi ghi, và để ý bản sao làm chuyện này dễ xảy ra hơn vì lượt đọc thua cuộc đến từ một trong số chúng'),
            B('A stale materialized view behind the read path; the value appears once the scheduled <code>REFRESH</code> runs, so shorten the refresh interval; a replica cannot be involved because a materialized view is refreshed on the primary and shipped as ordinary WAL', 'Một materialized view cũ nằm sau đường đọc; giá trị hiện ra khi lệnh <code>REFRESH</code> theo lịch chạy, nên hãy rút ngắn khoảng thời gian giữa các lần refresh; bản sao không thể dính dáng vì một materialized view được refresh trên máy chính rồi đi qua như WAL bình thường'),
            B('The replica has fallen out of recovery and is serving its own diverged copy; promote it and re-seed it from a fresh <code>pg_basebackup</code>; the value reappearing later is the replica catching the row from a subsequent full-page write, which is the classic signature of divergence', 'Bản sao đã rơi ra khỏi trạng thái khôi phục và đang phục vụ một bản chép đã phân kỳ của riêng nó; hãy thăng cấp nó rồi gieo lại từ một bản <code>pg_basebackup</code> mới; việc giá trị hiện ra sau đó là bản sao bắt được dòng ấy từ một lần ghi trang đầy đủ về sau, dấu hiệu kinh điển của sự phân kỳ'),
            B('Async replication lag: the write went to the primary and the redirect\'s read was routed to a replica that had not replayed it yet. Nothing is broken — <code>sync_state = async</code> means the primary commits without waiting, which is the default and usually correct. Route reads that follow a write within the SAME user action to the primary, and keep replicas for genuinely independent reads', 'Độ trễ nhân bản bất đồng bộ: lệnh ghi đi tới máy chính còn lượt đọc sau khi chuyển hướng lại được định tuyến tới một bản sao chưa kịp phát lại nó. Chẳng có gì hỏng cả — <code>sync_state = async</code> nghĩa là máy chính commit mà không chờ, đó là mặc định và thường là đúng. Hãy định tuyến những lượt đọc đi ngay sau một lượt ghi trong CÙNG một thao tác của người dùng về máy chính, và để dành bản sao cho những lượt đọc thật sự độc lập'),
          ],
          correct: 3,
          explanation: EX(
            'The shape of the report is the diagnosis: intermittent, self-healing, no errors, and it started when replicas did. Asynchronous replication means the primary commits as soon as its own WAL is durable and does not wait for any replica to confirm — usually the right trade, because waiting turns every commit into a network round trip and makes a slow replica into a slow primary. The cost is a lag window, normally milliseconds, and read-after-write is the one user-visible thing that fits inside it: the form POSTs to the primary, the redirect GETs from a replica, and the replica is 12 ms behind. The query above is how you confirm rather than guess — <code>sync_state</code> tells you whether waiting was ever promised, and <code>pg_wal_lsn_diff(sent_lsn, replay_lsn)</code> puts a number on how far behind each replica is. The fix is routing, not configuration: reads that belong to the same user action as a write go to the primary; reports, dashboards, exports and <code>pg_dump</code> go to replicas, because none of them cares about the last 12 milliseconds. Making the replica synchronous would also fix it and is almost always the wrong trade — you would slow every write on the site to fix one redirect.',
            'Chính hình dạng của lời báo cáo đã là chẩn đoán: chập chờn, tự khỏi, không lỗi, và bắt đầu đúng lúc có bản sao. Nhân bản bất đồng bộ nghĩa là máy chính commit ngay khi WAL của chính nó đã bền vững chứ không chờ bản sao nào xác nhận — thường là đánh đổi đúng, vì chờ đợi biến mỗi lần commit thành một vòng đi-về qua mạng và biến một bản sao chậm thành một máy chính chậm. Cái giá là một cửa sổ trễ, thường vài mili giây, và đọc-sau-khi-ghi là thứ duy nhất người dùng nhìn thấy được lọt vừa vào cửa sổ ấy: biểu mẫu POST lên máy chính, lần chuyển hướng GET từ một bản sao, và bản sao đang trễ 12 ms. Truy vấn ở trên là cách bạn xác nhận thay vì phỏng đoán — <code>sync_state</code> cho biết có bao giờ hứa chờ hay không, còn <code>pg_wal_lsn_diff(sent_lsn, replay_lsn)</code> đặt một con số lên mức trễ của từng bản sao. Cách sửa là định tuyến chứ không phải cấu hình: những lượt đọc thuộc cùng một thao tác người dùng với một lượt ghi thì đi về máy chính; báo cáo, bảng điều khiển, xuất dữ liệu và <code>pg_dump</code> thì đi tới bản sao, vì chẳng cái nào trong số đó quan tâm tới 12 mili giây cuối. Chuyển bản sao sang đồng bộ cũng chữa được và gần như luôn là đánh đổi sai — bạn sẽ làm chậm mọi lượt ghi của cả trang web để sửa đúng một lần chuyển hướng.',
          ),
        }),

        codeQ({
          points: 5,
          prompt: B(
            "<p><b>Q31 — Be the jsonb engine (chapter 13).</b> Every JSONB bug in this chapter comes from one of four semantics: how a document is normalised, what <code>-&gt;</code> returns versus <code>-&gt;&gt;</code>, what containment actually tests, and what the existence operator looks at. Implement all four in plain JavaScript over the documents given — no database, no libraries. Every expected line was measured against PostgreSQL 16.14 first.</p><ul><li><code>chuanHoa(raw)</code> — return the canonical jsonb TEXT of the document, exactly as psql prints it: <code>\": \"</code> after each key, <code>\", \"</code> between items, duplicate keys resolved LAST-ONE-WINS, and object keys ordered by LENGTH first and only then by byte value (so <code>a, z, aa, bb, ccc</code>). Recurse into nested objects and arrays; array order is preserved.</li><li><code>mui(raw, key)</code> — the <code>-&gt;</code> operator: return the canonical jsonb text of the value, so a string keeps its quotes and a JSON null prints as <code>null</code>. A key that is ABSENT returns JavaScript <code>null</code>, standing for SQL NULL.</li><li><code>muiKep(raw, key)</code> — the <code>-&gt;&gt;</code> operator: return bare <code>text</code>. A string loses its quotes; an object or array comes back as its jsonb text. Both an ABSENT key and a JSON <code>null</code> value return <code>null</code> — that collapse is the point of the exercise.</li><li><code>chua(a, b)</code> — the <code>@&gt;</code> operator: does the left document contain everything the right one specifies? Recurse into objects and arrays, ignore keys the right side did not mention, treat array order as irrelevant, accept a bare scalar as contained in a top-level array, and be TYPE-STRICT (the number 1 does not contain the string \"1\"). Nesting is not flattened.</li><li><code>tonTai(raw, key)</code> — the <code>?</code> operator: on an object it tests KEY existence (true even when the value is JSON null); on an array it tests whether that STRING is an element. It never looks inside nested structures.</li></ul><p>Keep the given data and the printing loop exactly as they are.</p>",

            "<p><b>Câu 31 — Hãy làm bộ máy jsonb (chương 13).</b> Mọi lỗi JSONB trong chương này đều đến từ một trong bốn thứ ngữ nghĩa: tài liệu được chuẩn hoá thế nào, <code>-&gt;</code> trả về gì so với <code>-&gt;&gt;</code>, phép chứa thật ra kiểm cái gì, và toán tử tồn tại nhìn vào đâu. Hãy cài đặt cả bốn bằng JavaScript thuần trên các tài liệu cho sẵn — không cơ sở dữ liệu, không thư viện. Mọi dòng kết quả mong đợi đều đã được đo trên PostgreSQL 16.14 trước.</p><ul><li><code>chuanHoa(raw)</code> — trả về VĂN BẢN jsonb chuẩn tắc của tài liệu, đúng như psql in ra: <code>\": \"</code> sau mỗi khoá, <code>\", \"</code> giữa các mục, khoá trùng thì CÁI SAU THẮNG, và khoá của đối tượng được sắp theo ĐỘ DÀI trước rồi mới theo giá trị byte (nên ra <code>a, z, aa, bb, ccc</code>). Hãy đi đệ quy vào đối tượng và mảng lồng nhau; thứ tự phần tử mảng thì giữ nguyên.</li><li><code>mui(raw, key)</code> — toán tử <code>-&gt;</code>: trả về văn bản jsonb chuẩn tắc của giá trị, nên một chuỗi vẫn còn nguyên dấu nháy và một null của JSON in ra là <code>null</code>. Một khoá KHÔNG TỒN TẠI thì trả <code>null</code> của JavaScript, đại diện cho NULL của SQL.</li><li><code>muiKep(raw, key)</code> — toán tử <code>-&gt;&gt;</code>: trả về <code>text</code> trần. Chuỗi mất dấu nháy; đối tượng hay mảng thì quay ra dưới dạng văn bản jsonb của nó. Cả khoá KHÔNG TỒN TẠI lẫn giá trị <code>null</code> của JSON đều trả <code>null</code> — chính chỗ gộp đó mới là điều bài này muốn bạn thấy.</li><li><code>chua(a, b)</code> — toán tử <code>@&gt;</code>: tài liệu bên trái có chứa mọi thứ bên phải nêu ra không? Hãy đi đệ quy vào đối tượng và mảng, phớt lờ những khoá bên phải không nhắc tới, coi thứ tự phần tử mảng là không quan trọng, chấp nhận một giá trị vô hướng trần là được chứa trong một mảng ở tầng ngoài, và CHẶT VỀ KIỂU (số 1 không chứa chuỗi \"1\"). Việc lồng nhau không bị làm phẳng.</li><li><code>tonTai(raw, key)</code> — toán tử <code>?</code>: trên một đối tượng nó kiểm sự tồn tại của KHOÁ (đúng cả khi giá trị là null của JSON); trên một mảng nó kiểm xem CHUỖI đó có phải một phần tử không. Nó không bao giờ nhìn vào các cấu trúc lồng bên trong.</li></ul><p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>",
          ),
          language: 'javascript',
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "// Năm tài liệu. d1 có khoá TRÙNG; d2 để thử thứ tự khoá; d4 có một giá trị\n" +
            "// null của JSON bên cạnh một khoá bình thường; d5 là một MẢNG ở tầng ngoài.\n" +
            "const DOCS = {\n" +
            "  d1: '{\"b\":1,\"a\":2,\"a\":3}',\n" +
            "  d2: '{\"bb\":1,\"a\":2,\"ccc\":3,\"z\":4,\"aa\":5}',\n" +
            "  d3: '{\"brand\":\"Acme\",\"tags\":[\"x\",\"y\"],\"specs\":{\"ram\":8}}',\n" +
            "  d4: '{\"price\":null,\"ten\":\"hop\"}',\n" +
            "  d5: '[\"x\",\"y\"]',\n" +
            "};\n" +
            "\n" +
            "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
            "function chuanHoa(raw) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function mui(raw, key) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function muiKep(raw, key) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function chua(a, b) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function tonTai(raw, key) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "const v = (x) => (x === null ? '(NULL)' : x);\n" +
            "const T = (b) => (b ? 't' : 'f');\n" +
            "for (const ten of ['d1', 'd2', 'd3', 'd5']) console.log('CHUAN ' + ten + ' -> ' + chuanHoa(DOCS[ten]));\n" +
            "for (const [ten, key] of [['d3', 'brand'], ['d3', 'specs'], ['d3', 'tags'], ['d4', 'price'], ['d4', 'ten'], ['d4', 'zzz']]) {\n" +
            "  console.log('MUI ' + ten + '.' + key.padEnd(5) + ' -> ' + v(mui(DOCS[ten], key)).padEnd(12) + ' MUIKEP -> ' + v(muiKep(DOCS[ten], key)));\n" +
            "}\n" +
            "const CA = [\n" +
            "  ['{\"a\":1,\"b\":2}', '{\"a\":1}'], ['{\"a\":1}', '{\"a\":1,\"b\":2}'],\n" +
            "  ['{\"tags\":[\"x\",\"y\"]}', '{\"tags\":[\"x\"]}'], ['[\"x\",\"y\"]', '\"x\"'],\n" +
            "  ['[\"x\",\"y\"]', '[\"y\",\"x\"]'], ['{\"a\":1}', '{}'],\n" +
            "  ['{\"a\":1}', '{\"a\":\"1\"}'], ['[\"x\"]', '[[\"x\"]]'],\n" +
            "  ['d3', '{\"specs\":{\"ram\":8}}'], ['d3', '{\"specs\":{\"ram\":8,\"cpu\":\"m1\"}}'],\n" +
            "];\n" +
            "for (const [a, b] of CA) console.log('CHUA ' + a.padEnd(19) + ' @> ' + b.padEnd(26) + ' -> ' + T(chua(DOCS[a] || a, b)));\n" +
            "for (const [ten, key] of [['d3', 'brand'], ['d3', 'x'], ['d4', 'price'], ['d5', 'x'], ['d5', 'z']]) {\n" +
            "  console.log('TONTAI ' + ten + ' ? ' + key.padEnd(5) + ' -> ' + T(tonTai(DOCS[ten], key)));\n" +
            "}\n",
          expectedOutput:
            "CHUAN d1 -> {\"a\": 3, \"b\": 1}\n" +
            "CHUAN d2 -> {\"a\": 2, \"z\": 4, \"aa\": 5, \"bb\": 1, \"ccc\": 3}\n" +
            "CHUAN d3 -> {\"tags\": [\"x\", \"y\"], \"brand\": \"Acme\", \"specs\": {\"ram\": 8}}\n" +
            "CHUAN d5 -> [\"x\", \"y\"]\n" +
            "MUI d3.brand -> \"Acme\"       MUIKEP -> Acme\n" +
            "MUI d3.specs -> {\"ram\": 8}   MUIKEP -> {\"ram\": 8}\n" +
            "MUI d3.tags  -> [\"x\", \"y\"]   MUIKEP -> [\"x\", \"y\"]\n" +
            "MUI d4.price -> null         MUIKEP -> (NULL)\n" +
            "MUI d4.ten   -> \"hop\"        MUIKEP -> hop\n" +
            "MUI d4.zzz   -> (NULL)       MUIKEP -> (NULL)\n" +
            "CHUA {\"a\":1,\"b\":2}       @> {\"a\":1}                    -> t\n" +
            "CHUA {\"a\":1}             @> {\"a\":1,\"b\":2}              -> f\n" +
            "CHUA {\"tags\":[\"x\",\"y\"]}  @> {\"tags\":[\"x\"]}             -> t\n" +
            "CHUA [\"x\",\"y\"]           @> \"x\"                        -> t\n" +
            "CHUA [\"x\",\"y\"]           @> [\"y\",\"x\"]                  -> t\n" +
            "CHUA {\"a\":1}             @> {}                         -> t\n" +
            "CHUA {\"a\":1}             @> {\"a\":\"1\"}                  -> f\n" +
            "CHUA [\"x\"]               @> [[\"x\"]]                    -> f\n" +
            "CHUA d3                  @> {\"specs\":{\"ram\":8}}        -> t\n" +
            "CHUA d3                  @> {\"specs\":{\"ram\":8,\"cpu\":\"m1\"}} -> f\n" +
            "TONTAI d3 ? brand -> t\n" +
            "TONTAI d3 ? x     -> f\n" +
            "TONTAI d4 ? price -> t\n" +
            "TONTAI d5 ? x     -> t\n" +
            "TONTAI d5 ? z     -> f\n",
          sampleSolution:
            "// jsonb sắp khoá theo ĐỘ DÀI trước, rồi mới theo byte — không phải bảng chữ cái.\n" +
            "const sapKhoa = (a, b) => (a.length - b.length) || (a < b ? -1 : a > b ? 1 : 0);\n" +
            "\n" +
            "// Vẽ lại đúng như psql in một giá trị jsonb: '\": \"' và '\", \"'.\n" +
            "function ve(x) {\n" +
            "  if (x === null) return 'null';\n" +
            "  if (Array.isArray(x)) return '[' + x.map(ve).join(', ') + ']';\n" +
            "  if (typeof x === 'object') {\n" +
            "    return '{' + Object.keys(x).sort(sapKhoa).map((k) => JSON.stringify(k) + ': ' + ve(x[k])).join(', ') + '}';\n" +
            "  }\n" +
            "  return JSON.stringify(x);\n" +
            "}\n" +
            "\n" +
            "// JSON.parse đã giải quyết khoá trùng theo luật \"cái sau thắng\", y như jsonb.\n" +
            "const chuanHoa = (raw) => ve(JSON.parse(raw));\n" +
            "\n" +
            "// -> ở lại trong JSON: trả về VĂN BẢN jsonb của giá trị, chuỗi thì còn nguyên nháy.\n" +
            "function mui(raw, key) {\n" +
            "  const o = JSON.parse(raw);\n" +
            "  if (!Object.prototype.hasOwnProperty.call(o, key)) return null;   // khoá vắng ⇒ NULL của SQL\n" +
            "  return ve(o[key]);\n" +
            "}\n" +
            "\n" +
            "// ->> rút ra text. Khoá vắng VÀ giá trị null của JSON đều cho NULL của SQL.\n" +
            "function muiKep(raw, key) {\n" +
            "  const o = JSON.parse(raw);\n" +
            "  if (!Object.prototype.hasOwnProperty.call(o, key)) return null;\n" +
            "  const x = o[key];\n" +
            "  if (x === null) return null;\n" +
            "  if (typeof x === 'string') return x;      // chuỗi ra trần, không còn nháy\n" +
            "  return ve(x);                             // số / mảng / đối tượng ra dạng jsonb\n" +
            "}\n" +
            "\n" +
            "// @> là phép kiểm TẬP CON, đệ quy, và CHẶT VỀ KIỂU.\n" +
            "function chuaGiaTri(a, b) {\n" +
            "  if (Array.isArray(a)) {\n" +
            "    // mảng chứa mảng: mọi phần tử bên phải phải khớp một phần tử bên trái (thứ tự không tính)\n" +
            "    if (Array.isArray(b)) return b.every((x) => a.some((y) => chuaGiaTri(y, x)));\n" +
            "    // ca đặc biệt: mảng ở tầng ngoài chứa được một giá trị vô hướng trần\n" +
            "    return a.some((y) => chuaGiaTri(y, b));\n" +
            "  }\n" +
            "  if (a !== null && typeof a === 'object') {\n" +
            "    if (b === null || typeof b !== 'object' || Array.isArray(b)) return false;\n" +
            "    return Object.keys(b).every((k) => Object.prototype.hasOwnProperty.call(a, k) && chuaGiaTri(a[k], b[k]));\n" +
            "  }\n" +
            "  if (b !== null && typeof b === 'object') return false;\n" +
            "  return a === b;                            // 1 !== '1' ⇒ số không chứa chuỗi\n" +
            "}\n" +
            "const chua = (a, b) => chuaGiaTri(JSON.parse(a), JSON.parse(b));\n" +
            "\n" +
            "// ? kiểm KHOÁ trên đối tượng, PHẦN TỬ trên mảng, và không nhìn vào tầng lồng.\n" +
            "function tonTai(raw, key) {\n" +
            "  const o = JSON.parse(raw);\n" +
            "  if (Array.isArray(o)) return o.some((x) => x === key);\n" +
            "  if (o !== null && typeof o === 'object') return Object.prototype.hasOwnProperty.call(o, key);\n" +
            "  return o === key;\n" +
            "}\n",
        }),

        codeQ({
          points: 5,
          prompt: B(
            "<p><b>Q32 — Be the partition router and the pruner (chapter 15).</b> Range partitioning is two mechanisms: at write time a row is ROUTED to exactly one partition, and at plan time partitions that cannot hold a match are PRUNED away. Implement both in plain JavaScript. Every expected line was measured against a real partitioned table on PostgreSQL 16.14 first (routing read from <code>tableoid::regclass</code>, pruning read from <code>EXPLAIN</code>).</p><ul><li><code>dinhTuyen(luc)</code> — which partition takes this row? The declared range is HALF-OPEN: <code>FROM</code> is inclusive and <code>TO</code> is exclusive. Return the name, or JavaScript <code>null</code> when no partition accepts it — which on a real table is the refusal <code>no partition of relation … found for row</code>.</li><li><code>dinhTuyenCoDefault(luc)</code> — the same, with a DEFAULT partition attached as a safety net: anything no declared range claims goes to <code>MANH_MAC_DINH</code>.</li><li><code>catTia(tu, den)</code> — for <code>WHERE luc &gt;= tu AND luc &lt; den</code>, return the names of the partitions the plan must scan, in declaration order. Keep a partition when its range OVERLAPS the query range; an empty query range scans nothing.</li><li><code>catTiaBang(luc)</code> — the same for <code>WHERE luc = luc</code>: one partition, or none.</li><li><code>quetHet()</code> — what a filter on a column that is NOT the partition key must scan.</li><li><code>coTheXoa(truoc)</code> — a retention policy keeps nothing older than <code>truoc</code>. Return the partitions that can be removed with <code>DROP TABLE</code>: only those lying ENTIRELY before the cut.</li></ul><p>Dates are <code>YYYY-MM-DD</code> strings, so string comparison is date comparison. Keep the given data and the printing loop exactly as they are.</p>",

            "<p><b>Câu 32 — Hãy làm bộ định tuyến mảnh và bộ cắt tỉa (chương 15).</b> Phân mảnh theo khoảng là hai cơ chế: lúc ghi, một dòng được ĐỊNH TUYẾN về đúng một mảnh; lúc lập kế hoạch, những mảnh không thể chứa dòng khớp bị CẮT TỈA đi. Hãy cài đặt cả hai bằng JavaScript thuần. Mọi dòng kết quả mong đợi đều đã được đo trên một bảng phân mảnh thật ở PostgreSQL 16.14 trước (phần định tuyến đọc từ <code>tableoid::regclass</code>, phần cắt tỉa đọc từ <code>EXPLAIN</code>).</p><ul><li><code>dinhTuyen(luc)</code> — mảnh nào nhận dòng này? Khoảng khai báo là NỬA MỞ: <code>FROM</code> tính vào còn <code>TO</code> thì không. Trả về tên mảnh, hoặc <code>null</code> của JavaScript khi không mảnh nào nhận — trên một bảng thật thì đó là lời từ chối <code>no partition of relation … found for row</code>.</li><li><code>dinhTuyenCoDefault(luc)</code> — vẫn thế, nhưng có gắn thêm một mảnh DEFAULT làm lưới đỡ: thứ gì không khoảng nào khai nhận thì về <code>MANH_MAC_DINH</code>.</li><li><code>catTia(tu, den)</code> — với <code>WHERE luc &gt;= tu AND luc &lt; den</code>, trả về tên những mảnh mà kế hoạch buộc phải quét, theo thứ tự khai báo. Giữ lại một mảnh khi khoảng của nó GIAO với khoảng truy vấn; một khoảng truy vấn rỗng thì không quét mảnh nào.</li><li><code>catTiaBang(luc)</code> — vẫn thế nhưng cho <code>WHERE luc = luc</code>: một mảnh, hoặc không mảnh nào.</li><li><code>quetHet()</code> — thứ mà một bộ lọc trên cột KHÔNG phải khoá phân mảnh buộc phải quét.</li><li><code>coTheXoa(truoc)</code> — một chính sách lưu giữ không giữ gì cũ hơn mốc <code>truoc</code>. Trả về những mảnh gỡ được bằng <code>DROP TABLE</code>: chỉ những mảnh nằm TRỌN VẸN trước mốc.</li></ul><p>Ngày ở dạng chuỗi <code>YYYY-MM-DD</code> nên so sánh chuỗi chính là so sánh ngày. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>",
          ),
          language: 'javascript',
          starterCode:
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "// Ba mảnh theo tháng, khai đúng như PostgreSQL: FROM tính vào, TO thì không.\n" +
            "// Ngày ở dạng 'YYYY-MM-DD' nên so sánh chuỗi cũng chính là so sánh ngày.\n" +
            "const MANH = [\n" +
            "  { ten: 'ev_p_06', tu: '2026-06-01', den: '2026-07-01' },\n" +
            "  { ten: 'ev_p_07', tu: '2026-07-01', den: '2026-08-01' },\n" +
            "  { ten: 'ev_p_08', tu: '2026-08-01', den: '2026-09-01' },\n" +
            "];\n" +
            "const MANH_MAC_DINH = 'ev_p_def';\n" +
            "\n" +
            "// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n" +
            "function dinhTuyen(luc) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function dinhTuyenCoDefault(luc) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function catTia(tu, den) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function catTiaBang(luc) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function quetHet() {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "function coTheXoa(truoc) {\n" +
            "  // TODO\n" +
            "}\n" +
            "\n" +
            "// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n" +
            "const ve = (a) => (a.length ? a.join(',') : '(khong manh nao)');\n" +
            "for (const d of ['2026-05-31', '2026-06-01', '2026-06-30', '2026-07-01', '2026-08-31', '2026-09-01']) {\n" +
            "  console.log('TUYEN  ' + d + ' -> ' + (dinhTuyen(d) === null ? 'ERROR: no partition found' : dinhTuyen(d)).padEnd(26)\n" +
            "    + ' co DEFAULT -> ' + dinhTuyenCoDefault(d));\n" +
            "}\n" +
            "const KHOANG = [\n" +
            "  ['2026-08-01', '2026-09-01'], ['2026-07-15', '2026-08-15'], ['2026-06-01', '2026-07-01'],\n" +
            "  ['2026-06-15', '2026-07-01'], ['2026-01-01', '2026-06-02'], ['2026-08-20', '2027-03-01'],\n" +
            "  ['2026-06-01', '2026-09-01'], ['2027-01-01', '2027-02-01'], ['2026-07-01', '2026-07-01'],\n" +
            "];\n" +
            "for (const [a, b] of KHOANG) console.log('CATTIA ' + a + ' .. ' + b + ' -> ' + ve(catTia(a, b)));\n" +
            "for (const d of ['2026-07-15', '2026-09-01']) console.log('BANG   ' + d + ' -> ' + ve(catTiaBang(d)));\n" +
            "console.log('KHONG THEO KHOA -> ' + ve(quetHet()));\n" +
            "for (const d of ['2026-06-01', '2026-07-01', '2026-08-01', '2027-01-01']) {\n" +
            "  console.log('XOA DUOC truoc ' + d + ' -> ' + ve(coTheXoa(d)));\n" +
            "}\n",
          expectedOutput:
            "TUYEN  2026-05-31 -> ERROR: no partition found  co DEFAULT -> ev_p_def\n" +
            "TUYEN  2026-06-01 -> ev_p_06                    co DEFAULT -> ev_p_06\n" +
            "TUYEN  2026-06-30 -> ev_p_06                    co DEFAULT -> ev_p_06\n" +
            "TUYEN  2026-07-01 -> ev_p_07                    co DEFAULT -> ev_p_07\n" +
            "TUYEN  2026-08-31 -> ev_p_08                    co DEFAULT -> ev_p_08\n" +
            "TUYEN  2026-09-01 -> ERROR: no partition found  co DEFAULT -> ev_p_def\n" +
            "CATTIA 2026-08-01 .. 2026-09-01 -> ev_p_08\n" +
            "CATTIA 2026-07-15 .. 2026-08-15 -> ev_p_07,ev_p_08\n" +
            "CATTIA 2026-06-01 .. 2026-07-01 -> ev_p_06\n" +
            "CATTIA 2026-06-15 .. 2026-07-01 -> ev_p_06\n" +
            "CATTIA 2026-01-01 .. 2026-06-02 -> ev_p_06\n" +
            "CATTIA 2026-08-20 .. 2027-03-01 -> ev_p_08\n" +
            "CATTIA 2026-06-01 .. 2026-09-01 -> ev_p_06,ev_p_07,ev_p_08\n" +
            "CATTIA 2027-01-01 .. 2027-02-01 -> (khong manh nao)\n" +
            "CATTIA 2026-07-01 .. 2026-07-01 -> (khong manh nao)\n" +
            "BANG   2026-07-15 -> ev_p_07\n" +
            "BANG   2026-09-01 -> (khong manh nao)\n" +
            "KHONG THEO KHOA -> ev_p_06,ev_p_07,ev_p_08\n" +
            "XOA DUOC truoc 2026-06-01 -> (khong manh nao)\n" +
            "XOA DUOC truoc 2026-07-01 -> ev_p_06\n" +
            "XOA DUOC truoc 2026-08-01 -> ev_p_06,ev_p_07\n" +
            "XOA DUOC truoc 2027-01-01 -> ev_p_06,ev_p_07,ev_p_08\n",
          sampleSolution:
            "// Một dòng thuộc mảnh nào: khoảng NỬA MỞ [tu, den) — biên trên KHÔNG tính vào,\n" +
            "// nên 2026-07-01 rơi vào mảnh tháng Bảy chứ không phải tháng Sáu.\n" +
            "function dinhTuyen(luc) {\n" +
            "  const m = MANH.find((p) => luc >= p.tu && luc < p.den);\n" +
            "  return m ? m.ten : null;          // không mảnh nào nhận ⇒ PostgreSQL từ chối cả dòng\n" +
            "}\n" +
            "\n" +
            "// Mảnh DEFAULT là lưới đỡ: nó nhận mọi thứ không mảnh nào khai nhận.\n" +
            "function dinhTuyenCoDefault(luc) {\n" +
            "  const t = dinhTuyen(luc);\n" +
            "  return t === null ? MANH_MAC_DINH : t;\n" +
            "}\n" +
            "\n" +
            "// Cắt tỉa: giữ lại mảnh nào có khoảng GIAO với [tu, den). Hai khoảng nửa mở\n" +
            "// giao nhau khi p.tu < den và tu < p.den — dùng '<' chứ không phải '<=', nếu\n" +
            "// không thì một truy vấn dừng đúng ở biên sẽ kéo theo mảnh kế tiếp.\n" +
            "function catTia(tu, den) {\n" +
            "  if (tu >= den) return [];         // khoảng rỗng ⇒ One-Time Filter: false\n" +
            "  return MANH.filter((p) => p.tu < den && tu < p.den).map((p) => p.ten);\n" +
            "}\n" +
            "\n" +
            "// Lọc BẰNG trên khoá phân mảnh rút về đúng một mảnh — hoặc không mảnh nào.\n" +
            "function catTiaBang(luc) {\n" +
            "  const t = dinhTuyen(luc);\n" +
            "  return t === null ? [] : [t];\n" +
            "}\n" +
            "\n" +
            "// Lọc theo cột KHÔNG phải khoá phân mảnh: bộ lập kế hoạch không suy ra được gì\n" +
            "// về khoá, nên mọi mảnh đều bị quét — chậm hơn một bảng không phân mảnh.\n" +
            "function quetHet() {\n" +
            "  return MANH.map((p) => p.ten);\n" +
            "}\n" +
            "\n" +
            "// Chính sách lưu giữ: chỉ mảnh nào nằm TRỌN trước mốc mới DROP được.\n" +
            "function coTheXoa(truoc) {\n" +
            "  return MANH.filter((p) => p.den <= truoc).map((p) => p.ten);\n" +
            "}\n",
        }),
      ],
    },
  ],
};
