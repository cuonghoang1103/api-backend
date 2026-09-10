/**
 * Prisma ORM — Progress Test 1 (chương s00–s04).
 *
 * Đề tự soạn, bám sát `content/courses/prisma-orm/s00-intro` … `s04-doc-ghi`.
 * 30 câu trắc nghiệm + 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ MỌI đoạn log truy vấn, mọi mã lỗi P####, mọi khối DDL và mọi con số trong
 * đề này đều được ĐO THẬT trong một dự án Prisma nháp NGOÀI kho api-backend:
 *
 *     prisma 6.19.3 · @prisma/client 6.19.3 · Node v22.21.0 · darwin-arm64
 *     PostgreSQL 16.14 (Debian) trong Docker, container riêng, cổng riêng
 *     (đối chiếu thêm với prisma 5.22.0 ở những chỗ hai bản khác nhau)
 *
 * Lược đồ của kho api-backend KHÔNG bị đụng tới: không `migrate`, không
 * `db push`, không `generate` nào trỏ vào `prisma/schema.prisma` của kho này.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * ⚠️ BẢY CHỖ MÁY KHÁC GIÁO TRÌNH (đo 10/09/2026 trên 6.19.3) — ĐỀ THEO MÁY
 * ────────────────────────────────────────────────────────────────────────────
 *
 * 1. `connect: { id: 1 }` KHÔNG phải "một câu lệnh, không cần tra cứu".
 *    Bài 3.1 in ra hai khối SQL và chú thích "B: cũng một câu lệnh — connect
 *    theo khoá chính không cần tra cứu", rồi bẫy phía dưới nói connect theo
 *    trường unique KHÁC mới tốn thêm một câu. Đo thật: cả hai dạng đều ra
 *    ĐÚNG MỘT hình — BEGIN · SELECT khoá cha · INSERT · SELECT kết quả ·
 *    COMMIT. Chỉ ghi thẳng scalar `authorId: 1` mới là một câu lệnh trần,
 *    không giao dịch. Câu 18 hỏi đúng chỗ này.
 *
 * 2. `onDelete: SetNull` trên quan hệ BẮT BUỘC KHÔNG bị từ chối. Bài 3.2 nói
 *    "trên quan hệ bắt buộc thì Prisma từ chối lược đồ". Đo thật:
 *    `prisma validate` chỉ in một `Prisma schema warning:` rồi vẫn kết luận
 *    "The schema … is valid 🚀", và `migrate diff` sinh ra
 *    `ON DELETE SET NULL` trên một cột `NOT NULL`. Quả bom nổ lúc CHẠY, ở
 *    PostgreSQL: `ERROR: null value in column "pid" … violates not-null
 *    constraint` (SQLSTATE 23502). Câu 19.
 *
 * 3. `_count` trong `include` là MỘT câu lệnh, và nó là LEFT JOIN với một
 *    truy vấn con đã GROUP BY — không phải truy vấn con tương quan, cũng
 *    không phải một câu lệnh riêng. Bài 4.2 in ra một log năm câu lệnh trong
 *    đó `_count` là câu thứ năm, và bài 4.1 mô tả nó là "correlated
 *    subquery". Đo thật: `include: { _count: … }` một mình = 1 câu lệnh, và
 *    ghép chung với `include: { posts: true }` vẫn chỉ 2. Câu 24.
 *
 * 4. `JSON.stringify` một `Prisma.Decimal` KHÔNG ra `{"s":1,"e":-1,…}`.
 *    Bẫy ở bài 2.1 nói vậy. Đo thật trên 6.19.3, cả Decimal tự dựng lẫn
 *    Decimal đọc từ cột `numeric(12,2)`: nó ra một CHUỖI JSON — `"0.1"` —
 *    vì lớp Decimal có `toJSON`. Cái bẫy thật vẫn còn nguyên nhưng nằm chỗ
 *    khác: `price + 1` cho `"0.11"` (nối chuỗi). Câu 11.
 *
 * 5. `String[]` không kèm `@default([])` sinh ra một cột **cho phép NULL và
 *    KHÔNG có default**. Bài 2.1 nói "danh sách rỗng lưu là `{}`, không bao
 *    giờ NULL, nên trường danh sách không bao giờ optional". Đo thật:
 *    `"tags" TEXT[],` — nullable, trống default; `prisma.quirk.create({data:{}})`
 *    thậm chí không gửi cột đó đi, nên hàng nằm lại với SQL NULL; và
 *    Prisma Client vẫn ĐỌC RA `[]`. Câu 12.
 *
 * 6. Đọc-rồi-ghi 100 lời gọi song song kết thúc ở **1**, không phải 23. Bài
 *    4.4 in `doc-roi-write: 23`. Đo thật ba lượt liền, kết quả ổn định:
 *    read-then-write = 1, increment = 100. Cả 100 lượt đọc xong trước khi lượt
 *    ghi đầu tiên hạ cánh, nên chúng cùng ghi 1. Câu 25.
 *
 * 7. Ghi lồng `update` KHÔNG được kẹp thêm `AND "author_id" = $3` vào câu
 *    UPDATE. Bài 4.4 nói thế. Đo thật: hàng rào là một câu `SELECT` RIÊNG
 *    (`WHERE (Post.id = $1 …) AND Post."authorId" IN ($2)`) chạy trước, còn
 *    câu `UPDATE` chỉ mang điều kiện theo `id`. Tính an toàn vẫn còn, nhưng
 *    nó nằm ở phép đọc chứ không nằm trong mệnh đề WHERE. Câu 26.
 *
 * Ba chỗ nhỏ hơn, chỉ ghi lại chứ không ra đề: (a) khối một dòng kiểu
 * `model User { id Int @id }` — giáo trình viết vài lần — KHÔNG phải PSL hợp
 * lệ, máy trả "This line is invalid. It does not start with any known Prisma
 * schema keyword."; (b) lỗi tên model bắt đầu bằng số nay là "The name of a
 * Model must not start with a number.", không phải "The model name must start
 * with a letter." như bài 2.1 chép; (c) `connectOrCreate` trên 6.19.3 chèn
 * hàng CHA trước, rồi mỗi thẻ một `SELECT` riêng và mỗi thẻ một `INSERT` vào
 * bảng nối — không gộp `IN` và không gộp nhiều dòng như log ở bài 4.3.
 *
 * ────────────────────────────────────────────────────────────────────────────
 * Cân vị trí đáp án (đếm bằng lệnh dưới đây):
 *     { '0': 8, '1': 7, '2': 8, '3': 7 }   → A 8 · B 7 · C 8 · D 7
 *
 *   node -e "import('./content/exams/PRISMA-ORM-PT1.mjs').then(m=>{const d={};m.default.exams[0].questions.filter(q=>!q.language).forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 * ────────────────────────────────────────────────────────────────────────────
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRISMA-ORM-PT1.mjs --apply
 */
import { B, EX, code, c, RUBRIC_CODE, ptInstructions, mcq, codeQ } from './_lib/prisma-exam-kit.mjs';

