/**
 * Node.js — Chương 14: Kiểm thử.
 * Mọi output là đo thật: Node v22.21.0 (máy 10 nhân), vitest 4.1.10,
 * jest 30.4.2, supertest 7.2.2, node:test có sẵn trong Node 22,
 * PostgreSQL 16 (local :5433 và container tạm), express 5.2.1, zod 4.4.3.
 * Phần CI và bộ test production lấy từ chính repo cuongthai.com.
 */
const REF = '?ref=%2Fcourses%2Fnodejs%2Flearn&reflabel=Node.js';

export default {
  title: 'Chapter 14 — Testing|||Chương 14 — Kiểm thử',
  description: 'Một bài test đáng giá bao nhiêu mili-giây, vì sao repo giả nói dối còn bảng thật thì không, làm sao để test chạy song song mà không giẫm chân nhau, và vì sao 100% độ phủ dòng vẫn để lọt một lỗ leo thang quyền.',
  lessons: [
    /* ─────────────────────────── 14.1 ─────────────────────────── */
    {
      title: '14.1 — What a test costs and what it buys|||14.1 — Một bài test giá bao nhiêu và mua được gì',
      slug: 'nodejs-14-1-vi-sao-test',
      type: 'VIDEO',
      description: 'Đo giá thật của một bài test ở ba tầng (0,0006ms · 5,5ms · 3,3ms), rồi so ba bộ chạy test node:test, vitest và jest bằng cùng một bộ 1000 test.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.1</span>
<h2>What a test costs and what it buys</h2>
<p class="lead">Thirteen chapters have shipped code by running it once and looking at the output. That works while a feature is new and you are the only person touching it. It stops working the moment a change in chapter 12 breaks something you wrote in chapter 8 — because nothing in your workflow re-checks chapter 8. A test suite is that re-check, automated. The question is not whether to have one. The question is what each second of test time buys you, and the answer differs by a factor of ten thousand depending on which kind of test you write.</p>

<h3>Three kinds of test, measured</h3>
<p>Take one assertion — "creating a note returns 201 and the slug is derived from the title" — and write it three ways against the same application code. A hundred repetitions each, on the Notes API this course has been building:</p>
<div class="out">unit  (repo giả)          0.5ms / 100 = 0.005ms mỗi test
integration (app + DB)    548.5ms / 100 = 5.5ms mỗi test  (1216× unit)
e2e (server thật + HTTP)  331.0ms / 100 = 3.3ms mỗi test  (734× unit)</div>
<p>Pushed to a hundred thousand iterations, the pure business-logic call settles at <strong>0,0006ms — 1.613.019 calls per second</strong>. The same logic exercised through HTTP and a real PostgreSQL table costs <strong>5,5ms</strong>. That is roughly <strong>9.000×</strong>.</p>
<p>Read that as a budget, not as a verdict. A ten-second test suite can hold either 16 million unit assertions or 1.800 integration ones. Both suites take ten seconds; they do not catch the same bugs.</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Unit</span><span class="lz-d">0.0006ms · tests one function with every dependency faked. Catches logic errors, boundary errors, arithmetic errors</span></div>
  <div class="lz-node"><span class="lz-t">Integration</span><span class="lz-d">5.5ms · tests route + service + a real DB. Catches SQL errors, constraint violations, status codes, authorisation</span></div>
  <div class="lz-node"><span class="lz-t">E2E</span><span class="lz-d">3.3ms and up · a real server listening on a port, a real HTTP client. Catches assembly errors: middleware in the wrong order, a route never mounted</span></div>
</div>

<div class="callout">
<p><strong>The surprise in that table.</strong> The e2e number (3,3ms) is <em>lower</em> than the integration number (5,5ms), which contradicts every pyramid diagram ever drawn. The reason is a tool detail, not a law of nature: <code>supertest</code> boots an ephemeral HTTP server for <em>every single request</em> and tears it down afterwards, while the e2e loop called <code>server.listen()</code> once and reused it. Lesson 14.3 comes back to this. The lesson for now: measure your own suite instead of trusting the diagram.</p>
</div>

<h3>Choosing a runner — with numbers instead of opinions</h3>
<p>Three realistic choices in 2026: the runner built into Node, vitest, and jest. The comparison below is the <strong>same six assertions</strong> and then the <strong>same 1000 assertions</strong> (50 files × 20 tests), same machine, best of three runs, wall-clock time of the whole command:</p>
<div class="out">                     6 test    1000 test   gói cài thêm   dung lượng
node:test (Node 22)   0,10s      0,71s          0            0
vitest 4.1.10         0,76s      2,20s         75          34MB
jest 30.4.2           0,86s*     2,08s        322          43MB

* jest đo trên 12 test (bộ tương đương), không có mốc 6 test riêng</div>
<p>Two things fall out of that table, and neither matches the marketing.</p>
<p><strong>One.</strong> "vitest is much faster than jest" is not true for plain unit tests — at 1000 tests jest was <em>slightly ahead</em>. Vitest's speed advantage is real in a Vite front-end project, where it reuses the same transform pipeline your app already uses. On a plain Node backend there is no such pipeline to reuse.</p>
<p><strong>Two.</strong> The built-in runner beat both at every size, and it beat them by the widest margin on the small suite — 0,10s versus 0,76s — which is exactly the case you run hundreds of times a day while writing code.</p>

<h3>What the built-in runner looks like</h3>
<p>No install, no config file, no <code>node_modules</code> entry:</p>
<pre><code>import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, canEdit } from '../src/slug.mjs';

describe('slugify', () =&gt; {
  test('lowercases and joins with dashes', () =&gt; assert.equal(slugify('Hello World'), 'hello-world'));
  test('drops the extra dashes', () =&gt; assert.equal(slugify('  --Hello--  '), 'hello'));
  test('caps the length at 60', () =&gt; assert.equal(slugify('a'.repeat(200)).length, 60));
});</code></pre>
<div class="out">$ node --test 'nodetest/**/*.test.mjs'
# tests 6
# suites 2
# pass 6
# fail 0
# duration_ms 62.064542
real 0.10</div>
<p>With <code>--test-reporter=dot</code> the output collapses to <code>........</code>. Node also ships <code>--watch</code>, <code>--test-only</code>, <code>--test-name-pattern</code>, and — since Node 22 — built-in coverage with <code>--experimental-test-coverage</code>.</p>

<div class="pitfall">
<p><strong>Pitfall — a bare directory is not a glob.</strong> <code>node --test nodetest/</code> looks like it should work and instead dies with <code>Error: Cannot find module '…/nodetest'</code> and <code>MODULE_NOT_FOUND</code>, because the argument is resolved as a file to execute. Pass a quoted glob: <code>node --test 'nodetest/**/*.test.mjs'</code>, or pass nothing at all and let Node discover <code>*.test.*</code> files itself.</p>
</div>

<h3>Where jest costs you a day</h3>
<p>The 1000-test benchmark above ran identical source files under both runners. Getting jest to that starting line took a detour that vitest and node:test did not:</p>
<div class="out">$ npx jest
    /…/tests/service.test.mjs:1
    import { describe, it, expect, jest } from '@jest/globals';
    ^^^^^^
    SyntaxError: Cannot use import statement outside a module
Test Suites: 2 failed, 2 total
Tests:       0 total</div>
<p>The package has <code>"type": "module"</code>, the files are <code>.mjs</code>, and jest 30 still needs a flag:</p>
<div class="out">$ NODE_OPTIONS=--experimental-vm-modules npx jest
(node:10774) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total</div>
<p>Two more small taxes surfaced while porting: <code>vi.fn</code> becomes <code>jest.fn</code>, and vitest's <code>toHaveBeenCalledOnce()</code> does not exist in jest — <code>ReferenceError: vi is not defined</code> and a missing-matcher error respectively. None of this is hard. All of it is friction you pay once per project and then again every time a contributor's editor autocompletes the wrong one.</p>

<h3>So which one</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">A pure Node backend, JS or TS through tsx</span><span class="v">node:test — zero dependencies, fastest on small suites, and never made obsolete by a Vite release</span></div>
  <div class="kv"><span class="k">A Vite / React frontend in the same repo</span><span class="v">vitest — shares the transform, the config and the matchers with the frontend</span></div>
  <div class="kv"><span class="k">An older repo with thousands of existing jest tests</span><span class="v">keep jest — the migration cost buys you nothing in the table above</span></div>
</div>
<p>This chapter writes its examples in vitest, because its <code>expect</code> API is the one most readers will meet in job interviews and in existing repos, and because its assertion output is the most readable while you are learning. Every example converts to <code>node:test</code> mechanically: <code>expect(x).toBe(y)</code> becomes <code>assert.equal(x, y)</code>, and lesson 14.2 shows the one place where the two runners genuinely behave differently.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> This site runs the built-in runner and nothing else. <code>package.json</code> has <code>"test": "tsx --test src/services/finance/money.test.ts src/services/payment/vnpay.test.ts src/services/cv/cv.test.ts"</code> — three files, 272 lines, <strong>20 tests in 1297ms</strong>, zero test-framework dependencies in <code>devDependencies</code>. The header comment of <code>money.test.ts</code> states the selection rule out loud: "Pure functions — no DB, no network — so they run fast and deterministically in CI." What got tested is exactly what is expensive to get wrong and cheap to check: decimal-safe money arithmetic (<code>0.1 + 0.2</code> must be <code>0.3</code>, not <code>0.30000000000000004</code>), HALF_UP rounding, a hand-verified 12-month debt schedule, and VNPay signature verification. Nobody wrote a test for "the profile page renders".</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-325"><span class="lc-t">Code Lab · Testing, Deployment, and Production Readiness</span><span class="lc-d">Testing exercises for a Node/Express backend</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/javascript${REF}#module-268"><span class="lc-t">Code Lab · JavaScript Patterns and Testing</span><span class="lc-d">Foundations of writing tests in JavaScript</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.1</span>
<h2>Một bài test giá bao nhiêu và mua được gì</h2>
<p class="lead">Mười ba chương vừa rồi, cách bạn giao code là chạy thử một lần rồi nhìn output. Cách đó ổn khi tính năng còn mới và chỉ mình bạn động vào. Nó hết ổn đúng vào lúc một thay đổi ở chương 12 làm hỏng thứ bạn viết từ chương 8 — bởi vì trong quy trình của bạn không có gì kiểm lại chương 8 nữa cả. Bộ test chính là phép kiểm lại đó, được tự động hoá. Câu hỏi không phải là có nên có hay không. Câu hỏi là mỗi giây chạy test mua được cho bạn cái gì, và câu trả lời chênh nhau tới mười nghìn lần tuỳ vào bạn viết loại test nào.</p>

<h3>Ba loại test, đo bằng số</h3>
<p>Lấy đúng một khẳng định — "tạo ghi chú thì trả 201 và slug suy ra từ tiêu đề" — rồi viết ba cách khác nhau trên cùng một đoạn code ứng dụng. Mỗi cách lặp 100 lần, trên chính Notes API mà khoá học này dựng suốt từ đầu:</p>
<div class="out">unit  (repo giả)          0.5ms / 100 = 0.005ms mỗi test
integration (app + DB)    548.5ms / 100 = 5.5ms mỗi test  (1216× unit)
e2e (server thật + HTTP)  331.0ms / 100 = 3.3ms mỗi test  (734× unit)</div>
<p>Đẩy lên một trăm nghìn vòng lặp, lời gọi logic nghiệp vụ thuần ổn định ở mức <strong>0,0006ms — 1.613.019 lần mỗi giây</strong>. Cũng logic ấy nhưng đi qua HTTP và một bảng PostgreSQL thật thì tốn <strong>5,5ms</strong>. Chênh khoảng <strong>9.000 lần</strong>.</p>
<p>Hãy đọc con số này như một ngân sách chứ không phải như một bản án. Một bộ test mười giây chứa được hoặc 16 triệu khẳng định unit, hoặc 1.800 khẳng định integration. Cả hai đều mất mười giây; chúng không bắt được cùng một loại lỗi.</p>

<div class="lz-map">
  <div class="lz-node"><span class="lz-t">Unit</span><span class="lz-d">0,0006ms · kiểm một hàm, mọi phụ thuộc đều là hàng giả. Bắt lỗi logic, lỗi biên, lỗi tính toán</span></div>
  <div class="lz-node"><span class="lz-t">Integration</span><span class="lz-d">5,5ms · kiểm route + service + DB thật. Bắt lỗi SQL, ràng buộc, mã trạng thái, phân quyền</span></div>
  <div class="lz-node"><span class="lz-t">E2E</span><span class="lz-d">từ 3,3ms trở lên · server thật nghe cổng, client HTTP thật. Bắt lỗi lắp ráp: middleware sai thứ tự, route chưa mount</span></div>
</div>

<div class="callout">
<p><strong>Điều bất ngờ trong bảng trên.</strong> Con số e2e (3,3ms) lại <em>thấp hơn</em> con số integration (5,5ms), trái ngược với mọi sơ đồ kim tự tháp từng được vẽ ra. Lý do nằm ở chi tiết của công cụ chứ không phải quy luật tự nhiên: <code>supertest</code> dựng một server HTTP tạm cho <em>từng request một</em> rồi dẹp đi ngay sau đó, trong khi vòng lặp e2e gọi <code>server.listen()</code> đúng một lần và dùng lại nó. Bài 14.3 sẽ quay lại chuyện này. Bài học lúc này: hãy đo bộ test của chính bạn thay vì tin vào sơ đồ.</p>
</div>

<h3>Chọn bộ chạy test — bằng số thay vì bằng cảm tính</h3>
<p>Năm 2026 có ba lựa chọn thực tế: bộ chạy có sẵn trong Node, vitest, và jest. So sánh dưới đây dùng <strong>đúng sáu khẳng định</strong>, rồi <strong>đúng 1000 khẳng định</strong> (50 file × 20 test), cùng máy, lấy lần tốt nhất trong ba lần, đo thời gian tường của cả lệnh:</p>
<div class="out">                     6 test    1000 test   gói cài thêm   dung lượng
node:test (Node 22)   0,10s      0,71s          0            0
vitest 4.1.10         0,76s      2,20s         75          34MB
jest 30.4.2           0,86s*     2,08s        322          43MB

* jest đo trên 12 test (bộ tương đương), không có mốc 6 test riêng</div>
<p>Bảng này rút ra hai điều, và cả hai đều không khớp với lời quảng cáo.</p>
<p><strong>Một.</strong> "vitest nhanh hơn jest nhiều" là không đúng với test unit thuần — ở mốc 1000 test thì jest còn <em>nhỉnh hơn một chút</em>. Lợi thế tốc độ của vitest là có thật trong một dự án front-end dùng Vite, nơi nó dùng lại đúng đường ống biên dịch mà ứng dụng của bạn đã có sẵn. Trên một backend Node thuần thì không có đường ống nào để dùng lại cả.</p>
<p><strong>Hai.</strong> Bộ chạy có sẵn thắng cả hai ở mọi kích cỡ, và thắng đậm nhất ở bộ nhỏ — 0,10s so với 0,76s — mà đó lại đúng là trường hợp bạn chạy hàng trăm lần mỗi ngày trong lúc đang viết code.</p>

<h3>Bộ chạy có sẵn trông thế nào</h3>
<p>Không cài gì, không file cấu hình, không có dòng nào trong <code>node_modules</code>:</p>
<pre><code>import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { slugify, canEdit } from '../src/slug.mjs';

describe('slugify', () =&gt; {
  test('viết thường và nối bằng gạch ngang', () =&gt; assert.equal(slugify('Hello World'), 'hello-world'));
  test('bỏ gạch thừa hai đầu', () =&gt; assert.equal(slugify('  --Hello--  '), 'hello'));
  test('cắt còn 60 ký tự', () =&gt; assert.equal(slugify('a'.repeat(200)).length, 60));
});</code></pre>
<div class="out">$ node --test 'nodetest/**/*.test.mjs'
# tests 6
# suites 2
# pass 6
# fail 0
# duration_ms 62.064542
real 0.10</div>
<p>Thêm <code>--test-reporter=dot</code> thì output rút gọn còn <code>........</code>. Node cũng có sẵn <code>--watch</code>, <code>--test-only</code>, <code>--test-name-pattern</code>, và từ Node 22 là độ phủ tích hợp qua <code>--experimental-test-coverage</code>.</p>

<div class="pitfall">
<p><strong>Bẫy — một thư mục trần không phải là glob.</strong> <code>node --test nodetest/</code> trông như phải chạy được, nhưng lại chết với <code>Error: Cannot find module '…/nodetest'</code> kèm <code>MODULE_NOT_FOUND</code>, vì tham số đó bị phân giải như một file cần thực thi. Hãy truyền glob có nháy: <code>node --test 'nodetest/**/*.test.mjs'</code>, hoặc không truyền gì cả và để Node tự đi tìm các file <code>*.test.*</code>.</p>
</div>

<h3>Chỗ jest lấy của bạn một ngày công</h3>
<p>Phép đo 1000 test ở trên chạy trên những file nguồn y hệt nhau ở cả hai bộ chạy. Đưa jest tới được vạch xuất phát đó mất một đoạn đường vòng mà vitest và node:test không có:</p>
<div class="out">$ npx jest
    /…/tests/service.test.mjs:1
    import { describe, it, expect, jest } from '@jest/globals';
    ^^^^^^
    SyntaxError: Cannot use import statement outside a module
Test Suites: 2 failed, 2 total
Tests:       0 total</div>
<p>Package đã khai <code>"type": "module"</code>, các file đều đuôi <code>.mjs</code>, vậy mà jest 30 vẫn cần một cờ:</p>
<div class="out">$ NODE_OPTIONS=--experimental-vm-modules npx jest
(node:10774) ExperimentalWarning: VM Modules is an experimental feature and might change at any time
Test Suites: 2 passed, 2 total
Tests:       12 passed, 12 total</div>
<p>Còn hai khoản thuế nhỏ nữa hiện ra trong lúc chuyển: <code>vi.fn</code> phải đổi thành <code>jest.fn</code>, và matcher <code>toHaveBeenCalledOnce()</code> của vitest không tồn tại trong jest — lần lượt cho ra <code>ReferenceError: vi is not defined</code> và lỗi thiếu matcher. Không có gì trong số này là khó. Nhưng tất cả đều là ma sát: bạn trả một lần cho mỗi dự án, rồi trả lại mỗi lần trình soạn thảo của một người trong nhóm gợi ý nhầm cái kia.</p>

<h3>Vậy chọn cái nào</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Backend Node thuần, JS hoặc TS chạy qua tsx</span><span class="v">node:test — 0 phụ thuộc, nhanh nhất ở bộ nhỏ, không bao giờ lỗi thời theo Vite</span></div>
  <div class="kv"><span class="k">Có front-end Vite / React trong cùng repo</span><span class="v">vitest — dùng chung transform, chung config, chung matcher với front-end</span></div>
  <div class="kv"><span class="k">Repo cũ đã có sẵn hàng nghìn test jest</span><span class="v">giữ jest — chi phí chuyển đổi không đổi lại được gì trong bảng số ở trên</span></div>
</div>
<p>Chương này viết ví dụ bằng vitest, vì API <code>expect</code> của nó là thứ đa số người đọc sẽ gặp trong phỏng vấn và trong các repo có sẵn, và vì thông báo lỗi của nó dễ đọc nhất trong lúc đang học. Mọi ví dụ đều chuyển sang <code>node:test</code> được một cách máy móc: <code>expect(x).toBe(y)</code> thành <code>assert.equal(x, y)</code>. Bài 14.2 sẽ chỉ ra đúng một chỗ mà hai bộ chạy này hành xử khác nhau thật sự.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Site này chạy bộ test có sẵn và không dùng gì khác. Trong <code>package.json</code>: <code>"test": "tsx --test src/services/finance/money.test.ts src/services/payment/vnpay.test.ts src/services/cv/cv.test.ts"</code> — ba file, 272 dòng, <strong>20 test trong 1297ms</strong>, không một gói framework test nào trong <code>devDependencies</code>. Khối chú thích đầu file <code>money.test.ts</code> nói thẳng ra quy tắc chọn lọc: "Hàm thuần — không DB, không mạng — nên chúng chạy nhanh và tất định trong CI." Thứ được chọn để test đúng là thứ sai thì đắt mà kiểm thì rẻ: số học tiền tệ an toàn thập phân (<code>0.1 + 0.2</code> phải bằng <code>0.3</code>, không phải <code>0.30000000000000004</code>), làm tròn HALF_UP, một bảng lịch trả nợ 12 tháng đã tính tay đối chiếu, và việc kiểm chữ ký VNPay. Không ai viết test cho chuyện "trang cá nhân hiển thị được".</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-325"><span class="lc-t">Code Lab · Testing, Deployment, and Production Readiness</span><span class="lc-d">Bài tập kiểm thử cho backend Node/Express</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/javascript${REF}#module-268"><span class="lc-t">Code Lab · JavaScript Patterns and Testing</span><span class="lc-d">Nền tảng viết test cho JavaScript</span></a>
</div>
</div>
`,
    },

    /* ─────────────────────────── 14.2 ─────────────────────────── */
    {
      title: '14.2 — Unit tests, test doubles, and tests that assert nothing|||14.2 — Test đơn vị, hàng giả, và những bài test không kiểm gì cả',
      slug: 'nodejs-14-2-unit-test',
      type: 'VIDEO',
      description: 'Viết test đầu tiên theo AAA, tiêm phụ thuộc để thay bằng repo giả, dùng đồng hồ giả để 20 phút trôi trong 4ms, và bốn kiểu test màu xanh mà không kiểm gì — đo xem bộ chạy nào bắt được kiểu nào.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.2</span>
<h2>Unit tests, test doubles, and tests that assert nothing</h2>
<p class="lead">A unit test is cheap because it touches nothing outside the function under test. That property is not something you switch on in the test file — it is something the <em>application</em> code either allows or forbids. This lesson writes the first tests for the Notes API, and along the way it changes the application to make them possible, because that is the honest order of events.</p>

<h3>The shape of a test</h3>
<p>Three parts, in this order, every time: arrange the inputs, act by calling the thing, assert on the result. The name of the test states the rule, not the mechanics:</p>
<pre><code>import { describe, it, expect } from 'vitest';
import { slugify } from '../src/slug.mjs';

describe('slugify', () =&gt; {
  it('lowercases and joins with dashes', () =&gt; {
    expect(slugify('Hello World')).toBe('hello-world');       // arrange + act + assert
  });
  it('drops leading and trailing separators', () =&gt; {
    expect(slugify('  --Hello--  ')).toBe('hello');
  });
  it('caps the length at 60', () =&gt; {
    expect(slugify('a'.repeat(200)).length).toBe(60);
  });
});</code></pre>
<p>Compare two names for the same test: <code>it('works')</code> and <code>it('caps the length at 60')</code>. When the second one goes red in CI six months from now, the failure report alone tells the next person what invariant broke. When the first one goes red, they have to read the body.</p>

<h3>Why the service could not be tested — and what changed</h3>
<p>The original Notes service imported its database module directly:</p>
<pre><code>import { db } from './db.mjs';                 // ← khoá chặt vào PostgreSQL
export async function create(actor, input) {
  const existing = await db.query('SELECT …');
  …
}</code></pre>
<p>Nothing about that is wrong at runtime, and everything about it is wrong for testing: to call <code>create()</code> at all you need a running PostgreSQL. Every test becomes an integration test, at 5,5ms instead of 0,0006ms, and you cannot easily simulate "the database threw".</p>
<p>The fix is one line of structure — pass the dependency in instead of importing it:</p>
<pre><code>export function createNotesService(repo) {
  return {
    async create(actor, input) {
      const slug = slugify(input.title);
      if (!slug) throw Object.assign(new Error('EMPTY_SLUG'), { status: 400 });
      const existing = await repo.findBySlug(slug);
      if (existing) throw Object.assign(new Error('SLUG_TAKEN'), { status: 409 });
      return repo.insert({ title: input.title, slug, body: input.body ?? '', authorId: actor.id });
    },
    …
  };
}</code></pre>
<p>Production wires it to <code>createNotesRepo(pool)</code>. Tests wire it to an object literal. Same service code, two speeds — and the ability to make the fake behave in ways a real database rarely does on demand.</p>

<h3>The five kinds of test double</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dummy</span><span class="v">purely to fill a parameter slot; never actually called</span></div>
  <div class="kv"><span class="k">Stub</span><span class="v">returns a canned value: <code>findBySlug: async () =&gt; null</code></span></div>
  <div class="kv"><span class="k">Spy</span><span class="v">calls through for real but records the call so you can inspect it later</span></div>
  <div class="kv"><span class="k">Mock</span><span class="v">a stub plus an expectation about how it must be called</span></div>
  <div class="kv"><span class="k">Fake</span><span class="v">a miniature but genuinely working implementation, such as a repository backed by a Map</span></div>
</div>
<p>In practice the distinction that matters is <em>state versus interaction</em>. Assert on the returned value when you can; assert on "was this called" only when the call itself <strong>is</strong> the behaviour — as in "a duplicate slug must not reach the database at all":</p>
<pre><code>function fakeRepo(overrides = {}) {
  return {
    findBySlug: vi.fn(async () =&gt; null),
    findById:   vi.fn(async () =&gt; null),
    insert:     vi.fn(async (n) =&gt; ({ id: 1, ...n })),
    update:     vi.fn(async (id, p) =&gt; ({ id, ...p })),
    listByAuthor: vi.fn(async () =&gt; []),
    ...overrides,
  };
}

it('rejects a duplicate slug with 409', async () =&gt; {
  const repo = fakeRepo({ findBySlug: vi.fn(async () =&gt; ({ id: 3 })) });
  const svc = createNotesService(repo);
  await expect(svc.create(actor, { title: 'Hello World' })).rejects.toMatchObject({ status: 409 });
  expect(repo.insert).not.toHaveBeenCalled();      // ← ĐÂY mới là hành vi cần khẳng định
});</code></pre>
<div class="out">$ npx vitest run
 Test Files  2 passed (2)
      Tests  12 passed (12)
   Duration  153ms (transform 41ms, import 62ms, tests 8ms)</div>
<p>Twelve tests, <strong>8ms of actual test time</strong>. The other 145ms is the runner starting up — which is the whole reason lesson 14.1 measured startup separately.</p>

<h3>The authorization test that is worth more than the rest</h3>
<p>Chapter 8 established that a note belonging to someone else must answer <code>404</code>, not <code>403</code> — a <code>403</code> confirms the resource exists. That rule is invisible: nothing crashes if it regresses, the app keeps working, and only an attacker notices. It is exactly the kind of rule a test should hold in place:</p>
<pre><code>it('404s (not 403) when the note belongs to someone else', async () =&gt; {
  const repo = fakeRepo({ findById: vi.fn(async () =&gt; ({ id: 5, authorId: 99 })) });
  const svc = createNotesService(repo);
  await expect(svc.update(actor, 5, { title: 'x' })).rejects.toMatchObject({ status: 404 });
  expect(repo.update).not.toHaveBeenCalled();
});</code></pre>

<h3>Time is a dependency too</h3>
<p>Sessions expire fifteen minutes after they are created, and a cleaner sweeps them every five minutes. Testing that honestly with real time takes twenty minutes. Fake timers make the clock an input you control:</p>
<pre><code>it('expires exactly at the 15 minute mark', () =&gt; {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-07-28T10:00:00Z'));
  const s = { createdAt: Date.now() };
  expect(isExpired(s)).toBe(false);
  vi.advanceTimersByTime(TTL_MS - 1);
  expect(isExpired(s)).toBe(false);        // 14:59.999 — vẫn còn sống
  vi.advanceTimersByTime(1);
  expect(isExpired(s)).toBe(true);         // 15:00.000 — hết hạn
});</code></pre>
<div class="out">$ npx vitest run tests/time.test.mjs        (2 test, mô phỏng 20 phút)
      Tests  2 passed (2)
   Duration  132ms (tests 4ms)

$ npx vitest run tests/time-real.test.mjs   (1 test, chờ THẬT 1,5 giây)
      Tests  1 passed (1)
   Duration  1.75s (tests 1.61s)</div>
<p>Twenty simulated minutes across two tests: <strong>4ms</strong>. A single real 1,5-second wait: <strong>1610ms</strong>, four hundred times more, for one third of the coverage. And the fake-timer test can assert the <em>boundary</em> — millisecond 899.999 versus 900.000 — which no real-time test can do reliably.</p>
<p>The enabling detail is in the application code, not the test: <code>isExpired(session, now = Date.now())</code> takes the clock as a defaulted parameter. Even without fake timers, that signature alone makes the boundary testable.</p>

<h3>Four tests that pass while checking nothing</h3>
<p>This is the failure mode nobody warns you about. Every one of these looks like a test, is counted as a test, turns the suite green, and verifies precisely nothing:</p>
<pre><code>async function chuyenTien() { throw new Error('SO_DU_KHONG_DU'); }
async function tinhTong() { return 5; }

it('1. quên await ở rejects', () =&gt; {
  expect(chuyenTien()).rejects.toThrow('THÔNG_ĐIỆP_HOÀN_TOÀN_SAI');   // thiếu await
});
it('2. quên await ở lời gọi async', () =&gt; {
  expect(tinhTong()).toBe(999);                                        // so Promise với số
});
it('3. assertion nằm trong callback không bao giờ chạy', () =&gt; {
  [].forEach(() =&gt; { expect(1).toBe(2); });
});
it('4. try/catch nuốt lỗi', async () =&gt; {
  try { expect(await tinhTong()).toBe(999); } catch { /* nuốt */ }
});</code></pre>
<p>Run under vitest 4.1.10:</p>
<div class="out">× 1. quên await ở rejects                              7ms
× 2. quên await ở lời gọi async                        1ms
✓ 3. assertion nằm trong callback không bao giờ chạy   0ms
✓ 4. try/catch nuốt lỗi                                0ms
 Tests  2 failed | 2 passed (4)</div>
<p>Vitest catches the two missing <code>await</code>s. It cannot catch the other two, because from its point of view nothing bad happened: no assertion ran, and no assertion failed.</p>
<p>The same four under <code>node:test</code>:</p>
<div class="out">ok 1 - 1. quên await ở rejects                 ← LỌT
not ok 2 - 2. quên await ở lời gọi async
ok 3 - 3. assertion trong callback không chạy  ← LỌT
not ok 4 - 4. plan() bắt được ca 3             ← bị bắt nhờ t.plan(1)
# pass 2  # fail 2</div>
<p>This is the one place the runners genuinely differ: <code>assert.rejects()</code> without <code>await</code> passes silently in <code>node:test</code>, while vitest flags it. In exchange, <code>node:test</code> ships <code>t.plan(n)</code>, which catches the never-run-callback case that vitest missed.</p>
<p>Vitest's equivalent is <code>expect.assertions(n)</code>:</p>
<div class="out">$ npx vitest run green/fix.test.mjs
Error: expected number of assertions to be 1, but got 0     ← bắt được ca 3
 Tests  1 failed | 1 passed (2)</div>
<div class="callout warn">
<p><strong>Read that second line honestly.</strong> <code>expect.assertions(1)</code> caught case 3 and <em>did not</em> catch case 4. In the swallowed-<code>catch</code> case the assertion really did run — it ran, it failed, and the <code>catch</code> ate the failure — so the counter reads 1 and the guard is satisfied. There is no runner flag that saves you from writing <code>catch {}</code> around your own assertion. The only defence is the habit in the next box.</p>
</div>

<div class="pitfall">
<p><strong>Pitfall — the only reliable proof that a test tests something.</strong> Break the production code on purpose and watch the test go red. If it stays green, the test is decoration. This takes ten seconds, it is the single highest-value habit in this chapter, and it is the reason the branch bug in lesson 14.5 survived a suite reporting 100% line coverage.</p>
</div>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> <code>src/services/cv/cv.test.ts</code> is the largest of the three test files (176 lines) and it never touches the database, because the CV bullet linter it guards is a pure function over text. That is what makes the interesting assertion possible: the CI step is named "fails the build if the CV bullet linter regresses — especially if it starts marking STRONG bullets WEAK", the exact false positive that would quietly ruin every user's CV review while nothing appeared broken. The same repo also has a fabrication test that feeds the AI reviewer a CV with no metrics in it and fails if the model invents a number — a test that <em>skips</em> (exit 0) when no AI key is present, so the suite stays runnable on a laptop.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/javascript${REF}#module-565"><span class="lc-t">Code Lab · Advanced Testing, CI/CD, and Deployment</span><span class="lc-d">Test doubles, mocks and organising a suite</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/typescript${REF}#module-571"><span class="lc-t">Code Lab · TypeScript Testing Strategies</span><span class="lc-d">Testing with static types — and testing the types themselves</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.2</span>
<h2>Test đơn vị, hàng giả, và những bài test không kiểm gì cả</h2>
<p class="lead">Test đơn vị rẻ vì nó không chạm vào bất cứ thứ gì bên ngoài hàm đang được kiểm. Tính chất đó không phải là thứ bạn bật lên trong file test — nó là thứ mà code <em>ứng dụng</em> hoặc cho phép, hoặc cấm. Bài này viết những bài test đầu tiên cho Notes API, và trên đường đi có sửa cả code ứng dụng để chúng viết được, bởi vì đó mới là trình tự trung thực của sự việc.</p>

<h3>Hình dạng của một bài test</h3>
<p>Ba phần, theo đúng thứ tự này, lần nào cũng vậy: chuẩn bị đầu vào, gọi thứ cần kiểm, khẳng định về kết quả. Tên bài test phát biểu <em>luật</em> chứ không mô tả thao tác:</p>
<pre><code>import { describe, it, expect } from 'vitest';
import { slugify } from '../src/slug.mjs';

describe('slugify', () =&gt; {
  it('viết thường và nối bằng gạch ngang', () =&gt; {
    expect(slugify('Hello World')).toBe('hello-world');       // chuẩn bị + gọi + khẳng định
  });
  it('bỏ dấu phân cách thừa ở hai đầu', () =&gt; {
    expect(slugify('  --Hello--  ')).toBe('hello');
  });
  it('cắt độ dài còn tối đa 60', () =&gt; {
    expect(slugify('a'.repeat(200)).length).toBe(60);
  });
});</code></pre>
<p>Hãy so hai cái tên cho cùng một bài test: <code>it('chạy được')</code> và <code>it('cắt độ dài còn tối đa 60')</code>. Khi cái thứ hai đỏ lên trong CI sáu tháng sau, chỉ riêng dòng báo lỗi đã nói cho người kế tiếp biết bất biến nào vừa vỡ. Khi cái thứ nhất đỏ lên, họ phải mở thân hàm ra đọc.</p>

<h3>Vì sao service không test được — và đã sửa gì</h3>
<p>Bản Notes service ban đầu import thẳng module cơ sở dữ liệu:</p>
<pre><code>import { db } from './db.mjs';                 // ← khoá chặt vào PostgreSQL
export async function create(actor, input) {
  const existing = await db.query('SELECT …');
  …
}</code></pre>
<p>Lúc chạy thật thì chẳng có gì sai, còn với việc kiểm thử thì sai toàn tập: để gọi được <code>create()</code> dù chỉ một lần, bạn phải có một PostgreSQL đang chạy. Mọi bài test đều trở thành test tích hợp, 5,5ms thay vì 0,0006ms, và bạn không có cách nào dễ dàng để mô phỏng tình huống "cơ sở dữ liệu ném lỗi".</p>
<p>Cách sửa chỉ là một thay đổi về cấu trúc — truyền phụ thuộc vào thay vì import nó:</p>
<pre><code>export function createNotesService(repo) {
  return {
    async create(actor, input) {
      const slug = slugify(input.title);
      if (!slug) throw Object.assign(new Error('EMPTY_SLUG'), { status: 400 });
      const existing = await repo.findBySlug(slug);
      if (existing) throw Object.assign(new Error('SLUG_TAKEN'), { status: 409 });
      return repo.insert({ title: input.title, slug, body: input.body ?? '', authorId: actor.id });
    },
    …
  };
}</code></pre>
<p>Production nối nó với <code>createNotesRepo(pool)</code>. Test nối nó với một object literal. Vẫn một đoạn code service, hai tốc độ — kèm khả năng bắt hàng giả cư xử theo những cách mà cơ sở dữ liệu thật hiếm khi chịu diễn theo yêu cầu.</p>

<h3>Năm loại hàng giả</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Dummy</span><span class="v">chỉ để lấp chỗ trống trong tham số, không bao giờ bị gọi</span></div>
  <div class="kv"><span class="k">Stub</span><span class="v">trả về giá trị định sẵn: <code>findBySlug: async () =&gt; null</code></span></div>
  <div class="kv"><span class="k">Spy</span><span class="v">vẫn gọi thật nhưng ghi lại lời gọi để kiểm về sau</span></div>
  <div class="kv"><span class="k">Mock</span><span class="v">stub cộng thêm kỳ vọng về việc nó phải được gọi ra sao</span></div>
  <div class="kv"><span class="k">Fake</span><span class="v">bản cài đặt thu nhỏ nhưng chạy thật, ví dụ repo lưu bằng Map</span></div>
</div>
<p>Trong thực tế, ranh giới đáng quan tâm là <em>trạng thái so với tương tác</em>. Khẳng định trên giá trị trả về khi còn khẳng định được; chỉ khẳng định "cái này có bị gọi không" khi bản thân lời gọi <strong>chính là</strong> hành vi cần kiểm — như trong "slug trùng thì tuyệt đối không được chạm tới cơ sở dữ liệu":</p>
<pre><code>function fakeRepo(overrides = {}) {
  return {
    findBySlug: vi.fn(async () =&gt; null),
    findById:   vi.fn(async () =&gt; null),
    insert:     vi.fn(async (n) =&gt; ({ id: 1, ...n })),
    update:     vi.fn(async (id, p) =&gt; ({ id, ...p })),
    listByAuthor: vi.fn(async () =&gt; []),
    ...overrides,
  };
}

it('slug trùng thì trả 409', async () =&gt; {
  const repo = fakeRepo({ findBySlug: vi.fn(async () =&gt; ({ id: 3 })) });
  const svc = createNotesService(repo);
  await expect(svc.create(actor, { title: 'Hello World' })).rejects.toMatchObject({ status: 409 });
  expect(repo.insert).not.toHaveBeenCalled();      // ← ĐÂY mới là hành vi cần khẳng định
});</code></pre>
<div class="out">$ npx vitest run
 Test Files  2 passed (2)
      Tests  12 passed (12)
   Duration  153ms (transform 41ms, import 62ms, tests 8ms)</div>
<p>Mười hai bài test, <strong>8ms thời gian chạy test thật sự</strong>. 145ms còn lại là bộ chạy khởi động — và đó chính là lý do bài 14.1 tách riêng phần khởi động ra để đo.</p>

<h3>Bài test phân quyền đáng giá hơn tất cả những bài còn lại</h3>
<p>Chương 8 đã chốt rằng một ghi chú của người khác phải trả <code>404</code>, không phải <code>403</code> — vì <code>403</code> là lời xác nhận rằng tài nguyên đó có tồn tại. Luật này vô hình: nếu nó bị phá thì chẳng có gì sập, ứng dụng vẫn chạy bình thường, chỉ kẻ tấn công là nhận ra. Đó đúng là loại luật cần một bài test giữ chỗ:</p>
<pre><code>it('trả 404 (KHÔNG phải 403) khi ghi chú thuộc về người khác', async () =&gt; {
  const repo = fakeRepo({ findById: vi.fn(async () =&gt; ({ id: 5, authorId: 99 })) });
  const svc = createNotesService(repo);
  await expect(svc.update(actor, 5, { title: 'x' })).rejects.toMatchObject({ status: 404 });
  expect(repo.update).not.toHaveBeenCalled();
});</code></pre>

<h3>Thời gian cũng là một phụ thuộc</h3>
<p>Phiên hết hạn mười lăm phút sau khi tạo, và một bộ dọn quét mỗi năm phút. Kiểm chuyện đó một cách trung thực bằng thời gian thật thì mất hai mươi phút. Đồng hồ giả biến thời gian thành một đầu vào do bạn điều khiển:</p>
<pre><code>it('hết hạn đúng vào mốc 15 phút', () =&gt; {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-07-28T10:00:00Z'));
  const s = { createdAt: Date.now() };
  expect(isExpired(s)).toBe(false);
  vi.advanceTimersByTime(TTL_MS - 1);
  expect(isExpired(s)).toBe(false);        // 14:59.999 — vẫn còn sống
  vi.advanceTimersByTime(1);
  expect(isExpired(s)).toBe(true);         // 15:00.000 — hết hạn
});</code></pre>
<div class="out">$ npx vitest run tests/time.test.mjs        (2 test, mô phỏng 20 phút)
      Tests  2 passed (2)
   Duration  132ms (tests 4ms)

$ npx vitest run tests/time-real.test.mjs   (1 test, chờ THẬT 1,5 giây)
      Tests  1 passed (1)
   Duration  1.75s (tests 1.61s)</div>
<p>Hai mươi phút mô phỏng trải trên hai bài test: <strong>4ms</strong>. Một lần chờ thật 1,5 giây: <strong>1610ms</strong>, gấp bốn trăm lần, để đổi lấy một phần ba số thứ được kiểm. Và bài test dùng đồng hồ giả còn khẳng định được <em>ngay tại mốc biên</em> — mili-giây 899.999 so với 900.000 — điều mà không bài test dùng thời gian thật nào làm nổi một cách ổn định.</p>
<p>Chi tiết khiến chuyện này khả thi nằm trong code ứng dụng chứ không nằm trong test: <code>isExpired(session, now = Date.now())</code> nhận đồng hồ như một tham số có giá trị mặc định. Ngay cả khi không dùng đồng hồ giả, riêng chữ ký hàm đó đã làm cho mốc biên trở nên kiểm được.</p>

<h3>Bốn bài test màu xanh mà chẳng kiểm gì</h3>
<p>Đây là kiểu hỏng mà không ai cảnh báo bạn. Từng cái một trong số này đều trông như một bài test, đều được đếm là một bài test, đều làm bộ test xanh lè, và đều xác minh đúng bằng không:</p>
<pre><code>async function chuyenTien() { throw new Error('SO_DU_KHONG_DU'); }
async function tinhTong() { return 5; }

it('1. quên await ở rejects', () =&gt; {
  expect(chuyenTien()).rejects.toThrow('THÔNG_ĐIỆP_HOÀN_TOÀN_SAI');   // thiếu await
});
it('2. quên await ở lời gọi async', () =&gt; {
  expect(tinhTong()).toBe(999);                                        // so Promise với số
});
it('3. assertion nằm trong callback không bao giờ chạy', () =&gt; {
  [].forEach(() =&gt; { expect(1).toBe(2); });
});
it('4. try/catch nuốt lỗi', async () =&gt; {
  try { expect(await tinhTong()).toBe(999); } catch { /* nuốt */ }
});</code></pre>
<p>Chạy dưới vitest 4.1.10:</p>
<div class="out">× 1. quên await ở rejects                              7ms
× 2. quên await ở lời gọi async                        1ms
✓ 3. assertion nằm trong callback không bao giờ chạy   0ms
✓ 4. try/catch nuốt lỗi                                0ms
 Tests  2 failed | 2 passed (4)</div>
<p>Vitest bắt được hai chỗ thiếu <code>await</code>. Nó không bắt được hai chỗ còn lại, vì đứng từ góc nhìn của nó thì chẳng có chuyện gì xấu xảy ra cả: không có khẳng định nào chạy, và cũng không có khẳng định nào hỏng.</p>
<p>Cũng bốn ca đó dưới <code>node:test</code>:</p>
<div class="out">ok 1 - 1. quên await ở rejects                 ← LỌT
not ok 2 - 2. quên await ở lời gọi async
ok 3 - 3. assertion trong callback không chạy  ← LỌT
not ok 4 - 4. plan() bắt được ca 3             ← bị bắt nhờ t.plan(1)
# pass 2  # fail 2</div>
<p>Đây là đúng một chỗ mà hai bộ chạy khác nhau thật sự: <code>assert.rejects()</code> mà thiếu <code>await</code> thì lọt lưới im lặng trong <code>node:test</code>, còn vitest thì tuýt còi. Đổi lại, <code>node:test</code> có sẵn <code>t.plan(n)</code>, thứ bắt được ca callback không bao giờ chạy mà vitest để lọt.</p>
<p>Bên vitest, thứ tương đương là <code>expect.assertions(n)</code>:</p>
<div class="out">$ npx vitest run green/fix.test.mjs
Error: expected number of assertions to be 1, but got 0     ← bắt được ca 3
 Tests  1 failed | 1 passed (2)</div>
<div class="callout warn">
<p><strong>Hãy đọc dòng thứ hai đó một cách trung thực.</strong> <code>expect.assertions(1)</code> bắt được ca 3 và <em>không</em> bắt được ca 4. Trong ca <code>catch</code> nuốt lỗi thì khẳng định thật sự có chạy — nó chạy, nó hỏng, và khối <code>catch</code> đã nuốt mất cái hỏng ấy — nên bộ đếm đọc ra 1 và chốt chặn coi như đã thoả. Không có cờ nào của bộ chạy cứu được bạn khỏi việc tự tay viết <code>catch {}</code> bọc quanh khẳng định của chính mình. Phòng tuyến duy nhất là thói quen trong khung dưới đây.</p>
</div>

<div class="pitfall">
<p><strong>Bẫy — bằng chứng đáng tin duy nhất rằng một bài test có kiểm thật.</strong> Cố tình phá code production rồi xem bài test có đỏ lên không. Nếu nó vẫn xanh thì bài test đó chỉ là đồ trang trí. Việc này mất mười giây, là thói quen có giá trị cao nhất trong cả chương này, và chính nó là lý do lỗi ở nhánh trong bài 14.5 sống sót qua một bộ test báo cáo độ phủ dòng 100%.</p>
</div>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> <code>src/services/cv/cv.test.ts</code> là file lớn nhất trong ba file test (176 dòng) và nó không hề chạm vào cơ sở dữ liệu, vì bộ soát gạch đầu dòng CV mà nó canh giữ là một hàm thuần trên văn bản. Chính điều đó làm cho khẳng định thú vị nhất trở nên khả thi: bước CI được đặt tên là "làm hỏng build nếu bộ soát gạch đầu dòng CV bị thoái hoá — đặc biệt là nếu nó bắt đầu chấm các gạch đầu dòng MẠNH thành YẾU", đúng cái dương tính giả sẽ âm thầm phá hỏng phần nhận xét CV của mọi người dùng trong khi ngoài mặt chẳng có gì trông có vẻ hỏng. Cũng repo đó còn có một bài test chống bịa đặt: đưa cho bộ nhận xét AI một bản CV không có con số nào và bắt lỗi nếu mô hình tự nghĩ ra một con số — bài test này <em>tự bỏ qua</em> (thoát 0) khi không có khoá AI, để bộ test vẫn chạy được trên máy cá nhân.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/javascript${REF}#module-565"><span class="lc-t">Code Lab · Advanced Testing, CI/CD, and Deployment</span><span class="lc-d">Test double, mock và cách tổ chức bộ test</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/typescript${REF}#module-571"><span class="lc-t">Code Lab · TypeScript Testing Strategies</span><span class="lc-d">Kiểm thử khi đã có kiểu tĩnh — và kiểm chính cái kiểu</span></a>
</div>
</div>
`,
    },

    /* ─────────────────────────── 14.3 ─────────────────────────── */
    {
      title: '14.3 — Testing the HTTP layer with supertest|||14.3 — Kiểm tầng HTTP bằng supertest',
      slug: 'nodejs-14-3-supertest',
      type: 'VIDEO',
      description: 'Tách app ra khỏi listen, gửi request thật vào Express mà không mở cổng, khẳng định trên mã trạng thái như một hợp đồng, và bài test hồi quy cho đúng lỗ IDOR đã sửa thật trên site này.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.3</span>
<h2>Testing the HTTP layer with supertest</h2>
<p class="lead">Chapter 6 spent a whole lesson arguing that status codes are a contract: 401 versus 403 versus 404 versus 422 each mean something specific to the client. A contract nobody re-checks is a comment. This lesson makes the contract executable — the request goes through the real router, the real <code>express.json()</code>, the real zod schema and the real error handler, and only stops short of a real TCP port.</p>

<h3>One structural change: the app factory</h3>
<p>A file that calls <code>app.listen()</code> at import time cannot be imported by a test — importing it starts a server. Split the two:</p>
<pre><code>// src/app.mjs — chỉ LẮP RÁP, không nghe cổng
export function createApp({ service, auth }) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) =&gt; { req.user = auth(req); next(); });
  app.post('/notes', …);
  app.patch('/notes/:id', …);
  app.use((err, req, res, _next) =&gt; res.status(err.status ?? 500).json({ error: err.message }));
  return app;
}

