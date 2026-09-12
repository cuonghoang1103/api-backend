/**
 * SWT301 · Chapter 2 — Testing throughout the software development lifecycle.
 * Source: SWT2_tim.pptx (143 visible slides; hidden pptx slides 12–13
 * "experience report", 79–83 system-testing notes and 151 "summary" are
 * summarised in text) + speaker notes + Overview.xlsx (the teacher's
 * level × objective × technique matrix).
 *   2.1 SDLC models                      slides 1–35
 *   2.2 Test levels: component & integration   slides 36–74
 *   2.3 Test levels: system & acceptance slides 75–105
 *   2.4 Test types                       slides 106–130
 *   2.5 Maintenance testing & the high-level test plan  slides 131–143
 *   2.6 The one-page overview (Overview.xlsx)
 *   2.7 The older 2023 deck (SWT2.ppt, deck key oswt2): its 31 new pages
 * Section title is kept identical to the old file so the seeder finds the
 * existing section even though its first lesson slug changed.
 */
import { walk, walkHead, books, bi, ansEn as AE, ansVi as AV } from './_slides.mjs';

const D = 'swt2';

/* ───────────────────────────── 2.1 SDLC models ───────────────────────────── */
const L21 = {
  title: '2.1 — Software development lifecycle models & good testing|||2.1 — Các mô hình vòng đời phát triển & kiểm thử tốt',
  slug: 'swt301-sdlc-models',
  type: 'VIDEO',
  description: 'SWT2 slide 1–35: SDLC là gì, 4 đặc điểm của kiểm thử tốt, Waterfall, V-model (thiết kế test sớm/muộn), VV&T, incremental & iterative, RUP, Scrum, Kanban, Spiral, Agile — kèm đáp án 11 câu hỏi trên slide và báo cáo thực tế Scottish Widows (slide ẩn).',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.1 · SWT2 slides 1–35</span>
<h2>Software development lifecycle models</h2>
<p class="lead">How and when you test depends on how the software is built. This lesson compares the two families of lifecycle models — <strong>sequential</strong> (waterfall, V-model) and <strong>iterative &amp; incremental</strong> (RUP, Scrum, Kanban, spiral) — and the four characteristics of good testing that hold in <em>every</em> model.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-2.1.1</strong> — Explain the relationships between software development activities and test activities in the lifecycle (K2).</li>
<li><strong>LO-2.1.2</strong> — Identify reasons why lifecycle models must be adapted to the context of project and product characteristics (K1).</li>
</ul>
<p>Chapter 2 carries <strong>5 of 40</strong> exam questions.</p></div>
<table>
<thead><tr><th></th><th>Sequential (waterfall, V)</th><th>Iterative &amp; incremental (RUP, Scrum, Kanban, spiral)</th></tr></thead>
<tbody>
<tr><td>Flow</td><td>one linear pass; a phase starts when the previous ends</td><td>many short cycles; each delivers working software</td></tr>
<tr><td>When testing happens</td><td>waterfall: at the end; V-model: planned from the start, executed on the right arm</td><td>in every iteration, with overlapping test levels</td></tr>
<tr><td>Test basis</td><td>formal, complete documents</td><td>user stories, less formal, changing</td></tr>
<tr><td>Main testing risk</td><td>defects found late, costly feedback</td><td>regression grows every iteration → automation needed</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 2 · Bài 2.1 · SWT2 slide 1–35</span>
<h2>Các mô hình vòng đời phát triển phần mềm</h2>
<p class="lead">Test thế nào và test lúc nào phụ thuộc vào cách phần mềm được làm ra. Bài này so sánh hai họ mô hình vòng đời — <strong>tuần tự</strong> (waterfall, V-model) và <strong>lặp &amp; tăng dần</strong> (RUP, Scrum, Kanban, spiral) — và bốn đặc điểm của kiểm thử tốt đúng với <em>mọi</em> mô hình.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-2.1.1</strong> — Giải thích quan hệ giữa hoạt động phát triển và hoạt động kiểm thử trong vòng đời (K2).</li>
<li><strong>LO-2.1.2</strong> — Nêu lý do mô hình vòng đời phải được điều chỉnh theo ngữ cảnh dự án và sản phẩm (K1).</li>
</ul>
<p>Chương 2 chiếm <strong>5/40</strong> câu trong đề.</p></div>
<table>
<thead><tr><th></th><th>Tuần tự (waterfall, V)</th><th>Lặp &amp; tăng dần (RUP, Scrum, Kanban, spiral)</th></tr></thead>
<tbody>
<tr><td>Dòng chảy</td><td>một lượt tuyến tính; pha sau bắt đầu khi pha trước xong</td><td>nhiều vòng ngắn; mỗi vòng ra phần mềm chạy được</td></tr>
<tr><td>Kiểm thử diễn ra khi nào</td><td>waterfall: ở cuối; V-model: lập kế hoạch từ đầu, thực thi ở nhánh phải</td><td>trong mọi iteration, các cấp test chồng lên nhau</td></tr>
<tr><td>Test basis</td><td>tài liệu chính thức, đầy đủ</td><td>user story, ít hình thức, hay thay đổi</td></tr>
<tr><td>Rủi ro kiểm thử chính</td><td>phát hiện lỗi muộn, phản hồi đắt</td><td>regression phình theo mỗi vòng → cần tự động hoá</td></tr>
</tbody>
</table>`),
    walkHead(D, 1, 35),
    walk(D, [
      [1, 'Testing throughout the Software Life Cycle (cover)',
        `<p class="y-chinh">🎯 Cover of Chapter 2 — the second of the six boxes on the ISTQB map ("2 Lifecycle" highlighted).</p>`,
        `<p class="y-chinh">🎯 Bìa Chương 2 — ô thứ hai trong sơ đồ sáu ô của ISTQB (ô "2 Lifecycle" được tô).</p>`],
      [2, 'CONTENT',
        `<p class="y-chinh">🎯 The chapter has four blocks.</p>
<ol>
<li><strong>SDLC models</strong> — this lesson</li>
<li><strong>Test levels</strong> — lessons 2.2–2.3</li>
<li><strong>Test types</strong> — lesson 2.4</li>
<li><strong>Maintenance testing</strong> — lesson 2.5</li>
</ol>`,
        `<p class="y-chinh">🎯 Chương này có bốn khối.</p>
<ol>
<li><strong>Mô hình SDLC</strong> — bài này</li>
<li><strong>Các cấp test</strong> — bài 2.2–2.3</li>
<li><strong>Các loại test</strong> — bài 2.4</li>
<li><strong>Kiểm thử bảo trì</strong> — bài 2.5</li>
</ol>`],
      [3, 'Software Development Lifecycle',
        `<p class="y-chinh">🎯 A lifecycle model describes the <strong>types of activity</strong> at each stage of a software project and how they relate <strong>logically and chronologically</strong>.</p>
<p class="nhan">The wheel — the usual six stages</p>
<ol>
<li>Planning</li>
<li>Analysis</li>
<li>Design</li>
<li>Implementation</li>
<li>Testing &amp; integration</li>
<li>Maintenance</li>
</ol>`,
        `<p class="y-chinh">🎯 Mô hình vòng đời mô tả <strong>các loại hoạt động</strong> ở từng giai đoạn của dự án phần mềm và chúng liên hệ với nhau <strong>về logic lẫn thời gian</strong>.</p>
<p class="nhan">Bánh xe — sáu bước quen thuộc</p>
<ol>
<li>Lập kế hoạch</li>
<li>Phân tích</li>
<li>Thiết kế</li>
<li>Cài đặt</li>
<li>Kiểm thử &amp; tích hợp</li>
<li>Bảo trì</li>
</ol>`],
      [4, 'Characteristics of good testing (any lifecycle)',
        `<p class="y-chinh">🎯 Four rules of good testing hold in <em>every</em> lifecycle model — memorise them, a question always comes.</p>
<ol>
<li><strong>Corresponding test activity</strong> — for every development activity there is a matching test activity.</li>
<li><strong>Level-specific objectives</strong> — each test level has test objectives specific to that level.</li>
<li><strong>Early analysis &amp; design</strong> — test analysis and design for a level begin <em>during</em> the corresponding development activity, not after it.</li>
<li><strong>Testers in the discussion</strong> — testers help define and refine requirements and design, and review work products.</li>
</ol>`,
        `<p class="y-chinh">🎯 Bốn quy tắc của kiểm thử tốt đúng với <em>mọi</em> mô hình vòng đời — phải thuộc, đề chắc chắn hỏi.</p>
<ol>
<li><strong>Hoạt động test tương ứng</strong> — mỗi hoạt động phát triển có một hoạt động kiểm thử tương ứng.</li>
<li><strong>Mục tiêu riêng cho từng cấp</strong> — mỗi cấp test có mục tiêu test riêng của cấp đó.</li>
<li><strong>Phân tích &amp; thiết kế sớm</strong> — phân tích và thiết kế test cho một cấp bắt đầu <em>ngay trong</em> hoạt động phát triển tương ứng, không đợi làm xong.</li>
<li><strong>Tester tham gia thảo luận</strong> — tester góp phần xác định, làm mịn yêu cầu và thiết kế, và review các sản phẩm công việc.</li>
</ol>`],
      [5, 'SDLC models: sequential vs iterative & incremental',
        `<p class="y-chinh">🎯 The syllabus names two families of SDLC models; every model on the next slides belongs to one of them.</p>
<ul>
<li><strong>Sequential</strong> — waterfall, V-model (slides 6–13)</li>
<li><strong>Iterative &amp; incremental</strong> — RUP, Scrum, Kanban, spiral (slides 14–21)</li>
</ul>`,
        `<p class="y-chinh">🎯 Syllabus nêu tên hai họ mô hình SDLC; mọi mô hình ở các slide sau đều thuộc một trong hai họ này.</p>
<ul>
<li><strong>Tuần tự (sequential)</strong> — waterfall, V-model (slide 6–13)</li>
<li><strong>Lặp &amp; tăng dần (iterative &amp; incremental)</strong> — RUP, Scrum, Kanban, spiral (slide 14–21)</li>
</ul>`],
      [6, 'Sequential Development Models',
        `<p class="y-chinh">🎯 A sequential model is a linear flow: each phase begins when the previous one is complete.</p>
<ul>
<li><strong>In theory</strong> — phases do not overlap.</li>
<li><strong>In practice</strong> — early feedback from the following phase is beneficial.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mô hình tuần tự là dòng chảy tuyến tính: pha nào cũng bắt đầu khi pha trước đã xong.</p>
<ul>
<li><strong>Về lý thuyết</strong> — các pha không chồng lấn.</li>
<li><strong>Thực tế</strong> — nhận phản hồi sớm từ pha sau là có lợi.</li>
</ul>`],
      [7, 'Waterfall Model',
        `<p class="y-chinh">🎯 In the waterfall, <strong>testing happens towards the end</strong> — so defects surface close to go-live.</p>
<p class="nhan">The flow</p>
<p>Requirements → design → development → testing → deployment → maintenance, one after another.</p>
<p class="nhan">The three consequences</p>
<ol>
<li><strong>Sequential completion</strong> — development activities are completed one after another.</li>
<li><strong>Late defects</strong> — testing comes late, so defects are found close to the live deployment date.</li>
<li><strong>Costly feedback</strong> — feedback flowing "back up the waterfall" is difficult, and the cost of change is high.</li>
</ol>
<p class="ghi-chu">The speaker notes repeat the same three points in Vietnamese.</p>`,
        `<p class="y-chinh">🎯 Trong waterfall, <strong>kiểm thử diễn ra ở cuối vòng đời</strong> — nên lỗi lộ ra sát ngày go-live.</p>
<p class="nhan">Dòng chảy</p>
<p>Yêu cầu → thiết kế → phát triển → kiểm thử → triển khai → bảo trì, lần lượt từng pha.</p>
<p class="nhan">Ba hệ quả</p>
<ol>
<li><strong>Xong pha này mới tới pha kia</strong> — các hoạt động phát triển lần lượt được hoàn thành.</li>
<li><strong>Lỗi phát hiện muộn</strong> — kiểm thử đến muộn nên lỗi được tìm ra sát ngày triển khai thật.</li>
<li><strong>Phản hồi đắt</strong> — đưa phản hồi "ngược lên thác nước" rất khó, và chi phí thay đổi cao.</li>
</ol>
<p class="ghi-chu">Ghi chú của thầy/cô nhắc lại đúng ba ý này bằng tiếng Việt.</p>`],
      [8, 'V-Model: test levels',
        `<p class="y-chinh">🎯 The V pairs each development level on the left with a test level on the right.</p>
<p class="nhan">The four pairs (top to bottom)</p>
<ol>
<li><strong>User requirements</strong> ↔ acceptance testing</li>
<li><strong>Software specifications</strong> ↔ system testing</li>
<li><strong>High-level design</strong> ↔ integration testing</li>
<li><strong>Detailed design</strong> ↔ component testing</li>
</ol>
<p class="nhan">Reading the picture</p>
<ul>
<li><strong>Left arm</strong> — requirements and design.</li>
<li><strong>Bottom</strong> — implementation (development).</li>
<li><strong>Right arm</strong> (orange) — testing.</li>
</ul>`,
        `<p class="y-chinh">🎯 Chữ V ghép mỗi mức phát triển bên trái với một cấp test bên phải.</p>
<p class="nhan">Bốn cặp (từ trên xuống)</p>
<ol>
<li><strong>Yêu cầu người dùng</strong> ↔ acceptance testing</li>
<li><strong>Đặc tả phần mềm</strong> ↔ system testing</li>
<li><strong>Thiết kế tổng thể</strong> ↔ integration testing</li>
<li><strong>Thiết kế chi tiết</strong> ↔ component testing</li>
</ol>
<p class="nhan">Đọc hình</p>
<ul>
<li><strong>Nhánh trái</strong> — yêu cầu và thiết kế.</li>
<li><strong>Đáy</strong> — cài đặt (phát triển).</li>
<li><strong>Nhánh phải</strong> (màu cam) — kiểm thử.</li>
</ul>`],
      [9, 'V-Model: late test design',
        `<p class="y-chinh">🎯 Designing tests only on the right arm brings back the waterfall's problem.</p>
<ul>
<li><strong>What the slide shows</strong> — tests for every level are <strong>designed</strong> only when you reach the right arm ("Design tests?" at the bottom right).</li>
<li><strong>Why it hurts</strong> — the test basis is never checked until the code exists.</li>
</ul>`,
        `<p class="y-chinh">🎯 Chỉ thiết kế test khi tới nhánh phải là rước lại đúng vấn đề của waterfall.</p>
<ul>
<li><strong>Slide cho thấy</strong> — test cho từng cấp chỉ được <strong>thiết kế</strong> khi đã tới nhánh phải ("Design tests?" ở góc dưới phải).</li>
<li><strong>Vì sao có hại</strong> — test basis không được kiểm tra cho tới khi đã có code.</li>
</ul>`],
      [10, 'V-Model: early test design',
        `<p class="y-chinh">🎯 The correct use of the V: design tests on the left, run them on the right.</p>
<ul>
<li><strong>Design tests</strong> — on the left arm, as soon as each requirement or design document exists.</li>
<li><strong>Run tests</strong> — on the right arm, once the code exists.</li>
</ul>
<p>This is Principle 3 (early testing) applied to the lifecycle.</p>`,
        `<p class="y-chinh">🎯 Cách dùng đúng của chữ V: thiết kế test ở nhánh trái, chạy test ở nhánh phải.</p>
<ul>
<li><strong>Thiết kế test</strong> — ở nhánh trái, ngay khi có từng tài liệu yêu cầu/thiết kế.</li>
<li><strong>Chạy test</strong> — ở nhánh phải, khi đã có code.</li>
</ul>
<p>Đó là Nguyên tắc 3 (kiểm thử sớm) áp vào vòng đời.</p>`],
      [11, 'Early test design',
        `<p class="y-chinh">🎯 Early test design helps to build quality and stops fault multiplication (the pink box).</p>
<p class="nhan">Why it pays — six reasons</p>
<ol>
<li><strong>Test design finds faults</strong> — the act of designing tests exposes them.</li>
<li><strong>Cheaper</strong> — faults found early are cheaper to fix.</li>
<li><strong>Most significant first</strong> — the most important faults are found first.</li>
<li><strong>Prevented, not built in</strong> — faults are stopped before they enter the code.</li>
<li><strong>No extra effort</strong> — you only re-schedule test design earlier.</li>
<li><strong>May change requirements</strong> — test design can force requirement changes, and that is a good thing.</li>
</ol>
<p class="ghi-chu">The deck's hidden slides tell a real story — see the box after the walkthrough.</p>`,
        `<p class="y-chinh">🎯 Thiết kế test sớm giúp xây chất lượng và chặn lỗi nhân lên (khung hồng).</p>
<p class="nhan">Vì sao đáng làm — sáu lý do</p>
<ol>
<li><strong>Thiết kế test tìm ra lỗi</strong> — chính việc thiết kế test làm lỗi lộ ra.</li>
<li><strong>Rẻ hơn</strong> — lỗi tìm sớm thì sửa rẻ hơn.</li>
<li><strong>Lỗi quan trọng nhất ra trước</strong> — những lỗi nghiêm trọng nhất được tìm trước.</li>
<li><strong>Ngăn chứ không "xây vào"</strong> — lỗi bị chặn trước khi lọt vào code.</li>
<li><strong>Không tốn thêm công</strong> — chỉ dời việc thiết kế test lên sớm.</li>
<li><strong>Có thể khiến yêu cầu phải sửa</strong> — thiết kế test làm yêu cầu thay đổi, và đó là điều tốt.</li>
</ol>
<p class="ghi-chu">Các slide ẩn kể một câu chuyện có thật — xem khung sau phần slide.</p>`],
      [12, 'VV&T — verification, validation, testing (BS 7925-1)',
        `<p class="y-chinh">🎯 Three formal definitions from BS 7925-1 — verification, validation and testing are not the same thing.</p>
<ul>
<li><strong>Verification</strong> — evaluating whether the products of a development phase satisfy the conditions imposed at the <em>start</em> of that phase.</li>
<li><strong>Validation</strong> — determining correctness with respect to the <em>user needs and requirements</em>.</li>
<li><strong>Testing</strong> — exercising software to verify it satisfies specified requirements, is fit for purpose, and to detect faults.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> verification = "built it right?" (against the phase's own conditions); validation = "built the right thing?" (against the user).</p>`,
        `<p class="y-chinh">🎯 Ba định nghĩa chính thức theo BS 7925-1 — verification, validation và testing là ba việc khác nhau.</p>
<ul>
<li><strong>Verification</strong> — đánh giá sản phẩm của một pha có thoả điều kiện đặt ra ở <em>đầu</em> pha đó không.</li>
<li><strong>Validation</strong> — xác định tính đúng đắn so với <em>nhu cầu và yêu cầu của người dùng</em>.</li>
<li><strong>Testing</strong> — chạy phần mềm để verify nó thoả yêu cầu đã đặc tả, phù hợp mục đích, và để phát hiện lỗi.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> verification = "làm có đúng không?" (so với điều kiện của chính pha đó); validation = "làm có đúng thứ cần không?" (so với người dùng).</p>`],
      [13, 'Verification, validation and testing on the V',
        `<p class="y-chinh">🎯 Any work product can be verified, validated and tested — the diagram shows all three at once.</p>
<p class="nhan">The big box ("Any")</p>
<ul>
<li><strong>Verification</strong> — the loop: checked against the phase that produced it.</li>
<li><strong>Validation</strong> — the arrow up: checked against the user's needs.</li>
<li><strong>Testing</strong> — the arrow right: exercised.</li>
</ul>
<p class="nhan">The small V</p>
<ul>
<li><strong>Horizontal links</strong> — verification between matching levels.</li>
<li><strong>Green arrows</strong> — climbing the right arm, they lead to validation at the top.</li>
</ul>`,
        `<p class="y-chinh">🎯 Sản phẩm công việc nào cũng có thể được verify, validate và test — hình vẽ cả ba cùng lúc.</p>
<p class="nhan">Ô lớn ("Any")</p>
<ul>
<li><strong>Verification</strong> — vòng lặp: kiểm so với pha tạo ra nó.</li>
<li><strong>Validation</strong> — mũi tên lên: kiểm so với nhu cầu người dùng.</li>
<li><strong>Testing</strong> — mũi tên sang phải: cho chạy thử.</li>
</ul>
<p class="nhan">Chữ V nhỏ</p>
<ul>
<li><strong>Các đường ngang</strong> — verification giữa hai mức tương ứng.</li>
<li><strong>Mũi tên xanh</strong> — leo dọc nhánh phải, dẫn tới validation ở đỉnh.</li>
</ul>`],
      [14, 'Incremental Development Models',
        `<p class="y-chinh">🎯 Incremental development builds the system <strong>in pieces</strong>: features grow increment by increment.</p>
<ul>
<li><strong>Every piece is a mini-project</strong> — requirements, design, build and test are done per piece.</li>
<li><strong>Size varies</strong> — some methods use large pieces, others pieces as small as one UI-screen change or a new query option.</li>
<li><strong>Early value</strong> — working parts of the system appear early, and each can be released to the customer.</li>
</ul>`,
        `<p class="y-chinh">🎯 Phát triển tăng dần xây hệ thống <strong>theo từng phần</strong>: tính năng lớn dần qua từng đợt.</p>
<ul>
<li><strong>Mỗi phần là một dự án nhỏ</strong> — yêu cầu, thiết kế, xây dựng và kiểm thử được làm cho từng phần.</li>
<li><strong>Kích thước khác nhau</strong> — có phương pháp chia miếng lớn, có cái nhỏ tới mức một thay đổi trên màn hình hay một tuỳ chọn truy vấn mới.</li>
<li><strong>Có giá trị sớm</strong> — các phần chạy được ra đời sớm, và mỗi phần có thể giao cho khách hàng.</li>
</ul>`],
      [15, 'Iterative Development Models',
        `<p class="y-chinh">🎯 Iterative development starts with a rough product and <strong>refines it in iterations</strong> (a rework strategy).</p>
<ul>
<li><strong>Change is allowed</strong> — an iteration may change features built in earlier iterations, and the project scope.</li>
<li><strong>Delivery</strong> — officially only the final version goes to the customer; in practice, intermediate versions go to selected customers for feedback.</li>
<li><strong>Growing subset</strong> — each iteration delivers working software with a growing subset of the features, until the final software is delivered or development is stopped.</li>
</ul>`,
        `<p class="y-chinh">🎯 Phát triển lặp bắt đầu bằng một sản phẩm thô rồi <strong>tinh chỉnh dần qua các vòng lặp</strong> (chiến lược làm lại).</p>
<ul>
<li><strong>Được phép thay đổi</strong> — vòng sau có thể sửa tính năng đã làm ở vòng trước, và cả phạm vi dự án.</li>
<li><strong>Bàn giao</strong> — chính thức chỉ bản cuối được giao cho khách; thực tế các bản trung gian được gửi cho một số khách hàng chọn lọc để lấy phản hồi.</li>
<li><strong>Tập con lớn dần</strong> — mỗi vòng ra phần mềm chạy được, là tập con tính năng lớn dần, cho tới khi bản cuối được giao hoặc dự án dừng.</li>
</ul>`],
      [16, 'Testing in incremental & iterative development',
        `<p class="y-chinh">🎯 In iterative &amp; incremental models the same test tasks happen, but with different timing and extent.</p>
<p class="nhan">When each task happens</p>
<ul>
<li><strong>Start of the project</strong> — high-level test planning and test analysis.</li>
<li><strong>Start of each iteration/increment</strong> — detailed test planning, analysis, design and implementation.</li>
<li><strong>Execution</strong> — test levels overlap.</li>
</ul>
<p class="nhan">Common issues</p>
<ol>
<li><strong>More regression testing</strong></li>
<li><strong>Defects outside the scope</strong> of the current iteration/increment</li>
<li><strong>Less thorough testing</strong></li>
</ol>`,
        `<p class="y-chinh">🎯 Trong mô hình lặp &amp; tăng dần vẫn là các việc test đó, nhưng khác thời điểm và mức độ.</p>
<p class="nhan">Việc nào diễn ra lúc nào</p>
<ul>
<li><strong>Đầu dự án</strong> — lập kế hoạch và phân tích test mức cao.</li>
<li><strong>Đầu mỗi vòng lặp/phần tăng</strong> — lập kế hoạch chi tiết, phân tích, thiết kế và triển khai test.</li>
<li><strong>Thực thi</strong> — các cấp test chồng lấn nhau.</li>
</ul>
<p class="nhan">Vấn đề thường gặp</p>
<ol>
<li><strong>Regression nhiều hơn</strong></li>
<li><strong>Defect nằm ngoài phạm vi</strong> của vòng/phần tăng hiện tại</li>
<li><strong>Test kém kỹ hơn</strong></li>
</ol>`],
      [17, 'Rational Unified Process (RUP) — the hump chart',
        `<p class="y-chinh">🎯 The RUP "hump chart": the <em>test</em> workflow is present in every phase, not only at the end.</p>
<p class="nhan">How to read it</p>
<ul>
<li><strong>Across the top</strong> — four phases: inception, elaboration, construction, transition.</li>
<li><strong>Down the side</strong> — workflows: business modelling, requirements, analysis &amp; design, implementation, test, deployment, configuration &amp; change management, project management, environment.</li>
<li><strong>Along the bottom</strong> — the iterations.</li>
<li><strong>Coloured humps</strong> — how much of each workflow happens in each phase.</li>
</ul>`,
        `<p class="y-chinh">🎯 Biểu đồ "bướu" của RUP: luồng <em>test</em> có mặt ở mọi pha, không chỉ ở cuối.</p>
<p class="nhan">Cách đọc</p>
<ul>
<li><strong>Hàng trên</strong> — bốn pha: inception, elaboration, construction, transition.</li>
<li><strong>Cột trái</strong> — các luồng công việc: mô hình nghiệp vụ, yêu cầu, phân tích &amp; thiết kế, cài đặt, kiểm thử, triển khai, quản lý cấu hình &amp; thay đổi, quản lý dự án, môi trường.</li>
<li><strong>Hàng dưới</strong> — các vòng lặp.</li>
<li><strong>Các "bướu" màu</strong> — lượng công việc của từng luồng trong từng pha.</li>
</ul>`],
      [18, 'RUP characteristics',
        `<p class="y-chinh">🎯 RUP is iterative with <strong>long iterations (months)</strong> and <strong>risk as the primary driver</strong> of decisions.</p>
<ul>
<li><strong>Risk-driven</strong> — risk is the main input for every decision.</li>
<li><strong>Continuous quality evaluation</strong> — including testing, throughout development.</li>
<li><strong>Relatively long iterations</strong> — months.</li>
<li><strong>Large increments</strong> — e.g. two or three groups of related features.</li>
</ul>
<p>Compare with Scrum on the next slide.</p>`,
        `<p class="y-chinh">🎯 RUP là mô hình lặp có <strong>vòng lặp dài (vài tháng)</strong> và lấy <strong>rủi ro làm động lực chính</strong> cho quyết định.</p>
<ul>
<li><strong>Dựa trên rủi ro</strong> — rủi ro là căn cứ chính cho mọi quyết định.</li>
<li><strong>Đánh giá chất lượng liên tục</strong> — gồm cả kiểm thử, suốt quá trình phát triển.</li>
<li><strong>Vòng lặp tương đối dài</strong> — vài tháng.</li>
<li><strong>Phần tăng lớn</strong> — vd hai, ba nhóm tính năng liên quan.</li>
</ul>
<p>So sánh với Scrum ở slide sau.</p>`],
      [19, 'Scrum',
        `<p class="y-chinh">🎯 Scrum uses <strong>short iterations (days to a few weeks)</strong> with correspondingly small increments.</p>
<p class="nhan">The cycle on the picture</p>
<ol>
<li><strong>Product backlog</strong></li>
<li><strong>Sprint planning</strong> → sprint backlog</li>
<li><strong>Sprint</strong> — 1–4 weeks, with a daily stand-up every 24 hours</li>
<li><strong>Finished work</strong> → sprint review and retrospective</li>
</ol>
<p class="nhan">Size of an increment</p>
<p>A few enhancements and/or two or three new features.</p>`,
        `<p class="y-chinh">🎯 Scrum dùng <strong>vòng lặp ngắn (vài ngày tới vài tuần)</strong> với phần tăng nhỏ tương ứng.</p>
<p class="nhan">Chu trình trên hình</p>
<ol>
<li><strong>Product backlog</strong></li>
<li><strong>Họp lập kế hoạch sprint</strong> → sprint backlog</li>
<li><strong>Sprint</strong> — 1–4 tuần, có họp đứng mỗi 24 giờ</li>
<li><strong>Sản phẩm hoàn thành</strong> → sprint review và retrospective</li>
</ol>
<p class="nhan">Kích thước phần tăng</p>
<p>Vài cải tiến và/hoặc hai, ba tính năng mới.</p>`],
      [20, 'Kanban',
        `<p class="y-chinh">🎯 Kanban's key principle is a <strong>limit on work in progress (WIP)</strong>.</p>
<ul>
<li><strong>The board</strong> — columns (analysis, design, develop, testing, UAT &amp; SIT, deploy) fed from a prioritised queue.</li>
<li><strong>Iterations optional</strong> — runs with or without fixed-length iterations.</li>
<li><strong>Delivery</strong> — one enhancement or feature at a time as soon as it is done, or several features grouped into one release.</li>
</ul>`,
        `<p class="y-chinh">🎯 Nguyên tắc chính của Kanban là <strong>giới hạn số việc đang làm (WIP)</strong>.</p>
<ul>
<li><strong>Bảng Kanban</strong> — các cột (phân tích, thiết kế, phát triển, kiểm thử, UAT &amp; SIT, triển khai) lấy việc từ một hàng đợi đã ưu tiên.</li>
<li><strong>Vòng lặp là tuỳ chọn</strong> — chạy có hoặc không có vòng lặp độ dài cố định.</li>
<li><strong>Bàn giao</strong> — từng cải tiến/tính năng một ngay khi xong, hoặc gom nhiều tính năng phát hành một lần.</li>
</ul>`],
      [21, 'Spiral (prototyping)',
        `<p class="y-chinh">🎯 The spiral (prototyping) model creates <strong>experimental increments</strong> — some are heavily reworked or even abandoned later.</p>
<p class="nhan">One loop of the spiral</p>
<ol>
<li><strong>Determine objectives</strong></li>
<li><strong>Identify and resolve risks</strong> — build prototypes</li>
<li><strong>Develop and test</strong></li>
<li><strong>Plan the next iteration</strong></li>
</ol>`,
        `<p class="y-chinh">🎯 Mô hình xoắn ốc (prototyping) tạo ra <strong>các phần tăng thử nghiệm</strong> — có cái bị làm lại nhiều hoặc thậm chí bỏ hẳn về sau.</p>
<p class="nhan">Một vòng xoắn</p>
<ol>
<li><strong>Xác định mục tiêu</strong></li>
<li><strong>Nhận diện và xử lý rủi ro</strong> — làm prototype</li>
<li><strong>Phát triển và kiểm thử</strong></li>
<li><strong>Lập kế hoạch vòng sau</strong></li>
</ol>`],
      [22, 'Agile development',
        `<p class="y-chinh">🎯 Six typical Agile practices — several of them put testing at the centre of development.</p>
<ol>
<li><strong>Business (user) stories</strong> — define the functionality.</li>
<li><strong>On-site customer</strong> — gives continual feedback and defines/performs functional acceptance tests.</li>
<li><strong>Pair programming &amp; shared code ownership</strong> — among the developers.</li>
<li><strong>Test-first (TDD)</strong> — component tests are written <em>before</em> the code, and automated.</li>
<li><strong>Simplicity</strong> — build only what is necessary, not everything we can think of.</li>
<li><strong>Continuous integration</strong> — code integrated and tested throughout the sprint, at least once a day.</li>
</ol>`,
        `<p class="y-chinh">🎯 Sáu thực hành điển hình của Agile — nhiều cái đặt kiểm thử vào trung tâm việc phát triển.</p>
<ol>
<li><strong>User story</strong> — định nghĩa chức năng.</li>
<li><strong>Khách hàng ngồi cùng nhóm</strong> — phản hồi liên tục và xác định/thực hiện acceptance test chức năng.</li>
<li><strong>Lập trình cặp &amp; sở hữu code chung</strong> — giữa các developer.</li>
<li><strong>Test trước (TDD)</strong> — component test viết <em>trước</em> code, và được tự động hoá.</li>
<li><strong>Đơn giản</strong> — chỉ làm cái cần thiết, không làm mọi thứ nghĩ ra được.</li>
<li><strong>Tích hợp liên tục</strong> — code được tích hợp và test suốt sprint, ít nhất mỗi ngày một lần.</li>
</ol>`],
      [23, 'Agile: benefits for testers',
        `<p class="y-chinh">🎯 Five ways Agile makes life better for testers.</p>
<ol>
<li><strong>Working software</strong> — the focus is on software that works and on good-quality code.</li>
<li><strong>Testing from the start</strong> — testing is part of development and its starting point.</li>
<li><strong>Accessible business stakeholders</strong> — questions about the system get answered.</li>
<li><strong>Self-organising teams</strong> — more autonomy for testers.</li>
<li><strong>Simple designs</strong> — easier to test.</li>
</ol>`,
        `<p class="y-chinh">🎯 Năm điểm Agile giúp công việc của tester dễ chịu hơn.</p>
<ol>
<li><strong>Phần mềm chạy được</strong> — tập trung vào phần mềm chạy tốt và code chất lượng.</li>
<li><strong>Test ngay từ đầu</strong> — kiểm thử là một phần, và là điểm khởi đầu, của phát triển.</li>
<li><strong>Dễ gặp người nghiệp vụ</strong> — câu hỏi về hệ thống được giải đáp.</li>
<li><strong>Nhóm tự tổ chức</strong> — tester có nhiều quyền tự chủ hơn.</li>
<li><strong>Thiết kế đơn giản</strong> — dễ test hơn.</li>
</ol>`],
      [24, 'Agile: challenges for testers',
        `<p class="y-chinh">🎯 Five challenges Agile brings for testers.</p>
<ol>
<li><strong>Different test basis</strong> — less formal and subject to change.</li>
<li><strong>Misperception</strong> — that testers are not needed.</li>
<li><strong>Different role</strong> — the tester is more like a coach.</li>
<li><strong>Time pressure</strong> — (usually) constant.</li>
<li><strong>Inadequate automated regression suite</strong> — a real risk.</li>
</ol>
<p class="ghi-chu">Topic 8 (Agile Tester) develops these in depth.</p>`,
        `<p class="y-chinh">🎯 Năm thách thức Agile đặt ra cho tester.</p>
<ol>
<li><strong>Test basis khác</strong> — ít hình thức và hay thay đổi.</li>
<li><strong>Ngộ nhận</strong> — rằng không cần tester.</li>
<li><strong>Vai trò khác</strong> — tester giống huấn luyện viên hơn.</li>
<li><strong>Áp lực thời gian</strong> — (thường) liên tục.</li>
<li><strong>Bộ regression tự động không đủ</strong> — một rủi ro có thật.</li>
</ol>
<p class="ghi-chu">Topic 8 (Agile Tester) đi sâu các ý này.</p>`],
      [25, 'Question — what does the SDLC describe?',
        `<p class="y-chinh">🎯 The SDLC describes the types of activities in a software project — slide 3 word for word.</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>B</strong> — limits it to <em>test</em> activities only.</li>
<li><strong>C</strong> — describes a requirements document, not a lifecycle.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — The types of activities performed in software development projects.</strong></p>`,
        `<p class="y-chinh">🎯 SDLC mô tả các loại hoạt động trong dự án phần mềm — đúng từng chữ slide 3.</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>B</strong> — chỉ nói hoạt động <em>test</em>.</li>
<li><strong>C</strong> — là mô tả tài liệu yêu cầu, không phải vòng đời.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Các loại hoạt động thực hiện trong dự án phát triển phần mềm.</strong></p>`],
      [26, 'Question — characteristics of good testing',
        `<p class="y-chinh">🎯 Statements 1, 3 and 4 are on slide 4; statement 2 contradicts it.</p>
<ul>
<li><strong>1, 3, 4 — correct</strong> — level-specific objectives, a test activity for every development activity, testers in requirement/design discussions.</li>
<li><strong>2 — wrong</strong> — analysis and design for a level should begin <em>during</em> the corresponding development activity, not at its end.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — 1, 3, 4 correct; 2 wrong.</strong></p>`,
        `<p class="y-chinh">🎯 Câu 1, 3 và 4 có trên slide 4; câu 2 trái với slide đó.</p>
<ul>
<li><strong>1, 3, 4 — đúng</strong> — mục tiêu riêng cho từng cấp, mỗi hoạt động phát triển có hoạt động test tương ứng, tester tham gia thảo luận yêu cầu/thiết kế.</li>
<li><strong>2 — sai</strong> — phân tích và thiết kế test cho một cấp phải bắt đầu <em>trong khi</em> hoạt động phát triển tương ứng diễn ra, không đợi tới cuối.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — 1, 3, 4 đúng; 2 sai.</strong></p>`],
      [27, 'Question — best definition of an incremental model',
        `<p class="y-chinh">🎯 Incremental = requirements, design and testing repeated in a series, each time adding a piece (slide 14).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>B</strong> — "a phase begins when the previous one is complete" describes sequential models.</li>
<li><strong>C</strong> — testing as a separate phase after development is the waterfall.</li>
<li><strong>D</strong> — "testing added as an increment" is nonsense.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Requirements, design and testing are done in a series with added pieces.</strong></p>`,
        `<p class="y-chinh">🎯 Tăng dần = yêu cầu, thiết kế, kiểm thử lặp lại thành chuỗi, mỗi lần thêm một phần (slide 14).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>B</strong> — "pha sau bắt đầu khi pha trước xong" là mô hình tuần tự.</li>
<li><strong>C</strong> — kiểm thử là một pha riêng sau phát triển là waterfall.</li>
<li><strong>D</strong> — "thêm kiểm thử như một phần tăng" là vô nghĩa.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Yêu cầu, thiết kế, kiểm thử được làm thành chuỗi, mỗi lần thêm một phần.</strong></p>`],
      [28, 'Question — true statement about the V-model',
        `<p class="y-chinh">🎯 In the V-model every development level has a matching test level — the two processes are integrated.</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — "testing starts when the code is complete" is the waterfall view.</li>
<li><strong>C</strong> — building in increments describes incremental models.</li>
<li><strong>D</strong> — only partly true of sequential models, and misses the point of the V.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — The test process is integrated with the development process.</strong></p>`,
        `<p class="y-chinh">🎯 Trong V-model mỗi mức phát triển có một cấp test tương ứng — hai quy trình được tích hợp với nhau.</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — "bắt đầu test khi code xong" là quan điểm waterfall.</li>
<li><strong>C</strong> — xây theo từng phần tăng là mô hình tăng dần.</li>
<li><strong>D</strong> — chỉ đúng một phần với mô hình tuần tự, và bỏ lỡ ý chính của chữ V.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Quy trình test được tích hợp với quy trình phát triển.</strong></p>`],
      [29, 'Question — the waterfall model',
        `<p class="y-chinh">🎯 Waterfall is sequential, and testing starts after development — the other two statements are false.</p>
<ul>
<li><strong>1 — correct</strong> — waterfall is a sequential model.</li>
<li><strong>2 — correct</strong> — test activities begin after development is finished.</li>
<li><strong>3 — wrong</strong> — it is not "the best model for small organisations".</li>
<li><strong>4 — wrong</strong> — it has no iterations.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — 1 and 2 correct; 3 and 4 wrong.</strong></p>`,
        `<p class="y-chinh">🎯 Waterfall là tuần tự và kiểm thử bắt đầu sau phát triển — hai câu còn lại sai.</p>
<ul>
<li><strong>1 — đúng</strong> — waterfall là mô hình tuần tự.</li>
<li><strong>2 — đúng</strong> — hoạt động test bắt đầu sau khi phát triển xong.</li>
<li><strong>3 — sai</strong> — nó không phải "mô hình tốt nhất cho tổ chức nhỏ".</li>
<li><strong>4 — sai</strong> — nó không có vòng lặp.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — 1 và 2 đúng; 3 và 4 sai.</strong></p>`],
      [30, 'Question — the V-model is a…',
        `<p class="y-chinh">🎯 The V is a sequential model that adds early test design.</p>
<ul>
<li><strong>Sequential</strong> — one pass down the left arm and up the right; a phase starts when the previous ends.</li>
<li><strong>Not iterative, not incremental</strong> — there are no repeated cycles and no pieces delivered one by one.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Sequential model.</strong></p>`,
        `<p class="y-chinh">🎯 V-model là mô hình tuần tự có thêm thiết kế test sớm.</p>
<ul>
<li><strong>Tuần tự</strong> — một lượt xuống nhánh trái rồi lên nhánh phải; pha sau bắt đầu khi pha trước xong.</li>
<li><strong>Không lặp, không tăng dần</strong> — không có vòng lặp lại và không giao từng phần một.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Mô hình tuần tự.</strong></p>`],
      [31, 'Question — where does the client see the product?',
        `<p class="y-chinh">🎯 The client sees the product at the top of the right arm — acceptance testing.</p>
<ul>
<li><strong>Pairing</strong> — acceptance testing is paired with user requirements (slide 8).</li>
<li><strong>Purpose</strong> — it is where the customer validates the product and gives feedback on its quality.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — Acceptance testing.</strong></p>`,
        `<p class="y-chinh">🎯 Khách hàng thấy sản phẩm ở đỉnh nhánh phải — acceptance testing.</p>
<ul>
<li><strong>Cặp ghép</strong> — acceptance testing ghép với yêu cầu người dùng (slide 8).</li>
<li><strong>Mục đích</strong> — đó là nơi khách hàng validate sản phẩm và phản hồi về chất lượng.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — Acceptance testing.</strong></p>`],
      [32, 'Question — waterfall vs V-model',
        `<p class="y-chinh">🎯 The real difference: the V-model applies early testing, the waterfall does not.</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — both models are sequential; the V is not iterative.</li>
<li><strong>C</strong> — "one type of requirements vs two" is invented.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — In the V-model the principle of early testing is applied; in waterfall it is not.</strong></p>`,
        `<p class="y-chinh">🎯 Khác biệt thật sự: V-model áp dụng kiểm thử sớm, waterfall thì không.</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — cả hai đều tuần tự; V-model không phải mô hình lặp.</li>
<li><strong>C</strong> — "một loại yêu cầu so với hai loại" là bịa.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — V-model áp dụng nguyên tắc kiểm thử sớm; waterfall thì không.</strong></p>`],
      [33, 'Question — length of RUP iterations',
        `<p class="y-chinh">🎯 RUP iterations are relatively long — months, not weeks (slide 18).</p>
<ul>
<li><strong>RUP</strong> — iterations last months; increments are large.</li>
<li><strong>Option A (one to four weeks)</strong> — that is Scrum's short cycle (slide 19).</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Relatively long (two to three months).</strong></p>`,
        `<p class="y-chinh">🎯 Vòng lặp RUP tương đối dài — tính bằng tháng, không phải tuần (slide 18).</p>
<ul>
<li><strong>RUP</strong> — vòng lặp kéo dài vài tháng; phần tăng lớn.</li>
<li><strong>Phương án A (một đến bốn tuần)</strong> — đó là chu kỳ ngắn của Scrum (slide 19).</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Tương đối dài (hai đến ba tháng).</strong></p>`],
      [34, 'Question — Scrum',
        `<p class="y-chinh">🎯 Only the retrospective statement is true of Scrum.</p>
<ul>
<li><strong>1 — wrong</strong> — sprints are short (days to a few weeks), not 2–3 months.</li>
<li><strong>2 — wrong</strong> — testers do not own the requirements document; in Scrum the product owner owns the backlog.</li>
<li><strong>3 — correct</strong> — a retrospective closes each sprint.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — 3 correct; 1 and 2 wrong.</strong></p>`,
        `<p class="y-chinh">🎯 Chỉ câu về retrospective là đúng với Scrum.</p>
<ul>
<li><strong>1 — sai</strong> — sprint ngắn (vài ngày tới vài tuần), không phải 2–3 tháng.</li>
<li><strong>2 — sai</strong> — tester không chịu trách nhiệm viết tài liệu yêu cầu; trong Scrum product owner giữ backlog.</li>
<li><strong>3 — đúng</strong> — mỗi sprint kết thúc bằng retrospective.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — 3 đúng; 1 và 2 sai.</strong></p>`],
      [35, 'Question — Kanban',
        `<p class="y-chinh">🎯 Kanban runs with or without fixed-length iterations — exactly slide 20.</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — iterations are optional, not fixed.</li>
<li><strong>B</strong> — activities overlap continuously on the board.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Implemented with or without fixed-length iterations.</strong></p>`,
        `<p class="y-chinh">🎯 Kanban chạy có hoặc không có vòng lặp độ dài cố định — đúng slide 20.</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — vòng lặp là tuỳ chọn, không cố định.</li>
<li><strong>B</strong> — các hoạt động chồng lên nhau liên tục trên bảng.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Chạy có hoặc không có vòng lặp độ dài cố định.</strong></p>`],
    ]),
    bi(`<h3>🔒 Hidden slides: an experience report on early test design (pptx 12–13)</h3>
<p>Source: Simon Barlow &amp; Alan Veitch, Scottish Widows, February 1996. Same kind of project, same plan of <strong>2 months development</strong>:</p>
<table>
<thead><tr><th></th><th>Phase 1 — tests designed late</th><th>Phase 2 — tests designed early</th></tr></thead>
<tbody>
<tr><td>Test period</td><td>2 months planned</td><td>6 weeks planned</td></tr>
<tr><td>Faults found in test</td><td>150</td><td>50</td></tr>
<tr><td>Faults in 1st month of live use</td><td><strong>50</strong></td><td><strong>0</strong></td></tr>
<tr><td>How it felt</td><td>fraught, lots of developer overtime; "has to go in" but didn't work</td><td>smooth, not much for developers to do; acceptance test a full week (vs half a day)</td></tr>
<tr><td>Outcome</td><td>users not happy</td><td>on time, happy users</td></tr>
</tbody>
</table>
<p>Designing tests early did not just move testing earlier — it prevented most faults from being built in (150 → 50 found in test) and none escaped to production.</p>
<div class="pitfall co-tieu-de"><strong>V-model trap.</strong> "In the V-model, testing starts when coding is finished" is false. Test <em>execution</em> for most levels comes after coding, but test <em>analysis and design</em> start on the left arm, in parallel with each development phase — that is the whole point of the V.</div>`,
    `<h3>🔒 Slide ẩn: báo cáo thực tế về thiết kế test sớm (pptx 12–13)</h3>
<p>Nguồn: Simon Barlow &amp; Alan Veitch, Scottish Widows, tháng 2/1996. Cùng loại dự án, cùng kế hoạch <strong>2 tháng phát triển</strong>:</p>
<table>
<thead><tr><th></th><th>Giai đoạn 1 — thiết kế test muộn</th><th>Giai đoạn 2 — thiết kế test sớm</th></tr></thead>
<tbody>
<tr><td>Thời gian test</td><td>kế hoạch 2 tháng</td><td>kế hoạch 6 tuần</td></tr>
<tr><td>Lỗi tìm được khi test</td><td>150</td><td>50</td></tr>
<tr><td>Lỗi trong tháng đầu vận hành</td><td><strong>50</strong></td><td><strong>0</strong></td></tr>
<tr><td>Không khí</td><td>căng thẳng, developer tăng ca nhiều; "phải lên" nhưng chạy không được</td><td>suôn sẻ, developer ít việc phải sửa; acceptance test trọn một tuần (so với nửa ngày)</td></tr>
<tr><td>Kết quả</td><td>người dùng không hài lòng</td><td>đúng hạn, người dùng hài lòng</td></tr>
</tbody>
</table>
<p>Thiết kế test sớm không chỉ dời việc test lên trước — nó ngăn phần lớn lỗi bị "xây vào" (150 → 50 lỗi khi test) và không lỗi nào lọt ra production.</p>
<div class="pitfall co-tieu-de"><strong>Bẫy V-model.</strong> "Trong V-model, kiểm thử bắt đầu khi code xong" là sai. <em>Thực thi</em> test của hầu hết các cấp đến sau khi code, nhưng <em>phân tích và thiết kế</em> test bắt đầu ngay ở nhánh trái, song song với từng pha phát triển — đó là toàn bộ ý nghĩa của chữ V.</div>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — choose and adapt a lifecycle</h3>
<p><strong>Context.</strong> A team of 6 builds (a) a payroll module for a bank, with a signed contract listing every calculation rule and a fixed go-live date; (b) a campus event app for students whose features will change after each user test.</p>
<ol>
<li><strong>(a) Payroll → V-model.</strong> Stable, contract-defined requirements and a regulatory context favour a sequential model with formal test levels. Adapt it with early test design: acceptance tests written from the contract in week 1, a formal review of the calculation spec.</li>
<li><strong>(b) Event app → Scrum.</strong> Changing needs and fast feedback favour short sprints. Adapt testing: acceptance criteria on every story, automated regression from sprint 1 (slide 24's risk), a demo to real students each sprint (validation).</li>
<li><strong>Why adapt (LO-2.1.2):</strong> project goals, product type, business priorities and risks (e.g. regulation, time-to-market) all change which model fits — and models are often combined (e.g. V-model for the core, Agile for the front end).</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>The W-model and DevOps.</strong>
<ul>
<li><strong>W-model</strong> — Paul Herzlich's <em>W-model</em> (1993) draws a second V next to the first, so every development step has an explicit <em>static</em> test step (review) as well as the dynamic one. It is the V-model with early test design made visible.</li>
<li><strong>DevOps</strong> — today's pipelines push the idea to its limit: every commit triggers build → unit tests → integration tests → deployment to a staging environment → automated acceptance checks, so the "right arm of the V" runs dozens of times a day.</li>
</ul>
<p class="ghi-chu">Outside the syllabus because CTFL only names sequential and iterative families.</p></div>`,
    `<h3>Ví dụ có lời giải · Chọn và điều chỉnh mô hình vòng đời</h3>
<p><strong>Bối cảnh.</strong> Một nhóm 6 người làm (a) module tính lương cho ngân hàng, có hợp đồng ghi rõ mọi quy tắc tính và ngày go-live cố định; (b) app sự kiện cho sinh viên trong trường, tính năng sẽ thay đổi sau mỗi lần cho người dùng thử.</p>
<ol>
<li><strong>(a) Tính lương → V-model.</strong> Yêu cầu ổn định, định nghĩa trong hợp đồng, bối cảnh có kiểm định nên hợp mô hình tuần tự với các cấp test chính thức. Điều chỉnh bằng thiết kế test sớm: viết acceptance test từ hợp đồng ngay tuần 1, review chính thức đặc tả tính lương.</li>
<li><strong>(b) App sự kiện → Scrum.</strong> Nhu cầu thay đổi, cần phản hồi nhanh nên hợp sprint ngắn. Điều chỉnh kiểm thử: mỗi story có acceptance criteria, regression tự động từ sprint 1 (rủi ro ở slide 24), demo cho sinh viên thật mỗi sprint (validation).</li>
<li><strong>Vì sao phải điều chỉnh (LO-2.1.2):</strong> mục tiêu dự án, loại sản phẩm, ưu tiên kinh doanh và rủi ro (vd kiểm định, thời gian ra thị trường) đều quyết định mô hình nào phù hợp — và các mô hình thường được kết hợp (vd V-model cho phần lõi, Agile cho phần giao diện).</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>W-model và DevOps.</strong>
<ul>
<li><strong>W-model</strong> — <em>W-model</em> của Paul Herzlich (1993) vẽ thêm một chữ V cạnh chữ V đầu, để mỗi bước phát triển có một bước test <em>tĩnh</em> (review) tường minh bên cạnh bước test động. Đó chính là V-model có thiết kế test sớm được vẽ ra rõ ràng.</li>
<li><strong>DevOps</strong> — pipeline ngày nay đẩy ý tưởng tới tận cùng: mỗi commit kích hoạt build → unit test → integration test → triển khai lên staging → kiểm tra chấp nhận tự động, nên "nhánh phải của chữ V" chạy hàng chục lần mỗi ngày.</li>
</ul>
<p class="ghi-chu">Ngoài giáo trình vì CTFL chỉ nêu hai họ tuần tự và lặp.</p></div>`),
    books([
      ['fst4', 'Ch.2 §1 "Software development life cycle models" — pp.36–46 (PDF 50–60); Figures 2.1–2.3 waterfall/V/iterative pp.38–41', 'Chương 2 §1 "Software development life cycle models" — trang 36–46 (PDF 50–60); Hình 2.1–2.3 waterfall/V/lặp trang 38–41'],
      ['fst', '§2.1 "Software development models" — pp.35–40 (PDF 38–43)', '§2.1 "Software development models" — trang 35–40 (PDF 38–43)'],
      ['sp5', '§3.1 Sequential models (waterfall PDF 77, V-model PDF 78); §3.2 Iterative and incremental models (PDF 82); §3.3 Project and product contexts (PDF 84)', '§3.1 Mô hình tuần tự (waterfall PDF 77, V-model PDF 78); §3.2 Mô hình lặp và tăng dần (PDF 82); §3.3 Ngữ cảnh dự án và sản phẩm (PDF 84)'],
      ['sp4', '§3.1 "The General V-Model" — p.39 (PDF 54)', '§3.1 "The General V-Model" — trang 39 (PDF 54)'],
    ]),
  ].join('\n'),
};

/* ─────────────────── 2.2 Test levels: component & integration ─────────────────── */
const L22 = {
  title: '2.2 — Test levels (1): component & integration testing, stubs & drivers|||2.2 — Cấp test (1): component & integration testing, stub & driver',
  slug: 'swt301-test-levels',
  type: 'VIDEO',
  description: 'SWT2 slide 36–74: 5 thuộc tính của một cấp test, component testing (TDD, chiến lược theo BS 7925-2), integration testing: big-bang, top-down (stub), bottom-up (driver), minimum capability, thread — kèm đáp án 12 câu hỏi trên slide.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.2 · SWT2 slides 36–74</span>
<h2>Test levels (1): component and integration testing</h2>
<p class="lead">A <strong>test level</strong> is a group of test activities organised and managed together — an instance of the whole test process. Every level is described by the same five attributes. This lesson covers the two lower levels, where developers are most involved, and the <strong>integration strategies</strong> (with their stubs and drivers) that are a favourite exam topic and appear in PE Question 2-style tasks.</p>
<div class="callout"><strong>Learning objective.</strong> LO-2.2.1 Compare the different test levels from the perspective of objectives, test basis, test objects, typical defects and failures, and approaches and responsibilities (K2).</div>
<table>
<thead><tr><th>Attribute</th><th>Component testing</th><th>Integration testing</th></tr></thead>
<tbody>
<tr><td>Objectives</td><td>reduce risk; verify functional &amp; non-functional behaviour of the component; build confidence; find and prevent defects</td><td>the same, but for the <em>interfaces</em> between components or systems</td></tr>
<tr><td>Test basis</td><td>detailed design, code, data model, component specifications</td><td>software &amp; system design, sequence diagrams, interface &amp; protocol specs, use cases, workflows</td></tr>
<tr><td>Test objects</td><td>components, units, modules, classes, code &amp; data structures, database models</td><td>subsystems, databases, infrastructure, interfaces, APIs, microservices</td></tr>
<tr><td>Typical defects</td><td>incorrect functionality, data-flow problems, incorrect code or logic</td><td>incorrect data, wrong timing, interface mismatch, communication failures, wrong assumptions about data</td></tr>
<tr><td>Who / how</td><td>usually the developer; TDD</td><td>component integration: developers; system integration: testers; big-bang or incremental</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 2 · Bài 2.2 · SWT2 slide 36–74</span>
<h2>Cấp test (1): component testing và integration testing</h2>
<p class="lead"><strong>Cấp test (test level)</strong> là một nhóm hoạt động kiểm thử được tổ chức và quản lý cùng nhau — một phiên bản cụ thể của cả quy trình test. Cấp nào cũng được mô tả bằng năm thuộc tính giống nhau. Bài này đi qua hai cấp thấp, nơi developer tham gia nhiều nhất, và các <strong>chiến lược tích hợp</strong> (cùng stub và driver) — chủ đề rất hay ra đề và gặp lại trong dạng câu PE về component test.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong> LO-2.2.1 So sánh các cấp test theo mục tiêu, test basis, đối tượng test, lỗi điển hình, cách tiếp cận và trách nhiệm (K2).</div>
<table>
<thead><tr><th>Thuộc tính</th><th>Component testing</th><th>Integration testing</th></tr></thead>
<tbody>
<tr><td>Mục tiêu</td><td>giảm rủi ro; verify hành vi chức năng &amp; phi chức năng của thành phần; tạo niềm tin; tìm và ngăn lỗi</td><td>như vậy, nhưng cho các <em>giao diện</em> giữa thành phần hoặc hệ thống</td></tr>
<tr><td>Test basis</td><td>thiết kế chi tiết, code, mô hình dữ liệu, đặc tả thành phần</td><td>thiết kế phần mềm &amp; hệ thống, sequence diagram, đặc tả giao diện &amp; giao thức, use case, workflow</td></tr>
<tr><td>Đối tượng test</td><td>component, unit, module, class, code &amp; cấu trúc dữ liệu, mô hình CSDL</td><td>subsystem, CSDL, hạ tầng, giao diện, API, microservice</td></tr>
<tr><td>Lỗi điển hình</td><td>sai chức năng, lỗi luồng dữ liệu, sai code hoặc logic</td><td>sai dữ liệu, sai thời điểm, giao diện không khớp, lỗi giao tiếp, giả định sai về dữ liệu</td></tr>
<tr><td>Ai / thế nào</td><td>thường là developer; TDD</td><td>tích hợp thành phần: developer; tích hợp hệ thống: tester; big-bang hoặc tăng dần</td></tr>
</tbody>
</table>`),
    walkHead(D, 36, 74),
    walk(D, [
      [36, 'CONTENT — Test levels',
        `<p class="y-chinh">🎯 Second block of the chapter: the four test levels (this lesson and 2.3).</p>`,
        `<p class="y-chinh">🎯 Khối thứ hai của chương: bốn cấp test (bài này và bài 2.3).</p>`],
      [37, 'Test Levels',
        `<p class="y-chinh">🎯 A test level is a group of test activities organised and managed together.</p>
<ul>
<li><strong>An instance of the test process</strong> — each level (a "test stage") is a specific instantiation of the test process of lesson 1.4.</li>
<li><strong>Tied to the lifecycle</strong> — each level relates to other activities in the SDLC.</li>
</ul>
<p class="nhan">The pyramid, bottom to top</p>
<ol>
<li>Component</li>
<li>Integration</li>
<li>System</li>
<li>Acceptance</li>
</ol>`,
        `<p class="y-chinh">🎯 Cấp test là một nhóm hoạt động kiểm thử được tổ chức và quản lý cùng nhau.</p>
<ul>
<li><strong>Một phiên bản của quy trình test</strong> — mỗi cấp ("test stage") là một phiên bản cụ thể của quy trình test ở bài 1.4.</li>
<li><strong>Gắn với vòng đời</strong> — mỗi cấp liên quan tới các hoạt động khác trong SDLC.</li>
</ul>
<p class="nhan">Kim tự tháp, từ dưới lên</p>
<ol>
<li>Component</li>
<li>Integration</li>
<li>System</li>
<li>Acceptance</li>
</ol>`],
      [38, 'Test Levels: characteristics',
        `<p class="y-chinh">🎯 Every "which level…?" question is answered by matching one of these five attributes.</p>
<ol>
<li><strong>Specific test objectives</strong></li>
<li><strong>Test basis</strong> — what you derive the test cases from</li>
<li><strong>Test object</strong> — what is being tested</li>
<li><strong>Typical defects and failures</strong></li>
<li><strong>Specific approaches and responsibilities</strong></li>
</ol>`,
        `<p class="y-chinh">🎯 Mọi câu "cấp nào…?" đều giải bằng cách khớp một trong năm thuộc tính này.</p>
<ol>
<li><strong>Mục tiêu test riêng</strong></li>
<li><strong>Test basis</strong> — căn cứ để rút ra test case</li>
<li><strong>Đối tượng test</strong> — cái đang được test</li>
<li><strong>Lỗi và failure điển hình</strong></li>
<li><strong>Cách tiếp cận và trách nhiệm riêng</strong></li>
</ol>`],
      [39, 'Test Levels: environment',
        `<p class="y-chinh">🎯 Every test level needs a suitable test environment.</p>
<ul>
<li><strong>Component testing</strong> — developers often use their own dev environment.</li>
<li><strong>System testing</strong> — may need an environment with particular external connections.</li>
<li><strong>Acceptance testing</strong> — a production-like environment is ideal.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cấp test nào cũng cần một môi trường test phù hợp.</p>
<ul>
<li><strong>Component testing</strong> — developer thường dùng chính môi trường dev của mình.</li>
<li><strong>System testing</strong> — có thể cần môi trường có kết nối ngoài đặc biệt.</li>
<li><strong>Acceptance testing</strong> — lý tưởng là môi trường giống production.</li>
</ul>`],
      [40, 'Question — which is NOT a test level?',
        `<p class="y-chinh">🎯 Functional testing is a test <em>type</em>, not a test level.</p>
<ul>
<li><strong>Functional testing</strong> — a test type (lesson 2.4).</li>
<li><strong>Component testing, system integration testing</strong> — both are levels.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Functional testing.</strong></p>`,
        `<p class="y-chinh">🎯 Functional testing là một <em>loại</em> test, không phải cấp test.</p>
<ul>
<li><strong>Functional testing</strong> — một loại test (bài 2.4).</li>
<li><strong>Component testing, system integration testing</strong> — đều là cấp test.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Functional testing.</strong></p>`],
      [41, 'Question — statements about test levels',
        `<p class="y-chinh">🎯 Statements 1, 3 and 4 come from slides 37–39; only statement 2 is false.</p>
<ul>
<li><strong>1 — correct</strong> — each level is an instance of the test process (slide 37).</li>
<li><strong>2 — wrong</strong> — test levels are not universal: organisations name and combine them differently depending on context.</li>
<li><strong>3 — correct</strong> — levels are groups of activities organised and managed together (slide 37).</li>
<li><strong>4 — correct</strong> — every level needs a suitable environment (slide 39).</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — 1, 3, 4 correct; 2 wrong.</strong></p>`,
        `<p class="y-chinh">🎯 Câu 1, 3 và 4 lấy từ slide 37–39; chỉ câu 2 sai.</p>
<ul>
<li><strong>1 — đúng</strong> — mỗi cấp là một phiên bản của quy trình test (slide 37).</li>
<li><strong>2 — sai</strong> — cấp test không phải "chung cho mọi công ty": mỗi tổ chức đặt tên và kết hợp khác nhau tuỳ ngữ cảnh.</li>
<li><strong>3 — đúng</strong> — cấp test là nhóm hoạt động được tổ chức và quản lý cùng nhau (slide 37).</li>
<li><strong>4 — đúng</strong> — cấp nào cũng cần môi trường phù hợp (slide 39).</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — 1, 3, 4 đúng; 2 sai.</strong></p>`],
      [42, 'Component Testing',
        `<p class="y-chinh">🎯 Component testing is the lowest level: each component is tested <strong>in isolation</strong>.</p>
<ul>
<li><strong>Isolation</strong> — neighbours are replaced by <strong>stubs and/or drivers</strong>.</li>
<li><strong>Most thorough look at detail</strong> — including error handling and interfaces.</li>
<li><strong>Other names</strong> — unit, module or program testing.</li>
</ul>`,
        `<p class="y-chinh">🎯 Component testing là cấp thấp nhất: từng thành phần được test <strong>cô lập</strong>.</p>
<ul>
<li><strong>Cô lập</strong> — các thành phần xung quanh được thay bằng <strong>stub và/hoặc driver</strong>.</li>
<li><strong>Soi chi tiết kỹ nhất</strong> — gồm cả xử lý lỗi và giao diện.</li>
<li><strong>Tên gọi khác</strong> — unit, module hay program testing.</li>
</ul>`],
      [43, 'Component Testing — the five attributes',
        `<p class="y-chinh">🎯 The five attributes of component testing — the table to learn.</p>
<ul>
<li><strong>Objectives</strong> — reduce risk; verify functional &amp; non-functional behaviours; build confidence; find defects; prevent defects.</li>
<li><strong>Test basis</strong> — detailed design, code, data model, component specifications.</li>
<li><strong>Test objects</strong> — components, units, modules; code &amp; data structures; classes; database models.</li>
<li><strong>Typical defects</strong> — incorrect functionality, data-flow problems, incorrect code or logic.</li>
<li><strong>Approach &amp; responsibility</strong> — TDD; usually done by the developer.</li>
</ul>`,
        `<p class="y-chinh">🎯 Năm thuộc tính của component testing — bảng phải học.</p>
<ul>
<li><strong>Mục tiêu</strong> — giảm rủi ro; verify hành vi chức năng &amp; phi chức năng; tạo niềm tin; tìm lỗi; ngăn lỗi.</li>
<li><strong>Test basis</strong> — thiết kế chi tiết, code, mô hình dữ liệu, đặc tả thành phần.</li>
<li><strong>Đối tượng test</strong> — component, unit, module; code &amp; cấu trúc dữ liệu; class; mô hình CSDL.</li>
<li><strong>Lỗi điển hình</strong> — sai chức năng, lỗi luồng dữ liệu, sai code hoặc logic.</li>
<li><strong>Cách tiếp cận &amp; trách nhiệm</strong> — TDD; thường do developer làm.</li>
</ul>`],
      [44, 'Component Testing: Test-Driven Development',
        `<p class="y-chinh">🎯 TDD is a loop: write a failing test, make it pass, clean the code — then repeat.</p>
<p class="nhan">The cycle on the slide</p>
<ol>
<li><strong>FAIL</strong> — write an automated test and see it fail.</li>
<li><strong>PASS</strong> — write just enough code to make it pass.</li>
<li><strong>RE-FACTOR</strong> — clean the code; the tests still pass.</li>
</ol>
<p class="nhan">The steps in words</p>
<ol>
<li>Develop automated test cases.</li>
<li>Build and integrate small pieces of code.</li>
<li>Run the component tests, correct any issues and refactor the code.</li>
</ol>
<p class="ghi-chu">Chapter 9 practises TDD in JUnit.</p>`,
        `<p class="y-chinh">🎯 TDD là một vòng lặp: viết test fail, cho nó pass, dọn code — rồi lặp lại.</p>
<p class="nhan">Chu trình trên slide</p>
<ol>
<li><strong>FAIL</strong> — viết test tự động và thấy nó fail.</li>
<li><strong>PASS</strong> — viết vừa đủ code cho test pass.</li>
<li><strong>RE-FACTOR</strong> — dọn code; test vẫn pass.</li>
</ol>
<p class="nhan">Các bước bằng lời</p>
<ol>
<li>Viết test case tự động.</li>
<li>Xây và tích hợp từng mẩu code nhỏ.</li>
<li>Chạy component test, sửa lỗi và refactor code.</li>
</ol>
<p class="ghi-chu">Chương 9 thực hành TDD bằng JUnit.</p>`],
      [45, 'Component test strategy 1 (BS 7925-2)',
        `<p class="y-chinh">🎯 BS 7925-2, the component-testing standard, asks your component test strategy to document three things.</p>
<ol>
<li><strong>Test design techniques, and why</strong> — chosen from Section 3 of the standard.</li>
<li><strong>Completion criteria, and why</strong> — from Section 4 (e.g. 100% branch coverage).</li>
<li><strong>Degree of independence of test design</strong> — from lowest to highest:
<ul>
<li>the component's author</li>
<li>another person</li>
<li>a person from a different section</li>
<li>a person from a different organisation</li>
<li>non-human (tool-generated)</li>
</ul></li>
</ol>`,
        `<p class="y-chinh">🎯 Chuẩn component testing BS 7925-2 yêu cầu chiến lược component test ghi lại ba điều.</p>
<ol>
<li><strong>Kỹ thuật thiết kế test, và lý do</strong> — chọn từ Mục 3 của chuẩn.</li>
<li><strong>Tiêu chí hoàn thành, và lý do</strong> — từ Mục 4 (vd 100% branch coverage).</li>
<li><strong>Mức độc lập khi thiết kế test</strong> — từ thấp tới cao:
<ul>
<li>chính tác giả của thành phần</li>
<li>một người khác</li>
<li>người ở bộ phận khác</li>
<li>người ở tổ chức khác</li>
<li>không phải người (công cụ sinh)</li>
</ul></li>
</ol>`],
      [46, 'Component test strategy 2',
        `<p class="y-chinh">🎯 The strategy also documents integration, environment, process and planning.</p>
<ul>
<li><strong>Component integration approach</strong> — isolation, top-down, bottom-up, or a mixture.</li>
<li><strong>Environment</strong> — hardware and software.</li>
<li><strong>Test process and activities</strong> — including the inputs and outputs of each activity.</li>
<li><strong>Repeat rule</strong> — affected activities are repeated after any fault fix or change.</li>
<li><strong>Project component test plan</strong> — including the dependencies between component tests.</li>
</ul>`,
        `<p class="y-chinh">🎯 Chiến lược còn ghi lại cách tích hợp, môi trường, quy trình và kế hoạch.</p>
<ul>
<li><strong>Cách tích hợp thành phần</strong> — cô lập, top-down, bottom-up, hoặc kết hợp.</li>
<li><strong>Môi trường</strong> — phần cứng và phần mềm.</li>
<li><strong>Quy trình và các hoạt động test</strong> — kèm đầu vào và đầu ra của từng hoạt động.</li>
<li><strong>Quy tắc lặp lại</strong> — các hoạt động bị ảnh hưởng được làm lại sau mỗi lần sửa lỗi hay thay đổi.</li>
<li><strong>Kế hoạch component test của dự án</strong> — kèm các phụ thuộc giữa các component test.</li>
</ul>`],
      [47, 'Test design techniques in BS 7925-2',
        `<p class="y-chinh">🎯 The techniques of BS 7925-2, and whether each is <em>also a quality-measurement technique</em> (i.e. has a coverage measure).</p>
<p class="nhan">Black box</p>
<ul>
<li><strong>✓ Yes</strong> — equivalence partitioning, boundary value analysis, state transition testing, cause-effect graphing.</li>
<li><strong>✗ No</strong> — syntax testing, random testing.</li>
</ul>
<p class="nhan">White box — all ✓</p>
<ol class="hai-cot"><li>Statement testing</li><li>Branch / decision testing</li><li>Data flow testing</li><li>Branch condition testing</li><li>Branch condition combination testing</li><li>Modified condition/decision testing (MC/DC)</li><li>LCSAJ testing</li></ol>
<p>The standard also says how to specify other techniques (last bullet on the left).</p>
<p class="ghi-chu">Chapter 4 teaches EP, BVA, decision tables and state transition in detail; Chapter 5 teaches statement and decision coverage.</p>`,
        `<p class="y-chinh">🎯 Các kỹ thuật trong BS 7925-2, và kỹ thuật nào <em>cũng là kỹ thuật đo chất lượng</em> (tức là có thước đo coverage).</p>
<p class="nhan">Black box</p>
<ul>
<li><strong>✓ Có</strong> — equivalence partitioning, boundary value analysis, state transition testing, cause-effect graphing.</li>
<li><strong>✗ Không</strong> — syntax testing, random testing.</li>
</ul>
<p class="nhan">White box — đều ✓</p>
<ol class="hai-cot"><li>Statement testing</li><li>Branch / decision testing</li><li>Data flow testing</li><li>Branch condition testing</li><li>Branch condition combination testing</li><li>Modified condition/decision testing (MC/DC)</li><li>LCSAJ testing</li></ol>
<p>Chuẩn còn nói cách đặc tả các kỹ thuật khác (gạch đầu dòng cuối bên trái).</p>
<p class="ghi-chu">Chương 4 dạy kỹ EP, BVA, decision table và state transition; Chương 5 dạy statement và decision coverage.</p>`],
      [48, 'Question — definition of component testing',
        `<p class="y-chinh">🎯 Component testing = testing components that are separately testable.</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — interactions between components or systems is integration testing.</li>
<li><strong>C</strong> — behaviour of a whole system or product is system testing.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Testing components that are separately testable.</strong></p>`,
        `<p class="y-chinh">🎯 Component testing = test các thành phần có thể test riêng rẽ.</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — tương tác giữa thành phần hoặc hệ thống là integration testing.</li>
<li><strong>C</strong> — hành vi của cả hệ thống hay sản phẩm là system testing.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Test các thành phần có thể test riêng rẽ.</strong></p>`],
      [49, 'Question — objective of component testing',
        `<p class="y-chinh">🎯 Building confidence in the <em>component's</em> quality is a component-testing objective (slide 43).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>B</strong> — confidence in the interfaces belongs to integration testing.</li>
<li><strong>C</strong> — validating that the system is complete belongs to acceptance.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Building confidence in the component's quality.</strong></p>`,
        `<p class="y-chinh">🎯 Tạo niềm tin vào chất lượng của <em>thành phần</em> là mục tiêu của component testing (slide 43).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>B</strong> — niềm tin vào giao diện thuộc integration testing.</li>
<li><strong>C</strong> — xác nhận hệ thống hoàn chỉnh thuộc acceptance.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Tạo niềm tin vào chất lượng của thành phần.</strong></p>`],
      [50, 'Question — test basis for component testing',
        `<p class="y-chinh">🎯 The component-test basis is the closest thing to the code: detailed design, code, data model (slide 43).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — use cases, workflows, sequence diagrams: the integration basis.</li>
<li><strong>B</strong> — epics, user stories, state diagrams, risk reports: the system basis.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Detailed design, code, data model.</strong></p>`,
        `<p class="y-chinh">🎯 Test basis của component gần code nhất: thiết kế chi tiết, code, mô hình dữ liệu (slide 43).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — use case, workflow, sequence diagram: test basis của integration.</li>
<li><strong>B</strong> — epic, user story, state diagram, báo cáo rủi ro: test basis của system.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Thiết kế chi tiết, code, mô hình dữ liệu.</strong></p>`],
      [51, 'Question — defect found in component testing',
        `<p class="y-chinh">🎯 Incorrect code and logic is a typical component defect (slide 43).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — incorrect sequencing/timing of interface calls: integration.</li>
<li><strong>C</strong> — incorrect control/data flows within the system: system testing.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Incorrect code and logic.</strong></p>`,
        `<p class="y-chinh">🎯 Sai code và logic là lỗi điển hình của component (slide 43).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — sai thứ tự/thời điểm gọi giao diện: integration.</li>
<li><strong>C</strong> — sai luồng điều khiển/dữ liệu trong hệ thống: system testing.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Sai code và logic.</strong></p>`],
      [52, 'Question — "requirements converted to test cases before the software is developed…"',
        `<p class="y-chinh">🎯 Requirements turned into tests before the code, then repeated testing against all tests — that is TDD.</p>
<ul>
<li><strong>Tests first</strong> — requirements are converted to test cases before the software is fully developed.</li>
<li><strong>Then code</strong> — development is tracked by repeatedly running all test cases.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Test-driven development.</strong></p>`,
        `<p class="y-chinh">🎯 Yêu cầu được đổi thành test trước khi có code, rồi liên tục chạy lại toàn bộ test — đó là TDD.</p>
<ul>
<li><strong>Test trước</strong> — yêu cầu được chuyển thành test case trước khi phần mềm được phát triển xong.</li>
<li><strong>Code sau</strong> — tiến độ phát triển được theo dõi bằng cách chạy lại mọi test case.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Test-driven development.</strong></p>`],
      [53, 'Integration Testing',
        `<p class="y-chinh">🎯 Integration testing focuses on <strong>interactions</strong> between components or systems.</p>
<p class="nhan">Two sub-levels</p>
<ul>
<li><strong>Component integration</strong> — modules inside one system.</li>
<li><strong>System integration</strong> — between systems, e.g. your app ↔ a payment gateway.</li>
</ul>`,
        `<p class="y-chinh">🎯 Integration testing tập trung vào <strong>tương tác</strong> giữa các thành phần hoặc hệ thống.</p>
<p class="nhan">Hai cấp con</p>
<ul>
<li><strong>Tích hợp thành phần</strong> — các module trong một hệ thống.</li>
<li><strong>Tích hợp hệ thống</strong> — giữa các hệ thống, vd app của bạn ↔ cổng thanh toán.</li>
</ul>`],
      [54, 'Integration Testing — test the integration itself',
        `<p class="y-chinh">🎯 Integration tests concentrate on the <strong>communication</strong>, not on what each part does on its own.</p>
<ul>
<li><strong>Module A + module B</strong> — test the communication between them; each module's functionality was covered by component testing.</li>
<li><strong>System X + system Y</strong> — test the communication between the systems; each system's functionality was covered by system testing.</li>
</ul>
<p class="nhan">Example — Cart + Payment</p>
<ul>
<li><strong>Test</strong> — the amount and currency Cart sends are exactly what Payment receives, and an error from Payment comes back to Cart.</li>
<li><strong>Do not test</strong> — whether Cart computes the total correctly.</li>
</ul>`,
        `<p class="y-chinh">🎯 Integration test tập trung vào <strong>giao tiếp</strong>, không test lại việc từng phần tự làm.</p>
<ul>
<li><strong>Module A + module B</strong> — test giao tiếp giữa hai module; chức năng của từng module component testing đã lo.</li>
<li><strong>Hệ thống X + hệ thống Y</strong> — test giao tiếp giữa hai hệ thống; chức năng của từng hệ thống system testing đã lo.</li>
</ul>
<p class="nhan">Ví dụ — Giỏ hàng + Thanh toán</p>
<ul>
<li><strong>Nên test</strong> — số tiền và loại tiền Giỏ hàng gửi đi đúng là cái Thanh toán nhận được, và lỗi từ Thanh toán quay về Giỏ hàng.</li>
<li><strong>Không test</strong> — Giỏ hàng cộng tổng đúng hay sai.</li>
</ul>`],
      [55, 'Integration Testing — responsibilities & scope',
        `<p class="y-chinh">🎯 Integrate incrementally: the bigger the integration step, the harder it is to isolate a defect.</p>
<p class="nhan">Who does it</p>
<ul>
<li><strong>Component integration</strong> — often the <strong>developers'</strong> job.</li>
<li><strong>System integration</strong> — generally the <strong>testers'</strong> job.</li>
</ul>
<p class="nhan">How to do it</p>
<ul>
<li><strong>Incremental</strong> — simplifies defect isolation and finds defects early.</li>
<li><strong>Continuous integration</strong> — the answer to "bigger scope = harder isolation": integrate component by component, many times a day.</li>
</ul>`,
        `<p class="y-chinh">🎯 Tích hợp tăng dần: mỗi bước tích hợp càng lớn thì càng khó cô lập lỗi.</p>
<p class="nhan">Ai làm</p>
<ul>
<li><strong>Tích hợp thành phần</strong> — thường là việc của <strong>developer</strong>.</li>
<li><strong>Tích hợp hệ thống</strong> — thường là việc của <strong>tester</strong>.</li>
</ul>
<p class="nhan">Làm thế nào</p>
<ul>
<li><strong>Tăng dần</strong> — dễ khoanh vùng lỗi và phát hiện lỗi sớm.</li>
<li><strong>Tích hợp liên tục (CI)</strong> — lời giải cho "phạm vi càng lớn càng khó cô lập": tích hợp từng thành phần một, nhiều lần mỗi ngày.</li>
</ul>`],
      [56, 'Integration Testing — the five attributes',
        `<p class="y-chinh">🎯 The five attributes of integration testing — like component testing, but aimed at the <em>interfaces</em>.</p>
<ul>
<li><strong>Objectives</strong> — reduce risk; verify functional &amp; non-functional behaviours of interfaces; build confidence; find defects; prevent defects.</li>
<li><strong>Test basis</strong> — software &amp; system design, sequence diagrams, interface and communication-protocol specs, use cases, workflows.</li>
<li><strong>Test objects</strong> — subsystems, databases, infrastructure, interfaces, APIs, microservices.</li>
<li><strong>Typical defects</strong> — incorrect data, incorrect timing, interface mismatch, communication failures between components, incorrect assumptions.</li>
<li><strong>Approaches</strong> — big-bang or incremental (top-down, bottom-up, functional).</li>
</ul>`,
        `<p class="y-chinh">🎯 Năm thuộc tính của integration testing — giống component testing, nhưng nhắm vào <em>giao diện</em>.</p>
<ul>
<li><strong>Mục tiêu</strong> — giảm rủi ro; verify hành vi chức năng &amp; phi chức năng của giao diện; tạo niềm tin; tìm lỗi; ngăn lỗi.</li>
<li><strong>Test basis</strong> — thiết kế phần mềm &amp; hệ thống, sequence diagram, đặc tả giao diện và giao thức, use case, workflow.</li>
<li><strong>Đối tượng test</strong> — subsystem, CSDL, hạ tầng, giao diện, API, microservice.</li>
<li><strong>Lỗi điển hình</strong> — sai dữ liệu, sai thời điểm, giao diện không khớp, lỗi giao tiếp giữa thành phần, giả định sai.</li>
<li><strong>Cách tiếp cận</strong> — big-bang hoặc tăng dần (top-down, bottom-up, functional).</li>
</ul>`],
      [57, 'Big-Bang Integration',
        `<p class="y-chinh">🎯 Big-bang integration looks faster, but in practice it takes more time.</p>
<p class="nhan">In theory</p>
<p>The components are already tested — why not combine them all at once and save time? That rests on the false assumption that there are no faults.</p>
<p class="nhan">In practice</p>
<ol>
<li><strong>Harder debugging</strong> — faults take longer to locate and fix.</li>
<li><strong>More re-testing</strong> — re-testing after fixes is more extensive.</li>
<li><strong>End result</strong> — it takes more time.</li>
</ol>`,
        `<p class="y-chinh">🎯 Tích hợp big-bang trông nhanh hơn, nhưng thực tế lại tốn thời gian hơn.</p>
<p class="nhan">Lý thuyết</p>
<p>Các thành phần đã test rồi — sao không ghép hết một lượt cho nhanh? Điều đó dựa trên giả định sai là không còn lỗi.</p>
<p class="nhan">Thực tế</p>
<ol>
<li><strong>Khó gỡ lỗi</strong> — lỗi khó khoanh vùng và sửa lâu hơn.</li>
<li><strong>Test lại nhiều hơn</strong> — test lại sau khi sửa tốn hơn.</li>
<li><strong>Kết quả</strong> — rốt cuộc mất nhiều thời gian hơn.</li>
</ol>`],
      [58, 'Incremental Integration',
        `<p class="y-chinh">🎯 Incremental integration adds one component at a time to an already tested <strong>baseline</strong>.</p>
<p class="nhan">The baselines</p>
<ol>
<li><strong>Baseline 0</strong> — one tested component</li>
<li><strong>Baseline 1</strong> — two components</li>
<li><strong>Baseline 2</strong> — three components, and so on</li>
</ol>
<p class="nhan">Advantages</p>
<ul>
<li><strong>Easier fault location and fixing</strong></li>
<li><strong>Easier recovery</strong> from disasters or problems</li>
<li><strong>Interfaces get checked</strong> — they "should have been tested in component tests, but…" — integration is where you find out.</li>
</ul>`,
        `<p class="y-chinh">🎯 Tích hợp tăng dần thêm từng thành phần một vào một <strong>baseline</strong> đã được test.</p>
<p class="nhan">Các baseline</p>
<ol>
<li><strong>Baseline 0</strong> — một thành phần đã test</li>
<li><strong>Baseline 1</strong> — hai thành phần</li>
<li><strong>Baseline 2</strong> — ba thành phần, v.v.</li>
</ol>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Dễ khoanh vùng và sửa lỗi</strong></li>
<li><strong>Dễ phục hồi</strong> khi có sự cố</li>
<li><strong>Giao diện được kiểm thật</strong> — "lẽ ra đã được test ở component test, nhưng…" — tích hợp mới là lúc biết thật.</li>
</ul>`],
      [59, 'Top-Down Integration',
        `<p class="y-chinh">🎯 Top-down integration starts at the top of the call tree and replaces missing lower components with <strong>stubs</strong>.</p>
<p class="nhan">The baselines (pink arrow points down the tree)</p>
<ol>
<li><strong>Baseline 0</strong> — a</li>
<li><strong>Baseline 1</strong> — a + b</li>
<li><strong>Baseline 2</strong> — a + b + c</li>
<li><strong>Baseline 3</strong> — a + b + c + d (yellow on the slide), and so on</li>
</ol>
<p class="nhan">Why stubs</p>
<p>The integrated components call lower-level components that are not integrated yet; <strong>stubs</strong> simulate those missing components (blue-grey boxes e, f, g, h, i, j at baseline 3).</p>`,
        `<p class="y-chinh">🎯 Tích hợp top-down bắt đầu từ đỉnh cây gọi và thay các thành phần dưới còn thiếu bằng <strong>stub</strong>.</p>
<p class="nhan">Các baseline (mũi tên hồng đi xuống cây)</p>
<ol>
<li><strong>Baseline 0</strong> — a</li>
<li><strong>Baseline 1</strong> — a + b</li>
<li><strong>Baseline 2</strong> — a + b + c</li>
<li><strong>Baseline 3</strong> — a + b + c + d (tô vàng trên slide), v.v.</li>
</ol>
<p class="nhan">Vì sao cần stub</p>
<p>Các thành phần đã tích hợp gọi xuống thành phần bên dưới chưa được tích hợp; <strong>stub</strong> mô phỏng các thành phần còn thiếu đó (ô xanh xám e, f, g, h, i, j ở baseline 3).</p>`],
      [60, 'Stubs',
        `<p class="y-chinh">🎯 A <strong>stub</strong> replaces a <em>called</em> component during integration testing — keep it simple.</p>
<p class="nhan">What a stub can do — from simplest to most sophisticated</p>
<ol>
<li><strong>Print/display its name</strong> — "I have been called".</li>
<li><strong>Reply with a single value</strong> — fixed.</li>
<li><strong>Compute a reply</strong> — a variety of values.</li>
<li><strong>Prompt the tester</strong> for a reply.</li>
<li><strong>Search a list</strong> of replies.</li>
<li><strong>Provide a timing delay</strong>.</li>
</ol>
<p class="ghi-chu">"Baan: dummy sessions" is what the Baan ERP system called stubs.</p>`,
        `<p class="y-chinh">🎯 <strong>Stub</strong> thay cho thành phần <em>được gọi</em> khi test tích hợp — giữ nó đơn giản.</p>
<p class="nhan">Stub có thể làm gì — từ đơn giản tới phức tạp</p>
<ol>
<li><strong>In/hiện tên mình</strong> — "tôi đã được gọi".</li>
<li><strong>Trả về một giá trị</strong> — cố định.</li>
<li><strong>Tính ra câu trả lời</strong> — nhiều giá trị khác nhau.</li>
<li><strong>Hỏi tester</strong> nhập câu trả lời.</li>
<li><strong>Tra một danh sách</strong> câu trả lời.</li>
<li><strong>Giả lập độ trễ</strong>.</li>
</ol>
<p class="ghi-chu">"Baan: dummy sessions" là tên hệ ERP Baan gọi stub.</p>`],
      [61, 'Pros & cons of top-down',
        `<p class="y-chinh">🎯 Top-down tests the control structure first, but leaves the detail until last.</p>
<p class="nhan">Advantages</p>
<ul>
<li><strong>Critical control structure</strong> — tested first and most often.</li>
<li><strong>Early demo</strong> — you can show the system early (working menus).</li>
</ul>
<p class="nhan">Disadvantages</p>
<ul>
<li><strong>Needs stubs</strong></li>
<li><strong>Detail left until last</strong></li>
<li><strong>Detailed output hard to "see"</strong> — though it should have been tested in component testing.</li>
<li><strong>May look more finished than it is</strong></li>
</ul>`,
        `<p class="y-chinh">🎯 Top-down test cấu trúc điều khiển trước, nhưng để phần chi tiết tới cuối.</p>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Cấu trúc điều khiển quan trọng</strong> — được test sớm nhất và nhiều nhất.</li>
<li><strong>Demo sớm</strong> — cho xem hệ thống sớm (menu chạy được).</li>
</ul>
<p class="nhan">Nhược điểm</p>
<ul>
<li><strong>Cần stub</strong></li>
<li><strong>Phần chi tiết để tới cuối</strong></li>
<li><strong>Khó "thấy" output chi tiết</strong> — dù lẽ ra component test đã kiểm.</li>
<li><strong>Trông hoàn thiện hơn thực tế</strong></li>
</ul>`],
      [62, 'Bottom-up Integration',
        `<p class="y-chinh">🎯 Bottom-up integration starts at the leaves and needs <strong>drivers</strong> to call the baseline.</p>
<p class="nhan">The baselines (the arrow points up)</p>
<ol>
<li><strong>Baseline 0</strong> — n</li>
<li><strong>Baseline 1</strong> — n + i</li>
<li><strong>Baseline 2</strong> — n + i + o</li>
<li><strong>Baseline 3</strong> — n + i + o + d (yellow on the slide), and so on</li>
</ol>
<p class="nhan">Support software needed</p>
<ul>
<li><strong>Drivers</strong> — nothing calls the baseline yet, so a driver must (b, in purple, stands in as the caller of d).</li>
<li><strong>Stubs too, for some baselines</strong> — here d's other children h and j (blue-grey).</li>
</ul>`,
        `<p class="y-chinh">🎯 Tích hợp bottom-up bắt đầu từ lá và cần <strong>driver</strong> để gọi baseline.</p>
<p class="nhan">Các baseline (mũi tên đi lên)</p>
<ol>
<li><strong>Baseline 0</strong> — n</li>
<li><strong>Baseline 1</strong> — n + i</li>
<li><strong>Baseline 2</strong> — n + i + o</li>
<li><strong>Baseline 3</strong> — n + i + o + d (tô vàng trên slide), v.v.</li>
</ol>
<p class="nhan">Phần mềm hỗ trợ cần có</p>
<ul>
<li><strong>Driver</strong> — chưa có gì gọi baseline nên phải có driver gọi (b, tô tím, đứng thay vai trò gọi d).</li>
<li><strong>Cả stub, ở một số baseline</strong> — ở đây là h và j, các con khác của d (xanh xám).</li>
</ul>`],
      [63, 'Drivers',
        `<p class="y-chinh">🎯 A <strong>driver</strong> is test harness (scaffolding) that <em>calls</em> the component under test.</p>
<ul>
<li><strong>Where it comes from</strong> — specially written, or a general-purpose commercial tool.</li>
<li><strong>What it does</strong> — invokes the baseline, sends any data the baseline expects, and receives (prints) any data it produces.</li>
<li><strong>One per baseline</strong> — each baseline has different requirements for its driver.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> in JUnit terms, the test class is the driver of the class under test.</p>`,
        `<p class="y-chinh">🎯 <strong>Driver</strong> là phần khung/giàn giáo test <em>gọi</em> thành phần đang test.</p>
<ul>
<li><strong>Nguồn gốc</strong> — viết riêng, hoặc dùng công cụ thương mại đa năng.</li>
<li><strong>Nó làm gì</strong> — gọi baseline, gửi dữ liệu baseline cần, và nhận (in ra) dữ liệu baseline tạo ra.</li>
<li><strong>Mỗi baseline một kiểu</strong> — mỗi baseline cần driver khác nhau.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> theo cách nói JUnit, lớp test chính là driver của lớp đang test.</p>`],
      [64, 'Pros & cons of bottom-up',
        `<p class="y-chinh">🎯 Bottom-up tests the lowest levels thoroughly, but there is no working system until the end.</p>
<p class="nhan">Advantages</p>
<ul>
<li><strong>Lowest levels first</strong> — tested first and most thoroughly (though they should have been tested in unit testing).</li>
<li><strong>External interfaces</strong> — good for testing interfaces to the external environment (hardware, network).</li>
<li><strong>Visibility of detail</strong></li>
</ul>
<p class="nhan">Disadvantages</p>
<ul>
<li><strong>No working system</strong> until the last baseline</li>
<li><strong>Needs both drivers and stubs</strong></li>
<li><strong>Major control problems found last</strong></li>
</ul>`,
        `<p class="y-chinh">🎯 Bottom-up test kỹ các tầng thấp, nhưng tới cuối mới có hệ thống chạy được.</p>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Tầng thấp nhất trước</strong> — được test sớm và kỹ nhất (dù lẽ ra unit test đã kiểm).</li>
<li><strong>Giao diện với bên ngoài</strong> — tốt cho giao diện với môi trường ngoài (phần cứng, mạng).</li>
<li><strong>Thấy rõ chi tiết</strong></li>
</ul>
<p class="nhan">Nhược điểm</p>
<ul>
<li><strong>Không có hệ thống chạy được</strong> cho tới baseline cuối</li>
<li><strong>Cần cả driver lẫn stub</strong></li>
<li><strong>Lỗi điều khiển lớn bị phát hiện muộn nhất</strong></li>
</ul>`],
      [65, 'Minimum Capability Integration (functional)',
        `<p class="y-chinh">🎯 Minimum capability integrates one complete path from the top down to a leaf first.</p>
<p class="nhan">The baselines (the diagonal arrow)</p>
<ol>
<li><strong>Baseline 0</strong> — a</li>
<li><strong>Baseline 1</strong> — a + b</li>
<li><strong>Baseline 2</strong> — a + b + d</li>
<li><strong>Baseline 3</strong> — a + b + d + i, and so on (the arrow continues to n)</li>
</ol>
<ul>
<li><strong>Needs stubs</strong> — the blue-grey boxes c, e, h, j, o.</li>
<li><strong>Shouldn't need drivers</strong> — when done top-down.</li>
</ul>`,
        `<p class="y-chinh">🎯 Minimum capability tích hợp trọn một đường đi từ đỉnh xuống một lá trước.</p>
<p class="nhan">Các baseline (mũi tên chéo)</p>
<ol>
<li><strong>Baseline 0</strong> — a</li>
<li><strong>Baseline 1</strong> — a + b</li>
<li><strong>Baseline 2</strong> — a + b + d</li>
<li><strong>Baseline 3</strong> — a + b + d + i, v.v. (mũi tên đi tiếp tới n)</li>
</ol>
<ul>
<li><strong>Cần stub</strong> — các ô xanh xám c, e, h, j, o.</li>
<li><strong>Không cần driver</strong> — nếu làm từ trên xuống.</li>
</ul>`],
      [66, 'Pros & cons of minimum capability',
        `<p class="y-chinh">🎯 Minimum capability gives a real working partial system earliest — at the price of stubs.</p>
<p class="nhan">Advantages</p>
<ul>
<li><strong>Control level</strong> — tested first and most often.</li>
<li><strong>Visibility of detail</strong></li>
<li><strong>Real working partial system earliest</strong></li>
</ul>
<p class="nhan">Disadvantage</p>
<ul>
<li><strong>Needs stubs</strong></li>
</ul>`,
        `<p class="y-chinh">🎯 Minimum capability sớm nhất có một hệ thống thật chạy được một phần — cái giá là phải viết stub.</p>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Tầng điều khiển</strong> — được test sớm và nhiều nhất.</li>
<li><strong>Thấy rõ chi tiết</strong></li>
<li><strong>Sớm nhất có hệ thống thật chạy được một phần</strong></li>
</ul>
<p class="nhan">Nhược điểm</p>
<ul>
<li><strong>Cần stub</strong></li>
</ul>`],
      [67, 'Thread Integration (functional)',
        `<p class="y-chinh">🎯 In thread integration, the order in which an event is processed decides the integration order — "minimum capability in time".</p>
<ul>
<li><strong>What drives the order</strong> — the processing of some event, e.g. an interrupt or a user transaction.</li>
<li><strong>On the picture</strong> — the thread d → e → f → g is integrated along the arrow; b and c (purple) call it, the light-blue boxes below are stubs.</li>
</ul>
<p class="nhan">Advantages</p>
<ul>
<li><strong>Critical processing first</strong></li>
<li><strong>Early warning of performance problems</strong></li>
</ul>
<p class="nhan">Disadvantage</p>
<ul>
<li><strong>May need complex drivers and stubs</strong></li>
</ul>
<p class="ghi-chu">The speaker note adds: <em>layers</em> — commonly used for big projects.</p>`,
        `<p class="y-chinh">🎯 Tích hợp theo luồng (thread): thứ tự xử lý một sự kiện quyết định thứ tự tích hợp — "năng lực tối thiểu theo thời gian".</p>
<ul>
<li><strong>Cái gì quyết định thứ tự</strong> — việc xử lý một sự kiện, vd một ngắt hay một giao dịch của người dùng.</li>
<li><strong>Trên hình</strong> — luồng d → e → f → g được tích hợp dọc theo mũi tên; b và c (tô tím) gọi vào luồng, các ô xanh nhạt bên dưới là stub.</li>
</ul>
<p class="nhan">Ưu điểm</p>
<ul>
<li><strong>Xử lý quan trọng được làm trước</strong></li>
<li><strong>Sớm cảnh báo vấn đề hiệu năng</strong></li>
</ul>
<p class="nhan">Nhược điểm</p>
<ul>
<li><strong>Có thể cần driver và stub phức tạp</strong></li>
</ul>
<p class="ghi-chu">Ghi chú của thầy/cô: tích hợp theo <em>tầng (layers)</em> — hay dùng cho dự án lớn.</p>`],
      [68, 'Integration Guidelines',
        `<p class="y-chinh">🎯 Four guidelines for integration — keep the support software small and every step easy to check.</p>
<ol>
<li><strong>Minimise support software</strong> — as few stubs and drivers as possible.</li>
<li><strong>Integrate each component only once</strong></li>
<li><strong>Easily verifiable baselines</strong> — each baseline should produce a result that is easy to check.</li>
<li><strong>Small numbers at once</strong>
<ul>
<li>one at a time for critical or fault-prone components</li>
<li>simple related components together</li>
</ul></li>
</ol>`,
        `<p class="y-chinh">🎯 Bốn nguyên tắc tích hợp — ít phần mềm hỗ trợ, mỗi bước dễ kiểm chứng.</p>
<ol>
<li><strong>Giảm tối đa phần mềm hỗ trợ</strong> — càng ít stub và driver càng tốt.</li>
<li><strong>Mỗi thành phần chỉ tích hợp một lần</strong></li>
<li><strong>Baseline dễ kiểm chứng</strong> — mỗi baseline phải cho kết quả dễ kiểm tra.</li>
<li><strong>Mỗi lần ít thành phần</strong>
<ul>
<li>từng cái một với thành phần quan trọng hoặc hay lỗi</li>
<li>ghép chung các thành phần đơn giản có liên quan</li>
</ul></li>
</ol>`],
      [69, 'Integration Planning',
        `<p class="y-chinh">🎯 Plan integration in the <strong>architectural design phase</strong> — the integration order then drives everything else.</p>
<ol>
<li><strong>Integration order decides the build order</strong></li>
<li><strong>Components are completed in time</strong> for their baseline.</li>
<li><strong>Work runs in parallel</strong> — component development and integration testing overlap, which saves time.</li>
</ol>`,
        `<p class="y-chinh">🎯 Lập kế hoạch tích hợp ngay ở <strong>pha thiết kế kiến trúc</strong> — thứ tự tích hợp sẽ dẫn dắt mọi thứ còn lại.</p>
<ol>
<li><strong>Thứ tự tích hợp quyết định thứ tự build</strong></li>
<li><strong>Thành phần xong kịp</strong> baseline của nó.</li>
<li><strong>Làm song song</strong> — phát triển thành phần và integration testing chạy cùng lúc, tiết kiệm thời gian.</li>
</ol>`],
      [70, 'Question — integration testing focuses on…',
        `<p class="y-chinh">🎯 Integration testing focuses on interactions between components or systems (slide 53).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — "testing the code as early as possible" describes early testing in general.</li>
<li><strong>C</strong> — functionality of each separately testable component is component testing.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Interactions between components or systems.</strong></p>`,
        `<p class="y-chinh">🎯 Integration testing tập trung vào tương tác giữa các thành phần hoặc hệ thống (slide 53).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — "test code sớm nhất có thể" là kiểm thử sớm nói chung.</li>
<li><strong>C</strong> — chức năng của từng thành phần test riêng được là component testing.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Tương tác giữa các thành phần hoặc hệ thống.</strong></p>`],
      [71, 'Question — who does component vs system integration?',
        `<p class="y-chinh">🎯 Component integration → developers; system integration → testers (slide 55).</p>
<ul>
<li><strong>Component integration testing</strong> — often the responsibility of developers.</li>
<li><strong>System integration testing</strong> — generally the responsibility of testers.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — developer – tester.</strong></p>`,
        `<p class="y-chinh">🎯 Tích hợp thành phần → developer; tích hợp hệ thống → tester (slide 55).</p>
<ul>
<li><strong>Component integration testing</strong> — thường là trách nhiệm của developer.</li>
<li><strong>System integration testing</strong> — thường là trách nhiệm của tester.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — developer – tester.</strong></p>`],
      [72, 'Question — test basis for integration testing',
        `<p class="y-chinh">🎯 Use cases, workflows and sequence diagrams describe how parts interact — the integration basis (slide 56).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — epics, user stories, state diagrams, risk reports: the system-test basis.</li>
<li><strong>C</strong> — detailed design, code, data model: the component-test basis.</li>
<li><strong>D</strong> — system under test, forms, business processes: mixes system and acceptance items.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Use cases, workflows, sequence diagrams.</strong></p>`,
        `<p class="y-chinh">🎯 Use case, workflow và sequence diagram mô tả các phần tương tác thế nào — test basis của integration (slide 56).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — epic, user story, state diagram, báo cáo rủi ro: test basis của system.</li>
<li><strong>C</strong> — thiết kế chi tiết, code, mô hình dữ liệu: test basis của component.</li>
<li><strong>D</strong> — hệ thống đang test, form, quy trình nghiệp vụ: trộn mục của system và acceptance.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Use case, workflow, sequence diagram.</strong></p>`],
      [73, 'Question — defect found in integration testing',
        `<p class="y-chinh">🎯 Wrong sequencing or timing of interface calls is a typical integration defect (slide 56).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — incorrect code and logic: a component defect.</li>
<li><strong>B</strong> — incorrect control/data flows within the system: a system defect.</li>
<li><strong>D</strong> — not meeting contractual or regulatory requirements: an acceptance issue.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Incorrect sequencing or timing of interface calls.</strong></p>`,
        `<p class="y-chinh">🎯 Sai thứ tự hoặc thời điểm gọi giao diện là lỗi điển hình của integration (slide 56).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — sai code và logic: lỗi component.</li>
<li><strong>B</strong> — sai luồng điều khiển/dữ liệu trong hệ thống: lỗi system.</li>
<li><strong>D</strong> — không thoả yêu cầu hợp đồng hay quy định: vấn đề của acceptance.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Sai thứ tự hoặc thời điểm gọi giao diện.</strong></p>`],
      [74, 'Question — scope of integration',
        `<p class="y-chinh">🎯 The bigger the integration step, the harder it is to isolate a defect — exactly slide 55.</p>
<ul>
<li><strong>Why D</strong> — it is the reason for incremental and continuous integration.</li>
<li><strong>A and B</strong> — state the rule backwards.</li>
<li><strong>C</strong> — isolation is not "always" difficult; small steps make it easy.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — The greater the scope of integration, the more difficult it becomes to isolate defects.</strong></p>`,
        `<p class="y-chinh">🎯 Bước tích hợp càng lớn thì càng khó cô lập lỗi — đúng slide 55.</p>
<ul>
<li><strong>Vì sao D</strong> — đó là lý do có tích hợp tăng dần và tích hợp liên tục.</li>
<li><strong>A và B</strong> — nói ngược quy tắc.</li>
<li><strong>C</strong> — cô lập lỗi không "luôn luôn" khó; bước nhỏ thì dễ.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — Phạm vi tích hợp càng lớn thì càng khó cô lập lỗi.</strong></p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — plan the integration of the slide tree</h3>
<p>Use the tree on slides 59–67: a calls b and c; b calls d and e; c calls f and g; d calls h, i, j; i calls n and o; f calls k; g calls l and m.</p>
<table>
<thead><tr><th>Strategy</th><th>First baselines</th><th>Stubs needed at baseline 3</th><th>Drivers needed</th></tr></thead>
<tbody>
<tr><td>Top-down (breadth)</td><td>a → a+b → a+b+c → a+b+c+d</td><td>for e, f, g, h, i, j (called but not yet integrated)</td><td>none (a is the real top)</td></tr>
<tr><td>Bottom-up</td><td>n → n+i → n+i+o → n+i+o+d</td><td>for h and j (called by d)</td><td>a driver to call the baseline's top each time (for i, then for d)</td></tr>
<tr><td>Minimum capability</td><td>a → a+b → a+b+d → a+b+d+i</td><td>for c, e, h, j, n, o</td><td>none</td></tr>
</tbody>
</table>
<p>How to count stubs: every component that an <em>integrated</em> component calls, but that is not yet integrated, needs a stub. How to count drivers: whenever the top of the current baseline is not the real top of the system, something must call it.</p>
<div class="pitfall co-tieu-de"><strong>Stub vs driver — the classic trap.</strong> A <strong>stub</strong> is <em>called by</em> the code under test (it stands in below it — top-down). A <strong>driver</strong> <em>calls</em> the code under test (it stands in above it — bottom-up). In unit tests with Mockito, a mocked repository is a stub/mock; the JUnit test method is the driver.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Contract testing for microservices.</strong>
<p>When dozens of services integrate, a full integration environment is slow and fragile. <em>Consumer-driven contract testing</em> (e.g. Pact) splits the job in two:</p>
<ul>
<li><strong>Consumer</strong> — publishes the requests it makes and the responses it expects.</li>
<li><strong>Provider</strong> — verifies, in its own pipeline, that it still honours every published contract.</li>
</ul>
<p>It catches the "interface mismatch" defects of slide 56 without starting the whole system.</p>
<p class="ghi-chu">Outside the syllabus because CTFL stops at big-bang vs incremental.</p></div>`,
    `<h3>Ví dụ có lời giải · Lập kế hoạch tích hợp cho cây trên slide</h3>
<p>Dùng cây ở slide 59–67: a gọi b và c; b gọi d và e; c gọi f và g; d gọi h, i, j; i gọi n và o; f gọi k; g gọi l và m.</p>
<table>
<thead><tr><th>Chiến lược</th><th>Các baseline đầu</th><th>Stub cần ở baseline 3</th><th>Driver cần</th></tr></thead>
<tbody>
<tr><td>Top-down (theo chiều rộng)</td><td>a → a+b → a+b+c → a+b+c+d</td><td>cho e, f, g, h, i, j (được gọi mà chưa tích hợp)</td><td>không (a là đỉnh thật)</td></tr>
<tr><td>Bottom-up</td><td>n → n+i → n+i+o → n+i+o+d</td><td>cho h và j (d gọi tới)</td><td>mỗi lần cần một driver gọi đỉnh của baseline (gọi i, rồi gọi d)</td></tr>
<tr><td>Minimum capability</td><td>a → a+b → a+b+d → a+b+d+i</td><td>cho c, e, h, j, n, o</td><td>không</td></tr>
</tbody>
</table>
<p>Cách đếm stub: mọi thành phần mà một thành phần <em>đã tích hợp</em> gọi tới nhưng chưa được tích hợp đều cần stub. Cách đếm driver: hễ đỉnh của baseline hiện tại không phải đỉnh thật của hệ thống thì phải có thứ gì đó gọi nó.</p>
<div class="pitfall co-tieu-de"><strong>Stub vs driver — bẫy kinh điển.</strong> <strong>Stub</strong> <em>được gọi bởi</em> code đang test (đứng thay ở phía dưới — top-down). <strong>Driver</strong> <em>gọi</em> code đang test (đứng thay ở phía trên — bottom-up). Trong unit test với Mockito, repository bị mock là stub/mock; phương thức test JUnit là driver.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Contract testing cho microservice.</strong>
<p>Khi hàng chục service tích hợp với nhau, dựng cả môi trường tích hợp vừa chậm vừa dễ gãy. <em>Consumer-driven contract testing</em> (vd Pact) chia việc làm hai:</p>
<ul>
<li><strong>Bên gọi (consumer)</strong> — công bố các request nó gửi và response nó mong đợi.</li>
<li><strong>Bên cung cấp (provider)</strong> — tự kiểm trong pipeline của mình rằng nó vẫn giữ đúng mọi hợp đồng đã công bố.</li>
</ul>
<p>Cách này bắt được lỗi "giao diện không khớp" ở slide 56 mà không cần khởi động cả hệ thống.</p>
<p class="ghi-chu">Ngoài giáo trình vì CTFL chỉ dừng ở big-bang và tăng dần.</p></div>`),
    books([
      ['fst4', 'Ch.2 §2 "Test levels" — pp.47–61 (PDF 61–75): component pp.47–50, integration pp.50–54; Figure 2.4 stubs and drivers p.49; Table 2.1 test-level characteristics p.60', 'Chương 2 §2 "Test levels" — trang 47–61 (PDF 61–75): component trang 47–50, integration trang 50–54; Hình 2.4 stub và driver trang 49; Bảng 2.1 đặc điểm các cấp test trang 60'],
      ['fst', '§2.2 "Test levels" — pp.41–45 (PDF 44–48)', '§2.2 "Test levels" — trang 41–45 (PDF 44–48)'],
      ['sp5', '§3.4 Testing levels (PDF 86); §3.4.1 Component testing (PDF 87–95); §3.4.2 Integration testing and strategies (PDF 96–104)', '§3.4 Testing levels (PDF 86); §3.4.1 Component testing (PDF 87–95); §3.4.2 Integration testing và các chiến lược (PDF 96–104)'],
      ['sp4', '§3.2 Component test pp.42–49 (PDF 57–64); §3.3 Integration test pp.50–57, strategies §3.3.5 p.55 (PDF 65–72)', '§3.2 Component test trang 42–49 (PDF 57–64); §3.3 Integration test trang 50–57, chiến lược §3.3.5 trang 55 (PDF 65–72)'],
      ['junit', 'Ch.7 "Coarse-grained testing with stubs" (PDF 127) and Ch.8 "Testing with mock objects" (PDF 143) — stubs/drivers in real Java code', 'Ch.7 "Coarse-grained testing with stubs" (PDF 127) và Ch.8 "Testing with mock objects" (PDF 143) — stub/driver bằng code Java thật'],
    ]),
  ].join('\n'),
};

/* ─────────────────── 2.3 Test levels: system & acceptance ─────────────────── */
const L23 = {
  title: '2.3 — Test levels (2): system & acceptance testing (UAT, OAT, contractual, alpha/beta)|||2.3 — Cấp test (2): system & acceptance testing (UAT, OAT, hợp đồng, alpha/beta)',
  slug: 'swt301-system-acceptance',
  type: 'VIDEO',
  description: 'SWT2 slide 75–105: system testing (5 thuộc tính, ai làm, môi trường), acceptance testing và 4 dạng UAT/OAT/C&RAT/alpha-beta, so sánh các cấp — kèm đáp án 17 câu hỏi và câu ôn tập trên slide.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.3 · SWT2 slides 75–105</span>
<h2>Test levels (2): system and acceptance testing</h2>
<p class="lead">The two upper levels look at the <strong>whole product</strong>. System testing checks it end-to-end against the specification, usually by independent testers; acceptance testing checks it against the <strong>users' needs, business processes, contracts and regulations</strong>, to decide whether to accept it. The deck finishes with review questions that compare all four levels.</p>
<table>
<thead><tr><th>Attribute</th><th>System testing</th><th>Acceptance testing</th></tr></thead>
<tbody>
<tr><td>Objectives</td><td>reduce risk; verify functional &amp; non-functional behaviour; validate the system is complete; build confidence; find &amp; prevent defects</td><td>establish confidence; validate the system is complete and works as expected; verify behaviour as specified — finding defects is <em>often not</em> an objective</td></tr>
<tr><td>Test basis</td><td>system &amp; software requirement specs, risk analysis reports, use cases, epics &amp; user stories, system models, state diagrams, system and user manuals</td><td>business processes, user/business requirements, regulations, contracts &amp; standards, use cases, system documentation, risk reports; for OAT: backup/recovery procedures, disaster-recovery plan, non-functional requirements, operations docs, performance targets, security standards</td></tr>
<tr><td>Test objects</td><td>applications, hardware/software systems, operating systems, the system under test, configuration and configuration data</td><td>the system under test, configuration &amp; data, recovery systems and hot sites, forms, reports</td></tr>
<tr><td>Typical defects</td><td>incorrect calculations, incorrect (non-)functional behaviour, incorrect data flows, cannot complete end-to-end tasks, not as described in the manuals</td><td>system workflows not meeting business needs, business rules implemented wrongly, contract not satisfied, non-functional failures (security, performance)</td></tr>
<tr><td>Who / how</td><td>independent testers; black-box first (e.g. decision tables), white-box for navigation coverage; production-like environment</td><td>users (UAT), system administrators (OAT), users/independent testers (contract), independent testers + regulator (regulatory), outside users (alpha/beta)</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 2 · Bài 2.3 · SWT2 slide 75–105</span>
<h2>Cấp test (2): system testing và acceptance testing</h2>
<p class="lead">Hai cấp trên cùng nhìn vào <strong>toàn bộ sản phẩm</strong>. System testing kiểm tra đầu-cuối so với đặc tả, thường do tester độc lập làm; acceptance testing kiểm tra so với <strong>nhu cầu người dùng, quy trình nghiệp vụ, hợp đồng và quy định</strong> để quyết định có chấp nhận sản phẩm hay không. Bộ slide kết thúc bằng các câu ôn tập so sánh cả bốn cấp.</p>
<table>
<thead><tr><th>Thuộc tính</th><th>System testing</th><th>Acceptance testing</th></tr></thead>
<tbody>
<tr><td>Mục tiêu</td><td>giảm rủi ro; verify hành vi chức năng &amp; phi chức năng; validate hệ thống hoàn chỉnh; tạo niềm tin; tìm &amp; ngăn lỗi</td><td>tạo niềm tin; validate hệ thống hoàn chỉnh và chạy như mong đợi; verify hành vi đúng đặc tả — tìm lỗi <em>thường không phải</em> mục tiêu</td></tr>
<tr><td>Test basis</td><td>đặc tả yêu cầu hệ thống &amp; phần mềm, báo cáo phân tích rủi ro, use case, epic &amp; user story, mô hình hệ thống, state diagram, tài liệu hệ thống và hướng dẫn sử dụng</td><td>quy trình nghiệp vụ, yêu cầu người dùng/nghiệp vụ, quy định, hợp đồng &amp; chuẩn, use case, tài liệu hệ thống, báo cáo rủi ro; với OAT: quy trình sao lưu/phục hồi, kế hoạch khắc phục thảm hoạ, yêu cầu phi chức năng, tài liệu vận hành, chỉ tiêu hiệu năng, chuẩn bảo mật</td></tr>
<tr><td>Đối tượng</td><td>ứng dụng, hệ phần cứng/phần mềm, hệ điều hành, hệ thống đang test, cấu hình và dữ liệu cấu hình</td><td>hệ thống đang test, cấu hình &amp; dữ liệu, hệ thống phục hồi và hot site, biểu mẫu, báo cáo</td></tr>
<tr><td>Lỗi điển hình</td><td>tính toán sai, hành vi (phi) chức năng sai, luồng dữ liệu sai, không hoàn thành được tác vụ đầu-cuối, không đúng như tài liệu</td><td>luồng công việc không đáp ứng nghiệp vụ, luật nghiệp vụ cài sai, không thoả hợp đồng, lỗi phi chức năng (bảo mật, hiệu năng)</td></tr>
<tr><td>Ai / thế nào</td><td>tester độc lập; ưu tiên black-box (vd decision table), white-box cho độ phủ điều hướng; môi trường giống production</td><td>người dùng (UAT), quản trị hệ thống (OAT), người dùng/tester độc lập (hợp đồng), tester độc lập + cơ quan quản lý (quy định), người dùng bên ngoài (alpha/beta)</td></tr>
</tbody>
</table>`),
    walkHead(D, 75, 105),
    walk(D, [
      [75, 'System Testing',
        `<p class="y-chinh">🎯 System testing looks at the <strong>whole system or product</strong>.</p>
<ul>
<li><strong>Behaviour and capabilities</strong> — of the whole system, not of parts.</li>
<li><strong>End-to-end tasks</strong> — often the tasks the system can perform from start to finish.</li>
<li><strong>Non-functional behaviour</strong> — how the system behaves while performing those tasks.</li>
</ul>`,
        `<p class="y-chinh">🎯 System testing nhìn vào <strong>cả hệ thống hay sản phẩm</strong>.</p>
<ul>
<li><strong>Hành vi và năng lực</strong> — của cả hệ thống, không phải từng phần.</li>
<li><strong>Tác vụ đầu-cuối</strong> — thường xét các tác vụ hệ thống thực hiện được từ đầu tới cuối.</li>
<li><strong>Hành vi phi chức năng</strong> — hệ thống thể hiện thế nào khi thực hiện các tác vụ đó.</li>
</ul>`],
      [76, 'System Testing — the attributes',
        `<p class="y-chinh">🎯 The attributes of system testing are in the table at the top of this lesson — two items set it apart from integration.</p>
<ul>
<li><strong>Test basis</strong> — includes <em>epics, user stories, state diagrams and risk reports</em>.</li>
<li><strong>Typical failure</strong> — "the system <em>cannot complete end-to-end tasks</em>".</li>
</ul>`,
        `<p class="y-chinh">🎯 Các thuộc tính của system testing nằm ở bảng đầu bài — có hai điểm phân biệt nó với integration.</p>
<ul>
<li><strong>Test basis</strong> — có <em>epic, user story, state diagram và báo cáo rủi ro</em>.</li>
<li><strong>Lỗi điển hình</strong> — "hệ thống <em>không hoàn thành được tác vụ đầu-cuối</em>".</li>
</ul>`],
      [77, 'System Testing: approaches & responsibilities',
        `<p class="y-chinh">🎯 System testing is done by independent testers, black-box first, in a production-like environment.</p>
<ul>
<li><strong>Who</strong> — <strong>independent testers</strong> typically carry it out.</li>
<li><strong>Black-box first</strong> — functional requirements are tested with the most appropriate black-box techniques (e.g. decision tables).</li>
<li><strong>White-box as a check</strong> — can assess the thoroughness of elements such as menu structure or web-page navigation.</li>
<li><strong>Environment</strong> — (properly controlled) and ideally corresponding to the <strong>production environment</strong>.</li>
</ul>`,
        `<p class="y-chinh">🎯 System testing do tester độc lập làm, ưu tiên black-box, trong môi trường giống production.</p>
<ul>
<li><strong>Ai làm</strong> — thường là <strong>tester độc lập</strong>.</li>
<li><strong>Black-box trước</strong> — yêu cầu chức năng được test bằng kỹ thuật black-box phù hợp nhất (vd decision table).</li>
<li><strong>White-box để đo</strong> — có thể đo độ kỹ lưỡng với các phần như cấu trúc menu hay điều hướng trang web.</li>
<li><strong>Môi trường</strong> — (được kiểm soát tốt) và lý tưởng là giống <strong>môi trường production</strong>.</li>
</ul>`],
      [78, 'Question — definition of system testing',
        `<p class="y-chinh">🎯 System testing = the behaviour and capabilities of a whole system or product (slide 75).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — separately testable components: component testing.</li>
<li><strong>C</strong> — interactions between components or systems: integration testing.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Testing the behaviour and capabilities of a whole system or product.</strong></p>`,
        `<p class="y-chinh">🎯 System testing = hành vi và năng lực của cả hệ thống hay sản phẩm (slide 75).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — thành phần test riêng được: component testing.</li>
<li><strong>C</strong> — tương tác giữa thành phần hoặc hệ thống: integration testing.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Test hành vi và năng lực của cả hệ thống hay sản phẩm.</strong></p>`],
      [79, 'Question — statements about system testing',
        `<p class="y-chinh">🎯 Statements 1 and 2 are slide 77; statement 3 belongs to acceptance testing, not system testing.</p>
<ul>
<li><strong>1 — correct</strong> — the environment should ideally correspond to production.</li>
<li><strong>2 — correct</strong> — independent testers typically do system testing and rely heavily on specifications.</li>
<li><strong>3 — wrong</strong> — finding defects <em>is</em> an objective of system testing. "Finding defects is often not an objective" is said about <em>acceptance</em> testing (slide 83).</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — 1 and 2 correct; 3 wrong.</strong></p>`,
        `<p class="y-chinh">🎯 Câu 1 và 2 là slide 77; câu 3 nói về acceptance testing, không phải system testing.</p>
<ul>
<li><strong>1 — đúng</strong> — môi trường lý tưởng là giống production.</li>
<li><strong>2 — đúng</strong> — system testing thường do tester độc lập làm, dựa nhiều vào đặc tả.</li>
<li><strong>3 — sai</strong> — tìm lỗi <em>là</em> mục tiêu của system testing. Câu "tìm lỗi thường không phải mục tiêu" là nói về <em>acceptance</em> testing (slide 83).</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — 1 và 2 đúng; 3 sai.</strong></p>`],
      [80, 'Question — test basis of system testing',
        `<p class="y-chinh">🎯 Epics, user stories, state diagrams and risk reports are the system-test basis (slide 76).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — detailed design, code, data model: the component basis.</li>
<li><strong>C</strong> — use cases, workflows, sequence diagrams: the integration basis.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Epics and user stories, state diagrams, risk analysis reports.</strong></p>`,
        `<p class="y-chinh">🎯 Epic, user story, state diagram và báo cáo rủi ro là test basis của system (slide 76).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — thiết kế chi tiết, code, mô hình dữ liệu: test basis của component.</li>
<li><strong>C</strong> — use case, workflow, sequence diagram: test basis của integration.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Epic và user story, state diagram, báo cáo phân tích rủi ro.</strong></p>`],
      [81, 'Question — test object of system testing',
        `<p class="y-chinh">🎯 Applications and operating systems are system-test objects (slide 76).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>B</strong> — reports and forms: acceptance-test objects.</li>
<li><strong>C</strong> — APIs and microservices: integration-test objects.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Applications, operating systems.</strong></p>`,
        `<p class="y-chinh">🎯 Ứng dụng và hệ điều hành là đối tượng của system testing (slide 76).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>B</strong> — báo cáo, biểu mẫu: đối tượng của acceptance.</li>
<li><strong>C</strong> — API, microservice: đối tượng của integration.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Ứng dụng, hệ điều hành.</strong></p>`],
      [82, 'Acceptance Testing — definition',
        `<p class="y-chinh">🎯 Acceptance testing is <strong>formal testing against user needs, requirements and business processes</strong>, to decide whether to accept the system (textbook p.55).</p>
<ul>
<li><strong>Against what</strong> — user needs, requirements and business processes.</li>
<li><strong>To determine</strong> — whether the system satisfies the <strong>acceptance criteria</strong>.</li>
<li><strong>Who decides</strong> — users, customers or another authorised entity decide <strong>whether to accept the system</strong>.</li>
</ul>
<p class="nhan">The wheel — what users judge</p>
<ol class="hai-cot"><li>Satisfaction</li><li>Learnability</li><li>Efficiency</li><li>Memorability</li><li>Errors</li></ol>`,
        `<p class="y-chinh">🎯 Acceptance testing là <strong>kiểm thử chính thức theo nhu cầu, yêu cầu người dùng và quy trình nghiệp vụ</strong>, để quyết định có chấp nhận hệ thống không (giáo trình trang 55).</p>
<ul>
<li><strong>So với cái gì</strong> — nhu cầu, yêu cầu người dùng và quy trình nghiệp vụ.</li>
<li><strong>Để xác định</strong> — hệ thống có thoả <strong>tiêu chí chấp nhận</strong> không.</li>
<li><strong>Ai quyết định</strong> — người dùng, khách hàng hoặc bên có thẩm quyền quyết định <strong>có chấp nhận hệ thống không</strong>.</li>
</ul>
<p class="nhan">Bánh xe — những gì người dùng đánh giá</p>
<ol class="hai-cot"><li>Hài lòng (satisfaction)</li><li>Dễ học (learnability)</li><li>Hiệu quả (efficiency)</li><li>Dễ nhớ (memorability)</li><li>Lỗi (errors)</li></ol>`],
      [83, 'Acceptance Testing — objectives',
        `<p class="y-chinh">🎯 Acceptance testing measures readiness; finding defects is <strong>often not</strong> its objective.</p>
<ul>
<li><strong>Readiness</strong> — it produces information to assess whether the system is ready for deployment and use by the customer (end user).</li>
<li><strong>Defects</strong> — may be found, but finding them is often not an objective.</li>
<li><strong>Many defects = major project risk</strong> — they should have been found at earlier levels.</li>
</ul>`,
        `<p class="y-chinh">🎯 Acceptance testing đo mức sẵn sàng; tìm lỗi <strong>thường không phải</strong> mục tiêu của nó.</p>
<ul>
<li><strong>Mức sẵn sàng</strong> — cung cấp thông tin để đánh giá hệ thống đã sẵn sàng triển khai và cho khách hàng (người dùng cuối) sử dụng chưa.</li>
<li><strong>Lỗi</strong> — có thể phát hiện, nhưng tìm lỗi thường không phải mục tiêu.</li>
<li><strong>Nhiều lỗi = rủi ro lớn của dự án</strong> — lẽ ra chúng phải được tìm thấy ở các cấp trước.</li>
</ul>`],
      [84, 'Acceptance Testing: UAT',
        `<p class="y-chinh">🎯 User acceptance testing (UAT) is done by <strong>end users</strong> and focuses on <strong>business processes</strong>.</p>
<ul>
<li><strong>Done by</strong> — end users.</li>
<li><strong>Focus</strong> — business processes.</li>
<li><strong>Environment</strong> — real or simulated operational environment.</li>
<li><strong>Aim</strong> — confidence that the system lets users do what they need with a minimum of difficulty, cost and risk.</li>
</ul>`,
        `<p class="y-chinh">🎯 User acceptance testing (UAT) do <strong>người dùng cuối</strong> làm và tập trung vào <strong>quy trình nghiệp vụ</strong>.</p>
<ul>
<li><strong>Ai làm</strong> — người dùng cuối.</li>
<li><strong>Trọng tâm</strong> — quy trình nghiệp vụ.</li>
<li><strong>Môi trường</strong> — môi trường vận hành thật hoặc mô phỏng.</li>
<li><strong>Mục đích</strong> — tin rằng hệ thống giúp người dùng làm được việc họ cần với ít khó khăn, chi phí và rủi ro nhất.</li>
</ul>`],
      [85, 'User acceptance testing — how',
        `<p class="y-chinh">🎯 UAT is the final stage of validation, ending with the customer's <strong>final sign-off</strong>.</p>
<p class="nhan">What it is</p>
<ul>
<li><strong>Customer in charge</strong> — the customer (user) performs it or is closely involved.</li>
<li><strong>Any test they wish</strong> — usually based on their business processes.</li>
<li><strong>Final user sign-off</strong></li>
</ul>
<p class="nhan">Approach</p>
<ul>
<li><strong>Mixed</strong> — scripted and unscripted testing.</li>
<li><strong>"Model office"</strong> — sometimes used: a realistic replica of the user's workplace.</li>
</ul>`,
        `<p class="y-chinh">🎯 UAT là chặng validation cuối cùng, kết thúc bằng việc khách hàng <strong>ký nghiệm thu cuối</strong>.</p>
<p class="nhan">Nó là gì</p>
<ul>
<li><strong>Khách hàng làm chủ</strong> — khách hàng (người dùng) tự làm hoặc tham gia sát sao.</li>
<li><strong>Test bất cứ gì họ muốn</strong> — thường theo quy trình nghiệp vụ của họ.</li>
<li><strong>Ký nghiệm thu cuối</strong></li>
</ul>
<p class="nhan">Cách làm</p>
<ul>
<li><strong>Kết hợp</strong> — test có kịch bản và không kịch bản.</li>
<li><strong>"Model office"</strong> — đôi khi được dùng: bản sao thực tế nơi làm việc của người dùng.</li>
</ul>`],
      [86, 'Why customer / user involvement',
        `<p class="y-chinh">🎯 Involve users because they know how the business really works.</p>
<p class="nhan">What users know</p>
<ol>
<li>What really happens in business situations</li>
<li>The complexity of business relationships</li>
<li>How they would do their work using the system</li>
<li>Variants of standard tasks (e.g. country-specific)</li>
<li>Examples of real cases</li>
<li>How to identify sensible work-arounds</li>
</ol>
<p class="nhan">Benefit</p>
<p>Users gain a <strong>detailed understanding of the new system</strong>.</p>`,
        `<p class="y-chinh">🎯 Cần người dùng tham gia vì họ biết nghiệp vụ thật sự vận hành thế nào.</p>
<p class="nhan">Người dùng biết gì</p>
<ol>
<li>Điều thật sự diễn ra trong các tình huống nghiệp vụ</li>
<li>Độ phức tạp của các quan hệ nghiệp vụ</li>
<li>Họ sẽ làm việc với hệ thống ra sao</li>
<li>Các biến thể của tác vụ chuẩn (vd theo từng nước)</li>
<li>Các ví dụ thật</li>
<li>Cách nhận ra những cách lách hợp lý</li>
</ol>
<p class="nhan">Lợi ích</p>
<p>Người dùng có <strong>hiểu biết chi tiết về hệ thống mới</strong>.</p>`],
      [87, 'Acceptance Testing: OAT',
        `<p class="y-chinh">🎯 Operational acceptance testing (OAT) is done by <strong>system administrators</strong>, in a simulated production environment.</p>
<ul>
<li><strong>Done by</strong> — system administrators.</li>
<li><strong>Environment</strong> — simulated production environment.</li>
<li><strong>Aim</strong> — confidence that admins can keep the system running and recover from adverse events quickly, without additional risks.</li>
</ul>
<p class="nhan">Focus</p>
<ol class="hai-cot"><li>Backups</li><li>Installation, uninstallation, upgrading</li><li>Disaster recovery</li><li>User management</li><li>Maintenance</li><li>Data loading &amp; migration</li><li>Security</li><li>Performance</li></ol>`,
        `<p class="y-chinh">🎯 Operational acceptance testing (OAT) do <strong>quản trị hệ thống</strong> làm, trong môi trường production mô phỏng.</p>
<ul>
<li><strong>Ai làm</strong> — quản trị hệ thống (system admin).</li>
<li><strong>Môi trường</strong> — môi trường production mô phỏng.</li>
<li><strong>Mục đích</strong> — tin rằng admin giữ được hệ thống chạy và phục hồi nhanh khi có sự cố, không thêm rủi ro.</li>
</ul>
<p class="nhan">Trọng tâm</p>
<ol class="hai-cot"><li>Sao lưu</li><li>Cài đặt, gỡ cài đặt, nâng cấp</li><li>Khắc phục thảm hoạ</li><li>Quản lý người dùng</li><li>Bảo trì</li><li>Nạp &amp; chuyển đổi dữ liệu</li><li>Bảo mật</li><li>Hiệu năng</li></ol>`],
      [88, 'Acceptance Testing: contractual & regulatory',
        `<p class="y-chinh">🎯 Contractual and regulatory AT check the system against the contract and against the law.</p>
<ul>
<li><strong>Contractual AT</strong> — verifies the system satisfies its <strong>contractual requirements</strong>; done by users or independent testers.</li>
<li><strong>Regulatory AT</strong> — verifies the system conforms to relevant <strong>laws, policies and regulations</strong>; done by independent testers, possibly with a representative of the regulatory body.</li>
</ul>`,
        `<p class="y-chinh">🎯 Contractual và regulatory AT kiểm hệ thống so với hợp đồng và so với luật.</p>
<ul>
<li><strong>Contractual AT</strong> — kiểm hệ thống thoả <strong>yêu cầu trong hợp đồng</strong>; do người dùng hoặc tester độc lập làm.</li>
<li><strong>Regulatory AT</strong> — kiểm hệ thống tuân thủ <strong>luật, chính sách, quy định</strong> liên quan; do tester độc lập làm, có thể có đại diện cơ quan quản lý.</li>
</ul>`],
      [89, 'Acceptance Testing: alpha & beta',
        `<p class="y-chinh">🎯 Alpha and beta differ by <strong>place</strong>: alpha at the developer's site, beta at an external site.</p>
<ul>
<li><strong>Alpha</strong> — simulated or actual operational testing at the <strong>developer's</strong> test environment, by roles outside the development organisation.</li>
<li><strong>Beta (field testing)</strong> — simulated or actual operational testing at an <strong>external site</strong>, by roles outside the development organisation. Diverse users and environments cover more combinations of factors.</li>
</ul>
<p>Both are used by makers of commercial off-the-shelf (COTS) software to get feedback from potential or existing users before the product is put on the market (question slide 97).</p>`,
        `<p class="y-chinh">🎯 Alpha và beta khác nhau ở <strong>địa điểm</strong>: alpha tại nơi bên phát triển, beta tại nơi bên ngoài.</p>
<ul>
<li><strong>Alpha</strong> — kiểm thử vận hành thật hoặc mô phỏng trong môi trường test của <strong>bên phát triển</strong>, do người ngoài tổ chức phát triển làm.</li>
<li><strong>Beta (field testing)</strong> — kiểm thử vận hành thật hoặc mô phỏng tại <strong>nơi bên ngoài</strong>, do người ngoài tổ chức phát triển làm. Người dùng và môi trường đa dạng nên phủ được nhiều tổ hợp yếu tố hơn.</li>
</ul>
<p>Cả hai được các hãng làm phần mềm đóng gói (COTS) dùng để lấy phản hồi từ người dùng tiềm năng hoặc hiện tại trước khi đưa sản phẩm ra thị trường (câu hỏi slide 97).</p>`],
      [90, 'Acceptance Testing — the attributes',
        `<p class="y-chinh">🎯 The full attribute table of acceptance testing — summarised in the table at the top of this lesson.</p>
<ul>
<li><strong>Objectives</strong> — establish confidence; validate the system is complete and works as expected; verify functional &amp; non-functional behaviour as specified.</li>
<li><strong>Test basis</strong> — business processes, user/business requirements, regulations, contracts &amp; standards, use cases, system documentation, risk reports — plus operational documents (backup &amp; recovery procedures, disaster-recovery plan, operations docs, performance targets, security standards).</li>
<li><strong>Test objects</strong> — system under test, configuration &amp; data, recovery systems and hot sites, forms, reports.</li>
<li><strong>Typical defects</strong> — system workflows, business rules, contract, non-functional failures (security vulnerabilities, performance inefficiency…).</li>
</ul>
<p class="ghi-chu">"Hot sits" on the slide is a typo for <em>hot sites</em>: standby data centres ready to take over.</p>`,
        `<p class="y-chinh">🎯 Bảng thuộc tính đầy đủ của acceptance testing — đã tóm tắt ở bảng đầu bài.</p>
<ul>
<li><strong>Mục tiêu</strong> — tạo niềm tin; validate hệ thống hoàn chỉnh và chạy như mong đợi; verify hành vi chức năng &amp; phi chức năng đúng đặc tả.</li>
<li><strong>Test basis</strong> — quy trình nghiệp vụ, yêu cầu người dùng/nghiệp vụ, quy định, hợp đồng &amp; tiêu chuẩn, use case, tài liệu hệ thống, báo cáo rủi ro — cộng tài liệu vận hành (thủ tục sao lưu &amp; phục hồi, kế hoạch khắc phục thảm hoạ, tài liệu vận hành, mục tiêu hiệu năng, tiêu chuẩn bảo mật).</li>
<li><strong>Đối tượng test</strong> — hệ thống đang test, cấu hình &amp; dữ liệu, hệ thống phục hồi và hot site, biểu mẫu, báo cáo.</li>
<li><strong>Lỗi điển hình</strong> — luồng công việc, luật nghiệp vụ, hợp đồng, lỗi phi chức năng (lỗ hổng bảo mật, hiệu năng kém…).</li>
</ul>
<p class="ghi-chu">"Hot sits" trên slide là lỗi chính tả của <em>hot sites</em>: trung tâm dữ liệu dự phòng sẵn sàng tiếp quản.</p>`],
      [91, 'Acceptance testing motto',
        `<p class="y-chinh">🎯 "If you don't have patience to test the system, the system will surely test your patience."</p>
<p>Skipped acceptance testing is paid back in production incidents.</p>`,
        `<p class="y-chinh">🎯 "Nếu bạn không đủ kiên nhẫn để test hệ thống, hệ thống chắc chắn sẽ thử thách lòng kiên nhẫn của bạn."</p>
<p>Bỏ qua acceptance testing thì sẽ trả giá bằng sự cố trên production.</p>`],
      [92, 'Question — similarity between system and acceptance testing',
        `<p class="y-chinh">🎯 System and acceptance testing share their focus: the whole system or product.</p>
<ul>
<li><strong>Same focus</strong> — behaviour and capabilities of a whole system (slides 75 and 82).</li>
<li><strong>A and B are wrong</strong> — their test objects and test bases differ (see the table at the top).</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Both focus on the behaviour and capabilities of a whole system or product.</strong></p>`,
        `<p class="y-chinh">🎯 System và acceptance testing có chung trọng tâm: cả hệ thống hay sản phẩm.</p>
<ul>
<li><strong>Chung trọng tâm</strong> — hành vi và năng lực của cả hệ thống (slide 75 và 82).</li>
<li><strong>A và B sai</strong> — đối tượng và test basis của chúng khác nhau (xem bảng đầu bài).</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Cả hai tập trung vào hành vi và năng lực của cả hệ thống/sản phẩm.</strong></p>`],
      [93, 'Question — too many defects during acceptance',
        `<p class="y-chinh">🎯 Many defects during acceptance testing is a bad sign — a major project risk (slide 83).</p>
<ul>
<li><strong>Not the goal</strong> — finding defects is often not an objective of acceptance testing.</li>
<li><strong>A warning</strong> — a significant number of defects at this level may be considered a major project risk: they should have been found earlier.</li>
<li><strong>Why A is wrong</strong> — many defects here do not mean quality is increasing.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — A bad situation: finding defects is often not an objective of acceptance testing, and many defects there may be a major project risk.</strong></p>`,
        `<p class="y-chinh">🎯 Nhiều lỗi trong acceptance testing là dấu hiệu xấu — rủi ro lớn của dự án (slide 83).</p>
<ul>
<li><strong>Không phải mục tiêu</strong> — tìm lỗi thường không phải mục tiêu của acceptance testing.</li>
<li><strong>Một lời cảnh báo</strong> — nhiều lỗi ở cấp này có thể bị xem là rủi ro lớn của dự án: lẽ ra phải tìm thấy từ trước.</li>
<li><strong>Vì sao A sai</strong> — nhiều lỗi ở đây không có nghĩa là chất lượng đang tăng.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Tình huống xấu: tìm lỗi thường không phải mục tiêu của acceptance, và nhiều lỗi ở giai đoạn này có thể là rủi ro lớn của dự án.</strong></p>`],
      [94, 'Question — test basis of acceptance testing',
        `<p class="y-chinh">🎯 Regulations, legal contracts and standards are an acceptance-test basis (slide 90).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>B</strong> — state diagrams: a system-test basis.</li>
<li><strong>C</strong> — workflows: an integration-test basis.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — Regulations, legal contracts and standards.</strong></p>`,
        `<p class="y-chinh">🎯 Quy định, hợp đồng pháp lý và tiêu chuẩn là test basis của acceptance (slide 90).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>B</strong> — state diagram: test basis của system.</li>
<li><strong>C</strong> — workflow: test basis của integration.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — Quy định, hợp đồng pháp lý và tiêu chuẩn.</strong></p>`],
      [95, 'Question — a defect found in acceptance testing',
        `<p class="y-chinh">🎯 Business rules implemented wrongly is a typical acceptance defect (slide 90).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — cannot complete end-to-end tasks: the typical system-test failure.</li>
<li><strong>C</strong> — interface mismatch: integration.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Business rules are not implemented correctly.</strong></p>`,
        `<p class="y-chinh">🎯 Luật nghiệp vụ cài sai là lỗi điển hình của acceptance (slide 90).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — không hoàn thành được tác vụ đầu-cuối: lỗi điển hình của system.</li>
<li><strong>C</strong> — giao diện không khớp: integration.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Luật nghiệp vụ được cài đặt sai.</strong></p>`],
      [96, 'Question — system administrators in a simulated production environment',
        `<p class="y-chinh">🎯 System administrators + simulated production environment = operational acceptance testing (slide 87).</p>
<ul>
<li><strong>UAT</strong> — end users, business processes.</li>
<li><strong>OAT</strong> — system administrators, simulated production environment ← this one.</li>
<li><strong>Contractual/regulatory</strong> — contract, laws and regulations.</li>
<li><strong>Alpha/beta</strong> — outside users, at the developer's or an external site.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Operational acceptance testing.</strong></p>`,
        `<p class="y-chinh">🎯 Quản trị hệ thống + môi trường production mô phỏng = operational acceptance testing (slide 87).</p>
<ul>
<li><strong>UAT</strong> — người dùng cuối, quy trình nghiệp vụ.</li>
<li><strong>OAT</strong> — quản trị hệ thống, môi trường production mô phỏng ← chính là nó.</li>
<li><strong>Hợp đồng/quy định</strong> — hợp đồng, luật và quy định.</li>
<li><strong>Alpha/beta</strong> — người dùng bên ngoài, tại nơi bên phát triển hoặc nơi bên ngoài.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Operational acceptance testing.</strong></p>`],
      [97, 'Question — COTS vendors getting feedback before market release',
        `<p class="y-chinh">🎯 COTS vendors collecting feedback before market release use alpha and beta testing (slide 89).</p>
<ul>
<li><strong>Who</strong> — developers of commercial off-the-shelf software.</li>
<li><strong>From whom</strong> — potential or existing users, customers and/or operators.</li>
<li><strong>When</strong> — before the product is put on the market.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — Alpha and beta testing.</strong></p>`,
        `<p class="y-chinh">🎯 Hãng COTS lấy phản hồi trước khi đưa ra thị trường thì dùng alpha và beta testing (slide 89).</p>
<ul>
<li><strong>Ai</strong> — bên phát triển phần mềm đóng gói thương mại (COTS).</li>
<li><strong>Lấy từ ai</strong> — người dùng, khách hàng và/hoặc người vận hành tiềm năng hoặc hiện tại.</li>
<li><strong>Khi nào</strong> — trước khi sản phẩm được đưa ra thị trường.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — Alpha và beta testing.</strong></p>`],
      [98, 'Question — fitness for use by intended users',
        `<p class="y-chinh">🎯 Validating fitness for use by intended users in a real or simulated environment is the definition of UAT (slide 84).</p>
<ul>
<li><strong>Intended users</strong> — end users, not administrators (OAT) or regulators.</li>
<li><strong>Fitness for use</strong> — can users do their work with the system?</li>
<li><strong>Real or simulated operational environment</strong> — exactly UAT's environment.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: A — User acceptance testing.</strong></p>`,
        `<p class="y-chinh">🎯 Validate mức phù hợp sử dụng bởi người dùng dự kiến trong môi trường thật/mô phỏng chính là định nghĩa UAT (slide 84).</p>
<ul>
<li><strong>Người dùng dự kiến</strong> — người dùng cuối, không phải quản trị hệ thống (OAT) hay cơ quan quản lý.</li>
<li><strong>Phù hợp để dùng</strong> — người dùng có làm được việc của mình với hệ thống không?</li>
<li><strong>Môi trường vận hành thật hoặc mô phỏng</strong> — đúng môi trường của UAT.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: A — User acceptance testing.</strong></p>`],
      [99, 'Question — level focused on confidence more than defects',
        `<p class="y-chinh">🎯 Acceptance testing aims first at confidence; finding defects is often not an objective (slides 83 and 90).</p>
<ul>
<li><strong>Acceptance</strong> — first objective: establish confidence.</li>
<li><strong>Unit, integration, system</strong> — all list "find defects" among their objectives.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: D — Acceptance testing.</strong></p>`,
        `<p class="y-chinh">🎯 Acceptance testing nhắm trước hết vào niềm tin; tìm lỗi thường không phải mục tiêu (slide 83 và 90).</p>
<ul>
<li><strong>Acceptance</strong> — mục tiêu hàng đầu: tạo niềm tin.</li>
<li><strong>Unit, integration, system</strong> — đều có "tìm lỗi" trong danh sách mục tiêu.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: D — Acceptance testing.</strong></p>`],
      [100, 'Review question — where developers are most involved',
        `<p class="y-chinh">🎯 Developers are most involved in component testing (slide 43).</p>
<ul>
<li><strong>Component</strong> — usually done by the developer.</li>
<li><strong>Acceptance</strong> — done by users, admins or independent testers.</li>
<li><strong>"Compatible", "conversion"</strong> — not test levels at all.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: C — Component.</strong></p>`,
        `<p class="y-chinh">🎯 Developer tham gia nhiều nhất ở component testing (slide 43).</p>
<ul>
<li><strong>Component</strong> — thường do developer làm.</li>
<li><strong>Acceptance</strong> — do người dùng, admin hoặc tester độc lập làm.</li>
<li><strong>"Compatible", "conversion"</strong> — không phải cấp test.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: C — Component.</strong></p>`],
      [101, 'Review question — component vs system testing',
        `<p class="y-chinh">🎯 The true comparison is about the test basis: component tests come from component/design specs, system tests from requirement specs and use cases.</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — "system testing verifies interfaces between components" describes integration testing.</li>
<li><strong>C</strong> — component testing also covers non-functional characteristics.</li>
<li><strong>D</strong> — system testing is usually done by independent testers, not by the users.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B.</strong> Component test cases come from component specifications, design specifications or data models; system test cases from requirement specifications, functional specifications or use cases.</p>`,
        `<p class="y-chinh">🎯 So sánh đúng nằm ở test basis: test component lấy từ đặc tả thành phần/thiết kế, test system lấy từ đặc tả yêu cầu và use case.</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — "system testing kiểm giao diện giữa các thành phần" là mô tả integration testing.</li>
<li><strong>C</strong> — component testing cũng test đặc tính phi chức năng.</li>
<li><strong>D</strong> — system testing thường do tester độc lập làm, không phải người dùng.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B.</strong> Test case component lấy từ đặc tả thành phần, đặc tả thiết kế hoặc mô hình dữ liệu; test case system lấy từ đặc tả yêu cầu, đặc tả chức năng hoặc use case.</p>`],
      [102, 'Review question — (repeated in the deck)',
        `<p class="y-chinh">🎯 The deck shows the same question as slide 101 a second time.</p>
<p class="dap-an">✅ <strong>Answer: B</strong> — same answer, same reasoning as slide 101.</p>`,
        `<p class="y-chinh">🎯 Bộ slide lặp lại đúng câu hỏi của slide 101 lần thứ hai.</p>
<p class="dap-an">✅ <strong>Đáp án: B</strong> — cùng đáp án, cùng lập luận như slide 101.</p>`],
      [103, 'Review question — use cases are a basis for…',
        `<p class="y-chinh">🎯 Use cases describe end-to-end interactions — a system (and acceptance) test basis.</p>
<ul>
<li><strong>Unit</strong> — its basis is detailed design and code, not use cases.</li>
<li><strong>"Load and performance", "usability"</strong> — test types, not levels.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — System.</strong></p>`,
        `<p class="y-chinh">🎯 Use case mô tả tương tác đầu-cuối — là test basis của system (và acceptance).</p>
<ul>
<li><strong>Unit</strong> — test basis là thiết kế chi tiết và code, không phải use case.</li>
<li><strong>"Load and performance", "usability"</strong> — là loại test, không phải cấp.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — System.</strong></p>`],
      [104, 'Review question — a well-managed test level',
        `<p class="y-chinh">🎯 A well-managed test level has its own test objective — characteristic 2 of good testing (slide 4).</p>
<p class="nhan">Why the others are wrong</p>
<ul>
<li><strong>A</strong> — there is no fixed target duration such as one month.</li>
<li><strong>C</strong> — levels may overlap (slide 16).</li>
<li><strong>D</strong> — a level uses whatever techniques fit, not a single one.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — It has a corresponding test objective.</strong></p>`,
        `<p class="y-chinh">🎯 Một cấp test được quản lý tốt có mục tiêu test riêng — đặc điểm số 2 của kiểm thử tốt (slide 4).</p>
<p class="nhan">Vì sao các phương án khác sai</p>
<ul>
<li><strong>A</strong> — không có thời lượng cố định kiểu một tháng.</li>
<li><strong>C</strong> — các cấp có thể chồng nhau (slide 16).</li>
<li><strong>D</strong> — mỗi cấp dùng kỹ thuật nào phù hợp, không phải chỉ một.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Có mục tiêu test tương ứng.</strong></p>`],
      [105, 'Review question — where alpha testing happens',
        `<p class="y-chinh">🎯 Alpha testing happens at the developer's end; beta at the users' end (slide 89).</p>
<ul>
<li><strong>Alpha</strong> — at the developer's site, by roles outside the development organisation.</li>
<li><strong>Beta</strong> — at the users' (external) sites.</li>
</ul>
<p class="dap-an">✅ <strong>Answer: B — Developer's end.</strong></p>`,
        `<p class="y-chinh">🎯 Alpha testing diễn ra phía bên phát triển; beta diễn ra phía người dùng (slide 89).</p>
<ul>
<li><strong>Alpha</strong> — tại nơi của bên phát triển, do người ngoài tổ chức phát triển làm.</li>
<li><strong>Beta</strong> — tại nơi (bên ngoài) của người dùng.</li>
</ul>
<p class="dap-an">✅ <strong>Đáp án: B — Phía bên phát triển.</strong></p>`],
    ]),
    bi(`<h3>🔒 Hidden slides (pptx 79–83): the older "system testing" block</h3>
<p>The deck keeps five hidden slides from the previous syllabus:</p>
<ul>
<li><strong>System testing</strong> — seen as the <em>last integration step</em>.</li>
<li><strong>Functional system testing</strong> — split into requirements-based and business-process-based.</li>
<li><strong>Non-functional requirements</strong> — "as important as functional ones, often poorly specified, and must be tested".</li>
<li><strong>Non-functional system tests</strong> — usability, security, documentation, storage, volume, configuration/installation, reliability, backup/recovery, performance/load/stress.</li>
</ul>
<p>The same material is taught in the visible slides 108–122 (lesson 2.4).</p>
<h3>Ví dụ có lời giải · Worked example — which acceptance test is it?</h3>
<table>
<thead><tr><th>Situation</th><th>Type</th></tr></thead>
<tbody>
<tr><td>Accountants of the client run their month-end closing on the new ERP in a copy of their office.</td><td>UAT ("model office")</td></tr>
<tr><td>The DBA restores yesterday's backup to the standby server and measures how long it takes.</td><td>OAT (backup &amp; recovery)</td></tr>
<tr><td>An auditor from the State Bank checks that the loan module follows the interest-rate rules in the circular.</td><td>Regulatory AT</td></tr>
<tr><td>The client checks each deliverable listed in Annex B of the contract before paying the second instalment.</td><td>Contractual AT</td></tr>
<tr><td>A game studio invites 50 players to its office for a play-test, then ships an early-access build to 5,000 players at home.</td><td>Alpha, then beta</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Alpha vs beta: remember the place, not the order.</strong> Alpha = at the <em>developer's</em> site; beta = at the <em>users'</em> sites. Both are done by people outside the development team — so "alpha testing is done by developers" is false.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Acceptance tests as executable specifications.</strong>
<ul>
<li><strong>Write</strong> — many teams now write acceptance criteria in Gherkin (<em>Given … When … Then …</em>).</li>
<li><strong>Run</strong> — Cucumber or SpecFlow executes them, so the business-readable criteria are also automated tests (ATDD/BDD — Chapter 9 and Topic 8).</li>
<li><strong>Sign off</strong> — the UAT sign-off then covers exploratory checks by users; the scripted part is already green in the pipeline.</li>
</ul>
<p class="ghi-chu">Outside this chapter because CTFL treats acceptance testing as a level, not a technique.</p></div>`,
    `<h3>🔒 Slide ẩn (pptx 79–83): khối "system testing" bản cũ</h3>
<p>Bộ slide giữ năm slide ẩn từ syllabus cũ:</p>
<ul>
<li><strong>System testing</strong> — được xem là <em>bước tích hợp cuối cùng</em>.</li>
<li><strong>System testing chức năng</strong> — chia thành dựa trên yêu cầu và dựa trên quy trình nghiệp vụ.</li>
<li><strong>Yêu cầu phi chức năng</strong> — "quan trọng không kém chức năng, thường được đặc tả kém, và bắt buộc phải test".</li>
<li><strong>Các system test phi chức năng</strong> — usability, security, documentation, storage, volume, configuration/installation, reliability, backup/recovery, performance/load/stress.</li>
</ul>
<p>Nội dung này được dạy ở các slide hiển thị 108–122 (bài 2.4).</p>
<h3>Ví dụ có lời giải · Đây là loại acceptance test nào?</h3>
<table>
<thead><tr><th>Tình huống</th><th>Loại</th></tr></thead>
<tbody>
<tr><td>Kế toán của khách hàng chạy quy trình khoá sổ cuối tháng trên ERP mới trong một bản sao văn phòng của họ.</td><td>UAT ("model office")</td></tr>
<tr><td>DBA khôi phục bản sao lưu hôm qua lên máy chủ dự phòng và đo thời gian mất bao lâu.</td><td>OAT (sao lưu &amp; phục hồi)</td></tr>
<tr><td>Thanh tra Ngân hàng Nhà nước kiểm tra module cho vay tuân thủ quy định lãi suất trong thông tư.</td><td>Regulatory AT</td></tr>
<tr><td>Khách hàng kiểm từng hạng mục bàn giao ghi trong Phụ lục B hợp đồng trước khi thanh toán đợt hai.</td><td>Contractual AT</td></tr>
<tr><td>Studio game mời 50 người chơi tới văn phòng chơi thử, sau đó phát bản early-access cho 5.000 người chơi ở nhà.</td><td>Alpha, rồi beta</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Alpha vs beta: nhớ theo địa điểm, không theo thứ tự.</strong> Alpha = tại nơi <em>bên phát triển</em>; beta = tại nơi <em>người dùng</em>. Cả hai đều do người ngoài nhóm phát triển làm — nên "alpha testing do developer làm" là sai.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Acceptance test như đặc tả chạy được.</strong>
<ul>
<li><strong>Viết</strong> — nhiều nhóm hiện viết acceptance criteria bằng Gherkin (<em>Given … When … Then …</em>).</li>
<li><strong>Chạy</strong> — Cucumber hay SpecFlow thực thi chúng, nên tiêu chí người nghiệp vụ đọc được cũng chính là test tự động (ATDD/BDD — Chương 9 và Topic 8).</li>
<li><strong>Ký nghiệm thu</strong> — buổi ký UAT khi đó chỉ còn các kiểm tra khám phá của người dùng; phần có kịch bản đã xanh sẵn trong pipeline.</li>
</ul>
<p class="ghi-chu">Ngoài chương này vì CTFL xem acceptance testing là một cấp, không phải một kỹ thuật.</p></div>`),
    books([
      ['fst4', 'Ch.2 §2 "Test levels" — system testing pp.54–57, acceptance testing pp.57–61 (PDF 68–75); acceptance definition p.55', 'Chương 2 §2 "Test levels" — system testing trang 54–57, acceptance testing trang 57–61 (PDF 68–75); định nghĩa acceptance trang 55'],
      ['fst', '§2.2 "Test levels" (system & acceptance) — pp.43–45 (PDF 46–48)', '§2.2 "Test levels" (system & acceptance) — trang 43–45 (PDF 46–48)'],
      ['sp5', '§3.4.3 System testing (PDF 105–107); §3.4.4 Acceptance testing (PDF 108–111)', '§3.4.3 System testing (PDF 105–107); §3.4.4 Acceptance testing (PDF 108–111)'],
      ['sp4', '§3.4 System test pp.58–60 (PDF 73–75); §3.5 Acceptance test pp.61–64 (PDF 76–79)', '§3.4 System test trang 58–60 (PDF 73–75); §3.5 Acceptance test trang 61–64 (PDF 76–79)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────────── 2.4 Test types ───────────────────────────── */
const L24 = {
  title: '2.4 — Test types: functional, non-functional, white-box & change-related|||2.4 — Các loại test: chức năng, phi chức năng, white-box & liên quan thay đổi',
  slug: 'swt301-test-types',
  type: 'VIDEO',
  description: 'SWT2 slide 106–130: 4 loại test, functional (requirements-based & business-process-based, coverage), non-functional (performance, multi-user, usability, security, configuration, reliability, backup/recovery, documentation), white-box, confirmation vs regression, ma trận loại test × cấp test.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.4 · SWT2 slides 106–130</span>
<h2>Test types</h2>
<p class="lead">A <strong>test level</strong> says <em>where</em> in the lifecycle you test; a <strong>test type</strong> says <em>what characteristic</em> you test. There are four types, and — the key exam point — <strong>every type can be performed at every level</strong>.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-2.3.1</strong> — Compare functional, non-functional and white-box testing (K2).</li>
<li><strong>LO-2.3.2</strong> — Recognise that functional, non-functional and white-box tests occur at any test level (K1).</li>
<li><strong>LO-2.3.3</strong> — Compare the purposes of confirmation testing and regression testing (K2).</li>
</ul></div>
<table>
<thead><tr><th>Type</th><th>Tests…</th><th>Coverage measured as % of…</th><th>Typical techniques</th></tr></thead>
<tbody>
<tr><td>Functional</td><td><em>what</em> the system does</td><td>functional elements (requirements, features, user stories)</td><td>black-box (EP, BVA, decision tables…)</td></tr>
<tr><td>Non-functional</td><td><em>how well</em> it behaves (performance, usability, security, reliability…)</td><td>non-functional elements (user groups, device types…)</td><td>mostly black-box (BVA for stress, EP for device classes)</td></tr>
<tr><td>White-box</td><td>internal structure (code, architecture, workflows, data flows)</td><td>structural elements (statements, decisions, interfaces)</td><td>statement/decision coverage (Chapter 5)</td></tr>
<tr><td>Change-related</td><td>that a change fixed the defect (confirmation) and broke nothing else (regression)</td><td>—</td><td>re-running tests; regression is a prime candidate for automation</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 2 · Bài 2.4 · SWT2 slide 106–130</span>
<h2>Các loại test (test types)</h2>
<p class="lead"><strong>Cấp test</strong> cho biết test <em>ở đâu</em> trong vòng đời; <strong>loại test</strong> cho biết test <em>đặc tính gì</em>. Có bốn loại, và — ý thi quan trọng nhất — <strong>loại nào cũng thực hiện được ở mọi cấp</strong>.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-2.3.1</strong> — So sánh test chức năng, phi chức năng và white-box (K2).</li>
<li><strong>LO-2.3.2</strong> — Nhận ra test chức năng, phi chức năng và white-box diễn ra ở mọi cấp (K1).</li>
<li><strong>LO-2.3.3</strong> — So sánh mục đích của confirmation testing và regression testing (K2).</li>
</ul></div>
<table>
<thead><tr><th>Loại</th><th>Test…</th><th>Coverage đo bằng % của…</th><th>Kỹ thuật điển hình</th></tr></thead>
<tbody>
<tr><td>Functional (chức năng)</td><td>hệ thống làm <em>gì</em></td><td>phần tử chức năng (yêu cầu, tính năng, user story)</td><td>black-box (EP, BVA, decision table…)</td></tr>
<tr><td>Non-functional (phi chức năng)</td><td>hệ thống chạy <em>tốt đến đâu</em> (hiệu năng, khả dụng, bảo mật, tin cậy…)</td><td>phần tử phi chức năng (nhóm người dùng, loại thiết bị…)</td><td>chủ yếu black-box (BVA cho stress, EP cho nhóm thiết bị)</td></tr>
<tr><td>White-box</td><td>cấu trúc bên trong (code, kiến trúc, luồng công việc, luồng dữ liệu)</td><td>phần tử cấu trúc (câu lệnh, quyết định, giao diện)</td><td>statement/decision coverage (Chương 5)</td></tr>
<tr><td>Change-related (liên quan thay đổi)</td><td>bản sửa đã gỡ đúng lỗi (confirmation) và không làm hỏng chỗ khác (regression)</td><td>—</td><td>chạy lại test; regression là ứng viên số một cho tự động hoá</td></tr>
</tbody>
</table>`),
    walkHead(D, 106, 130),
    walk(D, [
      [106, 'CONTENT — Test types',
        `<p class="y-chinh">🎯 Third block of the chapter: test types.</p>`,
        `<p class="y-chinh">🎯 Khối thứ ba của chương: các loại test.</p>`],
      [107, 'Test Types',
        `<p class="y-chinh">🎯 A test type is a group of test activities aimed at <strong>specific characteristics</strong> of a system (or part of it), based on specific objectives.</p>
<p class="nhan">The four branches</p>
<ol>
<li><strong>Functional testing</strong> — testing of functions.</li>
<li><strong>Non-functional testing</strong> — testing of quality characteristics.</li>
<li><strong>White-box testing</strong> — testing of structure/architecture.</li>
<li><strong>Change-related testing</strong> — confirmation and regression.</li>
</ol>`,
        `<p class="y-chinh">🎯 Loại test là một nhóm hoạt động kiểm thử nhắm vào <strong>các đặc tính cụ thể</strong> của hệ thống (hoặc một phần của nó), theo mục tiêu cụ thể.</p>
<p class="nhan">Bốn nhánh</p>
<ol>
<li><strong>Kiểm thử chức năng</strong> — kiểm các chức năng.</li>
<li><strong>Kiểm thử phi chức năng</strong> — kiểm các đặc tính chất lượng.</li>
<li><strong>White-box testing</strong> — kiểm cấu trúc/kiến trúc.</li>
<li><strong>Kiểm thử liên quan thay đổi</strong> — confirmation và regression.</li>
</ol>`],
      [108, '[1] Functional Testing',
        `<p class="y-chinh">🎯 The function of a system is <strong>"what" it does</strong>; functional testing checks compliance with functional requirements.</p>
<p class="nhan">Where functional requirements are written</p>
<ul>
<li>Business requirement specifications</li>
<li>Epics and user stories</li>
<li>Use cases</li>
<li>Functional specifications</li>
<li>…or they may be undocumented</li>
</ul>
<p class="nhan">How it is done</p>
<ul>
<li><strong>At all test levels</strong> — with a different focus at each level.</li>
<li><strong>From two perspectives</strong> — requirements-based (slide 110) and business-process-based (slide 111).</li>
</ul>`,
        `<p class="y-chinh">🎯 Chức năng của hệ thống là <strong>"cái" nó làm</strong>; kiểm thử chức năng kiểm mức tuân thủ yêu cầu chức năng.</p>
<p class="nhan">Yêu cầu chức năng được viết ở đâu</p>
<ul>
<li>Đặc tả yêu cầu nghiệp vụ</li>
<li>Epic và user story</li>
<li>Use case</li>
<li>Đặc tả chức năng</li>
<li>…hoặc không được viết ra</li>
</ul>
<p class="nhan">Làm thế nào</p>
<ul>
<li><strong>Ở mọi cấp test</strong> — mỗi cấp một trọng tâm.</li>
<li><strong>Theo hai góc nhìn</strong> — dựa trên yêu cầu (slide 110) và dựa trên quy trình nghiệp vụ (slide 111).</li>
</ul>`],
      [109, 'Functional requirement & functional specification',
        `<p class="y-chinh">🎯 Two formal definitions: the requirement says <em>what function</em>, the specification describes it <em>in detail</em>.</p>
<ul>
<li><strong>Functional requirement</strong> — a requirement that specifies a function that a system or system component must perform (ANSI/IEEE Std 729-1983).</li>
<li><strong>Functional specification</strong> — the document that describes in detail the characteristics of the product with regard to its intended capability (BS 4778 Part 2, BS 7925-1).</li>
</ul>`,
        `<p class="y-chinh">🎯 Hai định nghĩa chính thức: yêu cầu nói <em>chức năng gì</em>, đặc tả mô tả nó <em>chi tiết</em>.</p>
<ul>
<li><strong>Yêu cầu chức năng</strong> — yêu cầu nêu một chức năng mà hệ thống hay thành phần phải thực hiện (ANSI/IEEE Std 729-1983).</li>
<li><strong>Đặc tả chức năng</strong> — tài liệu mô tả chi tiết đặc điểm sản phẩm theo năng lực dự kiến của nó (BS 4778 Part 2, BS 7925-1).</li>
</ul>`],
      [110, 'Functional testing: requirements-based',
        `<p class="y-chinh">🎯 Requirements-based functional testing uses the requirements specification as the basis for identifying tests.</p>
<ol>
<li><strong>Start from the table of contents</strong> — it gives an initial inventory of test conditions.</li>
<li><strong>Analyse risk per area</strong> — for each section/paragraph/topic/functional area, find the most important and critical areas.</li>
<li><strong>Decide the depth</strong> — how deeply to test each functional area.</li>
</ol>`,
        `<p class="y-chinh">🎯 Kiểm thử chức năng dựa trên yêu cầu lấy đặc tả yêu cầu làm cơ sở để xác định test.</p>
<ol>
<li><strong>Bắt đầu từ mục lục</strong> — nó cho danh mục test condition ban đầu.</li>
<li><strong>Phân tích rủi ro từng vùng</strong> — với mỗi mục/đoạn/chủ đề/vùng chức năng, tìm vùng quan trọng và sống còn nhất.</li>
<li><strong>Quyết định độ sâu</strong> — test mỗi vùng chức năng sâu tới đâu.</li>
</ol>`],
      [111, 'Functional testing: business-process-based',
        `<p class="y-chinh">🎯 Business-process-based functional testing starts from how the business actually uses the system.</p>
<ul>
<li><strong>Expected user profiles</strong> — what will be used most often? What is critical to the business?</li>
<li><strong>Business scenarios</strong> — typical business transactions, from start to finish.</li>
<li><strong>Use cases</strong> — prepared from real situations.</li>
</ul>`,
        `<p class="y-chinh">🎯 Kiểm thử chức năng dựa trên quy trình nghiệp vụ xuất phát từ cách doanh nghiệp thật sự dùng hệ thống.</p>
<ul>
<li><strong>Hồ sơ người dùng dự kiến</strong> — chức năng nào dùng nhiều nhất? Cái gì sống còn với nghiệp vụ?</li>
<li><strong>Kịch bản nghiệp vụ</strong> — giao dịch nghiệp vụ điển hình, từ đầu tới cuối.</li>
<li><strong>Use case</strong> — soạn từ tình huống thật.</li>
</ul>`],
      [112, 'Functional testing: coverage',
        `<p class="y-chinh">🎯 <strong>Functional coverage</strong> = how much of a type of functional element the tests have exercised, as a percentage.</p>
<ul>
<li><strong>What it measures</strong> — the extent to which some type of functional element has been exercised by tests.</li>
<li><strong>How to compute it</strong> — with traceability between tests and functional requirements, calculate the % of requirements addressed by testing.</li>
<li><strong>What you gain</strong> — coverage gaps become visible (the traceability matrix of lesson 1.4).</li>
</ul>`,
        `<p class="y-chinh">🎯 <strong>Functional coverage</strong> = test đã chạm tới bao nhiêu phần một loại phần tử chức năng, tính bằng phần trăm.</p>
<ul>
<li><strong>Đo cái gì</strong> — mức độ một loại phần tử chức năng đã được test chạm tới.</li>
<li><strong>Tính thế nào</strong> — có truy vết giữa test và yêu cầu chức năng thì tính được % yêu cầu đã được test.</li>
<li><strong>Được gì</strong> — thấy được lỗ hổng bao phủ (bảng truy vết ở bài 1.4).</li>
</ul>`],
      [113, '[2] Non-functional Testing',
        `<p class="y-chinh">🎯 Non-functional testing checks <strong>"how well"</strong> the system behaves — at <strong>all test levels</strong>.</p>
<ul>
<li><strong>Characteristics</strong> — usability, performance, efficiency, security, etc.</li>
<li><strong>Expected results</strong> — defined in terms of external behaviour, so black-box techniques are used.</li>
</ul>
<p class="nhan">Black-box techniques in non-functional testing</p>
<ul>
<li><strong>BVA</strong> — stress conditions in performance testing.</li>
<li><strong>EP</strong> — classes of devices (compatibility testing) or user groups (usability testing: novice, experienced, age range, geographical location, educational background).</li>
</ul>
<p class="ghi-chu">Speaker note: non-functional requirements are as important as functional ones, often poorly specified, and must be tested.</p>`,
        `<p class="y-chinh">🎯 Kiểm thử phi chức năng kiểm hệ thống chạy <strong>"tốt đến đâu"</strong> — ở <strong>mọi cấp test</strong>.</p>
<ul>
<li><strong>Đặc tính</strong> — khả dụng, hiệu năng, hiệu suất, bảo mật…</li>
<li><strong>Kết quả mong đợi</strong> — định nghĩa bằng hành vi bên ngoài, nên dùng kỹ thuật black-box.</li>
</ul>
<p class="nhan">Kỹ thuật black-box trong test phi chức năng</p>
<ul>
<li><strong>BVA</strong> — điều kiện stress khi test hiệu năng.</li>
<li><strong>EP</strong> — nhóm thiết bị (test tương thích) hoặc nhóm người dùng (test khả dụng: người mới, người thạo, độ tuổi, vùng miền, trình độ học vấn).</li>
</ul>
<p class="ghi-chu">Ghi chú của thầy/cô: yêu cầu phi chức năng quan trọng không kém chức năng, thường đặc tả kém, và bắt buộc phải test.</p>`],
      [114, 'Non-functional testing: coverage',
        `<p class="y-chinh">🎯 Non-functional thoroughness is measured by coverage of non-functional elements.</p>
<ul>
<li><strong>Example</strong> — at least one test for each major user group = 100% coverage of the identified user groups.</li>
<li><strong>Traceability</strong> — linking non-functional tests to non-functional requirements reveals coverage gaps.</li>
<li><strong>Example of a gap</strong> — an <em>implicit</em> requirement for accessibility for disabled users.</li>
</ul>`,
        `<p class="y-chinh">🎯 Độ kỹ của test phi chức năng đo bằng coverage của các phần tử phi chức năng.</p>
<ul>
<li><strong>Ví dụ</strong> — mỗi nhóm người dùng chính có ít nhất một test = phủ 100% các nhóm người dùng đã xác định.</li>
<li><strong>Truy vết</strong> — nối test phi chức năng với yêu cầu phi chức năng giúp thấy lỗ hổng bao phủ.</li>
<li><strong>Ví dụ về lỗ hổng</strong> — yêu cầu <em>ngầm</em> về khả năng truy cập cho người khuyết tật.</li>
</ul>`],
      [115, 'Performance Tests',
        `<p class="y-chinh">🎯 Performance tests fall into three groups: timing, capacity &amp; volume, endurance.</p>
<ul>
<li><strong>Timing tests</strong> — response and service times; database back-up times.</li>
<li><strong>Capacity &amp; volume tests</strong> — maximum amount or processing rate; number of records on the system; graceful degradation as limits are approached.</li>
<li><strong>Endurance tests</strong> (24-hour operation?) — robustness of the system; memory allocation (leaks).</li>
</ul>`,
        `<p class="y-chinh">🎯 Test hiệu năng chia ba nhóm: thời gian, dung lượng &amp; khối lượng, độ bền.</p>
<ul>
<li><strong>Test thời gian</strong> — thời gian đáp ứng và phục vụ; thời gian sao lưu CSDL.</li>
<li><strong>Test dung lượng &amp; khối lượng</strong> — lượng hoặc tốc độ xử lý tối đa; số bản ghi trong hệ thống; suy giảm từ từ khi chạm giới hạn.</li>
<li><strong>Test độ bền</strong> (chạy 24 giờ?) — độ ổn định của hệ thống; cấp phát bộ nhớ (rò rỉ).</li>
</ul>`],
      [116, 'Multi-User Tests',
        `<p class="y-chinh">🎯 Multi-user tests: concurrency, load and stress.</p>
<ul>
<li><strong>Concurrency tests</strong> — small numbers of users, large benefits; detect record-locking problems.</li>
<li><strong>Load tests</strong> — measure system behaviour under realistic multi-user load.</li>
<li><strong>Stress tests</strong> — go beyond the system's limits to know what will happen; particularly relevant for e-commerce.</li>
</ul>
<p class="ghi-chu">Source on the slide: Sue Atkins, Magic Performance Management.</p>`,
        `<p class="y-chinh">🎯 Test nhiều người dùng: đồng thời, tải và stress.</p>
<ul>
<li><strong>Test đồng thời</strong> — ít người dùng mà lợi lớn; bắt lỗi khoá bản ghi.</li>
<li><strong>Test tải</strong> — đo hành vi hệ thống dưới tải nhiều người dùng thực tế.</li>
<li><strong>Test stress</strong> — vượt giới hạn của hệ thống để biết điều gì xảy ra; đặc biệt quan trọng với thương mại điện tử.</li>
</ul>
<p class="ghi-chu">Nguồn trên slide: Sue Atkins, Magic Performance Management.</p>`],
      [117, 'Usability Tests',
        `<p class="y-chinh">🎯 Usability tests ask whether real users can work with the interface easily.</p>
<p class="nhan">The six questions on the slide</p>
<ol>
<li><strong>Messages</strong> — tailored and meaningful to (real) users?</li>
<li><strong>Interface</strong> — coherent and consistent?</li>
<li><strong>Critical information</strong> — sufficient redundancy?</li>
<li><strong>"Human envelope"</strong> — within 7 ± 2 choices?</li>
<li><strong>Feedback</strong> — e.g. wait messages?</li>
<li><strong>Clear mappings</strong> — how to escape?</li>
</ol>
<p class="nhan">The question at the bottom</p>
<p><em>Who should design and perform these tests?</em> Ideally real (representative) users, observed by a usability specialist.</p>`,
        `<p class="y-chinh">🎯 Test khả dụng hỏi người dùng thật có làm việc với giao diện một cách dễ dàng không.</p>
<p class="nhan">Sáu câu hỏi trên slide</p>
<ol>
<li><strong>Thông báo</strong> — có dễ hiểu, hợp với người dùng (thật)?</li>
<li><strong>Giao diện</strong> — có mạch lạc, nhất quán?</li>
<li><strong>Thông tin quan trọng</strong> — có đủ dư thừa?</li>
<li><strong>"Giới hạn con người"</strong> — trong khoảng 7 ± 2 lựa chọn?</li>
<li><strong>Phản hồi</strong> — vd thông báo chờ?</li>
<li><strong>Đường thoát rõ ràng</strong> — thoát ra thế nào?</li>
</ol>
<p class="nhan">Câu hỏi cuối slide</p>
<p><em>Ai nên thiết kế và thực hiện các test này?</em> Lý tưởng là người dùng thật (đại diện), có chuyên gia usability quan sát.</p>`],
      [118, 'Security Tests',
        `<p class="y-chinh">🎯 Seven areas of security testing.</p>
<ol class="hai-cot"><li>Passwords</li><li>Encryption</li><li>Hardware permission devices</li><li>Levels of access to information</li><li>Authorisation</li><li>Covert channels — hidden ways data can leak</li><li>Physical security</li></ol>`,
        `<p class="y-chinh">🎯 Bảy mảng của test bảo mật.</p>
<ol class="hai-cot"><li>Mật khẩu</li><li>Mã hoá</li><li>Thiết bị cấp quyền phần cứng</li><li>Các mức truy cập thông tin</li><li>Phân quyền</li><li>Kênh ngầm (covert channel) — đường rò rỉ dữ liệu bị giấu</li><li>An ninh vật lý</li></ol>`],
      [119, 'Configuration and Installation',
        `<p class="y-chinh">🎯 Configuration tests vary the environment; installation tests check getting the system on — and off — the machine.</p>
<p class="nhan">Configuration tests</p>
<ul>
<li>Different hardware or software environments</li>
<li>Configuration of the system itself</li>
<li>Upgrade paths — which may conflict</li>
</ul>
<p class="nhan">Installation tests</p>
<ul>
<li>Distribution (CD, network, etc.) and timings</li>
<li>Physical aspects — electromagnetic fields, heat, humidity, motion, chemicals, power supplies</li>
<li>Uninstall (removing the installation)</li>
</ul>`,
        `<p class="y-chinh">🎯 Test cấu hình thay đổi môi trường; test cài đặt kiểm việc đưa hệ thống lên — và gỡ khỏi — máy.</p>
<p class="nhan">Test cấu hình</p>
<ul>
<li>Môi trường phần cứng hoặc phần mềm khác nhau</li>
<li>Cấu hình của chính hệ thống</li>
<li>Các đường nâng cấp — có thể xung đột</li>
</ul>
<p class="nhan">Test cài đặt</p>
<ul>
<li>Phân phối (CD, mạng…) và thời gian</li>
<li>Yếu tố vật lý — trường điện từ, nhiệt, ẩm, rung, hoá chất, nguồn điện</li>
<li>Gỡ cài đặt</li>
</ul>`],
      [120, 'Reliability / Qualities',
        `<p class="y-chinh">🎯 "The system will be reliable" cannot be tested — turn it into a measurable target first.</p>
<p class="nhan">Reliability</p>
<ul>
<li><strong>Measurable target</strong> — e.g. "2 failures per year over ten years".</li>
<li><strong>MTBF</strong> — mean time between failures.</li>
<li><strong>Reliability growth models</strong> — to predict and track reliability.</li>
</ul>
<p class="nhan">Other qualities</p>
<p>Maintainability, portability, adaptability, etc.</p>`,
        `<p class="y-chinh">🎯 "Hệ thống sẽ tin cậy" thì không test được — phải biến nó thành chỉ tiêu đo được trước.</p>
<p class="nhan">Độ tin cậy</p>
<ul>
<li><strong>Chỉ tiêu đo được</strong> — vd "2 lần hỏng mỗi năm trong mười năm".</li>
<li><strong>MTBF</strong> — thời gian trung bình giữa hai lần hỏng.</li>
<li><strong>Mô hình tăng trưởng độ tin cậy</strong> — để dự báo và theo dõi độ tin cậy.</li>
</ul>
<p class="nhan">Các đặc tính khác</p>
<p>Khả năng bảo trì, khả chuyển, khả năng thích nghi…</p>`],
      [121, 'Back-up and Recovery',
        `<p class="y-chinh">🎯 Back-up and recovery testing proves that data and systems can really be restored after a failure.</p>
<p class="nhan">On the slide</p>
<ul>
<li><strong>Back-ups</strong> — computer functions and manual procedures (where are the tapes stored?).</li>
<li><strong>Recovery</strong> — the <em>real</em> test of the back-up. Manual procedures are unfamiliar, so rehearse them regularly.</li>
<li><strong>Documentation</strong> — must be detailed, clear and thorough.</li>
</ul>
<p class="nhan">Examples from the speaker notes</p>
<ul>
<li>Simulate a hardware failure and restore the data from a back-up.</li>
<li>Verify the integrity and consistency of restored critical databases.</li>
<li>Restore a whole system or application — configuration files, settings, user data.</li>
<li>Back up and restore virtual-machine images.</li>
<li>Check the <strong>RTO</strong> (recovery time objective — how fast) and <strong>RPO</strong> (recovery point objective — how much data may be lost).</li>
</ul>`,
        `<p class="y-chinh">🎯 Test sao lưu và phục hồi chứng minh dữ liệu và hệ thống thật sự khôi phục được sau sự cố.</p>
<p class="nhan">Trên slide</p>
<ul>
<li><strong>Sao lưu</strong> — chức năng máy và thủ tục tay (băng lưu cất ở đâu?).</li>
<li><strong>Phục hồi</strong> — phép thử <em>thật</em> của bản sao lưu. Thủ tục tay ít dùng nên phải diễn tập thường xuyên.</li>
<li><strong>Tài liệu</strong> — phải chi tiết, rõ ràng, đầy đủ.</li>
</ul>
<p class="nhan">Ví dụ trong ghi chú của thầy/cô</p>
<ul>
<li>Giả lập hỏng phần cứng rồi khôi phục dữ liệu từ bản sao lưu.</li>
<li>Kiểm tính toàn vẹn và nhất quán của CSDL quan trọng sau khi khôi phục.</li>
<li>Khôi phục cả hệ thống hay ứng dụng — file cấu hình, thiết lập, dữ liệu người dùng.</li>
<li>Sao lưu và khôi phục image máy ảo.</li>
<li>Kiểm <strong>RTO</strong> (thời gian khôi phục mục tiêu — nhanh tới đâu) và <strong>RPO</strong> (điểm khôi phục mục tiêu — được phép mất bao nhiêu dữ liệu).</li>
</ul>`],
      [122, 'Documentation Testing',
        `<p class="y-chinh">🎯 Documentation is tested in two ways: review it, and try it.</p>
<p class="nhan">Documentation review</p>
<ul>
<li>Check accuracy against other documents</li>
<li>Gain consensus about the content</li>
<li>Documentation exists, in the right format</li>
</ul>
<p class="nhan">Documentation tests</p>
<ul>
<li>Is it usable? Does it work?</li>
<li>Applied to the user manual and the maintenance documentation</li>
</ul>`,
        `<p class="y-chinh">🎯 Tài liệu được test theo hai cách: review nó, và làm theo nó.</p>
<p class="nhan">Review tài liệu</p>
<ul>
<li>Kiểm độ chính xác so với tài liệu khác</li>
<li>Thống nhất về nội dung</li>
<li>Tài liệu có đủ và đúng định dạng</li>
</ul>
<p class="nhan">Test tài liệu</p>
<ul>
<li>Dùng được không? Làm theo có chạy không?</li>
<li>Áp dụng cho hướng dẫn sử dụng và tài liệu bảo trì</li>
</ul>`],
      [123, '[3] White-box Testing',
        `<p class="y-chinh">🎯 White-box testing derives tests from the system's <strong>internal structure or implementation</strong>.</p>
<ul>
<li><strong>Internal structure</strong> — code, architecture, workflows and/or data flows within the system.</li>
<li><strong>Where it is used most</strong> — component testing and component integration testing.</li>
<li><strong>Higher levels</strong> — less likely, except business-process testing, where the test basis (the "structure") can be business rules.</li>
</ul>`,
        `<p class="y-chinh">🎯 White-box testing suy ra test từ <strong>cấu trúc bên trong hay cách cài đặt</strong> của hệ thống.</p>
<ul>
<li><strong>Cấu trúc bên trong</strong> — code, kiến trúc, luồng công việc và/hoặc luồng dữ liệu trong hệ thống.</li>
<li><strong>Dùng nhiều nhất ở đâu</strong> — component testing và component integration testing.</li>
<li><strong>Các cấp cao hơn</strong> — ít gặp hơn, trừ test quy trình nghiệp vụ, nơi test basis (phần "cấu trúc") có thể là các luật nghiệp vụ.</li>
</ul>`],
      [124, 'White-box testing: coverage',
        `<p class="y-chinh">🎯 <strong>Structural coverage</strong> = how much of a type of structural element the tests have exercised, as a percentage.</p>
<ul>
<li><strong>Component level</strong> — code coverage: % of executable elements, e.g. statements or decision outcomes.</li>
<li><strong>Component-integration level</strong> — based on the architecture, e.g. % of interfaces between components exercised by tests.</li>
</ul>`,
        `<p class="y-chinh">🎯 <strong>Structural coverage</strong> = test đã chạy tới bao nhiêu phần một loại phần tử cấu trúc, tính bằng phần trăm.</p>
<ul>
<li><strong>Cấp component</strong> — code coverage: % phần tử thực thi được, vd câu lệnh hoặc kết quả quyết định.</li>
<li><strong>Cấp component integration</strong> — dựa trên kiến trúc, vd % giao diện giữa các thành phần đã được test chạy tới.</li>
</ul>`],
      [125, '[4] Change-related Testing',
        `<p class="y-chinh">🎯 After any change, test that it worked <em>and</em> that it broke nothing.</p>
<ul>
<li><strong>Did it work?</strong> — the change corrected the defect or implemented the functionality correctly.</li>
<li><strong>Did it break anything?</strong> — no unforeseen adverse consequences.</li>
</ul>
<p class="nhan">Two sub-types</p>
<ol>
<li><strong>Confirmation testing</strong> — slide 126</li>
<li><strong>Regression testing</strong> — slides 127–128</li>
</ol>`,
        `<p class="y-chinh">🎯 Sau mọi thay đổi, phải test xem nó có tác dụng <em>và</em> có làm hỏng gì không.</p>
<ul>
<li><strong>Có tác dụng không?</strong> — thay đổi đã sửa đúng lỗi hoặc cài đúng chức năng.</li>
<li><strong>Có làm hỏng gì không?</strong> — không gây hậu quả xấu ngoài dự kiến.</li>
</ul>
<p class="nhan">Hai loại con</p>
<ol>
<li><strong>Confirmation testing</strong> — slide 126</li>
<li><strong>Regression testing</strong> — slide 127–128</li>
</ol>`],
      [126, 'Confirmation Testing',
        `<p class="y-chinh">🎯 Confirmation testing (re-testing) checks that <em>the original defect</em> has been fixed.</p>
<ul>
<li><strong>When</strong> — after a defect is fixed, on the new software version.</li>
<li><strong>Minimum</strong> — re-execute the steps that reproduced the failure(s) caused by the defect.</li>
<li><strong>Purpose</strong> — confirm whether the original defect has been successfully fixed.</li>
</ul>`,
        `<p class="y-chinh">🎯 Confirmation testing (re-testing) kiểm xem <em>chính lỗi ban đầu</em> đã được sửa chưa.</p>
<ul>
<li><strong>Khi nào</strong> — sau khi sửa lỗi, trên phiên bản phần mềm mới.</li>
<li><strong>Tối thiểu</strong> — chạy lại các bước đã tái hiện failure do lỗi đó gây ra.</li>
<li><strong>Mục đích</strong> — khẳng định lỗi ban đầu đã được sửa thành công.</li>
</ul>`],
      [127, 'Regression Testing (1)',
        `<p class="y-chinh">🎯 Regression testing looks for <strong>unintended side-effects</strong> of a change.</p>
<ul>
<li><strong>The risk</strong> — a change in one part of the code may accidentally affect the behaviour of other parts.</li>
<li><strong>Environment counts too</strong> — changes to the OS, a library or the database version are changes.</li>
<li><strong>The test</strong> — run tests to detect such side-effects.</li>
</ul>
<p class="meo">🧠 <strong>Remember the cartoon:</strong> the boy opens the door for one reason — and the flies come in. A change made for one purpose brings an effect nobody intended.</p>`,
        `<p class="y-chinh">🎯 Regression testing tìm <strong>tác dụng phụ ngoài ý muốn</strong> của một thay đổi.</p>
<ul>
<li><strong>Rủi ro</strong> — thay đổi ở một chỗ trong code có thể vô tình ảnh hưởng hành vi của chỗ khác.</li>
<li><strong>Môi trường cũng tính</strong> — đổi hệ điều hành, thư viện hay phiên bản CSDL đều là thay đổi.</li>
<li><strong>Cách test</strong> — chạy test để phát hiện những tác dụng phụ đó.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ theo tranh:</strong> cậu bé mở cửa vì một lý do — và ruồi bay vào. Thay đổi làm vì một mục đích lại kéo theo một hệ quả không ai muốn.</p>`],
      [128, 'Regression Testing (2)',
        `<p class="y-chinh">🎯 Regression testing is a strong candidate for automation — start early.</p>
<ul>
<li><strong>Why automate</strong> — regression suites are run many times and generally evolve slowly.</li>
<li><strong>When</strong> — automation of these tests should start early in the project.</li>
<li><strong>Where</strong> — change-related testing is performed at all test levels.</li>
</ul>`,
        `<p class="y-chinh">🎯 Regression testing là ứng viên hàng đầu cho tự động hoá — hãy bắt đầu sớm.</p>
<ul>
<li><strong>Vì sao tự động</strong> — bộ regression được chạy rất nhiều lần và thường thay đổi chậm.</li>
<li><strong>Khi nào</strong> — nên tự động hoá các test này từ sớm trong dự án.</li>
<li><strong>Ở đâu</strong> — kiểm thử liên quan thay đổi được làm ở mọi cấp test.</li>
</ul>`],
      [129, 'Test types × test levels (functional & non-functional)',
        `<p class="y-chinh">🎯 The banking example proves that <strong>every test type occurs at every test level</strong> — here functional and non-functional.</p>
<table>
<thead><tr><th>Level</th><th>Functional</th><th>Non-functional</th></tr></thead>
<tbody>
<tr><td>Component</td><td>how compound interest is calculated</td><td>time to perform a complex interest calculation</td></tr>
<tr><td>Component integration</td><td>how account info from the UI is passed to the business logic</td><td>buffer overflow from data passed from the UI to the business logic</td></tr>
<tr><td>System</td><td>how account holders apply for a line of credit</td><td>portability of the presentation layer on browsers and mobiles</td></tr>
<tr><td>System integration</td><td>how the system uses an external microservice to check a credit score</td><td>reliability (robustness) if the microservice does not respond</td></tr>
<tr><td>Acceptance</td><td>how a banker handles a credit application</td><td>usability (accessibility) of the banker's interface for disabled users</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Ví dụ ngân hàng chứng minh <strong>loại test nào cũng có ở mọi cấp test</strong> — ở đây là chức năng và phi chức năng.</p>
<table>
<thead><tr><th>Cấp</th><th>Chức năng</th><th>Phi chức năng</th></tr></thead>
<tbody>
<tr><td>Component</td><td>cách tính lãi kép</td><td>thời gian thực hiện một phép tính lãi phức tạp</td></tr>
<tr><td>Component integration</td><td>thông tin tài khoản từ giao diện được chuyển tới logic nghiệp vụ ra sao</td><td>tràn bộ đệm do dữ liệu từ giao diện chuyển sang logic nghiệp vụ</td></tr>
<tr><td>System</td><td>chủ tài khoản đăng ký hạn mức tín dụng ra sao</td><td>khả chuyển của tầng giao diện trên trình duyệt và điện thoại</td></tr>
<tr><td>System integration</td><td>hệ thống gọi microservice bên ngoài để chấm điểm tín dụng ra sao</td><td>độ tin cậy (độ bền) khi microservice không phản hồi</td></tr>
<tr><td>Acceptance</td><td>nhân viên ngân hàng xử lý hồ sơ tín dụng ra sao</td><td>khả dụng (khả năng truy cập) của giao diện nhân viên cho người khuyết tật</td></tr>
</tbody>
</table>`],
      [130, 'Test types × test levels (white-box & change-related)',
        `<p class="y-chinh">🎯 The same bank, now for white-box and change-related tests — again at every level.</p>
<table>
<thead><tr><th>Level</th><th>White-box</th><th>Change-related</th></tr></thead>
<tbody>
<tr><td>Component</td><td>100% statement and decision coverage for all financial calculation components</td><td>automated regression tests for each component in the CI framework and pipeline</td></tr>
<tr><td>Component integration</td><td>coverage of how each browser screen passes data to the next screen in the business logic</td><td>confirmation tests for interface-related defects, activated as fixes are checked in</td></tr>
<tr><td>System</td><td>coverage of web-page sequences during a credit-line application</td><td>all tests for a workflow are re-executed if any screen changes</td></tr>
<tr><td>System integration</td><td>coverage of all possible inquiry types sent to the credit-score microservice</td><td>automated tests of the system–microservice interactions are re-executed as the service changes</td></tr>
<tr><td>Acceptance</td><td>coverage of all supported financial data file structures and value ranges for bank-to-bank transfers</td><td>previously failed tests are re-executed after the defects are fixed</td></tr>
</tbody>
</table>`,
        `<p class="y-chinh">🎯 Vẫn ngân hàng đó, giờ cho test white-box và test liên quan thay đổi — cũng có ở mọi cấp.</p>
<table>
<thead><tr><th>Cấp</th><th>White-box</th><th>Liên quan thay đổi</th></tr></thead>
<tbody>
<tr><td>Component</td><td>100% statement và decision coverage cho mọi thành phần tính toán tài chính</td><td>regression test tự động cho từng component trong framework và pipeline CI</td></tr>
<tr><td>Component integration</td><td>phủ cách từng màn hình trình duyệt chuyển dữ liệu sang màn sau trong logic nghiệp vụ</td><td>confirmation test cho lỗi liên quan giao diện, kích hoạt khi bản sửa được check-in</td></tr>
<tr><td>System</td><td>phủ chuỗi trang web khi đăng ký hạn mức tín dụng</td><td>chạy lại mọi test của một luồng khi có màn hình bất kỳ thay đổi</td></tr>
<tr><td>System integration</td><td>phủ mọi loại truy vấn gửi tới microservice chấm điểm tín dụng</td><td>chạy lại test tự động về tương tác hệ thống–microservice khi dịch vụ thay đổi</td></tr>
<tr><td>Acceptance</td><td>phủ mọi cấu trúc file dữ liệu tài chính và dải giá trị được hỗ trợ khi chuyển tiền liên ngân hàng</td><td>chạy lại các test từng fail sau khi lỗi được sửa</td></tr>
</tbody>
</table>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — name the type and the level</h3>
<table>
<thead><tr><th>Test</th><th>Type</th><th>Level</th></tr></thead>
<tbody>
<tr><td>JUnit test: <code>discount(100, 10) == 90</code></td><td>functional</td><td>component</td></tr>
<tr><td>JaCoCo shows 85% branch coverage of <code>DiscountService</code></td><td>white-box</td><td>component</td></tr>
<tr><td>Checkout page answers in &lt; 2 s with 1,000 simulated users</td><td>non-functional (performance/load)</td><td>system</td></tr>
<tr><td>The order service sends the right JSON to the shipping API and handles its 503</td><td>functional + robustness</td><td>(system) integration</td></tr>
<tr><td>After fixing bug #D-17, rerun its reproduction steps</td><td>change-related (confirmation)</td><td>any — where it was found</td></tr>
<tr><td>Nightly run of 600 automated UI tests after each merge</td><td>change-related (regression)</td><td>system</td></tr>
<tr><td>Visually impaired users try the banking app with a screen reader</td><td>non-functional (usability/accessibility)</td><td>acceptance</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Confirmation ≠ regression.</strong> Confirmation (re-testing) asks "is <em>this</em> defect fixed?" and reruns the failing steps. Regression asks "did the change break anything <em>else</em>?" and reruns tests that used to pass. Both are change-related, both happen at every level.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>ISO/IEC 25010 — the full list of non-functional characteristics.</strong>
<p>The slides list performance, usability, security, reliability, portability… ISO 25010 organises them into eight product-quality characteristics:</p>
<ol class="hai-cot"><li>Functional suitability</li><li>Performance efficiency</li><li>Compatibility</li><li>Usability (now "interaction capability")</li><li>Reliability</li><li>Security</li><li>Maintainability</li><li>Portability</li></ol>
<p>The 2023 revision adds <em>safety</em>. Spillner's book uses this model in §2.2.1; it is the checklist professional testers use so that no "-ility" is forgotten.</p>
<p class="ghi-chu">Outside the CTFL syllabus, which only gives examples.</p></div>`,
    `<h3>Ví dụ có lời giải · Gọi tên loại test và cấp test</h3>
<table>
<thead><tr><th>Test</th><th>Loại</th><th>Cấp</th></tr></thead>
<tbody>
<tr><td>JUnit test: <code>discount(100, 10) == 90</code></td><td>chức năng</td><td>component</td></tr>
<tr><td>JaCoCo báo 85% branch coverage của <code>DiscountService</code></td><td>white-box</td><td>component</td></tr>
<tr><td>Trang thanh toán trả lời &lt; 2 giây với 1.000 người dùng mô phỏng</td><td>phi chức năng (hiệu năng/tải)</td><td>system</td></tr>
<tr><td>Dịch vụ đơn hàng gửi đúng JSON sang API giao hàng và xử lý được lỗi 503 của nó</td><td>chức năng + độ bền</td><td>(system) integration</td></tr>
<tr><td>Sau khi sửa bug #D-17, chạy lại các bước tái hiện của nó</td><td>liên quan thay đổi (confirmation)</td><td>bất kỳ — nơi phát hiện lỗi</td></tr>
<tr><td>Mỗi đêm chạy 600 UI test tự động sau mỗi lần merge</td><td>liên quan thay đổi (regression)</td><td>system</td></tr>
<tr><td>Người khiếm thị dùng thử app ngân hàng bằng trình đọc màn hình</td><td>phi chức năng (khả dụng/khả năng truy cập)</td><td>acceptance</td></tr>
</tbody>
</table>
<div class="pitfall co-tieu-de"><strong>Confirmation ≠ regression.</strong> Confirmation (re-testing) hỏi "<em>lỗi này</em> đã sửa chưa?" và chạy lại các bước từng fail. Regression hỏi "thay đổi có làm hỏng <em>chỗ khác</em> không?" và chạy lại các test từng pass. Cả hai đều là loại liên quan thay đổi, và đều có ở mọi cấp.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>ISO/IEC 25010 — danh sách đầy đủ các đặc tính phi chức năng.</strong>
<p>Slide chỉ nêu hiệu năng, khả dụng, bảo mật, tin cậy, khả chuyển… ISO 25010 xếp chúng thành tám đặc tính chất lượng sản phẩm:</p>
<ol class="hai-cot"><li>Phù hợp chức năng</li><li>Hiệu suất</li><li>Tương thích</li><li>Khả dụng (bản mới gọi "interaction capability")</li><li>Tin cậy</li><li>Bảo mật</li><li>Khả năng bảo trì</li><li>Khả chuyển</li></ol>
<p>Bản 2023 thêm <em>an toàn</em>. Sách Spillner dùng mô hình này ở §2.2.1; đây là checklist tester chuyên nghiệp dùng để không bỏ sót "-ility" nào.</p>
<p class="ghi-chu">Ngoài syllabus CTFL, vốn chỉ nêu ví dụ.</p></div>`),
    books([
      ['fst4', 'Ch.2 §3 "Test types" — pp.62–68 (PDF 76–82)', 'Chương 2 §3 "Test types" — trang 62–68 (PDF 76–82)'],
      ['fst', '§2.3 "Test types: the targets of testing" — pp.46–49 (PDF 49–52)', '§2.3 "Test types: the targets of testing" — trang 46–49 (PDF 49–52)'],
      ['sp5', '§3.5 Test types (PDF 112): functional 113, non-functional 116, requirements- vs structure-based 118; §2.2.1 ISO 25010 (PDF 44)', '§3.5 Test types (PDF 112): chức năng 113, phi chức năng 116, dựa yêu cầu vs dựa cấu trúc 118; §2.2.1 ISO 25010 (PDF 44)'],
      ['sp4', '§3.7 "Generic Types of Testing" — pp.69–75 (PDF 84–90)', '§3.7 "Generic Types of Testing" — trang 69–75 (PDF 84–90)'],
    ]),
  ].join('\n'),
};

/* ─────────────── 2.5 Maintenance testing & the high-level test plan ─────────────── */
const L25 = {
  title: '2.5 — Maintenance testing, impact analysis & the high-level test plan (IEEE 829)|||2.5 — Kiểm thử bảo trì, phân tích tác động & test plan tổng thể (IEEE 829)',
  slug: 'swt301-maintenance-test-plan',
  type: 'VIDEO',
  description: 'SWT2 slide 131–143: kiểm thử bảo trì (modification–migration–retirement), impact analysis, xử lý khi thiếu đặc tả, chuẩn bị trước khi lập kế hoạch, 16 mục của test plan IEEE 829.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.5 · SWT2 slides 131–143</span>
<h2>Maintenance testing and the high-level test plan</h2>
<p class="lead">Most software spends most of its life in operation, being changed. <strong>Maintenance testing</strong> tests those changes and protects what already works. The deck ends Chapter 2 with the classic <strong>IEEE 829 test-plan outline</strong> — the skeleton of the test plan you will write in Lab 3 and the capstone project.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-2.4.1</strong> — Summarise triggers for maintenance testing (K2).</li>
<li><strong>LO-2.4.2</strong> — Describe the role of impact analysis in maintenance testing (K2).</li>
</ul></div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.5 · SWT2 slide 131–143</span>
<h2>Kiểm thử bảo trì và test plan tổng thể</h2>
<p class="lead">Phần lớn phần mềm dành phần lớn đời mình trong vận hành và bị thay đổi liên tục. <strong>Kiểm thử bảo trì</strong> test các thay đổi đó và bảo vệ những gì đang chạy tốt. Bộ slide khép lại Chương 2 bằng <strong>khung test plan IEEE 829</strong> kinh điển — bộ xương của test plan bạn sẽ viết ở Lab 3 và đồ án.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-2.4.1</strong> — Tóm tắt các tác nhân kích hoạt kiểm thử bảo trì (K2).</li>
<li><strong>LO-2.4.2</strong> — Mô tả vai trò của phân tích tác động trong kiểm thử bảo trì (K2).</li>
</ul></div>`),
    walkHead(D, 131, 143),
    walk(D, [
      [131, 'CONTENT — Maintenance testing',
        `<p class="y-chinh">🎯 Last block of the chapter: maintenance testing.</p>`,
        `<p class="y-chinh">🎯 Khối cuối của chương: kiểm thử bảo trì.</p>`],
      [132, 'Maintenance testing',
        `<p class="y-chinh">🎯 Maintenance testing is testing to <strong>preserve quality</strong> — and it is predominantly regression testing.</p>
<p class="nhan">How it differs from development testing</p>
<ul>
<li><strong>Different sequence</strong> — development testing runs bottom-up; maintenance testing runs <strong>top-down</strong>.</li>
<li><strong>Different test data</strong> — a live profile.</li>
<li><strong>Breadth tests</strong> — to establish overall confidence.</li>
<li><strong>Depth tests</strong> — to investigate the changes and critical areas.</li>
<li><strong>Predominantly regression testing</strong></li>
</ul>`,
        `<p class="y-chinh">🎯 Kiểm thử bảo trì là kiểm thử để <strong>giữ gìn chất lượng</strong> — và chủ yếu là regression testing.</p>
<p class="nhan">Khác kiểm thử khi phát triển ở đâu</p>
<ul>
<li><strong>Thứ tự khác</strong> — phát triển test từ dưới lên; bảo trì test <strong>từ trên xuống</strong>.</li>
<li><strong>Dữ liệu khác</strong> — hồ sơ dữ liệu thật (live profile).</li>
<li><strong>Test diện rộng</strong> — để có niềm tin chung.</li>
<li><strong>Test chiều sâu</strong> — soi chỗ thay đổi và vùng quan trọng.</li>
<li><strong>Chủ yếu là regression testing</strong></li>
</ul>`],
      [133, 'What to test in maintenance testing',
        `<p class="y-chinh">🎯 Three triggers start maintenance testing; <strong>impact analysis</strong> decides how much to test.</p>
<p class="nhan">Triggers</p>
<ol>
<li><strong>Modification</strong> — enhancements, corrective and emergency fixes, environment changes, patches.</li>
<li><strong>Migration</strong> — to another platform, including data conversion.</li>
<li><strong>Retirement</strong> — data archiving and restoring.</li>
</ol>
<p class="nhan">Impact analysis — the questions</p>
<ul>
<li>What could this change have an impact on?</li>
<li>How important is a fault in the impacted area?</li>
<li>Test what has been affected — but how much? The most important affected areas? The areas most likely to be affected? The whole system?</li>
</ul>
<p>The answer: "it depends" — on risk.</p>`,
        `<p class="y-chinh">🎯 Ba tác nhân kích hoạt kiểm thử bảo trì; <strong>phân tích tác động</strong> quyết định test bao nhiêu.</p>
<p class="nhan">Tác nhân</p>
<ol>
<li><strong>Sửa đổi (modification)</strong> — nâng cấp, sửa lỗi thường và khẩn cấp, thay đổi môi trường, bản vá.</li>
<li><strong>Chuyển đổi (migration)</strong> — sang nền tảng khác, kèm chuyển đổi dữ liệu.</li>
<li><strong>Ngừng sử dụng (retirement)</strong> — lưu trữ và khôi phục dữ liệu.</li>
</ol>
<p class="nhan">Phân tích tác động — các câu hỏi</p>
<ul>
<li>Thay đổi này có thể ảnh hưởng tới đâu?</li>
<li>Lỗi ở vùng bị ảnh hưởng quan trọng tới mức nào?</li>
<li>Test phần bị ảnh hưởng — nhưng bao nhiêu? Vùng bị ảnh hưởng quan trọng nhất? Vùng dễ bị ảnh hưởng nhất? Cả hệ thống?</li>
</ul>
<p>Câu trả lời: "tuỳ" — tuỳ vào rủi ro.</p>`],
      [134, 'Poor or missing specifications',
        `<p class="y-chinh">🎯 Poor or missing specifications are a common maintenance reality — four ways to cope.</p>
<ol>
<li><strong>Consider what the system should do</strong> — talk with users.</li>
<li><strong>Document your assumptions</strong> — and give other people the opportunity to review them.</li>
<li><strong>Improve the current situation</strong> — document what you know and what you find out.</li>
<li><strong>Track the cost</strong> of working with poor specifications — to make a business case for better ones.</li>
</ol>`,
        `<p class="y-chinh">🎯 Đặc tả kém hoặc thiếu là chuyện thường ngày khi bảo trì — bốn cách xoay xở.</p>
<ol>
<li><strong>Nghĩ xem hệ thống lẽ ra phải làm gì</strong> — hỏi người dùng.</li>
<li><strong>Ghi lại giả định</strong> — và cho người khác cơ hội review.</li>
<li><strong>Cải thiện dần</strong> — ghi lại những gì đã biết và tìm hiểu được.</li>
<li><strong>Theo dõi chi phí</strong> khi phải làm với đặc tả kém — để có lý lẽ đòi đặc tả tốt hơn.</li>
</ol>`],
      [135, 'What should the system do?',
        `<p class="y-chinh">🎯 Without a specification you cannot really test, only explore — you can validate, but not verify.</p>
<p class="nhan">Alternatives when there is no spec</p>
<ul>
<li><strong>Trust the current behaviour</strong> — assume the way the system works now is right (except for the specific change), and use the <strong>existing system as the regression baseline</strong>.</li>
<li><strong>User manuals or guides</strong> — if they exist.</li>
<li><strong>Ask the experts</strong> — the current users.</li>
</ul>`,
        `<p class="y-chinh">🎯 Không có đặc tả thì không thật sự test được mà chỉ thăm dò — có thể validate nhưng không verify được.</p>
<p class="nhan">Các cách khi không có đặc tả</p>
<ul>
<li><strong>Tin hành vi hiện tại</strong> — coi cách hệ thống đang chạy là đúng (trừ phần đang thay đổi), và dùng <strong>hệ thống cũ làm mốc cho regression</strong>.</li>
<li><strong>Hướng dẫn sử dụng</strong> — nếu có.</li>
<li><strong>Hỏi chuyên gia</strong> — chính người dùng hiện tại.</li>
</ul>`],
      [136, '(Before planning a set of tests)',
        `<p class="y-chinh">🎯 Five pieces of groundwork come before any set of tests is planned.</p>
<ol>
<li><strong>Set the organisational test strategy</strong></li>
<li><strong>Identify the people involved</strong> — sponsors, testers, QA, development, support, etc.</li>
<li><strong>Examine the test basis</strong> — the requirements or functional specifications.</li>
<li><strong>Set up the test organisation and infrastructure</strong></li>
<li><strong>Define test deliverables and the reporting structure</strong></li>
</ol>
<p class="ghi-chu">Source on the slide: <em>Structured Testing, an introduction to TMap®</em>, Pol &amp; van Veenendaal, 1998.</p>`,
        `<p class="y-chinh">🎯 Năm việc chuẩn bị phải làm trước khi lập kế hoạch cho bất kỳ bộ test nào.</p>
<ol>
<li><strong>Xác định chiến lược test của tổ chức</strong></li>
<li><strong>Xác định những người liên quan</strong> — nhà tài trợ, tester, QA, phát triển, hỗ trợ…</li>
<li><strong>Xem xét test basis</strong> — yêu cầu hoặc đặc tả chức năng.</li>
<li><strong>Dựng tổ chức và hạ tầng test</strong></li>
<li><strong>Định nghĩa sản phẩm bàn giao và cơ chế báo cáo</strong></li>
</ol>
<p class="ghi-chu">Nguồn trên slide: <em>Structured Testing, an introduction to TMap®</em>, Pol &amp; van Veenendaal, 1998.</p>`],
      [137, 'High-level test planning — questions',
        `<p class="y-chinh">🎯 Discussion prompts about the high-level test plan — it communicates to <em>all</em> parties involved.</p>
<ol>
<li>What is the purpose of a high-level test plan? Who does it communicate to? — all parties involved.</li>
<li>Why is it a good idea to have one?</li>
<li>What information should be in it? What is your standard for its contents?</li>
<li>Have you ever forgotten something important?</li>
<li>What is <em>not</em> included in a test plan? — the detailed test cases: they live in the test design and test case specifications.</li>
</ol>`,
        `<p class="y-chinh">🎯 Câu hỏi gợi mở về test plan tổng thể — nó truyền đạt tới <em>mọi</em> bên liên quan.</p>
<ol>
<li>Test plan tổng thể để làm gì? Truyền đạt tới ai? — mọi bên liên quan.</li>
<li>Vì sao nên có nó?</li>
<li>Nó phải chứa thông tin gì? Chuẩn nội dung của bạn là gì?</li>
<li>Bạn đã từng quên điều gì quan trọng chưa?</li>
<li>Cái gì <em>không</em> nằm trong test plan? — các test case chi tiết: chúng nằm trong đặc tả thiết kế test và đặc tả test case.</li>
</ol>`],
      [138, 'High-level Test Plan (IEEE 829) — items 1–3',
        `<p class="y-chinh">🎯 The IEEE 829 high-level test plan, items 1–3 (source: ANSI/IEEE Std 829-1998).</p>
<ol>
<li><strong>Test plan identifier</strong></li>
<li><strong>Introduction</strong> — software items and features to be tested; references to project authorisation, project plan, QA plan, configuration-management plan, relevant policies and standards.</li>
<li><strong>Test items</strong> — including version/revision level; how they are transmitted (net, disc, CD…); references to software documentation.</li>
</ol>`,
        `<p class="y-chinh">🎯 Test plan tổng thể theo IEEE 829, mục 1–3 (nguồn: ANSI/IEEE Std 829-1998).</p>
<ol>
<li><strong>Mã test plan</strong></li>
<li><strong>Giới thiệu</strong> — phần mềm và tính năng sẽ test; tham chiếu quyết định dự án, kế hoạch dự án, kế hoạch QA, kế hoạch quản lý cấu hình, chính sách và chuẩn liên quan.</li>
<li><strong>Hạng mục test</strong> — kèm phiên bản; cách bàn giao (mạng, đĩa, CD…); tham chiếu tài liệu phần mềm.</li>
</ol>`],
      [139, 'Items 4–5',
        `<p class="y-chinh">🎯 Items 4–5: say what you will test — and, just as important, what you will not.</p>
<ul>
<li><strong>4. Features to be tested</strong> — with the test design specification/techniques.</li>
<li><strong>5. Features not to be tested</strong> — and the reasons for excluding them.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> writing down item 5 protects the team when someone later asks "why wasn't X tested?".</p>`,
        `<p class="y-chinh">🎯 Mục 4–5: nói rõ sẽ test gì — và quan trọng không kém, sẽ không test gì.</p>
<ul>
<li><strong>4. Tính năng sẽ test</strong> — kèm đặc tả thiết kế test/kỹ thuật.</li>
<li><strong>5. Tính năng không test</strong> — và lý do loại trừ.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ghi rõ mục 5 để bảo vệ nhóm khi sau này có người hỏi "sao không test X?".</p>`],
      [140, 'Items 6–8',
        `<p class="y-chinh">🎯 Items 6–8: how you will test, when an item passes, and when to stop and restart.</p>
<ul>
<li><strong>6. Approach</strong>
<ul>
<li>activities, techniques and tools</li>
<li>detailed enough to estimate (cost?)</li>
<li>degree of comprehensiveness (e.g. coverage) and other completion criteria (e.g. faults)</li>
<li>constraints — environment, staff, deadlines</li>
</ul></li>
<li><strong>7. Item pass/fail criteria</strong></li>
<li><strong>8. Suspension criteria and resumption criteria</strong> — for all or part of the testing activities; which activities must be repeated on resumption.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mục 6–8: test thế nào, khi nào một hạng mục đạt, khi nào dừng và tiếp tục.</p>
<ul>
<li><strong>6. Cách tiếp cận</strong>
<ul>
<li>hoạt động, kỹ thuật và công cụ</li>
<li>đủ chi tiết để ước lượng (chi phí?)</li>
<li>mức độ đầy đủ (vd coverage) và tiêu chí hoàn thành khác (vd số lỗi)</li>
<li>ràng buộc — môi trường, nhân sự, hạn chót</li>
</ul></li>
<li><strong>7. Tiêu chí đạt/không đạt</strong> của từng hạng mục</li>
<li><strong>8. Tiêu chí tạm dừng và tiếp tục</strong> — cho toàn bộ hay một phần hoạt động test; phải lặp lại hoạt động nào khi tiếp tục.</li>
</ul>`],
      [141, 'Item 9 — Test deliverables',
        `<p class="y-chinh">🎯 Item 9 lists the test deliverables — the IEEE 829 document set.</p>
<ol class="hai-cot"><li>Test plan</li><li>Test design specification</li><li>Test case specification</li><li>Test procedure specification</li><li>Test item transmittal reports</li><li>Test logs</li><li>Test incident reports</li><li>Test summary reports</li></ol>`,
        `<p class="y-chinh">🎯 Mục 9 liệt kê các sản phẩm bàn giao của việc test — bộ tài liệu IEEE 829.</p>
<ol class="hai-cot"><li>Test plan</li><li>Đặc tả thiết kế test</li><li>Đặc tả test case</li><li>Đặc tả thủ tục test</li><li>Báo cáo bàn giao hạng mục test</li><li>Test log</li><li>Báo cáo sự cố test</li><li>Báo cáo tổng kết test</li></ol>`],
      [142, 'Items 10–12',
        `<p class="y-chinh">🎯 Items 10–12: the tasks, the environment, and who is responsible for what.</p>
<ul>
<li><strong>10. Testing tasks</strong> — including inter-task dependencies and special skills.</li>
<li><strong>11. Environment</strong> — physical, hardware, software, tools; mode of usage, security, office space.</li>
<li><strong>12. Responsibilities</strong> — who manages, designs, prepares, executes, witnesses, checks and resolves issues; who provides the environment and the software to test.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mục 10–12: các công việc, môi trường, và ai chịu trách nhiệm việc gì.</p>
<ul>
<li><strong>10. Công việc test</strong> — kèm phụ thuộc giữa các việc và kỹ năng đặc biệt.</li>
<li><strong>11. Môi trường</strong> — vật lý, phần cứng, phần mềm, công cụ; cách dùng, bảo mật, chỗ làm việc.</li>
<li><strong>12. Trách nhiệm</strong> — ai quản lý, thiết kế, chuẩn bị, thực thi, chứng kiến, kiểm tra và xử lý vấn đề; ai cung cấp môi trường và phần mềm để test.</li>
</ul>`],
      [143, 'Items 13–16',
        `<p class="y-chinh">🎯 Items 13–16: people, schedule, risks and sign-off close the plan.</p>
<ul>
<li><strong>13. Staffing and training needs</strong></li>
<li><strong>14. Schedule</strong>
<ul>
<li>test milestones in the project schedule</li>
<li>item transmittal milestones</li>
<li>additional test milestones (environment ready)</li>
<li>what resources are needed, and when</li>
</ul></li>
<li><strong>15. Risks and contingencies</strong> — a contingency plan for each identified risk.</li>
<li><strong>16. Approvals</strong> — names, and when approved.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mục 13–16: con người, lịch, rủi ro và phê duyệt khép lại bản kế hoạch.</p>
<ul>
<li><strong>13. Nhu cầu nhân sự và đào tạo</strong></li>
<li><strong>14. Lịch</strong>
<ul>
<li>các mốc test trong lịch dự án</li>
<li>các mốc bàn giao hạng mục</li>
<li>các mốc test bổ sung (môi trường sẵn sàng)</li>
<li>cần nguồn lực gì, và khi nào</li>
</ul></li>
<li><strong>15. Rủi ro và phương án dự phòng</strong> — mỗi rủi ro đã nhận diện có một phương án dự phòng.</li>
<li><strong>16. Phê duyệt</strong> — tên người duyệt và ngày duyệt.</li>
</ul>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — impact analysis for a maintenance change</h3>
<p><strong>Change.</strong> A university portal changes its grade rounding from "round half up to 0.5" to "round to 0.1" (a <em>modification</em> trigger).</p>
<ol>
<li><strong>What could it affect?</strong> Search the code for the rounding function: used by the transcript page, the GPA calculator, the scholarship-ranking report and the export to the Ministry file.</li>
<li><strong>How important is a fault there?</strong> GPA and scholarship ranking → high impact (money, fairness); transcript display → medium; export → high (regulatory).</li>
<li><strong>How much to test?</strong> Depth tests on the rounding function (boundaries 7.94/7.95/7.96), the GPA calculator and the scholarship report; breadth regression on every page that shows grades; confirmation of the Ministry file format.</li>
<li><strong>No spec for the old ranking report?</strong> Use the current production output for last semester as the regression baseline (slide 135).</li>
</ol>
<p><strong>Template to use for the plan:</strong> the 16 IEEE 829 items above map onto the course's templates in <em>05.Templates</em> — Report5.1 Unit Test, Report5.2 Integration Test, Report5.3 System Test (explained in the Lab 3 section of this course).</p>
<div class="pitfall co-tieu-de"><strong>Two statements to get right.</strong> "Maintenance testing is only needed for new features" — false: fixes, environment changes, migrations and retirement also trigger it. "Impact analysis is done after the change is released" — false: it is done <em>before</em>, to decide how much regression testing is needed.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Test impact analysis in CI.</strong>
<p>Large codebases cannot run every regression test on every commit. The fix is automated impact analysis:</p>
<ol>
<li><strong>Map</strong> — tools such as Bazel, Gradle's test selection or Microsoft's Test Impact Analysis map each test to the code it executes (from coverage data).</li>
<li><strong>Select</strong> — on each change, they run only the tests touched by the changed files.</li>
</ol>
<p>Google reports running only the affected subset of its tens of millions of tests on each change.</p>
<p class="ghi-chu">Outside the syllabus because CTFL treats impact analysis as a manual, analytical activity.</p></div>`,
    `<h3>Ví dụ có lời giải · Phân tích tác động cho một thay đổi bảo trì</h3>
<p><strong>Thay đổi.</strong> Cổng thông tin trường đổi cách làm tròn điểm từ "làm tròn tới 0,5" sang "làm tròn tới 0,1" (tác nhân <em>sửa đổi</em>).</p>
<ol>
<li><strong>Có thể ảnh hưởng tới đâu?</strong> Tìm hàm làm tròn trong code: được dùng ở trang bảng điểm, bộ tính GPA, báo cáo xét học bổng và file xuất nộp Bộ.</li>
<li><strong>Lỗi ở đó quan trọng tới mức nào?</strong> GPA và xếp hạng học bổng → tác động cao (tiền, công bằng); hiển thị bảng điểm → trung bình; file xuất → cao (quy định).</li>
<li><strong>Test bao nhiêu?</strong> Test chiều sâu ở hàm làm tròn (biên 7,94/7,95/7,96), bộ tính GPA và báo cáo học bổng; regression diện rộng mọi trang có hiển thị điểm; xác nhận định dạng file nộp Bộ.</li>
<li><strong>Báo cáo xếp hạng cũ không có đặc tả?</strong> Dùng output trên production của học kỳ trước làm mốc regression (slide 135).</li>
</ol>
<p><strong>Mẫu dùng để viết kế hoạch:</strong> 16 mục IEEE 829 ở trên tương ứng với các template trong <em>05.Templates</em> của môn — Report5.1 Unit Test, Report5.2 Integration Test, Report5.3 System Test (giải thích trong phần Lab 3 của khoá này).</p>
<div class="pitfall co-tieu-de"><strong>Hai câu phải nắm chắc.</strong> "Kiểm thử bảo trì chỉ cần khi có tính năng mới" — sai: sửa lỗi, đổi môi trường, chuyển đổi và ngừng sử dụng cũng kích hoạt nó. "Phân tích tác động làm sau khi phát hành thay đổi" — sai: làm <em>trước</em>, để quyết định cần regression bao nhiêu.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Test impact analysis trong CI.</strong>
<p>Codebase lớn không thể chạy mọi regression test cho mỗi commit. Lời giải là phân tích tác động được tự động hoá:</p>
<ol>
<li><strong>Ánh xạ</strong> — các công cụ như Bazel, test selection của Gradle hay Test Impact Analysis của Microsoft ánh xạ mỗi test tới đoạn code nó chạy qua (từ dữ liệu coverage).</li>
<li><strong>Chọn lọc</strong> — mỗi lần thay đổi, chỉ chạy các test chạm tới file vừa đổi.</li>
</ol>
<p>Google cho biết họ chỉ chạy tập con bị ảnh hưởng trong hàng chục triệu test mỗi khi có thay đổi.</p>
<p class="ghi-chu">Ngoài giáo trình vì CTFL xem phân tích tác động là hoạt động phân tích thủ công.</p></div>`),
    books([
      ['fst4', 'Ch.2 §4 "Maintenance testing" — pp.69–71 (PDF 83–85); Chapter review p.72 (PDF 86); Sample exam questions pp.73–74 (PDF 87–88); test plan contents in Ch.5 §2 p.161 (PDF 175)', 'Chương 2 §4 "Maintenance testing" — trang 69–71 (PDF 83–85); ôn tập chương trang 72 (PDF 86); câu hỏi mẫu trang 73–74 (PDF 87–88); nội dung test plan ở Chương 5 §2 trang 161 (PDF 175)'],
      ['fst', '§2.4 "Maintenance testing" — pp.50–53 (PDF 53–56); chapter review p.54 (PDF 57)', '§2.4 "Maintenance testing" — trang 50–53 (PDF 53–56); ôn tập chương trang 54 (PDF 57)'],
      ['sp5', '§3.6 Testing new product versions (PDF 119): maintenance 120, release development 123, regression 124; §6.2.1 Test planning (PDF 256)', '§3.6 Testing new product versions (PDF 119): bảo trì 120, phát triển bản mới 123, regression 124; §6.2.1 Test planning (PDF 256)'],
      ['sp4', '§3.6 "Testing New Product Versions" — pp.65–68 (PDF 80–83)', '§3.6 "Testing New Product Versions" — trang 65–68 (PDF 80–83)'],
    ]),
  ].join('\n'),
};

/* ─────────────── 2.6 The teacher's one-page overview (Overview.xlsx) ─────────────── */
const OV = [
  ['UAT — User acceptance test', 'Validate user requirements / system requirements', 'System features / functions', 'Business process · user-requirement / user-story / use-case tests', 'Black-box via the end-user UI (end-to-end tasks)', 'EP, BVA, decision table', 'Business-process-based · user-requirement-based · monkey test'],
  ['SIT — System integration test', 'Verify the system requirements specification', 'Subsystem / system interfaces', 'Subsystem / system interface tests', 'Black-box via the end-user UI (end-to-end tasks)', 'EP, BVA, decision table', '—'],
  ['ST — System test', 'Software functions implemented as in the SRS (verification); find functional &amp; non-functional defects', 'Functional and non-functional requirements', 'Functional test · non-functional tests (security, performance, usability…)', 'Black-box via the end-user UI (end-to-end tasks)', 'EP, BVA, decision table', 'Software-specification-based (SRS)'],
  ['CIT — Component integration test', 'Interfaces correctly implemented; find interface defects', 'Component interfaces', 'API test · GUI integration · function integration (front-end → back-end) · component integration', 'Black-box using tools provided by developers to call APIs; white-box (by developers)', 'EP, BVA, decision table', 'Architectural design document (ADD), detailed design (sequence diagrams)'],
  ['CT — Component (unit) test', 'Method correctness, robustness, coding logic', 'Methods', 'Method ≈ function ⇒ functional &amp; non-functional tests', 'Black-box (inputs/outputs of a method); white-box (statement, branch coverage)', 'EP, BVA, decision table', 'Detailed design (e.g. class specifications)'],
];
const ovRows = (vi) => OV.map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join('')}</tr>`).join('');
const L26 = {
  title: '2.6 — One-page overview: level × objective × object × technique (Overview.xlsx)|||2.6 — Bảng tổng quan một trang: cấp test × mục tiêu × đối tượng × kỹ thuật (Overview.xlsx)',
  slug: 'swt301-levels-overview-matrix',
  type: 'DOCUMENT',
  description: 'Toàn văn bảng Overview.xlsx trong thư mục Slides của thầy/cô: 5 cấp UAT/SIT/ST/CIT/CT với mục tiêu, đối tượng, loại test, kỹ thuật, ví dụ kỹ thuật, cách tiếp cận — kèm cách dùng bảng để trả lời câu hỏi và làm Lab.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.6 · Overview.xlsx</span>
<h2>The teacher's one-page overview</h2>
<p class="lead">In the Slides folder there is a small spreadsheet, <em>Overview.xlsx</em>, that compresses all of Chapter 2 (and the labs) into one table. It uses the <strong>five-level naming used in FPT projects</strong> — UAT, SIT, ST, CIT, CT — which matches the Report5 templates (Unit / Integration / System test) you will fill in Lab 2 and Lab 3. Here is the full sheet, translated and explained.</p>
<div class="table-wrap"><table>
<thead><tr><th>Test level</th><th>Test objectives</th><th>Test object</th><th>Common test types</th><th>Test design techniques</th><th>Technique examples</th><th>Test approach / basis</th></tr></thead>
<tbody>${ovRows(false)}</tbody>
</table></div>
<h3>How to read it</h3>
<ul>
<li><strong>Top rows validate, bottom rows verify.</strong> Only UAT has "validate" as its objective; every lower level verifies against a document (SRS, ADD, detailed design).</li>
<li><strong>The test basis column tells you what to open</strong> before designing tests: SRS for ST, the architecture/sequence diagrams for CIT, the class specification (like the Javadoc "Detail Design" in Lab 2) for CT.</li>
<li><strong>EP, BVA and decision tables appear at every level</strong> — they are the black-box workhorses of Chapter 4, and exactly what PE Question 3 asks you to apply.</li>
<li><strong>White-box appears only at CT and CIT</strong>, done by developers — consistent with slide 123.</li>
<li><strong>"Monkey test"</strong> in the UAT row = random, unscripted input by users (or a tool) to see if anything breaks — an informal, experience-based approach (Chapter 6).</li>
</ul>`,
    `<span class="eyebrow">Chương 2 · Bài 2.6 · Overview.xlsx</span>
<h2>Bảng tổng quan một trang của thầy/cô</h2>
<p class="lead">Trong thư mục Slides có một file Excel nhỏ, <em>Overview.xlsx</em>, nén toàn bộ Chương 2 (và cả phần Lab) vào một bảng. Nó dùng <strong>cách gọi năm cấp quen thuộc trong dự án ở FPT</strong> — UAT, SIT, ST, CIT, CT — khớp với các template Report5 (Unit / Integration / System test) bạn sẽ điền ở Lab 2 và Lab 3. Dưới đây là toàn bộ bảng, kèm giải thích.</p>
<div class="table-wrap"><table>
<thead><tr><th>Cấp test</th><th>Mục tiêu</th><th>Đối tượng test</th><th>Loại test thường gặp</th><th>Kỹ thuật thiết kế test</th><th>Ví dụ kỹ thuật</th><th>Cách tiếp cận / cơ sở</th></tr></thead>
<tbody>${ovRows(true)}</tbody>
</table></div>
<h3>Cách đọc bảng</h3>
<ul>
<li><strong>Dòng trên validate, dòng dưới verify.</strong> Chỉ UAT có mục tiêu "validate"; mọi cấp thấp hơn đều verify so với một tài liệu (SRS, ADD, thiết kế chi tiết).</li>
<li><strong>Cột cơ sở cho biết phải mở tài liệu nào</strong> trước khi thiết kế test: SRS cho ST, kiến trúc/sequence diagram cho CIT, đặc tả lớp (như bộ Javadoc "Detail Design" ở Lab 2) cho CT.</li>
<li><strong>EP, BVA và decision table có ở mọi cấp</strong> — chúng là "ngựa thồ" black-box của Chương 4, và đúng là thứ câu 3 của đề PE yêu cầu áp dụng.</li>
<li><strong>White-box chỉ có ở CT và CIT</strong>, do developer làm — khớp với slide 123.</li>
<li><strong>"Monkey test"</strong> ở dòng UAT = nhập ngẫu nhiên, không kịch bản (do người dùng hoặc công cụ) để xem có gì vỡ không — một cách tiếp cận dựa kinh nghiệm, không hình thức (Chương 6).</li>
</ul>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — use the sheet on a real requirement</h3>
<p><strong>Requirement (from the FA23 practical exam):</strong> "Tên quyết định kiểm tra is a required string of 50–255 characters; the first character must not be a number; no special characters or blanks."</p>
<table>
<thead><tr><th>Level</th><th>What you would test</th><th>Technique</th></tr></thead>
<tbody>
<tr><td>CT</td><td>the validator method <code>isValidDecisionName(String)</code>: lengths 49/50/255/256, first char digit, a space, a special char</td><td>EP + BVA (black-box on the method), then branch coverage (white-box)</td></tr>
<tr><td>CIT</td><td>the form sends the name to the service; an error from the service comes back to the form</td><td>API/function integration test</td></tr>
<tr><td>ST</td><td>the whole "Create inspection decision" function against the SRS, incl. the document-upload rules</td><td>EP + BVA + decision table, black-box through the UI</td></tr>
<tr><td>UAT</td><td>a department head creates a real decision end-to-end</td><td>business-process-based</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Why FPT reports split "integration" in two.</strong>
<p>CTFL has one integration level with two sub-levels; industry (and FPT Software's templates) often report them separately because different people do them:</p>
<ul>
<li><strong>CIT</strong> — by developers, with API tools such as Postman.</li>
<li><strong>SIT</strong> — by the test team, against external systems.</li>
</ul>
<p>The capstone Report5 "Integration Test" template is really a CIT/SIT report.</p>
<p class="ghi-chu">Outside the syllabus, which only names the two sub-levels.</p></div>`,
    `<h3>Ví dụ có lời giải · Dùng bảng cho một yêu cầu thật</h3>
<p><strong>Yêu cầu (trong đề PE FA23):</strong> "Tên quyết định kiểm tra là chuỗi bắt buộc, dài 50–255 ký tự; ký tự đầu không được là số; không có ký tự đặc biệt hay khoảng trắng."</p>
<table>
<thead><tr><th>Cấp</th><th>Test cái gì</th><th>Kỹ thuật</th></tr></thead>
<tbody>
<tr><td>CT</td><td>phương thức kiểm tra <code>isValidDecisionName(String)</code>: độ dài 49/50/255/256, ký tự đầu là số, có khoảng trắng, có ký tự đặc biệt</td><td>EP + BVA (black-box trên phương thức), rồi branch coverage (white-box)</td></tr>
<tr><td>CIT</td><td>form gửi tên sang service; lỗi từ service trả về form</td><td>test tích hợp API/chức năng</td></tr>
<tr><td>ST</td><td>cả chức năng "Tạo quyết định kiểm tra" so với SRS, kể cả luật đính kèm tài liệu</td><td>EP + BVA + decision table, black-box qua giao diện</td></tr>
<tr><td>UAT</td><td>trưởng phòng tạo một quyết định thật từ đầu tới cuối</td><td>dựa trên quy trình nghiệp vụ</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Vì sao báo cáo ở FPT tách "integration" làm hai.</strong>
<p>CTFL có một cấp integration với hai cấp con; thực tế (và template của FPT Software) thường báo cáo riêng vì do người khác nhau làm:</p>
<ul>
<li><strong>CIT</strong> — do developer làm, bằng công cụ gọi API như Postman.</li>
<li><strong>SIT</strong> — do nhóm test làm, với hệ thống bên ngoài.</li>
</ul>
<p>Template Report5 "Integration Test" của đồ án thực chất là báo cáo CIT/SIT.</p>
<p class="ghi-chu">Ngoài giáo trình vì syllabus chỉ nêu tên hai cấp con.</p></div>`),
  ].join('\n'),
};

/* ─────────────── 2.7 The 2023 slide set (oswt2, 86 pages) ─────────────── */
const O = 'oswt2';
const L27 = {
  title: '2.7 — More from the 2023 slide set: V-model, cost of faults, component process|||2.7 — Bổ sung từ bộ slide 2023: V-model, chi phí lỗi, quy trình component test',
  slug: 'swt301-ch2-slides-2023',
  type: 'VIDEO',
  description: 'Bộ slide SWT2 cũ (2023, 86 trang): 31 trang có nội dung mới — V-model 5 cấp, báo cáo thực tế, "test đặc tả cờ vua thế nào", chuỗi chi phí lỗi (£1.000 → £13.000), quy trình component test BS 7925-2, tích hợp mức lớn, phi chức năng, UAT 80/20, hợp đồng, alpha/beta — kèm bảng đổi thuật ngữ cũ → CTFL v4.0.',
  content: [
    bi(`<span class="eyebrow">Chapter 2 · Lesson 2.7 · SWT2 (2023) — 86 pages</span>
<h2>More from the 2023 slide set</h2>
<p class="lead">Before the current SWT2 deck, this course used an older 86-page version titled <em>ISTQB / ISEB Foundation Exam Practice</em>. Most of its pages repeat what you studied in Lessons 2.1–2.5. <strong>31 pages</strong> show something the current lessons do not — every one of them is below, with the image and an explanation.</p>
<p class="nhan">What only the 2023 deck has</p>
<ul>
<li><strong>A five-level V-model</strong> — with "integration testing in the small" and "in the large".</li>
<li><strong>The experience report as slides</strong> — Phase 1 vs Phase 2 of a real project.</li>
<li><strong>A class exercise</strong> — "How would you test this spec?" (a chess program).</li>
<li><strong>The economics of testing</strong> — a worked cost of one fault: £1,000 for the developers, £12,000 for the users.</li>
<li><strong>The BS 7925-2 component test process</strong> — document hierarchy and five activities.</li>
<li><strong>Integration testing in the large</strong> — scope, approach and planning.</li>
<li><strong>Acceptance details</strong> — the 80/20 picture, contract acceptance, alpha/beta similarities.</li>
</ul>
<p class="nhan">After this lesson you can</p>
<ol>
<li>Map the old five-level V onto today's four CTFL test levels.</li>
<li>Re-compute the deck's fault-cost example and explain why late faults cost so much.</li>
<li>Name the five activities of the BS 7925-2 component test process and what each produces.</li>
<li>Plan integration testing in the large: risks first, outside first, one connection at a time.</li>
<li>Tell contract, user, alpha and beta acceptance testing apart.</li>
</ol>
<p class="ghi-chu">The 2023 deck uses older words (ISEB, "faults", BS 7925, "in the small / in the large", "structural testing"). Each card gives today's CTFL v4.0 term, and the ★ table at the end lists them all.</p>`,
    `<span class="eyebrow">Chương 2 · Bài 2.7 · SWT2 (2023) — 86 trang</span>
<h2>Bổ sung từ bộ slide 2023</h2>
<p class="lead">Trước bộ SWT2 hiện tại, môn này dùng một bản cũ 86 trang tên <em>ISTQB / ISEB Foundation Exam Practice</em>. Phần lớn các trang lặp lại những gì bạn đã học ở Bài 2.1–2.5. <strong>31 trang</strong> có nội dung mà các bài hiện tại chưa có — tất cả nằm dưới đây, kèm hình và lời giải thích.</p>
<p class="nhan">Chỉ bộ 2023 mới có</p>
<ul>
<li><strong>V-model năm cấp</strong> — có "integration testing in the small" và "in the large".</li>
<li><strong>Báo cáo thực tế dạng slide</strong> — Giai đoạn 1 và Giai đoạn 2 của một dự án thật.</li>
<li><strong>Một bài tập trên lớp</strong> — "Bạn sẽ test đặc tả này thế nào?" (chương trình chơi cờ vua).</li>
<li><strong>Kinh tế học của kiểm thử</strong> — tính chi phí của một lỗi: £1.000 phía developer, £12.000 phía người dùng.</li>
<li><strong>Quy trình component test theo BS 7925-2</strong> — cây tài liệu và năm hoạt động.</li>
<li><strong>Integration testing in the large</strong> — phạm vi, cách tiếp cận và lập kế hoạch.</li>
<li><strong>Chi tiết về acceptance</strong> — hình 80/20, acceptance theo hợp đồng, điểm giống nhau của alpha/beta.</li>
</ul>
<p class="nhan">Học xong bài này bạn có thể</p>
<ol>
<li>Chuyển V-model năm cấp cũ sang bốn cấp test của CTFL hiện nay.</li>
<li>Tính lại ví dụ chi phí lỗi trong slide và giải thích vì sao lỗi phát hiện muộn lại đắt.</li>
<li>Kể tên năm hoạt động của quy trình component test BS 7925-2 và đầu ra của từng hoạt động.</li>
<li>Lập kế hoạch integration testing in the large: rủi ro trước, bên ngoài trước, từng kết nối một.</li>
<li>Phân biệt acceptance theo hợp đồng, UAT, alpha và beta.</li>
</ol>
<p class="ghi-chu">Bộ 2023 dùng từ cũ (ISEB, "fault", BS 7925, "in the small / in the large", "structural testing"). Mỗi thẻ đều ghi thuật ngữ CTFL v4.0 hiện nay, và bảng ★ cuối bài liệt kê tất cả.</p>`),
    bi(`<h3>Old pages already taught in this chapter (55 pages — no images repeated)</h3>
<div class="table-wrap"><table>
<thead><tr><th>SWT2 (2023) page</th><th>Already taught in</th><th>Note</th></tr></thead>
<tbody>
<tr><td>1 — cover</td><td>2.1, SWT2 slide 1</td><td>"ISEB" was the old British exam board; the exam today is ISTQB CTFL v4.0.</td></tr>
<tr><td>2, 22, 79, 81 — contents</td><td>2.1 slide 2 · 2.2 slide 36 · 2.4 slide 106 · 2.5 slide 131</td><td>Agenda pages.</td></tr>
<tr><td>3 — Waterfall model</td><td>2.1, slide 7</td><td>Same figure, different drawing.</td></tr>
<tr><td>7 — Early test design</td><td>2.1, slide 11</td><td>Identical six reasons.</td></tr>
<tr><td>10–11 — VV&amp;T</td><td>2.1, slides 12–13</td><td>Same BS 7925-1 definitions.</td></tr>
<tr><td>12 — Iterative life cycles</td><td>2.1, slides 14–16</td><td>Figure only.</td></tr>
<tr><td>13 — Agile development</td><td>2.1, slide 22</td><td>Same six practices ("integration several times a day").</td></tr>
<tr><td>23 — Before planning a set of tests</td><td>2.5, slide 136</td><td>Identical.</td></tr>
<tr><td>24 — High level test planning</td><td>2.5, slide 137</td><td>Identical questions.</td></tr>
<tr><td>25–30 — Test Plan 1–6 (IEEE 829)</td><td>2.5, slides 138–143</td><td>Same 16 sections.</td></tr>
<tr><td>31 — Component testing</td><td>2.2, slides 42–43</td><td>"Also known as unit, module, program testing".</td></tr>
<tr><td>32–33 — Component test strategy 1–2</td><td>2.2, slides 45–46</td><td>Identical.</td></tr>
<tr><td>41 — Test design techniques (BS 7925-2)</td><td>2.2, slide 47</td><td>Identical yes/no table.</td></tr>
<tr><td>43–55 — Big-bang … Integration planning</td><td>2.2, slides 57–69</td><td>Big-bang, incremental, top-down (page 45 = slide 59), stubs, bottom-up, drivers, minimum capability, thread, guidelines, planning.</td></tr>
<tr><td>57–59 — Functional system testing</td><td>2.4, slides 109–111</td><td>Requirements- and business-process-based testing.</td></tr>
<tr><td>61–68 — Performance … Documentation testing</td><td>2.4, slides 115–122</td><td>Identical eight pages.</td></tr>
<tr><td>72–73 — UAT, why user involvement</td><td>2.3, slides 85–86</td><td>Identical.</td></tr>
<tr><td>78 — Acceptance testing motto</td><td>2.3, slide 91</td><td>Identical.</td></tr>
<tr><td>82–85 — Maintenance testing</td><td>2.5, slides 132–135</td><td>Identical.</td></tr>
<tr><td>86 — Summary: key points</td><td>This lesson's objectives</td><td>A recap list; no new fact.</td></tr>
</tbody></table></div>`,
    `<h3>Các trang cũ đã được dạy trong chương này (55 trang — không lặp lại hình)</h3>
<div class="table-wrap"><table>
<thead><tr><th>Trang SWT2 (2023)</th><th>Đã dạy ở</th><th>Ghi chú</th></tr></thead>
<tbody>
<tr><td>1 — bìa</td><td>2.1, SWT2 slide 1</td><td>"ISEB" là hội đồng thi cũ của Anh; kỳ thi hiện nay là ISTQB CTFL v4.0.</td></tr>
<tr><td>2, 22, 79, 81 — mục lục</td><td>2.1 slide 2 · 2.2 slide 36 · 2.4 slide 106 · 2.5 slide 131</td><td>Trang mục lục.</td></tr>
<tr><td>3 — Mô hình waterfall</td><td>2.1, slide 7</td><td>Cùng hình, vẽ khác.</td></tr>
<tr><td>7 — Thiết kế test sớm</td><td>2.1, slide 11</td><td>Đúng sáu lý do đó.</td></tr>
<tr><td>10–11 — VV&amp;T</td><td>2.1, slide 12–13</td><td>Cùng định nghĩa BS 7925-1.</td></tr>
<tr><td>12 — Vòng đời lặp</td><td>2.1, slide 14–16</td><td>Chỉ có hình.</td></tr>
<tr><td>13 — Phát triển Agile</td><td>2.1, slide 22</td><td>Cùng sáu thực hành ("tích hợp nhiều lần mỗi ngày").</td></tr>
<tr><td>23 — Trước khi lập kế hoạch test</td><td>2.5, slide 136</td><td>Giống hệt.</td></tr>
<tr><td>24 — Lập kế hoạch test tổng thể</td><td>2.5, slide 137</td><td>Cùng các câu hỏi.</td></tr>
<tr><td>25–30 — Test Plan 1–6 (IEEE 829)</td><td>2.5, slide 138–143</td><td>Cùng 16 mục.</td></tr>
<tr><td>31 — Component testing</td><td>2.2, slide 42–43</td><td>"Còn gọi là unit, module, program testing".</td></tr>
<tr><td>32–33 — Chiến lược component test 1–2</td><td>2.2, slide 45–46</td><td>Giống hệt.</td></tr>
<tr><td>41 — Kỹ thuật thiết kế test (BS 7925-2)</td><td>2.2, slide 47</td><td>Cùng bảng có/không.</td></tr>
<tr><td>43–55 — Big-bang … Lập kế hoạch tích hợp</td><td>2.2, slide 57–69</td><td>Big-bang, tăng dần, top-down (trang 45 = slide 59), stub, bottom-up, driver, minimum capability, thread, hướng dẫn, kế hoạch.</td></tr>
<tr><td>57–59 — System test chức năng</td><td>2.4, slide 109–111</td><td>Test dựa trên yêu cầu và trên quy trình nghiệp vụ.</td></tr>
<tr><td>61–68 — Hiệu năng … Test tài liệu</td><td>2.4, slide 115–122</td><td>Đúng tám trang đó.</td></tr>
<tr><td>72–73 — UAT, vì sao cần người dùng</td><td>2.3, slide 85–86</td><td>Giống hệt.</td></tr>
<tr><td>78 — Châm ngôn acceptance</td><td>2.3, slide 91</td><td>Giống hệt.</td></tr>
<tr><td>82–85 — Kiểm thử bảo trì</td><td>2.5, slide 132–135</td><td>Giống hệt.</td></tr>
<tr><td>86 — Tóm tắt ý chính</td><td>Mục tiêu của bài này</td><td>Danh sách ôn lại; không có ý mới.</td></tr>
</tbody></table></div>`),
    walkHead(O, 4, 80, 'Only the 31 pages that add something are shown; the page numbers jump where a page is in the table above.', 'Chỉ hiện 31 trang có nội dung mới; số trang nhảy cóc ở chỗ trang đó đã nằm trong bảng phía trên.'),
    walk(O, [
      [4, 'V-Model: test levels',
        `<p class="y-chinh">🎯 The 2023 V has five test levels, not four: integration testing appears twice — "in the small" and "in the large".</p>
<p class="nhan">The five pairs (bottom to top)</p>
<ol>
<li><strong>Code</strong> ↔ component testing</li>
<li><strong>Design specification</strong> ↔ integration testing in the small</li>
<li><strong>System specification</strong> ↔ system testing</li>
<li><strong>Project specification</strong> ↔ integration testing in the large</li>
<li><strong>Business requirements</strong> ↔ acceptance testing</li>
</ol>
<p class="nhan">Today's CTFL v4.0 names</p>
<ul>
<li><strong>In the small</strong> → <em>component integration testing</em>: interfaces between the components of one system.</li>
<li><strong>In the large</strong> → <em>system integration testing</em>: your system together with other systems, packages and networks.</li>
<li><strong>Four levels today</strong> — CTFL keeps both kinds inside one level, "integration testing" (the four-level V of Lesson 2.1, slide 8).</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> <em>small</em> = inside my system, <em>large</em> = my system plus the world around it. That is why "in the large" sits <em>above</em> system testing: you first check your system alone, then its connections.</p>`,
        `<p class="y-chinh">🎯 V-model bản 2023 có năm cấp test chứ không phải bốn: integration testing xuất hiện hai lần — "in the small" và "in the large".</p>
<p class="nhan">Năm cặp (từ dưới lên)</p>
<ol>
<li><strong>Code</strong> ↔ component testing</li>
<li><strong>Đặc tả thiết kế</strong> ↔ integration testing in the small</li>
<li><strong>Đặc tả hệ thống</strong> ↔ system testing</li>
<li><strong>Đặc tả dự án</strong> ↔ integration testing in the large</li>
<li><strong>Yêu cầu nghiệp vụ</strong> ↔ acceptance testing</li>
</ol>
<p class="nhan">Tên gọi theo CTFL v4.0 hiện nay</p>
<ul>
<li><strong>In the small</strong> → <em>component integration testing</em>: giao diện giữa các thành phần của một hệ thống.</li>
<li><strong>In the large</strong> → <em>system integration testing</em>: hệ thống của bạn cùng các hệ thống, gói phần mềm và mạng khác.</li>
<li><strong>Nay chỉ còn bốn cấp</strong> — CTFL gộp cả hai loại vào một cấp "integration testing" (chữ V bốn cấp ở Bài 2.1, slide 8).</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>small</em> = bên trong hệ thống của tôi, <em>large</em> = hệ thống của tôi cộng thế giới xung quanh. Vì vậy "in the large" nằm <em>trên</em> system testing: kiểm hệ thống một mình trước, rồi mới kiểm các kết nối của nó.</p>`],
      [5, 'V-Model: late test design',
        `<p class="y-chinh">🎯 The excuse "we don't have time to design tests early" pushes all test design to the right arm of the V.</p>
<p class="nhan">What the picture shows</p>
<ul>
<li><strong>Tests bubbles on the right</strong> — each level's tests are designed only when that level is about to run ("Design Tests?" bottom right).</li>
<li><strong>The green starburst</strong> — the excuse that causes it.</li>
</ul>
<p class="nhan">Why the excuse is wrong</p>
<ul>
<li><strong>Defects in the documents stay hidden</strong> — nobody questions the requirements until the code exists, when fixing costs 10–100 times more (page 20).</li>
<li><strong>No extra effort is needed</strong> — page 7 says early test design only <em>re-schedules</em> the same work.</li>
</ul>
<p class="ghi-chu">Same idea as Lesson 2.1, slide 9; the 2023 page adds the excuse itself.</p>`,
        `<p class="y-chinh">🎯 Câu biện hộ "chúng tôi không có thời gian thiết kế test sớm" đẩy toàn bộ việc thiết kế test sang nhánh phải của chữ V.</p>
<p class="nhan">Hình cho thấy</p>
<ul>
<li><strong>Các bong bóng Tests nằm bên phải</strong> — test của mỗi cấp chỉ được thiết kế khi cấp đó sắp chạy ("Design Tests?" góc dưới phải).</li>
<li><strong>Ngôi sao xanh</strong> — chính câu biện hộ gây ra chuyện đó.</li>
</ul>
<p class="nhan">Vì sao câu biện hộ sai</p>
<ul>
<li><strong>Lỗi trong tài liệu nằm im</strong> — không ai chất vấn yêu cầu cho tới khi có code, lúc đó sửa đắt gấp 10–100 lần (trang 20).</li>
<li><strong>Không tốn thêm công</strong> — trang 7 nói thiết kế test sớm chỉ là <em>dời lịch</em> cùng một khối việc.</li>
</ul>
<p class="ghi-chu">Cùng ý với Bài 2.1, slide 9; trang 2023 thêm chính câu biện hộ.</p>`],
      [6, 'V-Model: early test design',
        `<p class="y-chinh">🎯 Early test design: each document on the left gets its tests designed as soon as it is written; they are run later on the right.</p>
<p class="nhan">Which tests come from which document</p>
<ol>
<li><strong>Business requirements</strong> → acceptance tests</li>
<li><strong>Project specification</strong> → integration-in-the-large tests</li>
<li><strong>System specification</strong> → system tests</li>
<li><strong>Design specification</strong> → integration-in-the-small tests</li>
<li><strong>Code</strong> → component tests</li>
</ol>
<p class="nhan">Why it works</p>
<p>Designing a test forces you to read the document critically — that is a review (static testing, Chapter 3). Unclear or missing requirements surface while they are still cheap to fix.</p>
<p class="ghi-chu">Same idea as Lesson 2.1, slide 10, drawn on the five-level V.</p>`,
        `<p class="y-chinh">🎯 Thiết kế test sớm: mỗi tài liệu ở nhánh trái được thiết kế test ngay khi viết xong; test chạy sau, ở nhánh phải.</p>
<p class="nhan">Test nào sinh ra từ tài liệu nào</p>
<ol>
<li><strong>Yêu cầu nghiệp vụ</strong> → acceptance test</li>
<li><strong>Đặc tả dự án</strong> → test integration in the large</li>
<li><strong>Đặc tả hệ thống</strong> → system test</li>
<li><strong>Đặc tả thiết kế</strong> → test integration in the small</li>
<li><strong>Code</strong> → component test</li>
</ol>
<p class="nhan">Vì sao hiệu quả</p>
<p>Thiết kế test buộc bạn đọc tài liệu một cách soi xét — đó chính là review (kiểm thử tĩnh, Chương 3). Yêu cầu mơ hồ hay thiếu lộ ra khi còn rẻ để sửa.</p>
<p class="ghi-chu">Cùng ý với Bài 2.1, slide 10, vẽ trên chữ V năm cấp.</p>`],
      [8, 'Experience report: Phase 1',
        `<p class="y-chinh">🎯 Phase 1 of a real project (Scottish Widows, 1996): tests designed late — the release was forced live and failed.</p>
<p class="nhan">Plan vs actual</p>
<ul>
<li><strong>Plan</strong> — 2 months development, then 2 months testing.</li>
<li><strong>Actual</strong> — development ran late; testing and fixing (pink bar) overran the plan with "lots of dev overtime".</li>
<li><strong>Go-live</strong> — at the planned date the system "has to go in", but it didn't work.</li>
</ul>
<p class="nhan">Quality</p>
<ul>
<li><strong>150 faults</strong> found in testing.</li>
<li><strong>50 faults</strong> found by users in the first month live — a quarter of all 200 faults escaped.</li>
<li><strong>Users not happy.</strong></li>
</ul>
<p class="ghi-chu">The numbers are also in the table after the walkthrough of Lesson 2.1. "Faults" is the old word — CTFL v4.0 says <em>defects</em>.</p>`,
        `<p class="y-chinh">🎯 Giai đoạn 1 của một dự án thật (Scottish Widows, 1996): thiết kế test muộn — bản phát hành bị ép chạy thật và hỏng.</p>
<p class="nhan">Kế hoạch và thực tế</p>
<ul>
<li><strong>Kế hoạch</strong> — 2 tháng phát triển, rồi 2 tháng test.</li>
<li><strong>Thực tế</strong> — phát triển trễ; test và sửa lỗi (thanh hồng) vượt kế hoạch, developer "tăng ca rất nhiều".</li>
<li><strong>Đưa vào vận hành</strong> — tới ngày dự kiến thì hệ thống "phải lên", nhưng chạy không được.</li>
</ul>
<p class="nhan">Chất lượng</p>
<ul>
<li><strong>150 lỗi</strong> tìm thấy khi test.</li>
<li><strong>50 lỗi</strong> người dùng gặp trong tháng đầu vận hành — một phần tư trong tổng 200 lỗi đã lọt ra ngoài.</li>
<li><strong>Người dùng không hài lòng.</strong></li>
</ul>
<p class="ghi-chu">Các con số này cũng có trong bảng sau phần slide của Bài 2.1. "Fault" là từ cũ — CTFL v4.0 gọi là <em>defect</em>.</p>`],
      [9, 'Experience report: Phase 2',
        `<p class="y-chinh">🎯 Phase 2, same team: tests designed early — shorter testing, zero faults in live use, on time.</p>
<p class="nhan">Plan vs actual</p>
<ul>
<li><strong>Plan</strong> — 2 months development, then only <strong>6 weeks</strong> testing.</li>
<li><strong>The cylinder</strong> — the test design is now ready at the <em>start</em>, not after development as in Phase 1.</li>
<li><strong>Actual</strong> — "smooth, not much for dev to do"; finished <strong>on time</strong>.</li>
<li><strong>Acceptance test</strong> — a full week this time (vs half a day in Phase 1): users could test properly.</li>
</ul>
<p class="nhan">Quality</p>
<ul>
<li><strong>50 faults</strong> in testing (vs 150).</li>
<li><strong>0 faults</strong> in the first month live (vs 50) — happy users.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> fewer faults were <em>found</em> because fewer were <em>built in</em>. Early test design is prevention, not just earlier detection.</p>`,
        `<p class="y-chinh">🎯 Giai đoạn 2, cùng nhóm: thiết kế test sớm — test ngắn hơn, không lỗi nào khi vận hành, đúng hạn.</p>
<p class="nhan">Kế hoạch và thực tế</p>
<ul>
<li><strong>Kế hoạch</strong> — 2 tháng phát triển, rồi chỉ <strong>6 tuần</strong> test.</li>
<li><strong>Hình trụ</strong> — bộ test đã thiết kế xong ngay từ <em>đầu</em>, chứ không phải sau khi phát triển như Giai đoạn 1.</li>
<li><strong>Thực tế</strong> — "suôn sẻ, developer ít việc phải làm"; xong <strong>đúng hạn</strong>.</li>
<li><strong>Acceptance test</strong> — lần này trọn một tuần (so với nửa ngày ở Giai đoạn 1): người dùng test được tử tế.</li>
</ul>
<p class="nhan">Chất lượng</p>
<ul>
<li><strong>50 lỗi</strong> khi test (so với 150).</li>
<li><strong>0 lỗi</strong> trong tháng đầu vận hành (so với 50) — người dùng hài lòng.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>tìm thấy</em> ít lỗi hơn vì ít lỗi bị <em>xây vào</em> hơn. Thiết kế test sớm là phòng ngừa, không chỉ là phát hiện sớm hơn.</p>`],
      [14, 'How would you test this spec?',
        `<p class="y-chinh">🎯 A three-sentence spec looks complete — until you try to write one test with an expected result.</p>
<p class="nhan">Questions the spec does not answer</p>
<ul>
<li><strong>Which rules?</strong> — castling, en passant, promotion, check, checkmate, stalemate, draw by repetition?</li>
<li><strong>Illegal moves</strong> — what happens if a piece is dragged to an illegal square, or off the board?</li>
<li><strong>Game control</strong> — who plays white? Can the user resign, undo or start again?</li>
<li><strong>The computer</strong> — how strong is it, and how long may it think per move?</li>
<li><strong>The screen</strong> — which resolutions? Mouse only, or touch as well?</li>
</ul>
<p class="nhan">Tests you can still design</p>
<ol>
<li><strong>Legal moves per piece</strong> — one partition per piece type; boundary values at the board edges (a1, h8).</li>
<li><strong>End states</strong> — checkmate, stalemate, draw.</li>
<li><strong>Invalid input</strong> — an illegal move is rejected and the piece returns to its square.</li>
<li><strong>Non-functional</strong> — the computer's response time; how easy dragging is (small pieces, mis-drops).</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> designing tests is a review of the spec. Send the questions back before coding — that is early test design (pages 5–7). The official Laws of Chess can serve as the test oracle for the rules.</p>
<p class="ghi-chu">A class exercise: the deck gives no answer. The lists above are a model answer.</p>`,
        `<p class="y-chinh">🎯 Đặc tả ba câu trông có vẻ đủ — cho tới khi bạn thử viết một test có kết quả mong đợi.</p>
<p class="nhan">Những câu đặc tả chưa trả lời</p>
<ul>
<li><strong>Luật nào?</strong> — nhập thành, bắt tốt qua đường, phong cấp, chiếu, chiếu hết, hết nước đi (hoà pat), hoà do lặp nước?</li>
<li><strong>Nước đi sai luật</strong> — kéo quân vào ô không hợp lệ, hay kéo ra ngoài bàn cờ thì sao?</li>
<li><strong>Điều khiển ván</strong> — ai cầm quân trắng? Người chơi có được xin thua, đi lại, chơi ván mới?</li>
<li><strong>Máy</strong> — mạnh cỡ nào, được nghĩ bao lâu mỗi nước?</li>
<li><strong>Màn hình</strong> — độ phân giải nào? Chỉ chuột, hay cả cảm ứng?</li>
</ul>
<p class="nhan">Những test vẫn thiết kế được</p>
<ol>
<li><strong>Nước đi hợp lệ của từng quân</strong> — mỗi loại quân một phân vùng; giá trị biên ở mép bàn cờ (a1, h8).</li>
<li><strong>Trạng thái kết thúc</strong> — chiếu hết, hoà pat, hoà.</li>
<li><strong>Đầu vào sai</strong> — nước sai luật bị từ chối và quân trở về ô cũ.</li>
<li><strong>Phi chức năng</strong> — thời gian máy đáp trả; kéo quân có dễ không (quân nhỏ, thả trượt).</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> thiết kế test chính là review đặc tả. Gửi các câu hỏi lại trước khi code — đó là thiết kế test sớm (trang 5–7). Luật cờ vua chính thức có thể dùng làm test oracle cho phần luật.</p>
<p class="ghi-chu">Bài tập trên lớp: slide không có đáp án. Các danh sách trên là một lời giải mẫu.</p>`],
      [15, '“Testing is expensive”',
        `<p class="y-chinh">🎯 "Testing is expensive" — compared to what? The honest comparison is with the cost of <em>not</em> testing.</p>
<p class="nhan">What faults missed in testing cost</p>
<ul>
<li><strong>Fixing gets dearer</strong> — the later a fault is found, the more it costs to fix (page 20).</li>
<li><strong>Poor software costs more to use</strong>:
<ul>
<li>users take more time to understand what to do</li>
<li>users make more mistakes</li>
<li>morale suffers</li>
<li>⇒ lower productivity</li>
</ul></li>
</ul>
<p>The page ends with a challenge: <em>do you know what it costs your organisation?</em> Pages 17–21 answer it with numbers.</p>
<p class="ghi-chu">Today's syllabus says the same in principle 3, "early testing saves time and money" (Chapter 1).</p>`,
        `<p class="y-chinh">🎯 "Kiểm thử thì tốn kém" — so với cái gì? Phép so sánh trung thực là với chi phí của việc <em>không</em> test.</p>
<p class="nhan">Lỗi lọt qua test gây tốn kém gì</p>
<ul>
<li><strong>Sửa càng muộn càng đắt</strong> — lỗi tìm ra càng muộn thì sửa càng tốn (trang 20).</li>
<li><strong>Phần mềm kém thì dùng tốn hơn</strong>:
<ul>
<li>người dùng mất thêm thời gian để hiểu phải làm gì</li>
<li>người dùng thao tác sai nhiều hơn</li>
<li>tinh thần làm việc sa sút</li>
<li>⇒ năng suất giảm</li>
</ul></li>
</ul>
<p>Trang kết thúc bằng một câu thách: <em>bạn có biết nó tốn của tổ chức mình bao nhiêu không?</em> Trang 17–21 trả lời bằng con số.</p>
<p class="ghi-chu">Syllabus hiện nay nói cùng ý ở nguyên tắc 3, "kiểm thử sớm tiết kiệm thời gian và tiền bạc" (Chương 1).</p>`],
      [16, 'What do software faults cost?',
        `<p class="y-chinh">🎯 An analogy: breaking a PC hurts and you know its price — a software fault usually costs more, but nobody sees the bill.</p>
<p class="nhan">The questions on the page</p>
<ul>
<li><strong>Have you ever destroyed a PC?</strong> — knocked it off the desk, poured coffee into the disc drive, dropped it from a 2nd-storey window.</li>
<li><strong>How would you feel? How much would it cost?</strong></li>
</ul>
<p class="nhan">The point</p>
<p>A broken PC is a visible, one-off cost. A fault in live software is spread over many people's hours — developers, testers, users — so it feels free. The next three pages add those hours up.</p>`,
        `<p class="y-chinh">🎯 Một phép so sánh: làm hỏng một cái PC thì đau và bạn biết giá — một lỗi phần mềm thường tốn hơn, nhưng không ai thấy hoá đơn.</p>
<p class="nhan">Các câu hỏi trên trang</p>
<ul>
<li><strong>Bạn từng làm hỏng PC chưa?</strong> — gạt rơi khỏi bàn, đổ cà phê vào ổ đĩa, đánh rơi từ cửa sổ tầng hai.</li>
<li><strong>Bạn sẽ thấy thế nào? Tốn bao nhiêu tiền?</strong></li>
</ul>
<p class="nhan">Ý chính</p>
<p>PC hỏng là chi phí nhìn thấy được, một lần. Lỗi trong phần mềm đang chạy thật thì rải ra thành giờ công của nhiều người — developer, tester, người dùng — nên có vẻ như miễn phí. Ba trang tiếp theo cộng dồn các giờ đó lại.</p>`],
      [17, 'Hypothetical Cost - 1',
        `<p class="y-chinh">🎯 One fault found by a user, at a loaded cost of £50 per hour: £700 of developer time and £50 of user time — before any paperwork.</p>
<p class="nhan">The items (every 0.5 h = £25)</p>
<div class="table-wrap"><table>
<thead><tr><th>Activity</th><th>Hours</th><th>Developer</th><th>User</th></tr></thead>
<tbody>
<tr><td>Detect</td><td>0.5</td><td></td><td>£25</td></tr>
<tr><td>Report</td><td>0.5</td><td></td><td>£25</td></tr>
<tr><td>Receive &amp; process</td><td>1</td><td>£50</td><td></td></tr>
<tr><td>Assign &amp; background</td><td>4</td><td>£200</td><td></td></tr>
<tr><td>Debug</td><td>0.5</td><td>£25</td><td></td></tr>
<tr><td>Test the fault fix</td><td>0.5</td><td>£25</td><td></td></tr>
<tr><td>Regression test</td><td>8</td><td>£400</td><td></td></tr>
<tr><td><strong>Total</strong></td><td>14 + 1</td><td><strong>£700</strong></td><td><strong>£50</strong></td></tr>
</tbody></table></div>
<ul>
<li><strong>Loaded salary</strong> — salary plus overheads (office, equipment, benefits) per hour worked.</li>
<li><strong>"Bkgnd"</strong> — background: time for the assigned developer to understand the context of the fault.</li>
<li><strong>Biggest item</strong> — the 8-hour regression test (£400), not the half-hour debug.</li>
</ul>
<p class="ghi-chu">Arithmetic checked: developer 1 + 4 + 0.5 + 0.5 + 8 = 14 h × £50 = £700; user 0.5 + 0.5 = 1 h × £50 = £50.</p>`,
        `<p class="y-chinh">🎯 Một lỗi do người dùng phát hiện, tính £50 mỗi giờ công (đã gồm chi phí chung): £700 thời gian developer và £50 thời gian người dùng — chưa tính giấy tờ.</p>
<p class="nhan">Các khoản (mỗi 0,5 giờ = £25)</p>
<div class="table-wrap"><table>
<thead><tr><th>Việc</th><th>Giờ</th><th>Developer</th><th>Người dùng</th></tr></thead>
<tbody>
<tr><td>Phát hiện</td><td>0,5</td><td></td><td>£25</td></tr>
<tr><td>Báo lỗi</td><td>0,5</td><td></td><td>£25</td></tr>
<tr><td>Tiếp nhận &amp; xử lý</td><td>1</td><td>£50</td><td></td></tr>
<tr><td>Phân công &amp; tìm hiểu bối cảnh</td><td>4</td><td>£200</td><td></td></tr>
<tr><td>Debug</td><td>0,5</td><td>£25</td><td></td></tr>
<tr><td>Test bản sửa</td><td>0,5</td><td>£25</td><td></td></tr>
<tr><td>Regression test</td><td>8</td><td>£400</td><td></td></tr>
<tr><td><strong>Tổng</strong></td><td>14 + 1</td><td><strong>£700</strong></td><td><strong>£50</strong></td></tr>
</tbody></table></div>
<ul>
<li><strong>Loaded salary</strong> — lương cộng chi phí chung (văn phòng, thiết bị, phúc lợi) tính trên mỗi giờ làm.</li>
<li><strong>"Bkgnd"</strong> — background: thời gian để developer được giao hiểu bối cảnh của lỗi.</li>
<li><strong>Khoản lớn nhất</strong> — 8 giờ regression test (£400), không phải nửa giờ debug.</li>
</ul>
<p class="ghi-chu">Đã kiểm phép tính: developer 1 + 4 + 0,5 + 0,5 + 8 = 14 giờ × £50 = £700; người dùng 0,5 + 0,5 = 1 giờ × £50 = £50.</p>`],
      [18, 'Hypothetical Cost - 2',
        `<p class="y-chinh">🎯 Add the paperwork and the same fault reaches £1,000 of developer time — 20 hours for a 30-minute code change.</p>
<p class="nhan">Added to page 17's £700</p>
<ul>
<li><strong>Update documentation, CM</strong> — 2 h = £100 (CM = configuration management).</li>
<li><strong>Update the code library</strong> — 1 h = £50.</li>
<li><strong>Inform users</strong> — 1 h = £50.</li>
<li><strong>Admin (10%)</strong> — 2 h = £100.</li>
</ul>
<p class="nhan">Total</p>
<p><strong>20 hours = £1,000</strong> for the developers; the users' £50 stays in its own column.</p>
<p class="meo">🧠 <strong>Remember:</strong> the debug itself was £25 — only <strong>2.5%</strong> of the £1,000. Most of the cost of a late fault is process, not code.</p>
<p class="ghi-chu">Arithmetic checked: 14 + 2 + 1 + 1 = 18 h; 10% of 18 h = 1.8 h, rounded to 2 h; 20 h × £50 = £1,000.</p>`,
        `<p class="y-chinh">🎯 Cộng thêm giấy tờ, cùng lỗi đó lên tới £1.000 thời gian developer — 20 giờ cho một lần sửa code 30 phút.</p>
<p class="nhan">Cộng thêm vào £700 của trang 17</p>
<ul>
<li><strong>Cập nhật tài liệu, CM</strong> — 2 giờ = £100 (CM = quản lý cấu hình).</li>
<li><strong>Cập nhật thư viện code</strong> — 1 giờ = £50.</li>
<li><strong>Thông báo người dùng</strong> — 1 giờ = £50.</li>
<li><strong>Hành chính (10%)</strong> — 2 giờ = £100.</li>
</ul>
<p class="nhan">Tổng</p>
<p><strong>20 giờ = £1.000</strong> phía developer; £50 của người dùng vẫn nằm ở cột riêng.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> bản thân việc debug chỉ £25 — vỏn vẹn <strong>2,5%</strong> của £1.000. Phần lớn chi phí của một lỗi muộn là quy trình, không phải code.</p>
<p class="ghi-chu">Đã kiểm phép tính: 14 + 2 + 1 + 1 = 18 giờ; 10% của 18 giờ = 1,8 giờ, làm tròn 2 giờ; 20 giờ × £50 = £1.000.</p>`],
      [19, 'Hypothetical Cost - 3',
        `<p class="y-chinh">🎯 Now count the users' side: a fault that hits only 5 users costs them £12,000 — twelve times the developers' £1,000.</p>
<p class="nhan">The users' items (£350 = one 7-hour day)</p>
<ul>
<li><strong>Work takes twice as long for 1 week</strong> — £4,000.</li>
<li><strong>Fix the corrupted data</strong> — 1 day = £350.</li>
<li><strong>Pay the supplier for the fix</strong> — 3 days of maintenance = £750.</li>
<li><strong>Regression test &amp; sign-off</strong> — 2 days = £700.</li>
<li><strong>Update procedures / inform staff</strong> — 1 day = £350.</li>
<li><strong>Double-check everything</strong> — +12% time for 5 weeks, because they no longer trust the system = £5,000.</li>
<li><strong>Admin (+7.5%)</strong> — £800.</li>
</ul>
<p class="nhan">Totals</p>
<p>Developers <strong>£1,000</strong> · users <strong>£12,000</strong> · together about <strong>£13,000</strong> for one fault.</p>
<div class="pitfall">On the slide, the £700 and £350 rows are printed under "Developer", but the developer total stays £1,000. The user column only adds up to £12,000 if those two rows are the users' own days: 50 + 4,000 + 350 + 750 + 700 + 350 + 5,000 + 800 = 12,000.</div>
<p class="nhan">The teacher's notes, re-checked</p>
<ul>
<li><strong>Work × 2</strong> — £50 × 7 h = £350/day; × 5 days = £1,750/week; half is lost = £875 × 5 users = <strong>£4,375</strong> (slide rounds to £4,000).</li>
<li><strong>Double check</strong> — £350 × 5 users = £1,750/day; 12% = £210 (notes: "£200") × 25 days = <strong>£5,250</strong> (slide: £5,000).</li>
<li><strong>Admin</strong> — 7.5% of about £11,200 ≈ £840 (slide: £800).</li>
<li><strong>Without rounding</strong> — the users' side is about £12,700, so £12,000 is on the low side.</li>
<li><strong>A last example</strong> — a 747 leaving its stand late costs about £1,000 per minute.</li>
</ul>`,
        `<p class="y-chinh">🎯 Giờ tính phía người dùng: một lỗi chỉ ảnh hưởng 5 người dùng đã làm họ tốn £12.000 — gấp mười hai lần £1.000 của developer.</p>
<p class="nhan">Các khoản của người dùng (£350 = một ngày 7 giờ)</p>
<ul>
<li><strong>Công việc chậm gấp đôi trong 1 tuần</strong> — £4.000.</li>
<li><strong>Sửa dữ liệu bị hỏng</strong> — 1 ngày = £350.</li>
<li><strong>Trả nhà cung cấp tiền sửa</strong> — 3 ngày bảo trì = £750.</li>
<li><strong>Regression test &amp; ký xác nhận</strong> — 2 ngày = £700.</li>
<li><strong>Cập nhật quy trình / thông báo nhân viên</strong> — 1 ngày = £350.</li>
<li><strong>Kiểm tra lại mọi thứ</strong> — thêm 12% thời gian trong 5 tuần, vì không còn tin hệ thống = £5.000.</li>
<li><strong>Hành chính (+7,5%)</strong> — £800.</li>
</ul>
<p class="nhan">Tổng</p>
<p>Developer <strong>£1.000</strong> · người dùng <strong>£12.000</strong> · cộng lại khoảng <strong>£13.000</strong> cho một lỗi.</p>
<div class="pitfall">Trên slide, hai dòng £700 và £350 in dưới cột "Developer", nhưng tổng developer vẫn là £1.000. Cột người dùng chỉ cộng ra £12.000 nếu hai dòng đó là ngày công của chính người dùng: 50 + 4.000 + 350 + 750 + 700 + 350 + 5.000 + 800 = 12.000.</div>
<p class="nhan">Ghi chú của thầy/cô, đã kiểm lại</p>
<ul>
<li><strong>Công việc × 2</strong> — £50 × 7 giờ = £350/ngày; × 5 ngày = £1.750/tuần; mất một nửa = £875 × 5 người = <strong>£4.375</strong> (slide làm tròn £4.000).</li>
<li><strong>Kiểm tra lại</strong> — £350 × 5 người = £1.750/ngày; 12% = £210 (ghi chú: "£200") × 25 ngày = <strong>£5.250</strong> (slide: £5.000).</li>
<li><strong>Hành chính</strong> — 7,5% của khoảng £11.200 ≈ £840 (slide: £800).</li>
<li><strong>Nếu không làm tròn</strong> — phía người dùng khoảng £12.700, nên £12.000 là con số thấp.</li>
<li><strong>Ví dụ cuối</strong> — một chiếc 747 rời chỗ đỗ trễ tốn khoảng £1.000 mỗi phút.</li>
</ul>`],
      [20, 'Cost of fixing faults',
        `<p class="y-chinh">🎯 The later a fault is found, the more it costs to fix — about 1 in requirements, 10 in test, 1,000 once the system is in use.</p>
<p class="nhan">Reading the graph</p>
<ul>
<li><strong>Log scale</strong> — each step on the axis (1, 10, 100, 1000) is ×10.</li>
<li><strong>Req → Des</strong> — the cost rises slowly.</li>
<li><strong>Test</strong> — about 10.</li>
<li><strong>Use</strong> — 1,000 or more: the fault has reached many users (the pile of PCs), as in pages 17–19.</li>
</ul>
<div class="pitfall">The exact multipliers are an illustration, not syllabus numbers. The exam asks only for the trend: the cost of fixing rises the later a defect is found (principle 3, "early testing saves time and money").</div>`,
        `<p class="y-chinh">🎯 Lỗi tìm ra càng muộn thì sửa càng đắt — khoảng 1 ở pha yêu cầu, 10 ở pha test, 1.000 khi hệ thống đã được dùng.</p>
<p class="nhan">Đọc đồ thị</p>
<ul>
<li><strong>Thang log</strong> — mỗi vạch trên trục (1, 10, 100, 1000) là ×10.</li>
<li><strong>Req → Des</strong> — chi phí tăng chậm.</li>
<li><strong>Test</strong> — khoảng 10.</li>
<li><strong>Use</strong> — từ 1.000 trở lên: lỗi đã tới tay nhiều người dùng (đống PC bên phải), như trang 17–19.</li>
</ul>
<div class="pitfall">Các hệ số cụ thể chỉ để minh hoạ, không phải số liệu của syllabus. Đề thi chỉ hỏi xu hướng: lỗi phát hiện càng muộn thì sửa càng tốn (nguyên tắc 3, "kiểm thử sớm tiết kiệm thời gian và tiền bạc").</div>`],
      [21, 'How expensive for you?',
        `<p class="y-chinh">🎯 A 10-minute exercise: put your own numbers on testing and on faults.</p>
<p class="nhan">Calculate three things</p>
<ol>
<li><strong>The cost of testing</strong> — people's time, machines, tools.</li>
<li><strong>The cost to fix faults found in testing.</strong></li>
<li><strong>The cost to fix faults missed by testing.</strong></li>
</ol>
<p class="nhan">No data?</p>
<p>Estimate. "Your figures will be the best your company has!" — a rough number beats no number when you argue for testing.</p>
<p class="ghi-chu">Try it on your SWP391 project: hours spent testing vs hours spent fixing bugs the lecturer found at the demo.</p>`,
        `<p class="y-chinh">🎯 Bài tập 10 phút: gắn con số của chính bạn vào việc test và vào lỗi.</p>
<p class="nhan">Tính ba thứ</p>
<ol>
<li><strong>Chi phí test</strong> — thời gian của người, máy móc, công cụ.</li>
<li><strong>Chi phí sửa các lỗi tìm thấy khi test.</strong></li>
<li><strong>Chi phí sửa các lỗi lọt qua test.</strong></li>
</ol>
<p class="nhan">Không có số liệu?</p>
<p>Hãy ước lượng. "Số liệu của bạn sẽ là số tốt nhất công ty đang có!" — con số thô vẫn hơn không có số khi bạn thuyết phục mọi người đầu tư cho test.</p>
<p class="ghi-chu">Thử với đồ án SWP391 của bạn: số giờ dành cho test so với số giờ sửa các bug thầy/cô phát hiện lúc demo.</p>`],
      [34, 'Component Test Document Hierarchy',
        `<p class="y-chinh">🎯 BS 7925-2 organises component-test documents as a tree: one strategy, one project plan, then a plan, a specification and a report for every component.</p>
<p class="nhan">The levels (top to bottom)</p>
<ol>
<li><strong>Component Test Strategy</strong> — one for the organisation (its content: Lesson 2.2, slides 45–46).</li>
<li><strong>Project Component Test Plan</strong> — one per project; it fans out to every component.</li>
<li><strong>Component Test Plan</strong> — one per component.</li>
<li><strong>Component Test Specification</strong> — the test cases for that component.</li>
<li><strong>Component Test Report</strong> — the results for that component.</li>
</ol>
<p class="ghi-chu">Outdated standard: BS 7925-2 has been withdrawn and replaced by ISO/IEC/IEEE 29119 (part 3 covers test documentation). The idea of a strategy → plan → specification → report chain is unchanged.</p>`,
        `<p class="y-chinh">🎯 BS 7925-2 sắp xếp tài liệu component test thành một cây: một chiến lược, một kế hoạch dự án, rồi mỗi thành phần có một kế hoạch, một đặc tả và một báo cáo.</p>
<p class="nhan">Các tầng (từ trên xuống)</p>
<ol>
<li><strong>Component Test Strategy</strong> — một bản cho cả tổ chức (nội dung: Bài 2.2, slide 45–46).</li>
<li><strong>Project Component Test Plan</strong> — một bản cho mỗi dự án; toả xuống mọi thành phần.</li>
<li><strong>Component Test Plan</strong> — một bản cho mỗi thành phần.</li>
<li><strong>Component Test Specification</strong> — các test case của thành phần đó.</li>
<li><strong>Component Test Report</strong> — kết quả của thành phần đó.</li>
</ol>
<p class="ghi-chu">Chuẩn đã cũ: BS 7925-2 đã bị rút và thay bằng ISO/IEC/IEEE 29119 (phần 3 về tài liệu test). Ý tưởng chuỗi chiến lược → kế hoạch → đặc tả → báo cáo vẫn giữ nguyên.</p>`],
      [35, 'Component test process',
        `<p class="y-chinh">🎯 The BS 7925-2 component test process has five activities, with loops back whenever something is missing or wrong.</p>
<p class="nhan">The five activities</p>
<ol>
<li><strong>Component test planning</strong></li>
<li><strong>Component test specification</strong></li>
<li><strong>Component test execution</strong></li>
<li><strong>Component test recording</strong></li>
<li><strong>Checking for component test completion</strong> → END</li>
</ol>
<p class="nhan">The loops (yellow arrows)</p>
<ul>
<li><strong>Recording → execution</strong> — re-run a test after a fix.</li>
<li><strong>Recording → specification</strong> — the test case itself was wrong.</li>
<li><strong>Completion → specification</strong> — more test cases are needed to meet the criteria.</li>
<li><strong>Completion → planning</strong> — the plan itself must change.</li>
</ul>
<p class="nhan">Today's CTFL v4.0 test process</p>
<ul>
<li><strong>Planning</strong> → test planning.</li>
<li><strong>Specification</strong> → test analysis, design and implementation.</li>
<li><strong>Execution + recording</strong> → test execution (run, log, compare, report defects).</li>
<li><strong>Checking for completion</strong> → monitoring &amp; control against exit criteria, then test completion.</li>
</ul>`,
        `<p class="y-chinh">🎯 Quy trình component test theo BS 7925-2 có năm hoạt động, với các vòng quay lại mỗi khi thiếu hoặc sai điều gì đó.</p>
<p class="nhan">Năm hoạt động</p>
<ol>
<li><strong>Lập kế hoạch component test</strong></li>
<li><strong>Đặc tả component test</strong></li>
<li><strong>Thực thi component test</strong></li>
<li><strong>Ghi nhận component test</strong></li>
<li><strong>Kiểm tra điều kiện hoàn thành</strong> → KẾT THÚC</li>
</ol>
<p class="nhan">Các vòng lặp (mũi tên vàng)</p>
<ul>
<li><strong>Ghi nhận → thực thi</strong> — chạy lại test sau khi sửa.</li>
<li><strong>Ghi nhận → đặc tả</strong> — chính test case bị sai.</li>
<li><strong>Hoàn thành → đặc tả</strong> — cần thêm test case để đạt tiêu chí.</li>
<li><strong>Hoàn thành → kế hoạch</strong> — phải sửa chính kế hoạch.</li>
</ul>
<p class="nhan">Quy trình test theo CTFL v4.0 hiện nay</p>
<ul>
<li><strong>Planning</strong> → test planning.</li>
<li><strong>Specification</strong> → test analysis, design và implementation.</li>
<li><strong>Execution + recording</strong> → test execution (chạy, ghi log, so sánh, báo lỗi).</li>
<li><strong>Checking for completion</strong> → monitoring &amp; control theo exit criteria, rồi test completion.</li>
</ul>`],
      [36, 'Component test process — planning',
        `<p class="y-chinh">🎯 Component test planning adapts the organisation's strategy and the project plan to one component.</p>
<ul>
<li><strong>Apply</strong> — how the test strategy and the project test plan apply to this component.</li>
<li><strong>Exceptions</strong> — any exceptions to the strategy.</li>
<li><strong>Surroundings</strong> — all software the component will interact with, e.g. stubs and drivers (Lesson 2.2, slides 60 and 63).</li>
</ul>`,
        `<p class="y-chinh">🎯 Lập kế hoạch component test là áp chiến lược của tổ chức và kế hoạch dự án vào một thành phần cụ thể.</p>
<ul>
<li><strong>Áp dụng</strong> — chiến lược test và kế hoạch test dự án áp vào thành phần này thế nào.</li>
<li><strong>Ngoại lệ</strong> — mọi điểm khác với chiến lược.</li>
<li><strong>Xung quanh</strong> — mọi phần mềm thành phần sẽ tương tác, vd stub và driver (Bài 2.2, slide 60 và 63).</li>
</ul>`],
      [37, 'Component test process — specification',
        `<p class="y-chinh">🎯 Component test specification designs the test cases, using the techniques the plan named.</p>
<ul>
<li><strong>Techniques</strong> — taken from the test plan (Section 3 of the standard, Lesson 2.2 slide 47).</li>
<li><strong>Repeatable</strong> — running a test case twice must give the same result.</li>
</ul>
<p class="nhan">A test case has four parts</p>
<ol>
<li><strong>Objective</strong> — what it checks.</li>
<li><strong>Initial state of the component</strong></li>
<li><strong>Input</strong></li>
<li><strong>Expected outcome</strong></li>
</ol>
<p class="ghi-chu">CTFL v4.0 words: preconditions, inputs, expected results (and postconditions). The <em>actual</em> outcome is not part of the test case — it is written down later, during recording.</p>`,
        `<p class="y-chinh">🎯 Đặc tả component test là thiết kế test case, bằng các kỹ thuật mà kế hoạch đã chọn.</p>
<ul>
<li><strong>Kỹ thuật</strong> — lấy từ test plan (Mục 3 của chuẩn, Bài 2.2 slide 47).</li>
<li><strong>Lặp lại được</strong> — chạy một test case hai lần phải ra cùng kết quả.</li>
</ul>
<p class="nhan">Một test case có bốn phần</p>
<ol>
<li><strong>Mục tiêu</strong> — nó kiểm điều gì.</li>
<li><strong>Trạng thái ban đầu của thành phần</strong></li>
<li><strong>Đầu vào</strong></li>
<li><strong>Kết quả mong đợi</strong></li>
</ol>
<p class="ghi-chu">Từ theo CTFL v4.0: preconditions, inputs, expected results (và postconditions). Kết quả <em>thực tế</em> không thuộc test case — nó được ghi sau, ở bước ghi nhận.</p>`],
      [38, 'Component test process — execution',
        `<p class="y-chinh">🎯 Component test execution runs each test case — by hand or with a tool, the standard does not mind.</p>
<ul>
<li><strong>Every test case</strong> in the specification is executed.</li>
<li><strong>Manual or automated</strong> — the standard does not specify; in practice component tests are usually automated (JUnit in the labs).</li>
</ul>`,
        `<p class="y-chinh">🎯 Thực thi component test là chạy từng test case — bằng tay hay bằng công cụ, chuẩn không bắt buộc.</p>
<ul>
<li><strong>Mọi test case</strong> trong bản đặc tả đều được chạy.</li>
<li><strong>Thủ công hay tự động</strong> — chuẩn không quy định; thực tế component test thường tự động (JUnit trong các lab).</li>
</ul>`],
      [39, 'Component test process — recording',
        `<p class="y-chinh">🎯 Component test recording keeps enough evidence to show the testing was really done.</p>
<ul>
<li><strong>Identities &amp; versions</strong> — of the component and of the test specification.</li>
<li><strong>Actual vs expected</strong> — the actual outcome is recorded and compared with the expected outcome.</li>
<li><strong>Discrepancies logged</strong> — today: a defect report.</li>
<li><strong>Repeat to remove the discrepancy</strong> — either the test was faulty, or the fix must be verified (today: confirmation testing).</li>
<li><strong>Coverage achieved</strong> — recorded against the completion criteria in the plan.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the yellow call-out — records must be "sufficient to show test activities carried out". Think of them as an audit trail.</p>`,
        `<p class="y-chinh">🎯 Ghi nhận component test là giữ đủ bằng chứng cho thấy việc test đã thật sự được làm.</p>
<ul>
<li><strong>Định danh &amp; phiên bản</strong> — của thành phần và của bản đặc tả test.</li>
<li><strong>Thực tế so với mong đợi</strong> — kết quả thực tế được ghi lại và so với kết quả mong đợi.</li>
<li><strong>Ghi lại chỗ lệch</strong> — nay gọi là defect report.</li>
<li><strong>Làm lại cho tới khi hết lệch</strong> — hoặc test bị sai, hoặc phải kiểm lại bản sửa (nay gọi là confirmation testing).</li>
<li><strong>Coverage đạt được</strong> — ghi theo tiêu chí hoàn thành trong kế hoạch.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> khung vàng — hồ sơ phải "đủ để chứng minh các hoạt động test đã được thực hiện". Hãy coi nó như dấu vết kiểm toán.</p>`],
      [40, 'Component test process — checking for completion',
        `<p class="y-chinh">🎯 Checking for completion compares the records with the completion criteria; if they are not met, go back.</p>
<ul>
<li><strong>Compare</strong> — test records against the specified completion criteria (e.g. 100% branch coverage).</li>
<li><strong>Not met</strong> — repeat test activities.</li>
<li><strong>Maybe back to specification</strong> — design extra test cases to reach the criteria, e.g. white-box cases for uncovered branches.</li>
</ul>
<p class="ghi-chu">CTFL v4.0 calls these criteria <em>exit criteria</em> (in Agile: the <em>definition of done</em>).</p>`,
        `<p class="y-chinh">🎯 Kiểm tra hoàn thành là so hồ sơ với tiêu chí hoàn thành; chưa đạt thì quay lại.</p>
<ul>
<li><strong>So sánh</strong> — hồ sơ test với tiêu chí hoàn thành đã đặt (vd 100% branch coverage).</li>
<li><strong>Chưa đạt</strong> — làm lại các hoạt động test.</li>
<li><strong>Có thể quay về đặc tả</strong> — thiết kế thêm test case để đạt tiêu chí, vd test white-box cho các nhánh chưa phủ.</li>
</ul>
<p class="ghi-chu">CTFL v4.0 gọi các tiêu chí này là <em>exit criteria</em> (trong Agile: <em>definition of done</em>).</p>`],
      [42, 'Integration testing in the small',
        `<p class="y-chinh">🎯 "Integration testing in the small" is today's <em>component integration testing</em>: tested components put together inside one system.</p>
<ul>
<li><strong>Input</strong> — more than one component, each already tested.</li>
<li><strong>Focus</strong> — the communication between components.</li>
<li><strong>What the set can do</strong> — behaviour that no component can perform on its own.</li>
<li><strong>Non-functional aspects</strong> — if possible (e.g. response time across a call chain).</li>
<li><strong>Strategy</strong> — big-bang vs incremental: top-down, bottom-up, functional (Lesson 2.2, slides 57–67).</li>
<li><strong>Who</strong> — designers, analysts or independent testers.</li>
</ul>
<div class="pitfall">"Who" has moved. The 2023 page says designers, analysts or independent testers; the current syllabus says component integration testing is usually done by <strong>developers</strong>, and system integration by testers (Lesson 2.2, question slide 71). Answer the exam with the current version.</div>`,
        `<p class="y-chinh">🎯 "Integration testing in the small" chính là <em>component integration testing</em> ngày nay: ghép các thành phần đã test bên trong một hệ thống.</p>
<ul>
<li><strong>Đầu vào</strong> — nhiều hơn một thành phần, mỗi cái đã được test.</li>
<li><strong>Trọng tâm</strong> — giao tiếp giữa các thành phần.</li>
<li><strong>Việc cả nhóm làm được</strong> — hành vi mà không thành phần nào tự làm được.</li>
<li><strong>Phi chức năng</strong> — nếu có thể (vd thời gian phản hồi qua một chuỗi lời gọi).</li>
<li><strong>Chiến lược</strong> — big-bang hay tăng dần: top-down, bottom-up, theo chức năng (Bài 2.2, slide 57–67).</li>
<li><strong>Ai làm</strong> — người thiết kế, người phân tích hoặc tester độc lập.</li>
</ul>
<div class="pitfall">"Ai làm" đã thay đổi. Trang 2023 ghi người thiết kế, người phân tích hoặc tester độc lập; syllabus hiện nay nói component integration testing thường do <strong>developer</strong> làm, còn system integration do tester làm (Bài 2.2, câu hỏi slide 71). Đi thi thì trả lời theo bản hiện nay.</div>`],
      [56, 'System testing',
        `<p class="y-chinh">🎯 The 2023 deck calls system testing "the last integration step": everything inside the system is now together.</p>
<p class="nhan">Two halves</p>
<ul>
<li><strong>Functional</strong> — requirements-based testing and business-process-based testing (Lesson 2.4, slides 110–111).</li>
<li><strong>Non-functional</strong> — as important as the functional requirements, often poorly specified, and it must be tested.</li>
</ul>
<p class="nhan">Who</p>
<p>Often an <strong>independent test group</strong> — the same as today's syllabus (Lesson 2.3, slide 77).</p>
<p class="ghi-chu">What is new here is only the framing "last integration step" and the picture: many sub-systems (each a small call graph) joined into one whole.</p>`,
        `<p class="y-chinh">🎯 Bộ 2023 gọi system testing là "bước tích hợp cuối cùng": mọi thứ bên trong hệ thống giờ đã ghép đủ.</p>
<p class="nhan">Hai nửa</p>
<ul>
<li><strong>Chức năng</strong> — test dựa trên yêu cầu và test dựa trên quy trình nghiệp vụ (Bài 2.4, slide 110–111).</li>
<li><strong>Phi chức năng</strong> — quan trọng không kém yêu cầu chức năng, thường đặc tả kém, và bắt buộc phải test.</li>
</ul>
<p class="nhan">Ai làm</p>
<p>Thường là <strong>nhóm test độc lập</strong> — giống syllabus hiện nay (Bài 2.3, slide 77).</p>
<p class="ghi-chu">Điểm mới ở đây chỉ là cách gọi "bước tích hợp cuối" và hình vẽ: nhiều hệ thống con (mỗi cái là một đồ thị lời gọi nhỏ) ghép thành một khối.</p>`],
      [60, 'Non-functional system testing',
        `<p class="y-chinh">🎯 The 2023 deck lists nine kinds of non-functional system test; two of them — storage and volume — are not on the current slides.</p>
<p class="nhan">The list</p>
<ol class="hai-cot"><li>Usability</li><li>Security</li><li>Documentation</li><li>Storage</li><li>Volume</li><li>Configuration / installation</li><li>Reliability / qualities</li><li>Back-up / recovery</li><li>Performance, load, stress</li></ol>
<p class="nhan">The two new ones</p>
<ul>
<li><strong>Storage testing</strong> — does the system stay within its memory and disk limits?</li>
<li><strong>Volume testing</strong> — does it still work with very large amounts of data (e.g. a table with 10 million rows)?</li>
</ul>
<p class="ghi-chu">The other seven each have a slide in Lesson 2.4 (slides 115–122). In today's ISO/IEC 25010 model, storage and volume belong to <em>performance efficiency</em> (resource utilisation, capacity).</p>`,
        `<p class="y-chinh">🎯 Bộ 2023 liệt kê chín loại system test phi chức năng; hai loại — storage và volume — không có trên slide hiện tại.</p>
<p class="nhan">Danh sách</p>
<ol class="hai-cot"><li>Usability</li><li>Security</li><li>Documentation</li><li>Storage</li><li>Volume</li><li>Configuration / installation</li><li>Reliability / qualities</li><li>Back-up / recovery</li><li>Performance, load, stress</li></ol>
<p class="nhan">Hai loại mới</p>
<ul>
<li><strong>Storage testing</strong> — hệ thống có ở trong giới hạn bộ nhớ và dung lượng đĩa không?</li>
<li><strong>Volume testing</strong> — có còn chạy đúng với lượng dữ liệu rất lớn không (vd một bảng 10 triệu dòng)?</li>
</ul>
<p class="ghi-chu">Bảy loại còn lại đều có slide riêng ở Bài 2.4 (slide 115–122). Theo mô hình ISO/IEC 25010 hiện nay, storage và volume thuộc <em>performance efficiency</em> (sử dụng tài nguyên, dung lượng).</p>`],
      [69, 'Integration testing in the large',
        `<p class="y-chinh">🎯 Integration testing in the large (today: <em>system integration testing</em>) tests the finished system working together with other systems.</p>
<p class="nhan">"Other systems" on the page</p>
<ul>
<li><strong>Networks</strong> — LAN / WAN, communications middleware.</li>
<li><strong>Other internal systems</strong> — billing, stock, personnel, overnight batch, branch offices, other countries.</li>
<li><strong>External systems</strong> — stock exchange, news, suppliers.</li>
<li><strong>Intranet, internet / www</strong></li>
<li><strong>Third-party packages</strong></li>
<li><strong>Electronic data interchange (EDI)</strong> — business documents exchanged in a standard format.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> today's version of the list — payment gateways, REST APIs of partners, cloud services, single sign-on. The contract-testing box in Lesson 2.2 shows a modern way to test these connections.</p>`,
        `<p class="y-chinh">🎯 Integration testing in the large (nay: <em>system integration testing</em>) test hệ thống đã hoàn chỉnh khi chạy cùng các hệ thống khác.</p>
<p class="nhan">"Hệ thống khác" trên trang</p>
<ul>
<li><strong>Mạng</strong> — LAN / WAN, phần mềm trung gian truyền thông.</li>
<li><strong>Hệ thống nội bộ khác</strong> — tính cước, kho, nhân sự, xử lý lô ban đêm, chi nhánh, các nước khác.</li>
<li><strong>Hệ thống bên ngoài</strong> — sàn chứng khoán, tin tức, nhà cung cấp.</li>
<li><strong>Intranet, internet / www</strong></li>
<li><strong>Gói phần mềm bên thứ ba</strong></li>
<li><strong>Trao đổi dữ liệu điện tử (EDI)</strong> — chứng từ kinh doanh trao đổi theo định dạng chuẩn.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> phiên bản ngày nay của danh sách này — cổng thanh toán, REST API của đối tác, dịch vụ đám mây, đăng nhập một lần (SSO). Khung contract testing ở Bài 2.2 cho thấy cách hiện đại để test các kết nối đó.</p>`],
      [70, 'Approach',
        `<p class="y-chinh">🎯 Integrate in the large the same way as in the small: riskiest first, one connection at a time, incrementally.</p>
<p class="nhan">Identify risks</p>
<p>Which connections, if missing or malfunctioning, would be most critical? Test them first.</p>
<p class="nhan">"Divide and conquer"</p>
<ol>
<li><strong>Test the outside first</strong> — at the interface to your system, e.g. test a bought package on its own.</li>
<li><strong>One connection at a time</strong> — your system and one other.</li>
<li><strong>Combine incrementally</strong> — safer than a non-incremental "big bang" (Lesson 2.2, slides 57–58).</li>
</ol>`,
        `<p class="y-chinh">🎯 Tích hợp mức lớn cũng làm như mức nhỏ: rủi ro nhất trước, từng kết nối một, tăng dần.</p>
<p class="nhan">Xác định rủi ro</p>
<p>Kết nối nào mà thiếu hoặc chạy sai sẽ nghiêm trọng nhất? Test nó trước.</p>
<p class="nhan">"Chia để trị"</p>
<ol>
<li><strong>Test bên ngoài trước</strong> — tại giao diện với hệ thống của bạn, vd test riêng một gói phần mềm mua về.</li>
<li><strong>Từng kết nối một</strong> — hệ thống của bạn và một hệ thống khác.</li>
<li><strong>Ghép tăng dần</strong> — an toàn hơn "big bang" không tăng dần (Bài 2.2, slide 57–58).</li>
</ol>`],
      [71, 'Planning considerations',
        `<p class="y-chinh">🎯 Integration in the large depends on things you do not own, so plan resources, partners — and even the development plan.</p>
<ul>
<li><strong>Resources</strong> — identify what will be needed, e.g. networks and test connections to the other systems.</li>
<li><strong>Co-operation</strong> — plan it with other organisations, e.g. suppliers and technical support teams.</li>
<li><strong>Development plan</strong> — the integration test plan can change the build order, e.g. conversion software needed early to exchange data formats.</li>
</ul>
<p class="ghi-chu">The same idea as Lesson 2.2, slide 69 ("the integration order determines the build order"), one level up.</p>`,
        `<p class="y-chinh">🎯 Tích hợp mức lớn phụ thuộc vào những thứ bạn không sở hữu, nên phải lên kế hoạch cho tài nguyên, đối tác — thậm chí cả kế hoạch phát triển.</p>
<ul>
<li><strong>Tài nguyên</strong> — xác định những gì cần, vd mạng và kết nối test tới các hệ thống khác.</li>
<li><strong>Phối hợp</strong> — lên kế hoạch cùng các tổ chức khác, vd nhà cung cấp và đội hỗ trợ kỹ thuật.</li>
<li><strong>Kế hoạch phát triển</strong> — kế hoạch test tích hợp có thể đổi thứ tự xây dựng, vd phần mềm chuyển đổi cần có sớm để trao đổi định dạng dữ liệu.</li>
</ul>
<p class="ghi-chu">Cùng ý với Bài 2.2, slide 69 ("thứ tự tích hợp quyết định thứ tự xây dựng"), ở tầng cao hơn.</p>`],
      [74, 'User Acceptance testing — 80/20',
        `<p class="y-chinh">🎯 System testing and acceptance testing spread their effort along different lines — so acceptance is not a re-run of system testing.</p>
<p class="nhan">Reading the picture</p>
<ul>
<li><strong>Bottom line (yellow)</strong> — "20% of function by 80% of code": most of the code implements rarely used functions (error handling, exceptions, special options).</li>
<li><strong>Top line (pink)</strong> — "80% of function by 20% of code": the functions users rely on every day run on a small part of the code.</li>
<li><strong>System testing</strong> — spread over the bottom line: it follows the code and the specification, so much of its effort lands on the rare cases.</li>
<li><strong>Acceptance testing</strong> — spread over the top line: it follows how users really work, so it concentrates on the everyday functions.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> engineers test every part of the sports car; the buyer judges it by driving it. Both are needed, and they find different problems.</p>
<p class="ghi-chu">80/20 is the Pareto rule of thumb, not a measured figure.</p>`,
        `<p class="y-chinh">🎯 System testing và acceptance testing rải công sức theo hai đường khác nhau — nên acceptance không phải là chạy lại system testing.</p>
<p class="nhan">Đọc hình</p>
<ul>
<li><strong>Đường dưới (vàng)</strong> — "20% chức năng do 80% code": phần lớn code cài các chức năng ít dùng (xử lý lỗi, ngoại lệ, tuỳ chọn đặc biệt).</li>
<li><strong>Đường trên (hồng)</strong> — "80% chức năng do 20% code": các chức năng người dùng dựa vào hằng ngày chỉ chạy trên một phần nhỏ code.</li>
<li><strong>System testing</strong> — rải trên đường dưới: bám theo code và đặc tả, nên nhiều công sức rơi vào các trường hợp hiếm.</li>
<li><strong>Acceptance testing</strong> — rải trên đường trên: bám theo cách người dùng thật sự làm việc, nên tập trung vào các chức năng hằng ngày.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> kỹ sư test từng bộ phận của chiếc xe thể thao; người mua đánh giá nó bằng cách lái thử. Cần cả hai, và mỗi bên tìm ra những vấn đề khác nhau.</p>
<p class="ghi-chu">80/20 là quy tắc kinh nghiệm Pareto, không phải số đo thật.</p>`],
      [75, 'Contract acceptance testing',
        `<p class="y-chinh">🎯 Contract acceptance testing checks the system against the contract and its documented, agreed changes — not against what users now wish.</p>
<p class="nhan">The contract to supply the system</p>
<ul>
<li><strong>Agreed early</strong> — at the contract definition stage.</li>
<li><strong>Acceptance criteria</strong> — defined and agreed in it.</li>
<li><strong>May be out of date</strong> — requirements change after signing.</li>
</ul>
<p class="nhan">What the test is against</p>
<ul>
<li><strong>The contract + documented agreed changes</strong></li>
<li><strong>Not</strong> "what the users wish they had asked for" — "this system, not wish system".</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> a change agreed only by word of mouth does not exist at contract acceptance. Write every change request down and get it signed.</p>
<p class="ghi-chu">CTFL v4.0 calls it <em>contractual acceptance testing</em> (Lesson 2.3, slide 88).</p>`,
        `<p class="y-chinh">🎯 Acceptance theo hợp đồng kiểm hệ thống so với hợp đồng và các thay đổi đã thoả thuận bằng văn bản — không so với điều người dùng bây giờ mong muốn.</p>
<p class="nhan">Hợp đồng cung cấp hệ thống</p>
<ul>
<li><strong>Thống nhất từ sớm</strong> — ở giai đoạn xác lập hợp đồng.</li>
<li><strong>Tiêu chí nghiệm thu</strong> — được định nghĩa và thống nhất trong đó.</li>
<li><strong>Có thể đã lỗi thời</strong> — yêu cầu thay đổi sau khi ký.</li>
</ul>
<p class="nhan">Test so với cái gì</p>
<ul>
<li><strong>Hợp đồng + các thay đổi đã thoả thuận bằng văn bản</strong></li>
<li><strong>Không phải</strong> "điều người dùng ước gì đã yêu cầu" — "hệ thống này, không phải hệ thống mơ ước".</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> thay đổi chỉ thống nhất bằng miệng thì coi như không tồn tại lúc nghiệm thu hợp đồng. Hãy ghi mọi yêu cầu thay đổi ra giấy và xin chữ ký.</p>
<p class="ghi-chu">CTFL v4.0 gọi là <em>contractual acceptance testing</em> (Bài 2.3, slide 88).</p>`],
      [76, 'Alpha and Beta tests: similarities',
        `<p class="y-chinh">🎯 Alpha and beta tests share four traits: market testers, stable software, realistic use, and feedback.</p>
<ol>
<li><strong>Who</strong> — potential customers or representatives of your market. Not suitable for bespoke (custom-built) software: that has one customer, who does UAT or contract acceptance instead.</li>
<li><strong>When</strong> — once the software is stable.</li>
<li><strong>How</strong> — using the product realistically, in its operational environment.</li>
<li><strong>Output</strong> — comments back on the product:
<ul>
<li>faults found</li>
<li>how well the product meets their expectations</li>
<li>improvement / enhancement suggestions</li>
</ul></li>
</ol>
<p class="ghi-chu">This is why the current slides tie alpha/beta to COTS (off-the-shelf) software — Lesson 2.3, slide 89 and question slide 97.</p>`,
        `<p class="y-chinh">🎯 Alpha và beta giống nhau ở bốn điểm: người test đại diện thị trường, phần mềm đã ổn định, dùng thực tế, và phản hồi.</p>
<ol>
<li><strong>Ai</strong> — khách hàng tiềm năng hoặc người đại diện cho thị trường của bạn. Không hợp với phần mềm đặt làm riêng (bespoke): loại đó chỉ có một khách hàng, họ làm UAT hoặc nghiệm thu hợp đồng.</li>
<li><strong>Khi nào</strong> — khi phần mềm đã ổn định.</li>
<li><strong>Thế nào</strong> — dùng sản phẩm một cách thực tế, trong môi trường vận hành của nó.</li>
<li><strong>Đầu ra</strong> — nhận xét gửi lại về sản phẩm:
<ul>
<li>các lỗi tìm thấy</li>
<li>sản phẩm đáp ứng kỳ vọng của họ tới đâu</li>
<li>đề xuất cải tiến / bổ sung</li>
</ul></li>
</ol>
<p class="ghi-chu">Vì vậy slide hiện tại gắn alpha/beta với phần mềm đóng gói (COTS) — Bài 2.3, slide 89 và câu hỏi slide 97.</p>`],
      [77, 'Alpha and Beta tests: differences',
        `<p class="y-chinh">🎯 The only difference is the place: alpha at the developers' site, beta at the testers' own location.</p>
<ul>
<li><strong>Alpha</strong> — simulated or actual operational testing at an in-house site, i.e. the developers' site, by people not otherwise involved with the developers.</li>
<li><strong>Beta</strong> — operational testing at a site not otherwise involved with the developers, i.e. the testers' own location.</li>
</ul>
<div class="pitfall">Alpha happens at the developers' site, but it is <strong>not</strong> done by the developers. "In-house site not otherwise involved" means people outside the development team (Lesson 2.3, question slide 105: answer "developer's end").</div>`,
        `<p class="y-chinh">🎯 Khác nhau duy nhất ở địa điểm: alpha tại nơi của bên phát triển, beta tại chính chỗ của người test.</p>
<ul>
<li><strong>Alpha</strong> — test vận hành mô phỏng hoặc thật tại một địa điểm nội bộ, tức là nơi của bên phát triển, do những người không tham gia phát triển thực hiện.</li>
<li><strong>Beta</strong> — test vận hành tại nơi không liên quan tới bên phát triển, tức là chính chỗ của người test.</li>
</ul>
<div class="pitfall">Alpha diễn ra tại nơi của bên phát triển, nhưng <strong>không</strong> do developer làm. "Địa điểm nội bộ không liên quan" nghĩa là người ngoài nhóm phát triển (Bài 2.3, câu hỏi slide 105: đáp án "phía bên phát triển").</div>`],
      [80, 'Test types',
        `<p class="y-chinh">🎯 The same four test types as today, but with 2023-era wording: "structural testing" and the six ISO 9126 characteristics.</p>
<ol>
<li><strong>Functional testing</strong> — testing of function.</li>
<li><strong>Non-functional testing</strong> — testing of software product characteristics: functionality, reliability, usability, efficiency, maintainability, portability.</li>
<li><strong>Structural testing</strong> — testing of software structure / architecture.</li>
<li><strong>Change-related testing</strong> — confirmation and regression testing.</li>
</ol>
<p class="nhan">Outdated words → today's</p>
<ul>
<li><strong>Structural testing</strong> → <em>white-box testing</em> (Lesson 2.4, slide 123).</li>
<li><strong>ISO 9126 (six characteristics)</strong> → <em>ISO/IEC 25010</em>. CTFL v4.0 lists the non-functional ones as performance efficiency, compatibility, usability, reliability, security, maintainability, portability.</li>
<li><strong>"Functionality" in the old list</strong> — in ISO 9126 it held sub-characteristics such as security; in 25010 it became <em>functional suitability</em>, and security became a characteristic of its own.</li>
</ul>`,
        `<p class="y-chinh">🎯 Vẫn là bốn loại test như ngày nay, nhưng dùng từ thời 2023: "structural testing" và sáu đặc tính ISO 9126.</p>
<ol>
<li><strong>Functional testing</strong> — test chức năng.</li>
<li><strong>Non-functional testing</strong> — test các đặc tính của sản phẩm: functionality, reliability, usability, efficiency, maintainability, portability.</li>
<li><strong>Structural testing</strong> — test cấu trúc / kiến trúc phần mềm.</li>
<li><strong>Change-related testing</strong> — confirmation và regression testing.</li>
</ol>
<p class="nhan">Từ cũ → từ hiện nay</p>
<ul>
<li><strong>Structural testing</strong> → <em>white-box testing</em> (Bài 2.4, slide 123).</li>
<li><strong>ISO 9126 (sáu đặc tính)</strong> → <em>ISO/IEC 25010</em>. CTFL v4.0 liệt kê các đặc tính phi chức năng: performance efficiency, compatibility, usability, reliability, security, maintainability, portability.</li>
<li><strong>"Functionality" trong danh sách cũ</strong> — ở ISO 9126 nó chứa các đặc tính con như security; ở 25010 nó thành <em>functional suitability</em>, còn security tách thành một đặc tính riêng.</li>
</ul>`],
    ]),
    bi(`<h3>Worked example — what does one late fault really cost?</h3>
<p>Use only the deck's own numbers (pages 17–20, loaded cost £50 per hour).</p>
<ol>
<li><strong>Developer side</strong> — 20 h × £50 = <strong>£1,000</strong> (pages 17–18).</li>
<li><strong>The code change inside it</strong> — 0.5 h debug = £25, i.e. <strong>2.5%</strong> of £1,000.</li>
<li><strong>User side</strong> — £12,000 for 5 users = <strong>£2,400 per affected user</strong> (page 19).</li>
<li><strong>Total</strong> — about £13,000, which is <strong>520 ×</strong> the £25 of actual fixing.</li>
<li><strong>Caught earlier</strong> — found while designing tests from the requirement, the fix is one sentence in a document: the "1" on the graph of page 20.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> the fix is cheap; finding it late is what costs. That is the whole argument for early test design.</p>
<div class="pitfall"><ul>
<li><strong>"In the large" ≠ "in the small".</strong> In the large = system integration testing, and it comes after system testing; in the small = component integration testing.</li>
<li><strong>Alpha is not done by developers</strong> — only at their site.</li>
<li><strong>Contract acceptance</strong> is against the contract plus documented agreed changes, never against new wishes.</li>
<li><strong>Who does component integration?</strong> The 2023 page says designers/analysts/testers; today's answer is developers.</li>
<li><strong>Cost multipliers</strong> (1–10–1000) are an illustration; the exam wants only "later = more expensive".</li>
</ul></div>`,
    `<h3>Ví dụ có lời giải — một lỗi phát hiện muộn thật sự tốn bao nhiêu?</h3>
<p>Chỉ dùng số liệu của chính bộ slide (trang 17–20, £50 mỗi giờ công).</p>
<ol>
<li><strong>Phía developer</strong> — 20 giờ × £50 = <strong>£1.000</strong> (trang 17–18).</li>
<li><strong>Phần sửa code trong đó</strong> — 0,5 giờ debug = £25, tức <strong>2,5%</strong> của £1.000.</li>
<li><strong>Phía người dùng</strong> — £12.000 cho 5 người = <strong>£2.400 mỗi người bị ảnh hưởng</strong> (trang 19).</li>
<li><strong>Tổng</strong> — khoảng £13.000, gấp <strong>520 lần</strong> £25 tiền sửa thật.</li>
<li><strong>Nếu bắt sớm</strong> — phát hiện lúc thiết kế test từ yêu cầu, việc sửa chỉ là một câu trong tài liệu: mức "1" trên đồ thị trang 20.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> sửa thì rẻ; phát hiện muộn mới đắt. Đó là toàn bộ lý lẽ cho việc thiết kế test sớm.</p>
<div class="pitfall"><ul>
<li><strong>"In the large" ≠ "in the small".</strong> In the large = system integration testing, đến sau system testing; in the small = component integration testing.</li>
<li><strong>Alpha không do developer làm</strong> — chỉ diễn ra tại chỗ của họ.</li>
<li><strong>Acceptance theo hợp đồng</strong> so với hợp đồng cộng các thay đổi đã thoả thuận bằng văn bản, không bao giờ so với mong muốn mới.</li>
<li><strong>Ai làm component integration?</strong> Trang 2023 ghi người thiết kế/phân tích/tester; đáp án hiện nay là developer.</li>
<li><strong>Các hệ số chi phí</strong> (1–10–1000) chỉ để minh hoạ; đề thi chỉ cần "càng muộn càng đắt".</li>
</ul></div>`),
    bi(`<h3>★ Old words in the 2023 deck → today's CTFL v4.0 words</h3>
<div class="table-wrap"><table>
<thead><tr><th>2023 deck says</th><th>Say today</th><th>Page</th></tr></thead>
<tbody>
<tr><td>ISEB Foundation</td><td>ISTQB CTFL v4.0</td><td>1</td></tr>
<tr><td>fault</td><td>defect (bug); error = a human mistake; failure = wrong behaviour seen</td><td>7–21</td></tr>
<tr><td>integration testing in the small</td><td>component integration testing</td><td>4, 42</td></tr>
<tr><td>integration testing in the large</td><td>system integration testing</td><td>4, 69–71</td></tr>
<tr><td>BS 7925-1 / BS 7925-2</td><td>ISO/IEC/IEEE 29119 (BS 7925 withdrawn)</td><td>34–41</td></tr>
<tr><td>component test specification</td><td>test analysis, design &amp; implementation</td><td>37</td></tr>
<tr><td>discrepancies logged</td><td>defect report</td><td>39</td></tr>
<tr><td>repeat to verify the fix</td><td>confirmation testing</td><td>39</td></tr>
<tr><td>test completion criteria</td><td>exit criteria (Agile: definition of done)</td><td>40</td></tr>
<tr><td>structural testing</td><td>white-box testing</td><td>80</td></tr>
<tr><td>ISO 9126 characteristics</td><td>ISO/IEC 25010 quality characteristics</td><td>80</td></tr>
<tr><td>contract acceptance testing</td><td>contractual acceptance testing</td><td>75</td></tr>
</tbody></table></div>`,
    `<h3>★ Từ cũ trong bộ 2023 → từ theo CTFL v4.0 hiện nay</h3>
<div class="table-wrap"><table>
<thead><tr><th>Bộ 2023 ghi</th><th>Nay gọi là</th><th>Trang</th></tr></thead>
<tbody>
<tr><td>ISEB Foundation</td><td>ISTQB CTFL v4.0</td><td>1</td></tr>
<tr><td>fault</td><td>defect (bug); error = sai sót của người; failure = hành vi sai quan sát được</td><td>7–21</td></tr>
<tr><td>integration testing in the small</td><td>component integration testing</td><td>4, 42</td></tr>
<tr><td>integration testing in the large</td><td>system integration testing</td><td>4, 69–71</td></tr>
<tr><td>BS 7925-1 / BS 7925-2</td><td>ISO/IEC/IEEE 29119 (BS 7925 đã bị rút)</td><td>34–41</td></tr>
<tr><td>component test specification</td><td>test analysis, design &amp; implementation</td><td>37</td></tr>
<tr><td>discrepancies logged</td><td>defect report</td><td>39</td></tr>
<tr><td>repeat to verify the fix</td><td>confirmation testing</td><td>39</td></tr>
<tr><td>test completion criteria</td><td>exit criteria (Agile: definition of done)</td><td>40</td></tr>
<tr><td>structural testing</td><td>white-box testing</td><td>80</td></tr>
<tr><td>đặc tính ISO 9126</td><td>đặc tính chất lượng ISO/IEC 25010</td><td>80</td></tr>
<tr><td>contract acceptance testing</td><td>contractual acceptance testing</td><td>75</td></tr>
</tbody></table></div>`),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz 2 ──────────────────────────────── */
const q = (question, options, correctIndex, explanation) => ({ question, options, correctIndex, points: 1, ...(explanation ? { explanation } : {}) });
const QUIZ2 = {
  title: 'Quiz 2 — Testing throughout the SDLC (all SWT2 slide questions)|||Quiz 2 — Kiểm thử trong SDLC (toàn bộ câu hỏi trên slide SWT2)',
  slug: 'swt301-quiz-2',
  type: 'QUIZ',
  description: '56 câu: đủ 40 câu "Question/Review Question" trên slide SWT2 (đáp án đã giải trong bài 2.1–2.3) + 10 câu về stub/driver, loại test, bảo trì, IEEE 829 và bảng Overview + 6 câu từ bộ slide 2023 (V-model 5 cấp, chi phí lỗi, quy trình BS 7925-2, hợp đồng, alpha/beta).',
  quiz: {
    timeLimitSeconds: 3360,
    questions: [
      q('What does the software development lifecycle describe? (SWT2 s.25)|||Vòng đời phát triển phần mềm mô tả gì? (SWT2 s.25)', ['The types of activities performed in software development projects|||Các loại hoạt động trong dự án phát triển phần mềm', 'The types of test activities performed|||Các loại hoạt động kiểm thử', 'The functional and non-functional requirements|||Các yêu cầu chức năng và phi chức năng'], 0, 'Slide 3 word for word: the SDLC describes the types of activities performed in software development projects (slide 25). "Test activities" is too narrow, and functional/non-functional requirements describe a requirements document, not a lifecycle.|||Đúng từng chữ slide 3: SDLC mô tả các loại hoạt động thực hiện trong dự án phát triển phần mềm (slide 25). "Hoạt động kiểm thử" là quá hẹp, còn yêu cầu chức năng/phi chức năng là nội dung của tài liệu yêu cầu, không phải vòng đời.'),
      q('Characteristics of good testing: 1 each level has its own objective; 2 analysis/design start only at the end of the development activity; 3 every development activity has a test activity; 4 testers help define requirements. (s.26)|||Đặc điểm kiểm thử tốt: 1 mỗi cấp có mục tiêu riêng; 2 phân tích/thiết kế chỉ bắt đầu khi hoạt động phát triển xong; 3 mỗi hoạt động phát triển có hoạt động test; 4 tester tham gia định nghĩa yêu cầu. (s.26)', ['1 only|||Chỉ 1', '1, 3, 4 correct; 2 wrong|||1, 3, 4 đúng; 2 sai', '1, 3 correct; 2, 4 wrong|||1, 3 đúng; 2, 4 sai'], 1, 'Statements 1, 3 and 4 are the characteristics on slide 4 (slide 26). Statement 2 is wrong: test analysis and design for a level should begin during the corresponding development activity, not at its end, which is why "1, 3 correct; 2, 4 wrong" is also wrong.|||Câu 1, 3 và 4 là các đặc điểm ở slide 4 (slide 26). Câu 2 sai: phân tích và thiết kế test cho một cấp phải bắt đầu trong khi hoạt động phát triển tương ứng diễn ra, không đợi tới cuối, nên phương án "1, 3 đúng; 2, 4 sai" cũng sai.'),
      q('Best definition of an incremental development model? (s.27)|||Định nghĩa đúng nhất của mô hình tăng dần? (s.27)', ['Requirements, design and testing done in a series with added pieces|||Yêu cầu, thiết kế, test làm thành chuỗi, mỗi lần thêm một phần', 'A phase begins when the previous is complete|||Pha sau bắt đầu khi pha trước xong', 'Testing is a separate phase after development|||Kiểm thử là pha riêng sau phát triển', 'Testing is added as an increment|||Kiểm thử được thêm như một phần tăng'], 0, 'Incremental means establishing requirements, designing, building and testing in pieces, each time adding to the system (slides 14 and 27). "A phase begins when the previous is complete" describes sequential models, and testing as a separate phase after development is the waterfall.|||Tăng dần là xác lập yêu cầu, thiết kế, xây dựng và kiểm thử theo từng phần, mỗi lần thêm vào hệ thống (slide 14 và 27). "Pha sau bắt đầu khi pha trước xong" là mô hình tuần tự, còn kiểm thử là pha riêng sau phát triển là waterfall.'),
      q('True statement about the V-model? (s.28)|||Câu đúng về V-model? (s.28)', ['Testing starts when the code is complete|||Kiểm thử bắt đầu khi code xong', 'The test process is integrated with the development process|||Quy trình test tích hợp với quy trình phát triển', 'Software is built in increments|||Phần mềm được xây theo từng phần tăng', 'All activities are completed sequentially|||Mọi hoạt động làm tuần tự'], 1, 'In the V-model every development level has a matching test level, so the test process is integrated with development (slides 8 and 28). "Testing starts when the code is complete" is the waterfall view, and building in increments describes incremental models.|||Trong V-model mỗi mức phát triển có một cấp test tương ứng, nên quy trình test được tích hợp với quy trình phát triển (slide 8 và 28). "Test bắt đầu khi code xong" là quan điểm waterfall, còn xây theo từng phần tăng là mô hình tăng dần.'),
      q('Waterfall: 1 sequential; 2 testing after development; 3 best for small organisations; 4 small iterations. (s.29)|||Waterfall: 1 tuần tự; 2 test sau phát triển; 3 tốt nhất cho tổ chức nhỏ; 4 chia vòng lặp nhỏ. (s.29)', ['1, 3|||1, 3', '1, 4|||1, 4', '2, 3|||2, 3', '1, 2|||1, 2'], 3, 'Waterfall is sequential (1) and test activities only start after development is finished (2) (slides 7 and 29). It is not "the best model for small organisations" (3), and small iterations (4) belong to iterative models such as Scrum.|||Waterfall là tuần tự (1) và hoạt động test chỉ bắt đầu sau khi phát triển xong (2) (slide 7 và 29). Nó không phải "mô hình tốt nhất cho tổ chức nhỏ" (3), còn chia vòng lặp nhỏ (4) là của mô hình lặp như Scrum.'),
      q('The V-model can be considered a… (s.30)|||V-model được xem là mô hình… (s.30)', ['Sequential model|||Tuần tự', 'Iterative model|||Lặp', 'Incremental model|||Tăng dần'], 0, 'The V is a sequential model: one pass down the left arm and up the right, each phase starting when the previous one ends, with early test design added (slides 6 and 30). It has no repeated cycles, so it is neither iterative nor incremental.|||V-model là mô hình tuần tự: một lượt xuống nhánh trái rồi lên nhánh phải, pha sau bắt đầu khi pha trước xong, có thêm thiết kế test sớm (slide 6 và 30). Nó không có vòng lặp lại, nên không phải mô hình lặp hay tăng dần.'),
      q('In the V-model, where does the client see the product and give feedback? (s.31)|||Trong V-model, khách hàng xem sản phẩm và phản hồi ở cấp nào? (s.31)', ['Unit testing', 'Integration testing', 'System testing', 'Acceptance testing'], 3, 'Acceptance testing sits at the top of the right arm, paired with the user requirements; it is where the customer validates the product and gives feedback (slides 8 and 31). System testing is usually done by independent testers against the specifications, not by the client.|||Acceptance testing nằm ở đỉnh nhánh phải, ghép với yêu cầu người dùng; đó là nơi khách hàng validate sản phẩm và phản hồi (slide 8 và 31). System testing thường do tester độc lập làm dựa trên đặc tả, không phải khách hàng.'),
      q('Main difference between waterfall and V-model? (s.32)|||Khác biệt chính giữa waterfall và V-model? (s.32)', ['Waterfall sequential, V iterative|||Waterfall tuần tự, V lặp', 'V-model applies early testing; waterfall does not|||V-model áp dụng kiểm thử sớm; waterfall không', 'V has one type of requirement, waterfall two|||V có một loại yêu cầu, waterfall hai'], 1, 'Both are sequential; the real difference is that the V-model applies early testing (test design on the left arm as each document is written), while in waterfall testing waits until development is done (slide 32). Calling the V iterative is wrong, and the "types of requirement" option is invented.|||Cả hai đều tuần tự; khác biệt thật là V-model áp dụng kiểm thử sớm (thiết kế test ở nhánh trái khi từng tài liệu ra đời), còn waterfall đợi phát triển xong mới test (slide 32). Gọi V-model là mô hình lặp là sai, còn phương án về "loại yêu cầu" là bịa.'),
      q('RUP divides the project into iterations of… (s.33)|||RUP chia dự án thành các vòng lặp dài… (s.33)', ['Relatively short (1–4 weeks)|||Tương đối ngắn (1–4 tuần)', 'Relatively long (2–3 months)|||Tương đối dài (2–3 tháng)'], 1, 'RUP uses relatively long iterations of two to three months with large increments, driven by risk (slides 18 and 33). One to four weeks is the short cycle of Scrum (slide 19), not RUP.|||RUP dùng vòng lặp tương đối dài, hai đến ba tháng, với phần tăng lớn và rủi ro là động lực chính (slide 18 và 33). Một đến bốn tuần là chu kỳ ngắn của Scrum (slide 19), không phải RUP.'),
      q('Scrum: 1 large 2–3-month iterations; 2 tester writes the requirements document; 3 retrospective at the end of each iteration. (s.34)|||Scrum: 1 vòng lặp lớn 2–3 tháng; 2 tester viết tài liệu yêu cầu; 3 retrospective cuối mỗi vòng. (s.34)', ['1 correct|||1 đúng', '1 & 2 correct|||1 & 2 đúng', '1 & 3 correct|||1 & 3 đúng', '3 correct; 1 & 2 wrong|||3 đúng; 1 & 2 sai'], 3, 'Only statement 3 is true: each sprint ends with a retrospective (slides 19 and 34). Sprints are short (days to a few weeks), not 2–3 months, and testers do not write the requirements document; the product owner owns the backlog.|||Chỉ câu 3 đúng: mỗi sprint kết thúc bằng retrospective (slide 19 và 34). Sprint ngắn (vài ngày tới vài tuần), không phải 2–3 tháng, và tester không viết tài liệu yêu cầu; product owner mới là người giữ backlog.'),
      q('Correct statement about Kanban? (s.35)|||Câu đúng về Kanban? (s.35)', ['Fixed-length iterations|||Vòng lặp độ dài cố định', 'No overlap between phases|||Không chồng lấn giữa các pha', 'With or without fixed-length iterations|||Có hoặc không có vòng lặp cố định'], 2, 'Kanban can be implemented with or without fixed-length iterations, delivering one feature at a time or grouping features into a release (slides 20 and 35). Fixed-length iterations are a Scrum trait, and on a Kanban board activities overlap continuously.|||Kanban có thể chạy có hoặc không có vòng lặp độ dài cố định, giao từng tính năng một hoặc gom nhiều tính năng vào một bản phát hành (slide 20 và 35). Vòng lặp cố định là đặc trưng của Scrum, còn trên bảng Kanban các hoạt động chồng lên nhau liên tục.'),
      q('Which is NOT a test level? (s.40)|||Đâu KHÔNG phải cấp test? (s.40)', ['Component testing', 'Functional testing', 'System integration testing'], 1, 'Functional testing is a test type (lesson 2.4), not a test level (slide 40). Component testing and system integration testing are both levels; the level/type confusion is exactly what this question tests.|||Functional testing là một loại test (bài 2.4), không phải cấp test (slide 40). Component testing và system integration testing đều là cấp test; nhầm lẫn giữa cấp và loại chính là điều câu này kiểm tra.'),
      q('Test levels: 1 instance of the test process; 2 universal in all companies; 3 groups of activities managed together; 4 each needs a suitable environment. (s.41)|||Cấp test: 1 là một phiên bản của quy trình test; 2 chung cho mọi công ty; 3 nhóm hoạt động được quản lý cùng nhau; 4 mỗi cấp cần môi trường phù hợp. (s.41)', ['1, 2, 3', '1, 3, 4', '2, 3, 4', '1, 2, 4'], 1, 'Slides 37–39: each level is an instance of the test process (1), a group of activities organised and managed together (3), and needs a suitable environment (4) (slide 41). Statement 2 is false: organisations name and combine levels differently depending on context, so every option containing 2 is wrong.|||Slide 37–39: mỗi cấp là một phiên bản của quy trình test (1), là nhóm hoạt động được tổ chức và quản lý cùng nhau (3), và cần môi trường phù hợp (4) (slide 41). Câu 2 sai: mỗi tổ chức đặt tên và kết hợp các cấp khác nhau tuỳ ngữ cảnh, nên mọi phương án chứa 2 đều sai.'),
      q('Correct definition of component testing? (s.48)|||Định nghĩa đúng của component testing? (s.48)', ['Testing interactions between components|||Test tương tác giữa thành phần', 'Testing components that are separately testable|||Test thành phần có thể test riêng', 'Testing a whole system|||Test cả hệ thống'], 1, 'Component (unit) testing focuses on components that are separately testable (slides 42 and 48). Testing interactions between components is integration testing, and testing a whole system is system testing.|||Component (unit) testing tập trung vào các thành phần có thể test riêng rẽ (slide 42 và 48). Test tương tác giữa các thành phần là integration testing, còn test cả hệ thống là system testing.'),
      q('An objective of component testing? (s.49)|||Một mục tiêu của component testing? (s.49)', ["Building confidence in the component's quality|||Tạo niềm tin vào chất lượng thành phần", 'Confidence in the interfaces|||Niềm tin vào giao diện', 'Validating the system is complete|||Validate hệ thống hoàn chỉnh'], 0, 'Building confidence in the component\'s quality is one of the component-testing objectives on slide 43 (slide 49). Confidence in the interfaces belongs to integration testing, and validating that the system is complete belongs to system and acceptance testing.|||Tạo niềm tin vào chất lượng của thành phần là một mục tiêu của component testing ở slide 43 (slide 49). Niềm tin vào giao diện thuộc integration testing, còn validate hệ thống hoàn chỉnh thuộc system và acceptance testing.'),
      q('Test basis for component testing? (s.50)|||Test basis cho component testing? (s.50)', ['Use cases, workflows, sequence diagrams', 'Epics, user stories, state diagrams, risk reports', 'Detailed design, code, data model|||Thiết kế chi tiết, code, mô hình dữ liệu'], 2, 'The component-test basis is the closest thing to the code: detailed design, code, data model and component specifications (slides 43 and 50). Use cases, workflows and sequence diagrams are the integration basis; epics, user stories, state diagrams and risk reports are the system basis.|||Test basis của component testing gần code nhất: thiết kế chi tiết, code, mô hình dữ liệu và đặc tả thành phần (slide 43 và 50). Use case, workflow, sequence diagram là test basis của integration; epic, user story, state diagram, báo cáo rủi ro là của system.'),
      q('Defect typically found in component testing? (s.51)|||Lỗi điển hình tìm thấy ở component testing? (s.51)', ['Incorrect sequencing/timing of interface calls|||Sai thứ tự/thời điểm gọi giao diện', 'Incorrect code and logic|||Sai code và logic', 'Incorrect control/data flows in the system|||Sai luồng điều khiển/dữ liệu trong hệ thống'], 1, 'Incorrect code and logic (and incorrect data flow inside a component) are typical component defects (slides 43 and 51). Wrong sequencing or timing of interface calls is an integration defect, and wrong control or data flows within the whole system are found in system testing.|||Sai code và logic (cùng luồng dữ liệu sai bên trong thành phần) là lỗi điển hình của component testing (slide 43 và 51). Sai thứ tự hay thời điểm gọi giao diện là lỗi integration, còn sai luồng điều khiển/dữ liệu trong cả hệ thống được tìm ở system testing.'),
      q('"Requirements converted to test cases before the software is developed, then repeatedly testing against all test cases" defines… (s.52)|||"Yêu cầu được chuyển thành test case trước khi phát triển, rồi liên tục test lại với toàn bộ test case" là định nghĩa của… (s.52)', ['Component testing', 'Test-driven development', 'Test levels'], 1, 'Writing the tests first from the requirements and then developing the code by repeatedly running all test cases is test-driven development (slides 44 and 52). Component testing is the level where TDD is usually applied, but the definition quoted is TDD itself, not the level.|||Viết test trước từ yêu cầu rồi phát triển code bằng cách liên tục chạy lại toàn bộ test case là test-driven development (slide 44 và 52). Component testing là cấp thường áp dụng TDD, nhưng định nghĩa được trích chính là TDD chứ không phải cấp test.'),
      q('Integration testing focuses on… (s.70)|||Integration testing tập trung vào… (s.70)', ['Testing code as early as possible|||Test code càng sớm càng tốt', 'Interactions between components or systems|||Tương tác giữa thành phần hoặc hệ thống', 'Functionality of each separate component|||Chức năng từng thành phần riêng'], 1, 'Integration testing focuses on interactions and interfaces between components or systems (slides 53 and 70). Testing each separate component is component testing, and testing code "as early as possible" describes early testing, not the focus of this level.|||Integration testing tập trung vào tương tác và giao diện giữa các thành phần hoặc hệ thống (slide 53 và 70). Test từng thành phần riêng là component testing, còn test code "càng sớm càng tốt" là nguyên tắc early testing, không phải trọng tâm của cấp này.'),
      q('Component integration testing is mostly done by (…) and system integration testing by (…). (s.71)|||Tích hợp thành phần chủ yếu do (…) làm và tích hợp hệ thống do (…) làm. (s.71)', ['developer – tester', 'tester – developer', 'tester – tester', 'tester – client'], 0, 'Slide 55: component integration testing is often the responsibility of developers, system integration testing generally of testers (slide 71). The 2023 deck still says designers or independent testers do integration in the small, but answer with the current syllabus.|||Slide 55: component integration testing thường là trách nhiệm của developer, còn system integration testing thường là của tester (slide 71). Bộ slide 2023 vẫn ghi người thiết kế hoặc tester độc lập làm integration in the small, nhưng đi thi hãy trả lời theo syllabus hiện hành.'),
      q('Test basis for integration testing? (s.72)|||Test basis cho integration testing? (s.72)', ['Epics, user stories, state diagrams, risk reports', 'Use cases, workflows, sequence diagrams', 'Detailed design, code, data model', 'System under test, forms, business processes'], 1, 'Use cases, workflows and sequence diagrams describe how parts interact, so they are the integration test basis, together with interface and communication-protocol specifications (slides 56 and 72). Detailed design, code and data model belong to component testing; epics, user stories and state diagrams to system testing.|||Use case, workflow và sequence diagram mô tả cách các phần tương tác, nên chúng là test basis của integration, cùng đặc tả giao diện và giao thức truyền thông (slide 56 và 72). Thiết kế chi tiết, code, mô hình dữ liệu thuộc component; epic, user story, state diagram thuộc system testing.'),
      q('Defect typically found in integration testing? (s.73)|||Lỗi điển hình ở integration testing? (s.73)', ['Incorrect code and logic|||Sai code và logic', 'Incorrect control/data flows within the system|||Sai luồng điều khiển/dữ liệu trong hệ thống', 'Incorrect sequencing or timing of interface calls|||Sai thứ tự hoặc thời điểm gọi giao diện', 'Contractual/regulatory requirements not met|||Không thoả hợp đồng/quy định'], 2, 'Incorrect sequencing or timing of interface calls is a typical integration defect (slides 56 and 73). Incorrect code and logic is found in component testing, wrong control/data flows within the whole system in system testing, and unmet contractual or regulatory requirements in acceptance testing.|||Sai thứ tự hoặc thời điểm gọi giao diện là lỗi điển hình của integration (slide 56 và 73). Sai code và logic được tìm ở component testing, sai luồng điều khiển/dữ liệu trong cả hệ thống ở system testing, còn không thoả hợp đồng/quy định ở acceptance testing.'),
      q('Which sentence about the scope of integration is correct? (s.74)|||Câu nào đúng về phạm vi tích hợp? (s.74)', ['Greater scope → easier to isolate defects|||Phạm vi càng lớn càng dễ cô lập lỗi', 'Smaller scope → harder to isolate|||Phạm vi càng nhỏ càng khó cô lập', 'Isolating defects is always difficult|||Cô lập lỗi luôn khó', 'Greater scope → harder to isolate defects|||Phạm vi càng lớn càng khó cô lập lỗi'], 3, 'The greater the scope of integration, the harder it is to isolate a defect to a specific component or system (slides 55 and 74), which is why incremental and continuous integration exist. Options A and B state the rule backwards, and isolation is not "always" difficult when steps are small.|||Phạm vi tích hợp càng lớn thì càng khó khoanh vùng defect vào một thành phần hay hệ thống cụ thể (slide 55 và 74), đó là lý do có tích hợp tăng dần và tích hợp liên tục. Phương án A và B nói ngược quy tắc, còn cô lập lỗi không phải "luôn" khó khi mỗi bước nhỏ.'),
      q('Correct definition of system testing? (s.78)|||Định nghĩa đúng của system testing? (s.78)', ['Testing separately testable components|||Test thành phần riêng', 'Testing the behaviour and capabilities of a whole system|||Test hành vi và năng lực của cả hệ thống', 'Testing interactions between components|||Test tương tác giữa thành phần'], 1, 'System testing focuses on the behaviour and capabilities of a whole system or product (slides 75 and 78). Testing separately testable components is component testing, and testing interactions between components is integration testing.|||System testing tập trung vào hành vi và năng lực của cả một hệ thống hay sản phẩm (slide 75 và 78). Test thành phần có thể test riêng là component testing, còn test tương tác giữa các thành phần là integration testing.'),
      q('System testing: 1 environment like production; 2 by independent testers relying on specifications; 3 finding defects is often not an objective. (s.79)|||System testing: 1 môi trường giống production; 2 do tester độc lập dựa vào đặc tả; 3 tìm lỗi thường không phải mục tiêu. (s.79)', ['1 & 3', '2 & 3', '1 & 2', '1, 2, 3'], 2, 'Slide 77: the system test environment should ideally correspond to production (1), and independent testers who rely heavily on specifications typically do system testing (2) (slide 79). Statement 3 is false here: "finding defects is often not an objective" is said about acceptance testing, not system testing.|||Slide 77: môi trường system test lý tưởng là giống production (1), và system testing thường do tester độc lập làm, dựa nhiều vào đặc tả (2) (slide 79). Câu 3 sai ở đây: "tìm lỗi thường không phải mục tiêu" là nói về acceptance testing, không phải system testing.'),
      q('Test basis of system testing? (s.80)|||Test basis của system testing? (s.80)', ['Detailed design, code, data model', 'Epics & user stories, state diagrams, risk analysis reports', 'Use cases, workflows, sequence diagrams'], 1, 'Epics and user stories, state diagrams and risk analysis reports are part of the system test basis, along with requirement specifications and use cases (slides 76 and 80). Detailed design, code and data model are the component basis; workflows and sequence diagrams point to integration.|||Epic và user story, state diagram và báo cáo phân tích rủi ro thuộc test basis của system testing, cùng đặc tả yêu cầu và use case (slide 76 và 80). Thiết kế chi tiết, code, mô hình dữ liệu là test basis của component; workflow và sequence diagram thuộc integration.'),
      q('A test object of system testing? (s.81)|||Đối tượng của system testing? (s.81)', ['Applications, operating systems|||Ứng dụng, hệ điều hành', 'Reports, forms|||Báo cáo, biểu mẫu', 'APIs, microservices'], 0, 'Typical system test objects are applications, hardware/software systems, operating systems and the system under test itself (slides 76 and 81). Reports and forms are acceptance-test objects, and APIs and microservices are integration-test objects.|||Đối tượng điển hình của system testing là ứng dụng, hệ thống phần cứng/phần mềm, hệ điều hành và chính hệ thống đang test (slide 76 và 81). Báo cáo, biểu mẫu là đối tượng của acceptance testing, còn API và microservice là đối tượng của integration testing.'),
      q('Similarity between system and acceptance testing? (s.92)|||Điểm giống giữa system và acceptance testing? (s.92)', ['Same test objects|||Cùng đối tượng test', 'Same test basis|||Cùng test basis', 'Both focus on the behaviour and capabilities of a whole system|||Cả hai tập trung vào hành vi và năng lực cả hệ thống'], 2, 'Both levels focus on the behaviour and capabilities of a whole system or product (slides 75, 82 and 92). Their test objects and test bases differ: system testing works from specifications, acceptance testing from business processes, user requirements, contracts and regulations.|||Cả hai cấp đều tập trung vào hành vi và năng lực của cả hệ thống hay sản phẩm (slide 75, 82 và 92). Đối tượng và test basis của chúng khác nhau: system testing dựa vào đặc tả, acceptance testing dựa vào quy trình nghiệp vụ, yêu cầu người dùng, hợp đồng và quy định.'),
      q('Many defects reported during acceptance testing indicate… (s.93)|||Có quá nhiều lỗi ở giai đoạn acceptance cho thấy… (s.93)', ['A good situation: quality is increasing|||Tốt: chất lượng đang tăng', 'A bad situation: finding defects is often not an acceptance objective; many defects may be a major project risk|||Xấu: tìm lỗi thường không phải mục tiêu của acceptance; nhiều lỗi có thể là rủi ro lớn'], 1, 'Finding defects is often not an objective of acceptance testing, and a significant number of defects there may be considered a major project risk, because they should have been found earlier (slides 83 and 93). Many late defects do not mean quality is increasing.|||Tìm lỗi thường không phải mục tiêu của acceptance testing, và nhiều lỗi ở cấp này có thể bị xem là rủi ro lớn của dự án, vì lẽ ra phải tìm thấy từ trước (slide 83 và 93). Nhiều lỗi ở giai đoạn cuối không có nghĩa là chất lượng đang tăng.'),
      q('Test basis of acceptance testing? (s.94)|||Test basis của acceptance testing? (s.94)', ['Regulations, legal contracts and standards|||Quy định, hợp đồng pháp lý, tiêu chuẩn', 'State diagrams', 'Workflows'], 0, 'Regulations, legal contracts and standards are part of the acceptance test basis, together with business processes and user requirements (slides 90 and 94). State diagrams belong to the system basis and workflows to the integration basis in this deck.|||Quy định, hợp đồng pháp lý và tiêu chuẩn thuộc test basis của acceptance testing, cùng quy trình nghiệp vụ và yêu cầu người dùng (slide 90 và 94). Trong bộ slide này, state diagram thuộc test basis của system, còn workflow thuộc integration.'),
      q('A defect found in acceptance testing? (s.95)|||Lỗi tìm thấy ở acceptance testing? (s.95)', ['Failure to carry out end-to-end tasks|||Không hoàn thành tác vụ đầu-cuối', 'Business rules not implemented correctly|||Luật nghiệp vụ cài sai', 'Interface mismatch|||Giao diện không khớp'], 1, 'Business rules not implemented correctly is a typical acceptance defect, along with workflows not meeting business needs and unmet contracts (slides 90 and 95). Failure to carry out end-to-end tasks is a system-testing defect, and interface mismatch is found in integration testing.|||Luật nghiệp vụ cài sai là lỗi điển hình của acceptance testing, cùng với workflow không đáp ứng nhu cầu nghiệp vụ và không thoả hợp đồng (slide 90 và 95). Không hoàn thành tác vụ đầu-cuối là lỗi của system testing, còn giao diện không khớp được tìm ở integration testing.'),
      q('System administrators testing in a simulated production environment is… (s.96)|||Quản trị hệ thống test trong môi trường production mô phỏng là… (s.96)', ['UAT', 'OAT', 'Contractual & regulatory AT', 'Alpha & beta'], 1, 'Operational acceptance testing is done by operations or system administration staff, usually in a simulated production environment, and checks backup/restore, installation, disaster recovery and similar tasks (slides 87 and 96). UAT is done by end users against business processes.|||Operational acceptance testing do nhân viên vận hành hoặc quản trị hệ thống thực hiện, thường trong môi trường production mô phỏng, và kiểm backup/restore, cài đặt, khôi phục thảm hoạ và các việc tương tự (slide 87 và 96). UAT do người dùng cuối làm theo quy trình nghiệp vụ.'),
      q('COTS vendors getting feedback from users before market release use… (s.97)|||Hãng phần mềm đóng gói lấy phản hồi người dùng trước khi ra thị trường dùng… (s.97)', ['UAT', 'OAT', 'Contractual & regulatory AT', 'Alpha & beta testing'], 3, 'Alpha and beta testing are used by developers of commercial off-the-shelf software to get feedback from potential or existing users before the product is put on the market (slides 89 and 97). UAT validates fitness for use for a specific customer\'s users, not for a whole market.|||Alpha và beta testing được hãng phát triển phần mềm đóng gói (COTS) dùng để lấy phản hồi từ người dùng tiềm năng hoặc hiện tại trước khi đưa sản phẩm ra thị trường (slide 89 và 97). UAT validate mức phù hợp sử dụng cho người dùng của một khách hàng cụ thể, không phải cả thị trường.'),
      q('Validating fitness for use by intended users in a real/simulated environment is… (s.98)|||Validate mức phù hợp sử dụng bởi người dùng dự kiến trong môi trường thật/mô phỏng là… (s.98)', ['User acceptance testing', 'Operational acceptance testing', 'Contractual & regulatory AT', 'Alpha & beta testing'], 0, 'This is the definition of user acceptance testing: intended users validate that they can do their work with the system in a real or simulated operational environment (slides 84 and 98). OAT is done by administrators, and alpha/beta targets a market of users for COTS products.|||Đây là định nghĩa của user acceptance testing: người dùng dự kiến validate rằng họ làm được việc của mình với hệ thống trong môi trường vận hành thật hoặc mô phỏng (slide 84 và 98). OAT do quản trị hệ thống làm, còn alpha/beta nhắm tới người dùng của cả thị trường cho sản phẩm COTS.'),
      q('Which level focuses on building confidence more than finding defects? (s.99)|||Cấp nào tập trung tạo niềm tin hơn là tìm lỗi? (s.99)', ['Unit', 'Integration', 'System', 'Acceptance'], 3, 'Acceptance testing aims first at establishing confidence in the whole system, and finding defects is often not an objective there (slides 83, 90 and 99). Unit, integration and system testing all list finding defects among their objectives.|||Acceptance testing trước hết nhằm tạo niềm tin vào cả hệ thống, và tìm lỗi thường không phải mục tiêu ở đó (slide 83, 90 và 99). Unit, integration và system testing đều có tìm lỗi trong danh sách mục tiêu.'),
      q('In which level are developers most heavily involved? (s.100)|||Developer tham gia nhiều nhất ở cấp nào? (s.100)', ['Compatible', 'Acceptance', 'Component', 'Conversion'], 2, 'Component testing is usually done by the developer who wrote the code, with access to it (slides 43 and 100). Acceptance testing is done by users, customers or operators; "compatible" and "conversion" are not test levels at all.|||Component testing thường do chính developer viết code thực hiện, vì họ có quyền truy cập code (slide 43 và 100). Acceptance testing do người dùng, khách hàng hoặc người vận hành làm; còn "compatible" và "conversion" hoàn toàn không phải cấp test.'),
      q('Which comparison of component (C.T) and system testing (S.T) is true? (s.101–102)|||So sánh nào giữa component (C.T) và system testing (S.T) là đúng? (s.101–102)', ['C.T verifies modules; S.T verifies interfaces between components|||C.T kiểm module; S.T kiểm giao diện giữa thành phần', 'C.T cases come from component/design specs and data models; S.T cases from requirement/functional specs and use cases|||Test case C.T lấy từ đặc tả thành phần/thiết kế, mô hình dữ liệu; S.T từ đặc tả yêu cầu/chức năng, use case', 'C.T is functional only; S.T functional and non-functional|||C.T chỉ chức năng; S.T cả hai', 'C.T by technical testers; S.T by users|||C.T do tester kỹ thuật; S.T do người dùng'], 1, 'The true difference is the test basis: component test cases come from component and design specifications or data models, system test cases from requirement and functional specifications or use cases (slides 101–102). Interfaces between components are integration testing, and component testing can include non-functional tests too.|||Khác biệt đúng nằm ở test basis: test case của component lấy từ đặc tả thành phần, đặc tả thiết kế hoặc mô hình dữ liệu; của system lấy từ đặc tả yêu cầu, đặc tả chức năng hoặc use case (slide 101–102). Giao diện giữa các thành phần là integration testing, và component testing cũng có thể có test phi chức năng.'),
      q('Use cases are a test basis for which level? (s.103)|||Use case là test basis cho cấp nào? (s.103)', ['Unit', 'System', 'Load and performance', 'Usability'], 1, 'Use cases describe end-to-end interactions with the whole system, so they are a system (and acceptance) test basis (slides 76 and 103). "Load and performance" and "usability" are test types, not levels, and unit tests work from detailed design and code.|||Use case mô tả tương tác đầu-cuối với cả hệ thống, nên chúng là test basis của system (và acceptance) testing (slide 76 và 103). "Load and performance" và "usability" là loại test chứ không phải cấp, còn unit test dựa vào thiết kế chi tiết và code.'),
      q('A characteristic of a well-managed test level? (s.104)|||Đặc điểm của một cấp test được quản lý tốt? (s.104)', ['Target duration of one month|||Thời lượng mục tiêu một tháng', 'It has a corresponding test objective|||Có mục tiêu test tương ứng', 'It does not overlap with other levels|||Không chồng với cấp khác', 'It applies a single technique|||Chỉ dùng một kỹ thuật'], 1, 'Each test level should have test objectives specific to that level, one of the characteristics of good testing on slide 4 (slide 104). Levels may overlap, can use several techniques, and have no fixed target duration such as one month.|||Mỗi cấp test phải có mục tiêu test riêng cho cấp đó, một trong các đặc điểm của kiểm thử tốt ở slide 4 (slide 104). Các cấp có thể chồng nhau, có thể dùng nhiều kỹ thuật, và không có thời lượng cố định kiểu một tháng.'),
      q('Where is alpha testing typically performed? (s.105)|||Alpha testing thường diễn ra ở đâu? (s.105)', ["User's end|||Phía người dùng", "Developer's end|||Phía bên phát triển", 'Both ends|||Cả hai phía', 'None of the above|||Không phải các ý trên'], 1, 'Alpha testing is performed at the developing organisation\'s site (the developer\'s end), beta testing by users at their own locations (slides 89 and 105). "Both ends" mixes the two: beta is the part that happens at the user\'s end.|||Alpha testing diễn ra tại nơi của tổ chức phát triển (phía developer), còn beta testing do người dùng làm tại chỗ của họ (slide 89 và 105). "Cả hai phía" là gộp hai loại lại: beta mới là phần diễn ra ở phía người dùng.'),
      q('In top-down integration, lower components not yet integrated are replaced by…|||Trong tích hợp top-down, thành phần phía dưới chưa tích hợp được thay bằng…', ['Drivers', 'Stubs', 'The real database|||CSDL thật', 'Nothing|||Không cần gì'], 1, 'Top-down starts at the top of the call tree; the integrated components call lower components that are not integrated yet, and stubs simulate them (slides 59–60). Drivers are the classic trap: a driver calls the code under test from above, which is what bottom-up needs.|||Top-down bắt đầu từ đỉnh cây gọi; các thành phần đã tích hợp gọi xuống những thành phần dưới chưa tích hợp, và stub mô phỏng chúng (slide 59–60). Driver là bẫy kinh điển: driver gọi code đang test từ phía trên, đó là thứ bottom-up cần.'),
      q('Which integration strategy needs drivers to call the baseline?|||Chiến lược tích hợp nào cần driver để gọi baseline?', ['Top-down', 'Bottom-up', 'Minimum capability (top-down)', 'None|||Không chiến lược nào'], 1, 'Bottom-up integration starts at the leaves, so nothing calls the baseline yet and a driver must call it (slides 62–63). Top-down and minimum capability done top-down need stubs instead, and should not need drivers (slide 65).|||Tích hợp bottom-up bắt đầu từ lá, nên chưa có gì gọi baseline và phải có driver gọi nó (slide 62–63). Top-down và minimum capability làm từ trên xuống thì cần stub, và không cần driver (slide 65).'),
      q('Checking that the checkout page responds within 2 s for 1,000 users is…|||Kiểm trang thanh toán trả lời trong 2 giây với 1.000 người dùng là…', ['Functional testing', 'Non-functional (performance/load) testing', 'White-box testing', 'Confirmation testing'], 1, 'Response time under load is about how well the system behaves, not what it does, so it is non-functional (performance/load) testing, usually at system level (slides 113 and 115). Functional testing checks what the page does, for example that the order total is correct.|||Thời gian phản hồi khi tải lớn là về việc hệ thống chạy tốt tới đâu, không phải nó làm gì, nên đây là non-functional (performance/load) testing, thường ở cấp system (slide 113 và 115). Functional testing kiểm trang làm gì, ví dụ tổng tiền đơn hàng có đúng không.'),
      q('Re-running the reproduction steps of a fixed defect on the new build is…|||Chạy lại các bước tái hiện của một lỗi đã sửa trên bản build mới là…', ['Regression testing', 'Confirmation testing', 'Smoke testing', 'Exploratory testing'], 1, 'Confirmation testing (re-testing) re-executes the steps that reproduced the failure, on the new version, to confirm the original defect is fixed (slide 126). Regression testing is the tempting wrong answer: it looks for unintended side-effects elsewhere after the change (slides 127–128).|||Confirmation testing (re-testing) chạy lại các bước đã tái hiện failure trên phiên bản mới, để khẳng định lỗi ban đầu đã được sửa (slide 126). Regression testing là đáp án dễ nhầm: nó tìm tác dụng phụ ngoài ý muốn ở chỗ khác sau thay đổi (slide 127–128).'),
      q('Which is NOT a trigger for maintenance testing?|||Đâu KHÔNG phải tác nhân kích hoạt kiểm thử bảo trì?', ['Modification|||Sửa đổi', 'Migration|||Chuyển đổi', 'Retirement|||Ngừng sử dụng', 'Initial development of a brand-new system|||Phát triển lần đầu một hệ thống mới hoàn toàn'], 3, 'Maintenance testing is triggered by modification, migration and retirement of a system already in operation (slide 133). The initial development of a brand-new system is ordinary testing across the test levels, not maintenance; retirement counts because data archiving and restoring must be tested.|||Kiểm thử bảo trì được kích hoạt bởi sửa đổi, chuyển đổi và ngừng sử dụng một hệ thống đang vận hành (slide 133). Phát triển lần đầu một hệ thống mới là kiểm thử bình thường qua các cấp test, không phải bảo trì; ngừng sử dụng vẫn tính vì phải test việc lưu trữ và khôi phục dữ liệu.'),
      q('Without a specification you can…|||Không có đặc tả thì bạn có thể…', ['verify but not validate|||verify nhưng không validate', 'validate but not verify|||validate nhưng không verify', 'neither|||không làm được gì', 'both fully|||làm đầy đủ cả hai'], 1, 'Verification checks against a specification, so without one you cannot verify; you can still validate against what users need, using current behaviour, manuals or the users themselves as the reference (slides 134–135). "Neither" is too strong, because validation remains possible.|||Verification là kiểm so với đặc tả, nên không có đặc tả thì không verify được; nhưng vẫn validate được so với nhu cầu người dùng, dựa vào hành vi hiện tại, tài liệu hướng dẫn hoặc hỏi chính người dùng (slide 134–135). "Không làm được gì" là quá mức, vì validation vẫn làm được.'),
      q('Which IEEE 829 test-plan section records the reasons some features are excluded?|||Mục nào trong test plan IEEE 829 ghi lý do loại trừ một số tính năng?', ['Approach', 'Features not to be tested', 'Suspension & resumption criteria', 'Test items'], 1, 'Item 5, "Features not to be tested", lists the excluded features and the reasons for excluding them, which protects the team when someone later asks why X was not tested (slide 139). Approach describes how testing will be done, not what is left out.|||Mục 5, "Features not to be tested", liệt kê các tính năng không test và lý do loại trừ, giúp bảo vệ nhóm khi sau này có người hỏi vì sao X không được test (slide 139). Approach mô tả cách thức kiểm thử, không phải phần bị bỏ ra.'),
      q('In Overview.xlsx, the basis for Component Integration Testing (CIT) is…|||Trong Overview.xlsx, cơ sở cho Component Integration Testing (CIT) là…', ['The SRS', 'The ADD and detailed design (sequence diagrams)|||ADD và thiết kế chi tiết (sequence diagram)', 'Class specifications only|||Chỉ đặc tả lớp', 'Business processes|||Quy trình nghiệp vụ'], 1, 'In the Overview.xlsx table (lesson 2.6) the CIT row uses the architectural design document (ADD) and detailed design with sequence diagrams as its basis. The SRS is the basis for system testing, and class specifications alone are the basis for component (unit) testing.|||Trong bảng Overview.xlsx (bài 2.6), dòng CIT lấy tài liệu thiết kế kiến trúc (ADD) và thiết kế chi tiết có sequence diagram làm cơ sở. SRS là cơ sở của system testing, còn chỉ đặc tả lớp là cơ sở của component (unit) testing.'),
      q('Early test design in the V-model means…|||Thiết kế test sớm trong V-model nghĩa là…', ['designing tests on the left arm as each document is produced|||thiết kế test ở nhánh trái khi từng tài liệu ra đời', 'running tests before coding|||chạy test trước khi code', 'skipping reviews|||bỏ qua review', 'testing only at acceptance|||chỉ test ở acceptance'], 0, 'Early test design means designing the tests for each level on the left arm, as soon as the matching document is produced, which finds faults early and stops fault multiplication (slides 10–11). The tests are still executed after coding; "running tests before coding" confuses design with execution.|||Thiết kế test sớm là thiết kế test cho từng cấp ở nhánh trái, ngay khi tài liệu tương ứng ra đời, giúp tìm lỗi sớm và chặn lỗi nhân lên (slide 10–11). Test vẫn được chạy sau khi code; "chạy test trước khi code" là lẫn thiết kế với thực thi.'),
      q("Kanban's key principle is…|||Nguyên tắc chính của Kanban là…", ['fixed 2-week sprints|||sprint cố định 2 tuần', 'a limit on work in progress (WIP)|||giới hạn số việc đang làm (WIP)', 'a daily build|||build hằng ngày', 'pair programming|||lập trình cặp'], 1, 'The key principle of Kanban is a limit on work in progress (WIP) on the board (slide 20). Fixed 2-week sprints are a Scrum trait; Kanban works with or without fixed-length iterations, and daily builds or pair programming are not specific to it.|||Nguyên tắc chính của Kanban là giới hạn số việc đang làm (WIP) trên bảng (slide 20). Sprint cố định 2 tuần là đặc trưng của Scrum; Kanban chạy có hoặc không có vòng lặp cố định, còn build hằng ngày hay lập trình cặp không phải đặc trưng riêng của nó.'),
      // Lesson 2.7 — the 2023 deck (oswt2). explanation is plain text EN|||VI.
      { ...q('In the five-level V-model of the 2023 SWT2 deck, "integration testing in the large" corresponds in CTFL v4.0 to… (SWT2 2023 p.4)|||Trong V-model năm cấp của bộ SWT2 2023, "integration testing in the large" tương ứng với gì trong CTFL v4.0? (SWT2 2023 tr.4)', ['Component integration testing', 'System integration testing', 'System testing', 'Acceptance testing'], 1),
        explanation: 'In the small = component integration (inside one system); in the large = system integration (the system with other systems, networks and packages). In the old V it sits above system testing.|||In the small = component integration (bên trong một hệ thống); in the large = system integration (hệ thống cùng các hệ thống, mạng, gói phần mềm khác). Trên chữ V cũ nó nằm trên system testing.' },
      { ...q('In the 2023 hypothetical cost (£50 per hour), a fault found by a user costs the developers 20 h = £1,000, of which debugging took 0.5 h. What share of the developer cost is the debug itself? (p.17–18)|||Trong ví dụ chi phí giả định của bộ 2023 (£50/giờ), một lỗi do người dùng phát hiện tốn developer 20 giờ = £1.000, trong đó debug mất 0,5 giờ. Debug chiếm bao nhiêu phần chi phí developer? (tr.17–18)', ['2.5%|||2,5%', '14%', '25%', '50%'], 0),
        explanation: '0.5 h × £50 = £25, and £25 / £1,000 = 2.5%. The rest is process: receiving, assigning, regression testing (8 h = £400), documentation and admin.|||0,5 giờ × £50 = £25, và £25 / £1.000 = 2,5%. Phần còn lại là quy trình: tiếp nhận, phân công, regression test (8 giờ = £400), tài liệu và hành chính.' },
      { ...q('Per BS 7925-2 (SWT2 2023 p.37), which item is NOT part of a component test case?|||Theo BS 7925-2 (SWT2 2023 tr.37), mục nào KHÔNG thuộc một component test case?', ['Objective|||Mục tiêu', 'Initial state of the component|||Trạng thái ban đầu của thành phần', 'Expected outcome|||Kết quả mong đợi', 'Actual outcome|||Kết quả thực tế'], 3),
        explanation: 'A test case = objective, initial state, input, expected outcome. The actual outcome is written down later, during component test recording, and compared with the expected one.|||Test case = mục tiêu, trạng thái ban đầu, đầu vào, kết quả mong đợi. Kết quả thực tế được ghi sau, ở bước ghi nhận, rồi so với kết quả mong đợi.' },
      { ...q('In the BS 7925-2 component test process, the records show the branch-coverage completion criterion is not met. What may you need to repeat? (SWT2 2023 p.40)|||Trong quy trình component test BS 7925-2, hồ sơ cho thấy chưa đạt tiêu chí branch coverage. Bạn có thể phải làm lại bước nào? (SWT2 2023 tr.40)', ['Nothing: report the coverage and stop|||Không gì cả: báo coverage rồi dừng', 'Component test specification, to design extra (e.g. white-box) test cases|||Đặc tả component test, để thiết kế thêm test case (vd white-box)', 'Only component test recording|||Chỉ bước ghi nhận', 'The organisation-wide component test strategy|||Chiến lược component test của cả tổ chức'], 1),
        explanation: 'If the criteria are not met, test activities are repeated; often you go back to specification to design test cases for the uncovered branches, then execute and record them.|||Chưa đạt tiêu chí thì làm lại các hoạt động test; thường phải quay về bước đặc tả để thiết kế test case cho các nhánh chưa phủ, rồi chạy và ghi nhận chúng.' },
      { ...q('Contract acceptance testing is performed against… (SWT2 2023 p.75)|||Acceptance theo hợp đồng được thực hiện so với… (SWT2 2023 tr.75)', ['The contract and any documented agreed changes|||Hợp đồng và các thay đổi đã thoả thuận bằng văn bản', 'What the users now wish they had asked for|||Điều người dùng bây giờ ước gì đã yêu cầu', 'The latest user stories in the backlog|||Các user story mới nhất trong backlog', 'The source code|||Mã nguồn'], 0),
        explanation: '"This system, not wish system": acceptance is judged against the agreed contract plus documented changes. Undocumented wishes are change requests, not acceptance criteria.|||"Hệ thống này, không phải hệ thống mơ ước": nghiệm thu dựa trên hợp đồng đã ký cộng các thay đổi có văn bản. Mong muốn chưa ghi lại là yêu cầu thay đổi, không phải tiêu chí nghiệm thu.' },
      { ...q('According to the 2023 deck, alpha and beta testing are NOT suitable for… (SWT2 2023 p.76)|||Theo bộ 2023, alpha và beta testing KHÔNG phù hợp với… (SWT2 2023 tr.76)', ['Bespoke (custom-built) software|||Phần mềm đặt làm riêng (bespoke)', 'Commercial off-the-shelf (COTS) products|||Sản phẩm đóng gói (COTS)', 'Mobile apps sold in an app store|||Ứng dụng di động bán trên kho ứng dụng', 'Games|||Trò chơi'], 0),
        explanation: 'Alpha and beta need testers who represent a market. Bespoke software has one customer, who uses UAT or contract acceptance testing instead.|||Alpha và beta cần người test đại diện cho một thị trường. Phần mềm bespoke chỉ có một khách hàng, họ dùng UAT hoặc acceptance theo hợp đồng.' },
    ],
  },
};

export default {
  title: 'Chapter 2 — Testing throughout the SDLC|||Chương 2 — Kiểm thử xuyên suốt SDLC',
  description: 'SWT2 (143 slide) học từng slide: mô hình SDLC, 4 cấp test (component/integration/system/acceptance, stub & driver), 4 loại test, kiểm thử bảo trì, test plan IEEE 829, và bảng Overview.xlsx — kèm đáp án mọi câu hỏi trên slide; bài 2.7 bổ sung 31 trang từ bộ slide 2023.',
  lessons: [L21, L22, L23, L24, L25, L26, L27, QUIZ2],
};
