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
<div class="callout"><strong>Syllabus learning objectives.</strong>
<ul>
<li><strong>LO-1.1.1</strong> — Identify typical objectives of testing (K1)</li>
<li><strong>LO-1.1.2</strong> — Differentiate testing from debugging (K2)</li>
</ul>
<p>Chapter 1 carries <strong>8 of the 40</strong> questions in the ISTQB exam (SWT0 slide 7).</p></div>
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
<div class="callout"><strong>Chuẩn đầu ra theo syllabus.</strong>
<ul>
<li><strong>LO-1.1.1</strong> — Nhận diện các mục tiêu điển hình của kiểm thử (K1)</li>
<li><strong>LO-1.1.2</strong> — Phân biệt testing với debugging (K2)</li>
</ul>
<p>Chương 1 chiếm <strong>8/40</strong> câu trong đề ISTQB (SWT0 slide 7) — và đề FE của trường cũng bám đúng tỉ lệ này.</p></div>
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
        `<p class="y-chinh">🎯 The cover shows the six-box map that the <em>whole</em> course follows.</p>
<p class="nhan">The six boxes = the six chapters of ISTQB CTFL</p>
<ol>
<li><strong>Fundamentals</strong> — highlighted: this is Chapter 1</li>
<li><strong>Testing in the SDLC</strong></li>
<li><strong>Static testing</strong></li>
<li><strong>Test techniques</strong></li>
<li><strong>Test management</strong></li>
<li><strong>Tools</strong></li>
</ol>
<p>CTFL = ISTQB Certified Tester Foundation Level. Every later deck opens with the same map, so you always know where you are.</p>`,
        `<p class="y-chinh">🎯 Slide bìa có sơ đồ 6 ô mà <em>cả môn</em> đi theo.</p>
<p class="nhan">Sáu ô = sáu chương của ISTQB CTFL</p>
<ol>
<li><strong>Nền tảng</strong> — được tô màu: đây là Chương 1</li>
<li><strong>Kiểm thử trong SDLC</strong></li>
<li><strong>Kiểm thử tĩnh</strong></li>
<li><strong>Kỹ thuật thiết kế test</strong></li>
<li><strong>Quản lý test</strong></li>
<li><strong>Công cụ</strong></li>
</ol>
<p>CTFL = ISTQB Certified Tester Foundation Level. Mọi bộ slide sau đều mở đầu bằng sơ đồ này nên bạn luôn biết mình đang ở đâu trong môn.</p>`],
      [2, 'CONTENT',
        `<p class="y-chinh">🎯 The agenda of Chapter 1 — six topics.</p>
<ol>
<li><strong>What is testing?</strong> — lesson 1.1</li>
<li><strong>Why testing is necessary</strong> — lesson 1.2</li>
<li><strong>Testing principles</strong> — lesson 1.3</li>
<li><strong>Fundamental test process</strong> — lesson 1.4</li>
<li><strong>Psychology of testing</strong> — lesson 1.5</li>
<li><strong>Code of Ethics</strong> — folded into lesson 1.5</li>
</ol>`,
        `<p class="y-chinh">🎯 Mục lục Chương 1 — sáu chủ đề.</p>
<ol>
<li><strong>Kiểm thử là gì?</strong> — bài 1.1</li>
<li><strong>Vì sao cần kiểm thử</strong> — bài 1.2</li>
<li><strong>Các nguyên tắc</strong> — bài 1.3</li>
<li><strong>Quy trình test cơ bản</strong> — bài 1.4</li>
<li><strong>Tâm lý kiểm thử</strong> — bài 1.5</li>
<li><strong>Quy tắc đạo đức</strong> — gộp vào bài 1.5</li>
</ol>`],
      [3, 'What is Testing?: Background',
        `<p class="y-chinh">🎯 Almost everyone has met software that "did not work as expected" — and the damage can be serious.</p>
<p class="nhan">What faulty software can cause</p>
<ul>
<li><strong>Loss</strong> — of money, time or business reputation</li>
<li><strong>Injury or death</strong> — the slide asks you for an example</li>
</ul>
<p class="nhan">Three examples from the teacher's speaker notes</p>
<ol>
<li><strong>Car</strong> — a car holds about 50 microcontrollers (brakes, seats, gearbox…), so a brake-software fault can cause a crash.</li>
<li><strong>Navigation app</strong> — tells a distracted driver to turn into a one-way street.</li>
<li><strong>Medication reminder</strong> — an app for an Alzheimer's patient that rings at the wrong time.</li>
</ol>
<div class="callout ok"><strong>Class tip from the notes:</strong> students who bring a <em>real</em> example of software failing earn a bonus point. Have one ready — e.g. the CrowdStrike update of 19 July 2024 that crashed about 8.5 million Windows machines and grounded flights worldwide.</div>`,
        `<p class="y-chinh">🎯 Ai cũng từng gặp phần mềm "không chạy như mong đợi" — và thiệt hại có thể rất nặng.</p>
<p class="nhan">Phần mềm lỗi có thể gây ra</p>
<ul>
<li><strong>Mất mát</strong> — tiền, thời gian, uy tín doanh nghiệp</li>
<li><strong>Thương tích hoặc chết người</strong> — slide hỏi bạn một ví dụ</li>
</ul>
<p class="nhan">Ba ví dụ trong ghi chú của giảng viên</p>
<ol>
<li><strong>Ô tô</strong> — có khoảng 50 vi điều khiển (phanh, ghế, hộp số…) nên lỗi phần mềm phanh có thể gây tai nạn.</li>
<li><strong>Ứng dụng dẫn đường</strong> — bảo tài xế đang mất tập trung rẽ vào đường một chiều.</li>
<li><strong>Nhắc uống thuốc</strong> — ứng dụng cho bệnh nhân Alzheimer đổ chuông sai giờ.</li>
</ol>
<div class="callout ok"><strong>Mẹo lấy điểm từ ghi chú của thầy/cô:</strong> sinh viên kể được một ví dụ <em>thật</em> về phần mềm hỏng sẽ được cộng điểm. Chuẩn bị sẵn một ví dụ — chẳng hạn bản cập nhật CrowdStrike ngày 19/7/2024 làm sập khoảng 8,5 triệu máy Windows, nhiều hãng bay phải dừng chuyến.</div>`],
      [4, 'What is Testing?: Cost of Software Faults',
        `<p class="y-chinh">🎯 A software fault can cost billions — or almost nothing — because software is not linear.</p>
<p class="nhan">Huge sums</p>
<ul>
<li><strong>Ariane 5</strong> (1996) — self-destructed 37 seconds after launch: code reused from Ariane 4 converted a 64-bit floating-point value into a 16-bit integer that overflowed.</li>
<li><strong>Mariner 1</strong> (1962) — destroyed because a single symbol was missing from a hand-transcribed guidance formula.</li>
<li><strong>American Airlines</strong> — lost about $50m through a fare/booking software fault.</li>
</ul>
<p class="ghi-chu">The dollar figures on the slide are the commonly quoted ones — sources estimate differently — but the lesson does not change.</p>
<p class="nhan">Very little or nothing</p>
<ul>
<li>Other faults cost almost nothing — a cosmetic glitch, a minor inconvenience.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> <strong>"software is not linear"</strong> — a tiny input or a one-character change can have an enormous effect.</p>`,
        `<p class="y-chinh">🎯 Một lỗi phần mềm có thể tốn hàng tỉ đô — hoặc gần như không tốn gì — vì phần mềm không tuyến tính.</p>
<p class="nhan">Những khoản khổng lồ</p>
<ul>
<li><strong>Ariane 5</strong> (1996) — tự huỷ 37 giây sau khi phóng: đoạn code tái dùng từ Ariane 4 ép một số thực 64-bit thành số nguyên 16-bit và bị tràn.</li>
<li><strong>Mariner 1</strong> (1962) — bị phá huỷ vì thiếu đúng một ký hiệu trong công thức dẫn đường chép tay.</li>
<li><strong>American Airlines</strong> — mất khoảng 50 triệu USD vì lỗi phần mềm giá vé/đặt chỗ.</li>
</ul>
<p class="ghi-chu">Con số trên slide là con số hay được trích — mỗi nguồn ước tính một khác — nhưng bài học thì không đổi.</p>
<p class="nhan">Rất ít hoặc không gì cả</p>
<ul>
<li>Có lỗi lại gần như vô hại — sai hiển thị nhỏ, chút bất tiện.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <strong>"phần mềm không tuyến tính"</strong> — một đầu vào nhỏ hay sửa một ký tự có thể gây hậu quả cực lớn.</p>`],
      [5, 'What is Testing?: Safety-critical systems',
        `<p class="y-chinh">🎯 In safety-critical systems, software faults can cause death or injury.</p>
<p class="nhan">Cases on the slide</p>
<ul>
<li><strong>Therac-25</strong> (1985–87) — the radiation-therapy machine delivered massive overdoses because of a race condition.</li>
<li><strong>Trains and aircraft</strong> — accidents have involved software (the slide cites Airbus and Korean Air).</li>
<li><strong>Bank letters</strong> — even a bank's automatic overdraft letter has been linked to a suicide.</li>
</ul>
<p class="nhan">Link to Principle 6 — testing is context dependent</p>
<p>Such systems are tested far more rigorously and under standards:</p>
<ul>
<li><strong>DO-178C</strong> — avionics</li>
<li><strong>ISO 26262</strong> — cars</li>
<li><strong>IEC 62304</strong> — medical software</li>
</ul>`,
        `<p class="y-chinh">🎯 Với hệ thống an toàn-sống-còn, lỗi phần mềm có thể gây thương tích hoặc chết người.</p>
<p class="nhan">Các vụ trên slide</p>
<ul>
<li><strong>Therac-25</strong> (1985–87) — máy xạ trị chiếu liều cực lớn vì lỗi tranh chấp (race condition).</li>
<li><strong>Tàu hoả và máy bay</strong> — nhiều tai nạn có phần do phần mềm (slide nêu Airbus và Korean Air).</li>
<li><strong>Thư ngân hàng</strong> — thậm chí thư báo thấu chi tự động từng dẫn tới một vụ tự tử.</li>
</ul>
<p class="nhan">Nối với Nguyên tắc 6 — kiểm thử phụ thuộc ngữ cảnh</p>
<p>Các hệ thống như vậy được test khắt khe hơn nhiều và theo chuẩn:</p>
<ul>
<li><strong>DO-178C</strong> — hàng không</li>
<li><strong>ISO 26262</strong> — ô tô</li>
<li><strong>IEC 62304</strong> — phần mềm y tế</li>
</ul>`],
      [6, 'What is Testing? — no single set of definitions',
        `<p class="y-chinh">🎯 Testing has one agreed vocabulary — and the exam uses its exact words.</p>
<p class="nhan">Where the vocabulary comes from</p>
<ul>
<li><strong>Then</strong> — there was no world-wide agreed vocabulary, so the British standard <strong>BS 7925-1</strong> (a glossary focused on component testing, written by the BCS SIGIST working party) was adopted by ISEB/ISTQB.</li>
<li><strong>Today</strong> — the reference is the <strong>ISTQB Glossary</strong> (glossary.istqb.org) and the ISO/IEC/IEEE 29119 series.</li>
</ul>
<p class="nhan">Why it matters for you</p>
<p>Exam questions use the glossary's exact wording, so learn terms precisely: error ≠ defect ≠ failure, test condition ≠ test case…</p>`,
        `<p class="y-chinh">🎯 Kiểm thử có một bộ thuật ngữ chung — và đề thi dùng đúng từng chữ của nó.</p>
<p class="nhan">Bộ thuật ngữ đến từ đâu</p>
<ul>
<li><strong>Trước đây</strong> — thế giới không có bộ thuật ngữ chung, nên chuẩn Anh <strong>BS 7925-1</strong> (bảng thuật ngữ tập trung vào component testing, do nhóm BCS SIGIST soạn) được ISEB/ISTQB dùng làm gốc.</li>
<li><strong>Ngày nay</strong> — nguồn chuẩn là <strong>ISTQB Glossary</strong> (glossary.istqb.org) và bộ chuẩn ISO/IEC/IEEE 29119.</li>
</ul>
<p class="nhan">Vì sao quan trọng với bạn</p>
<p>Câu hỏi thi dùng đúng chữ trong glossary, nên phải học thuật ngữ thật chính xác: error ≠ defect ≠ failure, test condition ≠ test case…</p>`],
      [7, 'What is Testing? — the ISTQB definition',
        `<p class="y-chinh">🎯 Learn the ISTQB definition word for word — each highlighted phrase is an exam option.</p>
<p class="nhan">The definition, piece by piece</p>
<ul>
<li><strong>A process</strong> — not one activity</li>
<li><strong>All lifecycle activities</strong> — <strong>both static and dynamic</strong></li>
<li><strong>Planning, preparation and evaluation</strong> — of a component or system <em>and related work products</em> (requirements, designs, test cases — not only code)</li>
<li><strong>Satisfy specified requirements</strong> — determine this (= verification)</li>
<li><strong>Fit for purpose</strong> — demonstrate this (= validation)</li>
<li><strong>Detect defects</strong></li>
</ul>
<p class="nhan">Short version at the bottom of the slide</p>
<p>Testing is a way to <strong>assess quality</strong> and <strong>reduce the risk of failure in operation</strong>.</p>`,
        `<p class="y-chinh">🎯 Thuộc từng chữ định nghĩa của ISTQB — mỗi cụm được tô là một phương án trong đề.</p>
<p class="nhan">Định nghĩa, tách từng mảnh</p>
<ul>
<li><strong>Một quá trình</strong> — không phải một hành động</li>
<li><strong>Mọi hoạt động trong vòng đời</strong> — <strong>cả tĩnh lẫn động</strong></li>
<li><strong>Lập kế hoạch, chuẩn bị và đánh giá</strong> — thành phần/hệ thống <em>và các sản phẩm công việc liên quan</em> (yêu cầu, thiết kế, test case — không chỉ code)</li>
<li><strong>Thoả yêu cầu đã đặc tả</strong> — xác định điều này (= verification)</li>
<li><strong>Phù hợp mục đích</strong> — chứng minh điều này (= validation)</li>
<li><strong>Phát hiện defect</strong></li>
</ul>
<p class="nhan">Bản rút gọn ở cuối slide</p>
<p>Kiểm thử là cách để <strong>đánh giá chất lượng</strong> và <strong>giảm rủi ro hỏng hóc khi vận hành</strong>.</p>`],
      [8, 'Question — main goal of software testing',
        `<p class="y-chinh">🎯 Testing <em>measures</em> quality; it does not raise it.</p>
<ul>
<li><strong>a (assess)</strong> — testing measures quality and gives information.</li>
<li><strong>b (increase)</strong> — quality only increases when someone fixes the defects — that is development work, not testing. The classic trap.</li>
</ul>` + AE('a — Assess the quality of the software', ''),
        `<p class="y-chinh">🎯 Kiểm thử <em>đo</em> chất lượng; nó không làm chất lượng tăng.</p>
<ul>
<li><strong>a (đánh giá)</strong> — kiểm thử đo chất lượng và cung cấp thông tin.</li>
<li><strong>b (nâng cao)</strong> — chất lượng chỉ tăng khi có người sửa defect — đó là việc phát triển, không phải kiểm thử. Bẫy kinh điển.</li>
</ul>` + AV('a — Đánh giá chất lượng phần mềm', '')],
      [9, 'Question — finding a defect early',
        `<p class="y-chinh">🎯 A defect found early can no longer surprise you in production.</p>
<ul>
<li><strong>Found and fixed before release</strong> — it can no longer show up as a failure in production.</li>
<li><strong>Cheaper</strong> — fixing early costs far less (slide 45).</li>
</ul>` + AE('c — The risk of finding this defect in operation will be reduced', ''),
        `<p class="y-chinh">🎯 Defect tìm ra sớm thì không còn gây bất ngờ trên production.</p>
<ul>
<li><strong>Tìm và sửa trước khi phát hành</strong> — nó không thể lộ ra thành failure trên production nữa.</li>
<li><strong>Rẻ hơn</strong> — sửa sớm tốn ít hơn nhiều (slide 45).</li>
</ul>` + AV('c — Rủi ro gặp defect này khi vận hành sẽ giảm', '')],
      [10, 'Question — main role of the tester',
        `<p class="y-chinh">🎯 The tester's core role is to find defects and report them.</p>
<ul>
<li><strong>a — resolve defects</strong> — that is debugging, a developer task.</li>
<li><strong>b — develop applications</strong> — a developer task.</li>
<li><strong>c — find defects</strong> — the tester's job.</li>
</ul>` + AE('c — Find defects', ''),
        `<p class="y-chinh">🎯 Vai trò cốt lõi của tester là tìm defect và báo cáo.</p>
<ul>
<li><strong>a — sửa defect</strong> — đó là debugging, việc của developer.</li>
<li><strong>b — phát triển ứng dụng</strong> — việc của developer.</li>
<li><strong>c — tìm defect</strong> — việc của tester.</li>
</ul>` + AV('c — Tìm defect', '')],
      [11, 'Question — "Software testing is a way to…"',
        `<p class="y-chinh">🎯 Same logic as slide 8: testing reduces risk; fixing raises quality.</p>
<ul>
<li><strong>a (increase quality)</strong> — testing by itself does not raise quality.</li>
<li><strong>b (reduce risk)</strong> — testing reveals defects so they can be fixed before users meet them.</li>
</ul>` + AE('b — Reduce the risk of software failure in operation', ''),
        `<p class="y-chinh">🎯 Cùng logic với slide 8: kiểm thử giảm rủi ro; sửa lỗi mới nâng chất lượng.</p>
<ul>
<li><strong>a (nâng chất lượng)</strong> — bản thân kiểm thử không làm chất lượng tăng.</li>
<li><strong>b (giảm rủi ro)</strong> — kiểm thử làm lộ defect để được sửa trước khi người dùng gặp.</li>
</ul>` + AV('b — Giảm rủi ro phần mềm hỏng khi vận hành', '')],
      [12, 'Misperceptions: testing ≠ test execution',
        `<p class="y-chinh">🎯 Misconception 1: "testing = running tests". Execution is only <strong>one</strong> of seven activities.</p>
<p class="nhan">The seven activities of the test process (lesson 1.4)</p>
<ol>
<li>Planning</li>
<li>Monitoring &amp; control</li>
<li>Analysis</li>
<li>Design</li>
<li>Implementation</li>
<li><strong>Execution</strong></li>
<li>Completion</li>
</ol>
<p>Most of a tester's thinking happens before anything runs.</p>`,
        `<p class="y-chinh">🎯 Hiểu lầm 1: "kiểm thử = chạy test". Thực thi chỉ là <strong>một</strong> trong bảy hoạt động.</p>
<p class="nhan">Bảy hoạt động của quy trình test (bài 1.4)</p>
<ol>
<li>Lập kế hoạch</li>
<li>Giám sát &amp; kiểm soát</li>
<li>Phân tích</li>
<li>Thiết kế</li>
<li>Triển khai</li>
<li><strong>Thực thi</strong></li>
<li>Hoàn tất</li>
</ol>
<p>Phần lớn công sức tư duy của tester diễn ra trước khi có gì được chạy.</p>`],
      [13, 'Misperceptions: static and dynamic testing',
        `<p class="y-chinh">🎯 Software testing has two branches — static and dynamic — and both are testing.</p>
<ul>
<li><strong>Static testing</strong> — examining requirements, designs, code or test cases <em>without executing</em> them (reviews; static analysis by tools). Chapter 3 is all about it.</li>
<li><strong>Dynamic testing</strong> — executing the software with inputs and comparing results.</li>
</ul>`,
        `<p class="y-chinh">🎯 Kiểm thử phần mềm có hai nhánh — tĩnh và động — và cả hai đều là kiểm thử.</p>
<ul>
<li><strong>Kiểm thử tĩnh (static)</strong> — xem xét yêu cầu, thiết kế, code hoặc test case <em>mà không chạy</em> (review; phân tích tĩnh bằng công cụ). Chương 3 dành trọn cho nó.</li>
<li><strong>Kiểm thử động (dynamic)</strong> — chạy phần mềm với đầu vào và so sánh kết quả.</li>
</ul>`],
      [14, 'Misperceptions: verification and validation',
        `<p class="y-chinh">🎯 Testing also covers <strong>verification</strong> and <strong>validation</strong> — two different questions asked of the same product.</p>
<p>The next slide makes the difference concrete.</p>`,
        `<p class="y-chinh">🎯 Kiểm thử cũng bao gồm <strong>verification</strong> và <strong>validation</strong> — hai câu hỏi khác nhau đặt cho cùng một sản phẩm.</p>
<p>Slide kế tiếp làm rõ sự khác nhau bằng ví dụ.</p>`],
      [15, 'Verification vs validation — the shirt',
        `<p class="y-chinh">🎯 You ordered a shirt: verification checks it against the order, validation against your real need.</p>
<p class="nhan">Verification — against the order (the specification)</p>
<ul>
<li>Two sleeves?</li>
<li>Size L?</li>
<li>Blue?</li>
<li>No missing buttons?</li>
</ul>
<p>Objective, yes/no checks.</p>
<p class="nhan">Validation — against your real need</p>
<ul>
<li>Does it fit?</li>
<li>Will my crush like it?</li>
<li>Can I afford it?</li>
<li>Is it comfortable to wear?</li>
<li>Does the colour match my eyes?</li>
</ul>
<p>A shirt can pass every verification check and still fail validation.</p>
<p class="meo">🧠 <strong>Remember:</strong> <em>Verification = built the product right; Validation = built the right product.</em></p>`,
        `<p class="y-chinh">🎯 Bạn đặt mua một chiếc áo: verification so nó với đơn hàng, validation so với nhu cầu thật.</p>
<p class="nhan">Verification — so với đơn hàng (đặc tả)</p>
<ul>
<li>Hai tay áo?</li>
<li>Size L?</li>
<li>Màu xanh?</li>
<li>Có thiếu cúc không?</li>
</ul>
<p>Các câu hỏi khách quan, trả lời có/không.</p>
<p class="nhan">Validation — so với nhu cầu thật</p>
<ul>
<li>Mặc có vừa không?</li>
<li>Crush có thích không?</li>
<li>Có đủ tiền không?</li>
<li>Mặc có thoải mái không?</li>
<li>Màu có hợp mắt không?</li>
</ul>
<p>Một chiếc áo có thể qua hết verification mà vẫn trượt validation.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>Verification = làm sản phẩm đúng cách; Validation = làm đúng sản phẩm.</em></p>`],
      [16, 'Question — position of test execution in the process',
        `<p class="y-chinh">🎯 Test execution is step 6 of the 7 activity groups.</p>
<p class="nhan">The seven activity groups in order</p>
<ol>
<li>Planning</li>
<li>Monitoring &amp; control</li>
<li>Analysis</li>
<li>Design</li>
<li>Implementation</li>
<li><strong>Execution</strong></li>
<li>Completion</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> <em>Plan, Monitor, Analyse, Design, Implement, Execute, Complete</em>.</p>` + AE('c — 6', ''),
        `<p class="y-chinh">🎯 Test execution là bước 6 trong 7 nhóm hoạt động.</p>
<p class="nhan">Bảy nhóm hoạt động theo thứ tự</p>
<ol>
<li>Lập kế hoạch</li>
<li>Giám sát &amp; kiểm soát</li>
<li>Phân tích</li>
<li>Thiết kế</li>
<li>Triển khai</li>
<li><strong>Thực thi</strong></li>
<li>Hoàn tất</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> <em>Kế – Giám – Phân – Thiết – Triển – Chạy – Đóng</em>.</p>` + AV('c — 6', '')],
      [17, 'Question — checking code comments',
        `<p class="y-chinh">🎯 Reading code without running it is static testing.</p>
<ul>
<li><strong>What you do</strong> — read the source code to judge its comments; nothing is executed.</li>
<li><strong>General rule</strong> — any review of code or documents without running it is static testing.</li>
</ul>` + AE('b — Static testing', ''),
        `<p class="y-chinh">🎯 Đọc code mà không chạy là kiểm thử tĩnh.</p>
<ul>
<li><strong>Việc bạn làm</strong> — đọc mã nguồn để đánh giá phần chú thích; không chạy gì cả.</li>
<li><strong>Quy tắc chung</strong> — mọi việc xem xét code/tài liệu mà không chạy đều là kiểm thử tĩnh.</li>
</ul>` + AV('b — Kiểm thử tĩnh', '')],
      [18, 'Question — right product vs product right',
        `<p class="y-chinh">🎯 Right product = validation; product right = verification.</p>
<ul>
<li><strong>Building the right product</strong> — validation (matches the need).</li>
<li><strong>Building the product right</strong> — verification (matches the spec).</li>
</ul>
<p>Exactly the shirt example of slide 15.</p>` + AE('a — Building the right product is validation and building the product right is verification', ''),
        `<p class="y-chinh">🎯 Đúng sản phẩm = validation; sản phẩm đúng cách = verification.</p>
<ul>
<li><strong>Làm đúng sản phẩm</strong> — validation (khớp nhu cầu).</li>
<li><strong>Làm sản phẩm đúng cách</strong> — verification (khớp đặc tả).</li>
</ul>
<p>Đúng như ví dụ chiếc áo ở slide 15.</p>` + AV('a — Làm đúng sản phẩm là validation, làm sản phẩm đúng cách là verification', '')],
      [19, 'Question — developer runs code and finds a defect',
        `<p class="y-chinh">🎯 Running the code is dynamic testing, whoever does it.</p>
<ul>
<li><strong>a — static testing</strong> — wrong: the code is executed.</li>
<li><strong>c — system testing</strong> — wrong: that is a test <em>level</em> on the complete system.</li>
<li><strong>Not debugging yet</strong> — debugging starts <em>after</em> a failure has been seen.</li>
</ul>` + AE('b — Dynamic testing', ''),
        `<p class="y-chinh">🎯 Chạy code là kiểm thử động, bất kể ai chạy.</p>
<ul>
<li><strong>a — kiểm thử tĩnh</strong> — sai: code đã được chạy.</li>
<li><strong>c — system testing</strong> — sai: đó là một <em>cấp</em> test trên cả hệ thống.</li>
<li><strong>Cũng chưa phải debugging</strong> — debugging bắt đầu <em>sau khi</em> đã thấy failure.</li>
</ul>` + AV('b — Kiểm thử động', '')],
      [20, 'Objectives of Testing',
        `<p class="y-chinh">🎯 The nine boxes are the typical objectives of testing — and the ninth says they vary.</p>
<p class="nhan">The nine boxes</p>
<ol>
<li><strong>Work product evaluation</strong> — requirements, user stories, design, code</li>
<li><strong>Requirement fulfilment</strong> — verify all specified requirements are met</li>
<li><strong>Building confidence</strong> — in the quality level</li>
<li><strong>Finding defects</strong> — and failures</li>
<li><strong>Preventing defects</strong></li>
<li><strong>Providing information to stakeholders</strong> — for decisions</li>
<li><strong>Reducing risks</strong> — of inadequate quality</li>
<li><strong>Compliance with law</strong> — and contracts, standards</li>
<li><strong>Objectives may vary</strong> — with the context, the test level and the lifecycle</li>
</ol>
<p class="nhan">Example of box 9</p>
<ul>
<li><strong>Component testing</strong> — mostly aims to find defects early.</li>
<li><strong>Acceptance testing</strong> — aims to confirm the system works and give information for the go-live decision.</li>
</ul>`,
        `<p class="y-chinh">🎯 Chín ô là các mục tiêu điển hình của kiểm thử — và ô thứ chín nói chúng thay đổi được.</p>
<p class="nhan">Chín ô</p>
<ol>
<li><strong>Đánh giá sản phẩm công việc</strong> — yêu cầu, user story, thiết kế, code</li>
<li><strong>Đáp ứng yêu cầu</strong> — kiểm mọi yêu cầu đã đặc tả được thực hiện</li>
<li><strong>Tạo niềm tin</strong> — vào mức chất lượng</li>
<li><strong>Tìm defect</strong> — và failure</li>
<li><strong>Ngăn ngừa defect</strong></li>
<li><strong>Cung cấp thông tin cho các bên liên quan</strong> — để ra quyết định</li>
<li><strong>Giảm rủi ro</strong> — chất lượng kém</li>
<li><strong>Tuân thủ luật</strong> — và hợp đồng, tiêu chuẩn</li>
<li><strong>Mục tiêu có thể thay đổi</strong> — theo ngữ cảnh, cấp test và mô hình vòng đời</li>
</ol>
<p class="nhan">Ví dụ cho ô 9</p>
<ul>
<li><strong>Component testing</strong> — chủ yếu nhằm tìm defect sớm.</li>
<li><strong>Acceptance testing</strong> — nhằm khẳng định hệ thống chạy đúng và cung cấp thông tin cho quyết định go-live.</li>
</ul>`],
      [21, 'Question — one main objective of testing',
        `<p class="y-chinh">🎯 Keeping the client informed is the objective "providing information to stakeholders".</p>
<ul>
<li><strong>A — marketing</strong> — not a testing objective.</li>
<li><strong>B — project status for the client</strong> — = providing information to stakeholders (slide 20, box 6).</li>
<li><strong>C — deciding colleagues' bonuses</strong> — not a testing objective.</li>
</ul>` + AE('B — Give the client good knowledge about the status of the project', ''),
        `<p class="y-chinh">🎯 Cho khách hàng nắm tình hình là mục tiêu "cung cấp thông tin cho các bên liên quan".</p>
<ul>
<li><strong>A — marketing</strong> — không phải mục tiêu kiểm thử.</li>
<li><strong>B — tình trạng dự án cho khách hàng</strong> — = cung cấp thông tin cho các bên (slide 20, ô 6).</li>
<li><strong>C — xét thưởng đồng nghiệp</strong> — không phải mục tiêu kiểm thử.</li>
</ul>` + AV('B — Cho khách hàng nắm rõ tình trạng dự án', '')],
      [22, 'Question — reviewing requirements finds a contradiction',
        `<p class="y-chinh">🎯 Removing a contradiction before coding prevents a defect.</p>
<ul>
<li><strong>When</strong> — the contradiction is removed before anyone writes code.</li>
<li><strong>Effect</strong> — the code defect it would have caused never exists.</li>
</ul>` + AE('C — Preventing defects', ''),
        `<p class="y-chinh">🎯 Gỡ mâu thuẫn trước khi code là ngăn ngừa defect.</p>
<ul>
<li><strong>Khi nào</strong> — mâu thuẫn được gỡ trước khi ai đó viết code.</li>
<li><strong>Kết quả</strong> — defect trong code mà nó lẽ ra gây ra không bao giờ xuất hiện.</li>
</ul>` + AV('C — Ngăn ngừa defect', '')],
      [23, 'Question — objective of component testing',
        `<p class="y-chinh">🎯 Early component testing mainly reduces risk.</p>
<ul>
<li><strong>A — reduce risk</strong> — finding defects early in components reduces the risk that they escape to integration, system or operation.</li>
<li><strong>B — information for stakeholders</strong> — fits acceptance testing better.</li>
<li><strong>C — compliance with laws</strong> — typically an acceptance/regulatory objective.</li>
</ul>` + AE('A — Reduce risk', ''),
        `<p class="y-chinh">🎯 Component testing làm sớm chủ yếu nhằm giảm rủi ro.</p>
<ul>
<li><strong>A — giảm rủi ro</strong> — tìm defect sớm ở từng thành phần làm giảm rủi ro chúng lọt lên integration, system hay vận hành.</li>
<li><strong>B — thông tin cho các bên</strong> — hợp với acceptance testing hơn.</li>
<li><strong>C — tuân thủ luật</strong> — thường là mục tiêu của acceptance/kiểm định.</li>
</ul>` + AV('A — Giảm rủi ro', '')],
      [24, 'Question — NOT an objective of testing',
        `<p class="y-chinh">🎯 Shortening the project is not a testing objective.</p>
<ul>
<li><strong>A, B, C</strong> — all on slide 20.</li>
<li><strong>D</strong> — testing may save time indirectly, but shortening the project is not one of its objectives.</li>
</ul>` + AE('D — Reducing project duration', ''),
        `<p class="y-chinh">🎯 Rút ngắn dự án không phải mục tiêu kiểm thử.</p>
<ul>
<li><strong>A, B, C</strong> — đều có trên slide 20.</li>
<li><strong>D</strong> — kiểm thử có thể gián tiếp tiết kiệm thời gian, nhưng rút ngắn dự án không phải mục tiêu của nó.</li>
</ul>` + AV('D — Rút ngắn thời gian dự án', '')],
      [25, 'Question — designing tests early verifies the test basis',
        `<p class="y-chinh">🎯 Designing tests early catches requirement problems before coding — that prevents defects.</p>
<ul>
<li><strong>Why</strong> — designing test cases forces you to read the requirements precisely.</li>
<li><strong>Result</strong> — ambiguities and gaps are found and fixed before coding.</li>
</ul>
<p class="ghi-chu">This is an official ISTQB sample-exam question.</p>` + AE('C — Preventing defects', ''),
        `<p class="y-chinh">🎯 Thiết kế test sớm bắt được lỗi yêu cầu trước khi code — đó là ngăn ngừa defect.</p>
<ul>
<li><strong>Vì sao</strong> — thiết kế test case buộc bạn đọc yêu cầu thật kỹ.</li>
<li><strong>Kết quả</strong> — chỗ mơ hồ, thiếu sót được phát hiện và sửa trước khi code.</li>
</ul>
<p class="ghi-chu">Đây là câu trong đề mẫu chính thức của ISTQB.</p>` + AV('C — Ngăn ngừa defect', '')],
      [26, 'Question — what we built = what the client wants',
        `<p class="y-chinh">🎯 Checking the product against what the client asked for is requirement fulfilment.</p>
<ul>
<li><strong>A — reducing risks</strong>, <strong>B — finding defects</strong> — real objectives, but not what this activity mainly achieves.</li>
<li><strong>C — requirements fulfilment</strong> — slide 20, box 2.</li>
</ul>` + AE('C — Requirements fulfilment', ''),
        `<p class="y-chinh">🎯 Đối chiếu sản phẩm với cái khách hàng yêu cầu là mục tiêu đáp ứng yêu cầu.</p>
<ul>
<li><strong>A — giảm rủi ro</strong>, <strong>B — tìm defect</strong> — đều là mục tiêu thật, nhưng không phải cái hoạt động này chủ yếu đạt được.</li>
<li><strong>C — đáp ứng yêu cầu</strong> — slide 20, ô 2.</li>
</ul>` + AV('C — Đáp ứng yêu cầu', '')],
      [27, 'Testing & Debugging',
        `<p class="y-chinh">🎯 Testing, debugging and confirmation testing are three different activities, usually by different people.</p>
<p class="nhan">The three activities, in order</p>
<ol>
<li><strong>Testing</strong> (tester's job) — shows failures caused by defects.</li>
<li><strong>Debugging</strong> (dev's job) — the process of <em>finding, analysing and removing</em> the causes of failures.</li>
<li><strong>Confirmation testing</strong> (tester's job) — checking that the fix really resolves the failure. Then regression testing checks nothing else broke.</li>
</ol>
<p class="nhan">Note on the slide</p>
<p>In Agile and some other lifecycles, testers may also help with debugging and component testing — roles blur, activities stay distinct.</p>`,
        `<p class="y-chinh">🎯 Testing, debugging và confirmation testing là ba hoạt động khác nhau, thường do người khác nhau làm.</p>
<p class="nhan">Ba hoạt động, theo thứ tự</p>
<ol>
<li><strong>Testing</strong> (việc của tester) — làm lộ failure do defect gây ra.</li>
<li><strong>Debugging</strong> (việc của dev) — quá trình <em>tìm, phân tích và gỡ bỏ</em> nguyên nhân của failure.</li>
<li><strong>Confirmation testing</strong> (việc của tester) — kiểm tra bản sửa thực sự giải quyết failure. Sau đó regression testing kiểm không có gì khác bị hỏng.</li>
</ol>
<p class="nhan">Ghi chú trên slide</p>
<p>Trong Agile và một số mô hình khác, tester có thể tham gia cả debugging và component testing — vai trò có thể chồng nhau, nhưng hoạt động vẫn tách bạch.</p>`],
      [28, 'Question — definition of debugging',
        `<p class="y-chinh">🎯 Debugging = find the cause, repair the code, check the fix.</p>
<ul>
<li><strong>a</strong> — testing.</li>
<li><strong>b</strong> — regression testing.</li>
<li><strong>c</strong> — the only one that describes finding and removing the cause.</li>
<li><strong>d</strong> — confirmation testing.</li>
</ul>` + AE('c — Identifying the cause of a defect, repairing the code and checking if the fix is correct', ''),
        `<p class="y-chinh">🎯 Debugging = tìm nguyên nhân, sửa code, kiểm bản sửa.</p>
<ul>
<li><strong>a</strong> — testing.</li>
<li><strong>b</strong> — regression testing.</li>
<li><strong>c</strong> — phương án duy nhất mô tả việc tìm và gỡ nguyên nhân.</li>
<li><strong>d</strong> — confirmation testing.</li>
</ul>` + AV('c — Xác định nguyên nhân defect, sửa code và kiểm bản sửa đúng', '')],
      [29, 'Question — lifecycle where testers help debugging',
        `<p class="y-chinh">🎯 In Agile the whole team works together, so testers may join debugging.</p>
<ul>
<li><strong>Source</strong> — exactly the note on slide 27.</li>
<li><strong>Why Agile</strong> — whole-team work means testers may take part in debugging and component testing.</li>
</ul>` + AE('b — Agile development', ''),
        `<p class="y-chinh">🎯 Trong Agile cả nhóm cùng làm, nên tester có thể tham gia debugging.</p>
<ul>
<li><strong>Nguồn</strong> — đúng như ghi chú ở slide 27.</li>
<li><strong>Vì sao là Agile</strong> — cả nhóm cùng làm nên tester có thể tham gia debugging và component testing.</li>
</ul>` + AV('b — Phát triển Agile', '')],
      [30, 'Question — an example of debugging',
        `<p class="y-chinh">🎯 Debugging is a developer finding <em>and</em> fixing a defect.</p>
<ul>
<li><strong>a</strong> — testing + reporting.</li>
<li><strong>b</strong> — confirmation/regression testing.</li>
<li><strong>c</strong> — debugging.</li>
<li><strong>d</strong> — component testing: a testing activity, even when a developer does it.</li>
</ul>` + AE('c — A developer finds and fixes a defect', ''),
        `<p class="y-chinh">🎯 Debugging là developer tìm <em>và</em> sửa một defect.</p>
<ul>
<li><strong>a</strong> — testing + báo lỗi.</li>
<li><strong>b</strong> — confirmation/regression testing.</li>
<li><strong>c</strong> — debugging.</li>
<li><strong>d</strong> — component testing: vẫn là hoạt động kiểm thử dù developer làm.</li>
</ul>` + AV('c — Developer tìm và sửa một defect', '')],
      [31, 'Question — best description of testing vs debugging',
        `<p class="y-chinh">🎯 Dynamic testing shows failures; debugging finds, analyses and removes their causes.</p>
<ul>
<li><strong>a</strong> — wrong: debugging does not "propose prevention" — that is root-cause analysis.</li>
<li><strong>b</strong> — correct, word for word.</li>
<li><strong>c</strong> — wrong: testing does not remove faults.</li>
<li><strong>d</strong> — wrong: testing does not prevent failures; debugging removes causes, not failures.</li>
</ul>` + AE('b — Dynamic testing shows failures caused by defects; debugging finds, analyses and removes the causes of failures', ''),
        `<p class="y-chinh">🎯 Kiểm thử động làm lộ failure; debugging tìm, phân tích và gỡ nguyên nhân của chúng.</p>
<ul>
<li><strong>a</strong> — sai: debugging không "đề xuất phòng ngừa" — đó là phân tích nguyên nhân gốc.</li>
<li><strong>b</strong> — đúng từng chữ.</li>
<li><strong>c</strong> — sai: testing không gỡ lỗi.</li>
<li><strong>d</strong> — sai: testing không ngăn failure; debugging gỡ nguyên nhân, không gỡ "failure".</li>
</ul>` + AV('b — Kiểm thử động làm lộ failure do defect; debugging tìm, phân tích và gỡ nguyên nhân', '')],
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
<div class="pitfall co-tieu-de"><strong>Trap seen in FE papers:</strong> "The main purpose of testing is to improve quality / to prove the software has no defects." Both are <em>false</em>. Testing assesses quality and reduces risk; fixing improves quality; no amount of testing proves absence of defects (Principle 1, lesson 1.3).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>The test oracle problem.</strong>
<p>Every test needs an <em>oracle</em> — a source of truth for the expected result. For "2 + 2 = 4" the oracle is trivial, but what is the expected output of a weather model, a search-ranking algorithm or a machine-learning classifier? This <strong>oracle problem</strong> is one of the deepest open issues in testing.</p>
<p><strong>Practical workarounds</strong></p>
<ul>
<li><strong>Metamorphic testing</strong> — relations that must hold: adding an irrelevant document must not change the top search result.</li>
<li><strong>Differential testing</strong> — compare two independent implementations.</li>
<li><strong>Property-based testing</strong></li>
</ul>
<p class="ghi-chu">Outside the syllabus because CTFL assumes the expected result is always known from the test basis.</p></div>`,
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
<div class="pitfall co-tieu-de"><strong>Bẫy hay gặp trong đề FE:</strong> "Mục đích chính của kiểm thử là nâng cao chất lượng / chứng minh phần mềm không có defect." Cả hai đều <em>SAI</em>. Kiểm thử đánh giá chất lượng và giảm rủi ro; sửa lỗi mới nâng chất lượng; không lượng kiểm thử nào chứng minh được "không có defect" (Nguyên tắc 1, bài 1.3).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Bài toán oracle.</strong>
<p>Mỗi test cần một <em>oracle</em> — nguồn chân lý cho kết quả mong đợi. Với "2 + 2 = 4" oracle quá dễ, nhưng output đúng của một mô hình dự báo thời tiết, thuật toán xếp hạng tìm kiếm hay bộ phân loại học máy là gì? <strong>Oracle problem</strong> là một trong những vấn đề mở sâu nhất của kiểm thử.</p>
<p><strong>Cách xử lý thực tế</strong></p>
<ul>
<li><strong>Metamorphic testing</strong> — quan hệ phải luôn đúng: thêm một tài liệu không liên quan thì kết quả tìm kiếm đứng đầu không được đổi.</li>
<li><strong>Differential testing</strong> — so hai bản cài đặt độc lập.</li>
<li><strong>Property-based testing</strong></li>
</ul>
<p class="ghi-chu">Ngoài giáo trình vì CTFL mặc định kết quả mong đợi luôn biết được từ test basis.</p></div>`),
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
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-1.2.1</strong> — Give examples of why testing is necessary (K2)</li>
<li><strong>LO-1.2.2</strong> — Describe the relationship between testing and quality assurance (K2)</li>
<li><strong>LO-1.2.3</strong> — Distinguish between error, defect and failure (K2)</li>
<li><strong>LO-1.2.4</strong> — Distinguish between the root cause of a defect and its effects (K2)</li>
</ul></div>
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
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-1.2.1</strong> — Nêu ví dụ vì sao cần kiểm thử (K2)</li>
<li><strong>LO-1.2.2</strong> — Mô tả quan hệ giữa kiểm thử và đảm bảo chất lượng (K2)</li>
<li><strong>LO-1.2.3</strong> — Phân biệt error, defect, failure (K2)</li>
<li><strong>LO-1.2.4</strong> — Phân biệt nguyên nhân gốc của defect với hậu quả của nó (K2)</li>
</ul></div>
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
        `<p class="y-chinh">🎯 Second block of the chapter: why bother testing at all?</p>
<ul>
<li><strong>Keep slide 7 in mind</strong> — testing assesses quality and reduces risk.</li>
<li><strong>Four angles</strong> — the next slides answer "why bother?" through risk, quality, contracts/law, and cost.</li>
</ul>`,
        `<p class="y-chinh">🎯 Khối thứ hai của chương: kiểm thử để làm gì?</p>
<ul>
<li><strong>Nhớ lại slide 7</strong> — kiểm thử đánh giá chất lượng và giảm rủi ro.</li>
<li><strong>Bốn góc nhìn</strong> — các slide tiếp theo trả lời "làm vậy để làm gì?" qua rủi ro, chất lượng, hợp đồng/pháp luật, và chi phí.</li>
</ul>`],
      [33, 'Why is Testing Necessary?',
        `<p class="y-chinh">🎯 Four reasons why testing is necessary — each one is worth an exam option.</p>
<ol>
<li><strong>Less risk</strong> — rigorous testing reduces the risk of failures in operation.</li>
<li><strong>More quality — when defects are fixed</strong> — note the wording: fixing, not testing, raises quality.</li>
<li><strong>Verify and validate</strong> — testing verifies the system is correctly built and validates it meets users' and stakeholders' needs.</li>
<li><strong>Required</strong> — by contracts, laws or industry standards: avionics DO-178C, automotive ISO 26262, medical IEC 62304, card payments PCI DSS.</li>
</ol>`,
        `<p class="y-chinh">🎯 Bốn lý do cần kiểm thử — mỗi lý do đáng giá một phương án trong đề.</p>
<ol>
<li><strong>Giảm rủi ro</strong> — kiểm thử kỹ lưỡng giảm rủi ro hỏng hóc khi vận hành.</li>
<li><strong>Chất lượng tăng — khi defect được sửa</strong> — để ý chữ: sửa, không phải test, mới nâng chất lượng.</li>
<li><strong>Verify và validate</strong> — kiểm thử verify hệ thống được xây đúng và validate nó đáp ứng nhu cầu người dùng, các bên liên quan.</li>
<li><strong>Bắt buộc</strong> — theo hợp đồng, luật hoặc chuẩn ngành: hàng không DO-178C, ô tô ISO 26262, y tế IEC 62304, thanh toán thẻ PCI DSS.</li>
</ol>`],
      [34, "Testing's Contributions to Success (1) — requirements",
        `<p class="y-chinh">🎯 Testers in requirements reviews catch defects before a line of code exists.</p>
<ul>
<li><strong>Where</strong> — requirements reviews or user-story refinement.</li>
<li><strong>What they find</strong> — defects in those work products.</li>
<li><strong>Benefit</strong> — less risk of building incorrect or <em>untestable</em> software.</li>
</ul>
<p class="nhan">Example</p>
<p>"The search must be fast" is untestable. A tester asks, and it becomes "95% of searches return within 2 s with 500 concurrent users".</p>`,
        `<p class="y-chinh">🎯 Tester tham gia review yêu cầu bắt được defect trước khi có dòng code nào.</p>
<ul>
<li><strong>Ở đâu</strong> — review yêu cầu hoặc làm mịn user story.</li>
<li><strong>Tìm ra gì</strong> — defect ngay trong các sản phẩm đó.</li>
<li><strong>Lợi ích</strong> — giảm rủi ro xây ra phần mềm sai hoặc <em>không kiểm thử được</em>.</li>
</ul>
<p class="nhan">Ví dụ</p>
<p>"Tìm kiếm phải nhanh" là không test được. Tester hỏi lại, và nó thành "95% lượt tìm kiếm trả kết quả trong 2 giây khi có 500 người dùng đồng thời".</p>`],
      [35, "Testing's Contributions to Success (2) — design",
        `<p class="y-chinh">🎯 Testers working with designers during design cut fundamental design defects.</p>
<ul>
<li><strong>Testers gain</strong> — they understand the design and how to test it.</li>
<li><strong>Designers gain</strong> — they learn what is hard to test.</li>
<li><strong>Result</strong> — fewer fundamental design defects, and tests identified early.</li>
</ul>
<p class="nhan">Example</p>
<p>A tester asks "how do we test the payment timeout?" and the architect adds a configurable timeout.</p>`,
        `<p class="y-chinh">🎯 Tester làm cùng người thiết kế ngay lúc thiết kế giúp giảm defect thiết kế nền tảng.</p>
<ul>
<li><strong>Tester được gì</strong> — hiểu thiết kế và cách test nó.</li>
<li><strong>Người thiết kế được gì</strong> — biết chỗ nào khó test.</li>
<li><strong>Kết quả</strong> — ít defect thiết kế nền tảng hơn, và test được xác định sớm.</li>
</ul>
<p class="nhan">Ví dụ</p>
<p>Tester hỏi "làm sao test được timeout thanh toán?" và kiến trúc sư thêm tham số timeout cấu hình được.</p>`],
      [36, "Testing's Contributions to Success (3) — code",
        `<p class="y-chinh">🎯 Testers working with developers while code is written reduce defects in the code <em>and in the tests</em>.</p>
<ul>
<li><strong>How</strong> — both sides understand the code and how to test it better.</li>
<li><strong>Typical forms</strong> — pairing on unit tests, reviewing pull requests, TDD.</li>
</ul>`,
        `<p class="y-chinh">🎯 Tester làm cùng developer khi code đang được viết giúp giảm defect trong code <em>và cả trong test</em>.</p>
<ul>
<li><strong>Vì sao</strong> — cả hai hiểu code và cách test nó hơn.</li>
<li><strong>Hình thức thường gặp</strong> — cặp đôi viết unit test, review pull request, TDD.</li>
</ul>`],
      [37, "Testing's Contributions to Success (4) — before release",
        `<p class="y-chinh">🎯 Verifying and validating before release catches failures that would otherwise be missed.</p>
<ul>
<li><strong>Detect</strong> — failures that would otherwise escape.</li>
<li><strong>Support debugging</strong> — help remove the defects that caused them.</li>
<li><strong>Result</strong> — a higher likelihood that the software meets stakeholder needs and satisfies requirements.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> slides 34–37 together say testing contributes at <em>every</em> stage — requirements, design, code, release — not only at the end.</p>`,
        `<p class="y-chinh">🎯 Verify và validate trước khi phát hành bắt được failure mà nếu không sẽ lọt.</p>
<ul>
<li><strong>Phát hiện</strong> — những failure lẽ ra lọt ra ngoài.</li>
<li><strong>Hỗ trợ debugging</strong> — giúp gỡ defect đã gây ra chúng.</li>
<li><strong>Kết quả</strong> — khả năng phần mềm đáp ứng nhu cầu các bên và thoả yêu cầu tăng lên.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> gộp slide 34–37 lại: kiểm thử đóng góp ở <em>mọi</em> giai đoạn — yêu cầu, thiết kế, code, phát hành — không chỉ lúc cuối.</p>`],
      [38, 'Quality Assurance & Testing',
        `<p class="y-chinh">🎯 Testing is a <strong>quality-control</strong> activity, not a quality-assurance activity — a favourite exam statement.</p>
<p class="nhan">Three nested ideas</p>
<ul>
<li><strong>Quality management</strong> — all activities that direct and control an organisation with regard to quality. It touches HR, delivery… not only software.</li>
<li><strong>Quality assurance (QA)</strong> — part of quality management; focuses on <em>processes</em>. Proper processes give higher-quality work products (audits, standards, training, retrospectives).</li>
<li><strong>Quality control (QC)</strong> — focuses on <em>products</em> rather than processes. Testing belongs here.</li>
</ul>
<p class="ghi-chu">The job title "QA engineer" in companies usually means tester; the syllabus uses the strict meaning.</p>`,
        `<p class="y-chinh">🎯 Kiểm thử là hoạt động <strong>kiểm soát chất lượng (QC)</strong>, không phải QA — câu này rất hay vào đề.</p>
<p class="nhan">Ba khái niệm lồng nhau</p>
<ul>
<li><strong>Quản lý chất lượng</strong> — mọi hoạt động điều hướng và kiểm soát tổ chức về mặt chất lượng. Liên quan cả nhân sự, giao hàng… chứ không riêng phần mềm.</li>
<li><strong>Đảm bảo chất lượng (QA)</strong> — một phần của quản lý chất lượng; tập trung vào <em>quy trình</em>. Làm đúng quy trình thì sản phẩm tốt hơn (audit, chuẩn, đào tạo, retrospective).</li>
<li><strong>Kiểm soát chất lượng (QC)</strong> — tập trung vào <em>sản phẩm</em> chứ không phải quy trình. Kiểm thử nằm ở đây.</li>
</ul>
<p class="ghi-chu">Chức danh "QA engineer" ở công ty thường chỉ tester; syllabus dùng nghĩa hẹp.</p>`],
      [39, 'Errors - Defects - Failures (definitions)',
        `<p class="y-chinh">🎯 Three words the exam never lets you swap: error, defect, failure.</p>
<ul>
<li><strong>Error (mistake)</strong> — a human action that produces an incorrect result.</li>
<li><strong>Defect (fault, bug)</strong> — the manifestation of an error in a work product. If executed, it may cause a failure.</li>
<li><strong>Failure</strong> — an event in which a component or system does not perform a required function within specified limits.</li>
</ul>
<p class="meo">🧠 <strong>Remember the pink box:</strong> <em>a failure is an event; a defect is a state of the software, caused by an error.</em></p>`,
        `<p class="y-chinh">🎯 Ba từ đề thi không cho phép nhầm: error, defect, failure.</p>
<ul>
<li><strong>Error (mistake — sai sót)</strong> — hành động của con người tạo ra kết quả sai.</li>
<li><strong>Defect (fault, bug — khiếm khuyết)</strong> — biểu hiện của sai sót nằm trong sản phẩm công việc. Nếu được thực thi có thể gây failure.</li>
<li><strong>Failure (hỏng hóc)</strong> — sự kiện trong đó thành phần/hệ thống không thực hiện được chức năng yêu cầu trong giới hạn đã định.</li>
</ul>
<p class="meo">🧠 <strong>Thuộc câu trong ô hồng:</strong> <em>failure là một sự kiện; defect là một trạng thái của phần mềm, do error gây ra.</em></p>`],
      [40, 'Errors - Defects - Failures (the chain)',
        `<p class="y-chinh">🎯 The picture version: read it left to right and you will never swap the three words.</p>
<ol>
<li>A person makes an <strong>error</strong> …</li>
<li>… that creates a <strong>defect</strong> in the software …</li>
<li>… that can cause a <strong>failure</strong> in operation.</li>
</ol>`,
        `<p class="y-chinh">🎯 Phiên bản bằng hình: đọc từ trái sang phải là không bao giờ nhầm ba từ này.</p>
<ol>
<li>Một người mắc <strong>error</strong> …</li>
<li>… tạo ra <strong>defect</strong> trong phần mềm …</li>
<li>… có thể gây <strong>failure</strong> khi vận hành.</li>
</ol>`],
      [41, 'Errors - Defects - Failures — where defects come from',
        `<p class="y-chinh">🎯 "Failures come from bugs in the code" is only partly true — many defects are born earlier.</p>
<ul>
<li><strong>About 20%</strong> of defects are in <strong>requirements</strong>.</li>
<li><strong>About 25%</strong> are in <strong>design</strong>.</li>
</ul>
<p>That is why static testing of requirements and designs (Chapter 3) pays off so well.</p>`,
        `<p class="y-chinh">🎯 "Failure là do bug trong code" chỉ đúng một phần — nhiều defect sinh ra sớm hơn thế.</p>
<ul>
<li><strong>Khoảng 20%</strong> defect nằm ở <strong>yêu cầu</strong>.</li>
<li><strong>Khoảng 25%</strong> nằm ở <strong>thiết kế</strong>.</li>
</ul>
<p>Đó là lý do kiểm thử tĩnh yêu cầu và thiết kế (Chương 3) mang lại hiệu quả rất cao.</p>`],
      [42, 'Figure 1.1 — Four typical scenarios',
        `<p class="y-chinh">🎯 Figure 1.1 of the textbook: the earlier the mistake enters the chain, the harder it is to catch.</p>
<p>Each row is a chain: business analyst → requirement → architect → design → programmer → code.</p>
<p class="nhan">The four rows</p>
<ol>
<li><strong>Everything correct</strong> — correct code.</li>
<li><strong>The programmer errs</strong> (requirement and design correct) — incorrect code; found by component/unit testing.</li>
<li><strong>The design is wrong</strong> (requirement correct) — the code faithfully implements a wrong design; found by integration/system testing or design review.</li>
<li><strong>The requirement itself is wrong</strong> — everything downstream is "correct" against a wrong basis. Only <em>validation</em> (reviews with users, acceptance testing) can catch it — the most expensive scenario.</li>
</ol>`,
        `<p class="y-chinh">🎯 Hình 1.1 trong giáo trình: sai sót chen vào chuỗi càng sớm thì càng khó bắt.</p>
<p>Mỗi hàng là một chuỗi: BA → yêu cầu → kiến trúc sư → thiết kế → lập trình viên → code.</p>
<p class="nhan">Bốn hàng</p>
<ol>
<li><strong>Mọi thứ đúng</strong> — code đúng.</li>
<li><strong>Lập trình viên sai</strong> (yêu cầu và thiết kế đúng) — code sai; bắt bằng unit/component test.</li>
<li><strong>Thiết kế sai</strong> (yêu cầu đúng) — code làm đúng theo một thiết kế sai; bắt bằng integration/system test hoặc review thiết kế.</li>
<li><strong>Chính yêu cầu đã sai</strong> — mọi thứ phía sau "đúng" so với một cơ sở sai. Chỉ <em>validation</em> (review cùng người dùng, acceptance test) mới bắt được — kịch bản đắt nhất.</li>
</ol>`],
      [43, 'Error → Defect → Failure / No failure',
        `<p class="y-chinh">🎯 Not every defect produces a failure — and not every failure comes from a defect.</p>
<p class="nhan">Why a defect may cause no failure</p>
<ul>
<li><strong>Never executed</strong> — the faulty code is never run.</li>
<li><strong>Special conditions</strong> — it needs very specific data or conditions.</li>
<li><strong>Masked</strong> — another defect hides it.</li>
</ul>
<p class="nhan">Failures without a code defect</p>
<p>The syllabus notes failures can also be caused by <strong>environmental conditions</strong> — radiation, magnetism, electronic fields, pollution.</p>
<p class="nhan">The tester can be wrong too</p>
<ul>
<li><strong>False positive</strong> — reports a defect that is not there.</li>
<li><strong>False negative</strong> — misses one that is.</li>
</ul>`,
        `<p class="y-chinh">🎯 Không phải defect nào cũng sinh ra failure — và không phải failure nào cũng do defect.</p>
<p class="nhan">Vì sao defect có thể không gây failure</p>
<ul>
<li><strong>Không bao giờ được chạy</strong> — dòng code lỗi không được thực thi.</li>
<li><strong>Điều kiện đặc biệt</strong> — cần dữ liệu/điều kiện rất đặc biệt.</li>
<li><strong>Bị che</strong> — một defect khác che mất nó.</li>
</ul>
<p class="nhan">Failure mà code không có defect</p>
<p>Syllabus nhắc failure cũng có thể do <strong>điều kiện môi trường</strong> — bức xạ, từ trường, trường điện tử, ô nhiễm.</p>
<p class="nhan">Tester cũng có thể sai</p>
<ul>
<li><strong>False positive</strong> — báo có defect trong khi không có.</li>
<li><strong>False negative</strong> — bỏ sót defect có thật.</li>
</ul>`],
      [44, 'Why do errors happen?',
        `<p class="y-chinh">🎯 Eight causes of errors from the syllabus — know them for situation questions.</p>
<ol class="hai-cot">
<li><strong>Time pressure</strong></li>
<li><strong>Human fallibility</strong></li>
<li><strong>Lack of experience</strong> — or skill</li>
<li><strong>Miscommunication</strong> — about requirements and design</li>
<li><strong>Complexity</strong> — of the code, design, architecture or problem</li>
<li><strong>System interactions</strong> — misunderstanding interactions and interfaces</li>
<li><strong>New technologies</strong> — new or unfamiliar</li>
<li><strong>Environmental conditions</strong> — for failures</li>
</ol>
<p class="nhan">How the exam asks it</p>
<p>A situation is described ("the team adopted a new framework under a tight deadline") and you pick which causes apply — here: new technologies and time pressure.</p>`,
        `<p class="y-chinh">🎯 Tám nguyên nhân gây sai sót theo syllabus — cần thuộc cho dạng câu tình huống.</p>
<ol class="hai-cot">
<li><strong>Áp lực thời gian</strong></li>
<li><strong>Con người vốn dễ sai</strong></li>
<li><strong>Thiếu kinh nghiệm</strong> — hoặc kỹ năng</li>
<li><strong>Truyền đạt sai</strong> — về yêu cầu, thiết kế</li>
<li><strong>Độ phức tạp</strong> — của code, thiết kế, kiến trúc hay bài toán</li>
<li><strong>Tương tác hệ thống</strong> — hiểu sai tương tác và giao diện</li>
<li><strong>Công nghệ mới</strong> — mới hoặc lạ</li>
<li><strong>Điều kiện môi trường</strong> — với failure</li>
</ol>
<p class="nhan">Đề hỏi thế nào</p>
<p>Đề mô tả một tình huống ("nhóm dùng framework mới với deadline gấp") rồi hỏi nguyên nhân nào đúng — ở đây: công nghệ mới và áp lực thời gian.</p>`],
      [45, 'What do software faults cost? (Figure 1.2)',
        `<p class="y-chinh">🎯 The later a defect is found, the more it costs to repair — doubling at each stage.</p>
<p class="nhan">Cost to repair, by stage found</p>
<ol>
<li><strong>Requirement</strong> — 1×</li>
<li><strong>Design</strong> — 2×</li>
<li><strong>Code / unit test</strong> — 4×</li>
<li><strong>Independent test</strong> — 8×</li>
<li><strong>After release</strong> — 16×, and much more when you add reputation, recalls or legal cost</li>
</ol>
<p class="nhan">Why</p>
<p>A late fix drags the whole chain with it: change the requirement, the design, the code, the tests, the documentation, then rebuild and redeploy.</p>
<p class="meo">🧠 <strong>Remember:</strong> this curve is the economic argument for <em>early testing</em> (Principle 3).</p>`,
        `<p class="y-chinh">🎯 Defect phát hiện càng muộn thì sửa càng đắt — gấp đôi sau mỗi giai đoạn.</p>
<p class="nhan">Chi phí sửa, theo giai đoạn phát hiện</p>
<ol>
<li><strong>Yêu cầu</strong> — 1×</li>
<li><strong>Thiết kế</strong> — 2×</li>
<li><strong>Code / unit test</strong> — 4×</li>
<li><strong>Test độc lập</strong> — 8×</li>
<li><strong>Sau phát hành</strong> — 16×, còn nhiều hơn nếu tính cả uy tín, thu hồi sản phẩm, pháp lý</li>
</ol>
<p class="nhan">Vì sao</p>
<p>Sửa muộn kéo theo cả chuỗi: sửa yêu cầu, thiết kế, code, test, tài liệu, rồi build và triển khai lại.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đường cong này là lập luận kinh tế cho <em>kiểm thử sớm</em> (Nguyên tắc 3).</p>`],
      [46, 'So why is testing necessary? (✓ / ✗)',
        `<p class="y-chinh">🎯 Five ticks and three crosses — exam gold for "which is NOT a reason" questions.</p>
<p class="nhan">✓ Real reasons</p>
<ul>
<li>Software is likely to have faults</li>
<li>To learn about the reliability of the software</li>
<li>Failures can be very expensive</li>
<li>To avoid being sued by customers</li>
<li>To stay in business</li>
</ul>
<p class="nhan">✗ Not reasons</p>
<ul>
<li><strong>To fill the time between delivery and release</strong> — not a reason.</li>
<li><strong>To prove the software has no faults</strong> — impossible (Principle 1).</li>
<li><strong>Because it is in the project plan</strong> — a plan is not a reason.</li>
</ul>`,
        `<p class="y-chinh">🎯 Năm dấu tích và ba dấu chéo — "vàng" cho dạng câu "đâu KHÔNG phải lý do".</p>
<p class="nhan">✓ Lý do thật</p>
<ul>
<li>Phần mềm nhiều khả năng có lỗi</li>
<li>Để biết độ tin cậy của phần mềm</li>
<li>Failure có thể rất đắt</li>
<li>Để tránh bị khách hàng kiện</li>
<li>Để tồn tại trên thị trường</li>
</ul>
<p class="nhan">✗ Không phải lý do</p>
<ul>
<li><strong>Để lấp khoảng thời gian giữa bàn giao và phát hành</strong> — không phải lý do.</li>
<li><strong>Để chứng minh phần mềm không có lỗi</strong> — bất khả (Nguyên tắc 1).</li>
<li><strong>Vì có trong kế hoạch dự án</strong> — kế hoạch không phải lý do.</li>
</ul>`],
      [47, 'Defects – Root Causes – Effects',
        `<p class="y-chinh">🎯 Remove the root cause and a whole <em>type</em> of defect disappears.</p>
<ul>
<li><strong>Root cause</strong> — a source of a defect such that if it is removed, the occurrence of that <em>type</em> of defect is decreased or removed.</li>
<li><strong>Root-cause analysis (RCA)</strong> — leads to <strong>process improvements</strong> that prevent many future defects.</li>
<li><strong>Common RCA tools</strong> — <em>5 Whys</em> and the Ishikawa (fishbone) diagram.</li>
</ul>
<p class="nhan">The tree picture</p>
<ul>
<li><strong>Leaves</strong> — the failures (symptoms)</li>
<li><strong>Trunk</strong> — the problem</li>
<li><strong>Roots</strong> — the causes</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> pulling leaves does not stop them growing back — fix the roots.</p>`,
        `<p class="y-chinh">🎯 Gỡ được nguyên nhân gốc thì cả một <em>loại</em> defect biến mất.</p>
<ul>
<li><strong>Nguyên nhân gốc (root cause)</strong> — nguồn gốc của defect mà nếu loại bỏ thì <em>loại</em> defect đó giảm hoặc hết hẳn.</li>
<li><strong>Phân tích nguyên nhân gốc (RCA)</strong> — dẫn tới <strong>cải tiến quy trình</strong> ngăn được rất nhiều defect về sau.</li>
<li><strong>Công cụ RCA hay dùng</strong> — <em>5 Whys</em> và biểu đồ xương cá Ishikawa.</li>
</ul>
<p class="nhan">Hình cái cây</p>
<ul>
<li><strong>Lá</strong> — failure (triệu chứng)</li>
<li><strong>Thân</strong> — vấn đề</li>
<li><strong>Rễ</strong> — nguyên nhân</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ngắt lá thì lá vẫn mọc lại — phải chữa tận rễ.</p>`],
      [48, 'Defects – Root Causes – Effects: worked example',
        `<p class="y-chinh">🎯 One story, four labels: failure, defect, root cause, effect.</p>
<p class="nhan">The story</p>
<p>Incorrect interest payments, caused by one wrong line of code, produce customer complaints. The line was written for an ambiguous user story, because the product owner misunderstood how to calculate interest.</p>
<p class="nhan">Classification</p>
<ul>
<li><strong>Failure</strong> — incorrect calculations for customers</li>
<li><strong>Defect</strong> — the wrong calculation in the code</li>
<li><strong>Root cause</strong> — the PO's lack of knowledge of interest calculation</li>
<li><strong>Effect</strong> — customer complaints</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> the failure is what the <em>system</em> did; the effect is what happened to the <em>business</em>.</p>`,
        `<p class="y-chinh">🎯 Một câu chuyện, bốn nhãn: failure, defect, root cause, effect.</p>
<p class="nhan">Câu chuyện</p>
<p>Một dòng code sai làm tính lãi sai và khách hàng khiếu nại. Dòng code đó viết theo một user story mơ hồ, vì product owner hiểu sai cách tính lãi.</p>
<p class="nhan">Phân loại</p>
<ul>
<li><strong>Failure</strong> — tính sai cho khách hàng</li>
<li><strong>Defect</strong> — phép tính sai trong code</li>
<li><strong>Root cause</strong> — PO thiếu kiến thức tính lãi</li>
<li><strong>Effect</strong> — khách hàng khiếu nại</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> failure là việc <em>hệ thống</em> đã làm; effect là điều xảy ra với <em>doanh nghiệp</em>.</p>`],
      [49, 'Question — which statement describes a failure?',
        `<p class="y-chinh">🎯 A failure is an observable event at run time — like a crash.</p>
<ul>
<li><strong>A — the product crashed</strong> — an observable run-time event = failure.</li>
<li><strong>B — wrong file version in the build</strong> — a defect.</li>
<li><strong>C — algorithm uses the wrong input variables</strong> — a defect.</li>
<li><strong>D — developer misinterpreted the requirement</strong> — an error.</li>
</ul>` + AE('A — The product crashed when the user selected an option in a dialog box', ''),
        `<p class="y-chinh">🎯 Failure là một sự kiện quan sát được khi chạy — như crash.</p>
<ul>
<li><strong>A — sản phẩm bị crash</strong> — sự kiện quan sát được khi chạy = failure.</li>
<li><strong>B — đưa nhầm phiên bản file vào build</strong> — defect.</li>
<li><strong>C — thuật toán dùng sai biến đầu vào</strong> — defect.</li>
<li><strong>D — developer hiểu sai yêu cầu</strong> — error.</li>
</ul>` + AV('A — Sản phẩm bị crash khi người dùng chọn một tuỳ chọn trong hộp thoại', '')],
      [50, 'Question — root cause analysis',
        `<p class="y-chinh">🎯 RCA works in every lifecycle step and prevents many future defects.</p>
<ul>
<li><strong>A</strong> — wrong: RCA is used in any process, not only software.</li>
<li><strong>B</strong> — nonsense: RCA improves the process, it does not "destroy" it.</li>
<li><strong>C</strong> — correct: the wording of slide 47.</li>
</ul>` + AE('C — RCA can be applied in all lifecycle steps and can prevent many future defects', ''),
        `<p class="y-chinh">🎯 RCA dùng được ở mọi bước vòng đời và ngăn được nhiều defect về sau.</p>
<ul>
<li><strong>A</strong> — sai: RCA dùng cho mọi quy trình, không riêng phần mềm.</li>
<li><strong>B</strong> — vô lý: RCA cải tiến quy trình chứ không "phá huỷ" nó.</li>
<li><strong>C</strong> — đúng: câu chữ của slide 47.</li>
</ul>` + AV('C — RCA áp dụng được ở mọi bước vòng đời và ngăn được nhiều defect về sau', '')],
      [51, 'Question — correct statement about the chain',
        `<p class="y-chinh">🎯 The correct order is mistake → defect → failure, and failures show when executing.</p>
<ul>
<li><strong>C</strong> — the only option that keeps this order and says failures are seen when executing.</li>
<li><strong>A, B, D</strong> — scramble the terms.</li>
</ul>` + AE('C — A developer makes a mistake which causes a defect that may be seen as a failure during dynamic testing', ''),
        `<p class="y-chinh">🎯 Thứ tự đúng là mistake → defect → failure, và failure lộ ra khi chạy.</p>
<ul>
<li><strong>C</strong> — phương án duy nhất giữ đúng thứ tự này và nói failure lộ ra khi chạy.</li>
<li><strong>A, B, D</strong> — đảo lộn thuật ngữ.</li>
</ul>` + AV('C — Developer mắc sai sót gây ra defect, có thể lộ thành failure khi kiểm thử động', '')],
      [52, 'Question — which statements are TRUE?',
        `<p class="y-chinh">🎯 Statements 1 and 3 are true; 2 and 4 are false.</p>
<ol>
<li><strong>True</strong> — contracts or law may require testing.</li>
<li><strong>False</strong> — testing serves all stakeholders; it is not mainly about the developer's work.</li>
<li><strong>True</strong> — rigorous testing + fixing reduces operational risk.</li>
<li><strong>False</strong> — you can never prove all failures have been found.</li>
</ol>` + AE('C — 1 and 3 are true, 2 and 4 are false', ''),
        `<p class="y-chinh">🎯 Câu 1 và 3 đúng; câu 2 và 4 sai.</p>
<ol>
<li><strong>Đúng</strong> — hợp đồng/luật có thể bắt buộc kiểm thử.</li>
<li><strong>Sai</strong> — kiểm thử phục vụ mọi bên, không chủ yếu để cải thiện công việc của developer.</li>
<li><strong>Đúng</strong> — test kỹ + sửa lỗi giảm rủi ro khi vận hành.</li>
<li><strong>Sai</strong> — không bao giờ chứng minh được đã tìm hết failure.</li>
</ol>` + AV('C — 1 và 3 đúng, 2 và 4 sai', '')],
    ]),
    bi(`<h3>🔒 Hidden slides in SWT1_tim.pptx (not shown in class, still worth knowing)</h3>
<h4>Reliability vs faults (pptx slide 44)</h4>
<ul>
<li><strong>Reliability</strong> — the probability that software will not cause a system failure for a specified time under specified conditions.</li>
<li><strong>Is a non-trivial system ever fault-free?</strong> — practically never.</li>
<li><strong>Can software be reliable and still contain faults?</strong> — yes: faults on paths users never take.</li>
<li><strong>Does "fault-free" guarantee reliability?</strong> — no, not if the requirements themselves are wrong.</li>
</ul>
<h4>Why do errors happen? (pptx slide 45, older version of slide 44)</h4>
<p>Software is written by humans who:</p>
<ul>
<li>know something, but not everything;</li>
<li>have skills, but are not perfect;</li>
<li>work under deadline pressure, with no time to check assumptions.</li>
</ul>
<h4>Testing and quality (pptx slide 64)</h4>
<ul>
<li><strong>Testing measures quality</strong> — removing the faults it finds improves quality, and possibly reliability.</li>
<li><strong>Functions and non-functional qualities</strong> — reliability, usability, maintainability, reusability, testability.</li>
</ul>`,
    `<h3>🔒 Slide ẩn trong file SWT1_tim.pptx (không chiếu trên lớp nhưng vẫn nên biết)</h3>
<h4>Reliability vs faults (slide pptx 44)</h4>
<ul>
<li><strong>Độ tin cậy (reliability)</strong> — xác suất phần mềm không gây hỏng hệ thống trong một khoảng thời gian, dưới điều kiện xác định.</li>
<li><strong>Hệ thống không tầm thường có bao giờ "không có lỗi"?</strong> — gần như không bao giờ.</li>
<li><strong>Phần mềm còn lỗi vẫn tin cậy được không?</strong> — có: lỗi nằm trên nhánh người dùng không bao giờ đi.</li>
<li><strong>"Không có lỗi" có đảm bảo tin cậy?</strong> — không, nếu chính yêu cầu đã sai.</li>
</ul>
<h4>Why do errors happen? (slide pptx 45, bản cũ của slide 44)</h4>
<p>Phần mềm do con người viết — những người:</p>
<ul>
<li>biết nhiều nhưng không biết hết;</li>
<li>giỏi nhưng không hoàn hảo;</li>
<li>làm dưới áp lực deadline nên không có thời gian kiểm lại giả định.</li>
</ul>
<h4>Testing and quality (slide pptx 64)</h4>
<ul>
<li><strong>Kiểm thử đo chất lượng</strong> — gỡ các lỗi nó tìm được thì chất lượng (và có thể cả độ tin cậy) tăng.</li>
<li><strong>Chức năng và thuộc tính phi chức năng</strong> — độ tin cậy, khả dụng, khả năng bảo trì, tái sử dụng, khả năng kiểm thử.</li>
</ul>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — classify and cost it</h3>
<p><strong>Situation.</strong> The spec says "users aged 18 or older may register". The developer, rushing before a demo, writes <code>if (age &gt; 18)</code>. In production an 18-year-old is rejected; she posts about it and 40 sign-ups are lost that day.</p>
<ol>
<li><strong>Root cause:</strong> time pressure + no review of boundary rules (a process gap).</li>
<li><strong>Error:</strong> the developer's misreading of "18 or older".</li>
<li><strong>Defect:</strong> <code>age &gt; 18</code> instead of <code>age &gt;= 18</code>.</li>
<li><strong>Failure:</strong> the rejection of an 18-year-old at registration (only visible at exactly 18 — a boundary).</li>
<li><strong>Effect:</strong> the complaint and the 40 lost sign-ups.</li>
</ol>
<p><strong>Cost (slide 45 multipliers).</strong> Say fixing it during coding/unit test (the 4× stage) takes 1 hour. Then one "unit" of the chart is 1 h ÷ 4 = 0.25 h: a requirements-review fix would have cost 0.25 h, and after release it costs 16 × 0.25 h = <strong>4 hours</strong> of fix-build-deploy-verify work — before counting the lost customers. The process fix from RCA: add "boundary values" to the code-review checklist and to the test-design technique list (BVA, Chapter 4).</p>
<div class="pitfall co-tieu-de"><strong>Do not confuse failure with effect, or error with root cause.</strong> The failure is what the <em>system</em> did; the effect is what happened to <em>people or the business</em>. The error is the individual mistake; the root cause is <em>why</em> that mistake was possible.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>How solid is the "16× cost" curve?</strong>
<ul>
<li><strong>Origin</strong> — the multiplier chart goes back to Barry Boehm's 1981 data and is repeated in almost every textbook.</li>
<li><strong>Critique</strong> — Laurent Bossavit (<em>The Leprechauns of Software Engineering</em>) showed that many of the exact numbers come from small or second-hand studies.</li>
<li><strong>What holds</strong> — the <em>direction</em> is well supported (late defects cost more), but the size varies by project.</li>
<li><strong>DevOps</strong> — in continuous-delivery teams with fast automated pipelines the curve flattens a lot, one reason DevOps invests so heavily in automation.</li>
</ul>
<p class="ghi-chu">Outside the syllabus because CTFL presents the curve as a fixed fact.</p></div>`,
    `<h3>Ví dụ có lời giải · Phân loại và tính chi phí</h3>
<p><strong>Tình huống.</strong> Đặc tả ghi "người từ 18 tuổi trở lên được đăng ký". Developer vội cho kịp buổi demo nên viết <code>if (age &gt; 18)</code>. Trên production một bạn đúng 18 tuổi bị từ chối; bạn ấy đăng lên mạng và hôm đó mất 40 lượt đăng ký.</p>
<ol>
<li><strong>Root cause:</strong> áp lực thời gian + không review các luật biên (lỗ hổng quy trình).</li>
<li><strong>Error:</strong> developer đọc sai "từ 18 tuổi trở lên".</li>
<li><strong>Defect:</strong> <code>age &gt; 18</code> thay vì <code>age &gt;= 18</code>.</li>
<li><strong>Failure:</strong> người 18 tuổi bị từ chối khi đăng ký (chỉ lộ ra đúng ở 18 — một giá trị biên).</li>
<li><strong>Effect:</strong> lời phàn nàn và 40 lượt đăng ký bị mất.</li>
</ol>
<p><strong>Chi phí (hệ số slide 45).</strong> Giả sử sửa ngay ở khâu code/unit test (mức 4×) mất 1 giờ. Khi đó một "đơn vị" của biểu đồ là 1 giờ ÷ 4 = 0,25 giờ: nếu bắt được lúc review yêu cầu chỉ tốn 0,25 giờ, còn sau phát hành tốn 16 × 0,25 = <strong>4 giờ</strong> sửa-build-triển khai-kiểm lại — chưa kể khách hàng bị mất. Cải tiến quy trình rút ra từ RCA: thêm mục "giá trị biên" vào checklist review code và vào danh sách kỹ thuật thiết kế test (BVA, Chương 4).</p>
<div class="pitfall co-tieu-de"><strong>Đừng nhầm failure với effect, hay error với root cause.</strong> Failure là việc <em>hệ thống</em> đã làm; effect là điều xảy ra với <em>con người hoặc doanh nghiệp</em>. Error là sai sót cụ thể của một người; root cause là <em>vì sao</em> sai sót đó có thể xảy ra.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Đường cong "16×" chắc chắn tới đâu?</strong>
<ul>
<li><strong>Nguồn gốc</strong> — biểu đồ hệ số bắt nguồn từ dữ liệu của Barry Boehm năm 1981 và được lặp lại ở gần như mọi giáo trình.</li>
<li><strong>Phản biện</strong> — Laurent Bossavit (<em>The Leprechauns of Software Engineering</em>) chỉ ra nhiều con số chính xác đến từ các nghiên cứu nhỏ hoặc trích lại.</li>
<li><strong>Điều vẫn đúng</strong> — <em>chiều hướng</em> có cơ sở vững (lỗi muộn đắt hơn), nhưng độ lớn thay đổi theo dự án.</li>
<li><strong>DevOps</strong> — ở các nhóm continuous delivery có pipeline tự động nhanh, đường cong phẳng đi rất nhiều — một lý do DevOps đầu tư mạnh vào tự động hoá.</li>
</ul>
<p class="ghi-chu">Ngoài giáo trình vì CTFL trình bày đường cong như một sự thật cố định.</p></div>`),
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
<div class="callout"><strong>Learning objective.</strong> LO-1.3.1 Explain the seven testing principles (K2).</div>
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
</table>
<p class="meo">🧠 <strong>Remember the order:</strong> <em>"Present – Not all – Early – Cluster – Pesticide – Context – Fallacy"</em>.</p>`,
    `<span class="eyebrow">Chương 1 · Bài 1.3 · SWT1 slide 53–72</span>
