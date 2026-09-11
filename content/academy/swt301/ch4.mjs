/**
 * SWT301 · Chapter 4 (part 1) — Test design: black-box techniques.
 * Source: SWT4_tim.pptx visible slides 1–81 (the part of the deck BEFORE the
 * "CONTENTS" slide 82 that opens White-box Test Techniques; slides 82–112 are
 * covered by the next module) + hidden pptx slide 6 (summarised in text) +
 * teacher's speaker notes + the PE template "SWT301_FA23 template.xlsx" and the
 * FA23 PE paper (Question 3).
 * Lesson split follows the deck's own CONTENTS slides:
 *   4.1 Categories of test techniques     slides 1–14 (+ hidden pptx 6)
 *   4.2 Equivalence partitioning          slides 15–28
 *   4.3 Boundary value analysis + PE tpl  slides 29–42
 *   4.4 Decision table testing            slides 43–59
 *   4.5 State transition testing          slides 60–72
 *   4.6 Use case testing + review Qs      slides 73–81
 * Every numeric answer was re-computed with a script (partitions, boundaries,
 * rules, transitions) and the Java example was compiled and run (JDK 21).
 */
import { walk, walkHead, books, bi, ansEn as AE, ansVi as AV } from './_slides.mjs';

const D = 'swt4';

