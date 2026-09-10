/**
 * Prisma ORM — Progress Test 3 (chương s09–s12).
 *
 * Đề tự soạn, bám sát `content/courses/prisma-orm/s09-hieu-nang` … `s12-chan-doan`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ MỌI log truy vấn, mọi mã lỗi, mọi giá trị trả về và mọi thông báo trong đề
 * này đều được ĐO THẬT trong một dự án Prisma nháp NGOÀI kho api-backend:
 *
 *     prisma 6.19.3 · @prisma/client 6.19.3 · Node v22.21.0 · darwin-arm64
 *     PostgreSQL 16.14 (Debian) trong Docker, container riêng, cổng riêng
 *
 * Lược đồ của kho api-backend KHÔNG bị đụng tới: không `migrate`, không
 * `db push`, không `generate` nào trỏ vào `prisma/schema.prisma` của kho này.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ SÁU CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026 trên 6.19.3) — ĐỀ THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. `$executeRaw` trên một câu `SELECT` KHÔNG trả về 0. Bẫy ở bài 10.1 nói nó
 *    "đưa cho bạn số 0 — vì SELECT không tác động hàng nào". Đo thật với bảng
 *    có 2 hàng: `await p.$executeRaw\`SELECT id FROM "Post"\`` trả về **2**.
 *    PostgreSQL đặt số hàng vào command tag của cả `SELECT`, và Prisma báo lại
 *    đúng con số đó. Cái bẫy vẫn còn thật — bạn nhận một CON SỐ chứ không phải
 *    các hàng — nhưng con số ấy không phải 0. Câu 9.
 *
 * 2. `reltuples` trả về **-1** trên một bảng chưa từng `ANALYZE`. Bài 9.5 giới
 *    thiệu nó như một ước lượng có sẵn, "nhanh gấp 10.000 lần, lệch 0,06%". Đo
 *    thật: bảng mới ⇒ `-1`; chạy `ANALYZE "Post"` ⇒ `2` (đúng); chèn thêm 5
 *    hàng ⇒ vẫn `2` trong khi `count()` là `7`. Nghĩa là mẹo này có HAI kiểu
 *    hỏng, không phải một. Câu 7.
 *
 * 3. `PrismaClientInitializationError` KHÔNG mang mã lỗi. Bài 12.2 dựng cả một
 *    bảng quanh `P1000`/`P1001`/`P1003`. Đo thật ba ca (sai mật khẩu, sai cổng,
 *    thiếu database): lớp lỗi có thuộc tính `errorCode` nhưng nó là
 *    `undefined`, và `code` thì không tồn tại. Danh sách thuộc tính đầy đủ là
 *    `["stack","message","clientVersion","errorCode","retryable","name"]`. Chỉ
 *    có CÂU CHỮ phân biệt được ba ca. So với `PrismaClientKnownRequestError`,
 *    thứ có `code: 'P2025'` đàng hoàng. Câu 24.
 *
 * 4. `relationLoadStrategy` VẪN nằm sau cờ xem trước `relationJoins` trên
 *    6.19.3 — không bật thì `PrismaClientValidationError: Unknown argument
 *    \`relationLoadStrategy\``. `$metrics` cũng thế: `\`metrics\` preview
 *    feature must be enabled in order to access metrics API`. Bài 9.2 và 12.4
 *    có nhắc tới cờ, nhưng đề nêu lại vì đây là chỗ người ta chép mã rồi ngạc
 *    nhiên. Câu 1 và câu 29.
 *
 * 5. Truy vấn thô hỏng thì về dưới dạng `PrismaClientKnownRequestError` mã
 *    **P2010**, còn SQLSTATE của PostgreSQL (`42P01`) nằm bên trong câu chữ:
 *    `Raw query failed. Code: \`42P01\`. Message: \`relation "post" does not
 *    exist\``. Hai tầng mã, và tầng ngoài giống nhau cho mọi lỗi SQL thô.
 *
 * 6. Một BÍ DANH không đặt trong ngoặc kép bị PostgreSQL gập về chữ thường, nên
 *    khoá trong object JavaScript trả về là `viewcount` chứ không phải
 *    `viewCount`. Bài 10.2 nói điều này về định danh; đo thật thì nó áp cả cho
 *    khoá của kết quả. Câu 10.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới đây):
 *     { '0': 8, '1': 8, '2': 8, '3': 7 }   → A 8 · B 8 · C 8 · D 7
 *     (31 ô đáp án chứ không phải 30, vì một câu là dạng "chọn HAI")
 *
 *   node -e "import('./content/exams/PRISMA-ORM-PT3.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRISMA-ORM-PT3.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/prisma-exam-kit.mjs';

export default {
  course: { slug: 'prisma-orm' },
  exams: [
    {
      kind: 'FE',
      code: 'PT3',
      source: 'SAMPLE',
      sortOrder: 3,
      title: B(
        'Progress Test 3 — Chapters 9–12 (performance, raw SQL, shipping, diagnosis)',
        'Kiểm tra tiến độ 3 — Chương 9–12 (hiệu năng, SQL thô, đưa lên production, chẩn đoán)',
      ),
      description: B(
        'The last third of the Prisma course: measuring before changing anything, N+1 in all its forms, indexes your queries can actually use, the escape hatches into raw SQL, getting an image that runs, and diagnosing an incident from the error codes. 30 multiple-choice questions plus 2 coding questions you write here in the exam room. Every log line, error object and return value came from running the command against PostgreSQL 16.14 with Prisma 6.19.3.',
        'Một phần ba cuối của khoá Prisma: đo trước khi sửa, N+1 ở đủ mọi dạng, những chỉ mục truy vấn của bạn thật sự dùng được, các cửa thoát hiểm sang SQL thô, dựng được một ảnh chạy nổi, và chẩn đoán một sự cố từ mã lỗi. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi. Mọi dòng log, mọi đối tượng lỗi và mọi giá trị trả về đều lấy từ việc chạy thật trên PostgreSQL 16.14 với Prisma 6.19.3.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(3, '9–12'),
      questions: [
        // ── Chương 9 — Hiệu năng ────────────────────────────────────────
        mcq({
          prompt: B(
            'A team copies a <code>relationLoadStrategy</code> example from the chapter into a codebase whose generator block has no <code>previewFeatures</code>. On Prisma 6.19.3 this happens:' + code(
              "await prisma.post.findMany({ include: { author: true }, relationLoadStrategy: 'join' });",
            ) + code(
              'PrismaClientValidationError: Unknown argument `relationLoadStrategy`.\n' +
              'Available options are marked with ?.',
            ) + 'What is going on, and how should the strategy be chosen once it works?',
            'Một nhóm chép ví dụ <code>relationLoadStrategy</code> từ giáo trình vào một kho mã có khối generator không khai <code>previewFeatures</code> nào. Trên Prisma 6.19.3 thì thế này:' + code(
              "await prisma.post.findMany({ include: { author: true }, relationLoadStrategy: 'join' });",
            ) + code(
              'PrismaClientValidationError: Unknown argument `relationLoadStrategy`.\n' +
              'Available options are marked with ?.',
            ) + 'Chuyện gì đang xảy ra, và khi nó chạy được rồi thì nên chọn chiến lược thế nào?',
          ),
          options: [
            B(
              'The argument only exists on <code>findUnique</code>; on <code>findMany</code> the strategy is inferred from the shape of the <code>include</code> and cannot be overridden',
              'Tham số đó chỉ tồn tại trên <code>findUnique</code>; với <code>findMany</code> thì chiến lược được suy ra từ hình dạng của <code>include</code> và không ghi đè được',
            ),
            B(
              'The feature was removed in Prisma 6; the modern equivalent is a raw <code>LATERAL</code> join, and the chapter is describing a Prisma 5 API',
              'Tính năng này đã bị gỡ ở Prisma 6; thứ tương đương hiện nay là một phép nối <code>LATERAL</code> thô, còn giáo trình đang mô tả một API của Prisma 5',
            ),
            B(
              'The strategy must be set on the datasource block rather than per query, and the per-query form is what the error is rejecting',
              'Chiến lược phải đặt ở khối datasource chứ không phải từng truy vấn, và cái dạng theo-từng-truy-vấn mới là thứ lỗi kia đang từ chối',
            ),
            B(
              'It needs <code>previewFeatures = ["relationJoins"]</code> in the generator block and a regenerate — and once it works it is a PER-QUERY argument to measure, not a global default to set, because <code>join</code> wins on round trips and loses badly when the parent row is wide or the nesting is deep',
              'Nó cần <code>previewFeatures = ["relationJoins"]</code> trong khối generator rồi generate lại — và khi chạy được rồi thì nó là một tham số THEO TỪNG TRUY VẤN cần đo, không phải một mặc định toàn cục để đặt, vì <code>join</code> thắng ở số lượt đi về và thua đau khi hàng cha rộng hoặc lồng sâu',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured on 6.19.3: without the preview flag the argument is not in the generated types at all, so it is a validation error rather than a silent no-op — which is the good outcome. The part worth internalising is what happens after you enable it. <code>join</code> collapses several statements into one <code>LATERAL</code> query, so it wins wherever a round trip is expensive; but a lateral join REPEATS the parent row for every child, so forty posts with a 6 KB body and five comments each send that body five times. Measured on this shape, <code>query</code> took 48 ms and <code>join</code> took 213 ms — the opposite of the narrow case, where <code>join</code> won 19 ms to 31 ms. There is a global default and setting it is the mistake: the right answer differs per query, and the only way to know is to run both against real data.',
            'Đo trên 6.19.3: không bật cờ xem trước thì tham số ấy hoàn toàn không có trong các kiểu sinh ra, nên nó là một lỗi validation chứ không phải một cú im lặng chẳng làm gì — và đó là kết cục tốt. Phần đáng thấm là chuyện xảy ra SAU khi bật. <code>join</code> gộp nhiều câu lệnh thành một truy vấn <code>LATERAL</code>, nên nó thắng ở đâu mà một lượt đi về là đắt; nhưng một phép nối lateral LẶP LẠI hàng cha cho từng hàng con, nên bốn mươi bài viết có thân bài 6 KB kèm năm bình luận mỗi bài sẽ gửi cái thân bài ấy năm lần. Đo trên đúng hình dạng đó, <code>query</code> mất 48 ms còn <code>join</code> mất 213 ms — ngược hẳn với ca hàng cha hẹp, nơi <code>join</code> thắng 19 ms so với 31 ms. Có một mặc định toàn cục, và đặt nó là sai lầm: câu trả lời đúng khác nhau theo từng truy vấn, và cách duy nhất để biết là chạy cả hai trên dữ liệu thật.',
          ),
        }),

        mcq({
          prompt: B(
            'Two versions of the same helper call. Both return the same data. Which statement is right?' + code(
              '// A — sequential\n' +
              'for (const b of posts) b.count = await demBinhLuan(b.id);\n\n' +
              '// B — concurrent\n' +
              'await Promise.all(posts.map(async (b) => { b.count = await demBinhLuan(b.id); }));',
            ),
            'Hai phiên bản của cùng một lời gọi trợ giúp. Cả hai trả về cùng dữ liệu. Phát biểu nào ĐÚNG?' + code(
              '// A — tuần tự\n' +
              'for (const b of posts) b.count = await demBinhLuan(b.id);\n\n' +
              '// B — song song\n' +
              'await Promise.all(posts.map(async (b) => { b.count = await demBinhLuan(b.id); }));',
            ),
          ),
          options: [
            B(
              'B is the fix: forty concurrent queries are forty times faster than forty sequential ones, and the database handles concurrency better than a loop does',
              'B là cách vá: bốn mươi truy vấn song song nhanh gấp bốn mươi lần bốn mươi truy vấn tuần tự, và cơ sở dữ liệu xử lý song song tốt hơn một vòng lặp',
            ),
            B(
              'B is WORSE, not better: it issues the same forty queries but holds forty pool connections at once, so the page "performs well" in isolation and takes the site down at fifty concurrent users — the fix for both is <code>_count</code> in the parent query',
              'B TỆ HƠN chứ không tốt hơn: nó vẫn bắn đúng bốn mươi truy vấn ấy nhưng giữ bốn mươi kết nối pool cùng lúc, nên trang "chạy tốt" khi đo riêng rồi kéo sập cả web ở năm mươi người dùng đồng thời — cách vá cho cả hai là <code>_count</code> ngay trong truy vấn cha',
            ),
            B(
              'They are equivalent in cost; the only difference is that A preserves the order of <code>posts</code> and B does not',
              'Hai cái tốn như nhau; khác biệt duy nhất là A giữ nguyên thứ tự của <code>posts</code> còn B thì không',
            ),
            B(
              'A is the N+1 and B is not, because Prisma batches the queries issued inside a single <code>Promise.all</code> into one <code>IN</code> statement',
              'A mới là N+1 còn B thì không, vì Prisma gộp các truy vấn phát ra bên trong một <code>Promise.all</code> thành một câu lệnh <code>IN</code> duy nhất',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both are the same N+1; <code>Promise.all</code> only changes how it feels. Forty sequential 14 ms queries take 560 ms and look obviously wrong. Forty concurrent ones take about 40 ms and look fine — while consuming forty pool connections at once. That is why the metric is QUERIES PER REQUEST and not milliseconds: latency hides the problem and load exposes it, and the two measurements disagree exactly when it matters. Prisma batches relations it loads through an <code>include</code>, not calls you make yourself, so nothing collapses these forty. This is form 2 of four; form 4 is the nastiest, because the service method and the caller are both reasonable in isolation and the N+1 exists only in the combination — which is the argument for a query-count assertion in a test rather than a code review rule.',
            'Cả hai đều là cùng một N+1; <code>Promise.all</code> chỉ đổi cảm giác. Bốn mươi truy vấn tuần tự 14 ms mất 560 ms và trông sai rành rành. Bốn mươi truy vấn song song mất khoảng 40 ms và trông ổn — trong lúc ngốn bốn mươi kết nối pool cùng lúc. Đó là lý do thước đo là SỐ TRUY VẤN MỖI REQUEST chứ không phải mili giây: độ trễ giấu vấn đề đi còn tải làm nó lộ ra, và hai phép đo bất đồng đúng vào lúc điều đó quan trọng. Prisma gộp lô cho những quan hệ nó nạp qua một <code>include</code>, chứ không gộp những lời gọi bạn tự viết, nên chẳng có gì gộp bốn mươi cái này lại. Đây là dạng 2 trong bốn dạng; dạng 4 mới hiểm nhất, vì phương thức service và chỗ gọi nó đều hợp lý khi nhìn riêng, và cái N+1 chỉ tồn tại trong sự kết hợp — đó chính là lý lẽ cho một phép khẳng định số-truy-vấn trong test thay vì một luật review mã.',
          ),
        }),

        mcq({
          prompt: B(
            'A page renders twenty user cards. The query log shows four statements, all batched correctly:' + code(
              'SELECT ... FROM "users"    LIMIT $1                        -- 20 users\n' +
              'SELECT ... FROM "posts"    WHERE "author_id" IN ($1…$20)   -- 200 posts\n' +
              'SELECT ... FROM "comments" WHERE "post_id"  IN ($1…$200)   -- 4,182 comments\n' +
              'SELECT ... FROM "users"    WHERE "id"       IN ($1…$1204)  -- 1,204 authors\n\n' +
              '4 queries · 1,284 ms · 5,606 rows transferred',
            ) + 'What is the diagnosis?',
            'Một trang hiển thị hai mươi thẻ người dùng. Log truy vấn cho thấy bốn câu lệnh, đều gộp lô đúng cách:' + code(
              'SELECT ... FROM "users"    LIMIT $1                        -- 20 người dùng\n' +
              'SELECT ... FROM "posts"    WHERE "author_id" IN ($1…$20)   -- 200 bài viết\n' +
              'SELECT ... FROM "comments" WHERE "post_id"  IN ($1…$200)   -- 4.182 bình luận\n' +
              'SELECT ... FROM "users"    WHERE "id"       IN ($1…$1204)  -- 1.204 tác giả\n\n' +
              '4 truy vấn · 1.284 ms · 5.606 hàng được chuyển',
            ) + 'Chẩn đoán là gì?',
          ),
          options: [
            B(
              'It IS an N+1 in disguise: the fourth statement re-queries <code>users</code>, so the relation loader looped back on itself and the fix is to remove the nested <code>author</code> include',
              'Đây LÀ một N+1 nguỵ trang: câu lệnh thứ tư truy vấn lại <code>users</code>, tức bộ nạp quan hệ đã vòng ngược lại chính nó, và cách vá là bỏ phần include <code>author</code> lồng bên trong',
            ),
            B(
              'The problem is the <code>IN</code> lists: 1,204 bind parameters exceeds what PostgreSQL can plan efficiently, and chunking the ids into groups of 100 is the fix',
              'Vấn đề nằm ở các danh sách <code>IN</code>: 1.204 tham số ràng buộc vượt quá khả năng lập kế hoạch hiệu quả của PostgreSQL, và chia nhỏ các id thành nhóm 100 là cách vá',
            ),
            B(
              'Four queries is already optimal; 1,284 ms means an index is missing on one of them, and the ranking table will say which',
              'Bốn truy vấn đã là tối ưu; 1.284 ms nghĩa là một trong số đó thiếu chỉ mục, và bảng xếp hạng sẽ chỉ ra cái nào',
            ),
            B(
              'Not an N+1 — four statements is correct batching — and still the problem: each nesting level multiplies the row count, so the answer is to ASK FOR LESS (a <code>select</code> shaped like the card, <code>_count</code> instead of the comment rows, <code>take: 3</code> on the posts), not to batch harder',
              'Không phải N+1 — bốn câu lệnh là gộp lô đúng — mà vẫn là vấn đề: mỗi tầng lồng nhân số hàng lên, nên câu trả lời là XIN ÍT ĐI (một <code>select</code> nắn theo đúng cái thẻ, dùng <code>_count</code> thay cho các hàng bình luận, <code>take: 3</code> cho bài viết) chứ không phải gộp lô mạnh tay hơn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Prisma batched perfectly — one statement per relation level, each with an <code>IN</code> — and the page is still slow, because twenty users became two hundred posts became four thousand comments became twelve hundred authors. The query count says nothing about this, which is why ROWS TRANSFERRED is the third number to watch alongside queries-per-request and total query time. The rewrite is to fetch what twenty cards render: <code>select</code> the three or four columns the card shows, <code>take: 3</code> on the posts, <code>_count</code> for the comments instead of the comment rows. Measured on the same data that is 2 queries, 24 ms, 80 rows. Note also what a bigger <code>IN</code> list is NOT: a planner problem at this size. It becomes one past a few hundred ids only in the sense that a temporary table or a join is then cheaper, and PostgreSQL\'s hard cap is 65,535 bind parameters.',
            'Prisma đã gộp lô hoàn hảo — mỗi tầng quan hệ một câu lệnh, mỗi câu một mệnh đề <code>IN</code> — mà trang vẫn chậm, vì hai mươi người dùng thành hai trăm bài viết thành bốn nghìn bình luận thành một nghìn hai trăm tác giả. Số truy vấn chẳng nói gì về chuyện đó, và vì thế SỐ HÀNG ĐƯỢC CHUYỂN là con số thứ ba cần theo dõi bên cạnh số-truy-vấn-mỗi-request và tổng thời gian truy vấn. Bản viết lại là nạp đúng thứ hai mươi cái thẻ hiển thị: <code>select</code> ba bốn cột mà thẻ hiện, <code>take: 3</code> cho bài viết, <code>_count</code> cho bình luận thay vì các hàng bình luận. Đo trên cùng dữ liệu thì còn 2 truy vấn, 24 ms, 80 hàng. Cũng để ý một danh sách <code>IN</code> to hơn thì KHÔNG phải là: một vấn đề của bộ lập kế hoạch ở cỡ này. Nó chỉ thành vấn đề khi vượt vài trăm id, theo nghĩa lúc ấy một bảng tạm hay một phép nối sẽ rẻ hơn, còn trần cứng của PostgreSQL là 65.535 tham số ràng buộc.',
          ),
        }),

        mcq({
          prompt: B(
            'Two indexes over the same two columns were measured against three queries:' + code(
              'CREATE INDEX "idx_ab" ON "posts" ("author_id", "published_at");\n' +
              'CREATE INDEX "idx_ba" ON "posts" ("published_at", "author_id");',
            ) + code(
              "A  WHERE author_id = 42 ORDER BY published_at DESC   idx_ab: Index Scan 0.09 ms   idx_ba: Seq Scan 184 ms\n" +
              "B  WHERE published_at > '2026-08-01'                 idx_ab: Seq Scan  191 ms    idx_ba: Index Scan 2.1 ms\n" +
              'C  WHERE author_id = 42                              idx_ab: Index Scan 0.06 ms   idx_ba: Seq Scan 188 ms',
            ) + 'Which rule explains all three rows?',
            'Hai chỉ mục trên cùng hai cột được đo với ba truy vấn:' + code(
              'CREATE INDEX "idx_ab" ON "posts" ("author_id", "published_at");\n' +
              'CREATE INDEX "idx_ba" ON "posts" ("published_at", "author_id");',
            ) + code(
              "A  WHERE author_id = 42 ORDER BY published_at DESC   idx_ab: Index Scan 0,09 ms   idx_ba: Seq Scan 184 ms\n" +
              "B  WHERE published_at > '2026-08-01'                 idx_ab: Seq Scan  191 ms    idx_ba: Index Scan 2,1 ms\n" +
              'C  WHERE author_id = 42                              idx_ab: Index Scan 0,06 ms   idx_ba: Seq Scan 188 ms',
            ) + 'Luật nào giải thích được cả ba dòng?',
          ),
          options: [
            B(
              'PostgreSQL can only use an index whose column list exactly matches the query\'s, which is why each query works with one index and not the other',
              'PostgreSQL chỉ dùng được chỉ mục nào có danh sách cột khớp CHÍNH XÁC với truy vấn, và đó là lý do mỗi truy vấn chạy với một chỉ mục và không chạy với cái kia',
            ),
            B(
              'The two indexes are equivalent and the difference is the planner\'s statistics; running <code>ANALYZE</code> makes all six cells fast',
              'Hai chỉ mục tương đương nhau và khác biệt nằm ở thống kê của bộ lập kế hoạch; chạy <code>ANALYZE</code> là cả sáu ô đều nhanh',
            ),
            B(
              'A composite index serves its PREFIXES: <code>(a, b)</code> serves <code>a</code> and <code>(a, b)</code> but never <code>b</code> alone — so put the equality columns first, most selective first, and the range or sort column last. Row C is the prefix case, and one well-ordered composite index often replaces three single-column ones',
              'Một chỉ mục phức hợp phục vụ các TIỀN TỐ của nó: <code>(a, b)</code> phục vụ <code>a</code> và <code>(a, b)</code> nhưng không bao giờ phục vụ riêng <code>b</code> — nên hãy đặt các cột so sánh bằng lên trước, cột nào lọc mạnh nhất trước, và cột khoảng hay cột sắp xếp sau cùng. Dòng C chính là ca tiền tố, và một chỉ mục phức hợp xếp đúng thứ tự thường thay được ba chỉ mục một cột',
            ),
            B(
              'The direction is what decides it: <code>idx_ab</code> works for query A only because <code>ORDER BY … DESC</code> matches a descending index, and declaring both indexes <code>DESC</code> makes them interchangeable',
              'Chiều mới là thứ quyết định: <code>idx_ab</code> chạy được với truy vấn A chỉ vì <code>ORDER BY … DESC</code> khớp với một chỉ mục giảm dần, và khai cả hai chỉ mục là <code>DESC</code> thì chúng thay thế được cho nhau',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The prefix rule is the whole of composite index design. <code>(author_id, published_at)</code> is sorted by author first, so seeking to author 42 lands on a contiguous block already ordered by <code>published_at</code> — which serves both the filter and the sort, with no <code>Sort</code> node in the plan. <code>(published_at, author_id)</code> cannot seek to an author at all, because the leading column is unconstrained. Row C shows the corollary: a prefix of the index is enough, so you do not need a separate index on <code>author_id</code>. Two refinements. Once a RANGE appears, columns after it can only filter, not seek — so the range goes last. And direction matters for the sort, not the seek: PostgreSQL can read an index backwards, but <code>ORDER BY a ASC, b DESC</code> needs an index declared with those directions, which in Prisma is <code>@@index([authorId, publishedAt(sort: Desc)])</code> and is easy to forget.',
            'Luật tiền tố là toàn bộ nghệ thuật thiết kế chỉ mục phức hợp. <code>(author_id, published_at)</code> được sắp theo tác giả trước, nên nhảy tới tác giả 42 là rơi vào một khối liền mạch vốn đã sắp theo <code>published_at</code> — phục vụ được cả bộ lọc lẫn phép sắp, và trong kế hoạch không có nút <code>Sort</code> nào. <code>(published_at, author_id)</code> thì hoàn toàn không nhảy tới một tác giả được, vì cột dẫn đầu không bị ràng buộc. Dòng C cho thấy hệ quả: một TIỀN TỐ của chỉ mục là đủ, nên bạn không cần thêm một chỉ mục riêng trên <code>author_id</code>. Hai điểm tinh chỉnh. Một khi đã xuất hiện một KHOẢNG thì các cột đứng sau nó chỉ lọc được chứ không nhảy được — nên cột khoảng đi sau cùng. Và chiều thì quan trọng với phép SẮP chứ không phải phép nhảy: PostgreSQL đọc ngược một chỉ mục được, nhưng <code>ORDER BY a ASC, b DESC</code> cần một chỉ mục khai đúng hai chiều ấy, mà trong Prisma là <code>@@index([authorId, publishedAt(sort: Desc)])</code> và rất dễ quên.',
          ),
        }),

        mcq({
          prompt: B(
            'A hot list page selects three columns. Two plans were captured, before and after one index change:' + code(
              'await prisma.post.findMany({\n' +
              '  where:  { authorId: 42, published: true },\n' +
              '  select: { id: true, title: true, publishedAt: true },\n' +
              '  take:   20,\n' +
              '});',
            ) + code(
              'before:  Index Scan using posts_tac_gia_dang on posts (rows=20)\n' +
              '           Buffers: shared hit=24\n\n' +
              'after:   Index Only Scan using posts_bang_liet_ke on posts (rows=20)\n' +
              '           Heap Fetches: 0\n' +
              '           Buffers: shared hit=4',
            ) + 'What changed, and what does it cost?',
            'Một trang danh sách chạy nhiều chọn ba cột. Hai kế hoạch được ghi lại, trước và sau đúng một thay đổi về chỉ mục:' + code(
              'await prisma.post.findMany({\n' +
              '  where:  { authorId: 42, published: true },\n' +
              '  select: { id: true, title: true, publishedAt: true },\n' +
              '  take:   20,\n' +
              '});',
            ) + code(
              'trước:  Index Scan using posts_tac_gia_dang on posts (rows=20)\n' +
              '          Buffers: shared hit=24\n\n' +
              'sau:    Index Only Scan using posts_bang_liet_ke on posts (rows=20)\n' +
              '          Heap Fetches: 0\n' +
              '          Buffers: shared hit=4',
            ) + 'Cái gì đã đổi, và nó tốn gì?',
          ),
          options: [
            B(
              'The <code>select</code> was narrowed so fewer columns are read from the table; the index is unchanged and the cost is nothing',
              'Phần <code>select</code> đã được thu hẹp nên bảng phải đọc ít cột hơn; chỉ mục không đổi và chẳng tốn gì cả',
            ),
            B(
              'The table was vacuumed, so the visibility map became current — <code>Heap Fetches: 0</code> is purely a vacuum effect and no index change was involved',
              'Bảng vừa được vacuum nên bản đồ hiển thị đã cập nhật — <code>Heap Fetches: 0</code> thuần tuý là hiệu ứng của vacuum và không có thay đổi chỉ mục nào',
            ),
            B(
              'An <code>INCLUDE ("id", "title")</code> was added, so everything the query needs lives in the index and the table pages are never read — the cost is a larger index and slower writes, and <code>Heap Fetches</code> only stays at zero while the visibility map is current',
              'Một mệnh đề <code>INCLUDE ("id", "title")</code> đã được thêm vào, nên mọi thứ truy vấn cần đều nằm trong chỉ mục và các trang của bảng không bao giờ bị đọc — cái giá là một chỉ mục lớn hơn và ghi chậm hơn, còn <code>Heap Fetches</code> chỉ giữ được ở mức không chừng nào bản đồ hiển thị còn cập nhật',
            ),
            B(
              'The index was rebuilt <code>CONCURRENTLY</code>, which is what turns an <code>Index Scan</code> into an <code>Index Only Scan</code> by removing the bloat that forced heap lookups',
              'Chỉ mục được dựng lại bằng <code>CONCURRENTLY</code>, và đó là thứ biến một <code>Index Scan</code> thành <code>Index Only Scan</code> bằng cách gỡ bỏ phần phình làm phải tra cứu vào heap',
            ),
          ],
          correct: 2,
          explanation: EX(
            'An ordinary <code>Index Scan</code> finds twenty index entries and then reads twenty table rows to get the columns the index does not carry — that is the 24 buffers. <code>INCLUDE</code> puts extra columns in the index leaf pages WITHOUT making them part of the key, so the index can answer the whole query and the heap is never touched. <code>Heap Fetches: 0</code> is the line that proves it, and it is as fast as a read gets. Two honest caveats. The index is bigger and every write maintains it, so this is for a query that runs constantly on a hot page and not a general habit. And <code>Heap Fetches</code> creeps above zero on a heavily written table that autovacuum cannot keep up with, because the visibility map goes stale — so the plan quietly degrades back to the "before" shape without anything changing in your code.',
            'Một <code>Index Scan</code> thường tìm ra hai mươi mục trong chỉ mục rồi đọc thêm hai mươi hàng của bảng để lấy những cột mà chỉ mục không mang theo — đó chính là 24 buffer. <code>INCLUDE</code> nhét thêm cột vào các trang lá của chỉ mục MÀ KHÔNG đưa chúng vào khoá, nên chỉ mục trả lời được trọn truy vấn và heap không bị đụng tới. <code>Heap Fetches: 0</code> là dòng chứng minh điều đó, và nhanh cỡ đó là hết mức của một phép đọc. Hai điều thành thật cần nói. Chỉ mục to hơn và mọi phép ghi đều phải duy trì nó, nên đây là dành cho một truy vấn chạy liên tục trên một trang nóng chứ không phải một thói quen chung. Và <code>Heap Fetches</code> sẽ bò lên trên không ở một bảng ghi nhiều mà autovacuum theo không kịp, vì bản đồ hiển thị cũ đi — thế là kế hoạch lặng lẽ tụt về hình dạng "trước" mà mã của bạn chẳng đổi gì.',
          ),
        }),

        mcq({
          prompt: B(
            'This query is run against production:' + code(
              'SELECT s.relname, s.indexrelname, s.idx_scan, pg_size_pretty(pg_relation_size(s.indexrelid))\n' +
              'FROM pg_stat_user_indexes s JOIN pg_index i ON i.indexrelid = s.indexrelid\n' +
              'WHERE s.idx_scan < 50 AND NOT i.indisunique AND NOT i.indisprimary\n' +
              'ORDER BY pg_relation_size(s.indexrelid) DESC;',
            ) + code(
              ' posts         | posts_views_idx         |  0 | 84 MB\n' +
              ' comments      | comments_created_at_idx |  3 | 41 MB',
            ) + 'What should you check before acting, and why does an unused index matter?',
            'Truy vấn sau được chạy trên production:' + code(
              'SELECT s.relname, s.indexrelname, s.idx_scan, pg_size_pretty(pg_relation_size(s.indexrelid))\n' +
              'FROM pg_stat_user_indexes s JOIN pg_index i ON i.indexrelid = s.indexrelid\n' +
              'WHERE s.idx_scan < 50 AND NOT i.indisunique AND NOT i.indisprimary\n' +
              'ORDER BY pg_relation_size(s.indexrelid) DESC;',
            ) + code(
              ' posts         | posts_views_idx         |  0 | 84 MB\n' +
              ' comments      | comments_created_at_idx |  3 | 41 MB',
            ) + 'Cần kiểm gì trước khi hành động, và một chỉ mục không ai dùng thì có gì đáng nói?',
          ),
          options: [
            B(
              'Check <code>stats_reset</code> first — a zero count over two hours means nothing and over two months is conclusive. An unused index costs disk, costs write throughput on every insert and update, and makes the planner consider it on every query; drop it <code>CONCURRENTLY</code> and do it in a migration, or the next <code>migrate diff</code> reports it as drift',
              'Kiểm <code>stats_reset</code> trước đã — số không sau hai giờ thì chẳng nói lên gì, sau hai tháng thì mới là kết luận. Một chỉ mục không ai dùng tốn đĩa, tốn thông lượng ghi ở mỗi lần insert và update, và bắt bộ lập kế hoạch phải cân nhắc nó ở mọi truy vấn; hãy xoá nó bằng <code>CONCURRENTLY</code> và làm việc đó trong một migration, không thì lần <code>migrate diff</code> sau sẽ báo nó là trôi dạt',
            ),
            B(
              'Check whether the columns are nullable — PostgreSQL does not index NULL rows, so a low <code>idx_scan</code> on a mostly-NULL column is expected and the index should be kept',
              'Kiểm xem các cột có cho phép null không — PostgreSQL không đánh chỉ mục các hàng NULL, nên <code>idx_scan</code> thấp trên một cột phần lớn là NULL là chuyện bình thường và nên giữ chỉ mục lại',
            ),
            B(
              'Nothing to check: an index with zero scans is dead weight in every case, and the fastest fix is <code>DROP INDEX</code> straight away so the write path stops paying for it',
              'Chẳng cần kiểm gì: một chỉ mục có số lần quét bằng không thì trong mọi trường hợp đều là gánh nặng chết, và cách vá nhanh nhất là <code>DROP INDEX</code> ngay để đường ghi thôi phải trả giá cho nó',
            ),
            B(
              'Check that the query excluded unique and primary indexes — it did not, and a unique index with zero scans is the real finding here because it means the constraint is never being tested',
              'Kiểm xem truy vấn đã loại chỉ mục unique và khoá chính chưa — nó chưa loại, và một chỉ mục unique có số lần quét bằng không mới là phát hiện thật ở đây vì nó nghĩa là ràng buộc chưa từng bị thử',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The counter is cumulative since the last statistics reset, so the first question is how long it has been counting — <code>SELECT stats_reset FROM pg_stat_database WHERE datname = current_database()</code>. Everything else follows. An index is not free: every write maintains it, it occupies disk and cache, and eighty-four megabytes of it that no query has ever touched is pure loss. That is the other half of the picture from the unindexed-foreign-key query; run both, because "which columns need an index" and "which indexes need deleting" are different questions with different answers. Note what the query deliberately excludes: unique and primary indexes exist to enforce a constraint, not to serve queries, so a unique index with zero scans is still doing its job. And drop in a migration — an index removed by hand on production is drift, and the next fresh environment gets a different query plan.',
            'Bộ đếm này tích luỹ kể từ lần reset thống kê gần nhất, nên câu hỏi đầu tiên là nó đã đếm được bao lâu rồi — <code>SELECT stats_reset FROM pg_stat_database WHERE datname = current_database()</code>. Mọi thứ khác theo sau đó. Một chỉ mục không hề miễn phí: mọi phép ghi đều phải duy trì nó, nó chiếm đĩa và chiếm cache, và tám mươi tư megabyte mà chưa truy vấn nào đụng tới là lỗ ròng. Đó là nửa còn lại của bức tranh so với truy vấn tìm khoá ngoại chưa đánh chỉ mục; hãy chạy cả hai, vì "cột nào cần chỉ mục" và "chỉ mục nào cần xoá" là hai câu hỏi khác nhau với hai câu trả lời khác nhau. Để ý thứ truy vấn cố tình loại ra: chỉ mục unique và khoá chính tồn tại để ép một ràng buộc chứ không phải để phục vụ truy vấn, nên một chỉ mục unique có số lần quét bằng không vẫn đang làm đúng việc của nó. Và hãy xoá trong một migration — một chỉ mục bị gỡ bằng tay trên production là trôi dạt, và môi trường mới dựng kế tiếp sẽ nhận một kế hoạch truy vấn khác.',
          ),
        }),

        mcq({
          prompt: B(
            'A header shows a total row count, and <code>count()</code> takes 1.2 seconds. Someone replaces it with the planner\'s estimate. This was measured on Prisma 6.19.3 against a freshly created table:' + code(
              "SELECT reltuples::bigint::int AS est FROM pg_class WHERE oid = '\"Post\"'::regclass;",
            ) + code(
              'ngay sau khi tạo bảng và chèn 2 hàng   ->  est = -1     (count() = 2)\n' +
              'sau  ANALYZE "Post"                    ->  est =  2     (count() = 2)\n' +
              'sau  khi chèn thêm 5 hàng              ->  est =  2     (count() = 7)',
            ) + 'What are the two failure modes of this trick?',
            'Một thanh tiêu đề hiển thị tổng số hàng, và <code>count()</code> mất 1,2 giây. Ai đó thay nó bằng ước lượng của bộ lập kế hoạch. Đo thật trên Prisma 6.19.3 với một bảng vừa tạo:' + code(
              "SELECT reltuples::bigint::int AS est FROM pg_class WHERE oid = '\"Post\"'::regclass;",
            ) + code(
              'ngay sau khi tạo bảng và chèn 2 hàng   ->  est = -1     (count() = 2)\n' +
              'sau  ANALYZE "Post"                    ->  est =  2     (count() = 2)\n' +
              'sau  khi chèn thêm 5 hàng              ->  est =  2     (count() = 7)',
            ) + 'Mẹo này có hai kiểu hỏng nào?',
          ),
          options: [
            B(
              'It rounds to the nearest thousand, and it counts dead tuples as well as live ones — so the number is always slightly high on a table with churn',
              'Nó làm tròn tới hàng nghìn, và nó đếm cả tuple chết lẫn tuple sống — nên con số luôn cao hơn một chút trên một bảng có nhiều biến động',
            ),
            B(
              'It requires superuser rights to read <code>pg_class</code>, and it is wrong on a partitioned table because each partition has its own row',
              'Nó cần quyền superuser để đọc <code>pg_class</code>, và nó sai trên một bảng phân mảnh vì mỗi mảnh có một hàng riêng',
            ),
            B(
              'It cannot take a <code>WHERE</code> clause, so the only failure mode is that it answers a different question — and the value itself is always current because PostgreSQL updates it on every insert',
              'Nó không nhận mệnh đề <code>WHERE</code> nào, nên kiểu hỏng duy nhất là nó trả lời một câu hỏi khác — còn bản thân giá trị thì luôn mới vì PostgreSQL cập nhật nó ở mỗi lần chèn',
            ),
            B(
              'It returns <code>-1</code> — not an estimate at all — until something has run <code>ANALYZE</code> on the table; and after that it is a SNAPSHOT that only moves when <code>ANALYZE</code> or autovacuum runs again, so it lags badly right after a bulk load',
              'Nó trả về <code>-1</code> — không phải một ước lượng gì cả — cho tới khi có thứ gì đó chạy <code>ANALYZE</code> lên bảng; và sau đó nó là một ẢNH CHỤP chỉ nhúc nhích khi <code>ANALYZE</code> hoặc autovacuum chạy lại, nên nó lệch rất xa ngay sau một lượt nạp hàng loạt',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured, and the lesson presents only the happy path. The <code>-1</code> is PostgreSQL saying "I have no idea" — it is the documented sentinel for a relation that has never been analysed, and a header rendering it says <em>-1 posts</em>. The staleness is the second half: after five inserts the estimate was still 2 while <code>count()</code> said 7, because nothing re-analysed the table. On a table with steady write traffic autovacuum keeps it within a fraction of a percent, which is why the trick is genuinely good there; after a bulk load you must run <code>ANALYZE</code> yourself. The judgement to carry: an exact <code>count()</code> with a <code>where</code> an index covers is cheap and correct, because it counts index entries; an exact count of a whole large table is always a full scan, and a human reading "1,247,891" cannot tell it from "about 1.2 million". And when the UI only needs "is there a next page", ask for <code>take: size + 1</code> and count nothing.',
            'Đo thật, và bài học chỉ trình bày đường vui. Con số <code>-1</code> là PostgreSQL nói "tôi chịu" — đó là giá trị đánh dấu được ghi trong tài liệu cho một quan hệ chưa từng được phân tích, và một thanh tiêu đề hiển thị nó sẽ ghi <em>-1 bài viết</em>. Chuyện cũ kỹ là nửa thứ hai: sau năm lần chèn, ước lượng vẫn là 2 trong khi <code>count()</code> nói 7, vì chẳng có gì phân tích lại cái bảng. Trên một bảng có lưu lượng ghi đều đặn thì autovacuum giữ nó lệch trong một phần nhỏ của một phần trăm, và đó là lý do mẹo này thật sự tốt ở đó; còn sau một lượt nạp hàng loạt thì bạn phải tự chạy <code>ANALYZE</code>. Phán đoán cần mang theo: một lời <code>count()</code> chính xác kèm một <code>where</code> có chỉ mục phủ thì rẻ và đúng, vì nó đếm các mục trong chỉ mục; còn đếm chính xác trọn một bảng lớn thì luôn là một lần quét toàn bộ, và một con người đọc "1.247.891" chẳng phân biệt nổi nó với "khoảng 1,2 triệu". Còn khi giao diện chỉ cần biết "có trang sau không" thì hãy xin <code>take: size + 1</code> và đừng đếm gì cả.',
          ),
        }),

        mcq({
          prompt: B(
            'Four slow queries are proposed for indexing. Which one WOULD an index fix?',
            'Bốn truy vấn chậm được đề xuất đánh chỉ mục. Cái nào chỉ mục CÓ vá được?',
          ),
          options: [
            B(
              '<code>where: { published: true }</code> on a table where 95% of rows are published — the planner is refusing an index it should be using',
              '<code>where: { published: true }</code> trên một bảng mà 95% số hàng đã đăng — bộ lập kế hoạch đang từ chối một chỉ mục lẽ ra phải dùng',
            ),
            B(
              '<code>skip: 200000, take: 20</code> on an ordered list — the index on the sort column exists but the plan still walks the whole table',
              '<code>skip: 200000, take: 20</code> trên một danh sách đã sắp xếp — chỉ mục trên cột sắp xếp đã có mà kế hoạch vẫn đi bộ qua cả bảng',
            ),
            B(
              '<code>where: { authorId: 42, published: true }, orderBy: { publishedAt: \'desc\' }</code> on 400,000 rows with a plan showing <code>Seq Scan</code>, <code>Rows Removed by Filter: 411798</code> and a <code>Sort</code> node',
              '<code>where: { authorId: 42, published: true }, orderBy: { publishedAt: \'desc\' }</code> trên 400.000 hàng với kế hoạch cho thấy <code>Seq Scan</code>, <code>Rows Removed by Filter: 411798</code> và một nút <code>Sort</code>',
            ),
            B(
              '<code>prisma.post.count()</code> with no filter on a 1.2M-row table — a covering index on the primary key turns it into an index-only count',
              '<code>prisma.post.count()</code> không lọc gì trên một bảng 1,2 triệu hàng — một chỉ mục phủ trên khoá chính biến nó thành một phép đếm chỉ-dùng-chỉ-mục',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Three of these are the queries no index can save, and recognising them saves you from adding indexes that cost writes and help nothing. A large <code>OFFSET</code> uses the index perfectly and still walks and discards two hundred thousand entries — it is an algorithmic problem, and the fix is a cursor. <code>COUNT(*)</code> on a whole table is always a full scan because PostgreSQL stores no row count; cache it or estimate it. And a filter matching 95% of rows is one the planner correctly refuses to use an index for, because reading 95% of a table through an index is slower than reading it directly — that is not a problem to fix. The third option is the real one, and the plan says so: <code>Rows Removed by Filter</code> in the hundreds of thousands plus a <code>Sort</code> node is exactly the signature of a missing composite index. <code>(author_id, published, published_at DESC)</code> removes both, and measured on that shape it went from 184 ms to 0.118 ms.',
            'Ba trong bốn cái này là những truy vấn không chỉ mục nào cứu nổi, và nhận ra chúng giúp bạn khỏi thêm những chỉ mục tốn phí ghi mà chẳng đỡ được gì. Một <code>OFFSET</code> lớn dùng chỉ mục hoàn hảo và vẫn đi bộ rồi vứt bỏ hai trăm nghìn mục — đó là vấn đề thuật toán, và cách vá là một con trỏ. <code>COUNT(*)</code> trọn bảng thì luôn là một lần quét toàn bộ vì PostgreSQL không lưu số hàng; hãy lưu đệm hoặc ước lượng. Còn một bộ lọc khớp 95% số hàng là thứ mà bộ lập kế hoạch từ chối dùng chỉ mục một cách ĐÚNG ĐẮN, vì đọc 95% một cái bảng thông qua chỉ mục thì chậm hơn đọc thẳng — đó không phải vấn đề cần sửa. Lựa chọn thứ ba mới là cái thật, và kế hoạch nói rõ điều đó: <code>Rows Removed by Filter</code> lên tới hàng trăm nghìn cộng thêm một nút <code>Sort</code> chính là dấu vân tay của một chỉ mục phức hợp còn thiếu. <code>(author_id, published, published_at DESC)</code> gỡ được cả hai, và đo trên đúng hình dạng ấy thì nó đi từ 184 ms xuống 0,118 ms.',
          ),
        }),

        // ── Chương 10 — SQL thô và extension ────────────────────────────
        mcq({
          prompt: B(
            'A table holds exactly two rows. This was run on Prisma 6.19.3 and the output is copied verbatim:' + code(
              'const n = await prisma.$executeRaw`SELECT id FROM "Post"`;\n' +
              "console.log(n, typeof n);",
            ) + code(
              '2 number',
            ) + 'What does that tell you about <code>$executeRaw</code>?',
            'Một bảng có đúng hai hàng. Đoạn sau chạy trên Prisma 6.19.3 và kết quả chép nguyên văn:' + code(
              'const n = await prisma.$executeRaw`SELECT id FROM "Post"`;\n' +
              "console.log(n, typeof n);",
            ) + code(
              '2 number',
            ) + 'Điều đó cho bạn biết gì về <code>$executeRaw</code>?',
          ),
          options: [
            B(
              'It returns the rows when the statement is a <code>SELECT</code> and a count otherwise, so the <code>2</code> here is the array length; indexing into the result works normally and the <code>typeof</code> is misleading because Prisma boxes the array',
              'Nó trả về các hàng khi câu lệnh là <code>SELECT</code> và trả về một con số trong các trường hợp khác, nên số <code>2</code> ở đây là độ dài mảng; truy cập theo chỉ số vào kết quả vẫn chạy bình thường và cái <code>typeof</code> gây hiểu nhầm vì Prisma bọc mảng lại',
            ),
            B(
              'It always returns <code>0</code> for a <code>SELECT</code> because a select affects no rows; the <code>2</code> here must be left over from a previous statement on the same pooled connection, which is a known reporting quirk',
              'Nó luôn trả về <code>0</code> với một câu <code>SELECT</code> vì một phép chọn không tác động hàng nào; số <code>2</code> ở đây hẳn là sót lại từ một câu lệnh trước trên cùng kết nối trong pool, một điểm kỳ quặc đã biết của phần báo cáo',
            ),
            B(
              'It refuses a <code>SELECT</code> outright and the <code>2</code> is an internal error code meaning "wrong statement kind"; the statement never reached the database and nothing was executed',
              'Nó từ chối thẳng một câu <code>SELECT</code> và số <code>2</code> là một mã lỗi nội bộ nghĩa là "sai loại câu lệnh"; câu lệnh chưa hề tới được cơ sở dữ liệu và không có gì được thực thi',
            ),
            B(
              'It returns a NUMBER, never rows — here PostgreSQL reported two rows in the command tag, so the count is 2 rather than the 0 you might expect; either way <code>SELECT</code> belongs in <code>$queryRaw</code>, and the danger is an <code>any</code> upstream turning this into a silent runtime failure instead of a type error',
              'Nó trả về một CON SỐ, không bao giờ trả về các hàng — ở đây PostgreSQL báo hai hàng trong command tag nên con số là 2 chứ không phải 0 như người ta hay tưởng; dù thế nào thì <code>SELECT</code> cũng thuộc về <code>$queryRaw</code>, và mối nguy là một chữ <code>any</code> ở đâu đó phía trên biến chuyện này thành một cú hỏng âm thầm lúc chạy thay vì một lỗi kiểu',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: two rows in the table, and <code>$executeRaw</code> returned <code>2</code>. The lesson says the value is <code>0</code> "because <code>SELECT</code> affects no rows", and that is not what PostgreSQL does — it puts the row count in the command tag for a <code>SELECT</code> too, and Prisma reports it faithfully. The trap the lesson is pointing at survives the correction and is worth keeping: the return type is <code>Promise&lt;number&gt;</code>, so you got a number where you wanted rows. TypeScript catches it the moment you index into the result; if anything upstream is <code>any</code>, it fails at runtime somewhere else entirely. The four functions divide on two axes: tagged template (safe) versus string argument (<code>Unsafe</code>), and rows (<code>$queryRaw</code>) versus affected count (<code>$executeRaw</code>).',
            'Đo thật: bảng có hai hàng, và <code>$executeRaw</code> trả về <code>2</code>. Bài học nói giá trị đó là <code>0</code> "vì <code>SELECT</code> không tác động hàng nào", mà đó không phải thứ PostgreSQL làm — nó đặt số hàng vào command tag của cả một câu <code>SELECT</code>, và Prisma báo lại đúng con số ấy. Cái bẫy mà bài học muốn chỉ ra thì vẫn còn nguyên sau khi sửa và vẫn đáng giữ: kiểu trả về là <code>Promise&lt;number&gt;</code>, nên bạn nhận một con số ở chỗ bạn muốn các hàng. TypeScript bắt được ngay khi bạn truy cập theo chỉ số vào kết quả; còn nếu có chỗ nào phía trên là <code>any</code> thì nó hỏng lúc chạy ở một nơi hoàn toàn khác. Bốn hàm chia theo hai trục: thẻ mẫu (an toàn) so với tham số chuỗi (<code>Unsafe</code>), và các hàng (<code>$queryRaw</code>) so với số hàng bị tác động (<code>$executeRaw</code>).',
          ),
        }),

        mcq({
          prompt: B(
            'Four raw statements were run on Prisma 6.19.3 and the results are copied verbatim:' + code(
              'SELECT id FROM Post LIMIT 1\n' +
              '   -> P2010: Raw query failed. Code: `42P01`.\n' +
              '      Message: `relation "post" does not exist`\n\n' +
              'SELECT id FROM "Post" LIMIT 1        -> [{"id":1}]\n' +
              'SELECT views AS viewCount   FROM "Post" LIMIT 1 -> [{"viewcount":300}]\n' +
              'SELECT views AS "viewCount" FROM "Post" LIMIT 1 -> [{"viewCount":300}]',
            ) + 'Which two conclusions follow? (choose TWO)',
            'Bốn câu lệnh thô chạy trên Prisma 6.19.3 và kết quả chép nguyên văn:' + code(
              'SELECT id FROM Post LIMIT 1\n' +
              '   -> P2010: Raw query failed. Code: `42P01`.\n' +
              '      Message: `relation "post" does not exist`\n\n' +
              'SELECT id FROM "Post" LIMIT 1        -> [{"id":1}]\n' +
              'SELECT views AS viewCount   FROM "Post" LIMIT 1 -> [{"viewcount":300}]\n' +
              'SELECT views AS "viewCount" FROM "Post" LIMIT 1 -> [{"viewCount":300}]',
            ) + 'Hai kết luận nào theo sau? (chọn HAI)',
          ),
          options: [
            B(
              'PostgreSQL folds every unquoted identifier to lower case — including an ALIAS, so the key in the returned JavaScript object is <code>viewcount</code>; quote it and it is preserved',
              'PostgreSQL gập mọi định danh không đặt trong ngoặc kép về chữ thường — kể cả một BÍ DANH, nên khoá trong object JavaScript trả về là <code>viewcount</code>; đặt ngoặc kép vào thì nó được giữ nguyên',
            ),
            B(
              'A failed raw query arrives as <code>PrismaClientKnownRequestError</code> with code <code>P2010</code>, and the PostgreSQL SQLSTATE (<code>42P01</code>) is inside the message — two layers, and the outer one is the same for every raw SQL error',
              'Một truy vấn thô hỏng thì về dưới dạng <code>PrismaClientKnownRequestError</code> mã <code>P2010</code>, còn SQLSTATE của PostgreSQL (<code>42P01</code>) nằm bên trong câu chữ — hai tầng, và tầng ngoài giống nhau với mọi lỗi SQL thô',
            ),
            B(
              'Prisma lower-cases table names when it creates them, which is why the quoted form is required and why <code>@@map</code> exists',
              'Prisma tự hạ chữ thường tên bảng lúc tạo, và đó là lý do phải dùng dạng có ngoặc kép và là lý do tồn tại <code>@@map</code>',
            ),
            B(
              'The alias case difference is a Prisma serialisation choice; the same query in <code>psql</code> returns <code>viewCount</code> in both forms',
              'Khác biệt về chữ hoa chữ thường của bí danh là một lựa chọn tuần tự hoá của Prisma; cùng truy vấn ấy chạy trong <code>psql</code> thì cả hai dạng đều trả về <code>viewCount</code>',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'Raw SQL speaks the DATABASE\'s vocabulary, and PostgreSQL case-folds anything you do not quote. Prisma creates tables with quoted, case-preserving names, so <code>FROM Post</code> looks for a table called <code>post</code> and fails — and the same rule silently changes the shape of your result when it hits an alias, which is the half people do not expect. Two habits follow: quote every identifier in raw SQL, and quote the alias when you want the field name your TypeScript is expecting (<code>SELECT avatar_url AS "avatarUrl"</code>). The error layering is worth knowing separately: <code>P2010</code> is the outer Prisma code for "the raw query failed", identical for a missing table, a syntax error and a constraint violation, so the useful information is the SQLSTATE and the message text — which is a good reason not to key application logic off <code>e.code</code> for raw queries.',
            'SQL thô nói bằng từ vựng của CƠ SỞ DỮ LIỆU, và PostgreSQL gập chữ hoa chữ thường của mọi thứ bạn không đặt trong ngoặc kép. Prisma tạo bảng với tên có ngoặc kép, giữ nguyên chữ hoa, nên <code>FROM Post</code> đi tìm một cái bảng tên <code>post</code> và không thấy — và cùng cái luật ấy âm thầm đổi hình dạng kết quả của bạn khi nó chạm vào một bí danh, đó là nửa mà người ta không ngờ tới. Hai thói quen theo sau: đặt ngoặc kép cho mọi định danh trong SQL thô, và đặt ngoặc kép cho bí danh khi bạn muốn đúng tên trường mà TypeScript đang chờ (<code>SELECT avatar_url AS "avatarUrl"</code>). Chuyện lỗi xếp hai tầng thì đáng biết riêng: <code>P2010</code> là mã Prisma ở tầng ngoài cho "truy vấn thô hỏng", giống hệt nhau dù là thiếu bảng, sai cú pháp hay vi phạm ràng buộc, nên thông tin hữu ích nằm ở SQLSTATE và câu chữ — một lý do tốt để đừng đặt logic ứng dụng lên <code>e.code</code> với các truy vấn thô.',
          ),
        }),

        mcq({
          prompt: B(
            'A listing builds its filters from optional request parameters and lets the caller choose the sort column:' + code(
              "const parts = [Prisma.sql`\"deletedAt\" IS NULL`];\n" +
              "if (q)   parts.push(Prisma.sql`content ILIKE ${'%' + q + '%'}`);\n" +
              'if (uid) parts.push(Prisma.sql`"authorId" = ${uid}`);\n\n' +
              'await prisma.$queryRaw`\n' +
              '  SELECT id, content FROM "SocialPost"\n' +
              '  WHERE ${Prisma.join(parts, \' AND \')}\n' +
              '  ORDER BY ${cot} DESC\n' +
              '  LIMIT ${gioiHan}`;',
            ) + 'Which line is the bug, and what is the fix?',
            'Một trang danh sách dựng bộ lọc từ các tham số request tuỳ chọn và cho bên gọi chọn cột sắp xếp:' + code(
              "const parts = [Prisma.sql`\"deletedAt\" IS NULL`];\n" +
              "if (q)   parts.push(Prisma.sql`content ILIKE ${'%' + q + '%'}`);\n" +
              'if (uid) parts.push(Prisma.sql`"authorId" = ${uid}`);\n\n' +
              'await prisma.$queryRaw`\n' +
              '  SELECT id, content FROM "SocialPost"\n' +
              '  WHERE ${Prisma.join(parts, \' AND \')}\n' +
              '  ORDER BY ${cot} DESC\n' +
              '  LIMIT ${gioiHan}`;',
            ) + 'Dòng nào là lỗi, và cách vá là gì?',
          ),
          options: [
            B(
              '<code>Prisma.join</code> — the separator is interpolated as SQL text, so a caller who controls it can inject; pass it through <code>Prisma.raw</code> from a whitelist',
              '<code>Prisma.join</code> — dấu ngăn được nội suy vào dưới dạng văn bản SQL, nên một bên gọi điều khiển được nó có thể tiêm mã; hãy đưa nó qua <code>Prisma.raw</code> lấy từ một danh sách trắng',
            ),
            B(
              'The <code>ILIKE</code> line — building the <code>%…%</code> wrapper in JavaScript concatenates user input into the value, which is what makes it injectable',
              'Dòng <code>ILIKE</code> — dựng phần bọc <code>%…%</code> bằng JavaScript là nối dữ liệu người dùng vào giá trị, và chính điều đó làm nó tiêm được',
            ),
            B(
              '<code>LIMIT ${gioiHan}</code> — a keyword argument cannot be parameterised, so this sends <code>LIMIT $3</code> and PostgreSQL rejects it with a syntax error',
              '<code>LIMIT ${gioiHan}</code> — một tham số đi sau từ khoá thì không tham số hoá được, nên câu này gửi đi <code>LIMIT $3</code> và PostgreSQL từ chối với một lỗi cú pháp',
            ),
            B(
              '<code>ORDER BY ${cot}</code> — an IDENTIFIER cannot be a bind parameter, so this sends <code>ORDER BY $n</code> and PostgreSQL sorts every row by a constant string: no error, and an ordering nobody asked for. Column names go through <code>Prisma.raw</code> from a whitelist, or they do not go at all',
              '<code>ORDER BY ${cot}</code> — một ĐỊNH DANH không thể là tham số ràng buộc, nên câu này gửi đi <code>ORDER BY $n</code> và PostgreSQL sắp mọi hàng theo một chuỗi hằng: không lỗi, và một thứ tự chẳng ai xin. Tên cột phải đi qua <code>Prisma.raw</code> lấy từ danh sách trắng, hoặc không đi đâu cả',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured: the emitted SQL is <code>ORDER BY $1 DESC</code>, with the column name shipped as a bind VALUE. PostgreSQL accepts it, sorts every row by the same constant, and returns rows in an order nobody chose — no error anywhere, which is why this survives review and gets reported as "the sort is just not working". Bind parameters carry values; table names, column names, <code>ASC</code>/<code>DESC</code> and anything else that is SQL grammar are text, and the only safe way in is <code>Prisma.raw</code> fed from a whitelist you wrote: <code>const cot = ({ moi: \'"createdAt"\', ten: \'"title"\' })[req.query.sort] ?? \'"createdAt"\'</code>. The rest of the snippet is correct and worth copying: <code>Prisma.sql</code> fragments carry their own parameters and <code>Prisma.join</code> renumbers them for you, so you never write <code>$1</code>, <code>$2</code> by hand; the <code>%…%</code> wrapper is part of the VALUE and stays parameterised; and <code>LIMIT</code> genuinely does accept a bind parameter.',
            'Đo thật: SQL phát ra là <code>ORDER BY $1 DESC</code>, với tên cột được gửi đi như một GIÁ TRỊ ràng buộc. PostgreSQL nhận, sắp mọi hàng theo cùng một hằng số, và trả về các hàng theo một thứ tự chẳng ai chọn — không có lỗi nào cả, và đó là lý do chuyện này sống sót qua review rồi được báo cáo là "cái sắp xếp không ăn". Tham số ràng buộc mang GIÁ TRỊ; còn tên bảng, tên cột, <code>ASC</code>/<code>DESC</code> và mọi thứ khác thuộc về ngữ pháp SQL đều là văn bản, và đường vào an toàn duy nhất là <code>Prisma.raw</code> được nuôi bằng một danh sách trắng do bạn viết: <code>const cot = ({ moi: \'"createdAt"\', ten: \'"title"\' })[req.query.sort] ?? \'"createdAt"\'</code>. Phần còn lại của đoạn mã thì đúng và đáng chép lại: các mảnh <code>Prisma.sql</code> tự mang tham số của chúng và <code>Prisma.join</code> đánh số lại giúp bạn, nên bạn không bao giờ phải tự viết <code>$1</code>, <code>$2</code>; phần bọc <code>%…%</code> là một phần của GIÁ TRỊ nên vẫn được tham số hoá; và <code>LIMIT</code> thì đúng là nhận được tham số ràng buộc.',
          ),
        }),

        mcq({
          prompt: B(
            'A migration renames <code>avatarUrl</code> to <code>anhDaiDien</code>. The build is run. Which of these two lines still compiles, and what happens at run time?' + code(
              '// A — the builder\n' +
              'const a = await prisma.user.findMany({ select: { avatarUrl: true } });\n\n' +
              '// B — raw, with a type parameter\n' +
              'const b = await prisma.$queryRaw<User[]>`SELECT id FROM users`;\n' +
              'console.log(b[0].avatarUrl);',
            ),
            'Một migration đổi tên <code>avatarUrl</code> thành <code>anhDaiDien</code>. Bản build được chạy. Trong hai dòng sau, dòng nào vẫn biên dịch được, và lúc chạy thì sao?' + code(
              '// A — trình dựng truy vấn\n' +
              'const a = await prisma.user.findMany({ select: { avatarUrl: true } });\n\n' +
              '// B — thô, kèm một tham số kiểu\n' +
              'const b = await prisma.$queryRaw<User[]>`SELECT id FROM users`;\n' +
              'console.log(b[0].avatarUrl);',
            ),
          ),
          options: [
            B(
              'A is a compile error and B compiles fine — <code>&lt;User[]&gt;</code> is an ASSERTION, never derived from the SQL, so nothing checks it at build or at run time; B returns rows with only <code>id</code> and the log prints <code>undefined</code>',
              'A là lỗi biên dịch còn B thì biên dịch ngon lành — <code>&lt;User[]&gt;</code> là một PHÉP KHẲNG ĐỊNH, không bao giờ được suy ra từ SQL, nên chẳng có gì kiểm nó lúc build hay lúc chạy; B trả về các hàng chỉ có <code>id</code> và dòng log in ra <code>undefined</code>',
            ),
            B(
              'Both are compile errors: Prisma re-reads the schema at build time and validates the SQL string in <code>$queryRaw</code> against it',
              'Cả hai đều là lỗi biên dịch: Prisma đọc lại lược đồ lúc build và đối chiếu chuỗi SQL trong <code>$queryRaw</code> với nó',
            ),
            B(
              'Both compile: the builder accepts an unknown field name and reports it at run time as <code>P2009</code>, which is the symmetric behaviour to the raw case',
              'Cả hai đều biên dịch được: trình dựng truy vấn nhận một tên trường lạ rồi báo lúc chạy bằng <code>P2009</code>, đối xứng với trường hợp thô',
            ),
            B(
              'A compiles and B is a compile error, because <code>$queryRaw</code> narrows <code>User</code> to the columns named in the <code>SELECT</code>',
              'A biên dịch được còn B là lỗi biên dịch, vì <code>$queryRaw</code> thu hẹp <code>User</code> về đúng những cột được nêu trong <code>SELECT</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The builder derives its return type from the argument you passed, so a renamed column turns every one of those call sites red on the next build — that is the whole value proposition of the tool, and it works. The raw path has no such mechanism: the signature is <code>$queryRaw&lt;T = unknown&gt;(...)</code>, and <code>T</code> is whatever you typed. The compiler cannot read the string, so it believes you, and the drift lands in production as <code>undefined</code> on a field the type promised. Two fixes. Validate at the boundary with a schema — one <code>z.object</code> per raw query, which converts a stack trace at <code>res.json</code> into a named-column error at the query. Or use TypedSQL: a <code>.sql</code> file that Prisma reads at generate time and derives the type from the real database, which is the only version where the raw path gets the same guarantee as the builder. The judgement worth adopting: if the shape appears in a function\'s return type, validate it; if it dies inside the function that made the query, a cast is honest enough.',
            'Trình dựng truy vấn suy ra kiểu trả về từ chính tham số bạn truyền vào, nên một cột bị đổi tên sẽ làm mọi chỗ gọi như thế đỏ lên ở lần build kế tiếp — đó là toàn bộ giá trị công cụ này hứa hẹn, và nó hoạt động. Đường thô thì không có cơ chế nào như thế: chữ ký hàm là <code>$queryRaw&lt;T = unknown&gt;(...)</code>, và <code>T</code> là bất cứ thứ gì bạn gõ vào. Trình biên dịch không đọc được cái chuỗi nên nó tin bạn, và sự trôi dạt hạ cánh xuống production dưới dạng <code>undefined</code> ở một trường mà cái kiểu đã hứa. Hai cách vá. Kiểm ở biên bằng một lược đồ — mỗi truy vấn thô một <code>z.object</code>, thứ biến một vết ngăn xếp ở <code>res.json</code> thành một lỗi gọi đúng tên cột ngay tại truy vấn. Hoặc dùng TypedSQL: một tệp <code>.sql</code> mà Prisma đọc lúc generate rồi suy ra kiểu từ chính cơ sở dữ liệu thật — bản duy nhất mà đường thô có được cùng một bảo đảm như trình dựng. Phán đoán đáng theo: nếu hình dạng ấy xuất hiện trong KIỂU TRẢ VỀ của một hàm thì hãy kiểm nó; còn nếu nó chết ngay bên trong hàm đã tạo ra truy vấn thì một phép ép kiểu là đủ thành thật.',
          ),
        }),

        mcq({
          prompt: B(
            'A reporting query reads a <code>numeric(12,2)</code> price and a <code>count(*)</code> through <code>$queryRaw</code>. Which pair of fixes belongs in the SQL rather than in JavaScript?' + code(
              'const rows = await prisma.$queryRaw`\n' +
              '  SELECT "authorId", count(*) AS so_bai, sum(price) AS tong\n' +
              '  FROM "Order" GROUP BY "authorId"`;\n' +
              'res.json(rows);',
            ),
            'Một truy vấn báo cáo đọc một cột giá <code>numeric(12,2)</code> và một <code>count(*)</code> qua <code>$queryRaw</code>. Cặp cách vá nào thuộc về SQL chứ không thuộc về JavaScript?' + code(
              'const rows = await prisma.$queryRaw`\n' +
              '  SELECT "authorId", count(*) AS so_bai, sum(price) AS tong\n' +
              '  FROM "Order" GROUP BY "authorId"`;\n' +
              'res.json(rows);',
            ),
          ),
          options: [
            B(
              'Wrap both in <code>::text</code> so the client receives strings, which is the only representation <code>JSON.stringify</code> handles for either type',
              'Bọc cả hai bằng <code>::text</code> để client nhận về chuỗi, dạng biểu diễn duy nhất mà <code>JSON.stringify</code> xử lý được với cả hai kiểu',
            ),
            B(
              'Neither needs a fix in SQL: Prisma converts <code>bigint</code> to <code>number</code> and <code>Decimal</code> to <code>number</code> on the way out of a raw query, exactly as it does for the builder',
              'Chẳng cái nào cần vá trong SQL: Prisma chuyển <code>bigint</code> thành <code>number</code> và <code>Decimal</code> thành <code>number</code> khi đi ra khỏi một truy vấn thô, y hệt như với trình dựng truy vấn',
            ),
            B(
              'Add <code>::float8</code> to both — floating point is the correct representation for money in a report, and it removes the BigInt problem at the same time',
              'Thêm <code>::float8</code> vào cả hai — dấu phẩy động là cách biểu diễn đúng cho tiền trong một báo cáo, và nó xoá luôn vấn đề BigInt cùng lúc',
            ),
            B(
              'Cast the count with <code>count(*)::int</code> — otherwise it is a JavaScript <code>bigint</code> and <code>res.json</code> throws <em>Do not know how to serialize a BigInt</em> — and convert the sum explicitly, because a <code>Decimal</code> plus a number is a silent STRING concatenation rather than arithmetic',
              'Ép kiểu con số đếm bằng <code>count(*)::int</code> — không thì nó là một <code>bigint</code> của JavaScript và <code>res.json</code> ném <em>Do not know how to serialize a BigInt</em> — và chuyển đổi tường minh phần tổng, vì một <code>Decimal</code> cộng một số là một phép NỐI CHUỖI âm thầm chứ không phải phép cộng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured on 6.19.3: <code>count(*)</code> comes back as <code>typeof \'bigint\'</code> and <code>count(*)::int</code> as <code>typeof \'number\'</code>. The BigInt one is loud — <code>JSON.stringify</code> throws — and the Decimal one is silent, which makes it the expensive half: <code>row.price + 100</code> is a string concatenation because JavaScript falls back to string when either side is an object, so <code>249000 + 100</code> becomes <code>\'249000100\'</code>, a plausible number wrong by a factor of a thousand, and it reaches an invoice before anyone notices. Decimal arithmetic uses methods: <code>.plus()</code>, <code>.times()</code>, <code>.toFixed(2)</code>. Cast in SQL rather than converting in JavaScript for the same reason you set a default in the schema rather than at every call site: <code>Number(row.so_bai)</code> works and must be repeated everywhere, and will be forgotten at exactly one place. <code>::float8</code> is the wrong fix for money — it reintroduces the binary-floating-point error the <code>numeric</code> column existed to avoid.',
            'Đo trên 6.19.3: <code>count(*)</code> về với <code>typeof \'bigint\'</code> còn <code>count(*)::int</code> về với <code>typeof \'number\'</code>. Cái BigInt thì ồn ào — <code>JSON.stringify</code> ném lỗi — còn cái Decimal thì im lặng, và chính vì thế nó là nửa tốn kém: <code>row.price + 100</code> là một phép nối chuỗi vì JavaScript rơi về chuỗi khi một trong hai vế là object, nên <code>249000 + 100</code> thành <code>\'249000100\'</code> — một con số trông hợp lý mà sai gấp một nghìn lần, và nó tới được hoá đơn trước khi có ai nhận ra. Số học của Decimal dùng phương thức: <code>.plus()</code>, <code>.times()</code>, <code>.toFixed(2)</code>. Hãy ép kiểu trong SQL thay vì chuyển đổi trong JavaScript, cùng lý do bạn đặt mặc định trong lược đồ thay vì ở từng chỗ gọi: <code>Number(row.so_bai)</code> chạy được nhưng phải lặp lại ở khắp nơi, và sẽ bị quên ở đúng một chỗ. <code>::float8</code> là cách vá sai cho tiền — nó mang trả lại đúng cái sai số dấu phẩy động nhị phân mà cột <code>numeric</code> sinh ra để tránh.',
          ),
        }),

        mcq({
          prompt: B(
            '"The three most recent posts of each of these fifty authors." Which is right, and why?',
            '"Ba bài viết mới nhất của mỗi người trong năm mươi tác giả này." Cách nào đúng, và vì sao?',
          ),
          options: [
            B(
              '<code>findMany({ where: { authorId: { in: ids } }, take: 150, orderBy: { publishedAt: \'desc\' } })</code> — 150 rows is exactly what is needed, in one query',
              '<code>findMany({ where: { authorId: { in: ids } }, take: 150, orderBy: { publishedAt: \'desc\' } })</code> — 150 hàng đúng bằng thứ cần, trong một truy vấn',
            ),
            B(
              '<code>include: { posts: { take: 3, orderBy: … } }</code> on the fifty authors — the nested <code>take</code> is applied per parent, which is exactly the requirement, and Prisma batches it into one statement',
              '<code>include: { posts: { take: 3, orderBy: … } }</code> trên năm mươi tác giả — <code>take</code> lồng bên trong được áp cho từng cha, đúng y yêu cầu, và Prisma gộp nó thành một câu lệnh',
            ),
            B(
              'A <code>CROSS JOIN LATERAL</code> in <code>$queryRaw</code>: the subquery is evaluated per outer row and can reference its columns, so it is "for each author, the top 3" in ONE statement — and it still needs <code>@@index([authorId, publishedAt(sort: Desc)])</code> or each iteration sorts that author\'s whole history',
              'Một <code>CROSS JOIN LATERAL</code> trong <code>$queryRaw</code>: truy vấn con được tính cho từng hàng ngoài và tham chiếu được các cột của nó, nên nó chính là "với mỗi tác giả, lấy 3 bài đầu" trong MỘT câu lệnh — và nó vẫn cần <code>@@index([authorId, publishedAt(sort: Desc)])</code>, không thì mỗi vòng lặp lại sắp toàn bộ lịch sử của tác giả ấy',
            ),
            B(
              '<code>groupBy({ by: [\'authorId\'], take: 3 })</code> — grouping by author and taking three per group is what <code>take</code> means inside a <code>groupBy</code>',
              '<code>groupBy({ by: [\'authorId\'], take: 3 })</code> — gom nhóm theo tác giả rồi lấy ba cái mỗi nhóm chính là ý nghĩa của <code>take</code> bên trong một <code>groupBy</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Top-N per group is the query the builder genuinely cannot express. Option one returns the 150 most recent posts overall — one prolific author can supply all of them. Option two is closer and is the fan-out from chapter 9: a nested <code>take</code> IS applied per parent, but the engine does it by fetching and truncating rather than by pushing a limit down, so the database still does the per-author work without the per-author <code>LIMIT</code>, and measured against the raw version it was 51 statements and 288 ms versus 1 statement and 11.4 ms. <code>groupBy</code> has no <code>take</code>-per-group at all. <code>LATERAL</code> is the construct for this: an ordinary subquery in <code>FROM</code> is evaluated once, a lateral one is evaluated per outer row and can see its columns. Note that the loop did not disappear — it moved INSIDE the database, onto the same page cache, with no network hop or plan lookup per iteration. Loops are not the problem; loops across a network are. The alternative, <code>row_number() OVER (PARTITION BY …)</code> filtered to <code>rn &lt;= 3</code>, is correct and usually slower here because it ranks every row before discarding.',
            'Top-N mỗi nhóm là truy vấn mà trình dựng thật sự không diễn đạt nổi. Lựa chọn một trả về 150 bài mới nhất TÍNH CHUNG — một tác giả viết khoẻ có thể chiếm trọn. Lựa chọn hai gần hơn và chính là hiện tượng xoè quạt ở chương 9: một <code>take</code> lồng bên trong ĐÚNG là được áp cho từng cha, nhưng engine làm việc đó bằng cách nạp về rồi cắt bớt chứ không đẩy một giới hạn xuống dưới, nên cơ sở dữ liệu vẫn phải làm phần việc theo từng tác giả mà không có <code>LIMIT</code> theo từng tác giả — đo với bản thô thì là 51 câu lệnh và 288 ms so với 1 câu lệnh và 11,4 ms. <code>groupBy</code> thì hoàn toàn không có <code>take</code>-mỗi-nhóm. <code>LATERAL</code> mới là cấu trúc dành cho việc này: một truy vấn con thường trong <code>FROM</code> được tính một lần, còn một truy vấn con lateral thì được tính cho từng hàng ngoài và nhìn thấy các cột của nó. Để ý là cái vòng lặp không biến mất — nó CHUYỂN VÀO trong cơ sở dữ liệu, trên cùng một page cache, không có lượt đi về qua mạng và không phải tra kế hoạch ở mỗi vòng. Vòng lặp không phải vấn đề; vòng lặp XUYÊN QUA MẠNG mới là vấn đề. Lựa chọn thay thế, <code>row_number() OVER (PARTITION BY …)</code> lọc theo <code>rn &lt;= 3</code>, thì đúng nhưng thường chậm hơn ở đây vì nó xếp hạng mọi hàng rồi mới vứt bớt.',
          ),
        }),

        mcq({
          prompt: B(
            'A comment tree is fetched with a recursive CTE. Two lines are described as the defence. Which describes them correctly?' + code(
              'WITH RECURSIVE tree AS (\n' +
              '  SELECT id, content, "parentId", 0 AS do_sau, ARRAY[id] AS path\n' +
              '  FROM "Comment" WHERE "postId" = $1 AND "parentId" IS NULL\n' +
              '  UNION ALL\n' +
              '  SELECT c.id, c.content, c."parentId", tree.do_sau + 1, tree.path || c.id\n' +
              '  FROM "Comment" c JOIN tree ON c."parentId" = tree.id\n' +
              '  WHERE tree.do_sau < 10 AND NOT c.id = ANY(tree.path)\n' +
              ')\n' +
              'SELECT * FROM tree ORDER BY path;',
            ),
            'Một cây bình luận được nạp bằng một CTE đệ quy. Hai dòng được mô tả là lớp phòng thủ. Mô tả nào ĐÚNG?' + code(
              'WITH RECURSIVE tree AS (\n' +
              '  SELECT id, content, "parentId", 0 AS do_sau, ARRAY[id] AS path\n' +
              '  FROM "Comment" WHERE "postId" = $1 AND "parentId" IS NULL\n' +
              '  UNION ALL\n' +
              '  SELECT c.id, c.content, c."parentId", tree.do_sau + 1, tree.path || c.id\n' +
              '  FROM "Comment" c JOIN tree ON c."parentId" = tree.id\n' +
              '  WHERE tree.do_sau < 10 AND NOT c.id = ANY(tree.path)\n' +
              ')\n' +
              'SELECT * FROM tree ORDER BY path;',
            ),
          ),
          options: [
            B(
              '<code>do_sau &lt; 10</code> is the hard stop that BOUNDS the damage from a cycle, and <code>NOT c.id = ANY(path)</code> makes a cycle TERMINATE rather than merely time out; <code>ORDER BY path</code> then returns the rows already in display order and <code>do_sau</code> gives the indentation for free',
              '<code>do_sau &lt; 10</code> là cái chốt cứng GIỚI HẠN thiệt hại từ một vòng lặp, còn <code>NOT c.id = ANY(path)</code> làm cho một vòng lặp DỪNG HẲN chứ không chỉ là hết giờ; rồi <code>ORDER BY path</code> trả các hàng về đúng thứ tự hiển thị và <code>do_sau</code> cho bạn mức thụt lề miễn phí',
            ),
            B(
              'Both lines are performance tuning only — a recursive CTE cannot loop forever, because <code>UNION ALL</code> stops when the recursive term produces no new rows',
              'Cả hai dòng chỉ là tinh chỉnh hiệu năng — một CTE đệ quy không thể lặp mãi được, vì <code>UNION ALL</code> dừng lại khi phần đệ quy không sinh ra hàng mới nào nữa',
            ),
            B(
              '<code>ARRAY[id]</code> and the <code>||</code> concatenation are what make the query recursive; removing them turns it into an ordinary CTE that returns only the top level',
              '<code>ARRAY[id]</code> và phép nối <code>||</code> mới là thứ làm cho truy vấn thành đệ quy; bỏ chúng đi thì nó thành một CTE thường và chỉ trả về tầng trên cùng',
            ),
            B(
              'The depth bound is required by PostgreSQL — a <code>WITH RECURSIVE</code> without one is a syntax error, and the path array is the optional half',
              'Chốt độ sâu là bắt buộc với PostgreSQL — một <code>WITH RECURSIVE</code> mà thiếu nó là lỗi cú pháp, còn mảng path mới là phần tuỳ chọn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A recursive CTE with no guard runs until the connection dies or the disk fills with temp files, and it takes exactly one row whose <code>parentId</code> points at its own descendant — a bug, a bad import, a merge that went wrong. <code>UNION ALL</code> does not save you: it stops when the recursive term produces no NEW rows, and a cycle produces new rows forever. The two defences are different: the depth bound caps the work unconditionally, while the path check detects that you have already visited a node and stops that branch, which is why it terminates rather than merely times out. Both cost almost nothing, and the path array pays for itself twice more — <code>ORDER BY path</code> is the display order, so the client renders without sorting, and <code>do_sau</code> is the indentation. This is also the answer to the limit of nested <code>include</code>: each level is one more hand-written level and one more statement, and the level after your last one is silently missing with no error at all.',
            'Một CTE đệ quy không có chốt sẽ chạy tới khi kết nối chết hoặc đĩa đầy tệp tạm, và chỉ cần đúng một hàng có <code>parentId</code> trỏ vào con cháu của chính nó — một lỗi, một lượt nhập hỏng, một lần gộp sai. <code>UNION ALL</code> không cứu bạn: nó dừng khi phần đệ quy không sinh ra hàng MỚI, mà một vòng lặp thì sinh hàng mới mãi mãi. Hai lớp phòng thủ khác nhau: chốt độ sâu chặn khối lượng công việc một cách vô điều kiện, còn phép kiểm path phát hiện rằng bạn đã ghé nút đó rồi và dừng nhánh ấy lại — vì thế nó DỪNG HẲN chứ không chỉ hết giờ. Cả hai gần như chẳng tốn gì, và mảng path còn tự trả công hai lần nữa: <code>ORDER BY path</code> chính là thứ tự hiển thị nên client vẽ ra mà không cần sắp lại, và <code>do_sau</code> là mức thụt lề. Đây cũng là lời đáp cho giới hạn của <code>include</code> lồng nhau: mỗi tầng là một tầng viết tay và một câu lệnh nữa, còn tầng ngay sau tầng cuối cùng của bạn thì âm thầm biến mất, không lỗi nào cả.',
          ),
        }),

        mcq({
          prompt: B(
            'A nightly job merges 4,096 daily-stat rows. Which statement is true about the two implementations?' + code(
              '// A — a loop of upserts\n' +
              'for (const r of rows) await prisma.dailyStat.upsert({\n' +
              '  where: { uk_ngay: { key: r.key, day: r.day } },\n' +
              '  create: r, update: { count: { increment: r.count } },\n' +
              '});',
            ) + code(
              '-- B — one statement\n' +
              'INSERT INTO "DailyStat" (key, day, count, updated_at)\n' +
              'SELECT * FROM unnest($1::text[], $2::date[], $3::int[], $4::timestamptz[])\n' +
              'ON CONFLICT (key, day) DO UPDATE\n' +
              '  SET count = "DailyStat".count + EXCLUDED.count,\n' +
              '      updated_at = GREATEST("DailyStat".updated_at, EXCLUDED.updated_at)\n' +
              '  WHERE EXCLUDED.updated_at > "DailyStat".updated_at;',
            ),
            'Một job ban đêm gộp 4.096 hàng thống kê ngày. Phát biểu nào ĐÚNG về hai cách cài đặt?' + code(
              '// A — một vòng lặp upsert\n' +
              'for (const r of rows) await prisma.dailyStat.upsert({\n' +
              '  where: { uk_ngay: { key: r.key, day: r.day } },\n' +
              '  create: r, update: { count: { increment: r.count } },\n' +
              '});',
            ) + code(
              '-- B — một câu lệnh\n' +
              'INSERT INTO "DailyStat" (key, day, count, updated_at)\n' +
              'SELECT * FROM unnest($1::text[], $2::date[], $3::int[], $4::timestamptz[])\n' +
              'ON CONFLICT (key, day) DO UPDATE\n' +
              '  SET count = "DailyStat".count + EXCLUDED.count,\n' +
              '      updated_at = GREATEST("DailyStat".updated_at, EXCLUDED.updated_at)\n' +
              '  WHERE EXCLUDED.updated_at > "DailyStat".updated_at;',
            ),
          ),
          options: [
            B(
              'B is only a speed optimisation: <code>EXCLUDED</code> is available to Prisma\'s <code>update</code> block too, so A expresses the same merge, just 4,096 round trips slower',
              'B chỉ là một tối ưu tốc độ: <code>EXCLUDED</code> cũng dùng được trong khối <code>update</code> của Prisma, nên A diễn đạt đúng phép gộp ấy, chỉ là chậm hơn 4.096 lượt đi về',
            ),
            B(
              'A is safer because Prisma\'s <code>upsert</code> is atomic while a hand-written <code>ON CONFLICT</code> is not, so B can lose a concurrent increment — the array form of the same merge would need a <code>Serializable</code> transaction and a retry wrapper to be correct',
              'A an toàn hơn vì <code>upsert</code> của Prisma là nguyên tử còn một câu <code>ON CONFLICT</code> viết tay thì không, nên B có thể đánh mất một lần tăng chạy song song — muốn đúng thì bản gộp dạng mảng ấy phải nằm trong một giao dịch <code>Serializable</code> kèm lớp bọc thử lại',
            ),
            B(
              'B expresses two things A cannot: <code>EXCLUDED</code> lets the update read BOTH the existing row and the incoming one, and the <code>WHERE</code> on the conflict action skips the update when the incoming row is older — plus <code>unnest</code> carries 4,096 rows in four parameters, staying under the 65,535 bind-parameter cap a <code>VALUES</code> list would hit',
              'B diễn đạt được hai thứ A không làm nổi: <code>EXCLUDED</code> cho phép phần cập nhật đọc CẢ hàng đang có LẪN hàng sắp vào, và mệnh đề <code>WHERE</code> gắn vào hành động xung đột bỏ qua phép cập nhật khi hàng đến cũ hơn — thêm nữa <code>unnest</code> chở 4.096 hàng trong bốn tham số, nằm dưới trần 65.535 tham số ràng buộc mà một danh sách <code>VALUES</code> sẽ đụng phải',
            ),
            B(
              'B will fail at run time: <code>ON CONFLICT (key, day)</code> works only when the listed columns are the PRIMARY key, and a composite <code>@@unique</code> is not a valid conflict target — the fix is to make the pair the primary key of the table',
              'B sẽ hỏng lúc chạy: <code>ON CONFLICT (key, day)</code> chỉ chạy khi các cột được nêu chính là KHOÁ CHÍNH, còn một <code>@@unique</code> phức hợp không phải một đích xung đột hợp lệ — cách vá là biến cặp cột ấy thành khoá chính của bảng',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>upsert</code> can say "if it exists set it to this", and its <code>update</code> block genuinely supports <code>increment</code> — but it can only see the EXISTING row. <code>EXCLUDED</code> is the pseudo-table holding the row that would have been inserted, and reading both sides is what "merge" means: add the incoming count to the stored one, keep the later timestamp, and skip the whole update when the incoming row is stale. Last-write-wins is a choice, and the <code>WHERE</code> on the conflict action is where you override it. The <code>unnest</code> detail is the practical one: four array parameters carry four thousand rows, where a <code>VALUES</code> list of the same size would be sixteen thousand bind parameters and a large multiple of that would hit PostgreSQL\'s 65,535 cap. <code>ON CONFLICT</code> does accept any unique index as its target, and it needs one — without a matching constraint PostgreSQL raises <em>there is no unique or exclusion constraint matching the ON CONFLICT specification</em>, which at least fails loudly.',
            '<code>upsert</code> nói được "nếu đã có thì đặt thành thế này", và khối <code>update</code> của nó đúng là hỗ trợ <code>increment</code> — nhưng nó chỉ nhìn thấy hàng ĐANG CÓ. <code>EXCLUDED</code> là bảng giả chứa hàng lẽ ra đã được chèn vào, và đọc được cả hai phía chính là ý nghĩa của chữ "gộp": cộng con số đến vào con số đã lưu, giữ lại dấu thời gian muộn hơn, và bỏ qua toàn bộ phép cập nhật khi hàng đến đã cũ. "Ai ghi sau thì thắng" là một LỰA CHỌN, và mệnh đề <code>WHERE</code> gắn vào hành động xung đột là chỗ bạn ghi đè nó. Chi tiết <code>unnest</code> mới là phần thực dụng: bốn tham số mảng chở bốn nghìn hàng, trong khi một danh sách <code>VALUES</code> cùng cỡ sẽ là mười sáu nghìn tham số ràng buộc, và một bội số lớn của nó sẽ đụng trần 65.535 của PostgreSQL. <code>ON CONFLICT</code> nhận bất kỳ chỉ mục duy nhất nào làm đích, và nó CẦN một cái — không có ràng buộc khớp thì PostgreSQL ném <em>there is no unique or exclusion constraint matching the ON CONFLICT specification</em>, ít nhất cũng là hỏng to tiếng.',
          ),
        }),

        // ── Chương 11 — Đưa lên production ──────────────────────────────
        mcq({
          prompt: B(
            'A build stage is written in two different orders. One of them ships a broken image. Which, and why?' + code(
              '# order A\n' +
              'RUN npx prisma generate\n' +
              'RUN npm run build\n' +
              'RUN npm prune --omit=dev\n\n' +
              '# order B\n' +
              'RUN npm prune --omit=dev\n' +
              'RUN npx prisma generate\n' +
              'RUN npm run build',
            ),
            'Một tầng build được viết theo hai thứ tự khác nhau. Một trong hai cho ra một ảnh hỏng. Cái nào, và vì sao?' + code(
              '# thứ tự A\n' +
              'RUN npx prisma generate\n' +
              'RUN npm run build\n' +
              'RUN npm prune --omit=dev\n\n' +
              '# thứ tự B\n' +
              'RUN npm prune --omit=dev\n' +
              'RUN npx prisma generate\n' +
              'RUN npm run build',
            ),
          ),
          options: [
            B(
              'B: <code>prune</code> removes <code>prisma</code>, which is a devDependency, so <code>generate</code> then fails with <em>could not determine executable to run</em>. A works because <code>prune</code> removes PACKAGES and leaves the already-generated output in <code>node_modules/.prisma</code> alone',
              'B: <code>prune</code> gỡ mất gói <code>prisma</code> vốn là devDependency, nên <code>generate</code> sau đó chết với <em>could not determine executable to run</em>. A chạy được vì <code>prune</code> gỡ các GÓI và để yên phần đã sinh ra trong <code>node_modules/.prisma</code>',
            ),
            B(
              'A: pruning after <code>generate</code> deletes <code>node_modules/.prisma/client</code> along with the CLI, which is why the container starts with <em>@prisma/client did not initialize yet</em>',
              'A: prune sau <code>generate</code> sẽ xoá luôn <code>node_modules/.prisma/client</code> cùng với CLI, và đó là lý do container khởi động với <em>@prisma/client did not initialize yet</em>',
            ),
            B(
              'Neither: <code>prisma</code> belongs in <code>dependencies</code> for any image that runs migrations, so both orders work and the choice is purely about image size',
              'Chẳng cái nào: <code>prisma</code> thuộc về <code>dependencies</code> với bất kỳ ảnh nào có chạy migration, nên cả hai thứ tự đều chạy và việc chọn chỉ là chuyện kích thước ảnh',
            ),
            B(
              'Both: <code>npm run build</code> must come before <code>generate</code>, because the generated client is emitted into <code>dist/</code> and a later build overwrites it',
              'Cả hai: <code>npm run build</code> phải đứng trước <code>generate</code>, vì client sinh ra được phát vào <code>dist/</code> và một lần build sau sẽ ghi đè lên nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The CLI is a devDependency and the generated client is not a package — those two facts decide the order. <code>prune</code> walks <code>package.json</code> and removes what is no longer required; it does not know about <code>node_modules/.prisma/client</code>, so output that already exists survives. Get it backwards and the error appears at BUILD time, which is the good case. The more confusing version of the same mistake is running <code>migrate deploy</code> in a runtime image built with <code>--omit=dev</code>: the CLI is gone, and the message sends people to re-run generate on their laptop where everything works. Three ways out, and picking once matters more than which: keep <code>prisma</code> in <code>dependencies</code> (about 12 MB, simplest for a single-container VPS deploy), keep a separate stage that still has dev dependencies and run migrations from there, or run migrations in CI before the swap. Two places running <code>migrate deploy</code> concurrently race for the advisory lock and make the deploy log ambiguous about whether the schema is current.',
            'CLI là một devDependency còn client sinh ra thì không phải một gói — hai sự thật đó quyết định thứ tự. <code>prune</code> đọc <code>package.json</code> rồi gỡ những gì không còn cần; nó không biết gì về <code>node_modules/.prisma/client</code> nên phần đầu ra đã tồn tại thì sống sót. Làm ngược lại thì lỗi hiện ra lúc BUILD, và đó là ca dễ chịu. Bản khó hiểu hơn của cùng sai lầm này là chạy <code>migrate deploy</code> trong một ảnh runtime dựng bằng <code>--omit=dev</code>: CLI biến mất, và thông báo đẩy người ta về chạy lại generate trên máy mình, nơi mọi thứ đều ổn. Ba đường ra, và chọn một lần dứt khoát quan trọng hơn là chọn cái nào: giữ <code>prisma</code> trong <code>dependencies</code> (khoảng 12 MB, đơn giản nhất cho một lần deploy một container trên VPS), giữ một tầng riêng vẫn còn dev dependencies rồi chạy migration từ đó, hoặc chạy migration trong CI trước khi tráo. Hai chỗ cùng chạy <code>migrate deploy</code> một lúc thì tranh nhau advisory lock và làm log deploy trở nên mập mờ về việc lược đồ đã mới hay chưa.',
          ),
        }),

        mcq({
          prompt: B(
            'A deploy went green at every step and the API returned 502 in a restart loop. Which check, added to the build script, would have caught it — and why does it work?',
            'Một lần deploy xanh ở mọi bước rồi API trả 502 trong một vòng khởi động lại. Phép kiểm nào thêm vào script build sẽ bắt được nó — và vì sao nó hiệu quả?',
          ),
          options: [
            B(
              'A smoke test that curls the health endpoint after the swap and fails the deploy on a non-200 — it is the only check that exercises the real container against the real network, and every earlier step is by definition too early to see a runtime problem',
              'Một smoke test curl vào endpoint health sau khi tráo và làm hỏng lần deploy nếu không nhận 200 — đó là phép kiểm duy nhất đụng tới container thật trên mạng thật, còn mọi bước trước đó thì theo định nghĩa là quá sớm để thấy một vấn đề lúc chạy',
            ),
            B(
              'A <code>docker run</code> against the FINISHED image that does nothing but <code>new PrismaClient()</code> — constructing the client loads the engine, and the connection is lazy so it needs no database; that one command catches a libc mismatch, a missing OpenSSL, a <code>node_modules</code> layer that did not copy, and an engine pruned by an over-eager cleanup',
              'Một lệnh <code>docker run</code> trên ẢNH ĐÃ DỰNG XONG mà chỉ làm đúng một việc là <code>new PrismaClient()</code> — dựng client là nạp engine, còn kết nối thì lười nên không cần cơ sở dữ liệu nào; đúng một lệnh ấy bắt được lệch libc, thiếu OpenSSL, một tầng <code>node_modules</code> không chép sang, và một engine bị một bước dọn dẹp quá tay xoá mất',
            ),
            B(
              'Comparing the image digest before and after the push, and comparing it again with the digest the server reports after the swap — a mismatch anywhere in that chain is what indicates the wrong <code>Dockerfile</code> was used or a stale layer was reused',
              'So mã băm của ảnh trước và sau khi đẩy, rồi so tiếp với mã băm mà máy chủ báo về sau khi tráo — chỗ lệch ở bất kỳ đâu trong chuỗi đó chính là dấu hiệu đã dùng nhầm <code>Dockerfile</code> hoặc đã tái dùng một tầng cũ',
            ),
            B(
              'Running <code>npx prisma validate</code> inside the finished image — it loads the client package and reads the schema embedded in it, so it proves that the generated client is present and that the engine it points at agrees with the platform',
              'Chạy <code>npx prisma validate</code> bên trong ảnh đã dựng xong — nó nạp gói client rồi đọc lược đồ nhúng bên trong, nên nó chứng minh được rằng client sinh ra có mặt và engine mà nó trỏ tới khớp với nền tảng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Build, push and swap are all green because none of them loads the Rust engine: the registry accepts any image, and <code>docker compose up -d</code> returning success means STARTING succeeded, not running. The first <code>new PrismaClient()</code> is where the platform mismatch surfaces — <em>Error loading shared library ld-linux-x86-64.so.2</em> — and the restart policy then hides it behind a loop while the deploy log says success. Constructing the client inside the finished image reproduces exactly that moment, in about 400 ms, with no database and no network. A health-endpoint smoke test after the swap also catches it, but only after the old container is already gone; the point of a pre-push gate is to fail the deploy instead of the site. <code>prisma validate</code> reads the schema file and never touches the engine binary, so it passes on a broken image. And the specific trigger is worth naming: <code>docker build .</code> means <code>-f Dockerfile</code> whatever compose says, so a repository with <code>Dockerfile</code>, <code>Dockerfile.backend</code> and <code>frontend/Dockerfile</code> will happily build a plausible image from the wrong recipe.',
            'Build, push và tráo đều xanh vì không bước nào trong đó NẠP engine Rust: registry nhận mọi ảnh, còn <code>docker compose up -d</code> trả về thành công nghĩa là KHỞI ĐỘNG thành công chứ không phải đang chạy. Lời gọi <code>new PrismaClient()</code> đầu tiên mới là chỗ chỗ lệch nền tảng lộ ra — <em>Error loading shared library ld-linux-x86-64.so.2</em> — rồi chính sách restart giấu nó sau một vòng lặp trong khi log deploy nói thành công. Dựng client bên trong ảnh đã hoàn thiện là tái hiện đúng khoảnh khắc ấy, trong khoảng 400 ms, không cần cơ sở dữ liệu và không cần mạng. Một smoke test vào endpoint health sau khi tráo cũng bắt được, nhưng chỉ sau khi container cũ đã biến mất rồi; ý nghĩa của một chốt chặn trước khi đẩy là làm HỎNG LẦN DEPLOY thay vì làm hỏng cái web. <code>prisma validate</code> đọc tệp lược đồ và không bao giờ đụng tới engine nhị phân, nên nó xanh trên một ảnh hỏng. Và cái ngòi nổ cụ thể thì đáng gọi tên: <code>docker build .</code> nghĩa là <code>-f Dockerfile</code> bất kể compose nói gì, nên một kho có cả <code>Dockerfile</code>, <code>Dockerfile.backend</code> và <code>frontend/Dockerfile</code> sẽ vui vẻ dựng một ảnh trông rất hợp lý từ đúng cái công thức sai.',
          ),
        }),

        mcq({
          prompt: B(
            'A deploy is not atomic: for two seconds to two minutes, old containers and new containers both serve traffic. Which pair of consequences is right?',
            'Một lần deploy không phải nguyên tử: trong khoảng hai giây tới hai phút, container cũ và container mới cùng phục vụ. Cặp hệ quả nào ĐÚNG?',
          ),
          options: [
            B(
              'Swap first, then migrate — that way the new code is never surprised by an old schema, and the old code was written against the schema that is still there',
              'Tráo trước rồi mới migrate — như thế mã mới không bao giờ bị bất ngờ bởi một lược đồ cũ, còn mã cũ thì vốn được viết cho cái lược đồ vẫn đang nằm đó',
            ),
            B(
              'Migrate first, then swap, and gate the swap on <code>migrate status</code> — the window is then "old code, new schema", which is safe exactly when every migration is backward-compatible with the running code; and two things that can independently change production must never be triggered by the same event',
              'Migrate trước rồi mới tráo, và chặn bước tráo bằng <code>migrate status</code> — khi đó cửa sổ là "mã cũ, lược đồ mới", an toàn đúng khi mọi migration đều tương thích ngược với mã đang chạy; và hai thứ có thể độc lập thay đổi production thì không bao giờ được kích hoạt bởi cùng một sự kiện',
            ),
            B(
              'The window does not exist if the orchestrator is configured for a blue-green swap, so the ordering question only applies to rolling deploys',
              'Cửa sổ đó không tồn tại nếu trình điều phối được cấu hình tráo kiểu blue-green, nên câu hỏi thứ tự chỉ áp cho các lần tung bản cuốn chiếu',
            ),
            B(
              'Run the migration from the container entrypoint so it is impossible for the code and the schema to be out of step — each replica applies what it needs as it starts',
              'Hãy chạy migration từ entrypoint của container để mã và lược đồ không thể lệch nhịp — mỗi bản sao tự áp thứ nó cần lúc khởi động',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Migrate-then-swap is the right default because the resulting window — old code against a new schema — is one you can design for: make every migration additive, and old code simply ignores what it does not know about. Swap-then-migrate gives you new code querying columns that do not exist yet, which fails immediately and totally rather than on a conditional path. The entrypoint option is the worst of the three: scale to three replicas and three containers run <code>migrate deploy</code> at once, Prisma\'s advisory lock stops them corrupting each other but two of them then WAIT, and a slow migration becomes three failed health checks and a rollback. And the "same event" clause is the one this codebase learned the hard way: on 3 July 2026 two workflows both ran on every push to <code>main</code>, one swapping the container and one still applying migrations, and the feed returned 500 while the schema lagged the image. The structural fix was to make both manual-dispatch only, so deploying is a script you run rather than a side effect of pushing.',
            'Migrate-rồi-tráo là mặc định đúng vì cái cửa sổ nó tạo ra — mã cũ chạy trên lược đồ mới — là thứ bạn thiết kế được: hãy làm cho mọi migration đều là bổ sung, và mã cũ đơn giản là bỏ qua thứ nó không biết. Tráo-rồi-migrate cho bạn mã mới đi truy vấn những cột chưa tồn tại, và nó hỏng ngay lập tức và hỏng toàn bộ chứ không phải hỏng trên một nhánh có điều kiện. Lựa chọn entrypoint là tệ nhất trong ba: nhân lên ba bản sao là ba container cùng chạy <code>migrate deploy</code>, advisory lock của Prisma ngăn chúng phá nhau nhưng hai cái còn lại phải CHỜ, và một migration chậm biến thành ba lần health check trượt cộng một lần lùi bản. Còn mệnh đề "cùng một sự kiện" là điều kho mã này học bằng cách khó: ngày 03/07/2026 hai workflow cùng chạy ở mỗi lần push lên <code>main</code>, một cái tráo container còn một cái vẫn đang áp migration, và bảng tin trả 500 trong lúc lược đồ chạy sau cái ảnh. Cách vá mang tính cấu trúc là chuyển cả hai sang chỉ-chạy-tay, để việc deploy là một script bạn chạy chứ không phải một tác dụng phụ của việc push.',
          ),
        }),

        mcq({
          prompt: B(
            'A migration containing this line fails on deploy:' + code(
              'CREATE INDEX CONCURRENTLY "socialpost_author_created_idx"\n' +
              '  ON "SocialPost" ("authorId", "createdAt" DESC);',
            ) + code(
              'ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block',
            ) + 'What is going on, and what is the correct procedure on a large table?',
            'Một migration chứa dòng sau thì hỏng lúc deploy:' + code(
              'CREATE INDEX CONCURRENTLY "socialpost_author_created_idx"\n' +
              '  ON "SocialPost" ("authorId", "createdAt" DESC);',
            ) + code(
              'ERROR: CREATE INDEX CONCURRENTLY cannot run inside a transaction block',
            ) + 'Chuyện gì đang xảy ra, và quy trình đúng trên một bảng lớn là gì?',
          ),
          options: [
            B(
              'The statement needs its own migration folder — Prisma only opens a transaction for a file containing more than one statement, so splitting it into a folder of its own is the whole fix and the index still lands in migration history',
              'Câu lệnh đó cần một thư mục migration riêng — Prisma chỉ mở giao dịch cho tệp nào có nhiều hơn một câu lệnh, nên tách nó ra thành một thư mục riêng là xong, và chỉ mục vẫn vào được lịch sử migration',
            ),
            B(
              'Prisma does not support <code>CONCURRENTLY</code> at all, and it does not need to: declaring <code>@@index</code> in the schema is the equivalent, because the generator emits a concurrent build by default on PostgreSQL and a blocking one only on providers that lack it',
              'Prisma hoàn toàn không hỗ trợ <code>CONCURRENTLY</code>, và nó không cần: khai <code>@@index</code> trong lược đồ là tương đương, vì bộ sinh mã mặc định phát ra bản dựng concurrent trên PostgreSQL và chỉ phát bản chặn trên những provider không có nó',
            ),
            B(
              'Add <code>COMMIT;</code> as the first line of the file so the implicit transaction is closed before the index build starts — that is the documented way to run non-transactional DDL inside a Prisma migration, and the rest of the file then runs without a transaction too',
              'Thêm <code>COMMIT;</code> làm dòng đầu tiên của tệp để đóng giao dịch ngầm lại trước khi bắt đầu dựng chỉ mục — đó là cách được ghi trong tài liệu để chạy DDL không giao dịch bên trong một migration của Prisma, và phần còn lại của tệp khi đó cũng chạy ngoài giao dịch',
            ),
            B(
              'Prisma wraps each migration file in a transaction on PostgreSQL, and <code>CONCURRENTLY</code> cannot run inside one. On a large table: run that statement by hand against production, verify it, then add the matching migration and mark it <code>--applied</code> — a PLANNED use of <code>migrate resolve</code> written into the runbook beforehand. The index must still end up in migration history, or every fresh environment gets a different query plan',
              'Prisma bọc mỗi tệp migration trong một giao dịch trên PostgreSQL, và <code>CONCURRENTLY</code> không chạy được bên trong một giao dịch. Với bảng lớn: chạy câu lệnh đó bằng tay trên production, kiểm lại, rồi thêm migration tương ứng và đánh dấu <code>--applied</code> — một lần dùng <code>migrate resolve</code> CÓ KẾ HOẠCH, viết sẵn trong runbook. Chỉ mục ấy vẫn phải vào được lịch sử migration, không thì mọi môi trường dựng mới sẽ nhận một kế hoạch truy vấn khác',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The trade-off is between a lock and a procedure. A plain <code>CREATE INDEX</code> on a few hundred thousand rows finishes in under a second and blocks writes for that long, which below roughly a million rows is the simple honest answer and keeps the index in migration history where it belongs. On a genuinely large table it holds a write lock for the whole build — measured at 47 seconds on four million rows — and <code>CONCURRENTLY</code> is slower overall but lets writes continue. Two things must both be true afterwards: the index exists on production, and it exists in <code>prisma/migrations/</code>. An index that lives only on the server is drift, and the failure mode is the worst kind — CI, a new developer and a restored staging database each get a different plan, and the difference surfaces as "it is only slow on prod". Note the distinction from chapter 6\'s rule: auto-resolving a migration that FAILED hides a partially-applied change; marking one applied that you deliberately ran by hand, and wrote down beforehand, is the intended use.',
            'Đánh đổi ở đây là giữa một cái khoá và một quy trình. Một câu <code>CREATE INDEX</code> thường trên vài trăm nghìn hàng xong trong chưa tới một giây và chặn ghi đúng chừng ấy, mà dưới khoảng một triệu hàng thì đó là câu trả lời đơn giản và thành thật, đồng thời giữ chỉ mục nằm trong lịch sử migration đúng chỗ của nó. Trên một bảng thật sự lớn thì nó giữ khoá ghi suốt cả quá trình dựng — đo được 47 giây trên bốn triệu hàng — còn <code>CONCURRENTLY</code> thì tổng thể chậm hơn nhưng để cho việc ghi tiếp tục. Sau đó phải đúng cả hai điều: chỉ mục có trên production, và chỉ mục có trong <code>prisma/migrations/</code>. Một chỉ mục chỉ sống trên máy chủ là trôi dạt, và kiểu hỏng của nó thuộc loại tệ nhất — CI, một lập trình viên mới và một staging khôi phục từ bản sao lưu, mỗi nơi nhận một kế hoạch khác nhau, rồi khác biệt ấy lộ ra dưới dạng "chỉ chậm trên prod thôi". Để ý chỗ khác với luật ở chương 6: tự động resolve một migration ĐÃ HỎNG là giấu đi một thay đổi áp dở; còn đánh dấu đã-áp cho một thứ bạn cố ý chạy tay và đã ghi lại từ trước thì đúng là cách dùng được thiết kế sẵn.',
          ),
        }),

        mcq({
          prompt: B(
            'Two lines are added to the top of a migration that touches a busy table. What do they buy?' + code(
              "SET lock_timeout = '3s';\n" +
              "SET statement_timeout = '30s';\n\n" +
              'ALTER TABLE "SocialPost" ADD COLUMN "score" INTEGER NOT NULL DEFAULT 0;',
            ),
            'Hai dòng được thêm lên đầu một migration đụng vào một bảng đang bận. Chúng mua được gì?' + code(
              "SET lock_timeout = '3s';\n" +
              "SET statement_timeout = '30s';\n\n" +
              'ALTER TABLE "SocialPost" ADD COLUMN "score" INTEGER NOT NULL DEFAULT 0;',
            ),
          ),
          options: [
            B(
              'Nothing here — adding a column with a constant default is instant since PostgreSQL 11, so there is no lock to time out and the two lines are cargo cult',
              'Chẳng được gì ở đây — thêm một cột với mặc định hằng số là tức thì kể từ PostgreSQL 11, nên chẳng có khoá nào để hết giờ và hai dòng kia chỉ là bắt chước máy móc',
            ),
            B(
              'They cap how long the <code>ALTER</code> itself may take, which matters because a table rewrite on a large table is the part that hurts',
              'Chúng giới hạn thời gian bản thân câu <code>ALTER</code> được chạy, và điều đó quan trọng vì việc viết lại bảng trên một bảng lớn mới là phần gây đau',
            ),
            B(
              'They turn a full outage into a failed migration: the <code>ALTER</code> needs an <code>ACCESS EXCLUSIVE</code> lock, and while it WAITS for one, every query that arrives queues behind it — including plain <code>SELECT</code>s that would have been fine — so one slow report plus one "instant" migration is a stopped website',
              'Chúng biến một cú sập toàn bộ thành một migration hỏng: câu <code>ALTER</code> cần khoá <code>ACCESS EXCLUSIVE</code>, và trong lúc nó CHỜ lấy khoá thì mọi truy vấn tới sau đều xếp hàng phía sau nó — kể cả những câu <code>SELECT</code> vốn chẳng sao cả — nên một báo cáo chậm cộng một migration "tức thì" là một website đứng hình',
            ),
            B(
              'They make the migration retry automatically: <code>lock_timeout</code> raises a retryable error and Prisma re-runs the statement up to three times before giving up',
              'Chúng làm cho migration tự thử lại: <code>lock_timeout</code> ném ra một lỗi thử-lại-được và Prisma chạy lại câu lệnh tối đa ba lần trước khi bỏ cuộc',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The counter-intuitive part is that the <code>ALTER</code> is instant and still causes an outage. Adding a column with a constant default is metadata-only since PostgreSQL 11 — no table rewrite, milliseconds at any size. But it still needs <code>ACCESS EXCLUSIVE</code>, and if a long-running report is holding a weaker lock on the table, the <code>ALTER</code> waits politely — and every query that arrives after it queues behind the <code>ALTER</code>, not behind the report. Forty seconds of a slow query becomes forty seconds with no reads at all. <code>lock_timeout</code> makes the <code>ALTER</code> give up after three seconds with <em>canceling statement due to lock timeout</em>: the migration fails, the website is untouched, and you re-run it at a quiet moment. Nothing retries automatically — that is deliberate, because a retry loop against a held lock is the same outage with more steps. Worth pairing with the list of what actually rewrites a table: changing a column type, adding <code>NOT NULL</code> to an existing column, and adding a unique constraint or a foreign key, all of which scan the whole table under a lock.',
            'Chỗ phản trực giác là câu <code>ALTER</code> tức thì mà vẫn gây ra một cú sập. Thêm một cột với mặc định hằng số chỉ đụng siêu dữ liệu kể từ PostgreSQL 11 — không viết lại bảng, tính bằng mili giây với mọi cỡ. Nhưng nó vẫn cần <code>ACCESS EXCLUSIVE</code>, và nếu một báo cáo chạy lâu đang giữ một khoá yếu hơn trên bảng thì câu <code>ALTER</code> lịch sự đứng chờ — rồi mọi truy vấn tới sau nó đều xếp hàng phía sau CÂU ALTER chứ không phải phía sau cái báo cáo. Bốn mươi giây của một truy vấn chậm biến thành bốn mươi giây không đọc được gì cả. <code>lock_timeout</code> làm câu <code>ALTER</code> bỏ cuộc sau ba giây với <em>canceling statement due to lock timeout</em>: migration hỏng, website không suy suyển, và bạn chạy lại vào lúc vắng. Không có gì tự thử lại cả — điều đó là cố ý, vì một vòng thử lại đâm vào một cái khoá đang bị giữ chính là cùng cú sập ấy với nhiều bước hơn. Đáng ghép kèm danh sách những thứ THẬT SỰ viết lại bảng: đổi kiểu cột, thêm <code>NOT NULL</code> vào một cột đã có, và thêm một ràng buộc duy nhất hay một khoá ngoại — tất cả đều quét cả bảng dưới một cái khoá.',
          ),
        }),

        mcq({
          prompt: B(
            'Three scripts touch data outside the application: a seed, a data migration and a backfill. Which description matches all three?',
            'Ba loại script đụng vào dữ liệu ngoài ứng dụng: một tệp seed, một data migration và một script nạp bù. Mô tả nào khớp cả ba?',
          ),
          options: [
            B(
              'A seed must be re-runnable, so it is written with <code>upsert</code> and fixed ids; a data migration runs ONCE and must record that it ran; a backfill runs for hours, so it is batched, resumable and has a <code>--dry-run</code>',
              'Một tệp seed phải chạy lại được nên nó viết bằng <code>upsert</code> và id cố định; một data migration chạy MỘT lần và phải ghi lại rằng nó đã chạy; một script nạp bù chạy hàng giờ nên phải chia lô, nối lại được và có <code>--dry-run</code>',
            ),
            B(
              'All three belong in <code>prisma/migrations/</code> so that the history is the single record of everything that has ever touched the data',
              'Cả ba đều thuộc về <code>prisma/migrations/</code> để lịch sử là bản ghi duy nhất của mọi thứ từng đụng vào dữ liệu',
            ),
            B(
              'They differ only in size: the same script with a larger <code>take</code> is a backfill, and Prisma runs it through <code>db seed</code> in every case',
              'Chúng chỉ khác nhau về quy mô: cùng một script với <code>take</code> lớn hơn là một lần nạp bù, và Prisma chạy nó qua <code>db seed</code> trong mọi trường hợp',
            ),
            B(
              'A seed runs once at first deploy and must NOT be idempotent, because re-running it would duplicate the reference data it inserts',
              'Một tệp seed chạy một lần ở lần deploy đầu và KHÔNG được idempotent, vì chạy lại nó sẽ nhân đôi phần dữ liệu tham chiếu nó chèn vào',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Three jobs with three different lifetimes, and conflating them is how a "seed" wipes production. A seed establishes reference data and gets run again — after a reset, on a new developer\'s machine, by <code>migrate dev</code> automatically — so it must be idempotent: <code>upsert</code> with stable ids rather than <code>create</code>. A data migration is a one-off transformation whose whole risk is running twice, so it needs a record that it ran; a small one belongs in the migration SQL, where <code>_prisma_migrations</code> is that record. A backfill is a data migration too large to sit inside a deploy: it holds locks and blocks the release, so it moves to a script that processes in batches of about a thousand, can resume where it stopped, and can be run with <code>--dry-run</code> first. The split to remember is that <strong>the migration changes the SHAPE and a script moves the DATA</strong> — add the nullable column in milliseconds, fill it over an hour while the site stays up, and add the <code>NOT NULL</code> in a later migration once the script has finished.',
            'Ba việc với ba vòng đời khác nhau, và gộp chúng lại là cách một tệp "seed" xoá sạch production. Một tệp seed thiết lập dữ liệu tham chiếu và SẼ được chạy lại — sau một lần reset, trên máy một lập trình viên mới, hoặc do <code>migrate dev</code> tự chạy — nên nó phải idempotent: dùng <code>upsert</code> với id ổn định thay vì <code>create</code>. Một data migration là một phép biến đổi một lần mà toàn bộ rủi ro nằm ở việc chạy hai lần, nên nó cần một bản ghi rằng nó đã chạy; cái nhỏ thì thuộc về chính SQL của migration, nơi <code>_prisma_migrations</code> chính là bản ghi ấy. Một script nạp bù là một data migration quá lớn để nằm trong một lần deploy: nó giữ khoá và chặn bản phát hành, nên nó dời ra thành một script xử lý theo lô khoảng một nghìn, nối lại được từ chỗ dừng, và chạy được với <code>--dry-run</code> trước. Chỗ phân chia cần nhớ là <strong>migration đổi HÌNH DẠNG còn script chuyển DỮ LIỆU</strong> — thêm cột cho phép null trong vài mili giây, đổ đầy nó trong một giờ trong lúc web vẫn chạy, rồi thêm <code>NOT NULL</code> ở một migration sau khi script đã xong.',
          ),
        }),

        mcq({
          prompt: B(
            'A team reads about <code>prisma generate --no-engine</code> and considers adopting it for a long-running container on a VPS whose database is in the same datacentre. What should they conclude?' + code(
              'npx prisma generate --no-engine\n' +
              '✔ Generated Prisma Client (engine=none)\n' +
              'node_modules/.prisma/client/  ->  4.1 MB   (không còn tệp .node)',
            ),
            'Một nhóm đọc về <code>prisma generate --no-engine</code> và cân nhắc dùng nó cho một container chạy dài trên VPS, với cơ sở dữ liệu nằm cùng trung tâm dữ liệu. Họ nên kết luận gì?' + code(
              'npx prisma generate --no-engine\n' +
              '✔ Generated Prisma Client (engine=none)\n' +
              'node_modules/.prisma/client/  ->  4.1 MB   (không còn tệp .node)',
            ),
          ),
          options: [
            B(
              'Adopt it: removing the 18 MB engine also removes the whole class of platform-mismatch failures, which is the outage from earlier in this chapter',
              'Nên dùng: gỡ đi 18 MB engine cũng gỡ luôn cả lớp lỗi lệch nền tảng, đúng cái sự cố ở đầu chương này',
            ),
            B(
              'Do not adopt it: an engineless client speaks HTTP to a hosted service that owns the engine and the pool, so it adds a network hop and a vendor to the data path — it exists to answer the two-hundred-lambdas-one-hundred-connections problem, which a long-running container does not have',
              'Không nên dùng: một client không engine nói HTTP tới một dịch vụ thuê ngoài sở hữu engine và cả pool, nên nó thêm một chặng mạng và một nhà cung cấp vào đường đi của dữ liệu — nó sinh ra để trả lời bài toán hai trăm lambda trên một trăm kết nối, thứ mà một container chạy dài không hề gặp',
            ),
            B(
              'Adopt it only if the image is built on Alpine: the engineless client is the supported way to run Prisma on musl, and <code>binaryTargets</code> is the older workaround',
              'Chỉ nên dùng nếu ảnh được dựng trên Alpine: client không engine là cách được hỗ trợ để chạy Prisma trên musl, còn <code>binaryTargets</code> là cách vá cũ',
            ),
            B(
              'It makes no difference either way — the engine is downloaded at container start when it is missing, so the flag only changes where the 18 MB is paid for',
              'Dùng hay không cũng thế — engine sẽ được tải về lúc container khởi động nếu thiếu, nên cái cờ ấy chỉ đổi chỗ phải trả 18 MB',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The flag exists for Prisma Accelerate and the Data Proxy, where the point is that hundreds of short-lived function instances cannot each hold a pool against a hundred-connection database — the platform owns the engine and the pool, and the client talks HTTP to it. On a container with a database next door that is a network hop, a vendor in the data path and restrictions on <code>$queryRaw</code>, in exchange for solving a problem you do not have. The size argument is real and small: 18 MB out of a Node image that is 180 MB compressed matters on a serverless bundle with a 50 MB limit and is irrelevant on a long-running container. And nothing is downloaded at start — the engine is put in place by <code>prisma generate</code> at build time, which is exactly why <code>binaryTargets</code> has to name the platform the image will run on. Note also the Prisma 6 <code>prisma-client</code> generator, which emits into your source tree with ESM output: it changes where the JavaScript lands, not what the Rust binary needs.',
            'Cái cờ này sinh ra cho Prisma Accelerate và Data Proxy, nơi vấn đề là hàng trăm thực thể hàm sống ngắn không thể mỗi cái giữ một pool đối diện một cơ sở dữ liệu chỉ có một trăm kết nối — nền tảng sở hữu engine và pool, còn client nói HTTP tới nó. Trên một container có cơ sở dữ liệu nằm ngay cạnh thì đó là một chặng mạng, một nhà cung cấp nằm trong đường đi của dữ liệu, và những hạn chế với <code>$queryRaw</code>, đổi lại là giải một bài toán bạn không có. Lý lẽ về dung lượng thì có thật nhưng nhỏ: 18 MB trong một ảnh Node nén lại còn 180 MB thì đáng kể với một gói serverless giới hạn 50 MB và chẳng liên quan gì với một container chạy dài. Và không có gì được tải về lúc khởi động cả — engine được <code>prisma generate</code> đặt vào lúc build, và đó chính xác là lý do <code>binaryTargets</code> phải gọi tên đúng nền tảng mà cái ảnh sẽ chạy trên đó. Cũng để ý bộ sinh <code>prisma-client</code> của Prisma 6, thứ phát mã vào cây nguồn của bạn với đầu ra ESM: nó đổi chỗ JavaScript hạ cánh, chứ không đổi thứ mà cái nhị phân Rust cần.',
          ),
        }),

        // ── Chương 12 — Chẩn đoán ───────────────────────────────────────
        mcq({
          prompt: B(
            'Three connection failures were provoked on Prisma 6.19.3 and the caught error was inspected. The output is copied verbatim:' + code(
              'wrong password   -> PrismaClientInitializationError | code=undefined | errorCode=undefined\n' +
              'wrong port       -> PrismaClientInitializationError | code=undefined | errorCode=undefined\n' +
              'missing database -> PrismaClientInitializationError | code=undefined | errorCode=undefined\n\n' +
              'Object.getOwnPropertyNames(e)\n' +
              '  -> ["stack","message","clientVersion","errorCode","retryable","name"]\n\n' +
              '// for comparison, findUniqueOrThrow on a missing row:\n' +
              '  -> ["stack","message","code","meta","clientVersion","batchRequestIdx","name"]  code=P2025',
            ) + 'What does an error handler have to do with this class of failure?',
            'Ba cú hỏng kết nối được cố tình gây ra trên Prisma 6.19.3 rồi soi đối tượng lỗi bắt được. Kết quả chép nguyên văn:' + code(
              'sai mật khẩu     -> PrismaClientInitializationError | code=undefined | errorCode=undefined\n' +
              'sai cổng         -> PrismaClientInitializationError | code=undefined | errorCode=undefined\n' +
              'thiếu database   -> PrismaClientInitializationError | code=undefined | errorCode=undefined\n\n' +
              'Object.getOwnPropertyNames(e)\n' +
              '  -> ["stack","message","clientVersion","errorCode","retryable","name"]\n\n' +
              '// để đối chiếu, findUniqueOrThrow trên một hàng không tồn tại:\n' +
              '  -> ["stack","message","code","meta","clientVersion","batchRequestIdx","name"]  code=P2025',
            ) + 'Một error handler phải làm gì với lớp hỏng hóc này?',
          ),
          options: [
            B(
              'Branch on <code>e.errorCode</code> instead of <code>e.code</code> — that is the property this class uses, and it holds <code>P1000</code>, <code>P1001</code> or <code>P1003</code> depending on the cause',
              'Rẽ nhánh theo <code>e.errorCode</code> thay vì <code>e.code</code> — đó là thuộc tính mà lớp lỗi này dùng, và nó giữ <code>P1000</code>, <code>P1001</code> hay <code>P1003</code> tuỳ nguyên nhân',
            ),
            B(
              'Narrow with <code>instanceof Prisma.PrismaClientInitializationError</code> and treat the whole class as fatal-at-boot; the P-codes the chapter tabulates are NOT on the object here — the property exists and is <code>undefined</code> — so only the MESSAGE distinguishes wrong credentials from an unreachable host from a missing database',
              'Thu hẹp bằng <code>instanceof Prisma.PrismaClientInitializationError</code> rồi coi cả lớp ấy là chí tử ngay lúc khởi động; những mã P mà chương này lập bảng thì KHÔNG có trên đối tượng ở đây — thuộc tính có tồn tại và bằng <code>undefined</code> — nên chỉ có CÂU CHỮ phân biệt được sai thông tin đăng nhập với không với tới máy chủ với thiếu database',
            ),
            B(
              'Catch it as <code>PrismaClientKnownRequestError</code>, which is the parent class, and read <code>e.code</code> from there',
              'Bắt nó dưới dạng <code>PrismaClientKnownRequestError</code> — lớp cha của nó — rồi đọc <code>e.code</code> từ đó',
            ),
            B(
              'Retry it: <code>retryable</code> is on the object, so the handler should back off and reconnect rather than classify the cause at all',
              'Hãy thử lại: <code>retryable</code> có trên đối tượng, nên handler nên lùi lại rồi kết nối lại chứ đừng phân loại nguyên nhân làm gì',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured, and it undercuts the chapter\'s own advice of "read the error code, not the sentence" for exactly the class where you most want a code. <code>PrismaClientKnownRequestError</code> is well behaved — <code>code: \'P2025\'</code>, a populated <code>meta</code>, and a clean branch in your handler. <code>PrismaClientInitializationError</code> declares an <code>errorCode</code> property and leaves it <code>undefined</code> for all three causes; <code>code</code> does not exist at all, and <code>retryable</code> is undefined too. It is also not a subclass of <code>KnownRequestError</code> — the prototype chain is <code>PrismaClientInitializationError &lt;- Error</code>. So the practical handling is: narrow by CLASS, log the full message because it is the only thing carrying the distinction (<em>Please make sure to provide valid database credentials</em> / <em>Please make sure your database server is running at `localhost:55999`</em> / <em>Database `khongco` does not exist</em>), and treat the whole class as a boot-time failure rather than a per-request one. The wider lesson: verify what an error object actually carries before writing a branch on it — <code>Object.getOwnPropertyNames(e)</code> takes two seconds.',
            'Đo thật, và nó phản lại chính lời khuyên của chương — "đọc mã lỗi, đừng đọc câu chữ" — đúng ở cái lớp mà bạn khao khát một mã nhất. <code>PrismaClientKnownRequestError</code> thì ngoan: <code>code: \'P2025\'</code>, một <code>meta</code> có nội dung, và một nhánh gọn gàng trong handler của bạn. <code>PrismaClientInitializationError</code> thì khai một thuộc tính <code>errorCode</code> rồi để nó <code>undefined</code> với cả ba nguyên nhân; <code>code</code> hoàn toàn không tồn tại, và <code>retryable</code> cũng undefined. Nó cũng không phải lớp con của <code>KnownRequestError</code> — chuỗi prototype là <code>PrismaClientInitializationError &lt;- Error</code>. Nên cách xử lý thực tế là: thu hẹp theo LỚP, ghi log trọn câu chữ vì đó là thứ duy nhất mang sự phân biệt (<em>Please make sure to provide valid database credentials</em> / <em>Please make sure your database server is running at `localhost:55999`</em> / <em>Database `khongco` does not exist</em>), và coi cả lớp ấy là một cú hỏng lúc khởi động chứ không phải lỗi của từng request. Bài học rộng hơn: hãy KIỂM xem một đối tượng lỗi thật sự mang gì trước khi viết một nhánh dựa trên nó — <code>Object.getOwnPropertyNames(e)</code> mất hai giây.',
          ),
        }),

        mcq({
          prompt: B(
            'An incident starts: "the API is broken". What is the FIRST question, and what is the order after it?',
            'Một sự cố bắt đầu: "cái API chết rồi". Câu hỏi ĐẦU TIÊN là gì, và sau đó là thứ tự nào?',
          ),
          options: [
            B(
              'First: which error code is in the logs, and how many of each — everything else follows from the code, so grouping the last fifteen minutes by code before doing anything else is what stops you guessing at a cause',
              'Trước hết: mã lỗi nào đang nằm trong log, và mỗi loại bao nhiêu — mọi thứ khác đều suy ra từ cái mã, nên gom mười lăm phút gần nhất theo mã trước khi làm bất cứ việc gì mới là thứ ngăn bạn khỏi đoán mò nguyên nhân',
            ),
            B(
              'First: what CHANGED — <code>git log</code>, the container\'s created timestamp, <code>migrate status</code>. Then: is the process alive, can it reach the database, is the schema current, is it slow or failing, and is it everyone or one user',
              'Trước hết: cái gì vừa THAY ĐỔI — <code>git log</code>, dấu thời gian tạo container, <code>migrate status</code>. Rồi mới: tiến trình còn sống không, nó với tới cơ sở dữ liệu được không, lược đồ đã mới chưa, nó chậm hay nó hỏng, và cả làng hay chỉ một người dùng',
            ),
            B(
              'First: restart the container to restore service, then investigate from the logs it left behind — availability comes before diagnosis, and the log driver has already persisted everything a post-mortem needs',
              'Trước hết: khởi động lại container để khôi phục dịch vụ, rồi mới điều tra từ đám log nó để lại — có dịch vụ trước rồi mới chẩn đoán, và trình điều khiển log thì đã lưu sẵn mọi thứ mà một bản mổ xẻ cần',
            ),
            B(
              'First: check the connection pool with <code>$metrics</code> and <code>pg_stat_activity</code>, because <code>P2024</code> is the most common Prisma error in production and pool exhaustion is upstream of almost every other symptom you will see',
              'Trước hết: kiểm connection pool bằng <code>$metrics</code> và <code>pg_stat_activity</code>, vì <code>P2024</code> là lỗi Prisma phổ biến nhất trên production và pool cạn kiệt nằm ở thượng nguồn của gần như mọi triệu chứng khác bạn sẽ thấy',
            ),
          ],
          correct: 1,
          explanation: EX(
            'A database that has been fine for weeks does not spontaneously break; something moved — a deploy, a migration, a config change, a volume crossing a threshold, a certificate expiring. Three commands establish what, and they eliminate most of the search space before you have formed a theory. The ordered triage after that separates incidents that produce the same user report: a container in <code>Restarting</code> is an engine problem and no database query will tell you, a failed <code>SELECT 1</code> separates "Prisma is broken" from "the network is broken" from "the database is down", pending migrations produce the specific symptom of some endpoints working and some 500-ing, and deciding SLOW versus FAILING sends you to two completely different investigations. Restarting first is the expensive mistake: it clears the connection state, the in-memory metrics and the log context, and it "fixes" about a third of incidents temporarily — so the same thing happens again in six hours with no more information than the first time. Capture first, restart second.',
            'Một cơ sở dữ liệu đã chạy tốt hàng tuần thì không tự dưng hỏng; có thứ gì đó đã dịch chuyển — một lần deploy, một migration, một thay đổi cấu hình, một cái volume vượt ngưỡng, một chứng chỉ hết hạn. Ba câu lệnh xác lập được thứ đó, và chúng loại bỏ phần lớn không gian tìm kiếm trước khi bạn kịp dựng lên một giả thuyết. Quy trình phân loại có thứ tự sau đó tách được những sự cố cùng cho ra một báo cáo giống hệt nhau từ phía người dùng: một container ở trạng thái <code>Restarting</code> là vấn đề engine và chẳng truy vấn cơ sở dữ liệu nào nói cho bạn biết, một lệnh <code>SELECT 1</code> hỏng tách được "Prisma hỏng" khỏi "mạng hỏng" khỏi "cơ sở dữ liệu chết", migration đang chờ đẻ ra đúng cái triệu chứng vài endpoint chạy còn vài cái trả 500, và việc quyết CHẬM hay HỎNG đẩy bạn sang hai cuộc điều tra hoàn toàn khác nhau. Khởi động lại trước là sai lầm tốn kém: nó xoá sạch trạng thái kết nối, các số đo trong bộ nhớ và bối cảnh của log, mà nó lại "chữa" được khoảng một phần ba số sự cố một cách tạm thời — nên chuyện ấy tái diễn sau sáu tiếng với đúng chừng ấy thông tin như lần đầu. Ghi lại trước, khởi động lại sau.',
          ),
        }),

        mcq({
          prompt: B(
            'Three <code>migrate diff</code> invocations answer three different questions. Which mapping is right?' + code(
              '1  --from-migrations ./prisma/migrations  --to-database-url "$DATABASE_URL"\n' +
              '2  --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma\n' +
              '3  --from-migrations ./prisma/migrations  --to-schema-datamodel prisma/schema.prisma',
            ),
            'Ba cách gọi <code>migrate diff</code> trả lời ba câu hỏi khác nhau. Ánh xạ nào ĐÚNG?' + code(
              '1  --from-migrations ./prisma/migrations  --to-database-url "$DATABASE_URL"\n' +
              '2  --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma\n' +
              '3  --from-migrations ./prisma/migrations  --to-schema-datamodel prisma/schema.prisma',
            ),
          ),
          options: [
            B(
              '1 = history versus reality (did somebody change production by hand); 2 = the live database versus <code>schema.prisma</code> (the pre-push drift check); 3 = history versus the schema file — the SQL a new migration WOULD contain, without creating one. All three are read-only, and the output is always the SQL that turns <code>from</code> into <code>to</code>',
              '1 = lịch sử so với thực tế (có ai sửa production bằng tay không); 2 = cơ sở dữ liệu đang chạy so với <code>schema.prisma</code> (phép kiểm trôi dạt trước khi push); 3 = lịch sử so với tệp lược đồ — đoạn SQL mà một migration mới SẼ chứa, mà không cần tạo ra nó. Cả ba đều chỉ đọc, và kết quả bao giờ cũng là đoạn SQL biến <code>from</code> thành <code>to</code>',
            ),
            B(
              'All three answer the same question by three different routes; the only difference is which source is cheapest to read, and form 2 is the fastest of them because <code>--from-schema-datasource</code> reads the schema file rather than connecting to the database at all',
              'Cả ba trả lời cùng một câu hỏi bằng ba con đường khác nhau; khác biệt duy nhất là nguồn nào đọc rẻ nhất, và dạng 2 nhanh nhất trong ba cái vì <code>--from-schema-datasource</code> đọc tệp lược đồ chứ không hề kết nối tới cơ sở dữ liệu',
            ),
            B(
              '1 and 3 both need a shadow database to replay the migration history into, and therefore cannot run against a production user with no <code>CREATE DATABASE</code> right; only form 2 is safe to run during an incident',
              '1 và 3 đều cần một shadow database để phát lại lịch sử migration vào đó, nên không chạy được với một tài khoản production không có quyền <code>CREATE DATABASE</code>; chỉ có dạng 2 là an toàn để chạy giữa lúc sự cố',
            ),
            B(
              'The output is always the SQL that would turn the <code>to</code> state back into the <code>from</code> state, so all three have to be read in reverse — which is why an empty result is ambiguous rather than reassuring and you must swap the arguments to get a usable answer',
              'Kết quả bao giờ cũng là đoạn SQL biến trạng thái <code>to</code> ngược trở về trạng thái <code>from</code>, nên cả ba đều phải đọc ngược lại — và đó là lý do một kết quả rỗng thì mập mờ chứ không hề yên tâm, và bạn phải hoán đổi hai tham số mới có được một câu trả lời dùng được',
            ),
          ],
          correct: 0,
          explanation: EX(
            '<code>migrate diff</code> is the tool that makes the rest of diagnosis possible, and its whole power is that <code>--from</code> and <code>--to</code> are independent. Reading the output the right way round matters: it is the SQL that would turn the FROM state into the TO state, so form 2 printing <code>DROP INDEX "posts_title_trgm"</code> means the database HAS an index your schema does not — and running that SQL would delete a deliberate hand-written addition. Empty output is the answer you want in forms 1 and 2. Two practical notes. Form 1 is the one to reach for when you suspect somebody changed production by hand, and it is read-only, so it is safe mid-incident — as are <code>migrate status</code>, <code>validate</code>, <code>$metrics</code> and every <code>pg_stat</code> view. The three that are NOT safe are <code>db pull</code> (rewrites your schema file, losing <code>@map</code> names it cannot infer, relation labels and comments), <code>studio</code> (edits production rows with two clicks over an unauthenticated local server), and anything that applies a migration.',
            '<code>migrate diff</code> là công cụ làm cho phần còn lại của việc chẩn đoán trở nên khả thi, và toàn bộ sức mạnh của nó nằm ở chỗ <code>--from</code> và <code>--to</code> độc lập với nhau. Đọc kết quả đúng chiều là quan trọng: đó là đoạn SQL biến trạng thái FROM thành trạng thái TO, nên dạng 2 mà in ra <code>DROP INDEX "posts_title_trgm"</code> thì nghĩa là cơ sở dữ liệu ĐANG CÓ một chỉ mục mà lược đồ của bạn không có — và chạy đoạn SQL ấy sẽ xoá mất một thứ được thêm bằng tay có chủ đích. Kết quả rỗng là câu trả lời bạn muốn ở dạng 1 và dạng 2. Hai ghi chú thực tế. Dạng 1 là cái để với tới khi bạn nghi có người sửa production bằng tay, và nó chỉ đọc nên an toàn giữa lúc sự cố — cũng như <code>migrate status</code>, <code>validate</code>, <code>$metrics</code> và mọi khung nhìn <code>pg_stat</code>. Ba thứ KHÔNG an toàn là <code>db pull</code> (viết đè tệp lược đồ của bạn, làm mất các tên <code>@map</code> nó không suy ra được, nhãn quan hệ và chú thích), <code>studio</code> (sửa hàng trên production bằng hai cú bấm qua một máy chủ web cục bộ không xác thực), và bất cứ thứ gì áp một migration.',
          ),
        }),

        mcq({
          prompt: B(
            'Two snapshots are taken during an incident. Which one answers a question the other cannot?' + code(
              '-- A\n' +
              'SELECT pid, state, now() - state_change AS lau, left(query, 60)\n' +
              'FROM pg_stat_activity WHERE state != \'idle\' ORDER BY lau DESC;\n\n' +
              '-- B\n' +
              'SELECT bi.pid, left(bi.query,40) AS bi_chan, ch.pid AS ke_chan, left(ch.query,40)\n' +
              'FROM pg_stat_activity bi\n' +
              'JOIN LATERAL unnest(pg_blocking_pids(bi.pid)) AS b(pid) ON true\n' +
              'JOIN pg_stat_activity ch ON ch.pid = b.pid\n' +
              'WHERE cardinality(pg_blocking_pids(bi.pid)) > 0;',
            ),
            'Hai ảnh chụp được lấy trong lúc sự cố. Cái nào trả lời được một câu hỏi mà cái kia không trả lời nổi?' + code(
              '-- A\n' +
              'SELECT pid, state, now() - state_change AS lau, left(query, 60)\n' +
              'FROM pg_stat_activity WHERE state != \'idle\' ORDER BY lau DESC;\n\n' +
              '-- B\n' +
              'SELECT bi.pid, left(bi.query,40) AS bi_chan, ch.pid AS ke_chan, left(ch.query,40)\n' +
              'FROM pg_stat_activity bi\n' +
              'JOIN LATERAL unnest(pg_blocking_pids(bi.pid)) AS b(pid) ON true\n' +
              'JOIN pg_stat_activity ch ON ch.pid = b.pid\n' +
              'WHERE cardinality(pg_blocking_pids(bi.pid)) > 0;',
            ),
          ),
          options: [
            B(
              'A, because it includes <code>idle in transaction</code> sessions and B filters them out, so only A can find the connection holder behind a <code>P2024</code>',
              'A, vì nó bao gồm cả các phiên <code>idle in transaction</code> còn B loại chúng ra, nên chỉ A mới tìm được kẻ đang giữ kết nối đằng sau một <code>P2024</code>',
            ),
            B(
              'Neither — B is A with a join, so it returns a subset of the same rows and any incident answerable by B is answerable by reading A carefully',
              'Chẳng cái nào — B là A cộng thêm một phép nối, nên nó trả về một tập con của cùng những hàng ấy, và mọi sự cố B trả lời được thì đọc kỹ A cũng trả lời được',
            ),
            B(
              'B: <code>pg_blocking_pids</code> names WHO is blocking whom, which A cannot show — A tells you a statement has been running for 31 seconds, B tells you it is an <code>ALTER TABLE</code> waiting on a long <code>SELECT</code>, and therefore that every query arriving after it is queued behind the <code>ALTER</code> rather than behind the <code>SELECT</code>',
              'B: <code>pg_blocking_pids</code> gọi tên AI đang chặn ai, thứ A không chỉ ra được — A cho bạn biết một câu lệnh đã chạy 31 giây, còn B cho biết đó là một <code>ALTER TABLE</code> đang chờ một câu <code>SELECT</code> chạy lâu, và do đó mọi truy vấn tới sau nó đều xếp hàng sau CÂU ALTER chứ không phải sau câu SELECT',
            ),
            B(
              'B, because it is the only one that survives a connection pool: <code>pg_stat_activity</code> shows pooled connections as a single row while <code>pg_blocking_pids</code> resolves them to the real backends',
              'B, vì nó là cái duy nhất sống sót qua một connection pool: <code>pg_stat_activity</code> hiện các kết nối trong pool thành một hàng duy nhất còn <code>pg_blocking_pids</code> phân giải chúng ra thành các backend thật',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Both read the same view; the difference is the join. <code>pg_stat_activity</code> alone gives you a list of what is running and for how long, which is enough to spot an <code>idle in transaction</code> session holding connections — the usual cause of <code>P2024</code>, and the reason twenty-eight of them is never a pool-SIZE problem. What it cannot show is the dependency: <code>pg_blocking_pids(pid)</code> returns the processes actually blocking a given one, and joining back gives you both statements side by side. That matters most for the lock-queue case, where the blocked statement and the ultimate cause are different queries and the damage is done by a third party — everything arriving after a waiting <code>ALTER TABLE</code> queues behind the <code>ALTER</code>, including plain reads. Four views cover most incidents: <code>pg_stat_activity</code> for who is connected, <code>pg_blocking_pids</code> for who blocks whom, <code>pg_stat_user_tables</code> for what is being scanned instead of indexed, and <code>pg_stat_statements</code> for what is slow cumulatively. All four are read-only.',
            'Cả hai đều đọc cùng một khung nhìn; khác biệt nằm ở phép nối. Riêng <code>pg_stat_activity</code> cho bạn danh sách những gì đang chạy và chạy bao lâu, đủ để phát hiện một phiên <code>idle in transaction</code> đang giữ kết nối — nguyên nhân quen thuộc của <code>P2024</code>, và là lý do hai mươi tám cái như thế không bao giờ là vấn đề KÍCH THƯỚC pool. Thứ nó không chỉ ra được là quan hệ phụ thuộc: <code>pg_blocking_pids(pid)</code> trả về những tiến trình thật sự đang chặn một tiến trình cho trước, và nối ngược lại thì bạn có cả hai câu lệnh nằm cạnh nhau. Điều đó quan trọng nhất ở ca hàng đợi khoá, nơi câu lệnh bị chặn và nguyên nhân cuối cùng là hai truy vấn khác nhau còn thiệt hại thì do một bên thứ ba gây ra — mọi thứ tới sau một câu <code>ALTER TABLE</code> đang chờ đều xếp hàng sau CÂU ALTER, kể cả những phép đọc trơn. Bốn khung nhìn phủ được phần lớn sự cố: <code>pg_stat_activity</code> cho biết ai đang kết nối, <code>pg_blocking_pids</code> cho biết ai chặn ai, <code>pg_stat_user_tables</code> cho biết bảng nào đang bị quét thay vì dùng chỉ mục, và <code>pg_stat_statements</code> cho biết cái gì chậm khi cộng dồn. Cả bốn đều chỉ đọc.',
          ),
        }),

        mcq({
          prompt: B(
            'No errors anywhere. Latency is normal. Users report that deleted posts are appearing in search results and that one invoice total is off by a factor of a thousand. Which reading is right?',
            'Không lỗi ở đâu cả. Độ trễ bình thường. Người dùng báo rằng bài đã xoá vẫn hiện trong kết quả tìm kiếm, và một hoá đơn có tổng lệch đúng một nghìn lần. Cách đọc nào ĐÚNG?',
          ),
          options: [
            B(
              'This is failure shape 7 — nothing failing, the wrong answer — and both symptoms have known causes: raw SQL bypasses a soft-delete extension entirely, and <code>Decimal + number</code> is a silent string concatenation. Neither produces an error, which is why both survive review',
              'Đây là hình dạng hỏng hóc thứ 7 — không có gì hỏng, chỉ có câu trả lời sai — và cả hai triệu chứng đều có nguyên nhân đã biết: SQL thô đi vòng hoàn toàn qua một extension xoá mềm, còn <code>Decimal + number</code> là một phép nối chuỗi âm thầm. Không cái nào sinh ra lỗi, và đó là lý do cả hai sống sót qua review',
            ),
            B(
              'Both are data corruption from a partially-applied migration; run <code>migrate diff --from-migrations</code> and expect it to be non-empty',
              'Cả hai đều là hỏng dữ liệu do một migration áp dở; hãy chạy <code>migrate diff --from-migrations</code> và chờ nó ra kết quả khác rỗng',
            ),
            B(
              'The absence of errors means the application is healthy and the reports are user error; ask for reproduction steps before investigating the code',
              'Việc không có lỗi nghĩa là ứng dụng khoẻ mạnh và những báo cáo kia là do người dùng nhầm; hãy xin các bước tái hiện trước khi đi soi mã',
            ),
            B(
              'Both are timezone problems: the soft-delete filter compares <code>deletedAt</code> against a locally-formatted date, and the invoice total is summed across a day boundary',
              'Cả hai đều là vấn đề múi giờ: bộ lọc xoá mềm so <code>deletedAt</code> với một ngày đã định dạng theo giờ địa phương, còn tổng hoá đơn thì cộng vắt qua ranh giới ngày',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The seventh shape is the one people do not look for, because every monitoring signal is green. Its members are worth memorising as a checklist. WRONG ROWS: a soft-delete or tenant filter that a <code>query</code> extension enforces does not reach <code>$queryRaw</code>, and it does not reach a nested read on another model inside an <code>include</code> either. WRONG NUMBERS: <code>Decimal</code> plus a number concatenates because JavaScript falls back to string when either side is an object, and <code>count(*)</code> from a raw query is a <code>bigint</code> — the first produces a plausible wrong value and the second throws only at <code>res.json</code>. WRONG TIMES: everything is UTC in the database and <code>Date</code> is UTC in JavaScript, so "off by seven hours" is a formatting layer, never a Prisma bug. SLOW BUT NOT BROKEN: chapter 9, and the instruction is to measure rather than tune the pool. And "it was working yesterday" sends you back to question zero — the absence of an error is not the absence of a deploy.',
            'Hình dạng thứ bảy là cái người ta không đi tìm, vì mọi tín hiệu giám sát đều xanh. Các thành viên của nó đáng thuộc lòng như một danh sách kiểm. SAI HÀNG: một bộ lọc xoá mềm hay lọc theo khách thuê do một extension <code>query</code> ép buộc thì không với tới <code>$queryRaw</code>, và cũng không với tới một phép đọc lồng trên model khác bên trong một <code>include</code>. SAI SỐ: <code>Decimal</code> cộng một số là nối chuỗi vì JavaScript rơi về chuỗi khi một vế là object, còn <code>count(*)</code> từ một truy vấn thô là một <code>bigint</code> — cái đầu đẻ ra một giá trị sai trông rất hợp lý, cái sau chỉ ném lỗi ở <code>res.json</code>. SAI GIỜ: mọi thứ trong cơ sở dữ liệu là UTC và <code>Date</code> trong JavaScript cũng là UTC, nên "lệch bảy tiếng" là chuyện của tầng định dạng chứ không bao giờ là lỗi Prisma. CHẬM CHỨ KHÔNG HỎNG: chương 9, và chỉ dẫn là hãy ĐO chứ đừng đi chỉnh pool. Còn "hôm qua nó vẫn chạy" thì đẩy bạn về câu hỏi số không — vắng một lỗi không có nghĩa là vắng một lần deploy.',
          ),
        }),

        mcq({
          prompt: B(
            'A team wires up monitoring. On Prisma 6.19.3 the first attempt fails:' + code(
              'const m = await prisma.$metrics.json();',
            ) + code(
              'PrismaClientValidationError: `metrics` preview feature must be enabled\n' +
              'in order to access metrics API',
            ) + 'Once it works, which single number is the one to alert on, and where does the endpoint belong?',
            'Một nhóm dựng phần giám sát. Trên Prisma 6.19.3 lần thử đầu tiên hỏng:' + code(
              'const m = await prisma.$metrics.json();',
            ) + code(
              'PrismaClientValidationError: `metrics` preview feature must be enabled\n' +
              'in order to access metrics API',
            ) + 'Khi nó chạy được rồi, con số DUY NHẤT nào đáng đặt cảnh báo, và cái endpoint ấy thuộc về đâu?',
          ),
          options: [
            B(
              '<code>prisma_pool_connections_open</code>, alerted when it reaches <code>connection_limit</code> — an open connection is a connection in use, so the pool being full is the definition of saturation; expose <code>/metrics</code> publicly so an external prober can reach it',
              '<code>prisma_pool_connections_open</code>, cảnh báo khi nó chạm <code>connection_limit</code> — một kết nối đang mở là một kết nối đang dùng, nên pool đầy chính là định nghĩa của bão hoà; hãy để <code>/metrics</code> công khai để một bộ dò bên ngoài với tới được',
            ),
            B(
              '<code>prisma_client_queries_total</code>, alerted on a multiple of the seven-day average — a sudden jump is the earliest possible signal, and it catches an N+1 the day it ships',
              '<code>prisma_client_queries_total</code>, cảnh báo theo một bội số của trung bình bảy ngày — một cú nhảy đột ngột là tín hiệu sớm nhất có thể, và nó bắt được một N+1 ngay ngày nó lên bản',
            ),
            B(
              'Add <code>previewFeatures = ["metrics"]</code> and regenerate. Then alert on <code>prisma_client_queries_wait</code> above zero for five minutes — zero is the normal value, so any sustained positive number means requests are queuing for a connection — and bind <code>/metrics</code> to the internal network, because it is a free description of your traffic shape and infrastructure',
              'Thêm <code>previewFeatures = ["metrics"]</code> rồi generate lại. Sau đó cảnh báo khi <code>prisma_client_queries_wait</code> lớn hơn không suốt năm phút — số không mới là giá trị bình thường nên bất kỳ con số dương kéo dài nào cũng nghĩa là request đang xếp hàng chờ kết nối — và hãy buộc <code>/metrics</code> vào mạng nội bộ, vì nó là một bản mô tả miễn phí về hình dạng lưu lượng và hạ tầng của bạn',
            ),
            B(
              'The metrics API is a paid Accelerate feature, so the right answer is to scrape <code>pg_stat_activity</code> from a sidecar instead and alert when <code>active</code> exceeds half of <code>max_connections</code>',
              'API metrics là một tính năng trả phí của Accelerate, nên câu trả lời đúng là quét <code>pg_stat_activity</code> từ một sidecar và cảnh báo khi <code>active</code> vượt một nửa <code>max_connections</code>',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: the preview flag is still required on 6.19.3, and the error says so plainly. Of the gauges it then exposes, <code>prisma_client_queries_wait</code> is the one worth waking someone for, precisely because its healthy value is exactly zero — there is no baseline to learn and no seasonal variation, so a sustained positive number is unambiguous and it fires before users notice. <code>connections_open</code> at the limit is normal for a warm pool and says nothing on its own; a query counter needs a baseline and a multiple, which makes it a good panel and a noisy alert. The endpoint placement is not a detail: the histogram and counters are harmless individually and together they describe your traffic shape and your infrastructure to anyone who can reach the URL. Bind it to the compose network or put it behind the admin middleware, never on the public hostname. And the boring panel that prevents the worst outage is disk free on the database volume — a database that fills its disk does not degrade, it stops.',
            'Đo thật: cờ xem trước vẫn còn bắt buộc trên 6.19.3, và thông báo lỗi nói thẳng ra thế. Trong đám gauge nó phơi ra sau đó, <code>prisma_client_queries_wait</code> là cái đáng đánh thức người ta dậy, chính vì giá trị khoẻ mạnh của nó đúng bằng không — không có đường nền nào phải học và không có biến động theo mùa, nên một con số dương kéo dài là rõ ràng không mập mờ và nó nổ TRƯỚC khi người dùng nhận ra. <code>connections_open</code> chạm trần là chuyện bình thường với một pool đã ấm và tự nó chẳng nói gì; còn một bộ đếm truy vấn thì cần đường nền và một hệ số, khiến nó là một bảng đồ thị tốt và một cảnh báo ồn ào. Chỗ đặt endpoint không phải chuyện vặt: cái histogram và mấy bộ đếm thì riêng lẻ vô hại, gộp lại chúng mô tả hình dạng lưu lượng và hạ tầng của bạn cho bất cứ ai với tới được cái URL. Hãy buộc nó vào mạng compose hoặc đặt sau middleware của khu quản trị, đừng bao giờ đặt trên hostname công khai. Còn cái bảng đồ thị chán nhất mà ngăn được cú sập tệ nhất là dung lượng đĩa trống của volume cơ sở dữ liệu — một cơ sở dữ liệu đầy đĩa thì không suy giảm dần, nó DỪNG.',
          ),
        }),

        mcq({
          prompt: B(
            'During an incident the on-call engineer is about to run <code>docker restart</code>. What is the argument for capturing first, and what is the minimum to capture?',
            'Giữa lúc sự cố, người trực chuẩn bị chạy <code>docker restart</code>. Lý lẽ cho việc ghi lại trước là gì, và tối thiểu phải ghi lại những gì?',
          ),
          options: [
            B(
              'Capture nothing — a restart is reversible and the logs are already persisted by the log driver, so the fastest path back to service is always the right one during an incident',
              'Không cần ghi gì cả — khởi động lại là việc đảo ngược được và log thì trình điều khiển log vốn đã lưu sẵn, nên trong lúc sự cố thì đường về dịch vụ nhanh nhất bao giờ cũng là đường đúng',
            ),
            B(
              'A restart clears the connection pool state, the stuck query, the in-flight requests and the in-memory metrics — and it "fixes" enough incidents temporarily that you end up with no information and the same failure at a worse hour; thirty seconds first: <code>pg_stat_activity</code>, the last hundred log lines, the pool gauges',
              'Một lần khởi động lại xoá sạch trạng thái connection pool, câu truy vấn đang kẹt, các request đang bay và các số đo trong bộ nhớ — mà nó lại "chữa" đủ nhiều sự cố một cách tạm thời tới mức bạn kết thúc với không chút thông tin nào và đúng cú hỏng ấy vào một giờ tệ hơn; hãy dành ba mươi giây trước đã: <code>pg_stat_activity</code>, một trăm dòng log cuối, các gauge của pool',
            ),
            B(
              'Capture first only when the container is in <code>Restarting</code>, because that is the one state where the evidence is lost; a running container keeps everything in the log driver',
              'Chỉ cần ghi lại trước khi container đang ở trạng thái <code>Restarting</code>, vì đó là trạng thái duy nhất mà bằng chứng bị mất; một container đang chạy thì giữ mọi thứ trong trình điều khiển log',
            ),
            B(
              'Capture a full <code>pg_dump</code> before restarting, since a restart can leave a partially-applied migration and the dump is the only way to compare afterwards',
              'Hãy chụp một bản <code>pg_dump</code> đầy đủ trước khi khởi động lại, vì một lần khởi động lại có thể để lại một migration áp dở và bản dump là cách duy nhất để đối chiếu về sau',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The reason this is hard to follow is that restarting genuinely works often enough. That is exactly the trap: the incident ends, nobody knows why it started, and it returns with the same amount of information as the first time. The evidence a restart destroys is the evidence that would have named the cause — which connection was holding a transaction open, which query was stuck, how many requests were queued, what the pool gauges read. Thirty seconds of capture costs nothing when the restart works and is the entire difference when it does not. Pair it with the habit of writing a three-line timeline as you go (<em>13:41 container restarted · 13:41 P1001 begins · 13:47 postgres OOM in dmesg</em>) — the cause is often visible before you finish writing it, and the post-mortem is already half done. A full <code>pg_dump</code> is the wrong tool: it is slow, it loads the database you are already worried about, and a restart does not change committed data.',
            'Lý do điều này khó tuân thủ là vì khởi động lại thật sự có tác dụng đủ thường xuyên. Đó chính là cái bẫy: sự cố kết thúc, chẳng ai biết vì sao nó bắt đầu, và nó quay lại với đúng chừng ấy thông tin như lần đầu. Đám bằng chứng mà một lần khởi động lại phá huỷ chính là đám bằng chứng lẽ ra đã gọi tên nguyên nhân — kết nối nào đang giữ một giao dịch mở, truy vấn nào đang kẹt, bao nhiêu request đang xếp hàng, các gauge của pool đọc ra bao nhiêu. Ba mươi giây ghi lại chẳng tốn gì khi việc khởi động lại có tác dụng, và là toàn bộ khác biệt khi nó không có tác dụng. Hãy ghép nó với thói quen viết một dòng thời gian ba dòng ngay khi làm (<em>13:41 container khởi động lại · 13:41 P1001 bắt đầu · 13:47 postgres OOM trong dmesg</em>) — nguyên nhân thường hiện ra trước khi bạn viết xong, và bản mổ xẻ hậu sự cố thì đã xong một nửa. Một bản <code>pg_dump</code> đầy đủ là công cụ sai: nó chậm, nó chất tải lên chính cái cơ sở dữ liệu bạn đang lo lắng, và một lần khởi động lại thì không đổi được dữ liệu đã commit.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Rank a query log and name the problem (chapter 9).</b> A request was captured with <code>$on(\'query\')</code>. Implement three functions that turn that log into a diagnosis.</p>' +
            '<ul>' +
            '<li><code>normalise(sql)</code> — replace every <code>$1</code>, <code>$2</code>, <code>$99</code> placeholder with <code>?</code>, collapse each run of whitespace to a single space, and trim. Without this, forty-two statements that differ only in their placeholder numbers and spacing look like forty-two different queries and no pattern is visible.</li>' +
            '<li><code>rank(log)</code> — group by the normalised shape into <code>{ shape, count, total, max }</code> and sort by <code>total</code> DESCENDING, breaking ties by <code>count</code> descending and then by <code>shape</code> ascending.</li>' +
            '<li><code>diagnose(row)</code> — <code>\'n+1\'</code> when the row ran at least 10 times AND its slowest run was under 50 ms; <code>\'slow-query\'</code> when it ran at most 3 times AND its slowest run was 100 ms or more; otherwise <code>\'ok\'</code>.</li>' +
            '<li><code>report(log)</code> — <code>{ queries, totalMs, top, worstByMax, worstByTotal }</code>. <code>queries</code> is the number of log entries and <code>totalMs</code> the sum of their durations. <code>top</code> is the first three ranked rows as <code>{ count, total, max, verdict }</code>. <code>worstByMax</code> and <code>worstByTotal</code> are the first 40 characters of the shape that wins on each measure — and the whole point of the exercise is that they are not the same query.</li>' +
            '</ul>' +
            '<p>Keep the given data and the printing block exactly as they are, and do not require anything.</p>',

            '<p><b>Câu 31 — Xếp hạng một log truy vấn và gọi tên vấn đề (chương 9).</b> Một request được ghi lại bằng <code>$on(\'query\')</code>. Hãy cài đặt ba hàm biến cái log ấy thành một chẩn đoán.</p>' +
            '<ul>' +
            '<li><code>normalise(sql)</code> — thay mọi chỗ giữ chỗ <code>$1</code>, <code>$2</code>, <code>$99</code> bằng <code>?</code>, gộp mỗi dãy khoảng trắng thành một dấu cách, rồi cắt hai đầu. Không có bước này thì bốn mươi hai câu lệnh chỉ khác nhau ở số hiệu chỗ giữ chỗ và khoảng trắng sẽ trông như bốn mươi hai truy vấn khác nhau và chẳng thấy quy luật nào.</li>' +
            '<li><code>rank(log)</code> — gom nhóm theo hình dạng đã chuẩn hoá thành <code>{ shape, count, total, max }</code> rồi sắp theo <code>total</code> GIẢM DẦN, trùng thì phân định bằng <code>count</code> giảm dần rồi tới <code>shape</code> tăng dần.</li>' +
            '<li><code>diagnose(row)</code> — <code>\'n+1\'</code> khi dòng đó chạy ít nhất 10 lần VÀ lần chậm nhất dưới 50 ms; <code>\'slow-query\'</code> khi nó chạy nhiều nhất 3 lần VÀ lần chậm nhất từ 100 ms trở lên; còn lại là <code>\'ok\'</code>.</li>' +
            '<li><code>report(log)</code> — <code>{ queries, totalMs, top, worstByMax, worstByTotal }</code>. <code>queries</code> là số mục trong log và <code>totalMs</code> là tổng thời lượng của chúng. <code>top</code> là ba dòng đầu sau khi xếp hạng, dạng <code>{ count, total, max, verdict }</code>. <code>worstByMax</code> và <code>worstByTotal</code> là 40 ký tự đầu của hình dạng thắng ở mỗi thước đo — và toàn bộ ý nghĩa của bài này là chúng KHÔNG phải cùng một truy vấn.</li>' +
            '</ul>' +
            '<p>Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả, và không require thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const MS_USER = [14, 9, 11, 8, 12, 10, 13, 7, 14, 12, 10, 9, 11, 13, 8, 12, 10, 14, 9, 11,\n' +
            '                 13, 7, 12, 10, 14, 8, 11, 9, 13, 12, 10, 14, 7, 11, 9, 12, 13, 8, 10, 14, 11];\n' +
            'const LOG = [\n' +
            '  { sql: \'SELECT "id","title" FROM "Post"    WHERE "published" = $1 OFFSET $2\', ms: 311 },\n' +
            '  ...MS_USER.map((ms) => ({ sql: \'SELECT "id", "email"  FROM "User"  WHERE "id" = $1 LIMIT $2 OFFSET $3\', ms })),\n' +
            '  { sql: \'SELECT COUNT(*) FROM "Post" WHERE "published" = $1\', ms: 38 },\n' +
            '  { sql: \'SELECT "id","body" FROM "Comment" WHERE "postId" IN ($1,$2,$3)\', ms: 61 },\n' +
            '  { sql: \'SELECT "id", "email" FROM "User" WHERE "id" = $7 LIMIT $8 OFFSET $9\', ms: 9 },\n' +
            "  { sql: 'COMMIT', ms: 1 },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function normalise(sql) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function rank(log) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function diagnose(row) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function report(log) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const r of rank(LOG)) {\n' +
            "  console.log(String(r.count).padStart(2) + ' x  total=' + String(r.total).padStart(4)\n" +
            "    + '  max=' + String(r.max).padStart(3) + '  ' + diagnose(r).padEnd(10) + '  ' + r.shape.slice(0, 52));\n" +
            '}\n' +
            'console.log(JSON.stringify(report(LOG)));\n',
          expectedOutput:
            '42 x  total= 454  max= 14  n+1         SELECT "id", "email" FROM "User" WHERE "id" = ? LIMI\n' +
            ' 1 x  total= 311  max=311  slow-query  SELECT "id","title" FROM "Post" WHERE "published" = \n' +
            ' 1 x  total=  61  max= 61  ok          SELECT "id","body" FROM "Comment" WHERE "postId" IN \n' +
            ' 1 x  total=  38  max= 38  ok          SELECT COUNT(*) FROM "Post" WHERE "published" = ?\n' +
            ' 1 x  total=   1  max=  1  ok          COMMIT\n' +
            '{"queries":46,"totalMs":865,"top":[{"count":42,"total":454,"max":14,"verdict":"n+1"},{"count":1,"total":311,"max":311,"verdict":"slow-query"},{"count":1,"total":61,"max":61,"verdict":"ok"}],"worstByMax":"SELECT \\"id\\",\\"title\\" FROM \\"Post\\" WHERE \\"p","worstByTotal":"SELECT \\"id\\", \\"email\\" FROM \\"User\\" WHERE \\""}',
          sampleSolution:
            'function normalise(sql) {\n' +
            "  return sql.replace(/\\$\\d+/g, '?').replace(/\\s+/g, ' ').trim();\n" +
            '}\n\n' +
            'function rank(log) {\n' +
            '  const g = new Map();\n' +
            '  for (const q of log) {\n' +
            '    const shape = normalise(q.sql);\n' +
            '    const n = g.get(shape) ?? { shape, count: 0, total: 0, max: 0 };\n' +
            '    n.count++; n.total += q.ms; n.max = Math.max(n.max, q.ms);\n' +
            '    g.set(shape, n);\n' +
            '  }\n' +
            '  return [...g.values()].sort((a, b) =>\n' +
            '    b.total - a.total || b.count - a.count || (a.shape < b.shape ? -1 : a.shape > b.shape ? 1 : 0));\n' +
            '}\n\n' +
            'function diagnose(row) {\n' +
            "  if (row.count >= 10 && row.max < 50) return 'n+1';        // nhiều lần, mỗi lần nhanh\n" +
            "  if (row.count <= 3 && row.max >= 100) return 'slow-query'; // ít lần, mỗi lần chậm\n" +
            "  return 'ok';\n" +
            '}\n\n' +
            'function report(log) {\n' +
            '  const rows = rank(log);\n' +
            '  return {\n' +
            '    queries: log.length,\n' +
            '    totalMs: log.reduce((s, q) => s + q.ms, 0),\n' +
            '    top: rows.slice(0, 3).map((r) => ({ count: r.count, total: r.total, max: r.max, verdict: diagnose(r) })),\n' +
            '    worstByMax: rows.slice().sort((a, b) => b.max - a.max)[0].shape.slice(0, 40),\n' +
            '    worstByTotal: rows[0].shape.slice(0, 40),\n' +
            '  };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Triage an incident from a snapshot (chapter 12).</b> Implement <code>triage(s)</code> and <code>safeCommands(list)</code>, the ordered triage from the first five minutes turned into code.</p>' +
            '<ul>' +
            '<li><code>alive</code> — <code>false</code> when <code>s.container</code> starts with <code>\'Restarting\'</code>, otherwise <code>true</code>.</li>' +
            '<li><code>first</code> — the code of the EARLIEST log line that has one, comparing the <code>t</code> strings. <b>The log is given unsorted and the loudest code is usually not the first one</b>; lines with <code>code: null</code> never count. <code>null</code> when no line has a code.</li>' +
            '<li><code>counts</code> — how many coded lines there are per code, as an object.</li>' +
            '<li><code>verdict</code>, in this order: not alive → <code>\'engine\'</code>; no coded line → <code>\'not-failing\'</code>; <code>P1000</code>/<code>P1001</code>/<code>P1003</code> → <code>\'connectivity\'</code>; <code>P3009</code>/<code>P3018</code> → <code>\'migration\'</code>; <code>P2024</code> → <code>\'held-connections\'</code> when <code>s.idleInTransaction >= 10</code> and <code>\'pool-size\'</code> otherwise; <code>P2034</code>/<code>P2028</code> → <code>\'contention\'</code>; anything else → <code>\'data\'</code>. Only <code>first</code> decides, never the most frequent code.</li>' +
            '<li><code>safeCommands(list)</code> — the commands that only READ. A command is unsafe when it starts with any of <code>prisma db pull</code>, <code>prisma studio</code>, <code>prisma migrate deploy</code>, <code>prisma migrate reset</code>, <code>prisma db push</code> or <code>prisma migrate resolve</code>.</li>' +
            '</ul>' +
            '<p><code>triage</code> returns <code>{ alive, first, counts, verdict }</code>. Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Phân loại một sự cố từ một ảnh chụp (chương 12).</b> Hãy cài đặt <code>triage(s)</code> và <code>safeCommands(list)</code> — quy trình phân loại có thứ tự của năm phút đầu, viết thành mã.</p>' +
            '<ul>' +
            '<li><code>alive</code> — <code>false</code> khi <code>s.container</code> bắt đầu bằng <code>\'Restarting\'</code>, ngược lại là <code>true</code>.</li>' +
            '<li><code>first</code> — mã của dòng log SỚM NHẤT có mang mã, so sánh theo chuỗi <code>t</code>. <b>Log được cho không sắp thứ tự và cái mã ồn ào nhất thường không phải cái đầu tiên</b>; những dòng có <code>code: null</code> không bao giờ được tính. Trả <code>null</code> khi không dòng nào có mã.</li>' +
            '<li><code>counts</code> — có bao nhiêu dòng mang mã ứng với mỗi mã, dưới dạng một object.</li>' +
            '<li><code>verdict</code>, xét theo đúng thứ tự này: không còn sống → <code>\'engine\'</code>; không có dòng nào mang mã → <code>\'not-failing\'</code>; <code>P1000</code>/<code>P1001</code>/<code>P1003</code> → <code>\'connectivity\'</code>; <code>P3009</code>/<code>P3018</code> → <code>\'migration\'</code>; <code>P2024</code> → <code>\'held-connections\'</code> khi <code>s.idleInTransaction >= 10</code> và <code>\'pool-size\'</code> nếu không; <code>P2034</code>/<code>P2028</code> → <code>\'contention\'</code>; còn lại → <code>\'data\'</code>. Chỉ <code>first</code> quyết định, không bao giờ là cái mã xuất hiện nhiều nhất.</li>' +
            '<li><code>safeCommands(list)</code> — những lệnh chỉ ĐỌC. Một lệnh là không an toàn khi nó bắt đầu bằng một trong <code>prisma db pull</code>, <code>prisma studio</code>, <code>prisma migrate deploy</code>, <code>prisma migrate reset</code>, <code>prisma db push</code> hoặc <code>prisma migrate resolve</code>.</li>' +
            '</ul>' +
            '<p><code>triage</code> trả về <code>{ alive, first, counts, verdict }</code>. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const LENH = [\n' +
            "  'prisma migrate status',\n" +
            "  'prisma migrate diff --from-migrations ./prisma/migrations --to-database-url $DATABASE_URL',\n" +
            "  'prisma validate',\n" +
            "  'prisma db pull',\n" +
            "  'prisma studio',\n" +
            "  'prisma migrate deploy',\n" +
            "  'prisma migrate reset',\n" +
            "  'prisma db push',\n" +
            '  \'psql -c "SELECT state, count(*) FROM pg_stat_activity GROUP BY state"\',\n' +
            "  'prisma migrate resolve --applied 20260823_them_cot',\n" +
            '];\n\n' +
            'const SNAPSHOTS = [\n' +
            "  { name: 'A', container: 'Restarting (1) 3 seconds ago', idleInTransaction: 0, log: [\n" +
            "      { t: '13:41:09', code: 'P2024' }, { t: '13:41:07', code: null },\n" +
            "      { t: '13:41:08', code: 'P2024' } ] },\n" +
            "  { name: 'B', container: 'Up 6 days', idleInTransaction: 28, log: [\n" +
            "      { t: '09:14:31', code: 'P2024' }, { t: '09:14:02', code: 'P2024' },\n" +
            "      { t: '09:15:44', code: 'P2024' } ] },\n" +
            "  { name: 'C', container: 'Up 6 days', idleInTransaction: 1, log: [\n" +
            "      { t: '22:03:12', code: 'P2024' }, { t: '22:03:01', code: 'P2024' } ] },\n" +
            "  { name: 'D', container: 'Up 4 minutes', idleInTransaction: 2, log: [\n" +
            "      { t: '13:41:19', code: 'P2024' }, { t: '13:41:11', code: 'P1001' },\n" +
            "      { t: '13:41:44', code: 'P2024' }, { t: '13:41:22', code: 'P2024' } ] },\n" +
            "  { name: 'E', container: 'Up 2 hours', idleInTransaction: 0, log: [\n" +
            "      { t: '07:00:04', code: 'P3009' }, { t: '07:00:09', code: 'P2025' } ] },\n" +
            "  { name: 'F', container: 'Up 9 days', idleInTransaction: 0, log: [\n" +
            "      { t: '18:22:41', code: 'P2034' }, { t: '18:22:47', code: 'P2034' } ] },\n" +
            "  { name: 'G', container: 'Up 9 days', idleInTransaction: 0, log: [\n" +
            "      { t: '11:02:03', code: 'P2002' }, { t: '11:02:31', code: 'P2025' } ] },\n" +
            "  { name: 'H', container: 'Up 9 days', idleInTransaction: 0, log: [\n" +
            "      { t: '11:02:03', code: null }, { t: '11:02:31', code: null } ] },\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function triage(s) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function safeCommands(list) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'for (const s of SNAPSHOTS) {\n' +
            '  const r = triage(s);\n' +
            "  console.log(s.name + ' alive=' + r.alive + ' first=' + r.first\n" +
            "    + ' counts=' + JSON.stringify(r.counts) + ' verdict=' + r.verdict);\n" +
            '}\n' +
            "console.log('safe=' + JSON.stringify(safeCommands(LENH).map((c) => c.split(' ').slice(0, 3).join(' '))));\n",
          expectedOutput:
            'A alive=false first=P2024 counts={"P2024":2} verdict=engine\n' +
            'B alive=true first=P2024 counts={"P2024":3} verdict=held-connections\n' +
            'C alive=true first=P2024 counts={"P2024":2} verdict=pool-size\n' +
            'D alive=true first=P1001 counts={"P1001":1,"P2024":3} verdict=connectivity\n' +
            'E alive=true first=P3009 counts={"P3009":1,"P2025":1} verdict=migration\n' +
            'F alive=true first=P2034 counts={"P2034":2} verdict=contention\n' +
            'G alive=true first=P2002 counts={"P2002":1,"P2025":1} verdict=data\n' +
            'H alive=true first=null counts={} verdict=not-failing\n' +
            'safe=["prisma migrate status","prisma migrate diff","prisma validate","psql -c \\"SELECT"]',
          sampleSolution:
            "const DOI_TRANG_THAI = ['prisma db pull', 'prisma studio', 'prisma migrate deploy',\n" +
            "  'prisma migrate reset', 'prisma db push', 'prisma migrate resolve'];\n\n" +
            'function triage(s) {\n' +
            "  const alive = !s.container.startsWith('Restarting');\n\n" +
            '  // Đọc lỗi ĐẦU TIÊN, không phải lỗi to nhất: sắp theo thời gian rồi lấy cái đầu.\n' +
            '  const coded = s.log.filter((l) => l.code).sort((a, b) => (a.t < b.t ? -1 : a.t > b.t ? 1 : 0));\n' +
            '  const first = coded.length ? coded[0].code : null;\n\n' +
            '  const counts = {};\n' +
            '  for (const l of coded) counts[l.code] = (counts[l.code] ?? 0) + 1;\n\n' +
            '  let verdict;\n' +
            "  if (!alive) verdict = 'engine';\n" +
            "  else if (first === null) verdict = 'not-failing';\n" +
            "  else if (first === 'P1000' || first === 'P1001' || first === 'P1003') verdict = 'connectivity';\n" +
            "  else if (first === 'P3009' || first === 'P3018') verdict = 'migration';\n" +
            "  else if (first === 'P2024') verdict = s.idleInTransaction >= 10 ? 'held-connections' : 'pool-size';\n" +
            "  else if (first === 'P2034' || first === 'P2028') verdict = 'contention';\n" +
            "  else verdict = 'data';\n\n" +
            '  return { alive, first, counts, verdict };\n' +
            '}\n\n' +
            'function safeCommands(list) {\n' +
            '  return list.filter((c) => !DOI_TRANG_THAI.some((d) => c.startsWith(d)));\n' +
            '}\n',
        }),
      ],
    },
  ],
};