<h2>Bảy nguyên tắc kiểm thử</h2>
<p class="lead">Bảy câu ngắn xuất hiện trong gần như mọi đề ISTQB và FE — thường dưới dạng "nguyên tắc nào giải thích tình huống này?". Học đúng câu chữ, một ví dụ cho mỗi nguyên tắc, và hai cái bẫy (1 và 7).</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong> LO-1.3.1 Giải thích bảy nguyên tắc kiểm thử (K2).</div>
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
<p class="meo">🧠 <strong>Mẹo nhớ theo thứ tự:</strong> <em>"Có – Không vét – Sớm – Cụm – Thuốc trừ sâu – Ngữ cảnh – Ngộ nhận"</em>.</p>`),
    walkHead(D, 53, 72),
    walk(D, [
      [53, 'CONTENT — Testing principles',
        `<p class="y-chinh">🎯 Third block of the chapter: the seven testing principles.</p>
<ul>
<li><strong>One slide per principle</strong> — slides 54, 55 and 63–67.</li>
<li><strong>Slides 56–62</strong> — zoom in on Principle 2 and the question "how much testing is enough?".</li>
</ul>`,
        `<p class="y-chinh">🎯 Khối thứ ba của chương: bảy nguyên tắc kiểm thử.</p>
<ul>
<li><strong>Mỗi nguyên tắc một slide</strong> — slide 54, 55 và 63–67.</li>
<li><strong>Slide 56–62</strong> — đào sâu Nguyên tắc 2 và câu hỏi "test bao nhiêu là đủ?".</li>
</ul>`],
      [54, 'Principle 1 — Testing shows the presence of defects',
        `<p class="y-chinh">🎯 Testing can show that defects are present — it can never prove there are none.</p>