// src/server.mjs — chỉ file NÀY được gọi listen
import { createApp } from './app.mjs';
createApp({ service: realService, auth: jwtAuth }).listen(3000);</code></pre>
<p>The factory also takes its dependencies as arguments, which is what lets one test file run the whole app against a fake service and another run it against a real database — without a single environment variable.</p>

<h3>The first HTTP test</h3>
<pre><code>import request from 'supertest';
import { createApp, headerAuth } from '../src/app.mjs';

it('401 without a user', async () =&gt; {
  const res = await request(app).post('/notes').send({ title: 'Hi' });
  expect(res.status).toBe(401);
});</code></pre>
<p><code>request(app)</code> takes the Express app <em>object</em>, not a URL. Supertest binds it to an ephemeral port on <code>127.0.0.1</code>, sends a genuine HTTP request over the loopback, and closes it again. No <code>listen()</code> in your test, no port to pick, no leaked server between test files.</p>

<h3>The contract, spelled out as assertions</h3>
<p>Six tests, each one pinning a rule that chapters 6, 8 and 9 established:</p>
<pre><code>it('422 with the failing field named', async () =&gt; {
  const res = await request(app).post('/notes').set('x-user-id', '7').send({ title: '' });
  expect(res.status).toBe(422);
  expect(res.body.fields[0].path).toBe('title');       // hình dạng lỗi cũng là hợp đồng
});

