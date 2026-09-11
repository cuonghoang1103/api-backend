/**
 * SWT301 · Chapter 1 — Fundamentals of testing.
 * Source: SWT1_tim.pptx (114 visible slides; hidden pptx slides 44, 45, 64, 118
 * are summarised in text) + teacher's speaker notes + Additional Content.pdf
 * slides 18–26 (user-story & test-case anatomy).
 * Lesson split follows the deck's own CONTENT slide:
 *   1.1 What is testing?            slides 1–31
 *   1.2 Why is testing necessary?   slides 32–52
 *   1.3 Seven testing principles    slides 53–72
 *   1.4 Test process                slides 73–98 (+ addl 18–26)
 *   1.5 Psychology & code of ethics slides 99–114
 * Answers to every "Question" slide were worked out against the ISTQB CTFL
 * 2018 syllabus wording (the version these slides follow).
 */
import { walk, walkHead, books, bi, ansEn as AE, ansVi as AV } from './_slides.mjs';

const D = 'swt1';

/* ─────────────────────────── 1.1 What is testing? ─────────────────────────── */
const L11 = {
  title: '1.1 — What is testing? Definition, objectives, testing vs debugging|||1.1 — Kiểm thử là gì? Định nghĩa, mục tiêu, testing vs debugging',
  slug: 'swt301-fundamentals-principles',
  type: 'VIDEO',
  description: 'SWT1 slide 1–31: định nghĩa kiểm thử theo ISTQB, static vs dynamic, verification vs validation, 9 mục tiêu của kiểm thử, testing ≠ debugging — kèm đáp án 17 câu hỏi trên slide.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.1 · SWT1 slides 1–31</span>
<h2>What is testing?</h2>
<p class="lead">This lesson covers the first block of the Chapter 1 deck. By the end you should be able to state the ISTQB definition of testing word for word, separate <strong>static</strong> from <strong>dynamic</strong> testing and <strong>verification</strong> from <strong>validation</strong>, list the <strong>objectives</strong> of testing, and explain why <strong>testing is not debugging</strong>.</p>
<div class="callout"><b>Syllabus learning objectives.</b> LO-1.1.1 Identify typical objectives of testing (K1) · LO-1.1.2 Differentiate testing from debugging (K2). Chapter 1 carries <b>8 of the 40</b> questions in the ISTQB exam (SWT0 slide 7).</div>
<h3>The essentials in one screen</h3>
<table>
<thead><tr><th>Idea</th><th>What you must be able to say</th></tr></thead>
<tbody>
<tr><td>Definition</td><td>A <em>process</em> of all lifecycle activities, static and dynamic, concerned with planning, preparation and evaluation of a component/system and related work products, to determine they satisfy requirements, are fit for purpose, and to detect defects.</td></tr>
<tr><td>Static vs dynamic</td><td>Static = examine work products <em>without executing</em> (reviews, static analysis). Dynamic = <em>execute</em> the software.</td></tr>
<tr><td>Verification vs validation</td><td>Verification = built the product <em>right</em> (against the spec). Validation = built the <em>right</em> product (against the user's real need).</td></tr>
<tr><td>Objectives</td><td>Evaluate work products, verify requirements, build confidence, find defects, prevent defects, inform stakeholders, reduce risk, comply with law/standards — and they <em>vary by context</em>.</td></tr>
<tr><td>Testing vs debugging</td><td>Testing shows failures (tester). Debugging finds, analyses and removes their causes (developer). Confirmation testing checks the fix (tester).</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 1 · Bài 1.1 · SWT1 slide 1–31</span>
<h2>Kiểm thử là gì?</h2>
<p class="lead">Bài này đi hết khối đầu tiên của slide Chương 1. Học xong bạn phải: đọc thuộc định nghĩa kiểm thử của ISTQB, tách bạch được <strong>static</strong> với <strong>dynamic</strong>, <strong>verification</strong> với <strong>validation</strong>, kể được các <strong>mục tiêu</strong> của kiểm thử, và giải thích vì sao <strong>testing không phải debugging</strong>.</p>
<div class="callout"><b>Chuẩn đầu ra theo syllabus.</b> LO-1.1.1 Nhận diện các mục tiêu điển hình của kiểm thử (K1) · LO-1.1.2 Phân biệt testing với debugging (K2). Chương 1 chiếm <b>8/40</b> câu trong đề ISTQB (SWT0 slide 7) — và đề FE của trường cũng bám đúng tỉ lệ này.</div>
<h3>Cốt lõi trong một màn hình</h3>
<table>
<thead><tr><th>Ý chính</th><th>Bạn phải nói được</th></tr></thead>
<tbody>
<tr><td>Định nghĩa</td><td>Là một <em>quá trình</em> gồm mọi hoạt động trong vòng đời, cả tĩnh lẫn động, liên quan tới lập kế hoạch, chuẩn bị và đánh giá một thành phần/hệ thống cùng các sản phẩm liên quan, nhằm xác định chúng thoả yêu cầu, phù hợp mục đích, và để phát hiện defect.</td></tr>
<tr><td>Static vs dynamic</td><td>Static = xem xét sản phẩm <em>không chạy</em> (review, phân tích tĩnh). Dynamic = <em>chạy</em> phần mềm.</td></tr>
<tr><td>Verification vs validation</td><td>Verification = làm sản phẩm <em>đúng cách</em> (so với đặc tả). Validation = làm <em>đúng sản phẩm</em> (so với nhu cầu thật của người dùng).</td></tr>
<tr><td>Mục tiêu</td><td>Đánh giá sản phẩm công việc, kiểm yêu cầu đã đáp ứng, tạo niềm tin, tìm defect, ngăn defect, cung cấp thông tin cho các bên, giảm rủi ro, tuân thủ luật/chuẩn — và <em>thay đổi theo ngữ cảnh</em>.</td></tr>
<tr><td>Testing vs debugging</td><td>Testing làm lộ failure (việc của tester). Debugging tìm, phân tích và gỡ nguyên nhân (việc của dev). Confirmation testing kiểm lại bản sửa (tester).</td></tr>
</tbody>
</table>`),
    walkHead(D, 1, 31),
    walk(D, [
      [1, 'Fundamentals of Testing (cover)',
        `<p>The cover shows the six-box map that the <em>whole</em> course follows — it is exactly the six chapters of the ISTQB Certified Tester Foundation Level (CTFL) syllabus: 1 Fundamentals · 2 Testing in the SDLC · 3 Static testing · 4 Test techniques · 5 Test management · 6 Tools. Chapter 1 is highlighted. Every later deck opens with the same map, so you always know where you are.</p>`,
        `<p>Slide bìa có sơ đồ 6 ô mà <em>cả môn</em> đi theo — đó chính là 6 chương của syllabus ISTQB Certified Tester Foundation Level (CTFL): 1 Nền tảng · 2 Kiểm thử trong SDLC · 3 Kiểm thử tĩnh · 4 Kỹ thuật thiết kế test · 5 Quản lý test · 6 Công cụ. Ô Chương 1 được tô màu. Mọi bộ slide sau đều mở đầu bằng sơ đồ này nên bạn luôn biết mình đang ở đâu trong môn.</p>`],
      [2, 'CONTENT',
        `<p>The agenda of Chapter 1: What is testing? · Why testing is necessary · Testing principles · Fundamental test process · Psychology of testing · Code of Ethics. On this site each item is one lesson (1.1 → 1.5); Code of Ethics is folded into 1.5.</p>`,
        `<p>Mục lục Chương 1: Kiểm thử là gì? · Vì sao cần kiểm thử · Các nguyên tắc · Quy trình test cơ bản · Tâm lý kiểm thử · Quy tắc đạo đức. Trên trang này mỗi mục là một bài (1.1 → 1.5); phần đạo đức gộp vào bài 1.5.</p>`],
      [3, 'What is Testing?: Background',
        `<p>Almost everyone has met software that "did not work as expected". The consequences range from lost money, time or business reputation up to <strong>injury or death</strong>. The slide asks you for an example — the teacher's speaker notes give three: a car holds about 50 microcontrollers (brakes, seats, gearbox…), so a brake-software fault can cause a crash; a navigation app that tells a distracted driver to turn into a one-way street; a medication-reminder app for an Alzheimer's patient that rings at the wrong time.</p>
<div class="callout ok"><b>Class tip from the notes:</b> students who bring a <em>real</em> example of software failing earn a bonus point. Have one ready — e.g. the CrowdStrike update of 19 July 2024 that crashed about 8.5 million Windows machines and grounded flights worldwide.</div>`,
        `<p>Ai cũng từng gặp phần mềm "không chạy như mong đợi". Hậu quả từ mất tiền, mất thời gian, mất uy tín cho tới <strong>thương tích hoặc chết người</strong>. Slide hỏi bạn một ví dụ — ghi chú của giảng viên (speaker notes) gợi ý ba cái: ô tô có khoảng 50 vi điều khiển (phanh, ghế, hộp số…) nên lỗi phần mềm phanh có thể gây tai nạn; ứng dụng dẫn đường bảo tài xế đang mất tập trung rẽ vào đường một chiều; ứng dụng nhắc uống thuốc cho bệnh nhân Alzheimer đổ chuông sai giờ.</p>
<div class="callout ok"><b>Mẹo lấy điểm từ ghi chú của thầy/cô:</b> sinh viên kể được một ví dụ <em>thật</em> về phần mềm hỏng sẽ được cộng điểm. Chuẩn bị sẵn một ví dụ — chẳng hạn bản cập nhật CrowdStrike ngày 19/7/2024 làm sập khoảng 8,5 triệu máy Windows, nhiều hãng bay phải dừng chuyến.</div>`],
      [4, 'What is Testing?: Cost of Software Faults',
        `<p>Faults can cost huge sums: <strong>Ariane 5</strong> (1996) self-destructed 37 seconds after launch because code reused from Ariane 4 converted a 64-bit floating-point value into a 16-bit integer that overflowed; <strong>Mariner 1</strong> (1962) was destroyed because a single symbol was missing from a hand-transcribed guidance formula; American Airlines lost about $50m through a fare/booking software fault. The dollar figures on the slide are the commonly quoted ones — sources estimate differently — but the lesson does not change. Other faults cost almost nothing (a cosmetic glitch). The key phrase is <strong>"software is not linear"</strong>: a tiny input or a one-character change can have an enormous effect.</p>`,
        `<p>Lỗi phần mềm có thể tốn những khoản khổng lồ: <strong>Ariane 5</strong> (1996) tự huỷ 37 giây sau khi phóng vì đoạn code tái dùng từ Ariane 4 ép một số thực 64-bit thành số nguyên 16-bit và bị tràn; <strong>Mariner 1</strong> (1962) bị phá huỷ vì thiếu đúng một ký hiệu trong công thức dẫn đường chép tay; American Airlines mất khoảng 50 triệu USD vì lỗi phần mềm giá vé/đặt chỗ. Con số trên slide là con số hay được trích — mỗi nguồn ước tính một khác — nhưng bài học thì không đổi. Có lỗi lại gần như vô hại (sai hiển thị nhỏ). Cụm cần nhớ là <strong>"phần mềm không tuyến tính"</strong>: một đầu vào nhỏ hay sửa một ký tự có thể gây hậu quả cực lớn.</p>`],
      [5, 'What is Testing?: Safety-critical systems',
        `<p>In safety-critical systems faults kill: the <strong>Therac-25</strong> radiation-therapy machine (1985–87) delivered massive overdoses because of a race condition; train and aircraft accidents have involved software (the slide cites Airbus and Korean Air); even a bank's automatic overdraft letter has been linked to a suicide. Keep this slide in mind for Principle 6 (<em>testing is context dependent</em>): such systems are tested far more rigorously and under standards (DO-178C for avionics, ISO 26262 for cars, IEC 62304 for medical software).</p>`,
        `<p>Với hệ thống an toàn-sống-còn, lỗi có thể giết người: máy xạ trị <strong>Therac-25</strong> (1985–87) chiếu liều cực lớn vì lỗi tranh chấp (race condition); tai nạn tàu hoả và máy bay đã có phần do phần mềm (slide nêu Airbus và Korean Air); thậm chí thư báo thấu chi tự động của ngân hàng từng dẫn tới một vụ tự tử. Nhớ slide này khi học Nguyên tắc 6 (<em>kiểm thử phụ thuộc ngữ cảnh</em>): các hệ thống như vậy được test khắt khe hơn nhiều và theo chuẩn (DO-178C cho hàng không, ISO 26262 cho ô tô, IEC 62304 cho phần mềm y tế).</p>`],
      [6, 'What is Testing? — no single set of definitions',
        `<p>There was no world-wide agreed vocabulary, so the British standard <strong>BS 7925-1</strong> (a glossary focused on component testing, written by the BCS SIGIST working party) was adopted by ISEB/ISTQB. Today the reference is the <strong>ISTQB Glossary</strong> (glossary.istqb.org) and the ISO/IEC/IEEE 29119 series. Why it matters for you: exam questions use the glossary's exact wording, so learn terms precisely (error ≠ defect ≠ failure, test condition ≠ test case…).</p>`,
        `<p>Trước đây thế giới không có bộ thuật ngữ chung, nên chuẩn Anh <strong>BS 7925-1</strong> (bảng thuật ngữ tập trung vào component testing, do nhóm BCS SIGIST soạn) được ISEB/ISTQB dùng làm gốc. Ngày nay nguồn chuẩn là <strong>ISTQB Glossary</strong> (glossary.istqb.org) và bộ chuẩn ISO/IEC/IEEE 29119. Vì sao quan trọng: câu hỏi thi dùng đúng chữ trong glossary, nên phải học thuật ngữ thật chính xác (error ≠ defect ≠ failure, test condition ≠ test case…).</p>`],
      [7, 'What is Testing? — the ISTQB definition',
        `<p>Memorise the highlighted words: testing is a <strong>process</strong> (not one activity) consisting of <strong>all lifecycle activities</strong>, <strong>both static and dynamic</strong>, concerned with planning, preparation and evaluation of a component or system <em>and related work products</em> (requirements, designs, test cases — not only code), to determine that they <strong>satisfy specified requirements</strong> (verification), to demonstrate that they are <strong>fit for purpose</strong> (validation) and to <strong>detect defects</strong>. Short version at the bottom: testing is a way to <strong>assess quality</strong> and <strong>reduce the risk of failure in operation</strong>.</p>`,
        `<p>Học thuộc các chữ được tô: kiểm thử là một <strong>quá trình</strong> (không phải một hành động) gồm <strong>mọi hoạt động trong vòng đời</strong>, <strong>cả tĩnh lẫn động</strong>, liên quan tới lập kế hoạch, chuẩn bị và đánh giá thành phần/hệ thống <em>và các sản phẩm công việc liên quan</em> (yêu cầu, thiết kế, test case — không chỉ code), để xác định chúng <strong>thoả yêu cầu đã đặc tả</strong> (verification), chứng minh chúng <strong>phù hợp mục đích</strong> (validation) và để <strong>phát hiện defect</strong>. Bản rút gọn ở cuối slide: kiểm thử là cách để <strong>đánh giá chất lượng</strong> và <strong>giảm rủi ro hỏng hóc khi vận hành</strong>.</p>`],
      [8, 'Question — main goal of software testing',
        AE('a — Assess the quality of the software', 'Testing <em>measures</em> quality and gives information. Quality only <em>increases</em> when someone fixes the defects — that is development work, not testing. Option b is the classic trap.'),
        AV('a — Đánh giá chất lượng phần mềm', 'Kiểm thử <em>đo</em> chất lượng và cung cấp thông tin. Chất lượng chỉ <em>tăng</em> khi có người sửa defect — đó là việc phát triển, không phải kiểm thử. Phương án b là bẫy kinh điển.')],
      [9, 'Question — finding a defect early',
        AE('c — The risk of finding this defect in operation will be reduced', 'A defect found (and fixed) before release can no longer show up as a failure in production — and it is cheaper to fix early (slide 45).'),
        AV('c — Rủi ro gặp defect này khi vận hành sẽ giảm', 'Defect được tìm (và sửa) trước khi phát hành thì không thể lộ ra thành failure trên production nữa — và sửa sớm rẻ hơn nhiều (slide 45).')],
      [10, 'Question — main role of the tester',
        AE('c — Find defects', 'Resolving defects (debugging) and developing applications are developer tasks. The tester\'s core role is to find defects and report them.'),
        AV('c — Tìm defect', 'Sửa defect (debugging) và phát triển ứng dụng là việc của developer. Vai trò cốt lõi của tester là tìm defect và báo cáo.')],
      [11, 'Question — "Software testing is a way to…"',
        AE('b — Reduce the risk of software failure in operation', 'Same logic as slide 8: testing by itself does not raise quality; it reduces risk by revealing defects so they can be fixed before users meet them.'),
        AV('b — Giảm rủi ro phần mềm hỏng khi vận hành', 'Cùng logic với slide 8: bản thân kiểm thử không làm chất lượng tăng; nó giảm rủi ro bằng cách làm lộ defect để được sửa trước khi người dùng gặp.')],
      [12, 'Misperceptions: testing ≠ test execution',
        `<p>The first misconception: "testing = running tests". Execution is only <strong>one</strong> of the seven activities of the test process (planning, monitoring &amp; control, analysis, design, implementation, <em>execution</em>, completion — lesson 1.4). Most of a tester's thinking happens before anything runs.</p>`,
        `<p>Hiểu lầm đầu tiên: "kiểm thử = chạy test". Thực thi chỉ là <strong>một</strong> trong bảy hoạt động của quy trình test (lập kế hoạch, giám sát &amp; kiểm soát, phân tích, thiết kế, triển khai, <em>thực thi</em>, hoàn tất — bài 1.4). Phần lớn công sức tư duy của tester diễn ra trước khi có gì được chạy.</p>`],
      [13, 'Misperceptions: static and dynamic testing',
        `<p>Software testing branches into <strong>static testing</strong> — examining requirements, designs, code or test cases <em>without executing</em> them (reviews; static analysis by tools) — and <strong>dynamic testing</strong> — executing the software with inputs and comparing results. Both are testing. Chapter 3 is all about static testing.</p>`,
        `<p>Kiểm thử phần mềm chia làm <strong>kiểm thử tĩnh (static)</strong> — xem xét yêu cầu, thiết kế, code hoặc test case <em>mà không chạy</em> (review; phân tích tĩnh bằng công cụ) — và <strong>kiểm thử động (dynamic)</strong> — chạy phần mềm với đầu vào và so sánh kết quả. Cả hai đều là kiểm thử. Chương 3 dành trọn cho kiểm thử tĩnh.</p>`],
      [14, 'Misperceptions: verification and validation',
        `<p>Testing also covers <strong>verification</strong> and <strong>validation</strong> — two different questions asked of the same product. The next slide makes the difference concrete.</p>`,
        `<p>Kiểm thử cũng bao gồm <strong>verification</strong> và <strong>validation</strong> — hai câu hỏi khác nhau đặt cho cùng một sản phẩm. Slide kế tiếp làm rõ sự khác nhau bằng ví dụ.</p>`],
      [15, 'Verification vs validation — the shirt',
        `<p>You ordered a shirt. <strong>Verification</strong> checks it against the order (the specification): two sleeves? size L? blue? no missing buttons? — objective, yes/no checks. <strong>Validation</strong> checks it against your real need: does it fit? will my crush like it? can I afford it? is it comfortable? does the colour match my eyes? A shirt can pass every verification check and still fail validation. Memory hook: <em>Verification = built the product right; Validation = built the right product.</em></p>`,
        `<p>Bạn đặt mua một chiếc áo. <strong>Verification</strong> kiểm nó so với đơn hàng (đặc tả): hai tay áo? size L? màu xanh? có thiếu cúc không? — các câu hỏi khách quan, trả lời có/không. <strong>Validation</strong> kiểm nó so với nhu cầu thật: mặc có vừa không? crush có thích không? có đủ tiền không? mặc có thoải mái không? màu có hợp mắt không? Một chiếc áo có thể qua hết verification mà vẫn trượt validation. Mẹo nhớ: <em>Verification = làm sản phẩm đúng cách; Validation = làm đúng sản phẩm.</em></p>`],
      [16, 'Question — position of test execution in the process',
        AE('c — 6', 'The seven activity groups in order: 1 Planning · 2 Monitoring &amp; control · 3 Analysis · 4 Design · 5 Implementation · <strong>6 Execution</strong> · 7 Completion. Hook: <em>Plan, Monitor, Analyse, Design, Implement, Execute, Complete</em>.'),
        AV('c — 6', 'Bảy nhóm hoạt động theo thứ tự: 1 Lập kế hoạch · 2 Giám sát &amp; kiểm soát · 3 Phân tích · 4 Thiết kế · 5 Triển khai · <strong>6 Thực thi</strong> · 7 Hoàn tất. Mẹo nhớ tiếng Việt: <em>Kế – Giám – Phân – Thiết – Triển – Chạy – Đóng</em>.')],
      [17, 'Question — checking code comments',
        AE('b — Static testing', 'You read the source code to judge its comments; nothing is executed. Any review of code or documents without running it is static testing.'),
        AV('b — Kiểm thử tĩnh', 'Bạn đọc mã nguồn để đánh giá phần chú thích; không chạy gì cả. Mọi việc xem xét code/tài liệu mà không chạy đều là kiểm thử tĩnh.')],
      [18, 'Question — right product vs product right',
        AE('a', 'Building the <em>right product</em> = validation (matches the need); building the <em>product right</em> = verification (matches the spec). Exactly the shirt example.'),
        AV('a', 'Làm <em>đúng sản phẩm</em> = validation (khớp nhu cầu); làm <em>sản phẩm đúng cách</em> = verification (khớp đặc tả). Đúng như ví dụ chiếc áo.')],
      [19, 'Question — developer runs code and finds a defect',
        AE('b — Dynamic testing', 'Running the code is dynamic testing, whoever does it. It is not "system testing" (that is a test <em>level</em> on the complete system), and it is not debugging yet — debugging starts <em>after</em> a failure has been seen.'),
        AV('b — Kiểm thử động', 'Chạy code là kiểm thử động, bất kể ai chạy. Không phải "system testing" (đó là một <em>cấp</em> test trên cả hệ thống), và cũng chưa phải debugging — debugging bắt đầu <em>sau khi</em> đã thấy failure.')],
      [20, 'Objectives of Testing',
        `<p>The nine boxes are the typical objectives: <strong>work product evaluation</strong> (requirements, user stories, design, code); <strong>requirement fulfilment</strong> (verify all specified requirements are met); <strong>building confidence</strong> in the quality level; <strong>finding defects</strong> and failures; <strong>preventing defects</strong>; <strong>providing information to stakeholders</strong> for decisions; <strong>reducing risks</strong> of inadequate quality; <strong>compliance with law</strong>/contracts/standards — and the ninth box: <strong>objectives may vary</strong> with the context, the test level and the lifecycle. Example: component testing mostly aims to find defects early; acceptance testing aims to confirm the system works and give information for the go-live decision.</p>`,
        `<p>Chín ô là các mục tiêu điển hình: <strong>đánh giá sản phẩm công việc</strong> (yêu cầu, user story, thiết kế, code); <strong>đáp ứng yêu cầu</strong> (kiểm mọi yêu cầu đã đặc tả được thực hiện); <strong>tạo niềm tin</strong> vào mức chất lượng; <strong>tìm defect</strong> và failure; <strong>ngăn ngừa defect</strong>; <strong>cung cấp thông tin cho các bên liên quan</strong> để ra quyết định; <strong>giảm rủi ro</strong> chất lượng kém; <strong>tuân thủ luật</strong>/hợp đồng/tiêu chuẩn — và ô thứ chín: <strong>mục tiêu có thể thay đổi</strong> theo ngữ cảnh, cấp test và mô hình vòng đời. Ví dụ: component testing chủ yếu nhằm tìm defect sớm; acceptance testing nhằm khẳng định hệ thống chạy đúng và cung cấp thông tin cho quyết định go-live.</p>`],
      [21, 'Question — one main objective of testing',
        AE('B — Give the client good knowledge about the status of the project', 'That is "providing information to stakeholders". Marketing (A) and deciding colleagues\' bonuses (C) are not testing objectives.'),
        AV('B — Cho khách hàng nắm rõ tình trạng dự án', 'Đó là mục tiêu "cung cấp thông tin cho các bên liên quan". Marketing (A) và xét thưởng đồng nghiệp (C) không phải mục tiêu kiểm thử.')],
      [22, 'Question — reviewing requirements finds a contradiction',
        AE('C — Preventing defects', 'The contradiction is removed before anyone writes code, so the code defect it would have caused never exists.'),
        AV('C — Ngăn ngừa defect', 'Mâu thuẫn được gỡ trước khi ai đó viết code, nên defect trong code mà nó lẽ ra gây ra không bao giờ xuất hiện.')],
      [23, 'Question — objective of component testing',
        AE('A — Reduce risk', 'Finding defects early in components reduces the risk that they escape to integration, system or operation. "Information for stakeholders" (B) fits acceptance testing better; "compliance with laws" (C) is typically an acceptance/regulatory objective.'),
        AV('A — Giảm rủi ro', 'Tìm defect sớm ở từng thành phần làm giảm rủi ro chúng lọt lên integration, system hay vận hành. "Thông tin cho các bên" (B) hợp với acceptance testing hơn; "tuân thủ luật" (C) thường là mục tiêu của acceptance/kiểm định.')],
      [24, 'Question — NOT an objective of testing',
        AE('D — Reducing project duration', 'Testing may save time indirectly, but shortening the project is not one of its objectives. A, B and C are all on slide 20.'),
        AV('D — Rút ngắn thời gian dự án', 'Kiểm thử có thể gián tiếp tiết kiệm thời gian, nhưng rút ngắn dự án không phải mục tiêu của nó. A, B, C đều có trên slide 20.')],
      [25, 'Question — designing tests early verifies the test basis',
        AE('C — Preventing defects', 'Designing test cases forces you to read the requirements precisely; ambiguities and gaps are found and fixed before coding. (This is an official ISTQB sample-exam question.)'),
        AV('C — Ngăn ngừa defect', 'Thiết kế test case buộc bạn đọc yêu cầu thật kỹ; chỗ mơ hồ, thiếu sót được phát hiện và sửa trước khi code. (Đây là câu trong đề mẫu chính thức của ISTQB.)')],
      [26, 'Question — what we built = what the client wants',
        AE('C — Requirements fulfilment', 'Checking the product against what the client asked for is the requirement-fulfilment objective.'),
        AV('C — Đáp ứng yêu cầu', 'Đối chiếu sản phẩm với cái khách hàng yêu cầu chính là mục tiêu đáp ứng yêu cầu.')],
      [27, 'Testing & Debugging',
        `<p>Three different activities, usually by different people: <strong>Testing</strong> (tester) shows failures caused by defects → <strong>Debugging</strong> (developer) = the process of <em>finding, analysing and removing</em> the causes of failures → <strong>Confirmation testing</strong> (tester) = checking that the fix really resolves the failure (then regression testing checks nothing else broke). In Agile and some other lifecycles, testers may also help with debugging and component testing — roles blur, activities stay distinct.</p>`,
        `<p>Ba hoạt động khác nhau, thường do người khác nhau làm: <strong>Testing</strong> (tester) làm lộ failure do defect gây ra → <strong>Debugging</strong> (developer) = quá trình <em>tìm, phân tích và gỡ bỏ</em> nguyên nhân của failure → <strong>Confirmation testing</strong> (tester) = kiểm tra bản sửa thực sự giải quyết failure (sau đó regression testing kiểm không có gì khác bị hỏng). Trong Agile và một số mô hình khác, tester có thể tham gia cả debugging và component testing — vai trò có thể chồng nhau, nhưng hoạt động vẫn tách bạch.</p>`],
      [28, 'Question — definition of debugging',
        AE('c — Identifying the cause of a defect, repairing the code and checking if the fix is correct', 'a is testing, b is regression testing, d is confirmation testing. Only c describes finding and removing the cause.'),
        AV('c — Xác định nguyên nhân defect, sửa code và kiểm bản sửa đúng', 'a là testing, b là regression testing, d là confirmation testing. Chỉ c mô tả việc tìm và gỡ nguyên nhân.')],
      [29, 'Question — lifecycle where testers help debugging',
        AE('b — Agile development', 'Exactly the note on slide 27: in Agile, whole-team work means testers may take part in debugging and component testing.'),
        AV('b — Phát triển Agile', 'Đúng như ghi chú ở slide 27: trong Agile, cả nhóm cùng làm nên tester có thể tham gia debugging và component testing.')],
      [30, 'Question — an example of debugging',
        AE('c — A developer finds and fixes a defect', 'a is testing + reporting, b is confirmation/regression testing, d is component testing (a testing activity, even when a developer does it).'),
        AV('c — Developer tìm và sửa một defect', 'a là testing + báo lỗi, b là confirmation/regression testing, d là component testing (vẫn là hoạt động kiểm thử dù developer làm).')],
      [31, 'Question — best description of testing vs debugging',
        AE('b', 'Dynamic testing shows failures caused by defects; debugging finds, analyses and removes the causes. a is wrong (debugging does not "propose prevention" — that is root-cause analysis), c is wrong (testing does not remove faults), d is wrong (testing does not prevent failures; debugging removes causes, not failures).'),
        AV('b', 'Kiểm thử động làm lộ failure do defect; debugging tìm, phân tích và gỡ nguyên nhân. a sai (debugging không "đề xuất phòng ngừa" — đó là phân tích nguyên nhân gốc), c sai (testing không gỡ lỗi), d sai (testing không ngăn failure; debugging gỡ nguyên nhân, không gỡ "failure").')],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — classify six activities</h3>
<p>For each activity decide: static or dynamic? verification or validation? testing or debugging?</p>
<table>
<thead><tr><th>#</th><th>Activity</th><th>Answer</th></tr></thead>
<tbody>
<tr><td>1</td><td>A tester reads the SRS and finds two requirements that contradict each other.</td><td>Static · verification · testing (objective: preventing defects)</td></tr>
<tr><td>2</td><td>A tester enters an 18-year-old's birthday and registration is rejected.</td><td>Dynamic · verification (spec says ≥ 18) · testing</td></tr>
<tr><td>3</td><td>The developer steps through the code in the IDE and changes <code>age &gt; 18</code> to <code>age &gt;= 18</code>.</td><td>Debugging</td></tr>
<tr><td>4</td><td>The tester re-runs case 2 on the new build and it passes.</td><td>Dynamic · confirmation testing</td></tr>
<tr><td>5</td><td>Real users try the beta and say the sign-up form asks for too much.</td><td>Dynamic · validation · testing (objective: information for stakeholders)</td></tr>
<tr><td>6</td><td>SonarQube flags a variable that is used before it is assigned.</td><td>Static (static analysis) · verification · testing</td></tr>
</tbody>
</table>
<div class="pitfall"><b>Trap seen in FE papers:</b> "The main purpose of testing is to improve quality / to prove the software has no defects." Both are <em>false</em>. Testing assesses quality and reduces risk; fixing improves quality; no amount of testing proves absence of defects (Principle 1, lesson 1.3).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The test oracle problem.</b> Every test needs an <em>oracle</em> — a source of truth for the expected result. For "2 + 2 = 4" the oracle is trivial, but what is the expected output of a weather model, a search-ranking algorithm or a machine-learning classifier? This <b>oracle problem</b> is one of the deepest open issues in testing. Practical workarounds: <em>metamorphic testing</em> (relations that must hold — adding an irrelevant document must not change the top search result), <em>differential testing</em> (compare two independent implementations) and <em>property-based testing</em>. <em>Outside the syllabus because CTFL assumes the expected result is always known from the test basis.</em></div>`,
    `<h3>Ví dụ có lời giải · Phân loại sáu hoạt động</h3>
<p>Với mỗi hoạt động, xác định: static hay dynamic? verification hay validation? testing hay debugging?</p>
<table>
<thead><tr><th>#</th><th>Hoạt động</th><th>Đáp án</th></tr></thead>
<tbody>
<tr><td>1</td><td>Tester đọc SRS và thấy hai yêu cầu mâu thuẫn nhau.</td><td>Static · verification · testing (mục tiêu: ngăn ngừa defect)</td></tr>
<tr><td>2</td><td>Tester nhập ngày sinh của người đúng 18 tuổi và bị từ chối đăng ký.</td><td>Dynamic · verification (đặc tả ghi ≥ 18) · testing</td></tr>
<tr><td>3</td><td>Developer chạy từng bước trong IDE và sửa <code>age &gt; 18</code> thành <code>age &gt;= 18</code>.</td><td>Debugging</td></tr>
<tr><td>4</td><td>Tester chạy lại ca số 2 trên bản build mới và ca đó pass.</td><td>Dynamic · confirmation testing</td></tr>
<tr><td>5</td><td>Người dùng thật dùng bản beta và phàn nàn form đăng ký hỏi quá nhiều.</td><td>Dynamic · validation · testing (mục tiêu: thông tin cho các bên)</td></tr>
<tr><td>6</td><td>SonarQube báo một biến được dùng trước khi gán giá trị.</td><td>Static (phân tích tĩnh) · verification · testing</td></tr>
</tbody>
</table>
<div class="pitfall"><b>Bẫy hay gặp trong đề FE:</b> "Mục đích chính của kiểm thử là nâng cao chất lượng / chứng minh phần mềm không có defect." Cả hai đều <em>SAI</em>. Kiểm thử đánh giá chất lượng và giảm rủi ro; sửa lỗi mới nâng chất lượng; không lượng kiểm thử nào chứng minh được "không có defect" (Nguyên tắc 1, bài 1.3).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Bài toán oracle.</b> Mỗi test cần một <em>oracle</em> — nguồn chân lý cho kết quả mong đợi. Với "2 + 2 = 4" oracle quá dễ, nhưng output đúng của một mô hình dự báo thời tiết, thuật toán xếp hạng tìm kiếm hay bộ phân loại học máy là gì? <b>Oracle problem</b> là một trong những vấn đề mở sâu nhất của kiểm thử. Cách xử lý thực tế: <em>metamorphic testing</em> (quan hệ phải luôn đúng — thêm một tài liệu không liên quan thì kết quả tìm kiếm đứng đầu không được đổi), <em>differential testing</em> (so hai bản cài đặt độc lập) và <em>property-based testing</em>. <em>Ngoài giáo trình vì CTFL mặc định kết quả mong đợi luôn biết được từ test basis.</em></div>`),
    books([
      ['fst4', 'Ch.1 §1 "What is testing?" — book pp.1–4 (PDF pp.15–18)', 'Chương 1 §1 "What is testing?" — trang sách 1–4 (trang PDF 15–18)'],
      ['fst', '§1.2 "What is testing?" — pp.11–17 (PDF pp.14–20)', '§1.2 "What is testing?" — trang 11–17 (PDF 14–20)'],
      ['sp5', '§2.1 "Concepts and Motivations", esp. §2.1.2 Testing terminology — PDF pp.27–37', '§2.1 "Concepts and Motivations", nhất là §2.1.2 Testing terminology — PDF 27–37'],
      ['sp4', '§2.1 "Terms and Motivation" — pp.6–16 (PDF pp.21–31)', '§2.1 "Terms and Motivation" — trang 6–16 (PDF 21–31)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 1.2 Why is testing necessary? ─────────────────────── */
const L12 = {
  title: '1.2 — Why is testing necessary? Error, defect, failure & root cause|||1.2 — Vì sao cần kiểm thử? Error, defect, failure & nguyên nhân gốc',
  slug: 'swt301-why-testing-necessary',
  type: 'VIDEO',
  description: 'SWT1 slide 32–52: đóng góp của kiểm thử, QA vs QC, chuỗi error → defect → failure, vì sao lỗi xảy ra, chi phí sửa lỗi 1×→16×, root cause & effect — kèm đáp án 4 câu hỏi trên slide và 3 slide ẩn.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.2 · SWT1 slides 32–52</span>
<h2>Why is testing necessary?</h2>
<p class="lead">Testing exists because people make mistakes, mistakes become defects, and defects — when executed — become failures that cost money, reputation or lives. This lesson walks that chain, shows <em>where</em> defects come from (not only code!), why finding them late is so expensive, and how <strong>root-cause analysis</strong> turns one defect into a process improvement.</p>
<div class="callout"><b>Learning objectives.</b> LO-1.2.1 Give examples of why testing is necessary (K2) · LO-1.2.2 Describe the relationship between testing and quality assurance (K2) · LO-1.2.3 Distinguish between error, defect and failure (K2) · LO-1.2.4 Distinguish between the root cause of a defect and its effects (K2).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Root cause</div><div class="lz-t">why the mistake happened</div><div class="lz-d">e.g. PO did not understand interest rules</div></div>
  <div class="lz-step"><div class="lz-k">→ Error (mistake)</div><div class="lz-t">a human action</div><div class="lz-d">an ambiguous user story is written</div></div>
  <div class="lz-step"><div class="lz-k">→ Defect (fault, bug)</div><div class="lz-t">a flaw in a work product</div><div class="lz-d">wrong formula in the code</div></div>
  <div class="lz-step"><div class="lz-k">→ Failure</div><div class="lz-t">an event at run time</div><div class="lz-d">customers get wrong interest</div></div>
  <div class="lz-step"><div class="lz-k">→ Effect</div><div class="lz-t">the consequence</div><div class="lz-d">complaints, refunds, lost trust</div></div>
</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.2 · SWT1 slide 32–52</span>
<h2>Vì sao cần kiểm thử?</h2>
<p class="lead">Kiểm thử tồn tại vì con người mắc sai sót, sai sót thành defect, và defect — khi được thực thi — thành failure gây mất tiền, mất uy tín, thậm chí mất mạng. Bài này đi dọc chuỗi đó, chỉ ra defect sinh ra <em>ở đâu</em> (không chỉ ở code!), vì sao phát hiện muộn lại đắt đến vậy, và <strong>phân tích nguyên nhân gốc</strong> biến một defect thành một cải tiến quy trình như thế nào.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-1.2.1 Nêu ví dụ vì sao cần kiểm thử (K2) · LO-1.2.2 Mô tả quan hệ giữa kiểm thử và đảm bảo chất lượng (K2) · LO-1.2.3 Phân biệt error, defect, failure (K2) · LO-1.2.4 Phân biệt nguyên nhân gốc của defect với hậu quả của nó (K2).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nguyên nhân gốc</div><div class="lz-t">vì sao sai sót xảy ra</div><div class="lz-d">vd PO không hiểu cách tính lãi</div></div>
  <div class="lz-step"><div class="lz-k">→ Error (sai sót)</div><div class="lz-t">hành động của con người</div><div class="lz-d">viết ra user story mơ hồ</div></div>
  <div class="lz-step"><div class="lz-k">→ Defect (fault, bug)</div><div class="lz-t">khiếm khuyết trong sản phẩm</div><div class="lz-d">công thức sai trong code</div></div>
  <div class="lz-step"><div class="lz-k">→ Failure</div><div class="lz-t">sự kiện lúc chạy</div><div class="lz-d">khách hàng nhận sai tiền lãi</div></div>
  <div class="lz-step"><div class="lz-k">→ Effect (hậu quả)</div><div class="lz-t">tác động</div><div class="lz-d">khiếu nại, hoàn tiền, mất niềm tin</div></div>
</div>`),
    walkHead(D, 32, 52),
    walk(D, [
      [32, 'CONTENT — Why testing is necessary',
        `<p>Second block of the chapter. Keep slide 7 in mind: testing assesses quality and reduces risk. The next slides answer "why bother?" from four angles — risk, quality, contracts/law, and cost.</p>`,
        `<p>Khối thứ hai của chương. Nhớ lại slide 7: kiểm thử đánh giá chất lượng và giảm rủi ro. Các slide tiếp theo trả lời "làm vậy để làm gì?" từ bốn góc — rủi ro, chất lượng, hợp đồng/pháp luật, và chi phí.</p>`],
      [33, 'Why is Testing Necessary?',
        `<p>Four reasons, each worth one exam option: (1) <strong>rigorous testing reduces the risk of failures in operation</strong>; (2) <strong>when defects are fixed, quality increases</strong> — note the wording: fixing, not testing; (3) testing <strong>verifies</strong> the system is correctly built and <strong>validates</strong> it meets users' and stakeholders' needs; (4) testing may be <strong>required by contracts, laws or industry standards</strong> (avionics DO-178C, automotive ISO 26262, medical IEC 62304, card payments PCI DSS).</p>`,
        `<p>Bốn lý do, mỗi lý do đáng giá một phương án trong đề: (1) <strong>kiểm thử kỹ lưỡng giảm rủi ro hỏng hóc khi vận hành</strong>; (2) <strong>khi defect được sửa, chất lượng tăng</strong> — để ý chữ: sửa, không phải test; (3) kiểm thử <strong>verify</strong> hệ thống được xây đúng và <strong>validate</strong> nó đáp ứng nhu cầu người dùng, các bên liên quan; (4) kiểm thử có thể <strong>bắt buộc theo hợp đồng, luật hoặc chuẩn ngành</strong> (hàng không DO-178C, ô tô ISO 26262, y tế IEC 62304, thanh toán thẻ PCI DSS).</p>`],
      [34, "Testing's Contributions to Success (1) — requirements",
        `<p>Testers taking part in <strong>requirements reviews</strong> or <strong>user-story refinement</strong> find defects in those work products, which reduces the risk of building incorrect or <em>untestable</em> software. Example: "The search must be fast" is untestable; a tester asks and it becomes "95% of searches return within 2 s with 500 concurrent users".</p>`,
        `<p>Tester tham gia <strong>review yêu cầu</strong> hoặc <strong>làm mịn user story</strong> sẽ tìm ra defect ngay trong các sản phẩm đó, giảm rủi ro xây ra phần mềm sai hoặc <em>không kiểm thử được</em>. Ví dụ: "Tìm kiếm phải nhanh" là không test được; tester hỏi lại và nó thành "95% lượt tìm kiếm trả kết quả trong 2 giây khi có 500 người dùng đồng thời".</p>`],
      [35, "Testing's Contributions to Success (2) — design",
        `<p>Testers working with <strong>system designers while the system is being designed</strong> understand the design and how to test it; designers learn what is hard to test. Result: fewer fundamental design defects, and tests identified early (e.g. a tester asks "how do we test the payment timeout?" and the architect adds a configurable timeout).</p>`,
        `<p>Tester làm việc cùng <strong>người thiết kế ngay khi hệ thống đang được thiết kế</strong> sẽ hiểu thiết kế và cách test nó; người thiết kế biết chỗ nào khó test. Kết quả: ít defect thiết kế nền tảng hơn, và test được xác định sớm (vd tester hỏi "làm sao test được timeout thanh toán?" và kiến trúc sư thêm tham số timeout cấu hình được).</p>`],
      [36, "Testing's Contributions to Success (3) — code",
        `<p>Testers working with <strong>developers while the code is being written</strong> increase both sides' understanding of the code and how to test it — reducing defects in the code <em>and in the tests</em>. Typical forms: pairing on unit tests, reviewing pull requests, TDD.</p>`,
        `<p>Tester làm cùng <strong>developer khi code đang được viết</strong> giúp cả hai hiểu code và cách test nó hơn — giảm defect trong code <em>và cả trong test</em>. Hình thức thường gặp: cặp đôi viết unit test, review pull request, TDD.</p>`],
      [37, "Testing's Contributions to Success (4) — before release",
        `<p>Testers <strong>verifying and validating before release</strong> detect failures that would otherwise be missed and support removing their causes (debugging). This raises the likelihood that the software meets stakeholder needs and satisfies requirements. Together, slides 34–37 say: testing contributes at <em>every</em> stage, not only at the end.</p>`,
        `<p>Tester <strong>verify và validate trước khi phát hành</strong> sẽ bắt được failure mà nếu không sẽ lọt, và hỗ trợ gỡ nguyên nhân (debugging). Nhờ đó khả năng phần mềm đáp ứng nhu cầu và yêu cầu tăng lên. Gộp slide 34–37 lại: kiểm thử đóng góp ở <em>mọi</em> giai đoạn, không chỉ lúc cuối.</p>`],
      [38, 'Quality Assurance & Testing',
        `<p><strong>Quality management</strong> = all activities that direct and control an organisation with regard to quality (it touches HR, delivery… not only software). Inside it: <strong>Quality assurance (QA)</strong> focuses on <em>processes</em> — following proper processes gives higher-quality work products (audits, standards, training, retrospectives); <strong>Quality control (QC)</strong> focuses on <em>products</em>. <strong>Testing is a quality-control activity</strong>, not a QA activity — a favourite exam statement. (The job title "QA engineer" in companies usually means tester; the syllabus uses the strict meaning.)</p>`,
        `<p><strong>Quản lý chất lượng</strong> = mọi hoạt động điều hướng và kiểm soát tổ chức về mặt chất lượng (liên quan cả nhân sự, giao hàng… chứ không riêng phần mềm). Bên trong có: <strong>Đảm bảo chất lượng (QA)</strong> tập trung vào <em>quy trình</em> — làm đúng quy trình thì sản phẩm tốt hơn (audit, chuẩn, đào tạo, retrospective); <strong>Kiểm soát chất lượng (QC)</strong> tập trung vào <em>sản phẩm</em>. <strong>Kiểm thử là hoạt động kiểm soát chất lượng (QC)</strong>, không phải QA — câu này rất hay vào đề. (Chức danh "QA engineer" ở công ty thường chỉ tester; syllabus dùng nghĩa hẹp.)</p>`],
      [39, 'Errors - Defects - Failures (definitions)',
        `<p><strong>Error (mistake)</strong>: a human action that produces an incorrect result. <strong>Defect (fault, bug)</strong>: the manifestation of an error in a work product — if executed, it may cause a failure. <strong>Failure</strong>: an event in which a component or system does not perform a required function within specified limits. The pink box is the sentence to memorise: <em>a failure is an event; a defect is a state of the software, caused by an error.</em></p>`,
        `<p><strong>Error (mistake — sai sót)</strong>: hành động của con người tạo ra kết quả sai. <strong>Defect (fault, bug — khiếm khuyết)</strong>: biểu hiện của sai sót nằm trong sản phẩm công việc — nếu được thực thi có thể gây failure. <strong>Failure (hỏng hóc)</strong>: sự kiện trong đó thành phần/hệ thống không thực hiện được chức năng yêu cầu trong giới hạn đã định. Câu trong ô hồng phải thuộc: <em>failure là một sự kiện; defect là một trạng thái của phần mềm, do error gây ra.</em></p>`],
      [40, 'Errors - Defects - Failures (the chain)',
        `<p>The picture version: a person makes an <strong>error</strong> … that creates a <strong>defect</strong> in the software … that can cause a <strong>failure</strong> in operation. Read it left to right and you will never swap the three words.</p>`,
        `<p>Phiên bản bằng hình: một người mắc <strong>error</strong> … tạo ra <strong>defect</strong> trong phần mềm … có thể gây <strong>failure</strong> khi vận hành. Đọc từ trái sang phải là không bao giờ nhầm ba từ này.</p>`],
      [41, 'Errors - Defects - Failures — where defects come from',
        `<p>The common belief "failures come from bugs in the code" is only partly true: roughly <strong>20% of defects are in requirements and 25% in design</strong>. That is why static testing of requirements and designs (Chapter 3) pays off so well.</p>`,
        `<p>Niềm tin phổ biến "failure là do bug trong code" chỉ đúng một phần: khoảng <strong>20% defect nằm ở yêu cầu và 25% ở thiết kế</strong>. Đó là lý do kiểm thử tĩnh yêu cầu và thiết kế (Chương 3) mang lại hiệu quả rất cao.</p>`],
      [42, 'Figure 1.1 — Four typical scenarios',
        `<p>From the textbook (Figure 1.1). Each row is a chain business analyst → requirement → architect → design → programmer → code: <strong>Row 1</strong> everything correct → correct code. <strong>Row 2</strong> correct requirement and design, the programmer errs → incorrect code (found by component/unit testing). <strong>Row 3</strong> requirement correct but design wrong → the code faithfully implements a wrong design (found by integration/system testing or design review). <strong>Row 4</strong> the requirement itself is wrong → everything downstream is "correct" against a wrong basis; only <em>validation</em> (reviews with users, acceptance testing) can catch it — the most expensive scenario.</p>`,
        `<p>Hình 1.1 trong giáo trình. Mỗi hàng là chuỗi BA → yêu cầu → kiến trúc sư → thiết kế → lập trình viên → code: <strong>Hàng 1</strong> mọi thứ đúng → code đúng. <strong>Hàng 2</strong> yêu cầu và thiết kế đúng, lập trình viên sai → code sai (bắt bằng unit/component test). <strong>Hàng 3</strong> yêu cầu đúng nhưng thiết kế sai → code làm đúng theo một thiết kế sai (bắt bằng integration/system test hoặc review thiết kế). <strong>Hàng 4</strong> chính yêu cầu đã sai → mọi thứ phía sau "đúng" so với một cơ sở sai; chỉ <em>validation</em> (review cùng người dùng, acceptance test) mới bắt được — kịch bản đắt nhất.</p>`],
      [43, 'Error → Defect → Failure / No failure',
        `<p>Not every defect produces a failure: the faulty code may never be executed, may need very specific data or conditions, or may be masked by another defect. Conversely, the syllabus notes failures can also be caused by <strong>environmental conditions</strong> (radiation, magnetism, electronic fields, pollution) without any defect in the code. And the tester's own results can be wrong: a <em>false positive</em> reports a defect that is not there; a <em>false negative</em> misses one that is.</p>`,
        `<p>Không phải defect nào cũng sinh ra failure: dòng code lỗi có thể không bao giờ được chạy, cần dữ liệu/điều kiện rất đặc biệt, hoặc bị một defect khác che mất. Ngược lại, syllabus nhắc failure cũng có thể do <strong>điều kiện môi trường</strong> (bức xạ, từ trường, trường điện tử, ô nhiễm) dù code không có defect. Và kết quả của chính tester cũng có thể sai: <em>false positive</em> báo có defect trong khi không có; <em>false negative</em> bỏ sót defect có thật.</p>`],
      [44, 'Why do errors happen?',
        `<p>Eight causes from the syllabus: time pressure · human fallibility · lack of experience/skill · miscommunication (about requirements and design) · complexity of the code, design, architecture or problem · misunderstanding of system interactions and interfaces · new or unfamiliar technologies · environmental conditions (for failures). Exam questions often describe a situation ("the team adopted a new framework under a tight deadline") and ask which causes apply.</p>`,
        `<p>Tám nguyên nhân theo syllabus: áp lực thời gian · con người vốn dễ sai · thiếu kinh nghiệm/kỹ năng · truyền đạt sai (về yêu cầu, thiết kế) · độ phức tạp của code, thiết kế, kiến trúc hay bài toán · hiểu sai tương tác và giao diện giữa các hệ thống · công nghệ mới hoặc lạ · điều kiện môi trường (với failure). Đề hay mô tả một tình huống ("nhóm dùng framework mới với deadline gấp") rồi hỏi nguyên nhân nào đúng.</p>`],
      [45, 'What do software faults cost? (Figure 1.2)',
        `<p>The cost to repair a defect multiplies the later it is found: requirement 1× → design 2× → code/unit test 4× → independent test 8× → after release 16× (and much more when you add reputation, recalls or legal cost). The reason: a late fix drags the whole chain with it — change the requirement, the design, the code, the tests, the documentation, rebuild and redeploy. This curve is the economic argument for <em>early testing</em> (Principle 3).</p>`,
        `<p>Chi phí sửa một defect nhân lên theo độ muộn khi phát hiện: yêu cầu 1× → thiết kế 2× → code/unit test 4× → test độc lập 8× → sau phát hành 16× (còn nhiều hơn nếu tính cả uy tín, thu hồi sản phẩm, pháp lý). Lý do: sửa muộn kéo theo cả chuỗi — sửa yêu cầu, thiết kế, code, test, tài liệu, build và triển khai lại. Đường cong này là lập luận kinh tế cho <em>kiểm thử sớm</em> (Nguyên tắc 3).</p>`],
      [46, 'So why is testing necessary? (✓ / ✗)',
        `<p>The ticks and crosses are exam gold. ✓ software is likely to have faults · ✓ to learn about reliability · ✗ to fill the time between delivery and release (not a reason) · ✗ to prove the software has no faults (impossible — Principle 1) · ✗ because it is in the project plan (a plan is not a reason) · ✓ failures can be very expensive · ✓ to avoid being sued · ✓ to stay in business.</p>`,
        `<p>Dấu tích và dấu chéo trên slide là "vàng" cho đề thi. ✓ phần mềm nhiều khả năng có lỗi · ✓ để biết độ tin cậy · ✗ để lấp khoảng thời gian giữa bàn giao và phát hành (không phải lý do) · ✗ để chứng minh phần mềm không có lỗi (bất khả — Nguyên tắc 1) · ✗ vì có trong kế hoạch dự án (kế hoạch không phải lý do) · ✓ failure có thể rất đắt · ✓ để tránh bị kiện · ✓ để tồn tại trên thị trường.</p>`],
      [47, 'Defects – Root Causes – Effects',
        `<p><strong>Root cause</strong>: a source of a defect such that if it is removed, the occurrence of that <em>type</em> of defect is decreased or removed. Root-cause analysis (RCA) leads to <strong>process improvements</strong> that prevent many future defects. The tree picture: failures are the symptoms (leaves), the problem is the trunk, the causes are the roots — pulling leaves does not stop them growing back. Common RCA tools: <em>5 Whys</em> and the Ishikawa (fishbone) diagram.</p>`,
        `<p><strong>Nguyên nhân gốc (root cause)</strong>: nguồn gốc của defect mà nếu loại bỏ thì <em>loại</em> defect đó giảm hoặc hết hẳn. Phân tích nguyên nhân gốc (RCA) dẫn tới <strong>cải tiến quy trình</strong> ngăn được rất nhiều defect về sau. Hình cái cây: failure là triệu chứng (lá), vấn đề là thân, nguyên nhân là rễ — ngắt lá thì lá vẫn mọc lại. Công cụ RCA hay dùng: <em>5 Whys</em> và biểu đồ xương cá Ishikawa.</p>`],
      [48, 'Defects – Root Causes – Effects: worked example',
        `<p>Incorrect interest payments from one wrong line of code produce complaints; the line was written for an ambiguous user story because the product owner misunderstood interest. Classification: <strong>Failure</strong> = incorrect calculations for customers · <strong>Defect</strong> = the wrong calculation in the code · <strong>Root cause</strong> = the PO's lack of knowledge of interest calculation · <strong>Effect</strong> = customer complaints. Note the difference between the failure (what the system did) and the effect (what happened to the business).</p>`,
        `<p>Một dòng code sai làm tính lãi sai và khách hàng khiếu nại; dòng code đó viết theo một user story mơ hồ vì product owner hiểu sai cách tính lãi. Phân loại: <strong>Failure</strong> = tính sai cho khách hàng · <strong>Defect</strong> = phép tính sai trong code · <strong>Root cause</strong> = PO thiếu kiến thức tính lãi · <strong>Effect</strong> = khách hàng khiếu nại. Chú ý phân biệt failure (hệ thống đã làm gì) với effect (điều gì xảy ra với doanh nghiệp).</p>`],
      [49, 'Question — which statement describes a failure?',
        AE('A — The product crashed when the user selected an option in a dialog box', 'A crash is an observable run-time event = failure. B (wrong file version in the build) and C (algorithm uses the wrong variables) are defects; D (developer misinterpreted the requirement) is an error.'),
        AV('A — Sản phẩm bị crash khi người dùng chọn một tuỳ chọn trong hộp thoại', 'Crash là sự kiện quan sát được khi chạy = failure. B (đưa nhầm phiên bản file vào build) và C (thuật toán dùng sai biến) là defect; D (developer hiểu sai yêu cầu) là error.')],
      [50, 'Question — root cause analysis',
        AE('C — RCA can be applied in all lifecycle steps and can prevent many future defects', 'A is wrong (RCA is used in any process, not only software), B is nonsense (it improves the process, it does not "destroy" it).'),
        AV('C — RCA áp dụng được ở mọi bước vòng đời và ngăn được nhiều defect về sau', 'A sai (RCA dùng cho mọi quy trình, không riêng phần mềm), B vô lý (RCA cải tiến quy trình chứ không "phá huỷ" nó).')],
      [51, 'Question — correct statement about the chain',
        AE('C — A developer makes a mistake which causes a defect that may be seen as a failure during dynamic testing', 'Only C keeps the order mistake → defect → failure and says failures are seen when executing. A, B, D scramble the terms.'),
        AV('C — Developer mắc sai sót gây ra defect, có thể lộ thành failure khi kiểm thử động', 'Chỉ C giữ đúng thứ tự mistake → defect → failure và nói failure lộ ra khi chạy. A, B, D đảo lộn thuật ngữ.')],
      [52, 'Question — which statements are TRUE?',
        AE('C — 1 and 3 are true, 2 and 4 are false', '1 true (contracts/law may require testing); 3 true (testing + fixing reduces operational risk); 2 false (testing serves all stakeholders, it is not mainly about the developer\'s work); 4 false (you can never prove all failures have been found).'),
        AV('C — 1 và 3 đúng, 2 và 4 sai', '1 đúng (hợp đồng/luật có thể bắt buộc kiểm thử); 3 đúng (test + sửa lỗi giảm rủi ro khi vận hành); 2 sai (kiểm thử phục vụ mọi bên, không chủ yếu để cải thiện công việc của developer); 4 sai (không bao giờ chứng minh được đã tìm hết failure).')],
    ]),
    bi(`<h3>🔒 Hidden slides in SWT1_tim.pptx (not shown in class, still worth knowing)</h3>
<ul>
<li><strong>Reliability vs faults</strong> (pptx slide 44). Reliability = the probability that software will not cause a system failure for a specified time under specified conditions. Discussion answers: a non-trivial system is practically never fault-free; yes, software can be reliable and still contain faults (faults on paths users never take); no, "fault-free" does not guarantee reliability if the requirements themselves are wrong.</li>
<li><strong>Why do errors happen?</strong> (pptx slide 45, older version of slide 44): software is written by humans who know something but not everything, have skills but are not perfect, and work under deadline pressure with no time to check assumptions.</li>
<li><strong>Testing and quality</strong> (pptx slide 64): testing <em>measures</em> quality; removing the faults it finds improves quality and possibly reliability. Testing covers functions <em>and</em> non-functional qualities — reliability, usability, maintainability, reusability, testability.</li>
</ul>`,
    `<h3>🔒 Slide ẩn trong file SWT1_tim.pptx (không chiếu trên lớp nhưng vẫn nên biết)</h3>
<ul>
<li><strong>Reliability vs faults</strong> (slide pptx 44). Độ tin cậy = xác suất phần mềm không gây hỏng hệ thống trong một khoảng thời gian, dưới điều kiện xác định. Đáp án thảo luận: hệ thống không tầm thường gần như không bao giờ "không có lỗi"; có, phần mềm vẫn có thể tin cậy dù còn lỗi (lỗi nằm trên nhánh người dùng không bao giờ đi); không, "không có lỗi" không đảm bảo tin cậy nếu chính yêu cầu đã sai.</li>
<li><strong>Why do errors happen?</strong> (slide pptx 45, bản cũ của slide 44): phần mềm do con người viết — biết nhiều nhưng không biết hết, giỏi nhưng không hoàn hảo, làm dưới áp lực deadline nên không có thời gian kiểm lại giả định.</li>
<li><strong>Testing and quality</strong> (slide pptx 64): kiểm thử <em>đo</em> chất lượng; gỡ các lỗi nó tìm được thì chất lượng (và có thể cả độ tin cậy) tăng. Kiểm thử bao gồm chức năng <em>và</em> các thuộc tính phi chức năng — độ tin cậy, khả dụng, khả năng bảo trì, tái sử dụng, khả năng kiểm thử.</li>
</ul>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — classify and cost it</h3>
<p><b>Situation.</b> The spec says "users aged 18 or older may register". The developer, rushing before a demo, writes <code>if (age &gt; 18)</code>. In production an 18-year-old is rejected; she posts about it and 40 sign-ups are lost that day.</p>
<ol>
<li><strong>Root cause:</strong> time pressure + no review of boundary rules (a process gap).</li>
<li><strong>Error:</strong> the developer's misreading of "18 or older".</li>
<li><strong>Defect:</strong> <code>age &gt; 18</code> instead of <code>age &gt;= 18</code>.</li>
<li><strong>Failure:</strong> the rejection of an 18-year-old at registration (only visible at exactly 18 — a boundary).</li>
<li><strong>Effect:</strong> the complaint and the 40 lost sign-ups.</li>
</ol>
<p><b>Cost (slide 45 multipliers).</b> Say fixing it during coding/unit test (the 4× stage) takes 1 hour. Then one "unit" of the chart is 1 h ÷ 4 = 0.25 h: a requirements-review fix would have cost 0.25 h, and after release it costs 16 × 0.25 h = <strong>4 hours</strong> of fix-build-deploy-verify work — before counting the lost customers. The process fix from RCA: add "boundary values" to the code-review checklist and to the test-design technique list (BVA, Chapter 4).</p>
<div class="pitfall"><b>Do not confuse failure with effect, or error with root cause.</b> The failure is what the <em>system</em> did; the effect is what happened to <em>people or the business</em>. The error is the individual mistake; the root cause is <em>why</em> that mistake was possible.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>How solid is the "16× cost" curve?</b> The multiplier chart goes back to Barry Boehm's 1981 data and is repeated in almost every textbook, but Laurent Bossavit (<em>The Leprechauns of Software Engineering</em>) showed that many of the exact numbers come from small or second-hand studies. The <em>direction</em> is well supported — late defects cost more — but the size varies by project. In continuous-delivery teams with fast automated pipelines the curve flattens a lot, which is one reason DevOps invests so heavily in automation. <em>Outside the syllabus because CTFL presents the curve as a fixed fact.</em></div>`,
    `<h3>Ví dụ có lời giải · Phân loại và tính chi phí</h3>
<p><b>Tình huống.</b> Đặc tả ghi "người từ 18 tuổi trở lên được đăng ký". Developer vội cho kịp buổi demo nên viết <code>if (age &gt; 18)</code>. Trên production một bạn đúng 18 tuổi bị từ chối; bạn ấy đăng lên mạng và hôm đó mất 40 lượt đăng ký.</p>
<ol>
<li><strong>Root cause:</strong> áp lực thời gian + không review các luật biên (lỗ hổng quy trình).</li>
<li><strong>Error:</strong> developer đọc sai "từ 18 tuổi trở lên".</li>
<li><strong>Defect:</strong> <code>age &gt; 18</code> thay vì <code>age &gt;= 18</code>.</li>
<li><strong>Failure:</strong> người 18 tuổi bị từ chối khi đăng ký (chỉ lộ ra đúng ở 18 — một giá trị biên).</li>
<li><strong>Effect:</strong> lời phàn nàn và 40 lượt đăng ký bị mất.</li>
</ol>
<p><b>Chi phí (hệ số slide 45).</b> Giả sử sửa ngay ở khâu code/unit test (mức 4×) mất 1 giờ. Khi đó một "đơn vị" của biểu đồ là 1 giờ ÷ 4 = 0,25 giờ: nếu bắt được lúc review yêu cầu chỉ tốn 0,25 giờ, còn sau phát hành tốn 16 × 0,25 = <strong>4 giờ</strong> sửa-build-triển khai-kiểm lại — chưa kể khách hàng bị mất. Cải tiến quy trình rút ra từ RCA: thêm mục "giá trị biên" vào checklist review code và vào danh sách kỹ thuật thiết kế test (BVA, Chương 4).</p>
<div class="pitfall"><b>Đừng nhầm failure với effect, hay error với root cause.</b> Failure là việc <em>hệ thống</em> đã làm; effect là điều xảy ra với <em>con người hoặc doanh nghiệp</em>. Error là sai sót cụ thể của một người; root cause là <em>vì sao</em> sai sót đó có thể xảy ra.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đường cong "16×" chắc chắn tới đâu?</b> Biểu đồ hệ số bắt nguồn từ dữ liệu của Barry Boehm năm 1981 và được lặp lại ở gần như mọi giáo trình, nhưng Laurent Bossavit (<em>The Leprechauns of Software Engineering</em>) chỉ ra nhiều con số chính xác đến từ các nghiên cứu nhỏ hoặc trích lại. <em>Chiều hướng</em> thì có cơ sở vững — lỗi muộn đắt hơn — nhưng độ lớn thay đổi theo dự án. Ở các nhóm continuous delivery có pipeline tự động nhanh, đường cong phẳng đi rất nhiều — một lý do DevOps đầu tư mạnh vào tự động hoá. <em>Ngoài giáo trình vì CTFL trình bày đường cong như một sự thật cố định.</em></div>`),
    books([
      ['fst4', 'Ch.1 §2 "Why is testing necessary?" — pp.5–9 (PDF 19–23); Figure 1.1 p.8, Figure 1.2 p.9', 'Chương 1 §2 "Why is testing necessary?" — trang 5–9 (PDF 19–23); Hình 1.1 trang 8, Hình 1.2 trang 9'],
      ['fst', '§1.1 "Why is testing necessary?" — pp.1–10 (PDF 4–13)', '§1.1 "Why is testing necessary?" — trang 1–10 (PDF 4–13)'],
      ['sp5', '§2.1.1 Defect and fault terminology (PDF 30); §2.2 Software quality & §2.2.2 QM and QA (PDF 44–48)', '§2.1.1 Thuật ngữ defect/fault (PDF 30); §2.2 Chất lượng phần mềm & §2.2.2 QM và QA (PDF 44–48)'],
      ['sp4', '§2.1.1 Error, defect and bug terminology p.7 (PDF 22); §2.1.3 Software quality p.11 (PDF 26)', '§2.1.1 Thuật ngữ error/defect/bug trang 7 (PDF 22); §2.1.3 Chất lượng phần mềm trang 11 (PDF 26)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────────── 1.3 Seven principles ─────────────────────────── */
const L13 = {
  title: '1.3 — The seven testing principles|||1.3 — Bảy nguyên tắc kiểm thử',
  slug: 'swt301-seven-principles',
  type: 'VIDEO',
  description: 'SWT1 slide 53–72: 7 nguyên tắc ISTQB, vì sao không thể test vét cạn (tính lại con số 480.000 test), "bao nhiêu là đủ?" — phụ thuộc rủi ro, kèm đáp án 5 câu hỏi trên slide.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.3 · SWT1 slides 53–72</span>
<h2>The seven testing principles</h2>
<p class="lead">Seven short sentences that appear in almost every ISTQB and FE paper — usually as "which principle explains this situation?". Learn the exact wording, one example for each, and the two traps (1 and 7).</p>
<div class="callout"><b>Learning objective.</b> LO-1.3.1 Explain the seven testing principles (K2).</div>
<table>
<thead><tr><th>#</th><th>Principle (CTFL 2018 wording)</th><th>One-line meaning</th><th>Wording in CTFL v4 (2023)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Testing shows the presence of defects</td><td>…never their absence</td><td>Testing shows the presence, not the absence of defects</td></tr>
<tr><td>2</td><td>Exhaustive testing is impossible</td><td>prioritise by risk and technique</td><td>same</td></tr>
<tr><td>3</td><td>Early testing</td><td>shift left — saves time and money</td><td>Early testing saves time and money</td></tr>
<tr><td>4</td><td>Defect clustering</td><td>a few modules hold most defects</td><td>Defects cluster together</td></tr>
<tr><td>5</td><td>Pesticide paradox</td><td>the same tests stop finding new bugs</td><td>Tests wear out</td></tr>
<tr><td>6</td><td>Testing is context dependent</td><td>a pacemaker ≠ a web shop</td><td>same</td></tr>
<tr><td>7</td><td>Absence-of-errors fallacy</td><td>bug-free but useless is still a failure</td><td>Absence-of-defects fallacy</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 1 · Bài 1.3 · SWT1 slide 53–72</span>
<h2>Bảy nguyên tắc kiểm thử</h2>
<p class="lead">Bảy câu ngắn xuất hiện trong gần như mọi đề ISTQB và FE — thường dưới dạng "nguyên tắc nào giải thích tình huống này?". Học đúng câu chữ, một ví dụ cho mỗi nguyên tắc, và hai cái bẫy (1 và 7).</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-1.3.1 Giải thích bảy nguyên tắc kiểm thử (K2).</div>
<table>
<thead><tr><th>#</th><th>Nguyên tắc (câu chữ CTFL 2018)</th><th>Ý nghĩa một dòng</th><th>Câu chữ trong CTFL v4 (2023)</th></tr></thead>
<tbody>
<tr><td>1</td><td>Testing shows the presence of defects</td><td>…không bao giờ chứng minh vắng mặt</td><td>Testing shows the presence, not the absence of defects</td></tr>
<tr><td>2</td><td>Exhaustive testing is impossible</td><td>ưu tiên theo rủi ro và kỹ thuật</td><td>giữ nguyên</td></tr>
<tr><td>3</td><td>Early testing</td><td>shift left — tiết kiệm thời gian, tiền</td><td>Early testing saves time and money</td></tr>
<tr><td>4</td><td>Defect clustering</td><td>vài module chứa phần lớn defect</td><td>Defects cluster together</td></tr>
<tr><td>5</td><td>Pesticide paradox</td><td>test cũ lặp lại ngừng tìm ra bug mới</td><td>Tests wear out</td></tr>
<tr><td>6</td><td>Testing is context dependent</td><td>máy trợ tim ≠ web bán hàng</td><td>giữ nguyên</td></tr>
<tr><td>7</td><td>Absence-of-errors fallacy</td><td>không lỗi nhưng vô dụng vẫn là thất bại</td><td>Absence-of-defects fallacy</td></tr>
</tbody>
</table>
<p>Mẹo nhớ theo thứ tự: <em>"Có – Không vét – Sớm – Cụm – Thuốc trừ sâu – Ngữ cảnh – Ngộ nhận"</em>.</p>`),
    walkHead(D, 53, 72),
    walk(D, [
      [53, 'CONTENT — Testing principles', `<p>Third block: the seven principles. Each gets its own slide (54, 55, 63–67); slides 56–62 zoom in on Principle 2 and the question "how much testing is enough?".</p>`, `<p>Khối thứ ba: bảy nguyên tắc. Mỗi nguyên tắc một slide (54, 55, 63–67); slide 56–62 đào sâu Nguyên tắc 2 và câu hỏi "test bao nhiêu là đủ?".</p>`],
      [54, 'Principle 1 — Testing shows the presence of defects',
        `<p>Testing can show that defects are present but cannot prove there are none. It reduces the probability that undiscovered defects remain; even if no defects are found, that is <strong>not a proof of correctness</strong>. Dijkstra put it as: "Program testing can be used to show the presence of bugs, but never to show their absence." Exam trap: any option saying testing "proves", "guarantees" or "shows the absence of" defects is false.</p>`,
        `<p>Kiểm thử cho thấy defect đang có mặt nhưng không chứng minh được là không còn defect. Nó giảm xác suất còn defect chưa phát hiện; kể cả khi không tìm thấy defect nào, đó <strong>không phải bằng chứng phần mềm đúng</strong>. Dijkstra nói: "Kiểm thử chương trình có thể chỉ ra sự hiện diện của bug, nhưng không bao giờ chỉ ra sự vắng mặt của chúng." Bẫy đề: phương án nào nói kiểm thử "chứng minh", "đảm bảo" hay "cho thấy không có" defect đều sai.</p>`],
      [55, 'Principle 2 — Exhaustive testing is impossible',
        `<p>Testing everything — all combinations of inputs and preconditions — is not feasible except for trivial cases. Instead of trying, we use <strong>risk analysis, test techniques and priorities</strong> to focus effort. The next slide shows how fast the numbers explode.</p>`,
        `<p>Test mọi thứ — mọi tổ hợp đầu vào và điều kiện tiên quyết — là không khả thi, trừ trường hợp tầm thường. Thay vì cố, ta dùng <strong>phân tích rủi ro, kỹ thuật thiết kế test và độ ưu tiên</strong> để tập trung công sức. Slide sau cho thấy con số bùng nổ nhanh thế nào.</p>`],
      [56, 'Why not just "test everything"?',
        `<p>The slide's model: 20 screens × 4 menus × 3 options × 10 fields × 2 input types × 100 values = <strong>480,000 tests</strong>. At 1 test per second: 480,000 s = 8,000 min = 133.3 h — and the slide's <strong>17.7 days</strong> means <em>working</em> days of 7.5 h (133.3 ÷ 7.5 ≈ 17.8), with no time for mistakes or retests. And that model is generous: it multiplies choices but treats the 10 fields as independent. Truly exhaustive testing of <em>one</em> screen with 10 fields of 100 values each needs 100<sup>10</sup> = 10<sup>20</sup> combinations — at one per second that is about 3 × 10<sup>12</sup> years.</p>`,
        `<p>Mô hình trên slide: 20 màn hình × 4 menu × 3 lựa chọn × 10 trường × 2 kiểu nhập × 100 giá trị = <strong>480.000 test</strong>. Mỗi test 1 giây: 480.000 s = 8.000 phút = 133,3 giờ — và con số <strong>17,7 ngày</strong> trên slide là tính theo <em>ngày làm việc</em> 7,5 giờ (133,3 ÷ 7,5 ≈ 17,8), chưa tính sai sót hay chạy lại. Mà mô hình đó còn "hào phóng": nó nhân các lựa chọn nhưng coi 10 trường độc lập với nhau. Test vét cạn thật sự chỉ <em>một</em> màn hình 10 trường, mỗi trường 100 giá trị, cần 100<sup>10</sup> = 10<sup>20</sup> tổ hợp — mỗi giây một ca thì mất khoảng 3 × 10<sup>12</sup> năm.</p>`],
      [57, 'Exhaustive testing?',
        `<p>Two mini-quizzes with the answers ticked. What is exhaustive testing? ✗ when all testers are exhausted (joke) · ✗ when all <em>planned</em> tests have run (that is just completing the plan) · ✓ <strong>exercising all combinations of inputs and preconditions</strong>. How much time would it take? ✗ infinite (only for unbounded inputs) · ✗ not much · ✓ <strong>an impractical amount of time</strong>.</p>`,
        `<p>Hai câu hỏi nhỏ có sẵn đáp án. Test vét cạn là gì? ✗ khi tester kiệt sức (đùa) · ✗ khi đã chạy hết các test <em>đã lên kế hoạch</em> (đó chỉ là làm xong kế hoạch) · ✓ <strong>chạy mọi tổ hợp đầu vào và điều kiện tiên quyết</strong>. Mất bao lâu? ✗ vô hạn (chỉ đúng khi đầu vào không giới hạn) · ✗ không lâu · ✓ <strong>một lượng thời gian phi thực tế</strong>.</p>`],
      [58, 'How much testing is enough?',
        `<p>✗ It's never enough · ✗ when you have done what you planned · ✗ when the customer is happy · ✗ when you have proved the system works · ✗/✓ when you are confident it works (confidence is an objective, but it must be justified by risk) · ✓ <strong>it depends on the risks for your system</strong>. This is the only fully correct answer in exam questions of this type.</p>`,
        `<p>✗ Không bao giờ đủ · ✗ khi đã làm xong kế hoạch · ✗ khi khách hàng hài lòng · ✗ khi đã chứng minh hệ thống chạy đúng · ✗/✓ khi tự tin hệ thống chạy đúng (niềm tin là một mục tiêu, nhưng phải có cơ sở rủi ro) · ✓ <strong>tuỳ vào rủi ro của hệ thống</strong>. Đây là đáp án đúng trọn vẹn duy nhất cho dạng câu hỏi này.</p>`],
      [59, 'How much testing? It depends on RISK',
        `<p>The risks to weigh: missing important faults · incurring failure costs · releasing untested or under-tested software · losing credibility and market share · missing a market window · <strong>over-testing / ineffective testing</strong>. The last one matters: testing too much is also a risk, because it burns time and money you could have spent elsewhere or delays the release.</p>`,
        `<p>Các rủi ro cần cân: bỏ sót lỗi quan trọng · gánh chi phí hỏng hóc · phát hành phần mềm chưa test hoặc test chưa đủ · mất uy tín và thị phần · lỡ thời điểm thị trường · <strong>test quá mức / test không hiệu quả</strong>. Cái cuối rất quan trọng: test quá nhiều cũng là rủi ro, vì đốt thời gian và tiền lẽ ra dùng việc khác, hoặc làm trễ phát hành.</p>`],
      [60, 'So little time, so much to test…',
        `<p>Test time is always limited, so use <strong>risk</strong> to decide what to test first, what to test most, how thoroughly to test each item, and what <em>not</em> to test this time — i.e. where to place emphasis — and to allocate the time by prioritising.</p>`,
        `<p>Thời gian test luôn có hạn, nên dùng <strong>rủi ro</strong> để quyết định test gì trước, test gì nhiều nhất, test mỗi hạng mục kỹ đến đâu, và lần này <em>không</em> test gì — tức là đặt trọng tâm vào đâu — và để phân bổ thời gian theo độ ưu tiên.</p>`],
      [61, 'Most important principle',
        `<p><strong>"Prioritise tests so that, whenever you stop testing, you have done the best testing in the time available."</strong> Testing is often cut short by the deadline; if the most important tests ran first, stopping early still leaves you with the most valuable information. In practice: sort your test cases by risk priority and run them in that order.</p>`,
        `<p><strong>"Ưu tiên các test sao cho, dù dừng test lúc nào, bạn cũng đã test tốt nhất có thể trong thời gian cho phép."</strong> Việc test hay bị deadline cắt ngang; nếu test quan trọng nhất đã chạy trước thì dừng sớm vẫn giữ được thông tin giá trị nhất. Thực tế: sắp xếp test case theo mức ưu tiên rủi ro và chạy theo đúng thứ tự đó.</p>`],
      [62, 'Other factors that influence testing',
        `<p>Besides risk: contractual requirements, legal requirements, and industry-specific requirements (the pharmaceutical industry under the FDA, compiler standard tests, safety-critical domains such as railway switching and air-traffic control). Conclusion in the box: <em>it is difficult to determine how much testing is enough, but it is not impossible.</em></p>`,
        `<p>Ngoài rủi ro còn có: yêu cầu hợp đồng, yêu cầu pháp lý, và yêu cầu riêng của ngành (dược phẩm theo FDA, bộ test chuẩn cho trình biên dịch, lĩnh vực an toàn như bẻ ghi đường sắt, kiểm soát không lưu). Kết luận trong khung: <em>khó xác định test bao nhiêu là đủ, nhưng không phải là không thể.</em></p>`],
      [63, 'Principle 3 — Early testing',
        `<p>Testing activities, both static and dynamic, should start <strong>as early as possible</strong> in the lifecycle and be focused on defined objectives. This is called <strong>"shift left"</strong>. Testing early reduces or eliminates costly changes — the 1×→16× curve of slide 45. Examples: reviewing requirements, writing acceptance tests before coding, TDD.</p>`,
        `<p>Hoạt động kiểm thử, cả tĩnh lẫn động, nên bắt đầu <strong>càng sớm càng tốt</strong> trong vòng đời và tập trung vào mục tiêu đã xác định. Cách làm này gọi là <strong>"shift left"</strong>. Test sớm giảm hoặc loại bỏ những thay đổi tốn kém — đường cong 1×→16× ở slide 45. Ví dụ: review yêu cầu, viết acceptance test trước khi code, TDD.</p>`],
      [64, 'Principle 4 — Defect clustering',
        `<p>A small number of modules usually contain most of the defects found before release, or cause most operational failures (a Pareto-like 80/20 distribution). Predicted and observed clusters are an important <strong>input to risk analysis</strong>: test more where defects cluster — complex, recently changed or poorly understood modules.</p>`,
        `<p>Một số ít module thường chứa phần lớn defect tìm được trước phát hành, hoặc gây ra phần lớn failure khi vận hành (phân bố kiểu Pareto 80/20). Các cụm defect dự đoán và quan sát được là <strong>đầu vào quan trọng cho phân tích rủi ro</strong>: test nhiều hơn ở nơi defect co cụm — module phức tạp, vừa sửa nhiều, hoặc ít người hiểu.</p>`],
      [65, 'Principle 5 — Pesticide paradox',
        `<p>If the same tests are repeated over and over, they eventually stop finding new defects — like insects becoming resistant to a pesticide. To find new defects, existing tests and test data must be changed and new tests written. Nuance (made explicit in CTFL v4, "tests wear out"): for <em>automated regression</em> tests a stable set is fine — their job is to confirm nothing broke, not to find new bugs.</p>`,
        `<p>Nếu cùng một bộ test bị lặp lại mãi, đến lúc nó không tìm ra defect mới nào nữa — như sâu bọ kháng thuốc trừ sâu. Muốn tìm defect mới phải thay đổi test và dữ liệu test hiện có, và viết test mới. Lưu ý (CTFL v4 nói rõ, "tests wear out"): với test <em>hồi quy tự động</em> thì bộ test ổn định là bình thường — việc của chúng là khẳng định không có gì hỏng, không phải tìm bug mới.</p>`],
      [66, 'Principle 6 — Testing is context dependent',
        `<p>Testing is done differently in different contexts: safety-critical software (a pacemaker, a flight controller) is tested differently from an e-commerce site; a startup MVP differently from a bank core system; an Agile project differently from a sequential one. Techniques, rigour, documentation and independence all change with context.</p>`,
        `<p>Kiểm thử được làm khác nhau trong những ngữ cảnh khác nhau: phần mềm an toàn-sống-còn (máy trợ tim, bộ điều khiển bay) được test khác một trang thương mại điện tử; MVP của startup khác hệ thống lõi ngân hàng; dự án Agile khác dự án tuần tự. Kỹ thuật, độ khắt khe, tài liệu và mức độc lập đều thay đổi theo ngữ cảnh.</p>`],
      [67, 'Principle 7 — Absence-of-errors fallacy',
        `<p>Finding and fixing many defects does not help if the system built is <strong>unusable</strong> or does not fulfil the users' needs and expectations. It is a fallacy (a false belief) to think "no known defects = successful product". This is why <em>validation</em> matters as much as verification. (The slide's text has a stray word "fallacy" in the middle of the sentence — a copy-paste slip in the deck.)</p>`,
        `<p>Tìm và sửa thật nhiều defect cũng vô ích nếu hệ thống làm ra <strong>không dùng được</strong> hoặc không đáp ứng nhu cầu và kỳ vọng của người dùng. Nghĩ rằng "không còn lỗi đã biết = sản phẩm thành công" là một ngộ nhận. Vì thế <em>validation</em> quan trọng không kém verification. (Câu trên slide có chữ "fallacy" lạc vào giữa câu — lỗi dán nhầm của bộ slide.)</p>`],
      [68, 'Question — which statement describes a principle correctly?',
        AE('c — It is normally impossible to test all input/output combinations', 'That is Principle 2. a and b claim exhaustive testing is possible (with automation or effort) — false; d contradicts Principle 1.'),
        AV('c — Thông thường không thể test mọi tổ hợp đầu vào/đầu ra', 'Đó là Nguyên tắc 2. a và b cho rằng test vét cạn khả thi (nhờ tự động hoá hay cố gắng) — sai; d trái với Nguyên tắc 1.')],
      [69, 'Question — why avoid the pesticide paradox?',
        AE('d — Running the same tests over and over will reduce the chance of finding new defects', 'That is the definition. a, b and c are distractors built from unrelated words.'),
        AV('d — Chạy lặp đi lặp lại cùng các test sẽ giảm khả năng tìm ra defect mới', 'Đúng định nghĩa. a, b, c là phương án nhiễu ghép từ các chữ không liên quan.')],
      [70, 'Question — a true statement about exhaustive testing',
        AE('b — It is not feasible except in the case of trivial software', 'Word for word from the principle. It is not a form of stress testing (a), automation does not make it feasible (c), and it is nobody\'s responsibility because nobody can do it (d).'),
        AV('b — Không khả thi, trừ với phần mềm tầm thường', 'Đúng từng chữ của nguyên tắc. Nó không phải một dạng stress test (a), tự động hoá không làm nó khả thi (c), và không ai chịu trách nhiệm làm vì không ai làm nổi (d).')],
      [71, 'Question — the 90–95% defect detection case',
        AE('c — Exhaustive testing is impossible', 'Because you cannot test everything, some defects will always escape; 90–95% detection with happy users and low-impact failures is a good, risk-based result. d is wrong: the absence-of-errors fallacy is about building the wrong system, but here users are happy.'),
        AV('c — Không thể test vét cạn', 'Vì không thể test hết nên luôn có defect lọt; phát hiện 90–95% trong khi người dùng hài lòng và failure ít tác động là kết quả tốt, dựa trên rủi ro. d sai: ngộ nhận "không lỗi" nói về việc làm sai hệ thống, còn ở đây người dùng hài lòng.')],
      [72, 'Question — very complex code',
        AE('b — Defect clustering', 'Complexity is one of the best predictors of where defects cluster, so the complex code is likely to hold more defects and deserves more testing.'),
        AV('b — Defect clustering', 'Độ phức tạp là một trong những dấu hiệu dự báo tốt nhất nơi defect co cụm, nên code phức tạp nhiều khả năng chứa nhiều defect hơn và cần test nhiều hơn.')],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — name the principle</h3>
<table>
<thead><tr><th>Situation</th><th>Principle</th></tr></thead>
<tbody>
<tr><td>After six months, the nightly manual regression suite has not found a single new defect, although users keep reporting bugs.</td><td>5 · Pesticide paradox — refresh and extend the tests.</td></tr>
<tr><td>70% of production incidents come from the payment module and the report generator.</td><td>4 · Defect clustering — raise their risk level.</td></tr>
<tr><td>The manager asks the team to "sign that the release has zero bugs".</td><td>1 · Testing shows presence, not absence.</td></tr>
<tr><td>A hospital infusion-pump app gets formal reviews, 100% decision coverage and an external audit; the team's internal to-do app gets a few exploratory sessions.</td><td>6 · Context dependent.</td></tr>
<tr><td>A flawless app for booking library rooms is never used, because students actually wanted to book sports courts.</td><td>7 · Absence-of-errors fallacy.</td></tr>
<tr><td>Testers join the requirement workshop in week 1 and find 14 ambiguities.</td><td>3 · Early testing.</td></tr>
</tbody>
</table>
<div class="pitfall"><b>Two words that decide the answer.</b> "Prove", "guarantee", "no defects" → Principle 1 (and the option is false). "Useless", "not what users need" → Principle 7. "Same tests again" → Principle 5. "Most defects in few modules" → Principle 4.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Principle 2 in numbers — combinatorial testing.</b> If exhaustive testing is impossible, how do real teams choose? Studies by NIST (Kuhn et al.) found that most field failures are triggered by interactions of just <b>1 to 6 parameters</b>, with the large majority involving 1–2. <em>Pairwise</em> (all-pairs) testing therefore covers every pair of parameter values with a tiny suite: 10 parameters with 3 values each need 3<sup>10</sup> = 59,049 exhaustive tests, but an all-pairs suite needs only about 15–17. Spillner's book covers it in §5.1.5 "Pair-wise testing". <em>Outside the CTFL syllabus, but it is the practical answer to Principle 2.</em></div>`,
    `<h3>Ví dụ có lời giải · Gọi tên nguyên tắc</h3>
<table>
<thead><tr><th>Tình huống</th><th>Nguyên tắc</th></tr></thead>
<tbody>
<tr><td>Sau sáu tháng, bộ regression chạy tay mỗi đêm không tìm ra defect mới nào, trong khi người dùng vẫn báo lỗi đều đều.</td><td>5 · Pesticide paradox — làm mới và mở rộng bộ test.</td></tr>
<tr><td>70% sự cố production đến từ module thanh toán và bộ sinh báo cáo.</td><td>4 · Defect clustering — nâng mức rủi ro của hai module này.</td></tr>
<tr><td>Quản lý bảo nhóm "ký xác nhận bản phát hành không có bug nào".</td><td>1 · Kiểm thử chỉ ra sự hiện diện, không chứng minh vắng mặt.</td></tr>
<tr><td>App máy truyền dịch bệnh viện được review chính thức, đạt 100% decision coverage và kiểm định bên ngoài; app to-do nội bộ chỉ vài buổi exploratory.</td><td>6 · Phụ thuộc ngữ cảnh.</td></tr>
<tr><td>Một app đặt phòng thư viện hoàn hảo không ai dùng, vì sinh viên thật ra muốn đặt sân thể thao.</td><td>7 · Ngộ nhận "không có lỗi".</td></tr>
<tr><td>Tester tham gia workshop yêu cầu ngay tuần 1 và tìm ra 14 chỗ mơ hồ.</td><td>3 · Kiểm thử sớm.</td></tr>
</tbody>
</table>
<div class="pitfall"><b>Chữ khoá quyết định đáp án.</b> "Chứng minh", "đảm bảo", "không có defect" → Nguyên tắc 1 (và phương án đó sai). "Vô dụng", "không đúng nhu cầu" → Nguyên tắc 7. "Lặp lại cùng test" → Nguyên tắc 5. "Phần lớn defect ở vài module" → Nguyên tắc 4.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nguyên tắc 2 bằng con số — kiểm thử tổ hợp.</b> Nếu không thể test vét cạn, nhóm thực tế chọn thế nào? Các nghiên cứu của NIST (Kuhn và cộng sự) cho thấy phần lớn failure thực tế chỉ do tương tác của <b>1 đến 6 tham số</b>, và đa số chỉ 1–2. Vì thế kiểm thử <em>pairwise</em> (mọi cặp) phủ mọi cặp giá trị tham số với một bộ test rất nhỏ: 10 tham số, mỗi cái 3 giá trị cần 3<sup>10</sup> = 59.049 test vét cạn, nhưng bộ all-pairs chỉ cần khoảng 15–17 test. Sách Spillner trình bày ở §5.1.5 "Pair-wise testing". <em>Ngoài syllabus CTFL, nhưng là câu trả lời thực tế cho Nguyên tắc 2.</em></div>`),
    books([
      ['fst4', 'Ch.1 §3 "Seven testing principles" — pp.10–14 (PDF 24–28); Table 1.1 p.11', 'Chương 1 §3 "Seven testing principles" — trang 10–14 (PDF 24–28); Bảng 1.1 trang 11'],
      ['fst', '§1.3 "Testing principles" — pp.18–19 (PDF 21–22)', '§1.3 "Testing principles" — trang 18–19 (PDF 21–22)'],
      ['sp5', '§2.1.6 "The Basic Principles of Testing" (PDF 42–43); pair-wise testing §5.1.5 (PDF 199)', '§2.1.6 "The Basic Principles of Testing" (PDF 42–43); pair-wise testing §5.1.5 (PDF 199)'],
      ['sp4', '§2.4 "General Principles of Testing" — p.33 (PDF 48)', '§2.4 "General Principles of Testing" — trang 33 (PDF 48)'],
    ]),
  ].join('\n'),
};

