/**
 * CSI104 — Introduction to Computer Science (Nhập môn Khoa học Máy tính). Kỳ 1.
 * Nội dung Academy FPTU — bám sát syllabus (60 buổi, 12 CLO, giáo trình Forouzan
 * "Foundations of Computer Science") + chương nâng cao ngoài giáo trình.
 * Song ngữ EN/VN realtime (khối .ml-en / .ml-vi, tiêu đề EN|||VI).
 * Sơ đồ dùng .lz-map / .lz-flow / .lz-stack (KHÔNG ascii). Luyện tập → CodeLab;
 * công cụ/cài đặt → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/CSI104.mjs --apply
 */
export default {
  semester: { code: 'KY1', name: 'Kỳ 1', ordinal: 1 },
  course: {
    courseCode: 'CSI104',
    slug: 'introduction-to-computer-science',
    title: 'Introduction to Computer Science',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'A guided tour of all of computer science: how a computer works, how it stores bits, plus networks, operating systems, algorithms, programming, databases and security — the map for every course you take next.|||Tham quan toàn cảnh khoa học máy tính: máy tính hoạt động ra sao, lưu bit thế nào, cùng mạng, hệ điều hành, thuật toán, lập trình, CSDL và bảo mật — bản đồ cho mọi môn bạn học sau.',
    description: 'Môn nhập môn ngành, không đòi hỏi kiến thức lập trình trước. Học cách máy tính hoạt động từ tầng bit đến phần mềm, và làm quen 12 lĩnh vực cốt lõi của khoa học máy tính. Bám giáo trình Foundations of Computer Science (Forouzan).',
    whatYouLearn: 'Mô hình Von Neumann & các thành phần máy tính; hệ đếm & biểu diễn dữ liệu; mạng & Internet; hệ điều hành; thuật toán & cách biểu diễn; ngôn ngữ lập trình & paradigm; vòng đời phần mềm; cấu trúc dữ liệu; cơ sở dữ liệu; bảo mật & đạo đức nghề.',
    requirements: 'Không có môn tiên quyết. Chỉ cần một máy tính có trình duyệt web để dùng các công cụ trực quan (bộ chuyển hệ cơ số, mô phỏng CPU/OS).',
    documentsNote: 'Giáo trình chính: Foundations of Computer Science — Behrouz Forouzan (Cengage, 2017). Tham khảo: Fundamentals of Information Systems Security; Computer Architecture: A Quantitative Approach (Hennessy & Patterson). Kèm file syllabus gốc CSI104.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học ra sao, điều kiện qua môn, lộ trình 12 lĩnh vực và tài liệu.',
      lessons: [
        {
          title: '0.1 — About CSI104 & the big map|||0.1 — Giới thiệu môn CSI104 & bản đồ toàn cảnh',
          slug: 'csi104-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Môn học này là gì, học xong biết những gì, và bản đồ 12 lĩnh vực cốt lõi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About CSI104 — Introduction to Computer Science</h2>
<p class="lead">CSI104 is your <strong>bird's-eye tour</strong> of computer science. Instead of going deep into one skill, it walks you across the <strong>whole landscape</strong> — from the electricity-and-bits at the bottom, up through hardware, networks, operating systems, algorithms, programming, databases and security. By the end you own a <strong>mental map</strong> that tells you where every later course fits.</p>
<p>There is almost no coding here. The goal is <strong>understanding, not typing</strong>: how does a computer actually store the number 65 and the letter "A" using the same bits? How does a message travel from your laptop to a server in another country? What really happens when you double-click a program? CSI104 answers all of these at a level a first-semester student can follow.</p>
<h3>By the end of this course you will be able to</h3>
<ul>
  <li>Explain how a computer is built from subsystems (CPU, memory, I/O) around the <strong>Von Neumann model</strong>.</li>
  <li>Convert numbers between decimal, binary, octal and hexadecimal — and know how text, images, audio and video become bits.</li>
  <li>Describe how networks, the Internet and operating systems work at a conceptual level.</li>
  <li>Read and write simple <strong>algorithms</strong> (flowchart / pseudocode) and know the classic data structures and how databases store information.</li>
  <li>Discuss software engineering, computer security goals (CIA) and professional ethics.</li>
</ul>
<h3>Course map — 12 core areas</h3>
<p>The 60 university sessions are grouped into the roadmap below. Each area is a "world" of computer science; later semesters zoom into these one by one. Study them in order — the bottom builds up to the top:</p>
<div class="lz-map">
  <div class="lz-stage">The machine</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Computer Organization</div><div class="lz-nsub">Von Neumann model · CPU · memory · I/O</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Number Systems</div><div class="lz-nsub">Binary, octal, hex &amp; conversions</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Data Storage &amp; Operations</div><div class="lz-nsub">Numbers, text, media &amp; bit operations</div></div></div>
  <div class="lz-stage">Systems around it</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Networks &amp; the Internet</div><div class="lz-nsub">LAN/WAN · TCP/IP · layers</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Operating Systems</div><div class="lz-nsub">The manager of the whole machine</div></div></div>
  <div class="lz-stage">Software thinking</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Algorithms</div><div class="lz-nsub">Three constructs · search &amp; sort</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Programming Languages</div><div class="lz-nsub">Translation &amp; paradigms</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Software Engineering</div><div class="lz-nsub">The software lifecycle</div></div></div>
  <div class="lz-stage">Organizing data</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Data Structures</div><div class="lz-nsub">Array, list, stack, queue, tree, graph</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">File Structures</div><div class="lz-nsub">Text vs binary · access methods</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Databases</div><div class="lz-nsub">The relational model</div></div></div>
  <div class="lz-stage">Being a professional</div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Security &amp; Ethics</div><div class="lz-nsub">CIA goals · cryptography · privacy</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Logic gates · Big-O · Compilation · Cloud &amp; AI</div><div class="lz-nsub">Deeper connections that tie the whole map together</div></div></div>
</div>
<p>CSI104 sits next to <span class="badge">PRF192</span> Programming Fundamentals in semester 1. PRF192 teaches you to <em>build</em>; CSI104 teaches you to <em>understand the whole system</em> you are building inside. Everything you meet later — <span class="badge">CEA201</span>, <span class="badge">NWC203c</span>, <span class="badge">OSG202</span>, <span class="badge">DBI202</span>, <span class="badge">CSD201</span> — is a deep dive into one node on the map above.</p>
<div class="callout ok">How to study this course well: for every concept, <strong>find one concrete example</strong> and one <strong>picture in your head</strong>. "A pointer is an arrow." "A stack is a pile of plates." Concepts stick when they have an image.</div>
<a class="link-card exphub" href="/exp-hub/csi104-cong-cu-hoc-tap?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Learning tools for CSI104 — set up &amp; links</span><span class="lc-sub">Number-base converters, CPU/OS simulators, how to read the Forouzan textbook — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu môn CSI104 — Nhập môn Khoa học Máy tính</h2>
<p class="lead">CSI104 là chuyến <strong>tham quan toàn cảnh</strong> ngành khoa học máy tính. Thay vì đào sâu một kỹ năng, môn này dẫn bạn đi ngang qua <strong>cả bức tranh lớn</strong> — từ tầng điện–và–bit ở dưới cùng, lên tới phần cứng, mạng, hệ điều hành, thuật toán, lập trình, cơ sở dữ liệu và bảo mật. Học xong, bạn sở hữu một <strong>tấm bản đồ tư duy</strong> cho biết mọi môn học sau này nằm ở đâu.</p>
<p>Môn này gần như không lập trình. Mục tiêu là <strong>hiểu, không phải gõ code</strong>: máy tính thực sự lưu số 65 và chữ "A" bằng cùng những bit như thế nào? Một tin nhắn đi từ laptop của bạn tới một máy chủ ở nước khác ra sao? Điều gì thật sự xảy ra khi bạn nhấp đúp vào một chương trình? CSI104 trả lời tất cả ở mức một sinh viên kỳ đầu có thể theo được.</p>
<h3>Học xong môn này bạn sẽ làm được</h3>
<ul>
  <li>Giải thích máy tính được ghép từ các phân hệ (CPU, bộ nhớ, I/O) quanh <strong>mô hình Von Neumann</strong>.</li>
  <li>Chuyển số giữa hệ thập phân, nhị phân, bát phân và thập lục phân — và biết chữ, ảnh, âm thanh, video biến thành bit ra sao.</li>
  <li>Mô tả cách mạng, Internet và hệ điều hành hoạt động ở mức khái niệm.</li>
  <li>Đọc và viết <strong>thuật toán</strong> đơn giản (lưu đồ / mã giả) và biết các cấu trúc dữ liệu kinh điển cùng cách CSDL lưu thông tin.</li>
  <li>Bàn về công nghệ phần mềm, các mục tiêu bảo mật (CIA) và đạo đức nghề nghiệp.</li>
</ul>
<h3>Bản đồ môn học — 12 lĩnh vực cốt lõi</h3>
<p>60 buổi của trường được gom thành lộ trình bên dưới. Mỗi lĩnh vực là một "thế giới" của khoa học máy tính; các kỳ sau sẽ đào sâu từng cái một. Học tuần tự — tầng dưới nâng đỡ tầng trên:</p>
<div class="lz-map">
  <div class="lz-stage">Cỗ máy</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tổ chức máy tính</div><div class="lz-nsub">Mô hình Von Neumann · CPU · bộ nhớ · I/O</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Hệ đếm</div><div class="lz-nsub">Nhị phân, bát phân, thập lục phân &amp; chuyển đổi</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Lưu trữ &amp; thao tác dữ liệu</div><div class="lz-nsub">Số, chữ, media &amp; phép toán trên bit</div></div></div>
  <div class="lz-stage">Hệ thống quanh nó</div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Mạng &amp; Internet</div><div class="lz-nsub">LAN/WAN · TCP/IP · các tầng</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Hệ điều hành</div><div class="lz-nsub">Người quản lý cả cỗ máy</div></div></div>
  <div class="lz-stage">Tư duy phần mềm</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Thuật toán</div><div class="lz-nsub">Ba cấu trúc · tìm kiếm &amp; sắp xếp</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Ngôn ngữ lập trình</div><div class="lz-nsub">Dịch chương trình &amp; paradigm</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Công nghệ phần mềm</div><div class="lz-nsub">Vòng đời phần mềm</div></div></div>
  <div class="lz-stage">Tổ chức dữ liệu</div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Cấu trúc dữ liệu</div><div class="lz-nsub">Mảng, danh sách, ngăn xếp, hàng đợi, cây, đồ thị</div></div></div>
  <div class="lz-node"><div class="lz-badge">10</div><div class="lz-nbody"><div class="lz-ntitle">Cấu trúc tệp</div><div class="lz-nsub">Text vs binary · phương thức truy cập</div></div></div>
  <div class="lz-node"><div class="lz-badge">11</div><div class="lz-nbody"><div class="lz-ntitle">Cơ sở dữ liệu</div><div class="lz-nsub">Mô hình quan hệ</div></div></div>
  <div class="lz-stage">Trở thành người làm nghề</div>
  <div class="lz-node"><div class="lz-badge">12</div><div class="lz-nbody"><div class="lz-ntitle">Bảo mật &amp; Đạo đức</div><div class="lz-nsub">Mục tiêu CIA · mã hoá · quyền riêng tư</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Cổng logic · Big-O · Biên dịch · Cloud &amp; AI</div><div class="lz-nsub">Những kết nối sâu hơn buộc cả bản đồ lại với nhau</div></div></div>
</div>
<p>CSI104 đứng cạnh <span class="badge">PRF192</span> Cơ sở lập trình trong kỳ 1. PRF192 dạy bạn <em>xây</em>; CSI104 dạy bạn <em>hiểu cả hệ thống</em> mà bạn đang xây bên trong. Mọi thứ bạn gặp sau này — <span class="badge">CEA201</span>, <span class="badge">NWC203c</span>, <span class="badge">OSG202</span>, <span class="badge">DBI202</span>, <span class="badge">CSD201</span> — đều là bản đào sâu của một nút trên bản đồ trên.</p>
<div class="callout ok">Cách học tốt môn này: với mỗi khái niệm, hãy <strong>tìm một ví dụ cụ thể</strong> và một <strong>hình ảnh trong đầu</strong>. "Con trỏ là mũi tên." "Ngăn xếp là chồng đĩa." Khái niệm bám lại khi nó có hình ảnh đi kèm.</div>
<a class="link-card exphub" href="/exp-hub/csi104-cong-cu-hoc-tap?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Công cụ học CSI104 — cài đặt &amp; đường dẫn</span><span class="lc-sub">Bộ chuyển hệ cơ số, mô phỏng CPU/OS, cách đọc giáo trình Forouzan — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'csi104-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn qua môn và trọng số từng cột điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">Know the rules before the match. Everything below comes straight from the university's official CSI104 syllabus.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + 1h exam + 104h self-study</small></span></div>
  <div class="kv"><span class="k">Sessions</span><span class="v">60 sessions <small>45 min each</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">None <small>take it in semester 1</small></span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of sessions</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Group presentation</td><td>10%</td><td>On-going, 2 parts — a team topic presented in class</td></tr>
    <tr><td>Lab</td><td>20%</td><td>On-going, 2 labs — hands-on tasks</td></tr>
    <tr><td>Progress test</td><td>30%</td><td>3 tests spread through the term</td></tr>
    <tr><td>Final exam</td><td>40%</td><td>60 minutes — must score ≥ 4 to pass the course</td></tr>
  </tbody>
</table>
<div class="callout warn">Two independent gates. <strong>(1)</strong> Weighted average of all components ≥ 5.0. <strong>(2)</strong> The Final exam alone ≥ 4.0. Ace the coursework but score 3 on the final and you still fail — sit the final seriously.</div>
<h3>What "on-going" means</h3>
<p>The presentation, labs and progress tests happen <em>during</em> the term, not at the end. Miss a lab and you lose those points permanently — there is rarely a make-up. Keep a small calendar of the three progress-test weeks (around sessions 18, 43 and 57).</p>
<div class="note-ct">Because 60% of your grade is on-going, CSI104 rewards steady attendance far more than last-minute cramming. Show up, do every lab, and the final becomes easy.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Biết luật chơi trước khi vào trận. Mọi thông tin dưới đây lấy thẳng từ syllabus chính thức của CSI104.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h học + 1h thi + 104h tự học</small></span></div>
  <div class="kv"><span class="k">Số buổi</span><span class="v">60 buổi <small>45 phút/buổi</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Không <small>học ngay từ kỳ 1</small></span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% số buổi</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Thuyết trình nhóm</td><td>10%</td><td>Thường xuyên, 2 phần — nhóm trình bày một chủ đề trên lớp</td></tr>
    <tr><td>Lab</td><td>20%</td><td>Thường xuyên, 2 bài lab thực hành</td></tr>
    <tr><td>Progress test</td><td>30%</td><td>3 bài kiểm tra rải trong kỳ</td></tr>
    <tr><td>Thi cuối kỳ</td><td>40%</td><td>60 phút — phải đạt ≥ 4 mới qua môn</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai cửa độc lập. <strong>(1)</strong> Trung bình có trọng số mọi cột ≥ 5.0. <strong>(2)</strong> Riêng bài thi cuối kỳ ≥ 4.0. Điểm quá trình cao nhưng thi cuối được 3 thì vẫn rớt — hãy thi cuối kỳ nghiêm túc.</div>
<h3>"Thường xuyên" nghĩa là gì</h3>
<p>Thuyết trình, lab và progress test diễn ra <em>trong</em> kỳ, không dồn cuối kỳ. Vắng một buổi lab là mất điểm đó vĩnh viễn — hiếm khi có thi lại. Ghi vào lịch ba tuần có progress test (khoảng buổi 18, 43 và 57).</p>
<div class="note-ct">Vì 60% điểm là quá trình, CSI104 thưởng cho việc đi học đều hơn nhiều so với "cày" phút chót. Cứ đến lớp, làm đủ mọi lab, thì bài thi cuối trở nên nhẹ nhàng.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning outcomes (12 CLOs)|||0.3 — Chuẩn đầu ra (12 CLO)',
          slug: 'csi104-chuan-dau-ra',
          type: 'VIDEO',
          description: '12 điều nhà trường cam kết bạn làm được sau môn — dùng làm checklist ôn thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The 12 Course Learning Outcomes (CLOs)</h2>
<p class="lead">A CLO is a promise: "after this course, the student can do X". They are also your <strong>exam checklist</strong> — every final-exam question maps to one of these. Tick each one off as you go.</p>
<table>
  <thead><tr><th>#</th><th>You will be able to…</th><th>Covered in</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>List the subsystems of a computer and describe their role</td><td>Chapter 1</td></tr>
    <tr><td>CLO2</td><td>Convert a number between bases (decimal, binary, octal, hex)</td><td>Chapter 2</td></tr>
    <tr><td>CLO3</td><td>Describe how each data type is stored as bit patterns, and operations on data</td><td>Chapter 3</td></tr>
    <tr><td>CLO4</td><td>List the layers in networking and their relationship</td><td>Chapter 4</td></tr>
    <tr><td>CLO5</td><td>Understand the role of the OS in a computer system</td><td>Chapter 5</td></tr>
    <tr><td>CLO6</td><td>Define an algorithm and the tools used to design one</td><td>Chapter 6</td></tr>
    <tr><td>CLO7</td><td>Explain how a high-level program is translated into machine language</td><td>Chapter 7</td></tr>
    <tr><td>CLO8</td><td>Describe the software lifecycle</td><td>Chapter 8</td></tr>
    <tr><td>CLO9</td><td>Discuss data structures: array, record, linked list</td><td>Chapter 9</td></tr>
    <tr><td>CLO10</td><td>Distinguish text vs binary files and access methods</td><td>Chapter 10</td></tr>
    <tr><td>CLO11</td><td>Describe and explain operations within a relational database</td><td>Chapter 11</td></tr>
    <tr><td>CLO12</td><td>Describe security goals and discuss ethical issues</td><td>Chapter 12</td></tr>
  </tbody>
</table>
<div class="note-ct">Notice the CLOs line up one-to-one with the chapters. That is your revision plan: if you can teach a friend each row above in two sentences, you are ready for the final.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>12 Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">CLO là một lời hứa: "sau môn này, sinh viên làm được X". Chúng cũng là <strong>checklist ôn thi</strong> — mọi câu thi cuối kỳ đều gắn với một CLO. Cứ học tới đâu, gạch xong tới đó.</p>
<table>
  <thead><tr><th>#</th><th>Bạn sẽ làm được…</th><th>Học ở</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Liệt kê các phân hệ của máy tính và mô tả vai trò của chúng</td><td>Chương 1</td></tr>
    <tr><td>CLO2</td><td>Chuyển một số giữa các hệ cơ số (thập phân, nhị phân, bát phân, hex)</td><td>Chương 2</td></tr>
    <tr><td>CLO3</td><td>Mô tả từng kiểu dữ liệu được lưu dưới dạng mẫu bit, và các phép toán trên dữ liệu</td><td>Chương 3</td></tr>
    <tr><td>CLO4</td><td>Liệt kê các tầng trong mạng và quan hệ giữa chúng</td><td>Chương 4</td></tr>
    <tr><td>CLO5</td><td>Hiểu vai trò của hệ điều hành trong hệ thống máy tính</td><td>Chương 5</td></tr>
    <tr><td>CLO6</td><td>Định nghĩa thuật toán và các công cụ để thiết kế thuật toán</td><td>Chương 6</td></tr>
    <tr><td>CLO7</td><td>Giải thích một chương trình bậc cao được dịch sang mã máy ra sao</td><td>Chương 7</td></tr>
    <tr><td>CLO8</td><td>Mô tả vòng đời phần mềm</td><td>Chương 8</td></tr>
    <tr><td>CLO9</td><td>Bàn về các cấu trúc dữ liệu: mảng, bản ghi, danh sách liên kết</td><td>Chương 9</td></tr>
    <tr><td>CLO10</td><td>Phân biệt tệp text và binary cùng phương thức truy cập</td><td>Chương 10</td></tr>
    <tr><td>CLO11</td><td>Mô tả và giải thích các thao tác trong cơ sở dữ liệu quan hệ</td><td>Chương 11</td></tr>
    <tr><td>CLO12</td><td>Mô tả các mục tiêu bảo mật và bàn về vấn đề đạo đức</td><td>Chương 12</td></tr>
  </tbody>
</table>
<div class="note-ct">Để ý các CLO khớp một–một với các chương. Đó chính là kế hoạch ôn tập: nếu bạn giảng cho một người bạn từng dòng trên bằng hai câu, bạn đã sẵn sàng cho bài thi cuối.</div>
</div>
`,
        },
        {
          title: '0.4 — Materials & how to study|||0.4 — Tài liệu & cách học',
          slug: 'csi104-tai-lieu',
          type: 'VIDEO',
          description: 'Giáo trình Forouzan, các công cụ trực quan và một nhịp học hiệu quả.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials &amp; how to study this course</h2>
<p class="lead">CSI104 follows one famous textbook very closely. Knowing which book, which chapters, and how to read it saves you hours.</p>
<h3>Main textbook</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Foundations of Computer Science — Behrouz Forouzan (Cengage, 2017)</div><div class="lz-ld">The spine of the course. Almost every chapter here maps to a Forouzan chapter with the same name (Number Systems, Data Storage, Operating Systems…). Clear, beginner-friendly, lots of diagrams.</div></div>
  <div class="lz-layer"><div class="lz-lt">Fundamentals of Information Systems Security (Jones &amp; Bartlett)</div><div class="lz-ld">Reference for Chapter 12 (security goals, cryptography, ethics).</div></div>
  <div class="lz-layer"><div class="lz-lt">Computer Architecture: A Quantitative Approach (Hennessy &amp; Patterson)</div><div class="lz-ld">Deep reference for Chapter 1 — you only need the intro chapters at CSI104 level.</div></div>
</div>
<h3>Free tools you will actually use</h3>
<ul>
  <li>An online <strong>number-base converter</strong> to check your Chapter 2 conversions.</li>
  <li>A <strong>Little Man Computer</strong> or similar CPU simulator to see the fetch–decode–execute cycle in action.</li>
  <li>A <strong>flowchart drawer</strong> (draw.io) for Chapter 6 algorithm diagrams.</li>
</ul>
<h3>A study rhythm that works</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Before</div><div class="lz-t">Skim</div><div class="lz-d">Read the chapter map &amp; headings first</div></div>
  <div class="lz-step"><div class="lz-k">In class</div><div class="lz-t">Anchor</div><div class="lz-d">Catch the one core idea per session</div></div>
  <div class="lz-step"><div class="lz-k">After</div><div class="lz-t">Explain</div><div class="lz-d">Re-tell it in your own words</div></div>
  <div class="lz-step"><div class="lz-k">Weekly</div><div class="lz-t">Self-quiz</div><div class="lz-d">Use the chapter quizzes here</div></div>
</div>
<div class="callout ok">This course is wide, not deep — the risk is not difficulty but forgetting. The fix is spaced review: revisit each chapter's quiz a week later. The quizzes in this Academy course are built for exactly that.</div>
<a class="link-card exphub" href="/exp-hub/csi104-cong-cu-hoc-tap?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Tools &amp; links for CSI104</span><span class="lc-sub">Number converters, CPU/OS simulators, flowchart tools — one click each.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu &amp; cách học môn này</h2>
<p class="lead">CSI104 bám rất sát một giáo trình nổi tiếng. Biết sách nào, chương nào và cách đọc nó sẽ tiết kiệm cho bạn nhiều giờ.</p>
<h3>Giáo trình chính</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Foundations of Computer Science — Behrouz Forouzan (Cengage, 2017)</div><div class="lz-ld">Xương sống của môn. Gần như mọi chương ở đây khớp với một chương Forouzan cùng tên (Hệ đếm, Lưu trữ dữ liệu, Hệ điều hành…). Rõ ràng, dễ cho người mới, nhiều hình.</div></div>
  <div class="lz-layer"><div class="lz-lt">Fundamentals of Information Systems Security (Jones &amp; Bartlett)</div><div class="lz-ld">Tham khảo cho Chương 12 (mục tiêu bảo mật, mã hoá, đạo đức).</div></div>
  <div class="lz-layer"><div class="lz-lt">Computer Architecture: A Quantitative Approach (Hennessy &amp; Patterson)</div><div class="lz-ld">Tham khảo sâu cho Chương 1 — ở mức CSI104 bạn chỉ cần các chương mở đầu.</div></div>
</div>
<h3>Công cụ miễn phí bạn sẽ thật sự dùng</h3>
<ul>
  <li>Một <strong>bộ chuyển hệ cơ số</strong> trực tuyến để kiểm tra kết quả chuyển đổi ở Chương 2.</li>
  <li>Một <strong>Little Man Computer</strong> hoặc mô phỏng CPU tương tự để thấy chu trình nạp–giải mã–thực thi hoạt động.</li>
  <li>Một <strong>công cụ vẽ lưu đồ</strong> (draw.io) cho sơ đồ thuật toán ở Chương 6.</li>
</ul>
<h3>Một nhịp học hiệu quả</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Trước</div><div class="lz-t">Lướt</div><div class="lz-d">Đọc bản đồ chương &amp; các tiêu đề trước</div></div>
  <div class="lz-step"><div class="lz-k">Trên lớp</div><div class="lz-t">Bắt ý</div><div class="lz-d">Nắm một ý cốt lõi mỗi buổi</div></div>
  <div class="lz-step"><div class="lz-k">Sau</div><div class="lz-t">Giảng lại</div><div class="lz-d">Kể lại bằng lời của bạn</div></div>
  <div class="lz-step"><div class="lz-k">Hàng tuần</div><div class="lz-t">Tự kiểm tra</div><div class="lz-d">Dùng các quiz cuối chương ở đây</div></div>
</div>
<div class="callout ok">Môn này rộng chứ không sâu — rủi ro không phải khó mà là quên. Cách chữa là ôn giãn cách: quay lại quiz mỗi chương sau một tuần. Các quiz trong khóa Academy này được làm ra đúng cho việc đó.</div>
<a class="link-card exphub" href="/exp-hub/csi104-cong-cu-hoc-tap?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science" target="_blank" rel="noopener">
  <span class="lc-ico">🧰</span>
  <span class="lc-body"><span class="lc-title">Công cụ &amp; đường dẫn cho CSI104</span><span class="lc-sub">Bộ chuyển cơ số, mô phỏng CPU/OS, công cụ lưu đồ — mỗi thứ một cú nhấp.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — TỔ CHỨC MÁY TÍNH ══════════════════ */
    {
      title: 'Chapter 1 — Computer Organization & the Von Neumann Model|||Chương 1 — Tổ chức máy tính & mô hình Von Neumann',
      description: 'Máy tính được ghép từ những phân hệ nào, mô hình Von Neumann, CPU, bộ nhớ và I/O hoạt động ra sao.',
      lessons: [
        {
          title: '1.1 — What is a computer? The Von Neumann model|||1.1 — Máy tính là gì? Mô hình Von Neumann',
          slug: 'csi104-1-1-von-neumann',
          type: 'VIDEO',
          description: 'Máy tính như một bộ xử lý dữ liệu và ý tưởng "chương trình lưu trong bộ nhớ".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>What is a computer?</h2>
<p class="lead">At its simplest, a computer is a <strong>data processor</strong>: it takes <em>input data</em>, follows a <em>program</em>, and produces <em>output data</em>. The magic is that the same box can compute payroll, edit a photo, or run a game — only the program changes.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">In</div><div class="lz-t">Input data</div><div class="lz-d">numbers, text, clicks</div></div>
  <div class="lz-step"><div class="lz-k">Rule</div><div class="lz-t">Program</div><div class="lz-d">the steps to follow</div></div>
  <div class="lz-step"><div class="lz-k">Out</div><div class="lz-t">Output data</div><div class="lz-d">result on screen/disk</div></div>
</div>
<h3>The Von Neumann model — the idea behind (almost) every computer</h3>
<p>In 1945 John von Neumann described an architecture that still shapes today's machines. Its key insight: <strong>the program is stored in memory, just like the data</strong>. Because instructions are also data, a computer can load any program without being physically rewired.</p>
<div class="lz-map">
  <div class="lz-stage">Four subsystems</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Memory</div><div class="lz-nsub">Stores BOTH the program and the data it works on</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Arithmetic Logic Unit (ALU)</div><div class="lz-nsub">Does the actual calculations &amp; comparisons</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Control Unit</div><div class="lz-nsub">Reads instructions and tells everyone what to do</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Input / Output</div><div class="lz-nsub">The bridge to the outside world</div></div></div>
</div>
<h3>Three pillars of the model</h3>
<ul>
  <li><strong>Stored-program concept:</strong> the program lives in memory as bit patterns.</li>
  <li><strong>Sequential execution:</strong> instructions run one after another, unless a jump changes the order.</li>
  <li><strong>Data &amp; instructions share memory:</strong> both are just numbers — that is why a bug can accidentally overwrite code.</li>
</ul>
<div class="callout ok">Every phone, laptop and server you touch is a Von Neumann machine. When you "install an app", you are literally copying a program into memory/disk so the same hardware can now do a new thing.</div>
<div class="pitfall">A common mix-up: the Von Neumann model is <em>logical</em>, not physical. The ALU and Control Unit together are what we package as the CPU chip; memory is the RAM. The model describes <em>roles</em>, not which plastic box each part sits in.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Máy tính là gì?</h2>
<p class="lead">Đơn giản nhất, máy tính là một <strong>bộ xử lý dữ liệu</strong>: nhận <em>dữ liệu vào</em>, làm theo một <em>chương trình</em>, và tạo <em>dữ liệu ra</em>. Điều kỳ diệu là cùng một chiếc hộp có thể tính lương, sửa ảnh, hay chạy game — chỉ chương trình thay đổi.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Vào</div><div class="lz-t">Dữ liệu vào</div><div class="lz-d">số, chữ, cú nhấp</div></div>
  <div class="lz-step"><div class="lz-k">Luật</div><div class="lz-t">Chương trình</div><div class="lz-d">các bước cần làm</div></div>
  <div class="lz-step"><div class="lz-k">Ra</div><div class="lz-t">Dữ liệu ra</div><div class="lz-d">kết quả trên màn hình/đĩa</div></div>
</div>
<h3>Mô hình Von Neumann — ý tưởng đằng sau (gần như) mọi máy tính</h3>
<p>Năm 1945 John von Neumann mô tả một kiến trúc đến nay vẫn định hình máy tính hiện đại. Ý tưởng then chốt: <strong>chương trình được lưu trong bộ nhớ, y như dữ liệu</strong>. Vì lệnh cũng là dữ liệu, máy có thể nạp bất kỳ chương trình nào mà không cần đấu lại dây.</p>
<div class="lz-map">
  <div class="lz-stage">Bốn phân hệ</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Bộ nhớ (Memory)</div><div class="lz-nsub">Lưu CẢ chương trình lẫn dữ liệu nó xử lý</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Đơn vị số học–logic (ALU)</div><div class="lz-nsub">Thực hiện phép tính &amp; so sánh</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Đơn vị điều khiển (Control Unit)</div><div class="lz-nsub">Đọc lệnh và điều phối mọi thành phần</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Nhập / Xuất (I/O)</div><div class="lz-nsub">Cầu nối với thế giới bên ngoài</div></div></div>
</div>
<h3>Ba trụ cột của mô hình</h3>
<ul>
  <li><strong>Chương trình lưu trong bộ nhớ:</strong> chương trình nằm trong bộ nhớ dưới dạng mẫu bit.</li>
  <li><strong>Thực thi tuần tự:</strong> lệnh chạy lần lượt, trừ khi một lệnh nhảy đổi thứ tự.</li>
  <li><strong>Dữ liệu &amp; lệnh chung bộ nhớ:</strong> cả hai đều chỉ là số — vì thế một lỗi có thể vô tình ghi đè lên code.</li>
</ul>
<div class="callout ok">Mọi điện thoại, laptop và máy chủ bạn chạm vào đều là máy Von Neumann. Khi bạn "cài một app", bạn thực chất đang chép một chương trình vào bộ nhớ/đĩa để cùng phần cứng đó giờ làm được việc mới.</div>
<div class="pitfall">Một nhầm lẫn phổ biến: mô hình Von Neumann là <em>logic</em>, không phải vật lý. ALU và Control Unit gộp lại là thứ ta đóng gói thành con chip CPU; bộ nhớ là RAM. Mô hình mô tả <em>vai trò</em>, không phải mỗi phần nằm trong hộp nhựa nào.</div>
</div>
`,
        },
        {
          title: '1.2 — Computer generations & the subsystems|||1.2 — Các thế hệ máy tính & các phân hệ',
          slug: 'csi104-1-2-the-he-phan-he',
          type: 'VIDEO',
          description: 'Từ đèn chân không tới vi mạch, và năm phân hệ vật lý của một máy tính.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>How computers grew up — five generations</h2>
<p class="lead">Computers did not appear finished. Each "generation" is defined by the switching technology it used — and every jump made machines smaller, cheaper and thousands of times faster.</p>
<table>
  <thead><tr><th>Gen</th><th>Era</th><th>Core technology</th><th>Feel of it</th></tr></thead>
  <tbody>
    <tr><td>1st</td><td>1940s–50s</td><td>Vacuum tubes</td><td>Room-sized, hot, fragile</td></tr>
    <tr><td>2nd</td><td>late 50s–60s</td><td>Transistors</td><td>Smaller, more reliable</td></tr>
    <tr><td>3rd</td><td>1960s–70s</td><td>Integrated circuits (ICs)</td><td>Many transistors on one chip</td></tr>
    <tr><td>4th</td><td>1970s–now</td><td>Microprocessors (VLSI)</td><td>A whole CPU on one chip → the PC</td></tr>
    <tr><td>5th</td><td>now &amp; ahead</td><td>AI, parallel &amp; quantum</td><td>Machines that "learn" and scale</td></tr>
  </tbody>
</table>
<h3>The five physical subsystems</h3>
<p>Where the Von Neumann model gives <em>logical</em> roles, a real computer is built from these <strong>physical</strong> parts:</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">CPU</div><div class="lz-nsub">The brain — Control Unit + ALU + registers</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Main memory (RAM)</div><div class="lz-nsub">Fast, temporary working space; lost on power-off</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Secondary storage</div><div class="lz-nsub">Disk/SSD — slow but permanent</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Input devices</div><div class="lz-nsub">Keyboard, mouse, camera, mic</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Output devices</div><div class="lz-nsub">Screen, speaker, printer</div></div></div>
</div>
<p>Everything is wired together by a <strong>bus</strong> — a set of shared electrical lines carrying data, addresses and control signals between subsystems.</p>
<div class="note-ct">Notice the two-layer memory story: RAM is fast but forgets when power is off; the disk is slow but remembers. Chapter 1.4 explains why we need both, and Chapter 5 (the OS) explains who juggles them.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Máy tính lớn lên thế nào — năm thế hệ</h2>
<p class="lead">Máy tính không xuất hiện ở dạng hoàn chỉnh. Mỗi "thế hệ" được định nghĩa bởi công nghệ chuyển mạch nó dùng — và mỗi bước nhảy khiến máy nhỏ hơn, rẻ hơn và nhanh hơn hàng nghìn lần.</p>
<table>
  <thead><tr><th>Thế hệ</th><th>Thời kỳ</th><th>Công nghệ lõi</th><th>Cảm giác</th></tr></thead>
  <tbody>
    <tr><td>1</td><td>1940s–50s</td><td>Đèn chân không</td><td>To bằng cả phòng, nóng, dễ hỏng</td></tr>
    <tr><td>2</td><td>cuối 50s–60s</td><td>Bóng bán dẫn (transistor)</td><td>Nhỏ hơn, tin cậy hơn</td></tr>
    <tr><td>3</td><td>1960s–70s</td><td>Vi mạch tích hợp (IC)</td><td>Nhiều transistor trên một chip</td></tr>
    <tr><td>4</td><td>1970s–nay</td><td>Vi xử lý (VLSI)</td><td>Cả CPU trên một chip → máy PC</td></tr>
    <tr><td>5</td><td>hiện tại &amp; tương lai</td><td>AI, song song &amp; lượng tử</td><td>Máy biết "học" và mở rộng</td></tr>
  </tbody>
</table>
<h3>Năm phân hệ vật lý</h3>
<p>Trong khi mô hình Von Neumann cho các vai trò <em>logic</em>, một máy tính thật được ghép từ các bộ phận <strong>vật lý</strong> này:</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">CPU</div><div class="lz-nsub">Bộ não — Control Unit + ALU + thanh ghi</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Bộ nhớ chính (RAM)</div><div class="lz-nsub">Nhanh, tạm thời; mất khi tắt điện</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Bộ nhớ ngoài</div><div class="lz-nsub">Đĩa/SSD — chậm nhưng lưu vĩnh viễn</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Thiết bị vào</div><div class="lz-nsub">Bàn phím, chuột, camera, micro</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Thiết bị ra</div><div class="lz-nsub">Màn hình, loa, máy in</div></div></div>
</div>
<p>Tất cả được nối với nhau bằng <strong>bus</strong> — một bộ đường điện dùng chung mang dữ liệu, địa chỉ và tín hiệu điều khiển giữa các phân hệ.</p>
<div class="note-ct">Để ý câu chuyện hai tầng bộ nhớ: RAM nhanh nhưng quên khi tắt điện; đĩa chậm nhưng nhớ. Bài 1.4 giải thích vì sao cần cả hai, và Chương 5 (hệ điều hành) giải thích ai là người điều phối chúng.</div>
</div>
`,
        },
        {
          title: '1.3 — The CPU: fetch–decode–execute|||1.3 — CPU: nạp–giải mã–thực thi',
          slug: 'csi104-1-3-cpu-cycle',
          type: 'VIDEO',
          description: 'Bên trong bộ não: Control Unit, ALU, thanh ghi và chu trình lệnh.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.3</span>
<h2>Inside the CPU</h2>
<p class="lead">The <strong>CPU</strong> (Central Processing Unit) is the brain. It has three parts working together: the <strong>Control Unit</strong> (the conductor), the <strong>ALU</strong> (the calculator), and a handful of tiny, ultra-fast storage cells called <strong>registers</strong>.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">CU</div><div class="lz-nbody"><div class="lz-ntitle">Control Unit</div><div class="lz-nsub">Fetches each instruction &amp; directs the others</div></div></div>
  <div class="lz-node"><div class="lz-badge">ALU</div><div class="lz-nbody"><div class="lz-ntitle">Arithmetic Logic Unit</div><div class="lz-nsub">Adds, subtracts, compares, ANDs/ORs</div></div></div>
  <div class="lz-node"><div class="lz-badge">R</div><div class="lz-nbody"><div class="lz-ntitle">Registers</div><div class="lz-nsub">A few super-fast slots the CPU works in right now</div></div></div>
</div>
<h3>The instruction cycle — done billions of times per second</h3>
<p>Everything the CPU does is this loop, repeated over and over:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Fetch</div><div class="lz-d">Read the next instruction from memory</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Decode</div><div class="lz-d">Figure out what it means</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Execute</div><div class="lz-d">The ALU does the work</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Store</div><div class="lz-d">Write the result back</div></div>
</div>
<p>A special register, the <strong>Program Counter (PC)</strong>, always holds the address of the next instruction. After each fetch it steps forward — that is what makes execution "sequential". A jump instruction simply changes the PC.</p>
<h3>What "3 GHz" really means</h3>
<p>The CPU is driven by a <strong>clock</strong> that ticks billions of times a second. 3 GHz = 3 billion ticks per second, and simple instructions take one or a few ticks. More cores means several of these cycles running in parallel.</p>
<div class="note-ct">Want to <em>see</em> fetch–decode–execute happen step by step? A "Little Man Computer" simulator lets you watch the PC advance and the ALU add — linked in the CSI104 tools guide on Exp Hub.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-282" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">See memory addresses in real code</span><span class="lc-sub">In C you touch registers/memory directly — the CodeLab "Pointers &amp; Memory" module makes it concrete.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.3</span>
<h2>Bên trong CPU</h2>
<p class="lead"><strong>CPU</strong> (Central Processing Unit — bộ xử lý trung tâm) là bộ não. Nó có ba phần phối hợp: <strong>Control Unit</strong> (nhạc trưởng), <strong>ALU</strong> (máy tính), và một nhúm ô nhớ nhỏ, cực nhanh gọi là <strong>thanh ghi (register)</strong>.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">CU</div><div class="lz-nbody"><div class="lz-ntitle">Đơn vị điều khiển</div><div class="lz-nsub">Nạp từng lệnh &amp; điều phối các phần</div></div></div>
  <div class="lz-node"><div class="lz-badge">ALU</div><div class="lz-nbody"><div class="lz-ntitle">Đơn vị số học–logic</div><div class="lz-nsub">Cộng, trừ, so sánh, AND/OR</div></div></div>
  <div class="lz-node"><div class="lz-badge">R</div><div class="lz-nbody"><div class="lz-ntitle">Thanh ghi</div><div class="lz-nsub">Vài ô cực nhanh mà CPU đang làm việc ngay lúc này</div></div></div>
</div>
<h3>Chu trình lệnh — lặp hàng tỷ lần mỗi giây</h3>
<p>Mọi việc CPU làm là vòng lặp này, lặp đi lặp lại:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">1</div><div class="lz-t">Nạp (Fetch)</div><div class="lz-d">Đọc lệnh tiếp theo từ bộ nhớ</div></div>
  <div class="lz-step"><div class="lz-k">2</div><div class="lz-t">Giải mã (Decode)</div><div class="lz-d">Hiểu lệnh đó nghĩa là gì</div></div>
  <div class="lz-step"><div class="lz-k">3</div><div class="lz-t">Thực thi (Execute)</div><div class="lz-d">ALU làm công việc</div></div>
  <div class="lz-step"><div class="lz-k">4</div><div class="lz-t">Lưu (Store)</div><div class="lz-d">Ghi kết quả trở lại</div></div>
</div>
<p>Một thanh ghi đặc biệt, <strong>Program Counter (PC)</strong>, luôn giữ địa chỉ của lệnh kế tiếp. Sau mỗi lần nạp nó tiến lên — đó là lý do thực thi "tuần tự". Một lệnh nhảy đơn giản là đổi giá trị PC.</p>
<h3>"3 GHz" thật sự nghĩa là gì</h3>
<p>CPU được dẫn nhịp bởi một <strong>đồng hồ (clock)</strong> đập hàng tỷ lần mỗi giây. 3 GHz = 3 tỷ nhịp/giây, và lệnh đơn giản mất một hoặc vài nhịp. Nhiều nhân (core) nghĩa là nhiều chu trình như vậy chạy song song.</p>
<div class="note-ct">Muốn <em>thấy</em> nạp–giải mã–thực thi diễn ra từng bước? Một mô phỏng "Little Man Computer" cho bạn xem PC tiến lên và ALU cộng — có liên kết trong guide công cụ CSI104 trên Exp Hub.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-282" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Thấy địa chỉ bộ nhớ trong code thật</span><span class="lc-sub">Trong C bạn chạm trực tiếp thanh ghi/bộ nhớ — module "Con trỏ &amp; Bộ nhớ" ở CodeLab làm điều đó cụ thể.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '1.4 — Memory: main, cache & the hierarchy|||1.4 — Bộ nhớ: chính, cache & phân cấp',
          slug: 'csi104-1-4-memory-hierarchy',
          type: 'VIDEO',
          description: 'Vì sao máy có nhiều loại bộ nhớ và cache lấp khoảng cách tốc độ ra sao.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.4</span>
<h2>Why a computer has many kinds of memory</h2>
<p class="lead">There is a cruel trade-off in hardware: memory that is <strong>fast</strong> is tiny and expensive; memory that is <strong>big</strong> is slow and cheap. No single technology is fast, large and cheap all at once — so engineers stack several layers into a <strong>memory hierarchy</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Registers — inside the CPU</div><div class="lz-ld">A few dozen slots · sub-nanosecond · the CPU's hands</div></div>
  <div class="lz-layer"><div class="lz-lt">Cache (L1 / L2 / L3)</div><div class="lz-ld">KB–MB · a few nanoseconds · keeps recently used data close</div></div>
  <div class="lz-layer"><div class="lz-lt">Main memory (RAM)</div><div class="lz-ld">GB · ~tens of ns · the working desk; erased on power-off</div></div>
  <div class="lz-layer"><div class="lz-lt">Secondary storage (SSD / HDD)</div><div class="lz-ld">TB · microseconds–ms · permanent warehouse</div></div>
</div>
<p>As you go <strong>down</strong> the stack: bigger and cheaper, but slower. As you go <strong>up</strong>: faster, but tinier and pricier. The CPU always wants data at the top; the system's job is to keep the useful bits up there.</p>
<h3>Cache — the clever shortcut</h3>
<p>RAM is thousands of times slower than the CPU. If the CPU waited for RAM every time, it would sit idle most of the day. <strong>Cache</strong> is a small, very fast memory that keeps a copy of recently and frequently used data. Thanks to <em>locality</em> (programs reuse the same data and nearby data), the cache answers most requests instantly.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Ask</div><div class="lz-t">CPU needs data</div><div class="lz-d">Check cache first</div></div>
  <div class="lz-step"><div class="lz-k">Hit</div><div class="lz-t">Found in cache</div><div class="lz-d">Answer in ~1 ns</div></div>
  <div class="lz-step"><div class="lz-k">Miss</div><div class="lz-t">Not in cache</div><div class="lz-d">Fetch from RAM &amp; copy up</div></div>
</div>
<div class="callout ok">Everyday proof: the second time you open a big app it launches faster. Parts of it are still cached in RAM (and RAM is cached toward the CPU), so less has to be fetched from the slow disk.</div>
<div class="pitfall">RAM is <strong>volatile</strong> — cut the power and it forgets everything. That is why unsaved work vanishes in a crash: it was only in RAM, never written to the permanent disk.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.4</span>
<h2>Vì sao máy tính có nhiều loại bộ nhớ</h2>
<p class="lead">Phần cứng có một đánh đổi khắc nghiệt: bộ nhớ <strong>nhanh</strong> thì nhỏ và đắt; bộ nhớ <strong>lớn</strong> thì chậm và rẻ. Không công nghệ đơn lẻ nào vừa nhanh, vừa lớn, vừa rẻ — nên kỹ sư xếp nhiều tầng thành <strong>phân cấp bộ nhớ</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Thanh ghi — trong CPU</div><div class="lz-ld">Vài chục ô · dưới nano-giây · bàn tay của CPU</div></div>
  <div class="lz-layer"><div class="lz-lt">Cache (L1 / L2 / L3)</div><div class="lz-ld">KB–MB · vài nano-giây · giữ dữ liệu vừa dùng ở gần</div></div>
  <div class="lz-layer"><div class="lz-lt">Bộ nhớ chính (RAM)</div><div class="lz-ld">GB · hàng chục ns · mặt bàn làm việc; mất khi tắt điện</div></div>
  <div class="lz-layer"><div class="lz-lt">Bộ nhớ ngoài (SSD / HDD)</div><div class="lz-ld">TB · micro-giây–ms · nhà kho lưu vĩnh viễn</div></div>
</div>
<p>Càng đi <strong>xuống</strong>: lớn hơn, rẻ hơn, nhưng chậm hơn. Càng đi <strong>lên</strong>: nhanh hơn, nhưng nhỏ và đắt hơn. CPU luôn muốn dữ liệu ở tầng trên; việc của hệ thống là giữ những bit hữu ích ở đó.</p>
<h3>Cache — lối tắt thông minh</h3>
<p>RAM chậm hơn CPU hàng nghìn lần. Nếu CPU chờ RAM mỗi lần, nó sẽ ngồi không gần cả ngày. <strong>Cache</strong> là bộ nhớ nhỏ, rất nhanh, giữ bản sao dữ liệu vừa và hay dùng. Nhờ <em>tính cục bộ (locality)</em> (chương trình dùng lại cùng dữ liệu và dữ liệu lân cận), cache trả lời hầu hết yêu cầu tức thì.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Hỏi</div><div class="lz-t">CPU cần dữ liệu</div><div class="lz-d">Kiểm cache trước</div></div>
  <div class="lz-step"><div class="lz-k">Trúng</div><div class="lz-t">Có trong cache</div><div class="lz-d">Trả lời trong ~1 ns</div></div>
  <div class="lz-step"><div class="lz-k">Trượt</div><div class="lz-t">Không có trong cache</div><div class="lz-d">Lấy từ RAM &amp; chép lên</div></div>
</div>
<div class="callout ok">Bằng chứng đời thường: lần thứ hai mở một app lớn, nó khởi động nhanh hơn. Một phần của nó vẫn còn cache trong RAM (và RAM được cache về phía CPU), nên phải lấy ít hơn từ đĩa chậm.</div>
<div class="pitfall">RAM là <strong>bay hơi (volatile)</strong> — mất điện là quên sạch. Vì thế công việc chưa lưu biến mất khi treo máy: nó chỉ ở RAM, chưa bao giờ được ghi xuống đĩa lưu vĩnh viễn.</div>
</div>
`,
        },
        {
          title: '1.5 — Input/Output & different architectures|||1.5 — Nhập/Xuất & các kiến trúc khác nhau',
          slug: 'csi104-1-5-io-architectures',
          type: 'VIDEO',
          description: 'Cách máy giao tiếp với thiết bị ngoài và điểm khác giữa các kiến trúc.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.5</span>
<h2>Talking to the outside world — the I/O subsystem</h2>
<p class="lead">The CPU runs at billions of cycles a second; a keyboard produces a few keystrokes a second; a disk is somewhere in between. The <strong>I/O subsystem</strong> exists to bridge these wildly different speeds so the fast CPU is not held hostage by slow devices.</p>
<h3>Three ways the CPU handles I/O</h3>
<table>
  <thead><tr><th>Method</th><th>How it works</th><th>Cost</th></tr></thead>
  <tbody>
    <tr><td>Programmed I/O (polling)</td><td>CPU keeps asking "ready yet?" in a loop</td><td>Simple but wastes CPU time</td></tr>
    <tr><td>Interrupt-driven I/O</td><td>Device raises an <em>interrupt</em> when ready; CPU works meanwhile</td><td>Efficient — the standard approach</td></tr>
    <tr><td>DMA (Direct Memory Access)</td><td>A controller moves data to memory without the CPU</td><td>Best for big transfers (disk, network)</td></tr>
  </tbody>
</table>
<p>An <strong>interrupt</strong> is like a doorbell: instead of the CPU checking the door every second, the visitor rings when they arrive, and the CPU handles it then goes back to work.</p>
<h3>Different architectures</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Von Neumann vs Harvard</div><div class="lz-ld">Von Neumann shares one memory/bus for code and data; Harvard uses separate memories — common in microcontrollers for speed and safety.</div></div>
  <div class="lz-layer"><div class="lz-lt">CISC vs RISC</div><div class="lz-ld">CISC (e.g. x86) has many complex instructions; RISC (e.g. ARM) has few simple ones done very fast — the chip in your phone is RISC.</div></div>
  <div class="lz-layer"><div class="lz-lt">Single-core vs multi-core</div><div class="lz-ld">Modern CPUs pack several cores so multiple instruction cycles run truly in parallel.</div></div>
</div>
<div class="note-ct">Chapter recap: a computer = CPU (control + ALU + registers) + memory hierarchy + I/O, all tied by a bus, all following the stored-program Von Neumann idea. Everything else in CSI104 runs <em>on top of</em> this machine — hold this picture as you read on.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.5</span>
<h2>Giao tiếp với thế giới ngoài — phân hệ I/O</h2>
<p class="lead">CPU chạy hàng tỷ chu kỳ mỗi giây; bàn phím tạo vài phím gõ mỗi giây; đĩa nằm đâu đó ở giữa. <strong>Phân hệ I/O</strong> sinh ra để bắc cầu qua những tốc độ chênh lệch khủng khiếp này, để CPU nhanh không bị thiết bị chậm "bắt làm con tin".</p>
<h3>Ba cách CPU xử lý I/O</h3>
<table>
  <thead><tr><th>Phương pháp</th><th>Cách hoạt động</th><th>Chi phí</th></tr></thead>
  <tbody>
    <tr><td>Programmed I/O (hỏi vòng)</td><td>CPU liên tục hỏi "xong chưa?" trong vòng lặp</td><td>Đơn giản nhưng phí thời gian CPU</td></tr>
    <tr><td>Interrupt-driven I/O</td><td>Thiết bị phát <em>ngắt (interrupt)</em> khi sẵn sàng; CPU làm việc khác trong lúc đó</td><td>Hiệu quả — cách chuẩn</td></tr>
    <tr><td>DMA (truy cập bộ nhớ trực tiếp)</td><td>Một bộ điều khiển chuyển dữ liệu vào bộ nhớ mà không cần CPU</td><td>Tốt nhất cho khối lớn (đĩa, mạng)</td></tr>
  </tbody>
</table>
<p>Một <strong>ngắt (interrupt)</strong> giống chuông cửa: thay vì CPU cứ mỗi giây ra kiểm cửa, khách tới thì bấm chuông, CPU xử lý rồi quay lại làm việc.</p>
<h3>Các kiến trúc khác nhau</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Von Neumann vs Harvard</div><div class="lz-ld">Von Neumann dùng chung một bộ nhớ/bus cho code và dữ liệu; Harvard dùng bộ nhớ tách riêng — phổ biến trong vi điều khiển để nhanh và an toàn hơn.</div></div>
  <div class="lz-layer"><div class="lz-lt">CISC vs RISC</div><div class="lz-ld">CISC (vd x86) có nhiều lệnh phức tạp; RISC (vd ARM) có ít lệnh đơn giản làm rất nhanh — con chip trong điện thoại bạn là RISC.</div></div>
  <div class="lz-layer"><div class="lz-lt">Một nhân vs đa nhân</div><div class="lz-ld">CPU hiện đại gói nhiều nhân để nhiều chu trình lệnh chạy thật sự song song.</div></div>
</div>
<div class="note-ct">Tóm tắt chương: máy tính = CPU (điều khiển + ALU + thanh ghi) + phân cấp bộ nhớ + I/O, nối bằng bus, tuân theo ý tưởng chương-trình-lưu-trong-bộ-nhớ của Von Neumann. Mọi thứ khác trong CSI104 chạy <em>bên trên</em> cỗ máy này — hãy giữ bức tranh này khi đọc tiếp.</div>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'csi104-quiz-ch1',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: mô hình Von Neumann, CPU, bộ nhớ, I/O.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'The Von Neumann model\'s key idea is that…|||Ý tưởng then chốt của mô hình Von Neumann là…', options: ['the CPU has many cores|||CPU có nhiều nhân', 'the program is stored in memory like data|||chương trình được lưu trong bộ nhớ như dữ liệu', 'input equals output|||đầu vào bằng đầu ra', 'memory never forgets|||bộ nhớ không bao giờ quên'], correctIndex: 1, points: 1 },
              { question: 'Which two parts make up the CPU\'s core, apart from registers?|||Ngoài thanh ghi, hai phần nào tạo nên lõi CPU?', options: ['RAM and disk|||RAM và đĩa', 'Control Unit and ALU|||Control Unit và ALU', 'Keyboard and screen|||Bàn phím và màn hình', 'Cache and bus|||Cache và bus'], correctIndex: 1, points: 1 },
              { question: 'The correct order of the instruction cycle is:|||Thứ tự đúng của chu trình lệnh là:', options: ['Execute → Fetch → Decode|||Thực thi → Nạp → Giải mã', 'Fetch → Decode → Execute|||Nạp → Giải mã → Thực thi', 'Decode → Execute → Fetch|||Giải mã → Thực thi → Nạp', 'Store → Fetch → Decode|||Lưu → Nạp → Giải mã'], correctIndex: 1, points: 1 },
              { question: 'Why is cache memory used?|||Vì sao dùng bộ nhớ cache?', options: ['To store files permanently|||Để lưu tệp vĩnh viễn', 'To bridge the speed gap between CPU and RAM|||Để bắc cầu chênh lệch tốc độ giữa CPU và RAM', 'To connect to the network|||Để kết nối mạng', 'To replace the ALU|||Để thay thế ALU'], correctIndex: 1, points: 1 },
              { question: 'RAM is described as "volatile" because…|||RAM được mô tả là "bay hơi" vì…', options: ['it is very fast|||nó rất nhanh', 'it loses its contents when power is off|||nó mất nội dung khi tắt điện', 'it can catch fire|||nó có thể bốc cháy', 'it is larger than a disk|||nó lớn hơn đĩa'], correctIndex: 1, points: 1 },
              { question: 'An interrupt lets the CPU…|||Ngắt (interrupt) cho phép CPU…', options: ['constantly poll each device|||liên tục hỏi vòng mọi thiết bị', 'do other work until a device signals it is ready|||làm việc khác cho tới khi thiết bị báo sẵn sàng', 'shut down safely|||tắt máy an toàn', 'convert numbers to binary|||chuyển số sang nhị phân'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — HỆ ĐẾM ══════════════════ */
    {
      title: 'Chapter 2 — Number Systems|||Chương 2 — Hệ đếm',
      description: 'Hệ vị trí, vì sao máy tính dùng nhị phân, chuyển đổi giữa các hệ cơ số và số học nhị phân.',
      lessons: [
        {
          title: '2.1 — Positional systems & why computers use binary|||2.1 — Hệ vị trí & vì sao máy tính dùng nhị phân',
          slug: 'csi104-2-1-he-vi-tri',
          type: 'VIDEO',
          description: 'Giá trị vị trí, cơ số, và lý do phần cứng chọn hệ nhị phân.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Positional number systems</h2>
<p class="lead">In a <strong>positional system</strong>, the value of a digit depends on its <em>position</em>. The number 235 is not "2, 3, 5" — it is 2×100 + 3×10 + 5×1. The base (here 10) is raised to the power of each position.</p>
<div class="out"><b>Decimal 235</b> = 2×10² + 3×10¹ + 5×10⁰ = 200 + 30 + 5</div>
<p>Four systems matter in computing, each with a different base:</p>
<table>
  <thead><tr><th>System</th><th>Base</th><th>Digits used</th><th>Where you meet it</th></tr></thead>
  <tbody>
    <tr><td>Decimal</td><td>10</td><td>0–9</td><td>Everyday human numbers</td></tr>
    <tr><td>Binary</td><td>2</td><td>0, 1</td><td>Inside every computer</td></tr>
    <tr><td>Octal</td><td>8</td><td>0–7</td><td>Unix file permissions</td></tr>
    <tr><td>Hexadecimal</td><td>16</td><td>0–9, A–F</td><td>Colors, memory addresses</td></tr>
  </tbody>
</table>
<h3>Why do computers use binary?</h3>
<p>Because hardware is built from <strong>switches</strong>. A transistor is either on or off, a wire is either high-voltage or low. Two states map perfectly to two digits: 1 and 0. Trying to reliably store ten voltage levels for decimal would be fragile and expensive — two clean states are cheap and error-resistant.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Physical</div><div class="lz-t">Switch on / off</div><div class="lz-d">high or low voltage</div></div>
  <div class="lz-step"><div class="lz-k">Logical</div><div class="lz-t">1 / 0</div><div class="lz-d">one binary digit = a bit</div></div>
  <div class="lz-step"><div class="lz-k">Grouped</div><div class="lz-t">8 bits = 1 byte</div><div class="lz-d">the basic unit of storage</div></div>
</div>
<div class="note-ct">A <strong>bit</strong> is one 0/1. Eight bits make a <strong>byte</strong>, which can hold 256 different patterns (2⁸). Bigger units: KB, MB, GB, TB — each roughly 1000× the last. Hex exists mainly because it is a compact shorthand for binary: one hex digit = exactly four bits.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Hệ đếm theo vị trí</h2>
<p class="lead">Trong <strong>hệ vị trí</strong>, giá trị của một chữ số phụ thuộc vào <em>vị trí</em> của nó. Số 235 không phải "2, 3, 5" — nó là 2×100 + 3×10 + 5×1. Cơ số (ở đây là 10) được nâng lũy thừa theo từng vị trí.</p>
<div class="out"><b>Thập phân 235</b> = 2×10² + 3×10¹ + 5×10⁰ = 200 + 30 + 5</div>
<p>Bốn hệ quan trọng trong tin học, mỗi hệ một cơ số:</p>
<table>
  <thead><tr><th>Hệ</th><th>Cơ số</th><th>Chữ số dùng</th><th>Gặp ở đâu</th></tr></thead>
  <tbody>
    <tr><td>Thập phân</td><td>10</td><td>0–9</td><td>Số của con người hàng ngày</td></tr>
    <tr><td>Nhị phân</td><td>2</td><td>0, 1</td><td>Bên trong mọi máy tính</td></tr>
    <tr><td>Bát phân</td><td>8</td><td>0–7</td><td>Quyền tệp Unix</td></tr>
    <tr><td>Thập lục phân (hex)</td><td>16</td><td>0–9, A–F</td><td>Màu sắc, địa chỉ bộ nhớ</td></tr>
  </tbody>
</table>
<h3>Vì sao máy tính dùng nhị phân?</h3>
<p>Vì phần cứng được xây từ <strong>công tắc</strong>. Một transistor hoặc bật hoặc tắt, một dây hoặc điện áp cao hoặc thấp. Hai trạng thái khớp hoàn hảo với hai chữ số: 1 và 0. Cố lưu tin cậy mười mức điện áp cho hệ thập phân sẽ mong manh và tốn kém — hai trạng thái rõ ràng thì rẻ và chống lỗi.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Vật lý</div><div class="lz-t">Công tắc bật / tắt</div><div class="lz-d">điện áp cao hoặc thấp</div></div>
  <div class="lz-step"><div class="lz-k">Logic</div><div class="lz-t">1 / 0</div><div class="lz-d">một chữ số nhị phân = một bit</div></div>
  <div class="lz-step"><div class="lz-k">Gom nhóm</div><div class="lz-t">8 bit = 1 byte</div><div class="lz-d">đơn vị lưu trữ cơ bản</div></div>
</div>
<div class="note-ct">Một <strong>bit</strong> là một số 0/1. Tám bit thành một <strong>byte</strong>, chứa được 256 mẫu khác nhau (2⁸). Đơn vị lớn hơn: KB, MB, GB, TB — mỗi bậc khoảng 1000× bậc trước. Hex tồn tại chủ yếu vì nó là cách viết tắt gọn của nhị phân: một chữ số hex = đúng bốn bit.</div>
</div>
`,
        },
        {
          title: '2.2 — Converting between bases|||2.2 — Chuyển đổi giữa các hệ cơ số',
          slug: 'csi104-2-2-chuyen-doi',
          type: 'VIDEO',
          description: 'Thập phân ↔ nhị phân ↔ bát phân ↔ hex bằng phương pháp chia dư và gom nhóm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.2</span>
<h2>Converting between bases</h2>
<p class="lead">Base conversion is the CLO2 exam skill you will be tested on directly. There are only a few methods — master them and every question becomes mechanical.</p>
<h3>① Any base → Decimal: expand by position</h3>
<p>Multiply each digit by its place value and add up.</p>
<div class="out"><b>Binary 1011 → Decimal</b><br>1×8 + 0×4 + 1×2 + 1×1 = <b>11</b></div>
<div class="out"><b>Hex 2F → Decimal</b><br>2×16 + 15×1 = 32 + 15 = <b>47</b>  <small>(F = 15)</small></div>
<h3>② Decimal → any base: repeated division</h3>
<p>Divide by the base, keep the remainders, then read the remainders <strong>bottom to top</strong>.</p>
<div class="out"><b>Decimal 13 → Binary</b><br>13 ÷ 2 = 6 r <b>1</b><br>6 ÷ 2 = 3 r <b>0</b><br>3 ÷ 2 = 1 r <b>1</b><br>1 ÷ 2 = 0 r <b>1</b><br>Read up → <b>1101</b></div>
<h3>③ Binary ↔ Octal ↔ Hex: group the bits</h3>
<p>This is the fast trick. Because 8 = 2³ and 16 = 2⁴, you just group binary digits: <strong>3 bits per octal digit, 4 bits per hex digit</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Binary</div><div class="lz-t">1101 1110</div><div class="lz-d">split into 4-bit groups</div></div>
  <div class="lz-step"><div class="lz-k">Group</div><div class="lz-t">1101 = D · 1110 = E</div><div class="lz-d">each nibble → 1 hex digit</div></div>
  <div class="lz-step"><div class="lz-k">Hex</div><div class="lz-t">DE</div><div class="lz-d">done — no arithmetic needed</div></div>
</div>
<div class="pitfall">When grouping bits, pad from the <strong>left</strong> so the group count is complete. 11010 for hex becomes 0001 1010 → 1A, not 1 1010. Forgetting to pad is the #1 conversion mistake.</div>
<div class="note-ct">Always sanity-check with a converter after doing it by hand — but do it by hand first. The exam has no converter, and understanding the method is the point.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-279" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Bits &amp; bases in real code</span><span class="lc-sub">C prints hex with %x and shifts bits with &lt;&lt; — the "Variables, Types &amp; Operators" module lets you try.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.2</span>
<h2>Chuyển đổi giữa các hệ cơ số</h2>
<p class="lead">Chuyển hệ cơ số là kỹ năng CLO2 bạn sẽ bị hỏi thẳng trong bài thi. Chỉ có vài phương pháp — nắm chắc thì mọi câu trở nên máy móc.</p>
<h3>① Hệ bất kỳ → Thập phân: khai triển theo vị trí</h3>
<p>Nhân từng chữ số với giá trị vị trí rồi cộng lại.</p>
<div class="out"><b>Nhị phân 1011 → Thập phân</b><br>1×8 + 0×4 + 1×2 + 1×1 = <b>11</b></div>
<div class="out"><b>Hex 2F → Thập phân</b><br>2×16 + 15×1 = 32 + 15 = <b>47</b>  <small>(F = 15)</small></div>
<h3>② Thập phân → hệ bất kỳ: chia lấy dư liên tiếp</h3>
<p>Chia cho cơ số, giữ các số dư, rồi đọc số dư <strong>từ dưới lên</strong>.</p>
<div class="out"><b>Thập phân 13 → Nhị phân</b><br>13 ÷ 2 = 6 dư <b>1</b><br>6 ÷ 2 = 3 dư <b>0</b><br>3 ÷ 2 = 1 dư <b>1</b><br>1 ÷ 2 = 0 dư <b>1</b><br>Đọc lên → <b>1101</b></div>
<h3>③ Nhị phân ↔ Bát phân ↔ Hex: gom nhóm bit</h3>
<p>Đây là mẹo nhanh. Vì 8 = 2³ và 16 = 2⁴, bạn chỉ cần gom chữ số nhị phân: <strong>3 bit cho mỗi chữ số bát phân, 4 bit cho mỗi chữ số hex</strong>.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nhị phân</div><div class="lz-t">1101 1110</div><div class="lz-d">tách thành nhóm 4 bit</div></div>
  <div class="lz-step"><div class="lz-k">Gom</div><div class="lz-t">1101 = D · 1110 = E</div><div class="lz-d">mỗi nhóm 4 bit → 1 chữ số hex</div></div>
  <div class="lz-step"><div class="lz-k">Hex</div><div class="lz-t">DE</div><div class="lz-d">xong — không cần tính toán</div></div>
</div>
<div class="pitfall">Khi gom bit, đệm thêm 0 từ <strong>bên trái</strong> cho đủ nhóm. 11010 sang hex thành 0001 1010 → 1A, không phải 1 1010. Quên đệm là lỗi chuyển đổi số một.</div>
<div class="note-ct">Luôn kiểm lại bằng công cụ chuyển sau khi làm tay — nhưng làm tay trước đã. Bài thi không có công cụ, và hiểu phương pháp mới là mục tiêu.</div>
<a class="link-card codelab" href="/code-lab/c?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-279" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Bit &amp; hệ cơ số trong code thật</span><span class="lc-sub">C in hex bằng %x và dịch bit bằng &lt;&lt; — module "Biến, Kiểu &amp; Toán tử" cho bạn thử.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '2.3 — Binary arithmetic|||2.3 — Số học nhị phân',
          slug: 'csi104-2-3-so-hoc-nhi-phan',
          type: 'VIDEO',
          description: 'Cộng, nhân trong nhị phân và khái niệm tràn số (overflow).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.3</span>
<h2>Doing math in binary</h2>
<p class="lead">Binary arithmetic follows the same rules as decimal — you just carry at 2 instead of 10. The ALU inside the CPU does exactly this, at the speed of electricity.</p>
<h3>Binary addition</h3>
<p>Only four cases to remember: 0+0=0, 0+1=1, 1+0=1, and 1+1=<strong>10</strong> (write 0, carry 1).</p>
<div class="out"><b>1011 + 0110</b><br>&nbsp;&nbsp;1011  (11)<br>+ 0110  (6)<br>------<br>10001  (17)  ← the carry rippled to a new column</div>
<h3>Binary multiplication</h3>
<p>Even simpler than decimal: multiplying by 0 gives 0, by 1 gives the number itself. It becomes a series of shifts and adds.</p>
<div class="out"><b>101 × 11</b> = 101 + 1010 = <b>1111</b>  (5 × 3 = 15) ✓</div>
<h3>Overflow — when the answer will not fit</h3>
<p>A computer stores numbers in a fixed number of bits (say 8). If a result needs a 9th bit, that bit is lost — the value <strong>wraps around</strong>. This is <em>overflow</em>, and it is a real source of bugs.</p>
<div class="callout warn">In 8-bit unsigned storage, 255 + 1 does not give 256 — it wraps to 0. The famous "Gandhi becomes hyper-aggressive" video-game bug and many security holes come from exactly this kind of overflow.</div>
<div class="note-ct">This is why Chapter 3 matters: the <em>meaning</em> of a bit pattern (how many bits, signed or unsigned, integer or float) decides what arithmetic is correct. The bits alone do not tell you.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.3</span>
<h2>Làm toán trong hệ nhị phân</h2>
<p class="lead">Số học nhị phân theo đúng quy tắc như thập phân — chỉ khác là nhớ ở 2 thay vì ở 10. ALU trong CPU làm chính điều này, ở tốc độ của điện.</p>
<h3>Cộng nhị phân</h3>
<p>Chỉ cần nhớ bốn trường hợp: 0+0=0, 0+1=1, 1+0=1, và 1+1=<strong>10</strong> (viết 0, nhớ 1).</p>
<div class="out"><b>1011 + 0110</b><br>&nbsp;&nbsp;1011  (11)<br>+ 0110  (6)<br>------<br>10001  (17)  ← nhớ lan sang một cột mới</div>
<h3>Nhân nhị phân</h3>
<p>Còn đơn giản hơn thập phân: nhân với 0 cho 0, nhân với 1 cho chính số đó. Nó trở thành một chuỗi phép dịch và cộng.</p>
<div class="out"><b>101 × 11</b> = 101 + 1010 = <b>1111</b>  (5 × 3 = 15) ✓</div>
<h3>Tràn số (overflow) — khi kết quả không vừa</h3>
<p>Máy tính lưu số trong một số bit cố định (ví dụ 8). Nếu kết quả cần bit thứ 9, bit đó bị mất — giá trị <strong>quay vòng</strong>. Đó là <em>tràn số</em>, và là nguồn lỗi thật sự.</p>
<div class="callout warn">Trong lưu trữ 8-bit không dấu, 255 + 1 không cho 256 — nó quay về 0. Lỗi game "Gandhi bỗng hung hãn" nổi tiếng và nhiều lỗ hổng bảo mật đến từ đúng kiểu tràn số này.</div>
<div class="note-ct">Đây là lý do Chương 3 quan trọng: <em>ý nghĩa</em> của một mẫu bit (bao nhiêu bit, có dấu hay không, số nguyên hay thực) quyết định phép toán nào đúng. Riêng các bit không nói cho bạn điều đó.</div>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'csi104-quiz-ch2',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: hệ vị trí, chuyển đổi cơ số, số học nhị phân.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'How many different patterns can one byte (8 bits) represent?|||Một byte (8 bit) biểu diễn được bao nhiêu mẫu khác nhau?', options: ['8', '16', '128', '256'], correctIndex: 3, points: 1 },
              { question: 'Binary 1011 equals which decimal value?|||Nhị phân 1011 bằng giá trị thập phân nào?', options: ['9', '11', '13', '15'], correctIndex: 1, points: 1 },
              { question: 'Decimal 13 in binary is:|||Thập phân 13 trong nhị phân là:', options: ['1011', '1101', '1110', '1001'], correctIndex: 1, points: 1 },
              { question: 'Hexadecimal 2F equals which decimal value?|||Hex 2F bằng giá trị thập phân nào?', options: ['31', '45', '47', '62'], correctIndex: 2, points: 1 },
              { question: 'One hexadecimal digit corresponds to how many bits?|||Một chữ số hex tương ứng bao nhiêu bit?', options: ['2 bits', '3 bits', '4 bits', '8 bits'], correctIndex: 2, points: 1 },
              { question: 'What is overflow?|||Tràn số (overflow) là gì?', options: ['A number too small to store|||Số quá nhỏ để lưu', 'A result needing more bits than are available, so it wraps around|||Kết quả cần nhiều bit hơn số có, nên quay vòng', 'Dividing by zero|||Chia cho 0', 'A negative binary number|||Một số nhị phân âm'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — LƯU TRỮ & THAO TÁC DỮ LIỆU ══════════════════ */
    {
      title: 'Chapter 3 — Data Storage & Operations|||Chương 3 — Lưu trữ & thao tác dữ liệu',
      description: 'Số, chữ, ảnh, âm thanh, video được lưu thành bit ra sao và các phép toán logic/dịch trên bit.',
      lessons: [
        {
          title: '3.1 — Storing numbers: integers & floats|||3.1 — Lưu số: số nguyên & số thực',
          slug: 'csi104-3-1-luu-so',
          type: 'VIDEO',
          description: 'Không dấu, bù hai (two\'s complement) cho số âm, và dấu phẩy động IEEE.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>How numbers become bit patterns</h2>
<p class="lead">A bit pattern like 11000001 has no meaning by itself. Its value depends on how we agree to <em>interpret</em> it. Here are the three standard agreements for storing numbers.</p>
<h3>① Unsigned integers</h3>
<p>Straight binary — all bits carry positive place value. 8 bits store 0 to 255. Simple, but no negatives.</p>
<h3>② Signed integers: two\'s complement</h3>
<p>To store negatives, computers use <strong>two\'s complement</strong>. The leftmost bit becomes a sign (0 = positive, 1 = negative), and negatives are formed by "flip all bits, then add 1". The beauty: ordinary binary addition then works for both positive and negative numbers, so the ALU needs no special subtract circuit.</p>
<div class="out"><b>−5 in 8-bit two&#39;s complement</b><br>+5 = 00000101<br>flip → 11111010<br>+1  → 11111011  = −5</div>
<h3>③ Real numbers: floating point (IEEE 754)</h3>
<p>Numbers like 3.14 use <strong>floating point</strong>: the bits are split into a <em>sign</em>, an <em>exponent</em>, and a <em>mantissa</em> — like scientific notation (1.23 × 10⁴) but in binary.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Sign (1 bit)</div><div class="lz-ld">0 = positive, 1 = negative</div></div>
  <div class="lz-layer"><div class="lz-lt">Exponent</div><div class="lz-ld">how far to shift the binary point (the scale)</div></div>
  <div class="lz-layer"><div class="lz-lt">Mantissa / fraction</div><div class="lz-ld">the significant digits</div></div>
</div>
<div class="pitfall">Floating point is <strong>approximate</strong>. Many decimals (like 0.1) have no exact binary form, so 0.1 + 0.2 can print 0.30000000000000004. Never compare floats with == in code — this surprises every new programmer.</div>
<div class="note-ct">Same bits, different meaning: 11111011 is 251 as unsigned but −5 as signed two&#39;s complement. The type declared in your program tells the computer which reading to use.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Số biến thành mẫu bit ra sao</h2>
<p class="lead">Một mẫu bit như 11000001 tự nó không có nghĩa. Giá trị của nó phụ thuộc vào cách ta thống nhất <em>diễn giải</em> nó. Dưới đây là ba thoả thuận chuẩn để lưu số.</p>
<h3>① Số nguyên không dấu</h3>
<p>Nhị phân thẳng — mọi bit mang giá trị vị trí dương. 8 bit lưu từ 0 đến 255. Đơn giản, nhưng không có số âm.</p>
<h3>② Số nguyên có dấu: bù hai (two&#39;s complement)</h3>
<p>Để lưu số âm, máy tính dùng <strong>bù hai</strong>. Bit trái nhất thành bit dấu (0 = dương, 1 = âm), và số âm được tạo bằng "lật hết bit, rồi cộng 1". Cái hay: phép cộng nhị phân thông thường khi đó đúng cho cả số dương lẫn âm, nên ALU không cần mạch trừ riêng.</p>
<div class="out"><b>−5 trong bù hai 8-bit</b><br>+5 = 00000101<br>lật → 11111010<br>+1  → 11111011  = −5</div>
<h3>③ Số thực: dấu phẩy động (IEEE 754)</h3>
<p>Số như 3.14 dùng <strong>dấu phẩy động</strong>: các bit được chia thành <em>dấu</em>, <em>số mũ (exponent)</em>, và <em>phần định trị (mantissa)</em> — giống ký hiệu khoa học (1.23 × 10⁴) nhưng bằng nhị phân.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Dấu (1 bit)</div><div class="lz-ld">0 = dương, 1 = âm</div></div>
  <div class="lz-layer"><div class="lz-lt">Số mũ (exponent)</div><div class="lz-ld">dịch dấu phẩy nhị phân bao xa (tỷ lệ)</div></div>
  <div class="lz-layer"><div class="lz-lt">Phần định trị (mantissa)</div><div class="lz-ld">các chữ số có nghĩa</div></div>
</div>
<div class="pitfall">Dấu phẩy động là <strong>gần đúng</strong>. Nhiều số thập phân (như 0.1) không có dạng nhị phân chính xác, nên 0.1 + 0.2 có thể in ra 0.30000000000000004. Đừng bao giờ so sánh số thực bằng == trong code — điều này làm mọi lập trình viên mới bất ngờ.</div>
<div class="note-ct">Cùng bit, khác nghĩa: 11111011 là 251 nếu không dấu nhưng là −5 nếu có dấu bù hai. Kiểu dữ liệu khai báo trong chương trình cho máy biết đọc theo cách nào.</div>
</div>
`,
        },
        {
          title: '3.2 — Storing text, images, audio & video|||3.2 — Lưu chữ, ảnh, âm thanh & video',
          slug: 'csi104-3-2-luu-media',
          type: 'VIDEO',
          description: 'ASCII/Unicode cho chữ, pixel cho ảnh, mẫu (sample) cho âm thanh, khung hình cho video.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.2</span>
<h2>Everything is bits — even a photo or a song</h2>
<p class="lead">A computer stores only 0s and 1s, so text, images, audio and video must all be encoded as numbers first. The trick is a different <strong>encoding scheme</strong> for each kind of data.</p>
<h3>Text — one number per character</h3>
<p><strong>ASCII</strong> assigns a code to each character: A = 65, a = 97, 0 = 48. But 256 codes cannot hold every language, so <strong>Unicode</strong> (usually UTF-8) extends this to cover every script and emoji.</p>
<div class="out"><b>"Hi" in ASCII</b> → H=72, i=105 → 01001000 01101001</div>
<h3>Images — a grid of pixels</h3>
<p>An image is a grid of dots (<strong>pixels</strong>). Each pixel stores a color, typically as three bytes: Red, Green, Blue (0–255 each). A 1000×1000 photo has a million pixels — which is why raw images are large and why we compress them (JPEG, PNG).</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Pixel</div><div class="lz-t">R,G,B</div><div class="lz-d">255,0,0 = pure red</div></div>
  <div class="lz-step"><div class="lz-k">Grid</div><div class="lz-t">width × height</div><div class="lz-d">millions of pixels</div></div>
  <div class="lz-step"><div class="lz-k">Compress</div><div class="lz-t">JPEG/PNG</div><div class="lz-d">smaller file, same look</div></div>
</div>
<h3>Audio — sampling a wave</h3>
<p>Sound is a continuous wave. The computer measures its height thousands of times a second (<strong>sampling</strong>, e.g. 44,100 times/sec for CD quality) and stores each measurement as a number.</p>
<h3>Video — many images per second</h3>
<p>Video is just a rapid sequence of images (<strong>frames</strong>, e.g. 30 fps) plus a synced audio track. That is enormous data, so video compression (H.264) is essential.</p>
<div class="note-ct">One unifying idea: to digitize the real (analog) world, we <strong>sample</strong> it and turn each sample into a number. More samples = higher fidelity but bigger files. That trade-off is at the heart of all media formats.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.2</span>
<h2>Mọi thứ đều là bit — kể cả tấm ảnh hay bài hát</h2>
<p class="lead">Máy tính chỉ lưu 0 và 1, nên chữ, ảnh, âm thanh và video đều phải được mã hoá thành số trước. Bí quyết là một <strong>sơ đồ mã hoá</strong> khác nhau cho mỗi loại dữ liệu.</p>
<h3>Chữ — mỗi ký tự một con số</h3>
<p><strong>ASCII</strong> gán một mã cho mỗi ký tự: A = 65, a = 97, 0 = 48. Nhưng 256 mã không chứa nổi mọi ngôn ngữ, nên <strong>Unicode</strong> (thường là UTF-8) mở rộng để bao mọi hệ chữ viết và emoji.</p>
<div class="out"><b>"Hi" theo ASCII</b> → H=72, i=105 → 01001000 01101001</div>
<h3>Ảnh — một lưới điểm ảnh</h3>
<p>Một tấm ảnh là lưới các chấm (<strong>pixel</strong>). Mỗi pixel lưu một màu, thường là ba byte: Đỏ, Lục, Lam (mỗi kênh 0–255). Ảnh 1000×1000 có một triệu pixel — vì thế ảnh thô rất nặng và ta phải nén (JPEG, PNG).</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Pixel</div><div class="lz-t">R,G,B</div><div class="lz-d">255,0,0 = đỏ thuần</div></div>
  <div class="lz-step"><div class="lz-k">Lưới</div><div class="lz-t">rộng × cao</div><div class="lz-d">hàng triệu pixel</div></div>
  <div class="lz-step"><div class="lz-k">Nén</div><div class="lz-t">JPEG/PNG</div><div class="lz-d">tệp nhỏ hơn, nhìn như cũ</div></div>
</div>
<h3>Âm thanh — lấy mẫu sóng</h3>
<p>Âm thanh là một sóng liên tục. Máy đo độ cao của nó hàng nghìn lần mỗi giây (<strong>lấy mẫu — sampling</strong>, ví dụ 44.100 lần/giây cho chất lượng CD) và lưu mỗi lần đo thành một con số.</p>
<h3>Video — nhiều ảnh mỗi giây</h3>
<p>Video chỉ là một chuỗi ảnh nối nhanh (<strong>khung hình — frame</strong>, ví dụ 30 fps) cộng với âm thanh đồng bộ. Đó là lượng dữ liệu khổng lồ, nên nén video (H.264) là bắt buộc.</p>
<div class="note-ct">Một ý tưởng chung: để số hoá thế giới thực (analog), ta <strong>lấy mẫu</strong> nó và biến mỗi mẫu thành một con số. Nhiều mẫu hơn = trung thực hơn nhưng tệp lớn hơn. Đánh đổi đó nằm ở trung tâm mọi định dạng media.</div>
</div>
`,
        },
        {
          title: '3.3 — Logic operations on bits|||3.3 — Phép toán logic trên bit',
          slug: 'csi104-3-3-phep-logic',
          type: 'VIDEO',
          description: 'AND, OR, NOT, XOR ở mức bit và cách dùng mặt nạ (mask).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.3</span>
<h2>Logic operations — the ALU\'s core skill</h2>
<p class="lead">Beyond arithmetic, the ALU performs <strong>logic operations</strong> that combine bits according to true/false rules. There are four you must know.</p>
<table>
  <thead><tr><th>Operation</th><th>Rule</th><th>Result is 1 when…</th></tr></thead>
  <tbody>
    <tr><td>AND</td><td>1 AND 1 = 1, else 0</td><td>both bits are 1</td></tr>
    <tr><td>OR</td><td>0 OR 0 = 0, else 1</td><td>at least one bit is 1</td></tr>
    <tr><td>NOT</td><td>flips: 0→1, 1→0</td><td>the input is 0</td></tr>
    <tr><td>XOR</td><td>1 when bits differ</td><td>the two bits are different</td></tr>
  </tbody>
</table>
<p>Logic operations at the <strong>bit level</strong> apply to each pair of bits independently:</p>
<div class="out"><b>1100 AND 1010</b> = 1000<br><b>1100 OR&nbsp; 1010</b> = 1110<br><b>1100 XOR 1010</b> = 0110</div>
<h3>Masking — the practical use</h3>
<p>A <strong>mask</strong> is a chosen bit pattern used with AND/OR to inspect or change specific bits. AND with a mask <em>clears</em> the bits that are 0 in the mask; OR <em>sets</em> the bits that are 1. This is how programs pack many yes/no flags into a single number (e.g. file permissions, hardware settings).</p>
<div class="note-ct">Important distinction the exam asks (CQ5.3): a <strong>logic operation at bit level</strong> works on individual bits (each column separately). A logic operation at <strong>pattern level</strong> treats the whole pattern as one true/false value. Bit-level = per-bit; pattern-level = whole-value.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.3</span>
<h2>Phép toán logic — kỹ năng lõi của ALU</h2>
<p class="lead">Ngoài số học, ALU thực hiện <strong>phép toán logic</strong> kết hợp các bit theo quy tắc đúng/sai. Có bốn phép bạn phải nắm.</p>
<table>
  <thead><tr><th>Phép</th><th>Quy tắc</th><th>Kết quả là 1 khi…</th></tr></thead>
  <tbody>
    <tr><td>AND</td><td>1 AND 1 = 1, còn lại 0</td><td>cả hai bit đều 1</td></tr>
    <tr><td>OR</td><td>0 OR 0 = 0, còn lại 1</td><td>ít nhất một bit là 1</td></tr>
    <tr><td>NOT</td><td>lật: 0→1, 1→0</td><td>đầu vào là 0</td></tr>
    <tr><td>XOR</td><td>1 khi hai bit khác nhau</td><td>hai bit khác nhau</td></tr>
  </tbody>
</table>
<p>Phép logic ở <strong>mức bit</strong> áp dụng cho từng cặp bit một cách độc lập:</p>
<div class="out"><b>1100 AND 1010</b> = 1000<br><b>1100 OR&nbsp; 1010</b> = 1110<br><b>1100 XOR 1010</b> = 0110</div>
<h3>Mặt nạ (masking) — công dụng thực tế</h3>
<p>Một <strong>mặt nạ (mask)</strong> là mẫu bit được chọn, dùng cùng AND/OR để kiểm tra hoặc thay đổi các bit cụ thể. AND với mask <em>xoá</em> các bit là 0 trong mask; OR <em>bật</em> các bit là 1. Đây là cách chương trình gói nhiều cờ có/không vào một con số (ví dụ quyền tệp, cấu hình phần cứng).</p>
<div class="note-ct">Phân biệt quan trọng bài thi hỏi (CQ5.3): phép logic ở <strong>mức bit</strong> làm việc trên từng bit (mỗi cột riêng). Phép logic ở <strong>mức mẫu (pattern level)</strong> coi cả mẫu là một giá trị đúng/sai. Mức bit = từng-bit; mức mẫu = cả-giá-trị.</div>
</div>
`,
        },
        {
          title: '3.4 — Shift & arithmetic operations|||3.4 — Phép dịch & phép số học',
          slug: 'csi104-3-4-phep-dich',
          type: 'VIDEO',
          description: 'Dịch trái/phải và vì sao dịch bit tương đương nhân/chia cho 2.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.4</span>
<h2>Shift operations</h2>
<p class="lead">A <strong>shift</strong> moves all bits left or right by a number of positions. Vacated spots are filled with 0. Shifting is one of the cheapest, fastest things a CPU can do.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Start</div><div class="lz-t">0001 (1)</div><div class="lz-d">the number one</div></div>
  <div class="lz-step"><div class="lz-k">Shift left 1</div><div class="lz-t">0010 (2)</div><div class="lz-d">value doubled</div></div>
  <div class="lz-step"><div class="lz-k">Shift left again</div><div class="lz-t">0100 (4)</div><div class="lz-d">doubled again</div></div>
</div>
<h3>The key insight: shifting = multiply/divide by 2</h3>
<p>Because binary is base 2, shifting <strong>left</strong> by one position multiplies by 2, and shifting <strong>right</strong> divides by 2 (dropping any remainder). Exactly like adding/removing a 0 at the end of a decimal number multiplies/divides by 10.</p>
<div class="out"><b>Left shift:</b> 0011 (3) &lt;&lt; 1 = 0110 (6)<br><b>Right shift:</b> 1000 (8) &gt;&gt; 1 = 0100 (4)</div>
<h3>Arithmetic operations recap</h3>
<p>Chapter 3 together shows the ALU\'s full toolkit: <strong>arithmetic</strong> (add, subtract via two&#39;s complement, and shift-based multiply/divide) and <strong>logic</strong> (AND, OR, NOT, XOR). Every high-level operation you write eventually reduces to these primitive bit operations.</p>
<div class="note-ct">Exam contrast (CQ5.4): an <strong>arithmetic</strong> operation changes the numeric value following math rules (add, multiply). A <strong>shift</strong> just relocates bits — though a shift <em>happens to</em> multiply or divide by a power of two, which is why compilers replace slow multiplications by fast shifts.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.4</span>
<h2>Phép dịch (shift)</h2>
<p class="lead">Một <strong>phép dịch</strong> đẩy toàn bộ bit sang trái hoặc phải một số vị trí. Chỗ trống được lấp bằng 0. Dịch là một trong những việc rẻ nhất, nhanh nhất mà CPU làm được.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Bắt đầu</div><div class="lz-t">0001 (1)</div><div class="lz-d">số một</div></div>
  <div class="lz-step"><div class="lz-k">Dịch trái 1</div><div class="lz-t">0010 (2)</div><div class="lz-d">giá trị gấp đôi</div></div>
  <div class="lz-step"><div class="lz-k">Dịch trái nữa</div><div class="lz-t">0100 (4)</div><div class="lz-d">lại gấp đôi</div></div>
</div>
<h3>Ý tưởng then chốt: dịch = nhân/chia cho 2</h3>
<p>Vì nhị phân là cơ số 2, dịch <strong>trái</strong> một vị trí là nhân 2, và dịch <strong>phải</strong> là chia 2 (bỏ phần dư). Giống hệt việc thêm/bớt một số 0 ở cuối số thập phân là nhân/chia cho 10.</p>
<div class="out"><b>Dịch trái:</b> 0011 (3) &lt;&lt; 1 = 0110 (6)<br><b>Dịch phải:</b> 1000 (8) &gt;&gt; 1 = 0100 (4)</div>
<h3>Tóm tắt phép số học</h3>
<p>Chương 3 gộp lại cho thấy đầy đủ bộ công cụ của ALU: <strong>số học</strong> (cộng, trừ qua bù hai, và nhân/chia dựa trên dịch) và <strong>logic</strong> (AND, OR, NOT, XOR). Mọi phép bậc cao bạn viết rốt cuộc rút về các phép bit nguyên thủy này.</p>
<div class="note-ct">So sánh bài thi (CQ5.4): phép <strong>số học</strong> đổi giá trị số theo quy tắc toán (cộng, nhân). Phép <strong>dịch</strong> chỉ dời bit — dù dịch <em>tình cờ</em> nhân hoặc chia cho lũy thừa của hai, đó là lý do trình biên dịch thay phép nhân chậm bằng phép dịch nhanh.</div>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'csi104-quiz-ch3',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: lưu số/media, phép logic và phép dịch.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'Which method is used to store negative integers?|||Phương pháp nào dùng để lưu số nguyên âm?', options: ['ASCII', 'Two\'s complement|||Bù hai', 'Floating point|||Dấu phẩy động', 'Sampling|||Lấy mẫu'], correctIndex: 1, points: 1 },
              { question: 'Why can 0.1 + 0.2 not equal exactly 0.3 on a computer?|||Vì sao 0.1 + 0.2 không bằng đúng 0.3 trên máy tính?', options: ['The CPU is broken|||CPU bị hỏng', 'Floating point stores many decimals only approximately|||Dấu phẩy động lưu nhiều số thập phân chỉ gần đúng', 'Addition is not supported|||Không hỗ trợ phép cộng', '0.3 is too large|||0.3 quá lớn'], correctIndex: 1, points: 1 },
              { question: 'In the ASCII scheme, the letter A is stored as which number?|||Trong ASCII, chữ A được lưu là số nào?', options: ['1', '65', '97', '256'], correctIndex: 1, points: 1 },
              { question: 'A color pixel is commonly stored as which three values?|||Một pixel màu thường được lưu bằng ba giá trị nào?', options: ['Sign, exponent, mantissa|||Dấu, số mũ, định trị', 'Red, Green, Blue|||Đỏ, Lục, Lam', 'X, Y, Z', 'AND, OR, NOT'], correctIndex: 1, points: 1 },
              { question: '1100 AND 1010 equals:|||1100 AND 1010 bằng:', options: ['1110', '1000', '0110', '1111'], correctIndex: 1, points: 1 },
              { question: 'Shifting the bits of a number left by one position…|||Dịch các bit của một số sang trái một vị trí…', options: ['divides it by 2|||chia nó cho 2', 'multiplies it by 2|||nhân nó với 2', 'reverses the bits|||đảo ngược các bit', 'has no effect|||không có tác dụng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — MẠNG & INTERNET ══════════════════ */
    {
      title: 'Chapter 4 — Computer Networks & the Internet|||Chương 4 — Mạng máy tính & Internet',
      description: 'LAN/WAN, mô hình phân tầng TCP/IP và cách dữ liệu đi khắp Internet.',
      lessons: [
        {
          title: '4.1 — LAN, WAN & network topologies|||4.1 — LAN, WAN & hình trạng mạng',
          slug: 'csi104-4-1-lan-wan',
          type: 'VIDEO',
          description: 'Mạng theo phạm vi và các cách nối máy với nhau.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>What is a network?</h2>
<p class="lead">A <strong>network</strong> is two or more computers connected so they can share data and resources. Networks are classified mainly by their <em>geographic size</em>.</p>
<table>
  <thead><tr><th>Type</th><th>Scope</th><th>Example</th></tr></thead>
  <tbody>
    <tr><td>LAN (Local Area Network)</td><td>One building or campus</td><td>Your home Wi-Fi, a school lab</td></tr>
    <tr><td>MAN (Metropolitan)</td><td>A city</td><td>A city-wide fiber network</td></tr>
    <tr><td>WAN (Wide Area Network)</td><td>Countries / the globe</td><td>The Internet itself</td></tr>
  </tbody>
</table>
<h3>Topologies — the shape of the connections</h3>
<p>A <strong>topology</strong> is how the machines are wired together. Each has trade-offs in cost and reliability:</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Star</div><div class="lz-nsub">All nodes connect to a central switch — most common today; one cable fault isolates just one node</div></div></div>
  <div class="lz-node"><div class="lz-badge">—</div><div class="lz-nbody"><div class="lz-ntitle">Bus</div><div class="lz-nsub">All share one backbone cable — cheap but one break kills all</div></div></div>
  <div class="lz-node"><div class="lz-badge">○</div><div class="lz-nbody"><div class="lz-ntitle">Ring</div><div class="lz-nsub">Each node links to two neighbors in a loop</div></div></div>
  <div class="lz-node"><div class="lz-badge">✳</div><div class="lz-nbody"><div class="lz-ntitle">Mesh</div><div class="lz-nsub">Many redundant links — very reliable but expensive</div></div></div>
</div>
<div class="note-ct">Exam point (CQ6.1): a <strong>LAN</strong> is small, privately owned, and fast/cheap to run; a <strong>WAN</strong> spans large distances, is usually leased from carriers, and is slower per link. The Internet is a WAN made by connecting millions of LANs.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Mạng là gì?</h2>
<p class="lead">Một <strong>mạng</strong> là hai hay nhiều máy tính được nối để chia sẻ dữ liệu và tài nguyên. Mạng chủ yếu được phân loại theo <em>kích thước địa lý</em>.</p>
<table>
  <thead><tr><th>Loại</th><th>Phạm vi</th><th>Ví dụ</th></tr></thead>
  <tbody>
    <tr><td>LAN (mạng cục bộ)</td><td>Một toà nhà hoặc khuôn viên</td><td>Wi-Fi ở nhà, phòng lab của trường</td></tr>
    <tr><td>MAN (đô thị)</td><td>Một thành phố</td><td>Mạng cáp quang toàn thành phố</td></tr>
    <tr><td>WAN (mạng diện rộng)</td><td>Các quốc gia / toàn cầu</td><td>Chính Internet</td></tr>
  </tbody>
</table>
<h3>Hình trạng (topology) — hình dạng của các kết nối</h3>
<p>Một <strong>hình trạng</strong> là cách các máy được nối với nhau. Mỗi kiểu có đánh đổi về chi phí và độ tin cậy:</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Sao (Star)</div><div class="lz-nsub">Mọi nút nối vào một switch trung tâm — phổ biến nhất hiện nay; một cáp đứt chỉ cô lập một nút</div></div></div>
  <div class="lz-node"><div class="lz-badge">—</div><div class="lz-nbody"><div class="lz-ntitle">Bus</div><div class="lz-nsub">Mọi máy dùng chung một cáp xương sống — rẻ nhưng một chỗ đứt là hỏng hết</div></div></div>
  <div class="lz-node"><div class="lz-badge">○</div><div class="lz-nbody"><div class="lz-ntitle">Vòng (Ring)</div><div class="lz-nsub">Mỗi nút nối hai hàng xóm thành một vòng</div></div></div>
  <div class="lz-node"><div class="lz-badge">✳</div><div class="lz-nbody"><div class="lz-ntitle">Lưới (Mesh)</div><div class="lz-nsub">Nhiều liên kết dự phòng — rất tin cậy nhưng tốn kém</div></div></div>
</div>
<div class="note-ct">Điểm thi (CQ6.1): <strong>LAN</strong> nhỏ, sở hữu tư nhân, chạy nhanh/rẻ; <strong>WAN</strong> trải khoảng cách lớn, thường thuê của nhà mạng, và chậm hơn trên mỗi liên kết. Internet là một WAN tạo bằng cách nối hàng triệu LAN.</div>
</div>
`,
        },
        {
          title: '4.2 — TCP/IP & the layered model|||4.2 — TCP/IP & mô hình phân tầng',
          slug: 'csi104-4-2-tcp-ip',
          type: 'VIDEO',
          description: 'Vì sao mạng chia thành các tầng và mỗi tầng làm gì.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Why networking is built in layers</h2>
<p class="lead">Sending data across the world is hugely complex. Engineers tame it with <strong>layering</strong>: split the job into stacked layers, each solving one problem and talking only to the layers directly above and below. This is CLO4.</p>
<p>Think of posting a letter: you write it (content), put it in an envelope with an address (addressing), the post office routes it (delivery), a truck carries it (physical). Each step is independent — you do not care which truck is used.</p>
<h3>The TCP/IP model — 4 layers</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">4 · Application</div><div class="lz-ld">The apps you use: HTTP (web), SMTP (email), DNS. Speaks in messages a program understands.</div></div>
  <div class="lz-layer"><div class="lz-lt">3 · Transport (TCP / UDP)</div><div class="lz-ld">Splits data into segments, ensures reliable, in-order delivery (TCP) or fast best-effort (UDP). Uses port numbers.</div></div>
  <div class="lz-layer"><div class="lz-lt">2 · Internet / Network (IP)</div><div class="lz-ld">Adds IP addresses and routes packets across networks, hop by hop, toward the destination.</div></div>
  <div class="lz-layer"><div class="lz-lt">1 · Network Access / Link</div><div class="lz-ld">The actual wire/Wi-Fi and hardware (MAC) addresses — moves bits between neighboring devices.</div></div>
</div>
<p>As data goes <strong>down</strong> the stack at the sender, each layer wraps it in its own header (<em>encapsulation</em>). At the receiver it travels <strong>up</strong>, each layer peeling its header off.</p>
<div class="note-ct">Exam point (CQ6.2): <strong>TCP</strong> guarantees your data arrives complete and in order (used for web, email); <strong>IP</strong> handles addressing and routing each packet. TCP/IP is a <em>suite</em> — many protocols working as a team, one per layer.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Vì sao mạng được xây theo tầng</h2>
<p class="lead">Gửi dữ liệu đi khắp thế giới là cực kỳ phức tạp. Kỹ sư thuần hoá nó bằng <strong>phân tầng</strong>: chia công việc thành các tầng chồng lên nhau, mỗi tầng giải một vấn đề và chỉ nói chuyện với tầng ngay trên và ngay dưới. Đây là CLO4.</p>
<p>Hãy hình dung gửi một lá thư: bạn viết thư (nội dung), bỏ vào phong bì có địa chỉ (đánh địa chỉ), bưu điện định tuyến (giao), xe tải chở đi (vật lý). Mỗi bước độc lập — bạn không cần quan tâm dùng xe nào.</p>
<h3>Mô hình TCP/IP — 4 tầng</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">4 · Ứng dụng (Application)</div><div class="lz-ld">Các app bạn dùng: HTTP (web), SMTP (email), DNS. Nói bằng thông điệp mà chương trình hiểu.</div></div>
  <div class="lz-layer"><div class="lz-lt">3 · Giao vận (Transport — TCP / UDP)</div><div class="lz-ld">Chia dữ liệu thành segment, đảm bảo giao tin cậy, đúng thứ tự (TCP) hoặc nhanh, cố-gắng-hết-sức (UDP). Dùng số cổng (port).</div></div>
  <div class="lz-layer"><div class="lz-lt">2 · Internet / Mạng (IP)</div><div class="lz-ld">Thêm địa chỉ IP và định tuyến gói qua các mạng, từng chặng một, tới đích.</div></div>
  <div class="lz-layer"><div class="lz-lt">1 · Truy cập mạng / Liên kết</div><div class="lz-ld">Dây/Wi-Fi thực tế và địa chỉ phần cứng (MAC) — chuyển bit giữa các thiết bị kề nhau.</div></div>
</div>
<p>Khi dữ liệu đi <strong>xuống</strong> ngăn xếp ở bên gửi, mỗi tầng bọc nó bằng phần đầu (header) riêng (<em>đóng gói — encapsulation</em>). Ở bên nhận nó đi <strong>lên</strong>, mỗi tầng bóc header của mình ra.</p>
<div class="note-ct">Điểm thi (CQ6.2): <strong>TCP</strong> đảm bảo dữ liệu tới đủ và đúng thứ tự (dùng cho web, email); <strong>IP</strong> lo đánh địa chỉ và định tuyến từng gói. TCP/IP là một <em>bộ giao thức</em> — nhiều giao thức làm việc như một đội, mỗi tầng một giao thức.</div>
</div>
`,
        },
        {
          title: '4.3 — How data travels the Internet|||4.3 — Dữ liệu đi khắp Internet ra sao',
          slug: 'csi104-4-3-du-lieu-di',
          type: 'VIDEO',
          description: 'Gói tin, địa chỉ IP, DNS và hành trình một yêu cầu web.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.3</span>
<h2>The journey of a web request</h2>
<p class="lead">Let us trace what happens when you type an address and press Enter (CQ6.3 — "how to transfer data from one computer to another").</p>
<h3>Packets — data cut into pieces</h3>
<p>Data is not sent as one big blob. It is chopped into small <strong>packets</strong>, each labeled with source and destination IP addresses. Packets travel independently and may take different routes, then are reassembled in order at the destination by TCP.</p>
<h3>Addresses &amp; names</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Name</div><div class="lz-t">cuongthai.com</div><div class="lz-d">easy for humans</div></div>
  <div class="lz-step"><div class="lz-k">DNS lookup</div><div class="lz-t">→ 160.187.1.208</div><div class="lz-d">the phone book of the Internet</div></div>
  <div class="lz-step"><div class="lz-k">Route</div><div class="lz-t">hop → hop → hop</div><div class="lz-d">routers forward the packets</div></div>
  <div class="lz-step"><div class="lz-k">Arrive</div><div class="lz-t">server responds</div><div class="lz-d">page comes back the same way</div></div>
</div>
<p>An <strong>IP address</strong> uniquely identifies a device on the network. <strong>DNS</strong> (Domain Name System) translates human names into IP addresses. <strong>Routers</strong> are the traffic officers that forward each packet one hop closer to its destination.</p>
<div class="callout ok">Every web page load is this dance happening in milliseconds: DNS resolves the name, TCP opens a reliable channel, IP routes the packets, and the application layer (HTTP) carries the actual page. You will build on exactly this in later web and API courses.</div>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">See HTTP requests for real</span><span class="lc-sub">The application layer in action — the "REST &amp; HTTP Basics" module on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.3</span>
<h2>Hành trình một yêu cầu web</h2>
<p class="lead">Hãy lần theo điều xảy ra khi bạn gõ một địa chỉ và nhấn Enter (CQ6.3 — "chuyển dữ liệu từ máy này sang máy khác thế nào").</p>
<h3>Gói tin (packet) — dữ liệu được cắt nhỏ</h3>
<p>Dữ liệu không gửi thành một khối lớn. Nó được cắt thành các <strong>gói tin</strong> nhỏ, mỗi gói gắn nhãn địa chỉ IP nguồn và đích. Các gói đi độc lập và có thể theo tuyến khác nhau, rồi được TCP ghép lại đúng thứ tự ở đích.</p>
<h3>Địa chỉ &amp; tên</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tên</div><div class="lz-t">cuongthai.com</div><div class="lz-d">dễ cho con người</div></div>
  <div class="lz-step"><div class="lz-k">Tra DNS</div><div class="lz-t">→ 160.187.1.208</div><div class="lz-d">cuốn danh bạ của Internet</div></div>
  <div class="lz-step"><div class="lz-k">Định tuyến</div><div class="lz-t">chặng → chặng → chặng</div><div class="lz-d">router chuyển tiếp các gói</div></div>
  <div class="lz-step"><div class="lz-k">Tới nơi</div><div class="lz-t">máy chủ trả lời</div><div class="lz-d">trang trở về theo đường cũ</div></div>
</div>
<p>Một <strong>địa chỉ IP</strong> định danh duy nhất một thiết bị trên mạng. <strong>DNS</strong> (Hệ thống tên miền) dịch tên của con người thành địa chỉ IP. <strong>Router</strong> là cảnh sát giao thông chuyển mỗi gói tiến một chặng gần đích hơn.</p>
<div class="callout ok">Mỗi lần tải trang web là điệu nhảy này diễn ra trong vài phần nghìn giây: DNS phân giải tên, TCP mở kênh tin cậy, IP định tuyến các gói, và tầng ứng dụng (HTTP) mang trang thật. Bạn sẽ xây tiếp trên đúng điều này ở các môn web và API sau.</div>
<a class="link-card codelab" href="/code-lab/rest-apis?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-526" target="_blank" rel="noopener">
  <span class="lc-ico">🌐</span>
  <span class="lc-body"><span class="lc-title">Thấy yêu cầu HTTP thật sự</span><span class="lc-sub">Tầng ứng dụng trong thực tế — module "REST &amp; HTTP Basics" trên CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'csi104-quiz-ch4',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: LAN/WAN, TCP/IP, gói tin và DNS.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'A network covering a single building is a…|||Mạng phủ một toà nhà là…', options: ['WAN', 'LAN', 'The Internet|||Internet', 'MAN'], correctIndex: 1, points: 1 },
              { question: 'Which topology connects every node to a central switch?|||Hình trạng nào nối mọi nút vào một switch trung tâm?', options: ['Bus', 'Ring|||Vòng', 'Star|||Sao', 'Mesh|||Lưới'], correctIndex: 2, points: 1 },
              { question: 'What is the main job of the IP layer?|||Nhiệm vụ chính của tầng IP là gì?', options: ['Play audio|||Phát âm thanh', 'Addressing and routing packets|||Đánh địa chỉ và định tuyến gói', 'Compress images|||Nén ảnh', 'Store files|||Lưu tệp'], correctIndex: 1, points: 1 },
              { question: 'TCP is mainly responsible for…|||TCP chủ yếu chịu trách nhiệm…', options: ['reliable, in-order delivery of data|||giao dữ liệu tin cậy, đúng thứ tự', 'choosing Wi-Fi channels|||chọn kênh Wi-Fi', 'drawing web pages|||vẽ trang web', 'encrypting the disk|||mã hoá ổ đĩa'], correctIndex: 0, points: 1 },
              { question: 'What does DNS do?|||DNS làm gì?', options: ['Encrypts passwords|||Mã hoá mật khẩu', 'Translates domain names into IP addresses|||Dịch tên miền thành địa chỉ IP', 'Speeds up the CPU|||Tăng tốc CPU', 'Compresses video|||Nén video'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — HỆ ĐIỀU HÀNH ══════════════════ */
    {
      title: 'Chapter 5 — Operating Systems|||Chương 5 — Hệ điều hành',
      description: 'Hệ điều hành là gì, tiến hoá ra sao, và bốn "người quản lý" bên trong nó.',
      lessons: [
        {
          title: '5.1 — What an OS is & its evolution|||5.1 — Hệ điều hành là gì & sự tiến hoá',
          slug: 'csi104-5-1-os-la-gi',
          type: 'VIDEO',
          description: 'Vai trò trung gian giữa phần cứng, phần mềm và người dùng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>What is an operating system?</h2>
<p class="lead">An <strong>operating system (OS)</strong> is the master program that manages the whole machine. It sits between the <em>hardware</em> below and your <em>applications</em> above, giving programs a clean way to use the CPU, memory and devices without touching them directly. This is CLO5.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Applications</div><div class="lz-ld">Browser, game, Word — what you actually use</div></div>
  <div class="lz-layer"><div class="lz-lt">Operating System</div><div class="lz-ld">The manager: shares CPU, memory, files, devices fairly &amp; safely</div></div>
  <div class="lz-layer"><div class="lz-lt">Hardware</div><div class="lz-ld">CPU, RAM, disk, keyboard, screen</div></div>
</div>
<p>Without an OS, every program would need to know how to talk to every brand of disk and printer. The OS hides that mess behind a uniform interface, so a game just says "save this file" and the OS handles the hardware details.</p>
<h3>How operating systems evolved</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Batch systems</div><div class="lz-nsub">Run one job at a time from a queue — no interaction</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Time-sharing</div><div class="lz-nsub">Many users share one machine, each getting slices of CPU time</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Personal / real-time</div><div class="lz-nsub">One user, many programs at once (multitasking)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Distributed / mobile / cloud</div><div class="lz-nsub">Many machines cooperating; phones; data centers</div></div></div>
</div>
<div class="note-ct">Windows, macOS, Linux, Android and iOS are all operating systems. They differ in look and philosophy but do the same core job: manage resources and give programs a safe, shared platform.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Hệ điều hành là gì?</h2>
<p class="lead">Một <strong>hệ điều hành (OS)</strong> là chương trình chủ quản lý cả cỗ máy. Nó nằm giữa <em>phần cứng</em> bên dưới và <em>ứng dụng</em> của bạn bên trên, cho chương trình một cách gọn gàng để dùng CPU, bộ nhớ và thiết bị mà không chạm trực tiếp vào chúng. Đây là CLO5.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Ứng dụng</div><div class="lz-ld">Trình duyệt, game, Word — thứ bạn thực sự dùng</div></div>
  <div class="lz-layer"><div class="lz-lt">Hệ điều hành</div><div class="lz-ld">Người quản lý: chia CPU, bộ nhớ, tệp, thiết bị công bằng &amp; an toàn</div></div>
  <div class="lz-layer"><div class="lz-lt">Phần cứng</div><div class="lz-ld">CPU, RAM, đĩa, bàn phím, màn hình</div></div>
</div>
<p>Không có OS, mỗi chương trình phải biết cách nói chuyện với mọi hãng đĩa và máy in. OS giấu mớ hỗn độn đó sau một giao diện thống nhất, nên một game chỉ cần nói "lưu tệp này" và OS lo phần chi tiết phần cứng.</p>
<h3>Hệ điều hành tiến hoá thế nào</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Hệ theo lô (batch)</div><div class="lz-nsub">Chạy từng công việc một từ hàng đợi — không tương tác</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Chia sẻ thời gian</div><div class="lz-nsub">Nhiều người dùng chung một máy, mỗi người được lát thời gian CPU</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Cá nhân / thời gian thực</div><div class="lz-nsub">Một người dùng, nhiều chương trình cùng lúc (đa nhiệm)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Phân tán / di động / đám mây</div><div class="lz-nsub">Nhiều máy hợp tác; điện thoại; trung tâm dữ liệu</div></div></div>
</div>
<div class="note-ct">Windows, macOS, Linux, Android và iOS đều là hệ điều hành. Chúng khác nhau về giao diện và triết lý nhưng làm cùng công việc lõi: quản lý tài nguyên và cho chương trình một nền tảng chung, an toàn.</div>
</div>
`,
        },
        {
          title: '5.2 — The four managers of an OS|||5.2 — Bốn người quản lý của OS',
          slug: 'csi104-5-2-bon-quan-ly',
          type: 'VIDEO',
          description: 'Quản lý tiến trình, bộ nhớ, thiết bị và tệp — cùng giao diện người dùng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.2</span>
<h2>Inside the OS — four managers</h2>
<p class="lead">The OS is not one thing but a team of specialized managers, each responsible for one resource. Forouzan groups them as follows.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">P</div><div class="lz-nbody"><div class="lz-ntitle">Process / CPU manager</div><div class="lz-nsub">Decides which program runs now and for how long (scheduling); switches between them so fast it feels simultaneous</div></div></div>
  <div class="lz-node"><div class="lz-badge">M</div><div class="lz-nbody"><div class="lz-ntitle">Memory manager</div><div class="lz-nsub">Gives each program its own memory space, protects them from each other, uses virtual memory when RAM runs out</div></div></div>
  <div class="lz-node"><div class="lz-badge">D</div><div class="lz-nbody"><div class="lz-ntitle">Device manager</div><div class="lz-nsub">Talks to hardware through drivers; queues requests to disk, printer, network</div></div></div>
  <div class="lz-node"><div class="lz-badge">F</div><div class="lz-nbody"><div class="lz-ntitle">File manager</div><div class="lz-nsub">Organizes data into files &amp; folders, controls who may read/write, tracks free space</div></div></div>
</div>
<p>On top sits the <strong>user interface</strong> — either a command line (type commands) or a graphical desktop (windows, icons, mouse). The UI is how <em>you</em> ask the managers to do things.</p>
<h3>A process vs a program</h3>
<p>A <strong>program</strong> is the file on disk (passive). A <strong>process</strong> is that program actually running in memory (active), with its own state and resources. Opening the same app twice creates two processes from one program.</p>
<div class="callout ok">Multitasking illusion: your laptop feels like it runs 20 apps at once, but a single core runs just one instruction stream at a time. The process manager switches between them thousands of times a second — too fast for you to notice.</div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-483" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Watch processes for real</span><span class="lc-sub">List and manage running processes with the shell — the Linux "Process Management" module.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.2</span>
<h2>Bên trong OS — bốn người quản lý</h2>
<p class="lead">OS không phải một thứ mà là một đội các quản lý chuyên trách, mỗi người phụ trách một tài nguyên. Forouzan nhóm chúng như sau.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">P</div><div class="lz-nbody"><div class="lz-ntitle">Quản lý tiến trình / CPU</div><div class="lz-nsub">Quyết định chương trình nào chạy lúc này và bao lâu (lập lịch); chuyển giữa chúng nhanh đến mức cảm giác như đồng thời</div></div></div>
  <div class="lz-node"><div class="lz-badge">M</div><div class="lz-nbody"><div class="lz-ntitle">Quản lý bộ nhớ</div><div class="lz-nsub">Cho mỗi chương trình không gian nhớ riêng, bảo vệ chúng khỏi nhau, dùng bộ nhớ ảo khi RAM cạn</div></div></div>
  <div class="lz-node"><div class="lz-badge">D</div><div class="lz-nbody"><div class="lz-ntitle">Quản lý thiết bị</div><div class="lz-nsub">Nói chuyện phần cứng qua driver; xếp hàng yêu cầu tới đĩa, máy in, mạng</div></div></div>
  <div class="lz-node"><div class="lz-badge">F</div><div class="lz-nbody"><div class="lz-ntitle">Quản lý tệp</div><div class="lz-nsub">Tổ chức dữ liệu thành tệp &amp; thư mục, kiểm soát ai được đọc/ghi, theo dõi chỗ trống</div></div></div>
</div>
<p>Trên cùng là <strong>giao diện người dùng</strong> — hoặc dòng lệnh (gõ lệnh) hoặc màn hình đồ hoạ (cửa sổ, biểu tượng, chuột). UI là cách <em>bạn</em> nhờ các quản lý làm việc.</p>
<h3>Tiến trình vs chương trình</h3>
<p>Một <strong>chương trình</strong> là tệp trên đĩa (bị động). Một <strong>tiến trình (process)</strong> là chương trình đó đang thực sự chạy trong bộ nhớ (chủ động), có trạng thái và tài nguyên riêng. Mở cùng một app hai lần tạo hai tiến trình từ một chương trình.</p>
<div class="callout ok">Ảo giác đa nhiệm: laptop của bạn có vẻ chạy 20 app cùng lúc, nhưng một nhân chỉ chạy một luồng lệnh tại một thời điểm. Quản lý tiến trình chuyển giữa chúng hàng nghìn lần mỗi giây — nhanh đến mức bạn không nhận ra.</div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-483" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Xem tiến trình thật sự</span><span class="lc-sub">Liệt kê và quản lý tiến trình đang chạy bằng shell — module "Process Management" của Linux.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'csi104-quiz-ch5',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: vai trò OS, các manager, tiến trình vs chương trình.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'Where does the operating system sit?|||Hệ điều hành nằm ở đâu?', options: ['Above the applications|||Trên các ứng dụng', 'Between hardware and applications|||Giữa phần cứng và ứng dụng', 'Inside the CPU only|||Chỉ bên trong CPU', 'On the network|||Trên mạng'], correctIndex: 1, points: 1 },
              { question: 'Which manager decides which program runs on the CPU next?|||Quản lý nào quyết định chương trình nào chạy trên CPU tiếp theo?', options: ['File manager|||Quản lý tệp', 'Device manager|||Quản lý thiết bị', 'Process/CPU manager|||Quản lý tiến trình/CPU', 'Memory manager|||Quản lý bộ nhớ'], correctIndex: 2, points: 1 },
              { question: 'The difference between a program and a process is:|||Khác biệt giữa chương trình và tiến trình là:', options: ['They are the same|||Chúng như nhau', 'A program is a file on disk; a process is it running in memory|||Chương trình là tệp trên đĩa; tiến trình là nó đang chạy trong bộ nhớ', 'A process is smaller|||Tiến trình nhỏ hơn', 'A program uses the network|||Chương trình dùng mạng'], correctIndex: 1, points: 1 },
              { question: 'What does the memory manager do when RAM runs out?|||Quản lý bộ nhớ làm gì khi RAM cạn?', options: ['Deletes files|||Xoá tệp', 'Uses virtual memory (swaps to disk)|||Dùng bộ nhớ ảo (chuyển ra đĩa)', 'Restarts the computer|||Khởi động lại máy', 'Nothing|||Không làm gì'], correctIndex: 1, points: 1 },
              { question: 'Multitasking on a single core works by…|||Đa nhiệm trên một nhân hoạt động nhờ…', options: ['running everything truly at once|||chạy mọi thứ thật sự cùng lúc', 'switching between programs very fast|||chuyển giữa các chương trình rất nhanh', 'using two operating systems|||dùng hai hệ điều hành', 'turning off background apps|||tắt app nền'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — THUẬT TOÁN ══════════════════ */
    {
      title: 'Chapter 6 — Algorithms|||Chương 6 — Thuật toán',
      description: 'Thuật toán là gì, ba cấu trúc cơ bản, cách biểu diễn, và tìm kiếm/sắp xếp.',
      lessons: [
        {
          title: '6.1 — What is an algorithm? Three constructs|||6.1 — Thuật toán là gì? Ba cấu trúc',
          slug: 'csi104-6-1-thuat-toan',
          type: 'VIDEO',
          description: 'Định nghĩa thuật toán và ba khối xây dựng: tuần tự, rẽ nhánh, lặp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>What is an algorithm?</h2>
<p class="lead">An <strong>algorithm</strong> is a finite, ordered set of clear steps that solves a problem or completes a task. It takes an <em>input</em>, does <em>processing</em>, and gives an <em>output</em> — and it must always end. This is CLO6.</p>
<p>A cooking recipe is an algorithm: precise steps, in order, that turn ingredients (input) into a dish (output). Good algorithms are <strong>unambiguous</strong> (each step is clear), <strong>finite</strong> (they stop), and <strong>effective</strong> (each step can actually be done).</p>
<h3>The three basic constructs (CQ9.1)</h3>
<p>Amazingly, any algorithm — however complex — can be built from just three control structures:</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Sequence</div><div class="lz-nsub">Do steps one after another, top to bottom</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Decision (selection)</div><div class="lz-nsub">Choose a path based on a condition — IF/ELSE</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Repetition (loop)</div><div class="lz-nsub">Repeat steps while a condition holds — WHILE/FOR</div></div></div>
</div>
<div class="out"><b>Algorithm: is a number even or odd?</b><br>1. Input n<br>2. IF n mod 2 = 0 → output "even"  <span class="tok-comment">(decision)</span><br>3. ELSE → output "odd"<br>4. Stop</div>
<div class="note-ct">These are exactly the constructs you meet as code in PRF192 (if/switch, for/while). CSI104 teaches the <em>idea</em>; PRF192 teaches the <em>syntax</em>. Same concept, two courses.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Thuật toán là gì?</h2>
<p class="lead">Một <strong>thuật toán</strong> là một tập bước rõ ràng, hữu hạn, có thứ tự, giải một bài toán hoặc hoàn thành một việc. Nó nhận <em>đầu vào</em>, thực hiện <em>xử lý</em>, và cho <em>đầu ra</em> — và luôn phải kết thúc. Đây là CLO6.</p>
<p>Một công thức nấu ăn là một thuật toán: các bước chính xác, có thứ tự, biến nguyên liệu (đầu vào) thành món ăn (đầu ra). Thuật toán tốt phải <strong>rõ ràng</strong> (mỗi bước không mơ hồ), <strong>hữu hạn</strong> (có điểm dừng), và <strong>khả thi</strong> (mỗi bước thực sự làm được).</p>
<h3>Ba cấu trúc cơ bản (CQ9.1)</h3>
<p>Điều kỳ diệu là: mọi thuật toán — dù phức tạp đến đâu — đều có thể xây từ chỉ ba cấu trúc điều khiển:</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tuần tự (sequence)</div><div class="lz-nsub">Làm các bước lần lượt, từ trên xuống</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Rẽ nhánh (decision)</div><div class="lz-nsub">Chọn hướng đi dựa trên điều kiện — IF/ELSE</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Lặp (repetition)</div><div class="lz-nsub">Lặp lại các bước khi điều kiện còn đúng — WHILE/FOR</div></div></div>
</div>
<div class="out"><b>Thuật toán: một số là chẵn hay lẻ?</b><br>1. Nhập n<br>2. NẾU n mod 2 = 0 → xuất "chẵn"  <span class="tok-comment">(rẽ nhánh)</span><br>3. NGƯỢC LẠI → xuất "lẻ"<br>4. Dừng</div>
<div class="note-ct">Đây đúng là những cấu trúc bạn gặp dưới dạng code ở PRF192 (if/switch, for/while). CSI104 dạy <em>ý tưởng</em>; PRF192 dạy <em>cú pháp</em>. Cùng khái niệm, hai môn học.</div>
</div>
`,
        },
        {
          title: '6.2 — Representing algorithms: flowchart, pseudocode, UML|||6.2 — Biểu diễn thuật toán: lưu đồ, mã giả, UML',
          slug: 'csi104-6-2-bieu-dien',
          type: 'VIDEO',
          description: 'Ba cách viết ra một thuật toán trước khi code.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.2</span>
<h2>How to write an algorithm down</h2>
<p class="lead">Before coding, engineers describe an algorithm in a language-independent way. Three tools are standard, and the exam asks about all three (CQ9.2–9.5).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Flowchart</div><div class="lz-ld">A diagram of boxes &amp; arrows: ovals = start/end, rectangles = actions, diamonds = decisions. Great for seeing the flow visually.</div></div>
  <div class="lz-layer"><div class="lz-lt">Pseudocode</div><div class="lz-ld">Structured English that reads like code but ignores exact syntax. Fast to write, easy to turn into any language.</div></div>
  <div class="lz-layer"><div class="lz-lt">UML activity diagram</div><div class="lz-ld">A standardized diagram (Unified Modeling Language) for modeling workflows and system behavior — used widely in software engineering.</div></div>
</div>
<h3>Pseudocode example — find the largest of three numbers</h3>
<div class="out">INPUT a, b, c<br>SET max = a<br>IF b &gt; max THEN max = b<br>IF c &gt; max THEN max = c<br>OUTPUT max</div>
<p>Notice pseudocode uses the three constructs from 6.1 (sequence + decision) but no semicolons or type declarations — you can hand it to a C, Java or Python programmer and they can all implement it.</p>
<div class="note-ct">Exam essence: a <strong>UML diagram</strong> is a standardized visual model of an algorithm/process; <strong>pseudocode</strong> is a text description of the same logic. Both sit between the idea in your head and the final code — they let you think and check the logic before typing a single line.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.2</span>
<h2>Cách viết một thuật toán ra giấy</h2>
<p class="lead">Trước khi code, kỹ sư mô tả thuật toán theo cách độc lập ngôn ngữ. Có ba công cụ chuẩn, và bài thi hỏi cả ba (CQ9.2–9.5).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Lưu đồ (flowchart)</div><div class="lz-ld">Sơ đồ hộp &amp; mũi tên: hình bầu dục = bắt đầu/kết thúc, hình chữ nhật = hành động, hình thoi = rẽ nhánh. Rất tốt để nhìn luồng một cách trực quan.</div></div>
  <div class="lz-layer"><div class="lz-lt">Mã giả (pseudocode)</div><div class="lz-ld">Tiếng Anh/Việt có cấu trúc, đọc như code nhưng bỏ qua cú pháp chính xác. Viết nhanh, dễ chuyển sang bất kỳ ngôn ngữ nào.</div></div>
  <div class="lz-layer"><div class="lz-lt">Sơ đồ hoạt động UML</div><div class="lz-ld">Một sơ đồ chuẩn hoá (Unified Modeling Language) để mô hình quy trình và hành vi hệ thống — dùng rộng rãi trong công nghệ phần mềm.</div></div>
</div>
<h3>Ví dụ mã giả — tìm số lớn nhất trong ba số</h3>
<div class="out">NHẬP a, b, c<br>ĐẶT max = a<br>NẾU b &gt; max THÌ max = b<br>NẾU c &gt; max THÌ max = c<br>XUẤT max</div>
<p>Để ý mã giả dùng ba cấu trúc từ bài 6.1 (tuần tự + rẽ nhánh) nhưng không có dấu chấm phẩy hay khai báo kiểu — bạn có thể đưa nó cho lập trình viên C, Java hay Python và ai cũng cài đặt được.</p>
<div class="note-ct">Cốt lõi bài thi: <strong>sơ đồ UML</strong> là mô hình trực quan chuẩn hoá của một thuật toán/quy trình; <strong>mã giả</strong> là mô tả bằng chữ của cùng logic đó. Cả hai nằm giữa ý tưởng trong đầu và code cuối cùng — chúng cho bạn suy nghĩ và kiểm tra logic trước khi gõ một dòng nào.</div>
</div>
`,
        },
        {
          title: '6.3 — Search algorithms: linear & binary|||6.3 — Thuật toán tìm kiếm: tuyến tính & nhị phân',
          slug: 'csi104-6-3-tim-kiem',
          type: 'VIDEO',
          description: 'Hai cách tìm một phần tử và vì sao nhị phân nhanh vượt trội.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.3</span>
<h2>Finding a value in a list</h2>
<p class="lead">Searching is the classic first algorithm to compare, because two approaches have wildly different speed — and it teaches you why <em>how</em> you solve a problem matters as much as <em>whether</em> you solve it.</p>
<h3>Linear search — check one by one</h3>
<p>Start at the first item and walk through until you find the target or reach the end. Works on <strong>any</strong> list, sorted or not. But for a list of a million items, it may take a million checks.</p>
<h3>Binary search — halve the problem each step</h3>
<p>Only works on a <strong>sorted</strong> list. Look at the middle item: if the target is smaller, throw away the whole upper half; if larger, throw away the lower half. Repeat. Each step eliminates half the remaining data.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Look</div><div class="lz-t">middle item</div><div class="lz-d">compare with target</div></div>
  <div class="lz-step"><div class="lz-k">Discard</div><div class="lz-t">half the list</div><div class="lz-d">too big? drop upper half</div></div>
  <div class="lz-step"><div class="lz-k">Repeat</div><div class="lz-t">on what remains</div><div class="lz-d">until found</div></div>
</div>
<div class="callout ok">The power of halving: searching 1,000,000 sorted items takes at most ~20 steps with binary search, versus up to 1,000,000 with linear. That is the difference between instant and slow — and why sorting data first is often worth it.</div>
<div class="pitfall">Binary search has one strict requirement: the data must already be <strong>sorted</strong>. On an unsorted list it gives wrong answers. This is a recurring theme — many fast algorithms trade a setup cost (sorting) for huge speed later.</div>
<a class="link-card codelab" href="/algorithms?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Watch search &amp; sort animate</span><span class="lc-sub">Step through linear vs binary search visually on the Algorithm Visualizer.</span></span>
  <span class="lc-cta">VISUALIZE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.3</span>
<h2>Tìm một giá trị trong danh sách</h2>
<p class="lead">Tìm kiếm là thuật toán đầu tiên kinh điển để so sánh, vì hai cách tiếp cận có tốc độ chênh lệch khủng khiếp — và nó dạy bạn vì sao <em>cách</em> giải một bài toán quan trọng ngang với việc <em>có</em> giải được hay không.</p>
<h3>Tìm tuyến tính — kiểm từng cái một</h3>
<p>Bắt đầu từ phần tử đầu và đi lần lượt tới khi tìm thấy đích hoặc hết danh sách. Chạy được trên <strong>mọi</strong> danh sách, có sắp xếp hay không. Nhưng với danh sách một triệu phần tử, có thể mất một triệu lần kiểm.</p>
<h3>Tìm nhị phân — cắt đôi bài toán mỗi bước</h3>
<p>Chỉ chạy trên danh sách <strong>đã sắp xếp</strong>. Nhìn phần tử giữa: nếu đích nhỏ hơn, bỏ cả nửa trên; nếu lớn hơn, bỏ nửa dưới. Lặp lại. Mỗi bước loại đi một nửa dữ liệu còn lại.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nhìn</div><div class="lz-t">phần tử giữa</div><div class="lz-d">so với đích</div></div>
  <div class="lz-step"><div class="lz-k">Loại</div><div class="lz-t">một nửa danh sách</div><div class="lz-d">quá lớn? bỏ nửa trên</div></div>
  <div class="lz-step"><div class="lz-k">Lặp</div><div class="lz-t">trên phần còn lại</div><div class="lz-d">tới khi tìm thấy</div></div>
</div>
<div class="callout ok">Sức mạnh của việc cắt đôi: tìm trong 1.000.000 phần tử đã sắp xếp chỉ mất tối đa ~20 bước với tìm nhị phân, so với tối đa 1.000.000 với tuyến tính. Đó là khác biệt giữa tức thì và chậm — và là lý do sắp xếp dữ liệu trước thường đáng công.</div>
<div class="pitfall">Tìm nhị phân có một yêu cầu nghiêm ngặt: dữ liệu phải <strong>đã sắp xếp</strong>. Trên danh sách chưa sắp xếp nó cho kết quả sai. Đây là chủ đề lặp lại — nhiều thuật toán nhanh đánh đổi một chi phí chuẩn bị (sắp xếp) để lấy tốc độ lớn về sau.</div>
<a class="link-card codelab" href="/algorithms?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science" target="_blank" rel="noopener">
  <span class="lc-ico">🧭</span>
  <span class="lc-body"><span class="lc-title">Xem tìm kiếm &amp; sắp xếp chạy động</span><span class="lc-sub">Đi từng bước tìm tuyến tính vs nhị phân một cách trực quan trên Algorithm Visualizer.</span></span>
  <span class="lc-cta">TRỰC QUAN →</span>
</a>
</div>
`,
        },
        {
          title: '6.4 — Sorting basics|||6.4 — Sắp xếp cơ bản',
          slug: 'csi104-6-4-sap-xep',
          type: 'VIDEO',
          description: 'Sắp xếp nổi bọt & chọn — ý tưởng và vì sao ta cần thuật toán tốt hơn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.4</span>
<h2>Putting things in order</h2>
<p class="lead"><strong>Sorting</strong> arranges data in order (e.g. ascending). It matters because sorted data unlocks fast operations like binary search. Two beginner-friendly methods show the core idea.</p>
<h3>Selection sort</h3>
<p>Repeatedly find the smallest remaining item and place it next. Like picking cards: scan the whole hand, take the smallest, put it at the front, repeat with the rest.</p>
<h3>Bubble sort</h3>
<p>Walk the list comparing neighbors; if two are out of order, swap them. Big values "bubble" to the end over repeated passes.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Compare</div><div class="lz-t">two neighbors</div><div class="lz-d">left &gt; right?</div></div>
  <div class="lz-step"><div class="lz-k">Swap</div><div class="lz-t">if out of order</div><div class="lz-d">put the bigger on the right</div></div>
  <div class="lz-step"><div class="lz-k">Repeat</div><div class="lz-t">many passes</div><div class="lz-d">until no swaps needed</div></div>
</div>
<div class="note-ct">These simple sorts are easy to understand but slow on big lists (they do roughly n² comparisons). Real software uses smarter sorts (merge sort, quicksort) that CSD201 will teach. Advanced lesson N2 in this course previews <em>why</em> n² vs n·log n matters — the idea of Big-O.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-504" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Code search &amp; sort yourself</span><span class="lc-sub">The "Searching, Sorting &amp; Recursion" module turns these ideas into running code.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.4</span>
<h2>Xếp mọi thứ theo thứ tự</h2>
<p class="lead"><strong>Sắp xếp</strong> đưa dữ liệu về thứ tự (ví dụ tăng dần). Nó quan trọng vì dữ liệu đã sắp xếp mở khoá các thao tác nhanh như tìm nhị phân. Hai phương pháp dễ cho người mới cho thấy ý tưởng cốt lõi.</p>
<h3>Sắp xếp chọn (selection sort)</h3>
<p>Lặp đi lặp lại việc tìm phần tử nhỏ nhất còn lại và đặt nó vào vị trí tiếp theo. Như chọn bài: quét cả nắm bài, lấy lá nhỏ nhất, đặt lên đầu, lặp với phần còn lại.</p>
<h3>Sắp xếp nổi bọt (bubble sort)</h3>
<p>Đi dọc danh sách so sánh hai hàng xóm; nếu sai thứ tự thì đổi chỗ. Giá trị lớn "nổi bọt" dần về cuối qua nhiều lượt.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">So sánh</div><div class="lz-t">hai hàng xóm</div><div class="lz-d">trái &gt; phải?</div></div>
  <div class="lz-step"><div class="lz-k">Đổi chỗ</div><div class="lz-t">nếu sai thứ tự</div><div class="lz-d">đặt số lớn hơn về bên phải</div></div>
  <div class="lz-step"><div class="lz-k">Lặp</div><div class="lz-t">nhiều lượt</div><div class="lz-d">tới khi không cần đổi nữa</div></div>
</div>
<div class="note-ct">Các thuật toán sắp xếp đơn giản này dễ hiểu nhưng chậm trên danh sách lớn (chúng làm khoảng n² lần so sánh). Phần mềm thật dùng thuật toán khôn hơn (merge sort, quicksort) mà CSD201 sẽ dạy. Bài nâng cao N2 trong môn này xem trước <em>vì sao</em> n² vs n·log n quan trọng — ý tưởng Big-O.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-504" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Tự code tìm kiếm &amp; sắp xếp</span><span class="lc-sub">Module "Searching, Sorting &amp; Recursion" biến các ý tưởng này thành code chạy được.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'csi104-quiz-ch6',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: ba cấu trúc, biểu diễn, tìm kiếm, sắp xếp.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'Which is NOT one of the three basic algorithm constructs?|||Cái nào KHÔNG phải một trong ba cấu trúc thuật toán cơ bản?', options: ['Sequence|||Tuần tự', 'Decision|||Rẽ nhánh', 'Repetition|||Lặp', 'Compilation|||Biên dịch'], correctIndex: 3, points: 1 },
              { question: 'An algorithm must always be…|||Một thuật toán luôn phải…', options: ['written in C|||viết bằng C', 'finite (it ends)|||hữu hạn (có kết thúc)', 'longer than 10 steps|||dài hơn 10 bước', 'a loop|||là một vòng lặp'], correctIndex: 1, points: 1 },
              { question: 'Pseudocode is best described as…|||Mã giả được mô tả đúng nhất là…', options: ['machine code|||mã máy', 'structured, language-independent description of logic|||mô tả logic có cấu trúc, độc lập ngôn ngữ', 'a compiled program|||một chương trình đã biên dịch', 'a type of hardware|||một loại phần cứng'], correctIndex: 1, points: 1 },
              { question: 'Binary search requires the list to be…|||Tìm nhị phân yêu cầu danh sách phải…', options: ['very large|||rất lớn', 'sorted|||đã sắp xếp', 'made of numbers only|||chỉ gồm số', 'stored on disk|||lưu trên đĩa'], correctIndex: 1, points: 1 },
              { question: 'Roughly how many steps does binary search need for 1,000,000 sorted items?|||Tìm nhị phân cần khoảng bao nhiêu bước cho 1.000.000 phần tử đã sắp xếp?', options: ['About 1,000,000|||Khoảng 1.000.000', 'About 1,000|||Khoảng 1.000', 'About 20|||Khoảng 20', 'About 500,000|||Khoảng 500.000'], correctIndex: 2, points: 1 },
              { question: 'Why do real programs avoid bubble/selection sort for big data?|||Vì sao chương trình thật tránh bubble/selection sort với dữ liệu lớn?', options: ['They give wrong answers|||Chúng cho kết quả sai', 'They are slow (about n² comparisons)|||Chúng chậm (khoảng n² lần so sánh)', 'They need the Internet|||Chúng cần Internet', 'They only work on text|||Chúng chỉ chạy với chữ'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 1 ══════════════════ */
    {
      title: 'Progress Test 1 (review CLO1–6)|||Progress Test 1 (ôn CLO1–6)',
      description: 'Bài ôn tổng hợp giữa kỳ: tổ chức máy tính, hệ đếm, dữ liệu, mạng, hệ điều hành, thuật toán.',
      lessons: [
        {
          title: 'Progress Test 1 — mixed review|||Progress Test 1 — ôn tổng hợp',
          slug: 'csi104-progress-test-1',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 1–6, giống dạng progress test trên lớp.',
          quiz: {
            timeLimitSeconds: 600,
            questions: [
              { question: 'The stored-program concept means…|||Khái niệm chương-trình-lưu-trong-bộ-nhớ nghĩa là…', options: ['programs are printed on paper|||chương trình được in ra giấy', 'the program is kept in memory as bit patterns|||chương trình được giữ trong bộ nhớ dưới dạng mẫu bit', 'programs cannot be changed|||chương trình không thể thay đổi', 'each program needs its own CPU|||mỗi chương trình cần một CPU riêng'], correctIndex: 1, points: 1 },
              { question: 'Binary 1101 in decimal is:|||Nhị phân 1101 trong thập phân là:', options: ['11', '12', '13', '14'], correctIndex: 2, points: 1 },
              { question: 'The letter "A" is stored using which encoding value in ASCII?|||Chữ "A" được lưu bằng giá trị mã hoá nào trong ASCII?', options: ['65', '97', '48', '256'], correctIndex: 0, points: 1 },
              { question: 'Which layer of TCP/IP handles addressing and routing?|||Tầng nào của TCP/IP lo đánh địa chỉ và định tuyến?', options: ['Application|||Ứng dụng', 'Transport|||Giao vận', 'Internet (IP)', 'Link|||Liên kết'], correctIndex: 2, points: 1 },
              { question: 'The OS component that shares CPU time among programs is the…|||Thành phần OS chia thời gian CPU giữa các chương trình là…', options: ['file manager|||quản lý tệp', 'process manager|||quản lý tiến trình', 'device manager|||quản lý thiết bị', 'user interface|||giao diện người dùng'], correctIndex: 1, points: 1 },
              { question: 'Which is a valid representation of an algorithm?|||Cái nào là một cách biểu diễn thuật toán hợp lệ?', options: ['A flowchart|||Một lưu đồ', 'A JPEG image|||Một ảnh JPEG', 'A hard disk|||Một ổ cứng', 'An IP address|||Một địa chỉ IP'], correctIndex: 0, points: 1 },
              { question: 'Cache memory exists mainly to…|||Bộ nhớ cache tồn tại chủ yếu để…', options: ['store files permanently|||lưu tệp vĩnh viễn', 'bridge the speed gap between CPU and RAM|||bắc cầu chênh lệch tốc độ giữa CPU và RAM', 'connect to the Internet|||kết nối Internet', 'replace the hard disk|||thay ổ cứng'], correctIndex: 1, points: 1 },
              { question: 'Shifting binary 0011 left by one position gives:|||Dịch nhị phân 0011 sang trái một vị trí cho:', options: ['0001 (1)', '0110 (6)', '0011 (3)', '1100 (12)'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — NGÔN NGỮ LẬP TRÌNH ══════════════════ */
    {
      title: 'Chapter 7 — Programming Languages|||Chương 7 — Ngôn ngữ lập trình',
      description: 'Máy hiểu gì, dịch chương trình (biên dịch vs thông dịch) và các paradigm lập trình.',
      lessons: [
        {
          title: '7.1 — Translation: from high-level to machine code|||7.1 — Dịch: từ ngôn ngữ bậc cao sang mã máy',
          slug: 'csi104-7-1-dich-chuong-trinh',
          type: 'VIDEO',
          description: 'Ba mức ngôn ngữ và khác biệt giữa biên dịch và thông dịch.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>Three levels of language</h2>
<p class="lead">A CPU understands only machine code (0s and 1s). Humans think in words. Programming languages bridge this gap — and they come in three levels of "closeness to the machine" (CLO7, CQ11.1).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">High-level language (C, Java, Python)</div><div class="lz-ld">Close to human thinking: readable, portable, one line does a lot. What you actually write.</div></div>
  <div class="lz-layer"><div class="lz-lt">Assembly language</div><div class="lz-ld">Human-readable names for raw CPU instructions (MOV, ADD). One line = one machine instruction.</div></div>
  <div class="lz-layer"><div class="lz-lt">Machine language</div><div class="lz-ld">Pure binary the CPU runs directly. Fast for the machine, unreadable for humans.</div></div>
</div>
<h3>Compilation vs interpretation (CQ11.2)</h3>
<p>Since the CPU cannot run high-level code directly, it must be translated. There are two strategies:</p>
<table>
  <thead><tr><th></th><th>Compiler</th><th>Interpreter</th></tr></thead>
  <tbody>
    <tr><td>When</td><td>Translates the whole program once, ahead of time</td><td>Translates &amp; runs line by line, at run time</td></tr>
    <tr><td>Output</td><td>A standalone executable file</td><td>No separate file — runs directly</td></tr>
    <tr><td>Speed</td><td>Runs fast after compiling</td><td>Slower, but flexible</td></tr>
    <tr><td>Example</td><td>C, C++</td><td>Python, JavaScript</td></tr>
  </tbody>
</table>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Write</div><div class="lz-t">source code</div><div class="lz-d">high-level, readable</div></div>
  <div class="lz-step"><div class="lz-k">Translate</div><div class="lz-t">compiler/interpreter</div><div class="lz-d">to machine code</div></div>
  <div class="lz-step"><div class="lz-k">Run</div><div class="lz-t">CPU executes</div><div class="lz-d">the actual work happens</div></div>
</div>
<div class="note-ct">This is exactly what PRF192 lesson 1.1 showed from the coding side. Some languages (Java) do both: compile to an intermediate "bytecode", then interpret/JIT it on a virtual machine — getting portability plus decent speed.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-254" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Try an interpreted language</span><span class="lc-sub">Python runs line by line — feel interpretation firsthand in the "Python Basics" module.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Ba mức ngôn ngữ</h2>
<p class="lead">CPU chỉ hiểu mã máy (số 0 và 1). Con người suy nghĩ bằng lời. Ngôn ngữ lập trình bắc cầu khoảng cách này — và có ba mức "gần với máy" khác nhau (CLO7, CQ11.1).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Ngôn ngữ bậc cao (C, Java, Python)</div><div class="lz-ld">Gần cách nghĩ của người: dễ đọc, dễ mang đi, một dòng làm được nhiều. Thứ bạn thực sự viết.</div></div>
  <div class="lz-layer"><div class="lz-lt">Hợp ngữ (assembly)</div><div class="lz-ld">Tên dễ đọc cho lệnh CPU thô (MOV, ADD). Một dòng = một lệnh máy.</div></div>
  <div class="lz-layer"><div class="lz-lt">Ngôn ngữ máy (machine)</div><div class="lz-ld">Nhị phân thuần mà CPU chạy trực tiếp. Nhanh với máy, không đọc nổi với người.</div></div>
</div>
<h3>Biên dịch vs thông dịch (CQ11.2)</h3>
<p>Vì CPU không chạy trực tiếp code bậc cao, nó phải được dịch. Có hai chiến lược:</p>
<table>
  <thead><tr><th></th><th>Trình biên dịch (compiler)</th><th>Trình thông dịch (interpreter)</th></tr></thead>
  <tbody>
    <tr><td>Khi nào</td><td>Dịch cả chương trình một lần, trước khi chạy</td><td>Dịch &amp; chạy từng dòng, lúc chạy</td></tr>
    <tr><td>Kết quả</td><td>Một tệp thực thi độc lập</td><td>Không có tệp riêng — chạy trực tiếp</td></tr>
    <tr><td>Tốc độ</td><td>Chạy nhanh sau khi biên dịch</td><td>Chậm hơn, nhưng linh hoạt</td></tr>
    <tr><td>Ví dụ</td><td>C, C++</td><td>Python, JavaScript</td></tr>
  </tbody>
</table>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Viết</div><div class="lz-t">mã nguồn</div><div class="lz-d">bậc cao, dễ đọc</div></div>
  <div class="lz-step"><div class="lz-k">Dịch</div><div class="lz-t">compiler/interpreter</div><div class="lz-d">sang mã máy</div></div>
  <div class="lz-step"><div class="lz-k">Chạy</div><div class="lz-t">CPU thực thi</div><div class="lz-d">công việc thật diễn ra</div></div>
</div>
<div class="note-ct">Đây đúng là điều PRF192 bài 1.1 cho thấy từ phía lập trình. Vài ngôn ngữ (Java) làm cả hai: biên dịch ra "bytecode" trung gian, rồi thông dịch/JIT trên một máy ảo — vừa mang đi được vừa đủ nhanh.</div>
<a class="link-card codelab" href="/code-lab/python?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-254" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Thử một ngôn ngữ thông dịch</span><span class="lc-sub">Python chạy từng dòng — cảm nhận thông dịch trực tiếp ở module "Python Basics".</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '7.2 — Programming paradigms|||7.2 — Các paradigm lập trình',
          slug: 'csi104-7-2-paradigm',
          type: 'VIDEO',
          description: 'Bốn cách nghĩ về lập trình: thủ tục, hướng đối tượng, hàm, logic.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.2</span>
<h2>Four ways to think about programming</h2>
<p class="lead">A <strong>paradigm</strong> is a style of organizing a program — a philosophy of how to structure your solution. The four classic paradigms (CQ11.3) each shine for different problems.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Procedural</div><div class="lz-nsub">A sequence of steps grouped into procedures/functions. C is procedural — this is PRF192.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Object-Oriented (OOP)</div><div class="lz-nsub">Model the world as objects that bundle data + behavior. Java, C# — this is PRO192.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Functional</div><div class="lz-nsub">Build programs from pure functions, avoid changing state. Haskell, and features in JS/Python.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Logic</div><div class="lz-nsub">Declare facts &amp; rules, let the system infer answers. Prolog, and query languages.</div></div></div>
</div>
<h3>Procedural vs object-oriented (CQ11.4)</h3>
<p>The exam contrasts these two directly. <strong>Procedural</strong> thinks in <em>verbs</em>: "do this, then this" — functions operate on separate data. <strong>OOP</strong> thinks in <em>nouns</em>: a "Student" object carries both its data (name, grades) and its actions (calculateGPA). OOP shines for large programs because it groups related data and behavior together, making code easier to reuse and maintain.</p>
<div class="note-ct">Most modern languages are <strong>multi-paradigm</strong> — Python and JavaScript let you write procedural, object-oriented and functional code in the same file. Knowing the paradigms helps you pick the right style for each part of a problem. Your journey: PRF192 (procedural) → PRO192 (OOP) → later, functional ideas everywhere.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.2</span>
<h2>Bốn cách nghĩ về lập trình</h2>
<p class="lead">Một <strong>paradigm</strong> là một phong cách tổ chức chương trình — một triết lý về cách cấu trúc lời giải. Bốn paradigm kinh điển (CQ11.3), mỗi cái toả sáng ở những bài toán khác nhau.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Thủ tục (procedural)</div><div class="lz-nsub">Một chuỗi bước gom thành thủ tục/hàm. C là thủ tục — đây là PRF192.</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Hướng đối tượng (OOP)</div><div class="lz-nsub">Mô hình thế giới thành các đối tượng gói dữ liệu + hành vi. Java, C# — đây là PRO192.</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Hàm (functional)</div><div class="lz-nsub">Xây chương trình từ các hàm thuần, tránh thay đổi trạng thái. Haskell, và tính năng trong JS/Python.</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Logic</div><div class="lz-nsub">Khai báo sự kiện &amp; luật, để hệ thống suy ra đáp án. Prolog, và các ngôn ngữ truy vấn.</div></div></div>
</div>
<h3>Thủ tục vs hướng đối tượng (CQ11.4)</h3>
<p>Bài thi so sánh hai cái này trực tiếp. <strong>Thủ tục</strong> nghĩ theo <em>động từ</em>: "làm cái này, rồi cái này" — hàm thao tác trên dữ liệu tách rời. <strong>OOP</strong> nghĩ theo <em>danh từ</em>: một đối tượng "Student" mang cả dữ liệu (tên, điểm) lẫn hành động (calculateGPA). OOP toả sáng với chương trình lớn vì nó gom dữ liệu và hành vi liên quan lại với nhau, giúp code dễ tái dùng và bảo trì.</p>
<div class="note-ct">Hầu hết ngôn ngữ hiện đại là <strong>đa paradigm</strong> — Python và JavaScript cho bạn viết thủ tục, hướng đối tượng và hàm trong cùng một tệp. Biết các paradigm giúp bạn chọn phong cách đúng cho từng phần bài toán. Hành trình của bạn: PRF192 (thủ tục) → PRO192 (OOP) → sau này, ý tưởng hàm ở khắp nơi.</div>
</div>
`,
        },
        {
          title: 'Chapter 7 Quiz|||Quiz chương 7',
          slug: 'csi104-quiz-ch7',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: mức ngôn ngữ, biên dịch/thông dịch, paradigm.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'Which language does the CPU run directly?|||Ngôn ngữ nào CPU chạy trực tiếp?', options: ['High-level language|||Ngôn ngữ bậc cao', 'Assembly language|||Hợp ngữ', 'Machine language|||Ngôn ngữ máy', 'Pseudocode|||Mã giả'], correctIndex: 2, points: 1 },
              { question: 'A compiler differs from an interpreter because it…|||Trình biên dịch khác trình thông dịch ở chỗ nó…', options: ['runs the program line by line|||chạy chương trình từng dòng', 'translates the whole program once, ahead of time|||dịch cả chương trình một lần, trước khi chạy', 'needs the Internet|||cần Internet', 'only works with Python|||chỉ chạy với Python'], correctIndex: 1, points: 1 },
              { question: 'C belongs mainly to which paradigm?|||C chủ yếu thuộc paradigm nào?', options: ['Object-oriented|||Hướng đối tượng', 'Functional|||Hàm', 'Procedural|||Thủ tục', 'Logic'], correctIndex: 2, points: 1 },
              { question: 'The object-oriented paradigm organizes a program around…|||Paradigm hướng đối tượng tổ chức chương trình quanh…', options: ['objects that bundle data and behavior|||các đối tượng gói dữ liệu và hành vi', 'a single long list of steps|||một danh sách bước dài duy nhất', 'network packets|||các gói tin mạng', 'bit patterns|||các mẫu bit'], correctIndex: 0, points: 1 },
              { question: 'Which is typically an interpreted language?|||Ngôn ngữ nào thường là thông dịch?', options: ['C', 'C++', 'Python', 'Assembly|||Hợp ngữ'], correctIndex: 2, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 8 — CÔNG NGHỆ PHẦN MỀM ══════════════════ */
    {
      title: 'Chapter 8 — Software Engineering|||Chương 8 — Công nghệ phần mềm',
      description: 'Vòng đời phần mềm và các giai đoạn phân tích, thiết kế, cài đặt, kiểm thử.',
      lessons: [
        {
          title: '8.1 — The software lifecycle (SDLC)|||8.1 — Vòng đời phần mềm (SDLC)',
          slug: 'csi104-8-1-vong-doi',
          type: 'VIDEO',
          description: 'Vì sao xây phần mềm cần một quy trình có kỷ luật.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Building software is a process, not just coding</h2>
<p class="lead">Real software is too big to just "start typing". <strong>Software engineering</strong> applies an organized process — the <strong>Software Development Life Cycle (SDLC)</strong> — so teams build the right thing, correctly, on time (CLO8, CQ12.1).</p>
<div class="lz-map">
  <div class="lz-stage">The classic phases</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Analysis</div><div class="lz-nsub">What must the software do? Gather &amp; write requirements</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Design</div><div class="lz-nsub">How will it be built? Plan the structure &amp; modules</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Implementation</div><div class="lz-nsub">Write the actual code</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Testing</div><div class="lz-nsub">Verify it works and fix defects</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Maintenance</div><div class="lz-nsub">Fix, improve &amp; adapt after release</div></div></div>
</div>
<h3>Two families of process (CQ12.2)</h3>
<table>
  <thead><tr><th>Waterfall</th><th>Agile / iterative</th></tr></thead>
  <tbody>
    <tr><td>Do each phase fully, in order, once</td><td>Repeat short cycles, delivering working pieces</td></tr>
    <tr><td>Simple, but rigid — late changes are costly</td><td>Flexible — welcomes changing requirements</td></tr>
    <tr><td>Good when requirements are fixed</td><td>Dominant in modern industry (Scrum)</td></tr>
  </tbody>
</table>
<div class="note-ct">Notice the parallel to algorithms: analysis = understand the problem, design = plan the solution, implementation = write it, testing = check it. It is the same problem-solving mindset scaled up to whole teams and products.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Xây phần mềm là một quy trình, không chỉ là code</h2>
<p class="lead">Phần mềm thật quá lớn để cứ "gõ đại". <strong>Công nghệ phần mềm</strong> áp dụng một quy trình có tổ chức — <strong>Vòng đời phát triển phần mềm (SDLC)</strong> — để đội ngũ xây đúng thứ, xây đúng cách, đúng hạn (CLO8, CQ12.1).</p>
<div class="lz-map">
  <div class="lz-stage">Các giai đoạn kinh điển</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Phân tích</div><div class="lz-nsub">Phần mềm phải làm gì? Thu thập &amp; viết yêu cầu</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Thiết kế</div><div class="lz-nsub">Sẽ xây thế nào? Lập kế hoạch cấu trúc &amp; module</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Cài đặt</div><div class="lz-nsub">Viết code thực tế</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Kiểm thử</div><div class="lz-nsub">Xác minh nó chạy đúng và sửa lỗi</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Bảo trì</div><div class="lz-nsub">Sửa, cải tiến &amp; thích nghi sau khi phát hành</div></div></div>
</div>
<h3>Hai họ quy trình (CQ12.2)</h3>
<table>
  <thead><tr><th>Thác nước (Waterfall)</th><th>Agile / lặp</th></tr></thead>
  <tbody>
    <tr><td>Làm từng giai đoạn trọn vẹn, theo thứ tự, một lần</td><td>Lặp các chu kỳ ngắn, giao từng phần chạy được</td></tr>
    <tr><td>Đơn giản, nhưng cứng nhắc — đổi muộn rất tốn</td><td>Linh hoạt — chào đón yêu cầu thay đổi</td></tr>
    <tr><td>Tốt khi yêu cầu cố định</td><td>Chiếm ưu thế trong công nghiệp hiện đại (Scrum)</td></tr>
  </tbody>
</table>
<div class="note-ct">Để ý sự song song với thuật toán: phân tích = hiểu bài toán, thiết kế = lập kế hoạch lời giải, cài đặt = viết ra, kiểm thử = kiểm lại. Vẫn là tư duy giải quyết vấn đề đó, nhưng nâng lên quy mô cả đội ngũ và sản phẩm.</div>
</div>
`,
        },
        {
          title: '8.2 — Analysis, design, implementation & testing|||8.2 — Phân tích, thiết kế, cài đặt & kiểm thử',
          slug: 'csi104-8-2-cac-giai-doan',
          type: 'VIDEO',
          description: 'Từng giai đoạn làm gì và hai kiểu kiểm thử: hộp trắng vs hộp đen.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.2</span>
<h2>A closer look at the phases</h2>
<p class="lead">Each SDLC phase has a clear purpose and its own deliverables. The exam asks about analysis, design and testing specifically (CQ12.3–13.2).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Analysis — "what?"</div><div class="lz-ld">Understand and document what the users need. Output: a requirements specification. Two trends: procedure-oriented and object-oriented analysis.</div></div>
  <div class="lz-layer"><div class="lz-lt">Design — "how?"</div><div class="lz-ld">Decide the architecture, modules and data structures. Output: a design blueprint. Also procedure- vs object-oriented design.</div></div>
  <div class="lz-layer"><div class="lz-lt">Implementation — "build it"</div><div class="lz-ld">Programmers write code following the design. Quality issues here: readability, correctness, following standards.</div></div>
  <div class="lz-layer"><div class="lz-lt">Testing — "does it work?"</div><div class="lz-ld">Find and remove defects before users do.</div></div>
</div>
<h3>Two kinds of testing (CQ13.2)</h3>
<table>
  <thead><tr><th>Glass-box (white-box)</th><th>Black-box</th></tr></thead>
  <tbody>
    <tr><td>Tester sees the code inside</td><td>Tester sees only inputs &amp; outputs</td></tr>
    <tr><td>Checks every path/branch runs correctly</td><td>Checks behavior against requirements</td></tr>
    <tr><td>Done by developers</td><td>Done by QA / users</td></tr>
  </tbody>
</table>
<div class="callout ok">A memorable analogy: black-box testing is judging a vending machine by pressing buttons and seeing what drops out; glass-box testing is opening it up and checking every wire and gear. Good teams do both.</div>
<a class="link-card codelab" href="/code-lab/git?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-470" target="_blank" rel="noopener">
  <span class="lc-ico">🌿</span>
  <span class="lc-body"><span class="lc-title">The tool every dev team uses</span><span class="lc-sub">Version control (Git) coordinates real software work — start with "Git Fundamentals".</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.2</span>
<h2>Nhìn kỹ hơn các giai đoạn</h2>
<p class="lead">Mỗi giai đoạn SDLC có mục đích rõ và sản phẩm bàn giao riêng. Bài thi hỏi cụ thể về phân tích, thiết kế và kiểm thử (CQ12.3–13.2).</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Phân tích — "cái gì?"</div><div class="lz-ld">Hiểu và ghi lại điều người dùng cần. Kết quả: bản đặc tả yêu cầu. Hai xu hướng: phân tích hướng thủ tục và hướng đối tượng.</div></div>
  <div class="lz-layer"><div class="lz-lt">Thiết kế — "thế nào?"</div><div class="lz-ld">Quyết định kiến trúc, module và cấu trúc dữ liệu. Kết quả: bản thiết kế. Cũng có thiết kế hướng thủ tục vs hướng đối tượng.</div></div>
  <div class="lz-layer"><div class="lz-lt">Cài đặt — "xây nó"</div><div class="lz-ld">Lập trình viên viết code theo thiết kế. Vấn đề chất lượng ở đây: dễ đọc, đúng đắn, theo chuẩn.</div></div>
  <div class="lz-layer"><div class="lz-lt">Kiểm thử — "có chạy đúng không?"</div><div class="lz-ld">Tìm và loại lỗi trước khi người dùng gặp.</div></div>
</div>
<h3>Hai kiểu kiểm thử (CQ13.2)</h3>
<table>
  <thead><tr><th>Hộp trắng (glass-box)</th><th>Hộp đen (black-box)</th></tr></thead>
  <tbody>
    <tr><td>Người kiểm thấy code bên trong</td><td>Người kiểm chỉ thấy đầu vào &amp; đầu ra</td></tr>
    <tr><td>Kiểm mọi đường đi/nhánh chạy đúng</td><td>Kiểm hành vi so với yêu cầu</td></tr>
    <tr><td>Do lập trình viên làm</td><td>Do QA / người dùng làm</td></tr>
  </tbody>
</table>
<div class="callout ok">Một phép ví dễ nhớ: kiểm hộp đen là đánh giá máy bán nước bằng cách bấm nút và xem thứ rơi ra; kiểm hộp trắng là mở nó ra và kiểm từng dây, từng bánh răng. Đội tốt làm cả hai.</div>
<a class="link-card codelab" href="/code-lab/git?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-470" target="_blank" rel="noopener">
  <span class="lc-ico">🌿</span>
  <span class="lc-body"><span class="lc-title">Công cụ mọi đội dev đều dùng</span><span class="lc-sub">Quản lý phiên bản (Git) điều phối công việc phần mềm thật — bắt đầu với "Git Fundamentals".</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 8 Quiz|||Quiz chương 8',
          slug: 'csi104-quiz-ch8',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: SDLC, các giai đoạn, waterfall vs agile, kiểm thử.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'What is the correct order of the classic SDLC phases?|||Thứ tự đúng của các giai đoạn SDLC kinh điển là?', options: ['Design → Analysis → Testing → Implementation|||Thiết kế → Phân tích → Kiểm thử → Cài đặt', 'Analysis → Design → Implementation → Testing|||Phân tích → Thiết kế → Cài đặt → Kiểm thử', 'Testing → Implementation → Design → Analysis|||Kiểm thử → Cài đặt → Thiết kế → Phân tích', 'Implementation → Testing → Analysis → Design|||Cài đặt → Kiểm thử → Phân tích → Thiết kế'], correctIndex: 1, points: 1 },
              { question: 'The analysis phase mainly answers which question?|||Giai đoạn phân tích chủ yếu trả lời câu hỏi nào?', options: ['How to build it?|||Xây thế nào?', 'What must the software do?|||Phần mềm phải làm gì?', 'Which language?|||Ngôn ngữ nào?', 'When to release?|||Khi nào phát hành?'], correctIndex: 1, points: 1 },
              { question: 'A key advantage of Agile over Waterfall is…|||Ưu điểm chính của Agile so với Waterfall là…', options: ['it needs no testing|||không cần kiểm thử', 'it welcomes changing requirements through short cycles|||chào đón yêu cầu thay đổi qua các chu kỳ ngắn', 'it has no design phase|||không có giai đoạn thiết kế', 'it is always cheaper|||luôn rẻ hơn'], correctIndex: 1, points: 1 },
              { question: 'In black-box testing, the tester…|||Trong kiểm thử hộp đen, người kiểm…', options: ['reads all the source code|||đọc toàn bộ mã nguồn', 'sees only inputs and outputs|||chỉ thấy đầu vào và đầu ra', 'rewrites the program|||viết lại chương trình', 'designs the hardware|||thiết kế phần cứng'], correctIndex: 1, points: 1 },
              { question: 'Glass-box (white-box) testing focuses on…|||Kiểm thử hộp trắng tập trung vào…', options: ['the internal code paths and branches|||các đường đi/nhánh code bên trong', 'the marketing plan|||kế hoạch tiếp thị', 'the user manual|||sách hướng dẫn người dùng', 'network speed|||tốc độ mạng'], correctIndex: 0, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 9 — CẤU TRÚC DỮ LIỆU ══════════════════ */
    {
      title: 'Chapter 9 — Data Structures|||Chương 9 — Cấu trúc dữ liệu',
      description: 'Mảng, bản ghi, danh sách liên kết, ngăn xếp, hàng đợi, cây và đồ thị.',
      lessons: [
        {
          title: '9.1 — Arrays & records|||9.1 — Mảng & bản ghi',
          slug: 'csi104-9-1-mang-ban-ghi',
          type: 'VIDEO',
          description: 'Hai cách gom dữ liệu: nhiều cái cùng loại, và nhiều thuộc tính của một thứ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Organizing data so programs can use it</h2>
<p class="lead">A <strong>data structure</strong> is a way of organizing data in memory so it can be used efficiently. Choosing the right one is half of good programming. We start with the two simplest (CLO9).</p>
<h3>Array — many items of the SAME type</h3>
<p>An <strong>array</strong> stores a fixed number of same-type items in a continuous block, each reachable by an <em>index</em> (position). Access is instant: item[5] jumps straight to the sixth slot.</p>
<div class="out"><b>scores</b> → [ 8, 6, 9, 7, 10 ]<br>&nbsp;&nbsp;index → &nbsp; 0&nbsp; 1&nbsp; 2&nbsp; 3&nbsp; &nbsp;4<br>scores[2] = 9</div>
<p>Strength: super-fast direct access by index. Weakness: fixed size, and inserting in the middle means shifting everything after it.</p>
<h3>Record — many attributes of ONE thing</h3>
<p>A <strong>record</strong> (a struct in C) groups related fields of <em>different</em> types describing one entity (CQ13.4).</p>
<div class="out"><b>Student record</b><br>{ id: 1024, name: "An", gpa: 3.6 }</div>
<div class="note-ct">Array vs record in one line: an array is a <em>list of the same thing</em> (all students); a record is <em>one thing with many parts</em> (one student). Combine them — an array of records — and you have a table, the basis of databases in Chapter 11.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-503" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Code the linear data structures</span><span class="lc-sub">Arrays, stacks and queues in real code — the "Linear Data Structures" module.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Tổ chức dữ liệu để chương trình dùng được</h2>
<p class="lead">Một <strong>cấu trúc dữ liệu</strong> là cách tổ chức dữ liệu trong bộ nhớ để dùng hiệu quả. Chọn đúng cấu trúc là một nửa của lập trình tốt. Ta bắt đầu với hai cái đơn giản nhất (CLO9).</p>
<h3>Mảng — nhiều phần tử CÙNG kiểu</h3>
<p>Một <strong>mảng (array)</strong> lưu một số cố định các phần tử cùng kiểu trong một khối liên tục, mỗi phần tử truy cập được bằng <em>chỉ số (index)</em> (vị trí). Truy cập tức thì: item[5] nhảy thẳng tới ô thứ sáu.</p>
<div class="out"><b>scores</b> → [ 8, 6, 9, 7, 10 ]<br>chỉ số → &nbsp; 0&nbsp; 1&nbsp; 2&nbsp; 3&nbsp; &nbsp;4<br>scores[2] = 9</div>
<p>Điểm mạnh: truy cập trực tiếp theo chỉ số cực nhanh. Điểm yếu: kích thước cố định, và chèn vào giữa phải dời mọi thứ phía sau.</p>
<h3>Bản ghi — nhiều thuộc tính của MỘT thứ</h3>
<p>Một <strong>bản ghi (record)</strong> (struct trong C) gom các trường liên quan có kiểu <em>khác nhau</em> mô tả một thực thể (CQ13.4).</p>
<div class="out"><b>Bản ghi sinh viên</b><br>{ id: 1024, name: "An", gpa: 3.6 }</div>
<div class="note-ct">Mảng vs bản ghi trong một câu: mảng là <em>danh sách nhiều cái cùng loại</em> (tất cả sinh viên); bản ghi là <em>một thứ có nhiều phần</em> (một sinh viên). Kết hợp lại — một mảng các bản ghi — bạn có một bảng, nền tảng của cơ sở dữ liệu ở Chương 11.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-503" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Code các cấu trúc dữ liệu tuyến tính</span><span class="lc-sub">Mảng, ngăn xếp và hàng đợi trong code thật — module "Linear Data Structures".</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '9.2 — Linked lists|||9.2 — Danh sách liên kết',
          slug: 'csi104-9-2-danh-sach-lien-ket',
          type: 'VIDEO',
          description: 'Danh sách nối bằng con trỏ và vì sao nó linh hoạt hơn mảng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.2</span>
<h2>Linked lists — a flexible chain</h2>
<p class="lead">Where an array is a fixed row of slots, a <strong>linked list</strong> is a chain of <em>nodes</em>. Each node holds a value plus a pointer to the next node. The list can grow or shrink freely (CQ14.1).</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Node</div><div class="lz-t">10 → •</div><div class="lz-d">value + link</div></div>
  <div class="lz-step"><div class="lz-k">Node</div><div class="lz-t">20 → •</div><div class="lz-d">points to next</div></div>
  <div class="lz-step"><div class="lz-k">Node</div><div class="lz-t">30 → NULL</div><div class="lz-d">end of list</div></div>
</div>
<h3>Array vs linked list — the trade-off</h3>
<table>
  <thead><tr><th></th><th>Array</th><th>Linked list</th></tr></thead>
  <tbody>
    <tr><td>Access by index</td><td>Instant</td><td>Must walk from the start</td></tr>
    <tr><td>Insert/delete in middle</td><td>Slow (shift items)</td><td>Fast (just relink pointers)</td></tr>
    <tr><td>Size</td><td>Fixed</td><td>Grows dynamically</td></tr>
    <tr><td>Memory</td><td>One tight block</td><td>Scattered nodes + links</td></tr>
  </tbody>
</table>
<div class="note-ct">This is your first taste of the deepest theme in computer science: there is rarely one "best" structure. Arrays win at reading; linked lists win at inserting. The engineer picks based on what the program does most often. CSD201 explores this in depth.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-505" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Build a linked list</span><span class="lc-sub">Nodes and pointers in running code — the "Linked Lists" module.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.2</span>
<h2>Danh sách liên kết — một chuỗi linh hoạt</h2>
<p class="lead">Nếu mảng là một hàng ô cố định, thì <strong>danh sách liên kết</strong> là một chuỗi các <em>nút (node)</em>. Mỗi nút giữ một giá trị cộng một con trỏ tới nút kế. Danh sách có thể lớn lên hoặc co lại tự do (CQ14.1).</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Nút</div><div class="lz-t">10 → •</div><div class="lz-d">giá trị + liên kết</div></div>
  <div class="lz-step"><div class="lz-k">Nút</div><div class="lz-t">20 → •</div><div class="lz-d">trỏ tới nút kế</div></div>
  <div class="lz-step"><div class="lz-k">Nút</div><div class="lz-t">30 → NULL</div><div class="lz-d">cuối danh sách</div></div>
</div>
<h3>Mảng vs danh sách liên kết — đánh đổi</h3>
<table>
  <thead><tr><th></th><th>Mảng</th><th>Danh sách liên kết</th></tr></thead>
  <tbody>
    <tr><td>Truy cập theo chỉ số</td><td>Tức thì</td><td>Phải đi từ đầu</td></tr>
    <tr><td>Chèn/xoá ở giữa</td><td>Chậm (dời phần tử)</td><td>Nhanh (chỉ nối lại con trỏ)</td></tr>
    <tr><td>Kích thước</td><td>Cố định</td><td>Lớn lên động</td></tr>
    <tr><td>Bộ nhớ</td><td>Một khối liền</td><td>Nút rải rác + liên kết</td></tr>
  </tbody>
</table>
<div class="note-ct">Đây là lần đầu bạn nếm chủ đề sâu nhất của khoa học máy tính: hiếm khi có một cấu trúc "tốt nhất". Mảng thắng ở đọc; danh sách liên kết thắng ở chèn. Kỹ sư chọn dựa trên việc chương trình làm gì nhiều nhất. CSD201 sẽ đào sâu điều này.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-505" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Xây một danh sách liên kết</span><span class="lc-sub">Nút và con trỏ trong code chạy được — module "Linked Lists".</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '9.3 — Stacks & queues|||9.3 — Ngăn xếp & hàng đợi',
          slug: 'csi104-9-3-stack-queue',
          type: 'VIDEO',
          description: 'Hai cấu trúc với luật ra/vào LIFO và FIFO.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.3</span>
<h2>Stacks and queues — order matters</h2>
<p class="lead">These are <strong>abstract data types (ADTs)</strong>: we define them by their <em>behavior</em> (what operations they allow), not how they are stored. Both control the order items leave (CQ14.2, CQ14.3).</p>
<h3>Stack — Last In, First Out (LIFO)</h3>
<p>Like a pile of plates: you add (<strong>push</strong>) and remove (<strong>pop</strong>) only from the top. The last item in is the first out.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">push A</div><div class="lz-t">[A]</div><div class="lz-d">top = A</div></div>
  <div class="lz-step"><div class="lz-k">push B</div><div class="lz-t">[A, B]</div><div class="lz-d">top = B</div></div>
  <div class="lz-step"><div class="lz-k">pop</div><div class="lz-t">[A]</div><div class="lz-d">B comes out first</div></div>
</div>
<p>Used for: undo buttons, browser back, and the "call stack" that tracks running functions.</p>
<h3>Queue — First In, First Out (FIFO)</h3>
<p>Like a line at a shop: you join at the back (<strong>enqueue</strong>) and are served from the front (<strong>dequeue</strong>). The first item in is the first out.</p>
<p>Used for: printer jobs, task scheduling, message buffers.</p>
<div class="note-ct">One clean contrast: a stack is a pile (top-only, LIFO); a queue is a line (ends differ, FIFO). Same idea of "controlled access", opposite ordering — and both appear constantly in real systems.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.3</span>
<h2>Ngăn xếp và hàng đợi — thứ tự quan trọng</h2>
<p class="lead">Đây là các <strong>kiểu dữ liệu trừu tượng (ADT)</strong>: ta định nghĩa chúng bằng <em>hành vi</em> (cho phép thao tác gì), không phải cách lưu. Cả hai kiểm soát thứ tự phần tử rời đi (CQ14.2, CQ14.3).</p>
<h3>Ngăn xếp (stack) — Vào Sau, Ra Trước (LIFO)</h3>
<p>Như một chồng đĩa: bạn thêm (<strong>push</strong>) và lấy (<strong>pop</strong>) chỉ ở trên đỉnh. Phần tử vào sau cùng là ra đầu tiên.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">push A</div><div class="lz-t">[A]</div><div class="lz-d">đỉnh = A</div></div>
  <div class="lz-step"><div class="lz-k">push B</div><div class="lz-t">[A, B]</div><div class="lz-d">đỉnh = B</div></div>
  <div class="lz-step"><div class="lz-k">pop</div><div class="lz-t">[A]</div><div class="lz-d">B ra trước</div></div>
</div>
<p>Dùng cho: nút undo, nút back của trình duyệt, và "call stack" theo dõi các hàm đang chạy.</p>
<h3>Hàng đợi (queue) — Vào Trước, Ra Trước (FIFO)</h3>
<p>Như xếp hàng ở cửa hàng: bạn vào ở cuối (<strong>enqueue</strong>) và được phục vụ từ đầu (<strong>dequeue</strong>). Phần tử vào đầu tiên là ra đầu tiên.</p>
<p>Dùng cho: hàng đợi in, lập lịch tác vụ, bộ đệm tin nhắn.</p>
<div class="note-ct">Một tương phản gọn: ngăn xếp là một chồng (chỉ ở đỉnh, LIFO); hàng đợi là một hàng (hai đầu khác nhau, FIFO). Cùng ý "truy cập có kiểm soát", thứ tự ngược nhau — và cả hai xuất hiện liên tục trong hệ thống thật.</div>
</div>
`,
        },
        {
          title: '9.4 — Trees & graphs|||9.4 — Cây & đồ thị',
          slug: 'csi104-9-4-cay-do-thi',
          type: 'VIDEO',
          description: 'Cấu trúc phân cấp (cây) và cấu trúc mạng lưới (đồ thị).',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.4</span>
<h2>Non-linear structures: trees and graphs</h2>
<p class="lead">Arrays and lists are <em>linear</em> — one item after another. Some data is naturally branching or interconnected. Two structures capture that (CQ14.4, CQ14.5).</p>
<h3>Tree — a hierarchy</h3>
<p>A <strong>tree</strong> organizes data in levels: a root at the top, branching into children, down to leaves. Each node has one parent (except the root). Think of a family tree or your computer&#39;s folder structure.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">R</div><div class="lz-nbody"><div class="lz-ntitle">Root</div><div class="lz-nsub">the single top node</div></div></div>
  <div class="lz-node"><div class="lz-badge">•</div><div class="lz-nbody"><div class="lz-ntitle">Internal nodes</div><div class="lz-nsub">have parents and children</div></div></div>
  <div class="lz-node"><div class="lz-badge">▪</div><div class="lz-nbody"><div class="lz-ntitle">Leaves</div><div class="lz-nsub">nodes with no children</div></div></div>
</div>
<p>A <strong>binary tree</strong> lets each node have at most two children. A <strong>binary search tree (BST)</strong> keeps them ordered (smaller left, larger right) so searching is fast — like binary search built into the structure.</p>
<h3>Graph — a network</h3>
<p>A <strong>graph</strong> is nodes connected by edges, with <em>no</em> hierarchy — any node can link to any other. Perfect for maps (cities + roads), social networks (people + friendships), and the web (pages + links).</p>
<div class="note-ct">Tree vs graph: a tree is a special graph with a strict parent-child hierarchy and no cycles; a general graph allows any connections, including loops. Trees model "contains/belongs to"; graphs model "connected to". These power everything from file systems to Google Maps.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-506" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Build trees in code</span><span class="lc-sub">Binary trees and BSTs come alive in the "Trees &amp; Binary Search Trees" module.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.4</span>
<h2>Cấu trúc phi tuyến: cây và đồ thị</h2>
<p class="lead">Mảng và danh sách là <em>tuyến tính</em> — cái này nối cái kia. Một số dữ liệu vốn phân nhánh hoặc liên kết chằng chịt. Hai cấu trúc nắm bắt điều đó (CQ14.4, CQ14.5).</p>
<h3>Cây (tree) — một phân cấp</h3>
<p>Một <strong>cây</strong> tổ chức dữ liệu theo tầng: một gốc ở trên, phân nhánh thành các con, xuống tới lá. Mỗi nút có một cha (trừ gốc). Hãy nghĩ tới cây gia phả hoặc cấu trúc thư mục trên máy tính bạn.</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">R</div><div class="lz-nbody"><div class="lz-ntitle">Gốc (root)</div><div class="lz-nsub">nút trên cùng duy nhất</div></div></div>
  <div class="lz-node"><div class="lz-badge">•</div><div class="lz-nbody"><div class="lz-ntitle">Nút trong</div><div class="lz-nsub">có cha và con</div></div></div>
  <div class="lz-node"><div class="lz-badge">▪</div><div class="lz-nbody"><div class="lz-ntitle">Lá (leaf)</div><div class="lz-nsub">nút không có con</div></div></div>
</div>
<p>Một <strong>cây nhị phân</strong> cho mỗi nút tối đa hai con. Một <strong>cây tìm kiếm nhị phân (BST)</strong> giữ chúng có thứ tự (nhỏ bên trái, lớn bên phải) nên tìm rất nhanh — như tìm nhị phân được xây thẳng vào cấu trúc.</p>
<h3>Đồ thị (graph) — một mạng lưới</h3>
<p>Một <strong>đồ thị</strong> là các nút nối bằng cạnh, <em>không</em> phân cấp — nút nào cũng có thể nối tới nút khác. Hoàn hảo cho bản đồ (thành phố + đường), mạng xã hội (người + tình bạn), và web (trang + liên kết).</p>
<div class="note-ct">Cây vs đồ thị: cây là một đồ thị đặc biệt có phân cấp cha-con chặt và không có chu trình; đồ thị tổng quát cho phép mọi kết nối, kể cả vòng lặp. Cây mô hình "chứa/thuộc về"; đồ thị mô hình "nối với". Chúng vận hành mọi thứ từ hệ thống tệp tới Google Maps.</div>
<a class="link-card codelab" href="/code-lab/data-structures-algorithms?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-506" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Xây cây bằng code</span><span class="lc-sub">Cây nhị phân và BST sống dậy trong module "Trees &amp; Binary Search Trees".</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 9 Quiz|||Quiz chương 9',
          slug: 'csi104-quiz-ch9',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: mảng, bản ghi, danh sách liên kết, stack/queue, cây/đồ thị.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'An array stores…|||Một mảng lưu…', options: ['many items of the same type, accessed by index|||nhiều phần tử cùng kiểu, truy cập theo chỉ số', 'one item of many types|||một phần tử nhiều kiểu', 'only text|||chỉ chữ', 'network packets|||các gói tin mạng'], correctIndex: 0, points: 1 },
              { question: 'Compared to an array, a linked list is better at…|||So với mảng, danh sách liên kết tốt hơn ở…', options: ['instant access by index|||truy cập tức thì theo chỉ số', 'inserting/deleting in the middle|||chèn/xoá ở giữa', 'using less memory|||dùng ít bộ nhớ hơn', 'storing images|||lưu ảnh'], correctIndex: 1, points: 1 },
              { question: 'A stack follows which rule?|||Ngăn xếp theo luật nào?', options: ['FIFO (First In First Out)', 'LIFO (Last In First Out)', 'Random order|||Thứ tự ngẫu nhiên', 'Sorted order|||Thứ tự sắp xếp'], correctIndex: 1, points: 1 },
              { question: 'A queue is best compared to…|||Hàng đợi giống nhất với…', options: ['a pile of plates|||một chồng đĩa', 'a line of people waiting|||một hàng người đang chờ', 'a family tree|||một cây gia phả', 'a road map|||một bản đồ đường'], correctIndex: 1, points: 1 },
              { question: 'How does a tree differ from a general graph?|||Cây khác đồ thị tổng quát thế nào?', options: ['A tree has a parent-child hierarchy and no cycles|||Cây có phân cấp cha-con và không có chu trình', 'A tree cannot store data|||Cây không lưu được dữ liệu', 'A graph is always smaller|||Đồ thị luôn nhỏ hơn', 'They are identical|||Chúng giống hệt nhau'], correctIndex: 0, points: 1 },
              { question: 'A binary search tree (BST) keeps nodes ordered so that…|||Cây tìm kiếm nhị phân (BST) giữ nút có thứ tự để…', options: ['it looks nicer|||trông đẹp hơn', 'searching is fast (smaller left, larger right)|||tìm kiếm nhanh (nhỏ trái, lớn phải)', 'it uses no memory|||không dùng bộ nhớ', 'it needs no root|||không cần gốc'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 2 ══════════════════ */
    {
      title: 'Progress Test 2 (review CLO7–9)|||Progress Test 2 (ôn CLO7–9)',
      description: 'Ôn giữa–cuối kỳ: ngôn ngữ lập trình, công nghệ phần mềm, cấu trúc dữ liệu.',
      lessons: [
        {
          title: 'Progress Test 2 — mixed review|||Progress Test 2 — ôn tổng hợp',
          slug: 'csi104-progress-test-2',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 7–9.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'Which is the only language a CPU executes directly?|||Ngôn ngữ duy nhất nào CPU thực thi trực tiếp?', options: ['Python', 'Machine language|||Ngôn ngữ máy', 'Assembly|||Hợp ngữ', 'C'], correctIndex: 1, points: 1 },
              { question: 'An interpreter translates a program…|||Trình thông dịch dịch chương trình…', options: ['all at once before running|||tất cả một lần trước khi chạy', 'line by line while running|||từng dòng khi chạy', 'never|||không bao giờ', 'into hardware|||thành phần cứng'], correctIndex: 1, points: 1 },
              { question: 'Testing that checks internal code paths is called…|||Kiểm thử kiểm các đường code bên trong gọi là…', options: ['black-box testing|||kiểm thử hộp đen', 'glass-box (white-box) testing|||kiểm thử hộp trắng', 'user testing|||kiểm thử người dùng', 'network testing|||kiểm thử mạng'], correctIndex: 1, points: 1 },
              { question: 'A record (struct) groups…|||Một bản ghi (struct) gom…', options: ['many items of the same type|||nhiều phần tử cùng kiểu', 'related fields of different types about one entity|||các trường liên quan khác kiểu về một thực thể', 'only numbers|||chỉ số', 'network addresses|||các địa chỉ mạng'], correctIndex: 1, points: 1 },
              { question: 'Undo functionality is naturally modeled with a…|||Chức năng undo được mô hình tự nhiên bằng…', options: ['queue|||hàng đợi', 'stack|||ngăn xếp', 'graph|||đồ thị', 'array only|||chỉ mảng'], correctIndex: 1, points: 1 },
              { question: 'A social network (people and friendships) is best modeled by a…|||Một mạng xã hội (người và tình bạn) được mô hình tốt nhất bằng…', options: ['stack|||ngăn xếp', 'graph|||đồ thị', 'queue|||hàng đợi', 'single array|||một mảng đơn'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 10 — CẤU TRÚC TỆP ══════════════════ */
    {
      title: 'Chapter 10 — File Structures|||Chương 10 — Cấu trúc tệp',
      description: 'Tệp text vs binary và các phương thức truy cập tệp.',
      lessons: [
        {
          title: '10.1 — Text vs binary files|||10.1 — Tệp text vs binary',
          slug: 'csi104-10-1-text-binary',
          type: 'VIDEO',
          description: 'Hai cách một tệp lưu byte và vì sao mở nhầm kiểu ra "rác".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.1</span>
<h2>What is a file?</h2>
<p class="lead">A <strong>file</strong> is a named collection of related data stored permanently on disk. Whereas RAM forgets on power-off, files survive. Every file is ultimately bytes — but there are two ways to interpret those bytes (CLO10, CQ15.1).</p>
<table>
  <thead><tr><th></th><th>Text file</th><th>Binary file</th></tr></thead>
  <tbody>
    <tr><td>Contents</td><td>Human-readable characters (encoded as ASCII/Unicode)</td><td>Raw bytes in a program-specific format</td></tr>
    <tr><td>Open in Notepad?</td><td>Yes, readable</td><td>Looks like garbage</td></tr>
    <tr><td>Examples</td><td>.txt, .csv, .html, source code</td><td>.jpg, .mp3, .exe, .zip</td></tr>
    <tr><td>Size</td><td>Larger for numbers</td><td>Compact &amp; exact</td></tr>
  </tbody>
</table>
<p>The number 1000 in a text file takes four characters ("1", "0", "0", "0"). In a binary file it can be stored in the exact bytes the CPU uses for an integer — smaller and instantly usable, but only the right program can read it.</p>
<div class="pitfall">Opening a JPEG in a text editor shows random symbols — not because the file is corrupt, but because you are reading binary bytes as if they were characters. The <em>same bytes</em>, wrong interpretation. This mirrors Chapter 3&#39;s lesson exactly.</div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-479" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Work with real files</span><span class="lc-sub">Create, read and inspect files from the shell — the "File Operations &amp; Permissions" module.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.1</span>
<h2>Tệp là gì?</h2>
<p class="lead">Một <strong>tệp (file)</strong> là một tập dữ liệu liên quan có tên, lưu vĩnh viễn trên đĩa. Trong khi RAM quên khi tắt điện, tệp thì sống sót. Mọi tệp rốt cuộc là byte — nhưng có hai cách diễn giải các byte đó (CLO10, CQ15.1).</p>
<table>
  <thead><tr><th></th><th>Tệp text</th><th>Tệp binary</th></tr></thead>
  <tbody>
    <tr><td>Nội dung</td><td>Ký tự con người đọc được (mã ASCII/Unicode)</td><td>Byte thô theo định dạng riêng của chương trình</td></tr>
    <tr><td>Mở trong Notepad?</td><td>Được, đọc được</td><td>Nhìn như rác</td></tr>
    <tr><td>Ví dụ</td><td>.txt, .csv, .html, mã nguồn</td><td>.jpg, .mp3, .exe, .zip</td></tr>
    <tr><td>Kích thước</td><td>Lớn hơn với số</td><td>Gọn &amp; chính xác</td></tr>
  </tbody>
</table>
<p>Số 1000 trong tệp text tốn bốn ký tự ("1", "0", "0", "0"). Trong tệp binary nó có thể lưu đúng các byte CPU dùng cho một số nguyên — nhỏ hơn và dùng được ngay, nhưng chỉ đúng chương trình mới đọc được.</p>
<div class="pitfall">Mở một tệp JPEG trong trình soạn thảo văn bản thấy các ký hiệu lộn xộn — không phải vì tệp hỏng, mà vì bạn đang đọc byte binary như thể chúng là ký tự. <em>Cùng byte</em>, sai cách diễn giải. Điều này lặp lại đúng bài học ở Chương 3.</div>
<a class="link-card codelab" href="/code-lab/linux-bash?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-479" target="_blank" rel="noopener">
  <span class="lc-ico">🐧</span>
  <span class="lc-body"><span class="lc-title">Làm việc với tệp thật</span><span class="lc-sub">Tạo, đọc và soi tệp từ shell — module "File Operations &amp; Permissions".</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '10.2 — File access methods|||10.2 — Phương thức truy cập tệp',
          slug: 'csi104-10-2-truy-cap-tep',
          type: 'VIDEO',
          description: 'Tuần tự, chỉ mục và băm — ba cách tìm dữ liệu trong tệp.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 10 · Lesson 10.2</span>
<h2>How do we find a record in a file?</h2>
<p class="lead">A file may hold millions of records. The <strong>access method</strong> decides how quickly we can reach a particular one (CQ15.2, CQ15.3). There are three classic approaches.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Sequential access</div><div class="lz-ld">Read records in order from the start until you find the one you want. Simple; great for processing all records (like a tape). Slow for finding one specific record.</div></div>
  <div class="lz-layer"><div class="lz-lt">Indexed access</div><div class="lz-ld">Keep a separate index (like a book&#39;s table of contents) mapping keys to positions. Look up the key in the index, jump straight to the record. Fast lookups at the cost of extra storage.</div></div>
  <div class="lz-layer"><div class="lz-lt">Hashed access</div><div class="lz-ld">Run the key through a hash function that computes the record&#39;s address directly. Near-instant access — no scanning, no index search.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Sequential</div><div class="lz-t">scan all</div><div class="lz-d">slow to find one</div></div>
  <div class="lz-step"><div class="lz-k">Indexed</div><div class="lz-t">look up + jump</div><div class="lz-d">fast, needs index</div></div>
  <div class="lz-step"><div class="lz-k">Hashed</div><div class="lz-t">compute address</div><div class="lz-d">fastest for exact keys</div></div>
</div>
<div class="note-ct">These same ideas power databases (Chapter 11). An <strong>index</strong> in a database is exactly this: a shortcut structure so the system does not have to scan every row. Choosing good indexes is a real-world skill you will use in DBI202 and beyond.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 10 · Bài 10.2</span>
<h2>Làm sao tìm một bản ghi trong tệp?</h2>
<p class="lead">Một tệp có thể chứa hàng triệu bản ghi. <strong>Phương thức truy cập</strong> quyết định ta tới được một bản ghi cụ thể nhanh đến đâu (CQ15.2, CQ15.3). Có ba cách kinh điển.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Truy cập tuần tự</div><div class="lz-ld">Đọc bản ghi theo thứ tự từ đầu tới khi gặp cái cần. Đơn giản; rất tốt để xử lý tất cả bản ghi (như băng từ). Chậm khi tìm một bản ghi cụ thể.</div></div>
  <div class="lz-layer"><div class="lz-lt">Truy cập theo chỉ mục (indexed)</div><div class="lz-ld">Giữ một chỉ mục riêng (như mục lục sách) ánh xạ khoá tới vị trí. Tra khoá trong chỉ mục, nhảy thẳng tới bản ghi. Tra cứu nhanh nhưng tốn thêm lưu trữ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Truy cập băm (hashed)</div><div class="lz-ld">Đưa khoá qua một hàm băm tính thẳng ra địa chỉ bản ghi. Truy cập gần tức thì — không quét, không tra chỉ mục.</div></div>
</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tuần tự</div><div class="lz-t">quét hết</div><div class="lz-d">chậm khi tìm một cái</div></div>
  <div class="lz-step"><div class="lz-k">Chỉ mục</div><div class="lz-t">tra + nhảy</div><div class="lz-d">nhanh, cần chỉ mục</div></div>
  <div class="lz-step"><div class="lz-k">Băm</div><div class="lz-t">tính địa chỉ</div><div class="lz-d">nhanh nhất cho khoá chính xác</div></div>
</div>
<div class="note-ct">Những ý tưởng này vận hành cả cơ sở dữ liệu (Chương 11). Một <strong>chỉ mục (index)</strong> trong CSDL chính là điều này: một cấu trúc lối tắt để hệ thống không phải quét mọi hàng. Chọn chỉ mục tốt là kỹ năng thực tế bạn sẽ dùng ở DBI202 và về sau.</div>
</div>
`,
        },
        {
          title: 'Chapter 10 Quiz|||Quiz chương 10',
          slug: 'csi104-quiz-ch10',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: text vs binary, phương thức truy cập tệp.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Why does a JPEG look like garbage in a text editor?|||Vì sao một JPEG nhìn như rác trong trình soạn thảo văn bản?', options: ['The file is corrupt|||Tệp bị hỏng', 'Binary bytes are being read as if they were characters|||Byte binary đang bị đọc như thể là ký tự', 'JPEG is not a real format|||JPEG không phải định dạng thật', 'The editor is broken|||Trình soạn thảo bị hỏng'], correctIndex: 1, points: 1 },
              { question: 'Which is a text file?|||Cái nào là tệp text?', options: ['.mp3', '.exe', '.csv', '.zip'], correctIndex: 2, points: 1 },
              { question: 'Sequential access is best when you need to…|||Truy cập tuần tự tốt nhất khi bạn cần…', options: ['find one record instantly|||tìm một bản ghi tức thì', 'process all records in order|||xử lý tất cả bản ghi theo thứ tự', 'jump to a random record|||nhảy tới một bản ghi ngẫu nhiên', 'compress the file|||nén tệp'], correctIndex: 1, points: 1 },
              { question: 'A hashed access method finds a record by…|||Phương thức truy cập băm tìm bản ghi bằng cách…', options: ['scanning from the start|||quét từ đầu', 'computing its address from the key|||tính địa chỉ của nó từ khoá', 'asking the user|||hỏi người dùng', 'sorting the whole file|||sắp xếp cả tệp'], correctIndex: 1, points: 1 },
              { question: 'An index in a file/database is like…|||Một chỉ mục trong tệp/CSDL giống như…', options: ['the cover of a book|||bìa của một cuốn sách', 'a table of contents pointing to positions|||một mục lục trỏ tới các vị trí', 'the paper it is printed on|||tờ giấy in nó', 'a random guess|||một phỏng đoán ngẫu nhiên'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 11 — CƠ SỞ DỮ LIỆU ══════════════════ */
    {
      title: 'Chapter 11 — Databases|||Chương 11 — Cơ sở dữ liệu',
      description: 'CSDL là gì, kiến trúc, mô hình quan hệ và thiết kế cơ bản.',
      lessons: [
        {
          title: '11.1 — What is a database & its architecture|||11.1 — CSDL là gì & kiến trúc',
          slug: 'csi104-11-1-csdl-la-gi',
          type: 'VIDEO',
          description: 'Vì sao ta cần CSDL thay vì tệp rời và ý tưởng độc lập dữ liệu.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.1</span>
<h2>Why databases exist</h2>
<p class="lead">Storing data in loose files quickly becomes a mess: duplication, inconsistency, no easy way to query. A <strong>database</strong> is an organized collection of related data, managed by a <strong>DBMS</strong> (Database Management System) that keeps it consistent, searchable and shareable (CLO11, CQ16.1).</p>
<div class="lz-map">
  <div class="lz-stage">What a DBMS gives you</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">No redundancy</div><div class="lz-nsub">Store each fact once, avoid conflicting copies</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Powerful queries</div><div class="lz-nsub">Ask questions of the data with a query language (SQL)</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Multi-user &amp; safe</div><div class="lz-nsub">Many users at once; backups; access control</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Data independence</div><div class="lz-nsub">Change storage details without breaking apps</div></div></div>
</div>
<h3>Three-level architecture (CQ16.2)</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">External level (views)</div><div class="lz-ld">What each user/app sees — often just part of the data.</div></div>
  <div class="lz-layer"><div class="lz-lt">Conceptual level (logical)</div><div class="lz-ld">The whole database structure: tables, fields, relationships.</div></div>
  <div class="lz-layer"><div class="lz-lt">Internal level (physical)</div><div class="lz-ld">How data is actually stored on disk (files, indexes).</div></div>
</div>
<p>This layering gives <strong>data independence</strong>: you can reorganize physical storage (internal) without changing how apps see the data (external). Same idea as networking layers — separate concerns so each can change alone.</p>
<div class="note-ct">You are literally using a database right now — this Academy stores courses, lessons and your progress in PostgreSQL. DBI202 teaches you to build and query one; this chapter gives you the map.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.1</span>
<h2>Vì sao có cơ sở dữ liệu</h2>
<p class="lead">Lưu dữ liệu trong các tệp rời nhanh chóng thành mớ hỗn độn: trùng lặp, mâu thuẫn, không có cách truy vấn dễ dàng. Một <strong>cơ sở dữ liệu</strong> là một tập dữ liệu liên quan có tổ chức, được quản lý bởi <strong>DBMS</strong> (Hệ quản trị CSDL) giữ nó nhất quán, tìm được và chia sẻ được (CLO11, CQ16.1).</p>
<div class="lz-map">
  <div class="lz-stage">DBMS cho bạn gì</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Không dư thừa</div><div class="lz-nsub">Lưu mỗi sự kiện một lần, tránh các bản sao mâu thuẫn</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Truy vấn mạnh</div><div class="lz-nsub">Đặt câu hỏi cho dữ liệu bằng ngôn ngữ truy vấn (SQL)</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Đa người dùng &amp; an toàn</div><div class="lz-nsub">Nhiều người cùng lúc; sao lưu; kiểm soát truy cập</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Độc lập dữ liệu</div><div class="lz-nsub">Đổi chi tiết lưu trữ mà không làm hỏng ứng dụng</div></div></div>
</div>
<h3>Kiến trúc ba mức (CQ16.2)</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Mức ngoài (view)</div><div class="lz-ld">Điều mỗi người dùng/app thấy — thường chỉ một phần dữ liệu.</div></div>
  <div class="lz-layer"><div class="lz-lt">Mức khái niệm (logic)</div><div class="lz-ld">Toàn bộ cấu trúc CSDL: bảng, trường, quan hệ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Mức trong (vật lý)</div><div class="lz-ld">Cách dữ liệu thực sự lưu trên đĩa (tệp, chỉ mục).</div></div>
</div>
<p>Phân tầng này cho <strong>độc lập dữ liệu</strong>: bạn có thể tổ chức lại lưu trữ vật lý (mức trong) mà không đổi cách app thấy dữ liệu (mức ngoài). Cùng ý tưởng với các tầng mạng — tách mối quan tâm để mỗi phần đổi riêng được.</p>
<div class="note-ct">Bạn đang dùng một CSDL ngay lúc này — Academy này lưu khóa học, bài học và tiến độ của bạn trong PostgreSQL. DBI202 dạy bạn xây và truy vấn một cái; chương này cho bạn tấm bản đồ.</div>
</div>
`,
        },
        {
          title: '11.2 — The relational model & database design|||11.2 — Mô hình quan hệ & thiết kế CSDL',
          slug: 'csi104-11-2-mo-hinh-quan-he',
          type: 'VIDEO',
          description: 'Bảng, khoá, quan hệ và nguyên tắc thiết kế tốt.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 11 · Lesson 11.2</span>
<h2>The relational model — data as tables</h2>
<p class="lead">The dominant way to organize a database is the <strong>relational model</strong>: data lives in <strong>tables</strong> (relations) of rows and columns. It is simple, mathematically grounded, and everywhere (CQ16.3, CQ17.1).</p>
<div class="out"><b>Table: Student</b><br>| id | name | gpa |<br>| 1&nbsp; | An&nbsp;&nbsp; | 3.6 |<br>| 2&nbsp; | Binh | 3.2 |<br>Each <b>row</b> = one record · each <b>column</b> = one field</div>
<h3>Keys — how rows connect</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Primary key</div><div class="lz-ld">A column that uniquely identifies each row (e.g. student id). No two rows share it.</div></div>
  <div class="lz-layer"><div class="lz-lt">Foreign key</div><div class="lz-ld">A column that points to a primary key in another table — this is how tables relate (e.g. an Enrollment row links a student id to a course id).</div></div>
</div>
<h3>What makes a good design? (CQ17.3)</h3>
<p>Good relational design avoids storing the same fact in many places (a process called <strong>normalization</strong>). If a student changes their name, you should update it in exactly one row — not hunt through the whole database. Redundancy causes update anomalies and inconsistency.</p>
<p>The relational model also provides <strong>data independence</strong> (CQ17.2): apps ask for data by table/column names using SQL, without knowing how it is physically stored.</p>
<div class="note-ct">One relational query can join tables to answer rich questions ("list all students enrolled in CSI104"). This power — describing <em>what</em> you want, not <em>how</em> to fetch it — is why SQL has lasted 50 years and is worth learning well in DBI202.</div>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-406" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Query a real database</span><span class="lc-sub">Write your first SELECT statements in the "SQL Foundations" module.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 11 · Bài 11.2</span>
<h2>Mô hình quan hệ — dữ liệu là các bảng</h2>
<p class="lead">Cách tổ chức CSDL phổ biến nhất là <strong>mô hình quan hệ</strong>: dữ liệu nằm trong các <strong>bảng (relation)</strong> gồm hàng và cột. Nó đơn giản, có nền tảng toán học, và ở khắp nơi (CQ16.3, CQ17.1).</p>
<div class="out"><b>Bảng: Student</b><br>| id | name | gpa |<br>| 1&nbsp; | An&nbsp;&nbsp; | 3.6 |<br>| 2&nbsp; | Binh | 3.2 |<br>Mỗi <b>hàng</b> = một bản ghi · mỗi <b>cột</b> = một trường</div>
<h3>Khoá — cách các hàng nối với nhau</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Khoá chính (primary key)</div><div class="lz-ld">Một cột định danh duy nhất mỗi hàng (ví dụ id sinh viên). Không hai hàng nào trùng nó.</div></div>
  <div class="lz-layer"><div class="lz-lt">Khoá ngoại (foreign key)</div><div class="lz-ld">Một cột trỏ tới khoá chính ở bảng khác — đây là cách các bảng liên hệ (ví dụ một hàng Đăng ký nối id sinh viên với id môn học).</div></div>
</div>
<h3>Thiết kế tốt là gì? (CQ17.3)</h3>
<p>Thiết kế quan hệ tốt tránh lưu cùng một sự kiện ở nhiều nơi (một quá trình gọi là <strong>chuẩn hoá — normalization</strong>). Nếu một sinh viên đổi tên, bạn nên cập nhật ở đúng một hàng — không phải lùng khắp CSDL. Dư thừa gây bất thường khi cập nhật và mâu thuẫn.</p>
<p>Mô hình quan hệ cũng cho <strong>độc lập dữ liệu</strong> (CQ17.2): app hỏi dữ liệu theo tên bảng/cột bằng SQL, mà không cần biết nó lưu vật lý ra sao.</p>
<div class="note-ct">Một truy vấn quan hệ có thể nối (join) các bảng để trả lời câu hỏi phong phú ("liệt kê mọi sinh viên đăng ký CSI104"). Sức mạnh này — mô tả <em>cái gì</em> bạn muốn, không phải <em>làm sao</em> lấy — là lý do SQL trụ vững 50 năm và đáng học kỹ ở DBI202.</div>
<a class="link-card codelab" href="/code-lab/sql?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-406" target="_blank" rel="noopener">
  <span class="lc-ico">🗄️</span>
  <span class="lc-body"><span class="lc-title">Truy vấn một CSDL thật</span><span class="lc-sub">Viết câu SELECT đầu tiên của bạn trong module "SQL Foundations".</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 11 Quiz|||Quiz chương 11',
          slug: 'csi104-quiz-ch11',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: DBMS, kiến trúc ba mức, mô hình quan hệ, khoá.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'A DBMS mainly helps by…|||Một DBMS chủ yếu giúp bằng cách…', options: ['making the CPU faster|||làm CPU nhanh hơn', 'keeping data consistent, searchable and shareable|||giữ dữ liệu nhất quán, tìm được và chia sẻ được', 'compressing images|||nén ảnh', 'replacing the operating system|||thay hệ điều hành'], correctIndex: 1, points: 1 },
              { question: 'In the relational model, data is stored as…|||Trong mô hình quan hệ, dữ liệu được lưu dưới dạng…', options: ['linked lists|||danh sách liên kết', 'tables of rows and columns|||các bảng gồm hàng và cột', 'a single big file|||một tệp lớn duy nhất', 'graphs|||đồ thị'], correctIndex: 1, points: 1 },
              { question: 'A primary key…|||Một khoá chính…', options: ['uniquely identifies each row in a table|||định danh duy nhất mỗi hàng trong bảng', 'stores images|||lưu ảnh', 'connects to the Internet|||kết nối Internet', 'is always a name|||luôn là một cái tên'], correctIndex: 0, points: 1 },
              { question: 'A foreign key is used to…|||Khoá ngoại được dùng để…', options: ['encrypt data|||mã hoá dữ liệu', 'link a row to a primary key in another table|||nối một hàng tới khoá chính ở bảng khác', 'speed up the disk|||tăng tốc đĩa', 'delete tables|||xoá bảng'], correctIndex: 1, points: 1 },
              { question: 'Normalization aims to…|||Chuẩn hoá nhằm…', options: ['store every fact in many places|||lưu mỗi sự kiện ở nhiều nơi', 'reduce redundancy so each fact is stored once|||giảm dư thừa để mỗi sự kiện lưu một lần', 'make tables larger|||làm bảng lớn hơn', 'remove all keys|||bỏ hết khoá'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 12 — BẢO MẬT & ĐẠO ĐỨC ══════════════════ */
    {
      title: 'Chapter 12 — Security & Ethics|||Chương 12 — Bảo mật & Đạo đức',
      description: 'Mục tiêu bảo mật (CIA), mã hoá đối xứng/bất đối xứng, quyền riêng tư và đạo đức nghề.',
      lessons: [
        {
          title: '12.1 — Security goals: the CIA triad|||12.1 — Mục tiêu bảo mật: bộ ba CIA',
          slug: 'csi104-12-1-cia',
          type: 'VIDEO',
          description: 'Bảo mật, toàn vẹn và sẵn sàng — ba mục tiêu nền tảng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.1</span>
<h2>What are we protecting? The CIA triad</h2>
<p class="lead">Computer security rests on three goals, remembered as <strong>CIA</strong>. Every attack threatens one of them, and every defense supports one (CLO12, CQ18.1).</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">C</div><div class="lz-nbody"><div class="lz-ntitle">Confidentiality</div><div class="lz-nsub">Only authorized people can read the data. Threatened by eavesdropping/theft; defended by encryption &amp; access control.</div></div></div>
  <div class="lz-node"><div class="lz-badge">I</div><div class="lz-nbody"><div class="lz-ntitle">Integrity</div><div class="lz-nsub">Data is not altered without permission. Threatened by tampering; defended by hashes &amp; checksums.</div></div></div>
  <div class="lz-node"><div class="lz-badge">A</div><div class="lz-nbody"><div class="lz-ntitle">Availability</div><div class="lz-nsub">The system is up when needed. Threatened by denial-of-service; defended by backups &amp; redundancy.</div></div></div>
</div>
<p>Real examples: a leaked password database breaks <em>confidentiality</em>; a changed bank balance breaks <em>integrity</em>; a website knocked offline by a flood of traffic breaks <em>availability</em>.</p>
<div class="callout warn">Security is only as strong as its weakest link — and that link is very often a human, not the technology. A perfect encryption system fails if someone writes the password on a sticky note. This is why security is also about behavior and process, not just code.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.1</span>
<h2>Ta đang bảo vệ cái gì? Bộ ba CIA</h2>
<p class="lead">Bảo mật máy tính dựa trên ba mục tiêu, nhớ bằng chữ <strong>CIA</strong>. Mọi tấn công đe doạ một trong số đó, và mọi phòng thủ hỗ trợ một trong số đó (CLO12, CQ18.1).</p>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">C</div><div class="lz-nbody"><div class="lz-ntitle">Bảo mật (Confidentiality)</div><div class="lz-nsub">Chỉ người được phép mới đọc được dữ liệu. Bị đe doạ bởi nghe lén/trộm; phòng thủ bằng mã hoá &amp; kiểm soát truy cập.</div></div></div>
  <div class="lz-node"><div class="lz-badge">I</div><div class="lz-nbody"><div class="lz-ntitle">Toàn vẹn (Integrity)</div><div class="lz-nsub">Dữ liệu không bị sửa khi chưa được phép. Bị đe doạ bởi giả mạo; phòng thủ bằng hàm băm &amp; checksum.</div></div></div>
  <div class="lz-node"><div class="lz-badge">A</div><div class="lz-nbody"><div class="lz-ntitle">Sẵn sàng (Availability)</div><div class="lz-nsub">Hệ thống hoạt động khi cần. Bị đe doạ bởi từ chối dịch vụ; phòng thủ bằng sao lưu &amp; dự phòng.</div></div></div>
</div>
<p>Ví dụ thật: một CSDL mật khẩu bị rò phá <em>bảo mật</em>; một số dư ngân hàng bị đổi phá <em>toàn vẹn</em>; một website bị đánh sập bởi lượng truy cập lũ phá <em>sẵn sàng</em>.</p>
<div class="callout warn">Bảo mật chỉ mạnh bằng mắt xích yếu nhất — và mắt xích đó rất thường là con người, không phải công nghệ. Một hệ mã hoá hoàn hảo vẫn thất bại nếu ai đó ghi mật khẩu lên tờ giấy dán. Vì thế bảo mật cũng là về hành vi và quy trình, không chỉ code.</div>
</div>
`,
        },
        {
          title: '12.2 — Cryptography: symmetric & asymmetric|||12.2 — Mã hoá: đối xứng & bất đối xứng',
          slug: 'csi104-12-2-ma-hoa',
          type: 'VIDEO',
          description: 'Hai kiểu mã hoá và ý tưởng khoá công khai làm nền cho Internet an toàn.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.2</span>
<h2>Keeping secrets with cryptography</h2>
<p class="lead"><strong>Encryption</strong> scrambles readable data (plaintext) into unreadable form (ciphertext) using a <em>key</em>. Only someone with the right key can reverse it. This is the main tool for confidentiality (CQ18.2).</p>
<h3>Symmetric-key encryption</h3>
<p>One shared secret key both locks and unlocks the data. Fast and simple — but both sides must somehow already share the same key secretly, which is the hard part.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Lock</div><div class="lz-t">key K</div><div class="lz-d">plaintext → ciphertext</div></div>
  <div class="lz-step"><div class="lz-k">Send</div><div class="lz-t">ciphertext</div><div class="lz-d">safe over the wire</div></div>
  <div class="lz-step"><div class="lz-k">Unlock</div><div class="lz-t">same key K</div><div class="lz-d">ciphertext → plaintext</div></div>
</div>
<h3>Asymmetric-key (public-key) encryption</h3>
<p>The clever breakthrough: each person has a <strong>pair</strong> of keys — a <em>public</em> key anyone can use to encrypt a message to you, and a <em>private</em> key only you hold to decrypt it. No secret needs to be shared in advance.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Encrypt</div><div class="lz-t">your PUBLIC key</div><div class="lz-d">anyone can lock a message to you</div></div>
  <div class="lz-step"><div class="lz-k">Decrypt</div><div class="lz-t">your PRIVATE key</div><div class="lz-d">only you can open it</div></div>
</div>
<div class="callout ok">This is what the padlock in your browser (HTTPS) uses. Asymmetric crypto solves the key-sharing problem and makes secure online shopping and banking possible — arguably the invention that made the modern web trustworthy.</div>
<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-948" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">See security in practice</span><span class="lc-sub">Threats, hashing and access control in real systems — the "Auth Fundamentals &amp; Threats" module.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.2</span>
<h2>Giữ bí mật bằng mã hoá</h2>
<p class="lead"><strong>Mã hoá (encryption)</strong> xáo trộn dữ liệu đọc được (bản rõ) thành dạng không đọc được (bản mã) bằng một <em>khoá</em>. Chỉ người có khoá đúng mới đảo ngược được. Đây là công cụ chính cho tính bảo mật (CQ18.2).</p>
<h3>Mã hoá khoá đối xứng</h3>
<p>Một khoá bí mật chung vừa khoá vừa mở dữ liệu. Nhanh và đơn giản — nhưng cả hai bên phải bằng cách nào đó đã chia sẻ cùng khoá một cách bí mật, đó là phần khó.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Khoá</div><div class="lz-t">khoá K</div><div class="lz-d">bản rõ → bản mã</div></div>
  <div class="lz-step"><div class="lz-k">Gửi</div><div class="lz-t">bản mã</div><div class="lz-d">an toàn trên đường truyền</div></div>
  <div class="lz-step"><div class="lz-k">Mở</div><div class="lz-t">cùng khoá K</div><div class="lz-d">bản mã → bản rõ</div></div>
</div>
<h3>Mã hoá khoá bất đối xứng (khoá công khai)</h3>
<p>Bước đột phá thông minh: mỗi người có một <strong>cặp</strong> khoá — một khoá <em>công khai</em> ai cũng dùng để mã hoá tin nhắn gửi bạn, và một khoá <em>riêng tư</em> chỉ mình bạn giữ để giải mã. Không cần chia sẻ bí mật nào trước.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Mã hoá</div><div class="lz-t">khoá CÔNG KHAI của bạn</div><div class="lz-d">ai cũng khoá được tin gửi bạn</div></div>
  <div class="lz-step"><div class="lz-k">Giải mã</div><div class="lz-t">khoá RIÊNG của bạn</div><div class="lz-d">chỉ bạn mở được</div></div>
</div>
<div class="callout ok">Đây là thứ mà ổ khoá trong trình duyệt (HTTPS) dùng. Mã hoá bất đối xứng giải bài toán chia sẻ khoá và làm cho mua sắm, ngân hàng trực tuyến an toàn khả thi — có thể nói là phát minh khiến web hiện đại đáng tin cậy.</div>
<a class="link-card codelab" href="/code-lab/authentication?ref=%2Fcourses%2Fintroduction-to-computer-science%2Flearn&reflabel=CSI104%20%E2%80%94%20Introduction%20to%20Computer%20Science#module-948" target="_blank" rel="noopener">
  <span class="lc-ico">🔐</span>
  <span class="lc-body"><span class="lc-title">Xem bảo mật trong thực tế</span><span class="lc-sub">Mối đe doạ, băm và kiểm soát truy cập trong hệ thống thật — module "Auth Fundamentals &amp; Threats".</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '12.3 — Privacy, ethics & hackers|||12.3 — Quyền riêng tư, đạo đức & hacker',
          slug: 'csi104-12-3-dao-duc',
          type: 'VIDEO',
          description: 'Trách nhiệm nghề nghiệp và các loại hacker.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 12 · Lesson 12.3</span>
<h2>Being a responsible computing professional</h2>
<p class="lead">Technical power comes with responsibility. As a future engineer you will handle other people&#39;s data and build systems that affect real lives — ethics is part of the job (CQ18.3).</p>
<h3>Privacy</h3>
<p>Every app you build may collect personal data. <strong>Privacy</strong> means collecting only what is needed, protecting it, and being honest about its use. Laws (like GDPR) now enforce this; good engineers respected it before the law required it.</p>
<h3>Types of hackers</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">White-hat</div><div class="lz-ld">Ethical hackers who find and report flaws to help fix them — often paid to do so (penetration testers).</div></div>
  <div class="lz-layer"><div class="lz-lt">Black-hat</div><div class="lz-ld">Criminals who break in for theft, damage or profit — illegal.</div></div>
  <div class="lz-layer"><div class="lz-lt">Grey-hat</div><div class="lz-ld">Somewhere in between — may break rules without malicious intent, still legally risky.</div></div>
</div>
<h3>Professional ethics</h3>
<ul>
  <li>Respect privacy and confidentiality of data you access.</li>
  <li>Do not cause harm; disclose vulnerabilities responsibly.</li>
  <li>Give credit; do not plagiarize code or ideas.</li>
  <li>Be honest about what your software can and cannot do.</li>
</ul>
<div class="note-ct">Course wrap-up: from bits (Ch1–3) through systems (Ch4–5), software thinking (Ch6–8), data (Ch9–11), and finally responsibility (Ch12), you now hold the full map of computer science. Every future course zooms into one region — but you will never be lost, because you have seen the whole territory.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 12 · Bài 12.3</span>
<h2>Trở thành người làm nghề máy tính có trách nhiệm</h2>
<p class="lead">Quyền lực kỹ thuật đi kèm trách nhiệm. Là một kỹ sư tương lai, bạn sẽ xử lý dữ liệu của người khác và xây hệ thống ảnh hưởng tới cuộc sống thật — đạo đức là một phần của nghề (CQ18.3).</p>
<h3>Quyền riêng tư</h3>
<p>Mọi app bạn xây có thể thu thập dữ liệu cá nhân. <strong>Quyền riêng tư</strong> nghĩa là chỉ thu những gì cần, bảo vệ nó, và trung thực về việc sử dụng. Luật (như GDPR) giờ cưỡng chế điều này; kỹ sư tốt đã tôn trọng nó trước cả khi luật yêu cầu.</p>
<h3>Các loại hacker</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Mũ trắng (white-hat)</div><div class="lz-ld">Hacker có đạo đức tìm và báo lỗ hổng để giúp vá — thường được trả tiền để làm (kiểm thử xâm nhập).</div></div>
  <div class="lz-layer"><div class="lz-lt">Mũ đen (black-hat)</div><div class="lz-ld">Tội phạm đột nhập để trộm, phá hoặc trục lợi — phi pháp.</div></div>
  <div class="lz-layer"><div class="lz-lt">Mũ xám (grey-hat)</div><div class="lz-ld">Ở giữa — có thể phá luật mà không có ý xấu, vẫn rủi ro pháp lý.</div></div>
</div>
<h3>Đạo đức nghề nghiệp</h3>
<ul>
  <li>Tôn trọng quyền riêng tư và bí mật của dữ liệu bạn truy cập.</li>
  <li>Không gây hại; công bố lỗ hổng một cách có trách nhiệm.</li>
  <li>Ghi công; không đạo code hay ý tưởng.</li>
  <li>Trung thực về việc phần mềm của bạn làm được và không làm được gì.</li>
</ul>
<div class="note-ct">Tổng kết môn: từ bit (Ch1–3) qua hệ thống (Ch4–5), tư duy phần mềm (Ch6–8), dữ liệu (Ch9–11), và cuối cùng là trách nhiệm (Ch12), giờ bạn nắm trọn bản đồ khoa học máy tính. Mọi môn sau này phóng to vào một vùng — nhưng bạn sẽ không bao giờ lạc, vì đã thấy toàn bộ lãnh thổ.</div>
</div>
`,
        },
        {
          title: 'Chapter 12 Quiz|||Quiz chương 12',
          slug: 'csi104-quiz-ch12',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: CIA, mã hoá, quyền riêng tư, hacker.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'The CIA triad stands for…|||Bộ ba CIA là viết tắt của…', options: ['Control, Internet, Access|||Điều khiển, Internet, Truy cập', 'Confidentiality, Integrity, Availability|||Bảo mật, Toàn vẹn, Sẵn sàng', 'Compile, Interpret, Assemble|||Biên dịch, Thông dịch, Hợp dịch', 'Cache, Index, Address|||Cache, Chỉ mục, Địa chỉ'], correctIndex: 1, points: 1 },
              { question: 'A denial-of-service attack mainly threatens which goal?|||Tấn công từ chối dịch vụ chủ yếu đe doạ mục tiêu nào?', options: ['Confidentiality|||Bảo mật', 'Integrity|||Toàn vẹn', 'Availability|||Sẵn sàng', 'None|||Không cái nào'], correctIndex: 2, points: 1 },
              { question: 'In symmetric-key encryption…|||Trong mã hoá khoá đối xứng…', options: ['the same key locks and unlocks the data|||cùng một khoá khoá và mở dữ liệu', 'two different keys are used|||dùng hai khoá khác nhau', 'no key is needed|||không cần khoá', 'only public keys are used|||chỉ dùng khoá công khai'], correctIndex: 0, points: 1 },
              { question: 'With public-key (asymmetric) encryption, a message encrypted with your public key can be decrypted only with…|||Với mã hoá khoá công khai (bất đối xứng), tin mã hoá bằng khoá công khai của bạn chỉ giải được bằng…', options: ['the same public key|||cùng khoá công khai đó', 'your private key|||khoá riêng của bạn', 'any key|||bất kỳ khoá nào', 'no key|||không khoá nào'], correctIndex: 1, points: 1 },
              { question: 'A white-hat hacker is someone who…|||Một hacker mũ trắng là người…', options: ['steals data for profit|||trộm dữ liệu để trục lợi', 'finds and reports flaws to help fix them|||tìm và báo lỗ hổng để giúp vá', 'writes viruses|||viết virus', 'shuts down websites|||đánh sập website'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 3 ══════════════════ */
    {
      title: 'Progress Test 3 (review CLO10–12)|||Progress Test 3 (ôn CLO10–12)',
      description: 'Ôn cuối kỳ: cấu trúc tệp, cơ sở dữ liệu, bảo mật & đạo đức.',
      lessons: [
        {
          title: 'Progress Test 3 — mixed review|||Progress Test 3 — ôn tổng hợp',
          slug: 'csi104-progress-test-3',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 10–12.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'A .txt file is a…|||Tệp .txt là một…', options: ['binary file|||tệp binary', 'text file|||tệp text', 'database|||cơ sở dữ liệu', 'compiled program|||chương trình đã biên dịch'], correctIndex: 1, points: 1 },
              { question: 'Which access method computes a record address directly from its key?|||Phương thức truy cập nào tính thẳng địa chỉ bản ghi từ khoá của nó?', options: ['Sequential|||Tuần tự', 'Indexed|||Chỉ mục', 'Hashed|||Băm', 'Random|||Ngẫu nhiên'], correctIndex: 2, points: 1 },
              { question: 'In a relational table, one row represents…|||Trong một bảng quan hệ, một hàng biểu diễn…', options: ['one field|||một trường', 'one record|||một bản ghi', 'the whole database|||cả cơ sở dữ liệu', 'a query|||một truy vấn'], correctIndex: 1, points: 1 },
              { question: 'Normalization mainly reduces…|||Chuẩn hoá chủ yếu giảm…', options: ['security|||bảo mật', 'redundancy|||dư thừa', 'the number of tables to zero|||số bảng về 0', 'query speed|||tốc độ truy vấn'], correctIndex: 1, points: 1 },
              { question: 'Encrypting data mainly protects which security goal?|||Mã hoá dữ liệu chủ yếu bảo vệ mục tiêu bảo mật nào?', options: ['Availability|||Sẵn sàng', 'Confidentiality|||Bảo mật', 'Speed|||Tốc độ', 'Compression|||Nén'], correctIndex: 1, points: 1 },
              { question: 'Responsible handling of personal data is called…|||Xử lý dữ liệu cá nhân có trách nhiệm gọi là…', options: ['overflow|||tràn số', 'privacy|||quyền riêng tư', 'recursion|||đệ quy', 'caching|||lưu đệm'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 1 — LOGIC SỐ & CỔNG LOGIC ══════════════════ */
    {
      title: 'Advanced 1 — Boolean logic & digital gates|||Nâng cao 1 — Logic Boole & cổng logic',
      description: 'Ngoài giáo trình: cách các bit trở thành mạch điện tính toán được.',
      lessons: [
        {
          title: 'N1.1 — Logic gates & building an adder|||N1.1 — Cổng logic & xây bộ cộng',
          slug: 'csi104-n1-1-cong-logic',
          type: 'VIDEO',
          description: 'Từ AND/OR/NOT tới mạch cộng — nối Chương 1 và Chương 3.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 1 · Lesson N1.1</span>
<h2>How do bits actually compute? Logic gates</h2>
<p class="lead">Chapters 1 and 3 said the ALU adds numbers, but <em>how</em>? The answer is <strong>logic gates</strong> — tiny electronic circuits that implement the Boolean operations AND, OR, NOT you met in Chapter 3. This is the bridge from physics to computation.</p>
<p>A gate takes one or two input bits (as voltages) and produces an output bit, following a fixed rule. They are built from transistors — the switches from Chapter 2.</p>
<table>
  <thead><tr><th>Gate</th><th>Symbol idea</th><th>Output is 1 when</th></tr></thead>
  <tbody>
    <tr><td>AND</td><td>A · B</td><td>both inputs are 1</td></tr>
    <tr><td>OR</td><td>A + B</td><td>at least one input is 1</td></tr>
    <tr><td>NOT</td><td>¬A</td><td>the input is 0</td></tr>
    <tr><td>XOR</td><td>A ⊕ B</td><td>the inputs differ</td></tr>
  </tbody>
</table>
<h3>Building a half-adder — 1 + 1 in circuits</h3>
<p>Add two bits A and B. The result has a <em>sum</em> bit and a <em>carry</em> bit. Look closely: the sum is exactly XOR, and the carry is exactly AND.</p>
<table>
  <thead><tr><th>A</th><th>B</th><th>Sum (A XOR B)</th><th>Carry (A AND B)</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>0</td><td>1</td><td>1</td><td>0</td></tr>
    <tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
    <tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
  </tbody>
</table>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Inputs</div><div class="lz-t">A, B</div><div class="lz-d">two bits</div></div>
  <div class="lz-step"><div class="lz-k">XOR gate</div><div class="lz-t">→ Sum</div><div class="lz-d">the result bit</div></div>
  <div class="lz-step"><div class="lz-k">AND gate</div><div class="lz-t">→ Carry</div><div class="lz-d">overflow to next column</div></div>
</div>
<div class="callout ok">This is the profound idea: from just a handful of gate types, wired in the right patterns, you can build an adder, then a full ALU, then a CPU. A computer is Boolean logic made physical — millions of these gates switching billions of times a second.</div>
<div class="note-ct">Chapter 3 gave you AND/OR/NOT as operations on data; here you see they are also the literal building blocks of the hardware doing the computing. Same logic, two levels. CEA201 (Computer Organization) explores this in depth.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 1 · Bài N1.1</span>
<h2>Các bit thực sự tính toán thế nào? Cổng logic</h2>
<p class="lead">Chương 1 và 3 nói ALU cộng số, nhưng <em>bằng cách nào</em>? Câu trả lời là <strong>cổng logic (logic gate)</strong> — những mạch điện tí hon hiện thực các phép Boole AND, OR, NOT bạn gặp ở Chương 3. Đây là cầu nối từ vật lý tới tính toán.</p>
<p>Một cổng nhận một hoặc hai bit vào (dưới dạng điện áp) và cho một bit ra, theo một quy tắc cố định. Chúng được xây từ transistor — các công tắc ở Chương 2.</p>
<table>
  <thead><tr><th>Cổng</th><th>Ký hiệu</th><th>Ra 1 khi</th></tr></thead>
  <tbody>
    <tr><td>AND</td><td>A · B</td><td>cả hai đầu vào là 1</td></tr>
    <tr><td>OR</td><td>A + B</td><td>ít nhất một đầu vào là 1</td></tr>
    <tr><td>NOT</td><td>¬A</td><td>đầu vào là 0</td></tr>
    <tr><td>XOR</td><td>A ⊕ B</td><td>hai đầu vào khác nhau</td></tr>
  </tbody>
</table>
<h3>Xây bộ nửa cộng (half-adder) — 1 + 1 bằng mạch</h3>
<p>Cộng hai bit A và B. Kết quả có một bit <em>tổng</em> và một bit <em>nhớ</em>. Nhìn kỹ: tổng chính là XOR, và nhớ chính là AND.</p>
<table>
  <thead><tr><th>A</th><th>B</th><th>Tổng (A XOR B)</th><th>Nhớ (A AND B)</th></tr></thead>
  <tbody>
    <tr><td>0</td><td>0</td><td>0</td><td>0</td></tr>
    <tr><td>0</td><td>1</td><td>1</td><td>0</td></tr>
    <tr><td>1</td><td>0</td><td>1</td><td>0</td></tr>
    <tr><td>1</td><td>1</td><td>0</td><td>1</td></tr>
  </tbody>
</table>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Vào</div><div class="lz-t">A, B</div><div class="lz-d">hai bit</div></div>
  <div class="lz-step"><div class="lz-k">Cổng XOR</div><div class="lz-t">→ Tổng</div><div class="lz-d">bit kết quả</div></div>
  <div class="lz-step"><div class="lz-k">Cổng AND</div><div class="lz-t">→ Nhớ</div><div class="lz-d">tràn sang cột kế</div></div>
</div>
<div class="callout ok">Đây là ý tưởng sâu sắc: chỉ từ vài loại cổng, đấu theo đúng mẫu, bạn xây được bộ cộng, rồi một ALU đầy đủ, rồi một CPU. Máy tính là logic Boole được vật lý hoá — hàng triệu cổng như vậy chuyển mạch hàng tỷ lần mỗi giây.</div>
<div class="note-ct">Chương 3 cho bạn AND/OR/NOT như các phép trên dữ liệu; ở đây bạn thấy chúng cũng là viên gạch xây phần cứng đang tính toán. Cùng logic, hai tầng. CEA201 (Tổ chức máy tính) đào sâu điều này.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 2 — BIG-O & HIỆU QUẢ THUẬT TOÁN ══════════════════ */
    {
      title: 'Advanced 2 — Big-O & algorithm efficiency|||Nâng cao 2 — Big-O & hiệu quả thuật toán',
      description: 'Ngoài giáo trình: đo tốc độ thuật toán và vì sao n² vs n·log n thay đổi mọi thứ.',
      lessons: [
        {
          title: 'N2.1 — Measuring algorithm speed with Big-O|||N2.1 — Đo tốc độ thuật toán bằng Big-O',
          slug: 'csi104-n2-1-big-o',
          type: 'VIDEO',
          description: 'Cách so sánh thuật toán không phụ thuộc máy — nối Chương 6.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 2 · Lesson N2.1</span>
<h2>Which algorithm is faster? Big-O notation</h2>
<p class="lead">Chapter 6 showed binary search crushes linear search. <strong>Big-O notation</strong> is how computer scientists express that difference precisely — it measures how an algorithm&#39;s work <em>grows</em> as the input gets bigger, ignoring machine speed.</p>
<p>The idea: do not count seconds (that depends on the computer). Count how the number of steps <strong>scales</strong> with input size n.</p>
<table>
  <thead><tr><th>Big-O</th><th>Name</th><th>Example</th><th>Steps for n = 1,000,000</th></tr></thead>
  <tbody>
    <tr><td>O(1)</td><td>Constant</td><td>Array access by index</td><td>1</td></tr>
    <tr><td>O(log n)</td><td>Logarithmic</td><td>Binary search</td><td>~20</td></tr>
    <tr><td>O(n)</td><td>Linear</td><td>Linear search</td><td>1,000,000</td></tr>
    <tr><td>O(n log n)</td><td>Linearithmic</td><td>Good sorts (merge, quick)</td><td>~20,000,000</td></tr>
    <tr><td>O(n²)</td><td>Quadratic</td><td>Bubble/selection sort</td><td>1,000,000,000,000</td></tr>
  </tbody>
</table>
<h3>Why this matters enormously</h3>
<p>Look at the last column. For a million items, an O(n²) sort needs a <em>trillion</em> steps while an O(n log n) sort needs twenty million — fifty thousand times fewer. On real data the difference is between "instant" and "your program never finishes".</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Small n</div><div class="lz-t">barely matters</div><div class="lz-d">all algorithms feel fast</div></div>
  <div class="lz-step"><div class="lz-k">Big n</div><div class="lz-t">everything</div><div class="lz-d">the growth rate dominates</div></div>
  <div class="lz-step"><div class="lz-k">Lesson</div><div class="lz-t">choose wisely</div><div class="lz-d">a better algorithm beats a faster computer</div></div>
</div>
<div class="callout ok">This is why Chapter 6 said "how you solve it matters as much as whether you solve it". A clever O(n log n) algorithm on a cheap laptop will crush a brute-force O(n²) on a supercomputer, once n is large. Algorithm design beats raw hardware.</div>
<div class="note-ct">You will formalize Big-O in CSD201 (Data Structures &amp; Algorithms). For now, keep the intuition: Big-O describes the <em>shape</em> of an algorithm&#39;s growth, and picking a lower-order algorithm is often the single biggest speed-up available.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 2 · Bài N2.1</span>
<h2>Thuật toán nào nhanh hơn? Ký hiệu Big-O</h2>
<p class="lead">Chương 6 cho thấy tìm nhị phân đè bẹp tìm tuyến tính. <strong>Ký hiệu Big-O</strong> là cách nhà khoa học máy tính diễn đạt khác biệt đó một cách chính xác — nó đo lượng việc của thuật toán <em>tăng</em> ra sao khi đầu vào lớn dần, bỏ qua tốc độ máy.</p>
<p>Ý tưởng: đừng đếm giây (tùy máy). Hãy đếm số bước <strong>tỷ lệ</strong> thế nào với kích thước đầu vào n.</p>
<table>
  <thead><tr><th>Big-O</th><th>Tên</th><th>Ví dụ</th><th>Số bước cho n = 1.000.000</th></tr></thead>
  <tbody>
    <tr><td>O(1)</td><td>Hằng số</td><td>Truy cập mảng theo chỉ số</td><td>1</td></tr>
    <tr><td>O(log n)</td><td>Logarit</td><td>Tìm nhị phân</td><td>~20</td></tr>
    <tr><td>O(n)</td><td>Tuyến tính</td><td>Tìm tuyến tính</td><td>1.000.000</td></tr>
    <tr><td>O(n log n)</td><td>Tuyến-logarit</td><td>Sắp xếp tốt (merge, quick)</td><td>~20.000.000</td></tr>
    <tr><td>O(n²)</td><td>Bậc hai</td><td>Bubble/selection sort</td><td>1.000.000.000.000</td></tr>
  </tbody>
</table>
<h3>Vì sao điều này cực kỳ quan trọng</h3>
<p>Nhìn cột cuối. Với một triệu phần tử, một sort O(n²) cần một <em>nghìn tỷ</em> bước trong khi sort O(n log n) cần hai mươi triệu — ít hơn năm mươi nghìn lần. Trên dữ liệu thật, khác biệt là giữa "tức thì" và "chương trình chạy mãi không xong".</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">n nhỏ</div><div class="lz-t">hầu như không quan trọng</div><div class="lz-d">mọi thuật toán đều thấy nhanh</div></div>
  <div class="lz-step"><div class="lz-k">n lớn</div><div class="lz-t">tất cả</div><div class="lz-d">tốc độ tăng trưởng thống trị</div></div>
  <div class="lz-step"><div class="lz-k">Bài học</div><div class="lz-t">chọn khôn ngoan</div><div class="lz-d">thuật toán tốt hơn thắng máy nhanh hơn</div></div>
</div>
<div class="callout ok">Đây là lý do Chương 6 nói "cách bạn giải quan trọng ngang việc có giải được hay không". Một thuật toán O(n log n) khôn khéo trên laptop rẻ sẽ đè bẹp cách vét cạn O(n²) trên siêu máy tính, một khi n lớn. Thiết kế thuật toán thắng phần cứng thô.</div>
<div class="note-ct">Bạn sẽ hình thức hoá Big-O ở CSD201 (Cấu trúc dữ liệu &amp; Giải thuật). Giờ hãy giữ trực giác: Big-O mô tả <em>hình dạng</em> tăng trưởng của thuật toán, và chọn thuật toán bậc thấp hơn thường là cú tăng tốc lớn nhất có thể.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 3 — TỪ CODE TỚI CHẠY ══════════════════ */
    {
      title: 'Advanced 3 — From source code to a running program|||Nâng cao 3 — Từ mã nguồn tới chương trình đang chạy',
      description: 'Ngoài giáo trình: đường ống biên dịch đầy đủ — nối Chương 1, 5 và 7.',
      lessons: [
        {
          title: 'N3.1 — The compilation pipeline|||N3.1 — Đường ống biên dịch',
          slug: 'csi104-n3-1-duong-ong-bien-dich',
          type: 'VIDEO',
          description: 'Bốn bước biến một file .c thành tiến trình đang chạy trong bộ nhớ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 3 · Lesson N3.1</span>
<h2>What really happens when you "run a program"</h2>
<p class="lead">Chapter 7 said a compiler turns source into machine code. In reality it is a <strong>pipeline</strong> of stages. Understanding it demystifies compiler errors and ties together the machine (Ch1), the OS (Ch5) and languages (Ch7).</p>
<div class="lz-map">
  <div class="lz-stage">From text file to running process</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Preprocess</div><div class="lz-nsub">Handle directives like #include and #define — paste in headers, expand macros</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Compile</div><div class="lz-nsub">Translate the C source into assembly for your CPU</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Assemble</div><div class="lz-nsub">Turn assembly into machine-code object files (.o)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Link</div><div class="lz-nsub">Combine object files + libraries into one executable</div></div></div>
  <div class="lz-stage">Then the OS steps in</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Load &amp; run</div><div class="lz-nsub">The OS loads the executable into memory as a process; the CPU begins fetch-decode-execute</div></div></div>
</div>
<h3>Why errors appear at different stages</h3>
<ul>
  <li>A missing <code>;</code> is a <strong>compile</strong> error — caught at stage 2.</li>
  <li>Calling a function you never defined is a <strong>link</strong> error — caught at stage 4 ("undefined reference").</li>
  <li>A crash from a bad pointer is a <strong>runtime</strong> error — happens at stage 5, while running.</li>
</ul>
<div class="callout ok">Now the pieces connect: your C source (Ch7) becomes machine code, the linker assembles the final program, the OS (Ch5) loads it as a process into the memory hierarchy (Ch1), and the CPU runs the fetch-decode-execute cycle (Ch1). One "click to run" quietly touches every chapter of this course.</div>
<div class="note-ct">This is exactly the machinery behind PRF192&#39;s "compile and run". When a build fails, knowing <em>which stage</em> failed tells you where to look — a skill you will use for your entire career.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 3 · Bài N3.1</span>
<h2>Điều thực sự xảy ra khi bạn "chạy một chương trình"</h2>
<p class="lead">Chương 7 nói trình biên dịch biến mã nguồn thành mã máy. Thực tế đó là một <strong>đường ống (pipeline)</strong> gồm nhiều bước. Hiểu nó làm sáng tỏ các lỗi biên dịch và buộc lại với nhau cỗ máy (Ch1), hệ điều hành (Ch5) và ngôn ngữ (Ch7).</p>
<div class="lz-map">
  <div class="lz-stage">Từ tệp văn bản tới tiến trình đang chạy</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tiền xử lý (preprocess)</div><div class="lz-nsub">Xử lý chỉ thị như #include và #define — dán header vào, khai triển macro</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Biên dịch (compile)</div><div class="lz-nsub">Dịch mã nguồn C sang hợp ngữ cho CPU của bạn</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Hợp dịch (assemble)</div><div class="lz-nsub">Biến hợp ngữ thành tệp đối tượng mã máy (.o)</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Liên kết (link)</div><div class="lz-nsub">Ghép các tệp đối tượng + thư viện thành một tệp thực thi</div></div></div>
  <div class="lz-stage">Rồi hệ điều hành vào cuộc</div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Nạp &amp; chạy</div><div class="lz-nsub">OS nạp tệp thực thi vào bộ nhớ thành một tiến trình; CPU bắt đầu nạp-giải mã-thực thi</div></div></div>
</div>
<h3>Vì sao lỗi xuất hiện ở các bước khác nhau</h3>
<ul>
  <li>Thiếu <code>;</code> là lỗi <strong>biên dịch</strong> — bắt ở bước 2.</li>
  <li>Gọi một hàm bạn chưa định nghĩa là lỗi <strong>liên kết</strong> — bắt ở bước 4 ("undefined reference").</li>
  <li>Sập máy vì con trỏ sai là lỗi <strong>lúc chạy (runtime)</strong> — xảy ra ở bước 5, khi đang chạy.</li>
</ul>
<div class="callout ok">Giờ các mảnh ghép nối lại: mã nguồn C của bạn (Ch7) thành mã máy, trình liên kết ghép chương trình cuối, OS (Ch5) nạp nó thành một tiến trình vào phân cấp bộ nhớ (Ch1), và CPU chạy chu trình nạp-giải mã-thực thi (Ch1). Một cú "bấm chạy" lặng lẽ chạm vào mọi chương của môn này.</div>
<div class="note-ct">Đây đúng là bộ máy đằng sau "biên dịch và chạy" của PRF192. Khi build lỗi, biết <em>bước nào</em> hỏng cho bạn biết chỗ cần xem — một kỹ năng bạn dùng suốt sự nghiệp.</div>
</div>
`,
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 4 — MÁY TÍNH HIỆN ĐẠI (CAPSTONE) ══════════════════ */
    {
      title: 'Advanced 4 — Modern computing: virtualization, cloud & AI|||Nâng cao 4 — Máy tính hiện đại: ảo hoá, đám mây & AI',
      description: 'Ngoài giáo trình — bài tổng kết: các khái niệm cũ mở rộng thành thế giới điện toán ngày nay.',
      lessons: [
        {
          title: 'N4.1 — How the whole map scales to today|||N4.1 — Cả bản đồ mở rộng tới hôm nay ra sao',
          slug: 'csi104-n4-1-may-tinh-hien-dai',
          type: 'VIDEO',
          description: 'Ảo hoá, container, đám mây và AI — nối mọi chương lại với hiện tại.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 4 · Lesson N4.1</span>
<h2>The same ideas, at planet scale</h2>
<p class="lead">Everything in CSI104 was the foundation. Modern computing is these same concepts stretched to huge scale. This capstone connects your new map to the technology running the world today.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Virtualization</div><div class="lz-ld">One physical machine pretends to be many. A "virtual machine" is a whole computer (OS + apps) running as software on another — the OS resource-management ideas of Chapter 5 taken one level up.</div></div>
  <div class="lz-layer"><div class="lz-lt">Containers</div><div class="lz-ld">A lighter way to package an app with everything it needs, so it runs identically anywhere. This very Academy runs in containers (Docker) on a server.</div></div>
  <div class="lz-layer"><div class="lz-lt">Cloud computing</div><div class="lz-ld">Renting computers, storage and databases over the network (Chapter 4) instead of owning them. The client-server and networking ideas, at industrial scale.</div></div>
  <div class="lz-layer"><div class="lz-lt">Artificial Intelligence</div><div class="lz-ld">Programs that learn patterns from data instead of following only hand-written rules — built on algorithms (Ch6), data structures (Ch9) and massive parallel hardware (Ch1).</div></div>
</div>
<h3>Trace one modern action back to CSI104</h3>
<p>When you ask an AI chatbot a question, look how every chapter appears:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">You type</div><div class="lz-t">text → bits</div><div class="lz-d">Ch2–3 encoding</div></div>
  <div class="lz-step"><div class="lz-k">Travels</div><div class="lz-t">packets → cloud</div><div class="lz-d">Ch4 networking</div></div>
  <div class="lz-step"><div class="lz-k">Server</div><div class="lz-t">OS + GPUs run a model</div><div class="lz-d">Ch1, Ch5, Ch6</div></div>
  <div class="lz-step"><div class="lz-k">Answer</div><div class="lz-t">bits → text back</div><div class="lz-d">Ch3, safely (Ch12)</div></div>
</div>
<div class="callout ok">You have finished the map. From a single bit to a global AI service, every layer is something you now understand at a conceptual level. As you move through PRO192, DBI202, NWC203c, OSG202 and beyond, you are not learning disconnected subjects — you are deepening regions of this one territory.</div>
<div class="note-ct">Congratulations on completing CSI104. Keep the big picture: computers store everything as bits, process them with logic, organize them with structures, connect them over networks, and it is all managed by software you can learn to build. Everything else is detail — and now you know where each detail lives.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 4 · Bài N4.1</span>
<h2>Cùng những ý tưởng, ở quy mô hành tinh</h2>
<p class="lead">Mọi thứ trong CSI104 là nền tảng. Máy tính hiện đại là chính những khái niệm này kéo giãn tới quy mô khổng lồ. Bài tổng kết này nối tấm bản đồ mới của bạn với công nghệ đang vận hành thế giới hôm nay.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Ảo hoá (virtualization)</div><div class="lz-ld">Một máy vật lý giả làm nhiều máy. Một "máy ảo" là cả một máy tính (OS + app) chạy dưới dạng phần mềm trên một máy khác — ý tưởng quản lý tài nguyên OS ở Chương 5 nâng thêm một tầng.</div></div>
  <div class="lz-layer"><div class="lz-lt">Container</div><div class="lz-ld">Cách đóng gói nhẹ hơn một app cùng mọi thứ nó cần, để chạy giống hệt ở bất cứ đâu. Chính Academy này chạy trong container (Docker) trên một máy chủ.</div></div>
  <div class="lz-layer"><div class="lz-lt">Điện toán đám mây</div><div class="lz-ld">Thuê máy tính, lưu trữ và cơ sở dữ liệu qua mạng (Chương 4) thay vì sở hữu chúng. Ý tưởng client-server và mạng, ở quy mô công nghiệp.</div></div>
  <div class="lz-layer"><div class="lz-lt">Trí tuệ nhân tạo (AI)</div><div class="lz-ld">Chương trình học mẫu từ dữ liệu thay vì chỉ theo luật viết tay — xây trên thuật toán (Ch6), cấu trúc dữ liệu (Ch9) và phần cứng song song khổng lồ (Ch1).</div></div>
</div>
<h3>Lần theo một hành động hiện đại về CSI104</h3>
<p>Khi bạn hỏi một chatbot AI, hãy xem mọi chương xuất hiện thế nào:</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Bạn gõ</div><div class="lz-t">chữ → bit</div><div class="lz-d">Ch2–3 mã hoá</div></div>
  <div class="lz-step"><div class="lz-k">Đi</div><div class="lz-t">gói tin → đám mây</div><div class="lz-d">Ch4 mạng</div></div>
  <div class="lz-step"><div class="lz-k">Máy chủ</div><div class="lz-t">OS + GPU chạy mô hình</div><div class="lz-d">Ch1, Ch5, Ch6</div></div>
  <div class="lz-step"><div class="lz-k">Trả lời</div><div class="lz-t">bit → chữ trở về</div><div class="lz-d">Ch3, an toàn (Ch12)</div></div>
</div>
<div class="callout ok">Bạn đã hoàn thành tấm bản đồ. Từ một bit đơn lẻ tới một dịch vụ AI toàn cầu, mọi tầng là thứ bạn giờ đã hiểu ở mức khái niệm. Khi đi qua PRO192, DBI202, NWC203c, OSG202 và xa hơn, bạn không học các môn rời rạc — bạn đang đào sâu từng vùng của một lãnh thổ duy nhất này.</div>
<div class="note-ct">Chúc mừng bạn hoàn thành CSI104. Hãy giữ bức tranh lớn: máy tính lưu mọi thứ thành bit, xử lý bằng logic, tổ chức bằng cấu trúc, kết nối qua mạng, và tất cả được quản lý bởi phần mềm mà bạn có thể học để xây. Mọi thứ khác chỉ là chi tiết — và giờ bạn biết mỗi chi tiết nằm ở đâu.</div>
</div>
`,
        },
      ],
    },
  ],
};
