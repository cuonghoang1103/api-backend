/**
 * Node.js — Progress Test 2 (chương 7–12).
 *
 * Đề tự soạn, bám sát `content/courses/nodejs/s07…s12`. 30 câu trắc nghiệm +
 * 2 câu lập trình làm ngay trong phòng thi.
 *
 * ⚠️ Hai lời giải mẫu đều đã CHẠY THẬT bằng `node` để lấy `expectedOutput`;
 * `scripts/exam-check.mjs` chạy lại chúng mỗi lần kiểm đề.
 *
 * Seed: node scripts/academy-seed-exam.mjs --file ./content/exams/NODEJS-PT2.mjs --apply
 */
import { B, EX, code, sim, ptInstructions, mcq, codeQ } from './_lib/nodejs-exam-kit.mjs';

export default {
  course: { slug: 'nodejs' },
  exams: [
    {
      kind: 'FE',
      code: 'PT2',
      source: 'SAMPLE',
      sortOrder: 2,
      title: B(
        'Progress Test 2 — Chapters 7–12 (PostgreSQL/Prisma, auth, security, uploads, realtime, Redis)',
        'Kiểm tra tiến độ 2 — Chương 7–12 (PostgreSQL/Prisma, xác thực, bảo mật, upload, realtime, Redis)',
      ),
      description: B(
        'The middle third of the course: the database and its migrations, passwords and tokens, the security perimeter, file uploads, WebSocket and Redis. 30 multiple-choice questions plus 2 coding questions written in the exam room.',
        'Một phần ba giữa của khoá: cơ sở dữ liệu và migration, mật khẩu và token, đường biên bảo mật, upload file, WebSocket và Redis. 30 câu trắc nghiệm và 2 câu lập trình viết ngay trong phòng thi.',
      ),
      durationMinutes: 75,
      totalPoints: 10,
      passMark: 4,
      shuffleQuestions: false,
      shuffleOptions: false,
      isPublished: true,
      instructions: ptInstructions(2, '7–12'),
      questions: [
        // ── Chương 7 — PostgreSQL & Prisma ──────────────────────────────
        mcq({
          prompt: B(
            'An API runs 3 containers. Each container accidentally builds 4 Prisma clients, and each client opens a pool of 10. PostgreSQL has the default <code>max_connections = 100</code>. What happens?',
            'Một API chạy 3 container. Mỗi container lỡ tạo 4 Prisma client, mỗi client mở pool 10 kết nối. PostgreSQL để mặc định <code>max_connections = 100</code>. Chuyện gì xảy ra?',
          ),
          options: [
            B('Nothing — Prisma shares one pool across clients in a process', 'Không sao — Prisma dùng chung một pool cho mọi client trong tiến trình'),
            B('120 connections are requested; PostgreSQL answers <code>53300 sorry, too many clients already</code>', '120 kết nối bị yêu cầu; PostgreSQL trả lỗi <code>53300 sorry, too many clients already</code>'),
            B('The pools queue quietly, so it is only slower, never an error', 'Các pool tự xếp hàng, nên chỉ chậm đi chứ không lỗi'),
            B('PostgreSQL raises max_connections automatically under pressure', 'PostgreSQL tự nâng max_connections khi bị dồn'),
          ],
          correct: 1,
          explanation: EX(
            'Total connections = processes × pool size per process, plus the migration job, plus your open psql, plus every background worker. Once PostgreSQL is full it refuses everything — including your health check — so the whole service looks dead. Every <code>new PrismaClient()</code> creates its own pool: build exactly one per process and import it everywhere. If you truly need hundreds of clients, the answer is PgBouncer in front, not a bigger pool in Node.',
            'Tổng kết nối = số tiến trình × kích thước pool mỗi tiến trình, cộng thêm job chạy migration, cộng phiên psql bạn để quên, cộng mọi worker nền. PostgreSQL đầy là từ chối tất cả — kể cả health check — nên cả dịch vụ trông như đã chết. Mỗi <code>new PrismaClient()</code> đẻ ra một pool riêng: hãy tạo ĐÚNG MỘT client cho mỗi tiến trình rồi import khắp nơi. Nếu thật sự cần hàng trăm client thì câu trả lời là đặt PgBouncer phía trước, không phải nâng pool trong Node.',
          ),
        }),

        mcq({
          prompt: B(
            'Which command belongs in the production deploy pipeline, and why?',
            'Lệnh nào mới được đặt trong quy trình deploy production, và vì sao?',
          ),
          options: [
            B('<code>prisma migrate dev</code> — it creates the file and applies it in one step', '<code>prisma migrate dev</code> — nó vừa tạo file vừa áp dụng trong một bước'),
            B('<code>prisma db push</code> — it is faster because there is no migration file', '<code>prisma db push</code> — nhanh hơn vì không cần file migration'),
            B('<code>prisma migrate deploy</code> — it applies pending files in order and never resets or prompts', '<code>prisma migrate deploy</code> — áp dụng các file đang chờ theo thứ tự, không bao giờ reset hay hỏi han'),
            B('<code>prisma migrate reset</code> — it guarantees the schema matches exactly', '<code>prisma migrate reset</code> — bảo đảm lược đồ khớp chính xác'),
          ],
          correct: 2,
          explanation: EX(
            '<code>migrate dev</code> is a development command: when it cannot reconcile the database with the history it OFFERS TO RESET it, which on production is a data-loss event. <code>db push</code> writes no migration file, so the history you need for the next environment never exists. <code>migrate reset</code> drops everything. Production runs <code>migrate deploy</code> and nothing else.',
            '<code>migrate dev</code> là lệnh dành cho môi trường phát triển: khi không đối chiếu nổi cơ sở dữ liệu với lịch sử, nó ĐỀ NGHỊ RESET — trên production đó là sự cố mất dữ liệu. <code>db push</code> không sinh file migration, nên lịch sử cần cho môi trường kế tiếp chẳng bao giờ tồn tại. <code>migrate reset</code> thì xoá sạch. Production chỉ chạy <code>migrate deploy</code>, không gì khác.',
          ),
        }),

        mcq({
          prompt: B(
            'A migration fails on deploy with <code>P3018</code>; every later deploy then fails with <code>P3009</code>. What is the correct FIRST action?',
            'Một migration hỏng lúc deploy với mã <code>P3018</code>; mọi lần deploy sau đó đều hỏng với <code>P3009</code>. Việc ĐẦU TIÊN đúng đắn là gì?',
          ),
          options: [
            B('Run <code>migrate resolve --applied</code> so deploys are unblocked immediately', 'Chạy <code>migrate resolve --applied</code> để mở đường cho deploy ngay lập tức'),
            B('Rewrite the migration with <code>CREATE TABLE IF NOT EXISTS</code> to force it through', 'Viết lại migration bằng <code>CREATE TABLE IF NOT EXISTS</code> để ép nó chạy qua'),
            B('Check how much of it actually applied — the columns and <code>applied_steps_count</code> — before deciding anything', 'Kiểm tra nó đã áp dụng được tới đâu — các cột và <code>applied_steps_count</code> — rồi mới quyết định'),
            B('Run <code>migrate reset</code> on production and replay every migration', 'Chạy <code>migrate reset</code> trên production rồi phát lại toàn bộ migration'),
          ],
          correct: 2,
          explanation: EX(
            'P3018 is the first failure; P3009 is every attempt after it, so from that moment nobody can ship — including a teammate whose migration is innocent. The only question that matters first is how much applied: PostgreSQL runs DDL inside a transaction, so a failed migration usually rolled itself back completely (<code>applied_steps_count = 0</code>, no <code>finished_at</code>). Only then is <code>--rolled-back</code> honest. <code>--applied</code> tells Prisma "this ran successfully" — if it did not, every future migration is computed from a false starting point.',
            'P3018 là lần hỏng đầu tiên; P3009 là mọi lần thử sau đó, nên từ lúc ấy không ai ship được — kể cả đồng nghiệp có migration hoàn toàn vô can. Câu hỏi duy nhất cần trả lời trước là nó đã áp dụng được bao nhiêu: PostgreSQL chạy DDL trong một transaction, nên migration hỏng thường tự cuộn ngược sạch sẽ (<code>applied_steps_count = 0</code>, không có <code>finished_at</code>). Chỉ khi đó dùng <code>--rolled-back</code> mới trung thực. Còn <code>--applied</code> là nói với Prisma "cái này đã chạy xong" — nếu thực tế không phải vậy thì mọi migration sau đều tính từ một điểm xuất phát sai.',
          ),
        }),

        mcq({
          prompt: B(
            'Measured on 50 users and 1000 notes, counting real SQL statements: option A below took 79ms, option B took 14ms. What is A doing?' + code(
              '// A\n' +
              'const users = await prisma.user.findMany();\n' +
              'for (const u of users) {\n' +
              '  const notes = await prisma.note.findMany({ where: { authorId: u.id } });\n' +
              '}\n\n' +
              '// B\n' +
              'const users = await prisma.user.findMany({ include: { notes: true } });',
            ),
            'Đo trên 50 người dùng và 1000 ghi chú, có đếm số câu SQL thật: cách A dưới đây mất 79ms, cách B mất 14ms. A đang làm gì?' + code(
              '// A\n' +
              'const users = await prisma.user.findMany();\n' +
              'for (const u of users) {\n' +
              '  const notes = await prisma.note.findMany({ where: { authorId: u.id } });\n' +
              '}\n\n' +
              '// B\n' +
              'const users = await prisma.user.findMany({ include: { notes: true } });',
            ),
          ),
          options: [
            B('A sends 51 SQL queries (1 + N); B sends 2', 'A gửi 51 câu SQL (1 + N); B gửi 2'),
            B('A sends 2 queries but transfers more columns', 'A gửi 2 câu nhưng truyền nhiều cột hơn'),
            B('A sends 1 query with a JOIN, which is slower than 2 queries', 'A gửi 1 câu có JOIN, và JOIN chậm hơn 2 câu'),
            B('A and B send the same SQL; the difference is Prisma overhead', 'A và B gửi SQL giống nhau; khác biệt là chi phí của Prisma'),
          ],
          correct: 0,
          explanation: EX(
            'This is N+1. Note where the danger really lies: the database was on the SAME machine, where a round trip costs ~0.4ms, so A was "only" 5.6× slower. Put the database one millisecond away — a modest, realistic network — and A pays 51 round trips (+51ms) while B pays 2 (+2ms), and the gap widens with every user. How to spot it in review: an <code>await</code> on a database call inside a <code>for</code>/<code>map</code>/<code>forEach</code> over rows you just fetched — including when it hides inside a helper like <code>await enrich(note)</code>.' +
              sim('nodejs-n-plus-1', 'nodejs-7-4-quan-he-va-n-plus-1', 'Watch 1+N vs 2 queries'),
            'Đây là lỗi N+1. Để ý chỗ nguy hiểm thật sự: cơ sở dữ liệu nằm CÙNG máy, mỗi vòng đi-về chỉ tốn ~0,4ms, nên A "chỉ" chậm gấp 5,6 lần. Đặt cơ sở dữ liệu cách một mili-giây — một mạng rất bình thường — thì A trả 51 vòng đi-về (+51ms) còn B trả 2 (+2ms), và khoảng cách nới ra theo từng người dùng thêm vào. Cách nhận ra khi review: có <code>await</code> gọi cơ sở dữ liệu bên trong <code>for</code>/<code>map</code>/<code>forEach</code> duyệt trên chính các dòng vừa lấy về — kể cả khi nó trốn trong một hàm phụ như <code>await enrich(note)</code>.' +
              sim('nodejs-n-plus-1', 'nodejs-7-4-quan-he-va-n-plus-1', 'Xem mô phỏng 1+N và 2 câu'),
          ),
        }),

        mcq({
          prompt: B(
            '"Twenty most recent notes by author 7" took 28.618ms with a <code>Parallel Seq Scan</code> plus a <code>Sort</code>. After adding <code>@@index([authorId, createdAt(sort: Desc)])</code> it took 0.129ms and the plan had NO Sort node. Why did the Sort disappear?',
            '"Hai mươi ghi chú mới nhất của tác giả 7" mất 28,618ms với <code>Parallel Seq Scan</code> kèm một nút <code>Sort</code>. Sau khi thêm <code>@@index([authorId, createdAt(sort: Desc)])</code> thì còn 0,129ms và kế hoạch KHÔNG còn nút Sort. Vì sao nút Sort biến mất?',
          ),
          options: [
            B('PostgreSQL caches the sorted result after the first run', 'PostgreSQL lưu sẵn kết quả đã sắp xếp sau lần chạy đầu'),
            B('The index already stores createdAt in order within each authorId', 'Chỉ mục đã lưu sẵn createdAt theo thứ tự trong từng authorId'),
            B('Adding any index removes sorting, whatever the column order', 'Cứ thêm chỉ mục là hết sắp xếp, bất kể thứ tự cột'),
            B('LIMIT 20 makes PostgreSQL skip sorting entirely', 'LIMIT 20 khiến PostgreSQL bỏ hẳn bước sắp xếp'),
          ],
          correct: 1,
          explanation: EX(
            'Column order is the whole point: equality column first (<code>authorId</code>), then the column you sort or range-scan on (<code>createdAt</code>). An index on <code>(createdAt, authorId)</code> would NOT have removed the sort. Also remember the write tax measured in the same lesson — going from 3 to 6 indexes made 50k inserts 44% slower — and the four ways an index quietly does nothing: a function around the column (<code>lower(slug)</code>), a leading wildcard (<code>LIKE &#x27;%4242&#x27;</code>), a type mismatch, and low selectivity.' +
              sim('nodejs-index-explain', 'nodejs-7-5-chi-muc-va-explain', 'Watch the plan change'),
            'Thứ tự cột chính là điểm mấu chốt: cột so sánh bằng đứng trước (<code>authorId</code>), rồi tới cột dùng để sắp xếp hoặc quét khoảng (<code>createdAt</code>). Chỉ mục <code>(createdAt, authorId)</code> sẽ KHÔNG bỏ được bước sắp xếp. Cũng nhớ khoản thuế ghi đo trong cùng bài — tăng từ 3 lên 6 chỉ mục làm 50 nghìn lần chèn chậm thêm 44% — và bốn kiểu chỉ mục âm thầm vô dụng: bọc hàm quanh cột (<code>lower(slug)</code>), ký tự đại diện đứng đầu (<code>LIKE &#x27;%4242&#x27;</code>), lệch kiểu dữ liệu, và độ chọn lọc thấp.' +
              sim('nodejs-index-explain', 'nodejs-7-5-chi-muc-va-explain', 'Xem mô phỏng kế hoạch truy vấn'),
          ),
        }),

        mcq({
          prompt: B(
            'Two users open note 1 (both hold <code>version: 1</code>) and both save. The service uses:' + code(
              'const updated = await prisma.note.updateMany({\n' +
              '  where: { id, version: clientVersion },\n' +
              '  data: { ...patch, version: { increment: 1 } },\n' +
              '});',
            ) + 'What does the second writer get, and why is <code>updateMany</code> used instead of <code>update</code>?',
            'Hai người mở ghi chú số 1 (cùng giữ <code>version: 1</code>) rồi cùng lưu. Service dùng:' + code(
              'const updated = await prisma.note.updateMany({\n' +
              '  where: { id, version: clientVersion },\n' +
              '  data: { ...patch, version: { increment: 1 } },\n' +
              '});',
            ) + 'Người ghi thứ hai nhận được gì, và vì sao dùng <code>updateMany</code> chứ không phải <code>update</code>?',
          ),
          options: [
            B('<code>count: 0</code> → answer 409; <code>update</code> only accepts a unique key and cannot filter on version', '<code>count: 0</code> → trả 409; <code>update</code> chỉ nhận khoá duy nhất nên không lọc theo version được'),
            B('An exception P2025; <code>updateMany</code> is simply the newer API', 'Ném lỗi P2025; <code>updateMany</code> chỉ là API mới hơn'),
            B('<code>count: 1</code> — the second write wins, which is the intended behaviour', '<code>count: 1</code> — người ghi sau thắng, và đó là hành vi mong muốn'),
            B('The database blocks the second writer until the first releases a lock', 'Cơ sở dữ liệu chặn người ghi thứ hai cho tới khi người đầu nhả khoá'),
          ],
          correct: 0,
          explanation: EX(
            'The count IS the concurrency check: zero rows matched means somebody incremented the version first, so you answer 409 STALE_VERSION and let the human reload. This is optimistic concurrency — nobody is blocked, nothing is locked, and the loser is simply told. It is the same mechanism as chapter 6\'s ETag + If-Match + 412: version column = server side, ETag = wire format. Without it you get the lost update: the second save silently erases the first, with no error and no log line.',
            'Con số count CHÍNH LÀ phép kiểm đồng thời: không dòng nào khớp nghĩa là ai đó đã tăng version trước, nên bạn trả 409 STALE_VERSION và để con người tải lại. Đây là điều khiển đồng thời lạc quan — không ai bị chặn, không gì bị khoá, người thua chỉ đơn giản được báo. Cùng một cơ chế với ETag + If-Match + 412 của chương 6: cột version là phía máy chủ, ETag là dạng truyền trên đường dây. Không có nó thì xảy ra lost update: lần lưu thứ hai xoá trắng lần đầu, không lỗi, không log.',
          ),
        }),

        // ── Chương 8 — Xác thực & phân quyền ────────────────────────────
        mcq({
          prompt: B(
            'Measured on one laptop core: SHA-256 does 1,016,503 hashes/second; bcrypt at cost 12 does 3.1 hashes/second. What does that ratio mean for password storage?',
            'Đo trên một nhân CPU máy tính xách tay: SHA-256 băm được 1.016.503 lần/giây; bcrypt cost 12 băm được 3,1 lần/giây. Tỉ lệ đó nói gì về việc lưu mật khẩu?',
          ),
          options: [
            B('SHA-256 is the better choice: it handles far more logins per second', 'SHA-256 tốt hơn: nó phục vụ được nhiều lượt đăng nhập mỗi giây hơn hẳn'),
            B('Slowness is the feature — the same 1,000,000-candidate sweep costs 1.8s with SHA-256 and 4.2 days with bcrypt', 'Chậm chính là tính năng — quét cùng 1.000.000 khả năng tốn 1,8 giây với SHA-256 và 4,2 ngày với bcrypt'),
            B('The difference disappears once you add a salt to SHA-256', 'Khác biệt biến mất khi thêm muối vào SHA-256'),
            B('Only encryption (AES) is safe, because it can be reversed for verification', 'Chỉ mã hoá (AES) mới an toàn, vì có thể giải ngược ra để đối chiếu'),
          ],
          correct: 1,
          explanation: EX(
            'The threat model is an offline attacker holding your whole User table, not someone guessing on your login form. Under that model a fast hash is the vulnerability: precomputing every 6-digit password took 1.8 seconds and a lookup 0.0023ms. A per-user salt (stored inside the bcrypt/argon2 string itself) is what makes a shared rainbow table useless — but salt alone does not fix speed. Encryption is wrong for a different reason: it is reversible by design, and the key usually lives in the same env file the attacker just read.' +
              sim('password-hashing', 'nodejs-8-1-mat-khau-va-bam', 'Watch a hash get cracked'),
            'Mô hình nguy cơ là kẻ tấn công ngoại tuyến đang cầm cả bảng User của bạn, không phải kẻ ngồi đoán trên form đăng nhập. Với mô hình đó, hàm băm nhanh chính là lỗ hổng: dựng sẵn toàn bộ mật khẩu 6 chữ số mất 1,8 giây và tra ngược mất 0,0023ms. Muối riêng cho từng người (nằm ngay trong chuỗi bcrypt/argon2) là thứ làm bảng cầu vồng dùng chung trở nên vô dụng — nhưng chỉ muối thôi thì không chữa được chuyện nhanh. Mã hoá sai vì lý do khác: nó vốn được thiết kế để giải ngược, và khoá thường nằm ngay trong file env mà kẻ tấn công vừa đọc.' +
              sim('password-hashing', 'nodejs-8-1-mat-khau-va-bam', 'Xem mô phỏng bẻ khoá mật khẩu'),
          ),
        }),

        mcq({
          prompt: B(
            'Two different passwords share their first 72 bytes. <code>bcrypt.compare(passwordB, hash(passwordA))</code> returns <b>true</b>. What is going on, and why does it matter more for Vietnamese users?',
            'Hai mật khẩu khác nhau nhưng giống nhau 72 byte đầu. <code>bcrypt.compare(matKhauB, hash(matKhauA))</code> trả về <b>true</b>. Chuyện gì đang xảy ra, và vì sao người dùng Việt Nam càng dễ dính?',
          ),
          options: [
            B('bcrypt has a hash collision; every hash function has some', 'bcrypt bị đụng độ băm; hàm băm nào cũng có'),
            B('bcrypt silently truncates its input at 72 BYTES — and a 70-character Vietnamese passphrase is 99 bytes', 'bcrypt âm thầm cắt đầu vào ở 72 BYTE — mà một câu mật khẩu tiếng Việt 70 ký tự đã là 99 byte'),
            B('The comparison is case-insensitive above 72 characters', 'Phép so sánh không phân biệt hoa thường khi dài quá 72 ký tự'),
            B('It only happens when the two passwords have the same length', 'Chỉ xảy ra khi hai mật khẩu có cùng độ dài'),
          ],
          correct: 1,
          explanation: EX(
            'Anything past byte 72 is discarded, so a wrong password can log in. And bytes are not characters — accented Vietnamese letters cost 2 bytes each (chapter 3.2), so a 70-character passphrase is 99 bytes and bcrypt throws away the last 27. If you stay on bcrypt, cap the password at 72 bytes with an explicit error or pre-hash with SHA-256 + base64; argon2id has no such limit and is the first choice.',
            'Mọi thứ sau byte thứ 72 bị vứt bỏ, nên một mật khẩu SAI vẫn đăng nhập được. Và byte không phải ký tự — chữ tiếng Việt có dấu tốn 2 byte mỗi chữ (bài 3.2), nên câu mật khẩu 70 ký tự đã là 99 byte và bcrypt ném đi 27 byte cuối. Nếu vẫn dùng bcrypt thì phải chặn mật khẩu ở 72 byte kèm thông báo rõ ràng, hoặc băm trước bằng SHA-256 rồi base64; argon2id không có giới hạn này và là lựa chọn số một.',
          ),
        }),

        mcq({
          prompt: B(
            'A login endpoint returns early when the email is unknown. Measured: unknown email 1.42ms, known email 35.52ms — a 25× gap. What is the problem and the fix?',
            'Một endpoint đăng nhập trả về sớm khi email không tồn tại. Đo được: email không tồn tại 1,42ms, email có thật 35,52ms — chênh 25 lần. Vấn đề là gì và sửa thế nào?',
          ),
          options: [
            B('Only a performance problem — cache the user lookup and move on', 'Chỉ là vấn đề hiệu năng — cache bước tra người dùng rồi thôi'),
            B('The timing leaks which emails have an account — verify against a DUMMY_HASH', 'Thời gian phản hồi làm lộ email nào có tài khoản — hãy đối chiếu với một DUMMY_HASH'),
            B('Nothing is wrong, since the status code is 401 in both cases', 'Không sao cả, vì mã trạng thái đều là 401 trong cả hai trường hợp'),
            B('Add a random delay to every login response to hide the gap', 'Thêm trễ ngẫu nhiên vào mọi phản hồi đăng nhập để giấu khoảng chênh'),
          ],
          correct: 1,
          explanation: EX(
            'A 25× gap lets a script classify a million email addresses into "has an account" and "does not" without ever guessing a password. For a general app that is a privacy leak; for a dating site, medical portal or political forum it is a safety problem for real people. The fix is to run the verification anyway against a dummy hash, and to keep the timing, the status code (401) and the message identical — never "email không tồn tại". A random delay only adds noise an attacker averages out over enough samples.',
            'Chênh 25 lần cho phép một đoạn script phân loại cả triệu địa chỉ email thành "có tài khoản" và "không có" mà chẳng cần đoán mật khẩu lần nào. Với ứng dụng thường thì đó là rò rỉ riêng tư; với web hẹn hò, cổng y tế hay diễn đàn chính trị thì là vấn đề an toàn của người thật. Cách sửa là vẫn chạy bước đối chiếu với một chuỗi băm giả, và giữ nguyên thời gian, mã trạng thái (401) lẫn thông báo — đừng bao giờ ghi "email không tồn tại". Thêm trễ ngẫu nhiên chỉ tạo nhiễu mà kẻ tấn công lấy trung bình đủ mẫu là khử được.',
          ),
        }),

        mcq({
          prompt: B(
            'A code review finds <code>jwt.decode(token)</code> in the server\'s authentication middleware. How bad is it?',
            'Một buổi review phát hiện <code>jwt.decode(token)</code> nằm trong middleware xác thực của máy chủ. Nghiêm trọng tới đâu?',
          ),
          options: [
            B('Fine — decode also checks the signature, it is just the older name', 'Không sao — decode cũng kiểm chữ ký, chỉ là tên gọi cũ hơn'),
            B('There is no authentication at all: decode validates nothing, so anyone can hand-craft a payload with <code>role: ADMIN</code>', 'Coi như không có xác thực: decode chẳng kiểm gì cả, nên ai cũng tự nặn được payload với <code>role: ADMIN</code>'),
            B('Only a problem for expired tokens; the signature is still enforced', 'Chỉ ảnh hưởng token hết hạn; chữ ký vẫn được kiểm'),
            B('Only a problem if the secret is shorter than 32 bytes', 'Chỉ là vấn đề nếu khoá bí mật ngắn hơn 32 byte'),
          ],
          correct: 1,
          explanation: EX(
            '<code>decode</code> exists for reading a token you already trust (a client showing "logged in as…"). It never verifies. Two neighbouring traps: editing the payload and re-attaching the old signature IS caught (<code>invalid signature</code>), and the algorithm must be pinned by the server — a hand-rolled verifier that trusted <code>header.alg</code> handed out full ADMIN twice, once via <code>alg: none</code> and once via algorithm confusion. Always pass <code>algorithms</code>, <code>issuer</code> and <code>audience</code> to <code>verify</code>.' +
              sim('nodejs-jwt-refresh', 'nodejs-8-2-jwt-access-refresh', 'Watch access + refresh'),
            '<code>decode</code> sinh ra để đọc một token mà bạn ĐÃ tin (ví dụ client hiển thị "đang đăng nhập là…"). Nó không hề kiểm chứng. Hai cái bẫy ở ngay bên cạnh: sửa payload rồi gắn lại chữ ký cũ thì BỊ BẮT (<code>invalid signature</code>), và thuật toán phải do máy chủ chốt — một bộ kiểm tự viết mà tin vào <code>header.alg</code> đã phát quyền ADMIN hai lần, một lần qua <code>alg: none</code> và một lần qua nhầm lẫn thuật toán. Luôn truyền <code>algorithms</code>, <code>issuer</code> và <code>audience</code> vào <code>verify</code>.' +
              sim('nodejs-jwt-refresh', 'nodejs-8-2-jwt-access-refresh', 'Xem mô phỏng access + refresh'),
          ),
        }),

        mcq({
          prompt: B(
            'Refresh tokens are single-use. A refresh token that has already been redeemed is presented again. What should the server do?',
            'Refresh token chỉ dùng được một lần. Một refresh token đã đổi rồi lại được đưa lên lần nữa. Máy chủ nên làm gì?',
          ),
          options: [
            B('Issue a new pair anyway — the user probably lost the response', 'Cứ cấp cặp token mới — chắc người dùng bị mất phản hồi thôi'),
            B('Reject just that token and leave the rest of the session chain alive', 'Chỉ từ chối riêng token đó và để nguyên chuỗi phiên còn lại'),
            B('Revoke the WHOLE family of that login chain, because reuse cannot happen in honest operation', 'Thu hồi TOÀN BỘ họ của chuỗi đăng nhập đó, vì dùng lại là chuyện không thể xảy ra khi vận hành bình thường'),
            B('Ban the IP address permanently', 'Cấm vĩnh viễn địa chỉ IP đó'),
          ],
          correct: 2,
          explanation: EX(
            'Reuse means two parties hold the same token — you cannot tell which one is the thief, so you burn the family (<code>familyId</code>, one per login, growing by one row per rotation). Both are logged out; the real user logs in again with their password, which the thief does not have. Note the other design details: a refresh token is NOT a JWT (it is 256 random bits, stored as a SHA-256 hash, because it is checked against the database on every use anyway), and plain SHA-256 is correct here precisely because there is nothing to guess.',
            'Dùng lại nghĩa là hai bên cùng cầm một token — bạn không thể biết bên nào là kẻ trộm, nên đốt cả họ (<code>familyId</code>, mỗi lần đăng nhập một họ, mỗi lần xoay vòng thêm một dòng). Cả hai bị đăng xuất; người dùng thật đăng nhập lại bằng mật khẩu, thứ mà kẻ trộm không có. Để ý các chi tiết thiết kế khác: refresh token KHÔNG phải JWT (nó là 256 bit ngẫu nhiên, lưu dưới dạng băm SHA-256, vì đằng nào mỗi lần dùng cũng phải đối chiếu cơ sở dữ liệu), và ở đây SHA-256 trần là đúng chính vì chẳng có gì để đoán.',
          ),
        }),

        mcq({
          prompt: B(
            'Where should a browser app keep its access token, and why?',
            'Ứng dụng chạy trên trình duyệt nên giữ access token ở đâu, và vì sao?',
          ),
          options: [
            B('localStorage — it is immune to CSRF and that is the bigger risk', 'localStorage — miễn nhiễm CSRF và đó mới là rủi ro lớn hơn'),
            B('An HttpOnly cookie plus a CSRF defence — there is no option that is safe against both attacks alone', 'Cookie HttpOnly kèm một lớp chống CSRF — không có lựa chọn nào tự nó an toàn trước cả hai kiểu tấn công'),
            B('A cookie without HttpOnly, so the SPA can read and refresh it', 'Cookie không đặt HttpOnly, để ứng dụng SPA đọc và tự làm mới'),
            B('In a JavaScript variable in memory — nothing can ever reach it', 'Trong một biến JavaScript ở bộ nhớ — không gì chạm tới được'),
          ],
          correct: 1,
          explanation: EX(
            'localStorage is immune to CSRF and fully exposed to XSS (any injected script reads it and posts it away, and the token keeps working after the tab closes). An HttpOnly cookie is immune to XSS theft and exposed to CSRF, because the browser attaches it to every request to your domain whoever started it — a cross-site POST moved 100 million đồng in the lesson\'s run. Adopt in this order: <code>SameSite=Lax</code> on auth cookies, an Origin check on state-changing routes, then double-submit tokens (which work because evil.com can cause your cookie to be sent but can never read it) for anything irreversible.',
            'localStorage miễn nhiễm CSRF nhưng phơi hoàn toàn trước XSS (script chèn vào đọc được và gửi đi, token vẫn dùng được sau khi đóng tab). Cookie HttpOnly miễn nhiễm việc bị XSS lấy cắp nhưng hở CSRF, vì trình duyệt tự đính kèm nó vào mọi request tới tên miền của bạn bất kể ai khởi xướng — trong bài học, một POST xuyên trang đã chuyển đi 100 triệu đồng. Thứ tự áp dụng: <code>SameSite=Lax</code> cho cookie xác thực, kiểm Origin ở mọi route thay đổi trạng thái, rồi tới double-submit token (hiệu quả vì evil.com khiến cookie được gửi đi nhưng không bao giờ đọc được nó) cho những thao tác không thể hoàn tác.',
          ),
        }),

        // ── Chương 9 — Bảo mật ứng dụng ─────────────────────────────────
        mcq({
          prompt: B(
            'Adding <code>app.use(helmet())</code> to a bare Express app added 12 headers and removed one. Which statement is correct?',
            'Thêm <code>app.use(helmet())</code> vào một app Express trần đã thêm 12 header và bỏ đi một. Phát biểu nào ĐÚNG?',
          ),
          options: [
            B('It removed <code>x-powered-by</code>, and its <code>x-xss-protection: 0</code> is the correct modern value', 'Nó bỏ <code>x-powered-by</code>, và giá trị <code>x-xss-protection: 0</code> của nó là giá trị hiện đại ĐÚNG'),
            B('It removed <code>etag</code>, which is what stops cache poisoning', 'Nó bỏ <code>etag</code>, và đó là thứ chặn được đầu độc cache'),
            B('<code>x-xss-protection</code> should be set to 1 — helmet has a bug there', 'Phải đặt <code>x-xss-protection</code> bằng 1 — helmet bị lỗi ở chỗ này'),
            B('Its default CSP is safe to keep on any app that serves HTML', 'CSP mặc định của nó dùng được cho mọi ứng dụng phục vụ HTML'),
          ],
          correct: 0,
          explanation: EX(
            '<code>x-powered-by: Express</code> tells a scanner which CVEs to look up, and removing it is the cheapest possible win. <code>x-xss-protection: 0</code> deliberately turns OFF a legacy browser heuristic that was itself exploitable and has been removed from modern browsers — setting it to 1 is a step backwards. And helmet\'s default CSP WILL break an app that serves HTML: <code>script-src &#x27;self&#x27;</code> blocks every inline script including framework hydration, so the layer that renders HTML should own that header (this project sets <code>contentSecurityPolicy: false</code> in helmet because Next.js emits the page policy).',
            '<code>x-powered-by: Express</code> chỉ cho kẻ dò quét biết nên tra CVE của framework nào, bỏ nó đi là món hời rẻ nhất. <code>x-xss-protection: 0</code> cố ý TẮT một cơ chế đoán mò cũ của trình duyệt — bản thân nó từng bị khai thác và đã bị gỡ khỏi các trình duyệt hiện đại — nên đặt lại thành 1 là đi lùi. Còn CSP mặc định của helmet CHẮC CHẮN làm hỏng ứng dụng có phục vụ HTML: <code>script-src &#x27;self&#x27;</code> chặn mọi script nội tuyến kể cả phần hydrate của framework, nên tầng nào render HTML thì tầng đó sở hữu header này (dự án này đặt <code>contentSecurityPolicy: false</code> trong helmet vì Next.js đã phát ra policy của trang).',
          ),
        }),

        mcq({
          prompt: B(
            'A server with NO CORS configuration receives a cross-origin <code>POST /transfer</code> from evil.example. The balance goes from 1000 to 900. Explain.',
            'Một máy chủ KHÔNG cấu hình CORS nhận một <code>POST /transfer</code> xuyên nguồn từ evil.example. Số dư đi từ 1000 xuống 900. Giải thích?',
          ),
          options: [
            B('The server is misconfigured; correct CORS would have blocked the request', 'Máy chủ cấu hình sai; CORS đúng sẽ chặn được request đó'),
            B('CORS is a browser rule about who may READ a response — the request still arrived and still ran', 'CORS là luật của trình duyệt về việc ai được ĐỌC phản hồi — request vẫn tới nơi và vẫn chạy'),
            B('The browser must have had a bug', 'Chắc chắn trình duyệt bị lỗi'),
            B('Only <code>origin: &#x27;*&#x27;</code> allows this to happen', 'Chỉ khi đặt <code>origin: &#x27;*&#x27;</code> thì mới xảy ra chuyện này'),
          ],
          correct: 1,
          explanation: EX(
            'CORS is not authorization. Anything that is not a browser — curl, a script, a mobile app, another server — ignores it completely. If your reasoning ever contains "that endpoint is safe because CORS", replace it with authentication plus a CSRF defence. Two more traps from the same measurements: <code>origin: true</code> with <code>credentials: true</code> reflects ANY origin and hands your authenticated API to every page your user has open, while <code>origin: &#x27;*&#x27;</code> with credentials is forbidden by the spec so the browser refuses the response even though your server thinks it was permissive.',
            'CORS không phải là phân quyền. Bất cứ thứ gì không phải trình duyệt — curl, script, ứng dụng di động, một máy chủ khác — đều bỏ qua nó hoàn toàn. Nếu lập luận của bạn có câu "endpoint đó an toàn vì đã có CORS", hãy thay bằng xác thực cộng với chống CSRF. Thêm hai cái bẫy từ chính các phép đo đó: <code>origin: true</code> đi cùng <code>credentials: true</code> sẽ phản chiếu BẤT KỲ origin nào và dâng API đã xác thực của bạn cho mọi trang mà người dùng đang mở, còn <code>origin: &#x27;*&#x27;</code> cùng credentials thì bị chuẩn cấm nên trình duyệt từ chối phản hồi dù máy chủ tưởng mình đang dễ dãi.',
          ),
        }),

        mcq({
          prompt: B(
            'A home-made XSS filter runs <code>replace(/&lt;script.*?&gt;.*?&lt;\\/script&gt;/gi, &#x27;&#x27;)</code>. Fed the input <code>&lt;scr&lt;script&gt;ipt&gt;alert(1)&lt;/scr&lt;/script&gt;ipt&gt;</code> it output <code>&lt;script&gt;</code>. What is the lesson?',
            'Một bộ lọc XSS tự chế chạy <code>replace(/&lt;script.*?&gt;.*?&lt;\\/script&gt;/gi, &#x27;&#x27;)</code>. Với đầu vào <code>&lt;scr&lt;script&gt;ipt&gt;alert(1)&lt;/scr&lt;/script&gt;ipt&gt;</code> nó cho ra <code>&lt;script&gt;</code>. Bài học ở đây là gì?',
          ),
          options: [
            B('The regex only needs the global flag to catch nested tags too', 'Regex chỉ cần thêm cờ global là bắt được cả thẻ lồng nhau'),
            B('A single-pass replace JOINED the halves into the tag it was meant to remove', 'Một lần replace đã GHÉP hai nửa thành đúng cái thẻ nó định xoá'),
            B('The filter is fine as long as cookies are HttpOnly', 'Bộ lọc vẫn ổn miễn là cookie đặt HttpOnly'),
            B('Only DOMPurify can be trusted; sanitize-html has the same hole', 'Chỉ DOMPurify đáng tin; sanitize-html cũng dính lỗ này'),
          ],
          correct: 1,
          explanation: EX(
            'HTML is not a regular language and every hand-written filter has lost this race: the same filter also let through <code>&lt;img src=x onerror=…&gt;</code>, <code>&lt;svg/onload=…&gt;</code> and <code>&lt;a href="javascript:…"&gt;</code> untouched, while both real sanitizers stripped them and left legitimate markup intact. And HttpOnly is not a fix: a payload that does not read the cookie but simply calls <code>POST /notes/delete-all</code> runs inside the victim\'s session anyway — the browser attaches the cookie for you.',
            'HTML không phải ngôn ngữ chính quy, và mọi bộ lọc viết tay đều thua cuộc đua này: chính bộ lọc đó còn để lọt nguyên vẹn <code>&lt;img src=x onerror=…&gt;</code>, <code>&lt;svg/onload=…&gt;</code> và <code>&lt;a href="javascript:…"&gt;</code>, trong khi hai bộ sanitize thật đều loại sạch chúng mà vẫn giữ nguyên phần định dạng hợp lệ. Và HttpOnly không phải là cách chữa: một payload không thèm đọc cookie mà chỉ gọi <code>POST /notes/delete-all</code> vẫn chạy trong phiên của nạn nhân — trình duyệt tự đính kèm cookie giúp nó.',
          ),
        }),

        mcq({
          prompt: B(
            'The regex <code>/^(a+)+$/</code> tested against 30 characters took 9478.8ms, and a 100ms heartbeat was late by 7552ms. What is the right defence?',
            'Biểu thức <code>/^(a+)+$/</code> kiểm trên chuỗi 30 ký tự mất 9478,8ms, và nhịp tim 100ms trễ tới 7552ms. Cách phòng vệ ĐÚNG là gì?',
          ),
          options: [
            B('Wrap the regex in a timeout so it is cancelled after 100ms', 'Bọc regex trong một timeout để huỷ nó sau 100ms'),
            B('Cap the input length with a schema BEFORE any regex touches it, and prefer non-regex string operations', 'Chặn độ dài đầu vào bằng lược đồ TRƯỚC khi regex chạm tới, và ưu tiên các thao tác chuỗi không dùng regex'),
            B('Move the regex into a Promise so it stops blocking the event loop', 'Đưa regex vào một Promise để nó thôi chặn event loop'),
            B('Nothing needed — 31 characters is too small to be an attack', 'Không cần làm gì — 31 ký tự thì bé quá, không tấn công được'),
          ],
          correct: 1,
          explanation: EX(
            'A regular expression is synchronous JavaScript: there is nothing to interrupt, so a timeout does not exist and a Promise changes nothing (chapter 2). Exponential growth on a BOUNDED input is a bounded cost, which is why the length cap comes first. Spot the pattern by shape: a quantifier wrapping a group that already has one — <code>(a+)+</code>, <code>(a*)*</code>, <code>(\\s+)+</code>. The "trim trailing whitespace" regex <code>/^([\\s\\S]*?)(\\s+)+$/</code> exploded at 28 spaces, so this is not a toy.' +
              sim('nodejs-input-attacks', 'nodejs-9-3-dau-vao-doc-hai', 'Watch input attacks'),
            'Biểu thức chính quy là JavaScript đồng bộ: chẳng có gì để ngắt, nên timeout không tồn tại và bọc vào Promise cũng vô nghĩa (chương 2). Tăng trưởng hàm mũ trên đầu vào ĐÃ BỊ CHẶN thì chi phí cũng bị chặn — vì thế phải giới hạn độ dài trước tiên. Nhận diện mẫu nguy hiểm bằng hình dạng: một lượng từ bọc quanh nhóm vốn đã có lượng từ — <code>(a+)+</code>, <code>(a*)*</code>, <code>(\\s+)+</code>. Regex "cắt khoảng trắng cuối" <code>/^([\\s\\S]*?)(\\s+)+$/</code> đã bùng nổ ở 28 dấu cách, nên đây không phải ví dụ đồ chơi.' +
              sim('nodejs-input-attacks', 'nodejs-9-3-dau-vao-doc-hai', 'Xem mô phỏng các đòn tấn công đầu vào'),
          ),
        }),

        mcq({
          prompt: B(
            'A link-preview endpoint validates the URL: https only, hostname on an allow-list. An attacker supplies an allowed https host that answers <b>302</b> pointing at <code>http://127.0.0.1:4404/admin/config</code>, and the internal config leaks. Why?',
            'Một endpoint xem trước liên kết có kiểm URL: chỉ https, tên miền nằm trong danh sách trắng. Kẻ tấn công đưa một host https hợp lệ nhưng trả về <b>302</b> trỏ sang <code>http://127.0.0.1:4404/admin/config</code>, và cấu hình nội bộ bị lộ. Vì sao?',
          ),
          options: [
            B('The allow-list was too short; add more hostnames', 'Danh sách trắng còn thiếu; thêm vài tên miền nữa là xong'),
            B('<code>fetch</code> follows redirects by default and the validation only ever saw the FIRST URL', '<code>fetch</code> mặc định đi theo chuyển hướng, còn phần kiểm chỉ nhìn thấy URL ĐẦU TIÊN'),
            B('127.0.0.1 should have been in the allow-list as a blocked entry', 'Đáng lẽ phải đưa 127.0.0.1 vào danh sách trắng dưới dạng mục bị chặn'),
            B('The firewall was misconfigured on the internal service', 'Dịch vụ nội bộ cấu hình tường lửa sai'),
          ],
          correct: 1,
          explanation: EX(
            'That is SSRF: the firewall did nothing wrong, because the request came from inside. Checking the hostname is necessary and not sufficient — use <code>redirect: &#x27;manual&#x27;</code> and re-validate every hop, resolve the hostname and reject private IP ranges, and best of all do not take URLs at all: accept an identifier and build the URL server-side. Note what a regex on the URL cannot do: <code>http://127.1</code>, <code>http://[::1]</code>, <code>http://2130706433</code> and <code>http://localhost.evil.example</code> all reach loopback.',
            'Đó là SSRF: tường lửa không hề sai, vì request xuất phát từ bên trong. Kiểm tên miền là cần nhưng chưa đủ — hãy dùng <code>redirect: &#x27;manual&#x27;</code> và kiểm lại từng chặng, phân giải tên miền rồi từ chối các dải IP nội bộ, và tốt nhất là đừng nhận URL: hãy nhận một mã định danh rồi tự dựng URL ở phía máy chủ. Để ý điều mà một regex trên URL không làm nổi: <code>http://127.1</code>, <code>http://[::1]</code>, <code>http://2130706433</code> và <code>http://localhost.evil.example</code> đều về loopback.',
          ),
        }),

        // ── Chương 10 — Upload & object storage ─────────────────────────
        mcq({
          prompt: B(
            'Four clients upload a 120MB video at the same moment into <code>multer.memoryStorage()</code>. Server RSS went from 56.7MB to 786.1MB. What is the right conclusion?',
            'Bốn người cùng lúc tải lên video 120MB vào <code>multer.memoryStorage()</code>. RSS của máy chủ đi từ 56,7MB lên 786,1MB. Kết luận đúng là gì?',
          ),
          options: [
            B('Raise the container memory limit and keep memoryStorage', 'Nâng giới hạn bộ nhớ của container rồi cứ dùng memoryStorage'),
            B('Buffering costs about twice the file size per upload — stream, or presign', 'Đệm RAM tốn khoảng gấp đôi kích thước file mỗi lượt — hãy stream, hoặc presign'),
            B('multer is inefficient; base64 in JSON would use less memory', 'multer kém hiệu quả; nhét base64 trong JSON sẽ tốn ít bộ nhớ hơn'),
            B('A <code>limits.fileSize</code> option would have prevented the memory growth', 'Chỉ cần đặt <code>limits.fileSize</code> là hết phình bộ nhớ'),
          ],
          correct: 1,
          explanation: EX(
            'Streaming the same 120MB cost +40.3MB instead of +248.1MB (and took 136ms longer — the honest trade). Base64 in JSON is the worst of all: 33% bigger on the wire and 6.9× the file in RAM. And a size limit does not save the memory of files under the limit — it also cannot save bandwidth, because the client has already uploaded everything before hearing 413. Rule of thumb: memoryStorage for images under ~10MB (you need the buffer for sharp anyway), streaming or presigned for anything over 50MB.',
            'Cũng 120MB đó, stream chỉ tốn +40,3MB thay vì +248,1MB (và mất thêm 136ms — đó là cái giá sòng phẳng). Base64 trong JSON tệ nhất: nặng thêm 33% trên đường truyền và ngốn RAM gấp 6,9 lần kích thước file. Còn giới hạn kích thước không cứu được bộ nhớ của những file dưới ngưỡng — nó cũng không cứu được băng thông, vì client đã tải lên xong xuôi rồi mới nghe được mã 413. Nguyên tắc: memoryStorage cho ảnh dưới ~10MB (đằng nào cũng cần buffer để đưa vào sharp), stream hoặc presigned cho bất cứ thứ gì trên 50MB.',
          ),
        }),

        mcq({
          prompt: B(
            'A presigned PUT is generated with <code>ContentType: &#x27;video/mp4&#x27;</code>. The client uses that exact URL but sends <code>Content-Type: text/html</code> with a <code>&lt;script&gt;</code> body — and storage accepts it. Why, and what is the fix?',
            'Một presigned PUT được ký kèm <code>ContentType: &#x27;video/mp4&#x27;</code>. Client dùng đúng URL đó nhưng gửi <code>Content-Type: text/html</code> với thân là <code>&lt;script&gt;</code> — và kho lưu trữ vẫn nhận. Vì sao, và sửa thế nào?',
          ),
          options: [
            B('The signature covers only <code>host</code> — sign <code>content-type</code> too', 'Chữ ký chỉ bao <code>host</code> — hãy ký kèm cả <code>content-type</code>'),
            B('The URL had expired, and expired URLs stop validating the type', 'URL đã hết hạn, mà URL hết hạn thì thôi không kiểm kiểu nữa'),
            B('The bucket is missing a CORS rule for the site origin', 'Bucket thiếu quy tắc CORS cho origin của trang'),
            B('It is harmless because the key still ends in .mp4', 'Vô hại thôi vì key vẫn kết thúc bằng .mp4'),
          ],
          correct: 0,
          explanation: EX(
            'The ContentType you pass to <code>PutObjectCommand</code> is a default, not a constraint, unless it is in the signature. The result is 39 bytes of attacker HTML stored under a .mp4 key with <code>Content-Type: text/html</code> on your media domain — stored XSS arriving through the upload door. Remember what the signature DOES cover: the method, the key, the bucket and the deadline (editing the key gives <code>SignatureDoesNotMatch</code>; using it late gives <code>Request has expired</code>). It does not cover the body or the size — so verify with <code>HeadObject</code> after the client says "done".',
            'ContentType bạn truyền vào <code>PutObjectCommand</code> chỉ là giá trị mặc định, không phải ràng buộc, trừ khi nó nằm trong chữ ký. Hậu quả là 39 byte HTML của kẻ tấn công nằm dưới một key .mp4 với <code>Content-Type: text/html</code> ngay trên tên miền media của bạn — XSS lưu trữ đi vào bằng cửa upload. Nhớ những gì chữ ký CÓ bao: phương thức, key, bucket và hạn dùng (sửa key sẽ ra <code>SignatureDoesNotMatch</code>; dùng muộn sẽ ra <code>Request has expired</code>). Nó không bao thân request lẫn kích thước — nên phải gọi <code>HeadObject</code> kiểm lại sau khi client báo "xong".',
          ),
        }),

        mcq({
          prompt: B(
            'Your API validated that the client declared a 5MB file before signing a presigned PUT. The client then PUTs 120MB to the same URL and storage accepts it. What must the "complete" step do?',
            'API của bạn đã kiểm client khai file 5MB trước khi ký presigned PUT. Sau đó client PUT 120MB lên đúng URL ấy và kho lưu trữ vẫn nhận. Bước "hoàn tất" phải làm gì?',
          ),
          options: [
            B('Trust the client — it already passed validation at presign time', 'Cứ tin client — nó đã qua bước kiểm lúc xin ký rồi'),
            B('Call <code>HeadObject</code>, re-check the REAL size, and delete + reject anything oversized', 'Gọi <code>HeadObject</code>, kiểm lại kích thước THẬT, và xoá + từ chối nếu vượt ngưỡng'),
            B('Shorten the expiry to 30 seconds, which caps the upload size', 'Rút hạn xuống 30 giây, thế là chặn được kích thước tải lên'),
            B('Nothing — S3 enforces the declared Content-Length', 'Không cần gì — S3 tự áp Content-Length đã khai'),
          ],
          correct: 1,
          explanation: EX(
            'A presigned PUT carries no size ceiling: the declared size was input to YOUR validation, not to the signature. Two defences and you want both — a presigned POST policy supports a <code>content-length-range</code> condition, and a HeadObject check after the fact catches everything else. The same call also closes a second hole: without it a client can skip the upload entirely and still get a database row pointing at nothing.',
            'Presigned PUT không mang theo trần kích thước: con số client khai chỉ là đầu vào cho phép kiểm CỦA BẠN, không nằm trong chữ ký. Có hai lớp phòng vệ và nên dùng cả hai — presigned POST hỗ trợ điều kiện <code>content-length-range</code>, còn kiểm bằng HeadObject sau đó bắt được phần còn lại. Chính lời gọi ấy còn bịt một lỗ thứ hai: thiếu nó thì client có thể bỏ qua hẳn bước tải lên mà vẫn có một dòng dữ liệu trỏ vào hư không.',
          ),
        }),

        mcq({
          prompt: B(
            'A file starting with the six bytes <code>GIF89a</code> followed by <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> is reported by <code>file-type</code> as <code>image/gif</code> and passes an <code>image/*</code> allow-list. What is the only reliable check?',
            'Một file bắt đầu bằng sáu byte <code>GIF89a</code> rồi tới <code>&lt;script&gt;alert(1)&lt;/script&gt;</code> được <code>file-type</code> nhận là <code>image/gif</code> và lọt qua danh sách trắng <code>image/*</code>. Phép kiểm ĐÁNG TIN duy nhất là gì?',
          ),
          options: [
            B('Check the file extension as well as the MIME type', 'Kiểm cả đuôi file lẫn kiểu MIME'),
            B('Decode it: re-encode with sharp, which throws on a corrupt header', 'Giải mã nó: cho qua sharp mã hoá lại, header hỏng là sharp ném lỗi'),
            B('Scan the whole file for the string <code>&lt;script&gt;</code>', 'Quét toàn bộ file tìm chuỗi <code>&lt;script&gt;</code>'),
            B('Rename it to .gif and serve it with <code>nosniff</code>', 'Đổi tên thành .gif rồi phục vụ kèm <code>nosniff</code>'),
          ],
          correct: 1,
          explanation: EX(
            'Sniffing reads six bytes; a decoder reads all of them and refuses what does not parse (<code>sharp</code> threw <em>Input buffer has corrupt header</em> on this polyglot). Grep-for-&lt;script&gt; fails on the harder case in the same lesson: a genuine 6.85MB JPEG with HTML appended decodes perfectly, because JPEG readers stop at the end-of-image marker — and re-encoding removed the payload. Re-encoding is also what strips EXIF, including the GPS coordinates of the photographer\'s house.',
            'Đánh hơi chỉ đọc sáu byte; bộ giải mã đọc hết và từ chối những gì không phân tích nổi (<code>sharp</code> đã ném <em>Input buffer has corrupt header</em> với chính file lai này). Cách quét tìm &lt;script&gt; thất bại ở ca khó hơn trong cùng bài học: một ảnh JPEG thật 6,85MB bị nối thêm HTML vẫn giải mã hoàn hảo, vì bộ đọc JPEG dừng ở dấu kết thúc ảnh — và mã hoá lại đã loại sạch phần đính kèm đó. Mã hoá lại cũng chính là thứ xoá EXIF, trong đó có toạ độ GPS nhà của người chụp.',
          ),
        }),

        mcq({
          prompt: B(
            'Media objects are stored with <code>Cache-Control: public, max-age=31536000, immutable</code>. What makes that safe, and what breaks it?',
            'Các object media được lưu kèm <code>Cache-Control: public, max-age=31536000, immutable</code>. Điều gì khiến nó AN TOÀN, và điều gì phá vỡ nó?',
          ),
          options: [
            B('Safe because the CDN revalidates every hour behind your back', 'An toàn vì CDN vẫn âm thầm kiểm lại mỗi giờ'),
            B('Safe because keys are unique, so a changed image is a NEW key', 'An toàn vì key luôn duy nhất, nên ảnh đổi là một key MỚI'),
            B('Safe only for images; videos must never be immutable', 'Chỉ an toàn với ảnh; video thì tuyệt đối không được immutable'),
            B('Safe because browsers ignore max-age above 24 hours', 'An toàn vì trình duyệt bỏ qua max-age lớn hơn 24 giờ'),
          ],
          correct: 1,
          explanation: EX(
            '<code>immutable</code> means the browser will not even send a conditional request, so a repeat view costs zero network — and it is a promise you can only keep if keys are content-addressed. Put <code>immutable</code> on a mutable key like <code>avatars/u7.jpg</code> that you overwrite and users see the old avatar for a year, with refreshing powerless. One more trap from the same lesson: verify a CDN with a real GET (<code>curl -s -o /dev/null -D -</code>) and read <code>age</code> — <code>curl -I</code> sends HEAD, which Cloudflare answers <code>cf-cache-status: DYNAMIC</code> even while the object is being served from the edge to everyone else.',
            '<code>immutable</code> nghĩa là trình duyệt thậm chí không gửi request có điều kiện, nên xem lại lần nữa tốn 0 byte mạng — và đó là lời hứa chỉ giữ được khi key gắn với nội dung. Đặt <code>immutable</code> lên một key thay đổi được như <code>avatars/u7.jpg</code> rồi ghi đè lên đó thì người dùng nhìn ảnh đại diện cũ suốt một năm, tải lại cũng vô ích. Thêm một cái bẫy trong cùng bài: kiểm CDN bằng GET thật (<code>curl -s -o /dev/null -D -</code>) rồi đọc <code>age</code> — <code>curl -I</code> gửi HEAD, mà Cloudflare trả lời HEAD bằng <code>cf-cache-status: DYNAMIC</code> ngay cả khi object đang được phục vụ từ biên cho tất cả mọi người.',
          ),
        }),

        // ── Chương 11 — Realtime ────────────────────────────────────────
        mcq({
          prompt: B(
            'Twenty authenticated polls of <code>GET /messages/unread</code>, every answer <code>{"unread":0}</code>, cost 15,980 bytes — 799 bytes each. Twenty real messages pushed over one WebSocket cost 2,082 bytes including the handshake. Where does the 799 bytes go?',
            'Hai mươi lần hỏi thăm có xác thực tới <code>GET /messages/unread</code>, lần nào cũng trả <code>{"unread":0}</code>, tốn 15.980 byte — mỗi lần 799 byte. Hai mươi tin nhắn thật đẩy qua một WebSocket tốn 2.082 byte kể cả bắt tay. 799 byte đó đi đâu?',
          ),
          options: [
            B('Mostly the JSON body, which is 47 bytes of data plus formatting', 'Chủ yếu là thân JSON, gồm 47 byte dữ liệu cộng phần định dạng'),
            B('Mostly HTTP headers — the cookie alone is ~250 bytes, every poll', 'Chủ yếu là header HTTP — riêng cookie đã ~250 byte, lần hỏi nào cũng có'),
            B('TLS overhead, which a WebSocket does not pay', 'Chi phí TLS, thứ mà WebSocket không phải trả'),
            B('The URL and the query string of the request', 'Đường dẫn URL và chuỗi truy vấn của request'),
          ],
          correct: 1,
          explanation: EX(
            'The body is 47 bytes; everything else is headers, and that was the GENEROUS case (keep-alive on, so no TCP or TLS handshake per poll). Scale it: 10,000 people polling every 3 seconds for an hour is 12,000,000 requests and 8.93GB to transmit nothing — and each of those requests also runs your auth middleware and occupies an event-loop tick. Polling is not always wrong: for an event that happens hourly, a one-minute poll is 60 requests/hour and needs no new infrastructure. The trap is a 2-second poll imitating realtime.',
            'Thân phản hồi là 47 byte; phần còn lại là header, và đó đã là trường hợp RỘNG RÃI nhất (bật keep-alive nên không phải bắt tay TCP hay TLS mỗi lần). Nhân lên: 10.000 người hỏi mỗi 3 giây trong một giờ là 12.000.000 request và 8,93GB để truyền đi con số không — mà mỗi request ấy còn chạy middleware xác thực và chiếm một nhịp event loop. Hỏi vòng không phải lúc nào cũng sai: với sự kiện mỗi giờ mới có một lần thì hỏi mỗi phút chỉ tốn 60 request/giờ và chẳng cần hạ tầng mới. Cái bẫy là hỏi mỗi 2 giây để giả làm realtime.',
          ),
        }),

        mcq({
          prompt: B(
            'A socket server checks the JWT in the handshake middleware, then registers:' + code(
              "socket.on('thread:join', (threadId) => {\n" +
              "  if (typeof threadId === 'number') socket.join(`thread:${threadId}`);\n" +
              '});',
            ) + 'A legitimately logged-in user emits <code>thread:join</code> with a stranger\'s thread id. What happens?',
            'Một máy chủ socket kiểm JWT trong middleware bắt tay, rồi đăng ký:' + code(
              "socket.on('thread:join', (threadId) => {\n" +
              "  if (typeof threadId === 'number') socket.join(`thread:${threadId}`);\n" +
              '});',
            ) + 'Một người dùng đã đăng nhập hợp lệ phát <code>thread:join</code> với id cuộc trò chuyện của người lạ. Chuyện gì xảy ra?',
          ),
          options: [
            B('The handshake check already covers it — the user cannot join', 'Phép kiểm lúc bắt tay đã lo rồi — người dùng không vào được'),
            B('They join the room and receive the private messages live; a type check is not a permission check', 'Họ vào được phòng và nhận tin nhắn riêng tư theo thời gian thực; kiểm kiểu dữ liệu không phải kiểm quyền'),
            B('Socket.IO rejects the join because the socket is not in the room', 'Socket.IO từ chối vì socket chưa ở trong phòng đó'),
            B('Nothing, because thread ids are UUIDs and cannot be guessed', 'Không sao, vì id cuộc trò chuyện là UUID nên không đoán được'),
          ],
          correct: 1,
          explanation: EX(
            'This exact line was in this site\'s production code until the lesson was written. Authentication happens once at the handshake; authorization must happen in EVERY handler, because every <code>socket.on</code> is an endpoint — it just has no URL, no route table and no middleware chain to hang the check on. Thread ids are sequential integers, so "guessing" is a for loop, and because it all happens over a socket there is no <code>GET /threads/99</code> and no 403 in your access logs to alert on.',
            'Đúng dòng lệnh này từng nằm trong mã production của chính trang web này cho tới khi bài học được viết ra. Xác thực chỉ diễn ra một lần lúc bắt tay; phân quyền phải diễn ra ở MỌI handler, vì mỗi <code>socket.on</code> chính là một endpoint — chỉ là nó không có URL, không có bảng route và không có dây chuyền middleware để móc phép kiểm vào. Id cuộc trò chuyện là số nguyên tăng dần nên "đoán" chỉ là một vòng for, và vì mọi thứ đi qua socket nên không có <code>GET /threads/99</code> và không có mã 403 nào trong log để mà cảnh báo.',
          ),
        }),

        mcq({
          prompt: B(
            'Two identical Socket.IO processes, no Redis adapter. A client is connected to process A; process B emits to the client\'s room. B reports <code>emitMs: 0.42</code> and no error. What does the client receive?',
            'Hai tiến trình Socket.IO giống hệt nhau, không gắn adapter Redis. Client đang nối vào tiến trình A; tiến trình B phát tin vào phòng của client đó. B báo <code>emitMs: 0.42</code> và không lỗi. Client nhận được gì?',
          ),
          options: [
            B('The message, after a slightly longer delay than usual', 'Nhận được tin, chỉ trễ hơn bình thường một chút'),
            B('Nothing — rooms live in one process, so B\'s room is genuinely empty', 'Không gì cả — phòng nằm trong một tiến trình, phòng của B thật sự rỗng'),
            B('An error, which the client surfaces as <code>connect_error</code>', 'Một lỗi, hiện ra ở client dưới dạng <code>connect_error</code>'),
            B('The message twice, once per process', 'Nhận tin hai lần, mỗi tiến trình một lần'),
          ],
          correct: 1,
          explanation: EX(
            'This is the bug that produces no error: nothing to log, nothing to alert on, and the symptom in production is "messages arrive sometimes", which people blame on the network for weeks. The Redis adapter publishes every broadcast to a channel so each process replays it to its own local sockets (cross-process delivery measured at 5.02ms). Note it solves only half the problem: the adapter does NOT make a session portable, so long-polling still needs sticky sessions — or you set <code>transports: [&#x27;websocket&#x27;]</code> and give up the fallback.',
            'Đây là loại lỗi không sinh ra lỗi: không có gì để ghi log, không có gì để cảnh báo, và triệu chứng trên production là "tin nhắn lúc tới lúc không", thứ mà người ta đổ cho đường mạng suốt mấy tuần. Adapter Redis đăng mọi lệnh phát lên một kênh để từng tiến trình phát lại cho các socket cục bộ của mình (đo được 5,02ms cho một lần giao xuyên tiến trình). Lưu ý nó chỉ giải quyết một nửa: adapter KHÔNG làm cho phiên di chuyển được giữa các tiến trình, nên long-polling vẫn cần sticky session — hoặc bạn đặt <code>transports: [&#x27;websocket&#x27;]</code> và chấp nhận bỏ đường lui.',
          ),
        }),

        mcq({
          prompt: B(
            'One client stops reading. The server keeps calling <code>ws.send()</code>: 3000 messages × 64KB. <code>readyState</code> stays 1 (OPEN), no error is raised, and server RSS grows by 192MB. What is the correct guard?',
            'Một client ngừng đọc. Máy chủ vẫn gọi <code>ws.send()</code>: 3000 tin × 64KB. <code>readyState</code> vẫn là 1 (OPEN), không lỗi nào được ném, và RSS của máy chủ phình thêm 192MB. Lá chắn đúng là gì?',
          ),
          options: [
            B('Check <code>ws.bufferedAmount</code> before writing; drop above a threshold', 'Kiểm <code>ws.bufferedAmount</code> trước khi ghi; vượt ngưỡng thì bỏ tin'),
            B('Increase <code>pingTimeout</code> so the client is not disconnected', 'Tăng <code>pingTimeout</code> để client khỏi bị ngắt'),
            B('Catch the error <code>send()</code> throws and retry later', 'Bắt lỗi mà <code>send()</code> ném ra rồi thử lại sau'),
            B('Nothing — TCP backpressure already protects the server', 'Không cần gì — cơ chế áp lực ngược của TCP đã bảo vệ máy chủ'),
          ],
          correct: 0,
          explanation: EX(
            'TCP applies backpressure to the WIRE, and everything you keep sending piles up in YOUR memory — <code>bufferedAmount</code> was 187MB and <code>send()</code> never complained. Dropping frames is the correct behaviour, and it is only acceptable because of the design rule from the same chapter: the socket is a signal, REST is the truth. A client that missed frames refetches with <code>?since=&lt;last id&gt;</code> and is whole again. Remember reconnect loses buffered messages anyway and gives the client a NEW socket id, so every room must be re-joined in the connect handler.',
            'TCP tạo áp lực ngược trên ĐƯỜNG TRUYỀN, còn mọi thứ bạn vẫn tiếp tục gửi thì chất đống trong BỘ NHỚ CỦA BẠN — <code>bufferedAmount</code> đã lên 187MB mà <code>send()</code> chẳng hé răng. Bỏ bớt khung tin mới là hành vi đúng, và nó chỉ chấp nhận được nhờ nguyên tắc thiết kế trong cùng chương: socket là tín hiệu, REST mới là sự thật. Client lỡ mất vài khung sẽ gọi lại <code>?since=&lt;id cuối&gt;</code> và đầy đủ trở lại. Cũng nhớ rằng kết nối lại vốn đã làm mất các tin trong lúc offline và cấp cho client một socket id MỚI, nên mọi phòng đều phải join lại trong hàm xử lý connect.',
          ),
        }),

        // ── Chương 12 — Redis ───────────────────────────────────────────
        mcq({
          prompt: B(
            '10,000 SET commands each awaited took 1965.3ms (5,088 ops/s). The same 10,000 in one pipeline took 31.1ms (321,960 ops/s). Why?',
            '10.000 lệnh SET, mỗi lệnh await riêng, mất 1965,3ms (5.088 lệnh/giây). Cũng 10.000 lệnh ấy trong một pipeline mất 31,1ms (321.960 lệnh/giây). Vì sao?',
          ),
          options: [
            B('A pipeline compresses the commands before sending', 'Pipeline nén các lệnh lại trước khi gửi'),
            B('The cost is the per-command round trip; a pipeline pays it once', 'Chi phí nằm ở vòng đi-về của từng lệnh; pipeline chỉ trả một lần'),
            B('Redis runs pipelined commands on multiple threads', 'Redis chạy các lệnh trong pipeline trên nhiều luồng'),
            B('The pipeline skips the disk write that a single SET performs', 'Pipeline bỏ qua bước ghi đĩa mà một lệnh SET đơn lẻ phải làm'),
          ],
          correct: 1,
          explanation: EX(
            '2000 PINGs — the command that does no work at all — cost 0.204ms each, so the socket round trip is the entire bill. Two consequences worth memorising: whenever you are about to loop over ids and GET each one, look for the plural (MGET was 127× faster than 1000 sequential GETs); and batch in chunks of 100–1000 rather than "all of it", because Redis is single-threaded and a giant pipeline blocks every other client while it runs (1 → 100 buys 49×, 1000 → 10000 buys 8%).',
            '2000 lệnh PING — lệnh chẳng làm gì cả — tốn 0,204ms mỗi lệnh, nên toàn bộ hoá đơn nằm ở vòng đi-về qua socket. Hai hệ quả đáng nhớ: hễ định lặp qua danh sách id rồi GET từng cái thì hãy tìm bản số nhiều (MGET nhanh hơn 1000 lệnh GET tuần tự 127 lần); và hãy gom theo lô 100–1000 lệnh chứ đừng "gom hết", vì Redis chạy một luồng và một pipeline khổng lồ sẽ chặn mọi client khác trong lúc nó chạy (từ 1 lên 100 lời 49 lần, từ 1000 lên 10000 chỉ lời 8%).',
          ),
        }),

        mcq({
          prompt: B(
            'A rate limiter does <code>INCR key</code> then <code>EXPIRE key 60</code> as two commands. A user ends up permanently rate-limited with nothing in the logs. What happened?',
            'Một bộ giới hạn tần suất chạy <code>INCR key</code> rồi <code>EXPIRE key 60</code> thành hai lệnh riêng. Một người dùng bị chặn vĩnh viễn mà log chẳng ghi gì. Chuyện gì đã xảy ra?',
          ),
          options: [
            B('The counter overflowed and wrapped around to a huge number', 'Bộ đếm tràn số rồi quay vòng thành một con số khổng lồ'),
            B('Something died between the two commands: the key has TTL -1 forever', 'Có thứ gì đó chết giữa hai lệnh: khoá mang TTL -1 vĩnh viễn'),
            B('Redis evicted the EXPIRE command under memory pressure', 'Redis đã loại bỏ lệnh EXPIRE khi thiếu bộ nhớ'),
            B('EXPIRE only works on keys created with SET, not INCR', 'EXPIRE chỉ tác dụng với khoá tạo bằng SET, không tác dụng với INCR'),
          ],
          correct: 1,
          explanation: EX(
            'Each individual Redis command is atomic; your SEQUENCE of commands is not, because other clients — and failures — happen in between. Fix with MULTI/EXEC or a Lua script that sets the expiry only on the first increment; Lua also collapses two round trips into one. TTL values worth memorising: <b>-1</b> = the key exists but has no expiry (immortal), <b>-2</b> = the key is gone. The same trap has a sibling: a plain <code>SET</code> over a key that had an expiry REMOVES that expiry — use <code>KEEPTTL</code> when you mean "new value, same deadline".' +
              sim('nodejs-atomic-redis', 'nodejs-12-4-nguyen-tu-rate-limit-lock', 'Watch atomicity'),
            'Từng lệnh Redis riêng lẻ là nguyên tử; nhưng CHUỖI lệnh của bạn thì không, vì giữa chúng còn có client khác — và cả sự cố. Sửa bằng MULTI/EXEC hoặc một script Lua chỉ đặt hạn ở lần tăng đầu tiên; Lua còn gộp hai vòng đi-về thành một. Hai giá trị TTL nên thuộc lòng: <b>-1</b> = khoá tồn tại nhưng không có hạn (bất tử), <b>-2</b> = khoá đã biến mất. Cái bẫy này có một người anh em: một lệnh <code>SET</code> trần đè lên khoá đang có hạn sẽ XOÁ luôn cái hạn đó — hãy dùng <code>KEEPTTL</code> khi ý bạn là "giá trị mới, hạn cũ".' +
              sim('nodejs-atomic-redis', 'nodejs-12-4-nguyen-tu-rate-limit-lock', 'Xem mô phỏng tính nguyên tử'),
          ),
        }),

        mcq({
          prompt: B(
            'A leaderboard key expires. Two hundred in-flight requests all miss and all run the same 48ms aggregate query: 6064.6ms total. Which fix removes the most damage for the least code?',
            'Một khoá bảng xếp hạng hết hạn. Hai trăm request đang bay đều trượt cache và đều chạy cùng một câu tổng hợp 48ms: tổng 6064,6ms. Cách sửa nào gỡ được nhiều thiệt hại nhất với ít mã nhất?',
          ),
          options: [
            B('Raise the TTL so it expires less often', 'Nâng TTL lên để nó ít hết hạn hơn'),
            B('Single-flight: 199 requests await the in-flight promise — one query, 65.3ms', 'Single-flight: 199 request cùng chờ promise đang chạy — một truy vấn, 65,3ms'),
            B('Warm every cache key at deploy time with the same TTL', 'Nạp sẵn mọi khoá cache lúc deploy với cùng một TTL'),
            B('Switch to write-through caching so the cache is never empty', 'Chuyển sang cache ghi-xuyên (write-through) để cache không bao giờ rỗng'),
          ],
          correct: 1,
          explanation: EX(
            'Twelve lines, one query instead of 200, 93× faster — and it works because the event loop is single-threaded, so nothing runs between the <code>has</code> and the <code>set</code>. Its limit is in the name: in-process, so four containers means four queries (still 50× better). Note why option C is actively harmful: 50 keys warmed in the same second with the same TTL all expire in the same second later — a synchronised stampede across DIFFERENT keys, which no per-key lock helps with. Add jitter: <code>EX 60 + Math.floor(Math.random() * 30)</code>.' +
              sim('nodejs-cache-aside', 'nodejs-12-2-cache-aside', 'Watch cache-aside'),
            'Mười hai dòng, một câu truy vấn thay vì 200, nhanh gấp 93 lần — và nó chạy được vì event loop đơn luồng, không có gì chen vào giữa <code>has</code> và <code>set</code>. Giới hạn nằm ngay trong tên: chỉ trong một tiến trình, nên bốn container là bốn câu truy vấn (vẫn tốt hơn 50 lần). Để ý vì sao phương án C lại có hại: 50 khoá nạp sẵn trong cùng một giây với cùng TTL sẽ cùng hết hạn trong một giây — một cơn giẫm đạp đồng bộ trên các khoá KHÁC NHAU, mà khoá theo từng key không cứu được. Hãy thêm nhiễu: <code>EX 60 + Math.floor(Math.random() * 30)</code>.' +
              sim('nodejs-cache-aside', 'nodejs-12-2-cache-aside', 'Xem mô phỏng cache-aside'),
          ),
        }),

        mcq({
          prompt: B(
            'On a Redis holding 1,000,000 keys: <code>KEYS *</code> returned in 343.86ms while another client\'s PING went from 0.46ms to a worst case of 126.96ms. <code>SCAN</code> took 857.41ms in total but the other client\'s worst PING was 6.87ms. Which is right for production, and why?',
            'Trên một Redis chứa 1.000.000 khoá: <code>KEYS *</code> trả về sau 343,86ms trong khi PING của client khác đi từ 0,46ms lên tệ nhất 126,96ms. <code>SCAN</code> tốn tổng cộng 857,41ms nhưng PING tệ nhất của client khác chỉ 6,87ms. Cái nào đúng cho production, và vì sao?',
          ),
          options: [
            B('KEYS — it is 2.5× faster overall, and total time is what matters', 'KEYS — nhanh hơn 2,5 lần về tổng thời gian, mà tổng thời gian mới là thứ đáng quan tâm'),
            B('SCAN — the number that matters is the latency everyone ELSE pays', 'SCAN — con số đáng quan tâm là độ trễ mà MỌI NGƯỜI KHÁC phải chịu'),
            B('Neither; use <code>DEBUG</code> to list keys instead', 'Không cái nào; hãy dùng <code>DEBUG</code> để liệt kê khoá'),
            B('KEYS, as long as you run it from a separate connection', 'Cứ KEYS, miễn là chạy từ một kết nối riêng'),
          ],
          correct: 1,
          explanation: EX(
            'One admin script with a <code>KEYS *</code> in it produces a site-wide latency spike that looks like a network problem. SCAN returns a cursor and a batch, so Redis serves other clients between rounds (it may repeat keys — de-duplicate if that matters). The same reasoning covers <code>HGETALL</code>/<code>LRANGE 0 -1</code>/<code>SMEMBERS</code> on huge collections (use HSCAN/SSCAN/ZSCAN) and deletion: <code>DEL</code> on a million-field hash blocked everyone for 205ms, <code>UNLINK</code> did the same job in 0.37ms by freeing memory in a background thread.',
            'Chỉ một script quản trị có <code>KEYS *</code> là đủ tạo ra một cú vọt độ trễ toàn site, nhìn y hệt sự cố mạng. SCAN trả về con trỏ kèm một lô, nên giữa các vòng Redis vẫn phục vụ client khác (nó có thể trả trùng khoá — cần thì tự khử trùng lặp). Cùng lập luận đó áp cho <code>HGETALL</code>/<code>LRANGE 0 -1</code>/<code>SMEMBERS</code> trên tập lớn (hãy dùng HSCAN/SSCAN/ZSCAN) và cho việc xoá: <code>DEL</code> một hash một triệu trường chặn mọi người 205ms, còn <code>UNLINK</code> làm đúng việc đó trong 0,37ms nhờ giải phóng bộ nhớ ở luồng nền.',
          ),
        }),

        // ── 2 câu lập trình ─────────────────────────────────────────────
        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q31 — Cache-aside that survives a stampede (chapter 12).</b> Implement <code>createCache({ ttlMs })</code> returning an object with <code>get(key, loader)</code> and <code>size()</code>.</p>' +
            '<ul>' +
            '<li><b>Hit:</b> if the key is cached and not expired, return the cached value WITHOUT calling the loader.</li>' +
            '<li><b>Miss:</b> call <code>loader(key)</code>, store the result with a deadline of <code>Date.now() + ttlMs</code>, and return it.</li>' +
            '<li><b>Single-flight:</b> if a load for that key is already in flight, every other caller must await the SAME promise — 200 concurrent misses must produce exactly ONE loader call. Clear the in-flight entry when it settles.</li>' +
            '<li><b>Cache the negative:</b> a loader returning <code>null</code> is a real answer and must be cached like any other, so a second call does not hit the loader again. (Testing the hit with <code>if (value)</code> is the bug this checks for.)</li>' +
            '<li><code>size()</code> returns the number of cached keys.</li>' +
            '</ul>' +
            '<p>Do not change the given data or the printing block, and do not install anything.</p>',

            '<p><b>Câu 31 — Cache-aside sống sót qua cơn giẫm đạp (chương 12).</b> Cài đặt <code>createCache({ ttlMs })</code> trả về một đối tượng có <code>get(key, loader)</code> và <code>size()</code>.</p>' +
            '<ul>' +
            '<li><b>Trúng cache:</b> nếu khoá đã có và chưa hết hạn, trả về giá trị đã lưu mà KHÔNG gọi loader.</li>' +
            '<li><b>Trượt cache:</b> gọi <code>loader(key)</code>, lưu kết quả với hạn <code>Date.now() + ttlMs</code>, rồi trả về.</li>' +
            '<li><b>Single-flight:</b> nếu khoá đó đang được nạp, mọi lời gọi khác phải chờ CHÍNH promise ấy — 200 lần trượt đồng thời chỉ được sinh ra ĐÚNG MỘT lần gọi loader. Nhớ xoá mục đang-nạp khi nó xong.</li>' +
            '<li><b>Cache cả kết quả rỗng:</b> loader trả <code>null</code> cũng là một câu trả lời thật và phải được cache như mọi giá trị khác, để lần gọi thứ hai không đụng tới loader nữa. (Kiểm trúng cache bằng <code>if (value)</code> chính là lỗi mà câu này soi.)</li>' +
            '<li><code>size()</code> trả về số khoá đang nằm trong cache.</li>' +
            '</ul>' +
            '<p>Không sửa phần dữ liệu cho sẵn và khối in kết quả, và không cài thêm thư viện nào.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const sleep = (ms) => new Promise((r) => setTimeout(r, ms));\n\n' +
            'let dbCalls = 0;\n' +
            "async function loadFromDb(key) {          // \"câu truy vấn đắt\" — 30ms\n" +
            '  dbCalls++;\n' +
            '  await sleep(30);\n' +
            "  return key === 'khong-ton-tai' ? null : { key, rows: key.length };\n" +
            '}\n\n' +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function createCache({ ttlMs }) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            '(async () => {\n' +
            '  const cache = createCache({ ttlMs: 100 });\n\n' +
            "  const burst = await Promise.all(Array.from({ length: 200 }, () => cache.get('bang-xep-hang', loadFromDb)));\n" +
            "  console.log('A dbCalls=' + dbCalls, 'giong nhau=' + burst.every((r) => r === burst[0]), JSON.stringify(burst[0]));\n\n" +
            "  await cache.get('bang-xep-hang', loadFromDb);\n" +
            "  console.log('B dbCalls=' + dbCalls);\n\n" +
            '  await sleep(130);\n' +
            "  await cache.get('bang-xep-hang', loadFromDb);\n" +
            "  console.log('C dbCalls=' + dbCalls);\n\n" +
            "  const a = await cache.get('khong-ton-tai', loadFromDb);\n" +
            "  const b = await cache.get('khong-ton-tai', loadFromDb);\n" +
            "  console.log('D dbCalls=' + dbCalls, 'gia tri=' + JSON.stringify(a), JSON.stringify(b));\n" +
            "  console.log('E size=' + cache.size());\n" +
            '})();\n',
          expectedOutput:
            'A dbCalls=1 giong nhau=true {"key":"bang-xep-hang","rows":13}\n' +
            'B dbCalls=1\n' +
            'C dbCalls=2\n' +
            'D dbCalls=3 gia tri=null null\n' +
            'E size=2',
          sampleSolution:
            'function createCache({ ttlMs }) {\n' +
            '  const store = new Map();     // key -> { value, expiresAt }\n' +
            '  const inflight = new Map();  // key -> Promise\n\n' +
            '  return {\n' +
            '    async get(key, loader, now = Date.now()) {\n' +
            '      const hit = store.get(key);\n' +
            '      // Kiểm bằng SỰ TỒN TẠI của mục, không bằng độ "thật" của giá trị,\n' +
            '      // nếu không thì null sẽ bị coi là trượt cache mãi mãi.\n' +
            '      if (hit && hit.expiresAt > now) return hit.value;\n\n' +
            '      if (inflight.has(key)) return inflight.get(key);\n\n' +
            '      const p = (async () => {\n' +
            '        const value = await loader(key);\n' +
            '        store.set(key, { value, expiresAt: Date.now() + ttlMs });\n' +
            '        return value;\n' +
            '      })().finally(() => inflight.delete(key));\n\n' +
            '      inflight.set(key, p);\n' +
            '      return p;\n' +
            '    },\n' +
            '    size() { return store.size; },\n' +
            '  };\n' +
            '}\n',
        }),

        codeQ({
          points: 5,
          prompt: B(
            '<p><b>Q32 — Sign and verify a token, the way chapter 8 says (no libraries).</b> Using only <code>node:crypto</code>, implement:</p>' +
            '<p><code>sign(payload, secret, { expiresInSec, now })</code> → <code>base64url(header).base64url(body).base64url(HMAC-SHA256)</code>, where the header is <code>{ alg: "HS256", typ: "JWT" }</code> and the body is the payload plus <code>iat: now</code> and <code>exp: now + expiresInSec</code>. The HMAC is computed over the string <code>header + "." + body</code>.</p>' +
            '<p><code>verify(token, secret, { now })</code> → <code>{ ok: true, payload }</code> or <code>{ ok: false, code }</code>, checked in THIS order:</p>' +
            '<ol>' +
            '<li>not exactly three parts, or a part that is not valid JSON → <code>MALFORMED</code></li>' +
            '<li>the header\'s <code>alg</code> is not exactly <code>"HS256"</code> → <code>BAD_ALG</code> (the server decides the algorithm; the token never gets a vote)</li>' +
            '<li>the signature does not match → <code>BAD_SIGNATURE</code>. Compare with <code>crypto.timingSafeEqual</code>, guarding the length first — it THROWS on buffers of different lengths</li>' +
            '<li><code>exp</code> missing, not a number, or <code>&lt;= now</code> → <code>EXPIRED</code></li>' +
            '</ol>' +
            '<p>Keep the given constants and the printing block exactly as they are.</p>',

            '<p><b>Câu 32 — Ký và kiểm một token đúng như chương 8 dạy (không dùng thư viện).</b> Chỉ với <code>node:crypto</code>, hãy cài đặt:</p>' +
            '<p><code>sign(payload, secret, { expiresInSec, now })</code> → <code>base64url(header).base64url(body).base64url(HMAC-SHA256)</code>, trong đó header là <code>{ alg: "HS256", typ: "JWT" }</code> và body là payload cộng thêm <code>iat: now</code> và <code>exp: now + expiresInSec</code>. HMAC tính trên chuỗi <code>header + "." + body</code>.</p>' +
            '<p><code>verify(token, secret, { now })</code> → <code>{ ok: true, payload }</code> hoặc <code>{ ok: false, code }</code>, kiểm theo ĐÚNG thứ tự sau:</p>' +
            '<ol>' +
            '<li>không đúng ba phần, hoặc một phần không phải JSON hợp lệ → <code>MALFORMED</code></li>' +
            '<li><code>alg</code> trong header không đúng bằng <code>"HS256"</code> → <code>BAD_ALG</code> (máy chủ quyết định thuật toán; token không có quyền bỏ phiếu)</li>' +
            '<li>chữ ký không khớp → <code>BAD_SIGNATURE</code>. So sánh bằng <code>crypto.timingSafeEqual</code>, nhớ kiểm độ dài trước — nó NÉM LỖI khi hai buffer khác độ dài</li>' +
            '<li><code>exp</code> thiếu, không phải số, hoặc <code>&lt;= now</code> → <code>EXPIRED</code></li>' +
            '</ol>' +
            '<p>Giữ nguyên các hằng số cho sẵn và khối in kết quả.</p>',
          ),
          language: 'javascript',
          starterCode:
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            "const crypto = require('node:crypto');\n" +
            "const SECRET = 'khoa-bi-mat-32-byte-cua-may-chu-nay';\n" +
            "const b64 = (obj) => Buffer.from(JSON.stringify(obj)).toString('base64url');\n\n" +
            '// ── VIẾT LỜI GIẢI CỦA BẠN Ở ĐÂY ────────────────────────────────────────\n' +
            'function sign(payload, secret, { expiresInSec, now }) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            'function verify(token, secret, { now }) {\n' +
            '  // TODO\n' +
            '}\n\n' +
            '// ── ĐỀ CHO SẴN — KHÔNG SỬA ─────────────────────────────────────────────\n' +
            'const NOW = 1785000000;\n' +
            "const good = sign({ sub: '7', role: 'USER' }, SECRET, { expiresInSec: 900, now: NOW });\n" +
            "console.log('1', JSON.stringify(verify(good, SECRET, { now: NOW + 10 })));\n" +
            "console.log('2', JSON.stringify(verify(good, SECRET, { now: NOW + 901 })));\n" +
            "console.log('3', JSON.stringify(verify(good, 'khoa-khac', { now: NOW + 10 })));\n\n" +
            '// kẻ tấn công sửa payload thành ADMIN rồi giữ nguyên chữ ký\n' +
            "const [h, , s] = good.split('.');\n" +
            "const forgedPayload = b64({ sub: '7', role: 'ADMIN', iat: NOW, exp: NOW + 900 });\n" +
            "console.log('4', JSON.stringify(verify([h, forgedPayload, s].join('.'), SECRET, { now: NOW + 10 })));\n\n" +
            '// kẻ tấn công đổi header sang alg "none" và bỏ chữ ký\n' +
            "const noneToken = [b64({ alg: 'none', typ: 'JWT' }), forgedPayload, ''].join('.');\n" +
            "console.log('5', JSON.stringify(verify(noneToken, SECRET, { now: NOW + 10 })));\n" +
            "console.log('6', JSON.stringify(verify('khong-phai-token', SECRET, { now: NOW + 10 })));\n",
          expectedOutput:
            '1 {"ok":true,"payload":{"sub":"7","role":"USER","iat":1785000000,"exp":1785000900}}\n' +
            '2 {"ok":false,"code":"EXPIRED"}\n' +
            '3 {"ok":false,"code":"BAD_SIGNATURE"}\n' +
            '4 {"ok":false,"code":"BAD_SIGNATURE"}\n' +
            '5 {"ok":false,"code":"BAD_ALG"}\n' +
            '6 {"ok":false,"code":"MALFORMED"}',
          sampleSolution:
            'function sign(payload, secret, { expiresInSec, now }) {\n' +
            "  const header = { alg: 'HS256', typ: 'JWT' };\n" +
            '  const body = { ...payload, iat: now, exp: now + expiresInSec };\n' +
            "  const data = b64(header) + '.' + b64(body);\n" +
            "  const sig = crypto.createHmac('sha256', secret).update(data).digest('base64url');\n" +
            "  return data + '.' + sig;\n" +
            '}\n\n' +
            'function verify(token, secret, { now }) {\n' +
            "  const parts = String(token).split('.');\n" +
            "  if (parts.length !== 3) return { ok: false, code: 'MALFORMED' };\n" +
            '  const [h, p, s] = parts;\n\n' +
            '  let header;\n' +
            "  try { header = JSON.parse(Buffer.from(h, 'base64url').toString('utf8')); }\n" +
            "  catch { return { ok: false, code: 'MALFORMED' }; }\n" +
            "  // Thuật toán do MÁY CHỦ chốt — không bao giờ đọc từ token rồi làm theo.\n" +
            "  if (header.alg !== 'HS256') return { ok: false, code: 'BAD_ALG' };\n\n" +
            "  const expected = crypto.createHmac('sha256', secret).update(h + '.' + p).digest('base64url');\n" +
            '  const a = Buffer.from(s), b = Buffer.from(expected);\n' +
            "  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return { ok: false, code: 'BAD_SIGNATURE' };\n\n" +
            '  let payload;\n' +
            "  try { payload = JSON.parse(Buffer.from(p, 'base64url').toString('utf8')); }\n" +
            "  catch { return { ok: false, code: 'MALFORMED' }; }\n" +
            "  if (typeof payload.exp !== 'number' || payload.exp <= now) return { ok: false, code: 'EXPIRED' };\n\n" +
            '  return { ok: true, payload };\n' +
            '}\n',
        }),
      ],
    },
  ],
};
