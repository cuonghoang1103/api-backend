/**
 * Testing · Chương 10 · 10.4 — Câu hỏi phỏng vấn về testing. Slug giữ từ khung: tst-10-4-phong-van.
 * Mỗi câu: người phỏng vấn thật sự kiểm gì → câu trả lời yếu → câu trả lời mạnh có SỐ ĐO của chính khoá này (ghi bài) + đánh đổi.
 * Mọi con số lấy từ output chạy thật của Mục 0 – Chương 10 (mô tả bài + sNN/_ma.mjs); không có số nào ước chừng.
 * Live coding 20 phút: mergeBusy (src/rules/busy.js); bài làm yếu 2 test xanh diệt 0/6, bài mẫu 8 test diệt 6/6
 * (demo10/phong-van/cham.mjs — 6 bug thật). Output ở ./_ma.mjs (104-*, 101-splice, 103-retry-*, 102-mut-*).
 */
import G from '../giang/tst-10-4.mjs';
import { ma, ra, lienKet, nguon } from '../_slides.mjs';
import { CODE, OUT } from './_ma.mjs';

const loc = (t, re) => t.split('\n').filter((l) => re.test(l)).join('\n');
const RETRY = loc(OUT['103-retry-khong'] + '\n' + OUT['103-retry-co'], /^\$ |red in/);
const LEGACY = loc(OUT['102-mut-3'] + '\n' + OUT['102-mut-4'], /changes caught/);
const YEU_RUN = loc(OUT['104-yeu'], /^\$ |Tests {2}/);
const MAU_RUN = loc(OUT['104-mau'], /^\$ |Tests {2}/);
const CHAM_YEU = OUT['104-cham-yeu'];
const CHAM_MAU = OUT['104-cham-mau'];

const FLOW_EN = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Clarify</div><div class="lz-d">one short question if the scope is unclear</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Claim</div><div class="lz-d">your answer in one sentence, first</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Evidence</div><div class="lz-d">one number you measured, and where</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Trade-off</div><div class="lz-d">what it costs, when you would choose differently</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Stop</div><div class="lz-d">60–90 seconds; let them ask the follow-up</div></div>
</div>`;
const FLOW_VI = `<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Làm rõ</div><div class="lz-d">một câu hỏi ngắn nếu phạm vi chưa rõ</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Khẳng định</div><div class="lz-d">câu trả lời trong một câu, nói trước</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Bằng chứng</div><div class="lz-d">một con số bạn đã đo, và đo ở đâu</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Đánh đổi</div><div class="lz-d">nó tốn gì, khi nào bạn chọn khác</div></div>
  <div class="lz-step"><div class="lz-k">5</div><div class="lz-t">Dừng</div><div class="lz-d">60–90 giây; để họ hỏi câu tiếp</div></div>