/* ───────────────────────────── 1.4 Test process ───────────────────────────── */
const L14 = {
  title: '1.4 — The test process: 7 activity groups, work products & traceability|||1.4 — Quy trình kiểm thử: 7 nhóm hoạt động, sản phẩm & truy vết',
  slug: 'swt301-test-process',
  type: 'VIDEO',
  description: 'SWT1 slide 73–98 + Additional Content 18–26: test basis & coverage, 7 nhóm hoạt động (planning → completion), test case & defect report mẫu, work products, bảng truy vết — kèm đáp án 8 câu hỏi trên slide.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.4 · SWT1 slides 73–98 · Additional Content 18–26</span>
<h2>The test process</h2>
<p class="lead">There is no one-size-fits-all test process, but every good one contains the same <strong>seven groups of activities</strong>. For each group you must know the question it answers, its main tasks and the <strong>work products</strong> it produces — exam questions are almost always "task X happens in which activity?".</p>
<div class="callout"><b>Learning objectives.</b> LO-1.4.1 Explain the impact of context on the test process (K2) · LO-1.4.2 Describe the test activities and tasks (K2) · LO-1.4.3 Differentiate the work products that support the test process (K2) · LO-1.4.4 Explain the value of traceability between test basis and test work products (K2).</div>
<table>
<thead><tr><th>#</th><th>Activity</th><th>Answers the question</th><th>Key tasks</th><th>Work products</th></tr></thead>
<tbody>
<tr><td>1</td><td>Test planning</td><td>Why and how much?</td><td>objectives, scope, approach, techniques, schedule, entry/exit criteria</td><td>test plan</td></tr>
<tr><td>2</td><td>Monitoring &amp; control</td><td>Are we on track? What do we change?</td><td>compare progress with plan, evaluate exit criteria, corrective actions</td><td>test progress reports, test summary reports</td></tr>
<tr><td>3</td><td>Test analysis</td><td><strong>What</strong> to test?</td><td>analyse the test basis, find its defects, define &amp; prioritise test conditions, traceability</td><td>test conditions, test charters</td></tr>
<tr><td>4</td><td>Test design</td><td><strong>How</strong> to test?</td><td>design &amp; prioritise test cases, identify test data, design the environment</td><td>test cases (high-level/low-level), test data needs</td></tr>
<tr><td>5</td><td>Test implementation</td><td>Is <strong>everything ready</strong> to run?</td><td>build procedures &amp; scripts, test suites, execution schedule, environment, data</td><td>test procedures, test suites, test execution schedule</td></tr>
<tr><td>6</td><td>Test execution</td><td>Run and compare</td><td>run tests, compare actual vs expected, analyse anomalies, report defects, retest &amp; regression</td><td>test logs, status of test cases, defect reports</td></tr>
<tr><td>7</td><td>Test completion</td><td>What did we learn / hand over?</td><td>check defect reports closed, summary report, archive &amp; hand over testware, lessons learned</td><td>test summary report, change requests, archived testware</td></tr>
</tbody>
</table>
<div class="callout ok"><b>Older books use a 5-step process (CTFL 2011)</b> — you will meet it in the Spillner 4th edition and the older Graham book, and in some FE questions: (1) planning &amp; control, (2) analysis &amp; design, (3) implementation &amp; execution, (4) evaluating exit criteria &amp; reporting, (5) test closure. Mapping: "closure" = completion; "evaluating exit criteria" now sits inside monitoring &amp; control.</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.4 · SWT1 slide 73–98 · Additional Content 18–26</span>
<h2>Quy trình kiểm thử</h2>
<p class="lead">Không có quy trình test "một cỡ vừa mọi người", nhưng quy trình tốt nào cũng có đủ <strong>bảy nhóm hoạt động</strong> giống nhau. Với mỗi nhóm bạn phải biết nó trả lời câu hỏi gì, gồm những việc chính nào và tạo ra <strong>sản phẩm (work product)</strong> gì — câu hỏi thi gần như luôn có dạng "việc X diễn ra ở hoạt động nào?".</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-1.4.1 Giải thích ảnh hưởng của ngữ cảnh lên quy trình test (K2) · LO-1.4.2 Mô tả các hoạt động và công việc kiểm thử (K2) · LO-1.4.3 Phân biệt các sản phẩm hỗ trợ quy trình test (K2) · LO-1.4.4 Giải thích giá trị của truy vết giữa test basis và sản phẩm kiểm thử (K2).</div>
<table>
<thead><tr><th>#</th><th>Hoạt động</th><th>Trả lời câu hỏi</th><th>Việc chính</th><th>Sản phẩm</th></tr></thead>
<tbody>
<tr><td>1</td><td>Test planning (lập kế hoạch)</td><td>Vì sao và bao nhiêu?</td><td>mục tiêu, phạm vi, cách tiếp cận, kỹ thuật, lịch, tiêu chí vào/ra</td><td>test plan</td></tr>
<tr><td>2</td><td>Monitoring &amp; control (giám sát &amp; kiểm soát)</td><td>Có đúng tiến độ không? Cần điều chỉnh gì?</td><td>so tiến độ với kế hoạch, đánh giá tiêu chí ra, hành động khắc phục</td><td>test progress report, test summary report</td></tr>
<tr><td>3</td><td>Test analysis (phân tích)</td><td>Test <strong>cái gì</strong>?</td><td>phân tích test basis, tìm defect trong nó, xác định &amp; ưu tiên test condition, truy vết</td><td>test condition, test charter</td></tr>
<tr><td>4</td><td>Test design (thiết kế)</td><td>Test <strong>như thế nào</strong>?</td><td>thiết kế &amp; ưu tiên test case, xác định dữ liệu test, thiết kế môi trường</td><td>test case (mức cao/mức thấp), nhu cầu dữ liệu test</td></tr>
<tr><td>5</td><td>Test implementation (triển khai)</td><td>Đã <strong>sẵn sàng hết</strong> để chạy chưa?</td><td>viết thủ tục &amp; script, test suite, lịch thực thi, dựng môi trường, dữ liệu</td><td>test procedure, test suite, test execution schedule</td></tr>
<tr><td>6</td><td>Test execution (thực thi)</td><td>Chạy và so sánh</td><td>chạy test, so kết quả thực tế với mong đợi, phân tích bất thường, báo defect, test lại &amp; hồi quy</td><td>test log, trạng thái test case, defect report</td></tr>
<tr><td>7</td><td>Test completion (hoàn tất)</td><td>Rút ra gì / bàn giao gì?</td><td>kiểm defect report đã đóng, báo cáo tổng kết, lưu trữ &amp; bàn giao testware, bài học kinh nghiệm</td><td>test summary report, change request, testware đã lưu trữ</td></tr>
</tbody>
</table>
<div class="callout ok"><b>Sách cũ dùng quy trình 5 bước (CTFL 2011)</b> — bạn sẽ gặp trong Spillner bản 4 và sách Graham bản cũ, và trong một số câu FE: (1) planning &amp; control, (2) analysis &amp; design, (3) implementation &amp; execution, (4) evaluating exit criteria &amp; reporting, (5) test closure. Quy đổi: "closure" = completion; "evaluating exit criteria" nay nằm trong monitoring &amp; control.</div>`),
    walkHead(D, 73, 98),
    walk(D, [
      [73, 'CONTENT — Test process', `<p>Fourth block. (The deck lists "Why testing is necessary" before "What is testing" here — a small inconsistency with slide 2; the content order is the same.)</p>`, `<p>Khối thứ tư. (Ở slide này thứ tự "Why testing is necessary" và "What is testing" bị đảo so với slide 2 — sơ suất nhỏ của bộ slide; nội dung vẫn theo đúng thứ tự.)</p>`],
      [74, 'Test Process',
        `<p>There is no "one size fits all" test process, but testing needs a <strong>common set of activities</strong> without which it is less likely to reach its objectives. The concrete process of an organisation depends on its context (LO-1.4.1): lifecycle model, domain and risks, constraints (budget, time), organisational policies, required standards.</p>`,
        `<p>Không có quy trình test "một cỡ vừa tất cả", nhưng kiểm thử cần một <strong>bộ hoạt động chung</strong>, thiếu nó thì khó đạt mục tiêu (ghi chú của thầy/cô trên slide nói đúng ý này). Quy trình cụ thể của mỗi tổ chức phụ thuộc ngữ cảnh (LO-1.4.1): mô hình vòng đời, lĩnh vực và rủi ro, ràng buộc (ngân sách, thời gian), chính sách tổ chức, chuẩn bắt buộc.</p>`],
      [75, 'Test Process in Context — test basis & coverage',
        `<p><strong>Test basis</strong> = the body of knowledge used as the basis for test analysis and design — whatever the tests are derived from (user requirements, user stories, design, code). It helps if the test basis has <strong>measurable coverage criteria</strong>. <strong>Coverage</strong> = the degree to which specified coverage items have been exercised by a test suite, <em>expressed as a percentage</em>.</p>`,
        `<p><strong>Test basis (cơ sở kiểm thử)</strong> = khối kiến thức làm nền cho phân tích và thiết kế test — bất cứ thứ gì mà test được suy ra từ đó (yêu cầu người dùng, user story, thiết kế, code). Sẽ hữu ích nếu test basis có <strong>tiêu chí bao phủ đo được</strong>. <strong>Coverage (độ bao phủ)</strong> = mức độ các coverage item đã được một bộ test chạy tới, <em>biểu thị bằng phần trăm</em>.</p>`],
      [76, 'Test Process in Context — mobile app example',
        `<p>For a mobile app the test basis may be a list of requirements <em>and</em> a list of supported devices; each requirement and each device is an element of the test basis. A coverage criterion could be "at least one test case per element". <b>Worked numbers:</b> 12 requirements and 5 devices; tests executed so far touch 9 requirements and 4 devices → requirement coverage 9/12 = <strong>75%</strong>, device coverage 4/5 = <strong>80%</strong>. The results tell stakeholders which requirements are fulfilled and on which devices failures were seen.</p>`,
        `<p>Với một app di động, test basis có thể là danh sách yêu cầu <em>và</em> danh sách thiết bị hỗ trợ; mỗi yêu cầu và mỗi thiết bị là một phần tử của test basis. Tiêu chí bao phủ có thể là "ít nhất một test case cho mỗi phần tử". <b>Tính thử:</b> 12 yêu cầu và 5 thiết bị; các test đã chạy chạm tới 9 yêu cầu và 4 thiết bị → coverage yêu cầu 9/12 = <strong>75%</strong>, coverage thiết bị 4/5 = <strong>80%</strong>. Kết quả cho các bên biết yêu cầu nào đã đáp ứng và failure xuất hiện trên thiết bị nào.</p>`],
      [77, 'Test Process Activities (the arrow)',
        `<p>The seven activity groups on one arrow: Planning → Monitoring &amp; Control → Analysis → Design → Implementation → Execution → Completion. Memorise the order; question 16 (slide 16) and several FE questions depend on it.</p>`,
        `<p>Bảy nhóm hoạt động trên một mũi tên: Planning → Monitoring &amp; Control → Analysis → Design → Implementation → Execution → Completion. Phải thuộc thứ tự; câu hỏi ở slide 16 và nhiều câu FE dựa vào nó.</p>`],
      [78, 'Test Process Activities — not strictly sequential',
        `<p>Although the activities look sequential, they <strong>overlap, run concurrently or iterate</strong>, and each consists of many tasks that vary by project or release. Monitoring &amp; control runs during the whole project; in Agile, analysis → execution happen inside every sprint.</p>`,
        `<p>Dù trông tuần tự, các hoạt động <strong>chồng lấn, chạy song song hoặc lặp lại</strong>, và mỗi hoạt động gồm nhiều việc thay đổi theo dự án/bản phát hành. Monitoring &amp; control chạy suốt dự án; trong Agile, từ analysis tới execution diễn ra trong mỗi sprint.</p>`],
      [79, 'Step 1. Test Planning',
        `<p>Defining the <strong>objectives</strong> of testing and the <strong>approach</strong> for meeting them within the constraints and context of the project: choosing test techniques, deciding tasks, formulating a test schedule, defining entry and exit criteria. Output: the <strong>test plan</strong> (revisited as feedback comes in — Chapter 5).</p>`,
        `<p>Xác định <strong>mục tiêu</strong> kiểm thử và <strong>cách tiếp cận</strong> để đạt chúng trong ràng buộc và ngữ cảnh dự án: chọn kỹ thuật test, xác định công việc, lập lịch test, định tiêu chí vào/ra. Sản phẩm: <strong>test plan</strong> (được cập nhật khi có phản hồi — Chương 5).</p>`],
      [80, 'Step 2. Test Monitoring and Control',
        `<p><strong>Monitoring</strong> = ongoing <em>comparison</em> of actual progress against the plan using the metrics defined in the plan. <strong>Control</strong> = taking <em>actions</em> needed to meet the plan's objectives. Both are supported by <strong>exit criteria</strong> (Definition of Done in Agile). Progress is communicated in <strong>test progress reports</strong>. Memory aid: monitoring <em>looks</em>, control <em>acts</em>.</p>`,
        `<p><strong>Monitoring (giám sát)</strong> = liên tục <em>so sánh</em> tiến độ thực tế với kế hoạch bằng các chỉ số định trong kế hoạch. <strong>Control (kiểm soát)</strong> = thực hiện <em>hành động</em> cần thiết để đạt mục tiêu của kế hoạch. Cả hai dựa trên <strong>exit criteria</strong> (Definition of Done trong Agile). Tiến độ được báo trong <strong>test progress report</strong>. Mẹo nhớ: monitoring <em>nhìn</em>, control <em>làm</em>.</p>`],
      [81, 'Step 3. Test Analysis — WHAT to test',
        `<p><strong>Test condition</strong> = an aspect of the test basis relevant to specific test objectives (e.g. "login with a locked account"). <strong>Test analysis</strong> identifies test conditions by analysing the test basis (requirement specs, design, code, risk analysis report) and answers <strong>"What to test?"</strong>. It captures <strong>bi-directional traceability</strong> (each condition ↔ its requirement) and conditions can serve as objectives in exploratory <strong>test charters</strong>. Analysis also finds defects in the test basis itself (ambiguities, contradictions).</p>`,
        `<p><strong>Test condition</strong> = một khía cạnh của test basis liên quan tới mục tiêu test cụ thể (vd "đăng nhập bằng tài khoản bị khoá"). <strong>Test analysis</strong> xác định test condition bằng cách phân tích test basis (đặc tả yêu cầu, thiết kế, code, báo cáo phân tích rủi ro) và trả lời <strong>"Test cái gì?"</strong>. Nó lập <strong>truy vết hai chiều</strong> (mỗi condition ↔ yêu cầu của nó), và condition có thể làm mục tiêu cho <strong>test charter</strong> khi test thăm dò. Phân tích cũng tìm ra defect ngay trong test basis (chỗ mơ hồ, mâu thuẫn).</p>`],
      [82, 'Step 4. Test Design — HOW to test',
        `<p>Answers <strong>"How to test?"</strong>: design and prioritise <strong>test cases</strong> (using the techniques of Chapter 4), identify the necessary <strong>test data</strong>, and <em>design</em> the test environment (what infrastructure and tools are needed — building it is implementation).</p>`,
        `<p>Trả lời <strong>"Test như thế nào?"</strong>: thiết kế và ưu tiên <strong>test case</strong> (bằng các kỹ thuật ở Chương 4), xác định <strong>dữ liệu test</strong> cần có, và <em>thiết kế</em> môi trường test (cần hạ tầng, công cụ gì — còn <em>dựng</em> nó là việc của implementation).</p>`],
      [83, 'A good test case — the four Es',
        `<p><strong>Effective</strong> — finds faults · <strong>Exemplary</strong> — represents others (one test stands for a whole class of inputs) · <strong>Evolvable</strong> — easy to maintain · <strong>Economic</strong> — cheap to use (run, check, maintain). A test that never finds anything, duplicates others, breaks at every UI change or takes an hour to run fails one of the Es.</p>`,
        `<p><strong>Effective</strong> — tìm ra lỗi · <strong>Exemplary</strong> — đại diện được cho các ca khác (một test đứng cho cả một lớp đầu vào) · <strong>Evolvable</strong> — dễ bảo trì · <strong>Economic</strong> — rẻ khi dùng (chạy, kiểm, bảo trì). Test không bao giờ tìm ra gì, trùng lặp, gãy mỗi khi đổi giao diện hay chạy mất một tiếng là trượt một chữ E.</p>`],
      [84, 'Step 4. Test Design (cont.) — test case sheet',
        `<p>A test-case sheet for "Google Email Sample · Login": header (project, module, reference document, created by, dates), then columns <em>Test case ID · Test scenario · Test case · Pre-condition · Test steps · Test data · Expected result · Post condition · Actual result · Status</em>. The four rows are the classic login matrix: valid/valid → "Successful login"; valid/invalid, invalid/valid, invalid/invalid → "The mail and password you entered don't match". <b>Spot the mistake:</b> all four rows have the same ID <code>TC_LOGIN-001</code> — IDs must be unique (001…004), otherwise defect reports and traceability break. Actual result and status stay empty until execution.</p>`,
        `<p>Mẫu bảng test case "Google Email Sample · Login": phần đầu (dự án, module, tài liệu tham chiếu, người tạo, ngày), rồi các cột <em>Test case ID · Test scenario · Test case · Pre-condition · Test steps · Test data · Expected result · Post condition · Actual result · Status</em>. Bốn dòng là ma trận đăng nhập kinh điển: đúng/đúng → "Successful login"; đúng/sai, sai/đúng, sai/sai → "The mail and password you entered don't match". <b>Tìm lỗi trong mẫu:</b> cả bốn dòng cùng mã <code>TC_LOGIN-001</code> — mã phải duy nhất (001…004), nếu không defect report và truy vết sẽ rối. Actual result và Status để trống tới lúc thực thi.</p>`],
      [85, 'Step 5. Test Implementation — everything in place?',
        `<p>Answers <strong>"Do we now have everything in place to run the tests?"</strong>: develop and prioritise <strong>test procedures</strong> (and automated scripts), group them into <strong>test suites</strong>, arrange suites in a <strong>test execution schedule</strong>, <em>build</em> the test environment (including stubs, drivers, simulators) and load the test data.</p>`,
        `<p>Trả lời <strong>"Đã có đủ mọi thứ để chạy test chưa?"</strong>: xây dựng và ưu tiên <strong>test procedure</strong> (và script tự động), gom thành <strong>test suite</strong>, sắp các suite vào <strong>lịch thực thi (test execution schedule)</strong>, <em>dựng</em> môi trường test (kể cả stub, driver, simulator) và nạp dữ liệu test.</p>`],
      [86, 'Step 6. Test Execution',
        `<p>Test suites run according to the schedule. Compare <strong>actual</strong> with <strong>expected</strong> results; differences are <strong>anomalies</strong>. Analyse each anomaly to find its cause — a defect in the code, a <em>false positive</em>, or a defect in the test itself — then report defects based on the failures observed, log the results, and run <strong>confirmation</strong> (re-test) and/or <strong>regression</strong> tests on fixes.</p>`,
        `<p>Các test suite chạy theo lịch. So kết quả <strong>thực tế</strong> với <strong>mong đợi</strong>; chỗ khác nhau gọi là <strong>anomaly (bất thường)</strong>. Phân tích từng anomaly để tìm nguyên nhân — defect trong code, <em>false positive</em>, hay lỗi trong chính test — rồi báo defect dựa trên failure quan sát được, ghi log kết quả, và chạy <strong>confirmation test</strong> (test lại) và/hoặc <strong>regression test</strong> cho các bản sửa.</p>`],
      [87, 'Step 6. Test Execution (cont.) — a defect report',
        `<p>A sample defect report #111 "CART – Unable to add new item to my cart": reporter, submit date; overview (summary, URL, screenshot); environment (Macintosh, macOS Ventura 13.3.1, Chrome 111); steps to reproduce; expected result (2 items) vs actual result (1 item); <strong>severity Major, priority High</strong>. The speaker notes define: <strong>severity</strong> = how badly the defect affects the software's functionality; <strong>priority</strong> = how fast it must be fixed. They are independent: a crash in a rarely used admin report can be high severity / low priority; a misspelt company name on the home page is low severity / high priority. Full defect management is in Chapter 5.</p>`,
        `<p>Mẫu defect report #111 "CART – Không thêm được sản phẩm thứ hai vào giỏ": người báo, ngày báo; tổng quan (tóm tắt, URL, ảnh chụp); môi trường (Macintosh, macOS Ventura 13.3.1, Chrome 111); các bước tái hiện; kết quả mong đợi (2 sản phẩm) so với thực tế (1 sản phẩm); <strong>severity Major, priority High</strong>. Ghi chú của thầy/cô định nghĩa: <strong>severity (mức nghiêm trọng)</strong> = defect ảnh hưởng tới chức năng phần mềm nặng tới đâu; <strong>priority (độ ưu tiên)</strong> = phải sửa gấp tới đâu. Hai cái độc lập: crash ở một trang báo cáo quản trị ít ai dùng có thể severity cao / priority thấp; sai chính tả tên công ty ở trang chủ là severity thấp / priority cao. Quản lý defect đầy đủ ở Chương 5.</p>`],
      [88, 'Step 7. Test Completion',
        `<p>Collect data from completed activities at project milestones (release, end of iteration, project cancelled); check that defect reports are closed (or turned into change requests); create the <strong>test summary report</strong>; <strong>hand over the testware</strong> — <em>why?</em> so the maintenance/operations team can reuse it for regression testing and knowledge transfer. The teacher's notes add: at completion we answer "how many test cases ran, how many defects were found and fixed, with what priority and severity?" so stakeholders can decide whether to deliver or move to the next test level; completion happens more than once per project; a <em>summary</em> report is produced in monitoring &amp; control <em>and</em> completion, a <em>progress</em> report only in monitoring &amp; control.</p>`,
        `<p>Thu thập dữ liệu từ các hoạt động đã xong tại các mốc dự án (phát hành, hết iteration, dự án bị huỷ); kiểm tra defect report đã đóng (hoặc chuyển thành change request); lập <strong>test summary report</strong>; <strong>bàn giao testware</strong> — <em>vì sao?</em> để nhóm bảo trì/vận hành tái dùng cho regression test và chuyển giao tri thức. Ghi chú của thầy/cô bổ sung: khi hoàn tất ta trả lời "đã chạy bao nhiêu test case, tìm và sửa bao nhiêu defect, priority và severity ra sao?" để các bên quyết định giao hàng hay chuyển sang cấp test tiếp theo; completion xảy ra nhiều lần trong một dự án; báo cáo <em>tổng kết</em> được lập ở cả monitoring &amp; control <em>lẫn</em> completion, còn báo cáo <em>tiến độ</em> chỉ ở monitoring &amp; control.</p>`],
      [89, 'Test Work Products',
        `<p>The table to learn by heart: Planning → test plans · Monitoring &amp; control → test progress/summary reports · Analysis → test conditions, test charters · Design → test cases, test data · Implementation → test procedures, test suites, test execution schedule · Execution → status of test cases, defect reports · Completion → test summary reports, change requests.</p>`,
        `<p>Bảng phải thuộc lòng: Planning → test plan · Monitoring &amp; control → báo cáo tiến độ/tổng kết · Analysis → test condition, test charter · Design → test case, dữ liệu test · Implementation → test procedure, test suite, lịch thực thi · Execution → trạng thái test case, defect report · Completion → test summary report, change request.</p>`],
      [90, 'Comparison of tasks — intellectual vs clerical',
        `<p><strong>Planning</strong> and <strong>specification</strong> (analysis/design) are <em>intellectual, one-off</em> activities that <em>govern the quality of the tests</em>. <strong>Execution</strong> and <strong>recording</strong> are <em>clerical</em> activities <em>repeated many times</em> — so they are the ones <em>good to automate</em>. Automation speeds up the clerical part; it cannot replace the thinking that decides what is worth testing.</p>`,
        `<p><strong>Planning</strong> và <strong>specification</strong> (phân tích/thiết kế) là việc <em>trí tuệ, làm một lần</em>, <em>quyết định chất lượng của bộ test</em>. <strong>Execution</strong> và <strong>recording</strong> là việc <em>thủ tục, lặp đi lặp lại nhiều lần</em> — nên đó mới là phần <em>đáng tự động hoá</em>. Tự động hoá tăng tốc phần thủ tục; nó không thay được phần tư duy quyết định cái gì đáng test.</p>`],
      [91, 'Question — when does test control take place?',
        AE('D — During all the activities', 'Control (like monitoring) is continuous: whenever monitoring shows a deviation, corrective action can be taken in any activity.'),
        AV('D — Trong tất cả các hoạt động', 'Control (cũng như monitoring) diễn ra liên tục: hễ monitoring thấy lệch là có thể hành động khắc phục ở bất kỳ hoạt động nào.')],
      [92, 'Question — comparing planned with actual progress',
        AE('A — Test monitoring', 'Monitoring compares; control acts (D); closure (C) is the old name of completion.'),
        AV('A — Test monitoring', 'Monitoring so sánh; control hành động (D); closure (C) là tên cũ của completion.')],
      [93, 'Question — designing and prioritising test cases',
        AE('C — Test Design', 'Test cases are the work product of design ("how to test").'),
        AV('C — Test Design', 'Test case là sản phẩm của thiết kế ("test như thế nào").')],
      [94, 'Question — designing and prioritising test conditions',
        AE('B — Test Analysis', 'Test conditions ("what to test") come from analysing the test basis. Do not be misled by the word "designing" in the question.'),
        AV('B — Test Analysis', 'Test condition ("test cái gì") đến từ phân tích test basis. Đừng bị chữ "designing" trong câu hỏi đánh lừa.')],
      [95, 'Question — checking all defect reports are closed',
        AE('D — Test Completion', 'One of the completion tasks on slide 88.'),
        AV('D — Test Completion', 'Một trong các việc của completion ở slide 88.')],
      [96, 'Question — comparing actual with expected results',
        AE('D — Test Execution', 'Running tests and comparing results is execution.'),
        AV('D — Test Execution', 'Chạy test và so kết quả là execution.')],
      [97, 'Question — developing and prioritising test procedures',
        AE('C — Test Implementation', 'Procedures, suites and the execution schedule are built in implementation.'),
        AV('C — Test Implementation', 'Procedure, suite và lịch thực thi được xây ở implementation.')],
      [98, 'Question — checking results and logs against coverage criteria',
        AE('A — Test Monitoring &amp; Control', 'In the 2018 syllabus, evaluating exit criteria (e.g. "is coverage ≥ the target?") is a monitoring &amp; control task. In the old 5-step process it was "evaluating exit criteria and reporting".'),
        AV('A — Test Monitoring &amp; Control', 'Trong syllabus 2018, đánh giá tiêu chí ra (vd "coverage đã đạt mục tiêu chưa?") là việc của monitoring &amp; control. Ở quy trình 5 bước cũ nó là "evaluating exit criteria and reporting".')],
    ]),
    walkHead('addl', 18, 26, 'These slides come from the “Additional Content” deck in the Slides folder and show a user-story card and the six parts of a test case.', 'Các slide này lấy từ bộ “Additional Content” trong thư mục Slides: một thẻ user story và sáu phần của một test case.'),
    walk('addl', [
      [18, 'How to write a user story?',
        `<p>Title slide. A user story is a common <em>test basis</em> in Agile projects — you will design tests from it in Chapter 4 and in Topic 8 (Agile tester).</p>`,
        `<p>Slide tiêu đề. User story là <em>test basis</em> phổ biến trong dự án Agile — bạn sẽ thiết kế test từ nó ở Chương 4 và Topic 8 (Agile tester).</p>`],
      [19, 'User-story card template',
        `<p>The card: Story ID and title; the story <em>"As a &lt;role&gt; I want &lt;some goal&gt; so that &lt;some reason&gt;"</em>; importance and estimate; <strong>acceptance criteria</strong> ("and I know I am done when…") and a type (search, workflow, manage data, payment, report/view). For a tester the acceptance criteria are the most useful part: each criterion becomes at least one test condition.</p>`,
        `<p>Thẻ gồm: mã và tên story; câu story <em>"As a &lt;vai trò&gt; I want &lt;mục tiêu&gt; so that &lt;lý do&gt;"</em>; độ quan trọng và ước lượng; <strong>tiêu chí chấp nhận (acceptance criteria)</strong> ("và tôi biết mình xong khi…") và loại (tìm kiếm, luồng nghiệp vụ, quản lý dữ liệu, thanh toán, báo cáo/xem). Với tester, acceptance criteria là phần giá trị nhất: mỗi tiêu chí thành ít nhất một test condition.</p>`],
      [20, 'How to write a test case?', `<p>Title slide for the six-part anatomy that follows.</p>`, `<p>Slide tiêu đề cho phần giải phẫu sáu mục ngay sau.</p>`],
      [21, '1 — Title (can be the test condition)',
        `<p>The title states the condition being tested: "Check login with a valid user name and password". Good titles are specific enough that two test cases never share one.</p>`,
        `<p>Tên nêu điều kiện đang test: "Kiểm tra đăng nhập với tên đăng nhập và mật khẩu hợp lệ". Tên tốt đủ cụ thể để hai test case không bao giờ trùng tên.</p>`],
      [22, '2 — Test steps',
        `<p>Numbered, one action per step: open the site, enter the email, enter the password, click submit. Anyone should be able to repeat them without asking you.</p>`,
        `<p>Đánh số, mỗi bước một hành động: mở trang, nhập email, nhập mật khẩu, bấm submit. Ai cũng phải làm lại được mà không cần hỏi bạn.</p>`],
      [23, '3 — Test data',
        `<p>The concrete values: email <code>abc@xyz.com</code>, password <code>123456</code>. Keeping data separate from steps lets you reuse the same steps with many data rows (data-driven testing, Chapter 6).</p>`,
        `<p>Giá trị cụ thể: email <code>abc@xyz.com</code>, mật khẩu <code>123456</code>. Tách dữ liệu khỏi các bước giúp dùng lại cùng các bước với nhiều dòng dữ liệu (data-driven testing, Chương 6).</p>`],
      [24, '4 — Expected result',
        `<p>"Login is successful and the home page opens." Written <em>before</em> execution; without it nobody can decide pass or fail.</p>`,
        `<p>"Đăng nhập thành công và mở trang chủ." Viết <em>trước</em> khi thực thi; thiếu nó thì không ai quyết được pass hay fail.</p>`],
      [25, '5 — Actual result',
        `<p>Left empty until execution — "remember: we are still designing the test case". A pre-filled actual result is a red flag in a Lab or PE submission.</p>`,
        `<p>Để trống tới lúc thực thi — "nhớ rằng ta vẫn đang thiết kế test case". Điền sẵn actual result là dấu hiệu xấu trong bài Lab hay PE.</p>`],
      [26, '6 — Status (Pass / Fail / Blocked)',
        `<p>Also empty until execution. <strong>Blocked</strong> = the test cannot be run because a precondition failed or another defect prevents reaching the step (e.g. the login page itself does not load).</p>`,
        `<p>Cũng để trống tới lúc thực thi. <strong>Blocked</strong> = không chạy được test vì điều kiện tiên quyết hỏng hoặc defect khác chặn không cho tới bước đó (vd trang đăng nhập không mở được).</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — from requirement to traceability matrix</h3>
<p><b>Requirement R3</b> (test basis): "A withdrawal is allowed only if the amount ≤ balance and the amount is a positive multiple of 50,000₫."</p>
<ol>
<li><b>Analysis → test conditions</b> (what): TC-COND-1 amount vs balance · TC-COND-2 amount must be positive · TC-COND-3 multiple of 50,000.</li>
<li><b>Design → test cases</b> (how), balance = 200,000: TC01 amount 150,000 → allowed · TC02 250,000 → rejected (exceeds balance) · TC03 30,000 → rejected (not a multiple) · TC04 0 → rejected (not positive) · TC05 200,000 → allowed (equal to balance — a boundary).</li>
<li><b>Implementation → procedure &amp; suite</b>: "log in as customer C1 with balance 200,000 → open Withdraw → enter amount → confirm"; the five cases form suite <em>S-Withdraw</em>, scheduled after the login suite.</li>
</ol>
<table>
<thead><tr><th>Requirement</th><th>Condition</th><th>Test cases</th><th>Last result</th></tr></thead>
<tbody>
<tr><td rowspan="3">R3</td><td>COND-1 amount ≤ balance</td><td>TC01, TC02, TC05</td><td>Pass / Fail (#D-17) / Pass</td></tr>
<tr><td>COND-2 positive</td><td>TC04</td><td>Pass</td></tr>
<tr><td>COND-3 multiple of 50,000</td><td>TC03</td><td>Pass</td></tr>
</tbody>
</table>
<p><b>Why traceability pays (LO-1.4.4):</b> reading the matrix forward tells you the coverage of R3 (3/3 conditions covered); reading it backwards from defect D-17 tells you which requirement is at risk; if R3 changes, you know exactly which five tests to update — that is impact analysis.</p>
<div class="pitfall"><b>The three confusions examiners love.</b> Test condition (what) ≠ test case (how, with data and expected result) ≠ test procedure (the order of steps to run one or more cases). "Design the environment" is design; "build the environment" is implementation.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>ISO/IEC/IEEE 29119 and real test-management tools.</b> The document names used here (test plan, test case specification, test summary report) come from IEEE 829, which ISO/IEC/IEEE 29119-3 replaced in 2013; 29119-2 defines the processes. In industry the traceability matrix is rarely a spreadsheet: tools such as Jira with Xray or Zephyr, TestRail or Azure Test Plans link requirements, test cases, runs and defects automatically and draw coverage reports. <em>Outside the syllabus because CTFL only names the concepts, not the standards and tools that implement them.</em></div>`,
    `<h3>Ví dụ có lời giải · Từ yêu cầu tới bảng truy vết</h3>
<p><b>Yêu cầu R3</b> (test basis): "Cho phép rút tiền chỉ khi số tiền ≤ số dư và là bội số dương của 50.000₫."</p>
<ol>
<li><b>Analysis → test condition</b> (test cái gì): COND-1 số tiền so với số dư · COND-2 số tiền phải dương · COND-3 là bội của 50.000.</li>
<li><b>Design → test case</b> (test thế nào), số dư = 200.000: TC01 rút 150.000 → cho phép · TC02 250.000 → từ chối (vượt số dư) · TC03 30.000 → từ chối (không phải bội) · TC04 0 → từ chối (không dương) · TC05 200.000 → cho phép (bằng số dư — giá trị biên).</li>
<li><b>Implementation → procedure &amp; suite</b>: "đăng nhập khách hàng C1 có số dư 200.000 → mở Rút tiền → nhập số tiền → xác nhận"; năm ca gom thành suite <em>S-Withdraw</em>, xếp lịch chạy sau suite đăng nhập.</li>
</ol>
<table>
<thead><tr><th>Yêu cầu</th><th>Condition</th><th>Test case</th><th>Kết quả gần nhất</th></tr></thead>
<tbody>
<tr><td rowspan="3">R3</td><td>COND-1 số tiền ≤ số dư</td><td>TC01, TC02, TC05</td><td>Pass / Fail (#D-17) / Pass</td></tr>
<tr><td>COND-2 số dương</td><td>TC04</td><td>Pass</td></tr>
<tr><td>COND-3 bội 50.000</td><td>TC03</td><td>Pass</td></tr>
</tbody>
</table>
<p><b>Vì sao truy vết có giá trị (LO-1.4.4):</b> đọc bảng theo chiều xuôi cho biết coverage của R3 (3/3 condition đã được phủ); đọc ngược từ defect D-17 biết yêu cầu nào đang gặp rủi ro; nếu R3 thay đổi, bạn biết chính xác năm test cần sửa — đó là phân tích tác động (impact analysis).</p>
<div class="pitfall"><b>Ba cặp nhầm lẫn giám khảo rất thích.</b> Test condition (cái gì) ≠ test case (thế nào, có dữ liệu và kết quả mong đợi) ≠ test procedure (trình tự bước để chạy một hay nhiều case). "Thiết kế môi trường" là design; "dựng môi trường" là implementation.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>ISO/IEC/IEEE 29119 và công cụ quản lý test thực tế.</b> Tên các tài liệu dùng ở đây (test plan, test case specification, test summary report) đến từ IEEE 829, đã được ISO/IEC/IEEE 29119-3 thay thế năm 2013; 29119-2 định nghĩa các quy trình. Ngoài doanh nghiệp, bảng truy vết hiếm khi là file Excel: các công cụ như Jira kèm Xray hay Zephyr, TestRail, Azure Test Plans tự liên kết yêu cầu, test case, lần chạy và defect rồi vẽ báo cáo coverage. <em>Ngoài giáo trình vì CTFL chỉ nêu khái niệm, không nêu chuẩn và công cụ hiện thực chúng.</em></div>`),
    books([
      ['fst4', 'Ch.1 §4 "Test process" — pp.15–26 (PDF 29–40)', 'Chương 1 §4 "Test process" — trang 15–26 (PDF 29–40)'],
      ['fst', '§1.4 "Fundamental test process" (5-step version) — pp.20–25 (PDF 23–28)', '§1.4 "Fundamental test process" (bản 5 bước) — trang 20–25 (PDF 23–28)'],
      ['sp5', '§2.3 "The Testing Process" — PDF 49–68: planning 52, monitoring &amp; control 54, analysis 55, design 57, implementation 61, execution 62, completion 64, traceability 66, context 68', '§2.3 "The Testing Process" — PDF 49–68: planning 52, monitoring &amp; control 54, analysis 55, design 57, implementation 61, execution 62, completion 64, traceability 66, ngữ cảnh 68'],
      ['sp4', '§2.2 "The Fundamental Test Process" (5-step) — pp.17–30 (PDF 32–45)', '§2.2 "The Fundamental Test Process" (5 bước) — trang 17–30 (PDF 32–45)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 1.5 Psychology & code of ethics ─────────────────────── */
const L15 = {
  title: '1.5 — Psychology of testing, independence & code of ethics|||1.5 — Tâm lý kiểm thử, tính độc lập & quy tắc đạo đức',
  slug: 'swt301-psychology-ethics',
  type: 'VIDEO',
  description: 'SWT1 slide 99–114: vì sao tự test code của mình kém hiệu quả, 5 mức độc lập, confirmation bias, cách báo lỗi trung lập, quyền & trách nhiệm của tester, 8 nguyên tắc đạo đức ISTQB.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.5 · SWT1 slides 99–114</span>
<h2>The psychology of testing and the code of ethics</h2>
<p class="lead">Testing is done by people and its results are read by people. Finding defects feels like criticism, authors are blind to their own mistakes, and bad news is unwelcome. This lesson explains why <strong>independence</strong> helps, how to <strong>communicate defects without conflict</strong>, and the eight principles of the <strong>ISTQB code of ethics</strong>.</p>
<div class="callout"><b>Learning objectives.</b> LO-1.5.1 Identify the psychological factors that influence the success of testing (K1) · LO-1.5.2 Explain the difference between the mindset required for test activities and for development activities (K2). The code of ethics was part of the 2011 syllabus; your deck still teaches it, so learn the eight names.</div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.5 · SWT1 slide 99–114</span>
<h2>Tâm lý kiểm thử và quy tắc đạo đức</h2>
<p class="lead">Kiểm thử do con người làm và kết quả cũng do con người đọc. Tìm ra defect giống như chê bai, tác giả thì mù với lỗi của chính mình, và tin xấu chẳng ai muốn nghe. Bài này giải thích vì sao <strong>tính độc lập</strong> giúp ích, cách <strong>báo lỗi mà không gây xung đột</strong>, và tám nguyên tắc trong <strong>bộ quy tắc đạo đức ISTQB</strong>.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-1.5.1 Nhận diện các yếu tố tâm lý ảnh hưởng tới thành công của kiểm thử (K1) · LO-1.5.2 Giải thích khác biệt giữa tư duy cần cho hoạt động kiểm thử và cho hoạt động phát triển (K2). Quy tắc đạo đức nằm trong syllabus 2011; slide của lớp vẫn dạy nên hãy thuộc tám tên gọi.</div>`),
    walkHead(D, 99, 114),
    walk(D, [
      [99, 'CONTENT — Psychology of testing', `<p>Fifth block: the human side of testing.</p>`, `<p>Khối thứ năm: khía cạnh con người của kiểm thử.</p>`],
      [100, 'Why test? (✓ / ✗)',
        `<p>✓ build confidence · ✗ <strong>prove that the software is correct</strong> (impossible — Principle 1) · ✓ demonstrate conformance to requirements · ✓ find faults · ✓ reduce costs · ✓ show the system meets user needs · ✓ assess software quality. One cross among six ticks — exactly the kind of "which is NOT a reason" question the FE likes.</p>`,
        `<p>✓ tạo niềm tin · ✗ <strong>chứng minh phần mềm đúng</strong> (bất khả — Nguyên tắc 1) · ✓ chứng tỏ tuân thủ yêu cầu · ✓ tìm lỗi · ✓ giảm chi phí · ✓ cho thấy hệ thống đáp ứng nhu cầu người dùng · ✓ đánh giá chất lượng phần mềm. Một dấu chéo giữa sáu dấu tích — đúng dạng câu "đâu KHÔNG phải lý do" mà đề FE hay ra.</p>`],
      [101, 'Assessing software quality',
        `<p>Two axes: <em>software quality</em> (horizontal) and <em>test quality</em> (vertical). "Few faults found" means very different things: with <strong>high-quality tests</strong> it really indicates good software ("you think you are here"); with <strong>low-quality tests</strong> it only means the tests were weak — the software may be poor ("you may be here"). The speaker note names the trap: <em>developers' perspective — confirmation bias</em>: we believe the result that confirms what we hoped. Never judge quality by the defect count without judging the tests.</p>`,
        `<p>Hai trục: <em>chất lượng phần mềm</em> (ngang) và <em>chất lượng test</em> (dọc). "Tìm được ít lỗi" mang nghĩa rất khác nhau: với <strong>bộ test chất lượng cao</strong>, nó thực sự cho thấy phần mềm tốt ("bạn nghĩ bạn ở đây"); với <strong>bộ test kém</strong>, nó chỉ cho thấy test yếu — phần mềm có thể tệ ("bạn có thể đang ở đây"). Ghi chú của thầy/cô gọi tên cái bẫy: <em>góc nhìn của developer — confirmation bias</em>: ta tin kết quả khẳng định điều mình mong. Đừng bao giờ đánh giá chất lượng bằng số lỗi mà không đánh giá bộ test.</p>`],
      [102, 'Independence — testing your own work',
        `<p>Testing one's own work finds only about <strong>30–50%</strong> of one's own faults, because you share the same assumptions and thought processes, see what you meant rather than what is there, and have an emotional attachment — you don't want (or actively want not) to find faults.</p>`,
        `<p>Tự test sản phẩm của mình chỉ tìm được khoảng <strong>30–50%</strong> lỗi của chính mình, vì bạn mang cùng giả định và lối nghĩ, thấy điều mình định viết chứ không phải điều thật sự có, và gắn bó cảm xúc — không muốn (hoặc chủ động không muốn) tìm ra lỗi.</p>`],
      [103, 'Levels of independence',
        `<p>From least to most independent: (1) none — tests designed by the author; (2) by a different person within the development team; (3) by a different department or team (a test team); (4) by a different organisation (an agency, a certification body); (5) generated by a tool — independent of human bias but possibly low quality. More independence finds more defects but costs communication and knowledge of the product (pros and cons in Chapter 5).</p>`,
        `<p>Từ ít đến nhiều độc lập: (1) không độc lập — tác giả tự thiết kế test; (2) người khác trong cùng nhóm phát triển; (3) phòng ban hoặc nhóm khác (nhóm test); (4) tổ chức khác (công ty dịch vụ, tổ chức chứng nhận); (5) test do công cụ sinh ra — không mang thiên kiến của người nhưng có thể chất lượng thấp. Càng độc lập càng tìm ra nhiều lỗi nhưng tốn công giao tiếp và hiểu biết về sản phẩm (ưu nhược điểm ở Chương 5).</p>`],
      [104, 'Human Psychology & Testing',
        `<p>Identifying defects may be perceived as <strong>criticism</strong> of the product and its author. <strong>Confirmation bias</strong> makes it hard to accept information that disagrees with current beliefs; other <strong>cognitive biases</strong> make test results hard to understand or accept. People tend to <strong>blame the bearer of bad news</strong>, and some see testing as destructive. The remedy (arrow): the right attitude and constructive communication.</p>`,
        `<p>Việc chỉ ra defect dễ bị xem là <strong>chỉ trích</strong> sản phẩm và tác giả. <strong>Confirmation bias</strong> (thiên kiến xác nhận) khiến người ta khó chấp nhận thông tin trái với niềm tin hiện có; các <strong>thiên kiến nhận thức</strong> khác khiến kết quả test khó hiểu hoặc khó chấp nhận. Người ta có xu hướng <strong>đổ lỗi cho người mang tin xấu</strong>, và có người coi kiểm thử là phá hoại. Cách chữa (mũi tên): thái độ đúng và giao tiếp mang tính xây dựng.</p>`],
      [105, 'Attitudes & Communications',
        `<p>Six habits: start with <strong>collaboration, not battles</strong> — remind everyone of the common goal of better quality; <strong>emphasise the benefits</strong> (authors improve their skills, the organisation saves money and risk); communicate findings in a <strong>neutral, fact-focused</strong> way without criticising the person; write <strong>objective, factual</strong> defect reports; try to <strong>understand how the other person feels</strong>; <strong>confirm</strong> that you understood each other. Compare: ✗ "Your login code is garbage, it crashes all the time" → ✓ "Login returns HTTP 500 when the password contains '#'; steps attached; reproduced 5/5 on build 1.4.2."</p>`,
        `<p>Sáu thói quen: bắt đầu bằng <strong>hợp tác, không phải chiến tranh</strong> — nhắc mọi người mục tiêu chung là chất lượng tốt hơn; <strong>nhấn mạnh lợi ích</strong> (tác giả nâng tay nghề, tổ chức tiết kiệm tiền và giảm rủi ro); trao đổi phát hiện một cách <strong>trung lập, dựa trên sự kiện</strong>, không chỉ trích con người; viết defect report <strong>khách quan, đúng sự thật</strong>; cố <strong>hiểu cảm xúc của người kia</strong>; <strong>xác nhận</strong> hai bên đã hiểu nhau. So sánh: ✗ "Code đăng nhập của bạn dở tệ, crash suốt" → ✓ "Đăng nhập trả HTTP 500 khi mật khẩu chứa ký tự '#'; đã đính kèm các bước; tái hiện 5/5 lần trên build 1.4.2."</p>`],
      [106, 'A traditional testing approach',
        `<p>Show that the system does what it should and doesn't do what it shouldn't. Goal: show it working; success = the system works; fastest route = <strong>easy test cases</strong>; result = <strong>faults left in</strong>.</p>`,
        `<p>Chứng minh hệ thống làm điều nó phải làm và không làm điều không được làm. Mục tiêu: cho thấy nó chạy; thành công = hệ thống chạy; cách nhanh nhất = <strong>test case dễ</strong>; kết quả = <strong>lỗi còn sót lại</strong>.</p>`],
      [107, 'A better testing approach',
        `<p>Show that the system <em>does what it shouldn't</em> and <em>doesn't do what it should</em>. Goal: find faults; success = the system fails (a test that finds a fault is a successful test); fastest route = <strong>difficult test cases</strong>; result = <strong>fewer faults left in</strong>. This is the tester's mindset of LO-1.5.2: curiosity, professional pessimism, a critical eye.</p>`,
        `<p>Chứng minh hệ thống <em>làm điều không được làm</em> và <em>không làm điều phải làm</em>. Mục tiêu: tìm lỗi; thành công = hệ thống hỏng (test tìm ra lỗi là test thành công); cách nhanh nhất = <strong>test case khó</strong>; kết quả = <strong>ít lỗi sót lại hơn</strong>. Đây là tư duy của tester trong LO-1.5.2: tò mò, "bi quan chuyên nghiệp", con mắt phê phán.</p>`],
      [108, 'The testing paradox',
        `<p>If the purpose of testing is to find faults, and finding faults destroys confidence, is the purpose to destroy confidence? No — the resolution in the box: <strong>the best way to build confidence is to try to destroy it</strong>. Software that survived serious attempts to break it deserves more trust than software nobody tried hard to break.</p>`,
        `<p>Nếu mục đích kiểm thử là tìm lỗi, mà tìm ra lỗi thì phá hỏng niềm tin, vậy mục đích là phá niềm tin sao? Không — lời giải trong khung: <strong>cách tốt nhất để xây niềm tin là cố gắng phá nó</strong>. Phần mềm đã sống sót qua những nỗ lực nghiêm túc để làm nó hỏng đáng tin hơn phần mềm chưa ai cố làm hỏng.</p>`],
      [109, 'Who wants to be a tester?',
        `<p>The honest downsides: a "destructive" process; bringing bad news ("your baby is ugly"); the worst time pressure (testing is squeezed at the end); needing a different mindset ("what if it isn't?", "what could go wrong?"); and the question of how to communicate faults to authors and managers — answered by slide 105.</p>`,
        `<p>Mặt trái thật thà của nghề: công việc "phá hoại"; mang tin xấu ("con của anh xấu lắm"); áp lực thời gian tệ nhất (kiểm thử bị ép ở cuối); cần một lối nghĩ khác ("nếu không phải thế thì sao?", "cái gì có thể hỏng?"); và câu hỏi báo lỗi cho tác giả, quản lý thế nào — đã trả lời ở slide 105.</p>`],
      [110, 'Testers have the right to…',
        `<p>Accurate information about progress and changes · insight from developers about the software · code delivered tested to an agreed standard · be regarded as a professional (no abuse) · find faults · challenge specifications and test plans · have reported faults taken seriously (even non-reproducible ones) · make predictions about future fault levels · improve their own testing process.</p>`,
        `<p>Được thông tin chính xác về tiến độ và thay đổi · được developer chia sẻ hiểu biết về phần mềm · nhận code đã được test tới mức đã thoả thuận · được đối xử như người chuyên nghiệp (không bị xúc phạm) · được tìm lỗi · được chất vấn đặc tả và test plan · được coi trọng các lỗi đã báo (kể cả lỗi khó tái hiện) · được đưa ra dự báo về mức lỗi tương lai · được cải tiến quy trình test của mình.</p>`],
      [111, 'Testers have the responsibility to…',
        `<p>Follow the test plans and scripts as documented · report faults objectively and factually (no abuse) · <strong>check the tests are correct before reporting software faults</strong> (avoid false positives) · remember it is the software, not the programmer, that is being tested · assess risk objectively · prioritise what is reported · communicate the truth.</p>`,
        `<p>Làm theo test plan và kịch bản đã ghi · báo lỗi khách quan, đúng sự thật (không xúc phạm) · <strong>kiểm tra test của mình đúng trước khi báo lỗi phần mềm</strong> (tránh false positive) · nhớ rằng thứ đang được test là phần mềm, không phải lập trình viên · đánh giá rủi ro khách quan · ưu tiên những gì cần báo · nói sự thật.</p>`],
      [112, 'CONTENT — Code of Ethics', `<p>Last block of the chapter.</p>`, `<p>Khối cuối của chương.</p>`],
      [113, 'Code of Ethics (1/2)',
        `<p><strong>Public</strong> — act consistently with the public interest. <strong>Client &amp; employer</strong> — act in their best interests, consistent with the public interest. <strong>Product</strong> — ensure your deliverables meet the highest professional standards possible. <strong>Judgment</strong> — maintain integrity and independence in professional judgment.</p>`,
        `<p><strong>Public (công chúng)</strong> — hành động phù hợp lợi ích công chúng. <strong>Client &amp; employer (khách hàng &amp; chủ lao động)</strong> — hành động vì lợi ích tốt nhất của họ, nhưng không trái lợi ích công chúng. <strong>Product (sản phẩm)</strong> — bảo đảm sản phẩm bàn giao đạt chuẩn nghề nghiệp cao nhất có thể. <strong>Judgment (phán đoán)</strong> — giữ chính trực và độc lập trong phán đoán chuyên môn.</p>`],
      [114, 'Code of Ethics (2/2)',
        `<p><strong>Management</strong> — test managers and leaders promote an ethical approach to managing testing. <strong>Profession</strong> — advance the integrity and reputation of the profession. <strong>Colleagues</strong> — be fair to and supportive of colleagues and cooperate with developers. <strong>Self</strong> — lifelong learning and an ethical approach to practice. Hook for all eight: <em>Public, Client, Product, Judgment, Management, Profession, Colleagues, Self</em> — adapted from the ACM/IEEE Software Engineering Code of Ethics.</p>`,
        `<p><strong>Management (quản lý)</strong> — trưởng nhóm và quản lý test thúc đẩy cách quản lý kiểm thử có đạo đức. <strong>Profession (nghề nghiệp)</strong> — nâng cao sự chính trực và uy tín của nghề. <strong>Colleagues (đồng nghiệp)</strong> — công bằng, hỗ trợ đồng nghiệp và hợp tác với developer. <strong>Self (bản thân)</strong> — học tập suốt đời và hành nghề có đạo đức. Mẹo nhớ tám mục: <em>Công chúng – Khách hàng – Sản phẩm – Phán đoán – Quản lý – Nghề – Đồng nghiệp – Bản thân</em> — chuyển thể từ bộ quy tắc đạo đức kỹ nghệ phần mềm ACM/IEEE.</p>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — which ethics principle?</h3>
<table>
<thead><tr><th>Situation</th><th>Principle at stake</th></tr></thead>
<tbody>
<tr><td>Your manager asks you to mark three failed safety tests as "passed" so the release can go out today.</td><td><strong>Public</strong> and <strong>Judgment</strong> — refuse, and escalate with facts.</td></tr>
<tr><td>A competitor offers you money for the test data of your client's banking app.</td><td><strong>Client &amp; employer</strong> — confidentiality.</td></tr>
<tr><td>You find a developer's bug and post a mocking screenshot in the team chat.</td><td><strong>Colleagues</strong> (and slide 105: neutral, fact-focused).</td></tr>
<tr><td>You skip the regression suite because "nothing important changed" and do not tell anyone.</td><td><strong>Product</strong> — deliverables must meet professional standards, and the decision must be transparent.</td></tr>
<tr><td>You spend weekends studying the CTFL v4 syllabus and share notes with juniors.</td><td><strong>Self</strong> and <strong>Profession</strong>.</td></tr>
</tbody>
</table>
<h3>🔒 Hidden chapter-review slide (pptx slide 118)</h3>
<p>The glossary terms you are expected to recognise after Chapter 1: bug, defect, error, failure, fault, mistake, quality, risk, software, testing, exhaustive testing · code, debugging, requirement, review, test basis, test case, test objective · confirmation testing, exit criteria, incident, regression testing, test condition, test coverage, test data, test execution, test log, test plan, test strategy, test summary report, testware.</p>
<div class="pitfall"><b>Mindset question trap.</b> "Developers and testers should have the same mindset" — false. Developers are focused on building a solution (constructive, confirming it works); testers on finding what can go wrong (curiosity, professional pessimism). The syllabus adds that the two mindsets can be combined in one person — which is why independent testing still adds value.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Blameless post-mortems.</b> Google's Site Reliability Engineering practice writes up every serious incident <em>without naming a culprit</em>: the report asks what in the system and process allowed the mistake, not who made it. It is slide 105 applied at company scale — people report problems early when they do not fear punishment, and root-cause analysis (lesson 1.2) gets honest input. <em>Outside the syllabus because CTFL stops at individual communication habits.</em></div>`,
    `<h3>Ví dụ có lời giải · Nguyên tắc đạo đức nào?</h3>
<table>
<thead><tr><th>Tình huống</th><th>Nguyên tắc liên quan</th></tr></thead>
<tbody>
<tr><td>Quản lý bảo bạn đánh dấu ba test an toàn bị fail thành "pass" để kịp phát hành hôm nay.</td><td><strong>Public</strong> và <strong>Judgment</strong> — từ chối, và báo cáo lên kèm số liệu.</td></tr>
<tr><td>Đối thủ đề nghị trả tiền để lấy dữ liệu test của app ngân hàng mà khách hàng bạn thuê test.</td><td><strong>Client &amp; employer</strong> — bảo mật.</td></tr>
<tr><td>Bạn tìm ra bug của một developer và đăng ảnh chụp kèm lời chế giễu lên nhóm chat.</td><td><strong>Colleagues</strong> (và slide 105: trung lập, dựa trên sự kiện).</td></tr>
<tr><td>Bạn bỏ qua bộ regression vì "chẳng đổi gì quan trọng" mà không báo ai.</td><td><strong>Product</strong> — sản phẩm bàn giao phải đạt chuẩn nghề nghiệp, và quyết định phải minh bạch.</td></tr>
<tr><td>Bạn dành cuối tuần học syllabus CTFL v4 và chia sẻ ghi chép cho đàn em.</td><td><strong>Self</strong> và <strong>Profession</strong>.</td></tr>
</tbody>
</table>
<h3>🔒 Slide ôn tập chương bị ẩn (slide pptx 118)</h3>
<p>Các thuật ngữ trong glossary bạn cần nhận ra sau Chương 1: bug, defect, error, failure, fault, mistake, quality, risk, software, testing, exhaustive testing · code, debugging, requirement, review, test basis, test case, test objective · confirmation testing, exit criteria, incident, regression testing, test condition, test coverage, test data, test execution, test log, test plan, test strategy, test summary report, testware.</p>
<div class="pitfall"><b>Bẫy câu hỏi về tư duy.</b> "Developer và tester nên có cùng một tư duy" — sai. Developer tập trung xây giải pháp (xây dựng, khẳng định nó chạy); tester tập trung tìm cái có thể hỏng (tò mò, bi quan chuyên nghiệp). Syllabus nói thêm hai tư duy có thể cùng tồn tại trong một người — vì vậy kiểm thử độc lập vẫn có giá trị.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Post-mortem không đổ lỗi (blameless).</b> Mô hình Site Reliability Engineering của Google viết báo cáo mỗi sự cố nghiêm trọng <em>mà không nêu tên thủ phạm</em>: báo cáo hỏi điều gì trong hệ thống và quy trình đã cho phép sai sót xảy ra, chứ không hỏi ai làm sai. Đó là slide 105 áp dụng ở quy mô công ty — người ta báo vấn đề sớm khi không sợ bị phạt, và phân tích nguyên nhân gốc (bài 1.2) nhận được dữ liệu trung thực. <em>Ngoài giáo trình vì CTFL chỉ dừng ở thói quen giao tiếp cá nhân.</em></div>`),
    books([
      ['fst4', 'Ch.1 §5 "The psychology of testing" — pp.27–32 (PDF 41–46); Chapter review p.33 (PDF 47); Sample exam questions pp.34–35 (PDF 48–49), answers p.253 (PDF 267)', 'Chương 1 §5 "The psychology of testing" — trang 27–32 (PDF 41–46); Chapter review trang 33 (PDF 47); câu hỏi mẫu trang 34–35 (PDF 48–49), đáp án trang 253 (PDF 267)'],
      ['fst', '§1.5 "The psychology of testing" — pp.26–30 (PDF 29–33); chapter review p.31 (PDF 34)', '§1.5 "The psychology of testing" — trang 26–30 (PDF 29–33); ôn tập chương trang 31 (PDF 34)'],
      ['sp5', '§2.4 "The Effects of Human Psychology on Testing" (PDF 69–72); §2.4.1 How testers and developers think (PDF 72)', '§2.4 "The Effects of Human Psychology on Testing" (PDF 69–72); §2.4.1 Tester và developer nghĩ thế nào (PDF 72)'],
      ['sp4', '§2.3 "The Psychology of Testing" p.31 (PDF 46); §2.5 "Ethical Guidelines" p.35 (PDF 50)', '§2.3 "The Psychology of Testing" trang 31 (PDF 46); §2.5 "Ethical Guidelines" trang 35 (PDF 50)'],
    ]),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz 1 ──────────────────────────────── */
// Every "Question" slide of SWT1 (35) + 11 extra checks on the non-question slides.
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ1 = {
  title: 'Quiz 1 — Fundamentals of testing (all SWT1 slide questions)|||Quiz 1 — Nền tảng kiểm thử (toàn bộ câu hỏi trên slide SWT1)',
  slug: 'swt301-quiz-1',
  type: 'QUIZ',
  description: '46 câu: đủ 35 câu "Question" trên slide SWT1 (đáp án đã giải trong bài 1.1–1.5) + 11 câu kiểm tra phần lý thuyết.',
  quiz: {
    timeLimitSeconds: 2700,
    questions: [
      q('Which of the following is a main goal of software testing? (SWT1 s.8)|||Đâu là mục tiêu chính của kiểm thử phần mềm? (SWT1 s.8)', ['Assess the quality of the software|||Đánh giá chất lượng phần mềm', 'Increase the quality of the software|||Nâng cao chất lượng phần mềm'], 0),
      q('If you find a defect early in the lifecycle, what is impacted? (s.9)|||Tìm ra defect sớm trong vòng đời thì điều gì bị ảnh hưởng? (s.9)', ['Risk of meeting it in operation increases|||Rủi ro gặp nó khi vận hành tăng', 'Risk of meeting it in operation is not impacted|||Rủi ro gặp nó khi vận hành không đổi', 'Risk of meeting it in operation is reduced|||Rủi ro gặp nó khi vận hành giảm'], 2),
      q('What is the main role of the tester? (s.10)|||Vai trò chính của tester là gì? (s.10)', ['Resolve defects|||Sửa defect', 'Develop applications|||Phát triển ứng dụng', 'Find defects|||Tìm defect'], 2),
      q('Software testing is a way to… (s.11)|||Kiểm thử phần mềm là cách để… (s.11)', ['Increase the quality of the software|||Nâng cao chất lượng phần mềm', 'Reduce the risk of software failure in operation|||Giảm rủi ro phần mềm hỏng khi vận hành'], 1),
      q('In the 7-activity test process, test execution is step number… (s.16)|||Trong quy trình 7 hoạt động, test execution là bước thứ… (s.16)', ['4', '5', '6', '7'], 2),
      q('Checking whether the developer commented the code properly is… (s.17)|||Kiểm tra developer có chú thích code đầy đủ không là… (s.17)', ['Dynamic testing|||Kiểm thử động', 'Static testing|||Kiểm thử tĩnh'], 1),
      q('"Building the right product" and "building the product right" are… (s.18)|||"Làm đúng sản phẩm" và "làm sản phẩm đúng cách" lần lượt là… (s.18)', ['Validation and verification|||Validation và verification', 'Verification and validation|||Verification và validation'], 0),
      q('A developer runs his code and finds a defect. This is… (s.19)|||Developer chạy code của mình và thấy defect. Đây là… (s.19)', ['Static testing|||Kiểm thử tĩnh', 'Dynamic testing|||Kiểm thử động', 'System testing|||System testing'], 1),
      q('Which can be one main objective of software testing? (s.21)|||Đâu có thể là một mục tiêu chính của kiểm thử? (s.21)', ['Market the product to customers|||Quảng bá sản phẩm tới khách hàng', 'Give the client good knowledge about the project status|||Cho khách hàng nắm rõ tình trạng dự án', 'Decide colleagues\' bonuses|||Xét thưởng cho đồng nghiệp'], 1),
      q('A tester reviews requirements and finds a contradiction. Which objective is achieved? (s.22)|||Tester review yêu cầu và thấy mâu thuẫn. Đạt được mục tiêu nào? (s.22)', ['Building confidence|||Tạo niềm tin', 'Compliance with laws|||Tuân thủ luật', 'Preventing defects|||Ngăn ngừa defect'], 2),
      q('Component testing happens early. Which objective does it serve? (s.23)|||Component testing diễn ra sớm. Nó phục vụ mục tiêu nào? (s.23)', ['Reduce risk|||Giảm rủi ro', 'Give information to stakeholders|||Cung cấp thông tin cho các bên', 'Compliance with laws|||Tuân thủ luật'], 0),
      q('Which is NOT an objective of software testing? (s.24)|||Đâu KHÔNG phải mục tiêu kiểm thử? (s.24)', ['Requirements fulfilment|||Đáp ứng yêu cầu', 'Building confidence in components|||Tạo niềm tin vào thành phần', 'Preventing defects|||Ngăn ngừa defect', 'Reducing project duration|||Rút ngắn thời gian dự án'], 3),
      q('Designing test cases early verifies the test basis. Which objective? (s.25)|||Thiết kế test sớm giúp verify test basis. Mục tiêu nào? (s.25)', ['Gaining confidence|||Tạo niềm tin', 'Finding defects|||Tìm defect', 'Preventing defects|||Ngăn ngừa defect', 'Providing information for decisions|||Cung cấp thông tin ra quyết định'], 2),
      q('Making sure what you built is what the client wants mostly meets… (s.26)|||Đảm bảo cái mình làm ra đúng cái khách hàng muốn chủ yếu đạt… (s.26)', ['Reducing risks|||Giảm rủi ro', 'Finding defects|||Tìm defect', 'Requirements fulfilment|||Đáp ứng yêu cầu'], 2),
      q('Which is a correct definition of debugging? (s.28)|||Định nghĩa đúng của debugging? (s.28)', ['Checking whether the software performs correctly|||Kiểm tra phần mềm chạy đúng không', 'Checking no unintended consequences after a fix|||Kiểm tra không có hậu quả ngoài ý muốn sau khi sửa', 'Identifying the cause of a defect, repairing the code and checking the fix|||Xác định nguyên nhân defect, sửa code và kiểm bản sửa', 'Checking a reported defect has been corrected|||Kiểm tra defect đã báo đã được sửa'], 2),
      q('In which lifecycle may testers be involved in debugging and component testing? (s.29)|||Trong mô hình nào tester có thể tham gia debugging và component testing? (s.29)', ['Waterfall', 'Agile development|||Phát triển Agile', 'V-model'], 1),
      q('Which is an example of debugging? (s.30)|||Đâu là ví dụ về debugging? (s.30)', ['A tester finds a defect and reports it|||Tester tìm defect và báo cáo', 'A tester retests a fix and finds a regression|||Tester test lại bản sửa và thấy lỗi hồi quy', 'A developer finds and fixes a defect|||Developer tìm và sửa defect', 'A developer performs unit testing|||Developer làm unit test'], 2),
      q('Which BEST describes testing vs debugging? (s.31)|||Câu nào mô tả ĐÚNG NHẤT testing vs debugging? (s.31)', ['Testing pinpoints defects; debugging proposes prevention|||Testing chỉ ra defect; debugging đề xuất phòng ngừa', 'Dynamic testing shows failures caused by defects; debugging finds, analyses and removes their causes|||Kiểm thử động làm lộ failure do defect; debugging tìm, phân tích và gỡ nguyên nhân', 'Testing removes faults; debugging identifies causes|||Testing gỡ lỗi; debugging xác định nguyên nhân', 'Dynamic testing prevents failures; debugging removes failures|||Kiểm thử động ngăn failure; debugging gỡ failure'], 1),
      q('Which statement describes a failure? (s.49)|||Câu nào mô tả một failure? (s.49)', ['The product crashed when the user selected an option|||Sản phẩm crash khi người dùng chọn một tuỳ chọn', 'The wrong version of a source file was built|||Build nhầm phiên bản một file mã nguồn', 'The algorithm used the wrong input variables|||Thuật toán dùng sai biến đầu vào', 'The developer misinterpreted the requirement|||Developer hiểu sai yêu cầu'], 0),
      q('Choose the correct statement about root cause analysis. (s.50)|||Chọn câu đúng về phân tích nguyên nhân gốc. (s.50)', ['It applies to software only|||Chỉ áp dụng cho phần mềm', 'Root causes are the earliest actions but RCA destroys the process|||Nguyên nhân gốc là hành động sớm nhất nhưng RCA phá huỷ quy trình', 'It applies in all lifecycle steps and prevents many future defects|||Áp dụng ở mọi bước vòng đời và ngăn nhiều defect về sau'], 2),
      q('Which statement is correct? (s.51)|||Câu nào đúng? (s.51)', ['An error results in a failure seen as a fault when executed|||Error gây failure, lộ ra như fault khi chạy', 'A failure results in a defect seen as a mistake|||Failure gây defect, lộ ra như mistake', 'A mistake causes a defect that may be seen as a failure during dynamic testing|||Mistake gây defect, có thể lộ thành failure khi kiểm thử động', 'A mistake causes a bug seen as a defect when executed|||Mistake gây bug, lộ ra như defect khi chạy'], 2),
      q('1 legal/contract may require testing; 2 testing mainly improves developers\' work; 3 testing + fixing reduces operational risk; 4 testing proves all failures are found. (s.52)|||1 luật/hợp đồng có thể bắt buộc test; 2 test chủ yếu để cải thiện công việc dev; 3 test + sửa giảm rủi ro vận hành; 4 test chứng minh đã tìm hết failure. (s.52)', ['2 & 3 true|||2 & 3 đúng', '1 & 4 true|||1 & 4 đúng', '1 & 3 true|||1 & 3 đúng', '3 & 4 true|||3 & 4 đúng'], 2),
      q('Which statement correctly describes a testing principle? (s.68)|||Câu nào mô tả đúng một nguyên tắc kiểm thử? (s.68)', ['Automation makes it possible to test everything|||Tự động hoá giúp test được mọi thứ', 'With enough effort exhaustive testing is feasible|||Đủ nỗ lực thì test vét cạn khả thi', 'It is normally impossible to test all input/output combinations|||Thường không thể test mọi tổ hợp vào/ra', 'Testing proves the absence of defects|||Kiểm thử chứng minh không có defect'], 2),
      q('Why avoid the pesticide paradox? (s.69)|||Vì sao phải tránh pesticide paradox? (s.69)', ['Dynamic testing is less reliable|||Kiểm thử động kém tin cậy', 'Pesticides mixed with static testing hide bugs|||Thuốc trừ sâu trộn với static testing làm lọt bug', 'Tests should not be context dependent|||Test không nên phụ thuộc ngữ cảnh', 'Running the same tests again reduces the chance of finding new defects|||Chạy lại cùng test làm giảm khả năng tìm defect mới'], 3),
      q('True statement about exhaustive testing? (s.70)|||Câu đúng về test vét cạn? (s.70)', ['A form of stress testing|||Một dạng stress test', 'Not feasible except for trivial software|||Không khả thi trừ phần mềm tầm thường', 'Commonly done with automation|||Thường làm bằng tự động hoá', 'The developer\'s job in unit testing|||Việc của developer khi unit test'], 1),
      q('Team finds 90–95% of defects, users happy, failures low-impact; which principle explains why some defects are missed? (s.71)|||Nhóm tìm 90–95% defect, người dùng hài lòng, failure ít tác động; nguyên tắc nào giải thích việc vẫn sót defect? (s.71)', ['Pesticide paradox', 'Defect clustering', 'Exhaustive testing is impossible|||Không thể test vét cạn', 'Absence-of-errors fallacy|||Ngộ nhận không có lỗi'], 2),
      q('A programmer works on very complex code. Which principle may affect his work? (s.72)|||Lập trình viên làm với code rất phức tạp. Nguyên tắc nào ảnh hưởng? (s.72)', ['Pesticide paradox', 'Defect clustering', 'Absence-of-errors fallacy|||Ngộ nhận không có lỗi', 'Exhaustive testing is impossible|||Không thể test vét cạn'], 1),
      q('When should test control take place? (s.91)|||Test control diễn ra khi nào? (s.91)', ['During planning|||Trong planning', 'During implementation and execution|||Trong implementation và execution', 'During monitoring|||Trong monitoring', 'During all the activities|||Trong mọi hoạt động'], 3),
      q('Which activity compares planned with actual test progress? (s.92)|||Hoạt động nào so tiến độ kế hoạch với thực tế? (s.92)', ['Test monitoring', 'Test planning', 'Test closure', 'Test control'], 0),
      q('Designing and prioritising test cases occurs in… (s.93)|||Thiết kế và ưu tiên test case diễn ra ở… (s.93)', ['Test planning', 'Test analysis', 'Test design', 'Test completion'], 2),
      q('Designing and prioritising test conditions from the test basis occurs in… (s.94)|||Xác định và ưu tiên test condition từ test basis diễn ra ở… (s.94)', ['Test planning', 'Test analysis', 'Test design', 'Test completion'], 1),
      q('Checking whether all defect reports are closed occurs in… (s.95)|||Kiểm tra mọi defect report đã đóng diễn ra ở… (s.95)', ['Test planning', 'Test analysis', 'Test design', 'Test completion'], 3),
      q('Comparing actual results with expected results occurs in… (s.96)|||So kết quả thực tế với mong đợi diễn ra ở… (s.96)', ['Test monitoring & control', 'Test analysis', 'Test implementation', 'Test execution'], 3),
      q('Developing and prioritising test procedures occurs in… (s.97)|||Xây dựng và ưu tiên test procedure diễn ra ở… (s.97)', ['Test monitoring & control', 'Test analysis', 'Test implementation', 'Test execution'], 2),
      q('Checking test results and logs against coverage criteria occurs in… (s.98)|||Đối chiếu kết quả và log test với tiêu chí bao phủ diễn ra ở… (s.98)', ['Test monitoring & control', 'Test analysis', 'Test implementation', 'Test execution'], 0),
      q('Testing is best described as a…|||Kiểm thử đúng nhất là một hoạt động…', ['Quality assurance activity (process-focused)|||Đảm bảo chất lượng (tập trung quy trình)', 'Quality control activity (product-focused)|||Kiểm soát chất lượng (tập trung sản phẩm)', 'Project-management activity|||Quản lý dự án', 'Debugging activity|||Debugging'], 1),
      q('"A failure is an event; a defect is…"|||"Failure là một sự kiện; defect là…"', ['a human action|||một hành động của con người', 'a state of the software, caused by an error|||một trạng thái của phần mềm, do error gây ra', 'an effect on the customer|||tác động lên khách hàng', 'a test result|||một kết quả test'], 1),
      q('In "incorrect interest payments → complaints", the product owner\'s lack of knowledge is the…|||Trong ví dụ "tính lãi sai → khiếu nại", việc PO thiếu kiến thức là…', ['Failure', 'Defect', 'Root cause|||Nguyên nhân gốc (root cause)', 'Effect'], 2),
      q('Slide 56 computes 480,000 tests at 1 s each = 133 h. Why does it say 17.7 days?|||Slide 56 tính 480.000 test, 1 giây mỗi test = 133 giờ. Vì sao ghi 17,7 ngày?', ['It assumes 24-hour days|||Tính ngày 24 giờ', 'It assumes 7.5-hour working days|||Tính ngày làm việc 7,5 giờ', 'It includes retests|||Đã tính cả test lại', 'It is a typo|||Là lỗi đánh máy'], 1),
      q('"How much testing is enough?" — the best answer is…|||"Test bao nhiêu là đủ?" — câu trả lời đúng nhất là…', ['When all planned tests have run|||Khi đã chạy hết test đã lên kế hoạch', 'When the customer is happy|||Khi khách hàng hài lòng', 'It depends on the risks|||Tuỳ vào rủi ro', 'When we proved the system works|||Khi đã chứng minh hệ thống chạy đúng'], 2),
      q('Which is NOT one of the four Es of a good test case?|||Đâu KHÔNG thuộc bốn chữ E của test case tốt?', ['Effective', 'Exemplary', 'Exhaustive', 'Economic'], 2),
      q('"Build the test environment" belongs to…|||"Dựng môi trường test" thuộc về…', ['Test design', 'Test implementation', 'Test execution', 'Test planning'], 1),
      q('A crash in a rarely used admin report page is best classified as…|||Crash ở một trang báo cáo quản trị hiếm khi dùng nên xếp là…', ['High severity, low priority|||Severity cao, priority thấp', 'Low severity, high priority|||Severity thấp, priority cao', 'Low severity, low priority|||Severity thấp, priority thấp', 'It is not a defect|||Không phải defect'], 0),
      q('Which level of independence is the LOWEST?|||Mức độc lập THẤP nhất là…', ['Tests by a separate test team|||Test do nhóm test riêng', 'Tests by the author of the code|||Test do chính tác giả code', 'Tests by an external agency|||Test do công ty bên ngoài', 'Tests by another developer|||Test do developer khác'], 1),
      q('The best way to build confidence in software is to…|||Cách tốt nhất để xây niềm tin vào phần mềm là…', ['run only easy test cases|||chỉ chạy test dễ', 'try to destroy it with difficult tests|||cố phá nó bằng test khó', 'let the author test it|||để tác giả tự test', 'skip testing when the deadline is close|||bỏ test khi sát deadline'], 1),
      q('"Certified testers shall maintain integrity and independence in their professional judgment" is the principle…|||"Tester phải giữ chính trực và độc lập trong phán đoán chuyên môn" là nguyên tắc…', ['Public', 'Product', 'Judgment', 'Self'], 2),
    ],
  },
};

export default {
  title: 'Chapter 1 — Fundamentals of testing|||Chương 1 — Nền tảng kiểm thử',
  description: 'SWT1 (114 slide) học từng slide: kiểm thử là gì, vì sao cần, 7 nguyên tắc, quy trình 7 hoạt động, tâm lý & đạo đức — kèm đáp án mọi câu hỏi trên slide và trang sách tương ứng.',
  lessons: [L11, L12, L13, L14, L15, QUIZ1],
};
