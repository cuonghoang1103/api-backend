/**
 * SWR302 — Software Requirements (Yêu cầu phần mềm). Kỳ 5.
 * Bám syllabus FPTU (9 CLO, 60 buổi) + giáo trình Karl Wiegers "Software Requirements"
 * + 2 chương nâng cao (Agile requirements, Prioritization & AI/ML requirements).
 * Song ngữ EN/VN realtime (khối .ml-en / .ml-vi, tiêu đề EN|||VI).
 * Sơ đồ .lz-map/.lz-flow/.lz-stack; ví dụ có lời giải + khối ★ Ngoài giáo trình.
 * Công cụ mô hình hoá → Exp Hub (draw.io / Jira / Visual Paradigm). Tiên quyết: SWE201c.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SWR302.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    academyType: 'FPT',
    courseCode: 'SWR302',
    title: 'Software Requirements',
    slug: 'software-requirements',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The engineering of software requirements: elicit, analyze, specify, validate and manage what a system must do. Functional vs non-functional requirements, stakeholders, use cases & user stories, the SRS (IEEE 830), traceability and change control.|||Kỹ nghệ yêu cầu phần mềm: khai thác, phân tích, đặc tả, thẩm định và quản lý những gì hệ thống phải làm. Yêu cầu chức năng vs phi chức năng, stakeholder, use case & user story, tài liệu SRS (IEEE 830), truy vết và kiểm soát thay đổi.',
    description: 'Môn học nền tảng về Requirements Engineering (RE) theo hướng mô hình hoá, dựa trên giáo trình kinh điển "Software Requirements" của Karl Wiegers. Bạn học trọn vòng đời yêu cầu — từ khai thác (elicitation) qua phân tích, đặc tả (SRS), thẩm định, tới quản lý thay đổi và truy vết — cùng các kỹ thuật mô hình use case, user story, domain model, DFD. Đây là bước chuyển từ "viết code" sang "hiểu đúng bài toán trước khi code". Tiên quyết: SWE201c.',
    whatYouLearn: 'Phân biệt yêu cầu chức năng/phi chức năng và ba tầng business–user–system; xác định stakeholder & user class, làm việc với product champion; chọn và thực hiện kỹ thuật elicitation (phỏng vấn, workshop, quan sát, bảng hỏi, prototyping); mô hình hoá yêu cầu bằng use case, user story, domain model, data dictionary, DFD; viết SRS chuẩn IEEE 830 với yêu cầu rõ–đủ–nhất quán–kiểm chứng được; thẩm định bằng review và acceptance criteria; quản lý yêu cầu: baseline, versioning, change control, ma trận truy vết; áp dụng requirements trong Agile và cho hệ thống AI/ML.',
    requirements: 'Tiên quyết: đạt SWE201c (Introduction to Software Engineering) hoặc SWE102/SWE202c. Cần công cụ mô hình hoá (draw.io / Visual Paradigm / BOUML) và một công cụ soạn thảo tài liệu (Microsoft Word / Google Docs). Nên biết dùng Jira/Confluence để theo dõi yêu cầu.',
    documentsNote: 'Giáo trình chính: Software Requirements, 3rd ed. — Karl Wiegers & Joy Beatty. Bổ trợ: More About Software Requirements (Wiegers) · The Software Requirements Memory Jogger · IEEE Std 830-1998 (SRS template) · IEEE/ISO/IEC 29148. Công cụ: Visual Paradigm Community / BOUML / draw.io (mô hình UML & DFD), Jira + Confluence (quản lý & truy vết). Kèm file syllabus gốc SWR302.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, vòng đời yêu cầu, điều kiện qua môn, chuẩn đầu ra và công cụ.',
      lessons: [
        {
          title: '0.1 — About SWR302 & the RE process map|||0.1 — Giới thiệu SWR302 & bản đồ quy trình RE',
          slug: 'swr302-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Requirements Engineering là gì, vì sao quan trọng, và bản đồ toàn bộ vòng đời yêu cầu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About SWR302 — Software Requirements</h2>
<p class="lead">Most software projects don't fail because the code was slow or the framework was wrong. They fail because the team <strong>built the wrong thing</strong> — they never fully understood what the customer actually needed. SWR302 is the course that fixes that: it teaches <strong>Requirements Engineering (RE)</strong>, the discipline of discovering, writing down and managing what a system must do <em>before</em> and <em>while</em> you build it.</p>
<p>You will not write much code here. Instead you learn to ask the right questions, model the answers, and turn vague wishes into precise, testable statements a development team can trust. This is the skill of the <strong>Business Analyst (BA)</strong> and of every senior engineer who wants requirements they can actually implement.</p>
<h3>The five activities of Requirements Engineering</h3>
<p>All 60 university sessions revolve around one process. Requirements flow through five activities — the first four <strong>develop</strong> requirements, the last one <strong>manages</strong> them across the whole project life:</p>
<div class="lz-map">
  <div class="lz-stage">Requirements development</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Elicitation</div><div class="lz-nsub">Discover needs from stakeholders — interviews, workshops, observation</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Analysis</div><div class="lz-nsub">Understand, model &amp; resolve conflicts — use cases, domain model, DFD</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Specification</div><div class="lz-nsub">Write it down clearly — the SRS (IEEE 830)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Validation</div><div class="lz-nsub">Confirm it's the right thing — reviews, prototypes, acceptance criteria</div></div></div>
  <div class="lz-stage">Across the whole project</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Requirements management</div><div class="lz-nsub">Baseline, version, trace &amp; control change</div></div></div>
</div>
<p>Notice management wraps the other four: even after you specify and validate, requirements keep <em>changing</em>, and you must trace and control those changes. That loop is the heart of the course.</p>
<div class="callout ok">The golden rule of this field, from Karl Wiegers: <strong>"The hardest single part of building a software system is deciding precisely what to build."</strong> SWR302 is 100% about that decision.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-requirements%2Flearn&reflabel=SWR302" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Modeling tools — draw.io, Visual Paradigm, Jira</span><span class="lc-sub">Guides for drawing use cases &amp; DFDs and tracking requirements in Jira/Confluence — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu SWR302 — Yêu cầu phần mềm</h2>
<p class="lead">Phần lớn dự án phần mềm thất bại không phải vì code chậm hay chọn sai framework. Chúng thất bại vì đội ngũ <strong>làm sai thứ cần làm</strong> — họ chưa bao giờ hiểu đúng khách hàng thật sự cần gì. SWR302 sinh ra để chữa điều đó: môn học dạy <strong>Kỹ nghệ yêu cầu (Requirements Engineering — RE)</strong>, bộ môn khám phá, ghi lại và quản lý những gì hệ thống phải làm <em>trước</em> và <em>trong khi</em> bạn xây dựng nó.</p>
<p>Ở đây bạn sẽ không viết nhiều code. Thay vào đó, bạn học cách đặt đúng câu hỏi, mô hình hoá câu trả lời, và biến những mong muốn mơ hồ thành các phát biểu chính xác, kiểm chứng được để đội phát triển tin cậy. Đây là kỹ năng của <strong>Business Analyst (BA)</strong> và của mọi kỹ sư giỏi muốn có yêu cầu đủ rõ để thực thi.</p>
<h3>Năm hoạt động của Kỹ nghệ yêu cầu</h3>
<p>Toàn bộ 60 buổi của trường xoay quanh một quy trình. Yêu cầu chảy qua năm hoạt động — bốn cái đầu <strong>phát triển</strong> yêu cầu, cái cuối <strong>quản lý</strong> chúng suốt vòng đời dự án:</p>
<div class="lz-map">
  <div class="lz-stage">Phát triển yêu cầu (Requirements development)</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Khai thác (Elicitation)</div><div class="lz-nsub">Khám phá nhu cầu từ stakeholder — phỏng vấn, workshop, quan sát</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Phân tích (Analysis)</div><div class="lz-nsub">Hiểu, mô hình hoá &amp; giải xung đột — use case, domain model, DFD</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Đặc tả (Specification)</div><div class="lz-nsub">Ghi lại rõ ràng — tài liệu SRS (IEEE 830)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Thẩm định (Validation)</div><div class="lz-nsub">Xác nhận đúng thứ cần — review, prototype, acceptance criteria</div></div></div>
  <div class="lz-stage">Xuyên suốt cả dự án</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Quản lý yêu cầu (Management)</div><div class="lz-nsub">Baseline, đánh phiên bản, truy vết &amp; kiểm soát thay đổi</div></div></div>
</div>
<p>Để ý: quản lý bao quanh bốn hoạt động kia — kể cả sau khi đặc tả và thẩm định, yêu cầu vẫn liên tục <em>thay đổi</em>, và bạn phải truy vết, kiểm soát các thay đổi đó. Vòng lặp ấy chính là trái tim của môn học.</p>
<div class="callout ok">Quy tắc vàng của lĩnh vực này, theo Karl Wiegers: <strong>"Phần khó nhất khi xây một hệ thống phần mềm là quyết định chính xác cần xây cái gì."</strong> SWR302 100% xoay quanh quyết định đó.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-requirements%2Flearn&reflabel=SWR302" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Công cụ mô hình hoá — draw.io, Visual Paradigm, Jira</span><span class="lc-sub">Hướng dẫn vẽ use case &amp; DFD và theo dõi yêu cầu trong Jira/Confluence — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'swr302-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tín chỉ, tiên quyết, điểm sàn qua môn và trọng số từng cột điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">Know the rules before the match. The information below comes straight from the university's official syllabus (Decision 377/QĐ-ĐHFPT).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + final exam + ~103h self-study</small></span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60 sessions <small>45 min each</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">SWE201c <small>(or SWE102 / SWE202c)</small></span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Assignment (on-going)</td><td>20%</td><td>Team project: build a full requirements document (CLO2–9)</td></tr>
    <tr><td>LAB (on-going)</td><td>10%</td><td>Draw context / swimlane / state diagrams &amp; models (CLO5–6)</td></tr>
    <tr><td>Progress Test ×3</td><td>20%</td><td>3 in-course tests, ~30 min each (CLO1–9)</td></tr>
    <tr><td><strong>Practical Exam</strong> (final)</td><td><strong>25%</strong></td><td>Hands-on modeling / analysis exam, 85 min (CLO2–8)</td></tr>
    <tr><td><strong>Theory Exam</strong> (final)</td><td><strong>25%</strong></td><td>Multiple choice / written, 60 min (CLO1–9)</td></tr>
  </tbody>
</table>
<div class="callout warn">Two <strong>hard blockers</strong> even with a high coursework score: (1) missing more than 20% of sessions = <strong>barred from the final exam</strong>; (2) the special rule — if <strong>4 ≤ Theory Exam &lt; 5</strong> AND <strong>4 ≤ Practical Exam &lt; 5</strong> AND the final result &lt; 5, you may re-sit only certain components. In short: both final-exam parts should reach <strong>≥ 4.0</strong> or the pass is at risk.</div>
<div class="note-ct">The Practical Exam (25%) tests <strong>doing</strong>: given a scenario, you elicit/analyze and produce a use case, a model or a set of well-written requirements under time pressure. Rote memorisation won't save you — do every LAB and the Assignment so your hands are fast at writing requirements and drawing models on exam day.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Nắm luật chơi trước khi vào trận. Dưới đây là thông tin lấy thẳng từ syllabus chính thức của trường (Quyết định 377/QĐ-ĐHFPT).</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lớp + thi + ~103h tự học</small></span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60 buổi <small>45 phút/buổi</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">SWE201c <small>(hoặc SWE102 / SWE202c)</small></span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi TB ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% buổi</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Assignment (quá trình)</td><td>20%</td><td>Bài tập nhóm: xây dựng bộ tài liệu yêu cầu hoàn chỉnh (CLO2–9)</td></tr>
    <tr><td>LAB (quá trình)</td><td>10%</td><td>Vẽ context / swimlane / state diagram &amp; mô hình (CLO5–6)</td></tr>
    <tr><td>Progress Test ×3</td><td>20%</td><td>3 bài kiểm tra giữa chặng, ~30 phút/bài (CLO1–9)</td></tr>
    <tr><td><strong>Practical Exam</strong> (cuối kỳ)</td><td><strong>25%</strong></td><td>Thi thực hành mô hình hoá / phân tích, 85 phút (CLO2–8)</td></tr>
    <tr><td><strong>Theory Exam</strong> (cuối kỳ)</td><td><strong>25%</strong></td><td>Trắc nghiệm / tự luận, 60 phút (CLO1–9)</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai điều kiện <strong>chặn cứng</strong> dù điểm quá trình cao: (1) vắng quá 20% buổi = <strong>cấm thi cuối kỳ</strong>; (2) quy định đặc biệt — nếu <strong>4 ≤ Theory Exam &lt; 5</strong> VÀ <strong>4 ≤ Practical Exam &lt; 5</strong> VÀ kết quả cuối &lt; 5 thì chỉ được thi lại một số phần. Nói gọn: cả hai phần thi cuối kỳ nên đạt <strong>≥ 4.0</strong> nếu không việc qua môn bị đe doạ.</div>
<div class="note-ct">Practical Exam (25%) kiểm tra khả năng <strong>làm</strong>: cho một tình huống, bạn khai thác/phân tích và tạo ra một use case, một mô hình hoặc một bộ yêu cầu viết tốt trong thời gian giới hạn. Học thuộc không cứu được — hãy làm hết LAB và Assignment để tay quen viết yêu cầu và vẽ mô hình, đến ngày thi mới nhanh.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning Outcomes (CLOs) & roadmap|||0.3 — Chuẩn đầu ra (CLO) & lộ trình 60 buổi',
          slug: 'swr302-chuan-dau-ra',
          type: 'VIDEO',
          description: '9 chuẩn đầu ra của môn và cách chúng gom vào từng chương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>9 course learning outcomes (CLOs) &amp; roadmap</h2>
<p class="lead">A "Course Learning Outcome" (CLO) is what you <strong>must be able to do</strong> after the course. The exams follow these CLOs closely — knowing the CLO map tells you what you'll be tested on.</p>
<table>
  <thead><tr><th>CLO</th><th>You will be able to</th><th>Chapter</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Understand RE principles &amp; techniques</td><td>1</td></tr>
    <tr><td>CLO2</td><td>Choose appropriate elicitation techniques</td><td>2–3</td></tr>
    <tr><td>CLO3</td><td>Use validation techniques to critically evaluate requirements</td><td>6</td></tr>
    <tr><td>CLO4</td><td>Analyze system requirements &amp; produce specifications</td><td>4–5</td></tr>
    <tr><td>CLO5</td><td>Model requirements with various notations (domain, use case)</td><td>4</td></tr>
    <tr><td>CLO6</td><td>Design solutions using an object-oriented strategy</td><td>8</td></tr>
    <tr><td>CLO7</td><td>Prepare &amp; deliver structured technical reports</td><td>3, 5</td></tr>
    <tr><td>CLO8</td><td>Reduce risk through prototyping</td><td>6, 8</td></tr>
    <tr><td>CLO9</td><td>Manage requirements: change, trace, improve</td><td>7</td></tr>
  </tbody>
</table>
<div class="callout"><b>How the roadmap flows:</b> Ch1 (why requirements) → Ch2–3 (who + how to elicit) → Ch4–5 (analyze &amp; specify) → <em>Progress Test 1</em> → Ch6 (validate) → Ch7 (manage) → Ch8 (design &amp; prototype) → <em>Progress Test 2</em> → advanced Ch9 (Agile) &amp; Ch10 (prioritization + AI/ML requirements) → <em>Progress Test 3</em>. Each chapter maps directly to one or more CLOs above.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>9 chuẩn đầu ra (CLO) &amp; lộ trình</h2>
<p class="lead">"Chuẩn đầu ra" (Course Learning Outcome) là những gì bạn <strong>phải làm được</strong> sau môn. Đề thi bám sát các CLO này — nắm được bản đồ CLO là biết mình sẽ bị hỏi gì.</p>
<table>
  <thead><tr><th>CLO</th><th>Bạn sẽ làm được</th><th>Chương</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Hiểu nguyên lý &amp; kỹ thuật RE</td><td>1</td></tr>
    <tr><td>CLO2</td><td>Chọn kỹ thuật khai thác yêu cầu phù hợp</td><td>2–3</td></tr>
    <tr><td>CLO3</td><td>Dùng kỹ thuật thẩm định để đánh giá yêu cầu</td><td>6</td></tr>
    <tr><td>CLO4</td><td>Phân tích yêu cầu hệ thống &amp; tạo đặc tả</td><td>4–5</td></tr>
    <tr><td>CLO5</td><td>Mô hình hoá yêu cầu bằng nhiều ký pháp (domain, use case)</td><td>4</td></tr>
    <tr><td>CLO6</td><td>Thiết kế giải pháp theo chiến lược hướng đối tượng</td><td>8</td></tr>
    <tr><td>CLO7</td><td>Soạn &amp; trình bày báo cáo kỹ thuật có cấu trúc</td><td>3, 5</td></tr>
    <tr><td>CLO8</td><td>Giảm rủi ro nhờ prototyping</td><td>6, 8</td></tr>
    <tr><td>CLO9</td><td>Quản lý yêu cầu: thay đổi, truy vết, cải tiến</td><td>7</td></tr>
  </tbody>
</table>
<div class="callout"><b>Lộ trình chảy thế nào:</b> Ch1 (vì sao cần yêu cầu) → Ch2–3 (ai + khai thác ra sao) → Ch4–5 (phân tích &amp; đặc tả) → <em>Progress Test 1</em> → Ch6 (thẩm định) → Ch7 (quản lý) → Ch8 (thiết kế &amp; prototype) → <em>Progress Test 2</em> → nâng cao Ch9 (Agile) &amp; Ch10 (ưu tiên + yêu cầu AI/ML) → <em>Progress Test 3</em>. Mỗi chương ánh xạ trực tiếp tới một hoặc nhiều CLO ở trên.</div>
</div>
`,
        },
        {
          title: '0.4 — Materials, tools & submission|||0.4 — Tài liệu, công cụ & cách nộp bài',
          slug: 'swr302-tai-lieu-cong-cu',
          type: 'DOCUMENT',
          description: 'Giáo trình, công cụ mô hình hoá, và nơi luyện tập.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials, tools &amp; where to practice</h2>
<h3>Textbooks</h3>
<ul>
  <li><strong>Software Requirements</strong> (3rd ed.) — Karl Wiegers &amp; Joy Beatty (main textbook, the field's classic).</li>
  <li><strong>More About Software Requirements: Thorny Issues and Practical Advice</strong> — Karl Wiegers.</li>
  <li><strong>The Software Requirements Memory Jogger</strong> — a pocket guide for teams.</li>
  <li>Standards: <strong>IEEE Std 830-1998</strong> (SRS template) and its successor <strong>ISO/IEC/IEEE 29148</strong>.</li>
</ul>
<h3>Tools</h3>
<ul>
  <li><strong>Visual Paradigm Community</strong> or <strong>BOUML</strong> — draw UML (use case, class/domain) &amp; DFD models.</li>
  <li><strong>draw.io</strong> (diagrams.net) — free, browser-based diagramming; great for context, swimlane and state diagrams.</li>
  <li><strong>Jira + Confluence</strong> — record, prioritize, trace and manage requirements in a real team workflow.</li>
  <li>Microsoft Office / Google Docs — write the SRS and reports.</li>
</ul>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-requirements%2Flearn&reflabel=SWR302" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up your modeling tools</span><span class="lc-sub">Install &amp; use draw.io / Visual Paradigm and track requirements in Jira — step-by-step on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card exphub" href="/exp-hub/swr302-cong-cu-yeu-cau?ref=%2Fcourses%2Fsoftware-requirements%2Flearn&reflabel=SWR302" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Tools guide — draw.io, StarUML, Jira &amp; SRS template</span><span class="lc-sub">Exp Hub · modeling &amp; requirements tools.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout">📎 Attached to this lesson: <strong>the original SWR302.pdf syllabus</strong> — the university's official version, for reference.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu, công cụ &amp; nơi luyện tập</h2>
<h3>Giáo trình</h3>
<ul>
  <li><strong>Software Requirements</strong> (bản 3) — Karl Wiegers &amp; Joy Beatty (giáo trình chính, kinh điển của ngành).</li>
  <li><strong>More About Software Requirements: Thorny Issues and Practical Advice</strong> — Karl Wiegers.</li>
  <li><strong>The Software Requirements Memory Jogger</strong> — sổ tay bỏ túi cho đội nhóm.</li>
  <li>Tiêu chuẩn: <strong>IEEE Std 830-1998</strong> (mẫu SRS) và bản kế nhiệm <strong>ISO/IEC/IEEE 29148</strong>.</li>
</ul>
<h3>Công cụ</h3>
<ul>
  <li><strong>Visual Paradigm Community</strong> hoặc <strong>BOUML</strong> — vẽ UML (use case, class/domain) &amp; mô hình DFD.</li>
  <li><strong>draw.io</strong> (diagrams.net) — miễn phí, chạy trên trình duyệt; tuyệt cho context, swimlane, state diagram.</li>
  <li><strong>Jira + Confluence</strong> — ghi, ưu tiên, truy vết và quản lý yêu cầu theo quy trình đội nhóm thật.</li>
  <li>Microsoft Office / Google Docs — viết SRS và báo cáo.</li>
</ul>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-requirements%2Flearn&reflabel=SWR302" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài đặt công cụ mô hình hoá</span><span class="lc-sub">Cài &amp; dùng draw.io / Visual Paradigm và theo dõi yêu cầu trong Jira — từng bước trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card exphub" href="/exp-hub/swr302-cong-cu-yeu-cau?ref=%2Fcourses%2Fsoftware-requirements%2Flearn&reflabel=SWR302" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Bộ công cụ — draw.io, StarUML, Jira &amp; khung SRS</span><span class="lc-sub">Exp Hub · công cụ vẽ mô hình &amp; viết yêu cầu.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout">📎 File đính kèm mục này: <strong>syllabus gốc SWR302.pdf</strong> — bản chính thức của trường, dùng để đối chiếu.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — CƠ BẢN VỀ YÊU CẦU PHẦN MỀM ══════════════════ */
    {
      title: 'Chapter 1 — Essentials of Software Requirements|||Chương 1 — Cơ bản về yêu cầu phần mềm',
      description: 'Yêu cầu là gì; chức năng vs phi chức năng; ba tầng business–user–system; vì sao RE quan trọng.',
      lessons: [
        {
          title: '1.1 — What is a requirement? Functional vs non-functional|||1.1 — Yêu cầu là gì? Chức năng vs phi chức năng',
          slug: 'swr302-1-1-yeu-cau-la-gi',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Định nghĩa yêu cầu, phân biệt yêu cầu chức năng và phi chức năng, ba tầng business/user/system.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>What exactly is a "requirement"?</h2>
<p class="lead">A <strong>requirement</strong> is a statement of something a system <em>must do</em> or a quality it <em>must have</em> to satisfy a stakeholder need. It describes the <strong>what</strong>, not the <strong>how</strong>. "The system shall let a member reset their password by email" is a requirement; "use a Redis token store with a 15-minute TTL" is a design decision.</p>
<h3>Three levels of requirements</h3>
<p>Wiegers organizes requirements into three levels that flow top-down — from why we build, to who uses it, to what the software concretely does:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Business requirements — WHY</div><div class="lz-ld">The high-level business objective &amp; value. "Reduce support tickets about forgotten passwords by 40%." Lives in the Vision &amp; Scope document.</div></div>
  <div class="lz-layer"><div class="lz-lt">User requirements — WHO &amp; WHAT GOAL</div><div class="lz-ld">Goals users must accomplish. "A member can recover access to their account without contacting support." Captured as use cases / user stories.</div></div>
  <div class="lz-layer"><div class="lz-lt">System / functional requirements — WHAT THE SOFTWARE DOES</div><div class="lz-ld">Concrete behavior the developer builds. "The system shall send a password-reset link valid for 15 minutes to the member's registered email." Lives in the SRS.</div></div>
</div>
<h3>Functional vs non-functional requirements</h3>
<table>
  <thead><tr><th></th><th>Functional (FR)</th><th>Non-functional (NFR) — quality attributes</th></tr></thead>
  <tbody>
    <tr><td>Describes</td><td>What the system <em>does</em> — a behavior, feature, calculation</td><td>How <em>well</em> it does it — a quality or constraint</td></tr>
    <tr><td>Question</td><td>"What must happen?"</td><td>"How fast / secure / usable / available?"</td></tr>
    <tr><td>Example</td><td>"The system shall let the user upload an avatar image."</td><td>"An avatar upload of ≤ 5 MB shall complete within 3 seconds on a 10 Mbps link."</td></tr>
  </tbody>
</table>
<p>Common NFR categories (remember with the word "quality attributes"): <strong>Performance</strong>, <strong>Security</strong>, <strong>Usability</strong>, <strong>Reliability / Availability</strong>, <strong>Scalability</strong>, <strong>Maintainability</strong>, <strong>Portability</strong>. NFRs are where projects quietly fail — teams write the features but forget "it must handle 1,000 concurrent users."</p>
<div class="pitfall"><b>Requirement vs design leak.</b> Beginners write "the system shall store users in a PostgreSQL table" — that names a technology, i.e. a design choice, not a need. Keep requirements <em>solution-free</em> so designers have room to choose the best implementation. Ask: "would this still be true if we built it a completely different way?"</div>
<h3>Ví dụ có lời giải · Worked example (classify these requirements)</h3>
<p>Label each of the following as Business (B), User (U), Functional (F) or Non-functional (N):</p>
<div class="out"><b>Statements &amp; answers:</b>
<br>1. "Cut checkout abandonment by 25% this year." → <b>B</b> (business objective, measurable value)
<br>2. "A shopper can pay for a cart with a saved card." → <b>U</b> (a user goal / use case)
<br>3. "The system shall mask all but the last 4 digits of a stored card." → <b>F</b> (concrete behavior)
<br>4. "Payment confirmation shall appear within 2 seconds for 95% of transactions." → <b>N</b> (performance quality attribute)</div>
<p>Notice how one business goal (1) drives a user goal (2), which is realized by functional behavior (3) constrained by a quality attribute (4). That top-down chain is exactly how a good requirements document reads.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "shall / should / may" convention (RFC 2119).</b> Professional requirements use precise modal verbs: <b>shall</b> = mandatory, <b>should</b> = recommended but optional, <b>may</b> = permitted/optional. Never write "the system will handle errors nicely" — "will" and "nicely" are vague. Reserving "shall" for true obligations lets a reader instantly separate the must-haves from the nice-to-haves, and makes each requirement individually testable.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>"Yêu cầu" chính xác là gì?</h2>
<p class="lead">Một <strong>yêu cầu (requirement)</strong> là phát biểu về điều hệ thống <em>phải làm</em> hoặc phẩm chất nó <em>phải có</em> để thoả mãn nhu cầu của stakeholder. Nó mô tả <strong>cái gì (what)</strong>, không phải <strong>làm thế nào (how)</strong>. "Hệ thống phải cho thành viên đặt lại mật khẩu qua email" là yêu cầu; "dùng kho token Redis với TTL 15 phút" là quyết định thiết kế.</p>
<h3>Ba tầng yêu cầu</h3>
<p>Wiegers chia yêu cầu thành ba tầng chảy từ trên xuống — từ vì sao xây, tới ai dùng, tới phần mềm làm gì cụ thể:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Business requirement — VÌ SAO</div><div class="lz-ld">Mục tiêu &amp; giá trị kinh doanh cấp cao. "Giảm 40% số ticket hỗ trợ về quên mật khẩu." Nằm trong tài liệu Vision &amp; Scope.</div></div>
  <div class="lz-layer"><div class="lz-lt">User requirement — AI &amp; MỤC TIÊU GÌ</div><div class="lz-ld">Mục tiêu người dùng cần đạt. "Thành viên khôi phục được quyền truy cập tài khoản mà không cần liên hệ hỗ trợ." Ghi lại bằng use case / user story.</div></div>
  <div class="lz-layer"><div class="lz-lt">System / functional requirement — PHẦN MỀM LÀM GÌ</div><div class="lz-ld">Hành vi cụ thể lập trình viên xây. "Hệ thống phải gửi link đặt lại mật khẩu có hiệu lực 15 phút tới email đã đăng ký của thành viên." Nằm trong SRS.</div></div>
</div>
<h3>Yêu cầu chức năng vs phi chức năng</h3>
<table>
  <thead><tr><th></th><th>Chức năng (FR)</th><th>Phi chức năng (NFR) — thuộc tính chất lượng</th></tr></thead>
  <tbody>
    <tr><td>Mô tả</td><td>Hệ thống <em>làm gì</em> — một hành vi, tính năng, phép tính</td><td><em>Tốt tới đâu</em> — một chất lượng hoặc ràng buộc</td></tr>
    <tr><td>Câu hỏi</td><td>"Phải xảy ra điều gì?"</td><td>"Nhanh / an toàn / dễ dùng / sẵn sàng tới đâu?"</td></tr>
    <tr><td>Ví dụ</td><td>"Hệ thống phải cho người dùng tải lên ảnh đại diện."</td><td>"Ảnh đại diện ≤ 5 MB phải tải xong trong 3 giây với đường truyền 10 Mbps."</td></tr>
  </tbody>
</table>
<p>Các nhóm NFR thường gặp (nhớ bằng cụm "thuộc tính chất lượng"): <strong>Hiệu năng</strong>, <strong>Bảo mật</strong>, <strong>Khả dụng (dễ dùng)</strong>, <strong>Độ tin cậy / Sẵn sàng</strong>, <strong>Khả năng mở rộng</strong>, <strong>Khả năng bảo trì</strong>, <strong>Khả chuyển</strong>. NFR là nơi dự án âm thầm chết — đội làm xong tính năng nhưng quên "phải chịu được 1.000 người dùng đồng thời".</p>
<div class="pitfall"><b>Yêu cầu bị rò rỉ thiết kế.</b> Người mới hay viết "hệ thống phải lưu người dùng vào bảng PostgreSQL" — câu này nêu công nghệ, tức lựa chọn thiết kế, không phải nhu cầu. Giữ yêu cầu <em>không dính giải pháp</em> để người thiết kế còn không gian chọn cách làm tốt nhất. Hãy hỏi: "câu này còn đúng không nếu ta xây bằng một cách hoàn toàn khác?"</div>
<h3>Ví dụ có lời giải · Phân loại các yêu cầu sau</h3>
<p>Gán nhãn mỗi câu dưới đây là Business (B), User (U), Functional (F) hay Non-functional (N):</p>
<div class="out"><b>Câu &amp; đáp án:</b>
<br>1. "Giảm 25% tỉ lệ bỏ giỏ khi thanh toán trong năm nay." → <b>B</b> (mục tiêu kinh doanh, đo được)
<br>2. "Người mua thanh toán được giỏ hàng bằng thẻ đã lưu." → <b>U</b> (mục tiêu người dùng / use case)
<br>3. "Hệ thống phải che tất cả trừ 4 số cuối của thẻ đã lưu." → <b>F</b> (hành vi cụ thể)
<br>4. "Xác nhận thanh toán phải hiện trong 2 giây cho 95% giao dịch." → <b>N</b> (thuộc tính chất lượng hiệu năng)</div>
<p>Hãy để ý một mục tiêu kinh doanh (1) dẫn ra một mục tiêu người dùng (2), được hiện thực bằng hành vi chức năng (3) và bị ràng buộc bởi một thuộc tính chất lượng (4). Chuỗi trên-xuống đó chính là cách một tài liệu yêu cầu tốt được đọc.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Quy ước "shall / should / may" (RFC 2119).</b> Yêu cầu chuyên nghiệp dùng động từ tình thái chính xác: <b>shall</b> = bắt buộc, <b>should</b> = khuyến nghị nhưng tuỳ chọn, <b>may</b> = được phép/tuỳ chọn. Đừng bao giờ viết "hệ thống sẽ xử lý lỗi một cách mượt mà" — "sẽ" và "mượt mà" đều mơ hồ. Dành riêng "shall" cho nghĩa vụ thật giúp người đọc phân biệt ngay must-have với nice-to-have, và làm mỗi yêu cầu kiểm chứng được độc lập.</div>
</div>
`,
        },
        {
          title: '1.2 — Why RE matters: the cost of bad requirements|||1.2 — Vì sao RE quan trọng: cái giá của yêu cầu tồi',
          slug: 'swr302-1-2-vi-sao-re-quan-trong',
          type: 'VIDEO',
          description: 'Chi phí sửa lỗi tăng theo pha (Boehm 1:10:100), hậu quả của yêu cầu tồi, lợi ích của RE chất lượng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Why requirements engineering matters</h2>
<p class="lead">Requirements errors are the <strong>most expensive</strong> defects in software — not because they're hard to fix technically, but because they're discovered <em>late</em>, after everything built on top of them must also change. Getting requirements right is the highest-leverage thing a team can do.</p>
<h3>The cost of fixing a defect grows by phase</h3>
<p>Barry Boehm's research gave the field its most famous number: the cost to fix a requirements defect multiplies roughly <strong>10× per phase</strong> it survives undetected — the "1:10:100" rule.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">×1</div><div class="lz-t">Requirements</div><div class="lz-d">Fix now: edit a sentence</div></div>
  <div class="lz-step"><div class="lz-k">×5</div><div class="lz-t">Design</div><div class="lz-d">Rework a diagram</div></div>
  <div class="lz-step"><div class="lz-k">×10</div><div class="lz-t">Coding</div><div class="lz-d">Rewrite modules</div></div>
  <div class="lz-step"><div class="lz-k">×20</div><div class="lz-t">Testing</div><div class="lz-d">Re-test everything</div></div>
  <div class="lz-step"><div class="lz-k">×100+</div><div class="lz-t">Production</div><div class="lz-d">Patch live, angry users, lost data</div></div>
</div>
<p>A misunderstanding caught in a 30-minute requirements review might cost pennies. The same misunderstanding found by a customer after launch can cost a hundred times more — plus reputation. This single curve is the economic justification for the entire discipline.</p>
<h3>When bad requirements happen to good people</h3>
<p>Typical consequences Wiegers lists when requirements are neglected:</p>
<ul>
  <li><strong>Scope creep &amp; rework</strong> — features balloon because no one agreed what "done" means.</li>
  <li><strong>Wrong product</strong> — the team builds exactly what was written, but it isn't what the customer needed.</li>
  <li><strong>Schedule &amp; budget overrun</strong> — endless "just one more change."</li>
  <li><strong>Frustrated users &amp; a mistrustful client</strong> — the demo reveals the gap too late.</li>
</ul>
<h3>Ví dụ có lời giải · Worked example (put a number on it)</h3>
<p>A team misreads a rule: they build "apply the discount to the subtotal" when the business meant "apply it after tax." Compare fixing it at two phases.</p>
<div class="out"><b>If caught in a requirements review:</b> analyst edits one line in the SRS → ~15 minutes, cost ≈ 1 unit.
<br><b>If caught in production:</b> bug report → reproduce → change code → re-test checkout → hotfix deploy → <em>refund customers who were overcharged</em> → ~2 weeks of several people + trust damage, cost ≈ 100+ units.
<br><b>Lesson:</b> the 15-minute review was the cheapest insurance the project ever bought.</div>
<div class="callout ok"><b>Benefits of a high-quality requirements process:</b> fewer defects, less rework, more accurate estimates, a shared understanding between customer and team, and a baseline you can test against. RE doesn't slow projects down — skipping it does.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Standish "CHAOS" findings.</b> Year after year, industry studies (Standish Group CHAOS reports) rank <b>incomplete requirements</b>, <b>lack of user involvement</b> and <b>changing requirements</b> among the top causes of project failure — consistently above technical issues. The message: software projects are killed by fuzzy <em>problems</em> far more often than by hard <em>solutions</em>. That's why a company will pay a skilled BA handsomely to get the requirements right.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Vì sao kỹ nghệ yêu cầu quan trọng</h2>
<p class="lead">Lỗi yêu cầu là loại lỗi <strong>đắt nhất</strong> trong phần mềm — không phải vì khó sửa về mặt kỹ thuật, mà vì bị phát hiện <em>muộn</em>, sau khi mọi thứ xây bên trên nó cũng phải đổi theo. Làm đúng yêu cầu là việc có đòn bẩy cao nhất mà một đội có thể làm.</p>
<h3>Chi phí sửa lỗi tăng theo pha</h3>
<p>Nghiên cứu của Barry Boehm cho ngành con số nổi tiếng nhất: chi phí sửa một lỗi yêu cầu nhân lên khoảng <strong>10 lần mỗi pha</strong> nó sống sót mà không bị phát hiện — quy tắc "1:10:100".</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">×1</div><div class="lz-t">Yêu cầu</div><div class="lz-d">Sửa ngay: sửa một câu</div></div>
  <div class="lz-step"><div class="lz-k">×5</div><div class="lz-t">Thiết kế</div><div class="lz-d">Sửa lại một sơ đồ</div></div>
  <div class="lz-step"><div class="lz-k">×10</div><div class="lz-t">Lập trình</div><div class="lz-d">Viết lại module</div></div>
  <div class="lz-step"><div class="lz-k">×20</div><div class="lz-t">Kiểm thử</div><div class="lz-d">Test lại toàn bộ</div></div>
  <div class="lz-step"><div class="lz-k">×100+</div><div class="lz-t">Vận hành</div><div class="lz-d">Vá nóng, người dùng giận, mất dữ liệu</div></div>
</div>
<p>Một hiểu lầm bắt được trong buổi review yêu cầu 30 phút có thể tốn vài xu. Cũng hiểu lầm ấy do khách hàng phát hiện sau khi ra mắt có thể tốn gấp trăm lần — cộng thêm uy tín. Chỉ riêng đường cong này là biện minh kinh tế cho toàn bộ bộ môn.</p>
<h3>Khi yêu cầu tồi xảy đến với người tốt</h3>
<p>Các hậu quả điển hình Wiegers liệt kê khi yêu cầu bị xem nhẹ:</p>
<ul>
  <li><strong>Scope creep &amp; làm lại</strong> — tính năng phình to vì không ai chốt "xong" nghĩa là gì.</li>
  <li><strong>Sai sản phẩm</strong> — đội xây đúng y những gì được viết, nhưng đó không phải thứ khách cần.</li>
  <li><strong>Vỡ tiến độ &amp; ngân sách</strong> — "chỉ thêm một thay đổi nữa thôi" vô tận.</li>
  <li><strong>Người dùng bực bội &amp; khách mất niềm tin</strong> — buổi demo phơi bày khoảng cách quá muộn.</li>
</ul>
<h3>Ví dụ có lời giải · Đặt một con số vào</h3>
<p>Một đội hiểu nhầm quy tắc: họ xây "áp giảm giá lên tổng phụ (subtotal)" trong khi doanh nghiệp muốn "áp sau thuế". So sánh sửa lỗi ở hai pha.</p>
<div class="out"><b>Nếu bắt được lúc review yêu cầu:</b> BA sửa một dòng trong SRS → ~15 phút, chi phí ≈ 1 đơn vị.
<br><b>Nếu bắt được ở vận hành:</b> báo lỗi → tái hiện → sửa code → test lại thanh toán → deploy vá nóng → <em>hoàn tiền cho khách bị thu quá</em> → ~2 tuần công của vài người + tổn hại niềm tin, chi phí ≈ 100+ đơn vị.
<br><b>Bài học:</b> buổi review 15 phút là khoản bảo hiểm rẻ nhất dự án từng mua.</div>
<div class="callout ok"><b>Lợi ích của quy trình yêu cầu chất lượng cao:</b> ít lỗi hơn, ít làm lại, ước lượng chính xác hơn, hiểu biết chung giữa khách và đội, và một baseline để kiểm thử dựa vào. RE không làm dự án chậm lại — bỏ qua nó mới làm chậm.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Phát hiện "CHAOS" của Standish.</b> Năm này qua năm khác, các nghiên cứu ngành (báo cáo CHAOS của Standish Group) xếp <b>yêu cầu thiếu sót</b>, <b>thiếu sự tham gia của người dùng</b> và <b>yêu cầu thay đổi</b> vào nhóm nguyên nhân hàng đầu gây thất bại dự án — luôn cao hơn các vấn đề kỹ thuật. Thông điệp: dự án phần mềm bị giết bởi <em>bài toán</em> mờ nhạt nhiều hơn nhiều so với <em>giải pháp</em> khó. Đó là lý do doanh nghiệp sẵn sàng trả hậu cho một BA giỏi để làm đúng yêu cầu.</div>
</div>
`,
        },
        {
          title: 'Quiz 1 — Essentials of Software Requirements|||Quiz 1 — Cơ bản về yêu cầu phần mềm',
          slug: 'swr302-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh chương 1: định nghĩa, phân loại, chi phí lỗi.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'A requirement should describe...|||Một yêu cầu nên mô tả...', options: ['The technology to use|||Công nghệ dùng để làm', 'What the system must do, not how|||Cái hệ thống phải làm, không phải làm thế nào', 'The database schema|||Lược đồ cơ sở dữ liệu', 'The programming language|||Ngôn ngữ lập trình'], correctIndex: 1, points: 1 },
              { question: '"Response time shall be under 2 seconds" is a...|||"Thời gian phản hồi phải dưới 2 giây" là yêu cầu...', options: ['Functional requirement|||Chức năng', 'Non-functional requirement (quality attribute)|||Phi chức năng (thuộc tính chất lượng)', 'Business requirement|||Kinh doanh', 'User story|||User story'], correctIndex: 1, points: 1 },
              { question: 'Which is a BUSINESS requirement?|||Đâu là yêu cầu KINH DOANH?', options: ['The system shall hash passwords|||Hệ thống phải băm mật khẩu', 'Reduce support tickets by 40%|||Giảm 40% ticket hỗ trợ', 'A user can reset a password|||Người dùng đặt lại được mật khẩu', 'Use PostgreSQL|||Dùng PostgreSQL'], correctIndex: 1, points: 1 },
              { question: 'Boehm\'s 1:10:100 rule says the cost to fix a requirements defect...|||Quy tắc 1:10:100 của Boehm nói chi phí sửa lỗi yêu cầu...', options: ['Stays constant|||Không đổi', 'Grows sharply the later it is found|||Tăng mạnh khi phát hiện càng muộn', 'Decreases over time|||Giảm dần theo thời gian', 'Only matters in testing|||Chỉ quan trọng khi kiểm thử'], correctIndex: 1, points: 1 },
              { question: 'Which modal verb marks a MANDATORY requirement (RFC 2119)?|||Động từ tình thái nào đánh dấu yêu cầu BẮT BUỘC (RFC 2119)?', options: ['may', 'should', 'shall', 'might'], correctIndex: 2, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — YÊU CẦU TỪ GÓC NHÌN KHÁCH HÀNG ══════════════════ */
    {
      title: 'Chapter 2 — Requirements from the customer\'s perspective|||Chương 2 — Yêu cầu từ góc nhìn khách hàng',
      description: 'Stakeholder là ai; user class; user persona; product champion; giải xung đột yêu cầu.',
      lessons: [
        {
          title: '2.1 — Stakeholders, user classes & the product champion|||2.1 — Stakeholder, user class & product champion',
          slug: 'swr302-2-1-stakeholder-user-class',
          type: 'VIDEO',
          description: 'Ai là khách hàng, phân lớp người dùng, persona, vai trò product champion và cách giải xung đột.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Who is the customer, really?</h2>
<p class="lead">"The customer" is rarely one person. A software project has many <strong>stakeholders</strong> — anyone affected by, or who can affect, the system. Requirements come from balancing their needs, and the first job of a BA is to find them all. Miss a stakeholder group and you'll miss a whole class of requirements.</p>
<h3>Stakeholders vs users</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Stakeholders — everyone with a stake</div><div class="lz-ld">Sponsors (pay for it), users (use it), operations/support, legal &amp; compliance, marketing, and even indirect parties like regulators. Not all are users.</div></div>
  <div class="lz-layer"><div class="lz-lt">Users — the people who operate the system</div><div class="lz-ld">A subset of stakeholders. They generate the bulk of functional requirements because they interact with the software daily.</div></div>
</div>
<h3>User classes</h3>
<p>Users are not uniform. A <strong>user class</strong> is a group of users with similar needs, privileges or usage patterns. On an e-learning site you might have: <em>learners</em>, <em>instructors</em>, <em>admins</em>, and <em>guests</em>. Each class has different requirements — an admin needs a dashboard a learner must never see. Classify users early so requirements stay organized.</p>
<h3>User personas</h3>
<p>A <strong>persona</strong> makes a user class concrete and memorable: a fictional but realistic archetype with a name, goals and frustrations. "Mai, 20, a busy CS student who studies on her phone between classes and hates slow pages." A persona keeps the team designing for a real human, not an abstract "user."</p>
<h3>The product champion</h3>
<p>Wiegers' key idea for elicitation: for each major user class, recruit a <strong>product champion</strong> — an actual representative of that class who speaks for its needs, reviews requirements, and has authority to make decisions on its behalf. A champion beats guessing what "the users" want. Choose real users, not managers who <em>think</em> they know the work.</p>
<h3>Resolving conflicting requirements</h3>
<p>Different stakeholders will want opposite things (marketing wants more data collection; users want more privacy). The BA doesn't pick a favorite — they surface the conflict, trace each need to a business objective, and escalate to the <strong>decision maker</strong> with the authority to resolve it. Document the decision and the rationale.</p>
<div class="pitfall"><b>The "expansive users, cautious sponsor" trap.</b> Users always want more features; the sponsor pays the bill. If you gather requirements only from users you get an unaffordable wish-list. Always anchor user requests back to the business requirements — a feature that serves no business objective is a candidate to cut.</div>
<h3>Ví dụ có lời giải · Worked example (map the stakeholders)</h3>
<p>For a university library app, list stakeholders and classify the users.</p>
<div class="out"><b>Stakeholders:</b> Library director (sponsor), students &amp; lecturers (users), library staff (users), IT operations (support), university finance (billing/fines policy), data-protection officer (compliance).
<br><b>User classes:</b> <b>Borrower</b> (search, reserve, borrow) · <b>Librarian</b> (check-in/out, manage catalog) · <b>Admin</b> (accounts, reports).
<br><b>Product champions:</b> one active student for Borrower, one senior librarian for Librarian.
<br>Now each class's requirements can be elicited from its champion — no guessing.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The RACI &amp; the "onion" stakeholder model.</b> Analysts often map stakeholders as concentric rings (the "onion"): the <b>solution</b> at the center, then the <b>system</b> (operators), the <b>containing business</b> (managers, sponsors), and the <b>wider environment</b> (regulators, competitors). Pair it with a <b>RACI</b> chart — for each decision mark who is <em>Responsible, Accountable, Consulted, Informed</em>. Together they stop the classic failure "we forgot to ask the people in operations" — the group that always surfaces the killer requirement two weeks before launch.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Khách hàng thật sự là ai?</h2>
<p class="lead">"Khách hàng" hiếm khi là một người. Một dự án phần mềm có nhiều <strong>stakeholder (bên liên quan)</strong> — bất kỳ ai chịu ảnh hưởng bởi, hoặc có thể tác động tới, hệ thống. Yêu cầu đến từ việc cân bằng nhu cầu của họ, và việc đầu tiên của BA là tìm ra tất cả. Bỏ sót một nhóm stakeholder là bỏ sót cả một lớp yêu cầu.</p>
<h3>Stakeholder vs user</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Stakeholder — mọi người có lợi ích liên quan</div><div class="lz-ld">Nhà tài trợ (trả tiền), người dùng (sử dụng), vận hành/hỗ trợ, pháp lý &amp; tuân thủ, marketing, và cả bên gián tiếp như cơ quan quản lý. Không phải ai cũng là user.</div></div>
  <div class="lz-layer"><div class="lz-lt">User — người vận hành hệ thống</div><div class="lz-ld">Một tập con của stakeholder. Họ sinh ra phần lớn yêu cầu chức năng vì tương tác với phần mềm hằng ngày.</div></div>
</div>
<h3>User class (lớp người dùng)</h3>
<p>Người dùng không đồng nhất. Một <strong>user class</strong> là nhóm người dùng có nhu cầu, quyền hạn hoặc thói quen dùng tương tự. Trên một trang học trực tuyến bạn có thể có: <em>học viên</em>, <em>giảng viên</em>, <em>quản trị</em>, <em>khách vãng lai</em>. Mỗi lớp có yêu cầu khác nhau — admin cần một bảng điều khiển mà học viên không bao giờ được thấy. Phân lớp người dùng sớm để yêu cầu luôn có tổ chức.</p>
<h3>User persona (chân dung người dùng)</h3>
<p>Một <strong>persona</strong> biến user class thành cụ thể và dễ nhớ: một nguyên mẫu hư cấu nhưng thực tế, có tên, mục tiêu và nỗi bực. "Mai, 20 tuổi, sinh viên CNTT bận rộn, học trên điện thoại giữa các tiết và ghét trang tải chậm." Persona giúp đội thiết kế cho một con người thật, không phải "người dùng" trừu tượng.</p>
<h3>Product champion (người đại diện sản phẩm)</h3>
<p>Ý tưởng then chốt của Wiegers cho elicitation: với mỗi user class chính, tuyển một <strong>product champion</strong> — một đại diện thật của lớp đó nói lên nhu cầu, review yêu cầu, và có quyền ra quyết định thay mặt lớp. Có champion hơn hẳn việc đoán "người dùng" muốn gì. Hãy chọn user thật, không phải quản lý <em>tưởng</em> mình hiểu công việc.</p>
<h3>Giải xung đột yêu cầu</h3>
<p>Các stakeholder khác nhau sẽ muốn điều trái ngược (marketing muốn thu nhiều dữ liệu; người dùng muốn riêng tư hơn). BA không chọn phe yêu thích — họ phơi bày xung đột, truy vết mỗi nhu cầu về một mục tiêu kinh doanh, và chuyển lên <strong>người ra quyết định (decision maker)</strong> có thẩm quyền giải quyết. Ghi lại quyết định và lý do.</p>
<div class="pitfall"><b>Bẫy "người dùng đòi nhiều, nhà tài trợ dè dặt".</b> Người dùng luôn muốn thêm tính năng; nhà tài trợ trả hoá đơn. Nếu chỉ gom yêu cầu từ người dùng, bạn có một danh sách ước ao không đủ tiền làm. Luôn neo yêu cầu người dùng về lại yêu cầu kinh doanh — một tính năng không phục vụ mục tiêu kinh doanh nào là ứng viên để cắt.</div>
<h3>Ví dụ có lời giải · Lập bản đồ stakeholder</h3>
<p>Với một ứng dụng thư viện trường đại học, liệt kê stakeholder và phân lớp người dùng.</p>
<div class="out"><b>Stakeholder:</b> Giám đốc thư viện (nhà tài trợ), sinh viên &amp; giảng viên (user), nhân viên thư viện (user), vận hành IT (hỗ trợ), phòng tài chính (chính sách phí phạt), cán bộ bảo vệ dữ liệu (tuân thủ).
<br><b>User class:</b> <b>Người mượn</b> (tìm, đặt trước, mượn) · <b>Thủ thư</b> (nhận/trả, quản lý danh mục) · <b>Admin</b> (tài khoản, báo cáo).
<br><b>Product champion:</b> một sinh viên tích cực cho lớp Người mượn, một thủ thư kỳ cựu cho lớp Thủ thư.
<br>Giờ yêu cầu của mỗi lớp được khai thác từ champion của nó — không cần đoán.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mô hình stakeholder "củ hành" &amp; RACI.</b> BA thường vẽ stakeholder thành các vòng đồng tâm ("củ hành"): <b>giải pháp</b> ở tâm, rồi <b>hệ thống</b> (người vận hành), <b>doanh nghiệp bao quanh</b> (quản lý, nhà tài trợ), và <b>môi trường rộng hơn</b> (cơ quan quản lý, đối thủ). Ghép với bảng <b>RACI</b> — với mỗi quyết định đánh dấu ai <em>Responsible (thực hiện), Accountable (chịu trách nhiệm), Consulted (tham vấn), Informed (được thông báo)</em>. Cùng nhau, chúng chặn thất bại kinh điển "ta quên hỏi bộ phận vận hành" — nhóm luôn nêu ra yêu cầu chí mạng hai tuần trước khi ra mắt.</div>
</div>
`,
        },
        {
          title: 'Quiz 2 — Customer\'s perspective|||Quiz 2 — Góc nhìn khách hàng',
          slug: 'swr302-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh chương 2: stakeholder, user class, product champion.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'A stakeholder is...|||Stakeholder là...', options: ['Only a paying customer|||Chỉ là khách trả tiền', 'Anyone affected by or able to affect the system|||Bất kỳ ai chịu ảnh hưởng hoặc tác động được hệ thống', 'Only the end user|||Chỉ là người dùng cuối', 'The project manager only|||Chỉ là quản lý dự án'], correctIndex: 1, points: 1 },
              { question: 'A "user class" groups users by...|||"User class" gom người dùng theo...', options: ['Alphabetical order|||Thứ tự bảng chữ cái', 'Similar needs, privileges or usage|||Nhu cầu, quyền hạn hoặc cách dùng tương tự', 'Their age only|||Chỉ độ tuổi', 'Payment amount|||Số tiền trả'], correctIndex: 1, points: 1 },
              { question: 'A product champion is...|||Product champion là...', options: ['The best salesperson|||Người bán hàng giỏi nhất', 'A real user-class representative who speaks for its needs|||Đại diện thật của một user class, nói lên nhu cầu của lớp đó', 'The lead developer|||Lập trình viên trưởng', 'The project sponsor|||Nhà tài trợ dự án'], correctIndex: 1, points: 1 },
              { question: 'What is a user persona?|||User persona là gì?', options: ['A security role|||Một vai trò bảo mật', 'A concrete fictional archetype of a user class|||Nguyên mẫu hư cấu cụ thể của một user class', 'A database record|||Một bản ghi CSDL', 'A legal document|||Một tài liệu pháp lý'], correctIndex: 1, points: 1 },
              { question: 'When two stakeholders want opposite things, the BA should...|||Khi hai stakeholder muốn điều trái ngược, BA nên...', options: ['Pick the louder one|||Chọn người nói to hơn', 'Surface the conflict and escalate to the decision maker|||Phơi bày xung đột và chuyển lên người ra quyết định', 'Ignore both|||Bỏ qua cả hai', 'Build both silently|||Âm thầm làm cả hai'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — KỸ THUẬT KHAI THÁC YÊU CẦU ══════════════════ */
    {
      title: 'Chapter 3 — Requirements elicitation techniques|||Chương 3 — Kỹ thuật khai thác yêu cầu',
      description: 'Phỏng vấn, workshop, quan sát, bảng hỏi, prototyping; lập kế hoạch và các cạm bẫy elicitation.',
      lessons: [
        {
          title: '3.1 — Elicitation techniques: interview, workshop, observation, questionnaire, prototype|||3.1 — Kỹ thuật khai thác: phỏng vấn, workshop, quan sát, bảng hỏi, prototype',
          slug: 'swr302-3-1-ky-thuat-elicitation',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Năm kỹ thuật khai thác chính, khi nào dùng cái nào, ưu và nhược điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Discovering requirements — the elicitation toolbox</h2>
<p class="lead"><strong>Elicitation</strong> means actively <em>drawing out</em> requirements from stakeholders — not just "collecting" them, because stakeholders rarely know or can articulate everything they need. A good BA uses several techniques together, because each reveals a different kind of knowledge.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Interviews</div><div class="lz-nsub">One-on-one Q&amp;A. Deep, flexible. Best for detail from key users. Prepare questions; mix open ("walk me through your day") and closed ("how many orders per hour?").</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Workshops (JAD)</div><div class="lz-nsub">Facilitated group session with many stakeholders at once. Fast, surfaces &amp; resolves conflicts live. Needs a skilled facilitator &amp; a scribe.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Observation (ethnography)</div><div class="lz-nsub">Watch users do real work. Reveals what people <em>do</em>, not just what they <em>say</em> — catches "implied" steps they forget to mention.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Questionnaires / surveys</div><div class="lz-nsub">Reach many users cheaply. Good for quantitative trends. Weak for depth &amp; follow-up; question wording is critical.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Prototyping</div><div class="lz-nsub">Show a mock-up; users react to something concrete. Great for uncovering UI needs &amp; hidden assumptions ("that's not what I meant!").</div></div></div>
</div>
<p>Other techniques Wiegers lists: <strong>focus groups</strong>, <strong>document/system analysis</strong> (mine an existing system or manuals), and <strong>studying similar products</strong>. No single technique is enough — combine them (called <em>triangulation</em>).</p>
<h3>Which technique when?</h3>
<table>
  <thead><tr><th>Situation</th><th>Best technique</th></tr></thead>
  <tbody>
    <tr><td>Deep understanding of one power user's workflow</td><td>Interview + Observation</td></tr>
    <tr><td>Many stakeholders disagree; need consensus fast</td><td>Facilitated Workshop</td></tr>
    <tr><td>Validate a feeling across 500 users</td><td>Questionnaire</td></tr>
    <tr><td>UI / screen-flow requirements are unclear</td><td>Prototyping</td></tr>
    <tr><td>Replacing a legacy system</td><td>Document / system analysis</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Don't rely on interviews alone.</b> People describe the "official" process, not the messy reality — they forget the workarounds, exceptions and the sticky note on the monitor. That's why <em>observation</em> is priceless: it catches the assumed and implied requirements nobody says out loud.</div>
<h3>Ví dụ có lời giải · Worked example (pick the technique)</h3>
<p>You must gather requirements for a new hospital nurse-station app. Match techniques to needs.</p>
<div class="out"><b>Goal 1:</b> understand the real ward workflow &amp; time pressure → <b>Observation</b> (shadow a nurse for a shift).
<br><b>Goal 2:</b> reconcile conflicting needs of nurses, doctors &amp; IT security → <b>Workshop</b> (all in one room).
<br><b>Goal 3:</b> learn which of 6 features matter most across 200 nurses → <b>Questionnaire</b>.
<br><b>Goal 4:</b> nail the medication-entry screen layout → <b>Prototype</b> (paper mock-up, watch them use it).
<br>Triangulating these four gives a far more complete, trustworthy picture than any one alone.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "Yes, and… by the way" phenomenon &amp; laddering.</b> Great elicitors use the <em>five whys</em> and <b>laddering</b>: when a user states a feature ("I need an export button"), keep asking "why?" to climb from the stated <em>solution</em> to the real <em>need</em> ("…so I can send the monthly figures to my boss" → maybe an automated email report is better). The feature a user asks for is often a self-invented solution masking a deeper goal — your job is to reach the goal, then design the best solution for it.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Khám phá yêu cầu — hộp công cụ elicitation</h2>
<p class="lead"><strong>Elicitation (khai thác)</strong> nghĩa là chủ động <em>gợi ra</em> yêu cầu từ stakeholder — không chỉ "thu thập", vì stakeholder hiếm khi biết hoặc diễn đạt được hết những gì họ cần. Một BA giỏi dùng nhiều kỹ thuật cùng lúc, vì mỗi cái hé lộ một loại tri thức khác nhau.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Phỏng vấn (Interview)</div><div class="lz-nsub">Hỏi–đáp 1–1. Sâu, linh hoạt. Tốt để lấy chi tiết từ user chủ chốt. Chuẩn bị câu hỏi; trộn mở ("kể tôi nghe một ngày của anh") và đóng ("mỗi giờ bao nhiêu đơn?").</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Workshop (JAD)</div><div class="lz-nsub">Buổi nhóm có điều phối với nhiều stakeholder cùng lúc. Nhanh, phơi bày &amp; giải xung đột tại chỗ. Cần người điều phối giỏi &amp; người ghi chép.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Quan sát (Observation)</div><div class="lz-nsub">Xem user làm việc thật. Hé lộ người ta <em>làm</em> gì, không chỉ <em>nói</em> gì — bắt được các bước "ngầm" họ quên nhắc.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Bảng hỏi / khảo sát</div><div class="lz-nsub">Tiếp cận nhiều user với chi phí thấp. Tốt cho xu hướng định lượng. Yếu về chiều sâu &amp; hỏi tiếp; cách đặt câu hỏi cực kỳ quan trọng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Prototyping</div><div class="lz-nsub">Đưa bản mô phỏng; user phản ứng với thứ cụ thể. Tuyệt để lộ nhu cầu UI &amp; giả định ẩn ("ý tôi không phải vậy!").</div></div></div>
</div>
<p>Kỹ thuật khác Wiegers liệt kê: <strong>focus group</strong>, <strong>phân tích tài liệu/hệ thống</strong> (khai thác hệ thống cũ hoặc sổ tay), và <strong>nghiên cứu sản phẩm tương tự</strong>. Không kỹ thuật đơn lẻ nào là đủ — kết hợp chúng (gọi là <em>tam giác hoá — triangulation</em>).</p>
<h3>Khi nào dùng kỹ thuật nào?</h3>
<table>
  <thead><tr><th>Tình huống</th><th>Kỹ thuật tốt nhất</th></tr></thead>
  <tbody>
    <tr><td>Hiểu sâu quy trình của một user thành thạo</td><td>Phỏng vấn + Quan sát</td></tr>
    <tr><td>Nhiều stakeholder bất đồng; cần đồng thuận nhanh</td><td>Workshop có điều phối</td></tr>
    <tr><td>Xác nhận một cảm nhận trên 500 user</td><td>Bảng hỏi</td></tr>
    <tr><td>Yêu cầu UI / luồng màn hình chưa rõ</td><td>Prototyping</td></tr>
    <tr><td>Thay thế một hệ thống cũ (legacy)</td><td>Phân tích tài liệu / hệ thống</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Đừng chỉ dựa vào phỏng vấn.</b> Người ta mô tả quy trình "chính thức", không phải thực tế lộn xộn — họ quên các mẹo lách, ngoại lệ và tờ giấy nhớ dán trên màn hình. Đó là lý do <em>quan sát</em> vô giá: nó bắt được các yêu cầu ngầm định (assumed &amp; implied) không ai nói ra.</div>
<h3>Ví dụ có lời giải · Chọn kỹ thuật</h3>
<p>Bạn phải gom yêu cầu cho một app trạm điều dưỡng bệnh viện. Ghép kỹ thuật với nhu cầu.</p>
<div class="out"><b>Mục tiêu 1:</b> hiểu quy trình khoa phòng thật &amp; áp lực thời gian → <b>Quan sát</b> (theo một điều dưỡng suốt ca).
<br><b>Mục tiêu 2:</b> dung hoà nhu cầu trái ngược của điều dưỡng, bác sĩ &amp; bảo mật IT → <b>Workshop</b> (tất cả trong một phòng).
<br><b>Mục tiêu 3:</b> biết trong 6 tính năng cái nào quan trọng nhất với 200 điều dưỡng → <b>Bảng hỏi</b>.
<br><b>Mục tiêu 4:</b> chốt bố cục màn hình nhập thuốc → <b>Prototype</b> (bản giấy, xem họ dùng).
<br>Tam giác hoá bốn cái này cho bức tranh hoàn chỉnh, đáng tin hơn nhiều so với bất kỳ cái đơn lẻ nào.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hiện tượng "Vâng, và… à mà" &amp; kỹ thuật laddering.</b> Người khai thác giỏi dùng <em>5 whys</em> và <b>laddering</b>: khi user nêu một tính năng ("tôi cần nút export"), cứ hỏi "tại sao?" để leo từ <em>giải pháp</em> họ nói tới <em>nhu cầu</em> thật ("…để gửi số liệu tháng cho sếp" → có khi báo cáo email tự động tốt hơn). Tính năng user đòi thường là giải pháp họ tự nghĩ ra che đi một mục tiêu sâu hơn — việc của bạn là chạm tới mục tiêu, rồi thiết kế giải pháp tốt nhất cho nó.</div>
</div>
`,
        },
        {
          title: '3.2 — Planning elicitation & avoiding pitfalls|||3.2 — Lập kế hoạch khai thác & tránh cạm bẫy',
          slug: 'swr302-3-2-lap-ke-hoach-elicitation',
          type: 'VIDEO',
          description: 'Quy trình chuẩn bị–thực hiện–theo dõi; phân loại đầu vào; yêu cầu ngầm định; tìm yêu cầu còn thiếu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Running elicitation well</h2>
<p class="lead">Elicitation isn't a chat — it's a planned activity. Wiegers frames it as three phases: <strong>prepare</strong>, <strong>perform</strong>, <strong>follow up</strong>. Skipping the bookends is why so many "requirements meetings" produce a pile of notes nobody can use.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Before</div><div class="lz-t">Prepare</div><div class="lz-d">Pick technique, participants, questions, logistics</div></div>
  <div class="lz-step"><div class="lz-k">During</div><div class="lz-t">Perform</div><div class="lz-d">Facilitate, listen, capture, confirm understanding</div></div>
  <div class="lz-step"><div class="lz-k">After</div><div class="lz-t">Follow up</div><div class="lz-d">Write up, classify, send back for confirmation</div></div>
</div>
<h3>Classifying what you gather</h3>
<p>Raw input is messy. During follow-up, sort each item into the right bucket — this is where "notes" become "requirements":</p>
<table>
  <thead><tr><th>Bucket</th><th>Example of raw input</th></tr></thead>
  <tbody>
    <tr><td>Business requirement</td><td>"We want fewer late deliveries."</td></tr>
    <tr><td>User requirement</td><td>"I need to see which orders are overdue."</td></tr>
    <tr><td>Functional requirement</td><td>"Highlight overdue orders in red."</td></tr>
    <tr><td>Non-functional / quality</td><td>"The list must load in under 1 second."</td></tr>
    <tr><td>Business rule</td><td>"An order is overdue 24h after its promised time."</td></tr>
    <tr><td>Constraint</td><td>"Must run on the existing Oracle DB."</td></tr>
    <tr><td>Assumption / open issue</td><td>"Assume all times are in local timezone — confirm!"</td></tr>
  </tbody>
</table>
<h3>Assumed &amp; implied requirements — the silent killers</h3>
<p>Some requirements are so "obvious" to users they never mention them ("of course it saves my work automatically"). These <strong>assumed/implied</strong> requirements are a top source of nasty surprises. Hunt them deliberately: ask "what happens if…?", review edge cases, and study what the old system already did.</p>
<h3>Finding missing requirements</h3>
<ul>
  <li>Walk every use case to its exceptions ("what if payment fails?").</li>
  <li>Check each user class — did every class get a voice?</li>
  <li>Cover the CRUD grid — for each data entity, is Create/Read/Update/Delete specified?</li>
  <li>Ask about the "unhappy paths": errors, empty states, concurrent users, security.</li>
</ul>
<div class="pitfall"><b>Some cautions about elicitation.</b> Beware <em>analysis paralysis</em> (eliciting forever without deciding), <em>designing during elicitation</em> (jumping to solutions before the need is clear), and <em>the loudest voice winning</em> (a dominant stakeholder drowning out quiet but important user classes). The facilitator's job is to keep the session on needs and give every class airtime.</div>
<h3>Ví dụ có lời giải · Worked example (surface the implied requirement)</h3>
<p>A client says: "Users log in with their email and password." Sounds complete. Hunt the implied requirements.</p>
<div class="out"><b>Questions that surface hidden needs:</b>
<br>• What if the password is wrong 5 times? → <em>account lockout</em> requirement (missing!).
<br>• Can users reset a forgotten password? → <em>password recovery</em> (missing!).
<br>• Any password strength rules? → <em>validation</em> business rule (missing!).
<br>• Session length before auto-logout? → <em>NFR: security/session</em> (missing!).
<br>One innocent sentence hid four requirements. That's why you always ask "what happens if…?"</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Kano model — not all requirements are equal.</b> The Kano model sorts features into <b>Must-be</b> (basic — absence angers users, presence is taken for granted, e.g. "login works"), <b>Performance</b> (more is better — speed, storage), and <b>Delighters</b> (unexpected joys — users never asked but love them). Crucially, users rarely <em>state</em> Must-be requirements (they're assumed) yet their absence is catastrophic — which is exactly why implied-requirement hunting matters. Aim to fully cover Must-be, compete on Performance, and sprinkle a few Delighters.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Thực hiện elicitation cho tốt</h2>
<p class="lead">Elicitation không phải buổi tán gẫu — nó là hoạt động có kế hoạch. Wiegers chia thành ba pha: <strong>chuẩn bị</strong>, <strong>thực hiện</strong>, <strong>theo dõi sau</strong>. Bỏ hai đầu là lý do nhiều "buổi họp yêu cầu" chỉ đẻ ra một đống ghi chú không ai dùng được.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Trước</div><div class="lz-t">Chuẩn bị</div><div class="lz-d">Chọn kỹ thuật, người tham gia, câu hỏi, hậu cần</div></div>
  <div class="lz-step"><div class="lz-k">Trong</div><div class="lz-t">Thực hiện</div><div class="lz-d">Điều phối, lắng nghe, ghi lại, xác nhận hiểu đúng</div></div>
  <div class="lz-step"><div class="lz-k">Sau</div><div class="lz-t">Theo dõi</div><div class="lz-d">Viết lại, phân loại, gửi về xác nhận</div></div>
</div>
<h3>Phân loại thứ bạn gom được</h3>
<p>Đầu vào thô thì lộn xộn. Trong pha theo dõi, xếp mỗi mục vào đúng ngăn — đây là lúc "ghi chú" biến thành "yêu cầu":</p>
<table>
  <thead><tr><th>Ngăn</th><th>Ví dụ đầu vào thô</th></tr></thead>
  <tbody>
    <tr><td>Yêu cầu kinh doanh</td><td>"Chúng tôi muốn giảm giao hàng trễ."</td></tr>
    <tr><td>Yêu cầu người dùng</td><td>"Tôi cần thấy đơn nào đang quá hạn."</td></tr>
    <tr><td>Yêu cầu chức năng</td><td>"Tô đỏ các đơn quá hạn."</td></tr>
    <tr><td>Phi chức năng / chất lượng</td><td>"Danh sách phải tải dưới 1 giây."</td></tr>
    <tr><td>Business rule (quy tắc nghiệp vụ)</td><td>"Đơn quá hạn sau 24h kể từ giờ hứa."</td></tr>
    <tr><td>Ràng buộc (constraint)</td><td>"Phải chạy trên CSDL Oracle hiện có."</td></tr>
    <tr><td>Giả định / vấn đề mở</td><td>"Giả định mọi thời gian theo múi giờ địa phương — cần xác nhận!"</td></tr>
  </tbody>
</table>
<h3>Yêu cầu ngầm định &amp; hàm ẩn — kẻ giết người thầm lặng</h3>
<p>Một số yêu cầu "hiển nhiên" tới mức user không bao giờ nhắc ("dĩ nhiên nó tự lưu bài của tôi"). Các yêu cầu <strong>ngầm định/hàm ẩn (assumed/implied)</strong> này là nguồn bất ngờ khó chịu hàng đầu. Hãy săn chúng có chủ ý: hỏi "điều gì xảy ra nếu…?", rà các trường hợp biên, và nghiên cứu hệ thống cũ đã làm gì.</p>
<h3>Tìm yêu cầu còn thiếu</h3>
<ul>
  <li>Đi từng use case tới các ngoại lệ của nó ("nếu thanh toán thất bại thì sao?").</li>
  <li>Kiểm mỗi user class — mọi lớp đã có tiếng nói chưa?</li>
  <li>Phủ lưới CRUD — với mỗi thực thể dữ liệu, đã đặc tả Create/Read/Update/Delete chưa?</li>
  <li>Hỏi về "đường không hạnh phúc": lỗi, trạng thái rỗng, nhiều user đồng thời, bảo mật.</li>
</ul>
<div class="pitfall"><b>Vài lưu ý về elicitation.</b> Coi chừng <em>tê liệt vì phân tích</em> (khai thác mãi mà không quyết), <em>thiết kế ngay khi khai thác</em> (nhảy tới giải pháp trước khi rõ nhu cầu), và <em>người nói to nhất thắng</em> (một stakeholder áp đảo lấn át các user class im lặng nhưng quan trọng). Việc của người điều phối là giữ buổi họp bám vào nhu cầu và cho mọi lớp cơ hội nói.</div>
<h3>Ví dụ có lời giải · Lộ ra yêu cầu hàm ẩn</h3>
<p>Khách nói: "Người dùng đăng nhập bằng email và mật khẩu." Nghe có vẻ đủ. Hãy săn yêu cầu hàm ẩn.</p>
<div class="out"><b>Câu hỏi làm lộ nhu cầu ẩn:</b>
<br>• Nếu sai mật khẩu 5 lần thì sao? → yêu cầu <em>khoá tài khoản</em> (thiếu!).
<br>• Người dùng đặt lại mật khẩu quên được không? → <em>khôi phục mật khẩu</em> (thiếu!).
<br>• Có quy tắc độ mạnh mật khẩu? → business rule <em>kiểm tra hợp lệ</em> (thiếu!).
<br>• Bao lâu tự đăng xuất? → <em>NFR: bảo mật/phiên</em> (thiếu!).
<br>Một câu vô hại giấu bốn yêu cầu. Đó là lý do luôn phải hỏi "điều gì xảy ra nếu…?"</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mô hình Kano — không phải yêu cầu nào cũng ngang nhau.</b> Mô hình Kano chia tính năng thành <b>Must-be (cơ bản)</b> — thiếu thì user giận, có thì coi là đương nhiên (vd "đăng nhập được"), <b>Performance</b> — càng nhiều càng tốt (tốc độ, dung lượng), và <b>Delighter</b> — niềm vui bất ngờ (user không đòi nhưng thích). Điểm mấu chốt: user hiếm khi <em>nói ra</em> yêu cầu Must-be (chúng được ngầm định) nhưng vắng chúng là thảm hoạ — chính vì thế săn yêu cầu hàm ẩn mới quan trọng. Hãy phủ trọn Must-be, cạnh tranh ở Performance, và rắc vài Delighter.</div>
</div>
`,
        },
        {
          title: 'Quiz 3 — Elicitation techniques|||Quiz 3 — Kỹ thuật khai thác',
          slug: 'swr302-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh chương 3: kỹ thuật, kế hoạch, yêu cầu hàm ẩn.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'Which technique best reveals what users DO rather than what they SAY?|||Kỹ thuật nào lộ rõ nhất user LÀM gì thay vì NÓI gì?', options: ['Questionnaire|||Bảng hỏi', 'Observation|||Quan sát', 'Email|||Email', 'Reading manuals|||Đọc sổ tay'], correctIndex: 1, points: 1 },
              { question: 'A facilitated group session to reach consensus fast is a...|||Buổi nhóm có điều phối để đạt đồng thuận nhanh là...', options: ['Interview|||Phỏng vấn', 'Workshop (JAD)|||Workshop (JAD)', 'Survey|||Khảo sát', 'Prototype|||Prototype'], correctIndex: 1, points: 1 },
              { question: 'Best technique to clarify unclear UI / screen flow?|||Kỹ thuật tốt nhất để làm rõ UI / luồng màn hình chưa rõ?', options: ['Prototyping|||Prototyping', 'Questionnaire|||Bảng hỏi', 'Document analysis|||Phân tích tài liệu', 'Focus group|||Focus group'], correctIndex: 0, points: 1 },
              { question: 'Assumed/implied requirements are dangerous because...|||Yêu cầu ngầm định/hàm ẩn nguy hiểm vì...', options: ['They are written in the SRS|||Chúng được viết trong SRS', 'Users think them obvious and never state them|||User cho là hiển nhiên nên không nói ra', 'They are always non-functional|||Chúng luôn là phi chức năng', 'They cost nothing|||Chúng không tốn gì'], correctIndex: 1, points: 1 },
              { question: 'The three phases of elicitation are...|||Ba pha của elicitation là...', options: ['Design, code, test|||Thiết kế, code, test', 'Prepare, perform, follow up|||Chuẩn bị, thực hiện, theo dõi', 'Plan, build, ship|||Lập kế hoạch, xây, phát hành', 'Ask, ignore, repeat|||Hỏi, bỏ qua, lặp lại'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — PHÂN TÍCH & MÔ HÌNH HOÁ ══════════════════ */
    {
      title: 'Chapter 4 — Analysis & modeling|||Chương 4 — Phân tích & mô hình hoá',
      description: 'Use case, user story (INVEST), domain model, data dictionary, DFD — biến yêu cầu thành mô hình.',
      lessons: [
        {
          title: '4.1 — Use cases & user stories|||4.1 — Use case & user story',
          slug: 'swr302-4-1-use-case-user-story',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Cấu trúc một use case đầy đủ, viết user story theo INVEST, khi nào dùng cái nào.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Capturing user requirements: use cases &amp; user stories</h2>
<p class="lead">A user requirement describes a <strong>goal a user wants to accomplish</strong>. The two dominant ways to write these are <strong>use cases</strong> (detailed, structured — favored in plan-driven projects) and <strong>user stories</strong> (short, conversational — favored in Agile). Both describe usage from the user's viewpoint, not the system's internals.</p>
<h3>The use case</h3>
<p>A use case describes a complete interaction between an <strong>actor</strong> (a user role, or another system) and the system to achieve a goal. Its power is the <strong>alternative and exception flows</strong> — they force you to think through what happens when things go wrong.</p>
<h3>Ví dụ có lời giải · Worked example (a full use case)</h3>
<div class="out"><b>Use Case UC-07: Withdraw cash from ATM</b>
<br><b>Primary actor:</b> Cardholder
<br><b>Preconditions:</b> Card is inserted; cardholder is authenticated (PIN verified).
<br><b>Postconditions (success):</b> Account is debited by the amount; cash is dispensed; a receipt is offered.
<br><b>Trigger:</b> Cardholder selects "Withdraw".
<br><b>Main success flow (basic flow):</b>
<br>&nbsp;&nbsp;1. Cardholder selects "Withdraw cash".
<br>&nbsp;&nbsp;2. System prompts for an amount.
<br>&nbsp;&nbsp;3. Cardholder enters an amount.
<br>&nbsp;&nbsp;4. System verifies the amount ≤ balance AND ≤ daily limit AND cash available.
<br>&nbsp;&nbsp;5. System debits the account and dispenses the cash.
<br>&nbsp;&nbsp;6. System offers a receipt and ejects the card.
<br><b>Alternative flow 4a — insufficient balance:</b> System shows "Insufficient funds", returns to step 2.
<br><b>Alternative flow 4b — over daily limit:</b> System shows the remaining limit, returns to step 2.
<br><b>Exception 5a — ATM out of cash:</b> System cancels, does NOT debit, ejects card, logs the event.
<br><b>Business rules:</b> Daily withdrawal limit = 10,000,000 VND; dispense in multiples of 50,000 VND.</div>
<p>Notice the basic flow is only half the value — the alternatives and exceptions (4a, 4b, 5a) are where real requirements hide. Each one is testable.</p>
<h3>The user story</h3>
<p>A user story is a lightweight placeholder for a conversation, in the classic template:</p>
<pre>As a &lt;role&gt;, I want &lt;goal&gt;, so that &lt;benefit&gt;.</pre>
<p>Example: <em>"As a registered member, I want to reset my password by email, so that I can regain access without contacting support."</em> The value ("so that…") is essential — it justifies the story and helps prioritization.</p>
<h3>INVEST — the test of a good user story</h3>
<table>
  <thead><tr><th>Letter</th><th>Means</th><th>Check</th></tr></thead>
  <tbody>
    <tr><td>I — Independent</td><td>Stands alone</td><td>Can it be built without waiting on another story?</td></tr>
    <tr><td>N — Negotiable</td><td>Not a rigid contract</td><td>Room to discuss the details?</td></tr>
    <tr><td>V — Valuable</td><td>Delivers user value</td><td>Is the "so that" real?</td></tr>
    <tr><td>E — Estimable</td><td>Team can size it</td><td>Clear enough to estimate?</td></tr>
    <tr><td>S — Small</td><td>Fits in a sprint</td><td>Not an "epic" in disguise?</td></tr>
    <tr><td>T — Testable</td><td>Has acceptance criteria</td><td>Can we prove it's done?</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Use cases and user stories are not requirements themselves — they are containers.</b> A use case implies many functional requirements; a story needs <em>acceptance criteria</em> (Ch5/6) to become testable. Beginners write a story and think they're done — without acceptance criteria the developer still has to guess.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "3 C's" of a user story (Ron Jeffries).</b> A good story is <b>Card</b> (a short written promise), <b>Conversation</b> (the detail is worked out by talking, not by writing a spec), and <b>Confirmation</b> (acceptance criteria that confirm it's done). This is the philosophical opposite of the heavyweight use case: a use case front-loads detail on paper; a story deliberately defers detail to a just-in-time conversation. Neither is "better" — plan-driven projects favor use cases, Agile teams favor stories. A skilled BA can write both and knows when each fits.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Ghi lại yêu cầu người dùng: use case &amp; user story</h2>
<p class="lead">Một yêu cầu người dùng mô tả <strong>mục tiêu người dùng muốn đạt</strong>. Hai cách viết phổ biến nhất là <strong>use case</strong> (chi tiết, có cấu trúc — ưa dùng trong dự án theo kế hoạch) và <strong>user story</strong> (ngắn, đối thoại — ưa dùng trong Agile). Cả hai mô tả cách dùng từ góc nhìn người dùng, không phải nội bộ hệ thống.</p>
<h3>Use case</h3>
<p>Use case mô tả một tương tác hoàn chỉnh giữa một <strong>actor</strong> (vai trò người dùng, hoặc hệ thống khác) và hệ thống để đạt một mục tiêu. Sức mạnh của nó nằm ở các <strong>luồng thay thế và ngoại lệ</strong> — chúng buộc bạn nghĩ hết những gì xảy ra khi có trục trặc.</p>
<h3>Ví dụ có lời giải · Một use case đầy đủ</h3>
<div class="out"><b>Use Case UC-07: Rút tiền từ máy ATM</b>
<br><b>Actor chính:</b> Chủ thẻ
<br><b>Điều kiện trước (Preconditions):</b> Thẻ đã đưa vào; chủ thẻ đã xác thực (nhập đúng PIN).
<br><b>Điều kiện sau (thành công):</b> Tài khoản bị trừ đúng số tiền; tiền được nhả ra; đề nghị in biên lai.
<br><b>Kích hoạt (Trigger):</b> Chủ thẻ chọn "Rút tiền".
<br><b>Luồng thành công chính (basic flow):</b>
<br>&nbsp;&nbsp;1. Chủ thẻ chọn "Rút tiền mặt".
<br>&nbsp;&nbsp;2. Hệ thống hỏi số tiền.
<br>&nbsp;&nbsp;3. Chủ thẻ nhập số tiền.
<br>&nbsp;&nbsp;4. Hệ thống kiểm tra số tiền ≤ số dư VÀ ≤ hạn mức ngày VÀ còn tiền trong máy.
<br>&nbsp;&nbsp;5. Hệ thống trừ tài khoản và nhả tiền.
<br>&nbsp;&nbsp;6. Hệ thống đề nghị in biên lai và trả thẻ.
<br><b>Luồng thay thế 4a — không đủ số dư:</b> Hệ thống báo "Không đủ tiền", quay về bước 2.
<br><b>Luồng thay thế 4b — vượt hạn mức ngày:</b> Hệ thống hiện hạn mức còn lại, quay về bước 2.
<br><b>Ngoại lệ 5a — ATM hết tiền:</b> Hệ thống huỷ, KHÔNG trừ tiền, trả thẻ, ghi log sự kiện.
<br><b>Business rule:</b> Hạn mức rút trong ngày = 10.000.000 VND; nhả theo bội số 50.000 VND.</div>
<p>Để ý luồng chính chỉ là một nửa giá trị — các luồng thay thế và ngoại lệ (4a, 4b, 5a) mới là nơi yêu cầu thật ẩn náu. Mỗi cái đều kiểm thử được.</p>
<h3>User story</h3>
<p>User story là một mảnh giữ chỗ nhẹ nhàng cho một cuộc đối thoại, theo mẫu kinh điển:</p>
<pre>Là &lt;vai trò&gt;, tôi muốn &lt;mục tiêu&gt;, để &lt;lợi ích&gt;.</pre>
<p>Ví dụ: <em>"Là một thành viên đã đăng ký, tôi muốn đặt lại mật khẩu qua email, để lấy lại quyền truy cập mà không cần liên hệ hỗ trợ."</em> Phần giá trị ("để…") là thiết yếu — nó biện minh cho story và giúp việc ưu tiên.</p>
<h3>INVEST — bài kiểm cho một user story tốt</h3>
<table>
  <thead><tr><th>Chữ</th><th>Nghĩa</th><th>Kiểm</th></tr></thead>
  <tbody>
    <tr><td>I — Independent (độc lập)</td><td>Đứng riêng được</td><td>Có xây được mà không chờ story khác?</td></tr>
    <tr><td>N — Negotiable (thương lượng được)</td><td>Không phải hợp đồng cứng</td><td>Còn chỗ bàn chi tiết?</td></tr>
    <tr><td>V — Valuable (có giá trị)</td><td>Mang lại giá trị cho user</td><td>Phần "để…" có thật?</td></tr>
    <tr><td>E — Estimable (ước lượng được)</td><td>Đội ước lượng được</td><td>Đủ rõ để ước lượng?</td></tr>
    <tr><td>S — Small (nhỏ)</td><td>Vừa một sprint</td><td>Không phải "epic" trá hình?</td></tr>
    <tr><td>T — Testable (kiểm thử được)</td><td>Có acceptance criteria</td><td>Chứng minh được là xong?</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Use case và user story tự thân KHÔNG phải là yêu cầu — chúng là vật chứa.</b> Một use case hàm ý nhiều yêu cầu chức năng; một story cần <em>acceptance criteria</em> (Ch5/6) mới kiểm thử được. Người mới viết xong một story tưởng đã xong — không có acceptance criteria thì lập trình viên vẫn phải đoán.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"3 chữ C" của user story (Ron Jeffries).</b> Một story tốt là <b>Card</b> (một lời hứa ngắn viết ra), <b>Conversation</b> (chi tiết được làm rõ bằng nói chuyện, không phải viết đặc tả), và <b>Confirmation</b> (acceptance criteria xác nhận đã xong). Đây là mặt đối lập triết lý với use case đồ sộ: use case dồn chi tiết lên giấy trước; story cố ý hoãn chi tiết tới một cuộc đối thoại đúng lúc. Không cái nào "tốt hơn" — dự án theo kế hoạch ưa use case, đội Agile ưa story. Một BA giỏi viết được cả hai và biết khi nào hợp cái nào.</div>
</div>
`,
        },
        {
          title: '4.2 — Domain model, data dictionary & DFD|||4.2 — Domain model, data dictionary & DFD',
          slug: 'swr302-4-2-domain-model-dfd',
          type: 'VIDEO',
          description: 'Mô hình miền (class/ER), từ điển dữ liệu, và sơ đồ luồng dữ liệu (DFD) — một hình đáng nghìn từ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>A picture is worth 1024 words — modeling requirements visually</h2>
<p class="lead">Text alone hides gaps and ambiguities. Models expose them. Wiegers devotes whole chapters to visual analysis models because a diagram forces precision — you cannot draw a relationship you haven't decided on. Three you must know: the <strong>domain model</strong>, the <strong>data dictionary</strong>, and the <strong>data flow diagram (DFD)</strong>.</p>
<h3>The domain model (class / entity model)</h3>
<p>A <strong>domain model</strong> shows the key <em>things</em> (entities/classes) in the problem space and how they relate — before any coding. For a bookstore: <em>Customer</em> places <em>Order</em>; an <em>Order</em> contains many <em>OrderLine</em>s; each <em>OrderLine</em> refers to a <em>Book</em>. It captures the <strong>nouns</strong> of the domain and their multiplicities (one-to-many, many-to-many).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Customer 1 —— * Order</div><div class="lz-ld">One customer places many orders (1-to-many).</div></div>
  <div class="lz-layer"><div class="lz-lt">Order 1 —— * OrderLine</div><div class="lz-ld">One order has many order lines.</div></div>
  <div class="lz-layer"><div class="lz-lt">OrderLine * —— 1 Book</div><div class="lz-ld">Each line references exactly one book.</div></div>
</div>
<h3>The data dictionary</h3>
<p>A <strong>data dictionary</strong> is the single authoritative definition of every data element and structure — so "customer_id" means the same thing to everyone. Each entry pins down name, type, format, allowed values and rules:</p>
<table>
  <thead><tr><th>Element</th><th>Definition</th></tr></thead>
  <tbody>
    <tr><td>customer_id</td><td>Integer, ≥ 1, unique, system-generated. Never reused.</td></tr>
    <tr><td>email</td><td>Text, valid RFC-5322 format, ≤ 254 chars, unique per customer.</td></tr>
    <tr><td>order_total</td><td>Decimal(12,2), ≥ 0, VND. = Σ(line subtotal) + tax − discount.</td></tr>
    <tr><td>order_status</td><td>Enum: {PENDING, PAID, SHIPPED, DELIVERED, CANCELLED}.</td></tr>
  </tbody>
</table>
<h3>The data flow diagram (DFD)</h3>
<p>A <strong>DFD</strong> shows how data <em>moves</em> through the system: <strong>processes</strong> (transform data), <strong>data stores</strong> (hold data), <strong>external entities</strong> (sources/sinks outside), and <strong>data flows</strong> (arrows). The top level is the <strong>context diagram</strong> — the whole system as one bubble with its external entities — then you decompose into levels.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">External</div><div class="lz-t">Customer</div><div class="lz-d">places order →</div></div>
  <div class="lz-step"><div class="lz-k">Process</div><div class="lz-t">1.0 Process Order</div><div class="lz-d">validates &amp; records</div></div>
  <div class="lz-step"><div class="lz-k">Store</div><div class="lz-t">D1 Orders</div><div class="lz-d">← writes order</div></div>
  <div class="lz-step"><div class="lz-k">External</div><div class="lz-t">Warehouse</div><div class="lz-d">← ships</div></div>
</div>
<p>Other models Wiegers covers: <strong>swimlane diagrams</strong> (who does what across roles), <strong>state-transition diagrams &amp; state tables</strong> (an object's lifecycle — e.g. an order's states), <strong>decision tables/trees</strong> (complex conditional logic), and <strong>event-response tables</strong>.</p>
<div class="pitfall"><b>A model is an aid, not the deliverable.</b> Don't model everything to death — draw the model that clarifies a <em>risky or complex</em> part. A DFD of a trivial CRUD screen wastes time; a state diagram of a complicated order lifecycle prevents bugs. Match the model to the difficulty.</div>
<h3>Ví dụ có lời giải · Worked example (state-transition table)</h3>
<p>Model the lifecycle of a support ticket. States: New, Open, Pending, Resolved, Closed.</p>
<div class="out"><b>State table (current state × event → next state):</b>
<br>New + "agent picks up" → Open
<br>Open + "needs customer info" → Pending
<br>Pending + "customer replies" → Open
<br>Open + "agent solves" → Resolved
<br>Resolved + "customer confirms" → Closed
<br>Resolved + "customer reopens" → Open
<br><b>Value:</b> the table instantly exposes missing transitions — e.g. "can a Closed ticket be reopened?" is a requirement question the diagram forced you to answer.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Model = shared language, and the source of "requirement smells".</b> Modeling isn't just documentation — the act of drawing surfaces disagreements ("wait, can one order have two customers?") that pure prose hides. Advanced BAs also learn to spot <b>requirement smells</b>: an entity with no relationships (orphan — is it needed?), a many-to-many with no join meaning (probably hides a missing entity, like <em>Enrollment</em> between Student and Course), or a process in a DFD with inputs but no outputs (a "black hole"). The model turns fuzzy prose into questions you can actually answer.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Một hình đáng nghìn từ — mô hình hoá yêu cầu bằng hình</h2>
<p class="lead">Chỉ dùng chữ sẽ giấu đi các lỗ hổng và mơ hồ. Mô hình phơi bày chúng. Wiegers dành hẳn nhiều chương cho mô hình phân tích trực quan vì một sơ đồ buộc bạn chính xác — bạn không thể vẽ một quan hệ mà mình chưa quyết. Ba cái phải biết: <strong>domain model</strong>, <strong>data dictionary</strong>, và <strong>data flow diagram (DFD)</strong>.</p>
<h3>Domain model (mô hình miền — class/thực thể)</h3>
<p>Một <strong>domain model</strong> cho thấy các <em>thứ</em> chính (thực thể/lớp) trong không gian bài toán và cách chúng liên hệ — trước khi code. Với một hiệu sách: <em>Customer</em> đặt <em>Order</em>; một <em>Order</em> chứa nhiều <em>OrderLine</em>; mỗi <em>OrderLine</em> trỏ tới một <em>Book</em>. Nó ghi lại các <strong>danh từ</strong> của miền và bội số quan hệ (1-nhiều, nhiều-nhiều).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Customer 1 —— * Order</div><div class="lz-ld">Một khách đặt nhiều đơn (1-nhiều).</div></div>
  <div class="lz-layer"><div class="lz-lt">Order 1 —— * OrderLine</div><div class="lz-ld">Một đơn có nhiều dòng đơn.</div></div>
  <div class="lz-layer"><div class="lz-lt">OrderLine * —— 1 Book</div><div class="lz-ld">Mỗi dòng trỏ đúng một cuốn sách.</div></div>
</div>
<h3>Data dictionary (từ điển dữ liệu)</h3>
<p>Một <strong>data dictionary</strong> là định nghĩa có thẩm quyền duy nhất cho mọi phần tử và cấu trúc dữ liệu — để "customer_id" mang cùng một nghĩa với mọi người. Mỗi mục chốt tên, kiểu, định dạng, giá trị cho phép và quy tắc:</p>
<table>
  <thead><tr><th>Phần tử</th><th>Định nghĩa</th></tr></thead>
  <tbody>
    <tr><td>customer_id</td><td>Số nguyên, ≥ 1, duy nhất, do hệ thống sinh. Không tái dùng.</td></tr>
    <tr><td>email</td><td>Văn bản, đúng định dạng RFC-5322, ≤ 254 ký tự, duy nhất theo khách.</td></tr>
    <tr><td>order_total</td><td>Decimal(12,2), ≥ 0, VND. = Σ(subtotal dòng) + thuế − giảm giá.</td></tr>
    <tr><td>order_status</td><td>Enum: {PENDING, PAID, SHIPPED, DELIVERED, CANCELLED}.</td></tr>
  </tbody>
</table>
<h3>Data flow diagram (DFD — sơ đồ luồng dữ liệu)</h3>
<p>Một <strong>DFD</strong> cho thấy dữ liệu <em>di chuyển</em> qua hệ thống thế nào: <strong>process</strong> (biến đổi dữ liệu), <strong>data store</strong> (lưu dữ liệu), <strong>external entity</strong> (nguồn/đích bên ngoài), và <strong>data flow</strong> (mũi tên). Cấp trên cùng là <strong>context diagram</strong> — cả hệ thống như một bong bóng với các thực thể ngoài — rồi bạn phân rã thành các cấp.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Ngoài</div><div class="lz-t">Khách hàng</div><div class="lz-d">đặt đơn →</div></div>
  <div class="lz-step"><div class="lz-k">Process</div><div class="lz-t">1.0 Xử lý đơn</div><div class="lz-d">kiểm tra &amp; ghi nhận</div></div>
  <div class="lz-step"><div class="lz-k">Store</div><div class="lz-t">D1 Đơn hàng</div><div class="lz-d">← ghi đơn</div></div>
  <div class="lz-step"><div class="lz-k">Ngoài</div><div class="lz-t">Kho hàng</div><div class="lz-d">← giao</div></div>
</div>
<p>Mô hình khác Wiegers đề cập: <strong>swimlane diagram</strong> (ai làm gì theo vai trò), <strong>state-transition diagram &amp; state table</strong> (vòng đời của một đối tượng — vd trạng thái đơn hàng), <strong>decision table/tree</strong> (logic điều kiện phức tạp), và <strong>event-response table</strong>.</p>
<div class="pitfall"><b>Mô hình là công cụ hỗ trợ, không phải sản phẩm bàn giao.</b> Đừng mô hình hoá mọi thứ tới chết — hãy vẽ mô hình làm rõ phần <em>rủi ro hoặc phức tạp</em>. Một DFD cho màn hình CRUD tầm thường là phí thời gian; một state diagram cho vòng đời đơn hàng phức tạp thì ngừa được lỗi. Khớp mô hình với độ khó.</div>
<h3>Ví dụ có lời giải · Bảng chuyển trạng thái (state table)</h3>
<p>Mô hình vòng đời của một ticket hỗ trợ. Trạng thái: New, Open, Pending, Resolved, Closed.</p>
<div class="out"><b>Bảng trạng thái (trạng thái hiện tại × sự kiện → trạng thái kế):</b>
<br>New + "agent nhận" → Open
<br>Open + "cần thông tin khách" → Pending
<br>Pending + "khách trả lời" → Open
<br>Open + "agent giải quyết" → Resolved
<br>Resolved + "khách xác nhận" → Closed
<br>Resolved + "khách mở lại" → Open
<br><b>Giá trị:</b> bảng lập tức lộ ra các chuyển thiếu — vd "ticket Closed có mở lại được không?" là một câu hỏi yêu cầu mà sơ đồ buộc bạn phải trả lời.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mô hình = ngôn ngữ chung, và nguồn phát hiện "requirement smell".</b> Mô hình hoá không chỉ là tài liệu — hành động vẽ làm lộ các bất đồng ("khoan, một đơn có hai khách được không?") mà văn xuôi thuần giấu đi. BA giỏi còn học phát hiện <b>requirement smell</b>: một thực thể không có quan hệ nào (mồ côi — có cần không?), một quan hệ nhiều-nhiều không có ý nghĩa nối (thường giấu một thực thể còn thiếu, như <em>Enrollment</em> giữa Student và Course), hoặc một process trong DFD có đầu vào mà không có đầu ra (một "hố đen"). Mô hình biến văn xuôi mờ nhạt thành các câu hỏi bạn thật sự trả lời được.</div>
</div>
`,
        },
        {
          title: 'Quiz 4 — Analysis & modeling|||Quiz 4 — Phân tích & mô hình hoá',
          slug: 'swr302-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh chương 4: use case, INVEST, domain model, DFD.',
          quiz: {
            timeLimitSeconds: 540,
            questions: [
              { question: 'In a use case, where do the important edge-case requirements usually hide?|||Trong use case, yêu cầu trường-hợp-biên quan trọng thường ẩn ở đâu?', options: ['The title|||Tiêu đề', 'The alternative & exception flows|||Các luồng thay thế & ngoại lệ', 'The preconditions only|||Chỉ điều kiện trước', 'The actor name|||Tên actor'], correctIndex: 1, points: 1 },
              { question: 'The user story template is...|||Mẫu user story là...', options: ['Given/When/Then', 'As a <role>, I want <goal>, so that <benefit>|||Là <vai trò>, tôi muốn <mục tiêu>, để <lợi ích>', 'Input/Process/Output', 'Class/Object/Method'], correctIndex: 1, points: 1 },
              { question: 'The "T" in INVEST stands for...|||Chữ "T" trong INVEST là...', options: ['Technical|||Kỹ thuật', 'Testable|||Kiểm thử được', 'Timed|||Có thời hạn', 'Trivial|||Tầm thường'], correctIndex: 1, points: 1 },
              { question: 'A data dictionary exists to...|||Data dictionary tồn tại để...', options: ['Store user passwords|||Lưu mật khẩu người dùng', 'Give one authoritative definition of each data element|||Cho một định nghĩa có thẩm quyền duy nhất cho mỗi phần tử dữ liệu', 'Draw the UI|||Vẽ giao diện', 'List all use cases|||Liệt kê mọi use case'], correctIndex: 1, points: 1 },
              { question: 'In a DFD, an arrow represents a...|||Trong DFD, một mũi tên biểu diễn...', options: ['Process|||Tiến trình', 'Data store|||Kho dữ liệu', 'Data flow|||Luồng dữ liệu', 'External entity|||Thực thể ngoài'], correctIndex: 2, points: 1 },
              { question: 'A many-to-many relationship with no meaning often signals...|||Quan hệ nhiều-nhiều không có ý nghĩa thường báo hiệu...', options: ['A perfect model|||Một mô hình hoàn hảo', 'A missing entity between them|||Một thực thể còn thiếu ở giữa', 'Too many actors|||Quá nhiều actor', 'A design constraint|||Một ràng buộc thiết kế'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — ĐẶC TẢ YÊU CẦU (SRS) ══════════════════ */
    {
      title: 'Chapter 5 — Specification: writing the SRS|||Chương 5 — Đặc tả: viết tài liệu SRS',
      description: 'Cấu trúc SRS chuẩn IEEE 830; đặc tính của yêu cầu tốt; biến câu mơ hồ thành yêu cầu kiểm chứng được.',
      lessons: [
        {
          title: '5.1 — The SRS (IEEE 830) & characteristics of excellent requirements|||5.1 — Tài liệu SRS (IEEE 830) & đặc tính của yêu cầu xuất sắc',
          slug: 'swr302-5-1-srs-ieee-830',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Mẫu SRS theo IEEE 830, các đặc tính rõ–đủ–nhất quán–kiểm chứng được, và cách viết lại yêu cầu mơ hồ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Writing it down: the Software Requirements Specification</h2>
<p class="lead">The <strong>SRS (Software Requirements Specification)</strong> is the primary deliverable of requirements development — the agreed, written contract of what the system will do. The classic structure is <strong>IEEE Std 830-1998</strong>. It's the artifact your Assignment produces and the Theory Exam tests.</p>
<h3>The IEEE 830 SRS template (core sections)</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Introduction</div><div class="lz-nsub">Purpose · scope · definitions · references · overview</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Overall description</div><div class="lz-nsub">Product perspective · functions · user classes · constraints · assumptions</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Specific requirements</div><div class="lz-nsub">Functional requirements · external interfaces · <em>performance &amp; other quality attributes</em></div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Appendices</div><div class="lz-nsub">Data dictionary · analysis models · issues list</div></div></div>
</div>
<p>Every requirement gets a unique <strong>ID</strong> (e.g. FR-12) so it can be traced and referenced. Group functional requirements by feature; keep quality attributes in their own section so they aren't forgotten.</p>
<h3>Characteristics of an excellent requirement</h3>
<p>Wiegers gives a checklist. Each <em>individual</em> requirement should be:</p>
<table>
  <thead><tr><th>Characteristic</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><strong>Correct</strong></td><td>Accurately states a real need.</td></tr>
    <tr><td><strong>Unambiguous</strong></td><td>Has exactly one interpretation.</td></tr>
    <tr><td><strong>Complete</strong></td><td>Nothing missing; includes edge cases &amp; units.</td></tr>
    <tr><td><strong>Consistent</strong></td><td>Doesn't contradict another requirement.</td></tr>
    <tr><td><strong>Verifiable / Testable</strong></td><td>You can design a test that proves it's met.</td></tr>
    <tr><td><strong>Feasible</strong></td><td>Buildable within constraints.</td></tr>
    <tr><td><strong>Necessary</strong></td><td>Traces to a real stakeholder need (no gold plating).</td></tr>
    <tr><td><strong>Prioritized</strong></td><td>Marked must/should/could (Ch10).</td></tr>
  </tbody>
</table>
<p>And the <em>collection</em> as a whole must be complete, consistent, and modifiable (well-organized so a change is easy).</p>
<div class="pitfall"><b>Ambiguity words that make a requirement untestable:</b> "user-friendly", "fast", "efficient", "as appropriate", "etc.", "flexible", "robust", "minimal", "state-of-the-art". If you can't write a test for it, it's not a requirement yet — it's a wish. Replace every vague word with a measurable number.</div>
<h3>Ví dụ có lời giải · Worked example (turn a vague wish into a good requirement)</h3>
<p>A customer says: <em>"The report screen should be fast and easy to use."</em> Let's fix it step by step.</p>
<div class="out"><b>Step 1 — Spot the problems:</b> "fast" (unmeasurable), "easy to use" (unmeasurable), "should" (mandatory?), two requirements jammed in one sentence.
<br><b>Step 2 — Split &amp; ask the numbers:</b> How fast? Under what load? Easy = how measured? Ask the customer: "≤ 3 seconds for up to 10,000 rows" and "a new user finds the export button without help."
<br><b>Step 3 — Rewrite as separate, testable requirements:</b>
<br>&nbsp;&nbsp;<b>FR-21 (performance):</b> "The report screen shall display results within 3 seconds for datasets up to 10,000 rows on the standard test environment."
<br>&nbsp;&nbsp;<b>FR-22 (usability):</b> "A first-time user shall locate and use the Export function within 30 seconds without training, in a usability test with ≥ 8 of 10 participants succeeding."
<br><b>Step 4 — Add acceptance criteria:</b>
<br>&nbsp;&nbsp;• Given a 10,000-row dataset, when the user opens the report, then results render in ≤ 3.0 s (measured 3 times, median).
<br>&nbsp;&nbsp;• In moderated testing, ≥ 80% of new users export a report unaided within 30 s.
<br><b>Result:</b> two vague words became two numbered, testable, independently verifiable requirements — exactly what the developer and tester need.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-requirements%2Flearn&reflabel=SWR302" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">SRS template &amp; requirement-writing guide</span><span class="lc-sub">A ready IEEE-830 SRS skeleton and a checklist for well-written requirements — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Planguage — Tom Gilb's language for quantifying quality.</b> How do you make "user-friendly" testable? Gilb's <b>Planguage</b> gives quality attributes measurable keywords: a <b>Scale</b> (unit of measure), a <b>Meter</b> (how to test it), a <b>Must</b> (minimum acceptable), a <b>Plan</b> (target), and a <b>Wish</b> (ideal). Example — Usability: Scale = seconds for a new user to complete first export; Meter = moderated test with 10 users; Must = &lt; 60 s; Plan = &lt; 30 s; Wish = &lt; 15 s. Planguage is the professional cure for the vague NFR — it turns "nice" into a number a team can commit to and test against.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Ghi lại: tài liệu đặc tả yêu cầu phần mềm (SRS)</h2>
<p class="lead"><strong>SRS (Software Requirements Specification)</strong> là sản phẩm bàn giao chính của giai đoạn phát triển yêu cầu — bản hợp đồng thành văn, đã thống nhất, về những gì hệ thống sẽ làm. Cấu trúc kinh điển là <strong>IEEE Std 830-1998</strong>. Đây là artifact mà Assignment của bạn tạo ra và Theory Exam kiểm tra.</p>
<h3>Mẫu SRS theo IEEE 830 (các mục lõi)</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Giới thiệu (Introduction)</div><div class="lz-nsub">Mục đích · phạm vi · định nghĩa · tài liệu tham chiếu · tổng quan</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Mô tả tổng thể (Overall description)</div><div class="lz-nsub">Bối cảnh sản phẩm · chức năng · user class · ràng buộc · giả định</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Yêu cầu cụ thể (Specific requirements)</div><div class="lz-nsub">Yêu cầu chức năng · giao diện ngoài · <em>hiệu năng &amp; thuộc tính chất lượng khác</em></div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Phụ lục (Appendices)</div><div class="lz-nsub">Data dictionary · mô hình phân tích · danh sách vấn đề mở</div></div></div>
</div>
<p>Mỗi yêu cầu có một <strong>ID</strong> duy nhất (vd FR-12) để truy vết và tham chiếu. Nhóm yêu cầu chức năng theo tính năng; để thuộc tính chất lượng ở mục riêng để không bị quên.</p>
<h3>Đặc tính của một yêu cầu xuất sắc</h3>
<p>Wiegers đưa ra một checklist. Mỗi yêu cầu <em>đơn lẻ</em> nên:</p>
<table>
  <thead><tr><th>Đặc tính</th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td><strong>Đúng (Correct)</strong></td><td>Phát biểu chính xác một nhu cầu thật.</td></tr>
    <tr><td><strong>Không mơ hồ (Unambiguous)</strong></td><td>Chỉ có đúng một cách hiểu.</td></tr>
    <tr><td><strong>Đầy đủ (Complete)</strong></td><td>Không thiếu gì; gồm cả trường hợp biên &amp; đơn vị.</td></tr>
    <tr><td><strong>Nhất quán (Consistent)</strong></td><td>Không mâu thuẫn với yêu cầu khác.</td></tr>
    <tr><td><strong>Kiểm chứng được (Verifiable)</strong></td><td>Thiết kế được một bài test chứng minh nó được thoả.</td></tr>
    <tr><td><strong>Khả thi (Feasible)</strong></td><td>Xây được trong các ràng buộc.</td></tr>
    <tr><td><strong>Cần thiết (Necessary)</strong></td><td>Truy về một nhu cầu stakeholder thật (không gold plating).</td></tr>
    <tr><td><strong>Được ưu tiên (Prioritized)</strong></td><td>Đánh dấu must/should/could (Ch10).</td></tr>
  </tbody>
</table>
<p>Và <em>toàn bộ tập hợp</em> phải đầy đủ, nhất quán, và dễ sửa (tổ chức tốt để một thay đổi thực hiện dễ dàng).</p>
<div class="pitfall"><b>Các từ mơ hồ làm yêu cầu không kiểm thử được:</b> "thân thiện", "nhanh", "hiệu quả", "khi cần thiết", "v.v.", "linh hoạt", "mạnh mẽ", "tối thiểu", "hiện đại". Nếu không viết được bài test cho nó, đó chưa phải yêu cầu — mới là mong muốn. Thay mọi từ mơ hồ bằng một con số đo được.</div>
<h3>Ví dụ có lời giải · Biến mong muốn mơ hồ thành yêu cầu tốt</h3>
<p>Khách nói: <em>"Màn hình báo cáo nên nhanh và dễ dùng."</em> Ta sửa từng bước.</p>
<div class="out"><b>Bước 1 — Nhận diện vấn đề:</b> "nhanh" (không đo được), "dễ dùng" (không đo được), "nên" (bắt buộc không?), hai yêu cầu nhồi trong một câu.
<br><b>Bước 2 — Tách &amp; hỏi con số:</b> Nhanh cỡ nào? Dưới tải nào? Dễ = đo thế nào? Hỏi khách: "≤ 3 giây với tối đa 10.000 dòng" và "user mới tìm được nút export mà không cần trợ giúp."
<br><b>Bước 3 — Viết lại thành các yêu cầu riêng, kiểm thử được:</b>
<br>&nbsp;&nbsp;<b>FR-21 (hiệu năng):</b> "Màn hình báo cáo phải hiển thị kết quả trong 3 giây với tập dữ liệu tới 10.000 dòng trên môi trường test chuẩn."
<br>&nbsp;&nbsp;<b>FR-22 (khả dụng):</b> "Một user lần đầu phải tìm và dùng được chức năng Export trong 30 giây mà không cần đào tạo, trong bài test khả dụng với ≥ 8/10 người thành công."
<br><b>Bước 4 — Thêm acceptance criteria:</b>
<br>&nbsp;&nbsp;• Cho tập 10.000 dòng, khi user mở báo cáo, thì kết quả render trong ≤ 3,0 s (đo 3 lần, lấy trung vị).
<br>&nbsp;&nbsp;• Trong test có điều phối, ≥ 80% user mới export được báo cáo không cần trợ giúp trong 30 s.
<br><b>Kết quả:</b> hai từ mơ hồ đã thành hai yêu cầu được đánh số, kiểm thử được, xác minh độc lập — đúng thứ lập trình viên và tester cần.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fsoftware-requirements%2Flearn&reflabel=SWR302" target="_blank" rel="noopener">
  <span class="lc-ico">📄</span>
  <span class="lc-body"><span class="lc-title">Mẫu SRS &amp; hướng dẫn viết yêu cầu</span><span class="lc-sub">Khung SRS chuẩn IEEE-830 sẵn dùng và checklist viết yêu cầu tốt — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Planguage — ngôn ngữ định lượng chất lượng của Tom Gilb.</b> Làm sao để "dễ dùng" kiểm thử được? <b>Planguage</b> của Gilb gán cho thuộc tính chất lượng các từ khoá đo được: một <b>Scale</b> (đơn vị đo), một <b>Meter</b> (cách test), một <b>Must</b> (mức tối thiểu chấp nhận), một <b>Plan</b> (mục tiêu), và một <b>Wish</b> (lý tưởng). Ví dụ — Khả dụng: Scale = số giây để user mới hoàn tất lần export đầu; Meter = test có điều phối với 10 user; Must = &lt; 60 s; Plan = &lt; 30 s; Wish = &lt; 15 s. Planguage là liều thuốc chuyên nghiệp cho NFR mơ hồ — biến "hay" thành một con số mà đội cam kết và test được.</div>
</div>
`,
        },
        {
          title: 'Quiz 5 — Specification & the SRS|||Quiz 5 — Đặc tả & tài liệu SRS',
          slug: 'swr302-quiz-5',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh chương 5: IEEE 830, đặc tính yêu cầu tốt, khử mơ hồ.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'The SRS is primarily...|||SRS chủ yếu là...', options: ['A test plan|||Một kế hoạch test', 'The agreed written spec of what the system will do|||Bản đặc tả thành văn đã thống nhất về những gì hệ thống sẽ làm', 'The source code|||Mã nguồn', 'A user manual|||Sổ tay người dùng'], correctIndex: 1, points: 1 },
              { question: 'Which standard gives the classic SRS template?|||Tiêu chuẩn nào cho mẫu SRS kinh điển?', options: ['IEEE 830|||IEEE 830', 'RFC 2119|||RFC 2119', 'ISO 9001|||ISO 9001', 'UML 2.0|||UML 2.0'], correctIndex: 0, points: 1 },
              { question: 'A requirement is "verifiable" when...|||Một yêu cầu "kiểm chứng được" khi...', options: ['It sounds nice|||Nghe hay', 'You can design a test proving it is met|||Bạn thiết kế được một test chứng minh nó được thoả', 'It is short|||Nó ngắn', 'It uses the word shall|||Nó dùng từ shall'], correctIndex: 1, points: 1 },
              { question: 'Which word makes a requirement AMBIGUOUS / untestable?|||Từ nào làm yêu cầu MƠ HỒ / không test được?', options: ['"within 3 seconds"|||"trong 3 giây"', '"user-friendly"|||"thân thiện với người dùng"', '"≤ 5 MB"|||"≤ 5 MB"', '"shall reject"|||"phải từ chối"'], correctIndex: 1, points: 1 },
              { question: 'Building a feature no stakeholder asked for is called...|||Xây một tính năng không stakeholder nào yêu cầu gọi là...', options: ['Refactoring|||Tái cấu trúc', 'Gold plating|||Gold plating (mạ vàng)', 'Prototyping|||Prototyping', 'Baselining|||Baseline hoá'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ PROGRESS TEST 1 ══════════════════ */
    {
      title: 'Progress Test 1 — Chapters 1–5|||Progress Test 1 — Chương 1–5',
      description: 'Bài kiểm tra giữa chặng: cơ bản, khách hàng, elicitation, phân tích, đặc tả.',
      lessons: [
        {
          title: 'Progress Test 1 — Requirements development|||Progress Test 1 — Phát triển yêu cầu',
          slug: 'swr302-progress-test-1',
          type: 'QUIZ',
          description: 'Tổng hợp kiến thức chương 1 đến 5.',
          quiz: {
            timeLimitSeconds: 900,
            questions: [
              { question: 'Which level of requirement answers "WHY are we building this"?|||Tầng yêu cầu nào trả lời "VÌ SAO ta xây cái này"?', options: ['Functional|||Chức năng', 'Business|||Kinh doanh', 'System|||Hệ thống', 'Interface|||Giao diện'], correctIndex: 1, points: 1 },
              { question: 'Fixing a requirements defect in production vs in a review costs roughly...|||Sửa lỗi yêu cầu ở vận hành so với lúc review tốn khoảng...', options: ['The same|||Như nhau', 'Much more (order of 100×)|||Nhiều hơn rất nhiều (cỡ 100 lần)', 'Slightly less|||Ít hơn chút', 'Nothing extra|||Không thêm gì'], correctIndex: 1, points: 1 },
              { question: 'To speak for a whole user class in elicitation, recruit a...|||Để nói thay cho cả một user class khi khai thác, hãy tuyển một...', options: ['Product champion|||Product champion', 'Project manager|||Quản lý dự án', 'DBA|||DBA', 'Sponsor|||Nhà tài trợ'], correctIndex: 0, points: 1 },
              { question: 'Which technique reveals unspoken, assumed requirements best?|||Kỹ thuật nào lộ rõ nhất yêu cầu ngầm định không ai nói?', options: ['Questionnaire|||Bảng hỏi', 'Observation|||Quan sát', 'Email survey|||Khảo sát email', 'Reading the contract|||Đọc hợp đồng'], correctIndex: 1, points: 1 },
              { question: 'A use case\'s exception flows exist to capture...|||Luồng ngoại lệ của use case tồn tại để ghi lại...', options: ['The happy path only|||Chỉ đường hạnh phúc', 'What happens when things go wrong|||Điều xảy ra khi có trục trặc', 'The UI colors|||Màu giao diện', 'The database schema|||Lược đồ CSDL'], correctIndex: 1, points: 1 },
              { question: 'A good user story must have ___ to be testable.|||Một user story tốt phải có ___ để kiểm thử được.', options: ['A version number|||Số phiên bản', 'Acceptance criteria|||Acceptance criteria', 'A UML diagram|||Một sơ đồ UML', 'A cost estimate|||Ước tính chi phí'], correctIndex: 1, points: 1 },
              { question: 'A many-to-many relationship with no meaning usually hides...|||Quan hệ nhiều-nhiều không ý nghĩa thường giấu...', options: ['A missing entity|||Một thực thể còn thiếu', 'A syntax error|||Lỗi cú pháp', 'An extra actor|||Một actor thừa', 'A non-functional requirement|||Một yêu cầu phi chức năng'], correctIndex: 0, points: 1 },
              { question: 'Which is NOT a characteristic of an excellent requirement?|||Đâu KHÔNG phải đặc tính của yêu cầu xuất sắc?', options: ['Unambiguous|||Không mơ hồ', 'Verifiable|||Kiểm chứng được', 'Vague|||Mơ hồ', 'Consistent|||Nhất quán'], correctIndex: 2, points: 1 },
              { question: '"The system shall respond within 2 seconds" is which type?|||"Hệ thống phải phản hồi trong 2 giây" là loại nào?', options: ['Functional|||Chức năng', 'Non-functional (performance)|||Phi chức năng (hiệu năng)', 'Business|||Kinh doanh', 'A constraint on language|||Ràng buộc ngôn ngữ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — THẨM ĐỊNH YÊU CẦU ══════════════════ */
    {
      title: 'Chapter 6 — Validating the requirements|||Chương 6 — Thẩm định yêu cầu',
      description: 'Verification vs validation; review & inspection; prototype; acceptance criteria.',
      lessons: [
        {
          title: '6.1 — Reviews, prototypes & acceptance criteria|||6.1 — Review, prototype & acceptance criteria',
          slug: 'swr302-6-1-tham-dinh',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Phân biệt verification/validation, các loại review, dùng prototype giảm rủi ro, viết acceptance criteria.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Are these the RIGHT requirements? — validation</h2>
<p class="lead"><strong>Validation</strong> confirms the requirements describe the system the stakeholders actually want, <em>before</em> you build it — catching errors while they're still cheap (remember the 1:10:100 curve). It's the last gate of requirements development.</p>
<h3>Verification vs validation — don't confuse them</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Verification — "Are we building it right?"</div><div class="lz-ld">Did we follow the standards, is the SRS internally consistent, complete, well-formed? Checks the document against rules.</div></div>
  <div class="lz-layer"><div class="lz-lt">Validation — "Are we building the right thing?"</div><div class="lz-ld">Do these requirements truly meet the stakeholders' needs? Checks the document against reality &amp; intent.</div></div>
</div>
<p>Memory hook: <strong>V</strong>alidation → <strong>V</strong>alue/needs; Verification → conformance to spec/rules.</p>
<h3>Techniques for validating requirements</h3>
<ul>
  <li><strong>Reviews &amp; inspections</strong> — the most effective. Peers read the SRS and hunt defects. A <em>formal inspection</em> (Fagan-style) has defined roles (author, moderator, reader, recorder) and is the gold standard for finding requirement errors early.</li>
  <li><strong>Walkthroughs</strong> — the author leads stakeholders through the requirements informally.</li>
  <li><strong>Prototyping</strong> — build a mock-up so users react to something concrete; validates UI &amp; understanding (Ch8).</li>
  <li><strong>Testing the requirements</strong> — write the tests <em>from</em> the requirements. If you can't write a test, the requirement is not verifiable — a defect in itself.</li>
  <li><strong>Defining acceptance criteria</strong> — the conditions the customer will check to accept the feature.</li>
</ul>
<h3>Acceptance criteria</h3>
<p>Acceptance criteria turn a requirement or story into a pass/fail checklist. A popular format is <strong>Given–When–Then</strong> (from Behavior-Driven Development):</p>
<pre>Given &lt;a context&gt;
When  &lt;an action happens&gt;
Then  &lt;an observable outcome&gt;</pre>
<h3>Ví dụ có lời giải · Worked example (acceptance criteria for a story)</h3>
<p>Story: <em>"As a member, I want to reset my password by email, so that I can regain access."</em> Write its acceptance criteria.</p>
<div class="out"><b>AC-1 (happy path):</b> Given a registered email, When the user requests a reset, Then a reset link valid for 15 minutes is emailed within 60 seconds.
<br><b>AC-2 (use the link):</b> Given a valid, unexpired link, When the user sets a new compliant password, Then the password is updated and the user can log in with it.
<br><b>AC-3 (expired link):</b> Given a link older than 15 minutes, When the user opens it, Then the system rejects it and offers to send a new one.
<br><b>AC-4 (unknown email):</b> Given an email not on file, When a reset is requested, Then the system shows the same neutral confirmation (to avoid leaking which emails exist) and sends no link.
<br><b>Note:</b> AC-4 is a security requirement the plain story never mentioned — writing acceptance criteria forced it out. This is validation catching a gap early.</div>
<div class="pitfall"><b>Reviews fail when they turn into meetings about the author.</b> Inspect the <em>work product</em>, not the person; log defects without debating fixes in the room; and don't review 80 pages in one sitting (defect-finding drops after ~1–2 hours). A rushed, ego-driven review finds nothing — and a requirement error slips through to cost 100×.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Peer review is the single highest-ROI quality practice ever measured.</b> Study after study (Fagan at IBM, then decades of data) shows formal inspections catch <b>50–90% of defects</b> and are far cheaper than finding the same defects in testing or production. Requirements reviews specifically have the best ROI of all because a requirement defect caught here never propagates into design, code and tests. The lesson for your career: the boring practice of carefully reading each other's requirements out-performs almost every fancy tool.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Đây có phải là yêu cầu ĐÚNG không? — thẩm định</h2>
<p class="lead"><strong>Validation (thẩm định)</strong> xác nhận yêu cầu mô tả đúng hệ thống mà stakeholder thật sự muốn, <em>trước</em> khi bạn xây — bắt lỗi khi chúng còn rẻ (nhớ đường cong 1:10:100). Đây là cửa cuối của giai đoạn phát triển yêu cầu.</p>
<h3>Verification vs validation — đừng nhầm</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Verification (kiểm tra) — "Ta có xây ĐÚNG CÁCH không?"</div><div class="lz-ld">Có tuân chuẩn không, SRS có nhất quán nội bộ, đầy đủ, đúng khuôn không? Đối chiếu tài liệu với quy tắc.</div></div>
  <div class="lz-layer"><div class="lz-lt">Validation (thẩm định) — "Ta có xây ĐÚNG THỨ không?"</div><div class="lz-ld">Yêu cầu này có thật sự đáp ứng nhu cầu stakeholder không? Đối chiếu tài liệu với thực tế &amp; ý định.</div></div>
</div>
<p>Mẹo nhớ: <strong>V</strong>alidation → <strong>V</strong>alue/nhu cầu; Verification → tuân theo spec/quy tắc.</p>
<h3>Kỹ thuật thẩm định yêu cầu</h3>
<ul>
  <li><strong>Review &amp; inspection</strong> — hiệu quả nhất. Đồng nghiệp đọc SRS và săn lỗi. Một <em>inspection chính thức</em> (kiểu Fagan) có vai trò xác định (tác giả, moderator, reader, recorder) và là chuẩn vàng để tìm lỗi yêu cầu sớm.</li>
  <li><strong>Walkthrough</strong> — tác giả dẫn stakeholder đi qua yêu cầu một cách phi chính thức.</li>
  <li><strong>Prototyping</strong> — dựng bản mô phỏng để user phản ứng với thứ cụ thể; thẩm định UI &amp; sự hiểu (Ch8).</li>
  <li><strong>Testing the requirements</strong> — viết test <em>từ</em> yêu cầu. Nếu không viết được test, yêu cầu không kiểm chứng được — bản thân là một lỗi.</li>
  <li><strong>Định nghĩa acceptance criteria</strong> — các điều kiện khách sẽ kiểm để chấp nhận tính năng.</li>
</ul>
<h3>Acceptance criteria (tiêu chí chấp nhận)</h3>
<p>Acceptance criteria biến một yêu cầu hoặc story thành checklist đạt/không đạt. Định dạng phổ biến là <strong>Given–When–Then</strong> (từ Behavior-Driven Development):</p>
<pre>Given &lt;một bối cảnh&gt;
When  &lt;một hành động xảy ra&gt;
Then  &lt;một kết quả quan sát được&gt;</pre>
<h3>Ví dụ có lời giải · Acceptance criteria cho một story</h3>
<p>Story: <em>"Là thành viên, tôi muốn đặt lại mật khẩu qua email, để lấy lại quyền truy cập."</em> Viết acceptance criteria.</p>
<div class="out"><b>AC-1 (đường hạnh phúc):</b> Given một email đã đăng ký, When user yêu cầu đặt lại, Then một link đặt lại hiệu lực 15 phút được gửi email trong 60 giây.
<br><b>AC-2 (dùng link):</b> Given một link hợp lệ chưa hết hạn, When user đặt mật khẩu mới hợp lệ, Then mật khẩu được cập nhật và user đăng nhập được bằng nó.
<br><b>AC-3 (link hết hạn):</b> Given một link cũ hơn 15 phút, When user mở nó, Then hệ thống từ chối và đề nghị gửi link mới.
<br><b>AC-4 (email lạ):</b> Given một email không có trong hệ thống, When yêu cầu đặt lại, Then hệ thống hiện cùng một thông báo trung tính (tránh lộ email nào tồn tại) và không gửi link.
<br><b>Ghi chú:</b> AC-4 là một yêu cầu bảo mật mà story trần trụi không hề nhắc — viết acceptance criteria đã buộc nó lộ ra. Đây là thẩm định bắt được lỗ hổng sớm.</div>
<div class="pitfall"><b>Review thất bại khi biến thành cuộc họp phán xét tác giả.</b> Soi <em>sản phẩm</em>, không soi con người; ghi lỗi mà không tranh cãi cách sửa ngay trong phòng; và đừng review 80 trang một lượt (khả năng tìm lỗi tụt sau ~1–2 giờ). Một buổi review vội, đầy cái tôi thì chẳng tìm ra gì — và một lỗi yêu cầu lọt qua để tốn gấp 100 lần.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Peer review là thực hành chất lượng có ROI cao nhất từng được đo.</b> Hết nghiên cứu này tới nghiên cứu khác (Fagan tại IBM, rồi hàng chục năm dữ liệu) cho thấy inspection chính thức bắt <b>50–90% lỗi</b> và rẻ hơn nhiều so với tìm cùng lỗi đó khi test hay vận hành. Riêng review yêu cầu có ROI tốt nhất trong tất cả vì một lỗi yêu cầu bắt được ở đây sẽ không lan vào thiết kế, code và test. Bài học cho sự nghiệp: cái thực hành "nhàm chán" là chăm chú đọc yêu cầu của nhau lại vượt trội gần như mọi công cụ hào nhoáng.</div>
</div>
`,
        },
        {
          title: 'Quiz 6 — Validation|||Quiz 6 — Thẩm định',
          slug: 'swr302-quiz-6',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh chương 6: verification/validation, review, acceptance criteria.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'Validation asks...|||Thẩm định (validation) hỏi...', options: ['"Are we building it right?"|||"Ta xây đúng cách không?"', '"Are we building the right thing?"|||"Ta xây đúng thứ không?"', '"Is the code fast?"|||"Code có nhanh không?"', '"Is it well indented?"|||"Có thụt lề đẹp không?"'], correctIndex: 1, points: 1 },
              { question: 'The most effective technique for finding requirement defects early is...|||Kỹ thuật hiệu quả nhất để tìm lỗi yêu cầu sớm là...', options: ['Formal review / inspection|||Review / inspection chính thức', 'Unit testing|||Test đơn vị', 'Deploying to production|||Deploy lên vận hành', 'Guessing|||Đoán'], correctIndex: 0, points: 1 },
              { question: 'The Given–When–Then format is used to write...|||Định dạng Given–When–Then dùng để viết...', options: ['Source code|||Mã nguồn', 'Acceptance criteria|||Acceptance criteria', 'A data dictionary|||Từ điển dữ liệu', 'A Gantt chart|||Biểu đồ Gantt'], correctIndex: 1, points: 1 },
              { question: 'If you cannot write a test for a requirement, it is...|||Nếu không viết được test cho một yêu cầu, nó...', options: ['Fine as-is|||Ổn như vậy', 'Not verifiable — a defect|||Không kiểm chứng được — một lỗi', 'Automatically complete|||Tự động đầy đủ', 'A business rule|||Một business rule'], correctIndex: 1, points: 1 },
              { question: 'A good review should focus on...|||Một buổi review tốt nên tập trung vào...', options: ['The author\'s mistakes as a person|||Lỗi của tác giả với tư cách cá nhân', 'The work product, logging defects|||Sản phẩm công việc, ghi lại lỗi', 'Fixing everything live|||Sửa mọi thứ ngay tại chỗ', 'Reviewing 80 pages at once|||Review 80 trang một lượt'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — QUẢN LÝ YÊU CẦU ══════════════════ */
    {
      title: 'Chapter 7 — Requirements management|||Chương 7 — Quản lý yêu cầu',
      description: 'Baseline, versioning, change control, và ma trận truy vết (traceability matrix).',
      lessons: [
        {
          title: '7.1 — Baseline, versioning & change control|||7.1 — Baseline, đánh phiên bản & kiểm soát thay đổi',
          slug: 'swr302-7-1-change-control',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Yêu cầu luôn thay đổi; baseline, quản lý phiên bản, quy trình kiểm soát thay đổi và CCB.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Requirements don't stand still — managing change</h2>
<p class="lead">Requirements development ends, but requirements <em>management</em> runs for the whole project. Needs change, markets shift, misunderstandings surface. The goal isn't to <em>prevent</em> change — it's to make change <strong>controlled and visible</strong> instead of chaotic. Uncontrolled change is <strong>scope creep</strong>, the silent project killer.</p>
<h3>The baseline</h3>
<p>A <strong>baseline</strong> is a version of the requirements set that has been reviewed, agreed and "frozen" as the official reference at a point in time. After baselining, you don't edit requirements freely — any change goes through change control. The baseline is what you estimate, build and test against.</p>
<h3>Version control &amp; requirement attributes</h3>
<p>Every requirement carries <strong>attributes</strong> beyond its text: a unique ID, version, status (proposed/approved/implemented/verified/deleted), priority, owner, rationale, and source. Version control on the SRS lets you see <em>what changed, when, and why</em> — the same discipline you use for code.</p>
<h3>The change control process</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Submit request</div><div class="lz-d">Anyone raises a change request (CR)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Impact analysis</div><div class="lz-d">What breaks? cost, schedule, risk, linked reqs</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Decision (CCB)</div><div class="lz-d">Approve / reject / defer</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Update &amp; trace</div><div class="lz-d">New baseline, notify, re-plan</div></div>
</div>
<p>The <strong>Change Control Board (CCB)</strong> is the group with authority to approve or reject changes — usually a small mix of sponsor, lead dev, BA and QA. <strong>Impact analysis</strong> is the key skill: before saying "yes", trace the change through everything it touches (that's where the traceability matrix in 7.2 earns its keep).</p>
<div class="pitfall"><b>"It's just a small change."</b> The most dangerous sentence in software. A one-line requirement change can ripple into design, three modules, five tests and the user manual. Never approve a change on gut feel — run impact analysis first. Skipping it is how projects die by a thousand "small" changes.</div>
<h3>Ví dụ có lời giải · Worked example (impact analysis of a change)</h3>
<p>Change request: "Allow customers to pay with cryptocurrency." Do a quick impact analysis.</p>
<div class="out"><b>Requirements touched:</b> payment use case (new alt flow), refund policy, receipt format, order_status enum (+CRYPTO_PENDING).
<br><b>NFRs affected:</b> security (wallet handling), performance (blockchain confirmation delay breaks the "≤2s confirmation" NFR!).
<br><b>External:</b> new third-party gateway, legal/compliance review, accounting.
<br><b>Verdict:</b> not "small" at all — CCB should defer to a proper mini-project, or reject for this release. Impact analysis turned a one-line request into a visible, informed decision.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Configuration management &amp; the "requirements creep" metric.</b> Mature teams track <b>requirements volatility</b> — the rate of change requests per baseline — as a health signal. A little change is healthy (you're learning); a flood signals the requirements were never really understood, or the scope isn't fenced. Tools like Jira link a requirement to its commits, tests and CRs so every change is auditable. The professional mindset: change is welcome, but every change is <em>recorded, analyzed and traceable</em> — never silent.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Yêu cầu không đứng yên — quản lý thay đổi</h2>
<p class="lead">Giai đoạn phát triển yêu cầu kết thúc, nhưng <em>quản lý</em> yêu cầu chạy suốt cả dự án. Nhu cầu đổi, thị trường xoay, hiểu lầm lộ ra. Mục tiêu không phải <em>ngăn</em> thay đổi — mà là làm thay đổi <strong>được kiểm soát và nhìn thấy được</strong> thay vì hỗn loạn. Thay đổi không kiểm soát chính là <strong>scope creep</strong>, kẻ giết dự án thầm lặng.</p>
<h3>Baseline (mốc chuẩn)</h3>
<p>Một <strong>baseline</strong> là một phiên bản của bộ yêu cầu đã được review, thống nhất và "đóng băng" làm tham chiếu chính thức tại một thời điểm. Sau khi baseline, bạn không sửa yêu cầu tự do — mọi thay đổi đi qua kiểm soát thay đổi. Baseline là thứ bạn ước lượng, xây và test dựa vào.</p>
<h3>Quản lý phiên bản &amp; thuộc tính yêu cầu</h3>
<p>Mỗi yêu cầu mang các <strong>thuộc tính</strong> ngoài phần chữ: ID duy nhất, phiên bản, trạng thái (đề xuất/duyệt/đã làm/đã kiểm/đã xoá), độ ưu tiên, người sở hữu, lý do, và nguồn. Quản lý phiên bản trên SRS cho bạn thấy <em>cái gì đổi, khi nào, và vì sao</em> — đúng kỷ luật bạn dùng cho code.</p>
<h3>Quy trình kiểm soát thay đổi</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Gửi yêu cầu</div><div class="lz-d">Bất kỳ ai nêu một change request (CR)</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Phân tích tác động</div><div class="lz-d">Cái gì hỏng? chi phí, tiến độ, rủi ro, yêu cầu liên quan</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Quyết định (CCB)</div><div class="lz-d">Duyệt / từ chối / hoãn</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Cập nhật &amp; truy vết</div><div class="lz-d">Baseline mới, thông báo, lập lại kế hoạch</div></div>
</div>
<p><strong>Change Control Board (CCB)</strong> là nhóm có thẩm quyền duyệt hoặc từ chối thay đổi — thường là một nhóm nhỏ gồm nhà tài trợ, lead dev, BA và QA. <strong>Phân tích tác động (impact analysis)</strong> là kỹ năng then chốt: trước khi nói "được", hãy truy vết thay đổi qua mọi thứ nó chạm tới (đó là lúc ma trận truy vết ở 7.2 phát huy giá trị).</p>
<div class="pitfall"><b>"Chỉ là thay đổi nhỏ thôi mà."</b> Câu nguy hiểm nhất trong phần mềm. Một thay đổi yêu cầu một dòng có thể lan vào thiết kế, ba module, năm bài test và cả sổ tay người dùng. Đừng bao giờ duyệt thay đổi bằng cảm tính — chạy phân tích tác động trước. Bỏ qua nó là cách dự án chết bởi ngàn thay đổi "nhỏ".</div>
<h3>Ví dụ có lời giải · Phân tích tác động của một thay đổi</h3>
<p>Change request: "Cho khách thanh toán bằng tiền mã hoá (crypto)." Làm nhanh một phân tích tác động.</p>
<div class="out"><b>Yêu cầu bị chạm:</b> use case thanh toán (luồng thay thế mới), chính sách hoàn tiền, định dạng biên lai, enum order_status (+CRYPTO_PENDING).
<br><b>NFR bị ảnh hưởng:</b> bảo mật (xử lý ví), hiệu năng (độ trễ xác nhận blockchain phá vỡ NFR "xác nhận ≤2s"!).
<br><b>Bên ngoài:</b> cổng bên thứ ba mới, rà soát pháp lý/tuân thủ, kế toán.
<br><b>Phán quyết:</b> hoàn toàn không "nhỏ" — CCB nên hoãn thành một tiểu dự án đàng hoàng, hoặc từ chối cho bản phát hành này. Phân tích tác động đã biến một yêu cầu một dòng thành một quyết định nhìn thấy được, có cơ sở.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Quản lý cấu hình &amp; chỉ số "độ biến động yêu cầu".</b> Đội trưởng thành theo dõi <b>requirements volatility</b> — tỉ lệ change request trên mỗi baseline — như một tín hiệu sức khoẻ. Thay đổi ít là lành mạnh (bạn đang học); một cơn lũ báo hiệu yêu cầu chưa từng được hiểu thật, hoặc phạm vi chưa được rào. Công cụ như Jira nối một yêu cầu với các commit, test và CR của nó để mọi thay đổi kiểm toán được. Tư duy chuyên nghiệp: hoan nghênh thay đổi, nhưng mọi thay đổi đều được <em>ghi lại, phân tích và truy vết</em> — không bao giờ âm thầm.</div>
</div>
`,
        },
        {
          title: '7.2 — Requirements traceability|||7.2 — Truy vết yêu cầu (traceability)',
          slug: 'swr302-7-2-traceability',
          type: 'VIDEO',
          description: 'Vì sao truy vết; ma trận truy vết (RTM) nối business→requirement→design→code→test; ví dụ cụ thể.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Links in the requirements chain — traceability</h2>
<p class="lead"><strong>Requirements traceability</strong> means you can follow any requirement <em>forward</em> (to the design, code and tests that implement it) and <em>backward</em> (to the user need and business objective that justify it). It's what makes impact analysis, coverage checking and change control actually possible.</p>
<h3>Why trace?</h3>
<ul>
  <li><strong>Impact analysis</strong> — when a requirement changes, instantly see everything it affects.</li>
  <li><strong>Coverage</strong> — prove every requirement has a test (no untested features) and every test maps to a requirement (no gold plating).</li>
  <li><strong>Completeness</strong> — spot a business objective with no requirement (a gap) or a requirement with no business objective (a candidate to cut).</li>
  <li><strong>Accountability</strong> — for audits &amp; safety-critical systems, show why each line of code exists.</li>
</ul>
<h3>The requirements traceability matrix (RTM)</h3>
<p>The RTM is a table linking each element in the chain. A common form traces <em>Business objective → User requirement → Functional requirement → Design → Code → Test case</em>.</p>
<h3>Ví dụ có lời giải · Worked example (a small RTM)</h3>
<div class="out"><b>Requirements Traceability Matrix — password recovery feature</b></div>
<table>
  <thead><tr><th>Business obj.</th><th>User req.</th><th>Functional req.</th><th>Design module</th><th>Test case</th></tr></thead>
  <tbody>
    <tr><td>BO-1 Cut support tickets 40%</td><td>UR-3 Recover access self-service</td><td>FR-21 Email a 15-min reset link</td><td>AuthService.sendReset()</td><td>TC-14 (AC-1, AC-3)</td></tr>
    <tr><td>BO-1</td><td>UR-3</td><td>FR-22 Reject expired link</td><td>AuthController.reset()</td><td>TC-15 (AC-3)</td></tr>
    <tr><td>BO-1</td><td>UR-3</td><td>FR-23 Neutral msg for unknown email</td><td>AuthService.sendReset()</td><td>TC-16 (AC-4)</td></tr>
  </tbody>
</table>
<p>Read it two ways: <strong>forward</strong> — "Does FR-22 have a test?" Yes, TC-15. <strong>Backward</strong> — "Why does TC-16 exist?" To verify FR-23, which serves user need UR-3, which serves business objective BO-1. If someone proposes deleting FR-23, the matrix instantly shows a security AC (AC-4) and a business objective would be affected.</p>
<div class="pitfall"><b>An RTM you never update is worse than none</b> — it lies. Traceability is only valuable if it's kept current as requirements change; a stale matrix gives false confidence during impact analysis. This is why teams use tools (Jira, DOORS) that maintain links automatically rather than a hand-typed spreadsheet that rots.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Traceability is mandatory in safety-critical &amp; regulated software.</b> In aviation (DO-178C), medical devices (IEC 62304) and automotive (ISO 26262), you legally cannot ship without full bidirectional traceability — auditors must see that every requirement is tested and every line of code traces to a requirement. It's not bureaucracy for its own sake: it's how you prove a pacemaker or a flight control system does exactly what was specified and nothing unspecified. Even outside regulated fields, the same discipline is what lets a team confidently answer "if we change this, what breaks?"</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Các mắt xích trong chuỗi yêu cầu — truy vết</h2>
<p class="lead"><strong>Truy vết yêu cầu (traceability)</strong> nghĩa là bạn theo được bất kỳ yêu cầu nào <em>xuôi</em> (tới thiết kế, code và test hiện thực nó) và <em>ngược</em> (về nhu cầu người dùng và mục tiêu kinh doanh biện minh cho nó). Đó là thứ khiến phân tích tác động, kiểm phủ và kiểm soát thay đổi thật sự khả thi.</p>
<h3>Vì sao phải truy vết?</h3>
<ul>
  <li><strong>Phân tích tác động</strong> — khi một yêu cầu đổi, thấy ngay mọi thứ nó ảnh hưởng.</li>
  <li><strong>Độ phủ (coverage)</strong> — chứng minh mọi yêu cầu có test (không tính năng nào chưa test) và mọi test ánh xạ về một yêu cầu (không gold plating).</li>
  <li><strong>Đầy đủ</strong> — phát hiện mục tiêu kinh doanh không có yêu cầu (một lỗ hổng) hoặc yêu cầu không có mục tiêu kinh doanh (ứng viên để cắt).</li>
  <li><strong>Trách nhiệm giải trình</strong> — với kiểm toán &amp; hệ thống an toàn-trọng yếu, cho thấy vì sao mỗi dòng code tồn tại.</li>
</ul>
<h3>Ma trận truy vết yêu cầu (RTM)</h3>
<p>RTM là một bảng nối mỗi phần tử trong chuỗi. Dạng thường gặp truy vết <em>Mục tiêu kinh doanh → Yêu cầu người dùng → Yêu cầu chức năng → Thiết kế → Code → Test case</em>.</p>
<h3>Ví dụ có lời giải · Một RTM nhỏ</h3>
<div class="out"><b>Ma trận truy vết yêu cầu — tính năng khôi phục mật khẩu</b></div>
<table>
  <thead><tr><th>Mục tiêu KD</th><th>Yêu cầu user</th><th>Yêu cầu chức năng</th><th>Module thiết kế</th><th>Test case</th></tr></thead>
  <tbody>
    <tr><td>BO-1 Giảm 40% ticket hỗ trợ</td><td>UR-3 Tự khôi phục truy cập</td><td>FR-21 Gửi email link đặt lại 15 phút</td><td>AuthService.sendReset()</td><td>TC-14 (AC-1, AC-3)</td></tr>
    <tr><td>BO-1</td><td>UR-3</td><td>FR-22 Từ chối link hết hạn</td><td>AuthController.reset()</td><td>TC-15 (AC-3)</td></tr>
    <tr><td>BO-1</td><td>UR-3</td><td>FR-23 Thông báo trung tính cho email lạ</td><td>AuthService.sendReset()</td><td>TC-16 (AC-4)</td></tr>
  </tbody>
</table>
<p>Đọc theo hai chiều: <strong>xuôi</strong> — "FR-22 có test không?" Có, TC-15. <strong>ngược</strong> — "Vì sao TC-16 tồn tại?" Để kiểm FR-23, phục vụ nhu cầu UR-3, phục vụ mục tiêu BO-1. Nếu ai đó đề xuất xoá FR-23, ma trận lập tức cho thấy một AC bảo mật (AC-4) và một mục tiêu kinh doanh sẽ bị ảnh hưởng.</p>
<div class="pitfall"><b>Một RTM không bao giờ cập nhật còn tệ hơn không có</b> — nó nói dối. Truy vết chỉ có giá trị nếu được giữ đúng khi yêu cầu đổi; một ma trận cũ cho sự tự tin sai lầm lúc phân tích tác động. Đó là lý do đội dùng công cụ (Jira, DOORS) tự duy trì liên kết thay vì một bảng tính gõ tay rồi mục ruỗng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Truy vết là bắt buộc trong phần mềm an toàn-trọng yếu &amp; bị quản lý chặt.</b> Trong hàng không (DO-178C), thiết bị y tế (IEC 62304) và ô tô (ISO 26262), về mặt pháp lý bạn không thể phát hành nếu thiếu truy vết hai chiều đầy đủ — kiểm toán viên phải thấy mọi yêu cầu được test và mọi dòng code truy về một yêu cầu. Đây không phải thủ tục vì thủ tục: đó là cách bạn chứng minh một máy tạo nhịp tim hay hệ điều khiển bay làm đúng những gì đặc tả và không làm gì ngoài đặc tả. Kể cả ngoài các lĩnh vực bị quản lý, cùng kỷ luật đó là thứ cho một đội tự tin trả lời "nếu ta đổi cái này, cái gì hỏng?"</div>
</div>
`,
        },
        {
          title: 'Quiz 7 — Requirements management|||Quiz 7 — Quản lý yêu cầu',
          slug: 'swr302-quiz-7',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh chương 7: baseline, change control, traceability.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'A baseline is...|||Một baseline là...', options: ['The first draft|||Bản nháp đầu tiên', 'A reviewed, agreed, frozen version used as the official reference|||Một phiên bản đã review, thống nhất, đóng băng làm tham chiếu chính thức', 'A type of test|||Một loại test', 'The final code|||Mã nguồn cuối cùng'], correctIndex: 1, points: 1 },
              { question: 'Uncontrolled requirement growth is called...|||Yêu cầu phình to không kiểm soát gọi là...', options: ['Refactoring|||Tái cấu trúc', 'Scope creep|||Scope creep', 'Baselining|||Baseline hoá', 'Traceability|||Truy vết'], correctIndex: 1, points: 1 },
              { question: 'Before approving a change, you should perform...|||Trước khi duyệt một thay đổi, bạn nên thực hiện...', options: ['A code review|||Review code', 'Impact analysis|||Phân tích tác động', 'A deployment|||Một lần deploy', 'A survey|||Một khảo sát'], correctIndex: 1, points: 1 },
              { question: 'The group authorized to approve/reject changes is the...|||Nhóm có thẩm quyền duyệt/từ chối thay đổi là...', options: ['CCB (Change Control Board)|||CCB (Change Control Board)', 'The QA team alone|||Chỉ đội QA', 'The users|||Người dùng', 'The DBA|||DBA'], correctIndex: 0, points: 1 },
              { question: 'Forward traceability lets you check that every requirement...|||Truy vết xuôi cho bạn kiểm rằng mọi yêu cầu...', options: ['Has a business objective|||Có một mục tiêu kinh doanh', 'Has design, code and a test|||Có thiết kế, code và một test', 'Is short|||Ngắn gọn', 'Uses the word shall|||Dùng từ shall'], correctIndex: 1, points: 1 },
              { question: 'A traceability matrix that is never updated...|||Một ma trận truy vết không bao giờ cập nhật...', options: ['Is perfectly fine|||Hoàn toàn ổn', 'Gives false confidence and can mislead|||Cho sự tự tin sai và có thể gây lạc hướng', 'Speeds up coding|||Tăng tốc code', 'Replaces testing|||Thay thế việc test'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — TỪ YÊU CẦU TỚI THIẾT KẾ OO & PROTOTYPING ══════════════════ */
    {
      title: 'Chapter 8 — From requirements to OO design & prototyping|||Chương 8 — Từ yêu cầu tới thiết kế OO & prototyping',
      description: 'Chuyển yêu cầu thành thiết kế hướng đối tượng; giảm rủi ro bằng prototype (throwaway vs evolutionary).',
      lessons: [
        {
          title: '8.1 — OO design from requirements & risk reduction through prototyping|||8.1 — Thiết kế OO từ yêu cầu & giảm rủi ro bằng prototyping',
          slug: 'swr302-8-1-oo-design-prototyping',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Từ danh từ/động từ trong yêu cầu ra lớp/phương thức; prototype throwaway vs evolutionary; rủi ro của prototyping.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Bridging requirements to an object-oriented design</h2>
<p class="lead">Requirements say <em>what</em>; design says <em>how</em>. SWR302 asks you to take the next step (CLO6): turn a requirements model into a first <strong>object-oriented design</strong>. The domain model you built in Ch4 is the seed — the classes are already there.</p>
<h3>From requirements to classes: noun–verb analysis</h3>
<p>A simple, powerful heuristic: in the requirements/use cases, the <strong>nouns</strong> suggest candidate <em>classes</em> and their <em>attributes</em>; the <strong>verbs</strong> suggest <em>methods</em> (responsibilities).</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nouns</div><div class="lz-t">Classes / attributes</div><div class="lz-d">Customer, Order, Book, total</div></div>
  <div class="lz-step"><div class="lz-k">Verbs</div><div class="lz-t">Methods</div><div class="lz-d">placeOrder(), calculateTotal()</div></div>
  <div class="lz-step"><div class="lz-k">Relations</div><div class="lz-t">Associations</div><div class="lz-d">Customer places Order</div></div>
</div>
<h3>Ví dụ có lời giải · Worked example (requirement → classes)</h3>
<p>Requirement: "A <u>customer</u> <u>places</u> an <u>order</u> containing one or more <u>books</u>; the system <u>calculates</u> the order <u>total</u> including tax."</p>
<div class="out"><b>Candidate classes (nouns):</b> Customer, Order, OrderLine, Book.
<br><b>Attributes:</b> Order.total, Order.tax, Book.price, OrderLine.quantity.
<br><b>Methods (verbs):</b> Customer.placeOrder(), Order.calculateTotal(), Order.addLine(book, qty).
<br><b>Associations:</b> Customer 1—* Order; Order 1—* OrderLine; OrderLine *—1 Book.
<br><b>Result:</b> a clean first-cut class diagram — refine it with encapsulation (make fields private, expose methods) as you learned in OOP.</div>
<p>This isn't final design (no design patterns, persistence, etc.) — it's the traceable bridge from the requirements model to code, and it's exactly what the Practical Exam may ask you to draw.</p>
<h3>Risk reduction through prototyping (CLO8)</h3>
<p>A <strong>prototype</strong> is a partial, preliminary version built to <em>learn</em> — to reduce a risk before committing to full development. When requirements are uncertain or the UI is hard to imagine, a prototype gets concrete feedback fast.</p>
<table>
  <thead><tr><th></th><th>Throwaway prototype</th><th>Evolutionary prototype</th></tr></thead>
  <tbody>
    <tr><td>Purpose</td><td>Answer a question, then discard</td><td>Grow it into the real product</td></tr>
    <tr><td>Quality</td><td>Quick &amp; dirty (mock-up, paper)</td><td>Built to keep — production quality</td></tr>
    <tr><td>Best for</td><td>Clarifying fuzzy requirements / UI</td><td>Incremental delivery when core is understood</td></tr>
  </tbody>
</table>
<p>Also: <strong>mock-ups</strong> &amp; <strong>proofs of concept</strong>, and <strong>paper vs electronic</strong> prototypes. A paper sketch is cheapest for early UI feedback; an interactive electronic prototype is better for flow and feel.</p>
<div class="pitfall"><b>The throwaway that wouldn't die.</b> The classic prototyping risk: a "quick and dirty" throwaway prototype looks done, so a manager says "ship it!" — and its shortcut, unmaintainable code becomes the product's foundation. If a prototype is throwaway, make it <em>obviously</em> rough (paper, greyscale) so no one mistakes it for the real thing. Also beware setting false expectations: users who see a slick prototype may assume the hard 90% is nearly finished.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "three amigos" — requirements are a team sport.</b> Modern teams refine each requirement/story in a short conversation among <b>three amigos</b>: the <b>BA/PO</b> (what &amp; why), the <b>developer</b> (how &amp; feasibility), and the <b>tester/QA</b> (how do we prove it / what breaks). Each viewpoint catches what the others miss — the tester spots the missing edge case, the developer flags the impossible NFR, the BA keeps the user's goal central. A prototype is often the artifact they gather around. The deeper lesson of SWR302: good requirements don't come from one BA in isolation, but from structured collaboration that surfaces gaps before code is written.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Bắc cầu từ yêu cầu tới thiết kế hướng đối tượng</h2>
<p class="lead">Yêu cầu nói <em>cái gì</em>; thiết kế nói <em>làm thế nào</em>. SWR302 yêu cầu bạn đi bước tiếp (CLO6): biến một mô hình yêu cầu thành một <strong>thiết kế hướng đối tượng</strong> đầu tiên. Domain model bạn dựng ở Ch4 là hạt giống — các lớp đã có sẵn ở đó.</p>
<h3>Từ yêu cầu ra lớp: phân tích danh từ–động từ</h3>
<p>Một heuristic đơn giản mà mạnh: trong yêu cầu/use case, <strong>danh từ</strong> gợi ý các <em>lớp</em> ứng viên và <em>thuộc tính</em> của chúng; <strong>động từ</strong> gợi ý các <em>phương thức</em> (trách nhiệm).</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Danh từ</div><div class="lz-t">Lớp / thuộc tính</div><div class="lz-d">Customer, Order, Book, total</div></div>
  <div class="lz-step"><div class="lz-k">Động từ</div><div class="lz-t">Phương thức</div><div class="lz-d">placeOrder(), calculateTotal()</div></div>
  <div class="lz-step"><div class="lz-k">Quan hệ</div><div class="lz-t">Liên kết</div><div class="lz-d">Customer places Order</div></div>
</div>
<h3>Ví dụ có lời giải · Yêu cầu → lớp</h3>
<p>Yêu cầu: "Một <u>khách hàng</u> <u>đặt</u> một <u>đơn</u> chứa một hoặc nhiều <u>cuốn sách</u>; hệ thống <u>tính</u> <u>tổng</u> đơn bao gồm thuế."</p>
<div class="out"><b>Lớp ứng viên (danh từ):</b> Customer, Order, OrderLine, Book.
<br><b>Thuộc tính:</b> Order.total, Order.tax, Book.price, OrderLine.quantity.
<br><b>Phương thức (động từ):</b> Customer.placeOrder(), Order.calculateTotal(), Order.addLine(book, qty).
<br><b>Liên kết:</b> Customer 1—* Order; Order 1—* OrderLine; OrderLine *—1 Book.
<br><b>Kết quả:</b> một sơ đồ lớp bản nháp sạch sẽ — tinh chỉnh bằng đóng gói (để field private, phơi ra phương thức) như đã học ở OOP.</div>
<p>Đây chưa phải thiết kế cuối (chưa design pattern, lưu trữ, v.v.) — nó là cây cầu truy vết được từ mô hình yêu cầu tới code, và đúng là thứ Practical Exam có thể yêu cầu bạn vẽ.</p>
<h3>Giảm rủi ro bằng prototyping (CLO8)</h3>
<p>Một <strong>prototype</strong> là bản một phần, sơ bộ, dựng để <em>học</em> — để giảm một rủi ro trước khi cam kết phát triển đầy đủ. Khi yêu cầu chưa chắc chắn hoặc UI khó hình dung, một prototype lấy phản hồi cụ thể thật nhanh.</p>
<table>
  <thead><tr><th></th><th>Throwaway (bỏ đi)</th><th>Evolutionary (tiến hoá)</th></tr></thead>
  <tbody>
    <tr><td>Mục đích</td><td>Trả lời một câu hỏi, rồi vứt</td><td>Nuôi lớn thành sản phẩm thật</td></tr>
    <tr><td>Chất lượng</td><td>Nhanh &amp; thô (mock-up, giấy)</td><td>Dựng để giữ — chất lượng vận hành</td></tr>
    <tr><td>Hợp cho</td><td>Làm rõ yêu cầu / UI mơ hồ</td><td>Giao tăng dần khi phần lõi đã hiểu</td></tr>
  </tbody>
</table>
<p>Ngoài ra: <strong>mock-up</strong> &amp; <strong>proof of concept</strong>, và prototype <strong>giấy vs điện tử</strong>. Bản phác trên giấy rẻ nhất cho phản hồi UI sớm; một prototype điện tử tương tác tốt hơn cho luồng và cảm giác.</p>
<div class="pitfall"><b>Cái throwaway không chịu chết.</b> Rủi ro prototyping kinh điển: một prototype "nhanh &amp; thô" trông như đã xong, nên sếp bảo "ship luôn!" — và cái code chắp vá, không bảo trì được của nó trở thành nền móng sản phẩm. Nếu một prototype là loại bỏ đi, hãy làm nó <em>thô ra mặt</em> (giấy, đen trắng) để không ai nhầm là hàng thật. Cũng coi chừng đặt kỳ vọng sai: user thấy một prototype bóng bẩy có thể tưởng 90% phần khó đã gần xong.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Three amigos" — yêu cầu là môn thể thao đồng đội.</b> Đội hiện đại tinh chỉnh mỗi yêu cầu/story trong một cuộc trò chuyện ngắn giữa <b>ba người bạn</b>: <b>BA/PO</b> (cái gì &amp; vì sao), <b>lập trình viên</b> (làm thế nào &amp; khả thi), và <b>tester/QA</b> (chứng minh ra sao / cái gì hỏng). Mỗi góc nhìn bắt được điều người khác bỏ sót — tester phát hiện trường hợp biên còn thiếu, dev cảnh báo NFR bất khả thi, BA giữ mục tiêu người dùng làm trung tâm. Một prototype thường là artifact họ tụ quanh. Bài học sâu của SWR302: yêu cầu tốt không đến từ một BA đơn độc, mà từ hợp tác có cấu trúc làm lộ lỗ hổng trước khi viết code.</div>
</div>
`,
        },
        {
          title: 'Quiz 8 — OO design & prototyping|||Quiz 8 — Thiết kế OO & prototyping',
          slug: 'swr302-quiz-8',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh chương 8: noun-verb, throwaway vs evolutionary, rủi ro prototype.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'In noun-verb analysis, nouns most often suggest...|||Trong phân tích danh từ-động từ, danh từ thường gợi ý...', options: ['Methods|||Phương thức', 'Candidate classes / attributes|||Lớp ứng viên / thuộc tính', 'Test cases|||Test case', 'User classes|||User class'], correctIndex: 1, points: 1 },
              { question: 'A throwaway prototype is built to...|||Một throwaway prototype được dựng để...', options: ['Become the final product|||Trở thành sản phẩm cuối', 'Answer a question, then be discarded|||Trả lời một câu hỏi rồi bị vứt', 'Replace the SRS|||Thay thế SRS', 'Run in production|||Chạy ở vận hành'], correctIndex: 1, points: 1 },
              { question: 'The main purpose of prototyping is to...|||Mục đích chính của prototyping là...', options: ['Write final code fast|||Viết code cuối nhanh', 'Reduce risk / clarify uncertain requirements|||Giảm rủi ro / làm rõ yêu cầu chưa chắc', 'Skip requirements|||Bỏ qua yêu cầu', 'Avoid testing|||Tránh test'], correctIndex: 1, points: 1 },
              { question: 'A key risk of prototyping is...|||Một rủi ro then chốt của prototyping là...', options: ['It is always too slow|||Luôn quá chậm', 'A throwaway prototype gets shipped as the real product|||Một throwaway prototype bị ship làm sản phẩm thật', 'It needs no users|||Không cần người dùng', 'It cannot show UI|||Không thể hiện UI'], correctIndex: 1, points: 1 },
              { question: 'The "three amigos" are typically...|||"Three amigos" thường là...', options: ['Three developers|||Ba lập trình viên', 'BA/PO, developer, and tester/QA|||BA/PO, lập trình viên, và tester/QA', 'Three managers|||Ba quản lý', 'Three users|||Ba người dùng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ PROGRESS TEST 2 ══════════════════ */
    {
      title: 'Progress Test 2 — Chapters 6–8|||Progress Test 2 — Chương 6–8',
      description: 'Bài kiểm tra giữa chặng: thẩm định, quản lý yêu cầu, thiết kế & prototyping.',
      lessons: [
        {
          title: 'Progress Test 2 — Validation, management & design|||Progress Test 2 — Thẩm định, quản lý & thiết kế',
          slug: 'swr302-progress-test-2',
          type: 'QUIZ',
          description: 'Tổng hợp kiến thức chương 6 đến 8.',
          quiz: {
            timeLimitSeconds: 720,
            questions: [
              { question: 'Verification checks conformance to spec; validation checks...|||Verification kiểm tuân theo spec; validation kiểm...', options: ['Code speed|||Tốc độ code', 'Whether it meets real stakeholder needs|||Có đáp ứng nhu cầu stakeholder thật không', 'Indentation|||Thụt lề', 'File size|||Kích thước file'], correctIndex: 1, points: 1 },
              { question: 'Which format writes acceptance criteria?|||Định dạng nào viết acceptance criteria?', options: ['Given-When-Then|||Given-When-Then', 'For-While-Do|||For-While-Do', 'Try-Catch-Finally|||Try-Catch-Finally', 'Create-Read-Update|||Create-Read-Update'], correctIndex: 0, points: 1 },
              { question: 'After a baseline, requirement changes must go through...|||Sau khi baseline, thay đổi yêu cầu phải đi qua...', options: ['Nothing, edit freely|||Không gì cả, sửa tự do', 'The change control process|||Quy trình kiểm soát thay đổi', 'A new project|||Một dự án mới', 'The compiler|||Trình biên dịch'], correctIndex: 1, points: 1 },
              { question: 'Backward traceability answers...|||Truy vết ngược trả lời...', options: ['"Does this requirement have a test?"|||"Yêu cầu này có test không?"', '"Why does this code / test exist?"|||"Vì sao code / test này tồn tại?"', '"Is the code fast?"|||"Code có nhanh không?"', '"Who is online?"|||"Ai đang online?"'], correctIndex: 1, points: 1 },
              { question: 'In noun-verb analysis, verbs suggest...|||Trong phân tích danh từ-động từ, động từ gợi ý...', options: ['Attributes|||Thuộc tính', 'Methods / responsibilities|||Phương thức / trách nhiệm', 'User classes|||User class', 'Baselines|||Baseline'], correctIndex: 1, points: 1 },
              { question: 'The safest way to keep a throwaway prototype throwaway is to...|||Cách an toàn nhất để giữ throwaway prototype đúng là loại bỏ đi là...', options: ['Make it production quality|||Làm nó chất lượng vận hành', 'Make it obviously rough (paper, greyscale)|||Làm nó thô ra mặt (giấy, đen trắng)', 'Hide it from users|||Giấu nó khỏi người dùng', 'Add more features|||Thêm nhiều tính năng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 9 (NÂNG CAO) — YÊU CẦU TRONG AGILE ══════════════════ */
    {
      title: 'Chapter 9 (Advanced) — Requirements on Agile projects|||Chương 9 (Nâng cao) — Yêu cầu trong dự án Agile',
      description: 'Giới hạn của waterfall; product backlog; user story mapping; grooming; definition of done.',
      lessons: [
        {
          title: '9.1 — Agile requirements: backlog, story mapping & the definition of done|||9.1 — Yêu cầu Agile: backlog, story mapping & definition of done',
          slug: 'swr302-9-1-agile-requirements',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Vì sao Agile thay đổi cách làm yêu cầu; product backlog; story mapping; grooming; DoD vs acceptance criteria.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1 · Advanced</span>
<h2>Requirements when everything can change — the Agile way</h2>
<p class="lead">The waterfall assumption — "specify everything up front, then build" — breaks when requirements are uncertain and markets move fast. <strong>Agile</strong> doesn't abandon requirements engineering; it does the same activities <em>continuously, in small batches, closest to the moment of building</em>. Everything you learned still applies — it's just re-timed.</p>
<h3>Limitations of the waterfall</h3>
<ul>
  <li>Assumes requirements are knowable and stable up front — often false.</li>
  <li>Feedback comes late (at delivery), so requirement errors surface at their most expensive.</li>
  <li>A big signed SRS resists change, yet change is inevitable.</li>
</ul>
<h3>The product backlog</h3>
<p>In Agile the SRS is replaced (mostly) by a living <strong>product backlog</strong>: a prioritized, ever-evolving list of user stories and other work, owned by the <strong>Product Owner (PO)</strong>. Items near the top are refined and detailed (ready to build); items lower down stay coarse until they matter. This is <strong>progressive elaboration</strong> — detail added just in time.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Top</div><div class="lz-t">Ready stories</div><div class="lz-d">Small, detailed, estimated, testable</div></div>
  <div class="lz-step"><div class="lz-k">Middle</div><div class="lz-t">Coarser stories</div><div class="lz-d">Being refined</div></div>
  <div class="lz-step"><div class="lz-k">Bottom</div><div class="lz-t">Epics / themes</div><div class="lz-d">Big, vague, later</div></div>
</div>
<h3>User story mapping</h3>
<p>A flat backlog loses the big picture. <strong>User story mapping</strong> (Jeff Patton) arranges stories in two dimensions: the <em>backbone</em> across the top is the user's journey (activities in sequence — "browse → add to cart → pay → track"), and beneath each step hang the detailed stories, ordered by priority. Slice horizontally to define a <strong>walking skeleton</strong> — a thin end-to-end release that touches every step — then add depth in later releases.</p>
<h3>Backlog grooming &amp; Definition of Done</h3>
<p><strong>Backlog refinement (grooming)</strong> is the ongoing elicitation/analysis/validation for Agile — the team keeps top items ready. Two "done" concepts you must not confuse:</p>
<table>
  <thead><tr><th>Acceptance criteria</th><th>Definition of Done (DoD)</th></tr></thead>
  <tbody>
    <tr><td>Per-story: is THIS story's behavior correct?</td><td>Team-wide: what "done" means for EVERY story</td></tr>
    <tr><td>e.g. "expired link is rejected"</td><td>e.g. "code reviewed, tested, docs updated, deployed to staging"</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>"We're Agile, so we don't do requirements."</b> A dangerous myth. Agile does <em>more</em> requirements conversations, not fewer — just smaller and continuous. Teams that skip acceptance criteria and refinement don't become fast; they become a feature factory building the wrong things quickly. Agile removes the big up-front document, not the thinking.</div>
<h3>Ví dụ có lời giải · Worked example (map a story)</h3>
<div class="out"><b>Epic:</b> "Customer buys a product."
<br><b>Backbone (activities):</b> Browse → Select → Checkout → Pay → Track.
<br><b>Stories under "Checkout":</b> apply coupon (Should), save cart (Could), guest checkout (Must), address book (Could).
<br><b>Walking skeleton (Release 1):</b> one thin story per backbone step so a customer can complete a purchase end-to-end — even if minimal — then deepen each step in Release 2+.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The requirements never disappear — they change form.</b> Compare the same requirement across paradigms: waterfall writes <em>SRS §3.4 FR-21</em>; Agile writes a <em>story card + acceptance criteria</em>; a regulated Agile team keeps <em>both</em> plus traceability. The underlying need is identical — "a user can reset their password" — only the packaging and timing differ. Senior engineers see through the ceremony to the invariant: <b>every method must elicit, analyze, specify, validate and manage requirements — the question is only how much, how formal, and how early.</b> Master that and you can work in any process.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1 · Nâng cao</span>
<h2>Yêu cầu khi mọi thứ có thể đổi — cách Agile</h2>
<p class="lead">Giả định của waterfall — "đặc tả hết từ đầu, rồi xây" — sụp đổ khi yêu cầu chưa chắc chắn và thị trường xoay nhanh. <strong>Agile</strong> không vứt bỏ kỹ nghệ yêu cầu; nó làm đúng các hoạt động đó nhưng <em>liên tục, theo lô nhỏ, sát thời điểm xây nhất</em>. Mọi thứ bạn đã học vẫn áp dụng — chỉ là được sắp lại thời điểm.</p>
<h3>Giới hạn của waterfall</h3>
<ul>
  <li>Giả định yêu cầu biết được và ổn định từ đầu — thường sai.</li>
  <li>Phản hồi đến muộn (lúc bàn giao), nên lỗi yêu cầu lộ ra ở lúc đắt nhất.</li>
  <li>Một SRS lớn đã ký kháng cự thay đổi, trong khi thay đổi là tất yếu.</li>
</ul>
<h3>Product backlog</h3>
<p>Trong Agile, SRS phần lớn được thay bằng một <strong>product backlog</strong> sống: một danh sách user story và công việc khác, được ưu tiên và luôn tiến hoá, do <strong>Product Owner (PO)</strong> sở hữu. Mục gần đỉnh được tinh chỉnh và chi tiết (sẵn sàng xây); mục dưới thấp còn thô cho tới khi cần. Đây là <strong>progressive elaboration</strong> — thêm chi tiết đúng lúc.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Đỉnh</div><div class="lz-t">Story sẵn sàng</div><div class="lz-d">Nhỏ, chi tiết, ước lượng, test được</div></div>
  <div class="lz-step"><div class="lz-k">Giữa</div><div class="lz-t">Story thô hơn</div><div class="lz-d">Đang được tinh chỉnh</div></div>
  <div class="lz-step"><div class="lz-k">Đáy</div><div class="lz-t">Epic / theme</div><div class="lz-d">To, mơ hồ, để sau</div></div>
</div>
<h3>User story mapping</h3>
<p>Một backlog phẳng làm mất bức tranh lớn. <strong>User story mapping</strong> (Jeff Patton) xếp story theo hai chiều: <em>xương sống (backbone)</em> ở trên là hành trình người dùng (các hoạt động theo trình tự — "duyệt → thêm giỏ → thanh toán → theo dõi"), và dưới mỗi bước treo các story chi tiết, sắp theo ưu tiên. Cắt ngang để định nghĩa một <strong>walking skeleton</strong> — một bản phát hành mỏng đầu-cuối chạm mọi bước — rồi thêm chiều sâu ở các bản sau.</p>
<h3>Grooming backlog &amp; Definition of Done</h3>
<p><strong>Backlog refinement (grooming)</strong> là elicitation/analysis/validation liên tục của Agile — đội giữ các mục đỉnh luôn sẵn sàng. Hai khái niệm "xong" không được nhầm:</p>
<table>
  <thead><tr><th>Acceptance criteria</th><th>Definition of Done (DoD)</th></tr></thead>
  <tbody>
    <tr><td>Theo từng story: hành vi của story NÀY có đúng không?</td><td>Toàn đội: "xong" nghĩa là gì cho MỌI story</td></tr>
    <tr><td>vd "link hết hạn bị từ chối"</td><td>vd "đã review code, test, cập nhật docs, deploy staging"</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>"Tụi mình Agile nên không làm yêu cầu."</b> Một lầm tưởng nguy hiểm. Agile làm <em>nhiều</em> cuộc trò chuyện yêu cầu hơn, không phải ít — chỉ là nhỏ hơn và liên tục. Đội bỏ qua acceptance criteria và refinement không trở nên nhanh; họ thành một nhà máy tính năng xây nhanh những thứ sai. Agile bỏ tài liệu lớn đầu dự án, không bỏ việc suy nghĩ.</div>
<h3>Ví dụ có lời giải · Lập bản đồ một story</h3>
<div class="out"><b>Epic:</b> "Khách mua một sản phẩm."
<br><b>Xương sống (hoạt động):</b> Duyệt → Chọn → Checkout → Thanh toán → Theo dõi.
<br><b>Story dưới "Checkout":</b> áp mã giảm giá (Should), lưu giỏ (Could), checkout khách vãng lai (Must), sổ địa chỉ (Could).
<br><b>Walking skeleton (Release 1):</b> một story mỏng cho mỗi bước xương sống để khách hoàn tất được một lần mua đầu-cuối — dù tối thiểu — rồi đào sâu từng bước ở Release 2+.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Yêu cầu không bao giờ biến mất — chúng đổi hình dạng.</b> So cùng một yêu cầu qua các mô hình: waterfall viết <em>SRS §3.4 FR-21</em>; Agile viết một <em>thẻ story + acceptance criteria</em>; một đội Agile bị quản lý chặt giữ <em>cả hai</em> cộng truy vết. Nhu cầu nền tảng y hệt — "một user đặt lại được mật khẩu" — chỉ khác cách đóng gói và thời điểm. Kỹ sư giỏi nhìn xuyên qua nghi thức tới bất biến: <b>mọi phương pháp đều phải khai thác, phân tích, đặc tả, thẩm định và quản lý yêu cầu — câu hỏi chỉ là bao nhiêu, chính thức tới đâu, và sớm cỡ nào.</b> Nắm được điều đó, bạn làm được trong mọi quy trình.</div>
</div>
`,
        },
        {
          title: 'Quiz 9 — Agile requirements|||Quiz 9 — Yêu cầu Agile',
          slug: 'swr302-quiz-9',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh chương 9: backlog, story mapping, DoD.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'In Agile, the SRS is largely replaced by...|||Trong Agile, SRS phần lớn được thay bằng...', options: ['A Gantt chart|||Biểu đồ Gantt', 'A living, prioritized product backlog|||Một product backlog sống, được ưu tiên', 'The source code|||Mã nguồn', 'Nothing|||Không gì cả'], correctIndex: 1, points: 1 },
              { question: 'Adding requirement detail "just in time" is called...|||Thêm chi tiết yêu cầu "đúng lúc" gọi là...', options: ['Progressive elaboration|||Progressive elaboration', 'Big design up front|||Thiết kế lớn đầu dự án', 'Scope creep|||Scope creep', 'Baselining|||Baseline hoá'], correctIndex: 0, points: 1 },
              { question: 'User story mapping arranges stories along...|||User story mapping sắp story dọc theo...', options: ['Alphabetical order|||Thứ tự bảng chữ cái', 'The user journey (backbone) with priority beneath|||Hành trình người dùng (xương sống) với ưu tiên bên dưới', 'Developer names|||Tên lập trình viên', 'File size|||Kích thước file'], correctIndex: 1, points: 1 },
              { question: 'The Definition of Done applies to...|||Definition of Done áp dụng cho...', options: ['One specific story only|||Chỉ một story cụ thể', 'Every story, team-wide|||Mọi story, toàn đội', 'Only the final release|||Chỉ bản phát hành cuối', 'Only bugs|||Chỉ lỗi'], correctIndex: 1, points: 1 },
              { question: 'Which statement is TRUE?|||Câu nào ĐÚNG?', options: ['Agile means no requirements work|||Agile nghĩa là không làm yêu cầu', 'Agile does continuous, smaller requirements work|||Agile làm yêu cầu liên tục, theo lô nhỏ hơn', 'Agile forbids acceptance criteria|||Agile cấm acceptance criteria', 'Agile skips validation|||Agile bỏ qua thẩm định'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 10 (NÂNG CAO) — ƯU TIÊN & YÊU CẦU CHO AI/ML ══════════════════ */
    {
      title: 'Chapter 10 (Advanced) — Prioritization & requirements for AI/ML systems|||Chương 10 (Nâng cao) — Ưu tiên & yêu cầu cho hệ thống AI/ML',
      description: 'Ưu tiên yêu cầu (MoSCoW, value/cost/risk, Kano); và cách yêu cầu khác đi cho hệ thống AI/ML.',
      lessons: [
        {
          title: '10.1 — Setting requirement priorities: MoSCoW & value/cost/risk|||10.1 — Đặt ưu tiên yêu cầu: MoSCoW & giá trị/chi phí/rủi ro',
          slug: 'swr302-10-1-prioritization',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Vì sao phải ưu tiên; MoSCoW; ưu tiên theo value/cost/risk; Kano; các trò chơi chính trị quanh ưu tiên.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1 · Advanced</span>
<h2>First things first — prioritizing requirements</h2>
<p class="lead">You can never build everything at once, and not every requirement matters equally. <strong>Prioritization</strong> decides what to build first, what to defer, and what to drop — so limited time and money deliver the most value and the least risk. It's a core requirements-management skill (CLO9).</p>
<h3>Why prioritize?</h3>
<ul>
  <li>Deliver the highest-value features earliest (early ROI, early feedback).</li>
  <li>Manage scope against a fixed deadline — decide what's cut when time runs short, <em>before</em> the crunch.</li>
  <li>Attack high-risk items early while there's time to react.</li>
</ul>
<h3>MoSCoW</h3>
<p>The most common quick scheme sorts requirements into four buckets:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Must have</div><div class="lz-ld">Non-negotiable; the release fails without it. (Login works, payment succeeds.)</div></div>
  <div class="lz-layer"><div class="lz-lt">Should have</div><div class="lz-ld">Important but not vital; painful to omit but there's a workaround.</div></div>
  <div class="lz-layer"><div class="lz-lt">Could have</div><div class="lz-ld">Nice to have; included only if time allows. First to be cut.</div></div>
  <div class="lz-layer"><div class="lz-lt">Won't have (this time)</div><div class="lz-ld">Explicitly out of scope for now — recorded, not forgotten.</div></div>
</div>
<h3>Prioritization by value, cost &amp; risk</h3>
<p>A more analytical approach scores each requirement on <strong>value</strong> (to the customer), <strong>cost</strong> (to build) and <strong>risk</strong>. A simple priority ≈ value ÷ (cost + risk) surfaces the "quick wins": high value, low cost. Do those first.</p>
<h3>Ví dụ có lời giải · Worked example (rank four features)</h3>
<div class="out"><b>Score 1–9 (higher value = better; higher cost/risk = worse). Priority = Value ÷ (Cost+Risk):</b>
<br>• Guest checkout — V=9, C=3, R=2 → 9/5 = <b>1.80</b> → do FIRST (Must)
<br>• Coupon codes — V=6, C=4, R=2 → 6/6 = <b>1.00</b> (Should)
<br>• Crypto payment — V=4, C=8, R=9 → 4/17 = <b>0.24</b> (Won't, this release)
<br>• Dark mode — V=3, C=2, R=1 → 3/3 = <b>1.00</b> (Could)
<br><b>Order to build:</b> Guest checkout → (Coupon ≈ Dark mode) → defer Crypto. The math turns a political argument into a defensible ranking.</div>
<div class="pitfall"><b>Games people play with priorities.</b> Every stakeholder marks their own request "Must have" — so everything becomes a Must and prioritization dies. Counter it: cap the number of Musts (e.g. Musts ≤ 60% of effort), require each Must to trace to a business objective, and make the trade-off visible ("if this is a Must, which current Must drops?"). Prioritization is as much negotiation as arithmetic.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Kano meets prioritization — and WSJF.</b> Combine Ch3's Kano model with MoSCoW: <b>Must-be</b> (basic) features are almost always MoSCoW "Must" (their absence is fatal), Performance features compete for "Should", and Delighters are strategic "Could"s that differentiate you. At scale, frameworks like <b>WSJF</b> (Weighted Shortest Job First, from SAFe) formalize value/cost: priority = Cost of Delay ÷ Job Size — build the highest value-per-effort first. The through-line of the whole course: requirements aren't just gathered, they're <em>economically ranked</em>, because engineering is the art of maximizing value under constraints.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1 · Nâng cao</span>
<h2>Việc quan trọng làm trước — ưu tiên yêu cầu</h2>
<p class="lead">Bạn không bao giờ xây được mọi thứ cùng lúc, và không phải yêu cầu nào cũng quan trọng như nhau. <strong>Ưu tiên (prioritization)</strong> quyết định xây gì trước, hoãn gì, bỏ gì — để thời gian và tiền hữu hạn mang lại nhiều giá trị nhất và ít rủi ro nhất. Đây là kỹ năng quản lý yêu cầu cốt lõi (CLO9).</p>
<h3>Vì sao phải ưu tiên?</h3>
<ul>
  <li>Giao tính năng giá trị cao nhất sớm nhất (ROI sớm, phản hồi sớm).</li>
  <li>Quản phạm vi trước một hạn chót cố định — quyết cắt gì khi thiếu thời gian, <em>trước</em> khi nước rút.</li>
  <li>Tấn công các mục rủi ro cao sớm khi còn thời gian xoay xở.</li>
</ul>
<h3>MoSCoW</h3>
<p>Cách nhanh phổ biến nhất chia yêu cầu vào bốn ngăn:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Must have (bắt buộc)</div><div class="lz-ld">Không thương lượng; thiếu là bản phát hành thất bại. (Đăng nhập chạy, thanh toán thành công.)</div></div>
  <div class="lz-layer"><div class="lz-lt">Should have (nên có)</div><div class="lz-ld">Quan trọng nhưng không sống còn; thiếu thì đau nhưng có cách lách.</div></div>
  <div class="lz-layer"><div class="lz-lt">Could have (có thì tốt)</div><div class="lz-ld">Có thì hay; chỉ đưa vào nếu còn thời gian. Bị cắt đầu tiên.</div></div>
  <div class="lz-layer"><div class="lz-lt">Won't have (lần này)</div><div class="lz-ld">Rõ ràng ngoài phạm vi lúc này — ghi lại, không quên.</div></div>
</div>
<h3>Ưu tiên theo giá trị, chi phí &amp; rủi ro</h3>
<p>Cách phân tích hơn chấm mỗi yêu cầu theo <strong>giá trị</strong> (với khách), <strong>chi phí</strong> (để xây) và <strong>rủi ro</strong>. Một công thức đơn giản priority ≈ giá trị ÷ (chi phí + rủi ro) làm lộ các "quick win": giá trị cao, chi phí thấp. Làm chúng trước.</p>
<h3>Ví dụ có lời giải · Xếp hạng bốn tính năng</h3>
<div class="out"><b>Chấm 1–9 (giá trị cao = tốt hơn; chi phí/rủi ro cao = xấu hơn). Priority = Giá trị ÷ (Chi phí+Rủi ro):</b>
<br>• Checkout khách vãng lai — V=9, C=3, R=2 → 9/5 = <b>1.80</b> → làm TRƯỚC (Must)
<br>• Mã giảm giá — V=6, C=4, R=2 → 6/6 = <b>1.00</b> (Should)
<br>• Thanh toán crypto — V=4, C=8, R=9 → 4/17 = <b>0.24</b> (Won't, bản này)
<br>• Chế độ tối — V=3, C=2, R=1 → 3/3 = <b>1.00</b> (Could)
<br><b>Thứ tự xây:</b> Guest checkout → (Coupon ≈ Dark mode) → hoãn Crypto. Con số biến một cuộc cãi chính trị thành một bảng xếp hạng bảo vệ được.</div>
<div class="pitfall"><b>Trò chơi người ta chơi với ưu tiên.</b> Mỗi stakeholder đánh dấu yêu cầu của mình là "Must have" — thế là mọi thứ thành Must và ưu tiên chết. Đối phó: giới hạn số Must (vd Must ≤ 60% công sức), buộc mỗi Must truy về một mục tiêu kinh doanh, và làm đánh đổi lộ rõ ("nếu cái này là Must thì Must nào hiện tại rớt?"). Ưu tiên vừa là thương lượng vừa là số học.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kano gặp ưu tiên — và WSJF.</b> Kết hợp mô hình Kano ở Ch3 với MoSCoW: tính năng <b>Must-be</b> (cơ bản) gần như luôn là "Must" của MoSCoW (thiếu là chết), tính năng Performance cạnh tranh cho "Should", và Delighter là các "Could" chiến lược giúp bạn khác biệt. Ở quy mô lớn, các framework như <b>WSJF</b> (Weighted Shortest Job First, từ SAFe) chính thức hoá giá trị/chi phí: priority = Chi phí của sự chậm trễ ÷ Kích thước công việc — làm cái giá-trị-trên-công-sức cao nhất trước. Sợi chỉ xuyên suốt cả môn: yêu cầu không chỉ được gom, mà được <em>xếp hạng kinh tế</em>, vì kỹ nghệ là nghệ thuật tối đa hoá giá trị dưới ràng buộc.</div>
</div>
`,
        },
        {
          title: '10.2 — Requirements for AI/ML systems|||10.2 — Yêu cầu cho hệ thống AI/ML',
          slug: 'swr302-10-2-ai-ml-requirements',
          type: 'VIDEO',
          description: 'Vì sao yêu cầu cho AI/ML khác biệt: dữ liệu, chỉ số thay vì hành vi tất định, yêu cầu về chất lượng dữ liệu, fairness và explainability.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2 · Advanced</span>
<h2>When the system learns — requirements for AI/ML</h2>
<p class="lead">Everything so far assumed <strong>deterministic</strong> software: given an input, the output is fixed and specifiable. Machine-learning systems break that assumption — they are <em>probabilistic</em> and learned from data, not coded rule-by-rule. Requirements engineering must adapt, and this is the frontier of the field.</p>
<h3>Why AI/ML requirements are different</h3>
<table>
  <thead><tr><th></th><th>Traditional software</th><th>AI/ML system</th></tr></thead>
  <tbody>
    <tr><td>Behavior</td><td>Deterministic — same input, same output</td><td>Probabilistic — outputs a prediction with a confidence</td></tr>
    <tr><td>Specified by</td><td>Explicit rules in the SRS</td><td>Training data + a target metric</td></tr>
    <tr><td>"Correct" means</td><td>Matches the spec exactly</td><td>Meets a statistical threshold (e.g. ≥ 95% accuracy)</td></tr>
    <tr><td>Key risk</td><td>Logic bugs</td><td>Bad/biased data, drift, unexplainable decisions</td></tr>
  </tbody>
</table>
<h3>New kinds of requirements you must write</h3>
<ul>
  <li><strong>Data requirements</strong> — quantity, quality, coverage, labeling, freshness of training data. "The training set shall contain ≥ 50,000 labeled images covering all 5 defect classes with ≥ 500 examples each."</li>
  <li><strong>Model performance requirements</strong> — stated as <em>metrics with thresholds</em>, not exact behavior. "Precision ≥ 0.90 and recall ≥ 0.85 on the held-out test set." Choose the metric that matches the cost of errors (a false negative in cancer screening is far worse than a false positive).</li>
  <li><strong>Fairness &amp; bias requirements</strong> — "Accuracy shall not differ by more than 3% across protected groups." Bias in data becomes bias in decisions.</li>
  <li><strong>Explainability requirements</strong> — can the system justify a decision? Legally required in some domains (e.g. loan denials).</li>
  <li><strong>Monitoring &amp; drift requirements</strong> — the world changes, so accuracy decays; specify retraining triggers and monitoring.</li>
  <li><strong>Human-in-the-loop / fallback</strong> — what happens when confidence is low? Escalate to a human.</li>
</ul>
<h3>Ví dụ có lời giải · Worked example (turn an AI wish into requirements)</h3>
<p>Stakeholder: "Build an AI that reads receipts and enters the expense automatically." Draft real requirements.</p>
<div class="out"><b>Functional:</b> FR — "The system shall extract vendor, date and total from an uploaded receipt image."
<br><b>Model performance:</b> "Field-level extraction accuracy shall be ≥ 95% for total and date on the test set of 2,000 receipts."
<br><b>Data:</b> "Training data shall include receipts from ≥ 20 vendors, both printed and handwritten, across 3 languages."
<br><b>Fallback (human-in-the-loop):</b> "When extraction confidence &lt; 0.80, the system shall flag the field for manual review rather than auto-submit."
<br><b>Monitoring:</b> "Accuracy shall be measured weekly on new data; a drop &gt; 5% shall trigger a retraining review."
<br><b>Result:</b> a vague "AI that reads receipts" became testable, measurable requirements — the same discipline as Ch5, applied to a probabilistic system.</div>
<div class="pitfall"><b>"The AI will figure it out" is not a requirement.</b> The most common failure in ML projects is skipping data and metric requirements — teams jump to modeling with no agreed target metric, no defined test set, and no fallback for low confidence. Without a threshold ("≥ 95% on <em>this</em> test set") there is no way to say the system is "done" or "correct." AI amplifies the cost of vague requirements, it doesn't remove the need for them.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The specification gap &amp; "the data is the spec".</b> A profound shift: in classic software the SRS <em>is</em> the specification of behavior; in ML, much of the true specification lives in the <b>training data and the chosen metric</b> — change the data, change the behavior, with no code edit. This creates new RE responsibilities: <b>data governance</b> (where did it come from, is it representative, is it allowed?), <b>metric selection</b> (accuracy hides class imbalance; use precision/recall/F1 appropriately), and <b>continuous requirements</b> (a model is never "done" — the world drifts). Emerging standards (EU AI Act, ISO/IEC 42001) now mandate documenting these requirements for high-risk AI. The BA of the next decade must specify data and metrics as fluently as this course taught you to specify functional behavior.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2 · Nâng cao</span>
<h2>Khi hệ thống tự học — yêu cầu cho AI/ML</h2>
<p class="lead">Mọi thứ tới giờ đều giả định phần mềm <strong>tất định (deterministic)</strong>: cho một đầu vào, đầu ra cố định và đặc tả được. Hệ thống học máy phá vỡ giả định đó — chúng <em>xác suất</em> và học từ dữ liệu, không phải code theo từng quy tắc. Kỹ nghệ yêu cầu phải thích nghi, và đây là biên giới của lĩnh vực.</p>
<h3>Vì sao yêu cầu AI/ML khác biệt</h3>
<table>
  <thead><tr><th></th><th>Phần mềm truyền thống</th><th>Hệ thống AI/ML</th></tr></thead>
  <tbody>
    <tr><td>Hành vi</td><td>Tất định — cùng đầu vào, cùng đầu ra</td><td>Xác suất — cho một dự đoán kèm độ tin cậy</td></tr>
    <tr><td>Đặc tả bằng</td><td>Quy tắc tường minh trong SRS</td><td>Dữ liệu huấn luyện + một chỉ số mục tiêu</td></tr>
    <tr><td>"Đúng" nghĩa là</td><td>Khớp chính xác spec</td><td>Đạt một ngưỡng thống kê (vd ≥ 95% accuracy)</td></tr>
    <tr><td>Rủi ro then chốt</td><td>Lỗi logic</td><td>Dữ liệu xấu/thiên lệch, trôi (drift), quyết định không giải thích được</td></tr>
  </tbody>
</table>
<h3>Các loại yêu cầu mới bạn phải viết</h3>
<ul>
  <li><strong>Yêu cầu dữ liệu</strong> — số lượng, chất lượng, độ phủ, gán nhãn, độ tươi của dữ liệu huấn luyện. "Tập huấn luyện phải chứa ≥ 50.000 ảnh đã gán nhãn phủ cả 5 lớp lỗi với ≥ 500 mẫu mỗi lớp."</li>
  <li><strong>Yêu cầu hiệu năng mô hình</strong> — nêu bằng <em>chỉ số kèm ngưỡng</em>, không phải hành vi chính xác. "Precision ≥ 0,90 và recall ≥ 0,85 trên tập test giữ riêng." Chọn chỉ số khớp với chi phí của lỗi (một false negative trong tầm soát ung thư tệ hơn nhiều một false positive).</li>
  <li><strong>Yêu cầu công bằng &amp; thiên lệch</strong> — "Độ chính xác không được chênh quá 3% giữa các nhóm được bảo vệ." Thiên lệch trong dữ liệu thành thiên lệch trong quyết định.</li>
  <li><strong>Yêu cầu giải thích được</strong> — hệ thống có biện minh được một quyết định không? Bị luật bắt buộc trong vài lĩnh vực (vd từ chối khoản vay).</li>
  <li><strong>Yêu cầu giám sát &amp; drift</strong> — thế giới đổi nên độ chính xác suy giảm; đặc tả điều kiện kích hoạt huấn luyện lại và giám sát.</li>
  <li><strong>Human-in-the-loop / phương án dự phòng</strong> — làm gì khi độ tin cậy thấp? Chuyển cho con người.</li>
</ul>
<h3>Ví dụ có lời giải · Biến một mong muốn AI thành yêu cầu</h3>
<p>Stakeholder: "Xây một AI đọc hoá đơn và tự nhập chi phí." Phác các yêu cầu thật.</p>
<div class="out"><b>Chức năng:</b> FR — "Hệ thống phải trích xuất nhà cung cấp, ngày và tổng tiền từ ảnh hoá đơn tải lên."
<br><b>Hiệu năng mô hình:</b> "Độ chính xác trích xuất cấp trường phải ≥ 95% cho tổng tiền và ngày trên tập test 2.000 hoá đơn."
<br><b>Dữ liệu:</b> "Dữ liệu huấn luyện phải gồm hoá đơn từ ≥ 20 nhà cung cấp, cả in và viết tay, qua 3 ngôn ngữ."
<br><b>Dự phòng (human-in-the-loop):</b> "Khi độ tin cậy trích xuất &lt; 0,80, hệ thống phải đánh dấu trường đó để rà tay thay vì tự gửi."
<br><b>Giám sát:</b> "Độ chính xác phải được đo hằng tuần trên dữ liệu mới; giảm &gt; 5% phải kích hoạt rà soát huấn luyện lại."
<br><b>Kết quả:</b> một "AI đọc hoá đơn" mơ hồ đã thành các yêu cầu kiểm thử được, đo được — cùng kỷ luật ở Ch5, áp cho một hệ thống xác suất.</div>
<div class="pitfall"><b>"AI sẽ tự lo được" không phải là một yêu cầu.</b> Thất bại phổ biến nhất trong dự án ML là bỏ qua yêu cầu dữ liệu và chỉ số — đội nhảy thẳng vào mô hình mà không có chỉ số mục tiêu thống nhất, không có tập test xác định, và không có phương án dự phòng cho độ tin cậy thấp. Không có ngưỡng ("≥ 95% trên <em>tập test này</em>") thì không có cách nào nói hệ thống đã "xong" hay "đúng". AI khuếch đại cái giá của yêu cầu mơ hồ, chứ không xoá bỏ nhu cầu có yêu cầu.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khoảng cách đặc tả &amp; "dữ liệu chính là spec".</b> Một dịch chuyển sâu sắc: trong phần mềm cổ điển, SRS <em>chính là</em> đặc tả của hành vi; trong ML, phần lớn đặc tả thật nằm ở <b>dữ liệu huấn luyện và chỉ số được chọn</b> — đổi dữ liệu là đổi hành vi, không sửa dòng code nào. Điều này tạo trách nhiệm RE mới: <b>quản trị dữ liệu</b> (từ đâu tới, có đại diện không, có được phép không?), <b>chọn chỉ số</b> (accuracy che giấu mất cân bằng lớp; dùng precision/recall/F1 cho đúng), và <b>yêu cầu liên tục</b> (một mô hình không bao giờ "xong" — thế giới trôi). Các tiêu chuẩn mới nổi (EU AI Act, ISO/IEC 42001) nay bắt buộc ghi lại các yêu cầu này cho AI rủi ro cao. BA của thập kỷ tới phải đặc tả dữ liệu và chỉ số thành thạo như môn học này đã dạy bạn đặc tả hành vi chức năng.</div>
</div>
`,
        },
        {
          title: 'Quiz 10 — Prioritization & AI/ML requirements|||Quiz 10 — Ưu tiên & yêu cầu AI/ML',
          slug: 'swr302-quiz-10',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh chương 10: MoSCoW, value/cost/risk, yêu cầu AI/ML.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'In MoSCoW, which bucket is cut FIRST when time runs short?|||Trong MoSCoW, ngăn nào bị cắt ĐẦU TIÊN khi thiếu thời gian?', options: ['Must have|||Must have', 'Should have|||Should have', 'Could have|||Could have', 'None|||Không ngăn nào'], correctIndex: 2, points: 1 },
              { question: 'A "quick win" in value/cost/risk prioritization is...|||Một "quick win" khi ưu tiên theo giá trị/chi phí/rủi ro là...', options: ['High value, low cost|||Giá trị cao, chi phí thấp', 'Low value, high cost|||Giá trị thấp, chi phí cao', 'High risk always|||Luôn rủi ro cao', 'The cheapest regardless of value|||Rẻ nhất bất kể giá trị'], correctIndex: 0, points: 1 },
              { question: 'The classic "game" that breaks prioritization is...|||"Trò chơi" kinh điển phá vỡ ưu tiên là...', options: ['Everyone marks their request Must have|||Ai cũng đánh dấu yêu cầu của mình là Must have', 'Using MoSCoW|||Dùng MoSCoW', 'Tracing to objectives|||Truy về mục tiêu', 'Capping the Musts|||Giới hạn số Must'], correctIndex: 0, points: 1 },
              { question: 'For an AI/ML system, "correct" usually means...|||Với hệ thống AI/ML, "đúng" thường nghĩa là...', options: ['Matches the SRS exactly|||Khớp SRS chính xác', 'Meets a statistical metric threshold on a test set|||Đạt một ngưỡng chỉ số thống kê trên tập test', 'Runs without crashing|||Chạy không sập', 'Uses the newest model|||Dùng mô hình mới nhất'], correctIndex: 1, points: 1 },
              { question: 'Which is a NEW kind of requirement specific to ML systems?|||Đâu là loại yêu cầu MỚI riêng của hệ thống ML?', options: ['A login form|||Một form đăng nhập', 'Data quality & fairness requirements|||Yêu cầu chất lượng dữ liệu & công bằng', 'A menu bar|||Một thanh menu', 'A color scheme|||Một bảng màu'], correctIndex: 1, points: 1 },
              { question: 'When an ML model\'s confidence is low, a good requirement is to...|||Khi độ tin cậy của mô hình ML thấp, một yêu cầu tốt là...', options: ['Auto-submit anyway|||Cứ tự động gửi', 'Escalate to a human (human-in-the-loop)|||Chuyển cho con người (human-in-the-loop)', 'Delete the input|||Xoá đầu vào', 'Ignore it|||Bỏ qua'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ PROGRESS TEST 3 — FINAL REVIEW ══════════════════ */
    {
      title: 'Progress Test 3 — Final review (all chapters)|||Progress Test 3 — Ôn tập cuối kỳ (toàn bộ)',
      description: 'Bài kiểm tra tổng hợp toàn môn — chuẩn bị cho Practical & Theory Exam.',
      lessons: [
        {
          title: 'Progress Test 3 — Comprehensive review|||Progress Test 3 — Ôn tập toàn diện',
          slug: 'swr302-progress-test-3',
          type: 'QUIZ',
          description: 'Tổng hợp toàn bộ môn SWR302, mọi CLO.',
          quiz: {
            timeLimitSeconds: 1080,
            questions: [
              { question: 'The five RE activities are elicitation, analysis, specification, validation and...|||Năm hoạt động RE là khai thác, phân tích, đặc tả, thẩm định và...', options: ['Coding|||Lập trình', 'Management|||Quản lý', 'Deployment|||Triển khai', 'Marketing|||Tiếp thị'], correctIndex: 1, points: 1 },
              { question: 'Which is a NON-functional requirement?|||Đâu là yêu cầu PHI chức năng?', options: ['"User can upload a photo"|||"Người dùng tải được ảnh"', '"Uploads shall complete within 3 s"|||"Tải lên phải xong trong 3 giây"', '"User can log in"|||"Người dùng đăng nhập được"', '"System sends an email"|||"Hệ thống gửi email"'], correctIndex: 1, points: 1 },
              { question: 'Observation is superior to interviews for finding...|||Quan sát vượt trội phỏng vấn ở việc tìm...', options: ['Budget figures|||Con số ngân sách', 'Assumed/implied requirements|||Yêu cầu ngầm định/hàm ẩn', 'Legal constraints|||Ràng buộc pháp lý', 'Team names|||Tên đội'], correctIndex: 1, points: 1 },
              { question: 'Which describes a good user story? (INVEST)|||Đâu mô tả một user story tốt? (INVEST)', options: ['Large and vague|||To và mơ hồ', 'Independent, small, testable...|||Độc lập, nhỏ, kiểm thử được...', 'Written only in code|||Chỉ viết bằng code', 'Never estimated|||Không bao giờ ước lượng'], correctIndex: 1, points: 1 },
              { question: 'The SRS structure comes from which standard?|||Cấu trúc SRS đến từ tiêu chuẩn nào?', options: ['IEEE 830|||IEEE 830', 'HTTP 1.1|||HTTP 1.1', 'ISO 8601|||ISO 8601', 'UTF-8|||UTF-8'], correctIndex: 0, points: 1 },
              { question: 'The word that makes a requirement untestable is...|||Từ làm yêu cầu không kiểm thử được là...', options: ['"within 500 ms"|||"trong 500 ms"', '"user-friendly"|||"thân thiện"', '"shall reject"|||"phải từ chối"', '"≥ 8 characters"|||"≥ 8 ký tự"'], correctIndex: 1, points: 1 },
              { question: 'A reviewed, frozen requirements set used as reference is a...|||Bộ yêu cầu đã review, đóng băng, dùng làm tham chiếu là...', options: ['Prototype|||Prototype', 'Baseline|||Baseline', 'Persona|||Persona', 'Backlog|||Backlog'], correctIndex: 1, points: 1 },
              { question: 'A traceability matrix mainly enables...|||Ma trận truy vết chủ yếu cho phép...', options: ['Faster typing|||Gõ nhanh hơn', 'Impact analysis & coverage checking|||Phân tích tác động & kiểm độ phủ', 'Prettier UI|||UI đẹp hơn', 'Cheaper servers|||Máy chủ rẻ hơn'], correctIndex: 1, points: 1 },
              { question: 'Verification asks "are we building it right"; validation asks...|||Verification hỏi "xây đúng cách"; validation hỏi...', options: ['"is it fast?"|||"nó có nhanh?"', '"are we building the right thing?"|||"ta xây đúng thứ không?"', '"is it cheap?"|||"nó có rẻ?"', '"who wrote it?"|||"ai viết?"'], correctIndex: 1, points: 1 },
              { question: 'In Agile, requirements detail is added...|||Trong Agile, chi tiết yêu cầu được thêm...', options: ['All up front|||Toàn bộ từ đầu', 'Just in time (progressive elaboration)|||Đúng lúc (progressive elaboration)', 'Never|||Không bao giờ', 'Only after release|||Chỉ sau phát hành'], correctIndex: 1, points: 1 },
              { question: 'For an ML system, much of the true "specification" lives in...|||Với hệ thống ML, phần lớn "đặc tả" thật nằm ở...', options: ['The button colors|||Màu nút bấm', 'The training data & chosen metric|||Dữ liệu huấn luyện & chỉ số được chọn', 'The font|||Phông chữ', 'The server location|||Vị trí máy chủ'], correctIndex: 1, points: 1 },
              { question: 'MoSCoW\'s "Won\'t have" means...|||"Won\'t have" của MoSCoW nghĩa là...', options: ['Top priority|||Ưu tiên cao nhất', 'Explicitly out of scope for now|||Rõ ràng ngoài phạm vi lúc này', 'A bug|||Một lỗi', 'A Must in disguise|||Một Must trá hình'], correctIndex: 1, points: 1 },
              { question: 'The cheapest place to fix a requirements defect is...|||Nơi rẻ nhất để sửa lỗi yêu cầu là...', options: ['Production|||Vận hành', 'During a requirements review|||Trong buổi review yêu cầu', 'During system testing|||Khi test hệ thống', 'After customer complaints|||Sau khi khách phàn nàn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ gồm PE (thi thực hành) và FE (trắc nghiệm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "PE — Practical Exam|||PE — Thi thực hành",
          "slug": "swr302-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) is a <strong>writing / report exam</strong>: you are given a prompt (an essay question, a document, or a plan) and must produce a well-structured, well-argued piece within a time limit. It is graded on structure, argument, use of evidence, and clarity.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Practise the structure: thesis &rarr; evidence &rarr; analysis &rarr; conclusion.</li>\n<li>Prepare a few strong examples / sources you can cite quickly.</li>\n<li>Plan before you write: 2 minutes outlining saves ten minutes rewriting.</li>\n<li>Argue a clear position &mdash; do not just summarize.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) là <strong>thi viết / báo cáo</strong>: bạn được giao một đề (câu hỏi luận, một tài liệu, hoặc một kế hoạch) và phải viết một bài có cấu trúc, lập luận tốt trong thời gian quy định. Chấm theo cấu trúc, lập luận, dùng bằng chứng, và sự rõ ràng.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Luyện cấu trúc: luận đề &rarr; bằng chứng &rarr; phân tích &rarr; kết luận.</li>\n<li>Chuẩn bị vài ví dụ / nguồn mạnh có thể trích nhanh.</li>\n<li>Lập dàn ý trước khi viết: 2 phút dàn ý tiết kiệm mười phút viết lại.</li>\n<li>Lập luận một quan điểm rõ &mdash; đừng chỉ tóm tắt.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "swr302-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "A requirement should describe...|||Một yêu cầu nên mô tả...",
                "options": [
                  "The technology to use|||Công nghệ dùng để làm",
                  "What the system must do, not how|||Cái hệ thống phải làm, không phải làm thế nào",
                  "The database schema|||Lược đồ cơ sở dữ liệu",
                  "The programming language|||Ngôn ngữ lập trình"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "\"Response time shall be under 2 seconds\" is a...|||\"Thời gian phản hồi phải dưới 2 giây\" là yêu cầu...",
                "options": [
                  "Functional requirement|||Chức năng",
                  "Non-functional requirement (quality attribute)|||Phi chức năng (thuộc tính chất lượng)",
                  "Business requirement|||Kinh doanh",
                  "User story|||User story"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "Which is a BUSINESS requirement?|||Đâu là yêu cầu KINH DOANH?",
                "options": [
                  "The system shall hash passwords|||Hệ thống phải băm mật khẩu",
                  "Reduce support tickets by 40%|||Giảm 40% ticket hỗ trợ",
                  "A user can reset a password|||Người dùng đặt lại được mật khẩu",
                  "Use PostgreSQL|||Dùng PostgreSQL"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "Boehm's 1:10:100 rule says the cost to fix a requirements defect...|||Quy tắc 1:10:100 của Boehm nói chi phí sửa lỗi yêu cầu...",
                "options": [
                  "Stays constant|||Không đổi",
                  "Grows sharply the later it is found|||Tăng mạnh khi phát hiện càng muộn",
                  "Decreases over time|||Giảm dần theo thời gian",
                  "Only matters in testing|||Chỉ quan trọng khi kiểm thử"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "Which modal verb marks a MANDATORY requirement (RFC 2119)?|||Động từ tình thái nào đánh dấu yêu cầu BẮT BUỘC (RFC 2119)?",
                "options": [
                  "may",
                  "should",
                  "shall",
                  "might"
                ],
                "correctIndex": 2
              },
              {
                "id": "q6",
                "points": 1,
                "question": "A stakeholder is...|||Stakeholder là...",
                "options": [
                  "Only a paying customer|||Chỉ là khách trả tiền",
                  "Anyone affected by or able to affect the system|||Bất kỳ ai chịu ảnh hưởng hoặc tác động được hệ thống",
                  "Only the end user|||Chỉ là người dùng cuối",
                  "The project manager only|||Chỉ là quản lý dự án"
                ],
                "correctIndex": 1
              }
            ]
          }
        }
      ]
    },
  ],
};