</div>`;

const LICH_EN = `<table>
<thead><tr><th>Minutes</th><th>Do</th><th>Say aloud</th></tr></thead>
<tbody>
<tr><td>0–3</td><td>ask; write the answers as a comment</td><td>“Touching merges? Input sorted? May I change the array?”</td></tr>
<tr><td>3–5</td><td>a test list: empty, separate, overlap, touching, inside, unsorted, input unchanged, bad time</td><td>“Happy path first, then the boundaries.”</td></tr>
<tr><td>5–12</td><td>the first two tests; run them</td><td>“Sorted by start, then the last block grows.”</td></tr>
<tr><td>12–16</td><td>the boundaries as one <code>it.each</code> table</td><td>“Touching is the off-by-one: &lt;= or &lt;.”</td></tr>
<tr><td>16–20</td><td>run, read every line; say what is missing</td><td>“No test for an end before the start — can that happen?”</td></tr>
</tbody></table>`;
const LICH_VI = `<table>
<thead><tr><th>Phút</th><th>Làm</th><th>Nói to</th></tr></thead>
<tbody>
<tr><td>0–3</td><td>hỏi; ghi câu trả lời thành chú thích</td><td>“Chạm nhau có gộp? Đầu vào đã sắp? Được sửa mảng không?”</td></tr>
<tr><td>3–5</td><td>danh sách test: rỗng, rời, chồng, chạm, nằm trong, chưa sắp, không sửa đầu vào, giờ sai</td><td>“Đường đi đẹp trước, rồi tới các biên.”</td></tr>
<tr><td>5–12</td><td>hai test đầu; chạy</td><td>“Sắp theo giờ bắt đầu, rồi nới khối cuối.”</td></tr>
<tr><td>12–16</td><td>các biên thành một bảng <code>it.each</code></td><td>“Chạm nhau là chỗ lệch một: &lt;= hay &lt;.”</td></tr>
<tr><td>16–20</td><td>chạy, đọc từng dòng; nói còn thiếu gì</td><td>“Chưa có test giờ kết thúc trước giờ bắt đầu — chuyện đó có xảy ra không?”</td></tr>
</tbody></table>`;

const NGUON = [
  nguon('🔺', 'Martin Fowler (Ham Vocke) — The Practical Test Pyramid', 'What each layer is for, and how to keep the top small.', 'https://martinfowler.com/articles/practical-test-pyramid.html'),
  nguon('🎭', 'Martin Fowler — Mocks Aren’t Stubs', 'Classicist vs mockist testing, state vs behaviour verification.', 'https://martinfowler.com/articles/mocksArentStubs.html'),
  nguon('🎤', 'Tech Interview Handbook — Coding interview techniques', 'Clarify first, think aloud, test your code before you say “done”.', 'https://www.techinterviewhandbook.org/coding-interview-techniques/'),
].join('\n');

export default {
  title: '10.4 — Testing interview questions|||10.4 — Câu hỏi phỏng vấn về testing',
  slug: 'tst-10-4-phong-van',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Mười một câu hỏi testing hay gặp ở vòng thực tập/junior — unit test, kim tự tháp và chiếc cúp, mock/stub/spy/fake, test một endpoint đặt phòng, CSDL thật hay giả, độ phủ và mutation, test chập chờn và retry, TDD, code cũ, bộ test chậm và CI, kể dự án theo STAR — mỗi câu có điều người phỏng vấn thật sự kiểm, câu trả lời yếu và câu trả lời mạnh dẫn số đo của chính khoá (ghi bài); rồi một vòng live coding 20 phút (mergeBusy) chấm bằng 6 bug thật: bài yếu 2 test xanh diệt 0/6, bài mẫu 8 test diệt 6/6.',
  content: `
${G}
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.4</span>
<h2>Testing interview questions</h2>
<p class="lead">Testing questions in interviews are rarely about definitions: they ask whether you have watched a test suite lie and fixed it. You have, for nine chapters. This lesson turns those measurements into answers.</p>
<p><strong>After this lesson you can</strong> answer the eleven testing questions that come up most for intern and junior roles in 60–90 seconds each, back every claim with a number and the lesson where you measured it, name the trade-off before you are asked, and pass a 20-minute live-coding round. <strong>Why it is useful:</strong> “I know unit tests” sounds like every CV; “retry turned 17 red runs in 50 into 0 while the bug stayed” sounds like experience.</p>

<h3>How to answer any testing question</h3>
${FLOW_EN}
<div class="pitfall co-tieu-de"><strong>Never quote a number you cannot back.</strong> The follow-up is “how did you measure that?” — “I read it somewhere” sinks the answer. Better: measure it on your own project.</div>

