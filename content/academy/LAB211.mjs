/**
 * LAB211 — OOP with Java Lab (Thực hành OOP với Java). Kỳ 3.
 * Bám syllabus FPTU (LAB211, sylID 10021): môn THỰC HÀNH THUẦN, tiên quyết PRO192,
 * 3 CLO (kỹ năng Java cơ bản · tự làm assignment nhỏ · debug), 60 session Practice/Mentor-review.
 * Đây là môn ~80% SV TRƯỢT lần đầu → khóa học thiết kế như BỘ DẪN ĐƯỜNG CHỐNG TRƯỢT:
 * dạy sâu kiến trúc + kỹ năng, rồi dẫn học viên luyện qua track Code Lab `lab211`
 * (54 đề thật theo LOC + 4 module tra cứu: assignments 847, api-ref 855, algo-ref 856,
 * error-handbook 857 + AI coach vấn đáp). Mỗi bài link deep tới đúng đề/luyện.
 * Song ngữ EN/VN realtime (.ml-en / .ml-vi, tiêu đề EN|||VI). Code Java <pre>+.tok-*+.out.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/LAB211.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola3', name: 'Kỳ 3', ordinal: 5 },
  course: {
    courseCode: 'LAB211',
    slug: 'oop-with-java-lab',
    title: 'OOP with Java Lab',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The course most students fail first time — not because it is hard, but because it is a typing-under-pressure exam. This guide drives you through 54 real FPTU lab briefs, the standard architecture, the grader traps, and an exam survival plan.|||Môn nhiều SV trượt lần đầu nhất — không phải vì khó, mà vì là kỳ thi gõ code dưới áp lực. Khóa này dẫn bạn qua 54 đề lab FPTU thật, kiến trúc chuẩn, các bẫy người chấm, và kế hoạch sống sót kỳ thi.',
    description: 'Môn thực hành lập trình Java, tiên quyết PRO192. Không có bài giảng lý thuyết — 60 session là luyện tập + mentor review. Điểm đến từ các assignment làm tại phòng lab và kỳ thi thực hành (Practical Exam): bạn nhận một đề, phải viết chương trình Java CHẠY ĐƯỢC và khớp output mẫu trong thời gian giới hạn. Đây là môn ~80% sinh viên trượt lần đầu vì tưởng "biết Java là qua" — thực tế cần GÕ THÀNH THẠO dưới áp lực. Khóa học dạy sâu kiến trúc chuẩn FPTU và kỹ năng, rồi dẫn bạn luyện qua 54 đề thật trên Code Lab.',
    whatYouLearn: 'Kiến trúc chuẩn FPTU (entity/bo/controller/ui/utils-Validator) và biết KHI NÀO thêm tầng; nhập liệu an toàn với Validator; xuất đúng định dạng khớp màn hình chấm; sắp xếp & tìm kiếm; validation & ngoại lệ theo Guidelines; xử lý ngày giờ (bẫy lenient); CRUD + Collections + Comparator; OOP trong entity; đọc/ghi tệp (text/serialize/CSV/zip); kịch bản thi thực hành + quản lý thời gian; sổ tay lỗi 60 giây; các bẫy người chấm; vấn đáp "đổi yêu cầu"; CheckStyle & code convention.',
    requirements: 'Tiên quyết: đạt PRO192 (vững lớp/đối tượng, kế thừa, đa hình, ngoại lệ, collections trong Java). Cần cài JDK 8 + NetBeans 8.0.2 + plugin CheckStyle.',
    documentsNote: 'Học liệu FPT: Lab Room Regulations, Mentor Guide, Evaluation Templates. Công cụ bắt buộc: NetBeans 8.0.2, JDK8, plugin CheckStyle, JavaDoc. Luyện tập chính: track Code Lab "LAB211" — 54 đề lab gốc FPTU đã có lời giải kiểm chạy thật + 4 module tra cứu + AI coach. Kèm file syllabus gốc LAB211.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, tại sao 80% trượt và cách thoát, điều kiện qua môn, công cụ, và cách dùng khóa học này.',
      lessons: [
        {
          title: '0.1 — About LAB211 & the study map|||0.1 — Giới thiệu LAB211 & bản đồ học',
          slug: 'lab211-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'LAB211 là gì, khác PRO192 ra sao, và toàn cảnh lộ trình học để qua môn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About LAB211 — OOP with Java Lab</h2>
<p class="lead">PRO192 taught you to <em>think</em> in objects. LAB211 makes you <strong>fast</strong> at it. There are no lectures here — the official syllabus is 60 sessions of <strong>Practice</strong> and <strong>Mentor review</strong>, nothing else. You are graded on one thing: given a fresh problem, can you write a Java console program that <strong>compiles, runs, and prints exactly the expected output</strong> — inside a time limit, alone.</p>
<p>That is why LAB211 is the course most students fail the first time. It is not conceptually hard. It punishes anyone who "understands Java" but has never built 40 small programs end to end. The cure is simple and this course delivers it: a lot of guided, deliberate practice on <strong>real FPTU lab briefs</strong>.</p>
<h3>The study map</h3>
<div class="lz-map">
  <div class="lz-stage">Set the stage</div>
  <div class="lz-node"><div class="lz-badge">0</div><div class="lz-nbody"><div class="lz-ntitle">Why you fail &amp; how not to</div><div class="lz-nsub">Grading · the exam · the plan · tools</div></div></div>
  <div class="lz-stage">Non-negotiable foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Standard FPTU architecture</div><div class="lz-nsub">entity · bo · controller · ui · Validator</div></div></div>
  <div class="lz-stage">Build fluency on real briefs</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Warm-up: small problems</div><div class="lz-nsub">Sorting · searching · strings</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Validation · dates · numbers</div><div class="lz-nsub">Message-by-the-spec · lenient trap</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">CRUD · Collections · Comparator</div><div class="lz-nsub">The backbone of LAB211</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">OOP entities &amp; File I/O</div><div class="lz-nsub">Inheritance · serialize · CSV · zip</div></div></div>
  <div class="lz-stage">Pass the exam</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Practical Exam survival</div><div class="lz-nsub">Time plan · error handbook · grader traps · viva</div></div></div>
  <div class="lz-stage">Beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">CheckStyle · cost of algorithms · write your own brief</div><div class="lz-nsub">The habits that guarantee a pass</div></div></div>
</div>
<div class="callout ok">LAB211 rewards <strong>hours at the keyboard</strong>, not hours reading. Every lesson here ends with real exercises to solve on Code Lab. Do them — do not just read the solution.</div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Open the LAB211 practice track</span><span class="lc-sub">54 real FPTU lab briefs (LOC-ordered) + reference modules + AI coach.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu LAB211 — Thực hành OOP với Java</h2>
<p class="lead">PRO192 dạy bạn <em>tư duy</em> bằng đối tượng. LAB211 rèn cho bạn <strong>làm nhanh</strong>. Ở đây không có bài giảng — syllabus chính thức là 60 session <strong>Practice</strong> và <strong>Mentor review</strong>, không gì khác. Bạn được chấm đúng một điều: cho một đề mới, bạn có viết được chương trình Java console <strong>biên dịch được, chạy được, và in ĐÚNG output mẫu</strong> — trong thời gian giới hạn, tự làm một mình — hay không.</p>
<p>Đó là lý do LAB211 là môn nhiều sinh viên trượt lần đầu nhất. Nó không khó về khái niệm. Nó "trừng phạt" bất cứ ai "hiểu Java" nhưng chưa từng viết trọn vẹn 40 chương trình nhỏ từ đầu tới cuối. Thuốc chữa rất đơn giản và khóa này trao cho bạn: luyện tập có chủ đích, có dẫn dắt trên <strong>đề lab FPTU thật</strong>.</p>
<h3>Bản đồ học</h3>
<div class="lz-map">
  <div class="lz-stage">Chuẩn bị tâm thế</div>
  <div class="lz-node"><div class="lz-badge">0</div><div class="lz-nbody"><div class="lz-ntitle">Vì sao trượt &amp; cách thoát</div><div class="lz-nsub">Cách chấm · kỳ thi · kế hoạch · công cụ</div></div></div>
  <div class="lz-stage">Nền tảng không thể bỏ</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Kiến trúc chuẩn FPTU</div><div class="lz-nsub">entity · bo · controller · ui · Validator</div></div></div>
  <div class="lz-stage">Rèn phản xạ trên đề thật</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Khởi động: bài nhỏ</div><div class="lz-nsub">Sắp xếp · tìm kiếm · chuỗi</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Validation · ngày · số</div><div class="lz-nsub">Thông báo theo đề · bẫy lenient</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">CRUD · Collections · Comparator</div><div class="lz-nsub">Xương sống của LAB211</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">OOP trong entity &amp; Tệp</div><div class="lz-nsub">Kế thừa · serialize · CSV · zip</div></div></div>
  <div class="lz-stage">Qua kỳ thi</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Sống sót thi thực hành</div><div class="lz-nsub">Kế hoạch thời gian · sổ tay lỗi · bẫy chấm · vấn đáp</div></div></div>
  <div class="lz-stage">Ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">CheckStyle · chi phí thuật toán · tự ra đề</div><div class="lz-nsub">Thói quen đảm bảo qua môn</div></div></div>
</div>
<div class="callout ok">LAB211 thưởng cho <strong>số giờ gõ phím</strong>, không phải số giờ đọc. Mỗi bài ở đây đều kết thúc bằng đề thật để giải trên Code Lab. Hãy làm — đừng chỉ đọc lời giải.</div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Mở track luyện tập LAB211</span><span class="lc-sub">54 đề lab FPTU thật (xếp theo LOC) + module tra cứu + AI coach.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Why 80% fail, and how not to|||0.2 — Vì sao 80% trượt, và cách để không trượt',
          slug: 'lab211-vi-sao-truot',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Cấu trúc điểm, cách chấm thực hành, năm nguyên nhân trượt thật, và chiến lược thoát.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Why 80% fail — and how not to</h2>
<p class="lead">Read this lesson twice. It is the difference between passing and re-taking. LAB211 is graded almost entirely on <strong>working code produced under time pressure</strong>, and it fails students for predictable, avoidable reasons.</p>
<h3>How you are graded</h3>
<p>The syllabus lists no theory exam. Your grade comes from practical work: assignments completed in the lab within a fixed time, mentor reviews, and a final <strong>Practical Exam (PE)</strong>. In the PE you receive a brief, and a marker runs your program with a fixed keystroke script and compares your console output, line by line, with the expected screen in the brief. You pass the subject when your average reaches <strong>5.0</strong>.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h lab + 105h self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">Pass PRO192</span></div>
  <div class="kv"><span class="k">Format</span><span class="v">60 sessions <small>Practice + Mentor review, no lectures</small></span></div>
  <div class="kv"><span class="k">Eligibility</span><span class="v">Attend ≥ 80% of slots</span></div>
  <div class="kv"><span class="k">Pass mark</span><span class="v">Average ≥ 5.0</span></div>
</div>
<h3>The five real reasons students fail</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1 · "I understand it" is not "I can type it."</b> You read the solution, it makes sense, you move on. In the exam your fingers are slow and you run out of time. Fluency only comes from writing programs yourself, many times.</div>
  <div class="lz-layer"><b>2 · Output does not match to the character.</b> The marker compares screens exactly. A missing space in <span class="badge">%-15s</span>, a wrong label, <span class="badge">"Area: "</span> vs <span class="badge">"Area:"</span> — all count as wrong even if the logic is perfect.</div>
  <div class="lz-layer"><b>3 · The program crashes on bad input.</b> No input validation → the marker types a letter where a number is expected → <span class="badge">InputMismatchException</span> → zero for that run.</div>
  <div class="lz-layer"><b>4 · It does not compile / does not run.</b> One missing <span class="badge">import</span>, one unclosed brace, and the whole file scores nothing. Compiling is not optional; it is the gate.</div>
  <div class="lz-layer"><b>5 · Panic and no plan.</b> Students freeze at a blank NetBeans project. Without a fixed order of attack, 60 minutes vanish on the first feature.</div>
</div>
<h3>The strategy that works</h3>
<div class="lz-flow">
  <div class="lz-step">Master ONE architecture so you never think about structure</div>
  <div class="lz-step">Solve real briefs by LOC, easy → hard, until patterns are reflex</div>
  <div class="lz-step">Always validate input &amp; copy output labels exactly</div>
  <div class="lz-step">Rehearse the exam: fixed time, fixed order, compile early &amp; often</div>
</div>
<div class="callout danger">The single biggest mistake: reading solutions instead of writing them. If you can only do one thing from this course, do this — solve every Code Lab brief yourself first, <em>then</em> compare with the reference solution.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Vì sao 80% trượt — và cách để không trượt</h2>
<p class="lead">Đọc bài này hai lần. Nó là ranh giới giữa qua môn và học lại. LAB211 gần như chấm hoàn toàn trên <strong>code chạy được viết dưới áp lực thời gian</strong>, và nó đánh trượt sinh viên vì những lý do đoán trước được, tránh được.</p>
<h3>Bạn được chấm thế nào</h3>
<p>Syllabus không có thi lý thuyết. Điểm đến từ thực hành: assignment làm tại phòng lab trong thời gian cố định, mentor review, và kỳ <strong>thi thực hành (Practical Exam - PE)</strong> cuối. Trong PE bạn nhận một đề, người chấm chạy chương trình của bạn với một kịch bản gõ phím cố định rồi so output console của bạn, TỪNG DÒNG, với màn hình mẫu trong đề. Bạn qua môn khi điểm trung bình đạt <strong>5.0</strong>.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h lab + 105h tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Đạt PRO192</span></div>
  <div class="kv"><span class="k">Hình thức</span><span class="v">60 session <small>Practice + Mentor review, không lecture</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% slot</span></div>
  <div class="kv"><span class="k">Điểm qua</span><span class="v">Trung bình ≥ 5.0</span></div>
</div>
<h3>Năm lý do thật khiến sinh viên trượt</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1 · "Hiểu rồi" khác "gõ được".</b> Bạn đọc lời giải, thấy hợp lý, rồi bỏ qua. Trong phòng thi tay bạn chậm và hết giờ. Phản xạ chỉ đến từ việc TỰ viết chương trình, nhiều lần.</div>
  <div class="lz-layer"><b>2 · Output lệch tới từng ký tự.</b> Người chấm so màn hình y hệt. Thiếu một dấu cách ở <span class="badge">%-15s</span>, sai một nhãn, <span class="badge">"Area: "</span> vs <span class="badge">"Area:"</span> — đều bị tính sai dù logic hoàn hảo.</div>
  <div class="lz-layer"><b>3 · Chương trình sập với dữ liệu xấu.</b> Không validate → người chấm gõ chữ vào chỗ cần số → <span class="badge">InputMismatchException</span> → 0 điểm lần chạy đó.</div>
  <div class="lz-layer"><b>4 · Không biên dịch / không chạy được.</b> Thiếu một <span class="badge">import</span>, thiếu một ngoặc, cả file 0 điểm. Biên dịch được không phải tùy chọn; nó là cửa ải.</div>
  <div class="lz-layer"><b>5 · Hoảng và không có kế hoạch.</b> Sinh viên đơ trước project NetBeans trống. Không có thứ tự tấn công cố định, 60 phút bốc hơi ở chức năng đầu tiên.</div>
</div>
<h3>Chiến lược có hiệu quả</h3>
<div class="lz-flow">
  <div class="lz-step">Thuộc MỘT kiến trúc để không bao giờ phải nghĩ về cấu trúc</div>
  <div class="lz-step">Giải đề thật theo LOC, dễ → khó, tới khi mẫu hình thành phản xạ</div>
  <div class="lz-step">Luôn validate input &amp; chép nhãn output y nguyên</div>
  <div class="lz-step">Diễn tập kỳ thi: thời gian cố định, thứ tự cố định, biên dịch sớm &amp; thường xuyên</div>
</div>
<div class="callout danger">Sai lầm lớn nhất: đọc lời giải thay vì viết nó. Nếu chỉ làm được một điều từ khóa này, hãy làm điều này — tự giải mọi đề Code Lab trước, <em>rồi</em> mới đối chiếu với lời giải tham khảo.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning outcomes & required skills|||0.3 — Chuẩn đầu ra & kỹ năng cần có',
          slug: 'lab211-clo-ky-nang',
          type: 'VIDEO',
          description: 'Ba CLO của môn và bản đồ kỹ năng Java bạn phải thành thạo, kèm nơi luyện.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Learning outcomes &amp; the skills you must own</h2>
<p class="lead">The official syllabus has just three learning outcomes — but each one hides a checklist of concrete skills. Here is the honest map of what "proficient in basic Java" actually means for LAB211.</p>
<table>
  <thead><tr><th>CLO</th><th>What it really tests</th></tr></thead>
  <tbody>
    <tr><td><b>CLO1</b> — Proficiency in basic Java (from PRO192)</td><td>Classes, objects, constructors, encapsulation, inheritance, polymorphism, interfaces, exceptions, collections — written fluently, not just recognised.</td></tr>
    <tr><td><b>CLO2</b> — Independently complete small assignments</td><td>Read a brief, design the classes, code a full working console app, match the expected output — alone, on time.</td></tr>
    <tr><td><b>CLO3</b> — Debug with common tools</td><td>Read a compiler/runtime error, use the NetBeans debugger, fix it fast under pressure.</td></tr>
  </tbody>
</table>
<h3>The concrete skill checklist</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Input</b> — Scanner, the <span class="badge">nextInt()/nextLine()</span> trap, a reusable Validator for numbers, strings, ranges, dates.</div>
  <div class="lz-layer"><b>Output</b> — <span class="badge">printf</span>, <span class="badge">%-15s</span>, <span class="badge">%.2f</span>, String.format; matching a screen exactly.</div>
  <div class="lz-layer"><b>Data</b> — arrays, ArrayList, LinkedHashMap, HashMap; Comparator &amp; sorting objects.</div>
  <div class="lz-layer"><b>Logic</b> — sorting (bubble/selection/insertion/quick/merge), linear &amp; binary search, base conversion, recursion.</div>
  <div class="lz-layer"><b>OOP</b> — entity classes (Serializable, getters/setters, toString), inheritance &amp; polymorphism, abstract/interface.</div>
  <div class="lz-layer"><b>Files</b> — read/write text, object serialization, CSV, copy &amp; zip; the byte-vs-char trap.</div>
  <div class="lz-layer"><b>Robustness</b> — validation that never crashes, exceptions with messages taken from the brief.</div>
</div>
<div class="note-ct">If any row above feels shaky, that is exactly where to spend your self-study hours. This course maps each skill to real exercises so you can practise the weak ones directly.</div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-855" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Java API Reference (filtered to this course)</span><span class="lc-sub">Scanner, printf, String, List/Map, Comparator, dates, files — with "X/54 briefs need this".</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Chuẩn đầu ra &amp; những kỹ năng bạn phải sở hữu</h2>
<p class="lead">Syllabus chính thức chỉ có ba chuẩn đầu ra — nhưng mỗi cái ẩn một danh sách kỹ năng cụ thể. Đây là bản đồ trung thực về việc "thành thạo Java cơ bản" thực sự nghĩa là gì với LAB211.</p>
<table>
  <thead><tr><th>CLO</th><th>Thực chất kiểm tra điều gì</th></tr></thead>
  <tbody>
    <tr><td><b>CLO1</b> — Thành thạo Java cơ bản (từ PRO192)</td><td>Lớp, đối tượng, constructor, đóng gói, kế thừa, đa hình, interface, ngoại lệ, collections — viết thành thạo, không chỉ nhận ra.</td></tr>
    <tr><td><b>CLO2</b> — Tự làm assignment nhỏ</td><td>Đọc đề, thiết kế lớp, code trọn app console chạy được, khớp output mẫu — một mình, đúng giờ.</td></tr>
    <tr><td><b>CLO3</b> — Debug bằng công cụ phổ biến</td><td>Đọc lỗi biên dịch/runtime, dùng debugger NetBeans, sửa nhanh dưới áp lực.</td></tr>
  </tbody>
</table>
<h3>Danh sách kỹ năng cụ thể</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Nhập</b> — Scanner, bẫy <span class="badge">nextInt()/nextLine()</span>, một Validator tái dùng cho số, chuỗi, khoảng, ngày.</div>
  <div class="lz-layer"><b>Xuất</b> — <span class="badge">printf</span>, <span class="badge">%-15s</span>, <span class="badge">%.2f</span>, String.format; khớp màn hình y hệt.</div>
  <div class="lz-layer"><b>Dữ liệu</b> — mảng, ArrayList, LinkedHashMap, HashMap; Comparator &amp; sắp xếp đối tượng.</div>
  <div class="lz-layer"><b>Logic</b> — sắp xếp (bubble/selection/insertion/quick/merge), tìm tuyến tính &amp; nhị phân, đổi hệ cơ số, đệ quy.</div>
  <div class="lz-layer"><b>OOP</b> — lớp entity (Serializable, getter/setter, toString), kế thừa &amp; đa hình, abstract/interface.</div>
  <div class="lz-layer"><b>Tệp</b> — đọc/ghi text, serialize đối tượng, CSV, copy &amp; zip; bẫy byte-vs-char.</div>
  <div class="lz-layer"><b>Bền bỉ</b> — validate không bao giờ sập, ngoại lệ với thông báo lấy từ đề.</div>
</div>
<div class="note-ct">Nếu bất cứ dòng nào ở trên còn lung lay, đó chính là nơi nên dồn giờ tự học. Khóa này ánh xạ từng kỹ năng tới đề thật để bạn luyện thẳng cái yếu.</div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-855" target="_blank" rel="noopener">
  <span class="lc-ico">📖</span>
  <span class="lc-body"><span class="lc-title">Java API Reference (lọc riêng cho môn này)</span><span class="lc-sub">Scanner, printf, String, List/Map, Comparator, ngày, tệp — kèm "X/54 đề cần cái này".</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '0.4 — Set up NetBeans, JDK8 & CheckStyle|||0.4 — Cài NetBeans, JDK8 & CheckStyle',
          slug: 'lab211-cai-dat',
          type: 'VIDEO',
          description: 'Đúng bộ công cụ FPT dùng chấm bài — cài chuẩn để không mất điểm oan.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Set up the exact tools FPT grades on</h2>
<p class="lead">The syllabus is specific: <strong>NetBeans 8.0.2</strong>, <strong>JDK 8</strong>, and the <strong>CheckStyle</strong> plugin. Use the same versions your mentor uses — a program that runs on JDK 21 at home may behave differently than the JDK 8 in the lab.</p>
<div class="lz-flow">
  <div class="lz-step">Install JDK 8 (Java 8)</div>
  <div class="lz-step">Install NetBeans 8.0.2</div>
  <div class="lz-step">Add the CheckStyle plugin</div>
  <div class="lz-step">Create a Java Application &amp; run "Hello"</div>
</div>
<div class="callout warn">CheckStyle is in the official tool list for a reason — clean, convention-following code is part of your grade. Set it up now so bad naming and formatting are flagged while you practise, not in the exam.</div>
<p>The full step-by-step install guide, with official download links for each tool, is on Exp Hub:</p>
<a class="link-card exphub" href="/exp-hub/lab211-cai-dat-netbeans?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Install NetBeans 8.0.2 + JDK 8 + CheckStyle</span><span class="lc-sub">Step-by-step with official download links — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Cài đúng bộ công cụ FPT dùng để chấm</h2>
<p class="lead">Syllabus ghi rõ: <strong>NetBeans 8.0.2</strong>, <strong>JDK 8</strong>, và plugin <strong>CheckStyle</strong>. Dùng đúng phiên bản mentor dùng — chương trình chạy trên JDK 21 ở nhà có thể hành xử khác với JDK 8 trong phòng lab.</p>
<div class="lz-flow">
  <div class="lz-step">Cài JDK 8 (Java 8)</div>
  <div class="lz-step">Cài NetBeans 8.0.2</div>
  <div class="lz-step">Thêm plugin CheckStyle</div>
  <div class="lz-step">Tạo Java Application &amp; chạy "Hello"</div>
</div>
<div class="callout warn">CheckStyle nằm trong danh sách công cụ chính thức là có lý do — code sạch, theo convention là một phần điểm của bạn. Cài ngay để lỗi đặt tên và định dạng bị bắt khi luyện, không phải trong phòng thi.</div>
<p>Hướng dẫn cài từng bước, kèm link tải chính chủ cho từng công cụ, ở Exp Hub:</p>
<a class="link-card exphub" href="/exp-hub/lab211-cai-dat-netbeans?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài NetBeans 8.0.2 + JDK 8 + CheckStyle</span><span class="lc-sub">Từng bước kèm link tải chính chủ — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.5 — How to use this course + the practice engine|||0.5 — Cách dùng khóa học này + bộ máy luyện tập',
          slug: 'lab211-cach-hoc',
          type: 'VIDEO',
          description: 'Vòng lặp học hiệu quả và cách khai thác track Code Lab: 54 đề, module tra cứu, AI coach.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>How to use this course — and the practice engine behind it</h2>
<p class="lead">Every teaching lesson here is short on purpose. The real learning happens on the <strong>Code Lab LAB211 track</strong>, which was built specifically to prepare you for the practical exam. Here is how the pieces fit together.</p>
<h3>The four tools on the track</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>54 real briefs</b> — the exact FPTU lab assignments, ordered by lines of code (21 → 500) because LOC is the true difficulty scale. Each has a verified solution (compiled and run against the marker's keystrokes), a bilingual explanation, and a project-tree diagram.</div>
  <div class="lz-layer"><b>API Reference</b> — Scanner, printf, String, List/Map, Comparator, dates, files — each entry says how many of the 54 briefs need it, so you learn what actually matters.</div>
  <div class="lz-layer"><b>Algorithm Reference</b> — "if the brief says X, use Y, never Z", with measured cost comparisons.</div>
  <div class="lz-layer"><b>Error Handbook</b> — every compiler and runtime message, its real cause, and its fix — taken from actual javac/java output.</div>
</div>
<h3>The study loop that builds fluency</h3>
<div class="lz-flow">
  <div class="lz-step">Read the brief · design classes on paper (2 min)</div>
  <div class="lz-step">Code it yourself in NetBeans — no peeking</div>
  <div class="lz-step">Run against the expected screen · fix until it matches</div>
  <div class="lz-step">ONLY THEN read the reference solution &amp; note differences</div>
  <div class="lz-step">Use the AI coach: "change a requirement" &amp; answer the viva</div>
</div>
<div class="callout ok">The AI coach (Pro) can act like a mentor at review: it changes a requirement ("now sort by date descending", "add a delete feature") and asks where you would change your code — the exact skill mentors test in the review sessions.</div>
<div class="callout danger">If you skip step 2 (writing it yourself) the whole system stops working. Reading solutions builds recognition, not fluency — and the exam tests fluency.</div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-847" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Start with the first brief (21 LOC)</span><span class="lc-sub">The 54 briefs, easiest first. Solve, don't read.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Cách dùng khóa học này — và bộ máy luyện tập phía sau</h2>
<p class="lead">Mọi bài giảng ở đây cố tình ngắn. Việc học thật diễn ra trên <strong>track Code Lab LAB211</strong>, được xây riêng để luyện thi thực hành cho bạn. Đây là cách các mảnh ghép khớp nhau.</p>
<h3>Bốn công cụ trên track</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>54 đề thật</b> — chính các assignment lab FPTU, xếp theo số dòng code (21 → 500) vì LOC là thang độ khó thật. Mỗi bài có lời giải đã kiểm (biên dịch + chạy theo kịch bản gõ phím của người chấm), giải thích song ngữ, và sơ đồ cây project.</div>
  <div class="lz-layer"><b>API Reference</b> — Scanner, printf, String, List/Map, Comparator, ngày, tệp — mỗi mục ghi bao nhiêu trong 54 đề cần nó, để bạn học đúng cái quan trọng.</div>
  <div class="lz-layer"><b>Algorithm Reference</b> — "đề nói X thì dùng Y, cấm Z", kèm so sánh chi phí đo thật.</div>
  <div class="lz-layer"><b>Error Handbook</b> — mọi thông báo biên dịch và runtime, nguyên nhân thật, và cách sửa — lấy từ output javac/java thật.</div>
</div>
<h3>Vòng lặp học tạo phản xạ</h3>
<div class="lz-flow">
  <div class="lz-step">Đọc đề · thiết kế lớp ra giấy (2 phút)</div>
  <div class="lz-step">Tự code trong NetBeans — không liếc lời giải</div>
  <div class="lz-step">Chạy đối chiếu màn hình mẫu · sửa tới khi khớp</div>
  <div class="lz-step">CHỈ SAU ĐÓ mới đọc lời giải tham khảo &amp; ghi lại điểm khác</div>
  <div class="lz-step">Dùng AI coach: "đổi một yêu cầu" &amp; trả lời vấn đáp</div>
</div>
<div class="callout ok">AI coach (Pro) có thể đóng vai mentor lúc review: nó đổi một yêu cầu ("giờ sắp theo ngày giảm dần", "thêm chức năng xóa") và hỏi bạn sẽ sửa ở đâu — đúng kỹ năng mentor kiểm trong các buổi review.</div>
<div class="callout danger">Nếu bỏ bước 2 (tự viết) thì cả hệ thống ngừng hoạt động. Đọc lời giải tạo khả năng nhận ra, không tạo phản xạ — và kỳ thi kiểm phản xạ.</div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-847" target="_blank" rel="noopener">
  <span class="lc-ico">🧪</span>
  <span class="lc-body"><span class="lc-title">Bắt đầu với đề đầu tiên (21 LOC)</span><span class="lc-sub">54 đề, dễ trước. Giải, đừng đọc.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 0 — Orientation|||Quiz 0 — Định hướng',
          slug: 'lab211-quiz-0',
          type: 'QUIZ',
          description: 'Kiểm tra bạn đã nắm cách chấm, lý do trượt và cách học.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'LAB211 is graded mainly on…|||LAB211 chấm chủ yếu dựa trên…', options: ['a written theory exam|||một bài thi lý thuyết viết', 'working code produced under time pressure|||code chạy được viết dưới áp lực thời gian', 'attendance only|||chỉ điểm danh', 'group presentations|||thuyết trình nhóm'], correctIndex: 1, points: 1 },
              { question: 'The prerequisite for LAB211 is…|||Tiên quyết của LAB211 là…', options: ['PRF192', 'PRO192', 'CSD201', 'none|||không có'], correctIndex: 1, points: 1 },
              { question: 'The single biggest cause of failing is…|||Nguyên nhân trượt lớn nhất là…', options: ['not memorising theory|||không thuộc lý thuyết', 'reading solutions instead of writing them|||đọc lời giải thay vì tự viết', 'using NetBeans|||dùng NetBeans', 'validating input|||validate input'], correctIndex: 1, points: 1 },
              { question: 'The marker compares your program by…|||Người chấm so chương trình của bạn bằng cách…', options: ['reading your code style only|||chỉ đọc phong cách code', 'running it and comparing console output line by line|||chạy nó và so output console từng dòng', 'counting your comments|||đếm số comment', 'checking file size|||kiểm kích thước file'], correctIndex: 1, points: 1 },
              { question: 'The correct study loop puts "read the reference solution"…|||Vòng lặp học đúng đặt "đọc lời giải tham khảo"…', options: ['first, before trying|||đầu tiên, trước khi thử', 'after you have solved it yourself|||sau khi bạn đã tự giải', 'instead of writing code|||thay cho việc viết code', 'never|||không bao giờ'], correctIndex: 1, points: 1 },
              { question: 'The exercises on the track are ordered by…|||Các đề trên track được xếp theo…', options: ['alphabet|||bảng chữ cái', 'lines of code (real difficulty)|||số dòng code (độ khó thật)', 'random|||ngẫu nhiên', 'date added|||ngày thêm'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ PHẦN 1 — KIẾN TRÚC & KỸ NĂNG NỀN ══════════════════ */
    {
      title: 'Part 1 — The standard architecture & core skills|||Phần 1 — Kiến trúc chuẩn & kỹ năng nền bắt buộc',
      description: 'Ba thứ phải thành phản xạ trước khi luyện đề: kiến trúc phân tầng chuẩn FPTU, nhập liệu an toàn, và xuất đúng định dạng.',
      lessons: [
        {
          title: '1.1 — The standard layered architecture|||1.1 — Kiến trúc phân tầng chuẩn FPTU',
          slug: 'lab211-kien-truc-phan-tang',
          type: 'VIDEO',
          description: 'entity / bo / controller / ui / utils(Validator) và QUY TẮC khi nào thêm tầng — trả lời được "sao bài này không có controller".',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 1 · Lesson 1.1</span>
<h2>The standard layered architecture</h2>
<p class="lead">Every LAB211 solution uses the same shape. Learn it once and you never waste exam time deciding "where does this code go". This layout is not invented here — it was reverse-engineered from 17 sample projects that already passed at FPT.</p>
<h3>The five layers</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>entity</b> — plain data objects (POJO). <span class="badge">implements Serializable</span>, private fields, full constructor, getters/setters, <span class="badge">toString()</span>. Knows its data, nothing else.</div>
  <div class="lz-layer"><b>bo</b> (business object) — holds the collection and the rules. <span class="badge">throws Exception</span> with a message (e.g. "Doctor code [D001] is duplicate."); it never prints to the screen.</div>
  <div class="lz-layer"><b>controller</b> — the glue: calls the Validator to gather input, calls the bo, prints the result message.</div>
  <div class="lz-layer"><b>ui / Main</b> — only the menu and the loop; delegates each choice to a controller method.</div>
  <div class="lz-layer"><b>utils / Validator</b> — a class of static input helpers: <span class="badge">private static final Scanner</span>, a private constructor, methods like <span class="badge">getInt(msg, msgRange, msgErr, min, max)</span>.</div>
</div>
<h3>The rule: only add a layer when the size demands it</h3>
<p>This is the exact question mentors love to ask — "why does this program have no controller?" The answer is measured, not guessed:</p>
<table>
  <thead><tr><th>Project size</th><th>Layers used</th></tr></thead>
  <tbody>
    <tr><td>2–4 files</td><td><span class="badge">entity</span> + <span class="badge">ui</span> + <span class="badge">utils</span> — <b>no bo</b></td></tr>
    <tr><td>4–6 files</td><td>add <span class="badge">bo</span></td></tr>
    <tr><td>≥ 7 files</td><td>add <span class="badge">controller</span></td></tr>
  </tbody>
</table>
<div class="note-ct">Every sample project with ≥ 7 files had a controller; every one with ≤ 3 files had no bo. So "I only add a layer when the program is big enough to need it" is a correct, confident answer — and it matches the passing samples.</div>
<h3>The data flow</h3>
<div class="lz-flow">
  <div class="lz-step">ui shows menu</div>
  <div class="lz-step">controller uses Validator to read input</div>
  <div class="lz-step">controller calls bo (add/find/sort)</div>
  <div class="lz-step">bo enforces rules, throws on error</div>
  <div class="lz-step">controller prints the outcome</div>
</div>
<div class="pitfall"><b>Trap:</b> the NetBeans "To change this license header…" comment is a sign of auto-generated code. Delete it and replace with a short Javadoc that explains <em>why</em> the class exists — mentors notice.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Never close the System.in Scanner.</b> Calling sc.close() on a Scanner that wraps System.in shuts stdin for the whole program, and the next read throws NoSuchElementException. Keep one shared static Scanner in your Validator and never close it. <em>Why beyond the syllabus: it is a resource-management subtlety PRO192 rarely drills, yet it silently zeroes exam runs.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0055-doctor-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">See the full pattern: Doctor Management</span><span class="lc-sub">A ≥7-file project with entity/bo/controller/Validator — the reference layout.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 1 · Bài 1.1</span>
<h2>Kiến trúc phân tầng chuẩn FPTU</h2>
<p class="lead">Mọi lời giải LAB211 dùng chung một hình dạng. Thuộc nó một lần và bạn không bao giờ phí thời gian thi để quyết "code này đặt ở đâu". Kiểu bố cục này không phải tự chế ra — nó được đúc kết từ 17 project mẫu đã pass ở FPT.</p>
<h3>Năm tầng</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>entity</b> — đối tượng dữ liệu thuần (POJO). <span class="badge">implements Serializable</span>, trường private, constructor đầy đủ, getter/setter, <span class="badge">toString()</span>. Chỉ biết dữ liệu của mình, không gì khác.</div>
  <div class="lz-layer"><b>bo</b> (business object) — giữ collection và luật. <span class="badge">throws Exception</span> kèm thông báo (vd "Doctor code [D001] is duplicate."); nó KHÔNG in ra màn hình.</div>
  <div class="lz-layer"><b>controller</b> — chất keo: gọi Validator lấy input, gọi bo, in thông báo kết quả.</div>
  <div class="lz-layer"><b>ui / Main</b> — chỉ menu và vòng lặp; ủy thác mỗi lựa chọn cho một hàm controller.</div>
  <div class="lz-layer"><b>utils / Validator</b> — lớp toàn hàm nhập tĩnh: <span class="badge">private static final Scanner</span>, constructor private, hàm như <span class="badge">getInt(msg, msgRange, msgErr, min, max)</span>.</div>
</div>
<h3>Quy tắc: chỉ thêm tầng khi kích thước đòi hỏi</h3>
<p>Đây đúng là câu mentor thích hỏi — "sao chương trình này không có controller?". Câu trả lời là ĐO ĐƯỢC, không phải đoán:</p>
<table>
  <thead><tr><th>Kích thước project</th><th>Tầng dùng</th></tr></thead>
  <tbody>
    <tr><td>2–4 file</td><td><span class="badge">entity</span> + <span class="badge">ui</span> + <span class="badge">utils</span> — <b>không bo</b></td></tr>
    <tr><td>4–6 file</td><td>thêm <span class="badge">bo</span></td></tr>
    <tr><td>≥ 7 file</td><td>thêm <span class="badge">controller</span></td></tr>
  </tbody>
</table>
<div class="note-ct">Mọi project mẫu ≥ 7 file đều có controller; mọi project ≤ 3 file đều không có bo. Nên "tôi chỉ thêm tầng khi chương trình đủ lớn để cần" là câu trả lời đúng, tự tin — và khớp với các bản mẫu đã pass.</div>
<h3>Luồng dữ liệu</h3>
<div class="lz-flow">
  <div class="lz-step">ui hiện menu</div>
  <div class="lz-step">controller dùng Validator đọc input</div>
  <div class="lz-step">controller gọi bo (thêm/tìm/sắp)</div>
  <div class="lz-step">bo áp luật, ném lỗi khi sai</div>
  <div class="lz-step">controller in kết quả</div>
</div>
<div class="pitfall"><b>Bẫy:</b> comment "To change this license header…" của NetBeans là dấu hiệu code sinh sẵn. Xóa nó và thay bằng một Javadoc ngắn giải thích <em>vì sao</em> lớp tồn tại — mentor để ý đấy.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đừng bao giờ đóng Scanner của System.in.</b> Gọi sc.close() trên Scanner bọc System.in sẽ đóng luôn stdin của cả chương trình, và lần đọc sau ném NoSuchElementException. Giữ một Scanner static dùng chung trong Validator và không bao giờ đóng nó. <em>Vì sao ngoài syllabus: đây là điểm tinh tế về quản lý tài nguyên PRO192 ít luyện, nhưng lại âm thầm làm 0 điểm lần chạy thi.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0055-doctor-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Xem trọn mẫu: Doctor Management</span><span class="lc-sub">Project ≥7 file với entity/bo/controller/Validator — bố cục chuẩn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — Safe input with a Validator|||1.2 — Nhập liệu an toàn với Validator',
          slug: 'lab211-nhap-lieu-validator',
          type: 'VIDEO',
          description: 'Mẫu Validator tái dùng (getInt/getString/re-prompt) và bẫy Scanner nextInt/nextLine — dùng ở 44/54 đề.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 1 · Lesson 1.2</span>
<h2>Safe input — the Validator that never crashes</h2>
<p class="lead">Roughly <strong>44 of the 54 briefs</strong> read input with Scanner. If your program throws <span class="badge">InputMismatchException</span> when the marker types a letter, that run is zero. A reusable Validator class fixes this once for every program.</p>
<h3>The Scanner trap you must know</h3>
<p><span class="badge">nextInt()</span> reads the number but leaves the newline in the buffer; the next <span class="badge">nextLine()</span> then reads an empty string. Never mix them carelessly — read a whole line and parse it.</p>
<pre><span class="tok-comment">// Fragile — the classic bug</span>
<span class="tok-type">int</span> n = sc.<span class="tok-function">nextInt</span>();
<span class="tok-type">String</span> name = sc.<span class="tok-function">nextLine</span>(); <span class="tok-comment">// reads "" not the name!</span></pre>
<h3>A reusable Validator</h3>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Validator</span> {
    <span class="tok-keyword">private static final</span> <span class="tok-type">Scanner</span> SC = <span class="tok-keyword">new</span> <span class="tok-function">Scanner</span>(System.in);
    <span class="tok-keyword">private</span> <span class="tok-function">Validator</span>() {}                 <span class="tok-comment">// no instances</span>

    <span class="tok-keyword">public static</span> <span class="tok-type">int</span> <span class="tok-function">getInt</span>(<span class="tok-type">String</span> msg, <span class="tok-type">String</span> errRange, <span class="tok-type">String</span> errNum, <span class="tok-type">int</span> min, <span class="tok-type">int</span> max) {
        <span class="tok-keyword">while</span> (<span class="tok-keyword">true</span>) {
            System.out.<span class="tok-function">print</span>(msg);
            <span class="tok-keyword">try</span> {
                <span class="tok-type">int</span> v = Integer.<span class="tok-function">parseInt</span>(SC.<span class="tok-function">nextLine</span>().<span class="tok-function">trim</span>());
                <span class="tok-keyword">if</span> (v &lt; min || v &gt; max) { System.out.<span class="tok-function">println</span>(errRange); <span class="tok-keyword">continue</span>; }
                <span class="tok-keyword">return</span> v;
            } <span class="tok-keyword">catch</span> (<span class="tok-type">NumberFormatException</span> e) { System.out.<span class="tok-function">println</span>(errNum); }
        }
    }
    <span class="tok-keyword">public static</span> <span class="tok-type">String</span> <span class="tok-function">getNonBlank</span>(<span class="tok-type">String</span> msg) {
        <span class="tok-type">String</span> s;
        <span class="tok-keyword">do</span> { System.out.<span class="tok-function">print</span>(msg); s = SC.<span class="tok-function">nextLine</span>().<span class="tok-function">trim</span>(); } <span class="tok-keyword">while</span> (s.<span class="tok-function">isEmpty</span>());
        <span class="tok-keyword">return</span> s;
    }
}</pre>
<div class="out"><b>Behaviour:</b> type <span class="badge">abc</span> → prints errNum, asks again. Type <span class="badge">99</span> when max is 10 → prints errRange, asks again. The program never crashes.</div>
<div class="callout warn">Read with <span class="badge">nextLine()</span> and parse with <span class="badge">Integer.parseInt</span> — never <span class="badge">nextInt()</span> directly. This one habit removes the most common exam crash.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Scanner.nextDouble() is locale-sensitive.</b> On a machine set to a comma-decimal locale, sc.nextDouble() rejects &#96;3.5&#96; and wants &#96;3,5&#96;. Reading the whole line and calling Double.parseDouble(line.trim()) always uses a dot, so your program behaves the same on every lab machine. <em>Why beyond the syllabus: locale is invisible until the grader's machine differs from yours.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0063-input-and-display-person-info?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practise input: Input &amp; display Person Info</span><span class="lc-sub">A tiny brief that is all about reading &amp; re-prompting cleanly.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 1 · Bài 1.2</span>
<h2>Nhập liệu an toàn — Validator không bao giờ sập</h2>
<p class="lead">Khoảng <strong>44/54 đề</strong> đọc input bằng Scanner. Nếu chương trình ném <span class="badge">InputMismatchException</span> khi người chấm gõ một chữ cái, lần chạy đó 0 điểm. Một lớp Validator tái dùng sửa việc này một lần cho mọi chương trình.</p>
<h3>Bẫy Scanner bạn phải biết</h3>
<p><span class="badge">nextInt()</span> đọc số nhưng để lại ký tự xuống dòng trong bộ đệm; <span class="badge">nextLine()</span> ngay sau đó đọc ra chuỗi rỗng. Đừng bao giờ trộn chúng cẩu thả — đọc trọn một dòng rồi parse.</p>
<pre><span class="tok-comment">// Mong manh — lỗi kinh điển</span>
<span class="tok-type">int</span> n = sc.<span class="tok-function">nextInt</span>();
<span class="tok-type">String</span> name = sc.<span class="tok-function">nextLine</span>(); <span class="tok-comment">// đọc ra "" chứ không phải tên!</span></pre>
<h3>Một Validator tái dùng</h3>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Validator</span> {
    <span class="tok-keyword">private static final</span> <span class="tok-type">Scanner</span> SC = <span class="tok-keyword">new</span> <span class="tok-function">Scanner</span>(System.in);
    <span class="tok-keyword">private</span> <span class="tok-function">Validator</span>() {}                 <span class="tok-comment">// không tạo thể hiện</span>

    <span class="tok-keyword">public static</span> <span class="tok-type">int</span> <span class="tok-function">getInt</span>(<span class="tok-type">String</span> msg, <span class="tok-type">String</span> errRange, <span class="tok-type">String</span> errNum, <span class="tok-type">int</span> min, <span class="tok-type">int</span> max) {
        <span class="tok-keyword">while</span> (<span class="tok-keyword">true</span>) {
            System.out.<span class="tok-function">print</span>(msg);
            <span class="tok-keyword">try</span> {
                <span class="tok-type">int</span> v = Integer.<span class="tok-function">parseInt</span>(SC.<span class="tok-function">nextLine</span>().<span class="tok-function">trim</span>());
                <span class="tok-keyword">if</span> (v &lt; min || v &gt; max) { System.out.<span class="tok-function">println</span>(errRange); <span class="tok-keyword">continue</span>; }
                <span class="tok-keyword">return</span> v;
            } <span class="tok-keyword">catch</span> (<span class="tok-type">NumberFormatException</span> e) { System.out.<span class="tok-function">println</span>(errNum); }
        }
    }
    <span class="tok-keyword">public static</span> <span class="tok-type">String</span> <span class="tok-function">getNonBlank</span>(<span class="tok-type">String</span> msg) {
        <span class="tok-type">String</span> s;
        <span class="tok-keyword">do</span> { System.out.<span class="tok-function">print</span>(msg); s = SC.<span class="tok-function">nextLine</span>().<span class="tok-function">trim</span>(); } <span class="tok-keyword">while</span> (s.<span class="tok-function">isEmpty</span>());
        <span class="tok-keyword">return</span> s;
    }
}</pre>
<div class="out"><b>Hành vi:</b> gõ <span class="badge">abc</span> → in errNum, hỏi lại. Gõ <span class="badge">99</span> khi max là 10 → in errRange, hỏi lại. Chương trình không bao giờ sập.</div>
<div class="callout warn">Đọc bằng <span class="badge">nextLine()</span> và parse bằng <span class="badge">Integer.parseInt</span> — đừng bao giờ dùng <span class="badge">nextInt()</span> trực tiếp. Một thói quen này loại bỏ lỗi sập phổ biến nhất trong thi.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Scanner.nextDouble() phụ thuộc locale.</b> Trên máy đặt locale dùng dấu phẩy thập phân, sc.nextDouble() từ chối &#96;3.5&#96; và đòi &#96;3,5&#96;. Đọc trọn dòng rồi gọi Double.parseDouble(line.trim()) luôn dùng dấu chấm, nên chương trình chạy giống nhau trên mọi máy lab. <em>Vì sao ngoài syllabus: locale vô hình cho tới khi máy người chấm khác máy bạn.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0063-input-and-display-person-info?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện nhập liệu: Input &amp; display Person Info</span><span class="lc-sub">Một đề nhỏ chỉ xoay quanh đọc &amp; hỏi lại gọn gàng.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.3 — Output that matches to the character|||1.3 — Xuất đúng định dạng tới từng ký tự',
          slug: 'lab211-xuat-dinh-dang',
          type: 'VIDEO',
          description: 'printf, %-15s, %.2f, String.format — người chấm so màn hình từng dòng nên nhãn/khoảng cách phải khớp tuyệt đối.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 1 · Lesson 1.3</span>
<h2>Output that matches to the character</h2>
<p class="lead">The marker compares your console with the expected screen. Correct logic + wrong spacing = wrong. Master <span class="badge">printf</span> and copy every label and space exactly from the brief.</p>
<h3>The format specifiers you will use constantly</h3>
<table>
  <thead><tr><th>Specifier</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">%d</span></td><td>integer</td><td><span class="badge">42</span></td></tr>
    <tr><td><span class="badge">%.2f</span></td><td>2 decimal places</td><td><span class="badge">3.14</span></td></tr>
    <tr><td><span class="badge">%-15s</span></td><td>string, left-aligned in width 15</td><td>pads with spaces on the right</td></tr>
    <tr><td><span class="badge">%10.2f</span></td><td>float, width 10, 2 decimals</td><td>right-aligned</td></tr>
    <tr><td><span class="badge">%n</span></td><td>newline (portable)</td><td>use instead of \\n in printf</td></tr>
  </tbody>
</table>
<pre><span class="tok-type">String</span> name = <span class="tok-string">"An"</span>;
<span class="tok-type">double</span> gpa = 3.6;
System.out.<span class="tok-function">printf</span>(<span class="tok-string">"%-15s%.2f%n"</span>, name, gpa);</pre>
<div class="out">An&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.60</div>
<p>The name is padded to 15 characters, then the GPA prints with exactly two decimals. Table headers use the <em>same</em> widths so columns line up.</p>
<div class="pitfall"><b>Trap:</b> briefs are sometimes inconsistent — <span class="badge">"Area: "</span> (with a space) for a rectangle but <span class="badge">"Area:"</span> (no space) for a circle. Copy each one <em>exactly as printed</em>; do not "tidy up". The marker compares literally.</div>
<div class="note-ct">When in doubt about a label, follow the <b>Guidelines</b> section of the brief over the screenshot — they occasionally disagree, and Guidelines is the authoritative version. Note the discrepancy aloud in a viva for bonus.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>printf uses the default locale too.</b> System.out.printf("%.2f", 3.5) can print &#96;3,50&#96; on a comma-locale machine and fail the exact-match check. Force a dot with String.format(Locale.US, "%.2f", x) or printf(Locale.US, ...). <em>Why beyond the syllabus: the locale of %f formatting is a detail the brief never mentions but the marker's screen assumes.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0061-create-a-program-to-calculate-perimeter-and-area?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Practise output: Perimeter &amp; Area</span><span class="lc-sub">A brief that hinges on matching labels and %.2f exactly.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 1 · Bài 1.3</span>
<h2>Xuất đúng định dạng tới từng ký tự</h2>
<p class="lead">Người chấm so console của bạn với màn hình mẫu. Logic đúng + khoảng cách sai = sai. Thành thạo <span class="badge">printf</span> và chép mọi nhãn, mọi dấu cách y nguyên từ đề.</p>
<h3>Các định dạng bạn dùng liên tục</h3>
<table>
  <thead><tr><th>Định dạng</th><th>Ý nghĩa</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">%d</span></td><td>số nguyên</td><td><span class="badge">42</span></td></tr>
    <tr><td><span class="badge">%.2f</span></td><td>2 chữ số thập phân</td><td><span class="badge">3.14</span></td></tr>
    <tr><td><span class="badge">%-15s</span></td><td>chuỗi, canh trái trong bề rộng 15</td><td>đệm dấu cách bên phải</td></tr>
    <tr><td><span class="badge">%10.2f</span></td><td>số thực, rộng 10, 2 thập phân</td><td>canh phải</td></tr>
    <tr><td><span class="badge">%n</span></td><td>xuống dòng (đa nền tảng)</td><td>dùng thay \\n trong printf</td></tr>
  </tbody>
</table>
<pre><span class="tok-type">String</span> name = <span class="tok-string">"An"</span>;
<span class="tok-type">double</span> gpa = 3.6;
System.out.<span class="tok-function">printf</span>(<span class="tok-string">"%-15s%.2f%n"</span>, name, gpa);</pre>
<div class="out">An&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.60</div>
<p>Tên được đệm tới 15 ký tự, rồi GPA in đúng hai chữ số thập phân. Tiêu đề bảng dùng <em>cùng</em> bề rộng để các cột thẳng hàng.</p>
<div class="pitfall"><b>Bẫy:</b> đề đôi khi không nhất quán — <span class="badge">"Area: "</span> (có dấu cách) cho hình chữ nhật nhưng <span class="badge">"Area:"</span> (không dấu cách) cho hình tròn. Chép từng cái <em>đúng như in</em>; đừng "dọn cho đẹp". Người chấm so nguyên văn.</div>
<div class="note-ct">Khi phân vân về một nhãn, theo mục <b>Guidelines</b> của đề hơn là ảnh chụp màn hình — chúng thỉnh thoảng vênh nhau, và Guidelines là bản có hiệu lực. Nêu điểm vênh này khi vấn đáp để được điểm cộng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>printf cũng dùng locale mặc định.</b> System.out.printf("%.2f", 3.5) có thể in &#96;3,50&#96; trên máy locale dấu phẩy và trượt phần so khớp chính xác. Ép dấu chấm bằng String.format(Locale.US, "%.2f", x) hoặc printf(Locale.US, ...). <em>Vì sao ngoài syllabus: locale của định dạng %f là chi tiết đề không nhắc nhưng màn hình người chấm mặc định có.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0061-create-a-program-to-calculate-perimeter-and-area?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Luyện xuất: Perimeter &amp; Area</span><span class="lc-sub">Đề xoay quanh việc khớp nhãn và %.2f chính xác.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 1 — Architecture & core skills|||Quiz 1 — Kiến trúc & kỹ năng nền',
          slug: 'lab211-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra kiến trúc phân tầng, Validator và định dạng output.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'A project with 3 files should have…|||Project 3 file nên có…', options: ['entity + bo + controller', 'entity + ui + utils, no bo|||entity + ui + utils, không bo', 'only a Main class|||chỉ một lớp Main', 'controller + service + data'], correctIndex: 1, points: 1 },
              { question: 'The bo (business object) layer should…|||Tầng bo (business object) nên…', options: ['print messages to the screen|||in thông báo ra màn hình', 'hold the collection and throw exceptions with messages|||giữ collection và ném ngoại lệ kèm thông báo', 'read from Scanner|||đọc từ Scanner', 'contain the menu|||chứa menu'], correctIndex: 1, points: 1 },
              { question: 'Why is reading input with nextInt() then nextLine() buggy?|||Vì sao đọc bằng nextInt() rồi nextLine() bị lỗi?', options: ['nextInt is deprecated|||nextInt đã lỗi thời', 'nextInt leaves the newline, so nextLine reads an empty string|||nextInt để lại ký tự xuống dòng, nên nextLine đọc chuỗi rỗng', 'they cannot be used together at all|||không thể dùng chung được', 'nextLine is slower|||nextLine chậm hơn'], correctIndex: 1, points: 1 },
              { question: 'To avoid a crash on bad numeric input, you should…|||Để tránh sập khi nhập số sai, bạn nên…', options: ['use nextInt() directly|||dùng nextInt() trực tiếp', 'read a line and parse with Integer.parseInt inside try/catch|||đọc một dòng và parse bằng Integer.parseInt trong try/catch', 'ignore the input|||bỏ qua input', 'exit the program|||thoát chương trình'], correctIndex: 1, points: 1 },
              { question: 'printf("%-15s", name) does what?|||printf("%-15s", name) làm gì?', options: ['right-aligns name in width 15|||canh phải name trong bề rộng 15', 'left-aligns name in width 15, padding spaces on the right|||canh trái name trong bề rộng 15, đệm dấu cách bên phải', 'prints 15 copies of name|||in 15 bản của name', 'truncates name to 15|||cắt name còn 15'], correctIndex: 1, points: 1 },
              { question: 'When the brief screenshot and Guidelines disagree on a label, follow…|||Khi ảnh màn hình và Guidelines vênh nhau về một nhãn, theo…', options: ['the screenshot|||ảnh màn hình', 'the Guidelines (authoritative), and note the discrepancy|||Guidelines (có hiệu lực), và nêu điểm vênh', 'whichever is shorter|||cái nào ngắn hơn', 'your own preference|||sở thích của bạn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PHẦN 2 — KHỞI ĐỘNG: NHÓM BÀI NHỎ ══════════════════ */
    {
      title: 'Part 2 — Warm-up: small problems|||Phần 2 — Khởi động: nhóm bài nhỏ',
      description: 'Xây phản xạ trên các đề ngắn: quy trình 5 bước, thuật toán sắp xếp & tìm kiếm, và xử lý chuỗi.',
      lessons: [
        {
          title: '2.1 — The 5-step attack on any brief|||2.1 — Quy trình 5 bước tấn công mọi đề',
          slug: 'lab211-quy-trinh-5-buoc',
          type: 'VIDEO',
          description: 'Một quy trình cố định để không bao giờ đơ trước project trống — luyện trên hai đề nhỏ nhất.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 2 · Lesson 2.1</span>
<h2>The 5-step attack on any brief</h2>
<p class="lead">Panic comes from not knowing what to do first. Replace it with a fixed procedure you run on every problem, from the 21-LOC warm-ups to the 500-LOC finals.</p>
<div class="lz-flow">
  <div class="lz-step">1 · Read twice. Underline every required message &amp; number format.</div>
  <div class="lz-step">2 · List the classes (entity? bo? controller?) using the file-count rule.</div>
  <div class="lz-step">3 · Write the entity + Validator first — they never change.</div>
  <div class="lz-step">4 · Build one feature end to end, run it, match the screen.</div>
  <div class="lz-step">5 · Repeat feature by feature; compile after each.</div>
</div>
<h3>Why "one feature at a time"</h3>
<p>Students lose exams by writing the whole program then compiling once — and drowning in 30 errors. Build the smallest runnable slice, confirm it prints the right line, then add the next. You are never more than one small change from a compiling program.</p>
<div class="callout ok">Start on the two smallest briefs — 21 and 25 LOC. They are trivial on purpose: the point is to rehearse the <em>procedure</em>, not the logic.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>NetBeans live templates save real minutes.</b> Type &#96;sout&#96;+Tab for System.out.println, &#96;psvm&#96;+Tab for the main signature, &#96;fori&#96;+Tab for a counted loop. In a typing-under-pressure exam these shortcuts pay back every practice hour you spent learning them. <em>Why beyond the syllabus: the syllabus grades output, not speed — but running out of time is what actually fails people.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0060-calculate-the-total-amount-spent-by-a-user-through-the-bills?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🐣</span>
  <span class="lc-body"><span class="lc-title">First brief: total amount from bills (21 LOC)</span><span class="lc-sub">The smallest one — run the 5-step loop on it.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 2 · Bài 2.1</span>
<h2>Quy trình 5 bước tấn công mọi đề</h2>
<p class="lead">Hoảng loạn đến từ việc không biết làm gì trước. Thay nó bằng một quy trình cố định bạn chạy trên mọi bài, từ đề khởi động 21 LOC tới đề cuối 500 LOC.</p>
<div class="lz-flow">
  <div class="lz-step">1 · Đọc hai lần. Gạch chân mọi thông báo bắt buộc &amp; định dạng số.</div>
  <div class="lz-step">2 · Liệt kê các lớp (entity? bo? controller?) theo quy tắc đếm file.</div>
  <div class="lz-step">3 · Viết entity + Validator trước — chúng không đổi.</div>
  <div class="lz-step">4 · Dựng một chức năng từ đầu tới cuối, chạy, khớp màn hình.</div>
  <div class="lz-step">5 · Lặp từng chức năng; biên dịch sau mỗi cái.</div>
</div>
<h3>Vì sao "mỗi lần một chức năng"</h3>
<p>Sinh viên trượt vì viết cả chương trình rồi mới biên dịch một lần — và chết đuối trong 30 lỗi. Hãy dựng lát cắt chạy được nhỏ nhất, xác nhận nó in đúng dòng, rồi thêm cái tiếp theo. Bạn không bao giờ cách một chương trình biên dịch được quá một thay đổi nhỏ.</p>
<div class="callout ok">Bắt đầu với hai đề nhỏ nhất — 21 và 25 LOC. Chúng đơn giản có chủ đích: mục tiêu là diễn tập <em>quy trình</em>, không phải logic.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Live template của NetBeans tiết kiệm phút thật.</b> Gõ &#96;sout&#96;+Tab ra System.out.println, &#96;psvm&#96;+Tab ra chữ ký main, &#96;fori&#96;+Tab ra vòng lặp đếm. Trong kỳ thi gõ-dưới-áp-lực, các phím tắt này trả lại mọi giờ luyện bạn bỏ ra để học chúng. <em>Vì sao ngoài syllabus: syllabus chấm output, không chấm tốc độ — nhưng hết giờ mới là thứ thật sự làm trượt.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0060-calculate-the-total-amount-spent-by-a-user-through-the-bills?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🐣</span>
  <span class="lc-body"><span class="lc-title">Đề đầu: tổng tiền từ hóa đơn (21 LOC)</span><span class="lc-sub">Đề nhỏ nhất — chạy vòng lặp 5 bước lên nó.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Sorting & searching algorithms|||2.2 — Thuật toán sắp xếp & tìm kiếm',
          slug: 'lab211-sap-xep-tim-kiem',
          type: 'VIDEO',
          description: 'Bubble/selection/insertion/quick/merge + tìm tuyến tính & nhị phân — mẫu code chuẩn và khi nào dùng cái nào.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 2 · Lesson 2.2</span>
<h2>Sorting &amp; searching — the classic briefs</h2>
<p class="lead">Several briefs ask you to <em>write the algorithm by hand</em> (not call Arrays.sort). Memorise the shapes so you can type them without thinking. Here is the workhorse — bubble sort — and the key idea of each cousin.</p>
<pre><span class="tok-comment">// Bubble sort — swap adjacent out-of-order pairs, repeat</span>
<span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; a.length - 1; i++)
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> j = 0; j &lt; a.length - 1 - i; j++)
    <span class="tok-keyword">if</span> (a[j] &gt; a[j + 1]) {
      <span class="tok-type">int</span> t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
    }</pre>
<div class="out"><b>Input:</b> [5, 2, 4, 1] → <b>Output:</b> [1, 2, 4, 5]</div>
<table>
  <thead><tr><th>Algorithm</th><th>Idea</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>Bubble</td><td>swap adjacent pairs</td><td>O(n²)</td></tr>
    <tr><td>Selection</td><td>pick the smallest, put it in front</td><td>O(n²)</td></tr>
    <tr><td>Insertion</td><td>insert each item into the sorted left part</td><td>O(n²)</td></tr>
    <tr><td>Quick</td><td>partition around a pivot, recurse</td><td>O(n log n)</td></tr>
    <tr><td>Merge</td><td>split, sort halves, merge</td><td>O(n log n)</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Binary search trap:</b> it only works on a <strong>sorted</strong> array. On an unsorted array it may accidentally return a wrong index (or -1). Sort first, or use linear search when the data is unsorted.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Add an early-exit flag to bubble sort.</b> Track a boolean &#96;swapped&#96; each outer pass and break when a pass makes no swaps, so an already-sorted array costs O(n) instead of O(n²). It is one extra line and a favourite viva follow-up. <em>Why beyond the syllabus: the syllabus teaches the naive double loop; the optimisation is what a mentor probes to see if you truly understand it.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0001-bubble-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Practise: Bubble → Selection → Insertion → Quick → Merge</span><span class="lc-sub">Briefs P0001–P0005; then linear (P0010) &amp; binary (P0006) search.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-856" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Algorithm Reference — measured comparisons</span><span class="lc-sub">"Say X → use Y, never Z" + real cost measurements.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 2 · Bài 2.2</span>
<h2>Sắp xếp &amp; tìm kiếm — những đề kinh điển</h2>
<p class="lead">Nhiều đề yêu cầu bạn <em>tự viết thuật toán</em> (không gọi Arrays.sort). Thuộc lòng các dạng để gõ mà không cần nghĩ. Đây là con ngựa thồ — bubble sort — và ý chính của mỗi họ hàng.</p>
<pre><span class="tok-comment">// Bubble sort — đổi chỗ cặp liền kề sai thứ tự, lặp lại</span>
<span class="tok-keyword">for</span> (<span class="tok-type">int</span> i = 0; i &lt; a.length - 1; i++)
  <span class="tok-keyword">for</span> (<span class="tok-type">int</span> j = 0; j &lt; a.length - 1 - i; j++)
    <span class="tok-keyword">if</span> (a[j] &gt; a[j + 1]) {
      <span class="tok-type">int</span> t = a[j]; a[j] = a[j + 1]; a[j + 1] = t;
    }</pre>
<div class="out"><b>Nhập:</b> [5, 2, 4, 1] → <b>Xuất:</b> [1, 2, 4, 5]</div>
<table>
  <thead><tr><th>Thuật toán</th><th>Ý tưởng</th><th>Chi phí</th></tr></thead>
  <tbody>
    <tr><td>Bubble</td><td>đổi chỗ cặp liền kề</td><td>O(n²)</td></tr>
    <tr><td>Selection</td><td>chọn nhỏ nhất, đưa lên đầu</td><td>O(n²)</td></tr>
    <tr><td>Insertion</td><td>chèn mỗi phần tử vào phần trái đã sắp</td><td>O(n²)</td></tr>
    <tr><td>Quick</td><td>phân hoạch quanh chốt, đệ quy</td><td>O(n log n)</td></tr>
    <tr><td>Merge</td><td>chia đôi, sắp hai nửa, trộn</td><td>O(n log n)</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Bẫy tìm nhị phân:</b> nó chỉ chạy đúng trên mảng <strong>đã sắp</strong>. Trên mảng chưa sắp nó có thể trả nhầm chỉ số (hoặc -1). Sắp trước, hoặc dùng tìm tuyến tính khi dữ liệu chưa sắp.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thêm cờ thoát sớm cho bubble sort.</b> Theo dõi một boolean &#96;swapped&#96; mỗi lượt ngoài và dừng khi một lượt không đổi chỗ nào, để mảng đã sắp chỉ tốn O(n) thay vì O(n²). Chỉ thêm một dòng và là câu hỏi vấn đáp ưa thích. <em>Vì sao ngoài syllabus: syllabus dạy vòng lặp đôi ngây thơ; tối ưu này là thứ mentor soi để xem bạn có thật hiểu không.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0001-bubble-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🔢</span>
  <span class="lc-body"><span class="lc-title">Luyện: Bubble → Selection → Insertion → Quick → Merge</span><span class="lc-sub">Đề P0001–P0005; rồi tìm tuyến tính (P0010) &amp; nhị phân (P0006).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-856" target="_blank" rel="noopener">
  <span class="lc-ico">📊</span>
  <span class="lc-body"><span class="lc-title">Algorithm Reference — so sánh đo thật</span><span class="lc-sub">"Nói X → dùng Y, cấm Z" + số đo chi phí thật.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '2.3 — String processing|||2.3 — Xử lý chuỗi',
          slug: 'lab211-xu-ly-chuoi',
          type: 'VIDEO',
          description: 'split, trim, substring, StringTokenizer, đếm ký tự — và bẫy split trên chuỗi rỗng/khoảng trắng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 2 · Lesson 2.3</span>
<h2>String processing — parse, split, count</h2>
<p class="lead">Many briefs analyse a line of text: split a file path, count letters, tokenise a sentence. String is the single most-used class in this course — after Scanner. Know these methods cold.</p>
<pre><span class="tok-type">String</span> s = <span class="tok-string">"D001,Tran Binh,Cardiology"</span>;
<span class="tok-type">String</span>[] parts = s.<span class="tok-function">split</span>(<span class="tok-string">","</span>);   <span class="tok-comment">// ["D001","Tran Binh","Cardiology"]</span>
<span class="tok-type">int</span> len = s.<span class="tok-function">length</span>();           <span class="tok-comment">// 25 (count carefully!)</span>
<span class="tok-type">String</span> code = parts[0].<span class="tok-function">trim</span>();</pre>
<div class="out"><b>parts.length</b> = 3 · <b>parts[1]</b> = "Tran Binh"</div>
<div class="pitfall"><b>The split traps (measured, not guessed):</b><br>
• <span class="badge">""</span>.split("\\\\s+") has length <strong>1</strong> (one empty token), but <span class="badge">"   "</span>.split("\\\\s+") has length <strong>0</strong>.<br>
• <span class="badge">"a    b".split(" ")</span> keeps empty strings between the spaces; <span class="badge">split("\\\\s+")</span> or StringTokenizer collapses them.<br>
• <span class="badge">Character.isWhitespace('\\u00A0')</span> is <strong>false</strong> — a non-breaking space is not "whitespace".</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Build strings with StringBuilder inside loops.</b> Each &#96;s = s + x&#96; in a loop allocates a brand-new String, turning an O(n) join into O(n²); use a StringBuilder and one toString() at the end. On a big-input brief this is the difference between instant and visibly slow. <em>Why beyond the syllabus: String immutability's cost is assumed knowledge the brief never states.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0067-analyze-the-user-input-string?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Practise: analyze the user input string</span><span class="lc-sub">Also P0062 (file path) &amp; P0008 (letter/character count).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 2 · Bài 2.3</span>
<h2>Xử lý chuỗi — phân tích, tách, đếm</h2>
<p class="lead">Nhiều đề phân tích một dòng văn bản: tách đường dẫn file, đếm chữ cái, tách câu thành từ. String là lớp dùng nhiều nhất trong môn — sau Scanner. Thuộc lòng các phương thức này.</p>
<pre><span class="tok-type">String</span> s = <span class="tok-string">"D001,Tran Binh,Cardiology"</span>;
<span class="tok-type">String</span>[] parts = s.<span class="tok-function">split</span>(<span class="tok-string">","</span>);   <span class="tok-comment">// ["D001","Tran Binh","Cardiology"]</span>
<span class="tok-type">int</span> len = s.<span class="tok-function">length</span>();           <span class="tok-comment">// 25 (đếm cẩn thận!)</span>
<span class="tok-type">String</span> code = parts[0].<span class="tok-function">trim</span>();</pre>
<div class="out"><b>parts.length</b> = 3 · <b>parts[1]</b> = "Tran Binh"</div>
<div class="pitfall"><b>Các bẫy split (đo thật, không đoán):</b><br>
• <span class="badge">""</span>.split("\\\\s+") có độ dài <strong>1</strong> (một token rỗng), nhưng <span class="badge">"   "</span>.split("\\\\s+") có độ dài <strong>0</strong>.<br>
• <span class="badge">"a    b".split(" ")</span> giữ các chuỗi rỗng giữa các dấu cách; <span class="badge">split("\\\\s+")</span> hoặc StringTokenizer gộp chúng.<br>
• <span class="badge">Character.isWhitespace('\\u00A0')</span> là <strong>false</strong> — dấu cách không ngắt không phải "whitespace".</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nối chuỗi trong vòng lặp bằng StringBuilder.</b> Mỗi &#96;s = s + x&#96; trong vòng lặp cấp phát một String mới toanh, biến phép nối O(n) thành O(n²); dùng StringBuilder và một toString() ở cuối. Với đề input lớn, đây là ranh giới giữa tức thì và chậm thấy rõ. <em>Vì sao ngoài syllabus: cái giá của tính bất biến của String là kiến thức đề mặc định mà không nói.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0067-analyze-the-user-input-string?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🔤</span>
  <span class="lc-body"><span class="lc-title">Luyện: analyze the user input string</span><span class="lc-sub">Kèm P0062 (đường dẫn file) &amp; P0008 (đếm chữ/ký tự).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 2 — Warm-up algorithms & strings|||Quiz 2 — Thuật toán khởi động & chuỗi',
          slug: 'lab211-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra sắp xếp, tìm kiếm và xử lý chuỗi.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Binary search requires the array to be…|||Tìm nhị phân yêu cầu mảng phải…', options: ['non-empty|||khác rỗng', 'sorted|||đã sắp xếp', 'of even length|||có độ dài chẵn', 'all positive|||toàn số dương'], correctIndex: 1, points: 1 },
              { question: 'Which two algorithms are O(n log n)?|||Hai thuật toán nào là O(n log n)?', options: ['bubble & selection|||bubble & selection', 'quick & merge|||quick & merge', 'insertion & linear search|||insertion & tìm tuyến tính', 'bubble & insertion|||bubble & insertion'], correctIndex: 1, points: 1 },
              { question: '"   ".split("\\\\s+").length is…|||"   ".split("\\\\s+").length bằng…', options: ['1', '0', '3', 'an error|||một lỗi'], correctIndex: 1, points: 1 },
              { question: 'The recommended order to solve the 54 briefs is…|||Thứ tự khuyến nghị để giải 54 đề là…', options: ['alphabetical|||theo bảng chữ', 'by lines of code, easy first|||theo số dòng code, dễ trước', 'hardest first|||khó trước', 'random|||ngẫu nhiên'], correctIndex: 1, points: 1 },
              { question: 'Building "one feature at a time, compile after each" helps because…|||Dựng "mỗi lần một chức năng, biên dịch sau mỗi cái" giúp vì…', options: ['it looks professional|||trông chuyên nghiệp', 'you are never far from a compiling program|||bạn không bao giờ xa một chương trình biên dịch được', 'it uses less memory|||tốn ít bộ nhớ hơn', 'the marker likes it|||người chấm thích'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ PHẦN 3 — VALIDATION, NGÀY, SỐ ══════════════════ */
    {
      title: 'Part 3 — Validation, dates & numbers|||Phần 3 — Validation, ngày tháng & số học',
      description: 'Ba nhóm bẫy hay làm mất điểm: thông báo lỗi theo Guidelines, xử lý ngày lenient, và số/hệ cơ số/hình học.',
      lessons: [
        {
          title: '3.1 — Validation & exceptions by the spec|||3.1 — Validation & ngoại lệ theo đề',
          slug: 'lab211-validation-ngoai-le',
          type: 'VIDEO',
          description: 'Ném ngoại lệ với thông báo LẤY TỪ Guidelines; regex kiểm định dạng; luật "không sập, không thoát".',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 3 · Lesson 3.1</span>
<h2>Validation &amp; exceptions — exactly as the brief says</h2>
<p class="lead">Around 20 briefs require validation with specific error messages. The rule is absolute: the message must match the <strong>Guidelines</strong> text, character for character. Do not paraphrase.</p>
<pre><span class="tok-comment">// bo throws with the exact message from Guidelines</span>
<span class="tok-keyword">if</span> (exists(code))
    <span class="tok-keyword">throw new</span> <span class="tok-function">Exception</span>(<span class="tok-string">"Doctor code ["</span> + code + <span class="tok-string">"] is duplicate."</span>);

<span class="tok-comment">// controller catches and prints — never let it crash</span>
<span class="tok-keyword">try</span> { bo.<span class="tok-function">add</span>(d); }
<span class="tok-keyword">catch</span> (<span class="tok-type">Exception</span> e) { System.out.<span class="tok-function">println</span>(e.<span class="tok-function">getMessage</span>()); }</pre>
<p>Format checks (phone, email, code patterns) use regex:</p>
<pre><span class="tok-keyword">if</span> (!phone.<span class="tok-function">matches</span>(<span class="tok-string">"0\\\\d{9}"</span>))
    <span class="tok-keyword">throw new</span> <span class="tok-function">Exception</span>(<span class="tok-string">"Phone number must be number"</span>);</pre>
<div class="pitfall"><b>Spec conflict trap:</b> the on-screen wording and the Guidelines wording sometimes differ, e.g. screen "You must input digidt." vs Guidelines "You must input digit." <strong>Always follow Guidelines</strong> (the effective version) and mention the discrepancy in a viva.</div>
<div class="callout danger">A program that throws an uncaught exception on bad input scores zero for that run. Wrap every risky call; validation is not optional polish, it is the difference between a mark and a zero.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Precompile regex you use repeatedly.</b> s.matches(regex) recompiles the pattern on every call; when validating a whole file of rows, compile once with Pattern.compile(...) and reuse the Matcher. It also lets you name the pattern, which reads better in a viva. <em>Why beyond the syllabus: the hidden per-call compile cost is never mentioned in the brief.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0064-check-data-format?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">Practise: Check data format</span><span class="lc-sub">Validate phone/email/date with exact messages.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 3 · Bài 3.1</span>
<h2>Validation &amp; ngoại lệ — đúng như đề nói</h2>
<p class="lead">Khoảng 20 đề yêu cầu validate với thông báo lỗi cụ thể. Luật là tuyệt đối: thông báo phải khớp văn bản <strong>Guidelines</strong>, từng ký tự. Đừng diễn đạt lại.</p>
<pre><span class="tok-comment">// bo ném kèm thông báo y hệt từ Guidelines</span>
<span class="tok-keyword">if</span> (exists(code))
    <span class="tok-keyword">throw new</span> <span class="tok-function">Exception</span>(<span class="tok-string">"Doctor code ["</span> + code + <span class="tok-string">"] is duplicate."</span>);

<span class="tok-comment">// controller bắt và in — không bao giờ để nó sập</span>
<span class="tok-keyword">try</span> { bo.<span class="tok-function">add</span>(d); }
<span class="tok-keyword">catch</span> (<span class="tok-type">Exception</span> e) { System.out.<span class="tok-function">println</span>(e.<span class="tok-function">getMessage</span>()); }</pre>
<p>Kiểm định dạng (số điện thoại, email, mẫu mã) dùng regex:</p>
<pre><span class="tok-keyword">if</span> (!phone.<span class="tok-function">matches</span>(<span class="tok-string">"0\\\\d{9}"</span>))
    <span class="tok-keyword">throw new</span> <span class="tok-function">Exception</span>(<span class="tok-string">"Phone number must be number"</span>);</pre>
<div class="pitfall"><b>Bẫy đề tự vênh:</b> câu chữ trên màn hình và trong Guidelines đôi khi khác nhau, vd màn hình "You must input digidt." vs Guidelines "You must input digit." <strong>Luôn theo Guidelines</strong> (bản có hiệu lực) và nêu điểm vênh khi vấn đáp.</div>
<div class="callout danger">Chương trình ném ngoại lệ không bắt khi nhập sai sẽ 0 điểm lần chạy đó. Bọc mọi lời gọi rủi ro; validate không phải "đánh bóng" tùy chọn, nó là ranh giới giữa có điểm và 0 điểm.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Biên dịch trước regex dùng lặp lại.</b> s.matches(regex) biên dịch lại mẫu mỗi lần gọi; khi validate cả một tệp nhiều dòng, hãy compile một lần bằng Pattern.compile(...) rồi dùng lại Matcher. Nó còn cho phép đặt tên mẫu, đọc gọn hơn khi vấn đáp. <em>Vì sao ngoài syllabus: chi phí biên dịch mỗi lần gọi ẩn đi, đề không bao giờ nhắc.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0064-check-data-format?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">✅</span>
  <span class="lc-body"><span class="lc-title">Luyện: Check data format</span><span class="lc-sub">Validate phone/email/ngày với thông báo chính xác.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '3.2 — Dates: the lenient trap|||3.2 — Ngày tháng: bẫy lenient',
          slug: 'lab211-ngay-thang-lenient',
          type: 'VIDEO',
          description: 'SimpleDateFormat/LocalDate mặc định "nắn" ngày sai thành ngày hợp lệ — cách bắt nó từ chối đúng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 3 · Lesson 3.2</span>
<h2>Dates — why "31/02/2003" is silently accepted</h2>
<p class="lead">Date validation is a favourite grader trap. Java's date parsers are <strong>lenient by default</strong>: they quietly roll an impossible date into a valid one instead of rejecting it. If your "is this a real date?" check passes 31/02, you lose marks.</p>
<pre><span class="tok-comment">// SimpleDateFormat is lenient by default</span>
<span class="tok-type">SimpleDateFormat</span> f = <span class="tok-keyword">new</span> <span class="tok-function">SimpleDateFormat</span>(<span class="tok-string">"dd/MM/yyyy"</span>);
f.<span class="tok-function">setLenient</span>(<span class="tok-keyword">false</span>);          <span class="tok-comment">// REQUIRED — else 31/02 becomes 03/03</span>
<span class="tok-type">Date</span> d = f.<span class="tok-function">parse</span>(input);      <span class="tok-comment">// now throws ParseException on 31/02</span></pre>
<div class="pitfall"><b>Measured facts (do not trust memory):</b><br>
• With <span class="badge">LocalDate.parse("31/02/2003", …)</span> in SMART mode, Java nudges it to <span class="badge">2003-02-28</span>. To reject you need <span class="badge">ResolverStyle.STRICT</span> <em>and</em> pattern <span class="badge">uuuu</span> (not <span class="badge">yyyy</span>).<br>
• Even <span class="badge">setLenient(false)</span> can accept <span class="badge">"26-06-2015rubbish"</span> — parsing stops early and drops the tail. Format the result back and compare to the input to be safe.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Pattern letters are case-sensitive — MM is not mm.</b> In SimpleDateFormat, &#96;MM&#96; is month but &#96;mm&#96; is minutes, and &#96;dd&#96; is day-of-month while &#96;DD&#96; is day-of-year. A single wrong-case letter parses a plausible-but-wrong date and never throws. <em>Why beyond the syllabus: the case rule lives in the Javadoc, not the lab brief.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-855" target="_blank" rel="noopener">
  <span class="lc-ico">📅</span>
  <span class="lc-body"><span class="lc-title">API Reference — dates section</span><span class="lc-sub">LocalDate/SimpleDateFormat with the strict-parsing recipe.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 3 · Bài 3.2</span>
<h2>Ngày tháng — vì sao "31/02/2003" được chấp nhận âm thầm</h2>
<p class="lead">Kiểm ngày là bẫy người chấm ưa thích. Bộ phân tích ngày của Java <strong>lenient mặc định</strong>: nó âm thầm "nắn" ngày không thể thành ngày hợp lệ thay vì từ chối. Nếu hàm "đây có phải ngày thật?" của bạn cho 31/02 đi qua, bạn mất điểm.</p>
<pre><span class="tok-comment">// SimpleDateFormat lenient mặc định</span>
<span class="tok-type">SimpleDateFormat</span> f = <span class="tok-keyword">new</span> <span class="tok-function">SimpleDateFormat</span>(<span class="tok-string">"dd/MM/yyyy"</span>);
f.<span class="tok-function">setLenient</span>(<span class="tok-keyword">false</span>);          <span class="tok-comment">// BẮT BUỘC — nếu không 31/02 thành 03/03</span>
<span class="tok-type">Date</span> d = f.<span class="tok-function">parse</span>(input);      <span class="tok-comment">// giờ ném ParseException với 31/02</span></pre>
<div class="pitfall"><b>Sự thật đo được (đừng tin trí nhớ):</b><br>
• Với <span class="badge">LocalDate.parse("31/02/2003", …)</span> ở chế độ SMART, Java nắn thành <span class="badge">2003-02-28</span>. Muốn từ chối cần <span class="badge">ResolverStyle.STRICT</span> <em>và</em> mẫu <span class="badge">uuuu</span> (không phải <span class="badge">yyyy</span>).<br>
• Ngay cả <span class="badge">setLenient(false)</span> vẫn chấp nhận <span class="badge">"26-06-2015rubbish"</span> — parse dừng sớm và bỏ phần đuôi. Format kết quả ngược lại rồi so với input để chắc.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chữ mẫu phân biệt hoa thường — MM khác mm.</b> Trong SimpleDateFormat, &#96;MM&#96; là tháng nhưng &#96;mm&#96; là phút, và &#96;dd&#96; là ngày-trong-tháng còn &#96;DD&#96; là ngày-trong-năm. Một chữ sai hoa/thường sẽ parse ra ngày hợp lý-nhưng-sai và không bao giờ ném lỗi. <em>Vì sao ngoài syllabus: quy tắc hoa thường nằm trong Javadoc, không nằm trong đề lab.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-855" target="_blank" rel="noopener">
  <span class="lc-ico">📅</span>
  <span class="lc-body"><span class="lc-title">API Reference — mục ngày tháng</span><span class="lc-sub">LocalDate/SimpleDateFormat kèm công thức parse nghiêm ngặt.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '3.3 — Numbers, bases & geometry|||3.3 — Số, hệ cơ số & hình học',
          slug: 'lab211-so-he-co-so',
          type: 'VIDEO',
          description: 'Đổi hệ cơ số (2/10/16), số chính phương, chu vi/diện tích — và bẫy làm tròn số thực.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 3 · Lesson 3.3</span>
<h2>Numbers, bases &amp; geometry</h2>
<p class="lead">A cluster of briefs is pure arithmetic: convert between number bases, find perfect squares, compute perimeter and area. They are easy to get 90% right and lose the last 10% to a rounding or definition slip.</p>
<pre><span class="tok-comment">// Base conversion with the built-ins</span>
<span class="tok-type">int</span> n = Integer.<span class="tok-function">parseInt</span>(<span class="tok-string">"1010"</span>, 2);   <span class="tok-comment">// binary → 10</span>
<span class="tok-type">String</span> hex = Integer.<span class="tok-function">toHexString</span>(255);  <span class="tok-comment">// → "ff"</span>
<span class="tok-type">String</span> bin = Integer.<span class="tok-function">toBinaryString</span>(10); <span class="tok-comment">// → "1010"</span></pre>
<div class="pitfall"><b>Two real traps caught by running the code:</b><br>
• <b>Perfect square by definition, not by eye.</b> Some briefs' screenshots list wrong "squares" (e.g. 321, 22). Follow the Guidelines ("use Math.sqrt") and check <span class="badge">Math.sqrt(x)</span> is a whole number.<br>
• <b>Floating point.</b> <span class="badge">health*(1 - 80/100.0)</span> gives 19.999999999999996 — it prints "20.00" but compares as &lt; 20. Rearrange to <span class="badge">health*(100-80)/100.0</span> for an exact 20.0. Triangle inequality first, or Heron's formula returns NaN on 1-2-10.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Integer division truncates before you notice.</b> &#96;7 / 2&#96; is 3, not 3.5, and &#96;avg = sum / count&#96; on int types silently drops the fraction; cast one operand first with &#96;(double) sum / count&#96;. Averages and percentages are where this quietly costs marks. <em>Why beyond the syllabus: it is a language rule the brief assumes you already avoid.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0011-change-base-number-system-16-10-2-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🔟</span>
  <span class="lc-body"><span class="lc-title">Practise: change base number system</span><span class="lc-sub">Also P0061 (perimeter/area) &amp; P0050 (squares/even/odd).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 3 · Bài 3.3</span>
<h2>Số, hệ cơ số &amp; hình học</h2>
<p class="lead">Một nhóm đề thuần số học: đổi giữa các hệ cơ số, tìm số chính phương, tính chu vi và diện tích. Chúng dễ đúng 90% rồi mất 10% cuối vì một lỗi làm tròn hoặc định nghĩa.</p>
<pre><span class="tok-comment">// Đổi hệ cơ số bằng hàm có sẵn</span>
<span class="tok-type">int</span> n = Integer.<span class="tok-function">parseInt</span>(<span class="tok-string">"1010"</span>, 2);   <span class="tok-comment">// nhị phân → 10</span>
<span class="tok-type">String</span> hex = Integer.<span class="tok-function">toHexString</span>(255);  <span class="tok-comment">// → "ff"</span>
<span class="tok-type">String</span> bin = Integer.<span class="tok-function">toBinaryString</span>(10); <span class="tok-comment">// → "1010"</span></pre>
<div class="pitfall"><b>Hai bẫy thật bắt được nhờ chạy code:</b><br>
• <b>Số chính phương theo định nghĩa, không theo mắt.</b> Ảnh màn hình vài đề liệt kê "số chính phương" sai (vd 321, 22). Theo Guidelines ("dùng Math.sqrt") và kiểm <span class="badge">Math.sqrt(x)</span> có phải số nguyên.<br>
• <b>Số thực.</b> <span class="badge">health*(1 - 80/100.0)</span> ra 19.999999999999996 — in "20.00" nhưng so sánh lại &lt; 20. Sắp lại thành <span class="badge">health*(100-80)/100.0</span> cho đúng 20.0. Kiểm bất đẳng thức tam giác trước, nếu không công thức Heron trả NaN với 1-2-10.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chia số nguyên cắt phần lẻ trước khi bạn kịp nhận ra.</b> &#96;7 / 2&#96; ra 3 chứ không phải 3.5, và &#96;avg = sum / count&#96; trên kiểu int âm thầm bỏ phần thập phân; ép một toán hạng trước bằng &#96;(double) sum / count&#96;. Trung bình và phần trăm là chỗ lỗi này âm thầm mất điểm. <em>Vì sao ngoài syllabus: đây là quy tắc ngôn ngữ đề mặc định bạn đã tránh.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0011-change-base-number-system-16-10-2-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🔟</span>
  <span class="lc-body"><span class="lc-title">Luyện: change base number system</span><span class="lc-sub">Kèm P0061 (chu vi/diện tích) &amp; P0050 (chính phương/chẵn/lẻ).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 3 — Validation, dates & numbers|||Quiz 3 — Validation, ngày & số',
          slug: 'lab211-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra validation, bẫy ngày lenient và bẫy số thực.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'When an error message differs between the screenshot and the Guidelines, use…|||Khi thông báo lỗi khác nhau giữa ảnh và Guidelines, dùng…', options: ['the screenshot|||ảnh', 'the Guidelines wording exactly|||đúng câu chữ Guidelines', 'a shortened version|||bản rút gọn', 'English only|||chỉ tiếng Anh'], correctIndex: 1, points: 1 },
              { question: 'To make SimpleDateFormat reject 31/02/2003 you must…|||Để SimpleDateFormat từ chối 31/02/2003 bạn phải…', options: ['do nothing, it rejects by default|||không làm gì, nó từ chối mặc định', 'call setLenient(false)|||gọi setLenient(false)', 'use nextInt|||dùng nextInt', 'catch NullPointerException|||bắt NullPointerException'], correctIndex: 1, points: 1 },
              { question: 'health*(1 - 80/100.0) can print "20.00" but compare as < 20 because…|||health*(1 - 80/100.0) có thể in "20.00" nhưng so sánh < 20 vì…', options: ['integer overflow|||tràn số nguyên', 'floating-point cannot represent 0.8 exactly|||số thực không biểu diễn 0.8 chính xác', 'a syntax error|||lỗi cú pháp', 'Math.sqrt is wrong|||Math.sqrt sai'], correctIndex: 1, points: 1 },
              { question: 'An uncaught exception on bad input results in…|||Ngoại lệ không bắt khi nhập sai dẫn tới…', options: ['a warning only|||chỉ cảnh báo', 'zero marks for that run|||0 điểm lần chạy đó', 'automatic retry|||tự thử lại', 'nothing|||không sao'], correctIndex: 1, points: 1 },
              { question: 'To test a perfect square you should…|||Để kiểm số chính phương bạn nên…', options: ['trust the screenshot list|||tin danh sách trong ảnh', 'check Math.sqrt(x) is a whole number|||kiểm Math.sqrt(x) là số nguyên', 'use split|||dùng split', 'convert to binary|||đổi sang nhị phân'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PHẦN 4 — CRUD & COLLECTIONS ══════════════════ */
    {
      title: 'Part 4 — CRUD, Collections & Comparator|||Phần 4 — CRUD, Collections & Comparator',
      description: 'Xương sống của LAB211: menu thêm/sửa/xóa/tìm với ArrayList/LinkedHashMap, sắp xếp đối tượng bằng Comparator, quản lý nhiều thực thể.',
      lessons: [
        {
          title: '4.1 — The CRUD menu skeleton|||4.1 — Khung menu CRUD',
          slug: 'lab211-crud-menu',
          type: 'VIDEO',
          description: 'Khung menu + vòng lặp + ArrayList/LinkedHashMap dùng lại cho hầu hết bài quản lý.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 4 · Lesson 4.1</span>
<h2>The CRUD menu skeleton you reuse everywhere</h2>
<p class="lead">The largest group of briefs is "manage a list of X": add, display, update, delete, search, save. They all share one skeleton. Learn it once and half of LAB211 becomes fill-in-the-blank.</p>
<pre><span class="tok-keyword">int</span> choice;
<span class="tok-keyword">do</span> {
    System.out.<span class="tok-function">println</span>(<span class="tok-string">"1. Add\\n2. Display\\n3. Update\\n4. Delete\\n5. Save\\n0. Exit"</span>);
    choice = Validator.<span class="tok-function">getInt</span>(<span class="tok-string">"Choose: "</span>, <span class="tok-string">"0-5 only"</span>, <span class="tok-string">"Number please"</span>, 0, 5);
    <span class="tok-keyword">switch</span> (choice) {
        <span class="tok-keyword">case</span> 1: ctrl.<span class="tok-function">add</span>(); <span class="tok-keyword">break</span>;
        <span class="tok-keyword">case</span> 2: ctrl.<span class="tok-function">display</span>(); <span class="tok-keyword">break</span>;
        <span class="tok-comment">// ...</span>
    }
} <span class="tok-keyword">while</span> (choice != 0);</pre>
<p>Pick the collection to match the brief:</p>
<table>
  <thead><tr><th>Need</th><th>Use</th></tr></thead>
  <tbody>
    <tr><td>ordered list, duplicates OK</td><td><span class="badge">ArrayList</span></td></tr>
    <tr><td>key → value, keep insertion order</td><td><span class="badge">LinkedHashMap</span></td></tr>
    <tr><td>fast lookup by unique key</td><td><span class="badge">HashMap</span></td></tr>
  </tbody>
</table>
<div class="note-ct">Save after <em>every</em> change if the brief keeps data in a file, so a crash mid-session never loses data. Use a lowercase key when the brief says lookups are case-insensitive.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Delete safely with removeIf.</b> On JDK 8, list.removeIf(x -&gt; x.getCode().equals(code)) removes matches in one line without the ConcurrentModificationException you get from removing inside a for-each. It is shorter and safer than a manual index loop. <em>Why beyond the syllabus: the brief says "delete", never which idiom survives mid-iteration removal.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0058-write-program-dictionary?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">Practise: dictionary (CRUD + file)</span><span class="lc-sub">The first full CRUD skeleton with a LinkedHashMap.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 4 · Bài 4.1</span>
<h2>Khung menu CRUD dùng lại ở mọi nơi</h2>
<p class="lead">Nhóm đề lớn nhất là "quản lý một danh sách X": thêm, hiển thị, sửa, xóa, tìm, lưu. Tất cả chung một khung. Thuộc nó một lần và nửa số bài LAB211 thành điền vào chỗ trống.</p>
<pre><span class="tok-keyword">int</span> choice;
<span class="tok-keyword">do</span> {
    System.out.<span class="tok-function">println</span>(<span class="tok-string">"1. Add\\n2. Display\\n3. Update\\n4. Delete\\n5. Save\\n0. Exit"</span>);
    choice = Validator.<span class="tok-function">getInt</span>(<span class="tok-string">"Choose: "</span>, <span class="tok-string">"0-5 only"</span>, <span class="tok-string">"Number please"</span>, 0, 5);
    <span class="tok-keyword">switch</span> (choice) {
        <span class="tok-keyword">case</span> 1: ctrl.<span class="tok-function">add</span>(); <span class="tok-keyword">break</span>;
        <span class="tok-keyword">case</span> 2: ctrl.<span class="tok-function">display</span>(); <span class="tok-keyword">break</span>;
        <span class="tok-comment">// ...</span>
    }
} <span class="tok-keyword">while</span> (choice != 0);</pre>
<p>Chọn collection khớp đề:</p>
<table>
  <thead><tr><th>Cần</th><th>Dùng</th></tr></thead>
  <tbody>
    <tr><td>danh sách có thứ tự, cho phép trùng</td><td><span class="badge">ArrayList</span></td></tr>
    <tr><td>khóa → giá trị, giữ thứ tự chèn</td><td><span class="badge">LinkedHashMap</span></td></tr>
    <tr><td>tra nhanh theo khóa duy nhất</td><td><span class="badge">HashMap</span></td></tr>
  </tbody>
</table>
<div class="note-ct">Lưu sau <em>mỗi</em> thay đổi nếu đề giữ dữ liệu trong tệp, để sập giữa chừng không bao giờ mất dữ liệu. Dùng khóa chữ thường khi đề nói tra cứu không phân biệt hoa/thường.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Xóa an toàn bằng removeIf.</b> Trên JDK 8, list.removeIf(x -&gt; x.getCode().equals(code)) xóa các phần tử khớp trong một dòng mà không gặp ConcurrentModificationException như khi xóa trong for-each. Nó ngắn và an toàn hơn vòng lặp chỉ số thủ công. <em>Vì sao ngoài syllabus: đề nói "xóa", không nói cách viết nào sống sót khi xóa giữa lúc duyệt.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0058-write-program-dictionary?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">Luyện: dictionary (CRUD + tệp)</span><span class="lc-sub">Khung CRUD hoàn chỉnh đầu tiên với LinkedHashMap.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '4.2 — Comparator & sorting objects|||4.2 — Comparator & sắp xếp đối tượng',
          slug: 'lab211-comparator',
          type: 'VIDEO',
          description: 'Sắp xếp danh sách đối tượng theo nhiều tiêu chí bằng Comparator/Comparable — yêu cầu ở rất nhiều bài quản lý.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 4 · Lesson 4.2</span>
<h2>Comparator — sort objects by any field</h2>
<p class="lead">"Display students sorted by GPA descending, then by name" — sorting a list of objects is everywhere. A Comparator says how to compare two objects; <span class="badge">Collections.sort</span> does the rest.</p>
<pre><span class="tok-comment">// Sort by GPA descending, then name ascending</span>
students.<span class="tok-function">sort</span>(
  Comparator.<span class="tok-function">comparingDouble</span>(<span class="tok-type">Student</span>::<span class="tok-function">getGpa</span>).<span class="tok-function">reversed</span>()
    .<span class="tok-function">thenComparing</span>(<span class="tok-type">Student</span>::<span class="tok-function">getName</span>));</pre>
<p>The classic form still worth knowing (works on JDK 8 everywhere):</p>
<pre>Collections.<span class="tok-function">sort</span>(students, <span class="tok-keyword">new</span> <span class="tok-type">Comparator</span>&lt;<span class="tok-type">Student</span>&gt;() {
    <span class="tok-keyword">public</span> <span class="tok-type">int</span> <span class="tok-function">compare</span>(<span class="tok-type">Student</span> a, <span class="tok-type">Student</span> b) {
        <span class="tok-keyword">return</span> a.<span class="tok-function">getName</span>().<span class="tok-function">compareTo</span>(b.<span class="tok-function">getName</span>());
    }
});</pre>
<div class="pitfall"><b>Trap:</b> to sort strings alphabetically use <span class="badge">compareTo</span>; do not compare with <span class="badge">&lt;</span> or <span class="badge">==</span>. For "natural order" on your entity, implement <span class="badge">Comparable</span> and its <span class="badge">compareTo</span>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Override hashCode whenever you override equals.</b> If your entity's equals() compares by code so contains() works, a HashSet or HashMap keyed on that entity still misbehaves unless hashCode() is consistent with it. The contract is: equal objects must return equal hash codes. <em>Why beyond the syllabus: the equals/hashCode pair is a Java contract the brief never restates.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0069-input-and-display-person-info?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">↕️</span>
  <span class="lc-body"><span class="lc-title">Practise: input, sort &amp; display students</span><span class="lc-sub">P0069/P0068 are pure Comparator drills.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 4 · Bài 4.2</span>
<h2>Comparator — sắp xếp đối tượng theo trường bất kỳ</h2>
<p class="lead">"Hiển thị sinh viên sắp theo GPA giảm dần, rồi theo tên" — sắp một danh sách đối tượng có mặt khắp nơi. Comparator nói cách so hai đối tượng; <span class="badge">Collections.sort</span> lo phần còn lại.</p>
<pre><span class="tok-comment">// Sắp theo GPA giảm dần, rồi tên tăng dần</span>
students.<span class="tok-function">sort</span>(
  Comparator.<span class="tok-function">comparingDouble</span>(<span class="tok-type">Student</span>::<span class="tok-function">getGpa</span>).<span class="tok-function">reversed</span>()
    .<span class="tok-function">thenComparing</span>(<span class="tok-type">Student</span>::<span class="tok-function">getName</span>));</pre>
<p>Dạng kinh điển vẫn nên biết (chạy trên JDK 8 mọi nơi):</p>
<pre>Collections.<span class="tok-function">sort</span>(students, <span class="tok-keyword">new</span> <span class="tok-type">Comparator</span>&lt;<span class="tok-type">Student</span>&gt;() {
    <span class="tok-keyword">public</span> <span class="tok-type">int</span> <span class="tok-function">compare</span>(<span class="tok-type">Student</span> a, <span class="tok-type">Student</span> b) {
        <span class="tok-keyword">return</span> a.<span class="tok-function">getName</span>().<span class="tok-function">compareTo</span>(b.<span class="tok-function">getName</span>());
    }
});</pre>
<div class="pitfall"><b>Bẫy:</b> để sắp chuỗi theo bảng chữ cái dùng <span class="badge">compareTo</span>; đừng so bằng <span class="badge">&lt;</span> hay <span class="badge">==</span>. Cho "thứ tự tự nhiên" trên entity, cài <span class="badge">Comparable</span> và <span class="badge">compareTo</span> của nó.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Override hashCode mỗi khi override equals.</b> Nếu equals() của entity so theo mã để contains() chạy, thì HashSet hay HashMap khóa theo entity đó vẫn hỏng trừ khi hashCode() nhất quán với nó. Hợp đồng là: hai đối tượng bằng nhau phải trả cùng mã băm. <em>Vì sao ngoài syllabus: cặp equals/hashCode là hợp đồng Java đề không bao giờ nhắc lại.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0069-input-and-display-person-info?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">↕️</span>
  <span class="lc-body"><span class="lc-title">Luyện: nhập, sắp &amp; hiển thị sinh viên</span><span class="lc-sub">P0069/P0068 là bài luyện Comparator thuần.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '4.3 — Full management programs|||4.3 — Chương trình quản lý hoàn chỉnh',
          slug: 'lab211-quan-ly-hoan-chinh',
          type: 'VIDEO',
          description: 'Ghép entity + bo + controller + Validator thành hệ quản lý nhiều thực thể — bác sĩ, công nhân, liên hệ, địa lý.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 4 · Lesson 4.3</span>
<h2>Full management programs — putting it together</h2>
<p class="lead">Now combine everything: an entity, a bo with rules, a controller, the Validator, and a menu. These medium briefs (63–73 LOC) are exactly the shape of a typical exam question. Do several until the structure is automatic.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>entity</b> — e.g. Doctor(code, name, specialty), Serializable, toString for the display row.</div>
  <div class="lz-layer"><b>bo</b> — <span class="badge">add</span> checks for duplicate code and throws; <span class="badge">find</span>, <span class="badge">sort</span>, <span class="badge">getAll</span>.</div>
  <div class="lz-layer"><b>controller</b> — reads via Validator, calls bo, prints outcome / list.</div>
  <div class="lz-layer"><b>Main</b> — the menu loop from 4.1.</div>
</div>
<div class="callout ok">Doctor, Worker, Contact and Geographic management are the same program with different fields. Once you have built one from scratch and matched its output, the rest are variations — this is where fluency compounds.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write one private findByCode and reuse it.</b> add, update and delete all need "does this code exist, and where"; a single private helper in the bo removes duplicated scan loops and the bugs that come from fixing one copy but not the others. Mentors reward this DRY refactor in the viva. <em>Why beyond the syllabus: the brief lists features, not the internal structure that keeps them consistent.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0054-develop-the-contact-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">📇</span>
  <span class="lc-body"><span class="lc-title">Practise the management cluster</span><span class="lc-sub">Contact (P0054), Doctor (P0055), Worker (P0056), Geographic (P0052).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 4 · Bài 4.3</span>
<h2>Chương trình quản lý hoàn chỉnh — ghép lại</h2>
<p class="lead">Giờ ghép tất cả: một entity, một bo có luật, một controller, Validator, và một menu. Các đề medium này (63–73 LOC) đúng là hình dạng câu hỏi thi điển hình. Làm vài bài tới khi cấu trúc thành tự động.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>entity</b> — vd Doctor(code, name, specialty), Serializable, toString cho dòng hiển thị.</div>
  <div class="lz-layer"><b>bo</b> — <span class="badge">add</span> kiểm mã trùng và ném; <span class="badge">find</span>, <span class="badge">sort</span>, <span class="badge">getAll</span>.</div>
  <div class="lz-layer"><b>controller</b> — đọc qua Validator, gọi bo, in kết quả / danh sách.</div>
  <div class="lz-layer"><b>Main</b> — vòng lặp menu từ bài 4.1.</div>
</div>
<div class="callout ok">Quản lý Bác sĩ, Công nhân, Liên hệ và Địa lý là cùng một chương trình với trường khác nhau. Khi đã dựng một cái từ đầu và khớp output của nó, phần còn lại chỉ là biến thể — đây là nơi phản xạ tích lũy.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết một findByCode private và dùng lại.</b> add, update và delete đều cần "mã này có tồn tại, và ở đâu"; một hàm phụ private duy nhất trong bo loại bỏ các vòng quét lặp lại và các bug đến từ việc sửa một bản mà quên bản kia. Mentor thưởng cho refactor DRY này khi vấn đáp. <em>Vì sao ngoài syllabus: đề liệt kê chức năng, không liệt kê cấu trúc bên trong giữ cho chúng nhất quán.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0054-develop-the-contact-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">📇</span>
  <span class="lc-body"><span class="lc-title">Luyện nhóm bài quản lý</span><span class="lc-sub">Contact (P0054), Doctor (P0055), Worker (P0056), Geographic (P0052).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 4 — CRUD & Collections|||Quiz 4 — CRUD & Collections',
          slug: 'lab211-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra khung CRUD, chọn collection và Comparator.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'For a key → value store that keeps insertion order, use…|||Cho kho khóa → giá trị giữ thứ tự chèn, dùng…', options: ['HashMap', 'LinkedHashMap', 'ArrayList', 'int[]'], correctIndex: 1, points: 1 },
              { question: 'To sort a list of Student objects by name you should…|||Để sắp danh sách Student theo tên bạn nên…', options: ['use < on the objects|||dùng < trên đối tượng', 'pass a Comparator that uses compareTo on the name|||truyền Comparator dùng compareTo trên tên', 'reverse the list|||đảo ngược danh sách', 'convert to String[]|||đổi sang String[]'], correctIndex: 1, points: 1 },
              { question: 'If a brief stores data in a file, you should save…|||Nếu đề lưu dữ liệu trong tệp, bạn nên lưu…', options: ['only at exit|||chỉ khi thoát', 'after every change|||sau mỗi thay đổi', 'never|||không bao giờ', 'once at start|||một lần lúc đầu'], correctIndex: 1, points: 1 },
              { question: 'Contact, Doctor and Worker management programs are…|||Chương trình quản lý Contact, Doctor, Worker là…', options: ['completely different designs|||thiết kế hoàn toàn khác', 'the same skeleton with different fields|||cùng khung với trường khác nhau', 'impossible without a database|||không thể nếu không có database', 'only for HARD level|||chỉ cho mức HARD'], correctIndex: 1, points: 1 },
              { question: 'The bo layer signals a duplicate code by…|||Tầng bo báo mã trùng bằng cách…', options: ['printing to the screen|||in ra màn hình', 'throwing an Exception with a message|||ném Exception kèm thông báo', 'returning null silently|||trả null âm thầm', 'exiting the program|||thoát chương trình'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ PHẦN 5 — OOP & TỆP (NHÓM HARD) ══════════════════ */
    {
      title: 'Part 5 — OOP entities & File I/O (HARD)|||Phần 5 — OOP trong entity & Tệp (nhóm HARD)',
      description: 'Nhóm khó: kế thừa/đa hình/abstract trong entity, đọc/ghi tệp (text/serialize/CSV/zip) và các bài lớn nhiều tầng.',
      lessons: [
        {
          title: '5.1 — OOP inside entities|||5.1 — OOP trong entity',
          slug: 'lab211-oop-trong-entity',
          type: 'VIDEO',
          description: 'Kế thừa, đa hình, abstract class/interface áp dụng vào entity — Shapes, Bees, Cards, Car showroom.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 5 · Lesson 5.1</span>
<h2>OOP inside entities — inheritance &amp; polymorphism at work</h2>
<p class="lead">The harder briefs finally use real OOP: a base class with subclasses that each behave differently. Shapes with a common <span class="badge">area()</span>, cards with an enum suit, bees with a shared life cycle. This is where PRO192 pays off.</p>
<pre><span class="tok-keyword">abstract class</span> <span class="tok-type">Shape</span> {
    <span class="tok-keyword">abstract</span> <span class="tok-type">double</span> <span class="tok-function">area</span>();          <span class="tok-comment">// each subclass decides</span>
}
<span class="tok-keyword">class</span> <span class="tok-type">Circle</span> <span class="tok-keyword">extends</span> <span class="tok-type">Shape</span> {
    <span class="tok-type">double</span> r;
    <span class="tok-type">double</span> <span class="tok-function">area</span>() { <span class="tok-keyword">return</span> Math.PI * r * r; }
}</pre>
<div class="out">A List&lt;Shape&gt; can hold circles, rectangles and triangles; calling <span class="badge">area()</span> runs the right one — that is polymorphism.</div>
<div class="pitfall"><b>Card/enum trap:</b> when a brief fixes a 52-line deck, compare line by line against the expected screen; when it shuffles, test the <em>relationship</em> (the sorted lines equal the unsorted set) since exact output is random.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write @Override on every overriding method.</b> It costs nothing and turns a silent mistake — a wrong parameter list that creates a new method instead of overriding — into a compile error you catch instantly. This matters most for toString() and Comparator's compare(). <em>Why beyond the syllabus: @Override is optional to the compiler, so the brief never asks for it, yet it prevents a whole class of invisible bugs.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0080-shapes?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🔶</span>
  <span class="lc-body"><span class="lc-title">Practise OOP: Shapes, Cards, Bees</span><span class="lc-sub">P0080 (shapes), P0082 (cards), P0081 (bees) — inheritance &amp; enums.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 5 · Bài 5.1</span>
<h2>OOP trong entity — kế thừa &amp; đa hình vào việc</h2>
<p class="lead">Các đề khó hơn cuối cùng dùng OOP thật: một lớp cha với các lớp con mỗi cái hành xử khác nhau. Hình với <span class="badge">area()</span> chung, lá bài với enum chất, ong với vòng đời chung. Đây là chỗ PRO192 sinh lời.</p>
<pre><span class="tok-keyword">abstract class</span> <span class="tok-type">Shape</span> {
    <span class="tok-keyword">abstract</span> <span class="tok-type">double</span> <span class="tok-function">area</span>();          <span class="tok-comment">// mỗi lớp con tự quyết</span>
}
<span class="tok-keyword">class</span> <span class="tok-type">Circle</span> <span class="tok-keyword">extends</span> <span class="tok-type">Shape</span> {
    <span class="tok-type">double</span> r;
    <span class="tok-type">double</span> <span class="tok-function">area</span>() { <span class="tok-keyword">return</span> Math.PI * r * r; }
}</pre>
<div class="out">Một List&lt;Shape&gt; có thể chứa tròn, chữ nhật, tam giác; gọi <span class="badge">area()</span> chạy đúng cái tương ứng — đó là đa hình.</div>
<div class="pitfall"><b>Bẫy Card/enum:</b> khi đề cố định bộ 52 dòng, so từng dòng với màn hình mẫu; khi nó xáo bài, kiểm <em>quan hệ</em> (các dòng đã sắp bằng tập chưa sắp) vì output chính xác là ngẫu nhiên.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết @Override trên mọi hàm ghi đè.</b> Nó không tốn gì và biến một lỗi âm thầm — sai danh sách tham số tạo ra hàm mới thay vì ghi đè — thành lỗi biên dịch bạn bắt ngay. Điều này quan trọng nhất với toString() và compare() của Comparator. <em>Vì sao ngoài syllabus: @Override là tùy chọn với trình biên dịch nên đề không đòi, nhưng nó chặn cả một lớp bug vô hình.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0080-shapes?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🔶</span>
  <span class="lc-body"><span class="lc-title">Luyện OOP: Shapes, Cards, Bees</span><span class="lc-sub">P0080 (hình), P0082 (bài), P0081 (ong) — kế thừa &amp; enum.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '5.2 — File I/O: text, serialize, CSV, zip|||5.2 — Tệp: text, serialize, CSV, zip',
          slug: 'lab211-doc-ghi-tep',
          type: 'VIDEO',
          description: 'Đọc/ghi text, serialize đối tượng, CSV, copy & zip — và bẫy byte-vs-char làm hỏng file nhị phân.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 5 · Lesson 5.2</span>
<h2>File I/O — where silent data corruption hides</h2>
<p class="lead">The CBDT-project briefs (P0075–P0079) handle files: read, write, copy, zip. Files are where "it looks fine" bugs live — several were only caught by running the program and checking the bytes.</p>
<pre><span class="tok-comment">// Read all lines (text)</span>
<span class="tok-type">List</span>&lt;<span class="tok-type">String</span>&gt; lines = Files.<span class="tok-function">readAllLines</span>(Paths.<span class="tok-function">get</span>(<span class="tok-string">"data.txt"</span>));
<span class="tok-comment">// Write text</span>
<span class="tok-keyword">try</span> (<span class="tok-type">PrintWriter</span> pw = <span class="tok-keyword">new</span> <span class="tok-function">PrintWriter</span>(<span class="tok-string">"out.txt"</span>)) {
    <span class="tok-keyword">for</span> (<span class="tok-type">String</span> l : lines) pw.<span class="tok-function">println</span>(l);
}</pre>
<div class="pitfall"><b>Traps proven by running the code:</b><br>
• <b>Never copy a binary file through Reader/Writer.</b> 256 bytes in became 512 out; every byte ≥ 0x80 turned into U+FFFD. Use byte streams (<span class="badge">InputStream/OutputStream</span>) for binary.<br>
• <b>Object serialization append breaks reading.</b> Appending with a second <span class="badge">ObjectOutputStream</span> writes a second header that <span class="badge">ObjectInputStream</span> chokes on — prefer a text file, or rewrite the whole object list.<br>
• A zip is corrupted by <em>not</em> calling <span class="badge">close()</span> on the ZipOutputStream — not by a missing <span class="badge">closeEntry()</span>.<br>
• <span class="badge">Properties.load()</span> swallows backslashes: <span class="badge">D:\\Data</span> becomes <span class="badge">D:Data</span>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Name the charset when text holds Vietnamese.</b> Files.readAllLines and new FileReader use the platform default encoding, so a file saved as UTF-8 can read back as garbled accents on a machine defaulting to Windows-1252. Pass StandardCharsets.UTF_8 explicitly on both read and write. <em>Why beyond the syllabus: encoding is invisible until the grader's machine default differs from yours.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0078-create-a-program-to-copy-file?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">📁</span>
  <span class="lc-body"><span class="lc-title">Practise files: copy, zip, CSV</span><span class="lc-sub">P0078 (copy), P0079 (zip), P0076 (CSV), P0059 (handle files).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 5 · Bài 5.2</span>
<h2>Đọc/ghi tệp — nơi dữ liệu hỏng âm thầm</h2>
<p class="lead">Nhóm đề dự án CBDT (P0075–P0079) xử lý tệp: đọc, ghi, copy, zip. Tệp là nơi bug "trông ổn mà" ẩn náu — vài lỗi chỉ bị bắt khi chạy chương trình và kiểm từng byte.</p>
<pre><span class="tok-comment">// Đọc toàn bộ dòng (text)</span>
<span class="tok-type">List</span>&lt;<span class="tok-type">String</span>&gt; lines = Files.<span class="tok-function">readAllLines</span>(Paths.<span class="tok-function">get</span>(<span class="tok-string">"data.txt"</span>));
<span class="tok-comment">// Ghi text</span>
<span class="tok-keyword">try</span> (<span class="tok-type">PrintWriter</span> pw = <span class="tok-keyword">new</span> <span class="tok-function">PrintWriter</span>(<span class="tok-string">"out.txt"</span>)) {
    <span class="tok-keyword">for</span> (<span class="tok-type">String</span> l : lines) pw.<span class="tok-function">println</span>(l);
}</pre>
<div class="pitfall"><b>Bẫy chứng minh bằng chạy code:</b><br>
• <b>Không bao giờ copy file nhị phân qua Reader/Writer.</b> 256 byte vào thành 512 byte ra; mọi byte ≥ 0x80 thành U+FFFD. Dùng luồng byte (<span class="badge">InputStream/OutputStream</span>) cho nhị phân.<br>
• <b>Serialize kiểu nối làm hỏng việc đọc.</b> Nối bằng <span class="badge">ObjectOutputStream</span> thứ hai ghi header thứ hai mà <span class="badge">ObjectInputStream</span> nghẹn — nên dùng tệp text, hoặc ghi lại toàn bộ danh sách.<br>
• Zip hỏng vì <em>không</em> gọi <span class="badge">close()</span> trên ZipOutputStream — không phải vì thiếu <span class="badge">closeEntry()</span>.<br>
• <span class="badge">Properties.load()</span> nuốt dấu gạch chéo ngược: <span class="badge">D:\\Data</span> thành <span class="badge">D:Data</span>.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nêu rõ charset khi văn bản có tiếng Việt.</b> Files.readAllLines và new FileReader dùng encoding mặc định của nền tảng, nên một tệp lưu UTF-8 có thể đọc lại thành dấu tiếng Việt lỗi loạn trên máy mặc định Windows-1252. Truyền StandardCharsets.UTF_8 tường minh cả khi đọc và ghi. <em>Vì sao ngoài syllabus: encoding vô hình cho tới khi mặc định của máy người chấm khác của bạn.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0078-create-a-program-to-copy-file?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">📁</span>
  <span class="lc-body"><span class="lc-title">Luyện tệp: copy, zip, CSV</span><span class="lc-sub">P0078 (copy), P0079 (zip), P0076 (CSV), P0059 (xử lý tệp).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '5.3 — Big multi-layer programs|||5.3 — Bài lớn nhiều tầng',
          slug: 'lab211-bai-lon-nhieu-tang',
          type: 'VIDEO',
          description: 'Hệ quản lý lớn 150–500 LOC — nhân viên, ngân hàng, phương tiện, cửa hàng — cùng khung, nhiều thực thể & tệp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 5 · Lesson 5.3</span>
<h2>Big multi-layer programs — the finals</h2>
<p class="lead">The largest briefs (150–500 LOC) are complete applications: an employee system, a bank login, vehicle and asset management, a fruit shop. They are not harder ideas — just <em>more</em> of the same skeleton, with several entities and files. Fluency, not cleverness, wins here.</p>
<div class="lz-flow">
  <div class="lz-step">Map each entity → its own class</div>
  <div class="lz-step">One bo per entity (or one manager with lists)</div>
  <div class="lz-step">One controller wiring menu → bo</div>
  <div class="lz-step">Load files at start · save after each change</div>
</div>
<div class="callout ok">If you have done Parts 1–4 honestly, a 350-LOC brief is just four medium briefs stacked. Budget your time by feature and compile after each — do not write 350 lines then hit Run.</div>
<div class="pitfall"><b>MD5/login trap:</b> <span class="badge">new String(md5Digest)</span> turns 16 bytes into a 13-char string; its <span class="badge">getBytes()</span> gives 26 bytes and no longer matches. Store the hex hash, not a raw-byte String.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Load every data file once in an initData() at startup.</b> Reading a file lazily the first time a menu option is used means a missing or malformed file crashes you mid-exam instead of at launch; load and validate all files up front so problems surface while you still have time. <em>Why beyond the syllabus: the brief says "read from file", not when — timing the read defensively is an engineering habit it never teaches.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0085-employee-management-system?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🏢</span>
  <span class="lc-body"><span class="lc-title">Practise the finals</span><span class="lc-sub">Employee (P0085), Bank login (P0070), Vehicle (L.P0013), Fruit shop (L.P0023), Students (L.P0021), Normalize text (L.P0025).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 5 · Bài 5.3</span>
<h2>Bài lớn nhiều tầng — các đề cuối</h2>
<p class="lead">Các đề lớn nhất (150–500 LOC) là ứng dụng hoàn chỉnh: hệ nhân viên, đăng nhập ngân hàng, quản lý phương tiện và tài sản, cửa hàng trái cây. Chúng không phải ý tưởng khó hơn — chỉ là <em>nhiều hơn</em> cùng một khung, với vài entity và tệp. Phản xạ, không phải mưu mẹo, thắng ở đây.</p>
<div class="lz-flow">
  <div class="lz-step">Ánh xạ mỗi entity → một lớp riêng</div>
  <div class="lz-step">Một bo cho mỗi entity (hoặc một manager với các list)</div>
  <div class="lz-step">Một controller nối menu → bo</div>
  <div class="lz-step">Nạp tệp lúc đầu · lưu sau mỗi thay đổi</div>
</div>
<div class="callout ok">Nếu bạn đã làm Phần 1–4 nghiêm túc, đề 350 LOC chỉ là bốn đề medium xếp chồng. Chia thời gian theo chức năng và biên dịch sau mỗi cái — đừng viết 350 dòng rồi mới bấm Run.</div>
<div class="pitfall"><b>Bẫy MD5/login:</b> <span class="badge">new String(md5Digest)</span> biến 16 byte thành chuỗi 13 ký tự; <span class="badge">getBytes()</span> của nó ra 26 byte và không còn khớp. Lưu chuỗi hex, đừng lưu String từ byte thô.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nạp mọi tệp dữ liệu một lần trong initData() lúc khởi động.</b> Đọc tệp kiểu lười ở lần đầu dùng một lựa chọn menu nghĩa là một tệp thiếu hoặc hỏng sẽ làm sập bạn giữa giờ thi thay vì lúc chạy; hãy nạp và kiểm mọi tệp ngay từ đầu để lỗi lộ ra khi bạn còn thời gian. <em>Vì sao ngoài syllabus: đề nói "đọc từ tệp", không nói khi nào — đọc phòng thủ là thói quen kỹ thuật đề không dạy.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0085-employee-management-system?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🏢</span>
  <span class="lc-body"><span class="lc-title">Luyện các đề cuối</span><span class="lc-sub">Employee (P0085), Bank login (P0070), Vehicle (L.P0013), Fruit shop (L.P0023), Students (L.P0021), Normalize text (L.P0025).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 5 — OOP & Files|||Quiz 5 — OOP & Tệp',
          slug: 'lab211-quiz-5',
          type: 'QUIZ',
          description: 'Kiểm tra OOP trong entity và các bẫy đọc/ghi tệp.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Calling area() on a List<Shape> of mixed subclasses runs the right method — this is…|||Gọi area() trên List<Shape> gồm nhiều lớp con chạy đúng phương thức — đây là…', options: ['encapsulation|||đóng gói', 'polymorphism|||đa hình', 'recursion|||đệ quy', 'serialization|||tuần tự hóa'], correctIndex: 1, points: 1 },
              { question: 'Copying a binary file through Reader/Writer is wrong because…|||Copy file nhị phân qua Reader/Writer sai vì…', options: ['it is too slow|||quá chậm', 'bytes ≥ 0x80 get corrupted to U+FFFD|||byte ≥ 0x80 bị hỏng thành U+FFFD', 'Reader does not exist|||Reader không tồn tại', 'it needs admin rights|||cần quyền admin'], correctIndex: 1, points: 1 },
              { question: 'A ZipOutputStream produces a corrupt zip when you forget to…|||ZipOutputStream tạo zip hỏng khi bạn quên…', options: ['call closeEntry()|||gọi closeEntry()', 'call close() on the stream|||gọi close() trên luồng', 'import java.util|||import java.util', 'flush the Scanner|||flush Scanner'], correctIndex: 1, points: 1 },
              { question: 'A 350-LOC management brief is best seen as…|||Đề quản lý 350 LOC nên được xem là…', options: ['a brand-new challenge|||một thử thách hoàn toàn mới', 'several medium briefs stacked on one skeleton|||vài đề medium xếp chồng trên một khung', 'impossible in the time|||bất khả thi trong thời gian', 'needing a database|||cần database'], correctIndex: 1, points: 1 },
              { question: 'For an MD5 password you should store…|||Cho mật khẩu MD5 bạn nên lưu…', options: ['new String(digest) of raw bytes|||new String(digest) từ byte thô', 'the hex representation of the hash|||biểu diễn hex của hash', 'the plain password|||mật khẩu thô', 'the byte count|||số byte'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PHẦN 6 — LUYỆN THI THỰC HÀNH (CHỐNG TRƯỢT) ══════════════════ */
    {
      title: 'Part 6 — Practical Exam survival|||Phần 6 — Sống sót kỳ thi thực hành',
      description: 'Cốt lõi chống trượt: kịch bản thi + quản lý thời gian, sổ tay lỗi 60 giây, các bẫy người chấm, và vấn đáp "đổi yêu cầu".',
      lessons: [
        {
          title: '6.1 — Exam plan & time management|||6.1 — Kịch bản thi & quản lý thời gian',
          slug: 'lab211-ke-hoach-thi',
          type: 'VIDEO',
          description: 'Thứ tự tấn công cố định và cách chia thời gian để không cháy giờ ở chức năng đầu tiên.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 6 · Lesson 6.1</span>
<h2>The exam plan — a fixed order of attack</h2>
<p class="lead">In the Practical Exam you get a brief and a time limit, alone. The students who pass do not write faster — they follow a rehearsed order so no minute is wasted deciding what to do.</p>
<div class="lz-flow">
  <div class="lz-step">0–5 min · read the brief twice, underline every message &amp; format</div>
  <div class="lz-step">5–10 min · create the project, entity + Validator (from memory)</div>
  <div class="lz-step">10–? min · one feature at a time; compile &amp; run after each</div>
  <div class="lz-step">last 10 min · re-run every menu option against the expected screen</div>
</div>
<h3>Rules that save the grade</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Compile early, compile often.</b> A program that runs and does 3 of 5 features scores far more than a "complete" one that will not compile.</div>
  <div class="lz-layer"><b>Do the easy, high-mark features first.</b> Add + Display before a tricky sort. Bank partial credit before you gamble time.</div>
  <div class="lz-layer"><b>Copy labels exactly, validate every input.</b> These are free marks you already know how to get.</div>
  <div class="lz-layer"><b>If stuck, move on.</b> A working 80% beats a broken 100% that will not run.</div>
</div>
<div class="callout danger">The number one time-sink is one feature you cannot get perfect. Set a personal timer; when it rings, leave it working-but-imperfect and secure the rest. You are graded on total working output, not heroics.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Comment out a broken feature to save the build.</b> If one method refuses to compile with minutes left, wrap it in a block comment and its menu case too; the other four features then still compile, run and score. A submission that does not compile at all scores nothing. <em>Why beyond the syllabus: triage-by-commenting is an exam survival tactic, not a programming topic the syllabus lists.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 6 · Bài 6.1</span>
<h2>Kịch bản thi — thứ tự tấn công cố định</h2>
<p class="lead">Trong kỳ thi thực hành bạn nhận một đề và một mốc thời gian, tự làm. Sinh viên qua môn không viết nhanh hơn — họ theo một thứ tự đã diễn tập nên không phí phút nào để quyết làm gì.</p>
<div class="lz-flow">
  <div class="lz-step">0–5 phút · đọc đề hai lần, gạch chân mọi thông báo &amp; định dạng</div>
  <div class="lz-step">5–10 phút · tạo project, entity + Validator (từ trí nhớ)</div>
  <div class="lz-step">10–? phút · mỗi lần một chức năng; biên dịch &amp; chạy sau mỗi cái</div>
  <div class="lz-step">10 phút cuối · chạy lại mọi lựa chọn menu đối chiếu màn hình mẫu</div>
</div>
<h3>Những luật cứu điểm</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Biên dịch sớm, biên dịch thường xuyên.</b> Chương trình chạy được và làm 3/5 chức năng ăn điểm hơn nhiều so với bản "hoàn chỉnh" mà không biên dịch được.</div>
  <div class="lz-layer"><b>Làm chức năng dễ, điểm cao trước.</b> Add + Display trước một hàm sort hóc búa. Gom điểm phần trước khi đánh cược thời gian.</div>
  <div class="lz-layer"><b>Chép nhãn y nguyên, validate mọi input.</b> Đây là điểm miễn phí bạn đã biết cách lấy.</div>
  <div class="lz-layer"><b>Bí thì bỏ qua.</b> Một 80% chạy được hơn một 100% hỏng không chạy.</div>
</div>
<div class="callout danger">Kẻ ngốn thời gian số một là một chức năng bạn không thể làm hoàn hảo. Đặt hẹn giờ riêng; khi nó reo, để nó chạy-được-nhưng-chưa-hoàn-hảo và giữ chắc phần còn lại. Bạn được chấm trên tổng output chạy được, không phải sự anh hùng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Comment tắt một chức năng hỏng để cứu bản build.</b> Nếu một hàm không chịu biên dịch khi còn vài phút, bọc nó trong một khối comment và cả case menu của nó; bốn chức năng còn lại khi đó vẫn biên dịch, chạy và ăn điểm. Bài nộp hoàn toàn không biên dịch được thì 0 điểm. <em>Vì sao ngoài syllabus: phân loại-bằng-comment là chiến thuật sống sót thi, không phải chủ đề lập trình syllabus liệt kê.</em></div>
</div>
`,
        },
        {
          title: '6.2 — The 60-second error handbook|||6.2 — Sổ tay lỗi 60 giây',
          slug: 'lab211-so-tay-loi',
          type: 'VIDEO',
          description: 'Đọc thông báo javac/java → xác định nguyên nhân → sửa nhanh; quy trình 6 bước debug 60 giây đầu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 6 · Lesson 6.2</span>
<h2>The 60-second error handbook</h2>
<p class="lead">CLO3 is "debug with common tools". In the exam, a red error is not a disaster — it is a message that tells you exactly what to fix, <em>if</em> you can read it fast. Here are the ones you will actually meet.</p>
<table>
  <thead><tr><th>Message</th><th>Real cause</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">cannot find symbol</span></td><td>typo, or missing import/variable</td><td>check spelling; add the import</td></tr>
    <tr><td><span class="badge">';' expected</span></td><td>missing semicolon/brace above</td><td>look at the line <em>before</em> the caret</td></tr>
    <tr><td><span class="badge">incompatible types</span></td><td>assigning wrong type</td><td>parse/cast, or fix the declaration</td></tr>
    <tr><td><span class="badge">NullPointerException</span></td><td>used an object that was never created</td><td>initialise it before use</td></tr>
    <tr><td><span class="badge">InputMismatchException</span></td><td>Scanner got text where a number was expected</td><td>use the Validator (Lesson 1.2)</td></tr>
    <tr><td><span class="badge">ArrayIndexOutOfBounds</span></td><td>index past the end</td><td>check loop bound / off-by-one</td></tr>
  </tbody>
</table>
<h3>The 60-second routine</h3>
<div class="lz-flow">
  <div class="lz-step">Read the FIRST error only (the rest cascade)</div>
  <div class="lz-step">Jump to its file:line</div>
  <div class="lz-step">Look at that line AND the one above</div>
  <div class="lz-step">Fix, recompile, repeat</div>
</div>
<div class="pitfall"><b>Measured surprise:</b> <span class="badge">ConcurrentModificationException</span> does NOT throw when a list has only 2 elements and you remove the second-to-last (the iterator's <span class="badge">hasNext()</span> returns false early). It appears at n=3,4 — which is why this bug survives small student tests. Remove via an <span class="badge">Iterator</span> or a reverse index loop.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Read the stack trace bottom-up to your own class.</b> A runtime exception dumps many library frames; scan up from the bottom to the first line naming your class and file — that is where your bug is, not the JDK frame at the top. In NetBeans those trace lines are clickable straight to the spot. <em>Why beyond the syllabus: reading a stack trace is assumed, never taught, yet it is the fastest debug skill in the exam.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-857" target="_blank" rel="noopener">
  <span class="lc-ico">🚑</span>
  <span class="lc-body"><span class="lc-title">Error Handbook — every message &amp; its fix</span><span class="lc-sub">Real javac/java output, cause and cure, with the 60-second routine.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 6 · Bài 6.2</span>
<h2>Sổ tay lỗi 60 giây</h2>
<p class="lead">CLO3 là "debug bằng công cụ phổ biến". Trong phòng thi, một dòng lỗi đỏ không phải thảm họa — nó là thông báo nói chính xác cần sửa gì, <em>nếu</em> bạn đọc được nhanh. Đây là những lỗi bạn thật sự gặp.</p>
<table>
  <thead><tr><th>Thông báo</th><th>Nguyên nhân thật</th><th>Cách sửa</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">cannot find symbol</span></td><td>gõ sai, hoặc thiếu import/biến</td><td>kiểm chính tả; thêm import</td></tr>
    <tr><td><span class="badge">';' expected</span></td><td>thiếu dấu ; hoặc ngoặc ở trên</td><td>nhìn dòng <em>ngay trước</em> con trỏ lỗi</td></tr>
    <tr><td><span class="badge">incompatible types</span></td><td>gán sai kiểu</td><td>parse/ép kiểu, hoặc sửa khai báo</td></tr>
    <tr><td><span class="badge">NullPointerException</span></td><td>dùng đối tượng chưa được tạo</td><td>khởi tạo trước khi dùng</td></tr>
    <tr><td><span class="badge">InputMismatchException</span></td><td>Scanner nhận chữ chỗ cần số</td><td>dùng Validator (Bài 1.2)</td></tr>
    <tr><td><span class="badge">ArrayIndexOutOfBounds</span></td><td>chỉ số vượt cuối mảng</td><td>kiểm cận vòng lặp / lệch một đơn vị</td></tr>
  </tbody>
</table>
<h3>Quy trình 60 giây</h3>
<div class="lz-flow">
  <div class="lz-step">Chỉ đọc lỗi ĐẦU TIÊN (số còn lại kéo theo)</div>
  <div class="lz-step">Nhảy tới file:dòng của nó</div>
  <div class="lz-step">Nhìn dòng đó VÀ dòng ngay trên</div>
  <div class="lz-step">Sửa, biên dịch lại, lặp</div>
</div>
<div class="pitfall"><b>Bất ngờ đo được:</b> <span class="badge">ConcurrentModificationException</span> KHÔNG ném khi list chỉ 2 phần tử và bạn xóa phần tử áp chót (iterator <span class="badge">hasNext()</span> trả false sớm). Nó xuất hiện ở n=3,4 — đó là lý do bug này sống sót qua test nhỏ của sinh viên. Xóa qua <span class="badge">Iterator</span> hoặc vòng lặp chỉ số ngược.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đọc stack trace từ dưới lên tới lớp của bạn.</b> Một ngoại lệ runtime đổ ra nhiều khung thư viện; quét từ dưới lên tới dòng đầu tiên nêu tên lớp và tệp của bạn — đó là chỗ có bug, không phải khung JDK ở trên cùng. Trong NetBeans các dòng trace đó bấm được thẳng tới nơi. <em>Vì sao ngoài syllabus: đọc stack trace bị mặc định là biết, không được dạy, nhưng là kỹ năng debug nhanh nhất trong thi.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-857" target="_blank" rel="noopener">
  <span class="lc-ico">🚑</span>
  <span class="lc-body"><span class="lc-title">Error Handbook — mọi thông báo &amp; cách sửa</span><span class="lc-sub">Output javac/java thật, nguyên nhân và cách chữa, kèm quy trình 60 giây.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '6.3 — Grader traps checklist|||6.3 — Danh sách bẫy người chấm',
          slug: 'lab211-bay-nguoi-cham',
          type: 'VIDEO',
          description: 'Bộ sưu tập các bẫy tinh vi làm mất điểm dù logic đúng — dùng như checklist trước khi nộp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 6 · Lesson 6.3</span>
<h2>Grader traps — the pre-submit checklist</h2>
<p class="lead">These are the subtle things that turn "logically correct" into "marked wrong". Run this checklist on every program before you consider it done.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>☐ Labels &amp; spacing exact.</b> "Area: " vs "Area:", column widths in <span class="badge">%-15s</span>. Compare with the expected screen character by character.</div>
  <div class="lz-layer"><b>☐ Follow Guidelines over screenshots</b> when they disagree — the wording, the definition (e.g. perfect square), the error text.</div>
  <div class="lz-layer"><b>☐ Floating point.</b> Rearrange to avoid 19.9999… printing "20.00" but comparing &lt; 20.</div>
  <div class="lz-layer"><b>☐ Dates strict.</b> <span class="badge">setLenient(false)</span> / STRICT + <span class="badge">uuuu</span>; re-format &amp; compare to reject trailing junk.</div>
  <div class="lz-layer"><b>☐ Off-by-one.</b> Loop bounds, array sizes; the classic bug that survives easy data.</div>
  <div class="lz-layer"><b>☐ Input never crashes.</b> Every read goes through the Validator.</div>
  <div class="lz-layer"><b>☐ CheckStyle clean.</b> Naming, indentation, no auto-generated header comment.</div>
  <div class="lz-layer"><b>☐ It compiles &amp; every menu option runs.</b> The final, non-negotiable gate.</div>
</div>
<div class="note-ct">Six review points markers love to probe are collected in the Algorithm Reference, including proof that an off-by-one bug survives on easy inputs — the exact reason it slips into an exam submission.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Test the empty and single-element cases before you submit.</b> Markers love hidden inputs: display when the list is empty (it should print a "no data" line, not crash), search for something absent, sort a one-item list. These edge runs catch the bugs your happy-path testing never will. <em>Why beyond the syllabus: the visible screen shows a populated list; the empty and singleton cases are the grader's hidden probes.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-856" target="_blank" rel="noopener">
  <span class="lc-ico">🕵️</span>
  <span class="lc-body"><span class="lc-title">Algorithm Reference — what markers probe</span><span class="lc-sub">The 6 review points + a proof that off-by-one hides on easy data.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 6 · Bài 6.3</span>
<h2>Bẫy người chấm — checklist trước khi nộp</h2>
<p class="lead">Đây là những thứ tinh vi biến "logic đúng" thành "bị tính sai". Chạy checklist này trên mọi chương trình trước khi coi là xong.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>☐ Nhãn &amp; khoảng cách chính xác.</b> "Area: " vs "Area:", bề rộng cột trong <span class="badge">%-15s</span>. So với màn hình mẫu từng ký tự.</div>
  <div class="lz-layer"><b>☐ Theo Guidelines hơn ảnh</b> khi vênh nhau — câu chữ, định nghĩa (vd số chính phương), text lỗi.</div>
  <div class="lz-layer"><b>☐ Số thực.</b> Sắp lại để tránh 19.9999… in "20.00" nhưng so sánh &lt; 20.</div>
  <div class="lz-layer"><b>☐ Ngày nghiêm ngặt.</b> <span class="badge">setLenient(false)</span> / STRICT + <span class="badge">uuuu</span>; format lại &amp; so để từ chối rác đuôi.</div>
  <div class="lz-layer"><b>☐ Lệch một đơn vị.</b> Cận vòng lặp, kích thước mảng; bug kinh điển sống sót trên dữ liệu dễ.</div>
  <div class="lz-layer"><b>☐ Input không bao giờ sập.</b> Mọi lần đọc đi qua Validator.</div>
  <div class="lz-layer"><b>☐ CheckStyle sạch.</b> Đặt tên, thụt lề, không có comment header sinh sẵn.</div>
  <div class="lz-layer"><b>☐ Biên dịch được &amp; mọi lựa chọn menu chạy.</b> Cửa ải cuối, không thương lượng.</div>
</div>
<div class="note-ct">Sáu điểm review mà người chấm thích soi được gom trong Algorithm Reference, kèm chứng minh rằng bug lệch-một-đơn-vị sống sót trên input dễ — đúng lý do nó lọt vào bài nộp thi.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kiểm ca rỗng và một-phần-tử trước khi nộp.</b> Người chấm khoái input ẩn: hiển thị khi danh sách rỗng (phải in dòng "không có dữ liệu", không được sập), tìm thứ không tồn tại, sắp danh sách một phần tử. Các lần chạy biên này bắt được bug mà test đường-đẹp của bạn không bao giờ bắt. <em>Vì sao ngoài syllabus: màn hình thấy được cho danh sách đầy đủ; ca rỗng và một-phần-tử là các phép dò ẩn của người chấm.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-856" target="_blank" rel="noopener">
  <span class="lc-ico">🕵️</span>
  <span class="lc-body"><span class="lc-title">Algorithm Reference — người chấm soi gì</span><span class="lc-sub">6 điểm review + chứng minh lệch-một-đơn-vị ẩn trên dữ liệu dễ.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '6.4 — The "change a requirement" viva|||6.4 — Vấn đáp "đổi yêu cầu"',
          slug: 'lab211-van-dap-doi-yeu-cau',
          type: 'VIDEO',
          description: 'Mentor review kiểm bạn có THẬT hiểu code không: đổi yêu cầu, hỏi bạn sửa ở đâu — cách chuẩn bị.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 6 · Lesson 6.4</span>
<h2>The "change a requirement" viva</h2>
<p class="lead">Half of LAB211's sessions are Mentor review. The mentor is checking one thing: did you understand your own code, or copy it? Their weapon is a small change — "now sort by date descending", "add a delete-by-name feature", "why is there no controller?" — and the question "where would you change your code?"</p>
<h3>How to be ready</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Know your layers.</b> If asked to change sorting, you point to the Comparator; to add a feature, a new bo method + a menu case + a controller method. The layered design makes every answer obvious.</div>
  <div class="lz-layer"><b>Explain the "why no controller" rule</b> (Lesson 1.1) confidently: layers are added by size, and here is the file count.</div>
  <div class="lz-layer"><b>Name the traps you handled.</b> "I used setLenient(false) because dates are lenient by default" earns trust and bonus.</div>
  <div class="lz-layer"><b>Practise out loud.</b> The AI coach on the track has a "change a requirement" mode that behaves exactly like this — rehearse until the answers are reflex.</div>
</div>
<div class="callout ok">If you built every program yourself using this course's loop, the viva is easy — you already know where everything lives. If you copied solutions, the viva is where that shows. This is by design.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Prepare the encapsulation answer.</b> "Why are your fields private?" is a stock viva question — answer that private fields plus getters/setters let the class validate and change its internals without breaking callers. Give a concrete example: a setter that rejects a negative price. <em>Why beyond the syllabus: the syllabus assumes encapsulation; the viva asks you to defend it in words, which is a separate skill.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-847" target="_blank" rel="noopener">
  <span class="lc-ico">🎤</span>
  <span class="lc-body"><span class="lc-title">Rehearse with the AI coach (Pro)</span><span class="lc-sub">"Change a requirement" + graded viva on any brief you solved.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 6 · Bài 6.4</span>
<h2>Vấn đáp "đổi yêu cầu"</h2>
<p class="lead">Một nửa số session LAB211 là Mentor review. Mentor kiểm đúng một điều: bạn có hiểu code của chính mình, hay chép nó? Vũ khí của họ là một thay đổi nhỏ — "giờ sắp theo ngày giảm dần", "thêm chức năng xóa theo tên", "sao không có controller?" — và câu hỏi "bạn sẽ sửa ở đâu?"</p>
<h3>Cách sẵn sàng</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Thuộc các tầng của mình.</b> Nếu được yêu cầu đổi cách sắp, bạn chỉ vào Comparator; thêm chức năng thì thêm một hàm bo + một case menu + một hàm controller. Thiết kế phân tầng làm mọi câu trả lời hiển nhiên.</div>
  <div class="lz-layer"><b>Giải thích quy tắc "sao không có controller"</b> (Bài 1.1) tự tin: tầng được thêm theo kích thước, và đây là số file.</div>
  <div class="lz-layer"><b>Nêu tên các bẫy bạn đã xử lý.</b> "Em dùng setLenient(false) vì ngày lenient mặc định" tạo niềm tin và điểm cộng.</div>
  <div class="lz-layer"><b>Luyện nói thành tiếng.</b> AI coach trên track có chế độ "đổi yêu cầu" hành xử đúng như vậy — diễn tập tới khi câu trả lời thành phản xạ.</div>
</div>
<div class="callout ok">Nếu bạn đã tự dựng mọi chương trình bằng vòng lặp của khóa này, vấn đáp rất dễ — bạn đã biết mọi thứ nằm đâu. Nếu bạn chép lời giải, vấn đáp là nơi lộ ra. Điều này là có chủ đích.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chuẩn bị câu trả lời về đóng gói.</b> "Sao các trường của em để private?" là câu vấn đáp kinh điển — trả lời rằng trường private cùng getter/setter cho phép lớp validate và đổi ruột bên trong mà không làm hỏng nơi gọi. Cho ví dụ cụ thể: một setter từ chối giá âm. <em>Vì sao ngoài syllabus: syllabus mặc định có đóng gói; vấn đáp bắt bạn bảo vệ nó bằng lời, là một kỹ năng riêng.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-847" target="_blank" rel="noopener">
  <span class="lc-ico">🎤</span>
  <span class="lc-body"><span class="lc-title">Diễn tập với AI coach (Pro)</span><span class="lc-sub">"Đổi yêu cầu" + chấm vấn đáp trên đề bất kỳ bạn đã giải.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 6 — Exam readiness|||Quiz 6 — Sẵn sàng thi',
          slug: 'lab211-quiz-6',
          type: 'QUIZ',
          description: 'Kiểm tra kế hoạch thi, debug, bẫy chấm và vấn đáp.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'In the practical exam, the best strategy is to…|||Trong thi thực hành, chiến lược tốt nhất là…', options: ['write the whole program then compile once|||viết cả chương trình rồi biên dịch một lần', 'build one feature at a time and compile after each|||dựng mỗi lần một chức năng và biên dịch sau mỗi cái', 'do the hardest feature first|||làm chức năng khó nhất trước', 'skip validation to save time|||bỏ validate để tiết kiệm giờ'], correctIndex: 1, points: 1 },
              { question: 'When you see many compiler errors, you should read…|||Khi thấy nhiều lỗi biên dịch, bạn nên đọc…', options: ['the last one|||cái cuối', 'the first one (the rest cascade)|||cái đầu tiên (số còn lại kéo theo)', 'all at once|||tất cả cùng lúc', 'none|||không cái nào'], correctIndex: 1, points: 1 },
              { question: 'A program that runs and does 3/5 features vs one that will not compile…|||Chương trình chạy được làm 3/5 chức năng so với cái không biên dịch được…', options: ['both score zero|||cả hai 0 điểm', 'the running one scores far more|||cái chạy được ăn điểm hơn nhiều', 'the complete one scores more|||cái hoàn chỉnh ăn điểm hơn', 'they tie|||hòa'], correctIndex: 1, points: 1 },
              { question: 'The Mentor review / viva mainly tests whether you…|||Mentor review / vấn đáp chủ yếu kiểm bạn có…', options: ['can type fast|||gõ nhanh không', 'understand your own code (not copied)|||hiểu code của mình (không chép)', 'memorised the API|||thuộc lòng API', 'used the newest Java|||dùng Java mới nhất'], correctIndex: 1, points: 1 },
              { question: 'The best defence in the viva is that you…|||Phòng thủ tốt nhất khi vấn đáp là bạn…', options: ['read the solutions many times|||đọc lời giải nhiều lần', 'built every program yourself so you know where everything lives|||tự dựng mọi chương trình nên biết mọi thứ nằm đâu', 'brought notes|||mang tài liệu', 'memorised answers|||học thuộc câu trả lời'], correctIndex: 1, points: 1 },
              { question: 'ConcurrentModificationException often hides in student tests because…|||ConcurrentModificationException thường ẩn trong test của sinh viên vì…', options: ['it never happens|||không bao giờ xảy ra', 'with only 2 elements removing the second-to-last does not throw|||với chỉ 2 phần tử, xóa áp chót không ném', 'it only occurs on JDK 21|||chỉ xảy ra trên JDK 21', 'it is a compile error|||là lỗi biên dịch'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ PHẦN 7 — NÂNG CAO (NGOÀI GIÁO TRÌNH) ══════════════════ */
    {
      title: 'Part 7 — Beyond the syllabus|||Phần 7 — Nâng cao (ngoài giáo trình)',
      description: 'Những thói quen biến "qua môn" thành "qua chắc": CheckStyle & code convention, chi phí thuật toán, và tự ra đề & tự chấm.',
      lessons: [
        {
          title: '7.1 — CheckStyle & clean code|||7.1 — CheckStyle & code sạch',
          slug: 'lab211-checkstyle',
          type: 'VIDEO',
          description: 'Plugin bắt buộc trong danh sách công cụ — code theo convention là một phần điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 7 · Lesson 7.1</span>
<h2>CheckStyle &amp; clean code</h2>
<p class="lead">CheckStyle is in the official tool list, which means naming and formatting are part of your grade. It is easy points — and it catches sloppy code while you practise, not in the exam.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Naming.</b> Classes <span class="badge">PascalCase</span>, methods/variables <span class="badge">camelCase</span>, constants <span class="badge">UPPER_SNAKE</span>. No <span class="badge">x1</span>, <span class="badge">aa</span>, <span class="badge">temp2</span>.</div>
  <div class="lz-layer"><b>Formatting.</b> Consistent indentation, braces on every if/for, no 200-character lines.</div>
  <div class="lz-layer"><b>No auto-generated junk.</b> Delete the NetBeans "To change this license header…" comment; add a short Javadoc that says why the class exists.</div>
  <div class="lz-layer"><b>Small methods.</b> One method, one job. A 100-line main() is a CheckStyle and a review red flag.</div>
</div>
<div class="note-ct">Turn CheckStyle on now and fix its warnings as you solve the practice briefs. By the exam, clean code is a habit you do not have to think about.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Auto-format before every submit.</b> NetBeans reformats the whole file with Alt+Shift+F and fixes imports with Ctrl+Shift+I in one keystroke each, clearing most CheckStyle indentation and import warnings for free. Do it as the last step, right after the final compile. <em>Why beyond the syllabus: the tool does the tidying the syllabus grades, but no lesson tells you the shortcut.</em></div>
<a class="link-card exphub" href="/exp-hub/lab211-cai-dat-netbeans?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">Install the CheckStyle plugin</span><span class="lc-sub">Setup steps in the LAB211 tools guide on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 7 · Bài 7.1</span>
<h2>CheckStyle &amp; code sạch</h2>
<p class="lead">CheckStyle nằm trong danh sách công cụ chính thức, nghĩa là đặt tên và định dạng là một phần điểm của bạn. Đó là điểm dễ — và nó bắt code cẩu thả khi bạn luyện, không phải trong phòng thi.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Đặt tên.</b> Lớp <span class="badge">PascalCase</span>, hàm/biến <span class="badge">camelCase</span>, hằng <span class="badge">UPPER_SNAKE</span>. Không <span class="badge">x1</span>, <span class="badge">aa</span>, <span class="badge">temp2</span>.</div>
  <div class="lz-layer"><b>Định dạng.</b> Thụt lề nhất quán, ngoặc cho mọi if/for, không dòng 200 ký tự.</div>
  <div class="lz-layer"><b>Không rác sinh sẵn.</b> Xóa comment "To change this license header…" của NetBeans; thêm Javadoc ngắn nói vì sao lớp tồn tại.</div>
  <div class="lz-layer"><b>Hàm nhỏ.</b> Một hàm, một việc. Một main() 100 dòng là cờ đỏ với CheckStyle và người review.</div>
</div>
<div class="note-ct">Bật CheckStyle ngay và sửa cảnh báo của nó khi giải các đề luyện. Tới kỳ thi, code sạch là thói quen bạn không cần nghĩ tới.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Auto-format trước mỗi lần nộp.</b> NetBeans định dạng lại cả tệp bằng Alt+Shift+F và sửa import bằng Ctrl+Shift+I, mỗi cái một phím, dọn phần lớn cảnh báo thụt lề và import của CheckStyle miễn phí. Làm nó ở bước cuối, ngay sau lần biên dịch chót. <em>Vì sao ngoài syllabus: công cụ làm việc dọn dẹp mà syllabus chấm, nhưng không bài nào chỉ bạn phím tắt.</em></div>
<a class="link-card exphub" href="/exp-hub/lab211-cai-dat-netbeans?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">Cài plugin CheckStyle</span><span class="lc-sub">Các bước cài trong guide công cụ LAB211 trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '7.2 — The real cost of algorithms|||7.2 — Chi phí thật của thuật toán',
          slug: 'lab211-chi-phi-thuat-toan',
          type: 'VIDEO',
          description: 'Vì sao O(n²) đáng ngại — đo thật số phép toán, và khi nào HashMap/binary search thắng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 7 · Lesson 7.2</span>
<h2>The real cost of algorithms — measured, not claimed</h2>
<p class="lead">"Use the right algorithm" is not just exam advice — it is a viva question. Here the cost is <em>measured</em> by counting operations, so you can defend your choice with numbers.</p>
<table>
  <thead><tr><th>Task</th><th>Linear</th><th>Binary search</th><th>HashMap</th></tr></thead>
  <tbody>
    <tr><td>Find 1 item in 1000</td><td>~1000 steps</td><td>~10 steps</td><td>~1 step</td></tr>
  </tbody>
</table>
<p>Doubling <span class="badge">n</span> on an O(n²) algorithm roughly <strong>quadruples</strong> the work — measured at 3.99×, 3.93×, 4.07× for bubble/selection/insertion. That is why a "works on 10 items" sort can be a review target on 10,000.</p>
<div class="note-ct">Do not hard-code timing numbers into an answer — they are not deterministic (JIT warm-up made n=500 measure slower than n=1000 once). Count operations instead; that is deterministic and defensible.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>HashMap is O(1) only with a good hashCode.</b> If every key returns the same hashCode, the map degrades to a linked list and lookups become O(n) — the "~1 step" claim quietly collapses. A correct, well-spread hashCode() is what keeps the whole table fast. <em>Why beyond the syllabus: the average-case table hides the hashCode precondition the brief never mentions.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-856" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Algorithm Reference — measured comparisons</span><span class="lc-sub">Operation counts &amp; the doubling table, ready for the viva.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 7 · Bài 7.2</span>
<h2>Chi phí thật của thuật toán — đo, không phải tuyên bố</h2>
<p class="lead">"Dùng đúng thuật toán" không chỉ là lời khuyên thi — nó là câu hỏi vấn đáp. Ở đây chi phí được <em>đo</em> bằng cách đếm phép toán, để bạn bảo vệ lựa chọn bằng con số.</p>
<table>
  <thead><tr><th>Việc</th><th>Tuyến tính</th><th>Tìm nhị phân</th><th>HashMap</th></tr></thead>
  <tbody>
    <tr><td>Tìm 1 phần tử trong 1000</td><td>~1000 bước</td><td>~10 bước</td><td>~1 bước</td></tr>
  </tbody>
</table>
<p>Gấp đôi <span class="badge">n</span> trên thuật toán O(n²) khiến công việc tăng khoảng <strong>gấp bốn</strong> — đo được 3.99×, 3.93×, 4.07× cho bubble/selection/insertion. Đó là lý do một hàm sort "chạy với 10 phần tử" có thể thành mục tiêu review với 10.000.</p>
<div class="note-ct">Đừng ghi cứng số đo thời gian vào câu trả lời — nó không tất định (JIT khởi động làm n=500 đo chậm hơn n=1000 một lần). Hãy đếm phép toán; nó tất định và bảo vệ được.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>HashMap chỉ O(1) khi có hashCode tốt.</b> Nếu mọi khóa trả về cùng một hashCode, map suy biến thành danh sách liên kết và tra cứu thành O(n) — con số "~1 bước" âm thầm sụp đổ. Một hashCode() đúng, phân tán tốt mới giữ cả bảng nhanh. <em>Vì sao ngoài syllabus: bảng trường hợp trung bình che đi điều kiện tiên quyết hashCode mà đề không nhắc.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-856" target="_blank" rel="noopener">
  <span class="lc-ico">📈</span>
  <span class="lc-body"><span class="lc-title">Algorithm Reference — so sánh đo thật</span><span class="lc-sub">Số phép toán &amp; bảng gấp đôi, sẵn cho vấn đáp.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '7.3 — Capstone: write & grade your own brief|||7.3 — Capstone: tự ra đề & tự chấm',
          slug: 'lab211-capstone-tu-ra-de',
          type: 'VIDEO',
          description: 'Kỹ năng meta đảm bảo qua chắc: viết một đề mới, tự giải, tự chấm như người chấm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 7 · Lesson 7.3</span>
<h2>Capstone — become your own examiner</h2>
<p class="lead">The final skill that guarantees a pass: stop being the student and become the examiner. If you can <em>write</em> a fair brief and grade a solution, you understand the exam from both sides — and nothing on exam day surprises you.</p>
<div class="lz-flow">
  <div class="lz-step">Invent a small management brief (an entity + 4–5 features)</div>
  <div class="lz-step">Write the expected screen output precisely</div>
  <div class="lz-step">Solve it under a timer, no help</div>
  <div class="lz-step">Grade yourself: labels, validation, compile, every menu option</div>
  <div class="lz-step">Have the AI coach change a requirement &amp; defend your answer</div>
</div>
<div class="callout ok">Do this three times in the last week before the exam. Combined with the 54 solved briefs, you will walk in having already seen every shape the exam can take.</div>
<h3>Your pass plan, in one line</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Solve real briefs yourself, easy → hard · validate &amp; match output every time · rehearse the exam under a timer · defend your code in the viva.</b> That is the whole method — and it is why students who do the work pass, and students who read solutions do not.</div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Re-solve your failures after a two-day gap.</b> Keep a short log of every brief you got wrong; re-solve it from scratch two days later, not the same day. The gap forces recall instead of recognition — the exact thing the exam measures. <em>Why beyond the syllabus: spaced practice is a learning technique, not a Java topic, yet it is what turns 54 solved briefs into exam-day fluency.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-847" target="_blank" rel="noopener">
  <span class="lc-ico">🏁</span>
  <span class="lc-body"><span class="lc-title">Finish the 54 briefs &amp; write your own</span><span class="lc-sub">The last mile: from solving to examining.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 7 · Bài 7.3</span>
<h2>Capstone — trở thành người chấm của chính mình</h2>
<p class="lead">Kỹ năng cuối đảm bảo qua môn: thôi làm sinh viên và trở thành người chấm. Nếu bạn có thể <em>viết</em> một đề công bằng và chấm một lời giải, bạn hiểu kỳ thi từ cả hai phía — và không gì trong ngày thi làm bạn bất ngờ.</p>
<div class="lz-flow">
  <div class="lz-step">Nghĩ ra một đề quản lý nhỏ (một entity + 4–5 chức năng)</div>
  <div class="lz-step">Viết output màn hình mong đợi chính xác</div>
  <div class="lz-step">Tự giải dưới đồng hồ, không trợ giúp</div>
  <div class="lz-step">Tự chấm: nhãn, validate, biên dịch, mọi lựa chọn menu</div>
  <div class="lz-step">Cho AI coach đổi một yêu cầu &amp; bảo vệ câu trả lời</div>
</div>
<div class="callout ok">Làm điều này ba lần trong tuần cuối trước thi. Kết hợp với 54 đề đã giải, bạn bước vào phòng thi khi đã thấy mọi hình dạng kỳ thi có thể mang.</div>
<h3>Kế hoạch qua môn, một dòng</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Tự giải đề thật, dễ → khó · validate &amp; khớp output mỗi lần · diễn tập kỳ thi dưới đồng hồ · bảo vệ code khi vấn đáp.</b> Đó là toàn bộ phương pháp — và là lý do sinh viên chịu làm thì qua, còn sinh viên đọc lời giải thì không.</div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Giải lại các bài trượt sau hai ngày.</b> Giữ một sổ ngắn ghi mọi đề bạn làm sai; giải lại từ đầu sau hai ngày, không phải cùng ngày. Khoảng cách buộc bạn nhớ lại thay vì nhận ra — đúng thứ kỳ thi đo. <em>Vì sao ngoài syllabus: luyện có giãn cách là kỹ thuật học, không phải chủ đề Java, nhưng nó biến 54 đề đã giải thành phản xạ ngày thi.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-847" target="_blank" rel="noopener">
  <span class="lc-ico">🏁</span>
  <span class="lc-body"><span class="lc-title">Hoàn thành 54 đề &amp; tự ra đề</span><span class="lc-sub">Chặng cuối: từ giải đề tới chấm đề.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 7 — Beyond the syllabus|||Quiz 7 — Ngoài giáo trình',
          slug: 'lab211-quiz-7',
          type: 'QUIZ',
          description: 'Kiểm tra CheckStyle, chi phí thuật toán và tư duy tự chấm.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'CheckStyle matters in LAB211 because…|||CheckStyle quan trọng trong LAB211 vì…', options: ['it compiles your code|||nó biên dịch code', 'clean naming/formatting is part of the grade|||đặt tên/định dạng sạch là một phần điểm', 'it runs the program|||nó chạy chương trình', 'it is optional|||nó tùy chọn'], correctIndex: 1, points: 1 },
              { question: 'Doubling n on an O(n²) algorithm multiplies the work by about…|||Gấp đôi n trên thuật toán O(n²) nhân công việc lên khoảng…', options: ['2×', '4×', 'no change|||không đổi', '10×'], correctIndex: 1, points: 1 },
              { question: 'When defending an algorithm choice, you should present…|||Khi bảo vệ lựa chọn thuật toán, bạn nên trình bày…', options: ['hard-coded timing numbers|||số đo thời gian ghi cứng', 'deterministic operation counts|||số phép toán tất định', 'your opinion|||ý kiến của bạn', 'the file size|||kích thước file'], correctIndex: 1, points: 1 },
              { question: 'The single-line pass method is…|||Phương pháp qua môn một dòng là…', options: ['read every solution twice|||đọc mọi lời giải hai lần', 'solve real briefs yourself, validate & match output, rehearse, defend|||tự giải đề thật, validate & khớp output, diễn tập, bảo vệ', 'memorise the API|||học thuộc API', 'attend every slot only|||chỉ dự đủ slot'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* END-SECTIONS-MARKER */
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ gồm PE (thi thực hành) và FE (trắc nghiệm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "PE — Practical Exam|||PE — Thi thực hành",
          "slug": "lab211-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) is a <strong>hands-on coding exam</strong>: you are given a problem or feature and must write (and usually run) working code on the machine within a time limit. It is graded on correctness, whether it runs, and good practice.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Rebuild small features from a blank file, <em>without notes</em> &mdash; copying tutorials is not enough.</li>\n<li>Practise the core pattern of this subject end-to-end until you can do it from memory.</li>\n<li>Read the requirement twice; build the smallest working version first, then extend.</li>\n<li>Test as you go; a program that runs and does 80% beats one that does not compile.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) là <strong>thi code trực tiếp</strong>: bạn được giao một bài toán/tính năng và phải viết (thường là chạy) code hoạt động trên máy trong thời gian quy định. Chấm theo tính đúng, có chạy được không, và thực hành tốt.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Dựng lại các tính năng nhỏ từ một file trống, <em>không nhìn ghi chú</em> &mdash; chép tutorial là chưa đủ.</li>\n<li>Luyện mẫu cốt lõi của môn đầu-cuối tới khi làm được từ trí nhớ.</li>\n<li>Đọc yêu cầu hai lần; dựng bản chạy được nhỏ nhất trước, rồi mở rộng.</li>\n<li>Test dọc đường; một chương trình chạy và làm được 80% hơn một chương trình không biên dịch nổi.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "lab211-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "LAB211 is graded mainly on…|||LAB211 chấm chủ yếu dựa trên…",
                "options": [
                  "a written theory exam|||một bài thi lý thuyết viết",
                  "working code produced under time pressure|||code chạy được viết dưới áp lực thời gian",
                  "attendance only|||chỉ điểm danh",
                  "group presentations|||thuyết trình nhóm"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "The prerequisite for LAB211 is…|||Tiên quyết của LAB211 là…",
                "options": [
                  "PRF192",
                  "PRO192",
                  "CSD201",
                  "none|||không có"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "The single biggest cause of failing is…|||Nguyên nhân trượt lớn nhất là…",
                "options": [
                  "not memorising theory|||không thuộc lý thuyết",
                  "reading solutions instead of writing them|||đọc lời giải thay vì tự viết",
                  "using NetBeans|||dùng NetBeans",
                  "validating input|||validate input"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "The marker compares your program by…|||Người chấm so chương trình của bạn bằng cách…",
                "options": [
                  "reading your code style only|||chỉ đọc phong cách code",
                  "running it and comparing console output line by line|||chạy nó và so output console từng dòng",
                  "counting your comments|||đếm số comment",
                  "checking file size|||kiểm kích thước file"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "The correct study loop puts \"read the reference solution\"…|||Vòng lặp học đúng đặt \"đọc lời giải tham khảo\"…",
                "options": [
                  "first, before trying|||đầu tiên, trước khi thử",
                  "after you have solved it yourself|||sau khi bạn đã tự giải",
                  "instead of writing code|||thay cho việc viết code",
                  "never|||không bao giờ"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "The exercises on the track are ordered by…|||Các đề trên track được xếp theo…",
                "options": [
                  "alphabet|||bảng chữ cái",
                  "lines of code (real difficulty)|||số dòng code (độ khó thật)",
                  "random|||ngẫu nhiên",
                  "date added|||ngày thêm"
                ],
                "correctIndex": 1
              }
            ]
          }
        }
      ]
    },

    /* ══════════════════ PHẦN 8 — THỰC HÀNH ĐẦY ĐỦ: 54 BÀI LAB211 ══════════════════ */
    {
      title: 'Part 8 — Full practice catalog: all 54 Lab211 exercises|||Phần 8 — Thực hành đầy đủ: 54 bài Lab211',
      description: 'Toàn bộ 54 bài tập của track Lab211 trên CodeLab, chia theo độ khó (13 Dễ · 22 Trung bình · 19 Khó). Mỗi thẻ có tóm tắt bài và dẫn sâu tới đề bài đầy đủ, lời giải tham khảo, sơ đồ, và ô video hướng dẫn (hiện để trống, sẽ được thêm sau) trên CodeLab.',
      lessons: [
        {
          title: '8.1 — Easy warm-ups (13 exercises)|||8.1 — Khởi động Dễ (13 bài)',
          slug: 'lab211-thuc-hanh-de',
          type: 'VIDEO',
          description: '13 bài độ khó Dễ của track Lab211 — điểm khởi đầu trước khi vào các bài khó hơn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 8 · Lesson 8.1</span>
<h2>Easy warm-ups — 13 exercises</h2>
<p class="lead">These are the 13 EASY-difficulty exercises from the Lab211 CodeLab track, a good place to start before moving on to harder OOP with Java labs. Each card below opens the exercise's full brief, a reference solution and a diagram on CodeLab.</p>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0060-calculate-the-total-amount-spent-by-a-user-through-the-bills?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">01 · Calculate the total amount spent by a user through the bills</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~25p</span> Build a Person and Wallet pair of classes that read in a list of bills and the amount currently in the wallet. Implement calcTotal to sum the bills and payMoney to compare that total against the wallet balance, printing whether the purchase can go through.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0063-input-and-display-person-info?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">02 · Input and display Person Info</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~30p</span> Collect name, address and salary for three people, validating that salary is a positive number and re-prompting on bad input. Implement bubble sort (sortBySalary) to order the entered people ascending by salary, then display each one's info in that order.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0062-create-a-program-to-analyze-file-path?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">03 · Create a program to analyze file path</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~31p</span> Take a Windows-style file path as input and break it apart into its disk drive, folder path, file name and extension using String methods like lastIndexOf, indexOf, substring and split. Five methods (getDisk, getPath, getFileName, getExtension, getFolders) each return one piece of that breakdown.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0064-check-data-format?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">04 · Check data format</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~36p</span> Validate three kinds of user input with regex and date parsing: a 10-digit phone number, a standard email address, and a date in dd/MM/yyyy format via SimpleDateFormat. checkPhone, checkEmail and checkDate each return an error message (or empty string when the input is valid) so the caller can loop until the input is correct.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0069-input-sort-and-display-student-information?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">05 · Input, sort and display student information</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~39p</span> Despite the title, this brief is about file I/O: ask the user whether to write to a file, prompt for a path and content, then write it with FileWriter/BufferedWriter. Implement writeFile to save the content and readFile to load it back with FileReader, printing the file's content on screen.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0068-input-sort-and-display-student-information?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">06 · Input, sort and display student information</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~44p</span> Collect a list of students (name, class, mark), re-prompting while the mark isn't a valid number, then use a custom Comparator with Collections.sort() to order them by name A to Z. Implement sortStudent to return the sorted list and display to print every student's details.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0067-analyze-the-user-input-string?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">07 · Analyze the user input string</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~46p</span> Parse an arbitrary input string with regex and Character helpers to separate its digits (all numbers, even numbers, odd numbers, perfect squares) from its letters (uppercase, lowercase) and symbols (special characters). getNumber returns the numeric groupings and getCharacter returns the character groupings, both printed to the screen.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0001-bubble-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">08 · Bubble sort algorithm</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~48p</span> Ask the user for an array size, fill it with random integers, then implement classic bubble sort: repeatedly compare adjacent pairs and swap out-of-order ones until no swaps remain. Print the array both before and after sorting so the effect is visible.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0002-selection-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">09 · Selection sort algorithm</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~48p</span> Same random-array setup as the bubble sort exercise, but implement selection sort instead: repeatedly scan the unsorted part of the array for its minimum element and move it to the end of the sorted part. Print the array before and after sorting to compare.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0003-insertion-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">10 · Insertion sort algorithm</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~48p</span> Same random-array setup again, this time implementing insertion sort: keep a sorted prefix and, for each new element, shift it into its correct position within that prefix. Print the array before and after sorting.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0083-stacks?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">11 · Stacks</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~48p</span> Build a MyStack class backed by an array or ArrayList with push, pop and get (peek) methods that follow LIFO order — last in, first out. Wrap it in a menu-driven demo (push/pop/peek/display) and make sure pop/get on an empty stack fail gracefully instead of crashing.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0053-sort-one-dimensional-array-with-bubble-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">12 · Sort one-dimensional array with bubble sort algorithm</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~50p</span> Build a menu-driven program (input array / sort ascending / sort descending / exit) where checkIn validates that entered array length and values are positive integers before storing them. sortAscending and sortDescending both use bubble sort to reorder the array in the requested direction.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0061-create-a-program-to-calculate-perimeter-and-area?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">13 · Create a program to calculate perimeter and area</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~50p</span> Design an abstract Shape class with getPerimeter, getArea and printResult, then extend it with Circle, Rectangle and Triangle subclasses that store their own dimensions. Rectangle and Circle use straightforward geometry formulas while Triangle computes its area with Heron's formula via Math.sqrt().</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="note-ct">Each exercise page has a "Video tutorial" slot that is currently empty and will be filled in later — no action is needed from you.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Part 8 · Lesson 8.1</span>
<h2>Khởi động Dễ — 13 bài</h2>
<p class="lead">Đây là 13 bài tập độ khó DỄ thuộc track Lab211 trên CodeLab, điểm khởi đầu phù hợp trước khi chuyển sang các bài OOP with Java khó hơn. Mỗi thẻ bên dưới mở đề bài đầy đủ, lời giải tham khảo và sơ đồ minh hoạ trên CodeLab.</p>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0060-calculate-the-total-amount-spent-by-a-user-through-the-bills?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">01 · Calculate the total amount spent by a user through the bills</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~25p</span> Xây dựng cặp lớp Person và Wallet đọc vào danh sách hoá đơn cùng số tiền hiện có trong ví. Cài đặt calcTotal để cộng tổng hoá đơn và payMoney để so sánh tổng đó với số dư trong ví, in ra việc thanh toán có thực hiện được hay không.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0063-input-and-display-person-info?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">02 · Input and display Person Info</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~30p</span> Thu thập tên, địa chỉ và lương của ba người, kiểm tra lương phải là số dương và yêu cầu nhập lại nếu sai. Cài đặt sắp xếp nổi bọt (sortBySalary) để xếp những người vừa nhập theo lương tăng dần, sau đó hiển thị thông tin từng người theo thứ tự đó.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0062-create-a-program-to-analyze-file-path?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">03 · Create a program to analyze file path</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~31p</span> Nhận vào một đường dẫn kiểu Windows và tách nó thành ổ đĩa, đường dẫn thư mục, tên tệp và phần mở rộng bằng các phương thức của String như lastIndexOf, indexOf, substring và split. Năm phương thức (getDisk, getPath, getFileName, getExtension, getFolders) mỗi phương thức trả về một phần của kết quả tách đó.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0064-check-data-format?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">04 · Check data format</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~36p</span> Kiểm tra ba loại dữ liệu người dùng nhập bằng regex và phân tích ngày tháng: số điện thoại đủ 10 chữ số, địa chỉ email đúng chuẩn, và ngày theo định dạng dd/MM/yyyy dùng SimpleDateFormat. checkPhone, checkEmail và checkDate mỗi hàm trả về thông báo lỗi (hoặc chuỗi rỗng nếu hợp lệ) để chương trình lặp lại đến khi nhập đúng.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0069-input-sort-and-display-student-information?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">05 · Input, sort and display student information</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~39p</span> Dù tiêu đề nhắc tới sinh viên, bài này thực chất là về đọc/ghi tệp: hỏi người dùng có muốn ghi tệp không, yêu cầu nhập đường dẫn và nội dung rồi ghi bằng FileWriter/BufferedWriter. Cài đặt writeFile để lưu nội dung và readFile để đọc lại bằng FileReader, in nội dung tệp ra màn hình.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0068-input-sort-and-display-student-information?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">06 · Input, sort and display student information</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~44p</span> Thu thập danh sách sinh viên (tên, lớp, điểm), yêu cầu nhập lại nếu điểm không phải số hợp lệ, sau đó dùng Comparator tuỳ chỉnh với Collections.sort() để sắp xếp theo tên từ A đến Z. Cài đặt sortStudent để trả về danh sách đã sắp xếp và display để in thông tin từng sinh viên.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0067-analyze-the-user-input-string?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">07 · Analyze the user input string</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~46p</span> Phân tích một chuỗi nhập bất kỳ bằng regex và các hàm hỗ trợ của Character để tách các chữ số (tất cả các số, số chẵn, số lẻ, số chính phương) khỏi các chữ cái (in hoa, in thường) và ký tự đặc biệt. getNumber trả về các nhóm số và getCharacter trả về các nhóm ký tự, tất cả được in ra màn hình.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0001-bubble-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">08 · Bubble sort algorithm</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~48p</span> Hỏi người dùng kích thước mảng, sinh ngẫu nhiên các số nguyên để lấp đầy, rồi cài đặt sắp xếp nổi bọt cổ điển: liên tục so sánh từng cặp phần tử liền kề và hoán đổi nếu sai thứ tự cho tới khi không còn hoán đổi nào. In mảng cả trước và sau khi sắp xếp để thấy rõ hiệu quả.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0002-selection-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">09 · Selection sort algorithm</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~48p</span> Cùng cách sinh mảng ngẫu nhiên như bài sắp xếp nổi bọt, nhưng lần này cài đặt sắp xếp chọn: liên tục quét phần chưa sắp xếp của mảng để tìm phần tử nhỏ nhất và chuyển nó vào cuối phần đã sắp xếp. In mảng trước và sau khi sắp xếp để so sánh.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0003-insertion-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">10 · Insertion sort algorithm</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~48p</span> Vẫn cách sinh mảng ngẫu nhiên như hai bài trước, nhưng lần này cài đặt sắp xếp chèn: giữ một đoạn đầu đã sắp xếp và với mỗi phần tử mới, dịch chuyển nó vào đúng vị trí trong đoạn đó. In mảng trước và sau khi sắp xếp.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0083-stacks?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">11 · Stacks</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~48p</span> Xây dựng lớp MyStack dùng mảng hoặc ArrayList làm nơi lưu trữ, với các phương thức push, pop và get (xem đỉnh) tuân theo nguyên tắc LIFO — vào sau ra trước. Bọc nó trong một demo có menu (push/pop/peek/hiển thị) và đảm bảo pop/get trên ngăn xếp rỗng không làm crash chương trình.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0053-sort-one-dimensional-array-with-bubble-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">12 · Sort one-dimensional array with bubble sort algorithm</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~50p</span> Xây dựng chương trình có menu (nhập mảng / sắp xếp tăng dần / sắp xếp giảm dần / thoát), trong đó checkIn kiểm tra độ dài mảng và giá trị nhập vào phải là số nguyên dương trước khi lưu. sortAscending và sortDescending đều dùng sắp xếp nổi bọt để sắp lại mảng theo chiều được yêu cầu.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0061-create-a-program-to-calculate-perimeter-and-area?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">13 · Create a program to calculate perimeter and area</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~50p</span> Thiết kế lớp trừu tượng Shape với getPerimeter, getArea và printResult, sau đó kế thừa thành các lớp con Circle, Rectangle và Triangle tự lưu kích thước riêng. Rectangle và Circle dùng công thức hình học thông thường, còn Triangle tính diện tích bằng công thức Heron thông qua Math.sqrt().</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="note-ct">Mỗi trang bài tập có một ô "Video hướng dẫn" hiện đang để trống và sẽ được bổ sung sau — bạn không cần làm gì thêm.</div>
</div>
`,
        },
        {
          title: '8.2 — Medium practice (22 exercises)|||8.2 — Thực hành Trung bình (22 bài)',
          slug: 'lab211-thuc-hanh-trung-binh',
          type: 'VIDEO',
          description: '22 bài độ khó Trung bình — xương sống của track Lab211: file I/O, collections, validation, kế thừa/đa hình.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 8 · Lesson 8.2</span>
<h2>Medium practice — 22 exercises</h2>
<p class="lead">These are the 22 MEDIUM-difficulty exercises from the Lab211 CodeLab track — the backbone of this course, covering file I/O, collections, validation, sorting/searching and inheritance/polymorphism. Each card below opens the exercise's full brief, a reference solution, and a diagram on CodeLab.</p>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0058-write-program-dictionary?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">01 · Write program dictionary</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~62p</span> Build a simple English–Vietnamese dictionary that stores word pairs in a HashMap and persists them to a file on disk. The console menu lets the user add a new pair, delete a pair by its English word, or translate an English word to Vietnamese, loading existing data on startup and rewriting the file after every change.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0008-letter-and-character-count?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">02 · Letter and character count</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~65p</span> Read a line of text from the user and count how many letters and how many characters it contains. A good chance to practice tokenizing a string with StringTokenizer from java.util.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0009-fibonacci?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">03 · Fibonacci</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~65p</span> Compute and print the first 45 terms of the Fibonacci sequence using a recursive method. A classic first exercise in recursion, following the textbook definition where each term is the sum of the two before it.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0010-linear-search?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">04 · Linear search</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~65p</span> Fill an array with random integers in a user-given range, then search it for a value the user enters using linear search. The program prints the generated array and the index where the search value was found.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0057-user-management-system?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">05 · User management system</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~72p</span> Build a two-option menu program that creates new accounts and logs users in against a user.dat file. New accounts are validated (username at least 5 characters and unique, password at least 6 characters, no spaces) before being appended to the file and loaded into a collection for login lookups.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0082-playing-cards?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">06 · Playing cards</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~78p</span> Design an immutable Card class (rank + suit, with a readable toString) and a Deck class that builds all 52 rank–suit combinations with two nested loops. A short test program then creates a deck and prints all of its cards, practicing encapsulation and object composition.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0084-large-number?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">07 · Large number</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~78p</span> Multiply two numbers that are too large for int or long by reading them as strings, converting each to a digit array, and reproducing schoolbook long multiplication with carries. The result array (sized to the sum of both lengths) is printed after stripping leading zeros — no BigInteger allowed.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0051-develop-a-computer-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">08 · Develop a computer program</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~79p</span> Build a menu-driven calculator that supports +, -, *, /, ^ with a running memory value until the user enters '=', plus a second mode that computes BMI from weight and height and classifies the result (Under-standard, Standard, Overweight, Fat, Very fat). Both modes validate numeric input and handle invalid operators or division by zero.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0066-car-showroom?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">09 · Car showroom</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~81p</span> Check whether a customer's requested car (name, color, price, day) matches what the showroom actually sells, using enums for the three car models (Audi, Mercedes, BMW) with their fixed colors, prices and sale days. An unpainted car ('no color') gets a $100 discount, and any mismatch on name, color, price or day throws a custom ExceptionCar with the reason.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0054-develop-the-contact-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">10 · Develop the Contact Management Program</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~83p</span> Manage a contact list (add, display, delete) where each contact gets an auto-incrementing ID and its first/last name split from a single entered name. Adding a contact validates the phone number against several accepted formats (plain digits, dashes, dots, spaces, extensions), and deleting requires a valid existing ID.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0052-write-a-program-to-manage-the-geographic?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">11 · Write a program to manage the geographic</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~89p</span> Model countries with a base Country class (code, name, area) and an EastAsiaCountries subclass adding terrain, using inheritance and overridden display(). The menu lets the user enter data for East Asian countries, list what was entered, search by name, and print the list sorted alphabetically.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0004-quick-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">12 · Quick sort algorithm</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Generate an array of random integers in a user-given range and sort it in place with the quicksort algorithm (pivot selection, partitioning, recursive divide-and-conquer). The program prints both the unsorted and the sorted array.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0005-merge-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">13 · Merge sort algorithm</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Generate an array of random integers and sort it using merge sort — splitting the array into single-element sublists and repeatedly merging sorted sublists until one sorted list remains. The program displays the array before and after sorting.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0006-binary-search-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">14 · Binary search algorithm</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Generate an array of random integers, sort it, then search it for a user-given value using binary search (repeatedly halving the search range by comparing against the middle element). The program prints the sorted array and the index of the found value, or reports that it is absent.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0007-undirected-graphs-representation?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">15 · Undirected graphs representation</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Build a Graph class that represents an undirected graph using an adjacency matrix. The program prompts the user for pairs of vertices and records whether each pair forms an edge, filling in the corresponding symmetric cells of the matrix.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0056-program-to-manage-worker-information?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">16 · Program to manage worker information</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Manage workers with a menu to add a worker (validating a unique code, age 18–50, salary greater than 0), increase or decrease a worker's salary by a given amount, and list every salary adjustment recorded with its date and up/down status. Each salary change is validated (existing code, positive amount) and appended to a salary history.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0065-check-data-format?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">17 · Check data format</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Collect students with their name, class and three subject marks (Math, Physics, Chemistry, 1–10 each, with input re-prompted until valid), compute each student's average, and classify it into type A/B/C/D by fixed mark thresholds. The program then prints every student's info and the percentage of students in each type.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0050-solving-the-equation-find-the-square-numbers-even-numbers-and-odd-numbers?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">18 · Solving the equation, find the square numbers, even numbers, and odd numbers</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~93p</span> Solve either a linear equation (ax + b = 0) or a quadratic equation (ax squared + bx + c = 0) from user-entered coefficients, validating that each input is numeric. After solving, the program scans the input coefficients (and, for the quadratic case, the roots) to report which of them are odd, even or perfect squares.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0055-doctor-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">19 · Doctor management program</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~94p</span> Manage a list of doctors (code, name, specialization, availability) through add, update, delete and search-by-text operations built on a HashMap. Adding rejects duplicate codes, updating and deleting require an existing code, and updating leaves a field unchanged if the corresponding input is left blank.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0059-the-program-handles-files?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">20 · The program handles files</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~94p</span> Read a semicolon-separated text file of people (name, address, salary — defaulting a missing or invalid salary to zero) and list everyone whose salary meets a user-given minimum, along with who has the least and the most. A second option reads a text file and writes every distinct word it contains, once each, into a new file.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0080-shapes?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">21 · Shapes</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~117p</span> Design an abstract Shape hierarchy (TwoDimensionalShape / ThreeDimensionalShape, with concrete Circle, Square, Triangle, Sphere, Cube and Tetrahedron) where each class overrides getArea() — and getVolume() for the 3D shapes — using its own formula. A test program stores one instance of each concrete class in a Shape array and prints its area, and volume if applicable, through polymorphism.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0081-bees?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">22 · Bees</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~117p</span> Model a Bee hierarchy (Worker, Queen, Drone) where every bee starts at 100% health, exposes a read-only health/dead status, and has a Damage(percent) method that reduces health by a percentage of its current value — each subclass dies at its own threshold (70%, 20%, 50%). A console menu creates a colony of 30 bees (10 of each kind) and applies one round of random damage to all of them, reprinting each bee's updated health and alive/dead status.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="note-ct">Each exercise page has a "Video tutorial" slot that is currently empty and will be filled in later — no action is needed from you.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Part 8 · Lesson 8.2</span>
<h2>Thực hành Trung bình — 22 bài</h2>
<p class="lead">Đây là 22 bài tập mức TRUNG BÌNH từ track Lab211 trên CodeLab — phần xương sống của khoá học này, bao phủ file I/O, collections, kiểm tra dữ liệu (validation), sắp xếp/tìm kiếm và kế thừa/đa hình. Mỗi thẻ bên dưới sẽ mở đề bài đầy đủ, bài giải tham khảo và sơ đồ trên CodeLab.</p>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0058-write-program-dictionary?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">01 · Write program dictionary</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~62p</span> Xây dựng một từ điển Anh–Việt đơn giản, lưu các cặp từ trong HashMap và ghi xuống file trên đĩa. Menu console cho phép người dùng thêm một cặp từ mới, xoá một cặp theo từ tiếng Anh, hoặc dịch một từ tiếng Anh sang tiếng Việt — dữ liệu được nạp lại khi khởi động và file được ghi đè sau mỗi thay đổi.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0008-letter-and-character-count?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">02 · Letter and character count</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~65p</span> Đọc một chuỗi văn bản người dùng nhập và đếm số chữ cái cũng như số ký tự trong đó. Bài tập tốt để luyện tách chuỗi bằng StringTokenizer trong gói java.util.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0009-fibonacci?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">03 · Fibonacci</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~65p</span> Tính và in ra 45 số hạng đầu tiên của dãy Fibonacci bằng phương thức đệ quy. Đây là bài luyện đệ quy kinh điển, theo đúng định nghĩa toán học: mỗi số hạng bằng tổng hai số hạng liền trước.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0010-linear-search?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">04 · Linear search</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~65p</span> Sinh một mảng số nguyên ngẫu nhiên trong khoảng người dùng nhập, sau đó tìm một giá trị người dùng nhập bằng thuật toán tìm kiếm tuyến tính. Chương trình in ra mảng đã sinh và vị trí (chỉ số) tìm thấy giá trị cần tìm.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0057-user-management-system?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">05 · User management system</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~72p</span> Xây dựng chương trình menu hai lựa chọn: tạo tài khoản mới và đăng nhập dựa trên file user.dat. Tài khoản mới được kiểm tra hợp lệ (tên đăng nhập tối thiểu 5 ký tự và không trùng, mật khẩu tối thiểu 6 ký tự, không chứa khoảng trắng) trước khi được ghi thêm vào file và nạp vào collection để tra cứu khi đăng nhập.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0082-playing-cards?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">06 · Playing cards</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~78p</span> Thiết kế lớp Card bất biến (rank + suit, có toString dễ đọc) và lớp Deck dựng đủ 52 tổ hợp rank–suit bằng hai vòng lặp lồng nhau. Một chương trình test nhỏ sẽ tạo một bộ bài và in ra toàn bộ 52 lá, luyện tập tính đóng gói (encapsulation) và kết hợp đối tượng (object composition).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0084-large-number?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">07 · Large number</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~78p</span> Nhân hai số quá lớn để chứa trong int hay long bằng cách đọc chúng dưới dạng chuỗi, chuyển mỗi số thành mảng chữ số, rồi thực hiện phép nhân dài kiểu thủ công có nhớ (carry). Mảng kết quả (kích thước bằng tổng độ dài hai số) được in ra sau khi bỏ các số 0 ở đầu — không được dùng BigInteger.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0051-develop-a-computer-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">08 · Develop a computer program</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~79p</span> Xây dựng máy tính theo menu hỗ trợ +, -, *, /, ^ với một giá trị bộ nhớ chạy liên tục cho tới khi người dùng nhập '=', cùng chế độ thứ hai tính chỉ số BMI từ cân nặng và chiều cao rồi phân loại kết quả (Dưới chuẩn, Chuẩn, Thừa cân, Béo, Rất béo). Cả hai chế độ đều kiểm tra dữ liệu số hợp lệ và xử lý toán tử sai hoặc chia cho 0.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0066-car-showroom?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">09 · Car showroom</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~81p</span> Kiểm tra xem yêu cầu mua xe của khách (tên xe, màu, giá, ngày) có khớp với những gì showroom thực sự bán hay không, dùng enum cho ba hãng xe (Audi, Mercedes, BMW) với màu, giá và ngày bán cố định. Xe không sơn ('no color') được giảm 100 đô, và bất kỳ sai lệch nào về tên, màu, giá hay ngày sẽ ném ra ngoại lệ ExceptionCar tự định nghĩa kèm lý do.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0054-develop-the-contact-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">10 · Develop the Contact Management Program</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~83p</span> Quản lý danh bạ liên hệ (thêm, hiển thị, xoá), mỗi liên hệ được cấp ID tự tăng và tên/họ được tách tự động từ tên nhập vào. Khi thêm liên hệ, số điện thoại được kiểm tra theo nhiều định dạng chấp nhận (số thuần, có gạch ngang, dấu chấm, khoảng trắng, số máy lẻ), còn xoá liên hệ đòi hỏi ID hợp lệ đang tồn tại.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0052-write-a-program-to-manage-the-geographic?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">11 · Write a program to manage the geographic</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~89p</span> Mô hình hoá các quốc gia với lớp cơ sở Country (mã, tên, diện tích) và lớp con EastAsiaCountries thêm thuộc tính địa hình, sử dụng kế thừa và ghi đè display(). Menu cho phép nhập dữ liệu các nước Đông Á, hiển thị danh sách đã nhập, tìm theo tên, và in danh sách đã sắp xếp theo tên.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0004-quick-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">12 · Quick sort algorithm</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Sinh một mảng số nguyên ngẫu nhiên trong khoảng người dùng nhập và sắp xếp tại chỗ bằng thuật toán quicksort (chọn pivot, phân hoạch, chia để trị đệ quy). Chương trình in ra cả mảng trước và sau khi sắp xếp.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0005-merge-sort-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">13 · Merge sort algorithm</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Sinh một mảng số nguyên ngẫu nhiên và sắp xếp bằng merge sort — chia mảng thành các mảng con một phần tử rồi lần lượt trộn các mảng con đã sắp xếp cho tới khi còn một danh sách duy nhất. Chương trình hiển thị mảng trước và sau khi sắp xếp.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0006-binary-search-algorithm?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">14 · Binary search algorithm</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Sinh một mảng số nguyên ngẫu nhiên, sắp xếp nó, rồi tìm một giá trị người dùng nhập bằng tìm kiếm nhị phân (liên tục chia đôi phạm vi tìm kiếm dựa vào phần tử giữa). Chương trình in ra mảng đã sắp xếp và chỉ số của giá trị tìm được, hoặc báo giá trị không tồn tại.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0007-undirected-graphs-representation?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">15 · Undirected graphs representation</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Xây dựng lớp Graph biểu diễn đồ thị vô hướng bằng ma trận kề. Chương trình yêu cầu người dùng nhập từng cặp đỉnh và ghi nhận cặp đó có tạo thành cạnh hay không, điền vào các ô đối xứng tương ứng trong ma trận.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0056-program-to-manage-worker-information?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">16 · Program to manage worker information</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Quản lý nhân viên với menu thêm nhân viên (kiểm tra mã không trùng, tuổi 18–50, lương lớn hơn 0), tăng hoặc giảm lương theo một số tiền nhập vào, và liệt kê toàn bộ lịch sử điều chỉnh lương kèm ngày và trạng thái tăng/giảm. Mỗi lần đổi lương đều được kiểm tra hợp lệ (mã tồn tại, số tiền dương) và ghi vào lịch sử lương.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0065-check-data-format?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">17 · Check data format</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~91p</span> Thu thập thông tin sinh viên gồm tên, lớp và ba điểm môn (Toán, Lý, Hoá, mỗi điểm 1–10, nhập lại tới khi hợp lệ), tính điểm trung bình và phân loại theo A/B/C/D dựa trên các ngưỡng điểm cố định. Chương trình sau đó in thông tin từng sinh viên và tỷ lệ phần trăm sinh viên ở mỗi loại.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0050-solving-the-equation-find-the-square-numbers-even-numbers-and-odd-numbers?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">18 · Solving the equation, find the square numbers, even numbers, and odd numbers</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~93p</span> Giải phương trình bậc nhất (ax + b = 0) hoặc phương trình bậc hai (ax bình phương + bx + c = 0) từ các hệ số người dùng nhập, kiểm tra dữ liệu nhập phải là số. Sau khi giải, chương trình quét các hệ số đầu vào (và với phương trình bậc hai, cả nghiệm) để báo giá trị nào là số lẻ, số chẵn hay số chính phương.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0055-doctor-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">19 · Doctor management program</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~94p</span> Quản lý danh sách bác sĩ (mã, tên, chuyên khoa, số chỗ trống) qua các thao tác thêm, sửa, xoá và tìm theo văn bản, xây trên nền HashMap. Thêm mới sẽ từ chối mã trùng, sửa/xoá đòi hỏi mã đã tồn tại, và khi sửa nếu bỏ trống trường nào thì giữ nguyên giá trị cũ của trường đó.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0059-the-program-handles-files?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">20 · The program handles files</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~94p</span> Đọc một file văn bản chứa danh sách người (tên, địa chỉ, lương — nếu lương thiếu hoặc sai định dạng thì mặc định về 0) và liệt kê những người có lương từ một mức tối thiểu nhập vào trở lên, kèm ai có lương thấp nhất và cao nhất. Lựa chọn thứ hai đọc một file văn bản và ghi mọi từ khác nhau xuất hiện trong đó (mỗi từ một lần) vào một file mới.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0080-shapes?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">21 · Shapes</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~117p</span> Thiết kế cây phân cấp trừu tượng Shape (TwoDimensionalShape / ThreeDimensionalShape, với các lớp cụ thể Circle, Square, Triangle, Sphere, Cube và Tetrahedron), mỗi lớp ghi đè getArea() — và getVolume() với hình khối 3D — theo công thức riêng. Một chương trình test lưu mỗi lớp cụ thể một đối tượng trong mảng Shape rồi in diện tích, và thể tích nếu có, thông qua tính đa hình.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0081-bees?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">22 · Bees</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~117p</span> Mô hình hoá cây phân cấp Bee (Worker, Queen, Drone), mỗi con ong bắt đầu ở 100% sức khoẻ, có trạng thái sức khoẻ/chết chỉ đọc, và phương thức Damage(percent) giảm sức khoẻ theo phần trăm giá trị hiện tại — mỗi loại con chết ở ngưỡng riêng (70%, 20%, 50%). Menu console tạo một đàn 30 con ong (10 con mỗi loại) và thực hiện một đợt tấn công ngẫu nhiên lên tất cả, in lại sức khoẻ cập nhật và trạng thái sống/chết của từng con.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="note-ct">Mỗi trang bài tập có một mục "Video hướng dẫn" hiện đang để trống và sẽ được bổ sung sau — bạn không cần làm gì thêm.</div>
</div>
`,
        },
        {
          title: '8.3 — Hard practice (19 exercises)|||8.3 — Thực hành Khó (19 bài)',
          slug: 'lab211-thuc-hanh-kho',
          type: 'VIDEO',
          description: '19 bài độ khó Khó — dự án OOP nhiều file, tiện ích xử lý file, mức độ ngang đề thi thực hành.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 8 · Lesson 8.3</span>
<h2>Hard practice — 19 exercises</h2>
<p class="lead">These are the 19 HARD-difficulty exercises from the Lab211 CodeLab practice track — multi-file OOP projects, file I/O utilities, and exam-level console programs. Each card opens the full problem brief on CodeLab, complete with a reference solution and a solution diagram.</p>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0011-change-base-number-system-16-10-2-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">01 · Change base number system (16, 10, 2) program</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> Loops so the user repeatedly picks an input number base and an output base — binary, decimal or hex — types a value, and the program prints the converted result until the program is closed.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0073-program-to-manage-expense-name-handy-expense?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">02 · Program to manage expense, name Handy Expense</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> A file-backed expense tracker named Handy Expense: add an expense with an auto-incrementing ID, date, amount and content; list all expenses with a running total; and delete an expense by ID, reporting failure if the ID does not exist.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0074-write-a-calculator-program-from-dcps-s-project?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">03 · Write a calculator program (from DCPS’s project)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> A menu-driven matrix calculator: the user enters the row/column size and values of two matrices, and the program performs addition, subtraction or multiplication on them, warning the user if an entered value is not numeric.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0075-handle-file-program-extraction-from-cbdt-project?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">04 · Handle file program (extraction from CBDT project)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> A five-option file utility extracted from the CBDT project: check whether a path exists and whether it is a file or a directory, list every .java file in a folder, find files above a given size, append typed content to a file, and count the words in a text file — each option wrapped in exception handling for a missing path.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0076-building-module-csv-file-format?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">05 · Building module csv file format</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> Imports a CSV of ID/Name/Email/Phone/Address records, cleans up the Name field (collapsing extra whitespace and capitalizing each word) and the Address field (collapsing extra whitespace), then exports the cleaned data back out to a new CSV file.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0077-writing-module-to-list-and-search-file-by-content-cbdt-project?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">06 · Writing module to list and search file by content (CBDT project)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> Two file-search features from the CBDT project: count how many times a chosen word occurs inside a given text file, and list the names of every file in a folder whose content contains a chosen word.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0078-create-a-program-to-copy-file?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">07 · Create a program to copy file</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> Reads a config.properties file describing a source folder, a list of file types and a destination path; if the config file is missing, it prompts the user to enter and save one, validates that the source folder and destination are usable, and then copies the matching files from source to destination.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0079-create-a-program-to-zip-and-unzip-file-project-cbdt?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">08 · Create a program to zip and unzip file (project CBDT)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~182p</span> A zip/unzip utility from the CBDT project built on java.util.zip: compress the files in a chosen source folder into a named zip archive, or extract a chosen zip archive into a chosen destination folder.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0070-login-system-of-the-tien-phong-bank-s-ebank?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">09 · Login system of the Tien Phong Bank’s Ebank</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~210p</span> A bilingual Vietnamese/English login screen for Tien Phong Bank’s Ebank, extracted from the real project: it validates a 10-digit account number, a password of 8-31 alphanumeric characters, and a randomly generated captcha the user must re-type correctly, re-prompting with a localized error message on each invalid entry.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0071-task-management-program-of-ccrm-project?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">10 · Task management program of CCRM project</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~210p</span> A task manager for the CCRM project built around 4 fixed task types (Code/Test/Design/Review): add a task with an auto-incrementing ID, validating the task type, the date format, and that the planned start/end time falls in half-hour steps between 8:00 and 17:30; delete a task by ID; and list all tasks ordered by ID.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0072-write-a-login-function-uses-md5-encryption-for-passwords-separate-from-fpt-webmail-software-project?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">11 · Write a login function uses MD5 encryption for passwords (separate from FPT Webmail software Project</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~210p</span> An account system extracted from an FPT Webmail project, storing username, password, name, phone, email, address and date of birth with field validation (10-11 digit phone, valid email format, dd/MM/yyyy date), hashing the password with MD5 before storing it, and a login option that checks the stored hash and prints a personalized greeting.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0085-employee-management-system?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">12 · Employee management system</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~210p</span> A full CRUD console app over Employee records (ID, first/last name, phone, email, address, DOB, sex, salary, agency): add an employee while rejecting a duplicate ID, update or remove an employee found by ID, search employees by a partial name match, and sort the employee list by salary with a Comparator.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0015-asset-management-upgrade?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">13 · Asset Management- Upgrade</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~280p</span> The employee side of a two-program company asset-borrowing system (assets, employees, requests and borrows are stored in .dat files): after login, an employee can search assets by name, submit a borrow request, cancel a pending request, or return a borrowed asset, which updates the asset’s stock quantity. The brief calls for classes, abstract classes and interfaces with polymorphism.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0021-create-a-java-console-program-to-manage-students?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">14 · Create a Java console program to manage students</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~525p</span> An OOP console app that stores students (ID, name, semester, one of 3 fixed courses: Java, .Net, C/C++) in an ArrayList: create students in batches (asking whether to continue after every 10), find and sort students by name, update or delete a student located by ID, and print a report that groups each student’s total course count.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0022-create-a-java-console-program-to-manage-candidates-of-company?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">15 · Create a Java console program to manage Candidates of company</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~525p</span> Three candidate subtypes — Experience, Fresher, Intern — extend a shared Candidate class (ID, name, DOB, address, phone, email) and add their own fields (years of experience, graduation rank, internship semester); the program validates DOB, phone, email, years of experience and graduation rank formats, then supports creating each candidate type and searching candidates by first/last name plus type.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0023-create-a-java-console-program-to-manage-a-fruit-shop-product-and-shopping?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">16 · Create a Java console program to manage a Fruit Shop (Product and Shopping)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~525p</span> A two-sided Fruit Shop console app: the shop owner creates Fruit records (ID, name, price, quantity, origin) stored in an ArrayList, while a buyer browses the fruit list, picks an item and quantity, confirms the order and enters their name; each customer’s order is kept in a HashTable and can be reviewed on a view-orders screen listing quantity, price and amount per item.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0025-create-a-java-console-program-to-normalize-text?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">17 · Create a Java console program to normalize text</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~675p</span> Reads input.txt and rewrites it to output.txt applying a fixed set of text-cleanup rules: a single space between words, one space after commas/periods/colons with correct capitalization, no stray spaces around quoted phrases or before punctuation, a capitalized first word, no blank lines, and a trailing period — all wrapped in exception handling for file read/write errors.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0013-the-vehicle-management?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">18 · The Vehicle Management</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~750p</span> An OOP showroom app for two vehicle subtypes, Car and Motorbike (each with its own extra fields; Motorbike also overrides a makeSound method), loading and saving vehicles.txt and supporting add, update, delete, search by name (descending) or by ID, plus listing all vehicles either as stored or sorted descending by price.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0014-asset-management?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">19 · Asset Management</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~750p</span> The manager side of the same two-program asset system (asset.dat / employee.dat / request.dat / borrow.dat): after login, the manager can search assets by name, create or update an asset record, approve an employee’s borrow request — checking stock, moving the record from request.dat into borrow.dat and adjusting the quantity — and view the list of currently borrowed assets.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<div class="note-ct">Each exercise page above has a Video tutorial slot that is currently empty — it will be filled in later. No action is needed from you now; just work from the written brief, the reference solution, and the diagram already linked on each page.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Part 8 · Lesson 8.3</span>
<h2>Thực hành Khó — 19 bài</h2>
<p class="lead">Đây là 19 bài tập độ khó Khó (HARD) trong track thực hành Lab211 trên CodeLab — gồm các dự án OOP nhiều file, tiện ích xử lý file (File I/O) và các chương trình console mức độ ngang đề thi. Mỗi thẻ mở đề bài đầy đủ trên CodeLab, kèm lời giải tham khảo và sơ đồ lời giải.</p>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0011-change-base-number-system-16-10-2-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">01 · Change base number system (16, 10, 2) program</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> Chương trình lặp lại nhiều lần: người dùng chọn hệ cơ số đầu vào và đầu ra (nhị phân, thập phân hoặc hex), nhập một giá trị, chương trình in ra kết quả đã chuyển đổi, cho đến khi người dùng đóng chương trình.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0073-program-to-manage-expense-name-handy-expense?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">02 · Program to manage expense, name Handy Expense</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> Ứng dụng quản lý chi tiêu lưu vào file, tên Handy Expense: thêm một khoản chi với ID tự tăng, ngày, số tiền và nội dung; hiển thị toàn bộ danh sách chi tiêu kèm tổng cộng; và xoá một khoản chi theo ID, báo lỗi nếu ID không tồn tại.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0074-write-a-calculator-program-from-dcps-s-project?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">03 · Write a calculator program (from DCPS’s project)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> Máy tính ma trận theo dạng menu: người dùng nhập số hàng/cột và giá trị của hai ma trận, chương trình thực hiện phép cộng, trừ hoặc nhân trên hai ma trận đó, và cảnh báo nếu giá trị nhập vào không phải là số.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0075-handle-file-program-extraction-from-cbdt-project?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">04 · Handle file program (extraction from CBDT project)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> Tiện ích xử lý file gồm 5 lựa chọn, trích từ dự án CBDT: kiểm tra một đường dẫn có tồn tại hay không và là file hay thư mục, liệt kê mọi file .java trong một thư mục, tìm các file có kích thước lớn hơn một ngưỡng cho trước, thêm nội dung gõ từ bàn phím vào cuối một file, và đếm số từ trong một file văn bản — mỗi lựa chọn đều có xử lý ngoại lệ khi đường dẫn không tồn tại.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0076-building-module-csv-file-format?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">05 · Building module csv file format</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> Nhập một file CSV gồm các trường ID/Name/Email/Phone/Address, chuẩn hoá trường Name (gộp khoảng trắng thừa và viết hoa chữ cái đầu mỗi từ) và trường Address (gộp khoảng trắng thừa), sau đó xuất dữ liệu đã chuẩn hoá ra một file CSV mới.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0077-writing-module-to-list-and-search-file-by-content-cbdt-project?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">06 · Writing module to list and search file by content (CBDT project)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> Hai chức năng tìm kiếm theo nội dung file, trích từ dự án CBDT: đếm số lần một từ xuất hiện trong một file văn bản cho trước, và liệt kê tên tất cả các file trong một thư mục có nội dung chứa một từ cho trước.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0078-create-a-program-to-copy-file?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">07 · Create a program to copy file</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~140p</span> Đọc một file config.properties mô tả thư mục nguồn, danh sách loại file cần lấy và đường dẫn đích; nếu file cấu hình chưa có, chương trình yêu cầu người dùng nhập và lưu lại, kiểm tra thư mục nguồn và đích hợp lệ, rồi sao chép các file phù hợp từ nguồn sang đích.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0079-create-a-program-to-zip-and-unzip-file-project-cbdt?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">08 · Create a program to zip and unzip file (project CBDT)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~182p</span> Tiện ích nén/giải nén dùng gói java.util.zip, trích từ dự án CBDT: nén các file trong một thư mục nguồn thành một file zip có tên do người dùng đặt, hoặc giải nén một file zip vào một thư mục đích do người dùng chọn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0070-login-system-of-the-tien-phong-bank-s-ebank?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">09 · Login system of the Tien Phong Bank’s Ebank</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~210p</span> Màn hình đăng nhập song ngữ Việt/Anh cho Ebank của Tiên Phong Bank, trích từ dự án thật: kiểm tra số tài khoản đủ 10 chữ số, mật khẩu dài 8-31 ký tự có cả chữ và số, và mã captcha sinh ngẫu nhiên mà người dùng phải gõ lại đúng, mỗi lần nhập sai sẽ hiện lại thông báo lỗi theo đúng ngôn ngữ đã chọn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0071-task-management-program-of-ccrm-project?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">10 · Task management program of CCRM project</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~210p</span> Trình quản lý công việc cho dự án CCRM, xoay quanh 4 loại task cố định (Code/Test/Design/Review): thêm một task với ID tự tăng, kiểm tra loại task, định dạng ngày, và thời gian bắt đầu/kết thúc dự kiến phải rơi vào các mốc nửa giờ trong khoảng 8:00-17:30; xoá một task theo ID; và liệt kê toàn bộ task theo thứ tự ID.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0072-write-a-login-function-uses-md5-encryption-for-passwords-separate-from-fpt-webmail-software-project?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">11 · Write a login function uses MD5 encryption for passwords (separate from FPT Webmail software Project</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~210p</span> Hệ thống tài khoản trích từ một dự án FPT Webmail, lưu username, password, tên, số điện thoại, email, địa chỉ và ngày sinh với kiểm tra hợp lệ từng trường (điện thoại 10-11 số, email đúng định dạng, ngày theo dd/MM/yyyy), mã hoá mật khẩu bằng MD5 trước khi lưu, và một chức năng đăng nhập kiểm tra hash đã lưu rồi in lời chào theo tên đăng nhập.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0085-employee-management-system?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">12 · Employee management system</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~210p</span> Ứng dụng console CRUD đầy đủ trên bản ghi Employee (ID, họ tên, điện thoại, email, địa chỉ, ngày sinh, giới tính, lương, phòng ban): thêm nhân viên và từ chối ID trùng, cập nhật hoặc xoá nhân viên theo ID, tìm nhân viên theo một phần tên, và sắp xếp danh sách nhân viên theo lương bằng Comparator.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0015-asset-management-upgrade?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">13 · Asset Management- Upgrade</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~280p</span> Phía nhân viên của hệ thống mượn tài sản công ty gồm hai chương trình (tài sản, nhân viên, yêu cầu mượn và phiếu mượn được lưu trong các file .dat): sau khi đăng nhập, nhân viên có thể tìm tài sản theo tên, gửi yêu cầu mượn, huỷ một yêu cầu đang chờ, hoặc trả một tài sản đã mượn (cập nhật lại số lượng tồn kho). Đề bài yêu cầu dùng class, abstract class và interface có tính đa hình (polymorphism).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0021-create-a-java-console-program-to-manage-students?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">14 · Create a Java console program to manage students</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~525p</span> Ứng dụng console theo hướng OOP lưu sinh viên (ID, tên, học kỳ, một trong 3 khoá học cố định: Java, .Net, C/C++) trong một ArrayList: tạo sinh viên theo từng đợt (hỏi có tiếp tục hay không sau mỗi 10 sinh viên), tìm và sắp xếp sinh viên theo tên, cập nhật hoặc xoá một sinh viên tìm theo ID, và in báo cáo gộp tổng số khoá học theo từng sinh viên.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0022-create-a-java-console-program-to-manage-candidates-of-company?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">15 · Create a Java console program to manage Candidates of company</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~525p</span> Ba loại ứng viên — Experience, Fresher, Intern — kế thừa từ một lớp Candidate chung (ID, tên, ngày sinh, địa chỉ, điện thoại, email) và có thêm trường riêng (số năm kinh nghiệm, xếp loại tốt nghiệp, học kỳ thực tập); chương trình kiểm tra định dạng ngày sinh, điện thoại, email, số năm kinh nghiệm và xếp loại tốt nghiệp, sau đó cho phép tạo từng loại ứng viên và tìm kiếm theo họ/tên cùng loại ứng viên.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0023-create-a-java-console-program-to-manage-a-fruit-shop-product-and-shopping?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">16 · Create a Java console program to manage a Fruit Shop (Product and Shopping)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~525p</span> A two-sided Fruit Shop console app: the shop owner creates Fruit records (ID, name, price, quantity, origin) stored in an ArrayList, while a buyer browses the fruit list, picks an item and quantity, confirms the order and enters their name; each customer’s order is kept in a HashTable and can be reviewed on a view-orders screen listing quantity, price and amount per item.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0025-create-a-java-console-program-to-normalize-text?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">17 · Create a Java console program to normalize text</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~675p</span> Đọc file input.txt và ghi lại thành output.txt theo một bộ quy tắc chuẩn hoá văn bản cố định: chỉ một khoảng trắng giữa các từ, một khoảng trắng sau dấu phẩy/dấu chấm/dấu hai chấm kèm viết hoa đúng chỗ, không có khoảng trắng thừa quanh cụm trong ngoặc kép hay trước dấu câu, viết hoa chữ đầu tiên, không có dòng trống, và có dấu chấm kết thúc văn bản — tất cả đều có xử lý ngoại lệ khi đọc/ghi file.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0013-the-vehicle-management?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">18 · The Vehicle Management</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~750p</span> Ứng dụng showroom theo hướng OOP cho hai loại phương tiện, Car và Motorbike (mỗi loại có thêm trường riêng; Motorbike còn có hàm makeSound riêng), đọc/ghi file vehicles.txt và hỗ trợ thêm, sửa, xoá, tìm theo tên (giảm dần) hoặc theo ID, cùng với hiển thị toàn bộ danh sách phương tiện theo thứ tự gốc hoặc sắp xếp giảm dần theo giá.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0014-asset-management?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">19 · Asset Management</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~750p</span> Phía quản lý của cùng hệ thống tài sản gồm hai chương trình (asset.dat / employee.dat / request.dat / borrow.dat): sau khi đăng nhập, quản lý có thể tìm tài sản theo tên, tạo hoặc cập nhật một bản ghi tài sản, duyệt yêu cầu mượn của nhân viên — kiểm tra tồn kho, chuyển bản ghi từ request.dat sang borrow.dat và cập nhật số lượng — và xem danh sách các tài sản đang được mượn.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<div class="note-ct">Mỗi trang bài tập ở trên có một chỗ dành cho Video hướng dẫn hiện đang để trống — sẽ được bổ sung sau. Bạn không cần làm gì thêm; cứ dựa vào đề bài, lời giải tham khảo và sơ đồ đã có sẵn trên từng trang.</div>
</div>
`,
        },
      ],
    },
  ],
};
