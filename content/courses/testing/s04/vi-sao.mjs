/**
 * Testing · Chương 4 · 4.1 — Vì sao CSDL thật hơn CSDL giả. Slug giữ từ khung: tst-4-1-vi-sao.
 * Chạy thật trên PostgreSQL 17 (Testcontainers 12.2.1): race Ch2 không ràng buộc ⇒ 2 lượt; có EXCLUDE ⇒ 23P01 ⇒ OVERLAP.
 */
import G from '../giang/tst-04-1.mjs';
import { ma, ra, lienKet } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

// Chỉ đoạn catch quanh insert của service.js (dòng mới của Chương 4).
const SERVICE_CATCH = CODE.service.split('\n').filter((l, i, a) => i >= a.findIndex((x) => x.includes('return await repo.insert')) - 1 && i <= a.findIndex((x) => x.includes('return await repo.insert')) + 4).join('\n');
const gon = (t) => t.split('\n').filter((l) => /^\$ |\[setup\]|✓|×|❯|AssertionError|Tests |ExperimentalWarning/.test(l)).join('\n');

export default {
  title: '4.1 — Why a real database beats a mocked one: the Chapter 2 race, fixed and proven|||4.1 — Vì sao cơ sở dữ liệu thật hơn cơ sở dữ liệu giả: lỗi tranh chấp Chương 2, sửa và chứng minh',
  slug: 'tst-4-1-vi-sao',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Adapter createPgRepo (cùng port với repo bộ nhớ), schema có ràng buộc loại trừ EXCLUDE USING gist; lỗi tranh chấp của Chương 2 chạy trên PostgreSQL 17 thật: không ràng buộc ⇒ đặt trùng, có ràng buộc ⇒ 23P01 ⇒ OVERLAP; SQLite nhận chữ vào cột INTEGER còn PostgreSQL từ chối 22P02; bug chỉ CSDL thật mới lộ; giá đo được.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Why a real database beats a mocked one</h2>
<p class="lead">Chapter 3 kept the database out of the tests with a fake repository. That was right for business rules. But SQL, constraints and concurrency live <em>in</em> the database, and a fake cannot test what it does not run. This chapter adds integration tests against a real PostgreSQL — starting with the double booking we found in Chapter 2.</p>

<h3>The PostgreSQL adapter and the schema</h3>
<p>Install the driver and the tools of this chapter: <code>npm install pg@8</code> and <code>npm install --save-dev testcontainers@12 @testcontainers/postgresql@12</code> (we use 8.23.1 and 12.2.1). Then add the adapter and the schema:</p>
${ma('javascript', CODE.pgRepo)}
${ma('sql', CODE.schema)}
<ul>
<li><code>createPgRepo</code> has the same two methods as <code>createMemoryRepo</code>: the ports-and-adapters idea of lesson 3.4 pays off — <code>bookLab</code> is not touched.</li>
<li>The <strong>exclusion constraint</strong> <code>no_overlap</code> is BR-04 enforced by PostgreSQL itself: no two rows with the same lab (<code>lab WITH =</code>) may have overlapping time ranges (<code>tsrange … WITH &amp;&amp;</code>). The bounds <code>'[)'</code> include the start and exclude the end, so 10:00–12:00 may follow 08:00–10:00. The extension <code>btree_gist</code> lets a plain text column join a GiST constraint.</li>
<li>PostgreSQL reports a violation with SQLSTATE <code>23P01</code>; the adapter maps it to our <code>OVERLAP</code>, keeping the original error as <code>cause</code>.</li>
</ul>
<p>One more line is needed in <code>bookLab</code>. Lesson 2.3 wrapped every insert error into <code>STORAGE_DOWN</code>; an OVERLAP coming from the database must pass through unchanged:</p>
${ma('javascript', SERVICE_CATCH)}
<p>How the tests reach the database — a container started by the test run — is lessons 4.2 and 4.3. For now: <code>npm run test:int</code> runs the integration tests against a fresh PostgreSQL 17.</p>

<h3>The Chapter 2 race on real PostgreSQL</h3>
${ma('javascript', CODE.dua)}
<p>First with a schema that has <strong>no</strong> constraint (<code>demo4/schema-khong-rang-buoc.sql</code>, selected with the <code>TST_SCHEMA</code> variable):</p>
${ra(gon(OUT['41-dua-khong']))}
<p>Two connections both ask “is BE-201 free at 08:00?” before either inserts; both get “yes”; both insert — in five out of five runs. Note the <code>SELECT 1</code> pair in <code>beforeAll</code>: it opens two connections in advance. Without it, the second booking had to open a new connection first, the first booking finished meanwhile, and the race did not show up at all — a race test must make the operations really start together. The bug is not an artefact of the fake — PostgreSQL shows it exactly as the memory repository did in Chapter 2. Now with the real schema:</p>
${ra(gon(OUT['41-dua']))}
<p>One booking wins, the other gets <code>OVERLAP</code>. We printed the rejected booking’s <code>cause.code</code> in five runs: <code>23P01</code> every time — the <em>database</em> stopped what <code>findOverlap</code> could not. The <code>it.fails</code> of Chapter 2 can now become a normal <code>it</code> on PostgreSQL (practice below).</p>

<h3>SQLite is not PostgreSQL</h3>
${ma('javascript', CODE.sqlite)}
<p>Both tests are green in the run above: SQLite (here Node’s built-in <code>node:sqlite</code>, which still prints an ExperimentalWarning in Node 22) stores the text “thirty” in an INTEGER column — its rule is called <em>type affinity</em> — while PostgreSQL refuses it with <code>22P02</code>. Running tests on a “lighter” engine is tempting, but each difference is a place where tests pass and production fails. Test against the engine and major version you deploy.</p>

<h3>Bugs only a real database can show</h3>
<ul>
<li><strong>Concurrency</strong> — check-then-insert races, deadlocks, isolation levels.</li>
<li><strong>SQL itself</strong> — a typo, a wrong placeholder (<code>$3</code> vs <code>$4</code>), a <code>&lt;</code> that should be <code>&lt;=</code>. A fake runs its own JavaScript, never your query.</li>
<li><strong>Types</strong> — text in an integer column (22P02), “25:00” as a time (22008), time zones in <code>timestamptz</code>.</li>
<li><strong>Constraints</strong> — CHECK (23514), NOT NULL (23502), UNIQUE (23505), EXCLUDE (23P01).</li>
<li><strong>Migrations</strong> — does the schema the code expects actually exist?</li>
</ul>
<p><strong>The cost, measured:</strong> 73 unit tests ran in 0.24 s; 11 integration tests in 1.85 s, with the container ready in about 1.2–2.1 s across our runs. Keep rules in fast unit tests and use a focused set of integration tests for SQL — the pyramid of lesson 0.2 with real numbers.</p>

${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-4-db-that', title: 'Also in the Node.js course — 14.4: tests against a real table', sub: 'Same idea from the API side: a fake repository returned 201 five times while the real table accepted one row and raised 23505 four times.', cta: 'OPEN LESSON →' })}
${lienKet({ bai: 'swt301-test-levels', title: 'Also in SWT301 — 2.2: component and integration testing', sub: 'Same: integration testing checks how components work together. Different: here one side of the integration is a real PostgreSQL in a container, started by the test run.', cta: 'OPEN SWT301 LESSON →' })}

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<ol>
<li>Turn the Chapter 2 race into a passing PostgreSQL test: after two concurrent bookings there is exactly one row.</li>
<li>Insert an end time of <code>'25:00'</code> straight through the adapter and assert PostgreSQL’s error code.</li>
</ol>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', CODE.th41)}
${ra(gon(OUT['41-th']))}
<p>22008 is <em>datetime_field_overflow</em>: PostgreSQL knows there is no 25 o’clock; a fake would have stored the string.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">integration test</span><span class="v">A test of our code together with a real dependency — here PostgreSQL.</span></div>
  <div class="kv"><span class="k">exclusion constraint</span><span class="v">A rule that no two rows may conflict on given operators, e.g. same lab and overlapping range.</span></div>
  <div class="kv"><span class="k">SQLSTATE</span><span class="v">The five-character error code of PostgreSQL: 23P01, 23514, 22P02…</span></div>
  <div class="kv"><span class="k">type affinity</span><span class="v">SQLite’s loose typing: a column’s type is a preference, not a rule.</span></div>
</div>

<!-- SODO-TST -->
<h3>🗺 Why the double booking only shows on a real database</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Request A</div><div class="lz-d">findOverlap → slot is free</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Request B</div><div class="lz-d">findOverlap → slot is still free</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">A inserts</div><div class="lz-d">row saved</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">B inserts</div><div class="lz-d">row saved — double booking</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">EXCLUDE constraint</div><div class="lz-d">PostgreSQL refuses B with 23P01</div></div>
</div>
<div class="pitfall"><strong>SQLite as a stand-in.</strong> A lighter database makes tests faster but does not have PostgreSQL’s exclusion constraint or its types, so the very rule that stops double bookings is never exercised. Test against the database you run in production.</div>
<h3>📌 Summary</h3>
<ul>
<li>A new adapter for the same port; <code>bookLab</code> unchanged except for letting OVERLAP through.</li>
<li>The race is real on PostgreSQL; an exclusion constraint makes the database refuse it.</li>
<li>Map database codes to your own errors, keep the original as <code>cause</code>.</li>
<li>SQLite ≠ PostgreSQL: test the engine you deploy.</li>
<li>Integration tests cost seconds — keep them focused on what only the database can show.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-4-nguyen-tu-rate-limit-lock" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Applied in Node.js — lesson 12.4: the same race in Redis</span><span class="lc-sub">500 parallel requests through a limit of 100: INCR allows 100 and blocks 400; GET → check → SET allows all 500 and leaves the counter at 1. Only a concurrent test against a real Redis shows it — a mock would pass.</span></span>
  <span class="lc-cta">OPEN NODE.JS LESSON →</span>
</a>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Vì sao cơ sở dữ liệu thật hơn cơ sở dữ liệu giả</h2>
<p class="lead">Chương 3 để cơ sở dữ liệu đứng ngoài test bằng một repository giả. Với luật nghiệp vụ, như vậy là đúng. Nhưng SQL, ràng buộc và tranh chấp đồng thời sống <em>bên trong</em> cơ sở dữ liệu, và đồ giả không test được thứ nó không chạy. Chương này thêm test tích hợp (integration test) với PostgreSQL thật — bắt đầu từ vụ đặt trùng phòng tìm ra ở Chương 2.</p>

<h3>Adapter PostgreSQL và schema</h3>
<p>Cài driver và công cụ của chương: <code>npm install pg@8</code> và <code>npm install --save-dev testcontainers@12 @testcontainers/postgresql@12</code> (khoá dùng 8.23.1 và 12.2.1). Rồi thêm adapter và schema:</p>
${ma('javascript', CODE.pgRepo)}
${ma('sql', CODE.schema)}
<ul>
<li><code>createPgRepo</code> có đúng hai phương thức như <code>createMemoryRepo</code>: ý tưởng ports and adapters của bài 3.4 phát huy tác dụng — <code>bookLab</code> không bị đụng tới.</li>
<li><strong>Ràng buộc loại trừ</strong> (exclusion constraint) <code>no_overlap</code> là BR-04 do chính PostgreSQL thực thi: không hai dòng cùng phòng (<code>lab WITH =</code>) nào được có khoảng thời gian chồng nhau (<code>tsrange … WITH &amp;&amp;</code>). Cận <code>'[)'</code> lấy điểm đầu, bỏ điểm cuối, nên 10:00–12:00 được nối sau 08:00–10:00. Extension <code>btree_gist</code> cho cột text thường tham gia được ràng buộc GiST.</li>
<li>PostgreSQL báo vi phạm bằng SQLSTATE <code>23P01</code>; adapter đổi nó thành <code>OVERLAP</code> của ta và giữ lỗi gốc trong <code>cause</code>.</li>
</ul>
<p>Cần thêm đúng một dòng trong <code>bookLab</code>. Bài 2.3 bọc mọi lỗi lúc ghi thành <code>STORAGE_DOWN</code>; một OVERLAP đến từ cơ sở dữ liệu phải được cho đi qua nguyên vẹn:</p>
${ma('javascript', SERVICE_CATCH)}
<p>Test chạm tới cơ sở dữ liệu bằng cách nào — một container do chính lần chạy test bật lên — là chuyện của bài 4.2 và 4.3. Tạm thời: <code>npm run test:int</code> chạy test tích hợp với một PostgreSQL 17 mới tinh.</p>

<h3>Lỗi tranh chấp của Chương 2 trên PostgreSQL thật</h3>
${ma('javascript', CODE.dua)}
<p>Trước hết với một schema <strong>không có</strong> ràng buộc (<code>demo4/schema-khong-rang-buoc.sql</code>, chọn bằng biến <code>TST_SCHEMA</code>):</p>
${ra(gon(OUT['41-dua-khong']))}
<p>Hai kết nối cùng hỏi “BE-201 lúc 08:00 còn trống không?” trước khi bên nào kịp ghi; cả hai nhận “còn”; cả hai cùng ghi — năm trên năm lần chạy. Để ý cặp <code>SELECT 1</code> trong <code>beforeAll</code>: nó mở sẵn hai kết nối. Thiếu nó, lượt đặt thứ hai phải mở kết nối mới trước, lượt thứ nhất xong luôn trong lúc đó, và lỗi tranh chấp không hiện ra chút nào — một test tranh chấp phải làm cho các thao tác thật sự bắt đầu cùng lúc. Bug không phải sản phẩm của đồ giả — PostgreSQL cho thấy nó y như repository bộ nhớ ở Chương 2. Giờ với schema thật:</p>
${ra(gon(OUT['41-dua']))}
<p>Một lượt thắng, lượt kia nhận <code>OVERLAP</code>. Chúng tôi in <code>cause.code</code> của lượt bị từ chối qua năm lần chạy: lần nào cũng <code>23P01</code> — chính <em>cơ sở dữ liệu</em> đã chặn thứ mà <code>findOverlap</code> không chặn nổi. <code>it.fails</code> của Chương 2 giờ thành được một <code>it</code> bình thường trên PostgreSQL (phần thực hành bên dưới).</p>

<h3>SQLite không phải PostgreSQL</h3>
${ma('javascript', CODE.sqlite)}
<p>Cả hai test đều xanh trong lần chạy ở trên: SQLite (ở đây là <code>node:sqlite</code> có sẵn trong Node, vẫn in ExperimentalWarning ở Node 22) lưu chữ “thirty” vào cột INTEGER — luật này gọi là <em>type affinity</em> — còn PostgreSQL từ chối với <code>22P02</code>. Chạy test trên một engine “nhẹ hơn” rất hấp dẫn, nhưng mỗi khác biệt là một chỗ test đạt mà production hỏng. Hãy test trên đúng engine và phiên bản chính bạn triển khai.</p>

<h3>Những bug chỉ cơ sở dữ liệu thật mới lộ</h3>
<ul>
<li><strong>Tranh chấp đồng thời</strong> — kiểm-rồi-ghi, deadlock, mức cô lập giao dịch.</li>
<li><strong>Chính câu SQL</strong> — gõ nhầm, sai placeholder (<code>$3</code> thay <code>$4</code>), một dấu <code>&lt;</code> lẽ ra là <code>&lt;=</code>. Đồ giả chạy JavaScript của nó, không bao giờ chạy câu truy vấn của bạn.</li>
<li><strong>Kiểu dữ liệu</strong> — chữ trong cột số (22P02), “25:00” làm giờ (22008), múi giờ trong <code>timestamptz</code>.</li>
<li><strong>Ràng buộc</strong> — CHECK (23514), NOT NULL (23502), UNIQUE (23505), EXCLUDE (23P01).</li>
<li><strong>Migration</strong> — schema mà code mong đợi có thật sự tồn tại không?</li>
</ul>
<p><strong>Cái giá, đo được:</strong> 73 unit test chạy trong 0,24 giây; 11 test tích hợp trong 1,85 giây, container sẵn sàng trong khoảng 1,2–2,1 giây qua các lần chạy. Giữ luật trong unit test nhanh và dùng một nhóm test tích hợp gọn cho SQL — kim tự tháp của bài 0.2 với số liệu thật.</p>

${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-4-db-that', title: 'Gặp lại ở khoá Node.js — 14.4: test với bảng thật', sub: 'Cùng ý tưởng nhìn từ phía API: repository giả trả 201 năm lần trong khi bảng thật chỉ nhận một dòng và ném 23505 bốn lần.', cta: 'MỞ BÀI →' })}
${lienKet({ bai: 'swt301-test-levels', title: 'Đã gặp ở SWT301 — 2.2: component testing và integration testing', sub: 'Giống: integration testing kiểm các thành phần làm việc cùng nhau. Khác: ở đây một phía của phép tích hợp là PostgreSQL thật trong container, do chính lần chạy test bật lên.', cta: 'MỞ BÀI SWT301 →' })}

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<ol>
<li>Biến lỗi tranh chấp của Chương 2 thành một test PostgreSQL đạt: sau hai lượt đặt đồng thời, bảng có đúng một dòng.</li>
<li>Chèn giờ kết thúc <code>'25:00'</code> thẳng qua adapter và khẳng định mã lỗi của PostgreSQL.</li>
</ol>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', CODE.th41)}
${ra(gon(OUT['41-th']))}
<p>22008 là <em>datetime_field_overflow</em>: PostgreSQL biết không có 25 giờ; đồ giả thì sẽ cứ thế lưu chuỗi.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">integration test (test tích hợp)</span><span class="v">Test code của ta cùng một phụ thuộc thật — ở đây là PostgreSQL.</span></div>
  <div class="kv"><span class="k">exclusion constraint (ràng buộc loại trừ)</span><span class="v">Luật không cho hai dòng xung đột theo các phép so cho trước, vd cùng phòng và khoảng giờ chồng nhau.</span></div>
  <div class="kv"><span class="k">SQLSTATE</span><span class="v">Mã lỗi năm ký tự của PostgreSQL: 23P01, 23514, 22P02…</span></div>
  <div class="kv"><span class="k">type affinity</span><span class="v">Kiểu dữ liệu “lỏng” của SQLite: kiểu của cột chỉ là ưu tiên, không phải luật.</span></div>
</div>

<h3>🗺 Vì sao đặt trùng chỉ lộ trên CSDL thật</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Request A</div><div class="lz-d">findOverlap → khung còn trống</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Request B</div><div class="lz-d">findOverlap → khung vẫn còn trống</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">A ghi</div><div class="lz-d">dòng được lưu</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">B ghi</div><div class="lz-d">dòng được lưu — đặt trùng</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Ràng buộc EXCLUDE</div><div class="lz-d">PostgreSQL từ chối B với 23P01</div></div>
</div>
<div class="pitfall"><strong>Dùng SQLite thay thế.</strong> Một CSDL nhẹ hơn làm test nhanh hơn nhưng không có ràng buộc loại trừ hay các kiểu dữ liệu của PostgreSQL, nên chính luật chặn đặt trùng không bao giờ được chạy. Hãy test trên CSDL bạn chạy ở production.</div>
<h3>📌 Tóm tắt</h3>
<ul>
<li>Adapter mới cho cùng port; <code>bookLab</code> giữ nguyên, chỉ thêm việc cho OVERLAP đi qua.</li>
<li>Lỗi tranh chấp có thật trên PostgreSQL; ràng buộc loại trừ làm cơ sở dữ liệu từ chối nó.</li>
<li>Đổi mã lỗi của cơ sở dữ liệu sang lỗi của mình, giữ bản gốc trong <code>cause</code>.</li>
<li>SQLite ≠ PostgreSQL: test đúng engine bạn triển khai.</li>
<li>Test tích hợp tốn vài giây — giữ chúng tập trung vào thứ chỉ cơ sở dữ liệu mới cho thấy.</li>
</ul>
<a class="link-card lien-ket-cheo" href="/courses/nodejs/learn?lessonSlug=nodejs-12-4-nguyen-tu-rate-limit-lock" target="_blank" rel="noopener">
  <span class="lc-ico">🔗</span>
  <span class="lc-body"><span class="lc-title">Áp vào Node.js — bài 12.4: cùng cuộc đua trong Redis</span><span class="lc-sub">500 request song song qua giới hạn 100: INCR cho 100, chặn 400; GET → kiểm → SET cho cả 500 lọt và bộ đếm dừng ở 1. Chỉ một test song song trên Redis thật mới thấy — dùng mock thì test vẫn xanh.</span></span>
  <span class="lc-cta">MỞ BÀI NODE.JS →</span>
</a>
</div>
`,
};
