/**
 * ENW492c — Academic Writing Skills (Kỹ năng viết học thuật). Kỳ 7.
 * Bám syllabus FPTU (sylID 12645, 5 CLO, 12 buổi). Tiên quyết: None. 3 tín chỉ.
 * Môn COURSERA: 5 MOOC "Academic English: Writing" (UC Irvine) → thi PE 100% (MCQ + short answer + Writing).
 * Pass: PE>=4 và FR>=5; FR=min(10, PE+Bonus); Bonus = hoàn thành MOOC đúng hạn.
 * Chuẩn CHUYÊN NGHIỆP như SWP391: thang điểm đầy đủ, checklist theo MOOC, anti-fail/high-mark guide,
 * ngân hàng câu hỏi thi/vấn đáp theo CLO, ngân hàng đề tài nghiên cứu + rubric chọn đề.
 * Song ngữ EN/VN đối xứng. Ví dụ có lời giải từng bước + ★ ngoài giáo trình. KHÔNG code → KHÔNG CodeLab.
 * Link Coursera MOOC trực tiếp + Exp Hub (công cụ viết: Grammarly, Zotero, Purdue OWL, Hemingway).
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/ENW492c.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola7', name: 'Kỳ 7', ordinal: 9 },
  course: {
    academyType: 'FPT',
    courseCode: 'ENW492c',
    title: 'Academic Writing Skills',
    slug: 'academic-writing-skills',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Master college-level academic writing: grammar & sentence craft, the essay (thesis, structure, argument), research & citation, and a full capstone research paper — built on the UC Irvine Coursera specialization.|||Làm chủ viết học thuật bậc đại học: ngữ pháp & câu, bài luận (luận điểm, cấu trúc, lập luận), nghiên cứu & trích dẫn, và một bài nghiên cứu capstone hoàn chỉnh — dựa trên chuỗi Coursera của UC Irvine.',
    description: 'ENW492c là môn KỸ NĂNG VIẾT HỌC THUẬT của Kỳ 7, học qua chuỗi 5 MOOC "Academic English: Writing" của Đại học California, Irvine trên Coursera. Bạn đi từ nền tảng (thì động từ, liên từ, câu ghép/phức, dấu câu, cấu trúc song song) → bài luận và quy trình viết (luận đề, dàn ý, luận so sánh/nguyên nhân-kết quả/lập luận) → viết nâng cao và liêm chính học thuật (lập luận nâng cao, tránh đạo văn, bài tổng hợp, bài có trích dẫn) → nghiên cứu cho bài viết (chọn đề tài, tìm nguồn, lập kế hoạch, ngôn ngữ nghiên cứu, trích dẫn & định dạng) → và một BÀI NGHIÊN CỨU CAPSTONE trọn vẹn (thư mục chú giải, bản nháp đầu, chỉnh sửa, bản cuối). Thi cuối kỳ (PE) 100% gồm trắc nghiệm + trả lời ngắn + phần Viết. Đây là kỹ năng nền tảng cho MỌI môn viết báo cáo, khoá luận, tài liệu kỹ thuật và email chuyên nghiệp sau này. Tiên quyết: Không.',
    whatYouLearn: 'Dùng đúng thì động từ và liên từ; viết câu ghép/phức chính xác, đúng dấu câu và cấu trúc song song; viết luận đề (thesis) mạnh và đúng phạm vi; lập dàn ý và cấu trúc một bài luận 5 đoạn; viết các loại luận (so sánh/đối chiếu, nguyên nhân/kết quả, lập luận, tổng hợp); lập luận nâng cao có phản biện (counterargument) và bác bỏ (rebuttal); TRÁNH ĐẠO VĂN và trích dẫn đúng APA/MLA; chọn đề tài nghiên cứu, tìm và đánh giá nguồn (CRAAP), viết thư mục chú giải; ngôn ngữ nghiên cứu (hedging, reporting verbs, paraphrase, synthesis); quy trình nháp → chỉnh sửa → bản cuối; và làm bài thi viết dưới áp lực thời gian.',
    requirements: 'Tiên quyết: Không. Cần: một tài khoản Coursera (đăng ký qua lời mời của admin lớp), Internet ổn định để xem video ≥5 giờ/tuần, một trình soạn thảo (Google Docs / Microsoft Word), và một công cụ quản lý trích dẫn (Zotero khuyến nghị). Nên có Grammarly (bản miễn phí) để tự kiểm ngữ pháp.',
    documentsNote: 'Chuỗi MOOC bắt buộc (Coursera — UC Irvine, "Academic English: Writing" Specialization): (1) Grammar & Punctuation, (2) Getting Started with Essay Writing, (3) Advanced Writing, (4) Introduction to Research for Essay Writing, (5) Academic Writing Capstone. Phải HOÀN THÀNH cả 5 MOOC (có chứng chỉ) mới được thi cuối kỳ tại campus. Công cụ hỗ trợ: Grammarly (kiểm lỗi), Hemingway Editor (độ rõ), Zotero (quản lý trích dẫn), Purdue OWL (chuẩn APA/MLA), Google Scholar (tìm nguồn). Tham khảo: "They Say / I Say" (Graff & Birkenstein), "The Elements of Style" (Strunk & White). Kèm file syllabus gốc ENW492c.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học gì, đi qua 5 MOOC nào, điều kiện qua môn & cấu trúc điểm, chuẩn đầu ra, công cụ, ngân hàng đề tài nghiên cứu, và bí quyết điểm cao.',
      lessons: [
        {
          title: '0.1 — About ENW492c & the academic-writing journey map|||0.1 — Giới thiệu ENW492c & bản đồ hành trình viết học thuật',
          slug: 'enw492c-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Môn viết học thuật là gì, học qua Coursera thế nào, và bản đồ 5 MOOC từ ngữ pháp tới bài nghiên cứu capstone.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About ENW492c — Academic Writing Skills</h2>
<p class="lead">ENW492c teaches you to write the way universities and professionals expect: <strong>clear, structured, evidence-based, and free of plagiarism</strong>. It is delivered through five official Coursera MOOCs from the University of California, Irvine — you watch, practice, and get certified online, then sit a written final exam on campus.</p>
<p>This is not "English grammar drills". It is the craft of turning a question into a <strong>thesis</strong>, defending that thesis with <strong>evidence and reasoning</strong>, citing sources honestly, and revising until the prose is sharp. These skills carry into every later course — your SWP391 report, your graduation thesis, technical documentation, and even a well-argued email to a manager.</p>
<h3>Your journey — five MOOCs, one growing skill</h3>
<p>Each MOOC builds on the previous one. The output of one becomes the raw material of the next, ending in a full research paper:</p>
<div class="lz-map">
  <div class="lz-stage">Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Grammar &amp; Punctuation</div><div class="lz-nsub">Verb tenses · conjunctions · compound/complex sentences · commas · parallel structure</div></div></div>
  <div class="lz-stage">The essay</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Getting Started with Essay Writing</div><div class="lz-nsub">Thesis · 5-paragraph essay · compare/contrast · cause/effect · argument</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Advanced Writing</div><div class="lz-nsub">Advanced argument · avoiding plagiarism · synthesis essay · documented essay</div></div></div>
  <div class="lz-stage">Research</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Introduction to Research for Essay Writing</div><div class="lz-nsub">Topics · finding sources · planning · research language · citing &amp; formatting</div></div></div>
  <div class="lz-stage">Capstone</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Academic Writing Capstone</div><div class="lz-nsub">Annotated bibliography · first draft · rough draft · revise &amp; rewrite · final paper</div></div></div>
  <div class="lz-stage">On campus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Final written exam (PE, 100%)</div><div class="lz-nsub">MCQ + short answers + a timed writing task</div></div></div>
</div>
<a class="link-card codelab" href="https://www.coursera.org/specializations/academic-english" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Academic English: Writing (Coursera · UC Irvine)</span><span class="lc-sub">The official 5-MOOC specialization for this course — start here.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
<div class="callout ok">The one habit that makes everything else easier: <strong>write badly first, then revise</strong>. Professional writing is not typed perfectly — it is drafted, then cut and reshaped. Every MOOC teaches a piece of the "draft → revise" loop.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu ENW492c — Kỹ năng viết học thuật</h2>
<p class="lead">ENW492c dạy bạn viết đúng chuẩn mà đại học và môi trường chuyên nghiệp mong đợi: <strong>rõ ràng, có cấu trúc, dựa trên bằng chứng, và không đạo văn</strong>. Môn học qua năm MOOC chính thức của Đại học California, Irvine trên Coursera — bạn xem video, luyện tập, lấy chứng chỉ online, rồi thi viết cuối kỳ tại campus.</p>
<p>Đây không phải "luyện ngữ pháp tiếng Anh". Đây là NGHỀ biến một câu hỏi thành <strong>luận đề (thesis)</strong>, bảo vệ luận đề đó bằng <strong>bằng chứng và lập luận</strong>, trích dẫn nguồn trung thực, và chỉnh sửa đến khi câu chữ sắc bén. Kỹ năng này theo bạn suốt mọi môn sau — báo cáo SWP391, khoá luận tốt nghiệp, tài liệu kỹ thuật, và cả một email thuyết phục gửi sếp.</p>
<h3>Hành trình của bạn — năm MOOC, một kỹ năng lớn dần</h3>
<p>Mỗi MOOC xây trên MOOC trước. Đầu ra của cái này là nguyên liệu cho cái kế tiếp, kết thúc bằng một bài nghiên cứu hoàn chỉnh:</p>
<div class="lz-map">
  <div class="lz-stage">Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Ngữ pháp &amp; Dấu câu</div><div class="lz-nsub">Thì động từ · liên từ · câu ghép/phức · dấu phẩy · cấu trúc song song</div></div></div>
  <div class="lz-stage">Bài luận</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Bắt đầu viết luận</div><div class="lz-nsub">Luận đề · luận 5 đoạn · so sánh/đối chiếu · nguyên nhân/kết quả · lập luận</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Viết nâng cao</div><div class="lz-nsub">Lập luận nâng cao · tránh đạo văn · bài tổng hợp · bài có trích dẫn</div></div></div>
  <div class="lz-stage">Nghiên cứu</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Nhập môn nghiên cứu cho bài luận</div><div class="lz-nsub">Đề tài · tìm nguồn · lập kế hoạch · ngôn ngữ nghiên cứu · trích dẫn &amp; định dạng</div></div></div>
  <div class="lz-stage">Capstone</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Bài viết học thuật Capstone</div><div class="lz-nsub">Thư mục chú giải · nháp đầu · nháp thô · chỉnh sửa &amp; viết lại · bài cuối</div></div></div>
  <div class="lz-stage">Tại campus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Thi viết cuối kỳ (PE, 100%)</div><div class="lz-nsub">Trắc nghiệm + trả lời ngắn + một bài viết tính giờ</div></div></div>
</div>
<a class="link-card codelab" href="https://www.coursera.org/specializations/academic-english" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Academic English: Writing (Coursera · UC Irvine)</span><span class="lc-sub">Chuỗi 5 MOOC chính thức của môn — bắt đầu từ đây.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
<div class="callout ok">Một thói quen làm mọi thứ dễ hơn: <strong>cứ viết dở trước, rồi chỉnh sau</strong>. Văn bản chuyên nghiệp không được gõ ra hoàn hảo — nó được nháp, rồi cắt và nắn lại. Mỗi MOOC dạy một mảnh của vòng lặp "nháp → chỉnh".</div>
</div>`,
        },
        {
          title: '0.2 — Passing requirements, MOOC milestones & grading|||0.2 — Điều kiện qua môn, mốc MOOC & cấu trúc điểm',
          slug: 'enw492c-dieu-kien-qua-mon',
          type: 'VIDEO',
          description: 'Tín chỉ, thời lượng, điều kiện được thi, cách tính điểm PE + Bonus, và mốc hoàn thành từng MOOC.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">ENW492c has an unusual grading model: <strong>a single final written exam worth 100%</strong>, plus a bonus for finishing the MOOCs on time. Understand the two rules that decide pass/fail before anything else.</p>
<div class="kv-grid">
  <div class="kv"><b>Credits</b><span>3</span></div>
  <div class="kv"><b>Prerequisite</b><span>None</span></div>
  <div class="kv"><b>Time</b><span>84h online + 3h offline + 1h exam + 62h self-study</span></div>
  <div class="kv"><b>Pass mark</b><span>PE ≥ 4 AND FR ≥ 5</span></div>
</div>
<h3>How the grade is built</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Format</th><th>Rule</th></tr></thead>
  <tbody>
    <tr><td>Final Exam (PE)</td><td>100%</td><td>MCQ + short answers + a writing task, ~100 min, on campus</td><td>PE ≥ 4 to be eligible to pass</td></tr>
    <tr><td>Bonus</td><td>added on top</td><td>Awarded for completing all 5 MOOCs (with certificates) before the deadline</td><td>Final Result FR = min(10, PE + Bonus)</td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">FINAL RESULT</span> FR = min(10, PE + Bonus) &nbsp;·&nbsp; you PASS only if <b>PE ≥ 4</b> AND <b>FR ≥ 5</b></div>
<h3>The gate you cannot skip</h3>
<div class="callout warn"><strong>You must complete ALL five MOOCs with certification to be allowed to sit the final exam.</strong> The MOOC completion is not just for bonus — it is your ticket to the exam room. Miss one MOOC and you cannot take PE at all.</div>
<h3>Worked example — do these students pass?</h3>
<div class="out"><b>Student A:</b> finishes all 5 MOOCs on time (Bonus = 1.0), scores PE = 6.
→ FR = min(10, 6 + 1.0) = 7.0. PE ≥ 4 ✓ and FR ≥ 5 ✓ → <b>PASS (7.0)</b>.<br><br>
<b>Student B:</b> finishes all 5 MOOCs but late (Bonus = 0), scores PE = 4.5.
→ FR = min(10, 4.5) = 4.5. PE ≥ 4 ✓ but FR = 4.5 &lt; 5 ✗ → <b>FAIL</b>. The bonus would have saved them.<br><br>
<b>Student C:</b> skips MOOC 5. → not eligible for the exam → <b>FAIL by default</b>, regardless of writing ability.</div>
<div class="pitfall"><strong>Most common failure:</strong> treating the MOOCs as optional "background reading" and cramming grammar the night before. The MOOCs ARE the gate and the source of the bonus that turns a 4.5 into a pass. Do them steadily, ≥5h/week.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">ENW492c có mô hình chấm điểm khác thường: <strong>một bài thi viết cuối kỳ chiếm 100%</strong>, cộng thêm điểm thưởng nếu hoàn thành MOOC đúng hạn. Hãy hiểu hai quy tắc quyết định đậu/rớt trước mọi thứ khác.</p>
<div class="kv-grid">
  <div class="kv"><b>Tín chỉ</b><span>3</span></div>
  <div class="kv"><b>Tiên quyết</b><span>Không</span></div>
  <div class="kv"><b>Thời lượng</b><span>84h online + 3h offline + 1h thi + 62h tự học</span></div>
  <div class="kv"><b>Ngưỡng đậu</b><span>PE ≥ 4 VÀ FR ≥ 5</span></div>
</div>
<h3>Điểm được cấu thành thế nào</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Hình thức</th><th>Quy tắc</th></tr></thead>
  <tbody>
    <tr><td>Thi cuối kỳ (PE)</td><td>100%</td><td>Trắc nghiệm + trả lời ngắn + bài viết, ~100 phút, tại campus</td><td>PE ≥ 4 mới đủ điều kiện đậu</td></tr>
    <tr><td>Điểm thưởng (Bonus)</td><td>cộng thêm</td><td>Thưởng khi hoàn thành cả 5 MOOC (có chứng chỉ) trước hạn</td><td>Kết quả cuối FR = min(10, PE + Bonus)</td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">KẾT QUẢ CUỐI</span> FR = min(10, PE + Bonus) &nbsp;·&nbsp; ĐẬU chỉ khi <b>PE ≥ 4</b> VÀ <b>FR ≥ 5</b></div>
<h3>Cánh cổng không thể bỏ qua</h3>
<div class="callout warn"><strong>Bạn PHẢI hoàn thành CẢ năm MOOC có chứng chỉ mới được vào phòng thi cuối kỳ.</strong> Hoàn thành MOOC không chỉ để lấy điểm thưởng — nó là tấm vé vào phòng thi. Thiếu một MOOC là không được thi PE.</div>
<h3>Ví dụ có lời giải — những bạn này có đậu không?</h3>
<div class="out"><b>Bạn A:</b> hoàn thành cả 5 MOOC đúng hạn (Bonus = 1.0), thi PE = 6.
→ FR = min(10, 6 + 1.0) = 7.0. PE ≥ 4 ✓ và FR ≥ 5 ✓ → <b>ĐẬU (7.0)</b>.<br><br>
<b>Bạn B:</b> hoàn thành 5 MOOC nhưng trễ (Bonus = 0), thi PE = 4.5.
→ FR = min(10, 4.5) = 4.5. PE ≥ 4 ✓ nhưng FR = 4.5 &lt; 5 ✗ → <b>RỚT</b>. Điểm thưởng đã có thể cứu bạn.<br><br>
<b>Bạn C:</b> bỏ MOOC 5. → không đủ điều kiện thi → <b>RỚT mặc định</b>, dù viết giỏi đến đâu.</div>
<div class="pitfall"><strong>Kiểu rớt phổ biến nhất:</strong> coi MOOC là "đọc thêm" tuỳ chọn rồi nhồi ngữ pháp đêm trước. MOOC CHÍNH LÀ cánh cổng và là nguồn điểm thưởng biến 4.5 thành đậu. Hãy học đều, ≥5h/tuần.</div>
</div>`,
        },
        {
          title: '0.3 — Learning outcomes (CLOs) & how they map to the MOOCs|||0.3 — Chuẩn đầu ra (CLO) & ánh xạ vào các MOOC',
          slug: 'enw492c-chuan-dau-ra',
          type: 'VIDEO',
          description: '5 chuẩn đầu ra và cách chúng gắn vào từng MOOC và câu hỏi thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>Course learning outcomes (CLOs)</h2>
<p class="lead">Every exam question traces back to one of five CLOs. Knowing the map tells you exactly what to practise.</p>
<table>
  <thead><tr><th>CLO</th><th>You will be able to…</th><th>MOOC</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Use correct verb tenses, conjunctions, and compound/complex sentence structure with proper punctuation</td><td>MOOC 1 · Ch1</td></tr>
    <tr><td>CLO2</td><td>Create effective thesis statements and write structured essays (compare/contrast, cause/effect, argument)</td><td>MOOC 2 · Ch2</td></tr>
    <tr><td>CLO3</td><td>Plan and write a more sophisticated argument, avoid plagiarism, and write synthesis/documented essays</td><td>MOOC 3 · Ch3</td></tr>
    <tr><td>CLO4</td><td>Choose research topics, find and evaluate sources, and cite/format correctly</td><td>MOOC 4 · Ch4</td></tr>
    <tr><td>CLO5</td><td>Conduct research on a chosen topic and produce a complete, revised research paper</td><td>MOOC 5 · Ch5</td></tr>
  </tbody>
</table>
<div class="callout">Read a CLO as a promise you make to an examiner: "Give me a prompt, and I can produce a thesis, structure, evidence, and correct citations under time pressure." The rest of this course turns each promise into a repeatable procedure.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Mọi câu hỏi thi đều truy về một trong năm CLO. Biết bản đồ này là biết chính xác phải luyện gì.</p>
<table>
  <thead><tr><th>CLO</th><th>Bạn sẽ có thể…</th><th>MOOC</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Dùng đúng thì động từ, liên từ, cấu trúc câu ghép/phức với dấu câu chuẩn</td><td>MOOC 1 · Ch1</td></tr>
    <tr><td>CLO2</td><td>Viết luận đề hiệu quả và viết luận có cấu trúc (so sánh/đối chiếu, nguyên nhân/kết quả, lập luận)</td><td>MOOC 2 · Ch2</td></tr>
    <tr><td>CLO3</td><td>Lập kế hoạch và viết lập luận tinh vi hơn, tránh đạo văn, viết bài tổng hợp/có trích dẫn</td><td>MOOC 3 · Ch3</td></tr>
    <tr><td>CLO4</td><td>Chọn đề tài nghiên cứu, tìm và đánh giá nguồn, trích dẫn/định dạng đúng</td><td>MOOC 4 · Ch4</td></tr>
    <tr><td>CLO5</td><td>Tiến hành nghiên cứu về một đề tài đã chọn và tạo ra một bài nghiên cứu hoàn chỉnh, đã chỉnh sửa</td><td>MOOC 5 · Ch5</td></tr>
  </tbody>
</table>
<div class="callout">Hãy đọc mỗi CLO như một lời hứa với giám khảo: "Cho tôi một đề, tôi có thể tạo ra luận đề, cấu trúc, bằng chứng và trích dẫn đúng dưới áp lực thời gian." Phần còn lại của môn biến mỗi lời hứa thành một quy trình lặp lại được.</div>
</div>`,
        },
        {
          title: '0.4 — Tools & setup for writing|||0.4 — Công cụ & cài đặt cho việc viết',
          slug: 'enw492c-cong-cu',
          type: 'VIDEO',
          description: 'Coursera, trình soạn thảo, Grammarly, Zotero, Purdue OWL, Google Scholar — và cách cài.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Your writing toolkit</h2>
<p class="lead">You do not need much software to write well — but the right five tools remove friction and catch mistakes before an examiner does.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Coursera</b> — the five MOOCs live here; log the certificates. Your gate to the exam.</div>
  <div class="lz-layer"><b>Google Docs / Word</b> — draft, comment, track versions. Turn on grammar check.</div>
  <div class="lz-layer"><b>Grammarly (free)</b> — catches tense, agreement, comma and clarity errors as you type.</div>
  <div class="lz-layer"><b>Zotero</b> — save a source once, generate a perfect APA/MLA citation forever.</div>
  <div class="lz-layer"><b>Purdue OWL + Google Scholar</b> — the citation rulebook, and where you find credible sources.</div>
</div>
<a class="link-card exphub" href="/exp-hub/enw492c-cong-cu-viet?ref=%2Fcourses%2Facademic-writing-skills%2Flearn&reflabel=ENW492c" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up your writing tools — step by step</span><span class="lc-sub">Install Grammarly, Zotero and the browser connector, with download links, on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout ok">Rule of thumb: <strong>tools catch surface errors, not weak ideas</strong>. Grammarly fixes a comma; it cannot fix a thesis that says nothing. Use tools to free your attention for structure and argument.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Bộ công cụ viết của bạn</h2>
<p class="lead">Bạn không cần nhiều phần mềm để viết tốt — nhưng năm công cụ đúng sẽ giảm ma sát và bắt lỗi trước khi giám khảo bắt.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Coursera</b> — năm MOOC nằm ở đây; lưu lại chứng chỉ. Cánh cổng vào phòng thi.</div>
  <div class="lz-layer"><b>Google Docs / Word</b> — nháp, ghi chú, theo dõi phiên bản. Bật kiểm tra ngữ pháp.</div>
  <div class="lz-layer"><b>Grammarly (miễn phí)</b> — bắt lỗi thì, hoà hợp, dấu phẩy và độ rõ ngay khi gõ.</div>
  <div class="lz-layer"><b>Zotero</b> — lưu nguồn một lần, sinh trích dẫn APA/MLA chuẩn mãi mãi.</div>
  <div class="lz-layer"><b>Purdue OWL + Google Scholar</b> — sách luật trích dẫn, và nơi tìm nguồn đáng tin.</div>
</div>
<a class="link-card exphub" href="/exp-hub/enw492c-cong-cu-viet?ref=%2Fcourses%2Facademic-writing-skills%2Flearn&reflabel=ENW492c" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài đặt công cụ viết — từng bước</span><span class="lc-sub">Cài Grammarly, Zotero và trình kết nối trình duyệt, kèm link tải, trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout ok">Nguyên tắc: <strong>công cụ bắt lỗi bề mặt, không sửa được ý tưởng yếu</strong>. Grammarly sửa dấu phẩy; nó không sửa được một luận đề chẳng nói lên điều gì. Dùng công cụ để giải phóng sự chú ý cho cấu trúc và lập luận.</div>
</div>`,
        },
        {
          title: '0.5 — Research-paper topic bank & how to choose (mentor guide)|||0.5 — Ngân hàng đề tài nghiên cứu & cách chọn (mentor)',
          slug: 'enw492c-ngan-hang-de-tai',
          type: 'VIDEO',
          description: '12 đề tài nghiên cứu đã kiểm phạm vi cho bài capstone + rubric 6 phép thử chọn đề tốt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.5</span>
<h2>Choosing your capstone research topic</h2>
<p class="lead">The Capstone (MOOC 5) asks for a full research paper on a topic <strong>you choose</strong>. The topic decides whether the paper is easy or painful. A good academic topic is <em>narrow, arguable, and researchable</em> — not a broad description.</p>
<h3>The 6-test rubric — score a topic before you commit</h3>
<table>
  <thead><tr><th>#</th><th>Test</th><th>Ask yourself</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Arguable</td><td>Can a reasonable person disagree? (If everyone agrees, it is a report, not an argument.)</td></tr>
    <tr><td>2</td><td>Narrow</td><td>Can I cover it in 1,000–1,500 words? "Social media" is too big; "Instagram and teen sleep" fits.</td></tr>
    <tr><td>3</td><td>Researchable</td><td>Are there ≥5 credible sources on Google Scholar in English?</td></tr>
    <tr><td>4</td><td>Evidence-based</td><td>Can claims be backed by data/studies, not just opinion?</td></tr>
    <tr><td>5</td><td>Interesting to you</td><td>Will you still care in week 6 of drafting?</td></tr>
    <tr><td>6</td><td>Not overdone</td><td>Avoid clichés (e.g., "smoking is bad") where every source says the same thing.</td></tr>
  </tbody>
</table>
<h3>Topic bank — 12 scope-checked prompts</h3>
<p>Each is phrased as an <em>arguable question</em>, already narrowed to essay size. Pick one, or use them as templates:</p>
<ol>
  <li>Should universities cap the daily hours students spend on short-form video?</li>
  <li>Does remote work increase or decrease software-team productivity?</li>
  <li>Should AI writing assistants be allowed in university essays, and under what limits?</li>
  <li>Is a four-day school/work week better for student mental health than a five-day one?</li>
  <li>Do coding bootcamps prepare graduates better than a CS degree for entry-level jobs?</li>
  <li>Should social-media platforms be legally required to label AI-generated images?</li>
  <li>Does gamification actually improve long-term learning, or only short-term engagement?</li>
  <li>Should public Wi-Fi providers be required to warn users about security risks?</li>
  <li>Is electric-scooter sharing a net benefit or harm for a mid-size city?</li>
  <li>Should students be graded on group projects individually or collectively?</li>
  <li>Does reading fiction improve empathy more than reading non-fiction?</li>
  <li>Should companies be allowed to monitor employees' work computers, and to what extent?</li>
</ol>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Turn a topic into a working thesis with the "so what?" test.</b> After you write a draft thesis, ask "so what — why should the reader care?". "Instagram affects sleep" → so what? → "Instagram's late-night notifications measurably reduce teenage sleep, so schools should teach notification hygiene." Now it is arguable AND consequential. <em>This forces significance, which examiners reward but the syllabus does not name.</em></div>
<div class="pitfall">A topic that is a <strong>question of fact</strong> ("What year was Python released?") cannot be a research paper — there is nothing to argue. Convert every fact-topic into a <strong>question of value or policy</strong> ("Should X…?", "Is X better than Y…?").</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.5</span>
<h2>Chọn đề tài nghiên cứu capstone</h2>
<p class="lead">Bài Capstone (MOOC 5) yêu cầu một bài nghiên cứu hoàn chỉnh về một đề tài <strong>bạn tự chọn</strong>. Đề tài quyết định bài viết dễ hay khổ. Một đề tài học thuật tốt phải <em>hẹp, tranh luận được, và nghiên cứu được</em> — không phải mô tả chung chung.</p>
<h3>Rubric 6 phép thử — chấm đề trước khi cam kết</h3>
<table>
  <thead><tr><th>#</th><th>Phép thử</th><th>Tự hỏi</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Tranh luận được</td><td>Người hợp lý có thể bất đồng không? (Nếu ai cũng đồng ý, đó là báo cáo, không phải lập luận.)</td></tr>
    <tr><td>2</td><td>Hẹp</td><td>Tôi có phủ hết trong 1.000–1.500 từ không? "Mạng xã hội" quá to; "Instagram và giấc ngủ tuổi teen" vừa.</td></tr>
    <tr><td>3</td><td>Nghiên cứu được</td><td>Có ≥5 nguồn đáng tin tiếng Anh trên Google Scholar không?</td></tr>
    <tr><td>4</td><td>Dựa bằng chứng</td><td>Luận điểm có thể chống lưng bằng dữ liệu/nghiên cứu, không chỉ ý kiến?</td></tr>
    <tr><td>5</td><td>Bạn thấy thú vị</td><td>Đến tuần 6 nháp bài bạn còn quan tâm không?</td></tr>
    <tr><td>6</td><td>Không nhàm</td><td>Tránh sáo mòn (vd "hút thuốc có hại") nơi mọi nguồn nói y hệt nhau.</td></tr>
  </tbody>
</table>
<h3>Ngân hàng đề tài — 12 gợi ý đã kiểm phạm vi</h3>
<p>Mỗi đề được nêu dưới dạng <em>câu hỏi tranh luận được</em>, đã thu hẹp cỡ bài luận. Chọn một, hoặc dùng làm khuôn:</p>
<ol>
  <li>Trường đại học có nên giới hạn số giờ mỗi ngày sinh viên xem video ngắn?</li>
  <li>Làm việc từ xa làm tăng hay giảm năng suất của nhóm phần mềm?</li>
  <li>Có nên cho phép trợ lý viết AI trong bài luận đại học, và với giới hạn nào?</li>
  <li>Tuần học/làm bốn ngày có tốt cho sức khoẻ tinh thần sinh viên hơn năm ngày không?</li>
  <li>Bootcamp lập trình chuẩn bị cho việc entry-level tốt hơn bằng CS không?</li>
  <li>Nền tảng mạng xã hội có nên bị bắt buộc gắn nhãn ảnh do AI tạo?</li>
  <li>Gamification có thật sự cải thiện học lâu dài, hay chỉ tương tác ngắn hạn?</li>
  <li>Nhà cung cấp Wi-Fi công cộng có nên bắt buộc cảnh báo rủi ro bảo mật?</li>
  <li>Chia sẻ xe scooter điện là lợi hay hại ròng cho một thành phố cỡ vừa?</li>
  <li>Nên chấm đồ án nhóm theo cá nhân hay theo tập thể?</li>
  <li>Đọc tiểu thuyết có cải thiện sự đồng cảm hơn đọc phi hư cấu không?</li>
  <li>Công ty có nên được phép giám sát máy tính công việc của nhân viên, đến mức nào?</li>
</ol>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Biến đề tài thành luận đề bằng phép thử "rồi sao?".</b> Sau khi viết luận đề nháp, hãy hỏi "rồi sao — vì sao người đọc phải quan tâm?". "Instagram ảnh hưởng giấc ngủ" → rồi sao? → "Thông báo đêm khuya của Instagram làm giảm giấc ngủ tuổi teen một cách đo được, nên trường học cần dạy vệ sinh thông báo." Giờ nó vừa tranh luận được VỪA có hệ quả. <em>Điều này ép ra ý nghĩa (significance) — thứ giám khảo thưởng nhưng giáo trình không gọi tên.</em></div>
<div class="pitfall">Một đề tài là <strong>câu hỏi sự thật</strong> ("Python ra năm nào?") không thể thành bài nghiên cứu — chẳng có gì để tranh luận. Hãy chuyển mọi đề-sự-thật thành <strong>câu hỏi giá trị hoặc chính sách</strong> ("Có nên X…?", "X tốt hơn Y không?").</div>
</div>`,
        },
        {
          title: '0.6 — Why students lose marks & the formula for a high grade|||0.6 — Vì sao mất điểm & công thức điểm cao',
          slug: 'enw492c-chong-mat-diem',
          type: 'VIDEO',
          description: '7 kiểu mất điểm trong bài viết học thuật + cờ xanh/đỏ + công thức điểm cao — kiểu SWP391.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.6</span>
<h2>Why writers lose marks — and how to score high</h2>
<p class="lead">Examiners deduct for the same handful of problems every year. Know them, and half the battle is won before you write a word.</p>
<h3>The 7 ways to lose marks</h3>
<table>
  <thead><tr><th>#</th><th>Loss</th><th>Fix</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>No clear thesis (or a thesis that just states a topic)</td><td>Put one arguable sentence at the end of the intro. It must be defensible.</td></tr>
    <tr><td>2</td><td>Paragraphs with no topic sentence / no focus</td><td>One idea per paragraph, announced in sentence 1, then evidence, then link.</td></tr>
    <tr><td>3</td><td>Evidence dumped without analysis</td><td>After every quote/statistic, explain "this shows… because…".</td></tr>
    <tr><td>4</td><td>Plagiarism or missing citations</td><td>Cite every borrowed idea; paraphrase in your own words + reference.</td></tr>
    <tr><td>5</td><td>Grammar/tense/comma errors that blur meaning</td><td>Run Grammarly, then read aloud once. Fix run-ons and fragments.</td></tr>
    <tr><td>6</td><td>No structure / no transitions</td><td>Intro → body (ordered) → conclusion; use "However, Therefore, In contrast".</td></tr>
    <tr><td>7</td><td>Ignoring the prompt / off-topic drift</td><td>Underline the task verb (compare, argue, evaluate) and answer THAT.</td></tr>
  </tbody>
</table>
<h3>Green flags vs red flags an examiner sees in 30 seconds</h3>
<div class="kv-grid">
  <div class="kv"><b>🟢 Green</b><span>Arguable thesis · one idea/paragraph · evidence + analysis · citations · clean grammar</span></div>
  <div class="kv"><b>🔴 Red</b><span>Vague thesis · wall-of-text paragraphs · quote-dumping · no sources · run-on sentences</span></div>
</div>
<div class="formula"><span class="lbl">HIGH-GRADE FORMULA</span> Arguable thesis + one-idea paragraphs + (evidence → analysis) in every body paragraph + honest citations + a revision pass for grammar &amp; flow</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The reverse-outline trick for revision.</b> After drafting, write one sentence summarising each paragraph in the margin. Read only those sentences top to bottom: if they do not form a logical argument, your <em>structure</em> is broken, not your wording. This catches organisation problems the syllabus never teaches you to hunt for.</div>
<div class="pitfall">"I wrote a lot" is not a grade. Length without a thesis and analysis scores <em>lower</em> than a short, focused, well-cited essay. Cut every sentence that does not serve the thesis.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.6</span>
<h2>Vì sao người viết mất điểm — và cách điểm cao</h2>
<p class="lead">Giám khảo trừ điểm vì đúng vài lỗi giống nhau mỗi năm. Biết chúng là thắng nửa trận trước khi viết chữ nào.</p>
<h3>7 kiểu mất điểm</h3>
<table>
  <thead><tr><th>#</th><th>Mất điểm</th><th>Cách sửa</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Không có luận đề rõ (hoặc luận đề chỉ nêu chủ đề)</td><td>Đặt một câu tranh luận được ở cuối mở bài. Phải bảo vệ được.</td></tr>
    <tr><td>2</td><td>Đoạn không có câu chủ đề / không tập trung</td><td>Một ý mỗi đoạn, nêu ở câu 1, rồi bằng chứng, rồi liên kết.</td></tr>
    <tr><td>3</td><td>Đổ bằng chứng mà không phân tích</td><td>Sau mỗi trích/số liệu, giải thích "điều này cho thấy… vì…".</td></tr>
    <tr><td>4</td><td>Đạo văn hoặc thiếu trích dẫn</td><td>Trích dẫn mọi ý vay mượn; diễn giải bằng lời của bạn + nguồn.</td></tr>
    <tr><td>5</td><td>Lỗi ngữ pháp/thì/dấu phẩy làm mờ nghĩa</td><td>Chạy Grammarly, rồi đọc to một lần. Sửa câu dính và câu cụt.</td></tr>
    <tr><td>6</td><td>Không cấu trúc / không chuyển ý</td><td>Mở → thân (có thứ tự) → kết; dùng "However, Therefore, In contrast".</td></tr>
    <tr><td>7</td><td>Bỏ qua đề bài / lạc đề</td><td>Gạch chân động từ đề (compare, argue, evaluate) và trả lời ĐÚNG cái đó.</td></tr>
  </tbody>
</table>
<h3>Cờ xanh vs cờ đỏ giám khảo thấy trong 30 giây</h3>
<div class="kv-grid">
  <div class="kv"><b>🟢 Xanh</b><span>Luận đề tranh luận được · một ý/đoạn · bằng chứng + phân tích · trích dẫn · ngữ pháp sạch</span></div>
  <div class="kv"><b>🔴 Đỏ</b><span>Luận đề mơ hồ · đoạn dày đặc chữ · đổ trích dẫn · không nguồn · câu dính dài</span></div>
</div>
<div class="formula"><span class="lbl">CÔNG THỨC ĐIỂM CAO</span> Luận đề tranh luận được + đoạn một-ý + (bằng chứng → phân tích) ở mỗi đoạn thân + trích dẫn trung thực + một lượt chỉnh ngữ pháp &amp; mạch</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Mẹo "dàn ý ngược" để chỉnh sửa.</b> Sau khi nháp, viết một câu tóm mỗi đoạn ra lề. Đọc CHỈ những câu đó từ trên xuống: nếu chúng không tạo thành lập luận logic thì <em>cấu trúc</em> hỏng, không phải câu chữ. Cách này bắt lỗi tổ chức mà giáo trình không dạy bạn săn.</div>
<div class="pitfall">"Tôi viết nhiều" không phải là điểm. Dài mà không luận đề và phân tích thì điểm <em>thấp hơn</em> một bài ngắn, tập trung, trích dẫn tốt. Cắt mọi câu không phục vụ luận đề.</div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — MOOC 1: GRAMMAR & PUNCTUATION ══════════════════ */
    {
      title: 'Chapter 1 — MOOC 1: Grammar & sentence foundations|||Chương 1 — MOOC 1: Nền tảng ngữ pháp & câu',
      description: 'Thì động từ, liên từ, câu ghép/phức, dấu phẩy và cấu trúc song song — nền của mọi câu học thuật.',
      lessons: [
        {
          title: '1.1 — Verb tenses & conjunctions|||1.1 — Thì động từ & liên từ',
          slug: 'enw492c-1-1-tenses-conjunctions',
          type: 'VIDEO',
          description: 'Chọn đúng thì cho văn học thuật và nối ý bằng liên từ đúng loại.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Verb tenses &amp; conjunctions</h2>
<p class="lead">Academic writing uses a small, predictable set of tenses. Master these and your prose instantly reads as controlled and credible.</p>
<h3>The academic tense toolkit</h3>
<table>
  <thead><tr><th>Tense</th><th>Use in academic writing</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Present simple</td><td>General truths, facts, your thesis</td><td>"Social media <em>shapes</em> attention."</td></tr>
    <tr><td>Present perfect</td><td>Research up to now, trends</td><td>"Studies <em>have shown</em> a decline in sleep."</td></tr>
    <tr><td>Past simple</td><td>A specific completed study/event</td><td>"Smith (2020) <em>surveyed</em> 400 students."</td></tr>
    <tr><td>Future / modal</td><td>Predictions, recommendations</td><td>"Schools <em>should teach</em> notification hygiene."</td></tr>
  </tbody>
</table>
<h3>Conjunctions — three families</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Coordinating (FANBOYS)</b><span>for, and, nor, but, or, yet, so — join two equal clauses with a comma before them</span></div>
  <div class="lz-step"><b>Subordinating</b><span>because, although, while, since, if — start a dependent clause</span></div>
  <div class="lz-step"><b>Conjunctive adverbs</b><span>however, therefore, moreover — link ideas; take ; before and , after</span></div>
</div>
<h3>Worked example — fixing tense &amp; joining ideas</h3>
<div class="out"><b>Weak:</b> "Many students uses their phone at night and this affected their sleep."<br>
<b>Problems:</b> subject–verb agreement (students <b>use</b>), and inconsistent tense (present then past).<br>
<b>Strong:</b> "Many students <b>use</b> their phones at night, <b>and</b> this habit <b>reduces</b> their sleep." <br>
<em>One consistent present tense; FANBOYS "and" with a comma joins two equal ideas.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "reporting verb" tense rule.</b> When you cite a source, the reporting verb often stays present ("Smith <em>argues</em>…") even about past research, because the argument still stands today. Native academics switch to past ("Smith <em>argued</em>…") to signal an outdated or superseded view. Choosing the tense is a subtle way to <em>evaluate</em> a source — a skill examiners reward.</div>
<div class="pitfall">A <strong>comma splice</strong> — joining two full sentences with only a comma ("Phones distract, students fail") — is one of the most-penalised errors. Fix with a period, a semicolon, or a FANBOYS conjunction: "Phones distract<b>;</b> students fail."</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Thì động từ &amp; liên từ</h2>
<p class="lead">Viết học thuật dùng một tập thì nhỏ, dễ đoán. Làm chủ chúng thì văn của bạn lập tức đọc lên có kiểm soát và đáng tin.</p>
<h3>Bộ thì học thuật</h3>
<table>
  <thead><tr><th>Thì</th><th>Dùng trong viết học thuật</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Hiện tại đơn</td><td>Chân lý chung, sự thật, luận đề của bạn</td><td>"Social media <em>shapes</em> attention."</td></tr>
    <tr><td>Hiện tại hoàn thành</td><td>Nghiên cứu tới nay, xu hướng</td><td>"Studies <em>have shown</em> a decline in sleep."</td></tr>
    <tr><td>Quá khứ đơn</td><td>Một nghiên cứu/sự kiện đã hoàn tất cụ thể</td><td>"Smith (2020) <em>surveyed</em> 400 students."</td></tr>
    <tr><td>Tương lai / khiếm khuyết</td><td>Dự đoán, khuyến nghị</td><td>"Schools <em>should teach</em> notification hygiene."</td></tr>
  </tbody>
</table>
<h3>Liên từ — ba họ</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Đẳng lập (FANBOYS)</b><span>for, and, nor, but, or, yet, so — nối hai mệnh đề ngang hàng, có dấu phẩy trước</span></div>
  <div class="lz-step"><b>Phụ thuộc</b><span>because, although, while, since, if — mở đầu mệnh đề phụ thuộc</span></div>
  <div class="lz-step"><b>Trạng từ liên kết</b><span>however, therefore, moreover — nối ý; đứng sau ; và trước ,</span></div>
</div>
<h3>Ví dụ có lời giải — sửa thì &amp; nối ý</h3>
<div class="out"><b>Yếu:</b> "Many students uses their phone at night and this affected their sleep."<br>
<b>Lỗi:</b> hoà hợp chủ–vị (students <b>use</b>), và thì không nhất quán (hiện tại rồi quá khứ).<br>
<b>Mạnh:</b> "Many students <b>use</b> their phones at night, <b>and</b> this habit <b>reduces</b> their sleep." <br>
<em>Một thì hiện tại nhất quán; "and" (FANBOYS) với dấu phẩy nối hai ý ngang nhau.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Quy tắc thì của "động từ tường thuật".</b> Khi trích nguồn, động từ tường thuật thường giữ hiện tại ("Smith <em>argues</em>…") dù nói về nghiên cứu quá khứ, vì lập luận đó vẫn đứng vững hôm nay. Người bản ngữ chuyển sang quá khứ ("Smith <em>argued</em>…") để báo hiệu một quan điểm đã cũ hoặc bị thay thế. Chọn thì là một cách tinh tế để <em>đánh giá</em> nguồn — kỹ năng giám khảo thưởng.</div>
<div class="pitfall">Một <strong>comma splice</strong> — nối hai câu hoàn chỉnh chỉ bằng dấu phẩy ("Phones distract, students fail") — là một trong những lỗi bị trừ nhiều nhất. Sửa bằng dấu chấm, chấm phẩy, hoặc liên từ FANBOYS: "Phones distract<b>;</b> students fail."</div>
</div>`,
        },
        {
          title: '1.2 — Sentence types, commas & parallel structure|||1.2 — Các loại câu, dấu phẩy & cấu trúc song song',
          slug: 'enw492c-1-2-sentences-commas',
          type: 'VIDEO',
          description: 'Câu đơn/ghép/phức, luật dấu phẩy chính, và cấu trúc song song cho danh sách và so sánh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Sentence variety, commas &amp; parallel structure</h2>
<p class="lead">Good academic prose mixes sentence types on purpose. Variety controls rhythm and emphasis; parallelism makes lists and comparisons easy to read.</p>
<h3>Four sentence types</h3>
<table>
  <thead><tr><th>Type</th><th>Shape</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>Simple</td><td>1 independent clause</td><td>"The study surveyed 400 students."</td></tr>
    <tr><td>Compound</td><td>2 independent, joined (FANBOYS / ;)</td><td>"The study was large, but it was short."</td></tr>
    <tr><td>Complex</td><td>1 independent + ≥1 dependent</td><td>"Although the study was large, it was short."</td></tr>
    <tr><td>Compound-complex</td><td>≥2 independent + ≥1 dependent</td><td>"Although it was short, the study was large, and its data are cited widely."</td></tr>
  </tbody>
</table>
<h3>The four comma rules you actually need</h3>
<div class="lz-flow">
  <div class="lz-step"><b>1 · Before FANBOYS</b><span>joining two independent clauses: "…, and …"</span></div>
  <div class="lz-step"><b>2 · After an intro element</b><span>"However, …" / "In 2020, …" / "Although X, …"</span></div>
  <div class="lz-step"><b>3 · Around non-essential info</b><span>"Smith, a psychologist, argues…"</span></div>
  <div class="lz-step"><b>4 · Between list items</b><span>"phones, laptops, and tablets" (Oxford comma)</span></div>
</div>
<h3>Worked example — parallel structure</h3>
<div class="out"><b>Not parallel:</b> "The paper is clear, well-researched, and it has good structure."<br>
<b>Fix — match the grammatical form:</b> "The paper is clear, well-researched, and well-structured."<br>
<em>Three adjectives in a row — same form. Parallelism makes a list feel balanced and professional.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Sentence length as an emphasis tool.</b> After two or three longer sentences, a very short one lands hard: "…and the data confirm every prediction. Sleep suffered." Native writers use a short sentence to spotlight a key claim. This rhythmic control is style beyond the grammar rules — but it is exactly what separates a 7 from a 9.</div>
<div class="pitfall">A <strong>sentence fragment</strong> ("Because the study was short.") is missing an independent clause and reads as an error in formal writing. Attach it: "The result is weak because the study was short."</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Đa dạng câu, dấu phẩy &amp; cấu trúc song song</h2>
<p class="lead">Văn học thuật tốt trộn các loại câu có chủ đích. Sự đa dạng điều khiển nhịp và nhấn mạnh; song song làm danh sách và so sánh dễ đọc.</p>
<h3>Bốn loại câu</h3>
<table>
  <thead><tr><th>Loại</th><th>Hình dạng</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>Đơn</td><td>1 mệnh đề độc lập</td><td>"The study surveyed 400 students."</td></tr>
    <tr><td>Ghép</td><td>2 mệnh đề độc lập, nối (FANBOYS / ;)</td><td>"The study was large, but it was short."</td></tr>
    <tr><td>Phức</td><td>1 độc lập + ≥1 phụ thuộc</td><td>"Although the study was large, it was short."</td></tr>
    <tr><td>Ghép-phức</td><td>≥2 độc lập + ≥1 phụ thuộc</td><td>"Although it was short, the study was large, and its data are cited widely."</td></tr>
  </tbody>
</table>
<h3>Bốn luật dấu phẩy bạn thật sự cần</h3>
<div class="lz-flow">
  <div class="lz-step"><b>1 · Trước FANBOYS</b><span>nối hai mệnh đề độc lập: "…, and …"</span></div>
  <div class="lz-step"><b>2 · Sau thành phần mở đầu</b><span>"However, …" / "In 2020, …" / "Although X, …"</span></div>
  <div class="lz-step"><b>3 · Bao quanh thông tin không thiết yếu</b><span>"Smith, a psychologist, argues…"</span></div>
  <div class="lz-step"><b>4 · Giữa các mục danh sách</b><span>"phones, laptops, and tablets" (dấu phẩy Oxford)</span></div>
</div>
<h3>Ví dụ có lời giải — cấu trúc song song</h3>
<div class="out"><b>Không song song:</b> "The paper is clear, well-researched, and it has good structure."<br>
<b>Sửa — khớp dạng ngữ pháp:</b> "The paper is clear, well-researched, and well-structured."<br>
<em>Ba tính từ liền nhau — cùng dạng. Song song làm danh sách cân đối và chuyên nghiệp.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Độ dài câu như công cụ nhấn mạnh.</b> Sau hai ba câu dài, một câu rất ngắn sẽ đập mạnh: "…and the data confirm every prediction. Sleep suffered." Người bản ngữ dùng câu ngắn để làm nổi một luận điểm chính. Sự kiểm soát nhịp này là văn phong vượt luật ngữ pháp — nhưng chính là thứ tách một điểm 7 khỏi điểm 9.</div>
<div class="pitfall">Một <strong>câu cụt (fragment)</strong> ("Because the study was short.") thiếu mệnh đề độc lập và bị coi là lỗi trong văn trang trọng. Gắn nó lại: "The result is weak because the study was short."</div>
</div>`,
        },
        {
          title: 'Quiz 1 — Grammar, sentences & punctuation|||Quiz 1 — Ngữ pháp, câu & dấu câu',
          slug: 'enw492c-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra thì, liên từ, loại câu, dấu phẩy và song song.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'For your thesis statement (a general claim), the best tense is usually…|||Cho luận đề (một khẳng định chung), thì tốt nhất thường là…', options: ['past simple|||quá khứ đơn', 'present simple|||hiện tại đơn', 'past perfect|||quá khứ hoàn thành', 'future continuous|||tương lai tiếp diễn'], correctIndex: 1, points: 1 },
              { question: 'Which sentence correctly joins two independent clauses?|||Câu nào nối đúng hai mệnh đề độc lập?', options: ['Phones distract, students fail.', 'Phones distract students fail.', 'Phones distract, so students fail.', 'Phones distract; but students fail.'], correctIndex: 2, points: 1 },
              { question: '"Although the study was large, it was short." is a… sentence.|||"Although the study was large, it was short." là câu…', options: ['simple|||đơn', 'compound|||ghép', 'complex|||phức', 'fragment|||cụt'], correctIndex: 2, points: 1 },
              { question: 'Which list uses correct parallel structure?|||Danh sách nào dùng đúng cấu trúc song song?', options: ['clear, well-researched, and it has structure', 'clear, well-researched, and well-structured', 'clearly, research, and structure', 'clear, researching, and to structure'], correctIndex: 1, points: 1 },
              { question: 'A comma splice is fixed by all of these EXCEPT…|||Comma splice được sửa bằng mọi cách sau NGOẠI TRỪ…', options: ['a period|||dấu chấm', 'a semicolon|||dấu chấm phẩy', 'a FANBOYS conjunction|||liên từ FANBOYS', 'adding another comma|||thêm một dấu phẩy nữa'], correctIndex: 3, points: 1 },
              { question: 'When citing research that still holds true today, native academics often keep the reporting verb in… (beyond-syllabus)|||Khi trích nghiên cứu vẫn đúng hôm nay, người bản ngữ thường giữ động từ tường thuật ở… (ngoài giáo trình)', options: ['past simple to sound formal|||quá khứ đơn cho trang trọng', 'present simple, because the argument still stands|||hiện tại đơn, vì lập luận vẫn đứng vững', 'future tense|||thì tương lai', 'no verb at all|||không động từ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — MOOC 2: THE ESSAY ══════════════════ */
    {
      title: 'Chapter 2 — MOOC 2: The essay & the writing process|||Chương 2 — MOOC 2: Bài luận & quy trình viết',
      description: 'Cấu trúc bài luận, luận đề mạnh, dàn ý, và các loại luận: so sánh/đối chiếu, nguyên nhân/kết quả, lập luận.',
      lessons: [
        {
          title: '2.1 — Essay anatomy, the thesis & outlining|||2.1 — Giải phẫu bài luận, luận đề & lập dàn ý',
          slug: 'enw492c-2-1-thesis-outline',
          type: 'VIDEO',
          description: 'Cấu trúc 5 đoạn, cách viết luận đề mạnh, và lập dàn ý trước khi viết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Essay anatomy, the thesis &amp; outlining</h2>
<p class="lead">The five-paragraph essay is the skeleton every academic argument hangs on. Learn the skeleton first; you can grow it later.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Introduction</div><div class="lz-nsub">Hook → background → <b>thesis</b> (last sentence)</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Body paragraph 1</div><div class="lz-nsub">Topic sentence → evidence → analysis → link</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Body paragraph 2</div><div class="lz-nsub">Second reason, same shape</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Body paragraph 3</div><div class="lz-nsub">Third reason / counterargument</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Conclusion</div><div class="lz-nsub">Restate thesis → synthesise → "so what"</div></div></div>
</div>
<h3>What makes a thesis strong</h3>
<p>A thesis is <strong>one sentence</strong> that states your position AND previews your reasons. It must be arguable (someone could disagree) and specific (not vague).</p>
<div class="out"><b>Too weak (a topic):</b> "This essay is about remote work."<br>
<b>Weak (an obvious fact):</b> "Remote work has advantages and disadvantages."<br>
<b>Strong (arguable + preview):</b> "Remote work raises individual focus but harms team cohesion, so companies should adopt a hybrid model rather than going fully remote."<br>
<em>Position (hybrid is best) + two reasons (focus up, cohesion down) previewed → the body writes itself.</em></div>
<h3>Outline before you write</h3>
<div class="callout ok">Spend 10 minutes on a bullet outline: thesis, then one topic sentence per body paragraph, then the evidence under each. Writing then becomes "fill in the blanks", and you never lose the thread mid-essay.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "they say / I say" template.</b> Strong academic writing enters a conversation: start a paragraph by summarising what others claim ("Critics argue that remote work isolates staff"), then respond ("However, structured check-ins can offset this"). Framing your point as a <em>reply</em> to existing views is more persuasive than asserting into a vacuum — a move the basic five-paragraph model omits.</div>
<div class="pitfall">Never bury the thesis in the middle of the intro or the conclusion. Examiners look for it as the <strong>last sentence of paragraph 1</strong>. If they cannot find it there, you lose marks for structure.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Giải phẫu bài luận, luận đề &amp; lập dàn ý</h2>
<p class="lead">Bài luận 5 đoạn là bộ khung mà mọi lập luận học thuật treo lên. Học bộ khung trước; bạn có thể mở rộng sau.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Mở bài</div><div class="lz-nsub">Câu móc → nền → <b>luận đề</b> (câu cuối)</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Đoạn thân 1</div><div class="lz-nsub">Câu chủ đề → bằng chứng → phân tích → liên kết</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Đoạn thân 2</div><div class="lz-nsub">Lý do thứ hai, cùng hình dạng</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Đoạn thân 3</div><div class="lz-nsub">Lý do thứ ba / phản biện</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Kết bài</div><div class="lz-nsub">Nhắc lại luận đề → tổng hợp → "rồi sao"</div></div></div>
</div>
<h3>Điều gì làm luận đề mạnh</h3>
<p>Luận đề là <strong>một câu</strong> nêu lập trường VÀ hé lộ các lý do. Phải tranh luận được (có người có thể bất đồng) và cụ thể (không mơ hồ).</p>
<div class="out"><b>Quá yếu (một chủ đề):</b> "This essay is about remote work."<br>
<b>Yếu (sự thật hiển nhiên):</b> "Remote work has advantages and disadvantages."<br>
<b>Mạnh (tranh luận được + hé lộ):</b> "Remote work raises individual focus but harms team cohesion, so companies should adopt a hybrid model rather than going fully remote."<br>
<em>Lập trường (hybrid là tốt nhất) + hai lý do (focus tăng, cohesion giảm) đã hé lộ → phần thân tự viết ra.</em></div>
<h3>Lập dàn ý trước khi viết</h3>
<div class="callout ok">Dành 10 phút cho một dàn ý gạch đầu dòng: luận đề, rồi một câu chủ đề mỗi đoạn thân, rồi bằng chứng dưới mỗi câu. Viết khi đó thành "điền vào chỗ trống", và bạn không bao giờ lạc mạch giữa bài.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khuôn "họ nói / tôi nói".</b> Viết học thuật mạnh là bước vào một cuộc hội thoại: mở đoạn bằng tóm tắt điều người khác nói ("Critics argue that remote work isolates staff"), rồi phản hồi ("However, structured check-ins can offset this"). Đóng khung luận điểm như một <em>lời đáp</em> cho quan điểm sẵn có thuyết phục hơn khẳng định vào khoảng không — nước cờ mà mô hình 5 đoạn cơ bản bỏ sót.</div>
<div class="pitfall">Đừng bao giờ chôn luận đề giữa mở bài hay trong kết bài. Giám khảo tìm nó ở <strong>câu cuối đoạn 1</strong>. Không thấy ở đó là mất điểm cấu trúc.</div>
</div>`,
        },
        {
          title: '2.2 — Essay types: compare/contrast, cause/effect & argument|||2.2 — Các loại luận: so sánh/đối chiếu, nguyên nhân/kết quả & lập luận',
          slug: 'enw492c-2-2-essay-types',
          type: 'VIDEO',
          description: 'Ba khuôn luận phổ biến trong thi và cách tổ chức mỗi loại.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Three essay types you must be able to write</h2>
<p class="lead">The exam prompt names a task verb. Each verb maps to a proven organisation. Recognise it, and you already know your paragraph plan.</p>
<table>
  <thead><tr><th>Type</th><th>Prompt signal</th><th>Two ways to organise</th></tr></thead>
  <tbody>
    <tr><td>Compare/contrast</td><td>"compare", "similarities and differences"</td><td><b>Block</b> (all of A, then all of B) or <b>point-by-point</b> (criterion 1: A vs B; criterion 2: A vs B)</td></tr>
    <tr><td>Cause/effect</td><td>"causes of", "effects of", "why"</td><td>Causes → effect, or one cause → multiple effects (a chain or a fan)</td></tr>
    <tr><td>Argument</td><td>"argue", "should", "do you agree"</td><td>Reasons for your side → acknowledge counterargument → rebut → conclude</td></tr>
  </tbody>
</table>
<h3>Worked example — point-by-point compare/contrast</h3>
<div class="out"><b>Prompt:</b> "Compare online and in-person classes."<br>
<b>Point-by-point plan (clearer for exams):</b><br>
• ¶1 Flexibility: online (learn anytime) vs in-person (fixed schedule)<br>
• ¶2 Interaction: online (chat, async) vs in-person (instant, social)<br>
• ¶3 Discipline: online (needs self-control) vs in-person (external structure)<br>
<em>Each paragraph compares ONE criterion across both — the reader sees the trade-off directly, instead of holding "all of A" in memory.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Signposting language is scored.</b> Examiners reward explicit transitions that show the essay type: for compare/contrast use "similarly, in contrast, whereas"; for cause/effect "consequently, as a result, this leads to"; for argument "admittedly… however, one might object that…". These phrases are a checklist you can memorise and deploy — the syllabus assumes them but rarely lists them.</div>
<div class="pitfall">In an argument essay, <strong>skipping the counterargument</strong> makes you look one-sided and naive. Devote one paragraph to the strongest opposing view, then rebut it. Acknowledging the other side <em>strengthens</em>, not weakens, your position.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Ba loại luận bạn phải viết được</h2>
<p class="lead">Đề thi nêu một động từ nhiệm vụ. Mỗi động từ ứng với một cách tổ chức đã được kiểm chứng. Nhận ra nó là đã biết kế hoạch đoạn.</p>
<table>
  <thead><tr><th>Loại</th><th>Tín hiệu trong đề</th><th>Hai cách tổ chức</th></tr></thead>
  <tbody>
    <tr><td>So sánh/đối chiếu</td><td>"compare", "similarities and differences"</td><td><b>Khối</b> (toàn A, rồi toàn B) hoặc <b>điểm-theo-điểm</b> (tiêu chí 1: A vs B; tiêu chí 2: A vs B)</td></tr>
    <tr><td>Nguyên nhân/kết quả</td><td>"causes of", "effects of", "why"</td><td>Nguyên nhân → kết quả, hoặc một nguyên nhân → nhiều kết quả (chuỗi hoặc quạt)</td></tr>
    <tr><td>Lập luận</td><td>"argue", "should", "do you agree"</td><td>Lý do cho phe bạn → thừa nhận phản biện → bác bỏ → kết</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải — so sánh điểm-theo-điểm</h3>
<div class="out"><b>Đề:</b> "Compare online and in-person classes."<br>
<b>Kế hoạch điểm-theo-điểm (rõ hơn cho thi):</b><br>
• ¶1 Linh hoạt: online (học lúc nào cũng được) vs trực tiếp (lịch cố định)<br>
• ¶2 Tương tác: online (chat, không đồng bộ) vs trực tiếp (tức thì, xã hội)<br>
• ¶3 Kỷ luật: online (cần tự chủ) vs trực tiếp (cấu trúc bên ngoài)<br>
<em>Mỗi đoạn so sánh MỘT tiêu chí trên cả hai — người đọc thấy đánh đổi trực tiếp, không phải nhớ "toàn bộ A".</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Ngôn ngữ chỉ đường (signposting) được tính điểm.</b> Giám khảo thưởng các từ chuyển ý rõ ràng cho thấy loại luận: so sánh/đối chiếu dùng "similarly, in contrast, whereas"; nguyên nhân/kết quả "consequently, as a result, this leads to"; lập luận "admittedly… however, one might object that…". Những cụm này là một checklist bạn học thuộc và triển khai — giáo trình mặc định có chúng nhưng ít khi liệt kê.</div>
<div class="pitfall">Trong bài lập luận, <strong>bỏ qua phản biện</strong> làm bạn trông một chiều và ngây thơ. Dành một đoạn cho quan điểm đối lập mạnh nhất, rồi bác bỏ. Thừa nhận phe kia <em>củng cố</em>, không làm yếu, lập trường của bạn.</div>
</div>`,
        },
        {
          title: 'Quiz 2 — The essay & essay types|||Quiz 2 — Bài luận & các loại luận',
          slug: 'enw492c-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra cấu trúc luận, luận đề, và ba loại luận.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'In a five-paragraph essay, the thesis belongs…|||Trong bài luận 5 đoạn, luận đề nằm ở…', options: ['in the first sentence of the essay|||câu đầu tiên của bài', 'as the last sentence of the introduction|||câu cuối của mở bài', 'in the conclusion only|||chỉ trong kết bài', 'in every body paragraph|||mỗi đoạn thân'], correctIndex: 1, points: 1 },
              { question: 'Which is the strongest thesis?|||Đâu là luận đề mạnh nhất?', options: ['This essay is about remote work.', 'Remote work has pros and cons.', 'Remote work raises focus but harms cohesion, so firms should go hybrid.', 'Remote work is a topic many people discuss.'], correctIndex: 2, points: 1 },
              { question: 'A body paragraph should follow the order…|||Một đoạn thân nên theo thứ tự…', options: ['evidence → topic sentence → analysis', 'topic sentence → evidence → analysis → link', 'analysis → link → evidence', 'link → evidence → topic sentence'], correctIndex: 1, points: 1 },
              { question: 'For "Compare online and in-person classes", the clearer exam structure is…|||Cho "Compare online and in-person classes", cấu trúc thi rõ hơn là…', options: ['point-by-point|||điểm-theo-điểm', 'random order|||thứ tự ngẫu nhiên', 'one giant paragraph|||một đoạn khổng lồ', 'no structure|||không cấu trúc'], correctIndex: 0, points: 1 },
              { question: 'In an argument essay, addressing the counterargument…|||Trong bài lập luận, xử lý phản biện…', options: ['weakens your position|||làm yếu lập trường', 'strengthens your position and shows fairness|||củng cố lập trường và cho thấy công bằng', 'should be avoided|||nên tránh', 'replaces the thesis|||thay thế luận đề'], correctIndex: 1, points: 1 },
              { question: 'Framing your point as a reply to what "they say" is persuasive because… (beyond-syllabus)|||Đóng khung luận điểm như lời đáp cho điều "họ nói" thuyết phục vì… (ngoài giáo trình)', options: ['it is longer|||dài hơn', 'it enters an existing conversation instead of asserting into a vacuum|||bước vào cuộc hội thoại sẵn có thay vì khẳng định vào khoảng không', 'it avoids evidence|||tránh bằng chứng', 'it removes the thesis|||bỏ luận đề'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — MOOC 3: ADVANCED WRITING & INTEGRITY ══════════════════ */
    {
      title: 'Chapter 3 — MOOC 3: Advanced writing & academic integrity|||Chương 3 — MOOC 3: Viết nâng cao & liêm chính học thuật',
      description: 'Lập luận nâng cao, tránh đạo văn, diễn giải & tổng hợp nguồn, và bài có trích dẫn.',
      lessons: [
        {
          title: '3.1 — Advanced argument, counterargument & rebuttal|||3.1 — Lập luận nâng cao, phản biện & bác bỏ',
          slug: 'enw492c-3-1-advanced-argument',
          type: 'VIDEO',
          description: 'Xây lập luận nhiều tầng: claim → evidence → warrant, và xử lý phản biện chuyên nghiệp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Advanced argument: claim, evidence, warrant</h2>
<p class="lead">A sophisticated argument does not just state opinions — it connects a claim to evidence through explicit reasoning (the "warrant"). Making that link visible is what earns top marks.</p>
<div class="lz-flow">
  <div class="lz-step"><b>Claim</b><span>the point you want the reader to accept</span></div>
  <div class="lz-step"><b>Evidence</b><span>data, study, example that supports it</span></div>
  <div class="lz-step"><b>Warrant</b><span>the reasoning that connects evidence → claim ("this matters because…")</span></div>
</div>
<h3>Worked example — a fully reasoned paragraph</h3>
<div class="out"><b>Claim:</b> Universities should teach notification management.<br>
<b>Evidence:</b> "A 2021 study found students who disabled night notifications slept 42 minutes longer on average (Lee, 2021)."<br>
<b>Warrant:</b> "Because sleep directly affects memory consolidation, even a small nightly gain compounds into measurable academic improvement over a semester."<br>
<em>The warrant is the sentence weak writers skip. Without it, the reader has a fact but no reason to accept the claim.</em></div>
<h3>Handling the counterargument (concession + rebuttal)</h3>
<p>Signal that you understand the opposing view, then show why your position still holds:</p>
<div class="out">"<b>Admittedly</b>, some argue that managing notifications is a personal responsibility, not a university's job. <b>However</b>, students are rarely taught the link between notifications and sleep, and a single workshop costs little while affecting thousands — so the institutional benefit outweighs the objection."</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Name the logical fallacies you must avoid.</b> Weak arguments lean on <em>ad hominem</em> (attacking the person), <em>straw man</em> (distorting the opposing view), <em>hasty generalisation</em> (one case → universal rule), and <em>false dilemma</em> (only two options when more exist). Examiners quietly reward writers who steer clear of these. Knowing their names helps you spot them in your own drafts — a critical-thinking layer the writing syllabus assumes but does not teach.</div>
<div class="pitfall">A <strong>quote with no analysis</strong> ("drop quote") is dead weight. Every piece of evidence must be followed by your interpretation. The ratio should favour <em>your</em> words over quoted words.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Lập luận nâng cao: claim, evidence, warrant</h2>
<p class="lead">Một lập luận tinh vi không chỉ nêu ý kiến — nó nối luận điểm với bằng chứng qua lý lẽ rõ ràng ("warrant"). Làm mối nối đó hiện rõ chính là thứ đạt điểm cao.</p>
<div class="lz-flow">
  <div class="lz-step"><b>Claim (luận điểm)</b><span>điều bạn muốn người đọc chấp nhận</span></div>
  <div class="lz-step"><b>Evidence (bằng chứng)</b><span>dữ liệu, nghiên cứu, ví dụ chống lưng</span></div>
  <div class="lz-step"><b>Warrant (lý lẽ nối)</b><span>lập luận nối bằng chứng → luận điểm ("điều này quan trọng vì…")</span></div>
</div>
<h3>Ví dụ có lời giải — một đoạn lập luận đầy đủ</h3>
<div class="out"><b>Claim:</b> Đại học nên dạy quản lý thông báo.<br>
<b>Evidence:</b> "A 2021 study found students who disabled night notifications slept 42 minutes longer on average (Lee, 2021)."<br>
<b>Warrant:</b> "Because sleep directly affects memory consolidation, even a small nightly gain compounds into measurable academic improvement over a semester."<br>
<em>Warrant là câu người viết yếu bỏ qua. Thiếu nó, người đọc có một sự thật nhưng không có lý do chấp nhận luận điểm.</em></div>
<h3>Xử lý phản biện (nhượng bộ + bác bỏ)</h3>
<p>Báo hiệu bạn hiểu quan điểm đối lập, rồi cho thấy vì sao lập trường của bạn vẫn đứng:</p>
<div class="out">"<b>Admittedly</b>, some argue that managing notifications is a personal responsibility, not a university's job. <b>However</b>, students are rarely taught the link between notifications and sleep, and a single workshop costs little while affecting thousands — so the institutional benefit outweighs the objection."</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Gọi tên các nguỵ biện phải tránh.</b> Lập luận yếu dựa vào <em>ad hominem</em> (công kích cá nhân), <em>straw man</em> (bóp méo quan điểm đối lập), <em>hasty generalisation</em> (một ca → luật phổ quát), và <em>false dilemma</em> (chỉ hai lựa chọn khi còn nhiều hơn). Giám khảo âm thầm thưởng người viết tránh được chúng. Biết tên chúng giúp bạn phát hiện trong nháp của chính mình — một tầng tư duy phản biện mà giáo trình viết mặc định nhưng không dạy.</div>
<div class="pitfall">Một <strong>trích dẫn không phân tích</strong> ("drop quote") là gánh nặng chết. Mọi bằng chứng phải theo sau bằng diễn giải của bạn. Tỉ lệ nên nghiêng về lời <em>của bạn</em> hơn lời trích.</div>
</div>`,
        },
        {
          title: '3.2 — Avoiding plagiarism: paraphrase, synthesis & the documented essay|||3.2 — Tránh đạo văn: diễn giải, tổng hợp & bài có trích dẫn',
          slug: 'enw492c-3-2-plagiarism-synthesis',
          type: 'VIDEO',
          description: 'Bốn kiểu đạo văn, cách diễn giải đúng, tổng hợp nhiều nguồn, và trích dẫn trung thực.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Academic integrity: paraphrase &amp; synthesis</h2>
<p class="lead">Plagiarism is the fastest way to fail — and most of it is accidental. Learn the four types and the two safe techniques (quote or paraphrase, always cited).</p>
<h3>Four types of plagiarism</h3>
<table>
  <thead><tr><th>Type</th><th>What it is</th></tr></thead>
  <tbody>
    <tr><td>Direct (copy-paste)</td><td>Using another's exact words without quotation marks or a citation</td></tr>
    <tr><td>Mosaic ("patchwriting")</td><td>Swapping a few words but keeping the source's sentence structure</td></tr>
    <tr><td>Self-plagiarism</td><td>Reusing your own past submitted work without disclosure</td></tr>
    <tr><td>Uncited paraphrase</td><td>Rewriting an idea in your words but not crediting the source</td></tr>
  </tbody>
</table>
<h3>Worked example — real paraphrase vs patchwriting</h3>
<div class="out"><b>Original:</b> "Late-night smartphone use significantly reduces adolescent sleep duration."<br>
<b>Patchwriting (STILL plagiarism):</b> "Nighttime smartphone use greatly lowers teen sleep length (Lee, 2021)." — <em>same structure, synonyms swapped → not acceptable.</em><br>
<b>Real paraphrase:</b> "Lee (2021) found that when teenagers use phones before bed, they end up sleeping noticeably less." — <em>new structure, own words, cited → correct.</em></div>
<h3>Synthesis — weaving multiple sources</h3>
<p>A synthesis essay does not summarise sources one by one; it combines them around <em>your</em> point:</p>
<div class="out">"Several studies converge on this link: Lee (2021) measured shorter sleep, while Tran (2022) tied the same behaviour to lower morning alertness. Together they suggest the problem is not isolated but systemic."</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "close the book" paraphrase technique.</b> To paraphrase without accidentally copying: read the passage, close the source, write the idea from memory in your own words, then reopen to check you kept the meaning but not the phrasing. Because you never look at the original while writing, patchwriting becomes almost impossible. This physical habit beats any rule about "changing 30% of words".</div>
<div class="pitfall">"I cited it in the bibliography" does not cover you. Every borrowed idea needs an <strong>in-text citation</strong> at the point of use, not just an entry in the reference list at the end.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Liêm chính học thuật: diễn giải &amp; tổng hợp</h2>
<p class="lead">Đạo văn là cách rớt nhanh nhất — và phần lớn là vô tình. Hãy học bốn kiểu và hai kỹ thuật an toàn (trích nguyên văn hoặc diễn giải, luôn có trích dẫn).</p>
<h3>Bốn kiểu đạo văn</h3>
<table>
  <thead><tr><th>Kiểu</th><th>Là gì</th></tr></thead>
  <tbody>
    <tr><td>Trực tiếp (copy-paste)</td><td>Dùng nguyên văn người khác không dấu ngoặc kép hay trích dẫn</td></tr>
    <tr><td>Chắp vá ("patchwriting")</td><td>Đổi vài từ nhưng giữ nguyên cấu trúc câu của nguồn</td></tr>
    <tr><td>Tự đạo văn</td><td>Dùng lại bài đã nộp của chính mình mà không khai báo</td></tr>
    <tr><td>Diễn giải không trích dẫn</td><td>Viết lại ý bằng lời mình nhưng không ghi công nguồn</td></tr>
  </tbody>
</table>
<h3>Ví dụ có lời giải — diễn giải thật vs chắp vá</h3>
<div class="out"><b>Nguyên bản:</b> "Late-night smartphone use significantly reduces adolescent sleep duration."<br>
<b>Chắp vá (VẪN là đạo văn):</b> "Nighttime smartphone use greatly lowers teen sleep length (Lee, 2021)." — <em>cùng cấu trúc, chỉ đổi từ đồng nghĩa → không chấp nhận được.</em><br>
<b>Diễn giải thật:</b> "Lee (2021) found that when teenagers use phones before bed, they end up sleeping noticeably less." — <em>cấu trúc mới, lời của mình, có trích dẫn → đúng.</em></div>
<h3>Tổng hợp — dệt nhiều nguồn</h3>
<p>Bài tổng hợp không tóm từng nguồn một; nó kết hợp chúng quanh luận điểm <em>của bạn</em>:</p>
<div class="out">"Several studies converge on this link: Lee (2021) measured shorter sleep, while Tran (2022) tied the same behaviour to lower morning alertness. Together they suggest the problem is not isolated but systemic."</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kỹ thuật diễn giải "đóng sách lại".</b> Để diễn giải mà không vô tình sao chép: đọc đoạn, đóng nguồn lại, viết ý từ trí nhớ bằng lời của bạn, rồi mở lại để kiểm bạn giữ nghĩa nhưng không giữ cách diễn đạt. Vì bạn không nhìn bản gốc khi viết, chắp vá gần như không thể xảy ra. Thói quen vật lý này hơn mọi luật "đổi 30% số từ".</div>
<div class="pitfall">"Tôi đã ghi trong thư mục" không cứu bạn. Mọi ý vay mượn cần một <strong>trích dẫn trong bài (in-text)</strong> ngay chỗ dùng, không chỉ một mục trong danh sách tài liệu ở cuối.</div>
</div>`,
        },
        {
          title: 'Quiz 3 — Argument & academic integrity|||Quiz 3 — Lập luận & liêm chính học thuật',
          slug: 'enw492c-quiz-3',
          type: 'QUIZ',
          description: 'Kiểm tra claim/evidence/warrant, phản biện, đạo văn và tổng hợp.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The "warrant" in an argument is…|||"Warrant" trong lập luận là…', options: ['the claim itself|||chính luận điểm', 'the reasoning that connects evidence to the claim|||lý lẽ nối bằng chứng với luận điểm', 'the bibliography|||thư mục', 'a direct quote|||một trích dẫn nguyên văn'], correctIndex: 1, points: 1 },
              { question: 'Swapping a few synonyms but keeping the source sentence structure is…|||Đổi vài từ đồng nghĩa nhưng giữ cấu trúc câu nguồn là…', options: ['acceptable paraphrase|||diễn giải chấp nhận được', 'mosaic plagiarism / patchwriting|||đạo văn chắp vá', 'a proper quotation|||trích dẫn đúng', 'synthesis|||tổng hợp'], correctIndex: 1, points: 1 },
              { question: 'A borrowed idea needs a citation…|||Một ý vay mượn cần trích dẫn…', options: ['only in the reference list at the end|||chỉ trong danh sách tài liệu ở cuối', 'in-text at the point of use, plus in the reference list|||trong bài ngay chỗ dùng, cộng danh sách tài liệu', 'never, if paraphrased|||không bao giờ, nếu đã diễn giải', 'only for direct quotes|||chỉ cho trích nguyên văn'], correctIndex: 1, points: 1 },
              { question: 'A synthesis essay differs from a summary because it…|||Bài tổng hợp khác bài tóm tắt vì nó…', options: ['is shorter|||ngắn hơn', 'combines multiple sources around your own point|||kết hợp nhiều nguồn quanh luận điểm của bạn', 'lists each source one by one|||liệt kê từng nguồn một', 'avoids citations|||tránh trích dẫn'], correctIndex: 1, points: 1 },
              { question: 'Distorting your opponent\'s view to attack it more easily is the fallacy called… (beyond-syllabus)|||Bóp méo quan điểm đối phương để công kích dễ hơn là nguỵ biện… (ngoài giáo trình)', options: ['straw man|||người rơm', 'ad hominem|||công kích cá nhân', 'false dilemma|||lưỡng nan giả', 'hasty generalisation|||khái quát vội'], correctIndex: 0, points: 1 },
              { question: 'The safest way to paraphrase without copying is to…|||Cách an toàn nhất để diễn giải mà không sao chép là…', options: ['change every third word|||đổi mỗi từ thứ ba', 'read, close the source, write from memory, then check|||đọc, đóng nguồn, viết từ trí nhớ, rồi kiểm', 'keep the sentence and add a citation|||giữ câu và thêm trích dẫn', 'use quotation marks around everything|||đặt ngoặc kép quanh mọi thứ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — MOOC 4: RESEARCH FOR WRITING ══════════════════ */
    {
      title: 'Chapter 4 — MOOC 4: Research for writing|||Chương 4 — MOOC 4: Nghiên cứu cho bài viết',
      description: 'Chọn đề tài nghiên cứu, tìm và đánh giá nguồn (CRAAP), ngôn ngữ nghiên cứu, và trích dẫn/định dạng APA.',
      lessons: [
        {
          title: '4.1 — Choosing topics, finding & evaluating sources|||4.1 — Chọn đề tài, tìm & đánh giá nguồn',
          slug: 'enw492c-4-1-finding-sources',
          type: 'VIDEO',
          description: 'Từ đề tài tới câu hỏi nghiên cứu, tìm nguồn học thuật, và kiểm độ tin bằng CRAAP.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Finding &amp; evaluating sources</h2>
<p class="lead">Research writing lives or dies on source quality. A brilliant argument built on a random blog post collapses; the same argument on peer-reviewed studies stands.</p>
<h3>From topic to research question</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Topic</b><span>"AI in education"</span></div>
  <div class="lz-step"><b>Narrowed</b><span>"AI writing tools in university essays"</span></div>
  <div class="lz-step"><b>Research question</b><span>"Should universities allow AI writing tools, and under what limits?"</span></div>
</div>
<h3>Where to look</h3>
<p>Prefer <strong>Google Scholar</strong>, university libraries, and reputable organisations (.edu, .gov, established journals) over general web search. Avoid content farms and un-authored pages.</p>
<h3>The CRAAP test — evaluate every source</h3>
<table>
  <thead><tr><th>Letter</th><th>Question</th></tr></thead>
  <tbody>
    <tr><td>Currency</td><td>Is it recent enough for the topic?</td></tr>
    <tr><td>Relevance</td><td>Does it directly address your question?</td></tr>
    <tr><td>Authority</td><td>Who wrote it — credentials, institution?</td></tr>
    <tr><td>Accuracy</td><td>Is it evidence-based and verifiable?</td></tr>
    <tr><td>Purpose</td><td>Inform or persuade/sell? Any bias?</td></tr>
  </tbody>
</table>
<div class="out"><b>Worked example:</b> A 2015 vendor blog titled "Why our AI tool boosts grades" fails CRAAP on <b>Currency</b> (old for fast-moving AI), <b>Authority</b> (no named expert), and <b>Purpose</b> (it sells a product). A 2023 peer-reviewed study in a journal passes all five. Use the second, not the first.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Primary vs secondary sources.</b> A <em>primary</em> source is original evidence (a dataset, an experiment, an interview); a <em>secondary</em> source interprets it (a review article, a textbook). Strong research papers cite primary sources for key claims and use secondary sources for context. Knowing the difference lets you trace a claim to its origin instead of trusting someone's summary — a research-literacy skill the writing syllabus assumes.</div>
<div class="pitfall">Do not confuse "the first Google result" with "the best source". Ranking reflects popularity and SEO, not academic credibility. Always run CRAAP before trusting a page.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Tìm &amp; đánh giá nguồn</h2>
<p class="lead">Viết nghiên cứu sống chết nhờ chất lượng nguồn. Một lập luận xuất sắc dựng trên một bài blog vu vơ sẽ sụp; cùng lập luận đó dựa trên nghiên cứu bình duyệt sẽ đứng vững.</p>
<h3>Từ đề tài tới câu hỏi nghiên cứu</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Đề tài</b><span>"AI trong giáo dục"</span></div>
  <div class="lz-step"><b>Thu hẹp</b><span>"Công cụ viết AI trong bài luận đại học"</span></div>
  <div class="lz-step"><b>Câu hỏi nghiên cứu</b><span>"Có nên cho phép công cụ viết AI, và với giới hạn nào?"</span></div>
</div>
<h3>Tìm ở đâu</h3>
<p>Ưu tiên <strong>Google Scholar</strong>, thư viện đại học, và tổ chức uy tín (.edu, .gov, tạp chí có tiếng) hơn tìm kiếm web chung. Tránh content farm và trang không có tác giả.</p>
<h3>Phép thử CRAAP — đánh giá mọi nguồn</h3>
<table>
  <thead><tr><th>Chữ</th><th>Câu hỏi</th></tr></thead>
  <tbody>
    <tr><td>Currency (Cập nhật)</td><td>Đủ mới cho đề tài không?</td></tr>
    <tr><td>Relevance (Liên quan)</td><td>Có trả lời trực tiếp câu hỏi của bạn không?</td></tr>
    <tr><td>Authority (Thẩm quyền)</td><td>Ai viết — bằng cấp, cơ quan?</td></tr>
    <tr><td>Accuracy (Chính xác)</td><td>Dựa bằng chứng và kiểm chứng được không?</td></tr>
    <tr><td>Purpose (Mục đích)</td><td>Cung cấp thông tin hay thuyết phục/bán hàng? Có thiên lệch?</td></tr>
  </tbody>
</table>
<div class="out"><b>Ví dụ có lời giải:</b> Một blog nhà bán hàng năm 2015 tựa "Vì sao công cụ AI của chúng tôi nâng điểm" trượt CRAAP ở <b>Currency</b> (cũ với AI đổi nhanh), <b>Authority</b> (không chuyên gia nêu tên), và <b>Purpose</b> (bán sản phẩm). Một nghiên cứu bình duyệt năm 2023 trên tạp chí qua cả năm. Dùng cái thứ hai, không phải cái đầu.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nguồn sơ cấp vs thứ cấp.</b> Nguồn <em>sơ cấp</em> là bằng chứng gốc (một bộ dữ liệu, một thí nghiệm, một phỏng vấn); nguồn <em>thứ cấp</em> diễn giải nó (bài tổng quan, giáo trình). Bài nghiên cứu mạnh trích nguồn sơ cấp cho luận điểm chính và dùng nguồn thứ cấp cho bối cảnh. Biết khác biệt giúp bạn truy một luận điểm về gốc thay vì tin bản tóm của ai đó — kỹ năng đọc-hiểu nghiên cứu mà giáo trình viết mặc định.</div>
<div class="pitfall">Đừng nhầm "kết quả Google đầu tiên" với "nguồn tốt nhất". Thứ hạng phản ánh độ phổ biến và SEO, không phải uy tín học thuật. Luôn chạy CRAAP trước khi tin một trang.</div>
</div>`,
        },
        {
          title: '4.2 — Research language, citing sources & APA formatting|||4.2 — Ngôn ngữ nghiên cứu, trích dẫn & định dạng APA',
          slug: 'enw492c-4-2-citing-apa',
          type: 'VIDEO',
          description: 'Reporting verbs, hedging, trích dẫn trong bài, và cách dựng tham chiếu APA.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Research language &amp; APA citation</h2>
<p class="lead">Academic register has its own vocabulary of caution and attribution. Two tools do most of the work: reporting verbs (to attribute) and hedging (to calibrate certainty).</p>
<h3>Reporting verbs — attribute ideas precisely</h3>
<p>Choose the verb that reflects how strongly the author commits: neutral (<em>states, notes, describes</em>), argumentative (<em>argues, claims, contends</em>), evidential (<em>demonstrates, shows, found</em>).</p>
<h3>Hedging — the language of academic caution</h3>
<div class="out"><b>Overclaiming:</b> "Phones destroy sleep."<br>
<b>Hedged (academic):</b> "Evidence <b>suggests</b> that late-night phone use <b>may</b> reduce sleep duration."<br>
<em>Words like may, suggest, tend to, appears to signal appropriate caution. Overclaiming looks naive; measured claims look scholarly.</em></div>
<h3>In-text citation &amp; the reference entry (APA)</h3>
<div class="out"><b>In-text:</b> Late-night use reduces sleep (Lee, 2021).  — or —  Lee (2021) found that…<br>
<b>Direct quote with page:</b> (Lee, 2021, p. 14).<br>
<b>Reference-list entry (APA 7):</b><br>
Lee, J. (2021). Smartphones and adolescent sleep. <em>Journal of Sleep Research, 30</em>(2), 10–19.<br>
<em>Pattern: Author, A. (Year). Title of article. </em>Journal Name, Volume<em>(Issue), pages.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Let a reference manager do the formatting.</b> Tools like Zotero capture a source with one browser click and generate flawless APA/MLA entries, then keep them in sync as you cite. Manually formatting references is error-prone (a wrong italic or comma loses marks); automating it frees you to focus on argument. The syllabus teaches the rules — professionals automate them.</div>
<div class="pitfall">APA and MLA are <strong>different systems</strong> — do not mix them. APA uses (Author, Year); MLA uses (Author page). Pick the one your prompt requires and be consistent throughout.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Ngôn ngữ nghiên cứu &amp; trích dẫn APA</h2>
<p class="lead">Văn phong học thuật có vốn từ riêng của sự thận trọng và ghi công. Hai công cụ làm phần lớn việc: động từ tường thuật (để ghi công) và hedging (để hiệu chỉnh mức chắc chắn).</p>
<h3>Động từ tường thuật — ghi công ý tưởng chính xác</h3>
<p>Chọn động từ phản ánh mức cam kết của tác giả: trung tính (<em>states, notes, describes</em>), lập luận (<em>argues, claims, contends</em>), bằng chứng (<em>demonstrates, shows, found</em>).</p>
<h3>Hedging — ngôn ngữ thận trọng học thuật</h3>
<div class="out"><b>Nói quá:</b> "Phones destroy sleep."<br>
<b>Có hedging (học thuật):</b> "Evidence <b>suggests</b> that late-night phone use <b>may</b> reduce sleep duration."<br>
<em>Các từ may, suggest, tend to, appears to báo hiệu sự thận trọng đúng mực. Nói quá trông ngây thơ; luận điểm chừng mực trông học thuật.</em></div>
<h3>Trích dẫn trong bài &amp; mục tham chiếu (APA)</h3>
<div class="out"><b>Trong bài:</b> Late-night use reduces sleep (Lee, 2021).  — hoặc —  Lee (2021) found that…<br>
<b>Trích nguyên văn có trang:</b> (Lee, 2021, p. 14).<br>
<b>Mục danh sách tài liệu (APA 7):</b><br>
Lee, J. (2021). Smartphones and adolescent sleep. <em>Journal of Sleep Research, 30</em>(2), 10–19.<br>
<em>Khuôn: Tác giả, A. (Năm). Tiêu đề bài. </em>Tên tạp chí, Tập<em>(Số), trang.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Để trình quản lý trích dẫn lo định dạng.</b> Công cụ như Zotero bắt một nguồn bằng một cú nhấp trình duyệt và sinh mục APA/MLA hoàn hảo, rồi giữ đồng bộ khi bạn trích. Định dạng tham chiếu thủ công dễ sai (một chữ nghiêng hay dấu phẩy sai là mất điểm); tự động hoá nó giải phóng bạn để tập trung vào lập luận. Giáo trình dạy luật — người chuyên nghiệp tự động hoá chúng.</div>
<div class="pitfall">APA và MLA là <strong>hai hệ khác nhau</strong> — đừng trộn. APA dùng (Tác giả, Năm); MLA dùng (Tác giả trang). Chọn hệ mà đề yêu cầu và nhất quán xuyên suốt.</div>
</div>`,
        },
        {
          title: 'Quiz 4 — Research & citation|||Quiz 4 — Nghiên cứu & trích dẫn',
          slug: 'enw492c-quiz-4',
          type: 'QUIZ',
          description: 'Kiểm tra câu hỏi nghiên cứu, CRAAP, hedging và APA.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The CRAAP test evaluates a source\'s currency, relevance, authority, accuracy and…|||Phép thử CRAAP đánh giá cập nhật, liên quan, thẩm quyền, chính xác và…', options: ['popularity|||độ phổ biến', 'purpose|||mục đích', 'price|||giá', 'position in Google|||thứ hạng Google'], correctIndex: 1, points: 1 },
              { question: 'Which sentence uses appropriate academic hedging?|||Câu nào dùng hedging học thuật đúng mực?', options: ['Phones destroy sleep.', 'Phones always ruin everyone\'s sleep.', 'Evidence suggests phone use may reduce sleep.', 'Phones have no effect on sleep, ever.'], correctIndex: 2, points: 1 },
              { question: 'A correct APA in-text citation looks like…|||Một trích dẫn trong bài APA đúng trông như…', options: ['(Lee 2021 page 14)', '(Lee, 2021)', '[Lee-2021]', 'Lee, Journal of Sleep'], correctIndex: 1, points: 1 },
              { question: 'For a key factual claim, the strongest source type is…|||Cho một luận điểm sự thật cốt lõi, loại nguồn mạnh nhất là…', options: ['a vendor marketing blog|||blog tiếp thị của nhà bán', 'the first Google result|||kết quả Google đầu tiên', 'a peer-reviewed study|||một nghiên cứu bình duyệt', 'an anonymous forum post|||một bài diễn đàn ẩn danh'], correctIndex: 2, points: 1 },
              { question: 'A dataset or original experiment is a… source. (beyond-syllabus)|||Một bộ dữ liệu hay thí nghiệm gốc là nguồn… (ngoài giáo trình)', options: ['secondary|||thứ cấp', 'primary|||sơ cấp', 'tertiary|||cấp ba', 'invalid|||không hợp lệ'], correctIndex: 1, points: 1 },
              { question: 'Mixing APA and MLA styles in one paper…|||Trộn phong cách APA và MLA trong một bài…', options: ['is fine if you cite everything|||ổn nếu trích dẫn mọi thứ', 'is an inconsistency that loses marks|||là sự thiếu nhất quán làm mất điểm', 'is required|||bắt buộc', 'improves clarity|||tăng độ rõ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — MOOC 5: CAPSTONE RESEARCH PAPER ══════════════════ */
    {
      title: 'Chapter 5 — MOOC 5: The capstone research paper|||Chương 5 — MOOC 5: Bài nghiên cứu capstone',
      description: 'Thư mục chú giải, bản nháp đầu, chỉnh sửa & viết lại, và bản cuối — quy trình viết một bài nghiên cứu trọn vẹn.',
      lessons: [
        {
          title: '5.1 — Annotated bibliography & the first draft|||5.1 — Thư mục chú giải & bản nháp đầu',
          slug: 'enw492c-5-1-annotated-bib-draft',
          type: 'VIDEO',
          description: 'Viết thư mục chú giải, dựng dàn ý nghiên cứu, và tạo bản nháp đầu không sợ dở.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Annotated bibliography &amp; the first draft</h2>
<p class="lead">The capstone is a real research paper built in stages. The annotated bibliography is the foundation — it forces you to read and judge sources before you argue.</p>
<h3>What an annotation contains</h3>
<p>For each source: a full citation, then 3–5 sentences that <strong>summarise</strong>, <strong>evaluate</strong> (credibility, bias), and state <strong>relevance</strong> to your question.</p>
<div class="out"><b>Example annotation:</b><br>
Lee, J. (2021). Smartphones and adolescent sleep. <em>Journal of Sleep Research, 30</em>(2), 10–19.<br>
&nbsp;&nbsp;This peer-reviewed study of 400 teenagers measured sleep before and after disabling night notifications, finding a 42-minute average gain. It is recent and methodologically sound, though limited to one city. It provides my strongest quantitative evidence for the claim that notification design affects sleep.</div>
<h3>The first draft — permission to be imperfect</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Outline</b><span>thesis + topic sentences from your annotations</span></div>
  <div class="lz-step"><b>Draft fast</b><span>write body first, intro last, do not edit yet</span></div>
  <div class="lz-step"><b>Cite as you go</b><span>drop (Author, Year) in immediately — never "add later"</span></div>
</div>
<div class="callout ok">Write the introduction <strong>last</strong>. You cannot introduce an argument you have not yet made. Draft the body, discover what you actually argued, then write an intro that promises exactly that.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The annotated bibliography is a thinking tool, not busywork.</b> When you write "this source is limited to one city" you are already doing the critical evaluation your body paragraphs need. Students who write real annotations find their paper half-argued before drafting; students who copy abstracts start from zero. Treat annotations as pre-writing.</div>
<div class="pitfall">Do not "cite later". Every fact you type without an immediate (Author, Year) is a future hunt through 15 tabs — and the source you cannot re-find becomes accidental plagiarism.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Thư mục chú giải &amp; bản nháp đầu</h2>
<p class="lead">Capstone là một bài nghiên cứu thật, dựng theo từng giai đoạn. Thư mục chú giải là nền móng — nó ép bạn đọc và phán xét nguồn trước khi lập luận.</p>
<h3>Một chú giải chứa gì</h3>
<p>Với mỗi nguồn: một trích dẫn đầy đủ, rồi 3–5 câu <strong>tóm tắt</strong>, <strong>đánh giá</strong> (độ tin, thiên lệch), và nêu <strong>độ liên quan</strong> tới câu hỏi của bạn.</p>
<div class="out"><b>Ví dụ chú giải:</b><br>
Lee, J. (2021). Smartphones and adolescent sleep. <em>Journal of Sleep Research, 30</em>(2), 10–19.<br>
&nbsp;&nbsp;Nghiên cứu bình duyệt trên 400 thiếu niên này đo giấc ngủ trước và sau khi tắt thông báo đêm, thấy tăng trung bình 42 phút. Nó mới và vững về phương pháp, dù chỉ giới hạn một thành phố. Nó cung cấp bằng chứng định lượng mạnh nhất cho luận điểm rằng thiết kế thông báo ảnh hưởng giấc ngủ.</div>
<h3>Bản nháp đầu — được phép chưa hoàn hảo</h3>
<div class="lz-flow">
  <div class="lz-step"><b>Dàn ý</b><span>luận đề + câu chủ đề từ các chú giải</span></div>
  <div class="lz-step"><b>Nháp nhanh</b><span>viết thân trước, mở bài sau cùng, chưa sửa vội</span></div>
  <div class="lz-step"><b>Trích dẫn ngay</b><span>chèn (Tác giả, Năm) tức thì — đừng "để sau"</span></div>
</div>
<div class="callout ok">Viết mở bài <strong>sau cùng</strong>. Bạn không thể giới thiệu một lập luận chưa tạo ra. Nháp phần thân, khám phá bạn thực sự đã lập luận gì, rồi viết mở bài hứa đúng điều đó.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thư mục chú giải là công cụ tư duy, không phải việc vặt.</b> Khi bạn viết "nguồn này giới hạn một thành phố" là bạn đã làm phần đánh giá phản biện mà các đoạn thân cần. Sinh viên viết chú giải thật thấy bài đã lập luận nửa chừng trước khi nháp; sinh viên chép abstract bắt đầu từ số không. Hãy coi chú giải là bước tiền-viết.</div>
<div class="pitfall">Đừng "trích dẫn sau". Mỗi sự thật bạn gõ mà không có (Tác giả, Năm) ngay là một cuộc truy tìm tương lai qua 15 tab — và nguồn bạn không tìm lại được thành đạo văn vô tình.</div>
</div>`,
        },
        {
          title: '5.2 — Revising, rewriting & the final paper|||5.2 — Chỉnh sửa, viết lại & bài cuối',
          slug: 'enw492c-5-2-revise-final',
          type: 'VIDEO',
          description: 'Phân biệt revise vs edit, dùng dàn ý ngược, và checklist bản cuối.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Revising vs editing — two different jobs</h2>
<p class="lead">Weak writers "edit" (fix commas) and call it revising. Real revision reshapes ideas and structure first; polishing words comes last.</p>
<table>
  <thead><tr><th>Stage</th><th>Focus</th><th>Question</th></tr></thead>
  <tbody>
    <tr><td>Revise (big)</td><td>Thesis, structure, evidence, logic</td><td>"Does each paragraph earn its place and prove the thesis?"</td></tr>
    <tr><td>Edit (medium)</td><td>Sentences, transitions, word choice</td><td>"Is every sentence clear and connected?"</td></tr>
    <tr><td>Proofread (small)</td><td>Grammar, spelling, citation format</td><td>"Any typos, comma splices, wrong italics?"</td></tr>
  </tbody>
</table>
<h3>The reverse-outline revision (worked)</h3>
<div class="out"><b>Step 1:</b> Summarise each paragraph in one margin sentence.<br>
<b>Step 2:</b> Read ONLY those sentences in order.<br>
<b>Result:</b> If ¶3 and ¶5 say almost the same thing → merge them. If the argument jumps from "sleep" to "grades" with no bridge → add a linking paragraph. You just fixed structure without rereading 1,000 words.</div>
<h3>Final-paper checklist</h3>
<div class="callout ok"><b>Before you submit:</b> ✓ Arguable thesis at end of intro · ✓ One idea per paragraph with a topic sentence · ✓ Every claim has evidence + analysis · ✓ Every source cited in-text AND in the reference list · ✓ Counterargument addressed · ✓ Consistent APA/MLA · ✓ Read aloud once for grammar &amp; flow · ✓ Word count met.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Read your draft aloud — your ear catches what your eye skips.</b> Silent reading auto-corrects errors in your head; reading aloud forces you to hit every run-on sentence, every missing word, every clumsy transition. Professional editors swear by it. It is the cheapest quality tool you own and the syllabus never mentions it.</div>
<div class="pitfall">Submitting your <strong>first draft as the final</strong> is the classic capstone mistake. The MOOC grades the <em>revision</em> — the gap between rough and final is where most of the marks live.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Chỉnh sửa vs biên tập — hai công việc khác nhau</h2>
<p class="lead">Người viết yếu "biên tập" (sửa dấu phẩy) và gọi đó là chỉnh sửa. Chỉnh sửa thật nắn lại ý và cấu trúc trước; đánh bóng câu chữ đến sau cùng.</p>
<table>
  <thead><tr><th>Giai đoạn</th><th>Tập trung</th><th>Câu hỏi</th></tr></thead>
  <tbody>
    <tr><td>Revise (lớn)</td><td>Luận đề, cấu trúc, bằng chứng, logic</td><td>"Mỗi đoạn có xứng đáng và chứng minh luận đề không?"</td></tr>
    <tr><td>Edit (vừa)</td><td>Câu, chuyển ý, chọn từ</td><td>"Mỗi câu rõ và liền mạch không?"</td></tr>
    <tr><td>Proofread (nhỏ)</td><td>Ngữ pháp, chính tả, định dạng trích dẫn</td><td>"Có lỗi gõ, comma splice, chữ nghiêng sai không?"</td></tr>
  </tbody>
</table>
<h3>Chỉnh sửa bằng dàn ý ngược (có lời giải)</h3>
<div class="out"><b>Bước 1:</b> Tóm mỗi đoạn bằng một câu ở lề.<br>
<b>Bước 2:</b> Đọc CHỈ những câu đó theo thứ tự.<br>
<b>Kết quả:</b> Nếu ¶3 và ¶5 nói gần như y hệt → gộp lại. Nếu lập luận nhảy từ "giấc ngủ" sang "điểm số" không cầu nối → thêm đoạn liên kết. Bạn vừa sửa cấu trúc mà không đọc lại 1.000 từ.</div>
<h3>Checklist bài cuối</h3>
<div class="callout ok"><b>Trước khi nộp:</b> ✓ Luận đề tranh luận được ở cuối mở bài · ✓ Một ý mỗi đoạn có câu chủ đề · ✓ Mọi luận điểm có bằng chứng + phân tích · ✓ Mọi nguồn trích trong bài VÀ trong danh sách tài liệu · ✓ Đã xử lý phản biện · ✓ APA/MLA nhất quán · ✓ Đọc to một lần để soát ngữ pháp &amp; mạch · ✓ Đủ số từ.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đọc to bản nháp — tai bắt được điều mắt bỏ qua.</b> Đọc thầm tự sửa lỗi trong đầu; đọc to ép bạn vấp mọi câu dính, mọi từ thiếu, mọi chuyển ý vụng. Biên tập viên chuyên nghiệp thề bằng cách này. Đây là công cụ chất lượng rẻ nhất bạn có và giáo trình chẳng bao giờ nhắc.</div>
<div class="pitfall">Nộp <strong>bản nháp đầu làm bài cuối</strong> là sai lầm kinh điển của capstone. MOOC chấm phần <em>chỉnh sửa</em> — khoảng cách giữa nháp thô và bài cuối là nơi chứa phần lớn điểm.</div>
</div>`,
        },
        {
          title: 'Capstone — the research-paper checklist|||Capstone — checklist bài nghiên cứu',
          slug: 'enw492c-capstone-checklist',
          type: 'VIDEO',
          description: 'Danh sách kiểm hoàn chỉnh cho toàn bộ bài nghiên cứu capstone theo từng mốc MOOC 5.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Milestone</span>
<h2>Capstone milestone checklist</h2>
<p class="lead">MOOC 5 delivers your paper in staged submissions. Use this as a gate before each submission — do not advance a stage that fails its checks.</p>
<h3>Stage gates</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Topic + research question</div><div class="lz-nsub">Passes the 6-test rubric · arguable · narrow · researchable</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Annotated bibliography</div><div class="lz-nsub">≥5 credible sources · each summarised, evaluated, relevance stated · APA formatted</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Outline + thesis</div><div class="lz-nsub">One-sentence arguable thesis · one topic sentence per body paragraph</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">First / rough draft</div><div class="lz-nsub">Body complete · every claim cited in-text · counterargument included</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Revise &amp; rewrite</div><div class="lz-nsub">Reverse-outline pass · structure fixed · read aloud · grammar clean</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Final paper</div><div class="lz-nsub">Full checklist passed · reference list complete · word count met</div></div></div>
</div>
<div class="callout ok">Peer review is part of MOOC 5. When you review a classmate, use the same checklist — and apply their feedback honestly. The habit of receiving and acting on critique is exactly what the workplace demands.</div>
<div class="pitfall">Do not skip the peer-review step to "save time". Reviewing others sharpens your eye for the same flaws in your own draft, and the feedback you receive is free improvement you cannot get alone.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Mốc</span>
<h2>Checklist mốc capstone</h2>
<p class="lead">MOOC 5 giao bài của bạn qua các lần nộp theo giai đoạn. Dùng cái này như một cổng trước mỗi lần nộp — đừng vượt một giai đoạn còn trượt kiểm.</p>
<h3>Cổng từng giai đoạn</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Đề tài + câu hỏi nghiên cứu</div><div class="lz-nsub">Qua rubric 6 phép thử · tranh luận được · hẹp · nghiên cứu được</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Thư mục chú giải</div><div class="lz-nsub">≥5 nguồn đáng tin · mỗi cái tóm, đánh giá, nêu liên quan · định dạng APA</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Dàn ý + luận đề</div><div class="lz-nsub">Luận đề một câu tranh luận được · một câu chủ đề mỗi đoạn thân</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Nháp đầu / nháp thô</div><div class="lz-nsub">Thân hoàn chỉnh · mọi luận điểm trích trong bài · có phản biện</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Chỉnh sửa &amp; viết lại</div><div class="lz-nsub">Lượt dàn ý ngược · sửa cấu trúc · đọc to · ngữ pháp sạch</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Bài cuối</div><div class="lz-nsub">Qua trọn checklist · danh sách tài liệu đầy đủ · đủ số từ</div></div></div>
</div>
<div class="callout ok">Bình duyệt bạn học (peer review) là một phần của MOOC 5. Khi review bạn cùng lớp, dùng chính checklist này — và áp dụng phản hồi của họ một cách trung thực. Thói quen nhận và hành động theo góp ý chính là điều nơi làm việc đòi hỏi.</div>
<div class="pitfall">Đừng bỏ bước bình duyệt để "tiết kiệm thời gian". Review người khác mài sắc con mắt bắt cùng lỗi trong nháp của chính bạn, và phản hồi bạn nhận là cải thiện miễn phí bạn không thể tự có.</div>
</div>`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — EXAM & DEFENSE PREP (SWP-style survival) ══════════════════ */
    {
      title: 'Chapter 6 — Final exam prep & question bank|||Chương 6 — Ôn thi cuối kỳ & ngân hàng câu hỏi',
      description: 'Định dạng thi PE, chiến lược viết dưới thời gian, và ngân hàng câu hỏi ôn theo CLO — kiểu SWP391.',
      lessons: [
        {
          title: '6.1 — The final exam format, timed writing & CLO question bank|||6.1 — Định dạng thi, viết tính giờ & ngân hàng câu hỏi theo CLO',
          slug: 'enw492c-6-1-exam-question-bank',
          type: 'VIDEO',
          description: 'Cấu trúc bài thi PE, phân bổ thời gian ~100 phút, và ngân hàng câu hỏi ôn tập theo 5 CLO.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>The final exam (PE, 100%) — format &amp; strategy</h2>
<p class="lead">The PE is a ~100-minute on-campus written exam with three parts: multiple-choice, short answers, and a timed writing task. Knowing the shape lets you budget time and avoid the classic "ran out of time on the essay" failure.</p>
<h3>Suggested time budget (~100 minutes)</h3>
<table>
  <thead><tr><th>Part</th><th>Tests</th><th>Time</th></tr></thead>
  <tbody>
    <tr><td>MCQ (5–10)</td><td>Grammar, citation rules, essay concepts (CLO1–4)</td><td>~15 min</td></tr>
    <tr><td>Short answers</td><td>Define/apply: thesis, paraphrase, CRAAP, plagiarism</td><td>~25 min</td></tr>
    <tr><td>Writing task</td><td>Produce a structured mini-essay from a prompt (CLO2–5)</td><td>~55 min (5 plan · 40 write · 10 revise)</td></tr>
  </tbody>
</table>
<div class="callout ok">Always spend the first 5 minutes of the writing task on a bullet outline (thesis + topic sentences). It feels slow but it is the single biggest predictor of a coherent essay — and it saves you from rambling.</div>
<h3>Question bank — practise by CLO</h3>
<p><b>CLO1 (grammar):</b></p>
<ul>
  <li>Correct the comma splice: "Phones distract students, they should be banned in class."</li>
  <li>Rewrite for parallel structure: "The app is fast, reliable, and it saves money."</li>
  <li>Choose the correct tense: "Lee (2021) ___ that sleep decreased." (found / finds / will find)</li>
</ul>
<p><b>CLO2 (thesis &amp; essay):</b></p>
<ul>
  <li>Turn this topic into an arguable thesis with a preview of two reasons: "remote work".</li>
  <li>Outline a point-by-point compare/contrast essay on "e-books vs printed books".</li>
</ul>
<p><b>CLO3 (argument &amp; integrity):</b></p>
<ul>
  <li>Add a warrant to this claim+evidence pair (claim: schools should teach typing; evidence: 80% of jobs require it).</li>
  <li>Rewrite this patchwritten sentence as a real paraphrase with a citation.</li>
  <li>Identify the fallacy: "My opponent has never run a company, so his economic plan is worthless."</li>
</ul>
<p><b>CLO4 (research &amp; citation):</b></p>
<ul>
  <li>Apply CRAAP to a 2014 anonymous blog that sells a product.</li>
  <li>Write a correct APA in-text citation and reference entry for a given journal article.</li>
  <li>Add hedging to overclaim: "Video games cause violence."</li>
</ul>
<p><b>CLO5 (research paper):</b></p>
<ul>
  <li>Write a 3–5 sentence annotation (summary + evaluation + relevance) for a source.</li>
  <li>Explain the difference between revising and editing, with one example of each.</li>
</ul>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "answer the verb" exam habit.</b> Before writing, circle the task verb in the prompt (compare, argue, evaluate, summarise) and write it at the top of your answer. Students lose whole bands by writing a description when the prompt said "argue". Matching your structure to the verb is worth more than fancy vocabulary — and no syllabus states it outright.</div>
<div class="pitfall">Do not spend 40 minutes perfecting the MCQ and short answers and leave 20 for the essay. The writing task carries the most weight and the most risk — protect its time first.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Thi cuối kỳ (PE, 100%) — định dạng &amp; chiến lược</h2>
<p class="lead">PE là bài thi viết tại campus ~100 phút gồm ba phần: trắc nghiệm, trả lời ngắn, và một bài viết tính giờ. Biết hình dạng giúp bạn phân bổ thời gian và tránh kiểu rớt kinh điển "hết giờ ở phần viết".</p>
<h3>Gợi ý phân bổ thời gian (~100 phút)</h3>
<table>
  <thead><tr><th>Phần</th><th>Kiểm tra</th><th>Thời gian</th></tr></thead>
  <tbody>
    <tr><td>Trắc nghiệm (5–10)</td><td>Ngữ pháp, luật trích dẫn, khái niệm luận (CLO1–4)</td><td>~15 phút</td></tr>
    <tr><td>Trả lời ngắn</td><td>Định nghĩa/áp dụng: luận đề, diễn giải, CRAAP, đạo văn</td><td>~25 phút</td></tr>
    <tr><td>Bài viết</td><td>Tạo một bài luận nhỏ có cấu trúc từ đề (CLO2–5)</td><td>~55 phút (5 dàn ý · 40 viết · 10 chỉnh)</td></tr>
  </tbody>
</table>
<div class="callout ok">Luôn dành 5 phút đầu của phần viết cho một dàn ý gạch đầu dòng (luận đề + câu chủ đề). Cảm giác chậm nhưng nó là chỉ dấu lớn nhất của một bài mạch lạc — và cứu bạn khỏi lan man.</div>
<h3>Ngân hàng câu hỏi — luyện theo CLO</h3>
<p><b>CLO1 (ngữ pháp):</b></p>
<ul>
  <li>Sửa comma splice: "Phones distract students, they should be banned in class."</li>
  <li>Viết lại cho song song: "The app is fast, reliable, and it saves money."</li>
  <li>Chọn thì đúng: "Lee (2021) ___ that sleep decreased." (found / finds / will find)</li>
</ul>
<p><b>CLO2 (luận đề &amp; bài luận):</b></p>
<ul>
  <li>Biến chủ đề này thành luận đề tranh luận được có hé lộ hai lý do: "remote work".</li>
  <li>Lập dàn ý một bài so sánh điểm-theo-điểm về "e-books vs printed books".</li>
</ul>
<p><b>CLO3 (lập luận &amp; liêm chính):</b></p>
<ul>
  <li>Thêm warrant cho cặp claim+evidence (claim: trường nên dạy đánh máy; evidence: 80% việc yêu cầu).</li>
  <li>Viết lại câu chắp vá này thành diễn giải thật có trích dẫn.</li>
  <li>Chỉ ra nguỵ biện: "My opponent has never run a company, so his economic plan is worthless."</li>
</ul>
<p><b>CLO4 (nghiên cứu &amp; trích dẫn):</b></p>
<ul>
  <li>Áp CRAAP cho một blog ẩn danh 2014 bán sản phẩm.</li>
  <li>Viết trích dẫn trong bài APA đúng và mục tham chiếu cho một bài tạp chí cho sẵn.</li>
  <li>Thêm hedging cho câu nói quá: "Video games cause violence."</li>
</ul>
<p><b>CLO5 (bài nghiên cứu):</b></p>
<ul>
  <li>Viết một chú giải 3–5 câu (tóm + đánh giá + liên quan) cho một nguồn.</li>
  <li>Giải thích khác biệt giữa revise và edit, mỗi cái một ví dụ.</li>
</ul>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thói quen thi "trả lời đúng động từ".</b> Trước khi viết, khoanh động từ nhiệm vụ trong đề (compare, argue, evaluate, summarise) và viết nó lên đầu bài. Sinh viên mất cả bậc điểm vì viết mô tả khi đề nói "argue". Khớp cấu trúc với động từ đáng giá hơn từ vựng hoa mỹ — và không giáo trình nào nói thẳng.</div>
<div class="pitfall">Đừng dành 40 phút hoàn thiện trắc nghiệm và trả lời ngắn rồi để 20 phút cho phần viết. Bài viết mang trọng số cao nhất và rủi ro cao nhất — bảo vệ thời gian của nó trước tiên.</div>
</div>`,
        },
        {
          title: 'Quiz 6 — Exam readiness|||Quiz 6 — Sẵn sàng thi',
          slug: 'enw492c-quiz-6',
          type: 'QUIZ',
          description: 'Kiểm tra chiến lược thi, phân bổ thời gian và áp dụng khái niệm.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'In the ~100-minute exam, the part that deserves the MOST time is…|||Trong bài thi ~100 phút, phần đáng dành NHIỀU thời gian nhất là…', options: ['the MCQ|||trắc nghiệm', 'the short answers|||trả lời ngắn', 'the writing task|||phần viết', 'checking your name|||kiểm tên'], correctIndex: 2, points: 1 },
              { question: 'The first thing to do in a timed writing task is…|||Việc đầu tiên trong phần viết tính giờ là…', options: ['write the conclusion|||viết kết bài', 'make a bullet outline (thesis + topic sentences)|||lập dàn ý (luận đề + câu chủ đề)', 'count words|||đếm từ', 'copy the prompt|||chép lại đề'], correctIndex: 1, points: 1 },
              { question: 'If the prompt verb is "argue" but you write a description, you…|||Nếu động từ đề là "argue" mà bạn viết mô tả, bạn…', options: ['still get full marks|||vẫn đủ điểm', 'lose marks for not answering the task|||mất điểm vì không trả lời nhiệm vụ', 'get bonus points|||được điểm thưởng', 'pass automatically|||đậu mặc định'], correctIndex: 1, points: 1 },
              { question: '"My opponent never ran a company, so his plan is worthless" is which fallacy?|||"My opponent never ran a company, so his plan is worthless" là nguỵ biện nào?', options: ['ad hominem', 'straw man', 'false dilemma', 'hasty generalisation'], correctIndex: 0, points: 1 },
              { question: 'To be allowed to sit the PE at all, you must first…|||Để được vào thi PE, trước hết bạn phải…', options: ['submit one essay|||nộp một bài luận', 'complete all five MOOCs with certification|||hoàn thành cả năm MOOC có chứng chỉ', 'pay a fee|||đóng phí', 'attend one offline slot only|||chỉ dự một buổi offline'], correctIndex: 1, points: 1 },
              { question: 'The best last step before submitting any writing is to… (beyond-syllabus)|||Bước cuối tốt nhất trước khi nộp bài viết là… (ngoài giáo trình)', options: ['add more words|||thêm từ', 'read it aloud to catch errors the eye skips|||đọc to để bắt lỗi mắt bỏ qua', 'delete the thesis|||xoá luận đề', 'change the font|||đổi phông chữ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 (NÂNG CAO ★) — STYLE & ETHICAL AI ══════════════════ */
    {
      title: 'Chapter 7 (Advanced) — Style, cohesion & ethical AI writing|||Chương 7 (Nâng cao) — Văn phong, mạch lạc & viết với AI có đạo đức',
      description: 'Ngoài giáo trình: văn phong học thuật, mạch lạc & liên kết, và dùng GenAI có đạo đức như trợ lý viết.',
      lessons: [
        {
          title: '7.1 — Academic register, cohesion & style|||7.1 — Văn phong học thuật, mạch lạc & phong cách',
          slug: 'enw492c-7-1-register-cohesion',
          type: 'VIDEO',
          description: 'Nâng bài từ "đúng" lên "hay": register, cohesion (given-new), nominalisation, và sự súc tích.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1 · ★ Beyond the syllabus</span>
<h2>From correct to elegant: register, cohesion &amp; concision</h2>
<p class="lead">Passing needs correct writing; a high grade needs writing that flows. These four moves are what separate a 7 from a 9 — and none are in the core syllabus.</p>
<h3>1 · Academic register</h3>
<p>Avoid contractions ("don't" → "do not"), slang, and vague intensifiers ("really big" → "substantial"). Prefer precise, neutral vocabulary.</p>
<h3>2 · Cohesion — the given-new principle</h3>
<p>Start each sentence with information the reader already has (given), and end with the new point. This chaining makes paragraphs feel seamless.</p>
<div class="out"><b>Choppy:</b> "Notifications reduce sleep. Memory depends on sleep. Grades depend on memory."<br>
<b>Cohesive (given→new):</b> "Notifications reduce sleep, and <b>that lost sleep</b> weakens memory; <b>weaker memory</b>, in turn, lowers grades."<br>
<em>Each new sentence begins with the previous sentence's endpoint — the reader is carried along.</em></div>
<h3>3 · Nominalisation (used sparingly)</h3>
<p>Turning a verb into a noun can tighten academic prose: "when we decide" → "the decision". Useful, but overuse makes writing lifeless — balance it.</p>
<h3>4 · Concision</h3>
<div class="out"><b>Wordy:</b> "Due to the fact that the study was small in terms of its size, the results are not able to be generalised."<br>
<b>Concise:</b> "Because the study was small, its results cannot be generalised." — <em>18 words → 10, meaning intact.</em></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Cut "there is / there are" openers.</b> "There are many students who struggle" → "Many students struggle." Sentences that start with an empty "there is" bury the real subject. Hunting and removing them instantly makes prose more direct — a professional editing habit.</div>
<div class="pitfall">Do not confuse "sounding academic" with "using long words". Overwrought vocabulary and endless nominalisation obscure meaning. Clarity always beats ornament; examiners reward the clearer of two correct essays.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1 · ★ Ngoài giáo trình</span>
<h2>Từ đúng đến thanh thoát: register, mạch lạc &amp; súc tích</h2>
<p class="lead">Đậu cần viết đúng; điểm cao cần viết trôi chảy. Bốn nước cờ này tách một điểm 7 khỏi điểm 9 — và không cái nào nằm trong giáo trình lõi.</p>
<h3>1 · Văn phong học thuật (register)</h3>
<p>Tránh viết tắt ("don't" → "do not"), tiếng lóng, và từ nhấn mơ hồ ("really big" → "substantial"). Ưu tiên từ vựng chính xác, trung tính.</p>
<h3>2 · Mạch lạc — nguyên tắc given-new</h3>
<p>Mở mỗi câu bằng thông tin người đọc đã có (given), và kết bằng ý mới (new). Cách xâu chuỗi này làm đoạn văn liền mạch.</p>
<div class="out"><b>Rời rạc:</b> "Notifications reduce sleep. Memory depends on sleep. Grades depend on memory."<br>
<b>Mạch lạc (given→new):</b> "Notifications reduce sleep, and <b>that lost sleep</b> weakens memory; <b>weaker memory</b>, in turn, lowers grades."<br>
<em>Mỗi câu mới bắt đầu bằng điểm kết của câu trước — người đọc được dắt đi.</em></div>
<h3>3 · Danh hoá (dùng vừa phải)</h3>
<p>Biến động từ thành danh từ có thể làm chặt văn học thuật: "when we decide" → "the decision". Hữu ích, nhưng lạm dụng làm văn vô hồn — cân bằng nó.</p>
<h3>4 · Súc tích</h3>
<div class="out"><b>Dài dòng:</b> "Due to the fact that the study was small in terms of its size, the results are not able to be generalised."<br>
<b>Súc tích:</b> "Because the study was small, its results cannot be generalised." — <em>18 từ → 10, nghĩa nguyên vẹn.</em></div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Cắt mở đầu "there is / there are".</b> "There are many students who struggle" → "Many students struggle." Câu mở bằng "there is" rỗng chôn mất chủ ngữ thật. Săn và bỏ chúng lập tức làm văn trực tiếp hơn — một thói quen biên tập chuyên nghiệp.</div>
<div class="pitfall">Đừng nhầm "nghe học thuật" với "dùng từ dài". Từ vựng cầu kỳ và danh hoá vô tận che mờ nghĩa. Rõ ràng luôn thắng trang trí; giám khảo thưởng bài rõ hơn trong hai bài cùng đúng.</div>
</div>`,
        },
        {
          title: '7.2 — Using GenAI ethically as a writing assistant|||7.2 — Dùng GenAI có đạo đức như trợ lý viết',
          slug: 'enw492c-7-2-ethical-ai',
          type: 'VIDEO',
          description: 'Ranh giới dùng AI hỗ trợ viết mà không đạo văn hay mất kỹ năng: brainstorm, feedback, verify.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2 · ★ Beyond the syllabus</span>
<h2>GenAI as a writing assistant — the ethical line</h2>
<p class="lead">AI writing tools are now everywhere. Used well, they are a tutor available 24/7; used badly, they are plagiarism and skill-atrophy. The line is about who does the <em>thinking</em>.</p>
<h3>Green zone — AI helps you think</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Brainstorm</b> — "give me 10 angles on this topic" then <em>you</em> pick and develop one.</div>
  <div class="lz-layer"><b>Feedback</b> — "point out weak transitions in my draft" then <em>you</em> rewrite them.</div>
  <div class="lz-layer"><b>Explain</b> — "why is this a comma splice?" to learn the rule.</div>
  <div class="lz-layer"><b>Grammar polish</b> — fix surface errors on <em>your own</em> sentences (like Grammarly).</div>
</div>
<h3>Red zone — AI does the thinking (plagiarism)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Generate the essay</b> and submit it as your own — academic misconduct.</div>
  <div class="lz-layer"><b>Fabricated citations</b> — AI invents plausible-looking sources that do not exist.</div>
  <div class="lz-layer"><b>Paraphrase a source with AI</b> and skip the citation — still plagiarism.</div>
</div>
<h3>The verification duty</h3>
<div class="out"><b>Worked example — the hallucinated citation trap:</b> You ask AI for sources on sleep and it returns "Nguyen, T. (2019). Sleep and screens. <em>Nature Neuroscience</em>." It looks perfect. You search Google Scholar — the paper does not exist. <b>Never cite a source you have not opened and read yourself.</b> AI confidently invents references; the responsibility to verify is entirely yours.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Disclose AI use when policy requires it.</b> Many institutions now ask you to state how you used AI (e.g., "used for brainstorming and grammar checks, not for drafting"). Transparent disclosure protects you and builds the professional integrity employers value. When in doubt, ask your instructor about the specific policy — the norms are evolving fast.</div>
<div class="pitfall">Over-relying on AI to write for you means you never build the skill the exam tests. The PE is a <strong>handwritten, on-campus, no-AI</strong> exam — if the tool did your thinking all semester, you will be helpless when it is taken away.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2 · ★ Ngoài giáo trình</span>
<h2>GenAI như trợ lý viết — ranh giới đạo đức</h2>
<p class="lead">Công cụ viết AI giờ ở khắp nơi. Dùng tốt, chúng là gia sư 24/7; dùng dở, chúng là đạo văn và teo kỹ năng. Ranh giới nằm ở việc ai làm phần <em>tư duy</em>.</p>
<h3>Vùng xanh — AI giúp bạn tư duy</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Brainstorm</b> — "cho tôi 10 góc nhìn về đề tài này" rồi <em>bạn</em> chọn và phát triển một.</div>
  <div class="lz-layer"><b>Phản hồi</b> — "chỉ ra chuyển ý yếu trong nháp của tôi" rồi <em>bạn</em> viết lại.</div>
  <div class="lz-layer"><b>Giải thích</b> — "vì sao đây là comma splice?" để học luật.</div>
  <div class="lz-layer"><b>Đánh bóng ngữ pháp</b> — sửa lỗi bề mặt trên câu <em>của chính bạn</em> (như Grammarly).</div>
</div>
<h3>Vùng đỏ — AI làm phần tư duy (đạo văn)</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Sinh nguyên bài luận</b> và nộp như của mình — gian lận học thuật.</div>
  <div class="lz-layer"><b>Trích dẫn bịa</b> — AI dựng nguồn trông hợp lý nhưng không tồn tại.</div>
  <div class="lz-layer"><b>Nhờ AI diễn giải một nguồn</b> và bỏ trích dẫn — vẫn là đạo văn.</div>
</div>
<h3>Nghĩa vụ kiểm chứng</h3>
<div class="out"><b>Ví dụ có lời giải — bẫy trích dẫn ảo giác:</b> Bạn hỏi AI nguồn về giấc ngủ và nó trả về "Nguyen, T. (2019). Sleep and screens. <em>Nature Neuroscience</em>." Trông hoàn hảo. Bạn tìm Google Scholar — bài này không tồn tại. <b>Đừng bao giờ trích một nguồn bạn chưa tự mở và đọc.</b> AI tự tin bịa tham chiếu; trách nhiệm kiểm chứng hoàn toàn là của bạn.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Khai báo việc dùng AI khi chính sách yêu cầu.</b> Nhiều cơ sở nay yêu cầu bạn nêu đã dùng AI thế nào (vd "dùng để brainstorm và soát ngữ pháp, không để soạn bài"). Khai báo minh bạch bảo vệ bạn và xây liêm chính nghề nghiệp mà nhà tuyển dụng coi trọng. Khi phân vân, hỏi giảng viên về chính sách cụ thể — chuẩn mực đang đổi rất nhanh.</div>
<div class="pitfall">Lệ thuộc AI viết hộ nghĩa là bạn không bao giờ xây được kỹ năng mà bài thi kiểm tra. PE là bài thi <strong>viết tay, tại campus, không AI</strong> — nếu công cụ tư duy hộ bạn cả kỳ, bạn sẽ bất lực khi nó bị lấy đi.</div>
</div>`,
        },
        {
          title: 'Quiz 7 — Style & ethical AI|||Quiz 7 — Văn phong & AI có đạo đức',
          slug: 'enw492c-quiz-7',
          type: 'QUIZ',
          description: 'Kiểm tra register, cohesion, concision và ranh giới dùng AI.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The given-new principle says each sentence should…|||Nguyên tắc given-new nói mỗi câu nên…', options: ['start with new information|||bắt đầu bằng thông tin mới', 'start with information the reader already has, end with the new point|||bắt đầu bằng thông tin đã biết, kết bằng ý mới', 'avoid transitions|||tránh chuyển ý', 'be as long as possible|||càng dài càng tốt'], correctIndex: 1, points: 1 },
              { question: 'Which is the more concise version?|||Đâu là bản súc tích hơn?', options: ['Due to the fact that the study was small in size, results cannot be generalised.', 'Because the study was small, its results cannot be generalised.', 'The study, which was small, had results that were not generalisable due to size.', 'There is a smallness to the study that makes results not generalisable.'], correctIndex: 1, points: 1 },
              { question: 'Using AI to brainstorm 10 angles, then developing one yourself, is…|||Dùng AI brainstorm 10 góc nhìn rồi tự phát triển một, là…', options: ['plagiarism|||đạo văn', 'in the ethical green zone|||trong vùng xanh đạo đức', 'always banned|||luôn bị cấm', 'a fabricated citation|||trích dẫn bịa'], correctIndex: 1, points: 1 },
              { question: 'When AI gives you a citation, your duty is to…|||Khi AI đưa bạn một trích dẫn, nghĩa vụ của bạn là…', options: ['cite it immediately|||trích ngay', 'verify the source exists and read it yourself before citing|||kiểm nguồn có thật và tự đọc trước khi trích', 'trust it because AI is accurate|||tin vì AI chính xác', 'change the author name|||đổi tên tác giả'], correctIndex: 1, points: 1 },
              { question: 'In academic register you should replace "don\'t" with…|||Trong văn phong học thuật, thay "don\'t" bằng…', options: ['do not', 'dont', 'do NOT (caps)', 'never'], correctIndex: 0, points: 1 },
              { question: 'Over-relying on AI to draft essays is risky because the final exam is… (beyond-syllabus)|||Lệ thuộc AI soạn luận rủi ro vì bài thi cuối là… (ngoài giáo trình)', options: ['open-book with AI allowed|||mở sách, cho dùng AI', 'a handwritten, on-campus, no-AI exam|||viết tay, tại campus, không AI', 'a group project|||đồ án nhóm', 'multiple choice only|||chỉ trắc nghiệm'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
  ],
};