<h3>Fundamentals</h3>
<h4>1. Why write tests? What is a unit test?</h4>
<p><em>Checking:</em> tests as a tool, or as homework? <strong>Weak:</strong> “Tests make sure there are no bugs.” <strong>Strong:</strong> “Tests let a team change code without fear. A unit test runs logic in memory, so it is cheap: in lesson 0.1 one rule cost 0.015 ms per check as a call, 0.75–1 ms through HTTP. But it cannot see the wiring, so a few tests sit above it.”</p>
<h4>2. Test pyramid or testing trophy?</h4>
<p><em>Checking:</em> reasoning about cost and confidence. <strong>Weak:</strong> “70% unit, 20% integration, 10% e2e.” <strong>Strong:</strong> “The pyramid says cost grows as you go up; the trophy says integration buys the most confidence per test. In lesson 8.4: 100 unit tests 1.1 s, component 2.7 s, integration 3.7 s, e2e 9.6 s. But the shape follows the risk: the double booking only showed on real PostgreSQL (4.1).”</p>
<h4>3. Mock, stub, spy, fake — and when do you mock?</h4>
<p><em>Checking:</em> have you been burned by a mock? <strong>Weak:</strong> “All fake objects; I mock everything so tests are fast.” <strong>Strong:</strong> “Stub: canned answers; spy: records calls; mock: checks expected calls; fake: a small working version, like an in-memory repository (3.1). In lesson 10.1 a bug in that repository — <code>remove</code> returned an array — left the mockist test green and turned the classicist test red. So I mock what I do not own — mail, the clock — and use fakes inside.”</p>
<h4>4. How would you test POST /bookings?</h4>
<p><em>Checking:</em> splitting one feature across layers. <strong>Weak:</strong> “Call it in Postman and check for 200.” <strong>Strong:</strong> “Rules as unit tests with boundary values (1.4). The endpoint with Supertest: 201 with Location, 400 for a malformed body but 422 for a broken rule (5.3), 401 without a valid token, 403 for the wrong role, 404 for another student’s booking — IDOR (5.2). A contract test: renaming <code>start</code> left a status-only test green (5.4). Overlap on real PostgreSQL: 23P01 becomes OVERLAP (4.1).”</p>

<h3>Quality of a test suite</h3>
<h4>5. Real database or a mocked one?</h4>
<p><em>Checking:</em> which bugs only a real database shows. <strong>Weak:</strong> “Mock it, it is faster.” <strong>Strong:</strong> “Repository on real PostgreSQL, services on a fake. Lesson 4.1: SQLite accepted text in an INTEGER column where PostgreSQL refused (22P02). Testcontainers: ready in 1.2–2.1 s (4.3). Cost: Docker in CI.”</p>
<h4>6. Is 80% (or 100%) coverage enough?</h4>
<p><em>Checking:</em> what coverage cannot see. <strong>Weak:</strong> “100% means everything is tested.” <strong>Strong:</strong> “Coverage shows what ran, not what was checked. In lesson 8.1 a suite of <code>toBeDefined</code> checks reached 100% on all four metrics with two planted bugs still green; Stryker killed 41.49% of mutants on it (8.2). Mutation is slow — 10.531 s against 0.768 s — so it runs at night.”</p>
<h4>7. How do you deal with flaky tests?</h4>
<p><em>Checking:</em> will you hide them with retry? <strong>Weak:</strong> “Add a retry, CI is just slow.” <strong>Strong:</strong> “Same code, different result. Lesson 8.3 reproduced five causes, up to a real race (33/100). Retry hides: 17 red runs in 50 became 0 while the double booking stayed. In 10.3 random test ids were red 10 times in 30, and <code>retry: 3</code> made it 0. I reproduce with a seed, quarantine with an owner (9.3), fix the cause, prove it with 100 shuffled runs.”</p>
${ra(RETRY)}

