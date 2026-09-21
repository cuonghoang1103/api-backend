/**
 * LAB211 — OOP with Java Lab (Thực hành OOP với Java). Kỳ 3.
 * Bám syllabus FPTU (LAB211, sylID 10021): môn THỰC HÀNH THUẦN, tiên quyết PRO192,
 * 3 CLO (kỹ năng Java cơ bản · tự làm assignment nhỏ · debug), 60 session Practice/Mentor-review.
 * Đây là môn ~80% SV TRƯỢT lần đầu → khóa học thiết kế như BỘ DẪN ĐƯỜNG CHỐNG TRƯỢT:
 * dạy sâu kiến trúc + kỹ năng, rồi dẫn học viên luyện qua track Code Lab `lab211`
 * (54 đề thật theo LOC + 4 module tra cứu: assignments 847, api-ref 855, algo-ref 856,
 * error-handbook 857 + AI coach vấn đáp). Mỗi bài link deep tới đúng đề/luyện.
 * Song ngữ EN/VN realtime (.ml-en / .ml-vi, tiêu đề EN|||VI). Code Java: <pre><code class="language-java">
 * (trang học tự tô màu + nút chép), kết quả chạy trong .out. Mọi code mẫu theo tờ Coding check sheet
 * của thầy + MVC trong Guide (repository bắt buộc, View nhận ResponseDTO) — lấy từ lời giải chuẩn đã soát.
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
    shortDescription: 'A course many students retake — not because it is hard, but because it is typing under pressure. This guide drives you through 54 real FPTU lab briefs, the standard architecture, the review traps, and a plan for working to time.|||Môn nhiều sinh viên phải học lại — không phải vì khó, mà vì phải gõ code dưới áp lực. Khóa này dẫn bạn qua 54 đề lab FPTU thật, kiến trúc chuẩn, các bẫy khi bị review, và kế hoạch làm bài đúng giờ.',
    description: 'Môn thực hành lập trình Java, tiên quyết PRO192. Không có bài giảng lý thuyết — 60 session là 4 buổi định hướng rồi Practice xen kẽ Mentor review. Syllabus LAB211 liệt kê 0 thành phần đánh giá: không thi lý thuyết, không thi cuối kỳ, không trọng số, không điểm qua; quy tắc chấm nằm ở tài liệu mentor và FLM của từng kỳ. Cái syllabus có quy định là: mỗi assignment phải làm LIÊN TỤC trong thời gian quy định, và phải dự ≥80% slot. Vì vậy thứ quyết định là GÕ THÀNH THẠO dưới áp lực: chương trình Java CHẠY ĐƯỢC, khớp output mẫu, xong trong một buổi — và code qua được buổi review theo tờ Coding check sheet 25 mục của thầy. Khóa học dạy sâu kiến trúc MVC theo Guide của thầy (repository bắt buộc, View nhận ResponseDTO), tờ check sheet và kỹ năng, rồi dẫn bạn luyện qua 54 đề thật trên Code Lab.',
    whatYouLearn: 'Kiến trúc MVC theo Guide của thầy — constants · model · dto · repository (bắt buộc ở mọi bài) · service · controller · view nhận ResponseDTO qua thuộc tính · utils · main — đúng mục 1.1 tờ Coding check sheet; tờ check sheet 25 mục và quy trình tự soát 3 lượt trước khi xin review; nhập liệu an toàn: Main đọc, utils/Validation kiểm; xuất đúng định dạng khớp màn hình chấm (chỉ View in, nhãn trong Message, định dạng trong Constants); sắp xếp & tìm kiếm; validation & ngoại lệ theo Guidelines; xử lý ngày giờ (bẫy lenient); CRUD + Collections + Comparator; OOP trong model; đọc/ghi tệp qua utils/FileUtils (text/CSV/zip); kịch bản làm bài trong một buổi + quản lý thời gian; sổ tay lỗi 60 giây; các bẫy khi bị review; vấn đáp "đổi yêu cầu"; quy ước code: đặt tên, comment, tối đa 100 ký tự/dòng.',
    requirements: 'Tiên quyết: đạt PRO192 (vững lớp/đối tượng, kế thừa, đa hình, ngoại lệ, collections trong Java). Cần cài JDK 8 + NetBeans 8.0.2 + plugin CheckStyle.',
    documentsNote: 'Học liệu FPT: Lab Room Regulations, Mentor Guide, Evaluation Templates. Công cụ bắt buộc: NetBeans 8.0.2, JDK8, plugin CheckStyle, JavaDoc. Luyện tập chính: track Code Lab "LAB211" — 54 đề lab gốc FPTU đã có lời giải kiểm chạy thật + 4 module tra cứu + AI coach. Kèm file syllabus gốc LAB211.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, syllabus nói gì về đánh giá, vì sao sinh viên trượt và cách thoát, công cụ, và cách dùng khóa học này.',
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
<p class="lead">PRO192 taught you to <em>think</em> in objects. LAB211 makes you <strong>fast</strong> at it. There are no lectures here — the official syllabus is 4 orientation sessions and then 56 sessions of <strong>Practice</strong> alternating with <strong>Mentor review</strong>, nothing else. It also lists <strong>no assessment at all</strong> — no exam, no weights, no pass mark (see Lesson 0.2). What it does demand is two things: given a fresh problem, can you write a Java console program that <strong>compiles, runs, and prints exactly the expected output</strong> — inside a defined time, alone — and does its code <strong>pass your teacher's review on the paper Coding check sheet</strong> (25 items: the Guide's MVC, names, comments, formatting; one item not OK and the review is rejected).</p>
<p>That is why LAB211 is a course many students end up retaking. It is not conceptually hard. It punishes anyone who "understands Java" but has never built 40 small programs end to end. The cure is simple and this course delivers it: a lot of guided, deliberate practice on <strong>real FPTU lab briefs</strong>.</p>
<h3>The study map</h3>
<div class="lz-map">
  <div class="lz-stage">Set the stage</div>
  <div class="lz-node"><div class="lz-badge">0</div><div class="lz-nbody"><div class="lz-ntitle">How you are judged &amp; why students fail</div><div class="lz-nsub">What the syllabus says · the plan · tools</div></div></div>
  <div class="lz-stage">Non-negotiable foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">The Guide's MVC architecture</div><div class="lz-nsub">constants · model · dto · repository · service · controller · view · utils · main</div></div></div>
  <div class="lz-stage">Build fluency on real briefs</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Warm-up: small problems</div><div class="lz-nsub">Sorting · searching · strings</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Validation · dates · numbers</div><div class="lz-nsub">Message-by-the-spec · lenient trap</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">CRUD · Collections · Comparator</div><div class="lz-nsub">The backbone of LAB211</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">OOP models &amp; File I/O</div><div class="lz-nsub">Inheritance · serialize · CSV · zip</div></div></div>
  <div class="lz-stage">Finish inside the clock</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Surviving a timed lab sitting</div><div class="lz-nsub">Time plan · error handbook · the 25-item check sheet · viva</div></div></div>
  <div class="lz-stage">The review gate &amp; beyond</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Code convention (required) · cost of algorithms · write your own brief</div><div class="lz-nsub">The check sheet rule by rule, then the extras</div></div></div>
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
<p class="lead">PRO192 dạy bạn <em>tư duy</em> bằng đối tượng. LAB211 rèn cho bạn <strong>làm nhanh</strong>. Ở đây không có bài giảng — syllabus chính thức là 60 session <strong>Practice</strong> và <strong>Mentor review</strong>, không gì khác. Bạn được đánh giá ở hai điều: cho một đề mới, bạn có viết được chương trình Java console <strong>biên dịch được, chạy được, và in ĐÚNG output mẫu</strong> — trong thời gian giới hạn, tự làm một mình — hay không; và code đó có <strong>qua được buổi review theo tờ giấy Coding check sheet của thầy</strong> không (25 mục: MVC theo Guide, đặt tên, comment, trình bày; một mục chưa đạt là bị reject).</p>
<p>Đó là lý do LAB211 là môn nhiều sinh viên trượt lần đầu nhất. Nó không khó về khái niệm. Nó "trừng phạt" bất cứ ai "hiểu Java" nhưng chưa từng viết trọn vẹn 40 chương trình nhỏ từ đầu tới cuối. Thuốc chữa rất đơn giản và khóa này trao cho bạn: luyện tập có chủ đích, có dẫn dắt trên <strong>đề lab FPTU thật</strong>.</p>
<h3>Bản đồ học</h3>
<div class="lz-map">
  <div class="lz-stage">Chuẩn bị tâm thế</div>
  <div class="lz-node"><div class="lz-badge">0</div><div class="lz-nbody"><div class="lz-ntitle">Vì sao trượt &amp; cách thoát</div><div class="lz-nsub">Cách chấm · kỳ thi · kế hoạch · công cụ</div></div></div>
  <div class="lz-stage">Nền tảng không thể bỏ</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Kiến trúc MVC theo Guide</div><div class="lz-nsub">constants · model · dto · repository · service · controller · view · utils · main</div></div></div>
  <div class="lz-stage">Rèn phản xạ trên đề thật</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Khởi động: bài nhỏ</div><div class="lz-nsub">Sắp xếp · tìm kiếm · chuỗi</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Validation · ngày · số</div><div class="lz-nsub">Thông báo theo đề · bẫy lenient</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">CRUD · Collections · Comparator</div><div class="lz-nsub">Xương sống của LAB211</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">OOP trong model &amp; Tệp</div><div class="lz-nsub">Kế thừa · serialize · CSV · zip</div></div></div>
  <div class="lz-stage">Làm xong trong giờ</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Sống sót thi thực hành</div><div class="lz-nsub">Kế hoạch thời gian · sổ tay lỗi · tờ check sheet 25 mục · vấn đáp</div></div></div>
  <div class="lz-stage">Cửa review &amp; nâng cao</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Quy ước code (bắt buộc) · chi phí thuật toán · tự ra đề</div><div class="lz-nsub">Tờ check sheet từng luật, rồi phần nâng cao</div></div></div>
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
          title: '0.2 — How LAB211 is judged, and why students fail|||0.2 — LAB211 được đánh giá thế nào, và vì sao sinh viên trượt',
          slug: 'lab211-vi-sao-truot',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Syllabus nói gì (và KHÔNG nói gì) về điểm, cách chấm thực hành, tờ Coding check sheet thầy dùng để review code, sáu nguyên nhân trượt thật, và chiến lược thoát.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>How LAB211 is judged — and why students fail</h2>
<p class="lead">Read this lesson twice. LAB211 is judged on <strong>working code produced under time pressure</strong> and on a <strong>line-by-line review of that code against your teacher's Coding check sheet</strong> — and it fails students for predictable, avoidable reasons.</p>
<h3>What the syllabus actually says about grading</h3>
<p>Be clear about this, because it is unusual: the LAB211 syllabus (ID 10021) lists <strong>“0 assessment(s)”</strong>. There is <strong>no assessment table, no component weights, no scoring scale and no MinAvgMarkToPass field</strong> — and no final exam of any kind, written or practical. Every other subject's syllabus has that table; this one does not.</p>
<p>What the syllabus <em>does</em> state is the shape of the work: 60 sessions that alternate <strong>Practice</strong> and <strong>Mentor review</strong>, the rule that <q>each assignment must be completed continuously in the defined time</q>, and the requirement to attend <strong>at least 80% of contact slots “in order to be accepted to the final results”</strong>. The grading rules themselves live in the mentor-only materials (<em>Mentor guide for Lab</em>, <em>Evaluation Templates</em>) and on the FLM.</p>
<div class="callout warn"><span class="badge">Where the real numbers are</span> Because the syllabus publishes none, take the weights, the pass mark and the exact exam arrangement for <em>your</em> term from the FLM course page and from your mentor in the first slots. Anything you read elsewhere — including the exam walkthrough later in this course — is <strong>common practice, not an official rule</strong>.</div>
<div class="callout danger"><span class="badge">What your teacher does use</span> Every review is done with a paper <b>Coding check sheet</b>: 25 items in three groups — <b>Common</b> (the Guide's MVC with a mandatory repository, names, comments), <b>Coding convention</b> (braces, lines of at most 100 characters, declarations at the top of a block, blank lines, Constants/Message) and <b>Performance</b> (brackets around comparisons, final class + private constructor, equals, StringBuilder…). You write "O" beside every item that is OK, in up to three self-check passes; only when a whole column is "O" do you ask for the review — and one item not OK means rejected. Lesson 6.3 reproduces the sheet; Lesson 1.1 teaches its first and biggest item.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h contact + 105h self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">Pass PRO192</span></div>
  <div class="kv"><span class="k">Format</span><span class="v">60 sessions <small>4 Orientation, then 28 Practice + 28 Mentor review</small></span></div>
  <div class="kv"><span class="k">Eligibility</span><span class="v">Attend ≥ 80% of contact slots</span></div>
  <div class="kv"><span class="k">Assessment in syllabus</span><span class="v">None listed <small>no exam, no weights, no pass mark</small></span></div>
</div>
<h3>The six real reasons students fail</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1 · "I understand it" is not "I can type it."</b> You read the solution, it makes sense, you move on. In a timed lab slot your fingers are slow and you run out of time. Fluency only comes from writing programs yourself, many times.</div>
  <div class="lz-layer"><b>2 · Output does not match to the character.</b> Your reviewer compares screens exactly. A missing space in <span class="badge">%-15s</span>, a wrong label, <span class="badge">"Area: "</span> vs <span class="badge">"Area:"</span> — all count as wrong even if the logic is perfect.</div>
  <div class="lz-layer"><b>3 · The program crashes on bad input.</b> No input validation → the reviewer types a letter where a number is expected → <span class="badge">InputMismatchException</span> → zero for that run.</div>
  <div class="lz-layer"><b>4 · It does not compile / does not run.</b> One missing <span class="badge">import</span>, one unclosed brace, and the whole file scores nothing. Compiling is not optional; it is the gate.</div>
  <div class="lz-layer"><b>5 · Panic and no plan.</b> Students freeze at a blank NetBeans project. Without a fixed order of attack, 60 minutes vanish on the first feature.</div>
  <div class="lz-layer"><b>6 · The code review rejects it.</b> The output is perfect, but the controller prints, there is no repository, a method has no comment, a list is called <span class="badge">students</span> instead of <span class="badge">studentList</span>, a line runs past 100 characters. One item of the check sheet not OK = rejected. Build on the Guide's MVC from the first line and self-review with the sheet before you ask.</div>
</div>
<h3>The strategy that works</h3>
<div class="lz-flow">
  <div class="lz-step">Master the Guide's MVC (Lesson 1.1) so you never think about structure</div>
  <div class="lz-step">Solve real briefs by LOC, easy → hard, until patterns are reflex</div>
  <div class="lz-step">Always validate input &amp; copy output labels exactly</div>
  <div class="lz-step">Self-review with the 25-item check sheet before every review</div>
  <div class="lz-step">Rehearse the exam: fixed time, fixed order, compile early &amp; often</div>
</div>
<div class="callout danger">The single biggest mistake: reading solutions instead of writing them. If you can only do one thing from this course, do this — solve every Code Lab brief yourself first, <em>then</em> compare with the reference solution.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>LAB211 được đánh giá thế nào — và vì sao sinh viên trượt</h2>
<p class="lead">Đọc bài này hai lần. LAB211 đánh giá trên <strong>code chạy được viết dưới áp lực thời gian</strong> và trên <strong>buổi review từng dòng code đó theo tờ Coding check sheet của thầy</strong> — và nó đánh trượt sinh viên vì những lý do đoán trước được, tránh được.</p>
<h3>Syllabus thực sự nói gì về điểm</h3>
<p>Phải nói rõ vì đây là trường hợp bất thường: syllabus LAB211 (ID 10021) ghi <strong>“0 assessment(s)”</strong>. <strong>Không có bảng đánh giá, không trọng số thành phần, không thang điểm, không có trường MinAvgMarkToPass</strong> — và không có kỳ thi cuối kỳ nào, dù lý thuyết hay thực hành. Mọi môn khác đều có bảng đó; môn này thì không.</p>
<p>Cái syllabus <em>có</em> nói là hình dạng công việc: 60 session xen kẽ <strong>Practice</strong> và <strong>Mentor review</strong>, quy định <q>mỗi assignment phải được hoàn thành liên tục trong thời gian quy định</q>, và yêu cầu dự <strong>tối thiểu 80% slot “để được chấp nhận vào kết quả cuối cùng”</strong>. Bản thân quy tắc chấm nằm trong tài liệu chỉ dành cho mentor (<em>Mentor guide for Lab</em>, <em>Evaluation Templates</em>) và trên FLM.</p>
<div class="callout warn"><span class="badge">Số thật nằm ở đâu</span> Vì syllabus không công bố, hãy lấy trọng số, điểm qua và cách tổ chức thi của <em>kỳ bạn học</em> từ trang FLM của môn và từ mentor trong những slot đầu. Mọi thứ bạn đọc ở chỗ khác — kể cả phần hướng dẫn thi ở cuối khóa này — là <strong>thông lệ phổ biến, không phải quy định chính thức</strong>.</div>
<div class="callout danger"><span class="badge">Thứ thầy thật sự dùng</span> Mọi buổi review đều dùng tờ giấy <b>Coding check sheet</b>: 25 mục chia ba nhóm — <b>Common</b> (MVC theo Guide với repository bắt buộc, đặt tên, comment), <b>Coding convention</b> (ngoặc, mỗi dòng tối đa 100 ký tự, khai báo đầu block, dòng trống, Constants/Message) và <b>Performance</b> (ngoặc quanh phép so sánh, class final + constructor private, equals, StringBuilder…). Bạn tự điền "O" cạnh mục nào đã OK, tối đa ba lượt tự soát; chỉ khi cả cột đều là "O" mới xin thầy review — và một mục chưa đạt là bị reject. Bài 6.3 chép lại tờ giấy; Bài 1.1 dạy mục đầu tiên và lớn nhất của nó.</div>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h trên lớp + 105h tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Đạt PRO192</span></div>
  <div class="kv"><span class="k">Hình thức</span><span class="v">60 session <small>4 Orientation, rồi 28 Practice + 28 Mentor review</small></span></div>
  <div class="kv"><span class="k">Điều kiện</span><span class="v">Dự ≥ 80% slot</span></div>
  <div class="kv"><span class="k">Đánh giá trong syllabus</span><span class="v">Không liệt kê <small>không thi, không trọng số, không điểm qua</small></span></div>
</div>
<h3>Sáu lý do thật khiến sinh viên trượt</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1 · "Hiểu rồi" khác "gõ được".</b> Bạn đọc lời giải, thấy hợp lý, rồi bỏ qua. Trong một slot lab bấm giờ, tay bạn chậm và hết giờ. Phản xạ chỉ đến từ việc TỰ viết chương trình, nhiều lần.</div>
  <div class="lz-layer"><b>2 · Output lệch tới từng ký tự.</b> Người review so màn hình y hệt. Thiếu một dấu cách ở <span class="badge">%-15s</span>, sai một nhãn, <span class="badge">"Area: "</span> vs <span class="badge">"Area:"</span> — đều bị tính sai dù logic hoàn hảo.</div>
  <div class="lz-layer"><b>3 · Chương trình sập với dữ liệu xấu.</b> Không validate → người review gõ chữ vào chỗ cần số → <span class="badge">InputMismatchException</span> → 0 điểm lần chạy đó.</div>
  <div class="lz-layer"><b>4 · Không biên dịch / không chạy được.</b> Thiếu một <span class="badge">import</span>, thiếu một ngoặc, cả file 0 điểm. Biên dịch được không phải tùy chọn; nó là cửa ải.</div>
  <div class="lz-layer"><b>5 · Hoảng và không có kế hoạch.</b> Sinh viên đơ trước project NetBeans trống. Không có thứ tự tấn công cố định, 60 phút bốc hơi ở chức năng đầu tiên.</div>
  <div class="lz-layer"><b>6 · Buổi review code reject.</b> Output hoàn hảo, nhưng controller tự in, không có repository, một method thiếu comment, danh sách đặt tên <span class="badge">students</span> thay vì <span class="badge">studentList</span>, một dòng dài quá 100 ký tự. Một mục trên tờ check sheet chưa đạt = bị reject. Dựng theo MVC của Guide ngay từ dòng đầu và tự soát theo tờ giấy trước khi xin review.</div>
</div>
<h3>Chiến lược có hiệu quả</h3>
<div class="lz-flow">
  <div class="lz-step">Thuộc kiến trúc MVC theo Guide (Bài 1.1) để không bao giờ phải nghĩ về cấu trúc</div>
  <div class="lz-step">Giải đề thật theo LOC, dễ → khó, tới khi mẫu hình thành phản xạ</div>
  <div class="lz-step">Luôn validate input &amp; chép nhãn output y nguyên</div>
  <div class="lz-step">Tự soát theo tờ check sheet 25 mục trước mỗi lần xin review</div>
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
  <div class="lz-layer"><b>Input</b> — Scanner (in Main only), the <span class="badge">nextInt()/nextLine()</span> trap, a reusable <span class="badge">utils/Validation</span> for numbers, strings, ranges, dates.</div>
  <div class="lz-layer"><b>Output</b> — <span class="badge">printf</span>, <span class="badge">%-15s</span>, <span class="badge">%.2f</span>, String.format; matching a screen exactly.</div>
  <div class="lz-layer"><b>Data</b> — arrays, ArrayList, LinkedHashMap, HashMap; Comparator &amp; sorting objects.</div>
  <div class="lz-layer"><b>Logic</b> — sorting (bubble/selection/insertion/quick/merge), linear &amp; binary search, base conversion, recursion.</div>
  <div class="lz-layer"><b>OOP</b> — model classes (getters/setters, toString), inheritance &amp; polymorphism, abstract/interface.</div>
  <div class="lz-layer"><b>Files</b> — read/write text, object serialization, CSV, copy &amp; zip; the byte-vs-char trap.</div>
  <div class="lz-layer"><b>Robustness</b> — validation that never crashes, exceptions with messages taken from the brief.</div>
  <div class="lz-layer"><b>Structure &amp; convention</b> — the Guide's MVC (a repository in every brief, a view fed by a ResponseDTO) and the 25 items of the Coding check sheet: names, comments, formatting, Constants/Message.</div>
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
  <div class="lz-layer"><b>Nhập</b> — Scanner (chỉ ở Main), bẫy <span class="badge">nextInt()/nextLine()</span>, một <span class="badge">utils/Validation</span> tái dùng cho số, chuỗi, khoảng, ngày.</div>
  <div class="lz-layer"><b>Xuất</b> — <span class="badge">printf</span>, <span class="badge">%-15s</span>, <span class="badge">%.2f</span>, String.format; khớp màn hình y hệt.</div>
  <div class="lz-layer"><b>Dữ liệu</b> — mảng, ArrayList, LinkedHashMap, HashMap; Comparator &amp; sắp xếp đối tượng.</div>
  <div class="lz-layer"><b>Logic</b> — sắp xếp (bubble/selection/insertion/quick/merge), tìm tuyến tính &amp; nhị phân, đổi hệ cơ số, đệ quy.</div>
  <div class="lz-layer"><b>OOP</b> — lớp model (getter/setter, toString), kế thừa &amp; đa hình, abstract/interface.</div>
  <div class="lz-layer"><b>Tệp</b> — đọc/ghi text, serialize đối tượng, CSV, copy &amp; zip; bẫy byte-vs-char.</div>
  <div class="lz-layer"><b>Bền bỉ</b> — validate không bao giờ sập, ngoại lệ với thông báo lấy từ đề.</div>
  <div class="lz-layer"><b>Cấu trúc &amp; quy ước</b> — MVC theo Guide (bài nào cũng có repository, view nhận ResponseDTO) và 25 mục của tờ Coding check sheet: đặt tên, comment, trình bày, Constants/Message.</div>
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
<div class="callout warn">CheckStyle is one of the tools the syllabus requires (with NetBeans 8.0.2, JDK8 and JavaDoc). Your teacher reviews your code with a paper <b>Coding check sheet</b> (25 items — Lesson 6.3), and one item that is not OK rejects the review. CheckStyle and the NetBeans formatter (Alt+Shift+F) catch part of it — names, braces, long lines — so set them up now and let them flag problems while you practise.</div>
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
<div class="callout warn">CheckStyle là một trong những công cụ syllabus yêu cầu (cùng NetBeans 8.0.2, JDK8 và JavaDoc). Thầy review code của bạn bằng tờ giấy <b>Coding check sheet</b> (25 mục — Bài 6.3), và một mục chưa đạt là buổi review bị reject. CheckStyle và bộ định dạng của NetBeans (Alt+Shift+F) bắt được một phần — tên, ngoặc, dòng quá dài — nên hãy cài ngay để chúng báo lỗi trong lúc bạn luyện.</div>
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
  <div class="lz-step">Run against the expected screen · fix until it matches · self-review with the check sheet</div>
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
  <div class="lz-step">Chạy đối chiếu màn hình mẫu · sửa tới khi khớp · tự soát theo tờ check sheet</div>
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
              { question: 'LAB211 is graded mainly on…|||LAB211 chấm chủ yếu dựa trên…', options: ['a written theory exam|||một bài thi lý thuyết viết', 'working code produced under time pressure, reviewed against the Coding check sheet|||code chạy được viết dưới áp lực thời gian, được review theo tờ Coding check sheet', 'attendance only|||chỉ điểm danh', 'group presentations|||thuyết trình nhóm'], correctIndex: 1, points: 1 },
              { question: 'The prerequisite for LAB211 is…|||Tiên quyết của LAB211 là…', options: ['PRF192', 'PRO192', 'CSD201', 'none|||không có'], correctIndex: 1, points: 1 },
              { question: 'The single biggest cause of failing is…|||Nguyên nhân trượt lớn nhất là…', options: ['not memorising theory|||không thuộc lý thuyết', 'reading solutions instead of writing them|||đọc lời giải thay vì tự viết', 'using NetBeans|||dùng NetBeans', 'validating input|||validate input'], correctIndex: 1, points: 1 },
              { question: 'Your teacher accepts a program only when…|||Thầy chỉ chấp nhận một chương trình khi…', options: ['it compiles, whatever the code looks like|||nó biên dịch được, code viết sao cũng được', 'its output matches the brief AND its code passes every item of the Coding check sheet|||output khớp đề VÀ code đạt mọi mục của tờ Coding check sheet', 'it has as many comments as possible|||có càng nhiều comment càng tốt', 'the file is small|||tệp nhỏ'], correctIndex: 1, points: 1 },
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
      description: 'Ba thứ phải thành phản xạ trước khi luyện đề: kiến trúc MVC theo Guide của thầy (mục 1.1 tờ Coding check sheet), nhập liệu an toàn (Main đọc, Validation kiểm), và xuất đúng định dạng (chỉ View in, chữ nằm trong Message/Constants).',
      lessons: [
        {
          title: '1.1 — The MVC architecture of the Guide|||1.1 — Kiến trúc MVC theo Guide của thầy',
          slug: 'lab211-kien-truc-phan-tang',
          type: 'VIDEO',
          description: 'MVC theo Guide của thầy: constants · model · dto · repository (bắt buộc) · service · controller · view nhận ResponseDTO · utils · main — trách nhiệm từng tầng đúng mục 1.1 tờ Coding check sheet.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 1 · Lesson 1.1</span>
<h2>The teacher's MVC architecture — one shape for every brief</h2>
<p class="lead">Every LAB211 program you hand in has the same shape: the MVC of the teacher's <strong>Guide</strong> (the Guide.xlsx sample project), checked by item <strong>1.1</strong> of the paper <strong>Coding check sheet</strong>. It is the same shape for a 50-line bubble sort and for a 500-line asset system. Learn it once and you never waste lab time on "where does this code go" — and no review gets rejected for it.</p>
<div class="callout danger"><b>A repository in every brief — no exceptions.</b> The check sheet prints it in bold: <q>Bắt buộc phải có repository</q> ("a repository is mandatory"). A sorting brief keeps its array in a repository; a management brief keeps its list there. There is no "small program that needs no layers".</div>
<h3>The packages — what each one does, and what it must never do</h3>
<table>
  <thead><tr><th>Package</th><th>Its job (Guide)</th><th>Never here</th></tr></thead>
  <tbody>
    <tr><td><b>constants</b><br><small>Constants.java · Message.java</small></td><td>Every number and format string (Constants) and every message and label (Message): <code>public static final</code>, UPPER_SNAKE names. The class is <code>final</code> with a private constructor.</td><td>a message typed straight into another class</td></tr>
    <tr><td><b>model</b></td><td>Describes one thing: private fields, constructors, getters/setters, and <code>toString()</code> when its text must be shown.</td><td>Scanner, print, <code>static</code></td></tr>
    <tr><td><b>dto</b><br><small>XxxRequestDTO · XxxResponseDTO</small></td><td>The RequestDTO carries what the user typed from Main into the controller (it may travel on to the service or repository). The ResponseDTO carries what the view will show.</td><td>logic</td></tr>
    <tr><td><b>repository</b> — <b>mandatory</b></td><td>Holds the data (the list, the map, the array) and simple CRUD on it. A broken rule is thrown as <code>new Exception(Message.X)</code>.</td><td>calculations, print, keyboard</td></tr>
    <tr><td><b>service</b> — when there is business</td><td>Calculations: totals, perimeter and area, statistics, reports, the sorting algorithm, checking a login. It sits between controller and repository and may use the model.</td><td>input, print, the view</td></tr>
    <tr><td><b>controller</b></td><td>Receives the RequestDTO from Main, calls the service or repository, puts the answer in a ResponseDTO, hands it to the view and calls <code>display()</code> <b>once</b>. Not static.</td><td>Scanner, print, the model</td></tr>
    <tr><td><b>view</b></td><td>Keeps the ResponseDTO in an <b>attribute</b> (set through a setter); <code>display()</code> takes <b>no parameter</b> and prints it.</td><td>data passed through <code>display(...)</code> parameters; a second render in the same flow</td></tr>
    <tr><td><b>utils</b><br><small>Validation · FileUtils · MD5Utils…</small></td><td>Shared <code>static</code> helpers: check a typed line, read or write a file, hash a password. <code>final</code> class, private constructor.</td><td>Scanner, print</td></tr>
    <tr><td><b>main</b><br><small>Main.java</small></td><td>The workflow: prints the menu and the prompts, reads with Scanner, checks with Validation, reads files and hashes through utils, fills the RequestDTO, calls the controller <b>once per menu case</b>, and prints <code>e.getMessage()</code> when a rule is broken.</td><td>the model, the view, static variables</td></tr>
  </tbody>
</table>
<h3>One menu option, end to end</h3>
<div class="lz-flow">
  <div class="lz-step">Main prints the menu and each prompt, and reads a whole line with Scanner</div>
  <div class="lz-step">utils/Validation checks the line; if it throws, Main prints why and asks again</div>
  <div class="lz-step">Main fills a RequestDTO and calls the controller — once for this case</div>
  <div class="lz-step">Controller → Service → Repository → Model</div>
  <div class="lz-step">Controller: view.setResponseDTO(responseDTO); view.display(); — one render for the whole flow</div>
</div>
<p>A broken rule travels back the other way: the repository (or the service, or the controller) throws <code>new Exception(Message.X)</code>, and the <code>catch</code> in Main prints <code>e.getMessage()</code> — exactly as the teacher's sample Main does. The view is never called to print an error.</p>
<h3>The teacher's sample, file by file (Doctor management, P0055)</h3>
<pre>src/
├── constants/   Constants.java · Message.java
├── model/       Doctor.java
├── dto/         DoctorRequestDTO.java · DoctorResponseDTO.java
├── repository/  DoctorRepository.java      ← the brief's "DoctorHash"
├── controller/  DoctorController.java
├── view/        DoctorView.java
├── utils/       Validation.java
└── main/        Main.java</pre>
<p>There is no <b>service</b> here: add, update, delete and search are simple CRUD, so the controller talks straight to the repository. The bubble-sort brief (P0001) is the opposite case — sorting is business, so <code>SortService</code> takes the array from <code>NumberRepository</code> and sorts it. The sheet's own words: if there is business calculation, add Services and keep the chain <b>Controller ↔ Services ↔ Repository ↔ Model</b>.</p>
<h3>The part most students get wrong: the view</h3>
<p>The view does not receive the data as a parameter. It keeps a ResponseDTO in a field; the controller sets it, then calls <code>display()</code> with no argument — the Guide's own sample does exactly this. The ResponseDTO and the view of the sample:</p>
<pre><code class="language-java">package dto;

import java.util.LinkedHashMap;

/**
 * DTO carrying the answer of one menu option FROM the controller OUT TO the view - a
 * JavaBean (private fields, public no-argument constructor, getters/setters). Add, update
 * and delete fill the message; search fills the doctor map.
 *
 * @author HE176322
 */