<ul>
<li><strong>What testing does</strong> — reduces the probability that undiscovered defects remain.</li>
<li><strong>What it cannot do</strong> — even if no defects are found, that is <strong>not a proof of correctness</strong>.</li>
</ul>
<p>Dijkstra put it as: "Program testing can be used to show the presence of bugs, but never to show their absence."</p>
<div class="pitfall">Any option saying testing "proves", "guarantees" or "shows the absence of" defects is false.</div>`,
        `<p class="y-chinh">🎯 Kiểm thử cho thấy defect đang có mặt — không bao giờ chứng minh được là không còn defect.</p>
<ul>
<li><strong>Kiểm thử làm được</strong> — giảm xác suất còn defect chưa phát hiện.</li>
<li><strong>Kiểm thử không làm được</strong> — kể cả khi không tìm thấy defect nào, đó <strong>không phải bằng chứng phần mềm đúng</strong>.</li>
</ul>
<p>Dijkstra nói: "Kiểm thử chương trình có thể chỉ ra sự hiện diện của bug, nhưng không bao giờ chỉ ra sự vắng mặt của chúng."</p>
<div class="pitfall">Phương án nào nói kiểm thử "chứng minh", "đảm bảo" hay "cho thấy không có" defect đều sai.</div>`],
      [55, 'Principle 2 — Exhaustive testing is impossible',
        `<p class="y-chinh">🎯 Testing everything is not feasible except for trivial cases — so focus instead.</p>
