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
<div class="pitfall">Nếu một hệ thống có quá ít RAM cho khối lượng công việc, nó dành hết thời gian swap trang ra/vào thay vì làm việc thật — đây là <strong>thrashing</strong>. Máy đứng hình dù CPU "bận." Thêm RAM hoặc chạy ít chương trình hơn để chữa.</div>
<div class="callout"><span class="badge">★ Ngoài giáo trình</span> <b>Nghịch lý Belady — thêm RAM, nhiều lỗi hơn.</b> Bạn sẽ nghĩ thêm khung luôn giảm lỗi trang, nhưng với thay trang <strong>FIFO</strong> điều đó không được bảo đảm: <strong>nghịch lý Belady (Belady's anomaly)</strong> là một chuỗi tham chiếu thật mà thêm một khung lại <em>làm tăng</em> số lỗi trang. LRU và các "thuật toán ngăn xếp" khác miễn nhiễm điều này (chứng minh được) — một lý do sâu vì sao kernel thật xấp xỉ LRU bằng thuật toán <em>clock</em> và không bao giờ dùng FIFO. <em>Một định lý phản trực giác syllabus hiếm khi chứng minh, nhưng nó giải thích vì sao FIFO bị bỏ trong thực tế.</em></div>
<div class="note-ct">Để ý song song sâu với cache CEA201: RAM cache cho đĩa, cache cache cho RAM. Thay trang (LRU) và thay cache là cùng một ý tưởng ở các tầng khác nhau của phân cấp bộ nhớ.</div>
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
  ],
};