public class DoctorResponseDTO {

    // The one-line result, e.g. "Add doctor successfully."; null for a search.
    private String message;

    // The doctors a search found: code -&gt; table row (the text of Doctor.toString()); null
    // when the answer is a message, empty when nobody matched.
    private LinkedHashMap&lt;String, String&gt; doctorMap;

    // JavaBean constructor: an empty answer, filled through the setters.
    public DoctorResponseDTO() {
    }

    // Returns the one-line result.
    public String getMessage() {
        return message;
    }

    // Sets the one-line result.
    public void setMessage(String message) {
        this.message = message;
    }

    // Returns the doctors found.
    public LinkedHashMap&lt;String, String&gt; getDoctorMap() {
        return doctorMap;
    }

    // Sets the doctors found.
    public void setDoctorMap(LinkedHashMap&lt;String, String&gt; doctorMap) {
        this.doctorMap = doctorMap;
    }
}</code></pre>
<pre><code class="language-java">package view;

import constants.Constants;
import constants.Message;
import dto.DoctorResponseDTO;

/**
 * VIEW: the only place (with main) allowed to print results. It receives the data through
 * its attribute (the ResponseDTO, as in the Guide sample), never through the parameters of
 * display().
 *
 * @author HE176322
 */
public class DoctorView {

    // The answer to print, handed over by the controller.
    private DoctorResponseDTO responseDTO;

    // Receives the answer the next display() call will print.
    public void setResponseDTO(DoctorResponseDTO responseDTO) {
        this.responseDTO = responseDTO;
    }

    // Prints what the controller set: the one-line result of add/update/delete, or the
    // search result.
    public void display() {
        // add, update and delete answer with one line
        if (responseDTO.getMessage() != null) {
            System.out.println(responseDTO.getMessage());
        }

        // a search answers with its result
        if (responseDTO.getDoctorMap() != null) {
            displayResult();
        }
    }

    // Prints the search result: a title, then either "No doctor found." or a header and
    // one line per doctor.
    private void displayResult() {
        System.out.println(Message.TITLE_RESULT);

        // nobody matched the search text
        if (responseDTO.getDoctorMap().isEmpty()) {
            System.out.println(Message.NOT_FOUND);
        } else {
            // the header, with the same column widths as the rows
            System.out.println(String.format(Constants.HEADER_FORMAT, Message.LABEL_CODE,
                    Message.LABEL_NAME, Message.LABEL_SPECIALIZATION,
                    Message.LABEL_AVAILABILITY));

            // one line per doctor; Doctor.toString() already padded it
            for (String row : responseDTO.getDoctorMap().values()) {
                System.out.println(row);
            }
        }
    }
}</code></pre>
<p>And the controller side of one menu option — no Scanner, no print, no <code>Doctor</code> object, one render:</p>
<pre><code class="language-java">// Function 1 (addDoctor): adds a new doctor, then the view prints "Add doctor
// successfully." - once.
public void addDoctor(DoctorRequestDTO requestDTO) throws Exception {
    DoctorResponseDTO responseDTO = new DoctorResponseDTO();

    // the brief: null data cannot be added
    if (requestDTO == null) {
        throw new Exception(Message.DATA_NOT_EXIST_ADD);
    }

    // the brief: a code may appear only once in the database
    if (doctorRepository.isExistDoctor(requestDTO.getCode())) {
        throw new Exception(String.format(Message.DUPLICATE_CODE, requestDTO.getCode()));
    }

    // stored: hand the answer to the view, then render it - once for the whole flow
    doctorRepository.addDoctor(requestDTO);
    responseDTO.setMessage(Message.ADD_SUCCESS);
    doctorView.setResponseDTO(responseDTO);
    doctorView.display();
}</code></pre>
<div class="note-ct"><b>Reading and writing files — utils, called from Main.</b> The sheet puts reading from a file and hashing in Main, and the Guide puts file helpers in utils. So <code>utils/FileUtils</code> (a <code>final</code> class of static methods) reads the lines; Main calls it at start-up, puts the lines into the RequestDTO and calls <code>controller.loadData(requestDTO)</code>; the repository turns the lines into model objects. Saving after a change goes through the same FileUtils, called by the repository. For a password, Main hashes it with <code>MD5Utils</code> before it fills the RequestDTO; the repository only stores and compares the hash. Lesson 5.2 shows the code.</div>
<div class="note-ct"><b>About <code>Serializable</code>.</b> Not one of the 54 briefs writes an object with <code>ObjectOutputStream</code> — every file here is text, CSV or a <code>.dat</code> written as text — and the standard solutions do not implement <code>Serializable</code> at all. Add it only when a brief really serializes objects; and know why these briefs avoid it: appending with a second <code>ObjectOutputStream</code> writes a second header that <code>ObjectInputStream</code> chokes on (Lesson 5.2).</div>
<div class="pitfall"><b>When the brief names a class or a method.</b> "Student must implement methods X, Y" says what to write, not which package it goes in — the job decides: storing and finding data → repository; a calculation → service; checking a typed value → utils/Validation; showing a result → view. Keep the brief's name and signature. When a name breaks the sheet (<code>ExceptionCar</code>, <code>Damage()</code>, <code>employeeID</code>), rename it (<code>CarException</code>, <code>damage()</code>, <code>employeeId</code>), write <code>// brief: ExceptionCar</code> on the line above, and ask your teacher whether they would rather keep the brief's name. A class the brief names for the data — "Class <b>DoctorHash</b> contains adding, editing, deleting and searching functions" — plays the repository role: the standard P0055 solution calls it <code>DoctorRepository</code> and says so in its comment; P0052 keeps the brief's <code>ManageEastAsiaCountries</code> as its repository.</div>
<div class="pitfall"><b>Trap:</b> the NetBeans "To change this license header…" comment is a sign of generated code. Delete it and write a Javadoc that says what the class is for — and remember the sheet (item 1.6) wants a comment on every method and every block too, not only on the class.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>One Scanner, created in main(), never closed.</b> Scanner lives only in Main (Guide). Create it once as a local variable of <code>main()</code> and pass it to Main's private input methods — no static Scanner field (the Guide forbids static variables in Main) and no Scanner in any other class. Never call sc.close(): closing a Scanner that wraps System.in closes stdin for the whole program, and the next read throws NoSuchElementException. <em>Why beyond the syllabus: it is a resource-management subtlety PRO192 rarely drills, yet it silently zeroes lab runs.</em></div>
<div class="callout warn"><span class="badge">If you studied an earlier version of this lesson</span> It taught a different five-layer scheme: a business-object layer holding the list, a controller that read the keyboard and printed the result, a checker class that kept its own Scanner, and "only add layers when the program is big". The check sheet rejects every one of those: the repository is mandatory, the controller never reads or prints, Scanner stays in Main, and the view renders once from a ResponseDTO. Rebuild old projects on the table above.</div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0055-doctor-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">The teacher's sample: Doctor Management (P0055)</span><span class="lc-sub">The Guide's own project — constants · model · dto · repository · controller · view · utils · main.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0056-program-to-manage-worker-information?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">The full pattern with a service: Worker Management</span><span class="lc-sub">Every package of the Guide, with a service for the salary rules.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 1 · Bài 1.1</span>
<h2>Kiến trúc MVC theo Guide của thầy — một hình dạng cho mọi đề</h2>
<p class="lead">Mọi chương trình LAB211 bạn nộp đều có chung một hình dạng: mô hình MVC trong <strong>Guide</strong> của thầy (project mẫu trong Guide.xlsx), được soát bằng mục <strong>1.1</strong> của tờ giấy <strong>Coding check sheet</strong>. Bài bubble sort 50 dòng hay hệ quản lý tài sản 500 dòng đều cùng một hình dạng. Thuộc nó một lần là bạn không bao giờ phí giờ lab để nghĩ "code này đặt ở đâu" — và không buổi review nào bị reject vì chuyện đó.</p>
<div class="callout danger"><b>Bài nào cũng phải có repository — không ngoại lệ.</b> Tờ checklist in đậm: <q>Bắt buộc phải có repository</q>. Đề sắp xếp giữ mảng trong repository; đề quản lý giữ danh sách trong repository. Không có chuyện "chương trình nhỏ thì khỏi chia tầng".</div>
<h3>Các package — mỗi cái làm gì, và tuyệt đối không được làm gì</h3>
<table>
  <thead><tr><th>Package</th><th>Nhiệm vụ (theo Guide)</th><th>Cấm ở đây</th></tr></thead>
  <tbody>
    <tr><td><b>constants</b><br><small>Constants.java · Message.java</small></td><td>Mọi con số, chuỗi định dạng (Constants) và mọi thông báo, nhãn (Message): <code>public static final</code>, tên VIẾT_HOA. Lớp là <code>final</code>, có constructor private.</td><td>thông báo gõ thẳng vào lớp khác</td></tr>
    <tr><td><b>model</b></td><td>Mô tả một thực thể: trường private, constructor, getter/setter, và <code>toString()</code> khi cần đưa chữ của nó ra ngoài.</td><td>Scanner, print, <code>static</code></td></tr>
    <tr><td><b>dto</b><br><small>XxxRequestDTO · XxxResponseDTO</small></td><td>RequestDTO chở thứ người dùng nhập từ Main vào controller (có thể chuyển tiếp nguyên vẹn xuống service/repository). ResponseDTO chở thứ view sẽ hiển thị.</td><td>logic</td></tr>
    <tr><td><b>repository</b> — <b>bắt buộc</b></td><td>Chứa dữ liệu (danh sách, map, mảng) và các hàm CRUD đơn giản trên nó. Sai luật thì <code>throw new Exception(Message.X)</code>.</td><td>tính toán, print, bàn phím</td></tr>
    <tr><td><b>service</b> — khi có nghiệp vụ</td><td>Các tính toán: tính tổng, chu vi, diện tích, thống kê, báo cáo, thuật toán sắp xếp, kiểm đăng nhập. Nằm giữa controller và repository, được dùng model.</td><td>nhập, print, view</td></tr>
    <tr><td><b>controller</b></td><td>Nhận RequestDTO từ Main, gọi service/repository, đặt kết quả vào ResponseDTO, đưa cho view rồi gọi <code>display()</code> <b>một lần</b>. Không static.</td><td>Scanner, print, model</td></tr>
    <tr><td><b>view</b></td><td>Giữ ResponseDTO trong <b>thuộc tính</b> (gán qua setter); <code>display()</code> <b>không tham số</b> và in nó ra.</td><td>nhận dữ liệu qua tham số của <code>display(...)</code>; render lần hai trong cùng một luồng</td></tr>
    <tr><td><b>utils</b><br><small>Validation · FileUtils · MD5Utils…</small></td><td>Hàm <code>static</code> dùng chung: kiểm một dòng người dùng gõ, đọc/ghi tệp, mã hoá mật khẩu. Lớp <code>final</code>, constructor private.</td><td>Scanner, print</td></tr>
    <tr><td><b>main</b><br><small>Main.java</small></td><td>Luồng làm việc chính: in menu và câu nhắc, đọc bằng Scanner, kiểm bằng Validation, đọc tệp và mã hoá qua utils, đóng gói RequestDTO, gọi controller <b>một lần cho mỗi case</b>, và in <code>e.getMessage()</code> khi có lỗi.</td><td>model, view, biến static</td></tr>
  </tbody>
</table>
<h3>Một lựa chọn menu, từ đầu tới cuối</h3>
<div class="lz-flow">
  <div class="lz-step">Main in menu và từng câu nhắc, đọc trọn một dòng bằng Scanner</div>
  <div class="lz-step">utils/Validation kiểm dòng đó; nếu nó ném lỗi, Main in lý do rồi hỏi lại</div>
  <div class="lz-step">Main đóng gói RequestDTO và gọi controller — đúng một lần cho case này</div>
  <div class="lz-step">Controller → Service → Repository → Model</div>
  <div class="lz-step">Controller: view.setResponseDTO(responseDTO); view.display(); — render một lần cho cả luồng</div>
</div>
<p>Lỗi đi theo chiều ngược lại: repository (hoặc service, hoặc controller) <code>throw new Exception(Message.X)</code>, và <code>catch</code> trong Main in <code>e.getMessage()</code> — đúng như Main mẫu của thầy. Không bao giờ gọi view để in lỗi.</p>
<h3>Project mẫu của thầy, từng tệp (quản lý bác sĩ, P0055)</h3>
<pre>src/
├── constants/   Constants.java · Message.java
├── model/       Doctor.java
├── dto/         DoctorRequestDTO.java · DoctorResponseDTO.java
├── repository/  DoctorRepository.java      ← "DoctorHash" của đề
├── controller/  DoctorController.java
├── view/        DoctorView.java
├── utils/       Validation.java
└── main/        Main.java</pre>
<p>Bài này <b>không có service</b>: thêm, sửa, xoá, tìm đều là CRUD đơn giản nên controller làm việc thẳng với repository. Đề bubble sort (P0001) thì ngược lại — sắp xếp là nghiệp vụ, nên <code>SortService</code> lấy mảng từ <code>NumberRepository</code> rồi sắp. Nguyên văn tờ giấy: nếu có nghiệp vụ tính toán thì cần thêm Services và đảm bảo layer <b>Controller ↔ Services ↔ Repository ↔ Model</b>.</p>
<h3>Chỗ sinh viên hay sai nhất: view</h3>
<p>View không nhận dữ liệu qua tham số. Nó giữ một ResponseDTO trong thuộc tính; controller gán vào rồi gọi <code>display()</code> không đối số — đúng như code mẫu trong Guide. ResponseDTO và view của project mẫu:</p>
<pre><code class="language-java">package dto;

import java.util.LinkedHashMap;

/**
 * DTO carrying the answer of one menu option FROM the controller OUT TO the view - a
 * JavaBean (private fields, public no-argument constructor, getters/setters). Add, update
 * and delete fill the message; search fills the doctor map.
 *
 * @author HE176322
 */
public class DoctorResponseDTO {

    // The one-line result, e.g. "Add doctor successfully."; null for a search.
    private String message;

    // The doctors a search found: code -&gt; table row (the text of Doctor.toString()); null
    // when the answer is a message, empty when nobody matched.
    private LinkedHashMap&lt;String, String&gt; doctorMap;

    // JavaBean constructor: an empty answer, filled through the setters.
    public DoctorResponseDTO() {
    }

    // Returns the one-line result.
    public String getMessage() {
        return message;
    }

    // Sets the one-line result.
    public void setMessage(String message) {
        this.message = message;
    }

    // Returns the doctors found.
    public LinkedHashMap&lt;String, String&gt; getDoctorMap() {
        return doctorMap;
    }

    // Sets the doctors found.
    public void setDoctorMap(LinkedHashMap&lt;String, String&gt; doctorMap) {
        this.doctorMap = doctorMap;
    }
}</code></pre>
<pre><code class="language-java">package view;

import constants.Constants;
import constants.Message;
import dto.DoctorResponseDTO;

/**
 * VIEW: the only place (with main) allowed to print results. It receives the data through
 * its attribute (the ResponseDTO, as in the Guide sample), never through the parameters of
 * display().
 *
 * @author HE176322
 */
public class DoctorView {

    // The answer to print, handed over by the controller.
    private DoctorResponseDTO responseDTO;

    // Receives the answer the next display() call will print.
    public void setResponseDTO(DoctorResponseDTO responseDTO) {
        this.responseDTO = responseDTO;
    }

    // Prints what the controller set: the one-line result of add/update/delete, or the
    // search result.
    public void display() {
        // add, update and delete answer with one line
        if (responseDTO.getMessage() != null) {
            System.out.println(responseDTO.getMessage());
        }

        // a search answers with its result
        if (responseDTO.getDoctorMap() != null) {
            displayResult();
        }
    }

    // Prints the search result: a title, then either "No doctor found." or a header and
    // one line per doctor.
    private void displayResult() {
        System.out.println(Message.TITLE_RESULT);

        // nobody matched the search text
        if (responseDTO.getDoctorMap().isEmpty()) {
            System.out.println(Message.NOT_FOUND);
        } else {
            // the header, with the same column widths as the rows
            System.out.println(String.format(Constants.HEADER_FORMAT, Message.LABEL_CODE,
                    Message.LABEL_NAME, Message.LABEL_SPECIALIZATION,
                    Message.LABEL_AVAILABILITY));

            // one line per doctor; Doctor.toString() already padded it
            for (String row : responseDTO.getDoctorMap().values()) {
                System.out.println(row);
            }
        }
    }
}</code></pre>
<p>Và phía controller của một lựa chọn menu — không Scanner, không print, không đụng đối tượng <code>Doctor</code>, render đúng một lần:</p>
<pre><code class="language-java">// Function 1 (addDoctor): adds a new doctor, then the view prints "Add doctor
// successfully." - once.
public void addDoctor(DoctorRequestDTO requestDTO) throws Exception {
    DoctorResponseDTO responseDTO = new DoctorResponseDTO();

    // the brief: null data cannot be added
    if (requestDTO == null) {
        throw new Exception(Message.DATA_NOT_EXIST_ADD);
    }

    // the brief: a code may appear only once in the database
    if (doctorRepository.isExistDoctor(requestDTO.getCode())) {
        throw new Exception(String.format(Message.DUPLICATE_CODE, requestDTO.getCode()));
    }

    // stored: hand the answer to the view, then render it - once for the whole flow
    doctorRepository.addDoctor(requestDTO);
    responseDTO.setMessage(Message.ADD_SUCCESS);
    doctorView.setResponseDTO(responseDTO);
    doctorView.display();
}</code></pre>
<div class="note-ct"><b>Đọc/ghi tệp — nằm ở utils, do Main gọi.</b> Tờ giấy ghi việc đọc từ file và mã hoá thực hiện ở Main, còn Guide đặt các hàm tệp trong utils. Nên <code>utils/FileUtils</code> (lớp <code>final</code> toàn hàm static) đọc các dòng; Main gọi nó lúc khởi động, đặt các dòng vào RequestDTO rồi gọi <code>controller.loadData(requestDTO)</code>; repository biến các dòng thành đối tượng model. Lưu lại sau mỗi thay đổi cũng đi qua FileUtils đó, do repository gọi. Với mật khẩu, Main băm bằng <code>MD5Utils</code> rồi mới đặt vào RequestDTO; repository chỉ lưu và so chuỗi băm. Bài 5.2 có code.</div>
<div class="note-ct"><b>Về <code>Serializable</code>.</b> Không một đề nào trong 54 đề ghi đối tượng bằng <code>ObjectOutputStream</code> — mọi tệp ở đây đều là văn bản, CSV hoặc <code>.dat</code> ghi dạng chữ — và các lời giải chuẩn không lớp nào implements <code>Serializable</code>. Chỉ thêm khi đề thật sự serialize đối tượng; và nên biết vì sao các đề này tránh nó: ghi nối bằng một <code>ObjectOutputStream</code> thứ hai tạo thêm một header mà <code>ObjectInputStream</code> không đọc nổi (Bài 5.2).</div>
<div class="pitfall"><b>Khi đề đặt sẵn tên lớp hoặc tên hàm.</b> "Student must implement methods X, Y" nói phải viết gì, không nói đặt ở package nào — công việc của hàm quyết định: lưu/tìm dữ liệu → repository; tính toán → service; kiểm giá trị người dùng gõ → utils/Validation; hiển thị kết quả → view. Giữ đúng tên và chữ ký đề đặt. Khi tên đề đặt trái tờ checklist (<code>ExceptionCar</code>, <code>Damage()</code>, <code>employeeID</code>), đổi tên (<code>CarException</code>, <code>damage()</code>, <code>employeeId</code>), ghi <code>// brief: ExceptionCar</code> ngay dòng trên, và hỏi thầy nếu thầy muốn giữ tên của đề. Lớp mà đề đặt tên để chứa dữ liệu — "Class <b>DoctorHash</b> contains adding, editing, deleting and searching functions" — đóng vai repository: lời giải chuẩn P0055 đặt tên <code>DoctorRepository</code> và ghi rõ điều đó trong comment; P0052 giữ nguyên tên đề <code>ManageEastAsiaCountries</code> làm repository.</div>
<div class="pitfall"><b>Bẫy:</b> comment "To change this license header…" của NetBeans là dấu hiệu code sinh sẵn. Xoá nó và viết Javadoc nói lớp dùng để làm gì — và nhớ tờ giấy (mục 1.6) còn đòi comment cho mọi method và mọi block code, không chỉ cho lớp.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Một Scanner, tạo trong main(), không bao giờ đóng.</b> Scanner chỉ nằm ở Main (Guide). Tạo nó một lần làm biến cục bộ của <code>main()</code> rồi truyền vào các hàm nhập private của Main — không khai báo Scanner static (Guide cấm biến static ở Main) và không có Scanner ở lớp nào khác. Đừng gọi sc.close(): đóng Scanner bọc System.in sẽ đóng luôn stdin của cả chương trình, và lần đọc sau ném NoSuchElementException. <em>Vì sao ngoài syllabus: đây là điểm tinh tế về quản lý tài nguyên PRO192 ít luyện, nhưng lại âm thầm làm hỏng lần chạy ở phòng lab.</em></div>
<div class="callout warn"><span class="badge">Nếu bạn từng học bản cũ của bài này</span> Bản cũ dạy một sơ đồ năm tầng khác: một tầng "đối tượng nghiệp vụ" giữ danh sách, controller tự đọc bàn phím và tự in kết quả, một lớp kiểm tra giữ Scanner riêng, và "chỉ thêm tầng khi chương trình đủ lớn". Tờ checklist reject tất cả những điều đó: repository là bắt buộc, controller không nhập và không in, Scanner chỉ ở Main, view render một lần từ ResponseDTO. Dựng lại các project cũ theo bảng ở trên.</div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0055-doctor-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🩺</span>
  <span class="lc-body"><span class="lc-title">Project mẫu của thầy: Doctor Management (P0055)</span><span class="lc-sub">Chính project trong Guide — constants · model · dto · repository · controller · view · utils · main.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0056-program-to-manage-worker-information?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">Trọn mẫu có service: Worker Management</span><span class="lc-sub">Đủ mọi package của Guide, có service cho luật tăng/giảm lương.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — Safe input: Main reads, Validation checks|||1.2 — Nhập liệu an toàn: Main đọc, Validation kiểm',
          slug: 'lab211-nhap-lieu-validator',
          type: 'VIDEO',
          description: 'utils/Validation theo Guide (final, constructor private, hàm static nhận String, ném Exception với câu trong Message) + vòng lặp hỏi lại ở Main, và bẫy Scanner nextInt/nextLine — dùng ở 44/54 đề.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 1 · Lesson 1.2</span>
<h2>Safe input — Main reads, Validation checks, nothing crashes</h2>
<p class="lead">Roughly <strong>44 of the 54 briefs</strong> read input with Scanner. If your program throws <span class="badge">InputMismatchException</span> when the marker types a letter, that run is zero. The fix has two halves, and the Guide says exactly where each one lives: <b>Main</b> owns the Scanner and the ask-again loop; <b>utils/Validation</b> only answers "is this line valid?" — it returns the clean value or throws an <code>Exception</code> whose text comes from <code>Message</code>.</p>
<h3>The Scanner trap you must know</h3>
<p><span class="badge">nextInt()</span> reads the number but leaves the newline in the buffer; the next <span class="badge">nextLine()</span> then reads an empty string. Never mix them — read a whole line and parse it.</p>
<pre><code class="language-java">// Fragile - the classic bug
int age = sc.nextInt();
String name = sc.nextLine();    // reads "" - not the name!</code></pre>
<h3>utils/Validation — the Guide's shape</h3>
<p>A <code>final</code> class with a private constructor and only <code>static</code> methods (check sheet 3.4). Each method takes the <b>String</b> that Main read — never a Scanner — and never prints: it returns the clean value or throws <code>new Exception(Message.X)</code>. Note the brackets around <b>each</b> comparison, <code>if ((choice &lt; min) || (choice &gt; max))</code>, exactly as in the teacher's own sample (item 3.3). This is the Validation of the Guide sample project:</p>
<pre><code class="language-java">package utils;

