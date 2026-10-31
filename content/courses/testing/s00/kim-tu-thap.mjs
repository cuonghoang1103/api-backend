/**
 * Testing · Mục 0 · 0.2 — Kim tự tháp test (và chiếc cúp). Slug giữ từ khung: tst-0-1-kim-tu-thap.
 * Số đo: test/do-toc-do.test.js chạy 4 lần (Node 22.23.3, Vitest 5.0.5, Express 5.3.0, Supertest 7.3.1), 31/10–01/11/2026.
 */
import G from '../giang/tst-00-1.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';

const M = {
  app: `
// src/app.js — một API rất nhỏ quanh luật createBooking
import express from 'express';
import { createBooking } from './rules/booking.js';

export function buildApp() {
  const app = express();
  app.use(express.json());
  app.post('/bookings', (req, res) => {
    try {
      const booking = createBooking(req.body);
      res.status(201).json(booking);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  });
  return app;
}
`,
  unit: `
// test/pyramid.unit.test.js
import { it, expect } from 'vitest';
import { checkSlot } from '../src/rules/booking.js';

it('unit: 06:30 is before opening time', () => {
  expect(checkSlot('06:30', '08:00')).toEqual({ ok: false, code: 'OUTSIDE_HOURS' });
});
`,
  api: `
// test/pyramid.api.test.js
import { it, expect } from 'vitest';
import request from 'supertest';
import { buildApp } from '../src/app.js';

it('api: POST /bookings at 06:30 answers 400 OUTSIDE_HOURS', async () => {
  const res = await request(buildApp())
    .post('/bookings')
    .send({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '06:30', end: '08:00' });
  expect(res.status).toBe(400);
  expect(res.body).toEqual({ error: 'OUTSIDE_HOURS' });
});
`,
  pyrOut: `
$ npx vitest run test/pyramid

 ✓ test/pyramid.unit.test.js (1 test) 2ms
   ✓ unit: 06:30 is before opening time 1ms
 ✓ test/pyramid.api.test.js (1 test) 22ms
   ✓ api: POST /bookings at 06:30 answers 400 OUTSIDE_HOURS 21ms

 Test Files  2 passed (2)
      Tests  2 passed (2)
   Duration  226ms (import 63%, transform 19%, tests 14%, worker 3%)
`,
  doTocDo: `
// test/do-toc-do.test.js — 200 lần mỗi kiểu, để thấy chênh lệch
import { it, expect } from 'vitest';
import request from 'supertest';
import { checkSlot } from '../src/rules/booking.js';
import { buildApp } from '../src/app.js';

it('200 unit checks', () => {
  for (let i = 0; i < 200; i++) expect(checkSlot('06:30', '08:00').code).toBe('OUTSIDE_HOURS');
});

it('200 HTTP requests through Express', async () => {
  const app = buildApp();
  for (let i = 0; i < 200; i++) {
    const res = await request(app).post('/bookings')
      .send({ lab: 'BE-201', seats: 20, role: 'STUDENT', start: '06:30', end: '08:00' });
    expect(res.status).toBe(400);
  }
});
`,
  doOut: `
$ npx vitest run test/do-toc-do.test.js

 ✓ test/do-toc-do.test.js (2 tests) 152ms
   ✓ 200 unit checks 3ms
   ✓ 200 HTTP requests through Express 149ms

 Test Files  1 passed (1)
      Tests  2 passed (2)
`,
};

const NGUON = [
  nguon('🔺', 'Martin Fowler — TestPyramid', 'Origin (Mike Cohn, 2009) and why UI-heavy suites become slow and brittle.', 'https://martinfowler.com/bliki/TestPyramid.html'),
  nguon('🏆', 'Kent C. Dodds — The Testing Trophy and Testing Classifications', 'The trophy (6 Feb 2018) and what each layer means.', 'https://kentcdodds.com/blog/the-testing-trophy-and-testing-classifications'),
  nguon('✍️', 'Kent C. Dodds — Write tests. Not too many. Mostly integration.', 'Guillermo Rauch’s 2016 line, explained.', 'https://kentcdodds.com/blog/write-tests'),
].join('\n');