<ul>
<li><strong>"Everything"</strong> — all combinations of inputs and preconditions.</li>
<li><strong>Instead of trying</strong> — use <strong>risk analysis, test techniques and priorities</strong> to focus effort.</li>
</ul>
<p>The next slide shows how fast the numbers explode.</p>`,
        `<p class="y-chinh">🎯 Test mọi thứ là không khả thi, trừ trường hợp tầm thường — nên phải tập trung.</p>
<ul>
<li><strong>"Mọi thứ"</strong> — mọi tổ hợp đầu vào và điều kiện tiên quyết.</li>
<li><strong>Thay vì cố</strong> — dùng <strong>phân tích rủi ro, kỹ thuật thiết kế test và độ ưu tiên</strong> để tập trung công sức.</li>
</ul>
<p>Slide sau cho thấy con số bùng nổ nhanh thế nào.</p>`],
      [56, 'Why not just "test everything"?',
        `<p class="y-chinh">🎯 Even a modest application needs 480,000 tests to be "exhaustive" — and that is an underestimate.</p>
<p class="nhan">The slide's model</p>
<ul>
<li><strong>20</strong> screens</li>
<li><strong>4</strong> menus per screen (average), <strong>3</strong> options per menu</li>
<li><strong>10</strong> fields per screen (average)</li>
<li><strong>2</strong> input types per field — a date as "Jan 3" or "3/1", a number as integer or decimal</li>
<li><strong>About 100</strong> possible values</li>
</ul>
<p>20 × 4 × 3 × 10 × 2 × 100 = <strong>480,000 tests</strong>.</p>
<p class="nhan">How long at 1 test per second</p>
<ol>
<li>480,000 s = 8,000 min = 133.3 h</li>
<li>The slide's <strong>17.7 days</strong> means <em>working</em> days of 7.5 h (133.3 ÷ 7.5 ≈ 17.8)</li>
<li>Not counting finger trouble, faults or retests</li>
</ol>
<p class="nhan">And that model is generous</p>
<p>It multiplies the choices but treats the 10 fields as independent. Truly exhaustive testing of <em>one</em> screen with 10 fields of 100 values each needs 100¹⁰ = 10²⁰ combinations — at one per second, about 3 × 10¹² years.</p>`,
        `<p class="y-chinh">🎯 Một ứng dụng bình thường cũng cần 480.000 test mới gọi là "vét cạn" — mà vẫn còn tính thiếu.</p>
<p class="nhan">Mô hình trên slide</p>
<ul>
<li><strong>20</strong> màn hình</li>
<li><strong>4</strong> menu mỗi màn hình (trung bình), <strong>3</strong> lựa chọn mỗi menu</li>
<li><strong>10</strong> trường mỗi màn hình (trung bình)</li>
<li><strong>2</strong> kiểu nhập mỗi trường — ngày dạng "Jan 3" hay "3/1", số dạng nguyên hay thập phân</li>
<li><strong>Khoảng 100</strong> giá trị có thể</li>
</ul>
<p>20 × 4 × 3 × 10 × 2 × 100 = <strong>480.000 test</strong>.</p>
<p class="nhan">Mất bao lâu nếu mỗi test 1 giây</p>
<ol>
<li>480.000 s = 8.000 phút = 133,3 giờ</li>
<li>Con số <strong>17,7 ngày</strong> trên slide là tính theo <em>ngày làm việc</em> 7,5 giờ (133,3 ÷ 7,5 ≈ 17,8)</li>
<li>Chưa tính gõ nhầm, lỗi hay chạy lại</li>
</ol>
<p class="nhan">Mà mô hình đó còn "hào phóng"</p>
<p>Nó nhân các lựa chọn nhưng coi 10 trường độc lập với nhau. Test vét cạn thật sự chỉ <em>một</em> màn hình 10 trường, mỗi trường 100 giá trị, cần 100¹⁰ = 10²⁰ tổ hợp — mỗi giây một ca thì mất khoảng 3 × 10¹² năm.</p>`],
      [57, 'Exhaustive testing?',
        `<p class="y-chinh">🎯 Two mini-quizzes on the slide, answers already ticked.</p>
<p class="nhan">What is exhaustive testing?</p>
<ul>
<li>✗ <strong>When all testers are exhausted</strong> — a joke.</li>
<li>✗ <strong>When all <em>planned</em> tests have run</strong> — that is just completing the plan.</li>
<li>✓ <strong>Exercising all combinations of inputs and preconditions</strong></li>
</ul>
<p class="nhan">How much time would it take?</p>
<ul>
<li>✗ <strong>Infinite</strong> — only true for unbounded inputs.</li>
<li>✗ <strong>Not much</strong></li>
<li>✓ <strong>An impractical amount of time</strong></li>
</ul>`,
        `<p class="y-chinh">🎯 Hai câu hỏi nhỏ trên slide, đáp án đã được đánh dấu sẵn.</p>
<p class="nhan">Test vét cạn là gì?</p>
<ul>
<li>✗ <strong>Khi tester kiệt sức</strong> — câu đùa.</li>
<li>✗ <strong>Khi đã chạy hết các test <em>đã lên kế hoạch</em></strong> — đó chỉ là làm xong kế hoạch.</li>
<li>✓ <strong>Chạy mọi tổ hợp đầu vào và điều kiện tiên quyết</strong></li>
</ul>
<p class="nhan">Mất bao lâu?</p>
<ul>
<li>✗ <strong>Vô hạn</strong> — chỉ đúng khi đầu vào không giới hạn.</li>
<li>✗ <strong>Không lâu</strong></li>
<li>✓ <strong>Một lượng thời gian phi thực tế</strong></li>
</ul>`],
      [58, 'How much testing is enough?',
        `<p class="y-chinh">🎯 "How much is enough?" — the only fully correct answer is: it depends on the risks.</p>
<ul>
<li>✗ <strong>It's never enough</strong></li>
<li>✗ <strong>When you have done what you planned</strong></li>
<li>✗ <strong>When the customer/user is happy</strong></li>
<li>✗ <strong>When you have proved the system works</strong></li>
<li>✗/✓ <strong>When you are confident it works</strong> — confidence is an objective, but it must be justified by risk.</li>
<li>✓ <strong>It depends on the risks for your system</strong></li>
</ul>`,
        `<p class="y-chinh">🎯 "Test bao nhiêu là đủ?" — đáp án đúng trọn vẹn duy nhất: tuỳ vào rủi ro.</p>
<ul>
<li>✗ <strong>Không bao giờ đủ</strong></li>
<li>✗ <strong>Khi đã làm xong kế hoạch</strong></li>
<li>✗ <strong>Khi khách hàng/người dùng hài lòng</strong></li>
<li>✗ <strong>Khi đã chứng minh hệ thống chạy đúng</strong></li>
<li>✗/✓ <strong>Khi tự tin hệ thống chạy đúng</strong> — niềm tin là một mục tiêu, nhưng phải có cơ sở rủi ro.</li>
<li>✓ <strong>Tuỳ vào rủi ro của hệ thống</strong></li>
</ul>`],
      [59, 'How much testing? It depends on RISK',
        `<p class="y-chinh">🎯 How much testing depends on RISK — six risks to weigh.</p>