<h3>Real work</h3>
<h4>8. Do you do TDD?</h4>
<p><em>Checking:</em> honesty more than dogma. <strong>Weak:</strong> “Yes, always.” — then “show me” has no answer. <strong>Strong:</strong> “For rules with clear inputs and outputs, yes. The 10.1 waitlist took six red-green steps; Stryker scored it 100% (45/45). For a UI I spike, throw it away, then test.”</p>
<h4>9. You inherit code with no tests. What do you do?</h4>
<p><em>Checking:</em> will you rewrite it on day one? <strong>Weak:</strong> “Rewrite it cleanly, then test.” <strong>Strong:</strong> “Pin what it does with characterization tests, then refactor under them — Michael Feathers. In lesson 10.2 three sample rows covered 96.42% of lines yet caught 3 of 10 planted changes; rows that reach every branch caught 10 of 10, then my own refactoring slip.”</p>
${ra(LEGACY)}
<h4>10. The suite is slow and CI lets red code through. Where do you start?</h4>
<p><em>Checking:</em> measure first. <strong>Weak:</strong> “More workers, and careful reviews.” <strong>Strong:</strong> “In lesson 8.4 parallel workers hid slowness (6.14 s against 11.07 s serial); fixing the causes took them to 210 ms. In CI: <code>npm ci</code> with the npm cache, 49.6 s to 15.0 s (9.1), one required gate <code>ci-ok</code> with <code>if: always()</code> (9.3).”</p>
<h4>11. Tell me how you tested your project.</h4>
<p><em>Checking:</em> a real story with your part and a result. <strong>Weak:</strong> “We tested manually before the demo.” <strong>Strong</strong> (STAR): “<em>Situation:</em> a lab-booking API. <em>Task:</em> I owned the tests. <em>Action:</em> boundary tables, Supertest with an OpenAPI contract, real PostgreSQL, browser journeys, one required CI check. <em>Result:</em> 229 unit tests in under a second, 98.99% mutation score on the rules.” Use your own project’s numbers.</p>
<div class="pitfall co-tieu-de"><strong>“I always do TDD” and “we have 100% coverage” are traps you set for yourself.</strong> Each invites “show me the red step” or “how many mutants survive?”. A narrow claim — “TDD for rules, not for UI” — sounds more senior.</div>

<h3>The 20-minute live-coding round</h3>
<p>A common format: a small function, 20 minutes, write tests while you talk. This one comes from LabFlow Lite: merge one lab’s bookings for a day into busy blocks. You get the spec and a working implementation; your job is the tests.</p>
${ma('javascript', CODE.busy)}
${LICH_EN}
<p><strong>A weak answer</strong> after 20 minutes — two tests, both green:</p>
${ma('javascript', CODE.ungVienYeu)}
${ra(YEU_RUN)}
<p>The interviewer plants six real bugs, one at a time, and runs the tests again — the idea behind every Lab of this course:</p>
${ra(CHAM_YEU)}
<p>Zero of six: <code>result.length</code> is 1 even when the block ends at the wrong time, and <code>toBeTruthy()</code> is true for any array. The model answer is the solution of the practice below: it catches all six, and the two rows doing the most work look the most boring — “touching” (kills <code>&lt;=</code> → <code>&lt;</code>) and “inside, listed first” (kills sorting by end time).</p>
<p><strong>What the interviewer scores:</strong> questions first, a case list, the boundaries, exact assertions, spec-like names, reading the output, naming what is missing — more than finishing.</p>
<div class="pitfall co-tieu-de"><strong>Silence is the worst answer in live coding.</strong> Two quiet minutes look like being stuck. Say what you are checking (“now touching — this is where an off-by-one hides”); if you are stuck, say so and ask for a hint.</div>

<h3>🧪 Practice (20 minutes)</h3>
<div class="callout ok">
<p>Set a 20-minute timer. Move the model test file out of the way and write <code>src/rules/busy.test.js</code> yourself, talking aloud (record it on your phone). When the timer rings, run <code>node demo10/phong-van/cham.mjs src/rules/busy.test.js</code>. Then answer questions 3, 6 and 7 aloud, 60–90 seconds each.</p>
<p><strong>Solution and real output</strong> — the model answer:</p>
${ma('javascript', CODE.busyTest)}
${ra(MAU_RUN)}
${ra(CHAM_MAU)}
<p><strong>Done when</strong> <code>cham.mjs</code> prints 6/6 within the 20 minutes, and each answer fits in 90 seconds with a number you can explain.</p>
</div>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">live coding (code trực tiếp)</span><span class="v">Writing code in front of the interviewer, thinking aloud.</span></div>
  <div class="kv"><span class="k">STAR (tình huống · nhiệm vụ · hành động · kết quả)</span><span class="v">A shape for project stories: Situation, Task, Action, Result.</span></div>
  <div class="kv"><span class="k">trade-off (đánh đổi)</span><span class="v">What a choice costs, and when you would choose differently.</span></div>
  <div class="kv"><span class="k">classicist / mockist (cổ điển / dùng mock)</span><span class="v">Real collaborators and state checks vs mocks and call checks.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Answer in five steps: clarify, claim, evidence with a number, trade-off, stop.</li>
