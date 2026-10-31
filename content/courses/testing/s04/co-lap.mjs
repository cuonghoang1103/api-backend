/**
 * Testing · Chương 4 · 4.4 — Cô lập: transaction, xoá bảng, dữ liệu mẫu. Slug giữ từ khung: tst-4-4-co-lap.
 * Đo thật: hai test không dọn ⇒ B đỏ OVERLAP (chạy riêng B xanh); 20 test ROLLBACK 56 ms vs 20 test TRUNCATE 77 ms.
 */
import G from '../giang/tst-04-4.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const gon = (t) => t.split('\n').filter((l) => /^\$ |\[setup\]|^ [✓❯] \S+ \(|^   [✓×↓] [AB]:|Tests |Duration/.test(l)).join('\n');

const BANG_EN = `<table>
<thead><tr><th>Technique</th><th>How</th><th>Good for</th><th>Not for</th></tr></thead>
<tbody>
<tr><td>TRUNCATE before each test</td><td><code>TRUNCATE bookings RESTART IDENTITY</code></td><td>everything, incl. concurrency and code that commits</td><td>very large tables (slower)</td></tr>
<tr><td>Transaction per test</td><td><code>BEGIN</code> … <code>ROLLBACK</code> on one client</td><td>fast, nothing ever persists</td><td>concurrency, code that opens its own connection or commits</td></tr>
<tr><td>Schema / database per worker</td><td>one per Vitest worker</td><td>parallel test files</td><td>small suites (setup cost)</td></tr>
</tbody></table>`;
const BANG_VI = `<table>
<thead><tr><th>Kỹ thuật</th><th>Cách làm</th><th>Hợp với</th><th>Không hợp với</th></tr></thead>
<tbody>
<tr><td>TRUNCATE trước mỗi test</td><td><code>TRUNCATE bookings RESTART IDENTITY</code></td><td>mọi thứ, kể cả tranh chấp đồng thời và code tự commit</td><td>bảng rất lớn (chậm hơn)</td></tr>
<tr><td>Mỗi test một transaction</td><td><code>BEGIN</code> … <code>ROLLBACK</code> trên một client</td><td>nhanh, không gì được lưu lại</td><td>tranh chấp đồng thời, code tự mở kết nối hay tự commit</td></tr>
<tr><td>Mỗi worker một schema / CSDL</td><td>một cái cho mỗi worker của Vitest</td><td>file test chạy song song</td><td>bộ test nhỏ (tốn công dựng)</td></tr>
</tbody></table>`;

