/**
 * PRO192 — Object-Oriented Programming (Lập trình hướng đối tượng, Java). Kỳ 2.
 * Bám syllabus FPTU (9 CLO, Java + NetBeans) + giáo trình Core Java (Horstmann)
 * + chương nâng cao. Tiên quyết: PRF192.
 * Song ngữ EN/VN realtime (khối .ml-en / .ml-vi, tiêu đề EN|||VI).
 * Code Java dùng <pre> + .tok-* + .out; sơ đồ .lz-map/.lz-flow/.lz-stack.
 * Luyện code → CodeLab track java-core; cài đặt JDK/NetBeans → Exp Hub.
 * Seed: node scripts/academy-seed-course.mjs --file ./content/academy/PRO192.mjs --apply
 */
export default {
  semester: { code: 'KY2', name: 'Kỳ 2', ordinal: 2 },
  course: {
    courseCode: 'PRO192',
    slug: 'object-oriented-programming',
    title: 'Object-Oriented Programming',
    level: 'BEGINNER',
    language: 'Vietnamese',
    status: 'PUBLISHED',
    shortDescription: 'Think in objects, not just steps: Java classes, the four OOP pillars (encapsulation, inheritance, polymorphism, abstraction), interfaces, exceptions, collections and file I/O — the leap from PRF192 to real software.|||Tư duy bằng đối tượng, không chỉ các bước: lớp Java, bốn trụ cột OOP (đóng gói, kế thừa, đa hình, trừu tượng), interface, ngoại lệ, collections và tệp — bước nhảy từ PRF192 tới phần mềm thật.',
    description: 'Môn lập trình thứ hai của ngành, chuyển từ tư duy thủ tục (C, PRF192) sang hướng đối tượng với Java. Học cách mô hình bài toán thành các lớp và đối tượng, áp dụng bốn trụ cột OOP, xử lý ngoại lệ, dùng collections và đọc/ghi tệp. Tiên quyết: PRF192.',
    whatYouLearn: 'Tư duy hướng đối tượng; cú pháp Java; định nghĩa lớp/đối tượng/constructor; đóng gói, kế thừa, đa hình, trừu tượng; abstract class & interface; xử lý ngoại lệ (try/catch); mảng đối tượng & chương trình hoàn chỉnh; Java Collections (List/Set/Map); luồng & đọc/ghi tệp.',
    requirements: 'Tiên quyết: đạt PRF192 (vững hàm, mảng, con trỏ trong C). Cần cài JDK (Java 8+) và NetBeans.',
    documentsNote: 'Giáo trình: Core Java Vol 1 & 2 (Cay Horstmann) · Java 8 Specification (Oracle) · học liệu OOP using Java do FU biên soạn. Công cụ: JDK 8+, NetBeans. Kèm file syllabus gốc PRO192.pdf.',
  },
  sections: [
    /* ══════════════════ MỤC 0 — GIỚI THIỆU & HƯỚNG DẪN HỌC ══════════════════ */
    {
      title: 'Section 0 — Introduction & Study Guide|||Mục 0 — Giới thiệu môn học & Hướng dẫn học',
      description: 'Đọc trước tiên: môn học là gì, học ra sao, điều kiện qua môn, lộ trình và công cụ.',
      lessons: [
        {
          title: '0.1 — About PRO192 & the course map|||0.1 — Giới thiệu PRO192 & bản đồ môn học',
          slug: 'pro192-gioi-thieu',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Từ lập trình thủ tục sang hướng đối tượng, và bản đồ toàn bộ môn học.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.1</span>
<h2>About PRO192 — Object-Oriented Programming</h2>
<p class="lead">In PRF192 you learned to give a computer step-by-step instructions in C. PRO192 teaches a new way to <strong>think</strong>: instead of a long list of steps, you model your problem as a set of <strong>objects</strong> that hold their own data and know how to behave. This is <strong>object-oriented programming (OOP)</strong>, and the language is <strong>Java</strong>.</p>
<p>Why the shift? Real programs get huge. Procedural code becomes a tangle when data and the functions that touch it drift apart. OOP keeps related data and behavior <em>together</em> in objects, making big programs easier to build, reuse and maintain. Almost every large system — Android apps, banking backends, enterprise software — is object-oriented.</p>
<h3>Course map — from Java basics to real OOP</h3>
<div class="lz-map">
  <div class="lz-stage">Getting into Java</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">OO thinking &amp; Java basics</div><div class="lz-nsub">Why objects · Java syntax vs C</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Classes &amp; Objects</div><div class="lz-nsub">Fields · methods · constructors</div></div></div>
  <div class="lz-stage">The four pillars of OOP</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Encapsulation &amp; Abstraction</div><div class="lz-nsub">Hide data · expose a clean interface</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Inheritance &amp; Polymorphism</div><div class="lz-nsub">Reuse &amp; one interface, many forms</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Abstract classes &amp; Interfaces</div><div class="lz-nsub">Contracts for behavior</div></div></div>
  <div class="lz-stage">Robust, complete programs</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Exception handling</div><div class="lz-nsub">try / catch · fail gracefully</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Arrays of objects</div><div class="lz-nsub">A complete management program</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Java Collections</div><div class="lz-nsub">List · Set · Map</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Streams &amp; File I/O</div><div class="lz-nsub">Read/write data to files</div></div></div>
  <div class="lz-stage">Advanced · beyond the syllabus</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Generics &amp; lambdas · design principles (SOLID)</div><div class="lz-nsub">Toward professional Java</div></div></div>
</div>
<p>PRO192 is the prerequisite mindset for <span class="badge">LAB211</span>, <span class="badge">PRJ301</span> (Java web) and every later software course. Where PRF192 made you a programmer, PRO192 makes you a <em>software designer</em>.</p>
<div class="callout ok">OOP clicks through practice, not reading. For every concept, write a small class and run it. The examples here are short on purpose — retype them in NetBeans and experiment.</div>
<a class="link-card exphub" href="/exp-hub/pro192-cai-dat-java-netbeans?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Set up Java (JDK) &amp; NetBeans</span><span class="lc-sub">Install guide with official download links — on Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.1</span>
<h2>Giới thiệu PRO192 — Lập trình hướng đối tượng</h2>
<p class="lead">Ở PRF192 bạn học ra lệnh cho máy tính từng bước bằng C. PRO192 dạy một cách <strong>tư duy</strong> mới: thay vì một danh sách bước dài, bạn mô hình bài toán thành một tập <strong>đối tượng (object)</strong> tự giữ dữ liệu của mình và biết cách hành xử. Đây là <strong>lập trình hướng đối tượng (OOP)</strong>, và ngôn ngữ là <strong>Java</strong>.</p>
<p>Vì sao chuyển? Chương trình thật rất lớn. Code thủ tục thành mớ bòng bong khi dữ liệu và các hàm động tới nó tách rời nhau. OOP giữ dữ liệu và hành vi liên quan <em>ở cùng nhau</em> trong đối tượng, làm chương trình lớn dễ xây, tái dùng và bảo trì hơn. Gần như mọi hệ thống lớn — app Android, backend ngân hàng, phần mềm doanh nghiệp — đều hướng đối tượng.</p>
<h3>Bản đồ môn học — từ Java cơ bản tới OOP thật</h3>
<div class="lz-map">
  <div class="lz-stage">Bước vào Java</div>
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Tư duy OO &amp; Java cơ bản</div><div class="lz-nsub">Vì sao đối tượng · cú pháp Java vs C</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Lớp &amp; Đối tượng</div><div class="lz-nsub">Trường · phương thức · constructor</div></div></div>
  <div class="lz-stage">Bốn trụ cột của OOP</div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Đóng gói &amp; Trừu tượng</div><div class="lz-nsub">Giấu dữ liệu · lộ giao diện sạch</div></div></div>
  <div class="lz-node"><div class="lz-badge">4</div><div class="lz-nbody"><div class="lz-ntitle">Kế thừa &amp; Đa hình</div><div class="lz-nsub">Tái dùng &amp; một giao diện, nhiều hình</div></div></div>
  <div class="lz-node"><div class="lz-badge">5</div><div class="lz-nbody"><div class="lz-ntitle">Abstract class &amp; Interface</div><div class="lz-nsub">Hợp đồng cho hành vi</div></div></div>
  <div class="lz-stage">Chương trình bền, hoàn chỉnh</div>
  <div class="lz-node"><div class="lz-badge">6</div><div class="lz-nbody"><div class="lz-ntitle">Xử lý ngoại lệ</div><div class="lz-nsub">try / catch · lỗi mà không sập</div></div></div>
  <div class="lz-node"><div class="lz-badge">7</div><div class="lz-nbody"><div class="lz-ntitle">Mảng đối tượng</div><div class="lz-nsub">Một chương trình quản lý hoàn chỉnh</div></div></div>
  <div class="lz-node"><div class="lz-badge">8</div><div class="lz-nbody"><div class="lz-ntitle">Java Collections</div><div class="lz-nsub">List · Set · Map</div></div></div>
  <div class="lz-node"><div class="lz-badge">9</div><div class="lz-nbody"><div class="lz-ntitle">Luồng &amp; Đọc/ghi tệp</div><div class="lz-nsub">Đọc/ghi dữ liệu ra tệp</div></div></div>
  <div class="lz-stage">Nâng cao · ngoài giáo trình</div>
  <div class="lz-node"><div class="lz-badge">★</div><div class="lz-nbody"><div class="lz-ntitle">Generics &amp; lambda · nguyên tắc thiết kế (SOLID)</div><div class="lz-nsub">Hướng tới Java chuyên nghiệp</div></div></div>
</div>
<p>PRO192 là tư duy tiên quyết cho <span class="badge">LAB211</span>, <span class="badge">PRJ301</span> (Java web) và mọi môn phần mềm sau này. PRF192 biến bạn thành lập trình viên, PRO192 biến bạn thành <em>người thiết kế phần mềm</em>.</p>
<div class="callout ok">OOP "thấm" qua luyện tập, không phải đọc. Với mỗi khái niệm, viết một lớp nhỏ và chạy thử. Ví dụ ở đây cố tình ngắn — gõ lại trong NetBeans và thử nghiệm.</div>
<a class="link-card exphub" href="/exp-hub/pro192-cai-dat-java-netbeans?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài đặt Java (JDK) &amp; NetBeans</span><span class="lc-sub">Hướng dẫn cài kèm link tải chính chủ — trên Exp Hub.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
</div>
`,
        },
        {
          title: '0.2 — Passing requirements & grading|||0.2 — Điều kiện qua môn & cấu trúc điểm',
          slug: 'pro192-dieu-kien-qua-mon',
          type: 'VIDEO',
          isFreePreview: true,
          description: 'Tổng giờ, tiên quyết, điểm sàn qua môn và trọng số từng cột điểm.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.2</span>
<h2>Passing requirements &amp; grading</h2>
<p class="lead">From the official PRO192 syllabus. This is a hands-on coding course — most of the grade is practical work done through the term.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Credits</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Total hours</span><span class="v">150h <small>45h class + practical &amp; final exams + 104h self-study</small></span></div>
  <div class="kv"><span class="k">Prerequisite</span><span class="v">Pass PRF192</span></div>
  <div class="kv"><span class="k">Grading scale</span><span class="v">10 <small>pass when average ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Exam eligibility</span><span class="v">Attend ≥ 80% of slots</span></div>
</div>
<h3>Grade structure</h3>
<table>
  <thead><tr><th>Component</th><th>Weight</th><th>Note</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>20%</td><td>On-going — a larger take-home program</td></tr>
    <tr><td>Lab</td><td>10%</td><td>6 labs, hands-on in class</td></tr>
    <tr><td>Practical Exam</td><td>30%</td><td>85 min coding on a computer</td></tr>
    <tr><td>Progress Test</td><td>10%</td><td>2 tests during the term</td></tr>
    <tr><td>Final Exam</td><td>30%</td><td>60 minutes — must score ≥ 4 to pass</td></tr>
  </tbody>
</table>
<div class="callout warn">Two gates: weighted average ≥ 5.0 AND the final exam ≥ 4.0. Note the <strong>Practical Exam is 30%</strong> — you must code fluently under time pressure. The only preparation that works is writing lots of code yourself, not reading solutions.</div>
<div class="note-ct">40% of your grade (Practical + Labs) is you writing working Java. Treat every lab seriously and build the assignment early. OOP is a skill learned at the keyboard.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.2</span>
<h2>Điều kiện qua môn &amp; cấu trúc điểm</h2>
<p class="lead">Từ syllabus chính thức PRO192. Đây là môn code thực hành — phần lớn điểm là bài thực hành làm suốt kỳ.</p>
<div class="kv-grid">
  <div class="kv"><span class="k">Số tín chỉ</span><span class="v">3</span></div>
  <div class="kv"><span class="k">Tổng giờ</span><span class="v">150h <small>45h học + thi thực hành &amp; cuối kỳ + 104h tự học</small></span></div>
  <div class="kv"><span class="k">Tiên quyết</span><span class="v">Đạt PRF192</span></div>
  <div class="kv"><span class="k">Thang điểm</span><span class="v">10 <small>qua môn khi trung bình ≥ 5.0</small></span></div>
  <div class="kv"><span class="k">Điều kiện dự thi</span><span class="v">Dự ≥ 80% số buổi</span></div>
</div>
<h3>Cấu trúc điểm</h3>
<table>
  <thead><tr><th>Thành phần</th><th>Trọng số</th><th>Ghi chú</th></tr></thead>
  <tbody>
    <tr><td>Assignment</td><td>20%</td><td>Thường xuyên — một chương trình lớn làm ở nhà</td></tr>
    <tr><td>Lab</td><td>10%</td><td>6 bài lab thực hành trên lớp</td></tr>
    <tr><td>Practical Exam (thi thực hành)</td><td>30%</td><td>85 phút code trên máy</td></tr>
    <tr><td>Progress Test</td><td>10%</td><td>2 bài trong kỳ</td></tr>
    <tr><td>Thi cuối kỳ</td><td>30%</td><td>60 phút — phải đạt ≥ 4 mới qua môn</td></tr>
  </tbody>
</table>
<div class="callout warn">Hai cửa: trung bình có trọng số ≥ 5.0 VÀ thi cuối ≥ 4.0. Lưu ý <strong>Practical Exam chiếm 30%</strong> — bạn phải code trôi chảy dưới áp lực thời gian. Cách luyện duy nhất hiệu quả là tự viết thật nhiều code, không phải đọc lời giải.</div>
<div class="note-ct">40% điểm (Practical + Lab) là bạn viết Java chạy được. Hãy làm mọi lab nghiêm túc và bắt đầu assignment sớm. OOP là kỹ năng học ở bàn phím.</div>
</div>
`,
        },
        {
          title: '0.3 — Learning outcomes (9 CLOs)|||0.3 — Chuẩn đầu ra (9 CLO)',
          slug: 'pro192-chuan-dau-ra',
          type: 'VIDEO',
          description: '9 kỹ năng nhà trường cam kết bạn làm được — checklist ôn thi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.3</span>
<h2>The 9 Course Learning Outcomes (CLOs)</h2>
<p class="lead">Each CLO is a concrete Java skill. They map onto the chapters and are your exam checklist.</p>
<table>
  <thead><tr><th>#</th><th>You will be able to…</th><th>Covered in</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Understand OO concepts to solve problems</td><td>Ch 1</td></tr>
    <tr><td>CLO2</td><td>Write Java programs (syntax &amp; semantics)</td><td>Ch 1</td></tr>
    <tr><td>CLO5</td><td>Identify classes, objects, members &amp; relationships</td><td>Ch 2</td></tr>
    <tr><td>CLO6</td><td>Use encapsulation, inheritance, polymorphism, abstraction</td><td>Ch 3–4</td></tr>
    <tr><td>CLO7</td><td>Use abstract classes and interfaces</td><td>Ch 5</td></tr>
    <tr><td>CLO4</td><td>Use Java&#39;s exception-handling mechanism</td><td>Ch 6</td></tr>
    <tr><td>CLO8</td><td>Implement a complete program using object arrays</td><td>Ch 7</td></tr>
    <tr><td>CLO9</td><td>Use collection ADTs (list, set, map)</td><td>Ch 8</td></tr>
    <tr><td>CLO3</td><td>Use streams to read/write data</td><td>Ch 9</td></tr>
  </tbody>
</table>
<div class="note-ct">Every CLO is demonstrated by writing code. The best revision is building small programs for each — not memorizing definitions.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.3</span>
<h2>9 Chuẩn đầu ra môn học (CLO)</h2>
<p class="lead">Mỗi CLO là một kỹ năng Java cụ thể. Chúng khớp với các chương và là checklist ôn thi của bạn.</p>
<table>
  <thead><tr><th>#</th><th>Bạn sẽ làm được…</th><th>Học ở</th></tr></thead>
  <tbody>
    <tr><td>CLO1</td><td>Hiểu các khái niệm OO để giải quyết vấn đề</td><td>Ch 1</td></tr>
    <tr><td>CLO2</td><td>Viết chương trình Java (cú pháp &amp; ngữ nghĩa)</td><td>Ch 1</td></tr>
    <tr><td>CLO5</td><td>Nhận diện lớp, đối tượng, thành viên &amp; quan hệ</td><td>Ch 2</td></tr>
    <tr><td>CLO6</td><td>Dùng đóng gói, kế thừa, đa hình, trừu tượng</td><td>Ch 3–4</td></tr>
    <tr><td>CLO7</td><td>Dùng abstract class và interface</td><td>Ch 5</td></tr>
    <tr><td>CLO4</td><td>Dùng cơ chế xử lý ngoại lệ của Java</td><td>Ch 6</td></tr>
    <tr><td>CLO8</td><td>Cài đặt một chương trình hoàn chỉnh dùng mảng đối tượng</td><td>Ch 7</td></tr>
    <tr><td>CLO9</td><td>Dùng các ADT collection (list, set, map)</td><td>Ch 8</td></tr>
    <tr><td>CLO3</td><td>Dùng luồng (stream) để đọc/ghi dữ liệu</td><td>Ch 9</td></tr>
  </tbody>
</table>
<div class="note-ct">Mỗi CLO được thể hiện bằng viết code. Ôn tập tốt nhất là xây chương trình nhỏ cho từng cái — không phải học thuộc định nghĩa.</div>
</div>
`,
        },
        {
          title: '0.4 — Materials, tools & how to study|||0.4 — Tài liệu, công cụ & cách học',
          slug: 'pro192-tai-lieu',
          type: 'VIDEO',
          description: 'Giáo trình Core Java, cài JDK/NetBeans và cách học OOP hiệu quả.',
          content: `
<div class="ml-en">
<span class="eyebrow">Section 0 · Lesson 0.4</span>
<h2>Materials, tools &amp; how to study</h2>
<h3>Textbooks</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Core Java Volume 1 &amp; 2 — Cay Horstmann</div><div class="lz-ld">The definitive practical Java reference. Volume 1 covers the fundamentals you need here.</div></div>
  <div class="lz-layer"><div class="lz-lt">Java 8 Specification (Oracle)</div><div class="lz-ld">The authoritative source when you need the exact rule.</div></div>
  <div class="lz-layer"><div class="lz-lt">FU "OOP using Java" materials</div><div class="lz-ld">The course-aligned learning resource.</div></div>
</div>
<h3>Tools you need</h3>
<ul>
  <li><strong>JDK (Java Development Kit) 8+</strong> — the compiler and runtime for Java.</li>
  <li><strong>NetBeans</strong> — the IDE the course uses; a modern editor with build/run/debug built in.</li>
</ul>
<h3>How to study OOP effectively</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Model</div><div class="lz-t">what objects?</div><div class="lz-d">nouns → classes</div></div>
  <div class="lz-step"><div class="lz-k">Code</div><div class="lz-t">write the class</div><div class="lz-d">and a main to test it</div></div>
  <div class="lz-step"><div class="lz-k">Run</div><div class="lz-t">see it work</div><div class="lz-d">debug &amp; fix</div></div>
  <div class="lz-step"><div class="lz-k">Refine</div><div class="lz-t">improve the design</div><div class="lz-d">apply the pillars</div></div>
</div>
<div class="callout ok">A useful habit: to model a problem, list the <em>nouns</em> (they become classes) and the <em>verbs</em> (they become methods). "A Student has a name and can calculate GPA" → class Student, field name, method calculateGPA().</div>
<a class="link-card exphub" href="/exp-hub/pro192-cai-dat-java-netbeans?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Install JDK &amp; NetBeans (step-by-step)</span><span class="lc-sub">Official links and first-project guide for PRO192.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-246" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice Java on CodeLab</span><span class="lc-sub">The "Java Fundamentals" track mirrors this course — code as you learn.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Mục 0 · Bài 0.4</span>
<h2>Tài liệu, công cụ &amp; cách học</h2>
<h3>Giáo trình</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Core Java Volume 1 &amp; 2 — Cay Horstmann</div><div class="lz-ld">Tài liệu Java thực hành chuẩn mực. Volume 1 phủ các phần cơ bản bạn cần ở đây.</div></div>
  <div class="lz-layer"><div class="lz-lt">Java 8 Specification (Oracle)</div><div class="lz-ld">Nguồn thẩm quyền khi bạn cần quy tắc chính xác.</div></div>
  <div class="lz-layer"><div class="lz-lt">Học liệu "OOP using Java" của FU</div><div class="lz-ld">Tài nguyên học bám sát môn.</div></div>
</div>
<h3>Công cụ bạn cần</h3>
<ul>
  <li><strong>JDK (Java Development Kit) 8+</strong> — trình biên dịch và runtime cho Java.</li>
  <li><strong>NetBeans</strong> — IDE mà môn dùng; trình soạn thảo hiện đại có build/run/debug tích hợp.</li>
</ul>
<h3>Cách học OOP hiệu quả</h3>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Mô hình</div><div class="lz-t">có đối tượng nào?</div><div class="lz-d">danh từ → lớp</div></div>
  <div class="lz-step"><div class="lz-k">Code</div><div class="lz-t">viết lớp</div><div class="lz-d">và một main để thử</div></div>
  <div class="lz-step"><div class="lz-k">Chạy</div><div class="lz-t">thấy nó hoạt động</div><div class="lz-d">debug &amp; sửa</div></div>
  <div class="lz-step"><div class="lz-k">Tinh chỉnh</div><div class="lz-t">cải thiện thiết kế</div><div class="lz-d">áp các trụ cột</div></div>
</div>
<div class="callout ok">Một thói quen hữu ích: để mô hình một bài toán, liệt kê các <em>danh từ</em> (chúng thành lớp) và các <em>động từ</em> (chúng thành phương thức). "Một Student có một tên và có thể tính GPA" → lớp Student, trường name, phương thức calculateGPA().</div>
<a class="link-card exphub" href="/exp-hub/pro192-cai-dat-java-netbeans?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming" target="_blank" rel="noopener">
  <span class="lc-ico">🛠️</span>
  <span class="lc-body"><span class="lc-title">Cài JDK &amp; NetBeans (từng bước)</span><span class="lc-sub">Link chính chủ và hướng dẫn project đầu tiên cho PRO192.</span></span>
  <span class="lc-cta">EXP HUB →</span>
</a>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-246" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện Java trên CodeLab</span><span class="lc-sub">Track "Java Fundamentals" phản chiếu môn này — code khi học.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 1 — TƯ DUY OO & JAVA CƠ BẢN ══════════════════ */
    {
      title: 'Chapter 1 — OO Thinking & Java Basics|||Chương 1 — Tư duy OO & Java cơ bản',
      description: 'Vì sao lập trình hướng đối tượng, và cú pháp Java khác C ra sao.',
      lessons: [
        {
          title: '1.1 — Why objects? Procedural vs OO|||1.1 — Vì sao đối tượng? Thủ tục vs OO',
          slug: 'pro192-1-1-tu-duy-oo',
          type: 'VIDEO',
          description: 'Chuyển từ tư duy các bước sang tư duy đối tượng giữ dữ liệu + hành vi.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.1</span>
<h2>Two ways to organize a program</h2>
<p class="lead">In C (PRF192) you thought <strong>procedurally</strong>: data in variables, and functions that act on that data — kept separate. OOP (CLO1) bundles related <em>data</em> and <em>behavior</em> together into <strong>objects</strong>, built from blueprints called <strong>classes</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Procedural (C): data and functions are separate</div><div class="lz-ld">A struct Student holds data; free functions like calcGPA(Student) act on it. As the program grows, it is easy to lose track of which function may touch which data.</div></div>
  <div class="lz-layer"><div class="lz-lt">Object-oriented (Java): data + behavior together</div><div class="lz-ld">A class Student holds both the data (name, grades) AND the methods (calculateGPA). The object owns and protects its own data.</div></div>
</div>
<h3>Class vs object</h3>
<p>A <strong>class</strong> is a blueprint; an <strong>object</strong> is a concrete thing made from it. "Student" is a class; "the student named An with GPA 3.6" is an object (an <em>instance</em>). One class, many objects.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Class</div><div class="lz-t">blueprint</div><div class="lz-d">defines fields &amp; methods</div></div>
  <div class="lz-step"><div class="lz-k">new</div><div class="lz-t">create an object</div><div class="lz-d">an instance in memory</div></div>
  <div class="lz-step"><div class="lz-k">Object</div><div class="lz-t">concrete thing</div><div class="lz-d">its own data values</div></div>
</div>
<div class="callout ok">The mental shift: stop asking "what steps do I run?" and start asking "what things exist, what does each know, and what can each do?" Model the world as cooperating objects. This is the whole point of PRO192.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.1</span>
<h2>Hai cách tổ chức một chương trình</h2>
<p class="lead">Trong C (PRF192) bạn tư duy <strong>thủ tục</strong>: dữ liệu ở biến, và hàm tác động lên dữ liệu đó — tách rời nhau. OOP (CLO1) gom <em>dữ liệu</em> và <em>hành vi</em> liên quan lại với nhau thành các <strong>đối tượng</strong>, xây từ khuôn mẫu gọi là <strong>lớp (class)</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Thủ tục (C): dữ liệu và hàm tách rời</div><div class="lz-ld">Một struct Student giữ dữ liệu; các hàm rời như calcGPA(Student) tác động lên nó. Khi chương trình lớn lên, dễ mất dấu hàm nào có thể động tới dữ liệu nào.</div></div>
  <div class="lz-layer"><div class="lz-lt">Hướng đối tượng (Java): dữ liệu + hành vi ở cùng nhau</div><div class="lz-ld">Một lớp Student giữ cả dữ liệu (name, grades) LẪN các phương thức (calculateGPA). Đối tượng sở hữu và bảo vệ dữ liệu của chính nó.</div></div>
</div>
<h3>Lớp vs đối tượng</h3>
<p>Một <strong>lớp (class)</strong> là khuôn mẫu; một <strong>đối tượng (object)</strong> là một thứ cụ thể tạo từ nó. "Student" là một lớp; "sinh viên tên An với GPA 3.6" là một đối tượng (một <em>thể hiện — instance</em>). Một lớp, nhiều đối tượng.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Lớp</div><div class="lz-t">khuôn mẫu</div><div class="lz-d">định nghĩa trường &amp; phương thức</div></div>
  <div class="lz-step"><div class="lz-k">new</div><div class="lz-t">tạo một đối tượng</div><div class="lz-d">một thể hiện trong bộ nhớ</div></div>
  <div class="lz-step"><div class="lz-k">Đối tượng</div><div class="lz-t">thứ cụ thể</div><div class="lz-d">giá trị dữ liệu riêng của nó</div></div>
</div>
<div class="callout ok">Chuyển dịch tư duy: thôi hỏi "tôi chạy các bước nào?" và bắt đầu hỏi "có những thứ gì tồn tại, mỗi thứ biết gì, và mỗi thứ làm được gì?" Mô hình thế giới thành các đối tượng hợp tác. Đây là toàn bộ mục đích của PRO192.</div>
</div>
`,
        },
        {
          title: '1.2 — Java syntax essentials (from C to Java)|||1.2 — Cú pháp Java cốt lõi (từ C sang Java)',
          slug: 'pro192-1-2-cu-phap-java',
          type: 'VIDEO',
          description: 'Cấu trúc một file Java, kiểu dữ liệu, in ra màn hình và khác biệt với C.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 1 · Lesson 1.2</span>
<h2>Your first Java program</h2>
<p class="lead">Java syntax (CLO2) looks familiar after C — same operators, same if/for/while — but everything lives <strong>inside a class</strong>, and there are no pointers to manage.</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Hello</span> {
    <span class="tok-keyword">public static void</span> <span class="tok-function">main</span>(<span class="tok-type">String</span>[] args) {
        <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Xin chao PRO192!"</span>);
    }
}</pre>
<div class="out"><b>Output:</b> Xin chao PRO192!</div>
<h3>Key differences from C</h3>
<table>
  <thead><tr><th>C</th><th>Java</th></tr></thead>
  <tbody>
    <tr><td>Functions can be free-standing</td><td>Everything is inside a class</td></tr>
    <tr><td>printf(...)</td><td>System.out.println(...)</td></tr>
    <tr><td>Pointers &amp; manual malloc/free</td><td>References; automatic garbage collection</td></tr>
    <tr><td>char arrays for text</td><td>The String class</td></tr>
    <tr><td>#include headers</td><td>import packages</td></tr>
  </tbody>
</table>
<h3>Primitive types &amp; variables</h3>
<div class="out"><span class="tok-type">int</span> age = 20;
<span class="tok-type">double</span> gpa = 3.6;
<span class="tok-type">boolean</span> passed = <span class="tok-keyword">true</span>;
<span class="tok-type">String</span> name = <span class="tok-string">"An"</span>;  <span class="tok-comment">// String is an object, not a primitive</span></pre></div>
<p>Control flow (if, switch, for, while) is nearly identical to C — your PRF192 knowledge carries straight over. The new idea is that all this code lives in methods inside classes.</p>
<div class="pitfall">Java is strongly typed and case-sensitive, and every statement ends with <code>;</code>. Unlike C, you cannot forget the class wrapper — a "loose" function will not compile. And <code>==</code> compares object references, not contents: to compare Strings, use <code>.equals()</code>.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-247" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice Java syntax</span><span class="lc-sub">The "Variables, Types &amp; Operators" module — run Java in your browser.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 1 · Bài 1.2</span>
<h2>Chương trình Java đầu tiên</h2>
<p class="lead">Cú pháp Java (CLO2) trông quen sau C — cùng toán tử, cùng if/for/while — nhưng mọi thứ nằm <strong>bên trong một lớp</strong>, và không có con trỏ để quản lý.</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Hello</span> {
    <span class="tok-keyword">public static void</span> <span class="tok-function">main</span>(<span class="tok-type">String</span>[] args) {
        <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Xin chao PRO192!"</span>);
    }
}</pre>
<div class="out"><b>Kết quả:</b> Xin chao PRO192!</div>
<h3>Khác biệt chính so với C</h3>
<table>
  <thead><tr><th>C</th><th>Java</th></tr></thead>
  <tbody>
    <tr><td>Hàm có thể đứng độc lập</td><td>Mọi thứ nằm trong một lớp</td></tr>
    <tr><td>printf(...)</td><td>System.out.println(...)</td></tr>
    <tr><td>Con trỏ &amp; malloc/free thủ công</td><td>Tham chiếu; tự động dọn rác (garbage collection)</td></tr>
    <tr><td>Mảng char cho văn bản</td><td>Lớp String</td></tr>
    <tr><td>#include header</td><td>import package</td></tr>
  </tbody>
</table>
<h3>Kiểu nguyên thuỷ &amp; biến</h3>
<div class="out"><span class="tok-type">int</span> age = 20;
<span class="tok-type">double</span> gpa = 3.6;
<span class="tok-type">boolean</span> passed = <span class="tok-keyword">true</span>;
<span class="tok-type">String</span> name = <span class="tok-string">"An"</span>;  <span class="tok-comment">// String là đối tượng, không phải kiểu nguyên thuỷ</span></pre></div>
<p>Điều khiển luồng (if, switch, for, while) gần như y hệt C — kiến thức PRF192 của bạn dùng ngay được. Ý tưởng mới là tất cả code này nằm trong các phương thức bên trong các lớp.</p>
<div class="pitfall">Java định kiểu mạnh và phân biệt hoa/thường, và mọi câu lệnh kết thúc bằng <code>;</code>. Khác C, bạn không thể quên lớp bao — một hàm "lỏng lẻo" sẽ không biên dịch được. Và <code>==</code> so sánh tham chiếu đối tượng, không phải nội dung: để so sánh String, dùng <code>.equals()</code>.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-247" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện cú pháp Java</span><span class="lc-sub">Module "Variables, Types &amp; Operators" — chạy Java ngay trên trình duyệt.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 1 Quiz|||Quiz chương 1',
          slug: 'pro192-quiz-ch1',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: OO vs thủ tục, lớp vs đối tượng, cú pháp Java.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'The main idea of OOP is to…|||Ý tưởng chính của OOP là…', options: ['keep data and functions separate|||giữ dữ liệu và hàm tách rời', 'bundle related data and behavior into objects|||gom dữ liệu và hành vi liên quan vào các đối tượng', 'avoid using functions|||tránh dùng hàm', 'only use global variables|||chỉ dùng biến toàn cục'], correctIndex: 1, points: 1 },
              { question: 'A class is a…, and an object is a…|||Một lớp là…, và một đối tượng là…', options: ['concrete instance … blueprint|||thể hiện cụ thể … khuôn mẫu', 'blueprint … concrete instance of it|||khuôn mẫu … thể hiện cụ thể của nó', 'function … variable|||hàm … biến', 'they are the same|||chúng như nhau'], correctIndex: 1, points: 1 },
              { question: 'In Java, code must be written…|||Trong Java, code phải được viết…', options: ['as free-standing functions|||thành các hàm độc lập', 'inside a class|||bên trong một lớp', 'only in the main file|||chỉ trong file main', 'without any structure|||không cấu trúc nào'], correctIndex: 1, points: 1 },
              { question: 'To print a line in Java you use…|||Để in một dòng trong Java bạn dùng…', options: ['printf(...)', 'System.out.println(...)', 'cout <<', 'print()'], correctIndex: 1, points: 1 },
              { question: 'To compare the contents of two Strings in Java, use…|||Để so sánh nội dung hai String trong Java, dùng…', options: ['==', '.equals()', '>', '.compare'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 2 — LỚP & ĐỐI TƯỢNG ══════════════════ */
    {
      title: 'Chapter 2 — Classes & Objects|||Chương 2 — Lớp & Đối tượng',
      description: 'Định nghĩa lớp với trường, phương thức, constructor và tạo đối tượng.',
      lessons: [
        {
          title: '2.1 — Fields, methods & constructors|||2.1 — Trường, phương thức & constructor',
          slug: 'pro192-2-1-lop-doi-tuong',
          type: 'VIDEO',
          description: 'Viết một lớp hoàn chỉnh và tạo đối tượng từ nó.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 2 · Lesson 2.1</span>
<h2>Building a class</h2>
<p class="lead">A class (CLO5) has three main parts: <strong>fields</strong> (its data), <strong>methods</strong> (its behavior), and <strong>constructors</strong> (special methods that create and initialize objects).</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Student</span> {
    <span class="tok-comment">// fields — the object's data</span>
    <span class="tok-type">String</span> name;
    <span class="tok-type">double</span> gpa;

    <span class="tok-comment">// constructor — runs when you create a Student</span>
    <span class="tok-keyword">public</span> <span class="tok-function">Student</span>(<span class="tok-type">String</span> name, <span class="tok-type">double</span> gpa) {
        <span class="tok-keyword">this</span>.name = name;   <span class="tok-comment">// 'this' = the object being built</span>
        <span class="tok-keyword">this</span>.gpa = gpa;
    }

    <span class="tok-comment">// method — the object's behavior</span>
    <span class="tok-keyword">public boolean</span> <span class="tok-function">isPassing</span>() {
        <span class="tok-keyword">return</span> gpa &gt;= 2.0;
    }
}</pre>
<h3>Creating and using an object</h3>
<pre><span class="tok-type">Student</span> an = <span class="tok-keyword">new</span> <span class="tok-function">Student</span>(<span class="tok-string">"An"</span>, 3.6);
<span class="tok-type">System</span>.out.<span class="tok-function">println</span>(an.name);        <span class="tok-comment">// An</span>
<span class="tok-type">System</span>.out.<span class="tok-function">println</span>(an.<span class="tok-function">isPassing</span>());  <span class="tok-comment">// true</span></pre>
<div class="out"><b>Output:</b><br>An<br>true</div>
<p>The keyword <code>new</code> calls the constructor and creates an object in memory. <code>this</code> refers to "the current object," letting you distinguish the field <code>this.name</code> from the parameter <code>name</code>.</p>
<div class="note-ct">Objects also have relationships. A Classroom might <em>have</em> an array of Student objects (composition), or a GraduateStudent might <em>be</em> a Student (inheritance, Chapter 4). Spotting these "has-a" and "is-a" links is how you design an object model.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-249" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Build classes on CodeLab</span><span class="lc-sub">The "OOP Fundamentals" module — write your own classes &amp; objects.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 2 · Bài 2.1</span>
<h2>Xây một lớp</h2>
<p class="lead">Một lớp (CLO5) có ba phần chính: <strong>trường (field)</strong> (dữ liệu của nó), <strong>phương thức (method)</strong> (hành vi của nó), và <strong>constructor</strong> (phương thức đặc biệt tạo và khởi tạo đối tượng).</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Student</span> {
    <span class="tok-comment">// trường — dữ liệu của đối tượng</span>
    <span class="tok-type">String</span> name;
    <span class="tok-type">double</span> gpa;

    <span class="tok-comment">// constructor — chạy khi bạn tạo một Student</span>
    <span class="tok-keyword">public</span> <span class="tok-function">Student</span>(<span class="tok-type">String</span> name, <span class="tok-type">double</span> gpa) {
        <span class="tok-keyword">this</span>.name = name;   <span class="tok-comment">// 'this' = đối tượng đang được tạo</span>
        <span class="tok-keyword">this</span>.gpa = gpa;
    }

    <span class="tok-comment">// phương thức — hành vi của đối tượng</span>
    <span class="tok-keyword">public boolean</span> <span class="tok-function">isPassing</span>() {
        <span class="tok-keyword">return</span> gpa &gt;= 2.0;
    }
}</pre>
<h3>Tạo và dùng một đối tượng</h3>
<pre><span class="tok-type">Student</span> an = <span class="tok-keyword">new</span> <span class="tok-function">Student</span>(<span class="tok-string">"An"</span>, 3.6);
<span class="tok-type">System</span>.out.<span class="tok-function">println</span>(an.name);        <span class="tok-comment">// An</span>
<span class="tok-type">System</span>.out.<span class="tok-function">println</span>(an.<span class="tok-function">isPassing</span>());  <span class="tok-comment">// true</span></pre>
<div class="out"><b>Kết quả:</b><br>An<br>true</div>
<p>Từ khoá <code>new</code> gọi constructor và tạo một đối tượng trong bộ nhớ. <code>this</code> chỉ "đối tượng hiện tại", cho bạn phân biệt trường <code>this.name</code> với tham số <code>name</code>.</p>
<div class="note-ct">Đối tượng cũng có quan hệ. Một Classroom có thể <em>chứa (has-a)</em> một mảng đối tượng Student (kết hợp), hoặc một GraduateStudent có thể <em>là (is-a)</em> một Student (kế thừa, Chương 4). Nhận ra các liên kết "has-a" và "is-a" này là cách bạn thiết kế một mô hình đối tượng.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-249" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Xây lớp trên CodeLab</span><span class="lc-sub">Module "OOP Fundamentals" — tự viết lớp &amp; đối tượng của bạn.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 2 Quiz|||Quiz chương 2',
          slug: 'pro192-quiz-ch2',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: trường, phương thức, constructor, new, this.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The three main parts of a class are…|||Ba phần chính của một lớp là…', options: ['fields, methods, constructors|||trường, phương thức, constructor', 'loops, arrays, pointers|||vòng lặp, mảng, con trỏ', 'imports, packages, comments|||import, package, chú thích', 'input, process, output|||nhập, xử lý, xuất'], correctIndex: 0, points: 1 },
              { question: 'A constructor is a special method that…|||Constructor là một phương thức đặc biệt…', options: ['prints output|||in kết quả', 'creates and initializes an object|||tạo và khởi tạo một đối tượng', 'deletes an object|||xoá một đối tượng', 'compares two objects|||so sánh hai đối tượng'], correctIndex: 1, points: 1 },
              { question: 'The keyword to create a new object is…|||Từ khoá để tạo một đối tượng mới là…', options: ['make', 'new', 'create', 'object'], correctIndex: 1, points: 1 },
              { question: 'Inside a class, "this" refers to…|||Bên trong một lớp, "this" chỉ…', options: ['the class file|||file lớp', 'the current object|||đối tượng hiện tại', 'the main method|||phương thức main', 'the parent class|||lớp cha'], correctIndex: 1, points: 1 },
              { question: 'A "Classroom has an array of Students" is an example of a… relationship.|||"Classroom chứa một mảng Student" là ví dụ của quan hệ…', options: ['is-a', 'has-a', 'no', 'inheritance'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 3 — ĐÓNG GÓI & TRỪU TƯỢNG ══════════════════ */
    {
      title: 'Chapter 3 — Encapsulation & Abstraction|||Chương 3 — Đóng gói & Trừu tượng',
      description: 'Giấu dữ liệu bằng private + getter/setter, và lộ giao diện sạch.',
      lessons: [
        {
          title: '3.1 — Encapsulation & abstraction|||3.1 — Đóng gói & trừu tượng',
          slug: 'pro192-3-1-dong-goi',
          type: 'VIDEO',
          description: 'private, getter/setter và ý tưởng giấu chi tiết bên trong.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 3 · Lesson 3.1</span>
<h2>Pillar 1 &amp; 2 — Encapsulation and Abstraction</h2>
<p class="lead"><strong>Encapsulation</strong> (CLO6) means hiding an object&#39;s internal data and exposing it only through controlled methods. You make fields <code>private</code>, then provide <strong>getters</strong> and <strong>setters</strong> to read and change them safely.</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">BankAccount</span> {
    <span class="tok-keyword">private double</span> balance;  <span class="tok-comment">// hidden — cannot be touched directly</span>

    <span class="tok-keyword">public double</span> <span class="tok-function">getBalance</span>() { <span class="tok-keyword">return</span> balance; }

    <span class="tok-keyword">public void</span> <span class="tok-function">deposit</span>(<span class="tok-type">double</span> amount) {
        <span class="tok-keyword">if</span> (amount &gt; 0) balance += amount;  <span class="tok-comment">// validation protects the data</span>
    }
}</pre>
<p>Because <code>balance</code> is <code>private</code>, no outside code can set it to a negative value directly — it must go through <code>deposit()</code>, which validates. The object <strong>protects its own invariants</strong>.</p>
<h3>Access modifiers</h3>
<table>
  <thead><tr><th>Modifier</th><th>Visible to</th></tr></thead>
  <tbody>
    <tr><td>private</td><td>only this class</td></tr>
    <tr><td>(default)</td><td>the same package</td></tr>
    <tr><td>protected</td><td>package + subclasses</td></tr>
    <tr><td>public</td><td>everyone</td></tr>
  </tbody>
</table>
<h3>Abstraction</h3>
<p><strong>Abstraction</strong> is the flip side: expose <em>what</em> an object does, hide <em>how</em>. You call <code>account.deposit(100)</code> without knowing the internal logic — just like driving a car without understanding the engine.</p>
<div class="callout ok">Encapsulation = hide the data; abstraction = hide the complexity. Together they let you change an object&#39;s internals freely without breaking the code that uses it, as long as the public methods stay the same. This is the foundation of maintainable software.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 3 · Bài 3.1</span>
<h2>Trụ cột 1 &amp; 2 — Đóng gói và Trừu tượng</h2>
<p class="lead"><strong>Đóng gói (encapsulation)</strong> (CLO6) nghĩa là giấu dữ liệu bên trong của đối tượng và chỉ lộ nó qua các phương thức có kiểm soát. Bạn để trường là <code>private</code>, rồi cung cấp <strong>getter</strong> và <strong>setter</strong> để đọc và đổi chúng an toàn.</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">BankAccount</span> {
    <span class="tok-keyword">private double</span> balance;  <span class="tok-comment">// giấu — không thể chạm trực tiếp</span>

    <span class="tok-keyword">public double</span> <span class="tok-function">getBalance</span>() { <span class="tok-keyword">return</span> balance; }

    <span class="tok-keyword">public void</span> <span class="tok-function">deposit</span>(<span class="tok-type">double</span> amount) {
        <span class="tok-keyword">if</span> (amount &gt; 0) balance += amount;  <span class="tok-comment">// kiểm tra bảo vệ dữ liệu</span>
    }
}</pre>
<p>Vì <code>balance</code> là <code>private</code>, không code ngoài nào đặt được nó thành giá trị âm trực tiếp — phải đi qua <code>deposit()</code>, nơi kiểm tra. Đối tượng <strong>bảo vệ bất biến của chính nó</strong>.</p>
<h3>Bộ điều chỉnh truy cập (access modifier)</h3>
<table>
  <thead><tr><th>Modifier</th><th>Thấy được bởi</th></tr></thead>
  <tbody>
    <tr><td>private</td><td>chỉ lớp này</td></tr>
    <tr><td>(mặc định)</td><td>cùng package</td></tr>
    <tr><td>protected</td><td>package + lớp con</td></tr>
    <tr><td>public</td><td>mọi nơi</td></tr>
  </tbody>
</table>
<h3>Trừu tượng (abstraction)</h3>
<p><strong>Trừu tượng</strong> là mặt kia: lộ <em>cái gì</em> một đối tượng làm, giấu <em>làm sao</em>. Bạn gọi <code>account.deposit(100)</code> mà không cần biết logic bên trong — như lái xe mà không cần hiểu động cơ.</p>
<div class="callout ok">Đóng gói = giấu dữ liệu; trừu tượng = giấu độ phức tạp. Cùng nhau chúng cho bạn đổi phần bên trong của đối tượng tự do mà không phá code dùng nó, miễn là các phương thức public giữ nguyên. Đây là nền của phần mềm dễ bảo trì.</div>
</div>
`,
        },
        {
          title: 'Chapter 3 Quiz|||Quiz chương 3',
          slug: 'pro192-quiz-ch3',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: đóng gói, private, getter/setter, trừu tượng.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Encapsulation means…|||Đóng gói nghĩa là…', options: ['making all fields public|||để mọi trường public', 'hiding internal data and exposing it via controlled methods|||giấu dữ liệu bên trong và lộ qua phương thức có kiểm soát', 'copying an object|||sao chép một đối tượng', 'deleting private data|||xoá dữ liệu private'], correctIndex: 1, points: 1 },
              { question: 'To hide a field so only its own class can access it, declare it…|||Để giấu một trường sao cho chỉ lớp của nó truy cập, khai báo nó…', options: ['public', 'private', 'protected', 'static'], correctIndex: 1, points: 1 },
              { question: 'Getters and setters let you…|||Getter và setter cho bạn…', options: ['read/change private fields in a controlled way|||đọc/đổi trường private một cách có kiểm soát', 'delete the class|||xoá lớp', 'skip the constructor|||bỏ constructor', 'make fields public|||để trường public'], correctIndex: 0, points: 1 },
              { question: 'Abstraction means exposing… and hiding…|||Trừu tượng nghĩa là lộ… và giấu…', options: ['how … what', 'what an object does … how it does it|||cái gì đối tượng làm … làm sao nó làm', 'the fields … the methods', 'nothing … everything'], correctIndex: 1, points: 1 },
              { question: 'Which access modifier makes a member visible to everyone?|||Modifier nào làm một thành viên thấy được với mọi nơi?', options: ['private', 'protected', 'public', 'default'], correctIndex: 2, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 4 — KẾ THỪA & ĐA HÌNH ══════════════════ */
    {
      title: 'Chapter 4 — Inheritance & Polymorphism|||Chương 4 — Kế thừa & Đa hình',
      description: 'Tái dùng code bằng kế thừa, và một giao diện nhiều hình dạng.',
      lessons: [
        {
          title: '4.1 — Inheritance|||4.1 — Kế thừa',
          slug: 'pro192-4-1-ke-thua',
          type: 'VIDEO',
          description: 'extends, super, ghi đè (override) và quan hệ "is-a".',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.1</span>
<h2>Pillar 3 — Inheritance</h2>
<p class="lead"><strong>Inheritance</strong> (CLO6) lets a new class reuse and extend an existing one. The child class (subclass) gets all the parent&#39;s fields and methods, then adds or changes what it needs. It models the "<strong>is-a</strong>" relationship.</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Animal</span> {
    <span class="tok-type">String</span> name;
    <span class="tok-keyword">public void</span> <span class="tok-function">eat</span>() { <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(name + <span class="tok-string">" is eating"</span>); }
}

<span class="tok-keyword">public class</span> <span class="tok-type">Dog</span> <span class="tok-keyword">extends</span> <span class="tok-type">Animal</span> {   <span class="tok-comment">// Dog IS-A Animal</span>
    <span class="tok-keyword">public void</span> <span class="tok-function">bark</span>() { <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Woof!"</span>); }
}</pre>
<p>A <code>Dog</code> automatically has <code>name</code> and <code>eat()</code> from <code>Animal</code>, plus its own <code>bark()</code>. No copy-paste — reuse by extension.</p>
<h3>super and overriding</h3>
<p>A subclass can <strong>override</strong> a parent method to change its behavior, and use <code>super</code> to call the parent&#39;s version or constructor.</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Cat</span> <span class="tok-keyword">extends</span> <span class="tok-type">Animal</span> {
    <span class="tok-keyword">@Override</span>
    <span class="tok-keyword">public void</span> <span class="tok-function">eat</span>() {
        <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(name + <span class="tok-string">" eats fish quietly"</span>);
    }
}</pre>
<div class="pitfall">Java allows only <strong>single inheritance</strong> (one parent class) — unlike C++. To combine multiple behaviors, you use interfaces (Chapter 5). Also prefer inheritance only for true "is-a" relationships; for "has-a," use composition (a field) instead.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-250" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice inheritance</span><span class="lc-sub">The "Inheritance, Polymorphism &amp; Interfaces" module on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.1</span>
<h2>Trụ cột 3 — Kế thừa</h2>
<p class="lead"><strong>Kế thừa (inheritance)</strong> (CLO6) cho một lớp mới tái dùng và mở rộng một lớp có sẵn. Lớp con (subclass) nhận toàn bộ trường và phương thức của lớp cha, rồi thêm hoặc đổi thứ nó cần. Nó mô hình quan hệ "<strong>is-a</strong>".</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Animal</span> {
    <span class="tok-type">String</span> name;
    <span class="tok-keyword">public void</span> <span class="tok-function">eat</span>() { <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(name + <span class="tok-string">" is eating"</span>); }
}

<span class="tok-keyword">public class</span> <span class="tok-type">Dog</span> <span class="tok-keyword">extends</span> <span class="tok-type">Animal</span> {   <span class="tok-comment">// Dog IS-A Animal</span>
    <span class="tok-keyword">public void</span> <span class="tok-function">bark</span>() { <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Woof!"</span>); }
}</pre>
<p>Một <code>Dog</code> tự động có <code>name</code> và <code>eat()</code> từ <code>Animal</code>, cộng <code>bark()</code> riêng. Không copy-paste — tái dùng bằng mở rộng.</p>
<h3>super và ghi đè (override)</h3>
<p>Một lớp con có thể <strong>ghi đè (override)</strong> một phương thức cha để đổi hành vi, và dùng <code>super</code> để gọi phiên bản của cha hoặc constructor cha.</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Cat</span> <span class="tok-keyword">extends</span> <span class="tok-type">Animal</span> {
    <span class="tok-keyword">@Override</span>
    <span class="tok-keyword">public void</span> <span class="tok-function">eat</span>() {
        <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(name + <span class="tok-string">" eats fish quietly"</span>);
    }
}</pre>
<div class="pitfall">Java chỉ cho <strong>kế thừa đơn</strong> (một lớp cha) — khác C++. Để kết hợp nhiều hành vi, bạn dùng interface (Chương 5). Ngoài ra chỉ nên kế thừa cho quan hệ "is-a" thật; với "has-a", dùng kết hợp (một trường) thay vì kế thừa.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-250" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện kế thừa</span><span class="lc-sub">Module "Inheritance, Polymorphism &amp; Interfaces" trên CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: '4.2 — Polymorphism|||4.2 — Đa hình',
          slug: 'pro192-4-2-da-hinh',
          type: 'VIDEO',
          description: 'Một giao diện, nhiều hành vi — dynamic dispatch và upcasting.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 4 · Lesson 4.2</span>
<h2>Pillar 4 — Polymorphism</h2>
<p class="lead"><strong>Polymorphism</strong> (CLO6) means "many forms": you can treat different subclasses through a common parent type, and Java automatically runs the correct overridden method at runtime. This is the most powerful OOP idea.</p>
<pre><span class="tok-type">Animal</span>[] zoo = { <span class="tok-keyword">new</span> <span class="tok-function">Dog</span>(), <span class="tok-keyword">new</span> <span class="tok-function">Cat</span>(), <span class="tok-keyword">new</span> <span class="tok-function">Dog</span>() };

<span class="tok-keyword">for</span> (<span class="tok-type">Animal</span> a : zoo) {
    a.<span class="tok-function">eat</span>();   <span class="tok-comment">// each object runs ITS OWN version of eat()</span>
}</pre>
<div class="out"><b>Output (with overrides):</b><br>... is eating<br>... eats fish quietly<br>... is eating</div>
<p>Even though the array is typed as <code>Animal</code>, each object "remembers" its real class and runs the right <code>eat()</code>. This is <strong>dynamic dispatch</strong>: the method chosen depends on the object&#39;s actual type at runtime, not the reference type.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Reference</div><div class="lz-t">typed as Animal</div><div class="lz-d">the common parent</div></div>
  <div class="lz-step"><div class="lz-k">Object</div><div class="lz-t">really a Dog/Cat</div><div class="lz-d">its true class</div></div>
  <div class="lz-step"><div class="lz-k">Call eat()</div><div class="lz-t">runs the real one</div><div class="lz-d">dynamic dispatch</div></div>
</div>
<div class="callout ok">Why it matters: you can write code that works with "any Animal" (or any Shape, any Payment method) without knowing the exact subtype. Add a new subclass later and the existing loop works unchanged. Polymorphism is what makes OOP code extensible.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 4 · Bài 4.2</span>
<h2>Trụ cột 4 — Đa hình</h2>
<p class="lead"><strong>Đa hình (polymorphism)</strong> (CLO6) nghĩa là "nhiều hình dạng": bạn có thể xử lý các lớp con khác nhau qua một kiểu cha chung, và Java tự động chạy đúng phương thức đã ghi đè lúc chạy. Đây là ý tưởng OOP mạnh mẽ nhất.</p>
<pre><span class="tok-type">Animal</span>[] zoo = { <span class="tok-keyword">new</span> <span class="tok-function">Dog</span>(), <span class="tok-keyword">new</span> <span class="tok-function">Cat</span>(), <span class="tok-keyword">new</span> <span class="tok-function">Dog</span>() };

<span class="tok-keyword">for</span> (<span class="tok-type">Animal</span> a : zoo) {
    a.<span class="tok-function">eat</span>();   <span class="tok-comment">// mỗi đối tượng chạy phiên bản eat() CỦA CHÍNH NÓ</span>
}</pre>
<div class="out"><b>Kết quả (có override):</b><br>... is eating<br>... eats fish quietly<br>... is eating</div>
<p>Dù mảng có kiểu <code>Animal</code>, mỗi đối tượng "nhớ" lớp thật của nó và chạy đúng <code>eat()</code>. Đây là <strong>dynamic dispatch</strong>: phương thức được chọn phụ thuộc kiểu thật của đối tượng lúc chạy, không phải kiểu của tham chiếu.</p>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">Tham chiếu</div><div class="lz-t">kiểu Animal</div><div class="lz-d">lớp cha chung</div></div>
  <div class="lz-step"><div class="lz-k">Đối tượng</div><div class="lz-t">thật ra là Dog/Cat</div><div class="lz-d">lớp thật của nó</div></div>
  <div class="lz-step"><div class="lz-k">Gọi eat()</div><div class="lz-t">chạy đúng cái thật</div><div class="lz-d">dynamic dispatch</div></div>
</div>
<div class="callout ok">Vì sao quan trọng: bạn viết được code làm việc với "bất kỳ Animal nào" (hay bất kỳ Shape, bất kỳ phương thức Payment nào) mà không cần biết lớp con chính xác. Thêm một lớp con mới sau này thì vòng lặp cũ vẫn chạy không đổi. Đa hình là thứ làm code OOP mở rộng được.</div>
</div>
`,
        },
        {
          title: 'Chapter 4 Quiz|||Quiz chương 4',
          slug: 'pro192-quiz-ch4',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: kế thừa, extends, override, đa hình, dynamic dispatch.',
          quiz: {
            timeLimitSeconds: 360,
            questions: [
              { question: 'Inheritance models which relationship?|||Kế thừa mô hình quan hệ nào?', options: ['has-a', 'is-a', 'uses-a', 'none|||không cái nào'], correctIndex: 1, points: 1 },
              { question: 'The Java keyword for inheritance is…|||Từ khoá Java cho kế thừa là…', options: ['inherits', 'extends', 'implements', 'super'], correctIndex: 1, points: 1 },
              { question: 'Overriding a method means…|||Ghi đè (override) một phương thức nghĩa là…', options: ['deleting the parent method|||xoá phương thức cha', 'redefining a parent method in the subclass|||định nghĩa lại một phương thức cha trong lớp con', 'renaming the class|||đổi tên lớp', 'calling a private method|||gọi một phương thức private'], correctIndex: 1, points: 1 },
              { question: 'Java supports how many parent classes per class?|||Java hỗ trợ bao nhiêu lớp cha cho mỗi lớp?', options: ['one (single inheritance)|||một (kế thừa đơn)', 'unlimited|||không giới hạn', 'exactly two|||đúng hai', 'zero|||không có'], correctIndex: 0, points: 1 },
              { question: 'Dynamic dispatch means the method that runs depends on…|||Dynamic dispatch nghĩa là phương thức chạy phụ thuộc vào…', options: ['the reference type|||kiểu tham chiếu', 'the object\'s actual runtime type|||kiểu thật lúc chạy của đối tượng', 'the file name|||tên file', 'the compiler|||trình biên dịch'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 5 — ABSTRACT CLASS & INTERFACE ══════════════════ */
    {
      title: 'Chapter 5 — Abstract Classes & Interfaces|||Chương 5 — Abstract Class & Interface',
      description: 'Định nghĩa hợp đồng hành vi mà lớp con phải hiện thực.',
      lessons: [
        {
          title: '5.1 — Abstract classes & interfaces|||5.1 — Abstract class & interface',
          slug: 'pro192-5-1-abstract-interface',
          type: 'VIDEO',
          description: 'Hợp đồng chưa cài đặt và cách chọn giữa abstract class và interface.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 5 · Lesson 5.1</span>
<h2>Contracts for behavior</h2>
<p class="lead">Sometimes you want to define <em>what</em> a group of classes must do, without saying <em>how</em> (CLO7). Two tools do this: <strong>abstract classes</strong> and <strong>interfaces</strong>.</p>
<h3>Abstract class</h3>
<p>An <strong>abstract class</strong> cannot be instantiated (no <code>new</code>). It can hold both finished methods and <strong>abstract methods</strong> (declared, not implemented) that subclasses must fill in.</p>
<pre><span class="tok-keyword">public abstract class</span> <span class="tok-type">Shape</span> {
    <span class="tok-keyword">public abstract double</span> <span class="tok-function">area</span>();   <span class="tok-comment">// no body — subclasses must implement</span>
    <span class="tok-keyword">public void</span> <span class="tok-function">describe</span>() { <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Area = "</span> + <span class="tok-function">area</span>()); }
}
<span class="tok-keyword">public class</span> <span class="tok-type">Circle</span> <span class="tok-keyword">extends</span> <span class="tok-type">Shape</span> {
    <span class="tok-keyword">double</span> r;
    <span class="tok-keyword">public double</span> <span class="tok-function">area</span>() { <span class="tok-keyword">return</span> 3.14159 * r * r; }
}</pre>
<h3>Interface</h3>
<p>An <strong>interface</strong> is a pure contract — a list of method signatures a class promises to implement. A class can <code>implements</code> many interfaces (working around single inheritance).</p>
<pre><span class="tok-keyword">public interface</span> <span class="tok-type">Comparable</span> {
    <span class="tok-keyword">int</span> <span class="tok-function">compareTo</span>(<span class="tok-type">Object</span> other);
}
<span class="tok-keyword">public class</span> <span class="tok-type">Student</span> <span class="tok-keyword">implements</span> <span class="tok-type">Comparable</span> { <span class="tok-comment">/* must define compareTo */</span> }</pre>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Abstract class — "is-a" with shared code</div><div class="lz-ld">Use when subclasses share fields/implementation. One parent only.</div></div>
  <div class="lz-layer"><div class="lz-lt">Interface — "can-do" capability</div><div class="lz-ld">Use to give unrelated classes a shared ability. A class can implement many.</div></div>
</div>
<div class="note-ct">Rule of thumb: an abstract class says "a Circle IS-A Shape"; an interface says "a Student CAN-DO comparison." Both enable polymorphism — you can treat objects by their abstract type or interface, and the right implementation runs.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 5 · Bài 5.1</span>
<h2>Hợp đồng cho hành vi</h2>
<p class="lead">Đôi khi bạn muốn định nghĩa <em>cái gì</em> một nhóm lớp phải làm, mà không nói <em>làm sao</em> (CLO7). Hai công cụ làm điều này: <strong>abstract class</strong> và <strong>interface</strong>.</p>
<h3>Abstract class (lớp trừu tượng)</h3>
<p>Một <strong>abstract class</strong> không thể tạo thể hiện (không <code>new</code>). Nó có thể chứa cả phương thức đã hoàn thiện lẫn <strong>phương thức trừu tượng</strong> (khai báo, chưa cài đặt) mà lớp con phải điền vào.</p>
<pre><span class="tok-keyword">public abstract class</span> <span class="tok-type">Shape</span> {
    <span class="tok-keyword">public abstract double</span> <span class="tok-function">area</span>();   <span class="tok-comment">// không thân — lớp con phải cài đặt</span>
    <span class="tok-keyword">public void</span> <span class="tok-function">describe</span>() { <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Area = "</span> + <span class="tok-function">area</span>()); }
}
<span class="tok-keyword">public class</span> <span class="tok-type">Circle</span> <span class="tok-keyword">extends</span> <span class="tok-type">Shape</span> {
    <span class="tok-keyword">double</span> r;
    <span class="tok-keyword">public double</span> <span class="tok-function">area</span>() { <span class="tok-keyword">return</span> 3.14159 * r * r; }
}</pre>
<h3>Interface</h3>
<p>Một <strong>interface</strong> là một hợp đồng thuần — một danh sách chữ ký phương thức mà một lớp hứa hiện thực. Một lớp có thể <code>implements</code> nhiều interface (vòng qua giới hạn kế thừa đơn).</p>
<pre><span class="tok-keyword">public interface</span> <span class="tok-type">Comparable</span> {
    <span class="tok-keyword">int</span> <span class="tok-function">compareTo</span>(<span class="tok-type">Object</span> other);
}
<span class="tok-keyword">public class</span> <span class="tok-type">Student</span> <span class="tok-keyword">implements</span> <span class="tok-type">Comparable</span> { <span class="tok-comment">/* phải định nghĩa compareTo */</span> }</pre>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Abstract class — "is-a" có code dùng chung</div><div class="lz-ld">Dùng khi các lớp con chia sẻ trường/cài đặt. Chỉ một lớp cha.</div></div>
  <div class="lz-layer"><div class="lz-lt">Interface — khả năng "can-do"</div><div class="lz-ld">Dùng để cho các lớp không liên quan một khả năng chung. Một lớp implements được nhiều.</div></div>
</div>
<div class="note-ct">Quy tắc ngón tay cái: abstract class nói "một Circle LÀ MỘT Shape"; interface nói "một Student CÓ THỂ so sánh." Cả hai bật đa hình — bạn xử lý đối tượng qua kiểu trừu tượng hoặc interface của nó, và đúng cài đặt sẽ chạy.</div>
</div>
`,
        },
        {
          title: 'Chapter 5 Quiz|||Quiz chương 5',
          slug: 'pro192-quiz-ch5',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: abstract class, interface, implements, khi nào dùng gì.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'An abstract class…|||Một abstract class…', options: ['can be instantiated with new|||có thể tạo thể hiện bằng new', 'cannot be instantiated and may have abstract methods|||không thể tạo thể hiện và có thể có phương thức trừu tượng', 'has no methods|||không có phương thức', 'is the same as an object|||giống một đối tượng'], correctIndex: 1, points: 1 },
              { question: 'An interface is…|||Một interface là…', options: ['a fully implemented class|||một lớp cài đặt đầy đủ', 'a contract of method signatures a class must implement|||một hợp đồng các chữ ký phương thức mà lớp phải hiện thực', 'a private field|||một trường private', 'a constructor|||một constructor'], correctIndex: 1, points: 1 },
              { question: 'The keyword to use an interface is…|||Từ khoá để dùng một interface là…', options: ['extends', 'implements', 'inherits', 'new'], correctIndex: 1, points: 1 },
              { question: 'How many interfaces can a Java class implement?|||Một lớp Java implements được bao nhiêu interface?', options: ['only one|||chỉ một', 'many|||nhiều', 'zero|||không', 'exactly two|||đúng hai'], correctIndex: 1, points: 1 },
              { question: 'Use an interface (rather than abstract class) when you want to…|||Dùng interface (thay vì abstract class) khi bạn muốn…', options: ['share fields and code|||chia sẻ trường và code', 'give unrelated classes a shared capability|||cho các lớp không liên quan một khả năng chung', 'prevent inheritance|||ngăn kế thừa', 'store data|||lưu dữ liệu'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 1 ══════════════════ */
    {
      title: 'Progress Test 1 (OOP core — CLO1–7)|||Progress Test 1 (Cốt lõi OOP — CLO1–7)',
      description: 'Ôn: Java cơ bản, lớp/đối tượng, 4 trụ cột, abstract & interface.',
      lessons: [
        {
          title: 'Progress Test 1 — OOP review|||Progress Test 1 — Ôn OOP',
          slug: 'pro192-progress-test-1',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 1–5.',
          quiz: {
            timeLimitSeconds: 480,
            questions: [
              { question: 'OOP bundles together…|||OOP gom lại với nhau…', options: ['only functions|||chỉ hàm', 'data and the behavior that acts on it|||dữ liệu và hành vi tác động lên nó', 'only variables|||chỉ biến', 'files and folders|||tệp và thư mục'], correctIndex: 1, points: 1 },
              { question: 'Making a field private and adding getters/setters is called…|||Để một trường private và thêm getter/setter gọi là…', options: ['inheritance|||kế thừa', 'encapsulation|||đóng gói', 'polymorphism|||đa hình', 'abstraction|||trừu tượng'], correctIndex: 1, points: 1 },
              { question: 'Reusing a parent class\'s fields and methods in a child class is…|||Tái dùng trường và phương thức của lớp cha trong lớp con là…', options: ['encapsulation|||đóng gói', 'inheritance|||kế thừa', 'an interface|||một interface', 'a constructor|||một constructor'], correctIndex: 1, points: 1 },
              { question: 'Treating different subclasses through a common parent type and running the right method is…|||Xử lý các lớp con khác nhau qua một kiểu cha chung và chạy đúng phương thức là…', options: ['polymorphism|||đa hình', 'encapsulation|||đóng gói', 'a getter|||một getter', 'a package|||một package'], correctIndex: 0, points: 1 },
              { question: 'Which can a class implement MANY of?|||Một lớp có thể implements NHIỀU cái nào?', options: ['parent classes|||lớp cha', 'interfaces|||interface', 'constructors|||constructor', 'main methods|||phương thức main'], correctIndex: 1, points: 1 },
              { question: 'A class that cannot be instantiated but defines abstract methods is…|||Một lớp không thể tạo thể hiện nhưng định nghĩa phương thức trừu tượng là…', options: ['an interface|||một interface', 'an abstract class|||một abstract class', 'a final class|||một lớp final', 'an object|||một đối tượng'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 6 — XỬ LÝ NGOẠI LỆ ══════════════════ */
    {
      title: 'Chapter 6 — Exception Handling|||Chương 6 — Xử lý ngoại lệ',
      description: 'try/catch/finally, ngoại lệ checked vs unchecked và ném ngoại lệ.',
      lessons: [
        {
          title: '6.1 — try, catch, finally & throw|||6.1 — try, catch, finally & throw',
          slug: 'pro192-6-1-ngoai-le',
          type: 'VIDEO',
          description: 'Xử lý lỗi lúc chạy một cách gọn gàng thay vì để chương trình sập.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 6 · Lesson 6.1</span>
<h2>Handling errors gracefully</h2>
<p class="lead">Programs fail: a file is missing, input is invalid, a network drops. Java&#39;s <strong>exception handling</strong> (CLO4) lets you catch these problems and respond, instead of letting the program crash.</p>
<pre><span class="tok-keyword">try</span> {
    <span class="tok-keyword">int</span> result = 10 / 0;        <span class="tok-comment">// throws ArithmeticException</span>
} <span class="tok-keyword">catch</span> (<span class="tok-type">ArithmeticException</span> e) {
    <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Cannot divide by zero!"</span>);
} <span class="tok-keyword">finally</span> {
    <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"This always runs (cleanup)"</span>);
}</pre>
<div class="out"><b>Output:</b><br>Cannot divide by zero!<br>This always runs (cleanup)</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">try</div><div class="lz-t">risky code</div><div class="lz-d">might throw an exception</div></div>
  <div class="lz-step"><div class="lz-k">catch</div><div class="lz-t">handle it</div><div class="lz-d">respond to the error</div></div>
  <div class="lz-step"><div class="lz-k">finally</div><div class="lz-t">always runs</div><div class="lz-d">cleanup (close files etc.)</div></div>
</div>
<h3>Checked vs unchecked; throwing your own</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Checked exceptions (e.g. IOException)</div><div class="lz-ld">The compiler forces you to handle or declare them (with <code>throws</code>). Used for recoverable, expected problems like file access.</div></div>
  <div class="lz-layer"><div class="lz-lt">Unchecked exceptions (e.g. NullPointerException)</div><div class="lz-ld">Runtime bugs the compiler does not force you to catch — usually you fix the code instead.</div></div>
</div>
<p>You can raise your own with <code>throw new Exception("message")</code> to signal an error condition to the caller.</p>
<div class="callout ok">Good exception handling makes programs robust: instead of a cryptic crash, the user gets a clear message and the program keeps running. Always close resources in <code>finally</code> (or use try-with-resources) so files and connections are not leaked.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-252" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice exceptions &amp; I/O</span><span class="lc-sub">The "Exception Handling, I/O &amp; Generics" module on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 6 · Bài 6.1</span>
<h2>Xử lý lỗi gọn gàng</h2>
<p class="lead">Chương trình sẽ gặp lỗi: thiếu tệp, nhập không hợp lệ, mạng rớt. <strong>Xử lý ngoại lệ</strong> của Java (CLO4) cho bạn bắt các vấn đề này và phản hồi, thay vì để chương trình sập.</p>
<pre><span class="tok-keyword">try</span> {
    <span class="tok-keyword">int</span> result = 10 / 0;        <span class="tok-comment">// ném ArithmeticException</span>
} <span class="tok-keyword">catch</span> (<span class="tok-type">ArithmeticException</span> e) {
    <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Cannot divide by zero!"</span>);
} <span class="tok-keyword">finally</span> {
    <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"This always runs (cleanup)"</span>);
}</pre>
<div class="out"><b>Kết quả:</b><br>Cannot divide by zero!<br>This always runs (cleanup)</div>
<div class="lz-flow">
  <div class="lz-step"><div class="lz-k">try</div><div class="lz-t">code rủi ro</div><div class="lz-d">có thể ném ngoại lệ</div></div>
  <div class="lz-step"><div class="lz-k">catch</div><div class="lz-t">bắt &amp; xử lý</div><div class="lz-d">phản hồi lỗi</div></div>
  <div class="lz-step"><div class="lz-k">finally</div><div class="lz-t">luôn chạy</div><div class="lz-d">dọn dẹp (đóng tệp…)</div></div>
</div>
<h3>Checked vs unchecked; tự ném ngoại lệ</h3>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Ngoại lệ checked (vd IOException)</div><div class="lz-ld">Trình biên dịch buộc bạn xử lý hoặc khai báo (bằng <code>throws</code>). Dùng cho vấn đề dự kiến, khắc phục được như truy cập tệp.</div></div>
  <div class="lz-layer"><div class="lz-lt">Ngoại lệ unchecked (vd NullPointerException)</div><div class="lz-ld">Lỗi lúc chạy mà trình biên dịch không bắt bạn catch — thường bạn sửa code thay vì bắt.</div></div>
</div>
<p>Bạn có thể tự phát ngoại lệ bằng <code>throw new Exception("message")</code> để báo một điều kiện lỗi cho hàm gọi.</p>
<div class="callout ok">Xử lý ngoại lệ tốt làm chương trình bền: thay vì sập khó hiểu, người dùng nhận thông báo rõ và chương trình chạy tiếp. Luôn đóng tài nguyên trong <code>finally</code> (hoặc dùng try-with-resources) để không rò rỉ tệp và kết nối.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-252" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện ngoại lệ &amp; I/O</span><span class="lc-sub">Module "Exception Handling, I/O &amp; Generics" trên CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 6 Quiz|||Quiz chương 6',
          slug: 'pro192-quiz-ch6',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: try/catch/finally, checked vs unchecked, throw.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'The try block contains…|||Khối try chứa…', options: ['the error handler|||trình xử lý lỗi', 'the risky code that might throw an exception|||code rủi ro có thể ném ngoại lệ', 'cleanup code|||code dọn dẹp', 'nothing|||không gì'], correctIndex: 1, points: 1 },
              { question: 'The finally block…|||Khối finally…', options: ['runs only if there is an error|||chỉ chạy nếu có lỗi', 'always runs (used for cleanup)|||luôn chạy (dùng để dọn dẹp)', 'never runs|||không bao giờ chạy', 'catches the exception|||bắt ngoại lệ'], correctIndex: 1, points: 1 },
              { question: 'A checked exception is one that…|||Ngoại lệ checked là loại mà…', options: ['the compiler forces you to handle or declare|||trình biên dịch buộc bạn xử lý hoặc khai báo', 'never happens|||không bao giờ xảy ra', 'cannot be caught|||không thể bắt', 'is always fatal|||luôn gây chết chương trình'], correctIndex: 0, points: 1 },
              { question: 'To raise your own exception you use…|||Để tự phát ngoại lệ bạn dùng…', options: ['catch', 'throw new Exception(...)', 'finally', 'return'], correctIndex: 1, points: 1 },
              { question: 'Good exception handling lets a program…|||Xử lý ngoại lệ tốt cho một chương trình…', options: ['crash faster|||sập nhanh hơn', 'respond to errors and keep running|||phản hồi lỗi và chạy tiếp', 'ignore all bugs|||bỏ qua mọi lỗi', 'skip the finally block|||bỏ khối finally'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 7 — MẢNG ĐỐI TƯỢNG ══════════════════ */
    {
      title: 'Chapter 7 — Arrays of Objects|||Chương 7 — Mảng đối tượng',
      description: 'Quản lý một tập đối tượng và xây một chương trình hoàn chỉnh.',
      lessons: [
        {
          title: '7.1 — Managing many objects|||7.1 — Quản lý nhiều đối tượng',
          slug: 'pro192-7-1-mang-doi-tuong',
          type: 'VIDEO',
          description: 'Lưu và duyệt một mảng đối tượng để làm một chương trình quản lý.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 7 · Lesson 7.1</span>
<h2>From one object to a program</h2>
<p class="lead">Real programs manage <em>many</em> objects — a list of students, products, accounts. An <strong>array (or list) of objects</strong> (CLO8) is the backbone of a typical console management program: add, display, search, update.</p>
<pre><span class="tok-type">Student</span>[] students = <span class="tok-keyword">new</span> <span class="tok-type">Student</span>[3];
students[0] = <span class="tok-keyword">new</span> <span class="tok-function">Student</span>(<span class="tok-string">"An"</span>, 3.6);
students[1] = <span class="tok-keyword">new</span> <span class="tok-function">Student</span>(<span class="tok-string">"Binh"</span>, 3.1);
students[2] = <span class="tok-keyword">new</span> <span class="tok-function">Student</span>(<span class="tok-string">"Chi"</span>, 2.8);

<span class="tok-comment">// find the top student (polymorphism-free, just a loop)</span>
<span class="tok-type">Student</span> top = students[0];
<span class="tok-keyword">for</span> (<span class="tok-type">Student</span> s : students) {
    <span class="tok-keyword">if</span> (s.gpa &gt; top.gpa) top = s;
}
<span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Top: "</span> + top.name);  <span class="tok-comment">// Top: An</span></pre>
<div class="out"><b>Output:</b> Top: An</div>
<h3>The shape of a management program</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Store</div><div class="lz-nsub">an array/list of objects</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Menu loop</div><div class="lz-nsub">Add · Display · Search · Update · Exit</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Methods per action</div><div class="lz-nsub">one method does one job</div></div></div>
</div>
<div class="note-ct">This is exactly what your PRO192 assignment and practical exam look like: a menu-driven program managing a collection of objects. Master the loop-over-objects pattern and you can build any of them. Arrays have a fixed size though — the next chapter&#39;s collections grow dynamically.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 7 · Bài 7.1</span>
<h2>Từ một đối tượng tới một chương trình</h2>
<p class="lead">Chương trình thật quản lý <em>nhiều</em> đối tượng — một danh sách sinh viên, sản phẩm, tài khoản. Một <strong>mảng (hoặc list) đối tượng</strong> (CLO8) là xương sống của một chương trình quản lý console điển hình: thêm, hiển thị, tìm, cập nhật.</p>
<pre><span class="tok-type">Student</span>[] students = <span class="tok-keyword">new</span> <span class="tok-type">Student</span>[3];
students[0] = <span class="tok-keyword">new</span> <span class="tok-function">Student</span>(<span class="tok-string">"An"</span>, 3.6);
students[1] = <span class="tok-keyword">new</span> <span class="tok-function">Student</span>(<span class="tok-string">"Binh"</span>, 3.1);
students[2] = <span class="tok-keyword">new</span> <span class="tok-function">Student</span>(<span class="tok-string">"Chi"</span>, 2.8);

<span class="tok-comment">// tìm sinh viên đứng đầu (chỉ một vòng lặp)</span>
<span class="tok-type">Student</span> top = students[0];
<span class="tok-keyword">for</span> (<span class="tok-type">Student</span> s : students) {
    <span class="tok-keyword">if</span> (s.gpa &gt; top.gpa) top = s;
}
<span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Top: "</span> + top.name);  <span class="tok-comment">// Top: An</span></pre>
<div class="out"><b>Kết quả:</b> Top: An</div>
<h3>Hình dạng một chương trình quản lý</h3>
<div class="lz-map">
  <div class="lz-node"><div class="lz-badge">1</div><div class="lz-nbody"><div class="lz-ntitle">Lưu</div><div class="lz-nsub">một mảng/list đối tượng</div></div></div>
  <div class="lz-node"><div class="lz-badge">2</div><div class="lz-nbody"><div class="lz-ntitle">Vòng lặp menu</div><div class="lz-nsub">Thêm · Hiển thị · Tìm · Cập nhật · Thoát</div></div></div>
  <div class="lz-node"><div class="lz-badge">3</div><div class="lz-nbody"><div class="lz-ntitle">Mỗi hành động một phương thức</div><div class="lz-nsub">một phương thức làm một việc</div></div></div>
</div>
<div class="note-ct">Đây đúng là hình dạng assignment và thi thực hành PRO192 của bạn: một chương trình theo menu quản lý một tập đối tượng. Nắm vững mẫu duyệt-qua-đối-tượng là bạn xây được bất kỳ cái nào. Nhưng mảng có kích thước cố định — collections ở chương kế lớn lên động.</div>
</div>
`,
        },
        {
          title: 'Chapter 7 Quiz|||Quiz chương 7',
          slug: 'pro192-quiz-ch7',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: mảng đối tượng, duyệt, chương trình quản lý.',
          quiz: {
            timeLimitSeconds: 240,
            questions: [
              { question: 'An array of objects is used to…|||Một mảng đối tượng dùng để…', options: ['store a single value|||lưu một giá trị đơn', 'manage many objects of the same type|||quản lý nhiều đối tượng cùng loại', 'replace classes|||thay thế lớp', 'catch exceptions|||bắt ngoại lệ'], correctIndex: 1, points: 1 },
              { question: 'To visit every object in an array you typically use…|||Để thăm mọi đối tượng trong một mảng bạn thường dùng…', options: ['a try block|||một khối try', 'a loop (for/for-each)|||một vòng lặp (for/for-each)', 'a constructor|||một constructor', 'an interface|||một interface'], correctIndex: 1, points: 1 },
              { question: 'A typical console management program is built around a…|||Một chương trình quản lý console điển hình xây quanh một…', options: ['single print statement|||một câu in đơn', 'menu loop with one method per action|||vòng lặp menu với mỗi hành động một phương thức', 'private field|||một trường private', 'checked exception|||một ngoại lệ checked'], correctIndex: 1, points: 1 },
              { question: 'A limitation of a plain array is that…|||Một hạn chế của mảng thường là…', options: ['it cannot hold objects|||nó không chứa được đối tượng', 'it has a fixed size|||nó có kích thước cố định', 'it cannot be looped|||không thể lặp qua', 'it needs an interface|||nó cần một interface'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 8 — JAVA COLLECTIONS ══════════════════ */
    {
      title: 'Chapter 8 — Java Collections|||Chương 8 — Java Collections',
      description: 'List, Set, Map — các cấu trúc dữ liệu linh hoạt của Java.',
      lessons: [
        {
          title: '8.1 — List, Set & Map|||8.1 — List, Set & Map',
          slug: 'pro192-8-1-collections',
          type: 'VIDEO',
          description: 'Ba ADT collection và khi nào dùng cái nào.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 8 · Lesson 8.1</span>
<h2>Dynamic, powerful data structures</h2>
<p class="lead">Arrays are fixed-size and low-level. The <strong>Java Collections Framework</strong> (CLO9) provides flexible, growable data structures — the three you must know are <strong>List</strong>, <strong>Set</strong> and <strong>Map</strong>.</p>
<table>
  <thead><tr><th>Collection</th><th>Holds</th><th>Use when…</th></tr></thead>
  <tbody>
    <tr><td>List (ArrayList)</td><td>An ordered sequence; duplicates allowed</td><td>you need an indexed, growable list</td></tr>
    <tr><td>Set (HashSet)</td><td>Unique elements; no duplicates</td><td>you need to avoid repeats</td></tr>
    <tr><td>Map (HashMap)</td><td>Key → value pairs</td><td>you look things up by a key</td></tr>
  </tbody>
</table>
<pre><span class="tok-type">List</span>&lt;<span class="tok-type">String</span>&gt; names = <span class="tok-keyword">new</span> <span class="tok-function">ArrayList</span>&lt;&gt;();
names.<span class="tok-function">add</span>(<span class="tok-string">"An"</span>);  names.<span class="tok-function">add</span>(<span class="tok-string">"Binh"</span>);
<span class="tok-type">System</span>.out.<span class="tok-function">println</span>(names.<span class="tok-function">get</span>(0));   <span class="tok-comment">// An</span>

<span class="tok-type">Map</span>&lt;<span class="tok-type">String</span>, <span class="tok-type">Integer</span>&gt; ages = <span class="tok-keyword">new</span> <span class="tok-function">HashMap</span>&lt;&gt;();
ages.<span class="tok-function">put</span>(<span class="tok-string">"An"</span>, 20);
<span class="tok-type">System</span>.out.<span class="tok-function">println</span>(ages.<span class="tok-function">get</span>(<span class="tok-string">"An"</span>));  <span class="tok-comment">// 20</span></pre>
<div class="out"><b>Output:</b><br>An<br>20</div>
<p>The <code>&lt;String&gt;</code> part is <strong>generics</strong> — it tells the collection what type it holds, so the compiler catches type errors and you avoid casting. A <code>List&lt;Student&gt;</code> can only hold Students.</p>
<div class="callout ok">Prefer collections over raw arrays in real Java: an ArrayList grows automatically, a HashSet removes duplicates for free, and a HashMap gives near-instant lookup by key. Choosing the right one is a real design decision — the same "which data structure?" question from CSI104 and MAE101.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-251" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice collections</span><span class="lc-sub">The "Collections Framework &amp; Data Structures" module on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 8 · Bài 8.1</span>
<h2>Cấu trúc dữ liệu động, mạnh mẽ</h2>
<p class="lead">Mảng cố định kích thước và thấp cấp. <strong>Java Collections Framework</strong> (CLO9) cung cấp cấu trúc dữ liệu linh hoạt, lớn lên được — ba cái bạn phải biết là <strong>List</strong>, <strong>Set</strong> và <strong>Map</strong>.</p>
<table>
  <thead><tr><th>Collection</th><th>Chứa</th><th>Dùng khi…</th></tr></thead>
  <tbody>
    <tr><td>List (ArrayList)</td><td>Một dãy có thứ tự; cho phép trùng</td><td>bạn cần một danh sách có chỉ số, lớn lên được</td></tr>
    <tr><td>Set (HashSet)</td><td>Phần tử duy nhất; không trùng</td><td>bạn cần tránh lặp</td></tr>
    <tr><td>Map (HashMap)</td><td>Cặp khoá → giá trị</td><td>bạn tra cứu theo một khoá</td></tr>
  </tbody>
</table>
<pre><span class="tok-type">List</span>&lt;<span class="tok-type">String</span>&gt; names = <span class="tok-keyword">new</span> <span class="tok-function">ArrayList</span>&lt;&gt;();
names.<span class="tok-function">add</span>(<span class="tok-string">"An"</span>);  names.<span class="tok-function">add</span>(<span class="tok-string">"Binh"</span>);
<span class="tok-type">System</span>.out.<span class="tok-function">println</span>(names.<span class="tok-function">get</span>(0));   <span class="tok-comment">// An</span>

<span class="tok-type">Map</span>&lt;<span class="tok-type">String</span>, <span class="tok-type">Integer</span>&gt; ages = <span class="tok-keyword">new</span> <span class="tok-function">HashMap</span>&lt;&gt;();
ages.<span class="tok-function">put</span>(<span class="tok-string">"An"</span>, 20);
<span class="tok-type">System</span>.out.<span class="tok-function">println</span>(ages.<span class="tok-function">get</span>(<span class="tok-string">"An"</span>));  <span class="tok-comment">// 20</span></pre>
<div class="out"><b>Kết quả:</b><br>An<br>20</div>
<p>Phần <code>&lt;String&gt;</code> là <strong>generics</strong> — nó cho collection biết chứa kiểu gì, để trình biên dịch bắt lỗi kiểu và bạn khỏi ép kiểu. Một <code>List&lt;Student&gt;</code> chỉ chứa được Student.</p>
<div class="callout ok">Ưu tiên collections hơn mảng thô trong Java thật: một ArrayList tự lớn lên, một HashSet loại trùng miễn phí, và một HashMap cho tra cứu theo khoá gần tức thì. Chọn đúng cái là một quyết định thiết kế thật — cùng câu hỏi "cấu trúc dữ liệu nào?" từ CSI104 và MAE101.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-251" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện collections</span><span class="lc-sub">Module "Collections Framework &amp; Data Structures" trên CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
        {
          title: 'Chapter 8 Quiz|||Quiz chương 8',
          slug: 'pro192-quiz-ch8',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: List/Set/Map, generics, khi nào dùng gì.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Which collection stores an ordered sequence and allows duplicates?|||Collection nào lưu một dãy có thứ tự và cho phép trùng?', options: ['Set', 'List', 'Map', 'none|||không cái nào'], correctIndex: 1, points: 1 },
              { question: 'Which collection automatically removes duplicates?|||Collection nào tự động loại trùng?', options: ['List', 'Set', 'Map', 'Array|||Mảng'], correctIndex: 1, points: 1 },
              { question: 'A Map stores…|||Một Map lưu…', options: ['single values|||các giá trị đơn', 'key → value pairs|||các cặp khoá → giá trị', 'only numbers|||chỉ số', 'unique elements only|||chỉ phần tử duy nhất'], correctIndex: 1, points: 1 },
              { question: 'The <String> in List<String> is an example of…|||<String> trong List<String> là ví dụ của…', options: ['inheritance|||kế thừa', 'generics (type safety)|||generics (an toàn kiểu)', 'an exception|||một ngoại lệ', 'a constructor|||một constructor'], correctIndex: 1, points: 1 },
              { question: 'A key advantage of ArrayList over a plain array is that it…|||Một ưu điểm chính của ArrayList so với mảng thường là nó…', options: ['is fixed-size|||cố định kích thước', 'grows automatically|||tự lớn lên', 'cannot hold objects|||không chứa được đối tượng', 'has no methods|||không có phương thức'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ CHƯƠNG 9 — LUỒNG & ĐỌC/GHI TỆP ══════════════════ */
    {
      title: 'Chapter 9 — Streams & File I/O|||Chương 9 — Luồng & Đọc/ghi tệp',
      description: 'Đọc và ghi dữ liệu ra tệp bằng luồng (stream).',
      lessons: [
        {
          title: '9.1 — Reading & writing files|||9.1 — Đọc & ghi tệp',
          slug: 'pro192-9-1-file-io',
          type: 'VIDEO',
          description: 'Luồng byte vs ký tự và cách đọc/ghi tệp an toàn với ngoại lệ.',
          content: `
<div class="ml-en">
<span class="eyebrow">Chapter 9 · Lesson 9.1</span>
<h2>Persisting data with streams</h2>
<p class="lead">A program&#39;s data vanishes when it stops — unless you save it to a file. Java reads and writes files through <strong>streams</strong> (CLO3): an ordered flow of data between your program and a source/target.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Byte streams (InputStream / OutputStream)</div><div class="lz-ld">Move raw bytes — for images, audio, any binary file.</div></div>
  <div class="lz-layer"><div class="lz-lt">Character streams (Reader / Writer)</div><div class="lz-ld">Move text with proper character encoding — for .txt, .csv, source files.</div></div>
</div>
<h3>Writing and reading text</h3>
<pre><span class="tok-comment">// write — try-with-resources auto-closes the file</span>
<span class="tok-keyword">try</span> (<span class="tok-type">BufferedWriter</span> w = <span class="tok-keyword">new</span> <span class="tok-function">BufferedWriter</span>(<span class="tok-keyword">new</span> <span class="tok-function">FileWriter</span>(<span class="tok-string">"data.txt"</span>))) {
    w.<span class="tok-function">write</span>(<span class="tok-string">"An,3.6"</span>);
    w.<span class="tok-function">newLine</span>();
} <span class="tok-keyword">catch</span> (<span class="tok-type">IOException</span> e) {
    <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Write failed: "</span> + e.<span class="tok-function">getMessage</span>());
}</pre>
<pre><span class="tok-comment">// read line by line</span>
<span class="tok-keyword">try</span> (<span class="tok-type">BufferedReader</span> r = <span class="tok-keyword">new</span> <span class="tok-function">BufferedReader</span>(<span class="tok-keyword">new</span> <span class="tok-function">FileReader</span>(<span class="tok-string">"data.txt"</span>))) {
    <span class="tok-type">String</span> line;
    <span class="tok-keyword">while</span> ((line = r.<span class="tok-function">readLine</span>()) != <span class="tok-keyword">null</span>) {
        <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(line);
    }
} <span class="tok-keyword">catch</span> (<span class="tok-type">IOException</span> e) { <span class="tok-comment">/* handle */</span> }</pre>
<p>Notice file I/O throws <strong>checked exceptions</strong> (IOException) — the compiler forces you to handle them (Chapter 6). And <strong>try-with-resources</strong> automatically closes the file even if an error occurs, preventing resource leaks.</p>
<div class="note-ct">This completes the syllabus: you can now build a complete Java program that models a domain with classes (the pillars), stores objects in collections, handles errors, and saves/loads data to files — a real, self-contained application. That is the leap PRO192 delivers.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Chương 9 · Bài 9.1</span>
<h2>Lưu dữ liệu lâu dài bằng luồng</h2>
<p class="lead">Dữ liệu của một chương trình biến mất khi nó dừng — trừ khi bạn lưu ra tệp. Java đọc và ghi tệp qua <strong>luồng (stream)</strong> (CLO3): một dòng dữ liệu có thứ tự giữa chương trình và một nguồn/đích.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">Luồng byte (InputStream / OutputStream)</div><div class="lz-ld">Chuyển byte thô — cho ảnh, âm thanh, mọi tệp nhị phân.</div></div>
  <div class="lz-layer"><div class="lz-lt">Luồng ký tự (Reader / Writer)</div><div class="lz-ld">Chuyển văn bản với mã hoá ký tự đúng — cho .txt, .csv, tệp nguồn.</div></div>
</div>
<h3>Ghi và đọc văn bản</h3>
<pre><span class="tok-comment">// ghi — try-with-resources tự đóng tệp</span>
<span class="tok-keyword">try</span> (<span class="tok-type">BufferedWriter</span> w = <span class="tok-keyword">new</span> <span class="tok-function">BufferedWriter</span>(<span class="tok-keyword">new</span> <span class="tok-function">FileWriter</span>(<span class="tok-string">"data.txt"</span>))) {
    w.<span class="tok-function">write</span>(<span class="tok-string">"An,3.6"</span>);
    w.<span class="tok-function">newLine</span>();
} <span class="tok-keyword">catch</span> (<span class="tok-type">IOException</span> e) {
    <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(<span class="tok-string">"Write failed: "</span> + e.<span class="tok-function">getMessage</span>());
}</pre>
<pre><span class="tok-comment">// đọc từng dòng</span>
<span class="tok-keyword">try</span> (<span class="tok-type">BufferedReader</span> r = <span class="tok-keyword">new</span> <span class="tok-function">BufferedReader</span>(<span class="tok-keyword">new</span> <span class="tok-function">FileReader</span>(<span class="tok-string">"data.txt"</span>))) {
    <span class="tok-type">String</span> line;
    <span class="tok-keyword">while</span> ((line = r.<span class="tok-function">readLine</span>()) != <span class="tok-keyword">null</span>) {
        <span class="tok-type">System</span>.out.<span class="tok-function">println</span>(line);
    }
} <span class="tok-keyword">catch</span> (<span class="tok-type">IOException</span> e) { <span class="tok-comment">/* xử lý */</span> }</pre>
<p>Để ý đọc/ghi tệp ném <strong>ngoại lệ checked</strong> (IOException) — trình biên dịch buộc bạn xử lý (Chương 6). Và <strong>try-with-resources</strong> tự động đóng tệp kể cả khi có lỗi, ngăn rò rỉ tài nguyên.</p>
<div class="note-ct">Điều này hoàn tất giáo trình: giờ bạn xây được một chương trình Java hoàn chỉnh mô hình một lĩnh vực bằng các lớp (các trụ cột), lưu đối tượng trong collections, xử lý lỗi, và lưu/nạp dữ liệu ra tệp — một ứng dụng thật, tự chứa. Đó là bước nhảy PRO192 mang lại.</div>
</div>
`,
        },
        {
          title: 'Chapter 9 Quiz|||Quiz chương 9',
          slug: 'pro192-quiz-ch9',
          type: 'QUIZ',
          description: 'Kiểm tra nhanh: luồng byte/ký tự, đọc/ghi tệp, try-with-resources.',
          quiz: {
            timeLimitSeconds: 300,
            questions: [
              { question: 'Java reads and writes files using…|||Java đọc và ghi tệp bằng…', options: ['pointers|||con trỏ', 'streams|||luồng (stream)', 'arrays only|||chỉ mảng', 'interfaces|||interface'], correctIndex: 1, points: 1 },
              { question: 'Character streams (Reader/Writer) are used for…|||Luồng ký tự (Reader/Writer) dùng cho…', options: ['images and audio|||ảnh và âm thanh', 'text files|||tệp văn bản', 'compiling code|||biên dịch code', 'network sockets only|||chỉ socket mạng'], correctIndex: 1, points: 1 },
              { question: 'File I/O in Java throws which kind of exception?|||Đọc/ghi tệp trong Java ném loại ngoại lệ nào?', options: ['unchecked|||unchecked', 'checked (IOException)|||checked (IOException)', 'no exceptions|||không ngoại lệ', 'ArithmeticException'], correctIndex: 1, points: 1 },
              { question: 'try-with-resources is useful because it…|||try-with-resources hữu ích vì nó…', options: ['runs faster|||chạy nhanh hơn', 'automatically closes the file/resource|||tự động đóng tệp/tài nguyên', 'skips exceptions|||bỏ qua ngoại lệ', 'needs no catch ever|||không bao giờ cần catch'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ PROGRESS TEST 2 ══════════════════ */
    {
      title: 'Progress Test 2 (Robust programs — CLO4, 8, 9, 3)|||Progress Test 2 (Chương trình bền — CLO4, 8, 9, 3)',
      description: 'Ôn: ngoại lệ, mảng đối tượng, collections, đọc/ghi tệp.',
      lessons: [
        {
          title: 'Progress Test 2 — review|||Progress Test 2 — ôn tổng hợp',
          slug: 'pro192-progress-test-2',
          type: 'QUIZ',
          description: 'Trộn câu hỏi từ chương 6–9.',
          quiz: {
            timeLimitSeconds: 420,
            questions: [
              { question: 'Which block always runs, whether or not an exception occurs?|||Khối nào luôn chạy, dù có hay không có ngoại lệ?', options: ['try', 'catch', 'finally', 'throw'], correctIndex: 2, points: 1 },
              { question: 'A HashMap is best when you need to…|||HashMap tốt nhất khi bạn cần…', options: ['store an ordered list|||lưu một danh sách có thứ tự', 'look up values by a key|||tra giá trị theo khoá', 'remove duplicates|||loại trùng', 'catch exceptions|||bắt ngoại lệ'], correctIndex: 1, points: 1 },
              { question: 'A HashSet guarantees…|||HashSet đảm bảo…', options: ['order|||thứ tự', 'no duplicate elements|||không phần tử trùng', 'key-value pairs|||cặp khoá-giá trị', 'fixed size|||kích thước cố định'], correctIndex: 1, points: 1 },
              { question: 'A menu-driven management program is typically built around a… of objects.|||Một chương trình quản lý theo menu thường xây quanh một… đối tượng.', options: ['single object|||đối tượng đơn', 'collection (list/array)|||collection (list/mảng)', 'exception|||ngoại lệ', 'interface|||interface'], correctIndex: 1, points: 1 },
              { question: 'To save program data permanently you must…|||Để lưu dữ liệu chương trình vĩnh viễn bạn phải…', options: ['keep it in variables|||giữ trong biến', 'write it to a file (stream)|||ghi nó ra tệp (stream)', 'print it|||in nó ra', 'catch it|||bắt nó'], correctIndex: 1, points: 1 },
              { question: 'Generics like List<Student> give you…|||Generics như List<Student> cho bạn…', options: ['slower code|||code chậm hơn', 'compile-time type safety|||an toàn kiểu lúc biên dịch', 'more exceptions|||nhiều ngoại lệ hơn', 'no benefit|||không lợi ích'], correctIndex: 1, points: 1 },
            ],
          },
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 1 — GENERICS & LAMBDA ══════════════════ */
    {
      title: 'Advanced 1 — Generics, lambdas & the Stream API|||Nâng cao 1 — Generics, lambda & Stream API',
      description: 'Ngoài giáo trình: viết code Java hiện đại, ngắn gọn và an toàn kiểu.',
      lessons: [
        {
          title: 'N1.1 — Modern Java in a nutshell|||N1.1 — Java hiện đại tóm gọn',
          slug: 'pro192-n1-1-modern-java',
          type: 'VIDEO',
          description: 'Generics của riêng bạn, biểu thức lambda và xử lý dữ liệu kiểu functional.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 1 · Lesson N1.1</span>
<h2>Writing Java the modern way</h2>
<p class="lead">Beyond the syllabus, professional Java leans on three features that make code shorter, safer and more expressive: your own generics, lambdas, and the Stream API.</p>
<h3>Your own generic class</h3>
<p>Generics let a class work with any type safely. Instead of writing a Box for Strings and another for Integers, write one <code>Box&lt;T&gt;</code>:</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Box</span>&lt;<span class="tok-type">T</span>&gt; {
    <span class="tok-keyword">private</span> <span class="tok-type">T</span> item;
    <span class="tok-keyword">public void</span> <span class="tok-function">set</span>(<span class="tok-type">T</span> item) { <span class="tok-keyword">this</span>.item = item; }
    <span class="tok-keyword">public</span> <span class="tok-type">T</span> <span class="tok-function">get</span>() { <span class="tok-keyword">return</span> item; }
}</pre>
<h3>Lambdas &amp; the Stream API</h3>
<p>A <strong>lambda</strong> is a short anonymous function. Combined with the <strong>Stream API</strong>, it turns loops into readable data pipelines:</p>
<pre><span class="tok-type">List</span>&lt;<span class="tok-type">Student</span>&gt; students = ...;
students.<span class="tok-function">stream</span>()
        .<span class="tok-function">filter</span>(s -&gt; s.gpa &gt;= 3.0)      <span class="tok-comment">// keep passing students</span>
        .<span class="tok-function">map</span>(s -&gt; s.name)               <span class="tok-comment">// take their names</span>
        .<span class="tok-function">forEach</span>(<span class="tok-type">System</span>.out::println); <span class="tok-comment">// print each</span></pre>
<p>The same logic with a plain <code>for</code> loop is longer and easier to get wrong. Streams describe <em>what</em> you want, not the step-by-step how — the functional style from CSI104&#39;s programming paradigms, now in your hands.</p>
<div class="callout ok">You will not be examined heavily on these in PRO192, but every real Java codebase uses them. Learning generics, lambdas and streams now makes LAB211, PRJ301 and any Java job far smoother.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-253" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Practice modern Java</span><span class="lc-sub">The "Multithreading, Lambda &amp; Design Patterns" module on CodeLab.</span></span>
  <span class="lc-cta">PRACTICE →</span>
</a>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 1 · Bài N1.1</span>
<h2>Viết Java theo cách hiện đại</h2>
<p class="lead">Ngoài giáo trình, Java chuyên nghiệp dựa vào ba tính năng làm code ngắn hơn, an toàn hơn và biểu cảm hơn: generics của riêng bạn, lambda, và Stream API.</p>
<h3>Lớp generic của riêng bạn</h3>
<p>Generics cho một lớp làm việc với bất kỳ kiểu nào một cách an toàn. Thay vì viết một Box cho String và một cái khác cho Integer, viết một <code>Box&lt;T&gt;</code>:</p>
<pre><span class="tok-keyword">public class</span> <span class="tok-type">Box</span>&lt;<span class="tok-type">T</span>&gt; {
    <span class="tok-keyword">private</span> <span class="tok-type">T</span> item;
    <span class="tok-keyword">public void</span> <span class="tok-function">set</span>(<span class="tok-type">T</span> item) { <span class="tok-keyword">this</span>.item = item; }
    <span class="tok-keyword">public</span> <span class="tok-type">T</span> <span class="tok-function">get</span>() { <span class="tok-keyword">return</span> item; }
}</pre>
<h3>Lambda &amp; Stream API</h3>
<p>Một <strong>lambda</strong> là một hàm ẩn danh ngắn. Kết hợp với <strong>Stream API</strong>, nó biến vòng lặp thành các đường ống dữ liệu dễ đọc:</p>
<pre><span class="tok-type">List</span>&lt;<span class="tok-type">Student</span>&gt; students = ...;
students.<span class="tok-function">stream</span>()
        .<span class="tok-function">filter</span>(s -&gt; s.gpa &gt;= 3.0)      <span class="tok-comment">// giữ sinh viên đạt</span>
        .<span class="tok-function">map</span>(s -&gt; s.name)               <span class="tok-comment">// lấy tên họ</span>
        .<span class="tok-function">forEach</span>(<span class="tok-type">System</span>.out::println); <span class="tok-comment">// in từng cái</span></pre>
<p>Cùng logic đó bằng vòng <code>for</code> thường thì dài hơn và dễ sai hơn. Stream mô tả <em>cái gì</em> bạn muốn, không phải từng-bước làm sao — phong cách functional từ các paradigm lập trình ở CSI104, giờ trong tay bạn.</p>
<div class="callout ok">Bạn sẽ không bị thi nặng về những cái này ở PRO192, nhưng mọi codebase Java thật đều dùng chúng. Học generics, lambda và stream bây giờ làm LAB211, PRJ301 và mọi công việc Java mượt hơn nhiều.</div>
<a class="link-card codelab" href="/code-lab/java-core?ref=%2Fcourses%2Fobject-oriented-programming%2Flearn&reflabel=PRO192%20%E2%80%94%20Object-Oriented%20Programming#module-253" target="_blank" rel="noopener">
  <span class="lc-ico">⌨️</span>
  <span class="lc-body"><span class="lc-title">Luyện Java hiện đại</span><span class="lc-sub">Module "Multithreading, Lambda &amp; Design Patterns" trên CodeLab.</span></span>
  <span class="lc-cta">LUYỆN TẬP →</span>
</a>
</div>
`,
        },
      ],
    },
    /* ══════════════════ NÂNG CAO 2 — NGUYÊN TẮC THIẾT KẾ (CAPSTONE) ══════════════════ */
    {
      title: 'Advanced 2 — Design principles: from PRO192 to real projects|||Nâng cao 2 — Nguyên tắc thiết kế: từ PRO192 tới dự án thật',
      description: 'Ngoài giáo trình — bài tổng kết: SOLID và tư duy thiết kế tốt.',
      lessons: [
        {
          title: 'N2.1 — Good OO design & SOLID basics|||N2.1 — Thiết kế OO tốt & SOLID cơ bản',
          slug: 'pro192-n2-1-solid',
          type: 'VIDEO',
          description: 'Không chỉ code chạy — code dễ đọc, dễ sửa, dễ mở rộng.',
          content: `
<div class="ml-en">
<span class="eyebrow">Advanced 2 · Lesson N2.1</span>
<h2>Beyond "it works" — designing well</h2>
<p class="lead">PRO192 teaches you the OOP mechanics. This capstone is about using them <em>well</em> — the difference between code that merely runs and code a team can live with for years. The industry summarizes good OO design as <strong>SOLID</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">S — Single Responsibility</div><div class="lz-ld">A class should do one thing. A Student class holds student data; it should not also print reports or save files.</div></div>
  <div class="lz-layer"><div class="lz-lt">O — Open/Closed</div><div class="lz-ld">Open to extension, closed to modification. Add new behavior with new subclasses/implementations, not by rewriting existing code.</div></div>
  <div class="lz-layer"><div class="lz-lt">L — Liskov Substitution</div><div class="lz-ld">A subclass should work anywhere its parent is expected, without surprises.</div></div>
  <div class="lz-layer"><div class="lz-lt">I — Interface Segregation</div><div class="lz-ld">Prefer small, focused interfaces over one giant one.</div></div>
  <div class="lz-layer"><div class="lz-lt">D — Dependency Inversion</div><div class="lz-ld">Depend on interfaces (abstractions), not concrete classes — so parts can be swapped.</div></div>
</div>
<p>You have already met the tools these principles rely on: encapsulation (hide details), inheritance and interfaces (extend without modifying), polymorphism (swap implementations). SOLID is just the wisdom of <em>when</em> to use each.</p>
<div class="callout ok">A practical habit from day one: give each class one clear job, keep fields private, program to interfaces where things might change, and prefer composition (has-a) over deep inheritance trees. These small choices are the difference between a maintainable assignment and a tangled mess.</div>
<div class="note-ct">Congratulations on completing PRO192. You have made the leap from writing procedures to designing systems of cooperating objects — with encapsulation, inheritance, polymorphism, abstraction, exceptions, collections and file I/O. This mindset carries directly into LAB211, PRJ301 and every software project ahead.</div>
</div>
<div class="ml-vi">
<span class="eyebrow">Nâng cao 2 · Bài N2.1</span>
<h2>Vượt ra ngoài "nó chạy" — thiết kế cho tốt</h2>
<p class="lead">PRO192 dạy bạn cơ chế OOP. Bài tổng kết này là về dùng chúng <em>cho tốt</em> — khác biệt giữa code chỉ chạy và code mà một đội có thể sống chung nhiều năm. Ngành tóm tắt thiết kế OO tốt bằng <strong>SOLID</strong>.</p>
<div class="lz-stack">
  <div class="lz-layer"><div class="lz-lt">S — Trách nhiệm đơn (Single Responsibility)</div><div class="lz-ld">Một lớp nên làm một việc. Lớp Student giữ dữ liệu sinh viên; nó không nên vừa in báo cáo vừa lưu tệp.</div></div>
  <div class="lz-layer"><div class="lz-lt">O — Mở/Đóng (Open/Closed)</div><div class="lz-ld">Mở để mở rộng, đóng để sửa đổi. Thêm hành vi mới bằng lớp con/cài đặt mới, không phải viết lại code cũ.</div></div>
  <div class="lz-layer"><div class="lz-lt">L — Thay thế Liskov</div><div class="lz-ld">Một lớp con nên hoạt động ở bất cứ đâu lớp cha được mong đợi, không gây bất ngờ.</div></div>
  <div class="lz-layer"><div class="lz-lt">I — Tách interface</div><div class="lz-ld">Ưu tiên nhiều interface nhỏ, tập trung hơn một cái khổng lồ.</div></div>
  <div class="lz-layer"><div class="lz-lt">D — Đảo ngược phụ thuộc</div><div class="lz-ld">Phụ thuộc vào interface (trừu tượng), không phải lớp cụ thể — để các phần thay được.</div></div>
</div>
<p>Bạn đã gặp các công cụ mà những nguyên tắc này dựa vào: đóng gói (giấu chi tiết), kế thừa và interface (mở rộng không sửa đổi), đa hình (thay cài đặt). SOLID chỉ là trí khôn về <em>khi nào</em> dùng mỗi cái.</p>
<div class="callout ok">Một thói quen thực tế từ ngày đầu: cho mỗi lớp một việc rõ, giữ trường private, lập trình theo interface ở nơi có thể thay đổi, và ưu tiên kết hợp (has-a) hơn cây kế thừa sâu. Những lựa chọn nhỏ này là khác biệt giữa một bài dễ bảo trì và một mớ bòng bong.</div>
<div class="note-ct">Chúc mừng bạn hoàn thành PRO192. Bạn đã thực hiện bước nhảy từ viết thủ tục sang thiết kế hệ thống các đối tượng hợp tác — với đóng gói, kế thừa, đa hình, trừu tượng, ngoại lệ, collections và đọc/ghi tệp. Tư duy này đi thẳng vào LAB211, PRJ301 và mọi dự án phần mềm phía trước.</div>
</div>
`,
        },
      ],
    },
  ],
};
