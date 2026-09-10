/**
 * PostgreSQL — Progress Test 2 (Chương 6 → Chương 11).
 *
 * Đề tự soạn, bám sát `content/courses/postgresql/s06-tong-hop.mjs` …
 * `s11-giao-dich.mjs`. 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong
 * phòng thi.
 *
 * ⚠️ MỌI kết quả truy vấn, MỌI kế hoạch EXPLAIN, MỌI thông báo lỗi trong đề này
 * đều được ĐO THẬT trên một container PostgreSQL nháp dựng riêng cho việc soạn
 * đề (KHÔNG đụng vào `cuonghoangdev_db` lẫn DB local cổng 5433 của dự án):
 *
 *     PostgreSQL 16.14 (Debian 16.14-1.pgdg13+1) on aarch64-unknown-linux-gnu
 *     docker run -d --name pgpt-nhap -p 55439:5432 postgres:16    (đã docker rm -f)
 *
 * Các phép đo hai phiên (lost update, deadlock, SKIP LOCKED, mức cô lập) chạy
 * bằng hai tiến trình psql song song, đồng bộ bằng `pg_sleep`.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BỐN CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026, PostgreSQL 16.14)
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. Chương 9 và 10 in kế hoạch dạng `Seq Scan on event` / `Seq Scan on ord`
 *    một tầng. Trên PostgreSQL 16 với bảng 500.000 dòng / 65 MB, cùng những
 *    truy vấn ấy ra kế hoạch SONG SONG: `Gather` → `Parallel Seq Scan`,
 *    `Workers Planned: 2`. Hệ quả đọc plan: `Rows Removed by Filter` và
 *    `actual rows` là số của MỘT worker (166.666), KHÔNG phải tổng (499.999) —
 *    phải nhân với `loops`. Câu 22 hỏi đúng chỗ này.
 *
 * 2. Bài 9.2 nói một truy vấn lọc trên cột THỨ HAI của chỉ mục tổ hợp
 *    `(user_id, created_at)` sẽ "quay về Seq Scan". Đo thật trên 16.14: nó
 *    KHÔNG quay về Seq Scan mà làm một `Index Scan using big_uc` QUÉT TOÀN BỘ
 *    chỉ mục (cost 0.42..11466.43 so với 10909 của seq scan), vì chỉ mục hẹp
 *    hơn bảng. Luật tiền tố trái vẫn đúng — nó không TÌM KIẾM được, chỉ quét —
 *    nhưng cái tên node trong plan thì khác giáo trình.
 *
 * 3. Bài 9.2 in `Index Only Scan … Heap Fetches: 0` ngay sau khi tạo chỉ mục
 *    `INCLUDE`. Đo thật: ngay sau khi nạp dữ liệu, cùng truy vấn ấy ra
 *    `Bitmap Heap Scan`; chỉ SAU `VACUUM` nó mới thành `Index Only Scan` với
 *    `Heap Fetches: 0`. Lý do là bản đồ hiển thị (visibility map) chỉ được
 *    VACUUM đánh dấu. Câu 17 hỏi đúng chỗ này.
 *
 * 4. Bài 11.3 in `DETAIL: Reason code: Canceled on identification as a pivot,
 *    during commit attempt.` Lần đo này máy trả `… during write.` — cùng
 *    SQLSTATE 40001, cùng HINT "The transaction might succeed if retried",
 *    chỉ khác chỗ PostgreSQL phát hiện ra chu trình. Đề không hỏi vào chữ đó.
 *
 * ⚠️ Đề KHÔNG hỏi bất kỳ SỐ ĐO THỜI GIAN nào: máy soạn đề chạy nhiều việc song
 * song nên `Execution Time` không tái hiện được. Mọi câu về hiệu năng hỏi CƠ
 * CHẾ (node nào, buffer bao nhiêu, vì sao chọn plan đó).
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh trong đề bài):
 *     { '0': 7, '1': 8, '2': 8, '3': 7 }   → A 7 · B 8 · C 8 · D 7
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/POSTGRESQL-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/postgresql-exam-kit.mjs';

export default {
  course: { slug: 'postgresql' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 6–11 (aggregation, subqueries, windows, indexes, EXPLAIN, transactions)',
        'Kiểm tra tiến độ 2 — Chương 6–11 (tổng hợp, subquery, hàm cửa sổ, chỉ mục, EXPLAIN, giao dịch)',
      ),
      description: B(
        'The middle third of the PostgreSQL course: folding rows into summaries with GROUP BY and HAVING, subqueries and CTEs, window functions that keep every row, what an index really is and when the planner ignores one, reading a query plan, and everything that goes wrong when two sessions write at once. 30 multiple-choice questions plus 2 programming questions you write here in the exam room.',
        'Một phần ba giữa của khoá PostgreSQL: gộp dòng thành bản tóm tắt bằng GROUP BY và HAVING, subquery và CTE, hàm cửa sổ giữ lại mọi dòng, chỉ mục thật ra là gì và khi nào bộ lập kế hoạch phớt lờ nó, đọc một kế hoạch truy vấn, và mọi thứ hỏng khi hai phiên cùng ghi. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '6–11'),
      questions: [
        // ── Chương 6 — Tổng hợp & gom nhóm ──────────────────────────────
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. The first statement is an error; the second is not:' + code(
              'SELECT tag, views FROM note GROUP BY tag;\n' +
              'ERROR:  column "note.views" must appear in the GROUP BY clause\n' +
              '        or be used in an aggregate function\n' +
              '\n' +
              'SELECT u.id, u.name, count(n.id)\n' +
              '  FROM app_user u LEFT JOIN note n ON n.user_id = u.id\n' +
              '  GROUP BY u.id;                    -- u.name is NOT in the GROUP BY, and this works',
            ) + 'Why is the second one legal?',
            'Đo trên PostgreSQL 16.14. Câu đầu là lỗi; câu sau thì không:' + code(
              'SELECT tag, views FROM note GROUP BY tag;\n' +
              'ERROR:  column "note.views" must appear in the GROUP BY clause\n' +
              '        or be used in an aggregate function\n' +
              '\n' +
              'SELECT u.id, u.name, count(n.id)\n' +
              '  FROM app_user u LEFT JOIN note n ON n.user_id = u.id\n' +
              '  GROUP BY u.id;                    -- u.name KHÔNG có trong GROUP BY, mà vẫn chạy',
            ) + 'Vì sao câu thứ hai hợp lệ?',
          ),
          options: [
            B('Because the second query has a JOIN, and PostgreSQL relaxes the rule for joined queries by picking the value from the driving table', 'Vì câu thứ hai có JOIN, và PostgreSQL nới lỏng luật cho các truy vấn có nối bằng cách lấy giá trị từ bảng dẫn dắt'),
            B('Because <code>u.name</code> appears before the aggregate in the select list, and only columns after an aggregate must be grouped', 'Vì <code>u.name</code> đứng trước hàm tổng hợp trong danh sách chọn, và chỉ những cột đứng sau một hàm tổng hợp mới phải được gom nhóm'),
            B('Because the group key is the PRIMARY KEY of <code>app_user</code>: one <code>u.id</code> can only have one <code>u.name</code>, so the value is functionally dependent on the group and unambiguous. PostgreSQL knows this and allows it', 'Vì khoá gom nhóm là KHOÁ CHÍNH của <code>app_user</code>: một <code>u.id</code> chỉ có thể có một <code>u.name</code>, nên giá trị đó phụ thuộc hàm vào nhóm và không nhập nhằng. PostgreSQL biết điều này và cho phép'),
            B('Because <code>count()</code> is the only aggregate that does not impose the grouping rule; change it to <code>sum()</code> and the second query fails as well', 'Vì <code>count()</code> là hàm tổng hợp duy nhất không áp luật gom nhóm; đổi nó thành <code>sum()</code> thì câu thứ hai cũng hỏng'),
          ],
          correct: 2,
          explanation: EX(
            'Read the error as a question, not a punishment: <i>at what grain do you want one row?</i> After <code>GROUP BY tag</code> each output row is a whole group of notes with many different <code>views</code>, so "which views?" has no answer and PostgreSQL refuses to guess. The exception is real and narrow — group by a primary key and every other column of that same table is determined by it, so it is safe. That is why <code>GROUP BY u.id</code> lets you select <code>u.name</code> while <code>GROUP BY u.name</code> would not let you select <code>u.id</code> (two users could share a name). And note the wrong fix that the error tempts you into: adding <code>views</code> to the GROUP BY silences it by changing the grain to one row per (tag, views), which is no longer "per tag" at all and quietly turns every count into 1. If you want the detail alongside the summary, use an aggregate — <code>string_agg</code>, <code>max</code> — or a window function (Chapter 8).',
            'Hãy đọc thông báo lỗi như một câu hỏi chứ không phải một hình phạt: <i>bạn muốn một dòng ở grain nào?</i> Sau <code>GROUP BY tag</code>, mỗi dòng kết quả là cả một nhóm note với nhiều giá trị <code>views</code> khác nhau, nên "views nào?" không có câu trả lời và PostgreSQL từ chối đoán. Ngoại lệ thì có thật và rất hẹp — gom theo khoá chính thì mọi cột khác của chính bảng đó đều bị nó quyết định, nên an toàn. Vì thế <code>GROUP BY u.id</code> cho phép chọn <code>u.name</code>, còn <code>GROUP BY u.name</code> lại không cho chọn <code>u.id</code> (hai người có thể trùng tên). Và để ý cách sửa SAI mà thông báo lỗi dụ bạn: thêm <code>views</code> vào GROUP BY thì hết lỗi, nhưng bằng cách đổi grain thành một dòng cho mỗi cặp (tag, views) — không còn là "theo tag" nữa và âm thầm biến mọi phép đếm thành 1. Muốn thấy chi tiết bên cạnh bản tóm tắt thì dùng hàm tổng hợp — <code>string_agg</code>, <code>max</code> — hoặc một hàm cửa sổ (Chương 8).',
          ),
        }),

        mcq({
          prompt: B(
            'A <code>note</code> table has 5 rows; one row has <code>tag IS NULL</code>. Measured on PostgreSQL 16.14:' + code(
              'SELECT tag, count(*) FROM note GROUP BY tag ORDER BY tag NULLS LAST;\n' +
              ' tag  | count\n' +
              '------+-------\n' +
              ' date |     1\n' +
              ' ops  |     1\n' +
              ' sql  |     2\n' +
              '      |     1',
            ) + 'The NULL rows formed a group. Isn\'t that inconsistent with <code>NULL = NULL</code> being UNKNOWN?',
            'Một bảng <code>note</code> có 5 dòng; một dòng có <code>tag IS NULL</code>. Đo trên PostgreSQL 16.14:' + code(
              'SELECT tag, count(*) FROM note GROUP BY tag ORDER BY tag NULLS LAST;\n' +
              ' tag  | count\n' +
              '------+-------\n' +
              ' date |     1\n' +
              ' ops  |     1\n' +
              ' sql  |     2\n' +
              '      |     1',
            ) + 'Các dòng NULL đã tạo thành một nhóm. Thế có mâu thuẫn với việc <code>NULL = NULL</code> là UNKNOWN không?',
          ),
          options: [
            B('It is inconsistent, and it is a known PostgreSQL extension to the standard; other SQL databases put each NULL in its own group', 'Có mâu thuẫn, và đó là một phần mở rộng đã biết của PostgreSQL so với chuẩn; các cơ sở dữ liệu SQL khác đặt mỗi NULL vào một nhóm riêng'),
            B('No: grouping does not use <code>=</code>. It uses "is not distinct from", under which two NULLs belong together — the same rule <code>DISTINCT</code>, <code>UNION</code> and <code>IS NOT DISTINCT FROM</code> use', 'Không: phép gom nhóm không dùng <code>=</code>. Nó dùng "không khác biệt với nhau", theo đó hai NULL thuộc về cùng một chỗ — đúng cái luật mà <code>DISTINCT</code>, <code>UNION</code> và <code>IS NOT DISTINCT FROM</code> dùng'),
            B('The NULLs were coerced to the empty string before grouping, which is why the group label prints as blank rather than as the word NULL', 'Các giá trị NULL bị ép thành chuỗi rỗng trước khi gom nhóm, và vì thế nhãn của nhóm in ra là ô trống chứ không phải chữ NULL'),
            B('Only one row was NULL, so no comparison between two NULLs ever happened; with two NULL rows you would get two separate groups', 'Chỉ có một dòng NULL, nên chưa hề có phép so sánh nào giữa hai NULL; với hai dòng NULL thì bạn sẽ nhận được hai nhóm riêng biệt'),
          ],
          correct: 1,
          explanation: EX(
            'SQL has two different notions of sameness and it pays to hold them apart. Equality (<code>=</code>) is three-valued and never says TRUE about NULL. Grouping equality — used by <code>GROUP BY</code>, <code>DISTINCT</code>, <code>UNION</code>, and spelled explicitly as <code>IS NOT DISTINCT FROM</code> — treats NULL as a value that equals itself. So all the NULL-tagged rows collapse into exactly one group, no matter how many there are. Two practical corollaries: the group label is genuinely NULL, so downstream code must handle it (<code>COALESCE(tag, \'(no tag)\')</code> is the usual display fix, applied in the SELECT, not in the GROUP BY); and the NULL group sorts last in ascending order by default, which is why the query above spells <code>NULLS LAST</code> to be explicit rather than lucky.',
            'SQL có hai khái niệm "giống nhau" khác nhau, và tách bạch chúng ra là đáng công. Phép bằng (<code>=</code>) là ba trạng thái và không bao giờ nói TRUE về NULL. Còn phép bằng dùng để gom nhóm — thứ mà <code>GROUP BY</code>, <code>DISTINCT</code>, <code>UNION</code> dùng, và viết tường minh ra là <code>IS NOT DISTINCT FROM</code> — coi NULL là một giá trị bằng chính nó. Nên mọi dòng có tag NULL gộp lại thành đúng một nhóm, bao nhiêu dòng cũng vậy. Hai hệ quả thực tế: nhãn của nhóm đúng là NULL thật, nên mã phía sau phải xử lý (<code>COALESCE(tag, \'(chưa có tag)\')</code> là cách hiển thị thường dùng, đặt trong SELECT chứ không phải trong GROUP BY); và nhóm NULL mặc định sắp cuối khi tăng dần, nên truy vấn trên viết hẳn <code>NULLS LAST</code> để chắc chắn chứ không phải nhờ may.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 over a 10-row <code>s2</code> table (2 rows have <code>amount IS NULL</code>):' + code(
              'SELECT count(*)                                AS tong,\n' +
              '       count(*) FILTER (WHERE amount > 150)    AS lon,\n' +
              "       sum(amount) FILTER (WHERE region='North') AS bac\n" +
              'FROM s2;\n' +
              ' tong | lon | bac\n' +
              '------+-----+-----\n' +
              '   10 |   5 | 600',
            ) + 'What does <code>FILTER</code> buy over running three separate queries?',
            'Đo trên PostgreSQL 16.14 trên bảng <code>s2</code> 10 dòng (2 dòng có <code>amount IS NULL</code>):' + code(
              'SELECT count(*)                                AS tong,\n' +
              '       count(*) FILTER (WHERE amount > 150)    AS lon,\n' +
              "       sum(amount) FILTER (WHERE region='North') AS bac\n" +
              'FROM s2;\n' +
              ' tong | lon | bac\n' +
              '------+-----+-----\n' +
              '   10 |   5 | 600',
            ) + '<code>FILTER</code> hơn được gì so với chạy ba truy vấn riêng?',
          ),
          options: [
            B('Nothing beyond syntax — PostgreSQL rewrites it into three subqueries and scans the table three times anyway', 'Không hơn gì ngoài cú pháp — PostgreSQL viết lại nó thành ba subquery và vẫn quét bảng ba lần'),
            B('It rewrites the whole query into a <code>GROUP BY</code>, so the three numbers are computed as three groups rather than three columns', 'Nó viết lại cả truy vấn thành một <code>GROUP BY</code>, nên ba con số được tính như ba nhóm chứ không phải ba cột'),
            B('It applies the condition BEFORE the rows are read, so each aggregate reads only its own subset of the table and the total scan cost drops proportionally', 'Nó áp điều kiện TRƯỚC khi các dòng được đọc, nên mỗi hàm tổng hợp chỉ đọc phần bảng của riêng nó và tổng chi phí quét giảm theo tỉ lệ'),
            B('Each aggregate counts only the rows matching its own condition, all in ONE pass over the table — one query and one scan instead of three of each. It also composes with GROUP BY, giving several conditional columns per group', 'Mỗi hàm tổng hợp chỉ tính những dòng khớp điều kiện của riêng nó, tất cả trong MỘT lượt quét bảng — một truy vấn và một lần quét thay vì ba cái mỗi loại. Nó cũng ghép được với GROUP BY, cho ra nhiều cột có điều kiện cho từng nhóm'),
          ],
          correct: 3,
          explanation: EX(
            'This is the idiom behind every compact metrics row: total, plus several breakdowns, side by side. The rows are read once and each aggregate simply ignores the ones its <code>FILTER</code> rejects — which is both cleaner and cheaper than a dozen near-identical queries hammering the same table, and far more readable than the older <code>sum(CASE WHEN … THEN 1 ELSE 0 END)</code> trick it replaces. Note that <code>FILTER</code> is applied per aggregate and does NOT remove rows from the query, so <code>count(*)</code> beside it still sees all 10. Distinguish it from <code>WHERE</code> (removes rows before grouping, so every aggregate is affected) and from <code>HAVING</code> (removes whole GROUPS after aggregation). Also worth noting in the measured output: <code>bac</code> is 600 rather than NULL because the North rows all have a value — <code>sum</code> over a group with no non-NULL values returns NULL, not 0.',
            'Đây là thành ngữ đứng sau mọi hàng chỉ số gọn gàng: tổng, cộng vài lát cắt, đặt cạnh nhau. Các dòng được đọc một lượt và mỗi hàm tổng hợp chỉ việc bỏ qua những dòng mà <code>FILTER</code> của nó loại — vừa sạch hơn vừa rẻ hơn cả tá truy vấn gần giống nhau nện vào cùng một bảng, và dễ đọc hơn hẳn mẹo cũ <code>sum(CASE WHEN … THEN 1 ELSE 0 END)</code> mà nó thay thế. Lưu ý <code>FILTER</code> áp cho từng hàm tổng hợp và KHÔNG loại dòng khỏi truy vấn, nên <code>count(*)</code> bên cạnh vẫn thấy đủ 10 dòng. Hãy phân biệt nó với <code>WHERE</code> (loại dòng trước khi gom nhóm, nên mọi hàm tổng hợp đều bị ảnh hưởng) và với <code>HAVING</code> (loại cả NHÓM sau khi đã tổng hợp). Cũng đáng để ý trong kết quả đo: <code>bac</code> là 600 chứ không phải NULL vì các dòng North đều có giá trị — <code>sum</code> trên một nhóm không có giá trị non-NULL nào thì trả về NULL chứ không phải 0.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on a table with 10 rows. Note there is no <code>GROUP BY</code> in either statement:' + code(
              'SELECT count(*) FROM s2 HAVING count(*) > 5;\n' +
              ' count\n' +
              '-------\n' +
              '    10\n' +
              '\n' +
              'SELECT count(*) FROM s2 HAVING count(*) > 100;\n' +
              ' count\n' +
              '-------\n' +
              '(0 rows)',
            ) + 'The second returned ZERO ROWS, not the number 0. Why?',
            'Đo trên PostgreSQL 16.14 trên một bảng 10 dòng. Để ý cả hai câu đều KHÔNG có <code>GROUP BY</code>:' + code(
              'SELECT count(*) FROM s2 HAVING count(*) > 5;\n' +
              ' count\n' +
              '-------\n' +
              '    10\n' +
              '\n' +
              'SELECT count(*) FROM s2 HAVING count(*) > 100;\n' +
              ' count\n' +
              '-------\n' +
              '(0 dòng)',
            ) + 'Câu thứ hai trả về KHÔNG DÒNG NÀO, chứ không phải số 0. Vì sao?',
          ),
          options: [
            B('An aggregate with no GROUP BY still produces exactly one group — the whole table — and <code>HAVING</code> can eliminate that group like any other, leaving an empty result set rather than a row containing 0', 'Một hàm tổng hợp không có GROUP BY vẫn tạo ra đúng một nhóm — cả bảng — và <code>HAVING</code> có thể loại bỏ nhóm đó như mọi nhóm khác, để lại một tập kết quả rỗng chứ không phải một dòng chứa số 0'),
            B('<code>HAVING</code> without <code>GROUP BY</code> is silently ignored, and the empty result came from the table being locked by another session at that moment', '<code>HAVING</code> mà không có <code>GROUP BY</code> thì bị bỏ qua trong im lặng, và kết quả rỗng đến từ việc bảng đang bị một phiên khác khoá lúc đó'),
            B('The condition <code>count(*) > 100</code> made <code>count(*)</code> itself return NULL, and psql renders a NULL count as no rows at all', 'Điều kiện <code>count(*) > 100</code> khiến chính <code>count(*)</code> trả về NULL, và psql vẽ một phép đếm NULL thành không dòng nào'),
            B('PostgreSQL evaluated <code>HAVING</code> before the scan, decided no row could satisfy it, and short-circuited — with a <code>GROUP BY</code> present it would have returned <code>0</code> instead', 'PostgreSQL tính <code>HAVING</code> trước khi quét, kết luận không dòng nào thoả được, và cắt mạch — nếu có <code>GROUP BY</code> thì nó đã trả về <code>0</code>'),
          ],
          correct: 0,
          explanation: EX(
            'The mental model that makes this obvious: an aggregate query without <code>GROUP BY</code> is a query with ONE group containing every row. <code>HAVING</code> filters groups, so it can throw that single group away — and a thrown-away group is a missing row, not a zero. The difference matters in application code: a driver that does <code>rows[0].count</code> gets a value in the first case and crashes on <code>undefined</code> in the second, for a query that "obviously always returns one row". The same one-group rule explains a friendlier fact from lesson 6.1: <code>SELECT count(*) FROM t WHERE 1=0</code> returns <code>0</code> (the group exists, it is just empty) while <code>sum</code>, <code>avg</code>, <code>min</code> and <code>max</code> in the same row return NULL — which is why <code>COALESCE(SUM(x), 0)</code> is such a common wrapper.',
            'Mô hình tư duy làm chuyện này trở nên hiển nhiên: một truy vấn tổng hợp không có <code>GROUP BY</code> là một truy vấn có ĐÚNG MỘT nhóm chứa mọi dòng. <code>HAVING</code> lọc nhóm, nên nó có thể vứt luôn cái nhóm duy nhất ấy — và một nhóm bị vứt là một dòng KHÔNG có, chứ không phải một số 0. Khác biệt này quan trọng trong mã ứng dụng: một driver viết <code>rows[0].count</code> thì nhận được giá trị ở ca thứ nhất và chết vì <code>undefined</code> ở ca thứ hai, với một truy vấn "hiển nhiên luôn trả về một dòng". Cũng luật một-nhóm ấy giải thích một sự thật dễ chịu hơn ở bài 6.1: <code>SELECT count(*) FROM t WHERE 1=0</code> trả về <code>0</code> (nhóm vẫn tồn tại, chỉ là rỗng) trong khi <code>sum</code>, <code>avg</code>, <code>min</code> và <code>max</code> trên cùng dòng đó trả về NULL — và đó là lý do <code>COALESCE(SUM(x), 0)</code> là một lớp bọc phổ biến đến thế.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. The <code>East</code> region has 2 rows and BOTH have <code>amount IS NULL</code>:' + code(
              'SELECT region, count(*) AS n_star, count(amount) AS n_col,\n' +
              '       sum(amount) AS s, avg(amount) AS a, min(amount) AS mi\n' +
              'FROM s2 GROUP BY region ORDER BY region;\n' +
              ' region | n_star | n_col |  s  |   a   | mi\n' +
              '--------+--------+-------+-----+-------+-----\n' +
              ' East   |      2 |     0 |     |       |\n' +
              ' North  |      4 |     4 | 600 | 150.0 | 100',
            ) + 'A dashboard shows East\'s revenue as blank. What is the correct fix, and which number is the honest denominator for <code>avg</code>?',
            'Đo trên PostgreSQL 16.14. Vùng <code>East</code> có 2 dòng và CẢ HAI đều có <code>amount IS NULL</code>:' + code(
              'SELECT region, count(*) AS n_star, count(amount) AS n_col,\n' +
              '       sum(amount) AS s, avg(amount) AS a, min(amount) AS mi\n' +
              'FROM s2 GROUP BY region ORDER BY region;\n' +
              ' region | n_star | n_col |  s  |   a   | mi\n' +
              '--------+--------+-------+-----+-------+-----\n' +
              ' East   |      2 |     0 |     |       |\n' +
              ' North  |      4 |     4 | 600 | 150.0 | 100',
            ) + 'Một bảng điều khiển hiện doanh thu của East thành ô trống. Cách sửa đúng là gì, và con số nào là mẫu số trung thực của <code>avg</code>?',
          ),
          options: [
            B('Nothing is wrong: <code>sum</code> over a group with no values returns 0 and psql renders 0 as blank; the denominator for <code>avg</code> is always <code>count(*)</code>', 'Không có gì sai: <code>sum</code> trên một nhóm không có giá trị nào trả về 0 và psql vẽ số 0 thành ô trống; mẫu số của <code>avg</code> luôn là <code>count(*)</code>'),
            B('Filter the group out with <code>WHERE amount IS NOT NULL</code>; East then disappears from the report, which is the only correct handling of a group with no data', 'Lọc bỏ nhóm đó bằng <code>WHERE amount IS NOT NULL</code>; East khi đó biến khỏi báo cáo, và đó là cách xử lý đúng duy nhất cho một nhóm không có dữ liệu'),
            B('Every aggregate except <code>count(*)</code> skips NULLs, so a group with no values yields NULL — wrap it: <code>coalesce(sum(amount), 0)</code>. And <code>avg</code> divides by <code>count(amount)</code>, not <code>count(*)</code>, so show that denominator next to the average', 'Mọi hàm tổng hợp trừ <code>count(*)</code> đều bỏ qua NULL, nên một nhóm không có giá trị nào cho ra NULL — hãy bọc lại: <code>coalesce(sum(amount), 0)</code>. Và <code>avg</code> chia cho <code>count(amount)</code> chứ không phải <code>count(*)</code>, nên hãy hiện mẫu số đó bên cạnh giá trị trung bình'),
            B('Cast the column: <code>sum(amount::numeric)</code> treats NULL as zero, which is why the North row shows a number and the East row does not', 'Hãy ép kiểu cột: <code>sum(amount::numeric)</code> coi NULL là 0, và đó là lý do dòng North hiện số còn dòng East thì không'),
          ],
          correct: 2,
          explanation: EX(
            'Two distinct facts, both measured above. First, <code>count(*)</code> counts ROWS and never looks at a value; every other aggregate silently skips NULLs, so a group in which every value is NULL produces NULL for <code>sum</code>, <code>avg</code>, <code>min</code> and <code>max</code> while <code>count(*)</code> still reports 2. Second, and the one that quietly misleads readers: <code>avg</code> divides by the number of non-NULL values. A product with 100 orders and 30 missing ratings reports <code>AVG(rating)</code> over 70 rows — correct SQL, and wrong business analysis if the dashboard label says "average rating". Decide explicitly: if missing should count as zero, write <code>avg(coalesce(rating, 0))</code>; if it should be excluded, keep <code>avg(rating)</code> but put <code>count(rating)</code> beside it so the reader can see the denominator.',
            'Hai sự thật riêng biệt, cả hai đều đo được ở trên. Thứ nhất, <code>count(*)</code> đếm DÒNG và không bao giờ nhìn vào giá trị; mọi hàm tổng hợp khác đều âm thầm bỏ qua NULL, nên một nhóm mà mọi giá trị đều NULL sẽ cho ra NULL ở <code>sum</code>, <code>avg</code>, <code>min</code> và <code>max</code> trong khi <code>count(*)</code> vẫn báo 2. Thứ hai, và đây mới là chỗ âm thầm đánh lừa người đọc: <code>avg</code> chia cho SỐ GIÁ TRỊ khác NULL. Một sản phẩm có 100 đơn và 30 lượt thiếu đánh giá sẽ báo <code>AVG(rating)</code> trên 70 dòng — SQL đúng, mà phân tích nghiệp vụ thì sai nếu nhãn trên bảng điều khiển ghi "điểm trung bình". Hãy quyết định tường minh: nếu thiếu nên tính là 0 thì viết <code>avg(coalesce(rating, 0))</code>; nếu nên loại ra thì giữ <code>avg(rating)</code> nhưng đặt <code>count(rating)</code> ngay bên cạnh để người đọc thấy mẫu số.',
          ),
        }),

        // ── Chương 7 — Subquery & CTE ───────────────────────────────────
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. <code>cte_t</code> held exactly two rows before this ran:' + code(
              'WITH d AS (DELETE FROM cte_t WHERE id = 1 RETURNING *)\n' +
              'SELECT (SELECT count(*) FROM cte_t) AS thay_trong_cung_lenh,\n' +
              '       (SELECT count(*) FROM d)    AS da_xoa;\n' +
              ' thay_trong_cung_lenh | da_xoa\n' +
              '----------------------+--------\n' +
              '                    2 |      1\n' +
              '\n' +
              'SELECT count(*) FROM cte_t;   -- afterwards: 1',
            ) + 'Why does the outer SELECT still see two rows?',
            'Đo trên PostgreSQL 16.14. Bảng <code>cte_t</code> có đúng hai dòng trước khi chạy câu này:' + code(
              'WITH d AS (DELETE FROM cte_t WHERE id = 1 RETURNING *)\n' +
              'SELECT (SELECT count(*) FROM cte_t) AS thay_trong_cung_lenh,\n' +
              '       (SELECT count(*) FROM d)    AS da_xoa;\n' +
              ' thay_trong_cung_lenh | da_xoa\n' +
              '----------------------+--------\n' +
              '                    2 |      1\n' +
              '\n' +
              'SELECT count(*) FROM cte_t;   -- sau đó: 1',
            ) + 'Vì sao câu SELECT bên ngoài vẫn thấy hai dòng?',
          ),
          options: [
            B('Because every part of ONE statement sees the SAME snapshot, taken before the statement began. The DELETE really did run, but its effect is invisible to the rest of the statement — only the next statement sees 1', 'Vì mọi phần của MỘT câu lệnh đều nhìn CÙNG MỘT ảnh chụp, lấy trước khi câu lệnh bắt đầu. Lệnh DELETE có chạy thật, nhưng tác dụng của nó vô hình với phần còn lại của câu lệnh — chỉ câu lệnh kế tiếp mới thấy số 1'),
            B('Because the DELETE had not run yet — a data-modifying CTE is deferred until the whole statement finishes, so it executed after the counts were taken', 'Vì lệnh DELETE chưa chạy — một CTE có ghi bị hoãn cho tới khi cả câu lệnh kết thúc, nên nó thực thi sau khi các phép đếm đã lấy xong'),
            B('Because the CTE was inlined rather than materialised, so <code>cte_t</code> was read from the plan cache instead of from the table', 'Vì CTE được nội tuyến chứ không được vật chất hoá, nên <code>cte_t</code> được đọc từ bộ nhớ đệm kế hoạch thay vì từ bảng'),
            B('Because <code>RETURNING *</code> re-inserts the deleted row into the table for the duration of the statement, and the row is only really gone at COMMIT', 'Vì <code>RETURNING *</code> chèn lại dòng đã xoá vào bảng trong suốt thời gian câu lệnh chạy, và dòng đó chỉ thực sự mất lúc COMMIT'),
          ],
          correct: 0,
          explanation: EX(
            'A data-modifying CTE runs exactly once, and all sub-statements of one statement execute against a single snapshot — so the sibling <code>SELECT count(*) FROM cte_t</code> is answering "how many rows were there when this statement started?", which is 2. The only way to see what the DELETE produced from inside the same statement is to read the CTE itself, which is what <code>(SELECT count(*) FROM d)</code> does and why it correctly says 1. This is the mechanism behind the useful <code>WITH moved AS (DELETE … RETURNING *) INSERT INTO archive SELECT * FROM moved</code> idiom: one statement, atomic, and the archive reads the rows the DELETE removed. Two cautions from the manual: the execution ORDER of several data-modifying CTEs in one statement is unspecified, so do not have two of them write the same row; and the DELETE would run even if no part of the query referenced <code>d</code>.',
            'Một CTE có ghi chạy đúng một lần, và mọi câu con của cùng một câu lệnh đều thực thi trên MỘT ảnh chụp duy nhất — nên câu anh em <code>SELECT count(*) FROM cte_t</code> đang trả lời câu hỏi "lúc câu lệnh này bắt đầu thì có bao nhiêu dòng?", tức là 2. Cách duy nhất để thấy thứ mà lệnh DELETE tạo ra từ bên trong cùng câu lệnh là đọc chính cái CTE ấy — đúng thứ mà <code>(SELECT count(*) FROM d)</code> làm, và vì thế nó nói đúng số 1. Đây là cơ chế đằng sau thành ngữ rất hữu dụng <code>WITH moved AS (DELETE … RETURNING *) INSERT INTO archive SELECT * FROM moved</code>: một câu lệnh, nguyên tử, và bảng lưu trữ đọc đúng những dòng mà DELETE vừa gỡ đi. Hai lưu ý từ tài liệu: THỨ TỰ thực thi của nhiều CTE có ghi trong cùng một câu lệnh là không xác định, nên đừng để hai cái cùng ghi một dòng; và lệnh DELETE vẫn chạy kể cả khi không phần nào của truy vấn tham chiếu tới <code>d</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Two ways to ask "which users have written at least one note". Which statement about them is correct?' + code(
              'SELECT u.name FROM app_user u\n' +
              ' WHERE (SELECT count(*) FROM note n WHERE n.user_id = u.id) > 0;   -- A\n' +
              '\n' +
              'SELECT u.name FROM app_user u\n' +
              ' WHERE EXISTS (SELECT 1 FROM note n WHERE n.user_id = u.id);       -- B',
            ),
            'Hai cách hỏi "những người dùng nào đã viết ít nhất một note". Phát biểu nào về chúng là đúng?' + code(
              'SELECT u.name FROM app_user u\n' +
              ' WHERE (SELECT count(*) FROM note n WHERE n.user_id = u.id) > 0;   -- A\n' +
              '\n' +
              'SELECT u.name FROM app_user u\n' +
              ' WHERE EXISTS (SELECT 1 FROM note n WHERE n.user_id = u.id);       -- B',
            ),
          ),
          options: [
            B('A is safer because <code>EXISTS</code> returns NULL when the subquery is empty, so B silently drops users whose note count is zero', 'A an toàn hơn vì <code>EXISTS</code> trả về NULL khi subquery rỗng, nên B âm thầm loại bỏ những người dùng có số note bằng không'),
            B('They are identical in every way; PostgreSQL rewrites A into B, which is why the <code>SELECT 1</code> in B is purely stylistic', 'Chúng giống hệt nhau ở mọi mặt; PostgreSQL viết lại A thành B, và vì thế <code>SELECT 1</code> trong B chỉ là chuyện phong cách'),
            B('B is preferable: <code>EXISTS</code> stops at the FIRST matching row, while the count must find every match before comparing — on a user with 40,000 notes A reads 40,000 rows to answer a question the first row already settled', 'B đáng dùng hơn: <code>EXISTS</code> dừng ở dòng khớp ĐẦU TIÊN, còn phép đếm phải tìm hết mọi dòng khớp rồi mới so sánh — với một người dùng có 40.000 note thì A đọc 40.000 dòng để trả lời một câu hỏi mà dòng đầu tiên đã giải quyết xong'),
            B('A is preferable because a correlated subquery in <code>WHERE</code> can use an index while <code>EXISTS</code> forces a sequential scan of the child table', 'A đáng dùng hơn vì một subquery tương quan trong <code>WHERE</code> dùng được chỉ mục, còn <code>EXISTS</code> thì ép quét tuần tự bảng con'),
          ],
          correct: 2,
          explanation: EX(
            'Both are correlated — the inner query mentions <code>u.id</code>, an outer column, which is the entire test for "correlated" and means it is conceptually evaluated per outer row. The difference is what each one has to finish. <code>EXISTS</code> is a semi-join: as soon as one child row qualifies, the answer is settled and the scan stops. <code>count(*) &gt; 0</code> must aggregate every matching child row into a number that you then throw away. The mirror-image mistake is just as common: <code>count(*) = 0</code> should be <code>NOT EXISTS</code>. Use a count when you actually want the number; use <code>EXISTS</code> when you want yes or no. And <code>NOT EXISTS</code> has the extra virtue of handling NULL correctly, unlike <code>NOT IN</code> — measured on this data, the <code>NOT IN</code> form returned zero rows because one <code>user_id</code> was NULL.',
            'Cả hai đều là subquery tương quan — truy vấn bên trong có nhắc tới <code>u.id</code>, một cột từ bên ngoài, và đó chính là toàn bộ phép thử "có tương quan hay không", nghĩa là về mặt khái niệm nó được tính cho từng dòng bên ngoài. Khác biệt nằm ở chỗ mỗi cái phải làm xong việc gì. <code>EXISTS</code> là một phép nửa-nối: ngay khi một dòng con thoả điều kiện thì câu trả lời đã xong và phép quét dừng lại. Còn <code>count(*) &gt; 0</code> buộc phải gộp mọi dòng con khớp thành một con số rồi bạn vứt con số đó đi. Lỗi soi gương cũng phổ biến y như vậy: <code>count(*) = 0</code> nên là <code>NOT EXISTS</code>. Dùng phép đếm khi bạn thật sự cần con số; dùng <code>EXISTS</code> khi bạn cần câu trả lời có hay không. Và <code>NOT EXISTS</code> còn thêm cái hay là xử lý NULL đúng, không như <code>NOT IN</code> — đo trên đúng bộ dữ liệu này, dạng <code>NOT IN</code> trả về không dòng nào vì có một <code>user_id</code> là NULL.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14, where <code>app_user</code> holds four rows:' + code(
              'SELECT (SELECT id FROM app_user);\n' +
              'ERROR:  more than one row returned by a subquery used as an expression',
            ) + 'What kind of failure is this, and when would it surface?',
            'Đo trên PostgreSQL 16.14, với bảng <code>app_user</code> có bốn dòng:' + code(
              'SELECT (SELECT id FROM app_user);\n' +
              'ERROR:  more than one row returned by a subquery used as an expression',
            ) + 'Đây là loại lỗi gì, và nó lộ ra khi nào?',
          ),
          options: [
            B('A parse error: PostgreSQL rejects any subquery in the select list that has no <code>LIMIT 1</code>, so the statement never reaches the planner', 'Lỗi phân tích cú pháp: PostgreSQL từ chối mọi subquery trong danh sách chọn mà không có <code>LIMIT 1</code>, nên câu lệnh không bao giờ tới được bộ lập kế hoạch'),
            B('A RUNTIME error that depends on the DATA: a scalar subquery must yield at most one row, and the statement plans and starts fine — it fails the moment a second row arrives, which may be months after the code shipped', 'Lỗi LÚC CHẠY và phụ thuộc DỮ LIỆU: một subquery vô hướng chỉ được cho ra nhiều nhất một dòng, và câu lệnh vẫn lập kế hoạch và khởi động bình thường — nó chỉ hỏng vào đúng lúc dòng thứ hai xuất hiện, có thể là nhiều tháng sau khi mã được phát hành'),
            B('A type error: the subquery returns a set, and PostgreSQL cannot cast a set to a scalar, so the statement is invalid regardless of the data in the table', 'Lỗi kiểu: subquery trả về một tập hợp, và PostgreSQL không ép được một tập hợp thành một giá trị vô hướng, nên câu lệnh không hợp lệ bất kể dữ liệu trong bảng thế nào'),
            B('A permissions error in disguise — the subquery could not see which row it was allowed to read, and PostgreSQL reports ambiguity rather than leaking the row count', 'Một lỗi phân quyền trá hình — subquery không nhìn được nó được phép đọc dòng nào, nên PostgreSQL báo nhập nhằng thay vì để lộ số dòng'),
          ],
          correct: 1,
          explanation: EX(
            'A scalar subquery — one used where a single value is expected, in the select list or on one side of a comparison — is checked at run time, row by row, not at parse time. That is exactly what makes it dangerous: <code>SELECT u.name, (SELECT s.city FROM shipping s WHERE s.user_id = u.id)</code> is correct while every user has at most one shipping address, and starts throwing the day someone adds a second. It also returns NULL rather than erroring when the subquery matches NOTHING, so the empty case is silent and the duplicate case is loud. Decide which you mean and say it: add <code>ORDER BY … LIMIT 1</code> if "any one of them" is genuinely acceptable, use <code>max()</code>/<code>string_agg()</code> if you want them combined, or restructure as a LEFT JOIN when you actually want one output row per match.',
            'Một subquery vô hướng — loại được đặt ở chỗ chờ đợi một giá trị đơn, trong danh sách chọn hoặc ở một vế của phép so sánh — được kiểm lúc CHẠY, theo từng dòng, chứ không phải lúc phân tích cú pháp. Chính điều đó làm nó nguy hiểm: <code>SELECT u.name, (SELECT s.city FROM shipping s WHERE s.user_id = u.id)</code> hoàn toàn đúng chừng nào mỗi người dùng có nhiều nhất một địa chỉ giao hàng, và bắt đầu ném lỗi vào ngày có ai đó thêm địa chỉ thứ hai. Nó cũng trả về NULL chứ không báo lỗi khi subquery không khớp gì cả, nên ca "rỗng" thì im lặng còn ca "trùng" thì ồn ào. Hãy quyết định bạn muốn gì và nói ra: thêm <code>ORDER BY … LIMIT 1</code> nếu "cái nào cũng được" là chấp nhận được thật, dùng <code>max()</code>/<code>string_agg()</code> nếu muốn gộp lại, hoặc viết lại thành LEFT JOIN khi bạn thật sự muốn mỗi lần khớp là một dòng kết quả.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on a 5-person org chart (Alice → Bob → Dave → Erin, and Alice → Carol):' + code(
              'WITH RECURSIVE chain AS (\n' +
              '  SELECT id, name, manager_id, 1 AS lvl\n' +
              '    FROM employee WHERE manager_id IS NULL          -- anchor\n' +
              '  UNION ALL\n' +
              '  SELECT e.id, e.name, e.manager_id, c.lvl + 1\n' +
              '    FROM employee e JOIN chain c ON e.manager_id = c.id\n' +
              ')\n' +
              'SELECT lvl, name FROM chain ORDER BY lvl, name;\n' +
              ' lvl | name\n' +
              '-----+-------\n' +
              '   1 | Alice\n' +
              '   2 | Bob\n' +
              '   2 | Carol\n' +
              '   3 | Dave\n' +
              '   4 | Erin',
            ) + 'What does the name <code>chain</code> refer to INSIDE the recursive term, and why is it <code>UNION ALL</code>?',
            'Đo trên PostgreSQL 16.14 trên một sơ đồ tổ chức 5 người (Alice → Bob → Dave → Erin, và Alice → Carol):' + code(
              'WITH RECURSIVE chain AS (\n' +
              '  SELECT id, name, manager_id, 1 AS lvl\n' +
              '    FROM employee WHERE manager_id IS NULL          -- neo\n' +
              '  UNION ALL\n' +
              '  SELECT e.id, e.name, e.manager_id, c.lvl + 1\n' +
              '    FROM employee e JOIN chain c ON e.manager_id = c.id\n' +
              ')\n' +
              'SELECT lvl, name FROM chain ORDER BY lvl, name;\n' +
              ' lvl | name\n' +
              '-----+-------\n' +
              '   1 | Alice\n' +
              '   2 | Bob\n' +
              '   2 | Carol\n' +
              '   3 | Dave\n' +
              '   4 | Erin',
            ) + 'Bên TRONG phần đệ quy, cái tên <code>chain</code> trỏ tới cái gì, và vì sao lại là <code>UNION ALL</code>?',
          ),
          options: [
            B('<code>chain</code> refers ONLY to the rows produced by the PREVIOUS pass, not the whole accumulated set; <code>UNION ALL</code> is used because plain <code>UNION</code> would deduplicate on every iteration — slower, and rarely what a tree walk wants', '<code>chain</code> CHỈ trỏ tới những dòng do lượt TRƯỚC sinh ra, chứ không phải cả tập đã tích luỹ; dùng <code>UNION ALL</code> vì <code>UNION</code> thường sẽ khử trùng lặp ở mỗi vòng — chậm hơn, và hiếm khi là thứ một phép duyệt cây cần'),
            B('<code>chain</code> is everything accumulated so far, and <code>UNION ALL</code> is required because <code>UNION</code> is not allowed in a recursive CTE at all', '<code>chain</code> là toàn bộ những gì đã tích luỹ được, và <code>UNION ALL</code> là bắt buộc vì <code>UNION</code> hoàn toàn không được phép trong một CTE đệ quy'),
            B('<code>chain</code> refers to the anchor rows only, which is why the level counter can be computed as <code>c.lvl + 1</code> without ever exceeding 2', '<code>chain</code> chỉ trỏ tới các dòng của phần neo, và vì thế bộ đếm cấp bậc tính bằng <code>c.lvl + 1</code> không bao giờ vượt quá 2'),
            B('<code>chain</code> refers to the employee table under another name; the recursion is really a self-join that PostgreSQL unrolls a fixed number of times based on <code>max_recursion_depth</code>', '<code>chain</code> trỏ tới bảng employee dưới một cái tên khác; phép đệ quy thực chất là một phép tự nối mà PostgreSQL bung ra một số lần cố định dựa trên <code>max_recursion_depth</code>'),
          ],
          correct: 0,
          explanation: EX(
            'Each pass sees only what the pass before it produced — that is the detail people get wrong, and it is what makes the level counter work: the anchor emits Alice at level 1, pass one sees only Alice and emits Bob and Carol at 2, pass two sees only Bob and Carol and emits Dave at 3, pass three emits Erin at 4, and pass four produces nothing, which is the exit condition. There is no explicit termination. That is also the danger: a cycle in the data (A manages B who manages A — a bad row saved in an admin panel) means the recursive term never returns zero rows and the query consumes memory until the connection dies, on production, having worked perfectly on seed data. Two defences and use both: carry the visited ids in an array and add <code>WHERE NOT e.id = ANY(c.path)</code>, and add a depth guard <code>WHERE c.lvl &lt; 100</code>, which costs nothing and turns an outage into a truncated result you can notice.',
            'Mỗi lượt chỉ nhìn thấy thứ mà lượt ngay trước nó sinh ra — đó là chi tiết người ta hay hiểu sai, và chính nó làm bộ đếm cấp bậc chạy đúng: phần neo phát ra Alice ở cấp 1, lượt một chỉ thấy Alice nên phát ra Bob và Carol ở cấp 2, lượt hai chỉ thấy Bob và Carol nên phát ra Dave ở cấp 3, lượt ba phát ra Erin ở cấp 4, và lượt bốn không sinh ra gì — đó là điều kiện thoát. Không có lệnh dừng tường minh nào cả. Đó cũng là chỗ nguy hiểm: một chu trình trong dữ liệu (A quản lý B, B lại quản lý A — một dòng hỏng ai đó lưu trong trang quản trị) khiến phần đệ quy không bao giờ trả về không dòng nào và truy vấn ngốn bộ nhớ tới khi kết nối chết, trên production, sau khi đã chạy hoàn hảo trên dữ liệu mẫu. Hai lớp phòng vệ, và hãy dùng cả hai: mang theo các id đã đi qua trong một mảng rồi thêm <code>WHERE NOT e.id = ANY(c.path)</code>, và thêm một chốt độ sâu <code>WHERE c.lvl &lt; 100</code> — chốt này không tốn gì và biến một sự cố thành một kết quả bị cắt ngắn mà bạn nhìn ra được.',
          ),
        }),

        mcq({
          prompt: B(
            'Two plans for the same question, measured on PostgreSQL 16.14 over a 500,000-row table:' + code(
              'EXPLAIN (COSTS OFF) WITH t AS (SELECT * FROM big) SELECT count(*) FROM t WHERE user_id = 42;\n' +
              ' Aggregate\n' +
              '   ->  Index Only Scan using big_ui on big\n' +
              '         Index Cond: (user_id = 42)\n' +
              '\n' +
              'EXPLAIN (COSTS OFF) WITH t AS MATERIALIZED (SELECT * FROM big) SELECT count(*) FROM t WHERE user_id = 42;\n' +
              ' Aggregate\n' +
              '   CTE t\n' +
              '     ->  Seq Scan on big\n' +
              '   ->  CTE Scan on t\n' +
              '         Filter: (user_id = 42)',
            ) + 'What changed, and what is the rule?',
            'Hai kế hoạch cho cùng một câu hỏi, đo trên PostgreSQL 16.14 trên bảng 500.000 dòng:' + code(
              'EXPLAIN (COSTS OFF) WITH t AS (SELECT * FROM big) SELECT count(*) FROM t WHERE user_id = 42;\n' +
              ' Aggregate\n' +
              '   ->  Index Only Scan using big_ui on big\n' +
              '         Index Cond: (user_id = 42)\n' +
              '\n' +
              'EXPLAIN (COSTS OFF) WITH t AS MATERIALIZED (SELECT * FROM big) SELECT count(*) FROM t WHERE user_id = 42;\n' +
              ' Aggregate\n' +
              '   CTE t\n' +
              '     ->  Seq Scan on big\n' +
              '   ->  CTE Scan on t\n' +
              '         Filter: (user_id = 42)',
            ) + 'Cái gì đã thay đổi, và luật là gì?',
          ),
          options: [
            B('<code>MATERIALIZED</code> tells PostgreSQL to cache the CTE result across statements, so the second form is faster on the second and every subsequent execution', '<code>MATERIALIZED</code> bảo PostgreSQL lưu kết quả CTE lại xuyên các câu lệnh, nên dạng thứ hai nhanh hơn kể từ lần thực thi thứ hai trở đi'),
            B('The first form is wrong: an inlined CTE cannot be counted, which is why the plan shows an Index Only Scan instead of a CTE Scan', 'Dạng đầu tiên sai: một CTE được nội tuyến thì không đếm được, và vì thế kế hoạch hiện Index Only Scan thay cho CTE Scan'),
            B('Since PostgreSQL 12 a CTE is INLINED by default, so the outer filter is pushed down into the scan and the index can be used. <code>MATERIALIZED</code> forces the old behaviour — an optimisation fence: build the full intermediate result first, THEN filter', 'Từ PostgreSQL 12 một CTE mặc định được NỘI TUYẾN, nên bộ lọc bên ngoài được đẩy xuống tận phép quét và chỉ mục dùng được. <code>MATERIALIZED</code> ép về hành vi cũ — một hàng rào tối ưu: dựng trọn kết quả trung gian trước đã, RỒI mới lọc'),
            B('The difference is only in how EXPLAIN prints the tree; both plans read the same pages and any timing difference between them is measurement noise', 'Khác biệt chỉ nằm ở cách EXPLAIN vẽ cây; cả hai kế hoạch đọc cùng những trang như nhau và mọi chênh lệch thời gian giữa chúng chỉ là nhiễu đo đạc'),
          ],
          correct: 2,
          explanation: EX(
            'Advice written before 2019 says the opposite of what is true today, so this is worth pinning down. Up to PostgreSQL 11 every CTE was an optimisation fence: it was computed in full, then the outer query filtered the result. From 12 onwards the planner inlines a CTE when it can — it is referenced once, has no side effects, and is not marked <code>MATERIALIZED</code> — which lets the outer <code>WHERE user_id = 42</code> reach the scan, and the index becomes usable. The measured plans show exactly that flip. The practical consequence: a CTE is a NAMING device, not an optimisation. Forcing <code>MATERIALIZED</code> on a CTE that selects a million rows when the outer query keeps ten means paying for 999,990 rows you discard. It earns its keep only when the CTE is genuinely expensive AND referenced several times, or when you deliberately want the fence — for instance to stop the planner pushing a volatile function down.',
            'Lời khuyên viết trước 2019 nói ngược hẳn với sự thật hôm nay, nên chỗ này đáng ghim lại. Tới PostgreSQL 11, mọi CTE đều là một hàng rào tối ưu: nó được tính trọn vẹn rồi truy vấn bên ngoài mới lọc kết quả. Từ bản 12 trở đi, bộ lập kế hoạch nội tuyến CTE khi có thể — khi nó chỉ được tham chiếu một lần, không có tác dụng phụ, và không bị đánh dấu <code>MATERIALIZED</code> — nhờ đó mệnh đề <code>WHERE user_id = 42</code> bên ngoài với được tới phép quét, và chỉ mục dùng được. Hai kế hoạch đo được cho thấy đúng cú lật ấy. Hệ quả thực tế: CTE là công cụ ĐẶT TÊN chứ không phải công cụ tối ưu. Ép <code>MATERIALIZED</code> lên một CTE chọn ra một triệu dòng trong khi truy vấn ngoài chỉ giữ mười dòng nghĩa là trả tiền cho 999.990 dòng bạn vứt đi. Nó chỉ đáng khi CTE thật sự đắt VÀ được tham chiếu nhiều lần, hoặc khi bạn cố ý muốn có hàng rào — chẳng hạn để chặn bộ lập kế hoạch đẩy một hàm volatile xuống dưới.',
          ),
        }),

        // ── Chương 8 — Hàm cửa sổ ───────────────────────────────────────
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on four rows of one region. The two sums differ on the middle rows, and the only difference between them is the frame clause:' + code(
              'SELECT amount,\n' +
              '  sum(amount) OVER (ORDER BY amount)                                             AS range_mac_dinh,\n' +
              '  sum(amount) OVER (ORDER BY amount ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rows_\n' +
              'FROM s2 WHERE region = \'North\' ORDER BY amount;\n' +
              ' amount | range_mac_dinh | rows_\n' +
              '--------+----------------+-------\n' +
              '    100 |            100 |   100\n' +
              '    150 |            400 |   250\n' +
              '    150 |            400 |   400\n' +
              '    200 |            600 |   600',
            ) + 'Why do the two 150 rows both show 400 in the first column?',
            'Đo trên PostgreSQL 16.14 trên bốn dòng của một vùng. Hai cột tổng khác nhau ở các dòng giữa, và khác biệt duy nhất giữa chúng là mệnh đề khung:' + code(
              'SELECT amount,\n' +
              '  sum(amount) OVER (ORDER BY amount)                                             AS range_mac_dinh,\n' +
              '  sum(amount) OVER (ORDER BY amount ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS rows_\n' +
              'FROM s2 WHERE region = \'North\' ORDER BY amount;\n' +
              ' amount | range_mac_dinh | rows_\n' +
              '--------+----------------+-------\n' +
              '    100 |            100 |   100\n' +
              '    150 |            400 |   250\n' +
              '    150 |            400 |   400\n' +
              '    200 |            600 |   600',
            ) + 'Vì sao hai dòng 150 đều hiện 400 ở cột đầu?',
          ),
          options: [
            B('Because <code>sum</code> with an <code>ORDER BY</code> and no explicit frame is not a running total at all — it is the partition total, and 400 is a coincidence of this data', 'Vì <code>sum</code> có <code>ORDER BY</code> mà không có khung tường minh thì hoàn toàn không phải tổng luỹ tiến — đó là tổng của cả phân vùng, và con số 400 chỉ là trùng hợp của bộ dữ liệu này'),
            B('Because <code>ORDER BY</code> inside <code>OVER</code> implies the frame <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>, and RANGE counts PEERS — every row sharing the current sort value is inside the frame, so both 150s see 100 + 150 + 150. <code>ROWS</code> counts physical rows and does not', 'Vì <code>ORDER BY</code> bên trong <code>OVER</code> ngầm định khung <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>, và RANGE tính cả các dòng ĐỒNG HẠNG — mọi dòng cùng giá trị sắp xếp với dòng hiện tại đều nằm trong khung, nên cả hai dòng 150 đều thấy 100 + 150 + 150. Còn <code>ROWS</code> đếm theo dòng vật lý nên không như vậy'),
            B('Because <code>RANGE</code> deduplicates equal values before summing, so the two 150s contribute once and the frame holds 100 + 150 + 150 by accident of rounding', 'Vì <code>RANGE</code> khử trùng lặp các giá trị bằng nhau trước khi cộng, nên hai số 150 chỉ đóng góp một lần và khung chứa 100 + 150 + 150 do làm tròn tình cờ'),
            B('Because the rows are unordered without a unique tiebreaker, so PostgreSQL computed both middle rows in an arbitrary order and returned the larger of the two possible answers', 'Vì các dòng không có thứ tự xác định khi thiếu khoá phân định duy nhất, nên PostgreSQL tính hai dòng giữa theo một thứ tự tuỳ tiện và trả về giá trị lớn hơn trong hai khả năng'),
          ],
          correct: 1,
          explanation: EX(
            'Three rules stacked, and most people only know the first. (1) No <code>ORDER BY</code> inside <code>OVER</code> means the frame is the whole partition, so <code>sum</code> gives the same grand total on every row. (2) Adding <code>ORDER BY</code> silently adds a frame you did not write — <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> — and that is what turns a total into a running total. (3) <code>RANGE</code> is defined in terms of the sort VALUE, so all peers of the current row are in the frame together; <code>ROWS</code> is defined in terms of position. On a column with no duplicates the two are identical, which is exactly why this bites only in production. If you want a genuine per-row running total, say <code>ROWS</code> explicitly. And the same peer rule explains the other classic: a "7-day moving average" must be written <code>ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code> — nothing about the default frame gives you that.',
            'Ba luật xếp chồng, và phần lớn mọi người chỉ biết luật đầu tiên. (1) Không có <code>ORDER BY</code> trong <code>OVER</code> thì khung là cả phân vùng, nên <code>sum</code> cho cùng một tổng lớn trên mọi dòng. (2) Thêm <code>ORDER BY</code> vào là âm thầm thêm một cái khung mà bạn không hề viết — <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> — và chính nó biến một cái tổng thành tổng luỹ tiến. (3) <code>RANGE</code> được định nghĩa theo GIÁ TRỊ sắp xếp, nên mọi dòng đồng hạng với dòng hiện tại đều cùng nằm trong khung; còn <code>ROWS</code> định nghĩa theo vị trí. Trên một cột không có giá trị trùng thì hai cái giống hệt nhau, và đó đúng là lý do chuyện này chỉ cắn ở production. Muốn một tổng luỹ tiến theo từng dòng thật sự thì hãy viết rõ <code>ROWS</code>. Và cũng luật đồng hạng ấy giải thích ca kinh điển còn lại: một "trung bình trượt 7 ngày" bắt buộc phải viết <code>ROWS BETWEEN 6 PRECEDING AND CURRENT ROW</code> — khung mặc định không hề cho bạn thứ đó.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on one region ordered by <code>amount DESC</code>. <code>last_value</code> returned a different number in each row of the middle column:' + code(
              'WINDOW w AS (PARTITION BY region ORDER BY amount DESC)\n' +
              '\n' +
              ' amount | first_value | last_value OVER w | last_value with an explicit full frame\n' +
              '--------+-------------+-------------------+---------------------------------------\n' +
              '    300 |         300 |               300 |                                   180\n' +
              '    250 |         300 |               250 |                                   180\n' +
              '    220 |         300 |               220 |                                   180\n' +
              '    180 |         300 |               180 |                                   180',
            ) + 'Why does the middle column just repeat the current row, while <code>first_value</code> behaves as expected?',
            'Đo trên PostgreSQL 16.14 trên một vùng sắp theo <code>amount DESC</code>. <code>last_value</code> trả về một số khác nhau ở mỗi dòng của cột giữa:' + code(
              'WINDOW w AS (PARTITION BY region ORDER BY amount DESC)\n' +
              '\n' +
              ' amount | first_value | last_value OVER w | last_value với khung đầy đủ tường minh\n' +
              '--------+-------------+-------------------+---------------------------------------\n' +
              '    300 |         300 |               300 |                                   180\n' +
              '    250 |         300 |               250 |                                   180\n' +
              '    220 |         300 |               220 |                                   180\n' +
              '    180 |         300 |               180 |                                   180',
            ) + 'Vì sao cột giữa chỉ lặp lại chính dòng hiện tại, trong khi <code>first_value</code> lại chạy đúng như mong đợi?',
          ),
          options: [
            B('Because <code>last_value</code> is evaluated before the sort while <code>first_value</code> is evaluated after it, so only the second one sees the ordered partition', 'Vì <code>last_value</code> được tính trước phép sắp còn <code>first_value</code> được tính sau, nên chỉ hàm thứ hai mới nhìn thấy phân vùng đã sắp xếp'),
            B('Because <code>last_value</code> requires <code>PARTITION BY</code> to be omitted; with a partition it can only see the current row and silently degrades', 'Vì <code>last_value</code> đòi phải bỏ <code>PARTITION BY</code>; khi có phân vùng thì nó chỉ nhìn được dòng hiện tại và tự suy biến trong im lặng'),
            B('Because <code>DESC</code> reverses which end of the partition counts as "last", so with <code>ASC</code> the middle column would have shown 180 on every row without any frame clause', 'Vì <code>DESC</code> đảo lại đầu nào của phân vùng được tính là "cuối", nên với <code>ASC</code> thì cột giữa đã hiện 180 ở mọi dòng mà không cần mệnh đề khung nào'),
            B('Because the default frame ENDS at the current row, so "the last row of the frame" IS the current row. <code>first_value</code> is unaffected because the frame always starts at the partition start. The fix is <code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code>', 'Vì khung mặc định KẾT THÚC ở dòng hiện tại, nên "dòng cuối của khung" CHÍNH LÀ dòng hiện tại. <code>first_value</code> không bị ảnh hưởng vì khung luôn bắt đầu từ đầu phân vùng. Cách sửa là <code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code>'),
          ],
          correct: 3,
          explanation: EX(
            'This is the same implicit frame as the previous question, seen from the other side. <code>ORDER BY</code> inside <code>OVER</code> silently sets the frame to "start of partition … current row", so <code>first_value</code> looks right (the start never moves) while <code>last_value</code> is useless (the end is always you). The fix is to say the frame out loud. Reaching for <code>max()</code> instead is often simpler and immune to the trap: <code>max(amount) OVER (PARTITION BY region)</code> with no <code>ORDER BY</code> has the whole partition as its frame. From here "how far behind the leader is each sale?" is just <code>first_value(amount) OVER w - amount</code>. The general lesson from lesson 8.4 is worth carrying: the frame is the part most people never set, and it is the part that decides whether the number means what the column label says.',
            'Đây vẫn là cái khung ngầm ở câu trước, nhìn từ phía bên kia. <code>ORDER BY</code> bên trong <code>OVER</code> âm thầm đặt khung thành "từ đầu phân vùng … tới dòng hiện tại", nên <code>first_value</code> trông có vẻ đúng (điểm bắt đầu không bao giờ nhúc nhích) còn <code>last_value</code> thì vô dụng (điểm kết thúc luôn là chính bạn). Cách sửa là nói cái khung ra thành lời. Chuyển sang dùng <code>max()</code> thường đơn giản hơn và miễn nhiễm với cái bẫy này: <code>max(amount) OVER (PARTITION BY region)</code> không có <code>ORDER BY</code> thì khung của nó là cả phân vùng. Từ đây, "mỗi lượt bán còn kém người dẫn đầu bao nhiêu?" chỉ là <code>first_value(amount) OVER w - amount</code>. Bài học chung ở bài 8.4 đáng mang theo: khung là phần mà hầu hết mọi người không bao giờ đặt, và nó lại là phần quyết định con số có đúng nghĩa như nhãn cột hay không.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. The <code>East</code> partition has exactly two rows and <code>amount IS NULL</code> on both:' + code(
              'WINDOW w AS (PARTITION BY region ORDER BY amount DESC)\n' +
              '\n' +
              ' region | id | amount | row_number | rank | dense_rank | ntile(2)\n' +
              '--------+----+--------+------------+------+------------+----------\n' +
              ' East   |  9 |        |          1 |    1 |          1 |        1\n' +
              ' East   | 10 |        |          2 |    1 |          1 |        2',
            ) + 'Read the East rows: what do the four functions disagree about, and where did the NULLs sort?',
            'Đo trên PostgreSQL 16.14. Phân vùng <code>East</code> có đúng hai dòng và cả hai đều có <code>amount IS NULL</code>:' + code(
              'WINDOW w AS (PARTITION BY region ORDER BY amount DESC)\n' +
              '\n' +
              ' region | id | amount | row_number | rank | dense_rank | ntile(2)\n' +
              '--------+----+--------+------------+------+------------+----------\n' +
              ' East   |  9 |        |          1 |    1 |          1 |        1\n' +
              ' East   | 10 |        |          2 |    1 |          1 |        2',
            ) + 'Đọc hai dòng East: bốn hàm này bất đồng với nhau ở điểm gì, và các giá trị NULL đã được sắp vào đâu?',
          ),
          options: [
            B('The two NULLs are peers, so <code>rank</code> and <code>dense_rank</code> both give them 1; <code>row_number</code> numbers them 1 and 2 arbitrarily and <code>ntile</code> splits them into two buckets regardless. With <code>DESC</code>, NULLs sort FIRST by default', 'Hai giá trị NULL là đồng hạng, nên <code>rank</code> và <code>dense_rank</code> đều cho chúng số 1; <code>row_number</code> đánh 1 và 2 một cách tuỳ tiện còn <code>ntile</code> vẫn cứ chia chúng vào hai rổ. Với <code>DESC</code>, NULL mặc định sắp lên ĐẦU'),
            B('The NULLs were skipped by the window functions entirely, and the numbers shown belong to phantom rows PostgreSQL adds to keep the partition non-empty', 'Các giá trị NULL bị hàm cửa sổ bỏ qua hoàn toàn, và những con số hiện ra thuộc về các dòng ảo mà PostgreSQL thêm vào để phân vùng không bị rỗng'),
            B('All four agree here because there is no tie: NULL never equals NULL, so the two rows are distinct sort values and get distinct ranks 1 and 2', 'Cả bốn hàm đều thống nhất ở đây vì không có đồng hạng: NULL không bao giờ bằng NULL, nên hai dòng là hai giá trị sắp xếp khác nhau và nhận hạng 1 và 2 khác nhau'),
            B('<code>ntile(2)</code> is the odd one out because it requires a non-NULL sort key; the 1 and 2 it printed are the partition ids, not bucket numbers', '<code>ntile(2)</code> là cái lệch nhịp vì nó đòi khoá sắp xếp không được NULL; con số 1 và 2 nó in ra là id phân vùng chứ không phải số rổ'),
          ],
          correct: 0,
          explanation: EX(
            'Ordering inside a window uses the same "not distinct" notion as <code>GROUP BY</code>, so two NULLs are peers and share a rank — the opposite of what <code>=</code> would say. The four functions then differ exactly in how they treat that tie: <code>row_number</code> is always 1..N and breaks ties arbitrarily (use it when you need exactly one winner and do not care which); <code>rank</code> shares and then SKIPS (1, 2, 2, 4 — Olympic medals); <code>dense_rank</code> shares and does not skip (1, 2, 2, 3 — use it when the number is shown to a user and a gap would look like a bug); <code>ntile</code> ignores ties completely and just cuts the ordered rows into n roughly equal buckets, which is why two identical rows can land in different halves. Two practical notes: NULLs sort FIRST under <code>DESC</code> and LAST under <code>ASC</code> unless you write <code>NULLS LAST</code>/<code>NULLS FIRST</code>; and a <code>row_number</code> whose ordering is not deterministic will silently flip between runs — always end the window ORDER BY with a unique column.',
            'Việc sắp xếp bên trong một cửa sổ dùng đúng khái niệm "không khác biệt" như <code>GROUP BY</code>, nên hai giá trị NULL là đồng hạng và dùng chung một hạng — ngược hẳn với điều <code>=</code> sẽ nói. Bốn hàm khác nhau đúng ở cách đối xử với chỗ đồng hạng ấy: <code>row_number</code> luôn là 1..N và phá thế đồng hạng một cách tuỳ tiện (dùng khi bạn cần đúng một người thắng và không quan tâm là ai); <code>rank</code> dùng chung rồi NHẢY CÓC (1, 2, 2, 4 — kiểu huy chương Olympic); <code>dense_rank</code> dùng chung và không nhảy cóc (1, 2, 2, 3 — dùng khi con số được hiện cho người dùng và một khoảng trống sẽ trông như lỗi); <code>ntile</code> phớt lờ hoàn toàn chuyện đồng hạng và chỉ cắt dãy đã sắp thành n rổ xấp xỉ bằng nhau, và vì thế hai dòng giống hệt nhau có thể rơi vào hai nửa khác nhau. Hai ghi chú thực tế: NULL sắp lên ĐẦU khi <code>DESC</code> và xuống CUỐI khi <code>ASC</code>, trừ khi bạn viết <code>NULLS LAST</code>/<code>NULLS FIRST</code>; và một <code>row_number</code> có thứ tự không tất định sẽ âm thầm lật giữa các lần chạy — hãy luôn kết thúc ORDER BY của cửa sổ bằng một cột duy nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 over a region whose two rows both have <code>amount IS NULL</code>, ordered by <code>id</code>:' + code(
              'lag(amount)       OVER (PARTITION BY region ORDER BY id)  AS truoc,\n' +
              'lag(amount, 1, 0) OVER (PARTITION BY region ORDER BY id)  AS truoc0\n' +
              '\n' +
              ' region | id | amount | truoc | truoc0\n' +
              '--------+----+--------+-------+--------\n' +
              ' East   |  9 |        |       |      0\n' +
              ' East   | 10 |        |       |        ← still empty, not 0',
            ) + 'Why did the default <code>0</code> fill row 9 but not row 10?',
            'Đo trên PostgreSQL 16.14 trên một vùng có hai dòng đều mang <code>amount IS NULL</code>, sắp theo <code>id</code>:' + code(
              'lag(amount)       OVER (PARTITION BY region ORDER BY id)  AS truoc,\n' +
              'lag(amount, 1, 0) OVER (PARTITION BY region ORDER BY id)  AS truoc0\n' +
              '\n' +
              ' region | id | amount | truoc | truoc0\n' +
              '--------+----+--------+-------+--------\n' +
              ' East   |  9 |        |       |      0\n' +
              ' East   | 10 |        |       |        ← vẫn trống, không phải 0',
            ) + 'Vì sao giá trị mặc định <code>0</code> điền vào dòng 9 mà không điền vào dòng 10?',
          ),
          options: [
            B('Because the default only applies to the first row of the whole result set, not the first row of each partition, and row 9 happened to be first overall', 'Vì giá trị mặc định chỉ áp cho dòng đầu tiên của toàn bộ kết quả chứ không phải dòng đầu của mỗi phân vùng, và dòng 9 tình cờ là dòng đầu tiên nói chung'),
            B('Because the default is only used when the offset argument is omitted; writing <code>lag(amount, 1, 0)</code> explicitly disables it for every row after the first', 'Vì giá trị mặc định chỉ được dùng khi bỏ trống tham số bước nhảy; viết tường minh <code>lag(amount, 1, 0)</code> sẽ vô hiệu hoá nó cho mọi dòng sau dòng đầu tiên'),
            B('Because <code>lag</code> with three arguments switches to the <code>lead</code> direction, so row 10 is looking forward past the end of the partition', 'Vì <code>lag</code> với ba tham số chuyển sang hướng của <code>lead</code>, nên dòng 10 đang nhìn về phía trước, vượt qua cuối phân vùng'),
            B('Because the third argument of <code>lag</code> replaces a missing ROW, not a NULL VALUE. Row 9 has no previous row so the default fires; row 10 has one, and that row\'s <code>amount</code> is genuinely NULL, which is passed through unchanged', 'Vì tham số thứ ba của <code>lag</code> thay thế một DÒNG không tồn tại, chứ không phải một GIÁ TRỊ NULL. Dòng 9 không có dòng trước nên mặc định được dùng; dòng 10 thì có, và <code>amount</code> của dòng ấy đúng là NULL thật, nên nó được truyền qua nguyên vẹn'),
          ],
          correct: 3,
          explanation: EX(
            'Two different absences that both print as an empty cell, and <code>lag</code> only knows about one of them. "There is no row at that offset" (you are at the edge of the partition) is what the third argument handles. "There is a row and its value is NULL" is data, and it passes straight through — because that is the honest answer. This matters the moment you compute a delta: <code>amount - lag(amount, 1, 0) OVER w</code> gives a correct first row and NULL on any row whose predecessor had no value, so the chart shows a gap rather than a wrong number. If you want both absences flattened, wrap the whole thing: <code>coalesce(lag(amount) OVER w, 0)</code>. And remember <code>lag</code>/<code>lead</code> restart at every <code>PARTITION BY</code> boundary, which is what makes "compared with this seller\'s previous sale" different from "compared with the previous row in the table".',
            'Hai kiểu vắng mặt khác nhau nhưng đều in ra thành một ô trống, và <code>lag</code> chỉ biết tới một trong hai. "Không có dòng nào ở khoảng cách đó" (bạn đang ở rìa phân vùng) là thứ mà tham số thứ ba xử lý. Còn "có dòng, và giá trị của nó là NULL" là dữ liệu, và nó đi thẳng qua — vì đó mới là câu trả lời trung thực. Điều này quan trọng ngay khi bạn tính độ chênh: <code>amount - lag(amount, 1, 0) OVER w</code> cho dòng đầu đúng và cho NULL ở bất kỳ dòng nào mà dòng trước nó không có giá trị, nên biểu đồ hiện một khoảng trống thay vì một con số sai. Muốn gộp cả hai kiểu vắng mặt lại thì bọc cả cụm: <code>coalesce(lag(amount) OVER w, 0)</code>. Và nhớ rằng <code>lag</code>/<code>lead</code> khởi động lại ở mọi ranh giới <code>PARTITION BY</code>, đó là thứ làm cho "so với lượt bán trước của chính người bán này" khác với "so với dòng ngay trên trong bảng".',
          ),
        }),

        mcq({
          prompt: B(
            'A page must show every note with its author\'s total note count beside it. Which shape produces that, and what is the deciding question?',
            'Một trang cần hiện mọi note kèm theo tổng số note của tác giả nó ngay bên cạnh. Hình dạng nào cho ra điều đó, và câu hỏi quyết định là gì?',
          ),
          options: [
            B('<code>GROUP BY user_id</code> with <code>count(*)</code>, because grouping is the only way to compute a per-user number and the title comes along automatically', '<code>GROUP BY user_id</code> kèm <code>count(*)</code>, vì gom nhóm là cách duy nhất tính được một con số cho từng người dùng, và tiêu đề note tự đi kèm theo'),
            B('<code>count(*) OVER (PARTITION BY user_id)</code>. Ask how many rows the answer should have: one per note ⇒ a window function, one per user ⇒ <code>GROUP BY</code>. <code>PARTITION BY</code> divides the rows for the calculation and then hands EVERY row back', '<code>count(*) OVER (PARTITION BY user_id)</code>. Hãy hỏi câu trả lời nên có bao nhiêu dòng: mỗi note một dòng ⇒ hàm cửa sổ, mỗi người dùng một dòng ⇒ <code>GROUP BY</code>. <code>PARTITION BY</code> chia các dòng ra để tính rồi trả lại TOÀN BỘ các dòng'),
            B('Either one — <code>PARTITION BY</code> and <code>GROUP BY</code> are two spellings of the same operation, so pick whichever reads better in your team', 'Cái nào cũng được — <code>PARTITION BY</code> và <code>GROUP BY</code> là hai cách viết của cùng một phép toán, nên chọn cái nào đọc thuận hơn cho nhóm của bạn'),
            B('Neither: you must run the aggregate as a separate query and join it back, because a single query cannot produce both grains at once', 'Không cái nào: bạn phải chạy phép tổng hợp thành một truy vấn riêng rồi nối ngược lại, vì một truy vấn đơn không thể cho ra hai grain cùng lúc'),
          ],
          correct: 1,
          explanation: EX(
            'The two words sound like synonyms and do opposite things to your row count. <code>GROUP BY user_id</code> collapses twelve notes into one row — the individual notes stop existing, which is why PostgreSQL then refuses to let you select <code>title</code> at all. <code>COUNT(*) OVER (PARTITION BY user_id)</code> leaves twelve rows and writes the number 12 alongside each of them, with every original column still available because nothing was collapsed. The tell that you want a window function: you catch yourself computing an aggregate in a subquery and joining it back to the detail rows — that join is what <code>OVER</code> replaces, in one pass. The price is that window functions run AFTER <code>WHERE</code> and <code>GROUP BY</code>, so you cannot filter on their result in the same query\'s <code>WHERE</code>; "top 3 per user" needs the value computed in a CTE or subquery and filtered in the outer query.',
            'Hai từ này nghe như đồng nghĩa mà làm hai việc ngược nhau với số dòng của bạn. <code>GROUP BY user_id</code> gộp mười hai note thành một dòng — từng note riêng lẻ thôi tồn tại, và vì thế PostgreSQL từ chối luôn việc cho bạn chọn <code>title</code>. Còn <code>COUNT(*) OVER (PARTITION BY user_id)</code> giữ nguyên mười hai dòng và ghi con số 12 bên cạnh từng dòng, với mọi cột gốc vẫn còn đó vì chẳng có gì bị gộp cả. Dấu hiệu cho biết bạn cần hàm cửa sổ: bạn bắt gặp mình đang tính một hàm tổng hợp trong subquery rồi nối ngược lại với các dòng chi tiết — phép nối đó chính là thứ <code>OVER</code> thay thế, chỉ trong một lượt. Cái giá là hàm cửa sổ chạy SAU <code>WHERE</code> và <code>GROUP BY</code>, nên bạn không lọc được trên kết quả của nó trong <code>WHERE</code> của cùng truy vấn; "top 3 mỗi người" cần tính giá trị đó trong một CTE hoặc subquery rồi lọc ở truy vấn ngoài.',
          ),
        }),

        // ── Chương 9 — Chỉ mục ──────────────────────────────────────────
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. The table has 200 rows and there IS an index on <code>x</code>:' + code(
              'CREATE INDEX tiny_x ON tiny(x);\n' +
              'ANALYZE tiny;\n' +
              'EXPLAIN (ANALYZE) SELECT * FROM tiny WHERE x = 42;\n' +
              '\n' +
              ' Seq Scan on tiny  (cost=0.00..4.50 rows=1 width=12) (actual rows=1 loops=1)\n' +
              '   Filter: (x = 42)\n' +
              '   Rows Removed by Filter: 199',
            ) + 'The index is not used. Is the index broken, and what should you conclude?',
            'Đo trên PostgreSQL 16.14. Bảng có 200 dòng và CÓ chỉ mục trên <code>x</code>:' + code(
              'CREATE INDEX tiny_x ON tiny(x);\n' +
              'ANALYZE tiny;\n' +
              'EXPLAIN (ANALYZE) SELECT * FROM tiny WHERE x = 42;\n' +
              '\n' +
              ' Seq Scan on tiny  (cost=0.00..4.50 rows=1 width=12) (actual rows=1 loops=1)\n' +
              '   Filter: (x = 42)\n' +
              '   Rows Removed by Filter: 199',
            ) + 'Chỉ mục không được dùng. Chỉ mục có hỏng không, và bạn nên kết luận gì?',
          ),
          options: [
            B('The index is broken by the <code>ANALYZE</code> that followed it; run <code>REINDEX tiny_x</code> and the plan will switch to an Index Scan', 'Chỉ mục bị lệnh <code>ANALYZE</code> chạy ngay sau đó làm hỏng; chạy <code>REINDEX tiny_x</code> thì kế hoạch sẽ chuyển sang Index Scan'),
            B('The index cannot be used for an equality test on an <code>int</code> column; B-tree indexes only accelerate range predicates such as <code>&gt;</code> and <code>BETWEEN</code>', 'Chỉ mục không dùng được cho phép so bằng trên một cột <code>int</code>; chỉ mục B-tree chỉ tăng tốc các vị từ khoảng như <code>&gt;</code> và <code>BETWEEN</code>'),
            B('Nothing is broken: the whole table fits in a handful of pages, so reading it end to end costs less than walking the index and then fetching the row. The planner is right, and this is why a benchmark on a tiny table proves nothing about production', 'Không có gì hỏng: cả bảng nằm gọn trong vài trang, nên đọc từ đầu tới cuối còn rẻ hơn đi qua chỉ mục rồi mới lấy dòng. Bộ lập kế hoạch đúng, và đó là lý do một phép đo trên bảng tí hon không chứng minh được gì về production'),
            B('The plan is stale: <code>EXPLAIN</code> reuses the last plan for that query text, and the index was created after the plan was first cached', 'Kế hoạch bị cũ: <code>EXPLAIN</code> dùng lại kế hoạch lần trước cho cùng đoạn văn bản truy vấn, và chỉ mục được tạo sau khi kế hoạch được lưu vào bộ đệm lần đầu'),
          ],
          correct: 2,
          explanation: EX(
            'Creating an index always succeeds; USING it is a decision the planner makes independently, from cost. On 200 rows the whole relation is a page or two, and a sequential read of two pages beats descending a B-tree and then jumping back to the heap for the row. That is a correct decision, and it is the single most common reason a developer concludes "my index does not work" — measured on a table small enough that it genuinely should not. The same reasoning at scale is selectivity: on the 500,000-row table in this container, <code>WHERE status = \'active\'</code> (166,666 rows, a third of the table) also chose a sequential scan, while <code>WHERE status = \'pending\'</code> (3,436 rows) switched to a Bitmap Index Scan — same index, opposite decision, both correct. An index earns its keep when a query returns a SMALL FRACTION of the table. Test index changes against production-sized data, and confirm with <code>EXPLAIN</code> rather than assuming.',
            'Tạo chỉ mục thì luôn thành công; còn DÙNG nó là một quyết định độc lập của bộ lập kế hoạch, dựa trên chi phí. Với 200 dòng thì cả quan hệ chỉ là một hai trang, và đọc tuần tự hai trang thì rẻ hơn việc tụt xuống một cây B-tree rồi nhảy ngược về heap lấy dòng. Đó là một quyết định đúng, và nó là lý do phổ biến nhất khiến một lập trình viên kết luận "chỉ mục của tôi không chạy" — đo trên một cái bảng nhỏ tới mức lẽ ra nó không nên chạy. Cũng lý lẽ ấy ở quy mô lớn thì gọi là độ chọn lọc: trên bảng 500.000 dòng trong container này, <code>WHERE status = \'active\'</code> (166.666 dòng, một phần ba bảng) cũng chọn quét tuần tự, còn <code>WHERE status = \'pending\'</code> (3.436 dòng) thì chuyển sang Bitmap Index Scan — cùng một chỉ mục, quyết định ngược nhau, và cả hai đều đúng. Chỉ mục đáng đồng tiền khi truy vấn trả về một PHẦN NHỎ của bảng. Hãy thử các thay đổi về chỉ mục trên dữ liệu cỡ production, và xác nhận bằng <code>EXPLAIN</code> thay vì tin là được.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on a freshly loaded 500,000-row table with <code>CREATE INDEX big_ui ON big(user_id) INCLUDE (amount)</code>. The SAME query, before and after one command:' + code(
              '-- right after the bulk load\n' +
              ' Bitmap Heap Scan on big  (actual rows=500 loops=1)\n' +
              '   Recheck Cond: (user_id = 42)\n' +
              '   Heap Blocks: exact=500\n' +
              '\n' +
              '-- after VACUUM (ANALYZE) big;\n' +
              ' Index Only Scan using big_ui on big  (actual rows=500 loops=1)\n' +
              '   Index Cond: (user_id = 42)\n' +
              '   Heap Fetches: 0',
            ) + 'What did <code>VACUUM</code> change?',
            'Đo trên PostgreSQL 16.14 trên bảng 500.000 dòng vừa nạp xong, có <code>CREATE INDEX big_ui ON big(user_id) INCLUDE (amount)</code>. CÙNG một truy vấn, trước và sau một lệnh:' + code(
              '-- ngay sau khi nạp hàng loạt\n' +
              ' Bitmap Heap Scan on big  (actual rows=500 loops=1)\n' +
              '   Recheck Cond: (user_id = 42)\n' +
              '   Heap Blocks: exact=500\n' +
              '\n' +
              '-- sau VACUUM (ANALYZE) big;\n' +
              ' Index Only Scan using big_ui on big  (actual rows=500 loops=1)\n' +
              '   Index Cond: (user_id = 42)\n' +
              '   Heap Fetches: 0',
            ) + '<code>VACUUM</code> đã thay đổi điều gì?',
          ),
          options: [
            B('It rebuilt the index so that the <code>INCLUDE</code> column was finally stored in the leaf pages; before the vacuum, <code>amount</code> existed only in the table', 'Nó dựng lại chỉ mục để cột <code>INCLUDE</code> cuối cùng cũng được lưu vào các trang lá; trước lần vacuum đó, <code>amount</code> chỉ tồn tại trong bảng'),
            B('It removed dead tuples left by the bulk load; a Bitmap Heap Scan is what PostgreSQL always uses while a table still contains any dead rows', 'Nó dọn các dead tuple mà lần nạp hàng loạt để lại; Bitmap Heap Scan là thứ PostgreSQL luôn dùng chừng nào bảng còn chứa dòng chết'),
            B('Only the <code>ANALYZE</code> half mattered: fresh statistics made the planner estimate fewer rows, and below 500 rows it always prefers an Index Only Scan', 'Chỉ có nửa <code>ANALYZE</code> là quan trọng: thống kê mới khiến bộ lập kế hoạch ước lượng ít dòng hơn, và dưới 500 dòng thì nó luôn ưu tiên Index Only Scan'),
            B('It set the VISIBILITY MAP. An Index Only Scan may skip the table only for pages the map marks all-visible, and only VACUUM sets those bits — so a freshly loaded table cannot get one no matter how perfect the index is', 'Nó đặt BẢN ĐỒ HIỂN THỊ. Một Index Only Scan chỉ được phép bỏ qua bảng ở những trang mà bản đồ đánh dấu là "mọi dòng đều nhìn thấy được", và chỉ VACUUM mới đặt các bit đó — nên một bảng vừa nạp xong thì không thể có Index Only Scan dù chỉ mục hoàn hảo đến đâu'),
          ],
          correct: 3,
          explanation: EX(
            'An index entry does not know whether its row is visible to your snapshot — that information lives in the heap tuple (Chapter 11: <code>xmin</code>/<code>xmax</code>). So an Index Only Scan is only "only" when PostgreSQL can prove the whole page is visible to everyone, and that proof is the visibility map, whose bits are set by <code>VACUUM</code>. Before the vacuum the plan must visit the heap anyway, so the covering index buys nothing and the planner picks a bitmap scan instead. <code>Heap Fetches: 0</code> in the second plan is the number to read: it is the count of rows the scan had to go back to the table for, and a non-zero value on a supposedly index-only scan means the map has gone stale — usually because the table is churning faster than autovacuum keeps up (Chapter 14). Two consequences: after a bulk load, run <code>VACUUM ANALYZE</code> and not just <code>ANALYZE</code>; and a covering index on a write-heavy table may never deliver its promise.',
            'Một mục trong chỉ mục không biết dòng của nó có hiển thị với ảnh chụp của bạn hay không — thông tin đó nằm trong tuple ở heap (Chương 11: <code>xmin</code>/<code>xmax</code>). Nên một Index Only Scan chỉ thật sự "only" khi PostgreSQL chứng minh được cả trang đó ai cũng nhìn thấy, và bằng chứng ấy là bản đồ hiển thị, mà các bit của nó do <code>VACUUM</code> đặt. Trước khi vacuum thì kế hoạch vẫn phải ghé heap, nên chỉ mục bao phủ chẳng mua được gì và bộ lập kế hoạch chọn bitmap scan thay thế. <code>Heap Fetches: 0</code> ở kế hoạch thứ hai là con số cần đọc: nó đếm số dòng mà phép quét buộc phải quay lại bảng để lấy, và một giá trị khác 0 trên một phép quét lẽ ra "chỉ dùng chỉ mục" nghĩa là bản đồ đã cũ — thường vì bảng đang biến động nhanh hơn tốc độ autovacuum theo kịp (Chương 14). Hai hệ quả: sau một lần nạp hàng loạt, hãy chạy <code>VACUUM ANALYZE</code> chứ không chỉ <code>ANALYZE</code>; và một chỉ mục bao phủ trên bảng ghi nhiều có thể chẳng bao giờ thực hiện được lời hứa của nó.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 with ONE index, <code>big_uc ON big(user_id, created_at)</code>, on a 500,000-row table:' + code(
              '-- A: filters on the LEADING column, sorts by the second\n' +
              ' Limit  (cost=0.42..20.03 rows=5)\n' +
              '   ->  Index Scan Backward using big_uc on big  (actual rows=5 loops=1)\n' +
              '         Index Cond: (user_id = 42)\n' +
              '\n' +
              '-- B: filters on the SECOND column only\n' +
              ' Index Scan using big_uc on big  (cost=0.42..11466.43 rows=1) (actual rows=1 loops=1)\n' +
              '       Index Cond: (created_at = ...)',
            ) + 'Both used the index. Is the left-prefix rule wrong?',
            'Đo trên PostgreSQL 16.14 với MỘT chỉ mục duy nhất, <code>big_uc ON big(user_id, created_at)</code>, trên bảng 500.000 dòng:' + code(
              '-- A: lọc theo cột ĐẦU, sắp theo cột thứ hai\n' +
              ' Limit  (cost=0.42..20.03 rows=5)\n' +
              '   ->  Index Scan Backward using big_uc on big  (actual rows=5 loops=1)\n' +
              '         Index Cond: (user_id = 42)\n' +
              '\n' +
              '-- B: chỉ lọc theo cột THỨ HAI\n' +
              ' Index Scan using big_uc on big  (cost=0.42..11466.43 rows=1) (actual rows=1 loops=1)\n' +
              '       Index Cond: (created_at = ...)',
            ) + 'Cả hai đều dùng chỉ mục. Vậy luật tiền tố trái sai à?',
          ),
          options: [
            B('Yes — PostgreSQL 16 removed the left-prefix restriction, so column order in a composite index no longer matters for equality predicates', 'Đúng — PostgreSQL 16 đã bỏ hạn chế tiền tố trái, nên thứ tự cột trong một chỉ mục tổ hợp không còn quan trọng với các vị từ so bằng nữa'),
            B('No — look at the COST. A can SEEK (start at user 42 and read 5 entries, cost 20). B cannot seek without the leading column, so it SCANS the entire index and filters, cost 11466 — barely different from a table scan. Using an index and seeking in one are different things', 'Không — hãy nhìn CHI PHÍ. A TÌM KIẾM được (nhảy tới user 42 rồi đọc 5 mục, chi phí 20). B không tìm kiếm được vì thiếu cột dẫn đầu, nên nó QUÉT toàn bộ chỉ mục rồi lọc, chi phí 11466 — chênh chẳng bao nhiêu so với quét bảng. Dùng chỉ mục và tìm kiếm trong chỉ mục là hai chuyện khác nhau'),
            B('No — B did not really use the index; <code>Index Cond</code> without a <code>Filter</code> line means the condition was pushed to the heap, so B is a sequential scan under another name', 'Không — B không thật sự dùng chỉ mục; <code>Index Cond</code> mà không có dòng <code>Filter</code> nghĩa là điều kiện được đẩy xuống heap, nên B là quét tuần tự dưới một cái tên khác'),
            B('Yes for equality but not for sorting: B works because <code>created_at</code> is the last column, and a query filtering on <code>user_id</code> alone would have been the one to fail', 'Đúng với so bằng nhưng không đúng với sắp xếp: B chạy được vì <code>created_at</code> là cột cuối, và chính truy vấn chỉ lọc theo <code>user_id</code> mới là cái sẽ hỏng'),
          ],
          correct: 1,
          explanation: EX(
            'Think of the index as a phone book sorted by (last name, first name). "Everyone named Nguyen" is a seek: jump to the N section and read forward. "Everyone whose given name is An" cannot be looked up — but you can still read the whole book cover to cover and pick them out, which is slower than the seek and, because the book is thinner than the full records, sometimes still marginally cheaper than reading every file. That is exactly what plan B is: a full index scan, cost 11466 against roughly 10900 for scanning the table itself. The rule survives intact — <b>equality columns first, the range or sort column last</b> — and the plan node name alone will not tell you whether it held. Read the cost, and read whether the leading column appears in <code>Index Cond</code>. Note also what A got for free: no <code>Sort</code> node at all, because the index already delivers user 42\'s rows in <code>created_at</code> order, so <code>Index Scan Backward</code> plus <code>LIMIT 5</code> stops after five entries.',
            'Hãy hình dung chỉ mục như một cuốn danh bạ sắp theo (họ, tên). "Mọi người họ Nguyễn" là một phép tìm kiếm: nhảy tới mục N rồi đọc tiếp. "Mọi người tên An" thì không tra được — nhưng bạn vẫn có thể đọc hết cả cuốn từ đầu tới cuối rồi nhặt ra, chậm hơn phép tìm kiếm và, vì cuốn danh bạ mỏng hơn toàn bộ hồ sơ, đôi khi vẫn rẻ hơn chút ít so với đọc từng hồ sơ. Kế hoạch B đúng là như thế: một lần quét toàn bộ chỉ mục, chi phí 11466 so với khoảng 10900 của việc quét chính cái bảng. Luật vẫn nguyên vẹn — <b>cột so bằng trước, cột khoảng hoặc cột sắp xếp sau cùng</b> — và riêng cái tên node trong plan thì không cho bạn biết luật có được thoả hay không. Hãy đọc chi phí, và đọc xem cột dẫn đầu có xuất hiện trong <code>Index Cond</code> không. Cũng để ý thứ A được tặng miễn phí: không có node <code>Sort</code> nào cả, vì chỉ mục vốn đã trả các dòng của user 42 theo đúng thứ tự <code>created_at</code>, nên <code>Index Scan Backward</code> cộng <code>LIMIT 5</code> dừng lại sau năm mục.',
          ),
        }),

        mcq({
          prompt: B(
            'A colleague proposes adding six indexes to a write-heavy table "since reads are what users notice". What is the honest accounting, and how do you find the ones already not paying for themselves?',
            'Một đồng nghiệp đề nghị thêm sáu chỉ mục vào một bảng ghi nhiều "vì người dùng chỉ để ý tới việc đọc". Hạch toán trung thực là gì, và làm sao tìm ra những chỉ mục vốn đã không bù nổi chi phí của chính nó?',
          ),
          options: [
            B('Indexes are free on writes because PostgreSQL updates them asynchronously after COMMIT; the only cost is disk, so add them freely and drop the ones that run out of space', 'Chỉ mục miễn phí với việc ghi vì PostgreSQL cập nhật chúng bất đồng bộ sau COMMIT; chi phí duy nhất là dung lượng đĩa, nên cứ thêm thoải mái rồi bỏ bớt cái nào hết chỗ'),
            B('Every index must be maintained on every INSERT, UPDATE and DELETE, so writes slow down roughly with the number of indexes, and an unused index is pure cost. Find them with <code>SELECT relname, indexrelname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan = 0</code>', 'Mọi chỉ mục đều phải được duy trì ở mọi lệnh INSERT, UPDATE và DELETE, nên tốc độ ghi giảm xấp xỉ theo số chỉ mục, và một chỉ mục không ai dùng là chi phí thuần. Tìm chúng bằng <code>SELECT relname, indexrelname, idx_scan FROM pg_stat_user_indexes WHERE idx_scan = 0</code>'),
            B('Only UNIQUE indexes cost anything on write, because they must check for duplicates; ordinary B-tree indexes are appended to lazily by the background writer', 'Chỉ chỉ mục UNIQUE mới tốn gì đó lúc ghi, vì nó phải kiểm trùng; còn chỉ mục B-tree thường thì được background writer nối thêm vào một cách thong thả'),
            B('The cost is real but unmeasurable from inside PostgreSQL; the only way to find unused indexes is to drop one and watch whether any query gets slower', 'Chi phí là có thật nhưng không đo được từ bên trong PostgreSQL; cách duy nhất để tìm chỉ mục vô dụng là bỏ đi một cái rồi xem có truy vấn nào chậm đi không'),
          ],
          correct: 1,
          explanation: EX(
            'An index is a second copy of part of your data kept permanently in step, and "in step" is paid for on the write path, synchronously, inside the same transaction. Lesson 9.3 measured it on this very shape of table: inserting 100,000 rows into a bare copy took a fraction of the time it took into the same table carrying nine indexes. So the accounting is one-sided in a way people forget — a read that never happens gains nothing, while every write pays. <code>pg_stat_user_indexes.idx_scan = 0</code> is the tool, with two cautions before you drop anything: the counters reset on <code>pg_stat_reset()</code> and on a restore, so check <code>stats_reset</code> in <code>pg_stat_database</code> first; and a unique index may exist to enforce a constraint rather than to speed a query, so an unused one can still be doing essential work. The discipline that follows: index what you actually filter, join and sort on, prefer one well-ordered composite index over three single-column ones, and treat every index as a standing tax you must justify.',
            'Một chỉ mục là bản sao thứ hai của một phần dữ liệu, được giữ đồng bộ vĩnh viễn, và cái "đồng bộ" ấy được trả tiền trên đường ghi, đồng bộ, ngay trong cùng giao dịch. Bài 9.3 đã đo trên đúng hình dạng bảng này: chèn 100.000 dòng vào một bản trần mất một phần nhỏ thời gian so với chèn vào chính cái bảng đó khi nó mang chín chỉ mục. Nên phép hạch toán lệch một bên theo cách người ta hay quên — một lượt đọc không bao giờ xảy ra thì chẳng lợi gì, còn mọi lượt ghi đều phải trả. <code>pg_stat_user_indexes.idx_scan = 0</code> là công cụ, kèm hai lưu ý trước khi bỏ bất cứ cái gì: bộ đếm bị đặt lại khi chạy <code>pg_stat_reset()</code> và khi khôi phục dữ liệu, nên hãy xem <code>stats_reset</code> trong <code>pg_stat_database</code> trước; và một chỉ mục duy nhất có thể tồn tại để thực thi ràng buộc chứ không phải để tăng tốc truy vấn, nên một cái "không ai dùng" vẫn có thể đang làm việc thiết yếu. Kỷ luật rút ra: chỉ mục hoá đúng những gì bạn thật sự lọc, nối và sắp theo; ưu tiên một chỉ mục tổ hợp đúng thứ tự hơn ba chỉ mục một cột; và coi mỗi chỉ mục là một khoản thuế thường trực mà bạn phải biện minh được.',
          ),
        }),

        mcq({
          prompt: B(
            'An append-only <code>event</code> table is written in timestamp order and grows to hundreds of millions of rows. Range queries on <code>created_at</code> must stay fast, but a B-tree on that column is now larger than you want to keep in cache. Which index type fits, and what is its precondition?',
            'Một bảng <code>event</code> chỉ ghi thêm, được ghi theo thứ tự thời gian, và phình lên hàng trăm triệu dòng. Truy vấn theo khoảng trên <code>created_at</code> phải giữ được tốc độ, nhưng một B-tree trên cột đó giờ đã lớn hơn mức bạn muốn giữ trong cache. Loại chỉ mục nào hợp, và điều kiện tiên quyết của nó là gì?',
          ),
          options: [
            B('<code>GIN</code>, because it indexes the elements inside a value and a timestamp decomposes into year, month and day — the precondition is that the column is <code>NOT NULL</code>', '<code>GIN</code>, vì nó lập chỉ mục các phần tử bên trong một giá trị và một mốc thời gian phân rã thành năm, tháng, ngày — điều kiện tiên quyết là cột phải <code>NOT NULL</code>'),
            B('<code>Hash</code>, because it stores a fixed-size digest per row rather than the value, which is what keeps it small — the precondition is that you only ever query with <code>BETWEEN</code>', '<code>Hash</code>, vì nó lưu một bản tóm tắt cỡ cố định cho mỗi dòng thay vì giá trị, và đó là thứ giữ cho nó nhỏ — điều kiện tiên quyết là bạn chỉ truy vấn bằng <code>BETWEEN</code>'),
            B('<code>GiST</code>, because a timestamp range is a geometric interval — the precondition is installing the <code>btree_gist</code> extension first', '<code>GiST</code>, vì một khoảng thời gian là một khoảng hình học — điều kiện tiên quyết là phải cài phần mở rộng <code>btree_gist</code> trước'),
            B('<code>BRIN</code>: it stores only a min/max summary per block range, so it is orders of magnitude smaller than a B-tree — and it only works because the column\'s PHYSICAL order on disk matches its logical order, which append-only time-series data gives you for free', '<code>BRIN</code>: nó chỉ lưu tóm tắt min/max cho mỗi dải khối, nên nhỏ hơn B-tree tới vài bậc độ lớn — và nó chỉ chạy được nhờ thứ tự VẬT LÝ của cột trên đĩa trùng với thứ tự logic của nó, thứ mà dữ liệu chuỗi thời gian chỉ-ghi-thêm cho bạn miễn phí'),
          ],
          correct: 3,
          explanation: EX(
            'BRIN is the one index type whose usefulness is a property of your INSERT pattern rather than of your query. It records the smallest and largest value in each range of blocks, so a range predicate can skip whole swaths of the table without ever storing a per-row entry — lesson 9.4 measured 24 kB against 11 MB for a B-tree on the same 500,000 rows. The precondition is the whole story: if rows arrive in timestamp order, each block range has a tight min/max and the summary is selective. Shuffle the physical order — random inserts, heavy updates moving rows, a <code>CLUSTER</code> on a different column — and every block range spans the whole date span, the summary excludes nothing, and BRIN degrades to a sequential scan with extra steps. Also note BRIN is lossy by design: the plan always shows <code>Bitmap Heap Scan</code> with a <code>Recheck Cond</code> and <code>Heap Blocks: lossy=…</code>, because the index narrows to candidate BLOCKS and the rows inside them must be re-tested.',
            'BRIN là loại chỉ mục duy nhất mà tính hữu dụng của nó là một tính chất của cách bạn CHÈN chứ không phải của truy vấn. Nó ghi lại giá trị nhỏ nhất và lớn nhất trong mỗi dải khối, nên một vị từ khoảng có thể bỏ qua từng mảng lớn của bảng mà không cần lưu một mục cho mỗi dòng — bài 9.4 đo được 24 kB so với 11 MB của B-tree trên cùng 500.000 dòng. Điều kiện tiên quyết chính là toàn bộ câu chuyện: nếu các dòng tới theo thứ tự thời gian thì mỗi dải khối có min/max chặt và bản tóm tắt có tính chọn lọc. Xáo trộn thứ tự vật lý đi — chèn ngẫu nhiên, update nhiều làm dòng dịch chỗ, một lệnh <code>CLUSTER</code> theo cột khác — thì mọi dải khối đều trải khắp toàn bộ khoảng ngày, bản tóm tắt chẳng loại được gì, và BRIN suy biến thành quét tuần tự cộng thêm mấy bước thừa. Cũng để ý BRIN vốn dĩ "lossy": kế hoạch luôn hiện <code>Bitmap Heap Scan</code> kèm <code>Recheck Cond</code> và <code>Heap Blocks: lossy=…</code>, vì chỉ mục chỉ thu hẹp về các KHỐI ứng viên và các dòng bên trong vẫn phải kiểm lại.',
          ),
        }),

        // ── Chương 10 — EXPLAIN & bộ lập kế hoạch ───────────────────────
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on a 10,000-row <code>customer</code> table where <code>city</code> fully determines <code>region</code>. One command sat between the two plans:' + code(
              ' Seq Scan on customer  (cost=0.00..214.00 rows=400) (actual rows=2000 loops=1)\n' +
              "   Filter: ((city = 'Hanoi') AND (region = 'North'))\n" +
              '\n' +
              'CREATE STATISTICS st_cr (dependencies) ON city, region FROM customer;\n' +
              'ANALYZE customer;\n' +
              '\n' +
              ' Seq Scan on customer  (cost=0.00..214.00 rows=2000) (actual rows=2000 loops=1)',
            ) + 'Why was the first estimate 400, and why does a 5× underestimate matter when the plan did not even change?',
            'Đo trên PostgreSQL 16.14 trên bảng <code>customer</code> 10.000 dòng, nơi <code>city</code> quyết định hoàn toàn <code>region</code>. Một lệnh nằm giữa hai kế hoạch:' + code(
              ' Seq Scan on customer  (cost=0.00..214.00 rows=400) (actual rows=2000 loops=1)\n' +
              "   Filter: ((city = 'Hanoi') AND (region = 'North'))\n" +
              '\n' +
              'CREATE STATISTICS st_cr (dependencies) ON city, region FROM customer;\n' +
              'ANALYZE customer;\n' +
              '\n' +
              ' Seq Scan on customer  (cost=0.00..214.00 rows=2000) (actual rows=2000 loops=1)',
            ) + 'Vì sao ước lượng đầu tiên là 400, và vì sao ước lượng thấp 5 lần lại quan trọng khi kế hoạch còn chẳng đổi?',
          ),
          options: [
            B('The planner assumes columns are INDEPENDENT and multiplies their selectivities — 1/5 × 1/5 of 10,000 = 400 — but <code>region</code> adds no filtering once <code>city</code> is fixed. It matters because this estimate feeds every node above it: on a join, a 5× underestimate is what pushes the planner into a Nested Loop that then runs millions of times', 'Bộ lập kế hoạch giả định các cột ĐỘC LẬP với nhau và nhân các độ chọn lọc lại — 1/5 × 1/5 của 10.000 = 400 — nhưng <code>region</code> chẳng lọc thêm được gì một khi <code>city</code> đã cố định. Nó quan trọng vì ước lượng này nuôi mọi node phía trên: trên một phép nối, ước lượng thấp 5 lần chính là thứ đẩy bộ lập kế hoạch vào một Nested Loop rồi chạy hàng triệu vòng'),
            B('The 400 was simply the number of rows sampled by the last <code>ANALYZE</code> run on this table; <code>CREATE STATISTICS</code> raises the sample size for the columns it names, which is the whole reason the second number happens to match reality', 'Con số 400 chỉ đơn giản là số dòng mà lần <code>ANALYZE</code> gần nhất lấy mẫu trên bảng này; <code>CREATE STATISTICS</code> nâng cỡ mẫu cho những cột nó nêu tên, và đó là toàn bộ lý do con số thứ hai tình cờ khớp với thực tế'),
            B('The first plan was built while the table was still empty, and PostgreSQL falls back to a hard-coded default of 400 rows whenever it has no statistics at all for a relation', 'Kế hoạch đầu được dựng khi bảng còn rỗng, và PostgreSQL rơi về một mặc định cứng là 400 dòng mỗi khi nó hoàn toàn không có thống kê nào cho một quan hệ'),
            B('It does not matter at all — the cost stayed at 214.00 and the node stayed a Seq Scan either way, so the estimate is cosmetic here and <code>CREATE STATISTICS</code> exists only to make EXPLAIN output easier for a human to read', 'Nó hoàn toàn không quan trọng — chi phí vẫn là 214.00 và node vẫn là Seq Scan ở cả hai lượt, nên ước lượng ở đây chỉ mang tính trang trí và <code>CREATE STATISTICS</code> tồn tại chỉ để output của EXPLAIN dễ đọc hơn với con người'),
          ],
          correct: 0,
          explanation: EX(
            'Every <code>rows=</code> in a plan comes from statistics <code>ANALYZE</code> collected: distinct counts, most common values, a histogram. For a single predicate those are usually good. For two predicates the planner multiplies their selectivities, which is exactly right when the columns are independent and exactly wrong when one determines the other — here 1 in 5 customers are in Hanoi and 1 in 5 are in the North, so it reasoned 1/25, while the real answer is 1/5. <code>CREATE STATISTICS … (dependencies)</code> teaches it the functional dependency and the estimate lands on 2000. The reason to care in a query where the node did not change is that the estimate is an INPUT to every decision above it — join strategy, join order, whether to hash or sort, how much <code>work_mem</code> to expect. The diagnostic habit worth building: in any <code>EXPLAIN ANALYZE</code>, compare <code>rows=</code> with <code>actual rows=</code> node by node, and treat a large gap as the root cause rather than a curiosity. Stale stats after a bulk load, a sample that is too small, or correlated columns are the three usual reasons.',
            'Mọi con số <code>rows=</code> trong một kế hoạch đều đến từ thống kê mà <code>ANALYZE</code> thu thập: số giá trị phân biệt, các giá trị phổ biến nhất, một biểu đồ tần suất. Với một vị từ đơn thì chúng thường tốt. Với hai vị từ, bộ lập kế hoạch nhân hai độ chọn lọc lại — đúng chính xác khi hai cột độc lập, và sai chính xác khi cột này quyết định cột kia: ở đây cứ 5 khách thì 1 ở Hà Nội và cứ 5 khách thì 1 ở miền Bắc, nên nó suy ra 1/25, trong khi đáp án thật là 1/5. <code>CREATE STATISTICS … (dependencies)</code> dạy nó mối phụ thuộc hàm và ước lượng đáp xuống đúng 2000. Lý do phải quan tâm ngay cả khi node không đổi là vì ước lượng đó là ĐẦU VÀO của mọi quyết định phía trên nó — chọn chiến lược nối, thứ tự nối, băm hay sắp, cần bao nhiêu <code>work_mem</code>. Thói quen chẩn đoán đáng xây: trong mọi <code>EXPLAIN ANALYZE</code>, hãy so <code>rows=</code> với <code>actual rows=</code> theo từng node, và coi một khoảng cách lớn là nguyên nhân gốc chứ không phải chuyện lạ để ngắm. Thống kê cũ sau một lần nạp hàng loạt, mẫu quá nhỏ, hoặc các cột tương quan là ba lý do thường gặp.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 on a 500,000-row table. The course text shows this shape as a single <code>Seq Scan</code> line; the machine printed this:' + code(
              ' Gather  (cost=1000.00..11909.27 rows=1) (actual rows=1 loops=1)\n' +
              '   Workers Planned: 2\n' +
              '   Workers Launched: 2\n' +
              '   ->  Parallel Seq Scan on big  (cost=0.00..10909.17 rows=1) (actual rows=0 loops=3)\n' +
              "         Filter: (email = 'user250000@example.com')\n" +
              '         Rows Removed by Filter: 166666',
            ) + 'The table has 500,000 rows and exactly one matches. How do you read <code>Rows Removed by Filter: 166666</code> and <code>actual rows=0</code>?',
            'Đo trên PostgreSQL 16.14 trên bảng 500.000 dòng. Giáo trình in hình dạng này thành một dòng <code>Seq Scan</code> duy nhất; còn máy thì in ra thế này:' + code(
              ' Gather  (cost=1000.00..11909.27 rows=1) (actual rows=1 loops=1)\n' +
              '   Workers Planned: 2\n' +
              '   Workers Launched: 2\n' +
              '   ->  Parallel Seq Scan on big  (cost=0.00..10909.17 rows=1) (actual rows=0 loops=3)\n' +
              "         Filter: (email = 'user250000@example.com')\n" +
              '         Rows Removed by Filter: 166666',
            ) + 'Bảng có 500.000 dòng và đúng một dòng khớp. Bạn đọc <code>Rows Removed by Filter: 166666</code> và <code>actual rows=0</code> thế nào?',
          ),
          options: [
            B('The scan examined only 166,666 rows because the parallel workers stopped as soon as one of them found the match, which is why the other two report zero rows', 'Phép quét chỉ xét 166.666 dòng vì các tiến trình song song dừng ngay khi một trong số chúng tìm thấy dòng khớp, và vì thế hai cái còn lại báo không dòng nào'),
            B('<code>actual rows=0</code> means the query returned nothing and the <code>rows=1</code> on the Gather node is a leftover estimate; the match was found in the index, not in this scan', '<code>actual rows=0</code> nghĩa là truy vấn không trả về gì và con số <code>rows=1</code> trên node Gather chỉ là ước lượng còn sót lại; dòng khớp được tìm thấy trong chỉ mục chứ không phải trong phép quét này'),
            B('<code>Rows Removed by Filter</code> is always the estimate, not the actual, so 166,666 is what the planner expected each worker to discard and has no relation to what happened', '<code>Rows Removed by Filter</code> luôn là ước lượng chứ không phải số thật, nên 166.666 là con số bộ lập kế hoạch nghĩ mỗi worker sẽ vứt đi, và không liên quan gì tới thực tế'),
            B('The numbers on a parallel node are PER LOOP, i.e. per worker process, and <code>loops=3</code> is 2 workers plus the leader — so ~166,666 × 3 ≈ 500,000 rows were examined in total, and the average worker produced 0 matching rows while the one that found it rounded down', 'Các con số trên một node song song là TRÊN MỖI LOOP, tức là trên mỗi tiến trình, và <code>loops=3</code> là 2 worker cộng tiến trình dẫn — nên tổng cộng ~166.666 × 3 ≈ 500.000 dòng đã được xét, còn worker trung bình cho ra 0 dòng khớp vì cái tìm ra nó bị làm tròn xuống'),
          ],
          correct: 3,
          explanation: EX(
            'This is the reading habit that PostgreSQL 16 forces on you and the course text (written against 15.4) does not show. Below a <code>Gather</code>, every <code>actual</code> figure is per loop and <code>loops</code> counts the participating processes — the two launched workers plus the leader, which also does its share. So you multiply: 166,666 discarded per process × 3 ≈ the whole table, which is the honest picture of the work done. The <code>rows=0</code> is the same arithmetic: one process found one row, two found none, and the per-loop average is reported rounded down. The same rule is what makes a Nested Loop readable — a node showing <code>actual time=0.03 rows=1 loops=5000</code> did not take 0.03 ms, it took about 150 ms. Always multiply by <code>loops</code> before deciding a node is cheap, and note that <code>Workers Launched</code> can be lower than <code>Workers Planned</code> when the server is busy, which changes the timing without changing the plan.',
            'Đây là thói quen đọc mà PostgreSQL 16 buộc bạn phải có, còn giáo trình (viết trên 15.4) thì không chỉ ra. Bên dưới một node <code>Gather</code>, mọi con số <code>actual</code> đều là trên mỗi loop và <code>loops</code> đếm số tiến trình tham gia — hai worker được khởi chạy cộng với tiến trình dẫn, vốn cũng làm phần việc của mình. Nên bạn phải nhân lên: 166.666 dòng bị vứt trên mỗi tiến trình × 3 ≈ cả bảng, và đó mới là bức tranh trung thực về khối lượng công việc. Con số <code>rows=0</code> cũng là phép tính ấy: một tiến trình tìm được một dòng, hai tiến trình không tìm được gì, và giá trị trung bình trên mỗi loop được báo cáo sau khi làm tròn xuống. Cũng luật đó làm cho một Nested Loop đọc được — một node hiện <code>actual time=0.03 rows=1 loops=5000</code> không hề tốn 0,03 ms, nó tốn khoảng 150 ms. Hãy luôn nhân với <code>loops</code> trước khi kết luận một node là rẻ, và để ý <code>Workers Launched</code> có thể thấp hơn <code>Workers Planned</code> khi máy chủ bận — chuyện đó đổi thời gian mà không đổi kế hoạch.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14, joining 500,000 orders to 10,000 customers with no filter:' + code(
              ' Hash Join  (actual rows=166667 loops=3)\n' +
              '   Hash Cond: (o.customer_id = c.id)\n' +
              '   ->  Parallel Seq Scan on ord o  (actual rows=166667 loops=3)\n' +
              '   ->  Hash  (actual rows=10000 loops=3)\n' +
              '         Buckets: 16384  Batches: 1  Memory Usage: 527kB\n' +
              '         ->  Seq Scan on customer c  (actual rows=10000 loops=3)',
            ) + 'Which reading of this plan is correct?',
            'Đo trên PostgreSQL 16.14, nối 500.000 đơn hàng với 10.000 khách hàng, không có bộ lọc nào:' + code(
              ' Hash Join  (actual rows=166667 loops=3)\n' +
              '   Hash Cond: (o.customer_id = c.id)\n' +
              '   ->  Parallel Seq Scan on ord o  (actual rows=166667 loops=3)\n' +
              '   ->  Hash  (actual rows=10000 loops=3)\n' +
              '         Buckets: 16384  Batches: 1  Memory Usage: 527kB\n' +
              '         ->  Seq Scan on customer c  (actual rows=10000 loops=3)',
            ) + 'Cách đọc nào về kế hoạch này là đúng?',
          ),
          options: [
            B('PostgreSQL built a hash table from the SMALLER side (10,000 customers, 527 kB) and streamed the larger side past it. <code>Batches: 1</code> means the hash fitted in <code>work_mem</code>; a number above 1 would mean it spilled to disk and the join got much more expensive', 'PostgreSQL dựng bảng băm từ phía NHỎ HƠN (10.000 khách hàng, 527 kB) rồi cho phía lớn chảy qua nó. <code>Batches: 1</code> nghĩa là bảng băm nằm vừa trong <code>work_mem</code>; con số lớn hơn 1 nghĩa là nó tràn ra đĩa và phép nối trở nên đắt hơn nhiều'),
            B('It hashed the larger side because a Hash Join always hashes the outer relation, which is why <code>Memory Usage</code> is so small relative to 500,000 rows', 'Nó băm phía lớn hơn, vì Hash Join luôn băm quan hệ ngoài, và đó là lý do <code>Memory Usage</code> nhỏ đến thế so với 500.000 dòng'),
            B('A Hash Join here signals a missing index: with an index on <code>ord.customer_id</code> the planner would have chosen a Nested Loop, which is always faster for a join of this size', 'Hash Join ở đây là dấu hiệu thiếu chỉ mục: nếu có chỉ mục trên <code>ord.customer_id</code> thì bộ lập kế hoạch đã chọn Nested Loop, vốn luôn nhanh hơn cho một phép nối cỡ này'),
            B('<code>Buckets: 16384</code> is the number of rows that failed to hash and had to be re-read from the customer table, so this plan is doing 16,384 wasted lookups', '<code>Buckets: 16384</code> là số dòng băm hỏng phải đọc lại từ bảng customer, nên kế hoạch này đang làm 16.384 lượt tra cứu phí phạm'),
          ],
          correct: 0,
          explanation: EX(
            'A Hash Join has two phases and the plan shows both: the <code>Hash</code> node BUILDS a table from one input, then the join scans the other input and PROBES it. The planner picks the smaller side to build from, which is why 10,000 customers became a 527 kB hash and 500,000 orders were streamed past it — no index needed on either side, which is exactly why this is the right shape for joining two large tables on equality. The number to watch is <code>Batches</code>: 1 means the hash fitted in <code>work_mem</code>; more than 1 means PostgreSQL partitioned both inputs and spilled to disk, and that is a real cliff. The tempting fix — raise <code>work_mem</code> globally — is the dangerous one, because the setting is per sort and per hash and per connection, so a query with three such nodes across a hundred connections can allocate three hundred times your value. Set it for the one session that needs it with <code>SET LOCAL work_mem</code> inside a transaction. And note that "Hash Join" is not a complaint: what signals trouble is a NESTED LOOP whose inner side is a sequential scan with a large <code>loops</code> count.',
            'Một Hash Join có hai pha và kế hoạch cho thấy cả hai: node <code>Hash</code> DỰNG một bảng từ một đầu vào, rồi phép nối quét đầu vào kia và DÒ vào bảng đó. Bộ lập kế hoạch chọn phía nhỏ hơn để dựng, và vì thế 10.000 khách hàng thành một bảng băm 527 kB còn 500.000 đơn hàng thì chảy ngang qua — không cần chỉ mục ở phía nào cả, và đó chính là lý do đây là hình dạng đúng để nối hai bảng lớn theo phép so bằng. Con số cần canh là <code>Batches</code>: bằng 1 nghĩa là bảng băm vừa trong <code>work_mem</code>; lớn hơn 1 nghĩa là PostgreSQL đã chia phân hoạch cả hai đầu vào và tràn ra đĩa, và đó là một vách đá thật sự. Cách sửa hấp dẫn — nâng <code>work_mem</code> toàn cục — lại là cách nguy hiểm, vì thiết lập đó tính theo TỪNG phép sắp, TỪNG bảng băm và TỪNG kết nối, nên một truy vấn có ba node như vậy trên một trăm kết nối có thể cấp phát gấp ba trăm lần con số bạn đặt. Hãy đặt riêng cho phiên cần nó bằng <code>SET LOCAL work_mem</code> bên trong một giao dịch. Và để ý "Hash Join" không phải một lời than: thứ báo hiệu rắc rối là một NESTED LOOP có phía trong là quét tuần tự với số <code>loops</code> lớn.',
          ),
        }),

        mcq({
          prompt: B(
            'A colleague sees a Hash Join and wants to know what a Merge Join would have cost. They run this on production:' + code(
              'SET enable_hashjoin = off;\n' +
              'SET enable_nestloop = off;\n' +
              'EXPLAIN ANALYZE SELECT ...;\n' +
              '\n' +
              ' Merge Join  ...\n' +
              '   ->  Sort  (actual rows=500000 loops=1)\n' +
              '         Sort Key: o.customer_id\n' +
              '         Sort Method: external merge  Disk: 10824kB',
            ) + 'What are these settings for, and what does <code>external merge Disk</code> tell you?',
            'Một đồng nghiệp thấy Hash Join và muốn biết Merge Join sẽ tốn bao nhiêu. Họ chạy trên production:' + code(
              'SET enable_hashjoin = off;\n' +
              'SET enable_nestloop = off;\n' +
              'EXPLAIN ANALYZE SELECT ...;\n' +
              '\n' +
              ' Merge Join  ...\n' +
              '   ->  Sort  (actual rows=500000 loops=1)\n' +
              '         Sort Key: o.customer_id\n' +
              '         Sort Method: external merge  Disk: 10824kB',
            ) + 'Các thiết lập này để làm gì, và <code>external merge Disk</code> nói lên điều gì?',
          ),
          options: [
            B('They are the supported way to pin a plan; once set in <code>postgresql.conf</code> the planner will keep choosing Merge Join, which is how you stop plans flipping under load', 'Đó là cách chính thức để ghim một kế hoạch; đặt vào <code>postgresql.conf</code> rồi thì bộ lập kế hoạch sẽ tiếp tục chọn Merge Join, và đó là cách bạn ngăn kế hoạch nhảy qua nhảy lại khi tải cao'),
            B('They disable the planner\'s cost model entirely, so the plan shown is the SQL-standard evaluation order rather than an optimised one', 'Chúng vô hiệu hoá hoàn toàn mô hình chi phí của bộ lập kế hoạch, nên kế hoạch hiện ra là thứ tự đánh giá theo chuẩn SQL chứ không phải một kế hoạch đã tối ưu'),
            B('They are DIAGNOSTIC knobs — they make an alternative plan expensive rather than impossible, so you can see what it would cost. Merge Join needs both inputs sorted, and <code>external merge Disk</code> says the sort did not fit in <code>work_mem</code> and spilled, which is why the planner rejected this plan', 'Chúng là các núm CHẨN ĐOÁN — chúng làm một kế hoạch thay thế trở nên đắt chứ không phải bất khả thi, để bạn thấy nó sẽ tốn bao nhiêu. Merge Join cần cả hai đầu vào đã sắp xếp, và <code>external merge Disk</code> nói rằng phép sắp không nằm vừa <code>work_mem</code> nên tràn ra đĩa — và đó là lý do bộ lập kế hoạch đã loại kế hoạch này'),
            B('They are harmless because they only affect the current session; the real problem is that <code>EXPLAIN ANALYZE</code> ran the query on production, and a Merge Join holds a table lock while it sorts', 'Chúng vô hại vì chỉ ảnh hưởng phiên hiện tại; vấn đề thật là <code>EXPLAIN ANALYZE</code> đã chạy truy vấn trên production, và một Merge Join giữ khoá bảng suốt lúc nó sắp xếp'),
          ],
          correct: 2,
          explanation: EX(
            'The <code>enable_*</code> settings do not forbid a strategy; they add a huge constant to its cost so the planner avoids it unless there is no alternative. That makes them excellent for answering "what would the other plan have cost?" and terrible as a production fix — they are session-level, they hide the real cause, and the day the data changes the plan you forced is the wrong one. Fix the cause instead: an index, fresher statistics, extended statistics, or a different query shape. As for the sort: Merge Join walks both inputs in sorted order, so it is cheap only when the sort is FREE — typically because both sides are already being read through an index. Here neither was, so PostgreSQL had to sort 500,000 rows, the sort exceeded <code>work_mem</code>, and <code>Sort Method: external merge Disk: 10824kB</code> is the receipt. Compare it with the alternative <code>Sort Method: quicksort Memory: …</code>, which means the sort fitted. Seeing <code>Disk</code> in a plan is a genuine signal — just not one to answer by raising <code>work_mem</code> for the whole server.',
            'Các thiết lập <code>enable_*</code> không cấm một chiến lược; chúng cộng một hằng số khổng lồ vào chi phí của nó để bộ lập kế hoạch né đi, trừ khi không còn lựa chọn nào khác. Điều đó khiến chúng tuyệt vời để trả lời câu hỏi "kế hoạch kia sẽ tốn bao nhiêu?" và tệ hại khi dùng làm cách sửa trên production — chúng chỉ ở mức phiên, chúng che mất nguyên nhân thật, và tới ngày dữ liệu đổi thì cái kế hoạch bạn ép chính là cái sai. Hãy sửa nguyên nhân: một chỉ mục, thống kê mới hơn, thống kê mở rộng, hoặc một hình dạng truy vấn khác. Còn về phép sắp: Merge Join đi qua cả hai đầu vào theo thứ tự đã sắp, nên nó chỉ rẻ khi phép sắp là MIỄN PHÍ — thường vì cả hai phía vốn đã được đọc qua chỉ mục. Ở đây thì không phía nào như vậy, nên PostgreSQL phải sắp 500.000 dòng, phép sắp vượt <code>work_mem</code>, và <code>Sort Method: external merge Disk: 10824kB</code> là tờ biên lai. Hãy so với dạng còn lại <code>Sort Method: quicksort Memory: …</code>, nghĩa là phép sắp nằm vừa bộ nhớ. Thấy chữ <code>Disk</code> trong một kế hoạch là một tín hiệu thật — chỉ là đừng trả lời nó bằng cách nâng <code>work_mem</code> cho cả máy chủ.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. The same <code>count(*)</code> over one day of a 500,000-row table, before and after an index on <code>created_at</code>:' + code(
              '-- before\n' +
              ' Finalize Aggregate\n' +
              '   Buffers: shared hit=3703\n' +
              '   ->  Parallel Seq Scan on ord   Rows Removed by Filter: 166187\n' +
              '\n' +
              '-- after\n' +
              ' Aggregate\n' +
              '   Buffers: shared hit=3 read=5\n' +
              '   ->  Index Only Scan using ord_created on ord\n' +
              '         Heap Fetches: 0',
            ) + 'Why is <code>BUFFERS</code> a better report than the elapsed time, and what do <code>hit</code> and <code>read</code> mean?',
            'Đo trên PostgreSQL 16.14. Cùng một phép <code>count(*)</code> trên một ngày của bảng 500.000 dòng, trước và sau khi thêm chỉ mục trên <code>created_at</code>:' + code(
              '-- trước\n' +
              ' Finalize Aggregate\n' +
              '   Buffers: shared hit=3703\n' +
              '   ->  Parallel Seq Scan on ord   Rows Removed by Filter: 166187\n' +
              '\n' +
              '-- sau\n' +
              ' Aggregate\n' +
              '   Buffers: shared hit=3 read=5\n' +
              '   ->  Index Only Scan using ord_created on ord\n' +
              '         Heap Fetches: 0',
            ) + 'Vì sao <code>BUFFERS</code> là báo cáo tốt hơn thời gian trôi qua, và <code>hit</code> với <code>read</code> nghĩa là gì?',
          ),
          options: [
            B('<code>hit</code> counts rows served from the buffer cache and <code>read</code> counts rows read from disk; buffers are better because they are measured in rows rather than in pages', '<code>hit</code> đếm số dòng được phục vụ từ bộ đệm và <code>read</code> đếm số dòng đọc từ đĩa; buffer tốt hơn vì nó đo bằng dòng chứ không phải bằng trang'),
            B('They count 8 kB PAGES: <code>hit</code> came from the buffer cache, <code>read</code> was a cache miss. Buffers are the honest measure because time depends on what happened to be cached — the same query is fast warm and slow cold, and 3703 pages → 8 pages is a real improvement regardless of the clock', 'Chúng đếm các TRANG 8 kB: <code>hit</code> là lấy được từ bộ đệm, <code>read</code> là trượt bộ đệm. Buffer là thước đo trung thực vì thời gian phụ thuộc vào thứ tình cờ đang nằm trong cache — cùng một truy vấn thì nóng là nhanh, nguội là chậm, còn 3703 trang → 8 trang là một cải thiện thật bất kể đồng hồ nói gì'),
            B('<code>read</code> is always worse than <code>hit</code>, so the second plan is actually a regression: it introduced 5 disk reads where the first plan had none', '<code>read</code> luôn tệ hơn <code>hit</code>, nên kế hoạch thứ hai thật ra là một bước lùi: nó tạo ra 5 lượt đọc đĩa trong khi kế hoạch đầu không có lượt nào'),
            B('They count WAL records written; <code>BUFFERS</code> is only meaningful on write statements and reports zero for a pure <code>SELECT</code>', 'Chúng đếm các bản ghi WAL đã ghi; <code>BUFFERS</code> chỉ có nghĩa với câu lệnh ghi và trả về 0 cho một câu <code>SELECT</code> thuần'),
          ],
          correct: 1,
          explanation: EX(
            'Time in a plan is a measurement of your cache state as much as of your query. Run it once cold and once warm and the second number can be ten times better with nothing changed — optimise against that second number and you have tuned for a state production may never be in, because the user who arrives first each morning gets the cold one. Buffers do not lie: <code>shared hit</code> is a page found in PostgreSQL\'s buffer cache, <code>shared read</code> is a page it had to ask the operating system for (which may still have been in the OS page cache, so <code>read</code> is a cache miss rather than proof of physical I/O). Here the first plan touched 3,703 pages — roughly the whole table — to count one day, and the second touched 8, because the day\'s rows sit together in the index and <code>Heap Fetches: 0</code> means it never went to the table at all. That is a structural improvement you can defend without a stopwatch, which matters especially on a machine running other work, where the clock is noise.',
            'Thời gian trong một kế hoạch đo tình trạng cache của bạn không kém gì đo truy vấn của bạn. Chạy một lần nguội rồi một lần nóng thì con số thứ hai có thể tốt gấp mười lần mà chẳng đổi gì cả — tối ưu theo con số thứ hai là bạn đã tinh chỉnh cho một trạng thái mà production có thể không bao giờ ở trong đó, vì người dùng đến đầu tiên mỗi sáng nhận đúng cái nguội. Buffer thì không nói dối: <code>shared hit</code> là một trang tìm thấy trong bộ đệm của PostgreSQL, <code>shared read</code> là một trang nó phải hỏi hệ điều hành (mà trang đó vẫn có thể nằm trong page cache của OS, nên <code>read</code> là trượt bộ đệm chứ chưa chắc là I/O vật lý). Ở đây kế hoạch đầu chạm 3.703 trang — gần như cả bảng — để đếm một ngày, còn kế hoạch sau chạm 8 trang, vì các dòng của ngày đó nằm sát nhau trong chỉ mục và <code>Heap Fetches: 0</code> nghĩa là nó không hề ghé bảng. Đó là một cải thiện về cấu trúc mà bạn bảo vệ được không cần đồng hồ bấm giờ — điều này đặc biệt quan trọng trên một cái máy đang chạy nhiều việc khác, nơi đồng hồ chỉ là nhiễu.',
          ),
        }),

        // ── Chương 11 — Giao dịch & đồng thời ───────────────────────────
        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14. Account A starts at 100.00 and the table has <code>CHECK (balance &gt;= 0)</code>. The whole block ran exactly as shown, and it COMMITTED:' + code(
              'BEGIN;\n' +
              "UPDATE accounts SET balance = balance - 40  WHERE id = 'A';   -- UPDATE 1\n" +
              'SAVEPOINT sp1;\n' +
              "UPDATE accounts SET balance = balance - 500 WHERE id = 'A';\n" +
              'ERROR:  new row for relation "accounts" violates check constraint\n' +
              'ROLLBACK TO SAVEPOINT sp1;\n' +
              "UPDATE accounts SET balance = balance + 40  WHERE id = 'B';   -- UPDATE 1\n" +
              'COMMIT;\n' +
              '\n' +
              ' A | Cuong |  60.00\n' +
              ' B | Mai   |  40.00',
            ) + 'What did the savepoint change, and what should you know before using them everywhere?',
            'Đo trên PostgreSQL 16.14. Tài khoản A khởi đầu 100.00 và bảng có <code>CHECK (balance &gt;= 0)</code>. Cả khối chạy đúng như hiện ra, và nó đã COMMIT:' + code(
              'BEGIN;\n' +
              "UPDATE accounts SET balance = balance - 40  WHERE id = 'A';   -- UPDATE 1\n" +
              'SAVEPOINT sp1;\n' +
              "UPDATE accounts SET balance = balance - 500 WHERE id = 'A';\n" +
              'ERROR:  new row for relation "accounts" violates check constraint\n' +
              'ROLLBACK TO SAVEPOINT sp1;\n' +
              "UPDATE accounts SET balance = balance + 40  WHERE id = 'B';   -- UPDATE 1\n" +
              'COMMIT;\n' +
              '\n' +
              ' A | Cuong |  60.00\n' +
              ' B | Mai   |  40.00',
            ) + 'Savepoint đã thay đổi điều gì, và bạn cần biết gì trước khi dùng chúng ở khắp nơi?',
          ),
          options: [
            B('Without the savepoint the failing statement would have been skipped and the transaction would have carried on regardless, exactly as it did here; the savepoint only makes that skip explicit so the next reader can see it was intentional', 'Không có savepoint thì câu lệnh hỏng cũng sẽ bị bỏ qua và giao dịch vẫn chạy tiếp y như đã xảy ra ở đây; savepoint chỉ làm cho việc bỏ qua đó trở nên tường minh để người đọc sau thấy được rằng nó là có chủ ý'),
            B('The savepoint committed everything before it, which is why the first 40 survived the error; a transaction containing savepoints is really a chain of several small transactions committed one after another', 'Savepoint đã commit mọi thứ trước nó, và vì thế số 40 đầu tiên sống sót qua lần lỗi; một giao dịch có chứa savepoint thực chất là một chuỗi nhiều giao dịch nhỏ được commit lần lượt'),
            B('Without it the error would have poisoned the WHOLE transaction — every later statement refused with "current transaction is aborted" and <code>COMMIT</code> silently turning into <code>ROLLBACK</code>. The catch: each savepoint costs a subtransaction id, and thousands of them in one transaction is a known way to make a busy server crawl', 'Không có nó thì lỗi đã đầu độc CẢ giao dịch — mọi câu lệnh sau đó bị từ chối với "current transaction is aborted" và <code>COMMIT</code> âm thầm biến thành <code>ROLLBACK</code>. Cái giá: mỗi savepoint tốn một id giao dịch con, và hàng nghìn cái trong một giao dịch là một cách đã biết để làm máy chủ bận bò lê'),
            B('The savepoint raised the isolation level for every statement issued after it, and that is what allowed the later UPDATE to see the earlier one\'s result instead of the snapshot taken at BEGIN', 'Savepoint đã nâng mức cô lập cho mọi câu lệnh phát ra sau nó, và đó là thứ cho phép lệnh UPDATE sau nhìn thấy kết quả của lệnh trước thay vì ảnh chụp lấy lúc BEGIN'),
          ],
          correct: 2,
          explanation: EX(
            'An error inside a transaction does not just fail that statement — it aborts the transaction, and from then on PostgreSQL accepts nothing but <code>ROLLBACK</code> or <code>ROLLBACK TO SAVEPOINT</code>. The detail that catches people out is the last line: you type <code>COMMIT</code> and the server answers <code>ROLLBACK</code>, so an application that logs "commit succeeded" there is lying to itself. <code>ROLLBACK TO SAVEPOINT sp1</code> rewinds to the marker and leaves the transaction alive and usable, which is how the 40 survived and the transfer completed. Two limits worth carrying: savepoints are not free — each one consumes a subtransaction id, and a loop creating one per row is a well-known way to degrade a busy server — so use them for a handful of genuinely optional steps rather than as a per-row try/catch. And note the related state to watch in production: <code>idle in transaction (aborted)</code> in <code>pg_stat_activity</code> means exactly this situation left open by an application that is not handling its error.',
            'Một lỗi bên trong giao dịch không chỉ làm hỏng câu lệnh đó — nó huỷ bỏ cả giao dịch, và từ lúc ấy PostgreSQL không nhận gì ngoài <code>ROLLBACK</code> hoặc <code>ROLLBACK TO SAVEPOINT</code>. Chi tiết hay bẫy người ta là dòng cuối cùng: bạn gõ <code>COMMIT</code> và máy chủ trả lời <code>ROLLBACK</code>, nên một ứng dụng ghi log "commit thành công" ở chỗ đó là đang tự nói dối. <code>ROLLBACK TO SAVEPOINT sp1</code> tua ngược về cái mốc và để giao dịch còn sống, còn dùng được — và đó là cách số 40 sống sót và phi vụ chuyển tiền hoàn tất. Hai giới hạn đáng mang theo: savepoint không miễn phí — mỗi cái ngốn một id giao dịch con, và một vòng lặp tạo một cái cho mỗi dòng là cách đã biết để làm suy sụp một máy chủ bận — nên hãy dùng chúng cho vài bước thật sự tuỳ chọn chứ đừng dùng như try/catch từng dòng. Và để ý trạng thái liên quan cần canh trên production: <code>idle in transaction (aborted)</code> trong <code>pg_stat_activity</code> chính là tình huống này bị một ứng dụng không xử lý lỗi bỏ mở.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14:' + code(
              'BEGIN;\n' +
              'CREATE TABLE thu_ddl (id int);\n' +
              'INSERT INTO thu_ddl VALUES (1);\n' +
              'SELECT count(*) FROM thu_ddl;    -- 1\n' +
              'ROLLBACK;\n' +
              '\n' +
              'SELECT count(*) FROM thu_ddl;\n' +
              'ERROR:  relation "thu_ddl" does not exist',
            ) + 'Why does this matter for migrations?',
            'Đo trên PostgreSQL 16.14:' + code(
              'BEGIN;\n' +
              'CREATE TABLE thu_ddl (id int);\n' +
              'INSERT INTO thu_ddl VALUES (1);\n' +
              'SELECT count(*) FROM thu_ddl;    -- 1\n' +
              'ROLLBACK;\n' +
              '\n' +
              'SELECT count(*) FROM thu_ddl;\n' +
              'ERROR:  relation "thu_ddl" does not exist',
            ) + 'Vì sao điều này quan trọng với migration?',
          ),
          options: [
            B('It shows that <code>CREATE TABLE</code> is deferred until COMMIT, so DDL inside a transaction is only a declaration of intent and cannot be queried before the commit', 'Nó cho thấy <code>CREATE TABLE</code> bị hoãn tới lúc COMMIT, nên DDL trong một giao dịch chỉ là một tuyên bố ý định và không truy vấn được trước khi commit'),
            B('DDL in PostgreSQL is TRANSACTIONAL — the table existed, took a row, and then stopped ever having existed. A migration can therefore wrap all its steps in one transaction and either land completely or not at all, which MySQL cannot do because DDL there commits implicitly', 'DDL trong PostgreSQL nằm TRONG GIAO DỊCH — cái bảng đã tồn tại, đã nhận một dòng, rồi thôi từng tồn tại. Nhờ vậy một migration có thể bọc mọi bước của nó trong một giao dịch và hoặc vào trọn vẹn hoặc không vào gì cả, thứ mà MySQL không làm được vì DDL ở đó commit ngầm'),
            B('It shows that <code>ROLLBACK</code> issues an implicit <code>DROP TABLE</code>, which is why the table is gone but its sequence and indexes remain behind as orphans', 'Nó cho thấy <code>ROLLBACK</code> phát ra một lệnh <code>DROP TABLE</code> ngầm, và vì thế cái bảng biến mất còn sequence và chỉ mục của nó ở lại thành mồ côi'),
            B('It matters only for temporary tables; a regular <code>CREATE TABLE</code> would have survived the rollback and the example must have used <code>CREATE TEMP TABLE</code>', 'Nó chỉ quan trọng với bảng tạm; một lệnh <code>CREATE TABLE</code> thường sẽ sống sót qua rollback và ví dụ này chắc chắn đã dùng <code>CREATE TEMP TABLE</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Most databases treat schema changes as a separate world with an implicit commit around each statement, which is why a migration that fails halfway there leaves you with half a schema and a manual repair job at the worst possible moment. In PostgreSQL <code>CREATE</code>, <code>ALTER</code>, <code>DROP</code> and their friends live inside the transaction like any other statement, so a migration is genuinely atomic: eight statements land together or none do. That is precisely why Prisma migrations (Chapter 16) are as safe as they are, and why the Migration Failure Protocol in this repository insists on reading the error rather than papering over it — a migration wrapped in one transaction rolled back cleanly, while one with statements outside a transaction may not have. Two real exceptions to know: <code>CREATE INDEX CONCURRENTLY</code> and <code>CREATE DATABASE</code> cannot run inside a transaction block at all, so a migration that uses the concurrent form gives up atomicity for that statement — which is the trade you accept to avoid locking a live table.',
            'Phần lớn cơ sở dữ liệu coi thay đổi lược đồ là một thế giới riêng với một lệnh commit ngầm quanh từng câu, và vì thế một migration hỏng giữa chừng ở đó để lại cho bạn nửa cái lược đồ cùng một việc sửa tay vào đúng lúc tệ nhất có thể. Trong PostgreSQL thì <code>CREATE</code>, <code>ALTER</code>, <code>DROP</code> và bạn bè sống bên trong giao dịch như mọi câu lệnh khác, nên một migration thật sự nguyên tử: tám câu lệnh cùng vào hoặc không câu nào vào. Đó chính là lý do migration của Prisma (Chương 16) an toàn tới vậy, và là lý do Quy trình xử lý migration hỏng trong kho mã này khăng khăng bắt đọc lỗi thay vì che nó đi — một migration bọc trong một giao dịch thì quay lui sạch sẽ, còn một migration có câu lệnh nằm ngoài giao dịch thì chưa chắc. Hai ngoại lệ có thật cần biết: <code>CREATE INDEX CONCURRENTLY</code> và <code>CREATE DATABASE</code> hoàn toàn không chạy được bên trong một khối giao dịch, nên một migration dùng dạng concurrent là đã từ bỏ tính nguyên tử cho câu lệnh đó — đúng cái đánh đổi bạn chấp nhận để khỏi khoá một bảng đang chạy.',
          ),
        }),

        mcq({
          prompt: B(
            'A report runs six queries in one transaction and its section totals never quite agree with each other. Measured on PostgreSQL 16.14, the same experiment at two isolation levels:' + code(
              '-- READ COMMITTED (the default)          -- REPEATABLE READ\n' +
              'A│ BEGIN;                                A│ BEGIN ISOLATION LEVEL REPEATABLE READ;\n' +
              'A│ SELECT balance …;  → 100.00           A│ SELECT balance …;  → 100.00\n' +
              'B│ UPDATE … SET balance = 999;           B│ UPDATE … SET balance = 777;\n' +
              'A│ SELECT balance …;  → 999.00           A│ SELECT balance …;  → 100.00\n' +
              'A│ COMMIT;                               A│ COMMIT;  then a new SELECT → 777.00',
            ) + 'Which statement is correct?',
            'Một báo cáo chạy sáu truy vấn trong một giao dịch và các con số tổng của từng phần không bao giờ khớp nhau. Đo trên PostgreSQL 16.14, cùng một thí nghiệm ở hai mức cô lập:' + code(
              '-- READ COMMITTED (mặc định)             -- REPEATABLE READ\n' +
              'A│ BEGIN;                                A│ BEGIN ISOLATION LEVEL REPEATABLE READ;\n' +
              'A│ SELECT balance …;  → 100.00           A│ SELECT balance …;  → 100.00\n' +
              'B│ UPDATE … SET balance = 999;           B│ UPDATE … SET balance = 777;\n' +
              'A│ SELECT balance …;  → 999.00           A│ SELECT balance …;  → 100.00\n' +
              'A│ COMMIT;                               A│ COMMIT;  rồi một SELECT mới → 777.00',
            ) + 'Phát biểu nào đúng?',
          ),
          options: [
            B('At READ COMMITTED each STATEMENT gets a fresh snapshot, so two identical queries in one transaction can legitimately differ — that is the report bug. REPEATABLE READ takes ONE snapshot for the whole transaction, so every section describes the same instant', 'Ở READ COMMITTED thì mỗi CÂU LỆNH nhận một ảnh chụp mới, nên hai truy vấn giống hệt nhau trong cùng một giao dịch hoàn toàn có thể khác nhau — đó chính là lỗi của báo cáo. REPEATABLE READ lấy MỘT ảnh chụp cho cả giao dịch, nên mọi phần đều mô tả cùng một thời điểm'),
            B('READ COMMITTED showed 999 because it permits dirty reads; B had not committed yet, and REPEATABLE READ is the level that waits for B to finish', 'READ COMMITTED hiện 999 vì nó cho phép đọc bẩn; B chưa commit, và REPEATABLE READ mới là mức chờ B làm xong'),
            B('The two levels differ only in how they handle write conflicts; both take one snapshot per transaction, and the 999 came from A\'s own uncommitted write', 'Hai mức chỉ khác nhau ở cách xử lý xung đột ghi; cả hai đều lấy một ảnh chụp cho mỗi giao dịch, và số 999 đến từ chính lệnh ghi chưa commit của A'),
            B('REPEATABLE READ blocked B\'s UPDATE until A committed, which is why A kept seeing 100.00 and the new value only appeared afterwards', 'REPEATABLE READ đã chặn lệnh UPDATE của B cho tới khi A commit, và vì thế A vẫn thấy 100.00 còn giá trị mới chỉ xuất hiện sau đó'),
          ],
          correct: 0,
          explanation: EX(
            'Neither level ever shows uncommitted data — PostgreSQL does not do dirty reads at all, and <code>READ UNCOMMITTED</code> is accepted by the parser and silently treated as <code>READ COMMITTED</code>. What the level decides is WHEN the snapshot is taken. Per statement (READ COMMITTED) is cheapest and completely fine for the ordinary web request that reads a row, renders it and responds; the cost is the non-repeatable read above, which is expected behaviour rather than a bug. Per transaction (REPEATABLE READ) is what a multi-query report or a consistent export wants, so its sections agree. Two things it does NOT buy: it does not block anyone — B committed happily in both runs — and it does not stop write skew, where two transactions read overlapping data and write different rows; only <code>SERIALIZABLE</code> catches that, by aborting one with SQLSTATE 40001 and a HINT that says to retry, which means any code path using it MUST have a retry loop.',
            'Không mức nào từng cho thấy dữ liệu chưa commit — PostgreSQL hoàn toàn không đọc bẩn, và <code>READ UNCOMMITTED</code> thì được bộ phân tích chấp nhận rồi âm thầm coi như <code>READ COMMITTED</code>. Thứ mà mức cô lập quyết định là ảnh chụp được lấy LÚC NÀO. Lấy theo từng câu lệnh (READ COMMITTED) là rẻ nhất và hoàn toàn ổn cho một request web bình thường: đọc một dòng, vẽ ra, trả lời; cái giá là lần đọc không lặp lại được ở trên, vốn là hành vi đúng như thiết kế chứ không phải lỗi. Lấy theo từng giao dịch (REPEATABLE READ) là thứ mà một báo cáo nhiều truy vấn hoặc một lần xuất dữ liệu nhất quán cần, để các phần của nó khớp nhau. Hai thứ nó KHÔNG mua: nó không chặn ai cả — B commit ngon lành ở cả hai lượt — và nó không ngăn được write skew, khi hai giao dịch đọc dữ liệu chồng lấn rồi ghi vào những dòng khác nhau; chỉ <code>SERIALIZABLE</code> bắt được ca đó, bằng cách huỷ một giao dịch với SQLSTATE 40001 kèm HINT bảo hãy thử lại — nghĩa là mọi nhánh mã dùng nó BẮT BUỘC phải có vòng thử lại.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 with two concurrent sessions, each updating rows A and B in the opposite order:' + code(
              'ERROR:  deadlock detected\n' +
              'DETAIL:  Process 296 waits for ShareLock on transaction 855; blocked by process 303.\n' +
              '         Process 303 waits for ShareLock on transaction 854; blocked by process 296.\n' +
              'HINT:  See server log for query details.\n' +
              'CONTEXT:  while updating tuple (0,13) in relation "accounts"\n' +
              '\n' +
              '-- the victim then typed COMMIT; and the server answered ROLLBACK\n' +
              '-- the other session committed normally',
            ) + 'What is the correct response?',
            'Đo trên PostgreSQL 16.14 với hai phiên chạy đồng thời, mỗi phiên cập nhật dòng A và B theo thứ tự ngược nhau:' + code(
              'ERROR:  deadlock detected\n' +
              'DETAIL:  Process 296 waits for ShareLock on transaction 855; blocked by process 303.\n' +
              '         Process 303 waits for ShareLock on transaction 854; blocked by process 296.\n' +
              'HINT:  See server log for query details.\n' +
              'CONTEXT:  while updating tuple (0,13) in relation "accounts"\n' +
              '\n' +
              '-- nạn nhân sau đó gõ COMMIT; và máy chủ trả lời ROLLBACK\n' +
              '-- phiên còn lại commit bình thường',
            ) + 'Phản ứng đúng là gì?',
          ),
          options: [
            B('Raise <code>deadlock_timeout</code> so PostgreSQL waits longer before declaring a deadlock; most of these resolve themselves given a second or two', 'Nâng <code>deadlock_timeout</code> để PostgreSQL chờ lâu hơn trước khi tuyên bố deadlock; phần lớn những ca này sẽ tự giải quyết nếu cho thêm một hai giây'),
            B('Treat it as database corruption: a deadlock means two transactions wrote the same tuple simultaneously, so run <code>VACUUM FULL</code> on the affected relation before retrying', 'Coi đó là hỏng dữ liệu: deadlock nghĩa là hai giao dịch cùng ghi một tuple một lúc, nên hãy chạy <code>VACUUM FULL</code> trên quan hệ liên quan rồi mới thử lại'),
            B('Fix the ORDER in which locks are taken — if every transaction touches rows in the same order (ascending by primary key, e.g. <code>ORDER BY id</code> in the <code>SELECT … FOR UPDATE</code> that precedes the writes), a cycle cannot form. Keep a retry as a safety net, not as the plan', 'Sửa THỨ TỰ lấy khoá — nếu mọi giao dịch đều chạm các dòng theo cùng một thứ tự (tăng dần theo khoá chính, ví dụ <code>ORDER BY id</code> trong câu <code>SELECT … FOR UPDATE</code> đứng trước các lệnh ghi) thì một chu trình không thể hình thành. Giữ việc thử lại như một lưới an toàn chứ không phải như kế hoạch chính'),
            B('Switch the two transactions to <code>SERIALIZABLE</code>: at that level PostgreSQL detects the conflict before any lock is taken, so no deadlock can occur', 'Chuyển hai giao dịch sang <code>SERIALIZABLE</code>: ở mức đó PostgreSQL phát hiện xung đột trước khi lấy bất kỳ khoá nào, nên không thể có deadlock'),
          ],
          correct: 2,
          explanation: EX(
            'A deadlock is not corruption and not a bug in PostgreSQL — it is the server correctly refusing to hang forever. Session A locked row A and wants row B; session B locked row B and wants row A; after <code>deadlock_timeout</code> (1 s by default) the server detects the cycle, aborts one transaction and lets the other finish. Note the victim\'s last line, which is the same trap as the aborted-transaction question: it typed <code>COMMIT</code> and got <code>ROLLBACK</code>, because it was already dead. Two responses are wrong. Retrying blindly without fixing the order brings the deadlock back under load, just less predictably. And raising <code>deadlock_timeout</code> only makes the server wait longer before noticing, so both transactions stall for longer first — the setting exists because detection is not free, not because deadlocks resolve themselves. Consistent lock ordering is the actual fix: sort the ids before you write them.',
            'Deadlock không phải hỏng dữ liệu và cũng không phải lỗi của PostgreSQL — đó là máy chủ từ chối treo mãi mãi một cách đúng đắn. Phiên A khoá dòng A rồi muốn dòng B; phiên B khoá dòng B rồi muốn dòng A; sau <code>deadlock_timeout</code> (mặc định 1 giây) máy chủ phát hiện chu trình, huỷ một giao dịch và cho cái kia hoàn tất. Để ý dòng cuối của nạn nhân, đúng cái bẫy ở câu về giao dịch bị huỷ: nó gõ <code>COMMIT</code> và nhận về <code>ROLLBACK</code>, vì nó đã chết từ trước. Có hai phản ứng sai. Thử lại một cách mù quáng mà không sửa thứ tự sẽ khiến deadlock quay lại khi tải cao, chỉ là khó đoán hơn. Còn nâng <code>deadlock_timeout</code> chỉ làm máy chủ chờ lâu hơn mới nhận ra, nên cả hai giao dịch đứng hình lâu hơn trước đã — thiết lập đó tồn tại vì việc phát hiện tốn tài nguyên, chứ không phải vì deadlock tự khỏi. Thống nhất thứ tự lấy khoá mới là cách sửa thật: hãy sắp các id lại trước khi ghi.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on PostgreSQL 16.14 with two workers pulling from a <code>job</code> table at the same time. Neither waited, and no job was handed out twice:' + code(
              "SELECT id, payload FROM job WHERE state = 'queued'\n" +
              '  ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 2;\n' +
              '\n' +
              'A│ 1 | job-1        B│ 3 | job-3\n' +
              'A│ 2 | job-2        B│ 4 | job-4',
            ) + 'What does <code>SKIP LOCKED</code> do, and how do the alternatives behave when a row is already locked?',
            'Đo trên PostgreSQL 16.14 với hai worker cùng lấy việc từ bảng <code>job</code> một lúc. Không cái nào phải chờ, và không việc nào bị phát hai lần:' + code(
              "SELECT id, payload FROM job WHERE state = 'queued'\n" +
              '  ORDER BY id FOR UPDATE SKIP LOCKED LIMIT 2;\n' +
              '\n' +
              'A│ 1 | job-1        B│ 3 | job-3\n' +
              'A│ 2 | job-2        B│ 4 | job-4',
            ) + '<code>SKIP LOCKED</code> làm gì, và các lựa chọn thay thế hành xử ra sao khi một dòng đã bị khoá?',
          ),
          options: [
            B('<code>SKIP LOCKED</code> releases the other session\'s locks so both workers can proceed; <code>NOWAIT</code> instead queues behind them and <code>lock_timeout</code> disables locking entirely', '<code>SKIP LOCKED</code> giải phóng khoá của phiên kia để cả hai worker cùng đi tiếp; còn <code>NOWAIT</code> thì xếp hàng phía sau, và <code>lock_timeout</code> thì tắt hẳn việc khoá'),
            B('It only works with <code>LIMIT</code>: without a limit the two workers would receive the same rows, because the skip is applied after the result set is built', 'Nó chỉ chạy khi có <code>LIMIT</code>: không có limit thì hai worker sẽ nhận cùng những dòng như nhau, vì phép bỏ qua được áp sau khi tập kết quả đã dựng xong'),
            B('It marks the rows as claimed by writing <code>state = \'running\'</code> automatically, which is why B saw jobs 3 and 4 rather than 1 and 2', 'Nó đánh dấu các dòng là đã bị nhận bằng cách tự ghi <code>state = \'running\'</code>, và vì thế B thấy việc 3 và 4 chứ không phải 1 và 2'),
            B('It steps OVER rows another transaction has locked instead of waiting, so each worker takes what it can. Plain <code>FOR UPDATE</code> would BLOCK until the other commits; <code>NOWAIT</code> fails instantly with "could not obtain lock on row"; <code>SET lock_timeout</code> gives it a bounded wait and then "canceling statement due to lock timeout"', 'Nó BƯỚC QUA những dòng mà giao dịch khác đang khoá thay vì chờ, nên mỗi worker lấy được thứ nó lấy được. <code>FOR UPDATE</code> trần sẽ CHẶN cho tới khi bên kia commit; <code>NOWAIT</code> hỏng ngay lập tức với "could not obtain lock on row"; còn <code>SET lock_timeout</code> cho nó chờ có giới hạn rồi báo "canceling statement due to lock timeout"'),
          ],
          correct: 3,
          explanation: EX(
            'That single clause is a correct multi-worker queue: two workers, zero coordination, zero waiting, and no job handed out twice. The lock is held until the transaction ends, so worker A keeps jobs 1 and 2 for as long as it needs them and B simply steps over them. Before reaching for a dedicated queue service, check whether this is enough — for a great many applications it is. The three ways of not-waiting are worth holding apart because they suit different situations: <code>SKIP LOCKED</code> for work that any worker may take, <code>NOWAIT</code> when contention means "someone else is already doing it, tell me now", and <code>lock_timeout</code> for a user-facing transaction where waiting forever is never the right answer — a modest timeout turns "the site is hanging" into a fast, catchable error you can retry or report. Two cautions: <code>ORDER BY</code> plus <code>SKIP LOCKED</code> can return rows out of the order you asked for, since skipped rows are simply absent; and the queue only works if the worker updates <code>state</code> before committing, or the same rows come back on the next poll.',
            'Chỉ một mệnh đề ấy đã là một hàng đợi việc nhiều worker đúng đắn: hai worker, không cần phối hợp gì, không phải chờ, và không việc nào bị phát hai lần. Khoá được giữ tới khi giao dịch kết thúc, nên worker A giữ việc 1 và 2 bao lâu nó cần và B chỉ việc bước qua. Trước khi với tay tới một dịch vụ hàng đợi chuyên dụng, hãy kiểm xem cái này đã đủ chưa — với rất nhiều ứng dụng thì nó đủ. Ba cách "không chờ" đáng tách bạch vì chúng hợp với ba tình huống khác nhau: <code>SKIP LOCKED</code> cho công việc mà worker nào lấy cũng được, <code>NOWAIT</code> khi tranh chấp nghĩa là "người khác đang làm rồi, báo tôi ngay đi", và <code>lock_timeout</code> cho một giao dịch phục vụ người dùng, nơi chờ mãi không bao giờ là câu trả lời đúng — một khoảng chờ vừa phải biến "trang web bị treo" thành một lỗi nhanh gọn mà bạn bắt được để thử lại hoặc báo cáo. Hai lưu ý: <code>ORDER BY</code> đi cùng <code>SKIP LOCKED</code> có thể trả về các dòng không theo thứ tự bạn yêu cầu, vì những dòng bị bỏ qua đơn giản là vắng mặt; và hàng đợi chỉ chạy đúng nếu worker cập nhật <code>state</code> trước khi commit, nếu không thì đúng những dòng ấy lại quay về ở lần lấy kế tiếp.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Aggregate the way SQL does (chapter 6).</b> Every number on a dashboard is an aggregate, and every one of them has an opinion about NULL. Implement the engine in plain JavaScript over the data given — no database, no libraries.</p>' +
            '<ul>' +
            '<li><code>tongHop(rows)</code> — return <code>{ n_star, n_col, n_seller, sum, avg, min, max }</code> for one group. <code>n_star</code> counts ROWS. Everything else about <code>amount</code> SKIPS <code>null</code>: <code>n_col</code> counts non-null values, and <code>sum</code>/<code>avg</code>/<code>min</code>/<code>max</code> return <code>null</code> when the group holds no value at all. <code>avg</code> divides by <code>n_col</code>, never by <code>n_star</code>, rounded to one decimal (<code>Math.round(x * 10) / 10</code>). <code>n_seller</code> is the number of DISTINCT sellers.</li>' +
            '<li><code>nhom(cot)</code> — <code>GROUP BY cot</code>: return <code>[key, summary]</code> pairs sorted by key.</li>' +
            '<li><code>having(cot, dieuKien)</code> — group, then keep the groups whose summary satisfies <code>dieuKien</code>.</li>' +
            '<li><code>loc(dieuKienDong)</code> — <code>WHERE</code> with no <code>GROUP BY</code>: filter the rows first, then return <code>[[null, summary]]</code> for the single whole-table group — or <code>[]</code> when NO row survives, because a group that does not exist is not a row of zeroes.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 31 — Tổng hợp đúng như SQL làm (chương 6).</b> Mọi con số trên một bảng điều khiển đều là một phép tổng hợp, và mỗi phép đều có quan điểm riêng về NULL. Hãy cài đặt bộ máy đó bằng JavaScript thuần trên dữ liệu cho sẵn — không cơ sở dữ liệu, không thư viện.</p>' +
            '<ul>' +
            '<li><code>tongHop(rows)</code> — trả về <code>{ n_star, n_col, n_seller, sum, avg, min, max }</code> cho một nhóm. <code>n_star</code> đếm DÒNG. Mọi thứ còn lại liên quan tới <code>amount</code> đều BỎ QUA <code>null</code>: <code>n_col</code> đếm số giá trị khác null, và <code>sum</code>/<code>avg</code>/<code>min</code>/<code>max</code> trả về <code>null</code> khi nhóm không có giá trị nào. <code>avg</code> chia cho <code>n_col</code>, không bao giờ chia cho <code>n_star</code>, làm tròn một chữ số thập phân (<code>Math.round(x * 10) / 10</code>). <code>n_seller</code> là số người bán KHÁC NHAU.</li>' +
            '<li><code>nhom(cot)</code> — <code>GROUP BY cot</code>: trả về các cặp <code>[khoá, bảnTómTắt]</code> sắp theo khoá.</li>' +
            '<li><code>having(cot, dieuKien)</code> — gom nhóm, rồi giữ những nhóm có bản tóm tắt thoả <code>dieuKien</code>.</li>' +
            '<li><code>loc(dieuKienDong)</code> — <code>WHERE</code> mà không có <code>GROUP BY</code>: lọc dòng trước, rồi trả về <code>[[null, bảnTómTắt]]</code> cho nhóm-cả-bảng duy nhất — hoặc <code>[]</code> khi KHÔNG dòng nào sống sót, vì một nhóm không tồn tại thì không phải là một dòng toàn số không.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// Vùng East có 2 dòng và CẢ HAI đều amount = null.\n' +
            'const SALES = [\n' +
            "  { id: 1,  region: 'North', seller: 'Alice', amount: 100  },\n" +
            "  { id: 2,  region: 'North', seller: 'Alice', amount: 150  },\n" +
            "  { id: 3,  region: 'North', seller: 'Bob',   amount: 200  },\n" +
            "  { id: 4,  region: 'North', seller: 'Bob',   amount: 150  },\n" +
            "  { id: 5,  region: 'South', seller: 'Carol', amount: 300  },\n" +
            "  { id: 6,  region: 'South', seller: 'Carol', amount: 250  },\n" +
            "  { id: 7,  region: 'South', seller: 'Dave',  amount: 180  },\n" +
            "  { id: 8,  region: 'South', seller: 'Dave',  amount: 220  },\n" +
            "  { id: 9,  region: 'East',  seller: 'Erin',  amount: null },\n" +
            "  { id: 10, region: 'East',  seller: 'Erin',  amount: null },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function tongHop(rows) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function nhom(cot) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function having(cot, dieuKien) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function loc(dieuKienDong) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const ve = (g) => 'n*=' + g.n_star + ' nCol=' + g.n_col + ' sum=' + g.sum + ' avg=' + g.avg\n" +
            "  + ' min=' + g.min + ' max=' + g.max + ' sellers=' + g.n_seller;\n" +
            "for (const [k, g] of nhom('region')) console.log('GROUP ' + k.padEnd(5) + ' | ' + ve(g));\n" +
            "console.log('HAVING sum>600     -> ' + JSON.stringify(having('region', (g) => g.sum !== null && g.sum > 600).map(([k]) => k)));\n" +
            "console.log('HAVING nCol=0      -> ' + JSON.stringify(having('region', (g) => g.n_col === 0).map(([k]) => k)));\n" +
            "console.log('HAVING n*>3        -> ' + JSON.stringify(having('region', (g) => g.n_star > 3).map(([k]) => k)));\n" +
            "const west = loc((r) => r.region === 'West');\n" +
            "console.log('WHERE region=West  -> ' + (west.length ? ve(west[0][1]) : '(0 rows)'));\n" +
            'const all = loc(() => true);\n' +
            "console.log('khong GROUP BY     -> ' + ve(all[0][1]));\n" +
            "for (const [k, g] of nhom('seller')) console.log('GROUP ' + k.padEnd(5) + ' | sum=' + g.sum + ' nCol=' + g.n_col);\n",
          expectedOutput:
            'GROUP East  | n*=2 nCol=0 sum=null avg=null min=null max=null sellers=1\n' +
            'GROUP North | n*=4 nCol=4 sum=600 avg=150 min=100 max=200 sellers=2\n' +
            'GROUP South | n*=4 nCol=4 sum=950 avg=237.5 min=180 max=300 sellers=2\n' +
            'HAVING sum>600     -> ["South"]\n' +
            'HAVING nCol=0      -> ["East"]\n' +
            'HAVING n*>3        -> ["North","South"]\n' +
            'WHERE region=West  -> (0 rows)\n' +
            'khong GROUP BY     -> n*=10 nCol=8 sum=1550 avg=193.8 min=100 max=300 sellers=5\n' +
            'GROUP Alice | sum=250 nCol=2\n' +
            'GROUP Bob   | sum=350 nCol=2\n' +
            'GROUP Carol | sum=550 nCol=2\n' +
            'GROUP Dave  | sum=400 nCol=2\n' +
            'GROUP Erin  | sum=null nCol=0\n',
          sampleSolution:
            'function tongHop(rows) {\n' +
            '  // Mọi hàm tổng hợp TRỪ count(*) đều bỏ qua NULL.\n' +
            '  const co = rows.map((r) => r.amount).filter((v) => v !== null);\n' +
            '  const tong = co.reduce((a, b) => a + b, 0);\n' +
            '  return {\n' +
            '    n_star: rows.length,\n' +
            '    n_col: co.length,\n' +
            '    n_seller: new Set(rows.map((r) => r.seller)).size,\n' +
            '    sum: co.length ? tong : null,\n' +
            '    avg: co.length ? Math.round((tong / co.length) * 10) / 10 : null,   // mẫu số là n_col\n' +
            '    min: co.length ? Math.min(...co) : null,\n' +
            '    max: co.length ? Math.max(...co) : null,\n' +
            '  };\n' +
            '}\n\n' +
            'function nhom(cot) {\n' +
            '  const m = new Map();\n' +
            '  for (const r of SALES) {\n' +
            '    const k = r[cot];\n' +
            '    if (!m.has(k)) m.set(k, []);\n' +
            '    m.get(k).push(r);\n' +
            '  }\n' +
            '  return [...m.entries()]\n' +
            '    .map(([k, rows]) => [k, tongHop(rows)])\n' +
            '    .sort((a, b) => String(a[0]).localeCompare(String(b[0])));\n' +
            '}\n\n' +
            '// HAVING lọc NHÓM, sau khi đã tổng hợp.\n' +
            'function having(cot, dieuKien) { return nhom(cot).filter(([, g]) => dieuKien(g)); }\n\n' +
            '// WHERE lọc DÒNG, trước khi tổng hợp. Không dòng nào sống sót ⇒ KHÔNG có nhóm nào.\n' +
            'function loc(dieuKienDong) {\n' +
            '  const rows = SALES.filter(dieuKienDong);\n' +
            '  return rows.length === 0 ? [] : [[null, tongHop(rows)]];\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Window functions, frames included (chapter 8).</b> A window function computes over a set of rows and still hands every row back. Implement three families over the data given.</p>' +
            '<ul>' +
            '<li><code>xepHang(region)</code> — the partition sorted by <code>amount DESC</code>. PostgreSQL puts NULLs FIRST under <code>DESC</code>; break remaining ties by <code>id</code> ascending. Return <code>{ id, amount, rn, rnk, drnk, nt }</code> per row: <code>rn</code> is 1..N; <code>rnk</code> gives tied rows the same rank and then SKIPS; <code>drnk</code> gives tied rows the same rank and does NOT skip; <code>nt</code> is <code>ntile(2)</code>, which ignores ties and just cuts the ordered rows into two halves — <code>Math.floor(i / (n / 2)) + 1</code>. Two NULLs are PEERS, so they share a rank.</li>' +
            '<li><code>luyTien(region)</code> — the partition sorted by <code>id</code>. Return <code>{ id, amount, chay, truoc, truoc0 }</code>: <code>chay</code> is the running <code>sum</code> (skipping nulls, <code>null</code> when nothing has had a value yet), <code>truoc</code> is <code>lag(amount)</code>, and <code>truoc0</code> is <code>lag(amount, 1, 0)</code>. Careful: the default replaces a MISSING ROW, not a null VALUE — so row two of a partition whose first row is null gets <code>null</code>, not 0.</li>' +
            '<li><code>khung(region)</code> — the partition sorted by <code>amount DESC</code>. Return <code>{ amount, fv, lv_mac_dinh, lv_day_du, rangeSum, rowsSum }</code>. The implicit frame is "start of partition … current row", so <code>lv_mac_dinh</code> is the CURRENT row while <code>lv_day_du</code> (an explicit <code>UNBOUNDED FOLLOWING</code> frame) is the partition\'s last. <code>rowsSum</code> counts physical rows; <code>rangeSum</code> is the default RANGE frame, which includes every PEER of the current row — so tied rows all see the same total.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are.</p>',

            '<p><b>Câu 32 — Hàm cửa sổ, kể cả khung (chương 8).</b> Một hàm cửa sổ tính trên một tập dòng mà vẫn trả lại đủ mọi dòng. Hãy cài đặt ba họ hàm trên dữ liệu cho sẵn.</p>' +
            '<ul>' +
            '<li><code>xepHang(region)</code> — phân vùng sắp theo <code>amount DESC</code>. PostgreSQL đặt NULL lên ĐẦU khi <code>DESC</code>; các trường hợp bằng nhau còn lại thì phân định bằng <code>id</code> tăng dần. Trả về <code>{ id, amount, rn, rnk, drnk, nt }</code> cho mỗi dòng: <code>rn</code> là 1..N; <code>rnk</code> cho các dòng đồng hạng cùng một hạng rồi NHẢY CÓC; <code>drnk</code> cho các dòng đồng hạng cùng một hạng và KHÔNG nhảy cóc; <code>nt</code> là <code>ntile(2)</code>, vốn phớt lờ chuyện đồng hạng và chỉ cắt dãy đã sắp thành hai nửa — <code>Math.floor(i / (n / 2)) + 1</code>. Hai giá trị NULL là ĐỒNG HẠNG, nên chúng dùng chung một hạng.</li>' +
            '<li><code>luyTien(region)</code> — phân vùng sắp theo <code>id</code>. Trả về <code>{ id, amount, chay, truoc, truoc0 }</code>: <code>chay</code> là <code>sum</code> luỹ tiến (bỏ qua null, trả <code>null</code> khi chưa có giá trị nào), <code>truoc</code> là <code>lag(amount)</code>, và <code>truoc0</code> là <code>lag(amount, 1, 0)</code>. Cẩn thận: giá trị mặc định thay cho một DÒNG KHÔNG CÓ chứ không phải một GIÁ TRỊ null — nên dòng thứ hai của một phân vùng có dòng đầu là null sẽ nhận <code>null</code>, không phải 0.</li>' +
            '<li><code>khung(region)</code> — phân vùng sắp theo <code>amount DESC</code>. Trả về <code>{ amount, fv, lv_mac_dinh, lv_day_du, rangeSum, rowsSum }</code>. Khung ngầm định là "từ đầu phân vùng … tới dòng hiện tại", nên <code>lv_mac_dinh</code> chính là dòng HIỆN TẠI còn <code>lv_day_du</code> (khung tường minh có <code>UNBOUNDED FOLLOWING</code>) là dòng cuối của phân vùng. <code>rowsSum</code> đếm theo dòng vật lý; <code>rangeSum</code> là khung RANGE mặc định, vốn bao gồm mọi dòng ĐỒNG HẠNG với dòng hiện tại — nên các dòng bằng nhau đều thấy cùng một tổng.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '// North có hai dòng cùng amount = 150 (đồng hạng). East có hai dòng null.\n' +
            'const SALES = [\n' +
            "  { id: 1,  region: 'North', amount: 100  }, { id: 2,  region: 'North', amount: 150  },\n" +
            "  { id: 3,  region: 'North', amount: 200  }, { id: 4,  region: 'North', amount: 150  },\n" +
            "  { id: 5,  region: 'South', amount: 300  }, { id: 6,  region: 'South', amount: 250  },\n" +
            "  { id: 7,  region: 'South', amount: 180  }, { id: 8,  region: 'South', amount: 220  },\n" +
            "  { id: 9,  region: 'East',  amount: null }, { id: 10, region: 'East',  amount: null },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function xepHang(region) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function luyTien(region) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function khung(region) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "for (const region of ['East', 'North', 'South']) {\n" +
            '  for (const r of xepHang(region)) {\n' +
            "    console.log('XH ' + region.padEnd(5) + ' id=' + r.id + ' amt=' + r.amount\n" +
            "      + ' rn=' + r.rn + ' rnk=' + r.rnk + ' drnk=' + r.drnk + ' ntile2=' + r.nt);\n" +
            '  }\n' +
            '}\n' +
            "for (const region of ['East', 'North', 'South']) {\n" +
            '  for (const r of luyTien(region)) {\n' +
            "    console.log('LT ' + region.padEnd(5) + ' id=' + r.id + ' amt=' + r.amount\n" +
            "      + ' chay=' + r.chay + ' truoc=' + r.truoc + ' truoc0=' + r.truoc0);\n" +
            '  }\n' +
            '}\n' +
            "for (const r of khung('North')) {\n" +
            "  console.log('KH North amt=' + r.amount + ' fv=' + r.fv + ' lvMacDinh=' + r.lv_mac_dinh\n" +
            "    + ' lvDayDu=' + r.lv_day_du + ' range=' + r.rangeSum + ' rows=' + r.rowsSum);\n" +
            '}\n',
          expectedOutput:
            'XH East  id=9 amt=null rn=1 rnk=1 drnk=1 ntile2=1\n' +
            'XH East  id=10 amt=null rn=2 rnk=1 drnk=1 ntile2=2\n' +
            'XH North id=3 amt=200 rn=1 rnk=1 drnk=1 ntile2=1\n' +
            'XH North id=2 amt=150 rn=2 rnk=2 drnk=2 ntile2=1\n' +
            'XH North id=4 amt=150 rn=3 rnk=2 drnk=2 ntile2=2\n' +
            'XH North id=1 amt=100 rn=4 rnk=4 drnk=3 ntile2=2\n' +
            'XH South id=5 amt=300 rn=1 rnk=1 drnk=1 ntile2=1\n' +
            'XH South id=6 amt=250 rn=2 rnk=2 drnk=2 ntile2=1\n' +
            'XH South id=8 amt=220 rn=3 rnk=3 drnk=3 ntile2=2\n' +
            'XH South id=7 amt=180 rn=4 rnk=4 drnk=4 ntile2=2\n' +
            'LT East  id=9 amt=null chay=null truoc=null truoc0=0\n' +
            'LT East  id=10 amt=null chay=null truoc=null truoc0=null\n' +
            'LT North id=1 amt=100 chay=100 truoc=null truoc0=0\n' +
            'LT North id=2 amt=150 chay=250 truoc=100 truoc0=100\n' +
            'LT North id=3 amt=200 chay=450 truoc=150 truoc0=150\n' +
            'LT North id=4 amt=150 chay=600 truoc=200 truoc0=200\n' +
            'LT South id=5 amt=300 chay=300 truoc=null truoc0=0\n' +
            'LT South id=6 amt=250 chay=550 truoc=300 truoc0=300\n' +
            'LT South id=7 amt=180 chay=730 truoc=250 truoc0=250\n' +
            'LT South id=8 amt=220 chay=950 truoc=180 truoc0=180\n' +
            'KH North amt=200 fv=200 lvMacDinh=200 lvDayDu=100 range=200 rows=200\n' +
            'KH North amt=150 fv=200 lvMacDinh=150 lvDayDu=100 range=500 rows=350\n' +
            'KH North amt=150 fv=200 lvMacDinh=150 lvDayDu=100 range=500 rows=500\n' +
            'KH North amt=100 fv=200 lvMacDinh=100 lvDayDu=100 range=600 rows=600\n',
          sampleSolution:
            'const cong = (arr) => {\n' +
            '  const co = arr.filter((v) => v !== null);\n' +
            '  return co.length ? co.reduce((a, b) => a + b, 0) : null;   // không giá trị nào ⇒ NULL\n' +
            '};\n' +
            'const phanVung = (region) => SALES.filter((r) => r.region === region);\n\n' +
            '// DESC trong PostgreSQL đặt NULL lên ĐẦU.\n' +
            'const sapGiam = (rows) => [...rows].sort((a, b) => {\n' +
            '  if (a.amount === null && b.amount === null) return a.id - b.id;\n' +
            '  if (a.amount === null) return -1;\n' +
            '  if (b.amount === null) return 1;\n' +
            '  return b.amount - a.amount || a.id - b.id;\n' +
            '});\n\n' +
            'function xepHang(region) {\n' +
            '  const rows = sapGiam(phanVung(region));\n' +
            '  const n = rows.length;\n' +
            '  let rnk = 0, drnk = 0, truoc;\n' +
            '  return rows.map((r, i) => {\n' +
            '    // Hai NULL là ĐỒNG HẠNG: r.amount !== truoc là false khi cả hai đều null.\n' +
            '    if (i === 0 || r.amount !== truoc) { rnk = i + 1; drnk += 1; }\n' +
            '    truoc = r.amount;\n' +
            '    return { id: r.id, amount: r.amount, rn: i + 1, rnk, drnk, nt: Math.floor(i / (n / 2)) + 1 };\n' +
            '  });\n' +
            '}\n\n' +
            'function luyTien(region) {\n' +
            '  const rows = [...phanVung(region)].sort((a, b) => a.id - b.id);\n' +
            '  return rows.map((r, i) => ({\n' +
            '    id: r.id,\n' +
            '    amount: r.amount,\n' +
            '    chay: cong(rows.slice(0, i + 1).map((x) => x.amount)),\n' +
            '    truoc: i === 0 ? null : rows[i - 1].amount,\n' +
            '    // Mặc định chỉ thay cho DÒNG không có, không thay cho GIÁ TRỊ null.\n' +
            '    truoc0: i === 0 ? 0 : rows[i - 1].amount,\n' +
            '  }));\n' +
            '}\n\n' +
            'function khung(region) {\n' +
            '  const rows = sapGiam(phanVung(region));\n' +
            '  const amts = rows.map((x) => x.amount);\n' +
            '  return rows.map((r, i) => ({\n' +
            '    amount: r.amount,\n' +
            '    fv: rows[0].amount,\n' +
            '    lv_mac_dinh: r.amount,                        // khung mặc định kết thúc ở DÒNG HIỆN TẠI\n' +
            '    lv_day_du: rows[rows.length - 1].amount,\n' +
            '    // RANGE gom cả các dòng ĐỒNG HẠNG: đi tới phần tử CUỐI CÙNG có cùng giá trị.\n' +
            '    rangeSum: cong(amts.slice(0, amts.lastIndexOf(r.amount) + 1)),\n' +
            '    rowsSum: cong(amts.slice(0, i + 1)),          // ROWS đếm theo vị trí\n' +
            '  }));\n' +
            '}\n',
        }),
      ],
    },
  ],
};