<ol>
<li><strong>Missing important faults</strong></li>
<li><strong>Incurring failure costs</strong></li>
<li><strong>Releasing untested or under-tested software</strong></li>
<li><strong>Losing credibility and market share</strong></li>
<li><strong>Missing a market window</strong></li>
<li><strong>Over-testing, ineffective testing</strong> — this one matters: testing too much is also a risk, because it burns time and money you could have spent elsewhere, or delays the release.</li>
</ol>`,
        `<p class="y-chinh">🎯 Test bao nhiêu tuỳ vào RỦI RO — sáu rủi ro cần cân.</p>
<ol>
<li><strong>Bỏ sót lỗi quan trọng</strong></li>
<li><strong>Gánh chi phí hỏng hóc</strong></li>
<li><strong>Phát hành phần mềm chưa test hoặc test chưa đủ</strong></li>
<li><strong>Mất uy tín và thị phần</strong></li>
<li><strong>Lỡ thời điểm thị trường</strong></li>
<li><strong>Test quá mức, test không hiệu quả</strong> — cái này rất quan trọng: test quá nhiều cũng là rủi ro, vì đốt thời gian và tiền lẽ ra dùng việc khác, hoặc làm trễ phát hành.</li>
</ol>`],
      [60, 'So little time, so much to test…',
        `<p class="y-chinh">🎯 Test time is always limited — use RISK to decide where to place emphasis.</p>
<p class="nhan">Use risk to determine</p>
<ul>
<li><strong>What to test first</strong></li>
<li><strong>What to test most</strong></li>
<li><strong>How thoroughly</strong> to test each item</li>
<li><strong>What <em>not</em> to test</strong> — this time</li>
</ul>
<p>Then allocate the available time by prioritising.</p>`,
        `<p class="y-chinh">🎯 Thời gian test luôn có hạn — dùng RỦI RO để quyết định đặt trọng tâm vào đâu.</p>
<p class="nhan">Dùng rủi ro để quyết định</p>
<ul>
<li><strong>Test gì trước</strong></li>
<li><strong>Test gì nhiều nhất</strong></li>
<li><strong>Kỹ đến đâu</strong> với mỗi hạng mục</li>
<li><strong>Không test gì</strong> — ở lần này</li>
</ul>
<p>Rồi phân bổ thời gian có được theo độ ưu tiên.</p>`],
      [61, 'Most important principle',
        `<p class="y-chinh">🎯 "Prioritise tests so that, whenever you stop testing, you have done the best testing in the time available."</p>
<ul>
<li><strong>Why</strong> — testing is often cut short by the deadline.</li>
<li><strong>Effect</strong> — if the most important tests ran first, stopping early still leaves you with the most valuable information.</li>
<li><strong>In practice</strong> — sort your test cases by risk priority and run them in that order.</li>
</ul>`,
        `<p class="y-chinh">🎯 "Ưu tiên các test sao cho, dù dừng test lúc nào, bạn cũng đã test tốt nhất có thể trong thời gian cho phép."</p>
<ul>
<li><strong>Vì sao</strong> — việc test hay bị deadline cắt ngang.</li>
<li><strong>Kết quả</strong> — nếu test quan trọng nhất đã chạy trước thì dừng sớm vẫn giữ được thông tin giá trị nhất.</li>
<li><strong>Thực tế</strong> — sắp xếp test case theo mức ưu tiên rủi ro và chạy theo đúng thứ tự đó.</li>
</ul>`],
      [62, 'Other factors that influence testing',
        `<p class="y-chinh">🎯 Besides risk, requirements from outside also decide how much you test.</p>
<ul>
<li><strong>Contractual requirements</strong></li>
<li><strong>Legal requirements</strong></li>
<li><strong>Industry-specific requirements</strong> — e.g. the pharmaceutical industry (FDA), compiler standard tests, safety-critical domains such as railway switching and air-traffic control.</li>
</ul>
<p class="meo">🧠 <strong>Conclusion in the box:</strong> <em>it is difficult to determine how much testing is enough, but it is not impossible.</em></p>`,
        `<p class="y-chinh">🎯 Ngoài rủi ro, các yêu cầu từ bên ngoài cũng quyết định test bao nhiêu.</p>
<ul>
<li><strong>Yêu cầu hợp đồng</strong></li>
<li><strong>Yêu cầu pháp lý</strong></li>
<li><strong>Yêu cầu riêng của ngành</strong> — vd dược phẩm (FDA), bộ test chuẩn cho trình biên dịch, lĩnh vực an toàn như bẻ ghi đường sắt, kiểm soát không lưu.</li>
</ul>
<p class="meo">🧠 <strong>Kết luận trong khung:</strong> <em>khó xác định test bao nhiêu là đủ, nhưng không phải là không thể.</em></p>`],
      [63, 'Principle 3 — Early testing',
        `<p class="y-chinh">🎯 Start testing as early as possible — "shift left".</p>
<ul>
<li><strong>What</strong> — testing activities, both static and dynamic, start <strong>as early as possible</strong> in the lifecycle and are focused on defined objectives.</li>
<li><strong>Why</strong> — testing early reduces or eliminates costly changes: the 1×→16× curve of slide 45.</li>
</ul>
<p class="nhan">Examples</p>
<ul>
<li>Reviewing requirements</li>
<li>Writing acceptance tests before coding</li>
<li>TDD</li>
</ul>`,
        `<p class="y-chinh">🎯 Bắt đầu kiểm thử càng sớm càng tốt — "shift left".</p>
<ul>
<li><strong>Là gì</strong> — hoạt động kiểm thử, cả tĩnh lẫn động, bắt đầu <strong>càng sớm càng tốt</strong> trong vòng đời và tập trung vào mục tiêu đã xác định.</li>
<li><strong>Vì sao</strong> — test sớm giảm hoặc loại bỏ những thay đổi tốn kém: đường cong 1×→16× ở slide 45.</li>
</ul>
<p class="nhan">Ví dụ</p>
<ul>
<li>Review yêu cầu</li>
<li>Viết acceptance test trước khi code</li>
<li>TDD</li>
</ul>`],
      [64, 'Principle 4 — Defect clustering',
        `<p class="y-chinh">🎯 A few modules hold most of the defects — so test more where defects cluster.</p>
<ul>
<li><strong>The observation</strong> — a small number of modules usually contain most of the defects found before release, or cause most operational failures (a Pareto-like 80/20 distribution).</li>
<li><strong>How to use it</strong> — predicted and observed clusters are an important <strong>input to risk analysis</strong>.</li>
<li><strong>Where to look</strong> — complex, recently changed or poorly understood modules.</li>
</ul>`,
        `<p class="y-chinh">🎯 Vài module chứa phần lớn defect — nên test nhiều hơn ở nơi defect co cụm.</p>
<ul>
<li><strong>Quan sát</strong> — một số ít module thường chứa phần lớn defect tìm được trước phát hành, hoặc gây ra phần lớn failure khi vận hành (phân bố kiểu Pareto 80/20).</li>
<li><strong>Dùng thế nào</strong> — các cụm defect dự đoán và quan sát được là <strong>đầu vào quan trọng cho phân tích rủi ro</strong>.</li>
<li><strong>Tìm ở đâu</strong> — module phức tạp, vừa sửa nhiều, hoặc ít người hiểu.</li>
</ul>`],
      [65, 'Principle 5 — Pesticide paradox',
        `<p class="y-chinh">🎯 The same tests repeated over and over stop finding new defects — like insects resisting a pesticide.</p>
<ul>
<li><strong>The cure</strong> — change existing tests and test data, and write new tests.</li>
<li><strong>Nuance</strong> (explicit in CTFL v4, "tests wear out") — for <em>automated regression</em> tests a stable set is fine: their job is to confirm nothing broke, not to find new bugs.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cùng một bộ test lặp lại mãi sẽ ngừng tìm ra defect mới — như sâu bọ kháng thuốc trừ sâu.</p>
<ul>
<li><strong>Cách chữa</strong> — thay đổi test và dữ liệu test hiện có, và viết test mới.</li>
<li><strong>Lưu ý</strong> (CTFL v4 nói rõ, "tests wear out") — với test <em>hồi quy tự động</em> thì bộ test ổn định là bình thường: việc của chúng là khẳng định không có gì hỏng, không phải tìm bug mới.</li>
</ul>`],
      [66, 'Principle 6 — Testing is context dependent',
        `<p class="y-chinh">🎯 Testing is done differently in different contexts.</p>
<p class="nhan">Examples</p>
<ul>
<li><strong>Safety-critical vs e-commerce</strong> — a pacemaker or flight controller is tested differently from a web shop.</li>
<li><strong>Startup vs bank</strong> — a startup MVP differently from a bank core system.</li>
<li><strong>Agile vs sequential</strong> — an Agile project differently from a sequential one.</li>
</ul>
<p>Techniques, rigour, documentation and independence all change with context.</p>`,
        `<p class="y-chinh">🎯 Kiểm thử được làm khác nhau trong những ngữ cảnh khác nhau.</p>
<p class="nhan">Ví dụ</p>
<ul>
<li><strong>An toàn-sống-còn vs thương mại điện tử</strong> — máy trợ tim, bộ điều khiển bay được test khác một trang bán hàng.</li>
<li><strong>Startup vs ngân hàng</strong> — MVP của startup khác hệ thống lõi ngân hàng.</li>
<li><strong>Agile vs tuần tự</strong> — dự án Agile khác dự án tuần tự.</li>
</ul>
<p>Kỹ thuật, độ khắt khe, tài liệu và mức độc lập đều thay đổi theo ngữ cảnh.</p>`],
      [67, 'Principle 7 — Absence-of-errors fallacy',
        `<p class="y-chinh">🎯 A system with no known defects is still a failure if nobody can use it.</p>
<ul>
<li><strong>The principle</strong> — finding and fixing many defects does not help if the system built is <strong>unusable</strong> or does not fulfil the users' needs and expectations.</li>
<li><strong>The fallacy</strong> — the false belief that "no known defects = successful product".</li>
<li><strong>Consequence</strong> — <em>validation</em> matters as much as verification.</li>
</ul>
<p class="ghi-chu">The slide's text has a stray word "fallacy" in the middle of the sentence — a copy-paste slip in the deck.</p>`,
        `<p class="y-chinh">🎯 Hệ thống không còn lỗi đã biết vẫn là thất bại nếu không ai dùng được.</p>
<ul>
<li><strong>Nguyên tắc</strong> — tìm và sửa thật nhiều defect cũng vô ích nếu hệ thống làm ra <strong>không dùng được</strong> hoặc không đáp ứng nhu cầu và kỳ vọng của người dùng.</li>
<li><strong>Ngộ nhận</strong> — niềm tin sai rằng "không còn lỗi đã biết = sản phẩm thành công".</li>
<li><strong>Hệ quả</strong> — <em>validation</em> quan trọng không kém verification.</li>
</ul>
<p class="ghi-chu">Câu trên slide có chữ "fallacy" lạc vào giữa câu — lỗi dán nhầm của bộ slide.</p>`],
      [68, 'Question — which statement describes a principle correctly?',
        `<p class="y-chinh">🎯 Only c states a principle correctly — Principle 2.</p>
<ul>
<li><strong>a, b</strong> — false: they claim exhaustive testing is possible (with automation, or with enough effort and tools).</li>
<li><strong>c</strong> — Principle 2, exhaustive testing is impossible.</li>
<li><strong>d</strong> — contradicts Principle 1.</li>
</ul>` + AE('c — It is normally impossible to test all input/output combinations', ''),
        `<p class="y-chinh">🎯 Chỉ c mô tả đúng một nguyên tắc — Nguyên tắc 2.</p>
<ul>
<li><strong>a, b</strong> — sai: cho rằng test vét cạn khả thi (nhờ tự động hoá, hay đủ nỗ lực và công cụ).</li>
<li><strong>c</strong> — Nguyên tắc 2, không thể test vét cạn.</li>
<li><strong>d</strong> — trái với Nguyên tắc 1.</li>
</ul>` + AV('c — Thông thường không thể test mọi tổ hợp đầu vào/đầu ra', '')],
      [69, 'Question — why avoid the pesticide paradox?',
        `<p class="y-chinh">🎯 The pesticide paradox: the same tests, run again and again, find fewer and fewer new defects.</p>
<ul>
<li><strong>d</strong> — the definition itself.</li>
<li><strong>a, b, c</strong> — distractors built from unrelated words.</li>
</ul>` + AE('d — Running the same tests over and over will reduce the chance of finding new defects', ''),
        `<p class="y-chinh">🎯 Pesticide paradox: cùng các test chạy đi chạy lại sẽ tìm được ngày càng ít defect mới.</p>
<ul>
<li><strong>d</strong> — chính là định nghĩa.</li>
<li><strong>a, b, c</strong> — phương án nhiễu ghép từ các chữ không liên quan.</li>
</ul>` + AV('d — Chạy lặp đi lặp lại cùng các test sẽ giảm khả năng tìm ra defect mới', '')],
      [70, 'Question — a true statement about exhaustive testing',
        `<p class="y-chinh">🎯 Exhaustive testing is not feasible except for trivial software — word for word from the principle.</p>
<ul>
<li><strong>a</strong> — wrong: it is not a form of stress testing.</li>
<li><strong>c</strong> — wrong: automation does not make it feasible.</li>
<li><strong>d</strong> — wrong: it is nobody's responsibility, because nobody can do it.</li>
</ul>` + AE('b — It is not feasible except in the case of trivial software', ''),
        `<p class="y-chinh">🎯 Test vét cạn không khả thi, trừ phần mềm tầm thường — đúng từng chữ của nguyên tắc.</p>
<ul>
<li><strong>a</strong> — sai: nó không phải một dạng stress test.</li>
<li><strong>c</strong> — sai: tự động hoá không làm nó khả thi.</li>
<li><strong>d</strong> — sai: không ai chịu trách nhiệm làm, vì không ai làm nổi.</li>
</ul>` + AV('b — Không khả thi, trừ với phần mềm tầm thường', '')],
      [71, 'Question — the 90–95% defect detection case',
        `<p class="y-chinh">🎯 You cannot test everything, so some defects always escape.</p>
<ul>
<li><strong>c</strong> — correct: 90–95% detection with happy users and low-impact failures is a good, risk-based result.</li>
<li><strong>d</strong> — wrong: the absence-of-errors fallacy is about building the wrong system, but here users are happy.</li>
</ul>` + AE('c — Exhaustive testing is impossible', ''),
        `<p class="y-chinh">🎯 Không thể test hết, nên luôn có defect lọt.</p>
<ul>
<li><strong>c</strong> — đúng: phát hiện 90–95% trong khi người dùng hài lòng và failure ít tác động là kết quả tốt, dựa trên rủi ro.</li>
<li><strong>d</strong> — sai: ngộ nhận "không lỗi" nói về việc làm sai hệ thống, còn ở đây người dùng hài lòng.</li>
</ul>` + AV('c — Không thể test vét cạn', '')],
      [72, 'Question — very complex code',
        `<p class="y-chinh">🎯 Complex code is where defects cluster.</p>
<ul>
<li><strong>Why</strong> — complexity is one of the best predictors of where defects cluster.</li>
<li><strong>So</strong> — the complex code is likely to hold more defects and deserves more testing.</li>
</ul>` + AE('b — Defect clustering', ''),
        `<p class="y-chinh">🎯 Code phức tạp là nơi defect co cụm.</p>
<ul>
<li><strong>Vì sao</strong> — độ phức tạp là một trong những dấu hiệu dự báo tốt nhất nơi defect co cụm.</li>
<li><strong>Nên</strong> — code phức tạp nhiều khả năng chứa nhiều defect hơn và cần test nhiều hơn.</li>
</ul>` + AV('b — Defect clustering', '')],
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
<div class="pitfall co-tieu-de"><strong>Two words that decide the answer.</strong>
<ul>
<li><strong>"Prove", "guarantee", "no defects"</strong> → Principle 1 (and the option is false).</li>
<li><strong>"Useless", "not what users need"</strong> → Principle 7.</li>
<li><strong>"Same tests again"</strong> → Principle 5.</li>
<li><strong>"Most defects in few modules"</strong> → Principle 4.</li>
</ul></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Principle 2 in numbers — combinatorial testing.</strong>
<p>If exhaustive testing is impossible, how do real teams choose?</p>
<ul>
<li><strong>The evidence</strong> — studies by NIST (Kuhn et al.) found that most field failures are triggered by interactions of just <strong>1 to 6 parameters</strong>, the large majority involving 1–2.</li>
<li><strong>Pairwise (all-pairs) testing</strong> — covers every pair of parameter values with a tiny suite.</li>
<li><strong>The numbers</strong> — 10 parameters with 3 values each need 3¹⁰ = 59,049 exhaustive tests, but an all-pairs suite needs only about 15–17.</li>
<li><strong>Book</strong> — Spillner covers it in §5.1.5 "Pair-wise testing".</li>
</ul>
<p class="ghi-chu">Outside the CTFL syllabus, but it is the practical answer to Principle 2.</p></div>`,
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
<div class="pitfall co-tieu-de"><strong>Chữ khoá quyết định đáp án.</strong>
<ul>
<li><strong>"Chứng minh", "đảm bảo", "không có defect"</strong> → Nguyên tắc 1 (và phương án đó sai).</li>
<li><strong>"Vô dụng", "không đúng nhu cầu"</strong> → Nguyên tắc 7.</li>
<li><strong>"Lặp lại cùng test"</strong> → Nguyên tắc 5.</li>
<li><strong>"Phần lớn defect ở vài module"</strong> → Nguyên tắc 4.</li>
</ul></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Nguyên tắc 2 bằng con số — kiểm thử tổ hợp.</strong>
<p>Nếu không thể test vét cạn, nhóm thực tế chọn thế nào?</p>
<ul>
<li><strong>Bằng chứng</strong> — các nghiên cứu của NIST (Kuhn và cộng sự) cho thấy phần lớn failure thực tế chỉ do tương tác của <strong>1 đến 6 tham số</strong>, và đa số chỉ 1–2.</li>
<li><strong>Kiểm thử pairwise (mọi cặp)</strong> — phủ mọi cặp giá trị tham số với một bộ test rất nhỏ.</li>
<li><strong>Con số</strong> — 10 tham số, mỗi cái 3 giá trị cần 3¹⁰ = 59.049 test vét cạn, nhưng bộ all-pairs chỉ cần khoảng 15–17 test.</li>
<li><strong>Sách</strong> — Spillner trình bày ở §5.1.5 "Pair-wise testing".</li>
</ul>
<p class="ghi-chu">Ngoài syllabus CTFL, nhưng là câu trả lời thực tế cho Nguyên tắc 2.</p></div>`),
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
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-1.4.1</strong> — Explain the impact of context on the test process (K2)</li>
<li><strong>LO-1.4.2</strong> — Describe the test activities and tasks (K2)</li>
<li><strong>LO-1.4.3</strong> — Differentiate the work products that support the test process (K2)</li>
<li><strong>LO-1.4.4</strong> — Explain the value of traceability between test basis and test work products (K2)</li>
</ul></div>
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
<div class="callout ok"><strong>Older books use a 5-step process (CTFL 2011)</strong> — you will meet it in the Spillner 4th edition and the older Graham book, and in some FE questions:
<ol>
<li>Planning &amp; control</li>
<li>Analysis &amp; design</li>
<li>Implementation &amp; execution</li>
<li>Evaluating exit criteria &amp; reporting</li>
<li>Test closure</li>
</ol>
<p>Mapping: "closure" = completion; "evaluating exit criteria" now sits inside monitoring &amp; control.</p></div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.4 · SWT1 slide 73–98 · Additional Content 18–26</span>
<h2>Quy trình kiểm thử</h2>
<p class="lead">Không có quy trình test "một cỡ vừa mọi người", nhưng quy trình tốt nào cũng có đủ <strong>bảy nhóm hoạt động</strong> giống nhau. Với mỗi nhóm bạn phải biết nó trả lời câu hỏi gì, gồm những việc chính nào và tạo ra <strong>sản phẩm (work product)</strong> gì — câu hỏi thi gần như luôn có dạng "việc X diễn ra ở hoạt động nào?".</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-1.4.1</strong> — Giải thích ảnh hưởng của ngữ cảnh lên quy trình test (K2)</li>
<li><strong>LO-1.4.2</strong> — Mô tả các hoạt động và công việc kiểm thử (K2)</li>
<li><strong>LO-1.4.3</strong> — Phân biệt các sản phẩm hỗ trợ quy trình test (K2)</li>
<li><strong>LO-1.4.4</strong> — Giải thích giá trị của truy vết giữa test basis và sản phẩm kiểm thử (K2)</li>
</ul></div>
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
<div class="callout ok"><strong>Sách cũ dùng quy trình 5 bước (CTFL 2011)</strong> — bạn sẽ gặp trong Spillner bản 4 và sách Graham bản cũ, và trong một số câu FE:
<ol>
<li>Planning &amp; control</li>
<li>Analysis &amp; design</li>
<li>Implementation &amp; execution</li>
<li>Evaluating exit criteria &amp; reporting</li>
<li>Test closure</li>
</ol>
<p>Quy đổi: "closure" = completion; "evaluating exit criteria" nay nằm trong monitoring &amp; control.</p></div>`),
    walkHead(D, 73, 98),
    walk(D, [
      [73, 'CONTENT — Test process',
        `<p class="y-chinh">🎯 Fourth block of the chapter: the test process.</p>
<p class="ghi-chu">The deck lists "Why testing is necessary" before "What is testing" here — a small inconsistency with slide 2; the content order is the same.</p>`,
        `<p class="y-chinh">🎯 Khối thứ tư của chương: quy trình kiểm thử.</p>
<p class="ghi-chu">Ở slide này thứ tự "Why testing is necessary" và "What is testing" bị đảo so với slide 2 — sơ suất nhỏ của bộ slide; nội dung vẫn theo đúng thứ tự.</p>`],
      [74, 'Test Process',
        `<p class="y-chinh">🎯 There is no "one size fits all" test process — but every good one shares a common set of activities.</p>