import constants.Constants;
import constants.Message;

/**
 * Shared checks for what the user typed. A utility: no object, no field, no keyboard, no
 * print - it only answers "is this line valid?".
 *
 * @author HE176322
 */
public final class Validation {

    // Private constructor: nobody may create a Validation object; every method is called
    // through the class name.
    private Validation() {
    }

    // Returns the text without surrounding spaces; an empty text is allowed (update uses
    // "empty" to mean "keep the old value").
    public static String getText(String input) {
        // a missing line is treated like an empty one
        if (input == null) {
            return "";
        }

        return input.trim();
    }

    // Returns the text when it is not blank.
    public static String getNonBlank(String input, String error) throws Exception {
        String text = getText(input);

        // blank text is refused so main can ask again
        if (text.isEmpty()) {
            throw new Exception(error);
        }

        return text;
    }

    // Converts a menu choice and checks it lies in [min, max].
    public static int getChoice(String input, int min, int max) throws Exception {
        int choice = 0;

        // parse first, so a letter gives the "number" message
        try {
            choice = Integer.parseInt(getText(input));
        } catch (NumberFormatException e) {
            // letters or an empty line: not a number at all
            throw new Exception(Message.INVALID_NUMBER);
        }

        // then check the range, so 9 gives the "range" message
        if ((choice &lt; min) || (choice &gt; max)) {
            throw new Exception(String.format(Message.INVALID_RANGE, min, max));
        }

        return choice;
    }

    // The brief's checkAvailability: converts the availability and checks Availability &gt;=
    // 0.
    public static int checkAvailability(String input) throws Exception {
        int availability = 0;

        // "many" or an empty line is not a number
        try {
            availability = Integer.parseInt(getText(input));
        } catch (NumberFormatException e) {
            // letters or an empty line: not a number at all
            throw new Exception(Message.INVALID_NUMBER);
        }

        // the brief: Availability &gt;= 0
        if (availability &lt; Constants.MIN_AVAILABILITY) {
            throw new Exception(Message.INVALID_AVAILABILITY);
        }

        return availability;
    }