export default {
  course: { slug: 'prisma-orm' },
  exams: [
    {
      kind: 'FE',
      code: 'PT1',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Progress Test 1 — Chapters 0–4 (setup, what an ORM is, the schema language, relations, reading and writing)',
        'Kiểm tra tiến độ 1 — Chương 0–4 (cài đặt, ORM là gì, ngôn ngữ lược đồ, quan hệ, đọc và ghi)',
      ),
      description: B(
        'The first third of the Prisma course: getting connected, what the generated client actually is, the whole schema language, every relation kind, and the client CRUD API. 30 multiple-choice questions plus 2 coding questions you write here in the exam room. Every query log and every error code in this paper came from running the command against PostgreSQL 16.14 with Prisma 6.19.3.',
        'Một phần ba đầu của khoá Prisma: nối được vào cơ sở dữ liệu, client sinh ra thật ra là cái gì, toàn bộ ngôn ngữ lược đồ, mọi kiểu quan hệ, và API CRUD của client. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi. Mọi log truy vấn và mọi mã lỗi trong đề đều lấy từ việc chạy thật trên PostgreSQL 16.14 với Prisma 6.19.3.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(1, '0–4'),
      questions: [
        // ── Chương 0 — Cài đặt ──────────────────────────────────────────
        mcq({
          prompt: B(
            'Your PostgreSQL user is <code>student</code> and the password is <code>p@ss:w0rd</code>. Which <code>DATABASE_URL</code> connects, and why do the others not?' + code(
              'postgresql://student:p@ss:w0rd@localhost:5432/hocprisma?schema=public',
            ),
            'Người dùng PostgreSQL của bạn là <code>student</code>, mật khẩu là <code>p@ss:w0rd</code>. <code>DATABASE_URL</code> nào nối được, và vì sao những cái còn lại thì không?' + code(
              'postgresql://student:p@ss:w0rd@localhost:5432/hocprisma?schema=public',
            ),
          ),
          options: [
            B(
              'Percent-encode both reserved characters — <code>student:p%40ss%3Aw0rd</code> — because the URL parser splits on the LAST <code>@</code> and the FIRST <code>:</code> after the scheme, so an unescaped one moves the host/port boundary',
              'Mã hoá phần trăm cả hai ký tự dành riêng — <code>student:p%40ss%3Aw0rd</code> — vì bộ phân tích URL cắt ở dấu <code>@</code> CUỐI CÙNG và dấu <code>:</code> ĐẦU TIÊN sau phần scheme, nên để nguyên là dời luôn ranh giới host/cổng',
            ),
            B(
              'Wrap the password in double quotes inside the URL, <code>student:&quot;p@ss:w0rd&quot;@localhost</code>, which is the escaping form every connection-string parser understands',
              'Bọc mật khẩu trong ngoặc kép ngay trong URL, <code>student:&quot;p@ss:w0rd&quot;@localhost</code> — đó là dạng thoát mà mọi bộ phân tích chuỗi kết nối đều hiểu',
            ),
            B(
              'Leave it as it is: Prisma reads <code>DATABASE_URL</code> with its own parser, which takes everything between the first <code>//</code> and the last <code>/</code> as credentials',
              'Cứ để nguyên: Prisma đọc <code>DATABASE_URL</code> bằng bộ phân tích riêng, lấy mọi thứ giữa dấu <code>//</code> đầu tiên và dấu <code>/</code> cuối cùng làm phần thông tin đăng nhập',
            ),
            B(
              'Move the password out of the URL into a separate <code>DATABASE_PASSWORD</code> variable, which the <code>datasource</code> block reads with a second <code>env()</code> call',
              'Chuyển mật khẩu ra khỏi URL, sang một biến <code>DATABASE_PASSWORD</code> riêng, rồi khối <code>datasource</code> đọc nó bằng một lời gọi <code>env()</code> thứ hai',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A connection string is a URL, and <code>@</code> <code>:</code> <code>/</code> <code>?</code> <code>#</code> are structural characters in it. An unescaped <code>@</code> in the password makes the parser read <code>ss:w0rd@localhost</code> as the host, and the failure surfaces as "password authentication failed" or a hostname that does not resolve — which sends everyone hunting for a wrong password instead of a malformed URL. There is no quoting syntax in a URL; percent-encoding is the only mechanism, and <code>encodeURIComponent(password)</code> in a Node REPL is the fastest way to get it right. A <code>datasource</code> block accepts exactly one <code>env()</code> for <code>url</code>, so splitting the password out is not an option either.',
            'Chuỗi kết nối là một URL, và <code>@</code> <code>:</code> <code>/</code> <code>?</code> <code>#</code> là những ký tự mang cấu trúc trong đó. Một dấu <code>@</code> chưa thoát nằm trong mật khẩu làm bộ phân tích đọc <code>ss:w0rd@localhost</code> thành phần host, và lỗi hiện ra dưới dạng "password authentication failed" hoặc một hostname không phân giải nổi — thế là cả nhóm đi tìm mật khẩu sai thay vì tìm một URL méo. URL không có cú pháp bọc ngoặc; mã hoá phần trăm là cơ chế duy nhất, và <code>encodeURIComponent(mật_khẩu)</code> trong một REPL Node là cách nhanh nhất để lấy đúng. Khối <code>datasource</code> cũng chỉ nhận đúng một <code>env()</code> cho <code>url</code>, nên tách mật khẩu ra biến riêng cũng không phải một lựa chọn.',
          ),
        }),

        mcq({
          prompt: B(
            'A Dockerfile runs <code>npm ci --ignore-scripts</code> to make the build reproducible, copies the source, builds, and ships. The image starts, and the first query throws:' + code(
              "PrismaClientInitializationError:\n" +
              '@prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.',
            ) + 'What did <code>--ignore-scripts</code> break?',
            'Một Dockerfile chạy <code>npm ci --ignore-scripts</code> cho bản dựng lặp lại được, chép mã nguồn, build rồi phát hành. Ảnh khởi động, và truy vấn đầu tiên ném:' + code(
              "PrismaClientInitializationError:\n" +
              '@prisma/client did not initialize yet. Please run "prisma generate" and try to import it again.',
            ) + '<code>--ignore-scripts</code> đã làm hỏng cái gì?',
          ),
          options: [
            B(
              'It skipped the download of the query engine binary, so the client exists with all its models but cannot open a connection until the engine is fetched at first run',
              'Nó bỏ qua bước tải engine truy vấn, nên client vẫn có đủ model nhưng không mở nổi kết nối cho tới khi engine được tải về ở lần chạy đầu tiên',
            ),
            B(
              'It skipped the <code>postinstall</code> hook that runs <code>prisma generate</code>, so <code>@prisma/client</code> is still the empty placeholder package — add an explicit <code>RUN npx prisma generate</code> after the schema is copied in',
              'Nó bỏ qua hook <code>postinstall</code> vốn chạy <code>prisma generate</code>, nên <code>@prisma/client</code> vẫn là gói giữ chỗ rỗng — thêm một dòng <code>RUN npx prisma generate</code> tường minh sau khi lược đồ đã được chép vào',
            ),
            B(
              'It skipped copying <code>schema.prisma</code> into <code>node_modules</code>, so the runtime has no schema to validate against and refuses to build any SQL',
              'Nó bỏ qua bước chép <code>schema.prisma</code> vào <code>node_modules</code>, nên lúc chạy không có lược đồ nào để đối chiếu và client từ chối dựng SQL',
            ),
            B(
              'Nothing — the message means the <code>DATABASE_URL</code> was missing at container start, and <code>--ignore-scripts</code> only affects packages that ship native addons',
              'Không hỏng gì cả — thông báo đó nghĩa là thiếu <code>DATABASE_URL</code> lúc container khởi động, còn <code>--ignore-scripts</code> chỉ ảnh hưởng những gói có phần addon biên dịch sẵn',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The package you install from npm contains no models at all. <code>prisma generate</code> writes them into <code>node_modules/.prisma/client</code>, and <code>@prisma/client</code> is a thin shim that re-exports whatever is there. Normally a <code>postinstall</code> hook runs <code>generate</code> for you on every <code>npm ci</code>, which is exactly the hook <code>--ignore-scripts</code> turns off. Note the ordering trap in the fix: <code>RUN npx prisma generate</code> must come AFTER the layer that copies <code>prisma/schema.prisma</code>, otherwise the CLI has nothing to read and fails with "Could not find Prisma Schema".',
            'Gói bạn cài từ npm không hề chứa model nào. <code>prisma generate</code> mới viết chúng vào <code>node_modules/.prisma/client</code>, còn <code>@prisma/client</code> chỉ là một lớp mỏng xuất lại thứ nằm ở đó. Bình thường một hook <code>postinstall</code> chạy <code>generate</code> giúp bạn sau mỗi lần <code>npm ci</code>, và đó đúng là cái hook mà <code>--ignore-scripts</code> tắt đi. Để ý cái bẫy thứ tự khi sửa: dòng <code>RUN npx prisma generate</code> phải nằm SAU lớp chép <code>prisma/schema.prisma</code> vào, không thì CLI chẳng có gì để đọc và chết với "Could not find Prisma Schema".',
          ),
        }),

        mcq({
          prompt: B(
            'Six Node containers each construct a <code>new PrismaClient()</code> in four different modules, on 8-core hosts, against a PostgreSQL with <code>max_connections = 100</code>. No <code>connection_limit</code> is set. Which two statements are correct? (choose TWO)',
            'Sáu container Node, mỗi cái dựng một <code>new PrismaClient()</code> trong bốn module khác nhau, trên máy 8 nhân, nối tới một PostgreSQL có <code>max_connections = 100</code>. Không đặt <code>connection_limit</code>. Hai phát biểu nào ĐÚNG? (chọn HAI)',
          ),
          options: [
            B(
              'Each <code>PrismaClient</code> instance owns its own pool, so this is 24 pools, not 6 — the default size is <code>num_cpus * 2 + 1</code> per pool, so the ceiling is far above <code>max_connections</code>',
              'Mỗi thực thể <code>PrismaClient</code> có pool riêng, nên đây là 24 pool chứ không phải 6 — kích thước mặc định là <code>num_cpus * 2 + 1</code> cho mỗi pool, nên trần vượt xa <code>max_connections</code>',
            ),
            B(
              'The pool lives inside the query engine rather than in your JavaScript, which is why <code>connection_limit</code> is a URL query parameter and not a constructor option',
              'Pool nằm bên trong engine truy vấn chứ không nằm trong JavaScript của bạn, và đó là lý do <code>connection_limit</code> là một tham số trên URL chứ không phải một tuỳ chọn của hàm dựng',
            ),
            B(
              'Prisma detects sibling instances in the same process and merges them into one shared pool, so the instance count does not matter — only the container count does',
              'Prisma phát hiện các thực thể anh em trong cùng tiến trình rồi gộp chúng vào một pool dùng chung, nên số thực thể không quan trọng — chỉ số container mới quan trọng',
            ),
            B(
              'Waiting for a free connection past <code>pool_timeout</code> raises <code>P1001</code>, the same code you get when the database host is unreachable',
              'Chờ quá <code>pool_timeout</code> mà chưa có kết nối rảnh sẽ ném <code>P1001</code>, đúng mã bạn nhận được khi không với tới được máy chủ cơ sở dữ liệu',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'Two facts do the work here. First, a pool belongs to an instance, not to a process: four modules each doing <code>new PrismaClient()</code> is four pools inside one container, and <code>8 * 2 + 1 = 17</code> connections each is 68 per container before you have served a single request. Nothing merges them — export ONE instance from ONE module. Second, the pool is held by the query engine, which is why you tune it in the connection string (<code>?connection_limit=10&amp;pool_timeout=20</code>) rather than in the constructor. The timeout code is <code>P2024</code> ("Timed out fetching a new connection from the connection pool"); <code>P1001</code> is the network one, and telling them apart decides whether you look at the database or at your own slow queries.',
            'Hai sự thật quyết định câu này. Một, pool thuộc về THỰC THỂ chứ không thuộc về tiến trình: bốn module cùng gọi <code>new PrismaClient()</code> là bốn pool trong một container, và <code>8 * 2 + 1 = 17</code> kết nối mỗi cái thành 68 kết nối một container trước khi phục vụ được lấy một request. Chẳng có gì gộp chúng lại — hãy xuất ĐÚNG MỘT thực thể từ ĐÚNG MỘT module. Hai, pool do engine truy vấn giữ, nên bạn chỉnh nó trong chuỗi kết nối (<code>?connection_limit=10&amp;pool_timeout=20</code>) chứ không phải trong hàm dựng. Mã lỗi hết giờ chờ là <code>P2024</code> ("Timed out fetching a new connection from the connection pool"); <code>P1001</code> mới là mã của mạng, và phân biệt được hai cái quyết định bạn đi soi cơ sở dữ liệu hay đi soi truy vấn chậm của chính mình.',
          ),
        }),

        mcq({
          prompt: B(
            'This ran with <code>log: [&quot;query&quot;]</code> on Prisma 6.19.3, and the six lines below are what it printed, in order:' + code(
              "await prisma.user.create({\n" +
              "  data: { email: 'chi@x.com', posts: { create: [{ slug: 'q1', title: 'Q1' },\n" +
              "                                             { slug: 'q2', title: 'Q2' }] } },\n" +
              '  include: { posts: true },\n' +
              '});',
            ) + code(
              'BEGIN\n' +
              'INSERT INTO "public"."User" ("email","role") VALUES ($1,...) RETURNING "public"."User"."id"\n' +
              'INSERT INTO "public"."Post" (...) VALUES ($1,$2,$3,$4,$5,$6), ($7,$8,$9,$10,$11,$12)\n' +
              'SELECT ... FROM "public"."User" WHERE "public"."User"."id" = $1 LIMIT $2 OFFSET $3\n' +
              'SELECT ... FROM "public"."Post" WHERE "public"."Post"."authorId" IN ($1) OFFSET $2\n' +
              'COMMIT',
            ) + 'Which reading of that log is correct?',
            'Đoạn sau chạy với <code>log: [&quot;query&quot;]</code> trên Prisma 6.19.3, và sáu dòng dưới đây là những gì nó in ra, theo đúng thứ tự:' + code(
              "await prisma.user.create({\n" +
              "  data: { email: 'chi@x.com', posts: { create: [{ slug: 'q1', title: 'Q1' },\n" +
              "                                             { slug: 'q2', title: 'Q2' }] } },\n" +
              '  include: { posts: true },\n' +
              '});',
            ) + code(
              'BEGIN\n' +
              'INSERT INTO "public"."User" ("email","role") VALUES ($1,...) RETURNING "public"."User"."id"\n' +
              'INSERT INTO "public"."Post" (...) VALUES ($1,$2,$3,$4,$5,$6), ($7,$8,$9,$10,$11,$12)\n' +
              'SELECT ... FROM "public"."User" WHERE "public"."User"."id" = $1 LIMIT $2 OFFSET $3\n' +
              'SELECT ... FROM "public"."Post" WHERE "public"."Post"."authorId" IN ($1) OFFSET $2\n' +
              'COMMIT',
            ) + 'Cách đọc log nào ĐÚNG?',
          ),
          options: [
            B(
              'The two <code>SELECT</code>s are Prisma re-reading the rows to fill in database defaults, and they would still be issued without the <code>include</code>',
              'Hai lệnh <code>SELECT</code> là Prisma đọc lại các hàng để điền giá trị mặc định của cơ sở dữ liệu, và chúng vẫn được gửi kể cả khi không có <code>include</code>',
            ),
            B(
              'The multi-row <code>INSERT</code> proves Prisma batched two separate <code>create</code> calls you wrote; nesting itself always produces one statement per child row',
              'Lệnh <code>INSERT</code> nhiều dòng chứng tỏ Prisma đã gộp hai lời gọi <code>create</code> riêng biệt bạn viết; bản thân việc lồng luôn sinh ra một câu lệnh cho mỗi hàng con',
            ),
            B(
              '<code>BEGIN</code> and <code>COMMIT</code> are emitted by the logger for every call, so they say nothing about atomicity — a nested write is four independent statements',
              '<code>BEGIN</code> và <code>COMMIT</code> do bộ ghi log in ra ở mọi lời gọi nên chúng chẳng nói gì về tính nguyên tử — ghi lồng nhau là bốn câu lệnh độc lập',
            ),
            B(
              'The two child rows became ONE multi-row <code>INSERT</code> because they are siblings, the two <code>SELECT</code>s exist only because <code>include</code> was asked for, and the whole thing is one transaction so a failed post rolls the user back too',
              'Hai hàng con gộp thành MỘT lệnh <code>INSERT</code> nhiều dòng vì chúng là anh em, hai lệnh <code>SELECT</code> chỉ có mặt vì bạn xin <code>include</code>, và tất cả nằm trong một giao dịch nên một bài viết hỏng thì người dùng cũng bị cuộn lại',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Copied verbatim from the run. Three things to take away. Siblings at one level are batched into a single multi-row <code>INSERT</code>; LEVELS are sequential, because each level needs the parent id the level above just returned. The two trailing <code>SELECT</code>s are the price of <code>include</code> — drop it and the <code>RETURNING</code> clause supplies everything, and the log is three lines shorter. And the transaction is real: Prisma wraps any nested write in <code>BEGIN</code>/<code>COMMIT</code> so there is no state where the user exists without the posts. Compare with a bare <code>prisma.post.create({ data: { slug, title, authorId: 1 } })</code>, which is one naked <code>INSERT</code> with no transaction at all.',
            'Chép nguyên văn từ lượt chạy thật. Ba điều đáng nhớ. Anh em ở cùng một tầng được gộp thành một lệnh <code>INSERT</code> nhiều dòng; còn các TẦNG thì tuần tự, vì mỗi tầng cần id cha mà tầng trên vừa trả về. Hai lệnh <code>SELECT</code> ở cuối là cái giá của <code>include</code> — bỏ nó đi thì mệnh đề <code>RETURNING</code> lo hết, và log ngắn đi ba dòng. Còn giao dịch thì có thật: Prisma bọc mọi phép ghi lồng trong <code>BEGIN</code>/<code>COMMIT</code> nên không tồn tại trạng thái người dùng có mà bài viết không. Đối chiếu với một lời gọi trần <code>prisma.post.create({ data: { slug, title, authorId: 1 } })</code>: nó là đúng một lệnh <code>INSERT</code> trơ, không giao dịch nào cả.',
          ),
        }),

        mcq({
          prompt: B(
            'A page is slow. The query log says:' + code(
              'prisma:query SELECT ... FROM "public"."Post" WHERE "public"."Post"."title"::text LIKE $1 OFFSET $2\n' +
              'prisma:query duration: 412 ms',
            ) + 'What does the Prisma query log tell you, and what does it NOT tell you?',
            'Một trang chạy chậm. Log truy vấn nói:' + code(
              'prisma:query SELECT ... FROM "public"."Post" WHERE "public"."Post"."title"::text LIKE $1 OFFSET $2\n' +
              'prisma:query duration: 412 ms',
            ) + 'Log truy vấn của Prisma cho bạn biết gì, và KHÔNG cho bạn biết gì?',
          ),
          options: [
            B(
              'It gives you the plan too: the <code>::text</code> cast in the statement is Prisma reporting that the planner chose a cast rather than an index',
              'Nó cho luôn cả kế hoạch: phần ép kiểu <code>::text</code> trong câu lệnh chính là Prisma báo rằng bộ lập kế hoạch chọn ép kiểu thay vì dùng chỉ mục',
            ),
            B(
              'The duration is measured inside PostgreSQL, so 412 ms is pure database time and network latency is already excluded',
              'Thời lượng được đo bên trong PostgreSQL nên 412 ms là thời gian thuần của cơ sở dữ liệu, độ trễ mạng đã bị loại ra rồi',
            ),
            B(
              'It gives you the SQL, the bind parameters and the duration, but never the execution plan — copy the statement out, substitute the parameters, and run <code>EXPLAIN ANALYZE</code> in psql to learn whether it was a sequential scan',
              'Nó cho bạn câu SQL, các tham số ràng buộc và thời lượng, nhưng không bao giờ cho kế hoạch thực thi — hãy chép câu lệnh ra, thay tham số vào, rồi chạy <code>EXPLAIN ANALYZE</code> trong psql để biết nó có phải quét tuần tự hay không',
            ),
            B(
              'Nothing useful here — <code>log: [&quot;query&quot;]</code> prints the JSON protocol message, and the SQL above must have come from a database-side statement log',
              'Chẳng có gì hữu ích ở đây — <code>log: [&quot;query&quot;]</code> in ra thông điệp của giao thức JSON, còn câu SQL ở trên chắc chắn đến từ log câu lệnh phía cơ sở dữ liệu',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The engine reports what it sent and how long the round trip took. Why it was slow is PostgreSQL\'s answer to give, and the loop that fixes Prisma performance is always the same: take the SQL out of the log, put the real parameter values back, run <code>EXPLAIN ANALYZE</code>, change the schema, measure again. Here the shape of the statement already tells you the likely verdict — <code>contains</code> compiles to <code>LIKE \'%…%\'</code>, a leading wildcard no B-tree index can serve, so this was always going to be a scan until someone adds a trigram index. Also worth internalising from the same line: values travel as <code>$1</code>, never concatenated, which is why Prisma Client queries are structurally immune to SQL injection.',
            'Engine báo cho bạn biết nó đã gửi gì và một lượt đi về mất bao lâu. Còn VÌ SAO chậm là câu trả lời của PostgreSQL, và vòng lặp sửa hiệu năng Prisma bao giờ cũng thế: lấy câu SQL ra khỏi log, thay giá trị tham số thật vào, chạy <code>EXPLAIN ANALYZE</code>, sửa lược đồ, đo lại. Ở đây chính hình dạng câu lệnh đã hé lộ kết luận — <code>contains</code> biên dịch thành <code>LIKE \'%…%\'</code>, một ký tự đại diện đứng đầu mà không chỉ mục B-tree nào phục vụ nổi, nên nó vốn dĩ sẽ là một lần quét cho tới khi ai đó thêm chỉ mục trigram. Cũng đáng thuộc từ chính dòng đó: giá trị đi vào dưới dạng <code>$1</code>, không bao giờ nối chuỗi, và đó là lý do truy vấn qua Prisma Client miễn nhiễm về mặt cấu trúc với SQL injection.',
          ),
        }),

        // ── Chương 1 — ORM là gì thật sự ────────────────────────────────
        mcq({
          prompt: B(
            'A schema has 40 models. Which single change makes the generated <code>index.d.ts</code> grow fastest, and why?',
            'Một lược đồ có 40 model. Thay đổi ĐƠN LẺ nào làm <code>index.d.ts</code> sinh ra phình nhanh nhất, và vì sao?',
          ),
          options: [
            B(
              'Adding an enum, because each value becomes its own exported type plus a filter input and an order-by input on every model that references it',
              'Thêm một enum, vì mỗi giá trị thành một kiểu xuất riêng cộng thêm một input lọc và một input sắp xếp trên mọi model tham chiếu tới nó',
            ),
            B(
              'Adding a scalar field, because it appears in roughly twenty Args types per model and the count multiplies by the number of models',
              'Thêm một trường vô hướng, vì nó xuất hiện trong khoảng hai chục kiểu Args mỗi model và con số đó nhân lên theo số model',
            ),
            B(
              'Adding a relation, because BOTH models gain relation filters, nested create/update/upsert inputs and ordering inputs that reference each other',
              'Thêm một quan hệ, vì CẢ HAI model đều mọc thêm bộ lọc quan hệ, các input create/update/upsert lồng nhau và input sắp xếp trỏ chéo vào nhau',
            ),
            B(
              'Adding an <code>@@index</code>, because the index becomes part of the <code>WhereUniqueInput</code> of the model and of every model that can join to it',
              'Thêm một <code>@@index</code>, vì chỉ mục đó trở thành một phần của <code>WhereUniqueInput</code> của model và của mọi model có thể nối tới nó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A field is nearly free and a model is linear — about thirty new types and one new delegate. A relation is the superlinear one: <code>UserWhereInput</code> gains a <code>PostListRelationFilter</code>, <code>PostWhereInput</code> gains a <code>UserRelationFilter</code>, both gain nested write inputs (<code>PostCreateNestedManyWithoutAuthorInput</code>, <code>PostUncheckedUpdateManyWithoutAuthorInput</code>, and so on), and those inputs reference each other. This is why a densely connected schema pushes <code>index.d.ts</code> past a megabyte and makes hovering a query in your editor take seconds — <code>tsc</code> is evaluating deeply nested conditional types on demand. An <code>@@index</code> changes no type at all; it only changes the DDL.',
            'Thêm một trường thì gần như miễn phí, thêm một model thì tuyến tính — khoảng ba chục kiểu mới và một delegate mới. Thêm một quan hệ mới là cái siêu tuyến tính: <code>UserWhereInput</code> mọc thêm <code>PostListRelationFilter</code>, <code>PostWhereInput</code> mọc thêm <code>UserRelationFilter</code>, cả hai mọc thêm các input ghi lồng nhau (<code>PostCreateNestedManyWithoutAuthorInput</code>, <code>PostUncheckedUpdateManyWithoutAuthorInput</code>…), và những input đó lại trỏ vào nhau. Đó là lý do một lược đồ nối chằng chịt đẩy <code>index.d.ts</code> vượt một megabyte và làm việc rê chuột lên một truy vấn trong trình soạn thảo mất vài giây — <code>tsc</code> đang tính các kiểu điều kiện lồng sâu theo yêu cầu. Còn <code>@@index</code> thì không đổi một kiểu nào cả; nó chỉ đổi DDL.',
          ),
        }),

        mcq({
          prompt: B(
            'Inside the generated client, the payload type for a model looks like this:' + code(
              'export type $UserPayload<ExtArgs ...> = {\n' +
              '  name: "User"\n' +
              '  objects: { posts: Prisma.$PostPayload<ExtArgs>[] }\n' +
              '  scalars: $Extensions.GetPayloadResult<{\n' +
              '    id: number\n' +
              '    email: string\n' +
              '    fullName: string | null\n' +
              '  }, ExtArgs["result"]["user"]>\n' +
              '  composites: {}\n' +
              '}',
            ) + 'What is the practical meaning of the split between <code>objects</code> and <code>scalars</code>?',
            'Bên trong client sinh ra, kiểu payload của một model trông như thế này:' + code(
              'export type $UserPayload<ExtArgs ...> = {\n' +
              '  name: "User"\n' +
              '  objects: { posts: Prisma.$PostPayload<ExtArgs>[] }\n' +
              '  scalars: $Extensions.GetPayloadResult<{\n' +
              '    id: number\n' +
              '    email: string\n' +
              '    fullName: string | null\n' +
              '  }, ExtArgs["result"]["user"]>\n' +
              '  composites: {}\n' +
              '}',
            ) + 'Việc tách <code>objects</code> khỏi <code>scalars</code> có ý nghĩa thực tế gì?',
          ),
          options: [
            B(
              'It is the split between <code>include</code> and <code>select</code>: relations live in <code>objects</code> and can only be reached with <code>include</code> or a nested <code>select</code>, while columns live in <code>scalars</code> and are what a bare query returns',
              'Đó chính là ranh giới giữa <code>include</code> và <code>select</code>: quan hệ nằm trong <code>objects</code> và chỉ với tới được bằng <code>include</code> hay một <code>select</code> lồng, còn cột nằm trong <code>scalars</code> và là thứ một truy vấn trần trả về',
            ),
            B(
              'It mirrors the storage layout: <code>scalars</code> are the columns of this table and <code>objects</code> are the columns of the join table Prisma maintains for the relation',
              'Nó phản chiếu cách lưu trữ: <code>scalars</code> là các cột của bảng này còn <code>objects</code> là các cột của bảng nối mà Prisma duy trì cho quan hệ',
            ),
            B(
              'It separates the fields that are safe to serialise from the ones that need conversion — <code>objects</code> holds <code>Decimal</code>, <code>BigInt</code> and <code>Bytes</code>',
              'Nó tách những trường an toàn để tuần tự hoá khỏi những trường cần chuyển đổi — <code>objects</code> chứa <code>Decimal</code>, <code>BigInt</code> và <code>Bytes</code>',
            ),
            B(
              'It marks which fields are lazily loaded: reading a property of <code>objects</code> triggers a query the first time it is touched',
              'Nó đánh dấu trường nào được nạp lười: chạm vào một thuộc tính của <code>objects</code> lần đầu sẽ kích hoạt một truy vấn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Two buckets, two arguments. <code>scalars</code> is what a bare <code>findMany()</code> gives you and what <code>select</code> narrows; <code>objects</code> is what <code>include</code> adds. Every confusing type error Prisma produces is a mismatch in one of those two — a relation named where a scalar was expected, or the reverse. And the fourth option is the one worth rejecting loudly: Prisma has no lazy loading at all. An un-included relation is plain <code>undefined</code>, and reading it crashes instead of quietly issuing a query per iteration, which is precisely why N+1 is harder to write here by accident than in an ORM with proxies.',
            'Hai cái rổ, hai tham số. <code>scalars</code> là thứ một lời gọi <code>findMany()</code> trần đưa cho bạn và là thứ <code>select</code> thu hẹp; <code>objects</code> là thứ <code>include</code> thêm vào. Mọi lỗi kiểu khó hiểu của Prisma đều là một chỗ lệch trong hai cái rổ đó — gọi tên một quan hệ ở chỗ đang chờ một trường vô hướng, hoặc ngược lại. Còn lựa chọn thứ tư là cái đáng bác bỏ to tiếng nhất: Prisma KHÔNG có nạp lười. Một quan hệ chưa include là <code>undefined</code> trơn, và đọc nó thì chết ngay thay vì âm thầm bắn một truy vấn mỗi vòng lặp — đó chính là lý do ở đây khó lỡ tay viết ra N+1 hơn so với một ORM dùng proxy.',
          ),
        }),

        mcq({
          prompt: B(
            'An application runs on Supabase. <code>DATABASE_URL</code> points at the pooler on port 6543, and <code>npx prisma migrate deploy</code> in CI fails while the application itself works fine. Which datasource setting fixes it, and what does it do?',
            'Một ứng dụng chạy trên Supabase. <code>DATABASE_URL</code> trỏ vào pooler ở cổng 6543, và <code>npx prisma migrate deploy</code> trong CI thì hỏng trong khi bản thân ứng dụng vẫn chạy tốt. Thiết lập nào trong <code>datasource</code> sửa được, và nó làm gì?',
          ),
          options: [
            B(
              '<code>shadowDatabaseUrl</code> — a disposable database that <code>migrate</code> replays every migration into; the pooler cannot host one, so pointing it elsewhere unblocks the deploy',
              '<code>shadowDatabaseUrl</code> — một cơ sở dữ liệu dùng một lần mà <code>migrate</code> phát lại mọi migration vào; pooler không chứa nổi một cái như thế nên trỏ nó đi chỗ khác là thông',
            ),
            B(
              '<code>relationMode = &quot;prisma&quot;</code> — emulated relations remove the DDL that a transaction-mode pooler refuses to run',
              '<code>relationMode = &quot;prisma&quot;</code> — quan hệ mô phỏng bỏ đi phần DDL mà một pooler chạy chế độ giao dịch từ chối thực thi',
            ),
            B(
              '<code>directUrl</code> — an un-pooled connection that the CLI uses instead of <code>url</code>, because migrations need session-level statements a transaction-mode pooler does not support',
              '<code>directUrl</code> — một kết nối không qua pool mà CLI dùng thay cho <code>url</code>, vì migration cần những câu lệnh ở mức phiên mà pooler chế độ giao dịch không hỗ trợ',
            ),
            B(
              '<code>engineType = &quot;binary&quot;</code> — the separate engine process opens its own session and bypasses the pooler entirely',
              '<code>engineType = &quot;binary&quot;</code> — tiến trình engine riêng tự mở phiên của nó và đi vòng qua pooler hoàn toàn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A pooler in transaction mode hands you a different backend connection per statement, which is fine for ordinary queries and fatal for DDL, advisory locks and anything else that assumes a session. <code>directUrl</code> exists exactly for this: the CLI (<code>migrate</code>, <code>db pull</code>, <code>studio</code>) uses it, your application keeps using <code>url</code> and keeps the pooling it needs — which on serverless is the whole point. <code>shadowDatabaseUrl</code> is a different job (<code>migrate dev</code> needs a scratch database to diff against, and <code>migrate deploy</code> never uses one), and neither of the last two options has anything to do with the pooler.',
            'Một pooler chạy chế độ giao dịch đưa cho bạn một kết nối nền khác nhau ở mỗi câu lệnh — ổn với truy vấn thường và chí tử với DDL, advisory lock và mọi thứ giả định có một phiên. <code>directUrl</code> sinh ra đúng cho việc này: CLI (<code>migrate</code>, <code>db pull</code>, <code>studio</code>) dùng nó, còn ứng dụng của bạn vẫn dùng <code>url</code> và vẫn giữ được pool nó cần — thứ mà trên serverless mới là toàn bộ lý do tồn tại. <code>shadowDatabaseUrl</code> là việc khác (<code>migrate dev</code> cần một cơ sở dữ liệu nháp để so, còn <code>migrate deploy</code> không bao giờ dùng tới), và hai lựa chọn cuối chẳng liên quan gì tới pooler.',
          ),
        }),

        mcq({
          prompt: B(
            'A team moves to a database that forbids foreign keys and sets <code>relationMode = &quot;prisma&quot;</code>. Which consequence is easiest to overlook?',
            'Một nhóm chuyển sang cơ sở dữ liệu cấm khoá ngoại và đặt <code>relationMode = &quot;prisma&quot;</code>. Hậu quả nào dễ bị bỏ sót nhất?',
          ),
          options: [
            B(
              'The database no longer auto-indexes anything on the referencing side, so every relation scalar needs an explicit <code>@@index</code> or joins and cascade emulation turn into sequential scans',
              'Cơ sở dữ liệu không còn tự đánh chỉ mục gì ở phía tham chiếu nữa, nên mọi trường vô hướng của quan hệ đều cần một <code>@@index</code> tường minh, không thì phép nối và phần mô phỏng cascade biến thành quét tuần tự',
            ),
            B(
              '<code>onDelete: Cascade</code> stops compiling and every relation must drop the argument before <code>generate</code> will run again',
              '<code>onDelete: Cascade</code> hết biên dịch được và mọi quan hệ phải bỏ tham số đó đi thì <code>generate</code> mới chạy lại',
            ),
            B(
              'The generated client grows substantially because each relation is emitted twice, once for the real form and once for the emulated form',
              'Client sinh ra phình lên đáng kể vì mỗi quan hệ được phát ra hai lần, một bản thật và một bản mô phỏng',
            ),
            B(
              'Nested writes stop being transactional, so each level of a nested <code>create</code> commits on its own',
              'Ghi lồng nhau hết còn tính giao dịch, nên mỗi tầng của một lời gọi <code>create</code> lồng tự commit riêng',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Emulation has three costs and only two of them are obvious. Correctness: anything writing outside Prisma — a psql session, an admin tool, a Python job — can create orphans freely and nothing notices. Speed: a write that touches a relation gains a read first. The one people miss is indexing. With real constraints the database at least gives you a unique index on the referenced side and PostgreSQL will not let you drop it; with emulation there is no constraint, so nothing is created on your behalf and the emulated cascade delete has to find children by scanning. <code>onDelete</code> keeps compiling — the query engine simply performs the action itself with extra statements instead of handing it to the database.',
            'Mô phỏng có ba cái giá và chỉ hai cái là hiển nhiên. Tính đúng đắn: mọi thứ ghi vào ngoài Prisma — một phiên psql, một công cụ quản trị, một job Python — đều tha hồ tạo hàng mồ côi và chẳng gì nhận ra. Tốc độ: mỗi phép ghi đụng tới quan hệ đều mọc thêm một phép đọc đứng trước. Cái người ta hay sót là chỉ mục. Có ràng buộc thật thì cơ sở dữ liệu ít nhất cũng cho bạn một chỉ mục duy nhất ở phía được tham chiếu và PostgreSQL không cho bạn xoá nó; mô phỏng thì không có ràng buộc nào, nên chẳng ai tạo giúp bạn cái gì và phần xoá dây chuyền mô phỏng phải đi quét mới tìm ra con. <code>onDelete</code> vẫn biên dịch bình thường — engine truy vấn chỉ đơn giản tự thực hiện hành vi đó bằng thêm vài câu lệnh thay vì giao cho cơ sở dữ liệu.',
          ),
        }),

        mcq({
          prompt: B(
            'You inherit a ten-year-old MySQL database and run <code>npx prisma db pull</code>. It succeeds and writes 61 models. Which two things will introspection NOT have captured? (choose TWO)',
            'Bạn tiếp quản một cơ sở dữ liệu MySQL mười năm tuổi và chạy <code>npx prisma db pull</code>. Nó chạy xong và viết ra 61 model. Hai thứ nào phép nội soi sẽ KHÔNG bắt được? (chọn HAI)',
          ),
          options: [
            B(
              'A relation between two tables that was never given a foreign key constraint — it introspects as two unrelated scalar columns and you must add the <code>@relation</code> yourself',
              'Một quan hệ giữa hai bảng chưa từng được cấp ràng buộc khoá ngoại — nó nội soi ra thành hai cột vô hướng không liên quan, và bạn phải tự thêm <code>@relation</code>',
            ),
            B(
              'Triggers, check constraints, row-level security policies and stored procedures — they keep working in the database and Prisma simply does not know about them',
              'Trigger, ràng buộc CHECK, chính sách bảo mật mức hàng và thủ tục lưu sẵn — chúng vẫn chạy trong cơ sở dữ liệu và Prisma đơn giản là không biết chúng tồn tại',
            ),
            B(
              'Composite primary keys, which have no representation in the schema language and become a model marked <code>@@ignore</code>',
              'Khoá chính phức hợp, thứ không có cách diễn đạt nào trong ngôn ngữ lược đồ nên thành một model bị đánh dấu <code>@@ignore</code>',
            ),
            B(
              'Column defaults, which are always dropped on the first pull because Prisma cannot tell a database default from an application default',
              'Giá trị mặc định của cột, thứ luôn bị bỏ đi ở lần pull đầu vì Prisma không phân biệt nổi mặc định của cơ sở dữ liệu với mặc định của ứng dụng',
            ),
          ],
          correct: [0, 1],
          explanation: EX(
            'Introspection reads only what the database ENCODES as structure. A foreign key constraint is structure, so the relation appears; a convention that "<code>user_id</code> means users.id" is not, so it does not — and legacy MySQL is full of the second kind. Everything procedural — triggers, checks, RLS, functions, partial and expression indexes — is invisible to the model even though it is very much alive in the database, which matters most on the day a migration rewrites a table and takes those objects with it. Composite keys are expressible (<code>@@id([a, b])</code>) and column defaults are read correctly; the model marked <code>@@ignore</code> is the one with no primary key at all, since Prisma Client cannot address a row it cannot identify.',
            'Nội soi chỉ đọc được thứ mà cơ sở dữ liệu MÃ HOÁ thành cấu trúc. Ràng buộc khoá ngoại là cấu trúc nên quan hệ hiện ra; còn quy ước "<code>user_id</code> nghĩa là users.id" thì không, nên nó không hiện — và MySQL đời cũ đầy loại thứ hai. Mọi thứ mang tính thủ tục — trigger, CHECK, RLS, hàm, chỉ mục một phần và chỉ mục biểu thức — đều vô hình với model dù chúng sống rất khoẻ trong cơ sở dữ liệu, và điều đó quan trọng nhất vào cái ngày một migration viết lại bảng và cuốn theo luôn những đối tượng ấy. Khoá phức hợp thì diễn đạt được (<code>@@id([a, b])</code>) và giá trị mặc định của cột thì đọc đúng; model bị đánh dấu <code>@@ignore</code> là model KHÔNG có khoá chính nào cả, vì Prisma Client không địa chỉ hoá được một hàng nó không định danh nổi.',
          ),
        }),

        // ── Chương 2 — Ngôn ngữ lược đồ ─────────────────────────────────
        mcq({
          prompt: B(
            'A column is <code>amount Decimal @db.Decimal(12, 2)</code> holding <code>0.10</code>. This was run on Prisma 6.19.3 and the output is copied verbatim:' + code(
              'const row = await prisma.quirk.findUniqueOrThrow({ where: { id: 1 } });\n' +
              "console.log(JSON.stringify({ a: row.amount }));\n" +
              'console.log(row.amount + 1);\n' +
              'console.log(row.amount.plus(1).toFixed(2));',
            ) + code(
              '{"a":"0.10"}\n' +
              '0.101\n' +
              '1.10',
            ) + 'Which explanation matches that output?',
            'Một cột là <code>amount Decimal @db.Decimal(12, 2)</code> đang giữ <code>0.10</code>. Đoạn sau chạy trên Prisma 6.19.3 và kết quả được chép nguyên văn:' + code(
              'const row = await prisma.quirk.findUniqueOrThrow({ where: { id: 1 } });\n' +
              "console.log(JSON.stringify({ a: row.amount }));\n" +
              'console.log(row.amount + 1);\n' +
              'console.log(row.amount.plus(1).toFixed(2));',
            ) + code(
              '{"a":"0.10"}\n' +
              '0.101\n' +
              '1.10',
            ) + 'Lời giải thích nào khớp với kết quả đó?',
          ),
          options: [
            B(
              'The value came back as a JavaScript <code>number</code>, so <code>JSON.stringify</code> quoted it to preserve the two decimal places and <code>+ 1</code> hit floating-point rounding',
              'Giá trị trở về dưới dạng <code>number</code> của JavaScript, nên <code>JSON.stringify</code> đặt nó vào ngoặc kép để giữ hai chữ số thập phân, còn <code>+ 1</code> thì dính sai số dấu phẩy động',
            ),
            B(
              'Prisma serialises every <code>Decimal</code> as its internal representation <code>{"s":1,"e":-1,"d":[1000000]}</code>; the string above appeared only because <code>@db.Decimal(12, 2)</code> pins the scale',
              'Prisma tuần tự hoá mọi <code>Decimal</code> thành biểu diễn nội bộ <code>{"s":1,"e":-1,"d":[1000000]}</code>; chuỗi ở trên chỉ xuất hiện vì <code>@db.Decimal(12, 2)</code> ghim sẵn phần thập phân',
            ),
            B(
              'The <code>0.101</code> on the second line is exact decimal arithmetic — <code>Decimal</code> overloads <code>+</code>, and <code>.plus()</code> is only an alias kept for readability',
              '<code>0.101</code> ở dòng thứ hai là phép tính thập phân chính xác — <code>Decimal</code> nạp chồng toán tử <code>+</code>, còn <code>.plus()</code> chỉ là bí danh giữ lại cho dễ đọc',
            ),
            B(
              'A <code>Prisma.Decimal</code> has a <code>toJSON</code>, so it serialises as a JSON STRING rather than as its internals; the real trap is the second line, where <code>+</code> concatenates because the value is an object, not a number',
              'Một <code>Prisma.Decimal</code> có <code>toJSON</code> nên nó tuần tự hoá thành một CHUỖI JSON chứ không phải phần ruột của nó; cái bẫy thật nằm ở dòng thứ hai, nơi <code>+</code> nối chuỗi vì giá trị là một object chứ không phải một số',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured on 6.19.3, for a <code>Decimal</code> read from PostgreSQL and for one built by hand: <code>JSON.stringify</code> gives a quoted string. That is good news — a client receives <code>"0.10"</code> and not a bag of internals — but it also means the value is a STRING on the wire, so a frontend doing arithmetic on it needs its own conversion. The line that actually costs money is <code>row.amount + 1</code>: JavaScript has no operator overloading, so <code>+</code> falls back to string concatenation and you get <code>"0.101"</code>, which looks like a plausible price. Use <code>.plus()</code>, <code>.times()</code>, <code>.toFixed(2)</code>, and <code>.toNumber()</code> only where you accept the precision loss. <code>BigInt</code> behaves differently again: <code>JSON.stringify</code> throws outright rather than serialising wrongly.',
            'Đo trên 6.19.3, với cả <code>Decimal</code> đọc từ PostgreSQL lẫn <code>Decimal</code> tự dựng: <code>JSON.stringify</code> cho ra một chuỗi có ngoặc kép. Đó là tin tốt — client nhận được <code>"0.10"</code> chứ không phải một mớ ruột gan — nhưng cũng có nghĩa giá trị đi trên dây là một CHUỖI, nên frontend nào tính toán trên nó thì phải tự chuyển đổi. Dòng thật sự tốn tiền là <code>row.amount + 1</code>: JavaScript không có nạp chồng toán tử, nên <code>+</code> rơi về nối chuỗi và bạn nhận <code>"0.101"</code> — trông y như một cái giá hợp lý. Hãy dùng <code>.plus()</code>, <code>.times()</code>, <code>.toFixed(2)</code>, và chỉ dùng <code>.toNumber()</code> ở chỗ bạn chấp nhận mất độ chính xác. <code>BigInt</code> lại cư xử khác nữa: <code>JSON.stringify</code> ném lỗi thẳng chứ không tuần tự hoá sai.',
          ),
        }),

        mcq({
          prompt: B(
            'A model declares <code>tags String[]</code> with no <code>@default</code>. On Prisma 6.19.3 the generated DDL, a row inserted by <code>prisma.quirk.create({ data: {} })</code>, and a row inserted by plain SQL were all inspected:' + code(
              '-- migrate diff\n' +
              '"tags" TEXT[],\n\n' +
              '-- \\d "Quirk"  ->  tags | text[] | nullable | (no default)\n\n' +
              'SELECT id, tags IS NULL AS tags_null FROM "Quirk";\n' +
              ' id | tags_null\n' +
              '----+-----------\n' +
              '  1 | t\n' +
              ' 99 | t',
            ) + 'and yet <code>prisma.quirk.findUnique(...)</code> returns <code>{ id: 99, tags: [] }</code>. What is going on?',
            'Một model khai <code>tags String[]</code> không kèm <code>@default</code>. Trên Prisma 6.19.3, DDL sinh ra, một hàng do <code>prisma.quirk.create({ data: {} })</code> chèn và một hàng do SQL trần chèn đều được soi:' + code(
              '-- migrate diff\n' +
              '"tags" TEXT[],\n\n' +
              '-- \\d "Quirk"  ->  tags | text[] | nullable | (không có default)\n\n' +
              'SELECT id, tags IS NULL AS tags_null FROM "Quirk";\n' +
              ' id | tags_null\n' +
              '----+-----------\n' +
              '  1 | t\n' +
              ' 99 | t',
            ) + 'vậy mà <code>prisma.quirk.findUnique(...)</code> lại trả về <code>{ id: 99, tags: [] }</code>. Chuyện gì đang xảy ra?',
          ),
          options: [
            B(
              'The <code>IS NULL</code> check is misleading: an empty PostgreSQL array is indistinguishable from <code>NULL</code> in a boolean test, so the column does hold <code>{}</code>',
              'Phép kiểm <code>IS NULL</code> gây hiểu nhầm: một mảng PostgreSQL rỗng không phân biệt được với <code>NULL</code> trong một phép thử boolean, nên cột thật sự đang giữ <code>{}</code>',
            ),
            B(
              'A list field is never optional, so Prisma wrote <code>{}</code> and the <code>t</code> column above is reporting on <code>tags2</code>, a second array field with a different default',
              'Trường danh sách không bao giờ optional, nên Prisma đã ghi <code>{}</code> và cột <code>t</code> ở trên đang báo về <code>tags2</code>, một trường mảng thứ hai có default khác',
            ),
            B(
              'The column really is <code>NULL</code> and Prisma Client normalises it to <code>[]</code> on read; write <code>@default([])</code> if you want the database itself to hold <code>{}</code>, because anything reading the column outside Prisma sees <code>NULL</code>',
              'Cột đúng là đang <code>NULL</code> và Prisma Client chuẩn hoá nó thành <code>[]</code> lúc đọc; hãy viết <code>@default([])</code> nếu bạn muốn chính cơ sở dữ liệu giữ <code>{}</code>, vì mọi thứ đọc cột đó ngoài Prisma đều thấy <code>NULL</code>',
            ),
            B(
              'Prisma Client caches array fields per model and returns the last value it wrote, which was <code>[]</code> from the <code>create({ data: {} })</code> earlier in the same process',
              'Prisma Client lưu đệm các trường mảng theo model rồi trả về giá trị cuối cùng nó ghi, tức <code>[]</code> từ lời gọi <code>create({ data: {} })</code> trước đó trong cùng tiến trình',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured, and it contradicts the lesson: without <code>@default([])</code> the column is nullable with no default, and <code>create({ data: {} })</code> does not even mention it in the <code>INSERT</code>, so the row lands with SQL <code>NULL</code>. Prisma hides that on the way back out, which is why nobody notices from JavaScript. Everyone else notices: <code>array_length(tags, 1)</code> is <code>NULL</code>, <code>cardinality(tags)</code> is <code>NULL</code>, <code>unnest</code> produces no rows, a report counting non-empty tag lists gets a different answer than the app, and <code>tags @&gt; ARRAY[\'x\']</code> is <code>NULL</code> rather than false. Declare <code>@default([])</code> and the DDL becomes <code>DEFAULT ARRAY[]::text[]</code> so every writer, Prisma or not, produces the same shape.',
            'Đo thật, và nó ngược với bài học: không có <code>@default([])</code> thì cột cho phép NULL và không có default, còn <code>create({ data: {} })</code> thậm chí không nhắc tới nó trong câu <code>INSERT</code>, nên hàng nằm lại với SQL <code>NULL</code>. Prisma giấu chuyện đó lúc đọc ra, nên nhìn từ JavaScript không ai thấy. Mọi người khác thì thấy: <code>array_length(tags, 1)</code> ra <code>NULL</code>, <code>cardinality(tags)</code> ra <code>NULL</code>, <code>unnest</code> không sinh hàng nào, một báo cáo đếm số danh sách thẻ khác rỗng cho ra con số khác với ứng dụng, và <code>tags @&gt; ARRAY[\'x\']</code> trả <code>NULL</code> chứ không phải false. Khai <code>@default([])</code> thì DDL thành <code>DEFAULT ARRAY[]::text[]</code>, và mọi người ghi — Prisma hay không — đều cho ra cùng một hình dạng.',
          ),
        }),

        mcq({
          prompt: B(
            'Two versions of the same model were written, and the query below compiles against exactly one of them:' + code(
              'model A { …  @@unique([subjectId, recipientId], name: "uk_share") }\n' +
              'model B { …  @@unique([subjectId, recipientId], map: "uk_share")  }',
            ) + code(
              'where: { subjectId_recipientId: { subjectId: 3, recipientId: 9 } }',
            ) + 'Which model does it compile against, and what did the other argument change?',
            'Hai phiên bản của cùng một model được viết ra, và truy vấn dưới đây biên dịch được với đúng một trong hai:' + code(
              'model A { …  @@unique([subjectId, recipientId], name: "uk_share") }\n' +
              'model B { …  @@unique([subjectId, recipientId], map: "uk_share")  }',
            ) + code(
              'where: { subjectId_recipientId: { subjectId: 3, recipientId: 9 } }',
            ) + 'Nó biên dịch với model nào, và tham số còn lại đã đổi cái gì?',
          ),
          options: [
            B(
              'Model A. <code>name:</code> is documentation only and never reaches the generated types, while <code>map:</code> renames both the constraint and the query key',
              'Model A. <code>name:</code> chỉ mang tính tài liệu và không bao giờ tới được các kiểu sinh ra, còn <code>map:</code> đổi tên cả ràng buộc lẫn khoá truy vấn',
            ),
            B(
              'Both. The compound key is always derived from the field names, and the two arguments only differ in whether the constraint name appears in <code>\\d</code> output',
              'Cả hai. Khoá phức hợp luôn suy ra từ tên các trường, và hai tham số chỉ khác nhau ở chỗ tên ràng buộc có hiện trong kết quả <code>\\d</code> hay không',
            ),
            B(
              'Neither. A compound unique is addressed as <code>where: { AND: [{ subjectId: 3 }, { recipientId: 9 }] }</code>, and both <code>name:</code> and <code>map:</code> are database-side only',
              'Không cái nào. Một unique phức hợp được địa chỉ bằng <code>where: { AND: [{ subjectId: 3 }, { recipientId: 9 }] }</code>, và cả <code>name:</code> lẫn <code>map:</code> đều chỉ nằm ở phía cơ sở dữ liệu',
            ),
            B(
              'Model B. <code>map:</code> renames only the constraint in the database and leaves the generated query key as <code>subjectId_recipientId</code>; <code>name:</code> replaces that key, so model A must be queried as <code>where: { uk_share: { … } }</code>',
              'Model B. <code>map:</code> chỉ đổi tên ràng buộc dưới cơ sở dữ liệu và giữ nguyên khoá truy vấn sinh ra là <code>subjectId_recipientId</code>; còn <code>name:</code> thay hẳn khoá đó, nên model A phải truy vấn bằng <code>where: { uk_share: { … } }</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two arguments, two jobs, and mixing them up produces a TypeScript error that reads like nonsense — the field names are right there in your object, and the compiler insists the property does not exist on the input type. <code>name:</code> renames the KEY you query by. <code>map:</code> renames the CONSTRAINT in the database, which is what you want when adopting a schema with house naming conventions or when the generated name would pass PostgreSQL\'s 63-character identifier limit. This exact mistake is in the CuongThai repository\'s known-error log for 2026-06-29, on the <code>NoteSubjectShare</code> model. The same distinction applies to <code>@relation</code>: <code>name:</code> disambiguates two relations between the same pair of models, <code>map:</code> names the foreign key constraint.',
            'Hai tham số, hai nhiệm vụ, và lẫn lộn chúng đẻ ra một lỗi TypeScript đọc lên như vô nghĩa — tên các trường sờ sờ trong object của bạn, còn trình biên dịch cứ khăng khăng thuộc tính đó không tồn tại trong kiểu input. <code>name:</code> đổi KHOÁ mà bạn dùng để truy vấn. <code>map:</code> đổi tên RÀNG BUỘC dưới cơ sở dữ liệu — thứ bạn cần khi tiếp quản một lược đồ có quy ước đặt tên riêng, hoặc khi tên sinh ra sẽ vượt giới hạn 63 ký tự cho định danh của PostgreSQL. Đúng cái lỗi này nằm trong nhật ký lỗi đã biết của kho CuongThai ngày 29/06/2026, ở model <code>NoteSubjectShare</code>. Cùng một sự phân biệt ấy áp cho <code>@relation</code>: <code>name:</code> phân định hai quan hệ giữa cùng một cặp model, còn <code>map:</code> đặt tên cho ràng buộc khoá ngoại.',
          ),
        }),

        mcq({
          prompt: B(
            'A <code>title</code> column is <code>TEXT</code> and holds rows up to 240 characters. Someone decides 20 is enough and writes <code>title String @db.VarChar(20)</code>. What happens, and what was the reasoning error?',
            'Cột <code>title</code> đang là <code>TEXT</code> và chứa những hàng dài tới 240 ký tự. Ai đó quyết định 20 là đủ và viết <code>title String @db.VarChar(20)</code>. Chuyện gì xảy ra, và sai lầm trong lập luận là gì?',
          ),
          options: [
            B(
              'PostgreSQL truncates the overlong values silently and the migration succeeds, which is why narrowing a populated column must always be preceded by a backup',
              'PostgreSQL cắt cụt các giá trị quá dài một cách âm thầm và migration thành công — đó là lý do thu hẹp một cột đã có dữ liệu bao giờ cũng phải sao lưu trước',
            ),
            B(
              'The migration succeeds because <code>@db.VarChar</code> only changes the TypeScript type; the SQL column stays <code>TEXT</code> and the limit is enforced by Prisma Client on write',
              'Migration thành công vì <code>@db.VarChar</code> chỉ đổi kiểu TypeScript; cột SQL vẫn là <code>TEXT</code> và giới hạn do Prisma Client áp lúc ghi',
            ),
            B(
              'The migration warns and then PostgreSQL refuses with <code>22001 value too long for type character varying(20)</code>, leaving the data untouched — and in PostgreSQL a length limit is a constraint, not a speed optimisation: <code>VARCHAR(n)</code> and <code>TEXT</code> store and perform identically',
              'Migration cảnh báo rồi PostgreSQL từ chối với <code>22001 value too long for type character varying(20)</code>, dữ liệu không suy suyển — và trong PostgreSQL, giới hạn độ dài là một RÀNG BUỘC chứ không phải tối ưu tốc độ: <code>VARCHAR(n)</code> và <code>TEXT</code> lưu và chạy y hệt nhau',
            ),
            B(
              'It succeeds and the table shrinks noticeably, because <code>VARCHAR(20)</code> reserves exactly twenty bytes per row while <code>TEXT</code> is stored out of line in TOAST',
              'Nó thành công và bảng nhỏ đi thấy rõ, vì <code>VARCHAR(20)</code> giữ đúng hai mươi byte mỗi hàng còn <code>TEXT</code> thì lưu ngoài dòng trong TOAST',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is Prisma behaving well: it warns before generating the migration, and if you proceed the database refuses rather than truncating, so the migration fails and no data is lost. Widening is always safe and instant; narrowing needs a plan — <code>SELECT max(length(title)) FROM posts</code> first, decide what happens to the rows that do not fit, and write those steps into the migration by hand before applying it. The deeper point is the motive: people add <code>@db.VarChar(n)</code> hoping for speed, and in PostgreSQL there is none to gain. Add it when the limit is a real business rule you want the database to enforce, and remember that the limit itself now needs a migration to change.',
            'Đây là Prisma cư xử tử tế: nó cảnh báo trước khi sinh migration, và nếu bạn vẫn tiến tới thì cơ sở dữ liệu từ chối chứ không cắt cụt, nên migration hỏng và không mất dữ liệu nào. Nới rộng thì luôn an toàn và tức thì; thu hẹp thì cần một kế hoạch — chạy <code>SELECT max(length(title)) FROM posts</code> trước, quyết xem những hàng không vừa sẽ ra sao, rồi viết các bước ấy vào migration bằng tay trước khi áp. Điểm sâu hơn nằm ở động cơ: người ta thêm <code>@db.VarChar(n)</code> để mong nhanh hơn, mà trong PostgreSQL thì chẳng nhanh hơn tí nào. Chỉ thêm nó khi giới hạn ấy là một luật nghiệp vụ thật mà bạn muốn cơ sở dữ liệu ép, và nhớ rằng bản thân cái giới hạn từ nay muốn đổi lại phải có một migration.',
          ),
        }),

        mcq({
          prompt: B(
            'One <code>Date</code> was written to two columns — a plain <code>DateTime</code> and a <code>DateTime @db.Timestamptz(3)</code> — then read back in two psql sessions:' + code(
              "const t = new Date('2026-08-23T10:00:00+07:00');   -- 03:00 UTC\n\n" +
              "SET TIME ZONE 'UTC';           noTz -> 2026-08-23 03:00:00     withTz -> 2026-08-23 03:00:00+00\n" +
              "SET TIME ZONE 'Asia/Bangkok';  noTz -> 2026-08-23 03:00:00     withTz -> 2026-08-23 10:00:00+07",
            ) + 'What does that prove, and when does the plain column actually hurt?',
            'Một <code>Date</code> được ghi vào hai cột — một <code>DateTime</code> trần và một <code>DateTime @db.Timestamptz(3)</code> — rồi đọc lại trong hai phiên psql:' + code(
              "const t = new Date('2026-08-23T10:00:00+07:00');   -- 03:00 UTC\n\n" +
              "SET TIME ZONE 'UTC';           noTz -> 2026-08-23 03:00:00     withTz -> 2026-08-23 03:00:00+00\n" +
              "SET TIME ZONE 'Asia/Bangkok';  noTz -> 2026-08-23 03:00:00     withTz -> 2026-08-23 10:00:00+07",
            ) + 'Điều đó chứng minh gì, và cột trần thật sự gây hại lúc nào?',
          ),
          options: [
            B(
              'The plain column lost the instant, so Prisma reads a different moment back and every round trip through the ORM is already wrong',
              'Cột trần đã đánh mất thời điểm, nên Prisma đọc lại ra một khoảnh khắc khác và mọi lượt đi về qua ORM đều đã sai sẵn',
            ),
            B(
              'The plain column stores a wall-clock reading with no zone attached; Prisma converts to UTC on the way in and back on the way out so it round-trips fine, and the damage appears the moment anything else touches the data — psql, a BI tool, a report, an <code>AT TIME ZONE</code> in a raw migration',
              'Cột trần lưu một số đọc đồng hồ treo tường không gắn múi giờ nào; Prisma đổi sang UTC lúc ghi vào và đổi ngược lúc đọc ra nên đi về vẫn đúng, và thiệt hại chỉ hiện ra ngay khi có thứ khác chạm vào dữ liệu — psql, một công cụ BI, một báo cáo, một phép <code>AT TIME ZONE</code> trong migration thô',
            ),
            B(
              '<code>TIMESTAMPTZ</code> stores the offset <code>+07</code> alongside the value, which is why the Bangkok session can render it; the plain column has nowhere to put that offset',
              '<code>TIMESTAMPTZ</code> lưu độ lệch <code>+07</code> kèm theo giá trị, và đó là lý do phiên Bangkok hiển thị được nó; cột trần thì không có chỗ nào để cất độ lệch ấy',
            ),
            B(
              'Nothing meaningful: the two columns differ only in how psql formats them, and both hold the same UTC instant, so the choice is presentational',
              'Chẳng chứng minh gì đáng kể: hai cột chỉ khác nhau ở cách psql định dạng, cả hai đều giữ cùng một thời điểm UTC, nên chọn cái nào chỉ là chuyện trình bày',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Read <code>noTz</code> twice: it prints <code>03:00</code> in both sessions, because it is a pair of numbers with no idea what zone they belong to. <code>withTz</code> prints the correct local rendering of the same instant in each session, because PostgreSQL knows. Note what <code>TIMESTAMPTZ</code> does NOT do — it does not store an offset; it normalises to UTC and renders in the session zone, which is why the third option is wrong even though it sounds right. Through Prisma alone the plain column behaves, and that is exactly what makes it dangerous: the bug is dormant until the first report, the first analytics job or the first hand-written migration, and by then the data is years deep. Use <code>@db.Timestamptz(3)</code> for anything that is a moment, <code>@db.Date</code> for a calendar date, and reserve the plain form for a genuine wall-clock time like "the shop opens at 09:00".',
            'Đọc <code>noTz</code> hai lần: nó in <code>03:00</code> ở cả hai phiên, vì nó là một cặp con số chẳng biết mình thuộc múi giờ nào. <code>withTz</code> in ra đúng cách hiển thị địa phương của cùng một thời điểm ở mỗi phiên, vì PostgreSQL biết. Để ý thứ <code>TIMESTAMPTZ</code> KHÔNG làm — nó không lưu độ lệch; nó chuẩn hoá về UTC rồi hiển thị theo múi giờ của phiên, và đó là lý do lựa chọn thứ ba sai dù nghe rất xuôi tai. Chỉ đi qua Prisma thì cột trần vẫn ngoan, và chính điều đó làm nó nguy hiểm: lỗi nằm im cho tới bản báo cáo đầu tiên, job phân tích đầu tiên hay migration viết tay đầu tiên, mà tới lúc ấy dữ liệu đã dày mấy năm. Dùng <code>@db.Timestamptz(3)</code> cho mọi thứ là một thời điểm, <code>@db.Date</code> cho một ngày lịch, và để dành dạng trần cho một giờ đồng hồ treo tường thật sự như "cửa hàng mở lúc 09:00".',
          ),
        }),

        mcq({
          prompt: B(
            'An enum value must be renamed. Production rows still hold the old value. Renaming it in the schema and running <code>migrate dev</code> produced this:' + code(
              'BEGIN;\n' +
              'CREATE TYPE "OrderStatus_new" AS ENUM (\'MOI\', \'DANG_XU_LY\', \'HOAN_TAT\', \'DA_HUY\');\n' +
              'ALTER TABLE "Order" ALTER COLUMN "trangThai" DROP DEFAULT;\n' +
              'ALTER TABLE "Order" ALTER COLUMN "trangThai" TYPE "OrderStatus_new"\n' +
              '  USING ("trangThai"::text::"OrderStatus_new");\n' +
              'ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";\n' +
              'ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";\n' +
              'DROP TYPE "OrderStatus_old";\n' +
              'COMMIT;',
            ) + 'What is the safe way to ship this?',
            'Cần đổi tên một giá trị enum. Các hàng trên production vẫn đang giữ giá trị cũ. Đổi tên trong lược đồ rồi chạy <code>migrate dev</code> cho ra thế này:' + code(
              'BEGIN;\n' +
              'CREATE TYPE "OrderStatus_new" AS ENUM (\'MOI\', \'DANG_XU_LY\', \'HOAN_TAT\', \'DA_HUY\');\n' +
              'ALTER TABLE "Order" ALTER COLUMN "trangThai" DROP DEFAULT;\n' +
              'ALTER TABLE "Order" ALTER COLUMN "trangThai" TYPE "OrderStatus_new"\n' +
              '  USING ("trangThai"::text::"OrderStatus_new");\n' +
              'ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";\n' +
              'ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";\n' +
              'DROP TYPE "OrderStatus_old";\n' +
              'COMMIT;',
            ) + 'Cách phát hành an toàn là gì?',
          ),
          options: [
            B(
              'Ship it as generated but outside peak hours: the <code>USING</code> cast rewrites the rows, and the only real risk is the exclusive lock the <code>ALTER TABLE</code> holds while it does so',
              'Cứ phát hành nguyên như nó sinh ra nhưng tránh giờ cao điểm: phép ép <code>USING</code> viết lại các hàng, và rủi ro thật duy nhất là cái khoá độc quyền mà <code>ALTER TABLE</code> giữ trong lúc đó',
            ),
            B(
              'Add the new value in one migration and ship it; backfill every row and every code path; remove the old value in a SECOND migration — because the cast above fails on any row still holding the old value',
              'Thêm giá trị mới trong một migration rồi phát hành; đổ lại dữ liệu cho mọi hàng và sửa mọi nhánh mã; rồi mới gỡ giá trị cũ trong một migration THỨ HAI — vì phép ép ở trên chết ngay với bất kỳ hàng nào còn giữ giá trị cũ',
            ),
            B(
              'Replace the block with <code>ALTER TYPE "OrderStatus" RENAME VALUE \'DA_GIAO\' TO \'HOAN_TAT\'</code>, which is the one statement Prisma should have generated and which needs no backfill',
              'Thay cả khối bằng <code>ALTER TYPE "OrderStatus" RENAME VALUE \'DA_GIAO\' TO \'HOAN_TAT\'</code> — đúng một câu lệnh mà lẽ ra Prisma nên sinh ra, và nó không cần đổ lại dữ liệu',
            ),
            B(
              'Run <code>prisma db push</code> instead, which rewrites the enum in place and remaps existing values by ordinal position rather than by name',
              'Chạy <code>prisma db push</code> thay thế — nó viết lại enum tại chỗ và ánh xạ các giá trị cũ theo VỊ TRÍ thứ tự chứ không theo tên',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Read the <code>USING</code> clause: it casts the old value to <code>text</code> and then into the new type. A row holding <code>DA_GIAO</code> has no target in the new enum, so the cast raises <code>invalid input value for enum</code> and the whole transaction rolls back — on production, mid-deploy. Expand then contract is the general shape and it is the same pattern as adding a required column: add the new thing while the old thing still works, migrate the data and the code, then remove the old thing in a separate deploy. Adding a value is genuinely cheap by comparison — a single <code>ALTER TYPE … ADD VALUE</code>. And note the deeper habit this enum story is famous for in this repository: never hand-copy a union the generator already produces, or a rename type-checks against itself and breaks the seed on production.',
            'Đọc kỹ mệnh đề <code>USING</code>: nó ép giá trị cũ sang <code>text</code> rồi sang kiểu mới. Một hàng còn giữ <code>DA_GIAO</code> thì chẳng có đích nào trong enum mới, nên phép ép ném <code>invalid input value for enum</code> và cả giao dịch cuộn lại — trên production, giữa lúc deploy. Nở-rồi-co là hình dạng chung, và nó cùng một khuôn với việc thêm một cột bắt buộc: thêm cái mới trong lúc cái cũ vẫn chạy, chuyển dữ liệu và chuyển mã, rồi mới gỡ cái cũ ở một lần deploy riêng. So ra thì THÊM một giá trị rẻ thật — đúng một câu <code>ALTER TYPE … ADD VALUE</code>. Và nhớ luôn thói quen sâu hơn mà câu chuyện enum này nổi tiếng trong kho mã này: đừng bao giờ chép tay một union mà bộ sinh mã đã tạo sẵn, không thì một lần đổi tên sẽ tự kiểm với chính nó rồi làm vỡ seed trên production.',
          ),
        }),

        mcq({
          prompt: B(
            'A model needs a pgvector column, which Prisma cannot model:' + code(
              'model Diadiem {\n' +
              '  id     Int         @id @default(autoincrement())\n' +
              '  name   String\n' +
              '  vector Unsupported("vector(1536)")\n' +
              '}',
            ) + 'What is the consequence of declaring that field as REQUIRED?',
            'Một model cần một cột pgvector, thứ Prisma không mô hình hoá được:' + code(
              'model Diadiem {\n' +
              '  id     Int         @id @default(autoincrement())\n' +
              '  name   String\n' +
              '  vector Unsupported("vector(1536)")\n' +
              '}',
            ) + 'Khai trường đó là BẮT BUỘC dẫn tới hậu quả gì?',
          ),
          options: [
            B(
              'Prisma generates a <code>Bytes</code>-like field for it, so writes work but the value round-trips as an opaque buffer you have to encode yourself',
              'Prisma sinh ra cho nó một trường kiểu như <code>Bytes</code>, nên ghi vẫn được nhưng giá trị đi về dưới dạng một buffer mù mà bạn phải tự mã hoá',
            ),
            B(
              'The schema fails validation — an <code>Unsupported</code> field must be optional or carry a database default',
              'Lược đồ không qua được validate — một trường <code>Unsupported</code> bắt buộc phải optional hoặc phải mang một giá trị mặc định ở phía cơ sở dữ liệu',
            ),
            B(
              'The migration creates the column correctly, but the field is absent from the generated client, so <code>prisma.diadiem.create()</code> cannot supply it and the model becomes uncreatable through Prisma Client — inserts must go through <code>$executeRaw</code>',
              'Migration tạo cột đúng, nhưng trường đó vắng mặt trong client sinh ra, nên <code>prisma.diadiem.create()</code> không cung cấp nổi giá trị và model thành ra không tạo được qua Prisma Client — phải chèn bằng <code>$executeRaw</code>',
            ),
            B(
              'Nothing changes for writes; Prisma fills an <code>Unsupported</code> required column with the SQL type\'s zero value, which for <code>vector(1536)</code> is a zero vector',
              'Không có gì đổi với phép ghi; Prisma điền vào một cột <code>Unsupported</code> bắt buộc bằng giá trị không của kiểu SQL, mà với <code>vector(1536)</code> thì đó là một vector toàn số không',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>Unsupported</code> tells the migration engine what SQL type to create and tells the client to look away. The column is fully usable by PostgreSQL and by raw SQL; it simply does not exist as a field. Combine that with <code>NOT NULL</code> and every <code>create()</code> is missing a required column, so the whole model can only be written through <code>$executeRaw</code>. Three ways out: make it optional, give it a database default with <code>@default(dbgenerated(…))</code>, or accept that inserts are raw. This is the honest boundary of the tool rather than a defect — PostGIS geometry, pgvector embeddings, <code>tsvector</code> full-text and range types all live here, and the CuongThai database uses exactly this pattern for its embeddings.',
            '<code>Unsupported</code> nói cho engine migration biết phải tạo kiểu SQL nào, và nói cho client biết hãy ngoảnh đi. Cột đó PostgreSQL và SQL thô dùng được đầy đủ; nó chỉ không tồn tại dưới dạng một trường. Ghép thêm <code>NOT NULL</code> vào là mọi lời gọi <code>create()</code> đều thiếu một cột bắt buộc, nên cả model chỉ ghi được qua <code>$executeRaw</code>. Ba đường ra: cho nó optional, cho nó một mặc định phía cơ sở dữ liệu bằng <code>@default(dbgenerated(…))</code>, hoặc chấp nhận rằng phép chèn là SQL thô. Đây là ranh giới thành thật của công cụ chứ không phải một khiếm khuyết — hình học PostGIS, vector nhúng pgvector, toàn văn <code>tsvector</code> và các kiểu khoảng đều nằm ở đây, và cơ sở dữ liệu CuongThai dùng đúng khuôn này cho phần vector nhúng của nó.',
          ),
        }),

        // ── Chương 3 — Quan hệ ──────────────────────────────────────────
        mcq({
          prompt: B(
            'Three ways to attach a new post to author 1 were each run once on Prisma 6.19.3 with query logging on, and the statements were counted:' + code(
              "A  prisma.post.create({ data: { slug, title, authorId: 1 } })\n" +
              "B  prisma.post.create({ data: { slug, title, author: { connect: { id: 1 } } } })\n" +
              "C  prisma.post.create({ data: { slug, title, author: { connect: { email: 'an@x.com' } } } })",
            ) + 'Which row matches the measurement?',
            'Ba cách gắn một bài viết mới vào tác giả số 1, mỗi cách chạy một lần trên Prisma 6.19.3 với log truy vấn bật, rồi đếm số câu lệnh:' + code(
              "A  prisma.post.create({ data: { slug, title, authorId: 1 } })\n" +
              "B  prisma.post.create({ data: { slug, title, author: { connect: { id: 1 } } } })\n" +
              "C  prisma.post.create({ data: { slug, title, author: { connect: { email: 'an@x.com' } } } })",
            ) + 'Dòng nào khớp với số đo?',
          ),
          options: [
            B(
              'A and B = one bare <code>INSERT</code> each, because the primary key IS the foreign key value; only C needs a lookup, so only C becomes a transaction',
              'A và B = mỗi cái một lệnh <code>INSERT</code> trần, vì khoá chính CHÍNH LÀ giá trị của khoá ngoại; chỉ C mới cần tra cứu nên chỉ C thành một giao dịch',
            ),
            B(
              'All three are identical, because Prisma normalises <code>authorId</code> into <code>connect</code> before the engine ever sees the arguments',
              'Cả ba giống hệt nhau, vì Prisma chuẩn hoá <code>authorId</code> thành <code>connect</code> trước khi engine kịp nhìn thấy tham số',
            ),
            B(
              'A is the risky one: writing the scalar skips the constraint, so a bad <code>authorId</code> creates an orphan row that only surfaces on the next join',
              'A mới là cái rủi ro: ghi thẳng trường vô hướng là bỏ qua ràng buộc, nên một <code>authorId</code> sai sẽ tạo ra một hàng mồ côi mà mãi tới lần nối sau mới lộ',
            ),
            B(
              'A = one bare <code>INSERT</code>, no transaction. B and C = the SAME shape: <code>BEGIN</code>, a <code>SELECT</code> of the parent key, the <code>INSERT</code>, a <code>SELECT</code> of the result, <code>COMMIT</code> — connecting always verifies the parent first, whichever unique field you name',
              'A = một lệnh <code>INSERT</code> trần, không giao dịch. B và C = CÙNG một hình: <code>BEGIN</code>, một <code>SELECT</code> lấy khoá cha, lệnh <code>INSERT</code>, một <code>SELECT</code> lấy kết quả, <code>COMMIT</code> — connect luôn kiểm tra hàng cha trước, bất kể bạn nêu trường unique nào',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured on 6.19.3, and it contradicts the lesson, which claims connect-by-primary-key writes straight into the <code>INSERT</code> with no lookup. It does not: <code>connect</code> always confirms the parent exists first, so B and C cost the same five log lines. That matters in a loop — five hundred imports written with <code>connect</code> pay five hundred extra round trips for a check the foreign key constraint would have done for free. If you already hold the id, pass the scalar. And option four is wrong for the reason that makes A safe at all: <code>author_id</code> carries a <code>REFERENCES</code> constraint, so a bad value is rejected by PostgreSQL and reaches you as <code>P2003</code>, not as an orphan.',
            'Đo trên 6.19.3, và nó ngược với bài học — bài học nói connect theo khoá chính ghi thẳng vào <code>INSERT</code> mà không cần tra cứu. Không hề: <code>connect</code> luôn xác nhận hàng cha có tồn tại trước, nên B và C cùng tốn đúng năm dòng log. Chuyện đó có ý nghĩa trong một vòng lặp — năm trăm lần nhập viết bằng <code>connect</code> phải trả năm trăm lượt đi về thêm cho một phép kiểm mà ràng buộc khoá ngoại vốn làm giúp miễn phí. Có sẵn id thì cứ truyền thẳng trường vô hướng. Còn lựa chọn thứ tư sai đúng vì cái lý do khiến A vẫn an toàn: cột <code>author_id</code> mang một ràng buộc <code>REFERENCES</code>, nên giá trị sai bị PostgreSQL từ chối và tới tay bạn dưới dạng <code>P2003</code> chứ không phải một hàng mồ côi.',
          ),
        }),

        mcq({
          prompt: B(
            'A required relation is given <code>onDelete: SetNull</code>. On Prisma 6.19.3 this is what happened, end to end:' + code(
              'authorId Int\n' +
              'author   User @relation(fields: [authorId], references: [id], onDelete: SetNull)',
            ) + code(
              '$ npx prisma validate\n' +
              'Prisma schema warning:\n' +
              '- The `onDelete` referential action of a relation should not be set to `SetNull`\n' +
              '  when a referenced field is required. ...\n' +
              'The schema at prisma/schema.prisma is valid 🚀\n\n' +
              '-- migrate diff\n' +
              'ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId")\n' +
              '  REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;',
            ) + 'When does this blow up?',
            'Một quan hệ bắt buộc được gán <code>onDelete: SetNull</code>. Trên Prisma 6.19.3, đây là toàn bộ diễn biến:' + code(
              'authorId Int\n' +
              'author   User @relation(fields: [authorId], references: [id], onDelete: SetNull)',
            ) + code(
              '$ npx prisma validate\n' +
              'Prisma schema warning:\n' +
              '- The `onDelete` referential action of a relation should not be set to `SetNull`\n' +
              '  when a referenced field is required. ...\n' +
              'The schema at prisma/schema.prisma is valid 🚀\n\n' +
              '-- migrate diff\n' +
              'ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId")\n' +
              '  REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;',
            ) + 'Nó nổ vào lúc nào?',
          ),
          options: [
            B(
              'At migration time: PostgreSQL refuses to create a <code>SET NULL</code> action on a <code>NOT NULL</code> column, so the deploy fails and no bad constraint is ever installed',
              'Lúc migration: PostgreSQL từ chối tạo hành vi <code>SET NULL</code> trên một cột <code>NOT NULL</code>, nên deploy hỏng và không có ràng buộc xấu nào được cài đặt',
            ),
            B(
              'Never, in practice: <code>SET NULL</code> on a <code>NOT NULL</code> column silently degrades to <code>RESTRICT</code>, which is why the message is only a warning',
              'Trên thực tế thì không bao giờ: <code>SET NULL</code> trên một cột <code>NOT NULL</code> âm thầm tụt xuống thành <code>RESTRICT</code>, và đó là lý do thông báo kia chỉ là cảnh báo',
            ),
            B(
              'At the first query that reads a post, because the client cannot map a possibly-null column onto a required field and throws a validation error',
              'Ở truy vấn đầu tiên đọc một bài viết, vì client không ánh xạ nổi một cột có thể null vào một trường bắt buộc và ném lỗi validation',
            ),
            B(
              'At the first <code>DELETE</code> of a parent that still has children: PostgreSQL runs <code>UPDATE ... SET "authorId" = NULL</code> and hits <code>ERROR: null value in column "authorId" violates not-null constraint</code>, so the delete fails at runtime with a message about a column nobody was writing to',
              'Ở lần <code>DELETE</code> đầu tiên xoá một hàng cha vẫn còn con: PostgreSQL chạy <code>UPDATE ... SET "authorId" = NULL</code> rồi đụng <code>ERROR: null value in column "authorId" violates not-null constraint</code>, nên phép xoá chết lúc chạy với một thông báo về một cột chẳng ai đang ghi vào',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Measured end to end, and the lesson\'s claim that Prisma rejects this schema is simply not what 6.19.3 does — it warns and passes. The constraint is created happily, because PostgreSQL only checks the referential action when it FIRES. Reproduced with plain SQL: two tables, a <code>NOT NULL</code> child column with <code>ON DELETE SET NULL</code>, one parent row deleted, and you get <code>ERROR: null value in column "pid" of relation "ch" violates not-null constraint</code> with <code>CONTEXT: SQL statement "UPDATE ONLY ... SET "pid" = NULL"</code>. The general lesson is worth more than the specific one: a warning your deploy scrolls past can be a runtime bomb, and "the schema validates" is not the same claim as "the schema is right". Either make the relation optional or pick <code>Restrict</code>, <code>Cascade</code> or <code>SetDefault</code>.',
            'Đo đủ từ đầu đến cuối, và lời khẳng định của bài học rằng Prisma từ chối lược đồ này đơn giản không phải thứ 6.19.3 làm — nó cảnh báo rồi cho qua. Ràng buộc được tạo ngon lành, vì PostgreSQL chỉ kiểm hành vi tham chiếu vào lúc nó KÍCH HOẠT. Dựng lại bằng SQL trần: hai bảng, một cột con <code>NOT NULL</code> kèm <code>ON DELETE SET NULL</code>, xoá một hàng cha, và bạn nhận <code>ERROR: null value in column "pid" of relation "ch" violates not-null constraint</code> kèm <code>CONTEXT: SQL statement "UPDATE ONLY ... SET "pid" = NULL"</code>. Bài học chung đáng giá hơn bài học riêng: một cảnh báo mà lần deploy của bạn lướt qua có thể là một quả bom hẹn giờ, và "lược đồ hợp lệ" không phải cùng một lời khẳng định với "lược đồ đúng". Hoặc cho quan hệ thành optional, hoặc chọn <code>Restrict</code>, <code>Cascade</code> hay <code>SetDefault</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'A <code>Post</code> ↔ <code>Tag</code> many-to-many is currently implicit (<code>tags Tag[]</code> and <code>posts Post[]</code>, no join model). The product now wants to record WHO attached each tag and WHEN, and the analytics team wants "the twenty most used tags this month". What has to change, and what does the change buy?',
            'Quan hệ nhiều–nhiều <code>Post</code> ↔ <code>Tag</code> hiện đang là dạng ẩn (<code>tags Tag[]</code> và <code>posts Post[]</code>, không có model nối). Sản phẩm giờ muốn ghi lại AI gắn thẻ và gắn LÚC NÀO, còn nhóm phân tích muốn "hai mươi thẻ được dùng nhiều nhất tháng này". Phải đổi gì, và đổi rồi được gì?',
          ),
          options: [
            B(
              'Declare the join as an explicit model. You gain a delegate (<code>groupBy</code>, <code>createMany</code>, <code>deleteMany</code>), you gain the extra columns, and you gain a separate <code>onDelete</code> per side — the implicit table has none of those and always cascades both ways',
              'Khai bảng nối thành một model tường minh. Bạn có một delegate (<code>groupBy</code>, <code>createMany</code>, <code>deleteMany</code>), có các cột phụ, và có <code>onDelete</code> riêng cho từng phía — bảng ẩn không có thứ nào trong đó và luôn cascade cả hai chiều',
            ),
            B(
              'Nothing has to change: extra columns go on the implicit table through <code>@relation</code> arguments, and the join table is queryable as <code>prisma.postToTag</code>',
              'Không phải đổi gì cả: các cột phụ được thêm vào bảng ẩn qua tham số của <code>@relation</code>, và bảng nối truy vấn được bằng <code>prisma.postToTag</code>',
            ),
            B(
              'Keep it implicit and add a second model that references the implicit table by its <code>A</code> and <code>B</code> columns, which is what the naming convention exists for',
              'Cứ giữ dạng ẩn và thêm một model thứ hai tham chiếu vào bảng ẩn qua hai cột <code>A</code> và <code>B</code> — quy ước đặt tên sinh ra chính là để làm việc đó',
            ),
            B(
              'Switch the datasource to <code>relationMode = &quot;prisma&quot;</code>, which materialises implicit join tables as real models in the generated client',
              'Chuyển datasource sang <code>relationMode = &quot;prisma&quot;</code> — nó hiện thực hoá các bảng nối ẩn thành model thật trong client sinh ra',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The implicit table is exactly two integer columns, <code>A</code> and <code>B</code>, named after the two models in alphabetical order, with the pair as the primary key and <code>ON DELETE CASCADE</code> on both sides that you cannot configure. It has no id, no timestamps, no delegate in the client, and no way to be referenced by a third table. The moment the link itself carries information — when, by whom, a quantity, a sort order, a grade — or the moment you want to query the link rather than the endpoints, implicit is finished. Converting later is a real migration with a data copy, and its highest-risk line is the <code>INSERT ... SELECT "B", "A"</code>: the columns are swapped because <code>A</code> is the alphabetically first model, and getting it backwards silently pairs everything with the wrong partner while both counts still match. Which is why the honest advice is to start explicit unless you are certain.',
            'Bảng ẩn đúng là hai cột số nguyên, <code>A</code> và <code>B</code>, đặt theo hai model xếp theo bảng chữ cái, lấy cặp làm khoá chính và mang <code>ON DELETE CASCADE</code> ở cả hai phía mà bạn không chỉnh được. Nó không có id, không có mốc thời gian, không có delegate trong client, và không có cách nào để một bảng thứ ba trỏ vào. Ngay khi bản thân cái liên kết mang thông tin — lúc nào, ai gắn, số lượng bao nhiêu, thứ tự nào, điểm mấy — hoặc ngay khi bạn muốn truy vấn chính cái liên kết thay vì hai đầu, dạng ẩn hết đường. Chuyển đổi về sau là một migration thật có chép dữ liệu, và dòng rủi ro nhất của nó là <code>INSERT ... SELECT "B", "A"</code>: hai cột bị đảo vì <code>A</code> là model đứng trước theo bảng chữ cái, và làm ngược là ghép âm thầm mọi thứ với sai đối tác trong khi hai con số đếm vẫn khớp nhau. Chính vì thế lời khuyên thành thật là cứ tường minh ngay từ đầu trừ khi bạn chắc chắn.',
          ),
        }),

        mcq({
          prompt: B(
            'A comment tree is modelled as a self-relation:' + code(
              'model Comment {\n' +
              '  id       Int       @id @default(autoincrement())\n' +
              '  parentId Int?      @map("parent_id")\n' +
              '  parent   Comment?  @relation("TraLoi", fields: [parentId], references: [id])\n' +
              '  replies  Comment[] @relation("TraLoi")\n' +
              '}',
            ) + 'Why is the <code>"TraLoi"</code> name mandatory here, and why must <code>parentId</code> be optional?',
            'Một cây bình luận được mô hình hoá bằng tự quan hệ:' + code(
              'model Comment {\n' +
              '  id       Int       @id @default(autoincrement())\n' +
              '  parentId Int?      @map("parent_id")\n' +
              '  parent   Comment?  @relation("TraLoi", fields: [parentId], references: [id])\n' +
              '  replies  Comment[] @relation("TraLoi")\n' +
              '}',
            ) + 'Vì sao cái tên <code>"TraLoi"</code> ở đây là bắt buộc, và vì sao <code>parentId</code> phải optional?',
          ),
          options: [
            B(
              'The name is the pairing: two fields on <code>Comment</code> both have type <code>Comment</code>, so without a shared name Prisma cannot tell which one is the other side of which — and a root comment has no parent, so a required <code>parentId</code> would leave the table with no possible first row',
              'Cái tên chính là phép ghép cặp: hai trường trên <code>Comment</code> đều có kiểu <code>Comment</code>, nên không có một cái tên chung thì Prisma không biết cái nào là phía đối diện của cái nào — và một bình luận gốc thì không có cha, nên <code>parentId</code> bắt buộc sẽ khiến bảng không thể có nổi hàng đầu tiên',
            ),
            B(
              'The name becomes the foreign key constraint name in the database, and <code>parentId</code> is optional so that deleting a parent can null out its replies instead of cascading',
              'Cái tên trở thành tên ràng buộc khoá ngoại dưới cơ sở dữ liệu, còn <code>parentId</code> để optional để khi xoá cha thì có thể để các trả lời thành null thay vì xoá dây chuyền',
            ),
            B(
              'The name tells Prisma to generate a recursive <code>include</code> for the relation, and <code>parentId</code> must be optional because the recursion needs a terminating value',
              'Cái tên báo cho Prisma sinh ra một <code>include</code> đệ quy cho quan hệ, và <code>parentId</code> phải optional vì phép đệ quy cần một giá trị dừng',
            ),
            B(
              'Neither is mandatory — <code>prisma format</code> infers both the pairing and the optionality from the field names <code>parent</code> and <code>replies</code>',
              'Chẳng cái nào bắt buộc cả — <code>prisma format</code> tự suy ra cả phép ghép cặp lẫn tính tuỳ chọn từ hai tên trường <code>parent</code> và <code>replies</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Drop the name and validation says <em>Ambiguous relation detected. The fields … both refer to <code>Comment</code>. Please provide different relation names</em>. The same argument disambiguates two models joined more than once — a post with an author and a reviewer, where the point of separating them is that they get different policies: <code>Restrict</code> on the author so deleting a user cannot silently erase their posts, <code>SetNull</code> on the reviewer so it merely clears the field. Two other things worth carrying out of this model: index <code>parentId</code>, because "the replies to this comment" is the query the whole feature is built on and it is a sequential scan without it; and remember that no amount of nested <code>include</code> reaches the bottom of a tree — each level is one more hand-written level and one more statement, and the level after your last one is simply missing, with no error.',
            'Bỏ cái tên đi thì validate nói <em>Ambiguous relation detected. The fields … both refer to <code>Comment</code>. Please provide different relation names</em>. Cũng tham số ấy phân định hai model nối nhau nhiều hơn một lần — một bài viết có tác giả và có người duyệt, mà cái hay của việc tách chúng ra chính là mỗi cái được một chính sách riêng: <code>Restrict</code> cho tác giả để xoá một người dùng không âm thầm xoá sạch bài họ viết, <code>SetNull</code> cho người duyệt để nó chỉ xoá trắng cái trường ấy. Hai điều nữa đáng mang theo từ model này: hãy đánh chỉ mục <code>parentId</code>, vì "các trả lời của bình luận này" là truy vấn mà cả tính năng dựng lên trên đó, và thiếu nó là quét tuần tự; và nhớ rằng lồng <code>include</code> bao nhiêu tầng cũng không chạm được đáy cây — mỗi tầng là một tầng viết tay và một câu lệnh nữa, còn tầng ngay sau tầng cuối cùng của bạn thì đơn giản là biến mất, không lỗi nào cả.',
          ),
        }),

        mcq({
          prompt: B(
            'A one-to-one is declared with the key on the wrong side:' + code(
              'model User {\n' +
              '  id        Int     @id @default(autoincrement())\n' +
              '  profileId Int     @unique\n' +
              '  profile   Profile @relation(fields: [profileId], references: [id])\n' +
              '}',
            ) + 'What does that cost, and what is the rule for choosing?',
            'Một quan hệ một–một được khai với khoá đặt nhầm phía:' + code(
              'model User {\n' +
              '  id        Int     @id @default(autoincrement())\n' +
              '  profileId Int     @unique\n' +
              '  profile   Profile @relation(fields: [profileId], references: [id])\n' +
              '}',
            ) + 'Cái đó tốn gì, và luật để chọn là gì?',
          ),
          options: [
            B(
              'It costs a join on every profile read; the rule is to keep the key on whichever side is read most often, so a profile page needs no second statement',
              'Nó tốn một phép nối ở mỗi lần đọc hồ sơ; luật là giữ khoá ở phía nào được đọc nhiều nhất, để trang hồ sơ không cần thêm câu lệnh thứ hai',
            ),
            B(
              'It costs nothing at the database level — <code>@unique</code> makes both directions symmetric — but <code>prisma format</code> will move the key to the other side on the next run',
              'Nó chẳng tốn gì ở mức cơ sở dữ liệu — <code>@unique</code> làm hai chiều đối xứng — nhưng <code>prisma format</code> sẽ tự dời khoá sang phía kia ở lần chạy sau',
            ),
            B(
              'Registering a user now requires inventing a <code>Profile</code> first (<code>UserCreateInput</code> demands it), so the key belongs on the side that is optional and created later — and on the smaller or rarer side, to avoid a mostly-<code>NULL</code> column on the big table',
              'Từ giờ đăng ký một người dùng phải bịa ra một <code>Profile</code> trước (<code>UserCreateInput</code> đòi cho bằng được), nên khoá thuộc về phía nào là tuỳ chọn và sinh ra sau — và thuộc phía nhỏ hơn hoặc hiếm hơn, để tránh một cột phần lớn là <code>NULL</code> trên cái bảng to',
            ),
            B(
              'It makes the relation many-to-one, because a foreign key on the parent side cannot be unique in PostgreSQL and the <code>@unique</code> is silently dropped from the DDL',
              'Nó biến quan hệ thành nhiều–một, vì một khoá ngoại đặt ở phía cha thì không thể unique trong PostgreSQL và <code>@unique</code> bị âm thầm gạt khỏi DDL',
            ),
          ],
          correct: 2,
          explanation: EX(
            'A one-to-one is a one-to-many with a <code>@unique</code> on the foreign key — that is the whole mechanism, and it explains the rest. Whichever side carries <code>fields:</code> owns the column, and whichever side owns the column has to exist SECOND. Put it on <code>User</code> and <code>prisma.user.create({ data: { email } })</code> stops compiling with <em>Property \'profile\' is missing in type … but required in type \'UserCreateInput\'</em>, so every registration invents an empty profile. Three rules that all point the same way: the key goes on the optional side, on the side created later, and on the smaller side — ten million users with forty thousand subscriptions means <code>Subscription.userId</code>, never <code>User.subscriptionId</code>. Fixing it later is a real migration with a backfill, which is why it is worth five minutes now.',
            'Một quan hệ một–một là một quan hệ một–nhiều cộng thêm <code>@unique</code> trên khoá ngoại — cơ chế chỉ có thế, và nó giải thích tất cả phần còn lại. Phía nào mang <code>fields:</code> thì phía đó sở hữu cột, và phía nào sở hữu cột thì phía đó phải tồn tại SAU. Đặt nó lên <code>User</code> là <code>prisma.user.create({ data: { email } })</code> hết biên dịch được với <em>Property \'profile\' is missing in type … but required in type \'UserCreateInput\'</em>, thế là mỗi lần đăng ký lại phải bịa ra một hồ sơ rỗng. Ba luật cùng chỉ về một hướng: khoá đi về phía tuỳ chọn, về phía sinh ra sau, và về phía nhỏ hơn — mười triệu người dùng với bốn mươi nghìn gói đăng ký nghĩa là <code>Subscription.userId</code>, không bao giờ là <code>User.subscriptionId</code>. Sửa về sau là một migration thật có bước đổ lại dữ liệu, nên nó đáng năm phút suy nghĩ ngay bây giờ.',
          ),
        }),

        mcq({
          prompt: B(
            'A team wants "every user must have a profile and every profile must have a user", so both relation fields are declared required. <code>prisma validate</code> answers:' + code(
              'error: Error parsing attribute "@relation": The relation field `profile` on Model `User`\n' +
              "is required. This is not valid because it's not possible to enforce this constraint on\n" +
              'the database level. Please change the field type from `Profile` to `Profile?` to fix this.',
            ) + 'Why can the database not enforce it, and what is the way forward?',
            'Một nhóm muốn "mỗi người dùng phải có một hồ sơ và mỗi hồ sơ phải có một người dùng", nên khai cả hai trường quan hệ là bắt buộc. <code>prisma validate</code> trả lời:' + code(
              'error: Error parsing attribute "@relation": The relation field `profile` on Model `User`\n' +
              "is required. This is not valid because it's not possible to enforce this constraint on\n" +
              'the database level. Please change the field type from `Profile` to `Profile?` to fix this.',
            ) + 'Vì sao cơ sở dữ liệu không ép được, và đường đi tiếp là gì?',
          ),
          options: [
            B(
              'Because a required one-to-one would need a composite primary key spanning both tables, which PostgreSQL has no syntax for',
              'Vì một quan hệ một–một bắt buộc sẽ cần một khoá chính phức hợp trải qua cả hai bảng, thứ mà PostgreSQL không có cú pháp nào diễn đạt',
            ),
            B(
              'Because the generated TypeScript type would be mutually recursive and infinite; adding <code>@relation(name:)</code> to both sides breaks the cycle and the schema then validates',
              'Vì kiểu TypeScript sinh ra sẽ đệ quy lẫn nhau và vô hạn; thêm <code>@relation(name:)</code> vào cả hai phía là phá được vòng lặp và lược đồ sẽ hợp lệ',
            ),
            B(
              'It can be enforced — set <code>relationMode = &quot;prisma&quot;</code> so the query engine checks both directions itself, which is the documented way to model a mandatory pair',
              'Ép được chứ — đặt <code>relationMode = &quot;prisma&quot;</code> để engine truy vấn tự kiểm cả hai chiều; đó là cách được ghi trong tài liệu để mô hình hoá một cặp bắt buộc',
            ),
            B(
              'Neither row could ever be created first — each insert would violate the other side\'s constraint — so the back-relation side of a one-to-one is ALWAYS optional; enforce the rule in your application, or ask why the two are separate tables at all',
              'Chẳng hàng nào có thể được tạo trước — mỗi lần chèn đều vi phạm ràng buộc của phía kia — nên phía quan hệ ngược của một–một LUÔN LUÔN là tuỳ chọn; hãy ép luật đó trong ứng dụng, hoặc tự hỏi vì sao hai thứ ấy lại là hai bảng riêng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is a chicken-and-egg the database cannot resolve. To insert the user you need a profile id; to insert the profile you need a user id. The only escape is deferrable constraints inside an explicit transaction, which is far more machinery than the requirement is worth, so Prisma refuses the shape rather than pretending. Two practical consequences. First, the guarantee has to move into your service layer — create both together in one nested write and never let a bare user be created elsewhere. Second, it is often the wrong question: if a profile is truly mandatory and always read with the user, those are three columns that belong on <code>users</code>, and the split was buying nothing. Split a table when the extra data is rare, is large, or has a different lifecycle — not to keep the model tidy.',
            'Đây là bài toán con gà quả trứng mà cơ sở dữ liệu không giải nổi. Muốn chèn người dùng thì cần id hồ sơ; muốn chèn hồ sơ thì cần id người dùng. Đường thoát duy nhất là ràng buộc trì hoãn được bên trong một giao dịch tường minh, thứ máy móc hơn nhiều so với giá trị của yêu cầu, nên Prisma từ chối hình dạng đó thay vì giả vờ. Hai hệ quả thực tế. Một, sự đảm bảo ấy phải dời vào tầng service — tạo cả hai cùng lúc bằng một phép ghi lồng, và đừng để chỗ nào khác tạo ra một người dùng trơ trọi. Hai, đó thường là một câu hỏi sai: nếu hồ sơ đúng là bắt buộc và luôn được đọc kèm người dùng thì đó là ba cột thuộc về bảng <code>users</code>, và việc tách bảng chẳng mua được gì. Hãy tách bảng khi phần dữ liệu thêm là hiếm, là lớn, hoặc có vòng đời khác — chứ không phải để cho model trông gọn.',
          ),
        }),

        // ── Chương 4 — Đọc và ghi ───────────────────────────────────────
        mcq({
          prompt: B(
            'Three calls were logged on Prisma 6.19.3 and the statements counted:' + code(
              'A  user.findMany({ include: { posts: true } })                         -> 2 statements\n' +
              'B  user.findMany({ include: { _count: { select: { posts: true } } } }) -> 1 statement\n' +
              'C  user.findMany({ include: { posts: true,\n' +
              '                              _count: { select: { posts: true } } } }) -> 2 statements',
            ) + 'and the single statement of B was:' + code(
              'SELECT "User"."id", ..., COALESCE("aggr_selection_0_Post"."_aggr_count_posts", 0) AS "_aggr_count_posts"\n' +
              'FROM "public"."User"\n' +
              'LEFT JOIN (SELECT "Post"."authorId", COUNT(*) AS "_aggr_count_posts"\n' +
              '           FROM "public"."Post" WHERE 1=1 GROUP BY "Post"."authorId") AS "aggr_selection_0_Post"\n' +
              '  ON ("User"."id" = "aggr_selection_0_Post"."authorId") WHERE 1=1 OFFSET $1',
            ) + 'What follows from that?',
            'Ba lời gọi được ghi log trên Prisma 6.19.3 và đếm số câu lệnh:' + code(
              'A  user.findMany({ include: { posts: true } })                         -> 2 câu lệnh\n' +
              'B  user.findMany({ include: { _count: { select: { posts: true } } } }) -> 1 câu lệnh\n' +
              'C  user.findMany({ include: { posts: true,\n' +
              '                              _count: { select: { posts: true } } } }) -> 2 câu lệnh',
            ) + 'và câu lệnh duy nhất của B là:' + code(
              'SELECT "User"."id", ..., COALESCE("aggr_selection_0_Post"."_aggr_count_posts", 0) AS "_aggr_count_posts"\n' +
              'FROM "public"."User"\n' +
              'LEFT JOIN (SELECT "Post"."authorId", COUNT(*) AS "_aggr_count_posts"\n' +
              '           FROM "public"."Post" WHERE 1=1 GROUP BY "Post"."authorId") AS "aggr_selection_0_Post"\n' +
              '  ON ("User"."id" = "aggr_selection_0_Post"."authorId") WHERE 1=1 OFFSET $1',
            ) + 'Kết luận nào rút ra được?',
          ),
          options: [
            B(
              '<code>_count</code> costs no extra statement at all — it is folded into the parent SELECT as a LEFT JOIN onto a grouped subquery, so rendering "12 posts" beside a username transfers one number instead of twelve rows',
              '<code>_count</code> không tốn thêm câu lệnh nào cả — nó được gộp vào chính câu SELECT của cha dưới dạng LEFT JOIN với một truy vấn con đã GROUP BY, nên hiện "12 bài viết" cạnh một tên người dùng chỉ chuyển đi một con số thay vì mười hai hàng',
            ),
            B(
              '<code>_count</code> is a separate statement that Prisma issues after the parent rows come back, which is why C is two — one for the users and one for the counts',
              '<code>_count</code> là một câu lệnh riêng mà Prisma gửi sau khi các hàng cha trở về, và đó là lý do C có hai — một cho người dùng và một cho các con số đếm',
            ),
            B(
              'The <code>LEFT JOIN</code> means <code>_count</code> loads the child rows anyway; the saving over <code>posts.length</code> is only in the payload Prisma returns to you, not in the work the database does',
              '<code>LEFT JOIN</code> nghĩa là <code>_count</code> vẫn nạp các hàng con; chỗ tiết kiệm so với <code>posts.length</code> chỉ nằm ở phần dữ liệu Prisma trả về cho bạn, không nằm ở công việc cơ sở dữ liệu phải làm',
            ),
            B(
              'Because <code>_count</code> is a join rather than its own query, it cannot be filtered — counting only published posts requires a second call to <code>prisma.post.count</code>',
              'Vì <code>_count</code> là một phép nối chứ không phải một truy vấn riêng, nó không lọc được — muốn chỉ đếm bài đã đăng thì phải gọi thêm một lần <code>prisma.post.count</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured, and it is better than the lesson claims. B is genuinely one round trip, and C is two only because <code>posts: true</code> brought its own SELECT — the count rode along in the first one. The comparison that matters is against <code>include: { posts: true }</code> followed by <code>.length</code>, which fetches every child row to arrive at a number: on a user with 4,000 posts that is the whole request. And <code>_count</code> does take a filter — <code>_count: { select: { posts: { where: { published: true } } } }</code> measured as one statement too, with the <code>WHERE</code> moving inside the grouped subquery. The habit to build is counting statements in the log rather than reasoning about them from the call shape.',
            'Đo thật, và nó còn tốt hơn lời bài học nói. B đúng là một lượt đi về, còn C thành hai chỉ vì <code>posts: true</code> kéo theo câu SELECT riêng của nó — con số đếm đã đi ké câu đầu tiên. Phép so sánh đáng giá là so với <code>include: { posts: true }</code> rồi <code>.length</code>, thứ nạp về mọi hàng con chỉ để ra một con số: với một người dùng có 4.000 bài viết thì đó là cả cái request. Và <code>_count</code> nhận được bộ lọc — <code>_count: { select: { posts: { where: { published: true } } } }</code> đo ra cũng đúng một câu lệnh, với mệnh đề <code>WHERE</code> chui vào bên trong truy vấn con đã gom nhóm. Thói quen cần rèn là ĐẾM CÂU LỆNH trong log chứ đừng suy đoán từ hình dạng lời gọi.',
          ),
        }),

        mcq({
          prompt: B(
            'This was run three times on Prisma 6.19.3 against PostgreSQL, and the two numbers were identical on all three runs:' + code(
              'await prisma.post.update({ where: { id: 1 }, data: { views: 0 } });\n' +
              'await Promise.all(Array.from({ length: 100 }, async () => {\n' +
              '  const r = await prisma.post.findUniqueOrThrow({ where: { id: 1 } });\n' +
              '  await prisma.post.update({ where: { id: 1 }, data: { views: r.views + 1 } });\n' +
              '}));                                                    // -> views = ???\n\n' +
              'await prisma.post.update({ where: { id: 1 }, data: { views: 0 } });\n' +
              'await Promise.all(Array.from({ length: 100 }, () =>\n' +
              '  prisma.post.update({ where: { id: 1 }, data: { views: { increment: 1 } } })));\n' +
              '                                                        // -> views = ???',
            ) + 'What were the two numbers, and why?',
            'Đoạn sau chạy ba lượt trên Prisma 6.19.3 với PostgreSQL, và hai con số giống hệt nhau ở cả ba lượt:' + code(
              'await prisma.post.update({ where: { id: 1 }, data: { views: 0 } });\n' +
              'await Promise.all(Array.from({ length: 100 }, async () => {\n' +
              '  const r = await prisma.post.findUniqueOrThrow({ where: { id: 1 } });\n' +
              '  await prisma.post.update({ where: { id: 1 }, data: { views: r.views + 1 } });\n' +
              '}));                                                    // -> views = ???\n\n' +
              'await prisma.post.update({ where: { id: 1 }, data: { views: 0 } });\n' +
              'await Promise.all(Array.from({ length: 100 }, () =>\n' +
              '  prisma.post.update({ where: { id: 1 }, data: { views: { increment: 1 } } })));\n' +
              '                                                        // -> views = ???',
            ) + 'Hai con số là bao nhiêu, và vì sao?',
          ),
          options: [
            B(
              '99 and 100 — exactly one increment is lost in the read-then-write version, because only the pair that interleaves collides',
              '99 và 100 — bản đọc-rồi-ghi mất đúng một lượt, vì chỉ cặp nào chen vào nhau mới đụng độ',
            ),
            B(
              '1 and 100 — all hundred reads land before the first write commits, so all hundred compute <code>0 + 1</code> and write 1; <code>increment</code> becomes <code>SET views = views + $1</code>, computed inside PostgreSQL under a row lock, so nothing is lost',
              '1 và 100 — cả trăm lượt đọc hạ cánh trước khi lượt ghi đầu tiên commit, nên cả trăm cùng tính <code>0 + 1</code> rồi ghi 1; còn <code>increment</code> thành <code>SET views = views + $1</code>, tính bên trong PostgreSQL dưới một khoá hàng, nên không mất lượt nào',
            ),
            B(
              '100 and 100 — Prisma serialises writes to the same row through its connection pool, so read-then-write is safe as long as both statements go through the same client',
              '100 và 100 — Prisma tuần tự hoá các phép ghi vào cùng một hàng qua connection pool của nó, nên đọc-rồi-ghi vẫn an toàn miễn là cả hai câu lệnh đi qua cùng một client',
            ),
            B(
              '1 and 1 — <code>increment</code> is just sugar: the client still reads the row first and sends an absolute value, which is why the schema needs an explicit Serializable transaction for counters',
              '1 và 1 — <code>increment</code> chỉ là đường cú pháp: client vẫn đọc hàng trước rồi gửi đi một giá trị tuyệt đối, và đó là lý do lược đồ cần một giao dịch Serializable tường minh cho các bộ đếm',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured three times, identical every time. The lesson prints 23 for the first number, but 1 is what a hundred genuinely parallel clients produce: <code>Promise.all</code> starts all hundred reads before any write returns, so every one of them sees 0. That is worse than losing "most" increments — it is losing 99 of 100 and leaving a plausible-looking value behind. The atomic version emits <code>UPDATE "Post" SET "views" = ("Post"."views" + $1) WHERE ...</code>, and the arithmetic never leaves the database, so the order the hundred statements arrive in does not matter. The rule that covers the whole family: any field derived from its OWN previous value — a counter, a balance, a stock level, a retry count — must use an atomic operator or an explicit transaction, and it will look perfect in development where you are the only user.',
            'Đo ba lượt, lượt nào cũng như lượt nào. Bài học in ra 23 cho con số đầu, nhưng 1 mới là thứ một trăm client song song thật sự tạo ra: <code>Promise.all</code> khởi động cả trăm lượt đọc trước khi có lượt ghi nào trả về, nên cả trăm đều thấy 0. Chuyện đó còn tệ hơn "mất phần lớn" — nó mất 99 trên 100 và để lại một con số trông rất có lý. Bản nguyên tử phát ra <code>UPDATE "Post" SET "views" = ("Post"."views" + $1) WHERE ...</code>, và phép tính không bao giờ rời khỏi cơ sở dữ liệu, nên thứ tự một trăm câu lệnh ập tới không còn quan trọng. Luật bao trùm cả họ này: mọi trường suy ra từ CHÍNH giá trị cũ của nó — một bộ đếm, một số dư, một mức tồn kho, một số lần thử lại — đều phải dùng toán tử nguyên tử hoặc một giao dịch tường minh, và nó sẽ trông hoàn hảo trên máy phát triển nơi bạn là người dùng duy nhất.',
          ),
        }),

        mcq({
          prompt: B(
            'A nested update was logged on Prisma 6.19.3:' + code(
              'await prisma.user.update({\n' +
              "  where: { id: 1 },\n" +
              "  data: { posts: { update: { where: { id: 1 }, data: { title: 'X' } } } },\n" +
              '});',
            ) + code(
              'BEGIN\n' +
              'SELECT "User"... WHERE ("User"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3\n' +
              'SELECT "Post"."id", "Post"."authorId" FROM "Post"\n' +
              '  WHERE (("Post"."id" = $1 AND 1=1) AND "Post"."authorId" IN ($2)) OFFSET $3\n' +
              'UPDATE "Post" SET "title" = $1 WHERE ("Post"."id" = $2 AND ("Post"."id" = $3 AND 1=1)) RETURNING "Post"."id"\n' +
              'SELECT "User"... WHERE "User"."id" = $1 LIMIT $2 OFFSET $3\n' +
              'COMMIT',
            ) + 'Where is the guarantee that you cannot edit somebody else\'s post through this call?',
            'Một phép ghi lồng được ghi log trên Prisma 6.19.3:' + code(
              'await prisma.user.update({\n' +
              "  where: { id: 1 },\n" +
              "  data: { posts: { update: { where: { id: 1 }, data: { title: 'X' } } } },\n" +
              '});',
            ) + code(
              'BEGIN\n' +
              'SELECT "User"... WHERE ("User"."id" = $1 AND 1=1) LIMIT $2 OFFSET $3\n' +
              'SELECT "Post"."id", "Post"."authorId" FROM "Post"\n' +
              '  WHERE (("Post"."id" = $1 AND 1=1) AND "Post"."authorId" IN ($2)) OFFSET $3\n' +
              'UPDATE "Post" SET "title" = $1 WHERE ("Post"."id" = $2 AND ("Post"."id" = $3 AND 1=1)) RETURNING "Post"."id"\n' +
              'SELECT "User"... WHERE "User"."id" = $1 LIMIT $2 OFFSET $3\n' +
              'COMMIT',
            ) + 'Sự đảm bảo rằng bạn không sửa được bài của người khác qua lời gọi này nằm ở đâu?',
          ),
          options: [
            B(
              'In the <code>UPDATE</code>, which carries an appended <code>AND "authorId" = $3</code> so the write itself can never escape its parent',
              'Trong câu <code>UPDATE</code>, vốn được kẹp thêm <code>AND "authorId" = $3</code> nên bản thân phép ghi không bao giờ thoát khỏi cha của nó',
            ),
            B(
              'In the third statement — a SEPARATE <code>SELECT</code> that resolves the child WITHIN the parent (<code>"authorId" IN ($2)</code>); the <code>UPDATE</code> itself filters only on <code>id</code>, so the scoping lives in a read, and it holds only because the whole thing is one transaction',
              'Ở câu lệnh thứ ba — một câu <code>SELECT</code> RIÊNG phân giải hàng con TRONG PHẠM VI cha (<code>"authorId" IN ($2)</code>); còn bản thân câu <code>UPDATE</code> chỉ lọc theo <code>id</code>, nên hàng rào nằm ở một phép ĐỌC, và nó đứng vững được chỉ vì tất cả nằm trong một giao dịch',
            ),
            B(
              'In the <code>BEGIN</code>/<code>COMMIT</code> pair alone: the transaction takes a lock on the parent row, and PostgreSQL will not let a child of another parent be updated inside it',
              'Nằm ở riêng cặp <code>BEGIN</code>/<code>COMMIT</code>: giao dịch giữ khoá trên hàng cha, và PostgreSQL không cho phép cập nhật một hàng con của cha khác bên trong nó',
            ),
            B(
              'There is none — a nested <code>update</code> is exactly equivalent to a top-level <code>prisma.post.update</code>, and ownership must be checked in your own code beforehand',
              'Không có sự đảm bảo nào — một <code>update</code> lồng tương đương chính xác với <code>prisma.post.update</code> ở cấp cao nhất, và quyền sở hữu phải được kiểm trong mã của chính bạn từ trước',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Read the third line: <code>WHERE (("Post"."id" = $1 …) AND "Post"."authorId" IN ($2))</code>. That is the ownership check, and it is a read. If it matches nothing, the operation fails with <code>P2025</code> and the transaction rolls back; if it matches, the following <code>UPDATE</code> addresses the row by id alone. The safety property is real — you cannot reach another user\'s post through this call — but it is not where the lesson says it is, and knowing that changes how you read these logs. Five statements for one conceptual edit is also the honest price of nesting; a top-level <code>prisma.post.updateMany({ where: { id, authorId }, data })</code> does the same job in one statement, at the cost of returning a count instead of the row.',
            'Đọc dòng thứ ba: <code>WHERE (("Post"."id" = $1 …) AND "Post"."authorId" IN ($2))</code>. Đó chính là phép kiểm quyền sở hữu, và nó là một phép ĐỌC. Nếu nó không khớp gì, thao tác chết với <code>P2025</code> và giao dịch cuộn lại; nếu khớp, câu <code>UPDATE</code> phía sau chỉ địa chỉ hàng theo id. Tính an toàn là có thật — bạn không với tới bài của người khác qua lời gọi này — nhưng nó không nằm ở chỗ bài học nói, và biết điều đó làm bạn đọc những đoạn log kiểu này khác đi. Năm câu lệnh cho một phép sửa về mặt khái niệm cũng là cái giá thành thật của việc lồng; một lời gọi cấp cao nhất <code>prisma.post.updateMany({ where: { id, authorId }, data })</code> làm đúng việc ấy trong một câu lệnh, đổi lại là trả về một con số đếm chứ không phải hàng.',
          ),
        }),

        mcq({
          prompt: B(
            'An import writes 5,000 users, each with 3 posts. Which pair of statements about <code>createMany</code> is correct?',
            'Một lượt nhập ghi 5.000 người dùng, mỗi người 3 bài viết. Cặp phát biểu nào về <code>createMany</code> là ĐÚNG?',
          ),
          options: [
            B(
              'It cannot apply <code>@default</code> values from the schema, so every column with a default must be listed explicitly in every row of the batch',
              'Nó không áp được các giá trị <code>@default</code> từ lược đồ, nên mọi cột có mặc định đều phải được liệt kê tường minh trong từng hàng của lô',
            ),
            B(
              'It cannot run inside <code>$transaction</code>, because a multi-row <code>INSERT</code> is already its own implicit transaction and nesting them is rejected',
              'Nó không chạy được bên trong <code>$transaction</code>, vì một lệnh <code>INSERT</code> nhiều dòng vốn đã là một giao dịch ngầm và lồng chúng vào nhau thì bị từ chối',
            ),
            B(
              'It cannot exceed 1,000 rows per call, so the import must be chunked by hand before <code>skipDuplicates</code> can be used at all',
              'Nó không vượt quá 1.000 hàng mỗi lời gọi, nên lượt nhập phải tự cắt lô bằng tay trước khi dùng được <code>skipDuplicates</code>',
            ),
            B(
              'It cannot do nested writes — no <code>create</code>, <code>connect</code> or <code>connectOrCreate</code> on relations, so you pass foreign key scalars yourself — and it returns only <code>{ count }</code>, which is why <code>createManyAndReturn</code> exists when you need the generated ids to build the children',
              'Nó không ghi lồng được — không <code>create</code>, không <code>connect</code>, không <code>connectOrCreate</code> trên quan hệ, nên bạn tự truyền các trường vô hướng khoá ngoại — và nó chỉ trả về <code>{ count }</code>, đó là lý do có <code>createManyAndReturn</code> cho lúc bạn cần id sinh ra để dựng các hàng con',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The two limits are relations and return values, and both are worked around by the same shape: <code>createManyAndReturn</code> the parents selecting <code>{ id, email }</code>, build a <code>Map</code> from a natural key to the new id, then <code>createMany</code> the children with the foreign keys filled in. Two statements instead of five thousand transactions. Schema defaults are applied normally, and it does run inside <code>$transaction</code> — measured, <code>createMany</code> is itself wrapped in <code>BEGIN</code>/<code>COMMIT</code>. There is no 1,000-row cap either; Prisma chunks internally because PostgreSQL caps a statement at 65,535 bind parameters. Worth knowing alongside: <code>skipDuplicates: true</code> appends <code>ON CONFLICT DO NOTHING</code>, so a colliding row is skipped instead of rolling back the whole batch — measured, inserting two tags where one already existed returned <code>{ count: 1 }</code>.',
            'Hai giới hạn là quan hệ và giá trị trả về, và cả hai được vòng qua bằng cùng một hình dạng: <code>createManyAndReturn</code> các hàng cha với <code>select: { id, email }</code>, dựng một <code>Map</code> từ một khoá tự nhiên sang id mới, rồi <code>createMany</code> các hàng con với khoá ngoại đã điền sẵn. Hai câu lệnh thay cho năm nghìn giao dịch. Giá trị mặc định trong lược đồ vẫn được áp bình thường, và nó CHẠY được bên trong <code>$transaction</code> — đo thật, bản thân <code>createMany</code> đã được bọc trong <code>BEGIN</code>/<code>COMMIT</code>. Cũng không có trần 1.000 hàng nào; Prisma tự cắt lô bên trong vì PostgreSQL giới hạn một câu lệnh ở 65.535 tham số ràng buộc. Đáng biết kèm theo: <code>skipDuplicates: true</code> gắn thêm <code>ON CONFLICT DO NOTHING</code>, nên một hàng đụng độ bị bỏ qua thay vì cuộn lại cả lô — đo thật, chèn hai thẻ mà một cái đã tồn tại thì trả về <code>{ count: 1 }</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Two ways of saying "make sure this row exists" were each run twenty times in parallel, from a clean table, on Prisma 6.19.3:' + code(
              "A  prisma.tag.upsert({ where: { name: 'up' },\n" +
              "                       update: { name: 'up' }, create: { name: 'up' } })\n" +
              '   -> {"ok":20}     rows in table: 1\n\n' +
              "B  prisma.post.create({ data: { ..., tags: { connectOrCreate:\n" +
              "       [{ where: { name: 'race' }, create: { name: 'race' } }] } } })\n" +
              '   -> {"P2002":19,"ok":1}   rows in table: 1',
            ) + 'Why does one hold and the other not?',
            'Hai cách nói "bảo đảm hàng này tồn tại", mỗi cách chạy hai mươi lần song song từ một bảng sạch, trên Prisma 6.19.3:' + code(
              "A  prisma.tag.upsert({ where: { name: 'up' },\n" +
              "                       update: { name: 'up' }, create: { name: 'up' } })\n" +
              '   -> {"ok":20}     số hàng trong bảng: 1\n\n' +
              "B  prisma.post.create({ data: { ..., tags: { connectOrCreate:\n" +
              "       [{ where: { name: 'race' }, create: { name: 'race' } }] } } })\n" +
              '   -> {"P2002":19,"ok":1}   số hàng trong bảng: 1',
            ) + 'Vì sao một cái đứng vững còn cái kia thì không?',
          ),
          options: [
            B(
              'A holds because <code>upsert</code> takes an exclusive lock on the table for the duration; B does not lock, which is the documented difference between the two',
              'A đứng vững vì <code>upsert</code> giữ một khoá độc quyền trên cả bảng trong suốt thời gian chạy; B không khoá, và đó là khác biệt được ghi trong tài liệu giữa hai cái',
            ),
            B(
              'B failed because the unique constraint on <code>Tag.name</code> is the wrong key for a many-to-many link; removing it makes all twenty succeed',
              'B hỏng vì ràng buộc duy nhất trên <code>Tag.name</code> là khoá sai cho một liên kết nhiều–nhiều; bỏ nó đi thì cả hai mươi lượt đều thành công',
            ),
            B(
              'A is one native statement — <code>INSERT ... ON CONFLICT ("name") DO UPDATE ...</code> — so the database resolves the collision; B reads, decides the tag is missing, then inserts, and nineteen of the twenty lose that race and surface it as <code>P2002</code>',
              'A là một câu lệnh gốc — <code>INSERT ... ON CONFLICT ("name") DO UPDATE ...</code> — nên chính cơ sở dữ liệu giải quyết va chạm; còn B đọc, kết luận là thẻ chưa có, rồi chèn, và mười chín trong hai mươi lượt thua cuộc đua đó rồi lộ ra thành <code>P2002</code>',
            ),
            B(
              'Both are equally safe; the nineteen failures came from the connection pool running out, and <code>P2002</code> here is the pool reporting a rejected connection',
              'Cả hai an toàn như nhau; mười chín lượt hỏng là do connection pool cạn kiệt, và <code>P2002</code> ở đây là pool báo một kết nối bị từ chối',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Read the two logs and the difference is visible without any theory. <code>upsert</code> with a single unique field in <code>where</code> and no nested writes compiles to one <code>ON CONFLICT DO UPDATE</code>, and one statement cannot race with itself. <code>connectOrCreate</code> is read-then-decide-then-write, so it is a race by construction — the constraint saved the DATA (one row, not twenty) but nineteen requests still failed. That is acceptable in a low-traffic admin flow and not acceptable on a hot path: catch <code>P2002</code> and retry once, or pre-create your tag vocabulary. And know that <code>upsert</code> itself falls back to the racy shape when it cannot use the native form — measured, an upsert carrying a nested <code>create</code> logged <code>BEGIN</code>, a <code>SELECT</code>, then the inserts. Read the log to find out which one you got.',
            'Đọc hai đoạn log là thấy khác biệt mà chẳng cần lý thuyết nào. <code>upsert</code> với một trường unique đơn trong <code>where</code> và không có phép ghi lồng thì biên dịch thành một câu <code>ON CONFLICT DO UPDATE</code>, và một câu lệnh thì không thể tự đua với chính nó. Còn <code>connectOrCreate</code> là đọc-rồi-quyết-rồi-ghi, nên nó là một cuộc đua ngay từ trong cấu tạo — ràng buộc đã cứu DỮ LIỆU (một hàng chứ không phải hai mươi) nhưng mười chín request vẫn hỏng. Điều đó chấp nhận được ở một luồng quản trị ít lưu lượng và không chấp nhận được ở một đường nóng: hãy bắt <code>P2002</code> và thử lại một lần, hoặc tạo sẵn bộ từ vựng thẻ. Và hãy biết rằng chính <code>upsert</code> cũng rơi về hình dạng có đua khi nó không dùng được dạng gốc — đo thật, một lời gọi upsert mang theo <code>create</code> lồng đã ghi log <code>BEGIN</code>, một <code>SELECT</code>, rồi mới tới các lệnh chèn. Hãy đọc log để biết bạn nhận được cái nào.',
          ),
        }),

        mcq({
          prompt: B(
            'Two guarded state transitions, run on Prisma 6.19.3, with the logged SQL and the return value:' + code(
              "const r = await prisma.post.updateMany({\n" +
              '  where: { id: 2, published: false },\n' +
              '  data:  { published: true },\n' +
              '});',
            ) + code(
              'BEGIN\n' +
              'UPDATE "Post" SET "published" = $1 WHERE ("Post"."id" = $2 AND "Post"."published" = $3)\n' +
              'COMMIT\n' +
              'first call  -> { count: 1 }\n' +
              'second call -> { count: 0 }',
            ) + 'What makes this pattern better than reading the row and branching in JavaScript?',
            'Hai phép chuyển trạng thái có canh gác, chạy trên Prisma 6.19.3, kèm SQL trong log và giá trị trả về:' + code(
              "const r = await prisma.post.updateMany({\n" +
              '  where: { id: 2, published: false },\n' +
              '  data:  { published: true },\n' +
              '});',
            ) + code(
              'BEGIN\n' +
              'UPDATE "Post" SET "published" = $1 WHERE ("Post"."id" = $2 AND "Post"."published" = $3)\n' +
              'COMMIT\n' +
              'lời gọi thứ nhất -> { count: 1 }\n' +
              'lời gọi thứ hai  -> { count: 0 }',
            ) + 'Điều gì làm khuôn này tốt hơn việc đọc hàng ra rồi rẽ nhánh trong JavaScript?',
          ),
          options: [
            B(
              'It throws <code>P2025</code> when the precondition fails, so an Express error handler can map it to a 409 without any per-route branching',
              'Nó ném <code>P2025</code> khi điều kiện tiên quyết sai, nên một error handler của Express ánh xạ nó thành 409 mà không cần rẽ nhánh ở từng route',
            ),
            B(
              'It runs at Serializable isolation because <code>updateMany</code> always opens its own transaction, which is what makes the guard hold under concurrency',
              'Nó chạy ở mức cô lập Serializable vì <code>updateMany</code> luôn tự mở giao dịch riêng, và đó là thứ làm cho canh gác đứng vững khi có tranh chấp',
            ),
            B(
              'It returns the updated row, so the handler can compare the before and after values and decide whether the transition actually happened',
              'Nó trả về hàng đã cập nhật, nên handler so được giá trị trước và sau rồi quyết xem phép chuyển trạng thái có thật sự xảy ra hay không',
            ),
            B(
              'The check and the write are ONE statement, so nothing can change between them; <code>count === 0</code> then means exactly "the precondition was false", and the same shape does "take one from stock but never below zero" with <code>where: { stock: { gt: 0 } }</code>',
              'Phép kiểm và phép ghi là MỘT câu lệnh, nên không gì chen vào giữa được; khi đó <code>count === 0</code> có nghĩa chính xác là "điều kiện tiên quyết sai", và cùng hình dạng ấy làm được "trừ một khỏi kho nhưng không bao giờ xuống dưới không" với <code>where: { stock: { gt: 0 } }</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Putting the precondition in the <code>where</code> collapses "check" and "act" into a single statement, which is the cheapest correct answer to a whole class of race conditions. Note the two traps that come with it. <code>updateMany</code> never throws for a miss — <code>{ count: 0 }</code> is a normal answer, so a handler that reports success must inspect the count itself; this is the mirror image of <code>update</code>, which throws <code>P2025</code>, and it is exactly why people reach for <code>updateMany</code> "to avoid the exception" and then never notice their update stopped working. And it returns a count, not rows: use <code>updateManyAndReturn</code> when you need the rows back, which measured as one <code>UPDATE … RETURNING</code>.',
            'Đặt điều kiện tiên quyết vào <code>where</code> là gộp "kiểm" và "làm" thành một câu lệnh duy nhất — câu trả lời đúng rẻ nhất cho cả một họ tình huống tranh chấp. Nhưng để ý hai cái bẫy đi kèm. <code>updateMany</code> không bao giờ ném lỗi khi trượt — <code>{ count: 0 }</code> là một câu trả lời bình thường, nên handler nào báo thành công thì phải tự soi con số đếm; đây là hình ảnh soi gương của <code>update</code>, thứ ném <code>P2025</code>, và đó chính là lý do người ta tìm tới <code>updateMany</code> "cho khỏi bị ngoại lệ" rồi chẳng bao giờ nhận ra bản cập nhật của mình đã ngừng chạy. Và nó trả về một con số đếm chứ không phải các hàng: cần hàng thì dùng <code>updateManyAndReturn</code>, thứ đo ra là một câu <code>UPDATE … RETURNING</code>.',
          ),
        }),

        mcq({
          prompt: B(
            'Two ways to keep a password hash out of API responses:' + code(
              "const prisma = new PrismaClient({ omit: { user: { password: true } } });\n" +
              '// ... and at the one place that needs it:\n' +
              'const forLogin = await prisma.user.findUnique({ where: { email }, omit: { password: false } });',
            ) + code(
              'const safe = await prisma.user.findMany({\n' +
              '  select: { id: true, email: true, fullName: true, avatarUrl: true, bio: true },\n' +
              '});',
            ) + 'Which comparison is correct?',
            'Hai cách giữ một chuỗi băm mật khẩu khỏi lọt vào phản hồi API:' + code(
              "const prisma = new PrismaClient({ omit: { user: { password: true } } });\n" +
              '// ... và ở đúng một chỗ cần tới nó:\n' +
              'const forLogin = await prisma.user.findUnique({ where: { email }, omit: { password: false } });',
            ) + code(
              'const safe = await prisma.user.findMany({\n' +
              '  select: { id: true, email: true, fullName: true, avatarUrl: true, bio: true },\n' +
              '});',
            ) + 'So sánh nào ĐÚNG?',
          ),
          options: [
            B(
              'The <code>select</code> version is stricter, because <code>omit</code> is applied by Prisma Client after the row arrives while <code>select</code> narrows the SQL — so only <code>select</code> keeps the hash off the wire',
              'Bản <code>select</code> chặt hơn, vì <code>omit</code> do Prisma Client áp sau khi hàng đã về còn <code>select</code> thu hẹp ngay câu SQL — nên chỉ <code>select</code> mới giữ chuỗi băm khỏi đường truyền',
            ),
            B(
              'Global <code>omit</code> makes the SAFE case the default and the exception one visible line at the call site that needs it, and it keeps new columns included automatically — the <code>select</code> list has to be edited every time a column is added, and the day someone forgets is the day the hash ships',
              '<code>omit</code> toàn cục biến trường hợp AN TOÀN thành mặc định và biến ngoại lệ thành một dòng nhìn thấy được ngay tại chỗ cần nó, đồng thời vẫn tự động giữ lại các cột mới thêm — còn danh sách <code>select</code> thì cứ thêm cột là phải sửa, và cái ngày ai đó quên chính là ngày chuỗi băm lên đường',
            ),
            B(
              'They are interchangeable, and you may combine them at one query level to omit a column from a narrowed selection',
              'Hai cách thay thế được cho nhau, và bạn có thể dùng chung ở cùng một tầng truy vấn để bỏ một cột ra khỏi phần đã thu hẹp',
            ),
            B(
              '<code>omit: { password: false }</code> is a no-op — once a column is omitted globally it cannot be opted back in, so the login path needs a second, un-omitted client',
              '<code>omit: { password: false }</code> chẳng làm gì cả — một khi cột đã bị omit toàn cục thì không bật lại được, nên đường đăng nhập cần một client thứ hai không omit',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured: with a global omit in place, <code>findFirst()</code> returned the row without the column, and <code>omit: { name: false }</code> at one call site brought it back — the opt-in works, and the logged SQL selects the column only in that second case. The argument for it is not that <code>select</code> is unsafe; it is that <code>select</code> is a whitelist you must maintain forever, and the failure mode is a field added six months later that nobody remembers to exclude. Default-safe with a visible exception is the better shape. One rule to remember: <code>omit</code> and <code>select</code> are mutually exclusive at one level, exactly like <code>include</code> and <code>select</code>, and combining them is a runtime error — <em>Please either use <code>omit</code> or <code>select</code>, but not both at the same time.</em>',
            'Đo thật: với omit toàn cục đang bật, <code>findFirst()</code> trả về hàng thiếu cột đó, và <code>omit: { name: false }</code> ở một chỗ gọi thì kéo nó về — phép bật lại có tác dụng, và SQL trong log chỉ chọn cột đó ở đúng trường hợp thứ hai. Lý lẽ ủng hộ nó không phải là <code>select</code> mất an toàn; mà là <code>select</code> là một danh sách trắng bạn phải nuôi mãi mãi, và kiểu hỏng của nó là một trường thêm vào sáu tháng sau mà chẳng ai nhớ phải loại ra. Mặc định an toàn kèm một ngoại lệ nhìn thấy được là hình dạng tốt hơn. Một luật cần nhớ: <code>omit</code> và <code>select</code> loại trừ nhau ở cùng một tầng, y hệt <code>include</code> với <code>select</code>, và dùng chung là một lỗi lúc chạy — <em>Please either use <code>omit</code> or <code>select</code>, but not both at the same time.</em>',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Rebuild what <code>include</code> returns, and count the statements (chapters 1 and 4).</b> Three flat arrays stand in for three tables. Implement two functions that reproduce, on plain data, what Prisma Client does with <code>include</code>, <code>select</code> and <code>_count</code>.</p>' +
            '<ul>' +
            '<li><code>plan(spec)</code> — the tables Prisma would query, <b>one entry per statement</b>, in the order the statements are issued. The root model is always first. Every relation reached through <code>include</code> or <code>select</code> adds one entry, walked in declaration order and recursing into a relation as soon as you reach it. <b><code>_count</code> adds no entry at all</b> — it is folded into its parent statement as a join.</li>' +
            '<li><code>build(spec)</code> — the array of rows, shaped exactly as asked. Under <code>include</code>, a row has <b>every scalar</b> of the model plus the named relations. Under <code>select</code>, a row has <b>only the named keys</b>. A relation named with <code>true</code> means "all of its scalars, no relations of its own". <code>_count</code> becomes <code>{ _count: { &lt;relation&gt;: N } }</code>, where N is the number of children.</li>' +
            '</ul>' +
            '<p>Keys must appear in the order they are declared in the spec (for <code>select</code>) or scalars-then-relations (for <code>include</code>) — the printing loop compares JSON text, so key order matters. <code>REL</code> maps a relation name to its child table and the foreign-key column, and every foreign key points at the parent\'s <code>id</code>. Keep the given data and the printing loop exactly as they are, and do not require anything.</p>',

            '<p><b>Câu 31 — Dựng lại thứ <code>include</code> trả về, và đếm số câu lệnh (chương 1 và 4).</b> Ba mảng phẳng đóng vai ba cái bảng. Hãy cài đặt hai hàm tái hiện, trên dữ liệu thuần, đúng thứ Prisma Client làm với <code>include</code>, <code>select</code> và <code>_count</code>.</p>' +
            '<ul>' +
            '<li><code>plan(spec)</code> — danh sách bảng mà Prisma sẽ truy vấn, <b>mỗi câu lệnh một mục</b>, theo đúng thứ tự các câu lệnh được gửi đi. Model gốc luôn đứng đầu. Mỗi quan hệ với tới qua <code>include</code> hay <code>select</code> thêm một mục, duyệt theo thứ tự khai báo và đệ quy vào một quan hệ ngay khi chạm tới nó. <b><code>_count</code> KHÔNG thêm mục nào</b> — nó được gộp vào câu lệnh của cha dưới dạng một phép nối.</li>' +
            '<li><code>build(spec)</code> — mảng các hàng, nắn đúng hình dạng được xin. Dưới <code>include</code>, một hàng có <b>mọi trường vô hướng</b> của model cộng thêm các quan hệ được gọi tên. Dưới <code>select</code>, một hàng <b>chỉ có những khoá được gọi tên</b>. Một quan hệ nêu bằng <code>true</code> nghĩa là "mọi trường vô hướng của nó, không kèm quan hệ nào của riêng nó". <code>_count</code> thành <code>{ _count: { &lt;tên quan hệ&gt;: N } }</code>, với N là số hàng con.</li>' +
            '</ul>' +
            '<p>Các khoá phải xuất hiện theo đúng thứ tự khai báo trong spec (với <code>select</code>) hoặc vô-hướng-rồi-quan-hệ (với <code>include</code>) — vòng lặp in so sánh văn bản JSON nên thứ tự khoá có ý nghĩa. <code>REL</code> ánh xạ tên quan hệ sang bảng con và cột khoá ngoại, và mọi khoá ngoại đều trỏ vào <code>id</code> của cha. Giữ nguyên phần dữ liệu cho sẵn và vòng lặp in kết quả, và không require thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const DB = {\n' +
            '  User: [\n' +
            "    { id: 1, email: 'an@x.com',   name: 'An'   },\n" +
            "    { id: 2, email: 'binh@x.com', name: 'Binh' },\n" +
            "    { id: 3, email: 'chi@x.com',  name: null   },\n" +
            '  ],\n' +
            '  Post: [\n' +
            "    { id: 10, title: 'A', authorId: 1 },\n" +
            "    { id: 11, title: 'B', authorId: 1 },\n" +
            "    { id: 12, title: 'C', authorId: 2 },\n" +
            '  ],\n' +
            '  Comment: [\n' +
            "    { id: 100, body: 'x', postId: 10 },\n" +
            "    { id: 101, body: 'y', postId: 12 },\n" +
            '  ],\n' +
            '};\n' +
            'const REL = {\n' +
            "  posts:    { model: 'Post',    fk: 'authorId' },\n" +
            "  comments: { model: 'Comment', fk: 'postId'   },\n" +
            '};\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function plan(spec) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function build(spec) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const SPECS = [\n' +
            "  ['bare',         { model: 'User' }],\n" +
            "  ['inc-posts',    { model: 'User', include: { posts: true } }],\n" +
            "  ['inc-2-levels', { model: 'User', include: { posts: { include: { comments: true } } } }],\n" +
            "  ['count-only',   { model: 'User', include: { _count: { select: { posts: true } } } }],\n" +
            "  ['inc+count',    { model: 'User', include: { posts: true, _count: { select: { posts: true } } } }],\n" +
            "  ['sel-nested',   { model: 'User', select: { id: true, posts: { select: { title: true } } } }],\n" +
            "  ['sel-scalars',  { model: 'User', select: { id: true, email: true } }],\n" +
            "  ['from-post',    { model: 'Post', include: { comments: true } }],\n" +
            '];\n' +
            'for (const [name, spec] of SPECS) {\n' +
            "  console.log(name + ' -> ' + JSON.stringify(plan(spec)));\n" +
            "  console.log('   ' + JSON.stringify(build(spec)));\n" +
            '}\n',
          expectedOutput:
            'bare -> ["User"]\n' +
            '   [{"id":1,"email":"an@x.com","name":"An"},{"id":2,"email":"binh@x.com","name":"Binh"},{"id":3,"email":"chi@x.com","name":null}]\n' +
            'inc-posts -> ["User","Post"]\n' +
            '   [{"id":1,"email":"an@x.com","name":"An","posts":[{"id":10,"title":"A","authorId":1},{"id":11,"title":"B","authorId":1}]},{"id":2,"email":"binh@x.com","name":"Binh","posts":[{"id":12,"title":"C","authorId":2}]},{"id":3,"email":"chi@x.com","name":null,"posts":[]}]\n' +
            'inc-2-levels -> ["User","Post","Comment"]\n' +
            '   [{"id":1,"email":"an@x.com","name":"An","posts":[{"id":10,"title":"A","authorId":1,"comments":[{"id":100,"body":"x","postId":10}]},{"id":11,"title":"B","authorId":1,"comments":[]}]},{"id":2,"email":"binh@x.com","name":"Binh","posts":[{"id":12,"title":"C","authorId":2,"comments":[{"id":101,"body":"y","postId":12}]}]},{"id":3,"email":"chi@x.com","name":null,"posts":[]}]\n' +
            'count-only -> ["User"]\n' +
            '   [{"id":1,"email":"an@x.com","name":"An","_count":{"posts":2}},{"id":2,"email":"binh@x.com","name":"Binh","_count":{"posts":1}},{"id":3,"email":"chi@x.com","name":null,"_count":{"posts":0}}]\n' +
            'inc+count -> ["User","Post"]\n' +
            '   [{"id":1,"email":"an@x.com","name":"An","posts":[{"id":10,"title":"A","authorId":1},{"id":11,"title":"B","authorId":1}],"_count":{"posts":2}},{"id":2,"email":"binh@x.com","name":"Binh","posts":[{"id":12,"title":"C","authorId":2}],"_count":{"posts":1}},{"id":3,"email":"chi@x.com","name":null,"posts":[],"_count":{"posts":0}}]\n' +
            'sel-nested -> ["User","Post"]\n' +
            '   [{"id":1,"posts":[{"title":"A"},{"title":"B"}]},{"id":2,"posts":[{"title":"C"}]},{"id":3,"posts":[]}]\n' +
            'sel-scalars -> ["User"]\n' +
            '   [{"id":1,"email":"an@x.com"},{"id":2,"email":"binh@x.com"},{"id":3,"email":"chi@x.com"}]\n' +
            'from-post -> ["Post","Comment"]\n' +
            '   [{"id":10,"title":"A","authorId":1,"comments":[{"id":100,"body":"x","postId":10}]},{"id":11,"title":"B","authorId":1,"comments":[]},{"id":12,"title":"C","authorId":2,"comments":[{"id":101,"body":"y","postId":12}]}]',
          sampleSolution:
            'function plan(spec) {\n' +
            '  const out = [spec.model];\n' +
            '  const walk = (node) => {\n' +
            '    const kids = node.include ?? node.select ?? {};\n' +
            '    for (const [key, val] of Object.entries(kids)) {\n' +
            "      if (key === '_count' || !REL[key]) continue;   // _count là JOIN, không phải câu lệnh\n" +
            '      out.push(REL[key].model);\n' +
            "      if (val && typeof val === 'object') walk({ model: REL[key].model, ...val });\n" +
            '    }\n' +
            '  };\n' +
            '  walk(spec);\n' +
            '  return out;\n' +
            '}\n\n' +
            'function build(spec) {\n' +
            '  const shape = (model, row, node) => {\n' +
            '    const kids = node.include ?? node.select ?? {};\n' +
            '    const res = {};\n' +
            '    if (node.select) {\n' +
            '      for (const [k, v] of Object.entries(kids)) {\n' +
            "        if (k === '_count' || REL[k] || !v) continue;\n" +
            '        res[k] = row[k];\n' +
            '      }\n' +
            '    } else {\n' +
            '      for (const k of Object.keys(row)) res[k] = row[k];   // include: mọi cột\n' +
            '    }\n' +
            '    for (const [key, val] of Object.entries(kids)) {\n' +
            "      if (key === '_count') {\n" +
            '        res._count = {};\n' +
            '        for (const [rk, on] of Object.entries(val.select ?? {})) {\n' +
            '          if (!on || !REL[rk]) continue;\n' +
            '          res._count[rk] = DB[REL[rk].model].filter((c) => c[REL[rk].fk] === row.id).length;\n' +
            '        }\n' +
            '        continue;\n' +
            '      }\n' +
            '      if (!REL[key]) continue;\n' +
            '      const { model: cm, fk } = REL[key];\n' +
            "      const sub = val && typeof val === 'object' ? val : {};\n" +
            '      res[key] = DB[cm].filter((c) => c[fk] === row.id).map((c) => shape(cm, c, sub));\n' +
            '    }\n' +
            '    return res;\n' +
            '  };\n' +
            '  return DB[spec.model].map((r) => shape(spec.model, r, spec));\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Which error code does each call produce? (chapters 3 and 4).</b> Implement <code>run(ops)</code>, a model of Prisma Client\'s find / write semantics over three tables, and return what each operation answers.</p>' +
            '<p>Every op is a tuple. The results, as strings:</p>' +
            '<ul>' +
            '<li><code>[\'create\', model, row]</code> — <code>\'ok\'</code>. If any unique field already holds that value, <code>\'P2002:&lt;field&gt;\'</code>; <code>id</code> counts as unique and is checked FIRST, then the fields of <code>uniques</code> in order. If the model has a foreign key whose parent row does not exist, <code>\'P2003\'</code>. <b>A uniqueness violation is reported even when the foreign key is also bad</b> — measured, that is what PostgreSQL does.</li>' +
            '<li><code>[\'findUnique\', model, id]</code> — <code>\'row\'</code> or <code>\'null\'</code>.</li>' +
            '<li><code>[\'findUniqueOrThrow\', model, id]</code> — <code>\'row\'</code> or <code>\'P2025\'</code>.</li>' +
            '<li><code>[\'update\', model, id]</code> — <code>\'ok\'</code> or <code>\'P2025\'</code>.</li>' +
            '<li><code>[\'updateMany\', model, ids]</code> — <code>\'count=N\'</code>, N being how many of those ids exist. Never throws.</li>' +
            '<li><code>[\'delete\', model, id]</code> — <code>\'P2025\'</code> if the row is absent. Otherwise apply the referential actions: a child relation declared <code>Restrict</code> that still has rows gives <code>\'P2003\'</code> and nothing is removed; one declared <code>Cascade</code> removes its children first, recursively. Then <code>\'ok\'</code>.</li>' +
            '<li><code>[\'deleteMany\', model, ids]</code> — <code>\'count=N\'</code>, N being how many rows were actually removed. Never throws; ids that are absent simply do not count.</li>' +
            '<li><code>[\'upsert\', model, field, value]</code> — <code>\'updated\'</code> if a row already has that value in that field, otherwise <code>\'created\'</code> (give the new row <code>id</code> = one more than the largest id currently in that table, or 1 when it is empty).</li>' +
            '</ul>' +
            '<p>Return <code>{ out, sizes }</code>: <code>out</code> is the array of result strings in order, and <code>sizes</code> is <code>{ User, Post, Comment }</code> with the final row count of each. Start from three empty tables. Keep the given data and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Mỗi lời gọi đẻ ra mã lỗi nào? (chương 3 và 4).</b> Hãy cài đặt <code>run(ops)</code> — một mô hình ngữ nghĩa đọc/ghi của Prisma Client trên ba bảng — và trả về câu trả lời của từng thao tác.</p>' +
            '<p>Mỗi thao tác là một tuple. Kết quả, dưới dạng chuỗi:</p>' +
            '<ul>' +
            '<li><code>[\'create\', model, row]</code> — <code>\'ok\'</code>. Nếu một trường unique nào đó đã giữ giá trị ấy thì <code>\'P2002:&lt;tên trường&gt;\'</code>; <code>id</code> cũng tính là unique và được kiểm TRƯỚC, rồi mới tới các trường trong <code>uniques</code> theo thứ tự. Nếu model có khoá ngoại mà hàng cha không tồn tại thì <code>\'P2003\'</code>. <b>Vi phạm tính duy nhất được báo kể cả khi khoá ngoại cũng sai</b> — đo thật, PostgreSQL làm đúng như vậy.</li>' +
            '<li><code>[\'findUnique\', model, id]</code> — <code>\'row\'</code> hoặc <code>\'null\'</code>.</li>' +
            '<li><code>[\'findUniqueOrThrow\', model, id]</code> — <code>\'row\'</code> hoặc <code>\'P2025\'</code>.</li>' +
            '<li><code>[\'update\', model, id]</code> — <code>\'ok\'</code> hoặc <code>\'P2025\'</code>.</li>' +
            '<li><code>[\'updateMany\', model, ids]</code> — <code>\'count=N\'</code>, N là số id trong danh sách đang tồn tại. Không bao giờ ném lỗi.</li>' +
            '<li><code>[\'delete\', model, id]</code> — <code>\'P2025\'</code> nếu hàng không có. Còn không thì áp các hành vi tham chiếu: một quan hệ con khai <code>Restrict</code> mà vẫn còn hàng thì trả <code>\'P2003\'</code> và không xoá gì cả; quan hệ khai <code>Cascade</code> thì xoá con trước, đệ quy. Xong thì <code>\'ok\'</code>.</li>' +
            '<li><code>[\'deleteMany\', model, ids]</code> — <code>\'count=N\'</code>, N là số hàng thật sự bị xoá. Không bao giờ ném lỗi; id nào không có thì đơn giản là không được tính.</li>' +
            '<li><code>[\'upsert\', model, field, value]</code> — <code>\'updated\'</code> nếu đã có hàng mang giá trị ấy ở trường ấy, không thì <code>\'created\'</code> (cấp cho hàng mới <code>id</code> bằng id lớn nhất hiện có trong bảng cộng một, hoặc 1 khi bảng rỗng).</li>' +
            '</ul>' +
            '<p>Trả về <code>{ out, sizes }</code>: <code>out</code> là mảng chuỗi kết quả theo đúng thứ tự, còn <code>sizes</code> là <code>{ User, Post, Comment }</code> với số hàng cuối cùng của từng bảng. Bắt đầu từ ba bảng rỗng. Giữ nguyên phần dữ liệu cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const SCHEMA = {\n' +
            "  User:    { uniques: ['email'] },\n" +
            "  Post:    { uniques: ['slug'], fk: { column: 'authorId', parent: 'User', onDelete: 'Restrict' } },\n" +
            "  Comment: { uniques: [],       fk: { column: 'postId',   parent: 'Post', onDelete: 'Cascade'  } },\n" +
            '};\n' +
            'const OPS = [\n' +
            "  ['create',            'User',    { id: 1,   email: 'an@x.com' }],\n" +
            "  ['create',            'User',    { id: 2,   email: 'an@x.com' }],\n" +
            "  ['create',            'User',    { id: 2,   email: 'binh@x.com' }],\n" +
            "  ['create',            'Post',    { id: 10,  slug: 'p1', authorId: 1 }],\n" +
            "  ['create',            'Post',    { id: 11,  slug: 'p1', authorId: 2 }],\n" +
            "  ['create',            'Post',    { id: 11,  slug: 'p2', authorId: 9 }],\n" +
            "  ['create',            'Post',    { id: 11,  slug: 'p2', authorId: 2 }],\n" +
            "  ['create',            'Comment', { id: 100, postId: 10 }],\n" +
            "  ['create',            'Comment', { id: 101, postId: 10 }],\n" +
            "  ['findUnique',        'User',    9],\n" +
            "  ['findUniqueOrThrow', 'User',    9],\n" +
            "  ['update',            'User',    9],\n" +
            "  ['update',            'User',    1],\n" +
            "  ['updateMany',        'User',    [7, 8, 9]],\n" +
            "  ['updateMany',        'User',    [1, 2, 9]],\n" +
            "  ['delete',            'User',    1],\n" +
            "  ['delete',            'Post',    10],\n" +
            "  ['delete',            'User',    1],\n" +
            "  ['delete',            'Post',    10],\n" +
            "  ['deleteMany',        'Comment', [100, 101]],\n" +
            "  ['upsert',            'User',    'email', 'binh@x.com'],\n" +
            "  ['upsert',            'User',    'email', 'chi@x.com'],\n" +
            '];\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function run(ops) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const { out, sizes } = run(OPS);\n' +
            "OPS.forEach((o, i) => console.log(String(i + 1).padStart(2, '0') + ' ' + o[0] + ' ' + o[1] + ' -> ' + out[i]));\n" +
            "console.log('sizes=' + JSON.stringify(sizes));\n",
          expectedOutput:
            '01 create User -> ok\n' +
            '02 create User -> P2002:email\n' +
            '03 create User -> ok\n' +
            '04 create Post -> ok\n' +
            '05 create Post -> P2002:slug\n' +
            '06 create Post -> P2003\n' +
            '07 create Post -> ok\n' +
            '08 create Comment -> ok\n' +
            '09 create Comment -> ok\n' +
            '10 findUnique User -> null\n' +
            '11 findUniqueOrThrow User -> P2025\n' +
            '12 update User -> P2025\n' +
            '13 update User -> ok\n' +
            '14 updateMany User -> count=0\n' +
            '15 updateMany User -> count=2\n' +
            '16 delete User -> P2003\n' +
            '17 delete Post -> ok\n' +
            '18 delete User -> ok\n' +
            '19 delete Post -> P2025\n' +
            '20 deleteMany Comment -> count=0\n' +
            '21 upsert User -> updated\n' +
            '22 upsert User -> created\n' +
            'sizes={"User":2,"Post":1,"Comment":0}',
          sampleSolution:
            'function run(ops) {\n' +
            '  const db = { User: [], Post: [], Comment: [] };\n' +
            '  const out = [];\n\n' +
            '  const find = (m, id) => db[m].find((r) => r.id === id);\n' +
            '  const dupField = (m, row) =>\n' +
            "    SCHEMA[m].uniques.find((f) => db[m].some((r) => r[f] === row[f])) ?? null;\n" +
            '  const children = (m, id) =>\n' +
            '    Object.entries(SCHEMA)\n' +
            '      .filter(([, s]) => s.fk && s.fk.parent === m)\n' +
            '      .map(([cm, s]) => [cm, s, db[cm].filter((r) => r[s.fk.column] === id)]);\n\n' +
            '  // Trả về mã lỗi nếu bị chặn, null nếu xoá xong.\n' +
            '  const removeRow = (m, id) => {\n' +
            '    for (const [cm, s, kids] of children(m, id)) {\n' +
            '      if (!kids.length) continue;\n' +
            "      if (s.fk.onDelete === 'Restrict') return 'P2003';\n" +
            '      for (const k of kids) { const r = removeRow(cm, k.id); if (r) return r; }\n' +
            '    }\n' +
            '    db[m] = db[m].filter((r) => r.id !== id);\n' +
            '    return null;\n' +
            '  };\n\n' +
            '  for (const [op, model, a, b] of ops) {\n' +
            "    if (op === 'create') {\n" +
            "      if (find(model, a.id)) { out.push('P2002:id'); continue; }\n" +
            '      const dup = dupField(model, a);\n' +
            "      if (dup) { out.push('P2002:' + dup); continue; }   // unique thắng FK\n" +
            '      const fk = SCHEMA[model].fk;\n' +
            "      if (fk && !find(fk.parent, a[fk.column])) { out.push('P2003'); continue; }\n" +
            '      db[model].push({ ...a });\n' +
            "      out.push('ok');\n" +
            '      continue;\n' +
            '    }\n' +
            "    if (op === 'findUnique')        { out.push(find(model, a) ? 'row' : 'null'); continue; }\n" +
            "    if (op === 'findUniqueOrThrow') { out.push(find(model, a) ? 'row' : 'P2025'); continue; }\n" +
            "    if (op === 'update')            { out.push(find(model, a) ? 'ok' : 'P2025'); continue; }\n" +
            "    if (op === 'updateMany')        { out.push('count=' + a.filter((id) => find(model, id)).length); continue; }\n" +
            "    if (op === 'delete') {\n" +
            "      if (!find(model, a)) { out.push('P2025'); continue; }\n" +
            "      out.push(removeRow(model, a) ?? 'ok');\n" +
            '      continue;\n' +
            '    }\n' +
            "    if (op === 'deleteMany') {\n" +
            '      let n = 0;\n' +
            '      for (const id of a) { if (find(model, id) && !removeRow(model, id)) n++; }\n' +
            "      out.push('count=' + n);\n" +
            '      continue;\n' +
            '    }\n' +
            "    if (op === 'upsert') {\n" +
            '      const hit = db[model].find((r) => r[a] === b);\n' +
            "      if (hit) { out.push('updated'); continue; }\n" +
            '      db[model].push({ id: Math.max(0, ...db[model].map((r) => r.id)) + 1, [a]: b });\n' +
            "      out.push('created');\n" +
            '      continue;\n' +
            '    }\n' +
            '  }\n' +
            '  return { out, sizes: Object.fromEntries(Object.entries(db).map(([m, r]) => [m, r.length])) };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
