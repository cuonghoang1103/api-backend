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
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Lean software development</div><div class="lz-nsub">Eliminate waste · deliver fast</div></div></div>
  <div class="lz-stage">Quality</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Secure &amp; quality software</div><div class="lz-nsub">Practices that prevent bugs &amp; breaches</div></div></div>
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
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Lean software development</div><div class="lz-nsub">Loại bỏ lãng phí · giao nhanh</div></div></div>
  <div class="lz-stage">Chất lượng</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Phần mềm bảo mật &amp; chất lượng</div><div class="lz-nsub">Thực hành ngăn bug &amp; rò rỉ</div></div></div>
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

    /* ══════════════════ CHƯƠNG 5 — LEAN ══════════════════ */
    {
      title: 'Chapter 5 — Lean software development|||Chương 5 — Phát triển phần mềm Lean',
      description: 'Nguồn gốc từ sản xuất Toyota; bảy loại lãng phí; và các nguyên tắc lean áp cho phần mềm.',
      lessons: [
        {
          title: '5.1 — Eliminating waste, delivering fast|||5.1 — Loại bỏ lãng phí, giao nhanh',
          slug: 'swe201c-lean',
          type: 'VIDEO',
          description: 'Lean từ Toyota; 7 loại lãng phí trong phần mềm; nguyên tắc (build-measure-learn, quyết định muộn, tối ưu toàn cục).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
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
<span class="eyebrow">Chương 5 · Bài 5.1</span>
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
      title: 'Chapter 6 — Secure & quality software|||Chương 6 — Phần mềm bảo mật & chất lượng',
      description: 'Chất lượng không phải tình cờ: kiểm thử, code review, và đưa bảo mật vào toàn bộ vòng đời.',
      lessons: [
        {
          title: '6.1 — Engineering practices for quality & security|||6.1 — Thực hành kỹ thuật cho chất lượng & bảo mật',
          slug: 'swe201c-chat-luong-bao-mat',
          type: 'VIDEO',
          description: 'Các mức kiểm thử; code review; và "shift-left security" — đưa bảo mật vào từ đầu thay vì vá cuối.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
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
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
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
</div>
`,
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
          title: 'Quiz 2 — Scrum, Lean, quality & methodology choice|||Quiz 2 — Scrum, Lean, chất lượng & chọn phương pháp',
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
    /* END-SECTIONS-MARKER */
  ],
};