export default {
  title: '4.4 — Isolation: transactions, truncation and seed data|||4.4 — Cô lập: transaction, xoá bảng và dữ liệu mẫu',
  slug: 'tst-4-4-co-lap',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Dữ liệu rò giữa hai test đo thật (B đỏ OVERLAP khi chạy sau A, xanh khi chạy riêng); TRUNCATE … RESTART IDENTITY trước mỗi test; mỗi test một transaction rồi ROLLBACK (đo 20+20 test: 56 ms vs 77 ms) và giới hạn của nó; vì sao các file test chạy lần lượt trên một CSDL; factory makeBooking; Prisma và Spring theo cùng ý.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.4</span>
<h2>Isolation between tests</h2>
<p class="lead">A database shared by many tests is shared state — the same problem as the leaked mock of lesson 2.4, only now the leftover is a row in a table. Here the leak is measured, then fixed two ways.</p>

<h3>Two correct tests, one red</h3>
${ma('javascript', CODE.roRi)}
${ra(gon(OUT['44-ro-ri']))}
${ra(gon(OUT['44-ro-ri-B']))}
<p>Each test is correct: a lecturer may book 40 seats without approval (Lite-2), and run alone (<code>-t lecturer</code>) B passes. Run after A, BE-201 at 08:00 is already taken and the database rightly answers OVERLAP. The bug is in the test setup, not in LabFlow. In a large suite this looks like “fails on CI, passes on my machine”, because the order of tests decides the result.</p>

<h3>Isolation 1: TRUNCATE before each test</h3>
${ma('javascript', CODE.truncate)}
<p><code>TRUNCATE</code> empties the table in one statement; <code>RESTART IDENTITY</code> resets the <code>serial</code> counter so <code>id: 1</code> assertions stay stable. It works with several connections, concurrent bookings and code that commits — which is why the Lab 4 reference suite uses it.</p>

<h3>Isolation 2: a transaction per test</h3>
${ma('javascript', CODE.giaoDich)}
<p>Each test borrows one connection, starts a transaction, runs everything through that <code>client</code> (<code>createPgRepo</code> accepts any object with <code>.query</code>), and rolls back. Nothing it wrote ever becomes visible to anyone else. The limits: a single connection cannot test the race (that needs two), and code that opens its own connection or calls <code>COMMIT</code> escapes the rollback.</p>
${ra(gon(OUT['44-co-lap']))}
<p>Twenty tests each: 56 ms with rollback, 77 ms with truncate. At this size the difference does not matter — choose by what the test needs.</p>
<div class="pitfall co-tieu-de">
<p><strong>Measured — rollback only undoes your own writes.</strong> Before the rollback file got its <code>TRUNCATE</code> in <code>beforeAll</code>, we ran it right after the leaking file:</p>
${ra(gon(OUT['44-cheo']))}
<p>All 20 rolled-back tests failed: the row that <code>ro-ri</code> had <em>committed</em> was still in the table, and a rollback cannot undo someone else’s commit. With one <code>TRUNCATE</code> in <code>beforeAll</code> (the version shown above) the same pair gives:</p>
${ra(gon(OUT['44-cheo-sua']))}
<p>Start every file from a known state, whatever isolation you use inside it.</p>
</div>

<h3>One database: files take turns</h3>
${BANG_EN}
<p>Vitest runs test files in parallel by default. With one shared database, a <code>TRUNCATE</code> in file A can empty the table in the middle of a test in file B — a failure that appears once in twenty runs and never when you watch. Our integration config sets <code>fileParallelism: false</code>; large suites give each worker its own schema or database instead.</p>

<h3>Factories: test data with sensible defaults</h3>
${ma('javascript', CODE.dbHelpers)}
<p><code>makeBooking({ seats: 31 })</code> returns a valid booking with defaults and a unique lab, so the test states only what matters and two tests do not collide by accident. Write test data through the real code (<code>bookLab</code>) when you can; insert raw rows only when the test is about the database itself.</p>
<p><strong>With an ORM:</strong> the same three techniques apply to Prisma (an interactive <code>$transaction</code> rolled back by throwing, or <code>TRUNCATE</code> through <code>$executeRaw</code>) and to Spring (<code>@Transactional</code> on a test class rolls back each test by default).</p>

${lienKet({ khoa: 'nodejs', bai: 'nodejs-7-3-crud-transaction', title: 'Need a refresher? Node.js course — 7.3: CRUD and transactions', sub: 'What BEGIN, COMMIT and ROLLBACK do, and why a transaction is all-or-nothing — the basis of rollback isolation.', cta: 'OPEN LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Inside a rolled-back transaction, store a 31-seat student booking with <code>makeBooking</code> and read its status and minutes back with SQL.</li>
<li>In the next test, prove that the table is empty.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th44)}
${ra(gon(OUT['44-th']))}
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test isolation</span><span class="v">Every test starts from the same known state, whatever ran before.</span></div>
  <div class="kv"><span class="k">TRUNCATE … RESTART IDENTITY</span><span class="v">Empty a table and reset its serial ids.</span></div>
  <div class="kv"><span class="k">rollback isolation</span><span class="v">Run a test inside a transaction and undo it afterwards.</span></div>
  <div class="kv"><span class="k">factory</span><span class="v">A function that builds valid test data with defaults you can override.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Rows leak between tests exactly like mocks do — measured: B red after A, green alone.</li>
<li>TRUNCATE: simple, works with concurrency. ROLLBACK: clean, but one connection and no commits.</li>
<li>One shared database ⇒ test files take turns (or one schema per worker).</li>
<li>Factories keep data short, valid and collision-free.</li>
</ul>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.4</span>
<h2>Cô lập giữa các test</h2>
<p class="lead">Một cơ sở dữ liệu nhiều test dùng chung là trạng thái dùng chung — cùng vấn đề với mock bị rò ở bài 2.4, chỉ khác lần này thứ còn sót lại là một dòng trong bảng. Ở đây chỗ rò được đo, rồi sửa theo hai cách.</p>

<h3>Hai test đúng, một test đỏ</h3>
${ma('javascript', CODE.roRi)}
${ra(gon(OUT['44-ro-ri']))}
${ra(gon(OUT['44-ro-ri-B']))}
<p>Test nào cũng đúng: giảng viên được đặt 40 chỗ không cần duyệt (Lite-2), và chạy riêng (<code>-t lecturer</code>) thì B đạt. Chạy sau A, BE-201 lúc 08:00 đã có người đặt và cơ sở dữ liệu trả lời OVERLAP là đúng. Lỗi nằm ở phần dựng test, không ở LabFlow. Trong bộ test lớn, nó trông như “đỏ trên CI, xanh trên máy tôi”, vì thứ tự chạy quyết định kết quả.</p>

<h3>Cô lập 1: TRUNCATE trước mỗi test</h3>
${ma('javascript', CODE.truncate)}
<p><code>TRUNCATE</code> làm rỗng bảng bằng một câu lệnh; <code>RESTART IDENTITY</code> đặt lại bộ đếm <code>serial</code> để các khẳng định <code>id: 1</code> ổn định. Cách này chạy được với nhiều kết nối, lượt đặt đồng thời và code tự commit — vì thế bộ test tham khảo của Lab 4 dùng nó.</p>

<h3>Cô lập 2: mỗi test một transaction</h3>
${ma('javascript', CODE.giaoDich)}
<p>Mỗi test mượn một kết nối, mở transaction, chạy mọi thứ qua đúng <code>client</code> đó (<code>createPgRepo</code> nhận bất kỳ object nào có <code>.query</code>), rồi rollback. Không gì nó ghi trở nên nhìn thấy được với ai khác. Giới hạn: một kết nối thì không test được tranh chấp (cần hai), và code tự mở kết nối hay tự gọi <code>COMMIT</code> sẽ lọt khỏi rollback.</p>
${ra(gon(OUT['44-co-lap']))}
<p>Mỗi kiểu hai mươi test: 56 ms với rollback, 77 ms với truncate. Ở cỡ này chênh lệch không đáng kể — chọn theo thứ test cần.</p>
<div class="pitfall co-tieu-de">
<p><strong>Đo thật — rollback chỉ huỷ được thứ chính test đó ghi.</strong> Trước khi file rollback có <code>TRUNCATE</code> trong <code>beforeAll</code>, chúng tôi chạy nó ngay sau file bị rò:</p>
${ra(gon(OUT['44-cheo']))}
<p>Cả 20 test rollback đều hỏng: dòng mà <code>ro-ri</code> đã <em>commit</em> vẫn nằm trong bảng, và rollback không huỷ được commit của người khác. Thêm một <code>TRUNCATE</code> trong <code>beforeAll</code> (bản ở trên) thì cùng cặp file đó cho:</p>
${ra(gon(OUT['44-cheo-sua']))}
<p>Hãy cho mỗi file bắt đầu từ một trạng thái đã biết, dù bên trong dùng cách cô lập nào.</p>
</div>

<h3>Một cơ sở dữ liệu: các file chạy lần lượt</h3>
${BANG_VI}
<p>Mặc định Vitest chạy các file test song song. Với một cơ sở dữ liệu dùng chung, một lệnh <code>TRUNCATE</code> ở file A có thể làm rỗng bảng ngay giữa một test của file B — lỗi chỉ hiện một lần trong hai mươi lần chạy và không bao giờ hiện khi bạn đang nhìn. Cấu hình test tích hợp của ta đặt <code>fileParallelism: false</code>; bộ test lớn thì cho mỗi worker một schema hay một cơ sở dữ liệu riêng.</p>

<h3>Factory: dữ liệu test với giá trị mặc định hợp lý</h3>
${ma('javascript', CODE.dbHelpers)}
<p><code>makeBooking({ seats: 31 })</code> trả về một lượt đặt hợp lệ với giá trị mặc định và một phòng riêng, nên test chỉ ghi điều quan trọng và hai test không vô tình đụng nhau. Khi có thể, hãy tạo dữ liệu test qua code thật (<code>bookLab</code>); chỉ chèn dòng thô khi test đang nói về chính cơ sở dữ liệu.</p>
<p><strong>Với ORM:</strong> ba kỹ thuật này áp dụng y như vậy cho Prisma (một <code>$transaction</code> tương tác được rollback bằng cách ném lỗi, hoặc <code>TRUNCATE</code> qua <code>$executeRaw</code>) và cho Spring (<code>@Transactional</code> đặt trên lớp test thì mặc định rollback sau mỗi test).</p>

${lienKet({ khoa: 'nodejs', bai: 'nodejs-7-3-crud-transaction', title: 'Cần ôn lại? Khoá Node.js — 7.3: CRUD và transaction', sub: 'BEGIN, COMMIT, ROLLBACK làm gì, và vì sao transaction là “được ăn cả, ngã về không” — nền tảng của cách cô lập bằng rollback.', cta: 'MỞ BÀI →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Trong một transaction sẽ bị rollback, lưu một lượt đặt 31 chỗ của sinh viên bằng <code>makeBooking</code> và đọc lại trạng thái, số phút bằng SQL.</li>
<li>Ở test kế tiếp, chứng minh bảng rỗng.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th44)}
${ra(gon(OUT['44-th']))}
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test isolation (cô lập test)</span><span class="v">Mọi test bắt đầu từ cùng một trạng thái đã biết, bất kể trước đó chạy gì.</span></div>
  <div class="kv"><span class="k">TRUNCATE … RESTART IDENTITY</span><span class="v">Làm rỗng bảng và đặt lại id serial.</span></div>
  <div class="kv"><span class="k">rollback isolation (cô lập bằng rollback)</span><span class="v">Chạy test trong một transaction rồi huỷ nó sau đó.</span></div>
  <div class="kv"><span class="k">factory</span><span class="v">Hàm dựng dữ liệu test hợp lệ với giá trị mặc định ghi đè được.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Dữ liệu rò giữa các test y như mock — đo được: B đỏ khi chạy sau A, xanh khi chạy riêng.</li>
<li>TRUNCATE: đơn giản, chạy được với tranh chấp. ROLLBACK: sạch, nhưng một kết nối và không commit.</li>
<li>Một cơ sở dữ liệu dùng chung ⇒ các file chạy lần lượt (hoặc mỗi worker một schema).</li>
<li>Factory giữ dữ liệu gọn, hợp lệ và không đụng nhau.</li>
</ul>
</div>
`,
};