const BANG_DO = `<table>
<thead><tr><th>Run</th><th>200 unit checks</th><th>200 HTTP requests</th></tr></thead>
<tbody>
<tr><td>1</td><td>3 ms</td><td>207 ms</td></tr>
<tr><td>2</td><td>3 ms</td><td>190 ms</td></tr>
<tr><td>3</td><td>3 ms</td><td>187 ms</td></tr>
<tr><td>4</td><td>3 ms</td><td>149 ms</td></tr>
</tbody>
</table>`;

export default {
  title: '0.2 — The test pyramid (and the trophy), measured on LabFlow Lite|||0.2 — Kim tự tháp test (và chiếc cúp), đo thật trên LabFlow Lite',
  slug: 'tst-0-1-kim-tu-thap',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Cùng một luật test ở hai cấp (gọi hàm vs request HTTP qua Express) và đo thật: ~0,015 ms so với ~1 ms mỗi lần; mỗi cấp mua được gì và tốn gì; kim tự tháp của Mike Cohn, dạng sai "cây kem", chiếc cúp của Kent C. Dodds; và kế hoạch đặt test của LabFlow Lite.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>The test pyramid (and the trophy), measured on LabFlow Lite</h2>
<p class="lead">“How many unit tests, how many integration tests, how many end-to-end tests?” Teams argue about this forever. This lesson replaces opinion with a measurement on our own project, then explains the two pictures everyone quotes — so you can choose for your own code.</p>

<h3>The same rule, tested at two levels</h3>
<p>LabFlow’s rule BR-04 says bookings must sit inside opening hours, 07:00–21:00. A tiny Express API wraps the rule (you will write a real one in Chapter 5; here it is just enough to measure):</p>
${ma('javascript', M.app)}
<p>A <strong>unit test</strong> asks the rule directly:</p>
${ma('javascript', M.unit)}
<p>An <strong>API test</strong> asks the same question the way a client would — an HTTP request — using Supertest, which sends requests to an Express app without opening a network port:</p>
${ma('javascript', M.api)}
${ra(M.pyrOut)}
<p>Both are green; both prove 06:30 is rejected. But look at the times on the right: the API test took about ten times longer for one check, and it exercised much more code: JSON parsing, routing, the error handler, the response serialiser. That is both its value (it proves the pieces fit) and its cost (more to run, more that can break).</p>
<div class="callout"><p><strong>Run it yourself after lesson 0.3.</strong> These files need the project from lesson 0.3 plus <code>npm install express@5</code> and <code>npm install --save-dev supertest@7</code>. Lesson 0.3 sets it up step by step.</p></div>

<h3>Measuring the difference properly</h3>
<p>One run of one test proves little — timings include warm-up. So we repeat each check 200 times:</p>
${ma('javascript', M.doTocDo)}
${ra(M.doOut)}
<p>Four runs on the same laptop:</p>
${BANG_DO}
<p>About <strong>0.015 ms</strong> per unit check against <strong>0.75–1 ms</strong> per HTTP check — fifty to seventy times slower, and this is the <em>cheapest</em> kind of HTTP test: same process, no database, no browser. Add a real PostgreSQL (Chapter 4) or a real browser (Chapter 7) and the gap grows; those chapters measure it. At these rates, 2,000 unit checks need about 30 ms, 2,000 HTTP checks about 2 seconds.</p>

<h3>What each level buys and costs</h3>
<table>
<thead><tr><th></th><th>Unit</th><th>Integration / API</th><th>End-to-end</th></tr></thead>
<tbody>
<tr><td>Speed</td><td>Microseconds to milliseconds</td><td>Milliseconds to seconds</td><td>Seconds per test</td></tr>
<tr><td>What a green test proves</td><td>This function behaves</td><td>The parts fit together</td><td>A user can complete the job</td></tr>
<tr><td>When it is red, you know</td><td>The exact line</td><td>Which join, query or route</td><td>“Something on this page”</td></tr>
<tr><td>Breaks for unrelated reasons</td><td>Rarely</td><td>Sometimes (data, ports, config)</td><td>Often (timing, layout, network)</td></tr>
<tr><td>Cost to write and maintain</td><td>Low</td><td>Medium</td><td>High</td></tr>
</tbody>
</table>
<p>No level is “best”. Higher levels are closer to the truth the user lives, and slower, flakier and harder to diagnose.</p>

<h3>The test pyramid</h3>
<p>Mike Cohn popularised the pyramid in <em>Succeeding with Agile</em> (2009); Martin Fowler notes he first drew it with Lisa Crispin around 2003–04. Its width is the <strong>number</strong> of tests: a wide base of fast unit tests, a smaller layer of integration/service tests, a thin top of end-to-end UI tests. It is a rule about <strong>proportion</strong>, not about skipping layers — a pyramid with no top is just a pile of unit tests that never checks the pieces fit.</p>
<div class="pitfall co-tieu-de">
<p><strong>The anti-pattern — the ice-cream cone.</strong> Flip the pyramid and put manual clicking on top: most checks are UI tests, often recorded with capture/replay, with few unit tests underneath. The suite takes forty minutes, fails “randomly”, nobody knows which line broke, people re-run until green, and finally tests get switched off one by one. The cure is always the same: push each check <em>down</em> to the lowest level that can catch it.</p>
</div>

<h3>The testing trophy</h3>
<p>In February 2018 Kent C. Dodds drew a trophy for JavaScript applications: <strong>static</strong> analysis at the base (ESLint, TypeScript catch typos and type errors for free), then unit tests, then a <strong>large integration layer</strong>, then a small end-to-end cup. His argument is return on investment: integration tests resemble real use closely enough to give real confidence, yet run fast enough to run all the time. He builds on Guillermo Rauch’s 2016 line: <em>“Write tests. Not too many. Mostly integration.”</em></p>
<p>The pyramid and the trophy agree on more than people think: both want few end-to-end tests, fast feedback, tests of behaviour rather than private details, and every check at the cheapest level that can catch it. They differ on the size of the middle, and on vocabulary — for Dodds a “unit” is often one behaviour with its real helpers, for others it is one function in isolation. Do not pick a side; pick by the shape of your code.</p>
<ul>
<li><strong>Rule-heavy code</strong> (LabFlow’s booking rules, money calculations): many input combinations, pure logic → many unit tests.</li>
<li><strong>Glue code</strong> (routes, controllers, React screens): little logic, many connections → integration tests give more for less.</li>
</ul>

<h3>Where LabFlow Lite’s tests will live</h3>
<table>
<thead><tr><th>What to check</th><th>Level</th><th>Why there</th></tr></thead>
<tbody>
<tr><td>30-minute grid, 14 days ahead, 30 seats</td><td>Unit (Chapter 1)</td><td>Pure rules with many boundary values</td></tr>
<tr><td>Cancel ≥ 1 hour before, lock after 5 failed logins</td><td>Unit with a fake clock (Chapter 2)</td><td>Time must be controlled</td></tr>
<tr><td>No two bookings overlap in one lab</td><td>Integration with PostgreSQL (Chapter 4)</td><td>Only a real database proves the constraint</td></tr>
<tr><td>401 vs 403, validation errors, JSON shape</td><td>API (Chapter 5)</td><td>HTTP is the contract with clients</td></tr>
<tr><td>The booking form shows an error under the time field</td><td>Component (Chapter 6)</td><td>What the user sees</td></tr>
<tr><td>Log in → book → see it in “My bookings”</td><td>End-to-end (Chapter 7)</td><td>One journey people actually pay for</td></tr>
</tbody>
</table>

<h3>Rules of thumb</h3>
<ol>
<li>A <strong>rule</strong> gets unit tests — every boundary, every decision-table row.</li>
<li>A <strong>join</strong> (code ↔ database, client ↔ API) gets an integration test.</li>
<li>A <strong>journey</strong> users pay for gets one end-to-end test — not every button.</li>
<li>When an end-to-end test catches a bug, add the lower-level test that would have caught it sooner.</li>
<li>A slow or flaky test is a bug in the suite: fix it or move it down.</li>
</ol>

<h3>🧪 Practice (15 minutes)</h3>
<div class="callout ok">
<p>Place each test at a level (unit · integration · API · component · end-to-end), and write one reason. Then compare with the answers below.</p>
<ol>
<li><code>formatTime(450)</code> returns <code>'07:30'</code>.</li>
<li>Two students cannot book BE-201 for the same time.</li>
<li><code>GET /bookings</code> without a token answers 401.</li>
<li>A booking 14 days ahead is accepted.</li>
<li>The form shows “outside opening hours” under the time field.</li>
<li>A lecturer logs in, books a lab and sees it on “My bookings”.</li>
<li>A 31-seat student booking is stored as <code>PENDING</code> in PostgreSQL.</li>
<li>The page title is exactly “LabFlow Lite”.</li>
</ol>
<p><strong>Answers.</strong> 1 unit (pure function). 2 integration — two concurrent writers and a database constraint; a unit test cannot prove what the database enforces. 3 API — it is about the HTTP contract. 4 unit — a boundary of BR-05. 5 component — what the user sees, no server needed. 6 end-to-end — a whole journey across UI, API and database. 7 integration (or an API test with a real database) — the rule is unit-tested already; what is new here is that the stored row is right. 8 probably <em>no dedicated test</em>: cheap to see, cheap to fix, low risk; if you want it, add one assertion to the end-to-end journey rather than a new test.</p>
<p><strong>Done when:</strong> at least 6 of your 8 match, and for any mismatch you can explain which level is cheaper and still catches the problem.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test pyramid</span><span class="v">Many unit tests, fewer integration tests, few end-to-end tests — a rule about proportion.</span></div>
  <div class="kv"><span class="k">ice-cream cone</span><span class="v">The upside-down anti-pattern: mostly UI and manual tests, few unit tests.</span></div>
  <div class="kv"><span class="k">testing trophy</span><span class="v">Static checks, unit, a large integration layer, little end-to-end (Kent C. Dodds, 2018).</span></div>
  <div class="kv"><span class="k">Supertest</span><span class="v">A library that sends HTTP requests to an Express app inside the test process.</span></div>
  <div class="kv"><span class="k">static analysis</span><span class="v">Checks that read code without running it: ESLint, the TypeScript compiler.</span></div>
  <div class="kv"><span class="k">flaky test</span><span class="v">A test that sometimes passes and sometimes fails without any code change.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>The same rule at two levels: about 0.015 ms per unit check vs 0.75–1 ms per HTTP check, measured four times.</li>
<li>Higher levels give more realistic confidence but are slower, flakier and harder to diagnose.</li>
<li>The pyramid is about proportion: many unit, some integration, few end-to-end tests.</li>
<li>The ice-cream cone (mostly UI and manual) leads to slow, distrusted, abandoned suites.</li>
<li>The trophy adds static checks and a bigger integration layer; it shares the pyramid’s spirit.</li>
<li>Rule → unit, join → integration, journey → end-to-end.</li>
</ul>

<h3>📚 Sources</h3>
${NGUON}
${lienKet({ bai: 'swt301-ci-automation', title: 'Also in SWT301 — lesson 8.6: Test pyramid, CI and Selenium', sub: 'Same: Mike Cohn’s pyramid, the ice-cream-cone anti-pattern, mapping pyramid layers to ISTQB test levels. Different: SWT301 explains it in theory for the exam and a Java project; here you measure the speed gap on a running Node API and add the testing trophy.', cta: 'OPEN SWT301 LESSON →' })}
${lienKet({ bai: 'swt301-test-levels', title: 'Also in SWT301 — lesson 2.2: Component and integration testing, stubs and drivers', sub: 'Same: the levels of testing — component (unit) and integration. Different: SWT301 uses ISTQB vocabulary (component, component-integration, system-integration, stub, driver); this lesson places LabFlow Lite’s concrete tests on those levels.', cta: 'OPEN SWT301 LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Kim tự tháp test (và chiếc cúp), đo thật trên LabFlow Lite</h2>
<p class="lead">"Bao nhiêu unit test, bao nhiêu test tích hợp, bao nhiêu test đầu-cuối?" Các đội cãi nhau chuyện này mãi không dứt. Bài này thay ý kiến bằng một phép đo trên chính dự án của ta, rồi giải thích hai bức hình ai cũng trích — để bạn tự chọn cho code của mình.</p>

<h3>Cùng một luật, test ở hai cấp</h3>
<p>Luật BR-04 của LabFlow nói lượt đặt phải nằm trong giờ mở cửa 07:00–21:00. Một API Express rất nhỏ bọc quanh luật này (Chương 5 bạn sẽ viết API thật; ở đây chỉ vừa đủ để đo):</p>
${ma('javascript', M.app)}
<p>Một <strong>unit test (test đơn vị)</strong> hỏi thẳng luật:</p>
${ma('javascript', M.unit)}
<p>Một <strong>test API</strong> hỏi đúng câu đó theo cách một client hỏi — bằng request HTTP — dùng Supertest, thư viện gửi request tới ứng dụng Express mà không cần mở cổng mạng:</p>
${ma('javascript', M.api)}
${ra(M.pyrOut)}
<p>Cả hai đều xanh; cả hai đều chứng minh 06:30 bị từ chối. Nhưng nhìn thời gian ở bên phải: test API mất khoảng gấp mười lần cho một lần kiểm, và nó chạy qua nhiều code hơn hẳn: đọc JSON, định tuyến, bộ xử lý lỗi, chuyển object thành JSON trả về. Đó vừa là giá trị của nó (chứng minh các mảnh khớp nhau) vừa là cái giá (chạy lâu hơn, nhiều chỗ có thể hỏng hơn).</p>
<div class="callout"><p><strong>Tự chạy sau bài 0.3.</strong> Các file này cần dự án tạo ở bài 0.3, cộng <code>npm install express@5</code> và <code>npm install --save-dev supertest@7</code>. Bài 0.3 hướng dẫn từng bước.</p></div>

<h3>Đo chênh lệch cho đàng hoàng</h3>
<p>Chạy một test một lần thì chưa nói được gì — thời gian còn lẫn phần "khởi động". Nên ta lặp mỗi kiểu 200 lần:</p>
${ma('javascript', M.doTocDo)}
${ra(M.doOut)}
<p>Bốn lần chạy trên cùng một máy:</p>
${BANG_DO}
<p>Khoảng <strong>0,015 ms</strong> mỗi lần kiểm bằng unit so với <strong>0,75–1 ms</strong> mỗi lần kiểm qua HTTP — chậm hơn năm mươi tới bảy mươi lần, và đây mới là loại test HTTP <em>rẻ nhất</em>: cùng tiến trình, không cơ sở dữ liệu, không trình duyệt. Thêm PostgreSQL thật (Chương 4) hay trình duyệt thật (Chương 7) thì khoảng cách còn lớn nữa; các chương đó sẽ đo. Với tốc độ này, 2.000 lần kiểm unit cần khoảng 30 ms, còn 2.000 lần kiểm HTTP cần khoảng 2 giây.</p>

<h3>Mỗi cấp mua được gì, tốn gì</h3>
<table>
<thead><tr><th></th><th>Unit</th><th>Tích hợp / API</th><th>Đầu-cuối</th></tr></thead>
<tbody>
<tr><td>Tốc độ</td><td>Micro-giây tới mili-giây</td><td>Mili-giây tới giây</td><td>Vài giây mỗi test</td></tr>
<tr><td>Test xanh chứng minh</td><td>Hàm này chạy đúng</td><td>Các phần khớp với nhau</td><td>Người dùng làm xong được việc</td></tr>
<tr><td>Khi đỏ, bạn biết</td><td>Đúng dòng hỏng</td><td>Chỗ nối, câu truy vấn hay route nào</td><td>"Có gì đó trên trang này"</td></tr>
<tr><td>Hỏng vì lý do không liên quan</td><td>Hiếm</td><td>Thỉnh thoảng (dữ liệu, cổng, cấu hình)</td><td>Thường xuyên (thời gian, bố cục, mạng)</td></tr>
<tr><td>Chi phí viết và bảo trì</td><td>Thấp</td><td>Vừa</td><td>Cao</td></tr>
</tbody>
</table>
<p>Không cấp nào "tốt nhất". Cấp càng cao càng gần sự thật mà người dùng trải qua, nhưng cũng chậm hơn, chập chờn hơn và khó chẩn đoán hơn.</p>

<h3>Kim tự tháp test</h3>
<p>Mike Cohn phổ biến kim tự tháp trong sách <em>Succeeding with Agile</em> (2009); Martin Fowler kể rằng ông vẽ nó lần đầu cùng Lisa Crispin khoảng 2003–04. Bề rộng của nó là <strong>số lượng</strong> test: đáy rộng gồm nhiều unit test nhanh, tầng giữa ít hơn gồm test tích hợp/dịch vụ, đỉnh mỏng gồm test giao diện đầu-cuối. Đó là luật về <strong>tỉ lệ</strong>, không phải luật bỏ tầng — kim tự tháp không có đỉnh chỉ là một đống unit test chẳng bao giờ kiểm các mảnh có khớp nhau không.</p>
<div class="pitfall co-tieu-de">
<p><strong>Dạng sai — "cây kem ốc quế" (ice-cream cone).</strong> Lật ngược kim tự tháp và đặt việc bấm tay lên trên: phần lớn phép kiểm là test giao diện, thường ghi lại bằng công cụ capture/replay, rất ít unit test bên dưới. Bộ test chạy mất bốn mươi phút, hỏng "ngẫu nhiên", không ai biết dòng nào sai, người ta chạy lại tới khi xanh, và cuối cùng tắt từng test một. Cách chữa luôn như nhau: đẩy mỗi phép kiểm <em>xuống</em> cấp thấp nhất còn bắt được nó.</p>
</div>

<h3>Chiếc cúp (testing trophy)</h3>
<p>Tháng 2/2018, Kent C. Dodds vẽ một chiếc cúp cho ứng dụng JavaScript: đế là <strong>kiểm tra tĩnh (static analysis)</strong> (ESLint, TypeScript bắt lỗi gõ và lỗi kiểu miễn phí), rồi unit test, rồi một <strong>tầng tích hợp lớn</strong>, rồi một chén đầu-cuối nhỏ. Lý lẽ của ông là "lãi trên vốn bỏ ra": test tích hợp đủ giống cách dùng thật để cho niềm tin thật, mà vẫn đủ nhanh để chạy liên tục. Ông dựa trên câu năm 2016 của Guillermo Rauch: <em>"Hãy viết test. Đừng quá nhiều. Chủ yếu là tích hợp."</em></p>
<p>Kim tự tháp và chiếc cúp đồng ý với nhau nhiều hơn người ta tưởng: cả hai đều muốn ít test đầu-cuối, phản hồi nhanh, test hành vi chứ không test chi tiết riêng tư, và mỗi phép kiểm ở cấp rẻ nhất bắt được nó. Chúng khác nhau ở độ to của tầng giữa, và ở từ ngữ — với Dodds "unit" thường là một hành vi cùng các hàm phụ thật của nó, với người khác thì là một hàm đứng riêng. Đừng chọn phe; hãy chọn theo hình dạng code của bạn.</p>
<ul>
<li><strong>Code nhiều luật</strong> (luật đặt phòng LabFlow, tính tiền): nhiều tổ hợp đầu vào, logic thuần → nhiều unit test.</li>
<li><strong>Code "keo dán"</strong> (route, controller, màn hình React): ít logic, nhiều chỗ nối → test tích hợp cho nhiều hơn với ít công hơn.</li>
</ul>

<h3>Test của LabFlow Lite sẽ nằm ở đâu</h3>
<table>
<thead><tr><th>Cần kiểm</th><th>Cấp</th><th>Vì sao ở đó</th></tr></thead>
<tbody>
<tr><td>Lưới 30 phút, trước 14 ngày, 30 chỗ</td><td>Unit (Chương 1)</td><td>Luật thuần với nhiều giá trị biên</td></tr>
<tr><td>Huỷ trước ≥ 1 giờ, khoá sau 5 lần sai mật khẩu</td><td>Unit với đồng hồ giả (Chương 2)</td><td>Thời gian phải được kiểm soát</td></tr>
<tr><td>Không hai lượt đặt nào trùng giờ trong một phòng</td><td>Tích hợp với PostgreSQL (Chương 4)</td><td>Chỉ cơ sở dữ liệu thật mới chứng minh được ràng buộc</td></tr>
<tr><td>401 khác 403, lỗi kiểm dữ liệu, hình dạng JSON</td><td>API (Chương 5)</td><td>HTTP là hợp đồng với client</td></tr>
<tr><td>Form đặt phòng hiện lỗi dưới ô giờ</td><td>Component (Chương 6)</td><td>Thứ người dùng nhìn thấy</td></tr>
<tr><td>Đăng nhập → đặt phòng → thấy trong "Lượt đặt của tôi"</td><td>Đầu-cuối (Chương 7)</td><td>Một hành trình người dùng thật sự cần</td></tr>
</tbody>
</table>

<h3>Kinh nghiệm dùng được ngay</h3>
<ol>
<li><strong>Luật</strong> thì unit test — mọi giá trị biên, mọi dòng của bảng quyết định.</li>
<li><strong>Chỗ nối</strong> (code ↔ cơ sở dữ liệu, client ↔ API) thì test tích hợp.</li>
<li><strong>Hành trình</strong> người dùng cần thì một test đầu-cuối — không phải mỗi nút một test.</li>
<li>Khi test đầu-cuối bắt được lỗi, thêm test cấp thấp hơn mà lẽ ra đã bắt được nó sớm hơn.</li>
<li>Test chậm hay chập chờn là lỗi của bộ test: sửa nó, hoặc chuyển nó xuống cấp thấp hơn.</li>
</ol>

<h3>🧪 Thực hành (15 phút)</h3>
<div class="callout ok">
<p>Xếp mỗi test vào một cấp (unit · tích hợp · API · component · đầu-cuối), kèm một lý do. Rồi so với đáp án bên dưới.</p>
<ol>
<li><code>formatTime(450)</code> trả về <code>'07:30'</code>.</li>
<li>Hai sinh viên không thể đặt BE-201 cùng một khung giờ.</li>
<li><code>GET /bookings</code> không kèm token thì trả 401.</li>
<li>Lượt đặt trước 14 ngày được chấp nhận.</li>
<li>Form hiện "outside opening hours" dưới ô giờ.</li>
<li>Một giảng viên đăng nhập, đặt phòng, và thấy nó trong "Lượt đặt của tôi".</li>
<li>Lượt đặt 31 chỗ của sinh viên được lưu với trạng thái <code>PENDING</code> trong PostgreSQL.</li>
<li>Tiêu đề trang đúng là "LabFlow Lite".</li>
</ol>
<p><strong>Đáp án.</strong> 1 unit (hàm thuần). 2 tích hợp — hai người ghi cùng lúc và một ràng buộc của cơ sở dữ liệu; unit test không chứng minh được thứ mà database cưỡng chế. 3 API — đây là chuyện hợp đồng HTTP. 4 unit — một giá trị biên của BR-05. 5 component — thứ người dùng thấy, không cần máy chủ. 6 đầu-cuối — cả hành trình qua giao diện, API và database. 7 tích hợp (hoặc test API có database thật) — bản thân luật đã có unit test; cái mới ở đây là dòng được lưu có đúng không. 8 có lẽ <em>không cần test riêng</em>: nhìn là thấy, sửa thì rẻ, rủi ro thấp; nếu muốn, thêm một câu khẳng định vào test hành trình đầu-cuối thay vì viết test mới.</p>
<p><strong>Đạt khi:</strong> ít nhất 6/8 câu khớp, và với câu lệch, bạn giải thích được cấp nào rẻ hơn mà vẫn bắt được vấn đề.</p>
</div>

<h3>🗂 Thuật ngữ trong bài</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">test pyramid (kim tự tháp test)</span><span class="v">Nhiều unit test, ít test tích hợp hơn, rất ít test đầu-cuối — một luật về tỉ lệ.</span></div>
  <div class="kv"><span class="k">ice-cream cone (cây kem ốc quế)</span><span class="v">Dạng sai lộn ngược: phần lớn là test giao diện và test tay, rất ít unit test.</span></div>
  <div class="kv"><span class="k">testing trophy (chiếc cúp)</span><span class="v">Kiểm tra tĩnh, unit, tầng tích hợp lớn, ít đầu-cuối (Kent C. Dodds, 2018).</span></div>
  <div class="kv"><span class="k">Supertest</span><span class="v">Thư viện gửi request HTTP tới ứng dụng Express ngay trong tiến trình chạy test.</span></div>
  <div class="kv"><span class="k">static analysis (phân tích tĩnh)</span><span class="v">Kiểm tra đọc code mà không chạy nó: ESLint, trình biên dịch TypeScript.</span></div>
  <div class="kv"><span class="k">flaky test (test chập chờn)</span><span class="v">Test lúc đạt lúc hỏng dù code không hề đổi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Cùng một luật ở hai cấp: khoảng 0,015 ms mỗi lần kiểm unit so với 0,75–1 ms mỗi lần kiểm HTTP, đo bốn lần.</li>
<li>Cấp cao cho niềm tin gần thực tế hơn nhưng chậm hơn, chập chờn hơn, khó chẩn đoán hơn.</li>
<li>Kim tự tháp nói về tỉ lệ: nhiều unit, vừa phải tích hợp, ít đầu-cuối.</li>
<li>"Cây kem" (chủ yếu giao diện và test tay) dẫn tới bộ test chậm, mất lòng tin, rồi bị bỏ.</li>
<li>Chiếc cúp thêm kiểm tra tĩnh và tầng tích hợp to hơn; cùng tinh thần với kim tự tháp.</li>
<li>Luật → unit, chỗ nối → tích hợp, hành trình → đầu-cuối.</li>
</ul>

<h3>📚 Nguồn</h3>
${NGUON}
${lienKet({ bai: 'swt301-ci-automation', title: 'Đã gặp ở SWT301 — bài 8.6: Test pyramid, CI và Selenium', sub: 'Giống: kim tự tháp của Mike Cohn, dạng sai "cây kem", ánh xạ các tầng sang cấp test ISTQB. Khác: SWT301 giải thích lý thuyết để thi và trên dự án Java; ở đây bạn đo khoảng cách tốc độ trên một API Node đang chạy và học thêm chiếc cúp.', cta: 'MỞ BÀI SWT301 →' })}
${lienKet({ bai: 'swt301-test-levels', title: 'Đã gặp ở SWT301 — bài 2.2: Component và integration testing, stub và driver', sub: 'Giống: các cấp test — component (unit) và tích hợp. Khác: SWT301 dùng từ vựng ISTQB (component, component-integration, system-integration, stub, driver); bài này đặt các test cụ thể của LabFlow Lite vào đúng những cấp đó.', cta: 'MỞ BÀI SWT301 →' })}
</div>
`,
};
