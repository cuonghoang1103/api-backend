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
 *   1.6 The older 2023 deck SWT1.ppt ('oswt1', 70 pages): only the pages the
 *       current deck lacks (reliability, planning levels, the old test process)
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

/* ─────────────── 1.6 More from the 2023 slide set (SWT1.ppt, deck 'oswt1') ─────────────── */
const O = 'oswt1';
const L16 = {
  title: '1.6 — More from the 2023 slide set: reliability, test planning levels, the old test process|||1.6 — Bổ sung từ bộ slide 2023: độ tin cậy, các cấp lập kế hoạch, quy trình test cũ',
  slug: 'swt301-ch1-slides-2023',
  type: 'VIDEO',
  description: 'Bộ slide SWT1 năm 2023 (70 trang): những trang bài 1.1–1.5 chưa có — reliability vs fault, testing & quality, glossary, test policy / strategy / plan theo cấp, quy trình cũ specification → execution → recording → check completion, biểu đồ niềm tin — kèm bảng đổi thuật ngữ cũ sang CTFL hiện hành.',
  content: [
    bi(`<span class="eyebrow">Chapter 1 · Lesson 1.6 · SWT1 (2023) — 70 pages</span>
<h2>More from the 2023 slide set</h2>
<p class="lead">Before the current <em>SWT1_tim</em> deck, the course used an older deck, <strong>SWT1.ppt (2023)</strong>. About two thirds of its 70 pages reappear in lessons 1.1–1.5. The rest — mostly the <strong>old “fundamental test process”</strong> and the <strong>levels of test planning</strong> — is shown here, page by page.</p>
<div class="callout"><strong>Learning objectives.</strong>
<ul>
<li>Explain <strong>reliability</strong> and why reliable software can still contain defects.</li>
<li>Place <strong>test policy, test strategy, project test plan and level test plan</strong> on the right organisational level.</li>
<li>Walk through the old process — <strong>specification → execution → recording → check completion</strong> — and map every step to the current seven CTFL activities.</li>
<li>Name typical <strong>exit criteria</strong> and the four kinds of discrepancy you log while recording.</li>
<li>Translate the deck’s <strong>outdated wording</strong> (ISEB, fault, test record, completion criteria…) into current CTFL terms.</li>
</ul></div>
<div class="pitfall co-tieu-de"><strong>Old wording — learn the current term for the exam.</strong>
<ul>
<li><strong>ISTQB / ISEB</strong> — ISEB was the British exam board (part of BCS). Today the certificate is the <strong>ISTQB CTFL</strong>.</li>
<li><strong>Fault</strong> — current syllabus says <strong>defect</strong> (fault and bug are synonyms).</li>
<li><strong>Test record</strong> — now the <strong>test log</strong>.</li>
<li><strong>Test completion criteria</strong> — now <strong>exit criteria</strong> (in Agile: definition of done).</li>
<li><strong>Specification / recording / check completion</strong> — replaced by analysis, design, implementation, execution, completion (table at the end of this lesson).</li>
</ul></div>`,
    `<span class="eyebrow">Chương 1 · Bài 1.6 · SWT1 (2023) — 70 trang</span>
<h2>Bổ sung từ bộ slide 2023</h2>
<p class="lead">Trước bộ <em>SWT1_tim</em> hiện tại, môn học dùng một bộ slide cũ hơn là <strong>SWT1.ppt (2023)</strong>. Khoảng hai phần ba trong 70 trang của nó đã có lại trong bài 1.1–1.5. Phần còn lại — chủ yếu là <strong>“quy trình kiểm thử cơ bản” kiểu cũ</strong> và <strong>các cấp lập kế hoạch test</strong> — được trình bày ở đây, từng trang một.</p>
<div class="callout"><strong>Mục tiêu bài học.</strong>
<ul>
<li>Giải thích <strong>reliability (độ tin cậy)</strong> và vì sao phần mềm tin cậy vẫn có thể chứa defect.</li>
<li>Đặt <strong>test policy, test strategy, project test plan và level test plan</strong> vào đúng cấp tổ chức.</li>
<li>Đi hết quy trình cũ — <strong>specification → execution → recording → check completion</strong> — và ghép từng bước với bảy hoạt động CTFL hiện hành.</li>
<li>Kể được các <strong>exit criteria</strong> điển hình và bốn loại sai khác cần ghi lại khi recording.</li>
<li>Đổi <strong>cách gọi cũ</strong> của slide (ISEB, fault, test record, completion criteria…) sang thuật ngữ CTFL hiện nay.</li>
</ul></div>
<div class="pitfall co-tieu-de"><strong>Thuật ngữ cũ — đi thi phải dùng tên hiện hành.</strong>
<ul>
<li><strong>ISTQB / ISEB</strong> — ISEB là hội đồng thi của Anh (thuộc BCS). Chứng chỉ hiện nay là <strong>ISTQB CTFL</strong>.</li>
<li><strong>Fault</strong> — syllabus hiện hành gọi là <strong>defect</strong> (fault, bug là từ đồng nghĩa).</li>
<li><strong>Test record</strong> — nay là <strong>test log</strong>.</li>
<li><strong>Test completion criteria</strong> — nay là <strong>exit criteria</strong> (trong Agile: definition of done).</li>
<li><strong>Specification / recording / check completion</strong> — được thay bằng analysis, design, implementation, execution, completion (bảng ở cuối bài).</li>
</ul></div>`),
    bi(`<h3>Pages already taught in lessons 1.1–1.5</h3>
<p>These pages of the 2023 deck repeat a current slide (same text or same figure), so they are not shown again. Open the lesson and slide in the right column.</p>
<table>
<thead><tr><th>2023 page</th><th>Content</th><th>Already taught in</th></tr></thead>
<tbody>
<tr><td>1, 2, 22, 30, 55, 67</td><td>Cover and the repeated “Contents” agenda</td><td>Title / agenda only — 1.1, slides 1–2</td></tr>
<tr><td>3</td><td>Testing terminology, BS 7925-1</td><td>1.1, slide 6</td></tr>
<tr><td>5</td><td>Error → fault → failure picture</td><td>1.2, slide 40 (same picture, “defect” instead of “fault”)</td></tr>
<tr><td>8 · 9</td><td>Figure 1.1 types of error and defect · Figure 1.2 cost of defects</td><td>1.2, slides 42 and 45</td></tr>
<tr><td>10 · 11</td><td>Cost of faults (Ariane 5, Mariner…) · safety-critical systems</td><td>1.1, slides 4 and 5</td></tr>
<tr><td>12</td><td>So why is testing necessary? (✓/✗)</td><td>1.2, slide 46</td></tr>
<tr><td>13–18</td><td>480,000 tests, exhaustive testing, how much is enough, risk, prioritise</td><td>1.3, slides 56–61</td></tr>
<tr><td>20</td><td>Other factors that influence testing</td><td>1.3, slide 62</td></tr>
<tr><td>23–29</td><td>The seven testing principles</td><td>1.3, slides 54, 55, 63–67</td></tr>
<tr><td>40</td><td>A good test case — the four Es</td><td>1.4, slide 83</td></tr>
<tr><td>46 · 48 · 51</td><td>Dividers: the process bar with one box highlighted</td><td>Same diagram as page 37 (shown below)</td></tr>
<tr><td>54</td><td>Comparison of tasks — intellectual vs clerical</td><td>1.4, slide 90</td></tr>
<tr><td>56 · 58</td><td>Why test? · Assessing software quality</td><td>1.5, slides 100 and 101</td></tr>
<tr><td>59–62</td><td>Traditional vs better approach, testing paradox, who wants to be a tester?</td><td>1.5, slides 106–109</td></tr>
<tr><td>63 · 64</td><td>Testers’ rights · responsibilities</td><td>1.5, slides 110 and 111</td></tr>
<tr><td>65 · 66</td><td>Independence · levels of independence</td><td>1.5, slides 102 and 103</td></tr>
<tr><td>68 · 69</td><td>ISTQB code of ethics</td><td>1.5, slides 113 and 114</td></tr>
<tr><td>70</td><td>Chapter review (glossary terms per section)</td><td>1.5, the hidden review slide (pptx 118) at the end of the lesson</td></tr>
</tbody></table>`,
    `<h3>Những trang đã học trong bài 1.1–1.5</h3>
<p>Các trang này của bộ 2023 trùng một slide hiện tại (cùng chữ hoặc cùng hình), nên không chiếu lại. Mở bài và slide ở cột bên phải.</p>
<table>
<thead><tr><th>Trang 2023</th><th>Nội dung</th><th>Đã học ở</th></tr></thead>
<tbody>
<tr><td>1, 2, 22, 30, 55, 67</td><td>Trang bìa và mục lục “Contents” lặp lại</td><td>Chỉ là tiêu đề / mục lục — 1.1, slide 1–2</td></tr>
<tr><td>3</td><td>Thuật ngữ kiểm thử, BS 7925-1</td><td>1.1, slide 6</td></tr>
<tr><td>5</td><td>Hình error → fault → failure</td><td>1.2, slide 40 (cùng hình, ghi “defect” thay cho “fault”)</td></tr>
<tr><td>8 · 9</td><td>Figure 1.1 các loại error và defect · Figure 1.2 chi phí defect</td><td>1.2, slide 42 và 45</td></tr>
<tr><td>10 · 11</td><td>Thiệt hại do lỗi (Ariane 5, Mariner…) · hệ thống an toàn sống còn</td><td>1.1, slide 4 và 5</td></tr>
<tr><td>12</td><td>Vậy vì sao cần kiểm thử? (✓/✗)</td><td>1.2, slide 46</td></tr>
<tr><td>13–18</td><td>480.000 test, test vét cạn, test bao nhiêu là đủ, rủi ro, ưu tiên</td><td>1.3, slide 56–61</td></tr>
<tr><td>20</td><td>Các yếu tố khác ảnh hưởng tới kiểm thử</td><td>1.3, slide 62</td></tr>
<tr><td>23–29</td><td>Bảy nguyên tắc kiểm thử</td><td>1.3, slide 54, 55, 63–67</td></tr>
<tr><td>40</td><td>Test case tốt — bốn chữ E</td><td>1.4, slide 83</td></tr>
<tr><td>46 · 48 · 51</td><td>Trang chuyển mục: thanh quy trình tô sáng một ô</td><td>Cùng sơ đồ trang 37 (có bên dưới)</td></tr>
<tr><td>54</td><td>So sánh công việc — trí tuệ vs hành chính</td><td>1.4, slide 90</td></tr>
<tr><td>56 · 58</td><td>Why test? · Đánh giá chất lượng phần mềm</td><td>1.5, slide 100 và 101</td></tr>
<tr><td>59–62</td><td>Cách test truyền thống vs tốt hơn, nghịch lý kiểm thử, ai muốn làm tester?</td><td>1.5, slide 106–109</td></tr>
<tr><td>63 · 64</td><td>Quyền · trách nhiệm của tester</td><td>1.5, slide 110 và 111</td></tr>
<tr><td>65 · 66</td><td>Tính độc lập · các mức độc lập</td><td>1.5, slide 102 và 103</td></tr>
<tr><td>68 · 69</td><td>Quy tắc đạo đức ISTQB</td><td>1.5, slide 113 và 114</td></tr>
<tr><td>70</td><td>Ôn tập chương (thuật ngữ theo từng mục)</td><td>1.5, slide ôn tập bị ẩn (pptx 118) ở cuối bài</td></tr>
</tbody></table>`),
    walkHead(O, 4, 57, 'Only the pages that add something to lessons 1.1–1.5 are shown; the others are listed in the table above.', 'Chỉ hiện các trang bổ sung được điều gì cho bài 1.1–1.5; các trang còn lại nằm trong bảng phía trên.'),
    walk(O, [
      [4, 'What is a “bug”? (2023 wording)',
        `<p class="y-chinh">🎯 The same three words as slide 39 (lesson 1.2), in the older wording: “fault” is the main term and a failure is a “deviation”.</p>
<p class="nhan">What the page says</p>
<ul>
<li><strong>Error</strong> — a human action that produces an incorrect result.</li>
<li><strong>Fault</strong> — a manifestation of an error in software, also known as a defect or bug. If executed, a fault may cause a failure.</li>
<li><strong>Failure</strong> — deviation of the software from its expected delivery or service. The sub-bullet “found defect” means: a failure is the moment a defect becomes visible.</li>
</ul>
<p class="nhan">Old wording → current CTFL wording</p>
<table><thead><tr><th>2023 deck</th><th>Current syllabus / glossary</th></tr></thead><tbody>
<tr><td>Fault (defect, bug)</td><td><strong>Defect</strong> — fault and bug are synonyms</td></tr>
<tr><td>Failure = deviation from expected delivery or service</td><td><strong>Failure</strong> = an event in which a component or system does not perform a required function within specified limits</td></tr>
<tr><td>Failure = “found defect”</td><td>The tester <em>observes</em> the failure; the defect itself is located later, by debugging</td></tr>
</tbody></table>
<p class="meo">🧠 <strong>Remember:</strong> the yellow box is still true word for word — <em>a failure is an event; a fault (defect) is a state of the software, caused by an error.</em></p>`,
        `<p class="y-chinh">🎯 Vẫn ba từ của slide 39 (bài 1.2), nhưng theo cách gọi cũ: “fault” là từ chính và failure là một “sự sai lệch”.</p>
<p class="nhan">Trang slide nói gì</p>
<ul>
<li><strong>Error</strong> — hành động của con người tạo ra kết quả sai.</li>
<li><strong>Fault</strong> — biểu hiện của error nằm trong phần mềm, còn gọi là defect hay bug. Nếu được thực thi, fault có thể gây failure.</li>
<li><strong>Failure</strong> — sự sai lệch của phần mềm so với cách vận hành hay dịch vụ mong đợi. Dòng phụ “found defect” nghĩa là: failure là lúc một defect lộ ra.</li>
</ul>
<p class="nhan">Cách gọi cũ → cách gọi CTFL hiện hành</p>
<table><thead><tr><th>Slide 2023</th><th>Syllabus / glossary hiện hành</th></tr></thead><tbody>
<tr><td>Fault (defect, bug)</td><td><strong>Defect</strong> — fault và bug là từ đồng nghĩa</td></tr>
<tr><td>Failure = sai lệch so với vận hành / dịch vụ mong đợi</td><td><strong>Failure</strong> = sự kiện trong đó thành phần hay hệ thống không thực hiện được chức năng yêu cầu trong giới hạn đã định</td></tr>
<tr><td>Failure = “found defect”</td><td>Tester <em>quan sát</em> được failure; còn defect thì được tìm ra sau đó, bằng debugging</td></tr>
</tbody></table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> câu trong ô vàng vẫn đúng từng chữ — <em>failure là một sự kiện; fault (defect) là một trạng thái của phần mềm, do error gây ra.</em></p>`],
      [6, 'Reliability versus Faults',
        `<p class="y-chinh">🎯 Reliability is about how rarely the software fails in use — not about how many defects it contains.</p>
<p class="nhan">Definition on the page</p>
<p><strong>Reliability</strong> — the probability that software will not cause the failure of the system for a specified time under specified conditions.</p>
<p class="nhan">The three questions and the marks on the slide</p>
<ol>
<li><strong>Can a system be fault-free (zero faults, right first time)? ✗</strong> — no. Software is written by people (page 7), and since exhaustive testing is impossible we can never show that no defect is left (principle 1).</li>
<li><strong>Can a system be reliable but still have faults? ✓</strong> — yes. A defect only hurts when it is executed under the right conditions. A defect in a function users almost never run leaves reliability high.</li>
<li><strong>Is a “fault-free” application always reliable? ✗</strong> — no. Reliability also depends on the conditions of use: hardware, network or environment failures, use outside the specified conditions, or a system that meets a wrong requirement (principle 7, absence-of-errors fallacy).</li>
</ol>
<p class="nhan">Current wording</p>
<p>ISO/IEC 25010, the quality model CTFL uses for non-functional testing, defines reliability as the degree to which a system performs specified functions under specified conditions for a specified period of time. Same two ingredients: <strong>time</strong> and <strong>conditions</strong>.</p>
<p class="meo">🧠 <strong>Remember:</strong> defects live <em>inside</em> the code; reliability is what the user <em>experiences</em>. A crack in a door nobody opens does not make the house unsafe.</p>`,
        `<p class="y-chinh">🎯 Reliability là phần mềm hiếm khi hỏng lúc sử dụng — không phải là phần mềm chứa ít hay nhiều defect.</p>
<p class="nhan">Định nghĩa trên slide</p>
<p><strong>Reliability (độ tin cậy)</strong> — xác suất mà phần mềm sẽ không gây ra sự cố của hệ thống trong một khoảng thời gian cụ thể, dưới những điều kiện cụ thể (đúng như ghi chú của thầy/cô).</p>
<p class="nhan">Ba câu hỏi và dấu trên slide</p>
<ol>
<li><strong>Hệ thống có thể không có fault nào (zero faults, đúng ngay lần đầu)? ✗</strong> — không. Phần mềm do con người viết (trang 7), và vì không thể test vét cạn nên ta không bao giờ chứng minh được là hết defect (nguyên tắc 1).</li>
<li><strong>Hệ thống có thể tin cậy mà vẫn có fault? ✓</strong> — có. Defect chỉ gây hại khi được thực thi đúng điều kiện. Defect nằm trong chức năng gần như không ai dùng thì độ tin cậy vẫn cao.</li>
<li><strong>Ứng dụng “không có fault” thì luôn tin cậy? ✗</strong> — không. Độ tin cậy còn phụ thuộc điều kiện sử dụng: phần cứng, mạng hay môi trường hỏng, dùng ngoài điều kiện đã định, hoặc hệ thống làm đúng một yêu cầu sai (nguyên tắc 7, absence-of-errors fallacy).</li>
</ol>
<p class="nhan">Cách gọi hiện hành</p>
<p>ISO/IEC 25010 — mô hình chất lượng mà CTFL dùng khi nói về test phi chức năng — định nghĩa reliability là mức độ hệ thống thực hiện các chức năng đã định, dưới điều kiện đã định, trong một khoảng thời gian đã định. Vẫn hai thành phần: <strong>thời gian</strong> và <strong>điều kiện</strong>.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> defect nằm <em>bên trong</em> code; độ tin cậy là thứ người dùng <em>cảm nhận</em>. Một vết nứt ở cánh cửa không ai mở không làm ngôi nhà mất an toàn.</p>`],
      [7, 'Why do faults occur in software?',
        `<p class="y-chinh">🎯 Faults occur because software is written by people under pressure — an older, shorter version of the eight causes on slide 44 (lesson 1.2).</p>
<p class="nhan">Two causes on the page</p>
<ul>
<li><strong>Software is written by human beings</strong> — who know something but not everything, who have skills but aren’t perfect, and who do make mistakes (errors).</li>
<li><strong>Pressure to deliver to strict deadlines</strong> — there is no time to check, yet assumptions may be wrong, and systems may be delivered incomplete.</li>
</ul>
<p>The last line, “if you have ever written software …”, is left open on purpose: you already know this from your own bugs.</p>
<p class="nhan">Closest causes on today’s list (slide 44)</p>
<ul>
<li><strong>Know something, not everything</strong> → lack of experience, miscommunication</li>
<li><strong>Skills but not perfect, make mistakes</strong> → human fallibility</li>
<li><strong>Strict deadlines, no time to check</strong> → time pressure</li>
<li><strong>Wrong assumptions, incomplete systems</strong> → complexity, system interactions</li>
</ul>
<p class="ghi-chu">The teacher’s note only translates “strict” = khắt khe. The current list adds two causes this page does not name: new technologies and environmental conditions.</p>`,
        `<p class="y-chinh">🎯 Fault xuất hiện vì phần mềm do con người viết dưới áp lực — bản cũ, ngắn hơn của tám nguyên nhân ở slide 44 (bài 1.2).</p>
<p class="nhan">Hai nguyên nhân trên slide</p>
<ul>
<li><strong>Phần mềm do con người viết</strong> — người biết một số thứ chứ không biết mọi thứ, có kỹ năng nhưng không hoàn hảo, và chắc chắn có lúc sai (error).</li>
<li><strong>Áp lực giao hàng theo deadline khắt khe</strong> — không có thời gian kiểm tra trong khi giả định có thể sai, và hệ thống có thể giao khi còn dang dở.</li>
</ul>
<p>Dòng cuối “if you have ever written software …” cố ý bỏ lửng: bạn đã tự biết điều này qua bug của chính mình.</p>
<p class="nhan">Nguyên nhân gần nhất trong danh sách hiện nay (slide 44)</p>
<ul>
<li><strong>Biết một số chứ không biết hết</strong> → thiếu kinh nghiệm, truyền đạt sai</li>
<li><strong>Có kỹ năng nhưng không hoàn hảo, có lúc sai</strong> → con người vốn dễ sai</li>
<li><strong>Deadline khắt khe, không kịp kiểm tra</strong> → áp lực thời gian</li>
<li><strong>Giả định sai, hệ thống dang dở</strong> → độ phức tạp, tương tác hệ thống</li>
</ul>
<p class="ghi-chu">Ghi chú của thầy/cô chỉ dịch “strict” = khắt khe. Danh sách hiện nay có thêm hai nguyên nhân trang này không nêu: công nghệ mới và điều kiện môi trường.</p>`],
      [19, 'Testing and quality',
        `<p class="y-chinh">🎯 Testing <em>measures</em> quality; quality improves only when the defects it finds are removed.</p>
<p class="nhan">What the page says</p>
<ul>
<li><strong>Testing measures software quality</strong> — the ruler in the picture: testing tells you how good the product is.</li>
<li><strong>Testing can find faults</strong> — when they are removed, software quality (and <em>possibly</em> reliability) is improved. “Possibly”: removing a defect from a function nobody uses hardly changes reliability (page 6).</li>
<li><strong>What does testing test?</strong> — system function and correctness of operation (functional), plus non-functional qualities: reliability, usability, maintainability, reusability, testability, etc.</li>
</ul>
<p class="nhan">Link to the current syllabus</p>
<ul>
<li><strong>The fix improves quality, not the test</strong> — testing is quality control; improvement comes from debugging (slide 27, lesson 1.1) and from process improvement, i.e. quality assurance (slide 38, lesson 1.2).</li>
<li><strong>The non-functional list</strong> — today it follows ISO/IEC 25010: performance efficiency, compatibility, usability, reliability, security, maintainability, portability (lesson 2.4). Reusability and testability are sub-characteristics of maintainability.</li>
</ul>
<div class="pitfall">Slide 8 of the current deck asks for the <em>main goal</em> of testing: the answer is “assess the quality”, not “increase the quality” — exactly the first bullet of this page.</div>`,
        `<p class="y-chinh">🎯 Kiểm thử <em>đo</em> chất lượng; chất lượng chỉ tăng khi các defect nó tìm ra được sửa bỏ.</p>
<p class="nhan">Trang slide nói gì</p>
<ul>
<li><strong>Kiểm thử đo chất lượng phần mềm</strong> — cây thước trong hình: kiểm thử cho biết sản phẩm tốt tới đâu.</li>
<li><strong>Kiểm thử có thể tìm ra fault</strong> — khi chúng được sửa bỏ, chất lượng (và <em>có thể</em> cả độ tin cậy) tăng lên. “Có thể”: bỏ một defect ở chức năng không ai dùng thì độ tin cậy gần như không đổi (trang 6).</li>
<li><strong>Kiểm thử kiểm tra những gì?</strong> — chức năng của hệ thống và tính đúng khi vận hành (chức năng), cùng các đặc tính phi chức năng: reliability, usability, maintainability, reusability, testability, v.v.</li>
</ul>
<p class="nhan">Nối với syllabus hiện hành</p>
<ul>
<li><strong>Bản sửa làm tăng chất lượng, không phải bài test</strong> — kiểm thử là quality control; cải thiện đến từ debugging (slide 27, bài 1.1) và từ cải tiến quy trình, tức quality assurance (slide 38, bài 1.2).</li>
<li><strong>Danh sách phi chức năng</strong> — nay theo ISO/IEC 25010: performance efficiency, compatibility, usability, reliability, security, maintainability, portability (bài 2.4). Reusability và testability là đặc tính con của maintainability.</li>
</ul>
<div class="pitfall">Slide 8 của bộ hiện tại hỏi <em>mục tiêu chính</em> của kiểm thử: đáp án là “đánh giá chất lượng”, không phải “nâng cao chất lượng” — đúng ý dòng đầu tiên của trang này.</div>`],
      [21, 'Glossary',
        `<p class="y-chinh">🎯 Nine glossary terms you must be able to define after section 1.1 — with today’s ISTQB definitions.</p>
<table><thead><tr><th>Term</th><th>Current ISTQB meaning</th></tr></thead><tbody>
<tr><td><strong>Bug, defect, fault</strong></td><td>Synonyms: an imperfection or deficiency in a work product where it does not meet its requirements or specifications</td></tr>
<tr><td><strong>Error</strong> · <strong>mistake</strong></td><td>Synonyms: a human action that produces an incorrect result. The page lists them separately, but they are the same thing</td></tr>
<tr><td><strong>Failure</strong></td><td>An event in which a component or system does not perform a required function within specified limits</td></tr>
<tr><td><strong>Quality</strong></td><td>The degree to which a component, system or process meets specified requirements and/or user or customer needs and expectations</td></tr>
<tr><td><strong>Risk</strong></td><td>A factor that could result in future negative consequences; usually expressed as impact and likelihood</td></tr>
<tr><td><strong>Software</strong></td><td>Computer programs, procedures, and possibly associated documentation and data pertaining to the operation of a computer system</td></tr>
<tr><td><strong>Testing</strong></td><td>All lifecycle activities, static and dynamic, concerned with planning, preparation and evaluation of software and related work products, to determine that they satisfy requirements, demonstrate fitness for purpose and detect defects</td></tr>
<tr><td><strong>Exhaustive testing</strong></td><td>A test approach in which the test suite comprises all combinations of input values and preconditions (also “complete testing”)</td></tr>
</tbody></table>
<p class="meo">🧠 <strong>Remember:</strong> the chain uses one word per layer — <strong>error</strong> (person) → <strong>defect</strong> (product) → <strong>failure</strong> (event). Mistake, fault and bug are only aliases.</p>`,
        `<p class="y-chinh">🎯 Chín thuật ngữ glossary phải định nghĩa được sau mục 1.1 — theo định nghĩa ISTQB hiện nay.</p>
<table><thead><tr><th>Thuật ngữ</th><th>Nghĩa theo ISTQB hiện hành</th></tr></thead><tbody>
<tr><td><strong>Bug, defect, fault</strong></td><td>Đồng nghĩa: chỗ khiếm khuyết trong một sản phẩm công việc khiến nó không đáp ứng yêu cầu hay đặc tả</td></tr>
<tr><td><strong>Error</strong> · <strong>mistake</strong></td><td>Đồng nghĩa: hành động của con người tạo ra kết quả sai. Slide ghi thành hai dòng, nhưng là một</td></tr>
<tr><td><strong>Failure</strong></td><td>Sự kiện trong đó thành phần hay hệ thống không thực hiện được chức năng yêu cầu trong giới hạn đã định</td></tr>
<tr><td><strong>Quality</strong></td><td>Mức độ một thành phần, hệ thống hay quy trình đáp ứng yêu cầu đã định và/hoặc nhu cầu, kỳ vọng của người dùng, khách hàng</td></tr>
<tr><td><strong>Risk</strong></td><td>Yếu tố có thể dẫn tới hậu quả xấu trong tương lai; thường biểu diễn bằng tác động (impact) và khả năng xảy ra (likelihood)</td></tr>
<tr><td><strong>Software</strong></td><td>Chương trình máy tính, thủ tục, và có thể kèm tài liệu, dữ liệu liên quan tới việc vận hành một hệ thống máy tính</td></tr>
<tr><td><strong>Testing</strong></td><td>Mọi hoạt động trong vòng đời, tĩnh lẫn động, liên quan tới lập kế hoạch, chuẩn bị và đánh giá phần mềm cùng các sản phẩm liên quan, để xác định chúng đáp ứng yêu cầu, chứng tỏ phù hợp mục đích và tìm defect</td></tr>
<tr><td><strong>Exhaustive testing</strong></td><td>Cách tiếp cận trong đó bộ test gồm mọi tổ hợp giá trị đầu vào và điều kiện tiên quyết (còn gọi “complete testing”)</td></tr>
</tbody></table>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> chuỗi nhân quả mỗi tầng một từ — <strong>error</strong> (con người) → <strong>defect</strong> (sản phẩm) → <strong>failure</strong> (sự kiện). Mistake, fault, bug chỉ là tên khác.</p>`],
      [31, 'Test Planning - different levels',
        `<p class="y-chinh">🎯 Test planning happens on three levels: company, project and test stage — each level narrows the one above.</p>
<p class="nhan">The three levels on the page</p>
<ol>
<li><strong>Company level</strong> — <em>Test Policy</em> and <em>Test Strategy</em>, written once for the whole organisation.</li>
<li><strong>Project level (IEEE 829)</strong> — one <em>High-Level Test Plan</em> for each project.</li>
<li><strong>Test stage level (IEEE 829)</strong> — one <em>Detailed Test Plan</em> for each stage within a project, e.g. component, system.</li>
</ol>
<p class="nhan">Old names → current names</p>
<ul>
<li><strong>High-level test plan</strong> → <em>master test plan</em> (IEEE 829-2008) or <em>project test plan</em> (ISO/IEC/IEEE 29119-3).</li>
<li><strong>Detailed test plan</strong> → <em>level test plan</em>, e.g. component test plan, system test plan.</li>
<li><strong>Test stage</strong> → <em>test level</em>.</li>
</ul>
<p>The contents of a plan are taught in lesson 7.2 (IEEE 829, 16 sections) and the high-level plan in lesson 2.5.</p>
<p class="meo">🧠 <strong>Remember:</strong> policy = <em>why</em> we test (company) · strategy = <em>how</em> in general · plan = <em>what, who, when</em> for one project or level.</p>`,
        `<p class="y-chinh">🎯 Lập kế hoạch test diễn ra ở ba cấp: công ty, dự án và giai đoạn test — mỗi cấp thu hẹp cấp phía trên.</p>
<p class="nhan">Ba cấp trên slide</p>
<ol>
<li><strong>Cấp công ty</strong> — <em>Test Policy</em> và <em>Test Strategy</em>, viết một lần cho cả tổ chức.</li>
<li><strong>Cấp dự án (IEEE 829)</strong> — mỗi dự án một <em>High-Level Test Plan</em>.</li>
<li><strong>Cấp giai đoạn test (IEEE 829)</strong> — mỗi giai đoạn trong dự án một <em>Detailed Test Plan</em>, ví dụ component, system.</li>
</ol>
<p class="nhan">Tên cũ → tên hiện hành</p>
<ul>
<li><strong>High-level test plan</strong> → <em>master test plan</em> (IEEE 829-2008) hay <em>project test plan</em> (ISO/IEC/IEEE 29119-3).</li>
<li><strong>Detailed test plan</strong> → <em>level test plan</em>, ví dụ component test plan, system test plan.</li>
<li><strong>Test stage</strong> → <em>test level</em> (cấp test).</li>
</ul>
<p>Nội dung một test plan học ở bài 7.2 (IEEE 829, 16 mục), còn high-level test plan ở bài 2.5.</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> policy = <em>vì sao</em> test (công ty) · strategy = test <em>thế nào</em> nói chung · plan = test <em>cái gì, ai, khi nào</em> cho một dự án hay một cấp.</p>`],
      [32, 'Test Planning - different levels (the V)',
        `<p class="y-chinh">🎯 The planning levels follow the V: the left leg defines the project, the right leg tests and integrates it, level by level.</p>
<p class="nhan">Left leg — Project Definition (top → bottom)</p>
<ol>
<li>Concept of Operations</li>
<li>Requirements and Architecture</li>
<li>Detailed Design</li>
<li>Implementation (the bottom of the V)</li>
</ol>
<p class="nhan">Right leg — Project Test and Integration (bottom → top)</p>
<ol>
<li>Integration, Test, and Verification — checks the detailed design</li>
<li>System Verification and Validation — checks requirements and architecture</li>
<li>Operation and Maintenance — the system in use, measured against the concept of operations</li>
</ol>
<p>The arrow “Verification and Validation” across the V means each right-hand stage is checked against its partner on the left; time runs from left to right. Each right-hand stage is where a detailed (level) test plan from page 31 applies.</p>
<p class="ghi-chu">This is the systems-engineering version of the V. The software V-model with component, integration, system and acceptance testing is taught in lesson 2.1.</p>`,
        `<p class="y-chinh">🎯 Các cấp kế hoạch đi theo chữ V: nhánh trái định nghĩa dự án, nhánh phải test và tích hợp nó, từng cấp một.</p>
<p class="nhan">Nhánh trái — Project Definition (trên → dưới)</p>
<ol>
<li>Concept of Operations (khái niệm vận hành)</li>
<li>Requirements and Architecture (yêu cầu và kiến trúc)</li>
<li>Detailed Design (thiết kế chi tiết)</li>
<li>Implementation (đáy chữ V)</li>
</ol>
<p class="nhan">Nhánh phải — Project Test and Integration (dưới → trên)</p>
<ol>
<li>Integration, Test, and Verification — kiểm thiết kế chi tiết</li>
<li>System Verification and Validation — kiểm yêu cầu và kiến trúc</li>
<li>Operation and Maintenance — hệ thống khi sử dụng, đối chiếu với khái niệm vận hành</li>
</ol>
<p>Mũi tên “Verification and Validation” vắt ngang nghĩa là mỗi giai đoạn bên phải được kiểm với giai đoạn cặp đôi bên trái; thời gian chạy từ trái sang phải. Mỗi giai đoạn bên phải chính là nơi áp dụng một detailed (level) test plan của trang 31.</p>
<p class="ghi-chu">Đây là chữ V phiên bản kỹ thuật hệ thống. V-model phần mềm với component, integration, system và acceptance testing được dạy ở bài 2.1.</p>`],
      [33, 'Test Policy (organisation level)',
        `<p class="y-chinh">🎯 The test policy is the organisation’s short, stable statement of what testing means to it and how it judges success.</p>
<p class="nhan">1. Test Policy — organisation level</p>
<ul>
<li><strong>Very high-level document</strong> — often one or two pages.</li>
<li><strong>What “testing” means</strong> for the organisation.</li>
<li><strong>How the organisation measures test success.</strong></li>
<li><strong>Relatively static</strong> — it changes only when the organisation’s focus changes.</li>
<li><strong>Developed by the IT department</strong> — in practice by IT and test management.</li>
</ul>
<p class="nhan">Example of a policy statement</p>
<p>“Testing aims to find defects before our customers do. Every product is tested by a team independent of its developers. Success is measured by the number of defects found after release.”</p>
<p class="ghi-chu">Current term: ISO/IEC/IEEE 29119-3 still calls it the <em>organizational test policy</em>; the 2011 ISTQB glossary defined it as a high-level document describing the principles, approach and major objectives of the organisation regarding testing.</p>`,
        `<p class="y-chinh">🎯 Test policy là tuyên bố ngắn, ổn định của tổ chức: kiểm thử có ý nghĩa gì với họ và thành công được đo thế nào.</p>
<p class="nhan">1. Test Policy — cấp tổ chức</p>
<ul>
<li><strong>Tài liệu cấp rất cao</strong> — thường chỉ một, hai trang.</li>
<li><strong>“Kiểm thử” nghĩa là gì</strong> với tổ chức.</li>
<li><strong>Tổ chức đo thành công của kiểm thử ra sao.</strong></li>
<li><strong>Khá tĩnh</strong> — chỉ đổi khi trọng tâm của tổ chức thay đổi.</li>
<li><strong>Do phòng IT xây dựng</strong> — thực tế là ban quản lý IT và quản lý test.</li>
</ul>
<p class="nhan">Ví dụ một câu trong policy</p>
<p>“Kiểm thử nhằm tìm defect trước khi khách hàng tìm thấy. Mọi sản phẩm được test bởi một nhóm độc lập với người phát triển. Thành công được đo bằng số defect bị phát hiện sau khi phát hành.”</p>
<p class="ghi-chu">Tên hiện hành: ISO/IEC/IEEE 29119-3 vẫn gọi là <em>organizational test policy</em>; glossary ISTQB 2011 định nghĩa nó là tài liệu cấp cao mô tả nguyên tắc, cách tiếp cận và mục tiêu chính của tổ chức về kiểm thử.</p>`],
      [34, 'Test Strategy (programme level)',
        `<p class="y-chinh">🎯 The test strategy turns the policy into concrete testing rules for a programme — a group of projects on one system.</p>
<p class="nhan">2. Test Strategy — the 15 points on the page</p>
<ol class="hai-cot">
<li>Applies to a programme / system covering multiple projects</li>
<li>Objective and scope of testing</li>
<li>In-scope / out-of-scope items</li>
<li>Test levels (unit / module / system / integration)</li>
<li>Test types (functional / non-functional)</li>
<li>Entry / exit / stop / resumption criteria per level</li>
<li>Risks to be addressed</li>
<li>Test environment</li>
<li>Test case design methodology (specification-driven, BVA, EQ partitioning)</li>
<li>Test methodology (top-down / bottom-up / risk-based)</li>
<li>Test automation approach</li>
<li>Test tools to be used</li>
<li>Defect management approach</li>
<li>Defect classification</li>
<li>Retesting and regression approach</li>
</ol>
<p class="nhan">Where each point is taught now</p>
<ul>
<li><strong>Levels, types, retesting &amp; regression</strong> — lessons 2.2–2.4.</li>
<li><strong>EQ partitioning, BVA</strong> — lessons 4.2 and 4.3.</li>
<li><strong>Top-down / bottom-up</strong> — integration strategies (lesson 2.2); <strong>risk-based</strong> — lesson 7.5.</li>
<li><strong>Stop / resumption</strong> — IEEE 829 “suspension criteria and resumption requirements” (lesson 7.2).</li>
<li><strong>Defect management and classification</strong> — lesson 7.6.</li>
</ul>
<p class="ghi-chu">Page 31 puts the strategy at company level, this page at programme level. Both are right: the ISTQB 2011 glossary says a test strategy covers “an organization or programme (one or more projects)”.</p>`,
        `<p class="y-chinh">🎯 Test strategy biến policy thành các quy tắc test cụ thể cho một chương trình — nhóm nhiều dự án trên cùng một hệ thống.</p>
<p class="nhan">2. Test Strategy — 15 ý trên slide</p>
<ol class="hai-cot">
<li>Áp dụng cho một chương trình / hệ thống gồm nhiều dự án</li>
<li>Mục tiêu và phạm vi kiểm thử</li>
<li>Hạng mục trong / ngoài phạm vi test</li>
<li>Cấp test (unit / module / system / integration)</li>
<li>Loại test (chức năng / phi chức năng)</li>
<li>Tiêu chí vào / ra / dừng / tiếp tục cho từng cấp</li>
<li>Rủi ro cần xử lý</li>
<li>Môi trường test</li>
<li>Phương pháp thiết kế test case (theo đặc tả, BVA, phân vùng tương đương)</li>
<li>Phương pháp test (top-down / bottom-up / dựa rủi ro)</li>
<li>Cách tiếp cận tự động hoá</li>
<li>Công cụ test sẽ dùng</li>
<li>Cách quản lý defect</li>
<li>Phân loại defect</li>
<li>Cách retest và regression</li>
</ol>
<p class="nhan">Mỗi ý hiện được dạy ở đâu</p>
<ul>
<li><strong>Cấp test, loại test, retest &amp; regression</strong> — bài 2.2–2.4.</li>
<li><strong>Phân vùng tương đương, BVA</strong> — bài 4.2 và 4.3.</li>
<li><strong>Top-down / bottom-up</strong> — chiến lược tích hợp (bài 2.2); <strong>dựa rủi ro</strong> — bài 7.5.</li>
<li><strong>Dừng / tiếp tục</strong> — mục IEEE 829 “suspension criteria and resumption requirements” (bài 7.2).</li>
<li><strong>Quản lý và phân loại defect</strong> — bài 7.6.</li>
</ul>
<p class="ghi-chu">Trang 31 đặt strategy ở cấp công ty, trang này ở cấp chương trình. Cả hai đều đúng: glossary ISTQB 2011 nói test strategy áp dụng cho “một tổ chức hoặc một chương trình (một hay nhiều dự án)”.</p>`],
      [35, 'Test Plan (project level)',
        `<p class="y-chinh">🎯 The project test plan applies the strategy to one project and adds the project’s own numbers: effort, dates, people, outputs, reporting.</p>
<p class="nhan">3. Test Plan — project level</p>
<ul>
<li><strong>All the strategy points above</strong> — made specific for this project.</li>
<li><strong>Test estimation &amp; test schedule</strong> — how much effort, and when.</li>
<li><strong>Test organisation / roles / responsibilities</strong> — who does what.</li>
<li><strong>Test deliverables</strong> — which documents and testware are handed over.</li>
<li><strong>Test reporting</strong> — which reports, to whom, how often.</li>
</ul>
<p class="nhan">Where it is taught now</p>
<ul>
<li>Estimation, schedule and plan contents — lesson 7.2.</li>
<li>Roles of test manager and tester — lesson 7.1.</li>
<li>Progress and summary reports — lesson 7.3.</li>
</ul>`,
        `<p class="y-chinh">🎯 Test plan cấp dự án áp strategy vào một dự án và thêm các con số riêng của dự án: công sức, ngày tháng, con người, sản phẩm bàn giao, báo cáo.</p>
<p class="nhan">3. Test Plan — cấp dự án</p>
<ul>
<li><strong>Mọi ý của strategy ở trên</strong> — cụ thể hoá cho dự án này.</li>
<li><strong>Ước lượng &amp; lịch test</strong> — tốn bao nhiêu công sức, làm khi nào.</li>
<li><strong>Tổ chức test / vai trò / trách nhiệm</strong> — ai làm việc gì.</li>
<li><strong>Sản phẩm bàn giao</strong> — những tài liệu và testware nào được giao.</li>
<li><strong>Báo cáo test</strong> — báo cáo nào, gửi ai, bao lâu một lần.</li>
</ul>
<p class="nhan">Hiện học ở đâu</p>
<ul>
<li>Ước lượng, lịch và nội dung plan — bài 7.2.</li>
<li>Vai trò test manager và tester — bài 7.1.</li>
<li>Báo cáo tiến độ và báo cáo tổng kết — bài 7.3.</li>
</ul>`],
      [36, 'Test planning (detailed level)',
        `<p class="y-chinh">🎯 The detailed (level) plan says how the strategy and project plan apply to one piece of software — and where it deliberately deviates.</p>
<p class="nhan">What the detailed plan records</p>
<ol>
<li><strong>How the test strategy and project test plan apply</strong> to the software under test.</li>
<li><strong>Exceptions to the test strategy</strong> — e.g. only one test case design technique is needed for this functional area because it is less critical.</li>
<li><strong>Other software needed for the tests</strong> — such as stubs and drivers (lesson 2.2), plus environment details.</li>
<li><strong>Test completion criteria</strong> — when testing of this item may stop. Today: <em>exit criteria</em>; they are checked on pages 52–53.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> an exception must be <em>written down</em> with its reason — “less critical” is a risk decision, and risk decides how thoroughly to test (lesson 1.3, slide 60).</p>`,
        `<p class="y-chinh">🎯 Plan chi tiết (level test plan) nói strategy và plan dự án áp vào một phần mềm cụ thể ra sao — và chỗ nào cố ý làm khác.</p>
<p class="nhan">Plan chi tiết ghi những gì</p>
<ol>
<li><strong>Test strategy và project test plan áp dụng thế nào</strong> vào phần mềm đang test.</li>
<li><strong>Các ngoại lệ so với test strategy</strong> — ví dụ vùng chức năng này chỉ cần một kỹ thuật thiết kế test vì nó ít quan trọng hơn.</li>
<li><strong>Phần mềm khác cần cho việc test</strong> — như stub và driver (bài 2.2), cùng chi tiết môi trường.</li>
<li><strong>Tiêu chí hoàn thành test</strong> — khi nào được dừng test hạng mục này. Nay gọi là <em>exit criteria</em>; chúng được kiểm ở trang 52–53.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> ngoại lệ phải được <em>ghi ra</em> kèm lý do — “ít quan trọng hơn” là một quyết định theo rủi ro, và rủi ro quyết định test kỹ tới đâu (bài 1.3, slide 60).</p>`],
      [37, 'The test process (2023 deck)',
        `<p class="y-chinh">🎯 The old process has five parts: detailed planning wraps around four steps — specification → execution → recording → check completion.</p>
<p>The yellow L-shaped bar means planning starts first and stays alive during all four steps, much like monitoring &amp; control today. This process comes from the British component-testing standard BS 7925-2, which the old ISEB Foundation exam used.</p>
<table><thead><tr><th>2023 step</th><th>What happens</th><th>CTFL 2018 activity (lesson 1.4)</th></tr></thead><tbody>
<tr><td>Planning (detailed level)</td><td>The level test plan (page 36)</td><td>Test planning; monitoring &amp; control runs throughout</td></tr>
<tr><td>Specification</td><td>Identify conditions, design test cases, build tests</td><td>Test analysis + test design + test implementation</td></tr>
<tr><td>Execution</td><td>Run the test cases</td><td>Test execution</td></tr>
<tr><td>Recording</td><td>Log outcomes, compare, log discrepancies</td><td>Also test execution (logging, comparing, reporting defects)</td></tr>
<tr><td>Check completion</td><td>Compare with completion criteria; loop back if not met</td><td>Evaluating exit criteria — part of test monitoring &amp; control</td></tr>
</tbody></table>
<div class="pitfall">“Check completion” is <strong>not</strong> the CTFL activity “test completion” (slide 88). The old step decides <em>whether</em> you may stop; CTFL test completion is the closing work <em>after</em> stopping — archive testware, lessons learned, test summary report.</div>`,
        `<p class="y-chinh">🎯 Quy trình cũ có năm phần: lập kế hoạch chi tiết bao quanh bốn bước — specification → execution → recording → check completion.</p>
<p>Thanh vàng hình chữ L nghĩa là planning bắt đầu trước và còn chạy suốt bốn bước, giống monitoring &amp; control ngày nay. Quy trình này lấy từ tiêu chuẩn kiểm thử thành phần của Anh BS 7925-2, mà kỳ thi ISEB Foundation cũ dùng.</p>
<table><thead><tr><th>Bước 2023</th><th>Việc diễn ra</th><th>Hoạt động CTFL 2018 (bài 1.4)</th></tr></thead><tbody>
<tr><td>Planning (cấp chi tiết)</td><td>Level test plan (trang 36)</td><td>Test planning; monitoring &amp; control chạy suốt</td></tr>
<tr><td>Specification</td><td>Xác định điều kiện, thiết kế test case, dựng test</td><td>Test analysis + test design + test implementation</td></tr>
<tr><td>Execution</td><td>Chạy test case</td><td>Test execution</td></tr>
<tr><td>Recording</td><td>Ghi kết quả, so sánh, ghi các sai khác</td><td>Cũng thuộc test execution (ghi log, so sánh, báo defect)</td></tr>
<tr><td>Check completion</td><td>So với tiêu chí hoàn thành; chưa đạt thì quay lại</td><td>Đánh giá exit criteria — thuộc test monitoring &amp; control</td></tr>
</tbody></table>
<div class="pitfall">“Check completion” <strong>không phải</strong> hoạt động CTFL “test completion” (slide 88). Bước cũ quyết định <em>có được</em> dừng hay chưa; test completion của CTFL là phần việc khép lại <em>sau khi</em> đã dừng — lưu trữ testware, rút kinh nghiệm, báo cáo tổng kết.</div>`],
      [38, 'Test specification (diagram)',
        `<p class="y-chinh">🎯 Specification, the pink box, splits into three stair-steps: identify conditions → design test cases → build tests.</p>
<ul>
<li><strong>Identify conditions</strong> → today’s test analysis (slide 81).</li>
<li><strong>Design test cases</strong> → test design (slide 82).</li>
<li><strong>Build tests</strong> → test implementation (slide 85).</li>
</ul>`,
        `<p class="y-chinh">🎯 Specification — ô hồng — tách thành ba bậc thang: identify conditions → design test cases → build tests.</p>
<ul>
<li><strong>Identify conditions</strong> → test analysis ngày nay (slide 81).</li>
<li><strong>Design test cases</strong> → test design (slide 82).</li>
<li><strong>Build tests</strong> → test implementation (slide 85).</li>
</ul>`],
      [39, 'Test specification — three tasks',
        `<p class="y-chinh">🎯 Specification = decide <em>what</em> to test, then <em>how</em>, then build it.</p>
<ol>
<li><strong>Identify</strong> — determine <em>what</em> is to be tested (identify test conditions) and prioritise.</li>
<li><strong>Design</strong> — determine <em>how</em> the “what” is to be tested, i.e. design test cases.</li>
<li><strong>Build</strong> — implement the tests: data, scripts, etc.</li>
</ol>
<p class="meo">🧠 <strong>Remember:</strong> What → How → Do. The current slides 81–82 keep the same words: analysis = “WHAT to test”, design = “HOW to test”.</p>`,
        `<p class="y-chinh">🎯 Specification = quyết định test <em>cái gì</em>, rồi test <em>thế nào</em>, rồi dựng nó.</p>
<ol>
<li><strong>Identify</strong> — xác định <em>cái gì</em> cần test (xác định test condition) và sắp ưu tiên.</li>
<li><strong>Design</strong> — xác định “cái gì” đó được test <em>thế nào</em>, tức là thiết kế test case.</li>
<li><strong>Build</strong> — hiện thực các test: dữ liệu, script, v.v.</li>
</ol>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> Cái gì → Thế nào → Làm. Slide 81–82 hiện tại giữ nguyên chữ: analysis = “WHAT to test”, design = “HOW to test”.</p>`],
      [41, 'Task 1: identify conditions',
        `<p class="y-chinh">🎯 Task 1 lists everything worth testing as test conditions, then ranks them so the most important are surely covered.</p>
<p class="nhan">List the conditions</p>
<ul>
<li><strong>Use the techniques named in the test plan</strong> — e.g. equivalence partitioning, boundary values.</li>
<li><strong>Expect many conditions</strong> per system function or attribute.</li>
</ul>
<p class="nhan">The three examples, decoded</p>
<ul>
<li><strong>“Life assurance for a winter sportsman”</strong> — a business category: an insurance rule for a high-risk customer group.</li>
<li><strong>“Number items ordered &gt; 99”</strong> — a boundary: test 99 and 100.</li>
<li><strong>“Date = 29-Feb-2004”</strong> — a special value: 2004 is a leap year, so the date is valid and must be accepted.</li>
</ul>
<p class="nhan">Prioritise</p>
<p>Rank the conditions so the most important ones are covered first (page 42).</p>
<p class="ghi-chu">Current term: a <em>test condition</em> is an aspect of the test basis relevant to achieving specific test objectives; it is identified in test analysis.</p>`,
        `<p class="y-chinh">🎯 Việc 1 liệt kê mọi thứ đáng test thành test condition, rồi xếp hạng để chắc chắn phủ được cái quan trọng nhất.</p>
<p class="nhan">Liệt kê điều kiện</p>
<ul>
<li><strong>Dùng các kỹ thuật ghi trong test plan</strong> — ví dụ phân vùng tương đương, giá trị biên.</li>
<li><strong>Sẽ có nhiều điều kiện</strong> cho mỗi chức năng hay thuộc tính của hệ thống.</li>
</ul>
<p class="nhan">Giải mã ba ví dụ</p>
<ul>
<li><strong>“Bảo hiểm nhân thọ cho người chơi thể thao mùa đông”</strong> — một nhóm nghiệp vụ: quy tắc bảo hiểm cho nhóm khách hàng rủi ro cao.</li>
<li><strong>“Số món đặt &gt; 99”</strong> — một biên: test 99 và 100.</li>
<li><strong>“Ngày = 29-02-2004”</strong> — một giá trị đặc biệt: 2004 là năm nhuận nên ngày này hợp lệ và phải được chấp nhận.</li>
</ul>
<p class="nhan">Sắp ưu tiên</p>
<p>Xếp hạng điều kiện để cái quan trọng nhất được phủ trước (trang 42).</p>
<p class="ghi-chu">Thuật ngữ hiện hành: <em>test condition</em> là một khía cạnh của test basis liên quan tới việc đạt các mục tiêu test cụ thể; nó được xác định trong test analysis.</p>`],
      [42, 'Selecting test conditions',
        `<p class="y-chinh">🎯 Pick conditions by importance, not by the order you happen to meet them.</p>
<p class="nhan">Reading the chart</p>
<ul>
<li><strong>Axes</strong> — importance (up) against time (right). Each square is one test condition.</li>
<li><strong>Dark squares</strong> above the line are important; <strong>light squares</strong> below are less important.</li>
<li><strong>First set ✗</strong> — everything left of the vertical line, i.e. whatever came first. It mixes unimportant conditions in and misses all important ones on the right.</li>
<li><strong>Best set ✓</strong> — the whole band above the line: every important condition, wherever it sits in time.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> this is page 18 / slide 61 as a picture — prioritise, so that whenever you stop, you have done the best testing possible in the time available.</p>`,
        `<p class="y-chinh">🎯 Chọn điều kiện theo mức quan trọng, không theo thứ tự tình cờ gặp chúng.</p>
<p class="nhan">Đọc biểu đồ</p>
<ul>
<li><strong>Hai trục</strong> — mức quan trọng (lên) theo thời gian (sang phải). Mỗi ô vuông là một test condition.</li>
<li><strong>Ô sẫm</strong> trên đường ngang là quan trọng; <strong>ô nhạt</strong> bên dưới ít quan trọng hơn.</li>
<li><strong>First set ✗</strong> — mọi thứ bên trái đường dọc, tức là cái gì đến trước lấy trước. Nó lẫn cả điều kiện không quan trọng và bỏ sót mọi điều kiện quan trọng bên phải.</li>
<li><strong>Best set ✓</strong> — cả dải phía trên đường ngang: mọi điều kiện quan trọng, dù nằm ở thời điểm nào.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đây là trang 18 / slide 61 vẽ thành hình — sắp ưu tiên để dù dừng lúc nào, bạn cũng đã test tốt nhất có thể trong thời gian có được.</p>`],
      [43, 'Task 2: design test cases',
        `<p class="y-chinh">🎯 Task 2 turns conditions into test cases: inputs and data, predicted results, and sets of tests for different goals.</p>
<ul>
<li><strong>Design test input and test data</strong> — each test exercises one or more test conditions.</li>
<li><strong>Determine expected results</strong> — predict the outcome of each test case: what is output, what is changed and what is <em>not</em> changed.</li>
<li><strong>Design sets of tests</strong> — different sets for different objectives, such as regression, building confidence and finding faults.</li>
</ul>
<p class="nhan">Example — “what is not changed”</p>
<p>A transfer of 500 from an account holding 300 must be rejected. Expected result: an error message <em>and</em> both balances unchanged. A test that only checks the message would miss a defect that debits the money anyway.</p>
<p class="ghi-chu">Current terms: this is test design (slides 82–84); a “set of tests” is a <em>test suite</em>.</p>`,
        `<p class="y-chinh">🎯 Việc 2 biến điều kiện thành test case: đầu vào và dữ liệu, kết quả dự đoán, và các bộ test cho các mục tiêu khác nhau.</p>
<ul>
<li><strong>Thiết kế đầu vào và dữ liệu test</strong> — mỗi test thực thi một hay nhiều test condition.</li>
<li><strong>Xác định kết quả mong đợi</strong> — dự đoán kết quả từng test case: cái gì được xuất ra, cái gì thay đổi và cái gì <em>không</em> thay đổi.</li>
<li><strong>Thiết kế các bộ test</strong> — mỗi mục tiêu một bộ, như regression, tạo niềm tin và tìm lỗi.</li>
</ul>
<p class="nhan">Ví dụ — “cái gì không thay đổi”</p>
<p>Chuyển 500 từ tài khoản chỉ có 300 phải bị từ chối. Kết quả mong đợi: thông báo lỗi <em>và</em> số dư hai tài khoản giữ nguyên. Test chỉ kiểm thông báo sẽ bỏ lọt defect vẫn trừ tiền.</p>
<p class="ghi-chu">Thuật ngữ hiện hành: đây là test design (slide 82–84); “set of tests” nay gọi là <em>test suite</em>.</p>`],
      [44, 'Designing test cases',
        `<p class="y-chinh">🎯 One test case can cover several conditions: wrap every important condition in a test case, and accept that some unimportant ones stay uncovered.</p>
<ul>
<li><strong>Red squares</strong> — most important test conditions; <strong>pink</strong> — least important.</li>
<li><strong>Green shapes</strong> — test cases. Every red square sits inside at least one of them.</li>
<li><strong>Overlaps</strong> — some conditions are exercised by two test cases.</li>
<li><strong>Bonus coverage</strong> — the lower-left test case also picks up two pink conditions at no extra cost.</li>
<li><strong>Left out</strong> — most pink conditions stay outside: a conscious decision not to test them this time.</li>
</ul>
<p class="meo">🧠 <strong>Remember:</strong> this is the “exemplary” E of a good test case — the teacher’s note on page 40: good test cases can test more than one condition at the same time.</p>`,
        `<p class="y-chinh">🎯 Một test case có thể phủ nhiều điều kiện: gói mọi điều kiện quan trọng vào test case, và chấp nhận một số điều kiện ít quan trọng không được phủ.</p>
<ul>
<li><strong>Ô đỏ</strong> — test condition quan trọng nhất; <strong>ô hồng</strong> — ít quan trọng nhất.</li>
<li><strong>Hình xanh</strong> — test case. Ô đỏ nào cũng nằm trong ít nhất một hình.</li>
<li><strong>Chồng lấn</strong> — vài điều kiện được hai test case cùng thực thi.</li>
<li><strong>Phủ thêm</strong> — test case góc dưới bên trái phủ luôn hai ô hồng mà không tốn thêm.</li>
<li><strong>Bỏ lại</strong> — đa số ô hồng nằm ngoài: quyết định có chủ ý là lần này không test chúng.</li>
</ul>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> đây là chữ E “exemplary” của test case tốt — ghi chú của thầy/cô ở trang 40: test case tốt có thể test nhiều điều kiện cùng lúc.</p>`],
      [45, 'Task 3: build test cases',
        `<p class="y-chinh">🎯 Task 3 makes the tests runnable: scripts, starting data and expected results — all before execution.</p>
<ul>
<li><strong>Prepare test scripts</strong> — the less the tester knows the system, the more detailed the scripts must be; scripts for tools must specify every detail.</li>
<li><strong>Prepare test data</strong> — the data that must exist in files and databases at the start of the tests.</li>
<li><strong>Prepare expected results</strong> — defined before the test is executed.</li>
</ul>
<p class="nhan">Why expected results come first</p>
<p>If you decide what is “right” only after seeing the output, you tend to accept whatever the system shows — confirmation bias (lesson 1.5).</p>
<p class="ghi-chu">Current terms: test implementation (slide 85). A manual script is now a <em>test procedure</em>; “test script” is used mainly for automated tests.</p>`,
        `<p class="y-chinh">🎯 Việc 3 làm cho test chạy được: script, dữ liệu ban đầu và kết quả mong đợi — tất cả trước khi thực thi.</p>
<ul>
<li><strong>Chuẩn bị test script</strong> — tester càng ít hiểu hệ thống thì script càng phải chi tiết; script cho công cụ phải ghi mọi chi tiết.</li>
<li><strong>Chuẩn bị dữ liệu test</strong> — dữ liệu phải có sẵn trong file và cơ sở dữ liệu lúc bắt đầu test.</li>
<li><strong>Chuẩn bị kết quả mong đợi</strong> — xác định trước khi chạy test.</li>
</ul>
<p class="nhan">Vì sao kết quả mong đợi phải có trước</p>
<p>Nếu đợi xem output rồi mới quyết định thế nào là “đúng”, bạn dễ chấp nhận mọi thứ hệ thống hiện ra — confirmation bias (bài 1.5).</p>
<p class="ghi-chu">Thuật ngữ hiện hành: test implementation (slide 85). Script chạy tay nay gọi là <em>test procedure</em>; “test script” chủ yếu dùng cho test tự động.</p>`],
      [47, 'Execution',
        `<p class="y-chinh">🎯 Run the prescribed test cases, most important first — and know the three situations in which you would not run them all.</p>
<ul>
<li><strong>Execute prescribed test cases</strong> — the ones built in specification, most important first.</li>
<li><strong>Manual or automated</strong> — both count as execution.</li>
</ul>
<p class="nhan">You would not execute all test cases if…</p>
<ol>
<li><strong>Testing only fault fixes</strong> — run the confirmation tests plus a chosen part of the regression suite.</li>
<li><strong>Too many faults found by early test cases</strong> — the build is not ready; stop and send it back. The IEEE 829 plan calls this a suspension criterion.</li>
<li><strong>Time pressure</strong> — because tests run in priority order, what has run so far is still the best testing possible.</li>
</ol>`,
        `<p class="y-chinh">🎯 Chạy các test case đã định, cái quan trọng nhất trước — và biết ba tình huống không chạy hết.</p>
<ul>
<li><strong>Chạy test case đã định</strong> — những cái đã dựng ở bước specification, quan trọng nhất trước.</li>
<li><strong>Chạy tay hay tự động</strong> — đều tính là execution.</li>
</ul>
<p class="nhan">Không chạy hết test case khi…</p>
<ol>
<li><strong>Chỉ test các bản sửa lỗi</strong> — chạy confirmation test cộng một phần được chọn của bộ regression.</li>
<li><strong>Test đầu tiên đã tìm ra quá nhiều lỗi</strong> — bản build chưa sẵn sàng; dừng và trả lại. Test plan IEEE 829 gọi đây là suspension criterion.</li>
<li><strong>Áp lực thời gian</strong> — vì test chạy theo thứ tự ưu tiên, phần đã chạy vẫn là phần test tốt nhất có thể.</li>
</ol>`],
      [49, 'Test recording 1',
        `<p class="y-chinh">🎯 The test record proves exactly what was tested, on which version, and with what result.</p>
<p class="nhan">The test record contains</p>
<ul>
<li><strong>Identities and versions</strong>, unambiguously, of the software under test and of the test specifications.</li>
</ul>
<p class="nhan">Follow the plan</p>
<ul>
<li><strong>Mark off progress</strong> on the test script.</li>
<li><strong>Document actual outcomes</strong> from the test.</li>
<li><strong>Capture ideas</strong> for new test cases that occur to you while testing.</li>
<li><strong>Audit trail</strong> — these records establish that all test activities were carried out as specified.</li>
</ul>
<p class="nhan">Why versions matter</p>
<p>A failure reported against “the latest build” cannot be reproduced once a newer build exists. Configuration management (lesson 7.4) keeps test items and testware identifiable.</p>
<p class="ghi-chu">Current term: the test record is the <em>test log</em>, written during test execution.</p>`,
        `<p class="y-chinh">🎯 Test record chứng minh chính xác cái gì đã được test, trên phiên bản nào, với kết quả gì.</p>
<p class="nhan">Test record gồm</p>
<ul>
<li><strong>Định danh và phiên bản</strong>, rõ ràng không nhầm lẫn, của phần mềm đang test và của các test specification.</li>
</ul>
<p class="nhan">Làm theo kế hoạch</p>
<ul>
<li><strong>Đánh dấu tiến độ</strong> trên test script.</li>
<li><strong>Ghi kết quả thực tế</strong> của từng test.</li>
<li><strong>Ghi lại ý tưởng</strong> test case mới nảy ra trong lúc test.</li>
<li><strong>Dấu vết kiểm tra</strong> — các bản ghi này chứng minh mọi hoạt động test đã làm đúng như đặc tả.</li>
</ul>
<p class="nhan">Vì sao phiên bản quan trọng</p>
<p>Failure báo trên “bản build mới nhất” sẽ không tái hiện được khi đã có build mới hơn. Configuration management (bài 7.4) giữ cho hạng mục test và testware luôn định danh được.</p>
<p class="ghi-chu">Thuật ngữ hiện hành: test record nay là <em>test log</em>, ghi trong lúc test execution.</p>`],
      [50, 'Test recording 2',
        `<p class="y-chinh">🎯 Compare actual with expected, classify every discrepancy — only one of the four kinds is a software defect.</p>
<p class="nhan">Four kinds of discrepancy to log</p>
<ol>
<li><strong>Software fault</strong> — a real defect in the product.</li>
<li><strong>Test fault</strong> — e.g. the expected result was wrong.</li>
<li><strong>Environment or version fault</strong> — wrong configuration, wrong build, broken test data.</li>
<li><strong>Test run incorrectly</strong> — the tester skipped or mistyped a step.</li>
</ol>
<p class="nhan">Also log</p>
<ul>
<li><strong>Coverage levels achieved</strong> — for the measures used as completion criteria (page 53).</li>
<li><strong>After a fix</strong> — repeat the required activities: execute again, and if needed design or plan again.</li>
</ul>
<p class="ghi-chu">Current wording: kinds 2–4 are <em>false positives</em>, which is why a tester must check that tests are correct before reporting a defect (slide 111, lesson 1.5). Re-running after a fix = confirmation testing plus regression testing.</p>`,
        `<p class="y-chinh">🎯 So thực tế với mong đợi, phân loại mọi sai khác — chỉ một trong bốn loại là defect của phần mềm.</p>
<p class="nhan">Bốn loại sai khác cần ghi</p>
<ol>
<li><strong>Software fault</strong> — defect thật trong sản phẩm.</li>
<li><strong>Test fault</strong> — ví dụ kết quả mong đợi viết sai.</li>
<li><strong>Lỗi môi trường hoặc phiên bản</strong> — cấu hình sai, nhầm build, dữ liệu test hỏng.</li>
<li><strong>Chạy test sai</strong> — tester bỏ sót hay gõ nhầm một bước.</li>
</ol>
<p class="nhan">Ghi thêm</p>
<ul>
<li><strong>Mức coverage đạt được</strong> — cho các số đo dùng làm tiêu chí hoàn thành (trang 53).</li>
<li><strong>Sau khi sửa</strong> — lặp lại các hoạt động cần thiết: chạy lại, và nếu cần thì thiết kế lại hay lập kế hoạch lại.</li>
</ul>
<p class="ghi-chu">Cách gọi hiện hành: loại 2–4 là <em>false positive</em>, vì vậy tester phải kiểm test đúng rồi mới báo defect (slide 111, bài 1.5). Chạy lại sau khi sửa = confirmation testing cộng regression testing.</p>`],
      [52, 'Check test completion',
        `<p class="y-chinh">🎯 Check the results against the completion criteria from the plan; if they are not met, loop back and test more.</p>
<ul>
<li><strong>Criteria come from the test plan</strong> — set during detailed planning (page 36).</li>
<li><strong>Not met</strong> — repeat test activities, e.g. go back to specification to design more tests.</li>
</ul>
<p class="nhan">The loop in the diagram</p>
<ol>
<li><strong>Coverage too low</strong> — the arrow returns from check completion to specification.</li>
<li><strong>Coverage OK</strong> — the arrow leaves the process: testing of this level may stop.</li>
</ol>
<p class="ghi-chu">Current wording: “evaluating exit criteria”, part of test monitoring &amp; control in CTFL 2018 (slide 80).</p>`,
        `<p class="y-chinh">🎯 Đối chiếu kết quả với tiêu chí hoàn thành trong plan; chưa đạt thì quay lại test thêm.</p>
<ul>
<li><strong>Tiêu chí lấy từ test plan</strong> — đặt ra ở bước lập kế hoạch chi tiết (trang 36).</li>
<li><strong>Chưa đạt</strong> — lặp lại hoạt động test, ví dụ quay về specification để thiết kế thêm test.</li>
</ul>
<p class="nhan">Vòng lặp trong sơ đồ</p>
<ol>
<li><strong>Coverage too low</strong> — mũi tên từ check completion quay về specification.</li>
<li><strong>Coverage OK</strong> — mũi tên đi ra ngoài: được dừng test cấp này.</li>
</ol>
<p class="ghi-chu">Cách gọi hiện hành: “evaluating exit criteria”, thuộc test monitoring &amp; control trong CTFL 2018 (slide 80).</p>`],
      [53, 'Test completion criteria',
        `<p class="y-chinh">🎯 Completion (exit) criteria exist at every test level and tell you when to stop — measured by coverage, faults or cost and time.</p>
<p class="nhan">Kinds of criteria on the page</p>
<ul>
<li><strong>Coverage</strong>, using a measurement technique — e.g. branch coverage for unit testing (lesson 5.1), coverage of user requirements, coverage of the most frequently used transactions.</li>
<li><strong>Faults found</strong> — e.g. compared with the number expected.</li>
<li><strong>Cost or time</strong> — the budget or schedule is used up.</li>
</ul>
<p class="nhan">Current CTFL examples</p>
<ul>
<li>Planned tests have been executed.</li>
<li>A defined level of coverage has been achieved.</li>
<li>Unresolved defects are within an agreed limit.</li>
<li>Reliability, performance and other quality characteristics have been evaluated.</li>
</ul>
<div class="pitfall">“Cost or time” is a legitimate reason to stop only if the stakeholders accept the remaining risk — that is why test summary reports list what was <em>not</em> tested.</div>`,
        `<p class="y-chinh">🎯 Tiêu chí hoàn thành (exit criteria) có ở mọi cấp test và cho biết khi nào dừng — đo bằng coverage, số lỗi, hoặc chi phí và thời gian.</p>
<p class="nhan">Các loại tiêu chí trên slide</p>
<ul>
<li><strong>Coverage</strong>, đo bằng một kỹ thuật cụ thể — ví dụ branch coverage cho unit test (bài 5.1), mức phủ yêu cầu người dùng, mức phủ các giao dịch dùng nhiều nhất.</li>
<li><strong>Số lỗi tìm được</strong> — ví dụ so với số dự kiến.</li>
<li><strong>Chi phí hoặc thời gian</strong> — hết ngân sách hay hết lịch.</li>
</ul>
<p class="nhan">Ví dụ theo CTFL hiện hành</p>
<ul>
<li>Đã chạy hết các test đã lên kế hoạch.</li>
<li>Đạt mức coverage đã định.</li>
<li>Số defect chưa xử lý nằm trong giới hạn đã thoả thuận.</li>
<li>Đã đánh giá reliability, performance và các đặc tính chất lượng khác.</li>
</ul>
<div class="pitfall">“Hết chi phí hay thời gian” chỉ là lý do dừng hợp lệ khi các bên liên quan chấp nhận phần rủi ro còn lại — vì thế báo cáo tổng kết test luôn ghi rõ cái gì <em>chưa</em> được test.</div>`],
      [57, 'Confidence',
        `<p class="y-chinh">🎯 Confidence rises while tests pass and drops each time a fault is found — so “no faults found” means nothing unless the tests were good.</p>
<p class="nhan">Reading the chart</p>
<ul>
<li><strong>Rising line</strong> — confidence grows over time as tests pass.</li>
<li><strong>Two sudden drops</strong> — labelled “Faults found”: each fault shakes confidence.</li>
<li><strong>After the fixes</strong> — the line climbs again and ends higher than before.</li>
</ul>
<p class="nhan">No faults found = confidence?</p>
<p>Only if the tests were good. With weak tests you may think you are in the top-right corner while you are really bottom-left (page 58 / slide 101). Testing shows the presence of defects, not their absence (principle 1).</p>
<p class="meo">🧠 <strong>Remember:</strong> the testing paradox (slide 108) — the best way to build confidence is to try to destroy it.</p>`,
        `<p class="y-chinh">🎯 Niềm tin tăng khi test qua và tụt mỗi khi tìm ra lỗi — nên “không tìm thấy lỗi” chẳng nói lên gì nếu bộ test kém.</p>
<p class="nhan">Đọc biểu đồ</p>
<ul>
<li><strong>Đường đi lên</strong> — niềm tin tăng dần theo thời gian khi test qua.</li>
<li><strong>Hai cú tụt</strong> — ghi “Faults found”: mỗi lỗi làm lung lay niềm tin.</li>
<li><strong>Sau khi sửa</strong> — đường lại leo lên và kết thúc cao hơn trước.</li>
</ul>
<p class="nhan">Không tìm thấy lỗi = có niềm tin?</p>
<p>Chỉ khi bộ test tốt. Test kém thì bạn tưởng mình ở góc trên bên phải trong khi thật ra ở góc dưới bên trái (trang 58 / slide 101). Kiểm thử cho thấy defect có mặt, không chứng minh defect vắng mặt (nguyên tắc 1).</p>
<p class="meo">🧠 <strong>Mẹo nhớ:</strong> nghịch lý kiểm thử (slide 108) — cách tốt nhất để xây niềm tin là cố phá nó.</p>`],
    ]),
    bi(`<h3>Worked example — one condition through the 2023 process</h3>
<p>Rule: “orders of more than 99 items need a manager’s approval”. Follow the condition “number items ordered &gt; 99” (page 41) through every box of page 37.</p>
<table><thead><tr><th>2023 step</th><th>What you produce</th></tr></thead><tbody>
<tr><td>Planning (detailed)</td><td>Exit criterion: every boundary of the order form tested, no open high-severity defect</td></tr>
<tr><td>Identify</td><td>Conditions: 99 items → no approval; 100 items → approval required</td></tr>
<tr><td>Design</td><td>TC1: qty 99 → order placed, stock −99. TC2: qty 100 → order “awaiting approval”, stock <em>not</em> changed</td></tr>
<tr><td>Build</td><td>Test data: a product with 500 in stock; script steps; expected results written down</td></tr>
<tr><td>Execution</td><td>Run TC1, then TC2</td></tr>
<tr><td>Recording</td><td>TC2 places the order directly. The spec says “&gt; 99”, so the expected result is right: a <em>software fault</em>, logged with the build number</td></tr>
<tr><td>Check completion</td><td>A high-severity defect is open → criteria not met. After the fix: rerun TC2 (confirmation) and TC1 (regression), then check again</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><strong>Exam traps from the 2023 pages.</strong>
<ul>
<li><strong>“Fault-free ⇒ reliable”</strong> and <strong>“reliable ⇒ fault-free”</strong> — both false (page 6).</li>
<li><strong>Check completion ≠ test completion</strong> — the first decides whether to stop, the second closes the work afterwards (page 37).</li>
<li><strong>Not every failed test is a defect</strong> — test faults, environment faults and wrong runs are false positives (page 50).</li>
<li><strong>Policy vs strategy vs plan</strong> — policy: company, static, what testing means; strategy: programme-wide rules; plan: one project or level, with dates and people (pages 31–36).</li>
<li><strong>Expected results before execution</strong> — never after (page 45).</li>
</ul></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <strong>What replaced BS 7925 and IEEE 829.</strong>
<ul>
<li><strong>ISO/IEC/IEEE 29119</strong> (from 2013) superseded both standards the 2023 deck cites.</li>
<li><strong>Part 2, test processes</strong> — organisational, test management and dynamic test processes: the grown-up form of pages 31–53.</li>
<li><strong>Part 3, documentation</strong> — test policy, organisational test strategy, test plan, test specifications, test log: the same documents, current names.</li>
</ul></div>`,
    `<h3>Ví dụ có lời giải — một điều kiện đi qua quy trình 2023</h3>
<p>Quy tắc: “đơn đặt quá 99 món cần quản lý duyệt”. Theo điều kiện “số món đặt &gt; 99” (trang 41) qua từng ô của trang 37.</p>
<table><thead><tr><th>Bước 2023</th><th>Bạn làm ra gì</th></tr></thead><tbody>
<tr><td>Planning (chi tiết)</td><td>Exit criterion: mọi biên của form đặt hàng đã test, không còn defect nghiêm trọng đang mở</td></tr>
<tr><td>Identify</td><td>Điều kiện: 99 món → không cần duyệt; 100 món → phải duyệt</td></tr>
<tr><td>Design</td><td>TC1: 99 món → đặt thành công, kho −99. TC2: 100 món → đơn “chờ duyệt”, kho <em>không</em> đổi</td></tr>
<tr><td>Build</td><td>Dữ liệu test: một sản phẩm tồn kho 500; các bước script; kết quả mong đợi ghi sẵn</td></tr>
<tr><td>Execution</td><td>Chạy TC1, rồi TC2</td></tr>
<tr><td>Recording</td><td>TC2 đặt hàng thẳng. Đặc tả ghi “&gt; 99”, nên kết quả mong đợi đúng: đây là <em>software fault</em>, ghi kèm số build</td></tr>
<tr><td>Check completion</td><td>Còn một defect nghiêm trọng đang mở → chưa đạt tiêu chí. Sau khi sửa: chạy lại TC2 (confirmation) và TC1 (regression), rồi kiểm lại</td></tr>
</tbody></table>
<div class="pitfall co-tieu-de"><strong>Bẫy đề thi từ các trang 2023.</strong>
<ul>
<li><strong>“Không có fault ⇒ tin cậy”</strong> và <strong>“tin cậy ⇒ không có fault”</strong> — đều sai (trang 6).</li>
<li><strong>Check completion ≠ test completion</strong> — cái trước quyết định có dừng không, cái sau khép lại công việc sau khi dừng (trang 37).</li>
<li><strong>Không phải test hỏng nào cũng là defect</strong> — test fault, lỗi môi trường, chạy sai đều là false positive (trang 50).</li>
<li><strong>Policy vs strategy vs plan</strong> — policy: cấp công ty, tĩnh, kiểm thử nghĩa là gì; strategy: quy tắc cho cả chương trình; plan: một dự án hay một cấp, có ngày tháng và người làm (trang 31–36).</li>
<li><strong>Kết quả mong đợi có trước khi chạy</strong> — không bao giờ sau (trang 45).</li>
</ul></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <strong>Thứ đã thay BS 7925 và IEEE 829.</strong>
<ul>
<li><strong>ISO/IEC/IEEE 29119</strong> (từ 2013) thay thế cả hai tiêu chuẩn mà slide 2023 trích dẫn.</li>
<li><strong>Phần 2, quy trình test</strong> — quy trình cấp tổ chức, quản lý test và test động: dạng trưởng thành của trang 31–53.</li>
<li><strong>Phần 3, tài liệu</strong> — test policy, organisational test strategy, test plan, test specification, test log: vẫn những tài liệu ấy, tên hiện hành.</li>
</ul></div>`),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz 1 ──────────────────────────────── */
// Every "Question" slide of SWT1 (35) + 11 extra checks on the non-question slides
// + 6 on the 2023 deck (lesson 1.6).
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ1 = {
  title: 'Quiz 1 — Fundamentals of testing (all SWT1 slide questions)|||Quiz 1 — Nền tảng kiểm thử (toàn bộ câu hỏi trên slide SWT1)',
  slug: 'swt301-quiz-1',
  type: 'QUIZ',
  description: '52 câu: đủ 35 câu "Question" trên slide SWT1 (đáp án đã giải trong bài 1.1–1.5) + 11 câu kiểm tra phần lý thuyết + 6 câu về bộ slide 2023 (bài 1.6).',
  quiz: {
    timeLimitSeconds: 3000,
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
      // Lesson 1.6 — the 2023 deck (oswt1). explanation is plain text EN|||VI.
      { ...q('Which statement about reliability and faults is TRUE? (SWT1 2023 p.6)|||Câu nào về reliability và fault là ĐÚNG? (SWT1 2023 tr.6)', ['A fault-free application is always reliable|||Ứng dụng không có fault thì luôn tin cậy', 'Software can be reliable and still contain faults|||Phần mềm có thể tin cậy mà vẫn chứa fault', 'Reliability is the number of faults found per test|||Reliability là số fault tìm được trên mỗi test', 'Thorough testing can make a system fault-free|||Test kỹ có thể làm hệ thống hết sạch fault'], 1), explanation: 'A defect only matters when it is executed under the right conditions, so reliable software can still hold defects; zero faults can never be shown, and fault-free software can still fail in its environment.|||Defect chỉ gây hại khi được thực thi đúng điều kiện, nên phần mềm tin cậy vẫn có thể chứa defect; không thể chứng minh zero fault, và phần mềm không fault vẫn có thể hỏng do môi trường.' },
      { ...q('In the 2023 process, "identify test conditions" corresponds to which CTFL 2018 activity? (p.39)|||Trong quy trình 2023, "identify test conditions" ứng với hoạt động CTFL 2018 nào? (tr.39)', ['Test planning', 'Test analysis', 'Test design', 'Test implementation'], 1), explanation: 'Identify = WHAT to test = test analysis; design = HOW = test design; build = test implementation.|||Identify = test CÁI GÌ = test analysis; design = THẾ NÀO = test design; build = test implementation.' },
      { ...q('Which document is a very high-level, relatively static statement of what testing means to the organisation and how test success is measured? (p.33)|||Tài liệu nào là tuyên bố cấp rất cao, khá tĩnh, về việc kiểm thử có ý nghĩa gì với tổ chức và thành công được đo thế nào? (tr.33)', ['Test policy', 'Test strategy', 'Project (high-level) test plan|||Test plan cấp dự án (high-level)', 'Detailed (level) test plan|||Test plan chi tiết (level)'], 0), explanation: 'The test policy sits at organisation level and changes only when the organisation’s focus changes; the strategy adds programme-wide rules, the plans add project and level detail.|||Test policy ở cấp tổ chức và chỉ đổi khi trọng tâm tổ chức đổi; strategy thêm quy tắc cho cả chương trình, còn các plan thêm chi tiết của dự án và từng cấp.' },
      { ...q('A test fails because the expected result written in the test case was wrong. How is this discrepancy logged? (p.50)|||Một test hỏng vì kết quả mong đợi ghi trong test case bị sai. Sai khác này được ghi là gì? (tr.50)', ['Software fault|||Lỗi phần mềm (software fault)', 'Test fault', 'Environment or version fault|||Lỗi môi trường hoặc phiên bản', 'Test run incorrectly|||Chạy test sai'], 1), explanation: 'The product behaved correctly; the test itself was wrong. Today this is a false positive, which is why testers check their tests before reporting a defect.|||Sản phẩm chạy đúng; chính bài test sai. Nay gọi là false positive, vì thế tester phải kiểm test của mình trước khi báo defect.' },
      { ...q('In the 2023 process, what happens when "check test completion" finds that coverage is too low? (p.52)|||Trong quy trình 2023, khi "check test completion" thấy coverage quá thấp thì làm gì? (tr.52)', ['Stop testing and write the summary report|||Dừng test và viết báo cáo tổng kết', 'Go back to test specification and design more tests|||Quay lại test specification và thiết kế thêm test', 'Lower the completion criteria|||Hạ tiêu chí hoàn thành xuống', 'Release the software with a warning|||Phát hành phần mềm kèm cảnh báo'], 1), explanation: 'The diagram loops "coverage too low" back to specification; only "coverage OK" leaves the process.|||Sơ đồ vẽ vòng "coverage too low" quay về specification; chỉ khi "coverage OK" mới ra khỏi quy trình.' },
      { ...q('Which is NOT one of the test completion (exit) criteria on p.53?|||Đâu KHÔNG phải tiêu chí hoàn thành (exit criteria) nêu ở tr.53?', ['Branch coverage for unit testing|||Branch coverage cho unit test', 'Faults found compared with the number expected|||Số lỗi tìm được so với số dự kiến', 'Cost or time|||Chi phí hoặc thời gian', 'The developer says the code is finished|||Developer nói code đã xong'], 3), explanation: 'The page lists coverage (branch, user requirements, frequent transactions), faults found versus expected, and cost or time. A developer’s opinion is not a measurable criterion.|||Trang slide nêu coverage (branch, yêu cầu người dùng, giao dịch dùng nhiều), số lỗi so với dự kiến, và chi phí hoặc thời gian. Ý kiến của developer không phải tiêu chí đo được.' },
    ],
  },
};

export default {
  title: 'Chapter 1 — Fundamentals of testing|||Chương 1 — Nền tảng kiểm thử',
  description: 'SWT1 (114 slide) học từng slide: kiểm thử là gì, vì sao cần, 7 nguyên tắc, quy trình 7 hoạt động, tâm lý & đạo đức — kèm đáp án mọi câu hỏi trên slide và trang sách tương ứng; bài 1.6 bổ sung những trang chỉ có trong bộ slide 2023.',
  lessons: [L11, L12, L13, L14, L15, L16, QUIZ1],
};
