/**
 * OSG202 — Operating Systems (Hệ điều hành). Kỳ 2.
 * Bám giáo trình Andrew Tanenbaum "Modern Operating Systems" + thực hành Linux/shell
 * + chương nâng cao. Song ngữ EN/VN realtime (khối .ml-en / .ml-vi, tiêu đề EN|||VI).
 * Sơ đồ .lz-map/.lz-flow/.lz-stack; lệnh shell/C trong <pre>+.tok-*+.out.
 * Luyện Linux/shell → CodeLab track linux-bash; cài đặt WSL/VirtualBox → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/OSG202.mjs --apply
 */
export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'OSG202',
    slug: 'operating-systems',
    title: 'Operating Systems',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'The software that runs the machine: processes & threads, CPU scheduling, memory & virtual memory, file systems, I/O and deadlock — plus hands-on Linux and shell, the manager beneath every program.|||Phần mềm điều hành cỗ máy: tiến trình & luồng, lập lịch CPU, bộ nhớ & bộ nhớ ảo, hệ thống tệp, I/O và deadlock — cùng thực hành Linux và shell, người quản lý bên dưới mọi chương trình.',
    description: 'Môn hệ điều hành theo giáo trình Tanenbaum. Học OS quản lý CPU, bộ nhớ, tệp, thiết bị và xử lý deadlock ra sao; kèm thực hành Linux và lập trình shell/C. Là nền cho mọi việc hệ thống, DevOps và low-level.',
    whatYouLearn: 'Vai trò & cấu trúc OS; tiến trình, luồng, lập lịch CPU & đồng bộ hoá; quản lý bộ nhớ, phân trang & bộ nhớ ảo; hệ thống tệp; hệ thống I/O; deadlock (phát hiện/tránh/ngăn); dùng Linux & lệnh shell thành thạo; lập trình shell/C cơ bản.',
    requirements: 'Không có môn tiên quyết. Nên có CSI104/CEA201 để hiểu phần cứng. Cần một môi trường Linux (WSL trên Windows, hoặc máy ảo VirtualBox).',
    documentsNote: 'Giáo trình: Modern Operating Systems — Andrew S. Tanenbaum. Công cụ: Linux (WSL / Ubuntu trên VirtualBox), terminal/shell, GCC. Kèm file syllabus gốc OSG202.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học ra sao, điều kiện qua môn, lộ trình và công cụ.',
      lessons: [
        {
          title: '0.1 — About OSG202 & the course map|||0.1 — Giới thiệu OSG202 & bản đồ môn học',
          slug: 'osg202-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Hệ điều hành làm gì, vì sao học, và bản đồ toàn bộ môn học.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About OSG202 — Operating Systems</h2>
<p class="lead">CSI104 introduced the OS in one lesson; OSG202 spends a whole course inside it. The <strong>operating system</strong> is the master program that manages the entire machine — sharing the CPU among programs, allocating memory, organizing files, driving devices, and keeping everything safe and fair. Every app you run sits on top of it.</p>
<p>Why study it deeply? Because understanding the OS makes you a better engineer at every level: you write faster code when you know how memory and scheduling work, you debug mysterious slowdowns and deadlocks, and you can work confidently on Linux — the OS that runs almost all servers, cloud and Android. OSG202 also builds real <strong>Linux and shell</strong> skills you will use for the rest of your career.</p>
<h3>Course map</h3>
<div class="lz-map">
  <div class="lz-stage">The machine manager</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Introduction</div><div class="lz-nsub">What an OS is · kernel · system calls</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Processes &amp; Threads</div><div class="lz-nsub">Scheduling · synchronization</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Memory Management</div><div class="lz-nsub">Paging · virtual memory</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">File Systems</div><div class="lz-nsub">Files · directories · implementation</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Input/Output</div><div class="lz-nsub">Device drivers · I/O software</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Deadlock</div><div class="lz-nsub">Detect · avoid · prevent</div></div></div>
  <div class="lz-stage">Hands-on</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Linux &amp; the Shell</div><div class="lz-nsub">Commands · scripting · using an OS for real</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Concurrency pitfalls · containers &amp; modern OS</div><div class="lz-nsub">From theory to today&#39;s systems</div></div></div>
</div>
<p>OSG202 builds directly on <span class="badge">CEA201</span> (the hardware the OS manages) and prepares you for <span class="badge">NWC203c</span>, <span class="badge">IOT102</span>, DevOps and any systems work. Its Linux skills pair perfectly with the CodeLab Linux track.</p>
<div class="callout ok">This course has two halves: <strong>concepts</strong> (how the OS works, tested by MCQ exams) and <strong>practice</strong> (Linux/shell, tested by labs). Do both — read the theory and actually type commands in a real Linux terminal.</div>
<a class="link-card exphub" href="/exp-hub/osg202-cong-cu-hoc-tap?ref=%2Fcourses%2Foperating-systems%2Flearn&reflabel=OSG202%20%E2%80%94%20Operating%20Systems" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Set up Linux — WSL, VirtualBox &amp; terminal</span><span class="lc-sub">How to get a real Linux environment to practice — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu OSG202 — Hệ điều hành</h2>
<p class="lead">CSI104 giới thiệu OS trong một bài; OSG202 dành cả một môn ở bên trong nó. <strong>Hệ điều hành</strong> là chương trình chủ quản lý cả cỗ máy — chia CPU giữa các chương trình, cấp phát bộ nhớ, tổ chức tệp, điều khiển thiết bị, và giữ mọi thứ an toàn, công bằng. Mọi app bạn chạy đều nằm trên nó.</p>
<p>Vì sao học sâu? Vì hiểu OS làm bạn thành kỹ sư tốt hơn ở mọi tầng: viết code nhanh hơn khi biết bộ nhớ và lập lịch hoạt động ra sao, gỡ được các chậm/deadlock bí ẩn, và làm việc tự tin trên Linux — OS chạy gần như mọi máy chủ, đám mây và Android. OSG202 cũng xây kỹ năng <strong>Linux và shell</strong> thật bạn dùng suốt sự nghiệp.</p>
<h3>Bản đồ môn học</h3>
<div class="lz-map">
  <div class="lz-stage">Người quản lý cỗ máy</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Giới thiệu</div><div class="lz-nsub">OS là gì · kernel · system call</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Tiến trình &amp; Luồng</div><div class="lz-nsub">Lập lịch · đồng bộ hoá</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Quản lý bộ nhớ</div><div class="lz-nsub">Phân trang · bộ nhớ ảo</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Hệ thống tệp</div><div class="lz-nsub">Tệp · thư mục · cài đặt</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Nhập/Xuất (I/O)</div><div class="lz-nsub">Driver thiết bị · phần mềm I/O</div></div></div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Deadlock (bế tắc)</div><div class="lz-nsub">Phát hiện · tránh · ngăn</div></div></div>
  <div class="lz-stage">Thực hành</div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Linux &amp; Shell</div><div class="lz-nsub">Lệnh · scripting · dùng OS thật</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Bẫy đồng thời · container &amp; OS hiện đại</div><div class="lz-nsub">Từ lý thuyết tới hệ thống hôm nay</div></div></div>
</div>
<p>OSG202 xây trực tiếp trên <span class="badge">CEA201</span> (phần cứng mà OS quản lý) và chuẩn bị cho <span class="badge">NWC203c</span>, <span class="badge">IOT102</span>, DevOps và mọi việc hệ thống. Kỹ năng Linux của nó khớp hoàn hảo với track Linux của CodeLab.</p>
<div class="callout ok">Môn này có hai nửa: <strong>khái niệm</strong> (OS hoạt động ra sao, thi trắc nghiệm) và <strong>thực hành</strong> (Linux/shell, chấm qua lab). Làm cả hai — đọc lý thuyết và thực sự gõ lệnh trong terminal Linux thật.</div>
<a class="link-card exphub" href="/exp-hub/osg202-cong-cu-hoc-tap?ref=%2Fcourses%2Foperating-systems%2Flearn&reflabel=OSG202%20%E2%80%94%20Operating%20Systems" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Cài Linux — WSL, VirtualBox &amp; terminal</span><span class="lc-sub">Cách có môi trường Linux thật để thực hành — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'osg202-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn qua môn và trọng số từng cột điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">From the official OSG202 syllabus. Note the balance: half concept exams, half labs and a presentation.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + 1h exam + 104h self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Lab</td><td>20%</td><td>4 labs — hands-on Linux/shell (LO7–10)</td></tr>
    <tr><td>Presentation</td><td>20%</td><td>Group presentation on an OS topic / case study</td></tr>
    <tr><td>Progress Test</td><td>20%</td><td>2 multiple-choice tests (concepts)</td></tr>
    <tr><td>Final Exam</td><td>40%</td><td>60 min multiple choice — must score ≥ 4 to pass</td></tr>
  </tbody>
</table>
<div class="callout warn">Two gates: weighted average ≥ 5.0 AND final ≥ 4.0. The exams are multiple choice on concepts (processes, memory, deadlock…), so precise understanding of terminology wins — exactly what the chapter quizzes drill. The 40% of labs+presentation rewards real Linux practice.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Từ syllabus chính thức OSG202. Lưu ý cân bằng: nửa thi khái niệm, nửa lab và thuyết trình.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h học + 1h thi + 104h tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% số buổi</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Lab</td><td>20%</td><td>4 bài lab — thực hành Linux/shell (LO7–10)</td></tr>
    <tr><td>Thuyết trình</td><td>20%</td><td>Thuyết trình nhóm về một chủ đề OS / case study</td></tr>
    <tr><td>Progress Test</td><td>20%</td><td>2 bài trắc nghiệm (khái niệm)</td></tr>
    <tr><td>Thi cuối kỳ</td><td>40%</td><td>60 phút trắc nghiệm — phải đạt ≥ 4 mới qua môn</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai cửa: trung bình có trọng số ≥ 5.0 VÀ thi cuối ≥ 4.0. Bài thi là trắc nghiệm về khái niệm (tiến trình, bộ nhớ, deadlock…), nên hiểu chính xác thuật ngữ là thắng — đúng thứ quiz các chương rèn. 40% lab+thuyết trình thưởng cho thực hành Linux thật.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning outcomes (CLOs)|||0.3 — Chuẩn đầu ra (CLO)',
          slug: 'osg202-chuan-dau-ra',
          type: 'VIDEO',
          description: 'Các kỹ năng nhà trường cam kết bạn làm được — checklist ôn thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The Course Learning Outcomes (CLOs)</h2>
<p class="lead">The CLOs split into concept understanding (exams) and Linux skills (labs). They map onto the chapters — your revision checklist.</p>
<table>
  <thead><tr><th>#</th><th>You will be able to…</th><th>Covered in</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Understand the main concepts of an operating system</td><td>Chapter 1</td></tr>
    <tr><td>CLO2</td><td>Understand process management</td><td>Chapter 2</td></tr>
    <tr><td>CLO3</td><td>Understand memory management</td><td>Chapter 3</td></tr>
    <tr><td>CLO4</td><td>Understand file systems</td><td>Chapter 4</td></tr>
    <tr><td>CLO5</td><td>Understand I/O systems</td><td>Chapter 5</td></tr>
    <tr><td>CLO6</td><td>Understand deadlock</td><td>Chapter 6</td></tr>
    <tr><td>CLO7–10</td><td>Use Linux; use shell commands fluently; shell &amp; C on Linux</td><td>Chapter 7</td></tr>
    <tr><td>CLO11</td><td>Use AI tools to explore OS concepts</td><td>All + Advanced</td></tr>
  </tbody>
</table>
<div class="note-ct">CLO7–10 are practical and worth the labs — the only way to pass them is to actually use Linux. Set up your environment early (see the tools guide) and practice commands from day one.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Các CLO chia thành hiểu khái niệm (thi) và kỹ năng Linux (lab). Chúng khớp với các chương — checklist ôn tập của bạn.</p>
<table>
  <thead><tr><th>#</th><th>Bạn sẽ làm được…</th><th>Học ở</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Hiểu các khái niệm chính của hệ điều hành</td><td>Chương 1</td></tr>
    <tr><td>CLO2</td><td>Hiểu quản lý tiến trình</td><td>Chương 2</td></tr>
    <tr><td>CLO3</td><td>Hiểu quản lý bộ nhớ</td><td>Chương 3</td></tr>
    <tr><td>CLO4</td><td>Hiểu hệ thống tệp</td><td>Chương 4</td></tr>
    <tr><td>CLO5</td><td>Hiểu hệ thống I/O</td><td>Chương 5</td></tr>
    <tr><td>CLO6</td><td>Hiểu deadlock</td><td>Chương 6</td></tr>
    <tr><td>CLO7–10</td><td>Dùng Linux; dùng lệnh shell thành thạo; shell &amp; C trên Linux</td><td>Chương 7</td></tr>
    <tr><td>CLO11</td><td>Dùng công cụ AI để khám phá khái niệm OS</td><td>Mọi chương + Nâng cao</td></tr>
  </tbody>
</table>
<div class="note-ct">CLO7–10 mang tính thực hành và là điểm của lab — cách duy nhất để đạt là thực sự dùng Linux. Cài môi trường sớm (xem guide công cụ) và luyện lệnh từ ngày đầu.</div>
</div>
`,
        },
        {
          title: '0.4 — Materials, tools & how to study|||0.4 — Tài liệu, công cụ & cách học',
          slug: 'osg202-tai-lieu',
          type: 'VIDEO',
          description: 'Giáo trình Tanenbaum, cách có Linux và cách học môn hai nửa.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials, tools &amp; how to study</h2>
<h3>Textbook</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Modern Operating Systems — Andrew S. Tanenbaum</div><div class="lz-ld">The classic OS textbook. Every chapter here follows it: processes, memory, files, I/O, deadlock, plus case studies of UNIX/Linux and Windows.</div></div>
</div>
<h3>Get a real Linux environment</h3>
<ul>
  <li><strong>WSL</strong> (Windows Subsystem for Linux) — the easiest way to run Ubuntu inside Windows.</li>
  <li><strong>VirtualBox + Ubuntu</strong> — a full virtual machine, great for experimenting safely.</li>
  <li>macOS/Linux users already have a Unix terminal.</li>
</ul>
<h3>How to study a two-part course</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Read</div><div class="lz-t">the concept</div><div class="lz-d">for the exams</div></div>
  <div class="lz-step"><div class="lz-k">Type</div><div class="lz-t">the command</div><div class="lz-d">for the labs</div></div>
  <div class="lz-step"><div class="lz-k">Connect</div><div class="lz-t">theory ↔ practice</div><div class="lz-d">e.g. see processes with ps</div></div>
  <div class="lz-step"><div class="lz-k">Self-quiz</div><div class="lz-t">weekly</div><div class="lz-d">for the MCQ exams</div></div>
</div>
<div class="callout ok">The magic of OSG202 is watching theory become real: read about processes, then run <code>ps</code> and <code>top</code> to see them; read about memory, then run <code>free</code>. Every concept has a Linux command that makes it concrete.</div>
<a class="link-card exphub" href="/exp-hub/osg202-cong-cu-hoc-tap?ref=%2Fcourses%2Foperating-systems%2Flearn&reflabel=OSG202%20%E2%80%94%20Operating%20Systems" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Set up WSL / VirtualBox / terminal</span><span class="lc-sub">Get your Linux environment ready for the OSG202 labs.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Foperating-systems%2Flearn&reflabel=OSG202%20%E2%80%94%20Operating%20Systems#module-478" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice Linux on CodeLab</span><span class="lc-sub">The Linux &amp; Bash track mirrors the OSG202 labs — command by command.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu, công cụ &amp; cách học</h2>
<h3>Giáo trình</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Modern Operating Systems — Andrew S. Tanenbaum</div><div class="lz-ld">Giáo trình OS kinh điển. Mọi chương ở đây bám nó: tiến trình, bộ nhớ, tệp, I/O, deadlock, cùng case study UNIX/Linux và Windows.</div></div>
</div>
<h3>Có một môi trường Linux thật</h3>
<ul>
  <li><strong>WSL</strong> (Windows Subsystem for Linux) — cách dễ nhất chạy Ubuntu bên trong Windows.</li>
  <li><strong>VirtualBox + Ubuntu</strong> — một máy ảo đầy đủ, tuyệt để thử nghiệm an toàn.</li>
  <li>Người dùng macOS/Linux đã sẵn có terminal Unix.</li>
</ul>
<h3>Cách học một môn hai phần</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Đọc</div><div class="lz-t">khái niệm</div><div class="lz-d">cho bài thi</div></div>
  <div class="lz-step"><div class="lz-k">Gõ</div><div class="lz-t">lệnh</div><div class="lz-d">cho lab</div></div>
  <div class="lz-step"><div class="lz-k">Nối</div><div class="lz-t">lý thuyết ↔ thực hành</div><div class="lz-d">vd thấy tiến trình bằng ps</div></div>
  <div class="lz-step"><div class="lz-k">Tự kiểm</div><div class="lz-t">hàng tuần</div><div class="lz-d">cho bài thi trắc nghiệm</div></div>
</div>
<div class="callout ok">Điều kỳ diệu của OSG202 là xem lý thuyết thành hiện thực: đọc về tiến trình, rồi chạy <code>ps</code> và <code>top</code> để thấy chúng; đọc về bộ nhớ, rồi chạy <code>free</code>. Mỗi khái niệm có một lệnh Linux làm nó cụ thể.</div>
<a class="link-card exphub" href="/exp-hub/osg202-cong-cu-hoc-tap?ref=%2Fcourses%2Foperating-systems%2Flearn&reflabel=OSG202%20%E2%80%94%20Operating%20Systems" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Cài WSL / VirtualBox / terminal</span><span class="lc-sub">Chuẩn bị môi trường Linux cho lab OSG202.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Foperating-systems%2Flearn&reflabel=OSG202%20%E2%80%94%20Operating%20Systems#module-478" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện Linux trên CodeLab</span><span class="lc-sub">Track Linux &amp; Bash phản chiếu lab OSG202 — từng lệnh.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — GIỚI THIỆU ══════════════════ */
    {
      title: 'Chapter 1 — Introduction|||Chương 1 — Giới thiệu',
      description: 'Hệ điều hành là gì, kernel, system call và cấu trúc OS.',
      lessons: [
        {
          title: '1.1 — What an OS is: kernel & system calls|||1.1 — OS là gì: kernel & system call',
          slug: 'osg202-1-1-kernel-syscall',
          simulation: {
            url: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-1-1-kernel-syscall.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-1-1-kernel-syscall.jpg',
            scenario: 'syscall',
            durationSeconds: 21,
            caption: { en: "User space → kernel and back: what a syscall costs", vi: "Vùng người dùng → nhân và ngược lại: một syscall tốn gì" },
          },
          type: 'VIDEO',
          description: 'Vai trò kép của OS và cách chương trình yêu cầu dịch vụ từ nó.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Two views of the operating system</h2>
<p class="lead">An operating system (CLO1) plays two roles at once: it is a <strong>resource manager</strong> (fairly sharing CPU, memory, devices among programs) and an <strong>extended machine</strong> (hiding messy hardware behind clean abstractions like files and processes).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Applications (user space)</div><div class="lz-ld">Browser, editor, your programs — run with limited privileges.</div></div>
  <div class="lz-layer"><div class="lz-lt">The kernel (privileged space)</div><div class="lz-ld">The core of the OS: manages CPU, memory, devices. Runs in a protected mode where it can touch the hardware directly.</div></div>
  <div class="lz-layer"><div class="lz-lt">Hardware</div><div class="lz-ld">CPU, RAM, disk, devices.</div></div>
</div>
<h3>System calls — the door to the kernel</h3>
<p>A user program cannot touch hardware directly (that would be unsafe). Instead it makes a <strong>system call</strong> — a controlled request to the kernel for a service like "read this file" or "create a process." This is the boundary between user space and kernel space.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Program</div><div class="lz-t">wants to read a file</div><div class="lz-d">calls read()</div></div>
  <div class="lz-step"><div class="lz-k">System call</div><div class="lz-t">switches to kernel</div><div class="lz-d">privileged mode</div></div>
  <div class="lz-step"><div class="lz-k">Kernel</div><div class="lz-t">does it safely</div><div class="lz-d">returns the data</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>A system call is not free — and the vDSO.</b> Crossing into the kernel flushes CPU pipelines and costs hundreds of nanoseconds. That is why Linux maps a tiny read-only page called the <strong>vDSO</strong> (virtual dynamic shared object) into every process, letting hot calls like <code>gettimeofday</code> run in user space with no trap at all. <em>Textbooks present the syscall as a simple door; real kernels measure its cost and optimize the door away for the busiest calls.</em></div>
<div class="note-ct">This user/kernel split is enforced by the hardware you met in CEA201 (the timer interrupt and MMU). It is why one buggy app cannot crash the whole machine, and why you cannot read another program&#39;s memory. Protection is the OS&#39;s job, backed by the CPU.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Hai góc nhìn về hệ điều hành</h2>
<p class="lead">Một hệ điều hành (CLO1) đóng hai vai cùng lúc: nó là <strong>người quản lý tài nguyên</strong> (chia CPU, bộ nhớ, thiết bị công bằng giữa các chương trình) và một <strong>cỗ máy mở rộng</strong> (giấu phần cứng lộn xộn sau các trừu tượng sạch như tệp và tiến trình).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Ứng dụng (user space)</div><div class="lz-ld">Trình duyệt, editor, chương trình của bạn — chạy với quyền hạn giới hạn.</div></div>
  <div class="lz-layer"><div class="lz-lt">Kernel (không gian đặc quyền)</div><div class="lz-ld">Lõi của OS: quản lý CPU, bộ nhớ, thiết bị. Chạy ở chế độ bảo vệ nơi nó chạm phần cứng trực tiếp được.</div></div>
  <div class="lz-layer"><div class="lz-lt">Phần cứng</div><div class="lz-ld">CPU, RAM, đĩa, thiết bị.</div></div>
</div>
<h3>System call — cánh cửa vào kernel</h3>
<p>Một chương trình người dùng không chạm trực tiếp phần cứng được (sẽ không an toàn). Thay vào đó nó gọi một <strong>system call</strong> — một yêu cầu có kiểm soát tới kernel cho một dịch vụ như "đọc tệp này" hoặc "tạo một tiến trình." Đây là ranh giới giữa user space và kernel space.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Chương trình</div><div class="lz-t">muốn đọc một tệp</div><div class="lz-d">gọi read()</div></div>
  <div class="lz-step"><div class="lz-k">System call</div><div class="lz-t">chuyển sang kernel</div><div class="lz-d">chế độ đặc quyền</div></div>
  <div class="lz-step"><div class="lz-k">Kernel</div><div class="lz-t">làm an toàn</div><div class="lz-d">trả dữ liệu về</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>System call không miễn phí — và vDSO.</b> Vượt vào kernel làm xả pipeline CPU và tốn hàng trăm nano-giây. Vì thế Linux ánh xạ một trang chỉ-đọc nhỏ gọi là <strong>vDSO</strong> (virtual dynamic shared object) vào mọi tiến trình, cho các lệnh nóng như <code>gettimeofday</code> chạy ngay trong user space mà không cần trap. <em>Giáo trình trình bày syscall như một cánh cửa đơn giản; kernel thật đo chi phí của nó và tối ưu bỏ luôn cánh cửa cho các lệnh bận nhất.</em></div>
<div class="note-ct">Phân tách user/kernel này được cưỡng chế bởi phần cứng bạn gặp ở CEA201 (ngắt timer và MMU). Đó là lý do một app lỗi không làm sập cả máy, và bạn không đọc được bộ nhớ chương trình khác. Bảo vệ là việc của OS, được CPU hậu thuẫn.</div>
</div>
`,
        },
        {
          title: '1.2 — Four generations & the OS zoo|||1.2 — Bốn thế hệ & vườn thú hệ điều hành',
          slug: 'osg202-1-2-lich-su-zoo',
          type: 'VIDEO',
          description: 'Lịch sử OS qua bốn thế hệ và bảy loại OS hiện nay — mỗi loại tối ưu cho một ràng buộc khác nhau.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Why operating systems look the way they do</h2>
<p class="lead">Every OS feature you will study — processes, virtual memory, file systems — was invented to solve a specific historical problem. Knowing which problem makes the design memorable instead of arbitrary.</p>

<h3>Four generations</h3>
<table><thead><tr><th>Era</th><th>Machine</th><th>Problem solved</th><th>Invention</th></tr></thead><tbody>
<tr><td>1945–55</td><td>Vacuum tubes, plugboards</td><td>—</td><td><b>No OS at all</b>: one program, one operator, one machine</td></tr>
<tr><td>1955–65</td><td>Transistors, mainframes</td><td>Expensive CPU sat idle between jobs</td><td><b>Batch systems</b>: a tape of jobs run back to back</td></tr>
<tr><td>1965–80</td><td>ICs, IBM 360</td><td>CPU still idle during I/O</td><td><b>Multiprogramming</b> (several jobs in memory), <b>timesharing</b> (MULTICS → UNIX)</td></tr>
<tr><td>1980–now</td><td>LSI / personal computers</td><td>Computers for individuals</td><td><b>GUI, networking, mobile, cloud</b> (MS-DOS → Windows, UNIX → Linux/macOS/Android)</td></tr>
</tbody></table>
<div class="out"><b>The one idea that drives all of it:</b> the CPU is fast, I/O is slow, and any moment the CPU spends waiting is money burnt. Multiprogramming exists so that when job A blocks on the disk, job B runs. Every scheduler in Chapter 2 and every page-replacement policy in Chapter 3 is a refinement of that single insight.<br>
<b>Concrete numbers:</b> a CPU instruction takes ~1 ns; a disk seek ~10 ms — a ratio of 10,000,000:1. Waiting for one disk read is, from the CPU's point of view, like a human waiting four months for a reply.</div>

<h3>The OS zoo — seven kinds, each with a different constraint</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Mainframe OS</b> (z/OS) — enormous I/O throughput, thousands of concurrent jobs. Optimises <em>batch and transaction volume</em>.</div>
  <div class="lz-layer"><b>Server OS</b> (Linux, Windows Server) — serve many clients at once. Optimises <em>concurrency and uptime</em>.</div>
  <div class="lz-layer"><b>Multiprocessor OS</b> — keep many cores busy and coherent. Optimises <em>parallelism and locking</em>.</div>
  <div class="lz-layer"><b>Personal computer OS</b> (Windows, macOS, Linux desktop) — one user, good interactivity. Optimises <em>response time</em>.</div>
  <div class="lz-layer"><b>Handheld OS</b> (Android, iOS) — battery and memory are the scarce resources. Optimises <em>energy</em>: apps are suspended aggressively, which is why background work is restricted.</div>
  <div class="lz-layer"><b>Embedded OS</b> (FreeRTOS on the Arduino of IOT102) — kilobytes of RAM, no user, no installation of new programs. Optimises <em>size and determinism</em>.</div>
  <div class="lz-layer"><b>Real-time OS</b> (VxWorks, QNX) — a missed deadline is a failure, not a slowdown. <b>Hard real time</b>: an airbag controller must fire within milliseconds. <b>Soft real time</b>: a video player may drop a frame.</div>
</div>

<h3>Two roles, both true at once</h3>
<div class="out"><b>The OS as an extended machine (top-down view):</b> it hides the hardware behind clean abstractions. You call <span class="badge">write()</span>; you do not position a disk head, choose a track, or handle the controller's interrupt.<br>
<b>The OS as a resource manager (bottom-up view):</b> it decides <em>who</em> gets the CPU, the memory and the disk, and <em>when</em> — multiplexing in time (the CPU switches between processes) and in space (memory is divided between them).<br>
Chapter 2 studies time multiplexing; Chapter 3 studies space multiplexing. That is the whole structure of this course.</div>

<div class="pitfall"><b>A real-time OS is not "a fast OS".</b> It is a <em>predictable</em> one: it guarantees an upper bound on response time, often by being simpler and less throughput-oriented than Linux. Answering "real time means very fast" in the progress test loses the mark.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The zoo is collapsing into one kernel.</b> Linux now runs the mainframe-class server, the Android phone in your pocket, the router on your desk, the car dashboard and — through the PREEMPT_RT patches merged in 2024 — hard real-time controllers as well. The historic split was driven by hardware constraints that shrank away; what remains different is <em>configuration</em>, not architecture. That is also why learning Linux internals in this course transfers to almost any device you will ever program. <em>Beyond syllabus because Tanenbaum presents the categories as distinct systems, while the industry converged on one code base with different build options.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Vì sao hệ điều hành lại có hình hài như hiện nay</h2>
<p class="lead">Mọi tính năng OS bạn sắp học — tiến trình, bộ nhớ ảo, hệ thống tệp — đều được phát minh để giải một bài toán lịch sử cụ thể. Biết bài toán đó làm thiết kế trở nên dễ nhớ thay vì tuỳ tiện.</p>

<h3>Bốn thế hệ</h3>
<table><thead><tr><th>Thời kỳ</th><th>Máy</th><th>Bài toán được giải</th><th>Phát minh</th></tr></thead><tbody>
<tr><td>1945–55</td><td>Đèn điện tử, bảng cắm dây</td><td>—</td><td><b>Không có OS</b>: một chương trình, một người vận hành, một máy</td></tr>
<tr><td>1955–65</td><td>Bóng bán dẫn, máy lớn</td><td>CPU đắt tiền nằm không giữa các công việc</td><td><b>Hệ theo lô</b>: một cuộn băng các job chạy nối tiếp</td></tr>
<tr><td>1965–80</td><td>Vi mạch, IBM 360</td><td>CPU vẫn nằm không trong lúc chờ I/O</td><td><b>Đa chương</b> (nhiều job cùng trong bộ nhớ), <b>chia sẻ thời gian</b> (MULTICS → UNIX)</td></tr>
<tr><td>1980–nay</td><td>LSI / máy tính cá nhân</td><td>Máy tính cho từng cá nhân</td><td><b>Giao diện đồ hoạ, mạng, di động, đám mây</b> (MS-DOS → Windows, UNIX → Linux/macOS/Android)</td></tr>
</tbody></table>
<div class="out"><b>Một ý tưởng chi phối tất cả:</b> CPU thì nhanh, I/O thì chậm, và mọi khoảnh khắc CPU ngồi chờ là tiền bị đốt. Đa chương sinh ra để khi job A kẹt chờ đĩa thì job B chạy. Mọi bộ lập lịch ở Chương 2 và mọi chính sách thay trang ở Chương 3 đều là tinh chỉnh của đúng nhận định đó.<br>
<b>Con số cụ thể:</b> một lệnh CPU mất ~1 na-nô-giây; một lần tìm kiếm trên đĩa ~10 mili-giây — tỉ lệ 10.000.000:1. Chờ một lần đọc đĩa, dưới góc nhìn của CPU, giống như con người chờ bốn tháng để nhận một câu trả lời.</div>

<h3>Vườn thú OS — bảy loại, mỗi loại một ràng buộc khác nhau</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>OS máy lớn</b> (z/OS) — thông lượng I/O khổng lồ, hàng nghìn job đồng thời. Tối ưu <em>khối lượng lô và giao dịch</em>.</div>
  <div class="lz-layer"><b>OS máy chủ</b> (Linux, Windows Server) — phục vụ nhiều máy khách cùng lúc. Tối ưu <em>tính đồng thời và thời gian sống</em>.</div>
  <div class="lz-layer"><b>OS đa xử lý</b> — giữ nhiều nhân luôn bận và nhất quán. Tối ưu <em>song song và khoá</em>.</div>
  <div class="lz-layer"><b>OS máy tính cá nhân</b> (Windows, macOS, Linux desktop) — một người dùng, tương tác mượt. Tối ưu <em>thời gian đáp ứng</em>.</div>
  <div class="lz-layer"><b>OS cầm tay</b> (Android, iOS) — pin và bộ nhớ mới là tài nguyên khan hiếm. Tối ưu <em>năng lượng</em>: ứng dụng bị treo lại rất mạnh tay, và đó là lý do việc chạy nền bị hạn chế.</div>
  <div class="lz-layer"><b>OS nhúng</b> (FreeRTOS trên Arduino của IOT102) — vài ki-lô-byte RAM, không người dùng, không cài thêm chương trình. Tối ưu <em>kích thước và tính tất định</em>.</div>
  <div class="lz-layer"><b>OS thời gian thực</b> (VxWorks, QNX) — trễ hạn là hỏng, không phải chậm. <b>Thời gian thực cứng</b>: bộ điều khiển túi khí phải bung trong vài mili-giây. <b>Mềm</b>: trình phát video được phép rơi một khung hình.</div>
</div>

<h3>Hai vai trò, đúng cùng lúc</h3>
<div class="out"><b>OS như một cỗ máy mở rộng (nhìn từ trên xuống):</b> nó giấu phần cứng sau những trừu tượng sạch sẽ. Bạn gọi <span class="badge">write()</span>; bạn không phải định vị đầu từ, chọn rãnh đĩa hay xử lý ngắt của bộ điều khiển.<br>
<b>OS như một trình quản lý tài nguyên (nhìn từ dưới lên):</b> nó quyết định <em>ai</em> được CPU, bộ nhớ, đĩa, và <em>lúc nào</em> — dồn kênh theo thời gian (CPU luân phiên giữa các tiến trình) và theo không gian (bộ nhớ chia cho chúng).<br>
Chương 2 học dồn kênh theo thời gian; Chương 3 học dồn kênh theo không gian. Đó là toàn bộ cấu trúc của môn này.</div>

<div class="pitfall"><b>OS thời gian thực không phải là "OS chạy nhanh".</b> Nó là OS <em>đoán trước được</em>: nó đảm bảo một cận trên cho thời gian đáp ứng, thường bằng cách đơn giản hơn và ít hướng thông lượng hơn Linux. Trả lời "thời gian thực nghĩa là rất nhanh" trong progress test là mất điểm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Vườn thú đang co lại thành một nhân duy nhất.</b> Linux giờ chạy cả máy chủ cỡ mainframe, chiếc Android trong túi bạn, bộ định tuyến trên bàn, bảng điều khiển ô tô và — qua các bản vá PREEMPT_RT được hợp nhất năm 2024 — cả bộ điều khiển thời gian thực cứng. Sự chia tách lịch sử vốn do ràng buộc phần cứng, mà ràng buộc đó đã teo đi; thứ còn khác nhau là <em>cấu hình</em>, không phải kiến trúc. Đó cũng là lý do học ruột Linux trong môn này chuyển giao được sang gần như mọi thiết bị bạn sẽ lập trình. <em>Ngoài giáo trình vì Tanenbaum trình bày các loại như những hệ thống riêng biệt, còn ngành công nghiệp thì đã hội tụ về một mã nguồn với các tuỳ chọn build khác nhau.</em></div>
</div>
`,
        },
        {
          title: '1.3 — Hardware review: interrupts, DMA & dual mode|||1.3 — Ôn phần cứng: ngắt, DMA & hai chế độ',
          slug: 'osg202-1-3-phan-cung',
          type: 'VIDEO',
          description: 'Phần cứng mà OS điều khiển: phân cấp bộ nhớ, cơ chế ngắt, DMA, và ranh giới kernel/user mode.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>The hardware features an OS is built on</h2>
<p class="lead">Four hardware mechanisms make a modern OS possible: the memory hierarchy, interrupts, DMA and the dual-mode CPU. Remove any one and the whole design collapses — this lesson shows exactly why.</p>

<h3>The memory hierarchy — every level is a cache for the one below</h3>
<table><thead><tr><th>Level</th><th>Typical size</th><th>Access time</th><th>Managed by</th></tr></thead><tbody>
<tr><td>Registers</td><td>a few hundred bytes</td><td>&lt; 1 ns</td><td>the compiler</td></tr>
<tr><td>L1 / L2 / L3 cache</td><td>32 KB – 32 MB</td><td>1–20 ns</td><td>hardware</td></tr>
<tr><td>Main memory (RAM)</td><td>8–64 GB</td><td>~100 ns</td><td><b>the OS</b> (Chapter 3)</td></tr>
<tr><td>SSD</td><td>0.5–4 TB</td><td>~100 µs</td><td><b>the OS</b> (Chapter 4)</td></tr>
<tr><td>Hard disk</td><td>1–20 TB</td><td>~10 ms</td><td><b>the OS</b></td></tr>
</tbody></table>
<div class="out"><b>Read the ratios, not the numbers.</b> RAM is about 1,000× slower than cache; a disk is about 100,000× slower than RAM. That is why the OS works so hard to keep the right pages in memory (page replacement, lesson 3.2) and the right blocks in the buffer cache — a single avoided disk access is worth a hundred thousand instructions of bookkeeping.</div>

<h3>Interrupts — how the hardware talks back</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>A device finishes its work and raises a signal on the interrupt line.</span></div>
  <div class="lz-fitem"><b>2</b><span>The CPU finishes the current instruction, then saves the program counter and status register.</span></div>
  <div class="lz-fitem"><b>3</b><span>It looks up the device number in the <b>interrupt vector table</b> and jumps to that handler, in kernel mode.</span></div>
  <div class="lz-fitem"><b>4</b><span>The handler services the device, marks the waiting process ready, and returns; the scheduler may now pick a different process.</span></div>
</div>
<p>Without interrupts the OS would have to <em>poll</em> — ask every device "are you done?" in a loop, burning the CPU it is trying to save. Interrupts are what make step 4 of the previous lesson (multiprogramming) possible at all.</p>

<h3>DMA — moving data without the CPU</h3>
<div class="out"><b>Without DMA:</b> to read 4 KB from disk, the CPU copies the data word by word from the controller — 1,024 loop iterations during which it can do nothing else.<br>
<b>With DMA:</b> the CPU tells the DMA controller "put 4 KB at address 0x8000", then runs another process. The DMA controller transfers the block itself and raises a single interrupt when finished.<br>
<b>Result:</b> one interrupt instead of a thousand copies. This is why a modern machine can stream from disk at gigabytes per second while remaining responsive.</div>

<h3>Dual mode — the single feature that makes an OS possible</h3>
<pre>User mode  (ring 3)  →  application code, restricted instruction set
Kernel mode (ring 0) →  OS code, all instructions, all memory</pre>
<div class="out">A mode bit in the CPU status register decides what the current instruction is allowed to do. <b>Privileged instructions</b> — accessing an I/O port, changing the page table, disabling interrupts, halting the CPU — trap if attempted in user mode.<br>
<b>The three ways to enter kernel mode:</b> a <em>system call</em> (deliberate, lesson 1.4), an <em>interrupt</em> (a device), an <em>exception/trap</em> (divide by zero, page fault, invalid instruction).<br>
<b>Remove the mode bit and any program could:</b> read another process's memory, take over the disk, or simply never give the CPU back. Every protection guarantee in this course reduces to this one hardware bit.</div>

<div class="pitfall"><b>A mode switch is not a context switch.</b> A mode switch (user → kernel → user) is cheap: tens to a few hundred nanoseconds, and the same process continues. A <em>context switch</em> changes which process runs and costs microseconds — saving registers, swapping the page table, and invalidating the TLB and caches. Confusing the two is a favourite exam trap.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Meltdown and Spectre broke the boundary in hardware.</b> In 2018 researchers showed that speculative execution — the CPU guessing ahead — leaves traces in the cache that let a user-mode program infer kernel memory it may never read. The fix (kernel page-table isolation) had to unmap the kernel from user page tables entirely, at a measurable performance cost on every system call. The lesson: a security boundary implemented in hardware can be undone by an optimisation in the same hardware. <em>Beyond syllabus because the course presents kernel/user separation as absolute, while the most important OS security story of the last decade is exactly its failure.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Những tính năng phần cứng mà OS được dựng trên đó</h2>
<p class="lead">Bốn cơ chế phần cứng làm nên một OS hiện đại: phân cấp bộ nhớ, ngắt, DMA và CPU hai chế độ. Bỏ đi bất kỳ cái nào là cả thiết kế sụp đổ — bài này chỉ rõ vì sao.</p>

<h3>Phân cấp bộ nhớ — mỗi tầng là bộ đệm cho tầng dưới</h3>
<table><thead><tr><th>Tầng</th><th>Dung lượng điển hình</th><th>Thời gian truy cập</th><th>Do ai quản lý</th></tr></thead><tbody>
<tr><td>Thanh ghi</td><td>vài trăm byte</td><td>&lt; 1 ns</td><td>trình biên dịch</td></tr>
<tr><td>Cache L1 / L2 / L3</td><td>32 KB – 32 MB</td><td>1–20 ns</td><td>phần cứng</td></tr>
<tr><td>Bộ nhớ chính (RAM)</td><td>8–64 GB</td><td>~100 ns</td><td><b>hệ điều hành</b> (Chương 3)</td></tr>
<tr><td>SSD</td><td>0,5–4 TB</td><td>~100 µs</td><td><b>hệ điều hành</b> (Chương 4)</td></tr>
<tr><td>Ổ đĩa cứng</td><td>1–20 TB</td><td>~10 ms</td><td><b>hệ điều hành</b></td></tr>
</tbody></table>
<div class="out"><b>Hãy đọc tỉ lệ, đừng đọc con số.</b> RAM chậm hơn cache khoảng 1.000 lần; đĩa chậm hơn RAM khoảng 100.000 lần. Vì thế OS làm việc cật lực để giữ đúng những trang cần thiết trong bộ nhớ (thay trang, bài 3.2) và đúng những khối cần thiết trong bộ đệm — một lần tránh được truy cập đĩa đáng giá cả trăm nghìn lệnh tính toán sổ sách.</div>

<h3>Ngắt — cách phần cứng nói chuyện ngược lại</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Thiết bị làm xong việc và phát tín hiệu lên đường ngắt.</span></div>
  <div class="lz-fitem"><b>2</b><span>CPU chạy nốt lệnh hiện tại rồi lưu con trỏ lệnh và thanh ghi trạng thái.</span></div>
  <div class="lz-fitem"><b>3</b><span>Nó tra số hiệu thiết bị trong <b>bảng véc-tơ ngắt</b> rồi nhảy tới hàm xử lý đó, ở chế độ nhân.</span></div>
  <div class="lz-fitem"><b>4</b><span>Hàm xử lý phục vụ thiết bị, đánh dấu tiến trình đang chờ là sẵn sàng, rồi trở về; bộ lập lịch lúc này có thể chọn một tiến trình khác.</span></div>
</div>
<p>Không có ngắt thì OS phải <em>hỏi vòng</em> — chạy vòng lặp hỏi từng thiết bị "xong chưa?", đốt đúng cái CPU mà nó đang cố tiết kiệm. Chính ngắt làm cho bước 4 của bài trước (đa chương) trở nên khả thi.</p>

<h3>DMA — chuyển dữ liệu mà không cần CPU</h3>
<div class="out"><b>Không có DMA:</b> để đọc 4 KB từ đĩa, CPU phải chép dữ liệu từng từ máy một từ bộ điều khiển — 1.024 vòng lặp mà trong đó nó không làm được gì khác.<br>
<b>Có DMA:</b> CPU bảo bộ điều khiển DMA "đặt 4 KB vào địa chỉ 0x8000", rồi chạy tiến trình khác. Bộ điều khiển DMA tự chuyển cả khối và chỉ phát một ngắt khi xong.<br>
<b>Kết quả:</b> một ngắt thay vì một nghìn lần chép. Đó là lý do máy hiện đại vừa đọc đĩa hàng gigabyte mỗi giây vừa vẫn phản hồi mượt.</div>

<h3>Hai chế độ — tính năng duy nhất khiến OS tồn tại được</h3>
<pre>Chế độ người dùng (ring 3)  →  mã ứng dụng, tập lệnh bị hạn chế
Chế độ nhân      (ring 0)  →  mã OS, mọi lệnh, mọi vùng nhớ</pre>
<div class="out">Một bit chế độ trong thanh ghi trạng thái CPU quyết định lệnh hiện tại được phép làm gì. <b>Lệnh đặc quyền</b> — truy cập cổng I/O, đổi bảng trang, tắt ngắt, dừng CPU — sẽ bị bẫy nếu bị gọi ở chế độ người dùng.<br>
<b>Ba cách vào chế độ nhân:</b> một <em>lời gọi hệ thống</em> (chủ động, bài 1.4), một <em>ngắt</em> (từ thiết bị), một <em>ngoại lệ/bẫy</em> (chia cho 0, lỗi trang, lệnh không hợp lệ).<br>
<b>Bỏ bit chế độ đi thì mọi chương trình đều có thể:</b> đọc bộ nhớ của tiến trình khác, chiếm lấy đĩa, hoặc đơn giản là không bao giờ trả CPU lại. Mọi đảm bảo bảo vệ trong môn này đều quy về đúng một bit phần cứng này.</div>

<div class="pitfall"><b>Chuyển chế độ không phải là chuyển ngữ cảnh.</b> Chuyển chế độ (người dùng → nhân → người dùng) thì rẻ: vài chục tới vài trăm na-nô-giây, và vẫn là tiến trình đó chạy tiếp. Còn <em>chuyển ngữ cảnh</em> đổi hẳn tiến trình đang chạy và tốn micro-giây — lưu thanh ghi, tráo bảng trang, và làm mất hiệu lực TLB cùng các cache. Nhầm hai khái niệm này là cái bẫy thi rất được ưa chuộng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Meltdown và Spectre đã phá ranh giới đó ngay trong phần cứng.</b> Năm 2018, các nhà nghiên cứu chỉ ra rằng thực thi suy đoán — việc CPU đoán trước — để lại dấu vết trong cache, đủ để một chương trình ở chế độ người dùng suy ra nội dung bộ nhớ nhân mà nó không bao giờ được đọc. Cách vá (cô lập bảng trang nhân) buộc phải gỡ hẳn ánh xạ nhân khỏi bảng trang người dùng, với cái giá hiệu năng đo được ở mọi lời gọi hệ thống. Bài học: một ranh giới an ninh cài trong phần cứng có thể bị vô hiệu bởi một phép tối ưu của chính phần cứng đó. <em>Ngoài giáo trình vì môn học trình bày ranh giới nhân/người dùng như tuyệt đối, trong khi câu chuyện an ninh OS quan trọng nhất thập kỷ qua lại chính là sự đổ vỡ của nó.</em></div>
</div>
`,
        },
        {
          title: '1.4 — System calls & OS architectures|||1.4 — Lời gọi hệ thống & kiến trúc hệ điều hành',
          slug: 'osg202-1-4-syscall-kien-truc',
          type: 'VIDEO',
          description: 'Đường đi của một lời gọi read() từ user tới kernel, và bốn kiểu kiến trúc nhân (monolithic → microkernel).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>The only door into the kernel</h2>
<p class="lead">A user program cannot touch hardware. Everything it needs — open a file, create a process, send a packet — goes through a <strong>system call</strong>: a deliberate, controlled trap into kernel mode. There are about 350 of them in Linux, and they all work the same way.</p>

<h3>What actually happens in <span class="badge">read(fd, buf, 100)</span></h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1 · library</b><span>Your C call enters glibc's <span class="badge">read()</span> wrapper.</span></div>
  <div class="lz-fitem"><b>2 · registers</b><span>The wrapper puts the syscall number (0 for read) in RAX and the arguments in RDI, RSI, RDX.</span></div>
  <div class="lz-fitem"><b>3 · trap</b><span>It executes the <span class="badge">syscall</span> instruction: the CPU switches to kernel mode and jumps to a fixed entry point.</span></div>
  <div class="lz-fitem"><b>4 · dispatch</b><span>The kernel indexes the syscall table by RAX and calls <span class="badge">sys_read</span>.</span></div>
  <div class="lz-fitem"><b>5 · work</b><span>It validates the arguments, finds the file, may block the process while the disk works, and copies data into your buffer.</span></div>
  <div class="lz-fitem"><b>6 · return</b><span>The return value goes in RAX, the CPU switches back to user mode, and your program continues.</span></div>
</div>
<div class="out"><b>Validation in step 5 is not a formality.</b> The kernel must check that <span class="badge">buf</span> really belongs to the calling process — otherwise a program could pass a kernel address and have the kernel happily write data there. Every argument crossing the boundary is untrusted input, which is why most kernel vulnerabilities are found in exactly this checking code.</div>

<h3>The families of calls you will use</h3>
<table><thead><tr><th>Area</th><th>Calls</th><th>Chapter</th></tr></thead><tbody>
<tr><td>Processes</td><td><span class="badge">fork</span>, <span class="badge">exec</span>, <span class="badge">wait</span>, <span class="badge">exit</span>, <span class="badge">kill</span></td><td>2</td></tr>
<tr><td>Files</td><td><span class="badge">open</span>, <span class="badge">read</span>, <span class="badge">write</span>, <span class="badge">close</span>, <span class="badge">lseek</span>, <span class="badge">stat</span></td><td>4</td></tr>
<tr><td>Directories</td><td><span class="badge">mkdir</span>, <span class="badge">rmdir</span>, <span class="badge">link</span>, <span class="badge">unlink</span>, <span class="badge">chdir</span></td><td>4</td></tr>
<tr><td>Memory</td><td><span class="badge">brk</span>, <span class="badge">mmap</span>, <span class="badge">munmap</span></td><td>3</td></tr>
<tr><td>IPC</td><td><span class="badge">pipe</span>, <span class="badge">signal</span>, <span class="badge">shmget</span>, <span class="badge">semop</span></td><td>2</td></tr>
</tbody></table>

<h3>See it yourself — the two commands worth remembering</h3>
<pre><span class="tok-comment"># every system call a program makes, in order</span>
strace ls
<span class="tok-comment"># → execve, brk, openat("/etc/ld.so.cache"), mmap, openat("."), getdents64, write, exit_group</span>

<span class="tok-comment"># count them instead of listing them</span>
strace -c ls</pre>
<p>Running <span class="badge">strace</span> on a "simple" command is the fastest way to understand that everything you do is a system call — and the fastest way to debug "why does my program not find that file?".</p>

<h3>Four kernel architectures</h3>
<table><thead><tr><th>Design</th><th>Idea</th><th>Trade-off</th><th>Example</th></tr></thead><tbody>
<tr><td><b>Monolithic</b></td><td>the whole OS is one program in kernel mode</td><td>fast (no boundary crossings) · a driver bug crashes everything</td><td>Linux, classic UNIX</td></tr>
<tr><td><b>Layered</b></td><td>strict levels, each using only the one below</td><td>clean · rigid, and layering is hard to keep true</td><td>THE, MULTICS</td></tr>
<tr><td><b>Microkernel</b></td><td>only IPC, scheduling and basic memory in the kernel; drivers and file systems are user processes</td><td><b>very robust</b> (a crashed driver restarts) · message passing costs performance</td><td>MINIX 3, QNX, seL4</td></tr>
<tr><td><b>Hybrid / modular</b></td><td>monolithic core plus loadable modules</td><td>the practical compromise</td><td>Windows NT, macOS (XNU), Linux with modules</td></tr>
</tbody></table>
<div class="out"><b>The famous argument.</b> In 1992 Tanenbaum told Linus Torvalds that a monolithic kernel was "a giant step back into the 1970s". Linux won the market on performance and hardware support; MINIX 3 and seL4 won the argument on reliability, and seL4 — formally verified — now runs in aircraft and defence systems. Both were right about different priorities, which is exactly the point of comparing architectures.<br>
<b>Linux is not purely monolithic today:</b> <span class="badge">lsmod</span> lists dozens of modules that can be loaded and unloaded at run time, and FUSE lets a file system run entirely in user space — a microkernel idea inside a monolithic kernel.</div>

<div class="pitfall"><b>A library call is not a system call.</b> <span class="badge">printf()</span> is C library code that formats a string and <em>then</em> calls <span class="badge">write()</span>; <span class="badge">strlen()</span> never enters the kernel at all. This matters for performance: buffering in the library means one <span class="badge">write</span> for many <span class="badge">printf</span>s — and it is why output can appear "lost" if the program crashes before the buffer is flushed.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>io_uring: batching syscalls away.</b> At high load the mode switches themselves become the bottleneck — a web server doing a million small reads per second pays a million transitions. Linux's <span class="badge">io_uring</span> (2019) replaces them with two shared ring buffers: the application appends requests and reads completions in ordinary memory, and the kernel picks them up without a trap per operation. Databases and proxies report 2–3× throughput gains. <em>Beyond syllabus because the course presents the syscall as free, while at scale its cost is what modern kernel interfaces are designed to remove.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Cánh cửa duy nhất đi vào nhân</h2>
<p class="lead">Chương trình người dùng không được chạm vào phần cứng. Mọi thứ nó cần — mở tệp, tạo tiến trình, gửi gói tin — đều đi qua một <strong>lời gọi hệ thống</strong>: một cú bẫy chủ động, có kiểm soát, vào chế độ nhân. Linux có khoảng 350 lời gọi như vậy, và tất cả đều hoạt động theo cùng một cách.</p>

<h3>Chuyện thật sự xảy ra trong <span class="badge">read(fd, buf, 100)</span></h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1 · thư viện</b><span>Lời gọi C của bạn đi vào hàm bọc <span class="badge">read()</span> của glibc.</span></div>
  <div class="lz-fitem"><b>2 · thanh ghi</b><span>Hàm bọc đặt số hiệu lời gọi (0 cho read) vào RAX và các tham số vào RDI, RSI, RDX.</span></div>
  <div class="lz-fitem"><b>3 · bẫy</b><span>Nó thi hành lệnh <span class="badge">syscall</span>: CPU chuyển sang chế độ nhân và nhảy tới một điểm vào cố định.</span></div>
  <div class="lz-fitem"><b>4 · điều phối</b><span>Nhân tra bảng lời gọi theo RAX rồi gọi <span class="badge">sys_read</span>.</span></div>
  <div class="lz-fitem"><b>5 · làm việc</b><span>Nó kiểm tra tham số, tìm tệp, có thể chặn tiến trình lại trong lúc đĩa làm việc, rồi chép dữ liệu vào vùng đệm của bạn.</span></div>
  <div class="lz-fitem"><b>6 · trở về</b><span>Giá trị trả về đặt vào RAX, CPU quay lại chế độ người dùng, chương trình của bạn chạy tiếp.</span></div>
</div>
<div class="out"><b>Việc kiểm tra ở bước 5 không phải thủ tục hình thức.</b> Nhân bắt buộc phải kiểm rằng <span class="badge">buf</span> thật sự thuộc về tiến trình gọi — nếu không, một chương trình có thể truyền vào một địa chỉ của nhân và nhân sẽ vui vẻ ghi dữ liệu vào đó. Mọi tham số vượt qua ranh giới đều là đầu vào không tin cậy, và đó là lý do phần lớn lỗ hổng nhân được tìm thấy đúng trong đoạn mã kiểm tra này.</div>

<h3>Các nhóm lời gọi bạn sẽ dùng</h3>
<table><thead><tr><th>Mảng</th><th>Lời gọi</th><th>Chương</th></tr></thead><tbody>
<tr><td>Tiến trình</td><td><span class="badge">fork</span>, <span class="badge">exec</span>, <span class="badge">wait</span>, <span class="badge">exit</span>, <span class="badge">kill</span></td><td>2</td></tr>
<tr><td>Tệp</td><td><span class="badge">open</span>, <span class="badge">read</span>, <span class="badge">write</span>, <span class="badge">close</span>, <span class="badge">lseek</span>, <span class="badge">stat</span></td><td>4</td></tr>
<tr><td>Thư mục</td><td><span class="badge">mkdir</span>, <span class="badge">rmdir</span>, <span class="badge">link</span>, <span class="badge">unlink</span>, <span class="badge">chdir</span></td><td>4</td></tr>
<tr><td>Bộ nhớ</td><td><span class="badge">brk</span>, <span class="badge">mmap</span>, <span class="badge">munmap</span></td><td>3</td></tr>
<tr><td>Liên tiến trình</td><td><span class="badge">pipe</span>, <span class="badge">signal</span>, <span class="badge">shmget</span>, <span class="badge">semop</span></td><td>2</td></tr>
</tbody></table>

<h3>Tự nhìn thấy — hai lệnh đáng nhớ</h3>
<pre><span class="tok-comment"># mọi lời gọi hệ thống một chương trình thực hiện, theo thứ tự</span>
strace ls
<span class="tok-comment"># → execve, brk, openat("/etc/ld.so.cache"), mmap, openat("."), getdents64, write, exit_group</span>

<span class="tok-comment"># đếm thay vì liệt kê</span>
strace -c ls</pre>
<p>Chạy <span class="badge">strace</span> trên một lệnh "đơn giản" là cách nhanh nhất để hiểu rằng mọi thứ bạn làm đều là lời gọi hệ thống — và cũng là cách nhanh nhất để gỡ lỗi "sao chương trình của em không tìm thấy tệp đó?".</p>

<h3>Bốn kiểu kiến trúc nhân</h3>
<table><thead><tr><th>Thiết kế</th><th>Ý tưởng</th><th>Đánh đổi</th><th>Ví dụ</th></tr></thead><tbody>
<tr><td><b>Nguyên khối</b></td><td>cả OS là một chương trình chạy ở chế độ nhân</td><td>nhanh (không phải vượt ranh giới) · một lỗi trình điều khiển làm sập tất cả</td><td>Linux, UNIX cổ điển</td></tr>
<tr><td><b>Phân tầng</b></td><td>các tầng nghiêm ngặt, mỗi tầng chỉ dùng tầng ngay dưới</td><td>sạch sẽ · cứng nhắc, và rất khó giữ đúng phân tầng</td><td>THE, MULTICS</td></tr>
<tr><td><b>Vi nhân</b></td><td>nhân chỉ có IPC, lập lịch và bộ nhớ cơ bản; trình điều khiển và hệ thống tệp là tiến trình người dùng</td><td><b>rất bền</b> (trình điều khiển sập thì khởi động lại) · truyền thông điệp tốn hiệu năng</td><td>MINIX 3, QNX, seL4</td></tr>
<tr><td><b>Lai / mô-đun</b></td><td>lõi nguyên khối cộng các mô-đun nạp được</td><td>giải pháp dung hoà thực dụng</td><td>Windows NT, macOS (XNU), Linux có mô-đun</td></tr>
</tbody></table>
<div class="out"><b>Cuộc tranh luận nổi tiếng.</b> Năm 1992 Tanenbaum nói với Linus Torvalds rằng nhân nguyên khối là "một bước lùi khổng lồ về thập niên 1970". Linux thắng thị trường nhờ hiệu năng và hỗ trợ phần cứng; MINIX 3 và seL4 thắng cuộc tranh luận về độ tin cậy, và seL4 — đã được chứng minh hình thức — nay chạy trong máy bay và hệ thống quốc phòng. Cả hai đều đúng với những ưu tiên khác nhau, và đó chính là ý nghĩa của việc so sánh kiến trúc.<br>
<b>Linux ngày nay không còn thuần nguyên khối:</b> lệnh <span class="badge">lsmod</span> liệt kê hàng chục mô-đun nạp/gỡ được lúc chạy, còn FUSE cho phép một hệ thống tệp chạy hoàn toàn ở không gian người dùng — một ý tưởng vi nhân nằm bên trong nhân nguyên khối.</div>

<div class="pitfall"><b>Lời gọi thư viện không phải lời gọi hệ thống.</b> <span class="badge">printf()</span> là mã thư viện C: nó định dạng chuỗi rồi <em>sau đó</em> mới gọi <span class="badge">write()</span>; còn <span class="badge">strlen()</span> không hề vào nhân. Điều này quan trọng với hiệu năng: thư viện gom đệm nên nhiều lệnh <span class="badge">printf</span> chỉ tốn một lần <span class="badge">write</span> — và đó cũng là lý do đầu ra có thể "mất" nếu chương trình sập trước khi vùng đệm được xả.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>io_uring: gom lời gọi hệ thống lại để khỏi phải gọi.</b> Ở tải cao, chính các lần chuyển chế độ trở thành nút thắt — một máy chủ web làm một triệu lần đọc nhỏ mỗi giây phải trả một triệu lần chuyển. Cơ chế <span class="badge">io_uring</span> của Linux (2019) thay chúng bằng hai vòng đệm dùng chung: ứng dụng ghi thêm yêu cầu và đọc kết quả ngay trên bộ nhớ thường, còn nhân tự lấy về mà không cần một cú bẫy cho mỗi thao tác. Các cơ sở dữ liệu và proxy báo cáo thông lượng tăng 2–3 lần. <em>Ngoài giáo trình vì môn học trình bày lời gọi hệ thống như thể miễn phí, trong khi ở quy mô lớn, chi phí của nó chính là thứ mà các giao diện nhân hiện đại được thiết kế để loại bỏ.</em></div>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'osg202-quiz-ch1',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: vai trò OS, kernel, system call, user/kernel space.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The two roles of an OS are resource manager and…|||Hai vai trò của OS là quản lý tài nguyên và…', options: ['a web server|||một máy chủ web', 'an extended machine (hiding hardware)|||một cỗ máy mở rộng (giấu phần cứng)', 'a compiler|||một trình biên dịch', 'a database|||một cơ sở dữ liệu'], correctIndex: 1, points: 1 },
              { question: 'The core of the OS that runs in privileged mode is the…|||Lõi của OS chạy ở chế độ đặc quyền là…', options: ['shell|||shell', 'kernel|||kernel', 'compiler|||trình biên dịch', 'application|||ứng dụng'], correctIndex: 1, points: 1 },
              { question: 'A system call is…|||Một system call là…', options: ['a phone call|||một cuộc gọi điện', 'a controlled request from a program to the kernel|||một yêu cầu có kiểm soát từ chương trình tới kernel', 'a hardware interrupt only|||chỉ một ngắt phần cứng', 'a shell command|||một lệnh shell'], correctIndex: 1, points: 1 },
              { question: 'Why can a user program NOT touch hardware directly?|||Vì sao một chương trình người dùng KHÔNG chạm phần cứng trực tiếp?', options: ['it is too slow|||nó quá chậm', 'for safety/protection — it must go through the kernel|||vì an toàn/bảo vệ — phải qua kernel', 'hardware does not exist|||phần cứng không tồn tại', 'it is illegal to code|||viết code là phi pháp'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — TIẾN TRÌNH & LUỒNG ══════════════════ */
    {
      title: 'Chapter 2 — Processes & Threads|||Chương 2 — Tiến trình & Luồng',
      description: 'Tiến trình, trạng thái, lập lịch CPU, luồng và đồng bộ hoá.',
      lessons: [
        {
          title: '2.1 — Processes & CPU scheduling|||2.1 — Tiến trình & lập lịch CPU',
          slug: 'osg202-2-1-tien-trinh-lap-lich',
          simulation: {
            url: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-2-1-tien-trinh-lap-lich.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-2-1-tien-trinh-lap-lich.jpg',
            scenario: 'cpu-scheduling',
            durationSeconds: 21,
            caption: { en: "FCFS, SJF and round-robin on the same five processes", vi: "FCFS, SJF và round-robin trên cùng năm tiến trình" },
          },
          type: 'VIDEO',
          description: 'Trạng thái tiến trình, chuyển ngữ cảnh và các thuật toán lập lịch.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Processes — programs in action</h2>
<p class="lead">A <strong>process</strong> (CLO2) is a program in execution — with its own memory, registers and state. The OS juggles many processes on limited CPUs, giving the illusion that all run at once.</p>
<h3>Process states</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Ready</div><div class="lz-t">waiting for CPU</div><div class="lz-d">could run now</div></div>
  <div class="lz-step"><div class="lz-k">Running</div><div class="lz-t">on the CPU</div><div class="lz-d">executing</div></div>
  <div class="lz-step"><div class="lz-k">Blocked</div><div class="lz-t">waiting for I/O</div><div class="lz-d">cannot proceed yet</div></div>
</div>
<p>Switching the CPU from one process to another is a <strong>context switch</strong>: the OS saves the current process&#39;s registers and loads the next one&#39;s. It is fast but not free — too much switching wastes time.</p>
<h3>CPU scheduling algorithms</h3>
<table>
  <thead><tr><th>Algorithm</th><th>Idea</th></tr></thead>
  <tbody>
    <tr><td>FCFS (First-Come First-Served)</td><td>Run in arrival order. Simple but a long job blocks everyone.</td></tr>
    <tr><td>SJF (Shortest Job First)</td><td>Run the shortest job next — optimal average wait, but needs to know job lengths.</td></tr>
    <tr><td>Round Robin</td><td>Each process gets a fixed time slice, then rotates. Fair &amp; responsive — used in interactive systems.</td></tr>
    <tr><td>Priority</td><td>Higher-priority processes run first.</td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">The three timings every scheduling question asks for</span>Waiting time = Turnaround time − Burst time<br>Turnaround time = Completion time − Arrival time<br>Average waiting time = (Σ waiting time of all processes) / n</div>
<h3>Worked example · FCFS vs SJF (non-preemptive)</h3>
<div class="out"><b>Given</b> (arrival, burst): P1 (0, 7), P2 (1, 4), P3 (2, 1), P4 (3, 4).<br><b>FCFS (arrival order: P1, P2, P3, P4):</b><br>Gantt: P1 [0–7] · P2 [7–11] · P3 [11–12] · P4 [12–16]<br>Waiting = Start − Arrival: P1=0, P2=7−1=6, P3=11−2=9, P4=12−3=9<br><b>Average waiting time = (0+6+9+9)/4 = 6.0</b><br><br><b>SJF non-preemptive (at each free moment, pick the shortest job that has arrived):</b><br>t=0: only P1 ready → run P1 [0–7]. At t=7 all of P2,P3,P4 have arrived (bursts 4,1,4) → shortest is P3 [7–8], then P2 or P4 tie at 4 → P2 [8–12], P4 [12–16].<br>Waiting: P1=0, P3=7−2=5, P2=8−1=7, P4=12−3=9<br><b>Average waiting time = (0+5+7+9)/4 = 5.25</b><br><b>Conclusion:</b> SJF beats FCFS here (5.25 &lt; 6.0) — this is provably true in general (SJF is optimal for average waiting time), the reason textbooks call it "optimal" despite needing to know burst times in advance.</div>
<div class="pitfall">A very common mistake: computing waiting time as <em>Completion − Arrival</em> (that is turnaround time, not waiting time) — always subtract the burst time too: <code>Waiting = Turnaround − Burst</code>.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Linux does not use plain Round Robin — it uses CFS.</b> Since 2007 the <strong>Completely Fair Scheduler (CFS)</strong> has tracked each task's <em>virtual runtime</em> in a red-black tree and always run the task that has received the least CPU so far — approximating perfectly fair sharing without fixed time slices. (Kernel 6.6 replaced it with EEVDF, a refinement of the same fairness idea.) <em>The syllabus teaches FCFS/SJF/RR as clean models; production schedulers are far more sophisticated.</em></div>
<div class="note-ct">The scheduler is why your laptop feels like it runs everything at once (CSI104). Round Robin, driven by the timer interrupt (CEA201), keeps interactive programs responsive. See it live: run <code>top</code> in Linux to watch processes and their states.</div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Foperating-systems%2Flearn&reflabel=OSG202%20%E2%80%94%20Operating%20Systems#module-483" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Watch real processes</span><span class="lc-sub">The "Process Management &amp; System Monitoring" module — ps, top, kill.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Tiến trình — chương trình đang chạy</h2>
<p class="lead">Một <strong>tiến trình (process)</strong> (CLO2) là một chương trình đang thực thi — với bộ nhớ, thanh ghi và trạng thái riêng. OS tung hứng nhiều tiến trình trên số CPU giới hạn, tạo ảo giác rằng tất cả chạy cùng lúc.</p>
<h3>Các trạng thái tiến trình</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Sẵn sàng (Ready)</div><div class="lz-t">chờ CPU</div><div class="lz-d">có thể chạy ngay</div></div>
  <div class="lz-step"><div class="lz-k">Đang chạy (Running)</div><div class="lz-t">trên CPU</div><div class="lz-d">đang thực thi</div></div>
  <div class="lz-step"><div class="lz-k">Bị chặn (Blocked)</div><div class="lz-t">chờ I/O</div><div class="lz-d">chưa tiến được</div></div>
</div>
<p>Chuyển CPU từ tiến trình này sang tiến trình khác là một <strong>chuyển ngữ cảnh (context switch)</strong>: OS lưu thanh ghi của tiến trình hiện tại và nạp của tiến trình kế. Nhanh nhưng không miễn phí — chuyển quá nhiều phí thời gian.</p>
<h3>Các thuật toán lập lịch CPU</h3>
<table>
  <thead><tr><th>Thuật toán</th><th>Ý tưởng</th></tr></thead>
  <tbody>
    <tr><td>FCFS (Đến trước phục vụ trước)</td><td>Chạy theo thứ tự đến. Đơn giản nhưng một job dài chặn mọi người.</td></tr>
    <tr><td>SJF (Job ngắn nhất trước)</td><td>Chạy job ngắn nhất kế tiếp — thời gian chờ trung bình tối ưu, nhưng cần biết độ dài job.</td></tr>
    <tr><td>Round Robin (xoay vòng)</td><td>Mỗi tiến trình được một lát thời gian cố định, rồi xoay. Công bằng &amp; phản hồi nhanh — dùng trong hệ tương tác.</td></tr>
    <tr><td>Ưu tiên (Priority)</td><td>Tiến trình ưu tiên cao chạy trước.</td></tr>
  </tbody>
</table>
<div class="formula"><span class="lbl">Ba thời gian mọi bài lập lịch đều hỏi</span>Thời gian chờ = Thời gian hoàn tất − Thời gian burst<br>Thời gian hoàn tất = Thời điểm xong − Thời điểm đến<br>Thời gian chờ trung bình = (Σ thời gian chờ mọi tiến trình) / n</div>
<h3>Ví dụ có lời giải · FCFS vs SJF (không ưu tiên trước)</h3>
<div class="out"><b>Đề bài</b> (đến, burst): P1 (0, 7), P2 (1, 4), P3 (2, 1), P4 (3, 4).<br><b>FCFS (theo thứ tự đến: P1, P2, P3, P4):</b><br>Gantt: P1 [0–7] · P2 [7–11] · P3 [11–12] · P4 [12–16]<br>Chờ = Bắt đầu − Đến: P1=0, P2=7−1=6, P3=11−2=9, P4=12−3=9<br><b>Thời gian chờ trung bình = (0+6+9+9)/4 = 6.0</b><br><br><b>SJF không ưu tiên trước (tại mỗi thời điểm rảnh, chọn job ngắn nhất đã đến):</b><br>t=0: chỉ P1 sẵn sàng → chạy P1 [0–7]. Tại t=7 cả P2,P3,P4 đã đến (burst 4,1,4) → ngắn nhất là P3 [7–8], rồi P2 hoặc P4 hòa 4 → P2 [8–12], P4 [12–16].<br>Chờ: P1=0, P3=7−2=5, P2=8−1=7, P4=12−3=9<br><b>Thời gian chờ trung bình = (0+5+7+9)/4 = 5.25</b><br><b>Kết luận:</b> SJF thắng FCFS ở đây (5.25 &lt; 6.0) — điều này đúng nói chung có thể chứng minh (SJF tối ưu thời gian chờ trung bình), lý do sách gọi nó "tối ưu" dù cần biết trước độ dài burst.</div>
<div class="pitfall">Lỗi rất hay gặp: tính thời gian chờ bằng <em>Hoàn tất − Đến</em> (đó là thời gian hoàn tất, không phải thời gian chờ) — luôn trừ thêm burst: <code>Chờ = Hoàn tất − Burst</code>.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Linux không dùng Round Robin thuần — nó dùng CFS.</b> Từ 2007 <strong>Completely Fair Scheduler (CFS)</strong> theo dõi <em>virtual runtime</em> của mỗi tác vụ trong một cây đỏ-đen và luôn chạy tác vụ đã nhận ít CPU nhất — xấp xỉ chia sẻ hoàn toàn công bằng mà không cần lát thời gian cố định. (Kernel 6.6 thay bằng EEVDF, một tinh chỉnh của cùng ý tưởng công bằng.) <em>Syllabus dạy FCFS/SJF/RR như các mô hình gọn; bộ lập lịch thật phức tạp hơn nhiều.</em></div>
<div class="note-ct">Bộ lập lịch là lý do laptop cảm thấy chạy mọi thứ cùng lúc (CSI104). Round Robin, dẫn bởi ngắt timer (CEA201), giữ chương trình tương tác phản hồi nhanh. Xem trực tiếp: chạy <code>top</code> trong Linux để xem tiến trình và trạng thái.</div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Foperating-systems%2Flearn&reflabel=OSG202%20%E2%80%94%20Operating%20Systems#module-483" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Xem tiến trình thật</span><span class="lc-sub">Module "Process Management &amp; System Monitoring" — ps, top, kill.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '2.2 — Threads & synchronization|||2.2 — Luồng & đồng bộ hoá',
          slug: 'osg202-2-2-luong-dong-bo',
          simulation: {
            url: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-2-2-luong-dong-bo.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-2-2-luong-dong-bo.jpg',
            scenario: 'cpu-scheduling',
            durationSeconds: 25,
            caption: { en: "Round-robin: the quantum, and what a context switch costs", vi: "Round-robin: lượng tử thời gian và giá của một lần chuyển ngữ cảnh" },
          },
          type: 'VIDEO',
          description: 'Luồng, tranh chấp (race condition) và mutex/semaphore.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Threads &amp; the danger of sharing</h2>
<p class="lead">A <strong>thread</strong> is a lightweight unit of execution <em>inside</em> a process — multiple threads share the same memory and run concurrently. Threads make programs faster on multicore CPUs, but sharing memory creates a serious problem: <strong>race conditions</strong>.</p>
<h3>The race condition</h3>
<p>If two threads update the same variable at the same time, the result can be wrong. Imagine two threads both doing <code>balance = balance + 100</code>: if they interleave badly, one update is lost.</p>
<div class="out"><b>The critical section problem:</b> code that touches shared data must be run by <em>only one thread at a time</em>, or data corrupts.</div>
<h3>Synchronization tools</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Mutex (lock)</div><div class="lz-ld">A lock that only one thread can hold. Lock before the critical section, unlock after — others wait their turn.</div></div>
  <div class="lz-layer"><div class="lz-lt">Semaphore</div><div class="lz-ld">A counter that controls access for up to N threads. Solves classic problems like producer-consumer.</div></div>
</div>
<div class="pitfall">Locks solve race conditions but introduce new risks: forget to unlock and everyone waits forever; lock in the wrong order and you get <strong>deadlock</strong> (Chapter 6). Concurrency is powerful but subtle — one of the hardest topics in all of programming.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Priority inversion froze a Mars rover.</b> Locks can misbehave subtly: a low-priority thread holds a lock a high-priority thread needs, while a medium-priority thread starves the low one — so the important task waits on the unimportant one. This actually kept resetting NASA's <strong>Mars Pathfinder</strong> lander in 1997; the fix was enabling <em>priority inheritance</em> on the mutex. <em>The syllabus stops at "use a mutex"; this shows how locks interact with the scheduler, via a famous real failure.</em></div>
<div class="note-ct">This is the OS foundation of the multithreading you meet in Java (PRO192) and every server. The OS provides the locks and semaphores; using them correctly is the programmer&#39;s art.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Luồng &amp; hiểm hoạ chia sẻ</h2>
<p class="lead">Một <strong>luồng (thread)</strong> là một đơn vị thực thi nhẹ <em>bên trong</em> một tiến trình — nhiều luồng chia sẻ cùng bộ nhớ và chạy đồng thời. Luồng làm chương trình nhanh hơn trên CPU đa nhân, nhưng chia sẻ bộ nhớ tạo một vấn đề nghiêm trọng: <strong>tranh chấp (race condition)</strong>.</p>
<h3>Tranh chấp (race condition)</h3>
<p>Nếu hai luồng cập nhật cùng một biến cùng lúc, kết quả có thể sai. Hình dung hai luồng cùng làm <code>balance = balance + 100</code>: nếu chúng xen kẽ tệ, một cập nhật bị mất.</p>
<div class="out"><b>Bài toán vùng tới hạn (critical section):</b> code chạm dữ liệu chia sẻ phải được chạy bởi <em>chỉ một luồng tại một thời điểm</em>, nếu không dữ liệu hỏng.</div>
<h3>Công cụ đồng bộ hoá</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Mutex (khoá)</div><div class="lz-ld">Một khoá mà chỉ một luồng giữ được. Khoá trước vùng tới hạn, mở sau — các luồng khác chờ tới lượt.</div></div>
  <div class="lz-layer"><div class="lz-lt">Semaphore</div><div class="lz-ld">Một bộ đếm kiểm soát truy cập cho tối đa N luồng. Giải các bài kinh điển như producer-consumer.</div></div>
</div>
<div class="pitfall">Khoá giải tranh chấp nhưng đưa vào rủi ro mới: quên mở khoá thì mọi người chờ mãi; khoá sai thứ tự thì gặp <strong>deadlock</strong> (Chương 6). Đồng thời mạnh nhưng tinh tế — một trong những chủ đề khó nhất của lập trình.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Đảo ngược ưu tiên từng làm treo robot Sao Hỏa.</b> Khoá có thể trục trặc tinh vi: một luồng ưu tiên thấp giữ khoá mà luồng ưu tiên cao cần, trong khi một luồng ưu tiên trung bình bỏ đói luồng thấp — nên tác vụ quan trọng phải chờ tác vụ không quan trọng. Điều này liên tục làm reset tàu đổ bộ <strong>Mars Pathfinder</strong> của NASA năm 1997; cách sửa là bật <em>kế thừa ưu tiên (priority inheritance)</em> trên mutex. <em>Syllabus dừng ở "dùng mutex"; đây cho thấy khoá tương tác với bộ lập lịch ra sao, qua một sự cố thật nổi tiếng.</em></div>
<div class="note-ct">Đây là nền OS của đa luồng bạn gặp trong Java (PRO192) và mọi máy chủ. OS cung cấp khoá và semaphore; dùng chúng đúng là nghệ thuật của lập trình viên.</div>
</div>
`,
        },
        {
          title: '2.3 — Process states, the PCB & fork/exec|||2.3 — Trạng thái tiến trình, PCB & fork/exec',
          slug: 'osg202-2-3-fork-exec',
          type: 'VIDEO',
          description: 'Năm trạng thái, những gì PCB lưu, và cách UNIX tạo tiến trình bằng fork + exec — có code C chạy được.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>How a process is born, lives and dies</h2>
<p class="lead">A program is a file on disk; a <strong>process</strong> is that program in execution, with its own memory, registers and open files. This lesson covers the states it moves through, the structure the kernel keeps for it, and the two calls that create it.</p>

<h3>The five states</h3>
<div class="diagram">           admitted        dispatch          exit
   [NEW] ──────────→ [READY] ────────→ [RUNNING] ────→ [TERMINATED]
                        ↑  ↖ timeout/preempt  │
                        │                     │ I/O or wait
                        └──── I/O done ── [BLOCKED] ←┘</div>
<div class="out"><b>The transition students get wrong:</b> BLOCKED never goes straight to RUNNING. When the disk finishes, the process becomes <em>ready</em> — it must still be chosen by the scheduler. Drawing an arrow from BLOCKED to RUNNING is an instant lost mark.<br>
<b>Two ways to leave RUNNING:</b> voluntarily (a system call that blocks) or involuntarily (the timer interrupt preempts it, lesson 2.4).</div>

<h3>The Process Control Block — what a "process" really is to the kernel</h3>
<table><thead><tr><th>Group</th><th>Contents</th></tr></thead><tbody>
<tr><td>Identity</td><td>PID, parent PID, user/group id</td></tr>
<tr><td>CPU state</td><td>program counter, stack pointer, all registers, status word</td></tr>
<tr><td>Scheduling</td><td>state, priority, CPU time used, time of last run</td></tr>
<tr><td>Memory</td><td>page-table pointer, code/data/stack limits</td></tr>
<tr><td>Files</td><td>the file-descriptor table, working directory, umask</td></tr>
<tr><td>Accounting</td><td>start time, CPU used, limits, signal handlers</td></tr>
</tbody></table>
<p>A <b>context switch</b> is exactly this: save the CPU state into the old PCB, load it from the new one, swap the page table. That is why it costs microseconds, and why doing it too often ("thrashing the scheduler") wastes the CPU you were trying to share.</p>

<h3>fork() — one call, two returns</h3>
<pre><span class="tok-keyword">#include</span> &lt;stdio.h&gt;
<span class="tok-keyword">#include</span> &lt;unistd.h&gt;
<span class="tok-keyword">#include</span> &lt;sys/wait.h&gt;

<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-type">pid_t</span> pid = <span class="tok-function">fork</span>();          <span class="tok-comment">// the process splits HERE</span>

    <span class="tok-keyword">if</span> (pid &lt; 0)  { <span class="tok-function">perror</span>(<span class="tok-string">"fork"</span>); <span class="tok-keyword">return</span> 1; }
    <span class="tok-keyword">if</span> (pid == 0) {                    <span class="tok-comment">// child: fork returned 0</span>
        <span class="tok-function">printf</span>(<span class="tok-string">"child, my pid=%d, parent=%d\\n"</span>, <span class="tok-function">getpid</span>(), <span class="tok-function">getppid</span>());
        <span class="tok-function">execlp</span>(<span class="tok-string">"ls"</span>, <span class="tok-string">"ls"</span>, <span class="tok-string">"-l"</span>, <span class="tok-keyword">NULL</span>);   <span class="tok-comment">// replace myself with ls</span>
        <span class="tok-function">perror</span>(<span class="tok-string">"exec"</span>);               <span class="tok-comment">// only reached if exec FAILED</span>
        <span class="tok-function">_exit</span>(1);
    }
    <span class="tok-comment">// parent: fork returned the child's pid</span>
    <span class="tok-type">int</span> status;
    <span class="tok-function">wait</span>(&amp;status);                     <span class="tok-comment">// block until the child finishes</span>
    <span class="tok-function">printf</span>(<span class="tok-string">"parent: child %d exited with %d\\n"</span>, pid, <span class="tok-function">WEXITSTATUS</span>(status));
    <span class="tok-keyword">return</span> 0;
}</pre>
<div class="out"><b>Trace it.</b> Before <span class="badge">fork()</span> there is one process. After it there are two, both sitting on the next line, with identical memory contents. They are told apart only by the return value: <b>0 in the child, the child's PID in the parent</b>, −1 on failure.<br>
<b>Then <span class="badge">exec</span> does something different from fork:</b> it does not create a process — it <em>replaces</em> the current program image (code, data, stack) with a new one, keeping the same PID and open file descriptors. That is why the shell can redirect: fork, adjust the descriptors in the child, then exec.<br>
<b>Output order is not deterministic:</b> parent and child are two independent processes and the scheduler decides. If your run always prints in the same order, that is luck, not a guarantee.</div>

<h3>Zombies and orphans — two exam favourites</h3>
<div class="out"><b>Zombie:</b> the child has exited but the parent has not called <span class="badge">wait()</span>. The PCB must stay so the exit status can be collected, so the process shows as <span class="badge">Z</span> in <span class="badge">ps</span>. It uses no CPU and no memory — only a PID slot — but a server that forks in a loop and never waits will exhaust the PID table.<br>
<b>Orphan:</b> the parent exits first. The child is re-parented to <span class="badge">init</span>/<span class="badge">systemd</span> (PID 1), which calls <span class="badge">wait()</span> for it. Orphans are harmless; zombies are the leak.<br>
<b>The fix:</b> call <span class="badge">wait()</span>/<span class="badge">waitpid()</span>, or ignore <span class="badge">SIGCHLD</span> so the kernel reaps automatically.</div>

<div class="pitfall"><b><span class="badge">printf</span> before <span class="badge">fork</span> can print twice.</b> The C library buffers output; if the buffer has not been flushed when the process splits, the child inherits a copy and both flush it later. Add <span class="badge">fflush(stdout)</span> before forking, or write to an unbuffered descriptor. This bug appears in lab reports every semester.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>fork() is nearly free because of copy-on-write.</b> Copying a 2 GB address space to create a child that immediately execs would be absurd, so the kernel copies only the page table and marks every page read-only and shared. The first write by either process triggers a page fault, and only <em>that page</em> is duplicated. Fork therefore costs microseconds regardless of process size — and the same mechanism makes Redis snapshots and container startup cheap. <em>Beyond syllabus because the textbook presents fork as "copy the parent", which stopped being literally true forty years ago.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Một tiến trình sinh ra, sống và chết như thế nào</h2>
<p class="lead">Chương trình là một tệp trên đĩa; <strong>tiến trình</strong> là chương trình đó đang thực thi, với bộ nhớ, thanh ghi và tệp mở của riêng nó. Bài này nói về các trạng thái nó đi qua, cấu trúc mà nhân giữ cho nó, và hai lời gọi tạo ra nó.</p>

<h3>Năm trạng thái</h3>
<div class="diagram">           được nhận      được điều phối        kết thúc
   [MỚI] ──────────→ [SẴN SÀNG] ────────→ [ĐANG CHẠY] ────→ [KẾT THÚC]
                        ↑  ↖ hết lượt/bị chiếm  │
                        │                       │ chờ I/O
                        └──── I/O xong ── [BỊ CHẶN] ←┘</div>
<div class="out"><b>Chuyển trạng thái mà sinh viên hay vẽ sai:</b> BỊ CHẶN không bao giờ đi thẳng sang ĐANG CHẠY. Khi đĩa làm xong, tiến trình trở thành <em>sẵn sàng</em> — nó vẫn phải được bộ lập lịch chọn. Vẽ mũi tên từ BỊ CHẶN sang ĐANG CHẠY là mất điểm ngay.<br>
<b>Hai cách rời khỏi ĐANG CHẠY:</b> tự nguyện (một lời gọi hệ thống bị chặn) hoặc không tự nguyện (ngắt đồng hồ chiếm quyền, bài 2.4).</div>

<h3>Khối điều khiển tiến trình (PCB) — "tiến trình" thật sự là gì với nhân</h3>
<table><thead><tr><th>Nhóm</th><th>Nội dung</th></tr></thead><tbody>
<tr><td>Danh tính</td><td>PID, PID cha, id người dùng/nhóm</td></tr>
<tr><td>Trạng thái CPU</td><td>con trỏ lệnh, con trỏ ngăn xếp, toàn bộ thanh ghi, từ trạng thái</td></tr>
<tr><td>Lập lịch</td><td>trạng thái, độ ưu tiên, thời gian CPU đã dùng, lần chạy gần nhất</td></tr>
<tr><td>Bộ nhớ</td><td>con trỏ bảng trang, giới hạn vùng mã/dữ liệu/ngăn xếp</td></tr>
<tr><td>Tệp</td><td>bảng mô tả tệp, thư mục làm việc, umask</td></tr>
<tr><td>Thống kê</td><td>thời điểm bắt đầu, CPU đã dùng, hạn mức, hàm xử lý tín hiệu</td></tr>
</tbody></table>
<p><b>Chuyển ngữ cảnh</b> đúng là việc này: lưu trạng thái CPU vào PCB cũ, nạp lại từ PCB mới, tráo bảng trang. Vì thế nó tốn micro-giây, và vì thế làm việc đó quá thường xuyên ("quần bộ lập lịch") lại đốt chính cái CPU mà bạn định chia sẻ.</p>

<h3>fork() — một lời gọi, hai lần trả về</h3>
<pre><span class="tok-keyword">#include</span> &lt;stdio.h&gt;
<span class="tok-keyword">#include</span> &lt;unistd.h&gt;
<span class="tok-keyword">#include</span> &lt;sys/wait.h&gt;

<span class="tok-type">int</span> <span class="tok-function">main</span>() {
    <span class="tok-type">pid_t</span> pid = <span class="tok-function">fork</span>();          <span class="tok-comment">// tiến trình tách đôi TẠI ĐÂY</span>

    <span class="tok-keyword">if</span> (pid &lt; 0)  { <span class="tok-function">perror</span>(<span class="tok-string">"fork"</span>); <span class="tok-keyword">return</span> 1; }
    <span class="tok-keyword">if</span> (pid == 0) {                    <span class="tok-comment">// tiến trình con: fork trả về 0</span>
        <span class="tok-function">printf</span>(<span class="tok-string">"con, pid=%d, cha=%d\\n"</span>, <span class="tok-function">getpid</span>(), <span class="tok-function">getppid</span>());
        <span class="tok-function">execlp</span>(<span class="tok-string">"ls"</span>, <span class="tok-string">"ls"</span>, <span class="tok-string">"-l"</span>, <span class="tok-keyword">NULL</span>);   <span class="tok-comment">// thay chính mình bằng ls</span>
        <span class="tok-function">perror</span>(<span class="tok-string">"exec"</span>);               <span class="tok-comment">// chỉ tới đây nếu exec THẤT BẠI</span>
        <span class="tok-function">_exit</span>(1);
    }
    <span class="tok-comment">// tiến trình cha: fork trả về pid của con</span>
    <span class="tok-type">int</span> status;
    <span class="tok-function">wait</span>(&amp;status);                     <span class="tok-comment">// chặn lại tới khi con kết thúc</span>
    <span class="tok-function">printf</span>(<span class="tok-string">"cha: con %d thoát với mã %d\\n"</span>, pid, <span class="tok-function">WEXITSTATUS</span>(status));
    <span class="tok-keyword">return</span> 0;
}</pre>
<div class="out"><b>Chạy tay.</b> Trước <span class="badge">fork()</span> có một tiến trình. Sau nó có hai, cả hai đều đứng ở dòng kế tiếp, với nội dung bộ nhớ giống hệt nhau. Chúng chỉ phân biệt được nhờ giá trị trả về: <b>0 ở tiến trình con, PID của con ở tiến trình cha</b>, −1 nếu thất bại.<br>
<b>Rồi <span class="badge">exec</span> làm một việc khác hẳn fork:</b> nó không tạo tiến trình — nó <em>thay thế</em> ảnh chương trình hiện tại (mã, dữ liệu, ngăn xếp) bằng chương trình mới, giữ nguyên PID và các mô tả tệp đang mở. Nhờ vậy shell chuyển hướng được: fork, chỉnh mô tả tệp trong con, rồi exec.<br>
<b>Thứ tự in ra không tất định:</b> cha và con là hai tiến trình độc lập và bộ lập lịch quyết định. Nếu lần nào bạn chạy cũng ra cùng thứ tự thì đó là may mắn, không phải đảm bảo.</div>

<h3>Tiến trình xác sống và tiến trình mồ côi — hai câu hỏi thi ưa thích</h3>
<div class="out"><b>Xác sống (zombie):</b> con đã thoát nhưng cha chưa gọi <span class="badge">wait()</span>. PCB phải nằm lại để mã thoát còn được lấy, nên tiến trình hiện chữ <span class="badge">Z</span> trong <span class="badge">ps</span>. Nó không tốn CPU và bộ nhớ — chỉ tốn một ô PID — nhưng một máy chủ cứ fork trong vòng lặp mà không bao giờ wait sẽ làm cạn bảng PID.<br>
<b>Mồ côi (orphan):</b> cha thoát trước. Con được nhận làm con của <span class="badge">init</span>/<span class="badge">systemd</span> (PID 1), và tiến trình này gọi <span class="badge">wait()</span> hộ. Mồ côi thì vô hại; xác sống mới là chỗ rò rỉ.<br>
<b>Cách chữa:</b> gọi <span class="badge">wait()</span>/<span class="badge">waitpid()</span>, hoặc bỏ qua tín hiệu <span class="badge">SIGCHLD</span> để nhân tự thu dọn.</div>

<div class="pitfall"><b><span class="badge">printf</span> đặt trước <span class="badge">fork</span> có thể in ra hai lần.</b> Thư viện C gom đệm đầu ra; nếu vùng đệm chưa được xả lúc tiến trình tách đôi, con thừa hưởng một bản sao và cả hai cùng xả về sau. Hãy gọi <span class="badge">fflush(stdout)</span> trước khi fork, hoặc ghi vào một mô tả tệp không đệm. Lỗi này xuất hiện trong báo cáo lab mỗi kỳ.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>fork() gần như miễn phí nhờ sao-chép-khi-ghi.</b> Chép cả không gian địa chỉ 2 GB chỉ để tạo một tiến trình con rồi exec ngay là điều vô lý, nên nhân chỉ chép bảng trang và đánh dấu mọi trang là chỉ-đọc và dùng chung. Lần ghi đầu tiên của bên nào cũng gây lỗi trang, và chỉ <em>trang đó</em> được nhân bản. Vì vậy fork tốn micro-giây bất kể tiến trình lớn cỡ nào — và cùng cơ chế đó làm cho việc chụp ảnh dữ liệu của Redis và khởi động container trở nên rẻ. <em>Ngoài giáo trình vì sách trình bày fork là "chép tiến trình cha", điều đã thôi đúng theo nghĩa đen từ bốn chục năm trước.</em></div>
</div>
`,
        },
        {
          title: '2.4 — Scheduling algorithms, calculated|||2.4 — Thuật toán lập lịch, tính bằng số',
          slug: 'osg202-2-4-lap-lich-tinh-toan',
          type: 'VIDEO',
          description: 'FCFS, SJF, SRTF, RR, Priority, MLFQ — cùng một bộ tiến trình, tính waiting time và turnaround từng bước.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.4</span>
<h2>The exam question, worked through six times</h2>
<p class="lead">Progress tests always ask the same thing: here are four processes with arrival and burst times, draw the Gantt chart and compute the average waiting time. This lesson does exactly that for every algorithm, on one data set.</p>

<div class="formula"><span class="lbl">DEFINITIONS</span>Turnaround = finish − arrival &nbsp;·&nbsp; Waiting = turnaround − burst &nbsp;·&nbsp; Response = first run − arrival</div>

<h3>The data set used throughout</h3>
<table><thead><tr><th>Process</th><th>Arrival</th><th>Burst</th><th>Priority</th></tr></thead><tbody>
<tr><td>P1</td><td>0</td><td>7</td><td>2</td></tr>
<tr><td>P2</td><td>2</td><td>4</td><td>1 (highest)</td></tr>
<tr><td>P3</td><td>4</td><td>1</td><td>3</td></tr>
<tr><td>P4</td><td>5</td><td>4</td><td>2</td></tr>
</tbody></table>

<h3>1 · FCFS — first come, first served (non-preemptive)</h3>
<div class="out"><b>Gantt:</b> | P1 0–7 | P2 7–11 | P3 11–12 | P4 12–16 |<br>
Waiting: P1 = 0−0 = 0 · P2 = 7−2 = 5 · P3 = 11−4 = 7 · P4 = 12−5 = 7<br>
<b>Average waiting = (0+5+7+7)/4 = 4.75</b><br>
<b>The convoy effect:</b> P3 needs 1 unit but waits 7 behind the long P1. One slow process delays everyone — the reason FCFS alone is never used interactively.</div>

<h3>2 · SJF — shortest job first (non-preemptive)</h3>
<div class="out">At t=0 only P1 has arrived → run it to 7. At t=7 the queue holds P2(4), P3(1), P4(4) → pick the shortest, P3.<br>
<b>Gantt:</b> | P1 0–7 | P3 7–8 | P2 8–12 | P4 12–16 |<br>
Waiting: P1 = 0 · P3 = 8−1−4 = 3 · P2 = 8−2 = 6 · P4 = 12−5 = 7<br>
<b>Average waiting = (0+6+3+7)/4 = 4.0</b> — provably the minimum for non-preemptive scheduling.<br>
<b>The catch:</b> it needs the burst time in advance, which the OS never knows. Real systems <em>estimate</em> it with an exponential average of past bursts.</div>

<h3>3 · SRTF — shortest remaining time first (preemptive SJF)</h3>
<div class="out">t=0 P1 starts. t=2 P2 arrives with 4 &lt; P1's remaining 5 → <b>preempt</b>. t=4 P3 arrives with 1 &lt; P2's remaining 2 → <b>preempt</b>. t=5 P3 finishes; P2 has 2, P4 has 4 → P2. t=7 P2 done → P4 (4) vs P1 (5) → P4. t=11 P4 done → P1 finishes at 16.<br>
<b>Gantt:</b> | P1 0–2 | P2 2–4 | P3 4–5 | P2 5–7 | P4 7–11 | P1 11–16 |<br>
Waiting: P1 = 16−0−7 = 9 · P2 = 7−2−4 = 1 · P3 = 5−4−1 = 0 · P4 = 11−5−4 = 2<br>
<b>Average waiting = (9+1+0+2)/4 = 3.0</b> — the best of all six, at the price of more context switches and possible <b>starvation</b> of the long P1.</div>

<h3>4 · Round Robin, quantum = 3</h3>
<div class="out">Ready queue evolves as processes arrive during each slice.<br>
<b>Gantt:</b> | P1 0–3 | P2 3–6 | P3 6–7 | P4 7–10 | P1 10–13 | P2 13–14 | P4 14–15 | P1 15–16 |<br>
Finish times: P3 = 7, P2 = 14, P4 = 15, P1 = 16<br>
Waiting: P1 = 16−0−7 = 9 · P2 = 14−2−4 = 8 · P3 = 7−4−1 = 2 · P4 = 15−5−4 = 6<br>
<b>Average waiting = 6.25</b> — worse on average, but <b>response time is excellent</b>: every process runs within one round. That is the trade interactive systems want.<br>
<b>Choosing the quantum:</b> too large → it degenerates into FCFS; too small → context-switch overhead dominates. Rule of thumb: 80% of bursts should finish within one quantum; typical values are 10–100 ms.</div>

<h3>5 · Priority (non-preemptive) and 6 · MLFQ</h3>
<div class="out"><b>Priority:</b> at t=7 (after P1) the queue is P2(pri 1), P4(pri 2), P3(pri 3) → order P2, P4, P3.<br>
Gantt: | P1 0–7 | P2 7–11 | P4 11–15 | P3 15–16 | → waiting = (0 + 5 + 11 + 6)/4 = <b>5.5</b>.<br>
<b>Starvation:</b> a low-priority process may never run if high-priority ones keep arriving. The fix is <b>ageing</b> — raise a process's priority the longer it waits.<br>
<b>MLFQ (multi-level feedback queue)</b> — what Linux, Windows and macOS actually do: several queues with different quanta; a process that uses its whole quantum drops a level (it is CPU-bound), one that blocks early stays or rises (it is interactive). No prior knowledge of burst times is needed, yet it approximates SJF — which is why it beat every fixed policy in practice.</div>

<h3>Summary</h3>
<table><thead><tr><th>Algorithm</th><th>Avg waiting (this data)</th><th>Preemptive</th><th>Starvation</th><th>Best for</th></tr></thead><tbody>
<tr><td>FCFS</td><td>4.75</td><td>no</td><td>no</td><td>batch, simplicity</td></tr>
<tr><td>SJF</td><td>4.00</td><td>no</td><td>possible</td><td>known short jobs</td></tr>
<tr><td><b>SRTF</b></td><td><b>3.00</b></td><td>yes</td><td>possible</td><td>minimising average wait</td></tr>
<tr><td>RR (q=3)</td><td>6.25</td><td>yes</td><td><b>no</b></td><td>interactive systems</td></tr>
<tr><td>Priority</td><td>5.50</td><td>either</td><td>yes (use ageing)</td><td>real-time, importance</td></tr>
<tr><td>MLFQ</td><td>adaptive</td><td>yes</td><td>no (with boosting)</td><td><b>general purpose</b></td></tr>
</tbody></table>

<div class="pitfall"><b>Waiting time is not "time until it starts".</b> With preemption a process waits every time it is taken off the CPU, so waiting = turnaround − burst, not first-run − arrival. Using the wrong formula on SRTF or RR gives a plausible but wrong answer — and it is the single most common error in the progress test.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Linux CFS schedules by fairness, not by queues.</b> The Completely Fair Scheduler gives every runnable task a <em>virtual runtime</em> and always runs the one with the smallest — a red-black tree lookup (CSD201, lesson A.1) instead of priority queues. Weighted by <span class="badge">nice</span> value, this approximates "every process gets 1/n of the CPU" without any fixed quantum. Since 2024 the newer EEVDF scheduler adds an explicit deadline so latency-sensitive tasks get served first. <em>Beyond syllabus because the textbook's six algorithms are the vocabulary, while production kernels have moved to fairness models built on data structures from your algorithms course.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.4</span>
<h2>Câu hỏi thi, giải sáu lần</h2>
<p class="lead">Progress test luôn hỏi đúng một dạng: cho bốn tiến trình kèm thời điểm đến và thời gian chạy, hãy vẽ biểu đồ Gantt và tính thời gian chờ trung bình. Bài này làm đúng việc đó cho từng thuật toán, trên cùng một bộ dữ liệu.</p>

<div class="formula"><span class="lbl">ĐỊNH NGHĨA</span>Thời gian hoàn thành = kết thúc − đến &nbsp;·&nbsp; Chờ = hoàn thành − thời gian chạy &nbsp;·&nbsp; Đáp ứng = lần chạy đầu − đến</div>

<h3>Bộ dữ liệu dùng xuyên bài</h3>
<table><thead><tr><th>Tiến trình</th><th>Đến</th><th>Thời gian chạy</th><th>Ưu tiên</th></tr></thead><tbody>
<tr><td>P1</td><td>0</td><td>7</td><td>2</td></tr>
<tr><td>P2</td><td>2</td><td>4</td><td>1 (cao nhất)</td></tr>
<tr><td>P3</td><td>4</td><td>1</td><td>3</td></tr>
<tr><td>P4</td><td>5</td><td>4</td><td>2</td></tr>
</tbody></table>

<h3>1 · FCFS — đến trước phục vụ trước (không chiếm quyền)</h3>
<div class="out"><b>Gantt:</b> | P1 0–7 | P2 7–11 | P3 11–12 | P4 12–16 |<br>
Chờ: P1 = 0−0 = 0 · P2 = 7−2 = 5 · P3 = 11−4 = 7 · P4 = 12−5 = 7<br>
<b>Chờ trung bình = (0+5+7+7)/4 = 4,75</b><br>
<b>Hiệu ứng đoàn xe:</b> P3 chỉ cần 1 đơn vị nhưng phải chờ 7 vì đứng sau P1 dài lê thê. Một tiến trình chậm làm trễ tất cả — đó là lý do FCFS đơn thuần không bao giờ được dùng cho hệ tương tác.</div>

<h3>2 · SJF — việc ngắn nhất trước (không chiếm quyền)</h3>
<div class="out">Tại t=0 chỉ P1 đã đến → chạy tới 7. Tại t=7 hàng đợi có P2(4), P3(1), P4(4) → chọn ngắn nhất là P3.<br>
<b>Gantt:</b> | P1 0–7 | P3 7–8 | P2 8–12 | P4 12–16 |<br>
Chờ: P1 = 0 · P3 = 8−1−4 = 3 · P2 = 8−2 = 6 · P4 = 12−5 = 7<br>
<b>Chờ trung bình = (0+6+3+7)/4 = 4,0</b> — chứng minh được là nhỏ nhất trong lớp không chiếm quyền.<br>
<b>Chỗ vướng:</b> nó cần biết trước thời gian chạy, thứ mà OS không bao giờ biết. Hệ thống thật <em>ước lượng</em> bằng trung bình mũ của các lần chạy trước.</div>

<h3>3 · SRTF — thời gian còn lại ngắn nhất trước (SJF có chiếm quyền)</h3>
<div class="out">t=0 P1 chạy. t=2 P2 đến với 4 &lt; phần còn lại 5 của P1 → <b>chiếm quyền</b>. t=4 P3 đến với 1 &lt; phần còn lại 2 của P2 → <b>chiếm quyền</b>. t=5 P3 xong; P2 còn 2, P4 còn 4 → chọn P2. t=7 P2 xong → P4 (4) so P1 (5) → chọn P4. t=11 P4 xong → P1 chạy tới 16.<br>
<b>Gantt:</b> | P1 0–2 | P2 2–4 | P3 4–5 | P2 5–7 | P4 7–11 | P1 11–16 |<br>
Chờ: P1 = 16−0−7 = 9 · P2 = 7−2−4 = 1 · P3 = 5−4−1 = 0 · P4 = 11−5−4 = 2<br>
<b>Chờ trung bình = (9+1+0+2)/4 = 3,0</b> — tốt nhất trong sáu cách, đổi lại nhiều lần chuyển ngữ cảnh hơn và nguy cơ <b>đói tài nguyên</b> cho P1 dài.</div>

<h3>4 · Round Robin, lượng tử = 3</h3>
<div class="out">Hàng đợi sẵn sàng biến động khi các tiến trình đến trong từng lát thời gian.<br>
<b>Gantt:</b> | P1 0–3 | P2 3–6 | P3 6–7 | P4 7–10 | P1 10–13 | P2 13–14 | P4 14–15 | P1 15–16 |<br>
Thời điểm kết thúc: P3 = 7, P2 = 14, P4 = 15, P1 = 16<br>
Chờ: P1 = 16−0−7 = 9 · P2 = 14−2−4 = 8 · P3 = 7−4−1 = 2 · P4 = 15−5−4 = 6<br>
<b>Chờ trung bình = 6,25</b> — trung bình thì tệ hơn, nhưng <b>thời gian đáp ứng rất tốt</b>: mọi tiến trình đều được chạy trong vòng một lượt. Đó đúng là thứ hệ tương tác cần.<br>
<b>Chọn lượng tử:</b> quá lớn → suy biến thành FCFS; quá nhỏ → chi phí chuyển ngữ cảnh lấn át. Kinh nghiệm: 80% các lần chạy nên kết thúc gọn trong một lượng tử; giá trị điển hình 10–100 mili-giây.</div>

<h3>5 · Ưu tiên (không chiếm quyền) và 6 · MLFQ</h3>
<div class="out"><b>Ưu tiên:</b> tại t=7 (sau P1) hàng đợi là P2(ưu tiên 1), P4(2), P3(3) → thứ tự P2, P4, P3.<br>
Gantt: | P1 0–7 | P2 7–11 | P4 11–15 | P3 15–16 | → chờ = (0 + 5 + 11 + 6)/4 = <b>5,5</b>.<br>
<b>Đói tài nguyên:</b> tiến trình ưu tiên thấp có thể không bao giờ được chạy nếu tiến trình ưu tiên cao cứ liên tục đến. Cách chữa là <b>lão hoá</b> — càng chờ lâu càng được nâng độ ưu tiên.<br>
<b>MLFQ (hàng đợi nhiều mức có phản hồi)</b> — thứ mà Linux, Windows và macOS thật sự dùng: nhiều hàng đợi với lượng tử khác nhau; tiến trình dùng hết lượng tử thì tụt một bậc (nó thiên về CPU), tiến trình chặn sớm thì giữ nguyên hoặc lên bậc (nó có tính tương tác). Không cần biết trước thời gian chạy mà vẫn xấp xỉ được SJF — vì thế nó thắng mọi chính sách cố định trong thực tế.</div>

<h3>Tổng kết</h3>
<table><thead><tr><th>Thuật toán</th><th>Chờ TB (bộ dữ liệu này)</th><th>Chiếm quyền</th><th>Đói tài nguyên</th><th>Hợp với</th></tr></thead><tbody>
<tr><td>FCFS</td><td>4,75</td><td>không</td><td>không</td><td>xử lý theo lô, cần đơn giản</td></tr>
<tr><td>SJF</td><td>4,00</td><td>không</td><td>có thể</td><td>biết trước việc ngắn</td></tr>
<tr><td><b>SRTF</b></td><td><b>3,00</b></td><td>có</td><td>có thể</td><td>tối tiểu thời gian chờ trung bình</td></tr>
<tr><td>RR (q=3)</td><td>6,25</td><td>có</td><td><b>không</b></td><td>hệ tương tác</td></tr>
<tr><td>Ưu tiên</td><td>5,50</td><td>tuỳ bản</td><td>có (phải lão hoá)</td><td>thời gian thực, phân biệt tầm quan trọng</td></tr>
<tr><td>MLFQ</td><td>thích nghi</td><td>có</td><td>không (nếu có nâng bậc)</td><td><b>đa dụng</b></td></tr>
</tbody></table>

<div class="pitfall"><b>Thời gian chờ không phải "thời gian tới lúc bắt đầu chạy".</b> Khi có chiếm quyền, tiến trình phải chờ ở mỗi lần bị đẩy khỏi CPU, nên chờ = hoàn thành − thời gian chạy, chứ không phải lần chạy đầu − thời điểm đến. Dùng nhầm công thức ở SRTF hay RR sẽ ra đáp án nghe hợp lý nhưng sai — và đó là lỗi phổ biến nhất trong progress test.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>CFS của Linux lập lịch theo tính công bằng, không theo hàng đợi.</b> Bộ lập lịch Hoàn toàn Công bằng gán cho mỗi tác vụ sẵn sàng một <em>thời gian chạy ảo</em> và luôn chạy tác vụ có giá trị nhỏ nhất — một phép tra cây đỏ-đen (CSD201, bài A.1) thay cho các hàng đợi ưu tiên. Có trọng số theo giá trị <span class="badge">nice</span>, cách này xấp xỉ "mỗi tiến trình được 1/n CPU" mà không cần lượng tử cố định nào. Từ 2024, bộ lập lịch EEVDF mới hơn thêm một hạn chót tường minh để các tác vụ nhạy độ trễ được phục vụ trước. <em>Ngoài giáo trình vì sáu thuật toán trong sách là vốn từ vựng, còn nhân sản xuất đã chuyển sang các mô hình công bằng dựng trên chính cấu trúc dữ liệu của môn giải thuật.</em></div>
</div>
`,
        },
        {
          title: '2.5 — IPC & synchronization: races, mutex, semaphore|||2.5 — IPC & đồng bộ: tương tranh, mutex, semaphore',
          slug: 'osg202-2-5-ipc-dong-bo',
          type: 'VIDEO',
          description: 'Điều kiện tương tranh có ví dụ số, miền găng, semaphore/mutex, và bốn cách tiến trình nói chuyện với nhau.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.5</span>
<h2>When two processes touch the same thing</h2>
<p class="lead">Processes are isolated by design, but they must cooperate — a shell pipes output, a server shares a counter, threads update one list. The moment they share, timing becomes part of the program's meaning, and that is where the hardest bugs in this course live.</p>

<h3>A race condition, in numbers</h3>
<pre><span class="tok-comment">// two threads run: counter = counter + 1  (counter starts at 5)</span>
LOAD  R1, counter    <span class="tok-comment">// R1 = 5</span>
ADD   R1, 1          <span class="tok-comment">// R1 = 6</span>
STORE counter, R1    <span class="tok-comment">// counter = 6</span></pre>
<div class="out"><b>Interleaving that loses an update:</b><br>
T1 LOAD → R1 = 5 · <b>context switch</b> · T2 LOAD → R2 = 5 · T2 ADD → 6 · T2 STORE → counter = 6 · <b>switch back</b> · T1 ADD → 6 · T1 STORE → counter = <b>6</b><br>
<b>Two increments, one result.</b> Run it a million times in a loop and you lose thousands of updates — non-deterministically, so it passes your test and fails in production.<br>
<b>The three ingredients of a race:</b> shared data, concurrent access, and at least one writer. Remove any one and the race disappears — which is why immutable data and thread-local copies are real solutions, not just locks.</div>

<h3>The critical-section problem — four requirements</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. Mutual exclusion.</b> At most one process inside the critical section at a time.</div>
  <div class="lz-layer"><b>2. Progress.</b> If nobody is inside, a process wanting in must get in — the decision cannot be postponed indefinitely.</div>
  <div class="lz-layer"><b>3. Bounded waiting.</b> No process waits forever while others repeatedly enter (no starvation).</div>
  <div class="lz-layer"><b>4. No assumptions about speed.</b> Correctness must not depend on CPU count or relative process speed.</div>
</div>

<h3>Solutions, from wrong to right</h3>
<table><thead><tr><th>Approach</th><th>Verdict</th></tr></thead><tbody>
<tr><td>Disable interrupts</td><td>works on one core only; giving that power to user processes is unacceptable</td></tr>
<tr><td>Strict alternation (a <span class="badge">turn</span> variable)</td><td>mutual exclusion ✓ but <b>fails progress</b>: a process must wait for its turn even if the other is not interested</td></tr>
<tr><td>Peterson's algorithm</td><td>correct in software for two processes — <span class="badge">flag[i]=true; turn=j; while(flag[j] &amp;&amp; turn==j);</span> — but busy-waits</td></tr>
<tr><td><b>TSL / atomic compare-and-swap</b></td><td>hardware instruction that tests and sets in one indivisible step; the basis of every real lock</td></tr>
<tr><td><b>Mutex / semaphore</b></td><td>the OS blocks the waiting process instead of spinning — the practical answer</td></tr>
</tbody></table>

<h3>Semaphores — two operations, one invariant</h3>
<pre>down(S) / wait(S):  <span class="tok-keyword">if</span> (S &gt; 0) S--; <span class="tok-keyword">else</span> block the caller
up(S)   / signal(S): S++; <span class="tok-keyword">if</span> anyone is blocked, wake one
<span class="tok-comment">// both operations are ATOMIC — that is the whole point</span></pre>
<div class="out"><b>Binary semaphore (mutex), S = 1</b> — mutual exclusion:<br>
<span class="badge">down(S); /* critical section */ up(S);</span><br>
<b>Counting semaphore, S = N</b> — a pool of N identical resources (N printers, N database connections). <span class="badge">down</span> takes one, <span class="badge">up</span> returns it, and the N+1-th requester blocks automatically.<br>
<b>Mutex vs semaphore:</b> a mutex has an <em>owner</em> — only the locker may unlock it — while a semaphore is just a counter that anyone may signal. Use a mutex for exclusion, a semaphore for counting and signalling between different processes.</div>

<h3>Four ways processes communicate</h3>
<table><thead><tr><th>Mechanism</th><th>Direction</th><th>Typical use</th></tr></thead><tbody>
<tr><td><b>Pipe</b> <span class="badge">ls | grep x</span></td><td>one way, related processes</td><td>shell pipelines; <span class="badge">pipe()</span> + fork</td></tr>
<tr><td><b>Named pipe (FIFO)</b></td><td>one way, any processes</td><td>a file in the file system used as a channel</td></tr>
<tr><td><b>Shared memory</b></td><td>both ways</td><td><b>fastest</b> — no copying — but <em>you</em> must synchronise it</td></tr>
<tr><td><b>Message passing / sockets</b></td><td>both ways</td><td>works across machines; the kernel handles synchronisation</td></tr>
<tr><td><b>Signals</b> <span class="badge">kill -9</span></td><td>notification only</td><td>asynchronous events: terminate, child exited, window resized</td></tr>
</tbody></table>

<div class="pitfall"><b>Shared memory without a semaphore is a race condition with extra steps.</b> The kernel gives you the shared pages and nothing else — no locking, no ordering guarantee. Every shared-memory example in the lab must be paired with a semaphore or a mutex, and forgetting it produces exactly the lost-update trace above.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Lock-free programming, and why it is hard.</b> Modern CPUs offer <span class="badge">compare-and-swap</span>: "if this address still holds X, write Y, atomically". It allows counters and queues with no lock at all — no blocking, no deadlock, no priority inversion — and it is how Java's <span class="badge">AtomicInteger</span> and <span class="badge">ConcurrentLinkedQueue</span> work. The price is the <em>ABA problem</em> (the value returned to X while you were away, so CAS succeeds on stale state) and the need to reason about memory ordering, since the CPU and compiler reorder instructions. Correct lock-free data structures are published as research papers, which is a fair measure of the difficulty. <em>Beyond syllabus because the course stops at semaphores, while high-performance systems are built one level below them.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.5</span>
<h2>Khi hai tiến trình cùng đụng vào một thứ</h2>
<p class="lead">Tiến trình vốn được thiết kế để cô lập, nhưng chúng buộc phải hợp tác — shell nối ống đầu ra, máy chủ dùng chung một bộ đếm, các luồng cùng cập nhật một danh sách. Ngay khi có dùng chung, thời điểm trở thành một phần ý nghĩa của chương trình, và đó là nơi những lỗi khó nhất của môn này trú ngụ.</p>

<h3>Một điều kiện tương tranh, bằng số</h3>
<pre><span class="tok-comment">// hai luồng cùng chạy: counter = counter + 1  (counter khởi đầu bằng 5)</span>
LOAD  R1, counter    <span class="tok-comment">// R1 = 5</span>
ADD   R1, 1          <span class="tok-comment">// R1 = 6</span>
STORE counter, R1    <span class="tok-comment">// counter = 6</span></pre>
<div class="out"><b>Một cách đan xen làm mất một lần cập nhật:</b><br>
T1 LOAD → R1 = 5 · <b>chuyển ngữ cảnh</b> · T2 LOAD → R2 = 5 · T2 ADD → 6 · T2 STORE → counter = 6 · <b>chuyển về</b> · T1 ADD → 6 · T1 STORE → counter = <b>6</b><br>
<b>Hai lần tăng, một kết quả.</b> Chạy nó một triệu lần trong vòng lặp là mất hàng nghìn lần cập nhật — một cách không tất định, nên nó qua được phép thử của bạn rồi hỏng trên môi trường thật.<br>
<b>Ba thành phần của một cuộc tương tranh:</b> dữ liệu dùng chung, truy cập đồng thời, và ít nhất một bên ghi. Bỏ đi bất kỳ cái nào là hết tương tranh — vì thế dữ liệu bất biến và bản sao riêng cho từng luồng là giải pháp thật, không chỉ có mỗi khoá.</div>

<h3>Bài toán miền găng — bốn yêu cầu</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>1. Loại trừ tương hỗ.</b> Tại mỗi thời điểm nhiều nhất một tiến trình ở trong miền găng.</div>
  <div class="lz-layer"><b>2. Tiến triển.</b> Nếu không ai ở trong, tiến trình muốn vào phải vào được — không được hoãn quyết định vô hạn.</div>
  <div class="lz-layer"><b>3. Chờ có giới hạn.</b> Không tiến trình nào chờ mãi trong khi những tiến trình khác cứ vào liên tục (không đói tài nguyên).</div>
  <div class="lz-layer"><b>4. Không giả định về tốc độ.</b> Tính đúng đắn không được phụ thuộc số nhân CPU hay tốc độ tương đối của các tiến trình.</div>
</div>

<h3>Các giải pháp, từ sai tới đúng</h3>
<table><thead><tr><th>Cách làm</th><th>Đánh giá</th></tr></thead><tbody>
<tr><td>Tắt ngắt</td><td>chỉ đúng trên một nhân; trao quyền đó cho tiến trình người dùng là không chấp nhận được</td></tr>
<tr><td>Luân phiên cứng (biến <span class="badge">turn</span>)</td><td>loại trừ tương hỗ ✓ nhưng <b>vi phạm tiến triển</b>: một tiến trình phải chờ tới lượt dù bên kia chẳng muốn vào</td></tr>
<tr><td>Thuật toán Peterson</td><td>đúng bằng phần mềm cho hai tiến trình — <span class="badge">flag[i]=true; turn=j; while(flag[j] &amp;&amp; turn==j);</span> — nhưng phải chờ bận</td></tr>
<tr><td><b>TSL / so-sánh-và-tráo nguyên tử</b></td><td>lệnh phần cứng vừa kiểm vừa đặt trong một bước không thể chia cắt; nền của mọi khoá thật</td></tr>
<tr><td><b>Mutex / semaphore</b></td><td>OS chặn tiến trình đang chờ thay vì để nó quay vòng — câu trả lời thực dụng</td></tr>
</tbody></table>

<h3>Semaphore — hai thao tác, một bất biến</h3>
<pre>down(S) / wait(S):  <span class="tok-keyword">nếu</span> (S &gt; 0) S--; <span class="tok-keyword">ngược lại</span> chặn bên gọi lại
up(S)   / signal(S): S++; <span class="tok-keyword">nếu</span> có ai đang bị chặn, đánh thức một
<span class="tok-comment">// cả hai thao tác đều NGUYÊN TỬ — đó là toàn bộ ý nghĩa</span></pre>
<div class="out"><b>Semaphore nhị phân (mutex), S = 1</b> — loại trừ tương hỗ:<br>
<span class="badge">down(S); /* miền găng */ up(S);</span><br>
<b>Semaphore đếm, S = N</b> — một kho N tài nguyên giống nhau (N máy in, N kết nối cơ sở dữ liệu). <span class="badge">down</span> lấy một, <span class="badge">up</span> trả lại, và người thứ N+1 tự động bị chặn.<br>
<b>Mutex khác semaphore:</b> mutex có <em>chủ sở hữu</em> — chỉ ai khoá mới được mở — còn semaphore chỉ là một bộ đếm mà ai cũng phát tín hiệu được. Dùng mutex để loại trừ, dùng semaphore để đếm và để báo hiệu giữa các tiến trình khác nhau.</div>

<h3>Bốn cách tiến trình nói chuyện với nhau</h3>
<table><thead><tr><th>Cơ chế</th><th>Chiều</th><th>Dùng điển hình</th></tr></thead><tbody>
<tr><td><b>Ống (pipe)</b> <span class="badge">ls | grep x</span></td><td>một chiều, tiến trình có quan hệ họ hàng</td><td>chuỗi lệnh shell; <span class="badge">pipe()</span> + fork</td></tr>
<tr><td><b>Ống có tên (FIFO)</b></td><td>một chiều, tiến trình bất kỳ</td><td>một tệp trong hệ thống tệp dùng làm kênh truyền</td></tr>
<tr><td><b>Bộ nhớ dùng chung</b></td><td>hai chiều</td><td><b>nhanh nhất</b> — không phải chép — nhưng <em>bạn</em> phải tự đồng bộ</td></tr>
<tr><td><b>Truyền thông điệp / socket</b></td><td>hai chiều</td><td>chạy được xuyên máy; nhân lo phần đồng bộ</td></tr>
<tr><td><b>Tín hiệu</b> <span class="badge">kill -9</span></td><td>chỉ để thông báo</td><td>sự kiện bất đồng bộ: kết thúc, con đã thoát, cửa sổ đổi cỡ</td></tr>
</tbody></table>

<div class="pitfall"><b>Bộ nhớ dùng chung mà không có semaphore chỉ là điều kiện tương tranh phiên bản dài dòng hơn.</b> Nhân đưa cho bạn các trang dùng chung và không gì khác — không khoá, không đảm bảo thứ tự. Mọi ví dụ bộ nhớ dùng chung trong bài lab đều phải đi kèm một semaphore hoặc mutex, và quên nó là sinh ra đúng vết mất cập nhật ở trên.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Lập trình không khoá, và vì sao nó khó.</b> CPU hiện đại cung cấp lệnh <span class="badge">so-sánh-và-tráo</span>: "nếu địa chỉ này vẫn đang chứa X thì ghi Y, một cách nguyên tử". Nó cho phép dựng bộ đếm và hàng đợi hoàn toàn không cần khoá — không chặn, không khoá chết, không đảo ngược ưu tiên — và đó là cách <span class="badge">AtomicInteger</span> cùng <span class="badge">ConcurrentLinkedQueue</span> của Java hoạt động. Cái giá là <em>bài toán ABA</em> (giá trị quay về X trong lúc bạn vắng mặt, nên CAS thành công trên trạng thái cũ) và việc phải suy luận về thứ tự bộ nhớ, vì CPU và trình biên dịch đều sắp xếp lại lệnh. Các cấu trúc dữ liệu không khoá đúng đắn được công bố dưới dạng bài báo khoa học, và đó là thước đo công bằng cho độ khó. <em>Ngoài giáo trình vì môn học dừng ở semaphore, còn các hệ thống hiệu năng cao được dựng ở tầng thấp hơn một bậc.</em></div>
</div>
`,
        },
        {
          title: '2.6 — The three classical IPC problems|||2.6 — Ba bài toán IPC kinh điển',
          slug: 'osg202-2-6-bai-toan-ipc',
          type: 'VIDEO',
          description: 'Producer–consumer, readers–writers và bữa tối các triết gia — lời giải bằng semaphore và bẫy khoá chết.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.6</span>
<h2>Three problems that contain every synchronisation idea</h2>
<p class="lead">These are not puzzles for their own sake. Producer–consumer is every queue you will ever write; readers–writers is every cache and database; dining philosophers is the shape of every deadlock. Learn the three and you can recognise the fourth.</p>

<h3>1 · Producer–consumer (the bounded buffer)</h3>
<p>A producer puts items into a buffer of N slots; a consumer takes them out. The producer must block when full, the consumer when empty, and they must not touch the buffer at the same time.</p>
<pre>semaphore mutex = 1;      <span class="tok-comment">// exclusive access to the buffer</span>
semaphore empty = N;      <span class="tok-comment">// number of free slots</span>
semaphore full  = 0;      <span class="tok-comment">// number of filled slots</span>

producer:                        consumer:
  item = produce();                down(full);      <span class="tok-comment">// wait for an item</span>
  down(empty);   <span class="tok-comment">// wait for space</span>    down(mutex);
  down(mutex);                     item = remove();
  insert(item);                    up(mutex);
  up(mutex);                       up(empty);       <span class="tok-comment">// a slot is free</span>
  up(full);      <span class="tok-comment">// an item exists</span>    consume(item);</pre>
<div class="out"><b>Why three semaphores, and why in that order.</b> <span class="badge">empty</span> and <span class="badge">full</span> count resources; <span class="badge">mutex</span> protects the shared buffer. The counting semaphore must be acquired <em>before</em> the mutex.<br>
<b>Swap the two downs in the producer</b> — <span class="badge">down(mutex); down(empty);</span> — and you get a deadlock: the producer holds the mutex while waiting for a free slot, so the consumer can never enter to free one. Both sleep forever. This exact swap is the standard exam question.<br>
<b>Where you already use it:</b> <span class="badge">BlockingQueue</span> in Java, a Go channel, a thread pool's task queue, and the pipe in <span class="badge">ls | grep</span> — the kernel implements the pipe as a bounded buffer with exactly this logic.</div>

<h3>2 · Readers–writers</h3>
<p>Many readers may read at once; a writer needs exclusive access. This is the shape of every shared data structure that is read far more often than written.</p>
<pre>semaphore mutex = 1, wrt = 1;  <span class="tok-type">int</span> readcount = 0;

reader:                              writer:
  down(mutex);                         down(wrt);
  readcount++;                         write();
  <span class="tok-keyword">if</span> (readcount == 1) down(wrt);      up(wrt);
  up(mutex);
  read();                            <span class="tok-comment">// the FIRST reader locks out writers,</span>
  down(mutex);                       <span class="tok-comment">// the LAST one releases them</span>
  readcount--;
  <span class="tok-keyword">if</span> (readcount == 0) up(wrt);
  up(mutex);</pre>
<div class="out"><b>The flaw in this version:</b> as long as readers keep arriving, <span class="badge">readcount</span> never reaches 0 and the writer <b>starves</b> — it may wait forever. This is "readers preference".<br>
<b>Writers preference</b> blocks new readers once a writer is waiting; a <b>fair</b> version queues everyone in arrival order. A database's <span class="badge">READ COMMITTED</span> versus <span class="badge">SERIALIZABLE</span> (DBI202, lesson 8.3) is the same trade-off at a different scale.<br>
<b>In practice:</b> Java's <span class="badge">ReentrantReadWriteLock</span> and Go's <span class="badge">sync.RWMutex</span> are this problem, solved once, in a library.</div>

<h3>3 · Dining philosophers — deadlock in five lines</h3>
<div class="diagram">Five philosophers around a table, five forks between them.
To eat, a philosopher needs BOTH the fork on the left and the one on the right.</div>
<pre><span class="tok-comment">// the naive solution — and it deadlocks</span>
<span class="tok-keyword">while</span> (1) {
    think();
    down(fork[i]);              <span class="tok-comment">// take the left fork</span>
    down(fork[(i+1) % 5]);      <span class="tok-comment">// take the right fork</span>
    eat();
    up(fork[i]); up(fork[(i+1) % 5]);
}</pre>
<div class="out"><b>The failing interleaving:</b> all five philosophers pick up their left fork at the same instant. Every fork is now held, every philosopher waits for the right one, and nobody will ever put a fork down. All four Coffman conditions (Chapter 6) hold simultaneously: mutual exclusion, hold and wait, no preemption, circular wait.<br>
<b>Four standard fixes, each breaking one condition:</b><br>
<b>a.</b> Allow at most four philosophers at the table (an extra semaphore initialised to 4) — breaks <em>circular wait</em>.<br>
<b>b.</b> Pick up both forks atomically, inside one mutex — breaks <em>hold and wait</em>.<br>
<b>c.</b> Make odd-numbered philosophers take the right fork first — breaks the <em>symmetry</em> that creates the cycle. Simplest and most common.<br>
<b>d.</b> Use a timeout and release both forks on failure — breaks <em>no preemption</em>, but risks livelock (everyone retries in lockstep forever) unless the retry delay is randomised.</div>

<div class="pitfall"><b>A solution that avoids deadlock can still starve someone.</b> If two neighbours alternate perfectly, the philosopher between them may never eat, even though the system never freezes. Deadlock-freedom and starvation-freedom are separate properties, and the exam asks about both.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Monitors and channels: making the mistakes impossible instead of forbidden.</b> Semaphores are error-prone because correctness depends on the programmer placing every <span class="badge">down</span> and <span class="badge">up</span> exactly right — one swapped line deadlocks. A <b>monitor</b> (Hoare, 1974) moves the lock into the language: the compiler guarantees only one thread is inside, and <span class="badge">wait</span>/<span class="badge">notify</span> handle the conditions — Java's <span class="badge">synchronized</span> is a monitor. Go goes further with the slogan "do not communicate by sharing memory; share memory by communicating": a channel <em>is</em> a bounded buffer, so the producer–consumer solution above is one line, <span class="badge">ch &lt;- item</span>, with no semaphores to misorder. <em>Beyond syllabus because the course teaches the mechanism, while language design has been trying to remove the need for the mechanism ever since.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.6</span>
<h2>Ba bài toán chứa trọn mọi ý tưởng đồng bộ</h2>
<p class="lead">Đây không phải câu đố cho vui. Sản xuất–tiêu thụ là mọi hàng đợi bạn sẽ viết; đọc–ghi là mọi cache và cơ sở dữ liệu; bữa tối các triết gia là hình dạng của mọi khoá chết. Nắm ba bài này là nhận ra được bài thứ tư.</p>

<h3>1 · Sản xuất–tiêu thụ (bộ đệm có giới hạn)</h3>
<p>Bên sản xuất bỏ món hàng vào bộ đệm N ô; bên tiêu thụ lấy ra. Bên sản xuất phải bị chặn khi đầy, bên tiêu thụ khi rỗng, và hai bên không được đụng vào bộ đệm cùng lúc.</p>
<pre>semaphore mutex = 1;      <span class="tok-comment">// quyền truy cập độc quyền bộ đệm</span>
semaphore empty = N;      <span class="tok-comment">// số ô còn trống</span>
semaphore full  = 0;      <span class="tok-comment">// số ô đã có hàng</span>

sản xuất:                        tiêu thụ:
  item = produce();                down(full);      <span class="tok-comment">// chờ có hàng</span>
  down(empty);   <span class="tok-comment">// chờ có chỗ</span>       down(mutex);
  down(mutex);                     item = remove();
  insert(item);                    up(mutex);
  up(mutex);                       up(empty);       <span class="tok-comment">// một ô đã trống</span>
  up(full);      <span class="tok-comment">// đã có một món</span>     consume(item);</pre>
<div class="out"><b>Vì sao ba semaphore, và vì sao theo thứ tự đó.</b> <span class="badge">empty</span> và <span class="badge">full</span> đếm tài nguyên; <span class="badge">mutex</span> bảo vệ bộ đệm dùng chung. Semaphore đếm phải được lấy <em>trước</em> mutex.<br>
<b>Đảo hai lệnh down ở bên sản xuất</b> — <span class="badge">down(mutex); down(empty);</span> — là có khoá chết ngay: bên sản xuất giữ mutex trong lúc chờ một ô trống, nên bên tiêu thụ không bao giờ vào được để giải phóng ô. Cả hai ngủ vĩnh viễn. Đúng phép đảo này là câu hỏi thi chuẩn mực.<br>
<b>Chỗ bạn đã dùng nó rồi:</b> <span class="badge">BlockingQueue</span> trong Java, channel của Go, hàng đợi tác vụ của một thread pool, và cái ống trong <span class="badge">ls | grep</span> — nhân hiện thực ống chính là một bộ đệm có giới hạn với đúng lô-gic này.</div>

<h3>2 · Đọc–ghi</h3>
<p>Nhiều người đọc có thể đọc cùng lúc; người ghi cần độc quyền. Đây là hình dạng của mọi cấu trúc dữ liệu dùng chung mà số lần đọc nhiều hơn hẳn số lần ghi.</p>
<pre>semaphore mutex = 1, wrt = 1;  <span class="tok-type">int</span> readcount = 0;

người đọc:                           người ghi:
  down(mutex);                         down(wrt);
  readcount++;                         write();
  <span class="tok-keyword">nếu</span> (readcount == 1) down(wrt);     up(wrt);
  up(mutex);
  read();                            <span class="tok-comment">// người đọc ĐẦU TIÊN khoá người ghi lại,</span>
  down(mutex);                       <span class="tok-comment">// người đọc CUỐI CÙNG thả ra</span>
  readcount--;
  <span class="tok-keyword">nếu</span> (readcount == 0) up(wrt);
  up(mutex);</pre>
<div class="out"><b>Khiếm khuyết của bản này:</b> chừng nào người đọc còn kéo tới liên tục thì <span class="badge">readcount</span> không bao giờ về 0 và người ghi <b>bị đói</b> — có thể chờ mãi mãi. Đây là bản "ưu tiên người đọc".<br>
<b>Ưu tiên người ghi</b> chặn người đọc mới ngay khi có người ghi đang chờ; bản <b>công bằng</b> xếp hàng mọi người theo thứ tự đến. Mức <span class="badge">READ COMMITTED</span> so với <span class="badge">SERIALIZABLE</span> của cơ sở dữ liệu (DBI202, bài 8.3) chính là phép đánh đổi đó ở quy mô khác.<br>
<b>Trong thực tế:</b> <span class="badge">ReentrantReadWriteLock</span> của Java và <span class="badge">sync.RWMutex</span> của Go chính là bài toán này, đã được giải sẵn một lần trong thư viện.</div>

<h3>3 · Bữa tối các triết gia — khoá chết trong năm dòng</h3>
<div class="diagram">Năm triết gia quanh một cái bàn, năm chiếc đũa nằm xen giữa họ.
Muốn ăn, mỗi triết gia cần CẢ chiếc bên trái lẫn chiếc bên phải.</div>
<pre><span class="tok-comment">// lời giải ngây thơ — và nó khoá chết</span>
<span class="tok-keyword">while</span> (1) {
    think();
    down(fork[i]);              <span class="tok-comment">// lấy chiếc bên trái</span>
    down(fork[(i+1) % 5]);      <span class="tok-comment">// lấy chiếc bên phải</span>
    eat();
    up(fork[i]); up(fork[(i+1) % 5]);
}</pre>
<div class="out"><b>Kịch bản đan xen làm hỏng:</b> cả năm triết gia cùng nhấc chiếc đũa bên trái đúng một khoảnh khắc. Giờ mọi chiếc đũa đều có người giữ, mọi triết gia đều chờ chiếc bên phải, và sẽ không ai đặt đũa xuống. Cả bốn điều kiện Coffman (Chương 6) cùng thoả: loại trừ tương hỗ, giữ và chờ, không chiếm quyền, chờ vòng tròn.<br>
<b>Bốn cách chữa chuẩn, mỗi cách phá một điều kiện:</b><br>
<b>a.</b> Chỉ cho tối đa bốn triết gia ngồi bàn (thêm một semaphore khởi tạo bằng 4) — phá <em>chờ vòng tròn</em>.<br>
<b>b.</b> Nhấc cả hai chiếc đũa một cách nguyên tử, trong cùng một mutex — phá <em>giữ và chờ</em>.<br>
<b>c.</b> Cho các triết gia số lẻ lấy chiếc bên phải trước — phá <em>tính đối xứng</em> vốn tạo ra chu trình. Đơn giản nhất và phổ biến nhất.<br>
<b>d.</b> Dùng thời hạn chờ và nhả cả hai chiếc khi thất bại — phá <em>không chiếm quyền</em>, nhưng có nguy cơ livelock (mọi người cùng thử lại nhịp nhàng mãi mãi) nếu độ trễ thử lại không được ngẫu nhiên hoá.</div>

<div class="pitfall"><b>Một lời giải tránh được khoá chết vẫn có thể bỏ đói ai đó.</b> Nếu hai người hàng xóm luân phiên hoàn hảo, triết gia ở giữa họ có thể không bao giờ được ăn, dù hệ thống chẳng bao giờ đứng hình. Không-khoá-chết và không-đói-tài-nguyên là hai tính chất riêng biệt, và đề thi hỏi cả hai.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Monitor và channel: làm cho sai lầm trở nên bất khả thay vì bị cấm.</b> Semaphore dễ sai vì tính đúng đắn phụ thuộc vào việc lập trình viên đặt từng lệnh <span class="badge">down</span> và <span class="badge">up</span> chính xác — đảo một dòng là khoá chết. <b>Monitor</b> (Hoare, 1974) đưa cái khoá vào trong ngôn ngữ: trình biên dịch đảm bảo chỉ một luồng ở bên trong, còn <span class="badge">wait</span>/<span class="badge">notify</span> lo phần điều kiện — từ khoá <span class="badge">synchronized</span> của Java chính là một monitor. Go còn đi xa hơn với khẩu hiệu "đừng giao tiếp bằng cách dùng chung bộ nhớ; hãy dùng chung bộ nhớ bằng cách giao tiếp": một channel <em>chính là</em> bộ đệm có giới hạn, nên lời giải sản xuất–tiêu thụ ở trên rút còn một dòng <span class="badge">ch &lt;- item</span>, không còn semaphore nào để đặt sai thứ tự. <em>Ngoài giáo trình vì môn học dạy cơ chế, còn ngành thiết kế ngôn ngữ thì từ đó tới nay vẫn đang cố xoá bỏ nhu cầu dùng cơ chế ấy.</em></div>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'osg202-quiz-ch2',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: tiến trình, trạng thái, lập lịch, luồng, đồng bộ.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A process is…|||Một tiến trình là…', options: ['a program file on disk|||một tệp chương trình trên đĩa', 'a program in execution with its own memory & state|||một chương trình đang thực thi có bộ nhớ & trạng thái riêng', 'a CPU core|||một nhân CPU', 'a system call|||một system call'], correctIndex: 1, points: 1 },
              { question: 'Saving one process\'s registers and loading another\'s is a…|||Lưu thanh ghi của một tiến trình và nạp của tiến trình khác là một…', options: ['system call|||system call', 'context switch|||chuyển ngữ cảnh', 'deadlock|||bế tắc', 'page fault|||lỗi trang'], correctIndex: 1, points: 1 },
              { question: 'Which scheduling algorithm gives each process a fixed time slice and rotates?|||Thuật toán lập lịch nào cho mỗi tiến trình một lát thời gian cố định và xoay vòng?', options: ['FCFS', 'SJF', 'Round Robin', 'Priority'], correctIndex: 2, points: 1 },
              { question: 'Threads within a process share…|||Các luồng trong một tiến trình chia sẻ…', options: ['nothing|||không gì', 'the same memory|||cùng bộ nhớ', 'separate disks|||các đĩa riêng', 'different CPUs only|||chỉ các CPU khác nhau'], correctIndex: 1, points: 1 },
              { question: 'A mutex is used to…|||Một mutex dùng để…', options: ['speed up the CPU|||tăng tốc CPU', 'let only one thread enter a critical section at a time|||cho chỉ một luồng vào vùng tới hạn tại một thời điểm', 'allocate memory|||cấp phát bộ nhớ', 'schedule processes|||lập lịch tiến trình'], correctIndex: 1, points: 1 },
              { question: 'A race condition happens when…|||Tranh chấp xảy ra khi…', options: ['the CPU runs too fast|||CPU chạy quá nhanh', 'multiple threads update shared data at the same time|||nhiều luồng cập nhật dữ liệu chia sẻ cùng lúc', 'a file is missing|||thiếu một tệp', 'memory is full|||bộ nhớ đầy'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — QUẢN LÝ BỘ NHỚ ══════════════════ */
    {
      title: 'Chapter 3 — Memory Management|||Chương 3 — Quản lý bộ nhớ',
      description: 'Phân trang, bộ nhớ ảo và thay trang.',
      lessons: [
        {
          title: '3.1 — Paging & virtual memory|||3.1 — Phân trang & bộ nhớ ảo',
          slug: 'osg202-3-1-phan-trang',
          simulation: {
            url: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-3-1-phan-trang.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-3-1-phan-trang.jpg',
            scenario: 'virtual-memory',
            durationSeconds: 24,
            caption: { en: "Page table lookup, address by address", vi: "Tra bảng trang, từng địa chỉ một" },
          },
          type: 'VIDEO',
          description: 'Cho mỗi tiến trình một không gian địa chỉ riêng, lớn hơn cả RAM.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Giving every program its own memory</h2>
<p class="lead">Many processes share one physical RAM, yet each must believe it has a private, continuous memory (CLO3). The OS achieves this with <strong>virtual memory</strong> and <strong>paging</strong>, backed by the MMU hardware from CEA201.</p>
<h3>Paging</h3>
<p>Memory is split into fixed-size <strong>pages</strong> (virtual) and <strong>frames</strong> (physical). A <strong>page table</strong> maps each virtual page to a physical frame. When a program uses a virtual address, the MMU translates it to the real physical address.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Program uses</div><div class="lz-t">virtual address</div><div class="lz-d">its own clean space</div></div>
  <div class="lz-step"><div class="lz-k">MMU + page table</div><div class="lz-t">translate</div><div class="lz-d">→ physical frame</div></div>
  <div class="lz-step"><div class="lz-k">Access</div><div class="lz-t">real RAM</div><div class="lz-d">transparent to the program</div></div>
</div>
<h3>Virtual memory bigger than RAM</h3>
<p>Because not all pages are needed at once, inactive pages can be stored on disk (in the <strong>swap</strong> area). A program can use more virtual memory than the physical RAM exists — the OS shuffles pages between RAM and disk as needed.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>The TLB is what makes paging fast.</b> Every memory access needs a page-table lookup — but walking a multi-level page table on each load would be ruinously slow. Hardware solves it with the <strong>TLB (Translation Lookaside Buffer)</strong>, a tiny cache of recent virtual-to-physical translations right inside the MMU. TLB hits make paging nearly free; a context switch that flushes the TLB is one hidden reason switching processes is expensive. <em>Tanenbaum shows the page table, but the TLB is what makes paging fast enough to be usable at all.</em></div>
<div class="callout ok">This is why you can run many big apps on 8 GB of RAM: the OS keeps only the actively-used pages in RAM and parks the rest on disk. Paging is one of the most elegant ideas in operating systems — it gives isolation, protection and the illusion of huge memory all at once.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Cho mỗi chương trình bộ nhớ riêng</h2>
<p class="lead">Nhiều tiến trình chia sẻ một RAM vật lý, nhưng mỗi cái phải tin rằng nó có một bộ nhớ riêng, liên tục (CLO3). OS đạt điều này bằng <strong>bộ nhớ ảo (virtual memory)</strong> và <strong>phân trang (paging)</strong>, được phần cứng MMU từ CEA201 hậu thuẫn.</p>
<h3>Phân trang</h3>
<p>Bộ nhớ được chia thành các <strong>trang (page)</strong> cỡ cố định (ảo) và <strong>khung (frame)</strong> (vật lý). Một <strong>bảng trang (page table)</strong> ánh xạ mỗi trang ảo tới một khung vật lý. Khi chương trình dùng một địa chỉ ảo, MMU dịch nó ra địa chỉ vật lý thật.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Chương trình dùng</div><div class="lz-t">địa chỉ ảo</div><div class="lz-d">không gian riêng gọn của nó</div></div>
  <div class="lz-step"><div class="lz-k">MMU + bảng trang</div><div class="lz-t">dịch</div><div class="lz-d">→ khung vật lý</div></div>
  <div class="lz-step"><div class="lz-k">Truy cập</div><div class="lz-t">RAM thật</div><div class="lz-d">trong suốt với chương trình</div></div>
</div>
<h3>Bộ nhớ ảo lớn hơn RAM</h3>
<p>Vì không phải mọi trang đều cần cùng lúc, các trang không hoạt động có thể lưu trên đĩa (trong vùng <strong>swap</strong>). Một chương trình dùng được nhiều bộ nhớ ảo hơn RAM vật lý có — OS xáo các trang giữa RAM và đĩa khi cần.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>TLB là thứ làm phân trang nhanh.</b> Mỗi lần truy cập bộ nhớ đều cần tra bảng trang — nhưng duyệt một bảng trang nhiều tầng ở mỗi lần nạp sẽ chậm khủng khiếp. Phần cứng giải bằng <strong>TLB (Translation Lookaside Buffer)</strong>, một cache nhỏ chứa các bản dịch ảo→vật lý gần đây ngay trong MMU. TLB trúng làm phân trang gần như miễn phí; một context switch làm xả TLB là một lý do ẩn khiến chuyển tiến trình tốn kém. <em>Tanenbaum trình bày bảng trang, nhưng chính TLB mới làm phân trang đủ nhanh để dùng được.</em></div>
<div class="callout ok">Đây là lý do bạn chạy được nhiều app lớn trên 8 GB RAM: OS chỉ giữ các trang đang dùng trong RAM và gửi phần còn lại lên đĩa. Phân trang là một trong những ý tưởng thanh lịch nhất của hệ điều hành — nó cho cô lập, bảo vệ và ảo giác bộ nhớ khổng lồ cùng một lúc.</div>
</div>
`,
        },
        {
          title: '3.2 — Page faults & replacement|||3.2 — Lỗi trang & thay trang',
          slug: 'osg202-3-2-thay-trang',
          simulation: {
            url: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-3-2-thay-trang.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-3-2-thay-trang.jpg',
            scenario: 'virtual-memory',
            durationSeconds: 21,
            caption: { en: "Page fault, replacement and thrashing", vi: "Lỗi trang, thay trang và hiện tượng thrashing" },
          },
          type: 'VIDEO',
          description: 'Page fault, các thuật toán thay trang (FIFO/LRU) và thrashing.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>When a page is not in RAM</h2>
<p class="lead">If a program accesses a page that is currently on disk, not RAM, the MMU triggers a <strong>page fault</strong> (CLO3). The OS must load that page from disk into a free frame — and if RAM is full, it must first <strong>evict</strong> an existing page to make room.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Access</div><div class="lz-t">page not in RAM</div><div class="lz-d">→ page fault</div></div>
  <div class="lz-step"><div class="lz-k">Evict</div><div class="lz-t">choose a victim page</div><div class="lz-d">if RAM is full</div></div>
  <div class="lz-step"><div class="lz-k">Load</div><div class="lz-t">bring the page in</div><div class="lz-d">resume the program</div></div>
</div>
<h3>Page replacement algorithms</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">FIFO (First-In First-Out)</div><div class="lz-ld">Evict the oldest-loaded page. Simple, but can evict a page that is still heavily used.</div></div>
  <div class="lz-layer"><div class="lz-lt">LRU (Least Recently Used)</div><div class="lz-ld">Evict the page unused for the longest — bets on locality (CEA201&#39;s cache idea). Better hit rate, more overhead to track.</div></div>
  <div class="lz-layer"><div class="lz-lt">Optimal</div><div class="lz-ld">Evict the page not needed for the longest future — the theoretical best, but requires knowing the future (used as a benchmark).</div></div>
</div>
<h3>Worked example · FIFO vs LRU on the same reference string</h3>
<div class="out"><b>Given:</b> reference string 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, with 3 frames.<br><b>FIFO</b> (evict the oldest-loaded): 7→[7] fault · 0→[7,0] fault · 1→[7,0,1] fault · 2→evict 7 (oldest)→[0,1,2] fault · 0→hit (already in) · 3→evict 0→[1,2,3] fault · 0→evict 1→[2,3,0] fault · 4→evict 2→[3,0,4] fault · 2→evict 3→[0,4,2] fault · 3→evict 0→[4,2,3] fault → <b>9 faults</b>.<br><b>LRU</b> (evict least-recently-used): 7→fault · 0→fault · 1→fault · 2→evict 7 (LRU)→fault · 0→hit, refresh 0's recency · 3→evict 1 (now LRU, not 7)→fault · 0→hit · 4→evict 2 (LRU)→fault · 2→evict 3 (LRU)→fault · 3→evict 0 (LRU)→fault → <b>8 faults</b>.<br><b>Reading the result:</b> LRU beats FIFO by one fault here because it kept page 0 in memory (recently reused) instead of evicting it purely by age — exactly the locality bet FIFO ignores.</div>
<div class="pitfall">If a system has too little RAM for its workload, it spends all its time swapping pages in and out instead of doing real work — this is <strong>thrashing</strong>. The machine grinds to a halt even though the CPU is "busy." Adding RAM or running fewer programs fixes it.</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Belady's anomaly — more RAM, more faults.</b> You would expect adding frames to always reduce page faults, but with <strong>FIFO</strong> replacement that is not guaranteed: <strong>Belady's anomaly</strong> is a real reference string where adding a frame <em>increases</em> the number of faults. LRU and other "stack algorithms" are provably immune — a deep reason production kernels approximate LRU with the <em>clock</em> algorithm and never use FIFO. <em>A counter-intuitive theorem the syllabus rarely proves, yet it explains why FIFO is abandoned in practice.</em></div>
<div class="note-ct">Notice the deep parallel with CEA201&#39;s cache: RAM caches the disk, cache caches RAM. Page replacement (LRU) and cache replacement are the same idea at different levels of the memory hierarchy.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Khi một trang không ở trong RAM</h2>
<p class="lead">Nếu một chương trình truy cập một trang hiện đang ở đĩa, không phải RAM, MMU kích hoạt một <strong>lỗi trang (page fault)</strong> (CLO3). OS phải nạp trang đó từ đĩa vào một khung trống — và nếu RAM đầy, phải <strong>đẩy ra (evict)</strong> một trang hiện có để lấy chỗ trước.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Truy cập</div><div class="lz-t">trang không ở RAM</div><div class="lz-d">→ lỗi trang</div></div>
  <div class="lz-step"><div class="lz-k">Đẩy ra</div><div class="lz-t">chọn trang nạn nhân</div><div class="lz-d">nếu RAM đầy</div></div>
  <div class="lz-step"><div class="lz-k">Nạp</div><div class="lz-t">đưa trang vào</div><div class="lz-d">tiếp tục chương trình</div></div>
</div>
<h3>Các thuật toán thay trang</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">FIFO (Vào trước ra trước)</div><div class="lz-ld">Đẩy trang nạp lâu nhất. Đơn giản, nhưng có thể đẩy một trang vẫn đang dùng nhiều.</div></div>
  <div class="lz-layer"><div class="lz-lt">LRU (Ít dùng gần đây nhất)</div><div class="lz-ld">Đẩy trang lâu không dùng nhất — đặt cược vào tính cục bộ (ý tưởng cache CEA201). Tỷ lệ trúng tốt hơn, tốn hơn để theo dõi.</div></div>
  <div class="lz-layer"><div class="lz-lt">Tối ưu (Optimal)</div><div class="lz-ld">Đẩy trang lâu nhất mới cần trong tương lai — tốt nhất về lý thuyết, nhưng cần biết tương lai (dùng làm mốc so).</div></div>
</div>
<h3>Ví dụ có lời giải · FIFO vs LRU trên cùng chuỗi tham chiếu</h3>
<div class="out"><b>Đề bài:</b> chuỗi tham chiếu 7, 0, 1, 2, 0, 3, 0, 4, 2, 3, với 3 khung.<br><b>FIFO</b> (đẩy trang nạp lâu nhất): 7→[7] lỗi · 0→[7,0] lỗi · 1→[7,0,1] lỗi · 2→đẩy 7 (cũ nhất)→[0,1,2] lỗi · 0→trúng (đã có) · 3→đẩy 0→[1,2,3] lỗi · 0→đẩy 1→[2,3,0] lỗi · 4→đẩy 2→[3,0,4] lỗi · 2→đẩy 3→[0,4,2] lỗi · 3→đẩy 0→[4,2,3] lỗi → <b>9 lỗi trang</b>.<br><b>LRU</b> (đẩy trang lâu không dùng nhất): 7→lỗi · 0→lỗi · 1→lỗi · 2→đẩy 7 (LRU)→lỗi · 0→trúng, làm mới độ "gần đây" của 0 · 3→đẩy 1 (giờ là LRU, không phải 7)→lỗi · 0→trúng · 4→đẩy 2 (LRU)→lỗi · 2→đẩy 3 (LRU)→lỗi · 3→đẩy 0 (LRU)→lỗi → <b>8 lỗi trang</b>.<br><b>Đọc kết quả:</b> LRU thắng FIFO 1 lỗi ở đây vì nó giữ trang 0 trong bộ nhớ (vừa dùng lại) thay vì đẩy nó chỉ vì tuổi — đúng cái cược cục bộ mà FIFO bỏ qua.</div>
<div class="pitfall">Nếu một hệ thống có quá ít RAM cho khối lượng công việc, nó dành hết thời gian swap trang ra/vào thay vì làm việc thật — đây là <strong>thrashing</strong>. Máy đứng hình dù CPU "bận." Thêm RAM hoặc chạy ít chương trình hơn để chữa.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nghịch lý Belady — thêm RAM, nhiều lỗi hơn.</b> Bạn sẽ nghĩ thêm khung luôn giảm lỗi trang, nhưng với thay trang <strong>FIFO</strong> điều đó không được bảo đảm: <strong>nghịch lý Belady (Belady's anomaly)</strong> là một chuỗi tham chiếu thật mà thêm một khung lại <em>làm tăng</em> số lỗi trang. LRU và các "thuật toán ngăn xếp" khác miễn nhiễm điều này (chứng minh được) — một lý do sâu vì sao kernel thật xấp xỉ LRU bằng thuật toán <em>clock</em> và không bao giờ dùng FIFO. <em>Một định lý phản trực giác syllabus hiếm khi chứng minh, nhưng nó giải thích vì sao FIFO bị bỏ trong thực tế.</em></div>
<div class="note-ct">Để ý song song sâu với cache CEA201: RAM cache cho đĩa, cache cache cho RAM. Thay trang (LRU) và thay cache là cùng một ý tưởng ở các tầng khác nhau của phân cấp bộ nhớ.</div>
</div>
`,
        },
        {
          title: '3.3 — Address translation: page tables & the TLB|||3.3 — Dịch địa chỉ: bảng trang & TLB',
          slug: 'osg202-3-3-tlb-dia-chi',
          type: 'VIDEO',
          description: 'Tính địa chỉ vật lý từ địa chỉ ảo từng bước, bảng trang nhiều cấp, TLB và EAT — dạng bài thi chắc chắn có.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>From a virtual address to a physical one, digit by digit</h2>
<p class="lead">Lesson 3.1 introduced paging. This lesson does the arithmetic the progress test asks for: split an address, index a table, compute an effective access time.</p>

<div class="formula"><span class="lbl">ADDRESS SPLIT</span>virtual address = ( page number , offset ) &nbsp;·&nbsp; offset bits = log₂(page size)</div>
<div class="formula"><span class="lbl">TRANSLATION</span>physical = frame[page] × page_size + offset</div>

<h3>Worked example 1 — split and translate</h3>
<div class="out"><b>Given:</b> 16-bit virtual addresses, page size 4 KB, and this page table: page 0 → frame 5, page 1 → frame 2, page 2 → frame 9, page 3 → frame 1.<br>
<b>Step 1 — how many offset bits?</b> 4 KB = 2¹² → <b>12 bits of offset</b>, leaving 16 − 12 = <b>4 bits of page number</b> (so 16 pages).<br>
<b>Step 2 — split the virtual address 0x2A3F.</b> In binary: 0010 1010 0011 1111 → page = <b>0010₂ = 2</b>, offset = <b>0xA3F = 2623</b>.<br>
<b>Step 3 — look it up.</b> Page 2 → frame 9.<br>
<b>Step 4 — build the physical address.</b> 9 × 4096 + 2623 = 36864 + 2623 = <b>39487 = 0x9A3F</b>.<br>
<b>Notice:</b> the offset is copied unchanged; only the top bits are replaced. That is why the page size determines how many bits are translated and why page sizes are always powers of two.</div>

<h3>The problem: page tables are enormous</h3>
<div class="out">A 32-bit address space with 4 KB pages has 2²⁰ = 1,048,576 pages. At 4 bytes per entry that is <b>4 MB of page table per process</b> — and it must be in memory. With 100 processes, 400 MB is spent on tables alone. On 64-bit machines a single-level table is not merely wasteful, it is impossible.</div>

<h3>Two solutions</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Multi-level page tables.</b> Split the page number in two: 10 bits index the outer table, 10 bits the inner one. Only the inner tables for regions the process actually uses are allocated — a program using 12 MB needs the outer table plus three inner tables, not 4 MB. The cost is one extra memory access per level (x86-64 uses four levels).</div>
  <div class="lz-layer"><b>Inverted page table.</b> One entry per <em>physical frame</em> instead of per virtual page, so the size depends on RAM, not on the number of processes. Lookup needs a hash of (pid, page) — smaller table, more complex search.</div>
</div>

<h3>The TLB — a cache for translations</h3>
<div class="formula"><span class="lbl">EFFECTIVE ACCESS TIME</span>EAT = h × (t<sub>TLB</sub> + t<sub>mem</sub>) + (1 − h) × (t<sub>TLB</sub> + 2 × t<sub>mem</sub>)</div>
<div class="out"><b>Worked example 2.</b> TLB access 2 ns, memory access 100 ns, hit ratio 98%.<br>
Hit: 2 + 100 = 102 ns · Miss: 2 + 100 (read the page table) + 100 (read the data) = 202 ns<br>
<b>EAT = 0.98 × 102 + 0.02 × 202 = 99.96 + 4.04 = 104 ns</b><br>
Compare with no TLB at all: every access would cost 200 ns. A tiny cache of 64–1,024 entries removes almost the entire cost of paging — because programs obey <em>locality</em> and touch the same few pages over and over.<br>
<b>Now try 90% hit ratio:</b> 0.9 × 102 + 0.1 × 202 = 112 ns. Losing 8 points of hit rate costs 8% of every memory access in the machine — which is why a context switch, that flushes the TLB, is expensive far beyond the register saving.</div>

<h3>What a page-table entry contains</h3>
<table><thead><tr><th>Bit</th><th>Meaning</th><th>Used by</th></tr></thead><tbody>
<tr><td>Frame number</td><td>where the page lives in RAM</td><td>translation</td></tr>
<tr><td><b>Valid / present</b></td><td>is the page in memory at all?</td><td>0 → <b>page fault</b> (lesson 3.2)</td></tr>
<tr><td><b>Modified (dirty)</b></td><td>has it been written since loading?</td><td>if 0, eviction needs no disk write</td></tr>
<tr><td><b>Referenced</b></td><td>has it been used recently?</td><td>clock / LRU approximation</td></tr>
<tr><td>Protection (r/w/x)</td><td>permitted operations</td><td>violation → segmentation fault</td></tr>
<tr><td>Caching disabled</td><td>do not cache this page</td><td>memory-mapped device registers</td></tr>
</tbody></table>

<div class="pitfall"><b>Internal fragmentation is the price of paging.</b> A 5 KB process with 4 KB pages occupies two frames — 8 KB — wasting 3 KB inside the last page. On average half a page is lost per process, which is why the page size is a compromise: larger pages mean smaller page tables but more waste, and 4 KB has been the sweet spot for decades.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Huge pages: when 4 KB is the bottleneck.</b> A database with a 64 GB buffer pool needs 16 million page-table entries, and its random access pattern misses the TLB constantly — the CPU can spend 20–30% of its time walking page tables. Linux offers 2 MB and 1 GB "huge pages": the same 64 GB then needs 32,768 entries, which fit in the TLB, and translation almost disappears from the profile. PostgreSQL, Oracle and the JVM all document how to enable them. <em>Beyond syllabus because the course treats the page size as fixed, while tuning it is standard practice for large in-memory systems.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Từ địa chỉ ảo sang địa chỉ vật lý, từng con số một</h2>
<p class="lead">Bài 3.1 đã giới thiệu phân trang. Bài này làm đúng phần số học mà progress test hỏi: tách địa chỉ, tra bảng, tính thời gian truy cập hiệu dụng.</p>

<div class="formula"><span class="lbl">TÁCH ĐỊA CHỈ</span>địa chỉ ảo = ( số hiệu trang , độ dời ) &nbsp;·&nbsp; số bit độ dời = log₂(kích thước trang)</div>
<div class="formula"><span class="lbl">PHÉP DỊCH</span>vật lý = khung[trang] × kích_thước_trang + độ_dời</div>

<h3>Ví dụ có lời giải 1 — tách và dịch địa chỉ</h3>
<div class="out"><b>Cho:</b> địa chỉ ảo 16 bit, trang 4 KB, và bảng trang: trang 0 → khung 5, trang 1 → khung 2, trang 2 → khung 9, trang 3 → khung 1.<br>
<b>Bước 1 — bao nhiêu bit độ dời?</b> 4 KB = 2¹² → <b>12 bit độ dời</b>, còn lại 16 − 12 = <b>4 bit số hiệu trang</b> (tức 16 trang).<br>
<b>Bước 2 — tách địa chỉ ảo 0x2A3F.</b> Nhị phân: 0010 1010 0011 1111 → trang = <b>0010₂ = 2</b>, độ dời = <b>0xA3F = 2623</b>.<br>
<b>Bước 3 — tra bảng.</b> Trang 2 → khung 9.<br>
<b>Bước 4 — dựng địa chỉ vật lý.</b> 9 × 4096 + 2623 = 36864 + 2623 = <b>39487 = 0x9A3F</b>.<br>
<b>Để ý:</b> phần độ dời được chép nguyên; chỉ các bit cao bị thay. Vì thế kích thước trang quyết định số bit được dịch, và vì thế kích thước trang luôn là luỹ thừa của hai.</div>

<h3>Vấn đề: bảng trang quá to</h3>
<div class="out">Không gian địa chỉ 32 bit với trang 4 KB có 2²⁰ = 1.048.576 trang. Mỗi mục 4 byte là <b>4 MB bảng trang cho mỗi tiến trình</b> — và nó phải nằm trong bộ nhớ. Với 100 tiến trình, riêng bảng đã ngốn 400 MB. Trên máy 64 bit, bảng một cấp không chỉ lãng phí mà là bất khả thi.</div>

<h3>Hai lời giải</h3>
<div class="lz-stack">
  <div class="lz-layer"><b>Bảng trang nhiều cấp.</b> Tách số hiệu trang làm hai: 10 bit tra bảng ngoài, 10 bit tra bảng trong. Chỉ những bảng trong ứng với vùng mà tiến trình thật sự dùng mới được cấp phát — chương trình dùng 12 MB chỉ cần bảng ngoài cộng ba bảng trong, không phải 4 MB. Cái giá là thêm một lần truy cập bộ nhớ cho mỗi cấp (x86-64 dùng bốn cấp).</div>
  <div class="lz-layer"><b>Bảng trang nghịch đảo.</b> Mỗi <em>khung vật lý</em> một mục thay vì mỗi trang ảo một mục, nên kích thước phụ thuộc RAM chứ không phụ thuộc số tiến trình. Tra cứu phải băm cặp (pid, trang) — bảng nhỏ hơn, tìm kiếm phức tạp hơn.</div>
</div>

<h3>TLB — bộ đệm cho các phép dịch</h3>
<div class="formula"><span class="lbl">THỜI GIAN TRUY CẬP HIỆU DỤNG</span>EAT = h × (t<sub>TLB</sub> + t<sub>bộ nhớ</sub>) + (1 − h) × (t<sub>TLB</sub> + 2 × t<sub>bộ nhớ</sub>)</div>
<div class="out"><b>Ví dụ có lời giải 2.</b> Truy cập TLB 2 ns, truy cập bộ nhớ 100 ns, tỉ lệ trúng 98%.<br>
Trúng: 2 + 100 = 102 ns · Trượt: 2 + 100 (đọc bảng trang) + 100 (đọc dữ liệu) = 202 ns<br>
<b>EAT = 0,98 × 102 + 0,02 × 202 = 99,96 + 4,04 = 104 ns</b><br>
So với hoàn toàn không có TLB: mọi lần truy cập đều tốn 200 ns. Một bộ đệm tí hon 64–1.024 mục xoá gần trọn chi phí của phân trang — bởi chương trình tuân theo <em>tính cục bộ</em> và cứ chạm đi chạm lại vài trang giống nhau.<br>
<b>Giờ thử tỉ lệ trúng 90%:</b> 0,9 × 102 + 0,1 × 202 = 112 ns. Mất 8 điểm phần trăm tỉ lệ trúng là đội thêm 8% chi phí cho mọi lần truy cập bộ nhớ của cả máy — vì thế một lần chuyển ngữ cảnh, vốn xoá sạch TLB, đắt hơn nhiều so với chỉ tính phần lưu thanh ghi.</div>

<h3>Một mục bảng trang chứa gì</h3>
<table><thead><tr><th>Bit</th><th>Ý nghĩa</th><th>Ai dùng</th></tr></thead><tbody>
<tr><td>Số hiệu khung</td><td>trang nằm ở đâu trong RAM</td><td>phép dịch địa chỉ</td></tr>
<tr><td><b>Hợp lệ / có mặt</b></td><td>trang có nằm trong bộ nhớ không?</td><td>bằng 0 → <b>lỗi trang</b> (bài 3.2)</td></tr>
<tr><td><b>Đã sửa (dirty)</b></td><td>đã bị ghi kể từ khi nạp chưa?</td><td>bằng 0 thì khi đẩy ra khỏi bộ nhớ không cần ghi đĩa</td></tr>
<tr><td><b>Đã tham chiếu</b></td><td>gần đây có được dùng không?</td><td>thuật toán đồng hồ / xấp xỉ LRU</td></tr>
<tr><td>Bảo vệ (r/w/x)</td><td>các thao tác được phép</td><td>vi phạm → lỗi phân đoạn</td></tr>
<tr><td>Cấm đưa vào cache</td><td>đừng cache trang này</td><td>thanh ghi thiết bị ánh xạ vào bộ nhớ</td></tr>
</tbody></table>

<div class="pitfall"><b>Phân mảnh trong là cái giá của phân trang.</b> Một tiến trình 5 KB với trang 4 KB chiếm hai khung — 8 KB — lãng phí 3 KB bên trong trang cuối. Trung bình mỗi tiến trình mất nửa trang, và vì thế kích thước trang là một thoả hiệp: trang lớn thì bảng trang nhỏ nhưng lãng phí nhiều, và 4 KB đã là điểm cân bằng suốt mấy chục năm.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trang khổng lồ: khi 4 KB trở thành nút thắt.</b> Một cơ sở dữ liệu có vùng đệm 64 GB cần 16 triệu mục bảng trang, và mẫu truy cập ngẫu nhiên của nó làm trượt TLB liên tục — CPU có thể tiêu 20–30% thời gian chỉ để đi bảng trang. Linux cung cấp "trang khổng lồ" 2 MB và 1 GB: cũng 64 GB đó khi ấy chỉ cần 32.768 mục, vừa vặn trong TLB, và phép dịch địa chỉ gần như biến mất khỏi hồ sơ đo. PostgreSQL, Oracle và JVM đều có tài liệu hướng dẫn bật chúng. <em>Ngoài giáo trình vì môn học coi kích thước trang là cố định, trong khi tinh chỉnh nó là việc thường ngày với các hệ thống lớn chạy trong bộ nhớ.</em></div>
</div>
`,
        },
        {
          title: '3.4 — Working set, thrashing & frame allocation|||3.4 — Tập làm việc, thrashing & cấp phát khung',
          slug: 'osg202-3-4-thrashing',
          type: 'VIDEO',
          description: 'Vì sao máy đứng hình khi thiếu RAM: mô hình tập làm việc, hiện tượng thrashing, và cách OS phản ứng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>The failure mode you have seen with your own eyes</h2>
<p class="lead">Open too many browser tabs on a machine with little RAM and everything freezes — the disk light stays on, the CPU sits near zero, and nothing progresses. That is <strong>thrashing</strong>, and this lesson explains exactly what the OS is doing during those minutes.</p>

<h3>Locality and the working set</h3>
<div class="out"><b>Locality of reference:</b> at any moment a process uses only a small subset of its pages — the loop it is in, the array it is scanning, the stack. It moves from one locality to another as it enters a new phase.<br>
<b>The working set W(t, Δ)</b> is the set of pages referenced in the last Δ references. If the OS keeps a process's working set in memory, page faults are rare; if it does not, every step faults.<br>
<b>The rule that follows:</b> a process should only run when its whole working set fits in its allocated frames. Otherwise it will fault continuously without making progress — and it should be swapped out entirely so the remaining processes can work.</div>

<h3>Thrashing, step by step</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Degree of multiprogramming rises; each process gets fewer frames.</span></div>
  <div class="lz-fitem"><b>2</b><span>A process's working set no longer fits → it faults on almost every access.</span></div>
  <div class="lz-fitem"><b>3</b><span>It blocks on disk; CPU utilisation drops.</span></div>
  <div class="lz-fitem"><b>4</b><span>The scheduler sees an idle CPU and <b>admits more processes</b> — the fatal feedback.</span></div>
  <div class="lz-fitem"><b>5</b><span>Frames per process drop further; everyone thrashes; CPU utilisation collapses toward zero.</span></div>
</div>
<div class="out"><b>The signature to recognise:</b> CPU utilisation <em>low</em>, disk utilisation <em>saturated</em>, and adding work makes it worse instead of better. Every other overload looks like the opposite — high CPU, work still completing.<br>
<b>How to fix it:</b> reduce the degree of multiprogramming (suspend or kill processes), or add RAM. Nothing else helps, because the machine is spending its time moving pages rather than executing instructions.</div>

<h3>Two policies the OS must choose</h3>
<table><thead><tr><th>Question</th><th>Options</th><th>Consequence</th></tr></thead><tbody>
<tr><td><b>How many frames per process?</b></td><td>equal split · proportional to size · priority-weighted</td><td>equal wastes frames on small processes; proportional is standard</td></tr>
<tr><td><b>Whose page do we evict?</b></td><td><b>local</b> (only from the faulting process) · <b>global</b> (from any process)</td><td>local isolates a bad process; global adapts better but lets one process steal the whole machine</td></tr>
</tbody></table>
<p>The <b>page-fault-frequency</b> scheme uses the fault rate as a control signal: if a process faults above an upper threshold, give it more frames; below a lower threshold, take some away. It is simple, self-tuning, and close to what real kernels do.</p>

<h3>Worked example — is this system thrashing?</h3>
<div class="out"><b>Measurements:</b> CPU utilisation 8%, disk 97%, 60 processes, 2 GB RAM, average process working set 80 MB.<br>
<b>Required memory:</b> 60 × 80 MB = 4.8 GB against 2 GB available → each process has roughly 1/2.4 of its working set.<br>
<b>Diagnosis:</b> classic thrashing — low CPU with saturated disk, and demand is 2.4× capacity.<br>
<b>Action:</b> suspend about 35 processes (60 × 2 / 4.8 ≈ 25 can run) and let them finish in waves, or add RAM. Adding CPU cores would change nothing at all, because the CPU is not the constrained resource.</div>

<div class="pitfall"><b>Belady's anomaly: more frames can mean more faults.</b> With the FIFO replacement policy, the reference string 1,2,3,4,1,2,5,1,2,3,4,5 produces 9 faults with 3 frames and <b>10 faults with 4</b>. Only "stack algorithms" such as LRU and OPT are immune. It is a favourite exam question precisely because it contradicts intuition.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Modern systems kill instead of thrash.</b> Because thrashing makes a machine unusable rather than merely slow, Linux ships an out-of-memory killer that selects a victim by <span class="badge">oom_score</span> and terminates it; Android and iOS suspend and kill background apps far earlier, which is why a backgrounded app must save its state. Newer kernels expose <b>PSI</b> (pressure stall information) so a supervisor can react <em>before</em> the collapse — and cloud autoscalers use exactly that signal. The engineering judgement is that a fast failure beats an indefinite freeze. <em>Beyond syllabus because the textbook stops at "reduce multiprogramming", while production systems automate the decision.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Kiểu hỏng mà bạn đã tận mắt nhìn thấy</h2>
<p class="lead">Mở quá nhiều tab trình duyệt trên máy ít RAM là mọi thứ đứng hình — đèn ổ cứng sáng liên tục, CPU gần như bằng không, và chẳng gì tiến triển. Đó là <strong>thrashing</strong>, và bài này giải thích chính xác OS đang làm gì trong những phút đó.</p>

<h3>Tính cục bộ và tập làm việc</h3>
<div class="out"><b>Tính cục bộ tham chiếu:</b> ở mỗi thời điểm, một tiến trình chỉ dùng một tập nhỏ các trang của nó — vòng lặp nó đang chạy, mảng nó đang quét, ngăn xếp. Nó chuyển từ vùng cục bộ này sang vùng khác khi bước vào một pha mới.<br>
<b>Tập làm việc W(t, Δ)</b> là tập các trang được tham chiếu trong Δ lần tham chiếu gần nhất. Nếu OS giữ được tập làm việc của một tiến trình trong bộ nhớ thì lỗi trang hiếm khi xảy ra; nếu không thì mỗi bước đều gây lỗi.<br>
<b>Quy tắc rút ra:</b> một tiến trình chỉ nên được chạy khi toàn bộ tập làm việc của nó vừa số khung được cấp. Nếu không, nó sẽ lỗi trang liên miên mà không tiến triển — và nên bị đưa hẳn ra ngoài để các tiến trình còn lại làm việc được.</div>

<h3>Thrashing, từng bước</h3>
<div class="lz-flow">
  <div class="lz-fitem"><b>1</b><span>Mức đa chương tăng lên; mỗi tiến trình được ít khung hơn.</span></div>
  <div class="lz-fitem"><b>2</b><span>Tập làm việc của một tiến trình không còn vừa → nó lỗi trang ở gần như mọi lần truy cập.</span></div>
  <div class="lz-fitem"><b>3</b><span>Nó bị chặn chờ đĩa; mức sử dụng CPU tụt xuống.</span></div>
  <div class="lz-fitem"><b>4</b><span>Bộ lập lịch thấy CPU rảnh và <b>nạp thêm tiến trình vào</b> — vòng phản hồi chết người.</span></div>
  <div class="lz-fitem"><b>5</b><span>Số khung mỗi tiến trình càng ít; ai cũng thrash; mức sử dụng CPU sụp về gần không.</span></div>
</div>
<div class="out"><b>Dấu hiệu nhận ra:</b> CPU <em>thấp</em>, đĩa <em>bão hoà</em>, và thêm việc vào thì càng tệ chứ không đỡ hơn. Mọi kiểu quá tải khác đều trông ngược lại — CPU cao và công việc vẫn hoàn thành.<br>
<b>Cách chữa:</b> giảm mức đa chương (treo hoặc kết thúc bớt tiến trình), hoặc thêm RAM. Không cách nào khác giúp được, vì cỗ máy đang tiêu thời gian để chuyển trang chứ không phải để thi hành lệnh.</div>

<h3>Hai chính sách OS buộc phải chọn</h3>
<table><thead><tr><th>Câu hỏi</th><th>Lựa chọn</th><th>Hệ quả</th></tr></thead><tbody>
<tr><td><b>Mỗi tiến trình bao nhiêu khung?</b></td><td>chia đều · tỉ lệ theo kích thước · có trọng số theo ưu tiên</td><td>chia đều lãng phí khung cho tiến trình nhỏ; chia theo tỉ lệ là chuẩn mực</td></tr>
<tr><td><b>Đẩy trang của ai ra?</b></td><td><b>cục bộ</b> (chỉ lấy của chính tiến trình bị lỗi) · <b>toàn cục</b> (lấy của bất kỳ tiến trình nào)</td><td>cục bộ thì cô lập được tiến trình xấu; toàn cục thích nghi tốt hơn nhưng cho phép một tiến trình chiếm cả máy</td></tr>
</tbody></table>
<p>Cơ chế <b>tần suất lỗi trang</b> dùng chính tỉ lệ lỗi làm tín hiệu điều khiển: tiến trình nào lỗi vượt ngưỡng trên thì cấp thêm khung; dưới ngưỡng dưới thì thu bớt. Cách này đơn giản, tự điều chỉnh, và gần với thứ nhân thật sự làm.</p>

<h3>Ví dụ có lời giải — hệ thống này có thrashing không?</h3>
<div class="out"><b>Số đo:</b> CPU 8%, đĩa 97%, 60 tiến trình, RAM 2 GB, tập làm việc trung bình mỗi tiến trình 80 MB.<br>
<b>Bộ nhớ cần:</b> 60 × 80 MB = 4,8 GB so với 2 GB đang có → mỗi tiến trình chỉ có khoảng 1/2,4 tập làm việc của mình.<br>
<b>Chẩn đoán:</b> thrashing kinh điển — CPU thấp trong khi đĩa bão hoà, và nhu cầu gấp 2,4 lần khả năng.<br>
<b>Hành động:</b> treo khoảng 35 tiến trình (60 × 2 / 4,8 ≈ 25 tiến trình chạy được) và cho chúng chạy theo từng đợt, hoặc thêm RAM. Thêm nhân CPU thì chẳng thay đổi được gì cả, vì CPU không phải tài nguyên đang bị nghẽn.</div>

<div class="pitfall"><b>Nghịch lý Belady: thêm khung lại có thể làm tăng số lỗi trang.</b> Với chính sách thay trang FIFO, dãy tham chiếu 1,2,3,4,1,2,5,1,2,3,4,5 gây 9 lỗi với 3 khung và <b>10 lỗi với 4 khung</b>. Chỉ các "thuật toán ngăn xếp" như LRU và OPT là miễn nhiễm. Đây là câu hỏi thi ưa thích đúng vì nó đi ngược trực giác.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Hệ thống hiện đại chọn giết tiến trình thay vì để thrashing.</b> Vì thrashing làm máy không dùng được chứ không chỉ chậm đi, Linux có sẵn bộ giết-khi-hết-bộ-nhớ, chọn nạn nhân theo <span class="badge">oom_score</span> rồi kết thúc nó; Android và iOS còn treo và giết ứng dụng nền sớm hơn nhiều, và đó là lý do ứng dụng bị đưa xuống nền buộc phải lưu trạng thái. Các nhân mới hơn phơi ra <b>PSI</b> (thông tin áp lực tài nguyên) để một tiến trình giám sát phản ứng <em>trước khi</em> sụp đổ — và các bộ tự động co giãn trên đám mây dùng đúng tín hiệu đó. Phán đoán kỹ thuật ở đây là: hỏng nhanh vẫn hơn treo vô hạn. <em>Ngoài giáo trình vì sách dừng ở "giảm mức đa chương", còn hệ thống sản xuất thì tự động hoá quyết định đó.</em></div>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'osg202-quiz-ch3',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: phân trang, bộ nhớ ảo, page fault, LRU, thrashing.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Paging splits memory into fixed-size…|||Phân trang chia bộ nhớ thành các… cỡ cố định', options: ['files|||tệp', 'pages and frames|||trang và khung', 'processes|||tiến trình', 'sectors|||sector'], correctIndex: 1, points: 1 },
              { question: 'Virtual memory lets a program use…|||Bộ nhớ ảo cho một chương trình dùng…', options: ['only the exact physical RAM|||chỉ đúng RAM vật lý', 'more memory than physical RAM (via disk swap)|||nhiều bộ nhớ hơn RAM vật lý (qua swap đĩa)', 'no memory|||không bộ nhớ', 'another program\'s memory|||bộ nhớ chương trình khác'], correctIndex: 1, points: 1 },
              { question: 'A page fault occurs when…|||Lỗi trang xảy ra khi…', options: ['a file is deleted|||một tệp bị xoá', 'an accessed page is not in RAM|||một trang được truy cập không ở RAM', 'the CPU overheats|||CPU quá nóng', 'two threads clash|||hai luồng đụng nhau'], correctIndex: 1, points: 1 },
              { question: 'The LRU replacement policy evicts the page…|||Chính sách thay trang LRU đẩy trang…', options: ['loaded first|||nạp đầu tiên', 'least recently used|||ít dùng gần đây nhất', 'largest|||lớn nhất', 'most recently used|||dùng gần đây nhất'], correctIndex: 1, points: 1 },
              { question: 'Thrashing is when the system…|||Thrashing là khi hệ thống…', options: ['runs very fast|||chạy rất nhanh', 'spends all its time swapping pages instead of working|||dành hết thời gian swap trang thay vì làm việc', 'has too much RAM|||có quá nhiều RAM', 'has no processes|||không có tiến trình'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 1 ══════════════════ */
    {
      title: 'Progress Test 1 (Intro, Processes, Memory — CLO1–3)|||Progress Test 1 (Giới thiệu, Tiến trình, Bộ nhớ — CLO1–3)',
      description: 'Ôn: khái niệm OS, tiến trình & luồng, quản lý bộ nhớ.',
      lessons: [
        {
          title: 'Progress Test 1 — review|||Progress Test 1 — ôn tổng hợp',
          slug: 'osg202-progress-test-1',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 1–3.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'A program requests a kernel service through a…|||Một chương trình yêu cầu dịch vụ kernel qua một…', options: ['context switch|||chuyển ngữ cảnh', 'system call|||system call', 'page fault|||lỗi trang', 'thread|||luồng'], correctIndex: 1, points: 1 },
              { question: 'Round Robin scheduling is known for being…|||Lập lịch Round Robin nổi tiếng vì…', options: ['unfair|||không công bằng', 'fair and responsive (time slices)|||công bằng và phản hồi nhanh (lát thời gian)', 'the slowest|||chậm nhất', 'only for batch jobs|||chỉ cho job theo lô'], correctIndex: 1, points: 1 },
              { question: 'The critical section problem is solved with…|||Bài toán vùng tới hạn được giải bằng…', options: ['more CPUs|||nhiều CPU hơn', 'synchronization (mutex/semaphore)|||đồng bộ hoá (mutex/semaphore)', 'paging|||phân trang', 'faster disks|||đĩa nhanh hơn'], correctIndex: 1, points: 1 },
              { question: 'The MMU translates…|||MMU dịch…', options: ['files to folders|||tệp sang thư mục', 'virtual addresses to physical addresses|||địa chỉ ảo sang địa chỉ vật lý', 'code to machine language|||code sang mã máy', 'threads to processes|||luồng sang tiến trình'], correctIndex: 1, points: 1 },
              { question: 'Constant swapping that halts real work is called…|||Swap liên tục làm ngưng việc thật gọi là…', options: ['a race condition|||tranh chấp', 'thrashing|||thrashing', 'a context switch|||chuyển ngữ cảnh', 'a deadlock|||bế tắc'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — HỆ THỐNG TỆP ══════════════════ */
    {
      title: 'Chapter 4 — File Systems|||Chương 4 — Hệ thống tệp',
      description: 'Tệp, thư mục và cách hệ thống tệp lưu dữ liệu trên đĩa.',
      lessons: [
        {
          title: '4.1 — Files, directories & implementation|||4.1 — Tệp, thư mục & cài đặt',
          slug: 'osg202-4-1-he-thong-tep',
          type: 'VIDEO',
          description: 'Cách OS tổ chức đĩa thành tệp và thư mục, và cấp phát khối.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>How the OS organizes storage</h2>
<p class="lead">A disk is just a sea of blocks. The <strong>file system</strong> (CLO4) is the OS component that turns those blocks into the named files and folders you actually use — and remembers where each file&#39;s data lives.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">File</div><div class="lz-ld">A named collection of data + metadata (name, size, dates, permissions, owner).</div></div>
  <div class="lz-layer"><div class="lz-lt">Directory (folder)</div><div class="lz-ld">A special file that maps names to files — forming the tree of folders (a tree, as in MAD101!).</div></div>
  <div class="lz-layer"><div class="lz-lt">Path</div><div class="lz-ld">The route through the tree, e.g. /home/an/report.txt.</div></div>
</div>
<h3>How a file&#39;s blocks are tracked</h3>
<p>A file&#39;s data usually spans many disk blocks. The file system must record which blocks belong to which file:</p>
<table>
  <thead><tr><th>Method</th><th>Idea</th></tr></thead>
  <tbody>
    <tr><td>Contiguous</td><td>Store the file in consecutive blocks. Fast to read, but causes fragmentation.</td></tr>
    <tr><td>Linked</td><td>Each block points to the next (like a linked list). No fragmentation, but slow random access.</td></tr>
    <tr><td>Indexed (inode)</td><td>An index block lists all the file&#39;s blocks. Used by Unix/Linux — fast and flexible.</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Journaling — surviving a crash mid-write.</b> If the power dies during a write, block and inode updates can leave the file system half-updated and corrupt. Modern file systems (ext4, NTFS, XFS) add a <strong>journal</strong>: they first log what they are about to do, then perform it, so after a crash the OS replays or discards incomplete entries. <em>That is why <code>fsck</code> on a modern disk finishes in seconds instead of scanning the whole drive — crash consistency, which the syllabus's allocation methods do not address.</em></div>
<div class="note-ct">In Linux, each file has an <strong>inode</strong> holding its metadata and block pointers. The file system also tracks free space (which blocks are available). Run <code>ls -l</code> to see file metadata, and <code>df</code> to see free space — theory made visible.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Cách OS tổ chức lưu trữ</h2>
<p class="lead">Một đĩa chỉ là một biển các khối (block). <strong>Hệ thống tệp (file system)</strong> (CLO4) là thành phần OS biến các khối đó thành tệp và thư mục có tên mà bạn thực sự dùng — và nhớ dữ liệu mỗi tệp nằm ở đâu.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Tệp (file)</div><div class="lz-ld">Một tập dữ liệu có tên + metadata (tên, kích thước, ngày, quyền, chủ sở hữu).</div></div>
  <div class="lz-layer"><div class="lz-lt">Thư mục (directory/folder)</div><div class="lz-ld">Một tệp đặc biệt ánh xạ tên tới tệp — tạo thành cây thư mục (một cây, như MAD101!).</div></div>
  <div class="lz-layer"><div class="lz-lt">Đường dẫn (path)</div><div class="lz-ld">Lối đi xuyên cây, vd /home/an/report.txt.</div></div>
</div>
<h3>Cách theo dõi các khối của một tệp</h3>
<p>Dữ liệu một tệp thường trải trên nhiều khối đĩa. Hệ thống tệp phải ghi khối nào thuộc tệp nào:</p>
<table>
  <thead><tr><th>Phương pháp</th><th>Ý tưởng</th></tr></thead>
  <tbody>
    <tr><td>Liên tục (contiguous)</td><td>Lưu tệp trong các khối liền kề. Đọc nhanh, nhưng gây phân mảnh.</td></tr>
    <tr><td>Liên kết (linked)</td><td>Mỗi khối trỏ tới khối kế (như danh sách liên kết). Không phân mảnh, nhưng truy cập ngẫu nhiên chậm.</td></tr>
    <tr><td>Chỉ mục (inode)</td><td>Một khối chỉ mục liệt kê mọi khối của tệp. Unix/Linux dùng — nhanh và linh hoạt.</td></tr>
  </tbody>
</table>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nhật ký (journaling) — sống sót khi mất điện giữa lúc ghi.</b> Nếu mất điện lúc đang ghi, cập nhật khối và inode có thể để hệ thống tệp dở dang và hỏng. Hệ thống tệp hiện đại (ext4, NTFS, XFS) thêm một <strong>nhật ký (journal)</strong>: chúng ghi trước việc sắp làm vào log, rồi mới thực hiện, nên sau sự cố OS có thể phát lại hoặc bỏ các mục dở. <em>Đó là lý do <code>fsck</code> trên đĩa hiện đại xong trong vài giây thay vì quét cả ổ — tính nhất quán khi sự cố, điều các phương pháp cấp phát trong syllabus không đề cập.</em></div>
<div class="note-ct">Trong Linux, mỗi tệp có một <strong>inode</strong> giữ metadata và con trỏ khối của nó. Hệ thống tệp cũng theo dõi chỗ trống (khối nào còn dùng được). Chạy <code>ls -l</code> để thấy metadata tệp, và <code>df</code> để thấy chỗ trống — lý thuyết được nhìn thấy.</div>
</div>
`,
        },
        {
          title: '4.2 — Allocation methods, i-nodes & permissions|||4.2 — Cách cấp phát, i-node & quyền truy cập',
          slug: 'osg202-4-2-inode',
          type: 'VIDEO',
          description: 'Ba cách cấp phát khối đĩa, cấu trúc i-node của UNIX, liên kết cứng/mềm và quyền rwx trên Linux.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>How a file's blocks are actually found on disk</h2>
<p class="lead">A file is a sequence of bytes to you, and a set of scattered blocks to the disk. The mapping between the two is the whole design problem of a file system — and there are exactly three classical answers.</p>

<h3>Three allocation methods</h3>
<table><thead><tr><th></th><th>Contiguous</th><th>Linked</th><th>Indexed (i-node)</th></tr></thead><tbody>
<tr><td>Idea</td><td>blocks 100–104 in a row</td><td>each block stores the next block's number</td><td>one index block lists every block number</td></tr>
<tr><td>Sequential read</td><td><b>fastest</b> (no seeking)</td><td>ok</td><td>fast</td></tr>
<tr><td>Random access to byte n</td><td><b>O(1)</b></td><td><b>O(n)</b> — must follow the chain</td><td><b>O(1)</b> after reading the index</td></tr>
<tr><td>External fragmentation</td><td><b>yes</b>, badly</td><td>none</td><td>none</td></tr>
<tr><td>Growing a file</td><td>often impossible</td><td>easy</td><td>easy</td></tr>
<tr><td>Used by</td><td>CD-ROM, some real-time systems</td><td>FAT (with the chain moved into a table)</td><td><b>UNIX/Linux (ext4), NTFS</b></td></tr>
</tbody></table>
<div class="out"><b>Why FAT is really "linked, improved".</b> Storing the next-block pointer inside each block means random access needs a disk read per hop. FAT moves all the pointers into one File Allocation Table kept in memory, so the chain can be followed without touching the disk — which is why FAT worked acceptably on floppies and still runs every USB stick and SD card.</div>

<h3>The UNIX i-node — the structure worth drawing from memory</h3>
<div class="diagram">i-node (typically 128 bytes)
├─ mode (type + rwx), uid, gid
├─ size, timestamps (atime, mtime, ctime), link count
├─ 12 direct block pointers        → 12 × 4 KB  =    48 KB
├─  1 single indirect  → block of 1024 pointers →     4 MB
├─  1 double indirect  → 1024 × 1024 pointers   →     4 GB
└─  1 triple indirect  → 1024³ pointers          →     4 TB</div>
<div class="out"><b>Why this odd shape?</b> Because most files are tiny. A 20 KB file fits entirely in the 12 direct pointers — one i-node read and you have every block, no extra I/O. Large files pay for one, two or three extra reads, but they are rare. The structure is optimised for the actual distribution of file sizes, which is the mark of a good design.<br>
<b>Worked example — where is byte 5,000,000 of a file?</b> With 4 KB blocks that is block 5,000,000 / 4096 = block 1220. Direct pointers cover blocks 0–11; the single indirect covers 12–1035; so block 1220 lies in the <b>double indirect</b> region, at position 1220 − 1036 = 184. Reaching it costs: i-node → double-indirect block → single-indirect block → data block = <b>4 disk reads</b> (1 if the metadata is cached).<br>
<b>Note what the i-node does NOT contain: the file name.</b> Names live in directories, which are simply files containing (name, i-node number) pairs. That separation is what makes hard links possible.</div>

<h3>Hard links versus symbolic links</h3>
<pre>ln  file.txt hard.txt     <span class="tok-comment"># second NAME for the same i-node</span>
ln -s file.txt soft.txt   <span class="tok-comment"># a small file whose contents are the path "file.txt"</span></pre>
<table><thead><tr><th></th><th>Hard link</th><th>Symbolic link</th></tr></thead><tbody>
<tr><td>Points to</td><td>the i-node</td><td>a path (text)</td></tr>
<tr><td>Delete the original</td><td>data survives (link count &gt; 0)</td><td><b>link breaks</b> — dangling</td></tr>
<tr><td>Across file systems</td><td><b>no</b></td><td>yes</td></tr>
<tr><td>To a directory</td><td>no (would create cycles)</td><td>yes</td></tr>
</tbody></table>
<div class="out"><b>The link count is how deletion works.</b> <span class="badge">rm</span> does not erase data — it removes the directory entry and decrements the count. Blocks are freed only when the count reaches 0 <em>and</em> no process still has the file open. That is why deleting a huge log file while a running program holds it frees no space at all until the program exits, a classic "the disk is still full" incident.</div>

<h3>Permissions — reading <span class="badge">-rwxr-xr--</span></h3>
<div class="out"><b>Ten characters:</b> type (<span class="badge">-</span> file, <span class="badge">d</span> directory, <span class="badge">l</span> link), then owner rwx, group rwx, others rwx.<br>
<b>Octal:</b> r=4, w=2, x=1 → <span class="badge">rwxr-xr--</span> = 7, 5, 4 = <b>754</b>. <span class="badge">chmod 644 file</span> = owner read/write, everyone else read only.<br>
<b>On a directory the letters mean something different:</b> <span class="badge">r</span> = list the names, <span class="badge">w</span> = create/delete entries, <span class="badge">x</span> = <em>enter</em> it and access files inside. A directory with r but not x lets you see names and open nothing — a favourite exam question.<br>
<b>Why deleting a file needs write permission on the directory, not on the file:</b> deletion removes a directory entry. That is also why you can delete a read-only file you own the directory of.</div>

<div class="pitfall"><b>Running out of i-nodes while the disk shows free space.</b> The i-node table is fixed at format time, so a partition full of tiny files can exhaust it: <span class="badge">df -h</span> shows 40% free while <span class="badge">df -i</span> shows 100% used, and every write fails with "No space left on device". The only fixes are deleting files or reformatting with more i-nodes — which is why mail and cache partitions are formatted with a higher i-node density.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Journaling: how a file system survives a power cut.</b> Updating a file touches several structures — the i-node, the data block, the free-block bitmap, the directory. A crash between them leaves the file system inconsistent, and the old repair (<span class="badge">fsck</span>) scanned the entire disk, taking hours on a large volume. A <b>journal</b> writes the intended changes to a small log first, then applies them; after a crash the OS replays or discards the log in seconds. ext4, NTFS and XFS all do this, and <span class="badge">data=ordered</span> versus <span class="badge">data=journal</span> is the trade between speed and how much data is protected. <em>Beyond syllabus because the course covers structure but not crash consistency, which is the property users actually notice.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Các khối của một tệp thật sự được tìm ra trên đĩa như thế nào</h2>
<p class="lead">Với bạn, tệp là một dãy byte; với đĩa, nó là một mớ khối nằm rải rác. Ánh xạ giữa hai thứ đó chính là toàn bộ bài toán thiết kế của một hệ thống tệp — và có đúng ba câu trả lời kinh điển.</p>

<h3>Ba cách cấp phát</h3>
<table><thead><tr><th></th><th>Liên tục</th><th>Liên kết</th><th>Chỉ mục (i-node)</th></tr></thead><tbody>
<tr><td>Ý tưởng</td><td>các khối 100–104 nằm liền nhau</td><td>mỗi khối lưu số hiệu khối kế tiếp</td><td>một khối chỉ mục liệt kê mọi số hiệu khối</td></tr>
<tr><td>Đọc tuần tự</td><td><b>nhanh nhất</b> (không phải dịch đầu từ)</td><td>ổn</td><td>nhanh</td></tr>
<tr><td>Truy cập ngẫu nhiên tới byte n</td><td><b>O(1)</b></td><td><b>O(n)</b> — phải lần theo dây</td><td><b>O(1)</b> sau khi đọc chỉ mục</td></tr>
<tr><td>Phân mảnh ngoài</td><td><b>có</b>, rất nặng</td><td>không</td><td>không</td></tr>
<tr><td>Cho tệp lớn thêm</td><td>thường bất khả</td><td>dễ</td><td>dễ</td></tr>
<tr><td>Được dùng bởi</td><td>CD-ROM, vài hệ thời gian thực</td><td>FAT (dây được dời vào một bảng)</td><td><b>UNIX/Linux (ext4), NTFS</b></td></tr>
</tbody></table>
<div class="out"><b>Vì sao FAT thực chất là "liên kết, cải tiến".</b> Lưu con trỏ khối kế tiếp ngay trong mỗi khối nghĩa là truy cập ngẫu nhiên phải đọc đĩa ở mỗi bước nhảy. FAT dời toàn bộ con trỏ vào một Bảng Cấp phát Tệp giữ trong bộ nhớ, nên lần theo dây mà không cần chạm đĩa — và vì thế FAT chạy chấp nhận được trên đĩa mềm, đồng thời vẫn đang vận hành mọi thẻ USB và thẻ SD.</div>

<h3>i-node của UNIX — cấu trúc đáng vẽ được từ trí nhớ</h3>
<div class="diagram">i-node (thường 128 byte)
├─ mode (kiểu + rwx), uid, gid
├─ kích thước, mốc thời gian (atime, mtime, ctime), số liên kết
├─ 12 con trỏ khối trực tiếp       → 12 × 4 KB  =    48 KB
├─  1 gián tiếp đơn  → khối chứa 1024 con trỏ →     4 MB
├─  1 gián tiếp đôi  → 1024 × 1024 con trỏ    →     4 GB
└─  1 gián tiếp ba   → 1024³ con trỏ           →     4 TB</div>
<div class="out"><b>Vì sao hình dạng kỳ lạ này?</b> Vì phần lớn tệp đều bé. Một tệp 20 KB nằm gọn trong 12 con trỏ trực tiếp — đọc một i-node là có đủ mọi khối, không tốn thêm lần I/O nào. Tệp lớn phải trả thêm một, hai hoặc ba lần đọc, nhưng chúng hiếm. Cấu trúc được tối ưu theo đúng phân bố kích thước tệp thực tế, và đó là dấu hiệu của một thiết kế tốt.<br>
<b>Ví dụ có lời giải — byte thứ 5.000.000 của một tệp nằm ở đâu?</b> Với khối 4 KB thì đó là khối 5.000.000 / 4096 = khối 1220. Các con trỏ trực tiếp phủ khối 0–11; gián tiếp đơn phủ 12–1035; nên khối 1220 nằm trong vùng <b>gián tiếp đôi</b>, tại vị trí 1220 − 1036 = 184. Đi tới nó tốn: i-node → khối gián tiếp đôi → khối gián tiếp đơn → khối dữ liệu = <b>4 lần đọc đĩa</b> (còn 1 nếu siêu dữ liệu đã nằm trong cache).<br>
<b>Chú ý thứ i-node KHÔNG chứa: tên tệp.</b> Tên nằm trong thư mục, mà thư mục chỉ là một tệp chứa các cặp (tên, số hiệu i-node). Chính sự tách bạch đó làm cho liên kết cứng trở nên khả thi.</div>

<h3>Liên kết cứng và liên kết mềm</h3>
<pre>ln  file.txt hard.txt     <span class="tok-comment"># một TÊN thứ hai cho cùng một i-node</span>
ln -s file.txt soft.txt   <span class="tok-comment"># một tệp nhỏ mà nội dung là đường dẫn "file.txt"</span></pre>
<table><thead><tr><th></th><th>Liên kết cứng</th><th>Liên kết mềm</th></tr></thead><tbody>
<tr><td>Trỏ tới</td><td>i-node</td><td>một đường dẫn (dạng chữ)</td></tr>
<tr><td>Xoá tệp gốc</td><td>dữ liệu vẫn còn (số liên kết &gt; 0)</td><td><b>liên kết gãy</b> — trỏ vào hư không</td></tr>
<tr><td>Xuyên hệ thống tệp</td><td><b>không</b></td><td>được</td></tr>
<tr><td>Trỏ tới thư mục</td><td>không (sẽ tạo chu trình)</td><td>được</td></tr>
</tbody></table>
<div class="out"><b>Số liên kết chính là cách việc xoá hoạt động.</b> Lệnh <span class="badge">rm</span> không xoá dữ liệu — nó gỡ mục trong thư mục và giảm số liên kết đi một. Các khối chỉ được giải phóng khi số này về 0 <em>và</em> không tiến trình nào còn mở tệp. Vì thế xoá một tệp log khổng lồ trong lúc một chương trình đang giữ nó thì không giải phóng được byte nào cho tới khi chương trình thoát — sự cố "ổ đĩa vẫn đầy" kinh điển.</div>

<h3>Quyền truy cập — đọc <span class="badge">-rwxr-xr--</span></h3>
<div class="out"><b>Mười ký tự:</b> kiểu (<span class="badge">-</span> tệp, <span class="badge">d</span> thư mục, <span class="badge">l</span> liên kết), rồi rwx của chủ sở hữu, rwx của nhóm, rwx của những người khác.<br>
<b>Hệ bát phân:</b> r=4, w=2, x=1 → <span class="badge">rwxr-xr--</span> = 7, 5, 4 = <b>754</b>. <span class="badge">chmod 644 file</span> = chủ đọc/ghi, còn lại chỉ đọc.<br>
<b>Trên thư mục, các chữ cái mang nghĩa khác:</b> <span class="badge">r</span> = liệt kê được tên, <span class="badge">w</span> = tạo/xoá mục, <span class="badge">x</span> = <em>đi vào</em> và truy cập tệp bên trong. Thư mục có r mà không có x thì bạn thấy tên nhưng không mở được gì — câu hỏi thi rất được ưa chuộng.<br>
<b>Vì sao xoá một tệp cần quyền ghi trên THƯ MỤC chứ không phải trên tệp:</b> vì xoá là gỡ một mục trong thư mục. Đó cũng là lý do bạn xoá được một tệp chỉ-đọc nếu bạn sở hữu thư mục chứa nó.</div>

<div class="pitfall"><b>Hết i-node trong khi đĩa vẫn báo còn chỗ.</b> Bảng i-node bị ấn định lúc định dạng, nên một phân vùng đầy tệp tí hon có thể làm cạn nó: <span class="badge">df -h</span> báo còn trống 40% trong khi <span class="badge">df -i</span> báo đã dùng 100%, và mọi lệnh ghi đều lỗi "No space left on device". Cách chữa duy nhất là xoá bớt tệp hoặc định dạng lại với nhiều i-node hơn — vì thế các phân vùng chứa mail và cache thường được định dạng với mật độ i-node cao hơn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nhật ký hoá: cách một hệ thống tệp sống sót qua cúp điện.</b> Cập nhật một tệp đụng vào nhiều cấu trúc — i-node, khối dữ liệu, bản đồ bit khối trống, thư mục. Sập nguồn ở giữa để lại hệ thống tệp mâu thuẫn, và cách sửa cũ (<span class="badge">fsck</span>) phải quét cả đĩa, mất hàng giờ với ổ lớn. <b>Nhật ký</b> ghi các thay đổi dự định vào một bản log nhỏ trước rồi mới áp dụng; sau sự cố, OS phát lại hoặc huỷ bản log trong vài giây. ext4, NTFS và XFS đều làm vậy, và <span class="badge">data=ordered</span> so với <span class="badge">data=journal</span> là phép đánh đổi giữa tốc độ và mức độ dữ liệu được bảo vệ. <em>Ngoài giáo trình vì môn học nói về cấu trúc chứ không nói về tính nhất quán sau sự cố, thứ mà người dùng thật sự cảm nhận được.</em></div>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'osg202-quiz-ch4',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: tệp, thư mục, path, cấp phát khối, inode.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'A directory is essentially…|||Một thư mục về cơ bản là…', options: ['a CPU register|||một thanh ghi CPU', 'a special file mapping names to files|||một tệp đặc biệt ánh xạ tên tới tệp', 'a process|||một tiến trình', 'a page table|||một bảng trang'], correctIndex: 1, points: 1 },
              { question: 'The folder structure of a file system forms a…|||Cấu trúc thư mục của một hệ thống tệp tạo thành một…', options: ['graph with cycles|||đồ thị có chu trình', 'tree|||cây', 'queue|||hàng đợi', 'stack|||ngăn xếp'], correctIndex: 1, points: 1 },
              { question: 'Which allocation method is used by Unix/Linux?|||Phương pháp cấp phát nào Unix/Linux dùng?', options: ['contiguous|||liên tục', 'linked|||liên kết', 'indexed (inode)|||chỉ mục (inode)', 'none|||không cái nào'], correctIndex: 2, points: 1 },
              { question: 'A file\'s metadata (size, dates, permissions) in Linux is stored in its…|||Metadata của một tệp (kích thước, ngày, quyền) trong Linux được lưu trong…', options: ['inode', 'kernel', 'CPU', 'swap'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — HỆ THỐNG I/O ══════════════════ */
    {
      title: 'Chapter 5 — Input/Output Systems|||Chương 5 — Hệ thống Nhập/Xuất',
      description: 'Nguyên lý phần cứng & phần mềm I/O và driver thiết bị.',
      lessons: [
        {
          title: '5.1 — I/O hardware & software|||5.1 — Phần cứng & phần mềm I/O',
          slug: 'osg202-5-1-io',
          simulation: {
            url: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-5-1-io.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-5-1-io.jpg',
            scenario: 'interrupts',
            durationSeconds: 25,
            caption: { en: "Interrupts and DMA: who moves the bytes", vi: "Ngắt và DMA: ai là người chuyển byte" },
          },
          type: 'VIDEO',
          description: 'Driver thiết bị, các lớp phần mềm I/O và đệm (buffering).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Managing the zoo of devices</h2>
<p class="lead">A computer connects to countless devices — keyboards, disks, printers, networks — each with different speeds and quirks. The OS&#39;s I/O system (CLO5) hides this diversity behind a uniform interface, so programs can just "read" or "write" without knowing the device details.</p>
<h3>Device drivers</h3>
<p>A <strong>device driver</strong> is OS code that knows how to talk to one specific kind of hardware. Above the drivers sits <strong>device-independent I/O software</strong> that offers programs a clean, uniform API — this is abstraction (from CEA201/OOP) applied to hardware.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">User program</div><div class="lz-ld">Calls read()/write() — device-agnostic.</div></div>
  <div class="lz-layer"><div class="lz-lt">Device-independent OS layer</div><div class="lz-ld">Uniform interface, naming, buffering, error handling.</div></div>
  <div class="lz-layer"><div class="lz-lt">Device driver</div><div class="lz-ld">Speaks the specific hardware&#39;s language.</div></div>
  <div class="lz-layer"><div class="lz-lt">The device</div><div class="lz-ld">Disk, printer, network card…</div></div>
</div>
<h3>The three I/O techniques (recap from CEA201)</h3>
<p>The OS uses <strong>polling</strong>, <strong>interrupts</strong>, or <strong>DMA</strong> to transfer data. <strong>Buffering</strong> smooths the speed mismatch: data is collected in a memory buffer so a slow device and a fast CPU do not have to wait on each other.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Zero-copy — skipping the pointless copies.</b> A naive file-to-network transfer copies data several times: disk → kernel buffer → user buffer → socket buffer → network card. Linux offers <strong>zero-copy</strong> paths like <code>sendfile()</code> and <code>splice()</code> that let DMA move data straight from the page cache to the NIC, skipping the user-space bounce. <em>High-performance servers and CDNs rely on this to serve files at line rate — extending the clean read()/write() model to how real systems dodge its hidden copying cost.</em></div>
<div class="note-ct">This is the software side of CEA201&#39;s I/O chapter. Together they show the full stack: hardware provides interrupts and DMA; the OS provides drivers and a uniform API; your program just calls read(). Each layer hides the complexity below.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Quản lý "sở thú" thiết bị</h2>
<p class="lead">Một máy tính nối với vô số thiết bị — bàn phím, đĩa, máy in, mạng — mỗi cái tốc độ và tính nết khác nhau. Hệ thống I/O của OS (CLO5) giấu sự đa dạng này sau một giao diện thống nhất, để chương trình chỉ cần "đọc" hay "ghi" mà không cần biết chi tiết thiết bị.</p>
<h3>Driver thiết bị</h3>
<p>Một <strong>driver thiết bị (device driver)</strong> là code OS biết cách nói chuyện với một loại phần cứng cụ thể. Trên các driver là <strong>phần mềm I/O độc lập thiết bị</strong> cung cấp cho chương trình một API sạch, thống nhất — đây là trừu tượng (từ CEA201/OOP) áp cho phần cứng.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Chương trình người dùng</div><div class="lz-ld">Gọi read()/write() — không phụ thuộc thiết bị.</div></div>
  <div class="lz-layer"><div class="lz-lt">Lớp OS độc lập thiết bị</div><div class="lz-ld">Giao diện thống nhất, đặt tên, đệm, xử lý lỗi.</div></div>
  <div class="lz-layer"><div class="lz-lt">Driver thiết bị</div><div class="lz-ld">Nói ngôn ngữ của phần cứng cụ thể.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thiết bị</div><div class="lz-ld">Đĩa, máy in, card mạng…</div></div>
</div>
<h3>Ba kỹ thuật I/O (ôn lại từ CEA201)</h3>
<p>OS dùng <strong>polling</strong>, <strong>ngắt (interrupt)</strong>, hoặc <strong>DMA</strong> để truyền dữ liệu. <strong>Đệm (buffering)</strong> làm mượt chênh lệch tốc độ: dữ liệu được gom trong một bộ đệm bộ nhớ để thiết bị chậm và CPU nhanh không phải chờ nhau.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Zero-copy — bỏ những lần sao chép vô nghĩa.</b> Một lần truyền tệp-ra-mạng ngây thơ sao chép dữ liệu nhiều lần: đĩa → buffer kernel → buffer user → buffer socket → card mạng. Linux cung cấp các đường <strong>zero-copy</strong> như <code>sendfile()</code> và <code>splice()</code> để DMA chuyển dữ liệu thẳng từ page cache tới card mạng (NIC), bỏ qua vòng vòng qua user space. <em>Máy chủ hiệu năng cao và CDN dựa vào điều này để phục vụ tệp ở tốc độ đường truyền — mở rộng mô hình read()/write() gọn gàng tới cách hệ thống thật né chi phí sao chép ẩn của nó.</em></div>
<div class="note-ct">Đây là phía phần mềm của chương I/O ở CEA201. Cùng nhau chúng cho thấy cả stack: phần cứng cung cấp ngắt và DMA; OS cung cấp driver và một API thống nhất; chương trình của bạn chỉ gọi read(). Mỗi tầng giấu độ phức tạp bên dưới.</div>
</div>
`,
        },
        {
          title: '5.2 — Disk scheduling, calculated|||5.2 — Lập lịch đĩa, tính bằng số',
          slug: 'osg202-5-2-lap-lich-dia',
          type: 'VIDEO',
          description: 'FCFS/SSTF/SCAN/C-SCAN/LOOK trên cùng một dãy yêu cầu — tính tổng quãng đường di chuyển đầu từ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>The other calculation the progress test asks for</h2>
<p class="lead">A disk access costs seek time + rotational delay + transfer time, and the <strong>seek</strong> dominates by far. So the OS reorders pending requests to move the arm as little as possible — and the exam asks you to compute exactly how much movement each policy causes.</p>

<div class="formula"><span class="lbl">ACCESS TIME</span>t = seek + rotational latency + transfer &nbsp;·&nbsp; seek ≈ 5–10 ms, rotation ≈ 4 ms at 7200 rpm, transfer ≈ 0.1 ms</div>

<h3>The request queue used throughout</h3>
<div class="diagram">Cylinders 0–199. Head currently at 53, moving toward higher numbers.
Pending requests: 98, 183, 37, 122, 14, 124, 65, 67</div>

<h3>1 · FCFS — serve in arrival order</h3>
<div class="out">53 → 98 → 183 → 37 → 122 → 14 → 124 → 65 → 67<br>
Movement: 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = <b>640 cylinders</b><br>
Fair and simple, but the arm crosses the disk repeatedly — worst possible movement.</div>

<h3>2 · SSTF — shortest seek time first</h3>
<div class="out">From 53 the nearest is 65 → then 67 → 37 → 14 → 98 → 122 → 124 → 183<br>
Movement: 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = <b>236 cylinders</b> — a 63% improvement.<br>
<b>The flaw:</b> requests far from the head can be postponed indefinitely while nearby ones keep arriving — <b>starvation</b>, exactly as in SJF scheduling (lesson 2.4).</div>

<h3>3 · SCAN (the elevator) — sweep to the end, then reverse</h3>
<div class="out">Moving up: 53 → 65 → 67 → 98 → 122 → 124 → 183 → <b>199</b> (the end), then down: 37 → 14<br>
Movement: (199 − 53) + (199 − 14) = 146 + 185 = <b>331 cylinders</b><br>
No starvation — every request is served within one sweep. The name comes from a lift: it does not change direction just because someone nearer pressed a button.</div>

<h3>4 · C-SCAN — circular, one direction only</h3>
<div class="out">Up: 53 → 65 → 67 → 98 → 122 → 124 → 183 → 199, then <b>jump to 0</b> and continue up: 14 → 37<br>
Movement: 146 + 199 (the return jump) + 37 = <b>382 cylinders</b><br>
More total movement than SCAN, but <b>much fairer waiting times</b>: with SCAN the cylinders near the turning point get served twice in quick succession while the far end waits a full sweep. C-SCAN treats the disk as circular, so every cylinder waits about the same.</div>

<h3>5 · LOOK and C-LOOK — do not go to the edge if nothing is there</h3>
<div class="out"><b>LOOK:</b> 53 → 183 (the highest request, not 199), then down to 14 → movement = 130 + 169 = <b>299</b><br>
<b>C-LOOK:</b> 53 → 183, jump to 14, then 37 → movement = 130 + 169 + 23 = <b>322</b><br>
LOOK and C-LOOK are what real drivers implement, because travelling to a cylinder nobody asked for is pure waste.</div>

<h3>Summary on this data</h3>
<table><thead><tr><th>Algorithm</th><th>Movement</th><th>Starvation</th><th>Note</th></tr></thead><tbody>
<tr><td>FCFS</td><td>640</td><td>no</td><td>fair, worst performance</td></tr>
<tr><td><b>SSTF</b></td><td><b>236</b></td><td><b>yes</b></td><td>greedy, best on this data</td></tr>
<tr><td>SCAN</td><td>331</td><td>no</td><td>the classic elevator</td></tr>
<tr><td>C-SCAN</td><td>382</td><td>no</td><td>most uniform waiting time</td></tr>
<tr><td>LOOK</td><td>299</td><td>no</td><td>SCAN without the wasted edge</td></tr>
<tr><td>C-LOOK</td><td>322</td><td>no</td><td><b>what Linux and Windows actually use</b></td></tr>
</tbody></table>

<div class="pitfall"><b>Always state the head's starting direction.</b> SCAN and C-SCAN give completely different numbers if the head starts moving downward — 53 → 37 → 14 → 0 → then up. An answer without the direction stated is incomplete, and half the marks in this question are for the working, not the total.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>On an SSD every algorithm above is pointless.</b> There is no arm and no rotation: any block costs the same ~100 µs, so seek optimisation buys nothing. What matters instead is the <em>erase block</em>: flash can be written per page (4 KB) but only erased per block (a few MB), so overwriting one page means read-modify-erase-write of the whole block — <b>write amplification</b>. The controller therefore does wear levelling and needs the <span class="badge">TRIM</span> command to know which pages the file system has freed. Linux ships the <span class="badge">none</span> (no-op) scheduler for NVMe devices for exactly this reason. <em>Beyond syllabus because the textbook's disk chapter predates flash, and the correct modern answer to "which disk scheduler?" is often "none".</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Phép tính còn lại mà progress test hay hỏi</h2>
<p class="lead">Một lần truy cập đĩa tốn thời gian dịch đầu từ + độ trễ quay + thời gian truyền, và phần <strong>dịch đầu từ</strong> áp đảo phần còn lại. Nên OS sắp xếp lại các yêu cầu đang chờ để cần trục di chuyển ít nhất có thể — và đề thi bắt bạn tính chính xác từng chính sách gây ra bao nhiêu chuyển động.</p>

<div class="formula"><span class="lbl">THỜI GIAN TRUY CẬP</span>t = dịch đầu từ + độ trễ quay + truyền dữ liệu &nbsp;·&nbsp; dịch ≈ 5–10 ms, quay ≈ 4 ms ở 7200 vòng/phút, truyền ≈ 0,1 ms</div>

<h3>Dãy yêu cầu dùng xuyên bài</h3>
<div class="diagram">Rãnh 0–199. Đầu từ đang ở 53, di chuyển về phía số lớn.
Yêu cầu đang chờ: 98, 183, 37, 122, 14, 124, 65, 67</div>

<h3>1 · FCFS — phục vụ theo thứ tự đến</h3>
<div class="out">53 → 98 → 183 → 37 → 122 → 14 → 124 → 65 → 67<br>
Quãng đường: 45 + 85 + 146 + 85 + 108 + 110 + 59 + 2 = <b>640 rãnh</b><br>
Công bằng và đơn giản, nhưng cần trục băng qua đĩa hết lần này tới lần khác — chuyển động tệ nhất có thể.</div>

<h3>2 · SSTF — thời gian dịch ngắn nhất trước</h3>
<div class="out">Từ 53, gần nhất là 65 → rồi 67 → 37 → 14 → 98 → 122 → 124 → 183<br>
Quãng đường: 12 + 2 + 30 + 23 + 84 + 24 + 2 + 59 = <b>236 rãnh</b> — giảm 63%.<br>
<b>Khiếm khuyết:</b> các yêu cầu nằm xa đầu từ có thể bị hoãn vô hạn trong khi các yêu cầu gần cứ liên tục tới — <b>đói tài nguyên</b>, đúng như ở lập lịch SJF (bài 2.4).</div>

<h3>3 · SCAN (thang máy) — quét tới cuối rồi quay đầu</h3>
<div class="out">Đi lên: 53 → 65 → 67 → 98 → 122 → 124 → 183 → <b>199</b> (mép đĩa), rồi đi xuống: 37 → 14<br>
Quãng đường: (199 − 53) + (199 − 14) = 146 + 185 = <b>331 rãnh</b><br>
Không đói tài nguyên — mọi yêu cầu đều được phục vụ trong một lượt quét. Tên gọi lấy từ thang máy: nó không đổi hướng chỉ vì có người ở gần hơn vừa bấm nút.</div>

<h3>4 · C-SCAN — quét vòng, chỉ một chiều</h3>
<div class="out">Lên: 53 → 65 → 67 → 98 → 122 → 124 → 183 → 199, rồi <b>nhảy về 0</b> và tiếp tục đi lên: 14 → 37<br>
Quãng đường: 146 + 199 (cú nhảy về) + 37 = <b>382 rãnh</b><br>
Tổng chuyển động nhiều hơn SCAN, nhưng <b>thời gian chờ công bằng hơn hẳn</b>: với SCAN, các rãnh gần điểm quay đầu được phục vụ hai lần liên tiếp rất nhanh trong khi đầu kia phải chờ trọn một lượt quét. C-SCAN coi đĩa như một vòng tròn, nên mọi rãnh chờ xấp xỉ bằng nhau.</div>

<h3>5 · LOOK và C-LOOK — đừng chạy tới mép nếu ở đó chẳng có gì</h3>
<div class="out"><b>LOOK:</b> 53 → 183 (yêu cầu cao nhất, không phải 199), rồi xuống 14 → quãng đường = 130 + 169 = <b>299</b><br>
<b>C-LOOK:</b> 53 → 183, nhảy về 14, rồi 37 → quãng đường = 130 + 169 + 23 = <b>322</b><br>
LOOK và C-LOOK mới là thứ trình điều khiển thật sự cài đặt, vì chạy tới một rãnh chẳng ai yêu cầu là lãng phí thuần tuý.</div>

<h3>Tổng kết trên bộ dữ liệu này</h3>
<table><thead><tr><th>Thuật toán</th><th>Quãng đường</th><th>Đói tài nguyên</th><th>Ghi chú</th></tr></thead><tbody>
<tr><td>FCFS</td><td>640</td><td>không</td><td>công bằng, hiệu năng tệ nhất</td></tr>
<tr><td><b>SSTF</b></td><td><b>236</b></td><td><b>có</b></td><td>tham lam, tốt nhất trên dữ liệu này</td></tr>
<tr><td>SCAN</td><td>331</td><td>không</td><td>thang máy kinh điển</td></tr>
<tr><td>C-SCAN</td><td>382</td><td>không</td><td>thời gian chờ đều nhất</td></tr>
<tr><td>LOOK</td><td>299</td><td>không</td><td>SCAN mà không phí quãng ra mép</td></tr>
<tr><td>C-LOOK</td><td>322</td><td>không</td><td><b>thứ Linux và Windows thật sự dùng</b></td></tr>
</tbody></table>

<div class="pitfall"><b>Luôn nêu rõ chiều di chuyển ban đầu của đầu từ.</b> SCAN và C-SCAN cho con số hoàn toàn khác nếu đầu từ bắt đầu đi xuống — 53 → 37 → 14 → 0 → rồi mới lên. Đáp án không nêu chiều là chưa đầy đủ, và một nửa số điểm của câu này nằm ở phần trình bày chứ không ở con số tổng.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Trên SSD, mọi thuật toán ở trên đều vô nghĩa.</b> Không có cần trục, không có vòng quay: mọi khối đều tốn như nhau ~100 µs, nên tối ưu quãng dịch chẳng mang lại gì. Thứ quan trọng thay vào đó là <em>khối xoá</em>: bộ nhớ flash ghi được theo trang (4 KB) nhưng chỉ xoá được theo khối (vài MB), nên ghi đè một trang là phải đọc-sửa-xoá-ghi cả khối — <b>khuếch đại ghi</b>. Vì vậy bộ điều khiển phải san đều hao mòn và cần lệnh <span class="badge">TRIM</span> để biết hệ thống tệp đã giải phóng những trang nào. Linux xuất xưởng với bộ lập lịch <span class="badge">none</span> (không làm gì) cho thiết bị NVMe đúng vì lý do đó. <em>Ngoài giáo trình vì chương về đĩa trong sách ra đời trước bộ nhớ flash, và câu trả lời hiện đại đúng cho "dùng bộ lập lịch đĩa nào?" thường là "không dùng cái nào".</em></div>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'osg202-quiz-ch5',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: driver, lớp I/O, đệm, kỹ thuật truyền.',
          quiz: {
            timeLimitSeconds: 240,
            questions: [
              { question: 'A device driver is…|||Một driver thiết bị là…', options: ['a person who installs devices|||người lắp thiết bị', 'OS code that knows how to talk to a specific hardware device|||code OS biết cách nói chuyện với một thiết bị phần cứng cụ thể', 'a type of file|||một loại tệp', 'a CPU core|||một nhân CPU'], correctIndex: 1, points: 1 },
              { question: 'The device-independent I/O layer gives programs a…|||Lớp I/O độc lập thiết bị cho chương trình một…', options: ['slower interface|||giao diện chậm hơn', 'uniform, device-agnostic interface|||giao diện thống nhất, không phụ thuộc thiết bị', 'direct hardware connection|||kết nối phần cứng trực tiếp', 'graph|||một đồ thị'], correctIndex: 1, points: 1 },
              { question: 'Buffering is used to…|||Đệm (buffering) dùng để…', options: ['delete files|||xoá tệp', 'smooth the speed mismatch between slow devices and fast CPU|||làm mượt chênh lệch tốc độ giữa thiết bị chậm và CPU nhanh', 'schedule processes|||lập lịch tiến trình', 'translate addresses|||dịch địa chỉ'], correctIndex: 1, points: 1 },
              { question: 'For large transfers, the most efficient technique is…|||Với khối truyền lớn, kỹ thuật hiệu quả nhất là…', options: ['polling|||polling', 'DMA', 'thrashing|||thrashing', 'context switching|||chuyển ngữ cảnh'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — DEADLOCK ══════════════════ */
    {
      title: 'Chapter 6 — Deadlock|||Chương 6 — Bế tắc (Deadlock)',
      description: 'Điều kiện gây deadlock và cách phát hiện, tránh, ngăn.',
      lessons: [
        {
          title: '6.1 — Deadlock: conditions & handling|||6.1 — Deadlock: điều kiện & xử lý',
          slug: 'osg202-6-1-deadlock',
          simulation: {
            url: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-6-1-deadlock.mp4',
            poster: 'https://media.cuongthai.com/videos/academy/OSG202/osg202-6-1-deadlock.jpg',
            scenario: 'deadlock',
            durationSeconds: 25,
            caption: { en: "Four conditions lock the system; breaking one frees it", vi: "Bốn điều kiện khoá chết hệ thống; phá một là thoát" },
          },
          type: 'VIDEO',
          description: 'Bốn điều kiện của deadlock và ba chiến lược xử lý.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>When everyone waits forever</h2>
<p class="lead">A <strong>deadlock</strong> (CLO6) is a situation where a group of processes are each waiting for a resource held by another — so none can proceed, ever. Classic example: two processes each hold one lock and wait for the other&#39;s. Both freeze.</p>
<h3>The four necessary conditions</h3>
<p>A deadlock can happen only if ALL four hold at once (Coffman conditions):</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Mutual exclusion</div><div class="lz-nsub">A resource is held by only one process at a time</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Hold and wait</div><div class="lz-nsub">A process holds one resource while waiting for another</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">No preemption</div><div class="lz-nsub">Resources cannot be forcibly taken away</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Circular wait</div><div class="lz-nsub">A cycle of processes each waiting for the next</div></div></div>
</div>
<h3>Three strategies to handle it</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Prevention</div><div class="lz-ld">Design so one of the four conditions can never hold (e.g. force a global lock order to break circular wait).</div></div>
  <div class="lz-layer"><div class="lz-lt">Avoidance</div><div class="lz-ld">Grant resources only when it keeps the system in a "safe state" — the Banker&#39;s Algorithm.</div></div>
  <div class="lz-layer"><div class="lz-lt">Detection &amp; recovery</div><div class="lz-ld">Let deadlocks happen, detect the cycle, then recover (kill a process or preempt a resource).</div></div>
</div>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Livelock — busy, but going nowhere.</b> Deadlock is not the only way progress stops. In a <strong>livelock</strong> the processes are never blocked — they keep running and reacting to each other, yet make no forward progress (like two people stepping side-to-side in a corridor forever). Naive avoidance schemes that make everyone back off and retry can create exactly this; the usual cure is randomized backoff to break the symmetry. <em>The syllabus focuses on the four Coffman conditions, but livelock slips past all of them and is just as fatal.</em></div>
<div class="callout ok">Deadlock connects straight to Chapter 2&#39;s locks: the tools that prevent race conditions can themselves cause deadlock if used carelessly. A simple practical rule that breaks circular wait: <strong>always acquire multiple locks in the same fixed order.</strong></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Khi mọi người chờ nhau mãi mãi</h2>
<p class="lead">Một <strong>deadlock (bế tắc)</strong> (CLO6) là tình huống một nhóm tiến trình mỗi cái chờ một tài nguyên do cái khác giữ — nên không cái nào tiến được, mãi mãi. Ví dụ kinh điển: hai tiến trình mỗi cái giữ một khoá và chờ khoá của cái kia. Cả hai đứng hình.</p>
<h3>Bốn điều kiện cần thiết</h3>
<p>Một deadlock chỉ xảy ra nếu CẢ bốn điều kiện đúng cùng lúc (điều kiện Coffman):</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Loại trừ lẫn nhau</div><div class="lz-nsub">Một tài nguyên chỉ do một tiến trình giữ tại một thời điểm</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Giữ và chờ</div><div class="lz-nsub">Một tiến trình giữ một tài nguyên trong khi chờ cái khác</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Không trưng dụng</div><div class="lz-nsub">Không thể cưỡng ép lấy tài nguyên đi</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Chờ vòng tròn</div><div class="lz-nsub">Một chu trình các tiến trình mỗi cái chờ cái kế</div></div></div>
</div>
<h3>Ba chiến lược xử lý</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Ngăn ngừa (prevention)</div><div class="lz-ld">Thiết kế sao cho một trong bốn điều kiện không bao giờ đúng (vd ép một thứ tự khoá toàn cục để phá chờ vòng tròn).</div></div>
  <div class="lz-layer"><div class="lz-lt">Tránh (avoidance)</div><div class="lz-ld">Chỉ cấp tài nguyên khi giữ hệ thống ở "trạng thái an toàn" — thuật toán Banker.</div></div>
  <div class="lz-layer"><div class="lz-lt">Phát hiện &amp; phục hồi</div><div class="lz-ld">Để deadlock xảy ra, phát hiện chu trình, rồi phục hồi (kill một tiến trình hoặc trưng dụng tài nguyên).</div></div>
</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Livelock — bận rộn mà không tiến.</b> Deadlock không phải cách duy nhất khiến tiến trình ngừng tiến. Trong <strong>livelock</strong> các tiến trình không hề bị chặn — chúng vẫn chạy và phản ứng với nhau, nhưng không tiến lên được (như hai người cứ né qua lại trong hành lang mãi). Các cơ chế tránh ngây thơ bắt mọi người lùi lại rồi thử lại có thể tạo đúng điều này; cách chữa thường là lùi ngẫu nhiên (randomized backoff) để phá đối xứng. <em>Syllabus tập trung vào bốn điều kiện Coffman, nhưng livelock lách qua tất cả và cũng chí mạng như vậy.</em></div>
<div class="callout ok">Deadlock nối thẳng với khoá ở Chương 2: các công cụ ngăn tranh chấp có thể tự gây deadlock nếu dùng cẩu thả. Một quy tắc thực tế đơn giản phá chờ vòng tròn: <strong>luôn lấy nhiều khoá theo cùng một thứ tự cố định.</strong></div>
</div>
`,
        },
        {
          title: '6.2 — Resource graphs & the Banker\'s algorithm|||6.2 — Đồ thị tài nguyên & thuật toán Nhà băng',
          slug: 'osg202-6-2-banker',
          type: 'VIDEO',
          description: 'Phát hiện deadlock bằng đồ thị cấp phát, và thuật toán Nhà băng chạy tay đầy đủ để tìm dãy an toàn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>Two exam questions, both mechanical once you know the procedure</h2>
<p class="lead">Lesson 6.1 gave the four Coffman conditions. This one does the arithmetic: draw the resource-allocation graph to <em>detect</em> a deadlock, and run the Banker's algorithm to <em>avoid</em> one.</p>

<h3>Resource-allocation graph — detection by looking for a cycle</h3>
<div class="diagram">P1 ──request──→ R2 ──assigned──→ P2
 ↑                                  │
 └────────assigned─── R1 ←──request──┘

P1 holds R1 and wants R2 · P2 holds R2 and wants R1 → CYCLE → deadlock</div>
<div class="out"><b>The rule depends on how many copies each resource has:</b><br>
<b>One instance per resource type:</b> a cycle ⟺ a deadlock. Simple and exact.<br>
<b>Several instances:</b> a cycle is <em>necessary but not sufficient</em>. The cycle may resolve if some other process holding an instance can finish and release it. You must then run the detection algorithm (a reduction, exactly like the safety check below) rather than trusting the picture.<br>
<b>Reading a graph fast:</b> follow the arrows; if you can return to your starting node, there is a cycle. With single instances you are done.</div>

<h3>The Banker's algorithm — the safety check</h3>
<p>Before granting a request, the OS asks: "if I grant this, does a sequence still exist in which every process can finish?" If yes the state is <b>safe</b> and the request is granted; if not it is refused, even though the resources are physically available.</p>
<div class="formula"><span class="lbl">NEED</span>Need = Max − Allocation</div>
<div class="formula"><span class="lbl">SAFE STATE</span>∃ an ordering P₁…Pₙ such that Need(Pᵢ) ≤ Available + Σ Allocation(P₁…Pᵢ₋₁)</div>

<h3>Worked example — five processes, three resource types</h3>
<div class="out"><b>Total resources: A = 10, B = 5, C = 7. Current state:</b><br>
<pre>        Allocation      Max          Need = Max − Alloc
         A  B  C      A  B  C         A  B  C
  P0     0  1  0      7  5  3         7  4  3
  P1     2  0  0      3  2  2         1  2  2
  P2     3  0  2      9  0  2         6  0  0
  P3     2  1  1      2  2  2         0  1  1
  P4     0  0  2      4  3  3         4  3  1

  Allocated in total: A=7, B=2, C=5  →  Available = (10−7, 5−2, 7−5) = (3, 3, 2)</pre>
<b>Now find a safe sequence. Work = Available = (3,3,2):</b><br>
<b>P0?</b> Need (7,4,3) ≤ (3,3,2)? No (7 &gt; 3) → skip.<br>
<b>P1?</b> Need (1,2,2) ≤ (3,3,2)? <b>Yes</b> → P1 runs and returns its allocation: Work = (3,3,2) + (2,0,0) = <b>(5,3,2)</b>.<br>
<b>P2?</b> Need (6,0,0) ≤ (5,3,2)? No (6 &gt; 5) → skip.<br>
<b>P3?</b> Need (0,1,1) ≤ (5,3,2)? <b>Yes</b> → Work = (5,3,2) + (2,1,1) = <b>(7,4,3)</b>.<br>
<b>P4?</b> Need (4,3,1) ≤ (7,4,3)? <b>Yes</b> → Work = (7,4,3) + (0,0,2) = <b>(7,4,5)</b>.<br>
<b>P0?</b> Need (7,4,3) ≤ (7,4,5)? <b>Yes</b> → Work = (7,4,5) + (0,1,0) = <b>(7,5,5)</b>.<br>
<b>P2?</b> Need (6,0,0) ≤ (7,5,5)? <b>Yes</b> → Work = (10,5,7) = everything back.<br>
<b>Safe sequence: &lt;P1, P3, P4, P0, P2&gt;</b> — all five can finish, so the state is <b>safe</b>.</div>

<h3>Now a request arrives</h3>
<div class="out"><b>P1 requests (1, 0, 2).</b> Three checks, in order:<br>
<b>1.</b> Request ≤ Need(P1)? (1,0,2) ≤ (1,2,2) ✓<br>
<b>2.</b> Request ≤ Available? (1,0,2) ≤ (3,3,2) ✓<br>
<b>3.</b> Pretend to grant it and re-run the safety check: Available becomes (2,3,0), Allocation(P1) = (3,0,2), Need(P1) = (0,2,0).<br>
Safety: P1 Need (0,2,0) ≤ (2,3,0) ✓ → Work (5,3,2) · P3 (0,1,1) ≤ (5,3,2) ✓ → (7,4,3) · P4 ✓ → (7,4,5) · P0 ✓ → (7,5,5) · P2 ✓.<br>
<b>Still safe → the request is granted.</b><br>
<b>Contrast:</b> if P4 were to request (3,3,0), then Available would become (0,0,2) and <em>no</em> process's need could be met — an unsafe state, so the request must be <b>refused and P4 made to wait</b>, even though the resources exist right now.</div>

<h3>Why nobody actually uses it</h3>
<table><thead><tr><th>Requirement</th><th>Reality</th></tr></thead><tbody>
<tr><td>Every process must declare its <b>maximum</b> need in advance</td><td>almost no program knows this</td></tr>
<tr><td>The number of processes and resources must be fixed</td><td>processes come and go constantly</td></tr>
<tr><td>The check runs on every request: O(n² × m)</td><td>too slow for a hot path</td></tr>
</tbody></table>
<p>So general-purpose systems use the fourth strategy — the <b>ostrich algorithm</b>: ignore deadlock, because it is rare, and reboot or kill a process if it happens. Databases instead <em>detect</em> deadlock (a wait-for graph, DBI202 lesson 8.3) and roll one transaction back, which is cheap because a transaction is designed to be undoable.</p>

<div class="pitfall"><b>Unsafe is not the same as deadlocked.</b> An unsafe state merely means a deadlock <em>could</em> occur if every process later demanded its declared maximum. Many unsafe states never deadlock in practice. The Banker's algorithm is conservative on purpose — it refuses requests that would probably have been fine.</div>

<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Lock ordering is the deadlock prevention you will actually use.</b> No production codebase runs the Banker's algorithm; instead it imposes a global order on locks — "always take the account lock before the ledger lock" — which breaks the circular-wait condition by construction. Tools enforce it: Java's <span class="badge">jstack</span> prints detected deadlocks, Go's race detector and <span class="badge">-d lockorder</span> flag them, and Linux's lockdep validates every kernel lock acquisition against the observed order and panics on a violation <em>before</em> a real deadlock happens. <em>Beyond syllabus because the course teaches avoidance mathematics, while the industry solved the problem with a coding convention plus tooling.</em></div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Hai câu hỏi thi, cả hai đều máy móc khi đã nắm quy trình</h2>
<p class="lead">Bài 6.1 đã cho bốn điều kiện Coffman. Bài này làm phần số học: vẽ đồ thị cấp phát tài nguyên để <em>phát hiện</em> khoá chết, và chạy thuật toán Nhà băng để <em>phòng tránh</em> nó.</p>

<h3>Đồ thị cấp phát tài nguyên — phát hiện bằng cách tìm chu trình</h3>
<div class="diagram">P1 ──yêu cầu──→ R2 ──đã cấp──→ P2
 ↑                               │
 └────────đã cấp─── R1 ←──yêu cầu─┘

P1 giữ R1 và muốn R2 · P2 giữ R2 và muốn R1 → CÓ CHU TRÌNH → khoá chết</div>
<div class="out"><b>Quy tắc phụ thuộc vào số bản sao của mỗi loại tài nguyên:</b><br>
<b>Mỗi loại một bản:</b> có chu trình ⟺ có khoá chết. Đơn giản và chính xác.<br>
<b>Nhiều bản:</b> chu trình là điều kiện <em>cần nhưng chưa đủ</em>. Chu trình có thể tự gỡ nếu một tiến trình khác đang giữ một bản có thể chạy xong và trả lại. Khi đó bạn phải chạy thuật toán phát hiện (một phép rút gọn, đúng như phép kiểm an toàn phía dưới) chứ không tin vào hình vẽ.<br>
<b>Đọc đồ thị nhanh:</b> đi theo mũi tên; nếu quay lại được đúng đỉnh xuất phát thì có chu trình. Với tài nguyên đơn bản, thế là xong.</div>

<h3>Thuật toán Nhà băng — phép kiểm an toàn</h3>
<p>Trước khi chấp thuận một yêu cầu, OS tự hỏi: "nếu cấp cái này thì có còn tồn tại một trình tự để mọi tiến trình đều chạy xong không?" Nếu có, trạng thái là <b>an toàn</b> và yêu cầu được cấp; nếu không thì bị từ chối, dù tài nguyên đang có sẵn về mặt vật lý.</p>
<div class="formula"><span class="lbl">NHU CẦU</span>Need = Max − Allocation</div>
<div class="formula"><span class="lbl">TRẠNG THÁI AN TOÀN</span>∃ một thứ tự P₁…Pₙ sao cho Need(Pᵢ) ≤ Available + Σ Allocation(P₁…Pᵢ₋₁)</div>

<h3>Ví dụ có lời giải — năm tiến trình, ba loại tài nguyên</h3>
<div class="out"><b>Tổng tài nguyên: A = 10, B = 5, C = 7. Trạng thái hiện tại:</b><br>
<pre>        Allocation      Max          Need = Max − Alloc
         A  B  C      A  B  C         A  B  C
  P0     0  1  0      7  5  3         7  4  3
  P1     2  0  0      3  2  2         1  2  2
  P2     3  0  2      9  0  2         6  0  0
  P3     2  1  1      2  2  2         0  1  1
  P4     0  0  2      4  3  3         4  3  1

  Đã cấp tổng cộng: A=7, B=2, C=5  →  Available = (10−7, 5−2, 7−5) = (3, 3, 2)</pre>
<b>Giờ tìm một dãy an toàn. Work = Available = (3,3,2):</b><br>
<b>P0?</b> Need (7,4,3) ≤ (3,3,2)? Không (7 &gt; 3) → bỏ qua.<br>
<b>P1?</b> Need (1,2,2) ≤ (3,3,2)? <b>Được</b> → P1 chạy xong và trả lại phần đã cấp: Work = (3,3,2) + (2,0,0) = <b>(5,3,2)</b>.<br>
<b>P2?</b> Need (6,0,0) ≤ (5,3,2)? Không (6 &gt; 5) → bỏ qua.<br>
<b>P3?</b> Need (0,1,1) ≤ (5,3,2)? <b>Được</b> → Work = (5,3,2) + (2,1,1) = <b>(7,4,3)</b>.<br>
<b>P4?</b> Need (4,3,1) ≤ (7,4,3)? <b>Được</b> → Work = (7,4,3) + (0,0,2) = <b>(7,4,5)</b>.<br>
<b>P0?</b> Need (7,4,3) ≤ (7,4,5)? <b>Được</b> → Work = (7,4,5) + (0,1,0) = <b>(7,5,5)</b>.<br>
<b>P2?</b> Need (6,0,0) ≤ (7,5,5)? <b>Được</b> → Work = (10,5,7) = trả về đủ.<br>
<b>Dãy an toàn: &lt;P1, P3, P4, P0, P2&gt;</b> — cả năm đều chạy xong được, nên trạng thái <b>an toàn</b>.</div>

<h3>Giờ có một yêu cầu tới</h3>
<div class="out"><b>P1 xin (1, 0, 2).</b> Ba phép kiểm, theo thứ tự:<br>
<b>1.</b> Yêu cầu ≤ Need(P1)? (1,0,2) ≤ (1,2,2) ✓<br>
<b>2.</b> Yêu cầu ≤ Available? (1,0,2) ≤ (3,3,2) ✓<br>
<b>3.</b> Giả vờ cấp rồi chạy lại phép kiểm an toàn: Available thành (2,3,0), Allocation(P1) = (3,0,2), Need(P1) = (0,2,0).<br>
Kiểm: P1 Need (0,2,0) ≤ (2,3,0) ✓ → Work (5,3,2) · P3 (0,1,1) ≤ (5,3,2) ✓ → (7,4,3) · P4 ✓ → (7,4,5) · P0 ✓ → (7,5,5) · P2 ✓.<br>
<b>Vẫn an toàn → chấp thuận yêu cầu.</b><br>
<b>Đối chiếu:</b> nếu P4 xin (3,3,0) thì Available còn (0,0,2) và <em>không</em> tiến trình nào được đáp ứng nhu cầu — trạng thái không an toàn, nên phải <b>từ chối và bắt P4 chờ</b>, dù tài nguyên đang có sẵn ngay lúc đó.</div>

<h3>Vì sao thực tế không ai dùng nó</h3>
<table><thead><tr><th>Yêu cầu của thuật toán</th><th>Thực tế</th></tr></thead><tbody>
<tr><td>Mọi tiến trình phải khai báo trước nhu cầu <b>tối đa</b></td><td>hầu như không chương trình nào biết điều này</td></tr>
<tr><td>Số tiến trình và tài nguyên phải cố định</td><td>tiến trình sinh ra và mất đi liên tục</td></tr>
<tr><td>Phép kiểm chạy ở mọi yêu cầu: O(n² × m)</td><td>quá chậm cho một đường thi hành nóng</td></tr>
</tbody></table>
<p>Nên hệ thống đa dụng dùng chiến lược thứ tư — <b>thuật toán đà điểu</b>: mặc kệ khoá chết, vì nó hiếm, và khởi động lại hoặc giết một tiến trình nếu xảy ra. Cơ sở dữ liệu thì thay vào đó <em>phát hiện</em> khoá chết (đồ thị chờ, DBI202 bài 8.3) rồi quay lui một giao dịch, việc này rẻ vì giao dịch vốn được thiết kế để hoàn tác được.</p>

<div class="pitfall"><b>Không an toàn không đồng nghĩa với đã khoá chết.</b> Trạng thái không an toàn chỉ nghĩa là khoá chết <em>có thể</em> xảy ra nếu về sau mọi tiến trình đều đòi đúng mức tối đa đã khai. Rất nhiều trạng thái không an toàn thực tế chẳng bao giờ khoá chết. Thuật toán Nhà băng bảo thủ một cách cố ý — nó từ chối cả những yêu cầu mà lẽ ra vẫn ổn.</div>

<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Quy ước thứ tự khoá mới là cách phòng khoá chết bạn thật sự sẽ dùng.</b> Không mã nguồn sản xuất nào chạy thuật toán Nhà băng; thay vào đó người ta áp một thứ tự toàn cục cho các khoá — "luôn lấy khoá tài khoản trước khoá sổ cái" — và điều đó phá điều kiện chờ vòng tròn ngay từ trong thiết kế. Có công cụ áp đặt: <span class="badge">jstack</span> của Java in ra các khoá chết phát hiện được, bộ dò của Go gắn cờ chúng, còn lockdep của Linux kiểm mọi lần lấy khoá trong nhân theo thứ tự đã quan sát và panic ngay khi có vi phạm — <em>trước khi</em> khoá chết thật xảy ra. <em>Ngoài giáo trình vì môn học dạy toán học của phép phòng tránh, còn ngành công nghiệp giải bài toán này bằng một quy ước viết mã cộng công cụ.</em></div>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'osg202-quiz-ch6',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: định nghĩa deadlock, 4 điều kiện, 3 chiến lược.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'A deadlock is when…|||Deadlock là khi…', options: ['the CPU is idle|||CPU rảnh', 'processes each wait for a resource held by another, forever|||các tiến trình mỗi cái chờ tài nguyên do cái khác giữ, mãi mãi', 'memory is full|||bộ nhớ đầy', 'a file is deleted|||một tệp bị xoá'], correctIndex: 1, points: 1 },
              { question: 'How many Coffman conditions must ALL hold for deadlock?|||Bao nhiêu điều kiện Coffman phải CÙNG đúng để có deadlock?', options: ['2', '3', '4', '5'], correctIndex: 2, points: 1 },
              { question: 'Which is one of the four deadlock conditions?|||Cái nào là một trong bốn điều kiện deadlock?', options: ['circular wait|||chờ vòng tròn', 'paging|||phân trang', 'buffering|||đệm', 'context switch|||chuyển ngữ cảnh'], correctIndex: 0, points: 1 },
              { question: 'The Banker\'s Algorithm is a form of deadlock…|||Thuật toán Banker là một dạng… deadlock', options: ['detection|||phát hiện', 'avoidance|||tránh', 'recovery|||phục hồi', 'creation|||tạo ra'], correctIndex: 1, points: 1 },
              { question: 'A simple rule to prevent circular wait is to…|||Một quy tắc đơn giản để ngăn chờ vòng tròn là…', options: ['use more locks|||dùng nhiều khoá hơn', 'always acquire multiple locks in the same fixed order|||luôn lấy nhiều khoá theo cùng thứ tự cố định', 'never use locks|||không bao giờ dùng khoá', 'add more RAM|||thêm RAM'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 2 ══════════════════ */
    {
      title: 'Progress Test 2 (Files, I/O, Deadlock — CLO4–6)|||Progress Test 2 (Tệp, I/O, Deadlock — CLO4–6)',
      description: 'Ôn: hệ thống tệp, hệ thống I/O, deadlock.',
      lessons: [
        {
          title: 'Progress Test 2 — review|||Progress Test 2 — ôn tổng hợp',
          slug: 'osg202-progress-test-2',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 4–6.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The file system turns raw disk blocks into…|||Hệ thống tệp biến các khối đĩa thô thành…', options: ['processes|||tiến trình', 'named files and folders|||tệp và thư mục có tên', 'CPU registers|||thanh ghi CPU', 'network packets|||gói tin mạng'], correctIndex: 1, points: 1 },
              { question: 'Unix/Linux stores a file\'s metadata and block pointers in an…|||Unix/Linux lưu metadata và con trỏ khối của tệp trong một…', options: ['inode', 'thread|||luồng', 'page|||trang', 'buffer|||bộ đệm'], correctIndex: 0, points: 1 },
              { question: 'The I/O layer that gives programs a uniform interface is…|||Lớp I/O cho chương trình một giao diện thống nhất là…', options: ['the device driver|||driver thiết bị', 'device-independent I/O software|||phần mềm I/O độc lập thiết bị', 'the hardware|||phần cứng', 'the scheduler|||bộ lập lịch'], correctIndex: 1, points: 1 },
              { question: 'Deadlock requires how many conditions to hold simultaneously?|||Deadlock cần bao nhiêu điều kiện đúng đồng thời?', options: ['1', '2', '4', '10'], correctIndex: 2, points: 1 },
              { question: 'Detecting a deadlock then killing a process is deadlock…|||Phát hiện một deadlock rồi kill một tiến trình là… deadlock', options: ['prevention|||ngăn ngừa', 'avoidance|||tránh', 'detection & recovery|||phát hiện & phục hồi', 'creation|||tạo ra'], correctIndex: 2, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — LINUX & SHELL ══════════════════ */
    {
      title: 'Chapter 7 — Linux & the Shell|||Chương 7 — Linux & Shell',
      description: 'Dùng Linux thật: lệnh cơ bản, hệ thống tệp, quyền và shell script.',
      lessons: [
        {
          title: '7.1 — Essential Linux commands|||7.1 — Các lệnh Linux cốt lõi',
          slug: 'osg202-7-1-lenh-linux',
          type: 'VIDEO',
          description: 'Di chuyển, xem, tạo tệp, quyền và xem tiến trình qua shell.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Driving the OS from the command line</h2>
<p class="lead">The <strong>shell</strong> (CLO7–10) is a text interface to the OS — you type commands, it runs them. Fluency here is a lab-graded skill and a genuine career superpower, since almost all servers are Linux.</p>
<h3>Navigating &amp; viewing</h3>
<pre><span class="tok-function">pwd</span>            <span class="tok-comment"># print working directory (where am I?)</span>
<span class="tok-function">ls</span> -l          <span class="tok-comment"># list files with details</span>
<span class="tok-function">cd</span> /home/an    <span class="tok-comment"># change directory</span>
<span class="tok-function">cat</span> file.txt   <span class="tok-comment"># show a file's contents</span></pre>
<h3>Creating &amp; managing files</h3>
<pre><span class="tok-function">mkdir</span> project   <span class="tok-comment"># make a directory</span>
<span class="tok-function">touch</span> notes.txt <span class="tok-comment"># create an empty file</span>
<span class="tok-function">cp</span> a.txt b.txt  <span class="tok-comment"># copy</span>
<span class="tok-function">mv</span> b.txt docs/  <span class="tok-comment"># move / rename</span>
<span class="tok-function">rm</span> notes.txt   <span class="tok-comment"># remove (careful — no recycle bin!)</span></pre>
<h3>Permissions &amp; processes — theory made real</h3>
<pre><span class="tok-function">chmod</span> 755 script.sh   <span class="tok-comment"># set read/write/execute permissions</span>
<span class="tok-function">ps</span> aux              <span class="tok-comment"># see all processes (Chapter 2!)</span>
<span class="tok-function">top</span>                 <span class="tok-comment"># live process & memory monitor (Ch 2 & 3)</span>
<span class="tok-function">kill</span> 1234           <span class="tok-comment"># terminate a process by its PID</span>
<span class="tok-function">free</span> -h            <span class="tok-comment"># memory usage (Chapter 3)</span></pre>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>ps and top are not magic — they read /proc.</b> Commands like <code>ps</code>, <code>top</code> and <code>free</code> simply read text files under <strong>/proc</strong>, a virtual file system the kernel generates on the fly. Try <code>cat /proc/cpuinfo</code> or <code>cat /proc/1/status</code> and you are reading live kernel data as plain text. <em>This is the "everything is a file" Unix design taken to its limit — even the process table is a folder — which the command list alone never reveals.</em></div>
<div class="callout ok">Notice how the commands make the theory tangible: <code>ps</code> and <code>top</code> show the processes and states from Chapter 2; <code>free</code> shows the memory of Chapter 3; <code>ls -l</code> shows the file metadata of Chapter 4. Linux is the OS course you can touch.</div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Foperating-systems%2Flearn&reflabel=OSG202%20%E2%80%94%20Operating%20Systems#module-479" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Practice commands &amp; permissions</span><span class="lc-sub">The "File Operations, Permissions &amp; Ownership" module on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Điều khiển OS từ dòng lệnh</h2>
<p class="lead"><strong>Shell</strong> (CLO7–10) là một giao diện văn bản tới OS — bạn gõ lệnh, nó chạy. Thành thạo ở đây là kỹ năng được chấm qua lab và một siêu năng lực nghề nghiệp thật, vì gần như mọi máy chủ là Linux.</p>
<h3>Di chuyển &amp; xem</h3>
<pre><span class="tok-function">pwd</span>            <span class="tok-comment"># in thư mục hiện tại (tôi đang ở đâu?)</span>
<span class="tok-function">ls</span> -l          <span class="tok-comment"># liệt kê tệp kèm chi tiết</span>
<span class="tok-function">cd</span> /home/an    <span class="tok-comment"># đổi thư mục</span>
<span class="tok-function">cat</span> file.txt   <span class="tok-comment"># hiện nội dung một tệp</span></pre>
<h3>Tạo &amp; quản lý tệp</h3>
<pre><span class="tok-function">mkdir</span> project   <span class="tok-comment"># tạo một thư mục</span>
<span class="tok-function">touch</span> notes.txt <span class="tok-comment"># tạo một tệp rỗng</span>
<span class="tok-function">cp</span> a.txt b.txt  <span class="tok-comment"># sao chép</span>
<span class="tok-function">mv</span> b.txt docs/  <span class="tok-comment"># di chuyển / đổi tên</span>
<span class="tok-function">rm</span> notes.txt   <span class="tok-comment"># xoá (cẩn thận — không có thùng rác!)</span></pre>
<h3>Quyền &amp; tiến trình — lý thuyết thành hiện thực</h3>
<pre><span class="tok-function">chmod</span> 755 script.sh   <span class="tok-comment"># đặt quyền đọc/ghi/thực thi</span>
<span class="tok-function">ps</span> aux              <span class="tok-comment"># xem mọi tiến trình (Chương 2!)</span>
<span class="tok-function">top</span>                 <span class="tok-comment"># giám sát tiến trình & bộ nhớ trực tiếp (Ch 2 & 3)</span>
<span class="tok-function">kill</span> 1234           <span class="tok-comment"># kết thúc một tiến trình theo PID</span>
<span class="tok-function">free</span> -h            <span class="tok-comment"># dùng bộ nhớ (Chương 3)</span></pre>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>ps và top không phải phép màu — chúng đọc /proc.</b> Các lệnh như <code>ps</code>, <code>top</code> và <code>free</code> chỉ đọc các tệp văn bản dưới <strong>/proc</strong>, một hệ thống tệp ảo mà kernel sinh ra tức thời. Thử <code>cat /proc/cpuinfo</code> hoặc <code>cat /proc/1/status</code> và bạn đang đọc dữ liệu kernel sống dưới dạng văn bản thuần. <em>Đây là triết lý "mọi thứ là một tệp" của Unix đẩy tới cực hạn — ngay cả bảng tiến trình cũng là một thư mục — điều mà chỉ nhìn danh sách lệnh không bao giờ hé lộ.</em></div>
<div class="callout ok">Để ý các lệnh làm lý thuyết hữu hình: <code>ps</code> và <code>top</code> hiện tiến trình và trạng thái từ Chương 2; <code>free</code> hiện bộ nhớ Chương 3; <code>ls -l</code> hiện metadata tệp Chương 4. Linux là môn OS bạn chạm được.</div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Foperating-systems%2Flearn&reflabel=OSG202%20%E2%80%94%20Operating%20Systems#module-479" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Luyện lệnh &amp; quyền</span><span class="lc-sub">Module "File Operations, Permissions &amp; Ownership" trên CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '7.2 — Shell scripting basics|||7.2 — Cơ bản về shell script',
          slug: 'osg202-7-2-shell-script',
          type: 'VIDEO',
          description: 'Biến, điều kiện, vòng lặp trong shell để tự động hoá tác vụ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Automating with shell scripts</h2>
<p class="lead">A <strong>shell script</strong> (CLO9) is a file of shell commands run in sequence — turning repetitive tasks into one command. It is a real programming language, with variables, conditions and loops (your PRF192 skills apply).</p>
<pre><span class="tok-comment">#!/bin/bash</span>
name=<span class="tok-string">"OSG202"</span>              <span class="tok-comment"># a variable</span>
<span class="tok-function">echo</span> <span class="tok-string">"Hello, $name!"</span>       <span class="tok-comment"># use it with $</span>

<span class="tok-keyword">if</span> [ -f data.txt ]; <span class="tok-keyword">then</span>    <span class="tok-comment"># does the file exist?</span>
    <span class="tok-function">echo</span> <span class="tok-string">"File found"</span>
<span class="tok-keyword">fi</span>

<span class="tok-keyword">for</span> i <span class="tok-keyword">in</span> 1 2 3; <span class="tok-keyword">do</span>          <span class="tok-comment"># a loop</span>
    <span class="tok-function">echo</span> <span class="tok-string">"Count $i"</span>
<span class="tok-keyword">done</span></pre>
<div class="out"><b>Output:</b><br>Hello, OSG202!<br>File found<br>Count 1<br>Count 2<br>Count 3</div>
<h3>The power of pipes</h3>
<p>The shell&#39;s superpower is <strong>combining small commands</strong> with the pipe <code>|</code>, feeding one command&#39;s output into the next:</p>
<div class="out"><span class="tok-function">ps</span> aux | <span class="tok-function">grep</span> java | <span class="tok-function">wc</span> -l   <span class="tok-comment"># count running java processes</span></div>
<p>This "do one thing well, then combine" is the <strong>Unix philosophy</strong> — small tools chained together beat one giant program.</p>
<div class="callout"><span class="badge">★ Beyond the syllabus</span> <b>Real scripts start with set -euo pipefail.</b> By default bash keeps running after a failed command, treats unset variables as empty strings, and hides errors in the middle of a pipe — so a broken backup script can silently "succeed." Adding <code>set -euo pipefail</code> makes it stop on the first error, on any undefined variable, and on any failing stage of a pipe. <em>This is the line between toy scripts and scripts you trust in deployment — essential yet rarely taught.</em></div>
<div class="note-ct">Shell scripting is how sysadmins and DevOps engineers automate everything: backups, deployments, monitoring. The <code>deploy.sh</code> that ships this very Academy is a shell script. Mastering it here is directly useful for your career.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Tự động hoá bằng shell script</h2>
<p class="lead">Một <strong>shell script</strong> (CLO9) là một tệp các lệnh shell chạy tuần tự — biến tác vụ lặp lại thành một lệnh. Nó là một ngôn ngữ lập trình thật, có biến, điều kiện và vòng lặp (kỹ năng PRF192 của bạn áp dụng được).</p>
<pre><span class="tok-comment">#!/bin/bash</span>
name=<span class="tok-string">"OSG202"</span>              <span class="tok-comment"># một biến</span>
<span class="tok-function">echo</span> <span class="tok-string">"Hello, $name!"</span>       <span class="tok-comment"># dùng nó với $</span>

<span class="tok-keyword">if</span> [ -f data.txt ]; <span class="tok-keyword">then</span>    <span class="tok-comment"># tệp có tồn tại không?</span>
    <span class="tok-function">echo</span> <span class="tok-string">"File found"</span>
<span class="tok-keyword">fi</span>

<span class="tok-keyword">for</span> i <span class="tok-keyword">in</span> 1 2 3; <span class="tok-keyword">do</span>          <span class="tok-comment"># một vòng lặp</span>
    <span class="tok-function">echo</span> <span class="tok-string">"Count $i"</span>
<span class="tok-keyword">done</span></pre>
<div class="out"><b>Kết quả:</b><br>Hello, OSG202!<br>File found<br>Count 1<br>Count 2<br>Count 3</div>
<h3>Sức mạnh của pipe</h3>
<p>Siêu năng lực của shell là <strong>kết hợp các lệnh nhỏ</strong> bằng ống pipe <code>|</code>, đưa đầu ra của lệnh này vào lệnh kế:</p>
<div class="out"><span class="tok-function">ps</span> aux | <span class="tok-function">grep</span> java | <span class="tok-function">wc</span> -l   <span class="tok-comment"># đếm số tiến trình java đang chạy</span></div>
<p>Cách "làm tốt một việc, rồi kết hợp" này là <strong>triết lý Unix</strong> — các công cụ nhỏ ghép lại thắng một chương trình khổng lồ.</p>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Script thật bắt đầu bằng set -euo pipefail.</b> Mặc định bash vẫn chạy tiếp sau một lệnh lỗi, coi biến chưa đặt là chuỗi rỗng, và giấu lỗi ở giữa một pipe — nên một script sao lưu hỏng có thể "thành công" trong im lặng. Thêm <code>set -euo pipefail</code> bắt nó dừng ở lỗi đầu tiên, ở bất kỳ biến chưa định nghĩa nào, và ở bất kỳ chặng pipe nào thất bại. <em>Đây là ranh giới giữa script đồ chơi và script bạn tin dùng khi triển khai — thiết yếu nhưng hiếm khi được dạy.</em></div>
<div class="note-ct">Shell script là cách quản trị viên hệ thống và kỹ sư DevOps tự động hoá mọi thứ: sao lưu, triển khai, giám sát. File <code>deploy.sh</code> triển khai chính Academy này là một shell script. Nắm vững nó ở đây trực tiếp hữu ích cho sự nghiệp.</div>
</div>
`,
        },
        {
          title: 'Chapter 7 Quiz|||Quiz chương 7',
          slug: 'osg202-quiz-ch7',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: lệnh Linux, quyền, shell script, pipe.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Which command lists files with details?|||Lệnh nào liệt kê tệp kèm chi tiết?', options: ['pwd', 'ls -l', 'cd', 'rm'], correctIndex: 1, points: 1 },
              { question: 'Which command shows running processes?|||Lệnh nào hiện các tiến trình đang chạy?', options: ['mkdir', 'ps aux', 'touch', 'cp'], correctIndex: 1, points: 1 },
              { question: 'chmod is used to…|||chmod dùng để…', options: ['change file permissions|||đổi quyền tệp', 'delete files|||xoá tệp', 'list processes|||liệt kê tiến trình', 'show memory|||hiện bộ nhớ'], correctIndex: 0, points: 1 },
              { question: 'The pipe | in the shell…|||Ống pipe | trong shell…', options: ['deletes output|||xoá đầu ra', 'feeds one command\'s output into the next|||đưa đầu ra của lệnh này vào lệnh kế', 'creates a file|||tạo một tệp', 'ends a script|||kết thúc một script'], correctIndex: 1, points: 1 },
              { question: 'The Unix philosophy is to…|||Triết lý Unix là…', options: ['build one giant program|||xây một chương trình khổng lồ', 'make small tools that do one thing well and combine them|||làm công cụ nhỏ làm tốt một việc rồi kết hợp', 'avoid the command line|||tránh dòng lệnh', 'never automate|||không bao giờ tự động hoá'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 1 — OS HIỆN ĐẠI (CAPSTONE) ══════════════════ */
    {
      title: 'Advanced 1 — Virtualization, containers & modern OS|||Nâng cao 1 — Ảo hoá, container & OS hiện đại',
      description: 'Ngoài giáo trình — bài tổng kết: OS mở rộng thành cloud và Docker ra sao.',
      lessons: [
        {
          title: 'N1.1 — From OS concepts to the cloud|||N1.1 — Từ khái niệm OS tới đám mây',
          slug: 'osg202-n1-1-cloud-container',
          type: 'VIDEO',
          description: 'Máy ảo, container (Docker) và vì sao OS là nền của điện toán hiện đại.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 1 · Lesson N1.1</span>
<h2>The OS ideas that power the cloud</h2>
<p class="lead">Everything in OSG202 — processes, memory isolation, scheduling, file systems — scales up into the technology running the modern internet. This capstone connects your OS knowledge to virtualization, containers and the cloud.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Virtual machines</div><div class="lz-ld">One physical machine runs several complete OSes at once, each isolated. A <em>hypervisor</em> does for whole operating systems what the OS does for processes — resource management, one level up.</div></div>
  <div class="lz-layer"><div class="lz-lt">Containers (Docker)</div><div class="lz-ld">A lighter isolation: containers share one Linux kernel but each gets its own isolated processes, files and network. Built directly from OS features (namespaces &amp; cgroups). This Academy runs in containers.</div></div>
  <div class="lz-layer"><div class="lz-lt">The cloud</div><div class="lz-ld">Renting these isolated environments on demand. Behind every cloud service is an OS scheduling processes and managing memory — exactly what you learned here.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Process</div><div class="lz-t">isolate a program</div><div class="lz-d">Ch 2 — the OS</div></div>
  <div class="lz-step"><div class="lz-k">Container</div><div class="lz-t">isolate an app + its deps</div><div class="lz-d">OS namespaces</div></div>
  <div class="lz-step"><div class="lz-k">VM</div><div class="lz-t">isolate a whole OS</div><div class="lz-d">a hypervisor</div></div>
</div>
<div class="callout ok">The same idea — <strong>isolation and resource management</strong> — repeats at every scale: the OS isolates processes, containers isolate apps, hypervisors isolate operating systems, the cloud isolates tenants. Master the OS fundamentals here and the entire cloud stack becomes understandable.</div>
<div class="note-ct">Congratulations on completing OSG202. You now understand the software that runs every computer: how it shares the CPU, manages memory, organizes files, drives devices and avoids deadlock — and you can operate Linux from the shell. This is the foundation of systems programming, DevOps, and the cloud that runs the world.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 1 · Bài N1.1</span>
<h2>Các ý tưởng OS vận hành đám mây</h2>
<p class="lead">Mọi thứ trong OSG202 — tiến trình, cô lập bộ nhớ, lập lịch, hệ thống tệp — mở rộng thành công nghệ chạy internet hiện đại. Bài tổng kết này nối kiến thức OS của bạn với ảo hoá, container và đám mây.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Máy ảo (VM)</div><div class="lz-ld">Một máy vật lý chạy nhiều OS hoàn chỉnh cùng lúc, mỗi cái cô lập. Một <em>hypervisor</em> làm cho cả các hệ điều hành điều mà OS làm cho tiến trình — quản lý tài nguyên, thêm một tầng.</div></div>
  <div class="lz-layer"><div class="lz-lt">Container (Docker)</div><div class="lz-ld">Cô lập nhẹ hơn: container chia sẻ một kernel Linux nhưng mỗi cái có tiến trình, tệp và mạng cô lập riêng. Xây trực tiếp từ tính năng OS (namespace &amp; cgroups). Academy này chạy trong container.</div></div>
  <div class="lz-layer"><div class="lz-lt">Đám mây (cloud)</div><div class="lz-ld">Thuê các môi trường cô lập này theo yêu cầu. Đằng sau mọi dịch vụ đám mây là một OS lập lịch tiến trình và quản lý bộ nhớ — đúng thứ bạn học ở đây.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tiến trình</div><div class="lz-t">cô lập một chương trình</div><div class="lz-d">Ch 2 — OS</div></div>
  <div class="lz-step"><div class="lz-k">Container</div><div class="lz-t">cô lập một app + phụ thuộc</div><div class="lz-d">namespace OS</div></div>
  <div class="lz-step"><div class="lz-k">VM</div><div class="lz-t">cô lập cả một OS</div><div class="lz-d">một hypervisor</div></div>
</div>
<div class="callout ok">Cùng một ý tưởng — <strong>cô lập và quản lý tài nguyên</strong> — lặp lại ở mọi quy mô: OS cô lập tiến trình, container cô lập app, hypervisor cô lập hệ điều hành, đám mây cô lập người thuê. Nắm vững nền tảng OS ở đây và cả stack đám mây trở nên hiểu được.</div>
<div class="note-ct">Chúc mừng bạn hoàn thành OSG202. Giờ bạn hiểu phần mềm điều hành mọi máy tính: nó chia CPU, quản lý bộ nhớ, tổ chức tệp, điều khiển thiết bị và tránh deadlock ra sao — và bạn dùng được Linux từ shell. Đây là nền của lập trình hệ thống, DevOps, và đám mây đang vận hành thế giới.</div>
</div>
`,
        },
      ],
    },
    {
      "title": "Final Exam|||Thi cuối kỳ",
      "description": "Thi cuối kỳ FE (trắc nghiệm, máy chấm). Khung + câu mẫu; đề thật thêm sau khi có trang phòng thi.",
      "lessons": [
        {
          "title": "FE — Final Exam (Multiple Choice)|||FE — Thi trắc nghiệm cuối kỳ",
          "slug": "osg202-final-exam-fe",
          "type": "article",
          "description": "Khung thi trắc nghiệm cuối kỳ (FE) + vài câu mẫu từ môn. Đề thật thêm sau.",
          "content": "\n<div class=\"ml-en\">\n<span class=\"eyebrow\">Final Exam · FE</span>\n<h2>FE — Final Exam (Multiple Choice)</h2>\n<p class=\"lead\">The Final Exam (FE) for this subject is a <strong>computer-graded multiple-choice test</strong>. For the exact number of questions, duration, weight and pass mark, see <em>Lesson 0.2 — Grading</em>.</p>\n<h3>How to do well</h3>\n<ul>\n<li>Pace yourself: divide time by the number of questions; flag hard ones and return at the end.</li>\n<li>Eliminate clearly wrong options first, then choose among the rest.</li>\n<li>For \"what should you do / which is best\" items, answer by this subject's method, not gut feeling.</li>\n<li>Never leave the gated final blank &mdash; an educated guess beats an empty answer.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Sample</span> The questions below are <strong>sample questions</strong> drawn from this course to show the format. The <em>real past-exam questions</em> will be added here later, in the exam room.</div>\n</div>\n<div class=\"ml-vi\">\n<span class=\"eyebrow\">Thi cuối kỳ · FE</span>\n<h2>FE — Thi trắc nghiệm cuối kỳ</h2>\n<p class=\"lead\">Bài thi cuối kỳ (FE) của môn này là <strong>thi trắc nghiệm, máy chấm</strong>. Số câu, thời gian, trọng số và điểm qua cụ thể: xem <em>Bài 0.2 — Thang điểm</em>.</p>\n<h3>Cách làm tốt</h3>\n<ul>\n<li>Phân bổ thời gian: chia đều theo số câu; đánh dấu câu khó, quay lại ở cuối.</li>\n<li>Loại phương án sai rõ ràng trước, rồi chọn trong số còn lại.</li>\n<li>Câu \"nên làm gì / cái nào tốt nhất\" &mdash; trả lời theo phương pháp của môn, không theo cảm tính.</li>\n<li>Đừng bao giờ bỏ trống bài thi có cổng &mdash; đoán có suy luận vẫn hơn để trống.</li>\n</ul>\n<div class=\"callout\"><span class=\"badge\">Câu mẫu</span> Các câu dưới đây là <strong>câu mẫu</strong> lấy từ chính môn học để minh hoạ format. <em>Đề thi thật</em> sẽ được thêm vào đây sau, trong trang phòng thi.</div>\n</div>",
          "quiz": {
            "timeLimitSeconds": 360,
            "questions": [
              {
                "id": "q1",
                "points": 1,
                "question": "The two roles of an OS are resource manager and…|||Hai vai trò của OS là quản lý tài nguyên và…",
                "options": [
                  "a web server|||một máy chủ web",
                  "an extended machine (hiding hardware)|||một cỗ máy mở rộng (giấu phần cứng)",
                  "a compiler|||một trình biên dịch",
                  "a database|||một cơ sở dữ liệu"
                ],
                "correctIndex": 1
              },
              {
                "id": "q2",
                "points": 1,
                "question": "The core of the OS that runs in privileged mode is the…|||Lõi của OS chạy ở chế độ đặc quyền là…",
                "options": [
                  "shell|||shell",
                  "kernel|||kernel",
                  "compiler|||trình biên dịch",
                  "application|||ứng dụng"
                ],
                "correctIndex": 1
              },
              {
                "id": "q3",
                "points": 1,
                "question": "A system call is…|||Một system call là…",
                "options": [
                  "a phone call|||một cuộc gọi điện",
                  "a controlled request from a program to the kernel|||một yêu cầu có kiểm soát từ chương trình tới kernel",
                  "a hardware interrupt only|||chỉ một ngắt phần cứng",
                  "a shell command|||một lệnh shell"
                ],
                "correctIndex": 1
              },
              {
                "id": "q4",
                "points": 1,
                "question": "Why can a user program NOT touch hardware directly?|||Vì sao một chương trình người dùng KHÔNG chạm phần cứng trực tiếp?",
                "options": [
                  "it is too slow|||nó quá chậm",
                  "for safety/protection — it must go through the kernel|||vì an toàn/bảo vệ — phải qua kernel",
                  "hardware does not exist|||phần cứng không tồn tại",
                  "it is illegal to code|||viết code là phi pháp"
                ],
                "correctIndex": 1
              },
              {
                "id": "q5",
                "points": 1,
                "question": "A process is…|||Một tiến trình là…",
                "options": [
                  "a program file on disk|||một tệp chương trình trên đĩa",
                  "a program in execution with its own memory & state|||một chương trình đang thực thi có bộ nhớ & trạng thái riêng",
                  "a CPU core|||một nhân CPU",
                  "a system call|||một system call"
                ],
                "correctIndex": 1
              },
              {
                "id": "q6",
                "points": 1,
                "question": "Saving one process's registers and loading another's is a…|||Lưu thanh ghi của một tiến trình và nạp của tiến trình khác là một…",
                "options": [
                  "system call|||system call",
                  "context switch|||chuyển ngữ cảnh",
                  "deadlock|||bế tắc",
                  "page fault|||lỗi trang"
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
