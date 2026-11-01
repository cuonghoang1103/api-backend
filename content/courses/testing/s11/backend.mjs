/**
 * Testing · Chương 11 · 11.2 — Test backend từ đầu tới cuối. Slug giữ từ khung: tst-11-2-backend.
 * US-11 ở backend: luật thuần cancelDecision (bảng quyết định 13 dòng), service cancelMyBooking, repository bộ nhớ + PostgreSQL, API
 * GET /api/bookings + POST /api/bookings/:id/cancel, openapi.json 1.1.0. Đo thật: Stryker trên cancel.js 97,73% ở Hà Nội vs 100% ở UTC
 * (đột biến bỏ "+07:00") ⇒ stryker.config.mjs chạy theo UTC; bốn bug chỉ PostgreSQL thấy (unit 298 passed, tích hợp đỏ): ngày thành JS Date
 * ⇒ mọi lượt huỷ TOO_LATE, ràng buộc loại trừ thiếu WHERE (23P01), UPDATE không nguyên tử (cả hai "ok"), id vượt int4 (500).
 * Toàn bộ: mutation 99,08% (433) ≥ 98,99% của Ch10. Thực hành 409 trên PostgreSQL + hợp đồng (demo11/th112). Output ở ./_ma.mjs.
 */
import G from '../giang/tst-11-2.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (k, re) => OUT[k].split('\n').filter((l) => re.test(l)).join('\n');
const part = (src, needle, n) => { const d = src.split('\n'); const i = d.findIndex((l) => l.includes(needle)); return d.slice(i, i + n).join('\n'); };