/* ───────────────────── 4.1 Categories of test techniques ───────────────────── */
const L41 = {
  title: '4.1 — Categories of test techniques: black-box, white-box, experience-based|||4.1 — Phân loại kỹ thuật test: black-box, white-box, dựa kinh nghiệm',
  slug: 'swt301-test-technique-categories',
  type: 'VIDEO',
  description: 'SWT4 slide 1–14: mục đích của kỹ thuật test, cây phân loại static/dynamic, black-box vs white-box vs experience-based (test basis, cách dùng, độ phủ) — kèm đáp án 6 câu hỏi trên slide và slide ẩn pptx 6.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.1 · SWT4 slides 1–14</span>
<h2>Categories of test techniques</h2>
<p class="lead">Chapter 4 is the <strong>heaviest chapter of the ISTQB exam (11 of 40 questions)</strong> and the heart of the practical exam: PE Question 2 is white-box, PE Question 3 is black-box (EP + BVA table with tags, then test cases). This first lesson gives you the map: what a test technique is for, and how the three families — <strong>black-box</strong>, <strong>white-box</strong> and <strong>experience-based</strong> — differ in test basis, use and coverage.</p>
<div class="callout"><b>Learning objectives.</b> LO-4.1.1 Explain the characteristics, commonalities and differences between black-box, white-box and experience-based test techniques (K2). The rest of this module covers LO-4.2.1–4.2.5 (the five black-box techniques).</div>
<h3>The essentials in one screen</h3>
<table>
<thead><tr><th></th><th>Black-box (specification-based)</th><th>White-box (structure-based)</th><th>Experience-based</th></tr></thead>
<tbody>
<tr><td>Test basis</td><td>Requirements, specifications, use cases, user stories</td><td>Architecture, detailed design, internal structure, code</td><td>Knowledge &amp; experience of testers, developers, users</td></tr>
<tr><td>Finds</td><td>Gaps and deviations between requirements and their implementation</td><td>Paths through the software that were (or were not) taken</td><td>Defects the other two miss; works with little or outdated documentation</td></tr>
<tr><td>Coverage</td><td>Items of the test basis tested (partitions, boundaries, rules, transitions)</td><td>Items of a structure exercised (statements, decisions)</td><td>Not formally measurable</td></tr>
<tr><td>Techniques in SWT301</td><td>EP · BVA · decision table · state transition · use case</td><td>Statement · decision coverage</td><td>Error guessing · exploratory · checklist-based</td></tr>
<tr><td>Levels</td><td>All levels, dominates higher levels</td><td>All levels, mostly component/integration</td><td>All levels</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 4 · Bài 4.1 · SWT4 slide 1–14</span>
<h2>Phân loại kỹ thuật thiết kế test</h2>
<p class="lead">Chương 4 là <strong>chương nặng nhất của đề ISTQB (11/40 câu)</strong> và là trái tim của đề thực hành: PE câu 2 là white-box, PE câu 3 là black-box (bảng EP + BVA có tag, rồi thiết kế test case). Bài đầu tiên này cho bạn tấm bản đồ: kỹ thuật test dùng để làm gì, và ba họ kỹ thuật — <strong>black-box</strong>, <strong>white-box</strong>, <strong>dựa kinh nghiệm</strong> — khác nhau thế nào về test basis, cách dùng và độ phủ.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-4.1.1 Giải thích đặc điểm, điểm chung và điểm khác nhau giữa kỹ thuật black-box, white-box và dựa kinh nghiệm (K2). Phần còn lại của module này phủ LO-4.2.1–4.2.5 (năm kỹ thuật black-box).</div>
<h3>Cốt lõi trong một màn hình</h3>
<table>
<thead><tr><th></th><th>Black-box (dựa đặc tả)</th><th>White-box (dựa cấu trúc)</th><th>Dựa kinh nghiệm</th></tr></thead>
<tbody>
<tr><td>Test basis</td><td>Yêu cầu, đặc tả, use case, user story</td><td>Kiến trúc, thiết kế chi tiết, cấu trúc bên trong, code</td><td>Kiến thức &amp; kinh nghiệm của tester, dev, người dùng</td></tr>
<tr><td>Tìm ra</td><td>Chỗ hổng và sai lệch giữa yêu cầu và phần cài đặt</td><td>Các đường đi trong phần mềm đã (hoặc chưa) được chạy qua</td><td>Defect hai họ kia bỏ sót; dùng được khi tài liệu ít hoặc lỗi thời</td></tr>
<tr><td>Độ phủ</td><td>Số phần tử của test basis đã test (partition, biên, rule, transition)</td><td>Số phần tử cấu trúc đã chạy (statement, decision)</td><td>Không đo chính thức được</td></tr>
<tr><td>Kỹ thuật trong SWT301</td><td>EP · BVA · decision table · state transition · use case</td><td>Statement · decision coverage</td><td>Error guessing · exploratory · checklist-based</td></tr>
<tr><td>Cấp test</td><td>Mọi cấp, chiếm ưu thế ở cấp cao</td><td>Mọi cấp, chủ yếu component/integration</td><td>Mọi cấp</td></tr>
</tbody>
</table>`),
    walkHead(D, 1, 14),
    walk(D, [
      [1, 'Test Techniques (cover)',
        `<p>The six-box course map again (1 Principles · 2 Lifecycle · 3 Static testing · <strong>4 Test techniques</strong> · 5 Management · 6 Tools), with box 4 highlighted and zoomed into the title "Test Techniques — Chapter 4". This deck (112 visible slides) is the longest of the course. On this site it is split in two: slides 1–81 (categories + the five black-box techniques) are this module; slides 82–112 (white-box, experience-based, choosing techniques) are the next one.</p>`,
        `<p>Lại là bản đồ 6 ô của môn (1 Nguyên tắc · 2 Vòng đời · 3 Kiểm thử tĩnh · <strong>4 Kỹ thuật test</strong> · 5 Quản lý · 6 Công cụ), ô 4 được tô và phóng to thành tiêu đề "Test Techniques — Chapter 4". Bộ slide này (112 slide hiển thị) dài nhất môn. Trên trang này nó được chia đôi: slide 1–81 (phân loại + năm kỹ thuật black-box) là module này; slide 82–112 (white-box, dựa kinh nghiệm, chọn kỹ thuật) nằm ở module kế tiếp.</p>`],
      [2, 'CONTENTS',
        `<p>The chapter agenda: Categories of Test Techniques · Black-box Test Techniques · White-box Test Techniques · Experience-based Test Techniques. It mirrors the four sections of the CTFL 2018 syllabus chapter 4 (4.1 categories, 4.2 black-box, 4.3 white-box, 4.4 experience-based).</p>`,
        `<p>Mục lục chương: Phân loại kỹ thuật · Kỹ thuật black-box · Kỹ thuật white-box · Kỹ thuật dựa kinh nghiệm. Nó bám đúng bốn mục của chương 4 syllabus CTFL 2018 (4.1 phân loại, 4.2 black-box, 4.3 white-box, 4.4 dựa kinh nghiệm).</p>`],
      [3, 'CONTENTS — Categories of Test Techniques',
        `<p>The same agenda with the first item highlighted: we start with the categories. Everything in slides 4–14 is about <em>classifying</em> techniques, which is exactly what K2 questions test ("which of these is a black-box technique?", "what is the test basis of white-box?").</p>`,
        `<p>Cùng mục lục, mục đầu được tô: bắt đầu với phần phân loại. Toàn bộ slide 4–14 xoay quanh việc <em>phân loại</em> kỹ thuật — đúng dạng câu hỏi K2 ("kỹ thuật nào là black-box?", "test basis của white-box là gì?").</p>`],
      [4, 'Categories of Test Techniques — purpose of a technique',
        `<p>The key sentence (with the three red terms): <strong>the purpose of a test technique is to identify test conditions, test cases and test data</strong>. The diagram places them in the test process from Chapter 1 (lesson 1.4): <em>Test Analysis</em> produces <strong>test conditions</strong> ("what to test", e.g. "loan amount below £500 is rejected"); <em>Test Design</em> turns them into <strong>test cases</strong> and <strong>test data</strong> ("how to test", e.g. "enter £499, expect error E-07"); <em>Test Implementation</em> assembles them into procedures and scripts ready to run. A technique is therefore a thinking tool used in analysis and design — not an execution tool. This is also the ISTQB glossary definition asked on slide 13.</p>`,
        `<p>Câu then chốt (ba thuật ngữ màu đỏ): <strong>mục đích của một kỹ thuật test là xác định test condition, test case và test data</strong>. Sơ đồ đặt chúng vào quy trình test của Chương 1 (bài 1.4): <em>Test Analysis</em> tạo ra <strong>test condition</strong> ("test cái gì", vd "số tiền vay dưới £500 bị từ chối"); <em>Test Design</em> biến chúng thành <strong>test case</strong> và <strong>test data</strong> ("test thế nào", vd "nhập £499, mong đợi lỗi E-07"); <em>Test Implementation</em> ghép thành procedure/script sẵn sàng chạy. Vậy kỹ thuật là công cụ tư duy dùng ở pha phân tích và thiết kế — không phải công cụ chạy test. Đây cũng chính là định nghĩa trong glossary ISTQB được hỏi ở slide 13.</p>`],
      [5, 'Categories of Test Techniques — the tree',
        `<p>The family tree used in this course. <strong>Static</strong> (no execution, Chapter 3): peer reviews, walkthroughs, technical reviews, inspection, static analysis. <strong>Dynamic</strong> (execution) splits into three: <strong>structure-based</strong> (white-box: statement, decision), <strong>experience-based</strong> (error guessing, exploratory testing) and <strong>specification-based</strong> (black-box: EP, BVA, decision table testing, state transition testing, use case testing). Teacher's notes: black-box is also called specification-based, <em>behavioural</em> or behaviour-based, and it covers <strong>both functional and non-functional</strong> testing; the diagram only shows the techniques taught in this course — there are many more (see the hidden slide below and the ★ box).</p>
<div class="callout warn"><b>Exam trap:</b> <em>checklist-based testing</em> is also experience-based in CTFL 2018 even though it is missing from this tree (it appears later in the deck). And "static analysis" is not a black-box or white-box technique — it is static testing.</div>`,
        `<p>Cây phân loại dùng trong môn. <strong>Static</strong> (không chạy, Chương 3): peer review, walkthrough, technical review, inspection, phân tích tĩnh. <strong>Dynamic</strong> (có chạy) tách làm ba: <strong>dựa cấu trúc</strong> (white-box: statement, decision), <strong>dựa kinh nghiệm</strong> (error guessing, exploratory testing) và <strong>dựa đặc tả</strong> (black-box: EP, BVA, decision table, state transition, use case). Ghi chú của thầy/cô: black-box còn gọi là specification-based, <em>behavioural</em> hay behaviour-based, và bao gồm <strong>cả kiểm thử chức năng lẫn phi chức năng</strong>; sơ đồ chỉ vẽ các kỹ thuật được dạy trong môn — ngoài kia còn rất nhiều (xem slide ẩn bên dưới và hộp ★).</p>
<div class="callout warn"><b>Bẫy thi:</b> <em>checklist-based testing</em> cũng thuộc nhóm dựa kinh nghiệm theo CTFL 2018 dù không có trên cây này (nó xuất hiện ở phần sau của bộ slide). Và "static analysis" không phải kỹ thuật black-box hay white-box — nó là kiểm thử tĩnh.</div>`],
      [6, 'Three Types of Systematic Test Techniques',
        `<p>An older, simpler view with three pictures. <strong>Static (non-execution)</strong> — a magnifying glass over a document: examination of documentation, source code listings, etc. <strong>Behavioural (black box)</strong> — a closed grey box with an input arrow and an output arrow: tests are based on the behaviour/functionality of the software; you cannot see inside. <strong>Structural (white box)</strong> — a transparent box with a flowchart inside: tests are based on the structure of the software. Memory hook: black = you only see what goes in and what comes out; white (better: "glass") = you see the wiring.</p>`,
        `<p>Một góc nhìn cũ và đơn giản hơn với ba hình. <strong>Static (không thực thi)</strong> — kính lúp soi tài liệu: xem xét tài liệu, bản in mã nguồn… <strong>Behavioural (hộp đen)</strong> — hộp xám kín với mũi tên input và output: test dựa trên hành vi/chức năng của phần mềm, không nhìn được bên trong. <strong>Structural (hộp trắng)</strong> — hộp trong suốt có lưu đồ bên trong: test dựa trên cấu trúc phần mềm. Mẹo nhớ: đen = chỉ thấy cái đi vào và cái đi ra; trắng (đúng hơn là "hộp kính") = thấy cả dây dẫn bên trong.</p>`],
      [7, 'Black box vs. White box — by test level',
        `<p>A staircase of the four test levels (component → integration → system → acceptance) on a black-to-white background. <strong>Black-box is appropriate at all levels but dominates the higher levels</strong> (system, acceptance: users and business analysts think in requirements, not code). <strong>White-box is used predominantly at the lower levels to complement black-box</strong> (component and integration: developers see the code). The slide writes "compliment" — it means <em>complement</em> (add to), not "praise". Nuance for the exam: CTFL 2018 says white-box techniques can be used at <em>all</em> levels — e.g. at system level the "structure" can be a menu tree or a business-process flow, at integration level the call graph between components.</p>`,
        `<p>Bậc thang bốn cấp test (component → integration → system → acceptance) trên nền chuyển từ đen sang trắng. <strong>Black-box phù hợp ở mọi cấp nhưng chiếm ưu thế ở cấp cao</strong> (system, acceptance: người dùng và BA nghĩ theo yêu cầu, không theo code). <strong>White-box dùng chủ yếu ở cấp thấp để bổ sung cho black-box</strong> (component, integration: dev nhìn thấy code). Slide viết "compliment" — ý là <em>complement</em> (bổ sung), không phải "khen ngợi". Lưu ý khi thi: CTFL 2018 nói white-box dùng được ở <em>mọi</em> cấp — ví dụ ở cấp system, "cấu trúc" có thể là cây menu hay luồng quy trình nghiệp vụ; ở cấp integration là đồ thị gọi giữa các thành phần.</p>`],
      [8, 'Dynamic Testing: 3 Sub-categories (table)',
        `<p>The most exam-relevant slide of the lesson — learn the table row by row.</p>
<ul>
<li><strong>Test basis.</strong> Black-box: software requirements specifications, use cases, user stories. White-box: architecture analysis, detailed design, internal structure, code. Experience-based: the knowledge of testers, developers and users.</li>
<li><strong>Utilisation.</strong> Black-box detects <em>gaps</em> between requirements and their implementation and <em>deviations</em> from requirements. White-box determines <em>paths through the software</em> that either were taken or need to be taken. Experience-based <em>complements</em> the other two and is used when there is <em>no, little or outdated</em> specification.</li>
<li><strong>Coverage.</strong> Black-box: based on the items tested in the test basis and the technique applied (e.g. "4 of 5 partitions"). White-box: based on the items tested within a selected structure (e.g. "18 of 20 statements"). Experience-based: N/A — there is no agreed coverage measure.</li>
</ul>`,
        `<p>Slide đáng học nhất của bài — thuộc bảng theo từng hàng.</p>
<ul>
<li><strong>Test basis.</strong> Black-box: đặc tả yêu cầu phần mềm, use case, user story. White-box: phân tích kiến trúc, thiết kế chi tiết, cấu trúc bên trong, code. Dựa kinh nghiệm: kiến thức của tester, developer và người dùng.</li>
<li><strong>Cách dùng.</strong> Black-box phát hiện <em>khoảng hở</em> giữa yêu cầu và phần cài đặt, và các <em>sai lệch</em> so với yêu cầu. White-box xác định <em>các đường đi trong phần mềm</em> đã được đi qua hoặc cần đi qua. Dựa kinh nghiệm <em>bổ sung</em> cho hai họ kia và được dùng khi <em>không có, có ít hoặc có đặc tả lỗi thời</em>.</li>
<li><strong>Độ phủ.</strong> Black-box: dựa trên số phần tử đã test trong test basis và kỹ thuật áp dụng (vd "4/5 partition"). White-box: dựa trên số phần tử đã chạy trong một cấu trúc được chọn (vd "18/20 statement"). Dựa kinh nghiệm: N/A — không có thước đo độ phủ thống nhất.</li>
</ul>`],
      [9, 'Question — which option is a black-box technique?',
        AE(`D — Techniques based on formal requirements`, `Black-box techniques are based on an analysis of the test basis — formal requirements, specifications, use cases. A (analysis of the architecture) and B (checking against the technical design) are white-box: architecture and detailed design are the white-box test basis on slide 8. C ("the expected use of the software") describes an operational/usage profile or tester intuition, not the defining characteristic of black-box techniques.`),
        AV(`D — Kỹ thuật dựa trên yêu cầu chính thức`, `Kỹ thuật black-box dựa trên phân tích test basis — yêu cầu chính thức, đặc tả, use case. A (phân tích kiến trúc) và B (kiểm theo thiết kế kỹ thuật) là white-box: kiến trúc và thiết kế chi tiết chính là test basis của white-box ở slide 8. C ("cách phần mềm dự kiến được sử dụng") mô tả hồ sơ sử dụng (operational profile) hoặc trực giác của tester, không phải đặc trưng định nghĩa của black-box.`)],
      [10, 'Question — test cases derived from the code',
        AE(`B — White-box`, `Code (internal structure) is the white-box test basis. A, C and D are three names for the same black-box family (specification-based = behaviour-based = black-box), so they cannot be right.`),
        AV(`B — White-box`, `Code (cấu trúc bên trong) là test basis của white-box. A, C, D là ba tên gọi của cùng họ black-box (specification-based = behaviour-based = black-box), nên không thể đúng.`)],
      [11, 'Question — which technique uses the requirements specification as test basis?',
        AE(`B — Black-box`, `Requirements specifications are the classic black-box test basis. Structure-based (A) and white-box (C) are the same family and use code/design; exploratory (D) is experience-based and relies on the tester's knowledge, often when specifications are weak.`),
        AV(`B — Black-box`, `Đặc tả yêu cầu là test basis kinh điển của black-box. Structure-based (A) và white-box (C) là cùng một họ, dùng code/thiết kế; exploratory (D) thuộc nhóm dựa kinh nghiệm, dựa vào hiểu biết của tester, thường khi đặc tả yếu.`)],
      [12, 'Question — why are both black-box and white-box useful?',
        AE(`B — They find different types of defects`, `Black-box finds missing or wrongly implemented requirements (code that is not there cannot be covered by white-box!); white-box finds untested paths and code that the specification never mentions. A is a slogan, not a reason; C is false; D is irrelevant.`),
        AV(`B — Chúng tìm ra những loại defect khác nhau`, `Black-box tìm yêu cầu bị thiếu hoặc cài sai (code không tồn tại thì white-box không thể phủ!); white-box tìm đường đi chưa được test và đoạn code mà đặc tả không hề nhắc tới. A là khẩu hiệu, không phải lý do; C sai; D không liên quan.`)],
      [13, 'Question — definition of "test technique"',
        AE(`C — A procedure used to define test conditions, design test cases, and specify test data`, `This is the ISTQB glossary definition, exactly slide 4. A describes a test suite / execution schedule, B a session sheet in session-based exploratory testing, D a test procedure (script).`),
        AV(`C — Một thủ tục dùng để xác định test condition, thiết kế test case và chỉ định test data`, `Đây là định nghĩa trong glossary ISTQB, đúng như slide 4. A mô tả test suite / lịch chạy test, B là session sheet trong exploratory testing theo phiên, D là test procedure (script).`)],
      [14, 'Question — use cases are test basis for…',
        AE(`A — Black-box test technique`, `Use cases describe behaviour from the actor's point of view — a specification — so use case testing is one of the five black-box techniques (lesson 4.6). They are not code (B) and not the tester's experience (C).`),
        AV(`A — Kỹ thuật black-box`, `Use case mô tả hành vi từ góc nhìn tác nhân — tức là một dạng đặc tả — nên use case testing là một trong năm kỹ thuật black-box (bài 4.6). Nó không phải code (B) và không phải kinh nghiệm của tester (C).`)],
    ]),
    bi(`<h3>🔒 Hidden slide in SWT4_tim.pptx (pptx slide 6 — not shown in class)</h3>
<p>Between the tree of slide 5 and slide 6 the file hides the <strong>older, larger category tree</strong> taken from the British standard BS 7925-2. It is worth one look because FE questions sometimes name these techniques as distractors:</p>
<ul>
<li><strong>Static</strong>: peer reviews, walkthroughs, technical reviews, inspection, and static analysis split into <em>data flow</em>, <em>control flow</em> and <em>symbolic execution</em>.</li>
<li><strong>Dynamic → Structural</strong> (white-box): statement, branch/decision, branch condition, branch condition combination, <strong>LCSAJ</strong> (Linear Code Sequence And Jump — a sequence of statements followed by a jump), <em>arcs</em> (control-flow edges), <em>definition-use</em> (data-flow testing: every place a variable is assigned paired with where it is used), etc.</li>
<li><strong>Dynamic → Behavioural → Functional</strong> (black-box): equivalence partitioning, boundary value analysis, <strong>cause-effect graphing</strong> (the graphical ancestor of decision tables), <strong>random</strong> testing, state transition, etc.</li>
<li><strong>Dynamic → Behavioural → Non-functional</strong>: usability, performance, etc.</li>
</ul>
<p>Take-away: the modern tree of slide 5 is a subset. The CTFL 2018 exam only requires EP, BVA, decision tables, state transition and use case (black-box), statement and decision (white-box), and error guessing, exploratory and checklist-based (experience-based).</p>`,
    `<h3>🔒 Slide ẩn trong file SWT4_tim.pptx (slide pptx 6 — không chiếu trên lớp)</h3>
<p>Giữa cây ở slide 5 và slide 6, file ẩn đi <strong>cây phân loại cũ, lớn hơn</strong> lấy từ chuẩn Anh BS 7925-2. Đáng xem một lần vì đề FE đôi khi dùng tên các kỹ thuật này làm phương án nhiễu:</p>
<ul>
<li><strong>Static</strong>: peer review, walkthrough, technical review, inspection, và phân tích tĩnh tách thành <em>data flow</em>, <em>control flow</em>, <em>symbolic execution</em>.</li>
<li><strong>Dynamic → Structural</strong> (white-box): statement, branch/decision, branch condition, branch condition combination, <strong>LCSAJ</strong> (Linear Code Sequence And Jump — một dãy lệnh tuần tự rồi một bước nhảy), <em>arcs</em> (cạnh của đồ thị luồng điều khiển), <em>definition-use</em> (kiểm thử luồng dữ liệu: mỗi chỗ gán biến ghép với chỗ dùng biến đó)…</li>
<li><strong>Dynamic → Behavioural → Functional</strong> (black-box): phân vùng tương đương, phân tích giá trị biên, <strong>cause-effect graphing</strong> (tổ tiên dạng đồ thị của decision table), kiểm thử <strong>ngẫu nhiên</strong>, state transition…</li>
<li><strong>Dynamic → Behavioural → Non-functional</strong>: usability, performance…</li>
</ul>
<p>Rút ra: cây hiện đại ở slide 5 chỉ là tập con. Đề CTFL 2018 chỉ yêu cầu EP, BVA, decision table, state transition, use case (black-box), statement và decision (white-box), error guessing, exploratory, checklist-based (dựa kinh nghiệm).</p>`),
    bi(`<h3>Ví dụ có lời giải · Worked example — classify eight activities</h3>
<p>For each activity decide the category and name the test basis. Cover the right column and try first.</p>
<table>
<thead><tr><th>#</th><th>Activity</th><th>Category · technique · test basis</th></tr></thead>
<tbody>
<tr><td>1</td><td>A tester reads "applicant age must be 18–60" in the SRS and picks the values 17, 18, 60, 61.</td><td>Black-box · BVA · requirement</td></tr>
<tr><td>2</td><td>A developer adds tests until every <code>if</code> in <code>calculateFee()</code> has been both true and false.</td><td>White-box · decision coverage · code</td></tr>
<tr><td>3</td><td>A senior tester lists "29 February, empty string, double-click on Submit, emoji in name" from past projects.</td><td>Experience-based · error guessing · experience</td></tr>
<tr><td>4</td><td>A tester designs tests from the order-status diagram Created → Paid → Shipped.</td><td>Black-box · state transition · state model</td></tr>
<tr><td>5</td><td>A tester explores the new checkout for 60 minutes with a charter "attack payment edge cases".</td><td>Experience-based · exploratory</td></tr>
<tr><td>6</td><td>The team reads the SRS with a checklist before any code exists.</td><td>Not a dynamic technique at all — static testing (review, Chapter 3)</td></tr>
<tr><td>7</td><td>An integration tester makes sure every REST endpoint of the service is called at least once.</td><td>White-box at integration level · structure = the API/call graph</td></tr>
<tr><td>8</td><td>A performance tester derives load tests from "search must answer within 2 s for 500 users".</td><td>Black-box · non-functional · requirement</td></tr>
</tbody>
</table>
<div class="pitfall"><b>Three statements that are FALSE in FE papers:</b> "black-box testing is only functional testing" (it includes non-functional, row 8); "white-box testing is only done at component level" (row 7); "experience-based testing is unsystematic and has no value" (it complements the systematic techniques and is often the only option when documentation is poor).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The full catalogue — ISO/IEC/IEEE 29119-4.</b> The international standard for test techniques lists far more than CTFL. <em>Specification-based</em>: equivalence partitioning, classification tree method, boundary value analysis, syntax testing, combinatorial techniques (all combinations, pairwise, each choice, base choice), decision table testing, cause-effect graphing, state transition testing, scenario testing (≈ use case), random testing, metamorphic testing, requirements-based testing. <em>Structure-based</em>: statement, branch, decision, branch condition, branch condition combination, MC/DC (required for the most critical avionics software by DO-178C), and data-flow testing (all-definitions, all-uses, all-DU-paths). <em>Experience-based</em>: error guessing. <em>Outside the syllabus because CTFL 2018 only examines the ten techniques named on slide 5 plus checklist-based testing.</em></div>`,
    `<h3>Ví dụ có lời giải · Phân loại tám hoạt động</h3>
<p>Với mỗi hoạt động, xác định nhóm kỹ thuật và test basis. Che cột phải lại và tự làm trước.</p>
<table>
<thead><tr><th>#</th><th>Hoạt động</th><th>Nhóm · kỹ thuật · test basis</th></tr></thead>
<tbody>
<tr><td>1</td><td>Tester đọc SRS "tuổi người nộp đơn phải 18–60" và chọn các giá trị 17, 18, 60, 61.</td><td>Black-box · BVA · yêu cầu</td></tr>
<tr><td>2</td><td>Developer thêm test tới khi mọi <code>if</code> trong <code>calculateFee()</code> đều từng đúng và từng sai.</td><td>White-box · decision coverage · code</td></tr>
<tr><td>3</td><td>Tester lâu năm liệt kê "ngày 29/2, chuỗi rỗng, bấm đúp nút Submit, emoji trong tên" từ các dự án cũ.</td><td>Dựa kinh nghiệm · error guessing · kinh nghiệm</td></tr>
<tr><td>4</td><td>Tester thiết kế test từ sơ đồ trạng thái đơn hàng Created → Paid → Shipped.</td><td>Black-box · state transition · mô hình trạng thái</td></tr>
<tr><td>5</td><td>Tester khám phá trang thanh toán mới trong 60 phút với charter "tấn công các ca biên của thanh toán".</td><td>Dựa kinh nghiệm · exploratory</td></tr>
<tr><td>6</td><td>Cả nhóm đọc SRS theo checklist khi chưa có dòng code nào.</td><td>Không phải kỹ thuật dynamic — là kiểm thử tĩnh (review, Chương 3)</td></tr>
<tr><td>7</td><td>Tester tích hợp đảm bảo mọi endpoint REST của service được gọi ít nhất một lần.</td><td>White-box ở cấp integration · cấu trúc = API/đồ thị gọi</td></tr>
<tr><td>8</td><td>Tester hiệu năng xây bài test tải từ yêu cầu "tìm kiếm phải trả lời trong 2 giây với 500 người dùng".</td><td>Black-box · phi chức năng · yêu cầu</td></tr>
</tbody>
</table>
<div class="pitfall"><b>Ba câu SAI hay gặp trong đề FE:</b> "black-box chỉ là kiểm thử chức năng" (nó gồm cả phi chức năng, dòng 8); "white-box chỉ làm ở cấp component" (dòng 7); "kiểm thử dựa kinh nghiệm thiếu hệ thống nên vô giá trị" (nó bổ sung cho các kỹ thuật hệ thống và nhiều khi là lựa chọn duy nhất khi tài liệu kém).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Danh mục đầy đủ — ISO/IEC/IEEE 29119-4.</b> Chuẩn quốc tế về kỹ thuật test liệt kê nhiều hơn CTFL rất nhiều. <em>Dựa đặc tả</em>: phân vùng tương đương, classification tree method, phân tích giá trị biên, syntax testing, các kỹ thuật tổ hợp (all combinations, pairwise, each choice, base choice), decision table, cause-effect graphing, state transition, scenario testing (≈ use case), random testing, metamorphic testing, requirements-based testing. <em>Dựa cấu trúc</em>: statement, branch, decision, branch condition, branch condition combination, MC/DC (bắt buộc với phần mềm hàng không nguy cấp nhất theo DO-178C), và kiểm thử luồng dữ liệu (all-definitions, all-uses, all-DU-paths). <em>Dựa kinh nghiệm</em>: error guessing. <em>Ngoài giáo trình vì CTFL 2018 chỉ thi mười kỹ thuật có tên ở slide 5 cộng thêm checklist-based testing.</em></div>`),
    books([
      ['fst4', 'Ch.4 Section 1 "Categories of test techniques" — book pp.106–111 (PDF pp.120–125)', 'Chương 4 mục 1 "Categories of test techniques" — trang sách 106–111 (PDF 120–125)'],
      ['fst', '§4.1 "Identifying test conditions and designing test cases" pp.77–84 and §4.2 "Categories of test design techniques" pp.84–87 (PDF ≈ +3)', '§4.1 "Identifying test conditions and designing test cases" trang 77–84 và §4.2 "Categories of test design techniques" trang 84–87 (PDF ≈ +3)'],
      ['sp5', 'Ch.5 "Dynamic Testing" introduction (black-box vs white-box, test basis) — PDF pp.159–164', 'Chương 5 "Dynamic Testing" phần mở đầu (black-box vs white-box, test basis) — PDF 159–164'],
      ['sp4', 'Ch.5 "Dynamic Analysis – Test Design Techniques" introduction — pp.105–110 (PDF pp.120–125)', 'Chương 5 "Dynamic Analysis – Test Design Techniques" phần mở đầu — trang 105–110 (PDF 120–125)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 4.2 Equivalence partitioning ─────────────────────── */
const L42 = {
  title: '4.2 — Equivalence partitioning (EP): valid & invalid partitions, EP coverage|||4.2 — Phân vùng tương đương (EP): phân vùng hợp lệ & không hợp lệ, độ phủ EP',
  slug: 'swt301-blackbox-ep-bva',
  type: 'VIDEO',
  description: 'SWT4 slide 15–28: ý tưởng EP, ví dụ phòng học 9h–22h, tài khoản tiết kiệm 3%/5%/7%, độ phủ EP, test riêng từng phân vùng invalid — giải từng bước 6 câu hỏi tính toán (bơm xăng, điểm thi, cước ship, thưởng, thuế).',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.2 · SWT4 slides 15–28</span>
<h2>Equivalence partitioning (EP)</h2>
<p class="lead">EP is the first black-box technique and the one you will use in <em>every</em> PE Question 3. The idea is simple — group the inputs (or outputs) that the system must treat the same way and test one value from each group — but exam questions hide traps in <em>how many</em> partitions there are: the invalid ones the specification never mentions, the precision of the values, and whether the question asks for "valid" partitions only.</p>
<div class="callout"><b>Learning objective.</b> LO-4.2.1 Apply equivalence partitioning to derive test cases from given requirements (K3).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Condition</div><div class="lz-t">pick one input/output</div><div class="lz-d">e.g. account balance</div></div>
  <div class="lz-step"><div class="lz-k">→ 2 · Partition</div><div class="lz-t">valid + invalid groups</div><div class="lz-d">&lt; 0 · 0–100 · 100.01–999.99 · ≥ 1000</div></div>
  <div class="lz-step"><div class="lz-k">→ 3 · Assumptions</div><div class="lz-t">precision, units, limits</div><div class="lz-d">2 decimal places; no upper limit</div></div>
  <div class="lz-step"><div class="lz-k">→ 4 · One value each</div><div class="lz-t">representative</div><div class="lz-d">−10 · 55 · 270 · 1260</div></div>
  <div class="lz-step"><div class="lz-k">→ 5 · Combine</div><div class="lz-t">valid together, invalid alone</div><div class="lz-d">coverage = tested / identified</div></div>
</div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.2 · SWT4 slide 15–28</span>
<h2>Phân vùng tương đương (EP)</h2>
<p class="lead">EP là kỹ thuật black-box đầu tiên và là kỹ thuật bạn dùng trong <em>mọi</em> đề PE câu 3. Ý tưởng đơn giản — gom các input (hoặc output) mà hệ thống phải xử lý như nhau thành nhóm và test một giá trị mỗi nhóm — nhưng câu hỏi thi giấu bẫy ở chỗ <em>có bao nhiêu</em> phân vùng: các phân vùng invalid mà đặc tả không nhắc, độ chính xác của giá trị, và câu hỏi chỉ hỏi phân vùng "valid" hay hỏi tất cả.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-4.2.1 Áp dụng phân vùng tương đương để suy ra test case từ yêu cầu cho trước (K3).</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Điều kiện</div><div class="lz-t">chọn một input/output</div><div class="lz-d">vd số dư tài khoản</div></div>
  <div class="lz-step"><div class="lz-k">→ 2 · Chia vùng</div><div class="lz-t">nhóm valid + invalid</div><div class="lz-d">&lt; 0 · 0–100 · 100,01–999,99 · ≥ 1000</div></div>
  <div class="lz-step"><div class="lz-k">→ 3 · Giả định</div><div class="lz-t">độ chính xác, đơn vị, giới hạn</div><div class="lz-d">2 chữ số thập phân; không có trần</div></div>
  <div class="lz-step"><div class="lz-k">→ 4 · Mỗi vùng một giá trị</div><div class="lz-t">giá trị đại diện</div><div class="lz-d">−10 · 55 · 270 · 1260</div></div>
  <div class="lz-step"><div class="lz-k">→ 5 · Ghép test</div><div class="lz-t">valid ghép chung, invalid tách riêng</div><div class="lz-d">độ phủ = đã test / đã xác định</div></div>
</div>`),
    walkHead(D, 15, 28),
    walk(D, [
      [15, 'CONTENTS — Black-box Test Techniques',
        `<p>The agenda now highlights <strong>Black-box Test Techniques</strong> and opens its five sub-items: equivalence partitioning, boundary value analysis, decision table testing, state transition testing, use case testing. On this site: EP = lesson 4.2, BVA = 4.3, decision tables = 4.4, state transition = 4.5, use case = 4.6. These are exactly the five black-box techniques of CTFL 2018 (LO-4.2.1–4.2.5); the first four are K3 — you must be able to <em>apply</em> them, i.e. calculate.</p>`,
        `<p>Mục lục giờ tô <strong>Black-box Test Techniques</strong> và mở năm mục con: phân vùng tương đương, phân tích giá trị biên, decision table, state transition, use case. Trên trang này: EP = bài 4.2, BVA = 4.3, decision table = 4.4, state transition = 4.5, use case = 4.6. Đây đúng là năm kỹ thuật black-box của CTFL 2018 (LO-4.2.1–4.2.5); bốn kỹ thuật đầu ở mức K3 — bạn phải <em>áp dụng</em> được, tức là tính được.</p>`],
      [16, 'Equivalence Partitioning (EP) — the idea',
        `<p>Four bullets to memorise. (1) EP can be applied <strong>at any level of testing</strong> and is often a good technique to use <strong>first</strong>. (2) Idea: divide (partition) a set of test conditions into groups where <strong>all elements can be considered the same</strong> — the system should handle them equivalently. (3) Assumption: <strong>if one value works, all will work</strong> (and if one fails, all fail). (4) <strong>One from each partition is better than all from one</strong> — ten tests with ages 20, 21, 22… all sit in the same partition and add almost nothing; four tests from four different partitions each tell you something new. EP is how testers answer Principle 2 ("exhaustive testing is impossible").</p>`,
        `<p>Bốn ý cần thuộc. (1) EP áp dụng được <strong>ở mọi cấp test</strong> và thường là kỹ thuật nên dùng <strong>đầu tiên</strong>. (2) Ý tưởng: chia (partition) tập test condition thành các nhóm mà <strong>mọi phần tử có thể coi là như nhau</strong> — hệ thống phải xử lý chúng tương đương. (3) Giả định: <strong>một giá trị chạy đúng thì cả nhóm chạy đúng</strong> (và một cái sai thì cả nhóm sai). (4) <strong>Mỗi nhóm một giá trị tốt hơn mọi giá trị từ một nhóm</strong> — mười test với tuổi 20, 21, 22… đều nằm cùng một vùng, gần như chẳng thêm thông tin; bốn test từ bốn vùng khác nhau thì mỗi test cho biết một điều mới. EP là cách tester trả lời Nguyên tắc 2 ("không thể test vét cạn").</p>`],
      [17, 'EP example — booking a training room (valid partitions)',
        `<p>FR08: a special training room opens 9am–10pm; an SE course always runs 5pm–7:59pm in it. Booking 9am–4:59pm → <em>available</em>; 5pm–7:59pm → <em>occupied</em>; 8pm–10pm → <em>available</em>. The number line shows three valid partitions ①②③ between the ticks 9am, 5pm, 8pm, 10pm (notes: 9:00–16:59, 17:00–19:59, 20:00–22:00, inclusive). Notice: partitions ① and ③ give the <em>same output</em> ("available") but they are kept separate — they lie on different sides of the course and the code probably checks them differently. Partition by <em>how the system decides</em>, not only by the message shown.</p>`,
        `<p>FR08: phòng học đặc biệt mở cửa 9h–22h; một lớp SE luôn học 17h–19h59 trong phòng đó. Đặt phòng 9h–16h59 → <em>còn trống</em>; 17h–19h59 → <em>đã có lớp</em>; 20h–22h → <em>còn trống</em>. Trục số có ba phân vùng valid ①②③ giữa các vạch 9am, 5pm, 8pm, 10pm (ghi chú: 9:00–16:59, 17:00–19:59, 20:00–22:00, tính cả hai đầu). Để ý: vùng ① và ③ cho <em>cùng output</em> ("còn trống") nhưng vẫn tách riêng — chúng nằm hai phía của lớp học và code có lẽ kiểm tra chúng theo cách khác nhau. Hãy chia vùng theo <em>cách hệ thống ra quyết định</em>, không chỉ theo thông báo hiển thị.</p>`],
      [18, 'EP example — adding the invalid partitions',
        `<p>The same line with two red partitions added: ④ before 9am and ⑤ after 10pm (the room is closed) — "Invalid" arrows on both ends, "Valid partitions" in the middle. Teacher's notes: to apply EP, test each partition at least once, e.g. P1 11am, P2 6pm, P3 8:30pm, P4 8am, P5 11pm — <strong>5 tests give 100% EP coverage</strong>. Three valid + two invalid = five; forgetting the invalid ends is the most common mistake in class.</p>`,
        `<p>Cùng trục số, thêm hai vùng đỏ: ④ trước 9h và ⑤ sau 22h (phòng đóng cửa) — mũi tên "Invalid" ở hai đầu, "Valid partitions" ở giữa. Ghi chú của thầy/cô: áp dụng EP là test mỗi vùng ít nhất một lần, vd P1 11h, P2 18h, P3 20h30, P4 8h, P5 23h — <strong>5 test đạt 100% độ phủ EP</strong>. Ba valid + hai invalid = năm; quên hai đầu invalid là lỗi hay gặp nhất trên lớp.</p>`],
      [19, 'EP example — savings account interest',
        `<p>Interest depends on the balance: <strong>[$0 … $100]</strong> 3% · <strong>($100 … $1000)</strong> 5% · <strong>[$1000 … ]</strong> 7%. Read the brackets: square = the end value is included, round = excluded. So 3% covers $0.00–$100.00, 5% covers $100.01–$999.99, 7% covers $1,000.00 and up. The strip under the text shows the three valid partitions with their edge values; the tiny grey strip at the left edge is the fourth, invalid partition (negative balances, up to −$0.01). Teacher's notes: (1) <strong>we found 4 partitions although the spec mentions only 3</strong>; (2) the smallest difference between two values is an <strong>assumption (2 decimal places) that must be made explicit</strong> — with whole dollars the edges would be $100/$101; (3) to design tests, cover every partition, valid and invalid, at least once.</p>`,
        `<p>Lãi suất phụ thuộc số dư: <strong>[$0 … $100]</strong> 3% · <strong>($100 … $1000)</strong> 5% · <strong>[$1000 … ]</strong> 7%. Đọc dấu ngoặc: ngoặc vuông = lấy cả đầu mút, ngoặc tròn = không lấy. Vậy 3% gồm $0,00–$100,00; 5% gồm $100,01–$999,99; 7% gồm từ $1.000,00 trở lên. Dải bên dưới vẽ ba vùng valid với giá trị ở mép; dải xám nhỏ xíu ở mép trái là vùng thứ tư, invalid (số dư âm, tới −$0,01). Ghi chú của thầy/cô: (1) <strong>ta tìm ra 4 vùng dù đặc tả chỉ nói 3</strong>; (2) khoảng cách nhỏ nhất giữa hai giá trị là một <strong>giả định (2 chữ số thập phân) phải ghi rõ ra</strong> — nếu là đô la chẵn thì mép sẽ là $100/$101; (3) khi thiết kế test, phủ mọi vùng, cả valid lẫn invalid, ít nhất một lần.</p>`],
      [20, 'EP — what coverage do these tests give?',
        `<p>The full strip now shows all four partitions. Question 1: sample balances <strong>−$10.00, $55.00, $270.00, $1,260.00</strong> → one value in each of invalid / 3% / 5% / 7% → <strong>4/4 = 100%</strong> EP coverage. Question 2: a naïve tester tries every $50 — $50, $100, $150 … $800 until tired → $50 and $100 hit 3%, $150–$800 all hit 5%; no negative, no 7% → <strong>2/4 = 50%</strong>, with 16 tests instead of 4 (checked by script in the worked example). Teacher's notes: an <em>invalid</em> partition does not mean a value the user cannot type — it means a value that is not one of the expected inputs for this field; the software must still handle it correctly, e.g. with "Balance must be at least $0.00".</p>`,
        `<p>Dải số giờ có đủ bốn vùng. Câu 1: các số dư mẫu <strong>−$10,00; $55,00; $270,00; $1.260,00</strong> → mỗi vùng invalid / 3% / 5% / 7% có đúng một giá trị → độ phủ EP <strong>4/4 = 100%</strong>. Câu 2: tester "ngây thơ" thử mỗi $50 — $50, $100, $150 … $800 tới khi mệt → $50 và $100 rơi vào 3%, $150–$800 đều rơi vào 5%; không có số âm, không có 7% → <strong>2/4 = 50%</strong>, tốn 16 test thay vì 4 (đã kiểm bằng script ở ví dụ có lời giải). Ghi chú của thầy/cô: vùng <em>invalid</em> không có nghĩa là giá trị người dùng không gõ được — mà là giá trị không thuộc các input mong đợi của trường này; phần mềm vẫn phải xử lý đúng, vd báo "Số dư phải ít nhất $0,00".</p>`],
      [21, 'EP — definitions',
        `<p>Terms: <strong>equivalence partition ≈ equivalence class</strong>. A partition of valid values is a <strong>valid equivalence partition</strong>; of invalid values an <strong>invalid equivalence partition</strong>. <strong>Each value must belong to one and only one partition</strong> — partitions must not overlap and must not leave gaps (a classic bug in specs: "0–10" and "10–20" — where does 10 go?). <strong>Any partition may be divided into sub-partitions</strong> if required (e.g. invalid "non-numeric" into "letters", "symbols", "empty"). The boxed text repeats the note of slide 20 about what "invalid" means.</p>`,
        `<p>Thuật ngữ: <strong>equivalence partition ≈ equivalence class</strong>. Vùng chứa giá trị hợp lệ là <strong>valid equivalence partition</strong>; chứa giá trị không hợp lệ là <strong>invalid equivalence partition</strong>. <strong>Mỗi giá trị thuộc một và chỉ một vùng</strong> — các vùng không được chồng lên nhau và không được bỏ trống khe hở (lỗi kinh điển trong đặc tả: "0–10" và "10–20" — số 10 thuộc vùng nào?). <strong>Vùng nào cũng có thể chia nhỏ thành vùng con</strong> khi cần (vd invalid "không phải số" tách thành "chữ", "ký hiệu", "rỗng"). Khung chữ nhắc lại ghi chú của slide 20 về nghĩa của "invalid".</p>`],
      [22, 'EP — coverage and combining partitions',
        `<p><strong>EP coverage = number of partitions tested by at least one value ÷ total number of identified partitions.</strong> Second rule, very important for designing test cases: <strong>invalid partitions must be tested individually</strong>, while <strong>values from valid partitions can be combined</strong>. Why? If one test enters an invalid age <em>and</em> an invalid email, the form shows the age error and stops — the email check may never run, so a defect there stays hidden (<em>fault masking</em>). Valid values can share a test because a correct run proves each of them was accepted. Formula for a form: <em>minimum tests = (largest number of valid partitions of any single field) + (total number of invalid partitions)</em> — see the worked example.</p>`,
        `<p><strong>Độ phủ EP = số vùng đã được test bởi ít nhất một giá trị ÷ tổng số vùng đã xác định.</strong> Quy tắc thứ hai, cực quan trọng khi thiết kế test case: <strong>vùng invalid phải test riêng từng cái</strong>, còn <strong>giá trị từ các vùng valid có thể ghép chung</strong>. Vì sao? Nếu một test nhập tuổi sai <em>và</em> email sai, form báo lỗi tuổi rồi dừng — phần kiểm email có thể không bao giờ chạy, defect ở đó bị che (<em>fault masking</em>). Giá trị valid thì ghép được vì một lần chạy đúng chứng tỏ từng giá trị đều được chấp nhận. Công thức cho một form: <em>số test tối thiểu = (số vùng valid lớn nhất của một trường) + (tổng số vùng invalid)</em> — xem ví dụ có lời giải.</p>`],
      [23, 'Question — gasoline pump, minimum set covering the partitions',
        AE(`A — 0.0, 10.0, 60.0`, `Step 1 — partitions of "amount in gallons" (keypad accepts digits only, so no negative numbers; precision 0.1): invalid low = 0.0 (below the smallest sale 0.1) · valid = 0.1 … 50.0 · invalid high = above 50.0. Three partitions. Step 2 — check each option: A has one value in each (0.0 invalid-low, 10.0 valid, 60.0 invalid-high) → 3 values, 3/3. B misses the "above 50.0" partition (0.1 and 50.0 are both valid). C covers all three but with 4 values (0.1 and 50.0 are redundant) → not minimum. D is a boundary-value set with 6 values (and −0.1 cannot even be typed). Script check: A 3/3, B 2/3, C 3/3 with 4 values, D 3/3 with 6.`),
        AV(`A — 0.0, 10.0, 60.0`, `Bước 1 — các vùng của "lượng xăng (gallon)" (bàn phím chỉ nhận chữ số nên không có số âm; độ chính xác 0,1): invalid thấp = 0,0 (dưới mức bán nhỏ nhất 0,1) · valid = 0,1 … 50,0 · invalid cao = trên 50,0. Ba vùng. Bước 2 — xét từng phương án: A có đúng một giá trị mỗi vùng (0,0 invalid thấp, 10,0 valid, 60,0 invalid cao) → 3 giá trị, 3/3. B thiếu vùng "trên 50,0" (0,1 và 50,0 đều valid). C phủ đủ ba nhưng dùng 4 giá trị (0,1 và 50,0 thừa) → không tối thiểu. D là bộ giá trị biên 6 số (và −0,1 thậm chí không gõ được). Script kiểm: A 3/3, B 2/3, C 3/3 với 4 giá trị, D 3/3 với 6.`)],
      [24, 'Question — exam grades, how many EP test cases?',
        AE(`B — 8`, `Valid partitions: 1–49 F, 50–59 D−, 60–69 D, 70–79 C, 80–89 B, 90–100 A → 6. Invalid partitions: below 1 (0 or negative) and above 100 → 2. Total 6 + 2 = 8, one test each. The slide prints "50 – 59 = D –" (D minus) — the text layer even shows it as "50 – 59 = ;" with the grade missing; the grade letter does not change the count. Trap: answering 6 (forgetting invalid) — option A is there to catch you.`),
        AV(`B — 8`, `Vùng valid: 1–49 F, 50–59 D−, 60–69 D, 70–79 C, 80–89 B, 90–100 A → 6. Vùng invalid: dưới 1 (0 hoặc âm) và trên 100 → 2. Tổng 6 + 2 = 8, mỗi vùng một test. Slide in "50 – 59 = D –" (D trừ) — lớp chữ trong file còn mất luôn điểm chữ ("50 – 59 = ;"); chữ điểm không làm đổi số lượng. Bẫy: trả lời 6 (quên invalid) — phương án A đặt ra để bắt lỗi đó.`)],
      [25, 'Question — shipping rates, how many equivalence classes?',
        AE(`C — 5`, `Weights are rounded to whole pounds. Valid: 1–10 ($5.00), 11–25 ($7.50), 26–50 ($12.00), 51 and up ($17.00) → 4. Invalid: 0 or less (nothing to ship) → 1. "51 lbs &amp; up" has <em>no upper limit</em>, so there is no invalid "too heavy" class here (compare slide 42, where regulations cap shipments at 100 lbs). 4 + 1 = 5. Answer 4 forgets the invalid class; 6 invents an upper invalid class; 8 counts boundaries, not classes.`),
        AV(`C — 5`, `Cân nặng làm tròn tới pound. Valid: 1–10 ($5,00), 11–25 ($7,50), 26–50 ($12,00), từ 51 trở lên ($17,00) → 4. Invalid: 0 trở xuống (không có gì để gửi) → 1. "51 lbs &amp; up" <em>không có trần</em>, nên không có lớp invalid "quá nặng" (so với slide 42, nơi quy định giới hạn 100 lbs). 4 + 1 = 5. Đáp án 4 là quên lớp invalid; 6 là tự bịa thêm lớp invalid phía trên; 8 là đếm biên chứ không phải lớp.`)],
      [26, 'Question — true statements about EP',
        AE(`d — 1 &amp; 2`, `1 true (inputs with the same behaviour form a class); 2 true (valid <em>and</em> invalid partitions); 3 false (the opposite of 2); 4 false (one value per partition is enough — "at least two" is a BVA idea, not EP); 5 false (EP works on any interface: API parameters, files, sensors — and at any level, slide 16).`),
        AV(`d — 1 &amp; 2`, `1 đúng (input cùng hành vi tạo thành một lớp); 2 đúng (vùng valid <em>và</em> invalid); 3 sai (ngược với 2); 4 sai (mỗi vùng một giá trị là đủ — "ít nhất hai" là ý của BVA, không phải EP); 5 sai (EP dùng cho mọi giao diện: tham số API, file, cảm biến — và ở mọi cấp, slide 16).`)],
      [27, 'Question — employee bonus, valid partitions of employment length',
        AE(`D — 4`, `The question asks only for the <em>valid</em> partitions of the length of employment: ≤ 2 years · more than 2 but less than 5 · 5 to 10 · more than 10 → 4 tests (e.g. 1, 3, 7, 12 years). The sentence "the bonus cannot be negative but can be down to zero" talks about the <em>output</em> and is a distractor. Invalid partitions (negative length) are not asked; if they were, the answer would be 5.`),
        AV(`D — 4`, `Câu hỏi chỉ hỏi các vùng <em>valid</em> của thời gian làm việc: ≤ 2 năm · hơn 2 nhưng dưới 5 · từ 5 tới 10 · hơn 10 → 4 test (vd 1, 3, 7, 12 năm). Câu "thưởng không được âm nhưng có thể bằng 0" nói về <em>output</em>, là thông tin gây nhiễu. Vùng invalid (thời gian âm) không được hỏi; nếu hỏi thì đáp án là 5.`)],
      [28, 'Question — tax bands, which numbers share an equivalence class?',
        AE(`D — 5,800 – 28,000 – 32,000`, `Build the bands first (the number line on the slide shows the edges 4,000 · 5,500 · 33,500): 0–4,000 → 0% · 4,000.01–5,500 → 10% (the next $1,500) · 5,500.01–33,500 → 22% (the next $28,000) · above 33,500 → 40%. Now classify: A 4,800 (10%), 14,000 (22%), 28,000 (22%) ✗ · B 5,200 (10%), 5,500 (10%), 28,000 (22%) ✗ · C 28,001 (22%), 32,000 (22%), 35,000 (40%) ✗ · D 5,800, 28,000, 32,000 all 22% ✓. The trap is to read "$28,000" as a band edge — it is the <em>width</em> of the 22% band, whose upper edge is 5,500 + 28,000 = 33,500.`),
        AV(`D — 5.800 – 28.000 – 32.000`, `Dựng các bậc trước (trục số trên slide có các mốc 4.000 · 5.500 · 33.500): 0–4.000 → 0% · 4.000,01–5.500 → 10% ($1.500 tiếp theo) · 5.500,01–33.500 → 22% ($28.000 tiếp theo) · trên 33.500 → 40%. Xếp lớp: A 4.800 (10%), 14.000 (22%), 28.000 (22%) ✗ · B 5.200 (10%), 5.500 (10%), 28.000 (22%) ✗ · C 28.001 (22%), 32.000 (22%), 35.000 (40%) ✗ · D 5.800, 28.000, 32.000 đều 22% ✓. Bẫy là đọc "$28.000" như một mốc — thật ra nó là <em>độ rộng</em> của bậc 22%, mốc trên của bậc là 5.500 + 28.000 = 33.500.`)],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example 1 — re-checking slide 20 with a script</h3>
<p>Partition function: balance &lt; 0 → invalid; ≤ 100 → 3%; &lt; 1000 → 5%; otherwise 7%. Real output of the check script (Python):</p>
<pre><code>[-10, 55, 270, 1260] ['3%', '5%', '7%', 'invalid&lt;0'] 4/4 = 100%
naive 50..800: ['3%', '5%'] 2/4 = 50%</code></pre>
<h3>Worked example 2 — a form with three fields (combine valid, isolate invalid)</h3>
<p>Spec: <em>Age</em> is an integer 18–60 · <em>Gender</em> is chosen from a drop-down M / F / Other · <em>Email</em> must contain "@" and is required.</p>
<table>
<thead><tr><th>Field</th><th>Valid partitions</th><th>Invalid partitions</th></tr></thead>
<tbody>
<tr><td>Age</td><td>A1: 18–60</td><td>A2: &lt; 18 · A3: &gt; 60 · A4: non-numeric</td></tr>
<tr><td>Gender</td><td>G1: M · G2: F · G3: Other (each option is its own partition — nothing else can be chosen)</td><td>— (a drop-down allows no invalid value)</td></tr>
<tr><td>Email</td><td>E1: well-formed</td><td>E2: no "@" · E3: empty</td></tr>
</tbody>
</table>
<p>Minimum tests = max(1, 3, 1) valid + (3 + 0 + 2) invalid = <strong>3 + 5 = 8</strong> (script: <code>min tests = max valid 3 + sum invalid 5 = 8</code>).</p>
<table>
<thead><tr><th>Test</th><th>Age</th><th>Gender</th><th>Email</th><th>Expected</th><th>Covers</th></tr></thead>
<tbody>
<tr><td>1</td><td>30</td><td>M</td><td>an@fpt.edu.vn</td><td>Registered</td><td>A1 G1 E1</td></tr>
<tr><td>2</td><td>45</td><td>F</td><td>binh@fpt.edu.vn</td><td>Registered</td><td>G2</td></tr>
<tr><td>3</td><td>25</td><td>Other</td><td>chi@fpt.edu.vn</td><td>Registered</td><td>G3</td></tr>
<tr><td>4</td><td>10</td><td>M</td><td>an@fpt.edu.vn</td><td>Error "Age must be 18–60"</td><td>A2</td></tr>
<tr><td>5</td><td>70</td><td>M</td><td>an@fpt.edu.vn</td><td>Error "Age must be 18–60"</td><td>A3</td></tr>
<tr><td>6</td><td>abc</td><td>M</td><td>an@fpt.edu.vn</td><td>Error "Age must be a number"</td><td>A4</td></tr>
<tr><td>7</td><td>30</td><td>M</td><td>an.fpt.edu.vn</td><td>Error "Invalid email"</td><td>E2</td></tr>
<tr><td>8</td><td>30</td><td>M</td><td>(empty)</td><td>Error "Email is required"</td><td>E3</td></tr>
</tbody>
</table>
<p>Every invalid test changes exactly <em>one</em> field and keeps the others at a known-good value — so when test 7 fails you know it is the email check.</p>
<div class="pitfall"><b>Exam traps in EP questions:</b> (1) read whether the question asks for <em>valid</em> partitions only (slide 27) or all partitions (slide 24); (2) an open-ended top band ("51 lbs &amp; up") has no upper invalid partition; (3) the <em>width</em> of a band is not its edge (slide 28); (4) a drop-down or keypad can remove invalid partitions (slides 23 and 81); (5) "at least two values per partition" is never an EP rule.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The classification tree method (CTM).</b> For forms with many fields, testers at Daimler (Grochtmann &amp; Grimm, 1993) drew EP as a tree: each input aspect is a <em>classification</em>, each partition a <em>class</em> leaf; a table under the tree marks which classes each test case picks. The tree makes missing partitions visible and lets a tool generate combinations (all classes at least once, or pairwise). Tools: TESTONA (formerly CTE XL). It is EP with a picture and a combination strategy. <em>Outside the syllabus because CTFL only examines single-field partitioning and simple combination rules.</em></div>`,
    `<h3>Ví dụ có lời giải · Ví dụ 1 — kiểm lại slide 20 bằng script</h3>
<p>Hàm phân vùng: số dư &lt; 0 → invalid; ≤ 100 → 3%; &lt; 1000 → 5%; còn lại 7%. Output thật của script kiểm (Python):</p>
<pre><code>[-10, 55, 270, 1260] ['3%', '5%', '7%', 'invalid&lt;0'] 4/4 = 100%
naive 50..800: ['3%', '5%'] 2/4 = 50%</code></pre>
<h3>Ví dụ 2 — một form ba trường (ghép valid, tách invalid)</h3>
<p>Đặc tả: <em>Tuổi</em> là số nguyên 18–60 · <em>Giới tính</em> chọn từ drop-down M / F / Other · <em>Email</em> bắt buộc và phải chứa "@".</p>
<table>
<thead><tr><th>Trường</th><th>Vùng valid</th><th>Vùng invalid</th></tr></thead>
<tbody>
<tr><td>Tuổi</td><td>A1: 18–60</td><td>A2: &lt; 18 · A3: &gt; 60 · A4: không phải số</td></tr>
<tr><td>Giới tính</td><td>G1: M · G2: F · G3: Other (mỗi lựa chọn là một vùng riêng — không chọn được gì khác)</td><td>— (drop-down không cho giá trị invalid)</td></tr>
<tr><td>Email</td><td>E1: đúng định dạng</td><td>E2: thiếu "@" · E3: rỗng</td></tr>
</tbody>
</table>
<p>Số test tối thiểu = max(1, 3, 1) valid + (3 + 0 + 2) invalid = <strong>3 + 5 = 8</strong> (script: <code>min tests = max valid 3 + sum invalid 5 = 8</code>).</p>
<table>
<thead><tr><th>Test</th><th>Tuổi</th><th>Giới tính</th><th>Email</th><th>Mong đợi</th><th>Phủ</th></tr></thead>
<tbody>
<tr><td>1</td><td>30</td><td>M</td><td>an@fpt.edu.vn</td><td>Đăng ký thành công</td><td>A1 G1 E1</td></tr>
<tr><td>2</td><td>45</td><td>F</td><td>binh@fpt.edu.vn</td><td>Đăng ký thành công</td><td>G2</td></tr>
<tr><td>3</td><td>25</td><td>Other</td><td>chi@fpt.edu.vn</td><td>Đăng ký thành công</td><td>G3</td></tr>
<tr><td>4</td><td>10</td><td>M</td><td>an@fpt.edu.vn</td><td>Lỗi "Tuổi phải từ 18–60"</td><td>A2</td></tr>
<tr><td>5</td><td>70</td><td>M</td><td>an@fpt.edu.vn</td><td>Lỗi "Tuổi phải từ 18–60"</td><td>A3</td></tr>
<tr><td>6</td><td>abc</td><td>M</td><td>an@fpt.edu.vn</td><td>Lỗi "Tuổi phải là số"</td><td>A4</td></tr>
<tr><td>7</td><td>30</td><td>M</td><td>an.fpt.edu.vn</td><td>Lỗi "Email không hợp lệ"</td><td>E2</td></tr>
<tr><td>8</td><td>30</td><td>M</td><td>(rỗng)</td><td>Lỗi "Email là bắt buộc"</td><td>E3</td></tr>
</tbody>
</table>
<p>Mỗi test invalid chỉ đổi đúng <em>một</em> trường, các trường khác giữ giá trị chắc chắn đúng — nên khi test 7 fail bạn biết ngay lỗi nằm ở phần kiểm email.</p>
<div class="pitfall"><b>Bẫy trong câu hỏi EP:</b> (1) đọc kỹ câu hỏi chỉ hỏi vùng <em>valid</em> (slide 27) hay mọi vùng (slide 24); (2) bậc cuối không có trần ("51 lbs &amp; up") thì không có vùng invalid phía trên; (3) <em>độ rộng</em> của một bậc không phải mốc của nó (slide 28); (4) drop-down hay bàn phím chỉ-số có thể loại bỏ vùng invalid (slide 23 và 81); (5) "ít nhất hai giá trị mỗi vùng" không bao giờ là quy tắc EP.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Classification tree method (CTM).</b> Với form nhiều trường, các tester ở Daimler (Grochtmann &amp; Grimm, 1993) vẽ EP thành cây: mỗi khía cạnh input là một <em>classification</em>, mỗi vùng là một lá <em>class</em>; bảng dưới cây đánh dấu mỗi test case chọn class nào. Cây làm lộ ra các vùng bị bỏ sót và cho phép công cụ sinh tổ hợp (mỗi class ít nhất một lần, hoặc pairwise). Công cụ: TESTONA (trước là CTE XL). Đó là EP có hình vẽ và có chiến lược tổ hợp. <em>Ngoài giáo trình vì CTFL chỉ thi phân vùng một trường và quy tắc ghép đơn giản.</em></div>`),
    books([
      ['fst4', 'Ch.4 Section 2 "Black-box test techniques" — equivalence partitioning, book pp.112–116, Table 4.1 on p.116 (PDF pp.126–130)', 'Chương 4 mục 2 "Black-box test techniques" — phân vùng tương đương, trang sách 112–116, Bảng 4.1 ở trang 116 (PDF 126–130)'],
      ['fst', '§4.3.1 "Equivalence partitioning and boundary value analysis" — pp.88–94 (PDF ≈ +3)', '§4.3.1 "Equivalence partitioning and boundary value analysis" — trang 88–94 (PDF ≈ +3)'],
      ['sp5', '§5.1.1 "Equivalence Partitioning" — PDF pp.165–175', '§5.1.1 "Equivalence Partitioning" — PDF 165–175'],
      ['sp4', '§5.1.1 "Equivalence Class Partitioning" — pp.110–120 (PDF pp.125–135)', '§5.1.1 "Equivalence Class Partitioning" — trang 110–120 (PDF 125–135)'],
    ]),
  ].join('\n'),
};

/* ─────────────── 4.3 Boundary value analysis & the PE condition template ─────────────── */
const L43 = {
  title: '4.3 — Boundary value analysis (BVA) & the PE condition template (loan application)|||4.3 — Phân tích giá trị biên (BVA) & bảng condition template của đề PE (đơn vay vốn)',
  slug: 'swt301-blackbox-bva-template',
  type: 'VIDEO',
  description: 'SWT4 slide 29–42: BVA 2 giá trị/3 giá trị, độ phủ biên, ví dụ đơn vay vốn → bảng Condition/Valid/Invalid Partition/Boundary có TAG y hệt đề PE câu 3, thiết kế test case phủ TAG; giải trọn đề PE FA23 câu 3 và 4 câu hỏi tính biên.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.3 · SWT4 slides 29–42</span>
<h2>Boundary value analysis (BVA) and the condition template</h2>
<p class="lead">BVA sharpens EP: defects gather at the <em>edges</em> of partitions (a <code>&gt;</code> written instead of <code>&gt;=</code>), so we test the values on each edge. This block of the deck then builds, field by field, the <strong>Condition template</strong> — the table <em>Condition · Valid Partitions · Tag · Invalid Partitions · Tag · Valid Boundaries · Tag · Invalid Boundaries · Tag</em> — which is <strong>exactly Table 3.1 of PE Question 3</strong>, followed by the "Design test cases" table which is Table 3.2. Master this lesson and you have 4 of the 10 PE points.</p>
<div class="callout"><b>Learning objective.</b> LO-4.2.2 Apply boundary value analysis to derive test cases from given requirements (K3).</div>
<table>
<thead><tr><th>Variant</th><th>Values per boundary</th><th>Range 1–100 gives</th><th>How the question names it</th></tr></thead>
<tbody>
<tr><td>2-value BVA (CTFL default)</td><td>the boundary value + its closest neighbour in the next partition</td><td>0, 1, 100, 101</td><td>"two-point", "two-value", "min and max values"</td></tr>
<tr><td>3-value BVA</td><td>before, at and just over the boundary</td><td>0, 1, 2, 99, 100, 101</td><td>"three-point", "three-value"</td></tr>
</tbody>
</table>
<p><strong>BVA coverage = boundary values tested ÷ boundary values identified.</strong> In the PE template the valid boundaries are the partition edges (VB) and the invalid boundaries their neighbours outside (IB).</p>`,
    `<span class="eyebrow">Chương 4 · Bài 4.3 · SWT4 slide 29–42</span>
<h2>Phân tích giá trị biên (BVA) và bảng condition template</h2>
<p class="lead">BVA mài sắc EP: defect tụ ở <em>mép</em> phân vùng (viết <code>&gt;</code> thay vì <code>&gt;=</code>), nên ta test các giá trị nằm ngay mép. Khối slide này sau đó dựng, từng trường một, bảng <strong>Condition template</strong> — bảng <em>Condition · Valid Partitions · Tag · Invalid Partitions · Tag · Valid Boundaries · Tag · Invalid Boundaries · Tag</em> — <strong>chính là Bảng 3.1 của đề PE câu 3</strong>, rồi tới bảng "Design test cases" chính là Bảng 3.2. Nắm chắc bài này là bạn nắm 4/10 điểm PE.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-4.2.2 Áp dụng phân tích giá trị biên để suy ra test case từ yêu cầu cho trước (K3).</div>
<table>
<thead><tr><th>Biến thể</th><th>Giá trị mỗi biên</th><th>Khoảng 1–100 cho ra</th><th>Đề gọi nó là</th></tr></thead>
<tbody>
<tr><td>BVA 2 giá trị (mặc định của CTFL)</td><td>chính giá trị biên + giá trị kề nó ở vùng bên cạnh</td><td>0, 1, 100, 101</td><td>"two-point", "two-value", "min and max values"</td></tr>
<tr><td>BVA 3 giá trị</td><td>trước, tại, và ngay sau biên</td><td>0, 1, 2, 99, 100, 101</td><td>"three-point", "three-value"</td></tr>
</tbody>
</table>
<p><strong>Độ phủ BVA = số giá trị biên đã test ÷ số giá trị biên đã xác định.</strong> Trong template của PE, biên hợp lệ là mép của vùng (VB) còn biên không hợp lệ là giá trị kề ngay bên ngoài (IB).</p>`),
    walkHead(D, 29, 42),
    walk(D, [
      [29, 'Boundary value analysis (BVA) — faults lurk near boundaries',
        `<p>The ellipse is one input domain split by a vertical line: round dots on the left (one partition), squares on the right (another) — and one blue dot sits right next to the line, on the "wrong" side. That is the picture of an off-by-one defect: the programmer drew the line one value too far. Three bullets: <strong>faults tend to lurk near boundaries</strong> · a good place to look for faults · <strong>test values on both sides of boundaries</strong>. The number line: invalid | 0 · 1 | valid | 100 · 101 | invalid — the four arrows (red at 0 and 101, green at 1 and 100) are the 2-value BVA set for a field valid from 1 to 100.</p>`,
        `<p>Hình elip là một miền input bị một đường thẳng chia đôi: chấm tròn bên trái (một vùng), hình vuông bên phải (vùng khác) — và một chấm xanh nằm sát đường kẻ, ở "sai" phía. Đó chính là hình ảnh của lỗi off-by-one: lập trình viên kẻ vạch lệch một giá trị. Ba ý: <strong>lỗi hay ẩn gần biên</strong> · biên là chỗ tốt để tìm lỗi · <strong>test giá trị ở cả hai phía của biên</strong>. Trục số: invalid | 0 · 1 | valid | 100 · 101 | invalid — bốn mũi tên (đỏ ở 0 và 101, xanh ở 1 và 100) chính là bộ BVA 2 giá trị cho trường hợp lệ từ 1 tới 100.</p>`],
      [30, 'BVA — definition, variants and coverage',
        `<p>Four statements from the syllabus. (1) BVA is an <strong>extension of EP</strong> but can only be used when the partition is <strong>ordered</strong> (numbers, dates, lengths — not colours or a list of cities); the <strong>minimum and maximum values of a partition are its boundary values</strong>. (2) Some variations identify <strong>three boundary values per boundary: before, at and just over</strong> it (for boundary 1: 0, 1, 2). (3) BVA can be applied at <strong>all test levels</strong> and is generally used for requirements that call for a <strong>range of numbers</strong>. (4) <strong>BVA coverage = #boundary values tested ÷ #identified boundary test values</strong>, as a percentage. Remember: with 2-value BVA the values of a boundary are the edge of one partition and the edge of the neighbouring partition — both are boundary values.</p>`,
        `<p>Bốn phát biểu từ syllabus. (1) BVA là <strong>phần mở rộng của EP</strong> nhưng chỉ dùng được khi vùng <strong>có thứ tự</strong> (số, ngày, độ dài — không phải màu sắc hay danh sách tỉnh thành); <strong>giá trị nhỏ nhất và lớn nhất của một vùng là các giá trị biên</strong> của nó. (2) Một số biến thể lấy <strong>ba giá trị cho mỗi biên: trước, tại và ngay sau</strong> biên (với biên 1: 0, 1, 2). (3) BVA áp dụng được ở <strong>mọi cấp test</strong> và thường dùng cho yêu cầu có <strong>khoảng số</strong>. (4) <strong>Độ phủ BVA = số giá trị biên đã test ÷ số giá trị biên đã xác định</strong>, tính theo phần trăm. Nhớ: với BVA 2 giá trị, một biên gồm mép của vùng này và mép của vùng kế bên — cả hai đều là giá trị biên.</p>`],
      [31, 'Example: Loan Application — the form',
        `<p>A loan form with five inputs and their rules (blue labels): <strong>Customer name</strong> 2–64 chars · <strong>Account number</strong> 6 digits, first non-zero · <strong>Loan amount requested</strong> £500 to £9000 · <strong>Term of loan</strong> 1 to 30 years · <strong>Monthly repayment</strong> minimum £10. The two small squares (teal and dark) in front of "Term of loan" and "Monthly repayment" are option buttons — the customer fixes either the term or the repayment and the system calculates the other. The lower half shows the outputs: Term, Repayment, Interest rate, Total paid back. This form is the running example of the next five slides and the model answer of PE Question 3.</p>`,
        `<p>Một form vay vốn có năm input cùng quy tắc (nhãn xanh): <strong>Tên khách hàng</strong> 2–64 ký tự · <strong>Số tài khoản</strong> 6 chữ số, chữ số đầu khác 0 · <strong>Số tiền vay</strong> £500 tới £9000 · <strong>Thời hạn vay</strong> 1 tới 30 năm · <strong>Trả hằng tháng</strong> tối thiểu £10. Hai ô vuông nhỏ (xanh ngọc và sẫm) trước "Term of loan" và "Monthly repayment" là nút lựa chọn — khách chọn cố định thời hạn hoặc số tiền trả hằng tháng, hệ thống tính phần còn lại. Nửa dưới là output: Thời hạn, Số tiền trả, Lãi suất, Tổng tiền phải trả. Form này là ví dụ xuyên suốt năm slide tiếp theo và là đáp án mẫu của đề PE câu 3.</p>`],
      [32, 'Customer name (2–64 chars)',
        `<p>Two aspects of one field. <strong>Number of characters</strong>: invalid | 1 · 2 | valid | 64 · 65 | invalid. <strong>Valid characters</strong> (green bubble): A–Z, a–z, apostrophe, hyphen and space ("O'Brien", "Anne-Marie", "John Smith"); any other character is invalid. The table fills the first template row: valid partitions "2 to 64 chars", "valid chars"; invalid partitions "&lt; 2 chars", "&gt; 64 chars", "invalid chars"; valid boundaries "2 chars", "64 chars"; invalid boundaries "1 char", "65 chars" and "0 char" — the empty field is listed separately because "required" is usually checked by different code than "too short".</p>`,
        `<p>Hai khía cạnh của một trường. <strong>Số ký tự</strong>: invalid | 1 · 2 | valid | 64 · 65 | invalid. <strong>Ký tự hợp lệ</strong> (bong bóng xanh): A–Z, a–z, dấu nháy đơn, gạch nối và khoảng trắng ("O'Brien", "Anne-Marie", "John Smith"); mọi ký tự khác là invalid. Bảng điền dòng đầu của template: vùng valid "2 to 64 chars", "valid chars"; vùng invalid "&lt; 2 chars", "&gt; 64 chars", "invalid chars"; biên valid "2 chars", "64 chars"; biên invalid "1 char", "65 chars" và "0 char" — trường rỗng được liệt kê riêng vì "bắt buộc nhập" thường do một đoạn code khác kiểm, không phải đoạn kiểm "quá ngắn".</p>`],
      [33, 'Account number (6 digits, 1st non-zero)',
        `<p>Again two aspects. <strong>First character</strong>: valid non-zero, invalid zero. <strong>Number of digits</strong>: invalid 5 | 6 valid | 7 invalid. Table row: valid partitions "6 digits", "1st non-zero"; invalid partitions "&lt; 6 digits", "&gt; 6 digits", "1st digit = 0", "non-digit"; invalid boundary "_ (0 digit)" = the empty field. The tiny tables pasted in the boundary cells are animation leftovers in the file — the finished row is on slide 35, where the boundaries are written as <em>values</em>: 100000 and 999999 (smallest and largest valid 6-digit numbers with a non-zero first digit), 99999 (5 digits) and 1000000 (7 digits).</p>`,
        `<p>Lại hai khía cạnh. <strong>Ký tự đầu</strong>: valid khác 0, invalid bằng 0. <strong>Số chữ số</strong>: invalid 5 | 6 valid | 7 invalid. Dòng trong bảng: vùng valid "6 digits", "1st non-zero"; vùng invalid "&lt; 6 digits", "&gt; 6 digits", "1st digit = 0", "non-digit"; biên invalid "_ (0 digit)" = trường rỗng. Mấy bảng tí hon dán trong ô biên là phần sót lại của hiệu ứng trong file — dòng hoàn chỉnh ở slide 35, nơi biên được viết thành <em>giá trị</em>: 100000 và 999999 (số 6 chữ số nhỏ nhất và lớn nhất có chữ số đầu khác 0), 99999 (5 chữ số) và 1000000 (7 chữ số).</p>`],
      [34, 'Loan amount (£500 to £9000)',
        `<p>Number line: 499 | 500 · valid · 9000 | 9001 — invalid on both sides. The visible part of the table adds three invalid partitions that the number line does not show: <strong>0</strong> (a special value — typing zero is a classic user mistake and often divides-by-zero somewhere), <strong>non-numeric</strong> and <strong>null</strong> (empty). As on slide 33, the small pasted tables are animation leftovers; slide 35 has the finished row.</p>`,
        `<p>Trục số: 499 | 500 · valid · 9000 | 9001 — hai bên là invalid. Phần bảng nhìn thấy được thêm ba vùng invalid mà trục số không vẽ: <strong>0</strong> (giá trị đặc biệt — gõ số 0 là lỗi người dùng kinh điển và hay gây chia cho 0 ở đâu đó), <strong>non-numeric</strong> và <strong>null</strong> (rỗng). Như slide 33, các bảng nhỏ bị dán vào là phần sót của hiệu ứng; slide 35 có dòng hoàn chỉnh.</p>`],
      [35, 'Condition Template — the finished table (= PE Table 3.1)',
        `<p>The complete template with <strong>tags</strong>, numbered straight down each column across all conditions:</p>
<table>
<thead><tr><th>Condition</th><th>Valid partitions</th><th>Invalid partitions</th><th>Valid boundaries</th><th>Invalid boundaries</th></tr></thead>
<tbody>
<tr><td>Customer name</td><td>VP1 2–64 chars · VP2 valid chars</td><td>IP1 &lt; 2 chars · IP2 &gt; 64 chars · IP3 invalid chars</td><td>VB1 2 chars · VB2 64 chars</td><td>IB1 1 char · IB2 65 chars · IB3 0 char</td></tr>
<tr><td>Account number</td><td>VP3 6 digits · VP4 1st non-zero</td><td>IP4 &lt; 6 digits · IP5 &gt; 6 digits · IP6 1st digit = 0 · IP7 non-digit</td><td>VB3 100000 · VB4 999999</td><td>IB4 99999 · IB5 1000000 · IB6 _ (0 digit)</td></tr>
<tr><td>Loan amount</td><td>VP5 500–9000</td><td>IP8 &lt; 500 · IP9 &gt; 9000 · IP10 0 · IP11 non-integer · IP12 null</td><td>VB5 500 · VB6 9000</td><td>IB7 499 · IB8 9001</td></tr>
</tbody>
</table>
<p>Things to notice: a single value can carry two tags ("1 char" lies inside IP1 and is also IB1, so one test covers both); "non-integer" (IP11) silently assumes whole pounds — write such assumptions down in the PE ("Notes: assumptions" is allowed). The template stops at three conditions; for practice complete it: <em>Term</em> VP6 1–30 years · IP13 &lt; 1 · IP14 &gt; 30 · IP15 non-integer · VB7 1 · VB8 30 · IB9 0 · IB10 31; <em>Monthly repayment</em> VP7 ≥ £10 · IP16 &lt; £10 · VB9 £10.00 · IB11 £9.99 (assuming pence).</p>`,
        `<p>Template hoàn chỉnh có <strong>tag</strong>, đánh số liên tục theo từng cột qua mọi condition:</p>
<table>
<thead><tr><th>Condition</th><th>Vùng valid</th><th>Vùng invalid</th><th>Biên valid</th><th>Biên invalid</th></tr></thead>
<tbody>
<tr><td>Tên khách hàng</td><td>VP1 2–64 ký tự · VP2 ký tự hợp lệ</td><td>IP1 &lt; 2 ký tự · IP2 &gt; 64 ký tự · IP3 ký tự không hợp lệ</td><td>VB1 2 ký tự · VB2 64 ký tự</td><td>IB1 1 ký tự · IB2 65 ký tự · IB3 0 ký tự</td></tr>
<tr><td>Số tài khoản</td><td>VP3 6 chữ số · VP4 chữ số đầu khác 0</td><td>IP4 &lt; 6 chữ số · IP5 &gt; 6 chữ số · IP6 chữ số đầu = 0 · IP7 có ký tự không phải số</td><td>VB3 100000 · VB4 999999</td><td>IB4 99999 · IB5 1000000 · IB6 _ (0 chữ số)</td></tr>
<tr><td>Số tiền vay</td><td>VP5 500–9000</td><td>IP8 &lt; 500 · IP9 &gt; 9000 · IP10 0 · IP11 không phải số nguyên · IP12 null</td><td>VB5 500 · VB6 9000</td><td>IB7 499 · IB8 9001</td></tr>
</tbody>
</table>
<p>Điều cần để ý: một giá trị có thể mang hai tag ("1 ký tự" vừa thuộc IP1 vừa là IB1: một test phủ cả hai); "non-integer" (IP11) ngầm giả định tiền là số bảng Anh chẵn — trong bài PE hãy ghi rõ giả định kiểu này (đề cho phép ghi "assumptions"). Template dừng ở ba condition; để luyện, hãy điền tiếp: <em>Thời hạn</em> VP6 1–30 năm · IP13 &lt; 1 · IP14 &gt; 30 · IP15 không nguyên · VB7 1 · VB8 30 · IB9 0 · IB10 31; <em>Trả hằng tháng</em> VP7 ≥ £10 · IP16 &lt; £10 · VB9 £10,00 · IB11 £9,99 (giả định tính tới xu).</p>`],
      [36, 'Design Test Cases (= PE Table 3.2)',
        `<p>Columns: Test Case · Description (the input data) · Expected Outcome · <strong>New Tag Covered</strong>. TC1: John Smith / 123456 / £2500 / 3 years → term 3 years, repayment 79.86, interest 10%, total 2874.96 — covers VP1–VP5 (a "typical" all-valid test). TC2: AB / 100000 / £500 / 1 year → repayment 44.80, 7.5%, total 537.60 — covers VB1, VB3, VB5 (all <em>lower</em> valid boundaries in one test; a TC3 would take the upper ones: 64-char name, 999999, £9000). Arithmetic check: 79.86 × 36 = 2874.96 and 44.80 × 12 = 537.60 ✓. The interest rates (10%, 7.5%) are not in the specification on slide 31 — in a real project the expected values come from an <em>oracle</em> such as the bank's rate table; in the PE write the rule you assumed. "New tag covered" lists only tags not covered by earlier rows, which is how you prove "cover as many TAGs as possible".</p>`,
        `<p>Các cột: Test Case · Description (dữ liệu nhập) · Expected Outcome · <strong>New Tag Covered</strong>. TC1: John Smith / 123456 / £2500 / 3 năm → thời hạn 3 năm, trả 79,86/tháng, lãi 10%, tổng 2874,96 — phủ VP1–VP5 (test "điển hình" toàn giá trị valid). TC2: AB / 100000 / £500 / 1 năm → trả 44,80, lãi 7,5%, tổng 537,60 — phủ VB1, VB3, VB5 (mọi biên valid <em>dưới</em> trong một test; TC3 sẽ lấy biên trên: tên 64 ký tự, 999999, £9000). Kiểm số học: 79,86 × 36 = 2874,96 và 44,80 × 12 = 537,60 ✓. Lãi suất (10%, 7,5%) không có trong đặc tả ở slide 31 — trong dự án thật, kết quả mong đợi lấy từ một <em>oracle</em> như bảng lãi suất của ngân hàng; trong bài PE hãy ghi quy tắc bạn đã giả định. Cột "New tag covered" chỉ ghi tag chưa được phủ ở các dòng trên — đó là cách chứng minh bạn "phủ nhiều TAG nhất có thể".</p>`],
      [37, 'Why do both EP and BVA?',
        `<p>"If you do boundaries only, you have covered all the partitions as well" — technically correct, and fine if everything works. But: if a boundary test fails, is the <em>whole partition</em> wrong or only the boundary in the wrong place? You have to test mid-partition anyway; testing only extremes gives little confidence for typical user scenarios; and boundaries may be harder (more costly) to set up. Teacher's notes (translated): for a sum function with input <em>a</em> in −1000…1000, EP needs only one representative per partition (e.g. −500, 0, 500), while boundary testing needs more, carefully prepared values such as −1000, −999, −1, 0, 1, 999, 1000 — more effort. Small remark: for the single range −1000…1000 the strict 2-value BVA set is −1001, −1000, 1000, 1001; the notes' −1, 0, 1 probe zero, which is a sensible extra "special value".</p>`,
        `<p>"Nếu chỉ test biên thì cũng đã phủ luôn mọi vùng" — đúng về kỹ thuật, và ổn nếu mọi thứ chạy đúng. Nhưng: nếu một test biên fail, cả <em>vùng</em> sai hay chỉ biên bị đặt lệch? Đằng nào cũng phải test giữa vùng; chỉ test cực trị thì ít niềm tin cho các tình huống dùng điển hình; và biên có thể khó (tốn kém) chuẩn bị hơn. Ghi chú của thầy/cô: với hàm cộng có input <em>a</em> trong −1000…1000, EP chỉ cần một đại diện mỗi vùng (vd −500, 0, 500), còn test biên cần nhiều giá trị chuẩn bị kỹ hơn như −1000, −999, −1, 0, 1, 999, 1000 — tốn công hơn. Góp ý nhỏ: với một khoảng −1000…1000 duy nhất, bộ BVA 2 giá trị chuẩn là −1001, −1000, 1000, 1001; các giá trị −1, 0, 1 trong ghi chú là thăm dò số 0 — một "giá trị đặc biệt" nên thêm.</p>`],
      [38, 'Test objectives? — which columns to test first',
        `<p>The empty template with coloured frames and arrows linking goals to columns. <strong>Thorough approach: VP, IP, VB, IB</strong> — everything. Under time pressure it depends on your test objective: <strong>user confidence in typical transactions with a minimal number of tests → VP only</strong>; <strong>maximum fault finding → start with boundary values (VB + IB)</strong>; <strong>confidence that the system handles bad inputs → mainly IP and IB</strong>. This is risk-based selection (Chapter 5) applied to a single table.</p>`,
        `<p>Template trống với khung màu và mũi tên nối mục tiêu với cột. <strong>Làm kỹ: VP, IP, VB, IB</strong> — tất cả. Khi gấp thời gian thì tuỳ mục tiêu test: <strong>tạo niềm tin cho người dùng ở giao dịch điển hình với ít test nhất → chỉ VP</strong>; <strong>tìm nhiều lỗi nhất → bắt đầu với giá trị biên (VB + IB)</strong>; <strong>tin rằng hệ thống xử lý đúng input xấu → chủ yếu IP và IB</strong>. Đây là chọn test theo rủi ro (Chương 5) áp dụng trên một bảng.</p>`],
      [39, 'Question — exam grades with BVA, minimum number of tests',
        AE(`D — 14`, `Partitions: 1–49 F · 50–59 D− · 60–69 D · 70–79 C · 80–89 B · 90–100 A, invalid below 1 and above 100. 2-value BVA takes both edges of every valid partition: 1, 49, 50, 59, 60, 69, 70, 79, 80, 89, 90, 100 (12 values) plus the invalid neighbours 0 and 101 → <strong>14</strong>. Script: <code>[0, 1, 49, 50, 59, 60, 69, 70, 79, 80, 89, 90, 100, 101] 14</code>. 12 forgets the invalid neighbours. (Slide typo: "50 – 59 = D—" is D minus.)`),
        AV(`D — 14`, `Các vùng: 1–49 F · 50–59 D− · 60–69 D · 70–79 C · 80–89 B · 90–100 A, invalid dưới 1 và trên 100. BVA 2 giá trị lấy cả hai mép của mọi vùng valid: 1, 49, 50, 59, 60, 69, 70, 79, 80, 89, 90, 100 (12 giá trị) cộng hai giá trị invalid kề bên là 0 và 101 → <strong>14</strong>. Script: <code>[0, 1, 49, 50, 59, 60, 69, 70, 79, 80, 89, 90, 100, 101] 14</code>. Trả lời 12 là quên hai giá trị invalid kề biên. (Lỗi đánh máy trên slide: "50 – 59 = D—" là D trừ.)`)],
      [40, 'Question — smart-home temperature, highest boundary coverage',
        AE(`C — 14 °C, 20 °C, 24 °C, 30 °C, 31 °C`, `Partitions (whole degrees): ≤ 14 Freezing · 15–19 Cold · 20–24 Cool · 25–30 Open the window · ≥ 31 Turn the AC on. With "only min and max values" the boundary values are 14 | 15, 19 | 20, 24 | 25, 30 | 31 → 8 values (Freezing has no minimum, AC no maximum). Count the hits (the yellow numbers on the slide): A → 15, 25 = 2 · B → 19, 24, 30 = 3 · <strong>C → 14, 20, 24, 30, 31 = 5</strong> (62.5%) · D → 19, 24, 30 = 3 (six values but 18, 23, 29 are mid-partition). The overlapping number line on the slide is the teacher's annotation of these edges.`),
        AV(`C — 14 °C, 20 °C, 24 °C, 30 °C, 31 °C`, `Các vùng (độ nguyên): ≤ 14 Freezing · 15–19 Cold · 20–24 Cool · 25–30 Mở cửa sổ · ≥ 31 Bật điều hoà. Với "chỉ giá trị min và max", các giá trị biên là 14 | 15, 19 | 20, 24 | 25, 30 | 31 → 8 giá trị (Freezing không có min, AC không có max). Đếm số trúng (số màu vàng trên slide): A → 15, 25 = 2 · B → 19, 24, 30 = 3 · <strong>C → 14, 20, 24, 30, 31 = 5</strong> (62,5%) · D → 19, 24, 30 = 3 (sáu giá trị nhưng 18, 23, 29 nằm giữa vùng). Trục số chồng lên chữ trên slide là phần thầy/cô đánh dấu các mép này.`)],
      [41, 'Question — bulk order units, 2-point boundary values',
        AE(`C — 0.4, 0.5, 25.0, 25.1`, `Valid 0.5–25.0 with precision 0.1. Two-point BVA per boundary = the edge and its neighbour one step (0.1) outside: 0.4 | 0.5 and 25.0 | 25.1. A is EP (one value per partition). B adds 0.6 and 14.9 (not boundary values) — it looks like 3-value BVA but is incomplete (24.9 missing). D has only the valid side (0.6 and 24.9 are inside). The units (g or kg) are a distractor — the rule is the same for both.`),
        AV(`C — 0,4; 0,5; 25,0; 25,1`, `Valid 0,5–25,0 với độ chính xác 0,1. BVA hai điểm mỗi biên = chính mép và giá trị kề một bước (0,1) ra ngoài: 0,4 | 0,5 và 25,0 | 25,1. A là EP (mỗi vùng một giá trị). B thêm 0,6 và 14,9 (không phải giá trị biên) — trông như BVA 3 giá trị nhưng thiếu (không có 24,9). D chỉ có phía valid (0,6 và 24,9 nằm bên trong). Đơn vị (g hay kg) là thông tin nhiễu — quy tắc như nhau cho cả hai.`)],
      [42, 'Question — shipping (max 100 lbs), tests for 100% BVA',
        AE(`C — 10`, `Now there is a legal upper limit, so the table is 1–10 · 11–25 · 26–50 · 51–100, invalid ≤ 0 and &gt; 100 (whole pounds). Boundary values: 0 | 1, 10 | 11, 25 | 26, 50 | 51, 100 | 101 → <strong>10</strong> (script: <code>[0, 1, 10, 11, 25, 26, 50, 51, 100, 101] 10</code>). 8 forgets the two invalid neighbours; 4 counts boundaries between rates only; 12 would be 3-value thinking gone half-way.`),
        AV(`C — 10`, `Giờ có trần theo quy định, nên bảng là 1–10 · 11–25 · 26–50 · 51–100, invalid ≤ 0 và &gt; 100 (pound nguyên). Giá trị biên: 0 | 1, 10 | 11, 25 | 26, 50 | 51, 100 | 101 → <strong>10</strong> (script: <code>[0, 1, 10, 11, 25, 26, 50, 51, 100, 101] 10</code>). 8 là quên hai giá trị invalid kề biên; 4 là chỉ đếm các vạch giữa các mức giá; 12 là tư duy 3 giá trị làm dở dang.`)],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — the full PE FA23 Question 3</h3>
<p><strong>The paper</strong> (SWT301 FA23 PE, 4 points): black-box test the function <em>Create the inspection decision</em> (actor: Department Head). Business rules: "Tên quyết định kiểm tra" required, 50–255 characters, first character not a number, no special characters or blanks · "Chi tiết" required, at most 10,000 characters · "Trường kiểm tra" required, chosen from a list, default "Chọn trường để kiểm tra" · "Tài liệu công văn": at least one document; each has "Tên tài liệu" (required, 10–100 chars), "Mã tài liệu" (required, 3–10 chars) and a file of at most 10 MB. Tasks: (1) Table 3.1 EP + BVA with tags; (2) Table 3.2 — 10 test cases covering as many tags as possible; (3) Table 3.3 — the same 10 with pre-conditions and procedures.</p>
<p><strong>Assumptions</strong> (write them in the answer, the paper invites it): letters with Vietnamese diacritics count as letters; 1 MB = 1,048,576 bytes, file size precision 1 byte; the number of documents has no upper limit.</p>
<h4>Table 3.1 — Test analysis</h4>
<table>
<thead><tr><th>Condition</th><th>Valid partitions</th><th>Tag</th><th>Invalid partitions</th><th>Tag</th><th>Valid boundaries</th><th>Tag</th><th>Invalid boundaries</th><th>Tag</th></tr></thead>
<tbody>
<tr><td rowspan="5">Tên quyết định kiểm tra</td><td>50–255 chars</td><td>VP1</td><td>&lt; 50 chars</td><td>IP1</td><td>50 chars</td><td>VB1</td><td>49 chars</td><td>IB1</td></tr>
<tr><td>1st char not a digit</td><td>VP2</td><td>&gt; 255 chars</td><td>IP2</td><td>255 chars</td><td>VB2</td><td>256 chars</td><td>IB2</td></tr>
<tr><td>letters/digits only</td><td>VP3</td><td>1st char is a digit</td><td>IP3</td><td></td><td></td><td>0 chars (empty)</td><td>IB3</td></tr>
<tr><td></td><td></td><td>contains a special char</td><td>IP4</td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td>contains a blank</td><td>IP5</td><td></td><td></td><td></td><td></td></tr>
<tr><td rowspan="2">Chi tiết</td><td>1–10,000 chars</td><td>VP4</td><td>&gt; 10,000 chars</td><td>IP6</td><td>1 char</td><td>VB3</td><td>10,001 chars</td><td>IB4</td></tr>
<tr><td></td><td></td><td></td><td></td><td>10,000 chars</td><td>VB4</td><td>0 chars (empty)</td><td>IB5</td></tr>
<tr><td>Trường kiểm tra</td><td>a school selected</td><td>VP5</td><td>default "Chọn trường để kiểm tra"</td><td>IP7</td><td></td><td></td><td></td><td></td></tr>
<tr><td>Tài liệu công văn</td><td>≥ 1 document</td><td>VP6</td><td>no document</td><td>IP8</td><td>1 document</td><td>VB5</td><td>0 documents</td><td>IB6</td></tr>
<tr><td rowspan="2">Tên tài liệu</td><td>10–100 chars</td><td>VP7</td><td>&lt; 10 chars</td><td>IP9</td><td>10 chars</td><td>VB6</td><td>9 chars</td><td>IB7</td></tr>
<tr><td></td><td></td><td>&gt; 100 chars</td><td>IP10</td><td>100 chars</td><td>VB7</td><td>101 chars · 0 chars (empty)</td><td>IB8 · IB9</td></tr>
<tr><td rowspan="2">Mã tài liệu</td><td>3–10 chars</td><td>VP8</td><td>&lt; 3 chars</td><td>IP11</td><td>3 chars</td><td>VB8</td><td>2 chars</td><td>IB10</td></tr>
<tr><td></td><td></td><td>&gt; 10 chars</td><td>IP12</td><td>10 chars</td><td>VB9</td><td>11 chars · 0 chars (empty)</td><td>IB11 · IB12</td></tr>
<tr><td>File size</td><td>≤ 10 MB</td><td>VP9</td><td>&gt; 10 MB</td><td>IP13</td><td>10 MB = 10,485,760 B</td><td>VB10</td><td>10,485,761 B</td><td>IB13</td></tr>
</tbody>
</table>
<h4>Table 3.2 — Test case design (tests 1–10 = the PE answer; 11–19 complete the coverage)</h4>
<table>
<thead><tr><th>#</th><th>Description (only what differs from the "good" data of test 1)</th><th>Expected result</th><th>TAG</th></tr></thead>
<tbody>
<tr><td>1</td><td>Name = 50 chars, starts with a letter, letters/digits only · Chi tiết = 1 char · school chosen · 1 document: Tên tài liệu 10 chars, Mã 3 chars, file exactly 10 MB</td><td>"Tạo quyết định kiểm tra thành công", decision listed</td><td>VP1–VP9, VB1, VB3, VB5, VB6, VB8, VB10</td></tr>
<tr><td>2</td><td>Name = 255 chars · Chi tiết = 10,000 chars · 2 documents: Tên tài liệu 100 chars, Mã 10 chars, file 2 MB</td><td>Created successfully</td><td>VB2, VB4, VB7, VB9</td></tr>
<tr><td>3</td><td>Name = 49 chars</td><td>Error: name must be 50–255 characters; nothing saved</td><td>IP1, IB1</td></tr>
<tr><td>4</td><td>Name = 256 chars</td><td>Same length error</td><td>IP2, IB2</td></tr>
<tr><td>5</td><td>Chi tiết = 10,001 chars</td><td>Error: details must not exceed 10,000 characters</td><td>IP6, IB4</td></tr>
<tr><td>6</td><td>Tên tài liệu = 9 chars</td><td>Error: document name must be 10–100 characters</td><td>IP9, IB7</td></tr>
<tr><td>7</td><td>Tên tài liệu = 101 chars</td><td>Same error</td><td>IP10, IB8</td></tr>
<tr><td>8</td><td>Mã tài liệu = 2 chars</td><td>Error: document code must be 3–10 characters</td><td>IP11, IB10</td></tr>
<tr><td>9</td><td>Mã tài liệu = 11 chars</td><td>Same error</td><td>IP12, IB11</td></tr>
<tr><td>10</td><td>File = 10,485,761 bytes</td><td>Error: each file must not exceed 10 MB</td><td>IP13, IB13</td></tr>
<tr><td>11</td><td>Name empty</td><td>Error: name is required</td><td>IB3</td></tr>
<tr><td>12</td><td>Name starts with a digit ("1QuyetDinh…", 60 chars)</td><td>Error: first character must not be a number</td><td>IP3</td></tr>
<tr><td>13</td><td>Name contains "@"</td><td>Error: no special characters</td><td>IP4</td></tr>
<tr><td>14</td><td>Name contains a blank</td><td>Error: no blanks</td><td>IP5</td></tr>
<tr><td>15</td><td>Chi tiết empty</td><td>Error: details are required</td><td>IB5</td></tr>
<tr><td>16</td><td>School left at "Chọn trường để kiểm tra"</td><td>Error: please select a school</td><td>IP7</td></tr>
<tr><td>17</td><td>No document attached</td><td>Error: at least one document is required</td><td>IP8, IB6</td></tr>
<tr><td>18</td><td>Tên tài liệu empty</td><td>Error: document name is required</td><td>IB9</td></tr>
<tr><td>19</td><td>Mã tài liệu empty</td><td>Error: document code is required</td><td>IB12</td></tr>
</tbody>
</table>
<p><strong>Why these 10 first?</strong> The two all-valid tests cover all 9 VP and all 10 VB tags (19 tags). Every other test may contain only <em>one</em> invalid field (slide 22), so the best a test can do is two tags (an IP plus its IB). Nine such pairs exist (tests 3–10 and 17); any eight of them give the maximum for 10 tests. Coverage check (real script output — it also asserts that no test mixes two invalid fields):</p>
<pre><code>total tags: 45 (VP 9 IP 13 VB 10 IB 13 )
tests 1-10 cover 35 tags; missing: ['IP3', 'IP4', 'IP5', 'IP7', 'IP8', 'IB3', 'IB5', 'IB6', 'IB9', 'IB12']
tests 1-19 cover 45 of 45 missing: []</code></pre>
<h4>Table 3.3 — one row written out in full</h4>
<table>
<thead><tr><th>ID</th><th>Description</th><th>Pre-condition</th><th>Procedure</th><th>Expected output</th></tr></thead>
<tbody>
<tr><td>TC03</td><td>Name shorter than 50 characters is rejected (IP1, IB1)</td><td>Logged in as Department Head; at least one school exists; a 1 MB PDF is ready</td><td>1. Open "Tạo quyết định kiểm tra". 2. Enter a 49-character name starting with a letter, letters/digits only. 3. Enter Chi tiết "Kiem tra dinh ky". 4. Choose a school. 5. Add a document: name "CongVan001", code "CV1", attach the PDF. 6. Click "Lưu".</td><td>A message under the name field says the name must be 50–255 characters; the decision is not saved; the form keeps the other values.</td></tr>
</tbody>
</table>
<h3>Bonus — BVA catches an off-by-one that EP misses (Java, compiled and run)</h3>
<pre><code>public class GradeBva {
    // Spec: 0..100 accepted; 0-49 -&gt; "Fail"; 50-100 -&gt; "Pass"; otherwise "Invalid"
    static String gradeBuggy(int s) {            // off-by-one: &gt; instead of &gt;=
        if (s &lt; 0 || s &gt; 100) return "Invalid";
        return s &gt; 50 ? "Pass" : "Fail";
    }
    static String expected(int s) { return (s &lt; 0 || s &gt; 100) ? "Invalid" : (s &gt;= 50 ? "Pass" : "Fail"); }
    public static void main(String[] a) {
        int[] ep  = {-10, 25, 75, 150};              // one value per partition
        int[] bva = {-1, 0, 49, 50, 100, 101};       // 2-value BVA
        run("EP only ", ep);
        run("2-value BVA", bva);
    }
    static void run(String name, int[] vals) {
        int fail = 0;
        for (int v : vals) {
            String got = gradeBuggy(v), exp = expected(v);
            boolean ok = got.equals(exp);
            if (!ok) fail++;
            System.out.printf("%s  score=%4d expected=%-7s got=%-7s %s%n", name, v, exp, got, ok ? "PASS" : "FAIL &lt;-- defect found");
        }
        System.out.println(name + ": " + fail + " failing test(s) against the buggy version");
    }
}</code></pre>
<pre><code>EP only   score= -10 expected=Invalid got=Invalid PASS
EP only   score=  25 expected=Fail    got=Fail    PASS
EP only   score=  75 expected=Pass    got=Pass    PASS
EP only   score= 150 expected=Invalid got=Invalid PASS
EP only : 0 failing test(s) against the buggy version
2-value BVA  score=  -1 expected=Invalid got=Invalid PASS
2-value BVA  score=   0 expected=Fail    got=Fail    PASS
2-value BVA  score=  49 expected=Fail    got=Fail    PASS
2-value BVA  score=  50 expected=Pass    got=Fail    FAIL &lt;-- defect found
2-value BVA  score= 100 expected=Pass    got=Pass    PASS
2-value BVA  score= 101 expected=Invalid got=Invalid PASS
2-value BVA: 1 failing test(s) against the buggy version</code></pre>
<div class="pitfall"><b>Where students lose PE points on Question 3:</b> (1) two invalid values in one test case (the first error hides the second — one invalid per test); (2) boundaries written as ranges ("&lt; 50") instead of concrete values ("49 chars"); (3) forgetting "required" (the empty value) and the default option of a drop-down; (4) expected results like "error" instead of the concrete message and "nothing saved"; (5) tags in Table 3.2 that do not exist in Table 3.1; (6) valid boundaries tested only inside failing tests — a valid boundary must be proven <em>accepted</em>, so it belongs in a test that expects success (tests 1–2).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Robust and worst-case BVA, and pairwise.</b> Jorgensen's textbook variants for <em>n</em> independent numeric inputs: normal BVA (min, min+, nominal, max−, max for one variable at a time) needs 4n + 1 tests; robust BVA adds min− and max+ (6n + 1); worst-case BVA combines all five values of every variable (5<sup>n</sup>: 125 tests for 3 inputs); robust worst-case 7<sup>n</sup> (343). Real teams avoid the explosion with <em>pairwise (all-pairs)</em> testing: every pair of boundary values appears together in at least one test, because most interaction defects involve at most two parameters. Tools: PICT (Microsoft), ACTS (NIST). <em>Outside the syllabus because CTFL BVA looks at one condition at a time.</em></div>`,
    `<h3>Ví dụ có lời giải · Giải trọn đề PE FA23 câu 3</h3>
<p><strong>Đề</strong> (PE SWT301 FA23, 4 điểm): kiểm thử black-box chức năng <em>Tạo quyết định kiểm tra</em> (tác nhân: Trưởng phòng). Quy tắc nghiệp vụ: "Tên quyết định kiểm tra" bắt buộc, 50–255 ký tự, ký tự đầu không phải số, không ký tự đặc biệt, không khoảng trắng · "Chi tiết" bắt buộc, tối đa 10.000 ký tự · "Trường kiểm tra" bắt buộc, chọn từ danh sách, mặc định "Chọn trường để kiểm tra" · "Tài liệu công văn": ít nhất một tài liệu; mỗi tài liệu có "Tên tài liệu" (bắt buộc, 10–100 ký tự), "Mã tài liệu" (bắt buộc, 3–10 ký tự) và file tối đa 10 MB. Yêu cầu: (1) Bảng 3.1 EP + BVA có tag; (2) Bảng 3.2 — 10 test case phủ nhiều tag nhất; (3) Bảng 3.3 — viết lại 10 test đó kèm pre-condition và các bước.</p>
<p><strong>Giả định</strong> (ghi vào bài, đề cho phép): chữ cái có dấu tiếng Việt vẫn tính là chữ cái; 1 MB = 1.048.576 byte, độ chính xác kích thước file là 1 byte; số tài liệu không có giới hạn trên.</p>
<h4>Bảng 3.1 — Phân tích test</h4>
<table>
<thead><tr><th>Condition</th><th>Vùng valid</th><th>Tag</th><th>Vùng invalid</th><th>Tag</th><th>Biên valid</th><th>Tag</th><th>Biên invalid</th><th>Tag</th></tr></thead>
<tbody>
<tr><td rowspan="5">Tên quyết định kiểm tra</td><td>50–255 ký tự</td><td>VP1</td><td>&lt; 50 ký tự</td><td>IP1</td><td>50 ký tự</td><td>VB1</td><td>49 ký tự</td><td>IB1</td></tr>
<tr><td>ký tự đầu không phải số</td><td>VP2</td><td>&gt; 255 ký tự</td><td>IP2</td><td>255 ký tự</td><td>VB2</td><td>256 ký tự</td><td>IB2</td></tr>
<tr><td>chỉ chữ và số</td><td>VP3</td><td>ký tự đầu là số</td><td>IP3</td><td></td><td></td><td>0 ký tự (rỗng)</td><td>IB3</td></tr>
<tr><td></td><td></td><td>có ký tự đặc biệt</td><td>IP4</td><td></td><td></td><td></td><td></td></tr>
<tr><td></td><td></td><td>có khoảng trắng</td><td>IP5</td><td></td><td></td><td></td><td></td></tr>
<tr><td rowspan="2">Chi tiết</td><td>1–10.000 ký tự</td><td>VP4</td><td>&gt; 10.000 ký tự</td><td>IP6</td><td>1 ký tự</td><td>VB3</td><td>10.001 ký tự</td><td>IB4</td></tr>
<tr><td></td><td></td><td></td><td></td><td>10.000 ký tự</td><td>VB4</td><td>0 ký tự (rỗng)</td><td>IB5</td></tr>
<tr><td>Trường kiểm tra</td><td>đã chọn một trường</td><td>VP5</td><td>để mặc định "Chọn trường để kiểm tra"</td><td>IP7</td><td></td><td></td><td></td><td></td></tr>
<tr><td>Tài liệu công văn</td><td>≥ 1 tài liệu</td><td>VP6</td><td>không có tài liệu</td><td>IP8</td><td>1 tài liệu</td><td>VB5</td><td>0 tài liệu</td><td>IB6</td></tr>
<tr><td rowspan="2">Tên tài liệu</td><td>10–100 ký tự</td><td>VP7</td><td>&lt; 10 ký tự</td><td>IP9</td><td>10 ký tự</td><td>VB6</td><td>9 ký tự</td><td>IB7</td></tr>
<tr><td></td><td></td><td>&gt; 100 ký tự</td><td>IP10</td><td>100 ký tự</td><td>VB7</td><td>101 ký tự · 0 ký tự (rỗng)</td><td>IB8 · IB9</td></tr>
<tr><td rowspan="2">Mã tài liệu</td><td>3–10 ký tự</td><td>VP8</td><td>&lt; 3 ký tự</td><td>IP11</td><td>3 ký tự</td><td>VB8</td><td>2 ký tự</td><td>IB10</td></tr>
<tr><td></td><td></td><td>&gt; 10 ký tự</td><td>IP12</td><td>10 ký tự</td><td>VB9</td><td>11 ký tự · 0 ký tự (rỗng)</td><td>IB11 · IB12</td></tr>
<tr><td>Kích thước file</td><td>≤ 10 MB</td><td>VP9</td><td>&gt; 10 MB</td><td>IP13</td><td>10 MB = 10.485.760 B</td><td>VB10</td><td>10.485.761 B</td><td>IB13</td></tr>
</tbody>
</table>
<h4>Bảng 3.2 — Thiết kế test case (test 1–10 = bài làm PE; 11–19 để phủ đủ 100%)</h4>
<table>
<thead><tr><th>#</th><th>Mô tả (chỉ ghi phần khác với dữ liệu "tốt" của test 1)</th><th>Kết quả mong đợi</th><th>TAG</th></tr></thead>
<tbody>
<tr><td>1</td><td>Tên = 50 ký tự, bắt đầu bằng chữ, chỉ chữ/số · Chi tiết = 1 ký tự · đã chọn trường · 1 tài liệu: Tên tài liệu 10 ký tự, Mã 3 ký tự, file đúng 10 MB</td><td>"Tạo quyết định kiểm tra thành công", quyết định hiện trong danh sách</td><td>VP1–VP9, VB1, VB3, VB5, VB6, VB8, VB10</td></tr>
<tr><td>2</td><td>Tên = 255 ký tự · Chi tiết = 10.000 ký tự · 2 tài liệu: Tên tài liệu 100 ký tự, Mã 10 ký tự, file 2 MB</td><td>Tạo thành công</td><td>VB2, VB4, VB7, VB9</td></tr>
<tr><td>3</td><td>Tên = 49 ký tự</td><td>Lỗi: tên phải từ 50–255 ký tự; không lưu gì</td><td>IP1, IB1</td></tr>
<tr><td>4</td><td>Tên = 256 ký tự</td><td>Cùng lỗi độ dài</td><td>IP2, IB2</td></tr>
<tr><td>5</td><td>Chi tiết = 10.001 ký tự</td><td>Lỗi: chi tiết không vượt quá 10.000 ký tự</td><td>IP6, IB4</td></tr>
<tr><td>6</td><td>Tên tài liệu = 9 ký tự</td><td>Lỗi: tên tài liệu phải 10–100 ký tự</td><td>IP9, IB7</td></tr>
<tr><td>7</td><td>Tên tài liệu = 101 ký tự</td><td>Cùng lỗi</td><td>IP10, IB8</td></tr>
<tr><td>8</td><td>Mã tài liệu = 2 ký tự</td><td>Lỗi: mã tài liệu phải 3–10 ký tự</td><td>IP11, IB10</td></tr>
<tr><td>9</td><td>Mã tài liệu = 11 ký tự</td><td>Cùng lỗi</td><td>IP12, IB11</td></tr>
<tr><td>10</td><td>File = 10.485.761 byte</td><td>Lỗi: mỗi file không vượt quá 10 MB</td><td>IP13, IB13</td></tr>
<tr><td>11</td><td>Tên để trống</td><td>Lỗi: tên là bắt buộc</td><td>IB3</td></tr>
<tr><td>12</td><td>Tên bắt đầu bằng số ("1QuyetDinh…", 60 ký tự)</td><td>Lỗi: ký tự đầu không được là số</td><td>IP3</td></tr>
<tr><td>13</td><td>Tên chứa "@"</td><td>Lỗi: không được có ký tự đặc biệt</td><td>IP4</td></tr>
<tr><td>14</td><td>Tên chứa khoảng trắng</td><td>Lỗi: không được có khoảng trắng</td><td>IP5</td></tr>
<tr><td>15</td><td>Chi tiết để trống</td><td>Lỗi: chi tiết là bắt buộc</td><td>IB5</td></tr>
<tr><td>16</td><td>Để trường ở "Chọn trường để kiểm tra"</td><td>Lỗi: vui lòng chọn trường</td><td>IP7</td></tr>
<tr><td>17</td><td>Không đính kèm tài liệu nào</td><td>Lỗi: cần ít nhất một tài liệu</td><td>IP8, IB6</td></tr>
<tr><td>18</td><td>Tên tài liệu để trống</td><td>Lỗi: tên tài liệu là bắt buộc</td><td>IB9</td></tr>
<tr><td>19</td><td>Mã tài liệu để trống</td><td>Lỗi: mã tài liệu là bắt buộc</td><td>IB12</td></tr>
</tbody>
</table>
<p><strong>Vì sao chọn 10 test này trước?</strong> Hai test toàn-valid phủ đủ 9 tag VP và 10 tag VB (19 tag). Mọi test còn lại chỉ được chứa <em>một</em> trường invalid (slide 22), nên một test tốt nhất cũng chỉ phủ được hai tag (một IP cùng IB của nó). Có chín cặp như vậy (test 3–10 và 17); lấy tám cặp bất kỳ đều đạt mức tối đa cho 10 test. Kiểm độ phủ (output thật của script — script còn assert không test nào trộn hai trường invalid):</p>
<pre><code>total tags: 45 (VP 9 IP 13 VB 10 IB 13 )
tests 1-10 cover 35 tags; missing: ['IP3', 'IP4', 'IP5', 'IP7', 'IP8', 'IB3', 'IB5', 'IB6', 'IB9', 'IB12']
tests 1-19 cover 45 of 45 missing: []</code></pre>
<h4>Bảng 3.3 — viết đầy đủ một dòng</h4>
<table>
<thead><tr><th>ID</th><th>Mô tả</th><th>Pre-condition</th><th>Các bước</th><th>Kết quả mong đợi</th></tr></thead>
<tbody>
<tr><td>TC03</td><td>Tên ngắn hơn 50 ký tự bị từ chối (IP1, IB1)</td><td>Đã đăng nhập bằng tài khoản Trưởng phòng; có ít nhất một trường trong danh sách; chuẩn bị sẵn file PDF 1 MB</td><td>1. Mở "Tạo quyết định kiểm tra". 2. Nhập tên 49 ký tự bắt đầu bằng chữ, chỉ chữ/số. 3. Nhập Chi tiết "Kiem tra dinh ky". 4. Chọn một trường. 5. Thêm tài liệu: tên "CongVan001", mã "CV1", đính kèm file PDF. 6. Bấm "Lưu".</td><td>Dưới ô tên hiện thông báo tên phải từ 50–255 ký tự; quyết định không được lưu; form giữ nguyên các giá trị khác.</td></tr>
</tbody>
</table>
<h3>Thêm — BVA bắt được lỗi off-by-one mà EP bỏ lọt (Java, đã biên dịch và chạy)</h3>
<pre><code>public class GradeBva {
    // Spec: 0..100 accepted; 0-49 -&gt; "Fail"; 50-100 -&gt; "Pass"; otherwise "Invalid"
    static String gradeBuggy(int s) {            // off-by-one: &gt; instead of &gt;=
        if (s &lt; 0 || s &gt; 100) return "Invalid";
        return s &gt; 50 ? "Pass" : "Fail";
    }
    static String expected(int s) { return (s &lt; 0 || s &gt; 100) ? "Invalid" : (s &gt;= 50 ? "Pass" : "Fail"); }
    public static void main(String[] a) {
        int[] ep  = {-10, 25, 75, 150};              // one value per partition
        int[] bva = {-1, 0, 49, 50, 100, 101};       // 2-value BVA
        run("EP only ", ep);
        run("2-value BVA", bva);
    }
    static void run(String name, int[] vals) {
        int fail = 0;
        for (int v : vals) {
            String got = gradeBuggy(v), exp = expected(v);
            boolean ok = got.equals(exp);
            if (!ok) fail++;
            System.out.printf("%s  score=%4d expected=%-7s got=%-7s %s%n", name, v, exp, got, ok ? "PASS" : "FAIL &lt;-- defect found");
        }
        System.out.println(name + ": " + fail + " failing test(s) against the buggy version");
    }
}</code></pre>
<pre><code>EP only   score= -10 expected=Invalid got=Invalid PASS
EP only   score=  25 expected=Fail    got=Fail    PASS
EP only   score=  75 expected=Pass    got=Pass    PASS
EP only   score= 150 expected=Invalid got=Invalid PASS
EP only : 0 failing test(s) against the buggy version
2-value BVA  score=  -1 expected=Invalid got=Invalid PASS
2-value BVA  score=   0 expected=Fail    got=Fail    PASS
2-value BVA  score=  49 expected=Fail    got=Fail    PASS
2-value BVA  score=  50 expected=Pass    got=Fail    FAIL &lt;-- defect found
2-value BVA  score= 100 expected=Pass    got=Pass    PASS
2-value BVA  score= 101 expected=Invalid got=Invalid PASS
2-value BVA: 1 failing test(s) against the buggy version</code></pre>
<div class="pitfall"><b>Chỗ sinh viên hay mất điểm ở PE câu 3:</b> (1) hai giá trị invalid trong cùng một test case (lỗi đầu che lỗi sau — mỗi test một invalid); (2) ghi biên dạng khoảng ("&lt; 50") thay vì giá trị cụ thể ("49 ký tự"); (3) quên "bắt buộc" (giá trị rỗng) và lựa chọn mặc định của drop-down; (4) kết quả mong đợi ghi chung chung "báo lỗi" thay vì thông báo cụ thể và "không lưu"; (5) tag ở Bảng 3.2 không có trong Bảng 3.1; (6) biên valid chỉ xuất hiện trong test mong đợi lỗi — biên valid phải được chứng minh là <em>được chấp nhận</em>, nên phải nằm trong test mong đợi thành công (test 1–2).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>BVA robust, worst-case và pairwise.</b> Các biến thể trong sách của Jorgensen cho <em>n</em> input số độc lập: BVA thường (min, min+, nominal, max−, max, mỗi lần đổi một biến) cần 4n + 1 test; BVA robust thêm min− và max+ (6n + 1); BVA worst-case tổ hợp cả năm giá trị của mọi biến (5<sup>n</sup>: 125 test với 3 input); robust worst-case là 7<sup>n</sup> (343). Đội thực tế tránh bùng nổ bằng <em>pairwise (all-pairs)</em>: mọi cặp giá trị biên xuất hiện cùng nhau trong ít nhất một test, vì phần lớn lỗi tương tác chỉ dính tới tối đa hai tham số. Công cụ: PICT (Microsoft), ACTS (NIST). <em>Ngoài giáo trình vì BVA của CTFL chỉ xét từng condition một.</em></div>`),
    books([
      ['fst4', 'Ch.4 Section 2 — boundary value analysis, book pp.116–119, Table 4.1 (partitions and boundaries) on p.116 (PDF pp.130–133)', 'Chương 4 mục 2 — phân tích giá trị biên, trang sách 116–119, Bảng 4.1 (phân vùng và biên) ở trang 116 (PDF 130–133)'],
      ['fst', '§4.3.1 "Equivalence partitioning and boundary value analysis" (incl. the loan-application style condition table) — pp.88–94 (PDF ≈ +3)', '§4.3.1 "Equivalence partitioning and boundary value analysis" (có bảng condition kiểu đơn vay vốn) — trang 88–94 (PDF ≈ +3)'],
      ['sp5', '§5.1.2 "Boundary Value Analysis" — PDF pp.176–183', '§5.1.2 "Boundary Value Analysis" — PDF 176–183'],
      ['sp4', '§5.1.2 "Boundary Value Analysis" — pp.121–127 (PDF pp.136–142)', '§5.1.2 "Boundary Value Analysis" — trang 121–127 (PDF 136–142)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────────── 4.4 Decision table testing ─────────────────────────── */
const L44 = {
  title: '4.4 — Decision table testing: the SWT-course discount, rationalising & extended entries|||4.4 — Kiểm thử bảng quyết định: giảm giá khoá SWT, rút gọn bảng & mục mở rộng',
  slug: 'swt301-blackbox-decision-state',
  type: 'VIDEO',
  description: 'SWT4 slide 43–59: điều kiện T/F, 2^n tổ hợp, ví dụ giảm giá khoá SWT từ 8 cột rút còn 5 rule (don\'t care, tổ hợp bất khả), rút gọn output, rủi ro khi rút gọn, bảng mở rộng, liên hệ EP/BVA — giải 2 câu hỏi (vé thưởng hàng không, phạt tốc độ).',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.4 · SWT4 slides 43–59</span>
<h2>Decision table testing</h2>
<p class="lead">EP and BVA look at one field at a time. Business rules, however, are about <em>combinations</em>: a student who is also a CS major, an account that is valid but has too few points. A <strong>decision table</strong> lists the conditions and the actions, enumerates every combination (a column = a <strong>rule</strong>) and so makes forgotten combinations visible. Then we <strong>rationalise</strong> — remove impossible columns and merge columns whose outcome does not depend on a condition ("don't care", written "–").</p>
<div class="callout"><b>Learning objective.</b> LO-4.2.3 Apply decision table testing to derive test cases from given requirements (K3). Teacher's note on slide 43: EP and BVA mostly target the <em>user interface</em> (fields); decision tables and state transition target the <em>business logic / business rules</em>.</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Conditions &amp; actions</div><div class="lz-t">each condition T/F</div><div class="lz-d">Student? Employed? CS major?</div></div>
  <div class="lz-step"><div class="lz-k">→ 2 · All combinations</div><div class="lz-t">2<sup>n</sup> columns</div><div class="lz-d">3 conditions → 8 rules</div></div>
  <div class="lz-step"><div class="lz-k">→ 3 · Fill actions</div><div class="lz-t">from the business rules</div><div class="lz-d">impossible → error</div></div>
  <div class="lz-step"><div class="lz-k">→ 4 · Rationalise</div><div class="lz-t">impossible, "–" don't care</div><div class="lz-d">8 → 5 rules</div></div>
  <div class="lz-step"><div class="lz-k">→ 5 · One test per rule</div><div class="lz-t">coverage = rules tested / rules</div><div class="lz-d">5 test cases</div></div>
</div>`,
    `<span class="eyebrow">Chương 4 · Bài 4.4 · SWT4 slide 43–59</span>
<h2>Kiểm thử bảng quyết định (decision table)</h2>
<p class="lead">EP và BVA xét từng trường một. Còn quy tắc nghiệp vụ lại nói về <em>tổ hợp</em>: sinh viên đồng thời học ngành CS, tài khoản hợp lệ nhưng không đủ điểm. <strong>Bảng quyết định</strong> liệt kê điều kiện và hành động, liệt kê mọi tổ hợp (mỗi cột = một <strong>rule</strong>) nên các tổ hợp bị quên sẽ lộ ra. Sau đó ta <strong>rút gọn (rationalise)</strong> — bỏ cột bất khả và gộp các cột mà kết quả không phụ thuộc một điều kiện nào đó ("don't care", ký hiệu "–").</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-4.2.3 Áp dụng kiểm thử bảng quyết định để suy ra test case từ yêu cầu cho trước (K3). Ghi chú của thầy/cô ở slide 43: EP và BVA chủ yếu nhắm vào <em>giao diện</em> (các trường nhập); decision table và state transition nhắm vào <em>logic nghiệp vụ / quy tắc nghiệp vụ</em>.</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 · Điều kiện &amp; hành động</div><div class="lz-t">mỗi điều kiện T/F</div><div class="lz-d">Sinh viên? Có việc làm? Ngành CS?</div></div>
  <div class="lz-step"><div class="lz-k">→ 2 · Mọi tổ hợp</div><div class="lz-t">2<sup>n</sup> cột</div><div class="lz-d">3 điều kiện → 8 rule</div></div>
  <div class="lz-step"><div class="lz-k">→ 3 · Điền hành động</div><div class="lz-t">theo quy tắc nghiệp vụ</div><div class="lz-d">bất khả → báo lỗi</div></div>
  <div class="lz-step"><div class="lz-k">→ 4 · Rút gọn</div><div class="lz-t">bất khả, "–" don't care</div><div class="lz-d">8 → 5 rule</div></div>
  <div class="lz-step"><div class="lz-k">→ 5 · Mỗi rule một test</div><div class="lz-t">độ phủ = rule đã test / số rule</div><div class="lz-d">5 test case</div></div>
</div>`),
    walkHead(D, 43, 59),
    walk(D, [
      [43, 'Decision tables — combinations of conditions',
        `<p>Decision tables <strong>explore combinations of inputs, situations or events</strong>, because <strong>it is very easy to overlook specific combinations</strong>. First step: express every input condition of interest so that it is either <strong>TRUE or FALSE</strong> — "record found", "file exists", "code valid", "policy expired", "account in credit", "due date &gt; current date". A condition phrased as a yes/no question is what makes the 2<sup>n</sup> enumeration possible. Teacher's note: EP and BVA focus on the user interface, decision tables and state transition on business logic.</p>`,
        `<p>Bảng quyết định <strong>khám phá tổ hợp của input, tình huống hay sự kiện</strong>, vì <strong>rất dễ bỏ sót một tổ hợp cụ thể</strong>. Bước đầu: diễn đạt mọi điều kiện đầu vào đáng quan tâm sao cho nó chỉ <strong>TRUE hoặc FALSE</strong> — "tìm thấy bản ghi", "file tồn tại", "mã hợp lệ", "hợp đồng bảo hiểm hết hạn", "tài khoản còn dư", "ngày đến hạn &gt; ngày hiện tại". Điều kiện dạng câu hỏi có/không là thứ khiến việc liệt kê 2<sup>n</sup> tổ hợp khả thi. Ghi chú của thầy/cô: EP và BVA tập trung vào giao diện, decision table và state transition vào logic nghiệp vụ.</p>`],
      [44, 'Example: Discount on SWT Course — the rules',
        `<p>The running example. A Software Testing course is created depending on: (1) a <strong>student</strong> gets <strong>20% discount</strong>; (2) an <strong>unemployed</strong> trainee gets <strong>20% discount</strong>; (3) a trainee <u>cannot</u> be both <strong>student and employed</strong>; (4) a student in (or graduate from) the <strong>computer science</strong> department goes to the <strong>advanced</strong> course group. The red box asks: <em>what are the input and output conditions?</em> Try before the next slide: inputs = student, employed, CS major; outputs = group (basic/advanced) and discount (0%/20%).</p>`,
        `<p>Ví dụ xuyên suốt. Một khoá Software Testing được mở theo các tiêu chí: (1) <strong>sinh viên</strong> được <strong>giảm 20%</strong>; (2) người <strong>thất nghiệp</strong> được <strong>giảm 20%</strong>; (3) học viên <u>không thể</u> vừa là <strong>sinh viên vừa đang đi làm</strong>; (4) sinh viên (hoặc người đã tốt nghiệp) khoa <strong>khoa học máy tính</strong> được xếp vào nhóm <strong>nâng cao</strong>. Ô đỏ hỏi: <em>đâu là điều kiện đầu vào và đầu ra?</em> Thử trả lời trước slide sau: input = sinh viên, có việc làm, ngành CS; output = nhóm (cơ bản/nâng cao) và mức giảm (0%/20%).</p>`],
      [45, 'List the Conditions & Actions',
        `<p>List the <strong>conditions</strong> of all inputs in the first column, then the <strong>actions/outcomes</strong> under them. Conditions: Student · Employed · CS major. Actions: Basics 0% dis. · Basics 20% dis. · Adv. 0% dis. · Adv. 20% dis. Note the modelling choice: "unemployed" from the spec is written as the condition <em>Employed</em> = F, so that the table has one condition per fact and no contradictory pair.</p>`,
        `<p>Liệt kê các <strong>điều kiện</strong> của mọi input ở cột đầu, rồi các <strong>hành động/kết quả</strong> bên dưới. Điều kiện: Student · Employed · CS major. Hành động: Basics giảm 0% · Basics giảm 20% · Adv. giảm 0% · Adv. giảm 20%. Để ý cách mô hình hoá: "thất nghiệp" trong đặc tả được viết thành điều kiện <em>Employed</em> = F, để mỗi sự thật chỉ có một điều kiện và không có cặp điều kiện mâu thuẫn.</p>`],
      [46, 'Identify Input Combinations — 8 columns',
        `<p>Add one column per unique combination; each entry T or F. Three conditions → 2<sup>3</sup> = <strong>8 rules</strong>. The fill pattern never misses a combination: first row TTTTFFFF (blocks of 4), second TTFFTTFF (blocks of 2), third TFTFTFTF (alternating). With n conditions the first row has blocks of 2<sup>n−1</sup>. The action rows are still empty.</p>`,
        `<p>Thêm một cột cho mỗi tổ hợp duy nhất; mỗi ô là T hoặc F. Ba điều kiện → 2<sup>3</sup> = <strong>8 rule</strong>. Mẫu điền này không bao giờ sót tổ hợp: hàng đầu TTTTFFFF (khối 4), hàng hai TTFFTTFF (khối 2), hàng ba TFTFTFTF (xen kẽ). Với n điều kiện, hàng đầu có khối dài 2<sup>n−1</sup>. Các hàng hành động vẫn còn trống.</p>`],
      [47, 'Rationalise Input Combinations — the three ideas',
        `<p>Three ideas: some combinations may be <strong>impossible or not of interest</strong>; some combinations may be <strong>"equivalent"</strong> (same outcome whatever one condition is); use a <strong>hyphen "–" to denote "don't care"</strong>. Rationalising reduces the number of test cases — at a price discussed on slide 55.</p>`,
        `<p>Ba ý: một số tổ hợp có thể <strong>bất khả hoặc không đáng quan tâm</strong>; một số tổ hợp có thể <strong>"tương đương"</strong> (cùng kết quả bất kể một điều kiện nào đó); dùng <strong>dấu gạch "–" để chỉ "don't care"</strong>. Rút gọn giúp giảm số test case — với cái giá được bàn ở slide 55.</p>`],
      [48, 'Rationalise Input Combinations — the actions filled in',
        `<p>The actions (green cells): rule 3 (student, not employed, CS) → Adv. 20% · rule 4 (student, not employed, not CS) → Basics 20% · rule 5 (not student, employed, CS graduate) → Adv. 0% · rule 6 (not student, employed, not CS) → Basics 0% · rule 7 (not student, unemployed, CS graduate) → Adv. 20% · rule 8 (not student, unemployed, not CS) → Basics 20%. Rules 1 and 2 are red: they break the business rule "cannot be both student and employed" → an <strong>error message</strong> should be shown. Teacher's notes: usually one test case per rule, but we can reduce: when two rules have the same outcome and differ in only one condition, test one of them — rules 3 and 7 merge (unemployed + CS → the Student value does not matter) and so do rules 4 and 8.</p>`,
        `<p>Hành động (ô xanh): rule 3 (sinh viên, không đi làm, CS) → Adv. 20% · rule 4 (sinh viên, không đi làm, không CS) → Basics 20% · rule 5 (không sinh viên, đi làm, tốt nghiệp CS) → Adv. 0% · rule 6 (không sinh viên, đi làm, không CS) → Basics 0% · rule 7 (không sinh viên, thất nghiệp, tốt nghiệp CS) → Adv. 20% · rule 8 (không sinh viên, thất nghiệp, không CS) → Basics 20%. Rule 1 và 2 tô đỏ: vi phạm quy tắc "không thể vừa là sinh viên vừa đi làm" → phải hiện <strong>thông báo lỗi</strong>. Ghi chú của thầy/cô: thường mỗi rule một test case, nhưng có thể giảm: khi hai rule cùng kết quả và chỉ khác nhau đúng một điều kiện thì test một trong hai — rule 3 và 7 gộp được (thất nghiệp + CS → giá trị Student không quan trọng), rule 4 và 8 cũng vậy.</p>`],
      [49, 'Reduce # of Test Cases — merging the impossible rules',
        `<p>Star on rule 1: Student = T and Employed = T are highlighted yellow and CS major becomes "–". Whatever the CS value, a student who is employed is an error, so rules 1 and 2 collapse into one; column 2 is greyed out (arrows under 1 and 2).</p>`,
        `<p>Ngôi sao ở rule 1: Student = T và Employed = T tô vàng, CS major thành "–". Dù CS là gì, sinh viên mà đi làm đều là lỗi, nên rule 1 và 2 gộp làm một; cột 2 bị tô xám (mũi tên dưới cột 1 và 2).</p>`],
      [50, 'Reduce # of Test Cases — rules 3 and 7',
        `<p>Stars on rules 1 and 3: in rule 3, Employed = F and CS major = T are highlighted and Student becomes "–" — "not employed + CS → Advanced, 20%" holds for students and for unemployed graduates alike. Column 7 is greyed out. (The small pasted table in rule 1's CS cell is an animation leftover.)</p>`,
        `<p>Sao ở rule 1 và 3: trong rule 3, Employed = F và CS major = T được tô, Student thành "–" — "không đi làm + CS → Nâng cao, giảm 20%" đúng cho cả sinh viên lẫn người tốt nghiệp đang thất nghiệp. Cột 7 bị tô xám. (Bảng nhỏ dán ở ô CS của rule 1 là phần sót của hiệu ứng.)</p>`],
      [51, 'Reduce # of Test Cases — rules 4 and 8',
        `<p>Same step for rule 4: Employed = F and CS major = F highlighted, Student "–" → Basics 20%; column 8 greyed. Stars now sit on rules 1, 3, 4, 5, 6 — the five surviving rules; arrows point at the columns just decided.</p>`,
        `<p>Làm tương tự cho rule 4: Employed = F và CS major = F được tô, Student "–" → Basics 20%; cột 8 tô xám. Sao giờ nằm ở rule 1, 3, 4, 5, 6 — năm rule còn lại; mũi tên chỉ vào các cột vừa quyết định.</p>`],
      [52, 'Reduce # of Test Cases — the final five rules',
        `<p>The columns are re-ordered: 1, 3, 4, 5, 6 stay; 2, 7, 8 are greyed at the right. <strong>5 test cases instead of 8.</strong> Read it together with slides 49–51: the final table has "–" in rule 1 (CS), rule 3 (Student) and rule 4 (Student) — this slide shows the original T values in those cells, which only means "pick one value when you write the test". Rule 1 stays as a negative test (the error message), even though the combination is "impossible" in reality — the UI may still allow a user to tick both boxes.</p>`,
        `<p>Các cột được sắp lại: giữ 1, 3, 4, 5, 6; 2, 7, 8 bị tô xám ở bên phải. <strong>5 test case thay vì 8.</strong> Đọc cùng slide 49–51: bảng cuối có "–" ở rule 1 (CS), rule 3 (Student), rule 4 (Student) — slide này hiện giá trị T gốc ở các ô đó, nghĩa chỉ là "chọn một giá trị khi viết test". Rule 1 vẫn giữ làm test âm (thông báo lỗi), dù tổ hợp này "bất khả" ngoài đời — giao diện vẫn có thể cho người dùng tích cả hai ô.</p>`],
      [53, 'Rationalising Outputs',
        `<p>If outputs are <strong>mutually exclusive</strong> — T appears in only one place in each column — the action rows can be combined into one: three rows X/Y/Z with the diagonal pattern T F F · F T F · F F T are equivalent to a single row "Output: X | Y | Z". In our example the four action rows are mutually exclusive (a trainee gets exactly one of the four packages), so they become one row "Package = Basics 0% / Basics 20% / Adv. 0% / Adv. 20% / Error". Alternatively split them into two independent actions: Group (Basics/Advanced) and Discount (0/20%).</p>`,
        `<p>Nếu các output <strong>loại trừ nhau</strong> — mỗi cột chỉ có đúng một chữ T — thì gộp các hàng hành động thành một: ba hàng X/Y/Z theo mẫu đường chéo T F F · F T F · F F T tương đương một hàng duy nhất "Output: X | Y | Z". Trong ví dụ, bốn hàng hành động loại trừ nhau (mỗi học viên nhận đúng một gói), nên gộp thành một hàng "Gói = Basics 0% / Basics 20% / Adv. 0% / Adv. 20% / Lỗi". Hoặc tách thành hai hành động độc lập: Nhóm (Cơ bản/Nâng cao) và Giảm giá (0/20%).</p>`],
      [54, 'Humour break — "Why am I so incredibly miserable???"',
        `<p>A joke slide in the middle of the hardest topic: "WHY AM I SO INCREDIBLY MISERABLE??? — I'M HERE… FOR COUGH!". The speaker notes give the Vietnamese: "TẠI SAO TÔI LẠI CỰC KỲ KHỔ??? — TÔI Ở ĐÂY… VÌ KHÓ!" — a bilingual pun: "cough" sounds like <em>khó</em> ("hard"), and <em>khổ</em> (miserable) is one tone away from <em>khó</em>. Take the hint: decision tables feel hard until you have filled two or three of them by hand. Nothing here is examined.</p>`,
        `<p>Slide đùa giữa phần khó nhất: "WHY AM I SO INCREDIBLY MISERABLE??? — I'M HERE… FOR COUGH!". Ghi chú dịch sang tiếng Việt: "TẠI SAO TÔI LẠI CỰC KỲ KHỔ??? — TÔI Ở ĐÂY… VÌ KHÓ!" — chơi chữ song ngữ: "cough" đọc gần giống "khó", còn "khổ" chỉ cách "khó" một dấu. Hiểu ý thầy/cô: decision table thấy khó cho tới khi bạn tự tay điền hai, ba bảng. Slide này không có trong đề.</p>`],
      [55, 'Rationalising Dangers',
        `<p>Rationalising rests on <strong>assumptions</strong>; assumptions may be <strong>wrong</strong>, should be <strong>stated</strong>, and may <strong>change over time</strong>. Be aware of the dangers: <strong>filling in the full table may find errors that are missed if you rationalise</strong>, and <strong>it is possible to rationalise too far</strong>. Example: we merged rules 3 and 7 assuming "Student does not matter when unemployed". If the programmer wrote <code>if (student) discount = 20</code> and forgot the unemployed case, a test that picked Student = T for the merged rule passes and the defect for unemployed graduates escapes. Mitigation: vary the "don't care" values across tests.</p>`,
        `<p>Rút gọn dựa trên <strong>giả định</strong>; giả định có thể <strong>sai</strong>, cần được <strong>ghi rõ</strong>, và có thể <strong>thay đổi theo thời gian</strong>. Cảnh giác: <strong>điền đủ cả bảng có thể tìm ra lỗi mà bảng đã rút gọn bỏ lọt</strong>, và <strong>có thể rút gọn quá tay</strong>. Ví dụ: ta gộp rule 3 và 7 với giả định "khi thất nghiệp thì Student không quan trọng". Nếu lập trình viên viết <code>if (student) discount = 20</code> và quên trường hợp thất nghiệp, một test chọn Student = T cho rule gộp sẽ pass và lỗi của người tốt nghiệp thất nghiệp lọt lưới. Cách giảm rủi ro: đổi luân phiên giá trị "don't care" giữa các test.</p>`],
      [56, 'Extending decision tables — more than T/F',
        `<p>Entries can be more than true/false (<strong>extended-entry</strong> tables) — completing the table must then be done carefully and rationalising becomes more important. Example: <em>Code = 1, 2 or 3</em> × <em>Exp. date &lt; now</em> (T/F) × <em>Class A product</em> (T/F) → 3 × 2 × 2 = <strong>12 columns</strong>. The number of rules is the <em>product</em> of the number of values of each condition, not 2<sup>n</sup>. Typical source: a condition that is itself an EP with several partitions (age band, membership level, code).</p>`,
        `<p>Mỗi ô có thể nhận nhiều hơn đúng/sai (bảng <strong>extended-entry</strong>) — khi đó điền bảng phải cẩn thận và việc rút gọn càng quan trọng. Ví dụ: <em>Code = 1, 2 hoặc 3</em> × <em>Ngày hết hạn &lt; hiện tại</em> (T/F) × <em>Sản phẩm loại A</em> (T/F) → 3 × 2 × 2 = <strong>12 cột</strong>. Số rule là <em>tích</em> số giá trị của từng điều kiện, không phải 2<sup>n</sup>. Nguồn điển hình: một điều kiện bản thân nó là một EP có nhiều vùng (nhóm tuổi, hạng thành viên, mã).</p>`],
      [57, 'Decision Tables in relation to EP and BVA',
        `<p>The picture links the techniques. On the left, input values of two conditions (two ellipses split by a boundary line — green dots and green squares on one side, a red dot and a red square just across the line); on the right, the output ellipse with red and green triangles; a red arrow labelled FALSE and a green arrow labelled TRUE. Meaning: <strong>each condition's T and F are themselves equivalence partitions</strong> of the input domain, and when a condition is a comparison ("due date &gt; current date", "speed &gt; 50") the values right next to the line are <strong>boundary values</strong>. So when you write the test for a rule, choose EP representatives for its T/F entries — and add boundary values where the condition compares numbers or dates.</p>`,
        `<p>Hình vẽ nối các kỹ thuật lại. Bên trái là giá trị input của hai điều kiện (hai elip bị một đường biên chia — chấm xanh và vuông xanh một phía, một chấm đỏ và một vuông đỏ ngay bên kia đường); bên phải là elip output với tam giác đỏ và xanh; mũi tên đỏ ghi FALSE, mũi tên xanh ghi TRUE. Ý nghĩa: <strong>giá trị T và F của mỗi điều kiện chính là các phân vùng tương đương</strong> của miền input, và khi điều kiện là một phép so sánh ("ngày đến hạn &gt; ngày hiện tại", "tốc độ &gt; 50") thì các giá trị sát đường chính là <strong>giá trị biên</strong>. Vậy khi viết test cho một rule, hãy chọn giá trị đại diện EP cho các ô T/F của nó — và thêm giá trị biên ở những điều kiện so sánh số hay ngày.</p>`],
      [58, 'Question — airline reward travel, minimum tests',
        AE(`4 (the slide shows the answer in yellow)`, `The table has 3 rules: R1 Account/password OK = F (sufficient points "–") → no flight history, no reward; R2 OK = T, points = F → show history, no reward; R3 OK = T, points = T → history + reward. The condition "Account/password OK = F" has <strong>two</strong> equivalence partitions (invalid account; valid account but invalid password), and each must be tested — so R1 needs 2 tests. R2 and R3 need one each (the single "OK" partition is covered by both). 2 + 1 + 1 = <strong>4</strong>. Answering 3 (one per rule) ignores the EP requirement in the question.`),
        AV(`4 (slide ghi đáp án màu vàng)`, `Bảng có 3 rule: R1 Account/password OK = F (điểm "–") → không hiện lịch sử, không cho đổi thưởng; R2 OK = T, đủ điểm = F → hiện lịch sử, không cho đổi; R3 OK = T, đủ điểm = T → lịch sử + đổi thưởng. Điều kiện "Account/password OK = F" có <strong>hai</strong> phân vùng tương đương (tài khoản sai; tài khoản đúng nhưng mật khẩu sai), và phải test cả hai — nên R1 cần 2 test. R2 và R3 mỗi rule một test (vùng "OK" duy nhất được cả hai phủ). 2 + 1 + 1 = <strong>4</strong>. Trả lời 3 (mỗi rule một test) là bỏ qua yêu cầu EP trong câu hỏi.`)],
      [59, 'Question — speeding fine, which two tests complete the table?',
        AE(`C — DT2, DT4`, `The complete table for two conditions has 4 rules: R1 (speed &gt; 50 T, hospital zone T), R2 (T, F), R3 (F, T), R4 (F, F). R1 and R4 are already tested, so we need R2 and R3. Map each test by its <em>conditions</em>: DT1 = 55 &gt; 50, zone T → R1 · DT2 = 44, zone T → R3 · DT3 = 66, zone T → R1 · DT4 = 77, zone F → R2. So <strong>DT2 + DT4</strong>. The slide labels the last two options "C" twice — the second one ("DT3, DT4") is really D. The outcome rows of DT1–DT4 do not decide which rule a test covers; only the conditions do.`),
        AV(`C — DT2, DT4`, `Bảng đầy đủ cho hai điều kiện có 4 rule: R1 (tốc độ &gt; 50 T, khu bệnh viện T), R2 (T, F), R3 (F, T), R4 (F, F). R1 và R4 đã có test, nên cần R2 và R3. Xếp mỗi test theo <em>điều kiện</em>: DT1 = 55 &gt; 50, khu T → R1 · DT2 = 44, khu T → R3 · DT3 = 66, khu T → R1 · DT4 = 77, khu F → R2. Vậy <strong>DT2 + DT4</strong>. Slide đánh nhãn hai phương án cuối đều là "C" — phương án thứ hai ("DT3, DT4") thực ra là D. Hàng outcome của DT1–DT4 không quyết định test phủ rule nào; chỉ các điều kiện mới quyết định.`)],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — the SWT-course table, complete and rationalised</h3>
<p><strong>Step 1 — full table</strong> (script output, the action computed from the four business rules):</p>
<pre><code>1 S=T E=T CS=T -&gt; ERROR (impossible: student &amp; employed)
2 S=T E=T CS=F -&gt; ERROR (impossible: student &amp; employed)
3 S=T E=F CS=T -&gt; Adv 20%
4 S=T E=F CS=F -&gt; Basics 20%
5 S=F E=T CS=T -&gt; Adv 0%
6 S=F E=T CS=F -&gt; Basics 0%
7 S=F E=F CS=T -&gt; Adv 20%
8 S=F E=F CS=F -&gt; Basics 20%</code></pre>
<p><strong>Step 2 — rationalised table</strong> (outputs also rationalised into one row):</p>
<table>
<thead><tr><th>Conditions</th><th>R1 (1+2)</th><th>R2 (3+7)</th><th>R3 (4+8)</th><th>R4 (5)</th><th>R5 (6)</th></tr></thead>
<tbody>
<tr><td>Student</td><td>T</td><td>–</td><td>–</td><td>F</td><td>F</td></tr>
<tr><td>Employed</td><td>T</td><td>F</td><td>F</td><td>T</td><td>T</td></tr>
<tr><td>CS major</td><td>–</td><td>T</td><td>F</td><td>T</td><td>F</td></tr>
<tr><td><b>Output</b></td><td>Error</td><td>Adv. 20%</td><td>Basics 20%</td><td>Adv. 0%</td><td>Basics 0%</td></tr>
</tbody>
</table>
<p>Script check that the five rules are sound — each "–" column contains only combinations with the same action, and together they cover the 8 combinations exactly once:</p>
<pre><code>('T', 'T', '-') covers 2 combos -&gt; {'ERROR (impossible: student &amp; employed)'}
('-', 'F', 'T') covers 2 combos -&gt; {'Adv 20%'}
('-', 'F', 'F') covers 2 combos -&gt; {'Basics 20%'}
('F', 'T', 'T') covers 1 combos -&gt; {'Adv 0%'}
('F', 'T', 'F') covers 1 combos -&gt; {'Basics 0%'}
5 rationalised rules cover all 8 combinations exactly once</code></pre>
<p>Why can't R4/R5 get a "–" for Student? Because Student = T with Employed = T is R1's territory; writing "–" would make R4 overlap R1 — each combination must belong to exactly one rule.</p>
<p><strong>Step 3 — test cases</strong> (one per rule; the "don't care" values are deliberately varied, slide 55):</p>
<table>
<thead><tr><th>TC</th><th>Rule</th><th>Input</th><th>Expected</th></tr></thead>
<tbody>
<tr><td>1</td><td>R1</td><td>Student = yes, Employed = yes, CS = yes</td><td>Error "A trainee cannot be both a student and employed"; no registration</td></tr>
<tr><td>2</td><td>R2</td><td>Student = yes, Employed = no, CS = yes</td><td>Advanced group, 20% discount</td></tr>
<tr><td>3</td><td>R3</td><td>Student = no, Employed = no, CS = no</td><td>Basics group, 20% discount</td></tr>
<tr><td>4</td><td>R4</td><td>Student = no, Employed = yes, CS graduate = yes</td><td>Advanced group, no discount</td></tr>
<tr><td>5</td><td>R5</td><td>Student = no, Employed = yes, CS = no</td><td>Basics group, no discount</td></tr>
</tbody>
</table>
<p>Decision table coverage = 5/5 rules = 100%. (Full-table coverage would need the three merged columns too: 8 tests.)</p>
<div class="pitfall"><b>Traps:</b> (1) n Boolean conditions → 2<sup>n</sup> rules, but extended entries multiply the numbers of values (slide 56: 12, not 8); (2) "full coverage of the <em>complete</em> decision table" (slide 59) means every column of the un-rationalised table; (3) map a given test to a rule by its <em>conditions</em>, never by its outcomes; (4) an "impossible" rule still deserves a negative test if the user interface lets someone enter it; (5) if a question adds EP inside a condition (slide 58), a single rule may need more than one test.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Cause–effect graphs and BDD example tables.</b> The hidden slide in lesson 4.1 lists <em>cause-effect graphing</em>: causes (conditions) and effects (actions) are drawn as nodes joined by AND/OR/NOT and constraints (E = exclusive, like "student XOR employed"), and the graph is then converted into a decision table — Spillner 4th ed. §5.1.4 shows the method. In today's Agile teams the same table appears as a Gherkin <em>Scenario Outline</em>, which tools like Cucumber run directly:</p>
<pre><code>Scenario Outline: group and discount for a trainee
  Given a trainee with student "&lt;student&gt;", employed "&lt;employed&gt;", CS "&lt;cs&gt;"
  When the trainee registers for the SWT course
  Then the result is "&lt;result&gt;"
  Examples:
    | student | employed | cs  | result          |
    | yes     | yes      | yes | error           |
    | yes     | no       | yes | advanced 20%    |
    | no      | no       | no  | basics 20%      |
    | no      | yes      | yes | advanced 0%     |
    | no      | yes      | no  | basics 0%       |</code></pre>
<p><em>Outside the syllabus because CTFL only asks you to build, rationalise and cover a decision table, not to draw cause-effect graphs or automate it.</em></p></div>`,
    `<h3>Ví dụ có lời giải · Bảng khoá SWT, đầy đủ và đã rút gọn</h3>
<p><strong>Bước 1 — bảng đầy đủ</strong> (output script, hành động tính từ bốn quy tắc nghiệp vụ):</p>
<pre><code>1 S=T E=T CS=T -&gt; ERROR (impossible: student &amp; employed)
2 S=T E=T CS=F -&gt; ERROR (impossible: student &amp; employed)
3 S=T E=F CS=T -&gt; Adv 20%
4 S=T E=F CS=F -&gt; Basics 20%
5 S=F E=T CS=T -&gt; Adv 0%
6 S=F E=T CS=F -&gt; Basics 0%
7 S=F E=F CS=T -&gt; Adv 20%
8 S=F E=F CS=F -&gt; Basics 20%</code></pre>
<p><strong>Bước 2 — bảng đã rút gọn</strong> (output cũng gộp thành một hàng):</p>
<table>
<thead><tr><th>Điều kiện</th><th>R1 (1+2)</th><th>R2 (3+7)</th><th>R3 (4+8)</th><th>R4 (5)</th><th>R5 (6)</th></tr></thead>
<tbody>
<tr><td>Sinh viên</td><td>T</td><td>–</td><td>–</td><td>F</td><td>F</td></tr>
<tr><td>Có việc làm</td><td>T</td><td>F</td><td>F</td><td>T</td><td>T</td></tr>
<tr><td>Ngành CS</td><td>–</td><td>T</td><td>F</td><td>T</td><td>F</td></tr>
<tr><td><b>Output</b></td><td>Lỗi</td><td>Adv. 20%</td><td>Basics 20%</td><td>Adv. 0%</td><td>Basics 0%</td></tr>
</tbody>
</table>
<p>Script kiểm năm rule là đúng — mỗi cột có "–" chỉ gồm các tổ hợp cùng hành động, và gộp lại phủ đúng 8 tổ hợp, mỗi tổ hợp một lần:</p>
<pre><code>('T', 'T', '-') covers 2 combos -&gt; {'ERROR (impossible: student &amp; employed)'}
('-', 'F', 'T') covers 2 combos -&gt; {'Adv 20%'}
('-', 'F', 'F') covers 2 combos -&gt; {'Basics 20%'}
('F', 'T', 'T') covers 1 combos -&gt; {'Adv 0%'}
('F', 'T', 'F') covers 1 combos -&gt; {'Basics 0%'}
5 rationalised rules cover all 8 combinations exactly once</code></pre>
<p>Vì sao R4/R5 không được ghi "–" cho Sinh viên? Vì Sinh viên = T cùng Có việc làm = T là "lãnh thổ" của R1; ghi "–" sẽ khiến R4 chồng lên R1 — mỗi tổ hợp phải thuộc đúng một rule.</p>
<p><strong>Bước 3 — test case</strong> (mỗi rule một test; giá trị "don't care" được cố ý đổi luân phiên, slide 55):</p>
<table>
<thead><tr><th>TC</th><th>Rule</th><th>Input</th><th>Mong đợi</th></tr></thead>
<tbody>
<tr><td>1</td><td>R1</td><td>Sinh viên = có, Đi làm = có, CS = có</td><td>Lỗi "Học viên không thể vừa là sinh viên vừa đi làm"; không đăng ký</td></tr>
<tr><td>2</td><td>R2</td><td>Sinh viên = có, Đi làm = không, CS = có</td><td>Nhóm nâng cao, giảm 20%</td></tr>
<tr><td>3</td><td>R3</td><td>Sinh viên = không, Đi làm = không, CS = không</td><td>Nhóm cơ bản, giảm 20%</td></tr>
<tr><td>4</td><td>R4</td><td>Sinh viên = không, Đi làm = có, tốt nghiệp CS = có</td><td>Nhóm nâng cao, không giảm</td></tr>
<tr><td>5</td><td>R5</td><td>Sinh viên = không, Đi làm = có, CS = không</td><td>Nhóm cơ bản, không giảm</td></tr>
</tbody>
</table>
<p>Độ phủ decision table = 5/5 rule = 100%. (Phủ bảng đầy đủ thì cần thêm ba cột đã gộp: 8 test.)</p>
<div class="pitfall"><b>Bẫy:</b> (1) n điều kiện Boolean → 2<sup>n</sup> rule, nhưng bảng extended-entry thì nhân số giá trị (slide 56: 12, không phải 8); (2) "phủ đầy đủ bảng quyết định <em>hoàn chỉnh</em>" (slide 59) nghĩa là mọi cột của bảng chưa rút gọn; (3) xếp một test vào rule theo <em>điều kiện</em>, không bao giờ theo outcome; (4) rule "bất khả" vẫn cần một test âm nếu giao diện cho phép nhập tổ hợp đó; (5) nếu câu hỏi thêm EP bên trong một điều kiện (slide 58), một rule có thể cần hơn một test.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đồ thị nhân–quả và bảng ví dụ trong BDD.</b> Slide ẩn ở bài 4.1 có nhắc <em>cause-effect graphing</em>: nguyên nhân (điều kiện) và hệ quả (hành động) vẽ thành nút nối bằng AND/OR/NOT cùng các ràng buộc (E = loại trừ, như "sinh viên XOR đi làm"), rồi đồ thị được chuyển thành decision table — Spillner bản 4 §5.1.4 trình bày cách làm. Trong đội Agile ngày nay, cùng cái bảng đó xuất hiện dưới dạng <em>Scenario Outline</em> của Gherkin, được công cụ như Cucumber chạy trực tiếp:</p>
<pre><code>Scenario Outline: group and discount for a trainee
  Given a trainee with student "&lt;student&gt;", employed "&lt;employed&gt;", CS "&lt;cs&gt;"
  When the trainee registers for the SWT course
  Then the result is "&lt;result&gt;"
  Examples:
    | student | employed | cs  | result          |
    | yes     | yes      | yes | error           |
    | yes     | no       | yes | advanced 20%    |
    | no      | no       | no  | basics 20%      |
    | no      | yes      | yes | advanced 0%     |
    | no      | yes      | no  | basics 0%       |</code></pre>
<p><em>Ngoài giáo trình vì CTFL chỉ yêu cầu dựng, rút gọn và phủ decision table, không yêu cầu vẽ đồ thị nhân–quả hay tự động hoá nó.</em></p></div>`),
    books([
      ['fst4', 'Ch.4 Section 2 — decision table testing, book pp.120–126, Tables 4.2–4.9 on pp.122–126 (PDF pp.134–140)', 'Chương 4 mục 2 — decision table testing, trang sách 120–126, Bảng 4.2–4.9 ở trang 122–126 (PDF 134–140)'],
      ['fst', '§4.3.2 "Decision table testing" — pp.95–100 (PDF ≈ +3)', '§4.3.2 "Decision table testing" — trang 95–100 (PDF ≈ +3)'],
      ['sp5', '§5.1.4 "Decision Table Testing" — PDF pp.192–198 (and §5.1.5 pair-wise testing, PDF pp.199–207)', '§5.1.4 "Decision Table Testing" — PDF 192–198 (và §5.1.5 pair-wise testing, PDF 199–207)'],
      ['sp4', '§5.1.4 "Logic-Based Techniques (Cause-Effect Graphing and Decision Table Technique)" — pp.136–140 (PDF pp.151–155)', '§5.1.4 "Logic-Based Techniques (Cause-Effect Graphing and Decision Table Technique)" — trang 136–140 (PDF 151–155)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────────── 4.5 State transition testing ─────────────────────────── */
const L45 = {
  title: '4.5 — State transition testing: the ATM PIN model, state table, invalid transitions & coverage|||4.5 — Kiểm thử chuyển trạng thái: mô hình PIN ATM, bảng trạng thái, chuyển đổi không hợp lệ & độ phủ',
  slug: 'swt301-blackbox-state-transition',
  type: 'VIDEO',
  description: 'SWT4 slide 60–72: trạng thái, sự kiện, chuyển đổi, hành động; sơ đồ PIN ATM (2 test phủ mọi trạng thái, 4 test phủ mọi chuyển đổi), bảng trạng thái 7×3 với chuyển đổi không hợp lệ, độ phủ — giải 4 câu hỏi (sạc pin, chuỗi trạng thái, đăng nhập 3 lần).',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.5 · SWT4 slides 60–72</span>
<h2>State transition testing</h2>
<p class="lead">Some systems answer the same input differently depending on <em>what happened before</em>: the third wrong PIN eats your card, the first one does not. Such behaviour is modelled as a <strong>state machine</strong> and tested with <strong>state transition testing</strong>: the <em>diagram</em> shows the valid transitions, the <em>state table</em> shows every state × event pair — including the <strong>invalid</strong> ones that make the best negative tests.</p>
<div class="callout"><b>Learning objective.</b> LO-4.2.4 Apply state transition testing to derive test cases from given requirements (K3).</div>
<table>
<thead><tr><th>Element</th><th>Meaning</th><th>In the ATM example</th></tr></thead>
<tbody>
<tr><td>State (circle)</td><td>a condition the system is in, waiting for something</td><td>Wait for PIN, 2nd try, Eat card</td></tr>
<tr><td>Event (label on an arrow)</td><td>what happens — usually an input</td><td>insert card, enter invalid PIN</td></tr>
<tr><td>Transition (arrow)</td><td>the change from one state to another caused by an event</td><td>2nd try —invalid PIN→ 3rd try</td></tr>
<tr><td>Action</td><td>what the system does during the transition</td><td>"Wrong PIN, try again", retain card</td></tr>
</tbody>
</table>
<p><strong>Coverage options</strong> (slide 61): a typical sequence · all states · every (valid) transition = <em>0-switch</em> coverage · specific sequences of transitions (pairs = 1-switch) · invalid transitions. Coverage = tested ÷ identified states or transitions.</p>`,
    `<span class="eyebrow">Chương 4 · Bài 4.5 · SWT4 slide 60–72</span>
<h2>Kiểm thử chuyển trạng thái (state transition)</h2>
<p class="lead">Có những hệ thống trả lời cùng một input theo cách khác nhau tuỳ vào <em>chuyện gì đã xảy ra trước đó</em>: nhập sai PIN lần thứ ba thì máy nuốt thẻ, lần đầu thì không. Hành vi như vậy được mô hình hoá thành <strong>máy trạng thái</strong> và kiểm thử bằng <strong>state transition testing</strong>: <em>sơ đồ</em> cho thấy các chuyển đổi hợp lệ, <em>bảng trạng thái</em> cho thấy mọi cặp trạng thái × sự kiện — kể cả các cặp <strong>không hợp lệ</strong>, nguồn test âm tốt nhất.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-4.2.4 Áp dụng kiểm thử chuyển trạng thái để suy ra test case từ yêu cầu cho trước (K3).</div>
<table>
<thead><tr><th>Thành phần</th><th>Ý nghĩa</th><th>Trong ví dụ ATM</th></tr></thead>
<tbody>
<tr><td>Trạng thái (hình tròn)</td><td>tình trạng hệ thống đang ở, chờ một điều gì đó</td><td>Chờ nhập PIN, lần thử 2, Nuốt thẻ</td></tr>
<tr><td>Sự kiện (chữ trên mũi tên)</td><td>điều xảy ra — thường là một input</td><td>đưa thẻ vào, nhập PIN sai</td></tr>
<tr><td>Chuyển đổi (mũi tên)</td><td>việc đổi từ trạng thái này sang trạng thái khác do sự kiện gây ra</td><td>Lần thử 2 —PIN sai→ Lần thử 3</td></tr>
<tr><td>Hành động</td><td>việc hệ thống làm khi chuyển đổi</td><td>"Sai PIN, nhập lại", giữ thẻ</td></tr>
</tbody>
</table>
<p><strong>Các mức độ phủ</strong> (slide 61): một chuỗi điển hình · mọi trạng thái · mọi chuyển đổi (hợp lệ) = độ phủ <em>0-switch</em> · các chuỗi chuyển đổi cụ thể (cặp = 1-switch) · các chuyển đổi không hợp lệ. Độ phủ = số trạng thái/chuyển đổi đã test ÷ số đã xác định.</p>`),
    walkHead(D, 60, 72),
    walk(D, [
      [60, 'State Transition Testing — the model',
        `<p>Five statements (the notes repeat them in Vietnamese). A <strong>state transition diagram</strong> shows a <strong>finite</strong> number of states; the transitions between them are determined by the rules of the "machine". A transition is <strong>initiated by an event</strong> (e.g. the user enters a value in a field). The state change may cause the software to take an <strong>action</strong> (output a calculation or an error message). A <strong>state transition table</strong> shows all valid transitions <em>and potentially invalid ones</em>. <strong>Diagrams normally show only the valid transitions</strong> — that is why we also need the table.</p>`,
        `<p>Năm phát biểu (ghi chú nhắc lại bằng tiếng Việt). <strong>Sơ đồ chuyển trạng thái</strong> có một số <strong>hữu hạn</strong> trạng thái; việc chuyển giữa chúng do các quy tắc của "máy" quyết định. Một chuyển đổi được <strong>khởi phát bởi một sự kiện</strong> (vd người dùng nhập giá trị vào một trường). Việc đổi trạng thái có thể khiến phần mềm thực hiện một <strong>hành động</strong> (xuất kết quả tính, thông báo lỗi). <strong>Bảng chuyển trạng thái</strong> cho thấy mọi chuyển đổi hợp lệ <em>và cả những chuyển đổi có thể không hợp lệ</em>. <strong>Sơ đồ thường chỉ vẽ chuyển đổi hợp lệ</strong> — vì thế ta cần thêm bảng.</p>`],
      [61, 'State Transition Testing — what tests can cover',
        `<p>Definition: state transition testing is a <strong>black-box technique</strong> in which test cases are designed to <strong>exercise elements of a state transition model</strong>. Tests can cover (red words): a typical sequence of states, <strong>all states</strong>, <strong>every transition</strong>, <strong>specific sequences of transitions</strong>, or <strong>invalid transitions</strong>. <strong>Coverage (STT) = #tested states/transitions ÷ #identified states/transitions</strong>, as a percentage. Exam wording: "0-switch coverage" = every single valid transition; "1-switch" = every pair of consecutive transitions.</p>`,
        `<p>Định nghĩa: state transition testing là <strong>kỹ thuật black-box</strong> trong đó test case được thiết kế để <strong>chạy qua các phần tử của mô hình chuyển trạng thái</strong>. Test có thể phủ (chữ đỏ): một chuỗi trạng thái điển hình, <strong>mọi trạng thái</strong>, <strong>mọi chuyển đổi</strong>, <strong>các chuỗi chuyển đổi cụ thể</strong>, hoặc <strong>các chuyển đổi không hợp lệ</strong>. <strong>Độ phủ (STT) = số trạng thái/chuyển đổi đã test ÷ số trạng thái/chuyển đổi đã xác định</strong>, tính phần trăm. Cách đề ra: "0-switch coverage" = mọi chuyển đổi hợp lệ đơn lẻ; "1-switch" = mọi cặp chuyển đổi liên tiếp.</p>`],
      [62, 'ATM PIN diagram — how many tests to cover all states?',
        `<p>The classic model (book Fig. 4.2). States (blue circles): Start, Wait for PIN, 1st try, 2nd try, 3rd try, Eat card, Account access — 7. Transitions: Start —insert card→ Wait for PIN —enter PIN→ 1st try; 1st try —enter invalid PIN→ 2nd try —enter invalid…→ 3rd try —enter invalid…→ Eat card; and 1st try / 2nd try / 3rd try —enter valid…→ Account access — 8 arrows. Teacher's notes: circle = state, line = transition, text near a line = event. The model is deliberately incomplete: no time-out from "Wait for PIN" and the tries back to Start, and no "cancel" event (which would also return to Start and eject the card). Question: how many tests cover all states?</p>`,
        `<p>Mô hình kinh điển (Hình 4.2 trong sách). Trạng thái (hình tròn xanh): Start, Chờ PIN, Lần thử 1, Lần thử 2, Lần thử 3, Nuốt thẻ, Truy cập tài khoản — 7. Chuyển đổi: Start —đưa thẻ→ Chờ PIN —nhập PIN→ Lần 1; Lần 1 —PIN sai→ Lần 2 —sai…→ Lần 3 —sai…→ Nuốt thẻ; và Lần 1 / Lần 2 / Lần 3 —PIN đúng…→ Truy cập tài khoản — 8 mũi tên. Ghi chú của thầy/cô: hình tròn = trạng thái, đường = chuyển đổi, chữ cạnh đường = sự kiện. Mô hình cố ý chưa đầy đủ: không có time-out từ "Chờ PIN" và các lần thử quay về Start, không có sự kiện "huỷ" (cũng quay về Start và trả thẻ). Câu hỏi: cần bao nhiêu test để phủ mọi trạng thái?</p>`],
      [63, 'All states → 2 tests',
        `<p>Answer in red: <strong>2</strong>. Test 1: insert card, enter PIN, valid at the first try → Start, Wait for PIN, 1st try, Account access. Test 2: insert card, enter PIN, invalid three times → adds 2nd try, 3rd try, Eat card. 7/7 states. One test cannot do it: Account access and Eat card are both <em>end</em> states — a test ends in only one of them.</p>`,
        `<p>Đáp án màu đỏ: <strong>2</strong>. Test 1: đưa thẻ, nhập PIN, đúng ngay lần đầu → Start, Chờ PIN, Lần 1, Truy cập tài khoản. Test 2: đưa thẻ, nhập PIN, sai ba lần → thêm Lần 2, Lần 3, Nuốt thẻ. Đủ 7/7 trạng thái. Một test không làm được: Truy cập tài khoản và Nuốt thẻ đều là trạng thái <em>kết thúc</em> — mỗi test chỉ kết thúc ở một trong hai.</p>`],
      [64, 'How many tests to cover all transitions? (question)',
        `<p>Same diagram, second question: <strong>how many tests to cover all transitions?</strong> Before the answer, count the arrows: insert card · enter PIN · 1st→2nd · 2nd→3rd · 3rd→Eat card · 1st→Access · 2nd→Access · 3rd→Access = 8 transitions. Test 1 and test 2 of slide 63 cover 6 of them; the valid arrows from the 2nd and 3rd tries are still untested.</p>`,
        `<p>Cùng sơ đồ, câu hỏi thứ hai: <strong>cần bao nhiêu test để phủ mọi chuyển đổi?</strong> Trước khi xem đáp án, đếm mũi tên: đưa thẻ · nhập PIN · Lần1→Lần2 · Lần2→Lần3 · Lần3→Nuốt thẻ · Lần1→Truy cập · Lần2→Truy cập · Lần3→Truy cập = 8 chuyển đổi. Test 1 và 2 của slide 63 mới phủ 6; hai mũi tên hợp lệ từ lần thử 2 và 3 chưa được test.</p>`],
      [65, 'All transitions — thinking step (animation frame)',
        `<p>An intermediate animation frame, identical to slide 64. Use it to reason: every test starts at Start and stops at an end state, and each of the three "valid PIN" arrows leads to the same end state Account access — so one test can use at most <em>one</em> of them. Three valid arrows + the eat-card ending → at least four tests.</p>`,
        `<p>Một khung hình trung gian của hiệu ứng, giống hệt slide 64. Dùng nó để suy luận: mỗi test bắt đầu ở Start và dừng ở một trạng thái kết thúc, và ba mũi tên "PIN đúng" đều dẫn tới cùng trạng thái kết thúc Truy cập tài khoản — nên một test dùng được nhiều nhất <em>một</em> mũi tên trong số đó. Ba mũi tên hợp lệ + kết thúc nuốt thẻ → ít nhất bốn test.</p>`],
      [66, 'All transitions — the four tests (animation frame)',
        `<p>Another identical frame; here are the four tests. T1: valid PIN at the 1st try. T2: invalid, then valid (2nd try → Access). T3: invalid, invalid, then valid (3rd try → Access). T4: invalid three times → Eat card. Script check on the model: <code>4 tests -&gt; transitions 8 of 8</code>. The book adds that T3 and T2 are "probably less important" than T1 and T4 — coverage and priority are different questions.</p>`,
        `<p>Thêm một khung giống hệt; đây là bốn test. T1: PIN đúng ở lần 1. T2: sai, rồi đúng (Lần 2 → Truy cập). T3: sai, sai, rồi đúng (Lần 3 → Truy cập). T4: sai ba lần → Nuốt thẻ. Script kiểm trên mô hình: <code>4 tests -&gt; transitions 8 of 8</code>. Sách nói thêm T2 và T3 "có lẽ ít quan trọng hơn" T1 và T4 — độ phủ và độ ưu tiên là hai câu hỏi khác nhau.</p>`],
      [67, 'Answers: all states 2 · all transitions 4',
        `<p>The final frame shows both answers in red: <strong>states → 2</strong>, <strong>transitions → 4</strong>. The general lesson: <strong>transition coverage is stronger than state coverage</strong> — the two state-covering tests visited every circle but skipped two arrows. For exam questions "how many tests": list the end states and the arrows that enter them; each test contributes exactly one final arrow.</p>`,
        `<p>Khung cuối hiện cả hai đáp án màu đỏ: <strong>trạng thái → 2</strong>, <strong>chuyển đổi → 4</strong>. Bài học chung: <strong>phủ chuyển đổi mạnh hơn phủ trạng thái</strong> — hai test phủ trạng thái đã đi qua mọi hình tròn nhưng bỏ sót hai mũi tên. Với câu hỏi "cần bao nhiêu test": liệt kê các trạng thái kết thúc và các mũi tên đi vào chúng; mỗi test chỉ đóng góp đúng một mũi tên cuối.</p>`],
      [68, 'State table — states × events, valid and invalid',
        `<p>The state table from the book (Table 4.9/4.10). States down the side, events across the top (Insert card · Valid PIN · Invalid PIN); each cell = the next state for that state–event pair. The slide animates "?" into answers, which is why characters overlap. Final content:</p>
<table>
<thead><tr><th>State</th><th>Insert card</th><th>Valid PIN</th><th>Invalid PIN</th></tr></thead>
<tbody>
<tr><td>S1 Start</td><td>S2</td><td>– (circled: invalid transition)</td><td>–</td></tr>
<tr><td>S2 Wait for PIN</td><td>–</td><td>S6</td><td>S3</td></tr>
<tr><td>S3 1st try invalid</td><td>–</td><td>S6</td><td>S4</td></tr>
<tr><td>S4 2nd try invalid</td><td>–</td><td>S6</td><td>S5</td></tr>
<tr><td>S5 3rd try invalid</td><td>–</td><td>–</td><td>S7</td></tr>
<tr><td>S6 Access account</td><td>–</td><td>– / ?</td><td>– / ?</td></tr>
<tr><td>S7 Eat card</td><td>S1 (new card)</td><td>–</td><td>–</td></tr>
</tbody>
</table>
<p>21 cells: 9 valid transitions, 10 "–" invalid, 2 "?" (what if a PIN is typed while the account menu is open — is it taken as an amount? the book calls that "a good test"). Teacher's notes: every "–" is an <strong>invalid transition</strong> — physically impossible or not expected in that state — and becomes a <strong>negative test</strong> (e.g. entering a PIN with no card inserted must do nothing). Small inconsistency to know about: the table models the states as "n-th try <em>invalid</em>" (after S4 a third wrong PIN goes to S5 and one more invalid event to S7), while the diagram eats the card directly after the 3rd wrong PIN; read S5 → S7 as the automatic card retention.</p>`,
        `<p>Bảng trạng thái lấy từ sách (Bảng 4.9/4.10). Trạng thái xếp dọc, sự kiện xếp ngang (Đưa thẻ · PIN đúng · PIN sai); mỗi ô = trạng thái kế tiếp của cặp trạng thái–sự kiện đó. Slide có hiệu ứng biến "?" thành đáp án nên chữ bị chồng lên nhau. Nội dung cuối cùng:</p>
<table>
<thead><tr><th>Trạng thái</th><th>Đưa thẻ</th><th>PIN đúng</th><th>PIN sai</th></tr></thead>
<tbody>
<tr><td>S1 Start</td><td>S2</td><td>– (khoanh tròn: chuyển đổi không hợp lệ)</td><td>–</td></tr>
<tr><td>S2 Chờ PIN</td><td>–</td><td>S6</td><td>S3</td></tr>
<tr><td>S3 Sai lần 1</td><td>–</td><td>S6</td><td>S4</td></tr>
<tr><td>S4 Sai lần 2</td><td>–</td><td>S6</td><td>S5</td></tr>
<tr><td>S5 Sai lần 3</td><td>–</td><td>–</td><td>S7</td></tr>
<tr><td>S6 Truy cập tài khoản</td><td>–</td><td>– / ?</td><td>– / ?</td></tr>
<tr><td>S7 Nuốt thẻ</td><td>S1 (thẻ mới)</td><td>–</td><td>–</td></tr>
</tbody>
</table>
<p>21 ô: 9 chuyển đổi hợp lệ, 10 ô "–" không hợp lệ, 2 ô "?" (nếu gõ PIN khi đang ở menu tài khoản thì sao — máy có hiểu nó là số tiền không? sách gọi đó là "một test hay"). Ghi chú của thầy/cô: mỗi ô "–" là một <strong>chuyển đổi không hợp lệ</strong> — không thể xảy ra về mặt vật lý hoặc không được mong đợi ở trạng thái đó — và trở thành một <strong>test âm</strong> (vd nhập PIN khi chưa đưa thẻ thì máy không được làm gì). Một chỗ lệch nhỏ cần biết: bảng mô hình hoá trạng thái là "sai lần n" (sau S4 nhập sai lần ba thì sang S5, thêm một sự kiện sai nữa mới sang S7), còn sơ đồ nuốt thẻ ngay sau lần sai thứ ba; hãy hiểu S5 → S7 là việc giữ thẻ tự động.</p>`],
      [69, 'Question — battery charger, highest transition coverage',
        AE(`D — Wait → Trickle → Charge → High → Charge → Trickle → Wait → Off → Wait`, `The model has 10 transitions: Wait↔Off (2), Wait↔Trickle (2), Trickle↔Charge (2), Charge↔Low (2), Charge↔High (2). Count the <em>distinct</em> valid transitions in each sequence (repeats do not count twice): A = 7 (Off→Wait is used twice), B = 7 (Wait→Trickle twice), C = 6 (Trickle↔Wait repeated), <strong>D = 8</strong> — everything except Charge↔Low. The teacher's yellow numbers 7, 7, 6, 8 agree; script: <code>A 7 · B 7 · C 6 · D 8 of 10, no invalid step</code>.`),
        AV(`D — Wait → Trickle → Charge → High → Charge → Trickle → Wait → Off → Wait`, `Mô hình có 10 chuyển đổi: Wait↔Off (2), Wait↔Trickle (2), Trickle↔Charge (2), Charge↔Low (2), Charge↔High (2). Đếm số chuyển đổi hợp lệ <em>khác nhau</em> trong mỗi chuỗi (lặp lại không tính hai lần): A = 7 (Off→Wait dùng hai lần), B = 7 (Wait→Trickle hai lần), C = 6 (lặp Trickle↔Wait), <strong>D = 8</strong> — đủ mọi thứ trừ Charge↔Low. Số màu vàng của thầy/cô 7, 7, 6, 8 khớp; script: <code>A 7 · B 7 · C 6 · D 8 of 10, no invalid step</code>.`)],
      [70, 'Question — what can be a coverage measure for state transition testing?',
        AE(`D — 1, 3 and 5`, `Exactly the list of slide 61: all states reached (1), every transition exercised (3), specific sequences of transitions exercised (5). Response time (2) is a performance measure; "all boundaries exercised" (4) is BVA coverage.`),
        AV(`D — 1, 3 và 5`, `Đúng danh sách ở slide 61: đi qua mọi trạng thái (1), chạy mọi chuyển đổi (3), chạy các chuỗi chuyển đổi cụ thể (5). Thời gian phản hồi (2) là thước đo hiệu năng; "chạy mọi biên" (4) là độ phủ BVA.`)],
      [71, 'Question — minimum series of valid transitions covering every state',
        AE(`C — SS – S1 – S2 – S4 – S1 – S3 – ES`, `Read the arrows from the diagram: SS→S1, S1→S2, S1→S3, S2→S4, S4→S1, S3→S4, S3→ES. A uses S2→S3 and S4→ES, which do not exist. D uses S1→S4, S4→S2 and S2→S1 — all against the arrow direction. B and C are both valid and both visit all 6 states, but C needs 6 transitions and B needs 9 → C is the <em>minimum</em>. Script: <code>C states: 6 transitions: 6 invalid: []</code>.`),
        AV(`C — SS – S1 – S2 – S4 – S1 – S3 – ES`, `Đọc mũi tên trên sơ đồ: SS→S1, S1→S2, S1→S3, S2→S4, S4→S1, S3→S4, S3→ES. A dùng S2→S3 và S4→ES, không tồn tại. D dùng S1→S4, S4→S2 và S2→S1 — đều ngược chiều mũi tên. B và C đều hợp lệ và đều qua đủ 6 trạng thái, nhưng C cần 6 chuyển đổi còn B cần 9 → C là chuỗi <em>tối thiểu</em>. Script: <code>C states: 6 transitions: 6 invalid: []</code>.`)],
      [72, 'Question — login with three attempts, tests for 100% transition coverage',
        AE(`C — 4`, `Model it like the PIN example: states Attempt 1, Attempt 2, Attempt 3, Locked (error, wait 10 minutes) and Logged in. Transitions: success from each of the three attempts (3 arrows into Logged in) and failure 1→2, 2→3, 3→Locked. Each test terminates at a successful login, and a test can end through only one of the three success arrows → three tests (success at 1st, 2nd, 3rd try) plus one test through the lockout → <strong>4</strong>, the same reasoning as the 4 tests of slide 67. Caveat: if you also draw "after 10 minutes → Attempt 1" and let the lockout test continue to a success, 3 tests would suffice (script: <code>3 tests if lock-&gt;A1 is modelled: 7 of 7</code>); since 3 is not offered, the intended model ends the test at the lockout, like "Eat card".`),
        AV(`C — 4`, `Mô hình hoá như ví dụ PIN: trạng thái Lần 1, Lần 2, Lần 3, Bị khoá (báo lỗi, chờ 10 phút) và Đã đăng nhập. Chuyển đổi: đăng nhập thành công từ mỗi lần thử (3 mũi tên vào Đã đăng nhập) và thất bại 1→2, 2→3, 3→Bị khoá. Mỗi test kết thúc khi đăng nhập thành công, và một test chỉ đi qua được một trong ba mũi tên thành công → ba test (thành công ở lần 1, 2, 3) cộng một test đi qua nhánh khoá → <strong>4</strong>, cùng lập luận với 4 test ở slide 67. Lưu ý: nếu vẽ thêm "sau 10 phút → Lần 1" và cho test bị khoá chạy tiếp tới thành công thì 3 test là đủ (script: <code>3 tests if lock-&gt;A1 is modelled: 7 of 7</code>); vì đề không có phương án 3, mô hình mà đề muốn là test kết thúc ở trạng thái khoá, giống "Nuốt thẻ".`)],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — an online order: diagram → state table → tests</h3>
<p><strong>Spec.</strong> A new order is <em>Created</em>. Paying moves it to <em>Paid</em>. A paid order can be shipped (<em>Shipped</em>), and a shipped order delivered (<em>Delivered</em>). A created or paid order can be cancelled (<em>Cancelled</em>; a paid order is refunded). Delivered and Cancelled are final.</p>
<p><strong>Step 1 — state table</strong> (5 states × 4 events = 20 cells; "–" = invalid transition):</p>
<table>
<thead><tr><th>State \\ event</th><th>pay</th><th>ship</th><th>deliver</th><th>cancel</th></tr></thead>
<tbody>
<tr><td>Created</td><td>Paid</td><td>–</td><td>–</td><td>Cancelled</td></tr>
<tr><td>Paid</td><td>–</td><td>Shipped</td><td>–</td><td>Cancelled (refund)</td></tr>
<tr><td>Shipped</td><td>–</td><td>–</td><td>Delivered</td><td>–</td></tr>
<tr><td>Delivered</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>Cancelled</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
</tbody>
</table>
<p><strong>Step 2 — valid-transition tests.</strong> All states: T1 Created —pay→ Paid —ship→ Shipped —deliver→ Delivered; T2 Created —cancel→ Cancelled → <strong>2 tests</strong>. All transitions (0-switch): T1, T2 and T3 Created —pay→ Paid —cancel→ Cancelled → <strong>3 tests</strong>. 1-switch (pairs of consecutive transitions): pay-ship, pay-cancel, ship-deliver = 3 pairs, already covered by T1 and T3.</p>
<p><strong>Step 3 — invalid-transition tests</strong> (one per "–" cell, each checks "rejected, state unchanged, clear message"): e.g. <em>ship</em> a Created order (not paid!), <em>pay</em> a Paid order twice, <em>cancel</em> a Shipped order, <em>deliver</em> a Paid order, <em>pay</em> a Cancelled order… 15 cells in total. The "pay twice" and "cancel after shipping" cells are the ones that cost real shops money.</p>
<p>Real script output for both models in this lesson:</p>
<pre><code>== PIN diagram (slides 62-67)
2 tests -&gt; states 7 of 7
4 tests -&gt; transitions 8 of 8
== Order lifecycle worked example
cells 20 valid 5 invalid 15
all-states tests: 2 -&gt; 5 states
all-transitions tests: 3 -&gt; 5 of 5
1-switch pairs: 3</code></pre>
<div class="pitfall"><b>Traps:</b> (1) state coverage ≠ transition coverage — count arrows, not circles; (2) repeated transitions in a sequence count once (slide 69); (3) every test starts at the initial state and ends at a final state, so the number of arrows entering final states often decides the minimum; (4) a sequence that uses a non-existent arrow is invalid even if it visits every state (slide 71); (5) diagrams hide invalid transitions — only the state table shows them.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Model-based testing and state explosion.</b> Real systems have far more states than seven; combined with many events the table explodes into thousands of cells no human can enumerate. <em>Model-based testing</em> tools (GraphWalker, Spec Explorer, fMBT) let you draw the model once and generate test paths automatically for a chosen criterion — all states, all edges (0-switch), all edge pairs (N-switch), random walks until 100% edge coverage — and run them against the system through adapters (e.g. Selenium). UML statecharts add hierarchy and <em>guards</em> ("[balance ≥ amount] withdraw") to tame the explosion. <em>Outside the syllabus because CTFL expects hand-drawn models with a handful of states and only 0-switch coverage.</em></div>`,
    `<h3>Ví dụ có lời giải · Đơn hàng online: sơ đồ → bảng trạng thái → test</h3>
<p><strong>Đặc tả.</strong> Đơn mới ở trạng thái <em>Created</em>. Thanh toán thì chuyển sang <em>Paid</em>. Đơn đã thanh toán có thể được giao cho vận chuyển (<em>Shipped</em>), đơn đang vận chuyển thì được giao tới nơi (<em>Delivered</em>). Đơn Created hoặc Paid có thể bị huỷ (<em>Cancelled</em>; đơn đã trả tiền thì được hoàn tiền). Delivered và Cancelled là trạng thái kết thúc.</p>
<p><strong>Bước 1 — bảng trạng thái</strong> (5 trạng thái × 4 sự kiện = 20 ô; "–" = chuyển đổi không hợp lệ):</p>
<table>
<thead><tr><th>Trạng thái \\ sự kiện</th><th>pay</th><th>ship</th><th>deliver</th><th>cancel</th></tr></thead>
<tbody>
<tr><td>Created</td><td>Paid</td><td>–</td><td>–</td><td>Cancelled</td></tr>
<tr><td>Paid</td><td>–</td><td>Shipped</td><td>–</td><td>Cancelled (hoàn tiền)</td></tr>
<tr><td>Shipped</td><td>–</td><td>–</td><td>Delivered</td><td>–</td></tr>
<tr><td>Delivered</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
<tr><td>Cancelled</td><td>–</td><td>–</td><td>–</td><td>–</td></tr>
</tbody>
</table>
<p><strong>Bước 2 — test cho chuyển đổi hợp lệ.</strong> Mọi trạng thái: T1 Created —pay→ Paid —ship→ Shipped —deliver→ Delivered; T2 Created —cancel→ Cancelled → <strong>2 test</strong>. Mọi chuyển đổi (0-switch): T1, T2 và T3 Created —pay→ Paid —cancel→ Cancelled → <strong>3 test</strong>. 1-switch (cặp chuyển đổi liên tiếp): pay-ship, pay-cancel, ship-deliver = 3 cặp, đã được T1 và T3 phủ.</p>
<p><strong>Bước 3 — test cho chuyển đổi không hợp lệ</strong> (mỗi ô "–" một test, kiểm "bị từ chối, trạng thái giữ nguyên, có thông báo rõ ràng"): vd <em>ship</em> một đơn Created (chưa trả tiền!), <em>pay</em> một đơn đã Paid lần nữa, <em>cancel</em> đơn đã Shipped, <em>deliver</em> đơn mới Paid, <em>pay</em> đơn đã Cancelled… tổng cộng 15 ô. Hai ô "trả tiền hai lần" và "huỷ sau khi đã giao vận chuyển" là những ô làm các shop thật mất tiền.</p>
<p>Output thật của script cho cả hai mô hình trong bài:</p>
<pre><code>== PIN diagram (slides 62-67)
2 tests -&gt; states 7 of 7
4 tests -&gt; transitions 8 of 8
== Order lifecycle worked example
cells 20 valid 5 invalid 15
all-states tests: 2 -&gt; 5 states
all-transitions tests: 3 -&gt; 5 of 5
1-switch pairs: 3</code></pre>
<div class="pitfall"><b>Bẫy:</b> (1) phủ trạng thái ≠ phủ chuyển đổi — đếm mũi tên, không đếm hình tròn; (2) chuyển đổi lặp lại trong một chuỗi chỉ tính một lần (slide 69); (3) mỗi test bắt đầu ở trạng thái đầu và kết thúc ở một trạng thái cuối, nên số mũi tên đi vào trạng thái cuối thường quyết định số test tối thiểu; (4) chuỗi dùng một mũi tên không tồn tại là không hợp lệ dù có đi qua mọi trạng thái (slide 71); (5) sơ đồ giấu chuyển đổi không hợp lệ — chỉ bảng trạng thái mới cho thấy.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Model-based testing và bùng nổ trạng thái.</b> Hệ thống thật có nhiều trạng thái hơn bảy rất nhiều; nhân với nhiều sự kiện, bảng bùng nổ thành hàng nghìn ô không ai liệt kê tay nổi. Công cụ <em>model-based testing</em> (GraphWalker, Spec Explorer, fMBT) cho bạn vẽ mô hình một lần rồi tự sinh đường test theo tiêu chí chọn — mọi trạng thái, mọi cạnh (0-switch), mọi cặp cạnh (N-switch), đi ngẫu nhiên tới khi phủ 100% cạnh — và chạy trên hệ thống qua adapter (vd Selenium). UML statechart thêm phân cấp và <em>guard</em> ("[số dư ≥ số tiền] rút tiền") để chế ngự bùng nổ. <em>Ngoài giáo trình vì CTFL chỉ yêu cầu mô hình vẽ tay vài trạng thái và độ phủ 0-switch.</em></div>`),
    books([
      ['fst4', 'Ch.4 Section 2 — state transition testing, book pp.127–130, Fig. 4.2 (PIN state diagram) p.128, Table 4.10 (state table) p.130 (PDF pp.141–144)', 'Chương 4 mục 2 — state transition testing, trang sách 127–130, Hình 4.2 (sơ đồ PIN) trang 128, Bảng 4.10 (bảng trạng thái) trang 130 (PDF 141–144)'],
      ['fst', '§4.3.3 "State transition testing" incl. "Testing for invalid transitions" and Table 4.9 — pp.100–103 (PDF ≈ +3)', '§4.3.3 "State transition testing", có mục "Testing for invalid transitions" và Bảng 4.9 — trang 100–103 (PDF ≈ +3)'],
      ['sp5', '§5.1.3 "State Transition Testing" — PDF pp.184–191', '§5.1.3 "State Transition Testing" — PDF 184–191'],
      ['sp4', '§5.1.3 "State Transition Testing" — pp.128–135 (PDF pp.143–150)', '§5.1.3 "State Transition Testing" — trang 128–135 (PDF 143–150)'],
    ]),
  ].join('\n'),
};

/* ─────────────────────── 4.6 Use case testing & mixed review ─────────────────────── */
const L46 = {
  title: '4.6 — Use case testing & mixed black-box review questions|||4.6 — Kiểm thử use case & câu hỏi ôn tập tổng hợp black-box',
  slug: 'swt301-blackbox-use-case',
  type: 'VIDEO',
  description: 'SWT4 slide 73–81: use case ATM (kịch bản chính + extension), actor/subject, hành vi cơ bản–ngoại lệ–lỗi, độ phủ use case; 6 câu ôn tổng hợp (tốc độ, thermostat, TV, đăng nhập, rút tiền) giải từng bước và bảng chọn kỹ thuật black-box.',
  content: [
    bi(`<span class="eyebrow">Chapter 4 · Lesson 4.6 · SWT4 slides 73–81</span>
<h2>Use case testing — and a mixed review of all black-box techniques</h2>
<p class="lead">Use case testing tests the system <em>transaction by transaction, from start to finish</em>, the way an actor uses it: one test for the main success scenario and one for each alternative, exception and error path. The block ends with six review questions that mix BVA, EP and state transition — a good self-test before the chapter quiz.</p>
<div class="callout"><b>Learning objective.</b> LO-4.2.5 Explain how to derive test cases from a use case (K2) — only K2, so the exam asks what is covered and why, not calculations.</div>
<h3>Choosing among the five black-box techniques</h3>
<table>
<thead><tr><th>The specification talks about…</th><th>Use</th><th>Coverage item</th></tr></thead>
<tbody>
<tr><td>inputs/outputs that fall into groups</td><td>Equivalence partitioning</td><td>partitions</td></tr>
<tr><td>ordered ranges (numbers, lengths, dates)</td><td>Boundary value analysis</td><td>boundary values</td></tr>
<tr><td>combinations of conditions → actions (business rules)</td><td>Decision table</td><td>rules (columns)</td></tr>
<tr><td>behaviour that depends on history / current state</td><td>State transition</td><td>states, transitions</td></tr>
<tr><td>actor–system interactions, end-to-end flows</td><td>Use case testing</td><td>use case behaviours (main + alternative + error)</td></tr>
</tbody>
</table>`,
    `<span class="eyebrow">Chương 4 · Bài 4.6 · SWT4 slide 73–81</span>
<h2>Kiểm thử use case — và ôn tập tổng hợp các kỹ thuật black-box</h2>
<p class="lead">Kiểm thử use case test hệ thống <em>theo từng giao dịch, từ đầu đến cuối</em>, đúng cách một tác nhân sử dụng nó: một test cho kịch bản thành công chính và một test cho mỗi nhánh thay thế, ngoại lệ, lỗi. Khối slide kết thúc bằng sáu câu ôn tập trộn BVA, EP và state transition — bài tự kiểm tra tốt trước quiz chương.</p>
<div class="callout"><b>Chuẩn đầu ra.</b> LO-4.2.5 Giải thích cách suy ra test case từ một use case (K2) — chỉ K2, nên đề hỏi phủ cái gì và vì sao, không bắt tính toán.</div>
<h3>Chọn kỹ thuật nào trong năm kỹ thuật black-box</h3>
<table>
<thead><tr><th>Đặc tả nói về…</th><th>Dùng</th><th>Phần tử độ phủ</th></tr></thead>
<tbody>
<tr><td>input/output chia được thành nhóm</td><td>Phân vùng tương đương</td><td>phân vùng</td></tr>
<tr><td>khoảng có thứ tự (số, độ dài, ngày)</td><td>Phân tích giá trị biên</td><td>giá trị biên</td></tr>
<tr><td>tổ hợp điều kiện → hành động (quy tắc nghiệp vụ)</td><td>Decision table</td><td>rule (cột)</td></tr>
<tr><td>hành vi phụ thuộc lịch sử / trạng thái hiện tại</td><td>State transition</td><td>trạng thái, chuyển đổi</td></tr>
<tr><td>tương tác tác nhân–hệ thống, luồng đầu–cuối</td><td>Use case testing</td><td>hành vi của use case (chính + thay thế + lỗi)</td></tr>
</tbody>
</table>`),
    walkHead(D, 73, 81),
    walk(D, [
      [73, 'Use Case Testing — the ATM use case',
        `<p>The PIN example again, now written as a use case (book Fig. 4.3). <strong>Main success scenario</strong> (A = actor, S = system): 1 A inserts card · 2 S validates the card and asks for the PIN · 3 A enters the PIN · 4 S validates the PIN · 5 S allows access to the account. <strong>Extensions</strong> (numbered after the step where they branch off): 2a invalid card → S displays an error and ejects the card · 4a invalid PIN → S displays an error and asks for a re-attempt (twice) · 4b invalid PIN three times → S eats the card and exits (this last row is cut off at the bottom of the slide image). Tests: one for the main scenario + one per extension = <strong>4</strong>. The book gives 4b a higher priority than 4a — losing a card is the more serious outcome. Compare with lesson 4.5: the same behaviour, seen as a flow instead of a state machine.</p>`,
        `<p>Lại ví dụ PIN, lần này viết thành use case (Hình 4.3 trong sách). <strong>Kịch bản thành công chính</strong> (A = tác nhân, S = hệ thống): 1 A đưa thẻ · 2 S kiểm tra thẻ và yêu cầu PIN · 3 A nhập PIN · 4 S kiểm tra PIN · 5 S cho truy cập tài khoản. <strong>Extension</strong> (đánh số theo bước mà nó rẽ nhánh): 2a thẻ không hợp lệ → S báo lỗi và trả thẻ · 4a PIN sai → S báo lỗi và cho nhập lại (hai lần) · 4b PIN sai ba lần → S nuốt thẻ và thoát (dòng cuối này bị cắt ở mép dưới ảnh slide). Test: một cho kịch bản chính + một cho mỗi extension = <strong>4</strong>. Sách ưu tiên 4b cao hơn 4a — mất thẻ là hậu quả nặng hơn. So với bài 4.5: cùng một hành vi, nhìn dưới dạng luồng thay vì máy trạng thái.</p>`],
      [74, 'Use Case Testing — definition, actors and subjects',
        `<p><strong>Use case testing</strong> = a technique that helps us identify test cases that <strong>exercise the whole system on a transaction-by-transaction basis from start to finish</strong>. Use cases are associated with <strong>actors</strong> — human users, external hardware, or other components or systems — and <strong>subjects</strong> — the component or system to which the use case is applied. Each use case specifies some behaviour that a subject can perform in collaboration with one or more actors. Where it is used: mostly system and acceptance testing (it follows real usage, so it finds the defects users would meet first), and integration testing when the actor is another system — use cases can uncover integration defects.</p>`,
        `<p><strong>Kiểm thử use case</strong> = kỹ thuật giúp xác định test case <strong>chạy cả hệ thống theo từng giao dịch, từ đầu tới cuối</strong>. Use case gắn với <strong>tác nhân (actor)</strong> — người dùng, phần cứng bên ngoài, hoặc thành phần/hệ thống khác — và <strong>chủ thể (subject)</strong> — thành phần hay hệ thống mà use case áp dụng lên. Mỗi use case đặc tả một hành vi mà chủ thể thực hiện khi cộng tác với một hoặc nhiều tác nhân. Dùng ở đâu: chủ yếu system và acceptance testing (nó bám cách dùng thật nên tìm ra những lỗi người dùng sẽ gặp đầu tiên), và integration testing khi tác nhân là hệ thống khác — use case có thể làm lộ lỗi tích hợp.</p>`],
      [75, 'Use Case Testing — behaviours and coverage',
        `<p>Use cases are defined <strong>in terms of the actor, not the system</strong> — what the actor does and sees, rather than expected inputs and outputs — often in business language. A use case can include <strong>variations of its basic behaviour, including exceptional behaviour and error handling</strong> → tests are designed to exercise the defined behaviours. <strong>Coverage (UCT) = #tested use case behaviours ÷ #identified use case behaviours</strong>. For slide 73: 4 behaviours (main, 2a, 4a, 4b); testing only the main scenario = 25%.</p>`,
        `<p>Use case được viết <strong>theo góc nhìn tác nhân, không theo hệ thống</strong> — tác nhân làm gì và thấy gì, thay vì input và output mong đợi — thường bằng ngôn ngữ nghiệp vụ. Một use case có thể gồm <strong>các biến thể của hành vi cơ bản, kể cả hành vi ngoại lệ và xử lý lỗi</strong> → test được thiết kế để chạy qua các hành vi đã định nghĩa. <strong>Độ phủ (UCT) = số hành vi use case đã test ÷ số hành vi use case đã xác định</strong>. Với slide 73: 4 hành vi (chính, 2a, 4a, 4b); chỉ test kịch bản chính = 25%.</p>`],
      [76, 'Question — which behaviours of a use case should tests cover?',
        AE(`B — Basic, exception and error`, `Syllabus wording (slide 75): the basic behaviour plus its variations, "including exceptional behaviour and error handling". A is too vague (positive/negative); C mixes in "data and integration", which are not use-case behaviours; D lists white-box concepts (control flow, data flow, decision paths).`),
        AV(`B — Cơ bản, ngoại lệ và lỗi`, `Đúng chữ của syllabus (slide 75): hành vi cơ bản cùng các biến thể, "kể cả hành vi ngoại lệ và xử lý lỗi". A quá chung chung (đường tích cực/tiêu cực); C trộn thêm "dữ liệu và tích hợp" vốn không phải hành vi của use case; D là khái niệm white-box (luồng điều khiển, luồng dữ liệu, đường quyết định).`)],
      [77, 'Question — speed control, two-point BVA values',
        AE(`C — 50, 51, 55, 56, 60, 61`, `Partitions (whole km/h): ≤ 50 nothing · 51–55 warning · 56–60 fine · ≥ 61 licence suspended. Two-point BVA takes each edge and its neighbour: 50 | 51, 55 | 56, 60 | 61. A puts the edges one too low (49/50, 54, 59/60 — as if the ranges were "&lt; 50"), B has only one value per boundary, D mixes wrong values (49, 54, 62). The words to watch: "faster than 50" = 51 and up, "55 or less" includes 55.`),
        AV(`C — 50, 51, 55, 56, 60, 61`, `Các vùng (km/h nguyên): ≤ 50 không sao · 51–55 cảnh cáo · 56–60 phạt tiền · ≥ 61 treo bằng. BVA hai điểm lấy mỗi mép và giá trị kề: 50 | 51, 55 | 56, 60 | 61. A đặt mép thấp hơn một đơn vị (49/50, 54, 59/60 — như thể khoảng là "&lt; 50"), B chỉ có một giá trị mỗi biên, D trộn giá trị sai (49, 54, 62). Chữ cần để ý: "nhanh hơn 50" = từ 51 trở lên, "55 trở xuống" có cả 55.`)],
      [78, 'Question — thermostat, minimum set for two-value BVA',
        AE(`C — 69, 70, 75, 76`, `Partitions: &lt; 70 heating · 70–75 inclusive fan only · &gt; 75 air conditioning. Two boundaries, two values each: 69 | 70 and 75 | 76. A (70, 75) has only the valid side; B (65, 72, 80) is EP; D adds 71 and 74, which are not boundary values, so it is not minimal (it also misses 69).`),
        AV(`C — 69, 70, 75, 76`, `Các vùng: &lt; 70 bật sưởi · 70–75 (tính cả hai đầu) chỉ bật quạt · &gt; 75 bật điều hoà. Hai biên, mỗi biên hai giá trị: 69 | 70 và 75 | 76. A (70, 75) chỉ có phía valid; B (65, 72, 80) là EP; D thêm 71 và 74 vốn không phải giá trị biên nên không tối thiểu (lại còn thiếu 69).`)],
      [79, 'Question — TV state diagram and its five test cases',
        AE(`B — The given test cases represent all possible valid transitions`, `The diagram has exactly five transitions: S1 TV Off —Power On→ S2 Stand-by; S2 —Power Off→ S1; S2 —RC On→ S3 Play; S3 —RC Off→ S2; S3 —Power Off→ S1. The table's tests 1–5 are exactly these five (start state, input, expected state) → 100% valid-transition (0-switch) coverage. A is false: none is invalid (an invalid one would be e.g. RC On while the TV is off). C is false because all are covered. D is false: each test is a single transition, not a pair. Script: <code>all valid &amp; distinct: True 5 of 5</code>; the 3 × 4 state table would add 7 invalid cells.`),
        AV(`B — Các test case đã cho đại diện cho mọi chuyển đổi hợp lệ`, `Sơ đồ có đúng năm chuyển đổi: S1 TV tắt —Power On→ S2 Chờ; S2 —Power Off→ S1; S2 —RC On→ S3 Đang phát; S3 —RC Off→ S2; S3 —Power Off→ S1. Test 1–5 trong bảng chính là năm chuyển đổi đó (trạng thái đầu, input, trạng thái mong đợi) → phủ 100% chuyển đổi hợp lệ (0-switch). A sai: không test nào là chuyển đổi không hợp lệ (vd RC On khi TV đang tắt mới là không hợp lệ). C sai vì đã phủ đủ. D sai: mỗi test là một chuyển đổi đơn, không phải một cặp. Script: <code>all valid &amp; distinct: True 5 of 5</code>; bảng trạng thái 3 × 4 sẽ có thêm 7 ô không hợp lệ.`)],
      [80, 'Question — login with three attempts (repeat of slide 72)',
        AE(`C — 4`, `The same question as slide 72, repeated for review. Three tests end with a successful login after the 1st, 2nd and 3rd attempt; a fourth goes through three failures to the error/lock-out. See slide 72 for the full model and the caveat about modelling the 10-minute wait.`),
        AV(`C — 4`, `Cùng câu hỏi với slide 72, lặp lại để ôn. Ba test kết thúc bằng đăng nhập thành công sau lần 1, 2, 3; test thứ tư đi qua ba lần sai tới trạng thái lỗi/khoá. Xem slide 72 để có mô hình đầy đủ và lưu ý về việc mô hình hoá 10 phút chờ.`)],
      [81, 'Question — withdrawals 20 / 100 / 500 from a drop-down',
        AE(`C — 3`, `Each amount is handled differently (a different sum is debited and dispensed), so each value is its own valid partition: {20}, {100}, {500}. There is no invalid partition because the drop-down makes any other value impossible to enter — the same effect as the keypad on slide 23. 3 partitions → 3 tests for 100% EP coverage. 4 would invent an "other amount" partition; 1 would lump three different behaviours together.`),
        AV(`C — 3`, `Mỗi mức tiền được xử lý khác nhau (trừ và nhả ra số tiền khác nhau), nên mỗi giá trị là một vùng valid riêng: {20}, {100}, {500}. Không có vùng invalid vì drop-down khiến không thể nhập giá trị nào khác — giống tác dụng của bàn phím ở slide 23. 3 vùng → 3 test cho 100% độ phủ EP. Chọn 4 là tự bịa vùng "số tiền khác"; chọn 1 là gộp ba hành vi khác nhau làm một.`)],
    ]),
    bi(`<h3>Ví dụ có lời giải · Worked example — "Withdraw cash": from use case to tests, and where the other techniques plug in</h3>
<table>
<thead><tr><th>Step</th><th>Main success scenario (A = customer, S = ATM)</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>A inserts card, S asks for PIN, A enters PIN, S validates it and shows the menu</td></tr>
<tr><td>5</td><td>A chooses "Withdraw" and an amount</td></tr>
<tr><td>6</td><td>S checks the account balance and the cash in the machine</td></tr>
<tr><td>7</td><td>S dispenses the cash, debits the account, prints a receipt</td></tr>
<tr><td>8</td><td>A takes card and cash; use case ends</td></tr>
</tbody>
</table>
<p><strong>Extensions:</strong> 2a card invalid → eject · 4a wrong PIN (1st/2nd) → re-enter · 4b wrong PIN 3rd time → retain card · 6a balance too low → message, back to step 5 · 6b not enough cash in the ATM → message, back to step 5.</p>
<table>
<thead><tr><th>Test</th><th>Behaviour</th><th>Key data</th><th>Expected</th></tr></thead>
<tbody>
<tr><td>UC-1</td><td>Main scenario</td><td>valid card, correct PIN, 500,000 VND, balance 2,000,000</td><td>cash dispensed, balance 1,500,000, receipt</td></tr>
<tr><td>UC-2</td><td>2a</td><td>expired card</td><td>"Card invalid", card ejected</td></tr>
<tr><td>UC-3</td><td>4a</td><td>wrong PIN once, then correct</td><td>warning, then menu</td></tr>
<tr><td>UC-4</td><td>4b</td><td>wrong PIN three times</td><td>card retained, bank notified</td></tr>
<tr><td>UC-5</td><td>6a</td><td>withdraw 3,000,000 with balance 2,000,000</td><td>"Insufficient balance", nothing debited</td></tr>
<tr><td>UC-6</td><td>6b</td><td>ATM holds only 1,000,000, request 2,000,000</td><td>"ATM cannot dispense this amount", nothing debited</td></tr>
</tbody>
</table>
<p>Use case coverage = 6/6 behaviours = 100%. Inside the steps, the other techniques add depth: step 5 amount (e.g. multiples of 50,000, max 5,000,000) → <strong>EP + BVA</strong>; steps 3–4 PIN tries → <strong>state transition</strong> (lesson 4.5); step 6 "balance OK × ATM cash OK" → a 2-condition <strong>decision table</strong>. Use case tests give the end-to-end skeleton; the other four techniques fill it.</p>
<div class="pitfall"><b>Traps:</b> (1) use case testing is <em>not</em> only the happy path — the extensions are where it pays; (2) the answer to "which behaviours" is "basic, exceptional/alternative and error", never white-box words; (3) use case testing is black-box and mostly system/acceptance level; (4) a drop-down or keypad removes invalid partitions (slide 81) — but a direct API call might not, so say which interface you test.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Scenario and soap-opera testing.</b> Cem Kaner's <em>scenario testing</em> builds tests as credible stories with a motivated user, complex but realistic data and a clear pass/fail; Hans Buwalda's <em>soap-opera testing</em> exaggerates them — "a customer withdraws cash on 29 February, the network drops while the notes are counted, and the card expires that same day". These find the interaction defects that one-extension-at-a-time use case tests miss. Alistair Cockburn's "fully dressed" use case template (preconditions, guarantees, extensions numbered by step, as on slide 73) is what most teams use to write the use cases in the first place. <em>Outside the syllabus because CTFL only requires one test per defined use case behaviour.</em></div>`,
    `<h3>Ví dụ có lời giải · "Rút tiền": từ use case tới test, và chỗ các kỹ thuật khác gắn vào</h3>
<table>
<thead><tr><th>Bước</th><th>Kịch bản thành công chính (A = khách hàng, S = máy ATM)</th></tr></thead>
<tbody>
<tr><td>1–4</td><td>A đưa thẻ, S hỏi PIN, A nhập PIN, S kiểm tra và hiện menu</td></tr>
<tr><td>5</td><td>A chọn "Rút tiền" và số tiền</td></tr>
<tr><td>6</td><td>S kiểm tra số dư tài khoản và lượng tiền trong máy</td></tr>
<tr><td>7</td><td>S nhả tiền, trừ tài khoản, in biên lai</td></tr>
<tr><td>8</td><td>A lấy thẻ và tiền; use case kết thúc</td></tr>
</tbody>
</table>
<p><strong>Extension:</strong> 2a thẻ không hợp lệ → trả thẻ · 4a sai PIN (lần 1/2) → nhập lại · 4b sai PIN lần 3 → giữ thẻ · 6a số dư không đủ → báo, quay lại bước 5 · 6b máy không đủ tiền → báo, quay lại bước 5.</p>
<table>
<thead><tr><th>Test</th><th>Hành vi</th><th>Dữ liệu chính</th><th>Mong đợi</th></tr></thead>
<tbody>
<tr><td>UC-1</td><td>Kịch bản chính</td><td>thẻ hợp lệ, PIN đúng, 500.000 VND, số dư 2.000.000</td><td>nhả tiền, số dư còn 1.500.000, có biên lai</td></tr>
<tr><td>UC-2</td><td>2a</td><td>thẻ hết hạn</td><td>"Thẻ không hợp lệ", trả thẻ</td></tr>
<tr><td>UC-3</td><td>4a</td><td>sai PIN một lần rồi nhập đúng</td><td>cảnh báo, sau đó vào menu</td></tr>
<tr><td>UC-4</td><td>4b</td><td>sai PIN ba lần</td><td>giữ thẻ, báo ngân hàng</td></tr>
<tr><td>UC-5</td><td>6a</td><td>rút 3.000.000 khi số dư 2.000.000</td><td>"Số dư không đủ", không trừ tiền</td></tr>
<tr><td>UC-6</td><td>6b</td><td>máy chỉ còn 1.000.000, yêu cầu 2.000.000</td><td>"Máy không đủ tiền để chi", không trừ tiền</td></tr>
</tbody>
</table>
<p>Độ phủ use case = 6/6 hành vi = 100%. Bên trong từng bước, các kỹ thuật khác đào sâu thêm: bước 5 số tiền (vd bội số 50.000, tối đa 5.000.000) → <strong>EP + BVA</strong>; bước 3–4 các lần nhập PIN → <strong>state transition</strong> (bài 4.5); bước 6 "đủ số dư × máy đủ tiền" → <strong>decision table</strong> 2 điều kiện. Test use case cho bộ khung đầu–cuối; bốn kỹ thuật kia lấp đầy nó.</p>
<div class="pitfall"><b>Bẫy:</b> (1) kiểm thử use case <em>không</em> chỉ là happy path — giá trị nằm ở các extension; (2) câu trả lời cho "những hành vi nào" là "cơ bản, ngoại lệ/thay thế và lỗi", không bao giờ là từ ngữ white-box; (3) use case testing là black-box và chủ yếu ở cấp system/acceptance; (4) drop-down hay bàn phím loại bỏ vùng invalid (slide 81) — nhưng gọi thẳng API thì có thể không, nên hãy nói rõ bạn test qua giao diện nào.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Scenario testing và soap-opera testing.</b> <em>Scenario testing</em> của Cem Kaner xây test thành những câu chuyện đáng tin với người dùng có động cơ, dữ liệu phức tạp nhưng thực tế và tiêu chí đạt/không đạt rõ ràng; <em>soap-opera testing</em> của Hans Buwalda thì phóng đại chúng lên — "khách rút tiền đúng ngày 29/2, mạng rớt khi máy đang đếm tiền, và thẻ hết hạn ngay hôm đó". Chúng tìm ra lỗi tương tác mà kiểu test mỗi-lần-một-extension bỏ lọt. Mẫu use case "fully dressed" của Alistair Cockburn (tiền điều kiện, cam kết, extension đánh số theo bước như slide 73) là mẫu đa số đội dùng để viết use case ngay từ đầu. <em>Ngoài giáo trình vì CTFL chỉ yêu cầu mỗi hành vi đã định nghĩa của use case có một test.</em></div>`),
    books([
      ['fst4', 'Ch.4 Section 2 — use case testing, book p.131 with Fig. 4.3 (PIN use case) (PDF p.145)', 'Chương 4 mục 2 — use case testing, trang sách 131 với Hình 4.3 (use case PIN) (PDF 145)'],
      ['fst', '§4.3.4 "Use case testing" — pp.103–104 (PDF ≈ +3)', '§4.3.4 "Use case testing" — trang 103–104 (PDF ≈ +3)'],
      ['sp5', '§5.1.6 "Use-Case Testing" PDF pp.208–211 and §5.1.7 "Evaluation of Black-Box Testing" PDF pp.212–213', '§5.1.6 "Use-Case Testing" PDF 208–211 và §5.1.7 "Evaluation of Black-Box Testing" PDF 212–213'],
      ['sp4', '§5.1.5 "Use-Case-Based Testing" pp.141–144 and §5.1.6 "General Discussion of the Black Box Technique" p.145 (PDF +15)', '§5.1.5 "Use-Case-Based Testing" trang 141–144 và §5.1.6 "General Discussion of the Black Box Technique" trang 145 (PDF +15)'],
    ]),
  ].join('\n'),
};

/* ──────────────────────────────── Quiz 4 ──────────────────────────────── */
const q = (question, options, correctIndex) => ({ question, options, correctIndex, points: 1 });
const QUIZ4 = {
  title: 'Quiz 4 — Black-box techniques (all SWT4 slide questions 1–81)|||Quiz 4 — Kỹ thuật black-box (toàn bộ câu hỏi trên slide SWT4 1–81)',
  slug: 'swt301-quiz-4',
  type: 'QUIZ',
  description: '40 câu: đủ 28 câu "Question" trên slide SWT4 1–81 (đáp án đã giải từng bước trong bài 4.1–4.6) + 12 câu kiểm tra lý thuyết EP, BVA, decision table, state transition, use case.',
  quiz: {
    timeLimitSeconds: 2400,
    questions: [
      q('Which option is categorized as a black-box test technique? (SWT4 s.9)|||Phương án nào là kỹ thuật black-box? (SWT4 s.9)', ['Techniques based on analysis of the architecture|||Kỹ thuật dựa trên phân tích kiến trúc', 'Techniques checking that the test object works according to the technical design|||Kỹ thuật kiểm đối tượng test chạy đúng thiết kế kỹ thuật', 'Techniques based on the expected use of the software|||Kỹ thuật dựa trên cách phần mềm dự kiến được dùng', 'Techniques based on formal requirements|||Kỹ thuật dựa trên yêu cầu chính thức'], 3),
      q('If test cases are derived from looking at the code, which type of technique is used? (s.10)|||Nếu test case được suy ra từ việc đọc code thì đó là loại kỹ thuật nào? (s.10)', ['Black-box', 'White-box', 'Specification-based', 'Behaviour-based'], 1),
      q('Which technique uses the requirements specification as its test basis? (s.11)|||Kỹ thuật nào dùng đặc tả yêu cầu làm test basis? (s.11)', ['Structure-based', 'Black-box', 'White-box', 'Exploratory'], 1),
      q('Why are both specification-based and structure-based techniques useful? (s.12)|||Vì sao cả kỹ thuật dựa đặc tả và dựa cấu trúc đều hữu ích? (s.12)', ['Using more techniques is always better|||Dùng càng nhiều kỹ thuật càng tốt', 'They find different types of defects|||Chúng tìm ra các loại defect khác nhau', 'Both find the same types of defect|||Cả hai tìm cùng loại defect', 'Specifications tend to be unstructured|||Đặc tả thường thiếu cấu trúc'], 1),
      q('What is the definition of "test technique"? (s.13)|||Định nghĩa "test technique" là gì? (s.13)', ['A set of test scripts to be executed in a specific test run|||Một tập script test để chạy trong một lượt test', 'Documentation of activities in session-based exploratory testing|||Tài liệu ghi hoạt động trong exploratory testing theo phiên', 'A procedure used to define test conditions, design test cases and specify test data|||Thủ tục dùng để xác định test condition, thiết kế test case và chỉ định test data', 'A sequence of instructions for test execution|||Chuỗi chỉ dẫn để thực thi test'], 2),
      q('"Use cases" are an example of test basis for… (s.14)|||"Use case" là ví dụ về test basis cho… (s.14)', ['Black-box test techniques|||Kỹ thuật black-box', 'White-box test techniques|||Kỹ thuật white-box', 'Experience-based techniques|||Kỹ thuật dựa kinh nghiệm', 'None of the above|||Không phương án nào'], 0),
      q('Gasoline pump: amounts in tenths of a gallon up to 50.0, keypad accepts digits only. Minimum set covering the equivalence partitions? (s.23)|||Bơm xăng: lượng xăng theo 0,1 gallon, tối đa 50,0, bàn phím chỉ nhận số. Bộ tối thiểu phủ các phân vùng? (s.23)', ['0.0, 10.0, 60.0', '0.0, 0.1, 50.0', '0.0, 0.1, 50.0, 70.0', '-0.1, 0.0, 0.1, 49.9, 50.0, 50.1'], 0),
      q('Grades 1–49 F, 50–59 D−, 60–69 D, 70–79 C, 80–89 B, 90–100 A. With EP, how many test cases for minimum coverage? (s.24)|||Điểm 1–49 F, 50–59 D−, 60–69 D, 70–79 C, 80–89 B, 90–100 A. Dùng EP, cần bao nhiêu test để đạt độ phủ tối thiểu? (s.24)', ['6', '8', '10', '12'], 1),
      q('Shipping: 1–10 lbs $5, 11–25 $7.50, 26–50 $12, 51 lbs & up $17, weights rounded to the pound. How many equivalence classes? (s.25)|||Cước ship: 1–10 lbs $5, 11–25 $7,50, 26–50 $12, từ 51 lbs $17, cân làm tròn tới pound. Có bao nhiêu lớp tương đương? (s.25)', ['8', '6', '5', '4'], 2),
      q('True for EP: 1 classes with the same behaviour; 2 valid and invalid partitions; 3 only valid partitions; 4 at least two values per partition; 5 only for GUI systems. (s.26)|||Đúng với EP: 1 lớp cùng hành vi; 2 vùng valid và invalid; 3 chỉ vùng valid; 4 ít nhất hai giá trị mỗi vùng; 5 chỉ cho hệ thống có GUI. (s.26)', ['1, 2 & 5', '1, 3 & 4', '1 & 5', '1 & 2'], 3),
      q('Bonus by employment length: ≤ 2 years, > 2 and < 5, 5 to 10, > 10. Minimum tests to cover all VALID partitions? (s.27)|||Thưởng theo thâm niên: ≤ 2 năm, > 2 và < 5, 5 tới 10, > 10. Số test tối thiểu phủ mọi vùng VALID? (s.27)', ['3', '5', '2', '4'], 3),
      q('Tax: first $4,000 free, next $1,500 at 10%, next $28,000 at 22%, rest 40%. Which group is in ONE equivalence class? (s.28)|||Thuế: $4.000 đầu miễn, $1.500 kế 10%, $28.000 kế 22%, phần còn lại 40%. Nhóm nào cùng MỘT lớp tương đương? (s.28)', ['4,800 – 14,000 – 28,000', '5,200 – 5,500 – 28,000', '28,001 – 32,000 – 35,000', '5,800 – 28,000 – 32,000'], 3),
      q('Same grades as s.24. With BVA, minimum number of test cases? (s.39)|||Cùng bảng điểm như s.24. Dùng BVA, số test tối thiểu? (s.39)', ['8', '10', '12', '14'], 3),
      q('Smart home: ≤14 freezing, 15–19 cold, 20–24 cool, 25–30 open window, >30 AC. BVA (min/max values): which set gives the highest boundary coverage? (s.40)|||Nhà thông minh: ≤14 lạnh cóng, 15–19 lạnh, 20–24 mát, 25–30 mở cửa sổ, >30 bật điều hoà. BVA (min/max): bộ nào phủ biên cao nhất? (s.40)', ['0, 15, 25, 28, 29', '13, 19, 24, 30, 50', '14, 20, 24, 30, 31', '18, 19, 23, 24, 29, 30'], 2),
      q('Bulk order: valid 0.5 to 25.0 units, precision 0.1. Which set covers the 2-point boundary values? (s.41)|||Đặt hàng sỉ: hợp lệ 0,5 tới 25,0 đơn vị, độ chính xác 0,1. Bộ nào phủ BVA 2 điểm? (s.41)', ['0.3, 10.0, 28.0', '0.4, 0.5, 0.6, 14.9, 25.0, 25.1', '0.4, 0.5, 25.0, 25.1', '0.5, 0.6, 24.9, 25.0'], 2),
      q('Shipping 1–10, 11–25, 26–50, 51–100 lbs; shipments cannot exceed 100 lbs. Tests for 100% BVA? (s.42)|||Cước ship 1–10, 11–25, 26–50, 51–100 lbs; không được quá 100 lbs. Bao nhiêu test để đạt 100% BVA? (s.42)', ['4', '8', '10', '12'], 2),
      q('Airline reward table: R1 account/password OK = F; R2 OK = T, points F; R3 OK = T, points T. "Not OK" has 2 partitions (bad account, bad password). Minimum tests covering these partitions and the table? (s.58)|||Bảng đổi thưởng: R1 tài khoản/mật khẩu OK = F; R2 OK = T, điểm F; R3 OK = T, điểm T. "Không OK" có 2 vùng (sai tài khoản, sai mật khẩu). Số test tối thiểu phủ các vùng và bảng? (s.58)', ['2', '3', '4', '5'], 2),
      q('Speeding fine: R1 (speed > 50 T, hospital zone T) and R4 (F, F) are tested. DT1 = 55/T, DT2 = 44/T, DT3 = 66/T, DT4 = 77/F. Which two complete the full table? (s.59)|||Phạt tốc độ: đã test R1 (tốc độ > 50 T, khu bệnh viện T) và R4 (F, F). DT1 = 55/T, DT2 = 44/T, DT3 = 66/T, DT4 = 77/F. Hai test nào hoàn tất bảng đầy đủ? (s.59)', ['DT1, DT2', 'DT2, DT3', 'DT2, DT4', 'DT3, DT4'], 2),
      q('Charger model (Wait↔Off, Wait↔Trickle, Trickle↔Charge, Charge↔Low, Charge↔High). Which sequence gives the highest transition coverage? (s.69)|||Mô hình bộ sạc (Wait↔Off, Wait↔Trickle, Trickle↔Charge, Charge↔Low, Charge↔High). Chuỗi nào phủ chuyển đổi cao nhất? (s.69)', ['Off-Wait-Off-Wait-Trickle-Charge-High-Charge-Low', 'Wait-Trickle-Wait-Off-Wait-Trickle-Charge-Low-Charge', 'High-Charge-Low-Charge-Trickle-Wait-Trickle-Wait-Trickle', 'Wait-Trickle-Charge-High-Charge-Trickle-Wait-Off-Wait'], 3),
      q('Which could be coverage measures for state transition testing? 1 all states reached; 2 response time adequate; 3 every transition exercised; 4 all boundaries exercised; 5 specific sequences exercised. (s.70)|||Đâu có thể là thước đo độ phủ của state transition? 1 đi qua mọi trạng thái; 2 thời gian phản hồi đạt; 3 chạy mọi chuyển đổi; 4 chạy mọi biên; 5 chạy các chuỗi cụ thể. (s.70)', ['3, 4 and 5|||3, 4 và 5', '1, 3, 4 and 5|||1, 3, 4 và 5', '2, 3 and 4|||2, 3 và 4', '1, 3 and 5|||1, 3 và 5'], 3),
      q('Diagram SS→S1, S1→S2, S1→S3, S2→S4, S4→S1, S3→S4, S3→ES. Minimum series of valid transitions covering every state? (s.71)|||Sơ đồ SS→S1, S1→S2, S1→S3, S2→S4, S4→S1, S3→S4, S3→ES. Chuỗi chuyển đổi hợp lệ tối thiểu phủ mọi trạng thái? (s.71)', ['SS-S1-S2-S3-S4-ES', 'SS-S1-S2-S4-S1-S3-S4-S1-S3-ES', 'SS-S1-S2-S4-S1-S3-ES', 'SS-S1-S4-S2-S1-S3-ES'], 2),
      q('Login: after 3 failed attempts an error and a 10-minute wait; the test terminates on a successful login. Tests for 100% state transition coverage? (s.72)|||Đăng nhập: sai 3 lần thì báo lỗi và chờ 10 phút; test kết thúc khi đăng nhập thành công. Bao nhiêu test để phủ 100% chuyển đổi? (s.72)', ['1', '2', '4', '5'], 2),
      q('Which best describes the use-case behaviours that tests should cover? (s.76)|||Câu nào mô tả đúng nhất các hành vi của use case cần được test phủ? (s.76)', ['Positive path and negative path|||Đường tích cực và tiêu cực', 'Basic, exception and error|||Cơ bản, ngoại lệ và lỗi', 'Normal, error, data and integration|||Bình thường, lỗi, dữ liệu và tích hợp', 'Control flow, data flow and decision paths|||Luồng điều khiển, luồng dữ liệu và đường quyết định'], 1),
      q('Speed: ≤ 50 nothing; > 50 and ≤ 55 warning; > 55 and ≤ 60 fine; > 60 licence suspended. Two-point BVA values? (s.77)|||Tốc độ: ≤ 50 không sao; > 50 và ≤ 55 cảnh cáo; > 55 và ≤ 60 phạt; > 60 treo bằng. Giá trị BVA hai điểm? (s.77)', ['0, 49, 50, 54, 59, 60', '50, 55, 60', '50, 51, 55, 56, 60, 61', '49, 50, 54, 55, 60, 62'], 2),
      q('Thermostat: < 70 heating, > 75 AC, 70–75 inclusive fan only. Minimum set for 100% two-value BVA? (s.78)|||Thermostat: < 70 sưởi, > 75 điều hoà, 70–75 (gồm cả hai đầu) chỉ quạt. Bộ tối thiểu cho 100% BVA hai giá trị? (s.78)', ['70, 75', '65, 72, 80', '69, 70, 75, 76', '70, 71, 74, 75, 76'], 2),
      q('TV diagram (Off, Stand-by, Play) and five tests: S1-Power On→S2, S2-Power Off→S1, S2-RC On→S3, S3-RC Off→S2, S3-Power Off→S1. Which is TRUE? (s.79)|||Sơ đồ TV (Tắt, Chờ, Phát) và năm test: S1-Power On→S2, S2-Power Off→S1, S2-RC On→S3, S3-RC Off→S2, S3-Power Off→S1. Câu nào ĐÚNG? (s.79)', ['They cover both valid and invalid transitions|||Chúng phủ cả chuyển đổi hợp lệ và không hợp lệ', 'They represent all possible valid transitions|||Chúng đại diện cho mọi chuyển đổi hợp lệ', 'They represent only some of the valid transitions|||Chúng chỉ đại diện một số chuyển đổi hợp lệ', 'They represent sequential pairs of transitions|||Chúng là các cặp chuyển đổi liên tiếp'], 1),
      q('Login requirement again (repeat of s.72): tests needed for 100% state transition coverage? (s.80)|||Lại yêu cầu đăng nhập (lặp s.72): cần bao nhiêu test để phủ 100% chuyển đổi? (s.80)', ['1', '2', '4', '5'], 2),
      q('ATM lets you withdraw 20, 100 or 500 chosen from a drop-down; nothing else can be entered. Partitions to test for 100% EP coverage? (s.81)|||ATM cho rút 20, 100 hoặc 500 chọn từ drop-down; không nhập được gì khác. Số vùng cần test để phủ 100% EP? (s.81)', ['1', '2', '3', '4'], 2),
      q('According to slide 4, the purpose of a test technique is to identify…|||Theo slide 4, mục đích của kỹ thuật test là xác định…', ['test conditions, test cases and test data|||test condition, test case và test data', 'defects and their root causes|||defect và nguyên nhân gốc', 'test tools and environments|||công cụ và môi trường test', 'the test schedule|||lịch test'], 0),
      q('Black-box techniques are appropriate at all levels but dominate…|||Kỹ thuật black-box phù hợp ở mọi cấp nhưng chiếm ưu thế ở…', ['component testing|||component testing', 'the higher levels (system, acceptance)|||các cấp cao (system, acceptance)', 'static testing|||kiểm thử tĩnh', 'debugging|||debugging'], 1),
      q('Savings account partitions: invalid < 0, 3%, 5%, 7%. A tester tries $50, $100, $150 … $800. EP coverage? (s.20)|||Các vùng tài khoản tiết kiệm: invalid < 0, 3%, 5%, 7%. Tester thử $50, $100, $150 … $800. Độ phủ EP? (s.20)', ['25%', '50%', '75%', '100%'], 1),
      q('Why should invalid partitions be tested one at a time?|||Vì sao vùng invalid phải được test từng cái một?', ['Because invalid values are rare|||Vì giá trị invalid hiếm gặp', 'Because one error can mask the handling of another (fault masking)|||Vì một lỗi có thể che mất việc xử lý lỗi khác (fault masking)', 'Because tools require it|||Vì công cụ bắt buộc', 'Because valid partitions cannot be combined|||Vì vùng valid không ghép được'], 1),
      q('BVA can only be used when the partition is…|||BVA chỉ dùng được khi phân vùng…', ['numeric and positive|||là số dương', 'ordered|||có thứ tự', 'invalid|||là vùng invalid', 'larger than 10 values|||có hơn 10 giá trị'], 1),
      q('Three-value BVA for the lower boundary of the range 1–100 gives…|||BVA ba giá trị cho biên dưới của khoảng 1–100 cho ra…', ['0, 1', '0, 1, 2', '1, 50, 100', '−1, 0, 1'], 1),
      q('In the loan template (slide 35), the value 99999 for the account number is…|||Trong template vay vốn (slide 35), giá trị 99999 của số tài khoản là…', ['VB3 — a valid boundary|||VB3 — biên hợp lệ', 'IB4 — an invalid boundary (5 digits)|||IB4 — biên không hợp lệ (5 chữ số)', 'VP3 — a valid partition|||VP3 — vùng hợp lệ', 'IP6 — first digit is zero|||IP6 — chữ số đầu bằng 0'], 1),
      q('Under time pressure, to find the maximum number of faults you should start with… (s.38)|||Khi gấp thời gian, muốn tìm nhiều lỗi nhất nên bắt đầu với… (s.38)', ['valid partitions only|||chỉ vùng valid', 'boundary values (VB + IB)|||giá trị biên (VB + IB)', 'invalid partitions only|||chỉ vùng invalid', 'random values|||giá trị ngẫu nhiên'], 1),
      q('Extended-entry table: Code = 1, 2 or 3 × "exp. date < now" (T/F) × "class A product" (T/F). Number of columns? (s.56)|||Bảng extended-entry: Code = 1, 2 hoặc 3 × "hết hạn < hiện tại" (T/F) × "sản phẩm loại A" (T/F). Số cột? (s.56)', ['6', '8', '12', '16'], 2),
      q('Which statement about rationalising a decision table is TRUE? (s.55)|||Câu nào về việc rút gọn decision table là ĐÚNG? (s.55)', ['It never loses any defect-finding power|||Nó không bao giờ làm giảm khả năng tìm lỗi', 'It is based on assumptions, which should be stated and may change|||Nó dựa trên giả định, giả định cần được ghi rõ và có thể thay đổi', 'It must remove every impossible rule without testing it|||Phải bỏ mọi rule bất khả mà không test', 'It is only allowed for extended-entry tables|||Chỉ được làm với bảng extended-entry'], 1),
      q('Why is a state TABLE useful in addition to a state diagram? (s.60, s.68)|||Vì sao cần BẢNG trạng thái ngoài sơ đồ trạng thái? (s.60, s.68)', ['It shows the invalid transitions that diagrams usually omit|||Nó cho thấy các chuyển đổi không hợp lệ mà sơ đồ thường bỏ qua', 'It replaces the need for test cases|||Nó thay cho test case', 'It measures code coverage|||Nó đo độ phủ code', 'It is required by the compiler|||Trình biên dịch bắt buộc'], 0),
      q('In the ATM PIN diagram, how many tests cover all transitions? (s.67)|||Trong sơ đồ PIN ATM, bao nhiêu test phủ mọi chuyển đổi? (s.67)', ['2', '3', '4', '7'], 2),
    ],
  },
};

export default {
  title: 'Chapter 4 — Test design: black-box techniques|||Chương 4 — Thiết kế test: kỹ thuật black-box',
  description: 'SWT4 slide 1–81 học từng slide: phân loại kỹ thuật, EP, BVA và bảng condition template của đề PE câu 3 (giải trọn đề FA23), decision table, state transition, use case — mọi câu hỏi tính toán trên slide đều giải từng bước và đã kiểm lại bằng script.',
  lessons: [L41, L42, L43, L44, L45, L46, QUIZ4],
};