<li>Every number needs a source you can describe — your own runs beat anything you read.</li>
<li>Strong answers name what a technique cannot do: coverage cannot see assertions, retry hides bugs, mocks hide repository bugs.</li>
<li>Narrow, honest claims survive follow-ups; absolute ones do not.</li>
<li>Live coding: ask, list cases, test the boundaries exactly, run, say what is missing — out loud.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'interview-prep', bai: 'pv-4-4-testing', title: 'Interview Prep course — 4.4: testing questions', sub: 'Being written (outline only): where the testing round sits among the backend rounds. Here: the answers, with measured numbers.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-7-2-live-coding', title: 'Interview Prep course — 7.2: live coding and pair programming', sub: 'Being written (outline only): live coding in general. Here: one full round on tests, graded by six real bugs.', cta: 'OPEN LESSON →' })}
${lienKet({ khoa: 'api-design', bai: 'api-11-1-khung', title: 'API Design course — 11.1: a framework for API design interview questions', sub: 'Same habit — clarify, use measured numbers, name the trade-off. There: designing an API in 45 minutes; here: testing questions.', cta: 'OPEN LESSON →' })}
</div>

<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.4</span>
<h2>Câu hỏi phỏng vấn về testing</h2>
<p class="lead">Câu hỏi testing khi phỏng vấn hiếm khi hỏi định nghĩa: họ hỏi bạn đã từng thấy một bộ test nói dối và sửa nó chưa. Bạn đã làm suốt chín chương. Bài này biến các phép đo đó thành câu trả lời.</p>
<p><strong>Sau bài này bạn có thể</strong> trả lời mười một câu hỏi testing hay gặp nhất ở vị trí thực tập và junior, mỗi câu 60–90 giây, chống lưng mọi khẳng định bằng một con số và bài nơi bạn đo nó, nói ra đánh đổi trước khi bị hỏi, và qua một vòng live coding 20 phút. <strong>Vì sao hữu ích:</strong> “em biết unit test” nghe giống mọi CV; “retry biến 17 lần đỏ trên 50 thành 0 trong khi bug vẫn còn” nghe như kinh nghiệm thật.</p>

<h3>Cách trả lời mọi câu hỏi testing</h3>
${FLOW_VI}
<div class="pitfall co-tieu-de"><strong>Đừng đưa con số bạn không chống lưng được.</strong> Câu hỏi tiếp là “bạn đo thế nào?” — “em đọc ở đâu đó” làm sụp câu trả lời. Tốt hơn: đo trên dự án của chính bạn.</div>

<h3>Nền tảng</h3>
<h4>1. Vì sao viết test? Unit test là gì?</h4>
<p><em>Họ kiểm:</em> test là công cụ, hay là bài tập về nhà? <strong>Yếu:</strong> “Test để bảo đảm không có bug.” <strong>Mạnh:</strong> “Test cho cả nhóm sửa code mà không sợ. Unit test chạy logic trong bộ nhớ nên rất rẻ: ở bài 0.1 một luật tốn 0,015 ms mỗi lần kiểm khi gọi hàm, 0,75–1 ms khi qua HTTP. Nhưng nó không thấy phần nối, nên cần vài test ở tầng trên.”</p>
<h4>2. Kim tự tháp hay chiếc cúp?</h4>
<p><em>Họ kiểm:</em> lập luận về chi phí và độ tin. <strong>Yếu:</strong> “70% unit, 20% integration, 10% e2e.” <strong>Mạnh:</strong> “Kim tự tháp nói càng lên cao càng đắt; chiếc cúp nói test tích hợp mua nhiều độ tin nhất trên mỗi test. Ở bài 8.4: 100 unit test 1,1 s, component 2,7 s, tích hợp 3,7 s, e2e 9,6 s. Nhưng hình dạng đi theo rủi ro: lượt đặt trùng chỉ lộ trên PostgreSQL thật (4.1).”</p>
<h4>3. Mock, stub, spy, fake — và khi nào nên mock?</h4>
<p><em>Họ kiểm:</em> bạn đã bị mock lừa chưa? <strong>Yếu:</strong> “Đều là đồ giả; em mock hết cho nhanh.” <strong>Mạnh:</strong> “Stub: trả lời đóng sẵn; spy: ghi lời gọi; mock: kiểm lời gọi mong đợi; fake: bản nhỏ chạy thật, như repository trong bộ nhớ (3.1). Ở bài 10.1 một bug trong repository đó — <code>remove</code> trả về mảng — để test kiểu mockist xanh còn test kiểu classicist đỏ. Nên tôi mock thứ không phải của mình — email, đồng hồ — còn bên trong dùng fake.”</p>
<h4>4. Bạn test POST /bookings thế nào?</h4>
<p><em>Họ kiểm:</em> chia một tính năng ra các tầng. <strong>Yếu:</strong> “Gọi bằng Postman xem có 200 không.” <strong>Mạnh:</strong> “Luật là unit test với giá trị biên (1.4). Endpoint dùng Supertest: 201 kèm Location, 400 cho body sai định dạng nhưng 422 cho luật bị phá (5.3), 401 khi thiếu token hợp lệ, 403 khi sai vai trò, 404 cho lượt đặt của sinh viên khác — IDOR (5.2). Một contract test: đổi tên <code>start</code> vẫn để test chỉ-kiểm-status xanh (5.4). Trùng lịch trên PostgreSQL thật: 23P01 thành OVERLAP (4.1).”</p>

