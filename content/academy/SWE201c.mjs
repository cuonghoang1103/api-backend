/**
 * SWE201c — Introduction to Software Engineering (Nhập môn kỹ thuật phần mềm). Kỳ 4.
 * Bám syllabus FPTU (sylID 14224, 4 CLO) — dựa trên Coursera "Software Development
 * Lifecycle" specialization (Univ. of Minnesota). Tiên quyết: PRO192.
 * Song ngữ EN/VN. Khái niệm (không code) — bảng/sơ đồ lz-*. Ví dụ + ★ ngoài giáo trình.
 * Grading: MOOC + FE=(TE+PE); pass TE≥4 & PE≥4 & FR≥5.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/SWE201c.mjs --apply
 */
export default {
  semester: { code: 'FPTU_Hola4', name: 'Kỳ 4', ordinal: 6 },
  course: {
    courseCode: 'SWE201c',
    slug: 'introduction-to-software-engineering',
    title: 'Introduction to Software Engineering',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'How software is really built: the Software Development Lifecycle, traditional vs agile vs lean methodologies, Scrum and XP, and building secure, high-quality software — the professional teamwork behind the code.|||Phần mềm thực sự được xây thế nào: Vòng đời phát triển phần mềm (SDLC), các phương pháp truyền thống vs agile vs lean, Scrum và XP, và xây phần mềm an toàn, chất lượng cao — cách làm việc nhóm chuyên nghiệp đằng sau code.',
    description: 'Môn nhập môn kỹ thuật phần mềm: cách một đội xây phần mềm chất lượng cao và an toàn bằng các phương pháp vòng đời phát triển phần mềm (SDLC) — truyền thống (Waterfall), agile, và lean. Học so sánh các phương pháp, tham gia hiệu quả vào quy trình agile (Scrum, XP), áp dụng kỹ thuật lean, và các thực hành xây phần mềm bảo mật & chất lượng. Môn dựa trên bộ MOOC Coursera; điểm gồm hoàn thành MOOC + thi lý thuyết + thi thực hành. Tiên quyết: PRO192.',
    whatYouLearn: 'Vòng đời phát triển phần mềm (SDLC) và các pha; các mô hình truyền thống (Waterfall, V-model, incremental); nền tảng agile (Manifesto, giá trị & nguyên tắc); Scrum (vai trò, sprint, các buổi họp) và XP (thực hành kỹ thuật); phát triển phần mềm lean (loại bỏ lãng phí); xây phần mềm bảo mật & chất lượng; và cách chọn phương pháp phù hợp cho dự án.',
    requirements: 'Tiên quyết: đạt PRO192 (đã từng viết phần mềm để hiểu vì sao cần quy trình). Cần Internet và tài khoản Coursera để hoàn thành các MOOC bắt buộc.',
    documentsNote: 'Học liệu chính: bộ Coursera "Software Development Lifecycle" (Univ. of Minnesota): Software Development Processes and Methodologies, Agile Software Development, Lean Software Development, Engineering Practices for Building Quality Software. Kèm file syllabus gốc SWE201c.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, cách chấm (MOOC + thi), và cách học qua Coursera.',
      lessons: [
        {
          title: '0.1 — About SWE201c & the course map|||0.1 — Giới thiệu SWE201c & bản đồ môn học',
          slug: 'swe201c-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Kỹ thuật phần mềm là gì (khác lập trình), vì sao cần quy trình, và lộ trình SDLC → agile → lean → chất lượng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About SWE201c — Introduction to Software Engineering</h2>
<p class="lead">In PRO192 you learned to <em>write</em> software. SWE201c teaches how to <em>build</em> it as part of a team, on time, without chaos. Programming is one person and a keyboard; software engineering is the process, planning and teamwork that turns many programmers' work into a reliable product.</p>
<p>You will compare the big ways teams organise — from rigid <strong>Waterfall</strong> to flexible <strong>Agile</strong> and waste-cutting <strong>Lean</strong> — and learn to work inside them.</p>
<h3>Course map</h3>
<div class="lz-map">
  <div class="lz-stage">The lifecycle</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">SDLC &amp; software processes</div><div class="lz-nsub">The phases every project goes through</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Traditional models</div><div class="lz-nsub">Waterfall · V-model · incremental</div></div></div>
  <div class="lz-stage">Agile &amp; Lean</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Agile fundamentals</div><div class="lz-nsub">The Manifesto · values · iterations</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Scrum &amp; XP</div><div class="lz-nsub">Roles · sprints · engineering practices</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Kanban</div><div class="lz-nsub">Board · WIP limits · continuous flow</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Lean software development</div><div class="lz-nsub">Eliminate waste · deliver fast</div></div></div>
  <div class="lz-stage">Quality</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Secure &amp; quality software</div><div class="lz-nsub">Quality practices · code metrics</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Software testing</div><div class="lz-nsub">7 principles · levels · types · techniques</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Requirements &amp; user stories</div><div class="lz-nsub">FR/NFR · SMART · INVEST · story mapping</div></div></div>
  <div class="lz-node"><div class="lz-badge">E</div><div class="lz-nbody"><div class="lz-ntitle">Exam preparation</div><div class="lz-nsub">PE templates · FE vocabulary</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">DevOps &amp; CI/CD · choosing a methodology</div><div class="lz-nsub">How industry actually ships today</div></div></div>
</div>
<div class="callout ok">This course is concept-heavy, not code-heavy. Learn it by connecting each idea to your own project experience — and by completing the official Coursera MOOCs, which are part of your grade.</div>
<a class="link-card codelab" href="https://www.coursera.org/specializations/software-development-lifecycle" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Software Development Lifecycle (Coursera)</span><span class="lc-sub">University of Minnesota — the official MOOC series for this course.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu SWE201c — Nhập môn kỹ thuật phần mềm</h2>
<p class="lead">Ở PRO192 bạn học <em>viết</em> phần mềm. SWE201c dạy cách <em>xây</em> nó như một phần của đội, đúng hạn, không hỗn loạn. Lập trình là một người và một bàn phím; kỹ thuật phần mềm là quy trình, kế hoạch và làm việc nhóm biến công sức của nhiều lập trình viên thành một sản phẩm đáng tin.</p>
<p>Bạn sẽ so sánh các cách lớn mà các đội tổ chức — từ <strong>Waterfall</strong> cứng nhắc tới <strong>Agile</strong> linh hoạt và <strong>Lean</strong> cắt lãng phí — và học làm việc bên trong chúng.</p>
<h3>Bản đồ môn học</h3>
<div class="lz-map">
  <div class="lz-stage">Vòng đời</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">SDLC &amp; quy trình phần mềm</div><div class="lz-nsub">Các pha mọi dự án đi qua</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Mô hình truyền thống</div><div class="lz-nsub">Waterfall · V-model · incremental</div></div></div>
  <div class="lz-stage">Agile &amp; Lean</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Nền tảng Agile</div><div class="lz-nsub">Manifesto · giá trị · vòng lặp</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Scrum &amp; XP</div><div class="lz-nsub">Vai trò · sprint · thực hành kỹ thuật</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Kanban</div><div class="lz-nsub">Bảng · giới hạn WIP · luồng liên tục</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Lean software development</div><div class="lz-nsub">Loại bỏ lãng phí · giao nhanh</div></div></div>
  <div class="lz-stage">Chất lượng</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Phần mềm bảo mật &amp; chất lượng</div><div class="lz-nsub">Thực hành chất lượng · chỉ số mã</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử phần mềm</div><div class="lz-nsub">7 nguyên tắc · mức · loại · kỹ thuật</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Yêu cầu &amp; User Story</div><div class="lz-nsub">FR/NFR · SMART · INVEST · story mapping</div></div></div>
  <div class="lz-node"><div class="lz-badge">E</div><div class="lz-nbody"><div class="lz-ntitle">Luyện thi</div><div class="lz-nsub">Khung trả lời PE · từ vựng FE</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">DevOps &amp; CI/CD · chọn phương pháp</div><div class="lz-nsub">Cách ngành thực sự ship hôm nay</div></div></div>
</div>
<div class="callout ok">Môn này nặng khái niệm, không nặng code. Học nó bằng cách nối mỗi ý tưởng với kinh nghiệm project của chính bạn — và bằng cách hoàn thành các MOOC Coursera chính thức, vốn là một phần điểm.</div>
<a class="link-card codelab" href="https://www.coursera.org/specializations/software-development-lifecycle" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">Software Development Lifecycle (Coursera)</span><span class="lc-sub">Đại học Minnesota — bộ MOOC chính thức của môn này.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Grading & the MOOC requirement|||0.2 — Cách chấm & yêu cầu MOOC',
          slug: 'swe201c-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Sơ đồ điểm: hoàn thành MOOC (bắt buộc để thi) + FE=(TE+PE); qua khi TE≥4, PE≥4 và FR≥5.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Grading — the MOOCs unlock the exam</h2>
<p class="lead">From the official SWE201c syllabus. Like other Coursera-based courses, you must complete the online specialization to be allowed to sit the Final Exam, which combines theory and practical parts.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>62h online + 3h offline + exams + self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">PRO192</span></div>
  <div class="kv"><span class="k">Final</span><span class="v">FE = Theory (TE) + Practical (PE)</span></div>
  <div class="kv"><span class="k">Pass</span><span class="v">TE ≥ 4 AND PE ≥ 4 AND FR ≥ 5</span></div>
</div>
<div class="callout warn">Three gates, all required: <strong>TE ≥ 4</strong>, <strong>PE ≥ 4</strong>, and <strong>FR ≥ 5</strong>, where FR = min(10, weighted TE + weighted PE + bonus). Finish all MOOCs before the deadline to earn the bonus point — and you cannot take the exam without the certificates.</div>
<div class="note-ct">The practical part tests whether you can apply a methodology (e.g. plan a sprint, write user stories, review for quality), not write code — so study the processes, not just the definitions.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Cách chấm — MOOC mở khóa kỳ thi</h2>
<p class="lead">Từ syllabus chính thức SWE201c. Như các môn dựa trên Coursera khác, bạn phải hoàn thành bộ specialization online mới được dự thi cuối kỳ, gồm phần lý thuyết và thực hành.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>62h online + 3h offline + thi + tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">PRO192</span></div>
  <div class="kv"><span class="k">Thi cuối</span><span class="v">FE = Lý thuyết (TE) + Thực hành (PE)</span></div>
  <div class="kv"><span class="k">Qua môn</span><span class="v">TE ≥ 4 VÀ PE ≥ 4 VÀ FR ≥ 5</span></div>
</div>
<div class="callout warn">Ba cửa ải, đều bắt buộc: <strong>TE ≥ 4</strong>, <strong>PE ≥ 4</strong>, và <strong>FR ≥ 5</strong>, với FR = min(10, TE có trọng số + PE có trọng số + bonus). Hoàn thành tất cả MOOC trước hạn để được điểm thưởng — và bạn không thể dự thi nếu không có chứng chỉ.</div>
<div class="note-ct">Phần thực hành kiểm bạn có áp dụng được một phương pháp (vd lập kế hoạch sprint, viết user story, review chất lượng) hay không, không phải viết code — nên hãy học các quy trình, không chỉ định nghĩa.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — SDLC ══════════════════ */
    {
      title: 'Chapter 1 — SDLC & software processes|||Chương 1 — SDLC & quy trình phần mềm',
      description: 'Vì sao cần quy trình, và các pha của vòng đời phát triển phần mềm (SDLC).',
      lessons: [
        {
          title: '1.1 — The Software Development Lifecycle|||1.1 — Vòng đời phát triển phần mềm',
          slug: 'swe201c-sdlc',
          type: 'VIDEO',
          description: 'Vì sao "code luôn tay" thất bại ở quy mô lớn; sáu pha SDLC (requirements → maintenance) và vai trò mỗi pha.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Why software needs a process</h2>
<p class="lead">One person can code a small program by just starting to type. But a team building a bank, over years, with changing requirements? Without a shared process it becomes chaos — missed features, endless bugs, blown deadlines. The <strong>Software Development Lifecycle (SDLC)</strong> is the map every serious project follows.</p>
<h3>The six phases</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Requirements</div><div class="lz-nsub">What must the software do? Gather &amp; agree.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Design</div><div class="lz-nsub">How will it be built? Architecture, models.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Implementation</div><div class="lz-nsub">Write the code.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">Does it work &amp; meet the requirements?</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Deployment</div><div class="lz-nsub">Release it to users.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Maintenance</div><div class="lz-nsub">Fix, improve, adapt — the longest phase.</div></div></div>
</div>
<div class="note-ct">The methodologies you will study (Waterfall, Agile, Lean) are all different <em>ways of moving through these phases</em> — once, in strict order, or repeatedly in small loops. The phases stay; the rhythm changes.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The cost-of-change curve — why requirements matter most.</b> A famous finding: a defect caught in the requirements phase costs a fraction of one caught after release — often cited as 1× in requirements vs 100× in production. This is <em>the</em> economic argument for taking early phases seriously and for agile's short feedback loops (find problems sooner). Understanding this curve explains almost every process decision in the whole course.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Vì sao phần mềm cần một quy trình</h2>
<p class="lead">Một người có thể code một chương trình nhỏ bằng cách chỉ bắt đầu gõ. Nhưng một đội xây một ngân hàng, qua nhiều năm, với yêu cầu thay đổi? Không có quy trình chung, nó thành hỗn loạn — thiếu tính năng, bug bất tận, trễ hạn. <strong>Vòng đời phát triển phần mềm (SDLC)</strong> là bản đồ mọi dự án nghiêm túc đi theo.</p>
<h3>Sáu pha</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Phân tích yêu cầu</div><div class="lz-nsub">Phần mềm phải làm gì? Thu thập &amp; thống nhất.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế</div><div class="lz-nsub">Sẽ xây thế nào? Kiến trúc, mô hình.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Cài đặt</div><div class="lz-nsub">Viết code.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">Nó chạy &amp; đáp ứng yêu cầu không?</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Triển khai</div><div class="lz-nsub">Phát hành cho người dùng.</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Bảo trì</div><div class="lz-nsub">Sửa, cải tiến, thích ứng — pha dài nhất.</div></div></div>
</div>
<div class="note-ct">Các phương pháp bạn sẽ học (Waterfall, Agile, Lean) đều là những <em>cách khác nhau đi qua các pha này</em> — một lần, theo thứ tự chặt, hoặc lặp lại trong các vòng nhỏ. Các pha giữ nguyên; nhịp thay đổi.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đường cong chi phí thay đổi — vì sao yêu cầu quan trọng nhất.</b> Một phát hiện nổi tiếng: một lỗi bắt ở pha yêu cầu tốn một phần nhỏ so với lỗi bắt sau khi phát hành — thường trích dẫn 1× ở yêu cầu vs 100× ở production. Đây <em>chính là</em> lập luận kinh tế để coi trọng các pha đầu và để agile dùng vòng phản hồi ngắn (tìm vấn đề sớm hơn). Hiểu đường cong này giải thích gần như mọi quyết định quy trình trong cả môn.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 2 — MÔ HÌNH TRUYỀN THỐNG ══════════════════ */
    {
      title: 'Chapter 2 — Traditional models|||Chương 2 — Mô hình truyền thống',
      description: 'Waterfall, V-model và incremental — điểm mạnh, điểm yếu và khi nào dùng.',
      lessons: [
        {
          title: '2.1 — Waterfall, V-model & incremental|||2.1 — Waterfall, V-model & incremental',
          slug: 'swe201c-waterfall',
          type: 'VIDEO',
          description: 'Waterfall tuần tự (ưu/nhược); V-model gắn test với từng pha; incremental giao từng phần.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>The plan-driven models</h2>
<p class="lead">The oldest methodologies are <strong>plan-driven</strong>: decide everything up front, then execute. Understanding them (and their weaknesses) is why agile was invented.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Waterfall</b> — the six phases done once, strictly in order: finish all requirements, then all design, then all code. Simple and clear; but you cannot go back, and the customer sees nothing until the end. Great when requirements are truly fixed and well understood.</div>
  <div class="lz-layer"><b>V-model</b> — Waterfall bent into a V: each development phase is paired with a matching test level (unit ↔ code, system ↔ requirements). Emphasises testing early planning.</div>
  <div class="lz-layer"><b>Incremental</b> — build and deliver the system in pieces (increments), each a mini-Waterfall. The customer gets working parts sooner — a step toward agile.</div>
</div>
<div class="pitfall"><b>Waterfall's fatal flaw:</b> it assumes you know all requirements correctly at the start. In reality, customers change their minds and misunderstand what they asked for. A year of building the wrong thing — discovered only at delivery — is the classic Waterfall disaster that agile set out to prevent.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Waterfall is not "wrong" — context decides.</b> It is fashionable to mock Waterfall, but for projects with fixed, safety-critical, heavily-regulated requirements (aircraft firmware, medical devices, a bridge's control system) its up-front rigor and documentation are exactly right — you cannot "iterate" a plane crash. The professional skill is not "always be agile" but <em>matching the method to the project</em>, which is Chapter 6's theme.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Các mô hình hướng-kế-hoạch</h2>
<p class="lead">Các phương pháp cổ nhất là <strong>hướng kế hoạch</strong>: quyết định mọi thứ từ đầu, rồi thực thi. Hiểu chúng (và điểm yếu) là lý do agile ra đời.</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Waterfall (thác nước)</b> — sáu pha làm một lần, chặt theo thứ tự: xong hết yêu cầu, rồi hết thiết kế, rồi hết code. Đơn giản và rõ; nhưng không quay lại được, và khách hàng không thấy gì tới cuối. Tốt khi yêu cầu thực sự cố định và hiểu rõ.</div>
  <div class="lz-layer"><b>V-model</b> — Waterfall uốn thành chữ V: mỗi pha phát triển ghép với một mức kiểm thử tương ứng (unit ↔ code, system ↔ yêu cầu). Nhấn mạnh lập kế hoạch kiểm thử sớm.</div>
  <div class="lz-layer"><b>Incremental</b> — xây và giao hệ thống theo từng phần (increment), mỗi phần là một Waterfall thu nhỏ. Khách hàng nhận phần chạy được sớm hơn — một bước tiến về agile.</div>
</div>
<div class="pitfall"><b>Khuyết tật chí mạng của Waterfall:</b> nó giả định bạn biết đúng mọi yêu cầu ngay từ đầu. Thực tế, khách hàng đổi ý và hiểu sai điều họ yêu cầu. Một năm xây nhầm thứ — chỉ phát hiện lúc bàn giao — là thảm họa Waterfall kinh điển mà agile sinh ra để ngăn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Waterfall không "sai" — bối cảnh quyết định.</b> Chê Waterfall là mốt, nhưng với dự án có yêu cầu cố định, an toàn-trọng yếu, chịu quản lý chặt (firmware máy bay, thiết bị y tế, hệ điều khiển cầu) thì sự nghiêm ngặt và tài liệu từ đầu của nó đúng là phù hợp — bạn không thể "lặp lại" một vụ rơi máy bay. Kỹ năng chuyên nghiệp không phải "luôn agile" mà là <em>khớp phương pháp với dự án</em>, chủ đề của Chương 6.</div>
</div>
`,
        },
        {
          title: '2.2 — Spiral, RUP & Prototyping|||2.2 — Spiral, RUP & Prototyping',
          slug: 'swe201c-spiral-rup-prototype',
          type: 'VIDEO',
          description: 'Ba mô hình còn lại của nhóm truyền thống: xoắn ốc hướng rủi ro, RUP 4 pha, và nguyên mẫu (throwaway vs evolutionary).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Three more traditional models</h2>
<p class="lead">Lesson 2.1 covered Waterfall, the V-model and incremental development. Three models complete the traditional family — and each one exists to solve a specific weakness of Waterfall.</p>

<h3>1. Spiral — the risk-driven model</h3>
<p>Boehm's spiral organises work as repeated loops, each loop passing through four quadrants. Every loop produces a more complete version, and every loop starts by asking "what could go wrong?".</p>
<table>
  <thead><tr><th>Quadrant</th><th>What happens</th></tr></thead>
  <tbody>
    <tr><td>1. Planning</td><td>Determine objectives, alternatives and constraints</td></tr>
    <tr><td>2. Risk analysis</td><td>Identify and resolve risks — often by building a prototype</td></tr>
    <tr><td>3. Engineering</td><td>Develop and verify the next-level product</td></tr>
    <tr><td>4. Evaluation</td><td>Customer evaluates; decide whether to continue to the next loop</td></tr>
  </tbody>
</table>
<div class="note-ct"><b>The defining feature is risk analysis in every single loop.</b> If an exam question mentions high risk, high cost of failure, unfamiliar technology, or "we must evaluate alternatives before committing", Spiral is the intended answer. Its weakness: risk analysis needs real expertise, and the model is expensive — overkill for small projects.</div>

<h3>2. RUP — Rational Unified Process</h3>
<p>RUP is iterative and use-case driven, organised into <b>four phases</b> that run in sequence, while <em>disciplines</em> (requirements, design, implementation, test) overlap and run across all of them at different intensities.</p>
<table>
  <thead><tr><th>Phase</th><th>Goal</th><th>Milestone</th></tr></thead>
  <tbody>
    <tr><td>Inception</td><td>Scope, business case, feasibility</td><td>Lifecycle Objectives</td></tr>
    <tr><td>Elaboration</td><td>Baseline the architecture, kill the big risks</td><td>Lifecycle Architecture</td></tr>
    <tr><td>Construction</td><td>Build the bulk of the system</td><td>Initial Operational Capability</td></tr>
    <tr><td>Transition</td><td>Deliver to users, beta, training, cutover</td><td>Product Release</td></tr>
  </tbody>
</table>
<div class="note-ct">RUP is heavily <b>tool- and document-supported</b>, which is exactly why exam questions that stress "large team, strong documentation, defined architecture, enterprise scale" point at RUP rather than Scrum. Note the phases are <em>not</em> the same as Waterfall stages: each RUP phase contains several iterations, and every discipline appears in every phase.</div>

<h3>3. Prototyping — build a draft to pin down requirements</h3>
<p>When the customer cannot describe what they want until they see something, you build a prototype first. Two very different strategies exist, and confusing them is a classic exam mistake.</p>
<table>
  <thead><tr><th></th><th>Throwaway (rapid)</th><th>Evolutionary</th></tr></thead>
  <tbody>
    <tr><td>Purpose</td><td>Clarify unclear requirements</td><td>Deliver a growing real system</td></tr>
    <tr><td>Built with</td><td>Quick and dirty, quality not a concern</td><td>Production-quality from the start</td></tr>
    <tr><td>Afterwards</td><td><b>Discarded</b>; the real system is built fresh</td><td><b>Kept</b> and refined into the final product</td></tr>
    <tr><td>Risk</td><td>Wasted effort if overbuilt</td><td>Poor early decisions get locked in</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>The exam trap:</b> the correct pair is <b>Throwaway ↔ Evolutionary</b>. "Exploratory" is <em>not</em> the counterpart of throwaway — if it appears as an option, it is a distractor. Another frequent error is managers deciding to ship a throwaway prototype because "it already works"; it was never engineered to be maintained, and that decision creates permanent technical debt.</div>

<h3>Where these three fit</h3>
<table>
  <thead><tr><th>Model</th><th>Solves which Waterfall weakness</th></tr></thead>
  <tbody>
    <tr><td>Spiral</td><td>Risk is discovered too late</td></tr>
    <tr><td>RUP</td><td>No iteration, architecture unproven until late</td></tr>
    <tr><td>Prototyping</td><td>Requirements cannot be written correctly up front</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Spiral is the ancestor of agile risk thinking.</b> Boehm proposed it in 1986, long before the Agile Manifesto, yet its core insight — deliver in loops and re-evaluate risk each loop — is what Scrum sprints do implicitly. The difference is emphasis: Spiral makes risk analysis an explicit, documented activity, while agile handles it through short cycles and constant customer feedback. Knowing this lineage helps you argue in PE questions that these families are not opposites but a progression.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Ba mô hình truyền thống còn lại</h2>
<p class="lead">Bài 2.1 đã học Waterfall, V-model và phát triển tăng dần. Ba mô hình nữa hoàn thiện nhóm truyền thống — và mỗi cái ra đời để giải quyết một điểm yếu cụ thể của Waterfall.</p>

<h3>1. Spiral — mô hình hướng rủi ro</h3>
<p>Mô hình xoắn ốc của Boehm tổ chức công việc thành các vòng lặp, mỗi vòng đi qua bốn góc phần tư. Mỗi vòng cho ra một phiên bản hoàn chỉnh hơn, và mỗi vòng đều bắt đầu bằng câu hỏi "điều gì có thể hỏng?".</p>
<table>
  <thead><tr><th>Góc phần tư</th><th>Diễn ra điều gì</th></tr></thead>
  <tbody>
    <tr><td>1. Lập kế hoạch</td><td>Xác định mục tiêu, phương án thay thế và ràng buộc</td></tr>
    <tr><td>2. Phân tích rủi ro</td><td>Nhận diện và xử lý rủi ro — thường bằng cách dựng một nguyên mẫu</td></tr>
    <tr><td>3. Kỹ thuật</td><td>Phát triển và kiểm chứng sản phẩm ở mức tiếp theo</td></tr>
    <tr><td>4. Đánh giá</td><td>Khách hàng đánh giá; quyết định có đi tiếp vòng sau không</td></tr>
  </tbody>
</table>
<div class="note-ct"><b>Đặc trưng định danh là phân tích rủi ro ở MỌI vòng lặp.</b> Nếu đề thi nhắc tới rủi ro cao, cái giá của thất bại lớn, công nghệ chưa quen, hay "phải đánh giá các phương án trước khi cam kết" thì Spiral là đáp án được nhắm tới. Điểm yếu: phân tích rủi ro đòi chuyên môn thật, và mô hình này tốn kém — dùng cho dự án nhỏ là quá mức cần thiết.</div>

<h3>2. RUP — Rational Unified Process</h3>
<p>RUP mang tính lặp và hướng use-case, tổ chức thành <b>bốn pha</b> chạy tuần tự, trong khi các <em>lĩnh vực công việc</em> (yêu cầu, thiết kế, lập trình, kiểm thử) chồng lấn và chạy xuyên suốt mọi pha với cường độ khác nhau.</p>
<table>
  <thead><tr><th>Pha</th><th>Mục tiêu</th><th>Cột mốc</th></tr></thead>
  <tbody>
    <tr><td>Inception (Khởi đầu)</td><td>Phạm vi, bài toán kinh doanh, tính khả thi</td><td>Lifecycle Objectives</td></tr>
    <tr><td>Elaboration (Chi tiết hóa)</td><td>Chốt kiến trúc nền, tiêu diệt các rủi ro lớn</td><td>Lifecycle Architecture</td></tr>
    <tr><td>Construction (Xây dựng)</td><td>Xây phần lớn hệ thống</td><td>Initial Operational Capability</td></tr>
    <tr><td>Transition (Chuyển giao)</td><td>Bàn giao cho người dùng, beta, đào tạo, cutover</td><td>Product Release</td></tr>
  </tbody>
</table>
<div class="note-ct">RUP được hỗ trợ mạnh bằng <b>công cụ và tài liệu</b>, đó chính là lý do câu hỏi thi nhấn mạnh "đội lớn, tài liệu chặt chẽ, kiến trúc rõ ràng, quy mô doanh nghiệp" sẽ trỏ tới RUP thay vì Scrum. Lưu ý các pha này <em>không</em> giống các giai đoạn Waterfall: mỗi pha RUP chứa nhiều vòng lặp, và mọi lĩnh vực công việc đều xuất hiện ở mọi pha.</div>

<h3>3. Prototyping — dựng bản nháp để chốt yêu cầu</h3>
<p>Khi khách hàng không mô tả được điều họ muốn cho tới lúc nhìn thấy một thứ gì đó, bạn dựng nguyên mẫu trước. Có hai chiến lược rất khác nhau, và nhầm lẫn chúng là lỗi thi kinh điển.</p>
<table>
  <thead><tr><th></th><th>Throwaway (nhanh, bỏ đi)</th><th>Evolutionary (tiến hóa)</th></tr></thead>
  <tbody>
    <tr><td>Mục đích</td><td>Làm rõ yêu cầu còn mơ hồ</td><td>Bàn giao một hệ thống thật lớn dần</td></tr>
    <tr><td>Xây bằng</td><td>Nhanh và cẩu thả, không quan tâm chất lượng</td><td>Chất lượng production ngay từ đầu</td></tr>
    <tr><td>Sau đó</td><td><b>Vứt bỏ</b>; hệ thống thật được xây mới hoàn toàn</td><td><b>Giữ lại</b> và bồi đắp thành sản phẩm cuối</td></tr>
    <tr><td>Rủi ro</td><td>Lãng phí công sức nếu làm quá tay</td><td>Quyết định sai lúc đầu bị khóa lại vĩnh viễn</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Bẫy thi:</b> cặp đôi đúng là <b>Throwaway ↔ Evolutionary</b>. "Exploratory" <em>không phải</em> là cặp của throwaway — nếu nó xuất hiện trong phương án thì đó là mồi nhử. Lỗi thường gặp khác là quản lý quyết định đem chính nguyên mẫu throwaway đi triển khai vì "nó chạy được rồi"; nó vốn không được thiết kế để bảo trì, và quyết định đó tạo ra nợ kỹ thuật vĩnh viễn.</div>

<h3>Ba mô hình này lấp chỗ nào</h3>
<table>
  <thead><tr><th>Mô hình</th><th>Giải quyết điểm yếu nào của Waterfall</th></tr></thead>
  <tbody>
    <tr><td>Spiral</td><td>Rủi ro bị phát hiện quá muộn</td></tr>
    <tr><td>RUP</td><td>Không có lặp, kiến trúc chưa được chứng minh cho tới cuối</td></tr>
    <tr><td>Prototyping</td><td>Không thể viết đúng yêu cầu ngay từ đầu</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Spiral là tổ tiên của tư duy rủi ro trong agile.</b> Boehm đề xuất nó năm 1986, rất lâu trước Agile Manifesto, vậy mà ý tưởng cốt lõi — giao hàng theo vòng lặp và đánh giá lại rủi ro mỗi vòng — chính là điều các sprint Scrum làm một cách ngầm định. Khác biệt nằm ở trọng tâm: Spiral biến phân tích rủi ro thành một hoạt động tường minh, có tài liệu, còn agile xử lý rủi ro qua chu kỳ ngắn và phản hồi liên tục từ khách hàng. Biết được dòng dõi này giúp bạn lập luận trong câu hỏi PE rằng các họ mô hình không đối lập nhau mà là một sự tiến hóa.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 3 — AGILE ══════════════════ */
    {
      title: 'Chapter 3 — Agile fundamentals|||Chương 3 — Nền tảng Agile',
      description: 'Agile Manifesto, 4 giá trị & 12 nguyên tắc, và tư duy lặp-tăng-dần thay cho kế hoạch cứng.',
      lessons: [
        {
          title: '3.1 — The Agile Manifesto & mindset|||3.1 — Agile Manifesto & tư duy',
          slug: 'swe201c-agile',
          type: 'VIDEO',
          description: 'Bốn giá trị của Manifesto; vòng lặp ngắn giao phần mềm chạy được; phản hồi khách hàng liên tục.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Agile — embracing change instead of fighting it</h2>
<p class="lead">In 2001, seventeen developers, tired of Waterfall's rigidity, wrote the <strong>Agile Manifesto</strong>. Its insight: since requirements <em>will</em> change, build in short iterations, show working software often, and adapt — rather than plan everything up front and hope.</p>
<h3>The four values (left is valued over right)</h3>
<table>
  <thead><tr><th>Value</th><th>over</th></tr></thead>
  <tbody>
    <tr><td>Individuals &amp; interactions</td><td>processes &amp; tools</td></tr>
    <tr><td>Working software</td><td>comprehensive documentation</td></tr>
    <tr><td>Customer collaboration</td><td>contract negotiation</td></tr>
    <tr><td>Responding to change</td><td>following a plan</td></tr>
  </tbody>
</table>
<div class="note-ct">"Left over right" does not mean the right side is worthless — documentation and plans still matter. It means when they conflict, agile prioritises the left. This nuance is a common exam question.</div>
<div class="out"><b>The core loop:</b> plan a little → build a small working slice → get customer feedback → adapt → repeat every 1–4 weeks. Value is delivered continuously, not all at the end.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Agile is a mindset, not a checklist.</b> Many teams "do agile" — daily stand-ups, sprint boards — while ignoring its values (no real customer collaboration, punishing change). This is "cargo-cult agile": the rituals without the thinking. The 12 principles behind the Manifesto (sustainable pace, technical excellence, self-organising teams) are what actually make it work. Recognising fake agile from real agile is a mark of professional maturity.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/agile-software-development" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Agile Software Development</span><span class="lc-sub">University of Minnesota on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Agile — ôm lấy thay đổi thay vì chống lại</h2>
<p class="lead">Năm 2001, mười bảy lập trình viên, mệt mỏi với sự cứng nhắc của Waterfall, viết <strong>Agile Manifesto</strong>. Cái nhìn của nó: vì yêu cầu <em>sẽ</em> thay đổi, hãy xây theo vòng lặp ngắn, cho thấy phần mềm chạy được thường xuyên, và thích ứng — thay vì lên kế hoạch mọi thứ từ đầu rồi hy vọng.</p>
<h3>Bốn giá trị (bên trái được coi trọng hơn bên phải)</h3>
<table>
  <thead><tr><th>Giá trị</th><th>hơn</th></tr></thead>
  <tbody>
    <tr><td>Cá nhân &amp; tương tác</td><td>quy trình &amp; công cụ</td></tr>
    <tr><td>Phần mềm chạy được</td><td>tài liệu đầy đủ</td></tr>
    <tr><td>Hợp tác với khách hàng</td><td>đàm phán hợp đồng</td></tr>
    <tr><td>Phản hồi thay đổi</td><td>bám theo kế hoạch</td></tr>
  </tbody>
</table>
<div class="note-ct">"Trái hơn phải" không nghĩa là bên phải vô giá trị — tài liệu và kế hoạch vẫn quan trọng. Nó nghĩa là khi chúng xung đột, agile ưu tiên bên trái. Sắc thái này là câu hỏi thi phổ biến.</div>
<div class="out"><b>Vòng lặp cốt lõi:</b> lên kế hoạch một chút → xây một lát cắt chạy được nhỏ → lấy phản hồi khách hàng → thích ứng → lặp mỗi 1–4 tuần. Giá trị được giao liên tục, không phải dồn hết vào cuối.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Agile là tư duy, không phải checklist.</b> Nhiều đội "làm agile" — stand-up hằng ngày, bảng sprint — trong khi phớt lờ giá trị của nó (không thực sự hợp tác khách hàng, trừng phạt thay đổi). Đây là "agile hình thức": nghi thức không có tư duy. 12 nguyên tắc đằng sau Manifesto (nhịp bền vững, xuất sắc kỹ thuật, đội tự tổ chức) mới là thứ làm nó hiệu quả. Nhận ra agile giả với agile thật là dấu hiệu của sự chín chắn chuyên nghiệp.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/agile-software-development" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Agile Software Development</span><span class="lc-sub">Đại học Minnesota trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: 'Quiz 1 — SDLC, traditional models & agile|||Quiz 1 — SDLC, mô hình truyền thống & agile',
          slug: 'swe201c-quiz-1',
          type: 'QUIZ',
          description: 'Kiểm tra SDLC, Waterfall/V-model và nền tảng Agile — gồm câu suy luận.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'The SDLC phase that typically lasts the longest is…|||Pha SDLC thường kéo dài nhất là…', options: ['requirements|||phân tích yêu cầu', 'maintenance|||bảo trì', 'design|||thiết kế', 'deployment|||triển khai'], correctIndex: 1, points: 1 },
              { question: "Waterfall's main weakness is that it…|||Điểm yếu chính của Waterfall là nó…", options: ['has no phases|||không có pha nào', 'assumes all requirements are known and fixed up front|||giả định mọi yêu cầu được biết và cố định từ đầu', 'is too fast|||quá nhanh', 'skips testing|||bỏ kiểm thử'], correctIndex: 1, points: 1 },
              { question: 'The Agile Manifesto values "working software" over…|||Agile Manifesto coi trọng "phần mềm chạy được" hơn…', options: ['customer feedback|||phản hồi khách hàng', 'comprehensive documentation|||tài liệu đầy đủ', 'individuals|||cá nhân', 'responding to change|||phản hồi thay đổi'], correctIndex: 1, points: 1 },
              { question: 'Agile delivers value by…|||Agile giao giá trị bằng cách…', options: ['releasing everything at the very end|||phát hành mọi thứ ở cuối cùng', 'building in short iterations with frequent feedback|||xây theo vòng lặp ngắn với phản hồi thường xuyên', 'avoiding all planning|||tránh mọi lập kế hoạch', 'writing more documents|||viết nhiều tài liệu hơn'], correctIndex: 1, points: 1 },
              { question: 'Waterfall can still be the right choice when… (beyond-syllabus)|||Waterfall vẫn có thể là lựa chọn đúng khi… (ngoài giáo trình)', options: ['requirements change daily|||yêu cầu đổi hằng ngày', 'requirements are fixed &amp; safety-critical (e.g. medical devices)|||yêu cầu cố định &amp; an toàn-trọng yếu (vd thiết bị y tế)', 'the team is small|||đội nhỏ', 'there is no deadline|||không có hạn'], correctIndex: 1, points: 1 },
              { question: '"Cargo-cult agile" refers to… (beyond-syllabus)|||"Agile hình thức" ám chỉ… (ngoài giáo trình)', options: ['a new framework|||một framework mới', 'doing agile rituals while ignoring its actual values|||làm các nghi thức agile mà phớt lờ giá trị thật', 'shipping software|||ship phần mềm', 'a testing tool|||một công cụ kiểm thử'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — SCRUM & XP ══════════════════ */
    {
      title: 'Chapter 4 — Scrum & XP|||Chương 4 — Scrum & XP',
      description: 'Hai framework agile phổ biến nhất: Scrum (vai trò, sprint, các buổi họp) và XP (thực hành kỹ thuật).',
      lessons: [
        {
          title: '4.1 — Scrum roles, sprints & events|||4.1 — Scrum: vai trò, sprint & các buổi họp',
          slug: 'swe201c-scrum-xp',
          type: 'VIDEO',
          description: 'Ba vai trò (PO/Scrum Master/Dev Team); sprint 1-4 tuần; backlog; 4 buổi họp; và các thực hành XP (pair, TDD, CI).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Scrum — the most popular agile framework</h2>
<p class="lead">Agile is a mindset; <strong>Scrum</strong> is a concrete way to do it. It organises work into fixed-length <strong>sprints</strong> (1–4 weeks), each producing a working increment, with clear roles and a rhythm of events.</p>
<h3>The three roles</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Product Owner</b> — owns the <em>what</em> and <em>why</em>: manages the product backlog, prioritises features by value.</div>
  <div class="lz-layer"><b>Scrum Master</b> — a servant-leader who removes blockers and protects the process (not a "boss").</div>
  <div class="lz-layer"><b>Development Team</b> — self-organising, cross-functional; owns the <em>how</em> and builds the increment.</div>
</div>
<h3>The events (the sprint rhythm)</h3>
<div class="lz-flow">
  <div class="lz-step">Sprint Planning — pick backlog items for this sprint</div>
  <div class="lz-step">Daily Scrum — 15-min sync: done / doing / blockers</div>
  <div class="lz-step">Sprint Review — demo the increment to stakeholders</div>
  <div class="lz-step">Retrospective — how can the team improve?</div>
</div>
<h3>XP — engineering discipline</h3>
<p><strong>Extreme Programming (XP)</strong> complements Scrum with <em>technical</em> practices: <span class="badge">pair programming</span> (two devs, one keyboard), <span class="badge">test-driven development</span> (write the test first), <span class="badge">continuous integration</span>, and <span class="badge">refactoring</span>. Scrum organises the team; XP keeps the code healthy.</p>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Velocity &amp; story points — estimating without lying.</b> Teams size work in relative <em>story points</em>, not hours, and track how many they finish per sprint (their <b>velocity</b>). Why relative? Humans are terrible at absolute time estimates but decent at "this is about twice as hard as that". Velocity then forecasts realistic delivery. Misusing velocity as a productivity target (pressuring teams to inflate points) is a classic anti-pattern — a nuance real Scrum Masters must understand.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Scrum — framework agile phổ biến nhất</h2>
<p class="lead">Agile là tư duy; <strong>Scrum</strong> là một cách cụ thể để làm nó. Nó tổ chức công việc thành các <strong>sprint</strong> độ dài cố định (1–4 tuần), mỗi cái tạo ra một increment chạy được, với vai trò rõ ràng và một nhịp các buổi họp.</p>
<h3>Ba vai trò</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Product Owner</b> — sở hữu cái <em>gì</em> và <em>vì sao</em>: quản lý product backlog, ưu tiên tính năng theo giá trị.</div>
  <div class="lz-layer"><b>Scrum Master</b> — một lãnh đạo-phục vụ gỡ vật cản và bảo vệ quy trình (không phải "sếp").</div>
  <div class="lz-layer"><b>Development Team</b> — tự tổ chức, đa chức năng; sở hữu cái <em>làm thế nào</em> và xây increment.</div>
</div>
<h3>Các buổi họp (nhịp sprint)</h3>
<div class="lz-flow">
  <div class="lz-step">Sprint Planning — chọn item backlog cho sprint này</div>
  <div class="lz-step">Daily Scrum — đồng bộ 15 phút: xong / đang làm / vướng</div>
  <div class="lz-step">Sprint Review — demo increment cho các bên liên quan</div>
  <div class="lz-step">Retrospective — đội có thể cải thiện thế nào?</div>
</div>
<h3>XP — kỷ luật kỹ thuật</h3>
<p><strong>Extreme Programming (XP)</strong> bổ trợ Scrum bằng các thực hành <em>kỹ thuật</em>: <span class="badge">pair programming</span> (hai dev, một bàn phím), <span class="badge">test-driven development</span> (viết test trước), <span class="badge">continuous integration</span>, và <span class="badge">refactoring</span>. Scrum tổ chức đội; XP giữ code khỏe mạnh.</p>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Velocity &amp; story point — ước lượng mà không nói dối.</b> Đội đo công việc bằng <em>story point</em> tương đối, không phải giờ, và theo dõi làm xong bao nhiêu mỗi sprint (<b>velocity</b>). Vì sao tương đối? Con người ước lượng thời gian tuyệt đối rất tệ nhưng khá ổn với "cái này khó gấp đôi cái kia". Velocity khi đó dự báo thời điểm giao thực tế. Lạm dụng velocity như một chỉ tiêu năng suất (ép đội thổi phồng điểm) là một anti-pattern kinh điển — sắc thái mà Scrum Master thật phải hiểu.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 4b — KANBAN ══════════════════ */
    {
      title: 'Chapter 5 — Kanban|||Chương 5 — Kanban',
      description: 'Bảng trực quan, giới hạn WIP và luồng liên tục — phương pháp agile không dùng sprint.',
      lessons: [
        {
          title: '5.1 — Boards, WIP limits & continuous flow|||5.1 — Bảng, giới hạn WIP & luồng liên tục',
          slug: 'swe201c-kanban',
          type: 'VIDEO',
          description: 'Sáu thực hành cốt lõi của Kanban, vì sao giới hạn WIP là trái tim của nó, và khi nào chọn Kanban thay vì Scrum.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Kanban — managing flow, not iterations</h2>
<p class="lead">Scrum organises work into fixed-length sprints. Kanban does the opposite: there are <strong>no sprints at all</strong>. Work flows continuously, and the method controls <em>how much</em> is in progress rather than <em>when</em> things start and stop.</p>

<h3>The board</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Columns = stages of your real workflow.</b> A typical board: Backlog → To Do → In Progress → Review → Done. The columns must mirror how your team actually works, not a textbook template.</div>
  <div class="lz-layer"><b>Cards = work items.</b> Each card moves left to right; anyone can see the entire state of the project at a glance.</div>
  <div class="lz-layer"><b>The board is pull-based.</b> A developer finishing an item <em>pulls</em> the next one, instead of a manager pushing work onto people.</div>
</div>

<h3>WIP limits — the heart of the method</h3>
<div class="out"><b>A WIP (Work In Progress) limit</b> is a number written at the top of a column: "In Progress (3)". It means at most three items may sit in that column at once. If the column is full, <b>you may not start anything new</b> — you must first help finish what is already there.<br><br>
<b>Why this works:</b> starting more things does not make them finish faster; it makes everything finish slower, because context switching and half-done work pile up. Limiting WIP forces the team to finish before starting, which shortens the time from "started" to "delivered".</div>
<div class="note-ct"><b>Little's Law</b> makes this precise: average <em>lead time</em> = average <em>WIP</em> ÷ average <em>throughput</em>. With throughput roughly constant, halving WIP halves the time each item takes to get through. That is the whole argument for WIP limits in one formula.</div>

<h3>The six core practices</h3>
<table>
  <thead><tr><th>Practice</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td>Visualise the workflow</td><td>Put every item on a board where the whole team sees it</td></tr>
    <tr><td>Limit WIP</td><td>Cap the number of items per column</td></tr>
    <tr><td>Manage flow</td><td>Watch for bottlenecks; measure lead time and cycle time</td></tr>
    <tr><td>Make policies explicit</td><td>Write down what "Done" means for each column</td></tr>
    <tr><td>Implement feedback loops</td><td>Regular reviews of the board and the process</td></tr>
    <tr><td>Improve collaboratively</td><td>Evolve the process incrementally, as a team</td></tr>
  </tbody>
</table>

<h3>Kanban vs Scrum — the comparison the exam asks for</h3>
<table>
  <thead><tr><th></th><th>Scrum</th><th>Kanban</th></tr></thead>
  <tbody>
    <tr><td>Cadence</td><td>Fixed-length sprints</td><td>Continuous flow, no sprints</td></tr>
    <tr><td>Roles</td><td>PO, Scrum Master, Dev Team (prescribed)</td><td>No prescribed roles</td></tr>
    <tr><td>Change mid-cycle</td><td>Discouraged during a sprint</td><td>Allowed any time — just pull it next</td></tr>
    <tr><td>Key limit</td><td>Sprint scope, fixed at planning</td><td>WIP per column</td></tr>
    <tr><td>Key metric</td><td>Velocity (points per sprint)</td><td>Lead time / cycle time</td></tr>
    <tr><td>Best for</td><td>Feature development in planned batches</td><td>Support, maintenance, unpredictable arrivals</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Exam signal:</b> if a scenario mentions <em>interrupt-driven work</em> — bug fixes, support tickets, operations, requests arriving unpredictably — the answer is Kanban, not Scrum. Sprint commitments break down when priorities change daily; Kanban simply reorders the queue. Conversely, if the scenario needs a predictable release rhythm and planned feature batches, Scrum fits better.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Kanban started on a factory floor, not in software.</b> Taiichi Ohno created it at Toyota in the late 1940s: a physical card (<em>kanban</em> = "signboard") travelled back up the line to signal "we consumed a part, make another". Nothing was produced without a card, so inventory could never balloon. David Anderson adapted the idea to knowledge work in 2007, replacing physical inventory with unfinished tasks — which is why Kanban and Lean (Chapter 6) share so much DNA: both come from the Toyota Production System.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Kanban — quản lý luồng, không quản lý vòng lặp</h2>
<p class="lead">Scrum tổ chức công việc thành các sprint có độ dài cố định. Kanban làm ngược lại: <strong>không có sprint nào cả</strong>. Công việc chảy liên tục, và phương pháp này kiểm soát <em>bao nhiêu việc</em> đang làm dở thay vì <em>khi nào</em> bắt đầu và kết thúc.</p>

<h3>Cái bảng</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Cột = các giai đoạn trong luồng làm việc THẬT của bạn.</b> Một bảng điển hình: Backlog → To Do → In Progress → Review → Done. Các cột phải phản ánh cách đội bạn thực sự làm việc, không phải một khuôn mẫu trong sách.</div>
  <div class="lz-layer"><b>Thẻ = hạng mục công việc.</b> Mỗi thẻ đi từ trái sang phải; ai cũng nhìn thấy toàn bộ trạng thái dự án chỉ trong một cái liếc.</div>
  <div class="lz-layer"><b>Bảng vận hành theo cơ chế kéo (pull).</b> Lập trình viên làm xong một việc sẽ <em>tự kéo</em> việc kế tiếp, thay vì quản lý đẩy việc xuống cho người.</div>
</div>

<h3>Giới hạn WIP — trái tim của phương pháp</h3>
<div class="out"><b>Giới hạn WIP (Work In Progress)</b> là một con số ghi ở đầu cột: "In Progress (3)". Nó có nghĩa nhiều nhất ba hạng mục được nằm trong cột đó cùng lúc. Nếu cột đã đầy, <b>bạn không được phép bắt đầu việc mới</b> — bạn phải giúp hoàn thành những việc đang có trước đã.<br><br>
<b>Vì sao cách này hiệu quả:</b> bắt đầu nhiều việc hơn không làm chúng xong nhanh hơn; nó làm mọi thứ xong CHẬM hơn, vì chi phí chuyển ngữ cảnh và đống việc dở dang chồng chất. Giới hạn WIP buộc đội phải kết thúc trước khi bắt đầu, và điều đó rút ngắn thời gian từ lúc "bắt đầu" tới lúc "bàn giao".</div>
<div class="note-ct"><b>Định luật Little</b> phát biểu chính xác điều này: <em>thời gian chờ</em> trung bình = <em>WIP</em> trung bình ÷ <em>thông lượng</em> trung bình. Với thông lượng gần như không đổi, giảm WIP một nửa thì thời gian mỗi hạng mục đi hết quy trình cũng giảm một nửa. Toàn bộ lý lẽ cho việc giới hạn WIP nằm gọn trong một công thức.</div>

<h3>Sáu thực hành cốt lõi</h3>
<table>
  <thead><tr><th>Thực hành</th><th>Nghĩa là</th></tr></thead>
  <tbody>
    <tr><td>Trực quan hóa luồng công việc</td><td>Đặt mọi hạng mục lên một cái bảng cả đội đều thấy</td></tr>
    <tr><td>Giới hạn WIP</td><td>Đặt trần số hạng mục cho mỗi cột</td></tr>
    <tr><td>Quản lý luồng</td><td>Canh chừng điểm nghẽn; đo lead time và cycle time</td></tr>
    <tr><td>Làm rõ chính sách</td><td>Viết ra "Xong" nghĩa là gì với từng cột</td></tr>
    <tr><td>Cài đặt vòng phản hồi</td><td>Định kỳ xem lại bảng và quy trình</td></tr>
    <tr><td>Cải tiến cùng nhau</td><td>Tiến hóa quy trình từng bước, với tư cách một đội</td></tr>
  </tbody>
</table>

<h3>Kanban vs Scrum — phép so sánh đề thi hay hỏi</h3>
<table>
  <thead><tr><th></th><th>Scrum</th><th>Kanban</th></tr></thead>
  <tbody>
    <tr><td>Nhịp làm việc</td><td>Sprint có độ dài cố định</td><td>Luồng liên tục, không sprint</td></tr>
    <tr><td>Vai trò</td><td>PO, Scrum Master, Dev Team (quy định sẵn)</td><td>Không quy định vai trò nào</td></tr>
    <tr><td>Thay đổi giữa chừng</td><td>Không khuyến khích trong một sprint</td><td>Cho phép bất cứ lúc nào — cứ kéo nó vào lượt kế</td></tr>
    <tr><td>Giới hạn then chốt</td><td>Phạm vi sprint, chốt lúc lập kế hoạch</td><td>WIP mỗi cột</td></tr>
    <tr><td>Chỉ số then chốt</td><td>Velocity (điểm mỗi sprint)</td><td>Lead time / cycle time</td></tr>
    <tr><td>Hợp nhất với</td><td>Phát triển tính năng theo lô đã hoạch định</td><td>Hỗ trợ, bảo trì, việc đến bất thường</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Tín hiệu trong đề thi:</b> nếu tình huống nhắc tới <em>công việc bị ngắt quãng liên tục</em> — sửa lỗi, ticket hỗ trợ, vận hành, yêu cầu đến không đoán trước được — thì đáp án là Kanban, không phải Scrum. Cam kết sprint sụp đổ khi ưu tiên thay đổi hằng ngày; Kanban chỉ việc sắp lại hàng đợi. Ngược lại, nếu tình huống cần nhịp phát hành đều đặn và các lô tính năng được hoạch định, Scrum hợp hơn.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Kanban khởi nguồn từ sàn nhà máy, không phải từ phần mềm.</b> Taiichi Ohno tạo ra nó ở Toyota cuối thập niên 1940: một tấm thẻ vật lý (<em>kanban</em> = "bảng hiệu") đi ngược lên dây chuyền để báo "chúng tôi vừa tiêu thụ một chi tiết, hãy làm cái khác". Không có thẻ thì không sản xuất gì, nên tồn kho không bao giờ phình ra. David Anderson đưa ý tưởng này vào công việc tri thức năm 2007, thay tồn kho vật lý bằng các công việc dở dang — đó là lý do Kanban và Lean (Chương 6) có chung rất nhiều gen: cả hai đều đến từ Hệ thống Sản xuất Toyota.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — LEAN ══════════════════ */
    {
      title: 'Chapter 6 — Lean software development|||Chương 6 — Phát triển phần mềm Lean',
      description: 'Nguồn gốc từ sản xuất Toyota; bảy loại lãng phí; và các nguyên tắc lean áp cho phần mềm.',
      lessons: [
        {
          title: '6.1 — Eliminating waste, delivering fast|||6.1 — Loại bỏ lãng phí, giao nhanh',
          slug: 'swe201c-lean',
          type: 'VIDEO',
          description: 'Lean từ Toyota; 7 loại lãng phí trong phần mềm; nguyên tắc (build-measure-learn, quyết định muộn, tối ưu toàn cục).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Lean — maximise value, minimise waste</h2>
<p class="lead"><strong>Lean</strong> came from Toyota's manufacturing and was adapted to software by Mary &amp; Tom Poppendieck. Its single obsession: relentlessly remove anything that does not add value for the customer, and deliver as fast as quality allows.</p>
<h3>The seven wastes in software</h3>
<table>
  <thead><tr><th>Waste</th><th>In software looks like…</th></tr></thead>
  <tbody>
    <tr><td>Partially done work</td><td>half-finished features sitting unused</td></tr>
    <tr><td>Extra features</td><td>building things nobody asked for</td></tr>
    <tr><td>Relearning</td><td>losing knowledge, re-solving solved problems</td></tr>
    <tr><td>Handoffs</td><td>knowledge lost passing between people</td></tr>
    <tr><td>Delays</td><td>waiting for approvals, decisions</td></tr>
    <tr><td>Task switching</td><td>context-switching between many tasks</td></tr>
    <tr><td>Defects</td><td>bugs that must be found and fixed later</td></tr>
  </tbody>
</table>
<div class="note-ct">Key lean principles: <b>amplify learning</b> (build-measure-learn loops), <b>decide as late as possible</b> (keep options open until you have the most information), <b>deliver as fast as possible</b>, and <b>optimise the whole</b> (not just one team's local efficiency).</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Lean, Agile and Kanban — how they relate.</b> Students often confuse these. Agile is the umbrella philosophy; Scrum is one agile framework (time-boxed sprints); Lean is a value/waste mindset from manufacturing; and <b>Kanban</b> (a lean tool) visualises work on a board and <em>limits work-in-progress</em> to expose bottlenecks — no sprints at all. Many real teams blend "Scrumban". Knowing they are complementary, not competing, is exactly the "compare &amp; contrast methodologies" that CLO1 tests.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/lean-software-development" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Lean Software Development</span><span class="lc-sub">University of Minnesota on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Lean — tối đa giá trị, tối thiểu lãng phí</h2>
<p class="lead"><strong>Lean</strong> đến từ sản xuất của Toyota và được Mary &amp; Tom Poppendieck áp cho phần mềm. Nỗi ám ảnh duy nhất: kiên trì loại bỏ mọi thứ không thêm giá trị cho khách hàng, và giao nhanh nhất mà chất lượng cho phép.</p>
<h3>Bảy loại lãng phí trong phần mềm</h3>
<table>
  <thead><tr><th>Lãng phí</th><th>Trong phần mềm trông như…</th></tr></thead>
  <tbody>
    <tr><td>Việc làm dở</td><td>tính năng làm nửa chừng nằm không dùng</td></tr>
    <tr><td>Tính năng thừa</td><td>xây thứ không ai yêu cầu</td></tr>
    <tr><td>Học lại</td><td>mất kiến thức, giải lại vấn đề đã giải</td></tr>
    <tr><td>Bàn giao</td><td>kiến thức mất khi chuyền giữa người</td></tr>
    <tr><td>Trì hoãn</td><td>chờ phê duyệt, quyết định</td></tr>
    <tr><td>Chuyển việc</td><td>chuyển ngữ cảnh giữa nhiều tác vụ</td></tr>
    <tr><td>Lỗi</td><td>bug phải tìm và sửa sau</td></tr>
  </tbody>
</table>
<div class="note-ct">Nguyên tắc lean then chốt: <b>khuếch đại học hỏi</b> (vòng build-measure-learn), <b>quyết định muộn nhất có thể</b> (giữ lựa chọn mở tới khi có nhiều thông tin nhất), <b>giao nhanh nhất có thể</b>, và <b>tối ưu toàn cục</b> (không chỉ hiệu quả cục bộ của một đội).</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Lean, Agile và Kanban — chúng liên hệ thế nào.</b> Sinh viên hay lẫn ba cái này. Agile là triết lý bao trùm; Scrum là một framework agile (sprint đóng khung thời gian); Lean là tư duy giá trị/lãng phí từ sản xuất; và <b>Kanban</b> (một công cụ lean) trực quan hóa công việc trên một bảng và <em>giới hạn việc-đang-làm</em> để lộ điểm nghẽn — không sprint gì cả. Nhiều đội thật pha "Scrumban". Biết chúng bổ trợ nhau, không cạnh tranh, chính là "so sánh &amp; đối chiếu phương pháp" mà CLO1 kiểm.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/lean-software-development" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Lean Software Development</span><span class="lc-sub">Đại học Minnesota trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 6 — BẢO MẬT & CHẤT LƯỢNG ══════════════════ */
    {
      title: 'Chapter 7 — Secure & quality software|||Chương 7 — Phần mềm bảo mật & chất lượng',
      description: 'Chất lượng không phải tình cờ: kiểm thử, code review, và đưa bảo mật vào toàn bộ vòng đời.',
      lessons: [
        {
          title: '7.1 — Engineering practices for quality & security|||7.1 — Thực hành kỹ thuật cho chất lượng & bảo mật',
          slug: 'swe201c-chat-luong-bao-mat',
          type: 'VIDEO',
          description: 'Các mức kiểm thử; code review; và "shift-left security" — đưa bảo mật vào từ đầu thay vì vá cuối.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Building quality in, not testing it in</h2>
<p class="lead">Quality and security cannot be bolted on at the end — they must be built in throughout the lifecycle. This chapter (CLO4) is the practices that separate software people trust from software they don't.</p>
<h3>Quality practices</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Testing levels</b> — unit (one function), integration (parts together), system (the whole), acceptance (does it meet the requirement).</div>
  <div class="lz-layer"><b>Code review</b> — another human reads your code before it merges. Catches bugs and spreads knowledge.</div>
  <div class="lz-layer"><b>Automated testing &amp; CI</b> — tests run on every change, so breakage is caught in minutes, not at release.</div>
</div>
<h3>Secure software</h3>
<p>Security is not a feature you add last; it is a mindset applied at every phase — from threat-modelling in design to validating input in code (recall SQL injection from PRJ301). The idea of <strong>"shift left"</strong>: move security and testing <em>earlier</em>, because (per Chapter 1's cost curve) a flaw found early is far cheaper than a breach in production.</p>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Technical debt — the interest you pay for shortcuts.</b> When a team ships quick-and-dirty code to hit a deadline, they take on <b>technical debt</b>: like a loan, it lets you go faster now but charges "interest" later as every future change becomes harder in the messy code. Some debt is a smart, deliberate trade-off; unmanaged debt eventually stops a project dead. Naming and managing technical debt — deciding when to "pay it down" via refactoring — is one of the most valuable judgments a senior engineer makes.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/engineering-practices-secure-software-quality" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Engineering Practices for Quality Software</span><span class="lc-sub">University of Minnesota on Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Xây chất lượng vào trong, không phải kiểm vào cuối</h2>
<p class="lead">Chất lượng và bảo mật không thể gắn thêm ở cuối — chúng phải được xây vào suốt vòng đời. Chương này (CLO4) là các thực hành tách phần mềm người ta tin dùng khỏi phần mềm họ không tin.</p>
<h3>Thực hành chất lượng</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Các mức kiểm thử</b> — unit (một hàm), integration (các phần với nhau), system (toàn bộ), acceptance (có đáp ứng yêu cầu không).</div>
  <div class="lz-layer"><b>Code review</b> — một người khác đọc code của bạn trước khi merge. Bắt bug và lan truyền kiến thức.</div>
  <div class="lz-layer"><b>Kiểm thử tự động &amp; CI</b> — test chạy mỗi thay đổi, nên hỏng hóc bị bắt trong vài phút, không phải lúc phát hành.</div>
</div>
<h3>Phần mềm bảo mật</h3>
<p>Bảo mật không phải một tính năng bạn thêm cuối cùng; nó là một tư duy áp ở mọi pha — từ mô hình hóa mối đe dọa khi thiết kế tới validate input khi code (nhớ SQL injection ở PRJ301). Ý tưởng <strong>"shift left"</strong>: đưa bảo mật và kiểm thử <em>sớm hơn</em>, vì (theo đường cong chi phí ở Chương 1) một lỗ hổng tìm sớm rẻ hơn nhiều so với một vụ rò rỉ ở production.</p>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nợ kỹ thuật (technical debt) — tiền lãi bạn trả cho việc đi tắt.</b> Khi một đội ship code nhanh-và-ẩu để kịp hạn, họ vay <b>nợ kỹ thuật</b>: như một khoản vay, nó cho bạn đi nhanh bây giờ nhưng tính "lãi" sau này khi mọi thay đổi tương lai thành khó hơn trong đống code lộn xộn. Một số nợ là đánh đổi khôn ngoan, có chủ đích; nợ không quản lý cuối cùng làm dự án chết đứng. Đặt tên và quản lý nợ kỹ thuật — quyết định khi nào "trả nợ" bằng refactoring — là một trong những phán đoán giá trị nhất mà một kỹ sư senior đưa ra.</div>
<a class="link-card codelab" href="https://www.coursera.org/learn/engineering-practices-secure-software-quality" target="_blank" rel="noopener">
  <span class="lc-ico">🎓</span>
  <span class="lc-body"><span class="lc-title">MOOC: Engineering Practices for Quality Software</span><span class="lc-sub">Đại học Minnesota trên Coursera.</span></span>
  <span class="lc-cta">COURSERA →</span>
</a>
</div>
`,
        },
        {
          title: '7.2 — Code quality metrics (cohesion, coupling, complexity)|||7.2 — Chỉ số chất lượng mã (cohesion, coupling, độ phức tạp)',
          slug: 'swe201c-quality-metrics',
          type: 'VIDEO',
          description: 'Đo chất lượng thiết kế bằng số: cohesion (LCOM, TCC), coupling (CBO, RFC), Cyclomatic Complexity, Code Coverage, DIT.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Measuring design quality with numbers</h2>
<p class="lead">"Good code" is a matter of opinion until you attach a metric to it. PE question 5 may ask you to list quality metrics, so learn the names, what each measures, and which direction is good.</p>

<h3>The two central ideas: cohesion and coupling</h3>
<div class="out"><b>Cohesion</b> = how strongly the elements <em>inside</em> one module belong together. <b>HIGH cohesion is good.</b><br>
<b>Coupling</b> = how strongly one module depends on <em>other</em> modules. <b>LOW (loose) coupling is good.</b><br><br>
The universal design goal is therefore: <b>high cohesion, loose coupling</b> — each module does one clear job and knows as little as possible about the others.</div>

<h3>Cohesion metrics</h3>
<table>
  <thead><tr><th>Metric</th><th>Measures</th><th>Good direction</th></tr></thead>
  <tbody>
    <tr><td><b>LCOM</b> (Lack of Cohesion of Methods)</td><td>How much the methods of a class fail to share fields</td><td><b>Low</b> (low lack = high cohesion)</td></tr>
    <tr><td><b>TCC</b> (Tight Class Cohesion)</td><td>Fraction of method pairs that use a common attribute</td><td><b>High</b></td></tr>
  </tbody>
</table>
<div class="note-ct">Careful with direction: LCOM measures the <em>lack</em> of cohesion, so lower is better; TCC measures cohesion directly, so higher is better. Mixing this up is an easy way to lose a mark.</div>

<h3>Levels of cohesion (worst → best)</h3>
<table>
  <thead><tr><th>Level</th><th>Elements grouped because…</th></tr></thead>
  <tbody>
    <tr><td><b>Coincidental</b> (worst)</td><td>…no reason at all — a "utils" dumping ground</td></tr>
    <tr><td>Logical</td><td>…they are the same <em>kind</em> of activity, selected by a flag</td></tr>
    <tr><td><b>Temporal</b></td><td>…they happen at the same <em>time</em> (e.g. everything in "startup()")</td></tr>
    <tr><td>Procedural / Communicational</td><td>…they follow an order, or act on the same data</td></tr>
    <tr><td><b>Functional</b> (best)</td><td>…they all contribute to exactly one well-defined task</td></tr>
  </tbody>
</table>
<div class="note-ct"><b>Coincidental</b> and <b>temporal</b> cohesion are named explicitly in FE vocabulary lists, so know them: coincidental = grouped for no reason; temporal = grouped only because they run at the same moment.</div>

<h3>Coupling metrics</h3>
<table>
  <thead><tr><th>Metric</th><th>Measures</th><th>Good direction</th></tr></thead>
  <tbody>
    <tr><td><b>CBO</b> (Coupling Between Objects)</td><td>Number of other classes a class is coupled to</td><td><b>Low</b></td></tr>
    <tr><td><b>RFC</b> (Response For a Class)</td><td>Number of methods that can be executed in response to a message</td><td><b>Low</b></td></tr>
  </tbody>
</table>

<h3>Other metrics you should be able to name</h3>
<table>
  <thead><tr><th>Metric</th><th>What it tells you</th><th>Rule of thumb</th></tr></thead>
  <tbody>
    <tr><td><b>Cyclomatic Complexity</b> (McCabe)</td><td>Number of independent paths through a function — one per decision point + 1</td><td>≤ 10 per function is healthy; &gt; 20 needs refactoring</td></tr>
    <tr><td><b>Code Coverage</b></td><td>Percentage of statements/branches exercised by tests</td><td>Higher is better, but 100% coverage ≠ correct</td></tr>
    <tr><td><b>DIT</b> (Depth of Inheritance Tree)</td><td>How deep a class sits in the inheritance hierarchy</td><td>Deep trees are hard to understand — keep shallow</td></tr>
    <tr><td>Defect density</td><td>Defects per thousand lines of code</td><td>Lower is better; useful for comparing modules</td></tr>
  </tbody>
</table>
<div class="out"><b>Computing cyclomatic complexity quickly:</b> count the decision points (if, else-if, while, for, case, &amp;&amp;, ||, catch) and add 1. A function with two ifs and one loop has 3 + 1 = <b>4</b> independent paths — which is also the minimum number of test cases needed for full branch coverage.</div>
<div class="pitfall"><b>Two traps:</b> (1) treating <b>100% code coverage as proof of correctness</b> — coverage says every line <em>ran</em>, not that every line was <em>checked</em>; a test with no assertions can reach 100% and verify nothing (this is the Chapter 8 "absence-of-errors fallacy" wearing a metric's clothes); (2) reporting LCOM as "higher is better" — it is a <em>lack</em> measure.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Metrics steer behaviour — for better and worse (Goodhart's Law).</b> "When a measure becomes a target, it ceases to be a good measure." Mandate 90% coverage and teams will write assertion-free tests that touch every line; reward low defect counts and testers stop logging small bugs. Metrics are best used as <em>conversation starters</em> — a class with sky-high CBO is a question ("why does this touch 30 other classes?"), not an automatic verdict.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Đo chất lượng thiết kế bằng con số</h2>
<p class="lead">"Code tốt" chỉ là chuyện quan điểm cho tới khi bạn gắn một chỉ số vào nó. Câu 5 của bài PE có thể yêu cầu liệt kê các chỉ số chất lượng, nên hãy thuộc tên, ý nghĩa và chiều nào là tốt.</p>

<h3>Hai ý tưởng trung tâm: cohesion và coupling</h3>
<div class="out"><b>Cohesion (độ kết dính)</b> = các thành phần <em>bên trong</em> một module gắn bó với nhau chặt tới đâu. <b>Cohesion CAO là tốt.</b><br>
<b>Coupling (độ phụ thuộc)</b> = một module phụ thuộc vào <em>các module khác</em> chặt tới đâu. <b>Coupling THẤP (lỏng) là tốt.</b><br><br>
Vì vậy mục tiêu thiết kế phổ quát là: <b>cohesion cao, coupling lỏng</b> — mỗi module làm đúng một việc rõ ràng và biết càng ít về các module khác càng tốt.</div>

<h3>Chỉ số cohesion</h3>
<table>
  <thead><tr><th>Chỉ số</th><th>Đo cái gì</th><th>Chiều tốt</th></tr></thead>
  <tbody>
    <tr><td><b>LCOM</b> (Lack of Cohesion of Methods)</td><td>Mức độ các phương thức của một lớp KHÔNG dùng chung thuộc tính</td><td><b>Thấp</b> (thiếu ít = kết dính cao)</td></tr>
    <tr><td><b>TCC</b> (Tight Class Cohesion)</td><td>Tỷ lệ cặp phương thức cùng dùng một thuộc tính</td><td><b>Cao</b></td></tr>
  </tbody>
</table>
<div class="note-ct">Cẩn thận về chiều: LCOM đo sự <em>thiếu</em> kết dính, nên thấp mới tốt; TCC đo kết dính trực tiếp, nên cao mới tốt. Nhầm chỗ này là mất điểm rất dễ.</div>

<h3>Các mức cohesion (tệ nhất → tốt nhất)</h3>
<table>
  <thead><tr><th>Mức</th><th>Gom nhóm vì…</th></tr></thead>
  <tbody>
    <tr><td><b>Coincidental</b> (tệ nhất)</td><td>…chẳng vì lý do gì — một cái sọt "utils" vứt bừa</td></tr>
    <tr><td>Logical</td><td>…chúng cùng một <em>kiểu</em> hoạt động, chọn bằng cờ điều khiển</td></tr>
    <tr><td><b>Temporal</b></td><td>…chúng xảy ra cùng một <em>thời điểm</em> (vd. mọi thứ trong "startup()")</td></tr>
    <tr><td>Procedural / Communicational</td><td>…chúng theo một trình tự, hoặc cùng tác động lên một dữ liệu</td></tr>
    <tr><td><b>Functional</b> (tốt nhất)</td><td>…tất cả cùng đóng góp cho đúng một nhiệm vụ được định nghĩa rõ</td></tr>
  </tbody>
</table>
<div class="note-ct"><b>Coincidental</b> và <b>temporal</b> cohesion được nêu đích danh trong danh sách từ vựng FE, nên hãy nhớ: coincidental = gom nhóm không vì lý do gì; temporal = gom nhóm chỉ vì chúng chạy cùng một lúc.</div>

<h3>Chỉ số coupling</h3>
<table>
  <thead><tr><th>Chỉ số</th><th>Đo cái gì</th><th>Chiều tốt</th></tr></thead>
  <tbody>
    <tr><td><b>CBO</b> (Coupling Between Objects)</td><td>Số lớp khác mà một lớp bị ràng buộc vào</td><td><b>Thấp</b></td></tr>
    <tr><td><b>RFC</b> (Response For a Class)</td><td>Số phương thức có thể được thực thi để đáp lại một thông điệp</td><td><b>Thấp</b></td></tr>
  </tbody>
</table>

<h3>Các chỉ số khác cần gọi được tên</h3>
<table>
  <thead><tr><th>Chỉ số</th><th>Cho biết điều gì</th><th>Ngưỡng tham khảo</th></tr></thead>
  <tbody>
    <tr><td><b>Cyclomatic Complexity</b> (McCabe)</td><td>Số đường đi độc lập qua một hàm — mỗi điểm rẽ nhánh một đường, cộng 1</td><td>≤ 10 mỗi hàm là lành mạnh; &gt; 20 cần refactor</td></tr>
    <tr><td><b>Code Coverage</b></td><td>Phần trăm câu lệnh/nhánh được test chạm tới</td><td>Cao thì tốt, nhưng phủ 100% ≠ đúng đắn</td></tr>
    <tr><td><b>DIT</b> (Depth of Inheritance Tree)</td><td>Lớp nằm sâu bao nhiêu trong cây kế thừa</td><td>Cây sâu khó hiểu — nên giữ nông</td></tr>
    <tr><td>Mật độ lỗi</td><td>Số lỗi trên một nghìn dòng code</td><td>Thấp thì tốt; hữu ích để so sánh giữa các module</td></tr>
  </tbody>
</table>
<div class="out"><b>Tính nhanh cyclomatic complexity:</b> đếm số điểm rẽ nhánh (if, else-if, while, for, case, &amp;&amp;, ||, catch) rồi cộng 1. Một hàm có hai câu if và một vòng lặp có 3 + 1 = <b>4</b> đường đi độc lập — cũng chính là số test case tối thiểu cần để phủ hết nhánh.</div>
<div class="pitfall"><b>Hai bẫy:</b> (1) coi <b>độ phủ 100% là bằng chứng của tính đúng đắn</b> — độ phủ nói rằng mọi dòng đã <em>chạy</em>, không nói rằng mọi dòng đã được <em>kiểm chứng</em>; một test không có câu assert nào vẫn đạt 100% mà chẳng xác minh điều gì (đây chính là "ngụy biện không có lỗi" ở Chương 8 khoác áo một chỉ số); (2) báo cáo LCOM theo kiểu "càng cao càng tốt" — nó là thước đo sự <em>thiếu</em> kết dính.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chỉ số lái hành vi — theo cả hướng tốt lẫn xấu (Định luật Goodhart).</b> "Khi một thước đo trở thành mục tiêu, nó thôi là một thước đo tốt." Ép buộc phủ 90% thì đội sẽ viết những test không có assert nào mà vẫn chạm mọi dòng; thưởng cho số lỗi thấp thì tester thôi ghi nhận các lỗi nhỏ. Chỉ số dùng tốt nhất như <em>cái cớ để bắt đầu một cuộc trò chuyện</em> — một lớp có CBO cao ngất là một câu hỏi ("tại sao nó chạm tới 30 lớp khác?"), không phải một bản án tự động.</div>
</div>
`,
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 8 — KIỂM THỬ PHẦN MỀM ══════════════════ */
    {
      title: 'Chapter 8 — Software testing|||Chương 8 — Kiểm thử phần mềm',
      description: '7 nguyên tắc, Verification vs Validation, 4 mức kiểm thử và ai chịu trách nhiệm, ba trục phân loại, và bộ tứ retest/regression/smoke/sanity.',
      lessons: [
        {
          title: '8.1 — Seven principles & Verification vs Validation|||8.1 — Bảy nguyên tắc & Verification vs Validation',
          slug: 'swe201c-nguyen-tac-kiem-thu',
          type: 'VIDEO',
          description: 'Bảy nguyên tắc kiểm thử nền tảng và phân biệt "xây đúng sản phẩm" với "xây sản phẩm đúng".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>The foundations of testing</h2>
<p class="lead">Testing is not "trying to prove the software works". It is a systematic search for evidence that it does not. Seven principles explain why, and they are directly examinable.</p>

<h3>The seven testing principles</h3>
<table>
  <thead><tr><th>Principle</th><th>What it means</th></tr></thead>
  <tbody>
    <tr><td>1. Testing shows the presence of defects</td><td>Testing can prove bugs exist; it can never prove there are none.</td></tr>
    <tr><td>2. Exhaustive testing is impossible</td><td>Testing every input combination is infeasible — use risk and priorities instead.</td></tr>
    <tr><td>3. Early testing</td><td>Start test activities as early as possible; a requirements defect caught early costs a fraction of one caught in production.</td></tr>
    <tr><td>4. Defect clustering</td><td>A small number of modules usually contains most of the defects (the Pareto effect).</td></tr>
    <tr><td>5. Pesticide paradox</td><td>Running the same tests repeatedly stops finding new bugs — tests must be reviewed and updated.</td></tr>
    <tr><td>6. Testing is context dependent</td><td>A banking system, a game and a medical device need very different testing.</td></tr>
    <tr><td>7. Absence-of-errors fallacy</td><td>Software with no known bugs is still useless if it does not meet user needs.</td></tr>
  </tbody>
</table>
<div class="note-ct">Principles 1 and 7 are the pair examiners love: <b>no defects found ≠ good software</b>. You can have a perfectly bug-free product that solves the wrong problem — which is exactly what Validation (below) is designed to catch.</div>

<h3>Verification vs Validation</h3>
<table>
  <thead><tr><th></th><th>Verification</th><th>Validation</th></tr></thead>
  <tbody>
    <tr><td>Question asked</td><td>"Are we building the product <b>right</b>?"</td><td>"Are we building the <b>right</b> product?"</td></tr>
    <tr><td>Checks against</td><td>Specifications and design documents</td><td>Actual user needs</td></tr>
    <tr><td>Typical activity</td><td>Reviews, walkthroughs, inspections, static analysis</td><td>Actual execution: system and acceptance testing</td></tr>
    <tr><td>Timing</td><td>Throughout, before the code runs</td><td>Once something runs, mainly at the end</td></tr>
    <tr><td>Involves the user?</td><td>Usually not</td><td>Yes — the user decides</td></tr>
  </tbody>
</table>
<div class="out"><b>Memory hook.</b> Verification = <em>"right"</em> attached to the <b>process</b> (built correctly, per spec). Validation = <em>"right"</em> attached to the <b>product</b> (the correct thing to build at all).<br>
A perfectly implemented feature that nobody asked for <b>passes verification and fails validation</b>.</div>
<div class="note-ct">This maps directly onto the V-model from Lesson 2.1: the left-hand descending branch is verification (each document checked against the one above it), and the right-hand ascending branch is validation (each test level checking against its matching specification).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Why exhaustive testing is impossible — a number.</b> A trivial function taking three 32-bit integers has 2⁹⁶ possible input combinations, roughly 10²⁹. Running a billion tests per second since the Big Bang would not finish a measurable fraction of them. This is not a practical limitation to be engineered away; it is why testing is fundamentally a <em>sampling</em> activity, and why techniques like equivalence partitioning and boundary value analysis exist — they choose the sample intelligently.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Nền tảng của kiểm thử</h2>
<p class="lead">Kiểm thử không phải là "cố chứng minh phần mềm chạy được". Nó là cuộc tìm kiếm có hệ thống bằng chứng cho thấy phần mềm KHÔNG chạy đúng. Bảy nguyên tắc giải thích vì sao, và chúng được hỏi trực tiếp trong đề.</p>

<h3>Bảy nguyên tắc kiểm thử</h3>
<table>
  <thead><tr><th>Nguyên tắc</th><th>Nghĩa là gì</th></tr></thead>
  <tbody>
    <tr><td>1. Kiểm thử chỉ ra sự TỒN TẠI của lỗi</td><td>Kiểm thử chứng minh được có lỗi; không bao giờ chứng minh được không có lỗi nào.</td></tr>
    <tr><td>2. Kiểm thử vét cạn là bất khả thi</td><td>Thử mọi tổ hợp đầu vào là không khả thi — hãy dùng rủi ro và độ ưu tiên thay thế.</td></tr>
    <tr><td>3. Kiểm thử sớm</td><td>Bắt đầu hoạt động kiểm thử càng sớm càng tốt; một lỗi yêu cầu bắt được sớm rẻ hơn nhiều lần so với bắt được ở production.</td></tr>
    <tr><td>4. Lỗi tụ cụm</td><td>Một số ít module thường chứa phần lớn lỗi (hiệu ứng Pareto).</td></tr>
    <tr><td>5. Nghịch lý thuốc trừ sâu</td><td>Chạy đi chạy lại cùng bộ test sẽ thôi tìm ra lỗi mới — test phải được rà soát và cập nhật.</td></tr>
    <tr><td>6. Kiểm thử phụ thuộc bối cảnh</td><td>Hệ thống ngân hàng, một trò chơi và một thiết bị y tế cần cách kiểm thử rất khác nhau.</td></tr>
    <tr><td>7. Ngụy biện "không có lỗi"</td><td>Phần mềm không còn lỗi nào đã biết vẫn vô dụng nếu nó không đáp ứng nhu cầu người dùng.</td></tr>
  </tbody>
</table>
<div class="note-ct">Nguyên tắc 1 và 7 là cặp mà người ra đề rất thích: <b>không tìm thấy lỗi ≠ phần mềm tốt</b>. Bạn có thể có một sản phẩm sạch bong không lỗi mà lại giải sai bài toán — và đó chính xác là thứ Validation (bên dưới) sinh ra để bắt.</div>

<h3>Verification vs Validation</h3>
<table>
  <thead><tr><th></th><th>Verification (Kiểm chứng)</th><th>Validation (Thẩm định)</th></tr></thead>
  <tbody>
    <tr><td>Câu hỏi đặt ra</td><td>"Chúng ta có đang xây sản phẩm <b>đúng cách</b> không?"</td><td>"Chúng ta có đang xây <b>đúng sản phẩm</b> không?"</td></tr>
    <tr><td>Đối chiếu với</td><td>Đặc tả và tài liệu thiết kế</td><td>Nhu cầu thực của người dùng</td></tr>
    <tr><td>Hoạt động điển hình</td><td>Review, walkthrough, inspection, phân tích tĩnh</td><td>Chạy thật: kiểm thử hệ thống và chấp nhận</td></tr>
    <tr><td>Thời điểm</td><td>Xuyên suốt, trước khi code chạy</td><td>Khi đã có thứ chạy được, chủ yếu ở cuối</td></tr>
    <tr><td>Có người dùng tham gia?</td><td>Thường là không</td><td>Có — người dùng là người quyết định</td></tr>
  </tbody>
</table>
<div class="out"><b>Mẹo nhớ.</b> Verification = chữ <em>"đúng"</em> gắn vào <b>cách làm</b> (xây đúng quy trình, đúng đặc tả). Validation = chữ <em>"đúng"</em> gắn vào <b>sản phẩm</b> (có phải thứ đáng xây hay không).<br>
Một tính năng được cài đặt hoàn hảo mà không ai yêu cầu thì <b>đạt verification và trượt validation</b>.</div>
<div class="note-ct">Điều này ánh xạ trực tiếp lên mô hình V ở bài 2.1: nhánh trái đi xuống là verification (mỗi tài liệu được đối chiếu với tài liệu ở trên nó), còn nhánh phải đi lên là validation (mỗi mức kiểm thử đối chiếu với đặc tả tương ứng của nó).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vì sao kiểm thử vét cạn là bất khả thi — một con số.</b> Một hàm tầm thường nhận ba số nguyên 32-bit có 2⁹⁶ tổ hợp đầu vào, khoảng 10²⁹. Chạy một tỷ test mỗi giây từ thời Big Bang tới nay cũng chưa xong được một phần đáng kể. Đây không phải hạn chế kỹ thuật có thể khắc phục; đó là lý do kiểm thử về bản chất là hoạt động <em>lấy mẫu</em>, và là lý do các kỹ thuật như phân hoạch tương đương và phân tích giá trị biên tồn tại — chúng chọn mẫu một cách thông minh.</div>
</div>
`,
        },
        {
          title: '8.2 — The four test levels & who does them|||8.2 — Bốn mức kiểm thử & ai thực hiện',
          slug: 'swe201c-muc-kiem-thu',
          type: 'VIDEO',
          description: 'Unit → Integration → System → Acceptance: mỗi mức kiểm gì, ai chịu trách nhiệm, và bẫy "Regression là mức thứ 5".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>The four levels — and who owns each one</h2>
<p class="lead">Test levels follow the system's construction: from the smallest piece up to the finished product in the customer's hands. PE questions ask you to list them <em>with responsibilities</em>, so learn both columns.</p>
<table>
  <thead><tr><th>Level</th><th>What is tested</th><th>Performed by</th><th>Focus</th></tr></thead>
  <tbody>
    <tr><td><b>1. Unit</b></td><td>A single function, method or class in isolation</td><td><b>Developers</b></td><td>Does this smallest piece behave correctly on its own?</td></tr>
    <tr><td><b>2. Integration</b></td><td>Interfaces and interaction between modules</td><td><b>Developers / Testers</b></td><td>Do the parts work together — data passing, APIs, calls?</td></tr>
    <tr><td><b>3. System</b></td><td>The complete, integrated system as a whole</td><td><b>QA / Test team</b></td><td>Does the whole product meet the specified requirements?</td></tr>
    <tr><td><b>4. Acceptance</b></td><td>The system against real business needs</td><td><b>End users / Customer</b></td><td>Is it acceptable to the people who will use and pay for it?</td></tr>
  </tbody>
</table>

<h3>How the levels map to the V-model</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Acceptance testing</b> validates the <em>requirements</em> document.</div>
  <div class="lz-layer"><b>System testing</b> validates the <em>system specification</em>.</div>
  <div class="lz-layer"><b>Integration testing</b> validates the <em>architectural design</em>.</div>
  <div class="lz-layer"><b>Unit testing</b> validates the <em>detailed/module design</em>.</div>
</div>
<div class="note-ct">Each level checks the document produced at the same height on the left branch of the V. That symmetry is the entire point of the V-model, and stating it earns marks in questions that ask you to relate testing to the lifecycle.</div>

<h3>Integration strategies (a common follow-up question)</h3>
<table>
  <thead><tr><th>Strategy</th><th>How it works</th><th>Needs</th></tr></thead>
  <tbody>
    <tr><td>Big Bang</td><td>Integrate everything at once, then test</td><td>Nothing extra — but defects are very hard to locate</td></tr>
    <tr><td>Top-down</td><td>Start at the top modules, work downwards</td><td><b>Stubs</b> to simulate the not-yet-written lower modules</td></tr>
    <tr><td>Bottom-up</td><td>Start at the lowest modules, work upwards</td><td><b>Drivers</b> to call the modules under test</td></tr>
    <tr><td>Sandwich / hybrid</td><td>Both directions meeting in the middle</td><td>Both stubs and drivers</td></tr>
  </tbody>
</table>
<div class="out"><b>Stub vs driver — the difference students mix up:</b><br>
A <b>stub</b> stands in for a module that the tested module <em>calls</em> (it is <em>below</em> in the hierarchy) → used in top-down.<br>
A <b>driver</b> stands in for a module that <em>calls</em> the tested module (it is <em>above</em>) → used in bottom-up.</div>

<div class="pitfall"><b>The most common PE mistake in this question:</b> writing "Regression testing" as a fifth level. <b>Regression is a test TYPE, not a level.</b> There are exactly four levels — Unit, Integration, System, Acceptance — and regression can be performed at any of them. Listing it as a level loses the mark even though the rest of the answer may be correct.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Two acceptance-testing variants worth naming:</b> <b>Alpha testing</b> happens at the developer's site with real users but a controlled environment; <b>Beta testing</b> happens at the customer's own site, in the wild, with no developer present. Both are acceptance testing — the difference is only <em>where</em> and <em>how controlled</em>. Mentioning this distinction in an exam answer signals depth beyond the slide deck.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Bốn mức kiểm thử — và ai phụ trách mức nào</h2>
<p class="lead">Các mức kiểm thử đi theo quá trình xây dựng hệ thống: từ mảnh nhỏ nhất lên tới sản phẩm hoàn chỉnh trong tay khách hàng. Câu hỏi PE yêu cầu bạn liệt kê chúng <em>kèm trách nhiệm</em>, nên hãy thuộc cả hai cột.</p>
<table>
  <thead><tr><th>Mức</th><th>Kiểm cái gì</th><th>Ai thực hiện</th><th>Trọng tâm</th></tr></thead>
  <tbody>
    <tr><td><b>1. Unit</b></td><td>Một hàm, phương thức hoặc lớp đơn lẻ, tách biệt</td><td><b>Lập trình viên</b></td><td>Mảnh nhỏ nhất này chạy đúng khi đứng riêng không?</td></tr>
    <tr><td><b>2. Integration</b></td><td>Giao diện và tương tác giữa các module</td><td><b>Lập trình viên / Tester</b></td><td>Các phần có ghép được với nhau không — truyền dữ liệu, API, lời gọi?</td></tr>
    <tr><td><b>3. System</b></td><td>Toàn bộ hệ thống đã tích hợp, xét như một khối</td><td><b>Đội QA / Test</b></td><td>Cả sản phẩm có đáp ứng các yêu cầu đã đặc tả không?</td></tr>
    <tr><td><b>4. Acceptance</b></td><td>Hệ thống đối chiếu nhu cầu nghiệp vụ thật</td><td><b>Người dùng cuối / Khách hàng</b></td><td>Nó có được chấp nhận bởi những người sẽ dùng và trả tiền không?</td></tr>
  </tbody>
</table>

<h3>Các mức ánh xạ lên mô hình V thế nào</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Acceptance testing</b> thẩm định tài liệu <em>yêu cầu</em>.</div>
  <div class="lz-layer"><b>System testing</b> thẩm định <em>đặc tả hệ thống</em>.</div>
  <div class="lz-layer"><b>Integration testing</b> thẩm định <em>thiết kế kiến trúc</em>.</div>
  <div class="lz-layer"><b>Unit testing</b> thẩm định <em>thiết kế chi tiết/module</em>.</div>
</div>
<div class="note-ct">Mỗi mức kiểm tra tài liệu được tạo ra ở cùng độ cao trên nhánh trái của chữ V. Chính tính đối xứng đó là toàn bộ ý nghĩa của mô hình V, và nêu ra được điều này sẽ ăn điểm ở những câu yêu cầu liên hệ kiểm thử với vòng đời.</div>

<h3>Chiến lược tích hợp (câu hỏi phụ hay gặp)</h3>
<table>
  <thead><tr><th>Chiến lược</th><th>Cách làm</th><th>Cần gì</th></tr></thead>
  <tbody>
    <tr><td>Big Bang</td><td>Ghép tất cả cùng lúc rồi mới test</td><td>Không cần gì thêm — nhưng cực khó khoanh vùng lỗi</td></tr>
    <tr><td>Top-down</td><td>Bắt đầu từ module trên cùng, đi xuống dần</td><td><b>Stub</b> để giả lập các module dưới chưa viết</td></tr>
    <tr><td>Bottom-up</td><td>Bắt đầu từ module thấp nhất, đi lên dần</td><td><b>Driver</b> để gọi module đang được test</td></tr>
    <tr><td>Sandwich / lai</td><td>Cả hai hướng gặp nhau ở giữa</td><td>Cả stub lẫn driver</td></tr>
  </tbody>
</table>
<div class="out"><b>Stub vs driver — chỗ sinh viên hay lẫn:</b><br>
<b>Stub</b> đóng thế cho module mà module đang test <em>gọi tới</em> (nó nằm <em>dưới</em> trong cây phân cấp) → dùng trong top-down.<br>
<b>Driver</b> đóng thế cho module <em>gọi tới</em> module đang test (nó nằm <em>trên</em>) → dùng trong bottom-up.</div>

<div class="pitfall"><b>Lỗi PE phổ biến nhất ở câu này:</b> viết "Regression testing" thành mức thứ năm. <b>Regression là một LOẠI kiểm thử, không phải một MỨC.</b> Có đúng bốn mức — Unit, Integration, System, Acceptance — và regression có thể được thực hiện ở bất kỳ mức nào. Liệt kê nó như một mức là mất điểm dù phần còn lại của bài làm có đúng.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hai biến thể của kiểm thử chấp nhận đáng gọi tên:</b> <b>Alpha testing</b> diễn ra tại chỗ của bên phát triển với người dùng thật nhưng trong môi trường được kiểm soát; <b>Beta testing</b> diễn ra tại chỗ của chính khách hàng, ngoài đời thật, không có lập trình viên bên cạnh. Cả hai đều là kiểm thử chấp nhận — khác biệt chỉ ở <em>nơi diễn ra</em> và <em>mức độ kiểm soát</em>. Nhắc được sự phân biệt này trong bài thi cho thấy chiều sâu vượt ngoài slide.</div>
</div>
`,
        },
        {
          title: '8.3 — Types, techniques & change-related testing|||8.3 — Loại, kỹ thuật & kiểm thử liên quan thay đổi',
          slug: 'swe201c-loai-ky-thuat-kiem-thu',
          type: 'VIDEO',
          description: 'Ba trục độc lập (Mức/Loại/Kỹ thuật), kiểm thử phi chức năng, và bộ tứ retest–regression–smoke–sanity.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.3</span>
<h2>Three independent axes — do not mix them up</h2>
<p class="lead">The single biggest source of confusion in this topic is treating level, type and technique as one list. They are <strong>three separate dimensions</strong>, and any real test has a value on all three at once.</p>
<table>
  <thead><tr><th>Axis</th><th>Answers</th><th>Values</th></tr></thead>
  <tbody>
    <tr><td><b>Level</b></td><td>How big is the thing under test?</td><td>Unit · Integration · System · Acceptance</td></tr>
    <tr><td><b>Type</b></td><td>What quality are we checking?</td><td>Functional · Non-functional · Regression · Smoke · Sanity</td></tr>
    <tr><td><b>Technique</b></td><td>How much do we see inside?</td><td>Black-box · White-box · Grey-box</td></tr>
  </tbody>
</table>
<div class="out"><b>Example of all three at once:</b> "a white-box unit test for performance" is a legitimate description — <em>unit</em> is the level, <em>performance (non-functional)</em> is the type, <em>white-box</em> is the technique. Every test you write has all three properties.</div>

<h3>The technique axis</h3>
<table>
  <thead><tr><th>Technique</th><th>Knowledge of the code</th><th>Based on</th><th>Typically done by</th></tr></thead>
  <tbody>
    <tr><td><b>Black-box</b></td><td>None — internals invisible</td><td>Requirements &amp; specifications</td><td>Testers</td></tr>
    <tr><td><b>White-box</b></td><td>Full — sees the source</td><td>Code structure, paths, branches</td><td>Developers</td></tr>
    <tr><td><b>Grey-box</b></td><td>Partial — knows some internals</td><td>Architecture/data structures + requirements</td><td>Testers with design knowledge</td></tr>
  </tbody>
</table>
<div class="note-ct">Black-box techniques include equivalence partitioning and boundary value analysis; white-box techniques measure statement, branch and path coverage. Note that <em>coverage</em> is a white-box idea by definition — you cannot measure which lines ran without seeing the lines.</div>

<h3>Non-functional testing</h3>
<table>
  <thead><tr><th>Kind</th><th>Question it answers</th></tr></thead>
  <tbody>
    <tr><td>Performance — <b>Load</b></td><td>How does it behave under the expected number of users?</td></tr>
    <tr><td>Performance — <b>Stress</b></td><td>Where does it break when pushed beyond capacity?</td></tr>
    <tr><td>Performance — <b>Spike</b></td><td>How does it handle a sudden, sharp surge?</td></tr>
    <tr><td>Performance — <b>Endurance</b></td><td>Does it degrade over a long period (memory leaks)?</td></tr>
    <tr><td>Security</td><td>Can it resist unauthorised access and attacks?</td></tr>
    <tr><td>Usability</td><td>Can real users accomplish their tasks easily?</td></tr>
    <tr><td>Compatibility</td><td>Does it work across browsers, devices, OS versions?</td></tr>
  </tbody>
</table>

<h3>The change-related four — the classic exam distinction</h3>
<table>
  <thead><tr><th>Testing</th><th>Which cases are run</th><th>Purpose</th></tr></thead>
  <tbody>
    <tr><td><b>Retest</b> (confirmation)</td><td>The cases that previously <b>FAILED</b></td><td>Confirm the specific bug is actually fixed</td></tr>
    <tr><td><b>Regression</b></td><td>The cases that previously <b>PASSED</b></td><td>Confirm the fix did not break anything else</td></tr>
    <tr><td><b>Smoke</b></td><td>A broad, shallow sweep of major functions</td><td>Is this build stable enough to be worth testing at all?</td></tr>
    <tr><td><b>Sanity</b></td><td>A narrow, deep check of the changed area</td><td>Does the specific new change behave sensibly?</td></tr>
  </tbody>
</table>
<div class="out"><b>The two memory hooks that settle every exam question here:</b><br>
· <b>Retest = re-run the FAILED ones · Regression = re-run the PASSED ones.</b><br>
· <b>Smoke = wide but shallow · Sanity = narrow but deep.</b></div>
<div class="pitfall"><b>Traps:</b> (1) calling regression a test <em>level</em> (it is a type — see Lesson 8.2); (2) swapping smoke and sanity — remember smoke tests the <em>whole build</em> superficially as a gate, sanity tests <em>one area</em> thoroughly after a small change; (3) thinking retest and regression are the same thing — they use opposite sets of test cases and answer different questions.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Regression testing is what makes automation pay for itself.</b> The regression suite is run again after every change, forever — so it is the one set of tests where automation gives a compounding return. This is also why the pesticide paradox (Principle 5) bites hardest here: a frozen automated regression suite keeps passing while new kinds of defects walk straight past it. Mature teams periodically review and prune their regression suites for exactly this reason.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.3</span>
<h2>Ba trục độc lập — đừng trộn chúng vào nhau</h2>
<p class="lead">Nguồn gây nhầm lẫn lớn nhất ở chủ đề này là coi mức, loại và kỹ thuật như cùng một danh sách. Chúng là <strong>ba chiều riêng biệt</strong>, và bất kỳ phép kiểm thử thật nào cũng mang giá trị trên cả ba chiều cùng lúc.</p>
<table>
  <thead><tr><th>Trục</th><th>Trả lời câu hỏi</th><th>Các giá trị</th></tr></thead>
  <tbody>
    <tr><td><b>Mức (Level)</b></td><td>Thứ đang được test to cỡ nào?</td><td>Unit · Integration · System · Acceptance</td></tr>
    <tr><td><b>Loại (Type)</b></td><td>Chúng ta đang kiểm tính chất nào?</td><td>Chức năng · Phi chức năng · Regression · Smoke · Sanity</td></tr>
    <tr><td><b>Kỹ thuật (Technique)</b></td><td>Chúng ta nhìn thấy bên trong bao nhiêu?</td><td>Hộp đen · Hộp trắng · Hộp xám</td></tr>
  </tbody>
</table>
<div class="out"><b>Ví dụ cả ba cùng lúc:</b> "một unit test hộp trắng cho hiệu năng" là một mô tả hợp lệ — <em>unit</em> là mức, <em>hiệu năng (phi chức năng)</em> là loại, <em>hộp trắng</em> là kỹ thuật. Mọi test bạn viết đều mang đủ ba thuộc tính này.</div>

<h3>Trục kỹ thuật</h3>
<table>
  <thead><tr><th>Kỹ thuật</th><th>Hiểu biết về code</th><th>Dựa trên</th><th>Thường do ai làm</th></tr></thead>
  <tbody>
    <tr><td><b>Hộp đen</b></td><td>Không có — không thấy bên trong</td><td>Yêu cầu &amp; đặc tả</td><td>Tester</td></tr>
    <tr><td><b>Hộp trắng</b></td><td>Đầy đủ — nhìn thấy mã nguồn</td><td>Cấu trúc code, đường đi, nhánh</td><td>Lập trình viên</td></tr>
    <tr><td><b>Hộp xám</b></td><td>Một phần — biết một số chi tiết bên trong</td><td>Kiến trúc/cấu trúc dữ liệu + yêu cầu</td><td>Tester có hiểu biết thiết kế</td></tr>
  </tbody>
</table>
<div class="note-ct">Kỹ thuật hộp đen gồm phân hoạch tương đương và phân tích giá trị biên; kỹ thuật hộp trắng đo độ phủ câu lệnh, nhánh và đường đi. Lưu ý <em>độ phủ</em> theo định nghĩa là khái niệm hộp trắng — bạn không thể đo dòng nào đã chạy nếu không nhìn thấy các dòng đó.</div>

<h3>Kiểm thử phi chức năng</h3>
<table>
  <thead><tr><th>Dạng</th><th>Trả lời câu hỏi</th></tr></thead>
  <tbody>
    <tr><td>Hiệu năng — <b>Load</b></td><td>Nó chạy thế nào với số người dùng dự kiến?</td></tr>
    <tr><td>Hiệu năng — <b>Stress</b></td><td>Nó gãy ở đâu khi bị đẩy vượt quá sức chịu?</td></tr>
    <tr><td>Hiệu năng — <b>Spike</b></td><td>Nó xử lý ra sao khi có cú tăng vọt đột ngột?</td></tr>
    <tr><td>Hiệu năng — <b>Endurance</b></td><td>Nó có suy giảm sau thời gian dài không (rò rỉ bộ nhớ)?</td></tr>
    <tr><td>Bảo mật</td><td>Nó có chống được truy cập trái phép và tấn công không?</td></tr>
    <tr><td>Khả dụng (Usability)</td><td>Người dùng thật có hoàn thành công việc dễ dàng không?</td></tr>
    <tr><td>Tương thích</td><td>Nó chạy được trên các trình duyệt, thiết bị, phiên bản OS không?</td></tr>
  </tbody>
</table>

<h3>Bộ tứ liên quan thay đổi — phân biệt kinh điển trong đề thi</h3>
<table>
  <thead><tr><th>Kiểm thử</th><th>Chạy lại những case nào</th><th>Mục đích</th></tr></thead>
  <tbody>
    <tr><td><b>Retest</b> (xác nhận)</td><td>Những case trước đó <b>ĐÃ TRƯỢT</b></td><td>Xác nhận đúng lỗi đó đã thực sự được sửa</td></tr>
    <tr><td><b>Regression</b></td><td>Những case trước đó <b>ĐÃ ĐẠT</b></td><td>Xác nhận bản sửa không phá hỏng chỗ khác</td></tr>
    <tr><td><b>Smoke</b></td><td>Quét rộng và nông qua các chức năng chính</td><td>Bản build này có đủ ổn định để đáng đem đi test không?</td></tr>
    <tr><td><b>Sanity</b></td><td>Kiểm hẹp và sâu vào vùng vừa thay đổi</td><td>Thay đổi mới cụ thể đó có hoạt động hợp lý không?</td></tr>
  </tbody>
</table>
<div class="out"><b>Hai mẹo nhớ giải quyết mọi câu hỏi thi ở phần này:</b><br>
· <b>Retest = chạy lại những case TRƯỢT · Regression = chạy lại những case ĐẠT.</b><br>
· <b>Smoke = rộng mà nông · Sanity = hẹp mà sâu.</b></div>
<div class="pitfall"><b>Các bẫy:</b> (1) gọi regression là một <em>mức</em> kiểm thử (nó là loại — xem bài 8.2); (2) đảo lộn smoke và sanity — hãy nhớ smoke kiểm <em>toàn bộ bản build</em> một cách hời hợt như một cái cổng chặn, còn sanity kiểm <em>một vùng</em> thật kỹ sau một thay đổi nhỏ; (3) tưởng retest và regression là một — chúng dùng hai tập test case ngược nhau và trả lời hai câu hỏi khác nhau.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Regression testing chính là thứ khiến tự động hóa sinh lời.</b> Bộ regression được chạy lại sau mọi thay đổi, mãi mãi — nên đó là tập test duy nhất mà tự động hóa cho lợi ích cộng dồn. Đây cũng là lý do nghịch lý thuốc trừ sâu (Nguyên tắc 5) cắn đau nhất ở đây: một bộ regression tự động bị đóng băng sẽ cứ đạt đều đều trong khi các loại lỗi mới đi thẳng qua nó. Các đội trưởng thành định kỳ rà soát và tỉa bớt bộ regression của mình chính vì lý do đó.</div>
</div>
`,
        },
        {
          title: 'Quiz 2 — Software testing|||Quiz 2 — Kiểm thử phần mềm',
          slug: 'swe201c-quiz-kiem-thu',
          type: 'QUIZ',
          description: 'Kiểm tra 7 nguyên tắc, V&V, 4 mức + trách nhiệm, ba trục phân loại, và bộ tứ retest/regression/smoke/sanity.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'Testing can prove…|||Kiểm thử có thể chứng minh…', options: ['that software has no defects|||phần mềm không có lỗi nào', 'the presence of defects, never their absence|||sự tồn tại của lỗi, không bao giờ chứng minh được không có lỗi', 'the software is correct|||phần mềm là đúng đắn', 'requirements are complete|||yêu cầu đã đầy đủ'], correctIndex: 1, points: 1 },
              { question: '"Are we building the product right?" is…|||"Chúng ta có đang xây sản phẩm đúng cách không?" là…', options: ['Validation', 'Verification', 'Acceptance testing', 'Regression'], correctIndex: 1, points: 1 },
              { question: 'Unit testing is normally performed by…|||Kiểm thử đơn vị thường do ai thực hiện…', options: ['End users|||Người dùng cuối', 'QA team|||Đội QA', 'Developers|||Lập trình viên', 'The customer|||Khách hàng'], correctIndex: 2, points: 1 },
              { question: 'Acceptance testing is performed by…|||Kiểm thử chấp nhận do ai thực hiện…', options: ['Developers|||Lập trình viên', 'End users / customer|||Người dùng cuối / khách hàng', 'Automated tools only|||Chỉ công cụ tự động', 'The Scrum Master'], correctIndex: 1, points: 1 },
              { question: 'How many test LEVELS are there?|||Có bao nhiêu MỨC kiểm thử?', options: ['3', '4', '5 (including regression)|||5 (tính cả regression)', '7'], correctIndex: 1, points: 1 },
              { question: 'Regression testing re-runs cases that previously…|||Regression testing chạy lại những case trước đó…', options: ['failed|||đã trượt', 'passed|||đã đạt', 'were skipped|||bị bỏ qua', 'were automated|||đã tự động hóa'], correctIndex: 1, points: 1 },
              { question: 'Retest (confirmation testing) re-runs cases that previously…|||Retest (kiểm thử xác nhận) chạy lại những case trước đó…', options: ['passed|||đã đạt', 'failed|||đã trượt', 'timed out|||hết giờ', 'were manual|||làm thủ công'], correctIndex: 1, points: 1 },
              { question: 'Smoke testing is best described as…|||Smoke testing được mô tả đúng nhất là…', options: ['narrow and deep|||hẹp và sâu', 'wide and shallow|||rộng và nông', 'only automated|||chỉ tự động', 'performed by users|||do người dùng thực hiện'], correctIndex: 1, points: 1 },
              { question: 'Testing based only on requirements, with no view of the code, is…|||Kiểm thử chỉ dựa trên yêu cầu, không nhìn thấy code, là…', options: ['White-box|||Hộp trắng', 'Black-box|||Hộp đen', 'Grey-box|||Hộp xám', 'Unit testing'], correctIndex: 1, points: 1 },
              { question: 'In top-down integration, the placeholders for lower modules are called…|||Trong tích hợp top-down, thành phần đóng thế cho module cấp dưới gọi là…', options: ['Drivers', 'Stubs', 'Mocks levels|||Mức mock', 'Harnesses'], correctIndex: 1, points: 1 },
              { question: 'Testing for memory leaks over a long run is…|||Kiểm thử rò rỉ bộ nhớ khi chạy dài là…', options: ['Spike testing', 'Endurance testing', 'Smoke testing', 'Sanity testing'], correctIndex: 1, points: 1 },
              { question: 'The pesticide paradox says…|||Nghịch lý thuốc trừ sâu nói rằng…', options: ['bugs cluster in few modules|||lỗi tụ cụm ở vài module', 'repeating the same tests stops finding new bugs|||lặp lại cùng bộ test sẽ thôi tìm ra lỗi mới', 'exhaustive testing is possible|||có thể kiểm thử vét cạn', 'early testing is cheaper|||kiểm thử sớm thì rẻ hơn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ CHƯƠNG 9 — YÊU CẦU & USER STORY ══════════════════ */
    {
      title: 'Chapter 9 — Requirements & user stories|||Chương 9 — Yêu cầu & User Story',
      description: 'Yêu cầu chức năng vs phi chức năng, tiêu chí SMART, viết User Story theo INVEST, và Story Mapping.',
      lessons: [
        {
          title: '9.1 — Functional vs non-functional requirements & SMART|||9.1 — Yêu cầu chức năng vs phi chức năng & SMART',
          slug: 'swe201c-yeu-cau-fr-nfr',
          type: 'VIDEO',
          description: 'Hệ thống phải LÀM GÌ (FR) vs phải làm NHƯ THẾ NÀO (NFR), cách viết "The system shall…", và bộ tiêu chí SMART.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Two kinds of requirement</h2>
<p class="lead">Every requirement answers one of two questions. Confusing them costs marks in the PE, because the exam explicitly asks you to separate the two lists.</p>
<table>
  <thead><tr><th></th><th>Functional (FR)</th><th>Non-functional (NFR)</th></tr></thead>
  <tbody>
    <tr><td>Answers</td><td><b>WHAT</b> the system must do</td><td><b>HOW WELL</b> it must do it</td></tr>
    <tr><td>Describes</td><td>Behaviour, features, functions</td><td>Qualities, constraints, attributes</td></tr>
    <tr><td>Language clue</td><td>An <b>action verb</b>: create, search, calculate, send, export</td><td>A <b>quality word</b> + a number: fast, secure, available, usable</td></tr>
    <tr><td>Example</td><td>"The system shall allow a user to reset their password by email."</td><td>"The system shall respond to any search within 2 seconds under 500 concurrent users."</td></tr>
    <tr><td>If not met</td><td>The system is incomplete — a feature is missing</td><td>The system works but is unusable, unsafe or unacceptable</td></tr>
  </tbody>
</table>

<h3>Typical categories</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Functional:</b> user management (register, login, roles) · business processing (orders, bookings, calculations) · data management (CRUD, import/export) · user interaction (search, filter, notify) · reporting (statistics, exports).</div>
  <div class="lz-layer"><b>Non-functional:</b> performance (response time, throughput) · security (authentication, encryption, audit) · reliability (uptime, recovery) · usability (learnability, accessibility) · scalability (growth headroom) · maintainability (modularity, documentation).</div>
</div>

<h3>How to write them — the "shall" form</h3>
<div class="out">Standard phrasing: <b>"The system shall &lt;do something&gt; &lt;under what condition&gt; &lt;to what measurable degree&gt;."</b><br><br>
✗ Weak: "The system should be fast."<br>
✓ Strong: "The system shall load the product list within 2 seconds for up to 1,000 concurrent users."<br><br>
✗ Weak: "The system must be secure."<br>
✓ Strong: "The system shall lock an account after 5 consecutive failed login attempts and notify the user by email."</div>
<div class="note-ct">In the PE you are usually asked to cite the source: after each requirement, reference the line in the given scenario it came from. A requirement invented from nowhere — however sensible — cannot earn full marks because it is not traceable to the customer.</div>

<h3>SMART — the test every requirement must pass</h3>
<table>
  <thead><tr><th>Letter</th><th>Means</th><th>Failing example → fixed</th></tr></thead>
  <tbody>
    <tr><td><b>S</b>pecific</td><td>Unambiguous, one interpretation</td><td>"good performance" → "search returns in &lt; 2s"</td></tr>
    <tr><td><b>M</b>easurable</td><td>You can objectively verify it</td><td>"user-friendly" → "a new user completes checkout in ≤ 3 minutes"</td></tr>
    <tr><td><b>A</b>chievable</td><td>Technically and financially possible</td><td>"100% uptime" → "99.9% uptime per month"</td></tr>
    <tr><td><b>R</b>elevant</td><td>Actually contributes to the business goal</td><td>drop gold-plating that no user asked for</td></tr>
    <tr><td><b>T</b>ime-bound</td><td>Has a deadline or timeframe</td><td>"eventually" → "by the end of Sprint 4"</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>The classic PE error</b> is writing an NFR with no number: "The system shall be secure/fast/reliable" is not a requirement, it is a wish. Every non-functional requirement needs a <em>metric and a threshold</em> — otherwise nobody can ever test whether it was met, which violates both SMART's "Measurable" and testing principle 1 from Chapter 8.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>NFRs are what actually shape the architecture.</b> Functional requirements can usually be satisfied by many different designs, but a demand for "99.99% availability" or "sub-100ms response globally" immediately forces choices: redundancy, caching, geographic distribution, a different database. This is why senior engineers read the NFRs first — the functional list tells you what to build, but the non-functional list tells you what it will cost and how it must be structured.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Hai loại yêu cầu</h2>
<p class="lead">Mọi yêu cầu đều trả lời một trong hai câu hỏi. Nhầm lẫn chúng là mất điểm trong bài PE, vì đề thi yêu cầu tách rõ hai danh sách.</p>
<table>
  <thead><tr><th></th><th>Chức năng (FR)</th><th>Phi chức năng (NFR)</th></tr></thead>
  <tbody>
    <tr><td>Trả lời</td><td>Hệ thống phải <b>LÀM GÌ</b></td><td>Phải làm <b>TỐT ĐẾN MỨC NÀO</b></td></tr>
    <tr><td>Mô tả</td><td>Hành vi, tính năng, chức năng</td><td>Tính chất, ràng buộc, thuộc tính</td></tr>
    <tr><td>Dấu hiệu ngôn ngữ</td><td>Một <b>động từ hành động</b>: tạo, tìm kiếm, tính toán, gửi, xuất</td><td>Một <b>từ chỉ tính chất</b> + con số: nhanh, an toàn, sẵn sàng, dễ dùng</td></tr>
    <tr><td>Ví dụ</td><td>"Hệ thống phải cho phép người dùng đặt lại mật khẩu qua email."</td><td>"Hệ thống phải phản hồi mọi tìm kiếm trong vòng 2 giây với 500 người dùng đồng thời."</td></tr>
    <tr><td>Nếu không đạt</td><td>Hệ thống thiếu sót — mất một tính năng</td><td>Hệ thống vẫn chạy nhưng không dùng được, không an toàn hoặc không chấp nhận được</td></tr>
  </tbody>
</table>

<h3>Các nhóm điển hình</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Chức năng:</b> quản lý người dùng (đăng ký, đăng nhập, phân quyền) · xử lý nghiệp vụ (đơn hàng, đặt chỗ, tính toán) · quản lý dữ liệu (CRUD, nhập/xuất) · tương tác người dùng (tìm kiếm, lọc, thông báo) · báo cáo (thống kê, xuất file).</div>
  <div class="lz-layer"><b>Phi chức năng:</b> hiệu năng (thời gian phản hồi, thông lượng) · bảo mật (xác thực, mã hóa, nhật ký) · độ tin cậy (thời gian hoạt động, phục hồi) · khả dụng (dễ học, tiếp cận được) · khả năng mở rộng (dư địa tăng trưởng) · khả năng bảo trì (module hóa, tài liệu).</div>
</div>

<h3>Cách viết — dạng "phải/shall"</h3>
<div class="out">Cách diễn đạt chuẩn: <b>"Hệ thống phải &lt;làm gì đó&gt; &lt;trong điều kiện nào&gt; &lt;tới mức đo được là bao nhiêu&gt;."</b><br><br>
✗ Yếu: "Hệ thống nên chạy nhanh."<br>
✓ Mạnh: "Hệ thống phải tải danh sách sản phẩm trong vòng 2 giây với tối đa 1.000 người dùng đồng thời."<br><br>
✗ Yếu: "Hệ thống phải an toàn."<br>
✓ Mạnh: "Hệ thống phải khóa tài khoản sau 5 lần đăng nhập sai liên tiếp và thông báo cho người dùng qua email."</div>
<div class="note-ct">Trong bài PE bạn thường được yêu cầu trích dẫn nguồn: sau mỗi yêu cầu, hãy dẫn chiếu tới dòng nào trong đề bài đã sinh ra nó. Một yêu cầu tự nghĩ ra từ hư không — dù hợp lý tới đâu — cũng không được điểm tối đa vì nó không truy vết được về phía khách hàng.</div>

<h3>SMART — bài kiểm tra mọi yêu cầu phải vượt qua</h3>
<table>
  <thead><tr><th>Chữ</th><th>Nghĩa</th><th>Ví dụ trượt → đã sửa</th></tr></thead>
  <tbody>
    <tr><td><b>S</b>pecific (Cụ thể)</td><td>Không mơ hồ, chỉ một cách hiểu</td><td>"hiệu năng tốt" → "tìm kiếm trả về trong &lt; 2 giây"</td></tr>
    <tr><td><b>M</b>easurable (Đo được)</td><td>Kiểm chứng được một cách khách quan</td><td>"thân thiện người dùng" → "người dùng mới hoàn tất thanh toán trong ≤ 3 phút"</td></tr>
    <tr><td><b>A</b>chievable (Khả thi)</td><td>Khả thi về kỹ thuật và tài chính</td><td>"hoạt động 100% thời gian" → "99.9% thời gian mỗi tháng"</td></tr>
    <tr><td><b>R</b>elevant (Liên quan)</td><td>Thực sự đóng góp cho mục tiêu kinh doanh</td><td>bỏ những thứ mạ vàng mà không người dùng nào yêu cầu</td></tr>
    <tr><td><b>T</b>ime-bound (Có hạn định)</td><td>Có thời hạn hoặc khung thời gian</td><td>"rồi sẽ làm" → "xong trước cuối Sprint 4"</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Lỗi PE kinh điển</b> là viết một NFR không có con số: "Hệ thống phải an toàn/nhanh/đáng tin cậy" không phải yêu cầu, đó là một điều ước. Mọi yêu cầu phi chức năng đều cần <em>một chỉ số và một ngưỡng</em> — nếu không thì không ai kiểm chứng được nó đã đạt hay chưa, vi phạm cả chữ "Đo được" của SMART lẫn nguyên tắc kiểm thử số 1 ở Chương 8.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Chính NFR mới là thứ định hình kiến trúc.</b> Yêu cầu chức năng thường có thể được thỏa mãn bằng nhiều thiết kế khác nhau, nhưng một đòi hỏi "sẵn sàng 99.99%" hay "phản hồi dưới 100ms trên toàn cầu" lập tức ép buộc các lựa chọn: dự phòng, bộ đệm, phân tán địa lý, một cơ sở dữ liệu khác. Đó là lý do kỹ sư kỳ cựu đọc phần NFR trước — danh sách chức năng cho biết phải xây gì, còn danh sách phi chức năng cho biết nó tốn kém ra sao và phải được cấu trúc thế nào.</div>
</div>
`,
        },
        {
          title: '9.2 — User stories & the INVEST criteria|||9.2 — User Story & bộ tiêu chí INVEST',
          slug: 'swe201c-user-story-invest',
          type: 'VIDEO',
          description: 'Khuôn "As a … I want … So that …", sáu tiêu chí INVEST, tiêu chí chấp nhận, và các lỗi viết story hay bị trừ điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Writing a user story</h2>
<p class="lead">A user story is not a mini-specification. It is a <strong>promise to have a conversation</strong>, written from the user's point of view — and it has one fixed shape the exam expects exactly.</p>
<div class="out"><b>The template:</b><br>
<b>As a</b> [role / type of user]<br>
<b>I want to</b> [action or capability]<br>
<b>So that</b> [benefit to that user]<br><br>
<b>Example:</b> As a <em>registered customer</em>, I want to <em>save my delivery address</em>, so that <em>I do not have to retype it on every order</em>.</div>

<h3>The three parts, and what each must contain</h3>
<table>
  <thead><tr><th>Part</th><th>Must be</th><th>Common mistake</th></tr></thead>
  <tbody>
    <tr><td><b>As a</b></td><td>A specific role, not "user" in general</td><td>"As a user" — too vague to prioritise</td></tr>
    <tr><td><b>I want to</b></td><td>One concrete, testable capability</td><td>Vague adjectives with no number: "fast", "easy", "nice"</td></tr>
    <tr><td><b>So that</b></td><td>The benefit <em>to the user</em></td><td>Stating a system benefit: "so that the database is updated" — that is not a user benefit</td></tr>
  </tbody>
</table>

<h3>INVEST — six criteria for a good story</h3>
<table>
  <thead><tr><th>Letter</th><th>Criterion</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><b>I</b></td><td>Independent</td><td>Can be built and delivered without depending on another story</td></tr>
    <tr><td><b>N</b></td><td>Negotiable</td><td>Not a rigid contract — details are discussed with the customer</td></tr>
    <tr><td><b>V</b></td><td>Valuable</td><td>Delivers visible value to a user or customer</td></tr>
    <tr><td><b>E</b></td><td>Estimable</td><td>The team can size it; if not, it needs more clarity or a spike</td></tr>
    <tr><td><b>S</b></td><td>Small</td><td>Fits comfortably inside one sprint — ideally a few days</td></tr>
    <tr><td><b>T</b></td><td>Testable</td><td>You can state clear acceptance criteria that pass or fail</td></tr>
  </tbody>
</table>

<h3>Acceptance criteria — how "done" is decided</h3>
<div class="out">Each story carries a short list of pass/fail conditions. A common format is <b>Given–When–Then</b>:<br><br>
<b>Given</b> I am logged in and have a saved address,<br>
<b>When</b> I go to checkout,<br>
<b>Then</b> the saved address is pre-filled and editable.</div>
<div class="note-ct">Acceptance criteria are what make the "T" in INVEST real. They also feed directly into Chapter 8: acceptance criteria become acceptance test cases, which is why the two topics are examined together.</div>

<h3>Ví dụ có lời giải · Fixing a bad story</h3>
<div class="out"><b>✗ Bad:</b> "As a user, I want the system to be fast, so that the database performs well."<br>
Three faults at once: role is generic ("user"), the want is a vague non-functional wish with no number ("fast"), and the benefit is for the <em>system</em>, not a person.<br><br>
<b>✓ Rewritten as a proper story:</b> "As a <em>shop customer</em>, I want to <em>see search results within 2 seconds</em>, so that <em>I can find a product without losing patience</em>."<br>
<b>Better still:</b> keep the story purely functional and move the 2-second threshold to an acceptance criterion or an NFR — stories describe behaviour, NFRs describe quality levels.</div>
<div class="pitfall"><b>Two errors that lose PE marks reliably:</b> (1) a "So that" that states a technical/system outcome instead of a human benefit; (2) a story so large it cannot fit in a sprint, violating <b>S</b> in INVEST — split it by workflow step, by data type, or by happy-path versus edge-case rather than by technical layer (never "front-end story" + "back-end story", because neither delivers value alone and both break <b>I</b> and <b>V</b>).</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The "3 C's" behind the card.</b> Ron Jeffries described a story as Card (the short written form), Conversation (the discussion it triggers with the customer), and Confirmation (the acceptance criteria that settle it). This is why stories are deliberately short — the card is not meant to contain the whole requirement; it exists to make sure the conversation happens. Teams that treat the card as a complete spec get all the brevity of stories and none of the benefit.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Viết một User Story</h2>
<p class="lead">User story không phải một bản đặc tả thu nhỏ. Nó là <strong>một lời hứa sẽ có cuộc trò chuyện</strong>, viết từ góc nhìn người dùng — và nó có đúng một khuôn cố định mà đề thi mong đợi.</p>
<div class="out"><b>Khuôn mẫu:</b><br>
<b>Là một</b> [vai trò / loại người dùng]<br>
<b>Tôi muốn</b> [hành động hoặc khả năng]<br>
<b>Để mà</b> [lợi ích cho chính người dùng đó]<br><br>
<b>Ví dụ:</b> Là một <em>khách hàng đã đăng ký</em>, tôi muốn <em>lưu địa chỉ giao hàng</em>, để mà <em>tôi không phải gõ lại nó ở mỗi đơn hàng</em>.</div>

<h3>Ba phần, và mỗi phần phải chứa gì</h3>
<table>
  <thead><tr><th>Phần</th><th>Phải là</th><th>Lỗi thường gặp</th></tr></thead>
  <tbody>
    <tr><td><b>Là một</b></td><td>Một vai trò cụ thể, không phải "người dùng" chung chung</td><td>"Là một người dùng" — quá mơ hồ để xếp ưu tiên</td></tr>
    <tr><td><b>Tôi muốn</b></td><td>Một khả năng cụ thể, kiểm thử được</td><td>Tính từ mơ hồ không con số: "nhanh", "dễ", "đẹp"</td></tr>
    <tr><td><b>Để mà</b></td><td>Lợi ích <em>cho người dùng</em></td><td>Nêu lợi ích của hệ thống: "để mà cơ sở dữ liệu được cập nhật" — đó không phải lợi ích người dùng</td></tr>
  </tbody>
</table>

<h3>INVEST — sáu tiêu chí của một story tốt</h3>
<table>
  <thead><tr><th>Chữ</th><th>Tiêu chí</th><th>Nghĩa là</th></tr></thead>
  <tbody>
    <tr><td><b>I</b></td><td>Independent (Độc lập)</td><td>Xây và bàn giao được mà không phụ thuộc story khác</td></tr>
    <tr><td><b>N</b></td><td>Negotiable (Thương lượng được)</td><td>Không phải hợp đồng cứng — chi tiết được bàn với khách hàng</td></tr>
    <tr><td><b>V</b></td><td>Valuable (Có giá trị)</td><td>Mang lại giá trị nhìn thấy được cho người dùng hoặc khách hàng</td></tr>
    <tr><td><b>E</b></td><td>Estimable (Ước lượng được)</td><td>Đội có thể ước lượng khối lượng; nếu không thì cần làm rõ thêm</td></tr>
    <tr><td><b>S</b></td><td>Small (Nhỏ)</td><td>Nằm gọn trong một sprint — lý tưởng là vài ngày</td></tr>
    <tr><td><b>T</b></td><td>Testable (Kiểm thử được)</td><td>Nêu được tiêu chí chấp nhận rõ ràng đạt/không đạt</td></tr>
  </tbody>
</table>

<h3>Tiêu chí chấp nhận — cách quyết định thế nào là "xong"</h3>
<div class="out">Mỗi story kèm một danh sách ngắn các điều kiện đạt/không đạt. Một khuôn phổ biến là <b>Given–When–Then</b>:<br><br>
<b>Given</b> (Cho rằng) tôi đã đăng nhập và có một địa chỉ đã lưu,<br>
<b>When</b> (Khi) tôi vào trang thanh toán,<br>
<b>Then</b> (Thì) địa chỉ đã lưu được điền sẵn và có thể sửa được.</div>
<div class="note-ct">Tiêu chí chấp nhận chính là thứ làm cho chữ "T" trong INVEST trở nên có thật. Chúng cũng nối thẳng sang Chương 8: tiêu chí chấp nhận trở thành các test case kiểm thử chấp nhận, và đó là lý do hai chủ đề này hay được hỏi cùng nhau.</div>

<h3>Ví dụ có lời giải · Sửa một story tồi</h3>
<div class="out"><b>✗ Tồi:</b> "Là một người dùng, tôi muốn hệ thống chạy nhanh, để mà cơ sở dữ liệu hoạt động tốt."<br>
Ba lỗi cùng lúc: vai trò chung chung ("người dùng"), điều muốn là một ước nguyện phi chức năng mơ hồ không con số ("nhanh"), và lợi ích thuộc về <em>hệ thống</em> chứ không phải con người.<br><br>
<b>✓ Viết lại thành story đúng:</b> "Là một <em>khách mua hàng</em>, tôi muốn <em>thấy kết quả tìm kiếm trong vòng 2 giây</em>, để mà <em>tôi tìm được sản phẩm mà không mất kiên nhẫn</em>."<br>
<b>Còn tốt hơn nữa:</b> giữ story thuần chức năng và chuyển ngưỡng 2 giây sang tiêu chí chấp nhận hoặc một NFR — story mô tả hành vi, còn NFR mô tả mức chất lượng.</div>
<div class="pitfall"><b>Hai lỗi chắc chắn mất điểm PE:</b> (1) phần "Để mà" nêu một kết quả kỹ thuật/hệ thống thay vì lợi ích của con người; (2) story to tới mức không nằm vừa một sprint, vi phạm chữ <b>S</b> của INVEST — hãy chia nó theo bước quy trình, theo loại dữ liệu, hoặc theo luồng thuận lợi vs trường hợp biên, chứ đừng chia theo tầng kỹ thuật (không bao giờ tách "story front-end" + "story back-end", vì không cái nào tự mang lại giá trị và cả hai đều phá vỡ <b>I</b> lẫn <b>V</b>).</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>"Ba chữ C" đằng sau tấm thẻ.</b> Ron Jeffries mô tả một story gồm Card (dạng viết ngắn), Conversation (cuộc trò chuyện nó kích hoạt với khách hàng), và Confirmation (tiêu chí chấp nhận để chốt lại). Đó là lý do story được cố tình viết ngắn — tấm thẻ không nhằm chứa toàn bộ yêu cầu; nó tồn tại để đảm bảo cuộc trò chuyện sẽ diễn ra. Đội nào coi tấm thẻ là bản đặc tả đầy đủ thì nhận hết cái ngắn gọn của story mà không nhận được lợi ích nào.</div>
</div>
`,
        },
        {
          title: '9.3 — Story mapping|||9.3 — Story Mapping',
          slug: 'swe201c-story-mapping',
          type: 'VIDEO',
          description: 'Sắp xếp story thành Activities → User tasks → Releases, cách đánh số 3 cấp, và cách cắt release đầu tiên.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Turning a pile of stories into a plan</h2>
<p class="lead">A flat backlog tells you what to build but not in what order or how the pieces fit a user's journey. A <strong>story map</strong> arranges stories in two dimensions: the user's workflow across the top, and priority downwards.</p>

<h3>The three layers</h3>
<table>
  <thead><tr><th>Layer</th><th>What it is</th><th>Example (online shop)</th></tr></thead>
  <tbody>
    <tr><td><b>1. Activities</b> (backbone)</td><td>The big steps of the user's journey, left to right in time order</td><td>1. Browse · 2. Order · 3. Pay · 4. Track</td></tr>
    <tr><td><b>2. User tasks</b></td><td>The concrete things a user does inside each activity</td><td>1.1 Search products · 1.2 Filter by category · 1.3 View details</td></tr>
    <tr><td><b>3. User stories</b></td><td>The implementable slices under each task</td><td>1.1.1 Search by keyword · 1.1.2 See suggestions while typing</td></tr>
  </tbody>
</table>
<div class="note-ct"><b>The numbering matters in the PE.</b> Use three levels consistently: activity = <b>1</b>, task = <b>1.1</b>, story = <b>1.1.1</b>. Markers are lost when the numbering is inconsistent or when a "story" sits at the task level without being broken down.</div>

<h3>Cutting releases — the horizontal slices</h3>
<div class="out">Once the map is laid out, draw horizontal lines to define releases:<br><br>
<b>Release 1 (walking skeleton):</b> take the <em>minimum</em> story from every activity, so the user can complete the whole journey end to end, even crudely.<br>
<b>Release 2:</b> add depth — the useful extras within each activity.<br>
<b>Release 3:</b> the nice-to-haves.<br><br>
The key insight: a release must slice <b>across all activities</b>, not complete one activity perfectly. A shop where you can browse brilliantly but cannot pay is worth nothing.</div>
<div class="pitfall"><b>The most common story-mapping mistake</b> is building vertically — finishing everything in "Browse" before starting "Pay". That produces a system that cannot be used at all until the very end, which defeats the point of incremental delivery (Chapter 2) and leaves no working software to show the customer.</div>

<h3>Ví dụ có lời giải · A small map with releases</h3>
<div class="out"><b>Scenario:</b> a library borrowing system.<br><br>
<b>A. Activities and user tasks</b><br>
1. Find a book<br>
 1.1 Search the catalogue<br>
 1.2 Check availability<br>
2. Borrow<br>
 2.1 Reserve a copy<br>
 2.2 Check out<br>
3. Return<br>
 3.1 Return a copy<br>
 3.2 Pay a late fee<br><br>
<b>B. Releases</b><br>
<b>Release 1 — core loop</b><br>
 1.1.1 As a reader, I want to search by title, so that I can find a book quickly.<br>
 1.2.1 As a reader, I want to see whether a copy is available, so that I do not travel in vain.<br>
 2.2.1 As a reader, I want to check out a book with my card, so that I can take it home.<br>
 3.1.1 As a reader, I want to return a book at the desk, so that my account is cleared.<br>
<b>Release 2 — convenience</b><br>
 1.1.2 As a reader, I want to search by author and ISBN, so that I can find books when I forget the title.<br>
 2.1.1 As a reader, I want to reserve a borrowed copy, so that I get it when it comes back.<br>
 3.2.1 As a reader, I want to pay a late fee online, so that I do not have to queue.<br><br>
Notice Release 1 touches <em>every</em> activity — the reader can complete the entire journey, which is what makes it shippable.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Story mapping was invented to fix the flat backlog.</b> Jeff Patton observed that a one-dimensional prioritised list destroys context: you can see the next item but not how it fits the user's experience, so teams optimise individual features while the overall journey stays broken. The map restores the missing dimension — narrative order — which is why the top row is called the <em>backbone</em> and why writing it forces you to describe the product as a story about a person rather than a list of functions.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Biến một đống story thành một kế hoạch</h2>
<p class="lead">Một backlog phẳng cho biết phải xây gì nhưng không cho biết thứ tự nào và các mảnh ghép vào hành trình người dùng ra sao. <strong>Story map</strong> sắp xếp story theo hai chiều: luồng công việc của người dùng chạy ngang phía trên, và độ ưu tiên đi xuống dưới.</p>

<h3>Ba tầng</h3>
<table>
  <thead><tr><th>Tầng</th><th>Là gì</th><th>Ví dụ (cửa hàng online)</th></tr></thead>
  <tbody>
    <tr><td><b>1. Activities</b> (xương sống)</td><td>Các bước lớn trong hành trình người dùng, trái sang phải theo thời gian</td><td>1. Duyệt hàng · 2. Đặt hàng · 3. Thanh toán · 4. Theo dõi</td></tr>
    <tr><td><b>2. User tasks</b></td><td>Những việc cụ thể người dùng làm bên trong mỗi activity</td><td>1.1 Tìm sản phẩm · 1.2 Lọc theo danh mục · 1.3 Xem chi tiết</td></tr>
    <tr><td><b>3. User stories</b></td><td>Các lát cắt cài đặt được dưới mỗi task</td><td>1.1.1 Tìm theo từ khóa · 1.1.2 Xem gợi ý khi đang gõ</td></tr>
  </tbody>
</table>
<div class="note-ct"><b>Cách đánh số rất quan trọng trong bài PE.</b> Dùng ba cấp một cách nhất quán: activity = <b>1</b>, task = <b>1.1</b>, story = <b>1.1.1</b>. Bị trừ điểm khi đánh số không nhất quán hoặc khi một "story" nằm ở cấp task mà chưa được chia nhỏ.</div>

<h3>Cắt release — các lát cắt ngang</h3>
<div class="out">Khi bản đồ đã trải ra, hãy kẻ các đường ngang để định nghĩa release:<br><br>
<b>Release 1 (bộ xương biết đi):</b> lấy story <em>tối thiểu</em> từ MỌI activity, để người dùng đi trọn hành trình từ đầu tới cuối, dù còn thô.<br>
<b>Release 2:</b> thêm chiều sâu — những thứ hữu ích bên trong từng activity.<br>
<b>Release 3:</b> những thứ có thì tốt.<br><br>
Ý tưởng then chốt: một release phải cắt <b>ngang qua tất cả activity</b>, chứ không phải hoàn thiện trọn vẹn một activity. Một cửa hàng cho phép duyệt hàng cực đỉnh nhưng không thanh toán được thì chẳng đáng giá gì.</div>
<div class="pitfall"><b>Lỗi story mapping phổ biến nhất</b> là xây theo chiều dọc — làm xong hết mọi thứ ở "Duyệt hàng" rồi mới bắt đầu "Thanh toán". Cách đó tạo ra một hệ thống hoàn toàn không dùng được cho tới tận phút cuối, phá hỏng chính ý nghĩa của bàn giao tăng dần (Chương 2) và không có phần mềm chạy được nào để cho khách hàng xem.</div>

<h3>Ví dụ có lời giải · Một bản đồ nhỏ kèm release</h3>
<div class="out"><b>Bối cảnh:</b> hệ thống mượn sách thư viện.<br><br>
<b>A. Activities và user tasks</b><br>
1. Tìm sách<br>
 1.1 Tra cứu danh mục<br>
 1.2 Kiểm tra tình trạng còn sách<br>
2. Mượn<br>
 2.1 Đặt giữ một bản<br>
 2.2 Làm thủ tục mượn<br>
3. Trả<br>
 3.1 Trả sách<br>
 3.2 Nộp phí trễ hạn<br><br>
<b>B. Releases</b><br>
<b>Release 1 — vòng lặp cốt lõi</b><br>
 1.1.1 Là một độc giả, tôi muốn tìm theo tên sách, để mà tôi tìm được sách nhanh chóng.<br>
 1.2.1 Là một độc giả, tôi muốn biết sách còn hay hết, để mà tôi không đi thư viện vô ích.<br>
 2.2.1 Là một độc giả, tôi muốn mượn sách bằng thẻ của mình, để mà tôi mang được sách về nhà.<br>
 3.1.1 Là một độc giả, tôi muốn trả sách tại quầy, để mà tài khoản của tôi được xóa nợ.<br>
<b>Release 2 — tiện lợi</b><br>
 1.1.2 Là một độc giả, tôi muốn tìm theo tác giả và ISBN, để mà tôi vẫn tìm được sách khi quên tên.<br>
 2.1.1 Là một độc giả, tôi muốn đặt giữ cuốn đang có người mượn, để mà tôi nhận được nó khi sách quay về.<br>
 3.2.1 Là một độc giả, tôi muốn nộp phí trễ hạn online, để mà tôi không phải xếp hàng.<br><br>
Để ý Release 1 chạm vào <em>mọi</em> activity — độc giả đi được trọn hành trình, và đó chính là thứ khiến nó bàn giao được.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Story mapping ra đời để sửa chính cái backlog phẳng.</b> Jeff Patton nhận ra rằng một danh sách ưu tiên một chiều phá hủy ngữ cảnh: bạn thấy được hạng mục kế tiếp nhưng không thấy nó khớp vào trải nghiệm người dùng ra sao, nên đội tối ưu từng tính năng riêng lẻ trong khi hành trình tổng thể vẫn gãy. Bản đồ khôi phục chiều bị thiếu đó — trật tự tường thuật — và đó là lý do hàng trên cùng được gọi là <em>xương sống</em>, cũng như lý do việc viết nó buộc bạn mô tả sản phẩm như một câu chuyện về một con người thay vì một danh sách chức năng.</div>
</div>
`,
        },
        {
          title: 'Quiz 3 — Requirements & user stories|||Quiz 3 — Yêu cầu & User Story',
          slug: 'swe201c-quiz-yeu-cau',
          type: 'QUIZ',
          description: 'Kiểm tra phân biệt FR/NFR, SMART, khuôn User Story, INVEST và ba tầng Story Mapping.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: '"The system shall encrypt all passwords" is…|||"Hệ thống phải mã hóa mọi mật khẩu" là…', options: ['a functional requirement|||yêu cầu chức năng', 'a non-functional requirement (security)|||yêu cầu phi chức năng (bảo mật)', 'a user story|||một user story', 'an acceptance criterion|||một tiêu chí chấp nhận'], correctIndex: 1, points: 1 },
              { question: '"The system shall let users export reports to PDF" is…|||"Hệ thống phải cho phép người dùng xuất báo cáo ra PDF" là…', options: ['functional|||chức năng', 'non-functional|||phi chức năng', 'a constraint|||một ràng buộc', 'an NFR metric|||một chỉ số NFR'], correctIndex: 0, points: 1 },
              { question: 'The M in SMART stands for…|||Chữ M trong SMART là…', options: ['Modular', 'Measurable|||Đo được', 'Maintainable', 'Mandatory'], correctIndex: 1, points: 1 },
              { question: 'The correct user story template is…|||Khuôn user story đúng là…', options: ['As a [role], I want to [action], so that [benefit]|||Là một [vai trò], tôi muốn [hành động], để mà [lợi ích]', 'Given, When, Then', 'The system shall [action]|||Hệ thống phải [hành động]', 'Activity, Task, Story'], correctIndex: 0, points: 1 },
              { question: 'The S in INVEST means the story should be…|||Chữ S trong INVEST nghĩa là story nên…', options: ['Specific|||Cụ thể', 'Small enough for one sprint|||Nhỏ vừa một sprint', 'Secure|||An toàn', 'Scalable|||Mở rộng được'], correctIndex: 1, points: 1 },
              { question: 'A "So that" clause should state…|||Mệnh đề "Để mà" nên nêu…', options: ['a benefit to the system or database|||lợi ích cho hệ thống hoặc CSDL', 'a benefit to the user|||lợi ích cho người dùng', 'the technical implementation|||cách cài đặt kỹ thuật', 'the sprint number|||số hiệu sprint'], correctIndex: 1, points: 1 },
              { question: 'In story mapping, the top row (backbone) contains…|||Trong story mapping, hàng trên cùng (xương sống) chứa…', options: ['user stories|||các user story', 'activities in time order|||các activity theo trình tự thời gian', 'releases|||các release', 'acceptance criteria|||tiêu chí chấp nhận'], correctIndex: 1, points: 1 },
              { question: 'A first release should…|||Release đầu tiên nên…', options: ['complete one activity perfectly|||hoàn thiện trọn vẹn một activity', 'slice across all activities so the journey works end to end|||cắt ngang mọi activity để hành trình chạy được từ đầu tới cuối', 'contain every story|||chứa mọi story', 'contain only non-functional work|||chỉ chứa việc phi chức năng'], correctIndex: 1, points: 1 },
              { question: 'Correct three-level numbering in a story map is…|||Cách đánh số ba cấp đúng trong story map là…', options: ['1 → 1.1 → 1.1.1', 'A → B → C', '1 → 2 → 3', '1.1 → 1.2 → 1.3'], correctIndex: 0, points: 1 },
              { question: '"The system shall be fast" fails SMART mainly because it is not…|||"Hệ thống phải nhanh" trượt SMART chủ yếu vì nó không…', options: ['Relevant|||Liên quan', 'Measurable|||Đo được', 'Achievable|||Khả thi', 'Time-bound|||Có hạn định'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },

    /* ══════════════════ NÂNG CAO ══════════════════ */
    {
      title: 'Advanced — Beyond the syllabus|||Nâng cao — Ngoài giáo trình',
      description: 'Toàn bộ chương này là học thêm: DevOps & CI/CD, và cách chọn đúng phương pháp cho một dự án.',
      lessons: [
        {
          title: 'A.1 — DevOps, CI/CD & choosing a methodology|||A.1 — DevOps, CI/CD & chọn phương pháp',
          slug: 'swe201c-nang-cao',
          type: 'VIDEO',
          description: 'DevOps xóa ranh giới dev-ops; CI/CD tự động build/test/deploy; và khung quyết định chọn Waterfall/Agile/Lean.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced · Lesson A.1</span>
<h2><span class="badge">★ Beyond the syllabus</span> How software actually ships today</h2>
<p class="lead">The methodologies you learned are the foundation; this is where the modern industry has taken them.</p>
<h3>DevOps &amp; CI/CD</h3>
<p><strong>DevOps</strong> tears down the old wall between developers (who write code) and operations (who run it), making one team responsible end-to-end. Its engine is <strong>CI/CD</strong>:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Continuous Integration (CI)</b> — every code change is automatically built and tested within minutes, so integration problems surface immediately, not weeks later.</div>
  <div class="lz-layer"><b>Continuous Delivery/Deployment (CD)</b> — passing changes are automatically released to production. Big companies deploy dozens of times a day, safely.</div>
</div>
<div class="note-ct">This is agile's "working software often" taken to its limit — automated all the way from a developer's commit to live users. You have already seen a CI/CD pipeline if you have used GitHub Actions.</div>

<h3>Choosing a methodology (CLO1 in practice)</h3>
<table>
  <thead><tr><th>If the project…</th><th>lean toward…</th></tr></thead>
  <tbody>
    <tr><td>has fixed, safety-critical requirements</td><td>Waterfall / V-model</td></tr>
    <tr><td>has evolving requirements &amp; an involved customer</td><td>Agile / Scrum</td></tr>
    <tr><td>needs fast flow &amp; waste reduction</td><td>Lean / Kanban</td></tr>
    <tr><td>needs frequent, safe releases</td><td>DevOps + CI/CD</td></tr>
  </tbody>
</table>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>There is no "best" methodology — only the best fit.</b> The mark of an engineer (versus a fan of one method) is refusing dogma. Real organisations blend approaches: Scrum for the rhythm, XP for code health, Lean thinking to cut waste, DevOps to ship. The genuine CLO1 skill — "compare and contrast methodologies and recommend improvements" — is exactly this judgment: reading a team's context and prescribing what fits, not what is fashionable.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao · Bài A.1</span>
<h2><span class="badge">★ Ngoài giáo trình</span> Phần mềm thực sự được ship thế nào hôm nay</h2>
<p class="lead">Các phương pháp bạn học là nền tảng; đây là nơi ngành hiện đại đã đưa chúng tới.</p>
<h3>DevOps &amp; CI/CD</h3>
<p><strong>DevOps</strong> phá bỏ bức tường cũ giữa lập trình viên (viết code) và vận hành (chạy nó), làm một đội chịu trách nhiệm đầu-cuối. Động cơ của nó là <strong>CI/CD</strong>:</p>
<div class="lz-stack">
  <div class="lz-layer"><b>Continuous Integration (CI)</b> — mỗi thay đổi code được tự động build và test trong vài phút, nên vấn đề tích hợp lộ ra ngay, không phải vài tuần sau.</div>
  <div class="lz-layer"><b>Continuous Delivery/Deployment (CD)</b> — thay đổi đạt yêu cầu được tự động phát hành lên production. Công ty lớn deploy hàng chục lần mỗi ngày, an toàn.</div>
</div>
<div class="note-ct">Đây là "phần mềm chạy được thường xuyên" của agile đẩy tới giới hạn — tự động hết chặng từ một commit của lập trình viên tới người dùng thật. Bạn đã thấy một pipeline CI/CD nếu từng dùng GitHub Actions.</div>

<h3>Chọn phương pháp (CLO1 trong thực tế)</h3>
<table>
  <thead><tr><th>Nếu dự án…</th><th>nghiêng về…</th></tr></thead>
  <tbody>
    <tr><td>có yêu cầu cố định, an toàn-trọng yếu</td><td>Waterfall / V-model</td></tr>
    <tr><td>có yêu cầu tiến hóa &amp; khách hàng tham gia</td><td>Agile / Scrum</td></tr>
    <tr><td>cần luồng nhanh &amp; giảm lãng phí</td><td>Lean / Kanban</td></tr>
    <tr><td>cần phát hành thường xuyên, an toàn</td><td>DevOps + CI/CD</td></tr>
  </tbody>
</table>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Không có phương pháp "tốt nhất" — chỉ có cái phù hợp nhất.</b> Dấu hiệu của một kỹ sư (khác một fan của một phương pháp) là từ chối giáo điều. Tổ chức thật pha trộn cách tiếp cận: Scrum cho nhịp, XP cho sức khỏe code, tư duy Lean để cắt lãng phí, DevOps để ship. Kỹ năng CLO1 thật sự — "so sánh &amp; đối chiếu phương pháp và đề xuất cải tiến" — chính là phán đoán này: đọc bối cảnh một đội và kê đơn cái phù hợp, không phải cái đang mốt.</div>
</div>
`,
        },
        {
          title: 'Quiz 4 — Scrum, Lean, quality & methodology choice|||Quiz 4 — Scrum, Lean, chất lượng & chọn phương pháp',
          slug: 'swe201c-quiz-2',
          type: 'QUIZ',
          description: 'Kiểm tra Scrum/XP, Lean, thực hành chất lượng và chủ đề nâng cao.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'In Scrum, who owns and prioritises the product backlog?|||Trong Scrum, ai sở hữu và ưu tiên product backlog?', options: ['the Scrum Master', 'the Product Owner', 'the Development Team', 'the customer|||khách hàng'], correctIndex: 1, points: 1 },
              { question: 'The Daily Scrum is…|||Daily Scrum là…', options: ['a detailed design meeting|||một buổi thiết kế chi tiết', 'a short 15-minute sync on progress and blockers|||một buổi đồng bộ ngắn 15 phút về tiến độ và vướng mắc', 'a code review|||một buổi review code', 'the sprint demo|||buổi demo sprint'], correctIndex: 1, points: 1 },
              { question: 'Test-driven development (an XP practice) means…|||Test-driven development (một thực hành XP) nghĩa là…', options: ['testing only at the end|||chỉ test ở cuối', 'writing the test before the code|||viết test trước khi viết code', 'never testing|||không bao giờ test', 'pair programming|||pair programming'], correctIndex: 1, points: 1 },
              { question: 'A core goal of Lean is to…|||Mục tiêu cốt lõi của Lean là…', options: ['add more documentation|||thêm nhiều tài liệu', 'eliminate waste (anything not adding customer value)|||loại bỏ lãng phí (thứ không thêm giá trị cho khách hàng)', 'lengthen the schedule|||kéo dài lịch', 'avoid testing|||tránh kiểm thử'], correctIndex: 1, points: 1 },
              { question: 'Technical debt refers to… (beyond-syllabus)|||Nợ kỹ thuật ám chỉ… (ngoài giáo trình)', options: ['money owed to a vendor|||tiền nợ nhà cung cấp', 'the future cost of shortcuts taken in the code|||chi phí tương lai của việc đi tắt trong code', 'a testing tool|||một công cụ kiểm thử', 'a Scrum role|||một vai trò Scrum'], correctIndex: 1, points: 1 },
              { question: 'The best methodology for a project is… (beyond-syllabus)|||Phương pháp tốt nhất cho một dự án là… (ngoài giáo trình)', options: ['always Agile|||luôn là Agile', 'the one that fits the project\'s context|||cái phù hợp với bối cảnh dự án', 'always Waterfall|||luôn là Waterfall', 'whichever is newest|||cái nào mới nhất'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ LUYỆN THI PE & FE ══════════════════ */
    {
      title: 'Exam preparation — PE & FE|||Luyện thi — PE & FE',
      description: 'Bộ khung trả lời 6 dạng câu hỏi PE (bảng tín hiệu → mô hình, template từng câu) và bộ từ vựng + lý thuyết trọng tâm cho FE.',
      lessons: [
        {
          title: 'E.1 — The Practical Exam: six question types|||E.1 — Bài thi thực hành: sáu dạng câu hỏi',
          slug: 'swe201c-luyen-thi-pe',
          type: 'VIDEO',
          description: 'Sáu dạng câu PE, khung trả lời từng dạng, bảng tín hiệu đề bài → mô hình phù hợp, và các lỗi bị trừ điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Exam prep · Lesson E.1</span>
<h2>The PE: what each question wants</h2>
<p class="lead">The practical exam is open-ended writing against a scenario. Marks come from <em>structure and justification</em>, not from length. Below is what each question type expects.</p>
<table>
  <thead><tr><th>Q</th><th>Topic</th><th>Typical weight</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Choose a development model &amp; justify it</td><td>~2.0</td></tr>
    <tr><td>2</td><td>Testing levels &amp; responsibilities</td><td>~1.0</td></tr>
    <tr><td>3</td><td>Functional &amp; non-functional requirements</td><td>~2.0</td></tr>
    <tr><td>4</td><td>User stories</td><td>~1.5</td></tr>
    <tr><td>5</td><td>Quality metrics, or classify models</td><td>~1.0</td></tr>
    <tr><td>6</td><td>Story mapping</td><td>~2.5</td></tr>
  </tbody>
</table>

<h3>Q1 — Choosing a model: read the signals</h3>
<p>Almost every scenario plants keywords that point at one model. Match the signal, then justify with the <em>reason belonging to that model</em>.</p>
<table>
  <thead><tr><th>Signal in the scenario</th><th>Points to</th><th>Because</th></tr></thead>
  <tbody>
    <tr><td>Requirements clear, stable, fully known up front</td><td>Waterfall</td><td>No iteration needed; sequential planning is efficient</td></tr>
    <tr><td>Safety-critical, heavy verification at each stage</td><td>V-model</td><td>Every phase has a matching test level</td></tr>
    <tr><td>Requirements unclear or expected to change</td><td>Agile / Scrum</td><td>Short iterations absorb change cheaply</td></tr>
    <tr><td>High risk, new technology, costly failure</td><td>Spiral</td><td>Risk analysis in every loop</td></tr>
    <tr><td>Large enterprise team, strong documentation &amp; architecture</td><td>RUP</td><td>Four phases, tool- and document-supported</td></tr>
    <tr><td>Customer cannot describe what they want</td><td>Prototyping</td><td>A prototype elicits the real requirements</td></tr>
    <tr><td>Deliver something usable early, then grow it</td><td>Incremental</td><td>Each increment is a working slice</td></tr>
    <tr><td>Support work, unpredictable incoming tickets</td><td>Kanban</td><td>Continuous flow, no sprint commitment to break</td></tr>
    <tr><td>Code quality problems, frequent releases</td><td>XP</td><td>TDD, pair programming, CI, refactoring</td></tr>
  </tbody>
</table>
<div class="out"><b>Answer template for Q1:</b><br>
<b>Recommendation:</b> [model].<br>
<b>a) Requirements:</b> the scenario says "…", which means requirements are [stable/changing/unclear] → this suits [model] because [model-specific reason].<br>
<b>b) Development team:</b> the team is [size/experience/location], which suits [model] because […].<br>
<b>c) Customer involvement:</b> the customer is [available/absent, frequency of feedback] → […].<br>
<b>Conclusion:</b> restate the choice in one sentence, plus one sentence on the main trade-off you accept.</div>
<div class="pitfall"><b>The most common Q1 failure is not choosing the wrong model — it is choosing a defensible model and then justifying it with another model's reason</b> (e.g. recommending Scrum "because it produces complete documentation up front"). Each justification must cite evidence quoted from the scenario, paired with a property that model genuinely has.</div>

<h3>Q2 — Testing levels &amp; responsibilities</h3>
<div class="out">List exactly four: Unit (developers) → Integration (developers/testers) → System (QA team) → Acceptance (end users), each with one line on what it focuses on. Tie them to the scenario where possible ("acceptance testing will be run by the warehouse staff described in the brief").<br>
<b>Do not add regression as a fifth level</b> — see Lesson 8.2.</div>

<h3>Q3 — FR &amp; NFR</h3>
<div class="out">Two clearly separated lists. Every line uses "The system shall …", and every NFR carries a number. After each item, cite the source line from the scenario. See Lesson 9.1 for the wording patterns.</div>

<h3>Q4 — User stories</h3>
<div class="out">Use the full template (As a … I want to … So that …), keep each story small and testable, and make the benefit a <em>user</em> benefit. If the question asks you to evaluate stories, name the INVEST letter that each weak story violates. See Lesson 9.2.</div>

<h3>Q5 — Metrics or classification</h3>
<div class="out"><b>If metrics:</b> list five or more with a one-line meaning each — cohesion (LCOM, TCC), coupling (CBO, RFC), Cyclomatic Complexity, Code Coverage, DIT (Lesson 7.2).<br>
<b>If classification:</b> Predictive/plan-driven (Waterfall, V-model, RUP) vs Adaptive (Scrum, XP, Kanban, Lean) — predictive fixes scope and estimates time; adaptive fixes time and adjusts scope.</div>

<h3>Q6 — Story mapping (the heaviest question)</h3>
<div class="out">Answer in two labelled parts:<br>
<b>A. Activities and user tasks</b> — numbered 1, 1.1, 1.2 …<br>
<b>B. Releases</b> — each release listing stories numbered 1.1.1, 1.1.2 …, written in full user-story form.<br>
Release 1 must touch every activity so the user journey works end to end. See Lesson 9.3.</div>
<div class="callout"><span class="badge">★ Exam-room advice</span> <b>Paraphrase, never copy.</b> Answers lifted verbatim from the scenario or from slides read as unoriginal and risk being marked down. Restate every point in your own words and always attach the scenario evidence to the reasoning — a graded answer is judged on whether the <em>justification</em> holds, not on whether the model name matches a key.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Luyện thi · Bài E.1</span>
<h2>Bài PE: từng câu muốn gì ở bạn</h2>
<p class="lead">Bài thi thực hành là dạng viết mở dựa trên một tình huống cho sẵn. Điểm đến từ <em>cấu trúc và lập luận</em>, không phải từ độ dài. Dưới đây là kỳ vọng của từng dạng câu.</p>
<table>
  <thead><tr><th>Câu</th><th>Chủ đề</th><th>Trọng số thường gặp</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>Chọn mô hình phát triển &amp; biện luận</td><td>~2.0</td></tr>
    <tr><td>2</td><td>Các mức kiểm thử &amp; trách nhiệm</td><td>~1.0</td></tr>
    <tr><td>3</td><td>Yêu cầu chức năng &amp; phi chức năng</td><td>~2.0</td></tr>
    <tr><td>4</td><td>User story</td><td>~1.5</td></tr>
    <tr><td>5</td><td>Chỉ số chất lượng, hoặc phân loại mô hình</td><td>~1.0</td></tr>
    <tr><td>6</td><td>Story mapping</td><td>~2.5</td></tr>
  </tbody>
</table>

<h3>Câu 1 — Chọn mô hình: đọc tín hiệu</h3>
<p>Hầu như mọi tình huống đều cài từ khóa trỏ tới một mô hình. Khớp tín hiệu, rồi biện luận bằng <em>chính lý do thuộc về mô hình đó</em>.</p>
<table>
  <thead><tr><th>Tín hiệu trong đề</th><th>Trỏ tới</th><th>Vì</th></tr></thead>
  <tbody>
    <tr><td>Yêu cầu rõ ràng, ổn định, biết đủ ngay từ đầu</td><td>Waterfall</td><td>Không cần lặp; lập kế hoạch tuần tự là hiệu quả</td></tr>
    <tr><td>An toàn-trọng yếu, kiểm chứng nặng ở mỗi giai đoạn</td><td>V-model</td><td>Mỗi pha có một mức kiểm thử tương ứng</td></tr>
    <tr><td>Yêu cầu chưa rõ hoặc dự kiến sẽ thay đổi</td><td>Agile / Scrum</td><td>Vòng lặp ngắn hấp thụ thay đổi với chi phí thấp</td></tr>
    <tr><td>Rủi ro cao, công nghệ mới, thất bại tốn kém</td><td>Spiral</td><td>Phân tích rủi ro ở mọi vòng lặp</td></tr>
    <tr><td>Đội lớn cấp doanh nghiệp, tài liệu &amp; kiến trúc chặt chẽ</td><td>RUP</td><td>Bốn pha, hỗ trợ mạnh bằng công cụ và tài liệu</td></tr>
    <tr><td>Khách hàng không mô tả được điều họ muốn</td><td>Prototyping</td><td>Nguyên mẫu giúp khai thác ra yêu cầu thật</td></tr>
    <tr><td>Cần giao thứ dùng được sớm rồi lớn dần</td><td>Incremental</td><td>Mỗi phần tăng là một lát cắt chạy được</td></tr>
    <tr><td>Công việc hỗ trợ, ticket đến không đoán trước</td><td>Kanban</td><td>Luồng liên tục, không có cam kết sprint để phá vỡ</td></tr>
    <tr><td>Vấn đề chất lượng mã, phát hành thường xuyên</td><td>XP</td><td>TDD, lập trình cặp, CI, refactoring</td></tr>
  </tbody>
</table>
<div class="out"><b>Khung trả lời cho Câu 1:</b><br>
<b>Đề xuất:</b> [mô hình].<br>
<b>a) Yêu cầu:</b> đề bài nói "…", nghĩa là yêu cầu [ổn định/thay đổi/chưa rõ] → điều này hợp với [mô hình] vì [lý do riêng của mô hình đó].<br>
<b>b) Đội phát triển:</b> đội có [quy mô/kinh nghiệm/vị trí địa lý], hợp với [mô hình] vì […].<br>
<b>c) Sự tham gia của khách hàng:</b> khách hàng [sẵn sàng/vắng mặt, tần suất phản hồi] → […].<br>
<b>Kết luận:</b> nhắc lại lựa chọn trong một câu, cộng một câu về đánh đổi chính mà bạn chấp nhận.</div>
<div class="pitfall"><b>Thất bại phổ biến nhất ở Câu 1 không phải chọn sai mô hình — mà là chọn một mô hình hợp lý rồi biện luận bằng lý do của mô hình khác</b> (vd. đề xuất Scrum "vì nó tạo ra tài liệu đầy đủ ngay từ đầu"). Mỗi lập luận phải trích được bằng chứng từ đề bài, ghép với một đặc tính mà mô hình đó thực sự có.</div>

<h3>Câu 2 — Mức kiểm thử &amp; trách nhiệm</h3>
<div class="out">Liệt kê đúng bốn mức: Unit (lập trình viên) → Integration (lập trình viên/tester) → System (đội QA) → Acceptance (người dùng cuối), mỗi mức một dòng nói về trọng tâm. Gắn với tình huống nếu được ("kiểm thử chấp nhận sẽ do nhân viên kho được mô tả trong đề thực hiện").<br>
<b>Đừng thêm regression thành mức thứ năm</b> — xem bài 8.2.</div>

<h3>Câu 3 — FR &amp; NFR</h3>
<div class="out">Hai danh sách tách bạch rõ ràng. Mỗi dòng dùng "Hệ thống phải …", và mọi NFR đều mang một con số. Sau mỗi mục, trích dẫn dòng nguồn trong đề. Xem bài 9.1 để lấy khuôn diễn đạt.</div>

<h3>Câu 4 — User story</h3>
<div class="out">Dùng đủ khuôn (Là một … Tôi muốn … Để mà …), giữ mỗi story nhỏ và kiểm thử được, và để lợi ích là lợi ích của <em>người dùng</em>. Nếu đề yêu cầu đánh giá story, hãy gọi tên chữ cái INVEST mà mỗi story yếu vi phạm. Xem bài 9.2.</div>

<h3>Câu 5 — Chỉ số hoặc phân loại</h3>
<div class="out"><b>Nếu hỏi chỉ số:</b> liệt kê từ năm cái trở lên kèm một dòng ý nghĩa mỗi cái — cohesion (LCOM, TCC), coupling (CBO, RFC), Cyclomatic Complexity, Code Coverage, DIT (bài 7.2).<br>
<b>Nếu hỏi phân loại:</b> Dự đoán/hướng kế hoạch (Waterfall, V-model, RUP) vs Thích ứng (Scrum, XP, Kanban, Lean) — nhóm dự đoán cố định phạm vi và ước lượng thời gian; nhóm thích ứng cố định thời gian và điều chỉnh phạm vi.</div>

<h3>Câu 6 — Story mapping (câu nặng điểm nhất)</h3>
<div class="out">Trả lời thành hai phần có nhãn rõ:<br>
<b>A. Activities và user tasks</b> — đánh số 1, 1.1, 1.2 …<br>
<b>B. Releases</b> — mỗi release liệt kê các story đánh số 1.1.1, 1.1.2 …, viết đủ dạng user story.<br>
Release 1 phải chạm tới mọi activity để hành trình người dùng chạy được từ đầu tới cuối. Xem bài 9.3.</div>
<div class="callout"><span class="badge">★ Lời khuyên phòng thi</span> <b>Diễn đạt lại bằng lời của mình, đừng chép nguyên.</b> Câu trả lời bê nguyên văn từ đề bài hoặc từ slide bị đọc là thiếu tính nguyên bản và có nguy cơ bị trừ điểm. Hãy diễn đạt lại mọi ý bằng lời của bạn và luôn gắn bằng chứng từ đề vào lập luận — bài chấm được đánh giá theo việc <em>lập luận</em> có vững hay không, chứ không phải theo việc tên mô hình có khớp đáp án hay không.</div>
</div>
`,
        },
        {
          title: 'E.2 — The Final Exam: vocabulary & key theory|||E.2 — Bài thi cuối kỳ: từ vựng & lý thuyết trọng tâm',
          slug: 'swe201c-luyen-thi-fe',
          type: 'VIDEO',
          description: 'Từ vựng chuyên ngành hay ra trong FE, chuỗi Error → Fault → Failure, Agile Manifesto đầy đủ và các cặp khái niệm dễ nhầm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Exam prep · Lesson E.2</span>
<h2>FE: the vocabulary decides your score</h2>
<p class="lead">The final exam is multiple choice, and most lost marks come from not knowing a term rather than not understanding a concept. Here are the terms that recur, grouped so they are easier to hold.</p>

<h3>Core terms</h3>
<table>
  <thead><tr><th>Term</th><th>Meaning</th></tr></thead>
  <tbody>
    <tr><td><b>Cohesion</b></td><td>How strongly elements inside one module belong together (high = good)</td></tr>
    <tr><td><b>Loose coupling</b></td><td>Modules depend on each other as little as possible (loose = good)</td></tr>
    <tr><td><b>Decomposability</b></td><td>How well a system can be broken into independent parts</td></tr>
    <tr><td><b>CIA</b></td><td>Confidentiality, Integrity, Availability — the three security goals</td></tr>
    <tr><td><b>Cutover</b></td><td>The moment of switching from the old system to the new one</td></tr>
    <tr><td><b>Failover</b></td><td>Automatic switch to a backup component when the primary fails</td></tr>
    <tr><td><b>Refactoring</b></td><td>Improving internal structure <em>without changing external behaviour</em></td></tr>
    <tr><td><b>Fidelity</b></td><td>How closely a prototype resembles the final product (low- vs high-fidelity)</td></tr>
    <tr><td><b>Oracle</b> (testing)</td><td>The source that tells you what the correct output should be</td></tr>
    <tr><td><b>Latent error</b></td><td>A fault present in the system but not yet triggered</td></tr>
  </tbody>
</table>

<h3>The error chain — a favourite FE question</h3>
<div class="out"><b>Error → Fault → Failure</b><br>
<b>Error</b> (mistake): the <em>human</em> action that produces an incorrect result — a developer misreads a spec.<br>
<b>Fault</b> (defect/bug): the resulting flaw <em>in the code or document</em>.<br>
<b>Failure</b>: the <em>observable</em> wrong behaviour when that fault is executed.<br><br>
Crucially: a fault only becomes a failure <b>if it is executed under the right conditions</b>. An unexecuted fault sits as a <b>latent</b> defect — present, harmless-looking, waiting.</div>
<div class="note-ct">Read exam options carefully: "a person makes an…" → error; "the code contains a…" → fault; "the user sees the system…" → failure. The three words are not interchangeable even though everyday speech calls all of them "bugs".</div>

<h3>The Agile Manifesto — all four values</h3>
<table>
  <thead><tr><th>We value…</th><th>over…</th></tr></thead>
  <tbody>
    <tr><td>Individuals and interactions</td><td>processes and tools</td></tr>
    <tr><td>Working software</td><td>comprehensive documentation</td></tr>
    <tr><td>Customer collaboration</td><td>contract negotiation</td></tr>
    <tr><td>Responding to change</td><td>following a plan</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>The sentence that gets tested most</b> is the closing line: <em>"That is, while there is value in the items on the right, we value the items on the left more."</em> Agile does <b>not</b> say documentation, processes, contracts or plans are worthless — an option claiming "agile means no documentation" is always wrong.</div>

<h3>Pairs that are easy to confuse</h3>
<table>
  <thead><tr><th>Pair</th><th>The distinction</th></tr></thead>
  <tbody>
    <tr><td>Iterative vs Incremental</td><td>Iterative = <em>refine</em> the same thing repeatedly; Incremental = <em>add</em> new pieces each time</td></tr>
    <tr><td>Verification vs Validation</td><td>Building it right vs building the right thing (Lesson 8.1)</td></tr>
    <tr><td>Throwaway vs Evolutionary prototype</td><td>Discarded afterwards vs kept and grown — "exploratory" is NOT the pair (Lesson 2.2)</td></tr>
    <tr><td>Implementation vs Deployment</td><td>Writing/building the software vs putting it into the live environment</td></tr>
    <tr><td>Retest vs Regression</td><td>Re-run failed cases vs re-run passed cases (Lesson 8.3)</td></tr>
    <tr><td>Smoke vs Sanity</td><td>Wide-and-shallow vs narrow-and-deep (Lesson 8.3)</td></tr>
    <tr><td>Coincidental vs Temporal cohesion</td><td>Grouped for no reason vs grouped because they run at the same time (Lesson 7.2)</td></tr>
    <tr><td>Predictive vs Adaptive</td><td>Fix scope, estimate time vs fix time, adjust scope</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Study method</span> Build this into a two-column self-test: cover the right-hand column and say each distinction aloud. Almost every FE question on these topics is a single distinction dressed in a sentence, so being able to state the difference in one line is exactly the skill being examined. Combine this with the seven testing principles (Lesson 8.1) and the INVEST/SMART acronyms (Chapter 9) and you have covered the bulk of the recallable content.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Luyện thi · Bài E.2</span>
<h2>FE: từ vựng quyết định điểm số</h2>
<p class="lead">Bài thi cuối kỳ là trắc nghiệm, và phần lớn điểm mất đi đến từ việc không biết một thuật ngữ chứ không phải không hiểu khái niệm. Đây là các thuật ngữ lặp lại nhiều, gom nhóm cho dễ nhớ.</p>

<h3>Thuật ngữ cốt lõi</h3>
<table>
  <thead><tr><th>Thuật ngữ</th><th>Nghĩa</th></tr></thead>
  <tbody>
    <tr><td><b>Cohesion</b></td><td>Các thành phần bên trong một module gắn bó với nhau chặt tới đâu (cao = tốt)</td></tr>
    <tr><td><b>Loose coupling</b></td><td>Các module phụ thuộc lẫn nhau càng ít càng tốt (lỏng = tốt)</td></tr>
    <tr><td><b>Decomposability</b></td><td>Hệ thống có thể chia thành các phần độc lập tốt tới mức nào</td></tr>
    <tr><td><b>CIA</b></td><td>Confidentiality, Integrity, Availability — ba mục tiêu bảo mật</td></tr>
    <tr><td><b>Cutover</b></td><td>Thời điểm chuyển đổi từ hệ thống cũ sang hệ thống mới</td></tr>
    <tr><td><b>Failover</b></td><td>Tự động chuyển sang thành phần dự phòng khi thành phần chính hỏng</td></tr>
    <tr><td><b>Refactoring</b></td><td>Cải thiện cấu trúc bên trong <em>mà không đổi hành vi bên ngoài</em></td></tr>
    <tr><td><b>Fidelity</b></td><td>Nguyên mẫu giống sản phẩm cuối tới mức nào (fidelity thấp vs cao)</td></tr>
    <tr><td><b>Oracle</b> (trong kiểm thử)</td><td>Nguồn cho biết đầu ra đúng phải là gì</td></tr>
    <tr><td><b>Latent error</b></td><td>Một lỗi đã có trong hệ thống nhưng chưa bị kích hoạt</td></tr>
  </tbody>
</table>

<h3>Chuỗi lỗi — câu hỏi FE rất được ưa chuộng</h3>
<div class="out"><b>Error → Fault → Failure</b><br>
<b>Error</b> (sai sót): hành động <em>của con người</em> tạo ra kết quả sai — lập trình viên đọc nhầm đặc tả.<br>
<b>Fault</b> (khiếm khuyết/bug): chỗ sai hình thành <em>trong code hoặc tài liệu</em>.<br>
<b>Failure</b> (hỏng hóc): hành vi sai <em>quan sát được</em> khi khiếm khuyết đó được thực thi.<br><br>
Điểm mấu chốt: một fault chỉ trở thành failure <b>nếu nó được thực thi trong đúng điều kiện</b>. Một fault chưa được chạy tới thì nằm im như một khiếm khuyết <b>tiềm ẩn (latent)</b> — đã có mặt, trông vô hại, đang chờ.</div>
<div class="note-ct">Hãy đọc kỹ các phương án: "một người mắc phải một…" → error; "trong code có một…" → fault; "người dùng thấy hệ thống…" → failure. Ba từ này không thay thế cho nhau được, dù đời thường gọi tất cả là "bug".</div>

<h3>Agile Manifesto — đủ bốn giá trị</h3>
<table>
  <thead><tr><th>Chúng tôi coi trọng…</th><th>hơn là…</th></tr></thead>
  <tbody>
    <tr><td>Cá nhân và tương tác</td><td>quy trình và công cụ</td></tr>
    <tr><td>Phần mềm chạy được</td><td>tài liệu đầy đủ</td></tr>
    <tr><td>Cộng tác với khách hàng</td><td>đàm phán hợp đồng</td></tr>
    <tr><td>Phản hồi với thay đổi</td><td>bám theo kế hoạch</td></tr>
  </tbody>
</table>
<div class="pitfall"><b>Câu bị hỏi nhiều nhất</b> chính là dòng kết: <em>"Nghĩa là, tuy các mục bên phải vẫn có giá trị, chúng tôi coi trọng các mục bên trái hơn."</em> Agile <b>không</b> nói tài liệu, quy trình, hợp đồng hay kế hoạch là vô giá trị — một phương án khẳng định "agile nghĩa là không cần tài liệu" thì luôn sai.</div>

<h3>Các cặp khái niệm dễ nhầm</h3>
<table>
  <thead><tr><th>Cặp</th><th>Phân biệt</th></tr></thead>
  <tbody>
    <tr><td>Iterative vs Incremental</td><td>Iterative = <em>tinh chỉnh</em> lặp lại cùng một thứ; Incremental = <em>thêm</em> mảnh mới mỗi lần</td></tr>
    <tr><td>Verification vs Validation</td><td>Xây đúng cách vs xây đúng thứ cần xây (bài 8.1)</td></tr>
    <tr><td>Nguyên mẫu Throwaway vs Evolutionary</td><td>Vứt đi sau đó vs giữ lại và bồi đắp — "exploratory" KHÔNG phải là cặp của nó (bài 2.2)</td></tr>
    <tr><td>Implementation vs Deployment</td><td>Viết/xây dựng phần mềm vs đưa nó vào môi trường chạy thật</td></tr>
    <tr><td>Retest vs Regression</td><td>Chạy lại case đã trượt vs chạy lại case đã đạt (bài 8.3)</td></tr>
    <tr><td>Smoke vs Sanity</td><td>Rộng-mà-nông vs hẹp-mà-sâu (bài 8.3)</td></tr>
    <tr><td>Coincidental vs Temporal cohesion</td><td>Gom nhóm không lý do vs gom nhóm vì chạy cùng thời điểm (bài 7.2)</td></tr>
    <tr><td>Predictive vs Adaptive</td><td>Cố định phạm vi, ước lượng thời gian vs cố định thời gian, điều chỉnh phạm vi</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Phương pháp học</span> Hãy biến bảng này thành bài tự kiểm hai cột: che cột bên phải và đọc to từng phân biệt. Gần như mọi câu hỏi FE về các chủ đề này chỉ là MỘT phép phân biệt được khoác lên một câu văn, nên khả năng nói ra khác biệt trong một dòng chính xác là kỹ năng đang được kiểm tra. Kết hợp thêm bảy nguyên tắc kiểm thử (bài 8.1) và hai từ viết tắt INVEST/SMART (Chương 9) là bạn đã phủ phần lớn nội dung cần thuộc lòng.</div>
</div>
`,
        },
      ],
    },

    /* END-SECTIONS-MARKER */
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ FE (trắc nghiệm, máy chấm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "swe201c-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "The SDLC phase that typically lasts the longest is…|||Pha SDLC thường kéo dài nhất là…",
                "options": [
                  "requirements|||phân tích yêu cầu",
                  "maintenance|||bảo trì",
                  "design|||thiết kế",
                  "deployment|||triển khai"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "Waterfall's main weakness is that it…|||Điểm yếu chính của Waterfall là nó…",
                "options": [
                  "has no phases|||không có pha nào",
                  "assumes all requirements are known and fixed up front|||giả định mọi yêu cầu được biết và cố định từ đầu",
                  "is too fast|||quá nhanh",
                  "skips testing|||bỏ kiểm thử"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "The Agile Manifesto values \"working software\" over…|||Agile Manifesto coi trọng \"phần mềm chạy được\" hơn…",
                "options": [
                  "customer feedback|||phản hồi khách hàng",
                  "comprehensive documentation|||tài liệu đầy đủ",
                  "individuals|||cá nhân",
                  "responding to change|||phản hồi thay đổi"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "Agile delivers value by…|||Agile giao giá trị bằng cách…",
                "options": [
                  "releasing everything at the very end|||phát hành mọi thứ ở cuối cùng",
                  "building in short iterations with frequent feedback|||xây theo vòng lặp ngắn với phản hồi thường xuyên",
                  "avoiding all planning|||tránh mọi lập kế hoạch",
                  "writing more documents|||viết nhiều tài liệu hơn"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "Waterfall can still be the right choice when… (beyond-syllabus)|||Waterfall vẫn có thể là lựa chọn đúng khi… (ngoài giáo trình)",
                "options": [
                  "requirements change daily|||yêu cầu đổi hằng ngày",
                  "requirements are fixed &amp; safety-critical (e.g. medical devices)|||yêu cầu cố định &amp; an toàn-trọng yếu (vd thiết bị y tế)",
                  "the team is small|||đội nhỏ",
                  "there is no deadline|||không có hạn"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "\"Cargo-cult agile\" refers to… (beyond-syllabus)|||\"Agile hình thức\" ám chỉ… (ngoài giáo trình)",
                "options": [
                  "a new framework|||một framework mới",
                  "doing agile rituals while ignoring its actual values|||làm các nghi thức agile mà phớt lờ giá trị thật",
                  "shipping software|||ship phần mềm",
                  "a testing tool|||một công cụ kiểm thử"
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
