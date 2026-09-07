/**
 * Prisma ORM — Final Exam (FE): 50 câu trắc nghiệm phủ cả 13 mục (s00–s12).
 *
 * Đề tự soạn, bám sát `content/courses/prisma-orm/s00…s12`. MỌI đoạn SQL, mọi
 * mã lỗi P#### và mọi thông báo trong đề đều CHẠY THẬT trên:
 *   • prisma 5.22.0 · @prisma/client 5.22.0 · Node v22.21.0 · darwin-arm64
 *   • PostgreSQL 16.15 (Debian) trong Docker, cổng 5433
 * Không có dòng output nào ở đây viết từ trí nhớ.
 *
 * ⚠️ NĂM CHỖ MÁY KHÁC GIÁO TRÌNH, đã đo lại và ĐỀ THEO MÁY:
 *
 *   1. Giáo trình (1.5 và 6.1) nói sửa một migration ĐÃ ÁP DỤNG sẽ làm "mọi
 *      lần deploy sau đó hỏng với P3009". Đo thật: `npx prisma migrate deploy`
 *      của 5.22 KHÔNG đối chiếu checksum của migration đã áp — thêm một dòng
 *      chú thích vào file cũ rồi deploy một migration MỚI vẫn xanh, trong khi
 *      sha256 của file đã lệch hẳn với cột `checksum`. Thứ bắt được nó là
 *      `migrate dev`, với thông báo "The migration `X` was modified after it
 *      was applied." rồi đòi RESET. Nên đề chỉ hỏi ai bắt được, không hỏi
 *      "deploy có hỏng không".
 *
 *   2. Giáo trình (8.3) nói giá trị enum sai trả về `P2009`. Đo thật:
 *      `prisma.user.create({ data: { role: 'MODERATOR' } })` ném
 *      `PrismaClientValidationError` và lớp lỗi đó KHÔNG có trường `code`.
 *      Đề dùng chính sự thật ấy (câu 32) thay vì mã P2009.
 *
 *   3. Giáo trình (6.1, mục "checksum") gán lỗi shadow database (P3006) cho
 *      `migrate deploy`, trong khi 6.2 nói `migrate deploy` không dùng shadow
 *      database. Đo thật: 6.2 đúng — `migrate deploy` vẫn áp bình thường một
 *      migration mà `migrate dev` từ chối với P3006. Đề theo 6.2 (câu 24).
 *
 *   4. Giáo trình (6.5, 12.2) chỉ nói tới `P3009`. Đo thật: LẦN HỎNG ĐẦU TIÊN
 *      của `migrate deploy` là **P3018** kèm SQLSTATE của Postgres; `P3009`
 *      chỉ xuất hiện từ lần `migrate deploy` THỨ HAI trở đi. Đề dạy đúng hai
 *      mã đó theo thứ tự (câu 26).
 *
 *   5. Giáo trình (9.2) nói `relationLoadStrategy` mặc định là `'query'`. Đo
 *      thật trên 5.22: KHÔNG bật preview `relationJoins` thì tham số đó bị từ
 *      chối hẳn và `include` luôn là 2 câu lệnh; BẬT preview lên thì mặc định
 *      thành `'join'` (1 câu lệnh LATERAL). Nên đề chỉ hỏi hai chiến lược sinh
 *      ra SQL khác nhau thế nào (câu 36), không hỏi cái nào là mặc định.
 *
 * Phân bố vị trí đáp án (kiểm bằng lệnh dưới): A 12 · B 13 · C 13 · D 12.
 *   node -e "import('./content/exams/PRISMA-ORM-FE.mjs').then(m=>{const d={};m.default.exams[0].questions.forEach(q=>q.correctIndexes.forEach(c=>d[c]=(d[c]||0)+1));console.log(d)})"
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/PRISMA-ORM-FE.mjs --apply
 */
import { B, EX, code, c, mcq } from './_lib/prisma-exam-kit.mjs';

const INSTRUCTIONS =
  '<div class="ml-en">' +
  '<p><b>Final Exam</b> — 50 multiple-choice questions across all thirteen sections, from "what an ORM actually is" to "read the first error, not the loudest". Many questions show a real query log, a real migration transcript or a real error object; every one of those came from actually running the command against PostgreSQL 16.15 with Prisma 5.22, so read the transcript rather than the intuition.</p>' +
  '<p>Three habits pay off here. First, count statements, not milliseconds: an <code>include</code> that becomes two <code>SELECT</code>s and a loop that becomes forty-one look identical in a screenshot and nothing alike in production. Second, read the error code, not the sentence — P1001 is the network, P2002 is the data, P2024 is the pool, P2028 is the transaction deadline, P3009 is a migration a human must resolve. Third, ask of every value whether Prisma computed it in JavaScript or the database computed it in SQL; <code>uuid()</code>, <code>@updatedAt</code> and a computed field from <code>$extends</code> all live on the client side, and a row written by anything else will not have them.</p>' +
  '<p>You can flag a question and come back to it. The timer auto-submits when it ends, and every question shows a bilingual explanation afterwards.</p>' +
  '</div>' +
  '<div class="ml-vi">' +
  '<p><b>Thi cuối khoá</b> — 50 câu trắc nghiệm phủ cả mười ba mục, từ "ORM thật ra là gì" tới "đọc lỗi ĐẦU TIÊN, không phải lỗi to nhất". Nhiều câu cho sẵn một đoạn log truy vấn thật, một đoạn chạy migration thật hay một đối tượng lỗi thật; mọi đoạn loại đó đều lấy từ việc chạy thật câu lệnh trên PostgreSQL 16.15 với Prisma 5.22, nên hãy đọc đoạn ghi lại thay vì đoán theo cảm tính.</p>' +
  '<p>Ba thói quen giúp ích ở đây. Một, hãy ĐẾM CÂU LỆNH chứ đừng đếm mili giây: một <code>include</code> hoá thành hai <code>SELECT</code> và một vòng lặp hoá thành bốn mươi mốt trông y hệt nhau trên ảnh chụp màn hình và chẳng giống nhau chút nào trên production. Hai, đọc MÃ LỖI chứ đừng đọc câu văn — P1001 là mạng, P2002 là dữ liệu, P2024 là pool, P2028 là hạn giao dịch, P3009 là một migration cần người xử lý. Ba, với mọi giá trị hãy hỏi xem Prisma tính nó bằng JavaScript hay cơ sở dữ liệu tính nó bằng SQL; <code>uuid()</code>, <code>@updatedAt</code> và một trường tính sẵn của <code>$extends</code> đều nằm phía client, nên một dòng do thứ khác ghi vào sẽ không có chúng.</p>' +
  '<p>Bạn có thể đánh dấu câu để quay lại sau. Hết giờ hệ thống tự nộp, và sau khi nộp mỗi câu đều có lời giải thích song ngữ.</p>' +
  '</div>';

