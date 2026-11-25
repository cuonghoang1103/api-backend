/**
 * 1.1 — Xác định phạm vi: "xong" nghĩa là gì (soạn 24/11/2026, agent fsp).
 * Sản phẩm thật: README.md của dự án mẫu ChiaSe (scratchpad/fsp/chiase, tag ch1).
 * Sự cố có nguồn (GET 200, 24/11/2026): Wikipedia "HealthCare.gov" — ra mắt 01/10/2013; 250.000 người dùng đồng thời thay vì 50–60 nghìn
 * dự kiến (lời CTO Todd Park 06/10/2013); ngân sách hợp đồng CGI 93,7 triệu → 292 triệu USD trước ngày ra mắt.
 */
import { nguon, lienKet, spring, esc } from '../_chung.mjs';

const THE = [
  lienKet({ khoa: 'agile-teamwork', bai: 'agl-2-1-ticket', title: 'Agile 2.1 — Viết ticket ai cũng nhận làm được', sub: 'Khi làm nhóm: biến user story thành ticket có tiêu chí chấp nhận.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'agile-teamwork', bai: 'agl-2-2-chia-nho', title: 'Agile 2.2 — Chia nhỏ công việc', sub: 'Cắt một story to thành những lát mỏng giao được.', cta: 'Mở bài →' }),
  lienKet({ khoa: 'api-design', bai: 'api-7-3-design-first', title: 'API Design 7.4 — Thiết kế trước hay code trước', sub: 'Vì sao bảng API trong README viết TRƯỚC khi có route nào.', cta: 'Mở bài →' }),
].join('\n');

const NGUON = [
  nguon('📖', 'Wikipedia — HealthCare.gov (Launch problems)', '01/10/2013: 250.000 người dùng đồng thời thay vì 50–60 nghìn dự kiến; hợp đồng CGI 93,7 → 292 triệu USD.', 'https://en.wikipedia.org/wiki/HealthCare.gov'),
].join('\n');

const README_TRICH = `## 2. User story — phiên bản 1 (MVP)
Ưu tiên theo MoSCoW: M = phải có, S = nên có, C = có thì tốt, W = không làm ở v1.

| #  | Là…        | tôi muốn…                                      | để…                       | Ưu tiên |
| U1 | khách      | đăng ký bằng email + mật khẩu                  | có tài khoản riêng        | M |
| U2 | người dùng | đăng nhập, tải lại trang vẫn còn đăng nhập     | không phải gõ lại mật khẩu| M |
| U4 | tác giả    | sửa / xoá bài của chính mình                   | sửa sai                   | M |
| U9 | người dùng | ảnh tải lên được xoá thông tin vị trí (GPS)    | không lộ nhà mình         | S |
…
Không làm ở v1 (W): theo dõi người khác, nhắn tin riêng, nhiều ảnh/video, tìm kiếm,
quên mật khẩu qua email, trang quản trị, đa ngôn ngữ.

## 3. Tiêu chí chấp nhận (mẫu cho U4)
- Tác giả gửi PATCH /api/posts/:id ⇒ 200 và bài đổi.
- Người khác gửi cùng request ⇒ 403, bài KHÔNG đổi.
- Chưa đăng nhập ⇒ 401.
- Bài không tồn tại ⇒ 404.

## 4. "Xong" nghĩa là gì (Definition of Done — áp cho MỌI story)
1. Có ít nhất một test tự động chạy xanh.
2. npm run check (lint + kiểm kiểu + định dạng) không lỗi.
3. Chạy được bằng docker compose up trên máy sạch.
4. Endpoint mới có trong bảng API dưới đây.
5. Đã commit, CI xanh.`;

export default {
  title: '1.1 — Scoping the project: what "done" means|||1.1 — Xác định phạm vi: "xong" nghĩa là gì',
  slug: 'fp-1-1-pham-vi',
  type: 'LESSON',
  isFreePreview: true,
  description: 'Bài toán một câu, user story, cắt bằng MoSCoW, tiêu chí chấp nhận viết bằng mã trạng thái HTTP, Definition of Done, yêu cầu phi chức năng, và README viết trước code — kèm bài học HealthCare.gov 2013 và cách làm ở công ty outsourcing.',
  content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Planning</span>
<h2>Write down what "done" means before you write any code</h2>
<p class="lead">The most expensive bug in a student project is not a null pointer. It is building the wrong thing, or building too much and finishing nothing. This lesson turns the idea from Section 0 into a short written plan: one sentence, a list of user stories with priorities, acceptance criteria you can test, and a Definition of Done. All of it goes into <code>README.md</code> — before the first line of code.</p>

<h3>Everyday picture: building a house</h3>
<p>Nobody pours concrete before agreeing how many rooms there are. Changing a drawing costs an eraser; moving a wall costs a week. Software is the same, only less visible: changing a sentence in the README costs a minute, changing a database column after three chapters costs an afternoon of migrations, tests and screens.</p>

<h3>⚠️ Real incident: HealthCare.gov, 1 October 2013</h3>
<p>The US government's health-insurance marketplace launched on 1 October 2013 and was barely usable. According to the US chief technology officer at the time, the site drew <strong>250,000 simultaneous users instead of the 50,000–60,000 expected</strong>. The main contractor's budget had grown from $93.7 million to $292 million before launch. Critics pointed at a "write down all the requirements then build to those requirements" process with little testing of the whole system together. The two lessons that fit a student project: <strong>write non-functional requirements down</strong> (how many users? how fast?) and <strong>test the whole flow end to end early</strong>, not only the pieces.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">One sentence</span><span class="lz-d">Who, what they need, what you will not do.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">User stories</span><span class="lz-d">As a…, I want…, so that…</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">MoSCoW</span><span class="lz-d">Must / Should / Could / Won't — write the Won'ts.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Acceptance criteria</span><span class="lz-d">Requests + status codes, incl. unhappy paths.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Definition of Done</span><span class="lz-d">One checklist for every story.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Non-functional + API table</span><span class="lz-d">Measurable "how well"; the contract the frontend will rely on.</span></div>
</div>
<h3>Step 1 — The problem in one sentence</h3>
<p>Who has the problem, what they need, and what you will <em>not</em> do. ChiaSe: <em>"A class or club needs a place to post short updates with one photo, comment and react — without ads or a recommendation algorithm."</em> If you cannot write this sentence, you are not ready to design tables.</p>

<h3>Step 2 — User stories</h3>
<p>Format: <strong>As a</strong> &lt;role&gt;, <strong>I want</strong> &lt;action&gt;, <strong>so that</strong> &lt;benefit&gt;. One story = one need you can demo. A good story is small enough to finish in a day or two and testable — you can say yes/no to "is it done?". "Users can manage posts" is not a story; "As an author I want to edit my own post so that I can fix typos" is.</p>

<h3>Step 3 — Cut with MoSCoW</h3>
<ul>
<li><strong>Must</strong>: without it the product makes no sense (register, login, post, feed, comment).</li>
<li><strong>Should</strong>: important, but v1 could ship without it (likes, live comments, GPS stripping).</li>
<li><strong>Could</strong>: nice extras, only if time is left.</li>
<li><strong>Won't (this time)</strong>: written down on purpose so nobody argues about it later.</li>
</ul>
<p>Rule of thumb for a 5–7 week solo project: Musts should take at most about 60% of your time, because everything takes longer than planned — integration, bugs, deploy.</p>

<h3>Step 4 — Acceptance criteria you can test</h3>
<p>For each Must story, list concrete checks. In an API project, write them as HTTP requests and status codes — they become your tests in Chapter 8 almost word for word:</p>
<ul>
<li>Author sends <code>PATCH /api/posts/:id</code> → <code>200</code>, post changed.</li>
<li>Another user sends the same request → <code>403</code>, post <strong>not</strong> changed.</li>
<li>Not logged in → <code>401</code>. Post does not exist → <code>404</code>.</li>
</ul>
<p>Notice the second line: the "unhappy paths" are where security bugs live (Parler, Section 0.1). Writing them now means you will not forget to build them.</p>

<div class="pitfall co-tieu-de"><p><strong>Trap — only happy paths.</strong> "User can edit a post" with no line about other users is how IDOR bugs ship. For every Must story, write at least one criterion for the wrong user, the logged-out user and bad input.</p></div>
<h3>Step 5 — Definition of Done (for every story)</h3>
<p>Acceptance criteria differ per story; the Definition of Done is one list applied to all of them. ChiaSe's: a passing automated test, <code>npm run check</code> clean, runs with <code>docker compose up</code> on a clean machine, listed in the README API table, committed with CI green. Items you cannot check yet (Docker, CI) are still written — they become true in Chapters 9–10.</p>

<h3>Step 6 — Non-functional requirements</h3>
<p>Functional = what it does; non-functional = <strong>how well</strong>. Keep them few and measurable:</p>
<ul>
<li>Performance: feed page responds in under 300 ms locally with 10,000 posts.</li>
<li>Security: passwords hashed with argon2id; no stack traces in API responses; login rate-limited.</li>
<li>Privacy: GPS removed from photos; deleting a post deletes its data.</li>
<li>Operability: one command starts everything; <code>/api/health</code> says whether the database is reachable.</li>
</ul>

<h3>Step 7 — README first</h3>
<p>The README is the plan everyone (including you in two weeks) reads first. Here is an excerpt of ChiaSe's real README after this lesson:</p>
<pre><code class="language-markdown">${esc(README_TRICH)}</code></pre>

<h3>At work: how outsourcing companies do this</h3>
<ul>
<li>Requirements arrive from the client as a document or spreadsheet. The team writes questions in a <strong>Q&amp;A sheet</strong> (one row per question, status open/answered) instead of guessing.</li>
<li>Designers write a <strong>basic design</strong> (screens, APIs, tables) and a <strong>detail design</strong>; developers estimate in man-days per item.</li>
<li>Changes after sign-off are a <strong>change request</strong>, re-estimated and approved — the written scope protects both the client and the team.</li>
<li>As an intern you will often be given one story with acceptance criteria. Reading them carefully and asking about the unclear ones on day one is the most valued skill in the first weeks.</li>
</ul>

${spring(true, 'Planning is language-independent. The Spring Boot course writes its capstone specification the same way — domain, rules, endpoints, then code.', [
  ['sb-18-1-thiet-ke-capstone', 'Spring Boot 18.1 — Specification and domain design (LabFlow)'],
])}

<h3>🎤 Interview corner</h3>
<ol>
<li><strong>"What is the difference between acceptance criteria and a Definition of Done?"</strong> — Criteria are specific to one story (this PATCH returns 403 for others); DoD is a checklist for every story (tested, linted, deployed).</li>
<li><strong>"How do you handle a requirement that changes mid-project?"</strong> — Write it down, estimate the impact, agree what moves out to make room, update the README/backlog; never silently absorb it.</li>
<li><strong>"Give an example of a non-functional requirement."</strong> — "Feed responds under 300 ms with 10,000 posts" — measurable, unlike "fast".</li>
<li><strong>"What did you deliberately leave out of your project?"</strong> — Name two Won'ts and the reason.</li>
</ol>

<h3>🧪 Lab 1.1 (40 min) — your README plan</h3>
<div class="callout ok">
<ol>
<li>In your repo, create <code>README.md</code> with sections: problem sentence, user stories table (with MoSCoW), Won't list, acceptance criteria for <strong>two</strong> Must stories, Definition of Done, non-functional requirements, planned API table.</li>
<li>For every Must story, add at least one <em>unhappy</em> criterion (wrong user, not logged in, invalid input).</li>
<li>Commit: <code>docs: user story, tiêu chí chấp nhận, Definition of Done</code>.</li>
</ol>
<p><strong>Rubric (10 pts):</strong> problem sentence names who/what/not (1) · ≥8 stories in the right format (2) · priorities with ≥4 Won'ts (2) · two stories with testable criteria incl. status codes and an unhappy path (3) · DoD + ≥3 measurable non-functional requirements (2).</p>
</div>
<details><summary>Solution (ChiaSe)</summary>
<p>The excerpt above is the real README. Full file: sections 1–8 — problem, 9 stories (U1–U9), Won't list, criteria for U4, DoD (5 items), API table with 10 rows, data model pointer, quick start. Compare especially: does each of your criteria name an HTTP status? Does your DoD include something about running on a clean machine?</p>
</details>

<h3>🗂 Key terms</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">scope</span><span class="v">What is in and out of a version.</span></div>
  <div class="kv"><span class="k">MVP</span><span class="v">Minimum viable product: the smallest version that solves the core problem.</span></div>
  <div class="kv"><span class="k">acceptance criteria</span><span class="v">Testable conditions for one story to be accepted.</span></div>
  <div class="kv"><span class="k">Definition of Done</span><span class="v">The checklist every story must meet.</span></div>
  <div class="kv"><span class="k">non-functional requirement</span><span class="v">How well the system works: speed, security, privacy, operability.</span></div>
  <div class="kv"><span class="k">change request</span><span class="v">A formal request to change agreed scope, re-estimated before it is accepted.</span></div>
</div>

<h3>📌 Summary</h3>
<ul>
<li>Plan in README before code: sentence → stories → MoSCoW → criteria → DoD → non-functional → API table.</li>
<li>Write acceptance criteria as requests + status codes, including unhappy paths.</li>
<li>HealthCare.gov 2013: unwritten load expectations and late end-to-end testing are expensive.</li>
<li>At work: Q&amp;A sheet, basic/detail design, change requests.</li>
</ul>
${THE}
${NGUON}
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Lên kế hoạch</span>
<h2>Viết ra "xong" nghĩa là gì trước khi viết dòng mã nào</h2>
<p class="lead">Con bug đắt nhất của đồ án sinh viên không phải null pointer. Mà là làm sai thứ cần làm, hoặc làm quá nhiều rồi không xong thứ gì. Bài này biến ý tưởng ở Mục 0 thành một bản kế hoạch ngắn bằng chữ: một câu bài toán, danh sách user story có mức ưu tiên, tiêu chí chấp nhận kiểm được, và một Definition of Done. Tất cả nằm trong <code>README.md</code> — trước dòng mã đầu tiên.</p>

<h3>Liên tưởng đời thường: xây nhà</h3>
<p>Không ai đổ bê tông trước khi thống nhất nhà có mấy phòng. Sửa bản vẽ tốn một cục tẩy; dời một bức tường tốn một tuần. Phần mềm cũng vậy, chỉ là khó nhìn thấy hơn: sửa một câu trong README tốn một phút, sửa một cột trong cơ sở dữ liệu sau ba chương tốn cả buổi chiều làm migration, test và màn hình.</p>

<h3>⚠️ Sự cố thật: HealthCare.gov, 01/10/2013</h3>
<p>Trang mua bảo hiểm y tế của chính phủ Mỹ ra mắt ngày 01/10/2013 và gần như không dùng được. Theo lời giám đốc công nghệ của chính phủ lúc đó, trang đón <strong>250.000 người dùng cùng lúc thay vì 50–60 nghìn như dự kiến</strong>. Ngân sách của nhà thầu chính đã tăng từ 93,7 triệu lên 292 triệu USD trước ngày ra mắt. Giới phê bình chỉ vào quy trình kiểu "viết ra mọi yêu cầu rồi xây theo đúng yêu cầu đó", với rất ít lần thử cả hệ thống chạy cùng nhau. Hai bài học hợp với đồ án sinh viên: <strong>viết ra yêu cầu phi chức năng</strong> (bao nhiêu người dùng? nhanh tới đâu?) và <strong>thử trọn luồng đầu-cuối thật sớm</strong>, không chỉ thử từng mảnh.</p>

<div class="lz-flow">
<div class="lz-step"><span class="lz-k">1</span><span class="lz-t">Một câu</span><span class="lz-d">Ai, họ cần gì, bạn sẽ không làm gì.</span></div>
<div class="lz-step"><span class="lz-k">2</span><span class="lz-t">User story</span><span class="lz-d">Là…, tôi muốn…, để…</span></div>
<div class="lz-step"><span class="lz-k">3</span><span class="lz-t">MoSCoW</span><span class="lz-d">Must / Should / Could / Won't — ghi rõ các mục Won't.</span></div>
<div class="lz-step"><span class="lz-k">4</span><span class="lz-t">Tiêu chí chấp nhận</span><span class="lz-d">Request + mã trạng thái, có cả đường không vui.</span></div>
<div class="lz-step"><span class="lz-k">5</span><span class="lz-t">Definition of Done</span><span class="lz-d">Một danh sách cho mọi story.</span></div>
<div class="lz-step"><span class="lz-k">6</span><span class="lz-t">Phi chức năng + bảng API</span><span class="lz-d">"Tốt tới đâu" đo được; bản hợp đồng frontend sẽ dựa vào.</span></div>
</div>
<h3>Bước 1 — Bài toán trong một câu</h3>
<p>Ai gặp vấn đề, họ cần gì, và bạn sẽ <em>không</em> làm gì. ChiaSe: <em>"Một lớp học hay CLB cần chỗ đăng cập nhật ngắn kèm một ảnh, bình luận và thả tim — không quảng cáo, không thuật toán gợi ý."</em> Chưa viết nổi câu này thì chưa sẵn sàng thiết kế bảng.</p>

<h3>Bước 2 — User story</h3>
<p>Mẫu: <strong>Là</strong> &lt;vai trò&gt;, <strong>tôi muốn</strong> &lt;hành động&gt;, <strong>để</strong> &lt;lợi ích&gt;. Một story = một nhu cầu demo được. Story tốt đủ nhỏ để xong trong một hai ngày và kiểm được — trả lời được có/không cho câu "xong chưa?". "Người dùng quản lý bài viết" không phải story; "Là tác giả, tôi muốn sửa bài của chính mình để chữa lỗi chính tả" mới là story.</p>

<h3>Bước 3 — Cắt bằng MoSCoW</h3>
<ul>
<li><strong>Must (phải có)</strong>: thiếu là sản phẩm vô nghĩa (đăng ký, đăng nhập, đăng bài, bảng tin, bình luận).</li>
<li><strong>Should (nên có)</strong>: quan trọng, nhưng v1 vẫn ra được nếu thiếu (thích, bình luận tức thời, xoá GPS).</li>
<li><strong>Could (có thì tốt)</strong>: phần thêm, chỉ làm nếu còn thời gian.</li>
<li><strong>Won't (lần này không làm)</strong>: viết ra có chủ ý để sau này không ai cãi nhau về nó.</li>
</ul>
<p>Mẹo cho dự án một người 5–7 tuần: các mục Must chỉ nên chiếm tối đa khoảng 60% thời gian, vì việc gì cũng lâu hơn dự tính — ghép nối, sửa lỗi, deploy.</p>

<h3>Bước 4 — Tiêu chí chấp nhận kiểm được</h3>
<p>Với mỗi story Must, liệt kê các phép kiểm cụ thể. Ở dự án API, viết chúng thành request HTTP và mã trạng thái — Chương 8 sẽ biến chúng thành test gần như nguyên văn:</p>
<ul>
<li>Tác giả gửi <code>PATCH /api/posts/:id</code> → <code>200</code>, bài đổi.</li>
<li>Người khác gửi cùng request → <code>403</code>, bài <strong>không</strong> đổi.</li>
<li>Chưa đăng nhập → <code>401</code>. Bài không tồn tại → <code>404</code>.</li>
</ul>
<p>Để ý dòng thứ hai: các "đường không vui" (unhappy path) là nơi lỗi bảo mật sống (Parler, bài 0.1). Viết chúng ra từ bây giờ thì bạn sẽ không quên làm chúng.</p>

<div class="pitfall co-tieu-de"><p><strong>Bẫy — chỉ có đường vui.</strong> "Người dùng sửa được bài" mà không có dòng nào về người khác là cách lỗi IDOR lọt ra production. Với mỗi story Must, viết ít nhất một tiêu chí cho sai người, chưa đăng nhập, và dữ liệu sai.</p></div>
<h3>Bước 5 — Definition of Done (cho mọi story)</h3>
<p>Tiêu chí chấp nhận khác nhau theo từng story; Definition of Done là MỘT danh sách áp cho tất cả. Của ChiaSe: có test tự động chạy xanh, <code>npm run check</code> sạch, chạy được bằng <code>docker compose up</code> trên máy sạch, có trong bảng API của README, đã commit và CI xanh. Mục nào chưa kiểm được ngay (Docker, CI) vẫn viết ra — chúng thành sự thật ở Chương 9–10.</p>

<h3>Bước 6 — Yêu cầu phi chức năng</h3>
<p>Chức năng = nó làm gì; phi chức năng = nó làm <strong>tốt tới đâu</strong>. Giữ ít và đo được:</p>
<ul>
<li>Hiệu năng: trang bảng tin trả lời dưới 300 ms trên máy dev với 10.000 bài.</li>
<li>Bảo mật: mật khẩu băm bằng argon2id; phản hồi API không lộ stack trace; đăng nhập có giới hạn tần suất.</li>
<li>Riêng tư: ảnh bị xoá GPS; xoá bài là xoá dữ liệu của bài.</li>
<li>Vận hành: một lệnh chạy mọi thứ; <code>/api/health</code> cho biết có nối được cơ sở dữ liệu không.</li>
</ul>

<h3>Bước 7 — README viết trước</h3>
<p>README là bản kế hoạch mà ai (kể cả bạn của hai tuần sau) cũng đọc đầu tiên. Đây là trích đoạn README thật của ChiaSe sau bài này:</p>
<pre><code class="language-markdown">${esc(README_TRICH)}</code></pre>

<h3>Khi đi làm: công ty outsourcing làm việc này thế nào</h3>
<ul>
<li>Yêu cầu tới từ khách dưới dạng tài liệu hoặc bảng tính. Đội ghi câu hỏi vào <strong>bảng Q&amp;A</strong> (mỗi câu một dòng, trạng thái mở/đã trả lời) thay vì tự đoán.</li>
<li>Người thiết kế viết <strong>basic design</strong> (màn hình, API, bảng) và <strong>detail design</strong>; lập trình viên ước lượng theo man-day (ngày công) cho từng mục.</li>
<li>Thay đổi sau khi đã chốt là một <strong>change request</strong>, được ước lượng lại và duyệt — phạm vi viết ra bảo vệ cả khách lẫn đội.</li>
<li>Là thực tập sinh, bạn thường được giao một story kèm tiêu chí chấp nhận. Đọc kỹ và hỏi ngay ngày đầu về chỗ chưa rõ là kỹ năng được đánh giá cao nhất trong những tuần đầu.</li>
</ul>

${spring(false, 'Lên kế hoạch không phụ thuộc ngôn ngữ. Khoá Spring Boot viết đặc tả dự án cuối khoá đúng theo cách này — domain, luật, endpoint, rồi mới tới mã.', [
  ['sb-18-1-thiet-ke-capstone', 'Spring Boot 18.1 — Đặc tả và thiết kế domain (LabFlow)'],
])}

<h3>🎤 Góc phỏng vấn</h3>
<ol>
<li><strong>"Tiêu chí chấp nhận khác Definition of Done thế nào?"</strong> — Tiêu chí riêng cho một story (PATCH này trả 403 với người khác); DoD là danh sách cho mọi story (có test, qua lint, deploy được).</li>
<li><strong>"Yêu cầu đổi giữa dự án thì bạn xử lý sao?"</strong> — Ghi lại, ước lượng ảnh hưởng, thống nhất bỏ bớt gì để nhường chỗ, cập nhật README/backlog; không bao giờ âm thầm ôm vào.</li>
<li><strong>"Cho ví dụ một yêu cầu phi chức năng."</strong> — "Bảng tin trả lời dưới 300 ms với 10.000 bài" — đo được, khác với "nhanh".</li>
<li><strong>"Bạn đã cố tình bỏ gì ra khỏi dự án?"</strong> — Kể hai mục Won't và lý do.</li>
</ol>

<h3>🧪 Lab 1.1 (40 phút) — bản kế hoạch README của bạn</h3>
<div class="callout ok">
<ol>
<li>Trong repo, tạo <code>README.md</code> gồm các mục: câu bài toán, bảng user story (có MoSCoW), danh sách Won't, tiêu chí chấp nhận cho <strong>hai</strong> story Must, Definition of Done, yêu cầu phi chức năng, bảng API dự kiến.</li>
<li>Mỗi story Must thêm ít nhất một tiêu chí <em>không vui</em> (sai người, chưa đăng nhập, dữ liệu sai).</li>
<li>Commit: <code>docs: user story, tiêu chí chấp nhận, Definition of Done</code>.</li>
</ol>
<p><strong>Thang chấm (10 điểm):</strong> câu bài toán nêu ai/gì/không làm gì (1) · ≥8 story đúng mẫu (2) · có ưu tiên, ≥4 mục Won't (2) · hai story có tiêu chí kiểm được, có mã trạng thái và một đường không vui (3) · DoD + ≥3 yêu cầu phi chức năng đo được (2).</p>
</div>
<details><summary>Lời giải (ChiaSe)</summary>
<p>Trích đoạn ở trên là README thật. Tệp đầy đủ có mục 1–8 — bài toán, 9 story (U1–U9), danh sách Won't, tiêu chí cho U4, DoD (5 mục), bảng API 10 dòng, chỗ trỏ tới mô hình dữ liệu, phần bắt đầu nhanh. Hãy so kỹ: mỗi tiêu chí của bạn có nêu mã trạng thái HTTP không? DoD của bạn có mục nào về chạy trên máy sạch không?</p>
</details>

<h3>🗂 Thuật ngữ</h3>
<div class="kv-grid">
  <div class="kv"><span class="k">scope (phạm vi)</span><span class="v">Những gì nằm trong và ngoài một phiên bản.</span></div>
  <div class="kv"><span class="k">MVP</span><span class="v">Sản phẩm khả dụng tối thiểu: bản nhỏ nhất giải được vấn đề cốt lõi.</span></div>
  <div class="kv"><span class="k">acceptance criteria</span><span class="v">Tiêu chí chấp nhận: điều kiện kiểm được để một story được nhận.</span></div>
  <div class="kv"><span class="k">Definition of Done</span><span class="v">Danh sách mọi story đều phải đạt.</span></div>
  <div class="kv"><span class="k">yêu cầu phi chức năng</span><span class="v">Hệ thống chạy tốt tới đâu: tốc độ, bảo mật, riêng tư, vận hành.</span></div>
  <div class="kv"><span class="k">change request</span><span class="v">Yêu cầu chính thức đổi phạm vi đã chốt, ước lượng lại trước khi nhận.</span></div>
</div>

<h3>📌 Tóm tắt</h3>
<ul>
<li>Lập kế hoạch trong README trước mã: câu bài toán → story → MoSCoW → tiêu chí → DoD → phi chức năng → bảng API.</li>
<li>Viết tiêu chí chấp nhận thành request + mã trạng thái, có cả đường không vui.</li>
<li>HealthCare.gov 2013: không viết ra mức tải dự kiến và thử đầu-cuối quá muộn thì rất đắt.</li>
<li>Đi làm: bảng Q&amp;A, basic/detail design, change request.</li>
</ul>
${THE}
${NGUON}
</div>
`,
};