<p>Without that <strong>common set of activities</strong>, testing is less likely to reach its objectives.</p>
<p class="nhan">What shapes an organisation's process (LO-1.4.1)</p>
<ul>
<li><strong>Lifecycle model</strong></li>
<li><strong>Domain and risks</strong></li>
<li><strong>Constraints</strong> — budget, time</li>
<li><strong>Organisational policies</strong></li>
<li><strong>Required standards</strong></li>
</ul>
<p class="ghi-chu">The teacher's note on the slide says the same thing, in Vietnamese.</p>`,
        `<p class="y-chinh">🎯 Không có quy trình test "một cỡ vừa tất cả" — nhưng quy trình tốt nào cũng có chung một bộ hoạt động.</p>
<p>Thiếu <strong>bộ hoạt động chung</strong> đó thì kiểm thử khó đạt mục tiêu.</p>
<p class="nhan">Điều quyết định quy trình của mỗi tổ chức (LO-1.4.1)</p>
<ul>
<li><strong>Mô hình vòng đời</strong></li>
<li><strong>Lĩnh vực và rủi ro</strong></li>
<li><strong>Ràng buộc</strong> — ngân sách, thời gian</li>
<li><strong>Chính sách tổ chức</strong></li>
<li><strong>Chuẩn bắt buộc</strong></li>
</ul>
<p class="ghi-chu">Ghi chú của thầy/cô trên slide nói đúng ý này, bằng tiếng Việt.</p>`],
      [75, 'Test Process in Context — test basis & coverage',
        `<p class="y-chinh">🎯 Tests are derived from a test basis, and coverage measures how much of it the tests exercised.</p>
<ul>
<li><strong>Test basis</strong> — the body of knowledge used as the basis for test analysis and design: whatever the tests are derived from (user requirements, user stories, design, code).</li>
<li><strong>Measurable coverage criteria</strong> — it helps if the test basis has them defined.</li>
<li><strong>Coverage</strong> — the degree to which specified coverage items have been exercised by a test suite, <em>expressed as a percentage</em>.</li>
</ul>`,
        `<p class="y-chinh">🎯 Test được suy ra từ test basis, và coverage đo xem các test đã chạy tới được bao nhiêu phần của nó.</p>
<ul>
<li><strong>Test basis (cơ sở kiểm thử)</strong> — khối kiến thức làm nền cho phân tích và thiết kế test: bất cứ thứ gì mà test được suy ra từ đó (yêu cầu người dùng, user story, thiết kế, code).</li>
<li><strong>Tiêu chí bao phủ đo được</strong> — sẽ hữu ích nếu test basis có sẵn chúng.</li>
<li><strong>Coverage (độ bao phủ)</strong> — mức độ các coverage item đã được một bộ test chạy tới, <em>biểu thị bằng phần trăm</em>.</li>
</ul>`],
      [76, 'Test Process in Context — mobile app example',
        `<p class="y-chinh">🎯 For a mobile app, both requirements and supported devices are elements of the test basis.</p>
<ul>
<li><strong>Test basis</strong> — a list of requirements <em>and</em> a list of supported devices; each requirement and each device is one element.</li>
<li><strong>Coverage criterion</strong> — e.g. "at least one test case per element".</li>
<li><strong>What the results tell stakeholders</strong> — which requirements are fulfilled, and on which devices failures were seen.</li>
</ul>
<p class="nhan">Worked numbers</p>
<ol>
<li>12 requirements and 5 devices.</li>
<li>Tests executed so far touch 9 requirements and 4 devices.</li>
<li>Requirement coverage 9/12 = <strong>75%</strong>; device coverage 4/5 = <strong>80%</strong>.</li>
</ol>`,
        `<p class="y-chinh">🎯 Với app di động, cả yêu cầu lẫn thiết bị hỗ trợ đều là phần tử của test basis.</p>
<ul>
<li><strong>Test basis</strong> — danh sách yêu cầu <em>và</em> danh sách thiết bị hỗ trợ; mỗi yêu cầu, mỗi thiết bị là một phần tử.</li>
<li><strong>Tiêu chí bao phủ</strong> — vd "ít nhất một test case cho mỗi phần tử".</li>
<li><strong>Kết quả cho các bên biết</strong> — yêu cầu nào đã đáp ứng, và failure xuất hiện trên thiết bị nào.</li>
</ul>
<p class="nhan">Tính thử</p>
<ol>
<li>12 yêu cầu và 5 thiết bị.</li>
<li>Các test đã chạy chạm tới 9 yêu cầu và 4 thiết bị.</li>
<li>Coverage yêu cầu 9/12 = <strong>75%</strong>; coverage thiết bị 4/5 = <strong>80%</strong>.</li>
</ol>`],
      [77, 'Test Process Activities (the arrow)',
        `<p class="y-chinh">🎯 The seven activity groups on one arrow — memorise the order.</p>
<ol>
<li>Planning</li>
<li>Monitoring &amp; Control</li>
<li>Analysis</li>
<li>Design</li>
<li>Implementation</li>
<li>Execution</li>
<li>Completion</li>
</ol>
<p>Question 16 (slide 16) and several FE questions depend on this order.</p>`,
        `<p class="y-chinh">🎯 Bảy nhóm hoạt động trên một mũi tên — phải thuộc thứ tự.</p>
<ol>
<li>Planning</li>
<li>Monitoring &amp; Control</li>
<li>Analysis</li>
<li>Design</li>
<li>Implementation</li>
<li>Execution</li>
<li>Completion</li>
</ol>
<p>Câu hỏi ở slide 16 và nhiều câu FE dựa vào thứ tự này.</p>`],
      [78, 'Test Process Activities — not strictly sequential',
        `<p class="y-chinh">🎯 The activities look sequential, but in practice they overlap, run concurrently or iterate.</p>
<ul>
<li><strong>Many tasks</strong> — each group consists of many tasks that vary by project or release.</li>
<li><strong>Monitoring &amp; control</strong> — runs during the whole project.</li>
<li><strong>In Agile</strong> — analysis → execution happen inside every sprint.</li>
</ul>`,
        `<p class="y-chinh">🎯 Các hoạt động trông tuần tự, nhưng thực tế chúng chồng lấn, chạy song song hoặc lặp lại.</p>
<ul>
<li><strong>Nhiều việc</strong> — mỗi nhóm gồm nhiều việc thay đổi theo dự án/bản phát hành.</li>
<li><strong>Monitoring &amp; control</strong> — chạy suốt dự án.</li>
<li><strong>Trong Agile</strong> — từ analysis tới execution diễn ra trong mỗi sprint.</li>
</ul>`],
      [79, 'Step 1. Test Planning',
        `<p class="y-chinh">🎯 Planning defines the <strong>objectives</strong> of testing and the <strong>approach</strong> to meet them within the project's constraints and context.</p>
<p class="nhan">Typical tasks</p>
<ul>
<li>Choose suitable test techniques</li>
<li>Decide which tasks need to be done</li>
<li>Formulate a test schedule</li>
<li>Define entry and exit criteria</li>
</ul>
<p>Output: the <strong>test plan</strong> — revisited as feedback comes in (Chapter 5).</p>`,
        `<p class="y-chinh">🎯 Planning xác định <strong>mục tiêu</strong> kiểm thử và <strong>cách tiếp cận</strong> để đạt chúng trong ràng buộc và ngữ cảnh dự án.</p>
<p class="nhan">Việc điển hình</p>
<ul>
<li>Chọn kỹ thuật test phù hợp</li>
<li>Xác định những việc cần làm</li>
<li>Lập lịch test</li>
<li>Định tiêu chí vào/ra</li>
</ul>
<p>Sản phẩm: <strong>test plan</strong> — được cập nhật khi có phản hồi (Chương 5).</p>`],
      [80, 'Step 2. Test Monitoring and Control',
        `<p class="y-chinh">🎯 Monitoring compares progress with the plan; control acts to get back on track.</p>
<ul>
<li><strong>Monitoring</strong> — ongoing <em>comparison</em> of actual progress against the plan, using the metrics defined in the plan.</li>
<li><strong>Control</strong> — taking the <em>actions</em> needed to meet the plan's objectives.</li>
<li><strong>Supported by</strong> — <strong>exit criteria</strong> (Definition of Done in Agile).</li>
<li><strong>Communicated in</strong> — <strong>test progress reports</strong> to stakeholders.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> monitoring <em>looks</em>, control <em>acts</em>.</p>`,
        `<p class="y-chinh">🎯 Monitoring so tiến độ với kế hoạch; control hành động để đưa về đúng hướng.</p>
<ul>
<li><strong>Monitoring (giám sát)</strong> — liên tục <em>so sánh</em> tiến độ thực tế với kế hoạch, bằng các chỉ số định trong kế hoạch.</li>
<li><strong>Control (kiểm soát)</strong> — thực hiện <em>hành động</em> cần thiết để đạt mục tiêu của kế hoạch.</li>
<li><strong>Dựa trên</strong> — <strong>exit criteria</strong> (Definition of Done trong Agile).</li>
<li><strong>Báo cáo qua</strong> — <strong>test progress report</strong> gửi các bên liên quan.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> monitoring <em>nhìn</em>, control <em>làm</em>.</p>`],
      [81, 'Step 3. Test Analysis — WHAT to test',
        `<p class="y-chinh">🎯 Test analysis answers <strong>"What to test?"</strong> by turning the test basis into test conditions.</p>
<ul>
<li><strong>Test condition</strong> — an aspect of the test basis relevant to specific test objectives (e.g. "login with a locked account").</li>
<li><strong>Test analysis</strong> — identifies test conditions by analysing the test basis: requirement specs, design, code, risk analysis report.</li>
<li><strong>Bi-directional traceability</strong> — captured here: each condition ↔ its requirement.</li>
<li><strong>Test charters</strong> — conditions can serve as objectives in exploratory test charters.</li>
<li><strong>Bonus</strong> — analysis also finds defects in the test basis itself (ambiguities, contradictions).</li>
</ul>`,
        `<p class="y-chinh">🎯 Test analysis trả lời <strong>"Test cái gì?"</strong> bằng cách biến test basis thành test condition.</p>
<ul>
<li><strong>Test condition</strong> — một khía cạnh của test basis liên quan tới mục tiêu test cụ thể (vd "đăng nhập bằng tài khoản bị khoá").</li>
<li><strong>Test analysis</strong> — xác định test condition bằng cách phân tích test basis: đặc tả yêu cầu, thiết kế, code, báo cáo phân tích rủi ro.</li>
<li><strong>Truy vết hai chiều</strong> — được lập ở bước này: mỗi condition ↔ yêu cầu của nó.</li>
<li><strong>Test charter</strong> — condition có thể làm mục tiêu cho test charter khi test thăm dò.</li>
<li><strong>Thêm nữa</strong> — phân tích cũng tìm ra defect ngay trong test basis (chỗ mơ hồ, mâu thuẫn).</li>
</ul>`],
      [82, 'Step 4. Test Design — HOW to test',
        `<p class="y-chinh">🎯 Test design answers <strong>"How to test?"</strong>.</p>
<ul>
<li><strong>Design and prioritise test cases</strong> — using the techniques of Chapter 4.</li>
<li><strong>Identify test data</strong> — the data the cases need.</li>
<li><strong><em>Design</em> the test environment</strong> — what infrastructure and tools are needed. Building it is implementation.</li>
</ul>`,
        `<p class="y-chinh">🎯 Test design trả lời <strong>"Test như thế nào?"</strong>.</p>
<ul>
<li><strong>Thiết kế và ưu tiên test case</strong> — bằng các kỹ thuật ở Chương 4.</li>
<li><strong>Xác định dữ liệu test</strong> — dữ liệu các ca cần có.</li>
<li><strong><em>Thiết kế</em> môi trường test</strong> — cần hạ tầng, công cụ gì. Còn <em>dựng</em> nó là việc của implementation.</li>
</ul>`],
      [83, 'A good test case — the four Es',
        `<p class="y-chinh">🎯 A good test case has the four Es.</p>
<ul>
<li><strong>Effective</strong> — finds faults.</li>
<li><strong>Exemplary</strong> — represents others: one test stands for a whole class of inputs.</li>
<li><strong>Evolvable</strong> — easy to maintain.</li>
<li><strong>Economic</strong> — cheap to use: run, check, maintain.</li>
</ul>
<p>A test that never finds anything, duplicates others, breaks at every UI change or takes an hour to run fails one of the Es.</p>`,
        `<p class="y-chinh">🎯 Test case tốt có đủ bốn chữ E.</p>
<ul>
<li><strong>Effective</strong> — tìm ra lỗi.</li>
<li><strong>Exemplary</strong> — đại diện được cho các ca khác: một test đứng cho cả một lớp đầu vào.</li>
<li><strong>Evolvable</strong> — dễ bảo trì.</li>
<li><strong>Economic</strong> — rẻ khi dùng: chạy, kiểm, bảo trì.</li>
</ul>
<p>Test không bao giờ tìm ra gì, trùng lặp, gãy mỗi khi đổi giao diện hay chạy mất một tiếng là trượt một chữ E.</p>`],
      [84, 'Step 4. Test Design (cont.) — test case sheet',
        `<p class="y-chinh">🎯 A real test-case sheet for "Google Email Sample · Login" — with one deliberate-looking mistake to spot.</p>
<p class="nhan">Header</p>
<p>Project name, module name, reference document, created by, date of creation, date of review.</p>
<p class="nhan">The ten columns</p>
<ol class="hai-cot">
<li>Test case ID</li>
<li>Test scenario</li>
<li>Test case</li>
<li>Pre-condition</li>
<li>Test steps</li>
<li>Test data</li>
<li>Expected result</li>
<li>Post condition</li>
<li>Actual result</li>
<li>Status (pass/fail)</li>
</ol>
<p class="nhan">The four rows — the classic login matrix</p>
<ul>
<li><strong>Valid / valid</strong> — "Successful login"; post condition: Gmail inbox is displayed.</li>
<li><strong>Valid / invalid, invalid / valid, invalid / invalid</strong> — "The mail and password you entered don't match".</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Spot the mistake:</strong> all four rows have the same ID <code>TC_LOGIN-001</code>. IDs must be unique (001…004), otherwise defect reports and traceability break.</div>
<p>Actual result and status stay empty until execution.</p>`,
        `<p class="y-chinh">🎯 Một bảng test case thật cho "Google Email Sample · Login" — kèm một lỗi cần tìm.</p>
<p class="nhan">Phần đầu</p>
<p>Tên dự án, tên module, tài liệu tham chiếu, người tạo, ngày tạo, ngày review.</p>
<p class="nhan">Mười cột</p>
<ol class="hai-cot">
<li>Test case ID</li>
<li>Test scenario</li>
<li>Test case</li>
<li>Pre-condition</li>
<li>Test steps</li>
<li>Test data</li>
<li>Expected result</li>
<li>Post condition</li>
<li>Actual result</li>
<li>Status (pass/fail)</li>
</ol>
<p class="nhan">Bốn dòng — ma trận đăng nhập kinh điển</p>
<ul>
<li><strong>Đúng / đúng</strong> — "Successful login"; post condition: hộp thư Gmail hiện ra.</li>
<li><strong>Đúng / sai, sai / đúng, sai / sai</strong> — "The mail and password you entered don't match".</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Tìm lỗi trong mẫu:</strong> cả bốn dòng cùng mã <code>TC_LOGIN-001</code>. Mã phải duy nhất (001…004), nếu không defect report và truy vết sẽ rối.</div>
<p>Actual result và Status để trống tới lúc thực thi.</p>`],
      [85, 'Step 5. Test Implementation — everything in place?',
        `<p class="y-chinh">🎯 Implementation answers <strong>"Do we now have everything in place to run the tests?"</strong></p>
<ol>
<li><strong>Develop and prioritise test procedures</strong> — and automated scripts.</li>
<li><strong>Create test suites</strong> — group the procedures.</li>
<li><strong>Arrange them in a test execution schedule</strong></li>
<li><strong><em>Build</em> the test environment</strong> — including stubs, drivers, simulators — and load the test data.</li>
</ol>`,
        `<p class="y-chinh">🎯 Implementation trả lời <strong>"Đã có đủ mọi thứ để chạy test chưa?"</strong></p>
<ol>
<li><strong>Xây dựng và ưu tiên test procedure</strong> — và script tự động.</li>
<li><strong>Tạo test suite</strong> — gom các procedure lại.</li>
<li><strong>Sắp chúng vào lịch thực thi (test execution schedule)</strong></li>
<li><strong><em>Dựng</em> môi trường test</strong> — kể cả stub, driver, simulator — và nạp dữ liệu test.</li>
</ol>`],
      [86, 'Step 6. Test Execution',
        `<p class="y-chinh">🎯 Execution runs the suites, compares actual with expected, and turns anomalies into defect reports.</p>
<ol>
<li><strong>Run</strong> — test suites run according to the test execution schedule.</li>
<li><strong>Compare</strong> — actual vs expected results; differences are <strong>anomalies</strong>.</li>
<li><strong>Analyse each anomaly</strong> — its cause may be a defect in the code, a <em>false positive</em>, or a defect in the test itself.</li>
<li><strong>Report</strong> — defects based on the failures observed, and log the results.</li>
<li><strong>Re-test</strong> — <strong>confirmation</strong> and/or <strong>regression</strong> tests on fixes.</li>
</ol>`,
        `<p class="y-chinh">🎯 Execution chạy các suite, so thực tế với mong đợi, và biến anomaly thành defect report.</p>
<ol>
<li><strong>Chạy</strong> — các test suite chạy theo lịch thực thi.</li>
<li><strong>So sánh</strong> — kết quả thực tế với mong đợi; chỗ khác nhau gọi là <strong>anomaly (bất thường)</strong>.</li>
<li><strong>Phân tích từng anomaly</strong> — nguyên nhân có thể là defect trong code, <em>false positive</em>, hay lỗi trong chính test.</li>
<li><strong>Báo cáo</strong> — defect dựa trên failure quan sát được, và ghi log kết quả.</li>
<li><strong>Test lại</strong> — <strong>confirmation test</strong> và/hoặc <strong>regression test</strong> cho các bản sửa.</li>
</ol>`],
      [87, 'Step 6. Test Execution (cont.) — a defect report',
        `<p class="y-chinh">🎯 A sample defect report — and the difference between severity and priority.</p>
<p class="nhan">Defect report #111 "CART – Unable to add new item to my cart"</p>
<ul>
<li><strong>Bug ID</strong> — reporter Jane Doe, submit date 08/05/2023.</li>
<li><strong>Overview</strong> — summary, URL, screenshot.</li>
<li><strong>Environment</strong> — Macintosh, macOS Ventura 13.3.1, Chrome 111.</li>
<li><strong>Details</strong> — steps to reproduce; expected result 2 items vs actual result 1 item.</li>
<li><strong>Tracking</strong> — <strong>severity Major, priority High</strong>.</li>
</ul>
<p class="nhan">Two terms from the speaker notes</p>
<ul>
<li><strong>Severity</strong> — how badly the defect affects the software's functionality.</li>
<li><strong>Priority</strong> — how fast it must be fixed.</li>
</ul>
<p class="nhan">They are independent</p>
<ul>
<li><strong>High severity / low priority</strong> — a crash in a rarely used admin report.</li>
<li><strong>Low severity / high priority</strong> — a misspelt company name on the home page.</li>
</ul>
<p>Full defect management is in Chapter 5.</p>`,
        `<p class="y-chinh">🎯 Một defect report mẫu — và khác biệt giữa severity với priority.</p>
<p class="nhan">Defect report #111 "CART – Không thêm được sản phẩm thứ hai vào giỏ"</p>
<ul>
<li><strong>Bug ID</strong> — người báo Jane Doe, ngày báo 08/05/2023.</li>
<li><strong>Tổng quan</strong> — tóm tắt, URL, ảnh chụp.</li>
<li><strong>Môi trường</strong> — Macintosh, macOS Ventura 13.3.1, Chrome 111.</li>
<li><strong>Chi tiết</strong> — các bước tái hiện; kết quả mong đợi 2 sản phẩm so với thực tế 1 sản phẩm.</li>
<li><strong>Theo dõi</strong> — <strong>severity Major, priority High</strong>.</li>
</ul>
<p class="nhan">Hai thuật ngữ trong ghi chú của thầy/cô</p>
<ul>
<li><strong>Severity (mức nghiêm trọng)</strong> — defect ảnh hưởng tới chức năng phần mềm nặng tới đâu.</li>
<li><strong>Priority (độ ưu tiên)</strong> — phải sửa gấp tới đâu.</li>
</ul>
<p class="nhan">Hai cái độc lập nhau</p>
<ul>
<li><strong>Severity cao / priority thấp</strong> — crash ở một trang báo cáo quản trị ít ai dùng.</li>
<li><strong>Severity thấp / priority cao</strong> — sai chính tả tên công ty ở trang chủ.</li>
</ul>
<p>Quản lý defect đầy đủ ở Chương 5.</p>`],
      [88, 'Step 7. Test Completion',
        `<p class="y-chinh">🎯 Completion collects the data, closes the loose ends and hands over the testware.</p>
<p class="nhan">Tasks</p>
<ol>
<li><strong>Collect data</strong> — from completed activities, at project milestones (release, end of iteration, project cancelled).</li>
<li><strong>Check defect reports</strong> — closed, or turned into change requests.</li>
<li><strong>Create the test summary report</strong></li>
<li><strong>Hand over the testware</strong> — <em>why?</em> So the maintenance/operations team can reuse it for regression testing and knowledge transfer.</li>
</ol>
<p class="nhan">From the teacher's notes</p>
<ul>
<li><strong>Questions answered</strong> — how many test cases ran? how many defects were found and fixed? with what priority and severity?</li>
<li><strong>Purpose</strong> — stakeholders decide whether to deliver, or move to the next test level.</li>
<li><strong>More than once</strong> — completion happens several times per project.</li>
<li><strong>Which report where</strong> — a <em>summary</em> report is produced in monitoring &amp; control <em>and</em> completion; a <em>progress</em> report only in monitoring &amp; control.</li>
</ul>`,
        `<p class="y-chinh">🎯 Completion thu thập dữ liệu, dọn các việc còn dở và bàn giao testware.</p>
<p class="nhan">Việc cần làm</p>
<ol>
<li><strong>Thu thập dữ liệu</strong> — từ các hoạt động đã xong, tại các mốc dự án (phát hành, hết iteration, dự án bị huỷ).</li>
<li><strong>Kiểm tra defect report</strong> — đã đóng, hoặc chuyển thành change request.</li>
<li><strong>Lập test summary report</strong></li>
<li><strong>Bàn giao testware</strong> — <em>vì sao?</em> Để nhóm bảo trì/vận hành tái dùng cho regression test và chuyển giao tri thức.</li>
</ol>
<p class="nhan">Ghi chú của thầy/cô</p>
<ul>
<li><strong>Câu hỏi cần trả lời</strong> — đã chạy bao nhiêu test case? tìm và sửa bao nhiêu defect? priority và severity ra sao?</li>
<li><strong>Mục đích</strong> — các bên quyết định giao hàng, hay chuyển sang cấp test tiếp theo.</li>
<li><strong>Nhiều lần</strong> — completion xảy ra nhiều lần trong một dự án.</li>
<li><strong>Báo cáo nào ở đâu</strong> — báo cáo <em>tổng kết</em> được lập ở cả monitoring &amp; control <em>lẫn</em> completion; báo cáo <em>tiến độ</em> chỉ ở monitoring &amp; control.</li>
</ul>`],
      [89, 'Test Work Products',
        `<p class="y-chinh">🎯 Each activity has its own work products — learn this table by heart.</p>
<ol>
<li><strong>Planning</strong> — test plans</li>
<li><strong>Monitoring &amp; control</strong> — test progress/summary reports</li>
<li><strong>Analysis</strong> — test conditions, test charters</li>
<li><strong>Design</strong> — test cases, test data</li>
<li><strong>Implementation</strong> — test procedures, test suites, test execution schedule</li>
<li><strong>Execution</strong> — status of test cases, defect reports</li>
<li><strong>Completion</strong> — test summary reports, change requests</li>
</ol>`,
        `<p class="y-chinh">🎯 Mỗi hoạt động có sản phẩm riêng — bảng này phải thuộc lòng.</p>
<ol>
<li><strong>Planning</strong> — test plan</li>
<li><strong>Monitoring &amp; control</strong> — báo cáo tiến độ/tổng kết</li>
<li><strong>Analysis</strong> — test condition, test charter</li>
<li><strong>Design</strong> — test case, dữ liệu test</li>
<li><strong>Implementation</strong> — test procedure, test suite, lịch thực thi</li>
<li><strong>Execution</strong> — trạng thái test case, defect report</li>
<li><strong>Completion</strong> — test summary report, change request</li>
</ol>`],
      [90, 'Comparison of tasks — intellectual vs clerical',
        `<p class="y-chinh">🎯 Thinking tasks decide how good the tests are; clerical tasks are the ones worth automating.</p>
<ul>
<li><strong>Planning and specification</strong> (analysis/design) — <em>intellectual, one-off</em> activities that <em>govern the quality of the tests</em>.</li>
<li><strong>Execution and recording</strong> — <em>clerical</em> activities <em>repeated many times</em>, so they are the ones <em>good to automate</em>.</li>
</ul>
<p>Automation speeds up the clerical part; it cannot replace the thinking that decides what is worth testing.</p>`,
        `<p class="y-chinh">🎯 Việc trí tuệ quyết định bộ test tốt hay dở; việc thủ tục mới là phần đáng tự động hoá.</p>
<ul>
<li><strong>Planning và specification</strong> (phân tích/thiết kế) — việc <em>trí tuệ, làm một lần</em>, <em>quyết định chất lượng của bộ test</em>.</li>
<li><strong>Execution và recording</strong> — việc <em>thủ tục, lặp đi lặp lại nhiều lần</em>, nên đó mới là phần <em>đáng tự động hoá</em>.</li>
</ul>
<p>Tự động hoá tăng tốc phần thủ tục; nó không thay được phần tư duy quyết định cái gì đáng test.</p>`],
      [91, 'Question — when does test control take place?',
        `<p class="y-chinh">🎯 Test control is continuous — it can happen in every activity.</p>
<ul>
<li><strong>Like monitoring</strong> — control runs for the whole project.</li>
<li><strong>How</strong> — whenever monitoring shows a deviation, corrective action can be taken in any activity.</li>
</ul>` + AE('D — During all the activities', ''),
        `<p class="y-chinh">🎯 Test control diễn ra liên tục — có thể ở mọi hoạt động.</p>
<ul>
<li><strong>Cũng như monitoring</strong> — control chạy suốt dự án.</li>
<li><strong>Cách làm</strong> — hễ monitoring thấy lệch là có thể hành động khắc phục ở bất kỳ hoạt động nào.</li>
</ul>` + AV('D — Trong tất cả các hoạt động', '')],
      [92, 'Question — comparing planned with actual progress',
        `<p class="y-chinh">🎯 Comparing planned with actual progress is monitoring.</p>
<ul>
<li><strong>A — monitoring</strong> — compares.</li>
<li><strong>C — closure</strong> — the old name of completion.</li>
<li><strong>D — control</strong> — acts on the comparison.</li>
</ul>` + AE('A — Test monitoring', ''),
        `<p class="y-chinh">🎯 So tiến độ kế hoạch với thực tế là monitoring.</p>
<ul>
<li><strong>A — monitoring</strong> — so sánh.</li>
<li><strong>C — closure</strong> — tên cũ của completion.</li>
<li><strong>D — control</strong> — hành động dựa trên kết quả so sánh.</li>
</ul>` + AV('A — Test monitoring', '')],
      [93, 'Question — designing and prioritising test cases',
        `<p class="y-chinh">🎯 Test cases are the work product of design — "how to test".</p>` + AE('C — Test Design', ''),
        `<p class="y-chinh">🎯 Test case là sản phẩm của thiết kế — "test như thế nào".</p>` + AV('C — Test Design', '')],
      [94, 'Question — designing and prioritising test conditions',
        `<p class="y-chinh">🎯 Test conditions — "what to test" — come from analysing the test basis.</p>
<div class="pitfall">Do not be misled by the word "designing" in the question: conditions belong to analysis.</div>` + AE('B — Test Analysis', ''),
        `<p class="y-chinh">🎯 Test condition — "test cái gì" — đến từ phân tích test basis.</p>
<div class="pitfall">Đừng bị chữ "designing" trong câu hỏi đánh lừa: condition thuộc về analysis.</div>` + AV('B — Test Analysis', '')],
      [95, 'Question — checking all defect reports are closed',
        `<p class="y-chinh">🎯 Checking that defect reports are closed is one of the completion tasks on slide 88.</p>` + AE('D — Test Completion', ''),
        `<p class="y-chinh">🎯 Kiểm tra defect report đã đóng là một trong các việc của completion ở slide 88.</p>` + AV('D — Test Completion', '')],
      [96, 'Question — comparing actual with expected results',
        `<p class="y-chinh">🎯 Running tests and comparing actual with expected results is execution.</p>` + AE('D — Test Execution', ''),
        `<p class="y-chinh">🎯 Chạy test và so kết quả thực tế với mong đợi là execution.</p>` + AV('D — Test Execution', '')],
      [97, 'Question — developing and prioritising test procedures',
        `<p class="y-chinh">🎯 Procedures, suites and the execution schedule are built in implementation.</p>` + AE('C — Test Implementation', ''),
        `<p class="y-chinh">🎯 Procedure, suite và lịch thực thi được xây ở implementation.</p>` + AV('C — Test Implementation', '')],
      [98, 'Question — checking results and logs against coverage criteria',
        `<p class="y-chinh">🎯 Checking results against coverage criteria is evaluating exit criteria — a monitoring &amp; control task.</p>
<ul>
<li><strong>2018 syllabus</strong> — evaluating exit criteria (e.g. "is coverage ≥ the target?") belongs to monitoring &amp; control.</li>
<li><strong>Old 5-step process</strong> — it was the step "evaluating exit criteria and reporting".</li>
</ul>` + AE('A — Test Monitoring &amp; Control', ''),
        `<p class="y-chinh">🎯 Đối chiếu kết quả với tiêu chí bao phủ là đánh giá tiêu chí ra — việc của monitoring &amp; control.</p>
<ul>
<li><strong>Syllabus 2018</strong> — đánh giá tiêu chí ra (vd "coverage đã đạt mục tiêu chưa?") thuộc monitoring &amp; control.</li>
<li><strong>Quy trình 5 bước cũ</strong> — đó là bước "evaluating exit criteria and reporting".</li>
</ul>` + AV('A — Test Monitoring &amp; Control', '')],
    ]),
    walkHead('addl', 18, 26, 'These slides come from the “Additional Content” deck in the Slides folder and show a user-story card and the six parts of a test case.', 'Các slide này lấy từ bộ “Additional Content” trong thư mục Slides: một thẻ user story và sáu phần của một test case.'),
    walk('addl', [
      [18, 'How to write a user story?',
        `<p class="y-chinh">🎯 Title slide: how to write a user story.</p>
<p>A user story is a common <em>test basis</em> in Agile projects — you will design tests from it in Chapter 4 and in Topic 8 (Agile tester).</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề: cách viết một user story.</p>
<p>User story là <em>test basis</em> phổ biến trong dự án Agile — bạn sẽ thiết kế test từ nó ở Chương 4 và Topic 8 (Agile tester).</p>`],
      [19, 'User-story card template',
        `<p class="y-chinh">🎯 A user-story card has a fixed set of fields — and the acceptance criteria matter most to a tester.</p>
<p class="nhan">What is on the card</p>
<ul>
<li><strong>Story ID and title</strong></li>
<li><strong>The story</strong> — <em>"As a &lt;role&gt; I want &lt;some goal&gt; so that &lt;some reason&gt;"</em></li>
<li><strong>Importance and estimate</strong></li>
<li><strong>Acceptance criteria</strong> — "and I know I am done when…"</li>
<li><strong>Type</strong> — search, workflow, manage data, payment, report/view</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> each acceptance criterion becomes at least one test condition.</p>`,
        `<p class="y-chinh">🎯 Thẻ user story có một bộ trường cố định — và với tester, acceptance criteria là phần quan trọng nhất.</p>
<p class="nhan">Trên thẻ có gì</p>
<ul>
<li><strong>Mã và tên story</strong></li>
<li><strong>Câu story</strong> — <em>"As a &lt;vai trò&gt; I want &lt;mục tiêu&gt; so that &lt;lý do&gt;"</em></li>
<li><strong>Độ quan trọng và ước lượng</strong></li>
<li><strong>Tiêu chí chấp nhận (acceptance criteria)</strong> — "và tôi biết mình xong khi…"</li>
<li><strong>Loại</strong> — tìm kiếm, luồng nghiệp vụ, quản lý dữ liệu, thanh toán, báo cáo/xem</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> mỗi acceptance criterion thành ít nhất một test condition.</p>`],
      [20, 'How to write a test case?',
        `<p class="y-chinh">🎯 Title slide for the six-part anatomy of a test case that follows (slides 21–26).</p>`,
        `<p class="y-chinh">🎯 Slide tiêu đề cho phần giải phẫu sáu mục của một test case ngay sau (slide 21–26).</p>`],
      [21, '1 — Title (can be the test condition)',
        `<p class="y-chinh">🎯 Part 1 — the title states the condition being tested.</p>
<ul>
<li><strong>Example</strong> — "Check login with a valid user name and password".</li>
<li><strong>Rule</strong> — specific enough that two test cases never share one title.</li>
</ul>`,
        `<p class="y-chinh">🎯 Phần 1 — tên nêu điều kiện đang test.</p>
<ul>
<li><strong>Ví dụ</strong> — "Kiểm tra đăng nhập với tên đăng nhập và mật khẩu hợp lệ".</li>
<li><strong>Quy tắc</strong> — đủ cụ thể để hai test case không bao giờ trùng tên.</li>
</ul>`],
      [22, '2 — Test steps',
        `<p class="y-chinh">🎯 Part 2 — numbered steps, one action per step.</p>
<ol>
<li>Open the site</li>
<li>Enter the email</li>
<li>Enter the password</li>
<li>Click submit</li>
</ol>
<p>Anyone should be able to repeat them without asking you.</p>`,
        `<p class="y-chinh">🎯 Phần 2 — các bước đánh số, mỗi bước một hành động.</p>
<ol>
<li>Mở trang</li>
<li>Nhập email</li>
<li>Nhập mật khẩu</li>
<li>Bấm submit</li>
</ol>
<p>Ai cũng phải làm lại được mà không cần hỏi bạn.</p>`],
      [23, '3 — Test data',
        `<p class="y-chinh">🎯 Part 3 — the concrete values the steps use.</p>
<ul>
<li><strong>Email</strong> — <code>abc@xyz.com</code></li>
<li><strong>Password</strong> — <code>123456</code></li>
</ul>
<p>Keeping data separate from steps lets you reuse the same steps with many data rows (data-driven testing, Chapter 6).</p>`,
        `<p class="y-chinh">🎯 Phần 3 — các giá trị cụ thể mà các bước dùng.</p>
<ul>
<li><strong>Email</strong> — <code>abc@xyz.com</code></li>
<li><strong>Mật khẩu</strong> — <code>123456</code></li>
</ul>
<p>Tách dữ liệu khỏi các bước giúp dùng lại cùng các bước với nhiều dòng dữ liệu (data-driven testing, Chương 6).</p>`],
      [24, '4 — Expected result',
        `<p class="y-chinh">🎯 Part 4 — the expected result, written <em>before</em> execution.</p>
<ul>
<li><strong>Example</strong> — "Login is successful and the home page opens."</li>
<li><strong>Why before</strong> — without it nobody can decide pass or fail.</li>
</ul>`,
        `<p class="y-chinh">🎯 Phần 4 — kết quả mong đợi, viết <em>trước</em> khi thực thi.</p>
<ul>
<li><strong>Ví dụ</strong> — "Đăng nhập thành công và mở trang chủ."</li>
<li><strong>Vì sao viết trước</strong> — thiếu nó thì không ai quyết được pass hay fail.</li>
</ul>`],
      [25, '5 — Actual result',
        `<p class="y-chinh">🎯 Part 5 — the actual result stays empty until execution.</p>
<ul>
<li><strong>The slide's reminder</strong> — "remember: we are still designing the test case".</li>
<li><strong>Red flag</strong> — a pre-filled actual result in a Lab or PE submission.</li>
</ul>`,
        `<p class="y-chinh">🎯 Phần 5 — actual result để trống tới lúc thực thi.</p>
<ul>
<li><strong>Slide nhắc</strong> — "nhớ rằng ta vẫn đang thiết kế test case".</li>
<li><strong>Dấu hiệu xấu</strong> — điền sẵn actual result trong bài Lab hay PE.</li>
</ul>`],
      [26, '6 — Status (Pass / Fail / Blocked)',
        `<p class="y-chinh">🎯 Part 6 — the status (Pass / Fail / Blocked), also empty until execution.</p>
<ul>
<li><strong>Blocked</strong> — the test cannot be run because a precondition failed or another defect prevents reaching the step (e.g. the login page itself does not load).</li>
</ul>`,
        `<p class="y-chinh">🎯 Phần 6 — trạng thái (Pass / Fail / Blocked), cũng để trống tới lúc thực thi.</p>
<ul>
<li><strong>Blocked</strong> — không chạy được test vì điều kiện tiên quyết hỏng hoặc defect khác chặn không cho tới bước đó (vd trang đăng nhập không mở được).</li>
</ul>`],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — from requirement to traceability matrix</h3>
<p><strong>Requirement R3</strong> (test basis): "A withdrawal is allowed only if the amount ≤ balance and the amount is a positive multiple of 50,000₫."</p>
<ol>
<li><strong>Analysis → test conditions</strong> (what):
<ul>
<li>COND-1 — amount vs balance</li>
<li>COND-2 — amount must be positive</li>
<li>COND-3 — multiple of 50,000</li>
</ul></li>
<li><strong>Design → test cases</strong> (how), balance = 200,000:
<ul>
<li>TC01 — amount 150,000 → allowed</li>
<li>TC02 — 250,000 → rejected (exceeds balance)</li>
<li>TC03 — 30,000 → rejected (not a multiple)</li>
<li>TC04 — 0 → rejected (not positive)</li>
<li>TC05 — 200,000 → allowed (equal to balance — a boundary)</li>
</ul></li>
<li><strong>Implementation → procedure &amp; suite</strong>: "log in as customer C1 with balance 200,000 → open Withdraw → enter amount → confirm"; the five cases form suite <em>S-Withdraw</em>, scheduled after the login suite.</li>
</ol>
<table>
<thead><tr><th>Requirement</th><th>Condition</th><th>Test cases</th><th>Last result</th></tr></thead>
<tbody>
<tr><td rowspan="3">R3</td><td>COND-1 amount ≤ balance</td><td>TC01, TC02, TC05</td><td>Pass / Fail (#D-17) / Pass</td></tr>
<tr><td>COND-2 positive</td><td>TC04</td><td>Pass</td></tr>
<tr><td>COND-3 multiple of 50,000</td><td>TC03</td><td>Pass</td></tr>
</tbody>
</table>
<p><strong>Why traceability pays (LO-1.4.4):</strong> reading the matrix forward tells you the coverage of R3 (3/3 conditions covered); reading it backwards from defect D-17 tells you which requirement is at risk; if R3 changes, you know exactly which five tests to update — that is impact analysis.</p>
<div class="pitfall co-tieu-de"><strong>The three confusions examiners love.</strong> Test condition (what) ≠ test case (how, with data and expected result) ≠ test procedure (the order of steps to run one or more cases). "Design the environment" is design; "build the environment" is implementation.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>ISO/IEC/IEEE 29119 and real test-management tools.</strong>
<ul>
<li><strong>Standards</strong> — the document names used here (test plan, test case specification, test summary report) come from IEEE 829, which ISO/IEC/IEEE 29119-3 replaced in 2013; 29119-2 defines the processes.</li>
<li><strong>Tools</strong> — in industry the traceability matrix is rarely a spreadsheet: Jira with Xray or Zephyr, TestRail or Azure Test Plans link requirements, test cases, runs and defects automatically and draw coverage reports.</li>
</ul>
<p class="ghi-chu">Outside the syllabus because CTFL only names the concepts, not the standards and tools that implement them.</p></div>`,
    `<h3>Ví dụ có lời giải · Từ yêu cầu tới bảng truy vết</h3>
<p><strong>Yêu cầu R3</strong> (test basis): "Cho phép rút tiền chỉ khi số tiền ≤ số dư và là bội số dương của 50.000₫."</p>
<ol>
<li><strong>Analysis → test condition</strong> (test cái gì):
<ul>
<li>COND-1 — số tiền so với số dư</li>
<li>COND-2 — số tiền phải dương</li>
<li>COND-3 — là bội của 50.000</li>
</ul></li>
<li><strong>Design → test case</strong> (test thế nào), số dư = 200.000:
<ul>
<li>TC01 — rút 150.000 → cho phép</li>
<li>TC02 — 250.000 → từ chối (vượt số dư)</li>
<li>TC03 — 30.000 → từ chối (không phải bội)</li>
<li>TC04 — 0 → từ chối (không dương)</li>
<li>TC05 — 200.000 → cho phép (bằng số dư — giá trị biên)</li>
</ul></li>
<li><strong>Implementation → procedure &amp; suite</strong>: "đăng nhập khách hàng C1 có số dư 200.000 → mở Rút tiền → nhập số tiền → xác nhận"; năm ca gom thành suite <em>S-Withdraw</em>, xếp lịch chạy sau suite đăng nhập.</li>
</ol>
<table>
<thead><tr><th>Yêu cầu</th><th>Condition</th><th>Test case</th><th>Kết quả gần nhất</th></tr></thead>
<tbody>
<tr><td rowspan="3">R3</td><td>COND-1 số tiền ≤ số dư</td><td>TC01, TC02, TC05</td><td>Pass / Fail (#D-17) / Pass</td></tr>
<tr><td>COND-2 số dương</td><td>TC04</td><td>Pass</td></tr>
<tr><td>COND-3 bội 50.000</td><td>TC03</td><td>Pass</td></tr>
</tbody>
</table>
<p><strong>Vì sao truy vết có giá trị (LO-1.4.4):</strong> đọc bảng theo chiều xuôi cho biết coverage của R3 (3/3 condition đã được phủ); đọc ngược từ defect D-17 biết yêu cầu nào đang gặp rủi ro; nếu R3 thay đổi, bạn biết chính xác năm test cần sửa — đó là phân tích tác động (impact analysis).</p>
<div class="pitfall co-tieu-de"><strong>Ba cặp nhầm lẫn giám khảo rất thích.</strong> Test condition (cái gì) ≠ test case (thế nào, có dữ liệu và kết quả mong đợi) ≠ test procedure (trình tự bước để chạy một hay nhiều case). "Thiết kế môi trường" là design; "dựng môi trường" là implementation.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>ISO/IEC/IEEE 29119 và công cụ quản lý test thực tế.</strong>
<ul>
<li><strong>Chuẩn</strong> — tên các tài liệu dùng ở đây (test plan, test case specification, test summary report) đến từ IEEE 829, đã được ISO/IEC/IEEE 29119-3 thay thế năm 2013; 29119-2 định nghĩa các quy trình.</li>
<li><strong>Công cụ</strong> — ngoài doanh nghiệp, bảng truy vết hiếm khi là file Excel: Jira kèm Xray hay Zephyr, TestRail, Azure Test Plans tự liên kết yêu cầu, test case, lần chạy và defect rồi vẽ báo cáo coverage.</li>
</ul>
<p class="ghi-chu">Ngoài giáo trình vì CTFL chỉ nêu khái niệm, không nêu chuẩn và công cụ hiện thực chúng.</p></div>`),
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
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li><strong>LO-1.5.1</strong> — Identify the psychological factors that influence the success of testing (K1)</li>
<li><strong>LO-1.5.2</strong> — Explain the difference between the mindset required for test activities and for development activities (K2)</li>
</ul>
<p>The code of ethics was part of the 2011 syllabus; your deck still teaches it, so learn the eight names.</p></div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.5 · SWT1 slide 99–114</span>
<h2>Tâm lý kiểm thử và quy tắc đạo đức</h2>
<p class="lead">Kiểm thử do con người làm và kết quả cũng do con người đọc. Tìm ra defect giống như chê bai, tác giả thì mù với lỗi của chính mình, và tin xấu chẳng ai muốn nghe. Bài này giải thích vì sao <strong>tính độc lập</strong> giúp ích, cách <strong>báo lỗi mà không gây xung đột</strong>, và tám nguyên tắc trong <strong>bộ quy tắc đạo đức ISTQB</strong>.</p>
<div class="callout"><strong>Chuẩn đầu ra.</strong>
<ul>
<li><strong>LO-1.5.1</strong> — Nhận diện các yếu tố tâm lý ảnh hưởng tới thành công của kiểm thử (K1)</li>
<li><strong>LO-1.5.2</strong> — Giải thích khác biệt giữa tư duy cần cho hoạt động kiểm thử và cho hoạt động phát triển (K2)</li>
</ul>
<p>Quy tắc đạo đức nằm trong syllabus 2011; slide của lớp vẫn dạy nên hãy thuộc tám tên gọi.</p></div>`),
    walkHead(D, 99, 114),
    walk(D, [
      [99, 'CONTENT — Psychology of testing',
        `<p class="y-chinh">🎯 Fifth block of the chapter: the human side of testing.</p>`,
        `<p class="y-chinh">🎯 Khối thứ năm của chương: khía cạnh con người của kiểm thử.</p>`],
      [100, 'Why test? (✓ / ✗)',
        `<p class="y-chinh">🎯 One cross among six ticks — exactly the kind of "which is NOT a reason" question the FE likes.</p>
<p class="nhan">✓ Reasons to test</p>
<ul>
<li>Build confidence</li>
<li>Demonstrate conformance to requirements</li>
<li>Find faults</li>
<li>Reduce costs</li>
<li>Show the system meets user needs</li>
<li>Assess the software quality</li>
</ul>
<p class="nhan">✗ Not a reason</p>
<ul>
<li><strong>Prove that the software is correct</strong> — impossible (Principle 1).</li>
</ul>`,
        `<p class="y-chinh">🎯 Một dấu chéo giữa sáu dấu tích — đúng dạng câu "đâu KHÔNG phải lý do" mà đề FE hay ra.</p>
<p class="nhan">✓ Lý do để kiểm thử</p>
<ul>
<li>Tạo niềm tin</li>
<li>Chứng tỏ tuân thủ yêu cầu</li>
<li>Tìm lỗi</li>
<li>Giảm chi phí</li>
<li>Cho thấy hệ thống đáp ứng nhu cầu người dùng</li>
<li>Đánh giá chất lượng phần mềm</li>
</ul>
<p class="nhan">✗ Không phải lý do</p>
<ul>
<li><strong>Chứng minh phần mềm đúng</strong> — bất khả (Nguyên tắc 1).</li>
</ul>`],
      [101, 'Assessing software quality',
        `<p class="y-chinh">🎯 "Few faults found" only means good software if the tests themselves are good.</p>
<p>Two axes: <em>software quality</em> (horizontal) and <em>test quality</em> (vertical).</p>
<ul>
<li><strong>High-quality tests, few faults</strong> — really indicates good software ("you think you are here").</li>
<li><strong>Low-quality tests, few faults</strong> — only means the tests were weak; the software may be poor ("you may be here").</li>
</ul>
<p class="nhan">The trap, named in the speaker note</p>
<p><em>Developers' perspective — confirmation bias</em>: we believe the result that confirms what we hoped.</p>
<p class="meo">🧠 <strong>Remember:</strong> never judge quality by the defect count without judging the tests.</p>`,
        `<p class="y-chinh">🎯 "Tìm được ít lỗi" chỉ nghĩa là phần mềm tốt khi chính bộ test tốt.</p>
<p>Hai trục: <em>chất lượng phần mềm</em> (ngang) và <em>chất lượng test</em> (dọc).</p>
<ul>
<li><strong>Test chất lượng cao, ít lỗi</strong> — thực sự cho thấy phần mềm tốt ("bạn nghĩ bạn ở đây").</li>
<li><strong>Test kém, ít lỗi</strong> — chỉ cho thấy test yếu; phần mềm có thể tệ ("bạn có thể đang ở đây").</li>
</ul>
<p class="nhan">Cái bẫy, được gọi tên trong ghi chú của thầy/cô</p>
<p><em>Góc nhìn của developer — confirmation bias</em>: ta tin kết quả khẳng định điều mình mong.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đừng bao giờ đánh giá chất lượng bằng số lỗi mà không đánh giá bộ test.</p>`],
      [102, 'Independence — testing your own work',
        `<p class="y-chinh">🎯 Testing your own work finds only about <strong>30–50%</strong> of your own faults.</p>
<p class="nhan">Why</p>
<ul>
<li><strong>Same assumptions</strong> — you share the same assumptions and thought processes.</li>
<li><strong>You see what you meant</strong> — or want to see, not what is there.</li>
<li><strong>Emotional attachment</strong> — you don't want to find faults, or actively want NOT to find them.</li>
</ul>`,
        `<p class="y-chinh">🎯 Tự test sản phẩm của mình chỉ tìm được khoảng <strong>30–50%</strong> lỗi của chính mình.</p>
<p class="nhan">Vì sao</p>
<ul>
<li><strong>Cùng giả định</strong> — bạn mang cùng giả định và lối nghĩ.</li>
<li><strong>Thấy điều mình định viết</strong> — hoặc muốn thấy, chứ không phải điều thật sự có.</li>
<li><strong>Gắn bó cảm xúc</strong> — không muốn tìm ra lỗi, hoặc chủ động KHÔNG muốn tìm ra.</li>
</ul>`],
      [103, 'Levels of independence',
        `<p class="y-chinh">🎯 Five levels of independence, from least to most independent.</p>
<ol>
<li><strong>None</strong> — tests designed by the person who wrote the software.</li>
<li><strong>Another developer</strong> — a different person within the development team.</li>
<li><strong>Another team</strong> — a different department or team (e.g. a test team).</li>
<li><strong>Another organisation</strong> — e.g. an agency or a certification body.</li>
<li><strong>A tool</strong> — tests generated by a tool: independent of human bias, but possibly low quality.</li>
</ol>
<p>More independence finds more defects, but costs communication and knowledge of the product (pros and cons in Chapter 5).</p>`,
        `<p class="y-chinh">🎯 Năm mức độc lập, từ ít đến nhiều.</p>
<ol>
<li><strong>Không độc lập</strong> — chính tác giả phần mềm tự thiết kế test.</li>
<li><strong>Developer khác</strong> — người khác trong cùng nhóm phát triển.</li>
<li><strong>Nhóm khác</strong> — phòng ban hoặc nhóm khác (vd nhóm test).</li>
<li><strong>Tổ chức khác</strong> — vd công ty dịch vụ, tổ chức chứng nhận.</li>
<li><strong>Công cụ</strong> — test do công cụ sinh ra: không mang thiên kiến của người, nhưng có thể chất lượng thấp.</li>
</ol>
<p>Càng độc lập càng tìm ra nhiều lỗi, nhưng tốn công giao tiếp và hiểu biết về sản phẩm (ưu nhược điểm ở Chương 5).</p>`],
      [104, 'Human Psychology & Testing',
        `<p class="y-chinh">🎯 Finding defects triggers human reactions — know them so you can defuse them.</p>
<ul>
<li><strong>Criticism</strong> — identifying defects may be perceived as criticism of the product and its author.</li>
<li><strong>Confirmation bias</strong> — makes it hard to accept information that disagrees with current beliefs.</li>
<li><strong>Other cognitive biases</strong> — make test results hard to understand or accept.</li>
<li><strong>Blame the messenger</strong> — people tend to blame the bearer of bad news.</li>
<li><strong>"Destructive"</strong> — some see testing as a destructive activity.</li>
</ul>
<p class="nhan">The remedy (the arrow on the slide)</p>
<p>The right attitude, and communication in a constructive way.</p>`,
        `<p class="y-chinh">🎯 Tìm ra defect gây phản ứng tâm lý — biết trước để hoá giải.</p>
<ul>
<li><strong>Bị xem là chỉ trích</strong> — việc chỉ ra defect dễ bị xem là chỉ trích sản phẩm và tác giả.</li>
<li><strong>Confirmation bias (thiên kiến xác nhận)</strong> — khiến người ta khó chấp nhận thông tin trái với niềm tin hiện có.</li>
<li><strong>Thiên kiến nhận thức khác</strong> — khiến kết quả test khó hiểu hoặc khó chấp nhận.</li>
<li><strong>Đổ lỗi cho người đưa tin</strong> — người ta có xu hướng đổ lỗi cho người mang tin xấu.</li>
<li><strong>"Phá hoại"</strong> — có người coi kiểm thử là hoạt động phá hoại.</li>
</ul>
<p class="nhan">Cách chữa (mũi tên trên slide)</p>
<p>Thái độ đúng, và giao tiếp mang tính xây dựng.</p>`],
      [105, 'Attitudes & Communications',
        `<p class="y-chinh">🎯 Six habits for reporting defects without starting a war.</p>
<ol>
<li><strong>Collaboration, not battles</strong> — remind everyone of the common goal of better quality.</li>
<li><strong>Emphasise the benefits</strong> — authors improve their work and skills; the organisation saves time and money and reduces risk.</li>
<li><strong>Neutral, fact-focused</strong> — communicate findings without criticising the person.</li>
<li><strong>Objective, factual</strong> — defect reports and review findings.</li>
<li><strong>Understand how the other person feels</strong> — and why they may react negatively.</li>
<li><strong>Confirm</strong> — that you understood each other.</li>
</ol>
<p class="nhan">Compare</p>
<ul>
<li>✗ "Your login code is garbage, it crashes all the time"</li>
<li>✓ "Login returns HTTP 500 when the password contains '#'; steps attached; reproduced 5/5 on build 1.4.2."</li>
</ul>`,
        `<p class="y-chinh">🎯 Sáu thói quen để báo lỗi mà không gây chiến.</p>
<ol>
<li><strong>Hợp tác, không phải chiến tranh</strong> — nhắc mọi người mục tiêu chung là chất lượng tốt hơn.</li>
<li><strong>Nhấn mạnh lợi ích</strong> — tác giả cải thiện sản phẩm và tay nghề; tổ chức tiết kiệm thời gian, tiền và giảm rủi ro.</li>
<li><strong>Trung lập, dựa trên sự kiện</strong> — trao đổi phát hiện mà không chỉ trích con người.</li>
<li><strong>Khách quan, đúng sự thật</strong> — trong defect report và kết quả review.</li>
<li><strong>Hiểu cảm xúc của người kia</strong> — và lý do họ có thể phản ứng tiêu cực.</li>
<li><strong>Xác nhận</strong> — hai bên đã hiểu nhau.</li>
</ol>
<p class="nhan">So sánh</p>
<ul>
<li>✗ "Code đăng nhập của bạn dở tệ, crash suốt"</li>
<li>✓ "Đăng nhập trả HTTP 500 khi mật khẩu chứa ký tự '#'; đã đính kèm các bước; tái hiện 5/5 lần trên build 1.4.2."</li>
</ul>`],
      [106, 'A traditional testing approach',
        `<p class="y-chinh">🎯 The traditional approach tries to show the system works — and leaves faults in.</p>
<ul>
<li><strong>Show that the system</strong> — does what it should, and doesn't do what it shouldn't.</li>
<li><strong>Goal</strong> — show it working.</li>
<li><strong>Success</strong> — the system works.</li>
<li><strong>Fastest route</strong> — <strong>easy test cases</strong>.</li>
<li><strong>Result</strong> — <strong>faults left in</strong>.</li>
</ul>`,
        `<p class="y-chinh">🎯 Cách truyền thống cố chứng minh hệ thống chạy — và để sót lỗi.</p>
<ul>
<li><strong>Chứng minh hệ thống</strong> — làm điều nó phải làm, và không làm điều không được làm.</li>
<li><strong>Mục tiêu</strong> — cho thấy nó chạy.</li>
<li><strong>Thành công</strong> — hệ thống chạy.</li>
<li><strong>Cách nhanh nhất</strong> — <strong>test case dễ</strong>.</li>
<li><strong>Kết quả</strong> — <strong>lỗi còn sót lại</strong>.</li>
</ul>`],
      [107, 'A better testing approach',
        `<p class="y-chinh">🎯 The better approach tries to make the system fail — and leaves fewer faults in.</p>
<ul>
<li><strong>Show that the system</strong> — <em>does what it shouldn't</em>, and <em>doesn't do what it should</em>.</li>
<li><strong>Goal</strong> — find faults.</li>
<li><strong>Success</strong> — the system fails: a test that finds a fault is a successful test.</li>
<li><strong>Fastest route</strong> — <strong>difficult test cases</strong>.</li>
<li><strong>Result</strong> — <strong>fewer faults left in</strong>.</li>
</ul>
<p>This is the tester's mindset of LO-1.5.2: curiosity, professional pessimism, a critical eye.</p>`,
        `<p class="y-chinh">🎯 Cách tốt hơn cố làm hệ thống hỏng — và để sót ít lỗi hơn.</p>
<ul>
<li><strong>Chứng minh hệ thống</strong> — <em>làm điều không được làm</em>, và <em>không làm điều phải làm</em>.</li>
<li><strong>Mục tiêu</strong> — tìm lỗi.</li>
<li><strong>Thành công</strong> — hệ thống hỏng: test tìm ra lỗi là test thành công.</li>
<li><strong>Cách nhanh nhất</strong> — <strong>test case khó</strong>.</li>
<li><strong>Kết quả</strong> — <strong>ít lỗi sót lại hơn</strong>.</li>
</ul>
<p>Đây là tư duy của tester trong LO-1.5.2: tò mò, "bi quan chuyên nghiệp", con mắt phê phán.</p>`],
      [108, 'The testing paradox',
        `<p class="y-chinh">🎯 The best way to build confidence is to try to destroy it.</p>
<p class="nhan">The paradox</p>
<ol>
<li>Purpose of testing: to find faults.</li>
<li>Finding faults destroys confidence.</li>
<li>So is the purpose of testing to destroy confidence?</li>
</ol>
<p class="nhan">The resolution in the box</p>
<p>No. Software that survived serious attempts to break it deserves more trust than software nobody tried hard to break.</p>`,
        `<p class="y-chinh">🎯 Cách tốt nhất để xây niềm tin là cố gắng phá nó.</p>
<p class="nhan">Nghịch lý</p>
<ol>
<li>Mục đích kiểm thử: tìm lỗi.</li>
<li>Tìm ra lỗi thì phá hỏng niềm tin.</li>
<li>Vậy mục đích kiểm thử là phá niềm tin sao?</li>
</ol>
<p class="nhan">Lời giải trong khung</p>
<p>Không. Phần mềm đã sống sót qua những nỗ lực nghiêm túc để làm nó hỏng đáng tin hơn phần mềm chưa ai cố làm hỏng.</p>`],
      [109, 'Who wants to be a tester?',
        `<p class="y-chinh">🎯 The honest downsides of the job.</p>
<ul>
<li><strong>A "destructive" process</strong></li>
<li><strong>Bringing bad news</strong> — "your baby is ugly".</li>
<li><strong>The worst time pressure</strong> — testing is squeezed at the end.</li>
<li><strong>A different mindset</strong> — "what if it isn't?", "what could go wrong?".</li>
<li><strong>Communicating faults</strong> — how, to authors and managers? Answered by slide 105.</li>
</ul>`,
        `<p class="y-chinh">🎯 Mặt trái thật thà của nghề.</p>
<ul>
<li><strong>Công việc "phá hoại"</strong></li>
<li><strong>Mang tin xấu</strong> — "con của anh xấu lắm".</li>
<li><strong>Áp lực thời gian tệ nhất</strong> — kiểm thử bị ép ở cuối.</li>
<li><strong>Một lối nghĩ khác</strong> — "nếu không phải thế thì sao?", "cái gì có thể hỏng?".</li>
<li><strong>Báo lỗi thế nào</strong> — cho tác giả, cho quản lý? Đã trả lời ở slide 105.</li>
</ul>`],
      [110, 'Testers have the right to…',
        `<p class="y-chinh">🎯 Nine rights of a tester.</p>
<ul>
<li><strong>Accurate information</strong> — about progress and changes.</li>
<li><strong>Insight from developers</strong> — about areas of the software.</li>
<li><strong>Tested code</strong> — delivered tested to an agreed standard.</li>
<li><strong>Be regarded as a professional</strong> — no abuse.</li>
<li><strong>Find faults</strong></li>
<li><strong>Challenge</strong> — specifications and test plans.</li>
<li><strong>Be taken seriously</strong> — reported faults, even non-reproducible ones.</li>
<li><strong>Make predictions</strong> — about future fault levels.</li>
<li><strong>Improve</strong> — their own testing process.</li>
</ul>`,
        `<p class="y-chinh">🎯 Chín quyền của tester.</p>
<ul>
<li><strong>Thông tin chính xác</strong> — về tiến độ và thay đổi.</li>
<li><strong>Hiểu biết từ developer</strong> — về các phần của phần mềm.</li>
<li><strong>Code đã được test</strong> — tới mức đã thoả thuận.</li>
<li><strong>Được đối xử như người chuyên nghiệp</strong> — không bị xúc phạm.</li>
<li><strong>Được tìm lỗi</strong></li>
<li><strong>Được chất vấn</strong> — đặc tả và test plan.</li>
<li><strong>Được coi trọng</strong> — các lỗi đã báo, kể cả lỗi khó tái hiện.</li>
<li><strong>Được dự báo</strong> — về mức lỗi tương lai.</li>
<li><strong>Được cải tiến</strong> — quy trình test của mình.</li>
</ul>`],
      [111, 'Testers have the responsibility to…',
        `<p class="y-chinh">🎯 Seven responsibilities of a tester.</p>
<ul>
<li><strong>Follow</strong> — the test plans, scripts etc. as documented.</li>
<li><strong>Report objectively</strong> — faults reported factually, no abuse.</li>
<li><strong>Check the tests are correct before reporting software faults</strong> — avoid false positives.</li>
<li><strong>Remember</strong> — it is the software, not the programmer, that is being tested.</li>
<li><strong>Assess risk objectively</strong></li>
<li><strong>Prioritise</strong> — what is reported.</li>
<li><strong>Communicate the truth</strong></li>
</ul>`,
        `<p class="y-chinh">🎯 Bảy trách nhiệm của tester.</p>
<ul>
<li><strong>Làm theo</strong> — test plan, kịch bản… đã ghi.</li>
<li><strong>Báo lỗi khách quan</strong> — đúng sự thật, không xúc phạm.</li>
<li><strong>Kiểm tra test của mình đúng trước khi báo lỗi phần mềm</strong> — tránh false positive.</li>
<li><strong>Nhớ rằng</strong> — thứ đang được test là phần mềm, không phải lập trình viên.</li>
<li><strong>Đánh giá rủi ro khách quan</strong></li>
<li><strong>Ưu tiên</strong> — những gì cần báo.</li>
<li><strong>Nói sự thật</strong></li>
</ul>`],
      [112, 'CONTENT — Code of Ethics',
        `<p class="y-chinh">🎯 Last block of the chapter: the code of ethics.</p>`,
        `<p class="y-chinh">🎯 Khối cuối của chương: quy tắc đạo đức.</p>`],
      [113, 'Code of Ethics (1/2)',
        `<p class="y-chinh">🎯 ISTQB code of ethics, principles 1–4.</p>
<ol>
<li><strong>Public</strong> — act consistently with the public interest.</li>
<li><strong>Client &amp; employer</strong> — act in their best interests, consistent with the public interest.</li>
<li><strong>Product</strong> — ensure your deliverables meet the highest professional standards possible.</li>
<li><strong>Judgment</strong> — maintain integrity and independence in professional judgment.</li>
</ol>`,
        `<p class="y-chinh">🎯 Bộ quy tắc đạo đức ISTQB, nguyên tắc 1–4.</p>
<ol>
<li><strong>Public (công chúng)</strong> — hành động phù hợp lợi ích công chúng.</li>
<li><strong>Client &amp; employer (khách hàng &amp; chủ lao động)</strong> — hành động vì lợi ích tốt nhất của họ, nhưng không trái lợi ích công chúng.</li>
<li><strong>Product (sản phẩm)</strong> — bảo đảm sản phẩm bàn giao đạt chuẩn nghề nghiệp cao nhất có thể.</li>
<li><strong>Judgment (phán đoán)</strong> — giữ chính trực và độc lập trong phán đoán chuyên môn.</li>
</ol>`],
      [114, 'Code of Ethics (2/2)',
        `<p class="y-chinh">🎯 ISTQB code of ethics, principles 5–8.</p>
<ol start="5">
<li><strong>Management</strong> — test managers and leaders promote an ethical approach to managing testing.</li>
<li><strong>Profession</strong> — advance the integrity and reputation of the profession.</li>
<li><strong>Colleagues</strong> — be fair to and supportive of colleagues, and cooperate with developers.</li>
<li><strong>Self</strong> — lifelong learning and an ethical approach to practice.</li>
</ol>
<p class="meo">🧠 <strong>Remember all eight:</strong> <em>Public, Client, Product, Judgment, Management, Profession, Colleagues, Self</em>.</p>
<p class="ghi-chu">Adapted from the ACM/IEEE Software Engineering Code of Ethics.</p>`,
        `<p class="y-chinh">🎯 Bộ quy tắc đạo đức ISTQB, nguyên tắc 5–8.</p>
<ol start="5">
<li><strong>Management (quản lý)</strong> — trưởng nhóm và quản lý test thúc đẩy cách quản lý kiểm thử có đạo đức.</li>
<li><strong>Profession (nghề nghiệp)</strong> — nâng cao sự chính trực và uy tín của nghề.</li>
<li><strong>Colleagues (đồng nghiệp)</strong> — công bằng, hỗ trợ đồng nghiệp, và hợp tác với developer.</li>
<li><strong>Self (bản thân)</strong> — học tập suốt đời và hành nghề có đạo đức.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ tám mục:</strong> <em>Công chúng – Khách hàng – Sản phẩm – Phán đoán – Quản lý – Nghề – Đồng nghiệp – Bản thân</em>.</p>
<p class="ghi-chu">Chuyển thể từ bộ quy tắc đạo đức kỹ nghệ phần mềm ACM/IEEE.</p>`],
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
<p>The glossary terms you are expected to recognise after Chapter 1, in the slide's three groups:</p>
<ul>
<li>bug, defect, error, failure, fault, mistake, quality, risk, software, testing, exhaustive testing</li>
<li>code, debugging, requirement, review, test basis, test case, test objective</li>
<li>confirmation testing, exit criteria, incident, regression testing, test condition, test coverage, test data, test execution, test log, test plan, test strategy, test summary report, testware</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Mindset question trap.</strong> "Developers and testers should have the same mindset" — false.
<ul>
<li><strong>Developers</strong> — focused on building a solution (constructive, confirming it works).</li>
<li><strong>Testers</strong> — focused on finding what can go wrong (curiosity, professional pessimism).</li>
</ul>
<p>The syllabus adds that the two mindsets can be combined in one person — which is why independent testing still adds value.</p></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>Blameless post-mortems.</strong>
<ul>
<li><strong>The practice</strong> — Google's Site Reliability Engineering writes up every serious incident <em>without naming a culprit</em>.</li>
<li><strong>The question asked</strong> — what in the system and process allowed the mistake, not who made it.</li>
<li><strong>Why it works</strong> — it is slide 105 applied at company scale: people report problems early when they do not fear punishment, and root-cause analysis (lesson 1.2) gets honest input.</li>
</ul>
<p class="ghi-chu">Outside the syllabus because CTFL stops at individual communication habits.</p></div>`,
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
<p>Các thuật ngữ trong glossary bạn cần nhận ra sau Chương 1, theo ba nhóm của slide:</p>
<ul>
<li>bug, defect, error, failure, fault, mistake, quality, risk, software, testing, exhaustive testing</li>
<li>code, debugging, requirement, review, test basis, test case, test objective</li>
<li>confirmation testing, exit criteria, incident, regression testing, test condition, test coverage, test data, test execution, test log, test plan, test strategy, test summary report, testware</li>
</ul>
<div class="pitfall co-tieu-de"><strong>Bẫy câu hỏi về tư duy.</strong> "Developer và tester nên có cùng một tư duy" — sai.
<ul>
<li><strong>Developer</strong> — tập trung xây giải pháp (xây dựng, khẳng định nó chạy).</li>
<li><strong>Tester</strong> — tập trung tìm cái có thể hỏng (tò mò, bi quan chuyên nghiệp).</li>
</ul>
<p>Syllabus nói thêm hai tư duy có thể cùng tồn tại trong một người — vì vậy kiểm thử độc lập vẫn có giá trị.</p></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Post-mortem không đổ lỗi (blameless).</strong>
<ul>
<li><strong>Cách làm</strong> — mô hình Site Reliability Engineering của Google viết báo cáo mỗi sự cố nghiêm trọng <em>mà không nêu tên thủ phạm</em>.</li>
<li><strong>Câu hỏi đặt ra</strong> — điều gì trong hệ thống và quy trình đã cho phép sai sót xảy ra, chứ không hỏi ai làm sai.</li>
<li><strong>Vì sao hiệu quả</strong> — đó là slide 105 áp dụng ở quy mô công ty: người ta báo vấn đề sớm khi không sợ bị phạt, và phân tích nguyên nhân gốc (bài 1.2) nhận được dữ liệu trung thực.</li>
</ul>
<p class="ghi-chu">Ngoài giáo trình vì CTFL chỉ dừng ở thói quen giao tiếp cá nhân.</p></div>`),
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