it('201 and persists the row', async () =&gt; {
  const res = await request(app).post('/notes').set('x-user-id', '7').send({ title: 'Ghi chu dau tien' });
  expect(res.status).toBe(201);
  expect(res.body.slug).toBe('ghi-chu-dau-tien');
  const { rows } = await client.query('SELECT count(*)::int c FROM notes WHERE author_id = 7');
  expect(rows[0].c).toBe(1);                            // ← khẳng định cả ở PHÍA CƠ SỞ DỮ LIỆU
});

it('409 on a duplicate slug', async () =&gt; {
  const send = () =&gt; request(app).post('/notes').set('x-user-id', '7').send({ title: 'Trung slug' });
  expect((await send()).status).toBe(201);
  expect((await send()).status).toBe(409);
});</code></pre>
<div class="out">$ npx vitest run tests/http.int.test.mjs
 Test Files  1 passed (1)
      Tests  6 passed (6)
   Duration  455ms (transform 37ms, import 222ms, tests 117ms)</div>
<p>Six HTTP round trips plus real SQL: <strong>117ms</strong>, about 20ms each. Twelve unit tests in lesson 14.2 cost 8ms total. That ratio is the whole reason not to write every test at this level — and the reason to write <em>some</em> of them here, because none of the twelve unit tests would have noticed if <code>express.json()</code> were missing, if the error handler were registered before the routes, or if the route were mounted at <code>/note</code>.</p>