<h3>Chất lượng của bộ test</h3>
<h4>5. CSDL thật hay CSDL giả?</h4>
<p><em>Họ kiểm:</em> bug nào chỉ CSDL thật mới lộ. <strong>Yếu:</strong> “Mock cho nhanh.” <strong>Mạnh:</strong> “Repository trên PostgreSQL thật, dịch vụ trên fake. Bài 4.1: SQLite nhận chữ vào cột INTEGER còn PostgreSQL từ chối (22P02). Testcontainers: sẵn sàng sau 1,2–2,1 s (4.3). Cái giá: cần Docker trong CI.”</p>
<h4>6. Độ phủ 80% (hay 100%) đã đủ chưa?</h4>
<p><em>Họ kiểm:</em> độ phủ không thấy gì. <strong>Yếu:</strong> “100% là cái gì cũng đã test.” <strong>Mạnh:</strong> “Độ phủ cho biết cái gì đã chạy, không cho biết cái gì đã được kiểm. Ở bài 8.1 một bộ chỉ toàn <code>toBeDefined</code> đạt 100% cả bốn chỉ số mà hai bug cài sẵn vẫn xanh; Stryker chỉ diệt 41,49% đột biến trên nó (8.2). Mutation chậm — 10,531 s so với 0,768 s — nên chạy ban đêm.”</p>
<h4>7. Bạn xử lý test chập chờn thế nào?</h4>
<p><em>Họ kiểm:</em> bạn có giấu nó bằng retry không? <strong>Yếu:</strong> “Thêm retry, CI chậm thôi.” <strong>Mạnh:</strong> “Cùng code, kết quả khác. Bài 8.3 tái hiện năm nguyên nhân, tới cả một tranh chấp thật (33/100). Retry che giấu: 17 lần đỏ trên 50 thành 0 trong khi lượt đặt trùng vẫn còn. Ở bài 10.3 id test ngẫu nhiên đỏ 10 trên 30 lần, và <code>retry: 3</code> biến nó thành 0. Tôi tái hiện bằng seed, cách ly có người phụ trách (9.3), sửa tận gốc, chứng minh bằng 100 lần chạy xáo thứ tự.”</p>
${ra(RETRY)}