    // Same as checkAvailability, but a blank line is allowed and gives null (used by
    // update, where blank means "keep the old availability").
    public static Integer checkOptionalAvailability(String input) throws Exception {
        // blank: the user wants to keep the old value
        if (getText(input).isEmpty()) {
            return null;
        }

        return checkAvailability(input);
    }
}</code></pre>
<h3>Main — the loop that asks again</h3>
<p>Main prints the prompt, reads one line, hands it to Validation, and when an exception comes back it prints the message and asks again. The Scanner is a local variable of <code>main()</code>, passed in as a parameter:</p>
<pre><code class="language-java">// Asks for a menu choice until the user types a number from 1 to 5.
private static int inputChoice(Scanner sc) {
    String line = "";

    // keep asking until Validation accepts the line
    while (true) {
        System.out.print(Message.INPUT_CHOICE);
        line = sc.nextLine();

        // a wrong line prints the reason and loops again
        try {
            return Validation.getChoice(line, Constants.MENU_MIN, Constants.MENU_EXIT);
        } catch (Exception e) {
            // "Please input number" or "Please choose from 1 to 5."
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<div class="out"><b>Behaviour:</b> type <span class="badge">abc</span> → "Please input number", asked again. Type <span class="badge">9</span> when the menu is 1–5 → "Please choose from 1 to 5.", asked again. The program never crashes, and not one message is typed outside <code>Message</code>.</div>
<div class="callout warn">Read with <span class="badge">nextLine()</span> and parse with <span class="badge">Integer.parseInt</span> — never <span class="badge">nextInt()</span> directly. This one habit removes the most common crash of a lab sitting.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Scanner.nextDouble() is locale-sensitive.</b> On a machine set to a comma-decimal locale, sc.nextDouble() rejects &#96;3.5&#96; and wants &#96;3,5&#96;. Reading the whole line and calling Double.parseDouble(line.trim()) always uses a dot, so your program behaves the same on every lab machine. <em>Why beyond the syllabus: locale is invisible until the grader's machine differs from yours.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0063-input-and-display-person-info?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practise input: Input &amp; display Person Info</span><span class="lc-sub">A tiny brief that is all about reading &amp; re-prompting cleanly.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 1 · Bài 1.2</span>
<h2>Nhập liệu an toàn — Main đọc, Validation kiểm, không bao giờ sập</h2>
<p class="lead">Khoảng <strong>44/54 đề</strong> đọc input bằng Scanner. Nếu chương trình ném <span class="badge">InputMismatchException</span> khi người chấm gõ một chữ cái, lần chạy đó mất trắng. Cách sửa có hai nửa, và Guide nói rõ mỗi nửa nằm ở đâu: <b>Main</b> giữ Scanner và vòng lặp hỏi lại; <b>utils/Validation</b> chỉ trả lời "dòng này có hợp lệ không?" — trả về giá trị sạch, hoặc ném <code>Exception</code> với câu chữ lấy từ <code>Message</code>.</p>
<h3>Bẫy Scanner bạn phải biết</h3>
<p><span class="badge">nextInt()</span> đọc số nhưng để lại ký tự xuống dòng trong bộ đệm; <span class="badge">nextLine()</span> ngay sau đó đọc ra chuỗi rỗng. Đừng trộn chúng — đọc trọn một dòng rồi parse.</p>
<pre><code class="language-java">// Fragile - the classic bug
int age = sc.nextInt();
String name = sc.nextLine();    // reads "" - not the name!</code></pre>
<h3>utils/Validation — đúng hình dạng trong Guide</h3>
<p>Lớp <code>final</code>, constructor private, toàn hàm <code>static</code> (tờ checklist 3.4). Mỗi hàm nhận <b>String</b> mà Main đã đọc — không bao giờ nhận Scanner — và không in gì: trả về giá trị sạch hoặc <code>throw new Exception(Message.X)</code>. Để ý ngoặc bọc <b>từng</b> phép so sánh, <code>if ((choice &lt; min) || (choice &gt; max))</code>, y như code mẫu của thầy (mục 3.3). Đây là Validation của project mẫu trong Guide:</p>
<pre><code class="language-java">package utils;

import constants.Constants;
import constants.Message;

/**
 * Shared checks for what the user typed. A utility: no object, no field, no keyboard, no
 * print - it only answers "is this line valid?".
 *
 * @author HE176322
 */
public final class Validation {

    // Private constructor: nobody may create a Validation object; every method is called
    // through the class name.
    private Validation() {
    }

    // Returns the text without surrounding spaces; an empty text is allowed (update uses
    // "empty" to mean "keep the old value").
    public static String getText(String input) {
        // a missing line is treated like an empty one
        if (input == null) {
            return "";
        }

        return input.trim();
    }

    // Returns the text when it is not blank.
    public static String getNonBlank(String input, String error) throws Exception {
        String text = getText(input);

        // blank text is refused so main can ask again
        if (text.isEmpty()) {
            throw new Exception(error);
        }

        return text;
    }

    // Converts a menu choice and checks it lies in [min, max].
    public static int getChoice(String input, int min, int max) throws Exception {
        int choice = 0;

        // parse first, so a letter gives the "number" message
        try {
            choice = Integer.parseInt(getText(input));
        } catch (NumberFormatException e) {
            // letters or an empty line: not a number at all
            throw new Exception(Message.INVALID_NUMBER);
        }

        // then check the range, so 9 gives the "range" message
        if ((choice &lt; min) || (choice &gt; max)) {
            throw new Exception(String.format(Message.INVALID_RANGE, min, max));
        }

        return choice;
    }

    // The brief's checkAvailability: converts the availability and checks Availability &gt;=
    // 0.
    public static int checkAvailability(String input) throws Exception {
        int availability = 0;

        // "many" or an empty line is not a number
        try {
            availability = Integer.parseInt(getText(input));
        } catch (NumberFormatException e) {
            // letters or an empty line: not a number at all
            throw new Exception(Message.INVALID_NUMBER);
        }

        // the brief: Availability &gt;= 0
        if (availability &lt; Constants.MIN_AVAILABILITY) {
            throw new Exception(Message.INVALID_AVAILABILITY);
        }

        return availability;
    }

    // Same as checkAvailability, but a blank line is allowed and gives null (used by
    // update, where blank means "keep the old availability").
    public static Integer checkOptionalAvailability(String input) throws Exception {
        // blank: the user wants to keep the old value
        if (getText(input).isEmpty()) {
            return null;
        }

        return checkAvailability(input);
    }
}</code></pre>
<h3>Main — vòng lặp hỏi lại</h3>
<p>Main in câu nhắc, đọc một dòng, đưa cho Validation; khi nhận về ngoại lệ thì in thông báo và hỏi lại. Scanner là biến cục bộ của <code>main()</code>, được truyền vào làm tham số:</p>
<pre><code class="language-java">// Asks for a menu choice until the user types a number from 1 to 5.
private static int inputChoice(Scanner sc) {
    String line = "";

    // keep asking until Validation accepts the line
    while (true) {
        System.out.print(Message.INPUT_CHOICE);
        line = sc.nextLine();

        // a wrong line prints the reason and loops again
        try {
            return Validation.getChoice(line, Constants.MENU_MIN, Constants.MENU_EXIT);
        } catch (Exception e) {
            // "Please input number" or "Please choose from 1 to 5."
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<div class="out"><b>Hành vi:</b> gõ <span class="badge">abc</span> → "Please input number", hỏi lại. Gõ <span class="badge">9</span> khi menu là 1–5 → "Please choose from 1 to 5.", hỏi lại. Chương trình không bao giờ sập, và không một câu thông báo nào được gõ ngoài <code>Message</code>.</div>
<div class="callout warn">Đọc bằng <span class="badge">nextLine()</span> và parse bằng <span class="badge">Integer.parseInt</span> — đừng bao giờ dùng <span class="badge">nextInt()</span> trực tiếp. Một thói quen này loại bỏ lỗi sập phổ biến nhất trong buổi lab.</div>
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
          description: '%-15s, %.2f, String.format — người chấm so màn hình từng dòng nên nhãn/khoảng cách phải khớp tuyệt đối; chỉ View in kết quả, nhãn nằm trong Message, định dạng trong Constants.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 1 · Lesson 1.3</span>
<h2>Output that matches to the character</h2>
<p class="lead">The marker compares your console with the expected screen: correct logic + wrong spacing = wrong. The check sheet adds two rules about <em>where</em> output lives. Results are printed <b>only by the view</b> — Main prints nothing but the menu, the prompts and error messages. And every label and format string is a constant: labels and messages in <code>Message.java</code> (item 2.11), format strings and numbers in <code>Constants.java</code> (item 2.10). Master the format specifiers, then copy every label and every space from the brief into those two files — exactly.</p>
<h3>The format specifiers you will use constantly</h3>
<table>
  <thead><tr><th>Specifier</th><th>Meaning</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">%d</span></td><td>integer</td><td><span class="badge">42</span></td></tr>
    <tr><td><span class="badge">%.2f</span></td><td>2 decimal places</td><td><span class="badge">3.14</span></td></tr>
    <tr><td><span class="badge">%-15s</span></td><td>string, left-aligned in width 15</td><td>pads with spaces on the right</td></tr>
    <tr><td><span class="badge">%10.2f</span></td><td>float, width 10, 2 decimals</td><td>right-aligned</td></tr>
    <tr><td><span class="badge">%n</span></td><td>newline (portable)</td><td>use instead of \\n in a format</td></tr>
  </tbody>
</table>
<h3>One table, three places — the Guide sample</h3>
<p>The format strings live in <b>Constants</b>. The <b>model</b> builds its own row with them in <code>toString()</code> (the Guide: "cần output gì thì thêm hàm toString()" — if something must be shown, add a toString()). The <b>view</b> prints the title, the header and the rows it received in its ResponseDTO:</p>
<pre><code class="language-java">// One table row: code, name, specialization, availability.
public static final String ROW_FORMAT = "%-10s%-15s%-20s%d";

// The table header uses the same widths, with a text last column.
public static final String HEADER_FORMAT = "%-10s%-15s%-20s%s";</code></pre>
<pre><code class="language-java">// Polymorphism: overrides Object.toString() - one table row, already padded into
// fixed-width columns (Guide: "cần output gì thì thêm hàm toString()").
@Override
public String toString() {
    return String.format(Constants.ROW_FORMAT, code, name, specialization, availability);
}</code></pre>
<pre><code class="language-java">// Prints the search result: a title, then either "No doctor found." or a header and
// one line per doctor.
private void displayResult() {
    System.out.println(Message.TITLE_RESULT);

    // nobody matched the search text
    if (responseDTO.getDoctorMap().isEmpty()) {
        System.out.println(Message.NOT_FOUND);
    } else {
        // the header, with the same column widths as the rows
        System.out.println(String.format(Constants.HEADER_FORMAT, Message.LABEL_CODE,
                Message.LABEL_NAME, Message.LABEL_SPECIALIZATION,
                Message.LABEL_AVAILABILITY));

        // one line per doctor; Doctor.toString() already padded it
        for (String row : responseDTO.getDoctorMap().values()) {
            System.out.println(row);
        }
    }
}</code></pre>
<div class="out">---------&nbsp;Result&nbsp;------------<br>Code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Specialization&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Availability<br>D001&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tran&nbsp;Binh&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cardiology&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>D002&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Le&nbsp;Lan&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Orthopedics&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0</div>
<p>Each column is padded to a fixed width (<code>%-10s</code>, <code>%-15s</code>, <code>%-20s</code>), and the header uses the <em>same</em> widths, so the columns line up. Nothing in the view is typed by hand: the title and the labels come from <code>Message</code>, the widths from <code>Constants</code>.</p>
<div class="pitfall"><b>Trap:</b> briefs are sometimes inconsistent — <span class="badge">"Area: "</span> (with a space) for a rectangle but <span class="badge">"Area:"</span> (no space) for a circle. Copy each one into <code>Message</code> <em>exactly as printed</em>; do not "tidy up". The marker compares literally.</div>
<div class="note-ct">When in doubt about a label, follow the <b>Guidelines</b> section of the brief over the screenshot — they occasionally disagree, and Guidelines is the authoritative version. Note the discrepancy aloud in a viva for bonus.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Formatting uses the default locale too.</b> String.format("%.2f", 3.5) can give &#96;3,50&#96; on a comma-locale machine and fail the exact-match check. Force a dot with String.format(Locale.US, Constants.X_FORMAT, x) — the way the Circle of Lesson 5.1 builds its text. <em>Why beyond the syllabus: the locale of %f formatting is a detail the brief never mentions but the marker's screen assumes.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0061-create-a-program-to-calculate-perimeter-and-area?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">📐</span>
  <span class="lc-body"><span class="lc-title">Practise output: Perimeter &amp; Area</span><span class="lc-sub">A brief that hinges on matching labels and %.2f exactly.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 1 · Bài 1.3</span>
<h2>Xuất đúng định dạng tới từng ký tự</h2>
<p class="lead">Người chấm so console của bạn với màn hình mẫu: logic đúng + khoảng cách sai = sai. Tờ checklist thêm hai luật về việc output nằm <em>ở đâu</em>. Kết quả <b>chỉ được in ở view</b> — Main chỉ in menu, câu nhắc nhập và thông báo lỗi. Và mọi nhãn, mọi chuỗi định dạng đều là hằng: nhãn và thông báo trong <code>Message.java</code> (mục 2.11), chuỗi định dạng và con số trong <code>Constants.java</code> (mục 2.10). Thành thạo các định dạng, rồi chép mọi nhãn, mọi dấu cách của đề vào hai tệp đó — y nguyên.</p>
<h3>Các định dạng bạn dùng liên tục</h3>
<table>
  <thead><tr><th>Định dạng</th><th>Ý nghĩa</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">%d</span></td><td>số nguyên</td><td><span class="badge">42</span></td></tr>
    <tr><td><span class="badge">%.2f</span></td><td>2 chữ số thập phân</td><td><span class="badge">3.14</span></td></tr>
    <tr><td><span class="badge">%-15s</span></td><td>chuỗi, canh trái trong bề rộng 15</td><td>đệm dấu cách bên phải</td></tr>
    <tr><td><span class="badge">%10.2f</span></td><td>số thực, rộng 10, 2 thập phân</td><td>canh phải</td></tr>
    <tr><td><span class="badge">%n</span></td><td>xuống dòng (đa nền tảng)</td><td>dùng thay \\n trong chuỗi định dạng</td></tr>
  </tbody>
</table>
<h3>Một bảng, ba chỗ — project mẫu trong Guide</h3>
<p>Chuỗi định dạng nằm ở <b>Constants</b>. <b>Model</b> tự dựng dòng của mình bằng chúng trong <code>toString()</code> (Guide: "cần output gì thì thêm hàm toString()"). <b>View</b> in tiêu đề, dòng tiêu đề cột và các dòng nó nhận trong ResponseDTO:</p>
<pre><code class="language-java">// One table row: code, name, specialization, availability.
public static final String ROW_FORMAT = "%-10s%-15s%-20s%d";

// The table header uses the same widths, with a text last column.
public static final String HEADER_FORMAT = "%-10s%-15s%-20s%s";</code></pre>
<pre><code class="language-java">// Polymorphism: overrides Object.toString() - one table row, already padded into
// fixed-width columns (Guide: "cần output gì thì thêm hàm toString()").
@Override
public String toString() {
    return String.format(Constants.ROW_FORMAT, code, name, specialization, availability);
}</code></pre>
<pre><code class="language-java">// Prints the search result: a title, then either "No doctor found." or a header and
// one line per doctor.
private void displayResult() {
    System.out.println(Message.TITLE_RESULT);

    // nobody matched the search text
    if (responseDTO.getDoctorMap().isEmpty()) {
        System.out.println(Message.NOT_FOUND);
    } else {
        // the header, with the same column widths as the rows
        System.out.println(String.format(Constants.HEADER_FORMAT, Message.LABEL_CODE,
                Message.LABEL_NAME, Message.LABEL_SPECIALIZATION,
                Message.LABEL_AVAILABILITY));

        // one line per doctor; Doctor.toString() already padded it
        for (String row : responseDTO.getDoctorMap().values()) {
            System.out.println(row);
        }
    }
}</code></pre>
<div class="out">---------&nbsp;Result&nbsp;------------<br>Code&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Name&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Specialization&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Availability<br>D001&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Tran&nbsp;Binh&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Cardiology&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3<br>D002&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Le&nbsp;Lan&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Orthopedics&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;0</div>
<p>Mỗi cột được đệm tới bề rộng cố định (<code>%-10s</code>, <code>%-15s</code>, <code>%-20s</code>), và dòng tiêu đề dùng <em>cùng</em> bề rộng nên các cột thẳng hàng. Trong view không có chữ nào gõ tay: tiêu đề và nhãn lấy từ <code>Message</code>, bề rộng lấy từ <code>Constants</code>.</p>
<div class="pitfall"><b>Bẫy:</b> đề đôi khi không nhất quán — <span class="badge">"Area: "</span> (có dấu cách) cho hình chữ nhật nhưng <span class="badge">"Area:"</span> (không dấu cách) cho hình tròn. Chép từng cái vào <code>Message</code> <em>đúng như in</em>; đừng "dọn cho đẹp". Người chấm so nguyên văn.</div>
<div class="note-ct">Khi phân vân về một nhãn, theo mục <b>Guidelines</b> của đề hơn là ảnh chụp màn hình — chúng thỉnh thoảng vênh nhau, và Guidelines là bản có hiệu lực. Nêu điểm vênh này khi vấn đáp để được điểm cộng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Định dạng số cũng dùng locale mặc định.</b> String.format("%.2f", 3.5) có thể ra &#96;3,50&#96; trên máy locale dấu phẩy và trượt phần so khớp chính xác. Ép dấu chấm bằng String.format(Locale.US, Constants.X_FORMAT, x) — đúng cách lớp Circle ở Bài 5.1 dựng chữ của nó. <em>Vì sao ngoài syllabus: locale của định dạng %f là chi tiết đề không nhắc nhưng màn hình người chấm mặc định có.</em></div>
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
          description: 'Kiểm tra kiến trúc MVC theo Guide, Validation và định dạng output.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'Which layer must every LAB211 program have, according to the check sheet?|||Theo tờ check sheet, tầng nào bài LAB211 nào cũng phải có?', options: ['none — small briefs need no layers|||không cần — đề nhỏ khỏi chia tầng', 'a repository — "Bắt buộc phải có repository"|||repository — "Bắt buộc phải có repository"', 'only a controller|||chỉ controller', 'only a service|||chỉ service'], correctIndex: 1, points: 1 },
              { question: 'The repository should…|||Repository nên…', options: ['print messages to the screen|||in thông báo ra màn hình', 'hold the data with simple CRUD, and throw an Exception whose text comes from Message|||giữ dữ liệu với CRUD đơn giản, và ném Exception với câu chữ lấy từ Message', 'read from Scanner|||đọc từ Scanner', 'contain the menu|||chứa menu'], correctIndex: 1, points: 1 },
              { question: 'Why is reading input with nextInt() then nextLine() buggy?|||Vì sao đọc bằng nextInt() rồi nextLine() bị lỗi?', options: ['nextInt is deprecated|||nextInt đã lỗi thời', 'nextInt leaves the newline, so nextLine reads an empty string|||nextInt để lại ký tự xuống dòng, nên nextLine đọc chuỗi rỗng', 'they cannot be used together at all|||không thể dùng chung được', 'nextLine is slower|||nextLine chậm hơn'], correctIndex: 1, points: 1 },
              { question: 'To avoid a crash on bad numeric input, you should…|||Để tránh sập khi nhập số sai, bạn nên…', options: ['use nextInt() directly|||dùng nextInt() trực tiếp', 'read a line and parse with Integer.parseInt inside try/catch|||đọc một dòng và parse bằng Integer.parseInt trong try/catch', 'ignore the input|||bỏ qua input', 'exit the program|||thoát chương trình'], correctIndex: 1, points: 1 },
              { question: 'printf("%-15s", name) does what?|||printf("%-15s", name) làm gì?', options: ['right-aligns name in width 15|||canh phải name trong bề rộng 15', 'left-aligns name in width 15, padding spaces on the right|||canh trái name trong bề rộng 15, đệm dấu cách bên phải', 'prints 15 copies of name|||in 15 bản của name', 'truncates name to 15|||cắt name còn 15'], correctIndex: 1, points: 1 },
              { question: 'When the brief screenshot and Guidelines disagree on a label, follow…|||Khi ảnh màn hình và Guidelines vênh nhau về một nhãn, theo…', options: ['the screenshot|||ảnh màn hình', 'the Guidelines (authoritative), and note the discrepancy|||Guidelines (có hiệu lực), và nêu điểm vênh', 'whichever is shorter|||cái nào ngắn hơn', 'your own preference|||sở thích của bạn'], correctIndex: 1, points: 1 },
              { question: 'How does the view get the data it prints?|||View nhận dữ liệu để in bằng cách nào?', options: ['as parameters of display(...)|||qua tham số của display(...)', 'through an attribute: the controller calls setResponseDTO(...), then display() with no parameter, once|||qua thuộc tính: controller gọi setResponseDTO(...), rồi display() không tham số, một lần', 'it reads the Scanner itself|||tự đọc Scanner', 'it asks the model to print|||nhờ model in'], correctIndex: 1, points: 1 },
              { question: 'Where do the Scanner and the input checks live?|||Scanner và các hàm kiểm đầu vào nằm ở đâu?', options: ['in the controller|||trong controller', 'Scanner in Main; the checks in utils/Validation (static, no Scanner, no print), called by Main|||Scanner ở Main; hàm kiểm ở utils/Validation (static, không Scanner, không print), do Main gọi', 'in the setters of the model|||trong setter của model', 'in the view|||trong view'], correctIndex: 1, points: 1 },
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
  <div class="lz-step">2 · Lay out the Guide skeleton: constants · model · dto · repository · controller · view · utils · main — plus a service if the brief calculates.</div>
  <div class="lz-step">3 · Write Message/Constants, the model and utils/Validation first — comments included as you type.</div>
  <div class="lz-step">4 · Build one feature end to end, run it, match the screen.</div>
  <div class="lz-step">5 · Repeat feature by feature; compile after each — then self-review with the check sheet.</div>
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
  <div class="lz-step">2 · Dựng khung theo Guide: constants · model · dto · repository · controller · view · utils · main — thêm service nếu đề có tính toán.</div>
  <div class="lz-step">3 · Viết Message/Constants, model và utils/Validation trước — viết comment ngay khi gõ.</div>
  <div class="lz-step">4 · Dựng một chức năng từ đầu tới cuối, chạy, khớp màn hình.</div>
  <div class="lz-step">5 · Lặp từng chức năng; biên dịch sau mỗi cái — rồi tự soát theo tờ check sheet.</div>
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
<p>In the standard P0001 solution the array lives in <code>NumberRepository</code> (a repository is mandatory even here) and <code>SortService</code> sorts it through the model's <code>getValue</code> and <code>swap</code> — braces around every loop body, one statement per line, brackets around the loop bounds, a comment on every block:</p>
<pre><code class="language-java">// The brief's bubble sort, ascending and in place: compare each pair of neighbours and
// swap them when they are in the wrong order; a pass without any swap ends the sort.
private void sortByBubble(NumberArray numberArray) {
    int size = numberArray.getSize();

    // pass i moves the biggest remaining number to position size - 1 - i
    for (int i = 0; i &lt; (size - 1); i++) {
        boolean swapped = false;

        // the last i numbers are already in place, so stop before them
        for (int j = 0; j &lt; (size - 1 - i); j++) {
            // wrong order: the bigger number moves one step right
            if (numberArray.getValue(j) &gt; numberArray.getValue(j + 1)) {
                numberArray.swap(j, j + 1);
                swapped = true;
            }
        }

        // no swap in a whole pass: the array is already sorted
        if (!swapped) {
            return;
        }
    }
}</code></pre>
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
<p>Trong lời giải chuẩn P0001, mảng nằm ở <code>NumberRepository</code> (bài này cũng bắt buộc có repository) và <code>SortService</code> sắp nó qua <code>getValue</code> và <code>swap</code> của model — ngoặc cho mọi thân vòng lặp, mỗi dòng một lệnh, ngoặc quanh cận vòng lặp, comment cho mọi block:</p>
<pre><code class="language-java">// The brief's bubble sort, ascending and in place: compare each pair of neighbours and
// swap them when they are in the wrong order; a pass without any swap ends the sort.
private void sortByBubble(NumberArray numberArray) {
    int size = numberArray.getSize();

    // pass i moves the biggest remaining number to position size - 1 - i
    for (int i = 0; i &lt; (size - 1); i++) {
        boolean swapped = false;

        // the last i numbers are already in place, so stop before them
        for (int j = 0; j &lt; (size - 1 - i); j++) {
            // wrong order: the bigger number moves one step right
            if (numberArray.getValue(j) &gt; numberArray.getValue(j + 1)) {
                numberArray.swap(j, j + 1);
                swapped = true;
            }
        }

        // no swap in a whole pass: the array is already sorted
        if (!swapped) {
            return;
        }
    }
}</code></pre>
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
<pre><code class="language-java">// Returns the code of one "code,name,specialization" line of the data file, e.g.
// "D001,Tran Binh,Cardiology" -&gt; partArray = ["D001", "Tran Binh", "Cardiology"].
public String getCode(String line) {
    String[] partArray = line.split(Constants.SEPARATOR);
    String code = partArray[0].trim();

    // the first part is the code: "D001"
    return code;
}</code></pre>
<div class="out">For line = "D001,Tran Binh,Cardiology" and <code>Constants.SEPARATOR = ","</code>: <b>partArray.length</b> = 3 · <b>partArray[1]</b> = "Tran Binh" · <b>line.length()</b> = 25 (count carefully!)</div>
<div class="pitfall"><b>The split traps (measured, not guessed):</b><br>
• <span class="badge">""</span>.split("\\\\s+") has length <strong>1</strong> (one empty token), but <span class="badge">"   "</span>.split("\\\\s+") has length <strong>0</strong>.<br>
• <span class="badge">"a    b".split(" ")</span> keeps empty strings between the spaces; <span class="badge">split("\\\\s+")</span> or StringTokenizer collapses them.<br>
• <span class="badge">Character.isWhitespace('\\u00A0')</span> is <strong>false</strong> — a non-breaking space is not "whitespace".</div>
<div class="callout warn"><span class="badge">Check sheet 3.8</span> <b>Join strings with StringBuilder — never <code>s += x</code>.</b> This is an item of the review sheet, not a style tip: <q>Khi thực hiện cộng string thì sẽ dùng StringBuilder, không dùng String += String</q>. Each &#96;s = s + x&#96; in a loop also allocates a brand-new String, turning an O(n) join into O(n²); append to one StringBuilder and call toString() once at the end — or, for a fixed layout, use String.format(Constants.X_FORMAT, …).</div>
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
<pre><code class="language-java">// Returns the code of one "code,name,specialization" line of the data file, e.g.
// "D001,Tran Binh,Cardiology" -&gt; partArray = ["D001", "Tran Binh", "Cardiology"].
public String getCode(String line) {
    String[] partArray = line.split(Constants.SEPARATOR);
    String code = partArray[0].trim();

    // the first part is the code: "D001"
    return code;
}</code></pre>
<div class="out">Với line = "D001,Tran Binh,Cardiology" và <code>Constants.SEPARATOR = ","</code>: <b>partArray.length</b> = 3 · <b>partArray[1]</b> = "Tran Binh" · <b>line.length()</b> = 25 (đếm cẩn thận!)</div>
<div class="pitfall"><b>Các bẫy split (đo thật, không đoán):</b><br>
• <span class="badge">""</span>.split("\\\\s+") có độ dài <strong>1</strong> (một token rỗng), nhưng <span class="badge">"   "</span>.split("\\\\s+") có độ dài <strong>0</strong>.<br>
• <span class="badge">"a    b".split(" ")</span> giữ các chuỗi rỗng giữa các dấu cách; <span class="badge">split("\\\\s+")</span> hoặc StringTokenizer gộp chúng.<br>
• <span class="badge">Character.isWhitespace('\\u00A0')</span> là <strong>false</strong> — dấu cách không ngắt không phải "whitespace".</div>
<div class="callout warn"><span class="badge">Tờ check sheet 3.8</span> <b>Nối chuỗi bằng StringBuilder — không bao giờ <code>s += x</code>.</b> Đây là một mục của tờ review, không phải lời khuyên phong cách: <q>Khi thực hiện cộng string thì sẽ dùng StringBuilder, không dùng String += String</q>. Mỗi &#96;s = s + x&#96; trong vòng lặp còn cấp phát một String mới toanh, biến phép nối O(n) thành O(n²); hãy append vào một StringBuilder và gọi toString() một lần ở cuối — hoặc, với bố cục cố định, dùng String.format(Constants.X_FORMAT, …).</div>
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
<p>The rule is checked where the data is (here the controller asks the repository), and the text is the brief's own sentence, kept in <code>Message</code> and filled with <code>String.format</code> — never glued with <code>+</code>:</p>
<pre><code class="language-java">// the brief: a code may appear only once in the database
if (doctorRepository.isExistDoctor(requestDTO.getCode())) {
    throw new Exception(String.format(Message.DUPLICATE_CODE, requestDTO.getCode()));
}</code></pre>
<p>Main catches it and prints it — the program never crashes, and the view is never asked to print an error:</p>
<pre><code class="language-java">// Main: one case of the menu - read and check, then one call to the controller
try {
    requestDTO = inputAdd(sc);
    controller.addDoctor(requestDTO);
} catch (Exception e) {
    // "Doctor code [D001] is duplicate" - written in Message, thrown by the controller
    System.out.println(e.getMessage());
}</code></pre>
<p>Format checks (phone, email, code patterns) use regex — the pattern in <code>Constants</code>, the message in <code>Message</code>, the check in <code>utils/Validation</code>:</p>
<pre><code class="language-java">// A phone number: 0 followed by nine digits.
public static final String PHONE_PATTERN = "0\\\\d{9}";</code></pre>
<pre><code class="language-java">// Checks a phone number: 0 followed by nine digits (the pattern lives in Constants).
public static String checkPhone(String input) throws Exception {
    String phone = getText(input);

    // letters, spaces or the wrong length: the brief's own message, kept in Message
    if (!phone.matches(Constants.PHONE_PATTERN)) {
        throw new Exception(Message.INVALID_PHONE);
    }

    return phone;
}</code></pre>
<div class="pitfall"><b>Spec conflict trap:</b> the on-screen wording and the Guidelines wording sometimes differ, e.g. screen "You must input digidt." vs Guidelines "You must input digit." <strong>Always follow Guidelines</strong> (the effective version) and mention the discrepancy in a viva.</div>
<div class="callout danger">A program that throws an uncaught exception on bad input scores zero for that run. Main wraps each case in try/catch and prints e.getMessage(); validation is not optional polish, it is the difference between a mark and a zero.</div>
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
<p>Luật được kiểm ở nơi có dữ liệu (ở đây controller hỏi repository), và câu chữ là nguyên văn của đề, nằm trong <code>Message</code> và được điền bằng <code>String.format</code> — không bao giờ nối bằng <code>+</code>:</p>
<pre><code class="language-java">// the brief: a code may appear only once in the database
if (doctorRepository.isExistDoctor(requestDTO.getCode())) {
    throw new Exception(String.format(Message.DUPLICATE_CODE, requestDTO.getCode()));
}</code></pre>
<p>Main bắt và in nó — chương trình không bao giờ sập, và không bao giờ nhờ view in lỗi:</p>
<pre><code class="language-java">// Main: one case of the menu - read and check, then one call to the controller
try {
    requestDTO = inputAdd(sc);
    controller.addDoctor(requestDTO);
} catch (Exception e) {
    // "Doctor code [D001] is duplicate" - written in Message, thrown by the controller
    System.out.println(e.getMessage());
}</code></pre>
<p>Kiểm định dạng (số điện thoại, email, mẫu mã) dùng regex — mẫu nằm trong <code>Constants</code>, câu báo lỗi trong <code>Message</code>, hàm kiểm trong <code>utils/Validation</code>:</p>
<pre><code class="language-java">// A phone number: 0 followed by nine digits.
public static final String PHONE_PATTERN = "0\\\\d{9}";</code></pre>
<pre><code class="language-java">// Checks a phone number: 0 followed by nine digits (the pattern lives in Constants).
public static String checkPhone(String input) throws Exception {
    String phone = getText(input);

    // letters, spaces or the wrong length: the brief's own message, kept in Message
    if (!phone.matches(Constants.PHONE_PATTERN)) {
        throw new Exception(Message.INVALID_PHONE);
    }

    return phone;
}</code></pre>
<div class="pitfall"><b>Bẫy đề tự vênh:</b> câu chữ trên màn hình và trong Guidelines đôi khi khác nhau, vd màn hình "You must input digidt." vs Guidelines "You must input digit." <strong>Luôn theo Guidelines</strong> (bản có hiệu lực) và nêu điểm vênh khi vấn đáp.</div>
<div class="callout danger">Chương trình ném ngoại lệ không bắt khi nhập sai sẽ 0 điểm lần chạy đó. Main bọc mỗi case trong try/catch và in e.getMessage(); validate không phải "đánh bóng" tùy chọn, nó là ranh giới giữa có điểm và 0 điểm.</div>
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
<p>The shape (a regex) and the pattern <code>"dd/MM/yyyy"</code> live in <code>Constants</code> (item 2.10); the check lives in <code>utils/Validation</code>:</p>
<pre><code class="language-java">// The shape of a date: two digits, two digits, four digits.
public static final String DATE_PATTERN = "\\\\d{2}/\\\\d{2}/\\\\d{4}";

// The pattern SimpleDateFormat reads a date with.
public static final String DATE_FORMAT = "dd/MM/yyyy";</code></pre>
<pre><code class="language-java">// Converts a dd/MM/yyyy date; 31/02/2003 is refused instead of becoming 03/03/2003.
public static Date checkDate(String input) throws Exception {
    String text = getText(input);
    SimpleDateFormat formatter = new SimpleDateFormat(Constants.DATE_FORMAT);
    Date date = null;

    // "5/6/2015", "15-06-2015", "26/06/2015abc": not the shape dd/MM/yyyy
    if (!text.matches(Constants.DATE_PATTERN)) {
        throw new Exception(Message.INVALID_DATE);
    }

    // REQUIRED: without it 31/02 silently becomes 03/03
    formatter.setLenient(false);

    // right shape: now the calendar decides whether the day exists
    try {
        date = formatter.parse(text);
    } catch (ParseException e) {
        // 31/02, 29/02 of a non-leap year, month 13...
        throw new Exception(Message.INVALID_DATE);
    }

    return date;
}</code></pre>
<div class="pitfall"><b>Measured facts (do not trust memory):</b><br>
• With <span class="badge">LocalDate.parse("31/02/2003", …)</span> in SMART mode, Java nudges it to <span class="badge">2003-02-28</span>. To reject you need <span class="badge">ResolverStyle.STRICT</span> <em>and</em> pattern <span class="badge">uuuu</span> (not <span class="badge">yyyy</span>).<br>
• Even <span class="badge">setLenient(false)</span> can accept <span class="badge">"26-06-2015rubbish"</span> — parsing stops early and drops the tail. That is why the method above checks the shape with a regex first (or format the result back and compare it with the input).</div>
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
<p>Hình dạng (một regex) và mẫu <code>"dd/MM/yyyy"</code> nằm ở <code>Constants</code> (mục 2.10); hàm kiểm nằm ở <code>utils/Validation</code>:</p>
<pre><code class="language-java">// The shape of a date: two digits, two digits, four digits.
public static final String DATE_PATTERN = "\\\\d{2}/\\\\d{2}/\\\\d{4}";

// The pattern SimpleDateFormat reads a date with.
public static final String DATE_FORMAT = "dd/MM/yyyy";</code></pre>
<pre><code class="language-java">// Converts a dd/MM/yyyy date; 31/02/2003 is refused instead of becoming 03/03/2003.
public static Date checkDate(String input) throws Exception {
    String text = getText(input);
    SimpleDateFormat formatter = new SimpleDateFormat(Constants.DATE_FORMAT);
    Date date = null;

    // "5/6/2015", "15-06-2015", "26/06/2015abc": not the shape dd/MM/yyyy
    if (!text.matches(Constants.DATE_PATTERN)) {
        throw new Exception(Message.INVALID_DATE);
    }

    // REQUIRED: without it 31/02 silently becomes 03/03
    formatter.setLenient(false);

    // right shape: now the calendar decides whether the day exists
    try {
        date = formatter.parse(text);
    } catch (ParseException e) {
        // 31/02, 29/02 of a non-leap year, month 13...
        throw new Exception(Message.INVALID_DATE);
    }

    return date;
}</code></pre>
<div class="pitfall"><b>Sự thật đo được (đừng tin trí nhớ):</b><br>
• Với <span class="badge">LocalDate.parse("31/02/2003", …)</span> ở chế độ SMART, Java nắn thành <span class="badge">2003-02-28</span>. Muốn từ chối cần <span class="badge">ResolverStyle.STRICT</span> <em>và</em> mẫu <span class="badge">uuuu</span> (không phải <span class="badge">yyyy</span>).<br>
• Ngay cả <span class="badge">setLenient(false)</span> vẫn chấp nhận <span class="badge">"26-06-2015rubbish"</span> — parse dừng sớm và bỏ phần đuôi. Vì thế hàm ở trên kiểm hình dạng bằng regex trước (hoặc format kết quả ngược lại rồi so với input).</div>
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
<pre><code class="language-java">// Converts a binary text: its decimal value, its hexadecimal text, and back to binary.
public String convertBinary(String binaryText) {
    int decimalValue = Integer.parseInt(binaryText, Constants.BINARY_BASE);  // "1010" -&gt; 10
    String hexText = Integer.toHexString(decimalValue);                      // 10 -&gt; "a"
    String backText = Integer.toBinaryString(decimalValue);                  // 10 -&gt; "1010"

    // the three results joined by a format, never by "+"
    return String.format(Constants.BASE_FORMAT, decimalValue, hexText, backText);
}</code></pre>
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
<pre><code class="language-java">// Converts a binary text: its decimal value, its hexadecimal text, and back to binary.
public String convertBinary(String binaryText) {
    int decimalValue = Integer.parseInt(binaryText, Constants.BINARY_BASE);  // "1010" -&gt; 10
    String hexText = Integer.toHexString(decimalValue);                      // 10 -&gt; "a"
    String backText = Integer.toBinaryString(decimalValue);                  // 10 -&gt; "1010"

    // the three results joined by a format, never by "+"
    return String.format(Constants.BASE_FORMAT, decimalValue, hexText, backText);
}</code></pre>
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
<p class="lead">The largest group of briefs is "manage a list of X": add, display, update, delete, search, save. They all share one skeleton — the Main of the teacher's sample project. Learn it once and half of LAB211 becomes fill-in-the-blank.</p>
<pre><code class="language-java">// Starts the program: shows the menu until the user chooses Exit.
public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    DoctorController controller = new DoctorController();
    DoctorRequestDTO requestDTO = null;
    boolean running = true;
    int choice = 0;

    // show the menu again after every function, until Exit is chosen
    while (running) {
        System.out.println(Message.MENU);
        choice = inputChoice(sc);

        // any business error of the chosen function is shown here
        try {
            // run the function the user picked: one call to the controller per option
            switch (choice) {
                // option 1: read a new doctor, then add it
                case Constants.MENU_ADD:
                    requestDTO = inputAdd(sc);
                    controller.addDoctor(requestDTO);
                    break;

                // option 2: read the code (checked at once) and the new values, then
                // update that doctor
                case Constants.MENU_UPDATE:
                    requestDTO = inputUpdate(sc, controller);
                    controller.updateDoctor(requestDTO);
                    break;

                // option 3: read a code, then delete that doctor
                case Constants.MENU_DELETE:
                    requestDTO = inputDelete(sc);
                    controller.deleteDoctor(requestDTO);
                    break;

                // option 4: read a text, then list the doctors that contain it
                case Constants.MENU_SEARCH:
                    requestDTO = inputSearch(sc);
                    controller.searchDoctor(requestDTO);
                    break;

                // option 5: stop the loop
                case Constants.MENU_EXIT:
                    running = false;
                    System.out.println(Message.GOODBYE);
                    break;

                // unreachable: inputChoice only returns 1..5
                default:
                    break;
            }
        } catch (Exception e) {
            // the message was written in Message and thrown by the controller
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<p>Read it against the check sheet. Variables are declared at the top of the block <em>and</em> given a value (<code>int choice = 0;</code> — items 2.6 and 3.7). The menu text is <code>Message.MENU</code> and the case labels are <code>Constants.MENU_ADD</code>… (2.10, 2.11). Each case reads and validates its input in Main, then calls the controller <b>once</b> (the Guide: one controller call per workflow). Every <code>break;</code> sits on its own line (2.7), and there is a comment before every case (1.6). A broken rule comes back as an exception and is printed here, in Main, with <code>e.getMessage()</code>.</p>
<div class="pitfall"><b>One call per case — and the one exception to it.</b> In P0055, Update must answer "Doctor code doesn’t exist" right after the code is typed, before it asks for the other fields. The standard solution adds one extra call made <em>only to check</em> — <code>controller.checkExistDoctor(requestDTO)</code> throws and prints nothing — and then the one real call. Anything beyond that breaks "one render per flow".</div>
<p>Pick the collection your repository holds to match the brief:</p>
<table>
  <thead><tr><th>Need</th><th>Use</th></tr></thead>
  <tbody>
    <tr><td>ordered list, duplicates OK</td><td><span class="badge">ArrayList</span> — name it <code>xxxList</code></td></tr>
    <tr><td>key → value, keep insertion order</td><td><span class="badge">LinkedHashMap</span> — name it <code>xxxMap</code></td></tr>
    <tr><td>fast lookup by unique key</td><td><span class="badge">HashMap</span> — name it <code>xxxMap</code></td></tr>
  </tbody>
</table>
<div class="note-ct">If the brief keeps its data in a file, Main reads the file once at start-up and the repository saves through <code>FileUtils</code> after <em>every</em> change, so a crash mid-session never loses data (Lesson 5.2). Use a lowercase key when the brief says lookups are case-insensitive, and compare text with <code>equals</code> / <code>equalsIgnoreCase</code>, never <code>==</code> (item 3.5).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Delete safely with removeIf.</b> On JDK 8, doctorList.removeIf(doctor -&gt; doctor.getCode().equals(code)) inside the repository removes the matches in one statement, without the ConcurrentModificationException you get from removing inside a for-each. It is shorter and safer than a manual index loop. <em>Why beyond the syllabus: the brief says "delete", never which idiom survives mid-iteration removal.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0058-write-program-dictionary?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🗂️</span>
  <span class="lc-body"><span class="lc-title">Practise: dictionary (CRUD + file)</span><span class="lc-sub">The first full CRUD skeleton with a LinkedHashMap.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 4 · Bài 4.1</span>
<h2>Khung menu CRUD dùng lại ở mọi nơi</h2>
<p class="lead">Nhóm đề lớn nhất là "quản lý một danh sách X": thêm, hiển thị, sửa, xoá, tìm, lưu. Tất cả chung một khung — chính là Main trong project mẫu của thầy. Thuộc nó một lần và nửa số bài LAB211 thành điền vào chỗ trống.</p>
<pre><code class="language-java">// Starts the program: shows the menu until the user chooses Exit.
public static void main(String[] args) {
    Scanner sc = new Scanner(System.in);
    DoctorController controller = new DoctorController();
    DoctorRequestDTO requestDTO = null;
    boolean running = true;
    int choice = 0;

    // show the menu again after every function, until Exit is chosen
    while (running) {
        System.out.println(Message.MENU);
        choice = inputChoice(sc);

        // any business error of the chosen function is shown here
        try {
            // run the function the user picked: one call to the controller per option
            switch (choice) {
                // option 1: read a new doctor, then add it
                case Constants.MENU_ADD:
                    requestDTO = inputAdd(sc);
                    controller.addDoctor(requestDTO);
                    break;

                // option 2: read the code (checked at once) and the new values, then
                // update that doctor
                case Constants.MENU_UPDATE:
                    requestDTO = inputUpdate(sc, controller);
                    controller.updateDoctor(requestDTO);
                    break;

                // option 3: read a code, then delete that doctor
                case Constants.MENU_DELETE:
                    requestDTO = inputDelete(sc);
                    controller.deleteDoctor(requestDTO);
                    break;

                // option 4: read a text, then list the doctors that contain it
                case Constants.MENU_SEARCH:
                    requestDTO = inputSearch(sc);
                    controller.searchDoctor(requestDTO);
                    break;

                // option 5: stop the loop
                case Constants.MENU_EXIT:
                    running = false;
                    System.out.println(Message.GOODBYE);
                    break;

                // unreachable: inputChoice only returns 1..5
                default:
                    break;
            }
        } catch (Exception e) {
            // the message was written in Message and thrown by the controller
            System.out.println(e.getMessage());
        }
    }
}</code></pre>
<p>Soát nó theo tờ checklist. Biến khai báo ở đầu block <em>và</em> có giá trị khởi tạo (<code>int choice = 0;</code> — mục 2.6 và 3.7). Chữ của menu là <code>Message.MENU</code>, nhãn case là <code>Constants.MENU_ADD</code>… (2.10, 2.11). Mỗi case nhập và validate ở Main rồi gọi controller <b>một lần</b> (Guide: mỗi workflow chỉ gọi vào controller 1 lần). Mỗi <code>break;</code> nằm trên dòng riêng (2.7), và có comment trước mỗi case (1.6). Lỗi quay về dưới dạng ngoại lệ và được in ngay tại Main bằng <code>e.getMessage()</code>.</p>
<div class="pitfall"><b>Mỗi case một lần gọi — và ngoại lệ duy nhất.</b> Ở P0055, Update phải báo "Doctor code doesn’t exist" ngay sau khi gõ mã, trước khi hỏi các ô khác. Lời giải chuẩn thêm đúng một lần gọi <em>chỉ để kiểm</em> — <code>controller.checkExistDoctor(requestDTO)</code> chỉ ném lỗi, không in gì — rồi mới tới lần gọi thật. Hơn thế là phá luật "mỗi luồng render một lần".</div>
<p>Chọn collection cho repository khớp với đề:</p>
<table>
  <thead><tr><th>Cần</th><th>Dùng</th></tr></thead>
  <tbody>
    <tr><td>danh sách có thứ tự, cho phép trùng</td><td><span class="badge">ArrayList</span> — đặt tên <code>xxxList</code></td></tr>
    <tr><td>khoá → giá trị, giữ thứ tự chèn</td><td><span class="badge">LinkedHashMap</span> — đặt tên <code>xxxMap</code></td></tr>
    <tr><td>tra nhanh theo khoá duy nhất</td><td><span class="badge">HashMap</span> — đặt tên <code>xxxMap</code></td></tr>
  </tbody>
</table>
<div class="note-ct">Nếu đề giữ dữ liệu trong tệp, Main đọc tệp một lần lúc khởi động, còn repository lưu qua <code>FileUtils</code> sau <em>mỗi</em> thay đổi, để sập giữa chừng không bao giờ mất dữ liệu (Bài 5.2). Dùng khoá chữ thường khi đề nói tra cứu không phân biệt hoa/thường, và so chuỗi bằng <code>equals</code> / <code>equalsIgnoreCase</code>, không bao giờ bằng <code>==</code> (mục 3.5).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Xoá an toàn bằng removeIf.</b> Trên JDK 8, doctorList.removeIf(doctor -&gt; doctor.getCode().equals(code)) đặt trong repository xoá các phần tử khớp chỉ bằng một lệnh, không gặp ConcurrentModificationException như khi xoá trong for-each. Nó ngắn và an toàn hơn vòng lặp chỉ số thủ công. <em>Vì sao ngoài syllabus: đề nói "xoá", không nói cách viết nào sống sót khi xoá giữa lúc duyệt.</em></div>
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
<p>Sorting is business, so it lives in the <b>service</b> — the controller never touches <code>Student</code>. The list comes from the repository and is named <code>studentList</code> (item 1.5):</p>
<pre><code class="language-java">// Sorts by GPA from high to low; students with the same GPA by name from A to Z,
// ignoring upper/lower case (check sheet 3.5).
public void sortByGpaThenName(List&lt;Student&gt; studentList) {
    // one comparator built from two rules
    studentList.sort(Comparator.comparingDouble(Student::getGpa).reversed()
            .thenComparing(Student::getName, String.CASE_INSENSITIVE_ORDER));
}</code></pre>
<p>The classic form still worth knowing (works on JDK 8 everywhere):</p>
<pre><code class="language-java">// The same job in the classic JDK 8 form: an anonymous Comparator, by name only.
public void sortByName(List&lt;Student&gt; studentList) {
    // compare two students by name, ignoring upper/lower case
    Collections.sort(studentList, new Comparator&lt;Student&gt;() {
        // A negative number puts the first student before the second one.
        @Override
        public int compare(Student first, Student second) {
            return first.getName().compareToIgnoreCase(second.getName());
        }
    });
}</code></pre>
<div class="pitfall"><b>Trap:</b> to sort strings alphabetically use <span class="badge">compareTo</span>; do not compare with <span class="badge">&lt;</span> or <span class="badge">==</span>. For "natural order" on your model class, implement <span class="badge">Comparable</span> and its <span class="badge">compareTo</span>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Override hashCode whenever you override equals.</b> If your model's equals() compares by code so contains() works, a HashSet or HashMap keyed on that model still misbehaves unless hashCode() is consistent with it. The contract is: equal objects must return equal hash codes. <em>Why beyond the syllabus: the equals/hashCode pair is a Java contract the brief never restates.</em></div>
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
<p>Sắp xếp là nghiệp vụ, nên nó nằm ở <b>service</b> — controller không bao giờ đụng tới <code>Student</code>. Danh sách lấy từ repository và đặt tên <code>studentList</code> (mục 1.5):</p>
<pre><code class="language-java">// Sorts by GPA from high to low; students with the same GPA by name from A to Z,
// ignoring upper/lower case (check sheet 3.5).
public void sortByGpaThenName(List&lt;Student&gt; studentList) {
    // one comparator built from two rules
    studentList.sort(Comparator.comparingDouble(Student::getGpa).reversed()
            .thenComparing(Student::getName, String.CASE_INSENSITIVE_ORDER));
}</code></pre>
<p>Dạng kinh điển vẫn nên biết (chạy trên JDK 8 mọi nơi):</p>
<pre><code class="language-java">// The same job in the classic JDK 8 form: an anonymous Comparator, by name only.
public void sortByName(List&lt;Student&gt; studentList) {
    // compare two students by name, ignoring upper/lower case
    Collections.sort(studentList, new Comparator&lt;Student&gt;() {
        // A negative number puts the first student before the second one.
        @Override
        public int compare(Student first, Student second) {
            return first.getName().compareToIgnoreCase(second.getName());
        }
    });
}</code></pre>
<div class="pitfall"><b>Bẫy:</b> để sắp chuỗi theo bảng chữ cái dùng <span class="badge">compareTo</span>; đừng so bằng <span class="badge">&lt;</span> hay <span class="badge">==</span>. Cho "thứ tự tự nhiên" trên lớp model, cài <span class="badge">Comparable</span> và <span class="badge">compareTo</span> của nó.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Override hashCode mỗi khi override equals.</b> Nếu equals() của model so theo mã để contains() chạy, thì HashSet hay HashMap khóa theo model đó vẫn hỏng trừ khi hashCode() nhất quán với nó. Hợp đồng là: hai đối tượng bằng nhau phải trả cùng mã băm. <em>Vì sao ngoài syllabus: cặp equals/hashCode là hợp đồng Java đề không bao giờ nhắc lại.</em></div>
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
          description: 'Ghép model + repository + service + controller + view + utils/Validation + Main theo Guide thành hệ quản lý — bác sĩ, công nhân, liên hệ, địa lý.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 4 · Lesson 4.3</span>
<h2>Full management programs — putting it together</h2>
<p class="lead">Now combine everything the Guide way: a model, a repository that owns the data, a controller, a view with its ResponseDTO, utils/Validation, and Main with the menu. These medium briefs are exactly the shape of a typical review. Build several until the structure is automatic.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>model</b> — e.g. <code>Doctor(code, name, specialization, availability)</code>: private fields, get/set, <code>toString()</code> that returns its table row. No print.</div>
  <div class="lz-layer"><b>repository</b> — <code>LinkedHashMap&lt;String, Doctor&gt; doctorMap</code>: add / update / delete / search; <code>throw new Exception(Message.X)</code> when the data forbids the operation.</div>
  <div class="lz-layer"><b>service</b> — only when there is business on top of CRUD: statistics, a report, a salary rule, a login check.</div>
  <div class="lz-layer"><b>controller</b> — takes the RequestDTO, calls the service/repository, fills a ResponseDTO, then <code>view.setResponseDTO(...)</code> and <code>view.display()</code> once. No Scanner, no print, no model.</div>
  <div class="lz-layer"><b>view</b> — the ResponseDTO in an attribute, <code>display()</code> without parameters.</div>
  <div class="lz-layer"><b>main</b> — the menu loop of Lesson 4.1: Scanner, Validation, RequestDTO, one controller call per case, <code>catch</code> + <code>e.getMessage()</code>.</div>
</div>
<p>The repository of the Guide sample — the data plus simple CRUD, with the brief's messages taken from <code>Message</code>:</p>
<pre><code class="language-java">// The "database": doctor code -&gt; doctor, in the order they were added.
private LinkedHashMap&lt;String, Doctor&gt; doctorMap;

// Creates an empty repository.
public DoctorRepository() {
    doctorMap = new LinkedHashMap&lt;&gt;();
}

// Throws when the database does not exist, as the brief asks every function to do
// ("Database does not exist" when the HashMap is null).
private void checkDatabase() throws Exception {
    // the brief's first rule for all four functions
    if (doctorMap == null) {
        throw new Exception(Message.DATABASE_NOT_EXIST);
    }
}

// Tells whether a doctor with this code is stored.
public boolean isExistDoctor(String code) throws Exception {
    // the brief: "Database does not exist" when the HashMap is null
    checkDatabase();
    return doctorMap.containsKey(code);
}

// Stores a new doctor built from the request (the brief's "Put function").
public boolean addDoctor(DoctorRequestDTO requestDTO) throws Exception {
    Doctor doctor = new Doctor(requestDTO.getCode(), requestDTO.getName(),
            requestDTO.getSpecialization(), requestDTO.getAvailability());

    // the brief: "Database does not exist" when the HashMap is null
    checkDatabase();

    // the code is the key; true = the doctor is added
    doctorMap.put(doctor.getCode(), doctor);
    return true;
}</code></pre>
<div class="callout ok">Doctor, Worker, Contact and Geographic management are the same program with different fields. Once you have built one from scratch, matched its output and passed the check sheet, the rest are variations — this is where fluency compounds.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Write one private helper and reuse it.</b> Add, update and delete all need "does this code exist, and where"; one private method in the repository (the sample's <code>checkDatabase()</code> and <code>contains()</code> are the same idea) removes duplicated scan loops and the bugs that come from fixing one copy but not the others. Mentors reward this DRY refactor in the viva. <em>Why beyond the syllabus: the brief lists features, not the internal structure that keeps them consistent.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0054-develop-the-contact-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">📇</span>
  <span class="lc-body"><span class="lc-title">Practise the management cluster</span><span class="lc-sub">Contact (P0054), Doctor (P0055), Worker (P0056), Geographic (P0052).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 4 · Bài 4.3</span>
<h2>Chương trình quản lý hoàn chỉnh — ghép lại</h2>
<p class="lead">Giờ ghép tất cả theo đúng Guide: một model, một repository giữ dữ liệu, một controller, một view có ResponseDTO, utils/Validation, và Main có menu. Các đề trung bình này đúng là hình dạng một buổi review điển hình. Dựng vài bài tới khi cấu trúc thành phản xạ.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>model</b> — vd <code>Doctor(code, name, specialization, availability)</code>: trường private, get/set, <code>toString()</code> trả về dòng bảng của nó. Không print.</div>
  <div class="lz-layer"><b>repository</b> — <code>LinkedHashMap&lt;String, Doctor&gt; doctorMap</code>: thêm / sửa / xoá / tìm; <code>throw new Exception(Message.X)</code> khi dữ liệu không cho phép thao tác đó.</div>
  <div class="lz-layer"><b>service</b> — chỉ khi có nghiệp vụ ngoài CRUD: thống kê, báo cáo, luật tăng lương, kiểm đăng nhập.</div>
  <div class="lz-layer"><b>controller</b> — nhận RequestDTO, gọi service/repository, điền ResponseDTO, rồi <code>view.setResponseDTO(...)</code> và <code>view.display()</code> một lần. Không Scanner, không print, không model.</div>
  <div class="lz-layer"><b>view</b> — ResponseDTO nằm trong thuộc tính, <code>display()</code> không tham số.</div>
  <div class="lz-layer"><b>main</b> — vòng lặp menu của Bài 4.1: Scanner, Validation, RequestDTO, mỗi case gọi controller một lần, <code>catch</code> + <code>e.getMessage()</code>.</div>
</div>
<p>Repository của project mẫu trong Guide — dữ liệu cộng CRUD đơn giản, câu thông báo của đề lấy từ <code>Message</code>:</p>
<pre><code class="language-java">// The "database": doctor code -&gt; doctor, in the order they were added.
private LinkedHashMap&lt;String, Doctor&gt; doctorMap;

// Creates an empty repository.
public DoctorRepository() {
    doctorMap = new LinkedHashMap&lt;&gt;();
}

// Throws when the database does not exist, as the brief asks every function to do
// ("Database does not exist" when the HashMap is null).
private void checkDatabase() throws Exception {
    // the brief's first rule for all four functions
    if (doctorMap == null) {
        throw new Exception(Message.DATABASE_NOT_EXIST);
    }
}

// Tells whether a doctor with this code is stored.
public boolean isExistDoctor(String code) throws Exception {
    // the brief: "Database does not exist" when the HashMap is null
    checkDatabase();
    return doctorMap.containsKey(code);
}

// Stores a new doctor built from the request (the brief's "Put function").
public boolean addDoctor(DoctorRequestDTO requestDTO) throws Exception {
    Doctor doctor = new Doctor(requestDTO.getCode(), requestDTO.getName(),
            requestDTO.getSpecialization(), requestDTO.getAvailability());

    // the brief: "Database does not exist" when the HashMap is null
    checkDatabase();

    // the code is the key; true = the doctor is added
    doctorMap.put(doctor.getCode(), doctor);
    return true;
}</code></pre>
<div class="callout ok">Quản lý Bác sĩ, Công nhân, Liên hệ và Địa lý là cùng một chương trình với trường khác nhau. Khi đã tự dựng một cái từ đầu, khớp output và qua tờ checklist, phần còn lại chỉ là biến thể — đây là nơi phản xạ tích luỹ.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết một hàm phụ private và dùng lại.</b> Thêm, sửa và xoá đều cần "mã này có tồn tại không, và ở đâu"; một hàm private duy nhất trong repository (<code>checkDatabase()</code> và <code>contains()</code> của project mẫu là cùng ý đó) loại bỏ các vòng quét lặp lại và các bug đến từ việc sửa một bản mà quên bản kia. Mentor thưởng cho refactor DRY này khi vấn đáp. <em>Vì sao ngoài syllabus: đề liệt kê chức năng, không liệt kê cấu trúc bên trong giữ cho chúng nhất quán.</em></div>
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
              { question: 'A duplicate code is reported by…|||Mã trùng được báo bằng cách…', options: ['the repository printing to the screen|||repository in ra màn hình', 'throwing an Exception with a Message constant, which Main catches and prints|||ném Exception với hằng trong Message, Main bắt và in', 'returning null silently|||trả null âm thầm', 'exiting the program|||thoát chương trình'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ PHẦN 5 — OOP & TỆP (NHÓM HARD) ══════════════════ */
    {
      title: 'Part 5 — OOP models & File I/O (HARD)|||Phần 5 — OOP trong model & Tệp (nhóm HARD)',
      description: 'Nhóm khó: kế thừa/đa hình/abstract trong model, đọc/ghi tệp qua utils/FileUtils (text/CSV/zip) và các bài lớn nhiều tầng.',
      lessons: [
        {
          title: '5.1 — OOP inside the model|||5.1 — OOP trong model',
          slug: 'lab211-oop-trong-entity',
          type: 'VIDEO',
          description: 'Kế thừa, đa hình, abstract class/interface áp dụng vào model (model không bao giờ in) — Shapes, Bees, Cards, Car showroom.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 5 · Lesson 5.1</span>
<h2>OOP inside the model — inheritance &amp; polymorphism at work</h2>
<p class="lead">The harder briefs finally use real OOP: a parent class with subclasses that each behave differently. Shapes with a common <span class="badge">getArea()</span>, cards with an enum suit, bees with a shared life cycle. This is where PRO192 pays off. All of it lives in the <b>model</b> package — and the model still never prints (the Guide: no Scanner input and no printf here). Whatever must be shown leaves the model as text from <code>toString()</code>, and the view prints it.</p>
<pre><code class="language-java">package model;

/**
 * MODEL: the common parent of every shape. It describes a shape and never prints.
 *
 * @author HE176322
 */
public abstract class Shape {

    // Each subclass returns its own area.
    public abstract double getArea();

    // Each subclass describes itself; the view is the one that prints this text.
    @Override
    public abstract String toString();
}</code></pre>
<pre><code class="language-java">package model;

import constants.Message;
import java.util.Locale;

/**
 * MODEL: a circle, given by its radius.
 *
 * @author HE176322
 */
public class Circle extends Shape {

    // Radius of the circle.
    private double radius;

    // Creates a circle with its radius.
    public Circle(double radius) {
        this.radius = radius;
    }

    // Returns the radius.
    public double getRadius() {
        return radius;
    }

    // Changes the radius.
    public void setRadius(double radius) {
        this.radius = radius;
    }

    // Polymorphism: the area formula of a circle, A = PI * r * r.
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }

    // The text the view prints; Locale.US keeps the dot ("3.14", never "3,14").
    @Override
    public String toString() {
        return String.format(Locale.US, Message.CIRCLE_TEXT, radius, getArea());
    }
}</code></pre>
<div class="out">An <code>ArrayList&lt;Shape&gt; shapeList</code> kept by the repository can hold circles, rectangles and triangles; the service calls <span class="badge">getArea()</span> on each one and the right formula runs — that is polymorphism. The view prints each <code>toString()</code> it receives in its ResponseDTO.</div>
<div class="pitfall"><b>When the brief tells a model class to print.</b> P0061 wants <code>printResult()</code> inside <code>Shape</code>, P0052 a <code>display()</code> in <code>Country</code>, L.P0013 a <code>makeSound()</code> that prints "Tin tin tin". The check sheet says the model does not work with the view and prints nothing. The standard solutions keep the brief's names but move the printing: the model method <em>returns</em> the text and the view prints it (P0061 keeps the name <code>printResult()</code> on the view, with no parameter). Say exactly that in the viva.</div>
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
<h2>OOP trong model — kế thừa &amp; đa hình vào việc</h2>
<p class="lead">Các đề khó hơn cuối cùng dùng OOP thật: một lớp cha với các lớp con mỗi cái hành xử khác nhau. Hình với <span class="badge">getArea()</span> chung, lá bài với enum chất, ong với vòng đời chung. Đây là chỗ PRO192 sinh lời. Tất cả nằm trong package <b>model</b> — và model vẫn không bao giờ in (Guide: không được input từ scanner hoặc output printf ở đây). Thứ gì cần hiển thị thì rời model dưới dạng chữ qua <code>toString()</code>, và view in nó ra.</p>
<pre><code class="language-java">package model;

/**
 * MODEL: the common parent of every shape. It describes a shape and never prints.
 *
 * @author HE176322
 */
public abstract class Shape {

    // Each subclass returns its own area.
    public abstract double getArea();

    // Each subclass describes itself; the view is the one that prints this text.
    @Override
    public abstract String toString();
}</code></pre>
<pre><code class="language-java">package model;

import constants.Message;
import java.util.Locale;

/**
 * MODEL: a circle, given by its radius.
 *
 * @author HE176322
 */
public class Circle extends Shape {

    // Radius of the circle.
    private double radius;

    // Creates a circle with its radius.
    public Circle(double radius) {
        this.radius = radius;
    }

    // Returns the radius.
    public double getRadius() {
        return radius;
    }

    // Changes the radius.
    public void setRadius(double radius) {
        this.radius = radius;
    }

    // Polymorphism: the area formula of a circle, A = PI * r * r.
    @Override
    public double getArea() {
        return Math.PI * radius * radius;
    }

    // The text the view prints; Locale.US keeps the dot ("3.14", never "3,14").
    @Override
    public String toString() {
        return String.format(Locale.US, Message.CIRCLE_TEXT, radius, getArea());
    }
}</code></pre>
<div class="out">Một <code>ArrayList&lt;Shape&gt; shapeList</code> do repository giữ có thể chứa hình tròn, chữ nhật, tam giác; service gọi <span class="badge">getArea()</span> trên từng hình và đúng công thức được chạy — đó là đa hình. View in <code>toString()</code> của từng hình mà nó nhận trong ResponseDTO.</div>
<div class="pitfall"><b>Khi đề bắt một lớp model tự in.</b> P0061 đòi <code>printResult()</code> nằm trong <code>Shape</code>, P0052 đòi <code>display()</code> trong <code>Country</code>, L.P0013 đòi <code>makeSound()</code> in ra "Tin tin tin". Tờ checklist ghi model không làm việc với View, không thực hiện print thông tin gì. Các lời giải chuẩn giữ tên hàm của đề nhưng dời việc in đi: hàm của model <em>trả về</em> chữ, view in chữ đó (P0061 giữ tên <code>printResult()</code> ở view, không tham số). Khi vấn đáp, nói đúng như vậy.</div>
<div class="pitfall"><b>Bẫy Card/enum:</b> khi đề cố định bộ 52 dòng, so từng dòng với màn hình mẫu; khi nó xáo bài, kiểm <em>quan hệ</em> (các dòng đã sắp bằng tập chưa sắp) vì output chính xác là ngẫu nhiên.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Viết @Override trên mọi hàm ghi đè.</b> Nó không tốn gì và biến một lỗi âm thầm — sai danh sách tham số tạo ra hàm mới thay vì ghi đè — thành lỗi biên dịch bạn bắt ngay. Điều này quan trọng nhất với toString() và compare() của Comparator. <em>Vì sao ngoài syllabus: @Override là tuỳ chọn với trình biên dịch nên đề không đòi, nhưng nó chặn cả một lớp bug vô hình.</em></div>
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
          description: 'utils/FileUtils do Main gọi: đọc/ghi text, CSV, copy & zip — và bẫy byte-vs-char làm hỏng file nhị phân.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 5 · Lesson 5.2</span>
<h2>File I/O — where silent data corruption hides</h2>
<p class="lead">The CBDT-project briefs (P0075–P0079) and every brief with a data file handle files: read, write, copy, zip. The check sheet decides <em>where</em> that code lives: reading a file is Main's job (item 1.1), done through a static helper in <b>utils</b> — <code>FileUtils</code>, a <code>final</code> class with a private constructor. Files are also where "it looks fine" bugs live — several were only caught by running the program and checking the bytes.</p>
<h3>utils/FileUtils — read and write lines (the Dictionary brief, P0058)</h3>
<pre><code class="language-java">package utils;

import constants.Message;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

/**
 * Reads and writes the text file of the dictionary, line by line.
 *
 * @author HE176322
 */
public final class FileUtils {

    // Private constructor: every method is called through the class name.
    private FileUtils() {
    }

    // Tells whether the data file is already on the disk (the brief: "test has data files
    // or not yet").
    public static boolean isFileExist(String path) {
        File file = new File(path);

        return file.exists() &amp;&amp; file.isFile();
    }

    // Reads every line of a text file.
    public static ArrayList&lt;String&gt; readLines(String path) throws Exception {
        ArrayList&lt;String&gt; lineList = new ArrayList&lt;&gt;();

        // try-with-resources closes the file even when reading fails
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new FileInputStream(path), StandardCharsets.UTF_8))) {
            String line = reader.readLine();

            // read until readLine() returns null = end of file
            while (line != null) {
                lineList.add(line);
                line = reader.readLine();
            }
        } catch (IOException e) {
            // missing, locked or unreadable file
            throw new Exception(Message.CANNOT_READ);
        }

        return lineList;
    }

    // Replaces the whole content of a text file with the given lines (the brief's
    // updateDatabase "overwrites the data on file").
    public static void writeLines(String path, ArrayList&lt;String&gt; lineList) throws Exception {
        // try-with-resources flushes and closes the file even on failure
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(path), StandardCharsets.UTF_8))) {
            // one element of the list = one line of the file
            for (String line : lineList) {
                writer.write(line);
                writer.newLine();
            }
        } catch (IOException e) {
            // read-only file, full disk, missing folder...
            throw new Exception(Message.CANNOT_WRITE);
        }
    }
}</code></pre>
<h3>Who calls it</h3>
<p><b>Main</b> reads the data file once at start-up and hands the lines to the controller inside the RequestDTO — one call, <code>controller.loadData(requestDTO)</code>:</p>
<pre><code class="language-java">// the brief's loadData: main reads the lines of the data file, the controller fills
// the dictionary; an unreadable data file is reported, and the program starts empty
try {
    requestDTO.setLineList(readDataFile());
    controller.loadData(requestDTO);
} catch (Exception e) {
    // "Can't read the dictionary file."
    System.out.println(e.getMessage());
}</code></pre>
<pre><code class="language-java">// The file half of the brief's loadData (reading files happens in main): the lines of
// the data file, or no line at all when the file does not exist yet.
private static ArrayList&lt;String&gt; readDataFile() throws Exception {
    // the brief: no data file yet -&gt; the dictionary starts empty
    if (!FileUtils.isFileExist(Constants.DATA_FILE)) {
        return new ArrayList&lt;&gt;();
    }

    return FileUtils.readLines(Constants.DATA_FILE);
}</code></pre>
<p>The <b>repository</b> turns the lines into model objects — and after each change writes them back with <code>FileUtils.writeLines</code>, so memory and file never drift apart:</p>
<pre><code class="language-java">// The brief's loadData(): every "english=vietnamese" line main read from the data file
// becomes one pair of the map; no file (no line) leaves the map empty.
public void loadData(WordRequestDTO requestDTO) {
    // start again from an empty dictionary
    wordMap = new LinkedHashMap&lt;&gt;();

    // one line of the file = one pair of words
    for (String line : requestDTO.getLineList()) {
        // limit 2: only the FIRST "=" separates, the meaning may hold more
        String[] partArray = line.split(Constants.SEPARATOR, Constants.LINE_PARTS);

        // skip blank or broken lines instead of stopping the whole load
        if ((partArray.length == Constants.LINE_PARTS) &amp;&amp; !partArray[0].trim().isEmpty()) {
            Word word = new Word(partArray[0].trim(), partArray[1].trim());

            // the key is the English word in lower case
            wordMap.put(toKey(word.getEnglish()), word);
        }
    }</code></pre>
<div class="pitfall"><b>Traps proven by running the code:</b><br>
• <b>Never copy a binary file through Reader/Writer.</b> 256 bytes in became 512 out; every byte ≥ 0x80 turned into U+FFFD. Use byte streams (<span class="badge">InputStream/OutputStream</span>) for binary.<br>
• <b>Object serialization append breaks reading.</b> Appending with a second <span class="badge">ObjectOutputStream</span> writes a second header that <span class="badge">ObjectInputStream</span> chokes on — prefer a text file, or rewrite the whole object list.<br>
• A zip is corrupted by <em>not</em> calling <span class="badge">close()</span> on the ZipOutputStream — not by a missing <span class="badge">closeEntry()</span>. try-with-resources, as in FileUtils above, closes it for you.<br>
• <span class="badge">Properties.load()</span> swallows backslashes: <span class="badge">D:\\Data</span> becomes <span class="badge">D:Data</span>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Name the charset when text holds Vietnamese.</b> new FileReader and Files.readAllLines without a charset use the platform default encoding, so a file saved as UTF-8 can read back as garbled accents on a machine defaulting to Windows-1252. FileUtils above passes StandardCharsets.UTF_8 explicitly on both read and write — do the same. <em>Why beyond the syllabus: encoding is invisible until the grader's machine default differs from yours.</em></div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0078-create-a-program-to-copy-file?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">📁</span>
  <span class="lc-body"><span class="lc-title">Practise files: copy, zip, CSV</span><span class="lc-sub">P0078 (copy), P0079 (zip), P0076 (CSV), P0059 (handle files).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 5 · Bài 5.2</span>
<h2>Đọc/ghi tệp — nơi dữ liệu hỏng âm thầm</h2>
<p class="lead">Nhóm đề dự án CBDT (P0075–P0079) và mọi đề có tệp dữ liệu đều xử lý tệp: đọc, ghi, copy, zip. Tờ checklist quyết định code đó nằm <em>ở đâu</em>: đọc từ file là việc của Main (mục 1.1), làm qua một hàm static trong <b>utils</b> — <code>FileUtils</code>, lớp <code>final</code> có constructor private. Tệp cũng là nơi bug "trông ổn mà" ẩn náu — vài lỗi chỉ bị bắt khi chạy chương trình và kiểm từng byte.</p>
<h3>utils/FileUtils — đọc và ghi từng dòng (đề Dictionary, P0058)</h3>
<pre><code class="language-java">package utils;

import constants.Message;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;

/**
 * Reads and writes the text file of the dictionary, line by line.
 *
 * @author HE176322
 */
public final class FileUtils {

    // Private constructor: every method is called through the class name.
    private FileUtils() {
    }

    // Tells whether the data file is already on the disk (the brief: "test has data files
    // or not yet").
    public static boolean isFileExist(String path) {
        File file = new File(path);

        return file.exists() &amp;&amp; file.isFile();
    }

    // Reads every line of a text file.
    public static ArrayList&lt;String&gt; readLines(String path) throws Exception {
        ArrayList&lt;String&gt; lineList = new ArrayList&lt;&gt;();

        // try-with-resources closes the file even when reading fails
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(
                new FileInputStream(path), StandardCharsets.UTF_8))) {
            String line = reader.readLine();

            // read until readLine() returns null = end of file
            while (line != null) {
                lineList.add(line);
                line = reader.readLine();
            }
        } catch (IOException e) {
            // missing, locked or unreadable file
            throw new Exception(Message.CANNOT_READ);
        }

        return lineList;
    }

    // Replaces the whole content of a text file with the given lines (the brief's
    // updateDatabase "overwrites the data on file").
    public static void writeLines(String path, ArrayList&lt;String&gt; lineList) throws Exception {
        // try-with-resources flushes and closes the file even on failure
        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(
                new FileOutputStream(path), StandardCharsets.UTF_8))) {
            // one element of the list = one line of the file
            for (String line : lineList) {
                writer.write(line);
                writer.newLine();
            }
        } catch (IOException e) {
            // read-only file, full disk, missing folder...
            throw new Exception(Message.CANNOT_WRITE);
        }
    }
}</code></pre>
<h3>Ai gọi nó</h3>
<p><b>Main</b> đọc tệp dữ liệu một lần lúc khởi động và đưa các dòng cho controller trong RequestDTO — một lần gọi, <code>controller.loadData(requestDTO)</code>:</p>
<pre><code class="language-java">// the brief's loadData: main reads the lines of the data file, the controller fills
// the dictionary; an unreadable data file is reported, and the program starts empty
try {
    requestDTO.setLineList(readDataFile());
    controller.loadData(requestDTO);
} catch (Exception e) {
    // "Can't read the dictionary file."
    System.out.println(e.getMessage());
}</code></pre>
<pre><code class="language-java">// The file half of the brief's loadData (reading files happens in main): the lines of
// the data file, or no line at all when the file does not exist yet.
private static ArrayList&lt;String&gt; readDataFile() throws Exception {
    // the brief: no data file yet -&gt; the dictionary starts empty
    if (!FileUtils.isFileExist(Constants.DATA_FILE)) {
        return new ArrayList&lt;&gt;();
    }

    return FileUtils.readLines(Constants.DATA_FILE);
}</code></pre>
<p><b>Repository</b> biến các dòng thành đối tượng model — và sau mỗi thay đổi ghi lại bằng <code>FileUtils.writeLines</code>, để bộ nhớ và tệp không bao giờ lệch nhau:</p>
<pre><code class="language-java">// The brief's loadData(): every "english=vietnamese" line main read from the data file
// becomes one pair of the map; no file (no line) leaves the map empty.
public void loadData(WordRequestDTO requestDTO) {
    // start again from an empty dictionary
    wordMap = new LinkedHashMap&lt;&gt;();

    // one line of the file = one pair of words
    for (String line : requestDTO.getLineList()) {
        // limit 2: only the FIRST "=" separates, the meaning may hold more
        String[] partArray = line.split(Constants.SEPARATOR, Constants.LINE_PARTS);

        // skip blank or broken lines instead of stopping the whole load
        if ((partArray.length == Constants.LINE_PARTS) &amp;&amp; !partArray[0].trim().isEmpty()) {
            Word word = new Word(partArray[0].trim(), partArray[1].trim());

            // the key is the English word in lower case
            wordMap.put(toKey(word.getEnglish()), word);
        }
    }</code></pre>
<div class="pitfall"><b>Bẫy chứng minh bằng chạy code:</b><br>
• <b>Không bao giờ copy file nhị phân qua Reader/Writer.</b> 256 byte vào thành 512 byte ra; mọi byte ≥ 0x80 thành U+FFFD. Dùng luồng byte (<span class="badge">InputStream/OutputStream</span>) cho nhị phân.<br>
• <b>Serialize kiểu nối làm hỏng việc đọc.</b> Nối bằng <span class="badge">ObjectOutputStream</span> thứ hai ghi header thứ hai mà <span class="badge">ObjectInputStream</span> nghẹn — nên dùng tệp text, hoặc ghi lại toàn bộ danh sách.<br>
• Zip hỏng vì <em>không</em> gọi <span class="badge">close()</span> trên ZipOutputStream — không phải vì thiếu <span class="badge">closeEntry()</span>. try-with-resources, như trong FileUtils ở trên, đóng hộ bạn.<br>
• <span class="badge">Properties.load()</span> nuốt dấu gạch chéo ngược: <span class="badge">D:\\Data</span> thành <span class="badge">D:Data</span>.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nêu rõ charset khi văn bản có tiếng Việt.</b> new FileReader và Files.readAllLines không kèm charset dùng encoding mặc định của nền tảng, nên một tệp lưu UTF-8 có thể đọc lại thành dấu tiếng Việt lỗi loạn trên máy mặc định Windows-1252. FileUtils ở trên truyền StandardCharsets.UTF_8 tường minh cả khi đọc và ghi — làm y như vậy. <em>Vì sao ngoài syllabus: encoding vô hình cho tới khi mặc định của máy người chấm khác của bạn.</em></div>
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
  <div class="lz-step">Map each entity → its own model class</div>
  <div class="lz-step">One repository per model (+ a service where there is business: reports, login, statistics)</div>
  <div class="lz-step">Controllers call service/repository and feed each view one ResponseDTO</div>
  <div class="lz-step">Main reads every data file once (FileUtils) · the repository saves after each change</div>
</div>
<div class="callout ok">If you have done Parts 1–4 honestly, a 350-LOC brief is just four medium briefs stacked. Budget your time by feature and compile after each — do not write 350 lines then hit Run.</div>
<div class="pitfall"><b>MD5/login trap:</b> <span class="badge">new String(md5Digest)</span> turns 16 bytes into a 13-char string; its <span class="badge">getBytes()</span> gives 26 bytes and no longer matches. Store the hex hash, not a raw-byte String. And hashing is Main's job (check sheet 1.1): Main hashes the typed password with <code>utils/MD5Utils</code> before it fills the RequestDTO; the repository only stores and compares the hex hash.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Read every data file once, at start-up.</b> Reading a file lazily the first time a menu option is used means a missing or malformed file crashes you mid-sitting instead of at launch; let Main read every file up front (FileUtils → RequestDTO → controller.loadData) so problems surface while you still have time. <em>Why beyond the syllabus: the brief says "read from file", not when — timing the read defensively is an engineering habit it never teaches.</em></div>
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
  <div class="lz-step">Ánh xạ mỗi thực thể → một lớp model riêng</div>
  <div class="lz-step">Mỗi model một repository (+ service khi có nghiệp vụ: báo cáo, đăng nhập, thống kê)</div>
  <div class="lz-step">Controller gọi service/repository và đưa cho view một ResponseDTO</div>
  <div class="lz-step">Main đọc mỗi tệp dữ liệu một lần (FileUtils) · repository lưu sau mỗi thay đổi</div>
</div>
<div class="callout ok">Nếu bạn đã làm Phần 1–4 nghiêm túc, đề 350 LOC chỉ là bốn đề medium xếp chồng. Chia thời gian theo chức năng và biên dịch sau mỗi cái — đừng viết 350 dòng rồi mới bấm Run.</div>
<div class="pitfall"><b>Bẫy MD5/login:</b> <span class="badge">new String(md5Digest)</span> biến 16 byte thành chuỗi 13 ký tự; <span class="badge">getBytes()</span> của nó ra 26 byte và không còn khớp. Lưu chuỗi hex, đừng lưu String từ byte thô. Và mã hoá là việc của Main (tờ check sheet 1.1): Main băm mật khẩu vừa gõ bằng <code>utils/MD5Utils</code> rồi mới đặt vào RequestDTO; repository chỉ lưu và so chuỗi hex.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đọc mọi tệp dữ liệu một lần, lúc khởi động.</b> Đọc tệp kiểu lười ở lần đầu dùng một lựa chọn menu nghĩa là một tệp thiếu hoặc hỏng sẽ làm sập bạn giữa buổi thay vì lúc chạy; để Main đọc mọi tệp ngay từ đầu (FileUtils → RequestDTO → controller.loadData) để lỗi lộ ra khi bạn còn thời gian. <em>Vì sao ngoài syllabus: đề nói "đọc từ tệp", không nói khi nào — đọc phòng thủ là thói quen kỹ thuật đề không dạy.</em></div>
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
          description: 'Kiểm tra OOP trong model và các bẫy đọc/ghi tệp.',
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
      title: 'Part 6 — Surviving a timed lab assignment|||Phần 6 — Sống sót một buổi lab bấm giờ',
      description: 'Syllabus quy định mỗi assignment phải làm LIÊN TỤC trong thời gian quy định — đây là cách sống sót buổi đó: kịch bản làm bài + quản lý thời gian, sổ tay lỗi 60 giây, các bẫy khi bị review, và vấn đáp "đổi yêu cầu".',
      lessons: [
        {
          title: '6.1 — Working to time in one sitting|||6.1 — Làm xong trong một buổi: kịch bản & quản lý thời gian',
          slug: 'lab211-ke-hoach-thi',
          type: 'VIDEO',
          description: 'Thứ tự tấn công cố định và cách chia thời gian để không cháy giờ ở chức năng đầu tiên — dùng cho mọi buổi lab bấm giờ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 6 · Lesson 6.1</span>
<h2>Working to time — a fixed order of attack</h2>
<p class="lead">The syllabus rule is blunt: <q>each assignment must be completed continuously in the defined time</q>. So every lab sitting is the same shape &mdash; a brief, a clock, and you alone. The students who finish do not write faster; they follow a rehearsed order so no minute is wasted deciding what to do.</p>
<div class="lz-flow">
  <div class="lz-step">0–5 min · read the brief twice, underline every message &amp; format</div>
  <div class="lz-step">5–15 min · create the Guide skeleton from memory: packages, Message/Constants, model, repository, DTOs, view, utils/Validation</div>
  <div class="lz-step">10–? min · one feature at a time; compile &amp; run after each</div>
  <div class="lz-step">last 15 min · re-run every menu option against the expected screen, then self-review with the check sheet</div>
</div>
<h3>Rules that save the grade</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Compile early, compile often.</b> A program that runs and does 3 of 5 features scores far more than a "complete" one that will not compile.</div>
  <div class="lz-layer"><b>Do the easy, high-mark features first.</b> Add + Display before a tricky sort. Bank partial credit before you gamble time.</div>
  <div class="lz-layer"><b>Copy labels exactly, validate every input.</b> These are free marks you already know how to get.</div>
  <div class="lz-layer"><b>If stuck, move on.</b> A working 80% beats a broken 100% that will not run.</div>
  <div class="lz-layer"><b>Write the comments as you type.</b> The check sheet wants a comment on every method and every block (1.6) and a blank line before each comment (2.8). Adding them to twenty methods in the last five minutes never works — and without them the review is rejected, however well the program runs.</div>
</div>
<div class="callout danger">The number one time-sink is one feature you cannot get perfect. Set a personal timer; when it rings, leave it working-but-imperfect and secure the rest. You are graded on total working output, not heroics.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Comment out a broken feature to save the build.</b> If one method refuses to compile with minutes left, wrap it in a block comment and its menu case too; the other four features then still compile, run and score. A submission that does not compile at all scores nothing. <em>Why beyond the syllabus: triage-by-commenting is a survival tactic for a timed sitting, not a programming topic the syllabus lists.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 6 · Bài 6.1</span>
<h2>Làm xong trong một buổi — thứ tự tấn công cố định</h2>
<p class="lead">Syllabus quy định thẳng: <q>mỗi assignment phải hoàn thành liên tục trong thời gian quy định</q>. Nên mọi buổi lab đều cùng một hình dạng — một đề, một đồng hồ, và bạn tự làm. Sinh viên làm xong không viết nhanh hơn; họ theo một thứ tự đã diễn tập nên không phí phút nào để quyết làm gì.</p>
<div class="lz-flow">
  <div class="lz-step">0–5 phút · đọc đề hai lần, gạch chân mọi thông báo &amp; định dạng</div>
  <div class="lz-step">5–15 phút · dựng khung theo Guide từ trí nhớ: các package, Message/Constants, model, repository, DTO, view, utils/Validation</div>
  <div class="lz-step">10–? phút · mỗi lần một chức năng; biên dịch &amp; chạy sau mỗi cái</div>
  <div class="lz-step">15 phút cuối · chạy lại mọi lựa chọn menu đối chiếu màn hình mẫu, rồi tự soát theo tờ check sheet</div>
</div>
<h3>Những luật cứu điểm</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Biên dịch sớm, biên dịch thường xuyên.</b> Chương trình chạy được và làm 3/5 chức năng ăn điểm hơn nhiều so với bản "hoàn chỉnh" mà không biên dịch được.</div>
  <div class="lz-layer"><b>Làm chức năng dễ, điểm cao trước.</b> Add + Display trước một hàm sort hóc búa. Gom điểm phần trước khi đánh cược thời gian.</div>
  <div class="lz-layer"><b>Chép nhãn y nguyên, validate mọi input.</b> Đây là điểm miễn phí bạn đã biết cách lấy.</div>
  <div class="lz-layer"><b>Bí thì bỏ qua.</b> Một 80% chạy được hơn một 100% hỏng không chạy.</div>
  <div class="lz-layer"><b>Viết comment ngay khi gõ.</b> Tờ check sheet đòi comment cho mọi method và mọi block (1.6) và một dòng trống trước mỗi comment (2.8). Thêm chúng cho hai mươi method trong năm phút cuối không bao giờ kịp — và thiếu chúng là buổi review bị reject, dù chương trình chạy tốt đến đâu.</div>
</div>
<div class="callout danger">Kẻ ngốn thời gian số một là một chức năng bạn không thể làm hoàn hảo. Đặt hẹn giờ riêng; khi nó reo, để nó chạy-được-nhưng-chưa-hoàn-hảo và giữ chắc phần còn lại. Bạn được chấm trên tổng output chạy được, không phải sự anh hùng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Comment tắt một chức năng hỏng để cứu bản build.</b> Nếu một hàm không chịu biên dịch khi còn vài phút, bọc nó trong một khối comment và cả case menu của nó; bốn chức năng còn lại khi đó vẫn biên dịch, chạy và ăn điểm. Bài nộp hoàn toàn không biên dịch được thì 0 điểm. <em>Vì sao ngoài syllabus: phân loại-bằng-comment là chiến thuật sống sót một buổi bấm giờ, không phải chủ đề lập trình syllabus liệt kê.</em></div>
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
    <tr><td><span class="badge">InputMismatchException</span></td><td>Scanner got text where a number was expected</td><td>read a whole line in Main, check it with utils/Validation (Lesson 1.2)</td></tr>
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
<p class="lead">CLO3 là "debug bằng công cụ phổ biến". Trong một buổi bấm giờ, một dòng lỗi đỏ không phải thảm họa — nó là thông báo nói chính xác cần sửa gì, <em>nếu</em> bạn đọc được nhanh. Đây là những lỗi bạn thật sự gặp.</p>
<table>
  <thead><tr><th>Thông báo</th><th>Nguyên nhân thật</th><th>Cách sửa</th></tr></thead>
  <tbody>
    <tr><td><span class="badge">cannot find symbol</span></td><td>gõ sai, hoặc thiếu import/biến</td><td>kiểm chính tả; thêm import</td></tr>
    <tr><td><span class="badge">';' expected</span></td><td>thiếu dấu ; hoặc ngoặc ở trên</td><td>nhìn dòng <em>ngay trước</em> con trỏ lỗi</td></tr>
    <tr><td><span class="badge">incompatible types</span></td><td>gán sai kiểu</td><td>parse/ép kiểu, hoặc sửa khai báo</td></tr>
    <tr><td><span class="badge">NullPointerException</span></td><td>dùng đối tượng chưa được tạo</td><td>khởi tạo trước khi dùng</td></tr>
    <tr><td><span class="badge">InputMismatchException</span></td><td>Scanner nhận chữ chỗ cần số</td><td>đọc trọn dòng ở Main, kiểm bằng utils/Validation (Bài 1.2)</td></tr>
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
          title: '6.3 — Grader traps & the 25-item check sheet|||6.3 — Bẫy người chấm & tờ check sheet 25 mục',
          slug: 'lab211-bay-nguoi-cham',
          type: 'VIDEO',
          description: 'Hai cửa trước khi được chấp nhận: bẫy màn hình làm mất điểm dù logic đúng, và tờ Coding check sheet 25 mục thầy dùng để review code — tự điền "O" ba lượt rồi mới xin review.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 6 · Lesson 6.3</span>
<h2>Grader traps &amp; the 25-item Coding check sheet</h2>
<p class="lead">Two gates stand between "it runs" and "accepted". The first is the <b>screen</b>: your program is run and compared with the brief. The second is the <b>code review</b>: your teacher reads your code with a paper <b>Coding check sheet</b> of 25 items, and one item that is not OK means the review is rejected — however perfect the output. Run both lists on every program before you ask for a review.</p>
<h3>Gate 1 — the screen</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>☐ Labels &amp; spacing exact.</b> "Area: " vs "Area:", column widths in <span class="badge">%-15s</span>. Compare with the expected screen character by character.</div>
  <div class="lz-layer"><b>☐ Follow Guidelines over screenshots</b> when they disagree — the wording, the definition (e.g. perfect square), the error text.</div>
  <div class="lz-layer"><b>☐ Floating point.</b> Rearrange to avoid 19.9999… printing "20.00" but comparing &lt; 20.</div>
  <div class="lz-layer"><b>☐ Dates strict.</b> <span class="badge">setLenient(false)</span> / STRICT + <span class="badge">uuuu</span>; check the shape first to reject trailing junk.</div>
  <div class="lz-layer"><b>☐ Off-by-one.</b> Loop bounds, array sizes; the classic bug that survives easy data.</div>
  <div class="lz-layer"><b>☐ Input never crashes.</b> Main reads every line, utils/Validation checks it, and a wrong line is asked again.</div>
  <div class="lz-layer"><b>☐ It compiles &amp; every menu option runs.</b> The final, non-negotiable gate.</div>
</div>
<h3>Gate 2 — the Coding check sheet (25 items)</h3>
<p>Translated from the teacher's two paper sheets; the Vietnamese version of this lesson keeps the sheet's own wording.</p>
<table>
  <thead><tr><th>#</th><th>What the reviewer checks</th></tr></thead>
  <tbody>
    <tr><td colspan="2"><b>1 · Common</b></td></tr>
    <tr><td>1.1</td><td><b>Is it MVC as in the Guide?</b> Main works only with the controller, DTOs and utils, and does ALL the input, validation, file reading and hashing. The controller takes Main's input through a DTO, sends and receives data through Services (Repository), never works with the model, never prints — it only sends what must be shown to the view. The repository holds only the data and simple CRUD; business calculation needs a service, keeping Controller ↔ Services ↔ Repository ↔ Model. <b>A repository is mandatory.</b> Anything to show goes through the view, and <b>the view is rendered once per flow</b> (one flow = one switch-case in Main). Services/Repository take their data from the controller (as parameters when there are fewer than 3), do the work and return the result; they may use the model and never print. The model only describes the entity: no view, no print. The view receives only from the controller, <b>through an attribute, not a parameter</b> (a ResponseDTO, as in the sample).</td></tr>
    <tr><td>1.2</td><td>Package names are lower case and say what the package holds.</td></tr>
    <tr><td>1.3</td><td>A class name starts with a capital letter and is a noun that says what the class is for; single responsibility (the S of SOLID). <b>An exception class ends in <code>Exception</code>; an interface starts with <code>I</code>.</b></td></tr>
    <tr><td>1.4</td><td>A method name starts with a lower-case letter and with a <b>verb</b> saying what it does; one job per method (SRP).</td></tr>
    <tr><td>1.5</td><td>A variable starts lower case and means something. <b>A collection ends in <code>List</code>, a Set in <code>Set</code>, a Map in <code>Map</code>, an array in <code>Array</code>; write <code>Id</code>, never <code>ID</code>.</b></td></tr>
    <tr><td>1.6</td><td>Short, clear comments; Javadoc for the class and methods where useful. <b>Every method has a comment saying what it does, and every block of code has a comment saying what that block does.</b></td></tr>
    <tr><td colspan="2"><b>2 · Coding convention</b> — format with Alt+Shift+F (NetBeans), Ctrl+Shift+F (Eclipse) or Ctrl+Alt+L (IntelliJ)</td></tr>
    <tr><td>2.1</td><td><code>{</code> at the end of a line, <code>}</code> at the start of a line.</td></tr>
    <tr><td>2.2</td><td>Braces even around a one-line block.</td></tr>
    <tr><td>2.3</td><td>No line longer than <b>100 characters</b> (comments not counted). Break after a logical operator (&amp;&amp;, ||) and before an arithmetic operand (+, -, *); avoid breaking inside ( ).</td></tr>
    <tr><td>2.4</td><td>One variable declaration per line.</td></tr>
    <tr><td>2.5</td><td>Arrays declared one way only: <code>Type[] anArray;</code></td></tr>
    <tr><td>2.6</td><td><b>Variables declared together at the top of each block.</b></td></tr>
    <tr><td>2.7</td><td>One statement per line.</td></tr>
    <tr><td>2.8</td><td><b>One blank line</b> between methods, between the declarations and the rest, before a block comment, before a line comment, and between blocks of logic.</td></tr>
    <tr><td>2.9</td><td>One space before <code>(</code>, after <code>,</code>, and around the operators (<code>=</code>, <code>+</code>, <code>-</code>, <code>*</code>, the <code>;</code> inside a <code>for</code>).</td></tr>
    <tr><td>2.10</td><td>Every constant in its own class, <code>Constants.java</code>: UPPER_SNAKE names, <code>static final</code>.</td></tr>
    <tr><td>2.11</td><td>Every message in its own constant class, <code>Message.java</code>: UPPER_SNAKE names, <code>static final</code>.</td></tr>
    <tr><td colspan="2"><b>3 · Performance</b></td></tr>
    <tr><td>3.1</td><td>Static fields and methods are reached through the class name (<code>Validation.getChoice(...)</code>).</td></tr>
    <tr><td>3.2</td><td>No local variable with the same name as a variable of a higher level.</td></tr>
    <tr><td>3.3</td><td><b>Brackets make the order of evaluation explicit:</b> <code>if ((a == b) &amp;&amp; (c == d))</code>.</td></tr>
    <tr><td>3.4</td><td>A class with only static methods has a private constructor and is declared <code>final</code>.</td></tr>
    <tr><td>3.5</td><td>Objects such as String are compared with <code>equals</code>, never <code>==</code>; mind upper/lower case when comparing text.</td></tr>
    <tr><td>3.6</td><td>No variable that is declared and never used.</td></tr>
    <tr><td>3.7</td><td><b>A variable is declared where processing starts, and initialised there</b> (<code>int choice = 0;</code>).</td></tr>
    <tr><td>3.8</td><td>Strings are joined with <code>StringBuilder</code>, never <code>String += String</code>.</td></tr>
  </tbody>
</table>
<h3>How the sheet is used — three self-checks, then ask</h3>
<div class="lz-flow">
  <div class="lz-step">Write your student code and name, the start date, and under it the brief (e.g. P0061)</div>
  <div class="lz-step">Finish the program, then review your own code item by item and write "O" beside every item that is OK</div>
  <div class="lz-step">Fix what is not OK and review again — each brief has 3 columns, for 3 self-checks / review requests</div>
  <div class="lz-step">Only when every item in the column is "O", ask the teacher to review</div>
</div>
<div class="callout warn">The formatter (Alt+Shift+F) fixes 2.1, 2.9 and the indentation for free. It does <b>not</b> fix 1.1, the names (1.2–1.5), the comments (1.6), declarations at the top with a value (2.6, 3.7), blank lines before comments (2.8), brackets (3.3), Message/Constants (2.10, 2.11) or StringBuilder (3.8) — that is what the three passes are for. Lesson 7.1 shows every rule in code.</div>
<div class="note-ct">Six review points markers love to probe are collected in the Algorithm Reference, including proof that an off-by-one bug survives on easy inputs — the exact reason it slips into a lab submission.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Test the empty and single-element cases before you submit.</b> Markers love hidden inputs: display when the list is empty (it should print a "no data" line, not crash), search for something absent, sort a one-item list. These edge runs catch the bugs your happy-path testing never will. <em>Why beyond the syllabus: the visible screen shows a populated list; the empty and singleton cases are the grader's hidden probes.</em></div>
<a class="link-card codelab" href="/code-lab/lab211?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab#module-856" target="_blank" rel="noopener">
  <span class="lc-ico">🕵️</span>
  <span class="lc-body"><span class="lc-title">Algorithm Reference — what markers probe</span><span class="lc-sub">The 6 review points + a proof that off-by-one hides on easy data.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 6 · Bài 6.3</span>
<h2>Bẫy người chấm &amp; tờ Coding check sheet 25 mục</h2>
<p class="lead">Giữa "chạy được" và "được chấp nhận" có hai cửa. Cửa thứ nhất là <b>màn hình</b>: chương trình được chạy và so với đề. Cửa thứ hai là <b>review code</b>: thầy đọc code của bạn bằng tờ giấy <b>Coding check sheet</b> 25 mục, và chỉ một mục chưa đạt là buổi review bị reject — dù output hoàn hảo. Chạy cả hai danh sách dưới đây trên mọi chương trình trước khi xin review.</p>
<h3>Cửa 1 — màn hình</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>☐ Nhãn &amp; khoảng cách chính xác.</b> "Area: " vs "Area:", bề rộng cột trong <span class="badge">%-15s</span>. So với màn hình mẫu từng ký tự.</div>
  <div class="lz-layer"><b>☐ Theo Guidelines hơn ảnh</b> khi vênh nhau — câu chữ, định nghĩa (vd số chính phương), text lỗi.</div>
  <div class="lz-layer"><b>☐ Số thực.</b> Sắp lại để tránh 19.9999… in "20.00" nhưng so sánh &lt; 20.</div>
  <div class="lz-layer"><b>☐ Ngày nghiêm ngặt.</b> <span class="badge">setLenient(false)</span> / STRICT + <span class="badge">uuuu</span>; kiểm hình dạng trước để từ chối rác đuôi.</div>
  <div class="lz-layer"><b>☐ Lệch một đơn vị.</b> Cận vòng lặp, kích thước mảng; bug kinh điển sống sót trên dữ liệu dễ.</div>
  <div class="lz-layer"><b>☐ Input không bao giờ sập.</b> Main đọc từng dòng, utils/Validation kiểm, dòng sai thì hỏi lại.</div>
  <div class="lz-layer"><b>☐ Biên dịch được &amp; mọi lựa chọn menu chạy.</b> Cửa ải cuối, không thương lượng.</div>
</div>
<h3>Cửa 2 — tờ Coding check sheet (25 mục)</h3>
<p>Chép theo hai tờ giấy của thầy, giữ nguyên câu chữ.</p>
<table>
  <thead><tr><th>STT</th><th>Confirm item</th></tr></thead>
  <tbody>
    <tr><td colspan="2"><b>1 · Common</b></td></tr>
    <tr><td>1.1</td><td><b>Đã đúng MVC chưa?</b> Main chỉ làm việc với Controller, DTO, Utils. Toàn bộ việc nhập dữ liệu/Validate/đọc từ file/mã hoá thực hiện ở Main. Controller nhận input từ main qua DTO, gửi/nhận data qua Services (Repository), không làm việc với Model, chỉ gửi kết quả cần hiển thị sang View; không thực hiện print thông tin gì ở controller. Repository chỉ chứa data và CRUD methods đơn giản; nếu có nghiệp vụ tính toán thì cần thêm Services và đảm bảo layer Controller ↔ Services ↔ Repository ↔ Model. <b>Bắt buộc phải có repository.</b> Cần hiển thị thông tin gì thì gọi qua View; <b>việc rendering khi gọi view chỉ được gọi 1 lần cho 1 luồng xử lý</b> (mỗi luồng tính là 1 switch-case ở Main). Services/Repository nhận data từ controller (có thể thông qua param nếu số param &lt; 3), xử lý nghiệp vụ và trả kết quả về controller; được giao tiếp với Model; không print. Model chỉ miêu tả thực thể, không làm việc với View, không print. View chỉ nhận thông tin từ Controller, <b>không truyền qua param mà nhận qua thuộc tính</b> (nên để ResponseDTO giống ví dụ).</td></tr>
    <tr><td>1.2</td><td>Package là chữ thường, thể hiện được ý nghĩa chung của package.</td></tr>
    <tr><td>1.3</td><td>Class bắt đầu bằng chữ hoa, tên class bắt đầu bằng danh từ mô tả ý nghĩa của class; đảm bảo S trong SOLID. <b>Tên class exception kết thúc bằng "Exception"; tên interface bắt đầu bằng "I".</b></td></tr>
    <tr><td>1.4</td><td>Method bắt đầu bằng chữ thường, tên method bắt đầu bằng <b>động từ</b> mô tả chức năng của method; đảm bảo SRP trong SOLID.</td></tr>
    <tr><td>1.5</td><td>Tên biến bắt đầu bằng chữ thường và có ý nghĩa. <b>Biến kiểu collection kết thúc bằng "List", kiểu Set bằng "Set", kiểu Map bằng "Map", kiểu Array bằng "Array"; khi refer đến ID thì thống nhất viết là "Id", không viết "ID".</b></td></tr>
    <tr><td>1.6</td><td>Comment ngắn gọn, rõ ràng; dùng Javadoc cho class/method nếu cần. <b>Mỗi method đều phải có comment miêu tả ý nghĩa của method; mỗi block source đều phải có comment giải thích block đó làm gì.</b></td></tr>
    <tr><td colspan="2"><b>2 · Coding Convention</b> — format code bằng Alt+Shift+F (NetBeans), Ctrl+Shift+F (Eclipse) hoặc Ctrl+Alt+L (IntelliJ)</td></tr>
    <tr><td>2.1</td><td>"{" nằm ở kết thúc của line, "}" nằm ở bắt đầu của line.</td></tr>
    <tr><td>2.2</td><td>Dù block có 1 dòng code cũng đặt trong {}.</td></tr>
    <tr><td>2.3</td><td>1 line (không tính comment) không dài quá <b>100 ký tự</b>. Dài hơn thì break sau toán tử logic (and, or…), trước toán hạng (+, -, *…), hạn chế break giữa biểu thức trong ().</td></tr>
    <tr><td>2.4</td><td>Mỗi khai báo biến để trên 1 dòng.</td></tr>
    <tr><td>2.5</td><td>Khai báo array thống nhất theo 1 kiểu <code>Type[] anArray;</code></td></tr>
    <tr><td>2.6</td><td><b>Biến được khai báo tập trung ở đầu mỗi block code.</b></td></tr>
    <tr><td>2.7</td><td>Mỗi statement nằm trên 1 line.</td></tr>
    <tr><td>2.8</td><td><b>Có 1 blank line</b> giữa các method, giữa vùng khai báo biến và vùng còn lại, trước block comment, trước line comment, giữa các block code xử lý logic.</td></tr>
    <tr><td>2.9</td><td>Có 1 space trước <code>(</code>, sau <code>,</code>, trước và sau các phép tính (<code>=</code>, <code>+</code>, <code>-</code>, <code>*</code>, <code>;</code> trong for…).</td></tr>
    <tr><td>2.10</td><td>Tất cả hằng số để vào một class riêng (<code>Constants.java</code>); constant viết chữ hoa, phân cách bằng "_", khai báo <code>static final</code>.</td></tr>
    <tr><td>2.11</td><td>Tất cả message để vào một constant class riêng (<code>Message.java</code>); constant viết chữ hoa, phân cách bằng "_", khai báo <code>static final</code>.</td></tr>
    <tr><td colspan="2"><b>3 · Performance</b></td></tr>
    <tr><td>3.1</td><td>Sử dụng class để truy cập vào biến, method static (<code>Validation.getChoice(...)</code>).</td></tr>
    <tr><td>3.2</td><td>Không khai báo biến local trùng tên với biến higher level.</td></tr>
    <tr><td>3.3</td><td><b>Sử dụng () để làm tường minh thứ tự các phép tính:</b> <code>if ((a == b) &amp;&amp; (c == d))</code>.</td></tr>
    <tr><td>3.4</td><td>Class chỉ có static method thì phải có private constructor và khai báo class là final.</td></tr>
    <tr><td>3.5</td><td>So sánh giá trị object như String thì dùng <code>equals</code>, không dùng <code>==</code>; so sánh text thì chú ý case sensitive.</td></tr>
    <tr><td>3.6</td><td>Không được có biến khai báo mà không dùng ở đâu cả.</td></tr>
    <tr><td>3.7</td><td><b>Biến declare khi bắt đầu xử lý và thực hiện khởi tạo</b> (<code>int choice = 0;</code>).</td></tr>
    <tr><td>3.8</td><td>Khi cộng string thì dùng <code>StringBuilder</code>, không dùng <code>String += String</code>.</td></tr>
  </tbody>
</table>
<h3>Cách dùng tờ giấy — tự soát ba lượt rồi mới xin review</h3>
<div class="lz-flow">
  <div class="lz-step">Điền mã và tên sinh viên, ngày bắt đầu làm, bên dưới ghi mã bài (vd P0061)</div>
  <div class="lz-step">Code xong thì tự review source của mình theo từng mục; mục nào đã OK thì điền "O"</div>
  <div class="lz-step">Sửa mục chưa OK rồi soát lại — mỗi bài có 3 cột, cho 3 lần tự check / yêu cầu review</div>
  <div class="lz-step">Khi tất cả các mục trên một cột đã là "O" thì mới yêu cầu thầy review</div>
</div>
<div class="callout warn">Bộ định dạng (Alt+Shift+F) sửa miễn phí 2.1, 2.9 và thụt lề. Nó <b>không</b> sửa 1.1, tên (1.2–1.5), comment (1.6), khai báo ở đầu block kèm khởi tạo (2.6, 3.7), dòng trống trước comment (2.8), ngoặc (3.3), Message/Constants (2.10, 2.11) hay StringBuilder (3.8) — ba lượt tự soát là để bắt những thứ đó. Bài 7.1 minh hoạ từng luật bằng code.</div>
<div class="note-ct">Sáu điểm review mà người chấm thích soi được gom trong Algorithm Reference, kèm chứng minh rằng bug lệch-một-đơn-vị sống sót trên input dễ — đúng lý do nó lọt vào bài nộp.</div>
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
<p class="lead">Half of LAB211's sessions are Mentor review. The mentor is checking one thing: did you understand your own code, or copy it? Their weapon is a small change — "now sort by date descending", "add a delete-by-name feature", "why does this program have a repository?" — and the question "where would you change your code?"</p>
<h3>How to be ready</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Know your layers.</b> If asked to change sorting, you point to the Comparator in the service; to add a feature: a new repository (or service) method, a field in the RequestDTO/ResponseDTO, a controller method, a menu case in Main, and a branch in the view's display(). The Guide's layers make every answer obvious.</div>
  <div class="lz-layer"><b>Walk the flow out loud</b> (Lesson 1.1): Main reads and validates → RequestDTO → controller → service → repository → model, then ResponseDTO → view, rendered once. Stock questions: "why is there a repository?" (the check sheet makes it mandatory), "how does the view get its data?" (an attribute set by the controller, display() without parameters), "where is the validation?" (in Main, through utils/Validation).</div>
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
<p class="lead">Một nửa số session LAB211 là Mentor review. Mentor kiểm đúng một điều: bạn có hiểu code của chính mình, hay chép nó? Vũ khí của họ là một thay đổi nhỏ — "giờ sắp theo ngày giảm dần", "thêm chức năng xóa theo tên", "sao bài này có repository?" — và câu hỏi "bạn sẽ sửa ở đâu?"</p>
<h3>Cách sẵn sàng</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Thuộc các tầng của mình.</b> Nếu được yêu cầu đổi cách sắp, bạn chỉ vào Comparator trong service; thêm chức năng thì: một hàm mới ở repository (hoặc service), một trường trong RequestDTO/ResponseDTO, một hàm controller, một case menu ở Main, và một nhánh trong display() của view. Các tầng của Guide làm mọi câu trả lời hiển nhiên.</div>
  <div class="lz-layer"><b>Nói to luồng chạy</b> (Bài 1.1): Main nhập và validate → RequestDTO → controller → service → repository → model, rồi ResponseDTO → view, render một lần. Câu hỏi quen: "sao có repository?" (tờ check sheet bắt buộc), "view nhận dữ liệu thế nào?" (qua thuộc tính do controller gán, display() không tham số), "validate ở đâu?" (ở Main, qua utils/Validation).</div>
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
      title: 'Part 7 — Code convention (review gate) & going further|||Phần 7 — Quy ước code (cửa review) & nâng cao',
      description: '7.1 là BẮT BUỘC: quy ước code theo tờ Coding check sheet — sai một mục là bị reject. 7.2–7.3 là phần nâng cao: chi phí thuật toán, tự ra đề & tự chấm.',
      lessons: [
        {
          title: '7.1 — Code convention: the check sheet rule by rule|||7.1 — Quy ước code: tờ check sheet từng luật',
          slug: 'lab211-checkstyle',
          type: 'VIDEO',
          description: 'BẮT BUỘC, không phải ngoài giáo trình: đặt tên (1.2–1.5), comment (1.6), trình bày (2.1–2.9, tối đa 100 ký tự/dòng), Constants/Message (2.10–2.11) và các mục performance (3.1–3.8) — kèm code mẫu đạt chuẩn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Part 7 · Lesson 7.1</span>
<h2>Code convention — the check sheet, rule by rule</h2>
<p class="lead">In LAB211, convention is not polish: it is most of the paper check sheet your teacher reviews with, and one item that is not OK rejects the review (Lesson 6.3). CheckStyle — in the syllabus tool list with NetBeans 8.0.2, JDK8 and JavaDoc — catches part of it; the rest is on you. Here is every rule with the form that passes.</p>
<h3>Names (1.2 – 1.5) and constants (2.10, 2.11)</h3>
<table>
  <thead><tr><th>Rule</th><th>✗ Rejected</th><th>✓ Passes</th></tr></thead>
  <tbody>
    <tr><td>1.2 package: lower case, meaningful</td><td><code>Controller</code>, <code>pkg1</code></td><td><code>controller</code>, <code>repository</code></td></tr>
    <tr><td>1.3 class: capital letter + noun</td><td><code>manageDoctor</code>, <code>DoProcess</code></td><td><code>DoctorRepository</code></td></tr>
    <tr><td>1.3 exception class ends in Exception</td><td><code>ExceptionCar</code></td><td><code>CarException</code></td></tr>
    <tr><td>1.3 interface starts with I</td><td><code>SortStrategy</code></td><td><code>ISortStrategy</code></td></tr>
    <tr><td>1.4 method: lower case + verb</td><td><code>Damage()</code>, <code>area()</code>, <code>fibonacci()</code></td><td><code>damage()</code>, <code>getArea()</code>, <code>calculateFibonacci()</code></td></tr>
    <tr><td>1.5 variable: lower case, meaningful</td><td><code>x1</code>, <code>aa</code>, <code>temp2</code>, <code>s</code></td><td><code>line</code>, <code>choice</code>, <code>doctor</code></td></tr>
    <tr><td>1.5 a collection ends in List</td><td><code>students</code>, <code>lines</code></td><td><code>studentList</code>, <code>lineList</code></td></tr>
    <tr><td>1.5 a Set / a Map ends in Set / Map</td><td><code>codes</code>, <code>doctors</code> (a HashMap)</td><td><code>codeSet</code>, <code>doctorMap</code></td></tr>
    <tr><td>1.5 an array ends in Array</td><td><code>String[] parts</code>, <code>int[] a</code></td><td><code>String[] partArray</code>, <code>int[] numberArray</code></td></tr>
    <tr><td>1.5 Id, never ID</td><td><code>employeeID</code>, <code>getAssetID()</code></td><td><code>employeeId</code>, <code>getAssetId()</code></td></tr>
    <tr><td>2.10 / 2.11 constants and messages</td><td><code>int max = 5;</code>, a literal "Enter code: " in Main</td><td><code>Constants.MENU_EXIT</code>, <code>Message.INPUT_CODE</code></td></tr>
  </tbody>
</table>
<h3>Layout (2.1 – 2.9)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Braces.</b> <code>{</code> ends the line, <code>}</code> starts one (2.1); every if / for / while body in braces, even a one-line body (2.2).</div>
  <div class="lz-layer"><b>Lines of at most 100 characters</b> (2.3, comments not counted). Break after <code>&amp;&amp;</code> / <code>||</code> and before <code>+ - *</code>; avoid breaking inside ( ).</div>
  <div class="lz-layer"><b>One declaration, one statement per line</b> (2.4, 2.7): no <code>int a, b;</code>, no <code>t = a; a = b;</code> on one line; <code>break;</code> on its own line.</div>
  <div class="lz-layer"><b>Arrays as <code>Type[] name</code></b> (2.5), never <code>Type name[]</code>.</div>
  <div class="lz-layer"><b>Declarations at the top of each block, with a value</b> (2.6, 3.7): <code>String line = "";</code> first, then inside the loop only <code>line = sc.nextLine();</code>.</div>
  <div class="lz-layer"><b>Blank lines</b> (2.8): between methods, after the declarations, before every comment that follows code, between blocks of logic.</div>
  <div class="lz-layer"><b>Spaces</b> (2.9): before <code>(</code>, after <code>,</code>, around <code>= + - *</code> and around the <code>;</code> of a for.</div>
</div>
<h3>Comments (1.6)</h3>
<p>A comment on <b>every method</b> — getters and setters too — and before <b>every block</b>: if, for, while, switch, each case, try, catch. A short <code>//</code> line is enough for a method; the class gets a Javadoc (<code>/** ... */</code>) that says what it is for. Delete the NetBeans "To change this license header…" comment.</p>
<h3>Performance (3.1 – 3.8)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>3.1</b> Static members through the class name: <code>Validation.getChoice(...)</code>, never through an object.</div>
  <div class="lz-layer"><b>3.2</b> No local variable named like a field or an outer variable (a setter's <code>this.name = name</code> is the accepted exception).</div>
  <div class="lz-layer"><b>3.3</b> Brackets around each comparison: <code>if ((value &lt; min) || (value &gt; max))</code>, <code>(text == null) ? "" : text</code>.</div>
  <div class="lz-layer"><b>3.4</b> Only static methods → <code>final</code> class + private constructor: Validation, FileUtils, Constants, Message, Main.</div>
  <div class="lz-layer"><b>3.5</b> <code>equals</code> / <code>equalsIgnoreCase</code> for String, never <code>==</code>.</div>
  <div class="lz-layer"><b>3.6</b> No variable that is declared and never used.</div>
  <div class="lz-layer"><b>3.8</b> <code>StringBuilder</code>, or <code>String.format(Constants.X_FORMAT, ...)</code> — never <code>result += text</code>.</div>
</div>
<p>Most of it in one method — <code>getChoice</code> from the Validation of the Guide sample: a comment on the method and on each block, the declaration first and initialised, a blank line before each comment, brackets around each comparison, messages from <code>Message</code>:</p>
<pre><code class="language-java">// Converts a menu choice and checks it lies in [min, max].
public static int getChoice(String input, int min, int max) throws Exception {
    int choice = 0;

    // parse first, so a letter gives the "number" message
    try {
        choice = Integer.parseInt(getText(input));
    } catch (NumberFormatException e) {
        // letters or an empty line: not a number at all
        throw new Exception(Message.INVALID_NUMBER);
    }

    // then check the range, so 9 gives the "range" message
    if ((choice &lt; min) || (choice &gt; max)) {
        throw new Exception(String.format(Message.INVALID_RANGE, min, max));
    }

    return choice;
}</code></pre>
<div class="note-ct">Turn CheckStyle on now and fix its warnings as you solve the practice briefs, then do the three self-review passes of Lesson 6.3. By the time you sit a review, clean code is a habit you do not have to think about.</div>
<div class="callout"><span class="badge">Tip</span> <b>Auto-format before every review.</b> NetBeans reformats the whole file with Alt+Shift+F and fixes imports with Ctrl+Shift+I — do it as the last step, right after the final compile. It fixes braces, spaces and indentation; it does not write comments, blank lines before comments, brackets or better names for you.</div>
<a class="link-card exphub" href="/exp-hub/lab211-cai-dat-netbeans?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧹</span>
  <span class="lc-body"><span class="lc-title">Install the CheckStyle plugin</span><span class="lc-sub">Setup steps in the LAB211 tools guide on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Phần 7 · Bài 7.1</span>
<h2>Quy ước code — tờ check sheet, từng luật một</h2>
<p class="lead">Ở LAB211, quy ước code không phải "đánh bóng": nó chiếm phần lớn tờ check sheet thầy dùng để review, và chỉ một mục chưa đạt là buổi review bị reject (Bài 6.3). CheckStyle — nằm trong danh sách công cụ của syllabus cùng NetBeans 8.0.2, JDK8 và JavaDoc — bắt được một phần; phần còn lại là việc của bạn. Dưới đây là từng luật kèm dạng viết được chấp nhận.</p>
<h3>Đặt tên (1.2 – 1.5) và hằng (2.10, 2.11)</h3>
<table>
  <thead><tr><th>Luật</th><th>✗ Bị reject</th><th>✓ Đạt</th></tr></thead>
  <tbody>
    <tr><td>1.2 package: chữ thường, có nghĩa</td><td><code>Controller</code>, <code>pkg1</code></td><td><code>controller</code>, <code>repository</code></td></tr>
    <tr><td>1.3 class: chữ hoa đầu + danh từ</td><td><code>manageDoctor</code>, <code>DoProcess</code></td><td><code>DoctorRepository</code></td></tr>
    <tr><td>1.3 class exception kết thúc bằng Exception</td><td><code>ExceptionCar</code></td><td><code>CarException</code></td></tr>
    <tr><td>1.3 interface bắt đầu bằng I</td><td><code>SortStrategy</code></td><td><code>ISortStrategy</code></td></tr>
    <tr><td>1.4 method: chữ thường + động từ</td><td><code>Damage()</code>, <code>area()</code>, <code>fibonacci()</code></td><td><code>damage()</code>, <code>getArea()</code>, <code>calculateFibonacci()</code></td></tr>
    <tr><td>1.5 biến: chữ thường, có nghĩa</td><td><code>x1</code>, <code>aa</code>, <code>temp2</code>, <code>s</code></td><td><code>line</code>, <code>choice</code>, <code>doctor</code></td></tr>
    <tr><td>1.5 collection kết thúc bằng List</td><td><code>students</code>, <code>lines</code></td><td><code>studentList</code>, <code>lineList</code></td></tr>
    <tr><td>1.5 Set / Map kết thúc bằng Set / Map</td><td><code>codes</code>, <code>doctors</code> (một HashMap)</td><td><code>codeSet</code>, <code>doctorMap</code></td></tr>
    <tr><td>1.5 mảng kết thúc bằng Array</td><td><code>String[] parts</code>, <code>int[] a</code></td><td><code>String[] partArray</code>, <code>int[] numberArray</code></td></tr>
    <tr><td>1.5 viết Id, không viết ID</td><td><code>employeeID</code>, <code>getAssetID()</code></td><td><code>employeeId</code>, <code>getAssetId()</code></td></tr>
    <tr><td>2.10 / 2.11 hằng và thông báo</td><td><code>int max = 5;</code>, chuỗi "Enter code: " gõ thẳng trong Main</td><td><code>Constants.MENU_EXIT</code>, <code>Message.INPUT_CODE</code></td></tr>
  </tbody>
</table>
<h3>Trình bày (2.1 – 2.9)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Ngoặc nhọn.</b> <code>{</code> ở cuối dòng, <code>}</code> ở đầu dòng (2.1); thân if / for / while luôn trong ngoặc, kể cả chỉ một dòng (2.2).</div>
  <div class="lz-layer"><b>Mỗi dòng tối đa 100 ký tự</b> (2.3, không tính comment). Ngắt sau <code>&amp;&amp;</code> / <code>||</code>, trước <code>+ - *</code>; hạn chế ngắt giữa biểu thức trong ().</div>
  <div class="lz-layer"><b>Mỗi dòng một khai báo, một lệnh</b> (2.4, 2.7): không <code>int a, b;</code>, không <code>t = a; a = b;</code> trên một dòng; <code>break;</code> nằm dòng riêng.</div>
  <div class="lz-layer"><b>Mảng khai báo kiểu <code>Type[] name</code></b> (2.5), không bao giờ <code>Type name[]</code>.</div>
  <div class="lz-layer"><b>Khai báo ở đầu mỗi block, có khởi tạo</b> (2.6, 3.7): <code>String line = "";</code> trước, trong vòng lặp chỉ còn <code>line = sc.nextLine();</code>.</div>
  <div class="lz-layer"><b>Dòng trống</b> (2.8): giữa các method, sau vùng khai báo, trước mọi comment đứng sau code, giữa các khối xử lý logic.</div>
  <div class="lz-layer"><b>Dấu cách</b> (2.9): trước <code>(</code>, sau <code>,</code>, quanh <code>= + - *</code> và quanh <code>;</code> trong for.</div>
</div>
<h3>Comment (1.6)</h3>
<p>Comment trên <b>mọi method</b> — kể cả getter, setter — và trước <b>mọi block</b>: if, for, while, switch, từng case, try, catch. Với method, một dòng <code>//</code> ngắn là đủ; lớp có Javadoc (<code>/** ... */</code>) nói lớp dùng để làm gì. Xoá comment "To change this license header…" của NetBeans.</p>
<h3>Performance (3.1 – 3.8)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>3.1</b> Gọi thành phần static qua tên lớp: <code>Validation.getChoice(...)</code>, không qua đối tượng.</div>
  <div class="lz-layer"><b>3.2</b> Không đặt biến local trùng tên field hay biến cấp ngoài (setter kiểu <code>this.name = name</code> là ngoại lệ được chấp nhận).</div>
  <div class="lz-layer"><b>3.3</b> Ngoặc quanh từng phép so sánh: <code>if ((value &lt; min) || (value &gt; max))</code>, <code>(text == null) ? "" : text</code>.</div>
  <div class="lz-layer"><b>3.4</b> Lớp chỉ có hàm static → <code>final</code> + constructor private: Validation, FileUtils, Constants, Message, Main.</div>
  <div class="lz-layer"><b>3.5</b> So String bằng <code>equals</code> / <code>equalsIgnoreCase</code>, không bao giờ bằng <code>==</code>.</div>
  <div class="lz-layer"><b>3.6</b> Không có biến khai báo mà không dùng.</div>
  <div class="lz-layer"><b>3.8</b> <code>StringBuilder</code>, hoặc <code>String.format(Constants.X_FORMAT, ...)</code> — không bao giờ <code>result += text</code>.</div>
</div>
<p>Gần đủ mọi luật trong một method — <code>getChoice</code> trong Validation của project mẫu: comment cho method và từng block, khai báo đứng đầu và có khởi tạo, dòng trống trước mỗi comment, ngoặc quanh từng phép so sánh, thông báo lấy từ <code>Message</code>:</p>
<pre><code class="language-java">// Converts a menu choice and checks it lies in [min, max].
public static int getChoice(String input, int min, int max) throws Exception {
    int choice = 0;

    // parse first, so a letter gives the "number" message
    try {
        choice = Integer.parseInt(getText(input));
    } catch (NumberFormatException e) {
        // letters or an empty line: not a number at all
        throw new Exception(Message.INVALID_NUMBER);
    }

    // then check the range, so 9 gives the "range" message
    if ((choice &lt; min) || (choice &gt; max)) {
        throw new Exception(String.format(Message.INVALID_RANGE, min, max));
    }

    return choice;
}</code></pre>
<div class="note-ct">Bật CheckStyle ngay và sửa cảnh báo của nó khi giải các đề luyện, rồi làm ba lượt tự soát của Bài 6.3. Tới lúc ngồi review, code sạch là thói quen bạn không cần nghĩ tới.</div>
<div class="callout"><span class="badge">Mẹo</span> <b>Auto-format trước mỗi lần xin review.</b> NetBeans định dạng lại cả tệp bằng Alt+Shift+F và sửa import bằng Ctrl+Shift+I — làm ở bước cuối, ngay sau lần biên dịch chót. Nó sửa ngoặc, dấu cách và thụt lề; nó không viết hộ comment, dòng trống trước comment, ngoặc quanh phép so sánh hay tên có nghĩa.</div>
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
  <div class="lz-step">Invent a small management brief (one model class + 4–5 features)</div>
  <div class="lz-step">Write the expected screen output precisely</div>
  <div class="lz-step">Solve it under a timer, no help</div>
  <div class="lz-step">Grade yourself with the 25-item check sheet (an "O" per item), then labels, validation, compile, every menu option</div>
  <div class="lz-step">Have the AI coach change a requirement &amp; defend your answer</div>
</div>
<div class="callout ok">Do this three times in the last week before the exam. Combined with the 54 solved briefs, you will walk in having already seen every shape the exam can take.</div>
<h3>Your pass plan, in one line</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Solve real briefs yourself, easy → hard · validate &amp; match output every time · pass your own check-sheet review before the teacher's · rehearse under a timer · defend your code in the viva.</b> That is the whole method — and it is why students who do the work pass, and students who read solutions do not.</div>
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
  <div class="lz-step">Nghĩ ra một đề quản lý nhỏ (một lớp model + 4–5 chức năng)</div>
  <div class="lz-step">Viết output màn hình mong đợi chính xác</div>
  <div class="lz-step">Tự giải dưới đồng hồ, không trợ giúp</div>
  <div class="lz-step">Tự chấm bằng tờ check sheet 25 mục (điền "O" từng mục), rồi nhãn, validate, biên dịch, mọi lựa chọn menu</div>
  <div class="lz-step">Cho AI coach đổi một yêu cầu &amp; bảo vệ câu trả lời</div>
</div>
<div class="callout ok">Làm điều này ba lần trong tuần cuối trước buổi lab lớn. Kết hợp với 54 đề đã giải, bạn bước vào phòng lab khi đã thấy mọi hình dạng một đề có thể mang.</div>
<h3>Kế hoạch qua môn, một dòng</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Tự giải đề thật, dễ → khó · validate &amp; khớp output mỗi lần · tự soát theo tờ check sheet trước khi thầy review · diễn tập dưới đồng hồ · bảo vệ code khi vấn đáp.</b> Đó là toàn bộ phương pháp — và là lý do sinh viên chịu làm thì qua, còn sinh viên đọc lời giải thì không.</div>
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
          title: 'Quiz 7 — Convention, cost & self-grading|||Quiz 7 — Quy ước code, chi phí & tự chấm',
          slug: 'lab211-quiz-7',
          type: 'QUIZ',
          description: 'Kiểm tra quy ước code theo tờ check sheet, chi phí thuật toán và tư duy tự chấm.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Code convention matters in LAB211 because…|||Quy ước code quan trọng trong LAB211 vì…', options: ['it makes the program run faster|||nó làm chương trình chạy nhanh hơn', 'your teacher reviews the code with a 25-item check sheet, and one item not OK rejects the review|||thầy review code bằng tờ check sheet 25 mục, và một mục chưa đạt là bị reject', 'it is optional polish beyond the syllabus|||nó là phần đánh bóng tuỳ chọn ngoài giáo trình', 'it replaces testing|||nó thay cho việc test'], correctIndex: 1, points: 1 },
              { question: 'The check sheet limits one line of code (comments not counted) to…|||Tờ check sheet giới hạn một dòng code (không tính comment) tối đa…', options: ['80 characters|||80 ký tự', '100 characters|||100 ký tự', '120 characters|||120 ký tự', '150 characters|||150 ký tự'], correctIndex: 1, points: 1 },
              { question: 'Which set of names passes item 1.5 of the check sheet?|||Bộ tên nào đạt mục 1.5 của tờ check sheet?', options: ['students, codes, employeeID', 'studentList, codeSet, doctorMap, partArray, employeeId', 'StudentList, CODE_SET, doctors', 'list1, map2, arr'], correctIndex: 1, points: 1 },
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
      "title": "Assessment — what LAB211 really judges|||Đánh giá — LAB211 thực sự chấm cái gì",
      "description": "Syllabus LAB211 liệt kê 0 assessment: không thi lý thuyết, không thi cuối kỳ, không trọng số, không điểm qua. Hai bài dưới nói rõ cái gì thực sự được đánh giá (assignment tại lab + mentor review) và cái gì chỉ là thông lệ.",
      "lessons": [
        {
          "title": "Lab assignments & mentor review — what is really assessed|||Bài lab & mentor review — cái thực sự được đánh giá",
          "slug": "lab211-final-exam-pe",
          "type": "article",
          "description": "Syllabus LAB211 không có kỳ thi nào. Bài này nói rõ cái gì thực sự được đánh giá (assignment làm liên tục tại lab + mentor review + 80% điểm danh) và cách chuẩn bị.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Assessment · Lab work</span>\n<h2>What is really assessed: lab assignments &amp; mentor review</h2>\n<p class=\"lead\">LAB211 has <strong>no exam in its syllabus</strong> &mdash; not a written one, not a practical one. The syllabus (ID 10021) ends with the line <strong>&ldquo;0 assessment(s)&rdquo;</strong>: no assessment table, no component weights, no scoring scale, no pass mark. What it does define is the work itself, and that is what you are judged on.</p>\n<h3>The three things the syllabus does state</h3>\n<div class=\"lz-stack\">\n  <div class=\"lz-layer\"><b>1 &middot; Assignments, completed continuously in the defined time.</b> The Description says it in one sentence: <q>Each assignment must be completed continuosly in the defined time.</q> You sit down in the lab room, you get a brief, and the program is expected to be finished in that sitting &mdash; not taken home and polished.</div>\n  <div class=\"lz-layer\"><b>2 &middot; 28 Practice slots alternating with 28 Mentor review slots.</b> Every piece of practice is followed by a review slot. The review is where a mentor looks at the program you wrote and decides whether it counts.</div>\n  <div class=\"lz-layer\"><b>3 &middot; At least 80% attendance</b> &mdash; literally, &ldquo;in order to be accepted to the final results&rdquo;. Miss more than a fifth of the contact slots and the rest of your work does not matter.</div>\n</div>\n<div class=\"callout warn\"><span class=\"badge\">Not in the syllabus</span> Weights, a pass mark, a question bank, a fixed exam duration &mdash; none of these are published for LAB211. The mentor-only materials (<em>Mentor guide for Lab</em>, <em>Evaluation Templates</em>) hold the marking rules, and your term's arrangement is on the FLM. Ask your mentor in the first slots; do not assume a number you read online.</div>\n<h3>How a lab assignment is judged in practice</h3>\n<p>This is the common practice at FU lab rooms, described here so you can prepare &mdash; treat it as <em>how it usually goes</em>, not as a rule from the syllabus:</p>\n<ul>\n<li>You are given a brief with a <strong>sample screen</strong>: the exact prompts, labels and formatting the program must print.</li>\n<li>Your mentor compiles and runs your program, types the sample inputs, and compares the console output with that screen. A missing space in <span class=\"badge\">%-15s</span> or <span class=\"badge\">\"Area: \"</span> vs <span class=\"badge\">\"Area:\"</span> reads as wrong even when the logic is right.</li>\n<li>Bad input is tried. A program that dies on <span class=\"badge\">InputMismatchException</span> loses the run it was supposed to survive.</li>\n<li>Code that does not compile earns nothing at all &mdash; compiling is the gate, not a bonus.</li>\n<li>Your code is also read line by line against your teacher's paper <strong>Coding check sheet</strong> (25 items: the Guide's MVC with a mandatory repository, names, comments, formatting, performance). One item not OK and the review is rejected &mdash; you fix it and ask again (Lesson 6.3).</li>\n<li>You are then asked about your own code, and often asked to <strong>change a requirement on the spot</strong>. Lesson 6.4 rehearses exactly that.</li>\n</ul>\n<h3>How to prepare for it</h3>\n<ul>\n<li>Work the way the assignment rule forces you to: <strong>one sitting, one finished program</strong>. Pick a brief from Part 8, set a timer, no notes.</li>\n<li>Rebuild the Guide's MVC skeleton (Lesson 1.1: constants &middot; model &middot; dto &middot; repository &middot; service &middot; controller &middot; view &middot; utils &middot; main) from a blank project until structure costs you zero thinking time.</li>\n<li>Before every review, self-check your code with the 25-item check sheet, up to three passes, and ask only when every item is &ldquo;O&rdquo; (Lesson 6.3).</li>\n<li>Always validate input and copy output labels character for character (Lessons 1.2, 1.3, 6.3).</li>\n<li>Before each mentor review, be able to explain <em>why</em> every class exists and to modify one requirement live (Lesson 6.4).</li>\n<li>Attend. 80% is a hard gate and the cheapest mark in the subject.</li>\n</ul>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Đánh giá · Bài lab</span>\n<h2>Cái thực sự được đánh giá: assignment tại lab &amp; mentor review</h2>\n<p class=\"lead\">LAB211 <strong>không có kỳ thi nào trong syllabus</strong> &mdash; không thi viết, cũng không thi thực hành. Syllabus (ID 10021) kết thúc bằng dòng <strong>&ldquo;0 assessment(s)&rdquo;</strong>: không bảng đánh giá, không trọng số, không thang điểm, không điểm qua. Cái nó có định nghĩa là chính công việc, và đó là thứ bạn bị đánh giá.</p>\n<h3>Ba điều syllabus có nói</h3>\n<div class=\"lz-stack\">\n  <div class=\"lz-layer\"><b>1 &middot; Assignment phải làm liên tục trong thời gian quy định.</b> Phần Description viết đúng một câu: <q>Each assignment must be completed continuosly in the defined time.</q> Bạn ngồi vào phòng lab, nhận đề, và chương trình phải xong ngay trong buổi đó &mdash; không mang về nhà gọt giũa.</div>\n  <div class=\"lz-layer\"><b>2 &middot; 28 slot Practice xen kẽ 28 slot Mentor review.</b> Mỗi lần luyện đều có một buổi review theo sau. Buổi review là lúc mentor xem chương trình bạn viết và quyết định nó có được tính hay không.</div>\n  <div class=\"lz-layer\"><b>3 &middot; Dự tối thiểu 80% slot</b> &mdash; nguyên văn: &ldquo;để được chấp nhận vào kết quả cuối cùng&rdquo;. Vắng quá một phần năm số slot thì mọi thứ còn lại không còn ý nghĩa.</div>\n</div>\n<div class=\"callout warn\"><span class=\"badge\">Không có trong syllabus</span> Trọng số, điểm qua, ngân hàng đề, thời lượng thi cố định &mdash; LAB211 không công bố thứ nào. Quy tắc chấm nằm trong tài liệu chỉ dành cho mentor (<em>Mentor guide for Lab</em>, <em>Evaluation Templates</em>), còn cách tổ chức của kỳ bạn học nằm trên FLM. Hỏi mentor trong những slot đầu; đừng tin một con số đọc được trên mạng.</div>\n<h3>Một bài lab thường được chấm thế nào trên thực tế</h3>\n<p>Đây là thông lệ phổ biến ở phòng lab FU, mô tả để bạn chuẩn bị &mdash; hãy coi là <em>thường diễn ra như vậy</em>, không phải quy định của syllabus:</p>\n<ul>\n<li>Bạn nhận đề kèm <strong>màn hình mẫu</strong>: đúng từng dòng nhắc, nhãn và định dạng chương trình phải in ra.</li>\n<li>Mentor biên dịch và chạy chương trình, gõ dữ liệu mẫu, rồi so output console với màn hình đó. Thiếu một dấu cách trong <span class=\"badge\">%-15s</span> hay <span class=\"badge\">\"Area: \"</span> vs <span class=\"badge\">\"Area:\"</span> đều bị đọc là sai dù logic đúng.</li>\n<li>Dữ liệu xấu sẽ được thử. Chương trình chết vì <span class=\"badge\">InputMismatchException</span> là mất lần chạy lẽ ra phải sống sót.</li>\n<li>Code không biên dịch được thì không có điểm nào &mdash; biên dịch là cửa ải, không phải điểm cộng.</li>\n<li>Code của bạn còn được đọc từng dòng theo tờ giấy <strong>Coding check sheet</strong> của thầy (25 mục: MVC theo Guide với repository bắt buộc, đặt tên, comment, trình bày, performance). Một mục chưa đạt là buổi review bị reject &mdash; sửa rồi xin review lại (Bài 6.3).</li>\n<li>Sau đó bạn bị hỏi về chính code của mình, và thường bị yêu cầu <strong>đổi một yêu cầu ngay tại chỗ</strong>. Bài 6.4 tập đúng việc đó.</li>\n</ul>\n<h3>Chuẩn bị thế nào</h3>\n<ul>\n<li>Luyện đúng như quy định assignment ép bạn: <strong>một buổi, một chương trình hoàn chỉnh</strong>. Chọn một đề ở Phần 8, bấm giờ, không nhìn ghi chú.</li>\n<li>Dựng lại khung MVC theo Guide (Bài 1.1: constants &middot; model &middot; dto &middot; repository &middot; service &middot; controller &middot; view &middot; utils &middot; main) từ project trống tới khi cấu trúc không tốn giây suy nghĩ nào.</li>\n<li>Trước mỗi buổi review, tự soát code theo tờ check sheet 25 mục, tối đa ba lượt, và chỉ xin review khi mọi mục đã là &ldquo;O&rdquo; (Bài 6.3).</li>\n<li>Luôn validate input và chép nhãn output tới từng ký tự (Bài 1.2, 1.3, 6.3).</li>\n<li>Trước mỗi buổi mentor review, phải giải thích được <em>vì sao</em> mỗi lớp tồn tại và sửa được một yêu cầu ngay tại chỗ (Bài 6.4).</li>\n<li>Đi học đầy đủ. 80% là cửa cứng và là điểm rẻ nhất của môn.</li>\n</ul>\n</div>"
        },
        {
          "title": "No written final exam in this subject|||Môn này không có thi cuối kỳ",
          "slug": "lab211-final-exam-fe",
          "type": "article",
          "description": "Syllabus LAB211 ghi \"0 assessment(s)\": không thi trắc nghiệm, không trọng số, không điểm qua. Sự thật + tự kiểm.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Assessment · No theory exam</span>\n<h2>There is no written final exam in LAB211</h2>\n<p class=\"lead\">If you came here looking for a multiple-choice final: <strong>LAB211 does not have one</strong>. The syllabus (ID 10021, Decision 808/QĐ-ĐHFPT, 03/08/2023) lists <strong>&ldquo;0 assessment(s)&rdquo;</strong> and <strong>0 constructive questions</strong>. There is no final exam row, no duration, no weight and no pass mark anywhere in it &mdash; the field other syllabi use for the pass mark (<em>MinAvgMarkToPass</em>) is simply absent.</p>\n<div class=\"callout\"><span class=\"badge\">Why this page exists</span> It used to describe a computer-graded multiple-choice final. That was wrong, so it now says what the syllabus says. Do not revise for a theory exam that is not there &mdash; put the hours into writing programs instead.</div>\n<h3>What the syllabus gives you instead</h3>\n<table class=\"tbl\">\n<thead><tr><th>Field</th><th>LAB211</th></tr></thead>\n<tbody>\n<tr><td>Assessments listed</td><td><strong>None</strong> &mdash; &ldquo;0 assessment(s)&rdquo;</td></tr>\n<tr><td>Constructive questions</td><td><strong>0</strong></td></tr>\n<tr><td>Scoring scale / pass mark</td><td>Not stated (no <em>MinAvgMarkToPass</em> field)</td></tr>\n<tr><td>Sessions</td><td>4 Orientation + 28 Practice + 28 Mentor review</td></tr>\n<tr><td>Attendance</td><td>≥ 80% of contact slots, to be accepted to the final results</td></tr>\n<tr><td>Assignment rule</td><td>Each assignment completed continuously in the defined time</td></tr>\n<tr><td>Where the marking rules live</td><td>Mentor guide for Lab and Evaluation Templates (mentors only) + your term's FLM page</td></tr>\n</tbody>\n</table>\n<h3>So what should you do with this slot in your revision plan?</h3>\n<ul>\n<li><strong>Ask, do not guess.</strong> In the first Orientation slots, ask your mentor how the term is graded and write the answer down. That is the only authoritative source for LAB211.</li>\n<li><strong>Revise by typing.</strong> Every hour you would have spent on flashcards goes into a brief from Part 8, solved from a blank project with a timer.</li>\n<li><strong>Rehearse the review, not the exam.</strong> The recurring event in this subject is the mentor review (28 of them). Lesson 6.4 &mdash; the &ldquo;change a requirement&rdquo; viva &mdash; is the closest thing LAB211 has to an exam rehearsal.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Self-check</span> The questions below check that you have the facts of this subject straight &mdash; they are not a sample of any real exam, because there is none.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Đánh giá · Không có thi lý thuyết</span>\n<h2>LAB211 không có bài thi cuối kỳ nào</h2>\n<p class=\"lead\">Nếu bạn vào đây tìm đề trắc nghiệm cuối kỳ: <strong>LAB211 không có</strong>. Syllabus (ID 10021, Quyết định 808/QĐ-ĐHFPT ngày 03/08/2023) ghi <strong>&ldquo;0 assessment(s)&rdquo;</strong> và <strong>0 câu hỏi kiến tạo</strong>. Không có dòng thi cuối kỳ, không thời lượng, không trọng số, không điểm qua &mdash; trường mà các syllabus khác dùng để ghi điểm qua (<em>MinAvgMarkToPass</em>) ở đây đơn giản là không tồn tại.</p>\n<div class=\"callout\"><span class=\"badge\">Vì sao có trang này</span> Trước đây trang này mô tả một bài thi trắc nghiệm máy chấm. Điều đó sai, nên giờ nó nói đúng thứ syllabus nói. Đừng ôn cho một kỳ thi lý thuyết không tồn tại &mdash; hãy đổ số giờ đó vào việc viết chương trình.</div>\n<h3>Thay vào đó syllabus cho bạn cái gì</h3>\n<table class=\"tbl\">\n<thead><tr><th>Mục</th><th>LAB211</th></tr></thead>\n<tbody>\n<tr><td>Thành phần đánh giá</td><td><strong>Không có</strong> &mdash; &ldquo;0 assessment(s)&rdquo;</td></tr>\n<tr><td>Câu hỏi kiến tạo</td><td><strong>0</strong></td></tr>\n<tr><td>Thang điểm / điểm qua</td><td>Không nêu (không có trường <em>MinAvgMarkToPass</em>)</td></tr>\n<tr><td>Số session</td><td>4 Orientation + 28 Practice + 28 Mentor review</td></tr>\n<tr><td>Điểm danh</td><td>≥ 80% số slot, để được chấp nhận vào kết quả cuối cùng</td></tr>\n<tr><td>Quy định assignment</td><td>Mỗi assignment làm liên tục trong thời gian quy định</td></tr>\n<tr><td>Quy tắc chấm nằm ở đâu</td><td>Mentor guide for Lab và Evaluation Templates (chỉ mentor) + trang FLM của kỳ bạn học</td></tr>\n</tbody>\n</table>\n<h3>Vậy dùng chỗ trống này trong kế hoạch ôn thế nào?</h3>\n<ul>\n<li><strong>Hỏi, đừng đoán.</strong> Trong các slot Orientation đầu tiên, hỏi mentor kỳ này chấm ra sao và ghi lại. Đó là nguồn duy nhất có thẩm quyền cho LAB211.</li>\n<li><strong>Ôn bằng cách gõ.</strong> Mỗi giờ lẽ ra dành cho thẻ ghi nhớ hãy đổ vào một đề ở Phần 8, giải từ project trống, có bấm giờ.</li>\n<li><strong>Diễn tập buổi review, không phải kỳ thi.</strong> Sự kiện lặp lại của môn này là mentor review (28 buổi). Bài 6.4 &mdash; vấn đáp &ldquo;đổi yêu cầu&rdquo; &mdash; là thứ gần với diễn tập thi nhất mà LAB211 có.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Tự kiểm</span> Các câu dưới kiểm tra bạn nắm đúng sự thật về môn này &mdash; chúng không phải mẫu của bài thi nào, vì không có bài thi nào.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                            "id": "q1",
                            "points": 1,
                            "question": "How many assessment components does the LAB211 syllabus list?|||Syllabus LAB211 liệt kê bao nhiêu thành phần đánh giá?",
                            "options": [
                                          "none — it lists \"0 assessment(s)\"|||không có — nó ghi \"0 assessment(s)\"",
                                          "four|||bốn",
                                          "five|||năm",
                                          "one final exam only|||chỉ một bài thi cuối kỳ"
                            ],
                            "correctIndex": 0
              },
              {
                            "id": "q2",
                            "points": 1,
                            "question": "The pass mark for LAB211 is…|||Điểm qua môn LAB211 là…",
                            "options": [
                                          "5.0, stated in the syllabus|||5,0, ghi trong syllabus",
                                          "4.0, stated in the syllabus|||4,0, ghi trong syllabus",
                                          "not stated in the syllabus — ask the mentor or the FLM|||không có trong syllabus — hỏi mentor hoặc FLM",
                                          "decided by the student|||do sinh viên tự chọn"
                            ],
                            "correctIndex": 2
              },
              {
                            "id": "q3",
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
                            "id": "q4",
                            "points": 1,
                            "question": "The syllabus rule about assignments says each one must be…|||Quy định của syllabus về assignment nói mỗi bài phải…",
                            "options": [
                                          "completed continuously in the defined time|||hoàn thành liên tục trong thời gian quy định",
                                          "submitted within a week|||nộp trong vòng một tuần",
                                          "done in pairs|||làm theo cặp",
                                          "presented as slides|||trình bày bằng slide"
                            ],
                            "correctIndex": 0
              },
              {
                            "id": "q5",
                            "points": 1,
                            "question": "The 60 sessions of LAB211 are…|||60 session của LAB211 là…",
                            "options": [
                                          "lectures and seminars|||bài giảng và seminar",
                                          "4 orientation, then Practice alternating with Mentor review|||4 buổi định hướng, rồi Practice xen kẽ Mentor review",
                                          "all self-study|||toàn bộ tự học",
                                          "30 lectures and 30 exams|||30 bài giảng và 30 buổi thi"
                            ],
                            "correctIndex": 1
              },
              {
                            "id": "q6",
                            "points": 1,
                            "question": "Attendance below 80% of contact slots means…|||Dự dưới 80% số slot nghĩa là…",
                            "options": [
                                          "a one-point penalty|||bị trừ một điểm",
                                          "you are not accepted to the final results|||bạn không được chấp nhận vào kết quả cuối cùng",
                                          "nothing, attendance is optional|||không sao, điểm danh là tùy chọn",
                                          "you repeat one session|||bạn học lại một buổi"
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
<div class="callout warn"><span class="badge">Before you start</span> These briefs are older than your teacher's Coding check sheet. Build every one of them on the Guide's MVC (Lesson 1.1) and self-review with the sheet (Lesson 6.3). Where a brief asks for something the sheet forbids — a model that prints, <code>ExceptionCar</code>, <code>Damage()</code>, <code>employeeID</code> — the card says what the standard solution does instead.</div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0060-calculate-the-total-amount-spent-by-a-user-through-the-bills?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">01 · Calculate the total amount spent by a user through the bills</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~25p</span> Build a Person and Wallet pair of classes that read in a list of bills and the amount currently in the wallet. Implement calcTotal to sum the bills and payMoney to compare that total against the wallet balance. ⚠ Check sheet: payMoney returns true/false and the view prints the answer — Wallet is a model and never prints.</span></span>
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
  <span class="lc-body"><span class="lc-title">06 · Input, sort and display student information</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~44p</span> Collect a list of students (name, class, mark), re-prompting while the mark isn't a valid number, then use a custom Comparator with Collections.sort() to order them by name A to Z. Implement sortStudent to return the sorted list and display to print every student's details. ⚠ Check sheet: display() lives in the view and takes no parameter — the sorted list reaches it through the ResponseDTO.</span></span>
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
  <span class="lc-body"><span class="lc-title">13 · Create a program to calculate perimeter and area</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~50p</span> Design an abstract Shape class with getPerimeter, getArea and printResult, then extend it with Circle, Rectangle and Triangle subclasses that store their own dimensions. Rectangle and Circle use straightforward geometry formulas while Triangle computes its area with Heron's formula via Math.sqrt(). ⚠ Check sheet: a model never prints — the standard solution keeps printResult() on the view (no parameter, called once) and the shapes hand over their text through toString().</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="note-ct">Each exercise page has a "Video tutorial" slot that is currently empty and will be filled in later — no action is needed from you.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Part 8 · Lesson 8.1</span>
<h2>Khởi động Dễ — 13 bài</h2>
<p class="lead">Đây là 13 bài tập độ khó DỄ thuộc track Lab211 trên CodeLab, điểm khởi đầu phù hợp trước khi chuyển sang các bài OOP with Java khó hơn. Mỗi thẻ bên dưới mở đề bài đầy đủ, lời giải tham khảo và sơ đồ minh hoạ trên CodeLab.</p>
<div class="callout warn"><span class="badge">Trước khi làm</span> Các đề này ra đời trước tờ Coding check sheet của thầy. Bài nào cũng dựng theo MVC của Guide (Bài 1.1) và tự soát theo tờ check sheet (Bài 6.3). Chỗ nào đề đòi điều tờ giấy cấm — model tự in, <code>ExceptionCar</code>, <code>Damage()</code>, <code>employeeID</code> — thẻ bài ghi rõ lời giải chuẩn làm thế nào.</div>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0060-calculate-the-total-amount-spent-by-a-user-through-the-bills?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">01 · Calculate the total amount spent by a user through the bills</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~25p</span> Xây dựng cặp lớp Person và Wallet đọc vào danh sách hoá đơn cùng số tiền hiện có trong ví. Cài đặt calcTotal để cộng tổng hoá đơn và payMoney để so sánh tổng đó với số dư trong ví. ⚠ Tờ check sheet: payMoney trả về true/false và view in câu trả lời — Wallet là model nên không in gì.</span></span>
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
  <span class="lc-body"><span class="lc-title">06 · Input, sort and display student information</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~44p</span> Thu thập danh sách sinh viên (tên, lớp, điểm), yêu cầu nhập lại nếu điểm không phải số hợp lệ, sau đó dùng Comparator tuỳ chỉnh với Collections.sort() để sắp xếp theo tên từ A đến Z. Cài đặt sortStudent để trả về danh sách đã sắp xếp và display để in thông tin từng sinh viên. ⚠ Tờ check sheet: display() nằm ở view và không có tham số — danh sách đã sắp tới nó qua ResponseDTO.</span></span>
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
  <span class="lc-body"><span class="lc-title">13 · Create a program to calculate perimeter and area</span><span class="lc-sub"><span class="badge">EASY</span> <span class="badge">~50p</span> Thiết kế lớp trừu tượng Shape với getPerimeter, getArea và printResult, sau đó kế thừa thành các lớp con Circle, Rectangle và Triangle tự lưu kích thước riêng. Rectangle và Circle dùng công thức hình học thông thường, còn Triangle tính diện tích bằng công thức Heron thông qua Math.sqrt(). ⚠ Tờ check sheet: model không được in — lời giải chuẩn để printResult() ở view (không tham số, gọi một lần), còn các hình trả chữ của mình qua toString().</span></span>
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
<div class="callout warn"><span class="badge">Before you start</span> These briefs are older than your teacher's Coding check sheet. Build every one of them on the Guide's MVC (Lesson 1.1) and self-review with the sheet (Lesson 6.3). Where a brief asks for something the sheet forbids — a model that prints, <code>ExceptionCar</code>, <code>Damage()</code>, <code>employeeID</code> — the card says what the standard solution does instead.</div>
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
  <span class="lc-body"><span class="lc-title">09 · Car showroom</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~81p</span> Check whether a customer's requested car (name, color, price, day) matches what the showroom actually sells, using enums for the three car models (Audi, Mercedes, BMW) with their fixed colors, prices and sale days. An unpainted car ('no color') gets a $100 discount, and any mismatch on name, color, price or day throws a custom exception with the reason. ⚠ The brief calls it ExceptionCar; check sheet 1.3 wants exception classes to end in "Exception" — the standard solution names it CarException, with // brief: ExceptionCar on the line above.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0054-develop-the-contact-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">10 · Develop the Contact Management Program</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~83p</span> Manage a contact list (add, display, delete) where each contact gets an auto-incrementing ID and its first/last name split from a single entered name. Adding a contact validates the phone number against several accepted formats (plain digits, dashes, dots, spaces, extensions), and deleting requires a valid existing ID.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0052-write-a-program-to-manage-the-geographic?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">11 · Write a program to manage the geographic</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~89p</span> Model countries with a base Country class (code, name, area) and an EastAsiaCountries subclass adding terrain, using inheritance and an overridden display() (⚠ check sheet: in the model it must return the text — the view prints it). The menu lets the user enter data for East Asian countries, list what was entered, search by name, and print the list sorted alphabetically.</span></span>
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
  <span class="lc-body"><span class="lc-title">22 · Bees</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~117p</span> Model a Bee hierarchy (Worker, Queen, Drone) where every bee starts at 100% health, exposes a read-only health/dead status, and has a damage(percent) method (⚠ the brief writes Damage; check sheet 1.4 wants a lower-case verb — the standard solution keeps // brief: Damage above it) that reduces health by a percentage of its current value — each subclass dies at its own threshold (70%, 20%, 50%). A console menu creates a colony of 30 bees (10 of each kind) and applies one round of random damage to all of them, reprinting each bee's updated health and alive/dead status.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<div class="note-ct">Each exercise page has a "Video tutorial" slot that is currently empty and will be filled in later — no action is needed from you.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Part 8 · Lesson 8.2</span>
<h2>Thực hành Trung bình — 22 bài</h2>
<p class="lead">Đây là 22 bài tập mức TRUNG BÌNH từ track Lab211 trên CodeLab — phần xương sống của khoá học này, bao phủ file I/O, collections, kiểm tra dữ liệu (validation), sắp xếp/tìm kiếm và kế thừa/đa hình. Mỗi thẻ bên dưới sẽ mở đề bài đầy đủ, bài giải tham khảo và sơ đồ trên CodeLab.</p>
<div class="callout warn"><span class="badge">Trước khi làm</span> Các đề này ra đời trước tờ Coding check sheet của thầy. Bài nào cũng dựng theo MVC của Guide (Bài 1.1) và tự soát theo tờ check sheet (Bài 6.3). Chỗ nào đề đòi điều tờ giấy cấm — model tự in, <code>ExceptionCar</code>, <code>Damage()</code>, <code>employeeID</code> — thẻ bài ghi rõ lời giải chuẩn làm thế nào.</div>
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
  <span class="lc-body"><span class="lc-title">09 · Car showroom</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~81p</span> Kiểm tra xem yêu cầu mua xe của khách (tên xe, màu, giá, ngày) có khớp với những gì showroom thực sự bán hay không, dùng enum cho ba hãng xe (Audi, Mercedes, BMW) với màu, giá và ngày bán cố định. Xe không sơn ('no color') được giảm 100 đô, và bất kỳ sai lệch nào về tên, màu, giá hay ngày sẽ ném ra ngoại lệ tự định nghĩa kèm lý do. ⚠ Đề đặt tên ExceptionCar; tờ check sheet 1.3 bắt tên class exception kết thúc bằng "Exception" — lời giải chuẩn đặt CarException, dòng ngay trên ghi // brief: ExceptionCar.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0054-develop-the-contact-management-program?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">10 · Develop the Contact Management Program</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~83p</span> Quản lý danh bạ liên hệ (thêm, hiển thị, xoá), mỗi liên hệ được cấp ID tự tăng và tên/họ được tách tự động từ tên nhập vào. Khi thêm liên hệ, số điện thoại được kiểm tra theo nhiều định dạng chấp nhận (số thuần, có gạch ngang, dấu chấm, khoảng trắng, số máy lẻ), còn xoá liên hệ đòi hỏi ID hợp lệ đang tồn tại.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>
<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-s-p0052-write-a-program-to-manage-the-geographic?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">11 · Write a program to manage the geographic</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~89p</span> Mô hình hoá các quốc gia với lớp cơ sở Country (mã, tên, diện tích) và lớp con EastAsiaCountries thêm thuộc tính địa hình, sử dụng kế thừa và ghi đè display() (⚠ tờ check sheet: trong model nó phải trả về chữ — view mới là nơi in). Menu cho phép nhập dữ liệu các nước Đông Á, hiển thị danh sách đã nhập, tìm theo tên, và in danh sách đã sắp xếp theo tên.</span></span>
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
  <span class="lc-body"><span class="lc-title">22 · Bees</span><span class="lc-sub"><span class="badge">MEDIUM</span> <span class="badge">~117p</span> Mô hình hoá cây phân cấp Bee (Worker, Queen, Drone), mỗi con ong bắt đầu ở 100% sức khoẻ, có trạng thái sức khoẻ/chết chỉ đọc, và phương thức damage(percent) (⚠ đề viết Damage; tờ check sheet 1.4 bắt method bắt đầu bằng chữ thường, là động từ — lời giải chuẩn ghi // brief: Damage ngay dòng trên) giảm sức khoẻ theo phần trăm giá trị hiện tại — mỗi loại con chết ở ngưỡng riêng (70%, 20%, 50%). Menu console tạo một đàn 30 con ong (10 con mỗi loại) và thực hiện một đợt tấn công ngẫu nhiên lên tất cả, in lại sức khoẻ cập nhật và trạng thái sống/chết của từng con.</span></span>
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
<div class="callout warn"><span class="badge">Before you start</span> These briefs are older than your teacher's Coding check sheet. Build every one of them on the Guide's MVC (Lesson 1.1) and self-review with the sheet (Lesson 6.3). Where a brief asks for something the sheet forbids — a model that prints, <code>ExceptionCar</code>, <code>Damage()</code>, <code>employeeID</code> — the card says what the standard solution does instead.</div>

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
  <span class="lc-body"><span class="lc-title">13 · Asset Management- Upgrade</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~280p</span> The employee side of a two-program company asset-borrowing system (assets, employees, requests and borrows are stored in .dat files): after login, an employee can search assets by name, submit a borrow request, cancel a pending request, or return a borrowed asset, which updates the asset’s stock quantity. The brief calls for classes, abstract classes and interfaces with polymorphism. ⚠ Write assetId / employeeId where the brief writes assetID / employeeID (check sheet 1.5), and start interface names with I (1.3).</span></span>
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
  <span class="lc-body"><span class="lc-title">16 · Create a Java console program to manage a Fruit Shop (Product and Shopping)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~525p</span> A two-sided Fruit Shop console app: the shop owner creates Fruit records (ID, name, price, quantity, origin) stored in an ArrayList, while a buyer browses the fruit list, picks an item and quantity, confirms the order and enters their name; each customer’s order is kept in a Hashtable and can be reviewed on a view-orders screen listing quantity, price and amount per item. ⚠ Check sheet 1.5: name them fruitList and orderMap — a Hashtable is a Map.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0025-create-a-java-console-program-to-normalize-text?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">17 · Create a Java console program to normalize text</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~675p</span> Reads input.txt and rewrites it to output.txt applying a fixed set of text-cleanup rules: a single space between words, one space after commas/periods/colons with correct capitalization, no stray spaces around quoted phrases or before punctuation, a capitalized first word, no blank lines, and a trailing period — all wrapped in exception handling for file read/write errors.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0013-the-vehicle-management?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">18 · The Vehicle Management</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~750p</span> An OOP showroom app for two vehicle subtypes, Car and Motorbike (each with its own extra fields; Motorbike also overrides a makeSound method — ⚠ it returns "Tin tin tin" for the view to print, because a model never prints), loading and saving vehicles.txt and supporting add, update, delete, search by name (descending) or by ID, plus listing all vehicles either as stored or sorted descending by price.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0014-asset-management?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">19 · Asset Management</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~750p</span> The manager side of the same two-program asset system (asset.dat / employee.dat / request.dat / borrow.dat): after login, the manager can search assets by name, create or update an asset record, approve an employee’s borrow request — checking stock, moving the record from request.dat into borrow.dat and adjusting the quantity — and view the list of currently borrowed assets. ⚠ Write assetId / employeeId where the brief writes assetID / employeeID (check sheet 1.5).</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<div class="note-ct">Each exercise page above has a Video tutorial slot that is currently empty — it will be filled in later. No action is needed from you now; just work from the written brief, the reference solution, and the diagram already linked on each page.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Part 8 · Lesson 8.3</span>
<h2>Thực hành Khó — 19 bài</h2>
<p class="lead">Đây là 19 bài tập độ khó Khó (HARD) trong track thực hành Lab211 trên CodeLab — gồm các dự án OOP nhiều file, tiện ích xử lý file (File I/O) và các chương trình console mức độ ngang đề thi. Mỗi thẻ mở đề bài đầy đủ trên CodeLab, kèm lời giải tham khảo và sơ đồ lời giải.</p>
<div class="callout warn"><span class="badge">Trước khi làm</span> Các đề này ra đời trước tờ Coding check sheet của thầy. Bài nào cũng dựng theo MVC của Guide (Bài 1.1) và tự soát theo tờ check sheet (Bài 6.3). Chỗ nào đề đòi điều tờ giấy cấm — model tự in, <code>ExceptionCar</code>, <code>Damage()</code>, <code>employeeID</code> — thẻ bài ghi rõ lời giải chuẩn làm thế nào.</div>

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
  <span class="lc-body"><span class="lc-title">13 · Asset Management- Upgrade</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~280p</span> Phía nhân viên của hệ thống mượn tài sản công ty gồm hai chương trình (tài sản, nhân viên, yêu cầu mượn và phiếu mượn được lưu trong các file .dat): sau khi đăng nhập, nhân viên có thể tìm tài sản theo tên, gửi yêu cầu mượn, huỷ một yêu cầu đang chờ, hoặc trả một tài sản đã mượn (cập nhật lại số lượng tồn kho). Đề bài yêu cầu dùng class, abstract class và interface có tính đa hình (polymorphism). ⚠ Viết assetId / employeeId thay cho assetID / employeeID của đề (tờ check sheet 1.5), và tên interface bắt đầu bằng I (1.3).</span></span>
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
  <span class="lc-body"><span class="lc-title">16 · Create a Java console program to manage a Fruit Shop (Product and Shopping)</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~525p</span> Ứng dụng console Fruit Shop hai phía: chủ cửa hàng tạo các bản ghi Fruit (ID, tên, giá, số lượng, xuất xứ) lưu trong một ArrayList, còn người mua xem danh sách trái cây, chọn món và số lượng, xác nhận đơn rồi nhập tên; đơn hàng của mỗi khách được giữ trong một Hashtable và xem lại được ở màn hình xem đơn, liệt kê số lượng, giá và thành tiền từng món. ⚠ Tờ check sheet 1.5: đặt tên fruitList và orderMap — Hashtable cũng là một Map.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0025-create-a-java-console-program-to-normalize-text?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">17 · Create a Java console program to normalize text</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~675p</span> Đọc file input.txt và ghi lại thành output.txt theo một bộ quy tắc chuẩn hoá văn bản cố định: chỉ một khoảng trắng giữa các từ, một khoảng trắng sau dấu phẩy/dấu chấm/dấu hai chấm kèm viết hoa đúng chỗ, không có khoảng trắng thừa quanh cụm trong ngoặc kép hay trước dấu câu, viết hoa chữ đầu tiên, không có dòng trống, và có dấu chấm kết thúc văn bản — tất cả đều có xử lý ngoại lệ khi đọc/ghi file.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0013-the-vehicle-management?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">18 · The Vehicle Management</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~750p</span> Ứng dụng showroom theo hướng OOP cho hai loại phương tiện, Car và Motorbike (mỗi loại có thêm trường riêng; Motorbike còn có hàm makeSound riêng — ⚠ hàm này trả về "Tin tin tin" để view in, vì model không bao giờ in), đọc/ghi file vehicles.txt và hỗ trợ thêm, sửa, xoá, tìm theo tên (giảm dần) hoặc theo ID, cùng với hiển thị toàn bộ danh sách phương tiện theo thứ tự gốc hoặc sắp xếp giảm dần theo giá.</span></span>
  <span class="lc-cta">CODE LAB →</span>
</a>

<a class="link-card codelab" href="/code-lab/lab211/lab211-j1-l-p0014-asset-management?ref=%2Fcourses%2Foop-with-java-lab%2Flearn&reflabel=LAB211%20%E2%80%94%20OOP%20with%20Java%20Lab" target="_blank" rel="noopener">
  <span class="lc-ico">🧩</span>
  <span class="lc-body"><span class="lc-title">19 · Asset Management</span><span class="lc-sub"><span class="badge">HARD</span> <span class="badge">~750p</span> Phía quản lý của cùng hệ thống tài sản gồm hai chương trình (asset.dat / employee.dat / request.dat / borrow.dat): sau khi đăng nhập, quản lý có thể tìm tài sản theo tên, tạo hoặc cập nhật một bản ghi tài sản, duyệt yêu cầu mượn của nhân viên — kiểm tra tồn kho, chuyển bản ghi từ request.dat sang borrow.dat và cập nhật số lượng — và xem danh sách các tài sản đang được mượn. ⚠ Viết assetId / employeeId thay cho assetID / employeeID của đề (tờ check sheet 1.5).</span></span>
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