<h3>The test that pays for the whole file</h3>
<p>This one is a regression test for a real vulnerability that shipped on this site:</p>
<pre><code>it('404 when another user owns the note', async () =&gt; {
  const created = await request(app).post('/notes').set('x-user-id', '7').send({ title: 'Cua an' });
  const res = await request(app).patch(\`/notes/\${created.body.id}\`).set('x-user-id', '8').send({ title: 'hack' });
  expect(res.status).toBe(404);
  const { rows } = await client.query('SELECT title FROM notes WHERE id = $1', [created.body.id]);
  expect(rows[0].title).toBe('Cua an');                 // ← và dữ liệu KHÔNG bị đổi
});</code></pre>
<p>Note the second assertion. Checking only the status code would let a future refactor return 404 <em>and still perform the update</em>. The test asserts on the effect, not just on the answer.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it — the bug this test would have caught.</strong> While writing chapter 11 of this very course, a real IDOR turned up in the messaging socket and was fixed in commit <code>a8e998e</code>. The old handler was one line: <code>socket.on('thread:join', (threadId) =&gt; { if (typeof threadId === 'number') socket.join(\`thread:\${threadId}\`); })</code>. Authentication ran <strong>once</strong>, at the handshake — so any logged-in user could emit <code>thread:join</code> with someone else's conversation id (they are sequential integers) and from then on receive that conversation's <code>thread:new-message</code> events: the message bodies, live, with no REST call to audit afterwards. The fix re-checks participation on every event using the same rule as <code>MessagesService.assertParticipant</code>, fails <em>closed</em> if the database errors, and emits <code>thread:join-denied</code>. The transferable lesson is in the commit message: <em>authentication once, authorization every time</em>. A single test — "user B joins user A's thread and must be denied" — is the difference between finding that in a course draft and finding it in a breach report.</p>
</div>

<h3>What this level cannot test, and the trap it sets</h3>
<div class="pitfall">
<p><strong>Pitfall — mocking the service in a route test tests the router and nothing else.</strong> It is tempting to write <code>createApp({ service: fakeService })</code> for every HTTP test, because it is fast and needs no database. Do it and the 409 test above proves only that "when the service throws an object with status 409, Express answers 409" — which is a fact about Express, not about your application. The rules you actually care about (duplicate slugs, ownership, validation) live below the route. Wire the real service to a real database for the tests that assert rules; wire a fake one only for the cases you cannot produce otherwise, such as "the database is down and the route must answer 503".</p>
</div>

<h3>The cost detail from lesson 14.1, explained</h3>
<p>The pyramid measurement showed supertest at 5,5ms per request and a long-lived server at 3,3ms. Supertest is not slow — it is doing more work:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">supertest</span><span class="lz-d">every time <code>request(app)</code>: create the server → <code>listen(0)</code> → send → close the server. Perfectly safe with no leaked ports, at the price of a full server lifecycle per request</span></div>
  <div class="lz-step"><span class="lz-t">a long-lived server</span><span class="lz-d">once <code>listen()</code> trong <code>beforeAll</code>, closed in <code>afterAll</code>; every request reuses it. Faster, but closing it is your responsibility</span></div>
</div>
<p>At six tests per file the difference is two milliseconds and not worth a line of code. At six hundred it is 1,3 seconds per file. Measure before optimising; the shape of your suite decides which side of that line you are on.</p>

<div class="callout ok">
<p><strong>Two habits that keep this level cheap.</strong> First, <code>await</code> every supertest call — it is a thenable, and an un-awaited one produces exactly the silent green test from lesson 14.2. Second, never assert on the whole response body with <code>toEqual</code>: an object comparison that includes <code>id</code>, <code>createdAt</code> and every column will go red on the next migration for reasons that have nothing to do with the rule being tested. Assert on the fields the contract actually promises.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-619"><span class="lc-t">Code Lab · API Versioning, Documentation, and Contract Testing</span><span class="lc-d">Testing the API contract, not just the code</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/socket-io${REF}#module-946"><span class="lc-t">Code Lab · Testing &amp; Debugging Realtime</span><span class="lc-d">Testing authorisation per socket event — exactly the error class in the frame above</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.3</span>
<h2>Kiểm tầng HTTP bằng supertest</h2>
<p class="lead">Chương 6 đã dành hẳn một bài để lập luận rằng mã trạng thái là một bản hợp đồng: 401, 403, 404, 422 — mỗi cái mang một nghĩa cụ thể với phía client. Một bản hợp đồng không ai kiểm lại thì chỉ là một dòng chú thích. Bài này biến hợp đồng đó thành thứ chạy được — request đi qua router thật, qua <code>express.json()</code> thật, qua lược đồ zod thật và bộ xử lý lỗi thật, chỉ dừng lại trước đúng một thứ: một cổng TCP thật.</p>

<h3>Một thay đổi về cấu trúc: nhà máy tạo app</h3>
<p>Một file gọi <code>app.listen()</code> ngay lúc import thì không thể được test import — vì import nó là khởi động luôn server. Hãy tách đôi:</p>
<pre><code>// src/app.mjs — chỉ LẮP RÁP, không nghe cổng
export function createApp({ service, auth }) {
  const app = express();
  app.use(express.json());
  app.use((req, res, next) =&gt; { req.user = auth(req); next(); });
  app.post('/notes', …);
  app.patch('/notes/:id', …);
  app.use((err, req, res, _next) =&gt; res.status(err.status ?? 500).json({ error: err.message }));
  return app;
}

// src/server.mjs — chỉ file NÀY được phép gọi listen
import { createApp } from './app.mjs';
createApp({ service: realService, auth: jwtAuth }).listen(3000);</code></pre>
<p>Nhà máy này cũng nhận các phụ thuộc qua tham số, và chính điều đó cho phép một file test chạy cả ứng dụng trên một service giả còn file test khác chạy nó trên cơ sở dữ liệu thật — mà không cần một biến môi trường nào.</p>

<h3>Bài test HTTP đầu tiên</h3>
<pre><code>import request from 'supertest';
import { createApp, headerAuth } from '../src/app.mjs';

it('trả 401 khi không có người dùng', async () =&gt; {
  const res = await request(app).post('/notes').send({ title: 'Hi' });
  expect(res.status).toBe(401);
});</code></pre>
<p><code>request(app)</code> nhận vào <em>đối tượng</em> Express app chứ không phải một URL. Supertest gắn nó vào một cổng tạm trên <code>127.0.0.1</code>, gửi một request HTTP thật qua loopback, rồi đóng lại. Không có <code>listen()</code> nào trong test của bạn, không phải chọn cổng, không rò server giữa các file test.</p>

<h3>Bản hợp đồng, viết ra thành các khẳng định</h3>
<p>Sáu bài test, mỗi bài ghim một luật mà chương 6, 8 và 9 đã chốt:</p>
<pre><code>it('trả 422 và gọi tên trường bị sai', async () =&gt; {
  const res = await request(app).post('/notes').set('x-user-id', '7').send({ title: '' });
  expect(res.status).toBe(422);
  expect(res.body.fields[0].path).toBe('title');       // hình dạng lỗi cũng là hợp đồng
});

it('trả 201 và ghi được vào bảng', async () =&gt; {
  const res = await request(app).post('/notes').set('x-user-id', '7').send({ title: 'Ghi chu dau tien' });
  expect(res.status).toBe(201);
  expect(res.body.slug).toBe('ghi-chu-dau-tien');
  const { rows } = await client.query('SELECT count(*)::int c FROM notes WHERE author_id = 7');
  expect(rows[0].c).toBe(1);                            // ← khẳng định cả ở PHÍA CƠ SỞ DỮ LIỆU
});

it('trả 409 khi slug trùng', async () =&gt; {
  const send = () =&gt; request(app).post('/notes').set('x-user-id', '7').send({ title: 'Trung slug' });
  expect((await send()).status).toBe(201);
  expect((await send()).status).toBe(409);
});</code></pre>
<div class="out">$ npx vitest run tests/http.int.test.mjs
 Test Files  1 passed (1)
      Tests  6 passed (6)
   Duration  455ms (transform 37ms, import 222ms, tests 117ms)</div>
<p>Sáu vòng HTTP kèm SQL thật: <strong>117ms</strong>, khoảng 20ms mỗi bài. Mười hai bài test đơn vị ở bài 14.2 tốn tổng cộng 8ms. Chính tỉ lệ đó là lý do đừng viết mọi bài test ở tầng này — và cũng là lý do phải viết <em>một số</em> bài ở đây, bởi không một bài nào trong mười hai bài kia nhận ra được nếu thiếu <code>express.json()</code>, nếu bộ xử lý lỗi bị đăng ký trước các route, hay nếu route bị gắn nhầm vào <code>/note</code>.</p>

<h3>Bài test trả đủ tiền cho cả file</h3>
<p>Bài này là test hồi quy cho một lỗ hổng có thật đã từng lên production của site này:</p>
<pre><code>it('trả 404 khi ghi chú thuộc về người khác', async () =&gt; {
  const created = await request(app).post('/notes').set('x-user-id', '7').send({ title: 'Cua an' });
  const res = await request(app).patch(\`/notes/\${created.body.id}\`).set('x-user-id', '8').send({ title: 'hack' });
  expect(res.status).toBe(404);
  const { rows } = await client.query('SELECT title FROM notes WHERE id = $1', [created.body.id]);
  expect(rows[0].title).toBe('Cua an');                 // ← và dữ liệu KHÔNG bị sửa
});</code></pre>
<p>Hãy để ý khẳng định thứ hai. Nếu chỉ kiểm mã trạng thái thì một lần tái cấu trúc trong tương lai vẫn có thể trả 404 <em>mà vẫn thực hiện phép cập nhật</em>. Bài test này khẳng định trên hệ quả, chứ không chỉ trên câu trả lời.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào — đúng con bug mà bài test này bắt được.</strong> Trong lúc soạn chương 11 của chính khoá học này, một lỗ IDOR thật lộ ra ở socket tin nhắn và đã được vá ở commit <code>a8e998e</code>. Hàm xử lý cũ chỉ có một dòng: <code>socket.on('thread:join', (threadId) =&gt; { if (typeof threadId === 'number') socket.join(\`thread:\${threadId}\`); })</code>. Việc xác thực chạy <strong>đúng một lần</strong>, lúc bắt tay — nên bất kỳ người dùng đã đăng nhập nào cũng có thể emit <code>thread:join</code> với id cuộc trò chuyện của người khác (id là số nguyên tuần tự) và từ đó nhận toàn bộ sự kiện <code>thread:new-message</code> của cuộc trò chuyện ấy: nguyên nội dung tin nhắn, trực tiếp, không để lại một lời gọi REST nào để về sau còn truy vết. Bản vá kiểm lại tư cách người trong cuộc ở <em>từng</em> sự kiện theo đúng luật của <code>MessagesService.assertParticipant</code>, chọn <em>đóng</em> khi cơ sở dữ liệu lỗi, và emit <code>thread:join-denied</code>. Bài học mang đi được nằm ngay trong lời commit: <em>xác thực một lần, phân quyền mọi lần</em>. Chỉ một bài test — "người dùng B vào phòng của người dùng A và phải bị từ chối" — là ranh giới giữa việc phát hiện chuyện đó trong một bản nháp giáo trình và phát hiện nó trong một báo cáo rò rỉ dữ liệu.</p>
</div>

<h3>Thứ tầng này không kiểm được, và cái bẫy nó giăng ra</h3>
<div class="pitfall">
<p><strong>Bẫy — mock service trong test route thì chỉ đang kiểm cái router chứ không kiểm gì khác.</strong> Rất dễ bị cám dỗ viết <code>createApp({ service: fakeService })</code> cho mọi bài test HTTP, vì nó nhanh và không cần cơ sở dữ liệu. Làm vậy thì bài test 409 ở trên chỉ chứng minh được rằng "khi service ném ra một object có status 409 thì Express trả về 409" — đó là một sự thật về Express, không phải về ứng dụng của bạn. Những luật bạn thật sự quan tâm (slug trùng, quyền sở hữu, kiểm dữ liệu vào) nằm ở dưới route. Hãy nối service thật với cơ sở dữ liệu thật cho các bài test khẳng định luật; chỉ nối hàng giả cho những tình huống không tạo ra được bằng cách khác, ví dụ "cơ sở dữ liệu chết và route phải trả 503".</p>
</div>

<h3>Chi tiết về giá đã nói ở bài 14.1, nay giải thích</h3>
<p>Phép đo kim tự tháp cho thấy supertest tốn 5,5ms mỗi request còn server thường trú tốn 3,3ms. Supertest không chậm — nó đang làm nhiều việc hơn:</p>
<div class="lz-flow">
  <div class="lz-step"><span class="lz-t">supertest</span><span class="lz-d">mỗi lần <code>request(app)</code>: tạo server → <code>listen(0)</code> → gửi → đóng server. An toàn tuyệt đối, không rò cổng, nhưng trả giá bằng cả một vòng đời server cho từng request</span></div>
  <div class="lz-step"><span class="lz-t">server thường trú</span><span class="lz-d">gọi <code>listen()</code> một lần trong <code>beforeAll</code>, đóng ở <code>afterAll</code>; mọi request dùng lại. Nhanh hơn, nhưng bạn tự chịu trách nhiệm đóng nó</span></div>
</div>
<p>Ở mức sáu bài test mỗi file thì khác biệt là hai mili-giây, không đáng đổi lấy một dòng code. Ở mức sáu trăm bài thì đó là 1,3 giây cho mỗi file. Hãy đo trước rồi hãy tối ưu; hình dạng bộ test của bạn quyết định bạn nằm ở phía nào của cái ranh đó.</p>

<div class="callout ok">
<p><strong>Hai thói quen giữ cho tầng này rẻ.</strong> Thứ nhất, <code>await</code> mọi lời gọi supertest — nó là một thenable, và một lời gọi quên await sẽ cho ra đúng cái bài test xanh im lặng ở bài 14.2. Thứ hai, đừng bao giờ khẳng định trên nguyên cả thân phản hồi bằng <code>toEqual</code>: một phép so object bao gồm <code>id</code>, <code>createdAt</code> và mọi cột sẽ đỏ lên ở lần migration kế tiếp vì những lý do chẳng liên quan gì tới cái luật đang được kiểm. Hãy khẳng định trên đúng những trường mà hợp đồng có hứa.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-619"><span class="lc-t">Code Lab · API Versioning, Documentation, and Contract Testing</span><span class="lc-d">Kiểm hợp đồng API, không chỉ kiểm code</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/socket-io${REF}#module-946"><span class="lc-t">Code Lab · Testing &amp; Debugging Realtime</span><span class="lc-d">Kiểm phân quyền theo từng sự kiện socket — đúng lớp lỗi ở khung trên</span></a>
</div>
</div>
`,
    },

    /* ─────────────────────────── 14.4 ─────────────────────────── */
    {
      title: '14.4 — Testing against a real database|||14.4 — Kiểm thử trên cơ sở dữ liệu thật',
      slug: 'nodejs-14-4-db-that',
      type: 'VIDEO',
      description: 'Repo giả trả 5 lần 201 trong khi bảng thật chỉ nhận 1 và ném 23505 bốn lần — cùng ba cách cô lập test (transaction, TRUNCATE, schema riêng) và giá thật của một container Postgres dùng một lần.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.4</span>
<h2>Testing against a real database</h2>
<p class="lead">A fake repository answers whatever you told it to answer. That is its value in a unit test and its danger everywhere else, because a real table has opinions your fake does not: unique constraints, column widths, foreign keys, isolation levels, and a clock that keeps running while your code is between two statements. This lesson measures the gap.</p>

<h3>The measurement that settles the argument</h3>
<p>The Notes service checks for a duplicate slug and then inserts — the classic check-then-act. Five concurrent creates of the same title, first against the fake repo the unit tests use, then against the real table:</p>
<div class="out">[repo giả]  5 request song song -> 201 201 201 201 201
[DB thật]   5 kết nối MỞ SẴN    ->
  LỖI  status=(KHÔNG CÓ -> 500) code=23505 | duplicate key value violates unique constraint "notes_slug_key"
  LỖI  status=(KHÔNG CÓ -> 500) code=23505 | duplicate key value violates unique constraint "notes_slug_key"
  OK   id=1
  LỖI  status=(KHÔNG CÓ -> 500) code=23505 | duplicate key value violates unique constraint "notes_slug_key"
  LỖI  status=(KHÔNG CÓ -> 500) code=23505 | duplicate key value violates unique constraint "notes_slug_key"
  số dòng = 1</div>
<p>The unit suite is green. In production the same code answers <code>500</code> four times out of five, because the thrown error carries a PostgreSQL <code>code</code> but no <code>status</code>, so the error handler falls through to its default. The user sees "Internal Server Error" for something that is plainly a <code>409</code>.</p>
<p>The fix belongs in the repository, where the driver's vocabulary is already in scope:</p>
<pre><code>async insert(n) {
  try {
    const r = await db.query('INSERT INTO notes (title, slug, body, author_id) VALUES ($1,$2,$3,$4) RETURNING *', […]);
    return r.rows[0];
  } catch (e) {
    if (e.code === '23505') throw Object.assign(new Error('SLUG_TAKEN'), { status: 409 });
    throw e;
  }
}</code></pre>
<p>The pre-check stays — it makes the common case one round trip cheaper and produces a better message — but the constraint is what actually enforces uniqueness. <strong>Validation in application code is a courtesy; the constraint is the rule.</strong></p>

<div class="pitfall">
<p><strong>Pitfall in the measurement itself.</strong> The first two attempts to reproduce this race <em>failed</em> — five parallel requests produced <code>201 409 409 409 409</code>, the correct answer, and the bug looked imaginary. The reason: <code>pg.Pool</code> opens connections lazily, and the TCP + authentication handshake for connections 2 to 5 took longer than the first request's whole check-then-act, so they were serialised by accident. The race only appears once five connections are <strong>opened and warmed</strong> first. Any concurrency bug you cannot reproduce may be hiding behind a warm-up cost like this — and it is precisely why the same code behaves differently under production load than on your laptop.</p>
</div>

<h3>What else a fake will never tell you</h3>
<div class="out">code = 23505 | constraint = notes_slug_key | duplicate key value violates unique constraint
code = 22001 | value too long for type character varying(200)</div>
<p><code>22001</code> is the one that bites in production: zod caps <code>title</code> at 200 characters, the column is <code>varchar(200)</code>, and the two agree — until someone widens the zod schema to 500 and forgets the migration. No unit test can notice, because the fake accepts any string. An integration test notices immediately.</p>

<h3>Isolation: three ways, measured</h3>
<p>Tests that share a table interfere with each other. The three real options:</p>

<h4>1. Transaction and rollback — the fastest correct answer</h4>
<pre><code>beforeAll(async () =&gt; { pool = new pg.Pool({ connectionString: URL, max: 4 }); client = await pool.connect(); });
afterAll(async () =&gt; { client.release(); await pool.end(); });

beforeEach(async () =&gt; {
  await client.query('BEGIN');
  app = createApp({ service: createNotesService(createNotesRepo(client)), auth: headerAuth });
});
afterEach(async () =&gt; { await client.query('ROLLBACK'); });</code></pre>
<p>The critical detail is that the app is built <strong>around the same client</strong> that holds the transaction — not around the pool. Hand the pool to the app and its queries run on a different connection, outside your transaction, and the rollback cleans up nothing. Cost: one <code>BEGIN</code> and one <code>ROLLBACK</code> per test, well under a millisecond, and the table is byte-identical afterwards.</p>
<p>Its one limitation: code under test that manages its own transactions. A service calling <code>BEGIN</code> inside your <code>BEGIN</code> needs savepoints, and a test for "the transaction rolled back on error" cannot itself run inside a transaction.</p>

<h4>2. TRUNCATE between tests — simple, and it defeats parallelism</h4>
<p>Four test files, each with <code>beforeAll(() =&gt; db.query('TRUNCATE notes RESTART IDENTITY'))</code>, each inserting 20 rows and asserting it sees 20. Ten consecutive runs:</p>
<div class="out">SONG SONG (mặc định): PASS=0 FAIL=10
AssertionError: expected 76 to be 20
AssertionError: expected 78 to be 20
AssertionError: expected 80 to be 20</div>
<p>Each file truncates the table the others are mid-way through filling. Not flaky — <em>reliably</em> broken, 10 out of 10.</p>

<h4>3. A schema per worker — parallel and correct</h4>
<pre><code>const SCHEMA = 'test_w1';                       // một schema cho mỗi file test
beforeAll(async () =&gt; {
  await pool.query(\`DROP SCHEMA IF EXISTS \${SCHEMA} CASCADE\`);
  await pool.query(\`CREATE SCHEMA \${SCHEMA}\`);
  await pool.query(\`CREATE TABLE \${SCHEMA}.notes (…)\`);
});
afterAll(async () =&gt; { await pool.query(\`DROP SCHEMA \${SCHEMA} CASCADE\`); await pool.end(); });</code></pre>
<p>All three approaches, ten runs each:</p>
<div class="out">                                  đậu/10   thời gian tường   test time
song song, dùng chung bảng          0/10       0,89s            260ms
tuần tự (--no-file-parallelism)    10/10       1,37s            731ms
song song, mỗi file một schema     10/10       0,89s            258ms</div>
<p>Turning off parallelism fixes correctness and costs <strong>2,8×</strong> the test time. Isolating by schema fixes correctness and costs <strong>nothing</strong> — 258ms against 260ms. On a four-file demo that is a second; on a real suite it is the difference between a CI step you wait for and one you do not.</p>

<div class="callout">
<p><strong>Why the sequential number is worse than it looks.</strong> Four files ran in 731ms sequentially versus 260ms in parallel on a 10-core machine. The gap widens with every file you add, because the parallel run is bounded by the slowest single file while the sequential run is bounded by their sum. Reaching for <code>--no-file-parallelism</code> is the standard reflex when a suite goes flaky; it works, and it quietly converts your test time from O(max) to O(sum) forever.</p>
</div>

<h3>Where the database comes from</h3>
<p>A throwaway container per test run, in the style of Testcontainers, timed end to end:</p>
<div class="out">docker run trả về sau        202 ms
pg_isready báo OK lần đầu    954 ms
psql kết nối THẬT được      1149 ms
lỗi trong khoảng giữa: psql: error: connection to server on socket
  "/var/run/postgresql/.s.PGSQL.5432" failed: No such file or directory</div>
<p><strong>1149ms</strong> is the honest price of a guaranteed-clean database per run — cheap against a five-minute CI job, expensive against the 0,10s inner loop you run while typing.</p>
<div class="pitfall">
<p><strong>Pitfall — <code>pg_isready</code> lies during initialisation.</strong> It reported ready at 954ms; a real connection only succeeded at 1149ms, and in between the socket did not exist. The Postgres entrypoint starts a temporary server to run the init scripts, then shuts it down and starts the real one, and <code>pg_isready</code> happily answers during that window. Wait for a <strong>real query</strong> to succeed — <code>SELECT 1</code> in a retry loop — not for a health probe. This 195ms window is the source of an entire genre of "works locally, fails in CI" reports.</p>
</div>
<p>Which to use: a long-lived local Postgres (the <code>:5433</code> container this course has used since chapter 7) for the loop you run while writing code, and a throwaway container in CI where a clean start matters more than 1,1 seconds. Same connection string, different value of <code>DATABASE_URL</code>.</p>

<h3>The trap this lesson walked into</h3>
<p>Halfway through writing it, the integration suite from lesson 14.3 went red — with no change to either the tests or the application:</p>
<div class="out">FAIL  tests/http.int.test.mjs &gt; POST /notes &gt; 201 and persists the row
AssertionError: expected 2 to be 1
FAIL  tests/http.int.test.mjs &gt; POST /notes &gt; does not see rows from the previous test
AssertionError: expected 1 to be +0</div>
<p>The cause was a separate script — the race demo at the top of this lesson — which had left one row in the table. Transaction rollback isolates each test from <em>the other tests</em>; it does nothing about state that was already there when the suite started. Two defences, and use both: assert relative to what the test itself created (<code>WHERE author_id = 7</code>, not <code>count(*)</code>), and start the suite from a known state (<code>TRUNCATE</code> once in <code>beforeAll</code>, or a fresh schema).</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it.</strong> This site has <strong>no</strong> database tests — the three files in <code>npm test</code> are pure functions by explicit choice, and CI never starts a PostgreSQL. That is a real gap, and it is worth naming rather than hiding: the compensating control is the migration protocol in <code>CLAUDE.md</code>, which forbids <code>prisma migrate reset</code> and <code>db push</code> against production, forbids auto-resolving a failed migration, and requires <code>prisma migrate diff</code> before touching a drifted schema. Those rules exist <em>because</em> nothing else catches a bad migration before it reaches production. A test suite that starts a container, applies <code>prisma migrate deploy</code> and runs the repository layer against it would move that check from a document to a CI step — which is precisely the next thing this repository should build.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/prisma-orm${REF}#module-2371"><span class="lc-t">Code Lab · Testing Prisma Applications</span><span class="lc-d">Test isolation, fixtures and migrations in CI</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-325"><span class="lc-t">Code Lab · Testing, Deployment, and Production Readiness</span><span class="lc-d">An integration suite for a Node backend</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.4</span>
<h2>Kiểm thử trên cơ sở dữ liệu thật</h2>
<p class="lead">Một repository giả trả lời đúng những gì bạn bảo nó trả lời. Đó là giá trị của nó trong test đơn vị và là mối nguy của nó ở mọi chỗ khác, bởi vì một cái bảng thật có những ý kiến riêng mà hàng giả không có: ràng buộc duy nhất, độ rộng cột, khoá ngoại, mức cô lập, và một cái đồng hồ vẫn chạy trong lúc code của bạn đang nằm giữa hai câu lệnh. Bài này đo cái khoảng cách đó.</p>

<h3>Phép đo phân định cuộc tranh cãi</h3>
<p>Notes service kiểm slug trùng rồi mới chèn — đúng mẫu kiểm-rồi-làm kinh điển. Năm lượt tạo cùng một tiêu đề chạy song song, trước là trên repo giả mà test đơn vị đang dùng, sau là trên bảng thật:</p>
<div class="out">[repo giả]  5 request song song -> 201 201 201 201 201
[DB thật]   5 kết nối MỞ SẴN    ->
  LỖI  status=(KHÔNG CÓ -> 500) code=23505 | duplicate key value violates unique constraint "notes_slug_key"
  LỖI  status=(KHÔNG CÓ -> 500) code=23505 | duplicate key value violates unique constraint "notes_slug_key"
  OK   id=1
  LỖI  status=(KHÔNG CÓ -> 500) code=23505 | duplicate key value violates unique constraint "notes_slug_key"
  LỖI  status=(KHÔNG CÓ -> 500) code=23505 | duplicate key value violates unique constraint "notes_slug_key"
  số dòng = 1</div>
<p>Bộ test đơn vị xanh lè. Còn trên production thì cũng đoạn code ấy trả <code>500</code> bốn lần trên năm, vì lỗi được ném ra có mang <code>code</code> của PostgreSQL nhưng không có <code>status</code>, nên bộ xử lý lỗi rơi xuống nhánh mặc định. Người dùng nhìn thấy "Internal Server Error" cho một chuyện rõ ràng là <code>409</code>.</p>
<p>Chỗ để sửa là ở tầng repository, nơi từ vựng của driver vốn đã nằm trong tầm với:</p>
<pre><code>async insert(n) {
  try {
    const r = await db.query('INSERT INTO notes (title, slug, body, author_id) VALUES ($1,$2,$3,$4) RETURNING *', […]);
    return r.rows[0];
  } catch (e) {
    if (e.code === '23505') throw Object.assign(new Error('SLUG_TAKEN'), { status: 409 });
    throw e;
  }
}</code></pre>
<p>Phép kiểm trước vẫn giữ — nó làm trường hợp thông thường rẻ đi một vòng đi-về và cho ra thông điệp đẹp hơn — nhưng thứ thật sự bắt buộc tính duy nhất là cái ràng buộc. <strong>Kiểm ở tầng ứng dụng là phép lịch sự; ràng buộc mới là luật.</strong></p>

<div class="pitfall">
<p><strong>Bẫy nằm ngay trong chính phép đo.</strong> Hai lần đầu dựng lại cuộc đua này đều <em>thất bại</em> — năm request song song cho ra <code>201 409 409 409 409</code>, tức là đáp án đúng, và con bug trông như tưởng tượng. Lý do: <code>pg.Pool</code> mở kết nối một cách lười biếng, và cú bắt tay TCP cộng xác thực cho các kết nối thứ 2 tới 5 lâu hơn cả quãng kiểm-rồi-làm của request đầu tiên, nên chúng bị tuần tự hoá một cách tình cờ. Cuộc đua chỉ hiện ra khi năm kết nối đã được <strong>mở sẵn và làm nóng</strong> trước. Bất kỳ lỗi tương tranh nào bạn không dựng lại được đều có thể đang nấp sau một khoản chi phí khởi động kiểu này — và đó chính xác là lý do cùng một đoạn code lại cư xử khác nhau dưới tải production so với trên máy của bạn.</p>
</div>

<h3>Còn gì nữa mà hàng giả sẽ không bao giờ nói cho bạn biết</h3>
<div class="out">code = 23505 | constraint = notes_slug_key | duplicate key value violates unique constraint
code = 22001 | value too long for type character varying(200)</div>
<p><code>22001</code> mới là cái cắn đau trên production: zod chặn <code>title</code> ở 200 ký tự, cột là <code>varchar(200)</code>, và hai bên khớp nhau — cho tới khi ai đó nới lược đồ zod lên 500 mà quên migration. Không một bài test đơn vị nào nhận ra được, vì hàng giả nhận mọi chuỗi. Một bài test tích hợp thì nhận ra ngay lập tức.</p>

<h3>Cô lập: ba cách, có đo</h3>
<p>Các bài test dùng chung một cái bảng thì giẫm chân nhau. Ba lựa chọn thực tế:</p>

<h4>1. Transaction rồi rollback — đáp án đúng và nhanh nhất</h4>
<pre><code>beforeAll(async () =&gt; { pool = new pg.Pool({ connectionString: URL, max: 4 }); client = await pool.connect(); });
afterAll(async () =&gt; { client.release(); await pool.end(); });

beforeEach(async () =&gt; {
  await client.query('BEGIN');
  app = createApp({ service: createNotesService(createNotesRepo(client)), auth: headerAuth });
});
afterEach(async () =&gt; { await client.query('ROLLBACK'); });</code></pre>
<p>Chi tiết sống còn là app phải được dựng <strong>quanh đúng cái client</strong> đang giữ transaction — chứ không phải quanh cái pool. Đưa pool cho app thì các truy vấn của nó chạy trên một kết nối khác, nằm ngoài transaction của bạn, và lệnh rollback dọn được đúng số không. Giá phải trả: một <code>BEGIN</code> và một <code>ROLLBACK</code> mỗi bài test, chưa tới một mili-giây, và cái bảng sau đó giống hệt tới từng byte.</p>
<p>Nó có đúng một giới hạn: đoạn code đang được kiểm mà tự quản transaction của chính nó. Một service gọi <code>BEGIN</code> bên trong <code>BEGIN</code> của bạn thì cần savepoint, và một bài test kiểm "transaction đã cuộn ngược khi lỗi" thì bản thân nó không chạy trong transaction được.</p>

<h4>2. TRUNCATE giữa các bài — đơn giản, và giết chết tính song song</h4>
<p>Bốn file test, mỗi file có <code>beforeAll(() =&gt; db.query('TRUNCATE notes RESTART IDENTITY'))</code>, mỗi file chèn 20 dòng rồi khẳng định nó nhìn thấy 20. Chạy mười lần liên tiếp:</p>
<div class="out">SONG SONG (mặc định): PASS=0 FAIL=10
AssertionError: expected 76 to be 20
AssertionError: expected 78 to be 20
AssertionError: expected 80 to be 20</div>
<p>Mỗi file xoá sạch cái bảng mà các file kia đang đổ dữ liệu vào dở dang. Không phải chập chờn — mà là hỏng <em>một cách chắc chắn</em>, 10 trên 10.</p>

<h4>3. Mỗi worker một schema — vừa song song vừa đúng</h4>
<pre><code>const SCHEMA = 'test_w1';                       // một schema cho mỗi file test
beforeAll(async () =&gt; {
  await pool.query(\`DROP SCHEMA IF EXISTS \${SCHEMA} CASCADE\`);
  await pool.query(\`CREATE SCHEMA \${SCHEMA}\`);
  await pool.query(\`CREATE TABLE \${SCHEMA}.notes (…)\`);
});
afterAll(async () =&gt; { await pool.query(\`DROP SCHEMA \${SCHEMA} CASCADE\`); await pool.end(); });</code></pre>
<p>Cả ba cách, mỗi cách chạy mười lần:</p>
<div class="out">                                  đậu/10   thời gian tường   test time
song song, dùng chung bảng          0/10       0,89s            260ms
tuần tự (--no-file-parallelism)    10/10       1,37s            731ms
song song, mỗi file một schema     10/10       0,89s            258ms</div>
<p>Tắt song song thì sửa được tính đúng đắn và trả giá <strong>2,8 lần</strong> thời gian test. Cô lập bằng schema thì cũng sửa được tính đúng đắn mà trả giá <strong>bằng không</strong> — 258ms so với 260ms. Trên một demo bốn file thì đó là một giây; trên một bộ test thật thì đó là ranh giới giữa một bước CI bạn phải ngồi chờ và một bước bạn không phải chờ.</p>

<div class="callout">
<p><strong>Vì sao con số tuần tự tệ hơn vẻ ngoài của nó.</strong> Bốn file chạy hết 731ms khi tuần tự so với 260ms khi song song trên một máy 10 nhân. Khoảng cách ấy nới rộng ra theo từng file bạn thêm vào, vì lượt chạy song song bị chặn bởi file chậm nhất còn lượt chạy tuần tự bị chặn bởi tổng của tất cả. Với tay lấy <code>--no-file-parallelism</code> là phản xạ tiêu chuẩn khi một bộ test đâm ra chập chờn; nó có tác dụng thật, và nó âm thầm biến thời gian test của bạn từ O(lớn nhất) thành O(tổng) vĩnh viễn.</p>
</div>

<h3>Cơ sở dữ liệu ấy lấy từ đâu</h3>
<p>Một container dùng một lần cho mỗi lượt chạy, theo kiểu Testcontainers, bấm giờ từ đầu tới cuối:</p>
<div class="out">docker run trả về sau        202 ms
pg_isready báo OK lần đầu    954 ms
psql kết nối THẬT được      1149 ms
lỗi trong khoảng giữa: psql: error: connection to server on socket
  "/var/run/postgresql/.s.PGSQL.5432" failed: No such file or directory</div>
<p><strong>1149ms</strong> là cái giá trung thực cho một cơ sở dữ liệu bảo đảm sạch ở mỗi lượt chạy — rẻ khi so với một job CI năm phút, đắt khi so với vòng lặp 0,10s bạn chạy trong lúc đang gõ code.</p>
<div class="pitfall">
<p><strong>Bẫy — <code>pg_isready</code> nói dối trong lúc khởi tạo.</strong> Nó báo sẵn sàng ở mốc 954ms; một kết nối thật chỉ thành công ở mốc 1149ms, và ở quãng giữa thì cái socket còn chưa tồn tại. Entrypoint của Postgres dựng một server tạm để chạy các script khởi tạo, rồi tắt nó đi và mới dựng server thật, còn <code>pg_isready</code> thì vẫn vui vẻ trả lời trong suốt cửa sổ đó. Hãy chờ cho tới khi một <strong>truy vấn thật</strong> chạy được — <code>SELECT 1</code> trong một vòng lặp thử lại — chứ đừng chờ một phép thăm dò sức khoẻ. Cửa sổ 195ms này là nguồn gốc của cả một dòng họ báo cáo "chạy ở máy tôi thì được, lên CI thì hỏng".</p>
</div>
<p>Dùng cái nào: một Postgres cục bộ chạy dài hạn (cái container <code>:5433</code> mà khoá học này dùng từ chương 7) cho vòng lặp bạn chạy trong lúc viết code, và một container dùng một lần trong CI, nơi việc bắt đầu từ trạng thái sạch đáng giá hơn 1,1 giây. Cùng một chuỗi kết nối, chỉ khác giá trị của <code>DATABASE_URL</code>.</p>

<h3>Cái bẫy mà chính bài này đã bước vào</h3>
<p>Viết tới nửa bài thì bộ test tích hợp của bài 14.3 đỏ lên — trong khi không có thay đổi nào ở cả test lẫn ứng dụng:</p>
<div class="out">FAIL  tests/http.int.test.mjs &gt; POST /notes &gt; 201 and persists the row
AssertionError: expected 2 to be 1
FAIL  tests/http.int.test.mjs &gt; POST /notes &gt; does not see rows from the previous test
AssertionError: expected 1 to be +0</div>
<p>Thủ phạm là một script riêng — chính cái demo tương tranh ở đầu bài này — đã để sót lại một dòng trong bảng. Rollback theo transaction cô lập từng bài test khỏi <em>các bài test khác</em>; nó không làm gì được với trạng thái vốn đã nằm sẵn ở đó từ trước khi bộ test bắt đầu. Hai phòng tuyến, và hãy dùng cả hai: khẳng định tương đối so với thứ chính bài test đó tạo ra (<code>WHERE author_id = 7</code> chứ không phải <code>count(*)</code>), và khởi động bộ test từ một trạng thái đã biết (một lần <code>TRUNCATE</code> trong <code>beforeAll</code>, hoặc một schema mới tinh).</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào.</strong> Site này <strong>không có</strong> bài test cơ sở dữ liệu nào — ba file trong <code>npm test</code> đều là hàm thuần theo lựa chọn có chủ ý, và CI không bao giờ khởi động PostgreSQL. Đó là một lỗ hổng thật, và đáng gọi tên ra chứ không nên giấu đi: thứ bù đắp cho nó là bộ quy tắc migration trong <code>CLAUDE.md</code>, vốn cấm <code>prisma migrate reset</code> và <code>db push</code> lên production, cấm tự động gỡ một migration đã hỏng, và bắt buộc chạy <code>prisma migrate diff</code> trước khi động vào một lược đồ đã trôi lệch. Những quy tắc ấy tồn tại <em>chính vì</em> không còn thứ gì khác bắt được một migration hỏng trước khi nó tới production. Một bộ test biết khởi động container, chạy <code>prisma migrate deploy</code> rồi kiểm tầng repository trên đó sẽ chuyển phép kiểm ấy từ một tài liệu thành một bước CI — và đó đúng là thứ tiếp theo mà repo này nên dựng.</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/prisma-orm${REF}#module-2371"><span class="lc-t">Code Lab · Testing Prisma Applications</span><span class="lc-d">Cô lập test, dữ liệu mẫu và migration trong CI</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/nodejs-express${REF}#module-325"><span class="lc-t">Code Lab · Testing, Deployment, and Production Readiness</span><span class="lc-d">Bộ test tích hợp cho backend Node</span></a>
</div>
</div>
`,
    },

    /* ─────────────────────────── 14.5 ─────────────────────────── */
    {
      title: '14.5 — Coverage, flaky tests, and CI|||14.5 — Độ phủ, test chập chờn và CI',
      slug: 'nodejs-14-5-do-phu-flaky-ci',
      type: 'VIDEO',
      description: 'Một lỗ leo thang quyền sống sót qua báo cáo độ phủ 100% ở cả bốn cột — cộng với cách săn test chập chờn và bộ CI thật của cuongthai.com, từng bước một, kèm thời gian chạy thật.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Lesson 14.5</span>
<h2>Coverage, flaky tests, and CI</h2>
<p class="lead">Three things stand between a suite that exists and a suite that protects you: knowing what it does not check, knowing which of its failures are lies, and running it somewhere that is not your laptop. This lesson takes them in that order, and it opens with the most uncomfortable measurement in the chapter.</p>

<h3>A privilege escalation that survives 100% coverage</h3>
<p>Here is the whole authorization rule for editing a note:</p>
<pre><code>export function canEdit(user, note) {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  return note.authorId === user.id || user.role === 'EDITOR';   // ← dòng 15
}</code></pre>
<p>Run the unit tests from lesson 14.2 with coverage on:</p>
<div class="out">-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
 slug.mjs          |     100 |    83.33 |     100 |     100 | 15</div>
<p>One hundred percent of statements, functions and lines. The only imperfect number is branches, and it points at line 15. Now add the service tests — the ones that check ownership through <code>svc.update()</code> — and re-measure the same file:</p>
<div class="out">slug.mjs {"lines":{"pct":100},"functions":{"pct":100},"statements":{"pct":100},"branches":{"total":6,"covered":6,"pct":100}}</div>
<p><strong>One hundred percent on all four metrics.</strong> And this still holds:</p>
<div class="out">$ node -e "…canEdit({id:2, role:'EDITOR'}, {authorId:1})"
canEdit({id:2,role:EDITOR},{authorId:1}) = true</div>
<p>Any user carrying the <code>EDITOR</code> role can edit <em>every note on the site</em>. No test anywhere asserts that this is intended. The report says the line is fully covered — and it is telling the truth about what it measures.</p>

<h3>What coverage actually counts</h3>
<p>V8 branch coverage records whether each side of an expression was <strong>evaluated</strong>, not whether each <strong>outcome</strong> occurred. The service test passes a <code>USER</code> whose id does not match, so JavaScript evaluates <code>note.authorId === user.id</code> (false), then evaluates <code>user.role === 'EDITOR'</code> (also false). Both operands ran. The counter is satisfied. The case where that second operand is <em>true</em> — the escalation — was never produced by any test, and coverage has no way to represent that.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">Coverage answers ONLY</span><span class="lz-d">"was this line/branch executed while the tests ran?"</span></div>
  <div class="lz-layer"><span class="lz-t">It does NOT answer</span><span class="lz-d">"would any test GO RED if this line were wrong?"</span></div>
  <div class="lz-layer"><span class="lz-t">The consequence</span><span class="lz-d">a suite with not a single assertion in it still reaches 100% in all four columns</span></div>
</div>
<p>Use coverage the way a smoke detector is used: a low number is real information, a high number is not a certificate. The useful reading is the <em>uncovered</em> column — <code>app.mjs | 41,46-49</code> in the full run below says the error branches of <code>PATCH /notes/:id</code> were never exercised, and that is a genuine to-do list:</p>
<div class="out">-------------------|---------|----------|---------|---------|-------------------
All files          |   83.33 |    70.83 |   79.16 |   84.61 |
 app.mjs           |   79.48 |    61.11 |   77.77 |   85.29 | 41,46-49
 notes.repo.mjs    |   63.63 |     37.5 |   66.66 |   63.63 | 21-29
 notes.service.mjs |   93.33 |    83.33 |      75 |    90.9 | 21
-------------------|---------|----------|---------|---------|-------------------
21 test · Duration 1.84s</div>
<div class="callout ok">
<p><strong>The technique that does answer the real question.</strong> Change the production code on purpose and check that a test goes red — <code>canEdit</code> with <code>||</code> swapped for <code>&amp;&amp;</code>, a <code>404</code> changed to <code>403</code>, a <code>&gt;=</code> changed to <code>&gt;</code>. Automating exactly this is called mutation testing (Stryker is the usual tool in the Node ecosystem); doing it by hand on the ten most dangerous lines in your codebase costs an afternoon and finds more than any coverage threshold ever will.</p>
</div>

<h3>Flaky tests: the four causes, all measured in this chapter</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Shared state</span><span class="v">4 files TRUNCATE the same table: <strong>red 10 times out of 10</strong>, "expected 76 to be 20" (lesson 14.4)</span></div>
  <div class="kv"><span class="k">Leftover garbage</span><span class="v">a single row left behind by another script: "expected 2 to be 1", while neither the test nor the code changed a character (lesson 14.4)</span></div>
  <div class="kv"><span class="k">Real time</span><span class="v">asserting on a boundary using the system clock — right today, wrong on the day the clocks change (lesson 14.2)</span></div>
  <div class="kv"><span class="k">Non-deterministic concurrency</span><span class="v">the same 23505 race: it appears 0 times in 5 with a cold pool, 4 times in 5 once the connections are warm (lesson 14.4)</span></div>
</div>
<p>A flaky test is worse than no test. It trains the team to re-run CI instead of reading it, and once that habit exists a <em>real</em> failure gets re-run too. Two tools for hunting one down:</p>
<pre><code># 1. Chạy lặp — chập chờn theo xác suất thì lộ ra ở tần suất
for i in $(seq 1 10); do npx vitest run --config vitest.flaky.mjs; done
# → PASS=0 FAIL=10 : không phải chập chờn, mà là hỏng chắc chắn
# → PASS=7 FAIL=3  : mới đúng là chập chờn, đi tìm trạng thái dùng chung

# 2. Xáo thứ tự — lộ ra sự phụ thuộc vào trình tự
npx vitest run --sequence.shuffle</code></pre>
<div class="out">$ npx vitest run tests/slug.test.mjs --sequence.shuffle --reporter=verbose
 ✓ canEdit &gt; allows the author
 ✓ canEdit &gt; allows admin          ← lần 1
 ✓ slugify &gt; drops separators
$ (lần 2)
 ✓ canEdit &gt; allows admin
 ✓ canEdit &gt; rejects anonymous     ← thứ tự đã khác
 ✓ slugify &gt; caps the length at 60</div>
<p>A test that only passes in one order is a test that depends on another test's leftovers. Shuffle makes that visible in one run instead of on a random Tuesday.</p>
<div class="pitfall">
<p><strong>Pitfall — <code>retry: 3</code> in the config is not a fix.</strong> It converts a test that fails 30% of the time into one that fails 2,7% of the time, and it hides the underlying shared state until that state causes a production incident instead. Retries have exactly one legitimate use: a test that genuinely depends on an external system you do not control. Everything else gets isolated, not retried.</p>
</div>

<h3>Running it somewhere that is not your laptop</h3>
<p>The value of CI is not that it runs the tests — it is that it runs them on a machine with none of your local state: no leftover rows, no <code>node_modules</code> from three branches ago, no environment variable you exported in October and forgot.</p>
<p>Here is the workflow this site actually uses, step by step, from <code>.github/workflows/ci-lint.yml</code>:</p>
<pre><code>on:
  pull_request: { branches: [main] }
  push:
    branches: [main]
    paths: ['src/**', 'frontend/src/**', 'prisma/**', 'package.json', …]   # chỉ chạy khi ĐÁNG chạy
  workflow_dispatch: {}                                                    # bấm chạy tay được

jobs:
  backend-lint:
    runs-on: ubuntu-24.04
    timeout-minutes: 10                       # ← chốt chặn: job treo phải chết, không được treo mãi
    steps:
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }   # 22 khớp runtime production (node:22-alpine)
      - run: npm ci --no-audit --no-fund       # ci, KHÔNG install: dựng lại đúng lockfile
      - run: npx tsc --noEmit                  # bắt buộc
      - run: npm run eval:grader               # bắt buộc — bộ vàng, không DB, không khoá LLM
      - run: npm run eval:cv-linter            # bắt buộc
      - run: npm run eval:cv-fabrication       # tự BỎ QUA nếu thiếu khoá AI
      - run: npm test                          # bắt buộc — 20 test, 1297ms
      - run: npm run lint
        continue-on-error: true                # ← chỉ để tham khảo, không chặn merge</code></pre>
<div class="out">gh run list --workflow=ci-lint.yml --limit 6
success  …  1m50s
success  …  1m30s
success  …  2m8s
success  …  2m7s
success  …  1m55s
success  …  1m49s</div>
<p>Between 1m30s and 2m8s, and the actual test step is 1,3 seconds of that. Nearly all of it is <code>npm ci</code> and TypeScript. That ratio is normal, and it is the reason "our tests are too slow for CI" is almost never true at this size — install and type-check dominate long before the tests do.</p>

<h3>Four design decisions visible in that file</h3>
<div class="kv-grid">
  <div class="kv"><span class="k"><code>paths:</code> filter</span><span class="v">editing the README does not run CI. It keeps the CI signal meaningful and the queue short</span></div>
  <div class="kv"><span class="k"><code>npm ci</code> rather than <code>npm install</code></span><span class="v">chapter 4 measured this: <code>install</code> jumped to 4.22.2, while <code>ci</code> stayed at 4.18.0 per the lockfile</span></div>
  <div class="kv"><span class="k">Blocking versus advisory</span><span class="v">tsc, eval and the tests block the merge; eslint <code>continue-on-error</code>. A lint warning blocking a hotfix is the fastest way to teach a whole team to ignore CI</span></div>
  <div class="kv"><span class="k">Tests that skip themselves when a secret is missing</span><span class="v">the anti-fabrication test exits 0 when there is no AI key, so the suite still runs on forks and on personal machines</span></div>
</div>

<h3>What should block a merge</h3>
<p>The list is shorter than it looks, and it follows from the whole chapter: type check, the tests whose failure means something is <em>wrong</em> rather than <em>untidy</em>, and — once a suite touches the database — a migration that applies cleanly on an empty schema. Style opinions, coverage thresholds and lint warnings belong in the informational column. Every gate you add that a developer cannot fix in under a minute is a gate they will eventually learn to bypass.</p>

<div class="note-ct">
<p><strong>How cuongthai.com does it — including what is still missing.</strong> The deploy path here is deliberately not push-to-deploy: <code>CLAUDE.md</code> requires the local checklist first, then <code>bash deploy.sh</code> from the local machine, then a human testing production, and only then a <code>git push</code> to sync GitHub with what production is already running. The reason is written in the file — two workflows racing each other caused real outages on 2026-07-03 and 2026-07-06. On top of that, <code>deploy.sh</code> ends with a <strong>post-deploy smoke test</strong> that curls core GET routes on the internal backend and fails the deploy if any returns 404, because a 404 means the route was never mounted, which means the container is running a stale image — the exact failure that took the GIF picker down on 2026-07-02. That smoke test is an end-to-end test wearing a shell script's clothes, and it earns its place: it catches the one class of bug no unit test can, namely "the thing that got deployed is not the thing you built".</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/github-actions${REF}#module-924"><span class="lc-t">Code Lab · Building &amp; Testing Projects</span><span class="lc-d">Building a CI pipeline that runs Node tests</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-993"><span class="lc-t">Code Lab · Observability in CI/CD</span><span class="lc-d">Observing the pipeline itself — continuing into chapter 15</span></a>
</div>
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 14 · Bài 14.5</span>
<h2>Độ phủ, test chập chờn và CI</h2>
<p class="lead">Có ba thứ ngăn cách giữa một bộ test tồn tại và một bộ test thật sự bảo vệ bạn: biết nó KHÔNG kiểm cái gì, biết trong những lần nó báo hỏng thì lần nào là nói dối, và chạy nó ở một nơi không phải máy của bạn. Bài này đi theo đúng thứ tự đó, và mở đầu bằng phép đo khó chịu nhất cả chương.</p>

<h3>Một lỗ leo thang quyền sống sót qua độ phủ 100%</h3>
<p>Đây là toàn bộ luật phân quyền cho việc sửa một ghi chú:</p>
<pre><code>export function canEdit(user, note) {
  if (!user) return false;
  if (user.role === 'ADMIN') return true;
  return note.authorId === user.id || user.role === 'EDITOR';   // ← dòng 15
}</code></pre>
<p>Chạy các bài test đơn vị của bài 14.2 kèm đo độ phủ:</p>
<div class="out">-------------------|---------|----------|---------|---------|-------------------
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-------------------|---------|----------|---------|---------|-------------------
 slug.mjs          |     100 |    83.33 |     100 |     100 | 15</div>
<p>Một trăm phần trăm câu lệnh, hàm và dòng. Con số duy nhất chưa tròn là nhánh, và nó chỉ đúng vào dòng 15. Giờ thêm các bài test service — những bài kiểm quyền sở hữu thông qua <code>svc.update()</code> — rồi đo lại chính file đó:</p>
<div class="out">slug.mjs {"lines":{"pct":100},"functions":{"pct":100},"statements":{"pct":100},"branches":{"total":6,"covered":6,"pct":100}}</div>
<p><strong>Một trăm phần trăm ở cả bốn cột.</strong> Vậy mà điều này vẫn đúng:</p>
<div class="out">$ node -e "…canEdit({id:2, role:'EDITOR'}, {authorId:1})"
canEdit({id:2,role:EDITOR},{authorId:1}) = true</div>
<p>Bất kỳ người dùng nào mang vai <code>EDITOR</code> đều sửa được <em>mọi ghi chú trên toàn site</em>. Không một bài test nào ở đâu khẳng định rằng đó là điều cố ý. Bản báo cáo nói dòng đó đã được phủ kín — và nó đang nói thật về đúng cái mà nó đo.</p>

<h3>Độ phủ thật ra đếm cái gì</h3>
<p>Độ phủ nhánh của V8 ghi lại việc mỗi vế của một biểu thức có được <strong>đánh giá</strong> hay không, chứ không phải mỗi <strong>kết cục</strong> có xảy ra hay không. Bài test service truyền vào một <code>USER</code> có id không khớp, nên JavaScript đánh giá <code>note.authorId === user.id</code> (sai), rồi đánh giá tiếp <code>user.role === 'EDITOR'</code> (cũng sai). Cả hai toán hạng đều đã chạy. Bộ đếm thoả mãn. Còn trường hợp toán hạng thứ hai là <em>đúng</em> — tức là cú leo thang quyền — thì chưa bài test nào từng tạo ra, và độ phủ không có cách nào biểu diễn được chuyện đó.</p>
<div class="lz-stack">
  <div class="lz-layer"><span class="lz-t">Độ phủ CHỈ trả lời</span><span class="lz-d">"dòng/nhánh này có được thực thi trong lúc chạy test không?"</span></div>
  <div class="lz-layer"><span class="lz-t">Nó KHÔNG trả lời</span><span class="lz-d">"có bài test nào sẽ ĐỎ LÊN nếu dòng này sai không?"</span></div>
  <div class="lz-layer"><span class="lz-t">Hệ quả</span><span class="lz-d">một bộ test không chứa một khẳng định nào vẫn đạt 100% cả bốn cột</span></div>
</div>
<p>Hãy dùng độ phủ như dùng một cái đầu báo khói: con số thấp là thông tin thật, con số cao không phải là giấy chứng nhận. Phần đọc được việc là cột <em>chưa phủ</em> — dòng <code>app.mjs | 41,46-49</code> trong lượt chạy đầy đủ dưới đây nói rằng các nhánh lỗi của <code>PATCH /notes/:id</code> chưa từng được chạm tới, và đó là một danh sách việc cần làm có thật:</p>
<div class="out">-------------------|---------|----------|---------|---------|-------------------
All files          |   83.33 |    70.83 |   79.16 |   84.61 |
 app.mjs           |   79.48 |    61.11 |   77.77 |   85.29 | 41,46-49
 notes.repo.mjs    |   63.63 |     37.5 |   66.66 |   63.63 | 21-29
 notes.service.mjs |   93.33 |    83.33 |      75 |    90.9 | 21
-------------------|---------|----------|---------|---------|-------------------
21 test · Duration 1.84s</div>
<div class="callout ok">
<p><strong>Kỹ thuật thật sự trả lời được câu hỏi thật.</strong> Cố ý sửa code production rồi kiểm xem có bài test nào đỏ lên không — đổi <code>||</code> trong <code>canEdit</code> thành <code>&amp;&amp;</code>, đổi một mã <code>404</code> thành <code>403</code>, đổi một dấu <code>&gt;=</code> thành <code>&gt;</code>. Tự động hoá đúng việc này gọi là mutation testing (trong hệ sinh thái Node thì công cụ thông dụng là Stryker); còn làm bằng tay trên mười dòng nguy hiểm nhất của dự án thì tốn một buổi chiều và tìm ra nhiều hơn bất kỳ ngưỡng độ phủ nào.</p>
</div>

<h3>Test chập chờn: bốn nguyên nhân, cả bốn đều đã đo trong chương này</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Trạng thái dùng chung</span><span class="v">4 file cùng TRUNCATE một bảng: <strong>đỏ 10/10</strong>, "expected 76 to be 20" (bài 14.4)</span></div>
  <div class="kv"><span class="k">Rác còn sót lại từ trước</span><span class="v">một dòng do script khác để lại: "expected 2 to be 1", trong khi test và code không đổi một chữ (bài 14.4)</span></div>
  <div class="kv"><span class="k">Thời gian thật</span><span class="v">khẳng định ở mốc biên bằng đồng hồ hệ thống — hôm nay đúng, tới ngày đổi giờ thì sai (bài 14.2)</span></div>
  <div class="kv"><span class="k">Tương tranh không tất định</span><span class="v">cùng cuộc đua 23505: hiện ra 0/5 lần khi pool còn lạnh, 4/5 khi kết nối đã ấm (bài 14.4)</span></div>
</div>
<p>Một bài test chập chờn còn tệ hơn không có test. Nó huấn luyện cả nhóm phản xạ bấm chạy lại CI thay vì đọc CI, và một khi thói quen đó hình thành thì một lần hỏng <em>thật</em> cũng bị bấm chạy lại. Hai công cụ để đi săn:</p>
<pre><code># 1. Chạy lặp — chập chờn theo xác suất thì lộ ra ở tần suất
for i in $(seq 1 10); do npx vitest run --config vitest.flaky.mjs; done
# → PASS=0 FAIL=10 : không phải chập chờn, mà là hỏng chắc chắn
# → PASS=7 FAIL=3  : cái này mới đúng là chập chờn, hãy đi tìm trạng thái dùng chung

# 2. Xáo thứ tự — làm lộ ra sự phụ thuộc vào trình tự
npx vitest run --sequence.shuffle</code></pre>
<div class="out">$ npx vitest run tests/slug.test.mjs --sequence.shuffle --reporter=verbose
 ✓ canEdit &gt; allows the author
 ✓ canEdit &gt; allows admin          ← lần 1
 ✓ slugify &gt; drops separators
$ (lần 2)
 ✓ canEdit &gt; allows admin
 ✓ canEdit &gt; rejects anonymous     ← thứ tự đã khác
 ✓ slugify &gt; caps the length at 60</div>
<p>Một bài test chỉ đậu ở đúng một thứ tự là một bài test phụ thuộc vào rác của bài test khác. Xáo thứ tự làm chuyện đó lộ ra ngay trong một lượt chạy, thay vì lộ ra vào một ngày thứ Ba ngẫu nhiên nào đó.</p>
<div class="pitfall">
<p><strong>Bẫy — <code>retry: 3</code> trong cấu hình KHÔNG phải là cách sửa.</strong> Nó biến một bài test hỏng 30% số lần thành một bài hỏng 2,7% số lần, và nó che luôn cái trạng thái dùng chung nằm dưới cho tới khi chính trạng thái đó gây ra sự cố trên production. Việc thử lại có đúng một công dụng chính đáng: một bài test thật sự phụ thuộc vào hệ thống bên ngoài mà bạn không điều khiển được. Mọi trường hợp còn lại thì phải cô lập, không phải thử lại.</p>
</div>

<h3>Chạy nó ở một nơi không phải máy của bạn</h3>
<p>Giá trị của CI không nằm ở chỗ nó chạy test — mà ở chỗ nó chạy test trên một cái máy không mang theo chút trạng thái cục bộ nào của bạn: không có dòng dữ liệu sót lại, không có <code>node_modules</code> từ ba nhánh trước, không có biến môi trường bạn export từ tháng Mười rồi quên mất.</p>
<p>Đây là workflow mà site này thật sự đang dùng, từng bước một, trích từ <code>.github/workflows/ci-lint.yml</code>:</p>
<pre><code>on:
  pull_request: { branches: [main] }
  push:
    branches: [main]
    paths: ['src/**', 'frontend/src/**', 'prisma/**', 'package.json', …]   # chỉ chạy khi ĐÁNG chạy
  workflow_dispatch: {}                                                    # bấm chạy tay được

jobs:
  backend-lint:
    runs-on: ubuntu-24.04
    timeout-minutes: 10                       # ← chốt chặn: job treo phải chết, không được treo mãi
    steps:
      - uses: actions/setup-node@v4
        with: { node-version: '22', cache: 'npm' }   # 22 khớp runtime production (node:22-alpine)
      - run: npm ci --no-audit --no-fund       # ci, KHÔNG phải install: dựng lại đúng theo lockfile
      - run: npx tsc --noEmit                  # bắt buộc
      - run: npm run eval:grader               # bắt buộc — bộ vàng, không DB, không khoá LLM
      - run: npm run eval:cv-linter            # bắt buộc
      - run: npm run eval:cv-fabrication       # tự BỎ QUA nếu thiếu khoá AI
      - run: npm test                          # bắt buộc — 20 test, 1297ms
      - run: npm run lint
        continue-on-error: true                # ← chỉ để tham khảo, không chặn merge</code></pre>
<div class="out">gh run list --workflow=ci-lint.yml --limit 6
success  …  1m50s
success  …  1m30s
success  …  2m8s
success  …  2m7s
success  …  1m55s
success  …  1m49s</div>
<p>Từ 1 phút 30 tới 2 phút 8, và bước chạy test thật sự chỉ chiếm 1,3 giây trong số đó. Gần như toàn bộ thời gian là <code>npm ci</code> và TypeScript. Tỉ lệ này là bình thường, và nó là lý do câu "test của tụi mình chậm quá không đưa lên CI được" gần như không bao giờ đúng ở quy mô này — cài đặt và kiểm kiểu áp đảo phần test từ rất lâu trước đó.</p>

<h3>Bốn quyết định thiết kế nhìn thấy được trong file đó</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">Bộ lọc <code>paths:</code></span><span class="v">sửa README thì không chạy CI. Giữ cho tín hiệu CI có ý nghĩa và cho hàng đợi ngắn lại</span></div>
  <div class="kv"><span class="k"><code>npm ci</code> chứ không <code>npm install</code></span><span class="v">chương 4 đã đo: <code>install</code> nhảy lên 4.22.2, còn <code>ci</code> giữ nguyên 4.18.0 theo lockfile</span></div>
  <div class="kv"><span class="k">Bắt buộc so với tham khảo</span><span class="v">tsc, eval và test thì chặn merge; eslint để <code>continue-on-error</code>. Một cảnh báo lint chặn được hotfix là cách nhanh nhất dạy cả nhóm phớt lờ CI</span></div>
  <div class="kv"><span class="k">Test tự bỏ qua khi thiếu bí mật</span><span class="v">bài test chống bịa đặt thoát 0 khi không có khoá AI, nên bộ test vẫn chạy được ở fork và trên máy cá nhân</span></div>
</div>

<h3>Cái gì nên chặn merge</h3>
<p>Danh sách ngắn hơn vẻ ngoài của nó, và nó suy ra từ cả chương: kiểm kiểu, những bài test mà hỏng nghĩa là có gì đó <em>sai</em> chứ không phải <em>chưa gọn</em>, và — một khi bộ test đã chạm tới cơ sở dữ liệu — một migration áp được sạch sẽ lên lược đồ trống. Ý kiến về phong cách, ngưỡng độ phủ và cảnh báo lint thì thuộc về cột tham khảo. Mỗi cái chốt chặn bạn thêm vào mà lập trình viên không sửa nổi trong vòng một phút là một cái chốt rồi họ sẽ học được cách đi vòng qua.</p>

<div class="note-ct">
<p><strong>cuongthai.com làm thế nào — kể cả phần còn thiếu.</strong> Đường deploy ở đây cố ý không phải là đẩy-lên-là-deploy: <code>CLAUDE.md</code> bắt chạy checklist ở máy trước, rồi <code>bash deploy.sh</code> từ máy cá nhân, rồi một con người test production, và chỉ sau đó mới <code>git push</code> để đồng bộ GitHub với thứ production vốn đã chạy. Lý do được ghi thẳng trong file — hai workflow chạy đua nhau đã gây ra sự cố thật vào ngày 03/07/2026 và 06/07/2026. Trên nữa, <code>deploy.sh</code> kết thúc bằng một <strong>bài smoke test sau deploy</strong>: nó curl các route GET lõi trên backend nội bộ và làm hỏng cả lượt deploy nếu có route nào trả 404, bởi 404 nghĩa là route chưa từng được mount, nghĩa là container đang chạy một ảnh cũ — đúng cái lỗi đã hạ gục bộ chọn GIF ngày 02/07/2026. Bài smoke test đó là một bài test đầu-cuối khoác áo shell script, và nó xứng đáng có mặt: nó bắt được đúng lớp lỗi mà không test đơn vị nào bắt nổi, ấy là "thứ vừa được deploy không phải thứ bạn vừa build".</p>
</div>

<div class="link-card codelab">
  <a href="/code-lab/github-actions${REF}#module-924"><span class="lc-t">Code Lab · Building &amp; Testing Projects</span><span class="lc-d">Dựng pipeline CI chạy test cho Node</span></a>
</div>
<div class="link-card codelab">
  <a href="/code-lab/observability-monitoring${REF}#module-993"><span class="lc-t">Code Lab · Observability in CI/CD</span><span class="lc-d">Quan sát chính cái pipeline — nối tiếp chương 15</span></a>
</div>
</div>
`,
    },

    /* ─────────────────────────── 14.6 ─────────────────────────── */
    {
      title: '14.6 — Quiz: testing|||14.6 — Kiểm tra: kiểm thử',
      slug: 'nodejs-14-6-quiz',
      type: 'QUIZ',
      description: 'Mười câu về giá của từng tầng test, hàng giả nói dối, cô lập dữ liệu, độ phủ, test chập chờn và CI — mỗi câu đều được phân định bởi một phép đo trong bài 14.1 tới 14.5.',
      content: `
<div class="ml-en">
<span class="eyebrow">Chapter 14 · Quiz</span>
<h2>Check what stuck</h2>
<p class="lead">Every question below is settled by a measurement in lessons 14.1 to 14.5 — the runner that won without being installed, the fake repository that reported five successes where the table accepted one, the four parallel test files that failed ten times out of ten, and the authorization hole that survived a coverage report reading 100% in all four columns. Testing is the one topic where intuition is most often wrong, so prefer the output block.</p>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 14 · Kiểm tra</span>
<h2>Xem thử đọng lại được gì</h2>
<p class="lead">Mọi câu dưới đây đều được phân định bởi một phép đo trong bài 14.1 tới 14.5 — bộ chạy test thắng cuộc mà không cần cài đặt, cái repository giả báo năm lần thành công trong khi bảng thật chỉ nhận một, bốn file test song song hỏng mười lần trên mười, và lỗ phân quyền sống sót qua bản báo cáo độ phủ ghi 100% ở cả bốn cột. Kiểm thử là chủ đề mà trực giác sai nhiều nhất, nên hãy tin khối kết quả đo.</p>
</div>
`,
      quiz: {
        timeLimitSeconds: 720,
        questions: [
          {
            question: 'Running the same 1000 unit tests took 0,71s under node:test (0 extra packages), 2,20s under vitest (75 packages, 34MB) and 2,08s under jest (322 packages, 43MB). What follows from this?|||Chạy cùng một bộ 1000 test đơn vị mất 0,71s với node:test (0 gói cài thêm), 2,20s với vitest (75 gói, 34MB) và 2,08s với jest (322 gói, 43MB). Từ đó rút ra điều gì?',
            options: [
              'vitest is always the fastest choice and the numbers must have been measured wrongly|||vitest luôn là lựa chọn nhanh nhất, chắc chắn các con số này đã bị đo sai',
              'For a plain Node backend the "vitest is much faster" claim does not hold — vitest wins where it can reuse a Vite pipeline, so pick a runner by ecosystem and dependency cost, not by speed slogans|||Với một backend Node thuần thì lời khẳng định "vitest nhanh hơn nhiều" không đúng — vitest thắng ở nơi nó dùng lại được đường ống Vite, nên hãy chọn bộ chạy theo hệ sinh thái và chi phí phụ thuộc chứ không theo khẩu hiệu tốc độ',
              'jest is the fastest runner and should be the default for every Node project|||jest là bộ chạy nhanh nhất và nên là mặc định cho mọi dự án Node',
              'The differences are caused entirely by disk size, so deleting node_modules speeds tests up|||Khác biệt hoàn toàn do dung lượng đĩa gây ra, nên xoá node_modules sẽ làm test chạy nhanh hơn',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The same assertion cost 0,0006ms as a unit test with a fake repository and 5,5ms as an integration test through HTTP and a real table — a factor of about 9.000. What is the correct conclusion?|||Cùng một khẳng định tốn 0,0006ms khi là test đơn vị với repository giả và 5,5ms khi là test tích hợp đi qua HTTP và bảng thật — chênh khoảng 9.000 lần. Kết luận đúng là gì?',
            options: [
              'Write only unit tests; integration tests are 9.000 times less efficient|||Chỉ viết test đơn vị; test tích hợp kém hiệu quả 9.000 lần',
              'It is a budget, not a verdict: the two kinds catch different bugs, so spend the cheap ones broadly on logic and the expensive ones where assembly and database rules actually live|||Đó là một ngân sách chứ không phải bản án: hai loại bắt những lỗi khác nhau, nên hãy tiêu loại rẻ thật rộng cho phần logic và tiêu loại đắt vào đúng chỗ có luật lắp ráp và luật cơ sở dữ liệu',
              'Integration tests should be deleted once the unit tests cover the same lines|||Nên xoá test tích hợp một khi test đơn vị đã phủ cùng những dòng đó',
              'The ratio proves the database is misconfigured and needs tuning|||Tỉ lệ đó chứng minh cơ sở dữ liệu bị cấu hình sai và cần tinh chỉnh',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'In the layer measurement, e2e through a real listening server cost 3,3ms per request while the supertest integration test cost 5,5ms — the pyramid upside down. Why?|||Trong phép đo theo tầng, e2e qua một server thật đang nghe cổng tốn 3,3ms mỗi request trong khi test tích hợp bằng supertest tốn 5,5ms — kim tự tháp lộn ngược. Vì sao?',
            options: [
              'Real HTTP over loopback is faster than an in-process call|||HTTP thật qua loopback nhanh hơn một lời gọi trong cùng tiến trình',
              'supertest creates and tears down an ephemeral server for every single request, while the e2e loop called listen() once and reused it|||supertest tạo mới rồi dẹp bỏ một server tạm cho từng request một, còn vòng lặp e2e gọi listen() đúng một lần và dùng lại nó',
              'The e2e test skipped the database, which is where the time goes|||Bài test e2e đã bỏ qua cơ sở dữ liệu, mà thời gian nằm ở đó',
              'Express is faster when it is bound to a real port|||Express chạy nhanh hơn khi được gắn vào một cổng thật',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Five concurrent creates of the same title returned 201 five times against the fake repository, but against the real table gave one success and four errors with code 23505 and no status field — which the error handler turned into HTTP 500. What is the right fix?|||Năm lượt tạo cùng một tiêu đề chạy song song trả 201 năm lần trên repository giả, nhưng trên bảng thật thì cho một lần thành công và bốn lỗi mang mã 23505 mà không có trường status — thứ bị bộ xử lý lỗi biến thành HTTP 500. Cách sửa đúng là gì?',
            options: [
              'Remove the unique constraint so the insert cannot fail|||Bỏ ràng buộc duy nhất đi để lệnh chèn không thể hỏng',
              'Keep the pre-check for the common case but catch code 23505 in the repository and rethrow it as a 409 — the pre-check is a courtesy, the constraint is the rule|||Vẫn giữ phép kiểm trước cho trường hợp thông thường nhưng bắt mã 23505 ngay ở tầng repository rồi ném lại thành 409 — phép kiểm trước là phép lịch sự, ràng buộc mới là luật',
              'Serialise all writes through a single connection so the race cannot happen|||Tuần tự hoá mọi lệnh ghi qua một kết nối duy nhất để cuộc đua không xảy ra được',
              'Make the fake repository throw 23505 too, and keep testing only against the fake|||Bắt repository giả cũng ném 23505, rồi tiếp tục chỉ test trên hàng giả',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The first two attempts to reproduce that race produced the correct answer (201 409 409 409 409) and the bug looked imaginary; it only appeared once five connections had been opened and warmed first. What is the transferable lesson?|||Hai lần đầu dựng lại cuộc đua đó cho ra đáp án đúng (201 409 409 409 409) và con bug trông như tưởng tượng; nó chỉ hiện ra khi năm kết nối đã được mở sẵn và làm nóng trước. Bài học mang đi được là gì?',
            options: [
              'The race does not really exist; the first two runs were the truth|||Cuộc đua đó thật ra không tồn tại; hai lần chạy đầu mới là sự thật',
              'pg.Pool connects lazily, so the handshake accidentally serialised the requests — a concurrency bug you cannot reproduce may be hidden behind a warm-up cost, which is why laptops and production behave differently|||pg.Pool mở kết nối một cách lười biếng nên cú bắt tay đã vô tình tuần tự hoá các request — một lỗi tương tranh bạn không dựng lại được có thể đang nấp sau chi phí khởi động, và đó là lý do máy cá nhân với production cư xử khác nhau',
              'PostgreSQL only enforces unique constraints under high load|||PostgreSQL chỉ áp dụng ràng buộc duy nhất khi tải cao',
              'Node is single-threaded, so races between requests are impossible|||Node chạy một luồng nên các cuộc đua giữa request là không thể xảy ra',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Four test files sharing one table and each calling TRUNCATE failed 10 runs out of 10 ("expected 76 to be 20"). Turning off parallelism passed 10/10 but raised test time from 260ms to 731ms; giving each file its own schema passed 10/10 at 258ms. Which conclusion is right?|||Bốn file test dùng chung một bảng và mỗi file đều gọi TRUNCATE đã hỏng 10 trên 10 lượt chạy ("expected 76 to be 20"). Tắt chạy song song thì đậu 10/10 nhưng thời gian test tăng từ 260ms lên 731ms; cho mỗi file một schema riêng thì đậu 10/10 ở mức 258ms. Kết luận nào đúng?',
            options: [
              'Always disable parallelism — correctness is worth 2,8× the time|||Cứ luôn tắt chạy song song — tính đúng đắn đáng giá 2,8 lần thời gian',
              'Isolate the data instead of serialising the runner: turning off parallelism converts test time from O(slowest file) to O(sum of files) forever, while a schema per worker buys the same correctness for free|||Hãy cô lập dữ liệu thay vì tuần tự hoá bộ chạy: tắt song song biến thời gian test từ O(file chậm nhất) thành O(tổng các file) vĩnh viễn, còn mỗi worker một schema thì mua được đúng tính đúng đắn ấy mà không mất gì',
              'TRUNCATE is the problem and DELETE would have worked|||TRUNCATE mới là vấn đề, dùng DELETE thì đã chạy được',
              'Four files is simply too many for one database|||Bốn file đơn giản là quá nhiều cho một cơ sở dữ liệu',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'A throwaway Postgres container reported ready via pg_isready at 954ms, but a real connection only succeeded at 1149ms; in between, psql failed with "connection to server on socket … failed: No such file or directory". What should a test harness wait for?|||Một container Postgres dùng một lần báo sẵn sàng qua pg_isready ở mốc 954ms, nhưng một kết nối thật chỉ thành công ở mốc 1149ms; ở quãng giữa, psql hỏng với lỗi "connection to server on socket … failed: No such file or directory". Bộ khung test nên chờ cái gì?',
            options: [
              'pg_isready, plus a fixed sleep of one second to be safe|||Chờ pg_isready, cộng thêm một lệnh ngủ cố định một giây cho chắc',
              'A real query such as SELECT 1 succeeding in a retry loop — the entrypoint runs a temporary server during init and the health probe answers during that window|||Chờ cho tới khi một truy vấn thật như SELECT 1 chạy được trong một vòng lặp thử lại — entrypoint có dựng một server tạm trong lúc khởi tạo và phép thăm dò sức khoẻ vẫn trả lời trong cửa sổ đó',
              'The docker run command to return, which happened at 202ms|||Chờ lệnh docker run trả về, tức là ở mốc 202ms',
              'The container logs to contain the word "ready", which is always reliable|||Chờ log của container chứa chữ "ready", cách này luôn đáng tin',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'With the unit tests plus the service tests running, slug.mjs reported 100% statements, 100% functions, 100% lines AND 100% branches — while canEdit({id:2, role:&#39;EDITOR&#39;}, {authorId:1}) still returned true, letting any EDITOR edit every note. How is that possible?|||Khi chạy cả test đơn vị lẫn test service, slug.mjs báo 100% câu lệnh, 100% hàm, 100% dòng VÀ 100% nhánh — trong khi canEdit({id:2, role:&#39;EDITOR&#39;}, {authorId:1}) vẫn trả về true, cho phép mọi EDITOR sửa mọi ghi chú. Chuyện đó xảy ra được là nhờ đâu?',
            options: [
              'The coverage tool has a bug and under-reports the missing branch|||Công cụ đo độ phủ bị lỗi nên báo thiếu mất cái nhánh chưa phủ',
              'V8 branch coverage records whether each operand was EVALUATED, not whether each OUTCOME occurred — both sides of the || ran and returned false, so the counter is satisfied while the true case was never produced by any test|||Độ phủ nhánh của V8 ghi lại việc mỗi toán hạng có được ĐÁNH GIÁ hay không, chứ không phải mỗi KẾT CỤC có xảy ra hay không — cả hai vế của || đều đã chạy và đều trả về false, nên bộ đếm thoả mãn trong khi trường hợp true chưa từng được bài test nào tạo ra',
              '100% coverage guarantees correctness, so the function must actually be correct|||Độ phủ 100% bảo đảm tính đúng đắn, nên hàm đó chắc chắn là đúng',
              'Coverage does not measure exported functions, only internal ones|||Độ phủ không đo các hàm được export, chỉ đo hàm nội bộ',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'Of four tests that passed while checking nothing, vitest flagged the two missing awaits, node:test flagged different ones, and expect.assertions(1) caught the never-run callback but NOT the assertion swallowed by try/catch. What is the only reliable proof that a test tests something?|||Trong bốn bài test đậu mà không kiểm gì, vitest tuýt còi hai chỗ thiếu await, node:test tuýt còi những chỗ khác, còn expect.assertions(1) bắt được ca callback không bao giờ chạy nhưng KHÔNG bắt được ca khẳng định bị try/catch nuốt mất. Bằng chứng đáng tin duy nhất rằng một bài test có kiểm thật là gì?',
            options: [
              'A green suite plus a coverage threshold above 90%|||Một bộ test xanh cộng với ngưỡng độ phủ trên 90%',
              'Break the production code on purpose and confirm the test goes red — if it stays green, the test is decoration|||Cố ý phá code production rồi xác nhận bài test đỏ lên — nếu nó vẫn xanh thì bài test đó chỉ là đồ trang trí',
              'Counting the assertions in the file and comparing to the number of tests|||Đếm số khẳng định trong file rồi so với số bài test',
              'Switching to a runner that flags all four cases|||Chuyển sang một bộ chạy tuýt còi được cả bốn trường hợp',
            ],
            correctIndex: 1,
            points: 1,
          },
          {
            question: 'The real CI on this site runs 1m30s to 2m8s, of which the test step is 1,3 seconds — the rest is npm ci and tsc — and the lint step is marked continue-on-error while tsc and npm test are required. Which reading of those two facts is correct?|||CI thật của site này chạy từ 1 phút 30 tới 2 phút 8, trong đó bước chạy test chỉ chiếm 1,3 giây — phần còn lại là npm ci và tsc — còn bước lint được đánh dấu continue-on-error trong khi tsc và npm test là bắt buộc. Cách hiểu nào về hai dữ kiện đó là đúng?',
            options: [
              'The suite is too small; every CI minute should be spent running tests|||Bộ test quá nhỏ; mỗi phút CI đều nên dành cho việc chạy test',
              '"Our tests are too slow for CI" is rarely true at this size, and gates should block only on failures that mean something is wrong rather than untidy — a lint warning blocking a hotfix teaches the team to bypass CI|||"Test của tụi mình chậm quá không đưa lên CI được" hiếm khi đúng ở quy mô này, và chốt chặn chỉ nên chặn ở những lần hỏng mang nghĩa có gì đó sai chứ không phải chưa gọn — một cảnh báo lint chặn được hotfix sẽ dạy cả nhóm cách đi vòng qua CI',
              'Lint should also be required, because code style is part of correctness|||Lint cũng nên để bắt buộc, vì phong cách code là một phần của tính đúng đắn',
              'retry: 3 should be added so intermittent failures stop blocking merges|||Nên thêm retry: 3 để những lần hỏng chập chờn thôi chặn merge',
            ],
            correctIndex: 1,
            points: 1,
          },
        ],
      },
    },
    /* END-LESSONS */
  ],
};
