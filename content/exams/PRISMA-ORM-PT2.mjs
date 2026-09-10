/**
 * Prisma ORM — Progress Test 2 (chương s05–s08).
 *
 * Đề tự soạn, bám sát `content/courses/prisma-orm/s05-truy-van` … `s08-he-kieu`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ MỌI đoạn log truy vấn, mọi mã lỗi P####, mọi transcript migration và mọi
 * con số trong đề này đều được ĐO THẬT trong một dự án Prisma nháp NGOÀI kho
 * api-backend:
 *
 *     prisma 6.19.3 · @prisma/client 6.19.3 · Node v22.21.0 · darwin-arm64
 *     PostgreSQL 16.14 (Debian) trong Docker, container riêng, cổng riêng
 *
 * Lược đồ của kho api-backend KHÔNG bị đụng tới: không `migrate`, không
 * `db push`, không `generate` nào trỏ vào `prisma/schema.prisma` của kho này.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BẢY CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026 trên 6.19.3) — ĐỀ THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. `distinct` KHÔNG sinh ra `DISTINCT ON`. Bài 5.4 nói "trên PostgreSQL: một
 *    `DISTINCT ON` thật, chạy trong cơ sở dữ liệu" và nói nó "đòi các cột
 *    distinct phải đứng đầu `orderBy` — luật của PostgreSQL chứ không phải của
 *    Prisma, và thông báo lỗi nói thẳng ra thế". Đo thật cả ba vế đều sai: câu
 *    SQL KHÔNG có chữ `DISTINCT` nào; một `orderBy` không mở đầu bằng cột
 *    distinct chạy bình thường, KHÔNG lỗi, chỉ đổi hàng nào sống sót; và
 *    `distinct` kèm `take: 1` gửi xuống một câu SELECT **không có LIMIT**.
 *    Engine lọc trùng trong bộ nhớ rồi mới cắt. Câu 4.
 *
 * 2. `where: { profile: { is: null } }` là LEFT JOIN, không phải `NOT EXISTS`.
 *    Bài 5.2 in ra khối `NOT EXISTS (SELECT 1 FROM "profiles" …)`. Đo thật:
 *    `FROM "User" LEFT JOIN "Profile" AS "j0" ON … WHERE ("j0"."userId" IS
 *    NULL)`. Còn `some`/`none` thì đúng là `EXISTS`/`NOT EXISTS`. Câu 3.
 *
 * 3. `count()` và `aggregate()` bọc một truy vấn con. Bài 5.4 (và 4.1) in dạng
 *    phẳng `SELECT COUNT(*), SUM(…) FROM "posts" WHERE …`. Đo thật:
 *    `SELECT COUNT(*) AS "_count$_all", SUM("views") … FROM (SELECT "views"
 *    FROM "public"."Post" WHERE 1=1 OFFSET $1) AS "sub"` — lớp bọc tồn tại để
 *    `take`/`skip` áp được. Câu 5.
 *
 * 4. Mức cô lập KHÔNG đi kèm `BEGIN`. Bài 7.2 in `BEGIN ISOLATION LEVEL
 *    SERIALIZABLE`. Đo thật: hai câu lệnh rời — `BEGIN` rồi
 *    `SET TRANSACTION ISOLATION LEVEL SERIALIZABLE`. Câu 18.
 *
 * 5. `$transaction([ mộtPhépĐọc ])` KHÔNG có `BEGIN`/`COMMIT` nào cả, và
 *    `isolationLevel` bạn truyền vào bị BỎ QUA IM LẶNG. Đo thật, cả bốn ca:
 *    một phép đọc → chỉ một `SELECT`; hai phép đọc → `BEGIN`/`COMMIT`; một
 *    phép GHI → `BEGIN`/`COMMIT`; một phép đọc kèm `Serializable` → vẫn chỉ
 *    một `SELECT`. Bài 7.1 mô tả dạng mảng là "một `BEGIN`, một `COMMIT`".
 *    Câu 17.
 *
 * 6. `P2034` về tay bạn với `meta: {}`. Bài 7.2 in
 *    `meta: { code: '40001', message: 'could not serialize access …' }`. Đo
 *    thật trên 6.19.3, ba lượt: `meta` rỗng, SQLSTATE không có ở đâu trong
 *    đối tượng lỗi. Câu 18 (cùng câu với mục 4).
 *
 * 7. `migrate deploy` và `migrate status` KHÔNG kiểm checksum. Bài 6.1 nói sửa
 *    một migration đã áp dụng "làm chết mọi lần deploy sau đó". Đo thật: thêm
 *    một dòng chú thích vào tệp đã áp dụng ⇒ sha256 lệch hẳn với cột
 *    `checksum`, vậy mà `migrate deploy` vẫn áp migration mới bình thường và
 *    `migrate status` vẫn in "Database schema is up to date!". Thứ bắt được
 *    nó là `migrate dev`: "The migration `X` was modified after it was
 *    applied. We need to reset the "public" schema … All data will be lost."
 *    Câu 12.
 *
 * Hai chỗ nhỏ hơn, chỉ ghi lại chứ không ra đề: (a) một migration chết giữa
 * chừng trên PostgreSQL để lại `applied_steps_count = 0` và KHÔNG có thay đổi
 * lược đồ nào — DDL nằm trong một giao dịch nên câu lệnh đã chạy cũng bị cuộn
 * lại; bài 6.1 mô tả con số ấy là "phần áp dụng dở đi được tới đâu"; (b) có
 * đồng thời `.env` ở thư mục hiện tại và ở thư mục cha thì CLI KHÔNG "âm thầm
 * cho một cái thắng" như bài 0.2 nói, mà dừng hẳn với `Error: There is a
 * conflict between env var in ../.env and .env`.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới đây):
 *     { '0': 9, '1': 9, '2': 8, '3': 8 }   → A 9 · B 9 · C 8 · D 8
 *     (34 ô đáp án chứ không phải 30, vì bốn câu là dạng "chọn HAI")
 *
 *   node -e "import('./content/exams/PRISMA-ORM-PT2.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRISMA-ORM-PT2.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/prisma-exam-kit.mjs';

export default {
  course: { slug: 'prisma-orm' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 5–8 (querying deeply, migrations, transactions, the type system)',
        'Kiểm tra tiến độ 2 — Chương 5–8 (truy vấn sâu, migration, giao dịch, hệ kiểu)',
      ),
      description: B(
        'The middle third of the Prisma course: every filter operator and what it costs, pagination that survives a large table, migrations from the _prisma_migrations table upwards, transactions and concurrency, and the generated type system. 30 multiple-choice questions plus 2 coding questions you write here in the exam room. Every query log, error code and migration transcript came from running the command against PostgreSQL 16.14 with Prisma 6.19.3.',
        'Một phần ba giữa của khoá Prisma: đủ bộ toán tử lọc và cái giá của từng cái, phân trang sống được trên bảng lớn, migration nhìn từ bảng _prisma_migrations trở lên, giao dịch và tranh chấp, và hệ kiểu được sinh ra. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi. Mọi log truy vấn, mọi mã lỗi và mọi đoạn chạy migration đều lấy từ việc chạy thật trên PostgreSQL 16.14 với Prisma 6.19.3.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '5–8'),
      questions: [
        // ── Chương 5 — Truy vấn sâu ─────────────────────────────────────
        mcq({
          prompt: B(
            'These four filters were logged on Prisma 6.19.3, and the SQL is copied verbatim:' + code(
              "{ title: { contains: 'ris' } }                        -> \"title\"::text LIKE $1\n" +
              "{ title: { startsWith: 'Pri' } }                      -> \"title\"::text LIKE $1\n" +
              "{ title: { contains: 'ris', mode: 'insensitive' } }   -> \"title\" ILIKE $1\n" +
              '{ id: { in: [] } }                                   -> WHERE 1=0',
            ) + 'Which reading is correct?',
            'Bốn bộ lọc sau được ghi log trên Prisma 6.19.3, SQL chép nguyên văn:' + code(
              "{ title: { contains: 'ris' } }                        -> \"title\"::text LIKE $1\n" +
              "{ title: { startsWith: 'Pri' } }                      -> \"title\"::text LIKE $1\n" +
              "{ title: { contains: 'ris', mode: 'insensitive' } }   -> \"title\" ILIKE $1\n" +
              '{ id: { in: [] } }                                   -> WHERE 1=0',
            ) + 'Cách đọc nào ĐÚNG?',
          ),
          options: [
            B(
              'All four are index-friendly: <code>LIKE</code> and <code>ILIKE</code> both use a B-tree on <code>title</code>, and <code>WHERE 1=0</code> is an optimisation that lets PostgreSQL skip the scan entirely',
              'Cả bốn đều thân thiện với chỉ mục: <code>LIKE</code> và <code>ILIKE</code> đều dùng B-tree trên <code>title</code>, còn <code>WHERE 1=0</code> là một tối ưu cho phép PostgreSQL bỏ hẳn phép quét',
            ),
            B(
              'An empty <code>in</code> array is ignored, so the filter matches every row — which is why building it from an empty <code>.map()</code> is the classic "my delete removed everything" bug',
              'Mảng <code>in</code> rỗng bị bỏ qua nên bộ lọc khớp mọi hàng — và đó là lý do dựng nó từ một <code>.map()</code> rỗng chính là lỗi kinh điển "lệnh xoá của tôi xoá sạch"',
            ),
            B(
              'The <code>::text</code> cast means Prisma is comparing as text because the column is not a string; removing it by declaring <code>@db.VarChar</code> is what makes the index usable',
              'Phần ép kiểu <code>::text</code> nghĩa là Prisma đang so sánh dạng text vì cột không phải chuỗi; bỏ nó đi bằng cách khai <code>@db.VarChar</code> chính là thứ làm chỉ mục dùng được',
            ),
            B(
              '<code>contains</code> and <code>startsWith</code> emit the same operator and differ only in the parameter (<code>%ris%</code> versus <code>Pri%</code>), so only <code>startsWith</code> can use a B-tree; <code>ILIKE</code> defeats an ordinary index outright; and an empty <code>in</code> compiles to <code>WHERE 1=0</code>, which returns nothing rather than everything',
              '<code>contains</code> và <code>startsWith</code> phát ra cùng một toán tử và chỉ khác ở tham số (<code>%ris%</code> so với <code>Pri%</code>), nên chỉ <code>startsWith</code> mới dùng được B-tree; <code>ILIKE</code> vô hiệu hoá thẳng một chỉ mục thường; còn <code>in</code> rỗng biên dịch thành <code>WHERE 1=0</code>, trả về KHÔNG hàng nào chứ không phải tất cả',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The operator is the same; the wildcard placement is what decides everything. <code>LIKE \'Pri%\'</code> is a prefix, which a B-tree can range-scan (with the caveat that a locale-aware index needs <code>text_pattern_ops</code>); <code>LIKE \'%ris%\'</code> has a leading wildcard and must examine every row. <code>ILIKE</code> is worse still — measured, it does not even carry the <code>::text</code> cast, and no ordinary index serves it. The fix for both is a GIN trigram index, two lines in a hand-written migration and no change to the Prisma code at all. And note the empty <code>in</code>: <code>WHERE 1=0</code> is correct SQL for "none of these", and it is a common source of "my filter returns zero rows" when the array came from a <code>.map()</code> over an empty list.',
            'Toán tử thì như nhau; chỗ đặt ký tự đại diện mới quyết định tất cả. <code>LIKE \'Pri%\'</code> là một tiền tố, B-tree quét khoảng được (với lưu ý rằng một chỉ mục có nhận biết locale thì cần <code>text_pattern_ops</code>); còn <code>LIKE \'%ris%\'</code> có ký tự đại diện đứng đầu nên phải soi từng hàng. <code>ILIKE</code> còn tệ hơn — đo thật, nó thậm chí không mang phần ép kiểu <code>::text</code>, và chẳng chỉ mục thường nào phục vụ nổi. Cách vá cho cả hai là một chỉ mục GIN trigram: hai dòng trong một migration viết tay và không đổi một chữ nào trong mã Prisma. Và để ý <code>in</code> rỗng: <code>WHERE 1=0</code> là SQL đúng cho "không cái nào trong số này", và nó là nguồn quen thuộc của "bộ lọc của tôi trả về không hàng nào" khi mảng ấy đến từ một <code>.map()</code> trên danh sách rỗng.',
          ),
        }),

        mcq({
          prompt: B(
            'A listing must show posts tagged with BOTH <code>nodejs</code> AND <code>prisma</code>. Two filters were run on Prisma 6.19.3 against three posts — one carrying both tags, one only <code>nodejs</code>, one only <code>prisma</code>:' + code(
              "A  where: { tags: { some: { name: { in: ['nodejs', 'prisma'] } } } }\n" +
              "     -> EXISTS(SELECT \"t0\".\"A\" FROM \"_PostTags\" AS \"t0\"\n" +
              '                INNER JOIN "Tag" AS "j0" ON ("j0"."id") = ("t0"."B")\n' +
              '                WHERE ("j0"."name" IN ($1,$2) AND ("Post"."id") = ("t0"."A") ...))\n' +
              '     -> ["p1","p2","p3"]\n\n' +
              "B  where: { AND: ['nodejs', 'prisma'].map((name) => ({ tags: { some: { name } } })) }\n" +
              '     -> EXISTS(... "j0"."name" = $1 ...) AND EXISTS(... "j1"."name" = $2 ...)\n' +
              '     -> ["p1"]',
            ) + 'Which reading is correct?',
            'Một trang danh sách phải hiện những bài mang CẢ thẻ <code>nodejs</code> LẪN thẻ <code>prisma</code>. Hai bộ lọc được chạy trên Prisma 6.19.3 với ba bài viết — một bài mang cả hai thẻ, một bài chỉ có <code>nodejs</code>, một bài chỉ có <code>prisma</code>:' + code(
              "A  where: { tags: { some: { name: { in: ['nodejs', 'prisma'] } } } }\n" +
              "     -> EXISTS(SELECT \"t0\".\"A\" FROM \"_PostTags\" AS \"t0\"\n" +
              '                INNER JOIN "Tag" AS "j0" ON ("j0"."id") = ("t0"."B")\n' +
              '                WHERE ("j0"."name" IN ($1,$2) AND ("Post"."id") = ("t0"."A") ...))\n' +
              '     -> ["p1","p2","p3"]\n\n' +
              "B  where: { AND: ['nodejs', 'prisma'].map((name) => ({ tags: { some: { name } } })) }\n" +
              '     -> EXISTS(... "j0"."name" = $1 ...) AND EXISTS(... "j1"."name" = $2 ...)\n' +
              '     -> ["p1"]',
            ) + 'Cách đọc nào ĐÚNG?',
          ),
          options: [
            B(
              'A is right and the three results prove it: <code>some</code> with an <code>in</code> list means "has every tag in the list", and the three rows come back because all three posts carry at least one of them',
              'A đúng và ba kết quả kia chứng minh điều đó: <code>some</code> đi với một danh sách <code>in</code> nghĩa là "có đủ mọi thẻ trong danh sách", và ba hàng trở về vì cả ba bài đều mang ít nhất một thẻ trong đó',
            ),
            B(
              'A asks the wrong question — one <code>EXISTS</code> matching a tag whose name is in the list is "has ANY of them" — and B is the shape for "has ALL of them": one <code>some</code> per required tag, ANDed, which becomes one <code>EXISTS</code> per tag and generalises to any number',
              'A hỏi sai câu — một <code>EXISTS</code> khớp một thẻ có tên nằm trong danh sách nghĩa là "có BẤT KỲ thẻ nào trong số đó" — còn B mới là hình dạng cho "có ĐỦ CẢ": mỗi thẻ bắt buộc một <code>some</code>, nối bằng AND, và nó thành mỗi thẻ một <code>EXISTS</code>, khái quát được cho số thẻ bất kỳ',
            ),
            B(
              'Both ask the same question and B is simply slower: two <code>EXISTS</code> subqueries do the work one <code>IN</code> list already did, and the different results come from the join table holding duplicate links',
              'Hai cái hỏi cùng một câu và B chỉ là chậm hơn: hai truy vấn con <code>EXISTS</code> làm lại đúng việc mà một danh sách <code>IN</code> đã làm xong, còn kết quả khác nhau là do bảng nối chứa các liên kết trùng',
            ),
            B(
              'Neither is right: "has both tags" cannot be expressed against a many-to-many at all, and it needs <code>groupBy</code> on the join table with <code>having: { _count: { gte: 2 } }</code>',
              'Chẳng cái nào đúng: "có cả hai thẻ" hoàn toàn không diễn đạt được trên một quan hệ nhiều–nhiều, và nó cần <code>groupBy</code> trên bảng nối kèm <code>having: { _count: { gte: 2 } }</code>',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Read the SQL rather than the JavaScript and the difference is unambiguous. A produces ONE <code>EXISTS</code> whose inner condition is <code>name IN ($1,$2)</code> — satisfied by a single link to either tag, which is why all three posts match. B produces one <code>EXISTS</code> per required tag, joined by <code>AND</code>, so only the post with both links survives. Reading A as "has both" is the natural misreading, because the JavaScript looks like it names two tags and the SQL looks like it mentions both — and the bug is silent, because A returns MORE rows rather than none. The shape in B generalises to any number of required tags and is the standard way to express set containment against a many-to-many. Worth knowing the alternative: if the tags live in a <code>String[]</code> column rather than a table, the same requirement is one operator — <code>{ tags: { hasEvery: [\'nodejs\', \'prisma\'] } }</code>, which compiles to the array containment operator <code>@&gt;</code> and needs <code>@@index([tags], type: Gin)</code> to be anything other than a sequential scan. That is a real argument for the array column when tags are simple strings and nothing needs to reference a tag as a row.',
            'Hãy đọc SQL thay vì đọc JavaScript thì khác biệt hiện ra rành rành. A sinh ra MỘT <code>EXISTS</code> với điều kiện bên trong là <code>name IN ($1,$2)</code> — chỉ cần một liên kết tới một trong hai thẻ là thoả, và đó là lý do cả ba bài đều khớp. B sinh ra mỗi thẻ bắt buộc một <code>EXISTS</code>, nối bằng <code>AND</code>, nên chỉ bài có cả hai liên kết sống sót. Đọc A thành "có cả hai" là cách hiểu nhầm rất tự nhiên, vì đoạn JavaScript trông như đang nêu tên hai thẻ và đoạn SQL trông như có nhắc tới cả hai — và cái lỗi này im lặng, bởi A trả về NHIỀU hàng hơn chứ không phải không hàng nào. Hình dạng ở B khái quát được cho số thẻ bắt buộc bất kỳ và là cách chuẩn để diễn đạt phép bao hàm tập hợp trên một quan hệ nhiều–nhiều. Đáng biết cả lựa chọn thay thế: nếu các thẻ nằm trong một cột <code>String[]</code> thay vì một cái bảng thì cùng yêu cầu ấy chỉ là một toán tử — <code>{ tags: { hasEvery: [\'nodejs\', \'prisma\'] } }</code>, biên dịch thành toán tử bao hàm mảng <code>@&gt;</code> và cần <code>@@index([tags], type: Gin)</code> thì mới khác được một lần quét tuần tự. Đó là một lý lẽ thật cho cột mảng khi thẻ chỉ là chuỗi đơn giản và không có gì cần tham chiếu tới một cái thẻ như một hàng.',
          ),
        }),

        mcq({
          prompt: B(
            'Two relation filters were logged side by side on Prisma 6.19.3:' + code(
              '// where: { posts: { some: { published: true } } }\n' +
              'SELECT ... FROM "public"."User" WHERE EXISTS(\n' +
              '  SELECT "t0"."authorId" FROM "public"."Post" AS "t0" WHERE (...))\n\n' +
              '// where: { profile: { is: null } }\n' +
              'SELECT ... FROM "public"."User"\n' +
              '  LEFT JOIN "public"."Profile" AS "j0" ON ("j0"."userId") = ("public"."User"."id")\n' +
              '  WHERE ("j0"."userId" IS NULL)',
            ) + 'What does the difference tell you?',
            'Hai bộ lọc theo quan hệ được ghi log cạnh nhau trên Prisma 6.19.3:' + code(
              '// where: { posts: { some: { published: true } } }\n' +
              'SELECT ... FROM "public"."User" WHERE EXISTS(\n' +
              '  SELECT "t0"."authorId" FROM "public"."Post" AS "t0" WHERE (...))\n\n' +
              '// where: { profile: { is: null } }\n' +
              'SELECT ... FROM "public"."User"\n' +
              '  LEFT JOIN "public"."Profile" AS "j0" ON ("j0"."userId") = ("public"."User"."id")\n' +
              '  WHERE ("j0"."userId" IS NULL)',
            ) + 'Khác biệt đó nói lên điều gì?',
          ),
          options: [
            B(
              'The <code>LEFT JOIN</code> means <code>is: null</code> also loads the profile rows, so it is the expensive one and <code>include</code> would be free afterwards',
              '<code>LEFT JOIN</code> nghĩa là <code>is: null</code> nạp luôn cả các hàng hồ sơ, nên nó mới là cái đắt và sau đó <code>include</code> sẽ miễn phí',
            ),
            B(
              'Both are correlated subqueries; the <code>LEFT JOIN</code> is just how the log renders a <code>NOT EXISTS</code> against a one-to-one relation',
              'Cả hai đều là truy vấn con tương quan; <code>LEFT JOIN</code> chỉ là cách log hiển thị một <code>NOT EXISTS</code> trên quan hệ một–một',
            ),
            B(
              'To-many operators (<code>some</code>, <code>every</code>, <code>none</code>) compile to <code>EXISTS</code>/<code>NOT EXISTS</code>, while a to-one <code>is</code> compiles to a <code>LEFT JOIN</code> plus a predicate — different shapes, and both need an index on the foreign key or each becomes a scan',
              'Các toán tử phía nhiều (<code>some</code>, <code>every</code>, <code>none</code>) biên dịch thành <code>EXISTS</code>/<code>NOT EXISTS</code>, còn <code>is</code> phía một biên dịch thành một <code>LEFT JOIN</code> kèm một vị từ — hai hình dạng khác nhau, và cả hai đều cần chỉ mục trên khoá ngoại, không thì mỗi cái là một lần quét',
            ),
            B(
              'Neither filter fetches the related rows, so both are equivalent to <code>include</code> with a <code>where</code> and you can drop the separate <code>include</code>',
              'Không bộ lọc nào nạp các hàng liên quan, nên cả hai tương đương với <code>include</code> kèm <code>where</code> và bạn có thể bỏ hẳn phần <code>include</code> riêng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured, and the lesson prints <code>NOT EXISTS</code> for the second one — 6.19.3 emits a <code>LEFT JOIN</code> instead. The practical points survive either shape. Neither filter loads any related data: they narrow the parent list, and if you also want the rows you add <code>include</code> or <code>select</code> separately, which costs its own statement. Both need <code>@@index</code> on the referencing column, because a correlated <code>EXISTS</code> and a <code>LEFT JOIN</code> are equally miserable without one — and a three-level relation filter is three of them stacked, which is where <code>EXPLAIN ANALYZE</code> stops being optional. The habit is to read the log rather than predict it: the shape Prisma chooses is a version detail, and the index requirement is not.',
            'Đo thật, và bài học in ra <code>NOT EXISTS</code> cho cái thứ hai — 6.19.3 phát ra một <code>LEFT JOIN</code> thay vào đó. Những điểm thực tế thì đúng với cả hai hình dạng. Không bộ lọc nào nạp dữ liệu liên quan cả: chúng thu hẹp danh sách cha, còn muốn có luôn các hàng thì bạn thêm <code>include</code> hay <code>select</code> riêng, và nó tốn câu lệnh của nó. Cả hai đều cần <code>@@index</code> trên cột tham chiếu, vì một <code>EXISTS</code> tương quan và một <code>LEFT JOIN</code> đều khốn khổ như nhau khi thiếu nó — và một bộ lọc quan hệ ba tầng là ba cái như thế chồng lên nhau, đó là chỗ <code>EXPLAIN ANALYZE</code> hết còn là tuỳ chọn. Thói quen đúng là ĐỌC LOG chứ đừng đoán: hình dạng Prisma chọn là chi tiết theo phiên bản, còn yêu cầu về chỉ mục thì không.',
          ),
        }),

        mcq({
          prompt: B(
            'This was run on Prisma 6.19.3 against seven posts belonging to two authors, and all three lines are copied verbatim:' + code(
              "await p.post.findMany({ distinct: ['authorId'], orderBy: [{ authorId: 'asc' }, { views: 'desc' }] })\n" +
              '  -> [{ id: 1, authorId: 1, views: 300 }, { id: 3, authorId: 2, views: 50 }]\n\n' +
              "await p.post.findMany({ distinct: ['authorId'], orderBy: [{ views: 'asc' }] })\n" +
              '  -> [{ id: 2, authorId: 1, views: 10 }, { id: 3, authorId: 2, views: 50 }]      // no error\n\n' +
              "await p.post.findMany({ distinct: ['authorId'], take: 1, orderBy: { id: 'asc' } })\n" +
              '  -> SQL: SELECT "id", ... FROM "public"."Post" WHERE 1=1 ORDER BY "id" ASC OFFSET $1',
            ) + 'What do those three results establish?',
            'Đoạn sau chạy trên Prisma 6.19.3 với bảy bài viết thuộc hai tác giả, cả ba dòng đều chép nguyên văn:' + code(
              "await p.post.findMany({ distinct: ['authorId'], orderBy: [{ authorId: 'asc' }, { views: 'desc' }] })\n" +
              '  -> [{ id: 1, authorId: 1, views: 300 }, { id: 3, authorId: 2, views: 50 }]\n\n' +
              "await p.post.findMany({ distinct: ['authorId'], orderBy: [{ views: 'asc' }] })\n" +
              '  -> [{ id: 2, authorId: 1, views: 10 }, { id: 3, authorId: 2, views: 50 }]      // không lỗi\n\n' +
              "await p.post.findMany({ distinct: ['authorId'], take: 1, orderBy: { id: 'asc' } })\n" +
              '  -> SQL: SELECT "id", ... FROM "public"."Post" WHERE 1=1 ORDER BY "id" ASC OFFSET $1',
            ) + 'Ba kết quả đó xác lập điều gì?',
          ),
          options: [
            B(
              'There is no <code>DISTINCT</code> in the SQL and no <code>LIMIT</code> even with <code>take: 1</code> — the engine de-duplicates in memory AFTER the rows arrive, so this reads the whole table and the ordering rule the lesson attributes to PostgreSQL is not enforced at all',
              'SQL không có chữ <code>DISTINCT</code> nào và cũng không có <code>LIMIT</code> dù đã <code>take: 1</code> — engine lọc trùng TRONG BỘ NHỚ sau khi các hàng về, nên nó đọc cả bảng, và cái luật sắp xếp mà bài học gán cho PostgreSQL hoàn toàn không được áp',
            ),
            B(
              'The second call proves <code>distinct</code> silently ignores <code>orderBy</code>, which is why it returned a different row',
              'Lời gọi thứ hai chứng minh <code>distinct</code> âm thầm bỏ qua <code>orderBy</code>, và đó là lý do nó trả về một hàng khác',
            ),
            B(
              'PostgreSQL applied <code>DISTINCT ON ("authorId")</code> and the missing <code>LIMIT</code> is an optimisation, because <code>DISTINCT ON</code> already stops at the first row per group',
              'PostgreSQL đã áp <code>DISTINCT ON ("authorId")</code>, còn việc thiếu <code>LIMIT</code> là một tối ưu vì <code>DISTINCT ON</code> vốn đã dừng ở hàng đầu tiên của mỗi nhóm',
            ),
            B(
              'The second call should have failed and the missing error is a bug; the fix is to always put the distinct columns first in <code>orderBy</code>, which is a PostgreSQL requirement',
              'Lời gọi thứ hai lẽ ra phải hỏng và việc thiếu lỗi là một khiếm khuyết; cách sửa là luôn đặt các cột distinct lên đầu <code>orderBy</code> — đó là yêu cầu của PostgreSQL',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The lesson says <code>distinct</code> becomes a real <code>DISTINCT ON</code> executed in the database, and that PostgreSQL requires the distinct columns to lead the <code>orderBy</code>. Measured on 6.19.3, all of that is false: the statement contains no <code>DISTINCT</code>, an <code>orderBy</code> that does not lead with <code>authorId</code> runs without complaint (it simply changes which row survives — the FIRST one in the given order wins), and <code>take: 1</code> did not become a <code>LIMIT</code>, because the engine cannot apply the limit until after de-duplication. The consequence is the one that matters on a large table: <code>distinct</code> shapes the result and does not reduce the work. When you need one row per group cheaply, write <code>DISTINCT ON</code> yourself in <code>$queryRaw</code>, or group and join.',
            'Bài học nói <code>distinct</code> thành một <code>DISTINCT ON</code> thật, chạy trong cơ sở dữ liệu, và rằng PostgreSQL bắt các cột distinct phải mở đầu <code>orderBy</code>. Đo trên 6.19.3 thì toàn bộ chỗ đó sai: câu lệnh không có chữ <code>DISTINCT</code> nào, một <code>orderBy</code> không mở đầu bằng <code>authorId</code> chạy êm không kêu ca (nó chỉ đổi hàng nào sống sót — hàng ĐẦU TIÊN theo thứ tự đã cho thắng), và <code>take: 1</code> không hề thành <code>LIMIT</code>, vì engine chưa cắt được trước khi lọc trùng xong. Hệ quả đáng nói trên một bảng lớn là: <code>distinct</code> nắn hình kết quả chứ không giảm khối lượng công việc. Khi bạn cần một hàng cho mỗi nhóm mà phải rẻ, hãy tự viết <code>DISTINCT ON</code> trong <code>$queryRaw</code>, hoặc gom nhóm rồi nối.',
          ),
        }),

        mcq({
          prompt: B(
            'A dashboard runs this against a filter that matches no rows, on Prisma 6.19.3:' + code(
              "const k = await prisma.post.aggregate({\n" +
              '  where: { id: -1 },\n' +
              '  _sum: { views: true }, _avg: { views: true }, _count: { _all: true },\n' +
              '});\n' +
              'console.log(JSON.stringify(k));',
            ) + code(
              'SELECT SUM("views") AS "_sum$views", AVG("views") AS "_avg$views", COUNT(*) AS "_count$_all"\n' +
              'FROM (SELECT "public"."Post"."views", "public"."Post"."id"\n' +
              '      FROM "public"."Post" WHERE "public"."Post"."id" = $1 OFFSET $2) AS "sub"\n\n' +
              '{"_sum":{"views":null},"_avg":{"views":null},"_count":{"_all":0}}',
            ) + 'Which two statements follow? (choose TWO)',
            'Một bảng điều khiển chạy đoạn sau với một bộ lọc không khớp hàng nào, trên Prisma 6.19.3:' + code(
              "const k = await prisma.post.aggregate({\n" +
              '  where: { id: -1 },\n' +
              '  _sum: { views: true }, _avg: { views: true }, _count: { _all: true },\n' +
              '});\n' +
              'console.log(JSON.stringify(k));',
            ) + code(
              'SELECT SUM("views") AS "_sum$views", AVG("views") AS "_avg$views", COUNT(*) AS "_count$_all"\n' +
              'FROM (SELECT "public"."Post"."views", "public"."Post"."id"\n' +
              '      FROM "public"."Post" WHERE "public"."Post"."id" = $1 OFFSET $2) AS "sub"\n\n' +
              '{"_sum":{"views":null},"_avg":{"views":null},"_count":{"_all":0}}',
            ) + 'Hai phát biểu nào đúng theo sau? (chọn HAI)',
          ),
          options: [
            B(
              '<code>_sum</code> and <code>_avg</code> are <code>null</code>, not <code>0</code> — <code>SUM</code> of an empty set is <code>NULL</code> in SQL and Prisma passes it through faithfully, so every consumer needs <code>?? 0</code>',
              '<code>_sum</code> và <code>_avg</code> ra <code>null</code> chứ không phải <code>0</code> — <code>SUM</code> của một tập rỗng là <code>NULL</code> trong SQL và Prisma truyền lại nguyên vẹn, nên mọi nơi tiêu thụ đều cần <code>?? 0</code>',
            ),
            B(
              'Seven aggregate functions in one <code>aggregate</code> call are still one scan of the table, which is why doing them as separate <code>count</code>/<code>findFirst</code> calls is strictly worse on anything large',
              'Bảy hàm tổng hợp trong một lời gọi <code>aggregate</code> vẫn chỉ là một lần quét bảng, và đó là lý do tách chúng thành các lời gọi <code>count</code>/<code>findFirst</code> riêng luôn tệ hơn trên bất cứ bảng lớn nào',
            ),
            B(
              '<code>_count._all</code> is also <code>null</code> here and the <code>0</code> in the output came from Prisma normalising it in JavaScript',
              '<code>_count._all</code> ở đây cũng là <code>null</code> và số <code>0</code> trong kết quả là do Prisma chuẩn hoá lại trong JavaScript',
            ),
            B(
              'The wrapping subquery means the aggregate runs in the query engine rather than in PostgreSQL, so it transfers every matching row first',
              'Truy vấn con bọc ngoài nghĩa là phép tổng hợp chạy trong engine truy vấn chứ không phải trong PostgreSQL, nên nó chuyển hết các hàng khớp về trước',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'Two things worth carrying away. First, the <code>null</code>: <code>SUM</code> and <code>AVG</code> over zero rows are <code>NULL</code> by the SQL standard, while <code>COUNT</code> is <code>0</code> — so a revenue tile that renders <code>_sum.total</code> shows nothing rather than zero on a quiet day, and the fix is at the consumer. Second, the shape: everything is computed in PostgreSQL and one statement returns all of it. The wrapping subquery is not a sign of client-side work — it exists so that <code>take</code>, <code>skip</code> and <code>cursor</code> can narrow the input before the aggregate runs, which is why an <code>OFFSET</code> appears even when you passed neither. The same wrapper shows up on a plain <code>count()</code>, where the lesson prints the flat <code>SELECT COUNT(*) FROM "users"</code> form.',
            'Hai điều đáng mang theo. Một, cái <code>null</code>: <code>SUM</code> và <code>AVG</code> trên không hàng nào là <code>NULL</code> theo chuẩn SQL, còn <code>COUNT</code> là <code>0</code> — nên một ô doanh thu hiển thị <code>_sum.total</code> sẽ trống trơn chứ không phải bằng không vào một ngày vắng khách, và chỗ vá nằm ở phía tiêu thụ. Hai, hình dạng: mọi thứ được tính trong PostgreSQL và một câu lệnh trả về tất cả. Truy vấn con bọc ngoài không phải dấu hiệu của việc tính phía client — nó tồn tại để <code>take</code>, <code>skip</code> và <code>cursor</code> thu hẹp đầu vào trước khi phép tổng hợp chạy, và đó là lý do có một <code>OFFSET</code> dù bạn chẳng truyền cái nào. Cùng lớp bọc ấy hiện ra ở một lời gọi <code>count()</code> trần, chỗ mà bài học in ra dạng phẳng <code>SELECT COUNT(*) FROM "users"</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Two versions of "authors whose posts average more than 100 views" were written:' + code(
              "A  groupBy({ by: ['authorId'], where: { views: { gt: 100 } }, _avg: { views: true } })\n" +
              "B  groupBy({ by: ['authorId'], having: { views: { _avg: { gt: 100 } } }, _avg: { views: true } })",
            ) + 'and B emitted:' + code(
              'SELECT COUNT(*) AS "_count$_all", AVG("views") AS "_avg$views", "authorId"\n' +
              'FROM "public"."Post" WHERE 1=1 GROUP BY "public"."Post"."authorId"\n' +
              'HAVING AVG("public"."Post"."views") > $1 ORDER BY "authorId" ASC',
            ) + 'Which describes the difference?',
            'Hai phiên bản của "những tác giả có bài viết trung bình hơn 100 lượt xem":' + code(
              "A  groupBy({ by: ['authorId'], where: { views: { gt: 100 } }, _avg: { views: true } })\n" +
              "B  groupBy({ by: ['authorId'], having: { views: { _avg: { gt: 100 } } }, _avg: { views: true } })",
            ) + 'và B phát ra:' + code(
              'SELECT COUNT(*) AS "_count$_all", AVG("views") AS "_avg$views", "authorId"\n' +
              'FROM "public"."Post" WHERE 1=1 GROUP BY "public"."Post"."authorId"\n' +
              'HAVING AVG("public"."Post"."views") > $1 ORDER BY "authorId" ASC',
            ) + 'Phát biểu nào mô tả đúng khác biệt?',
          ),
          options: [
            B(
              'They are equivalent, and B is only the more explicit spelling — Prisma rewrites a <code>where</code> on an aggregated field into a <code>HAVING</code>',
              'Hai cái tương đương, B chỉ là cách viết tường minh hơn — Prisma tự viết lại một <code>where</code> trên trường được tổng hợp thành <code>HAVING</code>',
            ),
            B(
              'A is the correct one: <code>having</code> is evaluated in the query engine after the groups come back, so it cannot use an index and returns the same rows more slowly',
              'A mới đúng: <code>having</code> được tính trong engine truy vấn sau khi các nhóm trở về, nên nó không dùng được chỉ mục và trả về cùng số hàng nhưng chậm hơn',
            ),
            B(
              'B is the correct one, and A answers a different question: A first throws away every post under 100 views, then averages what is left — so it reports "the average of an author\'s popular posts", which is above 100 for almost everyone',
              'B mới đúng, còn A trả lời một câu hỏi khác: A vứt bỏ trước mọi bài dưới 100 lượt xem rồi mới lấy trung bình phần còn lại — nên nó báo "trung bình của những bài ĐÔNG KHÁCH của một tác giả", thứ hầu như ai cũng trên 100',
            ),
            B(
              'Neither works: <code>groupBy</code> cannot filter on an aggregate at all, and this requires a raw query with <code>HAVING</code>',
              'Không cái nào chạy: <code>groupBy</code> hoàn toàn không lọc theo giá trị tổng hợp được, và việc này đòi một truy vấn thô có <code>HAVING</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>where</code> filters ROWS before grouping; <code>having</code> filters GROUPS after. A means "consider only posts over 100 views, then average them", which is a confidently wrong report rather than an error — every author with a single popular post qualifies. B means "consider all posts, keep the authors whose average exceeds 100", which is the question that was asked. Both run entirely in PostgreSQL. Worth knowing alongside: <code>groupBy</code> cannot group by an expression (<code>date_trunc(\'month\', …)</code>), cannot group across a relation, has no window functions, and produces no row for a period with no data — so a thirty-day chart silently arrives with twenty-six bars. All four of those are where a dashboard query leaves Prisma for <code>$queryRaw</code>.',
            '<code>where</code> lọc HÀNG trước khi gom nhóm; <code>having</code> lọc NHÓM sau khi gom. A nghĩa là "chỉ xét những bài trên 100 lượt xem rồi lấy trung bình", tức một báo cáo sai một cách tự tin chứ không phải một lỗi — mọi tác giả có đúng một bài đông khách đều lọt. B nghĩa là "xét mọi bài, giữ lại tác giả nào có trung bình vượt 100", đúng câu hỏi đã đặt ra. Cả hai đều chạy trọn vẹn trong PostgreSQL. Đáng biết kèm theo: <code>groupBy</code> không gom nhóm theo biểu thức được (<code>date_trunc(\'month\', …)</code>), không gom nhóm xuyên quan hệ được, không có hàm cửa sổ, và không sinh ra hàng nào cho một kỳ không có dữ liệu — nên một biểu đồ ba mươi ngày âm thầm về với hai mươi sáu cột. Cả bốn chỗ đó là nơi một truy vấn bảng điều khiển rời Prisma để sang <code>$queryRaw</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A feed is ordered by <code>publishedAt</code> descending. Which pair of <code>orderBy</code> problems is real?' + code(
              "orderBy: { publishedAt: 'desc' }",
            ),
            'Một bảng tin sắp xếp theo <code>publishedAt</code> giảm dần. Cặp vấn đề nào của <code>orderBy</code> là có thật?' + code(
              "orderBy: { publishedAt: 'desc' }",
            ),
          ),
          options: [
            B(
              'Prisma appends the primary key as a tiebreaker automatically, so the only real problem is null placement — and <code>nulls</code> is not supported on PostgreSQL',
              'Prisma tự gắn khoá chính làm khoá phân định, nên vấn đề thật duy nhất là chỗ đặt null — mà <code>nulls</code> lại không được hỗ trợ trên PostgreSQL',
            ),
            B(
              'Object key order is not a contract, so this single-key form is the unreliable one; the fix is an array even when there is only one key',
              'Thứ tự khoá trong object không phải một cam kết, nên chính dạng một-khoá này mới là dạng không tin được; cách sửa là dùng mảng ngay cả khi chỉ có một khoá',
            ),
            B(
              'Ordering by a nullable column forces a sequential scan regardless of indexes, so the column must be made <code>NOT NULL</code> before the feed can be paginated at all',
              'Sắp xếp theo một cột cho phép null buộc phải quét tuần tự bất kể chỉ mục, nên phải đổi cột thành <code>NOT NULL</code> thì bảng tin mới phân trang được',
            ),
            B(
              'Rows sharing a timestamp have no defined order, so the same post can appear on page 1 and again on page 2 — end with a unique tiebreaker such as <code>[{ publishedAt: \'desc\' }, { id: \'desc\' }]</code>; and unset dates land FIRST under <code>desc</code> in PostgreSQL, so drafts head the feed unless you write <code>nulls: \'last\'</code>',
              'Những hàng trùng dấu thời gian không có thứ tự xác định, nên cùng một bài có thể xuất hiện ở trang 1 rồi lại ở trang 2 — hãy kết thúc bằng một khoá phân định duy nhất như <code>[{ publishedAt: \'desc\' }, { id: \'desc\' }]</code>; và những ngày chưa đặt sẽ nằm ĐẦU khi sắp <code>desc</code> trong PostgreSQL, nên bài nháp leo lên đầu bảng tin trừ khi bạn ghi <code>nulls: \'last\'</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two independent problems, both quiet. The tiebreaker one is the expensive half: without a unique last key, two rows with the same timestamp can swap places between two queries, so an offset page boundary repeats one row and skips another — and it is invisible until the data has enough ties. Cursor pagination has the same requirement from the other end, since whatever you cursor on must be the LAST key in the <code>orderBy</code> or the sort order and the cursor disagree. The nulls one is a display bug rather than a correctness bug, and it surprises people because PostgreSQL treats <code>NULL</code> as larger than everything: <code>DESC</code> puts them first, <code>ASC</code> puts them last, which is the opposite of the usual intention. Object key order does happen to be preserved in practice, but an array states the priority instead of relying on it.',
            'Hai vấn đề độc lập, cả hai đều lặng lẽ. Chuyện khoá phân định là nửa tốn kém: thiếu một khoá cuối cùng duy nhất, hai hàng cùng dấu thời gian có thể đổi chỗ giữa hai lần truy vấn, nên một ranh giới trang theo offset lặp lại một hàng và bỏ sót một hàng khác — và nó vô hình cho tới khi dữ liệu đủ nhiều chỗ trùng. Phân trang bằng con trỏ cũng đòi hỏi y hệt từ đầu bên kia, vì thứ bạn dùng làm con trỏ phải là khoá CUỐI trong <code>orderBy</code>, không thì thứ tự sắp xếp và con trỏ nói khác nhau. Chuyện null là lỗi hiển thị chứ không phải lỗi đúng sai, và nó làm người ta ngạc nhiên vì PostgreSQL coi <code>NULL</code> lớn hơn mọi thứ: <code>DESC</code> đẩy chúng lên đầu, <code>ASC</code> đẩy xuống cuối — ngược với ý định thông thường. Thứ tự khoá trong object trên thực tế có được giữ, nhưng một mảng thì NÓI RÕ thứ tự ưu tiên thay vì trông chờ vào nó.',
          ),
        }),

        mcq({
          prompt: B(
            'A search box uses <code>contains</code> with <code>mode: \'insensitive\'</code> over <code>title</code> and <code>body</code>, and it has become slow. The team is deciding what to do. Which sequence is right?',
            'Một ô tìm kiếm dùng <code>contains</code> kèm <code>mode: \'insensitive\'</code> trên <code>title</code> và <code>body</code>, và nó đã chậm. Nhóm đang cân nhắc phải làm gì. Trình tự nào ĐÚNG?',
          ),
          options: [
            B(
              'Move to a dedicated search engine now: PostgreSQL cannot index a substring search at all, so every intermediate step is wasted effort',
              'Chuyển sang một máy tìm kiếm chuyên dụng ngay: PostgreSQL hoàn toàn không đánh chỉ mục nổi một phép tìm chuỗi con, nên mọi bước trung gian đều là công cốc',
            ),
            B(
              'Turn on Prisma\'s preview <code>fullTextSearch</code> and use <code>{ title: { search: … } }</code> — it compiles to <code>to_tsquery</code> against a stored column and an index, which is the whole fix in one line',
              'Bật tính năng xem trước <code>fullTextSearch</code> của Prisma rồi dùng <code>{ title: { search: … } }</code> — nó biên dịch thành <code>to_tsquery</code> chạy trên một cột đã lưu và một chỉ mục, và đó là toàn bộ cách vá gói trong một dòng',
            ),
            B(
              'Add <code>@@index([title])</code> and <code>@@index([body])</code> in the schema; the planner will then serve <code>ILIKE</code> from the B-trees',
              'Thêm <code>@@index([title])</code> và <code>@@index([body])</code> vào lược đồ; bộ lập kế hoạch khi đó sẽ phục vụ <code>ILIKE</code> từ hai cây B-tree',
            ),
            B(
              'First a GIN trigram index in a hand-written migration, which makes the SAME Prisma query index-backed and adds fuzzy matching; then, if ranking is needed, a generated <code>tsvector</code> column with a GIN index queried through <code>$queryRaw</code>',
              'Trước hết là một chỉ mục GIN trigram trong một migration viết tay — nó làm CHÍNH câu truy vấn Prisma cũ được chỉ mục đỡ và tặng thêm khả năng chịu gõ sai; rồi nếu cần xếp hạng thì thêm một cột <code>tsvector</code> sinh tự động kèm chỉ mục GIN, truy vấn qua <code>$queryRaw</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The trigram index is the highest effort-to-benefit step in the whole chapter: two lines of SQL, no application change, and <code>ILIKE \'%…%\'</code> becomes index-backed — which is normally impossible for a leading wildcard. It also brings <code>similarity()</code> and the <code>%</code> operator, so typos start matching. Only when you need RANKING — a title hit outscoring a body hit — is a <code>tsvector</code> column worth the extra machinery, and that needs <code>setweight</code>, <code>ts_rank</code> and <code>websearch_to_tsquery</code> through raw SQL because Prisma cannot model the column. A B-tree cannot serve a leading wildcard at all, and Prisma\'s preview <code>search</code> operator compiles to <code>to_tsquery</code> with NO stored column and no index, so it is convenient and does not solve the performance problem. A separate search engine is justified by requirements — facets, synonyms, cross-corpus typo tolerance — not by row count.',
            'Chỉ mục trigram là bước có tỷ lệ công-sức trên lợi-ích cao nhất trong cả chương: hai dòng SQL, không đổi mã ứng dụng, và <code>ILIKE \'%…%\'</code> được chỉ mục đỡ — thứ vốn bất khả với một ký tự đại diện đứng đầu. Nó còn kéo theo <code>similarity()</code> và toán tử <code>%</code>, thế là gõ sai vẫn khớp. Chỉ khi cần XẾP HẠNG — một cú trúng ở tiêu đề phải hơn điểm một cú trúng ở thân bài — thì cột <code>tsvector</code> mới đáng công, và nó cần <code>setweight</code>, <code>ts_rank</code> và <code>websearch_to_tsquery</code> qua SQL thô vì Prisma không mô hình hoá nổi cột ấy. B-tree hoàn toàn không phục vụ được ký tự đại diện đứng đầu, còn toán tử <code>search</code> ở dạng xem trước của Prisma biên dịch thành <code>to_tsquery</code> mà KHÔNG có cột lưu sẵn và không có chỉ mục — nên nó tiện chứ không giải quyết vấn đề hiệu năng. Một máy tìm kiếm riêng được biện minh bằng YÊU CẦU — bộ lọc theo mặt, từ đồng nghĩa, chịu gõ sai trên toàn kho — chứ không phải bằng số hàng.',
          ),
        }),

        // ── Chương 6 — Migration ────────────────────────────────────────
        mcq({
          prompt: B(
            'A migrations folder looks like this:' + code(
              'prisma/migrations/\n' +
              '  0_init/migration.sql\n' +
              '  20260622_add_message_reply_support/migration.sql\n' +
              '  20260706130000_add_music_and_profile/migration.sql\n' +
              '  migration_lock.toml',
            ) + 'Which two statements are correct? (choose TWO)',
            'Một thư mục migration trông như thế này:' + code(
              'prisma/migrations/\n' +
              '  0_init/migration.sql\n' +
              '  20260622_add_message_reply_support/migration.sql\n' +
              '  20260706130000_add_music_and_profile/migration.sql\n' +
              '  migration_lock.toml',
            ) + 'Hai phát biểu nào ĐÚNG? (chọn HAI)',
          ),
          options: [
            B(
              'Migrations run in lexicographic order of the folder name, which is why <code>0_init</code> comes first and why the timestamp prefix exists at all — the order is a property of the NAME, not of the file dates',
              'Migration chạy theo thứ tự từ điển của tên thư mục, và đó là lý do <code>0_init</code> đứng trước, cũng là lý do tồn tại phần tiền tố dấu thời gian — thứ tự là thuộc tính của cái TÊN chứ không phải của ngày tháng của tệp',
            ),
            B(
              '<code>migration_lock.toml</code> records the provider the SQL was written for, so switching provider errors instead of silently generating MySQL SQL against PostgreSQL; commit it and never edit it',
              '<code>migration_lock.toml</code> ghi lại provider mà đám SQL này được viết cho, nên đổi provider sẽ báo lỗi thay vì âm thầm sinh SQL của MySQL để chạy trên PostgreSQL; hãy commit nó và đừng bao giờ sửa',
            ),
            B(
              'Each folder may hold several <code>.sql</code> files, which Prisma concatenates in alphabetical order before applying',
              'Mỗi thư mục có thể chứa nhiều tệp <code>.sql</code>, Prisma nối chúng theo thứ tự bảng chữ cái rồi mới áp dụng',
            ),
            B(
              '<code>migration_lock.toml</code> is a per-machine advisory lock that stops two developers applying migrations at once; it is gitignored',
              '<code>migration_lock.toml</code> là một khoá tư vấn theo từng máy, ngăn hai lập trình viên cùng áp migration một lúc; nó nằm trong gitignore',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'The folder name is the identity and the ordering, which is why the format is <code>&lt;timestamp&gt;_&lt;name&gt;</code>: for that shape, lexicographic and chronological agree. <code>0_init</code> sorting first is not a special case — <code>0</code> simply sorts before <code>2</code>, and that is exactly why a baseline is named that way. Each folder holds exactly one <code>migration.sql</code>. All of it is committed, because migrations are source code: reviewed in a pull request, versioned, and the way a new developer builds a database that matches production. And the row-level detail that decides everything else in this chapter lives in <code>_prisma_migrations</code>: <code>migration_name</code>, <code>checksum</code>, <code>finished_at</code>, <code>rolled_back_at</code> and <code>applied_steps_count</code>.',
            'Tên thư mục vừa là định danh vừa là thứ tự, và đó là lý do khuôn tên là <code>&lt;dấu thời gian&gt;_&lt;tên&gt;</code>: với khuôn ấy, thứ tự từ điển trùng với thứ tự thời gian. Việc <code>0_init</code> đứng đầu không phải một ngoại lệ — <code>0</code> đơn giản là đứng trước <code>2</code>, và đó chính là lý do một bản nền được đặt tên như thế. Mỗi thư mục chứa đúng một tệp <code>migration.sql</code>. Tất cả đều được commit, vì migration là mã nguồn: được review trong pull request, được đánh phiên bản, và là cách một lập trình viên mới dựng ra một cơ sở dữ liệu khớp với production. Còn phần chi tiết mức hàng quyết định mọi thứ còn lại trong chương này thì nằm ở <code>_prisma_migrations</code>: <code>migration_name</code>, <code>checksum</code>, <code>finished_at</code>, <code>rolled_back_at</code> và <code>applied_steps_count</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A production deploy runs as a database user that has full rights inside one database and cannot <code>CREATE DATABASE</code>. <code>migrate deploy</code> works there; <code>migrate dev</code> fails with <code>P3014</code>. Why?',
            'Một lần deploy production chạy bằng một tài khoản cơ sở dữ liệu có toàn quyền bên trong một database và KHÔNG có quyền <code>CREATE DATABASE</code>. <code>migrate deploy</code> chạy được ở đó; <code>migrate dev</code> hỏng với <code>P3014</code>. Vì sao?',
          ),
          options: [
            B(
              '<code>migrate dev</code> creates a throwaway shadow database, replays the whole history into it and diffs it twice; <code>migrate deploy</code> creates none — it reads the folder, reads <code>_prisma_migrations</code>, applies what is missing, never prompts and writes no files',
              '<code>migrate dev</code> tạo một shadow database dùng một lần, phát lại toàn bộ lịch sử vào đó rồi so hai lần; <code>migrate deploy</code> không tạo cái nào — nó đọc thư mục, đọc <code>_prisma_migrations</code>, áp phần còn thiếu, không bao giờ hỏi và không viết ra tệp nào',
            ),
            B(
              '<code>migrate deploy</code> runs each migration outside a transaction, which needs fewer privileges than the transactional form <code>migrate dev</code> uses',
              '<code>migrate deploy</code> chạy mỗi migration ngoài giao dịch, thứ cần ít quyền hơn dạng có giao dịch mà <code>migrate dev</code> dùng',
            ),
            B(
              '<code>migrate deploy</code> does not actually apply anything — it only records the migrations as applied, which is why it needs no write privileges beyond one table',
              '<code>migrate deploy</code> thật ra không áp gì cả — nó chỉ ghi nhận các migration là đã áp, nên nó không cần quyền ghi nào ngoài một cái bảng',
            ),
            B(
              '<code>migrate dev</code> needs the privilege in order to take an advisory lock, which prevents two deploys running at once; <code>migrate deploy</code> skips that safety',
              '<code>migrate dev</code> cần quyền đó để lấy một advisory lock nhằm ngăn hai lần deploy chạy cùng lúc; <code>migrate deploy</code> bỏ qua lớp an toàn ấy',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The shadow database is the difference. <code>migrate dev</code> creates one, replays every migration from <code>0_init</code> into it — which verifies the history is REPLAYABLE, so a fresh developer or a clean CI database can build the schema from scratch — then diffs it against your schema to generate the new migration, and against the real database to detect drift. All of that needs <code>CREATE DATABASE</code>, which managed providers correctly refuse; the fix is <code>shadowDatabaseUrl</code> pointing at a second empty database you created yourself. <code>migrate deploy</code> does none of it, which is exactly why it is the production command: no shadow, no prompts, no generated files, and a non-zero exit code your pipeline can gate on. It is also the escape hatch — it applies a hand-written migration that <code>migrate dev</code> would refuse to generate.',
            'Shadow database chính là khác biệt. <code>migrate dev</code> tạo một cái, phát lại mọi migration từ <code>0_init</code> vào đó — việc này xác nhận lịch sử PHÁT LẠI ĐƯỢC, tức một lập trình viên mới hay một cơ sở dữ liệu CI sạch có thể dựng lược đồ từ đầu — rồi so nó với lược đồ của bạn để sinh migration mới, và so với cơ sở dữ liệu thật để phát hiện trôi dạt. Tất cả những việc đó cần <code>CREATE DATABASE</code>, thứ mà các nhà cung cấp quản lý từ chối một cách đúng đắn; cách vá là <code>shadowDatabaseUrl</code> trỏ vào một database rỗng thứ hai do chính bạn tạo. <code>migrate deploy</code> không làm gì trong số đó, và đó đúng là lý do nó là lệnh của production: không shadow, không hỏi han, không sinh tệp, và một mã thoát khác không để đường ống của bạn chặn lại. Nó cũng là lối thoát hiểm — nó áp được một migration viết tay mà <code>migrate dev</code> sẽ từ chối sinh ra.',
          ),
        }),

        mcq({
          prompt: B(
            'A hosted database needs a shadow database, so a developer copies a connection string from the dashboard into <code>SHADOW_DATABASE_URL</code>. What must that URL point at, and why?',
            'Một cơ sở dữ liệu thuê cần shadow database, nên một lập trình viên chép một chuỗi kết nối từ trang quản trị vào <code>SHADOW_DATABASE_URL</code>. URL đó phải trỏ vào đâu, và vì sao?',
          ),
          options: [
            B(
              'The same database as <code>DATABASE_URL</code> — Prisma uses a separate PostgreSQL schema inside it, so one connection string is enough',
              'Cùng một database với <code>DATABASE_URL</code> — Prisma dùng một schema PostgreSQL riêng bên trong nó, nên một chuỗi kết nối là đủ',
            ),
            B(
              'A read replica, so the replay is verified against real data without any write load on the primary',
              'Một bản sao chỉ đọc, để phần phát lại được kiểm với dữ liệu thật mà không tạo tải ghi lên bản chính',
            ),
            B(
              'A database whose only purpose is being destroyed: Prisma DROPS every table in it on each <code>migrate dev</code> run, so pointing it at staging wipes staging and the command reports success, because that is exactly what it was asked to do',
              'Một database mà lý do tồn tại duy nhất là bị phá đi: Prisma XOÁ mọi bảng trong đó ở mỗi lần <code>migrate dev</code>, nên trỏ nó vào staging là xoá sạch staging, và lệnh vẫn báo thành công vì đó đúng là việc nó được giao',
            ),
            B(
              'Any empty database — and if it later gains tables, Prisma detects them and refuses to reset, which is the built-in guard against pointing it at something real',
              'Bất kỳ database rỗng nào — và nếu về sau nó có bảng, Prisma phát hiện ra rồi từ chối reset; đó là lớp bảo vệ cài sẵn chống việc trỏ vào thứ có thật',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The shadow database is reset by design. That is not a warning buried in the docs, it is the documented behaviour, and there is no guard: Prisma cannot know that the database you named is your staging environment. The failure bites hardest on a hosted provider, where the two connection strings are copied from the same dashboard page and differ by one character. Two habits make it safe: point it at a database whose name says it is disposable, and keep it in a local <code>.env</code> only, never in a deployed environment — <code>migrate deploy</code> never uses one, so production has no reason to know the URL exists. The same "read the target before the destructive command" discipline applies to <code>migrate reset</code>, whose one-keystroke prompt is the only thing between you and replaying 118 migrations onto an empty production database.',
            'Shadow database bị reset theo THIẾT KẾ. Đó không phải một cảnh báo giấu trong tài liệu, đó là hành vi được ghi rõ, và không có lớp bảo vệ nào: Prisma không thể biết cái database bạn nêu tên chính là môi trường staging của bạn. Cú này cắn đau nhất ở nhà cung cấp thuê, nơi hai chuỗi kết nối được chép từ cùng một trang quản trị và chỉ khác nhau một ký tự. Hai thói quen làm nó an toàn: trỏ vào một database mà cái tên đã nói lên rằng nó dùng xong vứt, và chỉ giữ nó trong <code>.env</code> ở máy, không bao giờ đưa vào môi trường đã triển khai — <code>migrate deploy</code> không bao giờ dùng tới nó, nên production chẳng có lý do gì phải biết URL ấy tồn tại. Cũng kỷ luật "đọc cái đích trước khi gõ lệnh phá huỷ" ấy áp cho <code>migrate reset</code>, mà lời nhắc một phím của nó là thứ duy nhất đứng giữa bạn và việc phát lại 118 migration lên một cơ sở dữ liệu production trống rỗng.',
          ),
        }),

        mcq({
          prompt: B(
            'A comment line was appended to a migration that had already been applied. Then, on Prisma 6.19.3, three commands were run and the output is copied verbatim:' + code(
              '$ shasum -a 256 prisma/migrations/20260101000000_init/migration.sql\n' +
              '83458e1fb05666bef5dd4617130ad16f2e7d23ab276b39a95bb88a8db3269241\n' +
              '$ psql -c "SELECT checksum FROM _prisma_migrations WHERE migration_name = \'20260101000000_init\'"\n' +
              'bda7426d079503c17a180976a6368dd0916da4c6f093fc7b47f1a9a891bca82d\n\n' +
              '$ npx prisma migrate deploy   -> Applying migration `20260102000000_add_body` … successfully applied.\n' +
              '$ npx prisma migrate status   -> Database schema is up to date!\n' +
              '$ npx prisma migrate dev      -> The migration `20260101000000_init` was modified after it\n' +
              '                                 was applied. We need to reset the "public" schema …\n' +
              '                                 All data will be lost.',
            ) + 'What does that establish?',
            'Một dòng chú thích được thêm vào cuối một migration ĐÃ ÁP DỤNG. Sau đó, trên Prisma 6.19.3, ba lệnh được chạy và kết quả chép nguyên văn:' + code(
              '$ shasum -a 256 prisma/migrations/20260101000000_init/migration.sql\n' +
              '83458e1fb05666bef5dd4617130ad16f2e7d23ab276b39a95bb88a8db3269241\n' +
              '$ psql -c "SELECT checksum FROM _prisma_migrations WHERE migration_name = \'20260101000000_init\'"\n' +
              'bda7426d079503c17a180976a6368dd0916da4c6f093fc7b47f1a9a891bca82d\n\n' +
              '$ npx prisma migrate deploy   -> Applying migration `20260102000000_add_body` … successfully applied.\n' +
              '$ npx prisma migrate status   -> Database schema is up to date!\n' +
              '$ npx prisma migrate dev      -> The migration `20260101000000_init` was modified after it\n' +
              '                                 was applied. We need to reset the "public" schema …\n' +
              '                                 All data will be lost.',
            ) + 'Điều đó xác lập được gì?',
          ),
          options: [
            B(
              'The checksums differ because <code>checksum</code> is not a SHA-256 of the file at all — it is a hash of the resulting schema, so a comment cannot change it and nothing is wrong here',
              'Hai checksum khác nhau vì <code>checksum</code> không phải SHA-256 của tệp — nó là mã băm của lược đồ kết quả, nên một dòng chú thích không đổi được nó và ở đây chẳng có gì sai',
            ),
            B(
              '<code>migrate deploy</code> succeeded because it re-hashed the file and UPDATED the stored checksum, which is why <code>status</code> is then clean',
              '<code>migrate deploy</code> chạy được vì nó băm lại tệp rồi CẬP NHẬT checksum đã lưu, và đó là lý do sau đó <code>status</code> sạch sẽ',
            ),
            B(
              '<code>migrate dev</code> is reporting drift rather than a checksum problem — the real cause is the column added by the second migration, and re-running <code>deploy</code> resolves it',
              '<code>migrate dev</code> đang báo trôi dạt chứ không phải vấn đề checksum — nguyên nhân thật là cái cột do migration thứ hai thêm vào, và chạy lại <code>deploy</code> là xong',
            ),
            B(
              'The stored checksum is stale but neither <code>migrate deploy</code> nor <code>migrate status</code> compares it — only <code>migrate dev</code> does, and its answer is a RESET rather than a repair, so editing an applied migration is caught by the one command a production pipeline never runs',
              'Checksum lưu trong bảng đã cũ nhưng cả <code>migrate deploy</code> lẫn <code>migrate status</code> đều không so nó — chỉ <code>migrate dev</code> mới so, và câu trả lời của nó là RESET chứ không phải sửa chữa, nên việc sửa một migration đã áp dụng chỉ bị bắt bởi đúng cái lệnh mà một đường ống production không bao giờ chạy',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured end to end, and the lesson\'s claim that editing an applied migration "breaks every future deploy" is not what 6.19.3 does. <code>migrate deploy</code> reads the folder, reads which names are already in <code>_prisma_migrations</code>, and applies the rest — it never compares a hash. <code>migrate status</code> is equally quiet. The check lives in <code>migrate dev</code>, because that is the command that replays the history into a shadow database, and it does not offer to fix anything: it asks to reset. Two consequences worth holding together. The rule "never edit an applied migration" is still right, and its justification is that the recorded history stops describing what actually ran — a correctness argument, not a "the pipeline will stop you" argument. And a green <code>migrate status</code> proves only that no name is pending; it is not evidence that the files and the database agree.',
            'Đo đủ từ đầu đến cuối, và lời khẳng định của bài học rằng sửa một migration đã áp dụng "làm chết mọi lần deploy sau đó" không phải thứ 6.19.3 làm. <code>migrate deploy</code> đọc thư mục, đọc xem những tên nào đã có trong <code>_prisma_migrations</code>, rồi áp phần còn lại — nó không hề so một mã băm nào. <code>migrate status</code> cũng lặng thinh y vậy. Phép kiểm nằm ở <code>migrate dev</code>, vì đó là lệnh phát lại lịch sử vào một shadow database, và nó không đề nghị sửa gì cả: nó đòi reset. Hai hệ quả nên nhớ chung với nhau. Luật "đừng bao giờ sửa một migration đã áp dụng" vẫn đúng, và lý lẽ của nó là lịch sử được ghi lại thôi không còn mô tả thứ đã thật sự chạy — một lập luận về tính đúng đắn, chứ không phải lập luận "đường ống sẽ chặn bạn lại". Và một <code>migrate status</code> xanh chỉ chứng minh rằng không có cái tên nào đang chờ; nó không phải bằng chứng rằng các tệp và cơ sở dữ liệu đồng ý với nhau.',
          ),
        }),

        mcq({
          prompt: B(
            'A field is renamed in the schema and the generated migration is read before committing:' + code(
              'model User {\n' +
              '- fullName String? @map("full_name")\n' +
              '+ fullName String? @map("ho_ten")\n' +
              '}',
            ) + code(
              'ALTER TABLE "users" DROP COLUMN "full_name";\n' +
              'ALTER TABLE "users" ADD COLUMN     "ho_ten" TEXT;',
            ) + 'What is happening, and what should the file say instead?',
            'Một trường được đổi tên trong lược đồ và migration sinh ra được đọc trước khi commit:' + code(
              'model User {\n' +
              '- fullName String? @map("full_name")\n' +
              '+ fullName String? @map("ho_ten")\n' +
              '}',
            ) + code(
              'ALTER TABLE "users" DROP COLUMN "full_name";\n' +
              'ALTER TABLE "users" ADD COLUMN     "ho_ten" TEXT;',
            ) + 'Chuyện gì đang xảy ra, và tệp đó lẽ ra phải viết gì?',
          ),
          options: [
            B(
              'Prisma diffs two schema STATES, and "column gone, column new" is indistinguishable from a rename — so the generated SQL destroys every value in the column and reports success; replace both lines with <code>ALTER TABLE "users" RENAME COLUMN "full_name" TO "ho_ten";</code>',
              'Prisma so hai TRẠNG THÁI lược đồ, và "mất một cột, có một cột mới" thì không phân biệt được với một lần đổi tên — nên SQL sinh ra huỷ sạch mọi giá trị trong cột đó rồi báo thành công; hãy thay cả hai dòng bằng <code>ALTER TABLE "users" RENAME COLUMN "full_name" TO "ho_ten";</code>',
            ),
            B(
              'This is correct output: PostgreSQL carries the data across a <code>DROP</code> immediately followed by an <code>ADD</code> of the same type within one transaction',
              'Đây là kết quả đúng: PostgreSQL mang dữ liệu qua được một lệnh <code>DROP</code> đi liền ngay sau đó là một lệnh <code>ADD</code> cùng kiểu trong cùng một giao dịch',
            ),
            B(
              'The <code>@map</code> change affects only the generated client, so the migration is spurious and the correct action is to delete the folder and regenerate',
              'Thay đổi ở <code>@map</code> chỉ ảnh hưởng client sinh ra, nên migration này là thừa và hành động đúng là xoá thư mục ấy đi rồi sinh lại',
            ),
            B(
              'Prisma detected the rename and emitted the two-step form deliberately, because <code>RENAME COLUMN</code> takes an <code>ACCESS EXCLUSIVE</code> lock while <code>DROP</code>/<code>ADD</code> does not',
              'Prisma đã nhận ra phép đổi tên và cố ý phát ra dạng hai bước, vì <code>RENAME COLUMN</code> giữ khoá <code>ACCESS EXCLUSIVE</code> còn <code>DROP</code>/<code>ADD</code> thì không',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The generator has no way to know a rename happened — it sees a before state and an after state, and the minimal SQL between them is a drop and an add. On a development database with test data this is invisible; on production it is silent, permanent data loss and the migration reports success. The habit that catches it is mechanical: read every generated migration before committing and search it for <code>DROP</code>. <code>migrate dev</code> does warn in its interactive prompt, but a warning in a wall of green output is a warning nobody reads, and in a pipeline nobody sees it at all. Note also that <code>RENAME COLUMN</code> is metadata-only and instant at any table size — the two-step version is the one that rewrites data.',
            'Bộ sinh mã không có cách nào biết là đã có một phép đổi tên — nó thấy một trạng thái trước và một trạng thái sau, và đoạn SQL tối thiểu giữa hai cái đó là một lệnh xoá cộng một lệnh thêm. Trên một cơ sở dữ liệu phát triển với dữ liệu thử thì chuyện này vô hình; trên production nó là mất dữ liệu vĩnh viễn trong im lặng, và migration vẫn báo thành công. Thói quen bắt được nó thì máy móc thôi: đọc mọi migration sinh ra trước khi commit và tìm chữ <code>DROP</code> trong đó. <code>migrate dev</code> có cảnh báo trong lời nhắc tương tác, nhưng một cảnh báo nằm giữa một bức tường chữ xanh là một cảnh báo không ai đọc, còn trong một đường ống thì chẳng ai thấy nó bao giờ. Cũng để ý rằng <code>RENAME COLUMN</code> chỉ đụng siêu dữ liệu và tức thì với mọi cỡ bảng — chính bản hai bước mới là bản viết lại dữ liệu.',
          ),
        }),

        mcq({
          prompt: B(
            'A migration with two statements was deployed to PostgreSQL 16.14 and the second one failed. Afterwards, this was measured:' + code(
              '-- migration.sql\n' +
              'ALTER TABLE "Note" ADD COLUMN "note" TEXT;\n' +
              'ALTER TABLE "Note" ADD CONSTRAINT "note_total_nonneg" CHECK ("total" >= 0);',
            ) + code(
              'Error: P3018 … Database error code: 23514\n' +
              'ERROR: check constraint "note_total_nonneg" of relation "Note" is violated by some row\n\n' +
              'SELECT migration_name, applied_steps_count FROM _prisma_migrations;\n' +
              ' 20260102000000_bad  |  0\n\n' +
              '\\d "Note"   ->  id | title | total          (no "note" column)',
            ) + 'What state is the database in?',
            'Một migration hai câu lệnh được deploy lên PostgreSQL 16.14 và câu thứ hai hỏng. Sau đó đo được:' + code(
              '-- migration.sql\n' +
              'ALTER TABLE "Note" ADD COLUMN "note" TEXT;\n' +
              'ALTER TABLE "Note" ADD CONSTRAINT "note_total_nonneg" CHECK ("total" >= 0);',
            ) + code(
              'Error: P3018 … Database error code: 23514\n' +
              'ERROR: check constraint "note_total_nonneg" of relation "Note" is violated by some row\n\n' +
              'SELECT migration_name, applied_steps_count FROM _prisma_migrations;\n' +
              ' 20260102000000_bad  |  0\n\n' +
              '\\d "Note"   ->  id | title | total          (không có cột "note")',
            ) + 'Cơ sở dữ liệu đang ở trạng thái nào?',
          ),
          options: [
            B(
              'Half-migrated: the <code>note</code> column exists but is hidden from <code>\\d</code> until the migration is resolved, so the first job is to drop it by hand',
              'Nửa vời: cột <code>note</code> có tồn tại nhưng bị <code>\\d</code> giấu đi cho tới khi migration được xử lý, nên việc đầu tiên là xoá nó bằng tay',
            ),
            B(
              'The schema is completely unchanged — PostgreSQL has transactional DDL, so the whole file rolled back and <code>applied_steps_count = 0</code> says so; what is blocked is the RECORD, and every later <code>migrate deploy</code> now stops with <code>P3009</code> until a human resolves the row',
              'Lược đồ không suy suyển gì cả — PostgreSQL có DDL trong giao dịch, nên cả tệp bị cuộn lại và <code>applied_steps_count = 0</code> nói đúng điều đó; thứ bị chặn là phần GHI NHẬN, và từ giờ mọi lần <code>migrate deploy</code> sau đều dừng với <code>P3009</code> cho tới khi có người xử lý cái hàng ấy',
            ),
            B(
              'The constraint was created as <code>NOT VALID</code> and only the validation failed, so the schema has the constraint and the column and nothing needs undoing',
              'Ràng buộc được tạo dạng <code>NOT VALID</code> và chỉ phần kiểm tra là hỏng, nên lược đồ đã có cả ràng buộc lẫn cột và chẳng cần gỡ gì',
            ),
            B(
              'The migration will be retried automatically on the next deploy, because <code>applied_steps_count = 0</code> marks it as never started',
              'Migration sẽ tự động được thử lại ở lần deploy sau, vì <code>applied_steps_count = 0</code> đánh dấu rằng nó chưa từng bắt đầu',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured, and it is better news than it looks. PostgreSQL wraps each migration file in a transaction, so a failure at statement two takes statement one with it — the <code>note</code> column genuinely does not exist, and <code>applied_steps_count</code> is <code>0</code> rather than <code>1</code>. That number is the single most useful thing in the row precisely because it is honest about how far the work got; on a provider without transactional DDL (MySQL) it would be <code>1</code>, and there you really would have half a migration on disk. What is broken is the record: a row with <code>finished_at</code> and <code>rolled_back_at</code> both <code>NULL</code> is a FAILED migration, and every subsequent <code>migrate deploy</code> refuses with <code>P3009</code> until someone resolves it. The protocol is: stop, read <code>applied_steps_count</code> and <code>logs</code>, decide forward or back, do the cleanup by hand, and only then mark the row — because <code>migrate resolve</code> changes the record and nothing else.',
            'Đo thật, và nó là tin tốt hơn vẻ ngoài. PostgreSQL bọc mỗi tệp migration trong một giao dịch, nên một cú hỏng ở câu thứ hai kéo theo cả câu thứ nhất — cột <code>note</code> thật sự không tồn tại, và <code>applied_steps_count</code> là <code>0</code> chứ không phải <code>1</code>. Con số đó là thứ hữu ích nhất trong cả cái hàng, chính vì nó thành thật về việc công việc đã đi tới đâu; trên một nhà cung cấp không có DDL trong giao dịch (MySQL) nó sẽ là <code>1</code>, và ở đó bạn mới thật sự có nửa cái migration nằm lại. Thứ hỏng là phần GHI NHẬN: một hàng có cả <code>finished_at</code> lẫn <code>rolled_back_at</code> đều <code>NULL</code> là một migration HỎNG, và mọi lần <code>migrate deploy</code> sau đều từ chối với <code>P3009</code> cho tới khi có người xử lý. Quy trình là: dừng lại, đọc <code>applied_steps_count</code> và <code>logs</code>, quyết đi tới hay lùi lại, dọn dẹp bằng tay, rồi mới đánh dấu cái hàng — vì <code>migrate resolve</code> chỉ đổi phần ghi nhận chứ không đổi gì khác.',
          ),
        }),

        mcq({
          prompt: B(
            'Two <code>migrate resolve</code> forms are available after a failure. Which pair of descriptions is right?' + code(
              'npx prisma migrate resolve --rolled-back 20260823071500_them_rang_buoc\n' +
              'npx prisma migrate resolve --applied     0_init',
            ),
            'Sau một lần hỏng có hai dạng <code>migrate resolve</code>. Cặp mô tả nào ĐÚNG?' + code(
              'npx prisma migrate resolve --rolled-back 20260823071500_them_rang_buoc\n' +
              'npx prisma migrate resolve --applied     0_init',
            ),
          ),
          options: [
            B(
              '<code>--rolled-back</code> reverses every statement the migration applied; <code>--applied</code> re-runs the SQL and records it, which is how a baseline is created',
              '<code>--rolled-back</code> đảo ngược mọi câu lệnh migration đã áp; <code>--applied</code> chạy lại đoạn SQL rồi ghi nhận, và đó là cách tạo ra một bản nền',
            ),
            B(
              'Both restore the database from the most recent automatic snapshot; they differ only in whether the migration is retried afterwards',
              'Cả hai đều khôi phục cơ sở dữ liệu từ ảnh chụp tự động gần nhất; chúng chỉ khác nhau ở chỗ migration có được thử lại sau đó hay không',
            ),
            B(
              '<code>--rolled-back</code> only writes <code>rolled_back_at</code> so deploys can continue and the migration becomes pending again; <code>--applied</code> only writes <code>finished_at</code> WITHOUT running the SQL, which is exactly what baselining an existing database needs',
              '<code>--rolled-back</code> chỉ ghi <code>rolled_back_at</code> để deploy đi tiếp được và migration trở lại trạng thái chờ; <code>--applied</code> chỉ ghi <code>finished_at</code> mà KHÔNG chạy đoạn SQL, đúng thứ mà việc dựng nền cho một cơ sở dữ liệu có sẵn cần',
            ),
            B(
              '<code>--rolled-back</code> deletes the row entirely; <code>--applied</code> is only valid on a migration that has never been attempted, and errors otherwise',
              '<code>--rolled-back</code> xoá hẳn cái hàng đó; <code>--applied</code> chỉ hợp lệ với một migration chưa từng được thử, còn không thì báo lỗi',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Both forms change the RECORD and nothing else — that is the whole point and the whole danger. Marking a migration rolled back without actually undoing its applied statements tells the deploy system a comforting lie: deploys resume, the next migration computes its diff from a state that does not exist, and the corruption compounds. This is why the CuongThai repository forbids auto-resolving a failed migration and requires the exact error, the partial-application status and a proposed fix to be reported to a human first. <code>--applied</code>\'s harmless use is baselining: <code>db pull</code> an existing database, rename by hand, generate <code>0_init</code> with <code>migrate diff --from-empty</code>, then mark it applied — in EVERY environment, because miss one and the next deploy there tries to <code>CREATE TABLE</code> on tables that already exist.',
            'Cả hai dạng đều đổi phần GHI NHẬN chứ không đổi gì khác — đó vừa là toàn bộ ý nghĩa vừa là toàn bộ mối nguy. Đánh dấu một migration là đã cuộn lại mà thực tế không gỡ những câu lệnh nó đã áp là nói cho hệ thống deploy một lời nói dối dễ chịu: deploy chạy tiếp, migration kế tiếp tính hiệu số từ một trạng thái không tồn tại, và sự hỏng hóc chồng lên nhau. Đó là lý do kho CuongThai cấm tự động resolve một migration hỏng và bắt buộc phải báo cho người thật đúng thông báo lỗi, tình trạng áp dụng dở dang và một đề xuất sửa. Chỗ dùng vô hại của <code>--applied</code> là dựng nền: <code>db pull</code> một cơ sở dữ liệu có sẵn, đổi tên bằng tay, sinh <code>0_init</code> bằng <code>migrate diff --from-empty</code>, rồi đánh dấu đã áp — ở MỌI môi trường, vì sót một cái là lần deploy sau ở đó sẽ thử <code>CREATE TABLE</code> lên những bảng đã tồn tại.',
          ),
        }),

        mcq({
          prompt: B(
            'A column is being removed. Which plan is correct, and what does each statement cost?',
            'Một cột đang bị gỡ bỏ. Kế hoạch nào ĐÚNG, và mỗi câu lệnh tốn gì?',
          ),
          options: [
            B(
              'One deploy is enough as long as the migration runs BEFORE the new containers start — that ordering is exactly what the deploy pipeline guarantees',
              'Một lần deploy là đủ, miễn migration chạy TRƯỚC khi các container mới khởi động — thứ tự đó chính là điều đường ống deploy bảo đảm',
            ),
            B(
              'Three deploys: stop reading it, stop writing it, then drop it — and the <code>DROP COLUMN</code> is the dangerous statement because it rewrites the table',
              'Ba lần deploy: ngừng đọc nó, ngừng ghi nó, rồi mới xoá — và chính <code>DROP COLUMN</code> là câu lệnh nguy hiểm vì nó viết lại cả bảng',
            ),
            B(
              'Expand then contract, because old and new containers both serve traffic during a rolling deploy: ship the code that no longer reads or writes it, wait until nothing deployed refers to it, and drop it in a later release — <code>DROP COLUMN</code> itself is metadata-only and instant, and leaving days between the steps is what keeps a code-only rollback possible',
              'Nới rồi thu, vì cả container cũ lẫn mới đều đang phục vụ trong lúc cuốn chiếu: phát hành bản mã không còn đọc cũng không còn ghi nó, đợi tới khi không còn thứ nào đã triển khai nhắc tới nó, rồi mới xoá ở một lần phát hành sau — bản thân <code>DROP COLUMN</code> chỉ đụng siêu dữ liệu và tức thì, còn việc để cách nhau vài ngày mới là thứ giữ cho một lần lùi bản chỉ-bằng-mã vẫn khả thi',
            ),
            B(
              'Two deploys, and the second must run <code>VACUUM FULL</code>, because until it does the dropped column still occupies its bytes and any old container reading it gets stale data rather than an error',
              'Hai lần deploy, và lần thứ hai phải chạy <code>VACUUM FULL</code>, vì tới khi đó cột đã xoá vẫn chiếm chỗ và container cũ nào đọc nó sẽ nhận dữ liệu cũ chứ không phải một lỗi',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The window is the rolling deploy itself: between "migration applied" and "old containers stopped", requests are still being served by code that selects the column, and every one of them throws. On a two-minute rollout that is two minutes of 500s. Expand–contract removes the window by making the destructive step happen when nothing refers to the thing any more, and the same pattern covers renaming, tightening a constraint, adding <code>NOT NULL</code> and removing an enum value. On the cost side the intuition is often backwards: <code>DROP COLUMN</code>, <code>ADD COLUMN</code> nullable, <code>ADD COLUMN</code> with a constant default and <code>RENAME</code> are all metadata-only and take milliseconds at any size; the expensive ones are changing a column type, adding <code>NOT NULL</code> to an existing column, and <code>CREATE INDEX</code> without <code>CONCURRENTLY</code> — and a statement waiting for a lock blocks everything queued behind it, including reads that would have been fine.',
            'Cái khe nguy hiểm chính là lần cuốn chiếu: giữa "migration đã áp" và "container cũ đã dừng", vẫn có request được phục vụ bởi đoạn mã đang chọn cái cột ấy, và mỗi request như thế đều ném lỗi. Với một lần tung bản hai phút thì đó là hai phút toàn 500. Nới–thu xoá bỏ cái khe đó bằng cách để bước phá huỷ xảy ra khi chẳng còn gì nhắc tới thứ ấy nữa, và cùng khuôn đó áp cho đổi tên, siết một ràng buộc, thêm <code>NOT NULL</code> và gỡ một giá trị enum. Về phía chi phí thì trực giác thường ngược: <code>DROP COLUMN</code>, <code>ADD COLUMN</code> cho phép null, <code>ADD COLUMN</code> với mặc định hằng số và <code>RENAME</code> đều chỉ đụng siêu dữ liệu và mất vài mili giây với mọi cỡ bảng; những cái đắt là đổi kiểu cột, thêm <code>NOT NULL</code> vào một cột đã có, và <code>CREATE INDEX</code> không kèm <code>CONCURRENTLY</code> — và một câu lệnh đang chờ khoá thì chặn mọi thứ xếp hàng phía sau nó, kể cả những phép đọc vốn chẳng sao cả.',
          ),
        }),

        // ── Chương 7 — Giao dịch và tranh chấp ──────────────────────────
        mcq({
          prompt: B(
            'Four <code>$transaction</code> calls were logged on Prisma 6.19.3. The right-hand column is the exact list of statements each one sent:' + code(
              '$transaction([ count() ])                              -> ["SELECT"]\n' +
              '$transaction([ count(), count() ])                     -> ["BEGIN","SELECT","SELECT","COMMIT"]\n' +
              '$transaction([ updateMany(...) ])                      -> ["BEGIN","UPDATE","COMMIT"]\n' +
              '$transaction([ count() ], { isolationLevel: Serializable })\n' +
              '                                                       -> ["SELECT"]',
            ) + 'What follows?',
            'Bốn lời gọi <code>$transaction</code> được ghi log trên Prisma 6.19.3. Cột bên phải là danh sách chính xác các câu lệnh mỗi cái đã gửi đi:' + code(
              '$transaction([ count() ])                              -> ["SELECT"]\n' +
              '$transaction([ count(), count() ])                     -> ["BEGIN","SELECT","SELECT","COMMIT"]\n' +
              '$transaction([ updateMany(...) ])                      -> ["BEGIN","UPDATE","COMMIT"]\n' +
              '$transaction([ count() ], { isolationLevel: Serializable })\n' +
              '                                                       -> ["SELECT"]',
            ) + 'Kết luận là gì?',
          ),
          options: [
            B(
              'The logger omits <code>BEGIN</code> when a transaction contains a single statement; all four ran inside a real transaction at the level requested',
              'Bộ ghi log bỏ qua <code>BEGIN</code> khi một giao dịch chỉ chứa một câu lệnh; cả bốn đều chạy trong một giao dịch thật ở đúng mức đã xin',
            ),
            B(
              'Reads never open a transaction in Prisma; the second line shows <code>BEGIN</code> only because two statements need one connection',
              'Phép đọc không bao giờ mở giao dịch trong Prisma; dòng thứ hai có <code>BEGIN</code> chỉ vì hai câu lệnh cần chung một kết nối',
            ),
            B(
              'The array form never opens a transaction; the <code>BEGIN</code> on lines two and three comes from the individual write and count operations, each of which is its own implicit transaction',
              'Dạng mảng không bao giờ mở giao dịch; chữ <code>BEGIN</code> ở dòng hai và ba đến từ từng thao tác ghi và đếm riêng lẻ, mỗi cái là một giao dịch ngầm của chính nó',
            ),
            B(
              'A one-element array of a READ is not wrapped at all — and the fourth line is the one to remember: the <code>isolationLevel</code> you asked for was silently discarded, because there is no transaction to set it on',
              'Một mảng một phần tử là phép ĐỌC thì không được bọc gì cả — và dòng thứ tư mới là dòng đáng nhớ: cái <code>isolationLevel</code> bạn xin đã bị vứt đi trong im lặng, vì làm gì có giao dịch nào để đặt nó lên',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, all four. Two reads get <code>BEGIN</code>/<code>COMMIT</code>, and so does a single write — but a single read is sent bare, because one statement is already atomic and consistent with itself. That optimisation is harmless right up to the fourth line, where it quietly removes a guarantee you explicitly asked for: no transaction means no <code>SET TRANSACTION ISOLATION LEVEL</code>, so a snapshot you were relying on does not exist. It matters least for a lone <code>count</code> and most for the habit — never assume an option took effect because the call accepted it. The general rule holds: the array form gives all-or-nothing plus ONE consistent snapshot across the queries, which is why a six-number dashboard belongs in it; what it cannot do is use the result of query one to decide query two, and that is the only reason to reach for the interactive form.',
            'Đo cả bốn. Hai phép đọc thì có <code>BEGIN</code>/<code>COMMIT</code>, một phép ghi đơn lẻ cũng có — nhưng một phép ĐỌC đơn lẻ thì được gửi trần, vì một câu lệnh vốn đã nguyên tử và nhất quán với chính nó. Cái tối ưu ấy vô hại cho tới đúng dòng thứ tư, chỗ nó lặng lẽ gỡ mất một bảo đảm mà bạn đã xin tường minh: không có giao dịch thì không có <code>SET TRANSACTION ISOLATION LEVEL</code>, nên cái ảnh chụp bạn đang trông cậy không hề tồn tại. Chuyện đó ít quan trọng nhất với một lời <code>count</code> lẻ và quan trọng nhất ở chỗ thói quen — đừng bao giờ cho rằng một tuỳ chọn đã có hiệu lực chỉ vì lời gọi chấp nhận nó. Luật chung vẫn đúng: dạng mảng cho bạn được-ăn-cả-ngã-về-không cộng MỘT ảnh chụp nhất quán trải khắp các truy vấn, và đó là lý do một bảng điều khiển sáu con số thuộc về nó; thứ nó không làm được là dùng kết quả truy vấn một để quyết truy vấn hai, và đó là lý do duy nhất để với sang dạng tương tác.',
          ),
        }),

        mcq({
          prompt: B(
            'A Serializable transaction was set up and the log and the error were captured on Prisma 6.19.3:' + code(
              'prisma:query BEGIN\n' +
              'prisma:query SET TRANSACTION ISOLATION LEVEL SERIALIZABLE\n' +
              'prisma:query SELECT ...\n' +
              'prisma:query COMMIT',
            ) + code(
              '// three concurrent attempts to promote a third admin, limit 2\n' +
              "['P2034', 'ok', 'P2034']    -> admins = 1\n\n" +
              'PrismaClientKnownRequestError\n' +
              "  code: 'P2034'\n" +
              '  meta: {}',
            ) + 'Which two statements are supported by that evidence? (choose TWO)',
            'Một giao dịch Serializable được dựng lên, và log cùng lỗi được ghi lại trên Prisma 6.19.3:' + code(
              'prisma:query BEGIN\n' +
              'prisma:query SET TRANSACTION ISOLATION LEVEL SERIALIZABLE\n' +
              'prisma:query SELECT ...\n' +
              'prisma:query COMMIT',
            ) + code(
              '// ba lượt song song cùng muốn phong admin thứ ba, giới hạn là 2\n' +
              "['P2034', 'ok', 'P2034']    -> admins = 1\n\n" +
              'PrismaClientKnownRequestError\n' +
              "  code: 'P2034'\n" +
              '  meta: {}',
            ) + 'Hai phát biểu nào được chứng cứ đó chống lưng? (chọn HAI)',
          ),
          options: [
            B(
              'The isolation level is a SEPARATE statement after <code>BEGIN</code>, not part of it — so anything that skips the <code>BEGIN</code> also skips the level',
              'Mức cô lập là một câu lệnh RIÊNG đứng sau <code>BEGIN</code> chứ không nằm trong nó — nên thứ gì bỏ qua <code>BEGIN</code> thì cũng bỏ qua luôn mức cô lập',
            ),
            B(
              'Serializable does not make the conflicting transactions succeed — it aborts them with <code>P2034</code>, so the code MUST retry, and a serializable transaction without a bounded, jittered retry wrapper is not safer than the default, just differently broken',
              'Serializable không làm cho các giao dịch xung đột cùng thành công — nó huỷ chúng với <code>P2034</code>, nên mã BẮT BUỘC phải thử lại, và một giao dịch serializable mà không có lớp bọc thử-lại có giới hạn và có nhiễu ngẫu nhiên thì không an toàn hơn mặc định, chỉ là hỏng theo kiểu khác',
            ),
            B(
              'The <code>meta</code> object carries the PostgreSQL SQLSTATE, so a handler can branch on <code>40001</code> versus <code>40P01</code> to tell a serialization failure from a deadlock',
              'Đối tượng <code>meta</code> mang theo SQLSTATE của PostgreSQL, nên một handler có thể rẽ nhánh theo <code>40001</code> so với <code>40P01</code> để phân biệt lỗi tuần tự hoá với khoá chết',
            ),
            B(
              'Two of three aborting proves the isolation level was too strong for this workload; <code>RepeatableRead</code> would have preserved the rule with no failures',
              'Hai trên ba bị huỷ chứng tỏ mức cô lập quá mạnh với tải này; <code>RepeatableRead</code> hẳn đã giữ được luật mà không có cú hỏng nào',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'Two measured details and one myth. The level arrives as its own <code>SET TRANSACTION ISOLATION LEVEL</code> line rather than as <code>BEGIN ISOLATION LEVEL …</code> — worth knowing because it makes the previous question\'s failure mode concrete. And <code>meta</code> is EMPTY on 6.19.3: the SQLSTATE the lesson prints is not there, so a handler cannot distinguish a serialization failure from a deadlock by code alone. <code>P2034</code> covers both, and the correct response to both is the same anyway: retry with exponential backoff and jitter (without randomness two transactions that just conflicted retry at the same instant and conflict again), bound the attempts at about five, retry only conflict codes, and make sure the transaction is idempotent since it will run more than once. <code>RepeatableRead</code> would NOT have preserved the rule — write skew is exactly the phenomenon it still permits.',
            'Hai chi tiết đo được và một chuyện hoang đường. Mức cô lập tới dưới dạng một dòng <code>SET TRANSACTION ISOLATION LEVEL</code> riêng chứ không phải <code>BEGIN ISOLATION LEVEL …</code> — đáng biết vì nó làm cho kiểu hỏng ở câu trước trở nên cụ thể. Và <code>meta</code> RỖNG trên 6.19.3: cái SQLSTATE mà bài học in ra không có ở đó, nên một handler không phân biệt nổi lỗi tuần tự hoá với khoá chết chỉ bằng mã. <code>P2034</code> phủ cả hai, mà cách phản ứng đúng với cả hai vốn cũng như nhau: thử lại với lùi theo cấp số nhân và nhiễu ngẫu nhiên (thiếu phần ngẫu nhiên thì hai giao dịch vừa đụng nhau sẽ thử lại đúng cùng một khoảnh khắc rồi lại đụng nhau), giới hạn khoảng năm lần, chỉ thử lại với các mã xung đột, và bảo đảm giao dịch idempotent vì nó sẽ chạy nhiều hơn một lần. <code>RepeatableRead</code> thì KHÔNG giữ nổi cái luật ấy — lệch ghi đúng là hiện tượng mà nó vẫn cho lọt.',
          ),
        }),

        mcq({
          prompt: B(
            'An endpoint creates an order and then charges a payment gateway. It is written like this, and under ten concurrent orders on a pool of ten the log fills with <code>P2024</code>:' + code(
              'await prisma.$transaction(async (tx) => {\n' +
              '  const order = await tx.order.create({ data: { … } });\n' +
              "  const res = await fetch('https://gateway/charge', { … });   // ~2s\n" +
              '  await tx.order.update({ where: { id: order.id }, data: { txCode: res.id } });\n' +
              '});',
            ) + 'What is the fix, and what does it cost?',
            'Một endpoint tạo đơn hàng rồi gọi cổng thanh toán. Nó được viết thế này, và với mười đơn song song trên một pool mười kết nối thì log đầy <code>P2024</code>:' + code(
              'await prisma.$transaction(async (tx) => {\n' +
              '  const order = await tx.order.create({ data: { … } });\n' +
              "  const res = await fetch('https://gateway/charge', { … });   // ~2s\n" +
              '  await tx.order.update({ where: { id: order.id }, data: { txCode: res.id } });\n' +
              '});',
            ) + 'Cách vá là gì, và nó tốn gì?',
          ),
          options: [
            B(
              'Raise <code>timeout</code> and <code>maxWait</code> so the transaction has room for the gateway call; the cost is longer-held connections, which is acceptable because payments are rare',
              'Nâng <code>timeout</code> và <code>maxWait</code> để giao dịch có chỗ cho lời gọi cổng thanh toán; cái giá là kết nối bị giữ lâu hơn, chấp nhận được vì thanh toán vốn thưa',
            ),
            B(
              'Move the <code>fetch</code> out from between two short transactions: create the order as <code>CHO_THANH_TOAN</code>, charge with no connection held, then update. You lose atomicity, and you choose the recoverable failure — an unpaid order a scheduled job can clean up, rather than a charge with no record of it',
              'Đưa <code>fetch</code> ra ngoài, kẹp giữa hai giao dịch ngắn: tạo đơn ở trạng thái <code>CHO_THANH_TOAN</code>, gọi thanh toán khi không giữ kết nối nào, rồi mới cập nhật. Bạn mất tính nguyên tử, và bạn CHỌN lấy kiểu hỏng cứu được — một đơn chưa trả tiền mà một job định kỳ dọn được, thay vì một lần thu tiền không có dấu vết nào',
            ),
            B(
              'Increase <code>connection_limit</code> to match the concurrency; <code>P2024</code> is a pool-size problem and the transaction shape is fine',
              'Tăng <code>connection_limit</code> cho khớp mức song song; <code>P2024</code> là vấn đề kích thước pool và hình dạng giao dịch thì ổn',
            ),
            B(
              'Replace the interactive form with the array form, which sends all three operations together so the gateway call no longer sits between two queries',
              'Thay dạng tương tác bằng dạng mảng — nó gửi cả ba thao tác cùng lúc nên lời gọi cổng thanh toán không còn kẹt giữa hai truy vấn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A transaction holds one pool connection from <code>BEGIN</code> to <code>COMMIT</code>, including while your JavaScript is doing something that is not a query. Ten concurrent two-second gateway calls hold all ten connections, everything else queues, and <code>pool_timeout</code> fires — the error says the pool is exhausted and the cause is a design decision, not a size. Raising the pool moves the wall; raising the timeouts makes each request hold a connection for longer, which is the opposite of the fix. The rule is that a transaction should contain database work and nothing else: no HTTP, no file I/O, no <code>await</code> on anything you cannot see the SQL for. And notice which ordering was chosen: create-then-charge leaves an unpaid order, which is visible and cleanable; charge-then-create leaves money taken with no record if the process dies in between. When atomicity is impossible, "which inconsistency can I recover from" is the real design question. The array form does not help, because it cannot contain a <code>fetch</code> at all.',
            'Một giao dịch giữ một kết nối của pool từ <code>BEGIN</code> tới <code>COMMIT</code>, kể cả trong lúc JavaScript của bạn đang làm một việc không phải truy vấn. Mười lời gọi cổng thanh toán hai giây chạy song song giữ trọn mười kết nối, mọi thứ khác xếp hàng, và <code>pool_timeout</code> nổ — thông báo nói pool cạn, còn nguyên nhân là một quyết định thiết kế chứ không phải một con số. Tăng pool là dời bức tường đi; tăng timeout là để mỗi request giữ kết nối lâu hơn, tức ngược hẳn với cách vá. Luật là: một giao dịch chỉ nên chứa công việc cơ sở dữ liệu và không gì khác — không HTTP, không I/O tệp, không <code>await</code> lên bất cứ thứ gì bạn không nhìn thấy SQL của nó. Và để ý thứ tự đã chọn: tạo-rồi-thu để lại một đơn chưa trả tiền, thứ nhìn thấy được và dọn được; thu-rồi-tạo để lại tiền đã lấy mà không có dấu vết nếu tiến trình chết ở giữa. Khi tính nguyên tử là bất khả, "tôi cứu được kiểu bất nhất nào" mới là câu hỏi thiết kế thật. Dạng mảng không giúp được, vì nó không chứa nổi một lời <code>fetch</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Three timeouts govern a Prisma transaction. Which mapping is right?' + code(
              'DATABASE_URL="...?pool_timeout=10"\n' +
              'await prisma.$transaction(async (tx) => { … }, { maxWait: 2000, timeout: 5000 });',
            ),
            'Ba cái timeout chi phối một giao dịch Prisma. Ánh xạ nào ĐÚNG?' + code(
              'DATABASE_URL="...?pool_timeout=10"\n' +
              'await prisma.$transaction(async (tx) => { … }, { maxWait: 2000, timeout: 5000 });',
            ),
          ),
          options: [
            B(
              '<code>pool_timeout</code> is how long ANY query waits for a free connection and raises <code>P2024</code>; <code>maxWait</code> is how long THIS transaction waits before <code>BEGIN</code> and raises <code>P2028</code> with nothing rolled back because it never started; <code>timeout</code> is how long the callback may run after <code>BEGIN</code> and raises <code>P2028</code> with a rollback',
              '<code>pool_timeout</code> là thời gian MỌI truy vấn chờ một kết nối rảnh, hết giờ thì ném <code>P2024</code>; <code>maxWait</code> là thời gian CHÍNH giao dịch này chờ trước khi <code>BEGIN</code>, hết giờ thì ném <code>P2028</code> mà không cuộn lại gì vì nó chưa hề bắt đầu; <code>timeout</code> là thời gian callback được chạy sau <code>BEGIN</code>, hết giờ thì ném <code>P2028</code> kèm một lần cuộn lại',
            ),
            B(
              'All three raise <code>P2028</code> and differ only in the message they carry, so the shortest of the three is always the one that fires and the other two are effectively decoration; <code>P2024</code> is a separate, unrelated error meaning the database itself refused the connection',
              'Cả ba đều ném <code>P2028</code> và chỉ khác nhau ở câu chữ mang theo, nên cái ngắn nhất trong ba cái bao giờ cũng là cái nổ còn hai cái kia thực chất chỉ để trang trí; <code>P2024</code> là một lỗi riêng không liên quan, nghĩa là chính cơ sở dữ liệu đã từ chối kết nối',
            ),
            B(
              '<code>maxWait</code> bounds the whole transaction from <code>BEGIN</code> to <code>COMMIT</code> while <code>timeout</code> bounds each individual statement inside it, which is why <code>timeout</code> must always be set smaller than <code>maxWait</code> or the outer bound can never be reached',
              '<code>maxWait</code> giới hạn cả giao dịch từ <code>BEGIN</code> tới <code>COMMIT</code> còn <code>timeout</code> giới hạn từng câu lệnh bên trong, và đó là lý do <code>timeout</code> luôn phải đặt nhỏ hơn <code>maxWait</code>, không thì cái giới hạn ngoài chẳng bao giờ chạm tới được',
            ),
            B(
              '<code>pool_timeout</code> and <code>maxWait</code> are the same setting written two ways — one on the URL and one in code, with the URL winning — and <code>timeout</code> is simply Prisma\'s name for the PostgreSQL <code>statement_timeout</code> it sets on the session',
              '<code>pool_timeout</code> và <code>maxWait</code> là cùng một thiết lập viết theo hai cách — một trên URL và một trong mã, và URL thắng — còn <code>timeout</code> đơn giản là tên Prisma đặt cho <code>statement_timeout</code> của PostgreSQL mà nó gán lên phiên',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two different codes, and telling them apart tells you where to look. <code>P2024</code> means the pool had nothing free, which is almost always a transaction holding a connection while doing something that is not a query. <code>P2028</code> means a transaction deadline — and which of the two deadlines fired matters, because <code>maxWait</code> expiring means nothing ran at all, while <code>timeout</code> expiring means a rollback. There is a fourth, server-side: PostgreSQL <code>statement_timeout</code>, off by default and worth setting on the database user as the backstop that stops one runaway query from holding locks indefinitely. When a bulk import hits the 5-second <code>timeout</code>, the tempting fix is <code>timeout: 600000</code> — and it creates a ten-minute transaction holding a connection, accumulating locks, growing the WAL, blocking autovacuum, and discarding ten minutes of work if minute nine fails. Batch it instead: if raising a timeout would fix it, batching would fix it better.',
            'Hai mã lỗi khác nhau, và phân biệt được chúng là biết phải đi soi đâu. <code>P2024</code> nghĩa là pool không còn cái nào rảnh, mà chuyện đó hầu như luôn là một giao dịch đang giữ kết nối trong lúc làm một việc không phải truy vấn. <code>P2028</code> nghĩa là một hạn chót của giao dịch — và hạn nào trong hai hạn đã nổ thì có ý nghĩa, vì <code>maxWait</code> hết giờ nghĩa là chưa có gì chạy cả, còn <code>timeout</code> hết giờ nghĩa là đã có một lần cuộn lại. Còn cái thứ tư nằm ở phía máy chủ: <code>statement_timeout</code> của PostgreSQL, mặc định tắt và đáng đặt lên tài khoản cơ sở dữ liệu như một lưới chặn cuối, ngăn một truy vấn chạy loạn giữ khoá vô thời hạn. Khi một lượt nhập hàng loạt đụng cái <code>timeout</code> 5 giây, cách vá hấp dẫn là <code>timeout: 600000</code> — và nó đẻ ra một giao dịch mười phút giữ một kết nối, tích khoá, phình WAL, chặn autovacuum, rồi vứt bỏ mười phút công sức nếu phút thứ chín hỏng. Hãy chia lô thay vì thế: nếu nâng một timeout mà sửa được thì chia lô còn sửa tốt hơn.',
          ),
        }),

        mcq({
          prompt: B(
            'A document editor must not let one person silently overwrite another. Which implementation does that, and why does it need no lock?' + code(
              'model Document {\n' +
              '  id      Int    @id @default(autoincrement())\n' +
              '  body    String\n' +
              '  version Int    @default(0)\n' +
              '}',
            ),
            'Một trình soạn tài liệu không được để người này âm thầm ghi đè người kia. Cách cài đặt nào làm được, và vì sao nó không cần khoá nào?' + code(
              'model Document {\n' +
              '  id      Int    @id @default(autoincrement())\n' +
              '  body    String\n' +
              '  version Int    @default(0)\n' +
              '}',
            ),
          ),
          options: [
            B(
              'A <code>Serializable</code> transaction that reads the version, compares it and writes — the isolation level is what detects the collision, and the retry wrapper reports it to the user',
              'Một giao dịch <code>Serializable</code> đọc version ra, so sánh rồi ghi — chính mức cô lập phát hiện va chạm, còn lớp bọc thử-lại báo lại cho người dùng',
            ),
            B(
              '<code>updateMany({ where: { id, version: knownVersion }, data: { body, version: { increment: 1 } } })</code> and treat <code>count === 0</code> as the collision — the check and the write are one statement, so nothing can slip between them, and nobody waits while a human is typing',
              '<code>updateMany({ where: { id, version: knownVersion }, data: { body, version: { increment: 1 } } })</code> rồi coi <code>count === 0</code> là va chạm — phép kiểm và phép ghi là một câu lệnh nên không gì chen vào giữa được, và chẳng ai phải chờ trong lúc một con người đang gõ',
            ),
            B(
              'A <code>SELECT … FOR UPDATE</code> taken when the editor is opened and released on save, so the second person is told the document is locked before they waste any effort',
              'Một lệnh <code>SELECT … FOR UPDATE</code> lấy lúc mở trình soạn và nhả lúc lưu, để người thứ hai được báo là tài liệu đang bị khoá trước khi họ phí công',
            ),
            B(
              '<code>update({ where: { id }, data: { body, version: { increment: 1 } } })</code> — the atomic <code>increment</code> is what makes concurrent saves safe, and <code>P2025</code> signals the collision',
              '<code>update({ where: { id }, data: { body, version: { increment: 1 } } })</code> — chính toán tử nguyên tử <code>increment</code> làm cho các lần lưu song song an toàn, và <code>P2025</code> báo hiệu va chạm',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is optimistic concurrency, and the shape is the same guarded-transition trick as everywhere else: put the precondition in the <code>where</code> so the check and the write cannot be separated. Both users edit freely for as long as they like; the collision is DETECTED at save time rather than PREVENTED at read time, which is the only workable model when editing lasts minutes. <code>count === 0</code> means someone else wrote first, and the loser is told rather than silently overwritten — that last part is the entire value, because without it B\'s save destroys A\'s work and nobody finds out until a paragraph is missing. A pessimistic lock held across a human editing session is the wrong tool: it blocks the second person for as long as the first one leaves the tab open. And option four is the trap — <code>increment</code> is atomic and still overwrites <code>body</code> unconditionally, because nothing in that <code>where</code> mentions what the writer last saw. The same pattern works without an extra column by matching on <code>updatedAt</code>.',
            'Đây là điều khiển đồng thời lạc quan, và hình dạng của nó vẫn là mẹo chuyển-trạng-thái-có-canh-gác quen thuộc: đặt điều kiện tiên quyết vào <code>where</code> để phép kiểm và phép ghi không tách rời được. Cả hai người tha hồ sửa bao lâu tuỳ ý; va chạm được PHÁT HIỆN lúc lưu chứ không phải NGĂN CHẶN lúc đọc — và đó là mô hình duy nhất chạy được khi việc soạn thảo kéo dài hàng phút. <code>count === 0</code> nghĩa là người khác đã ghi trước, và kẻ thua được BÁO cho biết thay vì bị ghi đè im lặng — chính cái vế cuối ấy mới là toàn bộ giá trị, vì thiếu nó thì cú lưu của B xoá sạch công của A và chẳng ai hay cho tới khi thiếu mất một đoạn. Một khoá bi quan giữ suốt một phiên soạn thảo của con người là công cụ sai: nó chặn người thứ hai đúng bằng khoảng thời gian người thứ nhất để mở cái tab. Còn lựa chọn thứ tư là cái bẫy — <code>increment</code> nguyên tử thật nhưng vẫn ghi đè <code>body</code> vô điều kiện, vì chẳng có gì trong cái <code>where</code> ấy nhắc tới thứ người ghi nhìn thấy lần cuối. Cùng khuôn đó chạy được mà không cần cột phụ, bằng cách khớp theo <code>updatedAt</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A withdrawal endpoint is wrapped in a bounded retry. Why is that still not safe, and what closes the gap?' + code(
              'await retry(() => prisma.$transaction(async (tx) => {\n' +
              '  await tx.account.update({ where: { id: 1 }, data: { balance: { decrement: 100 } } });\n' +
              '  await tx.transaction.create({ data: { accountId: 1, amount: 100 } });\n' +
              '}));',
            ),
            'Một endpoint rút tiền được bọc trong một vòng thử lại có giới hạn. Vì sao nó vẫn chưa an toàn, và cái gì bịt được lỗ hổng?' + code(
              'await retry(() => prisma.$transaction(async (tx) => {\n' +
              '  await tx.account.update({ where: { id: 1 }, data: { balance: { decrement: 100 } } });\n' +
              '  await tx.transaction.create({ data: { accountId: 1, amount: 100 } });\n' +
              '}));',
            ),
          ),
          options: [
            B(
              'Because <code>decrement</code> is not atomic across two statements; wrapping both in an interactive transaction at <code>Serializable</code> makes the pair safe and no key is needed',
              'Vì <code>decrement</code> không nguyên tử khi trải qua hai câu lệnh; bọc cả hai trong một giao dịch tương tác ở mức <code>Serializable</code> là cặp ấy an toàn và không cần khoá nào',
            ),
            B(
              'The retry wrapper cannot see <code>P2034</code>, so it never fires; the gap closes once the wrapper also catches that code',
              'Lớp bọc thử lại không thấy được <code>P2034</code> nên nó chẳng bao giờ chạy; lỗ hổng đóng lại khi lớp bọc bắt luôn cả mã đó',
            ),
            B(
              'It is already safe — a committed transaction cannot be repeated, because Prisma tracks the transaction id and refuses a duplicate submission',
              'Nó đã an toàn rồi — một giao dịch đã commit thì không lặp lại được, vì Prisma theo dõi id giao dịch và từ chối một lần gửi trùng',
            ),
            B(
              'The transaction can COMMIT and the acknowledgement be lost on the way back, so the caller sees a failure and retries — debiting twice. Add a caller-generated idempotency key on a <code>@unique</code> column: insert it inside the transaction, and on <code>P2002</code> return the existing record instead of repeating the work',
              'Giao dịch có thể COMMIT xong rồi lời xác nhận mất trên đường về, thế là bên gọi thấy hỏng và thử lại — trừ tiền hai lần. Hãy thêm một khoá idempotent DO BÊN GỌI sinh ra, đặt trên một cột <code>@unique</code>: chèn nó bên trong giao dịch, và khi gặp <code>P2002</code> thì trả về bản ghi đã có thay vì làm lại từ đầu',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A transaction guarantees atomicity AT THE DATABASE and says nothing about whether the caller found out. A dropped connection after <code>COMMIT</code> is ordinary network behaviour, and any operation a retry might re-run needs a way to recognise that it already happened. The three details that make an idempotency key work: the key comes from the CALLER, generated once before the first attempt and reused for every retry (a server-generated key would differ each time and defeat the whole mechanism); the enforcement is a <code>@unique</code> column rather than a <code>findUnique</code> before the insert, because the check-then-insert version races; and the duplicate branch RETURNS the original record rather than an error, since the caller asked for the operation to happen and it happened. Add a scheduled cleanup — keys are only useful for the retry window, hours rather than years. The related pattern for effects that must follow a commit is the outbox: record the intent in the same transaction and act on it from a worker, trading exactly-once for at-least-once.',
            'Một giao dịch bảo đảm tính nguyên tử Ở PHÍA CƠ SỞ DỮ LIỆU và không nói gì về việc bên gọi có biết hay không. Một kết nối rớt sau <code>COMMIT</code> là hành vi mạng bình thường, và mọi thao tác mà một lần thử lại có thể chạy lại đều cần một cách nhận ra rằng nó đã xảy ra rồi. Ba chi tiết làm cho một khoá idempotent hoạt động: khoá đến từ BÊN GỌI, sinh một lần trước lần thử đầu tiên và dùng lại cho mọi lần thử lại (một khoá do máy chủ sinh sẽ khác nhau mỗi lần và phá tan cả cơ chế); phần ép buộc là một cột <code>@unique</code> chứ không phải một lời <code>findUnique</code> đứng trước phép chèn, vì bản kiểm-rồi-chèn có đua; và nhánh trùng thì TRẢ VỀ bản ghi gốc chứ không phải một lỗi, bởi bên gọi xin cho thao tác ấy xảy ra và nó đã xảy ra. Nhớ thêm một job dọn định kỳ — khoá chỉ hữu ích trong cửa sổ thử lại, tính bằng giờ chứ không phải bằng năm. Khuôn họ hàng cho những tác động phải xảy ra SAU khi commit là outbox: ghi ý định trong cùng giao dịch rồi để một worker thực thi, đổi "đúng một lần" lấy "ít nhất một lần".',
          ),
        }),

        mcq({
          prompt: B(
            'Two transfers run at the same moment and one dies with <code>P2034</code>, <code>meta.code 40P01 deadlock detected</code> in the PostgreSQL log:' + code(
              'transfer(1, 2, 100)   // locks account 1, then account 2\n' +
              'transfer(2, 1,  50)   // locks account 2, then account 1',
            ) + 'What is the fix, and how should you think about the failure?',
            'Hai lệnh chuyển tiền chạy cùng lúc và một cái chết với <code>P2034</code>, log PostgreSQL ghi <code>40P01 deadlock detected</code>:' + code(
              'transfer(1, 2, 100)   // khoá tài khoản 1, rồi tài khoản 2\n' +
              'transfer(2, 1,  50)   // khoá tài khoản 2, rồi tài khoản 1',
            ) + 'Cách vá là gì, và nên nghĩ về cú hỏng này thế nào?',
          ),
          options: [
            B(
              'Raise the transaction <code>timeout</code>: both are waiting, and given enough time PostgreSQL lets the earlier one finish and the later one proceed',
              'Nâng <code>timeout</code> của giao dịch lên: cả hai đang chờ, và cho đủ thời gian thì PostgreSQL để cái tới trước xong rồi cái sau đi tiếp',
            ),
            B(
              'Remove the explicit locks — deadlocks only occur with <code>FOR UPDATE</code>, and the atomic <code>decrement</code>/<code>increment</code> pair is already safe without them',
              'Bỏ các khoá tường minh đi — khoá chết chỉ xảy ra với <code>FOR UPDATE</code>, còn cặp <code>decrement</code>/<code>increment</code> nguyên tử vốn đã an toàn mà không cần chúng',
            ),
            B(
              'Acquire the locks in a deterministic order — sort the two ids ascending before locking anything — and treat the deadlock as a design smell rather than bad luck: it means two code paths take the same locks in different orders, so it will keep happening. Keep the retry wrapper anyway, for the path nobody has written yet',
              'Lấy khoá theo một thứ tự xác định — sắp hai id tăng dần TRƯỚC khi khoá bất cứ thứ gì — và coi khoá chết là một mùi thiết kế chứ không phải xui: nó nghĩa là hai nhánh mã lấy cùng bộ khoá theo hai thứ tự khác nhau, nên nó sẽ còn tái diễn. Vẫn giữ lớp bọc thử lại, cho cái nhánh chưa ai viết',
            ),
            B(
              'Switch to <code>Serializable</code>, which detects the dependency cycle before either transaction blocks and therefore prevents deadlocks entirely',
              'Chuyển sang <code>Serializable</code> — nó phát hiện vòng phụ thuộc trước khi giao dịch nào bị chặn nên loại bỏ hẳn khoá chết',
            ),
          ],
          correct: 2,
          explanation: EX(
            'PostgreSQL detects the cycle in about a second and kills one transaction, so a deadlock is survivable — which is exactly why it gets treated as noise and retried forever instead of fixed. Sorting the ids before acquiring any lock costs nothing and removes the entire class: <code>const [a, b] = [from, to].sort((x, y) =&gt; x - y)</code>, then one <code>SELECT id FROM … WHERE id IN (a, b) ORDER BY id FOR UPDATE</code>. Apply the same rule to tables, not just rows. Note that <code>Serializable</code> does not prevent deadlocks — it adds a second reason to abort, and both arrive as <code>P2034</code>. And the test that proves a transfer implementation is right is not a unit test of one transfer: run two hundred concurrent ones between twenty accounts and check that the sum of all balances is unchanged. Conservation is the only invariant that fails on the naive code.',
            'PostgreSQL phát hiện vòng lặp trong khoảng một giây rồi giết một giao dịch, nên khoá chết là thứ sống sót được — và chính vì thế nó hay bị coi là nhiễu rồi thử lại mãi thay vì được sửa. Sắp hai id trước khi lấy bất cứ khoá nào chẳng tốn gì và xoá sạch cả lớp lỗi ấy: <code>const [a, b] = [from, to].sort((x, y) =&gt; x - y)</code>, rồi một câu <code>SELECT id FROM … WHERE id IN (a, b) ORDER BY id FOR UPDATE</code>. Áp cùng luật ấy cho bảng chứ không chỉ cho hàng. Để ý rằng <code>Serializable</code> KHÔNG ngăn được khoá chết — nó thêm một lý do thứ hai để huỷ, và cả hai đều về dưới dạng <code>P2034</code>. Và phép thử chứng minh một cài đặt chuyển tiền là đúng không phải một unit test cho một lần chuyển: hãy chạy hai trăm lần chuyển song song giữa hai mươi tài khoản rồi kiểm rằng tổng mọi số dư không đổi. Bảo toàn là bất biến duy nhất mà bản ngây thơ trượt.',
          ),
        }),

        mcq({
          prompt: B(
            'Ten worker processes drain a job table. The naive version has every worker pick the same row. Which change fixes it, and what is still missing afterwards?',
            'Mười tiến trình worker cùng rút việc từ một bảng job. Bản ngây thơ khiến mọi worker chọn trúng cùng một hàng. Thay đổi nào vá được, và sau đó vẫn còn thiếu gì?',
          ),
          options: [
            B(
              '<code>SELECT … FOR UPDATE SKIP LOCKED LIMIT 1</code> inside a transaction — locked rows are skipped rather than waited on, so each worker gets a different job with no coordination; what is still missing is a reclaim query for jobs whose worker died, bounded by an <code>attempts</code> counter so a poisoned job is not retried forever',
              '<code>SELECT … FOR UPDATE SKIP LOCKED LIMIT 1</code> bên trong một giao dịch — hàng đang bị khoá thì được BỎ QUA chứ không phải chờ, nên mỗi worker nhận một việc khác nhau mà chẳng cần phối hợp gì; thứ vẫn còn thiếu là một truy vấn thu hồi những việc có worker đã chết, kèm một bộ đếm <code>attempts</code> để một việc độc hại không bị thử lại mãi mãi',
            ),
            B(
              '<code>SELECT … FOR UPDATE NOWAIT</code>, which fails fast on a locked row so the worker can immediately try the next one; nothing else is needed because a dead worker releases its lock',
              '<code>SELECT … FOR UPDATE NOWAIT</code> — nó hỏng ngay khi gặp hàng bị khoá để worker thử ngay hàng kế; không cần gì thêm vì worker chết thì tự nhả khoá',
            ),
            B(
              'A <code>Serializable</code> transaction around the pick-and-mark pair, which makes nine of the ten abort with <code>P2034</code> and retry onto the next row',
              'Một giao dịch <code>Serializable</code> bọc quanh cặp chọn-và-đánh-dấu, khiến chín trong mười cái huỷ với <code>P2034</code> rồi thử lại sang hàng kế',
            ),
            B(
              '<code>pg_try_advisory_lock(jobId)</code> per row, which is cheaper than a row lock and releases automatically when the transaction commits',
              '<code>pg_try_advisory_lock(jobId)</code> cho từng hàng — rẻ hơn khoá hàng và tự nhả khi giao dịch commit',
            ),
          ],
          correct: 0,
          explanation: EX(
            '<code>SKIP LOCKED</code> is four words and it is the standard PostgreSQL job queue: the database hands each worker the first row nobody else has locked, with no Redis and no broker. Measured with three workers over two jobs, the answers were two distinct ids and one <code>null</code> — exactly right. The half people forget is recovery: <code>SKIP LOCKED</code> hands jobs out correctly and nothing hands them back when the process holding one is killed, so a timed <code>updateMany</code> that returns rows stuck in <code>DANG_CHAY</code> past a deadline is what turns a working queue into a reliable one, and the <code>attempts &lt; 3</code> bound is what stops a job that crashes its worker from doing it forever. <code>NOWAIT</code> raises an error instead of skipping, which makes the worker loop noisy rather than useful. And advisory locks solve a different problem — protecting a PROCESS rather than a row, like "only one instance may run this import" — where the session form is tied to a connection the pool may not hand you back, so prefer the <code>_xact_</code> variant.',
            '<code>SKIP LOCKED</code> gọn trong bốn chữ và nó là hàng đợi việc chuẩn của PostgreSQL: cơ sở dữ liệu đưa cho mỗi worker hàng đầu tiên chưa ai khoá, không cần Redis, không cần broker. Đo với ba worker trên hai việc, kết quả là hai id khác nhau và một <code>null</code> — đúng y như vậy. Cái nửa người ta hay quên là phần phục hồi: <code>SKIP LOCKED</code> phát việc ra đúng nhưng chẳng có gì nhận việc về khi tiến trình đang giữ nó bị giết, nên một lời <code>updateMany</code> chạy theo giờ để trả những việc kẹt ở <code>DANG_CHAY</code> quá hạn về hàng chờ mới là thứ biến một hàng đợi chạy được thành một hàng đợi tin được, còn cái chốt <code>attempts &lt; 3</code> mới là thứ ngăn một việc chuyên làm sập worker lặp lại mãi mãi. <code>NOWAIT</code> ném lỗi thay vì bỏ qua, khiến vòng lặp worker ồn ào chứ không hữu ích. Còn advisory lock giải một bài toán khác — bảo vệ một TIẾN TRÌNH chứ không phải một hàng, kiểu "chỉ một bản được chạy lượt nhập này" — nơi dạng theo phiên bị buộc vào một kết nối mà pool có thể không trả lại cho bạn, nên hãy ưu tiên biến thể <code>_xact_</code>.',
          ),
        }),

        // ── Chương 8 — Hệ kiểu ──────────────────────────────────────────
        mcq({
          prompt: B(
            'A multi-tenant application scopes every query with a <code>query</code> extension. This was measured on Prisma 6.19.3, where the hook logs its own line before calling <code>query(args)</code>:' + code(
              'await p.user.findMany();               -> [hook] User.findMany\n' +
              '                                          SELECT "id","email",... FROM "public"."User" ...\n\n' +
              'await p.$queryRawUnsafe(\'SELECT id FROM "User"\');\n' +
              '                                       -> SELECT id FROM "User"       (no [hook] line)',
            ) + 'What does that mean for the tenant filter?',
            'Một ứng dụng đa khách thuê giới hạn mọi truy vấn bằng một extension <code>query</code>. Đo trên Prisma 6.19.3, trong đó hook tự ghi một dòng của nó trước khi gọi <code>query(args)</code>:' + code(
              'await p.user.findMany();               -> [hook] User.findMany\n' +
              '                                          SELECT "id","email",... FROM "public"."User" ...\n\n' +
              'await p.$queryRawUnsafe(\'SELECT id FROM "User"\');\n' +
              '                                       -> SELECT id FROM "User"       (không có dòng [hook])',
            ) + 'Điều đó có nghĩa gì với bộ lọc theo khách thuê?',
          ),
          options: [
            B(
              'Raw queries are intercepted too; the missing hook line only means the logger prints them from a different code path, so the filter did apply',
              'Truy vấn thô cũng bị chặn; việc thiếu dòng hook chỉ nghĩa là bộ ghi log in chúng từ một nhánh mã khác, nên bộ lọc vẫn đã được áp',
            ),
            B(
              'Only read operations are interceptable, so the fix is to move the tenant column into <code>data</code> with a <code>result</code> extension instead of a <code>query</code> one',
              'Chỉ các thao tác đọc mới chặn được, nên cách vá là chuyển cột khách thuê vào <code>data</code> bằng một extension <code>result</code> thay vì <code>query</code>',
            ),
            B(
              'The gap closes by registering the extension with <code>$use</code> as well, since the deprecated middleware chain does see raw queries',
              'Lỗ hổng đóng lại nếu đăng ký extension bằng cả <code>$use</code>, vì chuỗi middleware đã bị khai tử ấy có thấy truy vấn thô',
            ),
            B(
              'The extension is a safety net, not a security boundary: <code>$queryRaw</code> and <code>$executeRaw</code> bypass the query component entirely, so real isolation needs row-level security, a schema per tenant or a database per tenant',
              'Extension là một tấm lưới đỡ chứ không phải một ranh giới bảo mật: <code>$queryRaw</code> và <code>$executeRaw</code> đi vòng hoàn toàn qua thành phần query, nên muốn cô lập thật thì cần row-level security, một schema cho mỗi khách thuê, hoặc một database cho mỗi khách thuê',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: the hook fires for <code>findMany</code> and never for the raw call. That is the honest boundary of the mechanism, and it generalises — every invariant a <code>query</code> extension enforces (tenant scoping, soft-delete filtering, normalising an email to lowercase) has to be repeated by hand in every raw query, and none of them cover a helper that captured the un-extended client. Two more limits worth holding: an extension cannot add a field to the database, and a <code>result</code> computed field cannot be filtered on — measured, <code>where: { display: … }</code> fails with <code>PrismaClientValidationError: Unknown argument \'display\'</code>, because the value is computed in JavaScript after the rows arrive. What extensions ARE excellent at is making the ordinary path safe by default: the filter is in one place, and a new endpoint written by someone who has never heard of the convention gets it anyway.',
            'Đo thật: hook chạy với <code>findMany</code> và không bao giờ chạy với lời gọi thô. Đó là ranh giới thành thật của cơ chế, và nó khái quát được — mọi bất biến mà một extension <code>query</code> ép buộc (giới hạn theo khách thuê, lọc xoá mềm, chuẩn hoá email về chữ thường) đều phải viết lại bằng tay trong từng truy vấn thô, và không cái nào phủ được một hàm trợ giúp đã bắt lấy client chưa mở rộng. Hai giới hạn nữa nên nhớ kèm: extension không thêm được một trường vào cơ sở dữ liệu, và một trường tính sẵn của <code>result</code> thì không lọc theo được — đo thật, <code>where: { display: … }</code> chết với <code>PrismaClientValidationError: Unknown argument \'display\'</code>, vì giá trị ấy được tính bằng JavaScript sau khi các hàng đã về. Thứ extension LÀM RẤT TỐT là biến con đường thông thường thành an toàn theo mặc định: bộ lọc nằm ở một chỗ, và một endpoint mới do người chưa từng nghe tới quy ước ấy viết ra vẫn được hưởng.',
          ),
        }),

        mcq({
          prompt: B(
            'An Express error handler must map Prisma failures to statuses. Which mapping is right?',
            'Một error handler của Express phải ánh xạ các cú hỏng của Prisma sang mã trạng thái. Ánh xạ nào ĐÚNG?',
          ),
          options: [
            B(
              'Catch every error the same way and read <code>e.code</code>: <code>P2002</code> → 409, <code>P2025</code> → 404, and any error with no <code>code</code> → 500, which covers all four Prisma error classes with one branch',
              'Bắt mọi lỗi như nhau rồi đọc <code>e.code</code>: <code>P2002</code> → 409, <code>P2025</code> → 404, và lỗi nào không có <code>code</code> → 500 — một nhánh phủ hết cả bốn lớp lỗi của Prisma',
            ),
            B(
              '<code>PrismaClientValidationError</code> is the user-input class and maps to 400; <code>PrismaClientKnownRequestError</code> is internal and always maps to 500',
              '<code>PrismaClientValidationError</code> là lớp của dữ liệu người dùng nhập và ánh xạ sang 400; <code>PrismaClientKnownRequestError</code> là lỗi nội bộ và luôn ánh xạ sang 500',
            ),
            B(
              '<code>PrismaClientKnownRequestError</code> carries <code>code</code> and <code>meta</code> and is the one to branch on (<code>P2002</code> → 409 with <code>meta.target</code> naming the field, <code>P2003</code> → 400, <code>P2025</code> → 404); <code>PrismaClientValidationError</code> means malformed ARGUMENTS, which is a bug in your code and therefore a 500, not a 400',
              '<code>PrismaClientKnownRequestError</code> mang theo <code>code</code> và <code>meta</code> và là lớp đáng rẽ nhánh (<code>P2002</code> → 409 kèm <code>meta.target</code> gọi tên đúng trường, <code>P2003</code> → 400, <code>P2025</code> → 404); còn <code>PrismaClientValidationError</code> nghĩa là THAM SỐ sai cấu trúc, tức một lỗi trong mã của bạn nên là 500 chứ không phải 400',
            ),
            B(
              '<code>PrismaClientInitializationError</code> should be caught per request and retried, since it means the pool briefly had no connection; only <code>PrismaClientRustPanicError</code> justifies a 500',
              '<code>PrismaClientInitializationError</code> nên được bắt ở từng request rồi thử lại, vì nó nghĩa là pool tạm thời hết kết nối; chỉ <code>PrismaClientRustPanicError</code> mới xứng đáng một mã 500',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Four classes, four meanings. <code>KnownRequestError</code> is "the database said no, with a code" — that is where <code>P2002</code>, <code>P2003</code>, <code>P2025</code>, <code>P2024</code>, <code>P2028</code> and <code>P2034</code> live, and <code>meta</code> is what lets you point the user at the right form field instead of showing "something went wrong". <code>ValidationError</code> is "your query object was malformed" — a field that does not exist, <code>select</code> and <code>include</code> at the same level, an enum value that is not in the union — and no user should be able to cause it, so 500 is honest. <code>InitializationError</code> is fatal at boot: bad URL, unreachable database, an engine built for another platform. <code>RustPanicError</code> means the engine crashed and the client must be restarted. And the trap in option one: without <code>instanceof</code>, TypeScript will not let you read <code>.code</code>, so people write <code>(e as any).code</code> — and then an unrelated Node <code>ENOENT</code> or an Axios error with its own <code>code</code> matches the branch and returns 409 to a very confused user.',
            'Bốn lớp, bốn ý nghĩa. <code>KnownRequestError</code> là "cơ sở dữ liệu nói không, kèm một mã" — đó là chỗ trú của <code>P2002</code>, <code>P2003</code>, <code>P2025</code>, <code>P2024</code>, <code>P2028</code> và <code>P2034</code>, còn <code>meta</code> là thứ cho phép bạn chỉ đúng ô nhập cho người dùng thay vì hiện "đã có lỗi xảy ra". <code>ValidationError</code> là "đối tượng truy vấn của bạn sai cấu trúc" — một trường không tồn tại, <code>select</code> và <code>include</code> ở cùng một tầng, một giá trị enum không nằm trong union — và không người dùng nào được phép gây ra nó, nên 500 mới là thành thật. <code>InitializationError</code> là chí tử ngay lúc khởi động: URL sai, không với tới cơ sở dữ liệu, một engine dựng cho nền tảng khác. <code>RustPanicError</code> nghĩa là engine sập và client phải khởi động lại. Còn cái bẫy ở lựa chọn một: không có <code>instanceof</code> thì TypeScript không cho bạn đọc <code>.code</code>, thế là người ta viết <code>(e as any).code</code> — rồi một lỗi <code>ENOENT</code> của Node hay một lỗi Axios có <code>code</code> riêng của nó lọt trúng nhánh ấy và trả 409 cho một người dùng cực kỳ hoang mang.',
          ),
        }),

        mcq({
          prompt: B(
            'A codebase has these five declarations. Which one is the mistake, and what is the test that finds them all?' + code(
              "1  interface User { id: number; email: string; fullName: string | null }\n" +
              "2  type Role = 'USER' | 'ADMIN'\n" +
              '3  async function findPost(where: Prisma.PostWhereInput) { … }\n' +
              '4  const CreateUserBody = z.object({ email: z.string().email(), password: z.string().min(8) })\n' +
              '5  type DbClient = Omit&lt;PrismaClient, \'$connect\' | \'$disconnect\' | \'$transaction\' | \'$extends\'&gt;',
            ),
            'Một kho mã có năm khai báo sau. Cái nào là sai lầm, và phép thử nào tìm ra hết chúng?' + code(
              "1  interface User { id: number; email: string; fullName: string | null }\n" +
              "2  type Role = 'USER' | 'ADMIN'\n" +
              '3  async function findPost(where: Prisma.PostWhereInput) { … }\n' +
              '4  const CreateUserBody = z.object({ email: z.string().email(), password: z.string().min(8) })\n' +
              '5  type DbClient = Omit&lt;PrismaClient, \'$connect\' | \'$disconnect\' | \'$transaction\' | \'$extends\'&gt;',
            ),
          ),
          options: [
            B(
              'Only 4 — a Zod schema duplicates the model, and the request body should be typed as <code>Prisma.UserCreateInput</code> so the two cannot drift',
              'Chỉ có 4 — một lược đồ Zod là bản trùng lặp của model, và thân request nên được khai kiểu <code>Prisma.UserCreateInput</code> để hai bên không thể trôi dạt',
            ),
            B(
              'Only 5 — <code>Omit</code> on the client type is fragile across versions, and a helper should take the full <code>PrismaClient</code> and be called with the outer client',
              'Chỉ có 5 — dùng <code>Omit</code> trên kiểu client thì mong manh qua các phiên bản, và một hàm trợ giúp nên nhận trọn <code>PrismaClient</code> rồi được gọi với client bên ngoài',
            ),
            B(
              '1 and 2 — both are hand-copies of types the generator already writes, and the test is to rename a column or an enum value and rebuild: everything that reads it should turn red, and anything that still compiles is using a hand-written type',
              '1 và 2 — cả hai đều là bản chép tay của những kiểu mà bộ sinh mã đã viết sẵn, và phép thử là đổi tên một cột hay một giá trị enum rồi build lại: mọi chỗ đọc nó đều phải đỏ lên, còn thứ gì vẫn biên dịch được thì đang dùng một kiểu viết tay',
            ),
            B(
              '3 and 5 — importing generated <code>Args</code> types couples your service layer to Prisma, and both should take a plain object the service maps itself',
              '3 và 5 — nhập các kiểu <code>Args</code> sinh sẵn là buộc tầng service vào Prisma, và cả hai nên nhận một object thuần rồi để service tự ánh xạ',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The golden rule is one sentence: never hand-write a type the generator already produces. Declaration 1 is the interface that lives in <code>types/</code> in every codebase and that nobody updates when a column becomes nullable — <code>import type { User } from \'@prisma/client\'</code> instead. Declaration 2 is worse, because an enum union is both a type and a set of runtime values, and a hand-copy is internally consistent so nothing can flag the disagreement with the schema. Three and five are correct uses: <code>Prisma.PostWhereInput</code> gives a caller-supplied filter full autocomplete and full checking where the alternative is <code>any</code>, and the <code>DbClient</code> alias is what lets a helper accept either the client or a transaction client — put it in a shared file on day one, because writing the <code>Omit</code> at each call site is how people end up typing the parameter as <code>any</code> and reintroducing the escaped-transaction bug. Four is correct too: an API contract is a genuinely separate thing from a database row and needs runtime validation anyway.',
            'Luật vàng gói trong một câu: đừng bao giờ viết tay một kiểu mà bộ sinh mã đã tạo ra. Khai báo 1 chính là cái interface nằm trong <code>types/</code> ở mọi kho mã và chẳng ai cập nhật khi một cột trở thành cho phép null — hãy <code>import type { User } from \'@prisma/client\'</code> thay vào đó. Khai báo 2 còn tệ hơn, vì một union enum vừa là kiểu vừa là một tập giá trị lúc chạy, và một bản chép tay thì tự nhất quán với chính nó nên chẳng gì đánh dấu được chỗ nó bất đồng với lược đồ. Ba và năm là những cách dùng ĐÚNG: <code>Prisma.PostWhereInput</code> cho một bộ lọc do bên gọi truyền vào đủ gợi ý và đủ kiểm tra, trong khi lựa chọn thay thế là <code>any</code>; còn bí danh <code>DbClient</code> là thứ cho phép một hàm trợ giúp nhận hoặc client hoặc client giao dịch — hãy đặt nó vào một tệp dùng chung ngay ngày đầu, vì viết cái <code>Omit</code> ở từng chỗ gọi chính là cách người ta đi tới việc khai tham số là <code>any</code> rồi mang cái lỗi thoát-giao-dịch quay lại. Bốn cũng đúng: một hợp đồng API thật sự là một thứ khác với một hàng trong bảng, và nó cần kiểm tra lúc chạy dù thế nào.',
          ),
        }),

        mcq({
          prompt: B(
            'The 8 August 2026 incident: an enum value was renamed, every check passed, and <code>prisma db seed</code> broke on production. The cause was two things at once. Which two? (choose TWO)' + code(
              "// prisma/seed.ts\n" +
              "type ContentType = 'VLOG' | 'ARTICLE' | 'CODE' | 'TUTORIAL';\n\n" +
              '// tsconfig.json\n' +
              '{ "compilerOptions": { "rootDir": "./src" }, "exclude": ["prisma"] }',
            ),
            'Sự cố 08/08/2026: một giá trị enum được đổi tên, mọi phép kiểm đều qua, và <code>prisma db seed</code> vỡ trên production. Nguyên nhân là hai thứ cùng lúc. Hai thứ nào? (chọn HAI)' + code(
              "// prisma/seed.ts\n" +
              "type ContentType = 'VLOG' | 'ARTICLE' | 'CODE' | 'TUTORIAL';\n\n" +
              '// tsconfig.json\n' +
              '{ "compilerOptions": { "rootDir": "./src" }, "exclude": ["prisma"] }',
            ),
          ),
          options: [
            B(
              'The union was hand-copied, so it was internally consistent — the file agreed with itself perfectly, and a type only ever catches a disagreement between two things',
              'Cái union được chép tay nên nó tự nhất quán — tệp ấy đồng ý với chính nó hoàn hảo, mà một kiểu chỉ bắt được sự bất đồng GIỮA HAI THỨ',
            ),
            B(
              '<code>rootDir: "./src"</code> means <code>prisma/**</code> cannot be in <code>include</code>, so <code>tsc --noEmit</code> never opened the file at all — even an imported type would not have been compiled there',
              '<code>rootDir: "./src"</code> nghĩa là <code>prisma/**</code> không nằm trong <code>include</code> được, nên <code>tsc --noEmit</code> chưa hề mở tệp đó ra — kể cả một kiểu được import cũng sẽ không được biên dịch ở đấy',
            ),
            B(
              '<code>prisma generate</code> was not re-run after the schema change, so the client still exported the old union and the seed matched it',
              '<code>prisma generate</code> chưa được chạy lại sau khi đổi lược đồ, nên client vẫn xuất ra union cũ và tệp seed khớp với nó',
            ),
            B(
              'The migration renamed the enum type but left existing rows holding the old value, so the seed collided with data rather than with the schema',
              'Migration đã đổi tên kiểu enum nhưng để lại những hàng cũ vẫn giữ giá trị cũ, nên tệp seed đụng với DỮ LIỆU chứ không phải với lược đồ',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'Either problem alone is survivable: a hand-copied type in a checked file breaks the build, and a checked import in an unchecked file still works. Both at once produces a file that is TypeScript in name only — and the seed is not part of the test suite and not part of local development once the database exists, so its first run after the change was against production. The two fixes are both in the repository\'s pre-push checklist now: <code>import type { ContentType } from \'@prisma/client\'</code>, and a separate <code>tsconfig.seed.json</code> behind <code>npm run typecheck:seed</code> — plus <code>npx prisma db seed</code> run for real whenever an enum or model changes, because a runtime failure in a script nothing type-checks is only found by running it. The generalisation is the useful part: ask any codebase what is NOT type-checked (<code>npx tsc --noEmit --listFiles</code> against a <code>find</code> for <code>*.ts</code>), and the answer is seeds, backfills and one-off scripts — the files that touch production data most directly and are reviewed least carefully.',
            'Mỗi vấn đề đứng riêng thì còn sống được: một kiểu chép tay nằm trong một tệp có kiểm thì làm vỡ bản build, còn một import có kiểm nằm trong một tệp không kiểm thì vẫn chạy. Hai cái cùng lúc đẻ ra một tệp chỉ mang danh là TypeScript — mà tệp seed không nằm trong bộ test và cũng không nằm trong công việc hằng ngày ở máy một khi cơ sở dữ liệu đã có, nên lần chạy đầu tiên của nó sau thay đổi là chạy vào production. Hai cách vá giờ đều nằm trong danh sách kiểm trước-khi-push của kho: <code>import type { ContentType } from \'@prisma/client\'</code>, và một <code>tsconfig.seed.json</code> riêng chạy qua <code>npm run typecheck:seed</code> — cộng thêm chạy thật <code>npx prisma db seed</code> mỗi khi đổi một enum hay một model, vì một cú hỏng lúc chạy trong một script chẳng ai kiểm kiểu thì chỉ chạy mới biết. Phần khái quát mới là phần hữu ích: hãy hỏi bất kỳ kho mã nào rằng thứ gì KHÔNG được kiểm kiểu (<code>npx tsc --noEmit --listFiles</code> đối chiếu với một lệnh <code>find</code> tìm <code>*.ts</code>), và câu trả lời là seed, script đổ lại dữ liệu và script dùng một lần — đúng những tệp chạm vào dữ liệu production trực tiếp nhất và được review cẩn thận ít nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'A <code>settings Json?</code> column is written three different ways and read back with raw SQL:' + code(
              'await prisma.user.update({ where: { id: 1 }, data: { settings: Prisma.DbNull } });\n' +
              'await prisma.user.update({ where: { id: 2 }, data: { settings: Prisma.JsonNull } });',
            ) + code(
              'SELECT id, settings, settings IS NULL AS la_sql_null FROM users WHERE id IN (1,2);\n' +
              ' 1 | null   | true\n' +
              ' 2 | \'null\' | false',
            ) + 'What is the third form, and when does the distinction bite?',
            'Một cột <code>settings Json?</code> được ghi theo ba cách khác nhau rồi đọc lại bằng SQL thô:' + code(
              'await prisma.user.update({ where: { id: 1 }, data: { settings: Prisma.DbNull } });\n' +
              'await prisma.user.update({ where: { id: 2 }, data: { settings: Prisma.JsonNull } });',
            ) + code(
              'SELECT id, settings, settings IS NULL AS la_sql_null FROM users WHERE id IN (1,2);\n' +
              ' 1 | null   | true\n' +
              ' 2 | \'null\' | false',
            ) + 'Dạng thứ ba là gì, và sự phân biệt này cắn vào lúc nào?',
          ),
          options: [
            B(
              'A plain <code>null</code>, which is a synonym for <code>Prisma.DbNull</code> in both writes and filters, so the three-way distinction only exists in the documentation',
              'Một <code>null</code> trần, đồng nghĩa với <code>Prisma.DbNull</code> ở cả phép ghi lẫn phép lọc, nên sự phân biệt ba đường chỉ tồn tại trong tài liệu',
            ),
            B(
              '<code>undefined</code>, which stores the JSON value <code>null</code>; the distinction bites only on MySQL, where <code>JSON</code> and <code>JSONB</code> behave differently',
              '<code>undefined</code>, thứ lưu vào giá trị JSON <code>null</code>; sự phân biệt chỉ cắn trên MySQL, nơi <code>JSON</code> và <code>JSONB</code> cư xử khác nhau',
            ),
            B(
              '<code>Prisma.AnyNull</code>, which is the only one usable in <code>data</code>; <code>DbNull</code> and <code>JsonNull</code> are filter-side values and cannot appear in a write',
              '<code>Prisma.AnyNull</code>, thứ duy nhất dùng được trong <code>data</code>; <code>DbNull</code> và <code>JsonNull</code> là giá trị phía bộ lọc và không xuất hiện trong một phép ghi được',
            ),
            B(
              'A plain <code>null</code>, which in a FILTER means "ignore this condition" rather than "match rows where it is null" — so a filter object built from optional request parameters can quietly widen to match everything',
              'Một <code>null</code> trần, mà trong một BỘ LỌC thì nghĩa là "bỏ qua điều kiện này" chứ không phải "khớp những hàng có giá trị null" — nên một object lọc dựng từ tham số request tuỳ chọn có thể âm thầm nới ra khớp mọi thứ',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three genuinely different things. <code>DbNull</code> sets the column to SQL <code>NULL</code>, so <code>settings IS NULL</code> is true and any <code>-&gt;&gt;</code> access yields <code>NULL</code>. <code>JsonNull</code> stores the JSON document <code>null</code>, so the column is NOT null and <code>jsonb_typeof</code> answers <code>\'null\'</code> — which matters the moment a report counts "users with no settings". And a plain <code>null</code> in a <code>where</code> is Prisma\'s "this key is absent" marker, which is the one that costs data: a filter assembled from optional query parameters that all came back undefined is an empty object, and an empty object matches everything. That is the same mechanism behind <code>deleteMany({ where: undefined })</code> removing every row. Guard it by building the filter, checking it is non-empty, and refusing if it is not.',
            'Ba thứ thật sự khác nhau. <code>DbNull</code> đặt cột thành SQL <code>NULL</code>, nên <code>settings IS NULL</code> là đúng và mọi phép truy cập <code>-&gt;&gt;</code> đều ra <code>NULL</code>. <code>JsonNull</code> lưu vào tài liệu JSON <code>null</code>, nên cột KHÔNG null và <code>jsonb_typeof</code> trả lời <code>\'null\'</code> — điều này có ý nghĩa ngay khi một báo cáo đếm "người dùng chưa có thiết lập". Còn một <code>null</code> trần trong <code>where</code> là dấu hiệu "khoá này vắng mặt" của Prisma, và đó mới là cái tốn dữ liệu: một bộ lọc lắp từ các tham số truy vấn tuỳ chọn mà tất cả đều trả về undefined thì là một object rỗng, và một object rỗng khớp mọi thứ. Đó cũng chính là cơ chế đứng sau việc <code>deleteMany({ where: undefined })</code> xoá sạch mọi hàng. Hãy canh nó bằng cách dựng bộ lọc, kiểm rằng nó khác rỗng, và từ chối nếu không.',
          ),
        }),

        mcq({
          prompt: B(
            'A 112-model schema makes the editor lag. <code>tsc --noEmit --diagnostics</code> reports <code>Instantiations: 4,128,092</code> and <code>Check time: 18.42s</code>. Extracting ONE deeply nested inline <code>include</code> into a named type took it to 2,914,773 and 13.11s. Which explanation and next step are right?',
            'Một lược đồ 112 model làm trình soạn thảo ì. <code>tsc --noEmit --diagnostics</code> báo <code>Instantiations: 4.128.092</code> và <code>Check time: 18,42s</code>. Rút MỘT khối <code>include</code> lồng sâu viết tại chỗ ra thành một kiểu có tên đã kéo hai con số xuống 2.914.773 và 13,11s. Lời giải thích và bước tiếp theo nào ĐÚNG?',
          ),
          options: [
            B(
              'The generated <code>index.d.ts</code> is simply too large to parse, so the fix is <code>skipLibCheck</code> and, past that, splitting the schema into two clients — naming a type only moves the cost around',
              'Tệp <code>index.d.ts</code> sinh ra đơn giản là quá lớn để phân tích, nên cách vá là <code>skipLibCheck</code> và xa hơn nữa là tách lược đồ thành hai client — đặt tên cho một kiểu chỉ dời chi phí đi chỗ khác',
            ),
            B(
              'A conditional type like <code>PostGetPayload&lt;{ include: … }&gt;</code> is EVALUATED on demand and re-evaluated at every use, so naming it computes it once; run <code>--generateTrace</code>, name the two or three widest bars, and re-measure — the folklore fixes (importing types individually, <code>import type</code> everywhere, disabling <code>strict</code>) measure as noise',
              'Một kiểu điều kiện như <code>PostGetPayload&lt;{ include: … }&gt;</code> được TÍNH theo yêu cầu và tính lại ở mỗi chỗ dùng, nên đặt tên cho nó là tính đúng một lần; hãy chạy <code>--generateTrace</code>, đặt tên cho hai ba cái cột rộng nhất, rồi đo lại — mấy mẹo truyền miệng (nhập từng kiểu riêng, dùng <code>import type</code> khắp nơi, tắt <code>strict</code>) đo ra chỉ là nhiễu',
            ),
            B(
              'The number fell because the extracted type is used in fewer places, so the correct next step is to reduce how often each query type is referenced — typing the shared results as <code>any</code> at the boundaries is the standard approach',
              'Con số giảm vì cái kiểu được rút ra nay được dùng ở ít chỗ hơn, nên bước tiếp theo đúng là giảm số lần mỗi kiểu truy vấn bị tham chiếu — khai các kết quả dùng chung là <code>any</code> ở các biên là cách làm tiêu chuẩn',
            ),
            B(
              '<code>Instantiations</code> counts how many rows the queries return, so the drop means the extracted query now fetches less; the next step is to narrow every <code>select</code> until the number stops falling',
              '<code>Instantiations</code> đếm số hàng mà các truy vấn trả về, nên con số giảm nghĩa là truy vấn được rút ra nay nạp ít hơn; bước tiếp theo là thu hẹp mọi <code>select</code> cho tới khi con số thôi giảm',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Prisma\'s result types are computed, not written: the checker evaluates <code>GetPayload</code> against your argument object every time you hover, and it does not cache that across edits the way it caches a plain interface. So an inline four-level <code>include</code> is re-evaluated at every call site, and extracting it with <code>satisfies Prisma.PostInclude</code> plus <code>Prisma.PostGetPayload&lt;{ include: typeof … }&gt;</code> computes it once — measured at a 29% drop from ONE extraction. <code>Instantiations</code> is the number to watch: it counts generic evaluations, and it is the best available proxy for "why is my editor slow". Two habits complete the picture: annotate exported function returns, so consumers stop re-inferring them, and turn on <code>incremental</code> with a stable <code>tsBuildInfoFile</code>. And the option-three trap is the one worth naming: typing a result as <code>any</code> is instant relief that removes a real check, leaving a schema that is both large and unverified.',
            'Các kiểu kết quả của Prisma là được TÍNH chứ không phải được viết: bộ kiểm tra tính <code>GetPayload</code> trên object tham số của bạn mỗi lần bạn rê chuột, và nó không lưu đệm phần ấy qua các lần sửa như cách nó lưu đệm một interface thường. Nên một khối <code>include</code> bốn tầng viết tại chỗ bị tính lại ở từng chỗ gọi, còn rút nó ra bằng <code>satisfies Prisma.PostInclude</code> cộng <code>Prisma.PostGetPayload&lt;{ include: typeof … }&gt;</code> là tính đúng một lần — đo được mức giảm 29% chỉ từ MỘT lần rút. <code>Instantiations</code> là con số đáng theo dõi: nó đếm số lần một kiểu tổng quát phải được tính, và là đại lượng đại diện tốt nhất hiện có cho câu hỏi "vì sao trình soạn thảo của tôi ì". Hai thói quen nữa hoàn tất bức tranh: chú thích kiểu trả về cho các hàm được export, để bên tiêu thụ thôi phải suy diễn lại, và bật <code>incremental</code> với một <code>tsBuildInfoFile</code> cố định. Còn cái bẫy ở lựa chọn ba đáng gọi tên: khai một kết quả là <code>any</code> là liều thuốc giảm đau tức thì nhưng gỡ mất một phép kiểm thật, để lại một lược đồ vừa to vừa không được xác minh.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Cursor pagination, including the edges (chapter 5).</b> Implement <code>page(rows, args)</code>, reproducing on plain data exactly what Prisma Client does with <code>orderBy</code>, <code>cursor</code>, <code>take</code> and <code>skip</code>. Every rule below was measured against PostgreSQL, including the ones that look wrong.</p>' +
            '<ul>' +
            '<li>Sort the rows by <code>id</code> in the <code>orderBy</code> direction. Call that list L.</li>' +
            '<li><b>The cursor row is INCLUDED by default.</b> <code>skip</code> is how many rows to move away from it, in the direction of travel. A cursor whose id is not in L returns an empty page — not an error.</li>' +
            '<li><code>take</code> is positive to walk FORWARD from the cursor and negative to walk BACKWARD to it. With no cursor, a positive <code>take</code> starts at the first row of L and a negative one ends at the last row of L.</li>' +
            '<li>A negative <code>take</code> still returns its rows in L\'s order — the direction of travel changes, the sort does not.</li>' +
            '<li><code>take</code> is the <b>over-fetch</b> value: the page size is <code>|take| - 1</code>. Ask the list for <code>|take|</code> rows; if you get that many there is a next page, so drop the extra one — the one furthest along the direction of travel — and set <code>hasMore</code>.</li>' +
            '<li>Return <code>{ ids, nextCursor, hasMore }</code>. <code>nextCursor</code> is the id to pass back for the next call in the direction of travel — the LAST id when <code>take</code> is positive, the FIRST when it is negative — and <code>null</code> whenever <code>hasMore</code> is false.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing loop exactly as they are, and do not require anything.</p>',

            '<p><b>Câu 31 — Phân trang bằng con trỏ, kể cả các ca biên (chương 5).</b> Hãy cài đặt <code>page(rows, args)</code>, tái hiện trên dữ liệu thuần đúng thứ Prisma Client làm với <code>orderBy</code>, <code>cursor</code>, <code>take</code> và <code>skip</code>. Mọi luật dưới đây đều đã đo thật trên PostgreSQL, kể cả những cái trông có vẻ sai.</p>' +
            '<ul>' +
            '<li>Sắp các hàng theo <code>id</code> theo chiều của <code>orderBy</code>. Gọi danh sách đó là L.</li>' +
            '<li><b>Hàng con trỏ được TÍNH VÀO theo mặc định.</b> <code>skip</code> là số hàng cần rời khỏi nó, theo chiều đang đi. Một con trỏ có id không nằm trong L thì trả về một trang rỗng — không phải một lỗi.</li>' +
            '<li><code>take</code> dương là đi TỚI kể từ con trỏ, âm là đi LÙI về phía con trỏ. Không có con trỏ thì <code>take</code> dương bắt đầu ở hàng đầu tiên của L, còn <code>take</code> âm kết thúc ở hàng cuối cùng của L.</li>' +
            '<li><code>take</code> âm vẫn trả các hàng theo thứ tự của L — chiều đi thay đổi, còn thứ tự sắp xếp thì không.</li>' +
            '<li><code>take</code> là giá trị <b>lấy dư</b>: cỡ trang là <code>|take| - 1</code>. Hãy xin danh sách <code>|take|</code> hàng; nếu lấy đủ chừng ấy thì còn trang sau, hãy bỏ hàng dư — hàng nằm xa nhất theo chiều đang đi — rồi đặt <code>hasMore</code>.</li>' +
            '<li>Trả về <code>{ ids, nextCursor, hasMore }</code>. <code>nextCursor</code> là id để truyền lại cho lời gọi kế tiếp theo chiều đang đi — id CUỐI khi <code>take</code> dương, id ĐẦU khi <code>take</code> âm — và là <code>null</code> mỗi khi <code>hasMore</code> bằng false.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không require thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const ROWS = [\n' +
            "  { id: 1, title: 'T1' }, { id: 2, title: 'T2' }, { id: 3, title: 'T3' },\n" +
            "  { id: 4, title: 'T4' }, { id: 5, title: 'T5' }, { id: 6, title: 'T6' },\n" +
            "  { id: 7, title: 'T7' },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function page(rows, args) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const CASES = [\n' +
            "  { orderBy: 'asc',  take: 4 },\n" +
            "  { orderBy: 'asc',  take: 4, cursor: 3 },\n" +
            "  { orderBy: 'asc',  take: 4, cursor: 3, skip: 1 },\n" +
            "  { orderBy: 'asc',  take: 4, cursor: 5, skip: 1 },\n" +
            "  { orderBy: 'asc',  take: 4, cursor: 7, skip: 1 },\n" +
            "  { orderBy: 'asc',  take: 4, cursor: 99 },\n" +
            "  { orderBy: 'asc',  take: -4, cursor: 3 },\n" +
            "  { orderBy: 'asc',  take: -4, cursor: 3, skip: 1 },\n" +
            "  { orderBy: 'asc',  take: -4 },\n" +
            "  { orderBy: 'desc', take: 4 },\n" +
            "  { orderBy: 'desc', take: 4, cursor: 5, skip: 1 },\n" +
            "  { orderBy: 'desc', take: -4, cursor: 5, skip: 1 },\n" +
            "  { orderBy: 'desc', take: -4 },\n" +
            "  { orderBy: 'asc',  take: 4, skip: 2 },\n" +
            '];\n' +
            "for (const c of CASES) console.log(JSON.stringify(c) + ' => ' + JSON.stringify(page(ROWS, c)));\n",
          expectedOutput:
            '{"orderBy":"asc","take":4} => {"ids":[1,2,3],"nextCursor":3,"hasMore":true}\n' +
            '{"orderBy":"asc","take":4,"cursor":3} => {"ids":[3,4,5],"nextCursor":5,"hasMore":true}\n' +
            '{"orderBy":"asc","take":4,"cursor":3,"skip":1} => {"ids":[4,5,6],"nextCursor":6,"hasMore":true}\n' +
            '{"orderBy":"asc","take":4,"cursor":5,"skip":1} => {"ids":[6,7],"nextCursor":null,"hasMore":false}\n' +
            '{"orderBy":"asc","take":4,"cursor":7,"skip":1} => {"ids":[],"nextCursor":null,"hasMore":false}\n' +
            '{"orderBy":"asc","take":4,"cursor":99} => {"ids":[],"nextCursor":null,"hasMore":false}\n' +
            '{"orderBy":"asc","take":-4,"cursor":3} => {"ids":[1,2,3],"nextCursor":null,"hasMore":false}\n' +
            '{"orderBy":"asc","take":-4,"cursor":3,"skip":1} => {"ids":[1,2],"nextCursor":null,"hasMore":false}\n' +
            '{"orderBy":"asc","take":-4} => {"ids":[5,6,7],"nextCursor":5,"hasMore":true}\n' +
            '{"orderBy":"desc","take":4} => {"ids":[7,6,5],"nextCursor":5,"hasMore":true}\n' +
            '{"orderBy":"desc","take":4,"cursor":5,"skip":1} => {"ids":[4,3,2],"nextCursor":2,"hasMore":true}\n' +
            '{"orderBy":"desc","take":-4,"cursor":5,"skip":1} => {"ids":[7,6],"nextCursor":null,"hasMore":false}\n' +
            '{"orderBy":"desc","take":-4} => {"ids":[3,2,1],"nextCursor":3,"hasMore":true}\n' +
            '{"orderBy":"asc","take":4,"skip":2} => {"ids":[3,4,5],"nextCursor":5,"hasMore":true}',
          sampleSolution:
            'function page(rows, args) {\n' +
            "  const { orderBy = 'asc', cursor, take, skip = 0 } = args;\n" +
            "  const L = [...rows].sort((a, b) => (orderBy === 'asc' ? a.id - b.id : b.id - a.id));\n\n" +
            '  let i;\n' +
            '  if (cursor === undefined) {\n' +
            '    i = take >= 0 ? 0 : L.length - 1;          // không con trỏ: đầu hoặc cuối L\n' +
            '  } else {\n' +
            '    i = L.findIndex((r) => r.id === cursor);\n' +
            '    if (i < 0) return { ids: [], nextCursor: null, hasMore: false };\n' +
            '  }\n\n' +
            '  const n = Math.abs(take);\n' +
            '  const window = take >= 0\n' +
            '    ? L.slice(i + skip, i + skip + n)\n' +
            '    : L.slice(Math.max(0, i - skip - n + 1), Math.max(0, i - skip + 1));\n\n' +
            '  const wanted = n - 1;                        // take là giá trị LẤY DƯ\n' +
            '  const hasMore = window.length > wanted;\n' +
            '  const items = hasMore\n' +
            '    ? (take >= 0 ? window.slice(0, wanted) : window.slice(1))\n' +
            '    : window;\n\n' +
            '  const edge = take >= 0 ? items[items.length - 1] : items[0];\n' +
            '  return {\n' +
            '    ids: items.map((r) => r.id),\n' +
            '    nextCursor: hasMore && edge ? edge.id : null,\n' +
            '    hasMore,\n' +
            '  };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — What <code>migrate status</code>, <code>deploy</code> and <code>resolve</code> actually do (chapter 6).</b> Implement <code>run(disk, db0, script)</code>, a model of Prisma\'s migration engine over a folder on disk and the <code>_prisma_migrations</code> table. Every rule below was measured on Prisma 6.19.3 against PostgreSQL 16.14.</p>' +
            '<ul>' +
            '<li>Migrations run in <b>lexicographic order of the folder name</b>, not in the order they appear in <code>DISK</code>.</li>' +
            '<li>A migration is <b>applied</b> when some row for its name has <code>finishedAt</code>; <b>failed</b> when a row has neither <code>finishedAt</code> nor <code>rolledBackAt</code>; <b>pending</b> when it is on disk and not applied.</li>' +
            '<li><b>Neither <code>status</code> nor <code>deploy</code> compares the checksum</b> — a row whose stored checksum disagrees with the file is simply never mentioned.</li>' +
            '<li><code>status</code> → <code>\'failed:&lt;name&gt;\'</code> if any migration is failed, else <code>\'pending:&lt;names joined by commas&gt;\'</code>, else <code>\'up-to-date\'</code>.</li>' +
            '<li><code>deploy</code> → <code>\'P3009:&lt;name&gt;\'</code> if any migration is failed, and NOTHING is applied. Otherwise apply the pending ones in order; a migration whose SQL contains <code>-- FAIL</code> stops the run. <b>PostgreSQL wraps each file in a transaction, so a failed file applies nothing</b>: append a row with <code>appliedStepsCount: 0</code>, <code>finishedAt: null</code>, <code>rolledBackAt: null</code>. A successful one appends a row with <code>finishedAt: \'t\'</code> and <code>appliedStepsCount</code> = the number of non-blank lines in its SQL. The result string is <code>\'applied(a,b)\'</code>, or <code>\'P3018:&lt;name&gt;(a,b)\'</code> when it stopped, where <code>a,b</code> are the names that DID apply this run — <code>()</code> when none did. With nothing pending, <code>\'no-pending\'</code>.</li>' +
            '<li><code>resolve --rolled-back &lt;name&gt;</code> → sets <code>rolledBackAt</code> on the LAST row for that name and returns <code>\'rolled-back:&lt;name&gt;\'</code>; if there is no such row or it is already applied, <code>\'nothing-to-roll-back\'</code>. It undoes nothing, and the migration becomes pending again.</li>' +
            '<li><code>resolve --applied &lt;name&gt;</code> → if the LAST row for that name is failed, set its <code>finishedAt</code>; otherwise append a new row with <code>finishedAt: \'t\'</code>, <code>checksum: \'baseline\'</code> and <code>appliedStepsCount: 0</code>. It never runs the SQL. Returns <code>\'applied:&lt;name&gt;\'</code>.</li>' +
            '</ul>' +
            '<p>Return <code>{ out, table }</code>: <code>out</code> is the result strings in order, and <code>table</code> is one <code>&lt;name&gt;=&lt;state&gt;/&lt;appliedStepsCount&gt;</code> entry per row in insertion order, with state <code>applied</code>, <code>rolled-back</code> or <code>failed</code>. Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — <code>migrate status</code>, <code>deploy</code> và <code>resolve</code> thật sự làm gì (chương 6).</b> Hãy cài đặt <code>run(disk, db0, script)</code> — một mô hình của engine migration Prisma trên một thư mục đĩa và bảng <code>_prisma_migrations</code>. Mọi luật dưới đây đều đo thật trên Prisma 6.19.3 với PostgreSQL 16.14.</p>' +
            '<ul>' +
            '<li>Migration chạy theo <b>thứ tự từ điển của tên thư mục</b>, không phải thứ tự chúng xuất hiện trong <code>DISK</code>.</li>' +
            '<li>Một migration là <b>đã áp</b> khi có một hàng mang tên nó và có <code>finishedAt</code>; là <b>hỏng</b> khi có một hàng không có cả <code>finishedAt</code> lẫn <code>rolledBackAt</code>; là <b>đang chờ</b> khi nó có trên đĩa và chưa được áp.</li>' +
            '<li><b>Cả <code>status</code> lẫn <code>deploy</code> đều KHÔNG so checksum</b> — một hàng có checksum lưu sẵn lệch với tệp thì đơn giản là không bao giờ được nhắc tới.</li>' +
            '<li><code>status</code> → <code>\'failed:&lt;tên&gt;\'</code> nếu có migration nào hỏng, không thì <code>\'pending:&lt;các tên nối bằng dấu phẩy&gt;\'</code>, không nữa thì <code>\'up-to-date\'</code>.</li>' +
            '<li><code>deploy</code> → <code>\'P3009:&lt;tên&gt;\'</code> nếu có migration nào hỏng, và KHÔNG áp gì cả. Còn không thì áp lần lượt các cái đang chờ; migration nào có <code>-- FAIL</code> trong SQL thì làm dừng lượt chạy. <b>PostgreSQL bọc mỗi tệp trong một giao dịch nên một tệp hỏng thì không áp được gì</b>: hãy thêm một hàng với <code>appliedStepsCount: 0</code>, <code>finishedAt: null</code>, <code>rolledBackAt: null</code>. Cái thành công thì thêm một hàng với <code>finishedAt: \'t\'</code> và <code>appliedStepsCount</code> bằng số dòng khác rỗng trong SQL của nó. Chuỗi kết quả là <code>\'applied(a,b)\'</code>, hoặc <code>\'P3018:&lt;tên&gt;(a,b)\'</code> khi nó dừng lại, với <code>a,b</code> là những tên ĐÃ áp được trong lượt này — <code>()</code> khi không có cái nào. Không có gì chờ thì <code>\'no-pending\'</code>.</li>' +
            '<li><code>resolve --rolled-back &lt;tên&gt;</code> → đặt <code>rolledBackAt</code> lên hàng CUỐI CÙNG mang tên đó rồi trả <code>\'rolled-back:&lt;tên&gt;\'</code>; nếu không có hàng nào như thế hoặc nó đã áp rồi thì trả <code>\'nothing-to-roll-back\'</code>. Nó không gỡ bỏ gì cả, và migration ấy quay lại trạng thái đang chờ.</li>' +
            '<li><code>resolve --applied &lt;tên&gt;</code> → nếu hàng CUỐI CÙNG mang tên đó đang hỏng thì đặt <code>finishedAt</code> cho nó; không thì thêm một hàng mới với <code>finishedAt: \'t\'</code>, <code>checksum: \'baseline\'</code> và <code>appliedStepsCount: 0</code>. Nó KHÔNG BAO GIỜ chạy đoạn SQL. Trả về <code>\'applied:&lt;tên&gt;\'</code>.</li>' +
            '</ul>' +
            '<p>Trả về <code>{ out, table }</code>: <code>out</code> là các chuỗi kết quả theo thứ tự, còn <code>table</code> là mỗi hàng một mục <code>&lt;tên&gt;=&lt;trạng thái&gt;/&lt;appliedStepsCount&gt;</code> theo thứ tự chèn, với trạng thái là <code>applied</code>, <code>rolled-back</code> hoặc <code>failed</code>. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const hash = (s) => { let h = 0; for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) % 1000003; return 'c' + h; };\n\n" +
            'const DISK = [\n' +
            "  { name: '20260104000000_add_slug',  sql: 'ALTER TABLE \"Note\" ADD \"slug\";' },\n" +
            "  { name: '0_init',                   sql: 'CREATE TABLE \"Note\";' },\n" +
            "  { name: '20260103000000_bad_check', sql: 'ALTER TABLE \"Note\" ADD \"note\";\\nALTER TABLE \"Note\" ADD CHECK; -- FAIL 23514' },\n" +
            "  { name: '20260102000000_add_body',  sql: 'ALTER TABLE \"Note\" ADD \"body\";' },\n" +
            '];\n\n' +
            '// Bảng _prisma_migrations lúc bắt đầu. Chú ý checksum của 0_init: tệp trên đĩa\n' +
            '// đã bị SỬA sau khi áp dụng, nên nó KHÔNG khớp giá trị lưu ở đây.\n' +
            'const DB0 = [\n' +
            "  { name: '0_init', checksum: 'c999999', finishedAt: 't0', rolledBackAt: null, appliedStepsCount: 1 },\n" +
            '];\n\n' +
            'const SCRIPT = [\n' +
            "  ['status'],\n" +
            "  ['deploy'],\n" +
            "  ['status'],\n" +
            "  ['deploy'],\n" +
            "  ['resolve', '--rolled-back', '20260103000000_bad_check'],\n" +
            "  ['deploy'],\n" +
            "  ['resolve', '--applied', '20260103000000_bad_check'],\n" +
            "  ['deploy'],\n" +
            "  ['status'],\n" +
            "  ['resolve', '--applied', '20260105000000_khong_co_tren_dia'],\n" +
            "  ['status'],\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function run(disk, db0, script) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const { out, table } = run(DISK, DB0, SCRIPT);\n' +
            "SCRIPT.forEach((c, i) => console.log(String(i + 1).padStart(2, '0') + ' ' + c.join(' ') + ' -> ' + out[i]));\n" +
            "console.log('table=' + JSON.stringify(table));\n",
          expectedOutput:
            '01 status -> pending:20260102000000_add_body,20260103000000_bad_check,20260104000000_add_slug\n' +
            '02 deploy -> P3018:20260103000000_bad_check(20260102000000_add_body)\n' +
            '03 status -> failed:20260103000000_bad_check\n' +
            '04 deploy -> P3009:20260103000000_bad_check\n' +
            '05 resolve --rolled-back 20260103000000_bad_check -> rolled-back:20260103000000_bad_check\n' +
            '06 deploy -> P3018:20260103000000_bad_check()\n' +
            '07 resolve --applied 20260103000000_bad_check -> applied:20260103000000_bad_check\n' +
            '08 deploy -> applied(20260104000000_add_slug)\n' +
            '09 status -> up-to-date\n' +
            '10 resolve --applied 20260105000000_khong_co_tren_dia -> applied:20260105000000_khong_co_tren_dia\n' +
            '11 status -> up-to-date\n' +
            'table=["0_init=applied/1","20260102000000_add_body=applied/1","20260103000000_bad_check=rolled-back/0","20260103000000_bad_check=applied/0","20260104000000_add_slug=applied/1","20260105000000_khong_co_tren_dia=applied/0"]',
          sampleSolution:
            'function run(disk, db0, script) {\n' +
            '  const db = db0.map((r) => ({ ...r }));\n' +
            '  const out = [];\n' +
            '  const order = [...disk].sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));\n\n' +
            '  const failedRow = () => db.find((r) => r.finishedAt === null && r.rolledBackAt === null);\n' +
            '  const isApplied = (name) => db.some((r) => r.name === name && r.finishedAt !== null);\n' +
            '  const pending = () => order.filter((m) => !isApplied(m.name));\n\n' +
            '  for (const [cmd, a, b] of script) {\n' +
            "    if (cmd === 'status') {\n" +
            "      const f = failedRow();\n" +
            "      if (f) { out.push('failed:' + f.name); continue; }\n" +
            '      const p = pending();\n' +
            "      out.push(p.length ? 'pending:' + p.map((m) => m.name).join(',') : 'up-to-date');\n" +
            '      continue;\n' +
            '    }\n\n' +
            "    if (cmd === 'deploy') {\n" +
            '      const f = failedRow();\n' +
            "      if (f) { out.push('P3009:' + f.name); continue; }   // checksum KHÔNG được kiểm\n" +
            '      const p = pending();\n' +
            "      if (!p.length) { out.push('no-pending'); continue; }\n" +
            '      let stopped = null;\n' +
            '      const done = [];\n' +
            '      for (const m of p) {\n' +
            "        if (m.sql.includes('-- FAIL')) {\n" +
            '          // DDL trong một giao dịch: hỏng thì KHÔNG bước nào áp được.\n' +
            '          db.push({ name: m.name, checksum: hash(m.sql), finishedAt: null, rolledBackAt: null, appliedStepsCount: 0 });\n' +
            '          stopped = m.name;\n' +
            '          break;\n' +
            '        }\n' +
            '        db.push({\n' +
            "          name: m.name, checksum: hash(m.sql), finishedAt: 't', rolledBackAt: null,\n" +
            "          appliedStepsCount: m.sql.split('\\n').filter((l) => l.trim()).length,\n" +
            '        });\n' +
            '        done.push(m.name);\n' +
            '      }\n' +
            "      out.push((stopped ? 'P3018:' + stopped : 'applied') + '(' + done.join(',') + ')');\n" +
            '      continue;\n' +
            '    }\n\n' +
            "    if (cmd === 'resolve') {\n" +
            '      const row = [...db].reverse().find((r) => r.name === b);\n' +
            "      if (a === '--rolled-back') {\n" +
            "        if (!row || row.finishedAt !== null) { out.push('nothing-to-roll-back'); continue; }\n" +
            "        row.rolledBackAt = 't';                 // chỉ đổi GHI NHẬN, không gỡ gì\n" +
            "        out.push('rolled-back:' + b);\n" +
            '        continue;\n' +
            '      }\n' +
            "      if (row && row.finishedAt === null && row.rolledBackAt === null) row.finishedAt = 't';\n" +
            "      else db.push({ name: b, checksum: 'baseline', finishedAt: 't', rolledBackAt: null, appliedStepsCount: 0 });\n" +
            "      out.push('applied:' + b);\n" +
            '      continue;\n' +
            '    }\n' +
            '  }\n\n' +
            '  const table = db.map((r) =>\n' +
            "    r.name + '=' + (r.finishedAt !== null ? 'applied' : r.rolledBackAt !== null ? 'rolled-back' : 'failed')\n" +
            "    + '/' + r.appliedStepsCount);\n" +
            '  return { out, table };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