<h3>Công việc thật</h3>
<h4>8. Bạn có làm TDD không?</h4>
<p><em>Họ kiểm:</em> trung thực hơn là giáo điều. <strong>Yếu:</strong> “Có, lúc nào cũng làm.” — rồi câu “cho tôi xem” không có lời đáp. <strong>Mạnh:</strong> “Với luật có đầu vào đầu ra rõ ràng thì có. Danh sách chờ ở 10.1 đi qua sáu bước đỏ-xanh; Stryker chấm 100% (45/45). Với giao diện thì tôi làm spike, bỏ đi, rồi mới test.”</p>
<h4>9. Bạn nhận code không có test. Bạn làm gì?</h4>
<p><em>Họ kiểm:</em> bạn có viết lại ngay ngày đầu không? <strong>Yếu:</strong> “Viết lại cho sạch rồi test.” <strong>Mạnh:</strong> “Ghim hành vi hiện tại bằng characterization test, rồi refactor dưới sự bảo vệ của chúng — cách của Michael Feathers. Ở bài 10.2 ba dòng mẫu phủ 96,42% số dòng mà chỉ bắt 3 trên 10 thay đổi cài sẵn; dữ liệu đi qua mọi nhánh bắt 10/10, rồi bắt luôn lỗi trượt tay khi refactor của tôi.”</p>
${ra(LEGACY)}
<h4>10. Bộ test chậm và CI để lọt code đỏ. Bắt đầu từ đâu?</h4>
<p><em>Họ kiểm:</em> đo trước. <strong>Yếu:</strong> “Thêm worker, review kỹ hơn.” <strong>Mạnh:</strong> “Ở bài 8.4 chạy song song che sự chậm (6,14 s so với 11,07 s nối tiếp); sửa nguyên nhân đưa chúng xuống 210 ms. Trong CI: <code>npm ci</code> có cache npm, 49,6 s xuống 15,0 s (9.1), một cổng bắt buộc <code>ci-ok</code> có <code>if: always()</code> (9.3).”</p>
<h4>11. Kể tôi nghe bạn đã test dự án của mình thế nào.</h4>
<p><em>Họ kiểm:</em> một câu chuyện thật, phần việc của bạn và kết quả. <strong>Yếu:</strong> “Nhóm em test tay trước buổi demo.” <strong>Mạnh</strong> (STAR): “<em>Tình huống:</em> một API đặt phòng lab. <em>Nhiệm vụ:</em> tôi phụ trách test. <em>Hành động:</em> bảng giá trị biên, Supertest kèm hợp đồng OpenAPI, PostgreSQL thật, hành trình trình duyệt, một check CI bắt buộc. <em>Kết quả:</em> 229 unit test chạy dưới một giây, điểm đột biến 98,99% trên luật.” Hãy dùng số của dự án bạn.</p>
<div class="pitfall co-tieu-de"><strong>“Em luôn làm TDD” và “bọn em phủ 100%” là bẫy bạn tự giăng.</strong> Mỗi câu mời “cho tôi xem bước đỏ” hay “bao nhiêu đột biến sống sót?”. Một khẳng định hẹp — “TDD cho luật, không cho giao diện” — nghe chín chắn hơn.</div>

<h3>Vòng live coding 20 phút</h3>
<p>Một dạng hay gặp: một hàm nhỏ, 20 phút, vừa viết test vừa nói. Đề này lấy từ LabFlow Lite: gộp các lượt đặt của một phòng trong một ngày thành các khối bận. Bạn nhận đặc tả và một bản cài đặt chạy được; việc của bạn là test.</p>
${ma('javascript', CODE.busy)}
${LICH_VI}
<p><strong>Một bài làm yếu</strong> sau 20 phút — hai test, cả hai xanh:</p>
${ma('javascript', CODE.ungVienYeu)}
${ra(YEU_RUN)}
<p>Người phỏng vấn cài sáu bug thật, từng con một, rồi chạy lại test — đúng ý tưởng của mọi Lab trong khoá:</p>
${ra(CHAM_YEU)}
<p>Không trên sáu: <code>result.length</code> vẫn là 1 kể cả khi khối kết thúc sai giờ, và <code>toBeTruthy()</code> đúng với mọi mảng. Bài mẫu là lời giải của phần thực hành bên dưới: nó bắt cả sáu, và hai dòng làm nhiều việc nhất lại trông nhàm nhất — “touching” (diệt <code>&lt;=</code> → <code>&lt;</code>) và “inside, listed first” (diệt lỗi sắp theo giờ kết thúc).</p>
<p><strong>Người phỏng vấn chấm:</strong> hỏi trước, danh sách ca, các biên, khẳng định chính xác, tên như đặc tả, đọc output, nói còn thiếu gì — hơn là viết xong hết.</p>
<div class="pitfall co-tieu-de"><strong>Im lặng là câu trả lời tệ nhất khi live coding.</strong> Hai phút im lặng trông như bị kẹt. Hãy nói điều bạn đang kiểm (“giờ tới ca chạm nhau — chỗ này hay giấu lỗi lệch một”); kẹt thì nói ra và xin gợi ý.</div>