export default {
  course: { slug: 'prisma-orm' },
  exams: [
    {
      kind: 'FE',
      code: 'FE',
      source: 'SAMPLE',
      sortOrder: 1,
      title: B(
        'Final Exam — the whole Prisma ORM course (50 questions)',
        'Thi cuối khoá — toàn bộ khoá Prisma ORM (50 câu)',
      ),
      description: B(
        'Fifty multiple-choice questions covering all thirteen sections: what Prisma solves and how it is set up, what an ORM actually is and what prisma generate writes, the whole schema language, every relation shape and referential action, reading and writing, filtering and pagination and aggregation, migrations and the shadow database, transactions and concurrency, the generated type system, performance and the connection pool, raw SQL and client extensions, shipping to production, and diagnosing a Prisma failure by its error code.',
        'Năm mươi câu trắc nghiệm phủ cả mười ba mục: Prisma giải quyết gì và cài đặt ra sao, ORM thật ra là gì và prisma generate viết ra cái gì, trọn ngôn ngữ lược đồ, mọi hình dạng quan hệ và hành vi tham chiếu, đọc và ghi, lọc — phân trang — tổng hợp, migration và shadow database, giao dịch và tranh chấp, hệ kiểu được sinh ra, hiệu năng và connection pool, SQL thô và client extension, đưa lên production, và chẩn đoán một cú hỏng của Prisma bằng chính mã lỗi của nó.',
      ),
      durationMinutes: 60,
      totalPoints: 10,
      passMark: 5,
      isPublished: true,
      instructions: INSTRUCTIONS,
      questions: [
        /* ══════════ Mục 0 — Prisma giải quyết gì, và cài đặt (2 câu) ══════════ */

        // q1 · 0.2 · đáp án 2
        mcq({
          prompt: B(
            'A developer runs ' + c('npx prisma migrate dev') + ' and it connects and applies the migration. Then they run ' + c('node dist/index.js') + ' in the same folder and the process dies immediately with ' + c('Environment variable not found: DATABASE_URL') + '. Nothing about <code>.env</code> changed between the two commands. What is happening?',
            'Một lập trình viên chạy ' + c('npx prisma migrate dev') + ' và nó kết nối được rồi áp migration xong. Sau đó anh ta chạy ' + c('node dist/index.js') + ' trong cùng thư mục và tiến trình chết ngay với ' + c('Environment variable not found: DATABASE_URL') + '. Không có gì trong <code>.env</code> thay đổi giữa hai lệnh. Chuyện gì đang xảy ra?',
          ),
          options: [
            B(
              'The migration consumed the variable — Prisma unsets <code>DATABASE_URL</code> after applying a migration so a stale URL cannot be reused by the application process',
              'Lệnh migration đã tiêu thụ mất biến đó — Prisma xoá <code>DATABASE_URL</code> sau khi áp migration để tiến trình ứng dụng không dùng lại một URL cũ',
            ),
            B(
              'The built output lost the variable at compile time; <code>DATABASE_URL</code> must be passed to the bundler so it is baked into <code>dist/</code>',
              'Bản dựng làm mất biến đó lúc biên dịch; <code>DATABASE_URL</code> phải được truyền cho trình đóng gói để nướng thẳng vào <code>dist/</code>',
            ),
            B(
              'The Prisma CLI reads <code>.env</code> itself, without dotenv; plain Node does not, so the application needs <code>import \'dotenv/config\'</code> or <code>--env-file=.env</code>',
              'Prisma CLI tự đọc <code>.env</code>, không cần dotenv; Node thuần thì không, nên ứng dụng cần <code>import \'dotenv/config\'</code> hoặc <code>--env-file=.env</code>',
            ),
            B(
              'The generated client stores the connection string at generate time, so re-running <code>prisma generate</code> after the migration will fix it',
              'Client sinh ra có lưu chuỗi kết nối lúc generate, nên chạy lại <code>prisma generate</code> sau migration sẽ sửa được',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The Prisma CLI loads <code>.env</code> from the working directory and from <code>prisma/.env</code> on its own — that is a CLI feature, not a Node feature. Your application is plain Node, and plain Node does nothing with a <code>.env</code> file unless you ask. So the exact same file works for one command and is invisible to the other. The fix is one line at the top of the entrypoint (<code>import \'dotenv/config\'</code>) or one flag (<code>node --env-file=.env</code>). A related detail worth knowing: if both <code>.env</code> and <code>prisma/.env</code> exist, the CLI loads both and one quietly wins, so keep exactly one. Option 1 invents behaviour Prisma does not have. Option 2 describes a bundler, not <code>tsc</code>-plus-Node. Option 4 is wrong in a way worth being precise about: the generated client embeds <em>the schema</em>, not the connection string — <code>env("DATABASE_URL")</code> is resolved at runtime, every run.',
            'Prisma CLI tự nạp <code>.env</code> từ thư mục hiện tại và từ <code>prisma/.env</code> — đó là tính năng của CLI, không phải của Node. Ứng dụng của bạn là Node thuần, mà Node thuần không làm gì với file <code>.env</code> trừ khi bạn bảo nó. Nên đúng một file ấy chạy được với lệnh này và vô hình với lệnh kia. Cách sửa là một dòng ở đầu điểm vào (<code>import \'dotenv/config\'</code>) hoặc một cái cờ (<code>node --env-file=.env</code>). Một chi tiết liên quan đáng nhớ: nếu tồn tại cả <code>.env</code> lẫn <code>prisma/.env</code> thì CLI nạp cả hai và một cái âm thầm thắng, nên hãy giữ đúng một cái. Phương án 1 bịa ra một hành vi Prisma không có. Phương án 2 mô tả một trình đóng gói chứ không phải <code>tsc</code> cộng Node. Phương án 4 sai theo kiểu đáng nói cho chính xác: client sinh ra nhúng LƯỢC ĐỒ chứ không nhúng chuỗi kết nối — <code>env("DATABASE_URL")</code> được phân giải lúc chạy, mỗi lần chạy.',
          ),
        }),

        // q2 · 0.1 · đáp án 0
        mcq({
          prompt: B(
            'Your team is choosing an ORM. Someone argues for Prisma with: "it gives us database independence, and it will keep our queries fast as the data grows". Which correction is accurate?',
            'Nhóm của bạn đang chọn ORM. Có người ủng hộ Prisma với lý do: "nó cho ta độc lập với cơ sở dữ liệu, và nó sẽ giữ cho truy vấn của ta nhanh khi dữ liệu lớn lên". Điều chỉnh nào là chính xác?',
          ),
          options: [
            B(
              'Both halves are wrong: native types, index types, partial indexes, JSON operators and array columns are all provider-specific, and Prisma adds no indexes, rewrites no filters and issues no warnings',
              'Cả hai vế đều sai: native type, kiểu chỉ mục, chỉ mục một phần, toán tử JSON và cột mảng đều gắn chặt với một provider, còn Prisma thì không thêm chỉ mục nào, không viết lại điều kiện lọc nào và không cảnh báo gì cả',
            ),
            B(
              'The first half is right and the second is wrong: the schema language is portable across providers, but query planning stays the database\'s job',
              'Vế đầu đúng và vế sau sai: ngôn ngữ lược đồ chuyển được giữa các provider, còn việc lập kế hoạch truy vấn vẫn là việc của cơ sở dữ liệu',
            ),
            B(
              'The second half is right and the first is wrong: Prisma cannot swap engines, but its query engine does rewrite inefficient filters before sending them',
              'Vế sau đúng và vế đầu sai: Prisma không đổi được engine, nhưng query engine của nó CÓ viết lại các điều kiện lọc kém hiệu quả trước khi gửi đi',
            ),
            B(
              'Both halves are right, provided you avoid raw SQL and let the query engine choose the loading strategy for you',
              'Cả hai vế đều đúng, miễn là bạn tránh SQL thô và để query engine tự chọn chiến lược nạp cho bạn',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Prisma is a type-safe client and a migration tool, and the course states plainly that it is neither of the two things being claimed. Portability: the moment you write <code>@db.VarChar(50)</code>, <code>@@index(..., type: Gin)</code>, a <code>String[]</code> column, a JSON path filter or an <code>Unsupported("vector(1536)")</code>, the schema is a PostgreSQL schema. Performance: Prisma generates correct SQL and stops there — it will not notice that <code>contains</code> became <code>LIKE \'%x%\'</code> and cannot use your B-tree, and it will not notice that the foreign key you just declared has no index. That is the whole shape of "a page that took 40 ms in development takes 9 seconds in production". Options 2 and 3 each keep half the myth; option 4 keeps both and adds a third (the loading strategy is a per-query decision <em>you</em> make, and the wrong one can be ten times slower on a wide parent row).',
            'Prisma là một client an toàn kiểu và một công cụ migration, và giáo trình nói thẳng rằng nó không phải cả hai thứ đang được tuyên bố kia. Về tính chuyển đổi: ngay khi bạn viết <code>@db.VarChar(50)</code>, <code>@@index(..., type: Gin)</code>, một cột <code>String[]</code>, một điều kiện lọc theo đường dẫn JSON hay một <code>Unsupported("vector(1536)")</code>, thì lược đồ ấy là lược đồ của PostgreSQL. Về hiệu năng: Prisma sinh ra SQL đúng rồi dừng lại ở đó — nó sẽ không nhận ra rằng <code>contains</code> đã thành <code>LIKE \'%x%\'</code> và không dùng được B-tree của bạn, và nó cũng không nhận ra cái khoá ngoại bạn vừa khai báo chẳng có chỉ mục nào. Đó chính là hình dạng của câu "một trang chạy 40 ms lúc phát triển thành 9 giây trên production". Phương án 2 và 3 mỗi cái giữ lại một nửa huyền thoại; phương án 4 giữ cả hai và thêm cái thứ ba (chiến lược nạp là quyết định của BẠN theo từng truy vấn, và chọn sai có thể chậm gấp mười lần trên một dòng cha lớn).',
          ),
        }),

        /* ══════════════ Chương 1 — ORM là gì thật sự (4 câu) ══════════════ */
        // q3 · 1.1 · đáp án 1
        mcq({
          prompt: B(
            'Two <code>findUnique</code> calls fetch the same row, then the second object is mutated:' +
            code('const a = await prisma.user.findUnique({ where: { id: 1 } });\nconst b = await prisma.user.findUnique({ where: { id: 1 } });\nb.email = "moi@vidu.com";'),
            'Hai lời gọi <code>findUnique</code> lấy về cùng một dòng, rồi đối tượng thứ hai bị sửa:' +
            code('const a = await prisma.user.findUnique({ where: { id: 1 } });\nconst b = await prisma.user.findUnique({ where: { id: 1 } });\nb.email = "moi@vidu.com";'),
          ),
          options: [
            B(
              '<code>a === b</code>, because the identity map returns the same instance for the same primary key, so <code>a.email</code> now reads the new value too',
              '<code>a === b</code>, vì identity map trả về cùng một thể hiện cho cùng một khoá chính, nên <code>a.email</code> bây giờ cũng đọc ra giá trị mới',
            ),
            B(
              '<code>a === b</code> is false and <code>a.email</code> is unchanged; the assignment writes to a plain object and nothing is scheduled for the database',
              '<code>a === b</code> là false và <code>a.email</code> không đổi; phép gán chỉ ghi vào một đối tượng thường và không có gì được xếp lịch gửi xuống cơ sở dữ liệu',
            ),
            B(
              '<code>a === b</code> is false but the change is tracked per row, so the next <code>$transaction</code> flushes it as an <code>UPDATE</code>',
              '<code>a === b</code> là false nhưng thay đổi vẫn được theo dõi theo từng dòng, nên lần <code>$transaction</code> kế tiếp sẽ đẩy nó đi thành một <code>UPDATE</code>',
            ),
            B(
              'The assignment throws, because rows returned by Prisma Client are frozen to prevent exactly this confusion',
              'Phép gán ném lỗi, vì các dòng do Prisma Client trả về đều bị đóng băng để chặn đúng sự nhầm lẫn này',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Prisma deliberately has no identity map, no change tracking, no dirty checking and no lazy loading — the course calls this the single most important design decision in the tool. Every query builds fresh plain objects, so two fetches of row 1 are two unrelated objects and <code>a === b</code> is <code>false</code> while <code>a.email === b.email</code> was <code>true</code> until you changed one. Nothing is watching that assignment; the row changes only when you call <code>update</code>. The gain is that surprises are impossible: an un-fetched relation is <code>undefined</code> rather than a proxy, so a loop over <code>user.posts</code> you forgot to include crashes immediately instead of silently issuing a query per user. Option 1 describes Hibernate. Option 3 describes a unit of work. Option 4 invents a freeze Prisma does not do.',
            'Prisma cố ý không có identity map, không theo dõi thay đổi, không dirty checking và không lazy loading — giáo trình gọi đây là quyết định thiết kế quan trọng nhất của cả công cụ. Mỗi truy vấn dựng ra những đối tượng thường hoàn toàn mới, nên hai lần lấy dòng số 1 là hai đối tượng chẳng liên quan gì nhau và <code>a === b</code> là <code>false</code>, trong khi <code>a.email === b.email</code> vẫn là <code>true</code> cho tới lúc bạn sửa một trong hai. Không có gì đang canh chừng phép gán ấy; dòng dữ liệu chỉ đổi khi bạn gọi <code>update</code>. Cái được là những bất ngờ trở nên bất khả: một quan hệ chưa lấy về là <code>undefined</code> chứ không phải một proxy, nên vòng lặp trên <code>user.posts</code> mà bạn quên include sẽ chết ngay lập tức thay vì âm thầm bắn một truy vấn cho mỗi người dùng. Phương án 1 mô tả Hibernate. Phương án 3 mô tả unit of work. Phương án 4 bịa ra một phép đóng băng mà Prisma không làm.',
          ),
        }),

        // q4 · 1.3 · đáp án 3
        mcq({
          prompt: B(
            'This is a real line from <code>prisma.$on(\'query\', …)</code> for ' + c("findFirst({ where: { name: { contains: 'An' } } })") + ':' +
            code('SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name",\n       "public"."User"."role"::text, "public"."User"."createdAt"\nFROM "public"."User"\nWHERE "public"."User"."name"::text LIKE $1 LIMIT $2 OFFSET $3\nparams: ["%An%",1,0]') +
            'Which reading of this log is correct?',
            'Đây là một dòng thật từ <code>prisma.$on(\'query\', …)</code> cho ' + c("findFirst({ where: { name: { contains: 'An' } } })") + ':' +
            code('SELECT "public"."User"."id", "public"."User"."email", "public"."User"."name",\n       "public"."User"."role"::text, "public"."User"."createdAt"\nFROM "public"."User"\nWHERE "public"."User"."name"::text LIKE $1 LIMIT $2 OFFSET $3\nparams: ["%An%",1,0]') +
            'Cách đọc đoạn log này thế nào là đúng?',
          ),
          options: [
            B(
              'The <code>%An%</code> in the parameter list means the value was interpolated into the SQL text, so this query is exposed to injection through <code>name</code>',
              'Chuỗi <code>%An%</code> trong danh sách tham số nghĩa là giá trị đã được nội suy vào phần chữ của SQL, nên truy vấn này hở đường tiêm SQL qua <code>name</code>',
            ),
            B(
              'The explicit column list is a Prisma optimisation that only appears when you use <code>select</code>; a bare <code>findFirst</code> sends <code>SELECT *</code>',
              'Danh sách cột tường minh là một tối ưu của Prisma và chỉ xuất hiện khi bạn dùng <code>select</code>; một <code>findFirst</code> trần sẽ gửi <code>SELECT *</code>',
            ),
            B(
              'The <code>LIMIT $2 OFFSET $3</code> proves an index was used, because a plan without an index cannot stop early',
              'Phần <code>LIMIT $2 OFFSET $3</code> chứng tỏ có chỉ mục được dùng, vì một kế hoạch không có chỉ mục thì không thể dừng sớm',
            ),
            B(
              'Values travel as bind parameters and never as SQL text, every column is named rather than starred — and the <code>LIKE \'%…\'</code> with a leading wildcard is the part that cannot use a plain B-tree index',
              'Giá trị đi bằng tham số ràng buộc chứ không bao giờ bằng chữ trong SQL, mọi cột đều được gọi tên chứ không dùng dấu sao — và cái <code>LIKE \'%…\'</code> có ký tự đại diện ở đầu mới là chỗ không dùng được chỉ mục B-tree thường',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Three habits come straight out of reading this one line. <b>Parameters are always separate</b>: <code>$1</code> is a placeholder and <code>"%An%"</code> travels beside the statement, never inside it, which makes every builder query structurally immune to injection — the value cannot become syntax. <b>Prisma never emits <code>SELECT *</code></b>: it names every column it wants, always, which is exactly why forgetting <code>select</code> ships your password column to whoever calls <code>res.json(user)</code>. <b><code>contains</code> becomes a leading-wildcard <code>LIKE</code></b>, and a B-tree cannot seek into a pattern that starts with <code>%</code> — this is the single most common cause of "the search box is slow", and the fix is a trigram GIN index, not a bigger machine. Option 1 reverses what a parameter list means. Option 2 is false in both halves. Option 3 confuses a syntactic <code>LIMIT</code> with a plan: a sequential scan also stops after one matching row, and the cast <code>::text</code> here would defeat a plain index anyway.',
            'Ba thói quen sinh ra thẳng từ việc đọc đúng một dòng này. <b>Tham số luôn tách rời</b>: <code>$1</code> là chỗ giữ chỗ còn <code>"%An%"</code> đi bên cạnh câu lệnh chứ không bao giờ nằm bên trong nó, và điều đó làm mọi truy vấn qua builder miễn nhiễm về mặt cấu trúc với SQL injection — giá trị không thể hoá thành cú pháp. <b>Prisma không bao giờ phát ra <code>SELECT *</code></b>: nó gọi tên từng cột nó muốn, luôn luôn, và chính vì thế mà quên <code>select</code> là gửi thẳng cột mật khẩu cho bất cứ ai gọi <code>res.json(user)</code>. <b><code>contains</code> hoá thành <code>LIKE</code> có ký tự đại diện ở đầu</b>, mà B-tree thì không dò vào được một mẫu bắt đầu bằng <code>%</code> — đây là nguyên nhân phổ biến nhất của "ô tìm kiếm chậm", và cách sửa là một chỉ mục GIN trigram chứ không phải một cái máy to hơn. Phương án 1 hiểu ngược ý nghĩa của danh sách tham số. Phương án 2 sai ở cả hai vế. Phương án 3 nhầm một <code>LIMIT</code> về mặt cú pháp với một kế hoạch: quét tuần tự cũng dừng sau dòng khớp đầu tiên, mà phép ép <code>::text</code> ở đây thì dù sao cũng vô hiệu hoá một chỉ mục thường.',
          ),
        }),

        // q5 · 1.3 · đáp án 0
        mcq({
          prompt: B(
            'A CI pipeline runs <code>npm ci</code>, then <code>npx prisma migrate deploy</code>, then <code>npm run build</code>, then the tests. The migration that just ran added <code>users.phone</code>. The tests fail with ' + c('The column `users.phone` does not exist in the current database') + ', yet <code>psql</code> shows the column plainly. What is wrong, and where?',
            'Một đường ống CI chạy <code>npm ci</code>, rồi <code>npx prisma migrate deploy</code>, rồi <code>npm run build</code>, rồi chạy test. Migration vừa chạy đã thêm cột <code>users.phone</code>. Test hỏng với ' + c('The column `users.phone` does not exist in the current database') + ', trong khi <code>psql</code> thì hiện rành rành cột đó. Sai ở đâu, và sai cái gì?',
          ),
          options: [
            B(
              'The client was generated by <code>npm ci</code>\'s postinstall, before the migration ran, and it validates against the schema embedded at generate time — CI must run <code>prisma generate</code> after <code>migrate deploy</code>',
              'Client được sinh ra bởi postinstall của <code>npm ci</code>, tức là TRƯỚC khi migration chạy, và nó kiểm tra dựa trên lược đồ nhúng vào lúc generate — CI phải chạy <code>prisma generate</code> SAU <code>migrate deploy</code>',
            ),
            B(
              'The migration applied to the shadow database instead of the real one; add <code>directUrl</code> so <code>migrate deploy</code> targets the primary',
              'Migration đã áp vào shadow database chứ không phải cơ sở dữ liệu thật; hãy thêm <code>directUrl</code> để <code>migrate deploy</code> nhắm vào máy chính',
            ),
            B(
              'The query engine caches the table definition for the lifetime of the pool; calling <code>prisma.$disconnect()</code> between the migration and the tests clears it',
              'Query engine cache lại định nghĩa bảng suốt vòng đời của pool; gọi <code>prisma.$disconnect()</code> giữa migration và test sẽ xoá cache đó',
            ),
            B(
              'PostgreSQL has not committed the DDL yet because <code>migrate deploy</code> leaves the migration transaction open until the process exits',
              'PostgreSQL chưa commit phần DDL vì <code>migrate deploy</code> để mở giao dịch của migration cho tới khi tiến trình kết thúc',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The query engine validates every request against <em>the schema embedded in the generated client</em>, not against the live database. <code>npm ci</code> triggers the <code>postinstall</code> hook, which runs <code>prisma generate</code> against whatever <code>schema.prisma</code> said at that moment — and in a fresh checkout that is fine, but the client is now frozen at that instant. Anything the migration adds afterwards is invisible to it, so you get errors naming columns that plainly exist, and the instinct is to doubt the database. The database is right; the client is stale. The rule the course gives is mechanical: <b>in CI, always run <code>generate</code> after <code>migrate deploy</code></b>. Option 2 misreads <code>directUrl</code>, which is for pooler bypass, and <code>migrate deploy</code> never uses a shadow database at all. Option 3 invents a cache — the engine holds the schema from generate time, not from the connection. Option 4 is false: each migration file commits on its own.',
            'Query engine kiểm mọi yêu cầu dựa trên LƯỢC ĐỒ ĐƯỢC NHÚNG VÀO CLIENT ĐÃ SINH, không phải dựa trên cơ sở dữ liệu đang sống. <code>npm ci</code> kích hoạt hook <code>postinstall</code>, và hook đó chạy <code>prisma generate</code> theo đúng nội dung <code>schema.prisma</code> ở thời điểm ấy — trong một bản checkout mới thì điều đó ổn, nhưng client từ giờ đã đông cứng ở khoảnh khắc đó. Mọi thứ migration thêm vào sau đó đều vô hình với nó, nên bạn nhận được lỗi gọi tên những cột rành rành đang có, và bản năng là đi nghi ngờ cơ sở dữ liệu. Cơ sở dữ liệu đúng; client mới là thứ cũ. Quy tắc giáo trình đưa ra rất máy móc: <b>trong CI, luôn chạy <code>generate</code> SAU <code>migrate deploy</code></b>. Phương án 2 hiểu sai <code>directUrl</code> vốn để đi vòng qua pooler, và <code>migrate deploy</code> thì không hề dùng shadow database. Phương án 3 bịa ra một cache — engine giữ lược đồ từ lúc generate chứ không từ kết nối. Phương án 4 sai: mỗi file migration tự commit.',
          ),
        }),

        // q6 · 1.5 · đáp án 2
        mcq({
          prompt: B(
            'A team prototypes locally with <code>npx prisma db push</code> and deploys with <code>npx prisma migrate deploy</code> in CI. Everything works for weeks, then a deploy applies a migration that fails on production with a column that already exists. What did <code>db push</code> do that made this inevitable?',
            'Một nhóm làm mẫu ở máy cục bộ bằng <code>npx prisma db push</code> và deploy bằng <code>npx prisma migrate deploy</code> trong CI. Mọi thứ chạy tốt hàng tuần, rồi một lần deploy áp một migration và nó hỏng trên production vì một cột đã tồn tại. <code>db push</code> đã làm gì khiến chuyện này là tất yếu?',
          ),
          options: [
            B(
              'It wrote a migration folder with no <code>migration.sql</code>, so <code>migrate deploy</code> re-derived the SQL from the schema and derived it differently',
              'Nó ghi ra một thư mục migration không có <code>migration.sql</code>, nên <code>migrate deploy</code> tự suy lại SQL từ lược đồ và suy ra khác đi',
            ),
            B(
              'It marked the change as applied in <code>_prisma_migrations</code> on the developer machine only, so the row is missing on production',
              'Nó đánh dấu thay đổi là đã áp trong <code>_prisma_migrations</code> chỉ trên máy lập trình viên, nên production thiếu mất dòng đó',
            ),
            B(
              'It leaves nothing behind at all — no file and no row in <code>_prisma_migrations</code> — so the schema evolved locally with no history, and production received migrations nobody had ever run',
              'Nó không để lại gì cả — không file, không dòng nào trong <code>_prisma_migrations</code> — nên lược đồ tiến hoá ở máy cục bộ mà không có lịch sử nào, còn production thì nhận những migration chưa ai từng chạy',
            ),
            B(
              'It rewrote the checksums of the existing migrations so the local history no longer matches the one in git',
              'Nó ghi lại checksum của các migration đang có nên lịch sử ở máy cục bộ không còn khớp với lịch sử trong git',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>db push</code> is a diff-and-apply with no bookkeeping whatsoever: it compares <code>schema.prisma</code> with the live database, applies the difference, and stops. No folder, no SQL file, no row anywhere. That is exactly right for a disposable prototype database or an ephemeral CI test database — it is faster than replaying a hundred migrations. It is exactly wrong as half of a workflow whose other half is <code>migrate deploy</code>, because the developer\'s database is now shaped by changes that were never written down, every migration that eventually gets generated is diffed against a schema no server has, and the first server to run them for real is production. (The second thing <code>db push</code> does that surprises people: when a change cannot be applied in place, its answer is to drop and recreate the table, behind a prompt that says "All existing data will be lost".) Options 1, 2 and 4 all describe some record being written; the whole point is that none is.',
            '<code>db push</code> là một phép so-rồi-áp không ghi sổ gì hết: nó so <code>schema.prisma</code> với cơ sở dữ liệu đang sống, áp phần chênh lệch, rồi dừng. Không thư mục, không file SQL, không dòng nào ở đâu cả. Điều đó hoàn toàn đúng cho một cơ sở dữ liệu mẫu dùng xong vứt hoặc một cơ sở dữ liệu test tạm trong CI — nó nhanh hơn việc phát lại một trăm migration. Và nó hoàn toàn sai khi làm một nửa của quy trình mà nửa kia là <code>migrate deploy</code>, bởi vì cơ sở dữ liệu của lập trình viên giờ được nắn bởi những thay đổi chưa từng được ghi lại, mọi migration cuối cùng được sinh ra đều so với một lược đồ mà không máy chủ nào có, và máy chủ đầu tiên chạy chúng thật chính là production. (Thứ thứ hai <code>db push</code> làm khiến người ta bất ngờ: khi một thay đổi không áp tại chỗ được, câu trả lời của nó là xoá bảng rồi tạo lại, sau một câu hỏi ghi "All existing data will be lost".) Phương án 1, 2 và 4 đều mô tả một dạng ghi chép nào đó; vấn đề nằm ở chỗ chẳng có ghi chép nào cả.',
          ),
        }),

        /* ══════════════ Chương 2 — Ngôn ngữ lược đồ (4 câu) ══════════════ */
        // q7 · 2.1 + 2.4 · đáp án 1
        mcq({
          prompt: B(
            'A model declares ' + c('price Decimal') + ' and ' + c('ts DateTime') + ' with no <code>@db.</code> attribute on either. ' + c('prisma migrate diff --from-empty --to-schema-datamodel') + ' emits:' +
            code('"price" DECIMAL(65,30) NOT NULL,\n"ts"    TIMESTAMP(3) NOT NULL,') +
            'Which pair of consequences follows?',
            'Một model khai ' + c('price Decimal') + ' và ' + c('ts DateTime') + ' mà không có thuộc tính <code>@db.</code> nào ở cả hai. ' + c('prisma migrate diff --from-empty --to-schema-datamodel') + ' phát ra:' +
            code('"price" DECIMAL(65,30) NOT NULL,\n"ts"    TIMESTAMP(3) NOT NULL,') +
            'Cặp hệ quả nào là đúng?',
          ),
          options: [
            B(
              'Both defaults are fine for money and timestamps; <code>DECIMAL(65,30)</code> is exact and <code>TIMESTAMP(3)</code> stores the offset the client sent',
              'Cả hai mặc định đều ổn cho tiền và mốc thời gian; <code>DECIMAL(65,30)</code> là chính xác còn <code>TIMESTAMP(3)</code> lưu luôn cả độ lệch múi giờ mà client gửi lên',
            ),
            B(
              '<code>DECIMAL(65,30)</code> is far wider than any price needs and the value arrives in JavaScript as a <code>Prisma.Decimal</code> object, and <code>TIMESTAMP(3)</code> carries no time zone — so a <code>Timestamptz</code> and an explicit <code>Decimal(p, s)</code> are both worth declaring',
              '<code>DECIMAL(65,30)</code> rộng hơn nhiều so với mọi mức giá cần tới và giá trị về tới JavaScript dưới dạng một đối tượng <code>Prisma.Decimal</code>, còn <code>TIMESTAMP(3)</code> thì không mang múi giờ — nên khai rõ <code>Timestamptz</code> và <code>Decimal(p, s)</code> đều đáng làm',
            ),
            B(
              'Neither line matters through Prisma, because Prisma normalises numbers to <code>number</code> and timestamps to UTC on both read and write',
              'Cả hai dòng đều không quan trọng khi đi qua Prisma, vì Prisma chuẩn hoá số về <code>number</code> và mốc thời gian về UTC ở cả chiều đọc lẫn chiều ghi',
            ),
            B(
              'The precision is a bug in the diff; the real column is <code>NUMERIC</code> with no precision, and <code>TIMESTAMP(3)</code> is an alias for <code>TIMESTAMPTZ(3)</code> on PostgreSQL',
              'Con số độ chính xác kia là lỗi của phép diff; cột thật là <code>NUMERIC</code> không có độ chính xác, còn <code>TIMESTAMP(3)</code> là bí danh của <code>TIMESTAMPTZ(3)</code> trên PostgreSQL',
            ),
          ],
          correct: 1,
          explanation: EX(
            'These are the two native-type defaults the course calls "the two that bite", and the diff above is the machine\'s own output. <b>Decimal</b> without <code>@db.Decimal(p, s)</code> becomes <code>DECIMAL(65,30)</code> — thirty digits after the point for a price that needs two — and it arrives in JavaScript as a <code>Prisma.Decimal</code>, not a number, so <code>price + 1</code> is a string concatenation and <code>JSON.stringify</code> renders its internals rather than a value. <b>DateTime</b> without <code>@db.Timestamptz(n)</code> becomes <code>TIMESTAMP(3)</code>, which stores no zone. Read through Prisma alone it round-trips correctly, because Prisma converts to UTC before writing — the damage appears the moment anything else touches the column: a <code>psql</code> session, a BI tool, a Python job, an <code>AT TIME ZONE</code> in a hand-written migration. Option 1 asserts the opposite of both. Option 3 is the comfortable belief that hides the bug until a second reader shows up. Option 4 is factually wrong: <code>TIMESTAMP</code> and <code>TIMESTAMPTZ</code> are different types.',
            'Đây đúng là hai mặc định native type mà giáo trình gọi là "hai cái cắn đau", và đoạn diff bên trên là output do chính máy in ra. <b>Decimal</b> không kèm <code>@db.Decimal(p, s)</code> thành <code>DECIMAL(65,30)</code> — ba mươi chữ số sau dấu phẩy cho một mức giá cần hai — và nó về tới JavaScript dưới dạng <code>Prisma.Decimal</code> chứ không phải số, nên <code>price + 1</code> là phép nối chuỗi và <code>JSON.stringify</code> in ra phần ruột của nó chứ không phải một giá trị. <b>DateTime</b> không kèm <code>@db.Timestamptz(n)</code> thành <code>TIMESTAMP(3)</code>, vốn không lưu múi giờ. Đọc qua riêng Prisma thì nó vẫn đi về đúng, vì Prisma quy về UTC trước khi ghi — thiệt hại xuất hiện ngay khi có thứ khác chạm vào cột đó: một phiên <code>psql</code>, một công cụ BI, một job Python, một <code>AT TIME ZONE</code> trong migration viết tay. Phương án 1 khẳng định ngược lại cả hai. Phương án 3 là niềm tin dễ chịu che mất con bọ cho tới khi có người đọc thứ hai xuất hiện. Phương án 4 sai về mặt dữ kiện: <code>TIMESTAMP</code> và <code>TIMESTAMPTZ</code> là hai kiểu khác nhau.',
          ),
        }),

        // q8 · 2.2 · đáp án 3
        mcq({
          prompt: B(
            'A model uses ' + c('id String @id @default(uuid())') + ' and ' + c('updatedAt DateTime @updatedAt') + '. The generated DDL is:' +
            code('"id"        TEXT NOT NULL,\n"updatedAt" TIMESTAMP(3) NOT NULL,') +
            'A data-import script inserts rows with plain <code>INSERT</code> in <code>psql</code>, supplying every other column. What happens, and why?',
            'Một model dùng ' + c('id String @id @default(uuid())') + ' và ' + c('updatedAt DateTime @updatedAt') + '. DDL sinh ra là:' +
            code('"id"        TEXT NOT NULL,\n"updatedAt" TIMESTAMP(3) NOT NULL,') +
            'Một script nhập dữ liệu chèn các dòng bằng <code>INSERT</code> thuần trong <code>psql</code>, có cung cấp mọi cột còn lại. Chuyện gì xảy ra, và vì sao?',
          ),
          options: [
            B(
              'Both columns fill in, because Prisma installs the defaults as PostgreSQL <code>DEFAULT</code> expressions when the migration runs',
              'Cả hai cột đều được điền, vì Prisma cài các giá trị mặc định thành biểu thức <code>DEFAULT</code> của PostgreSQL lúc migration chạy',
            ),
            B(
              '<code>id</code> fills in from <code>gen_random_uuid()</code> but <code>updatedAt</code> is left NULL, because only time-based defaults are client-side',
              '<code>id</code> được điền từ <code>gen_random_uuid()</code> còn <code>updatedAt</code> để trống, vì chỉ những mặc định theo thời gian mới nằm phía client',
            ),
            B(
              'Both columns fill in, because the query engine installs a trigger for <code>@updatedAt</code> and a sequence for <code>uuid()</code>',
              'Cả hai cột đều được điền, vì query engine cài một trigger cho <code>@updatedAt</code> và một sequence cho <code>uuid()</code>',
            ),
            B(
              'Both inserts are rejected by <code>NOT NULL</code>: neither column has a database default, because <code>uuid()</code> and <code>@updatedAt</code> are evaluated by Prisma Client in JavaScript',
              'Cả hai lệnh chèn đều bị <code>NOT NULL</code> từ chối: không cột nào có giá trị mặc định trong cơ sở dữ liệu, vì <code>uuid()</code> và <code>@updatedAt</code> đều do Prisma Client tính bằng JavaScript',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Look at the DDL: neither column has a <code>DEFAULT</code> clause, while a sibling <code>@default(now())</code> would have produced <code>DEFAULT CURRENT_TIMESTAMP</code>. That difference is the whole lesson. <code>uuid()</code>, <code>cuid()</code> and <code>nanoid()</code> are generated in JavaScript before the <code>INSERT</code> is sent — which is genuinely useful, because you know the id before the row exists — and <code>@updatedAt</code> is a client behaviour too: Prisma puts <code>"updatedAt" = $2</code> into every <code>UPDATE</code> with a JavaScript <code>new Date()</code> as the parameter. So any writer that is not Prisma Client gets nothing: a raw <code>INSERT</code>, an import script, another service, a hand-run fix in <code>psql</code>. The consequences follow: a raw <code>UPDATE</code> never touches <code>updatedAt</code>, and a wrong server clock writes a wrong timestamp. If you need a guarantee independent of who is writing, use <code>@default(dbgenerated("gen_random_uuid()"))</code> and a PostgreSQL trigger — and then drop <code>@updatedAt</code> so the two do not fight. This difference is invisible in the Prisma schema and obvious in <code>\\d</code>.',
            'Hãy nhìn phần DDL: không cột nào có mệnh đề <code>DEFAULT</code>, trong khi một cột anh em khai <code>@default(now())</code> thì đã sinh ra <code>DEFAULT CURRENT_TIMESTAMP</code>. Chính chỗ khác nhau ấy là toàn bộ bài học. <code>uuid()</code>, <code>cuid()</code> và <code>nanoid()</code> được sinh bằng JavaScript trước khi câu <code>INSERT</code> được gửi đi — điều này thật sự hữu ích, vì bạn biết id trước cả khi dòng dữ liệu tồn tại — và <code>@updatedAt</code> cũng là hành vi phía client: Prisma nhét <code>"updatedAt" = $2</code> vào mọi câu <code>UPDATE</code> với một <code>new Date()</code> của JavaScript làm tham số. Nên bất cứ ai ghi mà không phải Prisma Client đều chẳng nhận được gì: một <code>INSERT</code> thô, một script nhập liệu, một dịch vụ khác, một lần sửa tay trong <code>psql</code>. Hệ quả đi theo: một <code>UPDATE</code> thô không bao giờ chạm tới <code>updatedAt</code>, và một chiếc đồng hồ máy chủ sai sẽ ghi một mốc thời gian sai. Nếu bạn cần một bảo đảm không phụ thuộc vào việc ai đang ghi, hãy dùng <code>@default(dbgenerated("gen_random_uuid()"))</code> cùng một trigger của PostgreSQL — rồi bỏ <code>@updatedAt</code> đi để hai bên khỏi đánh nhau. Khác biệt này vô hình trong lược đồ Prisma và hiện rõ mồn một trong <code>\\d</code>.',
          ),
        }),

        // q9 · 2.3 + 5.1 · đáp án 0
        mcq({
          prompt: B(
            'A listing runs ' + c("findMany({ where: { published: true, views: { gt: 100 } }, orderBy: { publishedAt: 'desc' } })") + ' on a table of 400,000 rows. Which composite index serves it best?',
            'Một trang danh sách chạy ' + c("findMany({ where: { published: true, views: { gt: 100 } }, orderBy: { publishedAt: 'desc' } })") + ' trên một bảng 400.000 dòng. Chỉ mục ghép nào phục vụ nó tốt nhất?',
          ),
          options: [
            B(
              '<code>@@index([published, views])</code> — the equality column first, the range column after it; the sort then costs one extra step but the scan is already narrow',
              '<code>@@index([published, views])</code> — cột so bằng đứng trước, cột so khoảng đứng sau; phép sắp xếp khi đó tốn thêm một bước nhưng vùng quét đã hẹp sẵn',
            ),
            B(
              '<code>@@index([views, published])</code> — the most selective column must always come first, and <code>views</code> has far more distinct values than <code>published</code>',
              '<code>@@index([views, published])</code> — cột chọn lọc nhất luôn phải đứng trước, mà <code>views</code> có nhiều giá trị khác nhau hơn hẳn <code>published</code>',
            ),
            B(
              '<code>@@index([publishedAt])</code> alone — sorting is the expensive part, and PostgreSQL can filter cheaply once the rows arrive in order',
              'Chỉ <code>@@index([publishedAt])</code> — sắp xếp mới là phần đắt, và PostgreSQL lọc rẻ thôi khi các dòng đã tới theo đúng thứ tự',
            ),
            B(
              'Three separate single-column indexes, one per column; the planner combines them and this also serves any future query on the same table',
              'Ba chỉ mục một cột riêng biệt, mỗi cột một cái; trình lập kế hoạch sẽ kết hợp chúng lại và cách này còn phục vụ được mọi truy vấn tương lai trên cùng bảng đó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'The rule is mechanical and it is the same rule in Prisma and in raw SQL: <b>equality columns first, most selective first; the range or sort column last</b>. A B-tree can seek on a prefix of equalities and then scan a range, but once a range appears, the columns after it in the index can only filter, not seek. So <code>[published, views]</code> seeks straight to the published rows and range-scans <code>views &gt; 100</code> within them. Reversed, <code>[views, published]</code> is useless for this query even though <code>views</code> is more selective in isolation — selectivity decides the order <em>among the equality columns</em>, not whether a range may jump the queue. Option 3 gets the order of operations backwards: filtering 400,000 rows to a few hundred is what makes the sort cheap, not the other way round. Option 4 is the habit the course warns about: ten indexes on a hot write table can halve write throughput while helping no read that was actually slow — and <code>pg_stat_user_indexes</code> with <code>idx_scan = 0</code> is how you find them later. Whichever you choose, the only proof is <code>EXPLAIN ANALYZE</code>, and on a fifty-row development table no index is ever used, because a sequential scan is cheaper.',
            'Quy tắc này rất máy móc và nó giống hệt nhau trong Prisma lẫn trong SQL thô: <b>cột so bằng đứng trước, cột chọn lọc nhất đứng đầu; cột so khoảng hoặc cột sắp xếp đứng cuối</b>. Một B-tree dò được theo một tiền tố các phép so bằng rồi quét một khoảng, nhưng ngay khi một khoảng xuất hiện thì những cột đứng sau nó trong chỉ mục chỉ còn lọc được chứ không dò được nữa. Nên <code>[published, views]</code> dò thẳng tới các dòng đã đăng rồi quét khoảng <code>views &gt; 100</code> bên trong đó. Đảo lại, <code>[views, published]</code> vô dụng với truy vấn này dù <code>views</code> chọn lọc hơn khi đứng một mình — độ chọn lọc quyết định thứ tự GIỮA CÁC CỘT SO BẰNG, chứ không quyết định việc một cột so khoảng có được chen hàng hay không. Phương án 3 đảo ngược thứ tự công việc: lọc 400.000 dòng xuống còn vài trăm mới là thứ làm phép sắp xếp trở nên rẻ, chứ không phải ngược lại. Phương án 4 là thói quen mà giáo trình cảnh báo: mười chỉ mục trên một bảng ghi nhiều có thể làm thông lượng ghi giảm một nửa mà chẳng giúp được phép đọc nào vốn đang chậm — và <code>pg_stat_user_indexes</code> với <code>idx_scan = 0</code> là cách bạn tìm ra chúng về sau. Chọn cái nào thì bằng chứng duy nhất vẫn là <code>EXPLAIN ANALYZE</code>, và trên một bảng năm mươi dòng lúc phát triển thì chẳng chỉ mục nào được dùng, vì quét tuần tự rẻ hơn.',
          ),
        }),

        // q10 · 2.5 · đáp án 2
        mcq({
          prompt: B(
            'A <code>Json?</code> column called <code>settings</code> can be in three states: the column is SQL <code>NULL</code>, the column holds the JSON value <code>null</code>, or it holds an object. Which mapping is correct in Prisma Client?',
            'Một cột <code>Json?</code> tên <code>settings</code> có thể ở ba trạng thái: cột là <code>NULL</code> của SQL, cột chứa giá trị JSON <code>null</code>, hoặc cột chứa một đối tượng. Ánh xạ nào trong Prisma Client là đúng?',
          ),
          options: [
            B(
              '<code>null</code> writes SQL NULL, <code>Prisma.JsonNull</code> writes JSON null, and in a <code>where</code> the two are interchangeable',
              '<code>null</code> ghi ra SQL NULL, <code>Prisma.JsonNull</code> ghi ra JSON null, và trong <code>where</code> thì hai cái thay thế được cho nhau',
            ),
            B(
              'There is only one null: Prisma stores JavaScript <code>null</code> as SQL NULL and reads it back as <code>null</code>, and the JSON value <code>null</code> is not representable',
              'Chỉ có một loại null: Prisma lưu <code>null</code> của JavaScript thành SQL NULL rồi đọc lại ra <code>null</code>, còn giá trị JSON <code>null</code> thì không biểu diễn được',
            ),
            B(
              '<code>Prisma.DbNull</code> means the column is SQL NULL, <code>Prisma.JsonNull</code> means the column holds the JSON value null, and a plain <code>null</code> in a filter means "ignore this condition"',
              '<code>Prisma.DbNull</code> nghĩa là cột đang là SQL NULL, <code>Prisma.JsonNull</code> nghĩa là cột chứa giá trị JSON null, còn một <code>null</code> trơn trong điều kiện lọc nghĩa là "bỏ qua điều kiện này"',
            ),
            B(
              '<code>Prisma.AnyNull</code> is the only value you ever need; it matches both storage forms on read and picks SQL NULL on write',
              '<code>Prisma.AnyNull</code> là giá trị duy nhất bạn từng cần; nó khớp cả hai dạng lưu trữ khi đọc và chọn SQL NULL khi ghi',
            ),
          ],
          correct: 2,
          explanation: EX(
            'This is the genuinely confusing corner of <code>Json</code> columns, and mixing the three up produces filters that silently match everything. A <code>jsonb</code> column really can hold the JSON literal <code>null</code>, which is a value, and that is a different thing from the column being SQL NULL, which is the absence of a value; <code>Prisma.DbNull</code> and <code>Prisma.JsonNull</code> exist to tell them apart on write and in a filter. Meanwhile a plain JavaScript <code>undefined</code> or <code>null</code> in a <code>where</code> follows Prisma\'s general rule — an absent condition is not a condition — which is exactly why the dangerous case is a filter object built from request parameters that all came back undefined. (<code>Prisma.AnyNull</code> does exist, but it is a <em>filter</em> value meaning "either kind of null", not a write value, so option 4 is half a fact.) Options 1 and 2 both collapse the distinction the three constants were created to preserve.',
            'Đây là góc thật sự rối rắm của các cột <code>Json</code>, và lẫn lộn ba thứ này sinh ra những điều kiện lọc âm thầm khớp với tất cả. Một cột <code>jsonb</code> thật sự có thể chứa hằng JSON <code>null</code>, vốn là một GIÁ TRỊ, và đó là chuyện khác với việc cột đang là SQL NULL, vốn là SỰ VẮNG MẶT của giá trị; <code>Prisma.DbNull</code> và <code>Prisma.JsonNull</code> tồn tại để phân biệt hai thứ đó khi ghi và khi lọc. Trong khi đó một <code>undefined</code> hay <code>null</code> trơn của JavaScript trong <code>where</code> tuân theo quy tắc chung của Prisma — một điều kiện vắng mặt thì không phải là một điều kiện — và chính vì thế mà ca nguy hiểm là một đối tượng lọc dựng từ các tham số yêu cầu mà tất cả đều trả về undefined. (<code>Prisma.AnyNull</code> có tồn tại thật, nhưng nó là một giá trị DÙNG ĐỂ LỌC nghĩa là "null kiểu nào cũng được", không phải giá trị để ghi, nên phương án 4 chỉ đúng một nửa.) Phương án 1 và 2 đều xoá mất đúng cái ranh giới mà ba hằng số kia sinh ra để giữ.',
          ),
        }),

        /* ══════════════════ Chương 3 — Quan hệ (4 câu) ══════════════════ */
        // q11 · 3.1 + 3.2 · đáp án 1
        mcq({
          prompt: B(
            'A schema declares ' + c('author User @relation(fields: [authorId], references: [id])') + ' on <code>Post</code> and ' + c('user User @relation(fields: [userId], references: [id], onDelete: Cascade)') + ' on <code>Profile</code>. The migration Prisma generates contains:' +
            code('ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId")\n  REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;\nALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId")\n  REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;') +
            'Deleting a user who has posts now throws. What does the transcript tell you about defaults?',
            'Một lược đồ khai ' + c('author User @relation(fields: [authorId], references: [id])') + ' trên <code>Post</code> và ' + c('user User @relation(fields: [userId], references: [id], onDelete: Cascade)') + ' trên <code>Profile</code>. Migration Prisma sinh ra chứa:' +
            code('ALTER TABLE "Profile" ADD CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId")\n  REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;\nALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId")\n  REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;') +
            'Xoá một người dùng đang có bài viết bây giờ ném lỗi. Đoạn ghi lại này nói gì về các giá trị mặc định?',
          ),
          options: [
            B(
              'Prisma leaves <code>onDelete</code> unset when you do not declare it, so PostgreSQL applies its own default of <code>NO ACTION</code> and the error comes from the database, not from Prisma',
              'Prisma để trống <code>onDelete</code> khi bạn không khai, nên PostgreSQL áp mặc định của chính nó là <code>NO ACTION</code> và lỗi đến từ cơ sở dữ liệu chứ không phải từ Prisma',
            ),
            B(
              'A required relation defaults to <code>onDelete: Restrict</code> and an optional one to <code>SetNull</code>, while both default to <code>onUpdate: Cascade</code> — which is why the delete throws P2003 and nothing is removed',
              'Quan hệ bắt buộc mặc định là <code>onDelete: Restrict</code> còn quan hệ tuỳ chọn mặc định là <code>SetNull</code>, trong khi cả hai đều mặc định <code>onUpdate: Cascade</code> — và vì thế phép xoá ném P2003 mà không có gì bị gỡ đi',
            ),
            B(
              'The <code>RESTRICT</code> came from the <code>Cascade</code> on <code>Profile</code>: Prisma makes sibling relations to the same parent consistent by widening the strictest one',
              'Chữ <code>RESTRICT</code> đến từ <code>Cascade</code> trên <code>Profile</code>: Prisma làm cho các quan hệ anh em trỏ tới cùng một cha nhất quán với nhau bằng cách nới cái chặt nhất',
            ),
            B(
              'Both lines are defaults you cannot change from the schema; referential actions must be written in a hand-edited migration',
              'Cả hai dòng đều là mặc định mà bạn không đổi được từ lược đồ; hành vi tham chiếu phải viết trong một migration sửa tay',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The transcript is the machine\'s own output and it states the defaults exactly: <code>Post.author</code> is required and got <code>ON DELETE RESTRICT</code>; both constraints got <code>ON UPDATE CASCADE</code>. So the table is: required relation → <code>Restrict</code>, optional relation → <code>SetNull</code>, both → <code>onUpdate: Cascade</code>. That last one differs from plain SQL, whose default is <code>NO ACTION</code>, which is why option 1 is a plausible-sounding trap. <code>Restrict</code> raises <b>P2003</b> with <code>meta.field_name</code> naming the constraint, and removes nothing — a good default, because the alternative is a four-level cascade quietly deleting forty-five thousand rows in one call. The practical advice the course gives is to declare <code>onDelete</code> explicitly even when the default is what you want, because defaults are invisible in a code review. Option 3 invents an inference Prisma does not perform. Option 4 is false: <code>onDelete</code> and <code>onUpdate</code> are ordinary <code>@relation</code> arguments (what the schema genuinely cannot express is a partial index, an expression index, a <code>CHECK</code> constraint, an extension or a generated column).',
            'Đoạn ghi lại là output do chính máy in ra và nó nói chính xác các mặc định: <code>Post.author</code> là bắt buộc và nhận <code>ON DELETE RESTRICT</code>; cả hai ràng buộc đều nhận <code>ON UPDATE CASCADE</code>. Vậy bảng mặc định là: quan hệ bắt buộc → <code>Restrict</code>, quan hệ tuỳ chọn → <code>SetNull</code>, cả hai → <code>onUpdate: Cascade</code>. Cái cuối khác với SQL thuần vốn mặc định <code>NO ACTION</code>, và vì thế phương án 1 là một cái bẫy nghe rất có lý. <code>Restrict</code> ném <b>P2003</b> với <code>meta.field_name</code> gọi tên ràng buộc, và không gỡ đi thứ gì — một mặc định tốt, vì lựa chọn còn lại là một dây cascade bốn tầng lặng lẽ xoá bốn mươi lăm nghìn dòng chỉ trong một lời gọi. Lời khuyên thực dụng của giáo trình là hãy khai <code>onDelete</code> tường minh ngay cả khi mặc định đúng ý bạn, vì mặc định thì vô hình trong lúc review mã. Phương án 3 bịa ra một phép suy diễn Prisma không làm. Phương án 4 sai: <code>onDelete</code> và <code>onUpdate</code> là các tham số bình thường của <code>@relation</code> (thứ mà lược đồ thật sự không diễn đạt được là chỉ mục một phần, chỉ mục theo biểu thức, ràng buộc <code>CHECK</code>, extension và cột generated).',
          ),
        }),

        // q12 · 3.4 · đáp án 3
        mcq({
          prompt: B(
            'Models <code>Post</code> and <code>Tag</code> declare an implicit many-to-many (' + c('tags Tag[]') + ' and ' + c('posts Post[]') + ', no join model). The migration produces:' +
            code('CREATE TABLE "_PostToTag" ( "A" INTEGER NOT NULL, "B" INTEGER NOT NULL );\nCREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");\nCREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");\nALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A")\n  REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;') +
            'Which conclusion follows from this DDL?',
            'Hai model <code>Post</code> và <code>Tag</code> khai một quan hệ nhiều–nhiều ẩn (' + c('tags Tag[]') + ' và ' + c('posts Post[]') + ', không có model trung gian). Migration sinh ra:' +
            code('CREATE TABLE "_PostToTag" ( "A" INTEGER NOT NULL, "B" INTEGER NOT NULL );\nCREATE UNIQUE INDEX "_PostToTag_AB_unique" ON "_PostToTag"("A", "B");\nCREATE INDEX "_PostToTag_B_index" ON "_PostToTag"("B");\nALTER TABLE "_PostToTag" ADD CONSTRAINT "_PostToTag_A_fkey" FOREIGN KEY ("A")\n  REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;') +
            'Kết luận nào rút ra được từ đoạn DDL này?',
          ),
          options: [
            B(
              'You can add an <code>attachedAt</code> column to <code>_PostToTag</code> in a hand-written migration and Prisma will expose it on the relation',
              'Bạn có thể thêm cột <code>attachedAt</code> vào <code>_PostToTag</code> bằng một migration viết tay và Prisma sẽ để lộ nó ra trên quan hệ',
            ),
            B(
              '<code>A</code> is <code>Tag</code> and <code>B</code> is <code>Post</code>, because Prisma assigns the columns in declaration order',
              '<code>A</code> là <code>Tag</code> và <code>B</code> là <code>Post</code>, vì Prisma gán các cột theo thứ tự khai báo',
            ),
            B(
              'The cascade is a default you can change to <code>Restrict</code> with <code>@relation(onDelete: Restrict)</code> on either side',
              'Cascade ở đây là mặc định mà bạn đổi được thành <code>Restrict</code> bằng <code>@relation(onDelete: Restrict)</code> ở một trong hai phía',
            ),
            B(
              'The table name and the A/B assignment come from alphabetical order of the model names, the cascades are fixed and not configurable, and there is no <code>prisma.postToTag</code> delegate — only <code>connect</code>, <code>disconnect</code> and <code>set</code>',
              'Tên bảng và việc gán A/B đến từ thứ tự bảng chữ cái của tên model, các cascade là cố định và không cấu hình được, và không có delegate <code>prisma.postToTag</code> nào — chỉ có <code>connect</code>, <code>disconnect</code> và <code>set</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'An implicit join table is a convention Prisma owns entirely. The name is <code>_</code> plus the two model names <b>in alphabetical order</b> — <code>Post</code> before <code>Tag</code>, so <code>_PostToTag</code>, and the same ordering decides that <code>A</code> references <code>Post</code> and <code>B</code> references <code>Tag</code>. There are exactly two columns, no timestamps, no id of its own; the pair is unique, so a duplicate link is structurally impossible. The cascades are always <code>ON DELETE CASCADE</code> and are not configurable. And the table is absent from Prisma Client: no delegate, no <code>findMany</code> on the link itself, only <code>connect</code> / <code>disconnect</code> / <code>set</code> from either side. The moment you want an extra column, a per-side referential action or a query over the links themselves, you need the explicit form — which is why the course recommends <b>starting explicit unless you are certain</b>, because converting later means migrating rows out of <code>_PostToTag</code>, and the highest-risk line in that migration is <code>SELECT "B", "A"</code>: get the two columns the wrong way round and every post is paired with the wrong tag, silently, with matching row counts.',
            'Bảng trung gian ẩn là một quy ước hoàn toàn thuộc về Prisma. Tên là <code>_</code> cộng hai tên model <b>theo thứ tự bảng chữ cái</b> — <code>Post</code> trước <code>Tag</code>, nên là <code>_PostToTag</code>, và cũng chính thứ tự ấy quyết định <code>A</code> tham chiếu <code>Post</code> còn <code>B</code> tham chiếu <code>Tag</code>. Đúng hai cột, không mốc thời gian, không có id riêng; cặp giá trị là duy nhất nên một liên kết trùng là bất khả về mặt cấu trúc. Các cascade luôn là <code>ON DELETE CASCADE</code> và không cấu hình được. Và bảng này vắng mặt trong Prisma Client: không delegate, không <code>findMany</code> trên chính liên kết, chỉ có <code>connect</code> / <code>disconnect</code> / <code>set</code> từ hai phía. Ngay khi bạn muốn thêm một cột, muốn hành vi tham chiếu riêng cho từng phía, hay muốn truy vấn trên chính các liên kết, bạn cần dạng tường minh — và vì thế giáo trình khuyên <b>hãy bắt đầu bằng dạng tường minh trừ khi bạn chắc chắn</b>, bởi chuyển đổi về sau nghĩa là di chuyển dữ liệu ra khỏi <code>_PostToTag</code>, mà dòng rủi ro nhất trong migration ấy là <code>SELECT "B", "A"</code>: đảo hai cột là mọi bài viết ghép với sai thẻ, âm thầm, và số dòng vẫn khớp.',
          ),
        }),

        // q13 · 3.4 · đáp án 0
        mcq({
          prompt: B(
            'A "save post" handler sends the whole form every time, and updates the tags with ' + c('tags: { set: chonThe.map((id) => ({ id })) }') + '. Users report that editing only the title of a post wipes all its tags. What is happening?',
            'Một handler "lưu bài viết" gửi cả biểu mẫu mỗi lần, và cập nhật thẻ bằng ' + c('tags: { set: chonThe.map((id) => ({ id })) }') + '. Người dùng báo rằng chỉ sửa tiêu đề của một bài cũng làm bay hết thẻ của nó. Chuyện gì đang xảy ra?',
          ),
          options: [
            B(
              '<code>set</code> is a replace, not a merge: it deletes every existing link first and then inserts the given ones, so when the form sent no tag ids it becomes <code>set: []</code> — an instruction to clear the relation',
              '<code>set</code> là phép THAY THẾ chứ không phải phép gộp: nó xoá mọi liên kết đang có trước rồi mới chèn những cái được đưa vào, nên khi biểu mẫu không gửi id thẻ nào thì nó thành <code>set: []</code> — một mệnh lệnh xoá sạch quan hệ',
            ),
            B(
              'The implicit join table cascades on update, so changing any column of <code>Post</code> removes its rows in <code>_PostToTag</code>',
              'Bảng trung gian ẩn cascade khi cập nhật, nên đổi bất kỳ cột nào của <code>Post</code> cũng xoá các dòng của nó trong <code>_PostToTag</code>',
            ),
            B(
              '<code>set</code> requires the full object, not just <code>{ id }</code>; the partial objects fail to match and Prisma treats the unmatched links as removed',
              '<code>set</code> đòi đối tượng đầy đủ chứ không chỉ <code>{ id }</code>; các đối tượng thiếu không khớp được và Prisma coi các liên kết không khớp là đã bị gỡ',
            ),
            B(
              'The nested write runs outside the transaction that updates the title, so a failure between the two leaves the links deleted',
              'Phép ghi lồng chạy ngoài giao dịch cập nhật tiêu đề, nên một cú hỏng ở giữa hai thứ để lại các liên kết đã bị xoá',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Turn on the query log and <code>set</code> shows exactly what it is: a <code>DELETE FROM "_PostToTag" WHERE "B" = $1</code> followed by an <code>INSERT … ON CONFLICT DO NOTHING</code> for whatever you passed. It replaces the whole collection with the list you gave. That is the correct semantic for "here is the complete new set of tags" — and it is a disaster for a handler that sends the entire form on every save, because a form section the user never opened arrives as an empty array, and an empty array is a complete new set containing nothing. Two fixes, both fine: send the true full set from the client and keep <code>set</code>, or switch to incremental edits with <code>connect</code> and <code>disconnect</code> and touch only what changed. Option 2 invents a cascade on update that does not exist. Option 3 is wrong — <code>{ id }</code> is exactly what these operations take. Option 4 is wrong too: every nested write is already wrapped in a single transaction, which you can see as <code>BEGIN</code> … <code>COMMIT</code> around it in the log.',
            'Bật log truy vấn lên và <code>set</code> lộ ra đúng bản chất: một <code>DELETE FROM "_PostToTag" WHERE "B" = $1</code> rồi tới một <code>INSERT … ON CONFLICT DO NOTHING</code> cho những gì bạn truyền vào. Nó thay thế toàn bộ tập hợp bằng danh sách bạn đưa. Đó là ngữ nghĩa đúng cho câu "đây là tập thẻ mới đầy đủ" — và là thảm hoạ với một handler gửi cả biểu mẫu mỗi lần lưu, bởi một phần biểu mẫu người dùng chưa từng mở ra sẽ tới dưới dạng một mảng rỗng, mà mảng rỗng là một tập mới đầy đủ chẳng chứa gì. Hai cách sửa, cách nào cũng ổn: gửi đúng tập đầy đủ thật từ phía client và giữ <code>set</code>, hoặc chuyển sang sửa từng phần bằng <code>connect</code> và <code>disconnect</code> và chỉ chạm vào thứ đã thay đổi. Phương án 2 bịa ra một cascade khi cập nhật vốn không tồn tại. Phương án 3 sai — <code>{ id }</code> chính là thứ mà các thao tác này nhận. Phương án 4 cũng sai: mọi phép ghi lồng đều đã được bọc trong một giao dịch duy nhất, thứ bạn nhìn thấy trong log dưới dạng <code>BEGIN</code> … <code>COMMIT</code> bao quanh nó.',
          ),
        }),

        // q14 · 3.5 · đáp án 2
        mcq({
          prompt: B(
            'A comment model has a self-relation: ' + c('cha BinhLuan? @relation("TraLoi", fields: [chaId], references: [id])') + ' and ' + c('traLoi BinhLuan[] @relation("TraLoi")') + '. The team needs to render a reply thread of unknown depth. What is the correct expectation?',
            'Một model bình luận có tự quan hệ: ' + c('cha BinhLuan? @relation("TraLoi", fields: [chaId], references: [id])') + ' và ' + c('traLoi BinhLuan[] @relation("TraLoi")') + '. Nhóm cần dựng một luồng trả lời không biết trước độ sâu. Kỳ vọng đúng là gì?',
          ),
          options: [
            B(
              'Nest <code>include: { traLoi: true }</code> once and Prisma will follow the self-relation recursively, because the relation name tells it the two ends are the same model',
              'Lồng <code>include: { traLoi: true }</code> một lần là Prisma sẽ đi theo tự quan hệ một cách đệ quy, vì tên quan hệ đã nói cho nó biết hai đầu là cùng một model',
            ),
            B(
              'Set <code>relationLoadStrategy: "join"</code>, which turns the nesting into a single recursive LATERAL join of unbounded depth',
              'Đặt <code>relationLoadStrategy: "join"</code>, thứ biến phép lồng thành một LATERAL join đệ quy không giới hạn độ sâu',
            ),
            B(
              'There is no recursive <code>include</code>: each level is hand-written and costs one statement, so an unbounded thread needs a <code>WITH RECURSIVE</code> CTE through <code>$queryRaw</code> — with a depth cap and a visited-id guard',
              'Không có <code>include</code> đệ quy: mỗi tầng phải viết tay và tốn một câu lệnh, nên một luồng không giới hạn cần một CTE <code>WITH RECURSIVE</code> qua <code>$queryRaw</code> — kèm chặn độ sâu và chặn id đã thăm',
            ),
            B(
              'Use <code>findMany({ where: { baiVietId } })</code> and rebuild the tree in JavaScript; Prisma forbids self-relations deeper than one level for this reason',
              'Dùng <code>findMany({ where: { baiVietId } })</code> rồi dựng lại cây bằng JavaScript; Prisma cấm tự quan hệ sâu quá một tầng chính vì lý do đó',
            ),
          ],
          correct: 2,
          explanation: EX(
            'The self-relation itself is fine — the <code>@relation("TraLoi")</code> name on both fields is what pairs them, and the parent must be optional because a root reply has no parent. What is not fine is expecting <code>include</code> to recurse. There is no recursive <code>include</code> in Prisma and there is unlikely ever to be one, because the return type would have to be infinite. Each nesting level is written by hand and costs one statement; ten levels means ten <code>include</code>s and ten statements, and the eleventh level silently returns a truncated tree with <b>no error at all</b> — the worst kind of wrong, because it looks complete. So an unbounded thread is a <code>WITH RECURSIVE</code> CTE, and it needs two guards, not one: cap the depth (<code>WHERE cay.do_sau &lt; 10</code>) <em>and</em> carry the visited ids in an array and reject a node already in it. A recursive CTE has no built-in recursion limit — it stops only when the recursive term produces zero rows — so one bad row pointing at its own ancestor loops until the connection dies. Option 4 also invents a prohibition: nothing stops you nesting a self-relation, it just costs a query per level. Note in passing that option 4\'s <em>tactic</em> is often the right one for a bounded thread — one flat <code>findMany</code> and a rebuild in memory — it is the stated reason that is false.',
            'Bản thân tự quan hệ thì không sao — cái tên <code>@relation("TraLoi")</code> trên cả hai trường là thứ ghép chúng lại, và phía cha bắt buộc phải tuỳ chọn vì một trả lời gốc không có cha. Thứ không ổn là kỳ vọng <code>include</code> tự đệ quy. Prisma không có <code>include</code> đệ quy và nhiều khả năng sẽ không bao giờ có, vì kiểu trả về sẽ phải là vô hạn. Mỗi tầng lồng đều viết tay và tốn một câu lệnh; mười tầng nghĩa là mười <code>include</code> và mười câu lệnh, còn tầng thứ mười một thì âm thầm trả về một cái cây bị cắt cụt <b>mà không có lỗi nào cả</b> — kiểu sai tệ nhất, vì nó trông có vẻ đầy đủ. Nên một luồng không giới hạn là một CTE <code>WITH RECURSIVE</code>, và nó cần HAI lớp chặn chứ không phải một: chặn độ sâu (<code>WHERE cay.do_sau &lt; 10</code>) VÀ mang theo các id đã thăm trong một mảng rồi loại nút nào đã có trong đó. CTE đệ quy không có giới hạn đệ quy dựng sẵn nào — nó chỉ dừng khi vế đệ quy sinh ra không dòng nào — nên một dòng dữ liệu hỏng trỏ về tổ tiên của chính nó là vòng lặp chạy cho tới khi kết nối chết. Phương án 4 còn bịa thêm một điều cấm: chẳng có gì ngăn bạn lồng một tự quan hệ, chỉ là mỗi tầng tốn một truy vấn. Nói thêm cho công bằng, CÁCH LÀM của phương án 4 thường là cách đúng cho một luồng có giới hạn — một <code>findMany</code> phẳng rồi dựng lại trong bộ nhớ — chỉ có cái lý do nó đưa ra là sai.',
          ),
        }),

        /* ═══════════════ Chương 4 — Đọc và ghi (4 câu) ═══════════════ */
        // q15 · 4.1 + 4.4 + 4.5 · đáp án 1
        mcq({
          prompt: B(
            'Row 999 does not exist. Four calls are made against it and the results are recorded:' +
            code('await prisma.user.findUnique({ where: { id: 999 } })          -->  ?\nawait prisma.user.update({ where: { id: 999 }, data: {...} })  -->  ?\nawait prisma.user.updateMany({ where: { id: 999 }, data: {} }) -->  ?\nawait prisma.user.findUniqueOrThrow({ where: { id: 999 } })    -->  ?') +
            'Which set of four outcomes is right?',
            'Dòng 999 không tồn tại. Bốn lời gọi được thực hiện lên nó và kết quả được ghi lại:' +
            code('await prisma.user.findUnique({ where: { id: 999 } })          -->  ?\nawait prisma.user.update({ where: { id: 999 }, data: {...} })  -->  ?\nawait prisma.user.updateMany({ where: { id: 999 }, data: {} }) -->  ?\nawait prisma.user.findUniqueOrThrow({ where: { id: 999 } })    -->  ?') +
            'Bộ bốn kết quả nào là đúng?',
          ),
          options: [
            B(
              'All four throw P2025; the <code>OrThrow</code> suffix only changes the message, not whether an error is raised',
              'Cả bốn đều ném P2025; hậu tố <code>OrThrow</code> chỉ đổi thông báo chứ không đổi việc có ném lỗi hay không',
            ),
            B(
              '<code>null</code> · throws P2025 · <code>{ count: 0 }</code> · throws P2025 — the two "many" and "unique-nullable" forms report absence as data, the other two as an error',
              '<code>null</code> · ném P2025 · <code>{ count: 0 }</code> · ném P2025 — hai dạng "nhiều" và "duy nhất có thể null" báo sự vắng mặt bằng DỮ LIỆU, hai dạng còn lại báo bằng LỖI',
            ),
            B(
              '<code>null</code> · <code>null</code> · <code>{ count: 0 }</code> · throws P2025 — <code>update</code> returns null when the row is missing, which is why <code>updateOrThrow</code> exists',
              '<code>null</code> · <code>null</code> · <code>{ count: 0 }</code> · ném P2025 — <code>update</code> trả về null khi thiếu dòng, và vì thế mới có <code>updateOrThrow</code>',
            ),
            B(
              '<code>null</code> · throws P2003 · <code>{ count: 0 }</code> · throws P2001 — the codes differ because one is a write and one is a read',
              '<code>null</code> · ném P2003 · <code>{ count: 0 }</code> · ném P2001 — mã lỗi khác nhau vì một cái là ghi còn một cái là đọc',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Measured, in order: <code>null</code>; <code>PrismaClientKnownRequestError code P2025 meta { cause: \'Record to update not found.\' }</code>; <code>{ count: 0 }</code>; a throw whose <code>code</code> is also <code>P2025</code>. The pattern is worth internalising because it decides where your 404s come from. Singular <code>update</code> and <code>delete</code> address exactly one row by a unique field and treat "not there" as an error — there is no <code>updateOrThrow</code> because throwing is already the behaviour. The <code>*Many</code> forms take a filter, return <code>{ count }</code>, and never throw for zero matches, which is exactly the trap: an update whose <code>where</code> was wrong looks identical to an update whose rows were already correct, so a handler must check <code>if (r.count === 0)</code> itself. And <code>findUnique</code> returning <code>null</code> is why <code>findUniqueOrThrow</code> exists at all: it gives you a P2025 an Express error handler can map to a 404 in one place, instead of a non-null assertion that moves the failure to a random later line. Option 4 misassigns codes that mean foreign key (P2003) and record-does-not-exist-for-delete-many (P2001).',
            'Đo thật, theo thứ tự: <code>null</code>; <code>PrismaClientKnownRequestError code P2025 meta { cause: \'Record to update not found.\' }</code>; <code>{ count: 0 }</code>; và một cú ném mà <code>code</code> cũng là <code>P2025</code>. Cái khuôn này đáng thuộc lòng vì nó quyết định mã 404 của bạn sinh ra từ đâu. <code>update</code> và <code>delete</code> số ít nhắm đúng một dòng qua một trường duy nhất và coi "không có" là một lỗi — không có <code>updateOrThrow</code> vì ném lỗi vốn đã là hành vi mặc định. Các dạng <code>*Many</code> nhận một bộ lọc, trả về <code>{ count }</code>, và không bao giờ ném khi không khớp dòng nào, và đó chính là cái bẫy: một lệnh cập nhật có <code>where</code> sai trông y hệt một lệnh cập nhật mà dữ liệu vốn đã đúng, nên handler phải tự kiểm <code>if (r.count === 0)</code>. Còn việc <code>findUnique</code> trả về <code>null</code> chính là lý do <code>findUniqueOrThrow</code> tồn tại: nó cho bạn một P2025 mà bộ xử lý lỗi của Express ánh xạ thành 404 ở đúng một chỗ, thay vì một dấu chấm than khẳng định-không-null đẩy cú hỏng sang một dòng ngẫu nhiên phía sau. Phương án 4 gán nhầm hai mã vốn nghĩa là khoá ngoại (P2003) và không tìm thấy bản ghi cho delete (P2001).',
          ),
        }),

        // q16 · 4.2 + 5.2 · đáp án 3
        mcq({
          prompt: B(
            'A page must show <b>only</b> users who have at least one published post, and for each of them <b>only</b> their published posts. Three candidate queries are written:' +
            code("A: findMany({ where: { posts: { some: { published: true } } } , include: { posts: true } })\nB: findMany({ include: { posts: { where: { published: true } } } })\nC: findMany({ where: { posts: { some: { published: true } } },\n              include: { posts: { where: { published: true } } } })") +
            'On a database with 340 users of whom 12 have a published post, what does each return?',
            'Một trang phải hiện <b>chỉ</b> những người dùng có ít nhất một bài đã đăng, và với mỗi người thì <b>chỉ</b> hiện các bài đã đăng của họ. Ba truy vấn ứng viên được viết ra:' +
            code("A: findMany({ where: { posts: { some: { published: true } } } , include: { posts: true } })\nB: findMany({ include: { posts: { where: { published: true } } } })\nC: findMany({ where: { posts: { some: { published: true } } },\n              include: { posts: { where: { published: true } } } })") +
            'Trên một cơ sở dữ liệu có 340 người dùng mà 12 người có bài đã đăng, mỗi truy vấn trả về gì?',
          ),
          options: [
            B(
              'All three return the same 12 users with only published posts; <code>where</code> and the nested <code>where</code> are two ways of writing one filter',
              'Cả ba trả về cùng 12 người dùng với chỉ các bài đã đăng; <code>where</code> và <code>where</code> lồng là hai cách viết cùng một bộ lọc',
            ),
            B(
              'A returns 12 users with only published posts, B returns 12 users with all their posts, C is redundant',
              'A trả về 12 người dùng chỉ kèm bài đã đăng, B trả về 12 người dùng kèm mọi bài của họ, còn C thì thừa',
            ),
            B(
              'A returns 340 users, B returns 12 users, C returns 12 users; the outer <code>where</code> only filters relations, never parents',
              'A trả về 340 người dùng, B trả về 12, C trả về 12; <code>where</code> ngoài cùng chỉ lọc quan hệ chứ không bao giờ lọc cha',
            ),
            B(
              'A returns 12 users but with their drafts included, B returns all 340 users and most with <code>posts: []</code>, and only C returns 12 users each carrying only published posts',
              'A trả về 12 người dùng nhưng kèm cả bản nháp của họ, B trả về đủ 340 người dùng mà phần lớn có <code>posts: []</code>, và chỉ C mới trả về 12 người dùng mỗi người chỉ mang bài đã đăng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'These are two different filters doing two different jobs, and confusing them is the most common relation-query mistake there is. The <b>outer <code>where</code></b> chooses which <em>parents</em> come back: <code>posts: { some: { published: true } }</code> compiles to an <code>EXISTS (SELECT 1 …)</code> and narrows 340 users to 12 — but it says nothing about which posts are attached, so A hands you those 12 users with their drafts included. The <b><code>where</code> inside <code>include</code></b> chooses which <em>children</em> are attached and narrows nothing at the top: B returns all 340 users, and the 328 with no published post come back with <code>posts: []</code>, which is why the page renders three hundred empty cards. C is not redundant; C is the only one that answers the question asked. The useful mental test is to ask, of any filter, "does this change how many rows the outer array has?" — only the outer <code>where</code> can. A closely related fact from the same lesson: relation filters <em>filter</em>, they do not <em>fetch</em>, so <code>some</code> never loads the related rows.',
            'Đây là hai bộ lọc khác nhau làm hai việc khác nhau, và lẫn lộn chúng là lỗi truy vấn quan hệ phổ biến nhất. <b><code>where</code> ngoài cùng</b> chọn xem những dòng CHA nào được trả về: <code>posts: { some: { published: true } }</code> biên dịch thành một <code>EXISTS (SELECT 1 …)</code> và thu 340 người dùng xuống 12 — nhưng nó không nói gì về việc những bài nào được đính kèm, nên A đưa cho bạn 12 người dùng đó kèm cả bản nháp. <b><code>where</code> nằm trong <code>include</code></b> chọn xem những dòng CON nào được đính kèm và không thu hẹp gì ở tầng trên: B trả về đủ 340 người dùng, và 328 người không có bài đã đăng trở về với <code>posts: []</code>, và đó là lý do trang hiện ba trăm cái thẻ rỗng. C không thừa; C là truy vấn duy nhất trả lời đúng câu hỏi được đặt ra. Phép thử tư duy hữu ích là hỏi về bất kỳ bộ lọc nào: "cái này có làm thay đổi số phần tử của mảng ngoài cùng không?" — chỉ <code>where</code> ngoài cùng mới làm được. Một dữ kiện liên quan chặt chẽ từ cùng bài học: bộ lọc quan hệ chỉ LỌC chứ không LẤY VỀ, nên <code>some</code> không bao giờ nạp các dòng quan hệ.',
          ),
        }),

        // q17 · 4.2 · đáp án 0
        mcq({
          prompt: B(
            'A feed endpoint runs ' + c('findMany({ take: 10, include: { comments: { take: 20 } } })') + '. How many comment rows can this return, and why does it matter?',
            'Một endpoint bảng tin chạy ' + c('findMany({ take: 10, include: { comments: { take: 20 } } })') + '. Truy vấn này có thể trả về bao nhiêu dòng bình luận, và vì sao điều đó quan trọng?',
          ),
          options: [
            B(
              'Up to 200 — the nested <code>take</code> is applied per parent, not to the result as a whole, and it is applied by the query engine rather than reducing the work the database does',
              'Tối đa 200 — <code>take</code> lồng được áp cho TỪNG dòng cha chứ không áp cho cả kết quả, và nó được query engine áp chứ không cắt bớt phần việc cơ sở dữ liệu phải làm',
            ),
            B(
              'Exactly 20 — the nested <code>take</code> caps the total number of related rows across the whole result set',
              'Đúng 20 — <code>take</code> lồng chặn tổng số dòng quan hệ trên toàn bộ tập kết quả',
            ),
            B(
              'Up to 200, but the cost is the same as 20 because Prisma pushes the limit into a LATERAL subquery on every provider',
              'Tối đa 200, nhưng chi phí bằng với 20 vì Prisma đẩy giới hạn đó vào một truy vấn con LATERAL trên mọi provider',
            ),
            B(
              'Up to 10 — a nested <code>take</code> cannot exceed the parent <code>take</code>, and Prisma clamps it silently',
              'Tối đa 10 — <code>take</code> lồng không vượt quá <code>take</code> của cha được, và Prisma tự âm thầm kẹp nó lại',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A nested <code>take</code> means "this many per parent". Ten parents at twenty comments each is up to two hundred rows, and the moment somebody raises the page size to fifty the same code is at a thousand. It is worth reading the second half of that sentence as carefully as the first: with the default loading strategy the limit is applied by the query engine after the rows arrive, so it shapes the result without reducing the work the database did as much as you might hope. The same is true of a nested <code>distinct</code> — it shapes the result and does not reduce rows fetched. This is the quiet way a page that looks like "ten posts" becomes megabytes: the comment bodies were never the thing you thought you were limiting. Option 2 is the intuitive reading and the wrong one. Option 3 asserts a plan Prisma only produces under the <code>relationJoins</code> strategy, and even then the row multiplication has its own cost. Option 4 invents a clamp.',
            'Một <code>take</code> lồng nghĩa là "từng này cho MỖI dòng cha". Mười dòng cha nhân hai mươi bình luận là tới hai trăm dòng, và ngay khi có ai nâng kích thước trang lên năm mươi thì cũng đoạn mã ấy thành một nghìn. Nửa sau của câu này đáng đọc kỹ như nửa đầu: với chiến lược nạp mặc định, giới hạn ấy được query engine áp SAU khi các dòng đã về, nên nó nắn hình kết quả mà không cắt bớt phần việc cơ sở dữ liệu đã làm nhiều như bạn tưởng. Điều tương tự đúng với <code>distinct</code> lồng — nó nắn kết quả chứ không giảm số dòng được lấy về. Đây là cách âm thầm mà một trang trông như "mười bài viết" hoá thành vài megabyte: nội dung bình luận chưa bao giờ là thứ bạn tưởng mình đang giới hạn. Phương án 2 là cách đọc theo trực giác và là cách đọc sai. Phương án 3 khẳng định một kế hoạch mà Prisma chỉ sinh ra dưới chiến lược <code>relationJoins</code>, và ngay cả khi đó thì việc nhân dòng lên cũng có cái giá riêng của nó. Phương án 4 bịa ra một phép kẹp.',
          ),
        }),

        // q18 · 4.5 · đáp án 2
        mcq({
          prompt: B(
            'A cleanup route builds its filter from query parameters:' +
            code('const dieuKien = {\n  authorId: req.query.authorId ? Number(req.query.authorId) : undefined,\n  published: req.query.published ? req.query.published === "true" : undefined,\n};\nawait prisma.post.deleteMany({ where: dieuKien });') +
            'Someone calls the route with no query string at all. What happens?',
            'Một route dọn dẹp dựng bộ lọc từ tham số truy vấn:' +
            code('const dieuKien = {\n  authorId: req.query.authorId ? Number(req.query.authorId) : undefined,\n  published: req.query.published ? req.query.published === "true" : undefined,\n};\nawait prisma.post.deleteMany({ where: dieuKien });') +
            'Có người gọi route này mà không kèm chuỗi truy vấn nào. Chuyện gì xảy ra?',
          ),
          options: [
            B(
              'Prisma rejects it: <code>deleteMany</code> requires at least one condition, and an all-undefined <code>where</code> raises a validation error',
              'Prisma từ chối: <code>deleteMany</code> đòi ít nhất một điều kiện, và một <code>where</code> toàn undefined sẽ gây lỗi kiểm tra',
            ),
            B(
              'Nothing is deleted and the call returns <code>{ count: 0 }</code>, because an undefined condition can never match a row',
              'Không có gì bị xoá và lời gọi trả về <code>{ count: 0 }</code>, vì một điều kiện undefined thì không bao giờ khớp được dòng nào',
            ),
            B(
              'Every row in the table is deleted: undefined conditions are dropped, so the <code>where</code> is an empty object — the same as <code>deleteMany({})</code>',
              'Mọi dòng trong bảng bị xoá: các điều kiện undefined bị bỏ đi, nên <code>where</code> là một đối tượng rỗng — y hệt <code>deleteMany({})</code>',
            ),
            B(
              'It depends on the referential actions: rows whose children use <code>Restrict</code> survive and the rest are deleted, so the damage is partial',
              'Còn tuỳ hành vi tham chiếu: những dòng có con dùng <code>Restrict</code> thì sống sót, phần còn lại bị xoá, nên thiệt hại chỉ một phần',
            ),
          ],
          correct: 2,
          explanation: EX(
            'An <code>undefined</code> value in a <code>where</code> is ignored by Prisma — that is the property the whole spread-if idiom for dynamic filters is built on, and it is useful. Applied to <code>deleteMany</code> it is the single most expensive mistake in the client API: <code>deleteMany({})</code> and <code>deleteMany({ where: undefined })</code> and a <code>where</code> whose every key came back undefined are all the same instruction, and the instruction is "delete every row". Nothing warns you, because you did exactly what you asked. Two defences, both cheap: require at least one real condition before the call (<code>if (Object.values(dieuKien).every((v) =&gt; v === undefined)) throw …</code>), and prefer soft delete for anything a user can trigger, so the worst case is recoverable. Option 1 describes a guard Prisma does not have. Option 2 is the comfortable assumption that makes this dangerous. Option 4 mistakes the direction of a referential action: <code>Restrict</code> protects a parent from being deleted while children exist, it does not shield the rows named by this filter. Worth remembering alongside it: <code>updateMany</code> has the mirror-image trap, where a wrong filter is silent because <code>{ count: 0 }</code> is not an error.',
            'Một giá trị <code>undefined</code> trong <code>where</code> bị Prisma bỏ qua — đó chính là tính chất mà cả lối viết spread-if cho bộ lọc động dựa vào, và nó hữu ích. Đem áp vào <code>deleteMany</code> thì nó là sai lầm đắt nhất trong toàn bộ API client: <code>deleteMany({})</code>, <code>deleteMany({ where: undefined })</code> và một <code>where</code> mà mọi khoá đều trả về undefined đều là cùng một mệnh lệnh, và mệnh lệnh đó là "xoá mọi dòng". Không có gì cảnh báo bạn, vì bạn đã làm đúng thứ bạn yêu cầu. Hai lớp phòng vệ, cái nào cũng rẻ: bắt buộc phải có ít nhất một điều kiện thật trước khi gọi (<code>if (Object.values(dieuKien).every((v) =&gt; v === undefined)) throw …</code>), và ưu tiên xoá mềm cho mọi thứ người dùng bấm được, để trường hợp tệ nhất vẫn khôi phục được. Phương án 1 mô tả một lớp chặn mà Prisma không có. Phương án 2 là giả định dễ chịu khiến chuyện này trở nên nguy hiểm. Phương án 4 nhầm chiều của hành vi tham chiếu: <code>Restrict</code> bảo vệ một dòng CHA khỏi bị xoá khi vẫn còn con, chứ không che chắn cho những dòng mà bộ lọc này gọi tên. Đáng nhớ kèm theo: <code>updateMany</code> có cái bẫy soi gương, ở đó một bộ lọc sai thì im lặng vì <code>{ count: 0 }</code> không phải là lỗi.',
          ),
        }),

        /* ═══════════════ Chương 5 — Truy vấn sâu (4 câu) ═══════════════ */
        // q19 · 5.1 · đáp án 1
        mcq({
          prompt: B(
            '<code>Post.published</code> is <code>Boolean?</code>. The table holds 60 rows with <code>true</code>, 30 with <code>false</code> and 10 with <code>NULL</code>. A "show me everything not published" filter is written as ' + c('where: { published: { not: true } }') + '. How many rows come back, and why?',
            '<code>Post.published</code> là <code>Boolean?</code>. Bảng có 60 dòng <code>true</code>, 30 dòng <code>false</code> và 10 dòng <code>NULL</code>. Bộ lọc "cho tôi mọi thứ chưa đăng" được viết là ' + c('where: { published: { not: true } }') + '. Bao nhiêu dòng trở về, và vì sao?',
          ),
          options: [
            B(
              '40 — <code>not</code> is a set complement in Prisma, so everything that is not <code>true</code> matches, NULLs included',
              '40 — <code>not</code> trong Prisma là phần bù của tập hợp, nên mọi thứ không phải <code>true</code> đều khớp, kể cả NULL',
            ),
            B(
              '30 — the comparison becomes <code>&lt;&gt; true</code>, and <code>NULL &lt;&gt; true</code> evaluates to NULL rather than TRUE, so the 10 NULL rows are excluded',
              '30 — phép so sánh thành <code>&lt;&gt; true</code>, mà <code>NULL &lt;&gt; true</code> cho ra NULL chứ không phải TRUE, nên 10 dòng NULL bị loại',
            ),
            B(
              '10 — <code>not: true</code> is shorthand for "the column is unset", which is what a nullable boolean means',
              '10 — <code>not: true</code> là cách viết tắt của "cột này chưa được đặt", đúng nghĩa của một boolean cho phép null',
            ),
            B(
              '100 — a <code>not</code> on a nullable column is a no-op and Prisma logs a warning about it',
              '100 — một <code>not</code> trên cột cho phép null là vô tác dụng và Prisma có ghi một cảnh báo về việc đó',
            ),
          ],
          correct: 1,
          explanation: EX(
            'This is three-valued logic, and it is the class of bug that produces a wrong answer rather than an error. SQL evaluates <code>NULL &lt;&gt; true</code> to <code>NULL</code>, and a <code>WHERE</code> keeps a row only when the predicate is <code>TRUE</code>, so the ten unset rows fall out of both <code>{ published: true }</code> and <code>{ published: { not: true } }</code>. Ten rows are in neither half of what you thought was a partition. If you mean "false or unset", say so: ' + c('{ OR: [{ published: false }, { published: null }] }') + '. The same trap catches <code>notIn</code> — <code>NOT IN</code> also excludes NULL rows — and it is why the course spends a page on it. The two clean escapes are to make the column non-nullable with a default (three-valued logic disappears entirely), or to write the <code>OR</code> out and never rely on the intuition. Option 1 describes what most people assume. Options 3 and 4 invent behaviour; note in particular that Prisma issues no warning here at all, which is exactly why the bug survives to production.',
            'Đây là logic ba trị, và nó thuộc lớp lỗi sinh ra một câu trả lời SAI chứ không sinh ra một lỗi. SQL tính <code>NULL &lt;&gt; true</code> ra <code>NULL</code>, mà một mệnh đề <code>WHERE</code> chỉ giữ lại dòng nào có vị từ bằng <code>TRUE</code>, nên mười dòng chưa đặt giá trị rơi ra khỏi cả <code>{ published: true }</code> lẫn <code>{ published: { not: true } }</code>. Mười dòng không nằm ở nửa nào của thứ bạn tưởng là một phép phân hoạch. Nếu ý bạn là "false hoặc chưa đặt" thì hãy nói ra: ' + c('{ OR: [{ published: false }, { published: null }] }') + '. Đúng cái bẫy đó tóm cả <code>notIn</code> — <code>NOT IN</code> cũng loại các dòng NULL — và vì thế giáo trình dành hẳn một trang cho nó. Hai lối thoát sạch sẽ là làm cho cột không cho phép null và có giá trị mặc định (logic ba trị biến mất hoàn toàn), hoặc viết hẳn mệnh đề <code>OR</code> ra và đừng bao giờ tin vào trực giác. Phương án 1 mô tả điều hầu hết mọi người giả định. Phương án 3 và 4 bịa ra hành vi; đặc biệt lưu ý rằng Prisma không phát cảnh báo nào ở đây cả, và chính vì thế con bọ này sống sót tới tận production.',
          ),
        }),

        // q20 · 5.2 · đáp án 3
        mcq({
          prompt: B(
            'A report asks for "users all of whose posts are published" and is written as ' + c('findMany({ where: { posts: { every: { published: true } } } })') + '. Three users come back: one with three published posts, and two with no posts at all. Why?',
            'Một báo cáo cần "những người dùng mà MỌI bài viết đều đã đăng" và được viết là ' + c('findMany({ where: { posts: { every: { published: true } } } })') + '. Ba người dùng trở về: một người có ba bài đã đăng, và hai người không có bài nào cả. Vì sao?',
          ),
          options: [
            B(
              'A bug in the relation filter: <code>every</code> should exclude empty collections, and the workaround is to add <code>NOT: { posts: { none: {} } }</code> until it is fixed upstream',
              'Một lỗi của bộ lọc quan hệ: đúng ra <code>every</code> phải loại các tập rỗng, và cách chữa tạm là thêm <code>NOT: { posts: { none: {} } }</code> cho tới khi phía trên sửa',
            ),
            B(
              'The two extra users have soft-deleted posts, which <code>every</code> counts as absent but the parent filter still matches',
              'Hai người dùng thừa ra kia có bài đã xoá mềm, thứ mà <code>every</code> coi như vắng mặt nhưng bộ lọc cha vẫn khớp',
            ),
            B(
              '<code>every</code> is evaluated in the query engine over the rows already fetched, so parents with nothing fetched pass by default',
              '<code>every</code> được query engine tính trên những dòng đã lấy về, nên các dòng cha chưa lấy về gì thì mặc nhiên qua',
            ),
            B(
              'Vacuous truth: <code>every</code> compiles to <code>NOT EXISTS (… WHERE NOT condition)</code>, which is true when there are no rows at all — so "all zero posts are published" is a true statement',
              'Chân lý rỗng: <code>every</code> biên dịch thành <code>NOT EXISTS (… WHERE NOT điều_kiện)</code>, vốn đúng khi chẳng có dòng nào — nên "tất cả không bài nào đều đã đăng" là một mệnh đề đúng',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The three to-many relation operators compile to exactly three SQL shapes: <code>some</code> to <code>EXISTS</code>, <code>none</code> to <code>NOT EXISTS</code>, and <code>every</code> to a <code>NOT EXISTS</code> over the <em>negated</em> condition — "there is no post of mine that is not published". A user with no posts has no counterexample, so the predicate is true. This is not a Prisma quirk; it is how universal quantification works over an empty set in logic and in SQL alike. The fix is to say the second half of what you meant: ' + c('{ AND: [{ posts: { some: {} } }, { posts: { every: { published: true } } }] }') + ' — "has at least one post, and all of them are published". Option 1 calls a correct implementation a bug (and its workaround, amusingly, is the right idea written the long way round). Option 2 invents soft-delete semantics the operator does not have. Option 3 is wrong about where the work happens: relation filters become correlated subqueries the database evaluates, which is also why every hop needs an index on the foreign key it joins by.',
            'Ba toán tử quan hệ một–nhiều biên dịch ra đúng ba hình dạng SQL: <code>some</code> thành <code>EXISTS</code>, <code>none</code> thành <code>NOT EXISTS</code>, và <code>every</code> thành một <code>NOT EXISTS</code> trên điều kiện ĐÃ PHỦ ĐỊNH — "không có bài nào của tôi mà chưa đăng". Một người dùng không có bài nào thì không có phản ví dụ nào, nên vị từ là đúng. Đây không phải nét kỳ quặc của Prisma; đây là cách lượng từ phổ quát hoạt động trên tập rỗng, trong logic cũng như trong SQL. Cách sửa là nói ra nốt nửa sau của điều bạn định nói: ' + c('{ AND: [{ posts: { some: {} } }, { posts: { every: { published: true } } }] }') + ' — "có ít nhất một bài, và tất cả đều đã đăng". Phương án 1 gọi một cài đặt đúng là lỗi (và cách chữa tạm của nó, buồn cười thay, chính là ý đúng viết theo lối vòng vo). Phương án 2 bịa ra ngữ nghĩa xoá mềm mà toán tử này không có. Phương án 3 sai về chỗ công việc diễn ra: bộ lọc quan hệ hoá thành truy vấn con tương quan do cơ sở dữ liệu tính, và cũng vì thế mà mỗi bước nhảy đều cần một chỉ mục trên khoá ngoại nó nối theo.',
          ),
        }),

        // q21 · 5.3 · đáp án 0
        mcq({
          prompt: B(
            'Cursor pagination is implemented as ' + c("findMany({ take: 20, cursor: { id: lastId }, orderBy: { id: 'asc' } })") + ' and the emitted SQL is:' +
            code('SELECT ... FROM "public"."Post"\nWHERE "public"."Post"."id" >= (SELECT "public"."Post"."id" FROM "public"."Post"\n                              WHERE ("public"."Post"."id") = ($1))\nORDER BY "public"."Post"."id" ASC LIMIT $2 OFFSET $3') +
            'Users report that the last row of each page appears again as the first row of the next. What is missing, and what is the general rule?',
            'Phân trang bằng con trỏ được cài là ' + c("findMany({ take: 20, cursor: { id: lastId }, orderBy: { id: 'asc' } })") + ' và SQL phát ra là:' +
            code('SELECT ... FROM "public"."Post"\nWHERE "public"."Post"."id" >= (SELECT "public"."Post"."id" FROM "public"."Post"\n                              WHERE ("public"."Post"."id") = ($1))\nORDER BY "public"."Post"."id" ASC LIMIT $2 OFFSET $3') +
            'Người dùng báo rằng dòng cuối của mỗi trang lại xuất hiện làm dòng đầu của trang kế. Thiếu gì, và quy tắc chung là gì?',
          ),
          options: [
            B(
              '<code>skip: 1</code> is missing — the comparison is <code>&gt;=</code>, so the cursor row is included by default; and the field you cursor on must be unique and must be the last key in <code>orderBy</code>',
              'Thiếu <code>skip: 1</code> — phép so sánh là <code>&gt;=</code>, nên dòng con trỏ mặc định được TÍNH VÀO; và trường bạn đặt con trỏ phải là duy nhất và phải là khoá CUỐI CÙNG trong <code>orderBy</code>',
            ),
            B(
              '<code>take</code> must be <code>19</code> to leave room for the cursor row; Prisma counts the cursor towards the page size',
              '<code>take</code> phải là <code>19</code> để chừa chỗ cho dòng con trỏ; Prisma tính dòng con trỏ vào kích thước trang',
            ),
            B(
              'The <code>OFFSET $3</code> should not be there — passing a cursor and an offset together makes Prisma re-read the boundary row',
              'Không nên có <code>OFFSET $3</code> ở đó — truyền cùng lúc con trỏ và offset khiến Prisma đọc lại dòng ở ranh giới',
            ),
            B(
              'The cursor must be the primary key of an ascending sequence; on a table with gaps the boundary row is returned twice',
              'Con trỏ phải là khoá chính của một dãy tăng dần; trên bảng có lỗ hổng thì dòng ranh giới bị trả về hai lần',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Read the operator in the generated SQL: <code>&gt;=</code>. Prisma\'s <code>cursor</code> means "start at this row", and the row it names is included, which is a reasonable default and a duplicate at every page boundary if you forget <code>skip: 1</code>. It is subtle enough to reach production, because on page one everything looks perfect. The second half of the answer is the rule that stops the harder version of this bug: whatever you cursor on must be <b>unique</b> and must be the <b>last key in <code>orderBy</code></b>. Prisma enforces the first half at compile time by only accepting a unique field, which is why half of this mistake is impossible to make. It cannot enforce the second: <code>orderBy: { publishedAt: \'desc\' }</code> with <code>cursor: { id }</code> and no <code>id</code> tiebreaker can skip or repeat rows around a tie, and the fix is either to end the ordering with the cursor field or to write the compound comparison longhand as ' + c('OR: [{ publishedAt: { lt: at } }, { publishedAt: at, id: { lt: id } }]') + '. Options 2, 3 and 4 all invent mechanics; note that the <code>OFFSET $3</code> in the log is where <code>skip</code> would appear, so it is evidence for the right answer rather than against it.',
            'Hãy đọc toán tử trong đoạn SQL sinh ra: <code>&gt;=</code>. <code>cursor</code> của Prisma nghĩa là "bắt đầu từ dòng này", và dòng nó gọi tên được TÍNH VÀO, một mặc định hợp lý và cũng là một dòng trùng ở mọi ranh giới trang nếu bạn quên <code>skip: 1</code>. Nó tinh vi đủ để lọt tới production, vì ở trang một mọi thứ trông hoàn hảo. Nửa sau của câu trả lời là quy tắc chặn được phiên bản khó hơn của con bọ này: thứ bạn đặt con trỏ lên phải <b>duy nhất</b> và phải là <b>khoá cuối cùng trong <code>orderBy</code></b>. Prisma cưỡng chế nửa đầu ngay lúc biên dịch bằng cách chỉ nhận trường duy nhất, và vì thế một nửa sai lầm này là bất khả. Nó không cưỡng chế được nửa sau: <code>orderBy: { publishedAt: \'desc\' }</code> với <code>cursor: { id }</code> mà không có <code>id</code> phá hoà có thể bỏ sót hoặc lặp lại các dòng quanh chỗ hoà, và cách sửa là hoặc kết thúc thứ tự bằng chính trường con trỏ, hoặc viết hẳn phép so sánh ghép ra dạng ' + c('OR: [{ publishedAt: { lt: at } }, { publishedAt: at, id: { lt: id } }]') + '. Phương án 2, 3 và 4 đều bịa ra cơ chế; lưu ý rằng <code>OFFSET $3</code> trong log chính là chỗ <code>skip</code> sẽ hiện ra, nên nó là bằng chứng ỦNG HỘ đáp án đúng chứ không phải chống lại.',
          ),
        }),

        // q22 · 5.4 + 10.2 · đáp án 2
        mcq({
          prompt: B(
            'A dashboard route replaces a Prisma <code>count()</code> with a raw query and starts returning 500s:' +
            code('const rows = await prisma.$queryRaw`SELECT count(*) FROM "Post"`;\nres.json(rows);\n// TypeError: Do not know how to serialize a BigInt') +
            'Why did the same number work through <code>prisma.post.count()</code>, and what is the right fix?',
            'Một route bảng điều khiển thay <code>count()</code> của Prisma bằng một truy vấn thô và bắt đầu trả về lỗi 500:' +
            code('const rows = await prisma.$queryRaw`SELECT count(*) FROM "Post"`;\nres.json(rows);\n// TypeError: Do not know how to serialize a BigInt') +
            'Vì sao cũng con số đó lại chạy được qua <code>prisma.post.count()</code>, và cách sửa đúng là gì?',
          ),
          options: [
            B(
              '<code>$queryRaw</code> returns strings for every column; the fix is <code>Number(rows[0].count)</code> after a <code>String</code> cast',
              '<code>$queryRaw</code> trả về chuỗi cho mọi cột; cách sửa là <code>Number(rows[0].count)</code> sau khi ép về <code>String</code>',
            ),
            B(
              'The generic type parameter was omitted; writing <code>$queryRaw&lt;{ count: number }[]&gt;</code> makes the driver convert the column',
              'Thiếu tham số kiểu generic; viết <code>$queryRaw&lt;{ count: number }[]&gt;</code> sẽ khiến driver chuyển đổi cột đó',
            ),
            B(
              'PostgreSQL\'s <code>count(*)</code> is <code>bigint</code> and the driver maps it to the JavaScript <code>bigint</code> primitive, which <code>JSON.stringify</code> refuses; cast in SQL with <code>count(*)::int</code> — Prisma\'s own <code>_count</code> already did this for you',
              '<code>count(*)</code> của PostgreSQL là <code>bigint</code> và driver ánh xạ nó thành kiểu nguyên thuỷ <code>bigint</code> của JavaScript, thứ mà <code>JSON.stringify</code> từ chối; hãy ép kiểu ngay trong SQL bằng <code>count(*)::int</code> — <code>_count</code> của chính Prisma vốn đã làm hộ bạn việc đó',
            ),
            B(
              'The column has no alias, so the key is unnamed and Express serialises the row object itself; adding <code>AS n</code> fixes it',
              'Cột không có bí danh nên khoá bị vô danh và Express đem chính đối tượng dòng đi tuần tự hoá; thêm <code>AS n</code> là xong',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: the value comes back as <code>3n</code> and <code>typeof</code> is <code>\'bigint\'</code>, and <code>JSON.stringify</code> throws <code>Do not know how to serialize a BigInt</code>. Nothing is broken — PostgreSQL\'s <code>count(*)</code> really is <code>bigint</code>, the driver really does map it to the matching JavaScript primitive, and <code>JSON</code> really has no representation for it. What changed is that dropping to raw removed a conversion layer you did not know you were using; the builder\'s <code>_count</code> hands you a plain <code>number</code>, which is why the problem only appears the first time you write raw SQL. The course\'s rule is <b>cast in SQL, do not convert in JavaScript</b>: <code>count(*)::int</code> keeps the fix at the boundary where the type is decided, works for every consumer of that query, and survives someone later mapping the rows a different way. Use <code>::bigint</code> deliberately when a count can genuinely exceed 2³¹. Option 1 is wrong about the driver. Option 2 states the misconception this whole area rests on — the generic is a cast, nothing verifies it, and it changes no runtime behaviour. Option 4 misreads the error, which is about a value, not a key. The sibling trap to remember: <code>Decimal</code> comes back as a <code>Prisma.Decimal</code> object, so <code>row.price + 100</code> is a string concatenation and produces a plausible wrong number rather than an error.',
            'Đo thật: giá trị trở về là <code>3n</code> và <code>typeof</code> là <code>\'bigint\'</code>, còn <code>JSON.stringify</code> ném <code>Do not know how to serialize a BigInt</code>. Chẳng có gì hỏng cả — <code>count(*)</code> của PostgreSQL thật sự là <code>bigint</code>, driver thật sự ánh xạ nó sang đúng kiểu nguyên thuỷ tương ứng của JavaScript, và <code>JSON</code> thật sự không có cách biểu diễn nào cho nó. Thứ thay đổi là việc rơi xuống SQL thô đã gỡ mất một tầng chuyển đổi mà bạn không biết mình đang dùng; <code>_count</code> của builder đưa cho bạn một <code>number</code> thường, và vì thế vấn đề chỉ xuất hiện lần đầu tiên bạn viết SQL thô. Quy tắc của giáo trình là <b>ép kiểu trong SQL, đừng chuyển đổi trong JavaScript</b>: <code>count(*)::int</code> giữ chỗ sửa ngay tại nơi kiểu được quyết định, đúng cho mọi người tiêu thụ truy vấn đó, và sống sót qua việc sau này có ai ánh xạ các dòng theo cách khác. Hãy dùng <code>::bigint</code> một cách có chủ ý khi một phép đếm thật sự có thể vượt 2³¹. Phương án 1 sai về driver. Phương án 2 phát biểu đúng cái ngộ nhận mà cả vùng kiến thức này dựa vào — generic chỉ là một phép ép kiểu, chẳng có gì kiểm nó, và nó không đổi hành vi lúc chạy. Phương án 4 đọc sai thông báo lỗi, vốn nói về một GIÁ TRỊ chứ không phải một khoá. Cái bẫy anh em cần nhớ kèm: <code>Decimal</code> trở về dưới dạng đối tượng <code>Prisma.Decimal</code>, nên <code>row.price + 100</code> là phép nối chuỗi và cho ra một con số sai nghe rất hợp lý chứ không phải một lỗi.',
          ),
        }),

        /* ═══════════════ Chương 6 — Migration (4 câu) ═══════════════ */
        // q23 · 6.1 · đáp án 1
        mcq({
          prompt: B(
            'A deploy went wrong and someone runs this on production:' +
            code('SELECT migration_name, finished_at, rolled_back_at, applied_steps_count\nFROM _prisma_migrations ORDER BY started_at;\n\n        migration_name        |          finished_at          | rolled_back_at | applied_steps_count\n------------------------------+-------------------------------+----------------+---------------------\n 20260907204634_init          | 2026-09-07 20:46:34.171068+00 |                |                   1\n 20260908000000_bad_dup_index |                               |                |                   0') +
            'What does the second row mean?',
            'Một lần deploy hỏng và có người chạy lệnh này trên production:' +
            code('SELECT migration_name, finished_at, rolled_back_at, applied_steps_count\nFROM _prisma_migrations ORDER BY started_at;\n\n        migration_name        |          finished_at          | rolled_back_at | applied_steps_count\n------------------------------+-------------------------------+----------------+---------------------\n 20260907204634_init          | 2026-09-07 20:46:34.171068+00 |                |                   1\n 20260908000000_bad_dup_index |                               |                |                   0') +
            'Dòng thứ hai nghĩa là gì?',
          ),
          options: [
            B(
              'The migration is still pending: Prisma writes the row when it discovers the folder and fills <code>finished_at</code> when the migration eventually runs',
              'Migration này còn đang chờ: Prisma ghi dòng đó lúc phát hiện ra thư mục và điền <code>finished_at</code> khi migration cuối cùng chạy',
            ),
            B(
              'It started and failed: <code>finished_at</code> is NULL and <code>rolled_back_at</code> is NULL, so it is in the failed state — and <code>applied_steps_count = 0</code> says PostgreSQL rolled the whole file back, because Prisma runs each migration file in a transaction',
              'Nó đã bắt đầu và hỏng: <code>finished_at</code> NULL và <code>rolled_back_at</code> cũng NULL, tức đang ở trạng thái HỎNG — và <code>applied_steps_count = 0</code> nói rằng PostgreSQL đã cuộn ngược cả file, vì Prisma chạy mỗi file migration trong một giao dịch',
            ),
            B(
              'It was rolled back by a human: <code>applied_steps_count = 0</code> is what <code>migrate resolve --rolled-back</code> writes',
              'Nó đã được người xử lý cuộn ngược: <code>applied_steps_count = 0</code> chính là thứ <code>migrate resolve --rolled-back</code> ghi vào',
            ),
            B(
              'It applied cleanly but contained no statements Prisma recognised, which is normal for a migration that only creates indexes',
              'Nó đã áp sạch sẽ nhưng không chứa câu lệnh nào Prisma nhận ra, chuyện bình thường với một migration chỉ tạo chỉ mục',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Four states, read off three columns. <b>Pending</b> = on disk with no row at all; Prisma writes nothing until it starts running the file, so option 1 has the mechanism backwards. <b>Applied</b> = a row with <code>finished_at</code> set, like the first line. <b>Failed</b> = a row with <code>started_at</code> set and both <code>finished_at</code> and <code>rolled_back_at</code> NULL, exactly what the second line shows; <code>logs</code> holds the error. <b>Resolved</b> = <code>rolled_back_at</code> set, which only <code>migrate resolve --rolled-back</code> writes, so option 3 names the right command for the wrong column. The <code>applied_steps_count = 0</code> is the reassuring part and worth knowing precisely: on PostgreSQL a migration file runs inside a transaction, so a failure in statement two undoes statement one, and the measured run above left no trace of the index it had already created. That is not universal — <code>CREATE INDEX CONCURRENTLY</code> cannot run inside a transaction and MySQL has no transactional DDL at all, which is exactly why the column exists. What matters next is the discipline: this state blocks every later <code>migrate deploy</code>, and the correct response is to report it and decide with a human, never to reach for <code>migrate resolve</code> because it makes the red go away.',
            'Bốn trạng thái, đọc ra từ ba cột. <b>Chờ</b> = có trên đĩa mà không có dòng nào cả; Prisma không ghi gì cho tới khi nó bắt đầu chạy file, nên phương án 1 hiểu ngược cơ chế. <b>Đã áp</b> = một dòng có <code>finished_at</code>, như dòng đầu tiên. <b>Hỏng</b> = một dòng có <code>started_at</code> và cả <code>finished_at</code> lẫn <code>rolled_back_at</code> đều NULL, đúng như dòng thứ hai; cột <code>logs</code> giữ nội dung lỗi. <b>Đã xử lý</b> = có <code>rolled_back_at</code>, thứ chỉ <code>migrate resolve --rolled-back</code> ghi vào, nên phương án 3 gọi đúng tên câu lệnh nhưng gán vào sai cột. Chỗ <code>applied_steps_count = 0</code> là phần đáng yên tâm và đáng biết cho chính xác: trên PostgreSQL một file migration chạy bên trong một giao dịch, nên hỏng ở câu lệnh thứ hai sẽ huỷ luôn câu lệnh thứ nhất, và lượt chạy đo được ở trên không để lại dấu vết nào của cái chỉ mục nó vừa tạo. Điều đó không phổ quát — <code>CREATE INDEX CONCURRENTLY</code> không chạy được trong một giao dịch còn MySQL thì không có DDL giao dịch, và chính vì thế cột này tồn tại. Thứ quan trọng tiếp theo là kỷ luật: trạng thái này chặn mọi lần <code>migrate deploy</code> sau đó, và phản ứng đúng là báo cáo rồi cùng người quyết định, chứ không bao giờ với tay lấy <code>migrate resolve</code> chỉ vì nó làm màu đỏ biến mất.',
          ),
        }),

        // q24 · 6.2 · đáp án 3
        mcq({
          prompt: B(
            'A repository has a migration that creates a UNIQUE constraint and then a plain index <b>with the same name</b>. It was applied on production long ago and everything runs. Today a developer adds a model and runs <code>npx prisma migrate dev</code>:' +
            code('Error: P3006\n\nMigration `20260908000000_shadow_trap` failed to apply cleanly to the shadow database.\nError:\nERROR: relation "tag_dup" already exists') +
            'What is true about this situation?',
            'Một kho mã có một migration tạo ràng buộc UNIQUE rồi tạo một chỉ mục thường <b>trùng tên</b>. Nó đã được áp lên production từ lâu và mọi thứ vẫn chạy. Hôm nay một lập trình viên thêm một model rồi chạy <code>npx prisma migrate dev</code>:' +
            code('Error: P3006\n\nMigration `20260908000000_shadow_trap` failed to apply cleanly to the shadow database.\nError:\nERROR: relation "tag_dup" already exists') +
            'Điều gì đúng trong tình huống này?',
          ),
          options: [
            B(
              'Production is now in a failed-migration state and will refuse the next deploy until someone runs <code>migrate resolve</code>',
              'Production giờ đang ở trạng thái migration hỏng và sẽ từ chối lần deploy kế tiếp cho tới khi có người chạy <code>migrate resolve</code>',
            ),
            B(
              'The shadow database is out of sync; running <code>prisma db push</code> against it once will repair the replay',
              'Shadow database đang lệch; chạy <code>prisma db push</code> vào nó một lần là sửa được phép phát lại',
            ),
            B(
              'The old migration must be edited to remove the duplicate name, which is safe because it has already been applied everywhere',
              'Phải sửa migration cũ để bỏ cái tên trùng, và làm vậy an toàn vì nó đã được áp ở mọi nơi rồi',
            ),
            B(
              'Only <code>migrate dev</code> is broken — it replays the whole history into a throwaway shadow database — while <code>migrate deploy</code> uses no shadow database and keeps working, so new migrations are hand-written and applied with <code>migrate deploy</code>',
              'Chỉ <code>migrate dev</code> hỏng — nó phát lại toàn bộ lịch sử vào một shadow database dùng xong vứt — còn <code>migrate deploy</code> không dùng shadow database nào và vẫn chạy, nên migration mới được viết tay rồi áp bằng <code>migrate deploy</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'This is measured, both halves. <code>migrate dev</code> creates a shadow database, replays every migration into it from the first one, diffs it against your schema to produce the new SQL, and diffs it against the real database to detect drift. Step two is where a history that cannot replay from scratch dies, and it dies regardless of whether production is healthy — which it is, because the constraint and the index were created once, in order, years of rows ago. <code>migrate deploy</code> does none of that: it reads the folder, reads <code>_prisma_migrations</code>, and runs what is missing. In the run this question comes from, the same schema change that produced P3006 on <code>migrate dev</code> applied without complaint through a hand-written folder and <code>migrate deploy</code>. So the repository loses the generated starting point and the drift check — both of which <code>migrate diff</code> gives back — and permanently loses the guarantee that the history replays. Option 1 confuses a shadow-database failure with a production one; nothing touched production here. Option 2 misunderstands what the shadow database is: it is created and dropped on every run. Option 3 is the forbidden move — the migration is applied everywhere, and the correct response to a migration that turned out to be wrong is always a new one that supersedes it.',
            'Cả hai vế đều đo được. <code>migrate dev</code> tạo một shadow database, phát lại mọi migration vào đó từ cái đầu tiên, so nó với lược đồ của bạn để sinh ra SQL mới, rồi so nó với cơ sở dữ liệu thật để phát hiện trôi dạt. Bước hai là nơi một lịch sử không phát lại được từ đầu sẽ chết, và nó chết bất kể production có khoẻ hay không — mà production thì khoẻ, vì ràng buộc và chỉ mục kia đã được tạo một lần, theo thứ tự, từ nhiều năm dữ liệu trước. <code>migrate deploy</code> không làm gì trong số đó: nó đọc thư mục, đọc <code>_prisma_migrations</code>, rồi chạy phần còn thiếu. Trong lượt chạy sinh ra câu hỏi này, đúng thay đổi lược đồ đã gây P3006 với <code>migrate dev</code> lại được áp không một lời phàn nàn qua một thư mục viết tay và <code>migrate deploy</code>. Vậy kho mã mất đi điểm khởi đầu được sinh tự động và phép kiểm trôi dạt — cả hai thứ ấy <code>migrate diff</code> trả lại được — và mất vĩnh viễn bảo đảm rằng lịch sử phát lại được. Phương án 1 nhầm một cú hỏng ở shadow database với một cú hỏng trên production; ở đây không có gì chạm tới production. Phương án 2 hiểu sai shadow database là gì: nó được tạo ra và bị xoá đi trong mỗi lượt chạy. Phương án 3 là nước đi bị cấm — migration đó đã áp ở mọi nơi, và phản ứng đúng với một migration hoá ra là sai luôn luôn là một migration mới thay thế nó.',
          ),
        }),

        // q25 · 6.4 · đáp án 0
        mcq({
          prompt: B(
            'Someone adds a column to production by hand: ' + c('ALTER TABLE "Tag" ADD COLUMN "hotfix" text;') + '. Afterwards, <code>npx prisma migrate status</code> prints:' +
            code('3 migrations found in prisma/migrations\n\nDatabase schema is up to date!') +
            'What does that output actually prove, and what would find the change?',
            'Có người thêm một cột vào production bằng tay: ' + c('ALTER TABLE "Tag" ADD COLUMN "hotfix" text;') + '. Sau đó, <code>npx prisma migrate status</code> in ra:' +
            code('3 migrations found in prisma/migrations\n\nDatabase schema is up to date!') +
            'Output đó thật ra chứng minh điều gì, và cái gì sẽ tìm ra thay đổi kia?',
          ),
          options: [
            B(
              'It proves only that every migration folder has a matching applied row; drift is a different question, and <code>migrate diff</code> (or <code>migrate dev</code>, which refuses and offers a reset) is what detects the extra column',
              'Nó chỉ chứng minh rằng mọi thư mục migration đều có một dòng đã-áp tương ứng; trôi dạt là một câu hỏi khác, và <code>migrate diff</code> (hoặc <code>migrate dev</code>, thứ từ chối chạy và đề nghị reset) mới là cái phát hiện ra cột thừa',
            ),
            B(
              'It proves there is no drift; the hand-added column must have failed silently, and <code>\\d "Tag"</code> will show it is not really there',
              'Nó chứng minh không có trôi dạt; cột thêm tay kia hẳn đã hỏng âm thầm, và <code>\\d "Tag"</code> sẽ cho thấy nó không thật sự tồn tại',
            ),
            B(
              'It proves the column was adopted automatically, because Prisma records manual DDL in <code>_prisma_migrations</code> as an implicit migration',
              'Nó chứng minh cột đó đã được tiếp nhận tự động, vì Prisma ghi nhận DDL thủ công vào <code>_prisma_migrations</code> như một migration ngầm',
            ),
            B(
              'Nothing — <code>migrate status</code> always prints this line unless a migration failed, and no command in Prisma can compare a live database with a schema file',
              'Không chứng minh gì — <code>migrate status</code> luôn in dòng này trừ khi có migration hỏng, và không lệnh nào của Prisma so được cơ sở dữ liệu đang sống với một file lược đồ',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Measured on Prisma 5.22: after the manual <code>ALTER TABLE</code>, <code>migrate status</code> still reports "Database schema is up to date!" — and it is not lying, it is answering a narrower question than people read into it. <code>migrate status</code> compares the folders on disk with the rows in <code>_prisma_migrations</code>; that is all it does, which is also why it is safe to run against production. Drift is the comparison between the <em>shape</em> of the live database and your migration history or schema file, and two things detect it. <code>migrate diff</code> is the read-only one — on this database it printed ' + c('ALTER TABLE "Tag" DROP COLUMN "hotfix";') + ', and note how you read that: the output is the SQL that would make the database match the schema, so it tells you what the database <em>has</em> that your schema does not. <code>migrate dev</code> is the other, and it is blunt: <code>Drift detected: Your database schema is not in sync with your migration history</code>, followed by an offer to reset and lose all data. Having found drift, the response is usually to <b>adopt</b> it — write a migration containing <code>CREATE … IF NOT EXISTS</code> and mark it with <code>migrate resolve --applied</code>, so the record becomes true without changing the database. Option 4 overcorrects into a different falsehood.',
            'Đo thật trên Prisma 5.22: sau lệnh <code>ALTER TABLE</code> thủ công, <code>migrate status</code> vẫn báo "Database schema is up to date!" — và nó không nói dối, nó chỉ đang trả lời một câu hỏi hẹp hơn thứ người ta đọc ra từ nó. <code>migrate status</code> so các thư mục trên đĩa với các dòng trong <code>_prisma_migrations</code>; nó chỉ làm có thế, và cũng vì thế mà chạy nó lên production là an toàn. Trôi dạt là phép so giữa HÌNH DẠNG của cơ sở dữ liệu đang sống với lịch sử migration hoặc file lược đồ của bạn, và có hai thứ phát hiện được. <code>migrate diff</code> là thứ chỉ đọc — trên cơ sở dữ liệu này nó in ra ' + c('ALTER TABLE "Tag" DROP COLUMN "hotfix";') + ', và hãy để ý cách đọc nó: output là đoạn SQL biến cơ sở dữ liệu thành khớp với lược đồ, nên nó cho bạn biết cơ sở dữ liệu ĐANG CÓ gì mà lược đồ của bạn không có. <code>migrate dev</code> là thứ còn lại, và nó nói thẳng: <code>Drift detected: Your database schema is not in sync with your migration history</code>, rồi đề nghị reset và mất sạch dữ liệu. Khi đã tìm ra trôi dạt, phản ứng thường là <b>tiếp nhận</b> nó — viết một migration chứa <code>CREATE … IF NOT EXISTS</code> rồi đánh dấu bằng <code>migrate resolve --applied</code>, để bản ghi trở thành đúng sự thật mà không đụng vào cơ sở dữ liệu. Phương án 4 chỉnh quá tay thành một điều sai khác.',
          ),
        }),

        // q26 · 6.5 + 12.2 · đáp án 2
        mcq({
          prompt: B(
            'A migration fails on production. The deploy log shows:' +
            code('Applying migration `20260908000000_bad_dup_index`\nError: P3018\n\nA migration failed to apply. New migrations cannot be applied before the error is\nrecovered from.\nDatabase error code: 42P07\nDatabase error:\nERROR: relation "tag_name_dup" already exists') +
            'The deploy is re-run twenty minutes later and now says <code>Error: P3009</code>. What is the correct reading and the correct next step?',
            'Một migration hỏng trên production. Log deploy hiện:' +
            code('Applying migration `20260908000000_bad_dup_index`\nError: P3018\n\nA migration failed to apply. New migrations cannot be applied before the error is\nrecovered from.\nDatabase error code: 42P07\nDatabase error:\nERROR: relation "tag_name_dup" already exists') +
            'Lần deploy sau đó hai mươi phút thì báo <code>Error: P3009</code>. Cách đọc đúng và bước tiếp theo đúng là gì?',
          ),
          options: [
            B(
              'P3018 and P3009 are the same failure reported twice; run <code>migrate resolve --applied</code> so the deploy can continue, then fix the file',
              'P3018 và P3009 là cùng một cú hỏng báo hai lần; chạy <code>migrate resolve --applied</code> để deploy đi tiếp, rồi sửa file sau',
            ),
            B(
              'P3009 means the second attempt failed differently; rewrite the migration with <code>CREATE INDEX IF NOT EXISTS</code> so it becomes idempotent and re-run',
              'P3009 nghĩa là lần thử thứ hai hỏng theo cách khác; hãy viết lại migration bằng <code>CREATE INDEX IF NOT EXISTS</code> cho nó idempotent rồi chạy lại',
            ),
            B(
              'P3018 is this migration failing now, with the PostgreSQL SQLSTATE attached; P3009 is every later deploy refusing to start because a failed migration is on record — stop, read <code>applied_steps_count</code> and <code>logs</code>, and decide with a human',
              'P3018 là chính migration này đang hỏng ngay bây giờ, kèm SQLSTATE của PostgreSQL; P3009 là mọi lần deploy về sau từ chối khởi động vì có một migration hỏng đã được ghi nhận — hãy DỪNG, đọc <code>applied_steps_count</code> và <code>logs</code>, rồi quyết định cùng một con người',
            ),
            B(
              'P3009 supersedes P3018 because the first error was transient; a third deploy will usually succeed once autovacuum releases the index name',
              'P3009 thay thế P3018 vì lỗi đầu chỉ là nhất thời; lần deploy thứ ba thường sẽ thành công khi autovacuum nhả cái tên chỉ mục ra',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Both codes were measured on the same failure, in this order, and the distinction is useful at 2am. <b>P3018</b> is the first-hand report: <em>this</em> migration failed <em>now</em>, and it carries the database\'s own error underneath — here SQLSTATE <code>42P07</code>, "relation already exists", which points straight at the duplicate index name in the file. <b>P3009</b> is what every subsequent <code>migrate deploy</code> says: it found a failed migration on record and will not apply anything further until a human resolves it. Seeing P3009 without P3018 in the same log usually means the real error is in an earlier deploy\'s output, or in the <code>logs</code> column of <code>_prisma_migrations</code>. The next step is the one rule in the whole course that cannot be re-derived under pressure: <b>stop</b>. Find how far it got (<code>SELECT migration_name, applied_steps_count, left(logs, 200) FROM _prisma_migrations WHERE finished_at IS NULL</code>), run <code>migrate diff</code> to see the real difference, then report and decide. Option 1 is the forbidden auto-fix: <code>--applied</code> on a partially applied migration tells Prisma the whole file ran when only part of it did, and that silently corrupts the history. Option 2 is the other forbidden move — rewriting a recorded migration with <code>IF NOT EXISTS</code> hides the partial state instead of resolving it, and the file now has a different checksum. Option 4 invents a transient cause; a duplicate relation name is not going to resolve itself.',
            'Cả hai mã đều được đo trên cùng một cú hỏng, theo đúng thứ tự này, và phân biệt được chúng thì rất có ích lúc 2 giờ sáng. <b>P3018</b> là báo cáo trực tiếp: CHÍNH migration này hỏng NGAY BÂY GIỜ, và nó mang theo lỗi của chính cơ sở dữ liệu bên dưới — ở đây là SQLSTATE <code>42P07</code>, "relation already exists", thứ chỉ thẳng vào cái tên chỉ mục bị trùng trong file. <b>P3009</b> là thứ mọi lần <code>migrate deploy</code> sau đó nói: nó tìm thấy một migration hỏng đã được ghi nhận và sẽ không áp thêm gì nữa cho tới khi có người xử lý. Thấy P3009 mà không thấy P3018 trong cùng một log thường nghĩa là lỗi thật nằm ở output của lần deploy trước đó, hoặc trong cột <code>logs</code> của <code>_prisma_migrations</code>. Bước tiếp theo là quy tắc duy nhất trong cả khoá học mà bạn không thể tự suy lại được lúc đang căng: <b>DỪNG</b>. Tìm xem nó đi được tới đâu (<code>SELECT migration_name, applied_steps_count, left(logs, 200) FROM _prisma_migrations WHERE finished_at IS NULL</code>), chạy <code>migrate diff</code> để thấy khác biệt thật, rồi báo cáo và quyết định. Phương án 1 là kiểu tự-sửa bị cấm: <code>--applied</code> trên một migration mới áp được một phần là nói với Prisma rằng cả file đã chạy trong khi chỉ một phần chạy, và điều đó âm thầm làm hỏng lịch sử. Phương án 2 là nước đi bị cấm còn lại — viết lại một migration đã được ghi nhận bằng <code>IF NOT EXISTS</code> là che đi trạng thái dở dang thay vì xử lý nó, và file bây giờ có checksum khác. Phương án 4 bịa ra một nguyên nhân nhất thời; một cái tên quan hệ bị trùng sẽ không tự nó biến mất.',
          ),
        }),

        /* ══════════ Chương 7 — Giao dịch và tranh chấp (4 câu) ══════════ */
        // q27 · 7.1 · đáp án 1
        mcq({
          prompt: B(
            'This ran against a real database, and the two rows behaved differently:' +
            code('await prisma.$transaction(async (tx) => {\n  await tx.user.create({ data: { email: "inside@x.com" } });\n  await prisma.user.create({ data: { email: "outside@x.com" } });\n  throw new Error("rollback");\n}).catch(() => {});\n\n// inside@  exists? false\n// outside@ exists? true') +
            'Why did one survive the rollback?',
            'Đoạn này chạy thật trên một cơ sở dữ liệu, và hai dòng hành xử khác nhau:' +
            code('await prisma.$transaction(async (tx) => {\n  await tx.user.create({ data: { email: "inside@x.com" } });\n  await prisma.user.create({ data: { email: "outside@x.com" } });\n  throw new Error("rollback");\n}).catch(() => {});\n\n// inside@  exists? false\n// outside@ exists? true') +
            'Vì sao một dòng sống sót qua phép cuộn ngược?',
          ),
          options: [
            B(
              'The second <code>create</code> committed first because it was issued later and PostgreSQL commits in reverse order within a session',
              'Lệnh <code>create</code> thứ hai commit trước vì nó được phát ra sau và PostgreSQL commit theo thứ tự ngược trong một phiên',
            ),
            B(
              '<code>prisma</code> and <code>tx</code> are different clients on different connections: a call on the outer client runs outside the transaction, so it is neither rolled back nor able to see the uncommitted write',
              '<code>prisma</code> và <code>tx</code> là hai client khác nhau trên hai kết nối khác nhau: một lời gọi lên client bên ngoài chạy NGOÀI giao dịch, nên nó không bị cuộn ngược và cũng không nhìn thấy phần ghi chưa commit',
            ),
            B(
              'Throwing inside the callback only rolls back writes made after the throw; writes before it are already flushed',
              'Ném lỗi trong callback chỉ cuộn ngược những phép ghi thực hiện sau chỗ ném; những phép ghi trước đó đã được đẩy đi rồi',
            ),
            B(
              'The outer client was in autocommit mode because <code>$transaction</code> only opens a transaction once a <code>tx</code> method is awaited twice',
              'Client bên ngoài đang ở chế độ autocommit vì <code>$transaction</code> chỉ mở giao dịch khi một phương thức của <code>tx</code> được await tới lần thứ hai',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The query log makes it plain: one <code>BEGIN</code>, two <code>INSERT</code>s, one <code>ROLLBACK</code> — and yet <code>outside@</code> is still there, because that insert never belonged to the transaction at all. It went out on a different connection from the pool. This is the single most common bug in interactive transactions, and nothing warns you about it: the call compiles, it succeeds, and the only symptom is data that should have been undone. The rule is mechanical — <b>inside the callback, use <code>tx</code> and nothing else</b>, including in every helper the callback calls, which is why helpers should take the client as a parameter typed as ' + c("Omit<PrismaClient, '$connect' | '$disconnect' | '$transaction' | '$extends'>") + ' rather than importing the singleton. There is a nastier version of the same mistake: an outer-client <em>read</em> inside a transaction can wait for a connection the transaction itself is holding, so the request hangs until <code>pool_timeout</code> fires with P2024 — on a busy server, never on your laptop. Note also what the transcript confirms about the mechanism: throwing <em>is</em> the rollback, there is no <code>rollback()</code>, and returning a value commits. Options 1, 3 and 4 invent commit semantics that do not exist.',
            'Log truy vấn nói rõ mọi thứ: một <code>BEGIN</code>, hai câu <code>INSERT</code>, một <code>ROLLBACK</code> — vậy mà <code>outside@</code> vẫn còn đó, vì lệnh chèn ấy chưa bao giờ thuộc về giao dịch. Nó đi ra bằng một kết nối khác lấy từ pool. Đây là lỗi phổ biến nhất trong giao dịch tương tác, và không có gì cảnh báo bạn: lời gọi biên dịch được, nó thành công, và triệu chứng duy nhất là dữ liệu lẽ ra phải bị huỷ. Quy tắc rất máy móc — <b>trong callback, dùng <code>tx</code> và chỉ <code>tx</code></b>, kể cả trong mọi hàm phụ mà callback gọi tới, và vì thế các hàm phụ nên NHẬN client làm tham số với kiểu ' + c("Omit<PrismaClient, '$connect' | '$disconnect' | '$transaction' | '$extends'>") + ' thay vì tự import cái singleton. Còn có một phiên bản khó chịu hơn của cùng sai lầm này: một lệnh ĐỌC bằng client ngoài ở trong giao dịch có thể phải chờ đúng cái kết nối mà giao dịch đang giữ, nên yêu cầu treo cho tới khi <code>pool_timeout</code> nổ ra P2024 — trên máy chủ bận thì có, trên laptop của bạn thì không bao giờ. Cũng để ý điều đoạn ghi lại xác nhận về cơ chế: NÉM LỖI CHÍNH LÀ phép cuộn ngược, không có <code>rollback()</code> nào cả, và trả về một giá trị là commit. Phương án 1, 3 và 4 bịa ra những ngữ nghĩa commit không tồn tại.',
          ),
        }),

        // q28 · 7.1 + 7.4 · đáp án 3
        mcq({
          prompt: B(
            'An import routine runs inside ' + c('prisma.$transaction(async (tx) => { … })') + ' with no options, loops over ten thousand records calling <code>tx.post.create</code> for each, and fails part-way with:' +
            code("PrismaClientKnownRequestError code='P2028'\nTransaction API error: Transaction already closed: A query cannot be executed on an\nexpired transaction. The timeout for this transaction was 5000 ms, however 5013 ms\npassed since the start of the transaction.") +
            'What is the right fix?',
            'Một thủ tục nhập dữ liệu chạy trong ' + c('prisma.$transaction(async (tx) => { … })') + ' không kèm tuỳ chọn nào, lặp qua mười nghìn bản ghi gọi <code>tx.post.create</code> cho từng cái, và hỏng giữa chừng với:' +
            code("PrismaClientKnownRequestError code='P2028'\nTransaction API error: Transaction already closed: A query cannot be executed on an\nexpired transaction. The timeout for this transaction was 5000 ms, however 5013 ms\npassed since the start of the transaction.") +
            'Cách sửa đúng là gì?',
          ),
          options: [
            B(
              'Set <code>timeout: 600000</code>: the default of five seconds is a development safeguard and raising it is the documented way to run a long import',
              'Đặt <code>timeout: 600000</code>: mặc định năm giây là hàng rào cho lúc phát triển và nâng nó lên là cách được ghi trong tài liệu để chạy một lượt nhập dài',
            ),
            B(
              'Raise <code>maxWait</code> instead — the transaction did not run out of time, it ran out of time waiting for a connection, which is what <code>maxWait</code> governs',
              'Nâng <code>maxWait</code> thay vì cái kia — giao dịch không hết giờ khi chạy, nó hết giờ khi CHỜ một kết nối, và đó là thứ <code>maxWait</code> quản',
            ),
            B(
              'Catch P2028 and retry the whole transaction with exponential backoff, as you would for a write conflict',
              'Bắt P2028 rồi thử lại cả giao dịch với backoff luỹ thừa, giống như cách bạn làm với xung đột ghi',
            ),
            B(
              'Stop looping: replace ten thousand round trips with chunked <code>createMany</code> calls, because if raising a timeout would fix it, batching would fix it better',
              'Bỏ vòng lặp đi: thay mười nghìn lượt đi-về bằng những lời gọi <code>createMany</code> chia lô, vì nếu nâng timeout mà sửa được thì chia lô còn sửa tốt hơn',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The error is exact and measured: an interactive transaction has a <code>timeout</code> of 5000 ms by default, and exceeding it rolls back with <b>P2028</b>. (Its sibling <code>maxWait</code> defaults to 2000 ms and governs the wait for a connection <em>before</em> <code>BEGIN</code>; when that one fires, the transaction never began and nothing was rolled back. A third, <code>pool_timeout</code>, is a URL parameter defaulting to 10 s and produces P2024. A fourth, PostgreSQL\'s <code>statement_timeout</code>, is off by default and is not a Prisma setting at all.) So option 2 names a real knob for the wrong symptom. The tempting fix is option 1, and the course is blunt about why it is wrong: <code>timeout: 600000</code> makes it work and creates a ten-minute transaction — one connection held, locks accumulating, the write-ahead log growing, autovacuum blocked on those tables, and a rollback that discards ten minutes of work if anything fails at minute nine. The rule to keep is <b>if raising a timeout would fix it, batching would fix it better</b>: chunks of 500 through <code>createMany</code> turned five minutes of round trips into about two seconds in the course\'s own measurement. Option 3 retries a deterministic failure, which just costs five more seconds each time; retries belong to P2034, the write conflict. Raising the timeout is legitimate for something genuinely long and rare — a month-end close — and then you raise <code>maxWait</code> with it and set <code>SET LOCAL statement_timeout</code> inside, never globally.',
            'Thông báo lỗi rất chính xác và đã được đo: một giao dịch tương tác có <code>timeout</code> mặc định 5000 ms, và vượt quá là cuộn ngược với <b>P2028</b>. (Người anh em <code>maxWait</code> mặc định 2000 ms và quản thời gian CHỜ một kết nối TRƯỚC <code>BEGIN</code>; khi cái đó nổ thì giao dịch chưa hề bắt đầu nên chẳng có gì bị cuộn ngược. Cái thứ ba, <code>pool_timeout</code>, là tham số trong URL mặc định 10 giây và sinh ra P2024. Cái thứ tư, <code>statement_timeout</code> của PostgreSQL, mặc định tắt và không phải là một thiết lập của Prisma.) Nên phương án 2 gọi tên một cái núm có thật nhưng cho sai triệu chứng. Cách sửa hấp dẫn là phương án 1, và giáo trình nói thẳng vì sao nó sai: <code>timeout: 600000</code> làm nó chạy được và tạo ra một giao dịch mười phút — một kết nối bị giữ, khoá chồng lên nhau, write-ahead log phình ra, autovacuum bị chặn trên những bảng đó, và một phép cuộn ngược vứt đi mười phút công sức nếu có gì hỏng ở phút thứ chín. Quy tắc đáng giữ là <b>nếu nâng timeout mà sửa được thì chia lô còn sửa tốt hơn</b>: các lô 500 qua <code>createMany</code> đã biến năm phút đi-về thành khoảng hai giây trong chính phép đo của giáo trình. Phương án 3 thử lại một cú hỏng tất định, chỉ tốn thêm năm giây mỗi lần; thử lại là dành cho P2034, tức xung đột ghi. Nâng timeout là chính đáng cho một việc thật sự dài và hiếm — một lần chốt sổ cuối tháng — và khi đó bạn nâng <code>maxWait</code> cùng với nó rồi đặt <code>SET LOCAL statement_timeout</code> bên trong, không bao giờ đặt toàn cục.',
          ),
        }),

        // q29 · 7.2 · đáp án 0
        mcq({
          prompt: B(
            'A rule says a team may have at most two admins. The code reads the current admin count, checks it is below two, and promotes. Two requests arrive together, both read 1, both promote, and the team ends with three admins. The transaction is then re-run with ' + c('{ isolationLevel: Prisma.TransactionIsolationLevel.Serializable }') + ' and one of the two now fails with ' + c("code: 'P2034'") + '. What is the correct conclusion?',
            'Một quy tắc nói mỗi nhóm có tối đa hai quản trị viên. Mã đọc số quản trị viên hiện tại, kiểm rằng nó nhỏ hơn hai, rồi thăng cấp. Hai yêu cầu tới cùng lúc, cả hai đọc ra 1, cả hai thăng cấp, và nhóm kết thúc với ba quản trị viên. Giao dịch được chạy lại với ' + c('{ isolationLevel: Prisma.TransactionIsolationLevel.Serializable }') + ' và một trong hai bây giờ hỏng với ' + c("code: 'P2034'") + '. Kết luận đúng là gì?',
          ),
          options: [
            B(
              'The original bug is write skew, which even <code>REPEATABLE READ</code> permits; <code>SERIALIZABLE</code> does not make both succeed, it makes one fail loudly — so it is only a fix when paired with a bounded retry',
              'Lỗi ban đầu là write skew, thứ mà ngay cả <code>REPEATABLE READ</code> cũng cho phép; <code>SERIALIZABLE</code> không làm cả hai thành công, nó làm MỘT CÁI HỎNG TO TIẾNG — nên nó chỉ là cách sửa khi đi kèm một vòng thử lại có giới hạn',
            ),
            B(
              'The original bug is a dirty read; PostgreSQL permits dirty reads at <code>READ COMMITTED</code>, and P2034 shows the higher level has removed them',
              'Lỗi ban đầu là dirty read; PostgreSQL cho phép dirty read ở <code>READ COMMITTED</code>, và P2034 cho thấy mức cao hơn đã loại bỏ chúng',
            ),
            B(
              'P2034 means the isolation level is unsupported on this provider; PostgreSQL has only <code>READ COMMITTED</code> and <code>REPEATABLE READ</code>',
              'P2034 nghĩa là mức cô lập này không được provider hỗ trợ; PostgreSQL chỉ có <code>READ COMMITTED</code> và <code>REPEATABLE READ</code>',
            ),
            B(
              'Wrapping the read and the write in any <code>$transaction</code> would have been enough; the isolation level is irrelevant because a transaction already guarantees serial ordering',
              'Bọc phép đọc và phép ghi vào bất kỳ <code>$transaction</code> nào là đã đủ; mức cô lập không liên quan vì một giao dịch vốn đã bảo đảm thứ tự tuần tự',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Both transactions read a consistent snapshot, both concluded "there is room", and both wrote — and because they wrote to <em>different rows</em>, no ordinary conflict occurred. That is write skew, and it is the phenomenon that survives <code>REPEATABLE READ</code>; only <code>SERIALIZABLE</code> catches it, by detecting the read/write dependency cycle and aborting one side with SQLSTATE <code>40001</code>, which Prisma surfaces as <b>P2034</b>. The trap is thinking that promoting the isolation level finished the job. It did not: <em>a serializable transaction without a retry wrapper is not safer than <code>READ COMMITTED</code>, it just fails differently</em>. The retry needs four properties — bounded attempts (five is plenty), jitter in the backoff, only conflict codes retried (P2034 and P2002), and an idempotent transaction. And before reaching for any of that, the course ranks the cheaper answers: a constraint is strongest and cheapest (here, a partial unique index over the admin slots), then a precondition in the <code>where</code> of an <code>updateMany</code> with a <code>count === 0</code> check, then an explicit lock, and only then Serializable plus retry. Option 2 is wrong twice over: PostgreSQL has no dirty reads at any level, and <code>READ UNCOMMITTED</code> is accepted but silently behaves as <code>READ COMMITTED</code>. Option 3 misreads the code. Option 4 states the misconception the whole lesson exists to remove: a transaction guarantees all-or-nothing, not serial ordering.',
            'Cả hai giao dịch đều đọc một ảnh chụp nhất quán, cả hai đều kết luận "vẫn còn chỗ", và cả hai đều ghi — mà vì chúng ghi vào NHỮNG DÒNG KHÁC NHAU nên không có xung đột thông thường nào xảy ra. Đó là write skew, và đó là hiện tượng sống sót qua <code>REPEATABLE READ</code>; chỉ <code>SERIALIZABLE</code> mới bắt được nó, bằng cách phát hiện vòng phụ thuộc đọc/ghi rồi huỷ một phía với SQLSTATE <code>40001</code>, thứ Prisma đưa lên thành <b>P2034</b>. Cái bẫy là nghĩ rằng nâng mức cô lập lên là xong việc. Không xong: MỘT GIAO DỊCH SERIALIZABLE KHÔNG CÓ LỚP THỬ LẠI THÌ KHÔNG AN TOÀN HƠN <code>READ COMMITTED</code>, NÓ CHỈ HỎNG THEO CÁCH KHÁC. Vòng thử lại cần bốn tính chất — số lần có giới hạn (năm là nhiều rồi), có nhiễu ngẫu nhiên trong backoff, chỉ thử lại các mã xung đột (P2034 và P2002), và giao dịch phải idempotent. Và trước khi với tay tới bất cứ thứ nào trong đó, giáo trình xếp hạng các câu trả lời rẻ hơn: một ràng buộc là mạnh nhất và rẻ nhất (ở đây là một chỉ mục duy nhất một phần trên các suất quản trị), rồi tới một điều kiện tiên quyết trong <code>where</code> của <code>updateMany</code> kèm phép kiểm <code>count === 0</code>, rồi tới một khoá tường minh, và chỉ sau đó mới tới Serializable cộng thử lại. Phương án 2 sai hai lần: PostgreSQL không có dirty read ở bất kỳ mức nào, và <code>READ UNCOMMITTED</code> tuy được chấp nhận nhưng âm thầm hành xử như <code>READ COMMITTED</code>. Phương án 3 đọc sai mã lỗi. Phương án 4 phát biểu đúng cái ngộ nhận mà cả bài học này sinh ra để gỡ: một giao dịch bảo đảm được-tất-cả-hoặc-không-gì, chứ không bảo đảm thứ tự tuần tự.',
          ),
        }),

        // q30 · 7.3 · đáp án 2
        mcq({
          prompt: B(
            'Ten worker processes share one job table and keep picking up the same row. Which change fixes it, and what is the matching caution about advisory locks in a pooled application?',
            'Mười tiến trình worker dùng chung một bảng công việc và cứ nhặt trúng cùng một dòng. Thay đổi nào sửa được, và lời cảnh báo tương ứng về advisory lock trong một ứng dụng dùng pool là gì?',
          ),
          options: [
            B(
              'Move the claim into a <code>SERIALIZABLE</code> transaction; advisory locks are unnecessary once conflicts abort, and the session form is safe because Prisma pins a connection per client',
              'Chuyển phép nhận việc vào một giao dịch <code>SERIALIZABLE</code>; advisory lock là không cần thiết khi xung đột đã bị huỷ, và dạng session an toàn vì Prisma ghim một kết nối cho mỗi client',
            ),
            B(
              'Add <code>@@unique([status, workerId])</code> so only one worker can hold a job; advisory locks should then be taken with <code>pg_advisory_lock</code> outside any transaction so they outlive it',
              'Thêm <code>@@unique([status, workerId])</code> để chỉ một worker giữ được một việc; advisory lock khi đó nên lấy bằng <code>pg_advisory_lock</code> ở ngoài mọi giao dịch để nó sống lâu hơn giao dịch',
            ),
            B(
              'Claim with ' + c('SELECT … FOR UPDATE SKIP LOCKED LIMIT 1') + ' inside a transaction, so a locked row is skipped rather than waited for; and prefer <code>pg_advisory_xact_lock</code> over the session form, because the session form is tied to a connection the pool may not hand you again',
              'Nhận việc bằng ' + c('SELECT … FOR UPDATE SKIP LOCKED LIMIT 1') + ' bên trong một giao dịch, để một dòng đang bị khoá bị BỎ QUA thay vì phải chờ; và hãy ưu tiên <code>pg_advisory_xact_lock</code> hơn dạng session, vì dạng session gắn với một kết nối mà pool có thể không đưa lại cho bạn',
            ),
            B(
              'Use <code>FOR UPDATE NOWAIT</code> so the second worker fails fast and retries; advisory locks are interchangeable between the session and transaction forms',
              'Dùng <code>FOR UPDATE NOWAIT</code> để worker thứ hai hỏng nhanh rồi thử lại; advisory lock thì dạng session và dạng giao dịch dùng thay nhau được',
            ),
          ],
          correct: 2,
          explanation: EX(
            '<code>SKIP LOCKED</code> is the single most useful line in the locking lesson: each worker takes the first row nobody else has locked, so ten workers drain one table with no coordination, no Redis and no external queue — four words of SQL. The neighbouring variants are worth knowing precisely: plain <code>FOR UPDATE</code> waits for the lock; <code>FOR UPDATE NOWAIT</code> fails immediately with PostgreSQL error 55P03; <code>FOR SHARE</code> lets others read-lock but not write. <code>NOWAIT</code> plus retry (option 4) does work, but it converts a solved problem into a retry storm at ten workers. Prisma Client has no <code>FOR UPDATE</code> option, so the claim goes through <code>tx.$queryRaw</code>, and the rest of the job can use ordinary Prisma calls on the same <code>tx</code> — they share the transaction and the connection. The advisory-lock caution is a pool problem: <code>pg_advisory_lock</code> is held until you unlock it <em>or the connection closes</em>, and Prisma may hand your next query a different connection, so the unlock can miss and the lock leaks. <code>pg_advisory_xact_lock</code> releases at <code>COMMIT</code> and cannot leak — which makes option 2\'s advice exactly backwards. One more thing a queue needs before it is finished: a reclaim query that returns jobs stuck in the running state past a deadline, with a bounded <code>attempts</code> so a poisoned job is not retried forever.',
            '<code>SKIP LOCKED</code> là dòng hữu ích nhất trong cả bài học về khoá: mỗi worker lấy dòng đầu tiên chưa ai khoá, nên mười worker rút cạn một bảng mà không cần phối hợp gì, không cần Redis, không cần hàng đợi ngoài — bốn chữ SQL. Các biến thể hàng xóm đáng biết cho chính xác: <code>FOR UPDATE</code> trần thì CHỜ khoá; <code>FOR UPDATE NOWAIT</code> hỏng ngay lập tức với lỗi 55P03 của PostgreSQL; <code>FOR SHARE</code> cho người khác khoá đọc nhưng không cho khoá ghi. <code>NOWAIT</code> cộng thử lại (phương án 4) có chạy được, nhưng nó biến một bài toán đã giải xong thành một cơn bão thử lại khi có mười worker. Prisma Client không có tuỳ chọn <code>FOR UPDATE</code>, nên phép nhận việc đi qua <code>tx.$queryRaw</code>, còn phần còn lại của công việc vẫn dùng lời gọi Prisma bình thường trên cùng cái <code>tx</code> — chúng dùng chung giao dịch và chung kết nối. Lời cảnh báo về advisory lock là một vấn đề của pool: <code>pg_advisory_lock</code> được giữ cho tới khi bạn mở khoá HOẶC KẾT NỐI ĐÓNG, mà Prisma có thể đưa cho truy vấn kế tiếp của bạn một kết nối khác, nên lệnh mở khoá có thể trượt và cái khoá bị rò. <code>pg_advisory_xact_lock</code> tự nhả lúc <code>COMMIT</code> và không rò được — khiến lời khuyên của phương án 2 ngược hoàn toàn. Còn một thứ nữa mà hàng đợi cần trước khi coi là xong: một truy vấn thu hồi những việc kẹt ở trạng thái đang chạy quá hạn, kèm một cột <code>attempts</code> có giới hạn để một việc độc hại không bị thử lại mãi mãi.',
          ),
        }),

        /* ══════════ Chương 8 — Hệ kiểu được sinh ra (4 câu) ══════════ */
        // q31 · 8.1 + 8.2 · đáp án 1
        mcq({
          prompt: B(
            'This file compiles under <code>tsc --strict</code>, and both <code>@ts-expect-error</code> lines are genuinely needed:' +
            code("import { Prisma, User } from '@prisma/client';\n\nconst u: User = await prisma.user.findFirstOrThrow();\n// @ts-expect-error\nu.posts;\n\ntype UserWithPosts = Prisma.UserGetPayload<{ include: { posts: true } }>;\nconst v: UserWithPosts = await prisma.user.findFirstOrThrow({ include: { posts: true } });\nconst n: number = v.posts.length;\n\nconst w = await prisma.user.findFirstOrThrow({ select: { email: true } });\n// @ts-expect-error\nw.name;") +
            'What does this demonstrate about the generated types?',
            'File này biên dịch được với <code>tsc --strict</code>, và cả hai dòng <code>@ts-expect-error</code> đều thật sự cần thiết:' +
            code("import { Prisma, User } from '@prisma/client';\n\nconst u: User = await prisma.user.findFirstOrThrow();\n// @ts-expect-error\nu.posts;\n\ntype UserWithPosts = Prisma.UserGetPayload<{ include: { posts: true } }>;\nconst v: UserWithPosts = await prisma.user.findFirstOrThrow({ include: { posts: true } });\nconst n: number = v.posts.length;\n\nconst w = await prisma.user.findFirstOrThrow({ select: { email: true } });\n// @ts-expect-error\nw.name;") +
            'Đoạn này chứng minh điều gì về các kiểu được sinh ra?',
          ),
          options: [
            B(
              'The model type widens to include relations once any query in the file uses <code>include</code>, which is why <code>v.posts</code> compiles',
              'Kiểu model tự nới ra để bao gồm quan hệ ngay khi có truy vấn nào trong file dùng <code>include</code>, và vì thế <code>v.posts</code> biên dịch được',
            ),
            B(
              'The bare model type <code>User</code> describes the scalar columns and nothing else; the shape a query returns is <em>computed</em> from the arguments, and <code>GetPayload</code> is how you give that computed shape a name',
              'Kiểu model trần <code>User</code> mô tả các cột vô hướng và không mô tả gì thêm; hình dạng một truy vấn trả về được TÍNH RA từ chính các tham số, và <code>GetPayload</code> là cách bạn đặt tên cho cái hình dạng được tính ra ấy',
            ),
            B(
              '<code>select</code> only affects the SQL, not the type; <code>w.name</code> fails because <code>name</code> is nullable and strict mode rejects the access',
              '<code>select</code> chỉ ảnh hưởng tới SQL chứ không ảnh hưởng tới kiểu; <code>w.name</code> hỏng vì <code>name</code> cho phép null và chế độ strict từ chối phép truy cập đó',
            ),
            B(
              '<code>UserGetPayload</code> is a runtime helper that fetches the relation lazily, so the type and the query cannot disagree',
              '<code>UserGetPayload</code> là một hàm trợ giúp lúc chạy, nó nạp quan hệ theo kiểu lười, nên kiểu và truy vấn không thể mâu thuẫn nhau',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Both <code>@ts-expect-error</code> lines firing is the proof: if either access had compiled, <code>tsc</code> would have complained about an unused expect-error. The bare <code>User</code> type is exactly the scalar columns — no relations, because a bare <code>findMany</code> returns no relations — so using <code>User</code> as the parameter type of a function that needs <code>user.posts</code> is a lie the compiler will believe until runtime. And <code>select</code> narrows in the other direction: unselected fields are gone from the type, not merely null. The type of a query is <em>computed</em> from the arguments you passed, which is the whole point of the payload machinery, and <code>Prisma.UserGetPayload&lt;T&gt;</code> is the generic that lets you name that computed shape in a signature. The idiomatic pattern for a reused selection is ' + c('const pick = { … } satisfies Prisma.UserSelect') + ' followed by ' + c('type Card = Prisma.UserGetPayload<{ select: typeof pick }>') + ', and it is security by construction: the selection cannot leak <code>password</code>, because the field is not in it. Option 4 gets the category wrong — <code>GetPayload</code> is a type and vanishes at build time; Prisma has no lazy loading at all.',
            'Việc cả hai dòng <code>@ts-expect-error</code> đều "nổ" chính là bằng chứng: nếu một trong hai phép truy cập biên dịch được thì <code>tsc</code> đã phàn nàn về một expect-error không dùng tới. Kiểu <code>User</code> trần đúng bằng các cột vô hướng — không có quan hệ, vì một <code>findMany</code> trần không trả về quan hệ nào — nên dùng <code>User</code> làm kiểu tham số cho một hàm cần <code>user.posts</code> là một lời nói dối mà trình biên dịch sẽ tin cho tới lúc chạy. Còn <code>select</code> thì thu hẹp theo chiều ngược lại: những trường không được chọn BIẾN MẤT khỏi kiểu chứ không chỉ là null. Kiểu của một truy vấn được TÍNH RA từ chính các tham số bạn truyền vào, và đó là toàn bộ mục đích của bộ máy payload, còn <code>Prisma.UserGetPayload&lt;T&gt;</code> là generic cho phép bạn gọi tên cái hình dạng được tính ra ấy trong một chữ ký hàm. Lối viết chuẩn cho một phép chọn dùng lại nhiều nơi là ' + c('const pick = { … } satisfies Prisma.UserSelect') + ' rồi tới ' + c('type Card = Prisma.UserGetPayload<{ select: typeof pick }>') + ', và nó là an toàn nhờ cấu trúc: phép chọn ấy không thể để lọt <code>password</code>, vì trường đó không có trong nó. Phương án 4 nhầm hẳn phạm trù — <code>GetPayload</code> là một KIỂU và biến mất lúc build; Prisma không hề có lazy loading.',
          ),
        }),

        // q32 · 8.1 + 12.2 · đáp án 3
        mcq({
          prompt: B(
            'An Express error handler is written as ' + c("if ((e as any).code === 'P2002') return res.status(409).json(…)") + '. Separately, two calls were measured: a <code>create</code> passing a string that is not a member of the enum, and a <code>findFirst</code> with <code>select</code> and <code>include</code> at the same level. Both threw ' + c('PrismaClientValidationError') + ' whose <code>code</code> was <code>undefined</code>. What are the two lessons?',
            'Một bộ xử lý lỗi của Express được viết là ' + c("if ((e as any).code === 'P2002') return res.status(409).json(…)") + '. Ở một chỗ khác, hai lời gọi đã được đo: một <code>create</code> truyền vào chuỗi không thuộc enum, và một <code>findFirst</code> có cả <code>select</code> lẫn <code>include</code> ở cùng một tầng. Cả hai đều ném ' + c('PrismaClientValidationError') + ' mà <code>code</code> là <code>undefined</code>. Hai bài học ở đây là gì?',
          ),
          options: [
            B(
              'Casting to <code>any</code> is fine here because every Prisma error object carries a <code>code</code>, and a validation error should also be mapped to 409 for the same reason a duplicate key is: both of them mean the request the client sent could not be satisfied',
              'Ép về <code>any</code> ở đây là ổn vì mọi đối tượng lỗi của Prisma đều mang một <code>code</code>, và lỗi kiểm tra cũng nên ánh xạ thành 409 vì cùng lý do với lỗi trùng khoá: cả hai đều nghĩa là yêu cầu client gửi lên không đáp ứng được',
            ),
            B(
              'The handler is correct as written; the two measured calls never reached it because Prisma validates its arguments synchronously and throws before the promise is created, so they belong in a <code>try</code> around the call rather than in the error middleware',
              'Bộ xử lý viết như thế là đúng; hai lời gọi đã đo kia không bao giờ tới được nó vì Prisma kiểm tham số một cách đồng bộ và ném lỗi trước khi promise được tạo ra, nên chúng thuộc về một khối <code>try</code> quanh lời gọi chứ không thuộc về middleware lỗi',
            ),
            B(
              'A validation error carries the code <code>P2009</code>, so the handler is only half finished: it should test for both codes, keep 409 for the unique violation and return 400 for the validation one, since a malformed argument is a client mistake',
              'Một lỗi kiểm tra mang mã <code>P2009</code>, nên bộ xử lý mới xong một nửa: nó nên kiểm cả hai mã, giữ 409 cho lỗi trùng khoá duy nhất và trả về 400 cho lỗi kiểm tra, vì một tham số sai dạng là lỗi của phía client',
            ),
            B(
              'Narrow with <code>e instanceof Prisma.PrismaClientKnownRequestError</code> before reading <code>e.code</code>, because an unrelated error with a <code>code</code> property (a Node <code>ENOENT</code>, an Axios error) would match the branch — and a validation error has no <code>code</code> at all, so it needs a separate branch and a different status',
              'Hãy thu hẹp bằng <code>e instanceof Prisma.PrismaClientKnownRequestError</code> trước khi đọc <code>e.code</code>, vì một lỗi chẳng liên quan mà có thuộc tính <code>code</code> (một <code>ENOENT</code> của Node, một lỗi của Axios) cũng sẽ lọt vào nhánh đó — còn lỗi kiểm tra thì KHÔNG có <code>code</code> nào cả, nên nó cần một nhánh riêng và một mã trạng thái khác',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Two facts, both measured on Prisma 5.22. First, the error classes are distinct and only one of them carries codes: <code>PrismaClientKnownRequestError</code> has <code>code</code> and <code>meta</code> (P2002 unique, with <code>meta.target</code> naming the columns; P2003 foreign key, with <code>meta.field_name</code>; P2025 not found), while <code>PrismaClientValidationError</code> is thrown for malformed arguments and has no <code>code</code> whatsoever — so option 3 is wrong on the code, and this is a place where the course text says P2009 and the machine disagrees. The other two classes are worth knowing too: <code>PrismaClientInitializationError</code> (bad URL, database unreachable, engine missing for the platform — the class the musl-vs-glibc outage produced) and <code>PrismaClientRustPanicError</code> (the engine crashed; the client must be restarted). Second, the narrowing matters: <code>(e as any).code</code> throws away the type and any error object with a <code>code</code> property matches, so a filesystem failure inside your handler can return a cheerful 409 to a confused user. Option 1 also mis-maps the status: a validation error means your <em>code</em> built a bad query, so it is a 500, not a 409. Option 2 misunderstands where these are thrown; they reject the promise like any other Prisma error.',
            'Hai dữ kiện, cả hai đều đo trên Prisma 5.22. Một, các lớp lỗi là khác nhau và chỉ một trong số đó mang mã: <code>PrismaClientKnownRequestError</code> có <code>code</code> và <code>meta</code> (P2002 trùng khoá duy nhất, với <code>meta.target</code> gọi tên các cột; P2003 khoá ngoại, với <code>meta.field_name</code>; P2025 không tìm thấy), còn <code>PrismaClientValidationError</code> được ném cho tham số sai dạng và KHÔNG hề có <code>code</code> — nên phương án 3 sai ở phần mã lỗi, và đây là một chỗ mà giáo trình nói P2009 còn cái máy thì không đồng ý. Hai lớp còn lại cũng đáng biết: <code>PrismaClientInitializationError</code> (URL sai, không với tới cơ sở dữ liệu, thiếu engine cho nền tảng — chính lớp lỗi mà sự cố musl-với-glibc sinh ra) và <code>PrismaClientRustPanicError</code> (engine sập; phải khởi động lại client). Hai, việc thu hẹp kiểu là quan trọng: <code>(e as any).code</code> vứt bỏ kiểu đi và bất cứ đối tượng lỗi nào có thuộc tính <code>code</code> cũng khớp, nên một cú hỏng hệ thống tệp bên trong handler của bạn có thể trả về một mã 409 vui vẻ cho một người dùng đang ngơ ngác. Phương án 1 còn ánh xạ sai mã trạng thái: một lỗi kiểm tra nghĩa là MÃ CỦA BẠN dựng ra một truy vấn hỏng, nên đó là 500 chứ không phải 409. Phương án 2 hiểu sai chỗ chúng được ném ra; chúng làm promise bị reject y như mọi lỗi Prisma khác.',
          ),
        }),

        // q33 · 8.2 · đáp án 0
        mcq({
          prompt: B(
            'A selection object is shared by three queries and its shape is needed as a type. Two versions are written:' +
            code("const pickA: Prisma.PostSelect  = { id: true, title: true };\nconst pickB = { id: true, title: true } satisfies Prisma.PostSelect;\n\ntype A = Prisma.PostGetPayload<{ select: typeof pickA }>;\ntype B = Prisma.PostGetPayload<{ select: typeof pickB }>;") +
            'Why is only one of them useful?',
            'Một đối tượng chọn cột được ba truy vấn dùng chung và cần lấy hình dạng của nó ra làm một kiểu. Hai phiên bản được viết:' +
            code("const pickA: Prisma.PostSelect  = { id: true, title: true };\nconst pickB = { id: true, title: true } satisfies Prisma.PostSelect;\n\ntype A = Prisma.PostGetPayload<{ select: typeof pickA }>;\ntype B = Prisma.PostGetPayload<{ select: typeof pickB }>;") +
            'Vì sao chỉ một trong hai là hữu ích?',
          ),
          options: [
            B(
              'The annotation widens the value to the whole <code>PostSelect</code> type, so <code>typeof pickA</code> no longer knows which fields were chosen; <code>satisfies</code> checks it against <code>PostSelect</code> while keeping the literal shape, which is exactly what <code>GetPayload</code> needs',
              'Phép chú thích kiểu NỚI giá trị ra thành cả kiểu <code>PostSelect</code>, nên <code>typeof pickA</code> không còn biết những trường nào đã được chọn; <code>satisfies</code> thì kiểm nó với <code>PostSelect</code> mà vẫn giữ nguyên hình dạng chữ nghĩa, đúng thứ <code>GetPayload</code> cần',
            ),
            B(
              '<code>satisfies</code> makes the object literal readonly and therefore a valid type argument, while an annotated object stays mutable and <code>GetPayload</code> rejects a mutable argument',
              '<code>satisfies</code> làm cho đối tượng thành chỉ đọc và nhờ vậy mới hợp lệ làm tham số kiểu, trong khi một đối tượng có chú thích kiểu thì vẫn thay đổi được và <code>GetPayload</code> từ chối một tham số thay đổi được',
            ),
            B(
              'The annotated version fails to compile at all, because <code>Prisma.PostSelect</code> is an exhaustive type that requires every field of the model to be listed with an explicit <code>true</code> or <code>false</code>',
              'Bản có chú thích kiểu hoàn toàn không biên dịch được, vì <code>Prisma.PostSelect</code> là một kiểu vét cạn đòi phải liệt kê mọi trường của model kèm một giá trị <code>true</code> hoặc <code>false</code> tường minh',
            ),
            B(
              'They are equivalent as far as the computed type goes; <code>satisfies</code> is only a style preference that spread through Prisma code after <code>Prisma.validator</code> was deprecated in favour of it',
              'Xét về kiểu được tính ra thì chúng tương đương; <code>satisfies</code> chỉ là một sở thích phong cách lan ra trong mã Prisma sau khi <code>Prisma.validator</code> bị khai tử để nhường chỗ cho nó',
            ),
          ],
          correct: 0,
          explanation: EX(
            'This is a TypeScript fact with a very practical Prisma consequence. A type annotation is a <em>declaration</em>: it tells the compiler to treat the value as a <code>Prisma.PostSelect</code>, and <code>typeof pickA</code> is therefore <code>Prisma.PostSelect</code> — every field optional, no information about which ones you actually wrote. Feed that to <code>GetPayload</code> and you get a shape where everything might or might not be there, which is useless. <code>satisfies</code> is a <em>check</em>: the compiler verifies the literal is assignable to <code>PostSelect</code> and then leaves the literal type alone, so <code>typeof pickB</code> still says <code>{ id: true; title: true }</code> and <code>GetPayload</code> can compute ' + c('{ id: number; title: string }') + '. The older way to get the same effect is <code>Prisma.validator&lt;Prisma.PostDefaultArgs&gt;()({ select: … })</code> — the odd empty first call exists so TypeScript can infer the literal after the explicit type argument — and it is still worth using when you want <code>where</code> and <code>orderBy</code> bundled with the selection and spread into the query. It is not deprecated, so option 4 is wrong twice. Options 2 and 3 invent behaviour. The lightest option of all, when a selection is used once, is to skip the named object entirely: ' + c('type Card = Awaited<ReturnType<typeof getCard>>[number]') + '.',
            'Đây là một dữ kiện của TypeScript kèm một hệ quả rất thực dụng cho Prisma. Chú thích kiểu là một lời KHAI BÁO: nó bảo trình biên dịch hãy coi giá trị đó là một <code>Prisma.PostSelect</code>, và vì thế <code>typeof pickA</code> chính là <code>Prisma.PostSelect</code> — mọi trường đều tuỳ chọn, không còn thông tin nào về việc bạn thật sự viết ra những trường nào. Đưa cái đó cho <code>GetPayload</code> thì bạn nhận về một hình dạng mà thứ gì cũng có-thể-có-thể-không, tức là vô dụng. <code>satisfies</code> là một phép KIỂM: trình biên dịch xác nhận đối tượng chữ nghĩa ấy gán được vào <code>PostSelect</code> rồi để nguyên kiểu chữ nghĩa của nó, nên <code>typeof pickB</code> vẫn nói <code>{ id: true; title: true }</code> và <code>GetPayload</code> tính ra được ' + c('{ id: number; title: string }') + '. Cách cũ để đạt cùng hiệu quả là <code>Prisma.validator&lt;Prisma.PostDefaultArgs&gt;()({ select: … })</code> — lời gọi rỗng kỳ quặc ở giữa tồn tại để TypeScript suy ra được kiểu chữ nghĩa sau tham số kiểu tường minh — và nó vẫn đáng dùng khi bạn muốn gói cả <code>where</code> và <code>orderBy</code> chung với phép chọn rồi rải vào truy vấn. Nó chưa hề bị bỏ, nên phương án 4 sai hai lần. Phương án 2 và 3 bịa ra hành vi. Lựa chọn nhẹ nhất trong tất cả, khi một phép chọn chỉ dùng một lần, là bỏ hẳn đối tượng đặt tên đi: ' + c('type Card = Awaited<ReturnType<typeof getCard>>[number]') + '.',
          ),
        }),

        // q34 · 8.4 + 10.5 · đáp án 2
        mcq({
          prompt: B(
            'A team adds a computed field with a client extension:' +
            code("const client = prismaGoc.$extends({\n  result: { user: { tenHienThi: { needs: {}, compute: (u) => `${u.name} <${u.email}>` } } },\n});\n\nawait client.user.findFirst({ select: { id: true, tenHienThi: true } });\n// --> { id: 2, tenHienThi: 'undefined <undefined>' }") +
            'What is wrong, and what else does the extension mechanism not give you?',
            'Một nhóm thêm trường tính sẵn bằng client extension:' +
            code("const client = prismaGoc.$extends({\n  result: { user: { tenHienThi: { needs: {}, compute: (u) => `${u.name} <${u.email}>` } } },\n});\n\nawait client.user.findFirst({ select: { id: true, tenHienThi: true } });\n// --> { id: 2, tenHienThi: 'undefined <undefined>' }") +
            'Sai chỗ nào, và cơ chế extension còn KHÔNG cho bạn thứ gì nữa?',
          ),
          options: [
            B(
              '<code>compute</code> must be async so the columns have arrived; and the extension also fails to apply to <code>findMany</code> unless you list every operation',
              '<code>compute</code> phải là async để các cột kịp về; và extension này cũng không áp được vào <code>findMany</code> trừ khi bạn liệt kê mọi thao tác',
            ),
            B(
              '<code>$extends</code> mutates the client in place, so <code>prismaGoc</code> must be used for the query; and computed fields are unavailable in <code>select</code>',
              '<code>$extends</code> sửa client tại chỗ, nên phải dùng <code>prismaGoc</code> để truy vấn; và trường tính sẵn thì không dùng được trong <code>select</code>',
            ),
            B(
              '<code>needs</code> is empty, so Prisma never added <code>name</code> and <code>email</code> to the <code>SELECT</code> and <code>compute</code> received undefined; and because the field is computed in JavaScript after the rows arrive, it can never appear in <code>where</code>, <code>orderBy</code> or <code>groupBy</code>',
              '<code>needs</code> để rỗng, nên Prisma không hề thêm <code>name</code> và <code>email</code> vào câu <code>SELECT</code> và <code>compute</code> nhận về undefined; và vì trường này được tính bằng JavaScript SAU khi các dòng đã về, nó không bao giờ xuất hiện được trong <code>where</code>, <code>orderBy</code> hay <code>groupBy</code>',
            ),
            B(
              'A <code>result</code> extension cannot be combined with <code>select</code> at all; use <code>include</code>, and note that computed fields are also invisible to <code>$queryRaw</code>',
              'Một extension kiểu <code>result</code> không kết hợp được với <code>select</code>; hãy dùng <code>include</code>, và cũng lưu ý rằng trường tính sẵn thì <code>$queryRaw</code> không thấy',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Measured: with <code>needs: {}</code> the computed field really does come back as the string <code>\'undefined &lt;undefined&gt;\'</code> — no error, just a plausible-looking wrong value in your API response. <code>needs</code> is a declaration of dependencies, and it is what makes Prisma add those columns to the <code>SELECT</code> even when your <code>select</code> did not ask for them (and then remove them again from the result). Fill it in — ' + c('needs: { name: true, email: true }') + ' — and the same query returns <code>Binh &lt;b@x.com&gt;</code>, which is exactly what the measurement showed. The second half is the structural limit: <code>compute</code> runs in JavaScript after the rows arrive, so a computed field cannot be filtered, sorted or grouped by; that would need a generated column in the database. Three more limits are worth carrying: extensions cannot add a field to the database, and the <code>query</code> component never intercepts <code>$queryRaw</code> or <code>$executeRaw</code> — which is why a soft-delete extension is a safety net rather than a security boundary, and why a tenant filter written as one leaks through raw SQL, through relations reached inside an <code>include</code> on a different model, and through database-level <code>onDelete: Cascade</code>. Option 2 gets the most important mechanical fact backwards: <code>$extends</code> returns a <em>new</em> client and leaves the original untouched, which is measurable and is also why calling it without assigning the result is a silent no-op.',
            'Đo thật: với <code>needs: {}</code> thì trường tính sẵn thật sự trở về là chuỗi <code>\'undefined &lt;undefined&gt;\'</code> — không lỗi, chỉ là một giá trị sai trông rất hợp lý nằm trong phản hồi API của bạn. <code>needs</code> là một lời khai báo phụ thuộc, và nó là thứ khiến Prisma thêm những cột đó vào câu <code>SELECT</code> ngay cả khi <code>select</code> của bạn không hỏi tới (rồi lại gỡ chúng ra khỏi kết quả). Điền nó vào — ' + c('needs: { name: true, email: true }') + ' — và cũng truy vấn ấy trả về <code>Binh &lt;b@x.com&gt;</code>, đúng như phép đo cho thấy. Nửa sau là giới hạn về cấu trúc: <code>compute</code> chạy bằng JavaScript sau khi các dòng đã về, nên một trường tính sẵn không lọc được, không sắp xếp được, không gom nhóm được; muốn thế thì cần một cột generated trong cơ sở dữ liệu. Ba giới hạn nữa đáng mang theo: extension không thêm được một trường vào cơ sở dữ liệu, và thành phần <code>query</code> không bao giờ chặn được <code>$queryRaw</code> hay <code>$executeRaw</code> — và vì thế một extension xoá mềm là một tấm lưới đỡ chứ không phải một ranh giới an ninh, và vì thế một bộ lọc theo tenant viết bằng cách đó sẽ rò qua SQL thô, qua các quan hệ với tới được bên trong một <code>include</code> trên model khác, và qua <code>onDelete: Cascade</code> ở tầng cơ sở dữ liệu. Phương án 2 hiểu ngược đúng cái dữ kiện cơ học quan trọng nhất: <code>$extends</code> trả về một client MỚI và để nguyên cái cũ, điều này đo được, và cũng vì thế mà gọi nó rồi không gán kết quả là một lệnh vô tác dụng trong im lặng.',
          ),
        }),

        /* ══════════════ Chương 9 — Hiệu năng (4 câu) ══════════════ */
        // q35 · 9.1 · đáp án 1
        mcq({
          prompt: B(
            'One page was profiled with <code>$on(\'query\')</code>, and the statements were normalised and grouped:' +
            code('shape                                 | count | total ms | max ms\n--------------------------------------+-------+----------+-------\nSELECT ... FROM "users" WHERE id = ?  |    41 |      402 |     14\nSELECT ... FROM "posts" WHERE pub = ? |     1 |      311 |    311\nSELECT ... FROM "comments" WHERE ...  |     1 |       61 |     61\nSELECT COUNT(*) FROM "posts"          |     1 |       38 |     38') +
            'Where should the work start?',
            'Một trang được đo bằng <code>$on(\'query\')</code>, các câu lệnh được chuẩn hoá rồi gom nhóm:' +
            code('shape                                 | count | total ms | max ms\n--------------------------------------+-------+----------+-------\nSELECT ... FROM "users" WHERE id = ?  |    41 |      402 |     14\nSELECT ... FROM "posts" WHERE pub = ? |     1 |      311 |    311\nSELECT ... FROM "comments" WHERE ...  |     1 |       61 |     61\nSELECT COUNT(*) FROM "posts"          |     1 |       38 |     38') +
            'Nên bắt đầu làm từ đâu?',
          ),
          options: [
            B(
              'With the 311 ms statement, because the slowest single query is always the bottleneck and an index there is the cheapest possible change',
              'Với câu lệnh 311 ms, vì truy vấn đơn chậm nhất luôn là nút thắt cổ chai và một chỉ mục ở đó là thay đổi rẻ nhất có thể',
            ),
            B(
              'With the row of 41 calls: rank by <em>total</em> time, not by max, and a shape that repeats per row is a loop in the code — no index will remove it, only <code>include</code> or <code>_count</code> will',
              'Với dòng 41 lời gọi: xếp hạng theo TỔNG thời gian chứ không theo max, và một hình dạng lặp lại theo từng dòng là một vòng lặp trong mã — không chỉ mục nào gỡ được nó, chỉ có <code>include</code> hay <code>_count</code> mới gỡ được',
            ),
            B(
              'With the <code>COUNT(*)</code>, because on a large table it is a full scan and therefore the most expensive line even though it reports 38 ms',
              'Với câu <code>COUNT(*)</code>, vì trên một bảng lớn nó là một lượt quét toàn bộ và do đó là dòng đắt nhất dù nó báo 38 ms',
            ),
            B(
              'Nowhere yet — 812 ms total is acceptable; profile the frontend first and return to the database only if the API is more than half the page time',
              'Chưa ở đâu cả — tổng 812 ms là chấp nhận được; hãy đo frontend trước rồi chỉ quay lại cơ sở dữ liệu nếu API chiếm quá nửa thời gian của trang',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The finding in that table is not the 812 ms; it is the number <b>41</b>. A shape that repeats once per row of a previous result is a loop across a network, and forty-one four-millisecond queries do more total damage than one three-hundred-millisecond query — that is why you rank by total, not by max. It is also the one line an index cannot help: the fix is to stop asking forty-one times, by adding <code>include: { author: true }</code> (two statements) or <code>_count</code> (one). The course\'s own worked example is instructive about order: they indexed the 311 ms query first, it dropped to 4 ms, and the page went from 812 ms to 505 ms — still slow, because the remaining 402 ms was the loop nobody had touched. Ranking comes before the plan. Option 3 is a real fact used as a wrong conclusion: <code>COUNT(*)</code> on a big PostgreSQL table genuinely is a full scan, but 38 ms is 38 ms and it is the smallest line here. Option 4 dodges a measurement you already have; the useful thresholds to remember are under ten queries per page, and the ratio of rows read to rows returned.',
            'Phát hiện trong bảng đó không phải con số 812 ms; nó là con số <b>41</b>. Một hình dạng lặp lại một lần cho mỗi dòng của kết quả trước đó là một vòng lặp bắc qua mạng, và bốn mươi mốt truy vấn bốn mili giây gây tổng thiệt hại lớn hơn một truy vấn ba trăm mili giây — vì thế mới xếp hạng theo TỔNG chứ không theo max. Nó cũng là dòng duy nhất mà chỉ mục không giúp được: cách sửa là thôi đừng hỏi bốn mươi mốt lần nữa, bằng cách thêm <code>include: { author: true }</code> (hai câu lệnh) hoặc <code>_count</code> (một câu). Chính ví dụ chạy tay của giáo trình rất có tính giáo huấn về thứ tự: họ đánh chỉ mục cho truy vấn 311 ms trước, nó tụt xuống 4 ms, và trang đi từ 812 ms xuống 505 ms — vẫn chậm, vì 402 ms còn lại chính là cái vòng lặp chưa ai đụng tới. Xếp hạng đi trước kế hoạch. Phương án 3 là một dữ kiện có thật bị dùng để rút ra kết luận sai: <code>COUNT(*)</code> trên một bảng PostgreSQL lớn đúng là một lượt quét toàn bộ, nhưng 38 ms vẫn là 38 ms và nó là dòng nhỏ nhất ở đây. Phương án 4 né tránh một phép đo bạn vốn đã có; các ngưỡng hữu ích đáng nhớ là dưới mười truy vấn cho một trang, và tỉ lệ giữa số dòng đọc lên với số dòng trả về.',
          ),
        }),

        // q36 · 9.2 · đáp án 3
        mcq({
          prompt: B(
            'The same call was logged under both loading strategies:' +
            code("// relationLoadStrategy: 'query'\nSELECT \"User\".\"id\", ... FROM \"public\".\"User\" WHERE 1=1 OFFSET $1\nSELECT \"Post\".\"id\", ... FROM \"public\".\"Post\" WHERE \"Post\".\"authorId\" IN ($1,$2) OFFSET $3\n\n// relationLoadStrategy: 'join'\nSELECT \"t1\".\"id\", ..., \"User_posts\".\"__prisma_data__\" AS \"posts\"\nFROM \"public\".\"User\" AS \"t1\"\nLEFT JOIN LATERAL (SELECT COALESCE(JSONB_AGG(...)) ...) AS \"User_posts\" ON true") +
            'Which conclusion is supported?',
            'Cùng một lời gọi được ghi log dưới cả hai chiến lược nạp:' +
            code("// relationLoadStrategy: 'query'\nSELECT \"User\".\"id\", ... FROM \"public\".\"User\" WHERE 1=1 OFFSET $1\nSELECT \"Post\".\"id\", ... FROM \"public\".\"Post\" WHERE \"Post\".\"authorId\" IN ($1,$2) OFFSET $3\n\n// relationLoadStrategy: 'join'\nSELECT \"t1\".\"id\", ..., \"User_posts\".\"__prisma_data__\" AS \"posts\"\nFROM \"public\".\"User\" AS \"t1\"\nLEFT JOIN LATERAL (SELECT COALESCE(JSONB_AGG(...)) ...) AS \"User_posts\" ON true") +
            'Kết luận nào được chứng thực?',
          ),
          options: [
            B(
              '<code>query</code> is the N+1 strategy and <code>join</code> is the fix; a codebase should set <code>join</code> globally and stop thinking about it',
              '<code>query</code> là chiến lược gây N+1 còn <code>join</code> là cách chữa; một kho mã nên đặt <code>join</code> toàn cục rồi thôi khỏi nghĩ nữa',
            ),
            B(
              'The two produce different results: <code>join</code> drops parents with no children because <code>LATERAL</code> is an inner join',
              'Hai cái cho kết quả khác nhau: <code>join</code> làm rơi mất các dòng cha không có con vì <code>LATERAL</code> là một inner join',
            ),
            B(
              '<code>query</code> issues one statement per parent row, which is why the second line has an <code>IN</code> list',
              '<code>query</code> phát ra một câu lệnh cho MỖI dòng cha, và vì thế dòng thứ hai mới có danh sách <code>IN</code>',
            ),
            B(
              '<code>query</code> is two statements batched with an <code>IN</code> list and stitched in the engine; <code>join</code> is one statement stitched by PostgreSQL — and <code>join</code> is not universally better, because a wide parent row is repeated across the joined rows',
              '<code>query</code> là hai câu lệnh gom bằng danh sách <code>IN</code> rồi khâu lại trong engine; <code>join</code> là một câu lệnh do PostgreSQL khâu — và <code>join</code> không phải lúc nào cũng tốt hơn, vì một dòng cha lớn bị lặp lại trên các dòng đã nối',
            ),
          ],
          correct: 3,
          explanation: EX(
            'Both transcripts are real. The default <code>query</code> strategy sends one statement per relation <em>level</em>, not per row — the <code>IN ($1,$2)</code> is the batching, which is the dataloader pattern built in, and it is why Prisma\'s classic N+1 cannot happen by accident. The <code>join</code> strategy (unlocked by the <code>relationJoins</code> preview feature) collapses the levels into a single <code>LEFT JOIN LATERAL</code> with <code>JSONB_AGG</code>, so PostgreSQL does the stitching. On a narrow parent, <code>join</code> wins — the course measures 31 ms against 19 ms. On a <em>wide</em> parent it loses badly: with a 6 KB body and three levels the same measurement is 48 ms for <code>query</code> against 213 ms for <code>join</code>, because the parent row is repeated once per joined child. That is why option 1 is wrong in its second half: this is a per-query argument, and setting one strategy globally is choosing wrongly for half your queries. Option 2 is wrong — <code>LEFT JOIN LATERAL … ON true</code> with a <code>COALESCE</code> keeps childless parents, with an empty array. Option 3 misreads the <code>IN</code> list, which is precisely the evidence that batching happened. And note what neither strategy fixes: a <code>for</code> loop in your own code calling <code>findMany</code> per user is still forty-one statements, because it never reached the relation loader at all.',
            'Cả hai đoạn ghi lại đều là thật. Chiến lược <code>query</code> mặc định gửi một câu lệnh cho mỗi TẦNG quan hệ, không phải cho mỗi dòng — cái <code>IN ($1,$2)</code> chính là phép gom lô, tức là mẫu dataloader dựng sẵn, và đó là lý do N+1 kinh điển không thể vô tình xảy ra với Prisma. Chiến lược <code>join</code> (mở khoá bằng preview feature <code>relationJoins</code>) gộp các tầng thành một <code>LEFT JOIN LATERAL</code> duy nhất kèm <code>JSONB_AGG</code>, để PostgreSQL làm việc khâu vá. Trên một dòng cha hẹp thì <code>join</code> thắng — giáo trình đo được 31 ms so với 19 ms. Trên một dòng cha RỘNG thì nó thua đậm: với phần thân 6 KB và ba tầng, cũng phép đo ấy cho 48 ms với <code>query</code> so với 213 ms với <code>join</code>, vì dòng cha bị lặp lại một lần cho mỗi dòng con được nối. Vì thế phương án 1 sai ở nửa sau: đây là một tham số THEO TỪNG TRUY VẤN, và đặt một chiến lược toàn cục là chọn sai cho một nửa số truy vấn của bạn. Phương án 2 sai — <code>LEFT JOIN LATERAL … ON true</code> kèm <code>COALESCE</code> vẫn giữ các dòng cha không con, với một mảng rỗng. Phương án 3 đọc sai danh sách <code>IN</code>, vốn chính là bằng chứng rằng phép gom lô đã xảy ra. Và hãy để ý thứ mà cả hai chiến lược đều KHÔNG sửa: một vòng <code>for</code> trong mã của chính bạn gọi <code>findMany</code> cho từng người dùng thì vẫn là bốn mươi mốt câu lệnh, vì nó chưa hề đi tới bộ nạp quan hệ.',
          ),
        }),

        // q37 · 9.3 + 2.3 · đáp án 0
        mcq({
          prompt: B(
            'A schema declares ' + c('@id') + ' on <code>id</code>, ' + c('@unique') + ' on <code>email</code>, and a required relation ' + c('author User @relation(fields: [authorId], references: [id])') + '. Which indexes exist in PostgreSQL after the migration, and what follows?',
            'Một lược đồ khai ' + c('@id') + ' trên <code>id</code>, ' + c('@unique') + ' trên <code>email</code>, và một quan hệ bắt buộc ' + c('author User @relation(fields: [authorId], references: [id])') + '. Sau migration thì PostgreSQL có những chỉ mục nào, và hệ quả là gì?',
          ),
          options: [
            B(
              'Only the primary key and the unique index exist; the referencing column <code>authorId</code> is not indexed by PostgreSQL or by Prisma, so it needs an explicit <code>@@index([authorId])</code> — and until it has one, deletes of a parent are slow too',
              'Chỉ có chỉ mục khoá chính và chỉ mục duy nhất; cột tham chiếu <code>authorId</code> không được PostgreSQL lẫn Prisma đánh chỉ mục, nên nó cần một <code>@@index([authorId])</code> tường minh — và khi chưa có, phép xoá một dòng cha cũng chậm theo',
            ),
            B(
              'All three are indexed: PostgreSQL creates an index for every foreign key constraint so the constraint can be checked efficiently',
              'Cả ba đều có chỉ mục: PostgreSQL tạo một chỉ mục cho mỗi ràng buộc khoá ngoại để kiểm ràng buộc cho hiệu quả',
            ),
            B(
              'All three are indexed: Prisma adds <code>@@index</code> for relation scalars automatically when it generates the migration',
              'Cả ba đều có chỉ mục: Prisma tự thêm <code>@@index</code> cho các trường vô hướng quan hệ khi nó sinh migration',
            ),
            B(
              'Only the primary key exists as an index; a <code>@unique</code> is a constraint checked by a trigger and needs <code>@@index([email])</code> as well',
              'Chỉ có khoá chính là chỉ mục; <code>@unique</code> là một ràng buộc được kiểm bằng trigger nên cũng cần thêm <code>@@index([email])</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'PostgreSQL indexes the primary key and every unique constraint automatically — a <code>@unique</code> is backed by a real B-tree, so adding <code>@@index([email])</code> as well is duplicated work and wasted disk, which is what option 4 gets wrong. What neither PostgreSQL nor Prisma does is index the <em>referencing</em> side of a foreign key. This is the single most repeated claim in the course, appearing in three separate chapters, and it is the most common reason a Prisma application that felt fine at ten thousand rows gets slow at a hundred thousand. The cost shows up in two places, and people usually only expect the first: every query that filters or joins by <code>authorId</code> scans, and every <em>delete</em> of a parent row scans the child table too, because the constraint check has to prove no children remain. The measured contrast in the course is stark — the same query at 184 ms without and 0.118 ms with the right composite index. This is also the one exception to the rule "add indexes when a query is measured, not when a model is written": a relation scalar is predictable enough to index up front. Two related facts worth carrying: <code>relationMode = "prisma"</code> removes the constraints entirely, so the database stops auto-indexing anything on that side and every relation scalar needs an explicit index; and you can find the missing ones with a query over <code>pg_constraint</code> joined against <code>pg_index</code>.',
            'PostgreSQL tự đánh chỉ mục cho khoá chính và mọi ràng buộc duy nhất — một <code>@unique</code> được chống lưng bởi một B-tree thật, nên thêm cả <code>@@index([email])</code> là làm trùng việc và phí đĩa, đó là chỗ phương án 4 sai. Thứ mà cả PostgreSQL lẫn Prisma đều KHÔNG làm là đánh chỉ mục cho phía THAM CHIẾU của một khoá ngoại. Đây là khẳng định được lặp lại nhiều nhất trong cả khoá học, xuất hiện ở ba chương khác nhau, và nó là lý do phổ biến nhất khiến một ứng dụng Prisma thấy ổn ở mười nghìn dòng lại chậm đi ở một trăm nghìn. Cái giá lộ ra ở hai chỗ, mà người ta thường chỉ lường trước chỗ đầu: mọi truy vấn lọc hay nối theo <code>authorId</code> đều phải quét, và mọi phép XOÁ một dòng cha cũng quét luôn bảng con, vì phép kiểm ràng buộc phải chứng minh không còn dòng con nào. Phép đo tương phản trong giáo trình rất gắt — cùng một truy vấn, 184 ms khi không có và 0,118 ms khi có đúng chỉ mục ghép. Đây cũng là ngoại lệ duy nhất của quy tắc "thêm chỉ mục khi đã đo một truy vấn, không phải khi vừa viết một model": một trường vô hướng quan hệ thì đủ dự đoán được để đánh chỉ mục ngay từ đầu. Hai dữ kiện liên quan đáng mang theo: <code>relationMode = "prisma"</code> gỡ bỏ hoàn toàn các ràng buộc, nên cơ sở dữ liệu thôi tự đánh chỉ mục bất cứ thứ gì ở phía đó và mọi trường vô hướng quan hệ đều cần một chỉ mục tường minh; và bạn tìm ra những cái còn thiếu bằng một truy vấn trên <code>pg_constraint</code> nối với <code>pg_index</code>.',
          ),
        }),

        // q38 · 9.4 · đáp án 2
        mcq({
          prompt: B(
            'Six backend containers run with <code>--cpus=2</code> each on a 16-core host, against a PostgreSQL with <code>max_connections = 100</code>. No <code>connection_limit</code> is set. Deploys start failing with <code>FATAL: sorry, too many clients already</code>, and the application logs are full of ' + c("code: 'P2024'") + '. What is the arithmetic, and what is the fix?',
            'Sáu container backend chạy với <code>--cpus=2</code> mỗi cái trên một máy chủ 16 nhân, nối tới một PostgreSQL có <code>max_connections = 100</code>. Không đặt <code>connection_limit</code>. Các lần deploy bắt đầu hỏng với <code>FATAL: sorry, too many clients already</code>, còn log ứng dụng thì đầy ' + c("code: 'P2024'") + '. Phép tính ở đây là gì, và cách sửa là gì?',
          ),
          options: [
            B(
              'Each pool is sized to the container quota, so 2 × 2 + 1 = 5 per container and 30 in total; the failure must come from something else and <code>pool_timeout</code> should be raised',
              'Mỗi pool được định cỡ theo hạn ngạch của container, tức 2 × 2 + 1 = 5 cho mỗi container và tổng là 30; cú hỏng hẳn đến từ chỗ khác và nên nâng <code>pool_timeout</code>',
            ),
            B(
              'Prisma opens one connection per query and returns it, so the pool size is irrelevant; raise <code>max_connections</code> to 500',
              'Prisma mở một kết nối cho mỗi truy vấn rồi trả lại, nên kích thước pool không liên quan; hãy nâng <code>max_connections</code> lên 500',
            ),
            B(
              'A CPU quota does not change what <code>os.cpus()</code> reports, so each pool defaults to 16 × 2 + 1 = 33 and six containers want 198 connections; set <code>connection_limit</code> explicitly, from (100 − reserved − headroom) ÷ containers',
              'Hạn ngạch CPU không làm đổi thứ <code>os.cpus()</code> báo cáo, nên mỗi pool mặc định là 16 × 2 + 1 = 33 và sáu container muốn 198 kết nối; hãy đặt <code>connection_limit</code> tường minh, tính từ (100 − dành riêng − dự phòng) ÷ số container',
            ),
            B(
              'P2024 always means the pool is too small; double <code>connection_limit</code> on every container and the <code>FATAL</code> will clear once queries stop queueing',
              'P2024 luôn nghĩa là pool quá nhỏ; hãy nhân đôi <code>connection_limit</code> trên mọi container và lỗi <code>FATAL</code> sẽ hết khi các truy vấn thôi xếp hàng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Prisma\'s default pool size is <code>num_cpus * 2 + 1</code>, and the trap is that a CPU quota is enforced by the scheduler — it does not virtualise <code>/proc/cpuinfo</code>. A container limited to two cores on a sixteen-core host still reports sixteen, so each pool defaults to 33 and six containers want 198 connections against a ceiling of 100. Hence both symptoms at once: the database refuses new clients, and the containers that did connect queue for a free connection until <code>pool_timeout</code> (10 s by default) fires with P2024. The fix is arithmetic, not a bigger number: subtract <code>superuser_reserved_connections</code> and roughly ten for psql, monitoring, migrations and cron, then divide by the number of containers and round down — about 12 here. Bigger is not better, and the course measured it: on an 8-core database with 200 concurrent clients, <code>connection_limit=10</code> gave 4,120 req/s while <code>=200</code> gave 2,914 req/s and a p99 seven times worse. Option 4 is the reflex the diagnosis chapter names as one of the four things not to do — raising <code>pool_timeout</code> converts fast failures into slow ones and pushes the queue further up the stack. And when P2024 appears with <code>pg_stat_activity</code> showing many connections stuck in <code>idle in transaction</code>, it is never a pool-size problem: it is a transaction doing an HTTP call.',
            'Kích thước pool mặc định của Prisma là <code>num_cpus * 2 + 1</code>, và cái bẫy nằm ở chỗ hạn ngạch CPU do bộ lập lịch cưỡng chế — nó không ảo hoá <code>/proc/cpuinfo</code>. Một container bị giới hạn hai nhân trên máy chủ mười sáu nhân vẫn báo cáo mười sáu, nên mỗi pool mặc định là 33 và sáu container muốn 198 kết nối trên một trần 100. Vì thế hai triệu chứng xuất hiện cùng lúc: cơ sở dữ liệu từ chối client mới, còn những container đã nối được thì xếp hàng chờ một kết nối rảnh cho tới khi <code>pool_timeout</code> (mặc định 10 giây) nổ ra P2024. Cách sửa là một phép tính chứ không phải một con số to hơn: trừ đi <code>superuser_reserved_connections</code> và khoảng mười cho psql, giám sát, migration và cron, rồi chia cho số container và làm tròn xuống — khoảng 12 ở đây. To hơn không có nghĩa là tốt hơn, và giáo trình đã đo: trên một cơ sở dữ liệu 8 nhân với 200 client đồng thời, <code>connection_limit=10</code> cho 4.120 req/s trong khi <code>=200</code> cho 2.914 req/s và p99 tệ hơn bảy lần. Phương án 4 là phản xạ mà chương chẩn đoán liệt vào bốn thứ không được làm — nâng <code>pool_timeout</code> biến những cú hỏng nhanh thành những cú hỏng chậm và đẩy hàng đợi lên cao hơn trong ngăn xếp. Và khi P2024 xuất hiện cùng lúc với <code>pg_stat_activity</code> cho thấy nhiều kết nối kẹt ở <code>idle in transaction</code> thì đó không bao giờ là vấn đề kích thước pool: đó là một giao dịch đang gọi HTTP.',
          ),
        }),

        /* ══════════ Chương 10 — Cửa thoát hiểm: SQL thô (4 câu) ══════════ */
        // q39 · 10.1 · đáp án 1
        mcq({
          prompt: B(
            'Two versions of the same lookup were run against a table of 3 posts, with the request parameter set to ' + c("x' OR 1=1 --") + ':' +
            code('await prisma.$queryRaw`SELECT count(*)::int AS n FROM "Post" WHERE title = ${bad}`;\n// --> [{ n: 0 }]\n\nawait prisma.$queryRawUnsafe(`SELECT count(*)::int AS n FROM "Post" WHERE title = \'${bad}\'`);\n// --> [{ n: 3 }]') +
            'What exactly is the difference between the two calls?',
            'Hai phiên bản của cùng một phép tra cứu được chạy trên một bảng 3 bài viết, với tham số yêu cầu đặt là ' + c("x' OR 1=1 --") + ':' +
            code('await prisma.$queryRaw`SELECT count(*)::int AS n FROM "Post" WHERE title = ${bad}`;\n// --> [{ n: 0 }]\n\nawait prisma.$queryRawUnsafe(`SELECT count(*)::int AS n FROM "Post" WHERE title = \'${bad}\'`);\n// --> [{ n: 3 }]') +
            'Khác biệt chính xác giữa hai lời gọi là gì?',
          ),
          options: [
            B(
              '<code>$queryRaw</code> escapes the quote characters before building the statement, and <code>$queryRawUnsafe</code> skips that escaping step',
              '<code>$queryRaw</code> thoát các ký tự nháy trước khi dựng câu lệnh, còn <code>$queryRawUnsafe</code> bỏ qua bước thoát ấy',
            ),
            B(
              'The tagged template sends the value as a bind parameter, so it never enters the SQL text at all; the string version concatenates it into the syntax, where the quote closes the literal, <code>OR 1=1</code> defeats the filter, and <code>--</code> comments out the rest so nothing even errors',
              'Dạng tagged template gửi giá trị đi bằng THAM SỐ RÀNG BUỘC, nên nó không hề bước vào phần chữ của SQL; bản nối chuỗi thì ghép nó thẳng vào cú pháp, ở đó dấu nháy đóng chuỗi lại, <code>OR 1=1</code> vô hiệu hoá điều kiện lọc, và <code>--</code> bình luận nốt phần còn lại nên chẳng có lỗi nào cả',
            ),
            B(
              'Both are safe; the difference in the result comes from <code>count(*)::int</code>, which returns 0 when a bind parameter cannot be coerced',
              'Cả hai đều an toàn; khác biệt ở kết quả đến từ <code>count(*)::int</code>, vốn trả về 0 khi một tham số ràng buộc không ép kiểu được',
            ),
            B(
              '<code>$queryRawUnsafe</code> is safe as long as you pass values as extra arguments, so the difference here is only that the developer used the wrong overload for a literal',
              '<code>$queryRawUnsafe</code> vẫn an toàn miễn là bạn truyền giá trị bằng các tham số phụ, nên khác biệt ở đây chỉ là lập trình viên dùng sai nạp chồng cho một hằng',
            ),
          ],
          correct: 1,
          explanation: EX(
            'The difference is a pair of parentheses and it is the whole security boundary. In the tagged-template form there is no parenthesis after <code>$queryRaw</code>, which means you <em>cannot</em> build the string first even by accident: Prisma receives the fragments and the values separately and sends <code>WHERE title = $1</code> with the value beside it. That is not a stronger escaping scheme, it is a categorical difference — the value never becomes syntax, so no user\'s email is ever "the literal string <code>x\' OR 1=1 --</code>" and the honest answer is zero rows. The unsafe form takes a finished string, and the measured result is the whole table. Read the injected statement: the quote closes the literal, <code>OR 1=1</code> makes the filter useless, and <code>--</code> comments out the trailing quote so the syntax stays valid and nothing appears in the error log. Option 4 is half true and dangerous: <code>$queryRawUnsafe</code> does accept positional parameters, and its one genuinely necessary use is DDL where a table name is a variable — but the failure mode here was a developer interpolating, which the safe form makes impossible. A practical enforcement the course recommends: grep the repository for <code>RawUnsafe</code> in CI and fail the build outside an allow-listed file.',
            'Khác biệt nằm ở một cặp dấu ngoặc và nó chính là toàn bộ ranh giới an ninh. Ở dạng tagged template, không có dấu ngoặc nào sau <code>$queryRaw</code>, nghĩa là bạn KHÔNG THỂ dựng chuỗi trước dù có vô tình: Prisma nhận các mảnh và các giá trị tách rời nhau rồi gửi đi <code>WHERE title = $1</code> với giá trị nằm bên cạnh. Đó không phải một cơ chế thoát ký tự mạnh hơn, đó là một khác biệt về PHẠM TRÙ — giá trị không bao giờ trở thành cú pháp, nên chẳng có email nào của người dùng lại đúng bằng "chuỗi <code>x\' OR 1=1 --</code>" và câu trả lời trung thực là không dòng nào. Dạng unsafe nhận vào một chuỗi đã hoàn chỉnh, và kết quả đo được là cả bảng. Hãy đọc câu lệnh bị tiêm: dấu nháy đóng chuỗi lại, <code>OR 1=1</code> làm điều kiện lọc vô dụng, và <code>--</code> bình luận nốt dấu nháy còn thừa nên cú pháp vẫn hợp lệ và không có gì hiện lên trong log lỗi. Phương án 4 đúng một nửa và nguy hiểm: <code>$queryRawUnsafe</code> đúng là nhận tham số theo vị trí, và công dụng thật sự cần thiết duy nhất của nó là DDL khi tên bảng là một biến — nhưng chế độ hỏng ở đây là một lập trình viên đi nội suy chuỗi, thứ mà dạng an toàn làm cho bất khả. Một cách cưỡng chế thực dụng mà giáo trình khuyên: grep cả kho mã tìm <code>RawUnsafe</code> trong CI và làm đỏ bản dựng nếu nó nằm ngoài một danh sách file được phép.',
          ),
        }),

        // q40 · 10.1 · đáp án 3
        mcq({
          prompt: B(
            'A listing must sort by a column the user chooses. A developer writes it inside the <em>safe</em> tagged template:' +
            code('const cot = req.query.sort;   // "views" or "createdAt"\nawait prisma.$queryRaw`SELECT id, title FROM "Post" ORDER BY ${cot} DESC LIMIT 20`;') +
            'It runs without error and returns rows in an order nobody expects. What happened?',
            'Một trang danh sách phải sắp theo một cột do người dùng chọn. Lập trình viên viết nó bên trong tagged template AN TOÀN:' +
            code('const cot = req.query.sort;   // "views" hoặc "createdAt"\nawait prisma.$queryRaw`SELECT id, title FROM "Post" ORDER BY ${cot} DESC LIMIT 20`;') +
            'Nó chạy không lỗi và trả về các dòng theo một thứ tự chẳng ai ngờ tới. Chuyện gì đã xảy ra?',
          ),
          options: [
            B(
              'The template rejected the identifier and fell back to the primary key, which is why the order looks arbitrary',
              'Template đã từ chối định danh đó và lùi về khoá chính, nên thứ tự trông tuỳ tiện',
            ),
            B(
              'The column name needs double quotes: ' + c('ORDER BY "${cot}" DESC') + ' makes it a valid identifier and the sort works',
              'Tên cột cần dấu nháy kép: ' + c('ORDER BY "${cot}" DESC') + ' làm nó thành một định danh hợp lệ và phép sắp xếp chạy đúng',
            ),
            B(
              'A tagged template cannot interpolate into <code>ORDER BY</code> at all; Prisma throws at runtime and the rows came from a cached plan',
              'Tagged template hoàn toàn không nội suy được vào <code>ORDER BY</code>; Prisma ném lỗi lúc chạy và các dòng kia đến từ một kế hoạch đã cache',
            ),
            B(
              'You cannot parameterise an identifier: the statement sent was <code>ORDER BY $1 DESC</code>, so PostgreSQL sorted every row by a constant string — the fix is a whitelist and <code>Prisma.raw</code>',
              'Bạn không thể tham số hoá một ĐỊNH DANH: câu lệnh gửi đi là <code>ORDER BY $1 DESC</code>, nên PostgreSQL sắp mọi dòng theo một chuỗi hằng — cách sửa là một danh sách trắng cộng <code>Prisma.raw</code>',
            ),
          ],
          correct: 3,
          explanation: EX(
            'A bind parameter is a <em>value</em>. Table names, column names, <code>ASC</code>/<code>DESC</code> and keywords are SQL text, and there is no protocol-level way to send them as data. So <code>ORDER BY ${cot}</code> compiles to <code>ORDER BY $1</code>, PostgreSQL is handed the constant string <code>"views"</code> to sort by, every row sorts equally, and the result comes back in whatever order the plan produced — no error, wrong answer, which is the worst combination. The correct shape keeps the value/identifier distinction visible: map the user\'s input through a whitelist you wrote (' + c("const cot = ({ moi: 'createdAt', xem: 'views' })[req.query.sort] ?? 'createdAt'") + ') and then, and only then, interpolate it with <code>Prisma.raw(cot)</code>, which is the one place inside the safe API where user input must never reach. The same rule governs <code>Prisma.join(list, \' AND \')</code>: the values are parameters, the separator is SQL text you wrote. Option 2 is a trap for a real fact — PostgreSQL does fold unquoted identifiers to lower case, so quoting matters when you write identifiers by hand — but quoting a bind placeholder does not turn it into one. Options 1 and 3 invent errors; the absence of an error is exactly what makes this bug survive.',
            'Một tham số ràng buộc là một GIÁ TRỊ. Tên bảng, tên cột, <code>ASC</code>/<code>DESC</code> và các từ khoá đều là CHỮ của SQL, và không có cách nào ở tầng giao thức để gửi chúng đi dưới dạng dữ liệu. Nên <code>ORDER BY ${cot}</code> biên dịch thành <code>ORDER BY $1</code>, PostgreSQL được đưa cho chuỗi hằng <code>"views"</code> để sắp theo, mọi dòng sắp ngang nhau, và kết quả trở về theo bất kỳ thứ tự nào mà kế hoạch sinh ra — không lỗi, sai kết quả, tổ hợp tệ nhất có thể. Hình dạng đúng giữ cho ranh giới giá trị/định danh luôn nhìn thấy được: ánh xạ đầu vào của người dùng qua một danh sách trắng do bạn viết (' + c("const cot = ({ moi: 'createdAt', xem: 'views' })[req.query.sort] ?? 'createdAt'") + ') rồi mới, và chỉ khi đó mới, nội suy nó bằng <code>Prisma.raw(cot)</code>, vốn là chỗ duy nhất bên trong API an toàn mà đầu vào người dùng không bao giờ được phép chạm tới. Cũng quy tắc ấy chi phối <code>Prisma.join(list, \' AND \')</code>: các giá trị là tham số, còn dải phân cách là chữ SQL do bạn viết. Phương án 2 là cái bẫy dựng trên một dữ kiện có thật — PostgreSQL đúng là hạ định danh không nháy về chữ thường, nên việc đặt nháy có ý nghĩa khi bạn tự viết định danh — nhưng đặt nháy quanh một chỗ giữ chỗ tham số thì không biến nó thành định danh. Phương án 1 và 3 bịa ra lỗi; chính SỰ VẮNG MẶT của lỗi mới là thứ khiến con bọ này sống dai.',
          ),
        }),

        // q41 · 10.2 · đáp án 0
        mcq({
          prompt: B(
            'A model is declared with ' + c('@@map("users")') + ' and ' + c('avatarUrl String @map("avatar_url")') + '. A developer writes ' + c('prisma.$queryRaw<User[]>`SELECT id, "avatarUrl" FROM "User"`') + ' and gets ' + c('Raw query failed. Code: `42P01`. Message: `relation "User" does not exist`') + '. Which set of statements is correct?',
            'Một model được khai với ' + c('@@map("users")') + ' và ' + c('avatarUrl String @map("avatar_url")') + '. Lập trình viên viết ' + c('prisma.$queryRaw<User[]>`SELECT id, "avatarUrl" FROM "User"`') + ' và nhận ' + c('Raw query failed. Code: `42P01`. Message: `relation "User" does not exist`') + '. Bộ khẳng định nào là đúng?',
          ),
          options: [
            B(
              'Raw SQL speaks database names, so it must be <code>FROM users</code> and <code>avatar_url</code>; the returned key is the column name unless you alias it with double quotes; and the <code>&lt;User[]&gt;</code> generic is an unchecked assertion that would have compiled either way',
              'SQL thô nói bằng tên của cơ sở dữ liệu, nên phải là <code>FROM users</code> và <code>avatar_url</code>; khoá trả về là TÊN CỘT trừ khi bạn đặt bí danh có dấu nháy kép; và generic <code>&lt;User[]&gt;</code> chỉ là một phép khẳng định không ai kiểm, kiểu gì cũng biên dịch được',
            ),
            B(
              'The generic <code>&lt;User[]&gt;</code> tells Prisma to translate <code>@map</code> names automatically; the error is only about the missing <code>public</code> schema prefix',
              'Generic <code>&lt;User[]&gt;</code> bảo Prisma tự dịch các tên <code>@map</code>; lỗi kia chỉ là do thiếu tiền tố schema <code>public</code>',
            ),
            B(
              'Raw queries use Prisma field names on the way out but database names on the way in, so <code>FROM users</code> with <code>SELECT "avatarUrl"</code> is the correct mixture',
              'Truy vấn thô dùng tên trường Prisma ở chiều ra nhưng tên cơ sở dữ liệu ở chiều vào, nên <code>FROM users</code> kèm <code>SELECT "avatarUrl"</code> mới là hỗn hợp đúng',
            ),
            B(
              'The error is unrelated to <code>@@map</code>: PostgreSQL folded <code>"User"</code> to lower case because it was quoted, and removing the quotes fixes it',
              'Lỗi này không liên quan tới <code>@@map</code>: PostgreSQL đã hạ <code>"User"</code> về chữ thường vì nó được đặt trong nháy, bỏ nháy đi là xong',
            ),
          ],
          correct: 0,
          explanation: EX(
            'Raw SQL bypasses the mapping layer entirely, in both directions. You write the table and column names the database has, and the keys you get back are the column names the database returned — so <code>SELECT avatar_url FROM users</code> gives you <code>row.avatar_url</code>, and if you want <code>avatarUrl</code> you must alias it <em>with double quotes</em>: <code>SELECT avatar_url AS "avatarUrl"</code>. Without the quotes PostgreSQL folds the alias to lower case and you silently get <code>avatarurl</code>. (That folding rule is real, which is what makes option 4 tempting; but it works the other way round — an unquoted <code>User</code> would be folded to <code>user</code>, and the quotes are what preserve case.) The second half of the right answer is the one that costs people most: the generic parameter is a plain cast. Nothing derives it from the SQL, nothing verifies it at build time and nothing checks it at runtime, so ' + c('$queryRaw<{ nope: string }[]>`SELECT id FROM "Post"`') + ' compiles happily and hands you <code>undefined</code> at the first property access. That is the structural difference between the builder, whose types are <em>derived</em>, and raw, whose types are <em>asserted</em>: rename a column and every builder query is a compile error while every raw one still compiles. The answers are runtime validation with something like zod for shapes that escape a function, or <code>typedSql</code>, which prepares the statement against a real database at generate time and therefore fails the build when a column disappears.',
            'SQL thô đi vòng qua hoàn toàn tầng ánh xạ, ở cả hai chiều. Bạn viết tên bảng và tên cột như cơ sở dữ liệu đang có, và những khoá bạn nhận về chính là tên cột mà cơ sở dữ liệu trả ra — nên <code>SELECT avatar_url FROM users</code> cho bạn <code>row.avatar_url</code>, và nếu muốn <code>avatarUrl</code> thì phải đặt bí danh CÓ NHÁY KÉP: <code>SELECT avatar_url AS "avatarUrl"</code>. Không có nháy thì PostgreSQL hạ bí danh về chữ thường và bạn âm thầm nhận được <code>avatarurl</code>. (Quy tắc hạ chữ đó có thật, và chính nó làm phương án 4 nghe hấp dẫn; nhưng nó hoạt động theo chiều ngược lại — một <code>User</code> không nháy mới bị hạ thành <code>user</code>, còn dấu nháy chính là thứ giữ nguyên chữ hoa.) Nửa sau của đáp án đúng là phần khiến người ta trả giá nhiều nhất: tham số generic chỉ là một phép ép kiểu trần. Không có gì suy nó ra từ SQL, không có gì kiểm nó lúc build và không có gì kiểm nó lúc chạy, nên ' + c('$queryRaw<{ nope: string }[]>`SELECT id FROM "Post"`') + ' biên dịch ngon lành rồi đưa cho bạn <code>undefined</code> ngay ở phép truy cập thuộc tính đầu tiên. Đó là khác biệt về cấu trúc giữa builder, nơi các kiểu được SUY RA, với SQL thô, nơi các kiểu được KHẲNG ĐỊNH: đổi tên một cột thì mọi truy vấn qua builder là lỗi biên dịch còn mọi truy vấn thô vẫn biên dịch được. Câu trả lời là kiểm tra lúc chạy bằng thứ gì đó như zod cho những hình dạng thoát ra khỏi một hàm, hoặc <code>typedSql</code>, thứ chuẩn bị câu lệnh trên một cơ sở dữ liệu thật ngay lúc generate và vì thế làm đỏ bản dựng khi một cột biến mất.',
          ),
        }),

        // q42 · 10.5 + 4.5 · đáp án 2
        mcq({
          prompt: B(
            'A soft-delete <code>query</code> extension rewrites <code>delete</code> into an update and adds <code>deletedAt: null</code> to <code>findMany</code>, <code>findFirst</code>, <code>findUnique</code>, <code>count</code> and <code>aggregate</code> on <code>post</code>. Which of these still returns or removes soft-deleted posts?',
            'Một extension <code>query</code> xoá mềm viết lại <code>delete</code> thành một phép cập nhật và thêm <code>deletedAt: null</code> vào <code>findMany</code>, <code>findFirst</code>, <code>findUnique</code>, <code>count</code> và <code>aggregate</code> trên <code>post</code>. Thao tác nào dưới đây VẪN trả về hoặc vẫn xoá thật các bài đã xoá mềm?',
          ),
          options: [
            B(
              'None of them — that operation list is exhaustive for reads, and rewriting <code>delete</code> covers every path that could remove a row, because the query component wraps the operation before it reaches the engine',
              'Không cái nào — danh sách thao tác đó đã bao trọn phía đọc, và việc viết lại <code>delete</code> phủ hết mọi đường có thể gỡ một dòng đi, vì thành phần query bọc lấy thao tác trước khi nó tới engine',
            ),
            B(
              'Only <code>groupBy</code>, <code>findMany</code> on a filtered relation and <code>upsert</code> are missing from the list; adding those three operations to the same array makes the extension complete and no other change is needed',
              'Chỉ có <code>groupBy</code>, <code>findMany</code> trên một quan hệ đã lọc và <code>upsert</code> là thiếu trong danh sách; thêm ba thao tác đó vào cùng cái mảng là extension trở nên đầy đủ và không cần đổi gì thêm',
            ),
            B(
              '<code>$queryRaw</code>, which the query component never intercepts; ' + c('user.findMany({ include: { posts: true } })') + ', because that is a <code>findMany</code> on <code>User</code>; and any database-level <code>onDelete: Cascade</code>, which is a real foreign key and runs past every extension',
              '<code>$queryRaw</code>, thứ mà thành phần query không bao giờ chặn được; ' + c('user.findMany({ include: { posts: true } })') + ', vì đó là một <code>findMany</code> trên <code>User</code>; và mọi <code>onDelete: Cascade</code> ở tầng cơ sở dữ liệu, vốn là khoá ngoại thật và chạy vượt qua mọi extension',
            ),
            B(
              'Only calls made through a client that was extended twice, because query components run inside-out and the outer one wins',
              'Chỉ những lời gọi đi qua một client đã được mở rộng hai lần, vì các thành phần query chạy từ trong ra và cái ngoài cùng thắng',
            ),
          ],
          correct: 2,
          explanation: EX(
            'These are the three structural gaps, and each is a different kind of miss. <b>Raw queries</b> go straight to the database — the <code>query</code> component never sees <code>$queryRaw</code> or <code>$executeRaw</code>, so every raw query must write <code>AND "deletedAt" IS NULL</code> itself. <b>Rows reached through a relation</b> are invisible to a per-model hook: ' + c('user.findMany({ include: { posts: true } })') + ' is a <code>findMany</code> on <code>User</code>, so the <code>post</code> hooks never fire and the deleted posts come back attached to their author; the fix is at the call site, ' + c('include: { posts: { where: { deletedAt: null } } }') + '. <b>Database cascades</b> are the harshest: <code>onDelete: Cascade</code> is a real foreign key executed by PostgreSQL, so deleting a user really does hard-delete their posts no matter what the extension rewrote. There is a fourth gap worth remembering even though it is not a read path: unique constraints keep counting soft-deleted rows, so a returning user hits P2002 on their own email, and the fix is a partial unique index — hand-written in a migration, because the schema language cannot express a <code>WHERE</code> clause on an index. All of which is why the course says an <em>incomplete</em> soft-delete extension is more dangerous than none: with none, developers know they must filter; with a partial one, everybody stops thinking about it. Option 4 describes stacking order, which is real (query components run outside-in, the last extension added seeing the arguments first) but is not what is being asked.',
            'Đây là ba khoảng hở về cấu trúc, và mỗi cái là một kiểu trượt khác nhau. <b>Truy vấn thô</b> đi thẳng xuống cơ sở dữ liệu — thành phần <code>query</code> không bao giờ thấy <code>$queryRaw</code> hay <code>$executeRaw</code>, nên mọi truy vấn thô phải tự viết <code>AND "deletedAt" IS NULL</code>. <b>Những dòng với tới qua quan hệ</b> thì vô hình với một hook theo từng model: ' + c('user.findMany({ include: { posts: true } })') + ' là một <code>findMany</code> trên <code>User</code>, nên các hook của <code>post</code> không hề nổ và những bài đã xoá vẫn trở về đính kèm tác giả của chúng; cách sửa nằm ngay tại chỗ gọi, ' + c('include: { posts: { where: { deletedAt: null } } }') + '. <b>Cascade ở tầng cơ sở dữ liệu</b> là thứ phũ nhất: <code>onDelete: Cascade</code> là một khoá ngoại thật do PostgreSQL thực thi, nên xoá một người dùng đúng là xoá cứng các bài viết của họ bất kể extension đã viết lại cái gì. Còn một khoảng hở thứ tư đáng nhớ dù nó không phải đường đọc: các ràng buộc duy nhất vẫn tính cả những dòng đã xoá mềm, nên một người dùng quay lại sẽ đâm vào P2002 với chính email của mình, và cách sửa là một chỉ mục duy nhất một phần — viết tay trong migration, vì ngôn ngữ lược đồ không diễn đạt được mệnh đề <code>WHERE</code> trên một chỉ mục. Tất cả những điều đó là lý do giáo trình nói rằng một extension xoá mềm KHÔNG ĐẦY ĐỦ còn nguy hiểm hơn là không có: khi không có, lập trình viên biết mình phải tự lọc; khi có một cái làm dở, mọi người thôi không nghĩ tới nữa. Phương án 4 mô tả thứ tự xếp chồng, vốn có thật (các thành phần query chạy từ ngoài vào, extension thêm sau cùng nhìn thấy tham số trước tiên) nhưng không phải thứ đang được hỏi.',
          ),
        }),

        /* ══════════ Chương 11 — Đưa lên production (4 câu) ══════════ */
        // q43 · 11.1 · đáp án 1
        mcq({
          prompt: B(
            'A deploy script builds an image, pushes it, swaps the container — all green — and the API then returns 502 in a restart loop. Inside the container:' +
            code('PrismaClientInitializationError: Unable to require(\n  /app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node)\nError loading shared library ld-linux-x86-64.so.2: No such file or directory') +
            'The Dockerfile that was actually used starts <code>FROM node:22-alpine</code>. What is the diagnosis and the fix?',
            'Một script deploy dựng ảnh, đẩy lên, tráo container — tất cả đều xanh — rồi API trả 502 trong một vòng khởi động lại. Bên trong container:' +
            code('PrismaClientInitializationError: Unable to require(\n  /app/node_modules/.prisma/client/libquery_engine-debian-openssl-3.0.x.so.node)\nError loading shared library ld-linux-x86-64.so.2: No such file or directory') +
            'Dockerfile thật sự được dùng bắt đầu bằng <code>FROM node:22-alpine</code>. Chẩn đoán và cách sửa là gì?',
          ),
          options: [
            B(
              'The image is missing OpenSSL; <code>apk add --no-cache openssl</code> is the whole fix, and the engine name in the message is unrelated',
              'Ảnh thiếu OpenSSL; <code>apk add --no-cache openssl</code> là toàn bộ cách sửa, còn tên engine trong thông báo thì chẳng liên quan',
            ),
            B(
              'The generated client carries a glibc engine (<code>debian-openssl-3.0.x</code>) into a musl image; declare <code>binaryTargets = ["native", "linux-musl-openssl-3.0.x"]</code>, generate on the same base the runtime uses, and add a check that actually constructs a <code>PrismaClient</code> inside the finished image before pushing',
              'Client sinh ra mang theo engine glibc (<code>debian-openssl-3.0.x</code>) vào một ảnh musl; hãy khai <code>binaryTargets = ["native", "linux-musl-openssl-3.0.x"]</code>, sinh mã trên đúng nền mà runtime dùng, và thêm một phép kiểm THẬT SỰ dựng một <code>PrismaClient</code> bên trong ảnh đã hoàn tất trước khi đẩy đi',
            ),
            B(
              'The database is unreachable from the container; <code>PrismaClientInitializationError</code> is the class Prisma throws for a bad <code>DATABASE_URL</code>, so check the network before the image',
              'Container không với tới được cơ sở dữ liệu; <code>PrismaClientInitializationError</code> là lớp lỗi Prisma ném khi <code>DATABASE_URL</code> sai, nên hãy kiểm mạng trước khi kiểm ảnh',
            ),
            B(
              'The engine file was pruned by <code>npm prune --omit=dev</code>; move <code>prisma</code> into <code>dependencies</code> and the file will survive',
              'File engine đã bị <code>npm prune --omit=dev</code> dọn mất; hãy chuyển <code>prisma</code> vào <code>dependencies</code> là file sẽ sống sót',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Prisma Client is not pure JavaScript: it loads a compiled Rust engine built for one specific combination of libc, CPU architecture and OpenSSL version. Read the two lines together and they name the mismatch precisely — the file that exists is the <code>debian-openssl-3.0.x</code> engine, and the loader it needs, <code>ld-linux-x86-64.so.2</code>, is glibc\'s, which an Alpine image does not have (Alpine has <code>ld-musl-x86_64.so.1</code>). So the client was generated somewhere glibc-shaped and shipped into a musl runtime. The generated engine files are real and inspectable: <code>libquery_engine-linux-musl-openssl-3.0.x.so.node</code> is a different sixteen-megabyte file, and listing both targets puts both in the image. The deeper lesson is the shape of the failure, and it is the closing rule of the course: build green, push green, swap green, broken in production — because nothing before runtime ever loads the engine. A registry accepts any image; it does not run it. The cheap defence is a single ' + c('docker run --rm --entrypoint node <image> -e "new (require(\'@prisma/client\').PrismaClient)()"') + ' in the pipeline: it needs no database, because the connection is lazy, takes about four hundred milliseconds, and catches a libc mismatch, missing OpenSSL, a <code>node_modules</code> layer that did not copy, and a pruned engine. Option 1 names a real Alpine requirement that is not this error. Option 3 names the right error class for the wrong cause — the message says <code>require</code>, not connect. Option 4 describes a different real failure, whose actual fix is ordering: prune <em>after</em> generate.',
            'Prisma Client không phải JavaScript thuần: nó nạp một engine Rust đã biên dịch, dựng cho đúng MỘT tổ hợp libc, kiến trúc CPU và phiên bản OpenSSL. Đọc hai dòng cùng nhau là thấy chỗ lệch được gọi tên chính xác — file đang có là engine <code>debian-openssl-3.0.x</code>, còn bộ nạp mà nó cần, <code>ld-linux-x86-64.so.2</code>, là của glibc, thứ mà một ảnh Alpine không có (Alpine có <code>ld-musl-x86_64.so.1</code>). Vậy client đã được sinh ra ở một nơi mang hình dạng glibc rồi được chở vào một runtime musl. Các file engine sinh ra là có thật và soi được: <code>libquery_engine-linux-musl-openssl-3.0.x.so.node</code> là một file mười sáu megabyte khác, và khai cả hai target thì cả hai đều nằm trong ảnh. Bài học sâu hơn nằm ở HÌNH DẠNG của cú hỏng, và đó là luật kết của cả khoá: dựng xanh, đẩy xanh, tráo xanh, hỏng trên production — bởi không có gì trước lúc chạy từng nạp engine cả. Một registry nhận mọi cái ảnh; nó không chạy chúng. Cách phòng vệ rẻ tiền là một lệnh ' + c('docker run --rm --entrypoint node <image> -e "new (require(\'@prisma/client\').PrismaClient)()"') + ' trong đường ống: nó không cần cơ sở dữ liệu, vì kết nối là lười, mất khoảng bốn trăm mili giây, và bắt được cả lệch libc, thiếu OpenSSL, một tầng <code>node_modules</code> không được chép sang, lẫn một engine bị dọn mất. Phương án 1 gọi tên một yêu cầu có thật của Alpine nhưng không phải lỗi này. Phương án 3 gọi đúng lớp lỗi nhưng gán sai nguyên nhân — thông báo nói <code>require</code> chứ không nói kết nối. Phương án 4 mô tả một cú hỏng có thật khác, mà cách sửa thật của nó là thứ tự: dọn SAU khi generate.',
          ),
        }),

        // q44 · 11.2 · đáp án 3
        mcq({
          prompt: B(
            'A Dockerfile does <code>COPY package*.json ./</code>, then <code>RUN npm ci</code>, then <code>COPY . .</code>, then <code>RUN npm run build</code>. The build fails:' +
            code('Error: Could not find Prisma Schema that is required for this command.\nChecked following paths:\nschema.prisma: file not found\nprisma/schema.prisma: file not found') +
            'Why, and what is the ordering rule?',
            'Một Dockerfile chạy <code>COPY package*.json ./</code>, rồi <code>RUN npm ci</code>, rồi <code>COPY . .</code>, rồi <code>RUN npm run build</code>. Bản dựng hỏng:' +
            code('Error: Could not find Prisma Schema that is required for this command.\nChecked following paths:\nschema.prisma: file not found\nprisma/schema.prisma: file not found') +
            'Vì sao, và quy tắc thứ tự là gì?',
          ),
          options: [
            B(
              'The schema must be generated before it is copied; add <code>RUN npx prisma generate</code> before <code>COPY package*.json ./</code>',
              'Lược đồ phải được sinh ra trước khi được chép vào; hãy thêm <code>RUN npx prisma generate</code> trước <code>COPY package*.json ./</code>',
            ),
            B(
              '<code>npm ci</code> cannot see the schema because the build context excluded it; remove <code>prisma/</code> from <code>.gitignore</code>',
              '<code>npm ci</code> không thấy lược đồ vì ngữ cảnh build đã loại nó ra; hãy bỏ <code>prisma/</code> khỏi <code>.gitignore</code>',
            ),
            B(
              'The schema is only needed at runtime; set <code>PRISMA_SKIP_POSTINSTALL_GENERATE=1</code> and generate in the entrypoint instead',
              'Lược đồ chỉ cần lúc chạy; hãy đặt <code>PRISMA_SKIP_POSTINSTALL_GENERATE=1</code> rồi generate trong entrypoint',
            ),
            B(
              '<code>npm ci</code> runs the <code>postinstall</code> hook, which runs <code>prisma generate</code> — and at that point <code>COPY . .</code> has not happened yet; copy <code>prisma/</code> before <code>npm ci</code>, which is also the right thing for layer caching',
              '<code>npm ci</code> chạy hook <code>postinstall</code>, và hook đó chạy <code>prisma generate</code> — mà ở thời điểm ấy <code>COPY . .</code> chưa hề diễn ra; hãy chép <code>prisma/</code> vào TRƯỚC <code>npm ci</code>, và đó cũng là điều đúng cho việc cache tầng ảnh',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The <code>postinstall</code> hook is the piece people forget: installing <code>@prisma/client</code> runs <code>prisma generate</code>, and it runs during <code>npm ci</code>, which in this Dockerfile is two lines before the source arrives. Hence a schema-not-found error inside a build that looks perfectly ordinary. The fix is one line moved: <code>COPY prisma ./prisma</code> before <code>RUN npm ci</code>. It is also the right thing for a completely different reason — the schema changes far less often than the source, so copying it into the dependency layer keeps that layer cacheable and turns a ninety-second rebuild back into a five-second one. Two neighbouring rules belong with it. <b>Generate on the same base the runtime uses</b>, or declare both targets, or you get the previous question\'s outage. And <b>prune after generate, never before</b>: <code>npm prune --omit=dev</code> removes packages, not generated output, so getting it backwards leaves you with <code>@prisma/client did not initialize yet. Please run "prisma generate"</code> at container start — a message that sends people to re-run generate on their laptop, where it works fine. Option 3 inverts the whole model: the schema is read at generate time and embedded, and generating in an entrypoint means every container start pays for it and the CLI must survive into the final image. Option 2 confuses the build context with git — and note the actual <code>.dockerignore</code> rule here is the opposite of what it suggests: ignore <code>node_modules</code>, never ignore <code>prisma/</code>.',
            'Hook <code>postinstall</code> là mảnh mà người ta hay quên: cài <code>@prisma/client</code> sẽ chạy <code>prisma generate</code>, và nó chạy TRONG LÚC <code>npm ci</code>, thứ mà trong Dockerfile này nằm trước hai dòng so với lúc mã nguồn tới nơi. Nên mới có lỗi không-tìm-thấy-lược-đồ trong một bản dựng trông hoàn toàn bình thường. Cách sửa là dời một dòng: <code>COPY prisma ./prisma</code> đặt trước <code>RUN npm ci</code>. Nó cũng là điều đúng vì một lý do hoàn toàn khác — lược đồ thay đổi ít hơn hẳn mã nguồn, nên chép nó vào tầng phụ thuộc sẽ giữ được tầng đó trong cache và biến một lượt dựng lại chín mươi giây về lại năm giây. Hai quy tắc hàng xóm đi kèm với nó. <b>Hãy generate trên đúng cái nền mà runtime dùng</b>, hoặc khai cả hai target, không thì bạn nhận đúng sự cố của câu trước. Và <b>hãy prune SAU khi generate, không bao giờ trước</b>: <code>npm prune --omit=dev</code> gỡ các gói chứ không gỡ phần sinh ra, nên làm ngược thứ tự là bạn nhận <code>@prisma/client did not initialize yet. Please run "prisma generate"</code> ngay lúc container khởi động — một thông báo đẩy người ta về chạy lại generate trên laptop của họ, nơi mọi thứ chạy tốt. Phương án 3 lộn ngược cả mô hình: lược đồ được đọc lúc generate rồi nhúng vào, và generate trong entrypoint nghĩa là mỗi lần container khởi động đều phải trả giá và CLI buộc phải sống sót vào ảnh cuối. Phương án 2 nhầm ngữ cảnh build với git — và lưu ý rằng quy tắc <code>.dockerignore</code> thật ở đây ngược với thứ nó gợi ý: hãy bỏ qua <code>node_modules</code>, đừng bao giờ bỏ qua <code>prisma/</code>.',
          ),
        }),

        // q45 · 11.3 + 6.5 · đáp án 0
        mcq({
          prompt: B(
            'A deploy adds a nullable column and an index on a 4-million-row table. The pipeline runs <code>migrate deploy</code> and then swaps containers. Which pair of statements is right?',
            'Một lần deploy thêm một cột cho phép null và một chỉ mục trên bảng 4 triệu dòng. Đường ống chạy <code>migrate deploy</code> rồi mới tráo container. Cặp khẳng định nào là đúng?',
          ),
          options: [
            B(
              'Migrating before the swap is the default because the window it leaves is "old code, new schema", which additive changes survive; and <code>CREATE INDEX CONCURRENTLY</code> cannot go in the migration file, because Prisma wraps every migration in a transaction',
              'Migrate trước rồi mới tráo là mặc định vì cửa sổ nó để lại là "mã cũ, lược đồ mới", thứ mà các thay đổi bổ sung chịu được; và <code>CREATE INDEX CONCURRENTLY</code> không đặt vào file migration được, vì Prisma bọc mỗi migration trong một giao dịch',
            ),
            B(
              'Swapping before migrating is safer because the new code already knows both schemas; and <code>CREATE INDEX CONCURRENTLY</code> belongs in the migration precisely because it does not take a lock',
              'Tráo trước rồi mới migrate thì an toàn hơn vì mã mới vốn đã biết cả hai lược đồ; và <code>CREATE INDEX CONCURRENTLY</code> thuộc về file migration chính vì nó không lấy khoá',
            ),
            B(
              'Order does not matter for an additive change; and a plain <code>CREATE INDEX</code> on four million rows is metadata-only since PostgreSQL 11',
              'Thứ tự không quan trọng với một thay đổi bổ sung; và một <code>CREATE INDEX</code> thường trên bốn triệu dòng chỉ đụng metadata kể từ PostgreSQL 11',
            ),
            B(
              'Both must happen at once, inside the same transaction, so there is no window at all; Prisma supports this with <code>migrate deploy --atomic</code>',
              'Cả hai phải xảy ra cùng lúc, trong cùng một giao dịch, để không còn cửa sổ nào; Prisma hỗ trợ điều đó bằng <code>migrate deploy --atomic</code>',
            ),
          ],
          correct: 0,
          explanation: EX(
            'A deploy is not atomic: for somewhere between two seconds and two minutes, one version of the code is running against the other version\'s schema. You get to choose which window you take. Migrate-first leaves "old code, new schema", and old code ignores a column it has never heard of — which is why additive changes are safe in one step. Swap-first leaves "new code, old schema", and the failure is immediate and total: on a two-minute rollout that is two minutes of 500s. So option 2 is backwards on both halves. The second fact is a genuine constraint people meet the first time they try to build an index without blocking writes: Prisma applies every migration file inside a transaction on PostgreSQL, and <code>CREATE INDEX CONCURRENTLY</code> cannot run inside a transaction block. Below about a million rows, just take the lock with a plain <code>CREATE INDEX</code>. Above it, run the concurrent build by hand as a documented runbook step, verify it, then add the matching migration and <code>migrate resolve --applied</code> — a <em>planned</em> use of resolve, written down beforehand, which is the opposite of auto-resolving a migration that failed. Option 3 is a trap built from a real fact: the PostgreSQL 11 improvement is about <code>ADD COLUMN</code> with a constant default becoming metadata-only, not about index builds. Option 4 invents a flag; and even if it existed, code and schema live in different systems.',
            'Một lần deploy không phải là nguyên tử: trong khoảng từ hai giây tới hai phút, một phiên bản mã đang chạy trên lược đồ của phiên bản kia. Bạn được chọn mình nhận cửa sổ nào. Migrate trước để lại "mã cũ, lược đồ mới", và mã cũ thì lờ đi một cột nó chưa từng nghe tới — và vì thế các thay đổi bổ sung mới an toàn trong một bước. Tráo trước để lại "mã mới, lược đồ cũ", và cú hỏng là tức thì và toàn diện: trên một lượt triển khai hai phút thì đó là hai phút toàn lỗi 500. Nên phương án 2 ngược ở cả hai vế. Dữ kiện thứ hai là một ràng buộc có thật mà người ta gặp ngay lần đầu tiên thử dựng một chỉ mục mà không chặn ghi: Prisma áp MỌI file migration bên trong một giao dịch trên PostgreSQL, còn <code>CREATE INDEX CONCURRENTLY</code> thì không chạy được bên trong một khối giao dịch. Dưới khoảng một triệu dòng thì cứ lấy khoá bằng một <code>CREATE INDEX</code> thường. Trên mức đó thì chạy lượt dựng concurrent bằng tay như một bước đã ghi trong runbook, kiểm lại, rồi thêm migration tương ứng và <code>migrate resolve --applied</code> — một lần dùng resolve CÓ KẾ HOẠCH, viết ra từ trước, ngược hẳn với việc tự động resolve một migration vừa hỏng. Phương án 3 là cái bẫy dựng trên một dữ kiện có thật: cải tiến của PostgreSQL 11 là về việc <code>ADD COLUMN</code> có giá trị mặc định hằng trở thành chỉ-đụng-metadata, chứ không phải về việc dựng chỉ mục. Phương án 4 bịa ra một cái cờ; và kể cả nếu nó tồn tại thì mã và lược đồ vẫn sống ở hai hệ thống khác nhau.',
          ),
        }),

        // q46 · 11.4 + 11.5 · đáp án 2
        mcq({
          prompt: B(
            'A container is stopped with <code>docker stop</code>. The application logs show nothing at all and the process dies ten seconds later. The image ends with ' + c('CMD ["node", "dist/index.js"]') + ' and the code registers a SIGTERM handler that calls <code>prisma.$disconnect()</code> and then <code>server.close()</code>. Name both problems.',
            'Một container bị dừng bằng <code>docker stop</code>. Log ứng dụng không hiện gì cả và tiến trình chết sau mười giây. Ảnh kết thúc bằng ' + c('CMD ["node", "dist/index.js"]') + ' và mã có đăng ký một handler SIGTERM gọi <code>prisma.$disconnect()</code> rồi mới <code>server.close()</code>. Hãy gọi tên cả hai vấn đề.',
          ),
          options: [
            B(
              'The handler must be registered before the server listens, and <code>$disconnect()</code> must be awaited twice because the pool drains lazily',
              'Handler phải được đăng ký trước khi máy chủ lắng nghe, và <code>$disconnect()</code> phải được await hai lần vì pool rút cạn theo kiểu lười',
            ),
            B(
              'Docker sends SIGKILL first for containers with no healthcheck, and Prisma\'s <code>beforeExit</code> event is the only reliable shutdown hook',
              'Docker gửi SIGKILL trước với những container không có healthcheck, và sự kiện <code>beforeExit</code> của Prisma là hook tắt máy đáng tin duy nhất',
            ),
            B(
              'Node as PID 1 gets no default signal handlers from Linux, so the handler never runs — use <code>dumb-init</code>, <code>tini</code> or <code>--init</code>; and the order is inverted: close the HTTP server first, disconnect Prisma second, or the pool dies under requests still using it',
              'Node làm PID 1 thì Linux không cho nó handler tín hiệu mặc định nào, nên handler không bao giờ chạy — hãy dùng <code>dumb-init</code>, <code>tini</code> hay <code>--init</code>; và thứ tự đang bị đảo: hãy đóng máy chủ HTTP TRƯỚC, ngắt Prisma SAU, không thì pool chết trong khi vẫn còn yêu cầu đang dùng nó',
            ),
            B(
              'The grace period is too short; raise <code>stop_grace_period</code> to 30s and the existing handler will complete in time',
              'Thời gian ân hạn quá ngắn; hãy nâng <code>stop_grace_period</code> lên 30s là handler hiện tại sẽ kịp chạy xong',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Two independent bugs, and the first one hides the second. Linux gives PID 1 no default action for SIGTERM, so a container started with <code>CMD ["node", …]</code> simply ignores it, which is exactly why the logs are silent; ten seconds later Docker sends SIGKILL, which cannot be caught. <code>ENTRYPOINT ["dumb-init", "--"]</code> (or <code>tini</code>, or <code>docker run --init</code>) puts a real init in front and forwards the signal. Verify it the honest way: run <code>docker stop</code> and check that your shutdown lines actually appear. The second bug only becomes visible once the first is fixed. <code>$disconnect()</code> before <code>server.close()</code> tears down the pool while requests are still using it — and the client then politely reconnects, which is the opposite of shutting down. HTTP first, Prisma second. Worth adding to the handler while you are there: a guard flag, because SIGTERM can arrive twice, and a hard deadline (<code>setTimeout(() =&gt; process.exit(1), 9000).unref()</code>) so a hung shutdown exits non-zero and shows up in the logs instead of dying silently to SIGKILL. Option 4 is a real knob that would not help, because nothing is listening for the signal in the first place. Option 2 is wrong twice: Docker sends SIGTERM then SIGKILL regardless of healthchecks, and Prisma 5 and later no longer emit <code>beforeExit</code> for the library engine — Node\'s own <code>beforeExit</code> does not fire on a signal either.',
            'Hai con bọ độc lập, và con thứ nhất che mất con thứ hai. Linux không cho PID 1 hành động mặc định nào với SIGTERM, nên một container khởi động bằng <code>CMD ["node", …]</code> đơn giản là lờ nó đi, và đó chính xác là lý do log im lặng; mười giây sau Docker gửi SIGKILL, thứ không bắt được. <code>ENTRYPOINT ["dumb-init", "--"]</code> (hoặc <code>tini</code>, hoặc <code>docker run --init</code>) đặt một init thật ở phía trước và chuyển tiếp tín hiệu. Hãy kiểm chứng theo cách trung thực: chạy <code>docker stop</code> rồi xem những dòng log tắt máy của bạn có thật sự hiện ra không. Con bọ thứ hai chỉ lộ ra khi con thứ nhất đã được sửa. <code>$disconnect()</code> trước <code>server.close()</code> là phá pool trong khi các yêu cầu vẫn đang dùng nó — và client khi đó lịch sự kết nối lại, tức là ngược hẳn với việc tắt máy. HTTP trước, Prisma sau. Nhân tiện có hai thứ đáng thêm vào handler: một cờ chặn, vì SIGTERM có thể tới hai lần, và một hạn chót cứng (<code>setTimeout(() =&gt; process.exit(1), 9000).unref()</code>) để một lượt tắt bị treo thoát với mã khác 0 và hiện lên trong log thay vì chết câm dưới SIGKILL. Phương án 4 là một cái núm có thật nhưng không giúp được gì, vì ngay từ đầu chẳng có ai đang lắng nghe tín hiệu cả. Phương án 2 sai hai lần: Docker gửi SIGTERM rồi SIGKILL bất kể có healthcheck hay không, và Prisma từ bản 5 trở đi không còn phát sự kiện <code>beforeExit</code> cho library engine — mà <code>beforeExit</code> của chính Node cũng không nổ khi nhận tín hiệu.',
          ),
        }),

        /* ══════════════ Chương 12 — Chẩn đoán (4 câu) ══════════════ */
        // q47 · 12.1 · đáp án 1
        mcq({
          prompt: B(
            'An incident starts. Grepping the last fifteen minutes of container logs gives:' +
            code('P1001 Can\'t reach database server at `postgres:5432`        x 1   (13:04:11)\nP2024 Timed out fetching a new connection from the connection pool  x 214 (13:04:12 - 13:19:02)') +
            'What should be done first?',
            'Một sự cố bắt đầu. Grep mười lăm phút log gần nhất của container cho ra:' +
            code('P1001 Can\'t reach database server at `postgres:5432`        x 1   (13:04:11)\nP2024 Timed out fetching a new connection from the connection pool  x 214 (13:04:12 - 13:19:02)') +
            'Nên làm gì trước tiên?',
          ),
          options: [
            B(
              'Raise <code>pool_timeout</code> and <code>connection_limit</code>: 214 pool timeouts against 1 connectivity error is overwhelming evidence that the pool is undersized',
              'Nâng <code>pool_timeout</code> và <code>connection_limit</code>: 214 lần pool hết giờ so với 1 lỗi kết nối là bằng chứng áp đảo rằng pool bị đặt quá nhỏ',
            ),
            B(
              'Read the <em>first</em> error, not the loudest: the single P1001 at 13:04:11 precedes the flood by one second, so the 214 P2024s are its consequence — capture <code>pg_stat_activity</code>, the last hundred log lines and the pool metrics before restarting anything',
              'Đọc lỗi ĐẦU TIÊN chứ không phải lỗi to nhất: một lỗi P1001 lúc 13:04:11 đi trước cơn lũ đúng một giây, nên 214 lỗi P2024 kia là HỆ QUẢ của nó — hãy chụp lại <code>pg_stat_activity</code>, một trăm dòng log cuối và số liệu pool TRƯỚC khi khởi động lại bất cứ thứ gì',
            ),
            B(
              'Restart the backend containers immediately: a single P1001 followed by pool timeouts is the signature of a leaked pool, and only a restart releases it',
              'Khởi động lại ngay các container backend: một P1001 rồi tới hàng loạt pool timeout là dấu hiệu của một pool bị rò, và chỉ khởi động lại mới nhả nó ra',
            ),
            B(
              'Run <code>prisma migrate status</code> and then <code>prisma db push</code> to bring the schema back in line, since P1001 usually follows a partly applied migration',
              'Chạy <code>prisma migrate status</code> rồi <code>prisma db push</code> để kéo lược đồ về khớp, vì P1001 thường theo sau một migration mới áp được một phần',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Two habits from the diagnosis chapter, and they cost nothing. <b>Read the code, not the sentence</b> — P1001 is "cannot reach the database server" and P2024 is "timed out waiting for a connection from the pool", which are two different layers. <b>Read the first error, not the loudest</b> — sort ascending, find the first occurrence of the error class, and look at the sixty seconds before it. Here the single P1001 arrives one second before the flood begins, which is the whole story: the database became unreachable, every in-flight query held its connection, the pool drained, and 214 requests queued until <code>pool_timeout</code> fired. The seven failure shapes are only distinguishable at the <em>start</em> of a cascade; by the middle they all look like the pool. Option 1 is the trap the volume creates, and the chapter names raising <code>pool_timeout</code> on seeing P2024 as one of the four things not to do: it converts fast failures into slow ones and pushes the queue further up the stack. Option 3 skips the thirty seconds of capture that make the postmortem possible — restarting "fixes" about a third of incidents temporarily, and destroys the evidence every time. Option 4 is the worst answer on the page: <code>db push</code> against production writes no migration record and makes every future <code>migrate deploy</code> unpredictable.',
            'Hai thói quen từ chương chẩn đoán, và chúng chẳng tốn gì. <b>Đọc MÃ chứ đừng đọc câu văn</b> — P1001 là "không với tới được máy chủ cơ sở dữ liệu" còn P2024 là "hết giờ chờ một kết nối từ pool", hai tầng khác nhau. <b>Đọc lỗi ĐẦU TIÊN chứ không phải lỗi to nhất</b> — sắp tăng dần, tìm lần xuất hiện đầu tiên của lớp lỗi ấy, rồi nhìn sáu mươi giây trước nó. Ở đây một lỗi P1001 tới trước cơn lũ đúng một giây, và đó là toàn bộ câu chuyện: cơ sở dữ liệu trở nên không với tới được, mọi truy vấn đang bay giữ chặt kết nối của nó, pool cạn, và 214 yêu cầu xếp hàng cho tới khi <code>pool_timeout</code> nổ. Bảy hình dáng hỏng hóc chỉ phân biệt được ở ĐẦU một dây chuyền đổ vỡ; tới giữa thì cái nào cũng trông như lỗi pool. Phương án 1 là cái bẫy do khối lượng tạo ra, và chương này liệt việc nâng <code>pool_timeout</code> khi thấy P2024 vào bốn thứ không được làm: nó biến những cú hỏng nhanh thành những cú hỏng chậm và đẩy hàng đợi lên cao hơn trong ngăn xếp. Phương án 3 bỏ qua ba mươi giây chụp lại hiện trường vốn là thứ làm cho việc mổ xẻ sau đó khả thi — khởi động lại "sửa" được khoảng một phần ba số sự cố một cách tạm bợ, và lần nào cũng xoá sạch bằng chứng. Phương án 4 là đáp án tệ nhất trên trang này: <code>db push</code> lên production không ghi lại bản ghi migration nào và làm mọi lần <code>migrate deploy</code> về sau trở nên không đoán trước được.',
          ),
        }),

        // q48 · 12.2 + 9.4 · đáp án 3
        mcq({
          prompt: B(
            'P2024 is firing. A snapshot of the database says:' +
            code('        state         | count |     oldest\n----------------------+-------+--------------\n idle                 |     4 | 00:00:02\n active               |     1 | 00:00:00\n idle in transaction  |    28 | 00:06:44') +
            'What does this diagnose?',
            'P2024 đang nổ liên tục. Một lát cắt của cơ sở dữ liệu cho thấy:' +
            code('        state         | count |     oldest\n----------------------+-------+--------------\n idle                 |     4 | 00:00:02\n active               |     1 | 00:00:00\n idle in transaction  |    28 | 00:06:44') +
            'Đây chẩn đoán ra điều gì?',
          ),
          options: [
            B(
              'The pool is undersized for the traffic; 28 connections in use with only 4 idle means demand exceeds supply, so raise <code>connection_limit</code>',
              'Pool quá nhỏ so với lưu lượng; 28 kết nối đang bận mà chỉ 4 rảnh nghĩa là cầu vượt cung, nên hãy nâng <code>connection_limit</code>',
            ),
            B(
              'Autovacuum is holding the connections open while it works through a large table; the six-minute age matches one vacuum cycle on this schema, so it will clear on its own and the P2024s will stop with it',
              'Autovacuum đang giữ các kết nối mở trong lúc nó chạy qua một bảng lớn; tuổi sáu phút khớp với một chu kỳ vacuum trên lược đồ này, nên nó sẽ tự hết và các lỗi P2024 cũng dừng theo',
            ),
            B(
              'A missing index is making 28 queries run long; find them with <code>pg_stat_statements</code> and index the slowest',
              'Một chỉ mục còn thiếu đang làm 28 truy vấn chạy dài; hãy tìm chúng bằng <code>pg_stat_statements</code> rồi đánh chỉ mục cho cái chậm nhất',
            ),
            B(
              'Twenty-eight connections stuck <code>idle in transaction</code> for six minutes is never a pool-size problem: a transaction that is idle is not running a query, so something inside an interactive <code>$transaction</code> is awaiting an HTTP call, a file upload or an AI request',
              'Hai mươi tám kết nối kẹt ở <code>idle in transaction</code> suốt sáu phút thì không bao giờ là vấn đề kích thước pool: một giao dịch đang IDLE thì không chạy truy vấn nào, nên có thứ gì đó bên trong một <code>$transaction</code> tương tác đang await một lời gọi HTTP, một lượt tải file lên hay một yêu cầu AI',
            ),
          ],
          correct: 3,
          explanation: EX(
            'The state column is the diagnosis. <code>active</code> means a query is executing; <code>idle</code> means the connection is free; <code>idle in transaction</code> means a transaction is open and <em>nothing is running inside it</em> — the connection is held hostage while JavaScript waits for something that is not the database. A healthy transaction lasts milliseconds, so six minutes is not slow, it is stuck. That distinction rules out the three plausible answers: option 1 would be right if those connections were <code>active</code>, option 3 would be right if queries were long-running, and option 2 invents a vacuum behaviour. Raising <code>connection_limit</code> here buys minutes and makes the eventual failure bigger. The real fix is the rule from the transactions chapter: <b>a transaction should contain database work and nothing else</b> — no HTTP, no file I/O, no <code>await</code> on anything that is not a query. Charge the card first and record the result in a short transaction afterwards, or use an outbox row committed with the order. Two backstops are worth having anyway: PostgreSQL\'s <code>idle_in_transaction_session_timeout</code> set to something like thirty seconds, and a monitoring alert on any connection <code>idle in transaction</code> older than sixty seconds — a line that should sit flat at zero, so any movement is a real signal.',
            'Cột trạng thái chính là lời chẩn đoán. <code>active</code> nghĩa là một truy vấn đang chạy; <code>idle</code> nghĩa là kết nối đang rảnh; <code>idle in transaction</code> nghĩa là một giao dịch đang mở mà KHÔNG CÓ GÌ CHẠY BÊN TRONG NÓ — kết nối bị bắt làm con tin trong lúc JavaScript chờ một thứ không phải cơ sở dữ liệu. Một giao dịch khoẻ mạnh kéo dài vài mili giây, nên sáu phút không phải là chậm, đó là KẸT. Phân biệt đó loại luôn ba đáp án nghe hợp lý: phương án 1 sẽ đúng nếu các kết nối đó ở trạng thái <code>active</code>, phương án 3 sẽ đúng nếu có truy vấn chạy dài, còn phương án 2 thì bịa ra một hành vi của vacuum. Nâng <code>connection_limit</code> ở đây mua được vài phút và làm cú hỏng cuối cùng to hơn. Cách sửa thật là quy tắc từ chương giao dịch: <b>một giao dịch nên chỉ chứa việc của cơ sở dữ liệu và không gì khác</b> — không HTTP, không đọc ghi file, không <code>await</code> lên bất cứ thứ gì không phải một truy vấn. Hãy trừ tiền thẻ trước rồi ghi lại kết quả trong một giao dịch ngắn sau đó, hoặc dùng một dòng outbox commit chung với đơn hàng. Dù sao cũng nên có hai lớp đỡ: <code>idle_in_transaction_session_timeout</code> của PostgreSQL đặt ở khoảng ba mươi giây, và một cảnh báo giám sát cho bất kỳ kết nối nào ở <code>idle in transaction</code> lâu hơn sáu mươi giây — một đường lẽ ra phải nằm phẳng ở số không, nên mọi chuyển động đều là tín hiệu thật.',
          ),
        }),

        // q49 · 12.2 · đáp án 1
        mcq({
          prompt: B(
            'Four production incidents, four codes, all captured on the same stack:' +
            code('(a) P1003  Database `khongcodb` does not exist on the database server at `127.0.0.1:5433`\n(b) P2003  meta: { modelName: \'User\', field_name: \'Post_authorId_fkey (index)\' }\n(c) P2028  Transaction already closed ... timeout ... was 5000 ms\n(d) P2034  meta: { code: \'40001\', message: \'could not serialize access ...\' }') +
            'Which mapping to a first action is right?',
            'Bốn sự cố production, bốn mã lỗi, tất cả đều chụp trên cùng một hệ thống:' +
            code('(a) P1003  Database `khongcodb` does not exist on the database server at `127.0.0.1:5433`\n(b) P2003  meta: { modelName: \'User\', field_name: \'Post_authorId_fkey (index)\' }\n(c) P2028  Transaction already closed ... timeout ... was 5000 ms\n(d) P2034  meta: { code: \'40001\', message: \'could not serialize access ...\' }') +
            'Ánh xạ nào sang hành động đầu tiên là đúng?',
          ),
          options: [
            B(
              'All four are transient conditions that resolve themselves once load drops, so they belong in one retry wrapper with exponential backoff and jitter; what matters operationally is the rate at which each fires, not which code it happens to carry',
              'Cả bốn đều là tình trạng nhất thời và sẽ tự hết khi tải giảm, nên chúng thuộc về chung một lớp thử lại với backoff luỹ thừa và nhiễu ngẫu nhiên; thứ quan trọng về mặt vận hành là TỈ LỆ mỗi cái nổ ra, chứ không phải nó tình cờ mang mã nào',
            ),
            B(
              '(a) the database name or the volume is gone — check the server, not the code; (b) a delete hit a <code>Restrict</code> foreign key, so the parent has children and nothing was removed; (c) the interactive transaction ran past its deadline and rolled back — batch it, do not raise the timeout; (d) a serialisation conflict, which is <em>expected</em> under <code>SERIALIZABLE</code> and should be retried',
              '(a) tên cơ sở dữ liệu hoặc volume đã biến mất — hãy kiểm máy chủ chứ không phải mã; (b) một phép xoá đâm vào khoá ngoại <code>Restrict</code>, tức dòng cha vẫn còn con và không có gì bị gỡ; (c) giao dịch tương tác chạy quá hạn và đã cuộn ngược — hãy chia lô chứ đừng nâng timeout; (d) một xung đột tuần tự hoá, thứ ĐƯỢC MONG ĐỢI dưới <code>SERIALIZABLE</code> và nên được thử lại',
            ),
            B(
              '(a) and (b) are configuration mistakes to fix in the environment file and the schema, while (c) and (d) are two views of the same pool exhaustion; raise <code>connection_limit</code>, re-measure, and treat the first two separately',
              '(a) và (b) là lỗi cấu hình phải sửa trong file môi trường và trong lược đồ, còn (c) và (d) là hai góc nhìn của cùng một tình trạng cạn pool; hãy nâng <code>connection_limit</code>, đo lại, và xử lý hai cái đầu riêng',
            ),
            B(
              '(b) means the foreign key constraint is missing from the database and must be recreated by a migration, (c) means the connection pool timed out under load, and (d) means a deadlock that leaves the client in an unusable state and requires restarting the process',
              '(b) nghĩa là cơ sở dữ liệu đang THIẾU ràng buộc khoá ngoại và phải tạo lại bằng một migration, (c) nghĩa là connection pool hết giờ dưới tải, còn (d) nghĩa là một deadlock để lại client ở trạng thái không dùng được và đòi phải khởi động lại tiến trình',
            ),
          ],
          correct: 1,
          explanation: EX(
            'Every one of these was produced on the machine, and the point of the code is that it names the layer. <b>P1003</b> is the server: the database in the URL does not exist, which in a container setup usually means the volume was recreated — and if the volume is gone, so is the data. Its neighbours in that family are P1000 (authentication failed, typically a password rotated in the database but not in the environment file) and P1001 (cannot reach the server at all, which is DNS or the network and is almost never Prisma). <b>P2003</b> is the data: a foreign key constraint was violated, and <code>meta.field_name</code> names it — here a delete of a parent whose children use the default <code>Restrict</code>, so nothing was removed, which is the constraint doing its job. <b>P2028</b> is the transaction deadline, and it is distinct from P2024, the pool timeout; the fix is to make the transaction shorter, not the limit longer. <b>P2034</b> carries SQLSTATE 40001 or 40P01 and is the one error on this list you should <em>expect</em>: under <code>SERIALIZABLE</code> or on a deadlock, one side is told to try again, and it is not a bug unless the rate is climbing. Option 1 would retry a missing database forever. Option 3 collapses two different timeouts into the pool. Option 4 misreads all three: a violated constraint is not a missing one, P2028 is not P2024, and a deadlock kills one transaction, not the process.',
            'Từng lỗi trong số này đều được tạo ra trên máy thật, và ý nghĩa của mã lỗi nằm ở chỗ nó GỌI TÊN TẦNG. <b>P1003</b> là tầng máy chủ: cơ sở dữ liệu ghi trong URL không tồn tại, mà trong một thiết lập dùng container thì điều đó thường nghĩa là volume đã bị tạo lại — và nếu volume đã mất thì dữ liệu cũng mất. Các anh em cùng họ là P1000 (xác thực hỏng, thường là mật khẩu đã xoay trong cơ sở dữ liệu mà chưa xoay trong file môi trường) và P1001 (không với tới máy chủ, tức DNS hoặc mạng, và gần như không bao giờ là lỗi Prisma). <b>P2003</b> là tầng dữ liệu: một ràng buộc khoá ngoại bị vi phạm, và <code>meta.field_name</code> gọi tên nó — ở đây là một phép xoá dòng cha mà các dòng con dùng mặc định <code>Restrict</code>, nên không có gì bị gỡ đi, tức là ràng buộc đang làm đúng việc của nó. <b>P2028</b> là hạn của giao dịch, và nó khác với P2024 vốn là hạn của pool; cách sửa là làm cho giao dịch NGẮN LẠI chứ không phải làm cho giới hạn DÀI RA. <b>P2034</b> mang SQLSTATE 40001 hoặc 40P01 và là lỗi duy nhất trong danh sách này mà bạn nên MONG ĐỢI: dưới <code>SERIALIZABLE</code> hoặc khi gặp deadlock, một phía được bảo hãy thử lại, và nó không phải một con bọ trừ khi tỉ lệ đang tăng dần. Phương án 1 sẽ thử lại mãi mãi một cơ sở dữ liệu không tồn tại. Phương án 3 gộp hai loại hết-giờ khác nhau vào chung tầng pool. Phương án 4 đọc sai cả ba: một ràng buộc bị vi phạm không phải một ràng buộc bị thiếu, P2028 không phải P2024, và một deadlock giết một giao dịch chứ không giết tiến trình.',
          ),
        }),

        // q50 · 12.3 · đáp án 2
        mcq({
          prompt: B(
            'During an incident someone suggests running <code>npx prisma db pull</code> against production "just to check what the schema really looks like". What is the right response?',
            'Trong lúc sự cố, có người đề nghị chạy <code>npx prisma db pull</code> lên production "chỉ để xem lược đồ thật sự trông thế nào". Phản hồi đúng là gì?',
          ),
          options: [
            B(
              'Fine — <code>db pull</code> only reads catalogue tables and writes nothing to the database, and during an incident the only property that matters is whether a command can change production state',
              'Không sao — <code>db pull</code> chỉ đọc các bảng catalogue và không ghi gì xuống cơ sở dữ liệu, mà trong một sự cố thì tính chất duy nhất quan trọng là một câu lệnh có đổi được trạng thái production hay không',
            ),
            B(
              'Fine, but only with the <code>--print</code> flag, which sends the introspected result to standard output; without it the command applies that result back to the database as if it were a migration',
              'Không sao, nhưng phải kèm cờ <code>--print</code> vốn đẩy kết quả nội soi ra đầu ra chuẩn; không có nó thì câu lệnh sẽ áp kết quả ấy ngược trở lại cơ sở dữ liệu như thể đó là một migration',
            ),
            B(
              'No: it overwrites <code>schema.prisma</code>, losing <code>@map</code> names, relation names, comments and generator blocks — and it is one of only three Prisma commands that can change something. Use <code>migrate diff</code>, which is read-only, or pull into a copy in <code>/tmp</code> and diff',
              'Không: nó GHI ĐÈ <code>schema.prisma</code>, làm mất các tên <code>@map</code>, tên quan hệ, chú thích và các khối generator — và nó là một trong chỉ ba lệnh Prisma có thể thay đổi thứ gì đó. Hãy dùng <code>migrate diff</code> vốn chỉ đọc, hoặc pull vào một bản sao trong <code>/tmp</code> rồi so',
            ),
            B(
              'No: introspection takes an exclusive lock on every table it reads, which is unacceptable while the site is degraded',
              'Không: phép nội soi lấy khoá độc quyền trên mọi bảng nó đọc, điều không chấp nhận được khi trang đang chập chờn',
            ),
          ],
          correct: 2,
          explanation: EX(
            'Of the ten tools in the diagnostic box, exactly three can change something, and knowing which is what makes the rest safe to reach for under pressure: <code>db pull</code> rewrites your schema file, <code>prisma studio</code> can edit and delete production rows over an unauthenticated local web server using a connection from the pool your application needs, and <code>migrate deploy</code> changes the database. Everything else only reads — <code>migrate status</code>, <code>migrate diff</code>, <code>validate</code>, <code>format</code>, <code>$metrics</code>, and the <code>pg_stat</code> views. (One caveat inside the safe list: <code>EXPLAIN ANALYZE</code> executes the query, which is fine on a <code>SELECT</code> and performs the update on an <code>UPDATE</code>.) So option 1 is right about the direction and wrong about the damage: introspection is read-only <em>against the database</em> and destructive <em>against your repository</em>, because everything the database cannot express is regenerated from scratch — <code>@map</code> and <code>@@map</code> names it cannot infer, relation names, comments, ordering, generator blocks, and check constraints, triggers, partial index predicates and RLS policies that simply do not come back. It is a legitimate tool for adopting an existing database and a terrible one for "let me just check". The safe form takes ten seconds: copy the schema to <code>/tmp</code>, pull into that, and <code>diff</code>. Option 4 invents a lock; introspection reads catalogue tables.',
            'Trong mười công cụ của hộp đồ chẩn đoán, đúng BA cái có thể thay đổi thứ gì đó, và biết được đó là ba cái nào chính là thứ làm cho những cái còn lại an toàn để với tay tới lúc đang căng: <code>db pull</code> ghi đè file lược đồ của bạn, <code>prisma studio</code> có thể sửa và xoá dữ liệu production qua một máy chủ web cục bộ không xác thực, dùng một kết nối lấy từ chính cái pool mà ứng dụng của bạn đang cần, và <code>migrate deploy</code> thì thay đổi cơ sở dữ liệu. Mọi thứ còn lại chỉ đọc — <code>migrate status</code>, <code>migrate diff</code>, <code>validate</code>, <code>format</code>, <code>$metrics</code>, và các view <code>pg_stat</code>. (Một lưu ý bên trong danh sách an toàn: <code>EXPLAIN ANALYZE</code> có THỰC THI truy vấn, điều đó vô hại với một <code>SELECT</code> và sẽ thực hiện phép cập nhật thật với một <code>UPDATE</code>.) Nên phương án 1 đúng về hướng và sai về thiệt hại: nội soi là chỉ-đọc VỚI CƠ SỞ DỮ LIỆU và là phá hoại VỚI KHO MÃ CỦA BẠN, bởi mọi thứ mà cơ sở dữ liệu không diễn đạt được đều bị sinh lại từ đầu — các tên <code>@map</code> và <code>@@map</code> nó không suy ra được, tên quan hệ, chú thích, thứ tự, các khối generator, cùng với ràng buộc check, trigger, vị từ của chỉ mục một phần và chính sách RLS thì đơn giản là không quay về. Nó là một công cụ chính đáng để tiếp quản một cơ sở dữ liệu có sẵn và là một công cụ tồi tệ cho việc "để tôi xem thử cái đã". Dạng an toàn mất mười giây: chép lược đồ sang <code>/tmp</code>, pull vào đó, rồi <code>diff</code>. Phương án 4 bịa ra một cái khoá; nội soi thì đọc các bảng catalogue.',
          ),
        }),
      ],
    },
  ],
};
