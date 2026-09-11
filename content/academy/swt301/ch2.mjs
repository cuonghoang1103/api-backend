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
<div class="callout"><b>Learning objectives.</b> LO-2.1.1 Explain the relationships between software development activities and test activities in the lifecycle (K2) · LO-2.1.2 Identify reasons why lifecycle models must be adapted to the context of project and product characteristics (K1). Chapter 2 carries <b>5 of 40</b> exam questions.</div>
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
<div class="callout"><b>Chuẩn đầu ra.</b> LO-2.1.1 Giải thích quan hệ giữa hoạt động phát triển và hoạt động kiểm thử trong vòng đời (K2) · LO-2.1.2 Nêu lý do mô hình vòng đời phải được điều chỉnh theo ngữ cảnh dự án và sản phẩm (K1). Chương 2 chiếm <b>5/40</b> câu trong đề.</div>
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
      [1, 'Testing throughout the Software Life Cycle (cover)', `<p>Chapter 2 of the six-box map ("2 Lifecycle" highlighted).</p>`, `<p>Chương 2 trong sơ đồ sáu ô (ô "2 Lifecycle" được tô).</p>`],
      [2, 'CONTENT', `<p>Four blocks: SDLC models (this lesson) · Test levels (2.2–2.3) · Test types (2.4) · Maintenance testing (2.5).</p>`, `<p>Bốn khối: mô hình SDLC (bài này) · Các cấp test (2.2–2.3) · Các loại test (2.4) · Kiểm thử bảo trì (2.5).</p>`],
      [3, 'Software Development Lifecycle',
        `<p>A lifecycle model describes the <strong>types of activity</strong> performed at each stage of a software project and how they relate <strong>logically and chronologically</strong>. The wheel shows the usual six: planning → analysis → design → implementation → testing &amp; integration → maintenance.</p>`,
        `<p>Mô hình vòng đời mô tả <strong>các loại hoạt động</strong> ở từng giai đoạn của dự án phần mềm và chúng liên hệ với nhau thế nào <strong>về logic lẫn thời gian</strong>. Bánh xe có sáu bước quen thuộc: lập kế hoạch → phân tích → thiết kế → cài đặt → kiểm thử &amp; tích hợp → bảo trì.</p>`],
      [4, 'Characteristics of good testing (any lifecycle)',
        `<p>Four rules that apply to every model — memorise them, a question always comes: (1) for <strong>every development activity there is a corresponding test activity</strong>; (2) each <strong>test level has objectives specific to that level</strong>; (3) test analysis and design for a level <strong>begin during the corresponding development activity</strong> (not after it); (4) testers take part in <strong>discussions to define and refine requirements and design</strong> and in reviewing work products.</p>`,
        `<p>Bốn quy tắc đúng với mọi mô hình — phải thuộc, đề chắc chắn hỏi: (1) <strong>mỗi hoạt động phát triển có một hoạt động kiểm thử tương ứng</strong>; (2) mỗi <strong>cấp test có mục tiêu riêng của cấp đó</strong>; (3) phân tích và thiết kế test cho một cấp <strong>bắt đầu ngay trong hoạt động phát triển tương ứng</strong> (không đợi làm xong); (4) tester <strong>tham gia thảo luận để xác định, làm mịn yêu cầu và thiết kế</strong>, và review các sản phẩm công việc.</p>`],
      [5, 'SDLC models: sequential vs iterative & incremental',
        `<p>The two families the syllabus names. Everything on the next slides belongs to one of them.</p>`,
        `<p>Hai họ mô hình mà syllabus nêu tên. Mọi mô hình ở các slide sau đều thuộc một trong hai họ này.</p>`],
      [6, 'Sequential Development Models',
        `<p>A linear, sequential flow: any phase should begin when the previous one is complete. In theory there is no overlap; in practice early feedback from the following phase is beneficial.</p>`,
        `<p>Dòng chảy tuyến tính, tuần tự: pha nào cũng bắt đầu khi pha trước đã xong. Về lý thuyết không có chồng lấn; thực tế nhận phản hồi sớm từ pha sau là có lợi.</p>`],
      [7, 'Waterfall Model',
        `<p>Requirements → design → development → testing → deployment → maintenance, one after another. <strong>Testing happens towards the end</strong>, so defects are found close to the go-live date, and feedback flowing "back up the waterfall" is difficult and expensive (the speaker notes repeat the same three points).</p>`,
        `<p>Yêu cầu → thiết kế → phát triển → kiểm thử → triển khai → bảo trì, lần lượt từng pha. <strong>Kiểm thử diễn ra ở cuối vòng đời</strong>, nên lỗi được phát hiện sát ngày go-live, và việc đưa phản hồi "ngược lên thác nước" rất khó và tốn kém (ghi chú của thầy/cô nhắc lại đúng ba ý này).</p>`],
      [8, 'V-Model: test levels',
        `<p>The V pairs each development level on the left with a test level on the right: user requirements ↔ <strong>acceptance testing</strong>; software specifications ↔ <strong>system testing</strong>; high-level design ↔ <strong>integration testing</strong>; detailed design ↔ <strong>component testing</strong>; implementation at the bottom. Requirements and design are on the left arm, development at the bottom, testing (orange) on the right arm.</p>`,
        `<p>Chữ V ghép mỗi mức phát triển bên trái với một cấp test bên phải: yêu cầu người dùng ↔ <strong>acceptance testing</strong>; đặc tả phần mềm ↔ <strong>system testing</strong>; thiết kế tổng thể ↔ <strong>integration testing</strong>; thiết kế chi tiết ↔ <strong>component testing</strong>; cài đặt ở đáy. Yêu cầu và thiết kế nằm nhánh trái, phát triển ở đáy, kiểm thử (màu cam) ở nhánh phải.</p>`],
      [9, 'V-Model: late test design',
        `<p>If tests for every level are <strong>designed</strong> only when you reach the right arm ("Design tests?" at the bottom right), you get the waterfall's problem back: the test basis is never checked until the code exists.</p>`,
        `<p>Nếu test cho từng cấp chỉ được <strong>thiết kế</strong> khi đã tới nhánh phải ("Design tests?" ở góc dưới phải), bạn lại gặp đúng vấn đề của waterfall: test basis không được kiểm tra cho tới khi đã có code.</p>`],
      [10, 'V-Model: early test design',
        `<p>The correct use of the V: <strong>design tests</strong> on the left, as soon as each requirement or design document exists, and <strong>run tests</strong> on the right. This is Principle 3 (early testing) applied to the lifecycle.</p>`,
        `<p>Cách dùng đúng của chữ V: <strong>thiết kế test</strong> ở nhánh trái, ngay khi có từng tài liệu yêu cầu/thiết kế, và <strong>chạy test</strong> ở nhánh phải. Đó là Nguyên tắc 3 (kiểm thử sớm) áp vào vòng đời.</p>`],
      [11, 'Early test design',
        `<p>Why it pays: test design itself finds faults; faults found early are cheaper; the most significant faults are found first; faults are prevented, not built in; it needs no extra effort, only re-scheduling test design earlier; and it may cause requirement changes (a good thing). Box: <em>early test design helps to build quality and stops fault multiplication</em>. The deck's hidden slides tell a real story — see the box after the walkthrough.</p>`,
        `<p>Vì sao đáng làm: chính việc thiết kế test tìm ra lỗi; lỗi tìm sớm rẻ hơn; lỗi quan trọng nhất được tìm trước; lỗi được ngăn chứ không bị "xây vào"; không tốn thêm công, chỉ dời việc thiết kế test lên sớm; và có thể khiến yêu cầu phải sửa (đó là điều tốt). Khung hồng: <em>thiết kế test sớm giúp xây chất lượng và chặn lỗi nhân lên</em>. Các slide ẩn kể một câu chuyện có thật — xem khung sau phần slide.</p>`],
      [12, 'VV&T — verification, validation, testing (BS 7925-1)',
        `<p>Formal definitions: <strong>verification</strong> = evaluating whether the products of a development phase satisfy the conditions imposed at the <em>start</em> of that phase; <strong>validation</strong> = determining correctness with respect to the <em>user needs and requirements</em>; <strong>testing</strong> = exercising software to verify it satisfies requirements, is fit for purpose and to detect faults.</p>`,
        `<p>Định nghĩa chính thức: <strong>verification</strong> = đánh giá sản phẩm của một pha có thoả điều kiện đặt ra ở <em>đầu</em> pha đó không; <strong>validation</strong> = xác định tính đúng đắn so với <em>nhu cầu và yêu cầu của người dùng</em>; <strong>testing</strong> = chạy phần mềm để verify nó thoả yêu cầu, phù hợp mục đích và để phát hiện lỗi.</p>`],
      [13, 'Verification, validation and testing on the V',
        `<p>Any work product (the red box) can be <em>verified</em> against the phase that produced it (the loop), <em>validated</em> against the user's needs (arrow up) and <em>tested</em> (arrow right). On the small V: horizontal links are verification between matching levels; the green arrows climbing the right arm lead to validation at the top.</p>`,
        `<p>Mỗi sản phẩm công việc (ô đỏ) có thể được <em>verify</em> so với pha tạo ra nó (vòng lặp), <em>validate</em> so với nhu cầu người dùng (mũi tên lên) và <em>test</em> (mũi tên sang phải). Trên chữ V nhỏ: các đường ngang là verification giữa hai mức tương ứng; mũi tên xanh leo dọc nhánh phải dẫn tới validation ở đỉnh.</p>`],
      [14, 'Incremental Development Models',
        `<p>Requirements, design, build and test are done <strong>in pieces</strong>; features grow incrementally. Increments vary in size — some methods use large pieces, others as small as one UI change or a new query option. Working parts of the system are produced early, and each can be released to the customer.</p>`,
        `<p>Yêu cầu, thiết kế, xây dựng và kiểm thử được làm <strong>theo từng phần</strong>; tính năng lớn dần theo từng đợt. Kích thước mỗi phần khác nhau — có phương pháp chia miếng lớn, có cái nhỏ tới mức một thay đổi trên màn hình hay một tuỳ chọn truy vấn mới. Các phần chạy được ra đời sớm và mỗi phần có thể giao cho khách hàng.</p>`],
      [15, 'Iterative Development Models',
        `<p>Start with a rough product and <strong>refine it iteratively</strong> (rework strategy). Iterations may change earlier features and the scope; officially only the final version is delivered, in practice intermediate versions go to selected customers for feedback. Each iteration delivers working software that is a growing subset of the features.</p>`,
        `<p>Bắt đầu bằng một sản phẩm thô rồi <strong>tinh chỉnh dần qua các vòng lặp</strong> (chiến lược làm lại). Vòng lặp sau có thể sửa tính năng của vòng trước và cả phạm vi; chính thức chỉ bản cuối được giao, nhưng thực tế các bản trung gian được gửi cho một số khách hàng để lấy phản hồi. Mỗi vòng ra phần mềm chạy được, là một tập con tính năng lớn dần.</p>`],
      [16, 'Testing in incremental & iterative development',
        `<p>High-level test planning and analysis happen at the start of the project; <strong>detailed planning, analysis, design and implementation happen at the start of each iteration</strong>. Execution involves overlapping test levels; the same tasks are done with different timing and extent. Common issues: <strong>more regression testing</strong>, defects outside the scope of the current iteration, and less thorough testing.</p>`,
        `<p>Lập kế hoạch và phân tích test mức cao diễn ra lúc bắt đầu dự án; <strong>lập kế hoạch chi tiết, phân tích, thiết kế, triển khai test diễn ra đầu mỗi vòng lặp</strong>. Thực thi có các cấp test chồng lấn; cùng các việc nhưng khác thời điểm và mức độ. Vấn đề thường gặp: <strong>regression nhiều hơn</strong>, defect nằm ngoài phạm vi vòng hiện tại, và test kém kỹ hơn.</p>`],
      [17, 'Rational Unified Process (RUP) — the hump chart',
        `<p>Four phases (inception, elaboration, construction, transition) across the top, workflows (business modelling, requirements, analysis &amp; design, implementation, test, deployment, configuration &amp; change management, project management, environment) down the side, iterations along the bottom. The coloured humps show how much of each workflow happens in each phase — notice that <em>test</em> is present in every phase, not only at the end.</p>`,
        `<p>Bốn pha (inception, elaboration, construction, transition) ở trên, các luồng công việc (mô hình nghiệp vụ, yêu cầu, phân tích &amp; thiết kế, cài đặt, kiểm thử, triển khai, quản lý cấu hình &amp; thay đổi, quản lý dự án, môi trường) dọc bên trái, các vòng lặp ở dưới. Các "bướu" màu cho thấy lượng công việc của từng luồng trong từng pha — để ý luồng <em>test</em> có mặt ở mọi pha, không chỉ ở cuối.</p>`],
      [18, 'RUP characteristics',
        `<p>Iterative, with <strong>risk as the primary driver</strong>; quality evaluation (including testing) is continuous. Iterations are <strong>relatively long (months)</strong> and increments correspondingly large (two or three groups of related features). Compare with Scrum on the next slide.</p>`,
        `<p>Lặp, lấy <strong>rủi ro làm động lực chính</strong> cho quyết định; đánh giá chất lượng (gồm kiểm thử) diễn ra liên tục. Vòng lặp <strong>tương đối dài (vài tháng)</strong> và mỗi phần tăng tương ứng lớn (hai, ba nhóm tính năng liên quan). So sánh với Scrum ở slide sau.</p>`],
      [19, 'Scrum',
        `<p>Product backlog → sprint planning → sprint backlog → a 1–4 week sprint with a 24-hour daily stand-up → finished work, sprint review and retrospective. Iterations are <strong>short (days to a few weeks)</strong> and increments small (a few enhancements and/or two or three features).</p>`,
        `<p>Product backlog → họp lập kế hoạch sprint → sprint backlog → một sprint 1–4 tuần với họp đứng hằng ngày → sản phẩm hoàn thành, sprint review và retrospective. Vòng lặp <strong>ngắn (vài ngày tới vài tuần)</strong> và phần tăng nhỏ (vài cải tiến và/hoặc hai, ba tính năng).</p>`],
      [20, 'Kanban',
        `<p>A board of columns (analysis, design, develop, testing, UAT &amp; SIT, deploy) fed from a prioritised queue. Kanban can run <strong>with or without fixed-length iterations</strong>, delivering one feature at a time or batching several. Its key principle is a <strong>limit on work in progress (WIP)</strong>.</p>`,
        `<p>Bảng các cột (phân tích, thiết kế, phát triển, kiểm thử, UAT &amp; SIT, triển khai) lấy việc từ một hàng đợi đã ưu tiên. Kanban có thể chạy <strong>có hoặc không có vòng lặp độ dài cố định</strong>, giao từng tính năng một hoặc gom nhiều cái. Nguyên tắc chính là <strong>giới hạn số việc đang làm (WIP)</strong>.</p>`],
      [21, 'Spiral (prototyping)',
        `<p>Each loop of the spiral: determine objectives → identify and resolve risks (prototypes) → develop and test → plan the next iteration. It creates <strong>experimental increments</strong>, some heavily reworked or even abandoned later.</p>`,
        `<p>Mỗi vòng xoắn: xác định mục tiêu → nhận diện và xử lý rủi ro (làm prototype) → phát triển và kiểm thử → lập kế hoạch vòng sau. Mô hình này tạo ra <strong>các phần tăng thử nghiệm</strong>, có cái bị làm lại nhiều hoặc thậm chí bỏ hẳn về sau.</p>`],
      [22, 'Agile development',
        `<p>Typical practices: business (user) stories define functionality; an <strong>on-site customer</strong> gives continual feedback and defines/performs functional acceptance tests; pair programming and shared code ownership; component tests written <strong>before</strong> the code (TDD) and automated; simplicity — build only what is necessary; <strong>continuous integration</strong> and testing at least once a day.</p>`,
        `<p>Thực hành điển hình: user story định nghĩa chức năng; <strong>khách hàng ngồi cùng nhóm</strong> phản hồi liên tục và xác định/thực hiện acceptance test chức năng; lập trình cặp và sở hữu code chung; component test viết <strong>trước</strong> code (TDD) và được tự động hoá; đơn giản — chỉ làm cái cần thiết; <strong>tích hợp liên tục</strong> và test ít nhất mỗi ngày một lần.</p>`],
      [23, 'Agile: benefits for testers',
        `<p>Focus on working software and good code quality; testing is part of — and the starting point of — development; business stakeholders are accessible so questions get answered; self-organising teams give testers more autonomy; simple designs are easier to test.</p>`,
        `<p>Tập trung vào phần mềm chạy được và code chất lượng; kiểm thử là một phần — và là điểm khởi đầu — của phát triển; dễ tiếp cận người nghiệp vụ nên câu hỏi được giải đáp; nhóm tự tổ chức cho tester nhiều quyền tự chủ; thiết kế đơn giản dễ test hơn.</p>`],
      [24, 'Agile: challenges for testers',
        `<p>A less formal, changing test basis; the misconception that testers are not needed; a different role — more like a coach; constant time pressure; and the risk of an inadequate automated regression suite. Topic 8 (Agile Tester) develops these in depth.</p>`,
        `<p>Test basis ít hình thức và hay đổi; ngộ nhận rằng không cần tester; vai trò khác — giống huấn luyện viên hơn; áp lực thời gian liên tục; và rủi ro bộ regression tự động không đủ. Topic 8 (Agile Tester) đi sâu các ý này.</p>`],
      [25, 'Question — what does the SDLC describe?',
        AE('A — The types of activities performed in software development projects', 'Slide 3 word for word. B limits it to test activities; C describes a requirements document, not a lifecycle.'),
        AV('A — Các loại hoạt động thực hiện trong dự án phát triển phần mềm', 'Đúng từng chữ slide 3. B chỉ nói hoạt động test; C là mô tả tài liệu yêu cầu, không phải vòng đời.')],
      [26, 'Question — characteristics of good testing',
        AE('B — 1, 3, 4 correct; 2 wrong', 'Statement 2 contradicts slide 4: analysis and design for a level should begin <em>during</em> the corresponding development activity, not at its end.'),
        AV('B — 1, 3, 4 đúng; 2 sai', 'Câu 2 trái slide 4: phân tích và thiết kế test cho một cấp phải bắt đầu <em>trong khi</em> hoạt động phát triển tương ứng diễn ra, không đợi tới cuối.')],
      [27, 'Question — best definition of an incremental model',
        AE('A — Requirements, design and testing are done in a series with added pieces', 'B describes sequential models, C the waterfall, D is nonsense ("testing added as an increment").'),
        AV('A — Yêu cầu, thiết kế, kiểm thử được làm thành chuỗi, mỗi lần thêm một phần', 'B mô tả mô hình tuần tự, C là waterfall, D vô nghĩa ("thêm kiểm thử như một phần tăng").')],
      [28, 'Question — true statement about the V-model',
        AE('B — The test process is integrated with the development process', 'Each development level has a matching test level. A is the waterfall view; C describes incremental models; D is only partly true of sequential models and misses the point of the V.'),
        AV('B — Quy trình test được tích hợp với quy trình phát triển', 'Mỗi mức phát triển có một cấp test tương ứng. A là quan điểm waterfall; C mô tả mô hình tăng dần; D chỉ đúng một phần với mô hình tuần tự và bỏ lỡ ý chính của chữ V.')],
      [29, 'Question — the waterfall model',
        AE('D — 1 and 2 correct; 3 and 4 wrong', 'Waterfall is sequential (1) and testing begins after development (2). It is not "the best model for small organisations" (3) and it has no iterations (4).'),
        AV('D — 1 và 2 đúng; 3 và 4 sai', 'Waterfall là tuần tự (1) và kiểm thử bắt đầu sau phát triển (2). Nó không phải "mô hình tốt nhất cho tổ chức nhỏ" (3) và không có vòng lặp (4).')],
      [30, 'Question — the V-model is a…',
        AE('A — Sequential model', 'The V is a sequential model that adds early test design; it is not iterative or incremental.'),
        AV('A — Mô hình tuần tự', 'V-model là mô hình tuần tự có thêm thiết kế test sớm; không phải lặp hay tăng dần.')],
      [31, 'Question — where does the client see the product?',
        AE('D — Acceptance testing', 'Acceptance is paired with user requirements; it is where the customer validates the product.'),
        AV('D — Acceptance testing', 'Acceptance ghép với yêu cầu người dùng; đó là nơi khách hàng validate sản phẩm.')],
      [32, 'Question — waterfall vs V-model',
        AE('B — In the V-model the principle of early testing is applied; in waterfall it is not', 'Both are sequential (A is wrong); C is invented.'),
        AV('B — V-model áp dụng nguyên tắc kiểm thử sớm; waterfall thì không', 'Cả hai đều tuần tự (A sai); C là bịa.')],
      [33, 'Question — length of RUP iterations',
        AE('B — Relatively long (two to three months)', 'Slide 18: RUP iterations last months; the short 1–4 week cycle is Scrum.'),
        AV('B — Tương đối dài (hai đến ba tháng)', 'Slide 18: vòng lặp RUP kéo dài vài tháng; chu kỳ ngắn 1–4 tuần là của Scrum.')],
      [34, 'Question — Scrum',
        AE('D — 3 correct; 1 and 2 wrong', 'A retrospective closes each sprint (3). Sprints are short, not 2–3 months (1). Testers do not own the requirements document — in Scrum the product owner owns the backlog (2).'),
        AV('D — 3 đúng; 1 và 2 sai', 'Mỗi sprint kết thúc bằng retrospective (3). Sprint ngắn, không phải 2–3 tháng (1). Tester không chịu trách nhiệm viết tài liệu yêu cầu — trong Scrum product owner giữ backlog (2).')],
      [35, 'Question — Kanban',
        AE('C — Implemented with or without fixed-length iterations', 'Exactly slide 20. A is wrong (iterations are optional), B is wrong (activities overlap continuously on the board).'),
        AV('C — Chạy có hoặc không có vòng lặp độ dài cố định', 'Đúng slide 20. A sai (vòng lặp là tuỳ chọn), B sai (các hoạt động chồng lên nhau liên tục trên bảng).')],
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
<div class="pitfall"><b>V-model trap.</b> "In the V-model, testing starts when coding is finished" is false. Test <em>execution</em> for most levels comes after coding, but test <em>analysis and design</em> start on the left arm, in parallel with each development phase — that is the whole point of the V.</div>`,
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
<div class="pitfall"><b>Bẫy V-model.</b> "Trong V-model, kiểm thử bắt đầu khi code xong" là sai. <em>Thực thi</em> test của hầu hết các cấp đến sau khi code, nhưng <em>phân tích và thiết kế</em> test bắt đầu ngay ở nhánh trái, song song với từng pha phát triển — đó là toàn bộ ý nghĩa của chữ V.</div>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — choose and adapt a lifecycle</h3>
<p><b>Context.</b> A team of 6 builds (a) a payroll module for a bank, with a signed contract listing every calculation rule and a fixed go-live date; (b) a campus event app for students whose features will change after each user test.</p>
<ol>
<li><b>(a) Payroll → V-model.</b> Stable, contract-defined requirements and a regulatory context favour a sequential model with formal test levels. Adapt it with early test design: acceptance tests written from the contract in week 1, a formal review of the calculation spec.</li>
<li><b>(b) Event app → Scrum.</b> Changing needs and fast feedback favour short sprints. Adapt testing: acceptance criteria on every story, automated regression from sprint 1 (slide 24's risk), a demo to real students each sprint (validation).</li>
<li><b>Why adapt (LO-2.1.2):</b> project goals, product type, business priorities and risks (e.g. regulation, time-to-market) all change which model fits — and models are often combined (e.g. V-model for the core, Agile for the front end).</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The W-model and DevOps.</b> Paul Herzlich's <em>W-model</em> (1993) draws a second V next to the first so that every development step has an explicit <em>static</em> test step (review) as well as the dynamic one — it is the V-model with early test design made visible. Today's DevOps pipelines push the idea to its limit: every commit triggers build → unit tests → integration tests → deployment to a staging environment → automated acceptance checks, so the "right arm of the V" runs dozens of times a day. <em>Outside the syllabus because CTFL only names sequential and iterative families.</em></div>`,
    `<h3>Ví dụ có lời giải · Chọn và điều chỉnh mô hình vòng đời</h3>
<p><b>Bối cảnh.</b> Một nhóm 6 người làm (a) module tính lương cho ngân hàng, có hợp đồng ghi rõ mọi quy tắc tính và ngày go-live cố định; (b) app sự kiện cho sinh viên trong trường, tính năng sẽ thay đổi sau mỗi lần cho người dùng thử.</p>
<ol>
<li><b>(a) Tính lương → V-model.</b> Yêu cầu ổn định, định nghĩa trong hợp đồng, bối cảnh có kiểm định nên hợp mô hình tuần tự với các cấp test chính thức. Điều chỉnh bằng thiết kế test sớm: viết acceptance test từ hợp đồng ngay tuần 1, review chính thức đặc tả tính lương.</li>
<li><b>(b) App sự kiện → Scrum.</b> Nhu cầu thay đổi, cần phản hồi nhanh nên hợp sprint ngắn. Điều chỉnh kiểm thử: mỗi story có acceptance criteria, regression tự động từ sprint 1 (rủi ro ở slide 24), demo cho sinh viên thật mỗi sprint (validation).</li>
<li><b>Vì sao phải điều chỉnh (LO-2.1.2):</b> mục tiêu dự án, loại sản phẩm, ưu tiên kinh doanh và rủi ro (vd kiểm định, thời gian ra thị trường) đều quyết định mô hình nào phù hợp — và các mô hình thường được kết hợp (vd V-model cho phần lõi, Agile cho phần giao diện).</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>W-model và DevOps.</b> <em>W-model</em> của Paul Herzlich (1993) vẽ thêm một chữ V cạnh chữ V đầu để mỗi bước phát triển có một bước test <em>tĩnh</em> (review) tường minh bên cạnh bước test động — chính là V-model có thiết kế test sớm được vẽ ra rõ ràng. Pipeline DevOps ngày nay đẩy ý tưởng tới tận cùng: mỗi commit kích hoạt build → unit test → integration test → triển khai lên staging → kiểm tra chấp nhận tự động, nên "nhánh phải của chữ V" chạy hàng chục lần mỗi ngày. <em>Ngoài giáo trình vì CTFL chỉ nêu hai họ tuần tự và lặp.</em></div>`),
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
<div class="callout"><b>Learning objective.</b> LO-2.2.1 Compare the different test levels from the perspective of objectives, test basis, test objects, typical defects and failures, and approaches and responsibilities (K2).</div>
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
<div class="callout"><b>Chuẩn đầu ra.</b> LO-2.2.1 So sánh các cấp test theo mục tiêu, test basis, đối tượng test, lỗi điển hình, cách tiếp cận và trách nhiệm (K2).</div>
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
      [36, 'CONTENT — Test levels', `<p>Second block of the chapter: the four test levels (this lesson and 2.3).</p>`, `<p>Khối thứ hai: bốn cấp test (bài này và bài 2.3).</p>`],
      [37, 'Test Levels',
        `<p>Test levels are groups of test activities organised and managed together; each level (a "test stage") is a specific instantiation of the test process of lesson 1.4, and each relates to other lifecycle activities. The pyramid: component → integration → system → acceptance.</p>`,
        `<p>Cấp test là các nhóm hoạt động kiểm thử được tổ chức và quản lý cùng nhau; mỗi cấp ("test stage") là một phiên bản cụ thể của quy trình test ở bài 1.4, và gắn với các hoạt động khác trong vòng đời. Kim tự tháp: component → integration → system → acceptance.</p>`],
      [38, 'Test Levels: characteristics',
        `<p>The five attributes you compare levels by: <strong>specific test objectives · test basis · test object · typical defects and failures · specific approaches and responsibilities</strong>. Every "which level…?" question is answered by matching one attribute.</p>`,
        `<p>Năm thuộc tính dùng để so sánh các cấp: <strong>mục tiêu test riêng · test basis · đối tượng test · lỗi và failure điển hình · cách tiếp cận và trách nhiệm riêng</strong>. Mọi câu "cấp nào…?" đều giải bằng cách khớp một thuộc tính.</p>`],
      [39, 'Test Levels: environment',
        `<p>Every level needs a suitable environment: developers' own environment for component testing; an environment with particular external connections for system testing; a production-like environment is ideal for acceptance testing.</p>`,
        `<p>Mỗi cấp cần môi trường phù hợp: component testing thường dùng môi trường dev của lập trình viên; system testing có thể cần môi trường có kết nối ngoài đặc biệt; acceptance testing lý tưởng là môi trường giống production.</p>`],
      [40, 'Question — which is NOT a test level?',
        AE('B — Functional testing', 'Functional testing is a test <em>type</em> (lesson 2.4). Component testing and system integration testing are levels.'),
        AV('B — Functional testing', 'Functional testing là một <em>loại</em> test (bài 2.4). Component testing và system integration testing là các cấp.')],
      [41, 'Question — statements about test levels',
        AE('B — 1, 3, 4 correct; 2 wrong', 'Test levels are not universal (2): organisations name and combine them differently depending on context.'),
        AV('B — 1, 3, 4 đúng; 2 sai', 'Cấp test không phải "chung cho mọi công ty" (2): mỗi tổ chức đặt tên và kết hợp khác nhau tuỳ ngữ cảnh.')],
      [42, 'Component Testing',
        `<p>The lowest level; components are tested <strong>in isolation</strong>, using <strong>stubs and/or drivers</strong> to replace their neighbours; the most thorough look at detail (error handling, interfaces). Also called unit, module or program testing.</p>`,
        `<p>Cấp thấp nhất; thành phần được test <strong>cô lập</strong>, dùng <strong>stub và/hoặc driver</strong> thay cho các thành phần xung quanh; soi chi tiết kỹ nhất (xử lý lỗi, giao diện). Còn gọi là unit, module hay program testing.</p>`],
      [43, 'Component Testing — the five attributes',
        `<p>The table to learn: objectives (reduce risk, verify behaviours, build confidence, find and prevent defects); test basis (detailed design, code, data model, component specs); test objects (components, units, modules, code &amp; data structures, classes, database models); typical defects (incorrect functionality, data-flow problems, incorrect code or logic); approach (TDD; usually done by the developer).</p>`,
        `<p>Bảng phải học: mục tiêu (giảm rủi ro, verify hành vi, tạo niềm tin, tìm và ngăn lỗi); test basis (thiết kế chi tiết, code, mô hình dữ liệu, đặc tả thành phần); đối tượng (component, unit, module, code &amp; cấu trúc dữ liệu, class, mô hình CSDL); lỗi điển hình (sai chức năng, lỗi luồng dữ liệu, sai code/logic); cách tiếp cận (TDD; thường do developer làm).</p>`],
      [44, 'Component Testing: Test-Driven Development',
        `<p>The TDD cycle: <strong>FAIL</strong> (write an automated test that fails) → <strong>PASS</strong> (write just enough code to pass) → <strong>RE-FACTOR</strong> (clean the code, tests still pass) → repeat. Steps: develop automated test cases → build and integrate small pieces of code → run the component tests, fix issues and refactor. Chapter 9 practises it in JUnit.</p>`,
        `<p>Chu trình TDD: <strong>FAIL</strong> (viết test tự động và thấy nó fail) → <strong>PASS</strong> (viết vừa đủ code cho test pass) → <strong>RE-FACTOR</strong> (dọn code, test vẫn pass) → lặp lại. Các bước: viết test case tự động → xây và tích hợp từng mẩu code nhỏ → chạy component test, sửa lỗi và refactor. Chương 9 thực hành bằng JUnit.</p>`],
      [45, 'Component test strategy 1 (BS 7925-2)',
        `<p>The component-testing standard BS 7925-2 asks you to document: the test design techniques and why (Section 3 of the standard); the completion criteria and why (Section 4 — e.g. 100% branch coverage); and the degree of independence of test design — author, another person, a different section, a different organisation, or non-human (tool-generated).</p>`,
        `<p>Chuẩn component testing BS 7925-2 yêu cầu ghi lại: kỹ thuật thiết kế test và lý do (Mục 3 của chuẩn); tiêu chí hoàn thành và lý do (Mục 4 — vd 100% branch coverage); và mức độc lập khi thiết kế test — chính tác giả, người khác, bộ phận khác, tổ chức khác, hay không phải người (công cụ sinh).</p>`],
      [46, 'Component test strategy 2',
        `<p>Also document: component integration approach and environment (isolation, top-down, bottom-up or a mixture; hardware and software), the test process and its activities (with inputs and outputs), the rule that affected activities are repeated after any fix or change, and a project component test plan with the dependencies between component tests.</p>`,
        `<p>Ghi thêm: cách tích hợp thành phần và môi trường (cô lập, top-down, bottom-up hay kết hợp; phần cứng, phần mềm), quy trình và các hoạt động test (kèm đầu vào, đầu ra), quy tắc lặp lại các hoạt động bị ảnh hưởng sau mỗi lần sửa/thay đổi, và kế hoạch component test của dự án với các phụ thuộc giữa các component test.</p>`],
      [47, 'Test design techniques in BS 7925-2',
        `<p>The standard's techniques and whether each is <em>also a quality-measurement technique</em> (i.e. has a coverage measure). Black box: equivalence partitioning ✓, boundary value analysis ✓, state transition ✓, cause-effect graphing ✓, syntax testing ✗, random testing ✗. White box — all ✓: statement, branch/decision, data flow, branch condition, branch condition combination, modified condition/decision (MC/DC), LCSAJ. Chapter 4 teaches EP, BVA, decision tables and state transition in detail; Chapter 5 statement and decision coverage.</p>`,
        `<p>Các kỹ thuật trong chuẩn và kỹ thuật nào <em>cũng là kỹ thuật đo chất lượng</em> (tức là có thước đo coverage). Black box: equivalence partitioning ✓, boundary value analysis ✓, state transition ✓, cause-effect graphing ✓, syntax testing ✗, random testing ✗. White box — đều ✓: statement, branch/decision, data flow, branch condition, branch condition combination, modified condition/decision (MC/DC), LCSAJ. Chương 4 dạy kỹ EP, BVA, decision table, state transition; Chương 5 dạy statement và decision coverage.</p>`],
      [48, 'Question — definition of component testing',
        AE('B — Testing components that are separately testable', 'A is integration testing, C is system testing.'),
        AV('B — Test các thành phần có thể test riêng rẽ', 'A là integration testing, C là system testing.')],
      [49, 'Question — objective of component testing',
        AE('A — Building confidence in the component\'s quality', 'B belongs to integration (interfaces), C to acceptance (validating the system is complete).'),
        AV('A — Tạo niềm tin vào chất lượng của thành phần', 'B thuộc integration (giao diện), C thuộc acceptance (xác nhận hệ thống hoàn chỉnh).')],
      [50, 'Question — test basis for component testing',
        AE('C — Detailed design, code, data model', 'A is the integration basis; B (epics, user stories, state diagrams, risk reports) is the system basis.'),
        AV('C — Thiết kế chi tiết, code, mô hình dữ liệu', 'A là test basis của integration; B (epic, user story, state diagram, báo cáo rủi ro) là của system.')],
      [51, 'Question — defect found in component testing',
        AE('B — Incorrect code and logic', 'A (interface call sequencing/timing) is integration; C (control/data flows within the system) is system testing.'),
        AV('B — Sai code và logic', 'A (thứ tự/thời điểm gọi giao diện) là integration; C (luồng điều khiển/dữ liệu trong hệ thống) là system testing.')],
      [52, 'Question — "requirements converted to test cases before the software is developed…"',
        AE('B — Test-driven development', 'Tests first, then code, then repeatedly testing against all tests — the definition of TDD.'),
        AV('B — Test-driven development', 'Test trước, code sau, rồi liên tục chạy lại toàn bộ test — định nghĩa của TDD.')],
      [53, 'Integration Testing',
        `<p>Integration testing focuses on <strong>interactions</strong> between components or systems. Two sub-levels: <strong>component integration</strong> (modules inside one system) and <strong>system integration</strong> (between systems, e.g. your app ↔ a payment gateway).</p>`,
        `<p>Integration testing tập trung vào <strong>tương tác</strong> giữa các thành phần hoặc hệ thống. Hai cấp con: <strong>tích hợp thành phần</strong> (các module trong một hệ thống) và <strong>tích hợp hệ thống</strong> (giữa các hệ thống, vd app của bạn ↔ cổng thanh toán).</p>`],
      [54, 'Integration Testing — test the integration itself',
        `<p>Integration tests should concentrate on the <strong>communication</strong> between modules (or systems), <strong>not</strong> on the functionality of each module — that was covered by component (or system) testing. Example: integrating Cart and Payment, test that the amount and currency Cart sends are exactly what Payment receives and that an error from Payment comes back to Cart — not whether Cart computes the total correctly.</p>`,
        `<p>Integration test nên tập trung vào <strong>giao tiếp</strong> giữa các module (hay hệ thống), <strong>không</strong> test lại chức năng của từng module — việc đó component (hay system) testing đã làm. Ví dụ: tích hợp Giỏ hàng và Thanh toán thì test số tiền và loại tiền Giỏ hàng gửi đi đúng là cái Thanh toán nhận được, và lỗi từ Thanh toán quay về Giỏ hàng — chứ không test Giỏ hàng cộng tổng đúng hay sai.</p>`],
      [55, 'Integration Testing — responsibilities & scope',
        `<p>Component integration is often the <strong>developers'</strong> job; system integration is generally the <strong>testers'</strong>. Integration should normally be <strong>incremental</strong> to simplify defect isolation. The greater the scope of an integration step, the harder it is to isolate a defect → hence <strong>continuous integration</strong>: integrate component by component, many times a day.</p>`,
        `<p>Tích hợp thành phần thường là việc của <strong>developer</strong>; tích hợp hệ thống thường là việc của <strong>tester</strong>. Tích hợp nên <strong>tăng dần</strong> để dễ khoanh vùng lỗi. Mỗi bước tích hợp càng lớn thì càng khó cô lập lỗi → vì thế có <strong>tích hợp liên tục (CI)</strong>: tích hợp từng thành phần một, nhiều lần mỗi ngày.</p>`],
      [56, 'Integration Testing — the five attributes',
        `<p>Objectives: as component testing but for <em>interfaces</em>. Test basis: software &amp; system design, sequence diagrams, interface and communication-protocol specs, use cases, workflows. Test objects: subsystems, databases, infrastructure, interfaces, APIs, microservices. Typical defects: incorrect data, incorrect timing, interface mismatch, communication failures between components, incorrect assumptions. Approaches: big-bang or incremental (top-down, bottom-up, functional).</p>`,
        `<p>Mục tiêu: như component testing nhưng cho <em>giao diện</em>. Test basis: thiết kế phần mềm &amp; hệ thống, sequence diagram, đặc tả giao diện và giao thức, use case, workflow. Đối tượng: subsystem, CSDL, hạ tầng, giao diện, API, microservice. Lỗi điển hình: sai dữ liệu, sai thời điểm, giao diện không khớp, lỗi giao tiếp giữa thành phần, giả định sai. Cách tiếp cận: big-bang hoặc tăng dần (top-down, bottom-up, functional).</p>`],
      [57, 'Big-Bang Integration',
        `<p>In theory: the components are tested, so why not combine them all at once and save time? That rests on the false assumption that there are no faults. In practice faults take longer to locate and fix, re-testing after fixes is more extensive, and the end result takes more time.</p>`,
        `<p>Lý thuyết: các thành phần đã test rồi, sao không ghép hết một lượt cho nhanh? Điều đó dựa trên giả định sai là không còn lỗi. Thực tế: lỗi khó khoanh vùng và sửa lâu hơn, test lại sau khi sửa tốn hơn, và rốt cuộc mất nhiều thời gian hơn.</p>`],
      [58, 'Incremental Integration',
        `<p>Build up <strong>baselines</strong>: baseline 0 = one tested component, baseline 1 = two components, baseline 2 = three, and so on — each new component is added to an already tested baseline. Advantages: easier fault location and fixing, easier recovery from problems; interfaces "should have been tested in component tests, but…" — integration is where you find out.</p>`,
        `<p>Xây dần các <strong>baseline</strong>: baseline 0 = một thành phần đã test, baseline 1 = hai thành phần, baseline 2 = ba, v.v. — mỗi thành phần mới được thêm vào một baseline đã được test. Ưu điểm: dễ khoanh vùng và sửa lỗi, dễ phục hồi khi có sự cố; giao diện "lẽ ra đã được test ở component test, nhưng…" — tích hợp mới là lúc biết thật.</p>`],
      [59, 'Top-Down Integration',
        `<p>Start from the top of the call tree: baseline 0 = a, 1 = a + b, 2 = a + b + c, 3 = a + b + c + d… (the pink arrow points down the tree). The integrated components call lower ones that are not integrated yet, so those are replaced by <strong>stubs</strong> that simulate the missing components.</p>`,
        `<p>Bắt đầu từ đỉnh cây gọi: baseline 0 = a, 1 = a + b, 2 = a + b + c, 3 = a + b + c + d… (mũi tên hồng đi xuống cây). Các thành phần đã tích hợp gọi xuống thành phần bên dưới chưa tích hợp, nên chúng được thay bằng <strong>stub</strong> mô phỏng thành phần còn thiếu.</p>`],
      [60, 'Stubs',
        `<p>A <strong>stub</strong> replaces a <em>called</em> component. Keep it simple; in order of sophistication a stub can: print "I have been called", reply with a single fixed value, compute a reply, prompt the tester for a reply, search a list of replies, or add a timing delay. ("Baan: dummy sessions" is what the Baan ERP system called them.)</p>`,
        `<p><strong>Stub</strong> thay cho thành phần <em>được gọi</em>. Giữ nó đơn giản; theo mức phức tạp tăng dần, một stub có thể: in "tôi đã được gọi", trả về một giá trị cố định, tính ra câu trả lời, hỏi tester nhập câu trả lời, tra một danh sách câu trả lời, hoặc giả lập độ trễ. ("Baan: dummy sessions" là tên hệ ERP Baan gọi chúng.)</p>`],
      [61, 'Pros & cons of top-down',
        `<p>Advantages: the critical control structure is tested first and most often; you can demonstrate the system early (working menus). Disadvantages: needs stubs; detail is left until last; detailed output may be hard to see; the system may look more finished than it is.</p>`,
        `<p>Ưu: cấu trúc điều khiển quan trọng được test sớm nhất và nhiều nhất; demo được hệ thống sớm (menu chạy được). Nhược: cần stub; phần chi tiết để tới cuối; khó "thấy" output chi tiết; hệ thống trông hoàn thiện hơn thực tế.</p>`],
      [62, 'Bottom-up Integration',
        `<p>Start from the leaves: baseline 0 = n, 1 = n + i, 2 = n + i + o, 3 = n + i + o + d… (the arrow points up). Nothing calls the baseline yet, so you need <strong>drivers</strong> to call it — and some baselines also need stubs (here d's other children h and j, shown in blue).</p>`,
        `<p>Bắt đầu từ lá: baseline 0 = n, 1 = n + i, 2 = n + i + o, 3 = n + i + o + d… (mũi tên đi lên). Chưa có gì gọi baseline nên cần <strong>driver</strong> để gọi nó — và một số baseline còn cần cả stub (ở đây là h và j, các con khác của d, tô xanh).</p>`],
      [63, 'Drivers',
        `<p>A <strong>driver</strong> is test harness/scaffolding that <em>calls</em> the component under test: specially written or a general-purpose commercial tool; it invokes the baseline, sends the data it expects and receives (prints) the data it produces. Each baseline has different requirements for its driver. In JUnit terms, the test class is the driver of the class under test.</p>`,
        `<p><strong>Driver</strong> là phần khung/giàn giáo test <em>gọi</em> thành phần đang test: viết riêng hoặc dùng công cụ thương mại đa năng; nó gọi baseline, gửi dữ liệu baseline cần và nhận (in ra) dữ liệu baseline tạo ra. Mỗi baseline cần driver khác nhau. Theo cách nói JUnit, lớp test chính là driver của lớp đang test.</p>`],
      [64, 'Pros & cons of bottom-up',
        `<p>Advantages: the lowest levels are tested first and most thoroughly; good for interfaces to the external environment (hardware, network); good visibility of detail. Disadvantages: no working system until the last baseline; needs both drivers and stubs; major control problems are found last.</p>`,
        `<p>Ưu: các tầng thấp nhất được test sớm và kỹ nhất; tốt cho giao diện với môi trường ngoài (phần cứng, mạng); thấy rõ chi tiết. Nhược: không có hệ thống chạy được cho tới baseline cuối; cần cả driver lẫn stub; lỗi điều khiển lớn bị phát hiện muộn nhất.</p>`],
      [65, 'Minimum Capability Integration (functional)',
        `<p>Integrate one complete path from the top down to a leaf first: baseline 0 = a, 1 = a + b, 2 = a + b + d, 3 = a + b + d + i… (the diagonal arrow). Needs stubs; shouldn't need drivers when done top-down.</p>`,
        `<p>Tích hợp trọn một đường đi từ đỉnh xuống một lá trước: baseline 0 = a, 1 = a + b, 2 = a + b + d, 3 = a + b + d + i… (mũi tên chéo). Cần stub; không cần driver nếu làm từ trên xuống.</p>`],
      [66, 'Pros & cons of minimum capability',
        `<p>Advantages: the control level is tested first and most often; visibility of detail; a real working partial system earliest. Disadvantage: needs stubs.</p>`,
        `<p>Ưu: tầng điều khiển được test sớm và nhiều nhất; thấy rõ chi tiết; sớm nhất có một hệ thống thật chạy được một phần. Nhược: cần stub.</p>`],
      [67, 'Thread Integration (functional)',
        `<p>The order in which some event is processed (an interrupt, a user transaction) decides the integration order — "minimum capability in time". Advantages: critical processing first; early warning of performance problems. Disadvantage: may need complex drivers and stubs. The speaker note adds: <em>layers</em> — commonly used for big projects.</p>`,
        `<p>Thứ tự xử lý một sự kiện (một ngắt, một giao dịch của người dùng) quyết định thứ tự tích hợp — "năng lực tối thiểu theo thời gian". Ưu: xử lý quan trọng được làm trước; sớm cảnh báo vấn đề hiệu năng. Nhược: có thể cần driver và stub phức tạp. Ghi chú của thầy/cô: tích hợp theo <em>tầng (layers)</em> — hay dùng cho dự án lớn.</p>`],
      [68, 'Integration Guidelines',
        `<p>Minimise the support software (stubs/drivers) needed; integrate each component only once; each baseline should produce an easily verifiable result; integrate small numbers of components at once — one at a time for critical or fault-prone components, simple related ones together.</p>`,
        `<p>Giảm tối đa phần mềm hỗ trợ (stub/driver) cần viết; mỗi thành phần chỉ tích hợp một lần; mỗi baseline phải cho kết quả dễ kiểm chứng; tích hợp ít thành phần mỗi lần — từng cái một với thành phần quan trọng hoặc hay lỗi, ghép chung các thành phần đơn giản liên quan.</p>`],
      [69, 'Integration Planning',
        `<p>Plan integration in the <strong>architectural design phase</strong>; the integration order then decides the <strong>build order</strong>, so components are completed in time for their baseline, and component development and integration testing run in parallel — saving time.</p>`,
        `<p>Lập kế hoạch tích hợp ngay ở <strong>pha thiết kế kiến trúc</strong>; thứ tự tích hợp quyết định <strong>thứ tự build</strong>, nhờ đó thành phần xong kịp baseline của nó, và phát triển thành phần chạy song song với integration testing — tiết kiệm thời gian.</p>`],
      [70, 'Question — integration testing focuses on…',
        AE('B — Interactions between components or systems', 'A describes early testing in general; C is component testing.'),
        AV('B — Tương tác giữa các thành phần hoặc hệ thống', 'A nói về kiểm thử sớm nói chung; C là component testing.')],
      [71, 'Question — who does component vs system integration?',
        AE('A — developer – tester', 'Slide 55.'),
        AV('A — developer – tester', 'Slide 55.')],
      [72, 'Question — test basis for integration testing',
        AE('B — Use cases, workflows, sequence diagrams', 'A is the system-test basis, C the component-test basis, D mixes system and acceptance items.'),
        AV('B — Use case, workflow, sequence diagram', 'A là test basis của system, C của component, D trộn đối tượng system và acceptance.')],
      [73, 'Question — defect found in integration testing',
        AE('C — Incorrect sequencing or timing of interface calls', 'A is a component defect, B a system defect, D an acceptance (contractual/regulatory) issue.'),
        AV('C — Sai thứ tự hoặc thời điểm gọi giao diện', 'A là lỗi component, B lỗi system, D là vấn đề acceptance (hợp đồng/quy định).')],
      [74, 'Question — scope of integration',
        AE('D — The greater the scope of integration, the more difficult it becomes to isolate defects', 'Exactly slide 55 — and the reason for incremental and continuous integration.'),
        AV('D — Phạm vi tích hợp càng lớn thì càng khó cô lập lỗi', 'Đúng slide 55 — và là lý do của tích hợp tăng dần và tích hợp liên tục.')],
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
<div class="pitfall"><b>Stub vs driver — the classic trap.</b> A <strong>stub</strong> is <em>called by</em> the code under test (it stands in below it — top-down). A <strong>driver</strong> <em>calls</em> the code under test (it stands in above it — bottom-up). In unit tests with Mockito, a mocked repository is a stub/mock; the JUnit test method is the driver.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Contract testing for microservices.</b> When dozens of services integrate, a full integration environment is slow and fragile. <em>Consumer-driven contract testing</em> (e.g. Pact) lets each consumer publish the requests it makes and the responses it expects; each provider verifies it still honours every published contract in its own pipeline. It catches the "interface mismatch" defects of slide 56 without starting the whole system. <em>Outside the syllabus because CTFL stops at big-bang vs incremental.</em></div>`,
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
<div class="pitfall"><b>Stub vs driver — bẫy kinh điển.</b> <strong>Stub</strong> <em>được gọi bởi</em> code đang test (đứng thay ở phía dưới — top-down). <strong>Driver</strong> <em>gọi</em> code đang test (đứng thay ở phía trên — bottom-up). Trong unit test với Mockito, repository bị mock là stub/mock; phương thức test JUnit là driver.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Contract testing cho microservice.</b> Khi hàng chục service tích hợp với nhau, dựng cả môi trường tích hợp vừa chậm vừa dễ gãy. <em>Consumer-driven contract testing</em> (vd Pact) cho mỗi bên gọi công bố các request nó gửi và response nó mong đợi; mỗi bên cung cấp tự kiểm trong pipeline của mình rằng nó vẫn giữ đúng mọi hợp đồng đã công bố. Cách này bắt được lỗi "giao diện không khớp" ở slide 56 mà không cần khởi động cả hệ thống. <em>Ngoài giáo trình vì CTFL chỉ dừng ở big-bang và tăng dần.</em></div>`),
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
        `<p>System testing focuses on the behaviour and capabilities of a <strong>whole system or product</strong>, often considering the <strong>end-to-end tasks</strong> it can perform and the <strong>non-functional behaviours</strong> it exhibits while performing them.</p>`,
        `<p>System testing tập trung vào hành vi và năng lực của <strong>cả hệ thống hay sản phẩm</strong>, thường xét các <strong>tác vụ đầu-cuối</strong> hệ thống thực hiện được và <strong>hành vi phi chức năng</strong> nó thể hiện khi thực hiện các tác vụ đó.</p>`],
      [76, 'System Testing — the attributes',
        `<p>Objectives, test basis, test objects and typical defects as in the table above. Note two items that distinguish it from integration: the basis includes <em>epics, user stories, state diagrams and risk reports</em>, and a typical failure is "the system <em>cannot complete end-to-end tasks</em>".</p>`,
        `<p>Mục tiêu, test basis, đối tượng và lỗi điển hình như bảng ở trên. Hai điểm phân biệt với integration: test basis có <em>epic, user story, state diagram và báo cáo rủi ro</em>, và lỗi điển hình là "hệ thống <em>không hoàn thành được tác vụ đầu-cuối</em>".</p>`],
      [77, 'System Testing: approaches & responsibilities',
        `<p><strong>Independent testers</strong> typically carry out system testing. Functional requirements are tested first with the most appropriate <strong>black-box techniques</strong> (e.g. decision tables); white-box techniques can assess thoroughness of elements such as menu structure or web-page navigation. The (properly controlled) environment should ideally correspond to the <strong>production environment</strong>.</p>`,
        `<p>System testing thường do <strong>tester độc lập</strong> làm. Yêu cầu chức năng được test trước bằng <strong>kỹ thuật black-box</strong> phù hợp nhất (vd decision table); kỹ thuật white-box có thể đo độ kỹ lưỡng với các phần như cấu trúc menu hay điều hướng trang web. Môi trường (được kiểm soát tốt) lý tưởng nhất là giống <strong>môi trường production</strong>.</p>`],
      [78, 'Question — definition of system testing',
        AE('B — Testing the behaviour and capabilities of a whole system or product', 'A is component testing, C integration testing.'),
        AV('B — Test hành vi và năng lực của cả hệ thống hay sản phẩm', 'A là component testing, C là integration testing.')],
      [79, 'Question — statements about system testing',
        AE('C — 1 and 2 correct; 3 wrong', 'Finding defects <em>is</em> an objective of system testing. "Finding defects is often not an objective" is said about <em>acceptance</em> testing (slide 83).'),
        AV('C — 1 và 2 đúng; 3 sai', 'Tìm lỗi <em>là</em> mục tiêu của system testing. Câu "tìm lỗi thường không phải mục tiêu" là nói về <em>acceptance</em> testing (slide 83).')],
      [80, 'Question — test basis of system testing',
        AE('B — Epics and user stories, state diagrams, risk analysis reports', 'A is the component basis, C the integration basis.'),
        AV('B — Epic và user story, state diagram, báo cáo phân tích rủi ro', 'A là test basis của component, C của integration.')],
      [81, 'Question — test object of system testing',
        AE('A — Applications, operating systems', 'B (reports, forms) are acceptance objects, C (APIs, microservices) integration objects.'),
        AV('A — Ứng dụng, hệ điều hành', 'B (báo cáo, biểu mẫu) là đối tượng acceptance, C (API, microservice) là đối tượng integration.')],
      [82, 'Acceptance Testing — definition',
        `<p><strong>Formal testing with respect to user needs, requirements and business processes</strong>, conducted to determine whether a system satisfies the <strong>acceptance criteria</strong> and to enable users, customers or another authorised entity to decide <strong>whether to accept the system</strong> (textbook p.55). The wheel shows the usability-type qualities users judge: satisfaction, learnability, efficiency, memorability, errors.</p>`,
        `<p><strong>Kiểm thử chính thức theo nhu cầu, yêu cầu người dùng và quy trình nghiệp vụ</strong>, nhằm xác định hệ thống có thoả <strong>tiêu chí chấp nhận</strong> hay không và để người dùng, khách hàng hoặc bên có thẩm quyền quyết định <strong>có chấp nhận hệ thống không</strong> (giáo trình trang 55). Bánh xe là các khía cạnh người dùng đánh giá: hài lòng, dễ học, hiệu quả, dễ nhớ, lỗi.</p>`],
      [83, 'Acceptance Testing — objectives',
        `<p>It produces information to assess readiness for deployment and use. Defects may be found, but <strong>finding defects is often not an objective</strong> — and finding a significant number of defects during acceptance may be considered a <strong>major project risk</strong> (they should have been found earlier).</p>`,
        `<p>Nó cung cấp thông tin để đánh giá mức sẵn sàng triển khai và sử dụng. Có thể phát hiện lỗi, nhưng <strong>tìm lỗi thường không phải mục tiêu</strong> — và tìm ra nhiều lỗi ở acceptance có thể bị xem là <strong>rủi ro lớn của dự án</strong> (lẽ ra phải tìm thấy từ trước).</p>`],
      [84, 'Acceptance Testing: UAT',
        `<p><strong>User acceptance testing</strong>: done by <strong>end users</strong>, focused on <strong>business processes</strong>, in a real or simulated operational environment; aim: confidence that the system lets users do what they need with minimum difficulty, cost and risk.</p>`,
        `<p><strong>User acceptance testing</strong>: do <strong>người dùng cuối</strong> làm, tập trung vào <strong>quy trình nghiệp vụ</strong>, trong môi trường vận hành thật hoặc mô phỏng; mục đích: tin rằng hệ thống giúp người dùng làm được việc họ cần với ít khó khăn, chi phí và rủi ro nhất.</p>`],
      [85, 'User acceptance testing — how',
        `<p>The final stage of validation: the customer performs or is closely involved, can run any test they wish (usually from their business processes), and gives the <strong>final sign-off</strong>. Approach: a mix of scripted and unscripted testing; sometimes a "model office" — a realistic replica of the user's workplace.</p>`,
        `<p>Chặng validation cuối cùng: khách hàng tự làm hoặc tham gia sát sao, có thể chạy bất kỳ test nào họ muốn (thường theo quy trình nghiệp vụ của họ), và <strong>ký nghiệm thu cuối</strong>. Cách làm: kết hợp test có kịch bản và không kịch bản; đôi khi dựng "model office" — bản sao thực tế nơi làm việc của người dùng.</p>`],
      [86, 'Why customer / user involvement',
        `<p>Users know what really happens in business situations, the complexity of business relationships, how they would do their work with the system, variants of standard tasks (e.g. country-specific), real cases, and sensible work-arounds. Benefit: they gain a <strong>detailed understanding of the new system</strong>.</p>`,
        `<p>Người dùng biết điều thật sự diễn ra trong nghiệp vụ, độ phức tạp của các quan hệ nghiệp vụ, cách họ sẽ làm việc với hệ thống, các biến thể của tác vụ chuẩn (vd theo từng nước), ví dụ thật, và cách lách hợp lý. Lợi ích: họ có <strong>hiểu biết chi tiết về hệ thống mới</strong>.</p>`],
      [87, 'Acceptance Testing: OAT',
        `<p><strong>Operational acceptance testing</strong>: by <strong>system administrators</strong>, in a simulated production environment. Focus: backups, installation/uninstallation/upgrading, disaster recovery, user management, maintenance, data loading and migration, security, performance. Aim: confidence that admins can keep the system running and recover from adverse events quickly.</p>`,
        `<p><strong>Operational acceptance testing</strong>: do <strong>quản trị hệ thống</strong> làm, trong môi trường production mô phỏng. Trọng tâm: sao lưu, cài đặt/gỡ/nâng cấp, khắc phục thảm hoạ, quản lý người dùng, bảo trì, nạp và chuyển đổi dữ liệu, bảo mật, hiệu năng. Mục đích: tin rằng admin giữ được hệ thống chạy và phục hồi nhanh khi có sự cố.</p>`],
      [88, 'Acceptance Testing: contractual & regulatory',
        `<p><strong>Contractual AT</strong> verifies the system satisfies its <strong>contract</strong> — by users or independent testers. <strong>Regulatory AT</strong> verifies it conforms to <strong>laws, policies and regulations</strong> — by independent testers, possibly with a representative of the regulatory body.</p>`,
        `<p><strong>Contractual AT</strong> kiểm hệ thống thoả <strong>hợp đồng</strong> — do người dùng hoặc tester độc lập làm. <strong>Regulatory AT</strong> kiểm hệ thống tuân thủ <strong>luật, chính sách, quy định</strong> — do tester độc lập làm, có thể có đại diện cơ quan quản lý.</p>`],
      [89, 'Acceptance Testing: alpha & beta',
        `<p><strong>Alpha</strong>: operational testing at the <strong>developer's site</strong>, by roles outside the development organisation. <strong>Beta</strong> (field testing): at an <strong>external site</strong> (the users' own), by outside roles — diverse users and environments cover more combinations. Both are used by makers of commercial off-the-shelf (COTS) software to get feedback before or after release.</p>`,
        `<p><strong>Alpha</strong>: kiểm thử vận hành tại <strong>nơi của bên phát triển</strong>, do người ngoài tổ chức phát triển làm. <strong>Beta</strong> (field testing): tại <strong>nơi bên ngoài</strong> (của chính người dùng), do người ngoài làm — người dùng và môi trường đa dạng phủ được nhiều tổ hợp hơn. Cả hai được các hãng làm phần mềm đóng gói (COTS) dùng để lấy phản hồi trước hoặc sau khi phát hành.</p>`],
      [90, 'Acceptance Testing — the attributes',
        `<p>The full table (objectives, test basis incl. operational documents, test objects incl. recovery systems and hot sites, forms and reports, typical defects) — summarised in the table at the top of this lesson. ("Hot sits" on the slide is a typo for <em>hot sites</em>: standby data centres ready to take over.)</p>`,
        `<p>Bảng đầy đủ (mục tiêu, test basis gồm cả tài liệu vận hành, đối tượng gồm hệ thống phục hồi và hot site, biểu mẫu, báo cáo, lỗi điển hình) — đã tóm tắt ở bảng đầu bài. ("Hot sits" trên slide là lỗi chính tả của <em>hot sites</em>: trung tâm dữ liệu dự phòng sẵn sàng tiếp quản.)</p>`],
      [91, 'Acceptance testing motto',
        `<p>"If you don't have patience to test the system, the system will surely test your patience." Skipped acceptance testing is paid back in production incidents.</p>`,
        `<p>"Nếu bạn không đủ kiên nhẫn để test hệ thống, hệ thống chắc chắn sẽ thử thách lòng kiên nhẫn của bạn." Bỏ qua acceptance testing thì sẽ trả giá bằng sự cố trên production.</p>`],
      [92, 'Question — similarity between system and acceptance testing',
        AE('C — Both focus on the behaviour and capabilities of a whole system or product', 'Their test objects and test bases differ (see the table).'),
        AV('C — Cả hai tập trung vào hành vi và năng lực của cả hệ thống/sản phẩm', 'Đối tượng và test basis của chúng khác nhau (xem bảng).')],
      [93, 'Question — too many defects during acceptance',
        AE('B — A bad situation: finding defects is often not an objective of acceptance testing, and many defects there may be a major project risk', 'Slide 83.'),
        AV('B — Tình huống xấu: tìm lỗi thường không phải mục tiêu của acceptance, và nhiều lỗi ở giai đoạn này có thể là rủi ro lớn của dự án', 'Slide 83.')],
      [94, 'Question — test basis of acceptance testing',
        AE('A — Regulations, legal contracts and standards', 'State diagrams are a system basis, workflows an integration basis.'),
        AV('A — Quy định, hợp đồng pháp lý và tiêu chuẩn', 'State diagram là test basis của system, workflow của integration.')],
      [95, 'Question — a defect found in acceptance testing',
        AE('B — Business rules are not implemented correctly', 'A (cannot complete end-to-end tasks) is the typical system-test failure; C (interface mismatch) is integration.'),
        AV('B — Luật nghiệp vụ được cài đặt sai', 'A (không hoàn thành tác vụ đầu-cuối) là lỗi điển hình của system; C (giao diện không khớp) là integration.')],
      [96, 'Question — system administrators in a simulated production environment',
        AE('B — Operational acceptance testing', 'Slide 87.'),
        AV('B — Operational acceptance testing', 'Slide 87.')],
      [97, 'Question — COTS vendors getting feedback before market release',
        AE('D — Alpha and beta testing', 'Slide 89.'),
        AV('D — Alpha và beta testing', 'Slide 89.')],
      [98, 'Question — fitness for use by intended users',
        AE('A — User acceptance testing', 'Validating fitness for use by intended users in a real or simulated environment is the definition of UAT.'),
        AV('A — User acceptance testing', 'Validate mức phù hợp sử dụng bởi người dùng dự kiến trong môi trường thật/mô phỏng chính là định nghĩa UAT.')],
      [99, 'Question — level focused on confidence more than defects',
        AE('D — Acceptance testing', 'Its first objective is establishing confidence; finding defects is often not an objective.'),
        AV('D — Acceptance testing', 'Mục tiêu hàng đầu là tạo niềm tin; tìm lỗi thường không phải mục tiêu.')],
      [100, 'Review question — where developers are most involved',
        AE('C — Component', 'Component testing is usually done by developers. "Compatible" and "conversion" are not test levels at all.'),
        AV('C — Component', 'Component testing thường do developer làm. "Compatible" và "conversion" không phải cấp test.')],
      [101, 'Review question — component vs system testing',
        AE('B', 'Component test cases come from component/design specs and data models; system test cases from requirement and functional specs and use cases. A is wrong (interfaces are integration), C is wrong (component testing also covers non-functional characteristics), D is wrong (system testing is usually done by independent testers, not users).'),
        AV('B', 'Test case component lấy từ đặc tả thành phần/thiết kế và mô hình dữ liệu; test case system lấy từ đặc tả yêu cầu, đặc tả chức năng và use case. A sai (giao diện là việc của integration), C sai (component testing cũng test phi chức năng), D sai (system testing thường do tester độc lập làm, không phải người dùng).')],
      [102, 'Review question — (repeated in the deck)',
        `<p>The deck shows the same question twice. Same answer: <strong>B</strong>.</p>`,
        `<p>Bộ slide lặp lại đúng câu hỏi trước. Đáp án vẫn là <strong>B</strong>.</p>`],
      [103, 'Review question — use cases are a basis for…',
        AE('B — System', 'Use cases describe end-to-end interactions — a system (and acceptance) test basis. "Load and performance" and "usability" are test types, not levels.'),
        AV('B — System', 'Use case mô tả tương tác đầu-cuối — là test basis của system (và acceptance). "Load and performance" và "usability" là loại test, không phải cấp.')],
      [104, 'Review question — a well-managed test level',
        AE('B — It has a corresponding test objective', 'Characteristic 2 of good testing (slide 4). Levels may overlap; durations and techniques vary.'),
        AV('B — Có mục tiêu test tương ứng', 'Đặc điểm số 2 của kiểm thử tốt (slide 4). Các cấp có thể chồng nhau; thời lượng và kỹ thuật thì tuỳ.')],
      [105, 'Review question — where alpha testing happens',
        AE("B — Developer's end", 'Alpha = at the developer\'s site; beta = at the users\' sites.'),
        AV('B — Phía bên phát triển', 'Alpha = tại nơi của bên phát triển; beta = tại nơi của người dùng.')],
    ]),
    bi(`<h3>🔒 Hidden slides (pptx 79–83): the older "system testing" block</h3>
<p>The deck keeps five hidden slides from the previous syllabus: system testing as the <em>last integration step</em>; <strong>functional</strong> system testing split into requirements-based and business-process-based; <strong>non-functional</strong> requirements are "as important as functional ones, often poorly specified, and must be tested"; the list of non-functional system tests — usability, security, documentation, storage, volume, configuration/installation, reliability, backup/recovery, performance/load/stress. The same material is taught in the visible slides 108–122 (lesson 2.4).</p>
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
<div class="pitfall"><b>Alpha vs beta: remember the place, not the order.</b> Alpha = at the <em>developer's</em> site; beta = at the <em>users'</em> sites. Both are done by people outside the development team — so "alpha testing is done by developers" is false.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Acceptance tests as executable specifications.</b> Many teams now write acceptance criteria in Gherkin (<em>Given … When … Then …</em>) and run them with Cucumber or SpecFlow, so the business-readable criteria are also automated tests (ATDD/BDD — Chapter 9 and Topic 8). The UAT sign-off then covers exploratory checks by users, while the scripted part is already green in the pipeline. <em>Outside this chapter because CTFL treats acceptance testing as a level, not a technique.</em></div>`,
    `<h3>🔒 Slide ẩn (pptx 79–83): khối "system testing" bản cũ</h3>
<p>Bộ slide giữ năm slide ẩn từ syllabus cũ: system testing là <em>bước tích hợp cuối cùng</em>; system testing <strong>chức năng</strong> chia thành dựa trên yêu cầu và dựa trên quy trình nghiệp vụ; yêu cầu <strong>phi chức năng</strong> "quan trọng không kém chức năng, thường được đặc tả kém, và bắt buộc phải test"; danh sách system test phi chức năng — usability, security, documentation, storage, volume, configuration/installation, reliability, backup/recovery, performance/load/stress. Nội dung này được dạy ở các slide hiển thị 108–122 (bài 2.4).</p>
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
<div class="pitfall"><b>Alpha vs beta: nhớ theo địa điểm, không theo thứ tự.</b> Alpha = tại nơi <em>bên phát triển</em>; beta = tại nơi <em>người dùng</em>. Cả hai đều do người ngoài nhóm phát triển làm — nên "alpha testing do developer làm" là sai.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Acceptance test như đặc tả chạy được.</b> Nhiều nhóm hiện viết acceptance criteria bằng Gherkin (<em>Given … When … Then …</em>) và chạy bằng Cucumber hay SpecFlow, nên tiêu chí người nghiệp vụ đọc được cũng chính là test tự động (ATDD/BDD — Chương 9 và Topic 8). Buổi ký UAT khi đó chỉ còn các kiểm tra khám phá của người dùng, phần có kịch bản đã xanh sẵn trong pipeline. <em>Ngoài chương này vì CTFL xem acceptance testing là một cấp, không phải một kỹ thuật.</em></div>`),
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
<div class="callout"><b>Learning objectives.</b> LO-2.3.1 Compare functional, non-functional and white-box testing (K2) · LO-2.3.2 Recognise that functional, non-functional and white-box tests occur at any test level (K1) · LO-2.3.3 Compare the purposes of confirmation testing and regression testing (K2).</div>
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
<div class="callout"><b>Chuẩn đầu ra.</b> LO-2.3.1 So sánh test chức năng, phi chức năng và white-box (K2) · LO-2.3.2 Nhận ra test chức năng, phi chức năng và white-box diễn ra ở mọi cấp (K1) · LO-2.3.3 So sánh mục đích của confirmation testing và regression testing (K2).</div>
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
      [106, 'CONTENT — Test types', `<p>Third block: test types.</p>`, `<p>Khối thứ ba: các loại test.</p>`],
      [107, 'Test Types',
        `<p>A test type is a group of test activities aimed at testing <strong>specific characteristics</strong> of a system or part of it, based on specific objectives. The four branches: functional testing (functions), non-functional testing (quality characteristics), white-box testing (structure/architecture), change-related testing (confirmation/regression).</p>`,
        `<p>Loại test là một nhóm hoạt động kiểm thử nhắm vào <strong>các đặc tính cụ thể</strong> của hệ thống hoặc một phần của nó, theo mục tiêu cụ thể. Bốn nhánh: kiểm thử chức năng (chức năng), phi chức năng (đặc tính chất lượng), white-box (cấu trúc/kiến trúc), liên quan thay đổi (confirmation/regression).</p>`],
      [108, '[1] Functional Testing',
        `<p>The function of a system is <strong>"what" it does</strong>. Functional testing evaluates compliance with functional requirements, which may be written in business requirement specs, epics, user stories, use cases, functional specs — or be undocumented. It should be performed at <strong>all test levels</strong> (with a different focus at each) and from two perspectives: <strong>requirements-based</strong> and <strong>business-process-based</strong>.</p>`,
        `<p>Chức năng của hệ thống là <strong>"cái" nó làm</strong>. Kiểm thử chức năng đánh giá mức tuân thủ yêu cầu chức năng — có thể viết trong đặc tả yêu cầu nghiệp vụ, epic, user story, use case, đặc tả chức năng, hoặc không được viết ra. Nó được thực hiện ở <strong>mọi cấp test</strong> (mỗi cấp một trọng tâm) và theo hai góc nhìn: <strong>dựa trên yêu cầu</strong> và <strong>dựa trên quy trình nghiệp vụ</strong>.</p>`],
      [109, 'Functional requirement & functional specification',
        `<p>Definitions: a <strong>functional requirement</strong> specifies a function that a system or component must perform (ANSI/IEEE 729-1983); a <strong>functional specification</strong> is the document describing in detail the product's characteristics with regard to its intended capability (BS 4778-2, BS 7925-1).</p>`,
        `<p>Định nghĩa: <strong>yêu cầu chức năng</strong> nêu một chức năng mà hệ thống hay thành phần phải thực hiện (ANSI/IEEE 729-1983); <strong>đặc tả chức năng</strong> là tài liệu mô tả chi tiết đặc điểm sản phẩm theo năng lực dự kiến của nó (BS 4778-2, BS 7925-1).</p>`],
      [110, 'Functional testing: requirements-based',
        `<p>Use the requirements specification as the basis: its <strong>table of contents is an initial inventory of test conditions</strong>; for each section or functional area, do a risk analysis to find the most critical areas and decide how deeply to test each one.</p>`,
        `<p>Lấy đặc tả yêu cầu làm cơ sở: <strong>mục lục của nó là danh mục test condition ban đầu</strong>; với mỗi mục hay vùng chức năng, phân tích rủi ro để tìm vùng quan trọng nhất và quyết định test sâu tới đâu.</p>`],
      [111, 'Functional testing: business-process-based',
        `<p>Start from how the business uses the system: expected <strong>user profiles</strong> (what is used most often? what is business-critical?), <strong>business scenarios</strong> (typical transactions start to finish) and <strong>use cases</strong> prepared from real situations.</p>`,
        `<p>Xuất phát từ cách doanh nghiệp dùng hệ thống: <strong>hồ sơ người dùng</strong> dự kiến (chức năng nào dùng nhiều nhất? cái gì sống còn với nghiệp vụ?), <strong>kịch bản nghiệp vụ</strong> (giao dịch điển hình từ đầu tới cuối) và <strong>use case</strong> soạn từ tình huống thật.</p>`],
      [112, 'Functional testing: coverage',
        `<p><strong>Functional coverage</strong> = the extent to which a type of functional element has been exercised, as a percentage. With traceability between tests and requirements you can compute the % of requirements addressed and spot coverage gaps (the traceability matrix of lesson 1.4).</p>`,
        `<p><strong>Functional coverage</strong> = mức độ một loại phần tử chức năng đã được test chạm tới, tính bằng phần trăm. Có truy vết giữa test và yêu cầu thì tính được % yêu cầu đã được test và thấy lỗ hổng bao phủ (bảng truy vết ở bài 1.4).</p>`],
      [113, '[2] Non-functional Testing',
        `<p>Tests <strong>"how well"</strong> the system behaves — usability, performance, efficiency, security, etc. — at <strong>all test levels</strong>. Expected results are defined in terms of external behaviour, so black-box techniques are used: <strong>BVA</strong> for stress conditions in performance testing; <strong>EP</strong> for classes of devices (compatibility) or user groups (usability: novice, experienced, age range, location, education). Speaker note: non-functional requirements are as important as functional ones, often poorly specified, and must be tested.</p>`,
        `<p>Kiểm <strong>"tốt đến đâu"</strong> — khả dụng, hiệu năng, hiệu suất, bảo mật… — ở <strong>mọi cấp test</strong>. Kết quả mong đợi được định nghĩa bằng hành vi bên ngoài nên dùng kỹ thuật black-box: <strong>BVA</strong> cho điều kiện stress khi test hiệu năng; <strong>EP</strong> cho nhóm thiết bị (tương thích) hoặc nhóm người dùng (khả dụng: người mới, người thạo, độ tuổi, vùng miền, trình độ). Ghi chú của thầy/cô: yêu cầu phi chức năng quan trọng không kém chức năng, thường đặc tả kém, và bắt buộc phải test.</p>`],
      [114, 'Non-functional testing: coverage',
        `<p>Non-functional thoroughness is measured by coverage of non-functional elements: with at least one test per major user group, you have 100% coverage of the identified groups. Traceability to non-functional requirements reveals gaps — e.g. an <em>implicit</em> requirement for accessibility for disabled users.</p>`,
        `<p>Độ kỹ của test phi chức năng đo bằng coverage của các phần tử phi chức năng: mỗi nhóm người dùng chính có ít nhất một test thì phủ 100% các nhóm đã xác định. Truy vết tới yêu cầu phi chức năng giúp thấy lỗ hổng — vd yêu cầu <em>ngầm</em> về khả năng truy cập cho người khuyết tật.</p>`],
      [115, 'Performance Tests',
        `<p><strong>Timing</strong> (response and service times, database back-up times); <strong>capacity &amp; volume</strong> (maximum amount or processing rate, number of records, graceful degradation when limits are approached); <strong>endurance</strong> (24-hour operation — robustness, memory allocation/leaks).</p>`,
        `<p><strong>Thời gian</strong> (thời gian đáp ứng, thời gian sao lưu CSDL); <strong>dung lượng &amp; khối lượng</strong> (lượng/tốc độ xử lý tối đa, số bản ghi, suy giảm từ từ khi chạm giới hạn); <strong>độ bền</strong> (chạy 24 giờ — độ ổn định, cấp phát bộ nhớ/rò rỉ).</p>`],
      [116, 'Multi-User Tests',
        `<p><strong>Concurrency</strong> tests (small numbers of users, large benefits — detect record-locking problems); <strong>load</strong> tests (behaviour under realistic multi-user load); <strong>stress</strong> tests (go beyond the limits to know what will happen — particularly relevant for e-commerce).</p>`,
        `<p>Test <strong>đồng thời</strong> (ít người dùng mà lợi lớn — bắt lỗi khoá bản ghi); test <strong>tải</strong> (hành vi dưới tải nhiều người dùng thực tế); test <strong>stress</strong> (vượt giới hạn để biết điều gì xảy ra — đặc biệt quan trọng với thương mại điện tử).</p>`],
      [117, 'Usability Tests',
        `<p>Are messages meaningful to real users? Is the interface coherent and consistent? Enough redundancy of critical information? Within the "human envelope" (7 ± 2 choices)? Feedback such as wait messages? Clear mappings (how to escape)? And the question at the bottom — <em>who should design and perform these tests?</em> Ideally real (representative) users, observed by a usability specialist.</p>`,
        `<p>Thông báo có dễ hiểu với người dùng thật? Giao diện có nhất quán? Thông tin quan trọng có đủ dư thừa? Có nằm trong "giới hạn con người" (7 ± 2 lựa chọn)? Có phản hồi như thông báo chờ? Có đường thoát rõ ràng? Và câu hỏi cuối slide — <em>ai nên thiết kế và thực hiện các test này?</em> Lý tưởng là người dùng thật (đại diện), có chuyên gia usability quan sát.</p>`],
      [118, 'Security Tests',
        `<p>Passwords, encryption, hardware permission devices, levels of access to information, authorisation, covert channels (hidden ways data can leak), physical security.</p>`,
        `<p>Mật khẩu, mã hoá, thiết bị cấp quyền phần cứng, các mức truy cập thông tin, phân quyền, kênh ngầm (đường rò rỉ dữ liệu bị giấu), an ninh vật lý.</p>`],
      [119, 'Configuration and Installation',
        `<p><strong>Configuration</strong> tests: different hardware or software environments, configuration of the system itself, conflicting upgrade paths. <strong>Installation</strong> tests: distribution media and timings; physical aspects (electromagnetic fields, heat, humidity, motion, chemicals, power supplies); uninstalling.</p>`,
        `<p>Test <strong>cấu hình</strong>: môi trường phần cứng/phần mềm khác nhau, cấu hình của chính hệ thống, các đường nâng cấp xung đột. Test <strong>cài đặt</strong>: phương tiện phân phối và thời gian; yếu tố vật lý (trường điện từ, nhiệt, ẩm, rung, hoá chất, nguồn điện); gỡ cài đặt.</p>`],
      [120, 'Reliability / Qualities',
        `<p>"The system will be reliable" cannot be tested; turn it into a measurable target such as "2 failures per year over ten years" or a <strong>mean time between failures (MTBF)</strong>, and use reliability-growth models. Other qualities: maintainability, portability, adaptability…</p>`,
        `<p>"Hệ thống sẽ tin cậy" thì không test được; phải biến thành chỉ tiêu đo được như "2 lần hỏng mỗi năm trong mười năm" hay <strong>thời gian trung bình giữa hai lần hỏng (MTBF)</strong>, và dùng mô hình tăng trưởng độ tin cậy. Các đặc tính khác: khả năng bảo trì, khả chuyển, khả năng thích nghi…</p>`],
      [121, 'Back-up and Recovery',
        `<p>Back-ups (computer functions and manual procedures — where are the tapes stored?) and recovery (a <em>real</em> test of the back-up; manual procedures are unfamiliar, so rehearse them regularly; documentation must be detailed, clear and thorough). The speaker notes add examples: simulate a hardware failure and restore; verify integrity of restored databases; restore a whole system or VM image; and check the <strong>RTO</strong> (recovery time objective — how fast) and <strong>RPO</strong> (recovery point objective — how much data may be lost).</p>`,
        `<p>Sao lưu (chức năng máy và thủ tục tay — băng lưu cất ở đâu?) và phục hồi (thử <em>thật</em> bản sao lưu; thủ tục tay ít dùng nên phải diễn tập thường xuyên; tài liệu phải chi tiết, rõ ràng, đầy đủ). Ghi chú của thầy/cô cho thêm ví dụ: giả lập hỏng phần cứng rồi khôi phục; kiểm tính toàn vẹn của CSDL sau khôi phục; khôi phục cả hệ thống hay image máy ảo; và kiểm <strong>RTO</strong> (thời gian khôi phục mục tiêu — nhanh tới đâu) và <strong>RPO</strong> (điểm khôi phục mục tiêu — được phép mất bao nhiêu dữ liệu).</p>`],
      [122, 'Documentation Testing',
        `<p>Documentation <em>review</em> (accuracy against other documents, consensus on content, documents exist in the right format) and documentation <em>tests</em> (is it usable? does it work? — user manual, maintenance documentation).</p>`,
        `<p><em>Review</em> tài liệu (khớp với tài liệu khác, thống nhất nội dung, có đủ và đúng định dạng) và <em>test</em> tài liệu (dùng được không? làm theo có chạy không? — hướng dẫn sử dụng, tài liệu bảo trì).</p>`],
      [123, '[3] White-box Testing',
        `<p>Tests are derived from the <strong>internal structure or implementation</strong> — code, architecture, workflows, data flows. It can occur at any level but is mostly used in component and component-integration testing; at higher levels it is less likely, except for business-process testing where the "structure" can be business rules.</p>`,
        `<p>Test được suy ra từ <strong>cấu trúc bên trong hay cách cài đặt</strong> — code, kiến trúc, luồng công việc, luồng dữ liệu. Có thể dùng ở mọi cấp nhưng chủ yếu ở component và component integration; ở cấp cao ít hơn, trừ test quy trình nghiệp vụ nơi "cấu trúc" có thể là các luật nghiệp vụ.</p>`],
      [124, 'White-box testing: coverage',
        `<p><strong>Structural coverage</strong> = extent a type of structural element has been exercised, as a %. At component level: code coverage (% of statements or decision outcomes). At component-integration level: architecture-based, e.g. % of interfaces between components exercised.</p>`,
        `<p><strong>Structural coverage</strong> = mức độ một loại phần tử cấu trúc đã được chạy tới, tính bằng %. Ở cấp component: code coverage (% câu lệnh hoặc kết quả quyết định). Ở cấp component integration: dựa trên kiến trúc, vd % giao diện giữa các thành phần đã được chạy.</p>`],
      [125, '[4] Change-related Testing',
        `<p>After a change, test to confirm that it <strong>corrected the defect or implemented the functionality</strong> correctly and has <strong>not caused unforeseen adverse consequences</strong>. Two sub-types: confirmation testing and regression testing.</p>`,
        `<p>Sau một thay đổi, test để khẳng định nó <strong>đã sửa đúng lỗi hoặc cài đúng chức năng</strong> và <strong>không gây hậu quả xấu ngoài dự kiến</strong>. Hai loại con: confirmation testing và regression testing.</p>`],
      [126, 'Confirmation Testing',
        `<p>After a defect is fixed, re-test: at the very least, <strong>re-execute the steps that reproduced the failure</strong> on the new version. Purpose: confirm the <em>original defect</em> is fixed. (Also called re-testing.)</p>`,
        `<p>Sau khi sửa lỗi, test lại: tối thiểu phải <strong>chạy lại các bước đã tái hiện failure</strong> trên phiên bản mới. Mục đích: khẳng định <em>chính lỗi ban đầu</em> đã được sửa. (Còn gọi là re-testing.)</p>`],
      [127, 'Regression Testing (1)',
        `<p>A change in one part of the code may accidentally affect other parts — and changes to the <strong>environment</strong> (OS, library, database version) count too. Regression testing runs tests to detect such unintended side-effects. (The cartoon: close one door and the flies come in through another.)</p>`,
        `<p>Thay đổi ở một chỗ có thể vô tình ảnh hưởng chỗ khác — và thay đổi <strong>môi trường</strong> (hệ điều hành, thư viện, phiên bản CSDL) cũng tính. Regression testing chạy test để phát hiện những tác dụng phụ ngoài ý muốn đó. (Tranh vui: đóng cửa này thì ruồi bay vào cửa khác.)</p>`],
      [128, 'Regression Testing (2)',
        `<p>Regression suites are run many times and evolve slowly, so they are a <strong>strong candidate for automation</strong>, which should start early in the project. Change-related testing is performed at <strong>all test levels</strong>.</p>`,
        `<p>Bộ regression được chạy rất nhiều lần và thay đổi chậm, nên là <strong>ứng viên hàng đầu cho tự động hoá</strong>, và nên tự động hoá từ sớm. Kiểm thử liên quan thay đổi được làm ở <strong>mọi cấp test</strong>.</p>`],
      [129, 'Test types × test levels (functional & non-functional)',
        `<p>The banking example proves "every type at every level". Functional: component — how compound interest is calculated; component integration — how account info from the UI reaches the business logic; system — how account holders apply for a line of credit; system integration — how the system uses an external credit-score microservice; acceptance — how a banker handles a credit application. Non-functional: time of a complex interest calculation; buffer overflow from UI data; portability of the presentation layer on browsers and mobiles; robustness if the microservice does not respond; accessibility of the banker's interface for disabled users.</p>`,
        `<p>Ví dụ ngân hàng chứng minh "loại nào cũng có ở mọi cấp". Chức năng: component — cách tính lãi kép; component integration — thông tin tài khoản từ giao diện tới logic nghiệp vụ; system — chủ tài khoản đăng ký hạn mức tín dụng; system integration — hệ thống gọi microservice chấm điểm tín dụng bên ngoài; acceptance — nhân viên ngân hàng xử lý hồ sơ tín dụng. Phi chức năng: thời gian tính lãi phức tạp; tràn bộ đệm từ dữ liệu giao diện; khả chuyển của tầng giao diện trên trình duyệt và điện thoại; độ bền khi microservice không phản hồi; khả năng truy cập của giao diện nhân viên cho người khuyết tật.</p>`],
      [130, 'Test types × test levels (white-box & change-related)',
        `<p>White-box: 100% statement and decision coverage for financial calculation components; coverage of how each screen passes data to the next; coverage of web-page sequences in a credit application; coverage of all inquiry types sent to the credit-score service; coverage of all supported bank-to-bank file structures and value ranges. Change-related: automated component regression in the CI pipeline; confirmation tests for interface defects on check-in; re-running a whole workflow's tests if any screen changes; re-running microservice interaction tests when the service changes; re-running previously failed acceptance tests after fixes.</p>`,
        `<p>White-box: 100% statement và decision coverage cho các thành phần tính toán tài chính; phủ cách từng màn hình chuyển dữ liệu sang màn sau; phủ chuỗi trang web khi đăng ký tín dụng; phủ mọi loại truy vấn gửi tới dịch vụ chấm điểm; phủ mọi cấu trúc file và dải giá trị chuyển tiền liên ngân hàng. Liên quan thay đổi: regression tự động cho component trong pipeline CI; confirmation test cho lỗi giao diện khi check-in bản sửa; chạy lại toàn bộ test của một luồng khi có màn hình thay đổi; chạy lại test tương tác microservice khi dịch vụ đổi; chạy lại các acceptance test từng fail sau khi sửa.</p>`],
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
<div class="pitfall"><b>Confirmation ≠ regression.</b> Confirmation (re-testing) asks "is <em>this</em> defect fixed?" and reruns the failing steps. Regression asks "did the change break anything <em>else</em>?" and reruns tests that used to pass. Both are change-related, both happen at every level.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>ISO/IEC 25010 — the full list of non-functional characteristics.</b> The slides list performance, usability, security, reliability, portability… ISO 25010 organises them into eight product-quality characteristics: functional suitability, performance efficiency, compatibility, usability (now "interaction capability"), reliability, security, maintainability and portability (the 2023 revision adds <em>safety</em>). Spillner's book uses this model in §2.2.1; it is the checklist professional testers use so that no "-ility" is forgotten. <em>Outside the CTFL syllabus, which only gives examples.</em></div>`,
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
<div class="pitfall"><b>Confirmation ≠ regression.</b> Confirmation (re-testing) hỏi "<em>lỗi này</em> đã sửa chưa?" và chạy lại các bước từng fail. Regression hỏi "thay đổi có làm hỏng <em>chỗ khác</em> không?" và chạy lại các test từng pass. Cả hai đều là loại liên quan thay đổi, và đều có ở mọi cấp.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>ISO/IEC 25010 — danh sách đầy đủ các đặc tính phi chức năng.</b> Slide chỉ nêu hiệu năng, khả dụng, bảo mật, tin cậy, khả chuyển… ISO 25010 xếp chúng thành tám đặc tính chất lượng sản phẩm: phù hợp chức năng, hiệu suất, tương thích, khả dụng (bản mới gọi "interaction capability"), tin cậy, bảo mật, khả năng bảo trì và khả chuyển (bản 2023 thêm <em>an toàn</em>). Sách Spillner dùng mô hình này ở §2.2.1; đây là checklist tester chuyên nghiệp dùng để không bỏ sót "-ility" nào. <em>Ngoài syllabus CTFL, vốn chỉ nêu ví dụ.</em></div>`),
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
<div class="callout"><b>Learning objectives.</b> LO-2.4.1 Summarise triggers for maintenance testing (K2) · LO-2.4.2 Describe the role of impact analysis in maintenance testing (K2).</div>`,
    `<span class="eyebrow">Chương 2 · Bài 2.5 · SWT2 slide 131–143</span>
<h2>Kiểm thử bảo trì và test plan tổng thể</h2>
<p class="lead">Phần lớn phần mềm dành phần lớn đời mình trong vận hành và bị thay đổi liên tục. <strong>Kiểm thử bảo trì</strong> test các thay đổi đó và bảo vệ những gì đang chạy tốt. Bộ slide khép lại Chương 2 bằng <strong>khung test plan IEEE 829</strong> kinh điển — bộ xương của test plan bạn sẽ viết ở Lab 3 và đồ án.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-2.4.1 Tóm tắt các tác nhân kích hoạt kiểm thử bảo trì (K2) · LO-2.4.2 Mô tả vai trò của phân tích tác động trong kiểm thử bảo trì (K2).</div>`),
    walkHead(D, 131, 143),
    walk(D, [
      [131, 'CONTENT — Maintenance testing', `<p>Last block of the chapter.</p>`, `<p>Khối cuối của chương.</p>`],
      [132, 'Maintenance testing',
        `<p>Testing to <strong>preserve quality</strong>. It differs from development testing: a different sequence (development testing runs bottom-up, maintenance testing <strong>top-down</strong>), different test data (a live profile), <strong>breadth tests</strong> for overall confidence plus <strong>depth tests</strong> on the changes and critical areas — and it is predominantly <strong>regression testing</strong>.</p>`,
        `<p>Kiểm thử để <strong>giữ gìn chất lượng</strong>. Khác kiểm thử khi phát triển: thứ tự khác (phát triển test từ dưới lên, bảo trì test <strong>từ trên xuống</strong>), dữ liệu khác (hồ sơ dữ liệu thật), <strong>test diện rộng</strong> để có niềm tin chung cộng <strong>test chiều sâu</strong> ở chỗ thay đổi và vùng quan trọng — và chủ yếu là <strong>regression testing</strong>.</p>`],
      [133, 'What to test in maintenance testing',
        `<p>Triggers: <strong>modification</strong> (enhancements, corrective and emergency fixes, environment changes, patches), <strong>migration</strong> (to another platform — including data conversion), <strong>retirement</strong> (data archiving and restoring). <strong>Impact analysis</strong> asks: what could this change affect? how important is a fault there? how much should we test — the most important affected areas, the areas most likely affected, or the whole system? Answer: "it depends" — on risk.</p>`,
        `<p>Tác nhân: <strong>sửa đổi</strong> (nâng cấp, sửa lỗi thường và khẩn cấp, thay đổi môi trường, bản vá), <strong>chuyển đổi</strong> (sang nền tảng khác — kèm chuyển đổi dữ liệu), <strong>ngừng sử dụng</strong> (lưu trữ và khôi phục dữ liệu). <strong>Phân tích tác động</strong> hỏi: thay đổi này có thể ảnh hưởng tới đâu? lỗi ở đó quan trọng tới mức nào? test bao nhiêu — vùng bị ảnh hưởng quan trọng nhất, vùng dễ bị ảnh hưởng nhất, hay cả hệ thống? Trả lời: "tuỳ" — tuỳ vào rủi ro.</p>`],
      [134, 'Poor or missing specifications',
        `<p>A common maintenance reality. What to do: consider what the system should do (talk with users); document your assumptions and let others review them; improve the situation by documenting what you know and find out; and track the cost of working with poor specs to build a business case for better ones.</p>`,
        `<p>Chuyện thường ngày khi bảo trì. Cách làm: nghĩ xem hệ thống lẽ ra phải làm gì (hỏi người dùng); ghi lại giả định và cho người khác review; cải thiện dần bằng cách ghi lại những gì đã biết và tìm hiểu được; và theo dõi chi phí khi phải làm với đặc tả kém để có lý lẽ đòi đặc tả tốt hơn.</p>`],
      [135, 'What should the system do?',
        `<p>Alternatives when there is no spec: assume the current behaviour is right (except for the specific change) and use the <strong>existing system as the regression baseline</strong>; look in user manuals; ask the experts — the current users. Key sentence: <em>without a specification you cannot really test, only explore — you can validate, but not verify.</em></p>`,
        `<p>Các cách khi không có đặc tả: coi hành vi hiện tại là đúng (trừ phần đang thay đổi) và dùng <strong>hệ thống cũ làm mốc cho regression</strong>; xem hướng dẫn sử dụng; hỏi chuyên gia — chính người dùng hiện tại. Câu then chốt: <em>không có đặc tả thì không thật sự test được mà chỉ thăm dò — có thể validate nhưng không verify được.</em></p>`],
      [136, '(Before planning a set of tests)',
        `<p>Groundwork before any test plan: set the organisational test strategy; identify the people involved (sponsors, testers, QA, development, support); examine the test basis (requirements or functional specs); set up the test organisation and infrastructure; define deliverables and the reporting structure (after TMap®, Pol &amp; van Veenendaal, 1998).</p>`,
        `<p>Việc chuẩn bị trước mọi test plan: xác định chiến lược test của tổ chức; xác định những người liên quan (nhà tài trợ, tester, QA, phát triển, hỗ trợ); xem xét test basis (yêu cầu hoặc đặc tả chức năng); dựng tổ chức và hạ tầng test; định nghĩa sản phẩm bàn giao và cơ chế báo cáo (theo TMap®, Pol &amp; van Veenendaal, 1998).</p>`],
      [137, 'High-level test planning — questions',
        `<p>Discussion prompts: what is the purpose of a high-level test plan (it communicates to <em>all</em> parties involved)? why have one? what should it contain — what is your standard? have you ever forgotten something important? what is <em>not</em> in a test plan (the detailed test cases — those live in test design and case specifications)?</p>`,
        `<p>Câu hỏi gợi mở: test plan tổng thể để làm gì (nó truyền đạt tới <em>mọi</em> bên liên quan)? vì sao nên có? phải chứa gì — chuẩn của bạn là gì? bạn đã từng quên điều gì quan trọng chưa? cái gì <em>không</em> nằm trong test plan (các test case chi tiết — chúng nằm trong đặc tả thiết kế và đặc tả test case)?</p>`],
      [138, 'High-level Test Plan (IEEE 829) — items 1–3',
        `<p>1 <strong>Test plan identifier</strong>. 2 <strong>Introduction</strong> — software items and features to be tested; references to project authorisation, project plan, QA plan, configuration-management plan, policies and standards. 3 <strong>Test items</strong> — including version/revision, how they are transmitted, references to software documentation.</p>`,
        `<p>1 <strong>Mã test plan</strong>. 2 <strong>Giới thiệu</strong> — phần mềm và tính năng sẽ test; tham chiếu quyết định dự án, kế hoạch dự án, kế hoạch QA, kế hoạch quản lý cấu hình, chính sách và chuẩn. 3 <strong>Hạng mục test</strong> — kèm phiên bản, cách bàn giao, tham chiếu tài liệu phần mềm.</p>`],
      [139, 'Items 4–5',
        `<p>4 <strong>Features to be tested</strong> — with the test design specification/techniques. 5 <strong>Features not to be tested</strong> — and the reasons for excluding them (writing this down protects the team when someone later asks "why wasn't X tested?").</p>`,
        `<p>4 <strong>Tính năng sẽ test</strong> — kèm đặc tả thiết kế test/kỹ thuật. 5 <strong>Tính năng không test</strong> — và lý do loại trừ (ghi ra để bảo vệ nhóm khi sau này có người hỏi "sao không test X?").</p>`],
      [140, 'Items 6–8',
        `<p>6 <strong>Approach</strong> — activities, techniques and tools, detailed enough to estimate cost; the degree of comprehensiveness (e.g. coverage) and other completion criteria (e.g. faults); constraints (environment, staff, deadlines). 7 <strong>Item pass/fail criteria</strong>. 8 <strong>Suspension and resumption criteria</strong> — when to stop all or part of testing and which activities to repeat on resuming.</p>`,
        `<p>6 <strong>Cách tiếp cận</strong> — hoạt động, kỹ thuật, công cụ, đủ chi tiết để ước lượng chi phí; mức độ đầy đủ (vd coverage) và tiêu chí hoàn thành khác (vd số lỗi); ràng buộc (môi trường, nhân sự, hạn chót). 7 <strong>Tiêu chí đạt/không đạt</strong> của từng hạng mục. 8 <strong>Tiêu chí tạm dừng và tiếp tục</strong> — khi nào dừng toàn bộ hay một phần việc test và phải lặp lại gì khi tiếp tục.</p>`],
      [141, 'Item 9 — Test deliverables',
        `<p>Test plan, test design specification, test case specification, test procedure specification, test item transmittal reports, test logs, test incident reports, test summary reports — the IEEE 829 document set.</p>`,
        `<p>Test plan, đặc tả thiết kế test, đặc tả test case, đặc tả thủ tục test, báo cáo bàn giao hạng mục test, test log, báo cáo sự cố test, báo cáo tổng kết test — bộ tài liệu IEEE 829.</p>`],
      [142, 'Items 10–12',
        `<p>10 <strong>Testing tasks</strong> with inter-task dependencies and special skills. 11 <strong>Environment</strong> — physical, hardware, software, tools, mode of usage, security, office space. 12 <strong>Responsibilities</strong> — who manages, designs, prepares, executes, witnesses, checks, resolves issues, provides the environment and the software.</p>`,
        `<p>10 <strong>Công việc test</strong> kèm phụ thuộc giữa các việc và kỹ năng đặc biệt. 11 <strong>Môi trường</strong> — vật lý, phần cứng, phần mềm, công cụ, cách dùng, bảo mật, chỗ làm việc. 12 <strong>Trách nhiệm</strong> — ai quản lý, thiết kế, chuẩn bị, thực thi, chứng kiến, kiểm tra, xử lý vấn đề, cung cấp môi trường và phần mềm.</p>`],
      [143, 'Items 13–16',
        `<p>13 <strong>Staffing and training needs</strong>. 14 <strong>Schedule</strong> — test milestones, item transmittal milestones, extra milestones (environment ready), resources and when. 15 <strong>Risks and contingencies</strong> — a contingency plan per identified risk. 16 <strong>Approvals</strong> — names and dates.</p>`,
        `<p>13 <strong>Nhu cầu nhân sự và đào tạo</strong>. 14 <strong>Lịch</strong> — mốc test, mốc bàn giao hạng mục, mốc bổ sung (môi trường sẵn sàng), nguồn lực và thời điểm. 15 <strong>Rủi ro và phương án dự phòng</strong> — mỗi rủi ro một phương án. 16 <strong>Phê duyệt</strong> — tên người duyệt và ngày.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — impact analysis for a maintenance change</h3>
<p><b>Change.</b> A university portal changes its grade rounding from "round half up to 0.5" to "round to 0.1" (a <em>modification</em> trigger).</p>
<ol>
<li><b>What could it affect?</b> Search the code for the rounding function: used by the transcript page, the GPA calculator, the scholarship-ranking report and the export to the Ministry file.</li>
<li><b>How important is a fault there?</b> GPA and scholarship ranking → high impact (money, fairness); transcript display → medium; export → high (regulatory).</li>
<li><b>How much to test?</b> Depth tests on the rounding function (boundaries 7.94/7.95/7.96), the GPA calculator and the scholarship report; breadth regression on every page that shows grades; confirmation of the Ministry file format.</li>
<li><b>No spec for the old ranking report?</b> Use the current production output for last semester as the regression baseline (slide 135).</li>
</ol>
<p><b>Template to use for the plan:</b> the 16 IEEE 829 items above map onto the course's templates in <em>05.Templates</em> — Report5.1 Unit Test, Report5.2 Integration Test, Report5.3 System Test (explained in the Lab 3 section of this course).</p>
<div class="pitfall"><b>Two statements to get right.</b> "Maintenance testing is only needed for new features" — false: fixes, environment changes, migrations and retirement also trigger it. "Impact analysis is done after the change is released" — false: it is done <em>before</em>, to decide how much regression testing is needed.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Test impact analysis in CI.</b> Large codebases cannot run every regression test on every commit. Tools such as Bazel, Gradle's test selection or Microsoft's Test Impact Analysis map each test to the code it executes (from coverage data) and run only the tests touched by the changed files — automated impact analysis. Google reports running only the affected subset of its tens of millions of tests on each change. <em>Outside the syllabus because CTFL treats impact analysis as a manual, analytical activity.</em></div>`,
    `<h3>Ví dụ có lời giải · Phân tích tác động cho một thay đổi bảo trì</h3>
<p><b>Thay đổi.</b> Cổng thông tin trường đổi cách làm tròn điểm từ "làm tròn tới 0,5" sang "làm tròn tới 0,1" (tác nhân <em>sửa đổi</em>).</p>
<ol>
<li><b>Có thể ảnh hưởng tới đâu?</b> Tìm hàm làm tròn trong code: được dùng ở trang bảng điểm, bộ tính GPA, báo cáo xét học bổng và file xuất nộp Bộ.</li>
<li><b>Lỗi ở đó quan trọng tới mức nào?</b> GPA và xếp hạng học bổng → tác động cao (tiền, công bằng); hiển thị bảng điểm → trung bình; file xuất → cao (quy định).</li>
<li><b>Test bao nhiêu?</b> Test chiều sâu ở hàm làm tròn (biên 7,94/7,95/7,96), bộ tính GPA và báo cáo học bổng; regression diện rộng mọi trang có hiển thị điểm; xác nhận định dạng file nộp Bộ.</li>
<li><b>Báo cáo xếp hạng cũ không có đặc tả?</b> Dùng output trên production của học kỳ trước làm mốc regression (slide 135).</li>
</ol>
<p><b>Mẫu dùng để viết kế hoạch:</b> 16 mục IEEE 829 ở trên tương ứng với các template trong <em>05.Templates</em> của môn — Report5.1 Unit Test, Report5.2 Integration Test, Report5.3 System Test (giải thích trong phần Lab 3 của khoá này).</p>
<div class="pitfall"><b>Hai câu phải nắm chắc.</b> "Kiểm thử bảo trì chỉ cần khi có tính năng mới" — sai: sửa lỗi, đổi môi trường, chuyển đổi và ngừng sử dụng cũng kích hoạt nó. "Phân tích tác động làm sau khi phát hành thay đổi" — sai: làm <em>trước</em>, để quyết định cần regression bao nhiêu.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Test impact analysis trong CI.</b> Codebase lớn không thể chạy mọi regression test cho mỗi commit. Các công cụ như Bazel, test selection của Gradle hay Test Impact Analysis của Microsoft ánh xạ mỗi test tới đoạn code nó chạy qua (từ dữ liệu coverage) và chỉ chạy các test chạm tới file vừa đổi — phân tích tác động được tự động hoá. Google cho biết họ chỉ chạy tập con bị ảnh hưởng trong hàng chục triệu test mỗi khi có thay đổi. <em>Ngoài giáo trình vì CTFL xem phân tích tác động là hoạt động phân tích thủ công.</em></div>`),
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
<p><b>Requirement (from the FA23 practical exam):</b> "Tên quyết định kiểm tra is a required string of 50–255 characters; the first character must not be a number; no special characters or blanks."</p>
<table>
<thead><tr><th>Level</th><th>What you would test</th><th>Technique</th></tr></thead>
<tbody>
<tr><td>CT</td><td>the validator method <code>isValidDecisionName(String)</code>: lengths 49/50/255/256, first char digit, a space, a special char</td><td>EP + BVA (black-box on the method), then branch coverage (white-box)</td></tr>
<tr><td>CIT</td><td>the form sends the name to the service; an error from the service comes back to the form</td><td>API/function integration test</td></tr>
<tr><td>ST</td><td>the whole "Create inspection decision" function against the SRS, incl. the document-upload rules</td><td>EP + BVA + decision table, black-box through the UI</td></tr>
<tr><td>UAT</td><td>a department head creates a real decision end-to-end</td><td>business-process-based</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why FPT reports split "integration" in two.</b> CTFL has one integration level with two sub-levels; industry (and FPT Software's templates) often report them separately because different people do them: CIT by developers with API tools such as Postman, SIT by the test team against external systems. The capstone Report5 "Integration Test" template is really a CIT/SIT report. <em>Outside the syllabus, which only names the two sub-levels.</em></div>`,
    `<h3>Ví dụ có lời giải · Dùng bảng cho một yêu cầu thật</h3>
<p><b>Yêu cầu (trong đề PE FA23):</b> "Tên quyết định kiểm tra là chuỗi bắt buộc, dài 50–255 ký tự; ký tự đầu không được là số; không có ký tự đặc biệt hay khoảng trắng."</p>
<table>
<thead><tr><th>Cấp</th><th>Test cái gì</th><th>Kỹ thuật</th></tr></thead>
<tbody>
<tr><td>CT</td><td>phương thức kiểm tra <code>isValidDecisionName(String)</code>: độ dài 49/50/255/256, ký tự đầu là số, có khoảng trắng, có ký tự đặc biệt</td><td>EP + BVA (black-box trên phương thức), rồi branch coverage (white-box)</td></tr>
<tr><td>CIT</td><td>form gửi tên sang service; lỗi từ service trả về form</td><td>test tích hợp API/chức năng</td></tr>
<tr><td>ST</td><td>cả chức năng "Tạo quyết định kiểm tra" so với SRS, kể cả luật đính kèm tài liệu</td><td>EP + BVA + decision table, black-box qua giao diện</td></tr>
<tr><td>UAT</td><td>trưởng phòng tạo một quyết định thật từ đầu tới cuối</td><td>dựa trên quy trình nghiệp vụ</td></tr>
</tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao báo cáo ở FPT tách "integration" làm hai.</b> CTFL có một cấp integration với hai cấp con; thực tế (và template của FPT Software) thường báo cáo riêng vì do người khác nhau làm: CIT do developer làm bằng công cụ gọi API như Postman, SIT do nhóm test làm với hệ thống bên ngoài. Template Report5 "Integration Test" của đồ án thực chất là báo cáo CIT/SIT. <em>Ngoài giáo trình vì syllabus chỉ nêu tên hai cấp con.</em></div>`),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz 2 ──────────────────────────────── */
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ2 = {
  title: 'Quiz 2 — Testing throughout the SDLC (all SWT2 slide questions)|||Quiz 2 — Kiểm thử trong SDLC (toàn bộ câu hỏi trên slide SWT2)',
  slug: 'swt301-quiz-2',
  type: 'QUIZ',
  description: '50 câu: đủ 40 câu "Question/Review Question" trên slide SWT2 (đáp án đã giải trong bài 2.1–2.3) + 10 câu về stub/driver, loại test, bảo trì, IEEE 829 và bảng Overview.',
  quiz: {
    timeLimitSeconds: 3000,
    questions: [
      q('What does the software development lifecycle describe? (SWT2 s.25)|||Vòng đời phát triển phần mềm mô tả gì? (SWT2 s.25)', ['The types of activities performed in software development projects|||Các loại hoạt động trong dự án phát triển phần mềm', 'The types of test activities performed|||Các loại hoạt động kiểm thử', 'The functional and non-functional requirements|||Các yêu cầu chức năng và phi chức năng'], 0),
      q('Characteristics of good testing: 1 each level has its own objective; 2 analysis/design start only at the end of the development activity; 3 every development activity has a test activity; 4 testers help define requirements. (s.26)|||Đặc điểm kiểm thử tốt: 1 mỗi cấp có mục tiêu riêng; 2 phân tích/thiết kế chỉ bắt đầu khi hoạt động phát triển xong; 3 mỗi hoạt động phát triển có hoạt động test; 4 tester tham gia định nghĩa yêu cầu. (s.26)', ['1 only|||Chỉ 1', '1, 3, 4 correct; 2 wrong|||1, 3, 4 đúng; 2 sai', '1, 3 correct; 2, 4 wrong|||1, 3 đúng; 2, 4 sai'], 1),
      q('Best definition of an incremental development model? (s.27)|||Định nghĩa đúng nhất của mô hình tăng dần? (s.27)', ['Requirements, design and testing done in a series with added pieces|||Yêu cầu, thiết kế, test làm thành chuỗi, mỗi lần thêm một phần', 'A phase begins when the previous is complete|||Pha sau bắt đầu khi pha trước xong', 'Testing is a separate phase after development|||Kiểm thử là pha riêng sau phát triển', 'Testing is added as an increment|||Kiểm thử được thêm như một phần tăng'], 0),
      q('True statement about the V-model? (s.28)|||Câu đúng về V-model? (s.28)', ['Testing starts when the code is complete|||Kiểm thử bắt đầu khi code xong', 'The test process is integrated with the development process|||Quy trình test tích hợp với quy trình phát triển', 'Software is built in increments|||Phần mềm được xây theo từng phần tăng', 'All activities are completed sequentially|||Mọi hoạt động làm tuần tự'], 1),
      q('Waterfall: 1 sequential; 2 testing after development; 3 best for small organisations; 4 small iterations. (s.29)|||Waterfall: 1 tuần tự; 2 test sau phát triển; 3 tốt nhất cho tổ chức nhỏ; 4 chia vòng lặp nhỏ. (s.29)', ['1, 3|||1, 3', '1, 4|||1, 4', '2, 3|||2, 3', '1, 2|||1, 2'], 3),
      q('The V-model can be considered a… (s.30)|||V-model được xem là mô hình… (s.30)', ['Sequential model|||Tuần tự', 'Iterative model|||Lặp', 'Incremental model|||Tăng dần'], 0),
      q('In the V-model, where does the client see the product and give feedback? (s.31)|||Trong V-model, khách hàng xem sản phẩm và phản hồi ở cấp nào? (s.31)', ['Unit testing', 'Integration testing', 'System testing', 'Acceptance testing'], 3),
      q('Main difference between waterfall and V-model? (s.32)|||Khác biệt chính giữa waterfall và V-model? (s.32)', ['Waterfall sequential, V iterative|||Waterfall tuần tự, V lặp', 'V-model applies early testing; waterfall does not|||V-model áp dụng kiểm thử sớm; waterfall không', 'V has one type of requirement, waterfall two|||V có một loại yêu cầu, waterfall hai'], 1),
      q('RUP divides the project into iterations of… (s.33)|||RUP chia dự án thành các vòng lặp dài… (s.33)', ['Relatively short (1–4 weeks)|||Tương đối ngắn (1–4 tuần)', 'Relatively long (2–3 months)|||Tương đối dài (2–3 tháng)'], 1),
      q('Scrum: 1 large 2–3-month iterations; 2 tester writes the requirements document; 3 retrospective at the end of each iteration. (s.34)|||Scrum: 1 vòng lặp lớn 2–3 tháng; 2 tester viết tài liệu yêu cầu; 3 retrospective cuối mỗi vòng. (s.34)', ['1 correct|||1 đúng', '1 & 2 correct|||1 & 2 đúng', '1 & 3 correct|||1 & 3 đúng', '3 correct; 1 & 2 wrong|||3 đúng; 1 & 2 sai'], 3),
      q('Correct statement about Kanban? (s.35)|||Câu đúng về Kanban? (s.35)', ['Fixed-length iterations|||Vòng lặp độ dài cố định', 'No overlap between phases|||Không chồng lấn giữa các pha', 'With or without fixed-length iterations|||Có hoặc không có vòng lặp cố định'], 2),
      q('Which is NOT a test level? (s.40)|||Đâu KHÔNG phải cấp test? (s.40)', ['Component testing', 'Functional testing', 'System integration testing'], 1),
      q('Test levels: 1 instance of the test process; 2 universal in all companies; 3 groups of activities managed together; 4 each needs a suitable environment. (s.41)|||Cấp test: 1 là một phiên bản của quy trình test; 2 chung cho mọi công ty; 3 nhóm hoạt động được quản lý cùng nhau; 4 mỗi cấp cần môi trường phù hợp. (s.41)', ['1, 2, 3', '1, 3, 4', '2, 3, 4', '1, 2, 4'], 1),
      q('Correct definition of component testing? (s.48)|||Định nghĩa đúng của component testing? (s.48)', ['Testing interactions between components|||Test tương tác giữa thành phần', 'Testing components that are separately testable|||Test thành phần có thể test riêng', 'Testing a whole system|||Test cả hệ thống'], 1),
      q('An objective of component testing? (s.49)|||Một mục tiêu của component testing? (s.49)', ["Building confidence in the component's quality|||Tạo niềm tin vào chất lượng thành phần", 'Confidence in the interfaces|||Niềm tin vào giao diện', 'Validating the system is complete|||Validate hệ thống hoàn chỉnh'], 0),
      q('Test basis for component testing? (s.50)|||Test basis cho component testing? (s.50)', ['Use cases, workflows, sequence diagrams', 'Epics, user stories, state diagrams, risk reports', 'Detailed design, code, data model|||Thiết kế chi tiết, code, mô hình dữ liệu'], 2),
      q('Defect typically found in component testing? (s.51)|||Lỗi điển hình tìm thấy ở component testing? (s.51)', ['Incorrect sequencing/timing of interface calls|||Sai thứ tự/thời điểm gọi giao diện', 'Incorrect code and logic|||Sai code và logic', 'Incorrect control/data flows in the system|||Sai luồng điều khiển/dữ liệu trong hệ thống'], 1),
      q('"Requirements converted to test cases before the software is developed, then repeatedly testing against all test cases" defines… (s.52)|||"Yêu cầu được chuyển thành test case trước khi phát triển, rồi liên tục test lại với toàn bộ test case" là định nghĩa của… (s.52)', ['Component testing', 'Test-driven development', 'Test levels'], 1),
      q('Integration testing focuses on… (s.70)|||Integration testing tập trung vào… (s.70)', ['Testing code as early as possible|||Test code càng sớm càng tốt', 'Interactions between components or systems|||Tương tác giữa thành phần hoặc hệ thống', 'Functionality of each separate component|||Chức năng từng thành phần riêng'], 1),
      q('Component integration testing is mostly done by (…) and system integration testing by (…). (s.71)|||Tích hợp thành phần chủ yếu do (…) làm và tích hợp hệ thống do (…) làm. (s.71)', ['developer – tester', 'tester – developer', 'tester – tester', 'tester – client'], 0),
      q('Test basis for integration testing? (s.72)|||Test basis cho integration testing? (s.72)', ['Epics, user stories, state diagrams, risk reports', 'Use cases, workflows, sequence diagrams', 'Detailed design, code, data model', 'System under test, forms, business processes'], 1),
      q('Defect typically found in integration testing? (s.73)|||Lỗi điển hình ở integration testing? (s.73)', ['Incorrect code and logic|||Sai code và logic', 'Incorrect control/data flows within the system|||Sai luồng điều khiển/dữ liệu trong hệ thống', 'Incorrect sequencing or timing of interface calls|||Sai thứ tự hoặc thời điểm gọi giao diện', 'Contractual/regulatory requirements not met|||Không thoả hợp đồng/quy định'], 2),
      q('Which sentence about the scope of integration is correct? (s.74)|||Câu nào đúng về phạm vi tích hợp? (s.74)', ['Greater scope → easier to isolate defects|||Phạm vi càng lớn càng dễ cô lập lỗi', 'Smaller scope → harder to isolate|||Phạm vi càng nhỏ càng khó cô lập', 'Isolating defects is always difficult|||Cô lập lỗi luôn khó', 'Greater scope → harder to isolate defects|||Phạm vi càng lớn càng khó cô lập lỗi'], 3),
      q('Correct definition of system testing? (s.78)|||Định nghĩa đúng của system testing? (s.78)', ['Testing separately testable components|||Test thành phần riêng', 'Testing the behaviour and capabilities of a whole system|||Test hành vi và năng lực của cả hệ thống', 'Testing interactions between components|||Test tương tác giữa thành phần'], 1),
      q('System testing: 1 environment like production; 2 by independent testers relying on specifications; 3 finding defects is often not an objective. (s.79)|||System testing: 1 môi trường giống production; 2 do tester độc lập dựa vào đặc tả; 3 tìm lỗi thường không phải mục tiêu. (s.79)', ['1 & 3', '2 & 3', '1 & 2', '1, 2, 3'], 2),
      q('Test basis of system testing? (s.80)|||Test basis của system testing? (s.80)', ['Detailed design, code, data model', 'Epics & user stories, state diagrams, risk analysis reports', 'Use cases, workflows, sequence diagrams'], 1),
      q('A test object of system testing? (s.81)|||Đối tượng của system testing? (s.81)', ['Applications, operating systems|||Ứng dụng, hệ điều hành', 'Reports, forms|||Báo cáo, biểu mẫu', 'APIs, microservices'], 0),
      q('Similarity between system and acceptance testing? (s.92)|||Điểm giống giữa system và acceptance testing? (s.92)', ['Same test objects|||Cùng đối tượng test', 'Same test basis|||Cùng test basis', 'Both focus on the behaviour and capabilities of a whole system|||Cả hai tập trung vào hành vi và năng lực cả hệ thống'], 2),
      q('Many defects reported during acceptance testing indicate… (s.93)|||Có quá nhiều lỗi ở giai đoạn acceptance cho thấy… (s.93)', ['A good situation: quality is increasing|||Tốt: chất lượng đang tăng', 'A bad situation: finding defects is often not an acceptance objective; many defects may be a major project risk|||Xấu: tìm lỗi thường không phải mục tiêu của acceptance; nhiều lỗi có thể là rủi ro lớn'], 1),
      q('Test basis of acceptance testing? (s.94)|||Test basis của acceptance testing? (s.94)', ['Regulations, legal contracts and standards|||Quy định, hợp đồng pháp lý, tiêu chuẩn', 'State diagrams', 'Workflows'], 0),
      q('A defect found in acceptance testing? (s.95)|||Lỗi tìm thấy ở acceptance testing? (s.95)', ['Failure to carry out end-to-end tasks|||Không hoàn thành tác vụ đầu-cuối', 'Business rules not implemented correctly|||Luật nghiệp vụ cài sai', 'Interface mismatch|||Giao diện không khớp'], 1),
      q('System administrators testing in a simulated production environment is… (s.96)|||Quản trị hệ thống test trong môi trường production mô phỏng là… (s.96)', ['UAT', 'OAT', 'Contractual & regulatory AT', 'Alpha & beta'], 1),
      q('COTS vendors getting feedback from users before market release use… (s.97)|||Hãng phần mềm đóng gói lấy phản hồi người dùng trước khi ra thị trường dùng… (s.97)', ['UAT', 'OAT', 'Contractual & regulatory AT', 'Alpha & beta testing'], 3),
      q('Validating fitness for use by intended users in a real/simulated environment is… (s.98)|||Validate mức phù hợp sử dụng bởi người dùng dự kiến trong môi trường thật/mô phỏng là… (s.98)', ['User acceptance testing', 'Operational acceptance testing', 'Contractual & regulatory AT', 'Alpha & beta testing'], 0),
      q('Which level focuses on building confidence more than finding defects? (s.99)|||Cấp nào tập trung tạo niềm tin hơn là tìm lỗi? (s.99)', ['Unit', 'Integration', 'System', 'Acceptance'], 3),
      q('In which level are developers most heavily involved? (s.100)|||Developer tham gia nhiều nhất ở cấp nào? (s.100)', ['Compatible', 'Acceptance', 'Component', 'Conversion'], 2),
      q('Which comparison of component (C.T) and system testing (S.T) is true? (s.101–102)|||So sánh nào giữa component (C.T) và system testing (S.T) là đúng? (s.101–102)', ['C.T verifies modules; S.T verifies interfaces between components|||C.T kiểm module; S.T kiểm giao diện giữa thành phần', 'C.T cases come from component/design specs and data models; S.T cases from requirement/functional specs and use cases|||Test case C.T lấy từ đặc tả thành phần/thiết kế, mô hình dữ liệu; S.T từ đặc tả yêu cầu/chức năng, use case', 'C.T is functional only; S.T functional and non-functional|||C.T chỉ chức năng; S.T cả hai', 'C.T by technical testers; S.T by users|||C.T do tester kỹ thuật; S.T do người dùng'], 1),
      q('Use cases are a test basis for which level? (s.103)|||Use case là test basis cho cấp nào? (s.103)', ['Unit', 'System', 'Load and performance', 'Usability'], 1),
      q('A characteristic of a well-managed test level? (s.104)|||Đặc điểm của một cấp test được quản lý tốt? (s.104)', ['Target duration of one month|||Thời lượng mục tiêu một tháng', 'It has a corresponding test objective|||Có mục tiêu test tương ứng', 'It does not overlap with other levels|||Không chồng với cấp khác', 'It applies a single technique|||Chỉ dùng một kỹ thuật'], 1),
      q('Where is alpha testing typically performed? (s.105)|||Alpha testing thường diễn ra ở đâu? (s.105)', ["User's end|||Phía người dùng", "Developer's end|||Phía bên phát triển", 'Both ends|||Cả hai phía', 'None of the above|||Không phải các ý trên'], 1),
      q('In top-down integration, lower components not yet integrated are replaced by…|||Trong tích hợp top-down, thành phần phía dưới chưa tích hợp được thay bằng…', ['Drivers', 'Stubs', 'The real database|||CSDL thật', 'Nothing|||Không cần gì'], 1),
      q('Which integration strategy needs drivers to call the baseline?|||Chiến lược tích hợp nào cần driver để gọi baseline?', ['Top-down', 'Bottom-up', 'Minimum capability (top-down)', 'None|||Không chiến lược nào'], 1),
      q('Checking that the checkout page responds within 2 s for 1,000 users is…|||Kiểm trang thanh toán trả lời trong 2 giây với 1.000 người dùng là…', ['Functional testing', 'Non-functional (performance/load) testing', 'White-box testing', 'Confirmation testing'], 1),
      q('Re-running the reproduction steps of a fixed defect on the new build is…|||Chạy lại các bước tái hiện của một lỗi đã sửa trên bản build mới là…', ['Regression testing', 'Confirmation testing', 'Smoke testing', 'Exploratory testing'], 1),
      q('Which is NOT a trigger for maintenance testing?|||Đâu KHÔNG phải tác nhân kích hoạt kiểm thử bảo trì?', ['Modification|||Sửa đổi', 'Migration|||Chuyển đổi', 'Retirement|||Ngừng sử dụng', 'Initial development of a brand-new system|||Phát triển lần đầu một hệ thống mới hoàn toàn'], 3),
      q('Without a specification you can…|||Không có đặc tả thì bạn có thể…', ['verify but not validate|||verify nhưng không validate', 'validate but not verify|||validate nhưng không verify', 'neither|||không làm được gì', 'both fully|||làm đầy đủ cả hai'], 1),
      q('Which IEEE 829 test-plan section records the reasons some features are excluded?|||Mục nào trong test plan IEEE 829 ghi lý do loại trừ một số tính năng?', ['Approach', 'Features not to be tested', 'Suspension & resumption criteria', 'Test items'], 1),
      q('In Overview.xlsx, the basis for Component Integration Testing (CIT) is…|||Trong Overview.xlsx, cơ sở cho Component Integration Testing (CIT) là…', ['The SRS', 'The ADD and detailed design (sequence diagrams)|||ADD và thiết kế chi tiết (sequence diagram)', 'Class specifications only|||Chỉ đặc tả lớp', 'Business processes|||Quy trình nghiệp vụ'], 1),
      q('Early test design in the V-model means…|||Thiết kế test sớm trong V-model nghĩa là…', ['designing tests on the left arm as each document is produced|||thiết kế test ở nhánh trái khi từng tài liệu ra đời', 'running tests before coding|||chạy test trước khi code', 'skipping reviews|||bỏ qua review', 'testing only at acceptance|||chỉ test ở acceptance'], 0),
      q("Kanban's key principle is…|||Nguyên tắc chính của Kanban là…", ['fixed 2-week sprints|||sprint cố định 2 tuần', 'a limit on work in progress (WIP)|||giới hạn số việc đang làm (WIP)', 'a daily build|||build hằng ngày', 'pair programming|||lập trình cặp'], 1),
    ],
  },
};

export default {
  title: 'Chapter 2 — Testing throughout the SDLC|||Chương 2 — Kiểm thử xuyên suốt SDLC',
  description: 'SWT2 (143 slide) học từng slide: mô hình SDLC, 4 cấp test (component/integration/system/acceptance, stub & driver), 4 loại test, kiểm thử bảo trì, test plan IEEE 829, và bảng Overview.xlsx — kèm đáp án mọi câu hỏi trên slide.',
  lessons: [L21, L22, L23, L24, L25, L26, QUIZ2],
};