<h3>🧪 Thực hành (20 phút)</h3>
<div class="callout ok">
<p>Đặt hẹn giờ 20 phút. Dời file test mẫu đi chỗ khác và tự viết <code>src/rules/busy.test.js</code>, vừa viết vừa nói to (ghi âm bằng điện thoại). Khi chuông reo, chạy <code>node demo10/phong-van/cham.mjs src/rules/busy.test.js</code>. Sau đó trả lời to câu 3, 6 và 7, mỗi câu 60–90 giây.</p>
<p><strong>Lời giải và output thật</strong> — bài mẫu:</p>
${ma('javascript', CODE.busyTest)}
${ra(MAU_RUN)}
${ra(CHAM_MAU)}
<p><strong>Xong khi</strong> <code>cham.mjs</code> in 6/6 trong 20 phút, và mỗi câu trả lời gọn trong 90 giây với một con số bạn giải thích được.</p>
</div>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">live coding (code trực tiếp)</span><span class="v">Viết code trước mặt người phỏng vấn, vừa viết vừa nghĩ thành tiếng.</span></div>
  <div class="kv"><span class="k">STAR (tình huống · nhiệm vụ · hành động · kết quả)</span><span class="v">Khung kể chuyện dự án: Situation, Task, Action, Result.</span></div>
  <div class="kv"><span class="k">trade-off (đánh đổi)</span><span class="v">Một lựa chọn tốn gì, và khi nào bạn chọn khác.</span></div>
  <div class="kv"><span class="k">classicist / mockist (cổ điển / dùng mock)</span><span class="v">Đồ thật và kiểm trạng thái, so với mock và kiểm lời gọi.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Trả lời theo năm bước: làm rõ, khẳng định, bằng chứng có con số, đánh đổi, dừng.</li>
<li>Con số nào cũng cần một nguồn bạn tả lại được — lần chạy của chính bạn thắng mọi thứ bạn đọc.</li>
<li>Câu trả lời mạnh nói ra điều kỹ thuật không làm được: độ phủ không thấy khẳng định, retry giấu bug, mock giấu bug của repository.</li>
<li>Khẳng định hẹp và trung thực sống qua câu hỏi tiếp; khẳng định tuyệt đối thì không.</li>
<li>Live coding: hỏi, liệt kê ca, test các biên chính xác, chạy, nói còn thiếu gì — nói thành tiếng.</li>
</ul>

${NGUON}
${lienKet({ khoa: 'interview-prep', bai: 'pv-4-4-testing', title: 'Khoá Luyện phỏng vấn — 4.4: câu hỏi về testing', sub: 'Đang soạn (mới có đề cương): vòng testing nằm đâu giữa các vòng backend. Ở đây: câu trả lời, kèm số đo thật.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'interview-prep', bai: 'pv-7-2-live-coding', title: 'Khoá Luyện phỏng vấn — 7.2: code trực tiếp và lập trình cặp', sub: 'Đang soạn (mới có đề cương): live coding nói chung. Ở đây: trọn một vòng viết test, chấm bằng sáu bug thật.', cta: 'MỞ BÀI →' })}
${lienKet({ khoa: 'api-design', bai: 'api-11-1-khung', title: 'Khoá API Design — 11.1: khung trả lời câu hỏi phỏng vấn thiết kế API', sub: 'Cùng thói quen — làm rõ, dùng số đo thật, nói ra đánh đổi. Ở đó: thiết kế một API trong 45 phút; ở đây: câu hỏi testing.', cta: 'MỞ BÀI →' })}
</div>
`,
};
