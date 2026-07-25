/**
 * ITE302c — IT & Data Ethics (Đạo đức trong CNTT & dữ liệu). Kỳ 5.
 * Môn KHÁI NIỆM (không code). Dựa trên bộ Coursera "Certified Ethical Emerging
 * Technologist" (CertNexus, 5 MOOC) + khoá "Ethics of Artificial Intelligence".
 * Song ngữ EN/VN realtime (khối .ml-en / .ml-vi, tiêu đề EN|||VI).
 * Sơ đồ dùng .lz-map / .lz-flow / .lz-stack (KHÔNG ascii). Ví dụ tình huống thật.
 * Link công cụ/đọc thêm → Exp Hub; link MOOC gốc Coursera (.link-card.dl) trong nội dung.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/ITE302c.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola5', name: 'Kỳ 5', ordinal: 7 },
  course: {
    academyType: 'FPT',
    courseCode: 'ITE302c',
    slug: 'it-and-data-ethics',
    title: 'IT & Data Ethics',
    level: 'INTERMEDIATE',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Ethics of data-driven technology: ethical frameworks, kinds of bias, detecting & mitigating risks (privacy, fairness, transparency), communicating them, and governance — grounded in real cases like COMPAS and Cambridge Analytica.|||Đạo đức công nghệ dữ liệu: các khung đạo đức, kiểu thiên kiến, phát hiện & giảm rủi ro (riêng tư, công bằng, minh bạch), truyền đạt, và quản trị — bám các vụ thật như COMPAS và Cambridge Analytica.',
    description: 'Môn đạo đức CNTT & dữ liệu, dựa trên bộ Coursera "Certified Ethical Emerging Technologist" (CertNexus) và khoá "Ethics of Artificial Intelligence". Học các khung đạo đức kinh điển và cách áp vào công nghệ, nhận diện thiên kiến (con người và thuật toán), phát hiện–giảm thiểu rủi ro đạo đức, truyền đạt với nhiều bên liên quan, và xây dựng quản trị + bộ quy tắc đạo đức cho tổ chức. Không lập trình — học qua khái niệm và tình huống thật.',
    whatYouLearn: 'Áp dụng 4 khung đạo đức (hệ quả luận, nghĩa vụ luận, đức hạnh, khế ước) vào tình huống công nghệ; nhận diện thiên kiến nhận thức và thiên kiến thuật toán; đo và giảm rủi ro về quyền riêng tư, công bằng, minh bạch & khả năng giải thích; truyền đạt rủi ro đạo đức cho nhiều bên và xử lý khủng hoảng; xây dựng quản trị AI, bộ quy tắc đạo đức (ACM/IEEE) và tuân thủ GDPR.',
    requirements: 'Không có môn tiên quyết (Pre-Requisite: None). Cần tài khoản Coursera (đăng ký qua lớp) và máy tính có Internet để học các MOOC. Phải lấy đủ chứng chỉ CertNexus + Ethics of AI mới được dự thi.',
    documentsNote: 'Bộ MOOC Coursera CertNexus "Certified Ethical Emerging Technologist" (5 khoá: Promote / Frameworks in Action / Detect & Mitigate / Communicate / Lead) + khoá "Ethics of Artificial Intelligence" + "Preparing for Your CertNexus Certification Exam". Kèm file syllabus gốc ITE302c.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học ra sao, điều kiện qua môn, chuẩn đầu ra và tài liệu.',
      lessons: [
        {
          title: '0.1 — About ITE302c & Course Map|||0.1 — Giới thiệu môn ITE302c & bản đồ môn học',
          slug: 'ite302c-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Môn học này là gì, vì sao mọi kỹ sư phần mềm phải học, và bản đồ toàn bộ hành trình.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About ITE302c — IT &amp; Data Ethics</h2>
<p class="lead">Every system you build makes decisions <em>about people</em> — who gets a loan, whose CV is read, what news someone sees. ITE302c is where you learn to answer the question code alone can't: not "does it work?" but <strong>"should we do it, and is it fair?"</strong> This is a <strong>concept</strong> course — no programming — taught through frameworks and real cases.</p>
<p>The subject is built on the CertNexus <strong>Certified Ethical Emerging Technologist</strong> path plus <strong>Ethics of Artificial Intelligence</strong>. Organisations and governments now hire ethics specialists to reduce risk and guide responsible technology — the exact skill set this course certifies.</p>
<h3>By the end of this course you will be able to</h3>
<ul>
  <li>Apply the four classic <strong>ethical frameworks</strong> to a real technology dilemma and defend your reasoning.</li>
  <li>Spot <strong>bias</strong> — both the human kind (confirmation, automation) and the algorithmic kind (COMPAS, biased hiring).</li>
  <li>Detect and <strong>mitigate ethical risks</strong>: privacy, fairness, transparency, accountability, safety.</li>
  <li><strong>Communicate</strong> ethical risk to executives, engineers and the public — including during a crisis.</li>
  <li>Build <strong>governance</strong>: a code of ethics, org policy, and compliance (GDPR, AI regulation).</li>
</ul>
<h3>Course map — from principles to practice</h3>
<p>The whole specialization is grouped into the roadmap below. Each stage builds on the one before, so study in order:</p>
<div class="lz-map">
  <div class="lz-stage">Foundations</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Ethical Frameworks</div><div class="lz-nsub">Consequentialism · deontology · virtue · contract — applied to tech</div></div></div>
  <div class="lz-stage">Seeing the problem</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Types of Bias</div><div class="lz-nsub">Cognitive &amp; algorithmic bias · COMPAS, Amazon hiring</div></div></div>
  <div class="lz-stage">Reducing the harm</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Detect &amp; Mitigate Risks</div><div class="lz-nsub">Privacy · fairness metrics · transparency &amp; explainability</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Communicating about Ethics</div><div class="lz-nsub">Diverse stakeholders · crisis &amp; media</div></div></div>
  <div class="lz-stage">Institutionalising it</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Governance &amp; Code of Ethics</div><div class="lz-nsub">ACM/IEEE codes · GDPR · AI governance</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Modern AI ethics · landmark case studies</div><div class="lz-nsub">Generative-AI harms, deepfakes · Cambridge Analytica, Therac-25, Dieselgate</div></div></div>
</div>
<div class="callout ok">The most effective way to study this course: for every framework and rule, <strong>argue a real case out loud</strong> — pick a side, then argue the other side. Ethics is a reasoning skill, not a set of facts to memorise; the 60-question exam rewards students who can <em>apply</em> a principle, not just recite it.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fit-and-data-ethics%2Flearn&reflabel=ITE302c" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Study notes, tools &amp; further reading</span><span class="lc-sub">Curated ethics resources, checklists and case links on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu môn ITE302c — Đạo đức CNTT &amp; dữ liệu</h2>
<p class="lead">Mọi hệ thống bạn xây đều ra quyết định <em>về con người</em> — ai được vay, CV của ai được đọc, ai thấy tin gì. ITE302c là nơi bạn học trả lời câu hỏi mà chỉ code không trả lời được: không phải "nó có chạy không?" mà <strong>"có nên làm không, và có công bằng không?"</strong> Đây là môn <strong>khái niệm</strong> — không lập trình — dạy qua các khung tư duy và tình huống thật.</p>
<p>Môn được xây trên lộ trình CertNexus <strong>Certified Ethical Emerging Technologist</strong> cộng với <strong>Ethics of Artificial Intelligence</strong>. Các tổ chức và chính phủ nay thuê chuyên gia đạo đức để giảm rủi ro và dẫn dắt công nghệ có trách nhiệm — đúng bộ kỹ năng môn này cấp chứng chỉ.</p>
<h3>Học xong môn này bạn sẽ làm được</h3>
<ul>
  <li>Áp <strong>bốn khung đạo đức</strong> kinh điển vào một thế lưỡng nan công nghệ thật và bảo vệ được lập luận.</li>
  <li>Nhận diện <strong>thiên kiến</strong> — cả kiểu con người (thiên kiến xác nhận, thiên kiến tự động hoá) lẫn kiểu thuật toán (COMPAS, tuyển dụng thiên lệch).</li>
  <li>Phát hiện và <strong>giảm thiểu rủi ro đạo đức</strong>: quyền riêng tư, công bằng, minh bạch, trách nhiệm giải trình, an toàn.</li>
  <li><strong>Truyền đạt</strong> rủi ro đạo đức cho lãnh đạo, kỹ sư và công chúng — kể cả trong khủng hoảng.</li>
  <li>Xây <strong>quản trị</strong>: bộ quy tắc đạo đức, chính sách tổ chức, và tuân thủ (GDPR, quy định về AI).</li>
</ul>
<h3>Bản đồ môn học — từ nguyên lý tới thực hành</h3>
<p>Cả bộ specialization được gom vào lộ trình dưới đây. Mỗi chặng xây trên chặng trước, nên hãy học tuần tự:</p>
<div class="lz-map">
  <div class="lz-stage">Nền tảng</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Các khung đạo đức</div><div class="lz-nsub">Hệ quả luận · nghĩa vụ luận · đức hạnh · khế ước — áp vào công nghệ</div></div></div>
  <div class="lz-stage">Nhìn ra vấn đề</div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Các kiểu thiên kiến</div><div class="lz-nsub">Thiên kiến nhận thức &amp; thuật toán · COMPAS, tuyển dụng Amazon</div></div></div>
  <div class="lz-stage">Giảm tổn hại</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Phát hiện &amp; giảm thiểu rủi ro</div><div class="lz-nsub">Riêng tư · thước đo công bằng · minh bạch &amp; khả năng giải thích</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Truyền đạt về đạo đức</div><div class="lz-nsub">Nhiều bên liên quan · khủng hoảng &amp; truyền thông</div></div></div>
  <div class="lz-stage">Thể chế hoá</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Quản trị &amp; bộ quy tắc đạo đức</div><div class="lz-nsub">Bộ quy tắc ACM/IEEE · GDPR · quản trị AI</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Đạo đức AI hiện đại · các vụ án kinh điển</div><div class="lz-nsub">Tác hại AI tạo sinh, deepfake · Cambridge Analytica, Therac-25, Dieselgate</div></div></div>
</div>
<div class="callout ok">Cách học hiệu quả nhất môn này: với mỗi khung và mỗi quy tắc, hãy <strong>tranh luận một ca thật thành lời</strong> — chọn một phe, rồi cãi lại cho phe kia. Đạo đức là kỹ năng lập luận, không phải một mớ dữ kiện để thuộc lòng; đề 60 câu thưởng cho sinh viên biết <em>áp dụng</em> nguyên lý, không chỉ đọc thuộc.</div>
<a class="link-card exphub" href="/exp-hub?ref=%2Fcourses%2Fit-and-data-ethics%2Flearn&reflabel=ITE302c" target="_blank" rel="noopener">
  <span class="lc-ico">📚</span>
  <span class="lc-body"><span class="lc-title">Ghi chú, công cụ &amp; đọc thêm</span><span class="lc-sub">Tài nguyên đạo đức chọn lọc, checklist và link các vụ án trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing Requirements & Grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'ite302c-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, chứng chỉ MOOC bắt buộc và cách tính điểm qua môn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">Know the rules before the match. ITE302c is graded <strong>unusually</strong>: your whole grade is a single final exam — but you can't even sit it until you finish the online courses. The information below comes straight from the university's official syllabus.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>128h online + 3h offline + 1h exam + 18h self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None <small>can take from an early semester</small></span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when final ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">All MOOC certificates obtained</span></div>
  <div class="kv"><span class="k">Final exam</span><span class="v">60 MCQs · 60 min · computer-graded</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td><strong>Final Theory Exam (TE)</strong></td><td><strong>100%</strong></td><td>60 multiple-choice questions, 60 minutes, all studied content (CLO1–4)</td></tr>
    <tr><td>MOOC certificates</td><td>Gate</td><td>CertNexus CEET + Ethics of AI — <em>required to be allowed to take the exam</em></td></tr>
    <tr><td>Early-completion bonus</td><td>+1</td><td>Finish all MOOCs before the deadline → +1 bonus point on the final</td></tr>
  </tbody>
</table>
<div class="callout warn">Two <strong>hard blockers</strong>: (1) <strong>no MOOC certificates → barred from the exam</strong> no matter how well you know the material; (2) the pass rule is <strong>Final TE ≥ 4.0 AND (Final TE + bonus) ≥ 5.0</strong> — a 3.9 fails outright, and the +1 bonus only helps if you already cleared the 4.0 floor.</div>
<div class="note-ct">Strategy: the exam is 60 MCQs testing <em>application</em> ("given this scenario, which framework / which bias / which mitigation?"), not definitions. Finish the MOOCs early to lock the +1 and the exam eligibility, then drill scenario questions. Rote memorising the terms is not enough to pass.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Nắm luật chơi trước khi vào trận. ITE302c chấm điểm <strong>khác thường</strong>: toàn bộ điểm là một bài thi cuối duy nhất — nhưng bạn còn không được dự thi nếu chưa hoàn thành các khoá online. Thông tin dưới đây lấy thẳng từ syllabus chính thức.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>128h online + 3h offline + 1h thi + 18h tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không <small>học sớm từ các kỳ đầu được</small></span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi điểm cuối ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Có đủ mọi chứng chỉ MOOC</span></div>
  <div class="kv"><span class="k">Thi cuối</span><span class="v">60 câu trắc nghiệm · 60 phút · máy chấm</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td><strong>Thi lý thuyết cuối kỳ (TE)</strong></td><td><strong>100%</strong></td><td>60 câu trắc nghiệm, 60 phút, toàn bộ nội dung đã học (CLO1–4)</td></tr>
    <tr><td>Chứng chỉ MOOC</td><td>Chốt chặn</td><td>CertNexus CEET + Ethics of AI — <em>bắt buộc có mới được dự thi</em></td></tr>
    <tr><td>Thưởng hoàn thành sớm</td><td>+1</td><td>Xong hết MOOC trước hạn → +1 điểm thưởng vào bài cuối</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai điều <strong>chặn cứng</strong>: (1) <strong>không có chứng chỉ MOOC → cấm thi</strong> dù bạn nắm nội dung tới đâu; (2) quy tắc qua môn là <strong>TE cuối ≥ 4.0 VÀ (TE cuối + thưởng) ≥ 5.0</strong> — 3.9 là trượt thẳng, và +1 thưởng chỉ giúp nếu bạn đã qua sàn 4.0.</div>
<div class="note-ct">Chiến lược: đề là 60 câu trắc nghiệm kiểm tra <em>khả năng áp dụng</em> ("cho tình huống này, dùng khung nào / thiên kiến nào / cách giảm thiểu nào?"), không phải định nghĩa. Xong MOOC sớm để khoá chắc +1 và quyền dự thi, rồi luyện câu hỏi tình huống. Học thuộc thuật ngữ suông không đủ để qua.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning Outcomes (4 CLOs)|||0.3 — Chuẩn đầu ra (4 CLO)',
          slug: 'ite302c-chuan-dau-ra',
          type: 'VIDEO',
          description: '4 chuẩn đầu ra của môn và cách chúng gom vào từng chương.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>4 course learning outcomes (CLOs) &amp; roadmap</h2>
<p class="lead">A "Course Learning Outcome" (CLO) is what you <strong>must be able to do</strong> after the course. The 60-question exam maps to these four — knowing the CLO map tells you what you'll be tested on.</p>
<table>
  <thead><tr><th>CLO</th><th>You will be able to</th><th>Chapter</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Apply ethical principles, frameworks, regulations and standards used in data-driven technologies</td><td>1</td></tr>
    <tr><td>CLO2</td><td>Detect and mitigate ethical risks in the design, development and deployment of data-driven technology</td><td>2–3</td></tr>
    <tr><td>CLO3</td><td>Communicate effectively with diverse stakeholders about ethical safeguards, risks and mitigations</td><td>4</td></tr>
    <tr><td>CLO4</td><td>Create, implement and evaluate the organisational policies and governance structure ethics requires</td><td>5</td></tr>
  </tbody>
</table>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">CLO1</div><div class="lz-t">Reason</div><div class="lz-d">pick &amp; apply a framework</div></div>
  <div class="lz-step"><div class="lz-k">CLO2</div><div class="lz-t">Detect &amp; fix</div><div class="lz-d">find bias &amp; risk, mitigate it</div></div>
  <div class="lz-step"><div class="lz-k">CLO3</div><div class="lz-t">Communicate</div><div class="lz-d">explain it to any audience</div></div>
  <div class="lz-step"><div class="lz-k">CLO4</div><div class="lz-t">Govern</div><div class="lz-d">policy &amp; code of ethics</div></div>
</div>
<div class="callout">Notice the arc: you <em>reason</em> about right and wrong (CLO1), then <em>find and reduce</em> the concrete harms (CLO2), then <em>explain</em> your decisions to others (CLO3), then <em>build the institution</em> that keeps it going (CLO4). That is the life-cycle of an ethics professional, and the order every chapter follows.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>4 chuẩn đầu ra (CLO) &amp; lộ trình</h2>
<p class="lead">"Chuẩn đầu ra" (Course Learning Outcome) là những gì bạn <strong>phải làm được</strong> sau môn. Đề 60 câu bám vào bốn CLO này — nắm bản đồ CLO là biết mình sẽ bị hỏi gì.</p>
<table>
  <thead><tr><th>CLO</th><th>Bạn sẽ làm được</th><th>Chương</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Áp dụng nguyên lý, khung, quy định và chuẩn đạo đức dùng trong công nghệ dữ liệu</td><td>1</td></tr>
    <tr><td>CLO2</td><td>Phát hiện &amp; giảm thiểu rủi ro đạo đức trong thiết kế, phát triển và triển khai công nghệ dữ liệu</td><td>2–3</td></tr>
    <tr><td>CLO3</td><td>Truyền đạt hiệu quả với nhiều bên liên quan về biện pháp bảo vệ, rủi ro và cách giảm thiểu</td><td>4</td></tr>
    <tr><td>CLO4</td><td>Tạo, triển khai &amp; đánh giá chính sách tổ chức và cấu trúc quản trị mà đạo đức đòi hỏi</td><td>5</td></tr>
  </tbody>
</table>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">CLO1</div><div class="lz-t">Lập luận</div><div class="lz-d">chọn &amp; áp khung</div></div>
  <div class="lz-step"><div class="lz-k">CLO2</div><div class="lz-t">Phát hiện &amp; sửa</div><div class="lz-d">tìm thiên kiến &amp; rủi ro, giảm thiểu</div></div>
  <div class="lz-step"><div class="lz-k">CLO3</div><div class="lz-t">Truyền đạt</div><div class="lz-d">giải thích cho mọi đối tượng</div></div>
  <div class="lz-step"><div class="lz-k">CLO4</div><div class="lz-t">Quản trị</div><div class="lz-d">chính sách &amp; bộ quy tắc đạo đức</div></div>
</div>
<div class="callout">Để ý mạch chuyện: bạn <em>lập luận</em> về đúng–sai (CLO1), rồi <em>tìm và giảm</em> các tổn hại cụ thể (CLO2), rồi <em>giải thích</em> quyết định cho người khác (CLO3), rồi <em>xây thể chế</em> giữ cho nó tiếp diễn (CLO4). Đó là vòng đời của một chuyên gia đạo đức, và là trật tự mọi chương đi theo.</div>
</div>
`,
        },
        {
          title: '0.4 — Materials & Coursera MOOCs|||0.4 — Tài liệu & các MOOC Coursera',
          slug: 'ite302c-tai-lieu',
          type: 'VIDEO',
          description: 'Các khoá MOOC bắt buộc, chứng chỉ và nơi luyện tập.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials &amp; the MOOCs you must complete</h2>
<p class="lead">ITE302c is delivered through Coursera. You must finish these courses and collect the certificates — that is the gate to the final exam, and finishing early earns the +1 bonus.</p>
<h3>Required: CertNexus Certified Ethical Emerging Technologist (5 courses)</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">1 · Promote the Ethical Use of Data-Driven Technologies</div><div class="lz-ld">Emerging tech, privacy concepts, types of bias, ethical theories &amp; principles</div></div>
  <div class="lz-layer"><div class="lz-lt">2 · Turn Ethical Frameworks into Actionable Steps</div><div class="lz-ld">Apply frameworks to dilemmas; reconcile ethics, regulation, society, business</div></div>
  <div class="lz-layer"><div class="lz-lt">3 · Detect &amp; Mitigate Ethical Risks</div><div class="lz-ld">Privacy, accountability, transparency, fairness, safety &amp; security risks</div></div>
  <div class="lz-layer"><div class="lz-lt">4 · Communicate Effectively about Ethical Challenges</div><div class="lz-ld">Diverse stakeholders, DEI communication, crisis &amp; media management</div></div>
  <div class="lz-layer"><div class="lz-lt">5 · Create &amp; Lead an Ethical Data-Driven Organization</div><div class="lz-ld">Ethical culture, governance, code of ethics, organisational policy</div></div>
</div>
<h3>Also required &amp; recommended</h3>
<ul>
  <li><strong>Ethics of Artificial Intelligence</strong> (additional required MOOC): AI &amp; responsibility, case studies, issues &amp; challenges, governance.</li>
  <li><strong>Preparing for Your CertNexus Certification Exam</strong>: exam-readiness practice.</li>
</ul>
<a class="link-card dl" href="https://www.coursera.org/specializations/certified-ethical-emerging-technologist" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">CertNexus CEET Specialization</span><span class="lc-sub">The full 5-course path on Coursera — your main material.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
<a class="link-card dl" href="https://www.coursera.org/learn/ethics-of-artificial-intelligence" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">Ethics of Artificial Intelligence</span><span class="lc-sub">The additional required AI-ethics MOOC.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
<a class="link-card exphub" href="/exp-hub/ite302c-cong-cu-hoc?ref=%2Fcourses%2Fit-and-data-ethics%2Flearn&reflabel=ITE302c" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Tools guide — Zotero, Notion &amp; ethics references</span><span class="lc-sub">Exp Hub · study &amp; citation tools.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout">📎 Attached to this lesson: <strong>the original ITE302c.pdf syllabus</strong> — the university's official version, for reference.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu &amp; các MOOC bắt buộc hoàn thành</h2>
<p class="lead">ITE302c dạy qua Coursera. Bạn phải hoàn thành các khoá này và lấy chứng chỉ — đó là chốt chặn để dự thi cuối, và xong sớm thì được +1 điểm thưởng.</p>
<h3>Bắt buộc: CertNexus Certified Ethical Emerging Technologist (5 khoá)</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">1 · Promote the Ethical Use of Data-Driven Technologies</div><div class="lz-ld">Công nghệ mới nổi, khái niệm riêng tư, các kiểu thiên kiến, lý thuyết &amp; nguyên lý đạo đức</div></div>
  <div class="lz-layer"><div class="lz-lt">2 · Turn Ethical Frameworks into Actionable Steps</div><div class="lz-ld">Áp khung vào thế lưỡng nan; dung hoà đạo đức, quy định, xã hội, kinh doanh</div></div>
  <div class="lz-layer"><div class="lz-lt">3 · Detect &amp; Mitigate Ethical Risks</div><div class="lz-ld">Rủi ro riêng tư, trách nhiệm giải trình, minh bạch, công bằng, an toàn &amp; bảo mật</div></div>
  <div class="lz-layer"><div class="lz-lt">4 · Communicate Effectively about Ethical Challenges</div><div class="lz-ld">Nhiều bên liên quan, truyền thông DEI, xử lý khủng hoảng &amp; báo chí</div></div>
  <div class="lz-layer"><div class="lz-lt">5 · Create &amp; Lead an Ethical Data-Driven Organization</div><div class="lz-ld">Văn hoá đạo đức, quản trị, bộ quy tắc đạo đức, chính sách tổ chức</div></div>
</div>
<h3>Cũng bắt buộc &amp; khuyến nghị</h3>
<ul>
  <li><strong>Ethics of Artificial Intelligence</strong> (MOOC bắt buộc bổ sung): AI &amp; trách nhiệm, các vụ án, vấn đề &amp; thách thức, quản trị.</li>
  <li><strong>Preparing for Your CertNexus Certification Exam</strong>: luyện sẵn sàng cho kỳ thi.</li>
</ul>
<a class="link-card dl" href="https://www.coursera.org/specializations/certified-ethical-emerging-technologist" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">CertNexus CEET Specialization</span><span class="lc-sub">Lộ trình 5 khoá đầy đủ trên Coursera — tài liệu chính.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
<a class="link-card dl" href="https://www.coursera.org/learn/ethics-of-artificial-intelligence" target="_blank" rel="noopener">
  <span class="lc-ico">🤖</span>
  <span class="lc-body"><span class="lc-title">Ethics of Artificial Intelligence</span><span class="lc-sub">MOOC đạo đức AI bắt buộc bổ sung.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
<a class="link-card exphub" href="/exp-hub/ite302c-cong-cu-hoc?ref=%2Fcourses%2Fit-and-data-ethics%2Flearn&reflabel=ITE302c" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Bộ công cụ — Zotero, Notion &amp; khung đạo đức</span><span class="lc-sub">Exp Hub · công cụ học &amp; trích dẫn.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<div class="callout">📎 File đính kèm mục này: <strong>syllabus gốc ITE302c.pdf</strong> — bản chính thức của trường, dùng để đối chiếu.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 1 — CÁC KHUNG ĐẠO ĐỨC ══════════════════ */
    {
      title: 'Chapter 1 — Ethical Frameworks|||Chương 1 — Các khung đạo đức',
      description: 'Bốn khung tư duy đạo đức kinh điển và cách áp chúng vào quyết định công nghệ.',
      lessons: [
        {
          title: '1.1 — Four ways to decide right from wrong|||1.1 — Bốn cách phân định đúng–sai',
          slug: 'ite302c-1-1-bon-khung',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Hệ quả luận, nghĩa vụ luận, đức hạnh và khế ước — bốn ống kính đạo đức.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Four frameworks for judging right and wrong</h2>
<p class="lead">Ethics isn't one rule — it's a set of <strong>lenses</strong>. Point each lens at the same technology decision and you often see different answers. A professional knows all four, so they can reason from every angle and spot what a single view misses (CLO1).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Consequentialism / Utilitarianism</div><div class="lz-ld">Judge an action by its <strong>outcomes</strong>. The right choice produces the greatest good for the greatest number. "Does this create more benefit than harm, overall?"</div></div>
  <div class="lz-layer"><div class="lz-lt">Deontology (duty ethics)</div><div class="lz-ld">Judge the <strong>action itself</strong> against rules and duties, regardless of outcome. Some things (lying, violating consent) are wrong even if they'd produce good results. "Is this action itself permissible?"</div></div>
  <div class="lz-layer"><div class="lz-lt">Virtue ethics</div><div class="lz-ld">Judge the <strong>character</strong> behind the act. What would an honest, fair, courageous person do? "Does this reflect who we want to be?"</div></div>
  <div class="lz-layer"><div class="lz-lt">Contractarianism (social contract)</div><div class="lz-ld">Judge by the <strong>rules rational people would agree to</strong> for mutual benefit. Fair = what everyone could accept in advance, not knowing their own position. "Would all affected parties consent to this rule?"</div></div>
</div>
<h3>Why four and not one?</h3>
<p>Each framework has a blind spot. Pure utilitarianism can justify sacrificing a minority for the majority's benefit — deontology blocks that with rights and duties. Pure deontology can be rigid — virtue ethics adds judgment and context. Real ethical reasoning <strong>triangulates</strong>: if all four lenses agree an action is wrong, you have a strong case; if they disagree, you've found exactly where the hard trade-off lives.</p>
<div class="pitfall"><strong>Misconception:</strong> "Ethics is just my opinion / gut feeling." Frameworks exist precisely so ethics is <em>not</em> arbitrary — they give you a shared, defensible method to argue a conclusion, the same way a proof supports a theorem. In the exam and in real reviews, "it feels wrong" is not an answer; "it fails the consent test because…" is.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Rawls' "veil of ignorance" — the sharpest fairness test.</b> Philosopher John Rawls asked: design society's rules as if you didn't know who you'll be — rich or poor, majority or minority. You'd choose rules that protect the worst-off, because you might <em>be</em> them. Apply it to a hiring algorithm: would you accept it if you didn't know whether you'd be in the group it scores lower? It's contractarianism turned into a concrete, testable question you can ask about any system.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/promote-ethical-data-driven-technologies" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 1 — Promote the Ethical Use of Data-Driven Technologies</span><span class="lc-sub">Ethical theories &amp; principles, on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Bốn khung phân định đúng và sai</h2>
<p class="lead">Đạo đức không phải một quy tắc — mà là một bộ <strong>ống kính</strong>. Chĩa mỗi ống kính vào cùng một quyết định công nghệ, bạn thường thấy đáp án khác nhau. Người chuyên nghiệp biết cả bốn, để lập luận từ mọi góc và phát hiện điều mà một góc nhìn duy nhất bỏ sót (CLO1).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Hệ quả luận / Vị lợi (Consequentialism / Utilitarianism)</div><div class="lz-ld">Phán xét hành động theo <strong>kết quả</strong>. Lựa chọn đúng tạo ra điều tốt nhất cho số đông nhất. "Việc này có tạo lợi ích nhiều hơn tổn hại xét tổng thể không?"</div></div>
  <div class="lz-layer"><div class="lz-lt">Nghĩa vụ luận (Deontology)</div><div class="lz-ld">Phán xét <strong>bản thân hành động</strong> theo quy tắc và bổn phận, bất kể kết quả. Có những việc (nói dối, vi phạm sự đồng thuận) là sai kể cả khi cho kết quả tốt. "Bản thân hành động này có được phép không?"</div></div>
  <div class="lz-layer"><div class="lz-lt">Đạo đức đức hạnh (Virtue ethics)</div><div class="lz-ld">Phán xét <strong>phẩm cách</strong> đằng sau hành động. Một người trung thực, công bằng, dũng cảm sẽ làm gì? "Việc này có phản ánh con người ta muốn trở thành không?"</div></div>
  <div class="lz-layer"><div class="lz-lt">Khế ước luận (Contractarianism)</div><div class="lz-ld">Phán xét theo <strong>quy tắc mà những người lý trí sẽ đồng ý</strong> vì lợi ích chung. Công bằng = điều ai cũng chấp nhận trước, khi chưa biết vị trí của mình. "Mọi bên bị ảnh hưởng có đồng thuận với quy tắc này không?"</div></div>
</div>
<h3>Vì sao bốn mà không phải một?</h3>
<p>Mỗi khung có một điểm mù. Vị lợi thuần tuý có thể biện minh cho việc hy sinh thiểu số vì lợi ích đa số — nghĩa vụ luận chặn điều đó bằng quyền và bổn phận. Nghĩa vụ luận thuần tuý có thể cứng nhắc — đạo đức đức hạnh thêm sự phán đoán và bối cảnh. Lập luận đạo đức thật <strong>tam giác hoá</strong>: nếu cả bốn ống kính đều thấy hành động là sai, bạn có lập luận vững; nếu chúng bất đồng, bạn vừa tìm ra chính xác chỗ đánh đổi khó khăn nằm.</p>
<div class="pitfall"><strong>Ngộ nhận:</strong> "Đạo đức chỉ là ý kiến / cảm tính của tôi." Các khung tồn tại chính là để đạo đức <em>không</em> tuỳ tiện — chúng cho bạn một phương pháp chung, bảo vệ được, để lập luận tới một kết luận, y như một chứng minh chống đỡ định lý. Trong đề thi và trong review thật, "tôi thấy sai" không phải câu trả lời; "nó không qua bài kiểm đồng thuận vì…" mới là.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Bức màn vô minh" của Rawls — bài kiểm công bằng sắc bén nhất.</b> Triết gia John Rawls hỏi: hãy thiết kế quy tắc của xã hội như thể bạn không biết mình sẽ là ai — giàu hay nghèo, đa số hay thiểu số. Bạn sẽ chọn quy tắc bảo vệ người yếu thế nhất, vì bạn có thể <em>chính là</em> họ. Áp vào thuật toán tuyển dụng: bạn có chấp nhận nó nếu không biết mình có nằm trong nhóm bị chấm điểm thấp hơn không? Đó là khế ước luận biến thành một câu hỏi cụ thể, kiểm được, hỏi được cho bất kỳ hệ thống nào.</div>
<a class="link-card dl" href="https://www.coursera.org/learn/promote-ethical-data-driven-technologies" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 1 — Promote the Ethical Use of Data-Driven Technologies</span><span class="lc-sub">Lý thuyết &amp; nguyên lý đạo đức, trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: '1.2 — Applying a framework to a dilemma|||1.2 — Áp một khung vào thế lưỡng nan',
          slug: 'ite302c-1-2-ap-dung',
          type: 'VIDEO',
          description: 'Ví dụ có lời giải: phân tích một tình huống công nghệ từng bước, và dung hoà đạo đức với quy định & kinh doanh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>From framework to decision</h2>
<p class="lead">Knowing the four lenses is theory; the skill is <strong>walking a real dilemma through them</strong> and reaching a defensible decision — then reconciling it with regulations and business demands (CLO1).</p>
<h3>The four-step method</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 Facts</div><div class="lz-t">State the case</div><div class="lz-d">who is affected, what's at stake</div></div>
  <div class="lz-step"><div class="lz-k">2 Lenses</div><div class="lz-t">Apply each framework</div><div class="lz-d">what does each one say?</div></div>
  <div class="lz-step"><div class="lz-k">3 Weigh</div><div class="lz-t">Find the trade-off</div><div class="lz-d">where they conflict = the crux</div></div>
  <div class="lz-step"><div class="lz-k">4 Decide</div><div class="lz-t">Choose &amp; justify</div><div class="lz-d">state your reason, note the cost</div></div>
</div>
<h3>Ví dụ có lời giải · Worked example — the "engagement" feature</h3>
<div class="out"><b>Case.</b> Your team can boost app time-on-screen 18% by auto-playing emotionally provocative content the model predicts will keep users scrolling. Revenue rises. Some users report feeling anxious and losing sleep.<br><br>
<b>Step 1 — Facts.</b> Affected: users (wellbeing, autonomy), shareholders (revenue), employees (jobs tied to KPIs). At stake: mental health vs. profit.<br><br>
<b>Step 2 — Lenses.</b><br>
· <em>Utilitarian:</em> total harm (anxiety, lost sleep across millions) plausibly outweighs the concentrated benefit (ad revenue). Leans <strong>against</strong>.<br>
· <em>Deontology:</em> the feature manipulates users without informed consent — it treats them as a means to an engagement metric. <strong>Against</strong>, strongly.<br>
· <em>Virtue:</em> would an honest, caring company ship something it knows harms users' wellbeing to hit a number? <strong>Against</strong>.<br>
· <em>Contract:</em> would users agree in advance to a rule "the app may exploit your psychology to keep you scrolling"? No. <strong>Against</strong>.<br><br>
<b>Step 3 — Weigh.</b> All four align against; the only pull the other way is short-term revenue. The trade-off is profit vs. user harm — and no framework endorses the harm.<br><br>
<b>Step 4 — Decide.</b> Do not ship as designed. Reframe: optimise for a wellbeing-adjusted metric, add user controls and transparency. <em>Justification:</em> manipulation fails the consent and duty tests; the revenue gain doesn't survive the utilitarian tally once harm is counted.</div>
<h3>Reconciling ethics, regulation &amp; business</h3>
<p>Ethics, the law, and business goals overlap but aren't the same. Something can be <em>legal but unethical</em> (a dark-pattern that's not yet regulated) or <em>ethical but costly</em>. When they conflict: <strong>law is the floor, not the ceiling</strong> — compliance is the minimum, ethics asks for more. Frame the ethical choice in business terms (trust, brand, long-term retention, regulatory risk) so decision-makers hear it.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The Collingridge dilemma — why timing is brutal.</b> Early in a technology's life you <em>could</em> steer it, but you don't yet know its harms; by the time the harms are obvious, the tech is so entrenched that steering is nearly impossible. Social-media engagement algorithms are the textbook case: easy to shape in 2010, almost impossible to unwind now. The lesson for you: build ethics review <em>into design</em>, because the cheap window to act closes fast.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Từ khung tới quyết định</h2>
<p class="lead">Biết bốn ống kính là lý thuyết; kỹ năng là <strong>dắt một thế lưỡng nan thật đi qua chúng</strong> và tới một quyết định bảo vệ được — rồi dung hoà với quy định và đòi hỏi kinh doanh (CLO1).</p>
<h3>Phương pháp bốn bước</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1 Dữ kiện</div><div class="lz-t">Nêu tình huống</div><div class="lz-d">ai bị ảnh hưởng, điều gì đặt cược</div></div>
  <div class="lz-step"><div class="lz-k">2 Ống kính</div><div class="lz-t">Áp từng khung</div><div class="lz-d">mỗi khung nói gì?</div></div>
  <div class="lz-step"><div class="lz-k">3 Cân</div><div class="lz-t">Tìm đánh đổi</div><div class="lz-d">chỗ chúng xung đột = mấu chốt</div></div>
  <div class="lz-step"><div class="lz-k">4 Quyết</div><div class="lz-t">Chọn &amp; biện minh</div><div class="lz-d">nêu lý do, ghi rõ cái giá</div></div>
</div>
<h3>Ví dụ có lời giải · Tính năng "tăng tương tác"</h3>
<div class="out"><b>Tình huống.</b> Nhóm bạn có thể tăng 18% thời gian dùng app bằng cách tự phát nội dung khơi cảm xúc mạnh mà mô hình dự đoán sẽ giữ người dùng lướt tiếp. Doanh thu tăng. Một số người dùng phản ánh thấy lo âu và mất ngủ.<br><br>
<b>Bước 1 — Dữ kiện.</b> Bị ảnh hưởng: người dùng (sức khoẻ, quyền tự chủ), cổ đông (doanh thu), nhân viên (việc làm gắn với KPI). Đặt cược: sức khoẻ tinh thần vs. lợi nhuận.<br><br>
<b>Bước 2 — Ống kính.</b><br>
· <em>Vị lợi:</em> tổng tổn hại (lo âu, mất ngủ trên hàng triệu người) nhiều khả năng lớn hơn lợi ích tập trung (doanh thu quảng cáo). Nghiêng <strong>chống lại</strong>.<br>
· <em>Nghĩa vụ luận:</em> tính năng thao túng người dùng không có sự đồng thuận hiểu biết — coi họ là phương tiện cho một chỉ số tương tác. <strong>Chống</strong>, mạnh.<br>
· <em>Đức hạnh:</em> một công ty trung thực, biết quan tâm có tung ra thứ nó biết là hại sức khoẻ người dùng để đạt một con số không? <strong>Chống</strong>.<br>
· <em>Khế ước:</em> người dùng có đồng ý trước với quy tắc "app được khai thác tâm lý bạn để giữ bạn lướt" không? Không. <strong>Chống</strong>.<br><br>
<b>Bước 3 — Cân.</b> Cả bốn cùng chống; lực kéo ngược duy nhất là doanh thu ngắn hạn. Đánh đổi là lợi nhuận vs. tổn hại người dùng — và không khung nào ủng hộ tổn hại.<br><br>
<b>Bước 4 — Quyết.</b> Không tung ra như thiết kế. Đóng khung lại: tối ưu cho chỉ số có hiệu chỉnh sức khoẻ, thêm quyền kiểm soát cho người dùng và sự minh bạch. <em>Biện minh:</em> thao túng trượt bài kiểm đồng thuận và bổn phận; lợi doanh thu không sống sót qua phép tính vị lợi một khi đã tính tổn hại.</div>
<h3>Dung hoà đạo đức, quy định &amp; kinh doanh</h3>
<p>Đạo đức, pháp luật, và mục tiêu kinh doanh chồng lấn nhưng không như nhau. Có thứ <em>hợp pháp mà phi đạo đức</em> (một dark-pattern chưa bị quản) hoặc <em>có đạo đức mà tốn kém</em>. Khi chúng xung đột: <strong>luật là sàn, không phải trần</strong> — tuân thủ là tối thiểu, đạo đức đòi hỏi hơn. Hãy đóng khung lựa chọn đạo đức bằng ngôn ngữ kinh doanh (niềm tin, thương hiệu, giữ chân dài hạn, rủi ro pháp lý) để người ra quyết định lắng nghe.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thế lưỡng nan Collingridge — vì sao thời điểm rất nghiệt.</b> Sớm trong đời một công nghệ, bạn <em>có thể</em> lái nó, nhưng chưa biết tác hại; đến khi tác hại rõ ràng, công nghệ đã ăn sâu tới mức lái gần như bất khả. Thuật toán tương tác mạng xã hội là ca kinh điển: dễ nắn năm 2010, gần như không gỡ được bây giờ. Bài học cho bạn: gắn review đạo đức <em>vào lúc thiết kế</em>, vì cửa sổ rẻ để hành động đóng rất nhanh.</div>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'ite302c-quiz-ch1',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: bốn khung đạo đức và cách áp dụng.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Which framework judges an action purely by its outcomes (greatest good for the greatest number)?|||Khung nào phán xét hành động thuần theo kết quả (điều tốt nhất cho số đông nhất)?', options: ['Deontology|||Nghĩa vụ luận', 'Utilitarianism / consequentialism|||Vị lợi / hệ quả luận', 'Virtue ethics|||Đạo đức đức hạnh', 'Contractarianism|||Khế ước luận'], correctIndex: 1, points: 1 },
              { question: '"Some actions (like violating consent) are wrong even if they produce good results." This is the core of…|||"Một số hành động (như vi phạm sự đồng thuận) là sai kể cả khi cho kết quả tốt." Đây là cốt lõi của…', options: ['Utilitarianism|||Vị lợi', 'Deontology (duty ethics)|||Nghĩa vụ luận', 'Consequentialism|||Hệ quả luận', 'Cost-benefit analysis|||Phân tích lợi ích–chi phí'], correctIndex: 1, points: 1 },
              { question: "Rawls' veil of ignorance asks you to design rules as if…|||Bức màn vô minh của Rawls yêu cầu thiết kế quy tắc như thể…", options: ["you already know you're in the majority|||bạn đã biết mình thuộc đa số", "you don't know which position in society you'll hold|||bạn không biết mình sẽ ở vị trí nào trong xã hội", 'outcomes do not matter|||kết quả không quan trọng', 'only profit matters|||chỉ lợi nhuận quan trọng'], correctIndex: 1, points: 1 },
              { question: 'In ethics, the relationship between law and ethics is best described as…|||Quan hệ giữa luật và đạo đức được mô tả đúng nhất là…', options: ['identical — legal always means ethical|||đồng nhất — hợp pháp luôn là có đạo đức', 'law is the floor (minimum); ethics asks for more|||luật là sàn (tối thiểu); đạo đức đòi hỏi hơn', 'ethics is the minimum, law is optional|||đạo đức là tối thiểu, luật là tuỳ chọn', 'they never overlap|||chúng không bao giờ chồng lấn'], correctIndex: 1, points: 1 },
              { question: 'Why use all four frameworks instead of just one?|||Vì sao dùng cả bốn khung thay vì chỉ một?', options: ['To make decisions slower|||Để quyết định chậm hơn', 'Each has a blind spot; together they triangulate the trade-off|||Mỗi khung có điểm mù; cùng nhau chúng tam giác hoá điểm đánh đổi', 'The exam requires memorising four terms|||Đề thi bắt thuộc bốn thuật ngữ', 'Only one is ever correct|||Chỉ một khung đúng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — CÁC KIỂU THIÊN KIẾN ══════════════════ */
    {
      title: 'Chapter 2 — Types of Bias|||Chương 2 — Các kiểu thiên kiến',
      description: 'Thiên kiến của con người và thiên kiến của thuật toán — nguồn gốc và các vụ thật.',
      lessons: [
        {
          title: '2.1 — Cognitive bias: the human sources|||2.1 — Thiên kiến nhận thức: nguồn từ con người',
          slug: 'ite302c-2-1-thien-kien-nhan-thuc',
          type: 'VIDEO',
          description: 'Thiên kiến chọn mẫu, đo lường, xác nhận và tự động hoá — bốn cái đầu độc dữ liệu và quyết định.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Cognitive bias — where bad data and bad decisions begin</h2>
<p class="lead">Long before an algorithm is unfair, <strong>people</strong> introduced the bias — in what data they collected, how they measured it, and how they read the results. Detecting these is the first half of CLO2. Four to know cold:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Selection (sampling) bias</div><div class="lz-ld">The data doesn't represent the real population. Train a face model mostly on light-skinned faces → it fails on dark-skinned faces. The model is only as fair as its sample.</div></div>
  <div class="lz-layer"><div class="lz-lt">Measurement bias</div><div class="lz-ld">The thing you measure is a flawed stand-in for what you mean. Using "arrests" as a proxy for "crime" bakes in over-policing of some neighbourhoods.</div></div>
  <div class="lz-layer"><div class="lz-lt">Confirmation bias</div><div class="lz-ld">You notice evidence that fits your belief and dismiss what doesn't. A team "validates" a model by looking only at cases where it worked.</div></div>
  <div class="lz-layer"><div class="lz-lt">Automation bias</div><div class="lz-ld">People over-trust a machine's output just because a computer produced it — skipping the sanity check they'd apply to a human's advice.</div></div>
</div>
<h3>Why it matters for data-driven tech</h3>
<p>Machine learning <strong>learns patterns from historical data</strong>. If history was biased, the model faithfully reproduces — and can <em>amplify</em> — that bias at scale, while wearing the mask of mathematical objectivity. "The computer decided" feels neutral; it usually isn't.</p>
<div class="pitfall"><strong>Misconception:</strong> "Algorithms are objective because they're just math." Math is neutral; the <em>data</em> and the <em>choices</em> (what to predict, which features, what counts as success) are made by biased humans. A biased dataset produces a biased model no matter how elegant the equations — "garbage in, gospel out" is the danger, because the output now looks authoritative.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Survivorship bias &amp; the armored bombers.</b> In WWII, engineers wanted to add armor where returning planes had the most bullet holes. Statistician Abraham Wald pointed out the fatal flaw: they only saw planes that <em>survived</em>. The holes showed where a plane could be hit and still fly home — the armor belonged on the <em>undamaged</em> areas, where hits were fatal. The data you can see is not the data that matters. Ask constantly: <em>whose records are missing from my dataset, and why?</em></div>
<a class="link-card dl" href="https://www.coursera.org/learn/promote-ethical-data-driven-technologies" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 1 — Examine Types of Bias</span><span class="lc-sub">Bias &amp; ethical principles module, on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Thiên kiến nhận thức — nơi dữ liệu xấu và quyết định xấu bắt đầu</h2>
<p class="lead">Rất lâu trước khi một thuật toán bất công, <strong>con người</strong> đã gieo thiên kiến — trong dữ liệu họ thu, cách họ đo, và cách họ đọc kết quả. Phát hiện chúng là nửa đầu của CLO2. Bốn cái phải thuộc nằm lòng:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Thiên kiến chọn mẫu (selection/sampling)</div><div class="lz-ld">Dữ liệu không đại diện cho tổng thể thật. Huấn luyện mô hình nhận mặt chủ yếu trên da sáng → thất bại với da tối. Mô hình chỉ công bằng đến mức mẫu của nó.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thiên kiến đo lường (measurement)</div><div class="lz-ld">Thứ bạn đo là đại diện lỗi cho thứ bạn thật sự muốn. Dùng "số lần bị bắt" thay cho "tội phạm" là nướng luôn vào đó việc kiểm soát quá mức ở một số khu.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thiên kiến xác nhận (confirmation)</div><div class="lz-ld">Bạn để ý bằng chứng hợp niềm tin và gạt đi cái không hợp. Một nhóm "kiểm chứng" mô hình bằng cách chỉ nhìn các ca nó chạy đúng.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thiên kiến tự động hoá (automation)</div><div class="lz-ld">Người ta tin quá mức đầu ra của máy chỉ vì máy tạo ra nó — bỏ qua bước kiểm tra tỉnh táo mà họ vẫn áp cho lời khuyên của người.</div></div>
</div>
<h3>Vì sao nó quan trọng với công nghệ dữ liệu</h3>
<p>Học máy <strong>học các mẫu từ dữ liệu lịch sử</strong>. Nếu lịch sử thiên lệch, mô hình tái tạo trung thành — và có thể <em>khuếch đại</em> — thiên kiến đó ở quy mô lớn, khoác mặt nạ khách quan toán học. "Máy đã quyết" nghe trung lập; thường thì không.</p>
<div class="pitfall"><strong>Ngộ nhận:</strong> "Thuật toán khách quan vì nó chỉ là toán." Toán thì trung lập; nhưng <em>dữ liệu</em> và các <em>lựa chọn</em> (dự đoán cái gì, dùng đặc trưng nào, cái gì tính là thành công) do con người thiên kiến đưa ra. Một bộ dữ liệu thiên lệch tạo mô hình thiên lệch dù phương trình có đẹp tới đâu — "rác vào, thánh phán ra" mới là hiểm hoạ, vì đầu ra giờ trông đầy quyền uy.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Thiên kiến sống sót &amp; những máy bay ném bom bọc thép.</b> Thế chiến II, kỹ sư muốn thêm giáp vào nơi máy bay trở về dính nhiều vết đạn nhất. Nhà thống kê Abraham Wald chỉ ra sai lầm chết người: họ chỉ thấy máy bay <em>sống sót</em>. Các lỗ đạn cho thấy nơi máy bay dính đạn mà vẫn bay về được — giáp phải đặt ở vùng <em>không dính đạn</em>, nơi trúng là rơi. Dữ liệu bạn thấy được không phải dữ liệu quan trọng. Hãy hỏi liên tục: <em>hồ sơ của ai đang thiếu trong dữ liệu của mình, và vì sao?</em></div>
<a class="link-card dl" href="https://www.coursera.org/learn/promote-ethical-data-driven-technologies" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 1 — Examine Types of Bias</span><span class="lc-sub">Mô-đun thiên kiến &amp; nguyên lý đạo đức, trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Algorithmic bias in the real world|||2.2 — Thiên kiến thuật toán trong thực tế',
          slug: 'ite302c-2-2-thien-kien-thuat-toan',
          type: 'VIDEO',
          description: 'Ví dụ có lời giải: COMPAS và công cụ tuyển dụng Amazon — thiên kiến thật, hậu quả thật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>When the model discriminates — real cases</h2>
<p class="lead">Two landmark cases show cognitive bias hardening into <strong>algorithmic bias</strong> that affected real lives. Learn them as templates: the same pattern recurs everywhere.</p>
<h3>Ví dụ có lời giải · COMPAS — risk scores in criminal justice</h3>
<div class="out"><b>System.</b> COMPAS scored a defendant's likelihood of reoffending, used to inform bail and sentencing across US courts.<br><br>
<b>Finding (ProPublica, 2016).</b> Among defendants who did <em>not</em> reoffend, Black defendants were labelled "high risk" at roughly <strong>twice</strong> the rate of white defendants (false positives). Among those who <em>did</em> reoffend, white defendants were more often mislabelled "low risk".<br><br>
<b>Why.</b> The model never used race directly — but it learned from historical arrest data shaped by <em>measurement bias</em> (arrests ≠ crime) and biased policing. Proxy features (neighbourhood, prior arrests) carried the racial signal in through the back door.<br><br>
<b>Ethical read.</b> Fails deontology (people treated unequally by a hidden rule they never consented to) and the contract test (no one would accept a system that scores them worse based on where they live). The harm — longer detention — is severe and irreversible.</div>
<h3>Ví dụ có lời giải · Amazon's scrapped hiring tool</h3>
<div class="out"><b>System.</b> Amazon built an ML tool (2014–2017) to rank CVs and surface top engineering candidates.<br><br>
<b>Finding.</b> It systematically <strong>downgraded women</strong>. It penalised CVs containing the word "women's" (e.g. "women's chess club captain") and graduates of two women's colleges.<br><br>
<b>Why.</b> <em>Selection bias:</em> it trained on 10 years of past hires — mostly men in a male-dominated field. The model learned "successful candidate looks like the men we hired before" and encoded it as fact.<br><br>
<b>Outcome.</b> Amazon could not guarantee the tool wouldn't find <em>new</em> proxies for gender, and scrapped it. <em>Lesson:</em> removing the protected attribute (gender) is not enough — models find proxies. You must test outcomes across groups, not just delete a column.</div>
<div class="pitfall"><strong>Misconception:</strong> "Just delete the sensitive column (race, gender) and the model can't be biased." Both cases prove the opposite. Correlated features (name, ZIP code, hobbies, school) act as <strong>proxies</strong> and reintroduce the bias. Fairness must be measured on <em>outputs</em> across groups — not assumed from the absence of one input.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The impossibility of "perfect" fairness.</b> After COMPAS, researchers proved mathematically that several intuitive fairness definitions <em>cannot all hold at once</em> (unless the base rates are equal). You can equalise false-positive rates <em>or</em> equalise the meaning of a score across groups — but not both. There is no purely technical fix; choosing <em>which</em> fairness to prioritise is an unavoidable ethical decision that engineers cannot outsource to the math.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Khi mô hình phân biệt đối xử — các vụ thật</h2>
<p class="lead">Hai vụ kinh điển cho thấy thiên kiến nhận thức đông cứng thành <strong>thiên kiến thuật toán</strong> ảnh hưởng đời thật. Hãy học chúng như khuôn mẫu: cùng một dạng lặp lại khắp nơi.</p>
<h3>Ví dụ có lời giải · COMPAS — điểm rủi ro trong tư pháp hình sự</h3>
<div class="out"><b>Hệ thống.</b> COMPAS chấm khả năng tái phạm của bị cáo, dùng để tham khảo cho tại ngoại và tuyên án tại nhiều toà ở Mỹ.<br><br>
<b>Phát hiện (ProPublica, 2016).</b> Trong số bị cáo <em>không</em> tái phạm, bị cáo da đen bị gắn nhãn "rủi ro cao" ở tỷ lệ khoảng <strong>gấp đôi</strong> bị cáo da trắng (dương tính giả). Trong số <em>có</em> tái phạm, bị cáo da trắng thường bị gắn nhầm "rủi ro thấp" hơn.<br><br>
<b>Vì sao.</b> Mô hình không hề dùng chủng tộc trực tiếp — nhưng học từ dữ liệu bắt giữ lịch sử bị nhào nặn bởi <em>thiên kiến đo lường</em> (bắt giữ ≠ tội phạm) và kiểm soát cảnh sát thiên lệch. Các đặc trưng đại diện (khu ở, tiền án) mang tín hiệu chủng tộc vào bằng cửa sau.<br><br>
<b>Đọc theo đạo đức.</b> Trượt nghĩa vụ luận (người bị đối xử bất bình đẳng bởi một quy tắc ẩn họ chưa từng đồng thuận) và bài kiểm khế ước (không ai chấp nhận hệ thống chấm mình tệ hơn dựa trên nơi mình sống). Tổn hại — bị giam lâu hơn — là nghiêm trọng và không thể đảo ngược.</div>
<h3>Ví dụ có lời giải · Công cụ tuyển dụng bị Amazon huỷ bỏ</h3>
<div class="out"><b>Hệ thống.</b> Amazon xây một công cụ ML (2014–2017) để xếp hạng CV và làm nổi ứng viên kỹ thuật hàng đầu.<br><br>
<b>Phát hiện.</b> Nó <strong>hạ điểm phụ nữ</strong> một cách hệ thống. Nó phạt các CV chứa chữ "women's" (vd "đội trưởng câu lạc bộ cờ nữ") và người tốt nghiệp hai trường nữ sinh.<br><br>
<b>Vì sao.</b> <em>Thiên kiến chọn mẫu:</em> nó huấn luyện trên 10 năm tuyển dụng cũ — chủ yếu nam trong một ngành nam áp đảo. Mô hình học "ứng viên thành công trông giống những người nam ta đã tuyển" và mã hoá thành chân lý.<br><br>
<b>Kết cục.</b> Amazon không thể bảo đảm công cụ sẽ không tìm ra proxy <em>mới</em> cho giới tính, nên huỷ bỏ. <em>Bài học:</em> bỏ thuộc tính được bảo vệ (giới tính) là chưa đủ — mô hình tìm ra proxy. Phải kiểm kết quả theo nhóm, không chỉ xoá một cột.</div>
<div class="pitfall"><strong>Ngộ nhận:</strong> "Cứ xoá cột nhạy cảm (chủng tộc, giới tính) là mô hình không thể thiên kiến." Cả hai vụ chứng minh điều ngược lại. Các đặc trưng tương quan (tên, mã bưu chính, sở thích, trường) đóng vai <strong>proxy</strong> và đưa thiên kiến trở lại. Công bằng phải đo trên <em>đầu ra</em> theo nhóm — không suy ra từ việc thiếu một đầu vào.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Sự bất khả của công bằng "hoàn hảo".</b> Sau COMPAS, các nhà nghiên cứu chứng minh bằng toán rằng nhiều định nghĩa công bằng trực giác <em>không thể cùng đúng một lúc</em> (trừ khi tỷ lệ nền bằng nhau). Bạn có thể cân bằng tỷ lệ dương tính giả <em>hoặc</em> cân bằng ý nghĩa của điểm số giữa các nhóm — nhưng không cả hai. Không có cách sửa thuần kỹ thuật; chọn <em>công bằng nào</em> để ưu tiên là một quyết định đạo đức không tránh khỏi mà kỹ sư không thể phó thác cho toán.</div>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'ite302c-quiz-ch2',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: thiên kiến nhận thức và thuật toán.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Training a face-recognition model mostly on light-skinned faces, so it fails on dark-skinned faces, is an example of…|||Huấn luyện mô hình nhận mặt chủ yếu trên da sáng nên thất bại với da tối là ví dụ của…', options: ['Confirmation bias|||Thiên kiến xác nhận', 'Selection (sampling) bias|||Thiên kiến chọn mẫu', 'Automation bias|||Thiên kiến tự động hoá', 'No bias — it is just math|||Không thiên kiến — chỉ là toán'], correctIndex: 1, points: 1 },
              { question: 'Over-trusting a computer output just because a machine produced it is…|||Tin quá mức đầu ra của máy chỉ vì máy tạo ra nó là…', options: ['Measurement bias|||Thiên kiến đo lường', 'Automation bias|||Thiên kiến tự động hoá', 'Selection bias|||Thiên kiến chọn mẫu', 'Survivorship bias|||Thiên kiến sống sót'], correctIndex: 1, points: 1 },
              { question: 'The COMPAS controversy showed the model produced more false "high risk" labels for Black defendants mainly because…|||Vụ COMPAS cho thấy mô hình tạo nhiều nhãn "rủi ro cao" sai cho bị cáo da đen chủ yếu vì…', options: ['it explicitly used race as an input|||nó dùng chủng tộc làm đầu vào một cách tường minh', 'it learned from biased historical arrest data via proxy features|||nó học từ dữ liệu bắt giữ lịch sử thiên lệch qua các đặc trưng proxy', 'the math was wrong|||toán bị sai', 'judges ignored it|||thẩm phán phớt lờ nó'], correctIndex: 1, points: 1 },
              { question: 'Amazon scrapped its hiring tool because it downgraded women. Simply deleting the gender field would…|||Amazon huỷ công cụ tuyển dụng vì nó hạ điểm phụ nữ. Chỉ xoá trường giới tính sẽ…', options: ['fully fix the bias|||sửa hết thiên kiến', 'not be enough — proxy features reintroduce the bias|||không đủ — các đặc trưng proxy đưa thiên kiến trở lại', 'make the model illegal|||khiến mô hình phạm luật', 'improve accuracy to 100%|||nâng độ chính xác lên 100%'], correctIndex: 1, points: 1 },
              { question: '"Algorithms are objective because they are just math." The best response is…|||"Thuật toán khách quan vì chỉ là toán." Phản hồi đúng nhất là…', options: ['True — math removes all bias|||Đúng — toán loại mọi thiên kiến', 'The math is neutral, but the data and human choices behind it can be biased|||Toán trung lập, nhưng dữ liệu và lựa chọn con người đằng sau có thể thiên lệch', 'Only old algorithms are biased|||Chỉ thuật toán cũ mới thiên kiến', 'Bias only comes from hardware|||Thiên kiến chỉ đến từ phần cứng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — PHÁT HIỆN & GIẢM THIỂU RỦI RO ══════════════════ */
    {
      title: 'Chapter 3 — Detecting & Mitigating Ethical Risks|||Chương 3 — Phát hiện & giảm thiểu rủi ro đạo đức',
      description: 'Quyền riêng tư, thước đo công bằng, và minh bạch & khả năng giải thích — từ phát hiện tới giảm thiểu.',
      lessons: [
        {
          title: '3.1 — Privacy & fairness risks|||3.1 — Rủi ro quyền riêng tư & công bằng',
          slug: 'ite302c-3-1-riengtu-congbang',
          type: 'VIDEO',
          description: 'Nguyên tắc riêng tư, giảm thiểu dữ liệu, và cách đo công bằng bằng thước đo cụ thể.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Managing privacy &amp; fairness risk</h2>
<p class="lead">Detecting a risk is worthless without <strong>mitigating</strong> it. This is the heart of CLO2. Two of the biggest risk categories — privacy and fairness — each have concrete, testable safeguards.</p>
<h3>Privacy — core principles</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Data minimisation</div><div class="lz-ld">Collect only what you actually need for the stated purpose. Data you never collect can never leak.</div></div>
  <div class="lz-layer"><div class="lz-lt">Purpose limitation</div><div class="lz-ld">Use data only for the purpose the person consented to — not "and anything else we think of later".</div></div>
  <div class="lz-layer"><div class="lz-lt">Informed consent</div><div class="lz-ld">People understand and freely agree to what's collected — not buried in a 40-page policy nobody reads.</div></div>
  <div class="lz-layer"><div class="lz-lt">Anonymisation / de-identification</div><div class="lz-ld">Strip identifiers so records can't be traced back — though "anonymous" data is easier to re-identify than people assume.</div></div>
</div>
<h3>Fairness — you can't fix what you don't measure</h3>
<p>"Fair" must become a <strong>number</strong> you can test across groups. Common fairness metrics:</p>
<table>
  <thead><tr><th>Metric</th><th>Asks</th></tr></thead>
  <tbody>
    <tr><td>Demographic parity</td><td>Does the model approve/select each group at a similar rate?</td></tr>
    <tr><td>Equal opportunity</td><td>Among people who truly qualify, is the true-positive rate equal across groups?</td></tr>
    <tr><td>Equalised odds</td><td>Are both true-positive and false-positive rates equal across groups?</td></tr>
    <tr><td>Predictive parity</td><td>Does a given score mean the same thing (same real outcome rate) for every group?</td></tr>
  </tbody>
</table>
<div class="note-ct">Mitigation is a pipeline, not one fix: audit the <strong>data</strong> (is a group under-represented?), audit the <strong>model</strong> (compute the metrics above per group), and audit the <strong>outcome</strong> (monitor live decisions, not just test-set numbers). Add a human review for high-stakes decisions.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Differential privacy — a mathematical privacy guarantee.</b> Instead of hoping anonymisation holds, differential privacy adds carefully calibrated random noise so that any single person's presence or absence barely changes the result — you can query the dataset for useful statistics while provably limiting what can be learned about any individual. Apple, Google and the US Census use it. It reframes privacy from "did we remove the names?" to "what is the mathematical bound on the harm?"</div>
<h3>Ví dụ có lời giải · Worked case analysis</h3>
<p><b>Situation.</b> A bank's ML loan model rejects most applicants from a few postal codes; the approval rate for one district is far higher than a neighbouring one. Management insists: "We never used race or ethnicity as a feature."</p>
<ol>
<li><b>Facts.</b> The model uses postal code, income and employment. Postal code correlates strongly with ethnicity in this city; outcomes differ sharply by area.</li>
<li><b>Stakeholders.</b> Rejected applicants, approved applicants, the bank, regulators, and the wider community.</li>
<li><b>Ethical issues.</b> <em>Proxy discrimination</em> — an innocent-looking feature reproduces a protected-attribute bias — and the privacy of an <em>inferred</em> sensitive attribute.</li>
<li><b>Through the lenses.</b> Utilitarian: a small short-term gain against broad social harm and legal exposure. Deontology: it violates applicants' right to equal, non-arbitrary treatment. Professional (ACM 1.4 — be fair and take action not to discriminate): engineers must actively test for and remove such harm.</li>
<li><b>Recommendation.</b> "No race feature" is not a defence — proxies count. Measure disparate impact across groups, drop or neutralise the postal-code proxy, add human review for edge cases, and document the fairness audit. Fairness is a property of <em>outcomes</em>, not of the feature list.</li>
</ol>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Quản lý rủi ro riêng tư &amp; công bằng</h2>
<p class="lead">Phát hiện rủi ro là vô nghĩa nếu không <strong>giảm thiểu</strong> nó. Đây là trái tim của CLO2. Hai nhóm rủi ro lớn nhất — riêng tư và công bằng — đều có biện pháp bảo vệ cụ thể, kiểm được.</p>
<h3>Quyền riêng tư — các nguyên tắc cốt lõi</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Giảm thiểu dữ liệu (data minimisation)</div><div class="lz-ld">Chỉ thu đúng cái bạn thực sự cần cho mục đích đã nêu. Dữ liệu không bao giờ thu thì không bao giờ rò rỉ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Giới hạn mục đích (purpose limitation)</div><div class="lz-ld">Chỉ dùng dữ liệu cho mục đích người ta đã đồng thuận — không "và bất cứ gì ta nghĩ ra sau này".</div></div>
  <div class="lz-layer"><div class="lz-lt">Đồng thuận hiểu biết (informed consent)</div><div class="lz-ld">Người ta hiểu và tự nguyện đồng ý với cái được thu — không chôn trong chính sách 40 trang không ai đọc.</div></div>
  <div class="lz-layer"><div class="lz-lt">Ẩn danh / khử định danh</div><div class="lz-ld">Loại bỏ định danh để hồ sơ không truy ngược được — dù dữ liệu "ẩn danh" dễ tái định danh hơn người ta tưởng.</div></div>
</div>
<h3>Công bằng — không đo thì không sửa được</h3>
<p>"Công bằng" phải thành một <strong>con số</strong> bạn kiểm được theo nhóm. Các thước đo công bằng thường gặp:</p>
<table>
  <thead><tr><th>Thước đo</th><th>Hỏi gì</th></tr></thead>
  <tbody>
    <tr><td>Ngang bằng nhân khẩu (demographic parity)</td><td>Mô hình duyệt/chọn mỗi nhóm ở tỷ lệ tương đương không?</td></tr>
    <tr><td>Cơ hội bình đẳng (equal opportunity)</td><td>Trong số người thực sự đủ tiêu chuẩn, tỷ lệ dương tính thật có bằng nhau giữa các nhóm không?</td></tr>
    <tr><td>Odds cân bằng (equalised odds)</td><td>Cả tỷ lệ dương tính thật và dương tính giả có bằng nhau giữa các nhóm không?</td></tr>
    <tr><td>Ngang bằng dự đoán (predictive parity)</td><td>Một điểm số cho trước có cùng ý nghĩa (cùng tỷ lệ kết quả thật) với mọi nhóm không?</td></tr>
  </tbody>
</table>
<div class="note-ct">Giảm thiểu là một quy trình, không phải một cú sửa: kiểm <strong>dữ liệu</strong> (có nhóm nào thiếu đại diện?), kiểm <strong>mô hình</strong> (tính các thước đo trên theo từng nhóm), và kiểm <strong>kết quả</strong> (giám sát quyết định sống, không chỉ số trên tập kiểm). Thêm người xét duyệt cho quyết định hệ trọng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Riêng tư vi phân (differential privacy) — một bảo đảm riêng tư bằng toán.</b> Thay vì hy vọng ẩn danh giữ vững, riêng tư vi phân thêm nhiễu ngẫu nhiên hiệu chỉnh cẩn thận sao cho sự có mặt hay vắng mặt của một cá nhân bất kỳ gần như không đổi kết quả — bạn truy vấn được thống kê hữu ích trong khi chứng minh được giới hạn điều học được về mỗi cá nhân. Apple, Google và Điều tra dân số Mỹ đều dùng. Nó đóng khung lại riêng tư từ "ta đã bỏ tên chưa?" thành "giới hạn toán học của tổn hại là bao nhiêu?"</div>
<h3>Ví dụ có lời giải · Phân tích tình huống từng bước</h3>
<p><b>Tình huống.</b> Mô hình ML duyệt vay của một ngân hàng từ chối phần lớn hồ sơ ở vài mã bưu chính; tỷ lệ duyệt ở một quận cao hơn hẳn quận kế bên. Ban quản lý khẳng định: "Chúng tôi không hề dùng chủng tộc hay sắc tộc làm biến."</p>
<ol>
<li><b>Sự thật.</b> Mô hình dùng mã bưu chính, thu nhập, việc làm. Mã bưu chính tương quan mạnh với sắc tộc ở thành phố này; kết quả khác nhau rõ theo khu vực.</li>
<li><b>Các bên liên quan.</b> Người bị từ chối, người được duyệt, ngân hàng, cơ quan quản lý, và cộng đồng.</li>
<li><b>Vấn đề đạo đức.</b> <em>Phân biệt qua biến thay thế (proxy)</em> — một biến trông vô hại tái tạo thiên kiến theo thuộc tính được bảo vệ — và quyền riêng tư của một thuộc tính nhạy cảm <em>bị suy ra</em>.</li>
<li><b>Soi qua lăng kính.</b> Vị lợi: cái lợi ngắn hạn nhỏ đổi lấy tổn hại xã hội rộng và rủi ro pháp lý. Bổn phận: vi phạm quyền được đối xử bình đẳng, không tuỳ tiện. Nghề nghiệp (ACM 1.4 — công bằng và hành động để không phân biệt đối xử): kỹ sư phải chủ động kiểm và loại bỏ tổn hại này.</li>
<li><b>Khuyến nghị.</b> "Không có biến chủng tộc" không phải lý lẽ bào chữa — proxy vẫn tính. Đo tác động chênh lệch giữa các nhóm, bỏ hoặc trung hoà biến mã bưu chính, thêm rà soát của con người cho ca biên, và ghi lại bản kiểm công bằng. Công bằng là thuộc tính của <em>kết quả</em>, không phải của danh sách biến.</li>
</ol>
</div>
`,
        },
        {
          title: '3.2 — Transparency & explainability|||3.2 — Minh bạch & khả năng giải thích',
          slug: 'ite302c-3-2-minhbach-giaithich',
          type: 'VIDEO',
          description: 'Hộp đen vs. mô hình diễn giải được; trách nhiệm giải trình và quyền được giải thích.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Opening the black box</h2>
<p class="lead">If a system decides your loan, your job, or your medical care, "the algorithm said so" is not acceptable. <strong>Transparency</strong> (can we see how it works?) and <strong>explainability</strong> (can we explain a specific decision?) are how you make AI accountable (CLO2).</p>
<h3>Black box vs. interpretable models</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Interpretable ("white box")</div><div class="lz-ld">A human can follow the reasoning directly — decision trees, linear models with clear weights. You can say <em>exactly</em> why it decided X.</div></div>
  <div class="lz-layer"><div class="lz-lt">Black box</div><div class="lz-ld">Deep neural nets, huge ensembles — highly accurate, but the decision path is opaque even to their builders. Power bought with mystery.</div></div>
</div>
<p>There is often a real <strong>accuracy–interpretability trade-off</strong>: the most powerful models are the hardest to explain. For high-stakes, rights-affecting decisions, a slightly less accurate model you can <em>explain and audit</em> is often the ethical choice over a black box that's 1% better.</p>
<h3>Explainability techniques &amp; accountability</h3>
<ul>
  <li><strong>Post-hoc explanations</strong> (e.g. LIME, SHAP): tools that approximate <em>why</em> a black-box model made one decision — "you were denied mainly because of X and Y".</li>
  <li><strong>Model cards / datasheets</strong>: documentation of what a model was trained on, its intended use and known limits.</li>
  <li><strong>Accountability</strong>: a named human/team owns the outcome. "The AI did it" is never a valid defence — someone chose to deploy it.</li>
</ul>
<div class="pitfall"><strong>Misconception:</strong> "A more accurate model is always the more ethical choice." Not when it can't be explained and the decision affects someone's rights. An unexplainable denial you can't contest violates due process, even if the model is technically excellent. Accuracy is one value among several — contestability and transparency can outweigh it.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>GDPR Article 22 &amp; the "right to explanation."</b> Europe's GDPR gives people the right not to be subject to a solely automated decision with legal or significant effects, and to obtain "meaningful information about the logic involved". This turns explainability from a nice-to-have into a <em>legal requirement</em> for anyone serving EU users — and it is a major reason black-box models are risky in lending, hiring and insurance. Ethics and regulation converging into one design constraint.</div>
<h3>Ví dụ có lời giải · Worked case analysis</h3>
<p><b>Situation.</b> A hospital deploys a vendor "black-box" model that flags a patient as low priority for an expensive treatment. Neither the doctor nor the patient can obtain a reason, and hospital policy discourages overriding the model.</p>
<ol>
<li><b>Facts.</b> The model is a proprietary black box; it gives a score with no explanation; the treating doctor's override is administratively blocked.</li>
<li><b>Stakeholders.</b> The patient, the doctor, the hospital, and the vendor.</li>
<li><b>Ethical issues.</b> Lack of <em>explainability</em> destroys informed consent and accountability — if no one can explain the decision, no one can be held responsible for it.</li>
<li><b>Through the lenses.</b> Utilitarian: efficiency gains against eroded trust and possible patient harm. Deontology: the patient has a right to an explanation of a decision that affects them. Professional (ACM 2.5 — give comprehensive evaluations of risks; IEEE honesty): do not deploy unaccountable systems in high-stakes settings.</li>
<li><b>Recommendation.</b> Require explainable outputs or a guaranteed right to human review; restore the doctor's override; disclose to the patient that a model was used; and contract the vendor for transparency. In medicine, an unexplainable "no" is not acceptable.</li>
</ol>
<a class="link-card dl" href="https://www.coursera.org/learn/detect-mitigate-ethical-risks" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 3 — Detect &amp; Mitigate Ethical Risks</span><span class="lc-sub">Transparency, fairness, safety &amp; security modules, on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Mở chiếc hộp đen</h2>
<p class="lead">Nếu một hệ thống quyết khoản vay, việc làm, hay chăm sóc y tế của bạn, "thuật toán bảo thế" là không chấp nhận được. <strong>Minh bạch</strong> (ta thấy nó chạy thế nào không?) và <strong>khả năng giải thích</strong> (ta giải thích được một quyết định cụ thể không?) là cách bạn khiến AI có trách nhiệm giải trình (CLO2).</p>
<h3>Hộp đen vs. mô hình diễn giải được</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Diễn giải được ("hộp trắng")</div><div class="lz-ld">Con người theo dõi được lập luận trực tiếp — cây quyết định, mô hình tuyến tính với trọng số rõ ràng. Bạn nói được <em>chính xác</em> vì sao nó quyết X.</div></div>
  <div class="lz-layer"><div class="lz-lt">Hộp đen</div><div class="lz-ld">Mạng nơ-ron sâu, tổ hợp khổng lồ — chính xác cao, nhưng đường ra quyết định mờ đục ngay cả với người xây. Sức mạnh mua bằng sự bí ẩn.</div></div>
</div>
<p>Thường có một <strong>đánh đổi chính xác–diễn giải</strong> thật: mô hình mạnh nhất lại khó giải thích nhất. Với quyết định hệ trọng, ảnh hưởng đến quyền lợi, một mô hình kém chính xác hơn chút mà bạn <em>giải thích và kiểm toán được</em> thường là lựa chọn đạo đức hơn một hộp đen nhỉnh 1%.</p>
<h3>Kỹ thuật giải thích &amp; trách nhiệm giải trình</h3>
<ul>
  <li><strong>Giải thích hậu nghiệm</strong> (vd LIME, SHAP): công cụ xấp xỉ <em>vì sao</em> một mô hình hộp đen ra một quyết định — "bạn bị từ chối chủ yếu do X và Y".</li>
  <li><strong>Model card / datasheet</strong>: tài liệu về mô hình được huấn luyện trên gì, dùng vào việc gì, và giới hạn đã biết.</li>
  <li><strong>Trách nhiệm giải trình</strong>: một người/nhóm có tên chịu trách nhiệm về kết quả. "AI làm đấy" không bao giờ là biện hộ hợp lệ — có người đã chọn triển khai nó.</li>
</ul>
<div class="pitfall"><strong>Ngộ nhận:</strong> "Mô hình chính xác hơn luôn là lựa chọn đạo đức hơn." Không, khi nó không giải thích được và quyết định ảnh hưởng đến quyền của ai đó. Một sự từ chối không giải thích được mà bạn không phản đối được là vi phạm quy trình công bằng, kể cả khi mô hình rất giỏi về kỹ thuật. Chính xác chỉ là một giá trị trong nhiều giá trị — khả năng phản bác và minh bạch có thể nặng hơn.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Điều 22 GDPR &amp; "quyền được giải thích."</b> GDPR của châu Âu cho người ta quyền không bị lệ thuộc vào một quyết định hoàn toàn tự động có hệ quả pháp lý hoặc đáng kể, và quyền nhận "thông tin có ý nghĩa về logic liên quan". Điều này biến khả năng giải thích từ "có thì tốt" thành <em>yêu cầu pháp lý</em> cho bất kỳ ai phục vụ người dùng EU — và là lý do lớn khiến mô hình hộp đen rủi ro trong cho vay, tuyển dụng và bảo hiểm. Đạo đức và quy định hội tụ thành một ràng buộc thiết kế.</div>
<h3>Ví dụ có lời giải · Phân tích tình huống từng bước</h3>
<p><b>Tình huống.</b> Một bệnh viện triển khai mô hình "hộp đen" của nhà cung cấp; nó gắn nhãn một bệnh nhân là "ưu tiên thấp" cho một liệu pháp đắt tiền. Cả bác sĩ lẫn bệnh nhân đều không lấy được lý do, và quy định bệnh viện không khuyến khích ghi đè mô hình.</p>
<ol>
<li><b>Sự thật.</b> Mô hình là hộp đen độc quyền; chỉ đưa điểm số, không giải thích; quyền ghi đè của bác sĩ điều trị bị chặn về mặt hành chính.</li>
<li><b>Các bên liên quan.</b> Bệnh nhân, bác sĩ, bệnh viện, nhà cung cấp.</li>
<li><b>Vấn đề đạo đức.</b> Thiếu <em>khả năng giải thích</em> phá vỡ đồng thuận có hiểu biết và trách nhiệm giải trình — nếu không ai giải thích được quyết định, không ai chịu trách nhiệm về nó.</li>
<li><b>Soi qua lăng kính.</b> Vị lợi: cái lợi về hiệu suất đổi lấy niềm tin bị xói mòn và nguy cơ hại bệnh nhân. Bổn phận: bệnh nhân có quyền được giải thích quyết định ảnh hưởng đến mình. Nghề nghiệp (ACM 2.5 — đánh giá đầy đủ rủi ro; IEEE trung thực): không triển khai hệ thống không giải trình được trong bối cảnh hệ trọng.</li>
<li><b>Khuyến nghị.</b> Yêu cầu đầu ra giải thích được hoặc quyền được con người xem lại; khôi phục quyền ghi đè của bác sĩ; công khai với bệnh nhân rằng có dùng mô hình; và ràng buộc nhà cung cấp về tính minh bạch. Trong y khoa, một câu "không" không giải thích được là không chấp nhận được.</li>
</ol>
<a class="link-card dl" href="https://www.coursera.org/learn/detect-mitigate-ethical-risks" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 3 — Detect &amp; Mitigate Ethical Risks</span><span class="lc-sub">Mô-đun minh bạch, công bằng, an toàn &amp; bảo mật, trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'ite302c-quiz-ch3',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: riêng tư, thước đo công bằng, minh bạch & giải thích.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The principle "collect only the data you actually need" is called…|||Nguyên tắc "chỉ thu dữ liệu bạn thực sự cần" gọi là…', options: ['Purpose limitation|||Giới hạn mục đích', 'Data minimisation|||Giảm thiểu dữ liệu', 'Anonymisation|||Ẩn danh', 'Predictive parity|||Ngang bằng dự đoán'], correctIndex: 1, points: 1 },
              { question: 'A fairness metric that checks whether a given score means the same real-outcome rate for every group is…|||Thước đo công bằng kiểm xem một điểm số cho trước có cùng tỷ lệ kết quả thật cho mọi nhóm là…', options: ['Demographic parity|||Ngang bằng nhân khẩu', 'Predictive parity|||Ngang bằng dự đoán', 'Data minimisation|||Giảm thiểu dữ liệu', 'Purpose limitation|||Giới hạn mục đích'], correctIndex: 1, points: 1 },
              { question: 'The main difference between a "black box" and an "interpretable" model is…|||Khác biệt chính giữa mô hình "hộp đen" và "diễn giải được" là…', options: ['black boxes are always illegal|||hộp đen luôn phạm luật', "whether a human can follow why it made a decision|||con người có theo dõi được vì sao nó quyết định không", 'interpretable models are always more accurate|||mô hình diễn giải luôn chính xác hơn', 'black boxes use no data|||hộp đen không dùng dữ liệu'], correctIndex: 1, points: 1 },
              { question: 'GDPR Article 22 is significant for AI ethics because it…|||Điều 22 GDPR quan trọng với đạo đức AI vì nó…', options: ['bans all algorithms|||cấm mọi thuật toán', 'gives a right not to be subject to solely automated decisions with major effects, and to meaningful info about the logic|||cho quyền không bị lệ thuộc quyết định hoàn toàn tự động có hệ quả lớn, và quyền biết thông tin có ý nghĩa về logic', 'requires 100% model accuracy|||đòi mô hình chính xác 100%', 'only applies to social media|||chỉ áp cho mạng xã hội'], correctIndex: 1, points: 1 },
              { question: 'For a high-stakes, rights-affecting decision, choosing a slightly less accurate but explainable model is…|||Với quyết định hệ trọng, ảnh hưởng quyền lợi, chọn mô hình kém chính xác chút nhưng giải thích được là…', options: ['always wrong — accuracy is everything|||luôn sai — chính xác là tất cả', 'often the ethical choice, because decisions must be contestable and transparent|||thường là lựa chọn đạo đức, vì quyết định phải phản bác và minh bạch được', 'illegal under GDPR|||phạm luật theo GDPR', 'irrelevant to ethics|||không liên quan đến đạo đức'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4 — TRUYỀN ĐẠT VỀ ĐẠO ĐỨC ══════════════════ */
    {
      title: 'Chapter 4 — Communicating about Ethics|||Chương 4 — Truyền đạt về đạo đức',
      description: 'Nói về rủi ro đạo đức với nhiều bên liên quan khác nhau, và xử lý khủng hoảng & truyền thông.',
      lessons: [
        {
          title: '4.1 — Talking to diverse stakeholders & handling a crisis|||4.1 — Nói với nhiều bên liên quan & xử lý khủng hoảng',
          slug: 'ite302c-4-1-truyendat',
          type: 'VIDEO',
          description: 'Điều chỉnh thông điệp theo từng đối tượng, và các nguyên tắc truyền thông khủng hoảng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Making people act on an ethical risk</h2>
<p class="lead">You can detect a serious ethical risk perfectly and still fail — if you can't get the right people to <strong>listen and act</strong>. Communication is a core competency, not an afterthought (CLO3). The same risk must be framed differently for different audiences.</p>
<h3>One risk, many audiences</h3>
<table>
  <thead><tr><th>Stakeholder</th><th>What they care about</th><th>How to frame it</th></tr></thead>
  <tbody>
    <tr><td>Executives / board</td><td>Risk, cost, brand, liability</td><td>Business impact: regulatory fines, reputation, long-term trust &amp; retention</td></tr>
    <tr><td>Engineers</td><td>How to fix it, concretely</td><td>Specifics: which dataset, which metric, what change is needed</td></tr>
    <tr><td>Legal / compliance</td><td>Regulations &amp; obligations</td><td>Map the risk to GDPR, standards, contractual duties</td></tr>
    <tr><td>Users / public</td><td>How it affects them; trust</td><td>Plain language, honesty, what you're doing about it</td></tr>
  </tbody>
</table>
<div class="note-ct">Golden rule of ethical communication: <strong>translate, don't dumb down</strong>. The executive doesn't need the math, but they need the true stakes. Honesty across all audiences is itself the ethical baseline — telling engineers one story and the public another is how scandals are born.</div>
<h3>Communicating in a crisis</h3>
<p>When an ethical failure goes public, communication <em>is</em> the response. Principles that separate recovery from disaster:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Fast</div><div class="lz-t">Get ahead of it</div><div class="lz-d">silence reads as guilt or incompetence</div></div>
  <div class="lz-step"><div class="lz-k">Honest</div><div class="lz-t">Own the harm</div><div class="lz-d">acknowledge who was affected, don't minimise</div></div>
  <div class="lz-step"><div class="lz-k">Concrete</div><div class="lz-t">Say what you'll do</div><div class="lz-d">specific fixes &amp; timeline, not vague regret</div></div>
  <div class="lz-step"><div class="lz-k">Consistent</div><div class="lz-t">One truthful story</div><div class="lz-d">internal &amp; external messages must match</div></div>
</div>
<div class="pitfall"><strong>Misconception:</strong> "The engineering fix is the real work; communication is just PR spin." In a data-ethics crisis, how you communicate <em>is</em> an ethical act. Downplaying harm, blaming users, or hiding scope compounds the original wrong and destroys the trust you need to recover. Good crisis communication is honesty operationalised — not spin.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Two crises, two outcomes.</b> Compare Johnson &amp; Johnson's 1982 Tylenol recall — fast, transparent, "public safety over profit," now taught as the gold standard — with data scandals where firms denied, delayed and blamed users, and lost trust for years. The technical facts were fixed in days; the <em>reputational</em> outcome was decided entirely by the honesty and speed of communication. For your career: the moment you find the risk, how you raise it often matters as much as the finding itself.</div>
<h3>Ví dụ có lời giải · Worked example (raising an ethics concern)</h3>
<p><b>Situation.</b> You are a junior engineer. You notice the recommender you help maintain pushes self-harm content to teenage users because it maximises watch-time. You have the logs. How do you <em>communicate</em> this so it actually gets fixed — without torpedoing your standing?</p>
<ol>
<li><b>Know your audience.</b> Your lead cares about risk and metrics; legal/trust-and-safety care about harm and liability. Tailor the same facts to each.</li>
<li><b>Lead with evidence, not accusation.</b> "Here are 40 sessions where minors were served self-harm videos" beats "the algorithm is evil." Data is harder to dismiss.</li>
<li><b>Frame harm AND business risk.</b> Name the human harm first, then the concrete risk (regulatory, PR, legal) — this makes it a priority, not a philosophy debate.</li>
<li><b>Bring a fix, not just a problem.</b> Propose a concrete mitigation (age-aware filtering, a safety classifier, a hard block on the category) so the conversation moves to "how", not "whether".</li>
<li><b>Use the right channel, and document.</b> Send a short factual memo to your lead + trust-and-safety, keep a dated record. If it is serious and ignored, escalate through the whistleblower/ethics policy. Communicating an ethical concern well is itself a professional skill.</li>
</ol>
<a class="link-card dl" href="https://www.coursera.org/learn/ethical-communication-data-driven-technologies" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 4 — Communicate Effectively about Ethical Challenges</span><span class="lc-sub">Stakeholders, DEI communication &amp; crisis management, on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Khiến người ta hành động trước một rủi ro đạo đức</h2>
<p class="lead">Bạn có thể phát hiện một rủi ro đạo đức nghiêm trọng hoàn hảo mà vẫn thất bại — nếu không khiến đúng người <strong>lắng nghe và hành động</strong>. Truyền đạt là năng lực cốt lõi, không phải chuyện phụ (CLO3). Cùng một rủi ro phải được đóng khung khác nhau cho từng đối tượng.</p>
<h3>Một rủi ro, nhiều đối tượng</h3>
<table>
  <thead><tr><th>Bên liên quan</th><th>Họ quan tâm gì</th><th>Đóng khung thế nào</th></tr></thead>
  <tbody>
    <tr><td>Lãnh đạo / hội đồng</td><td>Rủi ro, chi phí, thương hiệu, trách nhiệm pháp lý</td><td>Tác động kinh doanh: phạt pháp lý, uy tín, niềm tin &amp; giữ chân dài hạn</td></tr>
    <tr><td>Kỹ sư</td><td>Sửa nó thế nào, cụ thể</td><td>Chi tiết: bộ dữ liệu nào, thước đo nào, cần thay đổi gì</td></tr>
    <tr><td>Pháp lý / tuân thủ</td><td>Quy định &amp; nghĩa vụ</td><td>Ánh xạ rủi ro tới GDPR, chuẩn, nghĩa vụ hợp đồng</td></tr>
    <tr><td>Người dùng / công chúng</td><td>Ảnh hưởng đến họ; niềm tin</td><td>Ngôn ngữ đời thường, trung thực, bạn đang làm gì để khắc phục</td></tr>
  </tbody>
</table>
<div class="note-ct">Quy tắc vàng của truyền đạt đạo đức: <strong>chuyển ngữ, đừng làm ngu hoá</strong>. Lãnh đạo không cần phần toán, nhưng cần biết đúng mức độ đặt cược. Trung thực với mọi đối tượng tự nó là chuẩn đạo đức nền — kể cho kỹ sư một câu chuyện và công chúng một câu chuyện khác là cách sinh ra bê bối.</div>
<h3>Truyền đạt trong khủng hoảng</h3>
<p>Khi một thất bại đạo đức bung ra công khai, truyền đạt <em>chính là</em> phản ứng. Các nguyên tắc tách phục hồi khỏi thảm hoạ:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nhanh</div><div class="lz-t">Đi trước nó</div><div class="lz-d">im lặng bị đọc là có tội hoặc bất tài</div></div>
  <div class="lz-step"><div class="lz-k">Trung thực</div><div class="lz-t">Nhận tổn hại</div><div class="lz-d">thừa nhận ai bị ảnh hưởng, đừng giảm nhẹ</div></div>
  <div class="lz-step"><div class="lz-k">Cụ thể</div><div class="lz-t">Nói sẽ làm gì</div><div class="lz-d">cách sửa &amp; mốc thời gian rõ, không tiếc nuối mơ hồ</div></div>
  <div class="lz-step"><div class="lz-k">Nhất quán</div><div class="lz-t">Một câu chuyện thật</div><div class="lz-d">thông điệp trong &amp; ngoài phải khớp</div></div>
</div>
<div class="pitfall"><strong>Ngộ nhận:</strong> "Sửa kỹ thuật mới là việc thật; truyền đạt chỉ là PR đánh bóng." Trong khủng hoảng đạo đức dữ liệu, cách bạn truyền đạt <em>chính là</em> một hành vi đạo đức. Giảm nhẹ tổn hại, đổ lỗi người dùng, hay giấu quy mô làm trầm trọng thêm cái sai ban đầu và phá huỷ niềm tin bạn cần để phục hồi. Truyền thông khủng hoảng tốt là trung thực được vận hành — không phải đánh bóng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hai khủng hoảng, hai kết cục.</b> So sánh vụ thu hồi Tylenol năm 1982 của Johnson &amp; Johnson — nhanh, minh bạch, "an toàn công chúng trên lợi nhuận", nay được dạy như chuẩn vàng — với các bê bối dữ liệu nơi công ty chối, trì hoãn và đổ lỗi người dùng, mất niềm tin nhiều năm. Sự thật kỹ thuật được sửa trong vài ngày; kết cục <em>uy tín</em> hoàn toàn do sự trung thực và tốc độ truyền đạt định đoạt. Cho sự nghiệp của bạn: khoảnh khắc bạn tìm ra rủi ro, cách bạn nêu nó thường quan trọng ngang phát hiện.</div>
<h3>Ví dụ có lời giải · Ví dụ (cách nêu một mối lo đạo đức)</h3>
<p><b>Tình huống.</b> Bạn là kỹ sư mới. Bạn phát hiện hệ gợi ý bạn đang bảo trì đẩy nội dung tự hại tới người dùng tuổi teen vì nó tối đa hoá thời lượng xem. Bạn có log. Làm sao <em>truyền đạt</em> việc này để nó thực sự được sửa — mà không tự huỷ vị thế của mình?</p>
<ol>
<li><b>Hiểu người nghe.</b> Sếp bạn quan tâm rủi ro và chỉ số; bộ phận pháp lý/an toàn quan tâm tổn hại và trách nhiệm. Cùng một sự thật, trình bày hợp từng bên.</li>
<li><b>Mở đầu bằng bằng chứng, không phải cáo buộc.</b> "Đây là 40 phiên trẻ vị thành niên bị phục vụ video tự hại" hơn hẳn "thuật toán này độc ác." Dữ liệu khó gạt bỏ hơn.</li>
<li><b>Khung cả tổn hại LẪN rủi ro kinh doanh.</b> Nêu tổn hại con người trước, rồi rủi ro cụ thể (pháp lý, truyền thông) — biến nó thành việc ưu tiên, không phải cuộc tranh luận triết học.</li>
<li><b>Mang giải pháp, không chỉ vấn đề.</b> Đề xuất biện pháp cụ thể (lọc theo tuổi, một bộ phân loại an toàn, chặn cứng danh mục) để cuộc bàn chuyển sang "làm thế nào", không phải "có nên hay không".</li>
<li><b>Dùng đúng kênh, và lưu vết.</b> Gửi một bản ghi nhớ ngắn, thực tế tới sếp + bộ phận an toàn, giữ bản ghi có ngày. Nếu nghiêm trọng mà bị phớt lờ, leo thang theo quy định tố giác/đạo đức. Truyền đạt tốt một mối lo đạo đức tự nó là một kỹ năng nghề.</li>
</ol>
<a class="link-card dl" href="https://www.coursera.org/learn/ethical-communication-data-driven-technologies" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 4 — Communicate Effectively about Ethical Challenges</span><span class="lc-sub">Bên liên quan, truyền thông DEI &amp; xử lý khủng hoảng, trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'ite302c-quiz-ch4',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: truyền đạt với nhiều bên & khủng hoảng.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'When explaining an ethical risk to executives (vs. engineers), you should emphasise…|||Khi giải thích rủi ro đạo đức cho lãnh đạo (thay vì kỹ sư), nên nhấn mạnh…', options: ['the exact code change|||thay đổi code chính xác', 'business impact: risk, cost, brand, liability|||tác động kinh doanh: rủi ro, chi phí, thương hiệu, trách nhiệm pháp lý', 'the fairness metric formulas|||công thức thước đo công bằng', 'nothing — they cannot understand|||không gì — họ không hiểu được'], correctIndex: 1, points: 1 },
              { question: '"Translate, do not dumb down" means…|||"Chuyển ngữ, đừng làm ngu hoá" nghĩa là…', options: ['hide the truth from non-experts|||giấu sự thật với người không chuyên', 'adapt the framing to the audience while keeping the true stakes honest|||điều chỉnh cách đóng khung theo đối tượng nhưng giữ đúng mức độ đặt cược một cách trung thực', 'always use technical jargon|||luôn dùng thuật ngữ kỹ thuật', 'give every audience the same slide|||đưa mọi đối tượng cùng một slide'], correctIndex: 1, points: 1 },
              { question: 'A well-handled ethics crisis communication is characterised by being…|||Truyền thông khủng hoảng đạo đức xử lý tốt có đặc điểm…', options: ['slow, vague and defensive|||chậm, mơ hồ và phòng thủ', 'fast, honest, concrete and consistent|||nhanh, trung thực, cụ thể và nhất quán', 'silent until it blows over|||im lặng cho tới khi nó qua', 'blaming the users|||đổ lỗi người dùng'], correctIndex: 1, points: 1 },
              { question: 'Telling engineers one story and the public a different story is dangerous because…|||Kể cho kỹ sư một chuyện và công chúng một chuyện khác nguy hiểm vì…', options: ['it saves time|||nó tiết kiệm thời gian', 'inconsistent, dishonest messaging is how scandals are born and trust is destroyed|||thông điệp không nhất quán, thiếu trung thực là cách sinh ra bê bối và phá huỷ niềm tin', 'engineers prefer it|||kỹ sư thích thế', 'it is required by GDPR|||GDPR đòi thế'], correctIndex: 1, points: 1 },
              { question: 'Why is communication considered a core ethics competency, not an afterthought?|||Vì sao truyền đạt được coi là năng lực đạo đức cốt lõi, không phải chuyện phụ?', options: ['it is not — only detection matters|||không phải — chỉ phát hiện mới quan trọng', 'a perfectly detected risk still fails if you cannot get people to listen and act|||một rủi ro phát hiện hoàn hảo vẫn thất bại nếu không khiến người ta lắng nghe và hành động', 'it replaces the technical fix|||nó thay thế việc sửa kỹ thuật', 'regulators forbid engineers from speaking|||nhà quản lý cấm kỹ sư phát biểu'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 5 — QUẢN TRỊ & BỘ QUY TẮC ĐẠO ĐỨC ══════════════════ */
    {
      title: 'Chapter 5 — Governance & Code of Ethics|||Chương 5 — Quản trị & bộ quy tắc đạo đức',
      description: 'Bộ quy tắc nghề nghiệp (ACM/IEEE), chính sách tổ chức, GDPR và quản trị AI.',
      lessons: [
        {
          title: '5.1 — Codes of ethics & organizational policy|||5.1 — Bộ quy tắc đạo đức & chính sách tổ chức',
          slug: 'ite302c-5-1-code-of-ethics',
          type: 'VIDEO',
          description: 'Bộ quy tắc ACM/IEEE, văn hoá đạo đức, và cách một chính sách tổ chức tốt được xây.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>From personal judgment to institution</h2>
<p class="lead">Individual good intentions don't scale. To keep an organisation ethical you need <strong>governance</strong>: shared codes, written policy, and a culture where raising concerns is safe (CLO4). This is what turns ethics from one person's opinion into how the company actually operates.</p>
<h3>Professional codes of ethics</h3>
<p>Your profession already has codes written by the people who came before you. Two you should know:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">ACM Code of Ethics</div><div class="lz-ld">"Contribute to society and human well-being," "avoid harm," "be honest," "respect privacy." The general moral imperatives for computing professionals.</div></div>
  <div class="lz-layer"><div class="lz-lt">IEEE Code of Ethics</div><div class="lz-ld">Hold paramount the safety, health and welfare of the public; disclose factors that endanger the public; reject bribery; treat all persons fairly.</div></div>
</div>
<p>These aren't just posters. "Hold paramount the public's safety" gives an engineer explicit professional cover to <strong>refuse</strong> or <strong>escalate</strong> unsafe work — the profession, not just the individual, stands behind that duty.</p>
<h3>What a good organizational policy contains</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Principles</div><div class="lz-t">values</div><div class="lz-d">what the org stands for</div></div>
  <div class="lz-step"><div class="lz-k">Process</div><div class="lz-t">who reviews what</div><div class="lz-d">ethics review board, approval gates</div></div>
  <div class="lz-step"><div class="lz-k">Roles</div><div class="lz-t">accountability</div><div class="lz-d">named owners for decisions</div></div>
  <div class="lz-step"><div class="lz-k">Reporting</div><div class="lz-t">speak up safely</div><div class="lz-d">whistleblower protection</div></div>
</div>
<div class="pitfall"><strong>Misconception:</strong> "We have a code of ethics on the wall, so we're covered." A code that isn't enforced, reviewed, or backed by process is <em>ethics theatre</em>. What makes a code real: leadership that follows it under pressure, review gates that can actually stop a launch, and protection for people who report problems. Culture eats the poster for breakfast.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Psychological safety is the load-bearing wall.</b> Google's Project Aristotle found the top predictor of effective teams wasn't talent — it was <em>psychological safety</em>: people felt safe to speak up. Every major ethics failure has the same post-mortem line: "someone knew, but didn't feel safe raising it." A code of ethics only works if the org rewards the person who says "stop, this is wrong" instead of punishing them. Governance is 20% documents and 80% whether people dare to use them.</div>
<h3>Ví dụ có lời giải · Worked case analysis</h3>
<p><b>Situation.</b> Your product manager asks you to log users' precise GPS location in the background "for analytics", with no consent prompt and no retention limit. It is technically easy and "everyone does it".</p>
<ol>
<li><b>Facts.</b> An SDK would collect precise location silently; there is no opt-in; the data would be kept indefinitely and shared internally.</li>
<li><b>Stakeholders.</b> Users, the company, you as the engineer, and regulators.</li>
<li><b>Ethical issues.</b> Collection without consent violates privacy and autonomy; "everyone does it" is not a justification.</li>
<li><b>Through the ACM Code.</b> 1.6 respect privacy; 1.2 avoid harm; 2.3 respect existing rules only when they are ethically sound; 3.1 act for the public good. A manager's request does not outrank the professional code.</li>
<li><b>Recommendation.</b> Refuse silent collection. Propose a consented, minimised, purpose-limited alternative (ask only when needed, retain briefly, let users opt out). Cite ACM 1.6 in writing; if pressed, escalate to legal/ethics. A code of ethics exists precisely for the moment it is inconvenient.</li>
</ol>
<a class="link-card dl" href="https://www.coursera.org/learn/ethical-data-driven-technology-leader" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 5 — Create &amp; Lead an Ethical Data-Driven Organization</span><span class="lc-sub">Ethical culture, governance &amp; code of ethics, on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Từ phán đoán cá nhân tới thể chế</h2>
<p class="lead">Thiện chí cá nhân không mở rộng quy mô được. Để giữ một tổ chức có đạo đức bạn cần <strong>quản trị</strong>: bộ quy tắc chung, chính sách thành văn, và một văn hoá nơi lên tiếng là an toàn (CLO4). Đây là thứ biến đạo đức từ ý kiến một người thành cách công ty thật sự vận hành.</p>
<h3>Bộ quy tắc đạo đức nghề nghiệp</h3>
<p>Nghề của bạn đã có sẵn các bộ quy tắc do những người đi trước viết. Hai cái bạn nên biết:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Bộ quy tắc đạo đức ACM</div><div class="lz-ld">"Đóng góp cho xã hội và phúc lợi con người," "tránh gây hại," "trung thực," "tôn trọng riêng tư." Các mệnh lệnh đạo đức chung cho người làm CNTT.</div></div>
  <div class="lz-layer"><div class="lz-lt">Bộ quy tắc đạo đức IEEE</div><div class="lz-ld">Đặt lên hàng đầu sự an toàn, sức khoẻ và phúc lợi của công chúng; công khai các yếu tố gây nguy hiểm cho công chúng; từ chối hối lộ; đối xử công bằng với mọi người.</div></div>
</div>
<p>Đây không chỉ là tấm áp phích. "Đặt an toàn công chúng lên hàng đầu" cho kỹ sư sự bảo trợ nghề nghiệp tường minh để <strong>từ chối</strong> hoặc <strong>báo cáo vượt cấp</strong> công việc mất an toàn — cả nghề, không chỉ cá nhân, đứng sau bổn phận đó.</p>
<h3>Một chính sách tổ chức tốt chứa gì</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nguyên lý</div><div class="lz-t">giá trị</div><div class="lz-d">tổ chức đại diện cho điều gì</div></div>
  <div class="lz-step"><div class="lz-k">Quy trình</div><div class="lz-t">ai duyệt gì</div><div class="lz-d">hội đồng review đạo đức, cổng phê duyệt</div></div>
  <div class="lz-step"><div class="lz-k">Vai trò</div><div class="lz-t">trách nhiệm giải trình</div><div class="lz-d">người có tên chịu trách nhiệm quyết định</div></div>
  <div class="lz-step"><div class="lz-k">Báo cáo</div><div class="lz-t">lên tiếng an toàn</div><div class="lz-d">bảo vệ người tố giác</div></div>
</div>
<div class="pitfall"><strong>Ngộ nhận:</strong> "Bọn tôi có bộ quy tắc đạo đức treo tường rồi, thế là ổn." Một bộ quy tắc không được thực thi, không được review, không có quy trình chống lưng là <em>diễn kịch đạo đức</em>. Điều làm một bộ quy tắc thành thật: lãnh đạo tuân thủ nó dưới áp lực, các cổng review thật sự chặn được một lần ra mắt, và bảo vệ người báo cáo vấn đề. Văn hoá "ăn" tấm áp phích vào bữa sáng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>An toàn tâm lý là bức tường chịu lực.</b> Dự án Aristotle của Google phát hiện yếu tố dự báo mạnh nhất cho nhóm hiệu quả không phải tài năng — mà là <em>an toàn tâm lý</em>: người ta thấy an toàn để lên tiếng. Mọi thất bại đạo đức lớn đều có cùng một dòng trong biên bản mổ xẻ: "có người biết, nhưng không thấy an toàn để nêu ra." Bộ quy tắc đạo đức chỉ hiệu quả nếu tổ chức thưởng cho người nói "dừng lại, việc này sai" thay vì trừng phạt họ. Quản trị là 20% tài liệu và 80% việc người ta có dám dùng chúng không.</div>
<h3>Ví dụ có lời giải · Phân tích tình huống từng bước</h3>
<p><b>Tình huống.</b> Quản lý sản phẩm yêu cầu bạn ghi vị trí GPS chính xác của người dùng ở chế độ nền "để phân tích", không hỏi đồng thuận và không giới hạn thời gian lưu. Về kỹ thuật thì dễ, và "ai cũng làm vậy".</p>
<ol>
<li><b>Sự thật.</b> Một SDK sẽ thu vị trí chính xác một cách âm thầm; không có opt-in; dữ liệu bị giữ vô thời hạn và chia sẻ nội bộ.</li>
<li><b>Các bên liên quan.</b> Người dùng, công ty, bạn với tư cách kỹ sư, và cơ quan quản lý.</li>
<li><b>Vấn đề đạo đức.</b> Thu thập không đồng thuận vi phạm quyền riêng tư và quyền tự chủ; "ai cũng làm" không phải lý do biện minh.</li>
<li><b>Soi qua Bộ quy tắc ACM.</b> 1.6 tôn trọng riêng tư; 1.2 tránh gây hại; 2.3 chỉ tuân quy tắc hiện hành khi chúng đúng về đạo đức; 3.1 hành động vì lợi ích công. Yêu cầu của một quản lý không đứng trên bộ quy tắc nghề.</li>
<li><b>Khuyến nghị.</b> Từ chối thu thập âm thầm. Đề xuất phương án có đồng thuận, tối giản, giới hạn mục đích (chỉ hỏi khi cần, giữ ngắn, cho người dùng tắt). Viện dẫn ACM 1.6 bằng văn bản; nếu bị ép, leo thang lên pháp lý/đạo đức. Một bộ quy tắc đạo đức tồn tại chính cho khoảnh khắc nó gây bất tiện.</li>
</ol>
<a class="link-card dl" href="https://www.coursera.org/learn/ethical-data-driven-technology-leader" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC 5 — Create &amp; Lead an Ethical Data-Driven Organization</span><span class="lc-sub">Văn hoá đạo đức, quản trị &amp; bộ quy tắc, trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: '5.2 — Regulation & AI governance|||5.2 — Quy định & quản trị AI',
          slug: 'ite302c-5-2-quy-dinh-quan-tri-ai',
          type: 'VIDEO',
          description: 'GDPR, EU AI Act và khung quản trị AI dựa trên rủi ro — luật là sàn của đạo đức.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>The rules that bind — and how AI is governed</h2>
<p class="lead">Ethics is voluntary; regulation is not. A professional must know the major legal frameworks and how AI governance is structured, because compliance is the floor beneath every ethical decision (CLO4).</p>
<h3>GDPR — the privacy benchmark</h3>
<p>The EU's General Data Protection Regulation set the global standard for data rights. Key ideas you must recognise:</p>
<ul>
  <li><strong>Lawful basis &amp; consent</strong> — you need a valid reason to process personal data.</li>
  <li><strong>Data-subject rights</strong> — access, correction, erasure ("right to be forgotten"), portability.</li>
  <li><strong>Purpose limitation &amp; minimisation</strong> — echoing Chapter 3's principles, now as law.</li>
  <li><strong>Article 22</strong> — protection against solely automated decisions with significant effects.</li>
  <li><strong>Teeth</strong> — fines up to 4% of global annual revenue. This is why boards listen.</li>
</ul>
<h3>Risk-based AI governance</h3>
<p>Modern AI governance (e.g. the EU AI Act) grades systems by <strong>risk level</strong> and applies proportionate rules:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Unacceptable risk</div><div class="lz-ld">Banned outright (e.g. social scoring, manipulative systems that exploit vulnerabilities).</div></div>
  <div class="lz-layer"><div class="lz-lt">High risk</div><div class="lz-ld">Hiring, credit, medical, law enforcement — allowed but with strict duties: risk management, documentation, human oversight, transparency.</div></div>
  <div class="lz-layer"><div class="lz-lt">Limited risk</div><div class="lz-ld">Transparency obligations (e.g. tell users they're talking to a bot; label AI-generated content).</div></div>
  <div class="lz-layer"><div class="lz-lt">Minimal risk</div><div class="lz-ld">Most everyday software — few or no extra obligations.</div></div>
</div>
<div class="note-ct">This ties the whole course together: the <em>frameworks</em> (Ch1) tell you what's right, the <em>bias &amp; risk</em> work (Ch2–3) finds concrete harms, <em>communication</em> (Ch4) moves people, and <em>governance + regulation</em> (Ch5) makes it durable and enforceable. Ethics without governance fades; governance without ethics is empty compliance.</div>
<div class="pitfall"><strong>Misconception:</strong> "If we're compliant with the law, we're ethical." Compliance is necessary but not sufficient — the law lags behind technology, so plenty of harmful things are still legal. Regulation is the floor; ethics asks what you should do in the large space the law hasn't reached yet. The best organisations aim above the line, not just at it.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Dual-use &amp; the responsibility that doesn't end at deployment.</b> Almost any powerful technology is <em>dual-use</em>: face recognition finds missing children <em>and</em> enables mass surveillance; a generative model writes tutorials <em>and</em> phishing emails. Governance therefore can't stop at "does it work?" — it must ask "how could this be misused, and what do we owe the people it could harm?" Responsible release, usage policies, and monitoring after launch are part of the ethical duty, not optional extras. The engineer who builds it shares responsibility for how it can be used.</div>
<h3>Ví dụ có lời giải · Worked case analysis</h3>
<p><b>Situation.</b> An EU-based startup wants to deploy live facial recognition in public squares to "improve security", selling it to city councils.</p>
<ol>
<li><b>Facts.</b> Real-time biometric identification of the public, in EU jurisdiction, at scale, without individual consent.</li>
<li><b>Stakeholders.</b> The surveilled public, the startup, city clients, and regulators.</li>
<li><b>Ethical &amp; legal issues.</b> Real-time remote biometric ID in public is treated as unacceptable/high-risk under the EU AI Act; GDPR Article 9 makes biometric data a special category needing a strong legal basis.</li>
<li><b>Through governance.</b> Map to the AI Act risk tiers (this lands at the prohibited/high-risk end); GDPR requires a Data Protection Impact Assessment; accountability and human oversight are mandatory, not optional.</li>
<li><b>Recommendation.</b> Do not deploy real-time public biometric identification in the EU. If any narrow, lawful use exists, run a DPIA first, establish an explicit legal basis, minimise scope, add human oversight, and register the system per the AI Act. Governance is a design constraint, not paperwork after the fact.</li>
</ol>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Những luật ràng buộc — và AI được quản trị thế nào</h2>
<p class="lead">Đạo đức là tự nguyện; quy định thì không. Người chuyên nghiệp phải biết các khung pháp lý lớn và cách quản trị AI được tổ chức, vì tuân thủ là cái sàn dưới mọi quyết định đạo đức (CLO4).</p>
<h3>GDPR — chuẩn mực về riêng tư</h3>
<p>Quy định Bảo vệ Dữ liệu Chung (GDPR) của EU đặt chuẩn toàn cầu cho quyền dữ liệu. Các ý then chốt bạn phải nhận ra:</p>
<ul>
  <li><strong>Cơ sở hợp pháp &amp; đồng thuận</strong> — cần lý do hợp lệ để xử lý dữ liệu cá nhân.</li>
  <li><strong>Quyền của chủ thể dữ liệu</strong> — truy cập, chỉnh sửa, xoá ("quyền được lãng quên"), khả chuyển.</li>
  <li><strong>Giới hạn mục đích &amp; giảm thiểu</strong> — vọng lại các nguyên tắc Chương 3, nay thành luật.</li>
  <li><strong>Điều 22</strong> — bảo vệ khỏi quyết định hoàn toàn tự động có hệ quả đáng kể.</li>
  <li><strong>Có "răng"</strong> — phạt tới 4% doanh thu toàn cầu hằng năm. Đó là lý do hội đồng quản trị lắng nghe.</li>
</ul>
<h3>Quản trị AI dựa trên rủi ro</h3>
<p>Quản trị AI hiện đại (vd EU AI Act) phân loại hệ thống theo <strong>mức rủi ro</strong> và áp quy tắc tương xứng:</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Rủi ro không chấp nhận được</div><div class="lz-ld">Cấm thẳng (vd chấm điểm xã hội, hệ thống thao túng khai thác điểm yếu).</div></div>
  <div class="lz-layer"><div class="lz-lt">Rủi ro cao</div><div class="lz-ld">Tuyển dụng, tín dụng, y tế, hành pháp — được phép nhưng kèm bổn phận nghiêm: quản lý rủi ro, tài liệu, giám sát của con người, minh bạch.</div></div>
  <div class="lz-layer"><div class="lz-lt">Rủi ro giới hạn</div><div class="lz-ld">Nghĩa vụ minh bạch (vd báo người dùng đang nói với bot; gắn nhãn nội dung do AI tạo).</div></div>
  <div class="lz-layer"><div class="lz-lt">Rủi ro tối thiểu</div><div class="lz-ld">Phần lớn phần mềm thường ngày — ít hoặc không có nghĩa vụ thêm.</div></div>
</div>
<div class="note-ct">Đây là chỗ buộc cả môn học lại: các <em>khung</em> (Ch1) cho biết điều gì đúng, phần <em>thiên kiến &amp; rủi ro</em> (Ch2–3) tìm tổn hại cụ thể, <em>truyền đạt</em> (Ch4) khiến người ta chuyển động, và <em>quản trị + quy định</em> (Ch5) làm nó bền và cưỡng chế được. Đạo đức không có quản trị sẽ phai; quản trị không có đạo đức là tuân thủ rỗng.</div>
<div class="pitfall"><strong>Ngộ nhận:</strong> "Tuân thủ luật là có đạo đức." Tuân thủ là cần nhưng chưa đủ — luật đi sau công nghệ, nên rất nhiều thứ gây hại vẫn hợp pháp. Quy định là sàn; đạo đức hỏi bạn nên làm gì trong khoảng không rộng mà luật chưa với tới. Tổ chức tốt nhất nhắm cao hơn vạch, không chỉ chạm vạch.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Lưỡng dụng (dual-use) &amp; trách nhiệm không dừng ở lúc triển khai.</b> Gần như mọi công nghệ mạnh đều <em>lưỡng dụng</em>: nhận diện khuôn mặt tìm trẻ lạc <em>và</em> cho phép giám sát hàng loạt; một mô hình tạo sinh viết hướng dẫn <em>và</em> email lừa đảo. Vì thế quản trị không thể dừng ở "nó có chạy không?" — phải hỏi "nó có thể bị lạm dụng thế nào, và ta nợ gì những người nó có thể gây hại?" Phát hành có trách nhiệm, chính sách sử dụng, và giám sát sau khi ra mắt là một phần của bổn phận đạo đức, không phải phần thêm tuỳ chọn. Kỹ sư xây nó chia sẻ trách nhiệm về cách nó bị dùng.</div>
<h3>Ví dụ có lời giải · Phân tích tình huống từng bước</h3>
<p><b>Tình huống.</b> Một startup đặt tại EU muốn triển khai nhận diện khuôn mặt trực tiếp ở quảng trường công cộng để "tăng cường an ninh", bán cho chính quyền thành phố.</p>
<ol>
<li><b>Sự thật.</b> Nhận dạng sinh trắc thời gian thực với công chúng, trong phạm vi tài phán EU, ở quy mô lớn, không có đồng thuận cá nhân.</li>
<li><b>Các bên liên quan.</b> Công chúng bị giám sát, startup, khách hàng là thành phố, và cơ quan quản lý.</li>
<li><b>Vấn đề đạo đức &amp; pháp lý.</b> Nhận dạng sinh trắc từ xa thời gian thực nơi công cộng bị xem là không chấp nhận được/rủi ro cao theo Đạo luật AI của EU; GDPR Điều 9 xếp dữ liệu sinh trắc vào loại đặc biệt cần cơ sở pháp lý mạnh.</li>
<li><b>Soi qua quản trị.</b> Ánh xạ vào các bậc rủi ro của Đạo luật AI (ca này rơi vào nhóm bị cấm/rủi ro cao); GDPR yêu cầu Đánh giá tác động bảo vệ dữ liệu (DPIA); trách nhiệm giải trình và giám sát của con người là bắt buộc, không tuỳ chọn.</li>
<li><b>Khuyến nghị.</b> Không triển khai nhận dạng sinh trắc công cộng thời gian thực ở EU. Nếu có một mục đích hẹp và hợp pháp, làm DPIA trước, thiết lập cơ sở pháp lý rõ ràng, tối giản phạm vi, thêm giám sát của con người, và đăng ký hệ thống theo Đạo luật AI. Quản trị là ràng buộc thiết kế, không phải giấy tờ làm sau.</li>
</ol>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'ite302c-quiz-ch5',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: bộ quy tắc, chính sách, GDPR & quản trị AI.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The ACM and IEEE codes of ethics primarily serve to…|||Bộ quy tắc đạo đức ACM và IEEE chủ yếu để…', options: ['replace the law|||thay thế pháp luật', 'give computing professionals shared ethical duties (e.g. hold public safety paramount)|||cho người làm CNTT các bổn phận đạo đức chung (vd đặt an toàn công chúng lên hàng đầu)', 'guarantee higher salaries|||bảo đảm lương cao hơn', 'ban all AI|||cấm mọi AI'], correctIndex: 1, points: 1 },
              { question: 'Under a risk-based AI governance approach (e.g. EU AI Act), a hiring or credit-scoring system is typically classed as…|||Theo cách quản trị AI dựa trên rủi ro (vd EU AI Act), hệ thống tuyển dụng hay chấm điểm tín dụng thường thuộc loại…', options: ['minimal risk|||rủi ro tối thiểu', 'high risk — allowed but with strict duties|||rủi ro cao — được phép nhưng kèm bổn phận nghiêm', 'unacceptable risk — banned|||rủi ro không chấp nhận — bị cấm', 'not covered at all|||không thuộc phạm vi'], correctIndex: 1, points: 1 },
              { question: 'What gives GDPR its "teeth" that makes boards pay attention?|||Điều gì cho GDPR "răng" khiến hội đồng quản trị chú ý?', options: ['it is only a suggestion|||nó chỉ là gợi ý', 'fines up to 4% of global annual revenue|||phạt tới 4% doanh thu toàn cầu hằng năm', 'it applies only to startups|||chỉ áp cho startup', 'it has no enforcement|||không có cưỡng chế'], correctIndex: 1, points: 1 },
              { question: '"We are fully compliant with the law, so we are ethical." The best response is…|||"Bọn tôi tuân thủ luật đầy đủ, nên có đạo đức." Phản hồi đúng nhất là…', options: ['correct — law and ethics are identical|||đúng — luật và đạo đức đồng nhất', 'compliance is the floor; the law lags tech, so ethics asks for more in the space law has not reached|||tuân thủ là sàn; luật đi sau công nghệ, nên đạo đức đòi hỏi hơn ở khoảng luật chưa với tới', 'ethics is irrelevant if you follow the law|||đạo đức không liên quan nếu theo luật', 'the law is always ahead of technology|||luật luôn đi trước công nghệ'], correctIndex: 1, points: 1 },
              { question: 'A technology being "dual-use" means…|||Một công nghệ "lưỡng dụng" nghĩa là…', options: ['it can only be used twice|||chỉ dùng được hai lần', 'it can serve beneficial and harmful purposes, so governance must consider misuse|||nó phục vụ cả mục đích có lợi và có hại, nên quản trị phải xét khả năng lạm dụng', 'it needs two engineers|||cần hai kỹ sư', 'it is exempt from regulation|||được miễn quy định'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ PROGRESS TEST — ÔN & KIỂM TRA GIỮA CHẶNG ══════════════════ */
    {
      title: 'Progress Test — Review & Checkpoint|||Progress Test — Ôn tập & kiểm tra giữa chặng',
      description: 'Tổng ôn Chương 1–5 và một bài kiểm 8 câu mô phỏng đề trắc nghiệm cuối kỳ.',
      lessons: [
        {
          title: 'PT.1 — Review: the whole ethics toolkit|||PT.1 — Ôn tập: toàn bộ bộ công cụ đạo đức',
          slug: 'ite302c-pt-1-on-tap',
          type: 'VIDEO',
          description: 'Bản đồ ôn tập gói gọn 5 chương thành một trang trước khi làm bài kiểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Progress Test · Review</span>
<h2>Everything so far, on one page</h2>
<p class="lead">Before the checkpoint, fix the whole arc in your head. The exam rewards students who can move fluidly between these five layers on any scenario.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">1 · Frameworks (CLO1)</div><div class="lz-ld">Consequentialism/utilitarianism · deontology · virtue · contractarianism. Triangulate; law is the floor; Rawls' veil for fairness.</div></div>
  <div class="lz-layer"><div class="lz-lt">2 · Bias (CLO2)</div><div class="lz-ld">Cognitive: selection, measurement, confirmation, automation. Algorithmic: COMPAS, Amazon hiring. Deleting the sensitive column ≠ fair; proxies persist.</div></div>
  <div class="lz-layer"><div class="lz-lt">3 · Detect &amp; mitigate (CLO2)</div><div class="lz-ld">Privacy (minimisation, consent, differential privacy). Fairness metrics (parity, equal opportunity). Transparency &amp; explainability; black box vs interpretable; accountability.</div></div>
  <div class="lz-layer"><div class="lz-lt">4 · Communicate (CLO3)</div><div class="lz-ld">Frame per stakeholder; translate, don't dumb down. Crisis: fast, honest, concrete, consistent.</div></div>
  <div class="lz-layer"><div class="lz-lt">5 · Govern (CLO4)</div><div class="lz-ld">ACM/IEEE codes; policy + psychological safety; GDPR (Art.22, 4% fines); risk-based AI governance; dual-use.</div></div>
</div>
<div class="callout ok">Exam tactic: for any scenario question, silently run the ladder — <em>which framework? which bias? which mitigation? which audience? which rule?</em> The correct answer is almost always the one that <strong>names the specific concept</strong> and applies it, not the vague "it's just wrong" option.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Progress Test · Ôn tập</span>
<h2>Tất cả cho tới giờ, trên một trang</h2>
<p class="lead">Trước điểm kiểm tra, hãy đóng chặt cả mạch chuyện vào đầu. Đề thưởng cho ai di chuyển mượt mà giữa năm tầng này trên bất kỳ tình huống nào.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">1 · Khung (CLO1)</div><div class="lz-ld">Hệ quả luận/vị lợi · nghĩa vụ luận · đức hạnh · khế ước. Tam giác hoá; luật là sàn; bức màn Rawls cho công bằng.</div></div>
  <div class="lz-layer"><div class="lz-lt">2 · Thiên kiến (CLO2)</div><div class="lz-ld">Nhận thức: chọn mẫu, đo lường, xác nhận, tự động hoá. Thuật toán: COMPAS, tuyển dụng Amazon. Xoá cột nhạy cảm ≠ công bằng; proxy vẫn còn.</div></div>
  <div class="lz-layer"><div class="lz-lt">3 · Phát hiện &amp; giảm thiểu (CLO2)</div><div class="lz-ld">Riêng tư (giảm thiểu, đồng thuận, riêng tư vi phân). Thước đo công bằng (parity, cơ hội bình đẳng). Minh bạch &amp; giải thích; hộp đen vs diễn giải; trách nhiệm giải trình.</div></div>
  <div class="lz-layer"><div class="lz-lt">4 · Truyền đạt (CLO3)</div><div class="lz-ld">Đóng khung theo từng bên; chuyển ngữ, đừng làm ngu hoá. Khủng hoảng: nhanh, trung thực, cụ thể, nhất quán.</div></div>
  <div class="lz-layer"><div class="lz-lt">5 · Quản trị (CLO4)</div><div class="lz-ld">Bộ quy tắc ACM/IEEE; chính sách + an toàn tâm lý; GDPR (Điều 22, phạt 4%); quản trị AI dựa rủi ro; lưỡng dụng.</div></div>
</div>
<div class="callout ok">Chiến thuật thi: với mọi câu tình huống, thầm chạy cái thang — <em>khung nào? thiên kiến nào? cách giảm thiểu nào? đối tượng nào? quy tắc nào?</em> Đáp án đúng gần như luôn là cái <strong>gọi tên khái niệm cụ thể</strong> và áp dụng nó, không phải lựa chọn mơ hồ "nó sai thế thôi".</div>
</div>
`,
        },
        {
          title: 'PT.2 — Progress Test (8 questions)|||PT.2 — Bài kiểm giữa chặng (8 câu)',
          slug: 'ite302c-pt-2-progress-test',
          type: 'QUIZ',
          description: 'Bài kiểm 8 câu mô phỏng đề trắc nghiệm cuối kỳ, trộn cả 5 chương.',
          quiz: {
            timeLimitSeconds: 600,
            questions: [
              { question: 'A ride-share app raises prices during an emergency evacuation, maximising revenue but harming people fleeing danger. Which lens most directly condemns this?|||Một app gọi xe tăng giá trong lúc sơ tán khẩn cấp, tối đa doanh thu nhưng hại người đang chạy nạn. Ống kính nào lên án việc này trực tiếp nhất?', options: ['Pure profit maximisation|||Tối đa lợi nhuận thuần', 'Contractarian/deontological: people would never consent to exploitation in crisis; it treats them as a means|||Khế ước/nghĩa vụ luận: không ai đồng thuận bị bóc lột lúc khủng hoảng; nó coi họ là phương tiện', 'It is fully ethical|||Nó hoàn toàn có đạo đức', 'Automation bias|||Thiên kiến tự động hoá'], correctIndex: 1, points: 1 },
              { question: 'A model is trained on data where a minority group is barely represented, so it performs worse for them. This is primarily…|||Một mô hình huấn luyện trên dữ liệu mà nhóm thiểu số gần như không có mặt, nên chạy tệ hơn với họ. Đây chủ yếu là…', options: ['confirmation bias|||thiên kiến xác nhận', 'selection (sampling) bias|||thiên kiến chọn mẫu', 'a hardware fault|||lỗi phần cứng', 'good design|||thiết kế tốt'], correctIndex: 1, points: 1 },
              { question: 'The lesson from Amazon\\u2019s scrapped hiring tool is that…|||Bài học từ công cụ tuyển dụng bị Amazon huỷ là…', options: ['removing the gender field guarantees fairness|||bỏ trường giới tính bảo đảm công bằng', 'proxy features can reintroduce bias, so you must test outcomes across groups|||các đặc trưng proxy có thể đưa thiên kiến trở lại, nên phải kiểm kết quả theo nhóm', 'ML hiring is always illegal|||tuyển dụng bằng ML luôn phạm luật', 'accuracy is the only concern|||chính xác là mối lo duy nhất'], correctIndex: 1, points: 1 },
              { question: 'For a loan-denial system affecting people\\u2019s rights, why might an interpretable model beat a 1%-more-accurate black box?|||Với hệ thống từ chối vay ảnh hưởng quyền lợi, vì sao mô hình diễn giải có thể thắng một hộp đen chính xác hơn 1%?', options: ['it is cheaper to run|||chạy rẻ hơn', 'decisions affecting rights must be explainable and contestable (cf. GDPR Art.22)|||quyết định ảnh hưởng quyền phải giải thích và phản bác được (x. Điều 22 GDPR)', 'black boxes are illegal everywhere|||hộp đen phạm luật khắp nơi', 'interpretable models never make mistakes|||mô hình diễn giải không bao giờ sai'], correctIndex: 1, points: 1 },
              { question: 'When a data-ethics failure becomes public, the best communication approach is…|||Khi một thất bại đạo đức dữ liệu bung ra công khai, cách truyền đạt tốt nhất là…', options: ['stay silent and hope it passes|||im lặng và mong nó qua', 'fast, honest, concrete about fixes, and consistent internally and externally|||nhanh, trung thực, cụ thể về cách sửa, nhất quán trong và ngoài', 'blame the users publicly|||đổ lỗi công khai cho người dùng', 'tell each audience a different story|||kể mỗi đối tượng một câu chuyện khác'], correctIndex: 1, points: 1 },
              { question: 'Differential privacy protects individuals by…|||Riêng tư vi phân bảo vệ cá nhân bằng cách…', options: ['deleting all data|||xoá mọi dữ liệu', 'adding calibrated noise so any one person barely changes the result, bounding what can be learned about them|||thêm nhiễu hiệu chỉnh để một cá nhân gần như không đổi kết quả, giới hạn điều học được về họ', 'encrypting the database name|||mã hoá tên cơ sở dữ liệu', 'making the model bigger|||làm mô hình lớn hơn'], correctIndex: 1, points: 1 },
              { question: 'An engineer discovers a safety risk but says nothing because raising it feels career-threatening. The governance concept most at fault is…|||Một kỹ sư phát hiện rủi ro an toàn nhưng im lặng vì nêu ra thấy đe doạ sự nghiệp. Khái niệm quản trị có lỗi nhất là…', options: ['too much documentation|||quá nhiều tài liệu', 'lack of psychological safety / whistleblower protection|||thiếu an toàn tâm lý / bảo vệ người tố giác', 'excessive accuracy|||độ chính xác thái quá', 'GDPR fines|||phạt GDPR'], correctIndex: 1, points: 1 },
              { question: 'Face recognition can find missing children and enable mass surveillance. This property is called…|||Nhận diện khuôn mặt có thể tìm trẻ lạc và cho phép giám sát hàng loạt. Tính chất này gọi là…', options: ['open source|||mã nguồn mở', 'dual-use — it serves beneficial and harmful purposes|||lưỡng dụng — phục vụ cả mục đích có lợi và có hại', 'demographic parity|||ngang bằng nhân khẩu', 'purpose limitation|||giới hạn mục đích'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — NÂNG CAO: ĐẠO ĐỨC AI HIỆN ĐẠI ══════════════════ */
    {
      title: 'Chapter 6 — Advanced: Modern AI Ethics|||Chương 6 — Nâng cao: Đạo đức AI hiện đại',
      description: 'Ngoài giáo trình: tác hại của AI tạo sinh & LLM, deepfake, và vấn đề căn chỉnh (alignment).',
      lessons: [
        {
          title: '6.1 — Generative AI harms, deepfakes & alignment|||6.1 — Tác hại AI tạo sinh, deepfake & căn chỉnh',
          slug: 'ite302c-6-1-ai-hien-dai',
          type: 'VIDEO',
          description: 'Các rủi ro đạo đức đặc thù của mô hình tạo sinh: ảo giác, deepfake, bản quyền, và alignment.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1 · Beyond the syllabus</span>
<h2>The new frontier — generative AI</h2>
<p class="lead">The frameworks you learned apply to any technology, but generative AI (large language models, image and video generators) creates <strong>new categories of harm</strong> the classic cases didn't anticipate. A modern ethics professional must know them.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Hallucination &amp; misinformation</div><div class="lz-ld">LLMs produce fluent, confident text that can be <em>plainly false</em>. Automation bias makes people trust it — dangerous in medical, legal or news use.</div></div>
  <div class="lz-layer"><div class="lz-lt">Deepfakes &amp; synthetic media</div><div class="lz-ld">Convincing fake video/audio of real people — enabling fraud, non-consensual imagery, election disinformation, and eroding trust in all recorded evidence.</div></div>
  <div class="lz-layer"><div class="lz-lt">Training data &amp; consent</div><div class="lz-ld">Models trained on scraped work raise copyright, attribution and consent questions — creators' output used without permission or pay.</div></div>
  <div class="lz-layer"><div class="lz-lt">Bias at scale</div><div class="lz-ld">Generative models absorb and reproduce the stereotypes in their training corpus, now generating them on demand across billions of outputs.</div></div>
  <div class="lz-layer"><div class="lz-lt">Labour &amp; environmental cost</div><div class="lz-ld">Human data-labelling under harsh conditions; significant energy and water for training and serving large models.</div></div>
</div>
<h3>The alignment problem</h3>
<p><strong>Alignment</strong> asks: how do we make an AI system reliably do what we actually intend — including our unstated values — rather than optimising a literal proxy in harmful ways? A system told to "maximise engagement" may learn that outrage works best; one told to "be helpful" may become sycophantic or help with harmful requests. The gap between <em>what we asked for</em> and <em>what we meant</em> is where much AI harm lives.</p>
<div class="pitfall"><strong>Misconception:</strong> "If the AI is very capable, it will naturally do the right thing." Capability and values are independent. A more powerful system pursuing a slightly wrong objective causes <em>more</em> harm, not less — competence without alignment amplifies mistakes. This is why safety and ethics work must scale <em>with</em> capability, not lag behind it.</p></div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "right to explanation" meets the black box, hard.</b> Generative models are the ultimate black box — even their creators can't fully explain a specific output. That collides directly with GDPR Article 22 and with accountability: if you deploy an LLM to make or shape decisions about people, "we can't explain why it said that" is not a defence, it's a liability. The ethical use of generative AI in high-stakes settings requires guardrails, human oversight, and honest disclosure of limits — the whole toolkit of this course applied to the hardest case.</div>
<h3>Ví dụ có lời giải · Worked case analysis</h3>
<p><b>Situation.</b> A health startup ships a generative-AI chatbot that answers medical questions. It sometimes states dangerous advice with full confidence, carries no disclaimer, and was trained partly on scraped copyrighted forum posts.</p>
<ol>
<li><b>Facts.</b> The LLM is confidently wrong on some queries; there is no warning about limits; the provenance and licensing of the training data are unclear.</li>
<li><b>Stakeholders.</b> Users/patients, the startup, the content owners whose data was scraped, and regulators.</li>
<li><b>Ethical issues.</b> Safety (hallucination in a high-stakes domain), transparency (no disclosure of limits), and consent/IP over the training data — three course themes at once.</li>
<li><b>Through the lenses.</b> Utilitarian: wider access to health info against real harm from bad advice. Deontology: a duty not to endanger users. Professional + emerging AI norms (ACM avoid harm and be honest about capabilities): high-stakes GenAI needs guardrails and human oversight.</li>
<li><b>Recommendation.</b> Add guardrails that refuse or defer high-risk medical questions, keep a human in the loop, show a clear "not medical advice, may be wrong" disclosure, and audit and license the training data. This is the whole toolkit of the course applied to the hardest case.</li>
</ol>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1 · Ngoài giáo trình</span>
<h2>Biên giới mới — AI tạo sinh</h2>
<p class="lead">Các khung bạn học áp cho mọi công nghệ, nhưng AI tạo sinh (mô hình ngôn ngữ lớn, bộ tạo ảnh và video) tạo ra <strong>những loại tổn hại mới</strong> mà các vụ kinh điển chưa lường. Một chuyên gia đạo đức hiện đại phải biết chúng.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Ảo giác &amp; thông tin sai</div><div class="lz-ld">LLM tạo văn bản trôi chảy, tự tin mà có thể <em>sai trắng trợn</em>. Thiên kiến tự động hoá khiến người ta tin nó — nguy hiểm trong y tế, pháp lý hay tin tức.</div></div>
  <div class="lz-layer"><div class="lz-lt">Deepfake &amp; truyền thông tổng hợp</div><div class="lz-ld">Video/âm thanh giả thuyết phục về người thật — cho phép lừa đảo, hình ảnh phi đồng thuận, tin giả bầu cử, và bào mòn niềm tin vào mọi bằng chứng ghi lại.</div></div>
  <div class="lz-layer"><div class="lz-lt">Dữ liệu huấn luyện &amp; đồng thuận</div><div class="lz-ld">Mô hình huấn luyện trên tác phẩm bị thu thập đặt ra câu hỏi bản quyền, ghi công và đồng thuận — sản phẩm của người sáng tạo bị dùng không phép hay không trả công.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thiên kiến ở quy mô lớn</div><div class="lz-ld">Mô hình tạo sinh hấp thụ và tái tạo định kiến trong kho huấn luyện, nay sinh ra chúng theo yêu cầu trên hàng tỷ đầu ra.</div></div>
  <div class="lz-layer"><div class="lz-lt">Chi phí lao động &amp; môi trường</div><div class="lz-ld">Người gán nhãn dữ liệu trong điều kiện khắc nghiệt; năng lượng và nước đáng kể để huấn luyện và vận hành mô hình lớn.</div></div>
</div>
<h3>Vấn đề căn chỉnh (alignment)</h3>
<p><strong>Alignment</strong> hỏi: làm sao khiến một hệ thống AI làm đúng điều ta thật sự chủ ý — kể cả các giá trị không nói ra — thay vì tối ưu một đại diện theo nghĩa đen theo cách gây hại? Một hệ thống được bảo "tối đa tương tác" có thể học rằng phẫn nộ hiệu quả nhất; một hệ thống được bảo "hãy hữu ích" có thể thành nịnh bợ hoặc giúp cả yêu cầu gây hại. Khoảng cách giữa <em>điều ta yêu cầu</em> và <em>điều ta muốn</em> là nơi phần nhiều tổn hại AI trú.</p>
<div class="pitfall"><strong>Ngộ nhận:</strong> "Nếu AI rất giỏi, nó tự nhiên sẽ làm điều đúng." Năng lực và giá trị độc lập với nhau. Một hệ thống mạnh hơn theo đuổi một mục tiêu hơi sai gây <em>nhiều</em> tổn hại hơn, không phải ít — giỏi mà không căn chỉnh sẽ khuếch đại sai lầm. Đó là lý do công tác an toàn và đạo đức phải mở rộng <em>cùng</em> năng lực, không đi sau nó.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Quyền được giải thích" đụng chiếc hộp đen, rất mạnh.</b> Mô hình tạo sinh là hộp đen tột cùng — ngay cả người tạo ra cũng không giải thích đầy đủ một đầu ra cụ thể. Điều đó va thẳng với Điều 22 GDPR và với trách nhiệm giải trình: nếu bạn triển khai một LLM để ra hay định hình quyết định về con người, "bọn tôi không giải thích được vì sao nó nói thế" không phải biện hộ, mà là trách nhiệm pháp lý. Dùng AI tạo sinh có đạo đức trong bối cảnh hệ trọng đòi hỏi rào chắn, giám sát của con người, và công khai trung thực về giới hạn — cả bộ công cụ của môn này áp vào ca khó nhất.</div>
<h3>Ví dụ có lời giải · Phân tích tình huống từng bước</h3>
<p><b>Tình huống.</b> Một startup y tế ra mắt chatbot AI tạo sinh trả lời câu hỏi y khoa. Đôi khi nó nói lời khuyên nguy hiểm với vẻ đầy tự tin, không kèm cảnh báo, và được huấn luyện một phần trên bài diễn đàn có bản quyền bị cào về.</p>
<ol>
<li><b>Sự thật.</b> LLM sai một cách tự tin ở một số câu hỏi; không có cảnh báo về giới hạn; nguồn gốc và giấy phép của dữ liệu huấn luyện không rõ.</li>
<li><b>Các bên liên quan.</b> Người dùng/bệnh nhân, startup, chủ nội dung bị cào dữ liệu, và cơ quan quản lý.</li>
<li><b>Vấn đề đạo đức.</b> An toàn (ảo giác trong lĩnh vực hệ trọng), minh bạch (không công khai giới hạn), và đồng thuận/sở hữu trí tuệ với dữ liệu huấn luyện — ba chủ đề của môn cùng lúc.</li>
<li><b>Soi qua lăng kính.</b> Vị lợi: mở rộng tiếp cận thông tin y tế đổi lấy nguy cơ hại thật từ lời khuyên sai. Bổn phận: nghĩa vụ không gây nguy hiểm cho người dùng. Nghề nghiệp + chuẩn mực AI mới nổi (ACM tránh gây hại và trung thực về năng lực): GenAI hệ trọng cần rào chắn và giám sát của con người.</li>
<li><b>Khuyến nghị.</b> Thêm rào chắn để từ chối hoặc trì hoãn câu hỏi y khoa rủi ro cao, giữ con người trong vòng lặp, hiển thị rõ "không phải lời khuyên y tế, có thể sai", và kiểm toán + cấp phép dữ liệu huấn luyện. Đây là cả bộ công cụ của môn áp vào ca khó nhất.</li>
</ol>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'ite302c-quiz-ch6',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: tác hại AI tạo sinh & alignment.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'An LLM producing fluent but factually false text is called…|||Một LLM tạo văn bản trôi chảy nhưng sai sự thật gọi là…', options: ['alignment|||căn chỉnh', 'hallucination|||ảo giác', 'differential privacy|||riêng tư vi phân', 'encryption|||mã hoá'], correctIndex: 1, points: 1 },
              { question: 'The alignment problem is essentially the gap between…|||Vấn đề căn chỉnh về bản chất là khoảng cách giữa…', options: ['hardware and software|||phần cứng và phần mềm', 'what we literally asked the system to optimise and what we actually intended|||điều ta yêu cầu hệ thống tối ưu theo nghĩa đen và điều ta thật sự chủ ý', 'training and testing data|||dữ liệu huấn luyện và kiểm thử', 'two programming languages|||hai ngôn ngữ lập trình'], correctIndex: 1, points: 1 },
              { question: 'Why does automation bias make LLM hallucinations especially dangerous?|||Vì sao thiên kiến tự động hoá khiến ảo giác của LLM đặc biệt nguy hiểm?', options: ['it makes the model slower|||nó làm mô hình chậm hơn', 'people over-trust confident machine output and skip verification|||người ta tin quá mức đầu ra tự tin của máy và bỏ kiểm chứng', 'it improves accuracy|||nó nâng độ chính xác', 'it has no effect|||không ảnh hưởng gì'], correctIndex: 1, points: 1 },
              { question: 'A more capable AI pursuing a slightly wrong objective tends to cause…|||Một AI giỏi hơn theo đuổi mục tiêu hơi sai có xu hướng gây…', options: ['less harm automatically|||ít tổn hại hơn một cách tự động', 'more harm — capability without alignment amplifies mistakes|||nhiều tổn hại hơn — năng lực không căn chỉnh khuếch đại sai lầm', 'no harm ever|||không bao giờ tổn hại', 'only financial harm|||chỉ tổn hại tài chính'], correctIndex: 1, points: 1 },
              { question: 'Deepfakes raise a broad societal harm beyond any single fraud, namely…|||Deepfake gây một tổn hại xã hội rộng vượt khỏi một vụ lừa đơn lẻ, đó là…', options: ['faster internet|||internet nhanh hơn', 'eroding trust in all recorded audio/video evidence|||bào mòn niềm tin vào mọi bằng chứng âm thanh/video ghi lại', 'cheaper storage|||lưu trữ rẻ hơn', 'better compression|||nén tốt hơn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 7 — NÂNG CAO: CÁC VỤ ÁN KINH ĐIỂN ══════════════════ */
    {
      title: 'Chapter 7 — Advanced: Landmark Case Studies|||Chương 7 — Nâng cao: Các vụ án kinh điển',
      description: 'Ngoài giáo trình: Therac-25, Volkswagen Dieselgate và Cambridge Analytica — mổ xẻ theo khung đạo đức.',
      lessons: [
        {
          title: '7.1 — Therac-25, Dieselgate & Cambridge Analytica|||7.1 — Therac-25, Dieselgate & Cambridge Analytica',
          slug: 'ite302c-7-1-case-studies',
          type: 'VIDEO',
          description: 'Ba vụ án bắt buộc biết: an toàn phần mềm, gian lận có chủ đích, và lạm dụng dữ liệu — phân tích từng vụ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1 · Beyond the syllabus</span>
<h2>Three cases every technologist must know</h2>
<p class="lead">Principles stick when they're attached to stories. These three are the field's cautionary classics — each illustrates a different failure mode, and each is analysed with the frameworks from Chapter 1.</p>
<h3>Ví dụ có lời giải · Therac-25 — when a software bug kills</h3>
<div class="out"><b>What happened.</b> The Therac-25 (1985–87) was a radiation-therapy machine. Software race conditions let it deliver massive radiation overdoses; at least six patients were seriously injured or killed.<br><br>
<b>Why it's a landmark.</b> It's the canonical proof that <em>software safety is life-safety</em>. Root causes: no independent code review, over-reliance on software interlocks after removing hardware ones, dismissed error reports (automation bias — "the machine can't be wrong"), and no real accountability process.<br><br>
<b>Framework read.</b> A catastrophic failure of the IEEE duty to "hold paramount public safety." Virtue ethics: a careful engineer tests life-critical code exhaustively and takes user reports seriously. Deontology: shipping unverified safety-critical software violates a duty of care regardless of schedule pressure.</div>
<h3>Ví dụ có lời giải · Volkswagen "Dieselgate" — engineered dishonesty</h3>
<div class="out"><b>What happened.</b> VW (revealed 2015) programmed engine software to <em>detect</em> when a car was being emissions-tested and cut pollution only during the test — then emit up to 40× the legal limit on the road.<br><br>
<b>Why it's a landmark.</b> Unlike Therac-25's negligence, this was <strong>deliberate</strong> deception coded on purpose. Engineers wrote the defeat device. It shows that "just following orders / just writing the code" is not an ethical shield.<br><br>
<b>Framework read.</b> Fails every lens at once: deontology (intentional fraud), utilitarianism (massive public-health harm from extra pollution), virtue (dishonesty as design goal), contract (no regulator or customer consented to being lied to). The lesson: an individual engineer's refusal is sometimes the only ethical safeguard — the ACM/IEEE codes exist precisely to back that refusal.</div>
<h3>Ví dụ có lời giải · Cambridge Analytica — data used against its subjects</h3>
<div class="out"><b>What happened.</b> Around 2014–2018, personal data of up to ~87 million Facebook users was harvested (via a personality-quiz app that also scraped friends' data) and used to build psychographic profiles for targeted political advertising.<br><br>
<b>Why it's a landmark.</b> The textbook case of <em>consent and purpose-limitation failure</em> at scale: data given for one purpose (a quiz) was repurposed for another (political manipulation), and most affected users never consented at all.<br><br>
<b>Framework read.</b> Violates purpose limitation and informed consent (Ch3), fails the contract test (no one agreed their data would micro-target their politics), and treats people as means to an electoral end (deontology). It's the case that pushed data ethics and GDPR-style regulation into public consciousness.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The pattern across all three.</b> Therac-25 = negligence; Dieselgate = intent; Cambridge Analytica = misuse of consented data. Different failures, one common thread: <em>a technically capable team did harm because ethical review, accountability, and the freedom to say "no" were missing.</em> Everything in this course — frameworks, bias detection, mitigation, communication, governance — exists so that you are the person who catches the next one before it ships.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1 · Ngoài giáo trình</span>
<h2>Ba vụ án mọi người làm công nghệ phải biết</h2>
<p class="lead">Nguyên lý bám chặt khi gắn với câu chuyện. Ba vụ này là những bài học cảnh tỉnh kinh điển của ngành — mỗi vụ minh hoạ một kiểu thất bại khác nhau, và mỗi vụ được mổ xẻ bằng các khung ở Chương 1.</p>
<h3>Ví dụ có lời giải · Therac-25 — khi một lỗi phần mềm giết người</h3>
<div class="out"><b>Chuyện gì đã xảy ra.</b> Therac-25 (1985–87) là máy xạ trị. Các điều kiện tranh chấp (race condition) trong phần mềm khiến nó phát liều phóng xạ quá mức khổng lồ; ít nhất sáu bệnh nhân bị thương nặng hoặc tử vong.<br><br>
<b>Vì sao là vụ kinh điển.</b> Đây là bằng chứng chuẩn mực rằng <em>an toàn phần mềm là an toàn tính mạng</em>. Nguyên nhân gốc: không review code độc lập, phụ thuộc quá mức vào khoá phần mềm sau khi bỏ khoá phần cứng, gạt bỏ báo lỗi (thiên kiến tự động hoá — "máy không thể sai"), và không có quy trình trách nhiệm giải trình thật.<br><br>
<b>Đọc theo khung.</b> Một thất bại thảm khốc của bổn phận IEEE "đặt an toàn công chúng lên hàng đầu." Đức hạnh: một kỹ sư cẩn trọng kiểm code sinh-tử triệt để và coi trọng báo cáo của người dùng. Nghĩa vụ luận: tung phần mềm an toàn trọng yếu chưa kiểm chứng vi phạm bổn phận cẩn trọng bất kể áp lực tiến độ.</div>
<h3>Ví dụ có lời giải · "Dieselgate" của Volkswagen — gian dối được lập trình</h3>
<div class="out"><b>Chuyện gì đã xảy ra.</b> VW (bị phanh phui 2015) lập trình phần mềm động cơ để <em>phát hiện</em> khi xe đang bị đo khí thải và chỉ giảm ô nhiễm trong lúc kiểm tra — rồi thải tới 40× giới hạn pháp luật khi chạy đường thật.<br><br>
<b>Vì sao là vụ kinh điển.</b> Khác sự tắc trách của Therac-25, đây là <strong>lừa dối cố ý</strong> được code có chủ đích. Kỹ sư đã viết thiết bị gian lận (defeat device). Nó cho thấy "chỉ làm theo lệnh / chỉ viết code" không phải tấm khiên đạo đức.<br><br>
<b>Đọc theo khung.</b> Trượt mọi ống kính cùng lúc: nghĩa vụ luận (gian lận có chủ đích), vị lợi (tổn hại sức khoẻ công chúng khổng lồ do ô nhiễm thêm), đức hạnh (lấy dối trá làm mục tiêu thiết kế), khế ước (không nhà quản lý hay khách hàng nào đồng thuận bị lừa). Bài học: sự từ chối của một kỹ sư đôi khi là biện pháp bảo vệ đạo đức duy nhất — bộ quy tắc ACM/IEEE tồn tại chính để chống lưng cho sự từ chối đó.</div>
<h3>Ví dụ có lời giải · Cambridge Analytica — dữ liệu dùng để chống lại chính chủ nhân</h3>
<div class="out"><b>Chuyện gì đã xảy ra.</b> Khoảng 2014–2018, dữ liệu cá nhân của tới ~87 triệu người dùng Facebook bị thu gom (qua một app trắc nghiệm tính cách cũng vét luôn dữ liệu bạn bè) và dùng để dựng hồ sơ tâm lý cho quảng cáo chính trị nhắm mục tiêu.<br><br>
<b>Vì sao là vụ kinh điển.</b> Ca sách giáo khoa về <em>thất bại đồng thuận và giới hạn mục đích</em> ở quy mô lớn: dữ liệu cho một mục đích (một bài trắc nghiệm) bị tái dùng cho mục đích khác (thao túng chính trị), và phần lớn người bị ảnh hưởng chưa hề đồng thuận.<br><br>
<b>Đọc theo khung.</b> Vi phạm giới hạn mục đích và đồng thuận hiểu biết (Ch3), trượt bài kiểm khế ước (không ai đồng ý dữ liệu của mình được dùng để nhắm vi mô vào lá phiếu), và coi con người là phương tiện cho một mục đích bầu cử (nghĩa vụ luận). Đây là vụ đẩy đạo đức dữ liệu và quy định kiểu GDPR vào ý thức công chúng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Dạng thức chung của cả ba vụ.</b> Therac-25 = tắc trách; Dieselgate = cố ý; Cambridge Analytica = lạm dụng dữ liệu đã đồng thuận. Các thất bại khác nhau, một sợi chỉ chung: <em>một nhóm giỏi kỹ thuật đã gây hại vì thiếu review đạo đức, thiếu trách nhiệm giải trình, và thiếu tự do để nói "không."</em> Mọi thứ trong môn này — khung, phát hiện thiên kiến, giảm thiểu, truyền đạt, quản trị — tồn tại để bạn là người chặn được vụ tiếp theo trước khi nó ra mắt.</div>
</div>
`,
        },
        {
          title: 'Chapter 7 Quiz|||Quiz chương 7',
          slug: 'ite302c-quiz-ch7',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: Therac-25, Dieselgate & Cambridge Analytica.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The Therac-25 case is the canonical lesson that…|||Vụ Therac-25 là bài học chuẩn mực rằng…', options: ['hardware is unnecessary|||phần cứng là thừa', 'software safety is life-safety; safety-critical code needs review &amp; must not dismiss error reports|||an toàn phần mềm là an toàn tính mạng; code an toàn trọng yếu cần review &amp; không được gạt báo lỗi', 'radiation is harmless|||phóng xạ vô hại', 'faster shipping is always better|||ra mắt nhanh luôn tốt hơn'], correctIndex: 1, points: 1 },
              { question: 'What makes Volkswagen Dieselgate ethically different from Therac-25?|||Điều gì khiến Dieselgate của Volkswagen khác Therac-25 về mặt đạo đức?', options: ['it involved no software|||nó không liên quan phần mềm', 'it was deliberate, coded deception — not negligence|||nó là lừa dối cố ý, được code — không phải tắc trách', 'nobody was affected|||không ai bị ảnh hưởng', 'it was fully legal|||nó hoàn toàn hợp pháp'], correctIndex: 1, points: 1 },
              { question: '"I just wrote the code I was told to" as a defence in Dieselgate is…|||"Tôi chỉ viết code được bảo viết" làm biện hộ trong Dieselgate là…', options: ['a valid ethical shield|||một tấm khiên đạo đức hợp lệ', 'not a valid shield — professionals share responsibility and codes back the right to refuse|||không phải tấm khiên hợp lệ — người chuyên nghiệp chia sẻ trách nhiệm và bộ quy tắc chống lưng quyền từ chối', 'required by IEEE|||do IEEE yêu cầu', 'irrelevant|||không liên quan'], correctIndex: 1, points: 1 },
              { question: 'Cambridge Analytica is primarily a landmark case of…|||Cambridge Analytica chủ yếu là vụ kinh điển về…', options: ['excellent consent practices|||thực hành đồng thuận xuất sắc', 'consent and purpose-limitation failure at scale — data repurposed without agreement|||thất bại đồng thuận và giới hạn mục đích ở quy mô lớn — dữ liệu tái dùng không có sự đồng ý', 'a hardware defect|||một khiếm khuyết phần cứng', 'a pricing error|||một lỗi định giá'], correctIndex: 1, points: 1 },
              { question: 'The common thread across Therac-25, Dieselgate and Cambridge Analytica is…|||Sợi chỉ chung xuyên Therac-25, Dieselgate và Cambridge Analytica là…', options: ['bad luck|||xui xẻo', 'capable teams caused harm where ethical review, accountability and the freedom to say "no" were missing|||các nhóm giỏi gây hại nơi thiếu review đạo đức, trách nhiệm giải trình và tự do nói "không"', 'insufficient computing power|||thiếu sức mạnh tính toán', 'too much regulation|||quá nhiều quy định'], correctIndex: 1, points: 1 },
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
          "slug": "ite302c-final-exam-pe",
          "type": "article",
          "description": "Khung thi thực hành (PE) của môn — format, cách chấm và cách chuẩn bị. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · PE</span>\n<h2>PE — Practical Exam</h2>\n<p class=\"lead\">The Practical Exam (PE) is a <strong>writing / report exam</strong>: you are given a prompt (an essay question, a document, or a plan) and must produce a well-structured, well-argued piece within a time limit. It is graded on structure, argument, use of evidence, and clarity.</p>\n<h3>How to prepare</h3>\n<ul>\n<li>Practise the structure: thesis &rarr; evidence &rarr; analysis &rarr; conclusion.</li>\n<li>Prepare a few strong examples / sources you can cite quickly.</li>\n<li>Plan before you write: 2 minutes outlining saves ten minutes rewriting.</li>\n<li>Argue a clear position &mdash; do not just summarize.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> A real practical prompt bank for this subject will be added here later, in the exam room. Use the guidance above to prepare now.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · PE</span>\n<h2>PE — Thi thực hành</h2>\n<p class=\"lead\">Thi thực hành (PE) là <strong>thi viết / báo cáo</strong>: bạn được giao một đề (câu hỏi luận, một tài liệu, hoặc một kế hoạch) và phải viết một bài có cấu trúc, lập luận tốt trong thời gian quy định. Chấm theo cấu trúc, lập luận, dùng bằng chứng, và sự rõ ràng.</p>\n<h3>Cách chuẩn bị</h3>\n<ul>\n<li>Luyện cấu trúc: luận đề &rarr; bằng chứng &rarr; phân tích &rarr; kết luận.</li>\n<li>Chuẩn bị vài ví dụ / nguồn mạnh có thể trích nhanh.</li>\n<li>Lập dàn ý trước khi viết: 2 phút dàn ý tiết kiệm mười phút viết lại.</li>\n<li>Lập luận một quan điểm rõ &mdash; đừng chỉ tóm tắt.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Ngân hàng đề thực hành thật cho môn này sẽ được thêm vào đây sau, trong trang phòng thi. Dùng hướng dẫn trên để chuẩn bị ngay từ giờ.</div>\n</div>"
        },
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "ite302c-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "Which framework judges an action purely by its outcomes (greatest good for the greatest number)?|||Khung nào phán xét hành động thuần theo kết quả (điều tốt nhất cho số đông nhất)?",
                "options": [
                  "Deontology|||Nghĩa vụ luận",
                  "Utilitarianism / consequentialism|||Vị lợi / hệ quả luận",
                  "Virtue ethics|||Đạo đức đức hạnh",
                  "Contractarianism|||Khế ước luận"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "\"Some actions (like violating consent) are wrong even if they produce good results.\" This is the core of…|||\"Một số hành động (như vi phạm sự đồng thuận) là sai kể cả khi cho kết quả tốt.\" Đây là cốt lõi của…",
                "options": [
                  "Utilitarianism|||Vị lợi",
                  "Deontology (duty ethics)|||Nghĩa vụ luận",
                  "Consequentialism|||Hệ quả luận",
                  "Cost-benefit analysis|||Phân tích lợi ích–chi phí"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "Rawls' veil of ignorance asks you to design rules as if…|||Bức màn vô minh của Rawls yêu cầu thiết kế quy tắc như thể…",
                "options": [
                  "you already know you're in the majority|||bạn đã biết mình thuộc đa số",
                  "you don't know which position in society you'll hold|||bạn không biết mình sẽ ở vị trí nào trong xã hội",
                  "outcomes do not matter|||kết quả không quan trọng",
                  "only profit matters|||chỉ lợi nhuận quan trọng"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "In ethics, the relationship between law and ethics is best described as…|||Quan hệ giữa luật và đạo đức được mô tả đúng nhất là…",
                "options": [
                  "identical — legal always means ethical|||đồng nhất — hợp pháp luôn là có đạo đức",
                  "law is the floor (minimum); ethics asks for more|||luật là sàn (tối thiểu); đạo đức đòi hỏi hơn",
                  "ethics is the minimum, law is optional|||đạo đức là tối thiểu, luật là tuỳ chọn",
                  "they never overlap|||chúng không bao giờ chồng lấn"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "Why use all four frameworks instead of just one?|||Vì sao dùng cả bốn khung thay vì chỉ một?",
                "options": [
                  "To make decisions slower|||Để quyết định chậm hơn",
                  "Each has a blind spot; together they triangulate the trade-off|||Mỗi khung có điểm mù; cùng nhau chúng tam giác hoá điểm đánh đổi",
                  "The exam requires memorising four terms|||Đề thi bắt thuộc bốn thuật ngữ",
                  "Only one is ever correct|||Chỉ một khung đúng"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "Training a face-recognition model mostly on light-skinned faces, so it fails on dark-skinned faces, is an example of…|||Huấn luyện mô hình nhận mặt chủ yếu trên da sáng nên thất bại với da tối là ví dụ của…",
                "options": [
                  "Confirmation bias|||Thiên kiến xác nhận",
                  "Selection (sampling) bias|||Thiên kiến chọn mẫu",
                  "Automation bias|||Thiên kiến tự động hoá",
                  "No bias — it is just math|||Không thiên kiến — chỉ là toán"
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