const RULE = part(CODE.cancelRule, 'export function startsAtVN', 12);
const ID_CODE = part(CODE.apiRouter, 'const MAX_ID', 1) + '\n…\n' + part(CODE.apiRouter, 'if (!Number.isInteger(id)', 1);
const TABLE = '  it.each([\n' + part(CODE.cancelTest, "['the owner, exactly 60", 2) + '\n    …\n' + part(CODE.cancelTest, "['an admin, 30 minutes", 1) + '\n    …\n' + part(CODE.cancelTest, "])('%s'", 3);
const RULE_OUT = loc('112-rule', /^\$ |✓ src|cancelDecision|59 minutes|admins are not bound|no leak|Tests {2}/);
const VN = loc('112-stryker-vn', /^\$ |Survived|cancel\.js:|^[-+] |^All files/);
const UTC = loc('112-stryker-utc', /^\$ |^All files/);
const FIX = CODE.stryker.split('\n').slice(1, 4).join('\n');
const SVC = part(CODE.svc, 'export async function cancelMyBooking', 6);
const SVC_OUT = loc('112-service', /^\$ |✓ (two|someone|refuses|a cancelled)|Tests {2}/);
const API_OUT = loc('112-api', /^\$ |07:01|thay \(LECTURER|2147483648|Tests {2}/);
const NGAY = loc('112-pg-ngay', /^planted|×|^[-+] +"date"|^[-+] {3}"(ALREADY|ok|TOO_LATE)|Tests {2}/);
const UNIT_298 = OUT['112-pg-ngay-unit'].split('\n').find((l) => /Tests {2}/.test(l)).trim();
const COLUMNS = part(CODE.pgRepo, '// Chapter 11: read rows back', 4);
const WHERE = part(CODE.schema, 'CONSTRAINT no_overlap', 4);
const WHERE_OUT = loc('112-pg-where', /^planted|×|Caused by: error|Tests {2}/);
const UPD = part(CODE.pgRepo, 'async cancel(id)', 5);
const RACE = loc('112-pg-race', /^planted|×|^[-+] {3}"|Tests {2}/);
const ID_OUT = loc('112-pg-id', /^planted|×|AssertionError|Tests {2}/);
const MUT = loc('112-mutation', /^\$ |Instrumented|^All files|^ cancel\.js|Final mutation/);
const COV = loc('112-cov', /^\$ |^All files/);
const TH_TEST = part(CODE.th112, "it('cancelling twice", 13);
const TH_XANH = loc('112-th-xanh', /^\$ |✓ |Tests {2}/);
const TH_DO = loc('112-th-do', /^planted|×|AssertionError|Tests {2}/);

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Rule</div><div class="lz-d">cancelDecision — pure: who, status, minutes left</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Service</div><div class="lz-d">cancelMyBooking — fetch, decide, cancel in one step</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Repository</div><div class="lz-d">in memory for speed · PostgreSQL for truth</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">HTTP API</div><div class="lz-d">codes → 200 / 404 / 409 / 422, checked against openapi.json</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Luật</div><div class="lz-d">cancelDecision — thuần: ai, trạng thái, còn bao phút</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Service</div><div class="lz-d">cancelMyBooking — lấy, quyết, huỷ trong một bước</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Repository</div><div class="lz-d">bộ nhớ cho nhanh · PostgreSQL cho đúng sự thật</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">API HTTP</div><div class="lz-d">mã → 200 / 404 / 409 / 422, đối chiếu openapi.json</div></div>
</div>`;

const PG_EN = `<table>
<thead><tr><th>Bug planted</th><th>Unit + API suite</th><th>DB integration</th><th>What a user would see</th></tr></thead>
<tbody>
<tr><td>read <code>date</code> straight from the column</td><td>298 passed</td><td>4 failed</td><td>dates shift a day in JSON; every cancel says TOO_LATE</td></tr>
<tr><td>exclusion constraint without <code>WHERE (status &lt;&gt; 'CANCELLED')</code></td><td>does not touch SQL</td><td>1 failed (23P01)</td><td>a cancelled slot can never be booked again</td></tr>
<tr><td><code>UPDATE … WHERE id = $1</code> without the status check</td><td>does not touch SQL</td><td>1 failed (both “ok”)</td><td>two cancels both succeed</td></tr>
<tr><td>no <code>id &gt; MAX_ID</code> check</td><td>298 passed</td><td>1 failed (500)</td><td>a crafted URL gets a server error</td></tr>
</tbody></table>`;
const PG_VI = `<table>
<thead><tr><th>Bug cài vào</th><th>Bộ unit + API</th><th>Tích hợp CSDL</th><th>Người dùng sẽ thấy gì</th></tr></thead>
<tbody>
<tr><td>đọc thẳng cột <code>date</code></td><td>298 passed</td><td>4 failed</td><td>ngày lệch một ngày trong JSON; lượt huỷ nào cũng TOO_LATE</td></tr>
<tr><td>ràng buộc loại trừ thiếu <code>WHERE (status &lt;&gt; 'CANCELLED')</code></td><td>không chạm SQL</td><td>1 failed (23P01)</td><td>khung đã huỷ không bao giờ đặt lại được</td></tr>
<tr><td><code>UPDATE … WHERE id = $1</code> thiếu kiểm trạng thái</td><td>không chạm SQL</td><td>1 failed (cả hai “ok”)</td><td>hai lượt huỷ cùng thành công</td></tr>
<tr><td>bỏ kiểm <code>id &gt; MAX_ID</code></td><td>298 passed</td><td>1 failed (500)</td><td>một URL cố ý gõ sai nhận lỗi máy chủ</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🐘', 'node-postgres — Data types', 'How pg parses date and time columns into JavaScript values, and how to change it.', 'https://node-postgres.com/features/types'),
  nguon('📗', 'PostgreSQL 17 — Constraints (exclusion constraints)', 'EXCLUDE USING gist, and the WHERE clause that makes it partial.', 'https://www.postgresql.org/docs/17/ddl-constraints.html'),
].join('\n');

export default {
  title: '11.2 — Testing the backend end to end|||11.2 — Test backend từ đầu tới cuối',
  slug: 'tst-11-2-backend',
  type: 'LESSON',
  isFreePreview: true,
  description: 'US-11 "My bookings" ở backend, test ở mọi tầng: luật huỷ thành bảng quyết định 13 dòng (60 và 59 phút, chủ lượt đặt, sinh viên khác, giảng viên, admin), Stryker trên cancel.js 97,73% ở Hà Nội mà 100% ở UTC (đột biến bỏ "+07:00" chỉ vô hình trên máy ở Việt Nam), service và API trên repository bộ nhớ có kiểm hợp đồng openapi.json, rồi bốn bug chỉ PostgreSQL 17 mới cho thấy trong khi 298 unit test vẫn xanh: ngày thành JS Date lúc nửa đêm giờ máy (và mọi lượt huỷ thành "quá muộn"), ràng buộc loại trừ chặn khung đã huỷ (23P01), UPDATE không nguyên tử để hai lượt huỷ cùng thắng, id vượt int4 thành 500. Cả bộ: 99,08% của 433 đột biến, cao hơn 98,99% của Chương 10.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>Testing the backend end to end</h2>
<p class="lead">The plan of lesson 11.1 named the risks; this lesson builds US-11 on the backend and tests it at every layer that can see one of them — from a pure rule to a real PostgreSQL 17 — measuring what each layer catches and what it misses.</p>
<p><strong>After this lesson you can</strong> turn a rule into a decision table of tests, read a mutation score as a fact about the machine it ran on, test a service and an API against their contract, and find the bugs only the real database shows. <strong>Why it is useful:</strong> “it works with the in-memory repo” is how backend bugs reach production — the four below each passed 298 unit tests.</p>

<h3>The feature in four small pieces</h3>
${FLOW_EN}
<p>The rule is a pure function — no clock, no database:</p>
${ma('javascript', RULE)}
<p>The service only fetches and saves; the API only maps the rule's codes to statuses: <code>NOT_FOUND → 404</code>, <code>ALREADY_CANCELLED → 409</code>, <code>TOO_LATE_TO_CANCEL → 422</code>.</p>

<h3>The rule: a decision table becomes it.each</h3>
<p>Who asks × the booking's status × the minutes left is a decision table, as in SWT301 4.4: each column becomes one row, with 60 and 59 minutes as the boundary:</p>
${ma('javascript', TABLE)}
${ra(RULE_OUT)}

<h3>Same tests, same code: 97.73% in Ha Noi, 100% in UTC</h3>
<p>Mutation testing on the new rule, on a laptop in Viet Nam:</p>
${ra(VN)}
<p>The same command with no <code>TZ</code> set, after the fix below:</p>
${ra(UTC)}
<p>The survivor drops <code>+07:00</code>; JavaScript then reads the string in the machine's local zone — which in Ha Noi <em>is</em> +07:00, so no test can see it. On a UTC server the booking would start at 16:00 Ha Noi time: cancelling stays open 7 hours too long. The fix pins Stryker to UTC:</p>
${ma('javascript', FIX)}
<div class="pitfall co-tieu-de"><strong>A mutant that survives only on your machine is not an equivalent mutant.</strong> Chapter 8's equivalent mutants in <code>days.js</code> give the same result everywhere; this one depends on <code>TZ</code>. Run mutation testing where production runs (UTC, also GitHub's runners), and run the unit suite in Viet Nam time once a night (lesson 11.4) — two time zones catch both directions.</div>

<h3>Service and API: fast, on the in-memory repository</h3>
<p>The service fetches, asks the rule, then cancels in <strong>one</strong> repository call, so of two cancels at the same moment only one can win:</p>
${ma('javascript', SVC)}
${ra(SVC_OUT)}
<p>The API tests use Supertest (Chapter 5) and check every response with <code>contractErrors()</code> against <code>openapi.json</code>, which now documents 200, 401, 404, 409 and 422 for the cancel path:</p>
${ra(API_OUT)}

<h3>Four bugs only PostgreSQL can show</h3>
<p>The in-memory repository stores strings and has no constraints, no driver, no 4-byte integers: fast <em>because</em> it is not PostgreSQL, so it cannot fail like PostgreSQL. Each bug was planted with <code>scripts/thu-loi.mjs</code>:</p>
${PG_EN}
<p><strong>1. Dates.</strong> A <code>SELECT date</code> instead of <code>to_char(date, 'YYYY-MM-DD')</code>:</p>
${ra(NGAY)}
<p>The unit suite with the same bug: <code>${UNIT_298}</code>. node-postgres turns a <code>date</code> into a JavaScript <code>Date</code> at <em>local</em> midnight — 16 November in Ha Noi becomes <code>2026-11-15T17:00:00.000Z</code> — so <code>startsAtVN()</code> cannot read it and everyone gets TOO_LATE_TO_CANCEL. Format in SQL instead:</p>
${ma('javascript', COLUMNS)}
<p><strong>2. The partial exclusion constraint.</strong> Chapter 4's constraint must now ignore cancelled rows:</p>
${ma('sql', WHERE)}
${ra(WHERE_OUT)}
<p><strong>3. The atomic cancel.</strong> “Is it still active? Then cancel it” as two steps lets two requests both win. The check belongs in the <code>UPDATE</code>:</p>
${ma('javascript', UPD)}
${ra(RACE)}
<p><strong>4. The 4-byte id.</strong> <code>serial</code> is an <code>int4</code>. Without the <code>MAX_ID</code> check, <code>/api/bookings/2147483648/cancel</code> reaches PostgreSQL and comes back as a 500:</p>
${ma('javascript', ID_CODE)}
${ra(ID_OUT)}
<p>The unit suite with the same bug: <code>${UNIT_298}</code> — the in-memory repository answers 404 for any id it does not have.</p>
<div class="pitfall co-tieu-de"><strong>A green unit suite on an in-memory repository says nothing about SQL.</strong> Types, constraints, concurrency and limits live in the database engine. Keep the fast suite for rules and wiring — and give every new query, constraint or column at least one test on the real engine, with the same data shapes the API promises.</div>

<h3>The whole backend, measured</h3>
${ra(MUT)}
${ra(COV)}
<p>99.08% of 433 mutants, above Chapter 10's 98.99%; <code>cancel.js</code> 44/44; the four survivors are the old ones. Coverage is over the minimums of lesson 11.4.</p>

<h3>JUnit and Spring</h3>
<p>In Spring Boot: the rule as a JUnit 5 <code>@ParameterizedTest</code>, the controller with <code>MockMvc</code>, the repository with <code>@DataJpaTest</code> on a Testcontainers PostgreSQL (not H2). The date trap is there too — <code>java.sql.Date</code> plus the JVM default zone; use <code>LocalDate</code>.</p>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>Write an integration test: on PostgreSQL, cancel the same booking twice; the second answer must be <code>409 ALREADY_CANCELLED</code> and must match <code>openapi.json</code>. Then plant <code>ALREADY_CANCELLED: 409 → 400</code> and watch it go red.</p>
<p><strong>Solution and real output:</strong></p>
${ma('javascript', TH_TEST)}
${ra(TH_XANH)}
${ra(TH_DO)}
<p><strong>Done when</strong> your test is green on PostgreSQL, red with the planted 400, and you can say what it proves that the unit API test does not: the PostgreSQL row shape.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">decision table (bảng quyết định)</span><span class="v">Every combination of conditions and its outcome; each column becomes a test row.</span></div>
  <div class="kv"><span class="k">in-memory repository (repository bộ nhớ)</span><span class="v">A fake with the real interface: fast, but blind to SQL.</span></div>
  <div class="kv"><span class="k">exclusion constraint, partial (ràng buộc loại trừ có điều kiện)</span><span class="v">EXCLUDE … WHERE: the rule applies only to rows that match.</span></div>
  <div class="kv"><span class="k">atomic update (cập nhật nguyên tử)</span><span class="v">Check and change in one statement, so concurrent requests cannot both win.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Small pieces — rule, service, repository, API — each tested where it is cheapest; the rule as a decision table.</li>
<li>Mutation scores depend on where they run: 97.73% in Ha Noi, 100% in UTC. Run mutants in UTC, units also in Viet Nam time.</li>
<li>Four bugs passed 298 unit tests and failed only on PostgreSQL: dates, a partial constraint, a non-atomic update, a 4-byte id. The suite still kills 99.08% of 433 mutants.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-4-db-that', title: 'Node.js course — 14.4: tests on a real database', sub: 'There: why a real database in tests, and how to set it up. Here: four concrete bugs it caught on one feature while 298 unit tests stayed green.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'api-design', bai: 'api-7-1-kiem-hop-dong', title: 'API Design — 7.1: checking the contract', sub: 'There: the OpenAPI contract and how to verify responses against it. Here: the same check run against the PostgreSQL-backed API, where it caught the date shape.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Test backend từ đầu tới cuối</h2>
<p class="lead">Kế hoạch ở bài 11.1 đã gọi tên các rủi ro; bài này dựng US-11 ở backend và test nó ở mọi tầng nhìn thấy được một trong số đó — từ một luật thuần tới PostgreSQL 17 thật — đo xem tầng nào bắt được gì và bỏ lọt gì.</p>
<p><strong>Sau bài này bạn có thể</strong> biến một luật thành bảng quyết định (decision table) của các test, đọc điểm đột biến như sự thật về chiếc máy đã chạy nó, test service và API theo hợp đồng, và tìm những bug chỉ CSDL thật cho thấy. <strong>Vì sao hữu ích:</strong> “chạy được với repository bộ nhớ” là đường bug backend ra production — bốn bug dưới đây, bug nào cũng qua 298 unit test.</p>

<h3>Tính năng gồm bốn mảnh nhỏ</h3>
${FLOW_VI}
<p>Luật là một hàm thuần — không đồng hồ, không CSDL:</p>
${ma('javascript', RULE)}
<p>Service chỉ lấy và lưu; API chỉ đổi mã của luật thành mã HTTP: <code>NOT_FOUND → 404</code>, <code>ALREADY_CANCELLED → 409</code>, <code>TOO_LATE_TO_CANCEL → 422</code>.</p>

<h3>Luật: bảng quyết định thành it.each</h3>
<p>Ai hỏi × trạng thái lượt đặt × số phút còn lại là một bảng quyết định, như SWT301 bài 4.4: mỗi cột thành một dòng, 60 và 59 phút là giá trị biên:</p>
${ma('javascript', TABLE)}
${ra(RULE_OUT)}

<h3>Cùng test, cùng code: 97,73% ở Hà Nội, 100% ở UTC</h3>
<p>Mutation testing trên luật mới, chạy trên laptop ở Việt Nam:</p>
${ra(VN)}
<p>Cùng lệnh đó, không đặt <code>TZ</code>, sau khi sửa như bên dưới:</p>
${ra(UTC)}
<p>Đột biến sống sót bỏ <code>+07:00</code>; JavaScript khi đó đọc chuỗi theo múi giờ của máy — mà ở Hà Nội thì <em>chính là</em> +07:00, nên không test nào thấy. Trên máy chủ UTC, lượt đặt sẽ bắt đầu lúc 16:00 giờ Hà Nội: cửa huỷ mở lâu thêm 7 tiếng. Cách sửa ghim Stryker vào UTC:</p>
${ma('javascript', FIX)}
<div class="pitfall co-tieu-de"><strong>Đột biến chỉ sống trên máy của bạn không phải đột biến tương đương.</strong> Các đột biến tương đương trong <code>days.js</code> ở Chương 8 cho cùng kết quả ở mọi nơi; đột biến này phụ thuộc <code>TZ</code>. Hãy chạy mutation testing ở nơi production chạy (UTC, cũng là runner của GitHub), và chạy bộ unit theo giờ Việt Nam mỗi đêm một lần (bài 11.4) — hai múi giờ bắt được cả hai chiều.</div>

<h3>Service và API: nhanh, trên repository bộ nhớ</h3>
<p>Service lấy lượt đặt, hỏi luật, rồi huỷ bằng <strong>một</strong> lời gọi repository, nên trong hai lượt huỷ cùng lúc chỉ một lượt thắng được:</p>
${ma('javascript', SVC)}
${ra(SVC_OUT)}
<p>Test API dùng Supertest (Chương 5) và kiểm mọi phản hồi bằng <code>contractErrors()</code> với <code>openapi.json</code>, nay mô tả 200, 401, 404, 409 và 422 cho đường huỷ:</p>
${ra(API_OUT)}

<h3>Bốn bug chỉ PostgreSQL mới cho thấy</h3>
<p>Repository bộ nhớ lưu chuỗi, không ràng buộc, không driver, không số nguyên 4 byte: nhanh <em>chính vì</em> nó không phải PostgreSQL, nên không thể hỏng theo kiểu PostgreSQL. Từng bug được cài bằng <code>scripts/thu-loi.mjs</code>:</p>
${PG_VI}
<p><strong>1. Ngày tháng.</strong> <code>SELECT date</code> thay cho <code>to_char(date, 'YYYY-MM-DD')</code>:</p>
${ra(NGAY)}
<p>Bộ unit với cùng bug đó: <code>${UNIT_298}</code>. node-postgres biến cột <code>date</code> thành <code>Date</code> của JavaScript lúc nửa đêm <em>giờ máy</em> — ngày 16/11 ở Hà Nội thành <code>2026-11-15T17:00:00.000Z</code> — nên <code>startsAtVN()</code> không đọc được và ai cũng nhận TOO_LATE_TO_CANCEL. Hãy định dạng ngay trong SQL:</p>
${ma('javascript', COLUMNS)}
<p><strong>2. Ràng buộc loại trừ có điều kiện.</strong> Ràng buộc của Chương 4 giờ phải bỏ qua các dòng đã huỷ:</p>
${ma('sql', WHERE)}
${ra(WHERE_OUT)}
<p><strong>3. Lượt huỷ nguyên tử.</strong> “Còn hiệu lực không? Có thì huỷ” làm thành hai bước thì hai request cùng thắng được. Phép kiểm phải nằm trong <code>UPDATE</code>:</p>
${ma('javascript', UPD)}
${ra(RACE)}
<p><strong>4. Id 4 byte.</strong> <code>serial</code> là <code>int4</code>. Thiếu phép kiểm <code>MAX_ID</code>, <code>/api/bookings/2147483648/cancel</code> đi tới PostgreSQL và quay về thành lỗi 500:</p>
${ma('javascript', ID_CODE)}
${ra(ID_OUT)}
<p>Bộ unit với cùng bug đó: <code>${UNIT_298}</code> — repository bộ nhớ trả 404 cho mọi id nó không có.</p>
<div class="pitfall co-tieu-de"><strong>Bộ unit xanh trên repository bộ nhớ không nói được gì về SQL.</strong> Kiểu dữ liệu, ràng buộc, tranh chấp và giới hạn nằm trong engine CSDL. Giữ bộ test nhanh cho luật và sợi dây nối — và cho mỗi câu truy vấn, ràng buộc hay cột mới ít nhất một test trên engine thật, với đúng hình dạng dữ liệu mà API hứa.</div>

<h3>Cả backend, đo bằng số</h3>
${ra(MUT)}
${ra(COV)}
<p>99,08% trong 433 đột biến, cao hơn 98,99% của Chương 10; <code>cancel.js</code> 44/44; bốn đột biến sống là bốn con cũ. Độ phủ vượt các mức tối thiểu của bài 11.4.</p>

<h3>JUnit và Spring</h3>
<p>Trong Spring Boot: luật là <code>@ParameterizedTest</code> JUnit 5, controller test bằng <code>MockMvc</code>, repository bằng <code>@DataJpaTest</code> trên PostgreSQL của Testcontainers (không dùng H2). Bẫy ngày tháng cũng có — <code>java.sql.Date</code> cộng múi giờ mặc định của JVM; hãy dùng <code>LocalDate</code>.</p>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Viết một test tích hợp: trên PostgreSQL, huỷ cùng một lượt đặt hai lần; câu trả lời thứ hai phải là <code>409 ALREADY_CANCELLED</code> và phải khớp <code>openapi.json</code>. Rồi cài <code>ALREADY_CANCELLED: 409 → 400</code> và nhìn nó đỏ.</p>
<p><strong>Lời giải và output thật:</strong></p>
${ma('javascript', TH_TEST)}
${ra(TH_XANH)}
${ra(TH_DO)}
<p><strong>Xong khi</strong> test của bạn xanh trên PostgreSQL, đỏ với số 400 cài vào, và bạn nói được nó chứng minh thêm điều gì so với test API ở tầng unit: hình dạng dòng dữ liệu của PostgreSQL.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">decision table (bảng quyết định)</span><span class="v">Mọi tổ hợp điều kiện và kết quả của nó; mỗi cột thành một dòng test.</span></div>
  <div class="kv"><span class="k">in-memory repository (repository bộ nhớ)</span><span class="v">Bản giả có giao diện thật: nhanh, nhưng mù với SQL.</span></div>
  <div class="kv"><span class="k">exclusion constraint, partial (ràng buộc loại trừ có điều kiện)</span><span class="v">EXCLUDE … WHERE: luật chỉ áp cho các dòng thoả điều kiện.</span></div>
  <div class="kv"><span class="k">atomic update (cập nhật nguyên tử)</span><span class="v">Kiểm và đổi trong một câu lệnh, để các request đồng thời không cùng thắng.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Mảnh nhỏ — luật, service, repository, API — mảnh nào test ở chỗ rẻ nhất; luật thành bảng quyết định.</li>
<li>Điểm đột biến phụ thuộc nơi chạy: 97,73% ở Hà Nội, 100% ở UTC. Chạy đột biến theo UTC, chạy unit thêm theo giờ Việt Nam.</li>
<li>Bốn bug qua được 298 unit test và chỉ đỏ trên PostgreSQL: ngày tháng, ràng buộc có điều kiện, UPDATE không nguyên tử, id 4 byte. Bộ test vẫn diệt 99,08% trong 433 đột biến.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'nodejs', bai: 'nodejs-14-4-db-that', title: 'Khoá Node.js — 14.4: test trên CSDL thật', sub: 'Ở đó: vì sao cần CSDL thật trong test, và cách dựng. Ở đây: bốn bug cụ thể nó bắt được trên một tính năng trong khi 298 unit test vẫn xanh.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'api-design', bai: 'api-7-1-kiem-hop-dong', title: 'API Design — 7.1: kiểm hợp đồng', sub: 'Ở đó: hợp đồng OpenAPI và cách đối chiếu phản hồi với nó. Ở đây: cùng phép kiểm đó chạy trên API dùng PostgreSQL, nơi nó bắt được hình dạng ngày tháng.', cta: 'MỞ BÀI →' })}
</div>
`,
};
